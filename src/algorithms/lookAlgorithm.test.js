import { describe, it, expect, beforeEach } from 'vitest'
import { lookAlgorithm, insertIntoQueueLOOK } from '../algorithms/lookAlgorithm'

describe('LOOK Algorithm', () => {
  let elevators

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
        currentFloor: 8,
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
      const result = lookAlgorithm(elevators, 6, 'up')
      expect(result).toBe(0) // Elevator 0 at floor 5 is closest to floor 6
    })

    it('should select elevator equidistant by lowest ID', () => {
      elevators[0].currentFloor = 5
      elevators[1].currentFloor = 7
      const result = lookAlgorithm(elevators, 6, 'up')
      expect(result).toBe(0) // Both equidistant, select first one
    })

    it('should handle call on same floor as idle elevator', () => {
      const result = lookAlgorithm(elevators, 5, 'up')
      expect(result).toBe(0) // Elevator 0 is already at floor 5
    })

    it('should select correct elevator when all idle at different floors', () => {
      elevators[0].currentFloor = 10
      elevators[1].currentFloor = 3
      elevators[2].currentFloor = 7
      const result = lookAlgorithm(elevators, 6, 'down')
      expect(result).toBe(2) // Elevator 2 at floor 7 is closest to floor 6
    })
  })

  describe('Moving Elevator Selection', () => {
    it('should prefer elevator moving in call direction and ahead of call', () => {
      elevators[0].direction = 'up'
      elevators[0].currentFloor = 3
      elevators[0].queue = [{ floor: 5, callDirection: 'up' }]
      
      elevators[1].direction = 'up'
      elevators[1].currentFloor = 8
      elevators[1].queue = [{ floor: 10, callDirection: 'up' }]

      const result = lookAlgorithm(elevators, 4, 'up')
      expect(result).toBe(0) // Elevator 0 going up from 3, can pick up at 4
    })

    it('should select elevator going down when call is below and direction matches', () => {
      elevators[0].direction = 'down'
      elevators[0].currentFloor = 10
      elevators[0].queue = [{ floor: 8, callDirection: 'down' }]
      
      elevators[1].direction = 'idle'
      elevators[1].currentFloor = 15
      
      elevators[2].direction = 'idle'
      elevators[2].currentFloor = 1
      
      const result = lookAlgorithm(elevators, 7, 'down')
      // LOOK: Elevator 0 going down from 10 can pick up floor 7 on the way to 8
      expect(result).toBe(0)
    })

    it('should skip elevator if call is behind in direction of travel', () => {
      elevators[0].direction = 'up'
      elevators[0].currentFloor = 5
      elevators[0].queue = [{ floor: 8, callDirection: 'up' }]
      
      elevators[1].direction = 'idle'
      elevators[1].currentFloor = 3

      const result = lookAlgorithm(elevators, 3, 'up')
      expect(result).toBe(1) // Elevator 0 going up past floor 3, select idle elevator 1
    })

    it('should handle elevator with multiple queued floors in same direction', () => {
      elevators[0].direction = 'up'
      elevators[0].currentFloor = 2
      elevators[0].queue = [
        { floor: 4, callDirection: 'up' },
        { floor: 6, callDirection: 'up' },
        { floor: 8, callDirection: 'up' }
      ]

      const result = lookAlgorithm(elevators, 5, 'up')
      expect(result).toBe(0) // Can pick up floor 5 between 4 and 6
    })

    it('should reject opposite direction call when elevator has committed direction', () => {
      elevators[0].direction = 'up'
      elevators[0].currentFloor = 5
      elevators[0].queue = [{ floor: 8, callDirection: 'up' }]
      
      elevators[1].direction = 'idle'
      elevators[1].currentFloor = 7

      const result = lookAlgorithm(elevators, 6, 'down')
      expect(result).toBe(1) // Elevator 0 going up with up calls, select idle for down call
    })
  })

  describe('Cost Calculation', () => {
    it('should calculate low cost for calls in same direction', () => {
      elevators[0].direction = 'up'
      elevators[0].currentFloor = 3
      elevators[0].queue = [{ floor: 7, callDirection: 'up' }]

      elevators[1].direction = 'idle'
      elevators[1].currentFloor = 10

      const result = lookAlgorithm(elevators, 5, 'up')
      expect(result).toBe(0) // Lower cost for elevator going up
    })

    it('should penalize elevator that needs to reverse direction', () => {
      elevators[0].direction = 'up'
      elevators[0].currentFloor = 5
      elevators[0].queue = [{ floor: 10, callDirection: 'up' }]

      elevators[1].direction = 'idle'
      elevators[1].currentFloor = 3

      const result = lookAlgorithm(elevators, 2, 'down')
      expect(result).toBe(1) // Idle elevator preferred over reversing
    })
  })

  describe('Direction Compatibility', () => {
    it('should accept up call when elevator going up and call is ahead', () => {
      elevators[0].direction = 'up'
      elevators[0].currentFloor = 4
      elevators[0].queue = [{ floor: 7, callDirection: 'up' }]

      const result = lookAlgorithm(elevators, 6, 'up')
      expect(result).toBe(0)
    })

    it('should accept down call when elevator going down and call is ahead', () => {
      elevators[0].direction = 'down'
      elevators[0].currentFloor = 9
      elevators[0].queue = [{ floor: 5, callDirection: 'down' }]
      
      elevators[1].direction = 'idle'
      elevators[1].currentFloor = 15
      
      elevators[2].direction = 'idle'
      elevators[2].currentFloor = 1

      const result = lookAlgorithm(elevators, 7, 'down')
      // LOOK: Elevator 0 going down from 9 can pick up floor 7 on the way to 5
      expect(result).toBe(0)
    })

    it('should skip down call when elevator committed to up direction', () => {
      elevators[0].direction = 'up'
      elevators[0].currentFloor = 5
      elevators[0].queue = [{ floor: 8, callDirection: 'up' }]

      elevators[1].direction = 'idle'
      elevators[1].currentFloor = 10

      const result = lookAlgorithm(elevators, 9, 'down')
      expect(result).toBe(1) // Skip elevator 0, use idle elevator 1
    })

    it('should handle mixed direction queue appropriately', () => {
      elevators[0].direction = 'up'
      elevators[0].currentFloor = 4
      elevators[0].queue = [
        { floor: 6, callDirection: 'up' },
        { floor: 8, callDirection: null } // Destination floor, no call direction
      ]
      
      elevators[1].direction = 'idle'
      elevators[1].currentFloor = 15
      
      elevators[2].direction = 'idle'
      elevators[2].currentFloor = 1

      const result = lookAlgorithm(elevators, 7, 'up')
      // LOOK: Elevator 0 going up from 4 with up calls can pick up floor 7
      expect(result).toBe(0)
    })
  })

  describe('Edge Cases', () => {
    it('should handle empty elevators array', () => {
      const result = lookAlgorithm([], 5, 'up')
      expect(result).toBe(null)
    })

    it('should handle null elevators', () => {
      const result = lookAlgorithm(null, 5, 'up')
      expect(result).toBe(null)
    })

    it('should handle undefined elevators', () => {
      const result = lookAlgorithm(undefined, 5, 'up')
      expect(result).toBe(null)
    })

    it('should handle single elevator', () => {
      const singleElevator = [{ id: 0, currentFloor: 5, direction: 'idle', queue: [] }]
      const result = lookAlgorithm(singleElevator, 8, 'up')
      expect(result).toBe(0)
    })

    it('should handle all elevators at the same floor', () => {
      elevators.forEach(e => e.currentFloor = 5)
      const result = lookAlgorithm(elevators, 8, 'up')
      expect(result).toBe(0) // Should return first elevator
    })

    it('should handle extreme floor numbers', () => {
      elevators[0].currentFloor = 1
      elevators[1].currentFloor = 50
      elevators[2].currentFloor = 100
      const result = lookAlgorithm(elevators, 99, 'down')
      expect(result).toBe(2) // Elevator 2 at floor 100 is closest
    })

    it('should work with queue without callDirection property', () => {
      elevators[0].direction = 'up'
      elevators[0].currentFloor = 3
      elevators[0].queue = [5, 7, 9] // Old format without callDirection
      
      elevators[1].direction = 'idle'
      elevators[1].currentFloor = 15
      
      elevators[2].direction = 'idle'
      elevators[2].currentFloor = 1

      const result = lookAlgorithm(elevators, 6, 'up')
      // LOOK: Should work with old queue format and select elevator going up
      expect(result).toBe(0)
    })
  })

  describe('Multiple Elevators Competition', () => {
    it('should select best elevator among multiple candidates', () => {
      elevators[0].direction = 'up'
      elevators[0].currentFloor = 2
      elevators[0].queue = [{ floor: 10, callDirection: 'up' }]

      elevators[1].direction = 'idle'
      elevators[1].currentFloor = 5

      elevators[2].direction = 'up'
      elevators[2].currentFloor = 4
      elevators[2].queue = [{ floor: 8, callDirection: 'up' }]

      const result = lookAlgorithm(elevators, 6, 'up')
      // LOOK algorithm costs:
      // Elevator 0: (6-2) = 4
      // Elevator 1 (idle): |6-5| = 1 (LOWEST COST)
      // Elevator 2: (6-4) = 2
      // Should select elevator 1 as it has the lowest cost
      expect(result).toBe(1)
    })

    it('should handle all elevators busy in wrong direction', () => {
      elevators[0].direction = 'down'
      elevators[0].currentFloor = 10
      elevators[0].queue = [{ floor: 5, callDirection: 'down' }]

      elevators[1].direction = 'down'
      elevators[1].currentFloor = 8
      elevators[1].queue = [{ floor: 3, callDirection: 'down' }]

      elevators[2].direction = 'down'
      elevators[2].currentFloor = 12
      elevators[2].queue = [{ floor: 7, callDirection: 'down' }]

      const result = lookAlgorithm(elevators, 6, 'up')
      // All going down, will need to reverse - should still pick one
      // Should not return null - must assign to an elevator
      expect(result).not.toBe(null)
    })

    it('should assign call when all elevators are busy moving', () => {
      // Real scenario: 3 elevators all moving, 4th call comes in
      elevators[0].direction = 'up'
      elevators[0].currentFloor = 3
      elevators[0].queue = [{ floor: 7, callDirection: 'up' }]

      elevators[1].direction = 'up'
      elevators[1].currentFloor = 5
      elevators[1].queue = [{ floor: 9, callDirection: 'up' }]

      elevators[2].direction = 'down'
      elevators[2].currentFloor = 10
      elevators[2].queue = [{ floor: 2, callDirection: 'down' }]

      // New call at floor 4 going down - all elevators busy
      const result = lookAlgorithm(elevators, 4, 'down')
      // Should assign to one of them (likely elevator 2 going down, or one going up that will reverse)
      expect(result).not.toBe(null)
    })

    it('should handle call behind all moving elevators', () => {
      // All elevators moving up, call is below all of them
      elevators[0].direction = 'up'
      elevators[0].currentFloor = 8
      elevators[0].queue = [{ floor: 12, callDirection: 'up' }]

      elevators[1].direction = 'up'
      elevators[1].currentFloor = 10
      elevators[1].queue = [{ floor: 15, callDirection: 'up' }]

      elevators[2].direction = 'up'
      elevators[2].currentFloor = 6
      elevators[2].queue = [{ floor: 11, callDirection: 'up' }]

      const result = lookAlgorithm(elevators, 3, 'up')
      // All elevators going up, call is below - should still assign to one
      // They will serve it after reversing
      expect(result).not.toBe(null)
    })

    it('should prefer compatible elevator when available, but assign to any when all busy', () => {
      // Elevator 0: going up, can serve the call easily
      elevators[0].direction = 'up'
      elevators[0].currentFloor = 3
      elevators[0].queue = [{ floor: 8, callDirection: 'up' }]

      // Elevator 1: going down, incompatible
      elevators[1].direction = 'down'
      elevators[1].currentFloor = 10
      elevators[1].queue = [{ floor: 2, callDirection: 'down' }]

      // Elevator 2: going down, incompatible
      elevators[2].direction = 'down'
      elevators[2].currentFloor = 8
      elevators[2].queue = [{ floor: 1, callDirection: 'down' }]

      const result = lookAlgorithm(elevators, 5, 'up')
      // Should prefer elevator 0 (compatible, going up)
      expect(result).toBe(0)

      // Now test when ALL are incompatible
      elevators[0].direction = 'down'
      elevators[0].currentFloor = 10
      elevators[0].queue = [{ floor: 5, callDirection: 'down' }]

      const result2 = lookAlgorithm(elevators, 3, 'up')
      // Should still assign to one of them (lowest cost after reversal)
      expect(result2).not.toBe(null)
    })
  })
})

