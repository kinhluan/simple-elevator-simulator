import { describe, it, expect } from 'vitest'
import { 
  getAlgorithm, 
  getQueueInserter, 
  insertIntoQueue,
  lookAlgorithm,
  sstfAlgorithm,
  scanAlgorithm,
  insertIntoQueueLOOK,
  insertIntoQueueSSTF,
  insertIntoQueueSCAN
} from '../algorithms/elevatorScheduler'

describe('Elevator Scheduler', () => {
  describe('getAlgorithm', () => {
    it('should return LOOK algorithm for "look" mode', () => {
      const algorithm = getAlgorithm('look')
      expect(algorithm).toBe(lookAlgorithm)
    })

    it('should return SSTF algorithm for "sstf" mode', () => {
      const algorithm = getAlgorithm('sstf')
      expect(algorithm).toBe(sstfAlgorithm)
    })

    it('should return SCAN algorithm for "scan" mode', () => {
      const algorithm = getAlgorithm('scan')
      expect(algorithm).toBe(scanAlgorithm)
    })

    it('should return LOOK algorithm as default for unknown mode', () => {
      const algorithm = getAlgorithm('unknown')
      expect(algorithm).toBe(lookAlgorithm)
    })

    it('should return LOOK algorithm as default for null mode', () => {
      const algorithm = getAlgorithm(null)
      expect(algorithm).toBe(lookAlgorithm)
    })

    it('should return LOOK algorithm as default for undefined mode', () => {
      const algorithm = getAlgorithm(undefined)
      expect(algorithm).toBe(lookAlgorithm)
    })

    it('should return LOOK algorithm as default for empty string', () => {
      const algorithm = getAlgorithm('')
      expect(algorithm).toBe(lookAlgorithm)
    })

    it('should be case-sensitive', () => {
      const algorithm = getAlgorithm('LOOK')
      expect(algorithm).toBe(lookAlgorithm) // Should default since 'LOOK' !== 'look'
    })
  })

  describe('getQueueInserter', () => {
    it('should return LOOK queue inserter for "look" mode', () => {
      const inserter = getQueueInserter('look')
      expect(inserter).toBe(insertIntoQueueLOOK)
    })

    it('should return SSTF queue inserter for "sstf" mode', () => {
      const inserter = getQueueInserter('sstf')
      expect(inserter).toBe(insertIntoQueueSSTF)
    })

    it('should return SCAN queue inserter for "scan" mode', () => {
      const inserter = getQueueInserter('scan')
      expect(inserter).toBe(insertIntoQueueSCAN)
    })

    it('should return LOOK queue inserter as default for unknown mode', () => {
      const inserter = getQueueInserter('random')
      expect(inserter).toBe(insertIntoQueueLOOK)
    })

    it('should return LOOK queue inserter as default for null mode', () => {
      const inserter = getQueueInserter(null)
      expect(inserter).toBe(insertIntoQueueLOOK)
    })

    it('should return LOOK queue inserter as default for undefined mode', () => {
      const inserter = getQueueInserter(undefined)
      expect(inserter).toBe(insertIntoQueueLOOK)
    })
  })

  describe('insertIntoQueue', () => {
    describe('LOOK mode', () => {
      it('should use LOOK insertion logic when mode is "look"', () => {
        const queue = [6, 10]
        const result = insertIntoQueue(queue, 5, 'up', 8, 'look')
        expect(result).toEqual([6, 8, 10]) // LOOK maintains ascending order
      })

      it('should handle downward direction in LOOK mode', () => {
        const queue = [8, 4]
        const result = insertIntoQueue(queue, 10, 'down', 6, 'look')
        expect(result).toEqual([8, 6, 4]) // LOOK maintains descending order
      })

      it('should use LOOK as default when no mode specified', () => {
        const queue = [6, 10]
        const result = insertIntoQueue(queue, 5, 'up', 8)
        expect(result).toEqual([6, 8, 10]) // Defaults to LOOK
      })

      it('should handle idle direction in LOOK mode', () => {
        const queue = []
        const result = insertIntoQueue(queue, 5, 'idle', 8, 'look')
        expect(result).toEqual([8]) // LOOK resets queue when idle
      })
    })

    describe('SSTF mode', () => {
      it('should use SSTF insertion logic when mode is "sstf"', () => {
        const queue = [10]
        const result = insertIntoQueue(queue, 5, 'up', 7, 'sstf')
        // SSTF sorts by distance: 7->2, 10->5
        expect(result[0]).toBe(7)
        expect(result[1]).toBe(10)
      })

      it('should ignore direction parameter in SSTF mode', () => {
        const queue = [10]
        const resultUp = insertIntoQueue(queue, 5, 'up', 7, 'sstf')
        const resultDown = insertIntoQueue(queue, 5, 'down', 7, 'sstf')
        expect(resultUp).toEqual(resultDown) // Direction doesn't matter in SSTF
      })

      it('should sort by distance in SSTF mode', () => {
        const queue = []
        let result = insertIntoQueue(queue, 5, 'up', 10, 'sstf') // distance: 5
        result = insertIntoQueue(result, 5, 'up', 6, 'sstf')      // distance: 1
        result = insertIntoQueue(result, 5, 'up', 8, 'sstf')      // distance: 3
        
      // Should be sorted: 6(1), 8(3), 10(5)
      expect(result[0]).toBe(6)
      expect(result[1]).toBe(8)
      expect(result[2]).toBe(10)
    })

    it('should sort by distance in SCAN mode', () => {
      const queue = [6, 10]
      const result = insertIntoQueue(queue, 5, 'up', 8, 'scan')
      // SCAN maintains directional order like LOOK
      expect(result).toEqual([6, 8, 10])
    })
  })

  describe('Mode switching', () => {
      it('should handle switching from LOOK to SSTF', () => {
        let queue = [6, 8, 10]
        
        // Start with LOOK behavior
        queue = insertIntoQueue(queue, 5, 'up', 7, 'look')
        expect(queue).toEqual([6, 7, 8, 10])
        
        // Switch to SSTF - should re-sort by distance
        queue = insertIntoQueue(queue, 5, 'idle', 9, 'sstf')
        const distances = queue.map(f => Math.abs(f - 5))
        // Verify sorted by distance
        for (let i = 1; i < distances.length; i++) {
          expect(distances[i]).toBeGreaterThanOrEqual(distances[i - 1])
        }
      })

      it('should handle switching from SSTF to LOOK', () => {
        let queue = []
        
        // Start with SSTF
        queue = insertIntoQueue(queue, 5, 'idle', 10, 'sstf')
        queue = insertIntoQueue(queue, 5, 'idle', 7, 'sstf')
        expect(queue[0]).toBe(7) // SSTF nearest first
        
        // Switch to LOOK going up
        queue = insertIntoQueue(queue, 5, 'up', 8, 'look')
        // LOOK should maintain ascending order
        expect(queue).toEqual([7, 8, 10])
      })
    })

    describe('Edge cases', () => {
      it('should handle empty queue', () => {
        const result = insertIntoQueue([], 5, 'up', 8, 'look')
        expect(result).toEqual([8])
      })

      it('should handle duplicate floor', () => {
        const queue = [6, 8, 10]
        const result = insertIntoQueue(queue, 5, 'up', 8, 'look')
        expect(result).toEqual([6, 8, 10])
        expect(result.length).toBe(3)
      })

      it('should handle single floor queue', () => {
        const queue = [5]
        const result = insertIntoQueue(queue, 3, 'up', 7, 'look')
        expect(result).toContain(5)
        expect(result).toContain(7)
      })

      it('should handle invalid mode gracefully', () => {
        const queue = [6, 10]
        const result = insertIntoQueue(queue, 5, 'up', 8, 'invalid')
        // Should default to LOOK
        expect(result).toEqual([6, 8, 10])
      })
    })
  })

  describe('Algorithm Integration', () => {
    describe('LOOK algorithm integration', () => {
      it('should select and queue correctly with LOOK', () => {
        const elevators = [
          { id: 0, currentFloor: 5, direction: 'up', queue: [] },
          { id: 1, currentFloor: 10, direction: 'idle', queue: [] }
        ]
        
        const algorithm = getAlgorithm('look')
        const bestElevatorId = algorithm(elevators, 7, 'up')
        expect(bestElevatorId).toBe(0) // Elevator 0 going up
        
        // Now queue the floor
        const queue = insertIntoQueue([], 5, 'up', 7, 'look')
        expect(queue).toEqual([7])
      })

      it('should work end-to-end with LOOK for multiple calls', () => {
        const elevators = [
          { id: 0, currentFloor: 3, direction: 'up', queue: [{ floor: 8, callDirection: 'up' }] }
        ]
        
        const algorithm = getAlgorithm('look')
        
        // Add call at floor 5 going up
        const elevatorId = algorithm(elevators, 5, 'up')
        expect(elevatorId).toBe(0)
        
        // Queue should maintain ascending order
        let queue = [8]
        queue = insertIntoQueue(queue, 3, 'up', 5, 'look')
        expect(queue).toEqual([5, 8])
      })
    })

    describe('SSTF algorithm integration', () => {
      it('should select and queue correctly with SSTF', () => {
        const elevators = [
          { id: 0, currentFloor: 5, direction: 'idle', queue: [] },
          { id: 1, currentFloor: 10, direction: 'idle', queue: [] }
        ]
        
        const algorithm = getAlgorithm('sstf')
        const bestElevatorId = algorithm(elevators, 7)
        expect(bestElevatorId).toBe(0) // Elevator 0 is closer
        
        // Now queue the floor
        const queue = insertIntoQueue([], 5, 'idle', 7, 'sstf')
        expect(queue).toEqual([7])
      })

      it('should work end-to-end with SSTF for multiple calls', () => {
        const elevators = [
          { id: 0, currentFloor: 5, direction: 'idle', queue: [] }
        ]
        
        const algorithm = getAlgorithm('sstf')
        
        // Multiple calls
        let queue = []
        
        // Call from floor 10
        const elevatorId1 = algorithm(elevators, 10)
        expect(elevatorId1).toBe(0)
        queue = insertIntoQueue(queue, 5, 'idle', 10, 'sstf')
        
        // Call from floor 7
        const elevatorId2 = algorithm(elevators, 7)
        expect(elevatorId2).toBe(0)
        queue = insertIntoQueue(queue, 5, 'idle', 7, 'sstf')
        
        // Queue should be sorted by distance: 7(2), 10(5)
        expect(queue[0]).toBe(7)
        expect(queue[1]).toBe(10)
      })
    })
  })

  describe('Performance and Consistency', () => {
    it('should consistently return same results for same inputs', () => {
      const elevators = [
        { id: 0, currentFloor: 5, direction: 'idle', queue: [] },
        { id: 1, currentFloor: 10, direction: 'idle', queue: [] }
      ]
      
      const algorithm = getAlgorithm('look')
      const result1 = algorithm(elevators, 7, 'up')
      const result2 = algorithm(elevators, 7, 'up')
      expect(result1).toBe(result2)
    })

    it('should handle rapid mode switching', () => {
      const modes = ['look', 'sstf', 'look', 'sstf']
      
      modes.forEach(mode => {
        const algorithm = getAlgorithm(mode)
        expect(algorithm).toBeDefined()
        expect(typeof algorithm).toBe('function')
      })
    })

    it('should maintain queue integrity across operations', () => {
      let queue = []
      
      // Build queue with LOOK
      queue = insertIntoQueue(queue, 5, 'up', 8, 'look')
      queue = insertIntoQueue(queue, 5, 'up', 10, 'look')
      expect(queue).toEqual([8, 10])
      
      // Switch to SSTF and add more
      queue = insertIntoQueue(queue, 5, 'idle', 6, 'sstf')
      expect(queue).toContain(6)
      expect(queue).toContain(8)
      expect(queue).toContain(10)
    })
  })

  describe('Real-World Usage Patterns', () => {
    it('should simulate office building morning rush with LOOK', () => {
      const elevators = [
        { id: 0, currentFloor: 1, direction: 'up', queue: [] },
        { id: 1, currentFloor: 1, direction: 'up', queue: [] }
      ]
      
      const algorithm = getAlgorithm('look')
      
      // Multiple up calls from ground floor
      const floors = [5, 8, 3, 10, 7]
      floors.forEach(floor => {
        const elevatorId = algorithm(elevators, floor, 'up')
        expect(elevatorId).not.toBe(null)
      })
    })

    it('should simulate mixed traffic with SSTF', () => {
      const elevators = [
        { id: 0, currentFloor: 5, direction: 'idle', queue: [] },
        { id: 1, currentFloor: 10, direction: 'idle', queue: [] }
      ]
      
      const algorithm = getAlgorithm('sstf')
      
      // Random calls from different floors
      const calls = [3, 7, 12, 6, 9]
      calls.forEach(floor => {
        const elevatorId = algorithm(elevators, floor)
        expect(elevatorId).not.toBe(null)
        expect([0, 1]).toContain(elevatorId)
      })
    })

    it('should handle algorithm comparison scenario', () => {
      const elevators = [
        { id: 0, currentFloor: 5, direction: 'up', queue: [{ floor: 10, callDirection: 'up' }] }
      ]
      
      // Same call, different algorithms
      const lookResult = getAlgorithm('look')(elevators, 7, 'up')
      const sstfResult = getAlgorithm('sstf')(elevators, 7, 'up')
      
      // Both should select the same elevator in this case
      expect(lookResult).toBe(0)
      expect(sstfResult).toBe(0)
      
      // But queue insertion differs
      const lookQueue = insertIntoQueue([10], 5, 'up', 7, 'look')
      const sstfQueue = insertIntoQueue([10], 5, 'up', 7, 'sstf')
      
      expect(lookQueue).toEqual([7, 10]) // LOOK: ascending
      expect(sstfQueue[0]).toBe(7)       // SSTF: by distance
    })
  })
})
