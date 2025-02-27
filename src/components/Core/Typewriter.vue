<!-- <script>
/**
 * Description: Used in conversation pane to display text as if it is being typed.
 * Note: renderless component (hacky)
 */
import Typewriter from 'typewriter-effect/dist/core'

export default {
  props: {
    strings: {
      type: String,
      required: true,
      // eslint-disable-next-line vue/require-valid-default-prop
      default: () => [],
    },
    config: {
      type: Object,
      required: false,
      default: () => {},
    },
  },
  emits: ['done', 'isTyping'],
  data() {
    return {
      instance: null,
    }
  },
  mounted() {
    let startingString = null
    if (this.config.stop)
      startingString = this.strings

    const newConfig = Object.assign({ strings: startingString }, { autoStart: true, loop: true }, this.config)

    this.instance = new Typewriter(this.$el, newConfig)
    if (this.config.stop) {
      this.instance.start()
      this.instance.stop()
      return
    }

    const text = this.strings
    // wrapper to convert our strings into calls into typewriterJS commands
    // [wait(1000)]Hello[delete(5)]World
    // becomes this.instance.wait(1000).typeString('Hello').deleteChars(5).typeString('World').start()
    const regex = /\[(\w+)\((\d+)\)\]/g
    let match
    let currentPos = 0

    this.$emit('isTyping')

    // eslint-disable-next-line no-cond-assign
    while (match = regex.exec(text)) {
      // Get the text between the last match and the current one
      const plainText = text.slice(currentPos, match.index)
      // If there is any plain text, add it as a typeString call
      if (plainText)
        this.instance.typeString(plainText)

      // Get the keyword and the value from the match
      const keyword = match[1]
      const value = Number.parseInt(match[2])
      // Generate the corresponding method call based on the keyword
      switch (keyword) {
        case 'wait' || 'pause' || 'pauseFor':
          this.instance.pauseFor(value)
          break
        case 'delete' || 'deleteChars':
          this.instance.deleteChars(value)
          break
        case 'delay' || 'delayFor' || 'changeDelay':
          this.instance.changeDelay(value)
          break

            // Add more cases for other keywords as needed
      }
      // Update the current position to the end of the match
      currentPos = match.index + match[0].length
    }

    // Add any remaining plain text after the last match
    const remainingText = text.slice(currentPos)
    if (remainingText)
      this.instance.typeString(remainingText)

    this.instance.callFunction(() => {
      this.$emit('done')
    })

    this.instance.start()
  },
  unmounted() {
    this.instance.stop()
  },
}
</script>

<template>
  <span />
</template>

<style lang="postcss">
$font-size: 1.1rem;
.Typewriter {
  font-size: $font-size;
  margin: 0;
  white-space: pre-line;
}
.Typewriter__wrapper {
  font-size: $font-size;
  white-space: pre-line;
}
</style> -->
