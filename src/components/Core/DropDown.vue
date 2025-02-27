<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Ref } from 'vue'

// Define the props with TypeScript interface
interface Props {
  options: any[]
  label: string
}

// Use withDefaults for default prop values and better type inference
const props = withDefaults(defineProps<Props>(), {
  label: 'Dropdown',
})
const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const label = computed(() => props.label)

const isOpen: Ref<boolean> = ref(false)
const selectedOption: Ref<string> = ref('')

const toggleOpen = () => {
  isOpen.value = !isOpen.value
}

// Ensure the option parameter is typed. Adjust the type according to your options' structure
const selectOption = (option: string) => {
  isOpen.value = false
  selectedOption.value = option
  emit('update:modelValue', option)
}
</script>

<template>
  <div class="dropdown">
    <div class="dropdown-button" @click="toggleOpen">
      {{ label }}
    </div>

    <ul v-if="isOpen" class="dropdown-list">
      <!-- Adjust option?.key, option.label, and option.text according to your options' structure -->
      <li v-for="option in props.options" :key="option?.key || option" @click="selectOption(option)">
        {{ option.label || option.text || option }}
      </li>
    </ul>
  </div>
</template>

<style scoped lang="scss">
$bg-list-color: var(--accent);
$hover-color: var(--accent-hover);
$border-color: var(--secondary);
$border-color-2: #00000017;
$box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
.dropdown {
  position: relative;
  display: inline-block;
}

.dropdown-button {
  padding: 3px;
  cursor: pointer;
}

.dropdown-list {
  position: absolute;
  list-style: none;
  box-shadow: $box-shadow;
  z-index: 1000;

  margin-top: 7px;
  padding-left: 1px;
  padding-right: 1px;
  background-color: $bg-list-color;
  margin-left: -8px;
  width: 140px;
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  border: 1px solid $border-color;
  border-bottom-right-radius: 9px;
  border-bottom-left-radius: 9px;
  overflow: hidden;
  text-align: left;
  border-top: 0;
}

.dropdown-list li {
  padding: 6px 8px;
  cursor: pointer;
  border: 1px solid $border-color-2;
  width: 100%;
}

.dropdown-list li:hover {
  background-color: $hover-color;
}
</style>
