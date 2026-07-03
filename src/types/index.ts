export type CEFRLevel = 'A0' | 'A1' | 'A2' | 'B1' | 'B2'

export type Language = 'de' | 'en' | 'fa'

export type ExerciseType =
  | 'multiple-choice'
  | 'fill-blank'
  | 'matching'
  | 'sentence-builder'
  | 'listening'
  | 'dictation'
  | 'speaking'
  | 'translation'
  | 'reading'
  | 'dialogue'
  | 'writing'

export type QuestionType = 'vocabulary' | 'grammar' | 'listening' | 'reading' | 'speaking' | 'writing'

export type Difficulty = 'beginner' | 'intermediate' | 'advanced'

export type Gender = 'der' | 'die' | 'das'

export interface User {
  id: string
  email: string
  created_at: string
  display_name: string
  avatar_url: string | null
  native_language: Language
  target_language: 'de'
  current_level: CEFRLevel
  daily_goal_minutes: number
  xp: number
  coins: number
  streak_days: number
  last_active: string
  onboarding_completed: boolean
  study_reminder_time: string | null
  theme: 'light' | 'dark' | 'system'
}

export interface Unit {
  id: string
  level: CEFRLevel
  number: number
  title_de: string
  title_en: string
  title_fa: string
  description_de: string
  description_en: string
  description_fa: string
  icon: string
  order: number
}

export interface Lesson {
  id: string
  unit_id: string
  number: number
  title_de: string
  title_en: string
  title_fa: string
  type: 'vocabulary' | 'grammar' | 'listening' | 'reading' | 'speaking' | 'writing' | 'review'
  order: number
  xp_reward: number
  estimated_minutes: number
  locked: boolean
  prerequisites: string[]
}

export interface LessonContent {
  id: string
  lesson_id: string
  order: number
  type: 'explanation' | 'example' | 'exercise' | 'vocabulary' | 'grammar' | 'audio' | 'quiz' | 'summary'
  content: Record<string, unknown>
}

export interface VocabularyItem {
  id: string
  german: string
  article: Gender
  plural: string
  ipa: string
  english: string
  persian: string
  example_sentence_de: string
  example_sentence_en: string
  example_sentence_fa: string
  difficulty: Difficulty
  tags: string[]
  frequency: number
  related_words: string[]
  synonyms: string[]
  antonyms: string[]
  memory_hint_de: string
  memory_hint_en: string
  memory_hint_fa: string
  image_url: string | null
  audio_url: string | null
  lesson_id: string | null
  level: CEFRLevel
}

export interface GrammarTopic {
  id: string
  title_de: string
  title_en: string
  title_fa: string
  level: CEFRLevel
  category: string
  explanation_de: string
  explanation_en: string
  explanation_fa: string
  rules: string[]
  examples: GrammarExample[]
  common_mistakes: CommonMistake[]
  order: number
}

export interface GrammarExample {
  sentence_de: string
  sentence_en: string
  sentence_fa: string
  explanation_de: string
  explanation_en: string
  explanation_fa: string
}

export interface CommonMistake {
  incorrect: string
  correct: string
  explanation_de: string
  explanation_en: string
  explanation_fa: string
}

export interface ReviewItem {
  id: string
  user_id: string
  vocabulary_id: string | null
  grammar_topic_id: string | null
  interval: number
  ease_factor: number
  repetitions: number
  next_review: string
  last_reviewed: string | null
  status: 'learning' | 'reviewing' | 'mastered'
  correct_streak: number
}

export interface StudySession {
  id: string
  user_id: string
  started_at: string
  ended_at: string | null
  duration_minutes: number
  xp_earned: number
  coins_earned: number
  lessons_completed: number
  exercises_completed: number
  correct_answers: number
  total_answers: number
}

export interface Achievement {
  id: string
  user_id: string
  achievement_key: string
  title_de: string
  title_en: string
  title_fa: string
  description_de: string
  description_en: string
  description_fa: string
  icon: string
  unlocked_at: string
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
}

