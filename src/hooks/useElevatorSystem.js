import { useState, useEffect } from 'react'
import { getAlgorithm, insertIntoQueue } from '../algorithms/elevatorScheduler'
import { 
    ELEVATOR_STATES, 
    ELEVATOR_TIMING, 
    calculateTravelTime
} from '../constants/elevatorTiming'

/**
 * Custom hook to manage elevator system state and logic
 */
export const useElevatorSystem = (numFloors, numElevators, schedulingMode = 'manual', timingConfig = {}) => {
    const [elevators, setElevators] = useState([])
    const [calls, setCalls] = useState([])
    
    // Performance tracking state
    const [performanceMetrics, setPerformanceMetrics] = useState({
        completedCalls: [],
        totalWaitTime: 0,
        callsServed: 0,
        sessionStartTime: Date.now()
    })
    
    // Merge custom timing config with defaults
    const timing = {
        floorTravelTime: timingConfig.floorTravelTime ?? ELEVATOR_TIMING.FLOOR_TRAVEL_TIME,
        doorOpenTime: timingConfig.doorOpenTime ?? ELEVATOR_TIMING.DOOR_OPEN_TIME,
        doorHoldTime: timingConfig.doorHoldTime ?? ELEVATOR_TIMING.DOOR_HOLD_TIME,
        doorCloseTime: timingConfig.doorCloseTime ?? ELEVATOR_TIMING.DOOR_CLOSE_TIME,
        callAssignmentDelay: timingConfig.callAssignmentDelay ?? ELEVATOR_TIMING.CALL_ASSIGNMENT_DELAY,
    }
    
    const isAutoMode = schedulingMode !== 'manual'

    // Helper function to update elevator performance stats
    const updateElevatorStats = (elevator, updates) => {
        const now = Date.now()
        const timeSinceLastChange = now - (elevator.lastStateChangeTime || now)
        
        // Update time in previous state
        let timeInState = { ...elevator.timeInState }
        if (elevator.operationalState === ELEVATOR_STATES.IDLE) {
            timeInState.idle += timeSinceLastChange
        } else if (elevator.operationalState === ELEVATOR_STATES.MOVING) {
            timeInState.moving += timeSinceLastChange
        } else {
            // ARRIVING, DOORS_OPENING, DOORS_OPEN, DOORS_CLOSING
            timeInState.serving += timeSinceLastChange
        }
        
        // Track direction changes
        let directionChanges = elevator.directionChanges || 0
        if (updates.direction && 
            updates.direction !== 'idle' && 
            elevator.lastDirection !== 'idle' && 
            elevator.lastDirection !== updates.direction) {
            directionChanges++
        }
        
        // Track floors traveled
        let floorsTravel = elevator.floorsTravel || 0
        if (updates.currentFloor && updates.currentFloor !== elevator.currentFloor) {
            floorsTravel += Math.abs(updates.currentFloor - elevator.currentFloor)
        }
        
        return {
            ...elevator,
            ...updates,
            timeInState,
            directionChanges,
            floorsTravel,
            lastStateChangeTime: now,
            lastDirection: updates.direction || elevator.direction
        }
    }

    // Initialize/reset elevators when configuration changes
    useEffect(() => {
        setElevators(
            Array(numElevators).fill().map((_, index) => ({
                id: index,
                currentFloor: 1,
                targetFloor: null,
                direction: 'idle',
                isMoving: false,
                operationalState: ELEVATOR_STATES.IDLE, // New: detailed state for door operations
                queue: [], // Queue of {floor, callDirection} objects
                doorProgress: 0, // New: for door animation (0-100)
                passengerCount: 0, // Number of passengers boarding/alighting
                // Performance tracking
                tripsCompleted: 0,
                floorsTravel: 0,
                directionChanges: 0,
                timeInState: {
                    idle: 0,
                    moving: 0,
                    serving: 0 // doors opening/open/closing
                },
                lastStateChangeTime: Date.now(),
                lastDirection: 'idle'
            }))
        )
        setCalls([])
        // Reset performance metrics on configuration change
        setPerformanceMetrics({
            completedCalls: [],
            totalWaitTime: 0,
            callsServed: 0,
            sessionStartTime: Date.now()
        })
    }, [numFloors, numElevators])

    // Call an elevator (add to queue)
    const callElevator = (floor, direction) => {
        if (!calls.some(c => c.floor === floor && c.direction === direction)) {
            const newCall = { 
                id: Date.now(), 
                floor, 
                direction,
                timestamp: Date.now() // Track when call was created
            }
            setCalls(prev => [...prev, newCall])
            
            // If in auto mode, immediately assign to best elevator
            if (isAutoMode) {
                setTimeout(() => {
                    const algorithm = getAlgorithm(schedulingMode)
                    const bestElevatorId = algorithm(elevators, floor, direction)
                    if (bestElevatorId !== null) {
                        addToElevatorQueue(bestElevatorId, floor, direction, newCall.timestamp)
                        setCalls(prev => prev.filter(c => c.id !== newCall.id))
                    }
                }, timing.callAssignmentDelay) // Use configurable delay
            }
        }
    }

    // Add a floor to an elevator's queue
    const addToElevatorQueue = (elevatorId, floor, callDirection = null, callTimestamp = null) => {
        setElevators(prev =>
            prev.map(e => {
                if (e.id !== elevatorId) return e

                // Create queue entry with floor, direction, and timestamp
                const queueEntry = { 
                    floor, 
                    callDirection: callDirection || null,
                    timestamp: callTimestamp || Date.now() // Track when added to queue
                }
                
                // For display and algorithm purposes, extract just the floor numbers
                const queueFloors = e.queue.map(q => q.floor)
                
                // Add floor to queue using the selected algorithm's queue insertion
                const newQueueFloors = insertIntoQueue(queueFloors, e.currentFloor, e.direction, floor, schedulingMode)
                
                // Rebuild queue with direction information
                // Keep existing entries and add the new one
                let newQueue = [...e.queue]
                
                // Check if this floor is already in queue
                const existingIndex = newQueue.findIndex(q => q.floor === floor)
                if (existingIndex === -1) {
                    // Find where to insert based on the new queue order from algorithm
                    const newFloorIndex = newQueueFloors.indexOf(floor)
                    // Count how many floors before this one in the algorithm queue
                    const floorsBeforeInAlgo = newQueueFloors.slice(0, newFloorIndex)
                    
                    // Find insertion position in actual queue
                    let insertPos = 0
                    for (const floorBefore of floorsBeforeInAlgo) {
                        const posInQueue = newQueue.findIndex(q => q.floor === floorBefore)
                        if (posInQueue !== -1 && posInQueue >= insertPos) {
                            insertPos = posInQueue + 1
                        }
                    }
                    
                    newQueue.splice(insertPos, 0, queueEntry)
                }
                
                // If elevator is idle, start moving immediately
                if (e.direction === 'idle' && !e.isMoving) {
                    const firstInQueue = newQueue[0]
                    const targetFloor = firstInQueue.floor
                    const newDirection = targetFloor > e.currentFloor ? 'up' : 'down'
                    
                    return {
                        ...e,
                        queue: newQueue,
                        targetFloor,
                        direction: newDirection,
                        isMoving: true,
                        operationalState: ELEVATOR_STATES.MOVING
                    }
                }

                // If elevator is moving, check if we need to update the target
                // This happens when a new floor is inserted before the current target
                if (e.isMoving && newQueue.length > 0) {
                    const firstInQueue = newQueue[0]
                    const newTarget = firstInQueue.floor
                    
                    // Only update if the first floor in queue is different from current target
                    if (newTarget !== e.targetFloor) {
                        const newDirection = newTarget > e.currentFloor ? 'up' : 'down'
                        
                        return {
                            ...e,
                            queue: newQueue,
                            targetFloor: newTarget,
                            direction: newDirection
                        }
                    }
                }

                return {
                    ...e,
                    queue: newQueue
                }
            })
        )
    }

    // Move an elevator to a specific floor
    const moveElevator = (elevatorId, targetFloor) => {
        const elevator = elevators.find(e => e.id === elevatorId)
        if (!elevator || elevator.currentFloor === targetFloor) return

        // In auto mode, add to queue instead of direct movement
        if (isAutoMode) {
            addToElevatorQueue(elevatorId, targetFloor)
            return
        }

        // Manual mode: start floor-by-floor movement
        if (elevator.isMoving) return

        setElevators(prev =>
            prev.map(e =>
                e.id === elevatorId
                    ? {
                        ...e,
                        targetFloor,
                        direction: targetFloor > e.currentFloor ? 'up' : 'down',
                        isMoving: true,
                        operationalState: ELEVATOR_STATES.MOVING,
                        queue: [{ floor: targetFloor, callDirection: null, timestamp: Date.now() }]
                    }
                    : e
            )
        )
    }

    // Effect to handle elevator movement (floor-by-floor for both manual and auto modes)
    useEffect(() => {
        // Handle MOVING state - elevator traveling between floors
        const handleMovingState = (elevator) => {
            const currentFloor = elevator.currentFloor
            const targetFloor = elevator.targetFloor
            const direction = elevator.direction
            
            // Calculate next floor
            let nextFloor = currentFloor
            if (direction === 'up') {
                nextFloor = currentFloor + 1
            } else if (direction === 'down') {
                nextFloor = currentFloor - 1
            }

            // Safety check
            if (nextFloor < 1 || nextFloor > numFloors) {
                console.error(`Elevator ${elevator.id} tried to move to invalid floor ${nextFloor}`)
                setElevators(prev =>
                    prev.map(e => e.id === elevator.id ? {
                        ...e,
                        targetFloor: null,
                        direction: 'idle',
                        isMoving: false,
                        operationalState: ELEVATOR_STATES.IDLE,
                        queue: []
                    } : e)
                )
                return null
            }

            // Calculate travel time based on distance to target
            const remainingDistance = Math.abs(targetFloor - currentFloor)
            const timeToNextFloor = remainingDistance === 1 
                ? calculateTravelTime(1) 
                : timing.floorTravelTime

            return setTimeout(() => {
                setElevators(prev =>
                    prev.map(e => {
                        if (e.id !== elevator.id) return e

                        // Check if we've reached the target floor
                        if (nextFloor === targetFloor) {
                            // Transition to ARRIVING state
                            return updateElevatorStats(e, {
                                currentFloor: nextFloor,
                                operationalState: ELEVATOR_STATES.ARRIVING
                            })
                        }

                        // Continue moving toward target
                        return updateElevatorStats(e, {
                            currentFloor: nextFloor
                        })
                    })
                )
            }, timeToNextFloor)
        }

        // Handle ARRIVING state - elevator settling at floor
        const handleArrivingState = (elevator) => {
            return setTimeout(() => {
                setElevators(prev =>
                    prev.map(e => e.id === elevator.id ? updateElevatorStats(e, {
                        operationalState: ELEVATOR_STATES.DOORS_OPENING,
                        doorProgress: 0
                    }) : e)
                )
            }, ELEVATOR_TIMING.ARRIVAL_SETTLING_TIME)
        }

        // Handle DOORS_OPENING state
        const handleDoorsOpeningState = (elevator) => {
            return setTimeout(() => {
                // Generate random passenger count when doors open
                const passengerCount = ELEVATOR_TIMING.BASE_PASSENGERS + 
                    Math.floor(Math.random() * (ELEVATOR_TIMING.MAX_ADDITIONAL_PASSENGERS + 1))
                
                setElevators(prev =>
                    prev.map(e => e.id === elevator.id ? updateElevatorStats(e, {
                        operationalState: ELEVATOR_STATES.DOORS_OPEN,
                        doorProgress: 100,
                        passengerCount: passengerCount
                    }) : e)
                )
            }, timing.doorOpenTime)
        }

        // Handle DOORS_OPEN state - passengers boarding/alighting
        const handleDoorsOpenState = (elevator) => {
            // Use custom door hold time instead of calculated
            const holdTime = timing.doorHoldTime
            
            return setTimeout(() => {
                setElevators(prev =>
                    prev.map(e => e.id === elevator.id ? updateElevatorStats(e, {
                        operationalState: ELEVATOR_STATES.DOORS_CLOSING
                    }) : e)
                )
            }, holdTime)
        }

        // Handle DOORS_CLOSING state - prepare for next move or idle
        const handleDoorsClosingState = (elevator) => {
            return setTimeout(() => {
                setElevators(prev =>
                    prev.map(e => {
                        if (e.id !== elevator.id) return e

                        const currentFloor = e.currentFloor
                        
                        // Get the call information for the reached floor
                        const reachedCall = e.queue[0]
                        
                        // Record wait time if we have timestamp
                        if (reachedCall && reachedCall.timestamp) {
                            const waitTime = Date.now() - reachedCall.timestamp
                            setPerformanceMetrics(prevMetrics => ({
                                completedCalls: [...prevMetrics.completedCalls, {
                                    floor: reachedCall.floor,
                                    waitTime,
                                    timestamp: Date.now()
                                }].slice(-100), // Keep last 100 calls
                                totalWaitTime: prevMetrics.totalWaitTime + waitTime,
                                callsServed: prevMetrics.callsServed + 1,
                                sessionStartTime: prevMetrics.sessionStartTime
                            }))
                        }
                        
                        // Increment trip counter
                        const tripsCompleted = (e.tripsCompleted || 0) + 1
                        
                        // Remove reached floor from queue
                        let newQueue = e.queue.slice(1)

                        // For SSTF algorithm, re-sort queue based on new position
                        if (schedulingMode === 'sstf' && newQueue.length > 0) {
                            newQueue.sort((a, b) => {
                                const distA = Math.abs(a.floor - currentFloor)
                                const distB = Math.abs(b.floor - currentFloor)
                                return distA - distB
                            })
                        }

                        // Determine next direction based on call direction or queue
                        let newDirection = 'idle'
                        let nextTarget = null
                        
                        // If the call had a direction, continue in that direction if possible
                        if (reachedCall && reachedCall.callDirection && isAutoMode) {
                            const continueDirection = reachedCall.callDirection
                            
                            // For LOOK: continue in call direction to serve similar calls
                            if (schedulingMode === 'look') {
                                const nextInDirection = newQueue.find(q => {
                                    if (continueDirection === 'up') {
                                        return q.floor > currentFloor
                                    } else {
                                        return q.floor < currentFloor
                                    }
                                })
                                
                                if (nextInDirection) {
                                    nextTarget = nextInDirection.floor
                                    newDirection = continueDirection
                                } else if (newQueue.length > 0) {
                                    nextTarget = newQueue[0].floor
                                    newDirection = nextTarget > currentFloor ? 'up' : 'down'
                                }
                            } else {
                                // SSTF or manual: just go to next in queue
                                if (newQueue.length > 0) {
                                    nextTarget = newQueue[0].floor
                                    newDirection = nextTarget > currentFloor ? 'up' : 'down'
                                }
                            }
                        } else {
                            // No call direction (manual mode) - just go to next floor in queue
                            if (newQueue.length > 0) {
                                nextTarget = newQueue[0].floor
                                newDirection = nextTarget > currentFloor ? 'up' : 'down'
                            }
                        }

                        // Add direction change delay if needed
                        const needsDirectionChange = newDirection !== 'idle' && 
                            newDirection !== e.direction && 
                            e.direction !== 'idle'

                        if (needsDirectionChange) {
                            // Add a small delay for direction change
                            setTimeout(() => {
                                setElevators(prev2 => 
                                    prev2.map(e2 => e2.id === elevator.id ? updateElevatorStats(e2, {
                                        direction: newDirection,
                                        targetFloor: nextTarget,
                                        operationalState: ELEVATOR_STATES.MOVING,
                                        doorProgress: 0,
                                        tripsCompleted
                                    }) : e2)
                                )
                            }, ELEVATOR_TIMING.DIRECTION_CHANGE_DELAY)

                            return updateElevatorStats(e, {
                                queue: newQueue,
                                doorProgress: 0,
                                passengerCount: 0,
                                tripsCompleted
                            })
                        }

                        // If we have a next target, continue moving
                        if (nextTarget !== null) {
                            return updateElevatorStats(e, {
                                targetFloor: nextTarget,
                                direction: newDirection,
                                queue: newQueue,
                                isMoving: true,
                                operationalState: ELEVATOR_STATES.MOVING,
                                doorProgress: 0,
                                passengerCount: 0,
                                tripsCompleted
                            })
                        }

                        // No more floors, become idle
                        return updateElevatorStats(e, {
                            targetFloor: null,
                            direction: 'idle',
                            isMoving: false,
                            operationalState: ELEVATOR_STATES.IDLE,
                            queue: [],
                            doorProgress: 0,
                            passengerCount: 0,
                            tripsCompleted
                        })
                    })
                )
            }, timing.doorCloseTime)
        }

        const intervals = elevators.map(elevator => {
            if (!elevator.isMoving || elevator.targetFloor === null) return null

            // Handle different operational states
            switch (elevator.operationalState) {
                case ELEVATOR_STATES.MOVING:
                    return handleMovingState(elevator)
                case ELEVATOR_STATES.ARRIVING:
                    return handleArrivingState(elevator)
                case ELEVATOR_STATES.DOORS_OPENING:
                    return handleDoorsOpeningState(elevator)
                case ELEVATOR_STATES.DOORS_OPEN:
                    return handleDoorsOpenState(elevator)
                case ELEVATOR_STATES.DOORS_CLOSING:
                    return handleDoorsClosingState(elevator)
                default:
                    return null
            }
        })

        return () => {
            intervals.forEach(interval => {
                if (interval) clearTimeout(interval)
            })
        }
    }, [elevators, schedulingMode, numFloors, isAutoMode, timing.floorTravelTime, timing.doorOpenTime, timing.doorHoldTime, timing.doorCloseTime])

    // Assign a call to an elevator (manual mode)
    const assignCall = (callId, elevatorId) => {
        const call = calls.find(c => c.id === callId)
        if (!call) return

        if (isAutoMode) {
            addToElevatorQueue(elevatorId, call.floor, call.direction, call.timestamp)
        } else {
            // In manual mode, we still track timestamp by adding to queue
            const elevator = elevators.find(e => e.id === elevatorId)
            if (elevator && !elevator.isMoving) {
                const targetFloor = call.floor
                setElevators(prev =>
                    prev.map(e =>
                        e.id === elevatorId
                            ? {
                                ...e,
                                targetFloor,
                                direction: targetFloor > e.currentFloor ? 'up' : 'down',
                                isMoving: true,
                                operationalState: ELEVATOR_STATES.MOVING,
                                queue: [{ floor: targetFloor, callDirection: call.direction, timestamp: call.timestamp }]
                            }
                            : e
                    )
                )
            }
        }
        
        setCalls(prev => prev.filter(c => c.id !== callId))
    }

    // Auto-assign pending calls using selected scheduling algorithm
    const autoAssignCalls = () => {
        if (!isAutoMode || calls.length === 0) return

        const algorithm = getAlgorithm(schedulingMode)
        
        calls.forEach(call => {
            const bestElevatorId = algorithm(elevators, call.floor, call.direction)
            if (bestElevatorId !== null) {
                addToElevatorQueue(bestElevatorId, call.floor, call.direction, call.timestamp)
            }
        })
        
        setCalls([])
    }

    return {
        elevators,
        calls,
        callElevator,
        moveElevator,
        assignCall,
        autoAssignCalls,
        addToElevatorQueue,
        performanceMetrics
    }
}
