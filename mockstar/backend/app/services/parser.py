import pdfplumber
import io
import re
from typing import Dict, List, Any

# A predefined list of common tech skills to extract from the parsed text
TECH_SKILLS_DB = [
    "react", "vue", "angular", "svelte", "next.js", "nextjs", "nuxt", "gatsby",
    "javascript", "typescript", "html", "css", "sass", "less", "tailwind", "bootstrap",
    "node.js", "nodejs", "express", "koa", "nest.js", "nestjs", "fastapi", "django",
    "flask", "spring", "springboot", "java", "python", "go", "golang", "rust", "c++", "c#",
    "postgresql", "postgres", "mysql", "mongodb", "sqlite", "redis", "elasticsearch",
    "docker", "kubernetes", "aws", "gcp", "azure", "ci/cd", "git", "github", "graphql",
    "rest api", "microservices", "machine learning", "deep learning", "tensorflow", "pytorch",
    "pandas", "numpy", "scikit-learn", "data science", "swift", "kotlin", "flutter", "react native"
]

class ResumeParser:
    @staticmethod
    def extract_text_from_pdf(pdf_bytes: bytes) -> str:
        """
        Parses a PDF file from a byte stream using pdfplumber and returns plain text.
        """
        full_text = []
        try:
            with pdfplumber.open(io.BytesIO(pdf_bytes)) as pdf:
                for page in pdf.pages:
                    text = page.extract_text()
                    if text:
                        full_text.append(text)
            return "\n".join(full_text)
        except Exception as e:
            print(f"Error parsing PDF: {e}")
            raise ValueError(f"Could not parse PDF file: {e}")

    @staticmethod
    def extract_email(text: str) -> str:
        """
        Extracts the first email address found in the text using regex.
        """
        email_pattern = r"[\w\.-]+@[\w\.-]+\.\w+"
        match = re.search(email_pattern, text)
        return match.group(0) if match else ""

    @staticmethod
    def extract_skills(text: str) -> List[str]:
        """
        Scans the text for occurrences of predefined technical skills.
        """
        text_lower = text.lower()
        extracted = []
        for skill in TECH_SKILLS_DB:
            # Match boundary for skills (e.g. \bpython\b)
            # Escaping special characters in skills like c++, c#
            escaped_skill = re.escape(skill)
            pattern = rf"\b{escaped_skill}\b"
            if re.search(pattern, text_lower):
                extracted.append(skill)
        return list(set(extracted))

    def parse(self, pdf_bytes: bytes) -> Dict[str, Any]:
        """
        Performs full parsing on the PDF bytes: extracts text, email, and skills.
        """
        text = self.extract_text_from_pdf(pdf_bytes)
        email = self.extract_email(text)
        skills = self.extract_skills(text)
        
        return {
            "text": text,
            "email": email,
            "skills": skills
        }

# Singleton instance
resume_parser = ResumeParser()