export interface Challenge {
  id: string
  type: 'daily' | 'weekly' | 'monthly'
  title_de: string
  title_en: string
  title_fa: string
  description_de: string
  description_en: string
  description_fa: string
  xp_reward: number
  coins_reward: number
  requirement_type: string
  requirement_count: number
  starts_at: string
  ends_at: string
}

export interface UserChallenge {
  id: string
  user_id: string
  challenge_id: string
  progress: number
  completed: boolean
  completed_at: string | null
}

export interface AiConversation {
  id: string
  user_id: string
  topic: string
  level: CEFRLevel
  messages: AiMessage[]
  started_at: string
  ended_at: string | null
}

export interface AiMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp: string
  corrections?: Correction[]
}

export interface Correction {
  original: string
  corrected: string
  explanation_de: string
  explanation_en: string
  explanation_fa: string
}

export interface UserProgress {
  id: string
  user_id: string
  lesson_id: string
  completed: boolean
  score: number | null
  xp_earned: number
  started_at: string
  completed_at: string | null
  attempts: number
}

export interface UserVocabularyProgress {
  id: string
  user_id: string
  vocabulary_id: string
  mastered: boolean
  times_seen: number
  times_correct: number
  times_incorrect: number
  last_seen: string
  favorited: boolean
  difficult: boolean
  notes: string | null
}

export interface Exercise {
  id: string
  lesson_id: string
  type: ExerciseType
  question_de: string
  question_en: string
  question_fa: string
  options: string[] | null
  correct_answer: string
  explanation_de: string
  explanation_en: string
  explanation_fa: string
  difficulty: Difficulty
  audio_url: string | null
  image_url: string | null
  order: number
}

export interface Quiz {
  id: string
  lesson_id: string
  title_de: string
  title_en: string
  title_fa: string
  questions: QuizQuestion[]
  passing_score: number
  xp_reward: number
  time_limit_minutes: number | null
}

export interface QuizQuestion {
  id: string
  quiz_id: string
  type: QuestionType
  question_de: string
  question_en: string
  question_fa: string
  options: string[]
  correct_answer: string
  explanation_de: string
  explanation_en: string
  explanation_fa: string
}

export interface UserStatistics {
  total_study_minutes: number
  total_xp: number
  total_coins: number
  lessons_completed: number
  exercises_completed: number
  vocabulary_learned: number
  grammar_topics_mastered: number
  listening_accuracy: number
  speaking_accuracy: number
  quiz_average_score: number
  current_streak: number
  longest_streak: number
  achievements_unlocked: number
  challenges_completed: number
  weak_topics: string[]
  strong_topics: string[]
}

export interface StudyPlan {
  id: string
  user_id: string
  target_level: CEFRLevel
  daily_minutes: number
  target_date: string
  reason: string
  generated_roadmap: RoadmapItem[]
  created_at: string
}

export interface RoadmapItem {
  week: number
  focus: string
  topics: string[]
  estimated_minutes: number
}

export interface NotificationPreference {
  study_reminder: boolean
  streak_reminder: boolean
  daily_challenge: boolean
  achievement_unlock: boolean
  review_reminder: boolean
  study_time: string
  timezone: string
  sound_enabled: boolean
  vibration_enabled: boolean
}

export interface DictationResult {
  user_text: string
  correct_text: string
  accuracy: number
  errors: DictationError[]
}

export interface DictationError {
  expected: string
  received: string
  position: number
  type: 'missing' | 'extra' | 'incorrect' | 'ordering'
}

export interface SpeakingResult {
  transcript: string
  accuracy: number
  fluency: number
  confidence: number
  suggestions: string[]
  pronunciation_errors: string[]
}

export interface WritingFeedback {
  score: number
  grammar_errors: WritingError[]
  vocabulary_suggestions: string[]
  style_notes: string[]
  overall_feedback: string
  corrected_version: string
}

export interface WritingError {
  original: string
  corrected: string
  explanation: string
  type: 'grammar' | 'spelling' | 'word_order' | 'vocabulary' | 'punctuation'
}
