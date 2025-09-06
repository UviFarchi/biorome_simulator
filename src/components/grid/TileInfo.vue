<script setup>
/*
On TileInfo There should be:
1. 3 MetricsTables subcomponents, one for soil, one for topography, one for resources.
2. 2 BiotaTable subcomponents, one for plants, one for animals.
3. 1 AssembliesTable subcomponent
4. The common styles for all these components
 */


  import { computed } from "vue";
  import { mapStore } from "@/stores/map.js";
  import MetricsTable from "./tileInfoBlocks/MetricsTable.vue";
  import BiotaTable from "./tileInfoBlocks/BiotaTable.vue";
  import AssemblyTable from "./tileInfoBlocks/AssemblyTable.vue";

  const map = mapStore();

  const tile = computed(() => map.selectedTile.value);
  const tileKey = computed(() => (tile.value ? `${tile.value.row}-${tile.value.col}` : "none"));
</script>

<template>
  <div class="tile-info" v-if="tile">
    <h2>Tile {{ tile.row }}, {{ tile.col }}</h2>

    <!-- Metrics -->
    <MetricsTable :key="tileKey + ':soil'"       title="Soil"       field="soil" />
    <MetricsTable :key="tileKey + ':topography'" title="Topography" field="topography" />
    <MetricsTable :key="tileKey + ':resources'"  title="Resources"  field="resources" />

    <!-- Biota and Assemblies -->
    <BiotaTable     :key="tileKey + ':biota'"     />
    <AssemblyTable  :key="tileKey + ':assemblies'"/>
  </div>

  <div v-else class="tile-info empty">
    <h2>Select a tile</h2>
  </div>
</template>

<style scoped>
.tile-info { padding: 8px; }
.empty { opacity: 0.7; }
</style>
