<script setup>
import { eventsStore }  from '/src/stores/events.js';


const events = eventsStore()


</script>

<template>
<div class="logModal">
  EventLog {{events.log}}
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
}
.operations{
  color: green;
}
.analytics{
  color: orange;
}

.optimizations{
  color: purple;
}
</style>
