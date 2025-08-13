<script setup>
import eventBus from '@/eventBus.js'
import {gameStore} from '/src/stores/game.js'
import {eventsStore} from "/src/stores/events.js";
import StartingScreen from '/src/components/areas/startingScreen/StartingScreen.vue'
import {onBeforeUnmount, onMounted, ref} from 'vue'
import Map from "/src/components/areas/map/Map.vue";
import EventLog from "/src/components/modals/EventLog.vue";
import {recalculateTileValues} from "@/calc/recalculateTileValues.js";
import {produceReport} from "@/calc/produceReport.js";
import AnalyticsReport from "@/components/modals/AnalyticsReport.vue";
import AnimalsMenu from "@/components/menus/optimizations/AnimalsMenu.vue";
import PlantsMenu from "@/components/menus/optimizations/PlantsMenu.vue";
import AssembliesMenu from "@/components/menus/operations/AssembliesMenu.vue";
import FarmGate from "@/components/menus/operations/FarmGate.vue";

const gameState = gameStore()
const events = eventsStore()
const currentScreen = ref(
    gameState.userName && gameState.userAvatar && gameState.difficulty !== undefined ? 'map' : 'start'
)
const show = ref({log: false, analytics: false, animals: false, plants: false, assemblies: false, gate: false})

function handleNav(e) {
  if (['start', 'map', 'assembly', 'market'].includes(e)) {
    currentScreen.value = e
  }
}


async function handlePhaseChange() {
  gameState.turnPhase++
  //Restart Phases
  if (gameState.turnPhase > 2) {
    gameState.turnPhase = 0;
  }
  console.log(gameState.turnPhase)
  switch (gameState.turnPhase) {
    case 0:
      gameState.currentDay++;
      eventBus.emit('log', {engine: "analytics", msg: "Day " + gameState.currentDay + " in the biorome"})
      recalculateTileValues();
      eventBus.emit('log', {engine: "analytics", msg: "Recalculated entity values, producing report"})
      produceReport()
      eventBus.emit('menu', {target: 'analytics', show: true});
      eventBus.emit('menu', {target: 'assemblies', show: false})
      eventBus.emit('menu', {target: 'gate', show: false})
      break;
    case 1:
      eventBus.emit('log', {engine: "optimizations", msg: "Running simulations..."})
      eventBus.emit('menu', {target: 'animals', show: true})
      eventBus.emit('menu', {target: 'plants', show: true})
      eventBus.emit('menu', {target: 'analytics', show: false});

      break;
    case 2:
      eventBus.emit('log', {engine: "operations", msg: "Executing instructions..."})
      eventBus.emit('menu', {target: 'assemblies', show: true})
      eventBus.emit('menu', {target: 'gate', show: true})
      eventBus.emit('menu', {target: 'animals', show: false})
      eventBus.emit('menu', {target: 'plants', show: false})
      break;

  }


}


function toggleMenu(menu) {
console.log(menu.show)
  let target = menu.target;
 let shown = menu.show
  //Send menu.show empty for toggle
  if (shown === undefined){
   shown = !show.value[target]
  }
  show.value[target] = shown;
  console.log( target + " show: " + show.value[target])
  console.log(target)
}

function logEvent(content) {
  console.log(content)
  events.log.push(content)

}


onMounted(() => {
  eventBus.on('nav', handleNav)
  eventBus.on('menu', toggleMenu)
  eventBus.on('log', logEvent)
  eventBus.on('phase', handlePhaseChange)
  handlePhaseChange()
})

onBeforeUnmount(() => {
  eventBus.off('nav', handleNav)
  eventBus.off('menu', toggleMenu)
  eventBus.off('log', logEvent)
  eventBus.on('phase', handlePhaseChange)
})


</script>

<template>
  <main>
    {{ currentScreen }}
    <EventLog v-if="show.log"></EventLog>
    <AnalyticsReport v-if="show.analytics"></AnalyticsReport>
    <StartingScreen v-if="currentScreen === 'start'"/>
    <Map v-if="currentScreen === 'map'"/>
    <AnimalsMenu v-if="show.animals"/>
    <PlantsMenu v-if="show.plants"/>
    <AssembliesMenu v-if="show.assemblies"/>
    <FarmGate v-if="show.gate"/>
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
