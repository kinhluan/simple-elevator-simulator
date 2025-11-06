# 🏢 Simple Elevator Simulator

A simple elevator scheduling simulator that visualizes and compares different elevator dispatch algorithms in real-time. Built for educational purposes and algorithm analysis.

![Simple Elevator Simulator](https://github.com/user-attachments/assets/5d9639f2-517a-42e3-9ea7-4d9a6c2e5da3)

## 📋 Overview

This interactive web application simulates a multi-elevator system in a building with configurable floors and elevators. Users can test and compare different scheduling algorithms to understand their behavior, efficiency, and trade-offs in various scenarios.

## ✨ Features

### Core Functionality
- **Configurable Building**: Set 2-24 floors and 2-12 elevators
- **Real-time Visualization**: Watch elevators move floor-by-floor with smooth animations
- **Multiple Operating Modes**:
  - **Manual Mode**: Manually assign calls to specific elevators
  - **Automatic Mode**: Algorithms automatically optimize elevator assignments

### Scheduling Algorithms

#### 1. **LOOK Algorithm** (Recommended)
- Elevators move in one direction, serving all requests in that direction
- Reverses direction only when no more requests exist ahead
- Optimal for overall system efficiency
- Similar to real-world elevator systems

#### 2. **SSTF (Shortest Seek Time First)**
- Always serves the nearest floor next, regardless of direction
- Minimizes immediate travel distance
- Fast response for nearby calls
- May cause starvation for distant floors

### User Interface
- **Building Visualization**: Visual representation of the building with floor numbers and call buttons
- **Queue Display**: View each elevator's upcoming stops in real-time
- **Control Panel**: Monitor elevator status, pending calls, and manual controls
- **Interactive Instructions**: Contextual help for each mode and algorithm

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher recommended)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/phatpham9/simple-elevator-simulator.git
cd simple-elevator-simulator
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:3000`

## 🎮 How to Use

### Manual Mode
1. Click the up/down buttons next to any floor to request an elevator
2. Pending calls appear in the Control Panel
3. Click on an elevator button to manually assign the call
4. You can also send elevators directly to specific floors using the floor buttons

### Automatic Mode (LOOK)
1. Select "Auto - LOOK Algorithm" from the Scheduling Mode dropdown
2. Click call buttons - elevators are automatically assigned
3. Watch the queue display to see optimized stop sequences
4. Elevators maintain direction until no more requests ahead

### Automatic Mode (SSTF)
1. Select "Auto - SSTF Algorithm" from the Scheduling Mode dropdown
2. Elevators always move to the nearest floor next
3. Observe how it handles clustered vs. distributed calls
4. Notice potential starvation of distant floors with high traffic

## 🏗️ Project Structure

```
src/
├── algorithms/
│   ├── elevatorScheduler.js    # Main algorithm entry point
│   ├── lookAlgorithm.js         # LOOK algorithm implementation
│   └── sstfAlgorithm.js         # SSTF algorithm implementation
├── components/
│   ├── Elevator.jsx             # Main container component
│   ├── ConfigurationPanel.jsx   # Configuration controls
│   ├── BuildingVisualization.jsx # Building and elevator visualization
│   ├── ElevatorCar.jsx          # Individual elevator car component
│   ├── ControlPanel.jsx         # Status and control interface
│   └── InstructionsPanel.jsx    # Usage instructions
├── hooks/
│   └── useElevatorSystem.js     # Core elevator logic and state management
├── utils/
│   └── elevatorUtils.js         # Utility functions
└── main.jsx                      # Application entry point
```

## 🔧 Adding New Algorithms

The architecture is designed for easy algorithm extension:

1. **Create algorithm file** in `src/algorithms/`:
```javascript
// src/algorithms/newAlgorithm.js
export const newAlgorithm = (elevators, callFloor, callDirection) => {
    // Your algorithm logic
    return bestElevatorId
}

export const insertIntoQueueNew = (queue, currentFloor, direction, newFloor) => {
    // Your queue insertion logic
    return newQueue
}
```

2. **Register in scheduler** (`src/algorithms/elevatorScheduler.js`):
```javascript
import { newAlgorithm, insertIntoQueueNew } from './newAlgorithm'

export const getAlgorithm = (mode) => {
    switch (mode) {
        case 'new': return newAlgorithm
        // ...
    }
}
```

3. **Add to UI** (`src/components/ConfigurationPanel.jsx`):
```jsx
<option value="new">Auto - New Algorithm</option>
```

4. **Update instructions** in `InstructionsPanel.jsx`

## 🛠️ Technologies

- **React** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **JavaScript** - Core logic

## 📊 Algorithm Comparison

| Algorithm | Direction Awareness | Efficiency | Fairness | Best Use Case |
|-----------|-------------------|------------|----------|---------------|
| **LOOK** | ✅ Yes | High | High | General purpose, realistic |
| **SSTF** | ❌ No | Medium | Low | Quick response, low traffic |

## 🎓 Educational Value

This simulator is ideal for:
- **Computer Science Education**: Teaching scheduling algorithms and operating systems concepts
- **Algorithm Analysis**: Comparing performance under different scenarios
- **System Design**: Understanding real-world elevator optimization
- **Human-Computer Interaction**: Studying user interface design for complex systems

## � Deployment

### Automatic Deployment to GitHub Pages

This project is configured with GitHub Actions for automatic deployment:

1. **Enable GitHub Pages**:
   - Go to your repository Settings → Pages
   - Under "Build and deployment", select **GitHub Actions** as the source

2. **Push to main branch**:
   ```bash
   git add .
   git commit -m "Your commit message"
   git push origin main
   ```

3. The workflow will automatically:
   - Install dependencies
   - Build the project
   - Deploy to GitHub Pages

4. **Access your deployed site**:
   - `https://phatpham9.github.io/simple-elevator-simulator/`

### Manual Deployment

You can also deploy manually using gh-pages:

```bash
npm run deploy
```

## �📝 License

This project is available for educational and non-commercial use.

## 🙏 Acknowledgments

> **Note:** Initial inspiration from [arunsai63/SmartLift](https://github.com/arunsai63/SmartLift)

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Add new scheduling algorithms
- Improve visualizations
- Enhance documentation
- Report bugs or suggest features

## 📧 Contact

For questions or feedback, please open an issue on GitHub.

---

Built with ❤️ for learning and exploration
