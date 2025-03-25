import { isMathProblem, isMathProblemArray } from '~/types/mathProblemStoreTypes'

export function defaultMathProblemGrading(problem: unknown, answer: string | string[]) {
  if (!problem)
    return false
  if (!isMathProblem(problem) || isMathProblemArray(problem))
    return false

  let isCorrect = false
  if (Array.isArray(problem.correctAnswer) && Array.isArray(answer)) {
    isCorrect = problem.correctAnswer.length === answer.length && problem.correctAnswer.every(a => answer.includes(a))
  }
  else {
    isCorrect = problem.correctAnswer === answer
  }
  return isCorrect
}

