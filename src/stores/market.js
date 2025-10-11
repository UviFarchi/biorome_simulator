import { defineStore } from 'pinia';
import { ref } from 'vue';

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
      penalty: 20,
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
      penalty: 10,
    },
  ]);

  const openMarketOffers = ref([
    {
      id: 'offer-1',
      productType: 'tomato_fruit',
      quantity: 5,
      pricePerUnit: 7,
      expiryDate: '2025-07-30',
      status: 'open',
    },
  ]);

  const notifications = ref([]);
  const baseResources = ref({
    feed: { label: 'Feed', unit: 'kg', basePrice: 2.0, icon: '🍽️', shelfLifeDays: 30 },
    fertilizer: { label: 'Fertilizer', unit: 'kg', basePrice: 2.0, icon: '💩', shelfLifeDays: 30 },
    electricity: { label: 'Electricity', unit: 'kWh', basePrice: 0.19, icon: '⚡' },
    water: { label: 'Water', unit: 'm³', basePrice: 3.5, icon: '💧' },
    waste: { label: 'Waste dispo', unit: 't', basePrice: 100, icon: '🗑️' },
  });
  const priceCatalog = ref({ plants: {}, animals: {}, resources: {} });
  const lastMarketDate = ref(null);
  //TODO => Push daily market values into market history and keep for 7 game days.
  const marketHistory = [];

  return {
    contracts,
    openMarketOffers,
    baseResources,
    notifications,
    priceCatalog,
    lastMarketDate,
    marketHistory,
  };
});
