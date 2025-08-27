/*
The sections are :
- Data missing: Flag any unmonitored properties in the tile or stale data in the properties
- Tile by tile diff between the optimized state and the current state of the tile: Compare each tile’s measured state vs optimization targets from previous phase;
- Weather: Report on weather trends, events and forecast and their farm-wide effects (many tiles lost water yesterday due to the heat, for example)
- Market: Report on market trends and their effects on what is being grown
- Ecological events: Report on ecosystem events and their effects.
- Resource use: Report on totals used for water, electricity and waste
*  */

<script setup>
import {computed, ref, defineComponent} from 'vue'
import {gameStore} from '@/stores/game.js'
import expandableTable from "@/components/overlays/AnalyticsReportBlocks/ExpandableTable.vue";
import simpleTable from "@/components/overlays/AnalyticsReportBlocks/SimpleTable.vue";
import weatherDays from "@/components/overlays/AnalyticsReportBlocks/WeatherDays.vue";

const game = gameStore()

const sectionsList = computed(() => ([
  {
    key: 'dataMissing',
    title: 'Data missing',
    subcomponents: [
      {
        type: 'simpleTable',
        id: 'dataMissing.summary',
        title: 'Summary',
        data: game.analyticsReport?.dataMissing?.summarySimpleTable?.rows || [],
        headers: game.analyticsReport?.dataMissing?.summarySimpleTable?.headers || ['Metric','Value']
      },
      {
        type: 'expandableTable',
        id: 'dataMissing.tiles',
        title: 'Tiles',
        data: game.analyticsReport?.dataMissing?.tilesExpandable || null
      }
    ]
  },

  {
    key: 'weather',
    title: 'Weather',
    subcomponents: [
      { type: 'weatherDays', id: 'weather.history',  title: 'Weather History',  data: game.analyticsReport?.weather?.history  || [] },
      { type: 'weatherDays', id: 'weather.forecast', title: 'Weather Forecast', data: game.analyticsReport?.weather?.forecast || [] },
      {
        type: 'simpleTable',
        id: 'weather.events',
        title: 'Active weather events',
        headers: ['Event','Days remaining'],
        data: (game.currentEvents?.weather || []).map(ev => [
          ev?.headline || ev?.id || '—',
          ev?.remaining ?? '—'
        ])
      }
    ]
  },

  {
    key: 'market',
    title: 'Market',
    subcomponents: [
      {
        type: 'simpleTable',
        id: 'market.events',
        title: 'Active market events',
        headers: ['Event','Days remaining'],
        data: (game.currentEvents?.market || game.analyticsReport?.market?.events || []).map(ev => [
          ev?.headline || ev?.id || '—',
          ev?.remaining ?? '—'
        ])
      }
    ]
  },

  {
    key: 'ecology',
    title: 'Ecological events',
    subcomponents: [
      {
        type: 'simpleTable',
        id: 'ecology.events',
        title: 'Active ecological events',
        headers: ['Event','Days remaining'],
        data: (
            game.currentEvents?.ecology ||
            game.currentEvents?.ecosystem ||
            game.analyticsReport?.ecology?.events ||
            []
        ).map(ev => [
          ev?.headline || ev?.id || '—',
          ev?.remaining ?? '—'
        ])
      }
    ]
  },

  {
    key: 'tileDiff',
    title: 'Tile-by-tile diff',
    subcomponents: [
      {
        type: 'simpleTable',
        id: 'tileDiff.overview',
        title: 'Overview',
        headers: ['Metric','Value'],
        data: [['Not implemented', '—']]
      }
    ]
  },

  {
    key: 'resourceUse',
    title: 'Resource use',
    subcomponents: [
      {
        type: 'simpleTable',
        id: 'resourceUse.today',
        title: 'Today',
        headers: ['Metric','Value'],
        data: [['Not implemented', '—']]
      }
    ]
  }
]))


const subcomponents = {
  simpleTable, expandableTable, weatherDays
}



