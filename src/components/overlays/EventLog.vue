<script setup>
import { computed } from 'vue'
import {gameStore} from '/src/stores/game.js'
import simpleTable from '@/components/overlays/blocks/SimpleTable.vue'

const events = gameStore()

const headers = ['Engine', 'Message']

const rows = computed(() =>
    (events.log || []).map(ev => ({
      className: ev.engine,
      cells: [ev.engine, ev.msg]
    }))
)

</script>

<template>
  <div class="panel panel--fill">
    <simpleTable
        title="Event Log"
        :headers="headers"
        :data="rows"
        :startOpen="true"
        class="noToggle"
    />
  </div>
</template>

<style scoped>

</style>
