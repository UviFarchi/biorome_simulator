import {requirements} from '/src/stores/requirements.js'


function assemblyMeetsRequirements(assembly, requirementType, requirementName) {
    let localRequirements = requirements[requirementType][requirementName]
    if (!assembly || !assembly.modules) return false
    return localRequirements.every(req => assembly.modules.some(m => (!req.type || m.type === req.type) && (!req.subtype || m.subtype === req.subtype) && (!req.name || m.name === req.name)))
}

function getRequirements(requirementType, requirementName) {
    if (!requirements[requirementType] || !requirements[requirementType][requirementName])
        throw new Error(`No requirements for ${requirementType}.${requirementName}`);
    return requirements[requirementType][requirementName];
}
function getMatchingModuleNames(requirements, availableModules) {
    return requirements.map(req => {
        const matches = availableModules.filter(mod => {
            if (mod.type !== req.type) return false;
            if ('subtype' in req && req.subtype !== undefined && req.subtype !== null)
                return mod.subtype === req.subtype;
            return true;
        });
        return {
            type: req.type,
            subtype: req.subtype,
            names: matches.map(mod => mod.name)
        }
    });
}


function getAdjacentTiles(tile, tilesGrid) {
    const dirs = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1],]
    const adj = []
    for (const [dr, dc] of dirs) {
        const row = tile.row + dr
        const col = tile.col + dc
        if (row >= 0 && row < tilesGrid.length && col >= 0 && col < tilesGrid[0].length && !(row === tile.row && col === tile.col)) {
            adj.push(tilesGrid[row][col])
        }
    }
    return adj
}

function canAssemblyMoveAlone(assembly){
   return assembly.modules.filter(module => module.type === 'transport').length > 0
}

export {
    assemblyMeetsRequirements, getMatchingModuleNames, getRequirements, getAdjacentTiles, canAssemblyMoveAlone
}
