<script setup>
import eventBus from '@/eventBus.js'

import {eventsStore} from '/src/stores/events.js';
import StartingScreen from '/src/components/StartingScreen.vue'
import {onBeforeUnmount, onMounted, ref} from 'vue'
import Map from '/src/components/map/Map.vue';



const events = eventsStore()
const currentArea = ref('start')

function handleNav(area) {
      currentArea.value = area;
}



function logEvent(content) {
  console.log('Event log', content)
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
