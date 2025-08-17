import {defineStore} from 'pinia'
import {ref, watch} from 'vue'

export const effectStore = defineStore('effectStore', () => {

    const active = ref([])
    const effects= {
        soil: {
            fertilizer:      { key:'soil.fertilizer',      target:'tile', property:'fertility',  unit:'abs', defaultDelta: 1,   description:'Increases soil fertility' },
            soil_loosen:     { key:'soil.soil_loosen',     target:'tile', property:'compaction', unit:'abs', defaultDelta:-1,   description:'Loosens soil and improves aeration' },
            nitrogen_fixing: { key:'soil.nitrogen_fixing', target:'tile', property:'fertility',  unit:'abs', defaultDelta: 1,   description:'Increases soil nitrogen naturally' },
            ph_up:           { key:'soil.ph_up',           target:'tile', property:'ph',         unit:'abs', defaultDelta: 0.2, description:'Raises soil pH' },
            ph_down:         { key:'soil.ph_down',         target:'tile', property:'ph',         unit:'abs', defaultDelta:-0.2, description:'Lowers soil pH' }
        },
        water: {
            water_consumption:{ key:'water.water_consumption', target:'tile', property:'water', unit:'abs', defaultDelta:-1, description:'Reduces soil water' }
        },
        biotic: {
            pest_control:     { key:'biotic.pest_control',     target:'tile', property:'pests',       unit:'abs', defaultDelta:-1, description:'Reduces pests on this tile and nearby map' },
            weed_suppression: { key:'biotic.weed_suppression', target:'tile', property:'weeds',       unit:'abs', defaultDelta:-1, description:'Suppresses weeds on tile' },
            pollination:      { key:'biotic.pollination',      target:'tile', property:'pollination', unit:'abs', defaultDelta: 1, description:'Boosts pollination' },
            defense:          { key:'biotic.defense',          target:'tile', property:'defense',     unit:'abs', defaultDelta: 1, description:'Protects from negative events' },
            synergy:          { key:'biotic.synergy',          target:'tile', property:'yield',       unit:'abs', defaultDelta: 1, description:'Yield/resistance boost from symbiosis' },
            surprise:         { key:'biotic.surprise',         target:'tile', property:null,          unit:'abs', defaultDelta: 0, description:'Easter egg / narrative' }
        },
        ops: {
            outage:           { key:'ops.outage',              target:'global', property:null,        unit:'abs', defaultDelta: 0, description:'Operations outage today' }
        },
        modifiers: {
            weather: {
                evaporation:    { key:'modifiers.weather.evaporation',   target:'tile', property:'water',       unit:'abs', defaultDelta:-2, description:'Dry air and heat reduce soil water' },
                infiltration:   { key:'modifiers.weather.infiltration',  target:'tile', property:'water',       unit:'abs', defaultDelta: 3,  description:'Rain increases soil water' },
                pollination_up: { key:'modifiers.weather.pollination_up',target:'tile', property:'pollination', unit:'abs', defaultDelta: 1,  description:'Fair weather improves pollination' },
                pollination_dn: { key:'modifiers.weather.pollination_dn',target:'tile', property:'pollination', unit:'abs', defaultDelta:-1, description:'Wind/rain/cold reduce pollination' },
                disease_press:  { key:'modifiers.weather.disease_press', target:'tile', property:'pests',       unit:'abs', defaultDelta: 1,  description:'Humidity increases disease pressure' },
                weed_press:     { key:'modifiers.weather.weed_press',    target:'tile', property:'weeds',       unit:'abs', defaultDelta: 1,  description:'Warm wet conditions promote weeds' }
            }
        }
    }

    return {active, effects}
})
