import { defineStore } from 'pinia'
import { v4 as uuidv4 } from 'uuid'

// Type definitions
export interface Concept {
  id: string
  name: string
  prompt?: string
  mustUnderstandTheseConcepts?: string[] // Store IDs rather than objects to avoid circular references
  alsoShowsKnowledgeOf?: string[]
  relatedConcepts?: string[]
}

export interface MistakeConcept {
  id: string
  name: string
  prompt?: string
  showsLackOfKnowledge?: string[] // Store IDs rather than objects
  relatedConcepts?: string[]
}

export interface ProblemOption {
  id: string
  text: string
  mistakeConceptIds: string[] // Concepts indicating the nature of the option (mistakes, correct concepts, etc.)
}

export interface Problem {
  id: string
  text: string
  conceptIds: string[] // Concepts associated with the overall problem context
  prompt: string // AI-specific prompt for this problem
  options: ProblemOption[]
  note: string // User-added notes or additional information
}

// Define the store state
export interface MathProblemCreationStoreState {
  concepts: Concept[]
  mistakeConcepts: MistakeConcept[]
  templates: Problem[]
  problems: Problem[]
  currentProblem: Problem | null
}

// Create the store
export const useMathProblemCreationStore = defineStore('mathProblemCreation', {
  state: (): MathProblemCreationStoreState => ({
    concepts: [],
    mistakeConcepts: [],
    templates: [],
    problems: [],
    currentProblem: null,
  }),

  getters: {
    // Get concept by ID
    getConcept: state => (id: string) => {
      return state.concepts.find(concept => concept.id === id)
    },

    // Get mistake concept by ID
    getMistakeConcept: state => (id: string) => {
      return state.mistakeConcepts.find(mistake => mistake.id === id)
    },

    // Get all concepts as an array of { id, name } objects for dropdowns
    getConceptsForDropdown: (state) => {
      return state.concepts.map(concept => ({
        id: concept.id,
        name: concept.name,
      }))
    },

    // Get all mistake concepts as an array of { id, name } objects for dropdowns
    getMistakeConceptsForDropdown: (state) => {
      return state.mistakeConcepts.map(mistake => ({
        id: mistake.id,
        name: mistake.name,
      }))
    },

    // Get templates for dropdown
    getTemplatesForDropdown: (state) => {
      return state.templates.map(template => ({
        id: template.id,
        name: template.text.substring(0, 30) + (template.text.length > 30 ? '...' : ''),
      }))
    },
  },

  actions: {
    // Create a new concept
    createConcept(
      name: string,
      prompt?: string,
      mustUnderstandTheseConcepts?: string[],
      alsoShowsKnowledgeOf?: string[],
      relatedConcepts?: string[],
    ) {
      const newConcept: Concept = {
        id: uuidv4(),
        name,
        prompt,
        mustUnderstandTheseConcepts,
        alsoShowsKnowledgeOf,
        relatedConcepts,
      }
      this.concepts.push(newConcept)
      return newConcept.id
    },

    // Update an existing concept
    updateConcept(
      id: string,
      name: string,
      prompt?: string,
      mustUnderstandTheseConcepts?: string[],
      alsoShowsKnowledgeOf?: string[],
      relatedConcepts?: string[],
    ) {
      const index = this.concepts.findIndex(concept => concept.id === id)
      if (index !== -1) {
        this.concepts[index] = {
          ...this.concepts[index],
          name,
          prompt,
          mustUnderstandTheseConcepts,
          alsoShowsKnowledgeOf,
          relatedConcepts,
        }
        return true
      }
      return false
    },

    // Delete a concept
    deleteConcept(id: string) {
      const index = this.concepts.findIndex(concept => concept.id === id)
      if (index !== -1) {
        this.concepts.splice(index, 1)
        return true
      }
      return false
    },

    // Create a new mistake concept
    createMistakeConcept(
      name: string,
      prompt?: string,
      showsLackOfKnowledge?: string[],
      relatedConcepts?: string[],
    ) {
      const newMistake: MistakeConcept = {
        id: uuidv4(),
        name,
        prompt,
        showsLackOfKnowledge,
        relatedConcepts,
      }
      this.mistakeConcepts.push(newMistake)
      return newMistake.id
    },

    // Update an existing mistake concept
    updateMistakeConcept(
      id: string,
      name: string,
      prompt?: string,
      showsLackOfKnowledge?: string[],
      relatedConcepts?: string[],
    ) {
      const index = this.mistakeConcepts.findIndex(mistake => mistake.id === id)
      if (index !== -1) {
        this.mistakeConcepts[index] = {
          ...this.mistakeConcepts[index],
          name,
          prompt,
          showsLackOfKnowledge,
          relatedConcepts,
        }
        return true
      }
      return false
    },

    // Delete a mistake concept
    deleteMistakeConcept(id: string) {
      const index = this.mistakeConcepts.findIndex(mistake => mistake.id === id)
      if (index !== -1) {
        this.mistakeConcepts.splice(index, 1)
        return true
      }
      return false
    },

    // Create a new option for the current problem
    addOption(text: string = '', mistakeConceptIds: string[] = []) {
      if (!this.currentProblem)
        return null

      const newOption: ProblemOption = {
        id: uuidv4(),
        text,
        mistakeConceptIds,
      }
      this.currentProblem.options.push(newOption)
      return newOption.id
    },

    // Update an existing option
    updateOption(optionId: string, text: string, mistakeConceptIds: string[] = []) {
      if (!this.currentProblem)
        return false

      const index = this.currentProblem.options.findIndex(option => option.id === optionId)
      if (index !== -1) {
        this.currentProblem.options[index] = {
          ...this.currentProblem.options[index],
          text,
          mistakeConceptIds,
        }
        return true
      }
      return false
    },

    // Delete an option
    deleteOption(optionId: string) {
      if (!this.currentProblem)
        return false

      const index = this.currentProblem.options.findIndex(option => option.id === optionId)
      if (index !== -1) {
        this.currentProblem.options.splice(index, 1)
        return true
      }
      return false
    },

    // Create a new problem
    createProblem() {
      const newProblem: Problem = {
        id: uuidv4(),
        text: '',
        conceptIds: [],
        prompt: '',
        options: [],
        note: '',
      }
      this.problems.push(newProblem)
      this.currentProblem = newProblem
      // Add one default option marked as a mistake
      this.addOption('', [])
      return newProblem.id
    },

    // Load a problem
    loadProblem(id: string) {
      const problem = this.problems.find(p => p.id === id)
      if (problem) {
        this.currentProblem = problem
        return true
      }
      return false
    },

    // Update the current problem
    updateCurrentProblem(
      text: string,
      conceptIds: string[] = [],
      prompt: string = '',
      note: string = '',
    ) {
      if (!this.currentProblem)
        return false

      this.currentProblem.text = text
      this.currentProblem.conceptIds = conceptIds
      this.currentProblem.prompt = prompt
      this.currentProblem.note = note
      return true
    },

    // Save the current problem as a template
    saveAsTemplate(name: string) {
      if (!this.currentProblem)
        return null

      // Create a deep copy of the current problem
      const templateProblem: Problem = JSON.parse(JSON.stringify(this.currentProblem))
      templateProblem.id = uuidv4() // Assign a new ID to the template
      this.templates.push(templateProblem)
      return templateProblem.id
    },

    // Load a template
    loadTemplate(templateId: string) {
      const template = this.templates.find(t => t.id === templateId)
      if (template) {
        // Create a deep copy of the template to use as the current problem
        const newProblem: Problem = JSON.parse(JSON.stringify(template))
        newProblem.id = uuidv4() // Assign a new ID to this problem
        this.problems.push(newProblem)
        this.currentProblem = newProblem
        return true
      }
      return false
    },
  },
})
