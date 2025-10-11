<script setup>
import eventBus from '@/eventBus.js';
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { gameStore } from '@/stores/game.js';
import StartingScreen from '@/components/StartingScreen.vue';
import Map from '@/components/Map.vue';
import AssemblyAssemblyAssembly from '@/components/AssemblyStation.vue';
import Market from '@/components/Market.vue';
import { saveAllStores, clearSavedStores } from '@/utils/persistance.js';

const events = gameStore();
const currentArea = ref('start');

function handleNav(payload) {
  const isObject = typeof payload === 'object' && payload !== null;
  const area = isObject ? payload.area : payload;
  if (!area) return;

  currentArea.value = area;

  if (isObject && payload.clearStores) {
    clearSavedStores();
  }

  const skipSave = area === 'start' || (isObject && payload.skipSave);
  if (!skipSave) {
    saveAllStores();
  }
}

function logEvent(content) {
  events.log.push(content);
}

onMounted(() => {
  eventBus.on('nav', handleNav);
  eventBus.on('log', logEvent);
});

onBeforeUnmount(() => {
  eventBus.off('nav', handleNav);
  eventBus.off('log', logEvent);
});
</script>

<template>
  <main>
    <StartingScreen v-if="currentArea === 'start'" />
    <Map v-if="currentArea === 'map'" />
    <AssemblyAssemblyAssembly v-if="currentArea === 'assembly'" />
    <Market v-if="currentArea === 'market'" />
  </main>
</template>

<style>
html,
body,
#app {
  margin: 0;
  height: 100%;
  overflow: hidden;
}

main {
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}
</style>
