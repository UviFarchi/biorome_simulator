<!-- src/components/overlays/AnalyticsReportBlocks/ExpandableTable.vue -->
<script setup>
import { ref, computed, reactive } from 'vue'

const props = defineProps({
  title: { type: String, required: true },
  // Expected shape (from buildDataMissing):
  // {
  //   headersLeft: ['Tile','Missing','Stale','Missing details','Stale details'],
  //   columnsLeft: [{key:'tileLabel',label:'Tile',width:'12%'}, {key:'missingCount',...}, {key:'staleCount',...}],
  //   expandHeaders: ['Group','Fields'],
  //   rows: [{ rowKey, row, col, tileLabel, missingCount, staleCount,
  //            expandA:{ title, groups:[{cat,items:[]}] },
  //            expandB:{ title, groups:[{cat,items:[]}] } }]
  // }
  data: { type: Object, default: null },
  startOpen: { type: Boolean, default: false }
})

const isOpen = ref(!!props.startOpen)

// per-row expansion state (booleans keyed by rowKey)
const open = reactive({ A: Object.create(null), B: Object.create(null) })

const rows = computed(() => Array.isArray(props.data?.rows) ? props.data.rows : [])
const columnsLeft  = computed(() => Array.isArray(props.data?.columnsLeft) ? props.data.columnsLeft : [])
const headersLeft  = computed(() => Array.isArray(props.data?.headersLeft) ? props.data.headersLeft : [])
const expandHeaders = computed(() =>
    Array.isArray(props.data?.expandHeaders) ? props.data.expandHeaders : ['Group','Fields']
)

function rowKey(r) { return r?.rowKey || (r ? `${r.row},${r.col}` : '') }
function isOpenA(r) { return !!open.A[rowKey(r)] }
function isOpenB(r) { return !!open.B[rowKey(r)] }
function toggleA(r) { const k=rowKey(r); if(!k) return; open.A[k] = !open.A[k] }
function toggleB(r) { const k=rowKey(r); if(!k) return; open.B[k] = !open.B[k] }

function display(v) {
  if (v == null) return '—'
  return typeof v === 'number' && Number.isFinite(v) ? String(v) : String(v)
}
</script>

<template>
  <div class="lane-fit">
    <div class="table-header">
      <strong>{{ title }}</strong>
      <button class="linklike" @click="isOpen = !isOpen">{{ isOpen ? 'Hide ⌃' : 'Show ⌄' }}</button>
    </div>

    <table v-if="isOpen && data" class="kv compact fixed lane-fit">
      <colgroup>
        <col v-for="c in columnsLeft" :key="c.key" :style="c.width ? { width: c.width } : null" />
        <col style="width:35%" />
        <col style="width:35%" />
      </colgroup>

      <thead>
      <tr>
        <th v-for="(h,i) in headersLeft" :key="'h-'+i">{{ h }}</th>
      </tr>
      </thead>

      <tbody>
      <tr v-for="r in rows" :key="rowKey(r)">
        <!-- left columns -->
        <td v-for="c in columnsLeft" :key="c.key" class="wrap tight">{{ display(r[c.key]) }}</td>

        <!-- Missing details -->
        <td class="expand-cell">
          <button class="linklike" @click.stop="toggleA(r)">{{ isOpenA(r) ? 'Hide ⌃' : 'Show ⌄' }}</button>
          <div v-if="isOpenA(r)" class="inline-expand lane-fit" @click="toggleA(r)">
            <table class="kv inner onecol lane-fit">
              <thead><tr><th class="wrap">{{ r.expandA?.title || 'Details' }}</th></tr></thead>
              <tbody>
              <tr v-for="g in (r.expandA?.groups || [])" :key="'a-'+rowKey(r)+'-'+g.cat">
                <td class="wrap">
                  <strong>{{ g.cat }}</strong>
                  <span v-if="g.items?.length">: {{ g.items.join(', ') }}</span>
                  <span v-else> —</span>
                </td>
              </tr>
              <tr v-if="!(r.expandA?.groups?.length)"><td>—</td></tr>
              </tbody>
            </table>
          </div>
        </td>

        <!-- Stale details -->
        <td class="expand-cell">
          <button class="linklike" @click.stop="toggleB(r)">{{ isOpenB(r) ? 'Hide ⌃' : 'Show ⌄' }}</button>
          <div v-if="isOpenB(r)" class="inline-expand lane-fit" @click="toggleB(r)">
            <table class="kv inner onecol lane-fit">
              <thead><tr><th class="wrap">{{ r.expandB?.title || 'Details' }}</th></tr></thead>
              <tbody>
              <tr v-for="g in (r.expandB?.groups || [])" :key="'b-'+rowKey(r)+'-'+g.cat">
                <td class="wrap">
                  <strong>{{ g.cat }}</strong>
                  <span v-if="g.items?.length">: {{ g.items.join(', ') }}</span>
                  <span v-else> —</span>
                </td>
              </tr>
              <tr v-if="!(r.expandB?.groups?.length)"><td>—</td></tr>
              </tbody>
            </table>
          </div>
        </td>
      </tr>

      <tr v-if="!rows.length">
        <td :colspan="(columnsLeft.length + 2)">—</td>
      </tr>
      </tbody>
    </table>

    <div v-else-if="isOpen && !data">—</div>
  </div>
</template>
