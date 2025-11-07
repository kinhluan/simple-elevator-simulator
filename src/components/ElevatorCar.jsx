import { useState, useEffect, useRef } from 'react'
import { getElevatorColorClass } from '../utils/elevatorUtils'
import { ELEVATOR_STATES, ELEVATOR_TIMING } from '../constants/elevatorTiming'

const ElevatorCar = ({ elevator, numFloors, elevatorIndex }) => {
    const [doorOpenPercentage, setDoorOpenPercentage] = useState(0)
    const previousStateRef = useRef(elevator?.operationalState)

    // Animate door opening/closing progressively
    useEffect(() => {
        if (!elevator) return

        let animationFrame
        let startTime
        const currentState = elevator.operationalState
        const previousState = previousStateRef.current

        // Detect state change
        if (currentState !== previousState) {
            previousStateRef.current = currentState
        }

        const animate = (timestamp) => {
            if (!startTime) startTime = timestamp
            const elapsed = timestamp - startTime

            if (elevator.operationalState === ELEVATOR_STATES.DOORS_OPENING) {
                // Smooth opening animation
                const duration = ELEVATOR_TIMING.DOOR_OPEN_TIME
                const progress = Math.min(elapsed / duration, 1)
                // Ease-out cubic for smooth deceleration
                const eased = 1 - Math.pow(1 - progress, 3)
                setDoorOpenPercentage(eased * 100)

                if (progress < 1) {
                    animationFrame = requestAnimationFrame(animate)
                }
            } else if (elevator.operationalState === ELEVATOR_STATES.DOORS_CLOSING) {
                // Smooth closing animation
                const duration = ELEVATOR_TIMING.DOOR_CLOSE_TIME
                const progress = Math.min(elapsed / duration, 1)
                // Ease-in cubic for smooth acceleration
                const eased = Math.pow(progress, 3)
                setDoorOpenPercentage((1 - eased) * 100)

                if (progress < 1) {
                    animationFrame = requestAnimationFrame(animate)
                }
            } else if (elevator.operationalState === ELEVATOR_STATES.DOORS_OPEN) {
                // Fully open
                setDoorOpenPercentage(100)
            } else if (elevator.operationalState === ELEVATOR_STATES.ARRIVING) {
                // Keep doors closed during arrival
                setDoorOpenPercentage(0)
            } else {
                // Closed (idle or moving)
                setDoorOpenPercentage(0)
            }
        }

        animationFrame = requestAnimationFrame(animate)

        return () => {
            if (animationFrame) {
                cancelAnimationFrame(animationFrame)
            }
        }
    }, [elevator])

    if (!elevator) return null

    const isDoorsOpen = elevator.operationalState === ELEVATOR_STATES.DOORS_OPEN ||
                        elevator.operationalState === ELEVATOR_STATES.DOORS_OPENING ||
                        elevator.operationalState === ELEVATOR_STATES.DOORS_CLOSING

    const isDoorAnimating = elevator.operationalState === ELEVATOR_STATES.DOORS_OPENING ||
                            elevator.operationalState === ELEVATOR_STATES.DOORS_CLOSING

    return (
        <div
            className={`absolute left-0 right-0 mx-2 h-16 rounded-xl transition-all duration-1000 flex items-center justify-center text-white font-bold shadow-xl ${getElevatorColorClass(elevatorIndex)} ring-2 ring-white overflow-hidden`}
            style={{
                top: `${(numFloors - elevator.currentFloor) * 80 + 8}px`,
                opacity: elevator.isMoving && !isDoorsOpen ? 0.9 : 1,
                transform: elevator.isMoving && !isDoorsOpen ? 'scale(0.98)' : 'scale(1)',
                boxShadow: elevator.isMoving && !isDoorsOpen
                    ? '0 10px 25px -5px rgba(0, 0, 0, 0.2), 0 8px 10px -6px rgba(0, 0, 0, 0.1)'
                    : '0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1)'
            }}
        >
            {/* Left Door */}
            <div
                className="absolute top-0 left-0 bottom-0 bg-gradient-to-r from-gray-700 to-gray-800"
                style={{
                    width: '50%',
                    transform: `translateX(-${doorOpenPercentage / 2}%)`,
                    borderRight: '2px solid rgba(255, 255, 255, 0.2)',
                    boxShadow: doorOpenPercentage > 0 ? 'inset -2px 0 8px rgba(0, 0, 0, 0.3)' : 'none',
                    transition: 'none' // Using requestAnimationFrame for smooth animation
                }}
            >
                {/* Door panel details */}
                <div className="absolute inset-0 flex items-center justify-center opacity-30">
                    <div className="w-1 h-3/4 bg-gray-600 rounded-full"></div>
                </div>
            </div>
            
            {/* Right Door */}
            <div
                className="absolute top-0 right-0 bottom-0 bg-gradient-to-l from-gray-700 to-gray-800"
                style={{
                    width: '50%',
                    transform: `translateX(${doorOpenPercentage / 2}%)`,
                    borderLeft: '2px solid rgba(255, 255, 255, 0.2)',
                    boxShadow: doorOpenPercentage > 0 ? 'inset 2px 0 8px rgba(0, 0, 0, 0.3)' : 'none',
                    transition: 'none' // Using requestAnimationFrame for smooth animation
                }}
            >
                {/* Door panel details */}
                <div className="absolute inset-0 flex items-center justify-center opacity-30">
                    <div className="w-1 h-3/4 bg-gray-600 rounded-full"></div>
                </div>
            </div>

            {/* Elevator content */}
            <div className="relative z-10 flex flex-col items-center">
                {elevator.operationalState === ELEVATOR_STATES.MOVING ? (
                    <div className="flex items-center gap-2">
                        <span className="text-2xl animate-pulse">
                            {elevator.direction === 'up' ? '↑' : '↓'}
                        </span>
                        <span className="text-sm">{elevator.currentFloor}</span>
                    </div>
                ) : isDoorsOpen ? (
                    <div className="flex flex-col items-center">
                        <span className="text-xl">{elevator.currentFloor}</span>
                        {isDoorAnimating ? (
                            <span className="text-xs opacity-75">
                                {elevator.operationalState === ELEVATOR_STATES.DOORS_OPENING ? 'Opening...' : 'Closing...'}
                            </span>
                        ) : (
                            <span className="text-xs opacity-75 animate-pulse">
                                Boarding {elevator.passengerCount || 0} 👥
                            </span>
                        )}
                    </div>
                ) : (
                    <span className="text-xl">{elevator.currentFloor}</span>
                )}
            </div>

            {/* Arrival indicator (ding!) */}
            {elevator.operationalState === ELEVATOR_STATES.ARRIVING && (
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-bold animate-bounce">
                    DING!
                </div>
            )}
        </div>
    )
}

export default ElevatorCar
