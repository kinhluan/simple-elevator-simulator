import ElevatorCar from './ElevatorCar'
import { generateFloors, getElevatorColorClass } from '../utils/elevatorUtils'

const BuildingVisualization = ({ numFloors, numElevators, elevators, calls, callElevator, moveElevator, isAutoMode }) => {
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

                    {/* Elevator controls at the bottom */}
                    <div className="flex border-t-2 border-slate-300 bg-white">
                        {elevators.map((elevator) => (
                            <div key={`control-${elevator.id}`} className="flex-1 border-r-2 last:border-r-0 border-slate-200 p-3">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className={`w-4 h-4 rounded-full ${getElevatorColorClass(elevator.id)} shadow-sm`}></div>
                                    <div className="text-xs text-slate-500 ml-auto font-medium bg-slate-100 px-2 py-0.5 rounded">
                                        {elevator.isMoving
                                            ? `→ ${elevator.targetFloor}`
                                            : `@ ${elevator.currentFloor}`}
                                    </div>
                                </div>

                                {/* Show queue in auto mode */}
                                {isAutoMode && elevator.queue && elevator.queue.length > 0 && (
                                    <div className="mb-2 p-2 bg-blue-50 border border-blue-100 rounded shadow-sm">
                                        <div className="font-semibold text-blue-900 mb-1 text-xs">📋 Queue:</div>
                                        <div className="flex flex-wrap gap-1">
                                            {elevator.queue.map((queueItem, idx) => {
                                                const floor = queueItem.floor || queueItem
                                                const callDir = queueItem.callDirection
                                                return (
                                                    <span 
                                                        key={`queue-${elevator.id}-${idx}`}
                                                        className={`px-1.5 py-0.5 rounded text-xs font-medium ${
                                                            idx === 0 
                                                                ? 'bg-blue-600 text-white shadow-sm' 
                                                                : 'bg-blue-100 text-blue-900 border border-blue-200'
                                                        }`}
                                                    >
                                                        {floor}{callDir ? (callDir === 'up' ? '↑' : '↓') : ''}
                                                    </span>
                                                )
                                            })}
                                        </div>
                                    </div>
                                )}

                                {/* Manual controls */}
                                {(!isAutoMode || !elevator.isMoving) && (
                                    <div>
                                        <p className="text-xs text-slate-600 mb-1 font-medium">Send to:</p>
                                        <div className="grid grid-cols-3 gap-1">
                                            {Array.from({ length: numFloors }, (_, i) => i + 1).map(floor => {
                                                const isInQueue = isAutoMode && elevator.queue && elevator.queue.some(q => (q.floor || q) === floor)
                                                return (
                                                    <button
                                                        key={`move-${elevator.id}-${floor}`}
                                                        onClick={() => moveElevator(elevator.id, floor)}
                                                        disabled={floor === elevator.currentFloor || isInQueue}
                                                        className={`px-1 py-1 text-xs rounded font-medium transition-all ${
                                                            floor === elevator.currentFloor
                                                                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                                                : isInQueue
                                                                    ? 'bg-blue-100 text-blue-400 cursor-not-allowed'
                                                                    : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 hover:border-slate-400 active:scale-95'
                                                        }`}
                                                    >
                                                        {floor}
                                                    </button>
                                                )
                                            })}
                                        </div>
                                    </div>
                                )}

                                {/* Status message for auto mode */}
                                {isAutoMode && elevator.isMoving && (
                                    <div className="mt-2 text-xs text-slate-600 font-medium text-center bg-slate-50 py-1 rounded">
                                        {elevator.direction === 'up' ? '⬆️' : '⬇️'} Moving {elevator.direction}...
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BuildingVisualization
