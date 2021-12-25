<template>
  <div id="app">
    <transition name="rotate-fall">
      <router-view/>
    </transition>
  </div>
</template>

<script>
  export default {
    name: 'APP'
  }
</script>

<style>
  .app .app-router-view {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    overflow: hidden;
    backface-visibility: hidden;
    transform: translate3d(0, 0, 0);
    transform-style: preserve-3d;
    visibility: visible;
  }
</style>
