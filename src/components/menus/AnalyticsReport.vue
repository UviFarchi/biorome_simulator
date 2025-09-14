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
import expandableTable from '@/components/menus/blocks/ExpandableTable.vue';
import simpleTable from '@/components/menus/blocks/SimpleTable.vue';
import weatherDays from '@/components/menus/blocks/WeatherDays.vue';

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

<!-- TODO => Add actual analysis to weather, market and ecological events rather than just listing the events and forecast. -->

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
            :key="subsection.type + '-' + (subsection.title || '')"
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
  --panel-bg:       var(--ui-bg, var(--color-background));
  --panel-elev:     var(--ui-elev, color-mix(in srgb, var(--color-background), var(--color-text) 5%));
  --panel-edge:     var(--ui-edge, var(--color-border));
  --panel-stripe:   var(--ui-stripe, color-mix(in srgb, var(--color-text) 3%, transparent));
  --text:           var(--ui-text, var(--color-text));
  --text-dim:       var(--ui-text-dim, color-mix(in srgb, var(--color-text) 70%, var(--color-background)));
  --accent:         var(--ui-accent, var(--color-accent));
  --accent-dim:     color-mix(in oklab, var(--accent), var(--color-background) 40%);
  --shadow-inset:   inset 0 1px 0 color-mix(in srgb, var(--color-text) 4%, transparent), inset 0 -1px 0 color-mix(in srgb, var(--color-background) 40%, transparent);
  --shadow-raised:  0 1px 1px color-mix(in srgb, var(--color-background) 35%, transparent), 0 8px 24px color-mix(in srgb, var(--color-background) 35%, transparent);
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
      linear-gradient(180deg, color-mix(in srgb, var(--color-text) 6%, transparent), color-mix(in srgb, var(--color-background) 20%, transparent)),
      linear-gradient(180deg, color-mix(in srgb, var(--color-background), var(--color-text) 8%), color-mix(in srgb, var(--color-background), var(--color-text) 4%));
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
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  overflow-y: auto;
  overflow-x: hidden;
  transition: max-height .26s ease;
  padding: 0 12px; /* reserved space; will be applied when open */
}

.sectionBody > :deep(.lane-fit) {
  flex: 1 1 300px;
}
.reportSection.active .sectionBody {
  padding: 10px 12px 12px;
  max-height: 1200px; /* plenty; body height is unknown */
}

/* Chips / tokens */
:deep(.token) {
  display: inline-block;
  margin: 2px 6px 2px 0;
  padding: 2px 6px;
  border: 1px solid color-mix(in oklab, var(--panel-edge), var(--accent) 25%);
  border-radius: 6px;
  background: linear-gradient(180deg, color-mix(in srgb, var(--accent) 8%, transparent), color-mix(in srgb, var(--accent) 2%, transparent));
  color: var(--text);
  box-shadow: inset 0 1px 0 color-mix(in srgb, var(--text) 5%, transparent);
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
      linear-gradient(180deg, color-mix(in srgb, var(--color-text) 3%, transparent), color-mix(in srgb, var(--color-background) 18%, transparent)),
      linear-gradient(180deg, color-mix(in srgb, var(--color-background), var(--color-text) 10%), color-mix(in srgb, var(--color-background), var(--color-text) 5%));
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
  background: radial-gradient(100% 100% at 50% 0%, color-mix(in srgb, var(--accent) 10%, transparent) 0, transparent 60%);
  box-shadow: inset 0 1px 0 color-mix(in srgb, var(--text) 6%, transparent);
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
:deep(.linklike:hover) { color: color-mix(in oklab, var(--accent), var(--color-text) 10%); }
:deep(.linklike:focus-visible) { outline: 2px solid var(--accent); outline-offset: 2px; }

/* Subtle panel scanlines (container-level; no :deep needed) */
.reportSection::after {
  content: '';
  position: absolute; inset: 0;
  pointer-events: none;
  background:
      repeating-linear-gradient(0deg, transparent 0 2px, color-mix(in srgb, var(--text) 0.8%, transparent) 2px 3px);
  border-radius: 6px;
}

</style>
