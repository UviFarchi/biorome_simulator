import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const themeStore = defineStore('theme', () => {
  const theme = ref(localStorage.getItem('theme') || 'dark')

  document.documentElement.dataset.theme = theme.value

  watch(theme, (val) => {
    document.documentElement.dataset.theme = val
    localStorage.setItem('theme', val)
  }, { immediate: true })

  function toggle () {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
  }

  return { theme, toggle }
})

