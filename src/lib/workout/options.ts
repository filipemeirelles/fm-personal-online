// Listas fixas usadas nos dropdowns de prescrição de treinos.
// São propositalmente texto livre no banco; ampliar a lista não exige migration.

export const REPS_OPTIONS = [
  "6-8",
  "8-10",
  "8-12",
  "10-12",
  "12-15",
  "15-20",
  "Até a falha",
] as const;

export const REST_OPTIONS = ["30s", "45s", "60s", "90s", "2min", "3min"] as const;

export const MUSCLE_GROUPS = [
  "Peito",
  "Costas",
  "Ombros",
  "Bíceps",
  "Tríceps",
  "Antebraço",
  "Abdômen",
  "Quadríceps",
  "Posterior de coxa",
  "Glúteos",
  "Panturrilha",
  "Cardio",
  "Corpo inteiro",
] as const;

export const DEFAULT_REPS = "10-12";
export const DEFAULT_REST = "60s";
export const DEFAULT_SETS = 3;
