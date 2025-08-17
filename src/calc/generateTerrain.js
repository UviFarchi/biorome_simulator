// src/calc/generateTerrain.js
import { mapStore } from '@/stores/map.js'
import eventBus from '@/eventBus.js'

// ---- tiny PRNG + FBM value noise (unchanged) ----
function xmur3(str){ let h=1779033703^str.length; for(let i=0;i<str.length;i++){ h=Math.imul(h^str.charCodeAt(i),3432918353); h=(h<<13)|(h>>>19)} return ()=>{ h=Math.imul(h^(h>>>16),2246822507); h=Math.imul(h^(h>>>13),3266489909); return (h^=h>>>16)>>>0 } }
function mulberry32(a){ return function(){ let t=(a+=0x6D2B79F5); t=Math.imul(t^(t>>>15),t|1); t^=t+Math.imul(t^(t>>>7),t|61); return ((t^(t>>>14))>>>0)/4294967296 } }
function smoothstep(t){ return t*t*(3-2*t) }
function latticeHash(ix,iy,seed){ const s=(ix*374761393+iy*668265263+seed)>>>0; let t=s+0x6D2B79F5; t=Math.imul(t^(t>>>15),t|1); t^=t+Math.imul(t^(t>>>7),t|61); return ((t^(t>>>14))>>>0)/4294967296 }
function valueNoise2D(x,y,freq,seed){
    const xf=x*freq, yf=y*freq
    const x0=Math.floor(xf), y0=Math.floor(yf)
    const tx=xf-x0, ty=yf-y0
    const v00=latticeHash(x0, y0, seed)
    const v10=latticeHash(x0+1, y0, seed)
    const v01=latticeHash(x0, y0+1, seed)
    const v11=latticeHash(x0+1, y0+1, seed)
    const sx=smoothstep(tx), sy=smoothstep(ty)
    const ix0=v00*(1-sx)+v10*sx
    const ix1=v01*(1-sx)+v11*sx
    return ix0*(1-sy)+ix1*sy
}
function fbm2D(x,y,seed,octaves=5,baseFreq=1.2,lac=2,gain=0.5){
    let amp=1,freq=baseFreq,sum=0,norm=0
    for(let i=0;i<octaves;i++){
        sum+=amp*valueNoise2D(x,y,freq,seed+i*1013904223)
        norm+=amp; amp*=gain; freq*=lac
    }
    return sum/norm
}

