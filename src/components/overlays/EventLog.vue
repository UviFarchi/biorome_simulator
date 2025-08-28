<script setup>
import {gameStore} from '/src/stores/game.js';


const events = gameStore()


</script>

<template>
  <div class="panel panel--fill">
    <table class="kv">
      <thead>
      <tr>
        <th>Engine</th>
        <th>Message</th>
      </tr>
      </thead>
      <tr v-for="event in events.log" :class="event.engine">
        <td> {{ event.engine }}</td>
        <td> {{ event.msg }}</td>
      </tr>
    </table>

  </div>
</template>

<style scoped>
.operations {
  color: purple;
}

.analytics {
  color: orange;
}

.optimizations {
  color: green;
}

.simulation {
  color: yellow;;
}
</style>
