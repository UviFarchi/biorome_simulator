import {defineStore} from 'pinia'
import {ref} from 'vue'

export const marketStore = defineStore('marketStore', () => {
    const contracts = ref([
        // Example data; should be generated dynamically
        {
            id: 'contract-1',
            productType: 'wheat_grain',
            quantity: 20,
            dueDate: '2025-08-01',
            pricePerUnit: 5,
            status: 'pending',
            type: 'one-off',
            interval: 0,
            penalty: 20
        },
        {
            id: 'contract-2',
            productType: 'milk',
            quantity: 10,
            dueDate: '2025-08-05',
            pricePerUnit: 4,
            status: 'pending',
            type: 'one-off',
            interval: 0,
            penalty: 10
        }
    ])

    const openMarketOffers = ref([
        {
            id: 'offer-1',
            productType: 'tomato_fruit',
            quantity: 5,
            pricePerUnit: 7,
            expiryDate: '2025-07-30',
            status: 'open'
        }
    ])


    const harvestedProducts = ref([])

    const notifications = ref([])
    const extraBuyables = ref([
        {type: 'feed', basePrice: 2, icon: '🍽️', shelfLife: 30},
        {type: 'fertilizer', basePrice: 2, icon: '💩', shelfLife: 30},
    ])

    const utilityPrices = ref({
        electricityBuyPerKWh: 0.19,
        electricitySellPerKWh: 0.19,
        waterBuyPerM3: 3.50,
        wasteDisposalPerTon: 100
    })

    return {
        contracts,
        openMarketOffers,
        harvestedProducts,
        extraBuyables,
        utilityPrices,
        notifications
    }
})
