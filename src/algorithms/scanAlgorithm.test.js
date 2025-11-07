import { describe, it, expect, beforeEach } from 'vitest'
import { scanAlgorithm, insertIntoQueueSCAN } from '../algorithms/scanAlgorithm'

describe('SCAN Algorithm', () => {
  let elevators
  const maxFloor = 20

  beforeEach(() => {
    // Reset elevators before each test
    elevators = [
      {
        id: 0,
        currentFloor: 5,
        direction: 'idle',
        queue: []
      },
      {
        id: 1,
        currentFloor: 10,
        direction: 'idle',
        queue: []
      },
      {
        id: 2,
        currentFloor: 1,
        direction: 'idle',
        queue: []
      }
    ]
  })

  describe('Idle Elevator Selection', () => {
    it('should select the nearest idle elevator', () => {
      const result = scanAlgorithm(elevators, 6, 'up', maxFloor)
      expect(result).toBe(0) // Elevator 0 at floor 5 is closest to floor 6
    })

    it('should handle call on same floor as idle elevator', () => {
      const result = scanAlgorithm(elevators, 5, 'up', maxFloor)
      expect(result).toBe(0) // Elevator 0 is already at floor 5
    })

    it('should select correct elevator when all idle at different floors', () => {
      elevators[0].currentFloor = 10
      elevators[1].currentFloor = 3
      elevators[2].currentFloor = 7
      const result = scanAlgorithm(elevators, 6, 'down', maxFloor)
      expect(result).toBe(2) // Elevator 2 at floor 7 is closest to floor 6
    })
  })

  describe('Moving Elevator Selection', () => {
    it('should prefer elevator moving in call direction', () => {
      elevators[0].direction = 'up'
      elevators[0].currentFloor = 3
      elevators[0].queue = [{ floor: 8, callDirection: 'up' }]
      
      elevators[1].direction = 'idle'
      elevators[1].currentFloor = 10

      const result = scanAlgorithm(elevators, 5, 'up', maxFloor)
      expect(result).toBe(0) // Elevator 0 going up can pick up floor 5
    })

    it('should calculate correct cost for elevator going up', () => {
      elevators[0].direction = 'up'
      elevators[0].currentFloor = 5
      elevators[0].queue = [{ floor: 12, callDirection: 'up' }]
      
      elevators[1].direction = 'idle'
      elevators[1].currentFloor = 8

      const result = scanAlgorithm(elevators, 7, 'up', maxFloor)
      // Elevator 0 going up from 5, can pick up 7 (cost = 2)
      // Elevator 1 idle at 8, distance to 7 = 1 (LOWER COST)
      expect(result).toBe(1)
    })

    it('should calculate correct cost for elevator going down', () => {
      elevators[0].direction = 'down'
      elevators[0].currentFloor = 10
      elevators[0].queue = [{ floor: 5, callDirection: 'down' }]
      
      elevators[1].direction = 'idle'
      elevators[1].currentFloor = 8

      const result = scanAlgorithm(elevators, 7, 'down', maxFloor)
      // Elevator 0 going down from 10, can pick up 7 (cost = 3)
      // Elevator 1 idle at 8, distance to 7 = 1 (LOWER COST)
      expect(result).toBe(1)
    })
  })

  describe('SCAN Specific Behavior', () => {
    it('should go to top floor before reversing when going up', () => {
      elevators[0].direction = 'up'
      elevators[0].currentFloor = 10
      elevators[0].queue = [{ floor: 15, callDirection: 'up' }]
      
      elevators[1].direction = 'idle'
      elevators[1].currentFloor = 5

      // Call below current position - elevator will go to top (20) then come back
      const result = scanAlgorithm(elevators, 8, 'down', maxFloor)
      // Elevator 0: must go to floor 20, then down to 8 = (20-10) + (20-8) + 100 = 122
      // Elevator 1: idle at 5, distance = |5-8| = 3 (MUCH LOWER)
      expect(result).toBe(1)
    })

    it('should go to bottom floor before reversing when going down', () => {
      elevators[0].direction = 'down'
      elevators[0].currentFloor = 10
      elevators[0].queue = [{ floor: 5, callDirection: 'down' }]
      
      elevators[1].direction = 'idle'
      elevators[1].currentFloor = 15

      // Call above current position - elevator will go to bottom (1) then come back
      const result = scanAlgorithm(elevators, 12, 'up', maxFloor)
      // Elevator 0: must go to floor 1, then up to 12 = (10-1) + (12-1) + 100 = 120
      // Elevator 1: idle at 15, distance = |15-12| = 3 (MUCH LOWER)
      expect(result).toBe(1)
    })

    it('should handle call ahead in same direction efficiently', () => {
      elevators[0].direction = 'up'
      elevators[0].currentFloor = 5
      elevators[0].queue = [{ floor: 10, callDirection: 'up' }]
      
      elevators[1].direction = 'idle'
      elevators[1].currentFloor = 12

      const result = scanAlgorithm(elevators, 8, 'up', maxFloor)
      // Elevator 0: going up from 5 to 8 = 3
      // Elevator 1: idle at 12 to 8 = 4
      expect(result).toBe(0) // Elevator 0 is more efficient
    })
  })

  describe('Edge Cases', () => {
    it('should handle empty elevators array', () => {
      const result = scanAlgorithm([], 5, 'up', maxFloor)
      expect(result).toBe(null)
    })

    it('should handle null elevators', () => {
      const result = scanAlgorithm(null, 5, 'up', maxFloor)
      expect(result).toBe(null)
    })

    it('should handle undefined elevators', () => {
      const result = scanAlgorithm(undefined, 5, 'up', maxFloor)
      expect(result).toBe(null)
    })

    it('should handle single elevator', () => {
      const singleElevator = [{ id: 0, currentFloor: 5, direction: 'idle', queue: [] }]
      const result = scanAlgorithm(singleElevator, 10, 'up', maxFloor)
      expect(result).toBe(0)
    })

    it('should work with custom maxFloor', () => {
      elevators[0].direction = 'up'
      elevators[0].currentFloor = 30
      
      const result = scanAlgorithm(elevators, 35, 'up', 50) // 50 floor building
      expect(result).toBe(0)
    })
  })

  describe('All Elevators Busy', () => {
    it('should assign call when all elevators are busy', () => {
      elevators[0].direction = 'up'
      elevators[0].currentFloor = 5
      elevators[0].queue = [{ floor: 10, callDirection: 'up' }]

      elevators[1].direction = 'up'
      elevators[1].currentFloor = 8
      elevators[1].queue = [{ floor: 15, callDirection: 'up' }]

      elevators[2].direction = 'down'
      elevators[2].currentFloor = 12
      elevators[2].queue = [{ floor: 3, callDirection: 'down' }]

      const result = scanAlgorithm(elevators, 7, 'down', maxFloor)
      // Should assign to one of them (likely elevator 2 going down)
      expect(result).not.toBe(null)
    })

    it('should handle all elevators in wrong direction', () => {
      elevators[0].direction = 'down'
      elevators[0].currentFloor = 15
      elevators[0].queue = [{ floor: 5, callDirection: 'down' }]

      elevators[1].direction = 'down'
      elevators[1].currentFloor = 12
      elevators[1].queue = [{ floor: 3, callDirection: 'down' }]

      elevators[2].direction = 'down'
      elevators[2].currentFloor = 18
      elevators[2].queue = [{ floor: 8, callDirection: 'down' }]

      const result = scanAlgorithm(elevators, 10, 'up', maxFloor)
      // All going down, new UP call - should still assign
      expect(result).not.toBe(null)
    })
  })

  describe('Comparison with LOOK', () => {
    it('should have different behavior than LOOK at extremes', () => {
      // SCAN always goes to extremes
      // This is tested through cost calculation
      elevators[0].direction = 'up'
      elevators[0].currentFloor = 18
      elevators[0].queue = [{ floor: 19, callDirection: 'up' }]

      elevators[1].direction = 'idle'
      elevators[1].currentFloor = 15

      // Call below - SCAN must go to top (20) first
      const result = scanAlgorithm(elevators, 17, 'down', maxFloor)
      // Elevator 0 must complete journey to top
      // Elevator 1 is idle and closer
      expect(result).toBe(1)
    })
  })
})

