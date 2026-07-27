import json
import time
from typing import List, Dict, Any, Optional
from pydantic import BaseModel
from google import genai
from google.genai import types
from app.config import settings

# Gemini's own client already retries transient errors internally, but it can
# still give up during real demand spikes. A couple of extra retries here
# (with backoff) smooths over short-lived 503 UNAVAILABLE / 429 RESOURCE_EXHAUSTED
# blips without masking genuine failures (bad key, bad model, bad request).
_TRANSIENT_STATUS_CODES = {429, 500, 503}


def _call_with_retry(fn, *, max_attempts: int = 5, base_delay: float = 2.0):
    last_err = None
    for attempt in range(1, max_attempts + 1):
        try:
            return fn()
        except Exception as e:
            code = getattr(e, "code", None) or getattr(e, "status_code", None)
            is_transient = code in _TRANSIENT_STATUS_CODES or "UNAVAILABLE" in str(e) or "RESOURCE_EXHAUSTED" in str(e)
            last_err = e
            if not is_transient or attempt == max_attempts:
                raise
            wait = base_delay * (2 ** (attempt - 1))
            print(f"Gemini transient error (attempt {attempt}/{max_attempts}): {e}. Retrying in {wait:.1f}s...")
            time.sleep(wait)
    raise last_err


class GeminiNotConfiguredError(RuntimeError):
    """Raised when Gemini is required but the API key/client isn't set up."""


class GeminiRequestError(RuntimeError):
    """Raised when a Gemini API call fails."""

# Structured output Pydantic schemas
class QuestionList(BaseModel):
    questions: List[str]

class InterviewEvaluation(BaseModel):
    score: int
    feedback: str
    strengths: List[str]
    weaknesses: List[str]


class GeminiService:
    def __init__(self):
        self.client = None
        # gemini-2.5-flash is blocked for new API keys/projects as of mid-2026
        # (and fully shuts down for everyone on Oct 16, 2026). Using the
        # current stable GA flash model instead.
        self.model_name = "gemini-3.5-flash"
        self.init_error = None
        self._init_client()

    def _init_client(self):
        """Initializes the Google GenAI client if the API key is present."""
        if settings.GEMINI_API_KEY and settings.GEMINI_API_KEY != "your_gemini_api_key_here":
            try:
                self.client = genai.Client(api_key=settings.GEMINI_API_KEY)
                print("Gemini API client initialized successfully.")
            except Exception as e:
                self.init_error = str(e)
                print(f"ERROR initializing Gemini client: {e}")
        else:
            self.init_error = "GEMINI_API_KEY is not set (or is still the placeholder value)."
            print(f"ERROR: {self.init_error} Set a real key in .env.")

    def generate_questions(
        self,
        interview_type: str,
        difficulty: str,
        focus_areas: Optional[List[str]],
        question_count: int,
        resume_text: Optional[str] = None
    ) -> List[str]:
        """
        Generates custom interview questions based on the candidate's setup and resume.
        """
        # Client not configured: fail loudly
        if not self.client:
            raise GeminiNotConfiguredError(
                f"Gemini client is not configured ({self.init_error}). "
                "Set a valid GEMINI_API_KEY in your .env file."
            )

        # Construct prompt
        focus_str = ", ".join(focus_areas) if focus_areas else "General Topics"
        prompt = (
            f"Generate exactly {question_count} interview questions for a {interview_type} mock interview.\n"
            f"Difficulty: {difficulty}\n"
            f"Focus areas: {focus_str}\n"
        )
        if resume_text:
            prompt += f"Incorporate relevant context or technical details from the candidate's resume: \n{resume_text}\n"
        
        prompt += "\nThe questions should be professional, realistic, and tailored to the profile. Return them in a structured list."

        try:
            # Generate structured response using Pydantic schema, with a
            # couple of retries for transient errors (e.g. 503 UNAVAILABLE
            # during demand spikes).
            response = _call_with_retry(lambda: self.client.models.generate_content(
                model=self.model_name,
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                    response_schema=QuestionList,
                    temperature=0.7,
                ),
            ))
            
            # Parse response text
            try:
                data = json.loads(response.text)
            except json.JSONDecodeError:
                # Fallback: attempt to strip markdown code blocks if present
                clean_text = response.text.strip().removeprefix("```json").removesuffix("```").strip()
                data = json.loads(clean_text)
                
            return data.get("questions", [])
            
        except Exception as e:
            print(f"ERROR: Gemini call failed during question generation: {e}")
            raise GeminiRequestError(f"Gemini question generation failed: {e}") from e

    def evaluate_interview(self, transcript: List[Dict[str, Any]], focus_domain: Optional[str] = None) -> Dict[str, Any]:
        """
        Evaluates a mock interview transcript. Computes a grade (0-100) and extracts key strengths/weaknesses.
        """
        # Client not configured: fail loudly
        if not self.client:
            raise GeminiNotConfiguredError(
                f"Gemini client is not configured ({self.init_error}). "
                "Set a valid GEMINI_API_KEY in your .env file."
            )

        # Convert transcript list to string representation
        transcript_str = ""
        for msg in transcript:
            role = "Interviewer" if msg.get("role") == "interviewer" else "Candidate"
            transcript_str += f"{role}: {msg.get('text')}\n\n"

        prompt = (
            f"Analyze the following mock interview transcript for a candidate specializing in {focus_domain or 'Software Engineering'}.\n"
            f"Rate the candidate's answers on a scale from 0 to 100, provide a high-level review, list 2-3 specific strengths, and 2-3 areas for improvement.\n\n"
            f"Transcript:\n{transcript_str}\n"
        )

        try:
            # Generate structured response using Pydantic schema, with a
            # couple of retries for transient errors (e.g. 503 UNAVAILABLE
            # during demand spikes).
            response = _call_with_retry(lambda: self.client.models.generate_content(
                model=self.model_name,
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                    response_schema=InterviewEvaluation,
                    temperature=0.2, # Lower temperature for analytical evaluation
                ),
            ))
            
            try:
                data = json.loads(response.text)
            except json.JSONDecodeError:
                # Fallback: attempt to strip markdown code blocks if present
                clean_text = response.text.strip().removeprefix("```json").removesuffix("```").strip()
                data = json.loads(clean_text)
                
            return {
                "score": data.get("score", 70),
                "feedback": data.get("feedback", ""),
                "strengths": data.get("strengths", []),
                "weaknesses": data.get("weaknesses", [])
            }
            
        except Exception as e:
            print(f"ERROR: Gemini call failed during evaluation: {e}")
            raise GeminiRequestError(f"Gemini evaluation failed: {e}") from e

# Singleton instance
gemini_service = GeminiService()
