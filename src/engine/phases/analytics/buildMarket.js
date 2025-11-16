// UI-ready builder for the “Market” section
import eventBus from '@/eventBus.js';
import { marketStore } from '@/stores/market.js';
import { formatNumber } from '@/utils/formatting.js';

export function buildMarket(currentEventsMarket = [], _currentDateISO) {
  eventBus.emit('log', { engine: 'analytics', msg: 'Building Market Report' });
  const store = marketStore();
  const offers = store.openMarketOffers.value || [];
  const contracts = store.contracts.value || [];
  const fmt = (n) => formatNumber(n, 2);

  const offerValue = offers.reduce(
    (sum, offer) => sum + (offer.quantity || 0) * (offer.pricePerUnit || 0),
    0
  );
  const contractValue = contracts.reduce(
    (sum, contract) => sum + (contract.quantity || 0) * (contract.pricePerUnit || 0),
    0
  );

  const summarySimpleTable = {
    headers: ['Metric', 'Value'],
    rows: [
      ['Open offers', `${offers.length} items / $${fmt(offerValue)}`],
      ['Active contracts', `${contracts.length} items / $${fmt(contractValue)}`],
      ['Last market refresh', store.lastMarketDate.value || '—'],
    ],
  };

  const offersTable = {
    headers: ['Offer', 'Qty', 'Price', 'Expires'],
    rows: offers.map((offer) => [
      offer.productType,
      offer.quantity ?? '—',
      offer.pricePerUnit ? `$${fmt(offer.pricePerUnit)}` : '—',
      offer.expiryDate || '—',
    ]),
  };

  const contractsTable = {
    headers: ['Contract', 'Qty', 'Due', 'Price', 'Status'],
    rows: contracts.map((contract) => [
      contract.productType,
      contract.quantity ?? '—',
      contract.dueDate || '—',
      contract.pricePerUnit ? `$${fmt(contract.pricePerUnit)}` : '—',
      contract.status || '—',
    ]),
  };

  const resourcesSnapshot = Object.entries(store.baseResources.value || {}).map(([key, info]) => [
    info.label || key,
    info.unit || 'unit',
    `$${fmt(info.basePrice ?? 0)}`,
    info.shelfLifeDays ? `${info.shelfLifeDays} d` : '—',
  ]);

  const baseResourcesTable = {
    headers: ['Resource', 'Unit', 'Base price', 'Shelf life'],
    rows: resourcesSnapshot,
  };

  const events = (currentEventsMarket || []).map((ev) => ({
    id: ev?.id,
    headline: ev?.headline ?? null,
    remaining: ev?.remaining ?? null,
  }));

  const eventsSimpleTable = {
    headers: ['Event', 'Days remaining'],
    rows: events.map((e) => [e.headline || e.id || '—', e.remaining ?? '—']),
  };

  return {
    summarySimpleTable,
    offersTable,
    contractsTable,
    baseResourcesTable,
    eventsSimpleTable,
  };
}