describe('SCAN Queue Insertion', () => {
  describe('Idle Elevator Queue', () => {
    it('should add floor to empty queue', () => {
      const queue = []
      const result = insertIntoQueueSCAN(queue, 5, 'idle', 8)
      expect(result).toEqual([8])
    })

    it('should replace queue when elevator is idle', () => {
      const queue = [3, 7]
      const result = insertIntoQueueSCAN(queue, 5, 'idle', 8)
      expect(result).toEqual([8])
    })
  })

  describe('Upward Direction Queue', () => {
    it('should insert floor in ascending order when going up', () => {
      const queue = [6, 10]
      const result = insertIntoQueueSCAN(queue, 4, 'up', 8)
      expect(result).toEqual([6, 8, 10])
    })

    it('should insert at beginning when floor is lowest', () => {
      const queue = [7, 10, 12]
      const result = insertIntoQueueSCAN(queue, 5, 'up', 6)
      expect(result).toEqual([6, 7, 10, 12])
    })

    it('should insert at end when floor is highest', () => {
      const queue = [6, 8, 10]
      const result = insertIntoQueueSCAN(queue, 5, 'up', 15)
      expect(result).toEqual([6, 8, 10, 15])
    })

    it('should not add duplicate floor', () => {
      const queue = [6, 8, 10]
      const result = insertIntoQueueSCAN(queue, 5, 'up', 8)
      expect(result).toEqual([6, 8, 10])
      expect(result.length).toBe(3)
    })
  })

  describe('Downward Direction Queue', () => {
    it('should insert floor in descending order when going down', () => {
      const queue = [8, 4]
      const result = insertIntoQueueSCAN(queue, 10, 'down', 6)
      expect(result).toEqual([8, 6, 4])
    })

    it('should insert at beginning when floor is highest', () => {
      const queue = [8, 6, 4]
      const result = insertIntoQueueSCAN(queue, 10, 'down', 9)
      expect(result).toEqual([9, 8, 6, 4])
    })

    it('should insert at end when floor is lowest', () => {
      const queue = [8, 6, 4]
      const result = insertIntoQueueSCAN(queue, 10, 'down', 2)
      expect(result).toEqual([8, 6, 4, 2])
    })

    it('should not add duplicate floor when going down', () => {
      const queue = [10, 8, 6]
      const result = insertIntoQueueSCAN(queue, 12, 'down', 8)
      expect(result).toEqual([10, 8, 6])
      expect(result.length).toBe(3)
    })
  })

  describe('Queue Maintenance', () => {
    it('should maintain ascending order with multiple insertions', () => {
      let queue = [6, 10]
      queue = insertIntoQueueSCAN(queue, 5, 'up', 8)
      queue = insertIntoQueueSCAN(queue, 5, 'up', 7)
      queue = insertIntoQueueSCAN(queue, 5, 'up', 9)
      expect(queue).toEqual([6, 7, 8, 9, 10])
    })

    it('should maintain descending order with multiple insertions', () => {
      let queue = [10, 6]
      queue = insertIntoQueueSCAN(queue, 12, 'down', 8)
      queue = insertIntoQueueSCAN(queue, 12, 'down', 7)
      queue = insertIntoQueueSCAN(queue, 12, 'down', 9)
      expect(queue).toEqual([10, 9, 8, 7, 6])
    })

    it('should handle single-item queue going up', () => {
      const queue = [7]
      const result1 = insertIntoQueueSCAN(queue, 5, 'up', 9)
      expect(result1).toEqual([7, 9])
      
      const result2 = insertIntoQueueSCAN(queue, 5, 'up', 6)
      expect(result2).toEqual([6, 7])
    })

    it('should handle single-item queue going down', () => {
      const queue = [7]
      const result1 = insertIntoQueueSCAN(queue, 9, 'down', 5)
      expect(result1).toEqual([7, 5])
      
      const result2 = insertIntoQueueSCAN(queue, 9, 'down', 8)
      expect(result2).toEqual([8, 7])
    })
  })

  describe('SCAN vs LOOK Queue Behavior', () => {
    it('should behave identically to LOOK for queue insertion', () => {
      // SCAN and LOOK have same queue insertion logic
      // The difference is in cost calculation (going to extremes)
      const queue = [6, 8, 10]
      const result = insertIntoQueueSCAN(queue, 5, 'up', 7)
      expect(result).toEqual([6, 7, 8, 10])
    })
  })
})
