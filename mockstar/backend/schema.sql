-- Create pgcrypto extension if we need gen_random_uuid() for UUID generation (PG 13+ has it natively, but good for safety)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- USERS TABLE
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- PROFILES TABLE (1:1 with users)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    username VARCHAR(255) NOT NULL,
    focus_domain VARCHAR(255),
    core_skills TEXT,
    is_built BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- RESUMES TABLE (1:N with users)
CREATE TABLE IF NOT EXISTS resumes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    file_content TEXT,
    predicted_domain VARCHAR(255),
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- INTERVIEW SESSIONS TABLE (1:N with users)
CREATE TABLE IF NOT EXISTS interview_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    interview_type VARCHAR(50) NOT NULL, -- e.g. 'technical', 'behavioral', 'mixed'
    custom_role VARCHAR(255),
    difficulty VARCHAR(50) NOT NULL, -- e.g. 'easy', 'medium', 'hard'
    question_count INTEGER NOT NULL DEFAULT 5,
    focus_areas JSONB, -- e.g. ["React", "System Design"]
    score INTEGER, -- overall score (e.g. 85)
    transcript JSONB, -- list of chat messages: [{"role": "interviewer", "text": "...", "time": "10:15 AM"}, ...]
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- INDEXES FOR SPEED
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_resumes_user_id ON resumes(user_id);
CREATE INDEX IF NOT EXISTS idx_interview_sessions_user_id ON interview_sessions(user_id);

-- TRIGGER FOR UPDATING updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_modtime
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_profiles_modtime
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_interview_sessions_modtime
    BEFORE UPDATE ON interview_sessions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
