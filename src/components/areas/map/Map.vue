<script setup>


import StatusBar from "/src/components/areas/map/StatusBar.vue";
import {gameStore} from "@/stores/game.js";
import {mapStore} from "@/stores/map.js";
import EventLog from "/src/components/modals/EventLog.vue";
</script>

<template>
  <StatusBar></StatusBar>
  <div class="tiles">
  <div v-for="tileRow in mapStore().tiles">
    <div v-for="tile in tileRow" class="tile">
      {{tile.row}}, {{tile.col}}*
    </div>
  </div>
  </div>

</template>

<style scoped>
.tiles {
  display: flex;
  flex-wrap: wrap;
}

.tile {
  display: flex;
  flex: 1;
  border: 1px solid black;
}
</style>