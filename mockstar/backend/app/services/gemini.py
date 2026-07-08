import json
from typing import List, Dict, Any, Optional
from pydantic import BaseModel
from google import genai
from google.genai import types
from app.config import settings

# Structured output Pydantic schemas
class QuestionList(BaseModel):
    questions: List[str]

class InterviewEvaluation(BaseModel):
    score: int
    feedback: str
    strengths: List[str]
    weaknesses: List[str]


# Fallback/Mock Questions Bank in case Gemini API is not configured or fails
MOCK_QUESTIONS = {
    "technical": [
        "What is the difference between synchronous and asynchronous operations?",
        "Can you explain how indexes improve search performance in a PostgreSQL database?",
        "How do you handle state management across components in a complex web application?",
        "Describe a design pattern you find useful and how you've implemented it.",
        "What are some key strategies for optimizing web application loading performance?"
    ],
    "behavioral": [
        "Tell me about a time you had a conflict with a teammate. How did you resolve it?",
        "Describe a challenging technical problem you solved recently and your approach.",
        "How do you prioritize your tasks when working on multiple projects with tight deadlines?",
        "Tell me about a time you failed to meet expectations. What did you learn from it?",
        "How do you stay up-to-date with new technologies and frameworks?"
    ],
    "mixed": [
        "What is the difference between a GET and POST request in REST APIs?",
        "Describe a time you had to adapt quickly to a major shift in project requirements.",
        "How do you approach database schema normalization vs denormalization?",
        "How do you handle constructive criticism or code review feedback from peers?"
    ]
}

class GeminiService:
    def __init__(self):
        self.client = None
        self.model_name = "gemini-2.5-flash"
        self._init_client()

    def _init_client(self):
        """Initializes the Google GenAI client if the API key is present."""
        if settings.GEMINI_API_KEY and settings.GEMINI_API_KEY != "your_gemini_api_key_here":
            try:
                self.client = genai.Client(api_key=settings.GEMINI_API_KEY)
                print("Gemini API client initialized successfully.")
            except Exception as e:
                print(f"Error initializing Gemini client: {e}")
        else:
            print("Gemini API key not configured. Mock responses will be used.")

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
        Falls back to mock questions if Gemini is disabled or errors out.
        """
        # Formulate fallback if client is not configured
        if not self.client:
            print("Gemini: Using mock questions fallback (Client not initialized).")
            import random
            pool = MOCK_QUESTIONS.get(interview_type.lower(), MOCK_QUESTIONS["mixed"])
            return random.sample(pool, min(question_count, len(pool)))

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
            # Generate structured response using Pydantic schema
            response = self.client.models.generate_content(
                model=self.model_name,
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                    response_schema=QuestionList,
                    temperature=0.7,
                ),
            )
            
            # Parse response text
            data = json.loads(response.text)
            return data.get("questions", [])
            
        except Exception as e:
            print(f"Gemini error during question generation: {e}. Falling back to mock questions.")
            import random
            pool = MOCK_QUESTIONS.get(interview_type.lower(), MOCK_QUESTIONS["mixed"])
            return random.sample(pool, min(question_count, len(pool)))

    def evaluate_interview(self, transcript: List[Dict[str, Any]], focus_domain: Optional[str] = None) -> Dict[str, Any]:
        """
        Evaluates a mock interview transcript. Computes a grade (0-100) and extracts key strengths/weaknesses.
        Falls back to computed scores if Gemini is disabled or errors out.
        """
        # Formulate fallback if client is not configured
        if not self.client:
            print("Gemini: Using calculated evaluation fallback (Client not initialized).")
            # Calculate mock score based on transcript length as in frontend logic
            cand_msgs = [m for m in transcript if m.get("role") == "candidate"]
            score = min(65 + len(cand_msgs) * 5, 95)
            return {
                "score": score,
                "feedback": "This is a default evaluation feedback. Please configure a valid Gemini API key in the backend to enable detailed AI feedback.",
                "strengths": ["Answered all questions", "Good structure"],
                "weaknesses": ["Could provide deeper technical detail in answers"]
            }

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
            # Generate structured response using Pydantic schema
            response = self.client.models.generate_content(
                model=self.model_name,
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                    response_schema=InterviewEvaluation,
                    temperature=0.2, # Lower temperature for analytical evaluation
                ),
            )
            
            data = json.loads(response.text)
            return {
                "score": data.get("score", 70),
                "feedback": data.get("feedback", ""),
                "strengths": data.get("strengths", []),
                "weaknesses": data.get("weaknesses", [])
            }
            
        except Exception as e:
            print(f"Gemini error during evaluation: {e}. Falling back to default scoring.")
            cand_msgs = [m for m in transcript if m.get("role") == "candidate"]
            score = min(65 + len(cand_msgs) * 5, 95)
            return {
                "score": score,
                "feedback": f"An error occurred during AI evaluation: {e}",
                "strengths": ["Completed the session"],
                "weaknesses": ["Unable to fetch detailed AI analysis"]
            }

# Singleton instance
gemini_service = GeminiService()
