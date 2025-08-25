<script setup>
import {gameStore} from '/src/stores/game.js';


const events = gameStore()


</script>

<template>
  <div class="logModal">
    <table>
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
.logModal {

  background: black;
  color: white;
  bottom: 0;
  overflow: auto;

}

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
