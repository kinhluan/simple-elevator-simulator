# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an interactive elevator scheduling simulator built with React 19 and Vite that visualizes different elevator dispatch algorithms (SCAN, LOOK, SSTF) in real-time. The project is educational in nature, demonstrating how different scheduling algorithms perform under various conditions.

## Development Commands

### Running the Development Server
```bash
npm run dev
```
Development server runs on `http://localhost:3000` (custom port configured in vite.config.js)

### Building for Production
```bash
npm run build
```

### Linting
```bash
npm lint
```

### Running Tests
```bash
npm test              # Run all tests
npm run test:ui       # Run tests with UI
npm run test:coverage # Run tests with coverage report
```

### Deployment
```bash
npm run deploy        # Deploy to GitHub Pages (runs build first)
```

## Architecture

### State Management Pattern

The application uses a **centralized state machine** pattern implemented in `useElevatorSystem` hook (src/hooks/useElevatorSystem.js). This is the heart of the simulator and manages:

- **Single timer per elevator**: Each elevator has exactly one timer reference to prevent race conditions
- **Command-based state transitions**: All state changes go through `transitionElevatorState()` function
- **Deterministic state flow**: IDLE → MOVING → ARRIVING → DOORS_OPENING → DOORS_OPEN → DOORS_CLOSING → back to MOVING or IDLE

Key architectural decision: The hook uses `useRef` to maintain timer references and current elevator state, ensuring state updates don't create stale closures.

### Elevator State Machine

Elevators progress through defined states (src/constants/elevatorTiming.js):
- `IDLE`: No active task
- `MOVING`: Traveling between floors
- `ARRIVING`: Settling at target floor (1 second)
- `DOORS_OPENING`: Door opening animation (2.5 seconds)
- `DOORS_OPEN`: Passengers boarding/exiting (3 seconds + passenger count)
- `DOORS_CLOSING`: Door closing animation (2 seconds)

State transitions are scheduled via `scheduleNextTransition()` which is the ONLY place timers are set, preventing race conditions.

### Algorithm Architecture

Three scheduling algorithms are implemented as separate modules in src/algorithms/:

1. **SCAN** (scanAlgorithm.js) - Industry standard
   - Moves in one direction to the extreme floor, then reverses
   - Uses "phantom floors" to ensure full sweep to extremes
   - Best for preventing starvation

2. **LOOK** (lookAlgorithm.js) - More efficient variant
   - Reverses when no more requests ahead (doesn't go to extremes)
   - Better efficiency than SCAN but slightly less fair

3. **SSTF** (sstfAlgorithm.js) - Educational only
   - Serves nearest floor first
   - Re-sorts queue after each stop
   - Demonstrates starvation problems

Each algorithm exports:
- Main algorithm function: `(elevators, callFloor, callDirection, numFloors) => elevatorId`
- Queue insertion function: `insertIntoQueue[ALGORITHM](queue, currentFloor, direction, newFloor) => newQueue`

The scheduler (src/algorithms/elevatorScheduler.js) provides `getAlgorithm()` and `insertIntoQueue()` helpers to access the correct algorithm based on mode.

### Queue Management

Elevator queues store objects, not just floor numbers:
```javascript
{
  floor: number,
  callDirection: 'up' | 'down' | null,
  timestamp: number,  // For performance metrics
  isPhantom: boolean  // SCAN algorithm uses phantom floors for extremes
}
```

### Manual vs Auto Mode

- **Manual mode** (`schedulingMode === 'manual'`): Calls added to pending `calls` array, user assigns to specific elevators
- **Auto mode** (any algorithm): Calls immediately assigned to best elevator via algorithm, no pending calls list

### Performance Metrics

The system tracks (in `useElevatorSystem`):
- Per-call wait times (timestamp at call → timestamp at service)
- Per-elevator statistics: trips completed, floors traveled, direction changes, time in each state
- Session-wide metrics: total calls served, average wait time

## Key Implementation Details

### SCAN Algorithm Extremes

SCAN algorithm adds "phantom floors" (isPhantom: true) to ensure elevators complete full sweeps:
- When going up with requests above: adds phantom floor at `numFloors`
- When going down with requests below: adds phantom floor at `1`
- Phantom floors are removed from queue but don't record wait time metrics

This is handled in `ensureSCANExtreme()` in useElevatorSystem.js

### Timer Management

Each elevator has exactly ONE active timer stored in `timersRef.current[elevatorId]`. When scheduling a new transition:
1. Clear existing timer for that elevator
2. Calculate delay based on current state
3. Set new timer that calls `transitionElevatorState(elevatorId)`

This pattern eliminates race conditions from multiple concurrent timers.

### Component Hierarchy

- `App.jsx`: Main layout with left sidebar, center visualization, right sidebar
- `BuildingVisualization.jsx`: Renders the building with floor buttons and elevators
- `ElevatorCar.jsx`: Individual elevator visualization with door animations
- `TabbedControlPanel.jsx`: Control panel with algorithm/config/instructions/statistics tabs
- `useElevatorSystem`: Custom hook managing all elevator logic

## Testing

Tests use Vitest with React Testing Library. Test files are colocated with source files (*.test.js).

The project uses jsdom environment for DOM testing. Setup file: src/test/setup.js

## Important Constraints

- Building: 2-24 floors, 2-12 elevators (configurable)
- Timing is configurable but defaults in src/constants/elevatorTiming.js
- Base path for GitHub Pages deployment: '/simple-elevator-simulator/'
- React 19.0.0 uses new features, ensure compatibility when adding dependencies

## Styling

Uses Tailwind CSS 4.0.17 with custom design system constants in src/styles/designSystem.js for consistent spacing, colors, and transitions.
