const AlgorithmAndBuildingPanel = ({ 
    schedulingMode, 
    setSchedulingMode, 
    numFloors, 
    setNumFloors, 
    numElevators, 
    setNumElevators,
    timingConfig,
    setTimingConfig
}) => {
    const getAlgorithmInfo = (mode) => {
        switch (mode) {
            case 'look':
                return {
                    name: 'LOOK Algorithm',
                    emoji: '🎯',
                    color: 'green',
                    description: 'Efficient directional scheduling - serves all calls in one direction before reversing',
                    badge: 'Optimized'
                }
            case 'sstf':
                return {
                    name: 'SSTF Algorithm',
                    emoji: '⚡',
                    color: 'purple',
                    description: 'Shortest Seek Time First - always serves the nearest floor next',
                    badge: 'Fast Response'
                }
            default:
                return {
                    name: 'Manual Mode',
                    emoji: '👆',
                    color: 'blue',
                    description: 'Full manual control - you assign each call to specific elevators',
                    badge: 'Manual'
                }
        }
    }

    return (
        <div className="space-y-6">
            {/* Algorithm Selection Section */}
            <div>
                <h3 className="text-base font-bold mb-3 text-slate-800 flex items-center gap-2">
                    🎛️ Algorithm Selection
                </h3>
                <div className="space-y-3">
                    {['manual', 'look', 'sstf'].map((mode) => {
                        const modeInfo = getAlgorithmInfo(mode)
                        const isActive = schedulingMode === mode
                        return (
                            <button
                                key={mode}
                                onClick={() => setSchedulingMode(mode)}
                                className={`w-full text-left p-3 rounded-lg transition-all duration-200 ${
                                    isActive
                                        ? 'bg-blue-600 text-white shadow-lg ring-2 ring-blue-300'
                                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-300'
                                }`}
                            >
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-xl">{modeInfo.emoji}</span>
                                    <span className="font-semibold text-sm">{modeInfo.name}</span>
                                    {isActive && (
                                        <span className="ml-auto text-xs bg-white/20 px-2 py-1 rounded">
                                            Active
                                        </span>
                                    )}
                                </div>
                                <p className={`text-xs ${isActive ? 'text-blue-100' : 'text-slate-500'}`}>
                                    {modeInfo.description}
                                </p>
                            </button>
                        )
                    })}
                </div>
            </div>

            {/* Building Configuration Section */}
            <div className="pt-4 border-t border-slate-200">
                <h3 className="text-base font-bold mb-3 text-slate-800 flex items-center gap-2">
                    ⚙️ Building Configuration
                </h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            🏢 Number of Floors
                        </label>
                        <input
                            type="number"
                            min="2"
                            max="24"
                            value={numFloors}
                            onChange={e => setNumFloors(Math.min(24, Math.max(2, parseInt(e.target.value) || 2)))}
                            className="w-full border-2 border-slate-300 rounded-lg px-3 py-2 text-slate-700 font-medium focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                        />
                        <p className="text-xs text-slate-500 mt-1">Range: 2-24 floors</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            🛗 Number of Elevators
                        </label>
                        <input
                            type="number"
                            min="2"
                            max="12"
                            value={numElevators}
                            onChange={e => setNumElevators(Math.min(12, Math.max(2, parseInt(e.target.value) || 2)))}
                            className="w-full border-2 border-slate-300 rounded-lg px-3 py-2 text-slate-700 font-medium focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                        />
                        <p className="text-xs text-slate-500 mt-1">Range: 2-12 elevators</p>
                    </div>
                </div>
            </div>

            {/* Timing Configuration Section */}
            <div className="pt-4 border-t border-slate-200">
                <h3 className="text-base font-bold mb-3 text-slate-800 flex items-center gap-2">
                    ⏱️ Timing Configuration
                </h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            🚀 Floor Travel Time (ms)
                        </label>
                        <input
                            type="number"
                            min="100"
                            max="5000"
                            step="100"
                            value={timingConfig.floorTravelTime}
                            onChange={e => setTimingConfig({
                                ...timingConfig,
                                floorTravelTime: Math.min(5000, Math.max(100, parseInt(e.target.value) || 1000))
                            })}
                            className="w-full border-2 border-slate-300 rounded-lg px-3 py-2 text-slate-700 font-medium focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                        />
                        <p className="text-xs text-slate-500 mt-1">Time to travel one floor (100-5000ms)</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            🚪 Door Open Time (ms)
                        </label>
                        <input
                            type="number"
                            min="500"
                            max="5000"
                            step="100"
                            value={timingConfig.doorOpenTime}
                            onChange={e => setTimingConfig({
                                ...timingConfig,
                                doorOpenTime: Math.min(5000, Math.max(500, parseInt(e.target.value) || 2500))
                            })}
                            className="w-full border-2 border-slate-300 rounded-lg px-3 py-2 text-slate-700 font-medium focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                        />
                        <p className="text-xs text-slate-500 mt-1">Time to open doors (500-5000ms)</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            ⏸️ Door Hold Time (ms)
                        </label>
                        <input
                            type="number"
                            min="1000"
                            max="10000"
                            step="100"
                            value={timingConfig.doorHoldTime}
                            onChange={e => setTimingConfig({
                                ...timingConfig,
                                doorHoldTime: Math.min(10000, Math.max(1000, parseInt(e.target.value) || 3000))
                            })}
                            className="w-full border-2 border-slate-300 rounded-lg px-3 py-2 text-slate-700 font-medium focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                        />
                        <p className="text-xs text-slate-500 mt-1">Time doors stay open (1000-10000ms)</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            🚪 Door Close Time (ms)
                        </label>
                        <input
                            type="number"
                            min="500"
                            max="5000"
                            step="100"
                            value={timingConfig.doorCloseTime}
                            onChange={e => setTimingConfig({
                                ...timingConfig,
                                doorCloseTime: Math.min(5000, Math.max(500, parseInt(e.target.value) || 2000))
                            })}
                            className="w-full border-2 border-slate-300 rounded-lg px-3 py-2 text-slate-700 font-medium focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                        />
                        <p className="text-xs text-slate-500 mt-1">Time to close doors (500-5000ms)</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AlgorithmAndBuildingPanel
