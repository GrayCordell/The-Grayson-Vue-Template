<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import type { Concept, MistakeConcept, Problem } from '~/store/mathProblemCreationStore'
import { Editor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import TextStyle from '@tiptap/extension-text-style'
import { Color } from '@tiptap/extension-color'
import ListItem from '@tiptap/extension-list-item'
import { NButton, NCard, NInput, NSelect, NSpace } from 'naive-ui'
import TipTapControlGroup from '../Core/TipTapControlGroup.vue'

// Props and emits definitions using latest Vue 3 syntax
const props = defineProps<{
  currentProblem: Problem | null
  concepts: Concept[]
  mistakeConcepts: MistakeConcept[]
  templates: { id: string, name: string }[]
  conceptsForDropdown: { id: string, name: string }[]
  mistakeConceptsForDropdown: { id: string, name: string }[]
}>()

const emit = defineEmits<{
  updateProblem: [text: string, conceptIds: string[], prompt: string, note: string]
  createProblem: []
  addOption: [text: string, mistakeConceptIds: string[]]
  updateOption: [optionId: string, text: string, mistakeConceptIds: string[]]
  deleteOption: [optionId: string]
  saveTemplate: [name: string]
  loadTemplate: [templateId: string]
}>()

const editor = ref<any>(null)

const defaultExtensions = [
  Color.configure({ types: [TextStyle.name, ListItem.name] }),
  // @ts-expect-error ---
  TextStyle.configure({ types: [ListItem.name] }),
  StarterKit,
]

// Rich Text Editor Setup
onMounted(() => {
  editor.value = new Editor({
    extensions: defaultExtensions,
    content: props.currentProblem?.text || '',
    onUpdate: ({ editor }) => {
      if (props.currentProblem)
        emit('updateProblem', editor.getHTML(), props.currentProblem.conceptIds, props.currentProblem.prompt, props.currentProblem.note)
    },
  })
})

// Update editor content when problem changes
watch(() => props.currentProblem?.text, (newText) => {
  if (editor.value && newText !== undefined)
    editor.value.commands.setContent(newText)
})

onBeforeUnmount(() => {
  editor.value?.destroy()
})

// Options Management
const optionEditors = ref<Map<string, any>>(new Map())

const setupOptionEditor = (optionId: string, content: string) => {
  const newEditor = new Editor({
    extensions: defaultExtensions,
    content,
    onUpdate: ({ editor }) => {
      if (props.currentProblem) {
        const optionText = editor.getHTML()
        const option = props.currentProblem.options.find(o => o.id === optionId)
        if (option)
          emit('updateOption', optionId, optionText, option.mistakeConceptIds)
      }
    },
  })

  optionEditors.value.set(optionId, newEditor)
  return newEditor
}

const cleanupOptionEditor = (optionId: string) => {
  const editor = optionEditors.value.get(optionId)
  if (editor) {
    editor.destroy()
    optionEditors.value.delete(optionId)
  }
}

// Add a new option
const addNewOption = () => {
  emit('addOption', '', [])
}

// Remove an option
const removeOption = (optionId: string) => {
  cleanupOptionEditor(optionId)
  emit('deleteOption', optionId)
}

// Template Management
const selectedTemplateId = ref('')
const showTemplateSaveModal = ref(false)
const newTemplateName = ref('')

const loadTemplate = () => {
  if (selectedTemplateId.value) {
    emit('loadTemplate', selectedTemplateId.value)

    // Cleanup old editors and set up new ones
    optionEditors.value.forEach(editor => editor.destroy())
    optionEditors.value.clear()

    selectedTemplateId.value = ''
  }
}

const saveAsTemplate = () => {
  if (newTemplateName.value && props.currentProblem) {
    emit('saveTemplate', newTemplateName.value)
    newTemplateName.value = ''
    showTemplateSaveModal.value = false
  }
}

// Problem metadata
const selectedConcepts = computed({
  get: () => props.currentProblem?.conceptIds || [],
  set: (value: string[]) => {
    if (props.currentProblem)
      emit('updateProblem', props.currentProblem.text, value, props.currentProblem.prompt, props.currentProblem.note)
  },
})

const problemPrompt = computed({
  get: () => props.currentProblem?.prompt || '',
  set: (value: string) => {
    if (props.currentProblem)
      emit('updateProblem', props.currentProblem.text, props.currentProblem.conceptIds, value, props.currentProblem.note)
  },
})

const problemNote = computed({
  get: () => props.currentProblem?.note || '',
  set: (value: string) => {
    if (props.currentProblem)
      emit('updateProblem', props.currentProblem.text, props.currentProblem.conceptIds, props.currentProblem.prompt, value)
  },
})

// Update mistake concepts for an option
const updateOptionMistakeConcepts = (optionId: string, mistakeConceptIds: string[]) => {
  const option = props.currentProblem?.options.find(o => o.id === optionId)
  if (option)
    emit('updateOption', optionId, option.text, mistakeConceptIds)
}
</script>

<template>
  <div class="problem-editor">
    <NCard title="Problem Text" class="editor-card">
      <TipTapControlGroup :editor="editor" />
      <EditorContent v-if="editor" :editor="editor" :extensions="defaultExtensions" class="tiptap-editor" />
    </NCard>

    <NCard title="Multiple Choice Options" class="options-card">
      <template v-if="currentProblem">
        <div
          v-for="(option, index) in currentProblem.options"
          :key="option.id"
          class="option-item"
        >
          <div class="option-header">
            <h4>Option {{ index + 1 }}</h4>
            <NButton
              type="error"
              quaternary
              circle
              size="small"
              @click="removeOption(option.id)"
            >
              X
            </NButton>
          </div>

          <EditorContent
            v-if="optionEditors.has(option.id) || setupOptionEditor(option.id, option.text)"
            :editor="optionEditors.get(option.id)"
            class="option-editor tiptap-editor"
          />

          <div class="option-footer">
            <NSelect
              v-model:value="option.mistakeConceptIds"
              multiple
              filterable
              placeholder="Select mistake concepts"
              :options="mistakeConceptsForDropdown.map(m => ({ label: m.name, value: m.id }))"
              @update:value="updateOptionMistakeConcepts(option.id, $event)"
            />
          </div>
        </div>

        <div class="add-option-container">
          <NButton
            type="primary"
            @click="addNewOption"
          >
            Add Option
          </NButton>
        </div>
      </template>
    </NCard>

    <NCard title="Templates and Tagging" class="templates-card">
      <NSpace vertical>
        <div class="template-controls">
          <NSelect
            v-model:value="selectedTemplateId"
            placeholder="Load Template"
            :options="templates.map(t => ({ label: t.name, value: t.id }))"
            class="template-select"
          />
          <NButton
            :disabled="!selectedTemplateId"
            @click="loadTemplate"
          >
            Load
          </NButton>
          <NButton
            @click="showTemplateSaveModal = true"
          >
            Save as Template
          </NButton>
        </div>

        <div v-if="showTemplateSaveModal" class="template-save-modal">
          <NInput
            v-model:value="newTemplateName"
            placeholder="Template name"
          />
          <div class="template-save-buttons">
            <NButton :disabled="!newTemplateName" @click="saveAsTemplate">
              Save
            </NButton>
            <NButton @click="showTemplateSaveModal = false">
              Cancel
            </NButton>
          </div>
        </div>

        <div class="problem-concepts">
          <h4>Problem Concepts</h4>
          <p class="helper-text">
            Avoid adding concepts here that are already associated with specific options.
          </p>
          <NSelect
            v-model:value="selectedConcepts"
            multiple
            filterable
            placeholder="Select problem concepts"
            :options="conceptsForDropdown.map(c => ({ label: c.name, value: c.id }))"
          />
        </div>

        <div class="problem-prompt">
          <h4>Problem-Specific AI Prompt</h4>
          <NInput
            v-model:value="problemPrompt"
            placeholder="Enter AI prompt for this problem"
            :autosize="{ minRows: 3, maxRows: 6 }"
          />
        </div>

        <div class="problem-notes">
          <h4>Notes</h4>
          <NInput
            v-model:value="problemNote"
            placeholder="Additional notes or metadata"
            :autosize="{ minRows: 3, maxRows: 6 }"
          />
        </div>
      </NSpace>
    </NCard>
  </div>
</template>

<style lang="scss">
.tiptap {
  .tiptap-editor {
    // reset everything first
    margin: 0;
    padding: 0;
    list-style: none;
    text-align: left;
    text-indent: 0;
    text-wrap: normal;
    white-space: pre-wrap;

    :first-child {
      margin-top: 0;
    }

    /* List styles */
    ul,
    ol {
      padding: 0 1rem;
      margin: 1.25rem 1rem 1.25rem 0.4rem;

      li p {
        margin-top: 0.25em;
        margin-bottom: 0.25em;
      }
    }

    /* Heading styles */
    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
      line-height: 1.1;
      margin-top: 2.5rem;
      text-wrap: pretty;
    }

    h1,
    h2 {
      margin-top: 3.5rem;
      margin-bottom: 1.5rem;
    }

    h1 {
      font-size: 1.4rem;
    }

    h2 {
      font-size: 1.2rem;
    }

    h3 {
      font-size: 1.1rem;
    }

    h4,
    h5,
    h6 {
      font-size: 1rem;
    }

    /* Code and preformatted text styles */
    code {
      background-color: var(--purple-light);
      border-radius: 0.4rem;
      color: var(--black);
      font-size: 0.85rem;
      padding: 0.25em 0.3em;
    }

    pre {
      background: var(--black);
      border-radius: 0.5rem;
      color: var(--white);
      font-family: 'JetBrainsMono', monospace;
      margin: 1.5rem 0;
      padding: 0.75rem 1rem;

      code {
        background: none;
        color: inherit;
        font-size: 0.8rem;
        padding: 0;
      }
    }

    blockquote {
      border-left: 3px solid var(--gray-3);
      margin: 1.5rem 0;
      padding-left: 1rem;
    }

    hr {
      border: none;
      border-top: 1px solid var(--gray-2);
      margin: 2rem 0;
    }
  }
}
</style>

<style scoped lang="scss">
.problem-editor {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  height: 100%;
}

.editor-card,
.options-card,
.templates-card {
  width: 100%;
}

.option-item {
  margin-bottom: 1.5rem;
  padding: 1rem;
  border: 1px solid var(--gray-3);
  border-radius: 4px;

  .option-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
  }

  .option-editor {
    margin-bottom: 0.5rem;
    min-height: 80px;
  }
}

.add-option-container {
  display: flex;
  justify-content: center;
  margin-top: 1rem;
}

.template-controls {
  display: flex;
  gap: 0.5rem;

  .template-select {
    flex-grow: 1;
  }
}

.template-save-modal {
  margin-top: 0.5rem;
  padding: 1rem;
  border: 1px solid var(--gray-3);
  border-radius: 4px;

  .template-save-buttons {
    display: flex;
    gap: 0.5rem;
    margin-top: 0.5rem;
    justify-content: flex-end;
  }
}

.problem-concepts,
.problem-prompt,
.problem-notes {
  margin-top: 1rem;

  h4 {
    margin-bottom: 0.5rem;
  }

  .helper-text {
    font-size: 0.85rem;
    color: var(--gray-6);
    margin-bottom: 0.5rem;
  }
}
</style>
