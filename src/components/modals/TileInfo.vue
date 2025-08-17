<script setup>
import {mapStore} from '@/stores/map.js';
const map = mapStore()

</script>


<template>
  <div class="modalData"> Tile Modal {{map.selectedTile}}</div>

</template>


<style scoped>
.modalData{
  background: white;
}
</style>
