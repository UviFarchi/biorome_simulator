import {defineStore} from 'pinia'
import {ref, watch} from 'vue'

export const effectStore = defineStore('effectStore', () => {

    const active = ref([])
    const tile = {
        animals: {
            cow: [
                {target: 'resource', property: 'water', delta: -4, scale: 'per_head'},
                {target: 'soil', property: 'ammoniumN_mgkg', delta: +3, scale: 'per_head'},
                {target: 'soil', property: 'organicCarbonPct', delta: +0.02, scale: 'per_head'},
                {target: 'soil', property: 'penetrationResistance_MPa', delta: +0.05, scale: 'per_head'},
                {target: 'plant', property: 'trampling', delta: -1, scale: 'per_head'},
                {target: 'pest', property: 'fly_control', delta: +1, when: {season: 'warm'}}
            ],
            goat: [
                {target: 'resource', property: 'water', delta: -3, scale: 'per_head'},
                {target: 'soil', property: 'ammoniumN_mgkg', delta: +1.5, scale: 'per_head'},
                {target: 'soil', property: 'organicCarbonPct', delta: +0.01, scale: 'per_head'},
                {target: 'plant', property: 'weed_suppression', delta: +2, scale: 'per_head'},
                {target: 'plant', property: 'overgrazing', delta: -1, scale: 'per_head'}
            ],
            sheep: [
                {target: 'resource', property: 'water', delta: -3, scale: 'per_head'},
                {target: 'soil', property: 'ammoniumN_mgkg', delta: +1.2, scale: 'per_head'},
                {target: 'soil', property: 'organicCarbonPct', delta: +0.01, scale: 'per_head'},
                {target: 'plant', property: 'weed_suppression', delta: +1, scale: 'per_head'},
                {target: 'plant', property: 'overgrazing', delta: -1, scale: 'per_head'}
            ],
            pig: [
                {target: 'resource', property: 'water', delta: -2, scale: 'per_head'},
                {target: 'soil', property: 'ammoniumN_mgkg', delta: +2, scale: 'per_head'},
                {target: 'soil', property: 'organicCarbonPct', delta: +0.02, scale: 'per_head'},
                {target: 'soil', property: 'aggregateStability_Pct', delta: -1, scale: 'per_head'},
                {target: 'soil', property: 'infiltrationRate_mmhr', delta: +1, scale: 'per_head'},
                {target: 'plant', property: 'weed_suppression', delta: +1, scale: 'per_head'},
                {target: 'yield', property: 'crop_damage', delta: -3, scale: 'per_head'}
            ],
            chicken: [
                {target: 'resource', property: 'water', delta: -1, scale: 'per_head'},
                {target: 'soil', property: 'ammoniumN_mgkg', delta: +1, scale: 'per_head'},
                {target: 'pest', property: 'insect_control', delta: -1, scale: 'per_head'},
                {target: 'plant', property: 'weed_suppression', delta: +1, scale: 'per_head'},
                {target: 'yield', property: 'crop_damage', delta: -1, scale: 'per_head'}
            ],
            duck: [
                {target: 'resource', property: 'water', delta: -2, scale: 'per_head'},
                {target: 'pest', property: 'insect_control', delta: -1, scale: 'per_head'},
                {target: 'plant', property: 'weed_suppression', delta: +2, scale: 'per_head'},
                {target: 'soil', property: 'ammoniumN_mgkg', delta: +1, scale: 'per_head'}
            ],
            bee: [
                {target: 'plant', property: 'pollination', delta: +2, scale: 'per_head'}
            ],
            rabbit: [
                {target: 'resource', property: 'water', delta: -1, scale: 'per_head'},
                {target: 'plant', property: 'weed_suppression', delta: +1, scale: 'per_head'},
                {target: 'soil', property: 'ammoniumN_mgkg', delta: +0.5, scale: 'per_head'},
                {target: 'yield', property: 'crop_damage', delta: -2, scale: 'per_head'}
            ],
            horse: [
                {target: 'resource', property: 'water', delta: -4, scale: 'per_head'},
                {target: 'defense', property: 'predator_deterrence', delta: +1, scale: 'per_head'},
                {target: 'soil', property: 'ammoniumN_mgkg', delta: +1.5, scale: 'per_head'},
                {target: 'soil', property: 'organicCarbonPct', delta: +0.01, scale: 'per_head'},
                {target: 'plant', property: 'overgrazing', delta: -1, scale: 'per_head'}
            ],
            donkey: [
                {target: 'resource', property: 'water', delta: -3, scale: 'per_head'},
                {target: 'defense', property: 'predator_deterrence', delta: +2, scale: 'per_head'},
                {target: 'soil', property: 'ammoniumN_mgkg', delta: +1, scale: 'per_head'}
            ],
            ladybug: [
                {target: 'pest', property: 'aphid_control', delta: -3, scale: 'per_head'}
            ],
            dog: [
                {target: 'resource', property: 'water', delta: -1, scale: 'per_head'},
                {target: 'defense', property: 'predator_deterrence', delta: +2, scale: 'per_head'},
                {target: 'pest', property: 'rodent_control', delta: -1, scale: 'per_head'}
            ],
            fish_tilapia: [
                // waterConsumption handled by aquatic system, not soil
                {target: 'soil', property: 'ammoniumN_mgkg', delta: +0.5, scale: 'per_head'},
                {
                    target: 'plant',
                    property: 'weed_suppression',
                    delta: +1,
                    scale: 'per_head',
                    when: {habitat: 'aquatic'}
                }
            ],
            fish_trout: [
                {target: 'soil', property: 'ammoniumN_mgkg', delta: +0.5, scale: 'per_head'},
                {target: 'pest', property: 'mosquito_control', delta: -1, scale: 'per_head', when: {habitat: 'aquatic'}}
            ],
            hawk: [
                {target: 'pest', property: 'rodent_control', delta: -3, scale: 'per_head'},
                {target: 'yield', property: 'poultry_loss', delta: -2, scale: 'per_head'}
            ],
            snake: [
                {target: 'pest', property: 'rodent_control', delta: -2, scale: 'per_head'},
                {target: 'yield', property: 'egg_loss', delta: -1, scale: 'per_head'}
            ],
            earthworm: [
                {target: 'soil', property: 'structure', delta: +2, scale: 'per_head'},
                {target: 'soil', property: 'organicCarbonPct', delta: +0.005, scale: 'per_head'}
            ],
            dung_beetle: [
                {target: 'soil', property: 'organicCarbonPct', delta: +0.01, scale: 'per_head'},
                {target: 'pest', property: 'fly_control', delta: -2, scale: 'per_head'},
                {target: 'soil', property: 'structure', delta: +1, scale: 'per_head'}
            ],
            frog: [
                {target: 'pest', property: 'insect_control', delta: -2, scale: 'per_head'}
            ],
            shrimp: [
                // aquatic nutrient cycling expressed on soil for paddy-style tiles; gate by habitat if needed
                {target: 'soil', property: 'ammoniumN_mgkg', delta: +0.3, scale: 'per_head'}
            ],
            deer: [
                {target: 'plant', property: 'weed_suppression', delta: +1, scale: 'per_head'},
                {target: 'yield', property: 'crop_loss', delta: -4, scale: 'per_head'}
            ],
            wild_boar: [
                {target: 'soil', property: 'aggregateStability_Pct', delta: -2, scale: 'per_head'},
                {target: 'soil', property: 'penetrationResistance_MPa', delta: -0.05, scale: 'per_head'}, // loosening
                {target: 'yield', property: 'crop_damage', delta: -5, scale: 'per_head'}
            ],
            bear: [
                {target: 'defense', property: 'apex_presence', delta: +3, scale: 'per_head'},
                {target: 'yield', property: 'raiding', delta: -4, scale: 'per_head'}
            ],
            fox: [
                {target: 'pest', property: 'rodent_control', delta: -2, scale: 'per_head'},
                {target: 'yield', property: 'poultry_loss', delta: -2, scale: 'per_head'}
            ],
            raccoon: [
                {target: 'pest', property: 'rodent_control', delta: -1, scale: 'per_head'},
                {target: 'yield', property: 'crop_damage', delta: -3, scale: 'per_head'}
            ],
            locust: [
                {target: 'yield', property: 'crop_loss', delta: -5, scale: 'per_head'},
                {target: 'soil', property: 'ammoniumN_mgkg', delta: +1, scale: 'per_head', when: {after: 'dieoff'}}
            ],
            mosquito: [
                {target: 'plant', property: 'pollination', delta: +1, scale: 'per_head'},
                {target: 'health', property: 'livestock_stress', delta: -2, scale: 'per_head'}
            ],
            butterfly: [
                {target: 'plant', property: 'pollination', delta: +1, scale: 'per_head'},
                {
                    target: 'yield',
                    property: 'foliage_damage',
                    delta: -1,
                    scale: 'per_head',
                    when: {stage: 'caterpillar'}
                }
            ],
            owl: [
                {target: 'pest', property: 'rodent_control', delta: -2, scale: 'per_head'},
                {target: 'defense', property: 'presence', delta: +1, scale: 'per_head'}
            ],
            cat: [
                {target: 'defense', property: 'rodent_control', delta: -1, scale: 'per_head'},
                {target: 'health', property: 'toxoplasmosis', delta: -1, scale: 'per_head'}
            ]
        },
        plants: {
            grass: [
                {target: 'soil', property: 'water', delta: -1, scale: 'per_area'},                                  // waterRequired 600
                {target: 'soil', property: 'organicCarbonPct', delta: +0.005, scale: 'per_area'},                   // litter
                {target: 'soil', property: 'penetrationResistance_MPa', delta: +0.01, scale: 'per_area'},           // “compaction” proxy
                {target: 'plant', property: 'weed_suppression', delta: +2, scale: 'per_area'}
            ],

            corn: [
                {target: 'soil', property: 'water', delta: -2, scale: 'per_area'},
                {target: 'soil', property: 'nitrateN_mgkg', delta: -0.6, scale: 'per_area'},
                {target: 'soil', property: 'phosphateP_mgkg', delta: -0.25, scale: 'per_area'},
                {target: 'soil', property: 'potassiumK_mgkg', delta: -0.15, scale: 'per_area'},
                {target: 'plant', property: 'pests', delta: +1, scale: 'per_area'}
            ],

            tomato: [
                {target: 'soil', property: 'water', delta: -2, scale: 'per_area'},
                {target: 'soil', property: 'nitrateN_mgkg', delta: -0.6, scale: 'per_area'},
                {target: 'soil', property: 'phosphateP_mgkg', delta: -0.25, scale: 'per_area'},
                {target: 'soil', property: 'potassiumK_mgkg', delta: -0.15, scale: 'per_area'},
                {target: 'plant', property: 'pests', delta: +2, scale: 'per_area'}
            ],

            lettuce: [
                {target: 'soil', property: 'water', delta: -1, scale: 'per_area'},
                {target: 'plant', property: 'pests', delta: +1, scale: 'per_area'}
            ],

            carrot: [
                {target: 'soil', property: 'water', delta: -1, scale: 'per_area'},
                {target: 'soil', property: 'nitrateN_mgkg', delta: -0.48, scale: 'per_area'},  // fertReq 80 → NPK split
                {target: 'soil', property: 'phosphateP_mgkg', delta: -0.2, scale: 'per_area'},
                {target: 'soil', property: 'potassiumK_mgkg', delta: -0.12, scale: 'per_area'},
                {target: 'soil', property: 'penetrationResistance_MPa', delta: -0.02, scale: 'per_area'}            // “soil_loosen”
            ],

            oats: [
                {target: 'soil', property: 'nitrateN_mgkg', delta: -0.36, scale: 'per_area'},  // fertReq 60 split
                {target: 'soil', property: 'phosphateP_mgkg', delta: -0.15, scale: 'per_area'},
                {target: 'soil', property: 'potassiumK_mgkg', delta: -0.09, scale: 'per_area'},
                {target: 'soil', property: 'penetrationResistance_MPa', delta: -0.01, scale: 'per_area'}            // de-compaction
            ],

            barley: [
                {target: 'soil', property: 'water', delta: -1, scale: 'per_area'},
                {target: 'soil', property: 'nitrateN_mgkg', delta: -0.48, scale: 'per_area'},  // fertReq 80 split
                {target: 'soil', property: 'phosphateP_mgkg', delta: -0.2, scale: 'per_area'},
                {target: 'soil', property: 'potassiumK_mgkg', delta: -0.12, scale: 'per_area'}
            ],

            wheat: [
                {target: 'soil', property: 'water', delta: -1, scale: 'per_area'},
                {target: 'soil', property: 'nitrateN_mgkg', delta: -0.6, scale: 'per_area'},   // fertReq 100 split
                {target: 'soil', property: 'phosphateP_mgkg', delta: -0.25, scale: 'per_area'},
                {target: 'soil', property: 'potassiumK_mgkg', delta: -0.15, scale: 'per_area'},
                {target: 'plant', property: 'weed_suppression', delta: +1, scale: 'per_area'}
            ],

            strawberry: [
                {target: 'plant', property: 'pollination', delta: +1, scale: 'per_area'},
                {target: 'soil', property: 'water', delta: -2, scale: 'per_area'},
                {target: 'pest', property: 'insect_control', delta: +1, scale: 'per_area'}      // “attract” pests → inverse control
            ],

            blueberry: [
                {target: 'soil', property: 'ph', delta: -1, scale: 'per_area'},
                {target: 'plant', property: 'pollination', delta: +1, scale: 'per_area'},
                {target: 'soil', property: 'water', delta: -1, scale: 'per_area'}
            ],

            coffee: [
                {target: 'soil', property: 'ph', delta: -1, scale: 'per_area'},
                {target: 'atmosphere', property: 'moisturePct', delta: +1, when: {stage: 'canopy'}},
                {target: 'soil', property: 'water', delta: -2, scale: 'per_area'},
                {target: 'soil', property: 'nitrateN_mgkg', delta: -1.2, scale: 'per_area'},   // fertReq 200 split
                {target: 'soil', property: 'phosphateP_mgkg', delta: -0.5, scale: 'per_area'},
                {target: 'soil', property: 'potassiumK_mgkg', delta: -0.3, scale: 'per_area'}
            ],

            rice: [
                {target: 'soil', property: 'water', delta: -3, scale: 'per_area'},
                {target: 'tile', property: 'weeds', delta: -1},
                {target: 'tile', property: 'pests', delta: +1},
                {target: 'soil', property: 'nitrateN_mgkg', delta: -0.9, scale: 'per_area'},   // fertReq 150 split
                {target: 'soil', property: 'phosphateP_mgkg', delta: -0.375, scale: 'per_area'},
                {target: 'soil', property: 'potassiumK_mgkg', delta: -0.225, scale: 'per_area'},
                {target: 'atmosphere', property: 'moisturePct', delta: +1}
            ],

            lotus: [
                {target: 'soil', property: 'water', delta: -2, scale: 'per_area'},
                {target: 'tile', property: 'pollination', delta: +1},
                {target: 'tile', property: 'weeds', delta: -1},
                {target: 'tile', property: 'pests', delta: +1}
            ],

            water_spinach: [
                {target: 'soil', property: 'water', delta: -2, scale: 'per_area'},
                {target: 'tile', property: 'weeds', delta: -1},
                {target: 'soil', property: 'nitrateN_mgkg', delta: -0.24, scale: 'per_area'},  // fertReq 40 split
                {target: 'soil', property: 'phosphateP_mgkg', delta: -0.1, scale: 'per_area'},
                {target: 'soil', property: 'potassiumK_mgkg', delta: -0.06, scale: 'per_area'}
            ],

            duckweed: [
                {target: 'tile', property: 'weeds', delta: +1},
                {target: 'soil', property: 'nitrateN_mgkg', delta: -0.0, scale: 'per_area'},   // fertReq 0 → keep tiny uptake via effect
                {target: 'tile', property: 'pests', delta: +1},
                {target: 'plant', property: 'shading', delta: +1}
            ],

            water_hyacinth: [
                {target: 'tile', property: 'weeds', delta: +3},
                {target: 'plant', property: 'competition', delta: -2},
                {target: 'soil', property: 'nitrateN_mgkg', delta: -0.0, scale: 'per_area'},   // fertReq 0, still uptakes dissolved N
                {target: 'plant', property: 'shading', delta: +2}
            ],

            barnyard_grass: [
                {target: 'soil', property: 'water', delta: -1, scale: 'per_area'}
            ],

            pumpkin: [
                {target: 'soil', property: 'water', delta: -3, scale: 'per_area'},
                {target: 'soil', property: 'nitrateN_mgkg', delta: -0.6, scale: 'per_area'},   // fertReq 100 split
                {target: 'soil', property: 'phosphateP_mgkg', delta: -0.25, scale: 'per_area'},
                {target: 'soil', property: 'potassiumK_mgkg', delta: -0.15, scale: 'per_area'},
                {target: 'plant', property: 'weed_suppression', delta: +2, scale: 'per_area'}
            ],

            lavender: [
                {target: 'plant', property: 'pests', delta: -2, scale: 'per_area'},
                {target: 'tile', property: 'pollination', delta: +2}
            ],

            clover: [
                {target: 'soil', property: 'water', delta: -1, scale: 'per_area'},
                {target: 'soil', property: 'nitrateN_mgkg', delta: +0.6, scale: 'per_area'}    // N fixation → net N add
            ],

            sunflower: [
                {target: 'tile', property: 'pollination', delta: +2},
                {target: 'soil', property: 'nitrateN_mgkg', delta: -0.48, scale: 'per_area'},  // fertReq 80 split
                {target: 'soil', property: 'phosphateP_mgkg', delta: -0.2, scale: 'per_area'},
                {target: 'soil', property: 'potassiumK_mgkg', delta: -0.12, scale: 'per_area'}
            ],

            almond_tree: [
                {target: 'soil', property: 'organicCarbonPct', delta: +0.01, scale: 'per_area'},
                {target: 'soil', property: 'water', delta: -2, scale: 'per_area'},
                {target: 'atmosphere', property: 'tempC', delta: -1},
                {target: 'plant', property: 'pollination', delta: +2},
                {target: 'soil', property: 'salinity_dSm', delta: +0.1}
            ],

            orange_tree: [
                {target: 'soil', property: 'water', delta: -3, scale: 'per_area'},
                {target: 'plant', property: 'pollination', delta: +2},
                {target: 'soil', property: 'ph', delta: -0.3, scale: 'per_area'},
                {target: 'plant', property: 'pests', delta: +1, scale: 'per_area'},
                {target: 'plant', property: 'weed_suppression', delta: +1, scale: 'per_area'}
            ],

            apple_tree: [
                {target: 'plant', property: 'pollination', delta: +1},
                {target: 'soil', property: 'organicCarbonPct', delta: +0.01, scale: 'per_area'},
                {target: 'atmosphere', property: 'tempC', delta: -1}
            ],

            oak_tree: [
                {target: 'soil', property: 'organicCarbonPct', delta: +0.015, scale: 'per_area'},
                {target: 'plant', property: 'weed_suppression', delta: +2},
                {target: 'soil', property: 'ph', delta: -0.1, scale: 'per_area'},
                {target: 'atmosphere', property: 'tempC', delta: -1},
                {target: 'atmosphere', property: 'moisturePct', delta: +1},
                {target: 'tile', property: 'pests', delta: +1}
            ],

            poplar: [
                {target: 'soil', property: 'water', delta: -2, scale: 'per_area'},
                {target: 'soil', property: 'organicCarbonPct', delta: +0.01, scale: 'per_area'},
                {target: 'soil', property: 'ec_dSm', delta: -0.1, scale: 'per_area'},
                {target: 'atmosphere', property: 'moisturePct', delta: +1},
                {target: 'soil', property: 'penetrationResistance_MPa', delta: -0.01, scale: 'per_area'}
            ],

            pear_tree: [
                {target: 'plant', property: 'pollination', delta: +1, scale: 'per_area'},
                {target: 'soil', property: 'water', delta: -2, scale: 'per_area'},                 // waterRequired 600
                {target: 'soil', property: 'organicCarbonPct', delta: +0.01, scale: 'per_area'},
                {target: 'soil', property: 'nitrateN_mgkg', delta: -0.36, scale: 'per_area'},        // fertRequired 60 → NPK 60/25/15
                {target: 'soil', property: 'phosphateP_mgkg', delta: -0.15, scale: 'per_area'},
                {target: 'soil', property: 'potassiumK_mgkg', delta: -0.09, scale: 'per_area'}
            ],

            lemon_tree: [
                {target: 'plant', property: 'pollination', delta: +2, scale: 'per_area'},
                {target: 'soil', property: 'water', delta: -3, scale: 'per_area'},                // waterRequired 1000
                {target: 'soil', property: 'ph', delta: -0.3, scale: 'per_area'},
                {target: 'plant', property: 'pests', delta: +1, scale: 'per_area'},
                {target: 'soil', property: 'nitrateN_mgkg', delta: -1.08, scale: 'per_area'},        // fertRequired 180
                {target: 'soil', property: 'phosphateP_mgkg', delta: -0.45, scale: 'per_area'},
                {target: 'soil', property: 'potassiumK_mgkg', delta: -0.27, scale: 'per_area'}
            ],

            willow: [
                {target: 'soil', property: 'water', delta: -3, scale: 'per_area'},               // waterRequired 1000
                {target: 'soil', property: 'salinity_dSm', delta: -0.2, scale: 'per_area'},
                {target: 'soil', property: 'penetrationResistance_MPa', delta: -0.02, scale: 'per_area'},// de-compaction
                {target: 'soil', property: 'nitrateN_mgkg', delta: -0.48, scale: 'per_area'},        // fertRequired 80
                {target: 'soil', property: 'phosphateP_mgkg', delta: -0.20, scale: 'per_area'},
                {target: 'soil', property: 'potassiumK_mgkg', delta: -0.12, scale: 'per_area'}
            ],


            grape_vine: [
                {target: 'plant', property: 'pollination', delta: +1, scale: 'per_area'},
                {target: 'pest', property: 'fungal_risk', delta: +1, scale: 'per_area'},
                {target: 'soil', property: 'water', delta: -1, scale: 'per_area'},                // waterRequired 600 → moderate
                {target: 'soil', property: 'nitrateN_mgkg', delta: -0.30, scale: 'per_area'},        // fertRequired 50
                {target: 'soil', property: 'phosphateP_mgkg', delta: -0.125, scale: 'per_area'},
                {target: 'soil', property: 'potassiumK_mgkg', delta: -0.075, scale: 'per_area'}
            ]

        },
        topo: {
            elevation: [{target: 'soil', property: 'water', delta: -1, scale: 'per_area'}],
            slopeDeg: [{target: 'soil', property: 'water', delta: -1, scale: 'per_area'}],
            aspectDeg: [{target: 'soil', property: 'water', delta: -1, scale: 'per_area'}],
            waterTable: [{target: 'soil', property: 'water', delta: -1, scale: 'per_area'}],
            drainageIndex: [{target: 'soil', property: 'water', delta: -1, scale: 'per_area'}],
        },

        soil: {
            // CHEMISTRY (measurable)
            ph: [{target: 'soil', property: 'water', delta: -1, scale: 'per_area'}],
            ec_dSm: [{target: 'soil', property: 'water', delta: -1, scale: 'per_area'}],
            salinity_dSm: [{target: 'soil', property: 'water', delta: -1, scale: 'per_area'}],
            cec_cmolkg: [{target: 'soil', property: 'water', delta: -1, scale: 'per_area'}],
            organicCarbonPct: [{target: 'soil', property: 'water', delta: -1, scale: 'per_area'}],

            nutrients: {
                nitrateN_mgkg: [{target: 'soil', property: 'water', delta: -1, scale: 'per_area'}],
                ammoniumN_mgkg: [{target: 'soil', property: 'water', delta: -1, scale: 'per_area'}],
                phosphateP_mgkg: [{target: 'soil', property: 'water', delta: -1, scale: 'per_area'}],
                potassiumK_mgkg: [{target: 'soil', property: 'water', delta: -1, scale: 'per_area'}],
                dissolvedOrganicN_mgkg: [{target: 'soil', property: 'water', delta: -1, scale: 'per_area'}],
            },

            heavyMetals_mgkg: {
                Cd: [{target: 'soil', property: 'water', delta: -1, scale: 'per_area'}],
                Pb: [{target: 'soil', property: 'water', delta: -1, scale: 'per_area'}],
                As: [{target: 'soil', property: 'water', delta: -1, scale: 'per_area'}],
            },

            // PHYSICS (measurable)
            water: [{target: 'soil', property: 'water', delta: -1, scale: 'per_area'}],
            infiltrationRate_mmhr: [{target: 'soil', property: 'water', delta: -1, scale: 'per_area'}],
            bulkDensity_gcm3: [{target: 'soil', property: 'water', delta: -1, scale: 'per_area'}],
            penetrationResistance_MPa: [{target: 'soil', property: 'water', delta: -1, scale: 'per_area'}],
            aggregateStability_Pct: [{target: 'soil', property: 'water', delta: -1, scale: 'per_area'}],
            hydraulicConductivity_mmhr: [{target: 'soil', property: 'water', delta: -1, scale: 'per_area'}],
            soilTemperature_C: [{target: 'soil', property: 'water', delta: -1, scale: 'per_area'}],

            // BIOLOGY (measurable, not indices)
            microbialCFU_good_perg: [{target: 'soil', property: 'water', delta: -1, scale: 'per_area'}],
            microbialCFU_bad_perg: [{target: 'soil', property: 'water', delta: -1, scale: 'per_area'}],
            mycorrhizalColonization_Pct: [{target: 'soil', property: 'water', delta: -1, scale: 'per_area'}],
            earthwormCount_perm2: [{target: 'soil', property: 'water', delta: -1, scale: 'per_area'}],
        }
    }
    const weather = {
        temperature: [{target: 'soil', property: 'water', delta: -1, scale: 'per_area'}],
        rainfall: [{target: 'soil', property: 'water', delta: -1, scale: 'per_area'}],
        cloudCover: [{target: 'soil', property: 'water', delta: -1, scale: 'per_area'}],
        currentLabel: [{target: 'soil', property: 'water', delta: -1, scale: 'per_area'}],
        windKph: [{target: 'soil', property: 'water', delta: -1, scale: 'per_area'}],
    }

    return {active, tile, weather}
})
