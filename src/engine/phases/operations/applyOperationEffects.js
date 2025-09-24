import plantEffects from '@/engine/effects/plantEffects.js';
import animalEffects from '@/engine/effects/animalEffects.js';
import assemblyEffects from '@/engine/effects/actionEffects.js';

const effects = { plant: plantEffects, animal: animalEffects, assembly: assemblyEffects }

function getEffectList(domain, type) {
  const domainEffects = effects[domain] || {}
  return domainEffects[type] || []
}

function resolvePropertyNode(tile, targetKey, propertyKey) {
  if (!tile || !targetKey || !propertyKey) return null
  const targetGroup = tile[targetKey]
  if (!targetGroup || typeof targetGroup !== 'object') return null
  const propertyNode = targetGroup[propertyKey]
  if (!propertyNode || typeof propertyNode !== 'object') return null
  return propertyNode
}

function clearOptimizedValue(node) {
  if (!node || typeof node !== 'object') return
  if ('optimized' in node) {
    node.optimized = null
  }
}

function markActionComplete(tile, subject) {
  if (!subject || !tile?.assemblies) return
  const optimizedList = tile.assemblies.optimized
  if (!Array.isArray(optimizedList)) return

  tile.assemblies.optimized = optimizedList.filter(item => {
    if (!item || typeof item !== 'object') return true
    return !(item.action === subject.action && item.category === subject.category)
  })
}

function applyOperationEffects(domain, type, tile, subject) {
  const effectsToApply = getEffectList(domain, type)

  for (const effect of effectsToApply) {
    const target = effect?.target
    const property = effect?.property
    const node = resolvePropertyNode(tile, target, property)

    if (!node) continue

    const deltaValue = (typeof effect.delta === 'function')
      ? effect.delta({ tile, subject, type, domain })
      : effect.delta

    const measuredValue = node?.measured?.value
    const fallbackEnv = node?.env
    const baseValue = Number.isFinite(measuredValue)
      ? measuredValue
      : (Number.isFinite(fallbackEnv) ? fallbackEnv : 0)

    const numericDelta = Number(deltaValue)

    if (Number.isFinite(baseValue) && Number.isFinite(numericDelta)) {
      node.env = baseValue + numericDelta
    }

    clearOptimizedValue(node)
  }

  if (domain === 'assembly') {
    markActionComplete(tile, subject)
  }
}

export {applyOperationEffects}
