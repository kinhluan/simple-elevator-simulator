/**
 * SCAN Algorithm Implementation (Classic Elevator Algorithm)
 * 
 * The SCAN algorithm moves elevators in one direction until reaching the extreme end,
 * then reverses direction. Unlike LOOK, it always goes to the top/bottom floor.
 * 
 * Benefits over LOOK:
 * - More predictable behavior
 * - Better starvation prevention
 * - Simpler to understand and implement
 * 
 * Benefits over SSTF:
 * - Prevents starvation (SSTF can ignore distant floors)
 * - More fair distribution of service
 * - Better average wait times for all floors
 */

/**
 * Calculate the cost (distance + penalties) for an elevator to serve a call
 * @param {Object} elevator - Elevator object
 * @param {number} callFloor - Floor where call originated
 * @param {string} callDirection - Direction of call ('up' or 'down')
 * @param {number} maxFloor - Maximum floor in the building
 * @returns {number} - Cost to serve this call
 */
const calculateCost = (elevator, callFloor, callDirection, maxFloor) => {
    const { currentFloor, direction } = elevator

    // If elevator is idle, cost is just the distance
    if (direction === 'idle') {
        return Math.abs(currentFloor - callFloor)
    }

    // SCAN: elevator continues to the end before reversing
    if (direction === 'up') {
        if (callFloor >= currentFloor && callDirection === 'up') {
            // Call is ahead in the same direction - can pick up on the way
            return callFloor - currentFloor
        } else {
            // Need to go to top, then come back down
            // Cost: distance to top + distance from top to call
            const distanceToTop = maxFloor - currentFloor
            const distanceFromTopToCall = maxFloor - callFloor
            return distanceToTop + distanceFromTopToCall + 100 // Add penalty for direction change
        }
    } else if (direction === 'down') {
        if (callFloor <= currentFloor && callDirection === 'down') {
            // Call is ahead in the same direction - can pick up on the way
            return currentFloor - callFloor
        } else {
            // Need to go to bottom, then come back up
            // Cost: distance to bottom + distance from bottom to call
            const distanceToBottom = currentFloor - 1
            const distanceFromBottomToCall = callFloor - 1
            return distanceToBottom + distanceFromBottomToCall + 100 // Add penalty for direction change
        }
    }

    return Math.abs(currentFloor - callFloor)
}

/**
 * SCAN Algorithm: Assigns call to the best elevator
 * Elevators move to the extreme end before reversing
 * 
 * @param {Array} elevators - Array of elevator objects
 * @param {number} callFloor - Floor where call originated
 * @param {string} callDirection - Direction of call ('up' or 'down')
 * @param {number} maxFloor - Maximum floor in the building (default: 20)
 * @returns {number|null} - ID of best elevator, or null if none available
 */
export const scanAlgorithm = (elevators, callFloor, callDirection, maxFloor = 20) => {
    if (!elevators || elevators.length === 0) return null

    let bestElevator = null
    let lowestCost = Infinity

    for (const elevator of elevators) {
        const cost = calculateCost(elevator, callFloor, callDirection, maxFloor)
        
        // Prefer lower cost elevators
        if (cost < lowestCost) {
            lowestCost = cost
            bestElevator = elevator
        }
    }

    return bestElevator ? bestElevator.id : null
}

/**
 * Insert a floor into an elevator's queue for SCAN algorithm
 * Maintains order based on direction, similar to LOOK but goes to extremes
 * 
 * @param {Array} queue - Current queue of floors
 * @param {number} currentFloor - Elevator's current floor
 * @param {string} direction - Current direction ('up', 'down', or 'idle')
 * @param {number} newFloor - Floor to add to queue
 * @returns {Array} - New queue with floor inserted
 */
export const insertIntoQueueSCAN = (queue, currentFloor, direction, newFloor) => {
    // If queue is empty or elevator is idle, just add the floor
    if (queue.length === 0 || direction === 'idle') {
        return [newFloor]
    }

    const newQueue = [...queue]

    // If floor is already in queue, don't add it again
    if (newQueue.includes(newFloor)) {
        return newQueue
    }

    // Insert based on direction to maintain SCAN order
    if (direction === 'up') {
        // Going up: insert floors in ascending order
        const insertIndex = newQueue.findIndex(floor => floor > newFloor)
        if (insertIndex === -1) {
            // Floor is higher than all in queue, add at end
            newQueue.push(newFloor)
        } else {
            // Insert in sorted position
            newQueue.splice(insertIndex, 0, newFloor)
        }
    } else {
        // Going down: insert floors in descending order
        let insertIndex = -1
        for (let i = 0; i < newQueue.length; i++) {
            if (newQueue[i] < newFloor) {
                insertIndex = i
                break
            }
        }
        
        if (insertIndex === -1) {
            // Floor is lower than all in queue, add at end
            newQueue.push(newFloor)
        } else {
            // Insert in sorted position
            newQueue.splice(insertIndex, 0, newFloor)
        }
    }

    return newQueue
}
