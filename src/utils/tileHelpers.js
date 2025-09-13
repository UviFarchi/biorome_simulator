// utils/tileHelpers.js
import {gameStore} from '@/stores/game.js'
import {mapStore} from '@/stores/map.js'
import {formatDateTime, roundN} from '@/utils/formatting.js'
import plantEffects from "@/engine/effects/plantEffects.js";
import animalEffects from "@/engine/effects/animalEffects.js";
import assemblyEffects from "@/engine/effects/assemblyEffects.js";

const MAX_HISTORY_LENGTH = 100  // retain up to 100 past entries
const effects = {plant:plantEffects, animal:animalEffects,assembly: assemblyEffects}
    /**
 * Record a new measurement for a given tile property.
 * @param {Object} propertyObj - The tile property object (must contain .env and .measured).
 * @param {String} propertyKey - The fully qualified property name (e.g. "soil.water").
 */
function measureTileProperty(propertyObj, propertyKey) {
    if (!propertyObj?.measured) return;
    const prevMeasured = propertyObj.measured;

    // 1. Push previous measured value (if any) to history
    if (prevMeasured.value != null) {
        prevMeasured.history.push({
            value: roundN(prevMeasured.value),
            date: prevMeasured.date
        })
        if (prevMeasured.history.length > MAX_HISTORY_LENGTH) prevMeasured.history.shift()
    }

    // 2. Update measured value from env
    prevMeasured.value = roundN(propertyObj.env);

    // 3. Determine expiry duration for this property type
    const map = mapStore();
    const durations = map.measurementExpiry;  // expiry durations table (see section 2)
    let expireDays = 0;
    if (propertyKey.includes('.')) {
        // Split category and sub-key, e.g. "soil.water" -> ["soil","water"]
        const parts = propertyKey.split('.');
        if (parts.length >= 2) {
            const [category, subKey] = parts;
            if (durations[category] && subKey in durations[category]) {
                expireDays = durations[category][subKey];
            }
            // Handle nested sub-keys like "plants.fruiting.pollinated"
            if (parts.length === 3) {
                const [cat, subCat, subName] = parts;
                if (durations[cat] && durations[cat][subCat]?.[subName] !== undefined) {
                    expireDays = durations[cat][subCat][subName];
                }
            }
        }
    } else if (durations.default) {
        // Fallback default duration if category-specific not found
        expireDays = durations.default;
    }


    // Compute expiry timestamp
    const game = gameStore();
    const currentDate = new Date(game.currentDate);  // current simulation date
    currentDate.setDate(currentDate.getDate() + expireDays);
    prevMeasured.date = formatDateTime(currentDate);  // store ISO timestamp of expiry

    // Mark as freshly collected
    prevMeasured.collect = false;
}


function getAdjacentTiles(tile, tilesGrid) {
    const directions = [
        [-1, -1], [-1, 0], [-1, 1],
        [ 0, -1],          [ 0, 1],
        [ 1, -1], [ 1, 0], [ 1, 1],
    ]
    const adjacent = []
    for (const [deltaRow, deltaCol] of directions) {
        const row = tile.row + deltaRow
        const col = tile.col + deltaCol
        if (
            row >= 0 && row < tilesGrid.length &&
            col >= 0 && col < tilesGrid[0].length &&
            !(row === tile.row && col === tile.col)
        ) {
            adjacent.push(tilesGrid[row][col])
        }
    }
    return adjacent
}

function getImageOrIcon(){
    return true
}

function applyOptimizationEffects(domain, type, tile){
const effectsToApply = effects[domain][type];

for (const effect of effectsToApply){
    const target = effect.target;
    const property = effect.property;
    const currentValue = tile[target][property].measured.value;
    tile[target][property].optimized = currentValue + effect.delta
}
}

export {getAdjacentTiles, getImageOrIcon, measureTileProperty, applyOptimizationEffects}