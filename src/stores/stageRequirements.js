import {defineStore} from 'pinia'

export const stageRequirementsStore = defineStore('stageRequirementsStore', () => {
    return {
        stage: {
            discovery: {
                milestones: [
                    {type: 'analytics', condition: 'daily_report_run', atLeast: 1}, {
                        type: 'map',
                        condition: 'tiles_surveyed',
                        atLeast: 20
                    }, {type: 'assemblies', condition: 'central_computing_assembly'}, {type: 'assemblies', condition: 'assembly_station'}],
                restrictions: {actionsAllowed: ['survey', 'measure']}
            }, design: {
                milestones: [{
                    type: 'optimizations', condition: 'placements_made', atLeast: 1
                }],
                restrictions: {actionsAllowed: ['survey', 'measure', 'sow', 'move', 'fertilize', 'feed', 'flatten', 'breakGround', 'build', 'transport', 'dig']}
            }, // deployment is terminal; no further stage requirements here
            deployment: {
                milestones: [],
                restrictions: {actionsAllowed: ['survey', 'measure', 'sow', 'move', 'fertilize', 'feed', 'flatten', 'breakGround', 'build', 'transport', 'dig', 'harvestPlant', 'harvestAnimal', 'harvestPlantProduct', 'harvestAnimalProduct', 'generatePower', 'collectWater', 'produceFertilizer']}
            }
        }
    }
})