</script>

<!-- Keep your <script setup> exactly as-is -->

<template>
  <div class="analyticsReport lane-fit">
    <section v-for="(section,index) in sectionsList" :title="section.title" :key="index" class="reportSection">
      <h1 class="sectionTitle" @click="e => e.target.parentElement.classList.toggle('active')">
        {{ section.title }}
      </h1>

      <!-- wrapper for body so we can animate/collapse cleanly -->
      <div class="sectionBody">
        <component
            v-for="(subsection) in section.subcomponents"
            :is="subcomponents[subsection.type]"
            :data="subsection.data"
            :title="subsection.title"
            :headers="subsection.headers"
        />
      </div>
    </section>
  </div>
</template>

<style scoped>
/* ---------- Theme tokens (fallbacks if global vars aren’t present) ---------- */
.analyticsReport {
  --panel-bg:       var(--ui-bg, #0c0c0f);
  --panel-elev:     var(--ui-elev, #101217);
  --panel-edge:     var(--ui-edge, #22262b);
  --panel-stripe:   var(--ui-stripe, rgba(255,255,255,.03));
  --text:           var(--ui-text, #e8eef2);
  --text-dim:       var(--ui-text-dim, #a9b4bd);
  --accent:         var(--ui-accent, #7df9ff);
  --accent-dim:     color-mix(in oklab, var(--accent), #000 40%);
  --shadow-inset:   inset 0 1px 0 rgba(255,255,255,.04), inset 0 -1px 0 rgba(0,0,0,.4);
  --shadow-raised:  0 1px 1px rgba(0,0,0,.35), 0 8px 24px rgba(0,0,0,.35);
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  color: var(--text);
}

/* keep content within lane, allow horizontal scroll if needed */
.lane-fit { max-width: 100%; overflow-x: hidden;  }

/* ---------- Sections ---------- */
.reportSection {
  position: relative;
  margin: 10px 0;
  border: 1px solid var(--panel-edge);
  background:
      repeating-linear-gradient(90deg, transparent 0 6px, var(--panel-stripe) 6px 7px),
      linear-gradient(180deg, var(--panel-elev), var(--panel-bg));
  border-radius: 6px;
  box-shadow: var(--shadow-raised);
  transition: border-color .2s ease, box-shadow .2s ease;
}
.reportSection:hover { border-color: color-mix(in oklab, var(--panel-edge), var(--accent) 25%); }

/* Title bar */
.sectionTitle {
  display: flex; align-items: center; justify-content: space-between;
  gap: 10px;
  margin: 0; padding: 10px 14px 9px 14px;
  font-size: 12px; line-height: 1;
  letter-spacing: .08em; text-transform: uppercase;
  color: var(--text);
  background:
      linear-gradient(180deg, rgba(255,255,255,.06), rgba(0,0,0,.2)),
      linear-gradient(180deg, #14171c, #0e1116);
  border-bottom: 1px solid var(--panel-edge);
  cursor: pointer;
  user-select: none;
  position: relative;
  box-shadow: var(--shadow-inset);
}
.sectionTitle::before {
  content: '';
  display: inline-block;
  width: 3px; height: 14px;
  margin-right: 8px;
  background: linear-gradient(180deg, var(--accent), var(--accent-dim));
  box-shadow: 0 0 6px var(--accent-dim);
}
.sectionTitle::after {
  content: '▾';
  margin-left: auto;
  color: var(--text-dim);
  transition: transform .18s ease;
}
.reportSection.active .sectionTitle::after { transform: rotate(180deg); }

/* Collapsible body */
.sectionBody {

  overflow-y: auto;
  overflow-x: hidden;
  transition: max-height .26s ease;
  padding: 0 12px; /* reserved space; will be applied when open */
}
.reportSection.active .sectionBody {
  padding: 10px 12px 12px;
  max-height: 1200px; /* plenty; body height is unknown */
}

/* ---------- Tables (shared across subcomponents) ---------- */
:deep(.kv) {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
  font-size: 12.5px;
  background: linear-gradient(180deg, rgba(255,255,255,.02), rgba(0,0,0,.2));
  border: 1px solid var(--panel-edge);
  margin: 8px 0;
  color: var(--text);
}
:deep(.kv th), :deep(.kv td) {
  border: 1px solid color-mix(in oklab, var(--panel-edge), #000 25%);
  padding: 6px 8px;
  white-space: nowrap;
  text-align: left;
  vertical-align: top;
}
:deep(.kv.compact th), :deep(.kv.compact td) { padding: 5px 7px; }
:deep(.kv th) {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: .06em;
  color: var(--text-dim);
  background: linear-gradient(180deg, #151a20, #10151b);
  position: sticky; /* helpful when tables overflow vertically */
  top: 0;
  z-index: 1;
}
:deep(.kv tbody tr:nth-child(odd) td) {
  background-color: rgba(255,255,255,.015);
}
:deep(.kv tbody tr:hover td) {
  background-color: rgba(125, 249, 255, .05);
}

/* inner one-column tables in expandable cells */
:deep(.kv.inner) { border: 0; background: transparent; }
:deep(.kv.inner td) { border: 0; padding: 2px 0; }
:deep(.kv.inner.onecol td) { white-space: normal; }

/* Chips / tokens */
:deep(.token) {
  display: inline-block;
  margin: 2px 6px 2px 0;
  padding: 2px 6px;
  border: 1px solid color-mix(in oklab, var(--panel-edge), var(--accent) 25%);
  border-radius: 6px;
  background: linear-gradient(180deg, rgba(125,249,255,.08), rgba(125,249,255,.02));
  color: var(--text);
  box-shadow: inset 0 1px 0 rgba(255,255,255,.05);
}

/* Utilities */
:deep(.wrap) { white-space: normal; word-break: break-word; overflow-wrap: anywhere; }
:deep(.tight) { width: 1%; }
:deep(.expand-cell) { white-space: nowrap; }
:deep(.inline-expand) { margin-top: 4px; white-space: normal; cursor: pointer; max-width: 100%; }

/* Links-as-buttons */
/* subcomponent headers */
:deep(.table-header) {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 10px 0 6px;
  padding: 6px 8px;
  border: 1px solid var(--panel-edge);
  border-radius: 6px;
  background:
      linear-gradient(180deg, rgba(255,255,255,.03), rgba(0,0,0,.18)),
      linear-gradient(180deg, #151a20, #10151b);
  box-shadow: var(--shadow-inset);
}
:deep(.table-header > strong) {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: .08em;
  color: var(--text-dim);
}
:deep(.table-header .linklike) {
  margin-left: auto;
  padding: 3px 10px;
  border: 1px solid color-mix(in oklab, var(--panel-edge), var(--accent) 25%);
  border-radius: 999px;
  text-decoration: none;
  color: var(--text);
  background: radial-gradient(100% 100% at 50% 0%, rgba(125,249,255,.10) 0, rgba(125,249,255,0) 60%);
  box-shadow: inset 0 1px 0 rgba(255,255,255,.06);
  line-height: 1.2;
}

/* generic linklike, used inside tables/expands too */
:deep(.linklike) {
  background: none;
  border: 0;
  padding: 0;
  color: var(--accent);
  text-decoration: underline dotted;
  cursor: pointer;
  font: inherit;
}
:deep(.linklike:hover) { color: color-mix(in oklab, var(--accent), #fff 10%); }
:deep(.linklike:focus-visible) { outline: 2px solid var(--accent); outline-offset: 2px; }

/* Subtle panel scanlines (container-level; no :deep needed) */
.reportSection::after {
  content: '';
  position: absolute; inset: 0;
  pointer-events: none;
  background:
      repeating-linear-gradient(0deg, transparent 0 2px, rgba(255,255,255,.008) 2px 3px);
  border-radius: 6px;
}

</style>
