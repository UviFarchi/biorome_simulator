<script setup>
import { computed, toRef } from 'vue'
import eventBus from '@/eventBus.js'
import { gameStore } from '@/stores/game.js'
import simpleTable from '@/components/overlays/blocks/SimpleTable.vue'

const game = gameStore()
const props = defineProps({ collapsed: { type: Boolean, default: false } })
const collapsed = toRef(props, 'collapsed')

const headers = ['Event', 'Days remaining']

const weatherRows = computed(() =>
    (game.currentEvents?.weather || []).map(ev => [
      ev?.headline || ev?.id || '—',
      ev?.remaining ?? '—'
    ])
)

const marketRows = computed(() =>
    (game.currentEvents?.market || []).map(ev => [
      ev?.headline || ev?.id || '—',
      ev?.remaining ?? '—'
    ])
)

const ecologyRows = computed(() =>
    (game.currentEvents?.ecology || game.currentEvents?.ecosystem || []).map(ev => [
      ev?.headline || ev?.id || '—',
      ev?.remaining ?? '—'
    ])
)

const totalRows = computed(() =>
    weatherRows.value.length + marketRows.value.length + ecologyRows.value.length
)
</script>

<template>
  <div id="eventPanel" class="panel">
    <div class="panel-header" @click="eventBus.emit('overlay', { target: 'news' })">News</div>
    <div class="panel-body" v-show="!collapsed">
      <simpleTable
          title="Weather events"
          :headers="headers"
          :data="weatherRows"
          :startOpen="true"
          class="noToggle"
      />
      <simpleTable
          title="Market events"
          :headers="headers"
          :data="marketRows"
          :startOpen="true"
          class="noToggle"
      />
      <simpleTable
          title="Ecological events"
          :headers="headers"
          :data="ecologyRows"
          :startOpen="true"
          class="noToggle"
      />

      <div v-if="totalRows === 0" class="emptyHint">No active events.</div>
    </div>
  </div>
</template>

<style scoped>
.emptyHint { opacity: .7; font-size: 12px; margin-top: 6px; }
</style>
