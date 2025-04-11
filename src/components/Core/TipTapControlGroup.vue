<script setup lang="ts">
import type { Editor } from '@tiptap/vue-3'

const props = defineProps<{
  editor: Editor
}>()

const chainFocus = () => props.editor.chain().focus()
const canChainFocus = () => props.editor.can().chain().focus()
</script>

<template>
  <div v-if="editor" class="control-group">
    <div class="button-group">
      <button :disabled="!canChainFocus().toggleBold().run()"
              :class="{ 'is-active': editor.isActive('bold') }"
              @click="chainFocus().toggleBold().run()">
        Bold
      </button>
      <button :disabled="!canChainFocus().toggleItalic().run()"
              :class="{ 'is-active': editor.isActive('italic') }"
              @click="chainFocus().toggleItalic().run()">
        Italic
      </button>
      <button :disabled="!canChainFocus().toggleStrike().run()"
              :class="{ 'is-active': editor.isActive('strike') }"
              @click="chainFocus().toggleStrike().run()">
        Strike
      </button>
      <button :disabled="!canChainFocus().toggleCode().run()"
              :class="{ 'is-active': editor.isActive('code') }"
              @click="chainFocus().toggleCode().run()">
        Code
      </button>
      <button @click="chainFocus().unsetAllMarks().run()">
        Clear marks
      </button>
      <button @click="chainFocus().clearNodes().run()">
        Clear nodes
      </button>
      <button :class="{ 'is-active': editor.isActive('paragraph') }"
              @click="chainFocus().setParagraph().run()">
        Paragraph
      </button>
      <button :class="{ 'is-active': editor.isActive('heading', { level: 1 }) }"
              @click="chainFocus().toggleHeading({ level: 1 }).run()">
        H1
      </button>
      <button :class="{ 'is-active': editor.isActive('heading', { level: 2 }) }"
              @click="chainFocus().toggleHeading({ level: 2 }).run()">
        H2
      </button>
      <button :class="{ 'is-active': editor.isActive('heading', { level: 3 }) }"
              @click="chainFocus().toggleHeading({ level: 3 }).run()">
        H3
      </button>
      <button :class="{ 'is-active': editor.isActive('heading', { level: 4 }) }"
              @click="chainFocus().toggleHeading({ level: 4 }).run()">
        H4
      </button>
      <button :class="{ 'is-active': editor.isActive('heading', { level: 5 }) }"
              @click="chainFocus().toggleHeading({ level: 5 }).run()">
        H5
      </button>
      <button :class="{ 'is-active': editor.isActive('heading', { level: 6 }) }"
              @click="chainFocus().toggleHeading({ level: 6 }).run()">
        H6
      </button>
      <button :class="{ 'is-active': editor.isActive('bulletList') }"
              @click="chainFocus().toggleBulletList().run()">
        Bullet list
      </button>
      <button :class="{ 'is-active': editor.isActive('orderedList') }"
              @click="chainFocus().toggleOrderedList().run()">
        Ordered list
      </button>
      <button :class="{ 'is-active': editor.isActive('codeBlock') }"
              @click="chainFocus().toggleCodeBlock().run()">
        Code block
      </button>
      <button :class="{ 'is-active': editor.isActive('blockquote') }"
              @click="chainFocus().toggleBlockquote().run()">
        Blockquote
      </button>
      <button @click="chainFocus().setHorizontalRule().run()">
        Horizontal rule
      </button>
      <button @click="chainFocus().setHardBreak().run()">
        Hard break
      </button>
      <button :disabled="!canChainFocus().undo().run()"
              @click="chainFocus().undo().run()">
        Undo
      </button>
      <button :disabled="!canChainFocus().redo().run()"
              @click="chainFocus().redo().run()">
        Redo
      </button>
    </div>
  </div>
</template>

<style scoped lang="scss">
/* Define some color and sizing variables for easy adjustments */
$bg-color: #fafafa;
$border-color: #e0e0e0;
$active-color: #007bff;
$hover-bg-color: #f5f5f5;
$text-color: #333;
$disabled-opacity: 0.6;

.control-group {
  display: flex;
  justify-content: center;
  padding: 4px 8px; // Compact padding for minimalism
  background-color: $bg-color;
  border: 1px solid $border-color;
  border-radius: 4px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  margin-bottom: 8px;
}

.button-group {
  display: flex;
  gap: 6px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  button {
    padding: 4px 8px; // Smaller padding helps to keep the bar minimal
    font-size: 0.75rem; // Reduced font size to match the compact design
    color: $text-color;
    border: 1px solid transparent;
    background-color: transparent;
    border-radius: 3px;
    transition:
      background-color 0.2s ease,
      border-color 0.2s ease;
    cursor: pointer;

    &:hover:not(:disabled) {
      background-color: $hover-bg-color;
      border-color: $border-color;
    }

    &:focus {
      outline: none;
      border-color: $active-color;
      background-color: $hover-bg-color;
    }

    &:disabled {
      opacity: $disabled-opacity;
      cursor: not-allowed;
    }

    &.is-active {
      border-color: $active-color;
      background-color: $active-color;
      color: #fff;

      &:hover:not(:disabled) {
        // Slightly darken the active color on hover if desired; adjust as needed
        background-color: darken($active-color, 10%);
        border-color: darken($active-color, 10%);
      }
    }
  }
}
</style>
