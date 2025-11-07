import { useState } from 'react'
import { useElevatorSystem } from '../hooks/useElevatorSystem'
import BuildingVisualization from './BuildingVisualization'
import TabbedControlPanel from './TabbedControlPanel'
import RightSidebar from './RightSidebar'
import { ELEVATOR_TIMING } from '../constants/elevatorTiming'

const Elevator = () => {
    // Configuration state
    const [numFloors, setNumFloors] = useState(5)
    const [numElevators, setNumElevators] = useState(3)
    const [schedulingMode, setSchedulingMode] = useState('manual')
    
    // Timing configuration state
    const [timingConfig, setTimingConfig] = useState({
        floorTravelTime: ELEVATOR_TIMING.FLOOR_TRAVEL_TIME,
        doorOpenTime: ELEVATOR_TIMING.DOOR_OPEN_TIME,
        doorHoldTime: ELEVATOR_TIMING.DOOR_HOLD_TIME,
        doorCloseTime: ELEVATOR_TIMING.DOOR_CLOSE_TIME,
    })

    // Use custom hook for elevator system logic
    const { elevators, calls, callElevator, moveElevator, assignCall } = useElevatorSystem(
        numFloors, 
        numElevators, 
        schedulingMode,
        timingConfig
    )
    
    const isAutoMode = schedulingMode !== 'manual'

    return (
        <div className="flex h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-blue-50 overflow-hidden">
            {/* Main Content Area */}
            <div className="flex-1 overflow-y-auto">
                <div className="p-4 space-y-4 max-w-7xl mx-auto">
                    {/* Compact Header */}
                    <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 rounded-xl shadow-xl p-4 text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl font-bold flex items-center gap-2">
                                    <span className="text-3xl">🛗</span>
                                    <span>Simple Elevator Simulator</span>
                                </h1>
                                <p className="text-blue-100 text-sm mt-1">
                                    {schedulingMode === 'manual' ? '👆 Manual Mode' : 
                                     schedulingMode === 'look' ? '🎯 LOOK Algorithm' : 
                                     '⚡ SSTF Algorithm'} • {numFloors} Floors • {numElevators} Elevators
                                </p>
                            </div>
                            <div className="text-right">
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                    schedulingMode === 'look' ? 'bg-green-500' :
                                    schedulingMode === 'sstf' ? 'bg-purple-500' :
                                    'bg-blue-500'
                                } shadow-lg`}>
                                    {schedulingMode === 'manual' ? 'Manual' : 
                                     schedulingMode === 'look' ? 'Optimized' : 
                                     'Fast Response'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Building Visualization with Controls */}
                    <BuildingVisualization
                        numFloors={numFloors}
                        numElevators={numElevators}
                        elevators={elevators}
                        calls={calls}
                        callElevator={callElevator}
                        moveElevator={moveElevator}
                        isAutoMode={isAutoMode}
                    />

                    {/* Tabbed Control Panel - Hidden since controls are now in BuildingVisualization */}
                    {/* <TabbedControlPanel
                        elevators={elevators}
                        moveElevator={moveElevator}
                        numFloors={numFloors}
                        isAutoMode={isAutoMode}
                        schedulingMode={schedulingMode}
                    /> */}
                </div>
            </div>

            {/* Right Sidebar */}
            <div className="w-80 shrink-0">
                <RightSidebar 
                    elevators={elevators}
                    calls={calls}
                    isAutoMode={isAutoMode}
                    schedulingMode={schedulingMode}
                    setSchedulingMode={setSchedulingMode}
                    numFloors={numFloors}
                    setNumFloors={setNumFloors}
                    numElevators={numElevators}
                    setNumElevators={setNumElevators}
                    timingConfig={timingConfig}
                    setTimingConfig={setTimingConfig}
                    assignCall={assignCall}
                />
            </div>
        </div>
    )
}

export default Elevator
