<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Concept, MistakeConcept } from '~/store/mathProblemCreationStore'
import { NButton, NCard, NEmpty, NInput, NList, NListItem, NModal, NSelect, NSpace, NText } from 'naive-ui'

// Props and emits using Vue 3.3+ syntax
const props = defineProps<{
  mistakeConcepts: MistakeConcept[]
  concepts: Concept[]
}>()

const emit = defineEmits<{
  createMistake: [name: string, prompt?: string, showsLackOfKnowledge?: string[], relatedConcepts?: string[]]
  updateMistake: [id: string, name: string, prompt?: string, showsLackOfKnowledge?: string[], relatedConcepts?: string[]]
  deleteMistake: [id: string]
}>()

// Modal management
const showMistakeModal = ref(false)
const isEditMode = ref(false)
const currentMistakeId = ref('')

// Form fields
const mistakeName = ref('')
const mistakePrompt = ref('')
const showsLackOfKnowledge = ref<string[]>([])
const relatedConcepts = ref<string[]>([])


// Reset form fields
const resetForm = () => {
  currentMistakeId.value = ''
  mistakeName.value = ''
  mistakePrompt.value = ''
  showsLackOfKnowledge.value = []
  relatedConcepts.value = []
}

// Open modal for new mistake concept
const openAddMistakeModal = () => {
  resetForm()
  isEditMode.value = false
  showMistakeModal.value = true
}

// Open modal for editing an existing mistake concept
const openEditMistakeModal = (mistake: MistakeConcept) => {
  resetForm()
  isEditMode.value = true
  currentMistakeId.value = mistake.id
  mistakeName.value = mistake.name
  mistakePrompt.value = mistake.prompt || ''
  showsLackOfKnowledge.value = mistake.showsLackOfKnowledge || []
  relatedConcepts.value = mistake.relatedConcepts || []
  showMistakeModal.value = true
}


// Save mistake concept (create or update)
const saveMistakeConcept = () => {
  if (!mistakeName.value.trim())
    return


  if (isEditMode.value && currentMistakeId.value)
    emit('updateMistake', currentMistakeId.value, mistakeName.value, mistakePrompt.value, showsLackOfKnowledge.value, relatedConcepts.value)
  else
    emit('createMistake', mistakeName.value, mistakePrompt.value, showsLackOfKnowledge.value, relatedConcepts.value)

  showMistakeModal.value = false
  resetForm()
}

// Delete mistake concept
const deleteMistakeConcept = (id: string) => {
  // eslint-disable-next-line no-alert
  if (confirm('Are you sure you want to delete this mistake concept?'))
    emit('deleteMistake', id)
}

// Computed properties for dropdowns
const availableConceptsForLackOfKnowledge = computed(() => {
  return props.concepts.map(c => ({ label: c.name, value: c.id }))
})

const availableConceptsForRelated = computed(() => {
  return props.concepts
    .filter(c => !showsLackOfKnowledge.value.includes(c.id))
    .map(c => ({ label: c.name, value: c.id }))
})
</script>

<template>
  <NCard title="Mistake Concepts" class="mistakes-panel">
    <template #header-extra>
      <NButton type="primary" size="small" @click="openAddMistakeModal">
        Add Mistake
      </NButton>
    </template>

    <NList v-if="mistakeConcepts.length > 0" bordered>
      <NListItem v-for="mistake in mistakeConcepts" :key="mistake.id">
        <NSpace justify="space-between" align="center">
          <NText>{{ mistake.name }}</NText>
          <NSpace>
            <NButton size="small" @click="openEditMistakeModal(mistake)">
              Edit
            </NButton>
            <NButton type="error" size="small" @click="deleteMistakeConcept(mistake.id)">
              Delete
            </NButton>
          </NSpace>
        </NSpace>
      </NListItem>
    </NList>

    <NEmpty v-else description="No mistake concepts added yet" />

    <!-- Mistake Modal -->
    <NModal
      v-model:show="showMistakeModal"
      :title="isEditMode ? 'Edit Mistake Concept' : 'Add New Mistake Concept'"
      style="width: 60%; max-width: 600px;"
    >
      <NCard>
        <NSpace vertical>
          <div class="form-group">
            <label>Mistake Name (required)</label>
            <NInput v-model:value="mistakeName" placeholder="Enter mistake concept name" />
          </div>

          <div class="form-group">
            <label>AI Prompt</label>
            <NInput
              v-model:value="mistakePrompt"
              type="textarea"
              placeholder="Enter AI prompt for this mistake concept"
              :autosize="{ minRows: 3, maxRows: 5 }"
            />
          </div>

          <div class="form-group">
            <label>Shows Lack of Knowledge In</label>
            <NSelect
              v-model:value="showsLackOfKnowledge"
              multiple
              filterable
              placeholder="Select concepts this mistake indicates lack of knowledge in"
              :options="availableConceptsForLackOfKnowledge"
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
            <NButton @click="showMistakeModal = false">
              Cancel
            </NButton>
            <NButton type="primary" :disabled="!mistakeName.trim()" @click="saveMistakeConcept">
              Save
            </NButton>
          </NSpace>
        </NSpace>
      </NCard>
    </NModal>
  </NCard>
</template>

<style scoped lang="scss">
.mistakes-panel {
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
