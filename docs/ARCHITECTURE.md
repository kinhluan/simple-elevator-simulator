# Kiến Trúc Hệ Thống - Elevator Simulator

Tài liệu này giải thích chi tiết về kiến trúc và design decisions của elevator simulator.

---

## Mục Lục

1. [Tổng Quan Kiến Trúc](#tổng-quan-kiến-trúc)
2. [State Management](#state-management)
3. [State Machine](#state-machine)
4. [Timer Management](#timer-management)
5. [Algorithm Integration](#algorithm-integration)
6. [Component Hierarchy](#component-hierarchy)
7. [Data Flow](#data-flow)
8. [Performance Considerations](#performance-considerations)

---

## Tổng Quan Kiến Trúc

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         App.jsx                             │
│                  (Main Layout Container)                    │
└─────────────────────────────────────────────────────────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
        ▼                    ▼                    ▼
┌───────────────┐  ┌──────────────────┐  ┌──────────────┐
│ Left Sidebar  │  │    Building      │  │Right Sidebar │
│ (Collapsed)   │  │  Visualization   │  │(Tab Panels)  │
└───────────────┘  └──────────────────┘  └──────────────┘
                            │
                            │
                   ┌────────┴────────┐
                   │                 │
                   ▼                 ▼
            ┌──────────┐      ┌──────────┐
            │  Floor   │      │ Elevator │
            │ Buttons  │      │   Cars   │
            └──────────┘      └──────────┘
```

### Design Pattern: Custom Hook Pattern

**Core Principle**: Tách logic khỏi UI.

```
┌──────────────────────────────────────────┐
│      useElevatorSystem.js (Logic)       │
│  - State management                      │
│  - State machine transitions             │
│  - Timer orchestration                   │
│  - Algorithm integration                 │
└──────────────────────────────────────────┘
                    │
                    │ Returns: { elevators, calls, callElevator, ... }
                    │
                    ▼
┌──────────────────────────────────────────┐
│       React Components (UI)              │
│  - BuildingVisualization                 │
│  - ElevatorCar                           │
│  - Control Panels                        │
└──────────────────────────────────────────┘
```

**Benefits**:

- ✅ Testable logic độc lập
- ✅ Reusable across components
- ✅ Clear separation of concerns

---

## State Management

### State Structure

Hệ thống có 3 layers of state:

#### 1. Elevator State (Per-elevator)

```javascript
{
  // Identity
  id: 0,

  // Position
  currentFloor: 5,
  targetFloor: 8,

  // Movement
  direction: 'up',        // 'up' | 'down' | 'idle'
  isMoving: true,

  // State Machine
  operationalState: 'moving', // 'idle' | 'moving' | 'arriving' |
                              // 'doors_opening' | 'doors_open' |
                              // 'doors_closing'

  // Queue
  queue: [
    { floor: 8, callDirection: 'up', timestamp: 1699... },
    { floor: 10, callDirection: 'up', timestamp: 1699... }
  ],

  // Animation
  doorProgress: 0,        // 0-100
  passengerCount: 3,

  // Performance Metrics
  tripsCompleted: 15,
  floorsTravel: 120,
  directionChanges: 8,
  timeInState: {
    idle: 30000,          // milliseconds
    moving: 120000,
    serving: 90000
  },
  lastStateChangeTime: 1699...,
  lastDirection: 'up'
}
```

#### 2. Call State (Pending Calls)

```javascript
{
  id: 1699123456789,      // Timestamp-based ID
  floor: 7,
  direction: 'up',
  timestamp: 1699123456789
}
```

**Manual mode**: Calls được store trong `calls` array cho đến khi user assign.

**Auto mode**: Calls được assign ngay lập tức, không vào `calls` array.

#### 3. Performance Metrics (System-wide)

```javascript
{
  completedCalls: [
    { floor: 5, waitTime: 3500, timestamp: 1699... },
    { floor: 8, waitTime: 4200, timestamp: 1699... }
    // ... up to 100 most recent
  ],
  totalWaitTime: 350000,    // Sum of all wait times
  callsServed: 42,           // Total count
  sessionStartTime: 1699...  // Session start
}
```

### State Synchronization Pattern

**Problem**: Timers capture stale state (closures).

**Solution**: Dual state management với `useRef`.

```javascript
// State cho React rendering
const [elevators, setElevators] = useState([...])

// Ref cho timer callbacks
const elevatorsRef = useRef([])

// Sync ref với state
useEffect(() => {
  elevatorsRef.current = elevators
}, [elevators])

// Timer callback uses ref (always current)
const callback = () => {
  const currentElevator = elevatorsRef.current.find(e => e.id === id)
  // ... work with current state
}
```

**Benefits**:

- ✅ Timers always have current state
- ✅ No stale closures
- ✅ No race conditions

---

## State Machine

### Elevator State Machine Diagram

```
                    ┌──────┐
                    │ IDLE │◄────────────────────┐
                    └──┬───┘                     │
                       │                         │
              New destination                    │
                       │                         │
                       ▼                         │
                  ┌─────────┐                    │
                  │ MOVING  │                    │
                  └────┬────┘                    │
                       │                         │
            Reached target floor                 │
                       │                         │
                       ▼                         │
                  ┌──────────┐                   │
                  │ ARRIVING │                   │
                  └────┬─────┘                   │
                       │                         │
                1 second settle                  │
                       │                         │
                       ▼                         │
              ┌────────────────┐                 │
              │ DOORS_OPENING  │                 │
              └───────┬────────┘                 │
                      │                          │
                2.5 seconds                      │
                      │                          │
                      ▼                          │
              ┌──────────────┐                   │
              │  DOORS_OPEN  │                   │
              └──────┬───────┘                   │
                     │                           │
          3+ seconds (passengers)                │
                     │                           │
                     ▼                           │
              ┌────────────────┐                 │
              │ DOORS_CLOSING  │                 │
              └───────┬────────┘                 │
                      │                          │
                2 seconds                        │
                      │                          │
                      ▼                          │
                 Check Queue                     │
                      │                          │
         ┌────────────┴────────────┐             │
         │                         │             │
    Queue empty              Queue has items     │
         │                         │             │
         └─────────────────────────┴─────────────┘
```

### State Transition Logic

**File**: `src/hooks/useElevatorSystem.js` - `transitionElevatorState()`

```javascript
function transitionElevatorState(elevatorId) {
  setElevators(prev => {
    const elevator = prev.find(e => e.id === elevatorId)

    switch (elevator.operationalState) {
      case ELEVATOR_STATES.MOVING:
        // Move one floor
        const nextFloor = direction === 'up'
          ? currentFloor + 1
          : currentFloor - 1

        if (nextFloor === targetFloor) {
          return { operationalState: ELEVATOR_STATES.ARRIVING }
        } else {
          return { currentFloor: nextFloor }
        }

      case ELEVATOR_STATES.ARRIVING:
        // Settle, then open doors
        return { operationalState: ELEVATOR_STATES.DOORS_OPENING }

      case ELEVATOR_STATES.DOORS_OPENING:
        // Doors fully open
        return { operationalState: ELEVATOR_STATES.DOORS_OPEN }

      case ELEVATOR_STATES.DOORS_OPEN:
        // Hold for passengers
        return { operationalState: ELEVATOR_STATES.DOORS_CLOSING }

      case ELEVATOR_STATES.DOORS_CLOSING:
        // Process queue, determine next action
        if (queue.length === 0) {
          return { operationalState: ELEVATOR_STATES.IDLE }
        } else {
          return { operationalState: ELEVATOR_STATES.MOVING }
        }
    }
  })
}
```

### State Timing

| State | Duration | Configurable? |
|-------|----------|---------------|
| MOVING | 1000ms per floor | ✅ Yes |
| ARRIVING | 1000ms | ❌ No (fixed) |
| DOORS_OPENING | 2500ms | ✅ Yes |
| DOORS_OPEN | 3000ms + passengers | ✅ Yes (base) |
| DOORS_CLOSING | 2000ms | ✅ Yes |

**Configuration**:

```javascript
const elevatorSystem = useElevatorSystem(
  numFloors,
  numElevators,
  'scan',
  {
    floorTravelTime: 1000,
    doorOpenTime: 2500,
    doorHoldTime: 3000,
    doorCloseTime: 2000
  }
)
```

---

## Timer Management

### Problem: Race Conditions

**Bad approach** (multiple timers):

```javascript
// ❌ Anti-pattern
setTimeout(() => moveFloor(id), 1000)
setTimeout(() => openDoors(id), 2000)
setTimeout(() => closeDoors(id), 5000)

// Timers can overlap, state can become inconsistent
```

### Solution: Single Timer Per Elevator

**Pattern**:

```javascript
// One timer ref per elevator
const timersRef = useRef({})

function scheduleNextTransition(elevatorId) {
  // 1. Clear existing timer
  if (timersRef.current[elevatorId]) {
    clearTimeout(timersRef.current[elevatorId])
  }

  // 2. Get current elevator state
  const elevator = elevatorsRef.current.find(e => e.id === elevatorId)

  // 3. Calculate delay based on state
  let delay = 0
  switch (elevator.operationalState) {
    case ELEVATOR_STATES.MOVING: delay = timing.floorTravelTime; break
    case ELEVATOR_STATES.ARRIVING: delay = 1000; break
    // ... etc
  }

  // 4. Schedule ONE timer
  timersRef.current[elevatorId] = setTimeout(() => {
    transitionElevatorState(elevatorId)
  }, delay)
}
```

### Timer Lifecycle

```
Elevator becomes active (MOVING)
         ↓
scheduleNextTransition(id) called
         ↓
Timer set for next state transition
         ↓
Timer fires after delay
         ↓
transitionElevatorState(id) called
         ↓
State updated
         ↓
scheduleNextTransition(id) called again
         ↓
... loop until IDLE
```

**Key points**:

- ✅ Exactly ONE timer per elevator at any time
- ✅ Timer cleared before new one is set
- ✅ No overlapping timers
- ✅ Deterministic state transitions

### Cleanup on Unmount

```javascript
useEffect(() => {
  return () => {
    // Clear all timers when component unmounts
    Object.values(timersRef.current).forEach(timer => {
      if (timer) clearTimeout(timer)
    })
  }
}, [])
```

---

## Algorithm Integration

### Architecture

```
┌──────────────────────────────────────────────┐
│         useElevatorSystem.js                 │
│  ┌────────────────────────────────────────┐  │
│  │  callElevator(floor, direction)       │  │
│  │         ↓                              │  │
│  │  if (isAutoMode)                       │  │
│  │         ↓                              │  │
│  │  algorithm = getAlgorithm(mode)        │  │
│  │         ↓                              │  │
│  │  bestId = algorithm(elevators, ...)    │  │
│  │         ↓                              │  │
│  │  addToElevatorQueue(bestId, floor)     │  │
│  └────────────────────────────────────────┘  │
└──────────────────────────────────────────────┘
                    │
                    ▼
┌──────────────────────────────────────────────┐
│      src/algorithms/elevatorScheduler.js     │
│  ┌────────────────────────────────────────┐  │
│  │  getAlgorithm(mode)                    │  │
│  │    'scan'  → scanAlgorithm             │  │
│  │    'look'  → lookAlgorithm             │  │
│  │    'sstf'  → sstfAlgorithm             │  │
│  └────────────────────────────────────────┘  │
└──────────────────────────────────────────────┘
                    │
        ┌───────────┼───────────┐
        ▼           ▼           ▼
┌─────────────┬─────────────┬─────────────┐
│ SCAN        │ LOOK        │ SSTF        │
│ Algorithm   │ Algorithm   │ Algorithm   │
└─────────────┴─────────────┴─────────────┘
```

### Algorithm Interface

Mỗi algorithm phải implement 2 functions:

#### 1. Selection Function

```typescript
/**
 * Select best elevator for a call
 * @param elevators - Array of elevator states
 * @param callFloor - Floor making the call
 * @param callDirection - 'up' or 'down'
 * @param maxFloor - Building height (SCAN only)
 * @returns Elevator ID or null
 */
function algorithm(
  elevators: Elevator[],
  callFloor: number,
  callDirection: 'up' | 'down',
  maxFloor?: number
): number | null
```

#### 2. Queue Insertion Function

```typescript
/**
 * Insert floor into queue maintaining algorithm order
 * @param queue - Current queue (floor numbers)
 * @param currentFloor - Elevator's current position
 * @param direction - Current direction ('up'|'down'|'idle')
 * @param newFloor - Floor to insert
 * @returns Updated queue
 */
function insertIntoQueue(
  queue: number[],
  currentFloor: number,
  direction: string,
  newFloor: number
): number[]
```

### Algorithm Registration

```javascript
// elevatorScheduler.js
export const getAlgorithm = (mode) => {
  switch (mode) {
    case 'look': return lookAlgorithm
    case 'sstf': return sstfAlgorithm
    case 'scan': return scanAlgorithm
    default: return lookAlgorithm
  }
}
```

**Adding new algorithm**:

1. Create `src/algorithms/myAlgorithm.js`
2. Implement selection + queue insertion functions
3. Add to `elevatorScheduler.js`
4. Update UI dropdown

---

## Component Hierarchy

### Component Tree

```
App
├── HeroSection (Header)
├── CollapsibleSidebar (Left - collapsed by default)
├── BuildingVisualization ⭐
│   ├── Floor Buttons (Up/Down)
│   └── ElevatorCar[] (Multiple)
│       └── Door Animation (CSS + RAF)
└── RightSidebar
    └── TabbedControlPanel
        ├── AlgorithmAndBuildingPanel (Tab 1)
        │   ├── Algorithm Selection
        │   └── BuildingConfigPanel
        ├── CallsAndElevatorsPanel (Tab 2)
        │   ├── Pending Calls List
        │   └── Elevator Status List
        ├── InstructionsPanel (Tab 3)
        └── StatisticsDashboard (Tab 4)
```

### Key Components

#### BuildingVisualization.jsx

**Responsibility**: Render building with floors and elevators.

```javascript
function BuildingVisualization({
  numFloors,
  numElevators,
  elevators,
  calls,
  callElevator,
  isAutoMode
}) {
  return (
    <div className="building">
      {/* Floors */}
      {Array(numFloors).fill().map((_, floorIndex) => (
        <Floor
          floor={numFloors - floorIndex}
          callElevator={callElevator}
        />
      ))}

      {/* Elevators */}
      {Array(numElevators).fill().map((_, elevIndex) => (
        <ElevatorCar
          elevator={elevators[elevIndex]}
          numFloors={numFloors}
        />
      ))}
    </div>
  )
}
```

#### ElevatorCar.jsx

**Responsibility**:

- Visualize single elevator
- Animate position (CSS transform)
- Animate doors (requestAnimationFrame)

```javascript
function ElevatorCar({ elevator, numFloors }) {
  // Position calculation
  const position = ((numFloors - elevator.currentFloor) / numFloors) * 100

  // Door animation
  useEffect(() => {
    let rafId
    const animate = (timestamp) => {
      // Update door position based on elevator.doorProgress
      rafId = requestAnimationFrame(animate)
    }
    rafId = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(rafId)
  }, [elevator])

  return (
    <div
      className="elevator-car"
      style={{ top: `${position}%` }}
    >
      {/* Door visualization */}
    </div>
  )
}
```

---

## Data Flow

### Call Flow (Auto Mode)

```
User clicks floor button
         ↓
callElevator(floor, direction)
         ↓
isAutoMode? → Yes
         ↓
algorithm = getAlgorithm('scan')
         ↓
bestId = algorithm(elevators, floor, direction)
         ↓
addToElevatorQueue(bestId, floor, direction, timestamp)
         ↓
setElevators(prev => {
  // Insert floor into queue using insertIntoQueue()
  // If elevator idle, start moving immediately
})
         ↓
scheduleNextTransition(bestId)
         ↓
[State machine takes over]
```

### Call Flow (Manual Mode)

```
User clicks floor button
         ↓
callElevator(floor, direction)
         ↓
isAutoMode? → No
         ↓
setCalls(prev => [...prev, { floor, direction, timestamp }])
         ↓
[Call appears in Pending Calls list]
         ↓
User clicks "Assign to Elevator X"
         ↓
assignCall(callId, elevatorId)
         ↓
addToElevatorQueue(elevatorId, floor, direction, timestamp)
         ↓
setCalls(prev => prev.filter(c => c.id !== callId))
         ↓
scheduleNextTransition(elevatorId)
```

### Performance Metrics Flow

```
Elevator reaches floor (DOORS_CLOSING state)
         ↓
reachedCall = queue[0]
         ↓
if (!reachedCall.isPhantom) // Skip phantom floors
         ↓
waitTime = Date.now() - reachedCall.timestamp
         ↓
setPerformanceMetrics(prev => ({
  completedCalls: [...prev.completedCalls, {
    floor: reachedCall.floor,
    waitTime,
    timestamp: Date.now()
  }].slice(-100), // Keep last 100
  totalWaitTime: prev.totalWaitTime + waitTime,
  callsServed: prev.callsServed + 1
}))
         ↓
[Metrics displayed in StatisticsDashboard]
```

---

## Performance Considerations

### Current Performance Issues

#### 1. Unnecessary Re-renders

**Problem**: Parent state changes cause all children to re-render.

```javascript
// Every elevator state change re-renders all ElevatorCar components
{elevators.map(elevator => (
  <ElevatorCar elevator={elevator} />
))}
```

**Solution**: Use `React.memo`

```javascript
const ElevatorCar = React.memo(({ elevator }) => {
  // Only re-renders if elevator object changes
})
```

#### 2. Multiple Timers

**Current**: Up to 12 timers (12 elevators × 1 timer each)

**Better approach**: Single RAF loop

```javascript
useEffect(() => {
  let rafId
  const tick = (timestamp) => {
    // Update all elevators in one pass
    setElevators(prev => prev.map(updateElevator))
    rafId = requestAnimationFrame(tick)
  }
  rafId = requestAnimationFrame(tick)
  return () => cancelAnimationFrame(rafId)
}, [])
```

#### 3. Array Creation in Render

```javascript
// ❌ Creates new array every render
{Array(numFloors).fill().map(...)}

// ✅ Memoize
const floorIndices = useMemo(() =>
  Array.from({ length: numFloors }, (_, i) => i),
  [numFloors]
)
```

### Optimization Checklist

- [ ] Add `React.memo` to components
- [ ] Add `useMemo` for expensive calculations
- [ ] Add `useCallback` for event handlers
- [ ] Implement code splitting with `React.lazy`
- [ ] Use single RAF loop instead of multiple timers
- [ ] Add virtualization for large building (30+ floors)

---

## Extending the System

### Adding New Algorithm

1. **Create algorithm file**: `src/algorithms/cscanAlgorithm.js`

```javascript
export const cscanAlgorithm = (elevators, callFloor, callDirection, maxFloor) => {
  // Your implementation
}

export const insertIntoQueueCSCAN = (queue, currentFloor, direction, newFloor) => {
  // Your queue management
}
```

2. **Register in scheduler**: `src/algorithms/elevatorScheduler.js`

```javascript
export const getAlgorithm = (mode) => {
  switch (mode) {
    case 'cscan': return cscanAlgorithm // Add this
    // ... existing cases
  }
}
```

3. **Update UI**: Add option to algorithm dropdown

### Adding New Metrics

1. **Extend performance state**:

```javascript
const [performanceMetrics, setPerformanceMetrics] = useState({
  // ... existing metrics
  energyUsed: 0, // New metric
})
```

2. **Track in state transitions**:

```javascript
case ELEVATOR_STATES.MOVING:
  setPerformanceMetrics(prev => ({
    ...prev,
    energyUsed: prev.energyUsed + ENERGY_PER_FLOOR
  }))
```

3. **Display in StatisticsDashboard**

---

## Kết Luận

### Design Principles

1. **Separation of Concerns**
   - Logic in hooks
   - UI in components
   - Algorithms in modules

2. **Single Responsibility**
   - Each file has one clear purpose
   - Functions do one thing well

3. **Predictable State**
   - Single source of truth
   - Deterministic transitions
   - No race conditions

4. **Extensibility**
   - Easy to add algorithms
   - Easy to add metrics
   - Clear interfaces

### Further Reading

- See `ALGORITHMS.md` for algorithm details
- See `CLAUDE.md` for development guide
- See source code comments for implementation details

---

*Document version: 1.0*
*Last updated: 2025-11-08*
