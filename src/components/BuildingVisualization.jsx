import ElevatorCar from './ElevatorCar'
import { generateFloors } from '../utils/elevatorUtils'

const BuildingVisualization = ({ numFloors, numElevators, elevators, calls, callElevator, moveElevator }) => {
    const floors = generateFloors(numFloors)

    return (
        <div className="bg-white rounded-lg shadow-md border border-slate-300 overflow-hidden hover:shadow-lg transition-shadow duration-200">
            <div className="flex">
                {/* Left column - floor numbers */}
                <div className="w-20 shrink-0 border-r-2 border-slate-200 bg-slate-50">
                    <div className="h-14 flex items-center justify-center font-bold text-slate-600 bg-slate-100 border-b-2 border-slate-200">
                        Floor
                    </div>
                    {floors.map(floor => (
                        <div key={`floor-${floor}`} className="h-20 flex items-center justify-center font-semibold text-slate-700 text-lg border-b border-slate-200 last:border-b-0">
                            {floor}
                        </div>
                    ))}
                </div>

                {/* Middle column - call buttons */}
                <div className="w-20 shrink-0 border-r-2 border-slate-200 bg-slate-50">
                    <div className="h-14 flex items-center justify-center font-bold text-slate-600 bg-slate-100 border-b-2 border-slate-200">
                        Call
                    </div>
                    {floors.map(floor => (
                        <div key={`buttons-${floor}`} className="h-20 flex flex-col items-center justify-center space-y-1.5 border-b border-slate-200 last:border-b-0">
                            {floor < numFloors && (
                                <button
                                    onClick={() => callElevator(floor, 'up')}
                                    className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-lg transition-all duration-200 transform hover:scale-110 active:scale-95 shadow-md
                        ${calls.some(c => c.floor === floor && c.direction === 'up')
                                            ? 'bg-blue-600 text-white shadow-lg ring-2 ring-blue-300'
                                            : 'bg-blue-500 hover:bg-blue-600 text-white hover:shadow-lg'
                                        }`}
                                >
                                    ↑
                                </button>
                            )}

                            {floor > 1 && (
                                <button
                                    onClick={() => callElevator(floor, 'down')}
                                    className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-lg transition-all duration-200 transform hover:scale-110 active:scale-95 shadow-md
                        ${calls.some(c => c.floor === floor && c.direction === 'down')
                                            ? 'bg-blue-600 text-white shadow-lg ring-2 ring-blue-300'
                                            : 'bg-blue-500 hover:bg-blue-600 text-white hover:shadow-lg'
                                        }`}
                                >
                                    ↓
                                </button>
                            )}
                        </div>
                    ))}
                </div>

                {/* Elevator shafts */}
                <div className="flex-1 flex flex-col bg-slate-50">
                    {/* Elevator shafts visualization */}
                    <div className="flex flex-1">
                        {Array(numElevators).fill().map((_, elevIndex) => (
                            <div
                                key={`shaft-${elevIndex}`}
                                className="flex-1 border-r-2 last:border-r-0 border-slate-200 relative"
                            >
                                <div className="h-14 flex items-center justify-center font-bold text-slate-700 bg-slate-100 border-b-2 border-slate-200">
                                    Elevator {elevIndex + 1}
                                </div>

                                {/* Elevator shaft */}
                                <div className="relative bg-gradient-to-b from-slate-50 to-slate-100">
                                    {floors.map(floor => (
                                        <div
                                            key={`cell-${elevIndex}-${floor}`}
                                            className="h-20 border-b border-slate-200 last:border-b-0"
                                        />
                                    ))}

                                    {/* Elevator car */}
                                    <ElevatorCar 
                                        elevator={elevators[elevIndex]} 
                                        numFloors={numFloors} 
                                        elevatorIndex={elevIndex}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Elevator in-car panels at the bottom */}
                    <div className="flex border-t-2 border-slate-300 bg-gradient-to-b from-slate-100 to-slate-200">
                        {elevators.map((elevator) => (
                            <div key={`control-${elevator.id}`} className="flex-1 border-r-2 last:border-r-0 border-slate-300 p-2">
                                {/* Real-life elevator panel design */}
                                <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-2 shadow-lg border-2 border-slate-700">
                                    
                                    {/* LCD Display - Like real elevator displays */}
                                    <div className="mb-2 bg-black rounded p-2 border border-slate-600 shadow-inner">
                                        <div className="flex items-center justify-center gap-2">
                                            {/* Current Floor */}
                                            <span className="text-emerald-400 font-mono text-lg font-bold tracking-wider" style={{textShadow: '0 0 8px rgba(52, 211, 153, 0.8)'}}>
                                                {elevator.currentFloor}
                                            </span>
                                            
                                            {/* Direction Arrows */}
                                            <div className="flex flex-col gap-0.5">
                                                <div className={`w-4 h-3 flex items-center justify-center ${
                                                    elevator.isMoving && elevator.direction === 'up' 
                                                        ? 'text-emerald-400' 
                                                        : 'text-slate-700'
                                                }`} style={elevator.isMoving && elevator.direction === 'up' ? {textShadow: '0 0 6px rgba(52, 211, 153, 0.8)'} : {}}>
                                                    <span className="text-xs">▲</span>
                                                </div>
                                                <div className={`w-4 h-3 flex items-center justify-center ${
                                                    elevator.isMoving && elevator.direction === 'down' 
                                                        ? 'text-amber-400' 
                                                        : 'text-slate-700'
                                                }`} style={elevator.isMoving && elevator.direction === 'down' ? {textShadow: '0 0 6px rgba(251, 191, 36, 0.8)'} : {}}>
                                                    <span className="text-xs">▼</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Queue Display - Below LCD - Always visible */}
                                    <div className="mb-2 px-2 py-1.5 bg-slate-700 rounded border border-slate-600">
                                        <div className="flex items-center gap-1.5 min-h-[20px]">
                                            <span className="text-[10px] text-slate-400 font-semibold">Queue:</span>
                                            <div className="flex flex-wrap gap-1">
                                                {elevator.queue && elevator.queue.length > 0 ? (
                                                    elevator.queue.map((q, idx) => {
                                                        const floor = q.floor || q
                                                        const dir = q.callDirection
                                                        return (
                                                            <span 
                                                                key={`queue-${elevator.id}-${idx}`}
                                                                className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                                                                    idx === 0 
                                                                        ? 'bg-amber-500 text-amber-900' 
                                                                        : 'bg-slate-600 text-slate-200'
                                                                }`}
                                                            >
                                                                {floor}{dir ? (dir === 'up' ? '↑' : '↓') : ''}
                                                            </span>
                                                        )
                                                    })
                                                ) : (
                                                    <span className="text-[10px] text-slate-500 italic py-0.5">Empty</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Floor Button Grid - Like real elevator buttons */}
                                    <div className="grid grid-cols-3 gap-1">
                                        {Array.from({ length: numFloors }, (_, i) => i + 1).map(floor => {
                                            const isInQueue = elevator.queue && elevator.queue.some(q => (q.floor || q) === floor)
                                            const isCurrent = floor === elevator.currentFloor
                                            return (
                                                <button
                                                    key={`move-${elevator.id}-${floor}`}
                                                    onClick={() => moveElevator(elevator.id, floor)}
                                                    disabled={isCurrent}
                                                    className={`relative h-8 rounded font-bold text-sm transition-all ${
                                                        isCurrent
                                                            ? 'bg-slate-600 text-slate-400 cursor-not-allowed border border-slate-700'
                                                            : isInQueue
                                                                ? 'bg-gradient-to-br from-amber-400 to-amber-500 text-amber-900 shadow-md border-2 border-amber-300'
                                                                : 'bg-gradient-to-br from-slate-300 to-slate-400 text-slate-800 hover:from-slate-200 hover:to-slate-300 active:scale-95 shadow-sm border border-slate-500'
                                                    }`}
                                                    style={isInQueue ? {boxShadow: '0 0 12px rgba(251, 191, 36, 0.6), inset 0 1px 2px rgba(255, 255, 255, 0.3)'} : {}}
                                                >
                                                    {floor}
                                                    {isInQueue && (
                                                        <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-amber-600 rounded-full animate-pulse"></span>
                                                    )}
                                                </button>
                                            )
                                        })}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BuildingVisualization
