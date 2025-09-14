<script setup>
import { computed } from 'vue'

const props = defineProps({
  tile: { type: Object, default: null }
})

const list = computed(() => Array.isArray(props.tile?.assemblies?.real) ? props.tile.assemblies.real : [])
const optimized = computed(() => Array.isArray(props.tile?.assemblies?.optimized) ? props.tile.assemblies.optimized : [])
</script>

<template>
  <div>
    <!-- Optimized assemblies as pills -->
    <section class="panel" v-if="optimized.length">
      <div class="panel-header-row">
        <h4>Planned Actions</h4>
      </div>
      <div class="panel-body">
        <ul class="pills">
          <li v-for="(o, i) in optimized" :key="i" class="pill">{{ o.category }} : {{o.action}}</li>
        </ul>
      </div>
    </section>

    <!-- Real assemblies -->
    <p v-if="list.length === 0" class="panel">No assemblies on this tile.</p>

    <section v-for="a in list" :key="a.id" class="panel">
      <div class="panel-header-row">
        <h4>{{ a.name || 'Unnamed Assembly' }}</h4>
        <div>
          <span class="btn btn--add" :disabled="!a.built">built: {{ a.built ? 'yes' : 'no' }}</span>
          <span class="btn btn--sell" :disabled="!a.deployed">deployed: {{ a.deployed ? 'yes' : 'no' }}</span>
        </div>
      </div>

      <div class="panel-body">
        <h5 class="group-title">Modules</h5>
        <table class="kv kv-wrap inner">
          <tbody>
          <tr v-for="(m, i) in a.modules || []" :key="i">
            <td style="width: 30%">{{ m.type }}</td>
            <td>{{ m.subtype || '—' }}</td>
          </tr>
          </tbody>
        </table>

        <h5 class="group-title">Attributes</h5>
        <table class="kv compact">
          <thead>
          <tr><th>Moves</th><th>Actions</th><th>Orders</th><th>ID</th></tr>
          </thead>
          <tbody>
          <tr>
            <td>{{ a.moves ?? 0 }}</td>
            <td>{{ a.actions ?? 0 }}</td>
            <td>{{ (a.orders && a.orders.length) || 0 }}</td>
            <td class="kv-wrap">{{ a.id }}</td>
          </tr>
          </tbody>
        </table>

        <div v-if="a.orders && a.orders.length">
          <h5 class="group-title">Orders</h5>
          <table class="kv kv-wrap inner onecol">
            <tbody>
            <tr v-for="(o, i) in a.orders" :key="i">
              <td>{{ o }}</td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* Small, local pill styling; aligns with panel/kv look without touching global CSS */
.pills {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  padding: 0;
  margin: 0;
  list-style: none;
}
.pill {
  padding: 2px 8px;
  border: 1px solid var(--color-border);
  border-radius: 999px;
  font-size: 12px;
  line-height: 1.6;
}
</style>
