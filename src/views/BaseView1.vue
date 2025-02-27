<script setup lang="ts">
// No additional logic needed.
</script>

<template>
  <section class="front-screen">
    <div class="box">
      <div class="box__grip" />
      <div class="box__content">
        <div class="box__content__inner">
          <h1 class="title">
            Welcome to the App!
          </h1>
          <p class="subtitle">
            Some description about the app.
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.front-screen {
  position: fixed; /* Fixed position to cover the entire screen. */
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1001;

  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  min-height: 100vh;
  background: linear-gradient(135deg, var(--primary), var(--primary-darker));
  padding: 2rem;
  overflow: hidden;

  /* Decorative animated circle in the top-left corner */
  &::before {
    content: '';
    position: absolute;
    top: -50px;
    left: -50px;
    width: 200px;
    height: 200px;
    background: var(--accent);
    border-radius: 50%;
    opacity: 0.2;
    animation: pulse 6s ease-in-out infinite;
    z-index: 0;
  }

  /* Decorative animated shape in the bottom-right corner */
  &::after {
    content: '';
    position: absolute;
    bottom: -30px;
    right: -30px;
    width: 150px;
    height: 150px;
    background: var(--accent-hover);
    border-radius: 20%;
    opacity: 0.2;
    animation: slide 8s ease-in-out infinite;
    z-index: 0;
  }
}

.box {
  transition: box-shadow 0.3s ease;
  border: 2px solid black;
  box-shadow: 5px 6px 1px 2px rgb(0 0 0 / 30%);
  border-radius: 18px;
  width: 90%;
  min-width: 400px;
  max-width: 900px;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
  overflow-y: auto;
}

.box__grip {
  background-color: var(--accent);
  padding: 15px;
  display: flex;
  align-items: center;
  box-shadow: -1px 5px 4px 0 #08080836;
  border-bottom: 2px solid #000;
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
}
.box__content {
  display: flex;
}
.box__content__inner {
  position: relative;
  z-index: 1;
  padding: 1rem;
  border-top-left-radius: 18px;
  border-top-right-radius: 18px;

  .title {
    font-size: 3rem;
    margin-bottom: 1rem;
    color: var(--accent);
    font-family: 'Montserrat', sans-serif;
    text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.1);
  }

  .subtitle {
    font-size: 1.5rem;
    margin-bottom: 2rem;
    line-height: 1.4;
    color: var(--secondary-lighter);
  }

  .cta-button {
    display: inline-block;
    background-color: var(--accent);
    color: var(--primary);
    font-size: 1.25rem;
    font-weight: bold;
    padding: 0.75rem 1.5rem;
    border-radius: 50px;
    text-decoration: none;
    transition:
      background-color 0.3s ease,
      transform 0.3s ease;

    &:hover {
      background-color: var(--accent-hover);
      transform: translateY(-5px);
    }
  }
}

@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

@keyframes slide {
  0%,
  100% {
    transform: translate(0, 0);
  }
  50% {
    transform: translate(-20px, 20px);
  }
}
</style>
