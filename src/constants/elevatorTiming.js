/**
 * Realistic Elevator Timing Constants
 * Based on typical commercial elevator specifications
 */

export const ELEVATOR_TIMING = {
    // Movement timing (in milliseconds)
    FLOOR_TRAVEL_TIME: 1000,               // 1 second per floor at cruise speed
    ACCELERATION_TIME: 500,                // 0.5 seconds to accelerate
    DECELERATION_TIME: 500,                // 0.5 seconds to decelerate
    SHORT_TRIP_TIME_PER_FLOOR: 2000,       // 2 seconds per floor for 1-2 floor trips
    
    // Door operation timing
    DOOR_OPEN_TIME: 2500,                  // 2.5 seconds to open doors
    DOOR_HOLD_TIME: 3000,                  // 3 seconds minimum door hold time
    DOOR_CLOSE_TIME: 2000,                 // 2 seconds to close doors
    
    // Passenger timing
    PASSENGER_BOARDING_TIME: 500,          // 0.5 seconds per passenger (simulation)
    BASE_PASSENGERS: 2,                    // Base number of passengers for timing
    MAX_ADDITIONAL_PASSENGERS: 4,          // Random additional passengers (0-4)
    
    // Other delays
    CALL_ASSIGNMENT_DELAY: 1000,           // 1 second delay to assign call to elevator (algorithm processing)
    DIRECTION_CHANGE_DELAY: 1000,          // 1 second delay when changing direction
    ARRIVAL_SETTLING_TIME: 1000,           // 1 second to settle after stopping (matches CSS transition)
}

// Trip distance categories
export const TRIP_CATEGORIES = {
    SHORT: 2,     // 1-2 floors
    MEDIUM: 5,    // 3-5 floors
    LONG: 999     // 6+ floors
}

/**
 * Calculate realistic travel time between floors
 * Accounts for acceleration, deceleration, and distance
 * 
 * @param {number} distance - Number of floors to travel
 * @returns {number} - Total time in milliseconds
 */
export const calculateTravelTime = (distance) => {
    const floors = Math.abs(distance)
    
    if (floors === 0) return 0
    
    // Short trips (1-2 floors): mostly acceleration/deceleration
    if (floors <= TRIP_CATEGORIES.SHORT) {
        return floors * ELEVATOR_TIMING.SHORT_TRIP_TIME_PER_FLOOR
    }
    
    // Longer trips: accel + cruise + decel
    // First and last floor have accel/decel time
    const cruiseFloors = floors - 2
    return (
        ELEVATOR_TIMING.ACCELERATION_TIME +
        (cruiseFloors * ELEVATOR_TIMING.FLOOR_TRAVEL_TIME) +
        ELEVATOR_TIMING.DECELERATION_TIME
    )
}

/**
 * Calculate door hold time based on simulated passenger count
 * 
 * @returns {number} - Door hold time in milliseconds
 */
export const calculateDoorHoldTime = () => {
    const passengerCount = ELEVATOR_TIMING.BASE_PASSENGERS + 
        Math.floor(Math.random() * (ELEVATOR_TIMING.MAX_ADDITIONAL_PASSENGERS + 1))
    
    return ELEVATOR_TIMING.DOOR_HOLD_TIME + 
        (passengerCount * ELEVATOR_TIMING.PASSENGER_BOARDING_TIME)
}

/**
 * Calculate total stop time (door open + hold + close)
 * 
 * @returns {number} - Total stop time in milliseconds
 */
export const calculateTotalStopTime = () => {
    return (
        ELEVATOR_TIMING.DOOR_OPEN_TIME +
        calculateDoorHoldTime() +
        ELEVATOR_TIMING.DOOR_CLOSE_TIME
    )
}

/**
 * Elevator operational states
 */
export const ELEVATOR_STATES = {
    IDLE: 'idle',
    MOVING: 'moving',
    ARRIVING: 'arriving',
    DOORS_OPENING: 'doors_opening',
    DOORS_OPEN: 'doors_open',
    DOORS_CLOSING: 'doors_closing',
}
