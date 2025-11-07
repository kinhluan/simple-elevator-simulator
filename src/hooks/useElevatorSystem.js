import { useState, useEffect, useRef, useCallback } from 'react'
import { getAlgorithm, insertIntoQueue } from '../algorithms/elevatorScheduler'
import { 
    ELEVATOR_STATES, 
    ELEVATOR_TIMING
} from '../constants/elevatorTiming'

/**
 * COMPLETELY REWRITTEN ELEVATOR SYSTEM
 * 
 * Key improvements:
 * 1. Single timer per elevator (no race conditions)
 * 2. Command-based state machine (deterministic state transitions)
 * 3. Proper queue management with object format support
 * 4. Correct SCAN/LOOK/SSTF algorithm implementation
 * 5. Immediate auto-assignment (no timing delays causing race conditions)
 * 6. Proper direction handling for each algorithm
 */

/**
 * Custom hook to manage elevator system state and logic
 */
export const useElevatorSystem = (numFloors, numElevators, schedulingMode = 'manual', timingConfig = {}) => {
    const [elevators, setElevators] = useState([])
    const [calls, setCalls] = useState([])
    
    // Use refs to store timers and prevent race conditions
    const timersRef = useRef({})
    const elevatorsRef = useRef([])
    
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
    }
    
    const isAutoMode = schedulingMode !== 'manual'
    
    // Keep elevatorsRef in sync with elevators state
    useEffect(() => {
        elevatorsRef.current = elevators
    }, [elevators])

    /**
     * Helper function for SCAN algorithm to ensure it goes to extremes
     * Adds a phantom floor at the extreme end if the elevator should continue
     */
    const ensureSCANExtreme = useCallback((queue, currentFloor, direction) => {
        if (!queue || queue.length === 0) return queue
        
        if (direction === 'up') {
            // Check if we need to go to the top
            const hasFloorsAbove = queue.some(q => q.floor > currentFloor)
            if (hasFloorsAbove) {
                const maxInQueue = Math.max(...queue.map(q => q.floor))
                if (maxInQueue < numFloors) {
                    // Add phantom floor at top
                    const newQueue = [...queue]
                    newQueue.push({ floor: numFloors, callDirection: null, timestamp: Date.now(), isPhantom: true })
                    return newQueue.sort((a, b) => a.floor - b.floor) // Keep sorted ascending
                }
            }
        } else if (direction === 'down') {
            // Check if we need to go to the bottom
            const hasFloorsBelow = queue.some(q => q.floor < currentFloor)
            if (hasFloorsBelow) {
                const minInQueue = Math.min(...queue.map(q => q.floor))
                if (minInQueue > 1) {
                    // Add phantom floor at bottom
                    const newQueue = [...queue]
                    newQueue.push({ floor: 1, callDirection: null, timestamp: Date.now(), isPhantom: true })
                    return newQueue.sort((a, b) => b.floor - a.floor) // Keep sorted descending
                }
            }
        }
        return queue
    }, [numFloors])

    /**
     * Schedule the next state transition for an elevator
     * This is the ONLY place where timers are set, preventing race conditions
     */
    const scheduleNextTransition = useCallback((elevatorId) => {
        // Clear any existing timer for this elevator
        if (timersRef.current[elevatorId]) {
            clearTimeout(timersRef.current[elevatorId])
            timersRef.current[elevatorId] = null
        }
        
        const elevator = elevatorsRef.current.find(e => e.id === elevatorId)
        if (!elevator || elevator.operationalState === ELEVATOR_STATES.IDLE) return
        
        let delay = 0
        
        // Determine delay based on current state
        switch (elevator.operationalState) {
            case ELEVATOR_STATES.MOVING:
                delay = timing.floorTravelTime
                break
            case ELEVATOR_STATES.ARRIVING:
                delay = ELEVATOR_TIMING.ARRIVAL_SETTLING_TIME
                break
            case ELEVATOR_STATES.DOORS_OPENING:
                delay = timing.doorOpenTime
                break
            case ELEVATOR_STATES.DOORS_OPEN:
                delay = timing.doorHoldTime
                break
            case ELEVATOR_STATES.DOORS_CLOSING:
                delay = timing.doorCloseTime
                break
            default:
                return
        }
        
        // Schedule the transition
        timersRef.current[elevatorId] = setTimeout(() => {
            transitionElevatorState(elevatorId)
        }, delay)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [timing])

    /**
     * Transition an elevator to its next state
     * This function determines what the next state should be based on the current state
     */
    const transitionElevatorState = useCallback((elevatorId) => {
        setElevators(prev => {
            const elevator = prev.find(e => e.id === elevatorId)
            if (!elevator) return prev
            
            const now = Date.now()
            const timeSinceLastChange = now - (elevator.lastStateChangeTime || now)
            
            // Update time in current state
            let timeInState = { ...elevator.timeInState }
            if (elevator.operationalState === ELEVATOR_STATES.IDLE) {
                timeInState.idle += timeSinceLastChange
            } else if (elevator.operationalState === ELEVATOR_STATES.MOVING) {
                timeInState.moving += timeSinceLastChange
            } else {
                timeInState.serving += timeSinceLastChange
            }
            
            let updates = {}
            
            switch (elevator.operationalState) {
                case ELEVATOR_STATES.MOVING: {
                    // Move one floor in the current direction
                    const currentFloor = elevator.currentFloor
                    const targetFloor = elevator.targetFloor
                    const direction = elevator.direction
                    
                    let nextFloor = currentFloor
                    if (direction === 'up') {
                        nextFloor = currentFloor + 1
                    } else if (direction === 'down') {
                        nextFloor = currentFloor - 1
                    }
                    
                    // Safety check
                    if (nextFloor < 1 || nextFloor > numFloors) {
                        console.error(`Invalid floor ${nextFloor} for elevator ${elevatorId}`)
                        updates = {
                            operationalState: ELEVATOR_STATES.IDLE,
                            isMoving: false,
                            direction: 'idle',
                            targetFloor: null,
                            queue: []
                        }
                        break
                    }
                    
                    // Check if we've reached the target
                    if (nextFloor === targetFloor) {
                        updates = {
                            currentFloor: nextFloor,
                            operationalState: ELEVATOR_STATES.ARRIVING,
                            floorsTravel: (elevator.floorsTravel || 0) + 1
                        }
                    } else {
                        // Continue moving
                        updates = {
                            currentFloor: nextFloor,
                            floorsTravel: (elevator.floorsTravel || 0) + 1
                        }
                    }
                    break
                }
                
                case ELEVATOR_STATES.ARRIVING: {
                    // Transition to doors opening
                    const passengerCount = ELEVATOR_TIMING.BASE_PASSENGERS + 
                        Math.floor(Math.random() * (ELEVATOR_TIMING.MAX_ADDITIONAL_PASSENGERS + 1))
                    
                    updates = {
                        operationalState: ELEVATOR_STATES.DOORS_OPENING,
                        doorProgress: 0,
                        passengerCount
                    }
                    break
                }
                
                case ELEVATOR_STATES.DOORS_OPENING: {
                    // Transition to doors open
                    updates = {
                        operationalState: ELEVATOR_STATES.DOORS_OPEN,
                        doorProgress: 100
                    }
                    break
                }
                
                case ELEVATOR_STATES.DOORS_OPEN: {
                    // Transition to doors closing
                    updates = {
                        operationalState: ELEVATOR_STATES.DOORS_CLOSING
                    }
                    break
                }
                
                case ELEVATOR_STATES.DOORS_CLOSING: {
                    // Process the queue and determine next action
                    const currentFloor = elevator.currentFloor
                    const reachedCall = elevator.queue[0]
                    
                    // Record wait time metrics (only for non-phantom floors)
                    if (reachedCall && reachedCall.timestamp && !reachedCall.isPhantom) {
                        const waitTime = Date.now() - reachedCall.timestamp
                        setPerformanceMetrics(prevMetrics => ({
                            completedCalls: [...prevMetrics.completedCalls, {
                                floor: reachedCall.floor,
                                waitTime,
                                timestamp: Date.now()
                            }].slice(-100),
                            totalWaitTime: prevMetrics.totalWaitTime + waitTime,
                            callsServed: prevMetrics.callsServed + 1,
                            sessionStartTime: prevMetrics.sessionStartTime
                        }))
                    }
                    
                    // Remove the completed floor from queue
                    let newQueue = elevator.queue.slice(1)
                    
                    // Re-sort queue for SSTF after reaching each floor
                    if (schedulingMode === 'sstf' && newQueue.length > 0) {
                        newQueue.sort((a, b) => {
                            const distA = Math.abs(a.floor - currentFloor)
                            const distB = Math.abs(b.floor - currentFloor)
                            return distA - distB
                        })
                    }
                    
                    // For SCAN algorithm: ensure we go to extremes
                    if (schedulingMode === 'scan' && newQueue.length > 0) {
                        newQueue = ensureSCANExtreme(newQueue, currentFloor, elevator.direction)
                    }
                    
                    // Determine next target
                    if (newQueue.length === 0) {
                        // No more destinations - become idle
                        updates = {
                            operationalState: ELEVATOR_STATES.IDLE,
                            isMoving: false,
                            direction: 'idle',
                            targetFloor: null,
                            queue: [],
                            doorProgress: 0,
                            passengerCount: 0,
                            tripsCompleted: (elevator.tripsCompleted || 0) + 1
                        }
                    } else {
                        // Get next destination
                        const nextTarget = newQueue[0].floor
                        const newDirection = nextTarget > currentFloor ? 'up' : 
                                           nextTarget < currentFloor ? 'down' : 'idle'
                        
                        // Track direction changes
                        let directionChanges = elevator.directionChanges || 0
                        if (newDirection !== 'idle' && 
                            elevator.direction !== 'idle' && 
                            elevator.direction !== newDirection) {
                            directionChanges++
                        }
                        
                        if (newDirection === 'idle') {
                            // Already at the floor? Skip this one
                            newQueue = newQueue.slice(1)
                            if (newQueue.length === 0) {
                                updates = {
                                    operationalState: ELEVATOR_STATES.IDLE,
                                    isMoving: false,
                                    direction: 'idle',
                                    targetFloor: null,
                                    queue: [],
                                    doorProgress: 0,
                                    passengerCount: 0,
                                    tripsCompleted: (elevator.tripsCompleted || 0) + 1
                                }
                            } else {
                                const nextTarget2 = newQueue[0].floor
                                const newDirection2 = nextTarget2 > currentFloor ? 'up' : 'down'
                                updates = {
                                    operationalState: ELEVATOR_STATES.MOVING,
                                    isMoving: true,
                                    direction: newDirection2,
                                    targetFloor: nextTarget2,
                                    queue: newQueue,
                                    doorProgress: 0,
                                    passengerCount: 0,
                                    tripsCompleted: (elevator.tripsCompleted || 0) + 1,
                                    lastDirection: newDirection2
                                }
                            }
                        } else {
                            // Move to next destination
                            updates = {
                                operationalState: ELEVATOR_STATES.MOVING,
                                isMoving: true,
                                direction: newDirection,
                                targetFloor: nextTarget,
                                queue: newQueue,
                                doorProgress: 0,
                                passengerCount: 0,
                                directionChanges,
                                tripsCompleted: (elevator.tripsCompleted || 0) + 1,
                                lastDirection: newDirection
                            }
                        }
                    }
                    break
                }
                
                default:
                    break
            }
            
            // Apply updates and schedule next transition
            const newElevators = prev.map(e => {
                if (e.id !== elevatorId) return e
                
                const updatedElevator = {
                    ...e,
                    ...updates,
                    timeInState,
                    lastStateChangeTime: now
                }
                
                // Schedule next transition if not idle
                if (updatedElevator.operationalState !== ELEVATOR_STATES.IDLE) {
                    setTimeout(() => scheduleNextTransition(elevatorId), 0)
                }
                
                return updatedElevator
            })
            
            return newElevators
        })
    }, [numFloors, schedulingMode, scheduleNextTransition, ensureSCANExtreme])

    // Initialize/reset elevators when configuration changes
    useEffect(() => {
        // Clear all existing timers
        Object.values(timersRef.current).forEach(timer => {
            if (timer) clearTimeout(timer)
        })
        timersRef.current = {}
        
        setElevators(
            Array(numElevators).fill().map((_, index) => ({
                id: index,
                currentFloor: 1,
                targetFloor: null,
                direction: 'idle',
                isMoving: false,
                operationalState: ELEVATOR_STATES.IDLE,
                queue: [],
                doorProgress: 0,
                passengerCount: 0,
                // Performance tracking
                tripsCompleted: 0,
                floorsTravel: 0,
                directionChanges: 0,
                timeInState: {
                    idle: 0,
                    moving: 0,
                    serving: 0
                },
                lastStateChangeTime: Date.now(),
                lastDirection: 'idle'
            }))
        )
        setCalls([])
        setPerformanceMetrics({
            completedCalls: [],
            totalWaitTime: 0,
            callsServed: 0,
            sessionStartTime: Date.now()
        })
    }, [numFloors, numElevators])

    // Add a floor to an elevator's queue
    const addToElevatorQueue = useCallback((elevatorId, floor, callDirection = null, callTimestamp = null) => {
        setElevators(prev =>
            prev.map(e => {
                if (e.id !== elevatorId) return e

                // Create queue entry
                const queueEntry = { 
                    floor, 
                    callDirection: callDirection || null,
                    timestamp: callTimestamp || Date.now()
                }
                
                // Check if this floor is already in queue
                if (e.queue.some(q => q.floor === floor)) {
                    return e // Don't add duplicates
                }
                
                // Validate floor is within bounds
                if (floor < 1 || floor > numFloors) {
                    console.error(`Invalid floor ${floor}. Must be between 1 and ${numFloors}`)
                    return e // Don't add invalid floor
                }
                
                // Get floor numbers for algorithm
                const queueFloors = e.queue.map(q => q.floor)
                
                // Insert floor using algorithm's logic
                const newQueueFloors = insertIntoQueue(queueFloors, e.currentFloor, e.direction, floor, schedulingMode)
                
                // Rebuild queue maintaining object structure
                let newQueue = []
                
                // Add existing queue items in the order specified by algorithm
                for (const algorithmFloor of newQueueFloors) {
                    const existingEntry = e.queue.find(q => q.floor === algorithmFloor)
                    if (existingEntry) {
                        newQueue.push(existingEntry)
                    } else if (algorithmFloor === floor) {
                        newQueue.push(queueEntry)
                    }
                }
                
                // For SCAN: ensure we go to extremes if needed
                if (schedulingMode === 'scan' && newQueue.length > 0 && e.direction !== 'idle') {
                    newQueue = ensureSCANExtreme(newQueue, e.currentFloor, e.direction)
                }
                
                // If elevator is idle, start moving immediately
                if (e.direction === 'idle' && !e.isMoving && newQueue.length > 0) {
                    const firstInQueue = newQueue[0]
                    const targetFloor = firstInQueue.floor
                    const newDirection = targetFloor > e.currentFloor ? 'up' : 'down'
                    
                    const updated = {
                        ...e,
                        queue: newQueue,
                        targetFloor,
                        direction: newDirection,
                        isMoving: true,
                        operationalState: ELEVATOR_STATES.MOVING,
                        lastStateChangeTime: Date.now()
                    }
                    
                    // Trigger the transition state machine to schedule the first move
                    setTimeout(() => scheduleNextTransition(elevatorId), 0)
                    
                    return updated
                }

                // If elevator is moving, update queue (target will be updated automatically)
                return {
                    ...e,
                    queue: newQueue
                }
            })
        )
    }, [schedulingMode, numFloors, ensureSCANExtreme, scheduleNextTransition])

    // Call an elevator (add to pending calls)
    const callElevator = useCallback((floor, direction) => {
        if (!calls.some(c => c.floor === floor && c.direction === direction)) {
            const newCall = { 
                id: Date.now(), 
                floor, 
                direction,
                timestamp: Date.now()
            }
            
            // If in auto mode, immediately assign to best elevator
            if (isAutoMode) {
                const algorithm = getAlgorithm(schedulingMode)
                const bestElevatorId = algorithm(elevatorsRef.current, floor, direction, numFloors)
                if (bestElevatorId !== null) {
                    // Assign immediately without adding to calls list
                    addToElevatorQueue(bestElevatorId, floor, direction, newCall.timestamp)
                } else {
                    // No elevator available, add to pending calls
                    setCalls(prev => [...prev, newCall])
                }
            } else {
                // Manual mode: add to pending calls
                setCalls(prev => [...prev, newCall])
            }
        }
    }, [calls, isAutoMode, schedulingMode, numFloors, addToElevatorQueue])

    // Move an elevator to a specific floor (manual control)
    const moveElevator = useCallback((elevatorId, targetFloor) => {
        const elevator = elevatorsRef.current.find(e => e.id === elevatorId)
        if (!elevator || elevator.currentFloor === targetFloor) return

        // In auto mode, add to queue
        if (isAutoMode) {
            addToElevatorQueue(elevatorId, targetFloor)
            return
        }

        // Manual mode: direct floor selection
        if (elevator.isMoving) return

        setElevators(prev =>
            prev.map(e => {
                if (e.id !== elevatorId) return e
                
                const direction = targetFloor > e.currentFloor ? 'up' : 'down'
                const updated = {
                    ...e,
                    targetFloor,
                    direction,
                    isMoving: true,
                    operationalState: ELEVATOR_STATES.MOVING,
                    queue: [{ floor: targetFloor, callDirection: null, timestamp: Date.now() }],
                    lastStateChangeTime: Date.now()
                }
                
                // Trigger the transition state machine to schedule the first move
                setTimeout(() => scheduleNextTransition(elevatorId), 0)
                
                return updated
            })
        )
    }, [isAutoMode, addToElevatorQueue, scheduleNextTransition])

    // Assign a call to an elevator (manual mode)
    const assignCall = useCallback((callId, elevatorId) => {
        const call = calls.find(c => c.id === callId)
        if (!call) return

        addToElevatorQueue(elevatorId, call.floor, call.direction, call.timestamp)
        setCalls(prev => prev.filter(c => c.id !== callId))
    }, [calls, addToElevatorQueue])

    // Auto-assign all pending calls (for manual trigger)
    const autoAssignCalls = useCallback(() => {
        if (!isAutoMode || calls.length === 0) return

        const algorithm = getAlgorithm(schedulingMode)
        
        calls.forEach(call => {
            const bestElevatorId = algorithm(elevatorsRef.current, call.floor, call.direction, numFloors)
            if (bestElevatorId !== null) {
                addToElevatorQueue(bestElevatorId, call.floor, call.direction, call.timestamp)
            }
        })
        
        setCalls([])
    }, [isAutoMode, calls, schedulingMode, numFloors, addToElevatorQueue])

    // Cleanup timers on unmount
    useEffect(() => {
        return () => {
            Object.values(timersRef.current).forEach(timer => {
                if (timer) clearTimeout(timer)
            })
        }
    }, [])

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
