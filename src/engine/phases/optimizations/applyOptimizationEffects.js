import plantEffects from '@/engine/effects/plantEffects.js';
import animalEffects from '@/engine/effects/animalEffects.js';
import assemblyEffects from '@/engine/effects/actionEffects.js';

const effects = {plant:plantEffects, animal:animalEffects,assembly: assemblyEffects}

function applyOptimizationEffects(domain, type, tile, subject) {
    const effectsToApply = effects[domain][type] || []
console.log(type)
    for (const effect of effectsToApply) {
        const target = effect.target
        const property = effect.property
        const delta = (typeof effect.delta === 'function')
            ? effect.delta({ tile, subject, type, domain})
            : effect.delta

        const currentValue = tile[target][property].measured.value
        //TODO => make optimized into an object that can have both the value and an array of the things having a projected effect on it.
        tile[target][property].optimized = currentValue + delta
    }
}

export {applyOptimizationEffects}
