import eventBus from "@/eventBus.js";

export function produceReport(){

    setTimeout(()=>{  eventBus.emit('overlay', { target:"analytics", show: true });}, 500)


    return true
}
