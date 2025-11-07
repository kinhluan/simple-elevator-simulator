/**
 * Elevator Scheduling Algorithms
 * 
 * This file serves as the main entry point for all elevator scheduling algorithms.
 * Import and re-export all available algorithms for easy access.
 */

// Import LOOK algorithm
import { lookAlgorithm, insertIntoQueueLOOK } from './lookAlgorithm'

// Import SSTF algorithm
import { sstfAlgorithm, insertIntoQueueSSTF } from './sstfAlgorithm'

// Import SCAN algorithm
import { scanAlgorithm, insertIntoQueueSCAN } from './scanAlgorithm'

// Re-export algorithms
export { lookAlgorithm, insertIntoQueueLOOK } from './lookAlgorithm'
export { sstfAlgorithm, insertIntoQueueSSTF } from './sstfAlgorithm'
export { scanAlgorithm, insertIntoQueueSCAN } from './scanAlgorithm'

/**
 * Helper function to get the appropriate algorithm based on mode
 * 
 * @param {string} mode - Algorithm mode ('look', 'sstf', 'scan', etc.)
 * @returns {Function} - The scheduling algorithm function
 */
export const getAlgorithm = (mode) => {
    switch (mode) {
        case 'look':
            return lookAlgorithm
        case 'sstf':
            return sstfAlgorithm
        case 'scan':
            return scanAlgorithm
        default:
            return lookAlgorithm
    }
}

/**
 * Helper function to get the appropriate queue insertion function
 * 
 * @param {string} mode - Algorithm mode ('look', 'sstf', 'scan', etc.)
 * @returns {Function} - The queue insertion function
 */
export const getQueueInserter = (mode) => {
    switch (mode) {
        case 'look':
            return insertIntoQueueLOOK
        case 'sstf':
            return insertIntoQueueSSTF
        case 'scan':
            return insertIntoQueueSCAN
        default:
            return insertIntoQueueLOOK
    }
}

/**
 * Utility function: Insert a floor into a queue based on algorithm mode
 * 
 * @param {string} mode - Algorithm mode
 * @param {Array} queue - Current queue
 * @param {number} currentFloor - Current floor
 * @param {string} direction - Current direction
 * @param {number} newFloor - Floor to insert
 * @returns {Array} - Updated queue
 */
export const insertIntoQueue = (queue, currentFloor, direction, newFloor, mode = 'look') => {
    const inserter = getQueueInserter(mode)
    
    // SSTF doesn't need direction, LOOK and SCAN do
    if (mode === 'sstf') {
        return inserter(queue, currentFloor, newFloor)
    }
    
    return inserter(queue, currentFloor, direction, newFloor)
}
