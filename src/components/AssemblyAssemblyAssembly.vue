<script setup>
import eventBus from "@/eventBus.js";
</script>

<template>
<div>
  Assembly Assembly Assembly:

  This is the assembly used to assemble other assemblies.

  <button @click="eventBus.emit('nav', 'map')">Back to map</button>
</div>
</template>

<style scoped>

</style>