# SCAN Algorithm - Thuật Toán Quét Thang Máy

Tài liệu chi tiết về thuật toán SCAN (còn gọi là "Elevator Algorithm") - thuật toán lập lịch thang máy phổ biến nhất trong thực tế.

---

## 📋 Mục Lục

1. [Tổng Quan](#tổng-quan)
2. [Lịch Sử & Nguồn Gốc](#lịch-sử--nguồn-gốc)
3. [Nguyên Lý Hoạt Động](#nguyên-lý-hoạt-động)
4. [Implementation Chi Tiết](#implementation-chi-tiết)
5. [Phân Tích Thuật Toán](#phân-tích-thuật-toán)
6. [So Sánh Với Các Thuật Toán Khác](#so-sánh-với-các-thuật-toán-khác)
7. [Ứng Dụng Thực Tế](#ứng-dụng-thực-tế)
8. [Ví Dụ Minh Họa](#ví-dụ-minh-họa)
9. [Bài Tập Thực Hành](#bài-tập-thực-hành)
10. [Câu Hỏi Thường Gặp](#câu-hỏi-thường-gặp)

---

## 🎯 Tổng Quan

### Định Nghĩa

**SCAN Algorithm** (Thuật toán Quét) là một thuật toán lập lịch được sử dụng trong hệ thống thang máy, trong đó thang máy di chuyển theo một hướng (lên hoặc xuống) đến tận cùng (extreme) của tòa nhà, sau đó đảo ngược hướng và tiếp tục.

### Tên Gọi Khác

- **Elevator Algorithm** (Thuật toán Thang máy)
- **Elevator Seek Algorithm**
- **Directional Sweep Algorithm** (Thuật toán Quét Theo Hướng)

### Đặc Điểm Chính

```
┌─────────────────────────────────────────────┐
│ ✅ Fairness (Công bằng): Excellent         │
│ ⚡ Efficiency (Hiệu quả): Good             │
│ 🔒 Starvation Risk: None (Không có)        │
│ 📊 Predictability: Excellent                │
│ 🏢 Real-world Use: Industry Standard       │
└─────────────────────────────────────────────┘
```

### Tại Sao Gọi Là "Elevator Algorithm"?

SCAN được gọi là "Elevator Algorithm" vì nó mô phỏng cách hoạt động của thang máy trong thực tế:

> **"Thang máy không đột ngột đổi hướng. Nó tiếp tục đi theo hướng đã chọn cho đến khi hoàn thành tất cả yêu cầu ở hướng đó, sau đó mới quay lại."**

Điều này tạo ra trải nghiệm tự nhiên và dễ dự đoán cho người dùng.

---

## 📜 Lịch Sử & Nguồn Gốc

### Nguồn Gốc Từ Disk Scheduling

SCAN algorithm ban đầu được phát triển cho **disk scheduling** (lập lịch đĩa cứng) trong hệ điều hành:

**Vấn đề ban đầu** (1960s):
```
Đĩa cứng có đầu đọc di chuyển qua các track
Cần thuật toán để minimize seek time (thời gian tìm kiếm)
```

**Giải pháp SCAN**:
```
Đầu đọc di chuyển theo một hướng, phục vụ tất cả requests
Khi đến cuối đĩa, đảo ngược và quay lại
→ Giống như cách thang máy hoạt động!
```

### Áp Dụng Vào Elevator Systems

**1970s-1980s**:
- Các kỹ sư nhận ra SCAN phù hợp với elevator systems
- Đặt tên là "Elevator Algorithm" khi áp dụng vào disk scheduling
- Ngược lại, áp dụng disk SCAN vào thang máy thực tế

**Hiện nay**:
- SCAN là thuật toán **tiêu chuẩn công nghiệp** cho thang máy
- Được sử dụng trong > 90% hệ thống thang máy thương mại
- Các biến thể: C-SCAN, LOOK, C-LOOK

---

## ⚙️ Nguyên Lý Hoạt Động

### Core Principle (Nguyên lý cốt lõi)

```
1. Chọn một hướng (up hoặc down)
2. Di chuyển theo hướng đó, phục vụ tất cả requests trên đường đi
3. Đi đến EXTREME (tầng cao nhất hoặc thấp nhất)
4. Đảo ngược hướng
5. Lặp lại từ bước 2
```

**Key Point**: Thang máy PHẢI đi đến extreme ngay cả khi không có requests ở đó.

### Tại Sao Phải Đi Đến Extreme?

**Lý do 1: Fairness (Công bằng)**
```
Nếu không đi đến extreme:
- Requests gần trung tâm được phục vụ nhanh
- Requests ở extremes bị bỏ quên
→ Starvation problem
```

**Lý do 2: Predictability (Dự đoán được)**
```
Người dùng biết:
- Thang máy sẽ đến sau tối đa 2 sweeps (quét)
- Thời gian chờ maximum = 2 × (số tầng × thời gian/tầng)
```

**Lý do 3: Simplicity (Đơn giản)**
```
Logic đơn giản:
- Không cần decision phức tạp
- Dễ implement trong hardware/software
```

### Visualize: SCAN Flow

```
Tòa nhà 10 tầng, thang máy bắt đầu tại tầng 1

Step 1: Direction = UP
═══════════════════════════════════════════
Tầng 10  ←─────────────────── Extreme (MUST reach)
Tầng 9
Tầng 8   ← Request (phục vụ)
Tầng 7
Tầng 6
Tầng 5   ← Request (phục vụ)
Tầng 4
Tầng 3
Tầng 2
Tầng 1   ● Start
═══════════════════════════════════════════

Path: 1 → 2 → 3 → 4 → 5(serve) → 6 → 7 → 8(serve) → 9 → 10(extreme)


Step 2: Direction = DOWN (reversed)
═══════════════════════════════════════════
Tầng 10  ● Now here, reverse
Tầng 9
Tầng 8
Tầng 7
Tầng 6
Tầng 5
Tầng 4
Tầng 3   ← Request (phục vụ)
Tầng 2
Tầng 1   ←─────────────────── Extreme (MUST reach)
═══════════════════════════════════════════

Path: 10 → 9 → 8 → 7 → 6 → 5 → 4 → 3(serve) → 2 → 1(extreme)


Step 3: Direction = UP again
Loop continues...
```

---

## 💻 Implementation Chi Tiết

### Cấu Trúc Dữ Liệu

#### 1. Elevator State

```javascript
const elevator = {
  id: 0,                        // Elevator ID
  currentFloor: 5,              // Vị trí hiện tại
  direction: 'up',              // 'up' | 'down' | 'idle'
  targetFloor: 10,              // Tầng đích hiện tại

  queue: [                      // Hàng đợi các tầng cần phục vụ
    { floor: 7, callDirection: 'up', timestamp: 1699... },
    { floor: 10, callDirection: 'up', timestamp: 1699... }
  ],

  // Performance metrics
  tripsCompleted: 5,
  floorsTravel: 42,
  directionChanges: 3
}
```

#### 2. Queue Structure

Queue trong SCAN **PHẢI** được sắp xếp theo hướng:

```javascript
// Going UP: Ascending order (tăng dần)
if (direction === 'up') {
  queue.sort((a, b) => a.floor - b.floor)
  // Result: [3, 5, 7, 10, 15]
}

// Going DOWN: Descending order (giảm dần)
if (direction === 'down') {
  queue.sort((a, b) => b.floor - a.floor)
  // Result: [15, 10, 7, 5, 3]
}
```

**Lý do**: Thang máy phục vụ các tầng theo thứ tự gặp trên đường đi.

### Algorithm Implementation

#### Phase 1: Elevator Selection (Chọn Thang Máy)

Khi có request mới, chọn thang máy tốt nhất dựa trên **cost function**:

```javascript
/**
 * SCAN Algorithm: Select best elevator for a call
 * @param {Array} elevators - All elevators in building
 * @param {number} callFloor - Floor making the request
 * @param {string} callDirection - 'up' or 'down'
 * @param {number} maxFloor - Total floors in building
 * @returns {number} - ID of best elevator
 */
function scanAlgorithm(elevators, callFloor, callDirection, maxFloor) {
  let bestElevator = null
  let lowestCost = Infinity

  for (const elevator of elevators) {
    const cost = calculateCost(elevator, callFloor, callDirection, maxFloor)

    if (cost < lowestCost) {
      lowestCost = cost
      bestElevator = elevator
    }
  }

  return bestElevator ? bestElevator.id : null
}
```

#### Phase 2: Cost Calculation (Tính Chi Phí)

**Cost function** quyết định elevator nào phù hợp nhất:

```javascript
/**
 * Calculate cost for an elevator to serve a call
 * Lower cost = better match
 */
function calculateCost(elevator, callFloor, callDirection, maxFloor) {
  const { currentFloor, direction } = elevator

  // ════════════════════════════════════════════════════════
  // CASE 1: Elevator is IDLE
  // ════════════════════════════════════════════════════════
  if (direction === 'idle') {
    // Simple distance
    return Math.abs(currentFloor - callFloor)
  }

  // ════════════════════════════════════════════════════════
  // CASE 2: Elevator going UP
  // ════════════════════════════════════════════════════════
  if (direction === 'up') {

    // Sub-case 2a: Call is UP and AHEAD of elevator
    if (callFloor >= currentFloor && callDirection === 'up') {
      // ✅ Best case: Can pick up on the way
      // Cost = distance to call
      return callFloor - currentFloor

      // Example:
      // Elevator at floor 5, going up
      // Call at floor 8, going up
      // Cost = 8 - 5 = 3 floors
    }

    // Sub-case 2b: Call is DOWN or BEHIND elevator
    else {
      // ⚠️ Must complete sweep first
      // Cost = distance to top + distance from top to call
      const distanceToTop = maxFloor - currentFloor
      const distanceFromTopToCall = maxFloor - callFloor
      const penalty = 100  // Penalty for direction reversal

      return distanceToTop + distanceFromTopToCall + penalty

      // Example:
      // Elevator at floor 5, going up
      // Call at floor 3, going down
      // maxFloor = 20
      // Cost = (20-5) + (20-3) + 100 = 15 + 17 + 100 = 132
    }
  }

  // ════════════════════════════════════════════════════════
  // CASE 3: Elevator going DOWN
  // ════════════════════════════════════════════════════════
  if (direction === 'down') {

    // Sub-case 3a: Call is DOWN and AHEAD of elevator
    if (callFloor <= currentFloor && callDirection === 'down') {
      // ✅ Best case: Can pick up on the way
      return currentFloor - callFloor

      // Example:
      // Elevator at floor 10, going down
      // Call at floor 5, going down
      // Cost = 10 - 5 = 5 floors
    }

    // Sub-case 3b: Call is UP or BEHIND elevator
    else {
      // ⚠️ Must complete sweep first
      const distanceToBottom = currentFloor - 1
      const distanceFromBottomToCall = callFloor - 1
      const penalty = 100

      return distanceToBottom + distanceFromBottomToCall + penalty

      // Example:
      // Elevator at floor 10, going down
      // Call at floor 15, going up
      // Cost = (10-1) + (15-1) + 100 = 9 + 14 + 100 = 123
    }
  }

  // Fallback
  return Math.abs(currentFloor - callFloor)
}
```

**Cost Interpretation**:
```
Cost < 50:     Excellent match (same direction, close)
Cost 50-100:   Good match (same direction, far)
Cost > 100:    Poor match (needs reversal)
```

#### Phase 3: Queue Insertion (Thêm Vào Hàng Đợi)

Sau khi chọn elevator, thêm floor vào queue:

```javascript
/**
 * Insert floor into queue maintaining SCAN order
 */
function insertIntoQueueSCAN(queue, currentFloor, direction, newFloor) {
  // Edge case: Empty queue or idle
  if (queue.length === 0 || direction === 'idle') {
    return [newFloor]
  }

  // Clone queue
  const newQueue = [...queue]

  // Check duplicate
  if (newQueue.includes(newFloor)) {
    return newQueue
  }

  // Insert and sort based on direction
  newQueue.push(newFloor)

  if (direction === 'up') {
    // Ascending order: smallest to largest
    newQueue.sort((a, b) => a - b)

    // Example: [3, 5, 7, 10]
    // Insert 6 → [3, 5, 6, 7, 10]
  }
  else if (direction === 'down') {
    // Descending order: largest to smallest
    newQueue.sort((a, b) => b - a)

    // Example: [10, 7, 5, 3]
    // Insert 6 → [10, 7, 6, 5, 3]
  }

  return newQueue
}
```

#### Phase 4: Phantom Floors (Tầng Ảo)

**Vấn đề**: Làm sao ensure thang máy đi đến extreme?

**Giải pháp**: Thêm "phantom floors" vào queue.

```javascript
/**
 * Ensure SCAN goes to extreme by adding phantom floors
 */
function ensureSCANExtreme(queue, currentFloor, direction, numFloors) {
  if (!queue || queue.length === 0) return queue

  const newQueue = [...queue]

  // ════════════════════════════════════════════════════════
  // Going UP: Ensure we reach top floor
  // ════════════════════════════════════════════════════════
  if (direction === 'up') {
    const hasFloorsAbove = queue.some(q => q.floor > currentFloor)

    if (hasFloorsAbove) {
      const maxInQueue = Math.max(...queue.map(q => q.floor))

      // If max in queue < top floor, add phantom
      if (maxInQueue < numFloors) {
        newQueue.push({
          floor: numFloors,
          callDirection: null,
          timestamp: Date.now(),
          isPhantom: true  // Mark as phantom
        })
      }
    }
  }

  // ════════════════════════════════════════════════════════
  // Going DOWN: Ensure we reach bottom floor
  // ════════════════════════════════════════════════════════
  else if (direction === 'down') {
    const hasFloorsBelow = queue.some(q => q.floor < currentFloor)

    if (hasFloorsBelow) {
      const minInQueue = Math.min(...queue.map(q => q.floor))

      // If min in queue > floor 1, add phantom
      if (minInQueue > 1) {
        newQueue.push({
          floor: 1,
          callDirection: null,
          timestamp: Date.now(),
          isPhantom: true
        })
      }
    }
  }

  // Re-sort after adding phantom
  if (direction === 'up') {
    newQueue.sort((a, b) => a.floor - b.floor)
  } else {
    newQueue.sort((a, b) => b.floor - a.floor)
  }

  return newQueue
}
```

**Khi nào thêm phantom**:
```
Elevator at floor 5, going up
Queue: [7, 10]
maxFloor = 20

→ Add phantom floor 20
→ Queue becomes: [7, 10, 20]
→ Elevator will go: 5 → 7 → 10 → 20 (extreme!)
```

**Khi nào KHÔNG thêm phantom**:
```
Elevator at floor 5, going up
Queue: [7, 10, 20]  // Already includes top floor!

→ No phantom needed
→ Queue stays: [7, 10, 20]
```

**Loại bỏ phantom**:
```javascript
// When reaching a floor, remove it from queue
const reachedFloor = queue[0]

// Don't count phantom floors in metrics
if (!reachedFloor.isPhantom) {
  // Record wait time, update statistics
  recordMetrics(reachedFloor)
}

// Remove from queue (phantom or not)
queue = queue.slice(1)
```

#### Phase 5: Direction Reversal (Đảo Hướng)

Khi nào đảo hướng?

```javascript
/**
 * Determine if elevator should reverse direction
 */
function shouldReverse(elevator, maxFloor) {
  const { currentFloor, direction, queue } = elevator

  // No queue = stay idle
  if (queue.length === 0) {
    return { shouldReverse: false, newDirection: 'idle' }
  }

  // ════════════════════════════════════════════════════════
  // At TOP floor, going UP → reverse to DOWN
  // ════════════════════════════════════════════════════════
  if (currentFloor === maxFloor && direction === 'up') {
    return { shouldReverse: true, newDirection: 'down' }
  }

  // ════════════════════════════════════════════════════════
  // At BOTTOM floor, going DOWN → reverse to UP
  // ════════════════════════════════════════════════════════
  if (currentFloor === 1 && direction === 'down') {
    return { shouldReverse: true, newDirection: 'up' }
  }

  // ════════════════════════════════════════════════════════
  // Finished queue while going UP → reverse to DOWN
  // ════════════════════════════════════════════════════════
  if (direction === 'up' && queue.length > 0) {
    const nextFloor = queue[0].floor

    if (nextFloor < currentFloor) {
      // Next floor is below us → must have reached top
      return { shouldReverse: true, newDirection: 'down' }
    }
  }

  // ════════════════════════════════════════════════════════
  // Finished queue while going DOWN → reverse to UP
  // ════════════════════════════════════════════════════════
  if (direction === 'down' && queue.length > 0) {
    const nextFloor = queue[0].floor

    if (nextFloor > currentFloor) {
      // Next floor is above us → must have reached bottom
      return { shouldReverse: true, newDirection: 'up' }
    }
  }

  // Continue current direction
  return { shouldReverse: false, newDirection: direction }
}
```

---

## 📊 Phân Tích Thuật Toán

### Time Complexity (Độ Phức Tạp Thời Gian)

#### Worst Case (Trường hợp xấu nhất)

**Scenario**: Request ở tầng đối diện với hướng elevator hiện tại

```
Elevator: Tầng 1, going UP
Request: Tầng 1, going DOWN

Path:
1 → 2 → 3 → ... → 20 (top) → 19 → 18 → ... → 1 (serve)

Total: 38 floors (20 up + 19 down - 1)
```

**Formula**:
```
Worst-case wait = 2 × N floors
  where N = number of floors
```

**Time Complexity**: **O(N)**
- N = số tầng
- Linear với kích thước building

#### Best Case (Trường hợp tốt nhất)

**Scenario**: Request cùng hướng và ngay phía trước

```
Elevator: Tầng 5, going UP
Request: Tầng 6, going UP

Path: 5 → 6 (serve immediately)

Total: 1 floor
```

**Time Complexity**: **O(1)** - Constant time

#### Average Case (Trường hợp trung bình)

**Giả định**:
- Requests phân bố đều
- Elevator di chuyển liên tục

**Average wait time**:
```
Avg wait ≈ N/2 floors
  where N = number of floors
```

**Time Complexity**: **O(N)**

### Space Complexity (Độ Phức Tạp Không Gian)

**Queue Storage**:
```
Space = O(R)
  where R = number of pending requests
```

**Typical**: R << N (requests ít hơn nhiều so với số tầng)

**Per Elevator**:
```javascript
{
  id: 4 bytes,
  currentFloor: 4 bytes,
  direction: 4 bytes,
  queue: R × 16 bytes,  // R requests × 16 bytes each
  ...
}

Total per elevator ≈ 50 bytes + (R × 16 bytes)
```

**Multiple Elevators**:
```
Space = M × (50 + R × 16) bytes
  where M = number of elevators
```

### Throughput (Thông Lượng)

**Requests per hour**:
```
Throughput = (3600 / T_avg) × M elevators

where:
  T_avg = average time per trip (seconds)
  M = number of elevators
```

**Example**:
```
Building: 20 floors
Elevators: 4
T_avg: 45 seconds (estimate)

Throughput = (3600 / 45) × 4
           = 80 × 4
           = 320 requests/hour
```

---

## 🔄 So Sánh Với Các Thuật Toán Khác

### SCAN vs FCFS (First-Come-First-Served)

**FCFS**: Phục vụ theo thứ tự yêu cầu

| Aspect | SCAN | FCFS |
|--------|------|------|
| **Fairness** | ⭐⭐⭐⭐⭐ Excellent | ⭐⭐⭐ Fair |
| **Efficiency** | ⭐⭐⭐⭐ Good | ⭐⭐ Poor |
| **Starvation** | ✅ None | ✅ None |
| **Predictability** | ⭐⭐⭐⭐⭐ High | ⭐⭐⭐⭐⭐ High |
| **Implementation** | Medium | Simple |

**Ví dụ so sánh**:
```
Scenario:
Elevator at floor 10
Requests (in order): Floor 5, Floor 15, Floor 3

FCFS Path:
10 → 5 (serve) → 15 (serve) → 3 (serve)
Total: 5 + 10 + 12 = 27 floors
Direction changes: 2

SCAN Path (going down):
10 → 5 (serve) → 3 (serve) → 1 (extreme) → ... → 15 (serve)
Total: 5 + 2 + 2 + 14 = 23 floors
Direction changes: 1

→ SCAN more efficient (-15%)
```

### SCAN vs LOOK

**LOOK**: Như SCAN nhưng KHÔNG đi đến extreme

| Aspect | SCAN | LOOK |
|--------|------|------|
| **Fairness** | ⭐⭐⭐⭐⭐ Excellent | ⭐⭐⭐⭐ Very Good |
| **Efficiency** | ⭐⭐⭐⭐ Good | ⭐⭐⭐⭐⭐ Excellent |
| **Starvation** | ✅ None | ⚠️ Very rare |
| **Predictability** | ⭐⭐⭐⭐⭐ High | ⭐⭐⭐⭐ Good |
| **Extreme visits** | Always | Never |

**Ví dụ so sánh**:
```
Elevator at floor 5, going up
Queue: [7, 10]
maxFloor: 20

SCAN:
5 → 7 → 10 → 20 (extreme!) → reverse
Total: 15 floors UP

LOOK:
5 → 7 → 10 → reverse immediately
Total: 5 floors UP

→ LOOK saves 10 floors (67% more efficient)
```

**Khi nào SCAN tốt hơn LOOK**:
- High traffic (đông người)
- Need strict fairness guarantees
- Predictable max wait time required

**Khi nào LOOK tốt hơn SCAN**:
- Low to medium traffic
- Efficiency prioritized over fairness
- Energy saving important

### SCAN vs SSTF (Shortest Seek Time First)

**SSTF**: Luôn phục vụ tầng gần nhất

| Aspect | SCAN | SSTF |
|--------|------|------|
| **Fairness** | ⭐⭐⭐⭐⭐ | ⭐⭐ Poor |
| **Efficiency** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ (but risky) |
| **Starvation** | ✅ None | ❌ High risk |
| **Predictability** | ⭐⭐⭐⭐⭐ | ⭐⭐ Poor |
| **Production use** | ✅ Yes | ❌ No |

**Ví dụ starvation với SSTF**:
```
Elevator at floor 10
Initial request: Floor 20 (distance = 10)

Elevator starts moving to 20...
At floor 12:
  - New request: Floor 8 (distance = 4)
  - SSTF reverses to floor 8!

At floor 9:
  - New request: Floor 5 (distance = 4)
  - SSTF reverses to floor 5!

Floor 20 never gets served! (Starvation)

With SCAN:
10 → 12 → ... → 20 (serve floor 20 first)
Then reverse for floor 8 and 5
→ No starvation
```

### SCAN vs C-SCAN (Circular SCAN)

**C-SCAN**: Đi lên đến top, teleport về bottom, lặp lại

| Aspect | SCAN | C-SCAN |
|--------|------|--------|
| **Fairness** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ (better) |
| **Efficiency** | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| **Direction** | Bi-directional | Uni-directional |
| **Wait variance** | Higher | Lower |

**C-SCAN advantage**:
```
SCAN problem:
- Floors near middle served more frequently
- Floors at extremes wait longer

C-SCAN solution:
- All floors have similar wait times
- More uniform service distribution
```

**Ví dụ**:
```
SCAN (10-floor building):
UP: 1→2→3→4→5→6→7→8→9→10
DOWN: 10→9→8→7→6→5→4→3→2→1
Floors 5-6 served every ~10 floors
Floors 1,10 served every ~19 floors

C-SCAN:
UP: 1→2→3→4→5→6→7→8→9→10
TELEPORT: 10 → 1
UP: 1→2→3→4→5→6→7→8→9→10
All floors served every ~10 floors (uniform)
```

---

## 🏢 Ứng Dụng Thực Tế

### Commercial Buildings (Tòa Nhà Thương Mại)

**Scenario**: Office building, 30 tầng, 8 thang máy

**Tại sao dùng SCAN**:
1. **Peak hours (8-9 AM, 5-6 PM)**
   - Lưu lượng cực cao
   - Cần fairness guarantee
   - Predictable wait times

2. **Lunch time (12-1 PM)**
   - Bidirectional traffic (up & down)
   - SCAN handles well

3. **Normal hours**
   - Distributed traffic
   - SCAN provides consistent service

**Configuration**:
```javascript
{
  algorithm: 'SCAN',
  floors: 30,
  elevators: 8,

  // Group elevators by zones
  zones: [
    { elevators: [0,1,2], floors: [1,10] },   // Low-rise
    { elevators: [3,4,5], floors: [11,20] },  // Mid-rise
    { elevators: [6,7], floors: [21,30] }     // High-rise
  ],

  // Each zone runs SCAN independently
  perZoneSCAN: true
}
```

### Hospitals (Bệnh Viện)

**Scenario**: Hospital, 10 tầng, 4 thang máy

**Challenges**:
- Emergency requests (ưu tiên cao)
- Regular traffic
- Equipment transport

**Solution**: Modified SCAN với priority

```javascript
{
  algorithm: 'SCAN_with_priority',

  priorities: {
    emergency: 10,    // Highest
    staff: 5,
    visitor: 1
  },

  // Emergency overrides SCAN
  emergencyOverride: true,

  // After emergency, resume SCAN
  resumeSCAN: true
}
```

**Behavior**:
```
Normal SCAN operation:
Floor 5 → 6 → 7 → 8 → ...

EMERGENCY at floor 3:
Floor 5 → INTERRUPT → 3 (emergency) → resume at 5 → 6 → 7 → ...
```

### Residential Buildings (Chung Cư)

**Scenario**: Apartment building, 20 tầng, 3 thang máy

**Traffic patterns**:
- Morning (7-9 AM): Mostly DOWN (đi làm)
- Evening (6-8 PM): Mostly UP (về nhà)
- Other times: Random

**Optimization**: Adaptive SCAN

```javascript
{
  algorithm: 'adaptive_SCAN',

  // Morning: Prioritize DOWN direction
  morningMode: {
    time: '07:00-09:00',
    startDirection: 'down',
    downWeight: 1.5  // Prefer down requests
  },

  // Evening: Prioritize UP direction
  eveningMode: {
    time: '18:00-20:00',
    startDirection: 'up',
    upWeight: 1.5
  },

  // Other times: Standard SCAN
  normalMode: {
    algorithm: 'SCAN'
  }
}
```

### Shopping Malls (Trung Tâm Thương Mại)

**Scenario**: Mall, 5 tầng, 6 thang máy

**Characteristics**:
- Short building (5 floors)
- High volume traffic
- Peak: weekends

**Why SCAN works**:
```
Short sweeps:
- Max sweep = 5 floors
- Quick reversals
- High throughput

SCAN advantage over LOOK:
- Predictability > Efficiency
- Shoppers appreciate consistency
```

### Data Centers (Applied to Disk I/O)

SCAN ban đầu từ disk scheduling, vẫn được dùng:

**Modern SSDs**:
- Không có mechanical movement
- Nhưng vẫn dùng SCAN cho fairness

**HDD Arrays (RAID)**:
```javascript
{
  algorithm: 'SCAN',
  application: 'disk_scheduling',

  // Multiple disks = multiple elevators
  disks: [0, 1, 2, 3],

  // Tracks = floors
  tracks: 10000,

  // Seek time = travel time
  seekTimePerTrack: 0.1  // milliseconds
}
```

---

## 📐 Ví Dụ Minh Họa

### Ví Dụ 1: Basic SCAN (Cơ Bản)

**Setup**:
```
Building: 10 floors
Elevator: 1
Start: Floor 1, IDLE
```

**Requests** (in order):
```
1. Floor 5, UP
2. Floor 8, UP
3. Floor 3, DOWN
4. Floor 7, UP
```

**Execution**:

**Step 1**: Request tầng 5 UP
```
Elevator: Floor 1, IDLE
Action: Start moving UP
Queue: [5]

Path: 1 → 2 → 3 → 4 → 5 (SERVE)
```

**Step 2**: Request tầng 8 UP (khi đang tại tầng 3)
```
Elevator: Floor 3, going UP
Queue: [5]
New request: Floor 8, UP

Insert into queue (ascending):
Queue: [5, 8]

Path: 3 → 4 → 5 (SERVE) → 6 → 7 → 8 (SERVE)
```

**Step 3**: Request tầng 3 DOWN (khi đang tại tầng 6)
```
Elevator: Floor 6, going UP
Queue: [8]
New request: Floor 3, DOWN

Cost calculation:
- Going UP, must reach top first
- Cost = (10-6) + (10-3) + 100 = 111

Insert:
Queue: [8, 10(phantom)]

Path: 6 → 7 → 8 (SERVE) → 9 → 10 (extreme) → REVERSE
```

**Step 4**: Request tầng 7 UP (khi đang tại tầng 9 going UP)
```
Elevator: Floor 9, going UP
Queue: [10(phantom)]
New request: Floor 7, UP

Cost = high (opposite direction now)

Will be served on DOWN sweep:
Current: 9 → 10 (extreme) → REVERSE
Then: 10 → 9 → 8 → 7 (SERVE) → ... → 3 (SERVE) → ...
```

**Complete Timeline**:
```
Time  | Floor | Action           | Queue
------|-------|------------------|----------
0     | 1     | Request 5 UP     | [5]
5     | 5     | SERVE floor 5    | []
5     | 5     | Request 8 UP     | [8]
8     | 8     | SERVE floor 8    | []
9     | 9     | Request 3 DOWN   | [10p]
10    | 10    | Reach extreme    | []
10    | 10    | REVERSE          |
10    | 10    | Request 7 UP     | [7, 3]
11    | 7     | SERVE floor 7    | [3]
14    | 3     | SERVE floor 3    | []

Total time: 14 time units
Total floors traveled: 9 + 7 = 16 floors
Direction changes: 1
```

### Ví Dụ 2: Multiple Elevators

**Setup**:
```
Building: 15 floors
Elevators: 3
Start positions:
  - Elevator A: Floor 1, IDLE
  - Elevator B: Floor 8, going UP
  - Elevator C: Floor 12, going DOWN
```

**New Request**: Floor 10, going UP

**Cost Calculation**:

**Elevator A** (Floor 1, IDLE):
```
Cost = |1 - 10| = 9
```

**Elevator B** (Floor 8, going UP):
```
Same direction, ahead of elevator
Cost = 10 - 8 = 2 ✅ BEST
```

**Elevator C** (Floor 12, going DOWN):
```
Wrong direction, must complete sweep
Cost = (12-1) + (10-1) + 100 = 120
```

**Decision**: Assign to **Elevator B** (cost = 2)

**Elevator B's Path**:
```
Before: Queue = []
After: Queue = [10]

Path: 8 → 9 → 10 (SERVE)
```

### Ví Dụ 3: Rush Hour Simulation

**Scenario**: Office building, 8:30 AM, mọi người đến làm

**Setup**:
```
Floors: 20
Elevators: 4
All start at: Floor 1
```

**Requests** (simultaneous):
```
Floor 5, UP
Floor 7, UP
Floor 10, UP
Floor 12, UP
Floor 15, UP
Floor 18, UP
Floor 20, UP
Floor 3, UP
```

**Distribution Strategy** (SCAN):

**Elevator 1**:
```
Assigned: Floors 3, 5, 7
Queue: [3, 5, 7]
Path: 1 → 3(S) → 5(S) → 7(S) → 20(E) → reverse
```

**Elevator 2**:
```
Assigned: Floors 10, 12
Queue: [10, 12]
Path: 1 → 10(S) → 12(S) → 20(E) → reverse
```

**Elevator 3**:
```
Assigned: Floors 15, 18
Queue: [15, 18]
Path: 1 → 15(S) → 18(S) → 20(E) → reverse
```

**Elevator 4**:
```
Assigned: Floor 20
Queue: [20]
Path: 1 → 20(S) → reverse
```

**Results**:
```
Floor | Wait Time | Served By
------|-----------|----------
3     | 3s        | Elevator 1
5     | 5s        | Elevator 1
7     | 7s        | Elevator 1
10    | 10s       | Elevator 2
12    | 12s       | Elevator 2
15    | 15s       | Elevator 3
18    | 18s       | Elevator 3
20    | 20s       | Elevator 4

Average wait: 11.25s
Max wait: 20s
Balanced load: ✅
```

---

## 📝 Bài Tập Thực Hành

### Bài Tập 1: Tính Chi Phí (Cost Calculation)

**Đề bài**:

Tòa nhà 20 tầng có 3 thang máy:
- Elevator A: Tầng 5, going UP
- Elevator B: Tầng 15, going DOWN
- Elevator C: Tầng 10, IDLE

**Câu hỏi**: Tính cost cho mỗi elevator khi có request:
1. Floor 12, going UP
2. Floor 8, going DOWN
3. Floor 18, going UP

**Đáp án**:

**Request 1: Floor 12, UP**
```
Elevator A (Floor 5, UP):
  Same direction, ahead
  Cost = 12 - 5 = 7 ✅

Elevator B (Floor 15, DOWN):
  Wrong direction
  Cost = (15-1) + (12-1) + 100 = 125

Elevator C (Floor 10, IDLE):
  Cost = |10 - 12| = 2 ✅✅ BEST

Winner: Elevator C
```

**Request 2: Floor 8, DOWN**
```
Elevator A (Floor 5, UP):
  Wrong direction
  Cost = (20-5) + (20-8) + 100 = 127

Elevator B (Floor 15, DOWN):
  Same direction, ahead
  Cost = 15 - 8 = 7 ✅ BEST

Elevator C (Floor 10, IDLE):
  Cost = |10 - 8| = 2 ✅✅ BEST

Winner: Elevator C (closer)
```

**Request 3: Floor 18, UP**
```
Elevator A (Floor 5, UP):
  Same direction, ahead
  Cost = 18 - 5 = 13 ✅

Elevator B (Floor 15, DOWN):
  Wrong direction
  Cost = (15-1) + (18-1) + 100 = 131

Elevator C (Floor 10, IDLE):
  Cost = |10 - 18| = 8 ✅✅ BEST

Winner: Elevator C
```

### Bài Tập 2: Vẽ Lộ Trình (Path Drawing)

**Đề bài**:

Elevator tại tầng 6, going UP, queue = [9, 15]
Requests mới (theo thứ tự):
1. Floor 12, UP
2. Floor 4, DOWN
3. Floor 18, UP

**Câu hỏi**:
- Vẽ complete path của elevator
- Tính total floors traveled
- Đánh dấu direction changes

**Đáp án**:

**Initial State**:
```
Floor: 6
Direction: UP
Queue: [9, 15]
```

**Request 1**: Floor 12, UP
```
Insert into queue (ascending):
Queue: [9, 12, 15]
```

**Request 2**: Floor 4, DOWN
```
Wrong direction, will serve after reversal
Temp storage
```

**Request 3**: Floor 18, UP
```
Insert into queue:
Queue: [9, 12, 15, 18, 20(phantom)]
```

**Complete Path**:
```
Time | Floor | Action              | Queue
-----|-------|---------------------|----------------
0    | 6     | Start               | [9,12,15,18,20p]
3    | 9     | SERVE floor 9       | [12,15,18,20p]
6    | 12    | SERVE floor 12      | [15,18,20p]
9    | 15    | SERVE floor 15      | [18,20p]
12   | 18    | SERVE floor 18      | [20p]
14   | 20    | Reach extreme       | []
14   | 20    | ⟲ REVERSE           | [4]
20   | 4     | SERVE floor 4       | []

Floors traveled:
UP: 6→9→12→15→18→20 = 14 floors
DOWN: 20→4 = 16 floors
Total: 30 floors

Direction changes: 1 (at floor 20)
```

### Bài Tập 3: Optimize Configuration

**Đề bài**:

Bạn thiết kế hệ thống thang máy cho:
- Office building, 25 tầng
- Average 200 employees
- Peak hours: 8-9 AM (everyone comes), 5-6 PM (everyone leaves)

**Câu hỏi**:
1. Bao nhiêu elevators cần thiết?
2. Có nên dùng SCAN hay LOOK?
3. Có cần zone elevators không?

**Đáp án**:

**1. Số lượng elevators**:

**Calculation**:
```
Assume:
- Average trip time: 60s (25 floors)
- Each elevator can do: 60 trips/hour
- Peak hour: 200 people need elevator
- Each trip carries: ~5 people

Trips needed: 200 / 5 = 40 trips/hour

Elevators needed: 40 / 60 = 0.67 ≈ 1 elevator (minimum)

BUT add buffer for:
- Concurrent requests
- Waiting time minimization
- Redundancy

Recommended: 3-4 elevators
```

**2. SCAN vs LOOK**:

**Recommendation: SCAN**

**Lý do**:
```
Peak hours characteristics:
- High volume
- Need fairness (everyone wants elevator!)
- Predictability important (know max wait)

SCAN advantages:
✅ Fairness guarantee
✅ No starvation
✅ Predictable max wait: 2 × 25 × 1s = 50s

LOOK might:
⚠️ Slightly more efficient
❌ But less fair during peak
```

**3. Zoning**:

**Recommendation: YES, zone elevators**

**Configuration**:
```javascript
{
  zones: [
    {
      name: 'Low-rise',
      elevators: [0, 1],
      floors: [1, 12],
      algorithm: 'SCAN'
    },
    {
      name: 'High-rise',
      elevators: [2, 3],
      floors: [13, 25],
      algorithm: 'SCAN'
    }
  ],

  // Lobby (floor 1) served by all
  lobbyElevator: 'all'
}
```

**Benefits**:
```
✅ Faster service (shorter sweeps)
✅ Better load distribution
✅ Reduced wait times

Example:
Without zones:
  Request floor 25 from floor 1
  Worst: 1→25 = 24 floors

With zones:
  Use high-rise elevator
  Start from floor 13
  Only 12 floors max
```

---

## ❓ Câu Hỏi Thường Gặp

### Q1: Tại sao SCAN phải đi đến extreme ngay cả khi không có request?

**A**: Ba lý do chính:

**1. Fairness (Công bằng)**
```
Nếu không đi đến extreme:
- Floors gần giữa được serve nhiều
- Floors ở extremes bị starve

Example:
Building 20 floors, elevator ở giữa (floor 10)
Without extreme:
  - Floors 8-12: Served frequently
  - Floors 1-3, 18-20: Rarely served

With extreme:
  - All floors served equally every 2 sweeps
```

**2. Predictability (Dự đoán được)**
```
Users know:
- Max wait = 2 full sweeps
- Can calculate: 2 × 20 floors × 1s = 40s max

Real example:
"Thang máy sẽ đến trong 40s" vs "Không biết bao lâu"
→ User experience tốt hơn
```

**3. Simplicity (Đơn giản)**
```
Logic đơn giản:
- No complex decisions
- No edge cases
- Easy to implement in hardware/software

Alternative (like LOOK):
- Need to check "còn request phía trước không?"
- More complex logic
- More bugs possible
```

### Q2: Phantom floors có ảnh hưởng đến performance không?

**A**: **KHÔNG** ảnh hưởng đáng kể.

**Lý do**:

```javascript
// Phantom floor được skip nhanh
if (floor.isPhantom) {
  // No door operations
  // No passenger loading
  // Just reverse direction

  time_at_phantom = 0s (instant reverse)
}

// Real floor
if (!floor.isPhantom) {
  door_open: 2.5s
  door_hold: 3s
  door_close: 2s

  time_at_real_floor = 7.5s
}
```

**Impact**:
```
With phantom: 0s overhead
Without phantom: Risk of not going to extreme → unfairness

Trade-off: Worth it for fairness guarantee
```

### Q3: SCAN có phù hợp với mọi building không?

**A**: **KHÔNG**. Depends on building type.

**Phù hợp** ✅:
```
1. High-rise buildings (>10 floors)
   - Long sweeps justify extreme visits

2. High traffic buildings
   - Office buildings
   - Hotels
   - Hospitals

3. Need fairness
   - Public buildings
   - Government offices
```

**Không phù hợp** ❌:
```
1. Low-rise buildings (<5 floors)
   - LOOK more efficient
   - Extreme visits wasteful

2. Low traffic
   - Residential (off-peak)
   - Efficiency > Fairness

3. Special requirements
   - Emergency-only elevators
   - Freight elevators (use FCFS)
```

### Q4: Làm sao optimize SCAN cho peak hours?

**A**: Nhiều strategies:

**Strategy 1: Group Control**
```javascript
// During peak UP (morning)
elevators.forEach(e => {
  if (e.direction === 'idle') {
    e.direction = 'up'  // Pre-position
    e.startFloor = 1    // Wait at lobby
  }
})
```

**Strategy 2: Zone Assignment**
```javascript
peakHours: {
  time: '08:00-09:00',
  mode: 'zone',
  zones: {
    low: { elevators: [0,1], floors: [1,10] },
    mid: { elevators: [2,3], floors: [11,20] },
    high: { elevators: [4,5], floors: [21,30] }
  }
}
```

**Strategy 3: Express Mode**
```javascript
// Some elevators skip floors
elevator[0]: {
  floors: [1, 5, 10, 15, 20, 25, 30],  // Express
  algorithm: 'SCAN'
}

elevator[1-4]: {
  floors: [1...30],  // Local
  algorithm: 'SCAN'
}
```

### Q5: SCAN có variants nào?

**A**: Nhiều variants:

**C-SCAN (Circular SCAN)**:
```
Normal SCAN:
UP: 1→20, DOWN: 20→1

C-SCAN:
UP: 1→20, TELEPORT: 20→1, UP: 1→20...
Always one direction

Advantage: More uniform wait times
```

**LOOK**:
```
Like SCAN but:
- Don't go to extreme
- Reverse when no more requests

Advantage: More efficient
Disadvantage: Less fair
```

**N-Step-SCAN**:
```
Batch requests into groups
Process N requests, then accept new ones

Advantage: Prevents starvation from continuous requests
```

**FSCAN (Freeze SCAN)**:
```
Two queues:
- Active: Being served
- Waiting: New requests

After sweep, swap queues

Advantage: Bounded wait time
```

### Q6: Source code ở đâu trong project?

**A**:

```
Main implementation:
/src/algorithms/scanAlgorithm.js

Key functions:
- scanAlgorithm()        // Elevator selection
- calculateCost()        // Cost calculation
- insertIntoQueueSCAN()  // Queue management

Integration:
/src/hooks/useElevatorSystem.js
- ensureSCANExtreme()    // Phantom floor logic
- Line 264-266           // SCAN extreme handling

Tests:
/src/algorithms/scanAlgorithm.test.js
- 227 lines of tests
- Edge cases covered
```

### Q7: Làm sao test SCAN behavior trong simulator?

**A**: Follow scenario này:

**Test 1: Extreme behavior**
```
1. Config: 10 floors, 1 elevator, SCAN
2. Elevator at floor 1, IDLE
3. Call floor 5 UP
4. Wait until elevator at floor 3
5. Call floor 3 DOWN
6. Observe: Elevator continues to 5 → 10 (extreme!) → reverse → 3
✅ Confirms extreme visit
```

**Test 2: Fairness**
```
1. Config: 20 floors, 2 elevators
2. Create 10 random requests
3. Check statistics:
   - Max wait time < 2 × 20 = 40s ✅
   - No request ignored ✅
```

**Test 3: Cost calculation**
```
1. Manual mode
2. Note elevator positions
3. Calculate expected costs manually
4. Switch to AUTO (SCAN)
5. Check which elevator was chosen
✅ Verify cost function works
```

---

## 📚 Tài Liệu Tham Khảo

### Academic Papers

1. **Denning, P. J.** (1967). "Effects of scheduling on file memory operations." *AFIPS Proceedings*, 9-21.
   - Original SCAN algorithm paper

2. **Geist, R., & Daniel, S.** (1987). "A continuum of disk scheduling algorithms." *ACM Transactions on Computer Systems*, 5(1), 77-92.
   - Comprehensive analysis of SCAN variants

3. **Barney, G. C.** (2003). *Elevator Traffic Handbook: Theory and Practice*.
   - Industry standard for elevator systems

### Online Resources

- [Wikipedia: Elevator Algorithm](https://en.wikipedia.org/wiki/Elevator_algorithm)
- [OS Dev: Disk Scheduling](https://wiki.osdev.org/Disk_Scheduling)
- [Elevator Saga Game](https://play.elevatorsaga.com/) - Interactive learning

### Books

- **Silberschatz, Galvin, Gagne** (2018). *Operating System Concepts* (10th ed.)
  - Chapter 9: Mass-Storage Structure

- **Tanenbaum, A. S.** (2014). *Modern Operating Systems* (4th ed.)
  - Section on I/O scheduling

---

## 🎓 Tóm Tắt

### Key Takeaways

1. ✅ **SCAN = Fairness + Predictability**
   - Đảm bảo mọi request được serve
   - Max wait time dự đoán được

2. ⚡ **Must Go to Extreme**
   - Không phải bug, là feature!
   - Ensure fairness và prevent starvation

3. 🏢 **Industry Standard**
   - Used in >90% commercial elevators
   - Proven in real-world

4. 📊 **Trade-offs**
   - Fairness ✅ / Efficiency ⚠️
   - Better than SSTF, less efficient than LOOK

5. 🔧 **Customizable**
   - Variants: C-SCAN, LOOK, FSCAN
   - Can optimize for specific buildings

### Khi Nào Dùng SCAN?

✅ **Dùng khi**:
- High-rise buildings (>10 floors)
- High traffic
- Fairness required
- Predictability important

❌ **Không dùng khi**:
- Low-rise (<5 floors) → use LOOK
- Low traffic → use LOOK
- Emergency-only → use priority-based

---

**Chúc bạn học tốt! 🚀**

*Document version: 1.0*
*Last updated: 2025-11-08*
*Phản hồi: [GitHub Issues](https://github.com/kinhluan/simple-elevator-simulator/issues)*
