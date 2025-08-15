<script setup>
import {mapStore} from '@/stores/map.js';
const map = mapStore()

</script>


<template>
 Tile Modal {{map.selectedTile}}
</template>


<style scoped>

</style>
