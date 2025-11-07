# 🏢 Simple Elevator Simulator

An interactive elevator scheduling simulator that visualizes and compares different elevator dispatch algorithms in real-time.

![Simple Elevator Simulator](docs/screenshots/simple-elevator-simulator.png)

## Features

- **Configurable Building**: 2-24 floors, 2-12 elevators
- **Real-time Visualization**: Watch elevators move with door animations
- **3 Scheduling Algorithms**:
  - **SCAN** ⭐ (Recommended): Industry standard, moves in one direction to extreme then reverses
  - **LOOK**: Reverses when no more requests ahead (more efficient than SCAN)
  - **SSTF**: Serves nearest floor first (educational purposes, can cause starvation)
- **Manual & Automatic Modes**: Manual assignment or algorithm-based dispatch
- **Configurable Timing**: Adjust travel time, door open/close speeds

## Getting Started

### Prerequisites
- Node.js v20.0.0+
- npm v10.0.0+

### Installation

```bash
git clone https://github.com/phatpham9/simple-elevator-simulator.git
cd simple-elevator-simulator
npm install
npm run dev
```

Open browser to `http://localhost:5173`

## Usage

**Manual Mode**: Click floor buttons to request elevators, then manually assign to specific cars

**Automatic Mode**: Select an algorithm (SCAN/LOOK/SSTF) and click floor buttons - elevators are automatically dispatched

**Configure**: Adjust building size and timing in the Config panel

## Project Structure

```
src/
├── algorithms/          # Scheduling algorithm implementations
│   ├── elevatorScheduler.js
│   ├── scanAlgorithm.js
│   ├── lookAlgorithm.js
│   └── sstfAlgorithm.js
├── components/          # React UI components
├── hooks/              # useElevatorSystem.js
├── constants/          # elevatorTiming.js
├── styles/             # designSystem.js
└── utils/              # elevatorUtils.js
```

## Technologies

- **React 19.0.0** - UI framework
- **Vite 6.2.0** - Build tool and dev server
- **Tailwind CSS 4.0.17** - Utility-first CSS
- **JavaScript (ES6+)** - Core logic
- **ESLint 9.21.0** - Code quality

## Algorithm Comparison

| Algorithm | Direction | Fairness | Efficiency | Starvation Risk | Real-world Use |
|-----------|-----------|----------|------------|-----------------|----------------|
| **SCAN** ⭐ | ✅ Yes | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | None | ✅ Standard |
| **LOOK** | ✅ Yes | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | Very Low | ⚠️ Rare |
| **SSTF** | ❌ No | ⭐⭐ | ⭐⭐⭐ | High | ❌ No |

**When to use:**
- **SCAN**: Production systems, high traffic (most predictable, no starvation)
- **LOOK**: Variable traffic patterns (more efficient, avoids empty extremes)
- **SSTF**: Education only (demonstrates starvation problems)

## Deployment

Deploy to GitHub Pages:
```bash
npm run deploy
```

Build for production:
```bash
npm run build
```

## License

MIT License

## Acknowledgments

Initial inspiration from [arunsai63/SmartLift](https://github.com/arunsai63/SmartLift)
