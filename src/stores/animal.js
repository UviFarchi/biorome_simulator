import {defineStore} from 'pinia'
import {ref} from 'vue'

export const animalStore = defineStore('animalStore', () => {
    const products = ref({
        milk: {icon: '🥛', label: 'Milk', basePrice: 3, shelfLife: 2},
        goat_milk: {icon: '🥛', label: 'Goat milk', basePrice: 4, shelfLife: 2},
        eggs: {icon: '🥚', label: 'Eggs', basePrice: 2, shelfLife: 3},
        duck_eggs: {icon: '🥚', label: 'Duck eggs', basePrice: 3, shelfLife: 3},
        honey: {icon: '🍯', label: 'Honey', basePrice: 5, shelfLife: 1000},
        wool: {icon: '🧶', label: 'Wool', basePrice: 7, shelfLife: 1000}
    });



    const animalTypes = ref([
        {
            type: 'cow',
            icon: '🐄',
            scientificName: 'Bos taurus',
            description: 'A large domesticated bovine raised for meat and milk; adults weigh 500–800kg and are grazing ruminants.',
            feed: ['grass', 'clover', 'corn', 'animal_feed'],
            feedPerGrowthStage: [20, 35, 55, 45],
            weightPerGrowthStage: [200, 500, 800, 700],
            growthStages: ['calf', 'heifer', 'adult', 'old'],
            daysPerGrowthStage: [365, 365, 1825, 730],
            yieldPerStage: [0, 0, 50, 20],
            product: 'milk',
            outputFrequency: 1,
            habitat: 'land'
        },
        {
            type: 'goat',
            icon: '🐐',
            scientificName: 'Capra hircus',
            description: 'A small domesticated ruminant (domestic goat) known for browsing shrubs and weeds; agile and hardy livestock.',
            feed: ['grass', 'lettuce', 'corn', 'animal_feed'],

            feedPerGrowthStage: [20, 35, 55, 45],
            weightPerGrowthStage: [200, 500, 1200, 1100],
            growthStages: ['kid', 'yearling', 'adult', 'old'],
            daysPerGrowthStage: [180, 185, 1095, 730],

            yieldPerStage: [0, 0, 15, 6],
            product: 'goat_milk',
            outputFrequency: 1,

            habitat: 'land'
        },
        {
            type: 'sheep',
            icon: '🐑',
            scientificName: 'Ovis aries',
            description: 'A flock-forming domesticated ruminant prized for wool and meat; typically 45–100 kg grazers that crop grass close to the ground.',
            feed: ['grass', 'clover', 'animal_feed'],

            feedPerGrowthStage: [20, 35, 55, 45],
            weightPerGrowthStage: [200, 500, 1200, 1100],
            growthStages: ['lamb', 'yearling', 'adult', 'old'],
            daysPerGrowthStage: [150, 215, 1460, 730],

            yieldPerStage: [0, 0, 400, 150],
            product: 'wool',
            outputFrequency: 180,

            habitat: 'land'
        },
        {
            type: 'pig',
            icon: '🐖',
            scientificName: 'Sus scrofa domesticus',
            description: 'A domesticated pig, a large omnivorous mammal raised for pork; intelligent forager that roots in soil with its snout.',
            feed: ['corn', 'carrot', 'pumpkin', 'animal_feed'],

            feedPerGrowthStage: [20, 35, 55, 45],
            weightPerGrowthStage: [200, 500, 1200, 1100],
            growthStages: ['piglet', 'grower', 'finisher', 'old'],
            daysPerGrowthStage: [120, 150, 545, 365],

            yieldPerStage: [0, 0, 0, 0],
            product: '',
            outputFrequency: 0,

            habitat: 'land'
        },
        {
            type: 'chicken',
            icon: '🐔',
            scientificName: 'Gallus gallus domesticus',
            description: 'A domesticated fowl kept for eggs and meat; omnivorous forager ~2–4 kg descended from the red junglefowl.',
            feed: ['seeds', 'corn', 'grass', 'animal_feed'],

            feedPerGrowthStage: [20, 35, 55, 45],
            weightPerGrowthStage: [200, 500, 1200, 1100],
            growthStages: ['chick', 'pullet', 'adult', 'old'],
            daysPerGrowthStage: [60, 120, 730, 365],

            yieldPerStage: [0, 0.5, 7, 3],
            product: 'eggs',
            outputFrequency: 1,

            habitat: 'land'
        },
        {
            type: 'duck',
            icon: '🦆',
            scientificName: 'Anas platyrhynchos domesticus',
            description: 'A domestic duck (often derived from the Mallard), a waterfowl kept for eggs and meat; excellent forager of aquatic pests and weeds.',
            feed: ['seeds', 'grass', 'animal_feed'],

            feedPerGrowthStage: [20, 35, 55, 45],
            weightPerGrowthStage: [200, 500, 1200, 1100],
            growthStages: ['duckling', 'juvenile', 'adult', 'old'],
            daysPerGrowthStage: [40, 70, 730, 365],

            yieldPerStage: [0, 0.5, 5, 2],
            product: 'duck_eggs',
            outputFrequency: 1,

            habitat: 'land'
        },
        {
            type: 'bee',
            icon: '🐝',
            scientificName: 'Apis mellifera',
            description: 'The Western honey bee, a social insect kept in hives for honey production; a key crop pollinator with colonies of tens of thousands of workers.',
            feed: ['flowers', 'clover', 'lavender', 'sunflower'],
            feedPerGrowthStage: [20, 35, 55, 45],
            weightPerGrowthStage: [200, 500, 1200, 1100],
            growthStages: ['colony', 'established', 'productive', 'old'],
            daysPerGrowthStage: [30, 60, 1460, 730],
            yieldPerStage: [0, 0, 240, 60],
            product: 'honey',
            outputFrequency: 120,
            habitat: 'land'
        },
        {
            type: 'rabbit',
            icon: '🐇',
            scientificName: 'Oryctolagus cuniculus domesticus',
            description: 'A domesticated European rabbit, a small lagomorph (~1–2 kg) often kept for meat or as a pet; herbivorous and fast-breeding.',
            feed: ['grass', 'carrot', 'lettuce', 'clover', 'animal_feed'],
            feedPerGrowthStage: [20, 35, 55, 45],
            weightPerGrowthStage: [200, 500, 1200, 1100],
            growthStages: ['kit', 'juvenile', 'adult', 'old'],
            daysPerGrowthStage: [45, 45, 365, 180],

            yieldPerStage: [0, 0, 0, 0],
            product: '',
            outputFrequency: 0,
            habitat: 'land'
        },
        {
            type: 'horse',
            icon: '🐎',
            scientificName: 'Equus ferus caballus',
            description: 'A large domesticated equine used for transport and work; herbivorous grazer (~400–600 kg) with hard hooves and swift speed.',
            feed: ['grass', 'oats', 'animal_feed'],

            feedPerGrowthStage: [20, 35, 55, 45],
            weightPerGrowthStage: [200, 500, 1200, 1100],
            growthStages: ['foal', 'yearling', 'adult', 'old'],
            daysPerGrowthStage: [365, 365, 1825, 730],

            yieldPerStage: [0, 0, 0, 0],
            product: '',
            outputFrequency: 0,

            habitat: 'land'
        },
        {
            type: 'donkey',
            icon: '🫏',
            scientificName: 'Equus africanus asinus',
            description: 'A domesticated donkey, a smaller equid (~120–300 kg) used as a pack and guard animal; sure-footed browser descended from the African wild ass.',
            feed: ['grass', 'oats', 'animal_feed'],

            feedPerGrowthStage: [20, 35, 55, 45],
            weightPerGrowthStage: [200, 500, 1200, 1100],
            growthStages: ['foal', 'juvenile', 'adult', 'old'],
            daysPerGrowthStage: [365, 365, 1460, 730],

            yieldPerStage: [0, 0, 0, 0],
            product: '',
            outputFrequency: 0,

            habitat: 'land'
        },
        {
            type: 'ladybug',
            icon: '🐞',
            scientificName: 'Coccinella septempunctata',
            description: 'A small beetle (ladybird beetle) with red-and-black spotted wings; a voracious predator of aphids and other soft-bodied pests.',
            feed: ['clover'],

            feedPerGrowthStage: [20, 35, 55, 45],
            weightPerGrowthStage: [200, 500, 1200, 1100],
            growthStages: ['larva', 'pupa', 'adult', 'old'],
            daysPerGrowthStage: [10, 5, 60, 30],

            yieldPerStage: [0, 0, 0, 0],
            product: '',
            outputFrequency: 0,

            habitat: 'land'
        },
        {
            type: 'dog',
            icon: '🐕',
            scientificName: 'Canis lupus familiaris',
            description: 'A domestic dog, descendant of wolves; often used as livestock guardian dogs to protect herds from predators, in addition to being companion animals.',
            feed: ['animal_feed'],

            feedPerGrowthStage: [20, 35, 55, 45],
            weightPerGrowthStage: [200, 500, 1200, 1100],
            growthStages: ['puppy', 'juvenile', 'adult', 'old'],
            daysPerGrowthStage: [180, 185, 2190, 730],

            yieldPerStage: [0, 0, 0, 0],
            product: '',
            outputFrequency: 0,

            habitat: 'land'
        },
        {
            type: 'tilapia',
            icon: '🐟',
            scientificName: 'Oreochromis niloticus',
            description: 'Nile tilapia, a hardy freshwater fish often used in aquaculture; an herbivorous/omnivorous cichlid that feeds on plankton and algae.',
            feed: ['algae', 'plankton'],

            feedPerGrowthStage: [20, 35, 55, 45],
            weightPerGrowthStage: [200, 500, 1200, 1100],
            growthStages: ['fingerling', 'juvenile', 'adult'],
            daysPerGrowthStage: [60, 120, 365],

            yieldPerStage: [0, 0, 1],
            product: 'fish',
            outputFrequency: 180,

            habitat: 'water'
        },
        {
            type: 'trout',
            icon: '🐠',
            scientificName: 'Oncorhynchus mykiss',
            description: 'Rainbow trout, a cold-water fish valued for food and sport; carnivorous, feeding on insects and small aquatic creatures in streams and ponds.',
            feed: ['insects', 'small_fish'],

            feedPerGrowthStage: [20, 35, 55, 45],
            weightPerGrowthStage: [200, 500, 1200, 1100],
            growthStages: ['fry', 'juvenile', 'adult'],
            daysPerGrowthStage: [90, 180, 365],

            yieldPerStage: [0, 0, 1],
            product: 'fish',
            outputFrequency: 365,

            habitat: 'water'
        },
        {
            type: 'hawk',
            icon: '🦅',
            scientificName: 'Buteo jamaicensis',
            description: 'Red-tailed hawk, a common large hawk with a reddish tail; a diurnal bird of prey that hunts rodents, rabbits, and other small animals.',
            feed: ['rodents', 'small_birds'],

            feedPerGrowthStage: [20, 35, 55, 45],
            weightPerGrowthStage: [200, 500, 1200, 1100],
            growthStages: ['chick', 'juvenile', 'adult', 'old'],
            daysPerGrowthStage: [90, 180, 1460, 730],

            yieldPerStage: [0, 0, 0, 0],
            product: '',
            outputFrequency: 0,

            habitat: 'land'
        },
        {
            type: 'snake',
            icon: '🐍',
            scientificName: 'Pantherophis obsoletus',
            description: 'Black rat snake, a non-venomous constrictor often found around farms; an excellent climber that preys on rodents and occasionally eggs or chicks.',
            feed: ['rodents', 'insects'],

            feedPerGrowthStage: [20, 35, 55, 45],
            weightPerGrowthStage: [200, 500, 1200, 1100],
            growthStages: ['hatchling', 'juvenile', 'adult', 'old'],
            daysPerGrowthStage: [60, 180, 1825, 730],

            yieldPerStage: [0, 0, 0, 0],
            product: '',
            outputFrequency: 0,

            habitat: 'land'
        },
        {
            type: 'earthworm',
            icon: '🪱',
            scientificName: 'Lumbricus terrestris',
            description: 'Common earthworm (nightcrawler), a pinkish-brown segmented worm living in soil; feeds on organic matter and creates extensive burrows.',
            feed: ['organic_matter'],

            feedPerGrowthStage: [20, 35, 55, 45],
            weightPerGrowthStage: [200, 500, 1200, 1100],
            growthStages: ['juvenile', 'adult'],
            daysPerGrowthStage: [30, 365],

            yieldPerStage: [0, 0],
            product: '',
            outputFrequency: 0,

            habitat: 'land'
        },
        {
            type: 'dung_beetle',
            icon: '🪲',
            scientificName: 'Thorectes lusitanicus',
            description: 'A dung beetle, a type of scarab beetle that specializes in collecting and burying animal dung; plays a key role in nutrient cycling on pastures.',
            feed: ['manure'],

            feedPerGrowthStage: [20, 35, 55, 45],
            weightPerGrowthStage: [200, 500, 1200, 1100],
            growthStages: ['larva', 'pupa', 'adult'],
            daysPerGrowthStage: [15, 15, 180],

            yieldPerStage: [0, 0, 0],
            product: '',
            outputFrequency: 0,

            habitat: 'land'
        },
        {
            type: 'frog',
            icon: '🐸',
            scientificName: 'Lithobates pipiens',
            description: 'Northern leopard frog, a common amphibian found near water; eats insects, slugs, and other small invertebrates, benefiting gardens.',
            feed: ['insects'],

            feedPerGrowthStage: [20, 35, 55, 45],
            weightPerGrowthStage: [200, 500, 1200, 1100],
            growthStages: ['tadpole', 'juvenile', 'adult', 'old'],
            daysPerGrowthStage: [30, 60, 365, 365],

            yieldPerStage: [0, 0, 0, 0],
            product: '',
            outputFrequency: 0,

            habitat: 'water'
        },
        {
            type: 'shrimp',
            icon: '🦐',
            scientificName: 'Macrobrachium rosenbergii',
            description: 'Giant freshwater prawn, a large shrimp species farmed in ponds; omnivorous, feeding on detritus, algae, and small animals and contributing to water clarity.',
            feed: ['detritus', 'algae'],

            feedPerGrowthStage: [20, 35, 55, 45],
            weightPerGrowthStage: [200, 500, 1200, 1100],
            growthStages: ['larva', 'juvenile', 'adult'],
            daysPerGrowthStage: [20, 40, 365],

            yieldPerStage: [0, 0, 0],
            product: '',
            outputFrequency: 0,

            habitat: 'water'
        },
        {
            type: 'deer',
            icon: '🦌',
            scientificName: 'Odocoileus virginianus',
            description: 'White-tailed deer, a wild herbivore (~50–150 kg) known to browse crops, gardens, and forest understory; highly adaptable and often overabundant near farms.',
            feed: ['grass', 'leaves', 'fruit', 'vegetables'],

            feedPerGrowthStage: [20, 35, 55, 45],
            weightPerGrowthStage: [200, 500, 1200, 1100],
            growthStages: ['fawn', 'juvenile', 'adult', 'old'],
            daysPerGrowthStage: [180, 365, 2190, 730],

            yieldPerStage: [0, 0, 0, 0],
            product: '',
            outputFrequency: 0,

            habitat: 'land'
        },
        {
            type: 'wild_boar',
            icon: '🐗',
            scientificName: 'Sus scrofa',
            description: 'Wild boar (feral hog), a wild ancestor of domestic pigs; a large omnivore that roots aggressively in soil and can cause extensive crop and land damage.',
            feed: ['roots', 'tubers', 'corn', 'leftovers'],

            feedPerGrowthStage: [20, 35, 55, 45],
            weightPerGrowthStage: [200, 500, 1200, 1100],
            growthStages: ['piglet', 'juvenile', 'adult', 'old'],
            daysPerGrowthStage: [120, 240, 2190, 730],

            yieldPerStage: [0, 0, 0, 0],
            product: '',
            outputFrequency: 0,

            habitat: 'land'
        },
        {
            type: 'bear',
            icon: '🐻',
            scientificName: 'Ursus americanus',
            description: 'American black bear, a large omnivorous mammal (~100–300 kg) that ranges in forested areas; opportunistically feeds on crops, beehives, and small livestock when available.',
            feed: ['honey', 'fruit', 'fish', 'livestock'],

            feedPerGrowthStage: [20, 35, 55, 45],
            weightPerGrowthStage: [200, 500, 1200, 1100],
            growthStages: ['cub', 'juvenile', 'adult', 'old'],
            daysPerGrowthStage: [365, 730, 3650, 1095],

            yieldPerStage: [0, 0, 0, 0],
            product: '',
            outputFrequency: 0,

            habitat: 'land'
        },
        {
            type: 'fox',
            icon: '🦊',
            scientificName: 'Vulpes vulpes',
            description: 'Red fox, a small omnivorous canid (~4–8 kg) with a bushy tail; adaptable to rural and urban areas, where it hunts rodents and rabbits but also can prey on poultry.',
            feed: ['chickens', 'ducks', 'rabbits', 'rodents'],

            feedPerGrowthStage: [20, 35, 55, 45],
            weightPerGrowthStage: [200, 500, 1200, 1100],
            growthStages: ['kit', 'juvenile', 'adult', 'old'],
            daysPerGrowthStage: [90, 180, 1825, 730],

            yieldPerStage: [0, 0, 0, 0],
            product: '',
            outputFrequency: 0,

            habitat: 'land'
        },
        {
            type: 'raccoon',
            icon: '🦝',
            scientificName: 'Procyon lotor',
            description: 'Common raccoon, a medium-sized (~4–9 kg) omnivorous mammal with dexterous paws and a masked face; notorious for raiding crops, trash, and henhouses at night.',
            feed: ['corn', 'fruit', 'eggs', 'fish'],

            feedPerGrowthStage: [20, 35, 55, 45],
            weightPerGrowthStage: [200, 500, 1200, 1100],
            growthStages: ['kit', 'juvenile', 'adult', 'old'],
            daysPerGrowthStage: [120, 240, 1825, 730],

            yieldPerStage: [0, 0, 0, 0],
            product: '',
            outputFrequency: 0,

            habitat: 'land'
        },
        {
            type: 'locust',
            icon: '🦗',
            scientificName: 'Schistocerca gregaria',
            description: 'Desert locust, a short-horned grasshopper that can undergo swarming phases; swarms travel great distances and consume almost all vegetation in their path.',
            feed: ['grass', 'cereal', 'corn', 'vegetables'],

            feedPerGrowthStage: [20, 35, 55, 45],
            weightPerGrowthStage: [200, 500, 1200, 1100],
            growthStages: ['nymph', 'juvenile', 'adult', 'swarm'],
            daysPerGrowthStage: [20, 20, 30, 30],

            yieldPerStage: [0, 0, 0, 0],
            product: '',
            outputFrequency: 0,

            habitat: 'land'
        },
        {
            type: 'mosquito',
            icon: '🦟',
            scientificName: 'Culex pipiens',
            description: 'Common house mosquito, a small flying insect which feeds on nectar (males) and blood (females); notorious as a biting pest and disease vector in warm months.',
            feed: ['blood', 'nectar'],

            feedPerGrowthStage: [20, 35, 55, 45],
            weightPerGrowthStage: [200, 500, 1200, 1100],
            growthStages: ['larva', 'pupa', 'adult', 'swarm'],
            daysPerGrowthStage: [7, 3, 14, 14],

            yieldPerStage: [0, 0, 0, 0],
            product: '',
            outputFrequency: 0,

            habitat: 'land'
        },
        {
            type: 'butterfly',
            icon: '🦋',
            scientificName: 'Vanessa cardui',
            description: 'Painted lady, a migratory butterfly found worldwide; adults feed on flower nectar (pollinating them) and caterpillars feed on leaves of thistles and many crops.',
            feed: ['nectar', 'flowers', 'clover'],

            feedPerGrowthStage: [20, 35, 55, 45],
            weightPerGrowthStage: [200, 500, 1200, 1100],
            growthStages: ['caterpillar', 'chrysalis', 'adult', 'old'],
            daysPerGrowthStage: [20, 10, 30, 10],

            yieldPerStage: [0, 0, 0, 0],
            product: '',
            outputFrequency: 0,

            habitat: 'land'
        },
        {
            type: 'owl',
            icon: '🦉',
            scientificName: 'Tyto alba',
            description: 'Barn owl, a nocturnal raptor with a heart-shaped face; nests around farms and feeds primarily on rodents at night, providing natural pest control.',
            feed: ['rodents', 'small_birds', 'insects'],

            feedPerGrowthStage: [20, 35, 55, 45],
            weightPerGrowthStage: [200, 500, 1200, 1100],
            growthStages: ['chick', 'juvenile', 'adult', 'old'],
            daysPerGrowthStage: [60, 365, 2190, 730],

            yieldPerStage: [0, 0, 0, 0],
            product: '',
            outputFrequency: 0,

            habitat: 'land'
        },
        {
            type: 'cat',
            icon: '🐈',
            scientificName: 'Felis catus',
            description: 'Domestic cat, a small carnivorous mammal domesticated from wildcats; skilled hunter of rodents and birds.',
            feed: ['rodents', 'animal_feed'],

            feedPerGrowthStage: [20, 35, 55, 45],
            weightPerGrowthStage: [200, 500, 1200, 1100],
            growthStages: ['kitten', 'juvenile', 'adult', 'old'],
            daysPerGrowthStage: [90, 180, 2920, 730],

            yieldPerStage: [0, 0, 0, 0],
            product: '',
            outputFrequency: 0,

            habitat: 'land'
        }
    ])
    return {animalTypes, products}
})
