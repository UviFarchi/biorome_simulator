import {defineStore} from 'pinia'
import {ref, watch} from 'vue'

export const eventsStore = defineStore('eventsStore', () => {

    const log = ref([])
    const active = ref([])
    // Canonical events
    const possible =
        [

            {
                id: 'event-1',
                type: 'event',
                headline: 'Locust Swarm',
                details: 'Pest pressure rises on all crops.',
                frequency: 0.04,
                duration: 3,
                effect: [
                    {target: 'tile', property: 'pests', delta: 2}
                ]
            },
            {
                id: 'event-2',
                type: 'event',
                headline: 'Organic Trend',
                details: 'Organic produce is in high demand!',
                frequency: 0.02,
                duration: 5,
                effect: [
                    {target: 'market', affectedTypes: ['allPlants'], priceModifier: 1.3}
                ]
            },
            {
                id: 'event-3',
                type: 'event',
                headline: 'Fungal Disease',
                details: 'Humidity triggers fungal problems for some crops.',
                frequency: 0.03,
                duration: 3,
                effect: [
                    {target: 'plantType', plant: ['Wheat', 'Barley', 'Oats', 'Strawberry'], health: -8}
                ]
            },
            {
                id: 'event-4',
                type: 'event',
                headline: 'Wildlife Incursion',
                details: 'Wild boars and birds raid unprotected fields. Defense helps!',
                frequency: 0.01,
                duration: 1,
                effect: [
                    {target: 'tile', property: 'defense', delta: -2},
                    {target: 'plantType', plant: null, health: -6}
                ]
            },
            {
                id: 'event-5',
                type: 'event',
                headline: 'Beneficial Insects',
                details: 'A surge in ladybugs and bees boosts pollination and pest control.',
                frequency: 0.07,
                duration: 2,
                effect: [
                    {target: 'tile', property: 'pollination', delta: 2},
                    {target: 'tile', property: 'pests', delta: -2}
                ]
            },
            // Market events
            {
                id: 'market-1',
                type: 'market',
                headline: 'Corn Price Surge',
                details: 'Corn prices spike after export shortage.',
                frequency: 0.10,
                duration: 4,
                effect: [
                    {target: 'market', affectedTypes: ['Corn'], priceModifier: 1.4}
                ]
            },
            {
                id: 'market-2',
                type: 'market',
                headline: 'Wool Demand Drops',
                details: 'Warm weather lowers demand for wool products.',
                frequency: 0.08,
                duration: 3,
                effect: [
                    {target: 'market', affectedTypes: ['Wool'], priceModifier: 0.7}
                ]
            },
            {
                id: 'market-3',
                type: 'market',
                headline: 'Excess Honey',
                details: 'Local honey market is flooded, prices drop.',
                frequency: 0.05,
                duration: 4,
                effect: [
                    {target: 'market', affectedTypes: ['Honey'], priceModifier: 0.6}
                ]
            },
            // Special/fun
            {
                id: 'special-1',
                type: 'event',
                headline: 'Surprise Donkey Day',
                details: 'Your donkey causes a commotion. See the news for details!',
                frequency: 0.01,
                duration: 1,
                effect: [
                    {target: 'event', property: 'surprise', delta: 1}
                ]
            },
            {
                id: 'special-2',
                type: 'event',
                headline: 'Mushroom Fairy Ring',
                details: 'A magical circle of mushrooms boosts soil fertility in a random tile!',
                frequency: 0.01,
                duration: 1,
                effect: [
                    {target: 'tile', property: 'fertility', delta: 3, tileCount: 1}
                ]
            },
        ]

    const effects = {
        // FERTILITY & SOIL
        fertilizer: {
            property: 'fertility',
            delta: 1, // or set per animal/plant
            description: 'Increases soil fertility'
        },
        soil_loosen: {
            property: 'compaction',
            delta: -1,
            description: 'Loosens soil and improves aeration'
        },

        // WATER
        water_consumption: {
            property: 'water',
            delta: -1, // Consumed per turn by plant/animal
            description: 'Reduces soil water'
        },

        // PEST CONTROL
        pest_control: {
            property: 'pests',
            delta: -1, // Or set to -effect.strength
            description: 'Reduces pests on this tile and nearby map'
        },

        // POLLINATION
        pollination: {
            property: 'pollination',
            delta: 1,
            description: 'Boosts pollination, increases fruit/seed yield'
        },

        // DEFENSE
        defense: {
            property: 'defense',
            delta: 1,
            description: 'Protects from negative events, theft, or predators'
        },

        // WEEDS
        weed_suppression: {
            property: 'weeds',
            delta: -1,
            description: 'Suppresses weeds on tile'
        },

        // NITROGEN FIXING (if you add, e.g., clover/legumes)
        nitrogen_fixing: {
            property: 'fertility',
            delta: 1,
            description: 'Increases soil nitrogen naturally'
        },

        // POLYCULTURE/SYMBIOSIS (for certain combinations)
        synergy: {
            property: 'yield',
            delta: 1,
            description: 'Boosts yield or resistance due to symbiosis'
        },

        // SURPRISE (for donkey Easter egg, can be handled in events or news)
        surprise: {
            property: null,
            delta: null,
            description: 'Does something fun or unexpected'
        },
        ph_up: {
            property: 'ph',
            delta: 0.2,  // Increases soil pH (less acidic)
            description: 'Raises soil pH'
        },
        ph_down: {
            property: 'ph',
            delta: -0.2, // Decreases soil pH (more acidic)
            description: 'Lowers soil pH'
        },
    }

    return {log, active,  possible, effects}
})
