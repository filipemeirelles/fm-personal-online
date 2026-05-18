export type UserRole = "trainer" | "student";

export interface User {
  id: string;
  email: string;
  role: UserRole;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface Trainer {
  id: string;
  user_id: string;
  bio: string | null;
  created_at: string;
  updated_at: string;
}

export interface Student {
  id: string;
  user_id: string;
  trainer_id: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface WorkoutPlan {
  id: string;
  trainer_id: string;
  student_id: string;
  name: string;
  description: string | null;
  active: boolean;
  starts_at: string | null;
  ends_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Exercise {
  id: string;
  workout_plan_id: string;
  name: string;
  sets: number | null;
  reps: string | null;
  load: string | null;
  rest: string | null;
  notes: string | null;
  video_url: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface WorkoutLog {
  id: string;
  student_id: string;
  workout_plan_id: string;
  completed_at: string;
  notes: string | null;
  created_at: string;
}

export interface ExerciseLog {
  id: string;
  workout_log_id: string;
  exercise_id: string;
  actual_load: string | null;
  actual_reps: string | null;
  notes: string | null;
  created_at: string;
}
