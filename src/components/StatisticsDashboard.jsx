import { useEffect, useState } from 'react'
import { getElevatorColorClass } from '../utils/elevatorUtils'

const StatisticsDashboard = ({ elevators, calls, isAutoMode, assignCall, compact = false, performanceMetrics }) => {
    const [stats, setStats] = useState({
        totalTrips: 0,
        activeElevators: 0,
        pendingCalls: 0,
        idleElevators: 0
    })

    // Calculate average wait time
    const avgWaitTime = performanceMetrics && performanceMetrics.callsServed > 0
        ? (performanceMetrics.totalWaitTime / performanceMetrics.callsServed / 1000).toFixed(1)
        : '0.0'
    
    // Calculate overall utilization (moving + serving time vs total time)
    const totalUtilization = elevators.length > 0
        ? elevators.reduce((sum, e) => {
            const totalTime = (e.timeInState?.idle || 0) + (e.timeInState?.moving || 0) + (e.timeInState?.serving || 0)
            if (totalTime === 0) return sum
            const activeTime = (e.timeInState?.moving || 0) + (e.timeInState?.serving || 0)
            return sum + (activeTime / totalTime)
        }, 0) / elevators.length * 100
        : 0
    
    // Calculate service quality score (% of calls served within 60 seconds)
    const serviceQualityScore = performanceMetrics && performanceMetrics.callsServed > 0
        ? (performanceMetrics.completedCalls.filter(c => c.waitTime <= 60000).length / 
           Math.min(performanceMetrics.completedCalls.length, performanceMetrics.callsServed) * 100).toFixed(0)
        : '0'
    
    // Calculate throughput (calls per minute)
    const throughput = performanceMetrics && performanceMetrics.sessionStartTime
        ? (() => {
            const minutesElapsed = (Date.now() - performanceMetrics.sessionStartTime) / 60000
            return minutesElapsed > 0 
                ? (performanceMetrics.callsServed / minutesElapsed).toFixed(1)
                : '0.0'
        })()
        : '0.0'
    
    // Calculate total stats across all elevators
    const totalTripsCompleted = elevators.reduce((sum, e) => sum + (e.tripsCompleted || 0), 0)
    const totalFloorsTravel = elevators.reduce((sum, e) => sum + (e.floorsTravel || 0), 0)
    const totalDirectionChanges = elevators.reduce((sum, e) => sum + (e.directionChanges || 0), 0)

    useEffect(() => {
        const activeElevators = elevators.filter(e => e.isMoving).length
        const idleElevators = elevators.filter(e => !e.isMoving).length
        const totalTrips = elevators.reduce((sum, e) => {
            // Count queue length as potential trips
            return sum + (e.queue ? e.queue.length : 0)
        }, 0)

        setStats({
            totalTrips,
            activeElevators,
            pendingCalls: calls.length,
            idleElevators
        })
    }, [elevators, calls])

    if (compact) {
        return (
            <div className="space-y-3">
                {/* Compact Stats Grid */}
                <div className="grid grid-cols-2 gap-2">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-2">
                        <div className="flex items-center justify-between mb-1">
                            <span className="text-lg">🚀</span>
                            <span className="text-xs text-slate-500">/{elevators.length}</span>
                        </div>
                        <div className="text-xl font-bold text-blue-700">{stats.activeElevators}</div>
                        <div className="text-xs font-semibold text-slate-700">Active</div>
                    </div>
                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-2">
                        <div className="flex items-center justify-between mb-1">
                            <span className="text-lg">💤</span>
                            <span className="text-xs text-slate-500">/{elevators.length}</span>
                        </div>
                        <div className="text-xl font-bold text-slate-700">{stats.idleElevators}</div>
                        <div className="text-xs font-semibold text-slate-700">Idle</div>
                    </div>
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-2">
                        <div className="flex items-center justify-between mb-1">
                            <span className="text-lg">📞</span>
                        </div>
                        <div className="text-xl font-bold text-amber-700">{stats.pendingCalls}</div>
                        <div className="text-xs font-semibold text-slate-700">Calls</div>
                    </div>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-2">
                        <div className="flex items-center justify-between mb-1">
                            <span className="text-lg">📋</span>
                        </div>
                        <div className="text-xl font-bold text-green-700">{stats.totalTrips}</div>
                        <div className="text-xs font-semibold text-slate-700">Queued</div>
                    </div>
                </div>

                {/* Performance Metrics */}
                <div className="space-y-2">
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-lg">⏱️</span>
                            <span className="text-xs text-purple-600 font-semibold">
                                {performanceMetrics?.callsServed || 0} served
                            </span>
                        </div>
                        <div className="text-xl font-bold text-purple-700">{avgWaitTime}s</div>
                        <div className="text-xs font-semibold text-slate-700">Avg Wait Time</div>
                        <div className="text-xs text-slate-500 mt-1">
                            Target: {'<'}60s
                        </div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-lg">✨</span>
                            <span className={`text-xs font-semibold ${
                                parseFloat(serviceQualityScore) >= 80 ? 'text-green-600' :
                                parseFloat(serviceQualityScore) >= 60 ? 'text-yellow-600' :
                                'text-red-600'
                            }`}>
                                {parseFloat(serviceQualityScore) >= 80 ? 'Excellent' :
                                 parseFloat(serviceQualityScore) >= 60 ? 'Good' :
                                 parseFloat(serviceQualityScore) >= 40 ? 'Fair' :
                                 'Poor'}
                            </span>
                        </div>
                        <div className="text-xl font-bold text-emerald-700">{serviceQualityScore}%</div>
                        <div className="text-xs font-semibold text-slate-700">Service Quality</div>
                        <div className="text-xs text-slate-500 mt-1">
                            Calls {'<'}60s
                        </div>
                    </div>
                </div>

                {/* System Info */}
                <div className="grid grid-cols-2 gap-2 p-2 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="text-center">
                        <div className="text-xs text-slate-500">Utilization</div>
                        <div className="text-sm font-bold text-slate-700">
                            {totalUtilization.toFixed(0)}%
                        </div>
                    </div>
                    <div className="text-center">
                        <div className="text-xs text-slate-500">Status</div>
                        <div className="text-sm font-bold">
                            {stats.pendingCalls > 0 ? (
                                <span className="text-blue-600">🔵 Active</span>
                            ) : (
                                <span className="text-green-600">🟢 Ready</span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Additional Metrics */}
                <div className="grid grid-cols-3 gap-2">
                    <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-2 text-center">
                        <div className="text-lg">🎯</div>
                        <div className="text-xl font-bold text-indigo-700">{totalTripsCompleted}</div>
                        <div className="text-xs font-semibold text-slate-700">Trips</div>
                    </div>
                    <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-2 text-center">
                        <div className="text-lg">📏</div>
                        <div className="text-xl font-bold text-cyan-700">{totalFloorsTravel}</div>
                        <div className="text-xs font-semibold text-slate-700">Floors</div>
                    </div>
                    <div className="bg-rose-50 border border-rose-200 rounded-lg p-2 text-center">
                        <div className="text-lg">🔄</div>
                        <div className="text-xl font-bold text-rose-700">{totalDirectionChanges}</div>
                        <div className="text-xs font-semibold text-slate-700">Changes</div>
                    </div>
                </div>

                {/* Throughput Metric */}
                <div className="bg-gradient-to-br from-violet-50 to-purple-50 border border-violet-200 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-lg">⚡</span>
                        <span className="text-xs text-violet-600 font-semibold">
                            Live
                        </span>
                    </div>
                    <div className="text-xl font-bold text-violet-700">{throughput}</div>
                    <div className="text-xs font-semibold text-slate-700">Calls per Minute</div>
                    <div className="text-xs text-slate-500 mt-1">
                        Throughput rate
                    </div>
                </div>

                {/* Pending Calls List */}
                {calls.length > 0 && (
                    <div className="pt-3 border-t border-slate-200">
                        <h3 className="text-sm font-bold text-slate-800 mb-2 flex items-center justify-between">
                            <span>📞 Pending Calls</span>
                            <span className="text-xs font-normal text-slate-500">{calls.length}</span>
                        </h3>
                        <div className="space-y-2 max-h-96 overflow-y-auto">
                            {calls.map(call => (
                                <div key={call.id} className="border border-slate-200 rounded-lg p-2 bg-gradient-to-br from-white to-slate-50 hover:shadow-sm transition-all">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <span className="text-lg">
                                                {call.direction === 'up' ? '⬆️' : '⬇️'}
                                            </span>
                                            <div>
                                                <div className="text-sm font-semibold text-slate-800">Floor {call.floor}</div>
                                                <div className="text-xs text-slate-500">Going {call.direction}</div>
                                            </div>
                                        </div>
                                    </div>
                                    {!isAutoMode && assignCall && (
                                        <div className="space-y-1">
                                            <p className="text-xs text-slate-600 font-medium">Assign:</p>
                                            <div className="flex flex-wrap gap-1">
                                                {elevators.map(elev => (
                                                    <button
                                                        key={`assign-${call.id}-${elev.id}`}
                                                        onClick={() => assignCall(call.id, elev.id)}
                                                        className={`px-2 py-0.5 text-xs font-medium rounded ${getElevatorColorClass(elev.id)} text-white hover:opacity-90 transition-all`}
                                                    >
                                                        E{elev.id + 1}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    {isAutoMode && (
                                        <div className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded border border-green-200 text-center">
                                            Auto-assigned
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {calls.length === 0 && (
                    <div className="pt-3 border-t border-slate-200">
                        <div className="bg-slate-50 border border-dashed border-slate-200 rounded-lg p-4 text-center">
                            <div className="text-2xl mb-1">✨</div>
                            <p className="text-xs text-slate-500">No pending calls</p>
                        </div>
                    </div>
                )}
            </div>
        )
    }

    // Original non-compact layout
    const statCards = [
        {
            label: 'Active Elevators',
            value: stats.activeElevators,
            total: elevators.length,
            icon: '🚀',
            color: 'blue',
            description: 'Currently moving'
        },
        {
            label: 'Idle Elevators',
            value: stats.idleElevators,
            total: elevators.length,
            icon: '💤',
            color: 'slate',
            description: 'Waiting for requests'
        },
        {
            label: 'Pending Calls',
            value: stats.pendingCalls,
            icon: '📞',
            color: 'amber',
            description: isAutoMode ? 'Being processed' : 'Awaiting assignment'
        },
        {
            label: 'Queued Stops',
            value: stats.totalTrips,
            icon: '📋',
            color: 'green',
            description: 'Scheduled destinations'
        }
    ]

    const getColorClasses = (color) => {
        const colors = {
            blue: {
                bg: 'bg-blue-50',
                border: 'border-blue-200',
                text: 'text-blue-700',
                icon: 'text-blue-600'
            },
            slate: {
                bg: 'bg-slate-50',
                border: 'border-slate-200',
                text: 'text-slate-700',
                icon: 'text-slate-600'
            },
            amber: {
                bg: 'bg-amber-50',
                border: 'border-amber-200',
                text: 'text-amber-700',
                icon: 'text-amber-600'
            },
            green: {
                bg: 'bg-green-50',
                border: 'border-green-200',
                text: 'text-green-700',
                icon: 'text-green-600'
            }
        }
        return colors[color] || colors.blue
    }

    return (
        <div className={compact ? "space-y-3" : "bg-white rounded-lg shadow-md border border-slate-200 p-4 hover:shadow-lg transition-shadow duration-200"}>
            {!compact && (
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        📊 System Statistics
                    </h3>
                    <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
                        Live
                    </span>
                </div>
            )}
            
            <div className={compact ? "grid grid-cols-1 gap-3" : "grid grid-cols-2 lg:grid-cols-4 gap-3"}>
                {statCards.map((stat, index) => {
                    const colors = getColorClasses(stat.color)
                    return (
                        <div
                            key={index}
                            className={`${colors.bg} ${colors.border} border rounded-lg p-3 transition-all duration-200 hover:shadow-md`}
                        >
                            <div className="flex items-center justify-between mb-1">
                                <span className={`text-2xl ${colors.icon}`}>{stat.icon}</span>
                                {stat.total !== undefined && (
                                    <span className="text-xs text-slate-500">
                                        /{stat.total}
                                    </span>
                                )}
                            </div>
                            <div className={`text-2xl font-bold ${colors.text}`}>
                                {stat.value}
                            </div>
                            <div className="text-xs font-semibold text-slate-700">
                                {stat.label}
                            </div>
                            <div className="text-xs text-slate-500">
                                {stat.description}
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Additional System Info - Compact */}
            <div className={compact ? "pt-3 border-t border-slate-200" : "mt-3 pt-3 border-t border-slate-200"}>
                <div className={compact ? "grid grid-cols-2 gap-3 text-center" : "grid grid-cols-4 gap-3 text-center"}>
                    <div>
                        <div className="text-xs text-slate-500">Mode</div>
                        <div className="text-xs font-semibold text-slate-700">
                            {isAutoMode ? '🤖 Auto' : '👆 Manual'}
                        </div>
                    </div>
                    <div>
                        <div className="text-xs text-slate-500">Units</div>
                        <div className="text-xs font-semibold text-slate-700">
                            {elevators.length}
                        </div>
                    </div>
                    <div>
                        <div className="text-xs text-slate-500">Efficiency</div>
                        <div className="text-xs font-semibold text-slate-700">
                            {elevators.length > 0 
                                ? Math.round((stats.activeElevators / elevators.length) * 100)
                                : 0}%
                        </div>
                    </div>
                    <div>
                        <div className="text-xs text-slate-500">Status</div>
                        <div className="text-xs font-semibold text-slate-700">
                            {stats.pendingCalls > 0 ? '🟡 Busy' : '🟢 Ready'}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default StatisticsDashboard