export default function generateTerrain(){
    eventBus.emit('log', { engine:'game', msg:'Generating terrain' })
    console.log('[terrain] Init terrain generation')

    const map = mapStore()
    const tiles = map.tiles
    const rows = tiles.length
    const cols = rows ? tiles[0].length : 0
    if (!rows || !cols) return

    const { elevationRange = [0,1000], cellSize = 100 } = map.topographyConstraints ?? {}
    console.log('[terrain] Got store params', { rows, cols, elevationRange, cellSize })

    const seedStr = `biorome_${Date.now()}_${Math.random()}`
    const seedFn  = xmur3(seedStr)
    const baseSeed = seedFn()
    console.log('[terrain] Seed ready')

    const toDeg   = (rad)=> (rad*180)/Math.PI
    const clamp01 = (v)=> Math.max(0, Math.min(1, v))

    const dxn = cols>1 ? 1/(cols-1) : 1
    const dyn = rows>1 ? 1/(rows-1) : 1

    const [eMin,eMax] = elevationRange
    const eSpan = Math.max(1e-6, eMax - eMin)

    for (let row=0; row<rows; row++){
        for (let col=0; col<cols; col++){
            const tile = tiles[row][col]
            console.log(`[terrain] tile (${row},${col})`)

            // normalized coords
            const x = cols>1 ? col/(cols-1) : 0
            const y = rows>1 ? row/(rows-1) : 0

            // elevation (m)
            const eNorm = fbm2D(x, y, baseSeed, 5, 1.25, 2, 0.5)
            const elevation = +(eMin + eNorm*eSpan).toFixed(2)
            tile.topo.elevation.env = elevation
            console.log('  set topo.elevation', elevation)

            // slope/aspect from small offsets
            const hx = fbm2D(x+dxn, y, baseSeed) - fbm2D(x-dxn, y, baseSeed)
            const hy = fbm2D(x, y+dyn, baseSeed) - fbm2D(x, y-dyn, baseSeed)
            const dEdx = (hx * eSpan) / (2*dxn*cols)
            const dEdy = (hy * eSpan) / (2*dyn*rows)
            const slopeRad = Math.atan(Math.hypot(dEdx, dEdy)/cellSize)
            const slopeDeg = +Math.min(60, toDeg(slopeRad)).toFixed(2)
            tile.topo.slopeDeg.env = slopeDeg
            console.log('  set topo.slopeDeg', slopeDeg)

            let aspect = toDeg(Math.atan2(dEdy, -dEdx))
            if (aspect < 0) aspect += 360
            aspect = +aspect.toFixed(2)
            tile.topo.aspectDeg.env = aspect
            console.log('  set topo.aspectDeg', aspect)

            // -------- absolute water table (m ASL) ----------
            // A gentle, low-frequency "waterline" field independent of elevation,
            // so lowlands tend to fall below it and form lakes/ponds.
            const waterNoise = fbm2D(x+0.137, y+0.291, baseSeed+12345, 4, 0.9, 2, 0.5) // 0..1
            const waterLevelNorm = clamp01(0.25 + 0.14*waterNoise) //  of relief
            const waterTable = +(eMin + waterLevelNorm*eSpan).toFixed(2)
            tile.topo.waterTable.env = waterTable
            console.log('  set topo.waterTable', waterTable)

            const isWater = elevation <= waterTable

            // drainage proxy using elevation quantile & slope (non-water tiles)
            const slopeNorm = clamp01(slopeDeg/30)
            const elevNorm  = clamp01((elevation - eMin)/eSpan)
            const wetness   = isWater ? 1 : clamp01(0.6*(1 - slopeNorm) + 0.4*(1 - elevNorm))
            const drainageIndex = isWater ? 0 : +(1 - wetness).toFixed(2)
            tile.topo.drainageIndex.env = drainageIndex
            console.log('  set topo.drainageIndex', drainageIndex)

            // atmosphere
            const tempC = +(24 - 0.0065 * elevation).toFixed(1)
            const moisturePct = isWater ? 100 : Math.round(20 + 70 * wetness)
            tile.atmosphere.tempC.env = tempC
            console.log('  set atmosphere.tempC', tempC)
            tile.atmosphere.moisturePct.env = moisturePct
            console.log('  set atmosphere.moisturePct', moisturePct)

            // -------- soil (water tiles get special values) ----------
            if (isWater){
                tile.soil.water.env = 100;                 console.log('  set soil.water (water tile)', 100)
                tile.soil.nutrients.N.env = 0;             console.log('  set soil.nutrients.N (water tile)', 0)
                tile.soil.nutrients.P.env = 0;             console.log('  set soil.nutrients.P (water tile)', 0)
                tile.soil.nutrients.K.env = 0;             console.log('  set soil.nutrients.K (water tile)', 0)
                tile.soil.salinityDsM.env = 0.2;           console.log('  set soil.salinityDsM (water tile)', 0.2)
                tile.soil.ec.env = 0.05;                   console.log('  set soil.ec (water tile)', 0.05)
                tile.soil.ph.env = 7.0;                    console.log('  set soil.ph (water tile)', 7.0)
                tile.soil.compaction.env = 0;              console.log('  set soil.compaction (water tile)', 0)
                if (tile.soil.fertility){
                    tile.soil.fertility.env = 0;             console.log('  set soil.fertility (water tile)', 0)
                }
            } else {
                tile.soil.water.env = moisturePct;         console.log('  set soil.water', moisturePct)
                const N = Math.round(10 + 50 * wetness)
                const P = Math.round(8  + 35 * (0.6 * wetness + 0.4 * drainageIndex))
                const K = Math.round(8  + 35 * (0.5 * wetness + 0.5 * drainageIndex))
                tile.soil.nutrients.N.env = N;             console.log('  set soil.nutrients.N', N)
                tile.soil.nutrients.P.env = P;             console.log('  set soil.nutrients.P', P)
                tile.soil.nutrients.K.env = K;             console.log('  set soil.nutrients.K', K)
                const salinity = +(0.1 + 1.5 * Math.max(0, wetness - 0.7)).toFixed(2)
                tile.soil.salinityDsM.env = salinity;      console.log('  set soil.salinityDsM', salinity)
                const ec = +(0.5 + 2.0 * wetness).toFixed(2)
                tile.soil.ec.env = ec;                     console.log('  set soil.ec', ec)
                const ph = +(6.2 + 0.8 * (1 - wetness)).toFixed(2) // better drainage -> slightly higher pH
                tile.soil.ph.env = ph;                     console.log('  set soil.ph', ph)
                const compaction = Math.round(15 + 70 * (0.7 * wetness + 0.3 * (1 - slopeNorm)))
                tile.soil.compaction.env = compaction;     console.log('  set soil.compaction', compaction)
                if (tile.soil.fertility){
                    const fertilityIdx = Math.round(Math.min(100, 0.6 * ((N + P + K) / 3) + 0.4 * moisturePct))
                    tile.soil.fertility.env = fertilityIdx;  console.log('  set soil.fertility', fertilityIdx)
                }
            }
        }
    }

    eventBus.emit("log",{engine: "game", msg:"Terrain Done"})
}
