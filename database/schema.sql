-- German Learn App - Complete PostgreSQL Schema
-- This schema supports A0-B2 German learning with spaced repetition,
-- AI tutor, gamification, and full analytics.

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ============================================================
-- USERS & AUTH
-- ============================================================

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  display_name TEXT NOT NULL DEFAULT '',
  avatar_url TEXT,
  native_language TEXT NOT NULL DEFAULT 'fa' CHECK (native_language IN ('fa', 'en', 'de')),
  target_language TEXT NOT NULL DEFAULT 'de',
  current_level TEXT NOT NULL DEFAULT 'A0' CHECK (current_level IN ('A0', 'A1', 'A2', 'B1', 'B2')),
  daily_goal_minutes INTEGER NOT NULL DEFAULT 15,
  xp BIGINT NOT NULL DEFAULT 0,
  coins BIGINT NOT NULL DEFAULT 0,
  streak_days INTEGER NOT NULL DEFAULT 0,
  longest_streak INTEGER NOT NULL DEFAULT 0,
  last_active_date DATE DEFAULT CURRENT_DATE,
  onboarding_completed BOOLEAN NOT NULL DEFAULT FALSE,
  study_reminder_time TIME,
  theme TEXT NOT NULL DEFAULT 'system' CHECK (theme IN ('light', 'dark', 'system')),
  notification_preferences JSONB DEFAULT '{
    "study_reminder": true,
    "streak_reminder": true,
    "daily_challenge": true,
    "achievement_unlock": true,
    "review_reminder": true,
    "study_time": "09:00",
    "timezone": "UTC",
    "sound_enabled": true,
    "vibration_enabled": true
  }'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_level ON users(current_level);

-- ============================================================
-- STUDY PLAN
-- ============================================================

CREATE TABLE study_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  target_level TEXT NOT NULL CHECK (target_level IN ('A0', 'A1', 'A2', 'B1', 'B2')),
  daily_minutes INTEGER NOT NULL,
  target_date DATE NOT NULL,
  reason TEXT NOT NULL DEFAULT '',
  generated_roadmap JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_study_plans_user ON study_plans(user_id);

-- ============================================================
-- CURRICULUM: LEVELS, UNITS, LESSONS
-- ============================================================

CREATE TABLE levels (
  id TEXT PRIMARY KEY CHECK (id IN ('A0', 'A1', 'A2', 'B1', 'B2')),
  title_de TEXT NOT NULL,
  title_en TEXT NOT NULL,
  title_fa TEXT NOT NULL,
  description_de TEXT NOT NULL,
  description_en TEXT NOT NULL,
  description_fa TEXT NOT NULL,
  order_index INTEGER NOT NULL,
  total_xp BIGINT NOT NULL DEFAULT 0
);

CREATE TABLE units (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  level_id TEXT NOT NULL REFERENCES levels(id) ON DELETE CASCADE,
  number INTEGER NOT NULL,
  title_de TEXT NOT NULL,
  title_en TEXT NOT NULL,
  title_fa TEXT NOT NULL,
  description_de TEXT NOT NULL DEFAULT '',
  description_en TEXT NOT NULL DEFAULT '',
  description_fa TEXT NOT NULL DEFAULT '',
  icon TEXT NOT NULL DEFAULT 'book',
  order_index INTEGER NOT NULL,
  UNIQUE(level_id, number)
);

CREATE INDEX idx_units_level ON units(level_id);

CREATE TABLE lessons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  unit_id UUID NOT NULL REFERENCES units(id) ON DELETE CASCADE,
  number INTEGER NOT NULL,
  title_de TEXT NOT NULL,
  title_en TEXT NOT NULL,
  title_fa TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('vocabulary', 'grammar', 'listening', 'reading', 'speaking', 'writing', 'review', 'quiz', 'test')),
  order_index INTEGER NOT NULL,
  xp_reward INTEGER NOT NULL DEFAULT 10,
  coin_reward INTEGER NOT NULL DEFAULT 5,
  estimated_minutes INTEGER NOT NULL DEFAULT 10,
  prerequisites UUID[] DEFAULT '{}',
  UNIQUE(unit_id, number)
);

CREATE INDEX idx_lessons_unit ON lessons(unit_id);

