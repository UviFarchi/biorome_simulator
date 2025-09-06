<script setup>


/*
On MetricsTable there should be:
1. An expiry date column, which is the date on which the previous measurement is not valid anymore.
2. A previous value column in which the value of the measurement before the last is shown.
3. A current value column, in which the value of the last measurements is shown.
4. An optimized value column, that shows the effects of the optimized animals, plants and assemblies on the tile.
5. A delta column that can show they user the difference between any two columns they choose (like it currently works) The AssembliesTable subcomponent is new, and it simply shows the real assemblies on the tile with a list of their modules. The should be a second table with a single cell that contains any values in the optimized array of assemblies. BiotaTable and TileGrid should keep working like they do now. Giving you the current state of the map store. The menus will push into the relevant stores, so no need to wire them or set any events.
*/


  import { computed } from "vue";
  import { mapStore } from "@/stores/map.js";

  const map = mapStore();

  const props = defineProps({
  title: { type: String, required: true },
  field: { type: String, required: true }
});

  // expected guards: no tile selected, or block absent on the tile
  const fieldData = computed(() => {
  const tile = map.selectedTile.value;
  if (!tile) return {};                     // no selection yet
  const block = tile[props.field];          // e.g. soil/topo/resources
  return (block && typeof block === "object") ? block : {}; // block not present on this tile
});

  // helpers for “Previous (all history)”
  const historyValues = (prop) =>
  (prop.measured.history ?? []).map(h => (typeof h === "number" ? h : h.value));
</script>

<template>
  <div class="metrics-table-wrapper">
    <h1>{{ title }}</h1>
    <table>
      <thead>
      <tr>
        <th>Expiry</th>
        <th>Previous (all history)</th>
        <th>Current</th>
        <th>Optimized</th>
        <th>Delta</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(property, key) in fieldData" :key="key">
        <td>{{ property.measured.date }}</td>
        <td>{{ property }}</td>
        <td>{{ property.measured.value ?? "-" }}</td>
        <td>{{ property.optimized ?? "-" }}</td>
        <td>-</td>
      </tr>
      </tbody>
    </table>
  </div>
</template>




<style scoped>

</style>
