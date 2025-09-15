<script setup>
import eventBus from '@/eventBus.js'

import {gameStore} from '/src/stores/game.js';
import StartingScreen from '/src/components/StartingScreen.vue'
import {onBeforeUnmount, onMounted, ref} from 'vue'
import Map from '/src/components/Map.vue';
import AssemblyAssemblyAssembly from '@/components/AssemblyStation.vue';
import Market from '/src/components/Market.vue';



const events = gameStore()
const currentArea = ref('start')

function handleNav(area) {
      currentArea.value = area;
}



function logEvent(content) {

  events.log.push(content)

}


onMounted(() => {
  eventBus.on('nav', handleNav)
  eventBus.on('log', logEvent)
})

onBeforeUnmount(() => {
  eventBus.off('nav', handleNav)
  eventBus.off('log', logEvent)
})


</script>

<template>
  <main>
    <StartingScreen v-if="currentArea === 'start'"/>
      <Map v-if="currentArea === 'map'"/>
      <AssemblyAssemblyAssembly v-if="currentArea=== 'assembly'"/>
      <Market v-if="currentArea === 'market'"/>
    </main>
  </template>

<style>
html, body, #app {
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