-- ============================================================
-- LESSON CONTENT
-- ============================================================

CREATE TABLE lesson_contents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  order_index INTEGER NOT NULL,
  content_type TEXT NOT NULL CHECK (content_type IN (
    'explanation', 'example', 'exercise', 'vocabulary_list',
    'grammar_rule', 'audio', 'video', 'image', 'quiz', 'summary', 'dialogue'
  )),
  content JSONB NOT NULL DEFAULT '{}'::jsonb,
  UNIQUE(lesson_id, order_index)
);

CREATE INDEX idx_lesson_contents_lesson ON lesson_contents(lesson_id);

-- ============================================================
-- VOCABULARY
-- ============================================================

CREATE TABLE vocabulary (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  german TEXT NOT NULL,
  article TEXT NOT NULL CHECK (article IN ('der', 'die', 'das')),
  plural TEXT NOT NULL DEFAULT '',
  ipa TEXT NOT NULL DEFAULT '',
  english TEXT NOT NULL,
  persian TEXT NOT NULL,
  example_sentence_de TEXT NOT NULL DEFAULT '',
  example_sentence_en TEXT NOT NULL DEFAULT '',
  example_sentence_fa TEXT NOT NULL DEFAULT '',
  difficulty TEXT NOT NULL DEFAULT 'beginner' CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  tags TEXT[] DEFAULT '{}',
  frequency INTEGER NOT NULL DEFAULT 0,
  related_words TEXT[] DEFAULT '{}',
  synonyms TEXT[] DEFAULT '{}',
  antonyms TEXT[] DEFAULT '{}',
  memory_hint_de TEXT DEFAULT '',
  memory_hint_en TEXT DEFAULT '',
  memory_hint_fa TEXT DEFAULT '',
  image_url TEXT,
  audio_url TEXT,
  lesson_id UUID REFERENCES lessons(id) ON DELETE SET NULL,
  level TEXT NOT NULL CHECK (level IN ('A0', 'A1', 'A2', 'B1', 'B2')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_vocabulary_level ON vocabulary(level);
CREATE INDEX idx_vocabulary_lesson ON vocabulary(lesson_id);
CREATE INDEX idx_vocabulary_german ON vocabulary(german);
CREATE INDEX idx_vocabulary_tags ON vocabulary USING GIN(tags);
CREATE INDEX idx_vocabulary_trgm ON vocabulary USING GIN(german gin_trgm_ops);

-- ============================================================
-- GRAMMAR
-- ============================================================

CREATE TABLE grammar_topics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title_de TEXT NOT NULL,
  title_en TEXT NOT NULL,
  title_fa TEXT NOT NULL,
  level TEXT NOT NULL REFERENCES levels(id),
  category TEXT NOT NULL,
  explanation_de TEXT NOT NULL DEFAULT '',
  explanation_en TEXT NOT NULL DEFAULT '',
  explanation_fa TEXT NOT NULL DEFAULT '',
  rules JSONB NOT NULL DEFAULT '[]'::jsonb,
  examples JSONB NOT NULL DEFAULT '[]'::jsonb,
  common_mistakes JSONB DEFAULT '[]'::jsonb,
  order_index INTEGER NOT NULL,
  lesson_id UUID REFERENCES lessons(id) ON DELETE SET NULL
);

CREATE INDEX idx_grammar_level ON grammar_topics(level);
CREATE INDEX idx_grammar_category ON grammar_topics(category);

-- ============================================================
-- EXERCISES
-- ============================================================

CREATE TABLE exercises (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN (
    'multiple-choice', 'fill-blank', 'matching', 'sentence-builder',
    'listening', 'dictation', 'speaking', 'translation',
    'reading', 'dialogue', 'writing'
  )),
  question_de TEXT NOT NULL,
  question_en TEXT NOT NULL,
  question_fa TEXT NOT NULL,
  options JSONB,
  correct_answer TEXT NOT NULL,
  explanation_de TEXT NOT NULL DEFAULT '',
  explanation_en TEXT NOT NULL DEFAULT '',
  explanation_fa TEXT NOT NULL DEFAULT '',
  difficulty TEXT NOT NULL DEFAULT 'beginner' CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  audio_url TEXT,
  image_url TEXT,
  order_index INTEGER NOT NULL,
  UNIQUE(lesson_id, order_index)
);

