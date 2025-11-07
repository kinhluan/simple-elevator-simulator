import { useState } from 'react'
import StatisticsDashboard from './StatisticsDashboard'
import AlgorithmAndBuildingPanel from './AlgorithmAndBuildingPanel'
import InstructionsPanel from './InstructionsPanel'

const RightSidebar = ({ 
    elevators, 
    calls, 
    isAutoMode,
    schedulingMode,
    setSchedulingMode,
    numFloors,
    setNumFloors,
    numElevators,
    setNumElevators,
    timingConfig,
    setTimingConfig,
    assignCall,
    performanceMetrics
}) => {
    const [activeTab, setActiveTab] = useState('statistics')

    const tabs = [
        { id: 'statistics', label: 'Statistics', icon: '📊' },
        { id: 'config', label: 'Config', icon: '⚙️' },
        { id: 'instructions', label: 'Instructions', icon: '📖' }
    ]

    return (
        <div className="h-screen flex flex-col bg-white border-l border-slate-300 shadow-xl">
            {/* Tab Navigation */}
            <div className="flex border-b border-slate-200 bg-slate-50">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex-1 px-4 py-3 font-semibold text-sm transition-all duration-200 relative ${
                            activeTab === tab.id
                                ? 'text-blue-600 bg-white'
                                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'
                        }`}
                    >
                        <div className="flex flex-col items-center gap-1">
                            <span className="text-xl">{tab.icon}</span>
                            <span className="text-xs">{tab.label}</span>
                        </div>
                        {/* Active indicator */}
                        {activeTab === tab.id && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
                        )}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto p-4">
                {activeTab === 'statistics' && (
                    <div>
                        <h2 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
                            📊 System Statistics
                        </h2>
                        <StatisticsDashboard 
                            elevators={elevators}
                            calls={calls}
                            isAutoMode={isAutoMode}
                            assignCall={assignCall}
                            compact={true}
                            performanceMetrics={performanceMetrics}
                        />
                    </div>
                )}

                {activeTab === 'config' && (
                    <div>
                        <h2 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
                            ⚙️ Configuration
                        </h2>
                        <AlgorithmAndBuildingPanel 
                            schedulingMode={schedulingMode}
                            setSchedulingMode={setSchedulingMode}
                            numFloors={numFloors}
                            setNumFloors={setNumFloors}
                            numElevators={numElevators}
                            setNumElevators={setNumElevators}
                            timingConfig={timingConfig}
                            setTimingConfig={setTimingConfig}
                        />
                    </div>
                )}

                {activeTab === 'instructions' && (
                    <div>
                        <h2 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
                            📖 Instructions
                        </h2>
                        <InstructionsPanel />
                    </div>
                )}
            </div>
        </div>
    )
}

export default RightSidebar
