<script setup lang="ts">
import { useMathProblemCreationStore } from '~/store/mathProblemCreationStore'
import ProblemEditor from '~/components/MathProblemCreation/ProblemEditor.vue'
import ConceptsPanel from '~/components/MathProblemCreation/ConceptsPanel.vue'
import MistakesPanel from '~/components/MathProblemCreation/MistakesPanel.vue'

// Initialize the store (only at root level component)
const mathStore = useMathProblemCreationStore()

// Create a new problem if none exists
if (!mathStore.currentProblem) {
  mathStore.createProblem()
}

// Handler functions that will be passed to child components
const updateProblem = (text: string, conceptIds: string[], prompt: string, note: string) => {
  mathStore.updateCurrentProblem(text, conceptIds, prompt, note)
}

const createConcept = (
  name: string,
  prompt?: string,
  mustUnderstandTheseConcepts?: string[],
  alsoShowsKnowledgeOf?: string[],
  relatedConcepts?: string[],
) => {
  mathStore.createConcept(name, prompt, mustUnderstandTheseConcepts, alsoShowsKnowledgeOf, relatedConcepts)
}

const updateConcept = (
  id: string,
  name: string,
  prompt?: string,
  mustUnderstandTheseConcepts?: string[],
  alsoShowsKnowledgeOf?: string[],
  relatedConcepts?: string[],
) => {
  mathStore.updateConcept(id, name, prompt, mustUnderstandTheseConcepts, alsoShowsKnowledgeOf, relatedConcepts)
}

const deleteConcept = (id: string) => {
  mathStore.deleteConcept(id)
}

const createMistakeConcept = (
  name: string,
  prompt?: string,
  showsLackOfKnowledge?: string[],
  relatedConcepts?: string[],
) => {
  mathStore.createMistakeConcept(name, prompt, showsLackOfKnowledge, relatedConcepts)
}

const updateMistakeConcept = (
  id: string,
  name: string,
  prompt?: string,
  showsLackOfKnowledge?: string[],
  relatedConcepts?: string[],
) => {
  mathStore.updateMistakeConcept(id, name, prompt, showsLackOfKnowledge, relatedConcepts)
}

const deleteMistakeConcept = (id: string) => {
  mathStore.deleteMistakeConcept(id)
}
</script>

<template>
  <div class="math-problem-creation-interface">
    <div class="panels-container">
      <div class="main-panel">
        <ProblemEditor
          :current-problem="mathStore.currentProblem"
          :concepts="mathStore.concepts"
          :mistake-concepts="mathStore.mistakeConcepts"
          :templates="mathStore.getTemplatesForDropdown"
          :concepts-for-dropdown="mathStore.getConceptsForDropdown"
          :mistake-concepts-for-dropdown="mathStore.getMistakeConceptsForDropdown"
          @update-problem="updateProblem"
          @create-problem="mathStore.createProblem"
          @add-option="mathStore.addOption"
          @update-option="mathStore.updateOption"
          @delete-option="mathStore.deleteOption"
          @save-template="mathStore.saveAsTemplate"
          @load-template="mathStore.loadTemplate"
        />
      </div>
      <div class="sidebar-panel">
        <MistakesPanel
          :mistake-concepts="mathStore.mistakeConcepts"
          :concepts="mathStore.concepts"
          @create-mistake="createMistakeConcept"
          @update-mistake="updateMistakeConcept"
          @delete-mistake="deleteMistakeConcept"
        />
        <ConceptsPanel
          :concepts="mathStore.concepts"
          @create-concept="createConcept"
          @update-concept="updateConcept"
          @delete-concept="deleteConcept"
        />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.math-problem-creation-interface {
  display: flex;
  height: 100%;
  width: 100%;

  .panels-container {
    display: flex;
    width: 100%;
    height: 100%;
    gap: 1rem;
    padding: 1rem;
  }

  .main-panel {
    flex: 3;
    min-width: 0; // Fix for flexbox overflow
  }

  .sidebar-panel {
    flex: 1;
    min-width: 300px;
    max-width: 400px;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
}
</style>
