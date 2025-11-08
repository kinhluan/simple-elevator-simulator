# Thuật Toán SCAN (SCAN Algorithm) - Thuật Toán Lập Lịch Thang Máy

Tài liệu chi tiết về thuật toán SCAN (còn gọi là "Elevator Algorithm") - thuật toán lập lịch thang máy phổ biến nhất trong thực tế.

---

## 📋 Mục Lục

1. [Tổng Quan](#tổng-quan)
2. [Lịch Sử & Nguồn Gốc](#lịch-sử--nguồn-gốc)
3. [Nguyên Lý Hoạt Động](#nguyên-lý-hoạt-động)
4. [Triển Khai Chi Tiết](#triển-khai-chi-tiết)
5. [Phân Tích Thuật Toán](#phân-tích-thuật-toán)
6. [So Sánh Với Các Thuật Toán Khác](#so-sánh-với-các-thuật-toán-khác)
7. [Ứng Dụng Thực Tế](#ứng-dụng-thực-tế)
8. [Ví Dụ Minh Họa](#ví-dụ-minh-họa)
9. [Bài Tập Thực Hành](#bài-tập-thực-hành)
10. [Câu Hỏi Thường Gặp](#câu-hỏi-thường-gặp)

---

## 🎯 Tổng Quan

### Định Nghĩa

**Thuật toán SCAN (SCAN Algorithm)** là một thuật toán lập lịch (scheduling algorithm) được sử dụng trong hệ thống thang máy, trong đó thang máy di chuyển theo một hướng (lên hoặc xuống) đến tận cùng (extreme) của tòa nhà, sau đó đảo ngược hướng và tiếp tục.

### Tên Gọi Khác

- **Elevator Algorithm** (Thuật toán Thang máy)
- **Elevator Seek Algorithm**
- **Directional Sweep Algorithm** (Thuật toán Quét Theo Hướng)

### Đặc Điểm Chính

```
┌─────────────────────────────────────────────┐
│ ✅ Công bằng (Fairness): Xuất sắc          │
│ ⚡ Hiệu quả (Efficiency): Tốt              │
│ 🔒 Nguy cơ bị bỏ đói (Starvation Risk): Không có │
│ 📊 Khả năng dự đoán (Predictability): Xuất sắc │
│ 🏢 Ứng dụng thực tế (Real-world Use): Tiêu chuẩn công nghiệp │
└─────────────────────────────────────────────┘
```

### Tại Sao Gọi Là "Elevator Algorithm"?

SCAN được gọi là "Elevator Algorithm" vì nó mô phỏng cách hoạt động của thang máy trong thực tế:

> **"Thang máy không đột ngột đổi hướng. Nó tiếp tục đi theo hướng đã chọn cho đến khi hoàn thành tất cả yêu cầu ở hướng đó, sau đó mới quay lại."**

Điều này tạo ra trải nghiệm tự nhiên và dễ dự đoán cho người dùng.

---

## 📜 Lịch Sử & Nguồn Gốc

### Nguồn Gốc Từ Lập Lịch Đĩa Cứng (Disk Scheduling)

Thuật toán SCAN ban đầu được phát triển cho **lập lịch đĩa cứng (disk scheduling)** trong hệ điều hành:

**Vấn đề ban đầu** (1960s):

```
Đĩa cứng có đầu đọc di chuyển qua các track
Cần thuật toán để giảm thiểu thời gian tìm kiếm (minimize seek time)
```

**Giải pháp SCAN**:

```
Đầu đọc di chuyển theo một hướng, phục vụ tất cả requests
Khi đến cuối đĩa, đảo ngược và quay lại
→ Giống như cách thang máy hoạt động!
```

### Áp Dụng Vào Hệ Thống Thang Máy (Elevator Systems)

**1970s-1980s**:

- Các kỹ sư nhận ra SCAN phù hợp với hệ thống thang máy
- Đặt tên là "Elevator Algorithm" khi áp dụng vào lập lịch đĩa cứng
- Ngược lại, áp dụng SCAN của đĩa cứng vào thang máy thực tế

**Hiện nay**:

- SCAN là thuật toán **tiêu chuẩn công nghiệp** cho thang máy
- Được sử dụng trong > 90% hệ thống thang máy thương mại
- Các biến thể: C-SCAN, LOOK, C-LOOK

---

## ⚙️ Nguyên Lý Hoạt Động

### Nguyên Lý Cốt Lõi (Core Principle)

```
1. Chọn một hướng (up hoặc down)
2. Di chuyển theo hướng đó, phục vụ tất cả requests trên đường đi
3. Đi đến điểm tận cùng (EXTREME) - tầng cao nhất hoặc thấp nhất
4. Đảo ngược hướng
5. Lặp lại từ bước 2
```

**Điểm chính (Key Point)**: Thang máy PHẢI đi đến điểm tận cùng (extreme) ngay cả khi không có requests ở đó.

### Tại Sao Phải Đi Đến Điểm Tận Cùng (Extreme)?

**Lý do 1: Công bằng (Fairness)**

```
Nếu không đi đến extreme:
- Requests gần trung tâm được phục vụ nhanh
- Requests ở extremes bị bỏ quên
→ Vấn đề bỏ đói (Starvation problem)
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
- Dễ triển khai trong hardware/software
```

### Trực Quan Hóa: Luồng SCAN (SCAN Flow)

```
Tòa nhà 10 tầng, thang máy bắt đầu tại tầng 1

Bước 1: Hướng (Direction) = LÊN (UP)
═══════════════════════════════════════════
Tầng 10  ←─────────────────── Extreme (PHẢI đến)
Tầng 9
Tầng 8   ← Request (phục vụ)
Tầng 7
Tầng 6
Tầng 5   ← Request (phục vụ)
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
Tầng 3   ← Request (phục vụ)
Tầng 2
Tầng 1   ←─────────────────── Extreme (PHẢI đến)
═══════════════════════════════════════════

Đường đi: 10 → 9 → 8 → 7 → 6 → 5 → 4 → 3(phục vụ) → 2 → 1(extreme)


Bước 3: Hướng (Direction) = LÊN (UP) lại
Vòng lặp tiếp tục...
```

---

## 💻 Triển Khai Chi Tiết

### Cấu Trúc Dữ Liệu

#### 1. Trạng Thái Thang Máy (Elevator State)

```javascript
const elevator = {
  id: 0,                        // ID thang máy
  currentFloor: 5,              // Vị trí hiện tại
  direction: 'up',              // 'up' | 'down' | 'idle'
  targetFloor: 10,              // Tầng đích hiện tại

  queue: [                      // Hàng đợi (Queue) các tầng cần phục vụ
    { floor: 7, callDirection: 'up', timestamp: 1699... },
    { floor: 10, callDirection: 'up', timestamp: 1699... }
  ],

  // Các số liệu hiệu suất (Performance metrics)
  tripsCompleted: 5,
  floorsTravel: 42,
  directionChanges: 3
}
```

#### 2. Cấu Trúc Hàng Đợi (Queue Structure)

Hàng đợi (Queue) trong SCAN **PHẢI** được sắp xếp theo hướng:

```javascript
// Đi LÊN (UP): Thứ tự tăng dần (Ascending order)
if (direction === 'up') {
  queue.sort((a, b) => a.floor - b.floor)
  // Kết quả: [3, 5, 7, 10, 15]
}

// Đi XUỐNG (DOWN): Thứ tự giảm dần (Descending order)
if (direction === 'down') {
  queue.sort((a, b) => b.floor - a.floor)
  // Kết quả: [15, 10, 7, 5, 3]
}
```

**Lý do**: Thang máy phục vụ các tầng theo thứ tự gặp trên đường đi.

### Triển Khai Thuật Toán (Algorithm Implementation)

#### Giai Đoạn 1: Chọn Thang Máy (Elevator Selection)

Khi có yêu cầu mới, chọn thang máy tốt nhất dựa trên **hàm chi phí (cost function)**:

```javascript
/**
 * Thuật toán SCAN: Chọn thang máy tốt nhất cho một lệnh gọi
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
 * Tính chi phí cho một thang máy để phục vụ một lệnh gọi
 * Chi phí thấp hơn = khớp tốt hơn
 */
function calculateCost(elevator, callFloor, callDirection, maxFloor) {
  const { currentFloor, direction } = elevator

  // ════════════════════════════════════════════════════════
  // TRƯỜNG HỢP 1: Thang máy đang RẢNH (IDLE)
  // ════════════════════════════════════════════════════════
  if (direction === 'idle') {
    // Khoảng cách đơn giản
    return Math.abs(currentFloor - callFloor)
  }

  // ════════════════════════════════════════════════════════
  // TRƯỜNG HỢP 2: Thang máy đang đi LÊN (UP)
  // ════════════════════════════════════════════════════════
  if (direction === 'up') {

    // Trường hợp con 2a: Lệnh gọi hướng LÊN và Ở PHÍA TRƯỚC thang máy
    if (callFloor >= currentFloor && callDirection === 'up') {
      // ✅ Trường hợp tốt nhất: Có thể đón trên đường đi
      // Chi phí = khoảng cách đến lệnh gọi
      return callFloor - currentFloor

      // Ví dụ:
      // Thang máy ở tầng 5, đang đi lên
      // Lệnh gọi tại tầng 8, hướng lên
      // Chi phí = 8 - 5 = 3 tầng
    }

    // Trường hợp con 2b: Lệnh gọi hướng XUỐNG hoặc Ở PHÍA SAU thang máy
    else {
      // ⚠️ Phải hoàn thành quét trước
      // Chi phí = khoảng cách đến đỉnh + khoảng cách từ đỉnh đến lệnh gọi
      const distanceToTop = maxFloor - currentFloor
      const distanceFromTopToCall = maxFloor - callFloor
      const penalty = 100  // Phạt cho việc đảo chiều

      return distanceToTop + distanceFromTopToCall + penalty

      // Ví dụ:
      // Thang máy ở tầng 5, đang đi lên
      // Lệnh gọi tại tầng 3, hướng xuống
      // maxFloor = 20
      // Chi phí = (20-5) + (20-3) + 100 = 15 + 17 + 100 = 132
    }
  }

  // ════════════════════════════════════════════════════════
  // TRƯỜNG HỢP 3: Thang máy đang đi XUỐNG (DOWN)
  // ════════════════════════════════════════════════════════
  if (direction === 'down') {

    // Trường hợp con 3a: Lệnh gọi hướng XUỐNG và Ở PHÍA TRƯỚC thang máy
    if (callFloor <= currentFloor && callDirection === 'down') {
      // ✅ Trường hợp tốt nhất: Có thể đón trên đường đi
      return currentFloor - callFloor

      // Ví dụ:
      // Thang máy ở tầng 10, đang đi xuống
      // Lệnh gọi tại tầng 5, hướng xuống
      // Chi phí = 10 - 5 = 5 tầng
    }

    // Trường hợp con 3b: Lệnh gọi hướng LÊN hoặc Ở PHÍA SAU thang máy
    else {
      // ⚠️ Phải hoàn thành quét trước
      const distanceToBottom = currentFloor - 1
      const distanceFromBottomToCall = callFloor - 1
      const penalty = 100

      return distanceToBottom + distanceFromBottomToCall + penalty

      // Ví dụ:
      // Thang máy ở tầng 10, đang đi xuống
      // Lệnh gọi tại tầng 15, hướng lên
      // Chi phí = (10-1) + (15-1) + 100 = 9 + 14 + 100 = 123
    }
  }

  // Fallback
  return Math.abs(currentFloor - callFloor)
}
```

**Diễn giải chi phí (Cost Interpretation)**:

```
Chi phí < 50:     Khớp xuất sắc (cùng hướng, gần)
Chi phí 50-100:   Khớp tốt (cùng hướng, xa)
Chi phí > 100:    Khớp kém (cần đảo chiều)
```

#### Giai Đoạn 3: Chèn Vào Hàng Đợi (Queue Insertion)

Sau khi chọn thang máy, thêm tầng vào hàng đợi:

```javascript
/**
 * Chèn tầng vào hàng đợi duy trì thứ tự SCAN
 */
function insertIntoQueueSCAN(queue, currentFloor, direction, newFloor) {
  // Trường hợp đặc biệt: Hàng đợi trống hoặc rảnh
  if (queue.length === 0 || direction === 'idle') {
    return [newFloor]
  }

  // Sao chép hàng đợi
  const newQueue = [...queue]

  // Kiểm tra trùng lặp
  if (newQueue.includes(newFloor)) {
    return newQueue
  }

  // Chèn và sắp xếp dựa trên hướng
  newQueue.push(newFloor)

  if (direction === 'up') {
    // Thứ tự tăng dần: nhỏ nhất đến lớn nhất
    newQueue.sort((a, b) => a - b)

    // Ví dụ: [3, 5, 7, 10]
    // Chèn 6 → [3, 5, 6, 7, 10]
  }
  else if (direction === 'down') {
    // Thứ tự giảm dần: lớn nhất đến nhỏ nhất
    newQueue.sort((a, b) => b - a)

    // Ví dụ: [10, 7, 5, 3]
    // Chèn 6 → [10, 7, 6, 5, 3]
  }

  return newQueue
}
```

#### Giai Đoạn 4: Tầng Ảo (Phantom Floors)

**Vấn đề**: Làm sao đảm bảo thang máy đi đến điểm tận cùng?

**Giải pháp**: Thêm "tầng ảo (phantom floors)" vào hàng đợi.

```javascript
/**
 * Đảm bảo SCAN đi đến điểm tận cùng bằng cách thêm tầng ảo
 */
function ensureSCANExtreme(queue, currentFloor, direction, numFloors) {
  if (!queue || queue.length === 0) return queue

  const newQueue = [...queue]

  // ════════════════════════════════════════════════════════
  // Đi LÊN: Đảm bảo đến tầng cao nhất
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
          isPhantom: true  // Đánh dấu là phantom
        })
      }
    }
  }

  // ════════════════════════════════════════════════════════
  // Đi XUỐNG: Đảm bảo đến tầng thấp nhất
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

  // Sắp xếp lại sau khi thêm phantom
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
Thang máy ở tầng 5, đang đi lên
Hàng đợi: [7, 10]
maxFloor = 20

→ Thêm tầng ảo 20
→ Hàng đợi trở thành: [7, 10, 20]
→ Thang máy sẽ đi: 5 → 7 → 10 → 20 (extreme!)
```

**Khi nào KHÔNG thêm phantom**:

```
Thang máy ở tầng 5, đang đi lên
Hàng đợi: [7, 10, 20]  // Đã bao gồm tầng đỉnh!

→ Không cần phantom
→ Hàng đợi giữ nguyên: [7, 10, 20]
```

**Loại bỏ phantom**:

```javascript
// Khi đến một tầng, xóa nó khỏi hàng đợi
const reachedFloor = queue[0]

// Không tính tầng ảo trong số liệu
if (!reachedFloor.isPhantom) {
  // Ghi lại thời gian chờ, cập nhật thống kê
  recordMetrics(reachedFloor)
}

// Xóa khỏi hàng đợi (phantom hay không)
queue = queue.slice(1)
```

#### Giai Đoạn 5: Đảo Chiều (Direction Reversal)

Khi nào đảo chiều?

```javascript
/**
 * Xác định liệu thang máy có nên đảo chiều hay không
 */
function shouldReverse(elevator, maxFloor) {
  const { currentFloor, direction, queue } = elevator

  // Không có hàng đợi = giữ rảnh
  if (queue.length === 0) {
    return { shouldReverse: false, newDirection: 'idle' }
  }

  // ════════════════════════════════════════════════════════
  // Ở tầng ĐỈNH, đang đi LÊN → đảo chiều XUỐNG
  // ════════════════════════════════════════════════════════
  if (currentFloor === maxFloor && direction === 'up') {
    return { shouldReverse: true, newDirection: 'down' }
  }

  // ════════════════════════════════════════════════════════
  // Ở tầng ĐÁY, đang đi XUỐNG → đảo chiều LÊN
  // ════════════════════════════════════════════════════════
  if (currentFloor === 1 && direction === 'down') {
    return { shouldReverse: true, newDirection: 'up' }
  }

  // ════════════════════════════════════════════════════════
  // Hoàn thành hàng đợi khi đang đi LÊN → đảo chiều XUỐNG
  // ════════════════════════════════════════════════════════
  if (direction === 'up' && queue.length > 0) {
    const nextFloor = queue[0].floor

    if (nextFloor < currentFloor) {
      // Tầng tiếp theo ở phía dưới → chắc đã đến đỉnh
      return { shouldReverse: true, newDirection: 'down' }
    }
  }

  // ════════════════════════════════════════════════════════
  // Hoàn thành hàng đợi khi đang đi XUỐNG → đảo chiều LÊN
  // ════════════════════════════════════════════════════════
  if (direction === 'down' && queue.length > 0) {
    const nextFloor = queue[0].floor

    if (nextFloor > currentFloor) {
      // Tầng tiếp theo ở phía trên → chắc đã đến đáy
      return { shouldReverse: true, newDirection: 'up' }
    }
  }

  // Tiếp tục hướng hiện tại
  return { shouldReverse: false, newDirection: direction }
}
```

---

## 📊 Phân Tích Thuật Toán

### Độ Phức Tạp Thời Gian (Time Complexity)

#### Trường Hợp Xấu Nhất (Worst Case)

**Kịch bản**: Yêu cầu ở tầng đối diện với hướng của thang máy hiện tại

```
Thang máy: Tầng 1, đang đi LÊN
Yêu cầu: Tầng 1, hướng XUỐNG

Đường đi:
1 → 2 → 3 → ... → 20 (đỉnh) → 19 → 18 → ... → 1 (phục vụ)

Tổng: 38 tầng (20 lên + 19 xuống - 1)
```

**Công thức**:

```
Thời gian chờ xấu nhất = 2 × N tầng
  với N = số tầng
```

**Độ phức tạp thời gian**: **O(N)**

- N = số tầng
- Tuyến tính với kích thước tòa nhà

#### Trường Hợp Tốt Nhất (Best Case)

**Kịch bản**: Yêu cầu cùng hướng và ngay phía trước

```
Thang máy: Tầng 5, đang đi LÊN
Yêu cầu: Tầng 6, hướng LÊN

Đường đi: 5 → 6 (phục vụ ngay lập tức)

Tổng: 1 tầng
```

**Độ phức tạp thời gian**: **O(1)** - Thời gian hằng số

#### Trường Hợp Trung Bình (Average Case)

**Giả định**:

- Yêu cầu phân bố đều
- Thang máy di chuyển liên tục

**Thời gian chờ trung bình**:

```
Thời gian chờ TB ≈ N/2 tầng
  với N = số tầng
```

**Độ phức tạp thời gian**: **O(N)**

### Độ Phức Tạp Không Gian (Space Complexity)

**Lưu trữ hàng đợi (Queue Storage)**:

```
Không gian = O(R)
  với R = số yêu cầu đang chờ
```

**Thông thường**: R << N (yêu cầu ít hơn nhiều so với số tầng)

**Mỗi thang máy**:

```javascript
{
  id: 4 bytes,
  currentFloor: 4 bytes,
  direction: 4 bytes,
  queue: R × 16 bytes,  // R yêu cầu × 16 bytes mỗi cái
  ...
}

Tổng mỗi thang máy ≈ 50 bytes + (R × 16 bytes)
```

**Nhiều thang máy**:

```
Không gian = M × (50 + R × 16) bytes
  với M = số thang máy
```

### Thông Lượng (Throughput)

**Yêu cầu mỗi giờ**:

```
Thông lượng = (3600 / T_avg) × M thang máy

trong đó:
  T_avg = thời gian trung bình mỗi chuyến (giây)
  M = số thang máy
```

**Ví dụ**:

```
Tòa nhà: 20 tầng
Thang máy: 4
T_avg: 45 giây (ước tính)

Thông lượng = (3600 / 45) × 4
           = 80 × 4
           = 320 yêu cầu/giờ
```

---

## 🔄 So Sánh Với Các Thuật Toán Khác

### SCAN vs FCFS (First-Come-First-Served)

**FCFS**: Phục vụ theo thứ tự yêu cầu

| Khía cạnh | SCAN | FCFS |
|--------|------|------|
| **Công bằng (Fairness)** | ⭐⭐⭐⭐⭐ Xuất sắc | ⭐⭐⭐ Khá |
| **Hiệu quả (Efficiency)** | ⭐⭐⭐⭐ Tốt | ⭐⭐ Kém |
| **Bỏ đói (Starvation)** | ✅ Không có | ✅ Không có |
| **Khả năng dự đoán (Predictability)** | ⭐⭐⭐⭐⭐ Cao | ⭐⭐⭐⭐⭐ Cao |
| **Triển khai (Implementation)** | Trung bình | Đơn giản |

**Ví dụ so sánh**:

```
Kịch bản:
Thang máy ở tầng 10
Yêu cầu (theo thứ tự): Tầng 5, Tầng 15, Tầng 3

Đường đi FCFS:
10 → 5 (phục vụ) → 15 (phục vụ) → 3 (phục vụ)
Tổng: 5 + 10 + 12 = 27 tầng
Đổi chiều: 2 lần

Đường đi SCAN (đang đi xuống):
10 → 5 (phục vụ) → 3 (phục vụ) → 1 (extreme) → ... → 15 (phục vụ)
Tổng: 5 + 2 + 2 + 14 = 23 tầng
Đổi chiều: 1 lần

→ SCAN hiệu quả hơn (-15%)
```

### SCAN vs LOOK

**LOOK**: Như SCAN nhưng KHÔNG đi đến điểm tận cùng

| Khía cạnh | SCAN | LOOK |
|--------|------|------|
| **Công bằng (Fairness)** | ⭐⭐⭐⭐⭐ Xuất sắc | ⭐⭐⭐⭐ Rất tốt |
| **Hiệu quả (Efficiency)** | ⭐⭐⭐⭐ Tốt | ⭐⭐⭐⭐⭐ Xuất sắc |
| **Bỏ đói (Starvation)** | ✅ Không có | ⚠️ Rất hiếm |
| **Khả năng dự đoán (Predictability)** | ⭐⭐⭐⭐⭐ Cao | ⭐⭐⭐⭐ Tốt |
| **Thăm điểm tận cùng (Extreme visits)** | Luôn luôn | Không bao giờ |

**Ví dụ so sánh**:

```
Thang máy ở tầng 5, đang đi lên
Hàng đợi: [7, 10]
maxFloor: 20

SCAN:
5 → 7 → 10 → 20 (extreme!) → đảo chiều
Tổng: 15 tầng LÊN

LOOK:
5 → 7 → 10 → đảo chiều ngay
Tổng: 5 tầng LÊN

→ LOOK tiết kiệm 10 tầng (hiệu quả hơn 67%)
```

**Khi nào SCAN tốt hơn LOOK**:

- Lưu lượng cao (đông người)
- Cần đảm bảo công bằng nghiêm ngặt
- Yêu cầu thời gian chờ tối đa có thể dự đoán

**Khi nào LOOK tốt hơn SCAN**:

- Lưu lượng thấp đến trung bình
- Ưu tiên hiệu quả hơn công bằng
- Tiết kiệm năng lượng quan trọng

### SCAN vs SSTF (Shortest Seek Time First)

**SSTF**: Luôn phục vụ tầng gần nhất

| Khía cạnh | SCAN | SSTF |
|--------|------|------|
| **Công bằng (Fairness)** | ⭐⭐⭐⭐⭐ | ⭐⭐ Kém |
| **Hiệu quả (Efficiency)** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ (nhưng rủi ro) |
| **Bỏ đói (Starvation)** | ✅ Không có | ❌ Nguy cơ cao |
| **Khả năng dự đoán (Predictability)** | ⭐⭐⭐⭐⭐ | ⭐⭐ Kém |
| **Sử dụng thực tế (Production use)** | ✅ Có | ❌ Không |

**Ví dụ bỏ đói với SSTF**:

```
Thang máy ở tầng 10
Yêu cầu ban đầu: Tầng 20 (khoảng cách = 10)

Thang máy bắt đầu di chuyển đến 20...
Ở tầng 12:
  - Yêu cầu mới: Tầng 8 (khoảng cách = 4)
  - SSTF đảo chiều về tầng 8!

Ở tầng 9:
  - Yêu cầu mới: Tầng 5 (khoảng cách = 4)
  - SSTF đảo chiều về tầng 5!

Tầng 20 không bao giờ được phục vụ! (Bỏ đói - Starvation)

Với SCAN:
10 → 12 → ... → 20 (phục vụ tầng 20 trước)
Sau đó đảo chiều cho tầng 8 và 5
→ Không có bỏ đói
```

### SCAN vs C-SCAN (Circular SCAN)

**C-SCAN**: Đi lên đến đỉnh, dịch chuyển về đáy, lặp lại

| Khía cạnh | SCAN | C-SCAN |
|--------|------|--------|
| **Công bằng (Fairness)** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ (tốt hơn) |
| **Hiệu quả (Efficiency)** | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| **Hướng (Direction)** | Hai chiều | Một chiều |
| **Phương sai thời gian chờ (Wait variance)** | Cao hơn | Thấp hơn |

**Ưu điểm của C-SCAN**:

```
Vấn đề của SCAN:
- Tầng gần giữa được phục vụ thường xuyên hơn
- Tầng ở extremes chờ lâu hơn

Giải pháp của C-SCAN:
- Tất cả tầng có thời gian chờ tương tự
- Phân phối dịch vụ đồng đều hơn
```

**Ví dụ**:

```
SCAN (tòa nhà 10 tầng):
LÊN: 1→2→3→4→5→6→7→8→9→10
XUỐNG: 10→9→8→7→6→5→4→3→2→1
Tầng 5-6 được phục vụ mỗi ~10 tầng
Tầng 1,10 được phục vụ mỗi ~19 tầng

C-SCAN:
LÊN: 1→2→3→4→5→6→7→8→9→10
DỊCH CHUYỂN: 10 → 1
LÊN: 1→2→3→4→5→6→7→8→9→10
Tất cả tầng được phục vụ mỗi ~10 tầng (đồng đều)
```

---

## 🏢 Ứng Dụng Thực Tế

### Tòa Nhà Thương Mại (Commercial Buildings)

**Kịch bản**: Tòa nhà văn phòng, 30 tầng, 8 thang máy

**Tại sao dùng SCAN**:

1. **Giờ cao điểm (Peak hours) (8-9 AM, 5-6 PM)**
   - Lưu lượng cực cao
   - Cần đảm bảo công bằng
   - Thời gian chờ có thể dự đoán

2. **Giờ ăn trưa (Lunch time) (12-1 PM)**
   - Lưu lượng hai chiều (lên & xuống)
   - SCAN xử lý tốt

3. **Giờ thường (Normal hours)**
   - Lưu lượng phân tán
   - SCAN cung cấp dịch vụ nhất quán

**Cấu hình**:

```javascript
{
  algorithm: 'SCAN',
  floors: 30,
  elevators: 8,

  // Nhóm thang máy theo vùng
  zones: [
    { elevators: [0,1,2], floors: [1,10] },   // Tầng thấp
    { elevators: [3,4,5], floors: [11,20] },  // Tầng trung
    { elevators: [6,7], floors: [21,30] }     // Tầng cao
  ],

  // Mỗi vùng chạy SCAN độc lập
  perZoneSCAN: true
}
```

### Bệnh Viện (Hospitals)

**Kịch bản**: Bệnh viện, 10 tầng, 4 thang máy

**Thách thức**:

- Yêu cầu khẩn cấp (ưu tiên cao)
- Lưu lượng thường xuyên
- Vận chuyển thiết bị

**Giải pháp**: SCAN cải tiến với ưu tiên

```javascript
{
  algorithm: 'SCAN_with_priority',

  priorities: {
    emergency: 10,    // Cao nhất
    staff: 5,
    visitor: 1
  },

  // Khẩn cấp ghi đè SCAN
  emergencyOverride: true,

  // Sau khẩn cấp, tiếp tục SCAN
  resumeSCAN: true
}
```

**Hành vi**:

```
Hoạt động SCAN bình thường:
Tầng 5 → 6 → 7 → 8 → ...

KHẨN CẤP tại tầng 3:
Tầng 5 → NGẮT → 3 (khẩn cấp) → tiếp tục tại 5 → 6 → 7 → ...
```

### Chung Cư (Residential Buildings)

**Kịch bản**: Chung cư, 20 tầng, 3 thang máy

**Mẫu lưu lượng (Traffic patterns)**:

- Buổi sáng (7-9 AM): Chủ yếu XUỐNG (đi làm)
- Buổi tối (6-8 PM): Chủ yếu LÊN (về nhà)
- Thời gian khác: Ngẫu nhiên

**Tối ưu hóa**: SCAN thích ứng

```javascript
{
  algorithm: 'adaptive_SCAN',

  // Buổi sáng: Ưu tiên hướng XUỐNG
  morningMode: {
    time: '07:00-09:00',
    startDirection: 'down',
    downWeight: 1.5  // Ưu tiên yêu cầu xuống
  },

  // Buổi tối: Ưu tiên hướng LÊN
  eveningMode: {
    time: '18:00-20:00',
    startDirection: 'up',
    upWeight: 1.5
  },

  // Thời gian khác: SCAN tiêu chuẩn
  normalMode: {
    algorithm: 'SCAN'
  }
}
```

### Trung Tâm Thương Mại (Shopping Malls)

**Kịch bản**: Trung tâm thương mại, 5 tầng, 6 thang máy

**Đặc điểm**:

- Tòa nhà thấp (5 tầng)
- Lưu lượng lớn
- Cao điểm: cuối tuần

**Tại sao SCAN hoạt động tốt**:

```
Quét ngắn:
- Quét tối đa = 5 tầng
- Đảo chiều nhanh
- Thông lượng cao

Ưu điểm SCAN so với LOOK:
- Khả năng dự đoán > Hiệu quả
- Khách hàng đánh giá cao tính nhất quán
```

### Trung Tâm Dữ Liệu (Data Centers) (Áp dụng cho Disk I/O)

SCAN ban đầu từ lập lịch đĩa cứng, vẫn được sử dụng:

**SSDs hiện đại**:

- Không có chuyển động cơ học
- Nhưng vẫn dùng SCAN cho công bằng

**Mảng HDD (RAID)**:

```javascript
{
  algorithm: 'SCAN',
  application: 'disk_scheduling',

  // Nhiều đĩa = nhiều thang máy
  disks: [0, 1, 2, 3],

  // Tracks = tầng
  tracks: 10000,

  // Thời gian tìm kiếm = thời gian di chuyển
  seekTimePerTrack: 0.1  // mili giây
}
```

---

## 📐 Ví Dụ Minh Họa

### Ví Dụ 1: SCAN Cơ Bản (Basic SCAN)

**Thiết lập**:

```
Tòa nhà: 10 tầng
Thang máy: 1
Bắt đầu: Tầng 1, RẢNH (IDLE)
```

**Yêu cầu** (theo thứ tự):

```
1. Tầng 5, LÊN
2. Tầng 8, LÊN
3. Tầng 3, XUỐNG
4. Tầng 7, LÊN
```

**Thực thi**:

**Bước 1**: Yêu cầu tầng 5 LÊN

```
Thang máy: Tầng 1, RẢNH
Hành động: Bắt đầu di chuyển LÊN
Hàng đợi: [5]

Đường đi: 1 → 2 → 3 → 4 → 5 (PHỤC VỤ)
```

**Bước 2**: Yêu cầu tầng 8 LÊN (khi đang ở tầng 3)

```
Thang máy: Tầng 3, đang đi LÊN
Hàng đợi: [5]
Yêu cầu mới: Tầng 8, LÊN

Chèn vào hàng đợi (tăng dần):
Hàng đợi: [5, 8]

Đường đi: 3 → 4 → 5 (PHỤC VỤ) → 6 → 7 → 8 (PHỤC VỤ)
```

**Bước 3**: Yêu cầu tầng 3 XUỐNG (khi đang ở tầng 6)

```
Thang máy: Tầng 6, đang đi LÊN
Hàng đợi: [8]
Yêu cầu mới: Tầng 3, XUỐNG

Tính chi phí:
- Đang đi LÊN, phải đến đỉnh trước
- Chi phí = (10-6) + (10-3) + 100 = 111

Chèn:
Hàng đợi: [8, 10(phantom)]

Đường đi: 6 → 7 → 8 (PHỤC VỤ) → 9 → 10 (extreme) → ĐẢO CHIỀU
```

**Bước 4**: Yêu cầu tầng 7 LÊN (khi đang ở tầng 9 đi LÊN)

```
Thang máy: Tầng 9, đang đi LÊN
Hàng đợi: [10(phantom)]
Yêu cầu mới: Tầng 7, LÊN

Chi phí = cao (hướng ngược lại bây giờ)

Sẽ được phục vụ trong quét XUỐNG:
Hiện tại: 9 → 10 (extreme) → ĐẢO CHIỀU
Sau đó: 10 → 9 → 8 → 7 (PHỤC VỤ) → ... → 3 (PHỤC VỤ) → ...
```

**Dòng thời gian hoàn chỉnh**:

```
Thời gian | Tầng | Hành động         | Hàng đợi
----------|------|-------------------|----------
0         | 1    | Yêu cầu 5 LÊN     | [5]
5         | 5    | PHỤC VỤ tầng 5    | []
5         | 5    | Yêu cầu 8 LÊN     | [8]
8         | 8    | PHỤC VỤ tầng 8    | []
9         | 9    | Yêu cầu 3 XUỐNG   | [10p]
10        | 10   | Đến extreme       | []
10        | 10   | ĐẢO CHIỀU         |
10        | 10   | Yêu cầu 7 LÊN     | [7, 3]
11        | 7    | PHỤC VỤ tầng 7    | [3]
14        | 3    | PHỤC VỤ tầng 3    | []

Tổng thời gian: 14 đơn vị
Tổng tầng di chuyển: 9 + 7 = 16 tầng
Đổi chiều: 1 lần
```

### Ví Dụ 2: Nhiều Thang Máy (Multiple Elevators)

**Thiết lập**:

```
Tòa nhà: 15 tầng
Thang máy: 3
Vị trí bắt đầu:
  - Thang máy A: Tầng 1, RẢNH
  - Thang máy B: Tầng 8, đang đi LÊN
  - Thang máy C: Tầng 12, đang đi XUỐNG
```

**Yêu cầu mới**: Tầng 10, hướng LÊN

**Tính chi phí**:

**Thang máy A** (Tầng 1, RẢNH):

```
Chi phí = |1 - 10| = 9
```

**Thang máy B** (Tầng 8, đang đi LÊN):

```
Cùng hướng, phía trước thang máy
Chi phí = 10 - 8 = 2 ✅ TốT NHẤT
```

**Thang máy C** (Tầng 12, đang đi XUỐNG):

```
Sai hướng, phải hoàn thành quét
Chi phí = (12-1) + (10-1) + 100 = 120
```

**Quyết định**: Gán cho **Thang máy B** (chi phí = 2)

**Đường đi của Thang máy B**:

```
Trước: Hàng đợi = []
Sau: Hàng đợi = [10]

Đường đi: 8 → 9 → 10 (PHỤC VỤ)
```

### Ví Dụ 3: Mô Phỏng Giờ Cao Điểm (Rush Hour Simulation)

**Kịch bản**: Tòa nhà văn phòng, 8:30 AM, mọi người đến làm

**Thiết lập**:

```
Tầng: 20
Thang máy: 4
Tất cả bắt đầu tại: Tầng 1
```

**Yêu cầu** (đồng thời):

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

**Chiến lược phân phối** (SCAN):

**Thang máy 1**:

```
Được gán: Tầng 3, 5, 7
Hàng đợi: [3, 5, 7]
Đường đi: 1 → 3(S) → 5(S) → 7(S) → 20(E) → đảo chiều
```

**Thang máy 2**:

```
Được gán: Tầng 10, 12
Hàng đợi: [10, 12]
Đường đi: 1 → 10(S) → 12(S) → 20(E) → đảo chiều
```

**Thang máy 3**:

```
Được gán: Tầng 15, 18
Hàng đợi: [15, 18]
Đường đi: 1 → 15(S) → 18(S) → 20(E) → đảo chiều
```

**Thang máy 4**:

```
Được gán: Tầng 20
Hàng đợi: [20]
Đường đi: 1 → 20(S) → đảo chiều
```

**Kết quả**:

```
Tầng | Thời gian chờ | Được phục vụ bởi
------|---------------|------------------
3     | 3s            | Thang máy 1
5     | 5s            | Thang máy 1
7     | 7s            | Thang máy 1
10    | 10s           | Thang máy 2
12    | 12s           | Thang máy 2
15    | 15s           | Thang máy 3
18    | 18s           | Thang máy 3
20    | 20s           | Thang máy 4

Thời gian chờ trung bình: 11.25s
Thời gian chờ tối đa: 20s
Cân bằng tải: ✅
```

---

## 📝 Bài Tập Thực Hành

### Bài Tập 1: Tính Chi Phí (Cost Calculation)

**Đề bài**:

Tòa nhà 20 tầng có 3 thang máy:

- Thang máy A: Tầng 5, đang đi LÊN
- Thang máy B: Tầng 15, đang đi XUỐNG
- Thang máy C: Tầng 10, RẢNH

**Câu hỏi**: Tính chi phí cho mỗi thang máy khi có yêu cầu:

1. Tầng 12, hướng LÊN
2. Tầng 8, hướng XUỐNG
3. Tầng 18, hướng LÊN

**Đáp án**:

**Yêu cầu 1: Tầng 12, LÊN**

```
Thang máy A (Tầng 5, LÊN):
  Cùng hướng, phía trước
  Chi phí = 12 - 5 = 7 ✅

Thang máy B (Tầng 15, XUỐNG):
  Sai hướng
  Chi phí = (15-1) + (12-1) + 100 = 125

Thang máy C (Tầng 10, RẢNH):
  Chi phí = |10 - 12| = 2 ✅✅ TỐT NHẤT

Thắng cuộc: Thang máy C
```

**Yêu cầu 2: Tầng 8, XUỐNG**

```
Thang máy A (Tầng 5, LÊN):
  Sai hướng
  Chi phí = (20-5) + (20-8) + 100 = 127

Thang máy B (Tầng 15, XUỐNG):
  Cùng hướng, phía trước
  Chi phí = 15 - 8 = 7 ✅ TỐT NHẤT

Thang máy C (Tầng 10, RẢNH):
  Chi phí = |10 - 8| = 2 ✅✅ TỐT NHẤT

Thắng cuộc: Thang máy C (gần hơn)
```

**Yêu cầu 3: Tầng 18, LÊN**

```
Thang máy A (Tầng 5, LÊN):
  Cùng hướng, phía trước
  Chi phí = 18 - 5 = 13 ✅

Thang máy B (Tầng 15, XUỐNG):
  Sai hướng
  Chi phí = (15-1) + (18-1) + 100 = 131

Thang máy C (Tầng 10, RẢNH):
  Chi phí = |10 - 18| = 8 ✅✅ TỐT NHẤT

Thắng cuộc: Thang máy C
```

### Bài Tập 2: Vẽ Lộ Trình (Path Drawing)

**Đề bài**:

Thang máy tại tầng 6, đang đi LÊN, hàng đợi = [9, 15]
Yêu cầu mới (theo thứ tự):

1. Tầng 12, LÊN
2. Tầng 4, XUỐNG
3. Tầng 18, LÊN

**Câu hỏi**:

- Vẽ đường đi hoàn chỉnh của thang máy
- Tính tổng số tầng di chuyển
- Đánh dấu các lần đổi chiều

**Đáp án**:

**Trạng thái ban đầu**:

```
Tầng: 6
Hướng: LÊN
Hàng đợi: [9, 15]
```

**Yêu cầu 1**: Tầng 12, LÊN

```
Chèn vào hàng đợi (tăng dần):
Hàng đợi: [9, 12, 15]
```

**Yêu cầu 2**: Tầng 4, XUỐNG

```
Sai hướng, sẽ phục vụ sau khi đảo chiều
Lưu tạm thời
```

**Yêu cầu 3**: Tầng 18, LÊN

```
Chèn vào hàng đợi:
Hàng đợi: [9, 12, 15, 18, 20(phantom)]
```

**Đường đi hoàn chỉnh**:

```
Thời gian | Tầng | Hành động           | Hàng đợi
----------|------|---------------------|------------------
0         | 6    | Bắt đầu             | [9,12,15,18,20p]
3         | 9    | PHỤC VỤ tầng 9      | [12,15,18,20p]
6         | 12   | PHỤC VỤ tầng 12     | [15,18,20p]
9         | 15   | PHỤC VỤ tầng 15     | [18,20p]
12        | 18   | PHỤC VỤ tầng 18     | [20p]
14        | 20   | Đến extreme         | []
14        | 20   | ⟲ ĐẢO CHIỀU        | [4]
20        | 4    | PHỤC VỤ tầng 4      | []

Tầng di chuyển:
LÊN: 6→9→12→15→18→20 = 14 tầng
XUỐNG: 20→4 = 16 tầng
Tổng: 30 tầng

Đổi chiều: 1 lần (tại tầng 20)
```

### Bài Tập 3: Tối Ưu Hóa Cấu Hình (Optimize Configuration)

**Đề bài**:

Bạn thiết kế hệ thống thang máy cho:

- Tòa nhà văn phòng, 25 tầng
- Trung bình 200 nhân viên
- Giờ cao điểm: 8-9 AM (mọi người đến), 5-6 PM (mọi người về)

**Câu hỏi**:

1. Cần bao nhiêu thang máy?
2. Nên dùng SCAN hay LOOK?
3. Có cần phân vùng thang máy không?

**Đáp án**:

**1. Số lượng thang máy**:

**Tính toán**:

```
Giả định:
- Thời gian trung bình mỗi chuyến: 60s (25 tầng)
- Mỗi thang máy có thể thực hiện: 60 chuyến/giờ
- Giờ cao điểm: 200 người cần thang máy
- Mỗi chuyến chở: ~5 người

Số chuyến cần thiết: 200 / 5 = 40 chuyến/giờ

Số thang máy cần: 40 / 60 = 0.67 ≈ 1 thang máy (tối thiểu)

NHƯNG cộng thêm dự phòng cho:
- Yêu cầu đồng thời
- Giảm thiểu thời gian chờ
- Dự phòng

Đề xuất: 3-4 thang máy
```

**2. SCAN vs LOOK**:

**Đề xuất: SCAN**

**Lý do**:

```
Đặc điểm giờ cao điểm:
- Khối lượng lớn
- Cần công bằng (mọi người đều muốn thang máy!)
- Khả năng dự đoán quan trọng (biết thời gian chờ tối đa)

Ưu điểm của SCAN:
✅ Đảm bảo công bằng
✅ Không có bỏ đói
✅ Thời gian chờ tối đa có thể dự đoán: 2 × 25 × 1s = 50s

LOOK có thể:
⚠️ Hiệu quả hơn một chút
❌ Nhưng ít công bằng hơn trong giờ cao điểm
```

**3. Phân vùng (Zoning)**:

**Đề xuất: CÓ, phân vùng thang máy**

**Cấu hình**:

```javascript
{
  zones: [
    {
      name: 'Tầng thấp',
      elevators: [0, 1],
      floors: [1, 12],
      algorithm: 'SCAN'
    },
    {
      name: 'Tầng cao',
      elevators: [2, 3],
      floors: [13, 25],
      algorithm: 'SCAN'
    }
  ],

  // Sảnh (tầng 1) được phục vụ bởi tất cả
  lobbyElevator: 'all'
}
```

**Lợi ích**:

```
✅ Dịch vụ nhanh hơn (quét ngắn hơn)
✅ Phân phối tải tốt hơn
✅ Giảm thời gian chờ

Ví dụ:
Không có vùng:
  Yêu cầu tầng 25 từ tầng 1
  Xấu nhất: 1→25 = 24 tầng

Có vùng:
  Sử dụng thang máy tầng cao
  Bắt đầu từ tầng 13
  Chỉ tối đa 12 tầng
```

---

## ❓ Câu Hỏi Thường Gặp

### Q1: Tại sao SCAN phải đi đến điểm tận cùng (extreme) ngay cả khi không có yêu cầu?

**A**: Ba lý do chính:

**1. Công bằng (Fairness)**

```
Nếu không đi đến extreme:
- Tầng gần giữa được phục vụ nhiều
- Tầng ở extremes bị bỏ đói

Ví dụ:
Tòa nhà 20 tầng, thang máy ở giữa (tầng 10)
Không có extreme:
  - Tầng 8-12: Được phục vụ thường xuyên
  - Tầng 1-3, 18-20: Hiếm khi được phục vụ

Có extreme:
  - Tất cả tầng được phục vụ đều đặn mỗi 2 lần quét
```

**2. Khả năng dự đoán (Predictability)**

```
Người dùng biết:
- Thời gian chờ tối đa = 2 lần quét đầy đủ
- Có thể tính: 2 × 20 tầng × 1s = 40s tối đa

Ví dụ thực tế:
"Thang máy sẽ đến trong 40s" vs "Không biết bao lâu"
→ Trải nghiệm người dùng tốt hơn
```

**3. Đơn giản (Simplicity)**

```
Logic đơn giản:
- Không cần quyết định phức tạp
- Không có trường hợp đặc biệt
- Dễ triển khai trong hardware/software

Thay thế (như LOOK):
- Cần kiểm tra "còn yêu cầu phía trước không?"
- Logic phức tạp hơn
- Có thể có nhiều lỗi hơn
```

### Q2: Tầng ảo (Phantom floors) có ảnh hưởng đến hiệu suất không?

**A**: **KHÔNG** ảnh hưởng đáng kể.

**Lý do**:

```javascript
// Tầng ảo được bỏ qua nhanh
if (floor.isPhantom) {
  // Không có thao tác cửa
  // Không có người lên xuống
  // Chỉ đảo chiều

  time_at_phantom = 0s (đảo chiều ngay lập tức)
}

// Tầng thực
if (!floor.isPhantom) {
  door_open: 2.5s
  door_hold: 3s
  door_close: 2s

  time_at_real_floor = 7.5s
}
```

**Tác động**:

```
Với phantom: 0s overhead
Không có phantom: Nguy cơ không đi đến extreme → không công bằng

Đánh đổi: Đáng giá để đảm bảo công bằng
```

### Q3: SCAN có phù hợp với mọi tòa nhà không?

**A**: **KHÔNG**. Tùy thuộc vào loại tòa nhà.

**Phù hợp** ✅:

```
1. Tòa nhà cao tầng (>10 tầng)
   - Quét dài biện minh cho việc thăm extreme

2. Tòa nhà lưu lượng cao
   - Tòa nhà văn phòng
   - Khách sạn
   - Bệnh viện

3. Cần công bằng
   - Tòa nhà công cộng
   - Văn phòng chính phủ
```

**Không phù hợp** ❌:

```
1. Tòa nhà thấp tầng (<5 tầng)
   - LOOK hiệu quả hơn
   - Thăm extreme lãng phí

2. Lưu lượng thấp
   - Chung cư (ngoài giờ cao điểm)
   - Hiệu quả > Công bằng

3. Yêu cầu đặc biệt
   - Thang máy chỉ dành cho khẩn cấp
   - Thang máy hàng hóa (dùng FCFS)
```

### Q4: Làm sao tối ưu hóa SCAN cho giờ cao điểm?

**A**: Nhiều chiến lược:

**Chiến lược 1: Điều khiển nhóm (Group Control)**

```javascript
// Trong giờ cao điểm LÊN (buổi sáng)
elevators.forEach(e => {
  if (e.direction === 'idle') {
    e.direction = 'up'  // Định vị trước
    e.startFloor = 1    // Chờ tại sảnh
  }
})
```

**Chiến lược 2: Phân vùng (Zone Assignment)**

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

**Chiến lược 3: Chế độ tốc hành (Express Mode)**

```javascript
// Một số thang máy bỏ qua tầng
elevator[0]: {
  floors: [1, 5, 10, 15, 20, 25, 30],  // Tốc hành
  algorithm: 'SCAN'
}

elevator[1-4]: {
  floors: [1...30],  // Nội thành
  algorithm: 'SCAN'
}
```

### Q5: SCAN có biến thể nào?

**A**: Nhiều biến thể:

**C-SCAN (Circular SCAN)**:

```
SCAN bình thường:
LÊN: 1→20, XUỐNG: 20→1

C-SCAN:
LÊN: 1→20, DỊCH CHUYỂN: 20→1, LÊN: 1→20...
Luôn luôn một hướng

Ưu điểm: Thời gian chờ đồng đều hơn
```

**LOOK**:

```
Như SCAN nhưng:
- Không đi đến extreme
- Đảo chiều khi không còn yêu cầu

Ưu điểm: Hiệu quả hơn
Nhược điểm: Ít công bằng hơn
```

**N-Step-SCAN**:

```
Gom yêu cầu thành nhóm
Xử lý N yêu cầu, sau đó chấp nhận yêu cầu mới

Ưu điểm: Ngăn chặn bỏ đói từ yêu cầu liên tục
```

**FSCAN (Freeze SCAN)**:

```
Hai hàng đợi:
- Hoạt động: Đang được phục vụ
- Chờ: Yêu cầu mới

Sau khi quét, hoán đổi hàng đợi

Ưu điểm: Thời gian chờ có giới hạn
```

### Q6: Mã nguồn (Source code) ở đâu trong dự án?

**A**:

```
Triển khai chính:
/src/algorithms/scanAlgorithm.js

Các hàm chính:
- scanAlgorithm()        // Chọn thang máy
- calculateCost()        // Tính chi phí
- insertIntoQueueSCAN()  // Quản lý hàng đợi

Tích hợp:
/src/hooks/useElevatorSystem.js
- ensureSCANExtreme()    // Logic tầng ảo
- Line 264-266           // Xử lý extreme của SCAN

Tests:
/src/algorithms/scanAlgorithm.test.js
- 227 dòng tests
- Các trường hợp đặc biệt được bao phủ
```

### Q7: Làm sao kiểm tra hành vi SCAN trong simulator?

**A**: Làm theo kịch bản này:

**Test 1: Hành vi extreme**

```
1. Cấu hình: 10 tầng, 1 thang máy, SCAN
2. Thang máy ở tầng 1, RẢNH
3. Gọi tầng 5 LÊN
4. Chờ đến khi thang máy ở tầng 3
5. Gọi tầng 3 XUỐNG
6. Quan sát: Thang máy tiếp tục đến 5 → 10 (extreme!) → đảo chiều → 3
✅ Xác nhận thăm extreme
```

**Test 2: Công bằng**

```
1. Cấu hình: 20 tầng, 2 thang máy
2. Tạo 10 yêu cầu ngẫu nhiên
3. Kiểm tra thống kê:
   - Thời gian chờ tối đa < 2 × 20 = 40s ✅
   - Không có yêu cầu nào bị bỏ qua ✅
```

**Test 3: Tính chi phí**

```
1. Chế độ thủ công
2. Ghi chú vị trí thang máy
3. Tính chi phí kỳ vọng thủ công
4. Chuyển sang AUTO (SCAN)
5. Kiểm tra thang máy nào được chọn
✅ Xác minh hàm chi phí hoạt động
```

---

## 📚 Tài Liệu Tham Khảo

### Các Bài Báo Học Thuật (Academic Papers)

1. **Denning, P. J.** (1967). "Effects of scheduling on file memory operations." *AFIPS Proceedings*, 9-21.
   - Bài báo thuật toán SCAN gốc

2. **Geist, R., & Daniel, S.** (1987). "A continuum of disk scheduling algorithms." *ACM Transactions on Computer Systems*, 5(1), 77-92.
   - Phân tích toàn diện các biến thể SCAN

3. **Barney, G. C.** (2003). *Elevator Traffic Handbook: Theory and Practice*.
   - Tiêu chuẩn công nghiệp cho hệ thống thang máy

### Tài Nguyên Trực Tuyến (Online Resources)

- [Wikipedia: Elevator Algorithm](https://en.wikipedia.org/wiki/Elevator_algorithm)
- [OS Dev: Disk Scheduling](https://wiki.osdev.org/Disk_Scheduling)
- [Elevator Saga Game](https://play.elevatorsaga.com/) - Học tập tương tác

### Sách (Books)

- **Silberschatz, Galvin, Gagne** (2018). *Operating System Concepts* (10th ed.)
  - Chương 9: Mass-Storage Structure

- **Tanenbaum, A. S.** (2014). *Modern Operating Systems* (4th ed.)
  - Phần về lập lịch I/O

---

## 🎓 Tóm Tắt

### Những Điểm Chính (Key Takeaways)

1. ✅ **SCAN = Công bằng + Khả năng dự đoán**
   - Đảm bảo mọi yêu cầu được phục vụ
   - Thời gian chờ tối đa có thể dự đoán

2. ⚡ **Phải Đi Đến Điểm Tận Cùng (Must Go to Extreme)**
   - Không phải lỗi, là tính năng!
   - Đảm bảo công bằng và ngăn chặn bỏ đói

3. 🏢 **Tiêu Chuẩn Công Nghiệp (Industry Standard)**
   - Sử dụng trong >90% thang máy thương mại
   - Đã được chứng minh trong thực tế

4. 📊 **Đánh Đổi (Trade-offs)**
   - Công bằng ✅ / Hiệu quả ⚠️
   - Tốt hơn SSTF, ít hiệu quả hơn LOOK

5. 🔧 **Có Thể Tùy Chỉnh (Customizable)**
   - Các biến thể: C-SCAN, LOOK, FSCAN
   - Có thể tối ưu hóa cho tòa nhà cụ thể

### Khi Nào Dùng SCAN?

✅ **Dùng khi**:

- Tòa nhà cao tầng (>10 tầng)
- Lưu lượng cao
- Yêu cầu công bằng
- Khả năng dự đoán quan trọng

❌ **Không dùng khi**:

- Tòa nhà thấp tầng (<5 tầng) → dùng LOOK
- Lưu lượng thấp → dùng LOOK
- Chỉ khẩn cấp → dùng dựa trên ưu tiên

---

**Chúc bạn học tốt! 🚀**

*Phiên bản tài liệu: 1.0*
*Cập nhật lần cuối: 2025-11-08*
*Phản hồi: [GitHub Issues](https://github.com/kinhluan/simple-elevator-simulator/issues)*
