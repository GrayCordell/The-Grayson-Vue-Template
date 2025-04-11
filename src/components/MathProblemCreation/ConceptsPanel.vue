<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Concept } from '~/store/mathProblemCreationStore'
import { NButton, NCard, NEmpty, NInput, NList, NListItem, NModal, NSelect, NSpace, NText } from 'naive-ui'

const props = defineProps<{
  concepts: Concept[]
}>()

const emit = defineEmits<{
  createConcept: [name: string, prompt?: string, mustUnderstandTheseConcepts?: string[], alsoShowsKnowledgeOf?: string[], relatedConcepts?: string[]]
  updateConcept: [id: string, name: string, prompt?: string, mustUnderstandTheseConcepts?: string[], alsoShowsKnowledgeOf?: string[], relatedConcepts?: string[]]
  deleteConcept: [id: string]
}>()

// Modal management
const showConceptModal = ref(false)
const isEditMode = ref(false)
const currentConceptId = ref('')

// Form fields
const conceptName = ref('')
const conceptPrompt = ref('')
const mustUnderstandConcepts = ref<string[]>([])
const alsoShowsKnowledgeOf = ref<string[]>([])
const relatedConcepts = ref<string[]>([])


// Reset form fields
const resetForm = () => {
  currentConceptId.value = ''
  conceptName.value = ''
  conceptPrompt.value = ''
  mustUnderstandConcepts.value = []
  alsoShowsKnowledgeOf.value = []
  relatedConcepts.value = []
}

// Open modal for new concept
const openAddConceptModal = () => {
  resetForm()
  isEditMode.value = false
  showConceptModal.value = true
}

// Open modal for editing an existing concept
const openEditConceptModal = (concept: Concept) => {
  resetForm()
  isEditMode.value = true
  currentConceptId.value = concept.id
  conceptName.value = concept.name
  conceptPrompt.value = concept.prompt || ''
  mustUnderstandConcepts.value = concept.mustUnderstandTheseConcepts || []
  alsoShowsKnowledgeOf.value = concept.alsoShowsKnowledgeOf || []
  relatedConcepts.value = concept.relatedConcepts || []
  showConceptModal.value = true
}


// Save concept (create or update)
const saveConcept = () => {
  if (!conceptName.value.trim())
    return

  if (isEditMode.value && currentConceptId.value) {
    emit('updateConcept', currentConceptId.value, conceptName.value, conceptPrompt.value, mustUnderstandConcepts.value, alsoShowsKnowledgeOf.value, relatedConcepts.value)
  }
  else {
    emit('createConcept', conceptName.value, conceptPrompt.value, mustUnderstandConcepts.value, alsoShowsKnowledgeOf.value, relatedConcepts.value)
  }

  showConceptModal.value = false
  resetForm()
}

// Delete concept
const deleteConcept = (id: string) => {
  // eslint-disable-next-line no-alert
  if (confirm('Are you sure you want to delete this concept?'))
    emit('deleteConcept', id)
}

// Computed properties for dropdowns
const availableConceptsForMustUnderstand = computed(() => {
  return props.concepts
    .filter(c => c.id !== currentConceptId.value)
    .map(c => ({ label: c.name, value: c.id }))
})

const availableConceptsForAlsoShows = computed(() => {
  return props.concepts
    .filter(c =>
      c.id !== currentConceptId.value
      && !mustUnderstandConcepts.value.includes(c.id),
    )
    .map(c => ({ label: c.name, value: c.id }))
})

const availableConceptsForRelated = computed(() => {
  return props.concepts
    .filter(c =>
      c.id !== currentConceptId.value
      && !mustUnderstandConcepts.value.includes(c.id)
      && !alsoShowsKnowledgeOf.value.includes(c.id),
    )
    .map(c => ({ label: c.name, value: c.id }))
})
</script>

<template>
  <NCard title="Concepts" class="concepts-panel">
    <template #header-extra>
      <NButton type="primary" size="small" @click="openAddConceptModal">
        Add Concept
      </NButton>
    </template>

    <NList v-if="concepts.length > 0" bordered>
      <NListItem v-for="concept in concepts" :key="concept.id">
        <NSpace justify="space-between" align="center">
          <NText>{{ concept.name }}</NText>
          <NSpace>
            <NButton size="small" @click="openEditConceptModal(concept)">
              Edit
            </NButton>
            <NButton type="error" size="small" @click="deleteConcept(concept.id)">
              Delete
            </NButton>
          </NSpace>
        </NSpace>
      </NListItem>
    </NList>

    <NEmpty v-else description="No concepts added yet" />

    <!-- Concept Modal -->
    <NModal
      v-model:show="showConceptModal"
      :title="isEditMode ? 'Edit Concept' : 'Add New Concept'"
      style="width: 60%; max-width: 600px;"
    >
      <NCard>
        <NSpace vertical>
          <div class="form-group">
            <label>Concept Name (required)</label>
            <NInput v-model:value="conceptName" placeholder="Enter concept name" />
          </div>

          <div class="form-group">
            <label>AI Prompt</label>
            <NInput
              v-model:value="conceptPrompt"
              type="textarea"
              placeholder="Enter AI prompt for this concept"
              :autosize="{ minRows: 3, maxRows: 5 }"
            />
          </div>

          <div class="form-group">
            <label>Prerequisite Concepts</label>
            <NSelect
              v-model:value="mustUnderstandConcepts"
              multiple
              filterable
              placeholder="Select prerequisite concepts"
              :options="availableConceptsForMustUnderstand"
            />
          </div>

          <div class="form-group">
            <label>Also Demonstrates Knowledge Of</label>
            <NSelect
              v-model:value="alsoShowsKnowledgeOf"
              multiple
              filterable
              placeholder="Select concepts this demonstrates"
              :options="availableConceptsForAlsoShows"
            />
          </div>

          <div class="form-group">
            <label>Semi-Relevant Concepts</label>
            <NSelect
              v-model:value="relatedConcepts"
              multiple
              filterable
              placeholder="Select semi-relevant concepts"
              :options="availableConceptsForRelated"
            />
          </div>

          <NSpace justify="end">
            <NButton @click="showConceptModal = false">
              Cancel
            </NButton>
            <NButton type="primary" :disabled="!conceptName.trim()" @click="saveConcept">
              Save
            </NButton>
          </NSpace>
        </NSpace>
      </NCard>
    </NModal>
  </NCard>
</template>

<style scoped lang="scss">
.concepts-panel {
  height: 50%;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  /* Allow the card content to scroll while header stays fixed */
  :deep(.n-card__content) {
    flex: 1;
    overflow-y: auto;
  }
}

.form-group {
  margin-bottom: 1rem;

  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
  }
}
</style>
