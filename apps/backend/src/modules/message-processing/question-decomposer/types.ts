export interface SubQuestion {
  subQuestion: string
  priority: number
}

export interface DecompositionResult {
  canDecompose: boolean
  subQuestions: SubQuestion[]
}