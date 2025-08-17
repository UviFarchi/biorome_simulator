<script setup>
import { onMounted, watch, ref } from 'vue'
import { mapStore } from '@/stores/map.js'

const canvas = ref(null)
const map = mapStore()

const clamp = (v, a, b) => Math.min(b, Math.max(a, v))

// Tunable palette for stronger separation
const palette = {
  landHueLow: 240,     // green lowlands
  landHueHigh: 0,     // red-brown highlands (wider span than before)
  landSat: 1,       // more saturated land colors
  gamma: 0.6,          // <1 exaggerates contrast; >1 flattens
  quantizeBands: 12,    // set for stepped topo bands; 0 disables
  lightBase: 0.58,     // base lightness at low elevation
  lightRange: 0.28,    // how much lightness drops with elevation
  shadeStrength: 0.30, // influence of hillshade (0..1)

  waterHue: 205,
  waterSat: 0.75,
  waterLightBase: 0.62,
  waterLightRange: 0.30
}

function paint () {
  const el = canvas.value
  if (!el) return

  const tiles = map.tiles
  const rows = tiles.length, cols = rows ? tiles[0].length : 0
  if (!rows || !cols) return

  const pxPerTile = 12
  const w = cols * pxPerTile
  const h = rows * pxPerTile

  const dpr = window.devicePixelRatio || 1
  el.width = w * dpr
  el.height = h * dpr
  el.style.width = '100%'
  el.style.height = '100%'

  const ctx = el.getContext('2d')
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  const img = ctx.createImageData(w, h)
  const data = img.data

  const [emin, emax] = map.topographyConstraints?.elevationRange ?? [0, 100]
  const espan = Math.max(1e-6, emax - emin)

  // bilinear sampler over the tile grid
  function sample (u, v, getter) {
    const x = clamp(u, 0, cols - 1)
    const y = clamp(v, 0, rows - 1)
    const c0 = Math.floor(x), r0 = Math.floor(y)
    const c1 = Math.min(c0 + 1, cols - 1), r1 = Math.min(r0 + 1, rows - 1)
    const tx = x - c0, ty = y - r0

    const z00 = getter(tiles[r0][c0])
    const z10 = getter(tiles[r0][c1])
    const z01 = getter(tiles[r1][c0])
    const z11 = getter(tiles[r1][c1])

    const a = z00 * (1 - tx) + z10 * tx
    const b = z01 * (1 - tx) + z11 * tx
    return a * (1 - ty) + b * ty
  }

  const elevAt = (u, v) => sample(u, v, t => t.topo.elevation.env)
  const wtabAt = (u, v) => sample(u, v, t => t.topo.waterTable.env)

  // gentle hillshade from elevation gradient
  const grad = 0.25
  function shade (u, v) {
    const e1 = elevAt(u + grad, v), e2 = elevAt(u - grad, v)
    const e3 = elevAt(u, v + grad), e4 = elevAt(u, v - grad)
    const gx = (e1 - e2)
    const gy = (e3 - e4)
    const g = clamp(Math.hypot(gx, gy) / (espan * 0.15), 0, 1)
    return 1 - 0.35 * g // 0.65..1.0
  }

  function hslToRgb (h, s, l) {
    s = clamp(s, 0, 1); l = clamp(l, 0, 1)
    const c = (1 - Math.abs(2 * l - 1)) * s
    const hh = ((h % 360) + 360) % 360 / 60
    const x = c * (1 - Math.abs((hh % 2) - 1))
    let r = 0, g = 0, b = 0
    if (0 <= hh && hh < 1) [r, g, b] = [c, x, 0]
    else if (1 <= hh && hh < 2) [r, g, b] = [x, c, 0]
    else if (2 <= hh && hh < 3) [r, g, b] = [0, c, x]
    else if (3 <= hh && hh < 4) [r, g, b] = [0, x, c]
    else if (4 <= hh && hh < 5) [r, g, b] = [x, 0, c]
    else [r, g, b] = [c, 0, x]
    const m = l - c / 2
    return [(r + m) * 255, (g + m) * 255, (b + m) * 255]
  }

  let p = 0
  for (let y = 0; y < h; y++) {
    const v = (y + 0.5) / pxPerTile
    for (let x = 0; x < w; x++) {
      const u = (x + 0.5) / pxPerTile

      const e = elevAt(u, v)
      const wt = wtabAt(u, v)

      let r, g, b
      if (e <= wt) {
        // water: darker as it gets deeper
        const depth = clamp((wt - e) / Math.max(1, espan * 0.15), 0, 1)
        const L = palette.waterLightBase - palette.waterLightRange * depth
        ;[r, g, b] = hslToRgb(palette.waterHue, palette.waterSat, L)
      } else {
        // land: wider hue span, optional quantization, gamma curve, hillshade
        let t = clamp((e - emin) / espan, 0, 1)
        if (palette.quantizeBands > 1) {
          t = Math.round(t * (palette.quantizeBands - 1)) / (palette.quantizeBands - 1)
        }
        t = Math.pow(t, palette.gamma)

        const hue = palette.landHueLow + (palette.landHueHigh - palette.landHueLow) * t
        const lightNoShade = palette.lightBase + palette.lightRange * (1 - t)
        const sh = clamp(shade(u, v), 0, 1)
        const light = lightNoShade * (1 - palette.shadeStrength * (1 - sh))

        ;[r, g, b] = hslToRgb(hue, palette.landSat, light)
      }

      data[p++] = r | 0
      data[p++] = g | 0
      data[p++] = b | 0
      data[p++] = 255
    }
  }
  ctx.putImageData(img, 0, 0)
}

onMounted(paint)
watch(() => [map.size, map.tiles], paint, { deep: true })
</script>


<template>
  <canvas ref="canvas" class="terrain-canvas" />
</template>

<style scoped>
.terrain-canvas{
  position:absolute;
  inset:0;
  width:100%;
  height:100%;
  display:block;
}
</style>
