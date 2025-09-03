import {defineStore} from 'pinia'
import {ref} from 'vue'
export const plantStore = defineStore('plantStore', () => {
    const plantTypes = ref(
        [
            {
                type: 'grass', icon: '🌱',
                scientificName: 'Lolium perenne',
                description: 'Perennial forage grass; fast-growing, multiple seasonal cuts; used for hay and pasture.',
                growthStages: ['seed', 'seedling', 'juvenile', 'mature', 'old'],
                heightPerGrowthStage: [0, 10, 20, 30],
                daysPerGrowthStage: [7, 21, 40, 20, 365],
                fruiting: {
                    requiresPollination: false,
                    mode: 'self',
                    vectors: [],
                    stages: ['vegetative', 'ripe', 'overripe'],
                    daysPerStage: [40, 20, 8],
                    fruitingWindows: [
                        {startMonth: 5, startDay: 15, endMonth: 6, endDay: 30},
                        {startMonth: 9, startDay: 1, endMonth: 9, endDay: 30}
                    ]
                },
                yield: 8000,
                seedRate_kg_per_ha: 10,
                seedlingDensity_per_ha: 10,
                productKey: 'hay',
                plantMaterialKey: 'waste',
                removedWhenHarvested: false,
                habitat: 'land'
            },
            {
                type: 'corn', icon: '🌽',
                scientificName: 'Zea mays',
                description: 'Annual cereal crop; wind-pollinated grass with high grain yield.',
                growthStages: ['seed', 'seedling', 'juvenile', 'mature', 'old'],
                heightPerGrowthStage: [0, 10, 20, 30],
                daysPerGrowthStage: [7, 14, 50, 30, 60],
                fruiting: {
                    requiresPollination: true,
                    mode: 'wind',
                    vectors: ['wind'],
                    stages: ['flowering', 'green fruit', 'ripe', 'overripe'],
                    daysPerStage: [10, 8, 8, 4],
                    fruitingWindows: [
                        {startMonth: 7, startDay: 1, endMonth: 8, endDay: 15},
                        {startMonth: 9, startDay: 1, endMonth: 10, endDay: 15}
                    ]
                },
                yield: 8000,
                seedRate_kg_per_ha: 10,
                seedlingDensity_per_ha: 10,
                productKey: 'corn_cob',
                plantMaterialKey: 'waste',
                removedWhenHarvested: true,
                habitat: 'land'
            },
            {
                type: 'tomato', icon: '🍅',
                scientificName: 'Solanum lycopersicum',
                description: 'Annual fruiting vegetable; insect-pollinated; high-yield crop in warm seasons.',
                growthStages: ['seed', 'seedling', 'juvenile', 'mature', 'old'],
                heightPerGrowthStage: [0, 10, 20, 30],
                daysPerGrowthStage: [8, 12, 30, 15, 60],
                fruiting: {
                    requiresPollination: true,
                    mode: 'insect',
                    vectors: ['bee', 'fly'],
                    stages: ['flowering', 'green fruit', 'ripe', 'overripe'],
                    daysPerStage: [15, 10, 10, 5],
                    fruitingWindows: [
                        {startMonth: 7, startDay: 1, endMonth: 8, endDay: 15},
                        {startMonth: 9, startDay: 1, endMonth: 9, endDay: 30}
                    ]
                },
                yield: 50000,
                seedRate_kg_per_ha: 10.3,
                seedlingDensity_per_ha: 10,
                productKey: 'tomato_fruit',
                plantMaterialKey: 'waste',
                removedWhenHarvested: true,
                habitat: 'land'
            },
            {
                type: 'lettuce', icon: '🥬',
                scientificName: 'Lactuca sativa',
                description: 'Annual leafy vegetable; harvested before bolting; vegetative yield crop.',
                growthStages: ['seed', 'seedling', 'juvenile', 'mature', 'old'],
                heightPerGrowthStage: [0, 10, 20, 30],
                daysPerGrowthStage: [4, 10, 30, 15, 30],
                fruiting: {
                    requiresPollination: false,
                    mode: 'self',
                    vectors: [],
                    stages: ['vegetative', 'ripe', 'overripe'],
                    daysPerStage: [30, 7, 6],
                    fruitingWindows: [
                        {startMonth: 4, startDay: 15, endMonth: 6, endDay: 15},
                        {startMonth: 9, startDay: 1, endMonth: 10, endDay: 15}
                    ]
                },
                yield: 25000,
                seedRate_kg_per_ha: 10,
                seedlingDensity_per_ha: 10,
                productKey: 'lettuce_leaf',
                plantMaterialKey: 'waste',
                removedWhenHarvested: true,
                habitat: 'land'
            },
            {
                type: 'carrot', icon: '🥕',
                scientificName: 'Daucus carota subsp. sativus',
                description: 'Root vegetable biennial grown as annual; harvested before flowering; vegetative yield.',
                growthStages: ['seed', 'seedling', 'juvenile', 'mature', 'old'],
                heightPerGrowthStage: [0, 10, 20, 30],
                daysPerGrowthStage: [14, 14, 35, 20, 40],
                fruiting: {
                    requiresPollination: false,
                    mode: 'self',
                    vectors: [],
                    stages: ['vegetative', 'ripe', 'overripe'],
                    daysPerStage: [35, 10, 5],
                    fruitingWindows: [
                        {startMonth: 6, startDay: 1, endMonth: 7, endDay: 31}
                    ]
                },
                yield: 40000,
                seedRate_kg_per_ha: 10,
                seedlingDensity_per_ha: 10,
                productKey: 'carrot_root',
                plantMaterialKey: 'waste',
                removedWhenHarvested: true,
                habitat: 'land'
            },
            {
                type: 'pumpkin', icon: '🎃',
                scientificName: 'Cucurbita pepo',
                description: 'Annual cucurbit; insect-pollinated; grown for fruit harvested in autumn.',
                growthStages: ['seed', 'seedling', 'juvenile', 'mature', 'old'],
                heightPerGrowthStage: [0, 10, 20, 30],
                daysPerGrowthStage: [7, 14, 40, 30, 30],
                fruiting: {
                    requiresPollination: true,
                    mode: 'insect',
                    vectors: ['bee'],
                    stages: ['flowering', 'green fruit', 'ripe', 'overripe'],
                    daysPerStage: [15, 15, 10, 6],
                    fruitingWindows: [
                        {startMonth: 9, startDay: 15, endMonth: 10, endDay: 31}
                    ]
                },
                yield: 35000,
                seedRate_kg_per_ha: 10,
                seedlingDensity_per_ha: 10,
                productKey: 'pumpkin_fruit',
                plantMaterialKey: 'waste',
                removedWhenHarvested: true,
                habitat: 'land'
            },
            {
                // Lavender
                type: 'lavender', icon: '💜',
                scientificName: 'Lavandula angustifolia',
                description: 'Perennial aromatic shrub grown for flowers and essential oil; insect-pollinated.',
                growthStages: ['seed', 'seedling', 'juvenile', 'mature', 'old'],
                heightPerGrowthStage: [0, 10, 20, 30],
                daysPerGrowthStage: [21, 30, 30, 40, 365],
                fruiting: {
                    requiresPollination: true,
                    mode: 'insect',
                    vectors: ['bee', 'butterfly', 'fly'],
                    stages: ['flowering', 'green fruit', 'ripe', 'overripe'],
                    daysPerStage: [20, 10, 10, 6],
                    fruitingWindows: [{startMonth: 6, startDay: 1, endMonth: 7, endDay: 15}]
                },
                yield: 1000,
                seedRate_kg_per_ha: 10,
                seedlingDensity_per_ha: 10,
                productKey: 'lavender_flower',
                plantMaterialKey: 'waste',
                removedWhenHarvested: false,
                habitat: 'land'
            },
            {
                // Clover
                type: 'clover', icon: '☘️',
                scientificName: 'Trifolium pratense',
                description: 'Perennial/short-lived legume used for forage and cover; insect-pollinated.',
                growthStages: ['seed', 'seedling', 'juvenile', 'mature', 'old'],
                heightPerGrowthStage: [0, 10, 20, 30],
                daysPerGrowthStage: [10, 14, 30, 26, 365],
                fruiting: {
                    requiresPollination: true,
                    mode: 'insect',
                    vectors: ['bee', 'butterfly', 'fly'],
                    stages: ['flowering', 'green fruit', 'ripe', 'overripe'],
                    daysPerStage: [10, 8, 8, 4],
                    fruitingWindows: [{startMonth: 5, startDay: 1, endMonth: 6, endDay: 30}]
                },
                yield: 10000,
                seedRate_kg_per_ha: 10,
                seedlingDensity_per_ha: 10,
                productKey: 'clover_flower',
                plantMaterialKey: 'waste',
                removedWhenHarvested: false,
                habitat: 'land'
            },
            {
                // Sunflower
                type: 'sunflower', icon: '🌻',
                scientificName: 'Helianthus annuus',
                description: 'Annual oilseed/ornamental; insect-pollinated heads; summer harvest.',
                growthStages: ['seed', 'seedling', 'juvenile', 'mature', 'old'],
                heightPerGrowthStage: [0, 10, 20, 30],
                daysPerGrowthStage: [7, 10, 40, 31, 30],
                fruiting: {
                    requiresPollination: true,
                    mode: 'insect',
                    vectors: ['bee', 'butterfly', 'fly'],
                    stages: ['flowering', 'green fruit', 'ripe', 'overripe'],
                    daysPerStage: [15, 10, 10, 6],
                    fruitingWindows: [{startMonth: 8, startDay: 15, endMonth: 9, endDay: 30}]
                },
                yield: 2500,
                seedRate_kg_per_ha: 10,
                seedlingDensity_per_ha: 10,
                productKey: 'sunflower_seed',
                plantMaterialKey: 'waste',
                removedWhenHarvested: true,
                habitat: 'land'
            },
            {
                // Wheat
                type: 'wheat', icon: '🌾',
                scientificName: 'Triticum aestivum',
                description: 'Annual cereal grain; wind-pollinated; harvested at full grain maturity.',
                growthStages: ['seed', 'seedling', 'juvenile', 'mature', 'old'],
                heightPerGrowthStage: [0, 10, 20, 30],
                daysPerGrowthStage: [7, 14, 60, 21, 30],
                fruiting: {
                    requiresPollination: true,
                    mode: 'wind',
                    vectors: ['wind'],
                    stages: ['flowering', 'green fruit', 'ripe', 'overripe'],
                    daysPerStage: [7, 7, 7, 4],
                    fruitingWindows: [{startMonth: 7, startDay: 1, endMonth: 8, endDay: 1}]
                },
                yield: 4500,
                seedRate_kg_per_ha: 10,
                seedlingDensity_per_ha: 10,
                productKey: 'wheat_grain',
                plantMaterialKey: 'waste',
                removedWhenHarvested: true,
                habitat: 'land'
            },
            {
                // Barley
                type: 'barley', icon: '🌾',
                scientificName: 'Hordeum vulgare',
                description: 'Annual cereal grain; wind-pollinated; early summer harvest.',
                growthStages: ['seed', 'seedling', 'juvenile', 'mature', 'old'],
                heightPerGrowthStage: [0, 10, 20, 30],
                daysPerGrowthStage: [7, 14, 55, 21, 30],
                fruiting: {
                    requiresPollination: true,
                    mode: 'wind',
                    vectors: ['wind'],
                    stages: ['flowering', 'green fruit', 'ripe', 'overripe'],
                    daysPerStage: [7, 7, 7, 4],
                    fruitingWindows: [{startMonth: 7, startDay: 1, endMonth: 7, endDay: 31}]
                },
                yield: 7000,
                seedRate_kg_per_ha: 10,
                seedlingDensity_per_ha: 10,
                productKey: 'barley_grain',
                plantMaterialKey: 'waste',
                removedWhenHarvested: true,
                habitat: 'land'
            },
            {
                // Oats
                type: 'oats', icon: '🌾',
                scientificName: 'Avena sativa',
                description: 'Annual cereal grain; wind-pollinated panicles; cool-season crop.',
                growthStages: ['seed', 'seedling', 'juvenile', 'mature', 'old'],
                heightPerGrowthStage: [0, 10, 20, 30],
                daysPerGrowthStage: [7, 14, 50, 21, 30],
                fruiting: {
                    requiresPollination: true,
                    mode: 'wind',
                    vectors: ['wind'],
                    stages: ['flowering', 'green fruit', 'ripe', 'overripe'],
                    daysPerStage: [7, 7, 7, 4],
                    fruitingWindows: [{startMonth: 8, startDay: 1, endMonth: 8, endDay: 31}]
                },
                yield: 5000,
                seedRate_kg_per_ha: 10,
                seedlingDensity_per_ha: 10,
                productKey: 'oats_grain',
                plantMaterialKey: 'waste',
                removedWhenHarvested: true,
                habitat: 'land'
            },
            {
                // Identity
                type: 'strawberry',
                icon: '🍓',
                scientificName: 'Fragaria × ananassa',
                description: 'Perennial groundcover; produces berries twice per season; requires pollination for fruit set.',
                // Ontogeny
                growthStages: ['seed', 'seedling', 'juvenile', 'mature', 'old'],
                heightPerGrowthStage: [0, 10, 20, 30],
                daysPerGrowthStage: [14, 14, 90, 730, 730],
                // Seasonal reproduction
                fruiting: {
                    requiresPollination: true,
                    mode: 'insect',
                    vectors: ['bee', 'fly'],
                    stages: ['flowering', 'green fruit', 'ripe', 'overripe'],
                    daysPerStage: [7, 10, 10, 5],
                    fruitingWindows: [
                        {startMonth: 5, startDay: 20, endMonth: 6, endDay: 30},
                        {startMonth: 8, startDay: 15, endMonth: 9, endDay: 15}
                    ]
                },
                yield: 20000,
                seedRate_kg_per_ha: 10,
                seedlingDensity_per_ha: 10,
                productKey: 'strawberry_fruit',
                plantMaterialKey: 'waste',
                removedWhenHarvested: false,
                habitat: 'land'
            },
            {
                type: 'blueberry',
                icon: '🫐',
                scientificName: 'Vaccinium corymbosum',
                description: 'Perennial shrub with acidic soil preference; requires pollinators; fruits midsummer.',
                growthStages: ['seed', 'seedling', 'juvenile', 'mature', 'old'],
                heightPerGrowthStage: [0, 10, 20, 30],
                daysPerGrowthStage: [0, 30, 365, 3650, 3650],
                fruiting: {
                    requiresPollination: true,
                    mode: 'insect',
                    vectors: ['bee'],
                    stages: ['flowering', 'green fruit', 'ripe', 'overripe'],
                    daysPerStage: [10, 15, 10, 7],
                    fruitingWindows: [
                        {startMonth: 6, startDay: 25, endMonth: 7, endDay: 15},
                        {startMonth: 8, startDay: 1, endMonth: 8, endDay: 20}
                    ]
                },
                yield: 20000,
                seedRate_kg_per_ha: 10,
                seedlingDensity_per_ha: 10,
                productKey: 'blueberry_fruit',
                plantMaterialKey: 'waste',
                removedWhenHarvested: false,
                habitat: 'land'
            },
            {
                type: 'coffee',
                icon: '☕',
                scientificName: 'Coffea arabica',
                description: 'Perennial shrub native to tropical climates; insect-pollinated; produces coffee cherries.',
                growthStages: ['seed', 'seedling', 'juvenile', 'mature', 'old'],
                heightPerGrowthStage: [0, 10, 20, 30],
                daysPerGrowthStage: [30, 730, 730, 1460, 1460],
                fruiting: {
                    requiresPollination: true,
                    mode: 'insect',
                    vectors: ['bee'],
                    stages: ['flowering', 'green fruit', 'ripe', 'overripe'],
                    daysPerStage: [14, 180, 30, 14],
                    fruitingWindows: [
                        {startMonth: 11, startDay: 1, endMonth: 1, endDay: 31}
                    ]
                },
                yield: 3000,
                seedRate_kg_per_ha: 10,
                seedlingDensity_per_ha: 10,
                productKey: 'coffee_beans',
                plantMaterialKey: 'waste',
                removedWhenHarvested: false,
                habitat: 'land'
            },
            {
                type: 'apple_tree',
                icon: '🍏',
                scientificName: 'Malus domestica',
                description: 'Deciduous tree; requires cross-pollination; produces apples in autumn.',
                growthStages: ['seed', 'seedling', 'sapling', 'mature', 'old'],
                heightPerGrowthStage: [0, 10, 20, 30],
                daysPerGrowthStage: [60, 730, 1095, 5475, 5475],
                fruiting: {
                    requiresPollination: true,
                    mode: 'insect',
                    vectors: ['bee', 'fly'],
                    stages: ['flowering', 'green fruit', 'ripe', 'overripe'],
                    daysPerStage: [10, 120, 30, 15],
                    fruitingWindows: [
                        {startMonth: 9, startDay: 1, endMonth: 10, endDay: 15}
                    ]
                },
                yield: 30000,
                seedRate_kg_per_ha: 10,
                seedlingDensity_per_ha: 10,
                productKey: 'apple',
                plantMaterialKey: 'wood',
                removedWhenHarvested: false,
                habitat: 'land'
            },
            {
                type: 'pear_tree',
                icon: '🍐',
                scientificName: 'Pyrus communis',
                description: 'Deciduous fruit tree; insect-pollinated; produces pears late summer to early fall.',
                growthStages: ['seed', 'seedling', 'sapling', 'mature', 'old'],
                heightPerGrowthStage: [0, 10, 20, 30],
                daysPerGrowthStage: [60, 730, 1095, 5110, 5110],
                fruiting: {
                    requiresPollination: true,
                    mode: 'insect',
                    vectors: ['bee'],
                    stages: ['flowering', 'green fruit', 'ripe', 'overripe'],
                    daysPerStage: [10, 110, 20, 10],
                    fruitingWindows: [
                        {startMonth: 8, startDay: 15, endMonth: 9, endDay: 30}
                    ]
                },
                yield: 30000,
                seedRate_kg_per_ha: 10,
                seedlingDensity_per_ha: 10,
                productKey: 'pear',
                plantMaterialKey: 'wood',
                removedWhenHarvested: false,
                habitat: 'land'
            },
            {
                type: 'grape_vine',
                icon: '🍇',
                scientificName: 'Vitis vinifera',
                description: 'Woody perennial vine; requires pollination; widely cultivated for wine, table grapes, and raisins.',
                growthStages: ['seed', 'seedling', 'juvenile', 'mature', 'old'],
                heightPerGrowthStage: [0, 10, 20, 30],
                daysPerGrowthStage: [30, 180, 730, 1825, 1825],
                fruiting: {
                    requiresPollination: true,
                    mode: 'self',
                    vectors: [],
                    stages: ['flowering', 'green fruit', 'ripe', 'overripe'],
                    daysPerStage: [7, 60, 30, 14],
                    fruitingWindows: [
                        {startMonth: 8, startDay: 15, endMonth: 10, endDay: 1}
                    ]
                },
                yield: 25000,
                seedRate_kg_per_ha: 10,
                seedlingDensity_per_ha: 10,
                productKey: 'grape',
                plantMaterialKey: 'waste',
                removedWhenHarvested: false,
                habitat: 'land'
            },
            {
                // Identity
                type: 'almond_tree',
                icon: '🌰',
                scientificName: 'Prunus dulcis',
                description: 'Perennial deciduous nut tree; deep-rooted, heavy spring bloom, high pollinator demand; leaf litter adds organic matter.',
                // Ontogeny
                growthStages: ['seed', 'seedling', 'sapling', 'mature', 'old'],
                heightPerGrowthStage: [0, 10, 20, 30],
                daysPerGrowthStage: [30, 730, 730, 3650, 3650],
                // Seasonal reproduction
                fruiting: {
                    requiresPollination: true,
                    mode: 'insect',
                    vectors: ['bee'],
                    stages: ['flowering', 'green fruit', 'ripe', 'overripe'],
                    daysPerStage: [7, 150, 30, 10],
                    fruitingWindows: [
                        {startMonth: 8, startDay: 1, endMonth: 9, endDay: 15}
                    ]
                },
                yield: 2800,
                seedRate_kg_per_ha: 10,
                seedlingDensity_per_ha: 10,
                productKey: 'almond',
                plantMaterialKey: 'wood',
                removedWhenHarvested: false,
                habitat: 'land'
            },
            {
                type: 'orange_tree',
                icon: '🍊',
                scientificName: 'Citrus sinensis',
                description: 'Evergreen citrus; long fruiting window in mild climates; aromatic blossoms attract pollinators.',
                growthStages: ['seed', 'seedling', 'sapling', 'mature', 'old'],
                heightPerGrowthStage: [0, 10, 20, 30],
                daysPerGrowthStage: [30, 730, 730, 3650, 3650],
                fruiting: {
                    requiresPollination: true,
                    mode: 'insect',
                    vectors: ['bee'],
                    stages: ['flowering', 'green fruit', 'ripe', 'overripe'],
                    daysPerStage: [14, 240, 60, 30],
                    fruitingWindows: [
                        {startMonth: 12, startDay: 1, endMonth: 3, endDay: 1},
                        {startMonth: 1, startDay: 1, endMonth: 12, endDay: 31}
                    ]
                },
                yield: 30000,
                seedRate_kg_per_ha: 10,
                seedlingDensity_per_ha: 10,
                productKey: 'orange',
                plantMaterialKey: 'wood',
                removedWhenHarvested: false,
                habitat: 'land'
            },
            {
                type: 'lemon_tree',
                icon: '🍋',
                scientificName: 'Citrus limon',
                description: 'Evergreen citrus with multiple flushes; sensitive to cold; aromatic flowers attract pollinators.',
                growthStages: ['seed', 'seedling', 'sapling', 'mature', 'old'],
                heightPerGrowthStage: [0, 10, 20, 30],
                daysPerGrowthStage: [30, 730, 730, 3285, 3285],
                fruiting: {
                    requiresPollination: true,
                    mode: 'insect',
                    vectors: ['bee'],
                    stages: ['flowering', 'green fruit', 'ripe', 'overripe'],
                    daysPerStage: [14, 180, 60, 30],
                    fruitingWindows: [
                        {startMonth: 11, startDay: 1, endMonth: 2, endDay: 28}
                    ]
                },
                yield: 35000,
                seedRate_kg_per_ha: 10,
                seedlingDensity_per_ha: 10,
                productKey: 'lemon',
                plantMaterialKey: 'wood',
                removedWhenHarvested: false,
                habitat: 'land'
            },
            {
                type: 'oak_tree',
                icon: '🌳',
                scientificName: 'Quercus robur',
                description: 'Long-lived deciduous hardwood; produces acorns as seasonal fruit; wind-pollinated.',
                growthStages: ['seed', 'seedling', 'sapling', 'mature', 'old'],
                heightPerGrowthStage: [0, 10, 20, 30],
                daysPerGrowthStage: [20, 730, 3650, 18250, 18250],
                fruiting: {
                    requiresPollination: true,
                    mode: 'wind',
                    vectors: ['wind'],
                    stages: ['flowering', 'acorn', 'ripe', 'overripe'],
                    daysPerStage: [10, 120, 30, 30],
                    fruitingWindows: [
                        {startMonth: 10, startDay: 1, endMonth: 11, endDay: 15}
                    ]
                },
                yield: 250000,
                seedRate_kg_per_ha: 10,
                seedlingDensity_per_ha: 10,
                productKey: 'acorn',
                plantMaterialKey: 'wood',
                removedWhenHarvested: false,
                habitat: 'land'
            },
            {
                type: 'poplar',
                icon: '🌲',
                scientificName: 'Populus spp.',
                description: 'Fast-growing deciduous tree; commonly used for timber and biomass; wind-pollinated catkins.',
                growthStages: ['seed', 'seedling', 'juvenile', 'mature', 'old'],
                heightPerGrowthStage: [0, 10, 20, 30],
                daysPerGrowthStage: [1, 180, 1095, 2190, 2190],
                fruiting: {
                    requiresPollination: true,
                    mode: 'wind',
                    vectors: ['wind'],
                    stages: ['flowering', 'seed_catkin', 'ripe', 'overripe'],
                    daysPerStage: [7, 30, 7, 0],
                    fruitingWindows: [
                        {startMonth: 11, startDay: 1, endMonth: 12, endDay: 31}
                    ]
                },
                yield: 100000,
                seedRate_kg_per_ha: 10,
                seedlingDensity_per_ha: 10,
                productKey: 'poplar_wood',
                plantMaterialKey: 'wood',
                removedWhenHarvested: false,
                habitat: 'land'
            },
            {
                type: 'willow',
                icon: '🌳',
                scientificName: 'Salix spp.',
                description: 'Moisture-loving deciduous tree; fast growth; valued for bark and timber; wind-pollinated catkins.',
                growthStages: ['seed', 'seedling', 'juvenile', 'mature', 'old'],
                heightPerGrowthStage: [0, 10, 20, 30],
                daysPerGrowthStage: [1, 180, 730, 2190, 2190],
                fruiting: {
                    requiresPollination: true,
                    mode: 'wind',
                    vectors: ['wind'],
                    stages: ['flowering', 'seed_catkin', 'ripe', 'overripe'],
                    daysPerStage: [7, 30, 7, 0],
                    fruitingWindows: [
                        {startMonth: 1, startDay: 1, endMonth: 2, endDay: 28}
                    ]
                },
                yield: 30000,
                seedRate_kg_per_ha: 10,
                seedlingDensity_per_ha: 10,
                productKey: 'willow_bark',
                plantMaterialKey: 'wood',
                removedWhenHarvested: false,
                habitat: 'land'
            },
            {
                type: 'rice',
                icon: '🌾',
                scientificName: 'Oryza sativa',
                description: 'Staple aquatic cereal; requires flooded conditions; wind-pollinated during flowering.',
                growthStages: ['seed', 'seedling', 'juvenile', 'mature', 'old'],
                heightPerGrowthStage: [0, 10, 20, 30],
                daysPerGrowthStage: [7, 14, 45, 42, 15],
                fruiting: {
                    requiresPollination: true,
                    mode: 'wind',
                    vectors: ['wind'],
                    stages: ['flowering', 'green fruit', 'ripe', 'overripe'],
                    daysPerStage: [10, 10, 15, 7],
                    fruitingWindows: [
                        {startMonth: 9, startDay: 1, endMonth: 10, endDay: 15}
                    ]
                },
                yield: 6000,
                seedRate_kg_per_ha: 10,
                seedlingDensity_per_ha: 10,
                productKey: 'rice_grain',
                plantMaterialKey: 'waste',
                removedWhenHarvested: true,
                habitat: 'water'
            },
            {
                type: 'lotus',
                icon: '🌸',
                scientificName: 'Nelumbo nucifera',
                description: 'Aquatic perennial; sacred lotus with edible rhizomes; insect-pollinated flowers above water.',
                growthStages: ['seed', 'seedling', 'juvenile', 'mature', 'old'],
                heightPerGrowthStage: [0, 10, 20, 30],
                daysPerGrowthStage: [10, 20, 60, 40, 10],
                fruiting: {
                    requiresPollination: true,
                    mode: 'insect',
                    vectors: ['bee', 'fly'],
                    stages: ['flowering', 'green fruit', 'ripe', 'overripe'],
                    daysPerStage: [20, 20, 20, 10],
                    fruitingWindows: [
                        {startMonth: 7, startDay: 1, endMonth: 8, endDay: 31}
                    ]
                },
                yield: 2000,
                seedRate_kg_per_ha: 10,
                seedlingDensity_per_ha: 10,
                productKey: 'lotus_root',
                plantMaterialKey: 'waste',
                removedWhenHarvested: true,
                habitat: 'water'
            },
            {
                type: 'water_spinach',
                icon: '🥬',
                scientificName: 'Ipomoea aquatica',
                description: 'Fast-growing semi-aquatic vegetable; propagated by cuttings or seeds; primarily vegetative yield.',
                growthStages: ['seed', 'seedling', 'juvenile', 'mature', 'old'],
                heightPerGrowthStage: [0, 10, 20, 30],
                daysPerGrowthStage: [5, 7, 20, 15, 5],
                fruiting: {
                    requiresPollination: false,
                    mode: 'self',
                    vectors: [],
                    stages: ['vegetative', 'ripe', 'overripe'],
                    daysPerStage: [20, 10, 5],
                    fruitingWindows: [
                        {startMonth: 6, startDay: 1, endMonth: 8, endDay: 31}
                    ]
                },
                yield: 15000,
                seedRate_kg_per_ha: 10,
                seedlingDensity_per_ha: 10,
                productKey: 'water_spinach_leaf',
                plantMaterialKey: 'waste',
                removedWhenHarvested: true,
                habitat: 'water'
            },
            {
                type: 'duckweed',
                icon: '🟩',
                scientificName: 'Lemna minor',
                description: 'Tiny floating aquatic plant; reproduces vegetatively at rapid rates; harvested as biomass.',
                growthStages: ['vegetative', 'mature', 'old'],
                heightPerGrowthStage: [0, 10, 20, 30],
                daysPerGrowthStage: [7, 7, 7],
                fruiting: {
                    requiresPollination: false,
                    mode: 'self',
                    vectors: [],
                    stages: ['vegetative', 'ripe'],
                    daysPerStage: [7, 7],
                    fruitingWindows: [
                        {startMonth: 6, startDay: 1, endMonth: 9, endDay: 30}
                    ]
                },
                yield: 500,
                seedRate_kg_per_ha: 10,
                seedlingDensity_per_ha: 10,
                productKey: 'duckweed_biomass',
                plantMaterialKey: 'waste',
                removedWhenHarvested: true,
                habitat: 'water'
            },
            {
                type: 'water_hyacinth',
                icon: '💜',
                scientificName: 'Eichhornia crassipes',
                description: 'Invasive aquatic species; fast growth; purple flowers; insect-pollinated but harvested as biomass.',
                growthStages: ['vegetative', 'mature', 'old'],
                heightPerGrowthStage: [0, 10, 20, 30],
                daysPerGrowthStage: [14, 20, 15],
                fruiting: {
                    requiresPollination: true,
                    mode: 'insect',
                    vectors: ['bee', 'butterfly'],
                    stages: ['vegetative', 'flowering', 'ripe'],
                    daysPerStage: [14, 20, 15],
                    fruitingWindows: [
                        {startMonth: 7, startDay: 1, endMonth: 9, endDay: 30}
                    ]
                },
                yield: 1000,
                seedRate_kg_per_ha: 10,
                seedlingDensity_per_ha: 10,
                productKey: 'water_hyacinth_biomass',
                plantMaterialKey: 'waste',
                removedWhenHarvested: true,
                habitat: 'water'
            },
            {
                type: 'barnyard_grass',
                icon: '🌱',
                scientificName: 'Echinochloa crus-galli',
                description: 'Weedy annual grass; competitive in rice paddies; reproduces by seed.',
                growthStages: ['seed', 'seedling', 'mature', 'old'],
                heightPerGrowthStage: [0, 10, 20, 30],
                daysPerGrowthStage: [7, 30, 15, 15],
                fruiting: {
                    requiresPollination: true,
                    mode: 'wind',
                    vectors: ['wind'],
                    stages: ['seedling', 'vegetative', 'ripe'],
                    daysPerStage: [7, 30, 15],
                    fruitingWindows: [
                        {startMonth: 7, startDay: 1, endMonth: 8, endDay: 31}
                    ]
                },
                yield: 2000,
                seedRate_kg_per_ha: 10,
                seedlingDensity_per_ha: 10,
                productKey: 'barnyard_grass_seed',
                plantMaterialKey: 'waste',
                removedWhenHarvested: true,
                habitat: 'land'
            }
        ]
    )
    const products = {
        // Annuals
        hay: {
            icon: '🌱', label: 'Hay', basePrice: 1, shelfLife: 10, harvestType: 'product'
        }, corn_cob: {
            icon: '🌽', label: 'Corn Cob', basePrice: 1, shelfLife: 15, harvestType: 'product'
        }, tomato_fruit: {
            icon: '🍅', label: 'Tomato', basePrice: 1, shelfLife: 7, harvestType: 'product'
        }, lettuce_leaf: {
            icon: '🥬', label: 'Lettuce Leaf', basePrice: 1, shelfLife: 6, harvestType: 'product'
        }, carrot_root: {
            icon: '🥕', label: 'Carrot Root', basePrice: 1, shelfLife: 20, harvestType: 'product'
        }, pumpkin_fruit: {
            icon: '🎃', label: 'Pumpkin', basePrice: 2, shelfLife: 40, harvestType: 'product'
        }, lavender_flower: {
            icon: '💜', label: 'Lavender Flower', basePrice: 3, shelfLife: 15, harvestType: 'product'
        }, clover_flower: {
            icon: '☘️', label: 'Clover Flower', basePrice: 1, shelfLife: 10, harvestType: 'product'
        }, sunflower_seed: {
            icon: '🌻', label: 'Sunflower Seed', basePrice: 2, shelfLife: 12, harvestType: 'product'
        }, wheat_grain: {
            icon: '🌾', label: 'Wheat Grain', basePrice: 1, shelfLife: 90, harvestType: 'product'
        }, barley_grain: {
            icon: '🌾', label: 'Barley Grain', basePrice: 1, shelfLife: 90, harvestType: 'product'
        }, oats_grain: {
            icon: '🌾', label: 'Oats Grain', basePrice: 1, shelfLife: 90, harvestType: 'product'
        },
        // Perennials & fruit/nut trees
        strawberry_fruit: {
            icon: '🍓', label: 'Strawberry', basePrice: 3, shelfLife: 7, harvestType: 'product'
        }, blueberry_fruit: {
            icon: '🫐', label: 'Blueberry', basePrice: 4, shelfLife: 7, harvestType: 'product'
        }, coffee_beans: {
            icon: '☕', label: 'Coffee Beans', basePrice: 2, shelfLife: 30, harvestType: 'product'
        }, apple: {
            icon: '🍏', label: 'Apple', basePrice: 4, shelfLife: 20, harvestType: 'product'
        }, acorn: {
            icon: '🌰', label: 'Acorn', basePrice: 1, shelfLife: 45, harvestType: 'product'
        }, pear: {
            icon: '🍐', label: 'Pear', basePrice: 4, shelfLife: 20, harvestType: 'product'
        }, almond: {
            icon: '🌰', label: 'Almond', basePrice: 6, shelfLife: 30, harvestType: 'product'
        }, orange: {
            icon: '🍊', label: 'Orange', basePrice: 5, shelfLife: 18, harvestType: 'product'
        }, lemon: {
            icon: '🍋', label: 'Lemon', basePrice: 5, shelfLife: 18, harvestType: 'product'
        }, grape: {
            icon: '🍇', label: 'Grape', basePrice: 5, shelfLife: 10, harvestType: 'product'
        }, willow_bark: {
            icon: '', label: 'Willow Bark', basePrice: 3, shelfLife: 60, harvestType: 'product'
        }, wood: {
            icon: '🪵', label: 'Wood', basePrice: 6, shelfLife: 80, harvestType: 'plantStore'
        }
    }
    return {plantTypes, products}
})