describe('LOOK Queue Insertion', () => {
  describe('Idle Elevator Queue', () => {
    it('should add floor to empty queue', () => {
      const queue = []
      const result = insertIntoQueueLOOK(queue, 5, 'idle', 8)
      expect(result).toEqual([8])
    })

    it('should replace queue when elevator is idle', () => {
      const queue = [3, 7]
      const result = insertIntoQueueLOOK(queue, 5, 'idle', 8)
      expect(result).toEqual([8])
    })
  })

  describe('Upward Direction Queue', () => {
    it('should insert floor in ascending order when going up', () => {
      const queue = [6, 10]
      const result = insertIntoQueueLOOK(queue, 4, 'up', 8)
      expect(result).toEqual([6, 8, 10])
    })

    it('should insert at beginning when floor is lowest', () => {
      const queue = [7, 10, 12]
      const result = insertIntoQueueLOOK(queue, 5, 'up', 6)
      expect(result).toEqual([6, 7, 10, 12])
    })

    it('should insert at end when floor is highest', () => {
      const queue = [6, 8, 10]
      const result = insertIntoQueueLOOK(queue, 5, 'up', 15)
      expect(result).toEqual([6, 8, 10, 15])
    })

    it('should maintain order with multiple insertions', () => {
      let queue = [6, 10]
      queue = insertIntoQueueLOOK(queue, 5, 'up', 8)
      queue = insertIntoQueueLOOK(queue, 5, 'up', 7)
      queue = insertIntoQueueLOOK(queue, 5, 'up', 9)
      expect(queue).toEqual([6, 7, 8, 9, 10])
    })

    it('should not add duplicate floor', () => {
      const queue = [6, 8, 10]
      const result = insertIntoQueueLOOK(queue, 5, 'up', 8)
      expect(result).toEqual([6, 8, 10])
      expect(result.length).toBe(3)
    })
  })

  describe('Downward Direction Queue', () => {
    it('should insert floor in descending order when going down', () => {
      const queue = [8, 4]
      const result = insertIntoQueueLOOK(queue, 10, 'down', 6)
      expect(result).toEqual([8, 6, 4])
    })

    it('should insert at beginning when floor is highest', () => {
      const queue = [8, 6, 4]
      const result = insertIntoQueueLOOK(queue, 10, 'down', 9)
      expect(result).toEqual([9, 8, 6, 4])
    })

    it('should insert at end when floor is lowest', () => {
      const queue = [8, 6, 4]
      const result = insertIntoQueueLOOK(queue, 10, 'down', 2)
      expect(result).toEqual([8, 6, 4, 2])
    })

    it('should maintain descending order with multiple insertions', () => {
      let queue = [10, 6]
      queue = insertIntoQueueLOOK(queue, 12, 'down', 8)
      queue = insertIntoQueueLOOK(queue, 12, 'down', 7)
      queue = insertIntoQueueLOOK(queue, 12, 'down', 9)
      expect(queue).toEqual([10, 9, 8, 7, 6])
    })

    it('should not add duplicate floor when going down', () => {
      const queue = [10, 8, 6]
      const result = insertIntoQueueLOOK(queue, 12, 'down', 8)
      expect(result).toEqual([10, 8, 6])
      expect(result.length).toBe(3)
    })
  })

  describe('Queue Edge Cases', () => {
    it('should handle inserting into single-item queue going up', () => {
      const queue = [7]
      const result1 = insertIntoQueueLOOK(queue, 5, 'up', 9)
      expect(result1).toEqual([7, 9])
      
      const result2 = insertIntoQueueLOOK(queue, 5, 'up', 6)
      expect(result2).toEqual([6, 7])
    })

    it('should handle inserting into single-item queue going down', () => {
      const queue = [7]
      const result1 = insertIntoQueueLOOK(queue, 9, 'down', 5)
      expect(result1).toEqual([7, 5])
      
      const result2 = insertIntoQueueLOOK(queue, 9, 'down', 8)
      expect(result2).toEqual([8, 7])
    })

    it('should handle inserting floor equal to current floor', () => {
      const queue = [6, 8, 10]
      const result = insertIntoQueueLOOK(queue, 5, 'up', 5)
      expect(result).toEqual([5, 6, 8, 10])
    })

    it('should handle large queue', () => {
      const queue = [5, 10, 15, 20, 25, 30]
      const result = insertIntoQueueLOOK(queue, 3, 'up', 17)
      expect(result).toEqual([5, 10, 15, 17, 20, 25, 30])
    })

    it('should handle adjacent floors', () => {
      const queue = [5, 6, 7]
      const result = insertIntoQueueLOOK(queue, 4, 'up', 8)
      expect(result).toEqual([5, 6, 7, 8])
    })
  })

  describe('Direction Change Scenarios', () => {
    it('should reset queue when transitioning from up to idle', () => {
      const queue = [6, 8, 10]
      const result = insertIntoQueueLOOK(queue, 5, 'idle', 3)
      expect(result).toEqual([3])
    })

    it('should reset queue when transitioning from down to idle', () => {
      const queue = [8, 6, 4]
      const result = insertIntoQueueLOOK(queue, 5, 'idle', 10)
      expect(result).toEqual([10])
    })
  })
})
