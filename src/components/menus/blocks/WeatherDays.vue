<script setup>
import { ref } from 'vue'

const props = defineProps({
  title: { type: String, required: true },
  // Keep the contract: all subcomponents receive `data`
  data:  { type: Array,  default: () => [] },
  startOpen: { type: Boolean, default: false }
})

const isOpen = ref(!!props.startOpen)
const toggle = () => { isOpen.value = !isOpen.value }
</script>

<template>
  <div class="lane-fit">
    <div class="table-header">
      <strong>{{ title }}</strong>
      <button class="linklike" @click="toggle">
        {{ isOpen ? 'Hide ⌃' : 'Show ⌄' }}
      </button>
    </div>

    <table v-if="isOpen" class="kv compact fixed lane-fit">
      <tbody>
      <tr>
        <td class="wrap">
          Not implemented yet.
          <span v-if="Array.isArray(data)"> (received {{ data.length }} day entries) </span>
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>
