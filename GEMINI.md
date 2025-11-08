# GEMINI.md

## Project Overview

This project is an interactive elevator scheduling simulator built with React and Vite. It provides a real-time visualization of elevator movements and allows users to compare different elevator dispatch algorithms. The primary purpose is for educational use and algorithm analysis.

The application is a single-page React application. The core logic is encapsulated in the `useElevatorSystem` custom hook, which manages the state of the elevators and calls. The UI is built with React components and styled with Tailwind CSS.

The main technologies used are:
- **React 19.0.0**: For building the user interface.
- **Vite 6.2.0**: As the build tool and development server.
- **Tailwind CSS 4.0.17**: For styling the application.
- **JavaScript (ES6+)**: For the core logic.
- **Vitest**: For running tests.

## Building and Running

### Prerequisites
- Node.js v20.0.0+
- npm v10.0.0+

### Installation and Development

1.  **Install dependencies:**
    ```bash
    npm install
    ```

2.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:5173`.

### Building for Production

To create a production build, run:
```bash
npm run build
```
The output will be in the `dist` directory.

### Running Tests

To run the tests, use the following command:
```bash
npm run test
```

To run the tests with a UI, use:
```bash
npm run test:ui
```

To generate a coverage report, run:
```bash
npm run test:coverage
```

## Development Conventions

- The project follows standard React best practices.
- The codebase is organized into components, hooks, constants, algorithms, and utils.
- State management is handled through React hooks, primarily `useState`, `useEffect`, and the custom `useElevatorSystem` hook.
- The scheduling algorithms (SCAN, LOOK, SSTF) are implemented in their own modules within the `src/algorithms` directory.
- Code quality is maintained with ESLint.