CREATE INDEX idx_exercises_lesson ON exercises(lesson_id);

-- ============================================================
-- QUIZZES
-- ============================================================

CREATE TABLE quizzes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  title_de TEXT NOT NULL,
  title_en TEXT NOT NULL,
  title_fa TEXT NOT NULL,
  passing_score INTEGER NOT NULL DEFAULT 70,
  xp_reward INTEGER NOT NULL DEFAULT 50,
  time_limit_minutes INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_quizzes_lesson ON quizzes(lesson_id);

CREATE TABLE quiz_questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  quiz_id UUID NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('vocabulary', 'grammar', 'listening', 'reading', 'speaking', 'writing')),
  question_de TEXT NOT NULL,
  question_en TEXT NOT NULL,
  question_fa TEXT NOT NULL,
  options TEXT[] NOT NULL DEFAULT '{}',
  correct_answer TEXT NOT NULL,
  explanation_de TEXT NOT NULL DEFAULT '',
  explanation_en TEXT NOT NULL DEFAULT '',
  explanation_fa TEXT NOT NULL DEFAULT '',
  order_index INTEGER NOT NULL,
  UNIQUE(quiz_id, order_index)
);

CREATE INDEX idx_quiz_questions_quiz ON quiz_questions(quiz_id);

-- ============================================================
-- USER PROGRESS
-- ============================================================

CREATE TABLE user_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  completed BOOLEAN NOT NULL DEFAULT FALSE,
  score INTEGER CHECK (score >= 0 AND score <= 100),
  xp_earned INTEGER NOT NULL DEFAULT 0,
  coins_earned INTEGER NOT NULL DEFAULT 0,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  attempts INTEGER NOT NULL DEFAULT 1,
  UNIQUE(user_id, lesson_id)
);

CREATE INDEX idx_user_progress_user ON user_progress(user_id);
CREATE INDEX idx_user_progress_completed ON user_progress(user_id, completed);

-- ============================================================
-- SPACED REPETITION (SM-2 Algorithm)
-- ============================================================

CREATE TABLE review_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  vocabulary_id UUID REFERENCES vocabulary(id) ON DELETE SET NULL,
  grammar_topic_id UUID REFERENCES grammar_topics(id) ON DELETE SET NULL,
  interval_days INTEGER NOT NULL DEFAULT 0,
  ease_factor DECIMAL NOT NULL DEFAULT 2.5,
  repetitions INTEGER NOT NULL DEFAULT 0,
  next_review_date DATE NOT NULL DEFAULT CURRENT_DATE,
  last_reviewed_at TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'learning' CHECK (status IN ('learning', 'reviewing', 'mastered')),
  correct_streak INTEGER NOT NULL DEFAULT 0,
  total_reviews INTEGER NOT NULL DEFAULT 0,
  total_correct INTEGER NOT NULL DEFAULT 0,
  total_incorrect INTEGER NOT NULL DEFAULT 0,
  average_response_time DECIMAL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT review_item_check CHECK (
    (vocabulary_id IS NOT NULL AND grammar_topic_id IS NULL) OR
    (vocabulary_id IS NULL AND grammar_topic_id IS NOT NULL)
  )
);

CREATE INDEX idx_review_items_user ON review_items(user_id);
CREATE INDEX idx_review_items_next_review ON review_items(user_id, next_review_date);
CREATE INDEX idx_review_items_status ON review_items(user_id, status);

-- ============================================================
-- USER VOCABULARY PROGRESS
-- ============================================================

CREATE TABLE user_vocabulary_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  vocabulary_id UUID NOT NULL REFERENCES vocabulary(id) ON DELETE CASCADE,
  mastered BOOLEAN NOT NULL DEFAULT FALSE,
  times_seen INTEGER NOT NULL DEFAULT 0,
  times_correct INTEGER NOT NULL DEFAULT 0,
  times_incorrect INTEGER NOT NULL DEFAULT 0,
  last_seen_at TIMESTAMPTZ DEFAULT NOW(),
  favorited BOOLEAN NOT NULL DEFAULT FALSE,
  difficult BOOLEAN NOT NULL DEFAULT FALSE,
  notes TEXT,
  UNIQUE(user_id, vocabulary_id)
);

