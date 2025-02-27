<script setup>
/**
 * Description: It's the paper effect that is used when clicking on a quiz question
 */
</script>

<template>
  <div class="paper">
    <div class="question">
      <slot name="question" />
    </div>
    <div class="pattern">
      <div class="content">
        <slot name="content" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="postcss">
$white: var(--primary);
$black: var(--secondary);
$grey: #888;
$redish: rgba(255, 0, 0, 0.6);

.paper {
  h3 {
    color: $black;
    text-align: center;
    margin: 0;
    padding: 0;
  }
  width: 100px;
  height: 100px;
  position: relative;
  margin: 1px auto;
  padding-top: 10px;
  background-color: $white;
  box-shadow: 0 0 5px 0 $grey;
  overflow: hidden;

  .pattern {
    overflow: hidden;

    height: 100%;
    background-image: repeating-linear-gradient($white 0px, $white 24px, $black 25px);
  }
  .content {
    padding-top: 6px;
    padding-left: 56px;
    padding-right: 16px;
    line-height: 25px;
    font-size: 19px;
    letter-spacing: 1px;
    word-spacing: 5px;
  }
  .question {
    /* this is the text questions on a paper test */
    padding-left: 10px;
    padding-right: 10px;
    padding-top: 10px;
    font-size: 19px;
    letter-spacing: 1px;
    word-spacing: 5px;
    font-family: 'Atkinson Hyperlegible', sans-serif;
    font-weight: 700;
  }
}
</style>
