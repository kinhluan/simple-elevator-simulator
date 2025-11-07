import { describe, it, expect, beforeEach } from 'vitest'
import { sstfAlgorithm, insertIntoQueueSSTF } from '../algorithms/sstfAlgorithm'

describe('SSTF (Shortest Seek Time First) Algorithm', () => {
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

  describe('Nearest Elevator Selection', () => {
    it('should select the nearest elevator to call floor', () => {
      const result = sstfAlgorithm(elevators, 6)
      expect(result).toBe(0) // Elevator 0 at floor 5 is closest to floor 6 (distance: 1)
    })

    it('should select nearest elevator ignoring direction', () => {
      elevators[0].direction = 'up'
      elevators[0].queue = [{ floor: 10, callDirection: 'up' }]
      
      elevators[1].direction = 'down'
      elevators[1].queue = [{ floor: 3, callDirection: 'down' }]
      
      const result = sstfAlgorithm(elevators, 7)
      expect(result).toBe(1) // Elevator 1 at floor 8 is closest (distance: 1), direction doesn't matter
    })

    it('should handle call on same floor as elevator', () => {
      const result = sstfAlgorithm(elevators, 5)
      expect(result).toBe(0) // Elevator 0 is already at floor 5 (distance: 0)
    })

    it('should select elevator with minimum distance among multiple options', () => {
      elevators[0].currentFloor = 10
      elevators[1].currentFloor = 3
      elevators[2].currentFloor = 7
      const result = sstfAlgorithm(elevators, 6)
      expect(result).toBe(2) // Elevator 2 at floor 7 (distance: 1) is closest
    })

    it('should handle equidistant elevators by selecting first one', () => {
      elevators[0].currentFloor = 5
      elevators[1].currentFloor = 7
      const result = sstfAlgorithm(elevators, 6)
      // Both elevators are equidistant (distance: 1), should select first one encountered
      expect([0, 1]).toContain(result)
    })
  })

  describe('Distance Calculation', () => {
    it('should calculate distance correctly for elevator below call', () => {
      elevators[0].currentFloor = 3
      elevators[1].currentFloor = 10
      elevators[2].currentFloor = 15
      const result = sstfAlgorithm(elevators, 8)
      // SSTF: Nearest is elevator 0 at floor 3, distance = |8-3| = 5
      // Elevator 1 at floor 10, distance = |8-10| = 2 (NEAREST!)
      // Elevator 2 at floor 15, distance = |8-15| = 7
      expect(result).toBe(1)
    })

    it('should calculate distance correctly for elevator above call', () => {
      elevators[0].currentFloor = 10
      elevators[1].currentFloor = 15
      elevators[2].currentFloor = 20
      const result = sstfAlgorithm(elevators, 4)
      // SSTF: All elevators are above the call
      // Elevator 0 at floor 10, distance = |4-10| = 6 (NEAREST!)
      // Elevator 1 at floor 15, distance = |4-15| = 11
      // Elevator 2 at floor 20, distance = |4-20| = 16
      expect(result).toBe(0)
    })

    it('should treat upward and downward distances equally', () => {
      elevators[0].currentFloor = 5
      elevators[1].currentFloor = 15
      const result = sstfAlgorithm(elevators, 10)
      // Both equidistant: |10-5| = 5, |10-15| = 5
      expect([0, 1]).toContain(result)
    })

    it('should prefer closer elevator regardless of queue length', () => {
      elevators[0].currentFloor = 5
      elevators[0].queue = [{ floor: 10 }, { floor: 15 }, { floor: 20 }]
      
      elevators[1].currentFloor = 8
      elevators[1].queue = []
      
      const result = sstfAlgorithm(elevators, 6)
      expect(result).toBe(0) // Elevator 0 at 5 is closer (distance: 1) despite long queue
    })
  })

  describe('Direction Independence', () => {
    it('should ignore elevator direction - select nearest regardless', () => {
      elevators[0].currentFloor = 10
      elevators[0].direction = 'up'
      
      elevators[1].currentFloor = 5
      elevators[1].direction = 'down'
      
      const result = sstfAlgorithm(elevators, 6)
      expect(result).toBe(1) // Elevator 1 is closer, direction doesn't matter
    })

    it('should select moving elevator if it is nearest', () => {
      elevators[0].currentFloor = 5
      elevators[0].direction = 'up'
      elevators[0].queue = [{ floor: 10 }]
      
      elevators[1].currentFloor = 10
      elevators[1].direction = 'idle'
      
      const result = sstfAlgorithm(elevators, 7)
      expect(result).toBe(0) // Moving elevator is closer
    })

    it('should not consider call direction parameter', () => {
      // SSTF doesn't use call direction, only distance
      elevators[0].currentFloor = 5
      elevators[1].currentFloor = 10
      
      const resultUp = sstfAlgorithm(elevators, 6, 'up')
      const resultDown = sstfAlgorithm(elevators, 6, 'down')
      
      expect(resultUp).toBe(resultDown) // Same result regardless of call direction
      expect(resultUp).toBe(0)
    })
  })

  describe('Edge Cases', () => {
    it('should handle empty elevators array', () => {
      const result = sstfAlgorithm([], 5)
      expect(result).toBe(null)
    })

    it('should handle null elevators', () => {
      const result = sstfAlgorithm(null, 5)
      expect(result).toBe(null)
    })

    it('should handle undefined elevators', () => {
      const result = sstfAlgorithm(undefined, 5)
      expect(result).toBe(null)
    })

    it('should handle single elevator', () => {
      const singleElevator = [{ id: 0, currentFloor: 5, direction: 'idle', queue: [] }]
      const result = sstfAlgorithm(singleElevator, 10)
      expect(result).toBe(0)
    })

    it('should handle all elevators at same floor', () => {
      elevators.forEach(e => e.currentFloor = 5)
      const result = sstfAlgorithm(elevators, 8)
      expect([0, 1, 2]).toContain(result) // Any elevator is valid
    })

    it('should handle extreme floor numbers', () => {
      elevators[0].currentFloor = 1
      elevators[1].currentFloor = 50
      elevators[2].currentFloor = 100
      const result = sstfAlgorithm(elevators, 99)
      expect(result).toBe(2) // Elevator 2 at floor 100 is closest (distance: 1)
    })

    it('should handle floor 1 (ground floor)', () => {
      elevators[0].currentFloor = 5
      elevators[1].currentFloor = 10
      elevators[2].currentFloor = 2
      const result = sstfAlgorithm(elevators, 1)
      expect(result).toBe(2) // Elevator 2 at floor 2 is closest
    })

    it('should handle very high floors', () => {
      elevators[0].currentFloor = 95
      elevators[1].currentFloor = 50
      elevators[2].currentFloor = 105
      const result = sstfAlgorithm(elevators, 100)
      // SSTF: Select nearest
      // Elevator 0 at floor 95, distance = |100-95| = 5 (NEAREST!)
      // Elevator 1 at floor 50, distance = |100-50| = 50
      // Elevator 2 at floor 105, distance = |100-105| = 5 (EQUAL!)
      // Should return first one found with lowest distance
      expect([0, 2]).toContain(result)
    })
  })

  describe('Multiple Elevators Competition', () => {
    it('should always select nearest among many elevators', () => {
      elevators = [
        { id: 0, currentFloor: 10, direction: 'idle', queue: [] },
        { id: 1, currentFloor: 20, direction: 'up', queue: [{ floor: 25 }] },
        { id: 2, currentFloor: 5, direction: 'down', queue: [{ floor: 2 }] },
        { id: 3, currentFloor: 15, direction: 'idle', queue: [] },
        { id: 4, currentFloor: 1, direction: 'idle', queue: [] }
      ]
      
      const result = sstfAlgorithm(elevators, 14)
      expect(result).toBe(3) // Elevator 3 at floor 15 (distance: 1) is closest
    })

    it('should handle ties by returning first closest elevator', () => {
      elevators[0].currentFloor = 5
      elevators[1].currentFloor = 9
      elevators[2].currentFloor = 3
      
      const result = sstfAlgorithm(elevators, 7)
      // Elevator 0 (distance: 2) and Elevator 1 (distance: 2) are equally close
      // Elevator 2 (distance: 4) is farther
      expect([0, 1]).toContain(result)
    })
  })

  describe('Real-World Scenarios', () => {
    it('should handle busy elevators - still select nearest', () => {
      elevators[0].currentFloor = 5
      elevators[0].direction = 'up'
      elevators[0].queue = [
        { floor: 7 },
        { floor: 10 },
        { floor: 15 },
        { floor: 20 }
      ]
      
      elevators[1].currentFloor = 10
      elevators[1].direction = 'idle'
      
      const result = sstfAlgorithm(elevators, 6)
      expect(result).toBe(0) // Nearest is elevator 0, even though it's busy
    })

    it('should handle all elevators busy at different floors', () => {
      elevators[0].currentFloor = 8
      elevators[0].direction = 'up'
      elevators[0].queue = [{ floor: 12 }]
      
      elevators[1].currentFloor = 3
      elevators[1].direction = 'down'
      elevators[1].queue = [{ floor: 1 }]
      
      elevators[2].currentFloor = 15
      elevators[2].direction = 'down'
      elevators[2].queue = [{ floor: 10 }]
      
      const result = sstfAlgorithm(elevators, 7)
      expect(result).toBe(0) // Elevator 0 at floor 8 is closest (distance: 1)
    })

    it('should demonstrate potential starvation scenario', () => {
      // SSTF can cause starvation - always picking nearest
      elevators[0].currentFloor = 50
      elevators[1].currentFloor = 45
      elevators[2].currentFloor = 55
      
      const result = sstfAlgorithm(elevators, 1)
      expect(result).toBe(1) // Will pick elevator at 45, far floor may wait long time
    })
  })
})

