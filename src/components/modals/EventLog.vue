<script setup>
import { gameStore }  from '/src/stores/game.js';


const events = gameStore()


</script>

<template>
<div class="logModal">
  <div v-for="event in events.log">
    <p :class="event.engine">{{event}}</p>
  </div>
</div>
</template>

<style scoped>
.logModal{
  position: absolute;
  background: black;
  color: white;
  bottom:0;
  width:98vw;
  margin: 0 auto;
  max-height: 75vh;
  overflow: auto;

}
.operations{
  color: purple;
}
.analytics{
  color: orange;
}

.optimizations{
  color: green;
}

.simulation{
  color:yellow;;
}
</style>
