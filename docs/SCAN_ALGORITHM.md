# Thuật Toán SCAN (SCAN Algorithm) - Thuật Toán Lập Lịch Thang Máy (Elevator Scheduling Algorithm)

Tài liệu chi tiết về thuật toán SCAN (SCAN Algorithm) - còn gọi là "Thuật toán Thang máy (Elevator Algorithm)" - thuật toán lập lịch thang máy (elevator scheduling algorithm) phổ biến nhất trong thực tế.

---

## 📋 Mục Lục (Table of Contents)

1. [Tổng Quan (Overview)](#tổng-quan-overview)
2. [Lịch Sử & Nguồn Gốc (History & Origins)](#lịch-sử--nguồn-gốc-history--origins)
3. [Nguyên Lý Hoạt Động (Operating Principles)](#nguyên-lý-hoạt-động-operating-principles)
4. [Triển Khai Chi Tiết (Detailed Implementation)](#triển-khai-chi-tiết-detailed-implementation)
5. [Phân Tích Thuật Toán (Algorithm Analysis)](#phân-tích-thuật-toán-algorithm-analysis)
6. [So Sánh Với Các Thuật Toán Khác (Comparison with Other Algorithms)](#so-sánh-với-các-thuật-toán-khác-comparison-with-other-algorithms)
7. [Ứng Dụng Thực Tế (Real-world Applications)](#ứng-dụng-thực-tế-real-world-applications)
8. [Ví Dụ Minh Họa (Examples)](#ví-dụ-minh-họa-examples)
9. [Bài Tập Thực Hành (Exercises)](#bài-tập-thực-hành-exercises)
10. [Câu Hỏi Thường Gặp (FAQ)](#câu-hỏi-thường-gặp-faq)

---

## 🎯 Tổng Quan (Overview)

### Định Nghĩa (Definition)

**Thuật toán SCAN (SCAN Algorithm)** là một thuật toán lập lịch (scheduling algorithm) được sử dụng trong hệ thống thang máy (elevator systems), trong đó thang máy di chuyển theo một hướng (direction) - lên hoặc xuống - đến tận cùng (extreme) của tòa nhà, sau đó đảo ngược hướng và tiếp tục.

### Tên Gọi Khác (Alternative Names)

- **Thuật toán Thang máy (Elevator Algorithm)**
- **Thuật toán Tìm kiếm Thang máy (Elevator Seek Algorithm)**
- **Thuật toán Quét Theo Hướng (Directional Sweep Algorithm)**

### Đặc Điểm Chính (Key Characteristics)

```
┌─────────────────────────────────────────────┐
│ ✅ Công bằng (Fairness): Xuất sắc          │
│ ⚡ Hiệu quả (Efficiency): Tốt              │
│ 🔒 Nguy cơ bị bỏ đói (Starvation Risk): Không có │
│ 📊 Khả năng dự đoán (Predictability): Xuất sắc │
│ 🏢 Ứng dụng thực tế (Real-world Use): Tiêu chuẩn công nghiệp │
└─────────────────────────────────────────────┘
```

### Tại Sao Gọi Là "Thuật Toán Thang máy (Elevator Algorithm)"?

SCAN được gọi là "Thuật toán Thang máy (Elevator Algorithm)" vì nó mô phỏng cách hoạt động của thang máy trong thực tế:

> **"Thang máy không đột ngột đổi hướng. Nó tiếp tục đi theo hướng (direction) đã chọn cho đến khi hoàn thành tất cả yêu cầu (requests) ở hướng đó, sau đó mới quay lại."**

Điều này tạo ra trải nghiệm tự nhiên và dễ dự đoán (predictable) cho người dùng.

---

## 📜 Lịch Sử & Nguồn Gốc (History & Origins)

### Nguồn Gốc Từ Lập Lịch Đĩa Cứng (Disk Scheduling)

Thuật toán SCAN (SCAN Algorithm) ban đầu được phát triển cho **lập lịch đĩa cứng (disk scheduling)** trong hệ điều hành (operating systems):

**Vấn đề ban đầu (Initial Problem)** (1960s):

```
Đĩa cứng có đầu đọc (read head) di chuyển qua các track
Cần thuật toán để giảm thiểu thời gian tìm kiếm (minimize seek time)
```

**Giải pháp SCAN (SCAN Solution)**:

```
Đầu đọc di chuyển theo một hướng (direction), phục vụ tất cả requests
Khi đến cuối đĩa, đảo ngược và quay lại
→ Giống như cách thang máy hoạt động!
```

### Áp Dụng Vào Hệ Thống Thang Máy (Elevator Systems)

**1970s-1980s**:

- Các kỹ sư nhận ra SCAN phù hợp với hệ thống thang máy (elevator systems)
- Đặt tên là "Thuật toán Thang máy (Elevator Algorithm)" khi áp dụng vào lập lịch đĩa cứng (disk scheduling)
- Ngược lại, áp dụng SCAN của đĩa cứng vào thang máy thực tế

**Hiện nay (Present Day)**:

- SCAN là thuật toán **tiêu chuẩn công nghiệp (industry standard)** cho thang máy
- Được sử dụng trong > 90% hệ thống thang máy (elevator systems) thương mại
- Các biến thể (variants): C-SCAN, LOOK, C-LOOK

---

## ⚙️ Nguyên Lý Hoạt Động (Operating Principles)

### Nguyên Lý Cốt Lõi (Core Principle)

```
1. Chọn một hướng (direction) - up hoặc down
2. Di chuyển theo hướng đó, phục vụ tất cả requests (yêu cầu) trên đường đi
3. Đi đến điểm tận cùng (extreme) - tầng cao nhất hoặc thấp nhất
4. Đảo ngược hướng (reverse direction)
5. Lặp lại từ bước 2
```

**Điểm chính (Key Point)**: Thang máy PHẢI đi đến điểm tận cùng (extreme) ngay cả khi không có yêu cầu (requests) ở đó.

### Tại Sao Phải Đi Đến Điểm Tận Cùng (Extreme)?

**Lý do 1: Công bằng (Fairness)**

```
Nếu không đi đến extreme:
- Requests (yêu cầu) gần trung tâm được phục vụ nhanh
- Requests ở extremes (điểm tận cùng) bị bỏ quên
→ Vấn đề bỏ đói (starvation problem)
```

**Lý do 2: Khả năng dự đoán (Predictability)**

```
Người dùng biết:
- Thang máy sẽ đến sau tối đa 2 lần quét (sweeps)
- Thời gian chờ tối đa = 2 × (số tầng × thời gian/tầng)
```

**Lý do 3: Đơn giản (Simplicity)**

```
Logic đơn giản:
- Không cần quyết định phức tạp
- Dễ triển khai (implementation) trong hardware/software
```

### Trực Quan Hóa: Luồng SCAN (SCAN Flow)

```
Tòa nhà 10 tầng, thang máy bắt đầu tại tầng 1

Bước 1: Hướng (Direction) = LÊN (UP)
═══════════════════════════════════════════
Tầng 10  ←─────────────────── Extreme (điểm tận cùng) - PHẢI đến
Tầng 9
Tầng 8   ← Request (yêu cầu) - phục vụ
Tầng 7
Tầng 6
Tầng 5   ← Request (yêu cầu) - phục vụ
Tầng 4
Tầng 3
Tầng 2
Tầng 1   ● Bắt đầu
═══════════════════════════════════════════

Đường đi: 1 → 2 → 3 → 4 → 5(phục vụ) → 6 → 7 → 8(phục vụ) → 9 → 10(extreme)


Bước 2: Hướng (Direction) = XUỐNG (DOWN) - đã đảo chiều
═══════════════════════════════════════════
Tầng 10  ● Hiện tại ở đây, đảo chiều
Tầng 9
Tầng 8
Tầng 7
Tầng 6
Tầng 5
Tầng 4
Tầng 3   ← Request (yêu cầu) - phục vụ
Tầng 2
Tầng 1   ←─────────────────── Extreme (điểm tận cùng) - PHẢI đến
═══════════════════════════════════════════

Đường đi: 10 → 9 → 8 → 7 → 6 → 5 → 4 → 3(phục vụ) → 2 → 1(extreme)


Bước 3: Hướng (Direction) = LÊN (UP) lại
Vòng lặp tiếp tục...
```

---

## 💻 Triển Khai Chi Tiết (Detailed Implementation)

### Cấu Trúc Dữ Liệu (Data Structures)

#### 1. Trạng Thái Thang Máy (Elevator State)

```javascript
const elevator = {
  id: 0,                        // ID thang máy
  currentFloor: 5,              // Vị trí hiện tại (current position)
  direction: 'up',              // Hướng (direction): 'up' | 'down' | 'idle'
  targetFloor: 10,              // Tầng đích hiện tại (target floor)

  queue: [                      // Hàng đợi (queue) các tầng cần phục vụ
    { floor: 7, callDirection: 'up', timestamp: 1699... },
    { floor: 10, callDirection: 'up', timestamp: 1699... }
  ],

  // Các số liệu hiệu suất (performance metrics)
  tripsCompleted: 5,
  floorsTravel: 42,
  directionChanges: 3
}
```

#### 2. Cấu Trúc Hàng Đợi (Queue Structure)

Hàng đợi (Queue) trong SCAN **PHẢI** được sắp xếp theo hướng (direction):

```javascript
// Đi LÊN (UP): Thứ tự tăng dần (ascending order)
if (direction === 'up') {
  queue.sort((a, b) => a.floor - b.floor)
  // Kết quả (result): [3, 5, 7, 10, 15]
}

// Đi XUỐNG (DOWN): Thứ tự giảm dần (descending order)
if (direction === 'down') {
  queue.sort((a, b) => b.floor - a.floor)
  // Kết quả (result): [15, 10, 7, 5, 3]
}
```

**Lý do (Reason)**: Thang máy phục vụ các tầng theo thứ tự gặp trên đường đi.

### Triển Khai Thuật Toán (Algorithm Implementation)

#### Giai Đoạn 1: Chọn Thang Máy (Elevator Selection)

Khi có yêu cầu mới (new request), chọn thang máy tốt nhất dựa trên **hàm chi phí (cost function)**:

```javascript
/**
 * Thuật toán SCAN (SCAN Algorithm): Chọn thang máy tốt nhất cho một lệnh gọi
 * @param {Array} elevators - Tất cả thang máy trong tòa nhà
 * @param {number} callFloor - Tầng đang yêu cầu
 * @param {string} callDirection - 'up' hoặc 'down'
 * @param {number} maxFloor - Tổng số tầng trong tòa nhà
 * @returns {number} - ID của thang máy tốt nhất
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

#### Giai Đoạn 2: Tính Chi Phí (Cost Calculation)

**Hàm chi phí (Cost function)** quyết định thang máy nào phù hợp nhất:

```javascript
/**
 * Tính chi phí (cost) cho một thang máy để phục vụ một lệnh gọi (call request)
 * Chi phí thấp hơn (lower cost) = khớp tốt hơn (better match)
 */
function calculateCost(elevator, callFloor, callDirection, maxFloor) {
  const { currentFloor, direction } = elevator

  // ════════════════════════════════════════════════════════
  // TRƯỜNG HỢP 1 (CASE 1): Thang máy đang RẢNH (IDLE)
  // ════════════════════════════════════════════════════════
  if (direction === 'idle') {
    // Khoảng cách đơn giản (simple distance)
    return Math.abs(currentFloor - callFloor)
  }

  // ════════════════════════════════════════════════════════
  // TRƯỜNG HỢP 2 (CASE 2): Thang máy đang đi LÊN (UP)
  // ════════════════════════════════════════════════════════
  if (direction === 'up') {

    // Trường hợp con 2a (Sub-case 2a): Lệnh gọi hướng LÊN và Ở PHÍA TRƯỚC thang máy
    if (callFloor >= currentFloor && callDirection === 'up') {
      // ✅ Trường hợp tốt nhất (best case): Có thể đón trên đường đi
      // Chi phí (cost) = khoảng cách đến lệnh gọi
      return callFloor - currentFloor

      // Ví dụ (example):
      // Thang máy ở tầng 5, đang đi lên
      // Lệnh gọi (call request) tại tầng 8, hướng lên
      // Chi phí (cost) = 8 - 5 = 3 tầng
    }

    // Trường hợp con 2b (Sub-case 2b): Lệnh gọi hướng XUỐNG hoặc Ở PHÍA SAU thang máy
    else {
      // ⚠️ Phải hoàn thành quét trước (must complete sweep first)
      // Chi phí (cost) = khoảng cách đến đỉnh + khoảng cách từ đỉnh đến lệnh gọi
      const distanceToTop = maxFloor - currentFloor
      const distanceFromTopToCall = maxFloor - callFloor
      const penalty = 100  // Phạt (penalty) cho việc đảo chiều

      return distanceToTop + distanceFromTopToCall + penalty

      // Ví dụ (example):
      // Thang máy ở tầng 5, đang đi lên
      // Lệnh gọi tại tầng 3, hướng xuống
      // maxFloor = 20
      // Chi phí (cost) = (20-5) + (20-3) + 100 = 15 + 17 + 100 = 132
    }
  }

  // ════════════════════════════════════════════════════════
  // TRƯỜNG HỢP 3 (CASE 3): Thang máy đang đi XUỐNG (DOWN)
  // ════════════════════════════════════════════════════════
  if (direction === 'down') {

    // Trường hợp con 3a (Sub-case 3a): Lệnh gọi hướng XUỐNG và Ở PHÍA TRƯỚC thang máy
    if (callFloor <= currentFloor && callDirection === 'down') {
      // ✅ Trường hợp tốt nhất (best case): Có thể đón trên đường đi
      return currentFloor - callFloor

      // Ví dụ (example):
      // Thang máy ở tầng 10, đang đi xuống
      // Lệnh gọi tại tầng 5, hướng xuống
      // Chi phí (cost) = 10 - 5 = 5 tầng
    }

    // Trường hợp con 3b (Sub-case 3b): Lệnh gọi hướng LÊN hoặc Ở PHÍA SAU thang máy
    else {
      // ⚠️ Phải hoàn thành quét trước (must complete sweep first)
      const distanceToBottom = currentFloor - 1
      const distanceFromBottomToCall = callFloor - 1
      const penalty = 100

      return distanceToBottom + distanceFromBottomToCall + penalty

      // Ví dụ (example):
      // Thang máy ở tầng 10, đang đi xuống
      // Lệnh gọi tại tầng 15, hướng lên
      // Chi phí (cost) = (10-1) + (15-1) + 100 = 9 + 14 + 100 = 123
    }
  }

  // Fallback
  return Math.abs(currentFloor - callFloor)
}
```

**Diễn giải chi phí (Cost Interpretation)**:

```
Chi phí (cost) < 50:     Khớp xuất sắc (excellent match) - cùng hướng, gần
Chi phí (cost) 50-100:   Khớp tốt (good match) - cùng hướng, xa
Chi phí (cost) > 100:    Khớp kém (poor match) - cần đảo chiều
```

#### Giai Đoạn 3: Chèn Vào Hàng Đợi (Queue Insertion)

Sau khi chọn thang máy, thêm tầng vào hàng đợi (queue):

```javascript
/**
 * Chèn tầng vào hàng đợi (queue) duy trì thứ tự SCAN (SCAN order)
 */
function insertIntoQueueSCAN(queue, currentFloor, direction, newFloor) {
  // Trường hợp đặc biệt (special case): Hàng đợi trống hoặc rảnh
  if (queue.length === 0 || direction === 'idle') {
    return [newFloor]
  }

  // Sao chép hàng đợi (copy queue)
  const newQueue = [...queue]

  // Kiểm tra trùng lặp (check duplicates)
  if (newQueue.includes(newFloor)) {
    return newQueue
  }

  // Chèn và sắp xếp dựa trên hướng (direction)
  newQueue.push(newFloor)

  if (direction === 'up') {
    // Thứ tự tăng dần (ascending order): nhỏ nhất đến lớn nhất
    newQueue.sort((a, b) => a - b)

    // Ví dụ (example): [3, 5, 7, 10]
    // Chèn 6 → [3, 5, 6, 7, 10]
  }
  else if (direction === 'down') {
    // Thứ tự giảm dần (descending order): lớn nhất đến nhỏ nhất
    newQueue.sort((a, b) => b - a)

    // Ví dụ (example): [10, 7, 5, 3]
    // Chèn 6 → [10, 7, 6, 5, 3]
  }

  return newQueue
}
```

#### Giai Đoạn 4: Tầng Ảo (Phantom Floors)

**Vấn đề (Problem)**: Làm sao đảm bảo thang máy đi đến điểm tận cùng (extreme)?

**Giải pháp (Solution)**: Thêm "tầng ảo (phantom floors)" vào hàng đợi (queue).

```javascript
/**
 * Đảm bảo SCAN đi đến điểm tận cùng (extreme) bằng cách thêm tầng ảo (phantom floors)
 */
function ensureSCANExtreme(queue, currentFloor, direction, numFloors) {
  if (!queue || queue.length === 0) return queue

  const newQueue = [...queue]

  // ════════════════════════════════════════════════════════
  // Đi LÊN (UP): Đảm bảo đến tầng cao nhất (top floor)
  // ════════════════════════════════════════════════════════
  if (direction === 'up') {
    const hasFloorsAbove = queue.some(q => q.floor > currentFloor)

    if (hasFloorsAbove) {
      const maxInQueue = Math.max(...queue.map(q => q.floor))

      // Nếu tầng cao nhất trong hàng đợi < tầng đỉnh, thêm phantom
      if (maxInQueue < numFloors) {
        newQueue.push({
          floor: numFloors,
          callDirection: null,
          timestamp: Date.now(),
          isPhantom: true  // Đánh dấu là phantom (phantom marker)
        })
      }
    }
  }

  // ════════════════════════════════════════════════════════
  // Đi XUỐNG (DOWN): Đảm bảo đến tầng thấp nhất (bottom floor)
  // ════════════════════════════════════════════════════════
  else if (direction === 'down') {
    const hasFloorsBelow = queue.some(q => q.floor < currentFloor)

    if (hasFloorsBelow) {
      const minInQueue = Math.min(...queue.map(q => q.floor))

      // Nếu tầng thấp nhất trong hàng đợi > tầng 1, thêm phantom
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

  // Sắp xếp lại sau khi thêm phantom (re-sort after adding phantom)
  if (direction === 'up') {
    newQueue.sort((a, b) => a.floor - b.floor)
  } else {
    newQueue.sort((a, b) => b.floor - a.floor)
  }

  return newQueue
}
```

**Khi nào thêm phantom (When to add phantom)**:

```
Thang máy ở tầng 5, đang đi lên
Hàng đợi (queue): [7, 10]
maxFloor = 20

→ Thêm tầng ảo (phantom floor) 20
→ Hàng đợi trở thành: [7, 10, 20]
→ Thang máy sẽ đi: 5 → 7 → 10 → 20 (extreme!)
```

**Khi nào KHÔNG thêm phantom (When NOT to add phantom)**:

```
Thang máy ở tầng 5, đang đi lên
Hàng đợi (queue): [7, 10, 20]  // Đã bao gồm tầng đỉnh!

→ Không cần phantom
→ Hàng đợi giữ nguyên: [7, 10, 20]
```

**Loại bỏ phantom (Removing phantom)**:

```javascript
// Khi đến một tầng, xóa nó khỏi hàng đợi (queue)
const reachedFloor = queue[0]

// Không tính tầng ảo (phantom floor) trong số liệu (metrics)
if (!reachedFloor.isPhantom) {
  // Ghi lại thời gian chờ (wait time), cập nhật thống kê (statistics)
  recordMetrics(reachedFloor)
}

// Xóa khỏi hàng đợi (remove from queue) - phantom hay không
queue = queue.slice(1)
```

#### Giai Đoạn 5: Đảo Chiều (Direction Reversal)

Khi nào đảo chiều (when to reverse direction)?

```javascript
/**
 * Xác định liệu thang máy có nên đảo chiều (reverse direction) hay không
 */
function shouldReverse(elevator, maxFloor) {
  const { currentFloor, direction, queue } = elevator

  // Không có hàng đợi (no queue) = giữ rảnh (stay idle)
  if (queue.length === 0) {
    return { shouldReverse: false, newDirection: 'idle' }
  }

  // ════════════════════════════════════════════════════════
  // Ở tầng ĐỈNH (TOP), đang đi LÊN → đảo chiều XUỐNG
  // ════════════════════════════════════════════════════════
  if (currentFloor === maxFloor && direction === 'up') {
    return { shouldReverse: true, newDirection: 'down' }
  }

  // ════════════════════════════════════════════════════════
  // Ở tầng ĐÁY (BOTTOM), đang đi XUỐNG → đảo chiều LÊN
  // ════════════════════════════════════════════════════════
  if (currentFloor === 1 && direction === 'down') {
    return { shouldReverse: true, newDirection: 'up' }
  }

  // ════════════════════════════════════════════════════════
  // Hoàn thành hàng đợi (queue) khi đang đi LÊN → đảo chiều XUỐNG
  // ════════════════════════════════════════════════════════
  if (direction === 'up' && queue.length > 0) {
    const nextFloor = queue[0].floor

    if (nextFloor < currentFloor) {
      // Tầng tiếp theo ở phía dưới → chắc đã đến đỉnh
      return { shouldReverse: true, newDirection: 'down' }
    }
  }

  // ════════════════════════════════════════════════════════
  // Hoàn thành hàng đợi (queue) khi đang đi XUỐNG → đảo chiều LÊN
  // ════════════════════════════════════════════════════════
  if (direction === 'down' && queue.length > 0) {
    const nextFloor = queue[0].floor

    if (nextFloor > currentFloor) {
      // Tầng tiếp theo ở phía trên → chắc đã đến đáy
      return { shouldReverse: true, newDirection: 'up' }
    }
  }

  // Tiếp tục hướng hiện tại (continue current direction)
  return { shouldReverse: false, newDirection: direction }
}
```

---

## 📊 Phân Tích Thuật Toán (Algorithm Analysis)

### Độ Phức Tạp Thời Gian (Time Complexity)

#### Trường Hợp Xấu Nhất (Worst Case)

**Kịch bản (Scenario)**: Yêu cầu (request) ở tầng đối diện với hướng (direction) của thang máy hiện tại

```
Thang máy: Tầng 1, đang đi LÊN
Yêu cầu (request): Tầng 1, hướng XUỐNG

Đường đi:
1 → 2 → 3 → ... → 20 (đỉnh) → 19 → 18 → ... → 1 (phục vụ)

Tổng: 38 tầng (20 lên + 19 xuống - 1)
```

**Công thức (Formula)**:

```
Thời gian chờ xấu nhất (worst-case wait time) = 2 × N tầng
  với N = số tầng
```

**Độ phức tạp thời gian (Time Complexity)**: **O(N)**

- N = số tầng
- Tuyến tính (linear) với kích thước tòa nhà

#### Trường Hợp Tốt Nhất (Best Case)

**Kịch bản (Scenario)**: Yêu cầu (request) cùng hướng (direction) và ngay phía trước

```
Thang máy: Tầng 5, đang đi LÊN
Yêu cầu (request): Tầng 6, hướng LÊN

Đường đi: 5 → 6 (phục vụ ngay lập tức)

Tổng: 1 tầng
```

**Độ phức tạp thời gian (Time Complexity)**: **O(1)** - Thời gian hằng số (constant time)

#### Trường Hợp Trung Bình (Average Case)

**Giả định (Assumptions)**:

- Yêu cầu (requests) phân bố đều
- Thang máy di chuyển liên tục

**Thời gian chờ trung bình (Average wait time)**:

```
Thời gian chờ TB (avg wait time) ≈ N/2 tầng
  với N = số tầng
```

**Độ phức tạp thời gian (Time Complexity)**: **O(N)**

### Độ Phức Tạp Không Gian (Space Complexity)

**Lưu trữ hàng đợi (Queue Storage)**:

```
Không gian (space) = O(R)
  với R = số yêu cầu (requests) đang chờ
```

**Thông thường (Typically)**: R << N (yêu cầu ít hơn nhiều so với số tầng)

**Mỗi thang máy (Per elevator)**:

```javascript
{
  id: 4 bytes,
  currentFloor: 4 bytes,
  direction: 4 bytes,
  queue: R × 16 bytes,  // R requests (yêu cầu) × 16 bytes mỗi cái
  ...
}

Tổng mỗi thang máy ≈ 50 bytes + (R × 16 bytes)
```

**Nhiều thang máy (Multiple elevators)**:

```
Không gian (space) = M × (50 + R × 16) bytes
  với M = số thang máy
```

### Thông Lượng (Throughput)

**Yêu cầu mỗi giờ (Requests per hour)**:

```
Thông lượng (throughput) = (3600 / T_avg) × M thang máy

trong đó:
  T_avg = thời gian trung bình (average time) mỗi chuyến (giây)
  M = số thang máy
```

**Ví dụ (Example)**:

```
Tòa nhà: 20 tầng
Thang máy: 4
T_avg: 45 giây (ước tính)

Thông lượng (throughput) = (3600 / 45) × 4
                          = 80 × 4
                          = 320 yêu cầu/giờ (requests/hour)
```

---

## 🔄 So Sánh Với Các Thuật Toán Khác (Comparison with Other Algorithms)

### SCAN vs FCFS (First-Come-First-Served)

**FCFS**: Phục vụ theo thứ tự yêu cầu (serve in request order)

| Khía cạnh (Aspect) | SCAN | FCFS |
|--------|------|------|
| **Công bằng (Fairness)** | ⭐⭐⭐⭐⭐ Xuất sắc | ⭐⭐⭐ Khá |
| **Hiệu quả (Efficiency)** | ⭐⭐⭐⭐ Tốt | ⭐⭐ Kém |
| **Bỏ đói (Starvation)** | ✅ Không có | ✅ Không có |
| **Khả năng dự đoán (Predictability)** | ⭐⭐⭐⭐⭐ Cao | ⭐⭐⭐⭐⭐ Cao |
| **Triển khai (Implementation)** | Trung bình | Đơn giản |

**Ví dụ so sánh (Comparison example)**:

```
Kịch bản (scenario):
Thang máy ở tầng 10
Yêu cầu (requests) theo thứ tự: Tầng 5, Tầng 15, Tầng 3

Đường đi FCFS:
10 → 5 (phục vụ) → 15 (phục vụ) → 3 (phục vụ)
Tổng: 5 + 10 + 12 = 27 tầng
Đổi chiều (direction changes): 2 lần

Đường đi SCAN (đang đi xuống):
10 → 5 (phục vụ) → 3 (phục vụ) → 1 (extreme) → ... → 15 (phục vụ)
Tổng: 5 + 2 + 2 + 14 = 23 tầng
Đổi chiều (direction changes): 1 lần

→ SCAN hiệu quả hơn (more efficient) -15%
```

### SCAN vs LOOK

**LOOK**: Như SCAN nhưng KHÔNG đi đến điểm tận cùng (extreme)

| Khía cạnh (Aspect) | SCAN | LOOK |
|--------|------|------|
| **Công bằng (Fairness)** | ⭐⭐⭐⭐⭐ Xuất sắc | ⭐⭐⭐⭐ Rất tốt |
| **Hiệu quả (Efficiency)** | ⭐⭐⭐⭐ Tốt | ⭐⭐⭐⭐⭐ Xuất sắc |
| **Bỏ đói (Starvation)** | ✅ Không có | ⚠️ Rất hiếm |
| **Khả năng dự đoán (Predictability)** | ⭐⭐⭐⭐⭐ Cao | ⭐⭐⭐⭐ Tốt |
| **Thăm điểm tận cùng (Extreme visits)** | Luôn luôn | Không bao giờ |

**Ví dụ so sánh (Comparison example)**:

```
Thang máy ở tầng 5, đang đi lên
Hàng đợi (queue): [7, 10]
maxFloor: 20

SCAN:
5 → 7 → 10 → 20 (extreme!) → đảo chiều
Tổng: 15 tầng LÊN

LOOK:
5 → 7 → 10 → đảo chiều ngay
Tổng: 5 tầng LÊN

→ LOOK tiết kiệm 10 tầng - hiệu quả hơn (more efficient) 67%
```

**Khi nào SCAN tốt hơn LOOK (When SCAN is better than LOOK)**:

- Lưu lượng cao (high traffic) - đông người
- Cần đảm bảo công bằng (fairness) nghiêm ngặt
- Yêu cầu thời gian chờ tối đa (maximum wait time) có thể dự đoán (predictable)

**Khi nào LOOK tốt hơn SCAN (When LOOK is better than SCAN)**:

- Lưu lượng thấp đến trung bình (low to medium traffic)
- Ưu tiên hiệu quả (efficiency) hơn công bằng (fairness)
- Tiết kiệm năng lượng (energy saving) quan trọng

### SCAN vs SSTF (Shortest Seek Time First)

**SSTF**: Luôn phục vụ tầng gần nhất (serve nearest floor always)

| Khía cạnh (Aspect) | SCAN | SSTF |
|--------|------|------|
| **Công bằng (Fairness)** | ⭐⭐⭐⭐⭐ | ⭐⭐ Kém |
| **Hiệu quả (Efficiency)** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ (nhưng rủi ro) |
| **Bỏ đói (Starvation)** | ✅ Không có | ❌ Nguy cơ cao (high risk) |
| **Khả năng dự đoán (Predictability)** | ⭐⭐⭐⭐⭐ | ⭐⭐ Kém |
| **Sử dụng thực tế (Production use)** | ✅ Có | ❌ Không |

**Ví dụ bỏ đói (starvation) với SSTF**:

```
Thang máy ở tầng 10
Yêu cầu ban đầu (initial request): Tầng 20 (khoảng cách = 10)

Thang máy bắt đầu di chuyển đến 20...
Ở tầng 12:
  - Yêu cầu mới (new request): Tầng 8 (khoảng cách = 4)
  - SSTF đảo chiều về tầng 8!

Ở tầng 9:
  - Yêu cầu mới (new request): Tầng 5 (khoảng cách = 4)
  - SSTF đảo chiều về tầng 5!

Tầng 20 không bao giờ được phục vụ! (Bỏ đói - Starvation)

Với SCAN:
10 → 12 → ... → 20 (phục vụ tầng 20 trước)
Sau đó đảo chiều cho tầng 8 và 5
→ Không có bỏ đói (no starvation)
```

### SCAN vs C-SCAN (Circular SCAN)

**C-SCAN**: Đi lên đến đỉnh, dịch chuyển (jump) về đáy, lặp lại

| Khía cạnh (Aspect) | SCAN | C-SCAN |
|--------|------|--------|
| **Công bằng (Fairness)** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ (tốt hơn) |
| **Hiệu quả (Efficiency)** | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| **Hướng (Direction)** | Hai chiều | Một chiều |
| **Phương sai thời gian chờ (Wait variance)** | Cao hơn | Thấp hơn |

**Ưu điểm của C-SCAN (C-SCAN advantages)**:

```
Vấn đề của SCAN (SCAN problem):
- Tầng gần giữa được phục vụ thường xuyên hơn
- Tầng ở extremes (điểm tận cùng) chờ lâu hơn

Giải pháp của C-SCAN (C-SCAN solution):
- Tất cả tầng có thời gian chờ (wait time) tương tự
- Phân phối dịch vụ (service distribution) đồng đều hơn
```

**Ví dụ (Example)**:

```
SCAN (tòa nhà 10 tầng):
LÊN: 1→2→3→4→5→6→7→8→9→10
XUỐNG: 10→9→8→7→6→5→4→3→2→1
Tầng 5-6 được phục vụ mỗi ~10 tầng
Tầng 1,10 được phục vụ mỗi ~19 tầng

C-SCAN:
LÊN: 1→2→3→4→5→6→7→8→9→10
DỊCH CHUYỂN (JUMP): 10 → 1
LÊN: 1→2→3→4→5→6→7→8→9→10
Tất cả tầng được phục vụ mỗi ~10 tầng (đồng đều)
```

---

## 🏢 Ứng Dụng Thực Tế (Real-world Applications)

### Tòa Nhà Thương Mại (Commercial Buildings)

**Kịch bản (Scenario)**: Tòa nhà văn phòng, 30 tầng, 8 thang máy

**Tại sao dùng SCAN (Why use SCAN)**:

1. **Giờ cao điểm (Peak hours)** (8-9 AM, 5-6 PM)
   - Lưu lượng cực cao (extremely high traffic)
   - Cần đảm bảo công bằng (fairness)
   - Thời gian chờ (wait time) có thể dự đoán (predictable)

2. **Giờ ăn trưa (Lunch time)** (12-1 PM)
   - Lưu lượng hai chiều (bidirectional traffic) - lên & xuống
   - SCAN xử lý tốt (handles well)

3. **Giờ thường (Normal hours)**
   - Lưu lượng phân tán (distributed traffic)
   - SCAN cung cấp dịch vụ nhất quán (consistent service)

**Cấu hình (Configuration)**:

```javascript
{
  algorithm: 'SCAN',
  floors: 30,
  elevators: 8,

  // Nhóm thang máy theo vùng (zone grouping)
  zones: [
    { elevators: [0,1,2], floors: [1,10] },   // Tầng thấp (low floors)
    { elevators: [3,4,5], floors: [11,20] },  // Tầng trung (mid floors)
    { elevators: [6,7], floors: [21,30] }     // Tầng cao (high floors)
  ],

  // Mỗi vùng (zone) chạy SCAN độc lập
  perZoneSCAN: true
}
```

### Bệnh Viện (Hospitals)

**Kịch bản (Scenario)**: Bệnh viện, 10 tầng, 4 thang máy

**Thách thức (Challenges)**:

- Yêu cầu khẩn cấp (emergency requests) - ưu tiên cao (high priority)
- Lưu lượng thường xuyên (regular traffic)
- Vận chuyển thiết bị (equipment transport)

**Giải pháp (Solution)**: SCAN cải tiến với ưu tiên (SCAN with priority)

```javascript
{
  algorithm: 'SCAN_with_priority',

  priorities: {
    emergency: 10,    // Cao nhất (highest)
    staff: 5,
    visitor: 1
  },

  // Khẩn cấp (emergency) ghi đè (overrides) SCAN
  emergencyOverride: true,

  // Sau khẩn cấp, tiếp tục SCAN (resume SCAN after emergency)
  resumeSCAN: true
}
```

**Hành vi (Behavior)**:

```
Hoạt động SCAN bình thường (normal SCAN operation):
Tầng 5 → 6 → 7 → 8 → ...

KHẨN CẤP (EMERGENCY) tại tầng 3:
Tầng 5 → NGẮT (INTERRUPT) → 3 (khẩn cấp) → tiếp tục tại 5 → 6 → 7 → ...
```

### Chung Cư (Residential Buildings)

**Kịch bản (Scenario)**: Chung cư, 20 tầng, 3 thang máy

**Mẫu lưu lượng (Traffic patterns)**:

- Buổi sáng (Morning) (7-9 AM): Chủ yếu XUỐNG (mostly DOWN) - đi làm
- Buổi tối (Evening) (6-8 PM): Chủ yếu LÊN (mostly UP) - về nhà
- Thời gian khác (Other times): Ngẫu nhiên (random)

**Tối ưu hóa (Optimization)**: SCAN thích ứng (Adaptive SCAN)

```javascript
{
  algorithm: 'adaptive_SCAN',

  // Buổi sáng (morning): Ưu tiên hướng XUỐNG (prioritize DOWN)
  morningMode: {
    time: '07:00-09:00',
    startDirection: 'down',
    downWeight: 1.5  // Ưu tiên yêu cầu xuống (prioritize down requests)
  },

  // Buổi tối (evening): Ưu tiên hướng LÊN (prioritize UP)
  eveningMode: {
    time: '18:00-20:00',
    startDirection: 'up',
    upWeight: 1.5
  },

  // Thời gian khác (other times): SCAN tiêu chuẩn (standard SCAN)
  normalMode: {
    algorithm: 'SCAN'
  }
}
```

### Trung Tâm Thương Mại (Shopping Malls)

**Kịch bản (Scenario)**: Trung tâm thương mại, 5 tầng, 6 thang máy

**Đặc điểm (Characteristics)**:

- Tòa nhà thấp (low-rise building) - 5 tầng
- Lưu lượng lớn (high traffic)
- Cao điểm (peak): cuối tuần (weekends)

**Tại sao SCAN hoạt động tốt (Why SCAN works well)**:

```
Quét ngắn (short sweeps):
- Quét tối đa (max sweep) = 5 tầng
- Đảo chiều nhanh (quick reversal)
- Thông lượng cao (high throughput)

Ưu điểm SCAN so với LOOK (SCAN advantages over LOOK):
- Khả năng dự đoán (predictability) > Hiệu quả (efficiency)
- Khách hàng đánh giá cao tính nhất quán (consistency)
```

### Trung Tâm Dữ Liệu (Data Centers) - Áp dụng cho Disk I/O

SCAN ban đầu từ lập lịch đĩa cứng (disk scheduling), vẫn được sử dụng:

**SSDs hiện đại (Modern SSDs)**:

- Không có chuyển động cơ học (no mechanical movement)
- Nhưng vẫn dùng SCAN cho công bằng (fairness)

**Mảng HDD (HDD arrays) - RAID**:

```javascript
{
  algorithm: 'SCAN',
  application: 'disk_scheduling',

  // Nhiều đĩa (multiple disks) = nhiều thang máy (multiple elevators)
  disks: [0, 1, 2, 3],

  // Tracks = tầng (floors)
  tracks: 10000,

  // Thời gian tìm kiếm (seek time) = thời gian di chuyển (travel time)
  seekTimePerTrack: 0.1  // mili giây (milliseconds)
}
```

---

## 📐 Ví Dụ Minh Họa (Examples)

### Ví Dụ 1 (Example 1): SCAN Cơ Bản (Basic SCAN)

**Thiết lập (Setup)**:

```
Tòa nhà: 10 tầng
Thang máy: 1
Bắt đầu: Tầng 1, RẢNH (IDLE)
```

**Yêu cầu (Requests)** (theo thứ tự):

```
1. Tầng 5, LÊN
2. Tầng 8, LÊN
3. Tầng 3, XUỐNG
4. Tầng 7, LÊN
```

**Thực thi (Execution)**:

**Bước 1 (Step 1)**: Yêu cầu (request) tầng 5 LÊN

```
Thang máy: Tầng 1, RẢNH (IDLE)
Hành động (action): Bắt đầu di chuyển LÊN
Hàng đợi (queue): [5]

Đường đi: 1 → 2 → 3 → 4 → 5 (PHỤC VỤ - SERVE)
```

**Bước 2 (Step 2)**: Yêu cầu (request) tầng 8 LÊN (khi đang ở tầng 3)

```
Thang máy: Tầng 3, đang đi LÊN
Hàng đợi (queue): [5]
Yêu cầu mới (new request): Tầng 8, LÊN

Chèn vào hàng đợi (insert into queue) - tăng dần (ascending):
Hàng đợi (queue): [5, 8]

Đường đi: 3 → 4 → 5 (PHỤC VỤ) → 6 → 7 → 8 (PHỤC VỤ)
```

**Bước 3 (Step 3)**: Yêu cầu (request) tầng 3 XUỐNG (khi đang ở tầng 6)

```
Thang máy: Tầng 6, đang đi LÊN
Hàng đợi (queue): [8]
Yêu cầu mới (new request): Tầng 3, XUỐNG

Tính chi phí (calculate cost):
- Đang đi LÊN, phải đến đỉnh trước
- Chi phí (cost) = (10-6) + (10-3) + 100 = 111

Chèn (insert):
Hàng đợi (queue): [8, 10(phantom)]

Đường đi: 6 → 7 → 8 (PHỤC VỤ) → 9 → 10 (extreme) → ĐẢO CHIỀU (REVERSE)
```

**Bước 4 (Step 4)**: Yêu cầu (request) tầng 7 LÊN (khi đang ở tầng 9 đi LÊN)

```
Thang máy: Tầng 9, đang đi LÊN
Hàng đợi (queue): [10(phantom)]
Yêu cầu mới (new request): Tầng 7, LÊN

Chi phí (cost) = cao (hướng ngược lại bây giờ)

Sẽ được phục vụ trong quét XUỐNG (will be served in DOWN sweep):
Hiện tại: 9 → 10 (extreme) → ĐẢO CHIỀU (REVERSE)
Sau đó: 10 → 9 → 8 → 7 (PHỤC VỤ) → ... → 3 (PHỤC VỤ) → ...
```

**Dòng thời gian hoàn chỉnh (Complete timeline)**:

```
Thời gian (time) | Tầng | Hành động (action)         | Hàng đợi (queue)
-----------------|------|----------------------------|------------------
0                | 1    | Yêu cầu 5 LÊN              | [5]
5                | 5    | PHỤC VỤ tầng 5             | []
5                | 5    | Yêu cầu 8 LÊN              | [8]
8                | 8    | PHỤC VỤ tầng 8             | []
9                | 9    | Yêu cầu 3 XUỐNG            | [10p]
10               | 10   | Đến extreme (điểm tận cùng) | []
10               | 10   | ĐẢO CHIỀU (REVERSE)        |
10               | 10   | Yêu cầu 7 LÊN              | [7, 3]
11               | 7    | PHỤC VỤ tầng 7             | [3]
14               | 3    | PHỤC VỤ tầng 3             | []

Tổng thời gian (total time): 14 đơn vị
Tổng tầng di chuyển (total floors traveled): 9 + 7 = 16 tầng
Đổi chiều (direction changes): 1 lần
```

### Ví Dụ 2 (Example 2): Nhiều Thang Máy (Multiple Elevators)

**Thiết lập (Setup)**:

```
Tòa nhà: 15 tầng
Thang máy: 3
Vị trí bắt đầu (starting positions):
  - Thang máy A: Tầng 1, RẢNH (IDLE)
  - Thang máy B: Tầng 8, đang đi LÊN (going UP)
  - Thang máy C: Tầng 12, đang đi XUỐNG (going DOWN)
```

**Yêu cầu mới (New request)**: Tầng 10, hướng LÊN

**Tính chi phí (Cost calculation)**:

**Thang máy A (Elevator A)** (Tầng 1, RẢNH):

```
Chi phí (cost) = |1 - 10| = 9
```

**Thang máy B (Elevator B)** (Tầng 8, đang đi LÊN):

```
Cùng hướng (same direction), phía trước thang máy
Chi phí (cost) = 10 - 8 = 2 ✅ TỐT NHẤT (BEST)
```

**Thang máy C (Elevator C)** (Tầng 12, đang đi XUỐNG):

```
Sai hướng (wrong direction), phải hoàn thành quét (must complete sweep)
Chi phí (cost) = (12-1) + (10-1) + 100 = 120
```

**Quyết định (Decision)**: Gán cho **Thang máy B** (chi phí = 2)

**Đường đi của Thang máy B (Elevator B path)**:

```
Trước (before): Hàng đợi (queue) = []
Sau (after): Hàng đợi (queue) = [10]

Đường đi: 8 → 9 → 10 (PHỤC VỤ - SERVE)
```

### Ví Dụ 3 (Example 3): Mô Phỏng Giờ Cao Điểm (Rush Hour Simulation)

**Kịch bản (Scenario)**: Tòa nhà văn phòng, 8:30 AM, mọi người đến làm

**Thiết lập (Setup)**:

```
Tầng: 20
Thang máy: 4
Tất cả bắt đầu tại: Tầng 1
```

**Yêu cầu (Requests)** (đồng thời - simultaneous):

```
Tầng 5, LÊN
Tầng 7, LÊN
Tầng 10, LÊN
Tầng 12, LÊN
Tầng 15, LÊN
Tầng 18, LÊN
Tầng 20, LÊN
Tầng 3, LÊN
```

**Chiến lược phân phối (Distribution strategy)** (SCAN):

**Thang máy 1 (Elevator 1)**:

```
Được gán (assigned): Tầng 3, 5, 7
Hàng đợi (queue): [3, 5, 7]
Đường đi: 1 → 3(S) → 5(S) → 7(S) → 20(E) → đảo chiều (reverse)
```

**Thang máy 2 (Elevator 2)**:

```
Được gán (assigned): Tầng 10, 12
Hàng đợi (queue): [10, 12]
Đường đi: 1 → 10(S) → 12(S) → 20(E) → đảo chiều (reverse)
```

**Thang máy 3 (Elevator 3)**:

```
Được gán (assigned): Tầng 15, 18
Hàng đợi (queue): [15, 18]
Đường đi: 1 → 15(S) → 18(S) → 20(E) → đảo chiều (reverse)
```

**Thang máy 4 (Elevator 4)**:

```
Được gán (assigned): Tầng 20
Hàng đợi (queue): [20]
Đường đi: 1 → 20(S) → đảo chiều (reverse)
```

**Kết quả (Results)**:

```
Tầng | Thời gian chờ (wait time) | Được phục vụ bởi (served by)
------|---------------------------|------------------------------
3     | 3s                        | Thang máy 1
5     | 5s                        | Thang máy 1
7     | 7s                        | Thang máy 1
10    | 10s                       | Thang máy 2
12    | 12s                       | Thang máy 2
15    | 15s                       | Thang máy 3
18    | 18s                       | Thang máy 3
20    | 20s                       | Thang máy 4

Thời gian chờ trung bình (average wait time): 11.25s
Thời gian chờ tối đa (maximum wait time): 20s
Cân bằng tải (load balancing): ✅
```

---

## 📝 Bài Tập Thực Hành (Exercises)

### Bài Tập 1 (Exercise 1): Tính Chi Phí (Cost Calculation)

**Đề bài (Problem)**:

Tòa nhà 20 tầng có 3 thang máy:

- Thang máy A: Tầng 5, đang đi LÊN
- Thang máy B: Tầng 15, đang đi XUỐNG
- Thang máy C: Tầng 10, RẢNH (IDLE)

**Câu hỏi (Questions)**: Tính chi phí (cost) cho mỗi thang máy khi có yêu cầu (requests):

1. Tầng 12, hướng LÊN
2. Tầng 8, hướng XUỐNG
3. Tầng 18, hướng LÊN

**Đáp án (Answers)**:

**Yêu cầu 1 (Request 1): Tầng 12, LÊN**

```
Thang máy A (Elevator A) - Tầng 5, LÊN:
  Cùng hướng (same direction), phía trước
  Chi phí (cost) = 12 - 5 = 7 ✅

Thang máy B (Elevator B) - Tầng 15, XUỐNG:
  Sai hướng (wrong direction)
  Chi phí (cost) = (15-1) + (12-1) + 100 = 125

Thang máy C (Elevator C) - Tầng 10, RẢNH:
  Chi phí (cost) = |10 - 12| = 2 ✅✅ TỐT NHẤT (BEST)

Thắng cuộc (winner): Thang máy C
```

**Yêu cầu 2 (Request 2): Tầng 8, XUỐNG**

```
Thang máy A (Elevator A) - Tầng 5, LÊN:
  Sai hướng (wrong direction)
  Chi phí (cost) = (20-5) + (20-8) + 100 = 127

Thang máy B (Elevator B) - Tầng 15, XUỐNG:
  Cùng hướng (same direction), phía trước
  Chi phí (cost) = 15 - 8 = 7 ✅ TỐT NHẤT (BEST)

Thang máy C (Elevator C) - Tầng 10, RẢNH:
  Chi phí (cost) = |10 - 8| = 2 ✅✅ TỐT NHẤT (BEST)

Thắng cuộc (winner): Thang máy C (gần hơn - closer)
```

**Yêu cầu 3 (Request 3): Tầng 18, LÊN**

```
Thang máy A (Elevator A) - Tầng 5, LÊN:
  Cùng hướng (same direction), phía trước
  Chi phí (cost) = 18 - 5 = 13 ✅

Thang máy B (Elevator B) - Tầng 15, XUỐNG:
  Sai hướng (wrong direction)
  Chi phí (cost) = (15-1) + (18-1) + 100 = 131

Thang máy C (Elevator C) - Tầng 10, RẢNH:
  Chi phí (cost) = |10 - 18| = 8 ✅✅ TỐT NHẤT (BEST)

Thắng cuộc (winner): Thang máy C
```

### Bài Tập 2 (Exercise 2): Vẽ Lộ Trình (Path Drawing)

**Đề bài (Problem)**:

Thang máy tại tầng 6, đang đi LÊN, hàng đợi (queue) = [9, 15]
Yêu cầu mới (new requests) theo thứ tự:

1. Tầng 12, LÊN
2. Tầng 4, XUỐNG
3. Tầng 18, LÊN

**Câu hỏi (Questions)**:

- Vẽ đường đi hoàn chỉnh (complete path) của thang máy
- Tính tổng số tầng di chuyển (total floors traveled)
- Đánh dấu các lần đổi chiều (mark direction changes)

**Đáp án (Answer)**:

**Trạng thái ban đầu (Initial state)**:

```
Tầng: 6
Hướng (direction): LÊN
Hàng đợi (queue): [9, 15]
```

**Yêu cầu 1 (Request 1)**: Tầng 12, LÊN

```
Chèn vào hàng đợi (insert into queue) - tăng dần (ascending):
Hàng đợi (queue): [9, 12, 15]
```

**Yêu cầu 2 (Request 2)**: Tầng 4, XUỐNG

```
Sai hướng (wrong direction), sẽ phục vụ sau khi đảo chiều (will serve after reversal)
Lưu tạm thời (temporarily store)
```

**Yêu cầu 3 (Request 3)**: Tầng 18, LÊN

```
Chèn vào hàng đợi (insert into queue):
Hàng đợi (queue): [9, 12, 15, 18, 20(phantom)]
```

**Đường đi hoàn chỉnh (Complete path)**:

```
Thời gian (time) | Tầng | Hành động (action)                | Hàng đợi (queue)
-----------------|------|-----------------------------------|------------------
0                | 6    | Bắt đầu                           | [9,12,15,18,20p]
3                | 9    | PHỤC VỤ tầng 9                    | [12,15,18,20p]
6                | 12   | PHỤC VỤ tầng 12                   | [15,18,20p]
9                | 15   | PHỤC VỤ tầng 15                   | [18,20p]
12               | 18   | PHỤC VỤ tầng 18                   | [20p]
14               | 20   | Đến extreme (điểm tận cùng)       | []
14               | 20   | ⟲ ĐẢO CHIỀU (REVERSE)            | [4]
20               | 4    | PHỤC VỤ tầng 4                    | []

Tầng di chuyển (floors traveled):
LÊN: 6→9→12→15→18→20 = 14 tầng
XUỐNG: 20→4 = 16 tầng
Tổng (total): 30 tầng

Đổi chiều (direction changes): 1 lần (tại tầng 20)
```

### Bài Tập 3 (Exercise 3): Tối Ưu Hóa Cấu Hình (Optimize Configuration)

**Đề bài (Problem)**:

Bạn thiết kế hệ thống thang máy (elevator system) cho:

- Tòa nhà văn phòng, 25 tầng
- Trung bình 200 nhân viên
- Giờ cao điểm (peak hours): 8-9 AM (mọi người đến), 5-6 PM (mọi người về)

**Câu hỏi (Questions)**:

1. Cần bao nhiêu thang máy?
2. Nên dùng SCAN hay LOOK?
3. Có cần phân vùng thang máy (elevator zoning) không?

**Đáp án (Answer)**:

**1. Số lượng thang máy (Number of elevators)**:

**Tính toán (Calculation)**:

```
Giả định (assumptions):
- Thời gian trung bình (average time) mỗi chuyến: 60s (25 tầng)
- Mỗi thang máy có thể thực hiện: 60 chuyến/giờ (trips/hour)
- Giờ cao điểm (peak hour): 200 người cần thang máy
- Mỗi chuyến chở (per trip carries): ~5 người

Số chuyến cần thiết (trips needed): 200 / 5 = 40 chuyến/giờ

Số thang máy cần (elevators needed): 40 / 60 = 0.67 ≈ 1 thang máy (tối thiểu - minimum)

NHƯNG cộng thêm dự phòng (add buffer) cho:
- Yêu cầu đồng thời (concurrent requests)
- Giảm thiểu thời gian chờ (minimize wait time)
- Dự phòng (redundancy)

Đề xuất (recommendation): 3-4 thang máy
```

**2. SCAN vs LOOK**:

**Đề xuất (Recommendation): SCAN**

**Lý do (Reasons)**:

```
Đặc điểm giờ cao điểm (peak hour characteristics):
- Khối lượng lớn (high volume)
- Cần công bằng (fairness) - mọi người đều muốn thang máy!
- Khả năng dự đoán (predictability) quan trọng - biết thời gian chờ tối đa (max wait time)

Ưu điểm của SCAN (SCAN advantages):
✅ Đảm bảo công bằng (ensures fairness)
✅ Không có bỏ đói (no starvation)
✅ Thời gian chờ tối đa (max wait time) có thể dự đoán (predictable): 2 × 25 × 1s = 50s

LOOK có thể (LOOK might):
⚠️ Hiệu quả hơn một chút (slightly more efficient)
❌ Nhưng ít công bằng hơn (less fair) trong giờ cao điểm (peak hours)
```

**3. Phân vùng (Zoning)**:

**Đề xuất (Recommendation): CÓ (YES), phân vùng thang máy (zone elevators)**

**Cấu hình (Configuration)**:

```javascript
{
  zones: [
    {
      name: 'Tầng thấp (low floors)',
      elevators: [0, 1],
      floors: [1, 12],
      algorithm: 'SCAN'
    },
    {
      name: 'Tầng cao (high floors)',
      elevators: [2, 3],
      floors: [13, 25],
      algorithm: 'SCAN'
    }
  ],

  // Sảnh (lobby) - tầng 1 được phục vụ bởi tất cả (served by all)
  lobbyElevator: 'all'
}
```

**Lợi ích (Benefits)**:

```
✅ Dịch vụ nhanh hơn (faster service) - quét ngắn hơn (shorter sweeps)
✅ Phân phối tải tốt hơn (better load distribution)
✅ Giảm thời gian chờ (reduced wait time)

Ví dụ (example):
Không có vùng (no zoning):
  Yêu cầu (request) tầng 25 từ tầng 1
  Xấu nhất (worst case): 1→25 = 24 tầng

Có vùng (with zoning):
  Sử dụng thang máy tầng cao (high floors elevator)
  Bắt đầu từ tầng 13
  Chỉ tối đa (only max) 12 tầng
```

---

## ❓ Câu Hỏi Thường Gặp (FAQ)

### Q1: Tại sao SCAN phải đi đến điểm tận cùng (extreme) ngay cả khi không có yêu cầu (requests)?

**A**: Ba lý do chính (three main reasons):

**1. Công bằng (Fairness)**

```
Nếu không đi đến extreme:
- Tầng gần giữa được phục vụ nhiều
- Tầng ở extremes (điểm tận cùng) bị bỏ đói (starved)

Ví dụ (example):
Tòa nhà 20 tầng, thang máy ở giữa (tầng 10)
Không có extreme:
  - Tầng 8-12: Được phục vụ thường xuyên
  - Tầng 1-3, 18-20: Hiếm khi được phục vụ

Có extreme:
  - Tất cả tầng được phục vụ đều đặn mỗi 2 lần quét (sweeps)
```

**2. Khả năng dự đoán (Predictability)**

```
Người dùng biết:
- Thời gian chờ tối đa (max wait time) = 2 lần quét đầy đủ (full sweeps)
- Có thể tính: 2 × 20 tầng × 1s = 40s tối đa

Ví dụ thực tế (real example):
"Thang máy sẽ đến trong 40s" vs "Không biết bao lâu"
→ Trải nghiệm người dùng (user experience) tốt hơn
```

**3. Đơn giản (Simplicity)**

```
Logic đơn giản:
- Không cần quyết định phức tạp (complex decisions)
- Không có trường hợp đặc biệt (no edge cases)
- Dễ triển khai (easy implementation) trong hardware/software

Thay thế (alternatives) như LOOK:
- Cần kiểm tra "còn yêu cầu (requests) phía trước không?"
- Logic phức tạp hơn (more complex logic)
- Có thể có nhiều lỗi hơn (more potential bugs)
```

### Q2: Tầng ảo (Phantom floors) có ảnh hưởng đến hiệu suất (performance) không?

**A**: **KHÔNG** ảnh hưởng đáng kể.

**Lý do (Reason)**:

```javascript
// Tầng ảo (phantom floor) được bỏ qua nhanh
if (floor.isPhantom) {
  // Không có thao tác cửa (no door operations)
  // Không có người lên xuống (no boarding/exiting)
  // Chỉ đảo chiều (only direction reversal)

  time_at_phantom = 0s (đảo chiều ngay lập tức - instant reversal)
}

// Tầng thực (real floor)
if (!floor.isPhantom) {
  door_open: 2.5s
  door_hold: 3s
  door_close: 2s

  time_at_real_floor = 7.5s
}
```

**Tác động (Impact)**:

```
Với phantom: 0s overhead
Không có phantom: Nguy cơ (risk) không đi đến extreme → không công bằng (unfair)

Đánh đổi (trade-off): Đáng giá để đảm bảo công bằng (worthwhile for fairness)
```

### Q3: SCAN có phù hợp với mọi tòa nhà không?

**A**: **KHÔNG**. Tùy thuộc vào loại tòa nhà.

**Phù hợp (Suitable)** ✅:

```
1. Tòa nhà cao tầng (high-rise buildings) >10 tầng
   - Quét dài (long sweeps) biện minh cho việc thăm extreme

2. Tòa nhà lưu lượng cao (high traffic buildings)
   - Tòa nhà văn phòng (office buildings)
   - Khách sạn (hotels)
   - Bệnh viện (hospitals)

3. Cần công bằng (fairness required)
   - Tòa nhà công cộng (public buildings)
   - Văn phòng chính phủ (government offices)
```

**Không phù hợp (Not suitable)** ❌:

```
1. Tòa nhà thấp tầng (low-rise buildings) <5 tầng
   - LOOK hiệu quả hơn (more efficient)
   - Thăm extreme lãng phí (visiting extreme is wasteful)

2. Lưu lượng thấp (low traffic)
   - Chung cư (residential) ngoài giờ cao điểm (off-peak)
   - Hiệu quả (efficiency) > Công bằng (fairness)

3. Yêu cầu đặc biệt (special requirements)
   - Thang máy chỉ dành cho khẩn cấp (emergency-only elevators)
   - Thang máy hàng hóa (freight elevators) - dùng FCFS
```

### Q4: Làm sao tối ưu hóa (optimize) SCAN cho giờ cao điểm (peak hours)?

**A**: Nhiều chiến lược (multiple strategies):

**Chiến lược 1 (Strategy 1): Điều khiển nhóm (Group Control)**

```javascript
// Trong giờ cao điểm LÊN (UP peak) - buổi sáng (morning)
elevators.forEach(e => {
  if (e.direction === 'idle') {
    e.direction = 'up'  // Định vị trước (pre-position)
    e.startFloor = 1    // Chờ tại sảnh (wait at lobby)
  }
})
```

**Chiến lược 2 (Strategy 2): Phân vùng (Zone Assignment)**

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

**Chiến lược 3 (Strategy 3): Chế độ tốc hành (Express Mode)**

```javascript
// Một số thang máy bỏ qua tầng (skip floors)
elevator[0]: {
  floors: [1, 5, 10, 15, 20, 25, 30],  // Tốc hành (express)
  algorithm: 'SCAN'
}

elevator[1-4]: {
  floors: [1...30],  // Nội thành (local)
  algorithm: 'SCAN'
}
```

### Q5: SCAN có biến thể (variants) nào?

**A**: Nhiều biến thể (many variants):

**C-SCAN (Circular SCAN)**:

```
SCAN bình thường (normal):
LÊN: 1→20, XUỐNG: 20→1

C-SCAN:
LÊN: 1→20, DỊCH CHUYỂN (JUMP): 20→1, LÊN: 1→20...
Luôn luôn một hướng (always one direction)

Ưu điểm (advantage): Thời gian chờ (wait time) đồng đều hơn (more uniform)
```

**LOOK**:

```
Như SCAN nhưng:
- Không đi đến extreme
- Đảo chiều (reverse) khi không còn yêu cầu (requests)

Ưu điểm (advantage): Hiệu quả hơn (more efficient)
Nhược điểm (disadvantage): Ít công bằng hơn (less fair)
```

**N-Step-SCAN**:

```
Gom yêu cầu (batch requests) thành nhóm
Xử lý N yêu cầu, sau đó chấp nhận yêu cầu mới (accept new requests)

Ưu điểm (advantage): Ngăn chặn bỏ đói (prevent starvation) từ yêu cầu liên tục (continuous requests)
```

**FSCAN (Freeze SCAN)**:

```
Hai hàng đợi (two queues):
- Hoạt động (active): Đang được phục vụ (being served)
- Chờ (waiting): Yêu cầu mới (new requests)

Sau khi quét (sweep), hoán đổi hàng đợi (swap queues)

Ưu điểm (advantage): Thời gian chờ (wait time) có giới hạn (bounded)
```

### Q6: Mã nguồn (Source code) ở đâu trong dự án (project)?

**A**:

```
Triển khai chính (main implementation):
/src/algorithms/scanAlgorithm.js

Các hàm chính (main functions):
- scanAlgorithm()        // Chọn thang máy (elevator selection)
- calculateCost()        // Tính chi phí (cost calculation)
- insertIntoQueueSCAN()  // Quản lý hàng đợi (queue management)

Tích hợp (integration):
/src/hooks/useElevatorSystem.js
- ensureSCANExtreme()    // Logic tầng ảo (phantom floor logic)
- Line 264-266           // Xử lý extreme của SCAN (SCAN extreme handling)

Tests:
/src/algorithms/scanAlgorithm.test.js
- 227 dòng tests
- Các trường hợp đặc biệt (edge cases) được bao phủ (covered)
```

### Q7: Làm sao kiểm tra (test) hành vi SCAN trong simulator?

**A**: Làm theo kịch bản này (follow this scenario):

**Test 1: Hành vi extreme (Extreme behavior)**

```
1. Cấu hình (configuration): 10 tầng, 1 thang máy, SCAN
2. Thang máy ở tầng 1, RẢNH (IDLE)
3. Gọi tầng 5 LÊN
4. Chờ đến khi thang máy ở tầng 3
5. Gọi tầng 3 XUỐNG
6. Quan sát (observe): Thang máy tiếp tục đến 5 → 10 (extreme!) → đảo chiều (reverse) → 3
✅ Xác nhận (confirm) thăm extreme
```

**Test 2: Công bằng (Fairness)**

```
1. Cấu hình (configuration): 20 tầng, 2 thang máy
2. Tạo 10 yêu cầu ngẫu nhiên (random requests)
3. Kiểm tra thống kê (check statistics):
   - Thời gian chờ tối đa (max wait time) < 2 × 20 = 40s ✅
   - Không có yêu cầu nào bị bỏ qua (no skipped requests) ✅
```

**Test 3: Tính chi phí (Cost calculation)**

```
1. Chế độ thủ công (manual mode)
2. Ghi chú vị trí thang máy (note elevator positions)
3. Tính chi phí (cost) kỳ vọng thủ công (manual expected cost)
4. Chuyển sang AUTO (SCAN)
5. Kiểm tra thang máy nào được chọn (which elevator selected)
✅ Xác minh (verify) hàm chi phí (cost function) hoạt động
```

---

## 📚 Tài Liệu Tham Khảo (References)

### Các Bài Báo Học Thuật (Academic Papers)

1. **Denning, P. J.** (1967). "Effects of scheduling on file memory operations." *AFIPS Proceedings*, 9-21.
   - Bài báo thuật toán SCAN (SCAN Algorithm) gốc

2. **Geist, R., & Daniel, S.** (1987). "A continuum of disk scheduling algorithms." *ACM Transactions on Computer Systems*, 5(1), 77-92.
   - Phân tích toàn diện các biến thể SCAN (comprehensive SCAN variants analysis)

3. **Barney, G. C.** (2003). *Elevator Traffic Handbook: Theory and Practice*.
   - Tiêu chuẩn công nghiệp (industry standard) cho hệ thống thang máy (elevator systems)

### Tài Nguyên Trực Tuyến (Online Resources)

- [Wikipedia: Elevator Algorithm](https://en.wikipedia.org/wiki/Elevator_algorithm)
- [OS Dev: Disk Scheduling](https://wiki.osdev.org/Disk_Scheduling)
- [Elevator Saga Game](https://play.elevatorsaga.com/) - Học tập tương tác (interactive learning)

### Sách (Books)

- **Silberschatz, Galvin, Gagne** (2018). *Operating System Concepts* (10th ed.)
  - Chương 9: Mass-Storage Structure

- **Tanenbaum, A. S.** (2014). *Modern Operating Systems* (4th ed.)
  - Phần về lập lịch I/O (I/O scheduling section)

---

## 🎓 Tóm Tắt (Summary)

### Những Điểm Chính (Key Takeaways)

1. ✅ **SCAN = Công bằng (Fairness) + Khả năng dự đoán (Predictability)**
   - Đảm bảo mọi yêu cầu (requests) được phục vụ
   - Thời gian chờ tối đa (maximum wait time) có thể dự đoán (predictable)

2. ⚡ **Phải Đi Đến Điểm Tận Cùng (Must Go to Extreme)**
   - Không phải lỗi, là tính năng!
   - Đảm bảo công bằng (fairness) và ngăn chặn bỏ đói (prevent starvation)

3. 🏢 **Tiêu Chuẩn Công Nghiệp (Industry Standard)**
   - Sử dụng trong >90% thang máy thương mại (commercial elevators)
   - Đã được chứng minh trong thực tế (proven in practice)

4. 📊 **Đánh Đổi (Trade-offs)**
   - Công bằng (fairness) ✅ / Hiệu quả (efficiency) ⚠️
   - Tốt hơn SSTF, ít hiệu quả hơn LOOK

5. 🔧 **Có Thể Tùy Chỉnh (Customizable)**
   - Các biến thể (variants): C-SCAN, LOOK, FSCAN
   - Có thể tối ưu hóa (optimize) cho tòa nhà cụ thể

### Khi Nào Dùng SCAN? (When to Use SCAN?)

✅ **Dùng khi (Use when)**:

- Tòa nhà cao tầng (high-rise buildings) >10 tầng
- Lưu lượng cao (high traffic)
- Yêu cầu công bằng (fairness required)
- Khả năng dự đoán (predictability) quan trọng

❌ **Không dùng khi (Don't use when)**:

- Tòa nhà thấp tầng (low-rise buildings) <5 tầng → dùng LOOK
- Lưu lượng thấp (low traffic) → dùng LOOK
- Chỉ khẩn cấp (emergency only) → dùng dựa trên ưu tiên (priority-based)

---

**Chúc bạn học tốt! 🚀**

*Phiên bản tài liệu (Document version): 1.0*
*Cập nhật lần cuối (Last updated): 2025-11-08*
*Phản hồi (Feedback): [GitHub Issues](https://github.com/kinhluan/simple-elevator-simulator/issues)*
