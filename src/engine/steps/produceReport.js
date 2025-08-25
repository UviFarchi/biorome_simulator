import eventBus from '@/eventBus.js';

export function produceReport(){
//compare each tile’s measured state vs optimization targets from previous phase; output per-tile and farm-wide diffs; feed AnalyticsReport overlay.
    //Report on market trends
    //Report on weather events and forecast
    //Report on tiles lacking information
    //Report on unmonitored plants or animals.
    //Report on ecological events.
    //Report on totals used for water, electricity and waste
    setTimeout(()=>{  eventBus.emit('overlay', { target:'analytics', show: true });}, 500)


    return true
}
