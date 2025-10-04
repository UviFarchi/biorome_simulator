import plantEffects from '@/engine/effects/plantEffects.js';
import animalEffects from '@/engine/effects/animalEffects.js';
import assemblyEffects from '@/engine/effects/actionEffects.js';

const effects = { plant: plantEffects, animal: animalEffects, assembly: assemblyEffects };


function handleAction(domain, type, tile, subject) {

}

export { handleAction };