CREATE INDEX idx_user_vocab_user ON user_vocabulary_progress(user_id);
CREATE INDEX idx_user_vocab_mastered ON user_vocabulary_progress(user_id, mastered);
CREATE INDEX idx_user_vocab_fav ON user_vocabulary_progress(user_id, favorited);
CREATE INDEX idx_user_vocab_difficult ON user_vocabulary_progress(user_id, difficult);

-- ============================================================
-- STUDY SESSIONS
-- ============================================================

CREATE TABLE study_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ended_at TIMESTAMPTZ,
  duration_seconds INTEGER DEFAULT 0,
  xp_earned INTEGER NOT NULL DEFAULT 0,
  coins_earned INTEGER NOT NULL DEFAULT 0,
  lessons_completed INTEGER NOT NULL DEFAULT 0,
  exercises_completed INTEGER NOT NULL DEFAULT 0,
  correct_answers INTEGER NOT NULL DEFAULT 0,
  total_answers INTEGER NOT NULL DEFAULT 0,
  type TEXT NOT NULL DEFAULT 'study' CHECK (type IN ('study', 'review', 'quiz', 'practice'))
);

CREATE INDEX idx_study_sessions_user ON study_sessions(user_id);
CREATE INDEX idx_study_sessions_date ON study_sessions(user_id, started_at);

-- ============================================================
-- ACHIEVEMENTS
-- ============================================================

CREATE TABLE achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT UNIQUE NOT NULL,
  title_de TEXT NOT NULL,
  title_en TEXT NOT NULL,
  title_fa TEXT NOT NULL,
  description_de TEXT NOT NULL,
  description_en TEXT NOT NULL,
  description_fa TEXT NOT NULL,
  icon TEXT NOT NULL,
  rarity TEXT NOT NULL DEFAULT 'common' CHECK (rarity IN ('common', 'rare', 'epic', 'legendary')),
  requirement_type TEXT NOT NULL,
  requirement_count INTEGER NOT NULL,
  xp_reward INTEGER NOT NULL DEFAULT 0,
  coin_reward INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE user_achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  achievement_key TEXT NOT NULL REFERENCES achievements(key) ON DELETE CASCADE,
  unlocked_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, achievement_key)
);

CREATE INDEX idx_user_achievements_user ON user_achievements(user_id);

-- ============================================================
-- CHALLENGES
-- ============================================================

CREATE TABLE challenges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type TEXT NOT NULL CHECK (type IN ('daily', 'weekly', 'monthly')),
  title_de TEXT NOT NULL,
  title_en TEXT NOT NULL,
  title_fa TEXT NOT NULL,
  description_de TEXT NOT NULL,
  description_en TEXT NOT NULL,
  description_fa TEXT NOT NULL,
  xp_reward INTEGER NOT NULL DEFAULT 0,
  coin_reward INTEGER NOT NULL DEFAULT 0,
  requirement_type TEXT NOT NULL,
  requirement_count INTEGER NOT NULL,
  starts_at TIMESTAMPTZ NOT NULL,
  ends_at TIMESTAMPTZ NOT NULL
);

CREATE INDEX idx_challenges_type ON challenges(type);
CREATE INDEX idx_challenges_active ON challenges(starts_at, ends_at);

CREATE TABLE user_challenges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  challenge_id UUID NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
  progress INTEGER NOT NULL DEFAULT 0,
  completed BOOLEAN NOT NULL DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  UNIQUE(user_id, challenge_id)
);

CREATE INDEX idx_user_challenges_user ON user_challenges(user_id);

-- ============================================================
-- AI TUTOR CONVERSATIONS
-- ============================================================

CREATE TABLE ai_conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  topic TEXT NOT NULL DEFAULT '',
  level TEXT NOT NULL DEFAULT 'A0',
  context JSONB DEFAULT '{}'::jsonb,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  ended_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT TRUE
);

CREATE INDEX idx_ai_conversations_user ON ai_conversations(user_id);

