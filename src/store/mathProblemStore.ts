import { defineStore } from 'pinia'
import type { MathProblemStoreState, MultipleChoiceExplanation, MultipleChoiceOption, MultipleChoiceProblemType, MultipleChoiceQuestion } from '~/types/mathProblemStoreTypes'
import { v4 as uuid } from 'uuid'


function makeOption(option: Omit<MultipleChoiceOption, 'id'> | string): MultipleChoiceOption {
  return typeof option === 'string'
    ? { id: uuid(), text: option }
    : {
        ...option,
        id: uuid(),
      }
}

function makeOptions(options: (Omit<MultipleChoiceOption, 'id'> | string)[]): MultipleChoiceOption[] {
  return options.map(option => makeOption(option))
}
function makeExplanation(explanation: string | MultipleChoiceExplanation): MultipleChoiceExplanation {
  return typeof explanation === 'string'
    ? { text: explanation }
    : explanation
}
function makeQuestion(question: string | MultipleChoiceQuestion): MultipleChoiceQuestion {
  return typeof question === 'string'
    ? { text: question }
    : question
}


const problems: MathProblemStoreState['problems'] = [
  {
    id: '1',
    question: 'What is 5 + 3?',
    options: (['7', '8', '9', '10']),
    correctAnswer: '8',
    explanation: 'Adding 5 and 3 equals 8',
  },
  {
    id: '2',
    question: 'What is 12 - 4?',
    options: (['6', '7', '8', '9']),
    correctAnswer: '8',
    explanation: 'Subtracting 4 from 12 equals 8',
  },
  {
    id: '3',
    question: 'What is 4 × 3?',
    options: (['10', '11', '12', '13']),
    correctAnswer: '12',
    explanation: 'Multiplying 4 by 3 equals 12',
  },
  {
    id: '4',
    question: 'What is 20 ÷ 5?',
    options: (['3', '4', '5', '6']),
    correctAnswer: '4',
    explanation: 'Dividing 20 by 5 equals 4',
  },
  {
    id: '5',
    question: 'What is 7 × 8?',
    options: (['48', '54', '56', '64']),
    correctAnswer: '56',
    explanation: 'Multiplying 7 by 8 equals 56',
  },
].map((problem) => {
  const fixedOptions = makeOptions(problem.options).map((option) => {
    if (option.text === problem.correctAnswer) {
      return {
        ...option,
        isTheCorrectOption: true,
      }
    }
    return option
  })
  const fixedExplanation = makeExplanation(problem.explanation)
  const fixedQuestion = makeQuestion(problem.question)

  return {
    ...problem,
    type: 'multiple-choice',
    options: fixedOptions,
    explanation: fixedExplanation,
    question: fixedQuestion,
  }
})


export const useMathProblemStore = defineStore('mathProblemStore', {
  state: (): MathProblemStoreState => ({
    problems,
    currentProblemIndex: 0,
    isComplete: false,
  }),

  getters: {
    getProblemById: state => (id: string) => state.problems.find(problem => problem.id === id),

    getCurrentProblem: state => state.problems[state.currentProblemIndex],
    getCorrectOptionForProblem: state => (problemId: string) => {
      const problem = state.problems.find(p => p.id === problemId)
      return problem?.options.find(option => option.isTheCorrectOption)
    },
    getAnsweredOptionForProblem: state => (problemId: string) => {
      const problem = state.problems.find(p => p.id === problemId)
      return problem?.options.find(option => option.wasTheSubmittedOption)
    },
    getIsProblemAnswered: state => (problemId: string) => {
      const problem = state.problems.find(p => p.id === problemId)
      const options = problem?.options || []
      return options.some(option => option.wasTheSubmittedOption) // check if any option was marked as the submitted option
    },
    getIsProblemCorrect(state) {
      return (problemId: string) => {
        const theProblem = state.problems.find(p => p.id === problemId)
        const userAnswered = this.getAnsweredOptionForProblem(problemId)
        const theCorrectOption = this.getCorrectOptionForProblem(problemId)

        if (theProblem && userAnswered && theCorrectOption) {
          return userAnswered.id === theCorrectOption.id // if ids are the same, then they chose the correct option id.
        }
        else {
          return false // if the problem is not found or no user answer, return false
        }
      }
    },
  },

  actions: {
    setOptionToWasTheSubmittedOption(problemId: string, optionId: string) {
      const problem = this.problems.find(p => p.id === problemId)
      const option = problem?.options.find(o => o.id === optionId)
      if (!problem || !option) {
        return
      }
      // Reset all options to not be the submitted option
      problem.options.forEach((o) => {
        o.wasTheSubmittedOption = false
      })
      // Set the selected option to be the submitted option
      option.wasTheSubmittedOption = true
    },

    submitAnswer(problemId: string, givenOptionId: string) {
      const problem = this.problems.find(p => p.id === problemId)
      const option = problem?.options.find(o => o.id === givenOptionId)
      if (!problem || !option) {
        return
      }
      this.setOptionToWasTheSubmittedOption(problemId, givenOptionId)
      // const isCorrect = option.isTheCorrectOption
    },

    resetProblems() {
      this.problems.forEach((problem) => {
        problem.options.forEach((option) => {
          option.wasTheSubmittedOption = false
        })
      })
      this.currentProblemIndex = 0
      this.isComplete = false
    },
    setProblems(problems: MultipleChoiceProblemType[]) {
      this.problems = problems
    },
    loadProblems(problems: MultipleChoiceProblemType[]) {
      this.problems = problems
      this.currentProblemIndex = 0
      this.isComplete = false
    },
  },
})
