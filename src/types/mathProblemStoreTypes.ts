export interface MultipleChoiceOption {
  id: string
  text?: string
  pictureUrl?: string
  icon?: string
  isTheCorrectOption?: boolean
  wasTheSubmittedOption?: boolean
}
export interface MultipleChoiceExplanation {
  text: string
}

export interface MultipleChoiceQuestion {
  text: string
}

export interface MultipleChoiceProblemType {
  id: string
  question: MultipleChoiceQuestion
  options: MultipleChoiceOption[]
  explanation?: MultipleChoiceExplanation
  userAnswer?: MultipleChoiceOption
  type: 'multiple-choice'
}

export interface MathProblemStoreState {
  problems: MultipleChoiceProblemType[]
  currentProblemIndex: number
  isComplete: boolean
}

export function isMathProblem(problem: any): problem is MultipleChoiceProblemType {
  if (!problem)
    return false
  return problem && typeof problem.id === 'string' && typeof problem.question === 'string' && typeof problem.type === 'string'
}
export function isMathProblemArray(problems: any): problems is MultipleChoiceProblemType[] {
  if (!problems || !Array.isArray(problems))
    return false
  return problems.every(isMathProblem)
}