describe('SSTF Queue Insertion', () => {
  describe('Basic Queue Operations', () => {
    it('should add floor to empty queue', () => {
      const queue = []
      const result = insertIntoQueueSSTF(queue, 5, 8)
      expect(result).toEqual([8])
    })

    it('should insert floor in order of distance from current floor', () => {
      const queue = [10, 3]
      const result = insertIntoQueueSSTF(queue, 5, 7)
      // Distances from floor 5: 7->2, 10->5, 3->2
      // Sorted by distance: [7, 3, 10] or [3, 7, 10]
      expect(result).toHaveLength(3)
      expect(result).toContain(7)
      expect(result).toContain(3)
      expect(result).toContain(10)
    })

    it('should maintain distance-based ordering', () => {
      const queue = [10]
      const result = insertIntoQueueSSTF(queue, 5, 3)
      // Distances: 3->2, 10->5
      // Should be sorted: [3, 10]
      expect(result[0]).toBe(3)
      expect(result[1]).toBe(10)
    })

    it('should not add duplicate floor', () => {
      const queue = [3, 7, 10]
      const result = insertIntoQueueSSTF(queue, 5, 7)
      expect(result).toEqual([3, 7, 10])
      expect(result.length).toBe(3)
    })
  })

  describe('Distance-Based Sorting', () => {
    it('should sort by ascending distance from current floor', () => {
      const queue = []
      let result = insertIntoQueueSSTF(queue, 10, 12) // distance: 2
      result = insertIntoQueueSSTF(result, 10, 8)     // distance: 2
      result = insertIntoQueueSSTF(result, 10, 15)    // distance: 5
      result = insertIntoQueueSSTF(result, 10, 5)     // distance: 5
      result = insertIntoQueueSSTF(result, 10, 11)    // distance: 1
      
      // Floor 11 should be first (distance 1), then 12 and 8 (distance 2), then 15 and 5 (distance 5)
      expect(result[0]).toBe(11)
      expect([8, 12]).toContain(result[1])
      expect([8, 12]).toContain(result[2])
    })

    it('should place nearest floor first in queue', () => {
      const queue = [10, 20, 30]
      const result = insertIntoQueueSSTF(queue, 15, 16)
      // Distances from 15: 16->1, 10->5, 20->5, 30->15
      expect(result[0]).toBe(16) // Nearest floor should be first
    })

    it('should handle floor at current position (distance 0)', () => {
      const queue = [8, 12]
      const result = insertIntoQueueSSTF(queue, 10, 10)
      // Distance 0 should be first
      expect(result[0]).toBe(10)
    })

    it('should sort floors equidistant in any order', () => {
      const queue = []
      let result = insertIntoQueueSSTF(queue, 10, 8)  // distance: 2
      result = insertIntoQueueSSTF(result, 10, 12)     // distance: 2
      
      // Both have same distance, order doesn't matter strictly
      expect(result).toHaveLength(2)
      expect(result).toContain(8)
      expect(result).toContain(12)
    })
  })

  describe('Multiple Insertions', () => {
    it('should maintain sorted order after multiple insertions', () => {
      let queue = []
      queue = insertIntoQueueSSTF(queue, 5, 10) // distance: 5
      queue = insertIntoQueueSSTF(queue, 5, 6)  // distance: 1
      queue = insertIntoQueueSSTF(queue, 5, 8)  // distance: 3
      queue = insertIntoQueueSSTF(queue, 5, 3)  // distance: 2
      
      // Should be sorted by distance: 6(1), 3(2), 8(3), 10(5)
      expect(queue[0]).toBe(6)
      expect(queue[1]).toBe(3)
      expect(queue[2]).toBe(8)
      expect(queue[3]).toBe(10)
    })

    it('should handle inserting many floors', () => {
      let queue = []
      const floors = [15, 5, 20, 8, 12, 3, 18]
      const currentFloor = 10
      
      floors.forEach(floor => {
        queue = insertIntoQueueSSTF(queue, currentFloor, floor)
      })
      
      // Verify all floors are added
      expect(queue).toHaveLength(floors.length)
      
      // Verify sorted by distance
      let lastDistance = 0
      queue.forEach(floor => {
        const distance = Math.abs(floor - currentFloor)
        expect(distance).toBeGreaterThanOrEqual(lastDistance)
        lastDistance = distance
      })
    })
  })

  describe('Edge Cases', () => {
    it('should handle single floor in queue', () => {
      const queue = [10]
      const result = insertIntoQueueSSTF(queue, 5, 7)
      expect(result).toHaveLength(2)
      expect(result).toContain(7)
      expect(result).toContain(10)
    })

    it('should handle inserting floor below current', () => {
      const queue = [8, 10]
      const result = insertIntoQueueSSTF(queue, 5, 2)
      // Distances: 2->3, 8->3, 10->5
      expect(result).toContain(2)
      expect(result).toHaveLength(3)
    })

    it('should handle inserting floor above current', () => {
      const queue = [2, 4]
      const result = insertIntoQueueSSTF(queue, 5, 10)
      // Distances: 2->3, 4->1, 10->5
      expect(result).toContain(10)
      expect(result).toHaveLength(3)
    })

    it('should handle extreme distances', () => {
      const queue = [50]
      const result = insertIntoQueueSSTF(queue, 5, 100)
      // Distances: 50->45, 100->95
      expect(result[0]).toBe(50) // Closer floor first
      expect(result[1]).toBe(100)
    })

    it('should handle adjacent floors', () => {
      const queue = [5, 7]
      const result = insertIntoQueueSSTF(queue, 6, 8)
      // From floor 6: 5->1, 7->1, 8->2
      expect(result).toHaveLength(3)
      expect([5, 7]).toContain(result[0])
      expect([5, 7]).toContain(result[1])
      expect(result[2]).toBe(8)
    })
  })

  describe('Real-World Queue Scenarios', () => {
    it('should reorder queue as elevator moves', () => {
      // Simulate elevator moving and queue being reordered
      let queue = [10, 5, 15]
      
      // At floor 3
      queue = insertIntoQueueSSTF(queue, 3, 7)
      let distances = queue.map(f => Math.abs(f - 3))
      expect(distances[0]).toBeLessThanOrEqual(distances[1])
      
      // At floor 8
      queue = insertIntoQueueSSTF(queue, 8, 12)
      distances = queue.map(f => Math.abs(f - 8))
      expect(distances[0]).toBeLessThanOrEqual(distances[1])
    })

    it('should handle typical office building scenario', () => {
      let queue = []
      const currentFloor = 1 // Ground floor
      
      // Multiple calls from different floors
      queue = insertIntoQueueSSTF(queue, currentFloor, 5)
      queue = insertIntoQueueSSTF(queue, currentFloor, 10)
      queue = insertIntoQueueSSTF(queue, currentFloor, 3)
      queue = insertIntoQueueSSTF(queue, currentFloor, 8)
      
      // Should visit in order of distance: 3, 5, 8, 10
      expect(queue[0]).toBe(3) // Nearest from ground floor
    })

    it('should demonstrate greedy nature of SSTF', () => {
      const queue = [20]
      const result = insertIntoQueueSSTF(queue, 10, 11)
      // Will serve 11 before 20, even if 20 was called first
      expect(result[0]).toBe(11) // Greedy: serves nearest first
    })
  })

  describe('Queue Comparison with Direction Algorithms', () => {
    it('should differ from LOOK - not maintain directional order', () => {
      let queue = []
      const currentFloor = 5
      
      // Add floors in various directions
      queue = insertIntoQueueSSTF(queue, currentFloor, 8)
      queue = insertIntoQueueSSTF(queue, currentFloor, 3)
      queue = insertIntoQueueSSTF(queue, currentFloor, 10)
      queue = insertIntoQueueSSTF(queue, currentFloor, 2)
      
      // SSTF sorts by distance, not direction
      // From floor 5: 3->2, 2->3, 8->3, 10->5
      // Should be: [3, 2, 8, 10] or similar based on distance
      expect(queue[0]).toBe(3) // Nearest
      expect(queue[queue.length - 1]).toBe(10) // Farthest
    })
  })
})