CREATE TABLE ai_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID NOT NULL REFERENCES ai_conversations(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  corrections JSONB DEFAULT '[]'::jsonb,
  grammar_notes JSONB DEFAULT '[]'::jsonb,
  vocabulary_highlights JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_ai_messages_conversation ON ai_messages(conversation_id);

-- ============================================================
-- STATISTICS / ANALYTICS
-- ============================================================

CREATE TABLE daily_statistics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  study_minutes INTEGER NOT NULL DEFAULT 0,
  xp_earned INTEGER NOT NULL DEFAULT 0,
  coins_earned INTEGER NOT NULL DEFAULT 0,
  lessons_completed INTEGER NOT NULL DEFAULT 0,
  exercises_completed INTEGER NOT NULL DEFAULT 0,
  correct_answers INTEGER NOT NULL DEFAULT 0,
  total_answers INTEGER NOT NULL DEFAULT 0,
  vocabulary_learned INTEGER NOT NULL DEFAULT 0,
  review_items_completed INTEGER NOT NULL DEFAULT 0,
  streak_continued BOOLEAN DEFAULT FALSE,
  UNIQUE(user_id, date)
);

CREATE INDEX idx_daily_stats_user ON daily_statistics(user_id);
CREATE INDEX idx_daily_stats_date ON daily_statistics(user_id, date);

-- ============================================================
-- READING CONTENT
-- ============================================================

CREATE TABLE reading_content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  level TEXT NOT NULL REFERENCES levels(id),
  title_de TEXT NOT NULL,
  title_en TEXT NOT NULL,
  title_fa TEXT NOT NULL,
  content_de TEXT NOT NULL,
  content_en TEXT NOT NULL,
  content_fa TEXT NOT NULL,
  vocabulary_highlighted JSONB DEFAULT '[]'::jsonb,
  questions JSONB DEFAULT '[]'::jsonb,
  audio_url TEXT,
  word_count INTEGER NOT NULL DEFAULT 0,
  order_index INTEGER NOT NULL,
  lesson_id UUID REFERENCES lessons(id) ON DELETE SET NULL
);

CREATE INDEX idx_reading_level ON reading_content(level);

-- ============================================================
-- LISTENING CONTENT
-- ============================================================

CREATE TABLE listening_content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  level TEXT NOT NULL REFERENCES levels(id),
  title_de TEXT NOT NULL,
  title_en TEXT NOT NULL,
  title_fa TEXT NOT NULL,
  transcript_de TEXT NOT NULL,
  transcript_en TEXT NOT NULL,
  transcript_fa TEXT NOT NULL,
  audio_url_normal TEXT NOT NULL,
  audio_url_slow TEXT,
  duration_seconds INTEGER NOT NULL DEFAULT 0,
  vocabulary_highlighted JSONB DEFAULT '[]'::jsonb,
  comprehension_questions JSONB DEFAULT '[]'::jsonb,
  order_index INTEGER NOT NULL,
  lesson_id UUID REFERENCES lessons(id) ON DELETE SET NULL
);

CREATE INDEX idx_listening_level ON listening_content(level);

-- ============================================================
-- SPEAKING EXERCISES
-- ============================================================

CREATE TABLE speaking_exercises (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  prompt_de TEXT NOT NULL,
  prompt_en TEXT NOT NULL,
  prompt_fa TEXT NOT NULL,
  target_phrase_de TEXT NOT NULL,
  expected_answer TEXT NOT NULL,
  hints TEXT[] DEFAULT '{}',
  difficulty TEXT NOT NULL DEFAULT 'beginner',
  audio_url TEXT,
  order_index INTEGER NOT NULL
);

CREATE INDEX idx_speaking_lesson ON speaking_exercises(lesson_id);

-- ============================================================
-- WRITING SUBMISSIONS
-- ============================================================

CREATE TABLE writing_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES lessons(id) ON DELETE SET NULL,
  prompt TEXT NOT NULL,
  user_text TEXT NOT NULL,
  corrected_text TEXT,
  score INTEGER,
  feedback JSONB DEFAULT '{}'::jsonb,
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  reviewed BOOLEAN DEFAULT FALSE
);

CREATE INDEX idx_writing_user ON writing_submissions(user_id);

-- ============================================================
-- NOTIFICATIONS
-- ============================================================

CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN (
    'streak', 'achievement', 'challenge', 'reminder',
    'review', 'milestone', 'tip', 'welcome'
  )),
  title_de TEXT NOT NULL,
  title_en TEXT NOT NULL,
  title_fa TEXT NOT NULL,
  body_de TEXT NOT NULL,
  body_en TEXT NOT NULL,
  body_fa TEXT NOT NULL,
  data JSONB DEFAULT '{}'::jsonb,
  read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_notifications_user ON notifications(user_id, read);

-- ============================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================

-- Update user streak on daily activity
CREATE OR REPLACE FUNCTION update_streak()
RETURNS TRIGGER AS $$
DECLARE
  last_date DATE;
BEGIN
  SELECT last_active_date INTO last_date FROM users WHERE id = NEW.user_id;

  IF last_date IS NULL OR last_date < CURRENT_DATE - 1 THEN
    UPDATE users SET streak_days = 1, last_active_date = CURRENT_DATE WHERE id = NEW.user_id;
  ELSIF last_date = CURRENT_DATE - 1 THEN
    UPDATE users SET streak_days = streak_days + 1, last_active_date = CURRENT_DATE WHERE id = NEW.user_id;
    -- Update longest streak if needed
    UPDATE users SET longest_streak = GREATEST(longest_streak, streak_days)
    WHERE id = NEW.user_id AND streak_days > longest_streak;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_streak_on_study_session
  AFTER INSERT ON study_sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_streak();

-- Auto update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_study_plans_updated_at
  BEFORE UPDATE ON study_plans
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_vocabulary_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_statistics ENABLE ROW LEVEL SECURITY;
ALTER TABLE writing_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Users can only see their own data
CREATE POLICY user_isolation ON users
  USING (id = auth.uid());

CREATE POLICY user_data_isolation ON study_plans
  USING (user_id = auth.uid());

CREATE POLICY user_data_isolation ON user_progress
  USING (user_id = auth.uid());

CREATE POLICY user_data_isolation ON review_items
  USING (user_id = auth.uid());

CREATE POLICY user_data_isolation ON user_vocabulary_progress
  USING (user_id = auth.uid());

CREATE POLICY user_data_isolation ON study_sessions
  USING (user_id = auth.uid());

CREATE POLICY user_data_isolation ON user_achievements
  USING (user_id = auth.uid());

CREATE POLICY user_data_isolation ON user_challenges
  USING (user_id = auth.uid());

CREATE POLICY user_data_isolation ON ai_conversations
  USING (user_id = auth.uid());

CREATE POLICY user_data_isolation ON ai_messages
  USING (conversation_id IN (SELECT id FROM ai_conversations WHERE user_id = auth.uid()));

CREATE POLICY user_data_isolation ON daily_statistics
  USING (user_id = auth.uid());

CREATE POLICY user_data_isolation ON writing_submissions
  USING (user_id = auth.uid());

CREATE POLICY user_data_isolation ON notifications
  USING (user_id = auth.uid());

-- Seed data
INSERT INTO levels (id, title_de, title_en, title_fa, description_de, description_en, description_fa, order_index, total_xp) VALUES
  ('A0', 'Absolute Anfänger', 'Absolute Beginner', 'مبتدی مطلق', 'Keine Vorkenntnisse - starte bei Null', 'No prior knowledge - start from zero', 'بدون دانش قبلی - از صفر شروع کن', 0, 1000),
  ('A1', 'Anfänger', 'Beginner', 'مقدماتی', 'Einfache Alltagssituationen meistern', 'Master simple everyday situations', 'مسلط شدن بر موقعیت‌های روزمره ساده', 1, 2500),
  ('A2', 'Grundlegende Kenntnisse', 'Elementary', 'پایه', 'Sich in häufigen Situationen verständigen', 'Communicate in common situations', 'ارتباط در موقعیت‌های رایج', 2, 4000),
  ('B1', 'Fortgeschrittene Sprachverwendung', 'Intermediate', 'متوسط', 'Selbstständig in Alltag und Beruf kommunizieren', 'Communicate independently in daily life and work', 'ارتباط مستقل در زندگی روزمره و کار', 3, 6000),
  ('B2', 'Selbstständige Sprachverwendung', 'Upper Intermediate', 'فوق متوسط', 'Komplexe Texte verstehen und fließend kommunizieren', 'Understand complex texts and communicate fluently', 'درک متون پیچیده و ارتباط روان', 4, 10000);
