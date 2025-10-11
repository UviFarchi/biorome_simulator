import { actionModels } from '@/dict/actionModels.js';
import actionEffects from '@/engine/effects/actionEffects.js';

function handleAction(actionId, tile, instance = {}) {
  if (!actionId || !tile) {
    console.warn('[handleAction] Missing action or tile context.', { actionId, tile });
    return { success: false, errors: ['Missing action or tile.'], appliedEffects: [] };
  }

  const model = actionModels[actionId];
  if (!model) {
    console.warn(`[handleAction] Unknown action: ${actionId}`);
    return { success: false, errors: [`Unknown action: ${actionId}`], appliedEffects: [] };
  }

  const params = instance.params || {};
  const validationErrors = validateParams(model, params);
  if (validationErrors.length) {
    console.warn('[handleAction] Parameter validation failed.', { actionId, validationErrors });
  }

  const context = {
    actionId,
    tile,
    model,
    params,
    instance,
  };

  const effects = Array.isArray(actionEffects?.[actionId]) ? actionEffects[actionId] : [];
  const appliedEffects = [];

  effects.forEach((effect) => {
    const applied = applyEffect(context, effect);
    if (applied) {
      appliedEffects.push(applied);
    }
  });

  instance.model = instance.model || model;
  instance.params = params;
  instance.appliedEffects = appliedEffects;
  instance.lastAppliedAt = Date.now();

  return {
    success: validationErrors.length === 0,
    errors: validationErrors,
    appliedEffects,
  };
}

function validateParams(model, params) {
  const errors = [];
  const definitions = model.parameters || {};

  Object.entries(definitions).forEach(([key, definition]) => {
    const value = params[key];

    if (definition?.required && (value === null || value === undefined || value === '')) {
      errors.push({ key, message: 'Required parameter missing.' });
      return;
    }

    if (definition?.type === 'number' && value !== null && value !== undefined && value !== '') {
      const numeric = Number(value);
      if (Number.isNaN(numeric)) {
        errors.push({ key, message: 'Parameter must be a number.' });
        return;
      }
      if (typeof definition.min === 'number' && numeric < definition.min) {
        errors.push({ key, message: `Must be ≥ ${definition.min}.` });
      }
      if (typeof definition.max === 'number' && numeric > definition.max) {
        errors.push({ key, message: `Must be ≤ ${definition.max}.` });
      }
    }

    if (
      (definition?.type === 'select' || definition?.type === 'entity') &&
      Array.isArray(definition.options) &&
      definition.options.length &&
      value !== null &&
      value !== undefined &&
      value !== ''
    ) {
      const allowed = definition.options.map((option) => String(option.value));
      if (!allowed.includes(String(value))) {
        errors.push({ key, message: 'Value is not in the allowed option list.' });
      }
    }
  });

  return errors;
}

function applyEffect(context, effect = {}) {
  if (typeof effect.apply === 'function') {
    const result = effect.apply(context);
    return normalizeCustomResult(result, effect);
  }

  if (!effect.target || !effect.property) {
    return null;
  }

  return applyPropertyEffect(context, effect);
}

function applyPropertyEffect(context, effect) {
  const { tile } = context;
  const { target, property, unit, mode = 'increment' } = effect;

  if (!tile[target]) {
    console.warn(`[handleAction] Tile target "${target}" missing.`);
    return null;
  }

  const container = tile[target];
  const measurement = ensureMeasurement(container, property, unit);
  const delta = resolveDelta(effect.delta, context);

  if (delta === null || delta === undefined) {
    return null;
  }

  const base = resolveBaseValue(measurement);

  if (mode === 'set' && !Number.isFinite(Number(delta))) {
    measurement.optimized = delta;
    return {
      target,
      property,
      previous: base,
      mode,
      delta,
      next: delta,
    };
  }

  const numericDelta = toNumber(delta);

  if (!Number.isFinite(numericDelta)) {
    return null;
  }

  let nextValue;
  if (mode === 'set') {
    nextValue = numericDelta;
  } else if (mode === 'decrement') {
    nextValue = base - numericDelta;
  } else {
    nextValue = base + numericDelta;
  }

  measurement.optimized = nextValue;

  const applied = {
    target,
    property,
    previous: base,
    mode,
    delta: mode === 'decrement' ? -numericDelta : numericDelta,
    next: nextValue,
  };

  if (unit) {
    applied.unit = unit;
  }

  return applied;
}

function ensureMeasurement(container, property, unit) {
  if (!container[property]) {
    container[property] = {
      env: 0,
      unit: unit || null,
      measured: { value: 0, history: [], date: null, collect: false },
      optimized: null,
    };
  }

  if (unit && !container[property].unit) {
    container[property].unit = unit;
  }

  return container[property];
}

function resolveDelta(delta, context) {
  return typeof delta === 'function' ? delta(context) : delta;
}

function toNumber(value) {
  if (value === null || value === undefined || value === '') {
    return Number.NaN;
  }
  const numeric = Number(value);
  return numeric;
}

function resolveBaseValue(measurement) {
  if (!measurement) return 0;
  if (measurement.optimized !== null && measurement.optimized !== undefined) {
    const optimizedNumeric = Number(measurement.optimized);
    return Number.isFinite(optimizedNumeric) ? optimizedNumeric : 0;
  }
  const measured = measurement.measured?.value;
  if (Number.isFinite(measured)) {
    return measured;
  }
  const env = measurement.env;
  if (Number.isFinite(env)) {
    return env;
  }
  const value = measurement.value;
  if (Number.isFinite(value)) {
    return value;
  }
  return 0;
}

function normalizeCustomResult(result, effect) {
  if (!result) return null;
  if (typeof result === 'object' && !Array.isArray(result)) {
    return { target: effect.target || 'custom', ...result };
  }
  return { target: effect.target || 'custom', value: result };
}

export { handleAction };
