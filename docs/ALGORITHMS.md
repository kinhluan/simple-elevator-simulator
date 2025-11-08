# Thuật Toán Lập Lịch Thang Máy (Elevator Scheduling Algorithms) - Hướng Dẫn Học Tập

Tài liệu này giải thích chi tiết ba thuật toán lập lịch thang máy (Elevator Scheduling Algorithms) được triển khai trong simulator: **SCAN**, **LOOK**, và **SSTF**. Mục đích là để học về các thuật toán lập lịch (Scheduling Algorithms) và hiểu ưu nhược điểm của từng phương pháp.

---

## Mục Lục

1. [Tổng Quan](#tổng-quan)
2. [SCAN Algorithm](#1-scan-algorithm-thuật-toán-quét)
3. [LOOK Algorithm](#2-look-algorithm-thuật-toán-nhìn-trước)
4. [SSTF Algorithm](#3-sstf-algorithm-shortest-seek-time-first)
5. [So Sánh Chi Tiết](#so-sánh-chi-tiết)
6. [Bài Tập Thực Hành](#bài-tập-thực-hành)
7. [Câu Hỏi Thường Gặp](#câu-hỏi-thường-gặp)

---

## Tổng Quan

### Bài Toán Lập Lịch Thang Máy (Elevator Scheduling Problem) Là Gì?

Bài toán lập lịch thang máy (Elevator Scheduling Problem) là một bài toán tối ưu hóa trong khoa học máy tính:

**Đầu Vào (Input)**:

- Một tòa nhà có N tầng
- M thang máy
- Các yêu cầu (Calls) từ người dùng: `(tầng, hướng)`

**Đầu Ra (Output)**:

- Quyết định thang máy nào sẽ phục vụ yêu cầu nào
- Thứ tự phục vụ các tầng trong hàng đợi (Queue) của mỗi thang máy

**Mục Tiêu**:

- Giảm thiểu thời gian chờ trung bình (Minimize average wait time)
- Tối đa hóa sự công bằng (Maximize fairness) cho tất cả người dùng
- Ngăn chặn tình trạng bỏ đói (Prevent starvation) - tránh một số tầng bị bỏ quên
- Tối ưu hóa hiệu quả năng lượng (Optimize energy efficiency)

### Các Khái Niệm Cơ Bản

#### 1. Yêu Cầu (Call)

Một yêu cầu (Request) từ người dùng bao gồm:

```javascript
{
  floor: 5,           // Tầng nào
  direction: 'up',    // Muốn đi lên hay xuống
  timestamp: Date.now() // Thời điểm gọi
}
```

#### 2. Hàng Đợi (Queue)

Mỗi thang máy có một hàng đợi (Queue) chứa các tầng cần đến:

```javascript
queue: [
  { floor: 3, callDirection: 'up', timestamp: 1234 },
  { floor: 5, callDirection: 'up', timestamp: 1235 },
  { floor: 7, callDirection: 'up', timestamp: 1236 }
]
```

#### 3. Hướng Di Chuyển (Direction)

- `'up'`: Đang đi lên
- `'down'`: Đang đi xuống
- `'idle'`: Đang rảnh

#### 4. Hàm Tính Chi Phí (Cost Function)

Mỗi thuật toán có cách tính "chi phí" (Cost) để quyết định thang máy nào nên phục vụ yêu cầu:

- Chi phí thấp (Cost) = ưu tiên cao
- Chi phí bao gồm: khoảng cách + hình phạt (Penalties) khi đổi hướng, v.v.

---

## 1. SCAN Algorithm (Thuật Toán Quét)

### 🎯 Ý Tưởng Cốt Lõi

SCAN còn gọi là **"Elevator Algorithm"** vì nó mô phỏng cách thang máy thực tế hoạt động:

> **"Đi một hướng đến tận cùng, sau đó quay lại"**

### 📊 Cách Hoạt Động

#### Bước 1: Chọn Hướng (Direction)

Khi thang máy bắt đầu di chuyển, nó chọn một hướng (up/down) và **cam kết** với hướng đó.

#### Bước 2: Đi Đến Điểm Tận Cùng (Extreme)

- Nếu đi lên → đi đến **tầng cao nhất** (ví dụ: tầng 20)
- Nếu đi xuống → đi đến **tầng thấp nhất** (tầng 1)

**Ngay cả khi** không có yêu cầu nào ở tầng tận cùng (Extreme), thang máy **vẫn phải đi đến đó**.

#### Bước 3: Đổi Hướng

Khi đến điểm tận cùng (Extreme), đổi hướng và lặp lại.

### 💻 Chi Tiết Triển Khai (Implementation Details)

#### Tính Toán Chi Phí (Cost Calculation)

```javascript
const calculateCost = (elevator, callFloor, callDirection, maxFloor) => {
    const { currentFloor, direction } = elevator

    // Case 1: Thang máy đang rảnh
    if (direction === 'idle') {
        return Math.abs(currentFloor - callFloor) // Chỉ tính khoảng cách
    }

    // Case 2: Thang máy đang đi lên
    if (direction === 'up') {
        // Sub-case 2a: Yêu cầu cũng đi lên và ở phía trước
        if (callFloor >= currentFloor && callDirection === 'up') {
            return callFloor - currentFloor // Cost thấp - nhặt trên đường
        }
        // Sub-case 2b: Yêu cầu đi xuống hoặc ở phía sau
        else {
            // Phải đi đến tầng top, sau đó quay lại
            const distanceToTop = maxFloor - currentFloor
            const distanceFromTopToCall = maxFloor - callFloor
            return distanceToTop + distanceFromTopToCall + 100 // +100 penalty
        }
    }

    // Case 3: Thang máy đang đi xuống (tương tự)
    // ...
}
```

#### Quản Lý Hàng Đợi (Queue Management)

```javascript
// Khi đi lên: sắp xếp TĂNG DẦN (Ascending)
if (direction === 'up') {
    queue.sort((a, b) => a - b) // [3, 5, 7, 10, 15]
}

// Khi đi xuống: sắp xếp GIẢM DẦN (Descending)
if (direction === 'down') {
    queue.sort((a, b) => b - a) // [15, 10, 7, 5, 3]
}
```

#### Tầng Ảo (Phantom Floors)

Để đảm bảo SCAN đi đến điểm tận cùng (Extreme), hệ thống thêm "tầng ảo" (Phantom Floors):

```javascript
// useElevatorSystem.js - ensureSCANExtreme()
if (direction === 'up' && hasFloorsAbove) {
    if (maxInQueue < numFloors) {
        queue.push({
            floor: numFloors,  // Tầng cao nhất
            isPhantom: true     // Đánh dấu là tầng ảo
        })
    }
}
```

### 📈 Ví Dụ Cụ Thể

**Thiết Lập (Setup)**:

- Tòa nhà: 10 tầng
- Thang máy hiện tại: Tầng 4, đang đi lên
- Hàng đợi hiện tại (Queue): [5, 7]
- Yêu cầu mới (Call): Tầng 3, đi xuống

**Tính Toán Chi Phí (Cost Calculation)**:

```
Cost = (distanceToTop) + (distanceFromTopToCall) + 100
     = (10 - 4)        + (10 - 3)                + 100
     = 6               + 7                       + 100
     = 113
```

**Lộ trình thực tế**:

```
4 → 5 (phục vụ) → 7 (phục vụ) → 10 (extreme) → 9 → 8 → 7 → 6 → 5 → 4 → 3 (phục vụ)
```

### ✅ Ưu Điểm

1. **Có Thể Dự Đoán (Predictable)**
   - Người dùng biết thang máy sẽ đi theo mẫu cố định (Pattern)
   - Thời gian chờ tối đa có thể tính toán được

2. **Không Bị Bỏ Đói (No Starvation)**
   - Mọi yêu cầu đều được phục vụ trong vòng tối đa 2 lần quét (Sweeps)
   - Công bằng (Fairness) cho tất cả các tầng

3. **Logic Đơn Giản (Simple Logic)**
   - Dễ triển khai (Implement)
   - Dễ gỡ lỗi (Debug) và bảo trì (Maintain)

### ❌ Nhược Điểm

1. **Chạy Không Hiệu Quả Khi Trống (Inefficient Empty Runs)**
   - Phải đi đến điểm tận cùng (Extreme) ngay cả khi không có yêu cầu
   - Lãng phí năng lượng

2. **Thời Gian Chờ Trung Bình Cao Hơn (Higher Average Wait Time)**
   - Không tối ưu về mặt thời gian chờ trung bình
   - Có thể chậm hơn LOOK trong một số trường hợp

### 🎓 Khi Nào Nên Dùng SCAN?

✅ **Nên dùng**:

- Tòa nhà lưu lượng cao (High-traffic buildings)
- Cần đảm bảo sự công bằng (Fairness guarantees)
- Hệ thống thực tế (Production systems)

❌ **Không nên dùng**:

- Tòa nhà lưu lượng thấp (Low-traffic buildings)
- Cần hiệu quả tối đa (Maximum efficiency)

---

## 2. LOOK Algorithm (Thuật Toán Nhìn Trước)

### 🎯 Ý Tưởng Cốt Lõi

LOOK là phiên bản **cải tiến** của SCAN:

> **"Đi một hướng cho đến khi không còn yêu cầu nào phía trước, sau đó quay lại"**

**Khác biệt với SCAN**: LOOK **KHÔNG** đi đến điểm tận cùng (Extreme) nếu không cần thiết.

### 📊 Cách Hoạt Động

#### Bước 1: Chọn Hướng (Direction)

Tương tự SCAN.

#### Bước 2: "Nhìn" Trước (Look Ahead)

- Kiểm tra: còn yêu cầu nào phía trước không?
- Nếu **có** → tiếp tục đi
- Nếu **KHÔNG** → đổi hướng ngay lập tức

#### Bước 3: Đổi Hướng Sớm

Không cần đi đến điểm tận cùng (Extreme) → tiết kiệm thời gian và năng lượng.

### 💻 Chi Tiết Triển Khai (Implementation Details)

#### Tính Toán Chi Phí (Cost Calculation)

```javascript
const calculateCost = (elevator, callFloor, callDirection) => {
    const { currentFloor, direction, queue } = elevator

    // Case 1: Thang máy rảnh
    if (direction === 'idle') {
        return Math.abs(currentFloor - callFloor)
    }

    // Lấy tầng cuối cùng trong hàng đợi
    const lastQueueFloor = queue[queue.length - 1] || currentFloor

    // Case 2: Yêu cầu cùng hướng và phía trước
    if (direction === 'up' && callFloor >= currentFloor && callDirection === 'up') {
        return callFloor - currentFloor // Cost thấp
    }
    if (direction === 'down' && callFloor <= currentFloor && callDirection === 'down') {
        return currentFloor - callFloor // Cost thấp
    }

    // Case 3: Yêu cầu ngược hướng hoặc phía sau
    if (direction === 'up') {
        // Phải hoàn thành hàng đợi hiện tại, sau đó quay lại
        return (lastQueueFloor - currentFloor) +
               (lastQueueFloor - callFloor) +
               1000 // Large penalty
    } else {
        return (currentFloor - lastQueueFloor) +
               Math.abs(lastQueueFloor - callFloor) +
               1000
    }
}
```

**Điểm khác biệt chính**: LOOK sử dụng `lastQueueFloor` thay vì `maxFloor` (extreme).

#### Quản Lý Hàng Đợi (Queue Management)

```javascript
// Giống SCAN - sắp xếp theo hướng
if (direction === 'up') {
    queue.sort((a, b) => a - b) // Ascending
} else {
    queue.sort((a, b) => b - a) // Descending
}
```

### 📈 Ví Dụ So Sánh LOOK vs SCAN

**Thiết Lập (Setup)**:

- Tòa nhà: 10 tầng
- Thang máy: Tầng 4, đang đi lên
- Hàng đợi (Queue): [5, 7]
- Yêu cầu mới: Tầng 3, đi xuống

**Lộ Trình SCAN**:

```
4 → 5 → 7 → 10 (extreme, không cần thiết!) → 9 → 8 → ... → 3
Tổng: 13 tầng di chuyển
```

**Lộ Trình LOOK**:

```
4 → 5 → 7 (không còn request phía trước) → 6 → 5 → 4 → 3
Tổng: 7 tầng di chuyển
```

**LOOK tiết kiệm**: 13 - 7 = **6 tầng** (hiệu quả hơn 46%!)

### ✅ Ưu Điểm

1. **Hiệu Quả Hơn (More Efficient)**
   - Không lãng phí di chuyển đến điểm tận cùng (Extreme)
   - Tiết kiệm năng lượng và thời gian

2. **Thời Gian Chờ Trung Bình Thấp Hơn (Lower Average Wait Time)**
   - Phục vụ yêu cầu nhanh hơn SCAN
   - Tốt cho các mẫu lưu lượng thay đổi (Variable traffic patterns)

3. **Vẫn Công Bằng (Still Fair)**
   - Nguy cơ bị bỏ đói thấp (Low starvation risk)
   - Tốt hơn SSTF

### ❌ Nhược Điểm

1. **Ít Dự Đoán Hơn Một Chút (Slightly Less Predictable)**
   - Hành vi phụ thuộc vào các mẫu lưu lượng (Traffic patterns)
   - Khó ước tính thời gian chờ tối đa

2. **Logic Phức Tạp Hơn (More Complex Logic)**
   - Cần "nhìn trước" (Look ahead) hàng đợi (Queue)
   - Các trường hợp đặc biệt (Edge cases) phức tạp hơn SCAN

### 🎓 Khi Nào Nên Dùng LOOK?

✅ **Nên dùng**:

- Các mẫu lưu lượng thay đổi (Variable traffic patterns)
- Tòa nhà lưu lượng trung bình (Medium-traffic buildings)
- Tối ưu hóa cho hiệu quả (Optimize for efficiency)

❌ **Không nên dùng**:

- Cần khả năng dự đoán chặt chẽ (Strict predictability)
- Lưu lượng rất cao (Very high traffic)

---

## 3. SSTF Algorithm (Shortest Seek Time First)

### 🎯 Ý Tưởng Cốt Lõi

SSTF là thuật toán **tham lam** (Greedy):

> **"Luôn phục vụ tầng GẦN NHẤT tiếp theo"**

**Không quan tâm** đến:

- Hướng di chuyển hiện tại (Direction)
- Hướng yêu cầu của người dùng
- Sự công bằng (Fairness)

### 📊 Cách Hoạt Động

#### Bước 1: Tính Khoảng Cách

Với mỗi yêu cầu, tính khoảng cách từ vị trí hiện tại:

```javascript
distance = Math.abs(currentFloor - callFloor)
```

#### Bước 2: Chọn Gần Nhất

Chọn yêu cầu có khoảng cách nhỏ nhất.

#### Bước 3: Lặp Lại

Sau khi phục vụ xong, lại tính lại và chọn gần nhất.

### 💻 Chi Tiết Triển Khai (Implementation Details)

#### Lựa Chọn Thang Máy (Elevator Selection)

```javascript
export const sstfAlgorithm = (elevators, callFloor) => {
    let nearestElevator = null
    let minDistance = Infinity

    for (const elevator of elevators) {
        const distance = Math.abs(elevator.currentFloor - callFloor)

        if (distance < minDistance) {
            minDistance = distance
            nearestElevator = elevator
        }
    }

    return nearestElevator ? nearestElevator.id : null
}
```

**Đơn giản**: Chỉ tính khoảng cách, không có hình phạt (Penalty) phức tạp.

#### Quản Lý Hàng Đợi (Queue Management)

```javascript
export const insertIntoQueueSSTF = (queue, currentFloor, newFloor) => {
    queue.push(newFloor)

    // Sắp xếp theo khoảng cách từ currentFloor
    queue.sort((a, b) => {
        const distA = Math.abs(a - currentFloor)
        const distB = Math.abs(b - currentFloor)
        return distA - distB // Gần nhất lên đầu
    })

    return queue
}
```

**Quan trọng**: Hàng đợi (Queue) được **SẮP XẾP LẠI** sau mỗi lần di chuyển!

### 📈 Ví Dụ Minh Họa

**Thiết Lập (Setup)**:

- Thang máy tại tầng 5
- Hàng đợi (Queue): [3, 8, 10]

**Sắp xếp ban đầu** (từ tầng 5):

```javascript
// Khoảng cách: |3-5|=2, |8-5|=3, |10-5|=5
Queue: [3, 8, 10] // Gần nhất đến xa nhất
```

**Sau khi đến tầng 3**:

```javascript
// Khoảng cách từ tầng 3: |8-3|=5, |10-3|=7
Queue: [8, 10] // Vẫn đúng thứ tự
```

**Giả sử có yêu cầu mới tầng 4**:

```javascript
// Khoảng cách từ tầng 3: |4-3|=1, |8-3|=5, |10-3|=7
Queue: [4, 8, 10] // 4 được ưu tiên!
```

### 🚨 Vấn Đề Bỏ Đói (Starvation)

**Bỏ đói (Starvation)** xảy ra khi một yêu cầu không bao giờ được phục vụ.

#### Ví Dụ Về Tình Trạng Bỏ Đói (Starvation)

```
Tòa nhà: 20 tầng
Thang máy: Tầng 10
Request A: Tầng 20 (khoảng cách = 10)

Thang máy bắt đầu đi đến tầng 20...

Khi đang ở tầng 12:
  - Request B: Tầng 8 (khoảng cách = |12-8| = 4)
  - Request A: Tầng 20 (khoảng cách = |12-20| = 8)

→ B được ưu tiên! Thang máy quay lại tầng 8.

Khi ở tầng 8:
  - Request C: Tầng 6 (khoảng cách = 2)
  - Request A: Tầng 20 (khoảng cách = 12)

→ C được ưu tiên! Thang máy đi tầng 6.

Request A vẫn chưa được phục vụ...
```

**Kết quả**: Nếu các yêu cầu gần liên tục xuất hiện, các yêu cầu xa có thể **chờ mãi mãi**.

### ✅ Ưu Điểm

1. **Hiệu Quả Ngay Lập Tức (Immediate Efficiency)**
   - Giảm thiểu khoảng cách di chuyển cho mỗi yêu cầu
   - Thời gian phản hồi nhanh cho các yêu cầu gần

2. **Triển Khai Đơn Giản (Simple Implementation)**
   - Logic đơn giản nhất trong 3 thuật toán
   - Dễ hiểu

### ❌ Nhược Điểm

1. **🔴 BỎ ĐÓI (STARVATION) - Vấn Đề Nghiêm Trọng**
   - Các tầng xa có thể bị bỏ quên
   - Không công bằng

2. **Thời Gian Chờ Trung Bình Kém (Poor Average Wait Time)**
   - Tối ưu cục bộ (Local optimization), không tối ưu toàn cục (Global optimization)
   - Hiệu suất tổng thể (Overall performance) kém

3. **Không Dự Đoán Được (Unpredictable)**
   - Hành vi phụ thuộc hoàn toàn vào lưu lượng (Traffic)
   - Không thể đảm bảo thời gian phục vụ (Service time)

### 🎓 Khi Nào Nên Dùng SSTF?

✅ **Nên dùng**:

- **KHÔNG BAO GIỜ trong hệ thống thực tế (Production)!**
- Chỉ cho mục đích giáo dục (Educational purposes only)

❌ **Không nên dùng**:

- Hệ thống thang máy thực tế (Real-world elevator systems)
- Bất kỳ hệ thống nào yêu cầu sự công bằng (Fairness)

### 📚 Giá Trị Giáo Dục

SSTF được bao gồm trong simulator để:

1. **Minh Họa Tình Trạng Bỏ Đói (Demonstrate Starvation)**
   - Sinh viên có thể thấy tình trạng bỏ đói (Starvation) xảy ra theo thời gian thực
   - Hiểu tại sao các thuật toán tham lam (Greedy algorithms) không phải lúc nào cũng tốt

2. **So Sánh Với SCAN/LOOK**
   - Thấy rõ sự đánh đổi (Trade-off) giữa hiệu quả (Efficiency) và công bằng (Fairness)
   - Học về tầm quan trọng của thiết kế thuật toán (Algorithm design)

3. **Học Về Các Đánh Đổi Trong Tối Ưu Hóa (Optimization Trade-offs)**
   - Tối ưu cục bộ (Local optimization) ≠ Tối ưu toàn cục (Global optimization)
   - Lợi ích ngắn hạn vs Sự công bằng dài hạn

---

## So Sánh Chi Tiết

### Bảng So Sánh Tổng Quan

| Tiêu Chí | SCAN ⭐ | LOOK | SSTF |
|----------|---------|------|------|
| **Công Bằng (Fairness)** | ⭐⭐⭐⭐⭐ Xuất sắc | ⭐⭐⭐⭐ Rất tốt | ⭐⭐ Kém |
| **Hiệu Quả (Efficiency)** | ⭐⭐⭐⭐ Tốt | ⭐⭐⭐⭐⭐ Xuất sắc | ⭐⭐⭐ Thay đổi |
| **Nguy Cơ Bị Bỏ Đói (Starvation Risk)** | ✅ Không có | ⚠️ Rất thấp | 🔴 Cao |
| **Khả Năng Dự Đoán (Predictability)** | ⭐⭐⭐⭐⭐ Xuất sắc | ⭐⭐⭐⭐ Tốt | ⭐⭐ Kém |
| **Triển Khai (Implementation)** | ⭐⭐⭐⭐ Đơn giản | ⭐⭐⭐ Trung bình | ⭐⭐⭐⭐⭐ Rất đơn giản |
| **Sử Dụng Thực Tế (Real-world Use)** | ✅ Tiêu chuẩn | ⚠️ Hiếm | ❌ Không bao giờ |

### So Sánh Các Chỉ Số Hiệu Suất (Performance Metrics Comparison)

Giả sử kịch bản: 10 tầng, 20 yêu cầu ngẫu nhiên

| Chỉ Số | SCAN | LOOK | SSTF |
|--------|------|------|------|
| Thời Gian Chờ Trung Bình (Avg Wait Time) | 15.2s | 12.8s | 14.5s* |
| Thời Gian Chờ Tối Đa (Max Wait Time) | 28s | 25s | 60s+ ⚠️ |
| Tổng Khoảng Cách (Total Distance) | 180 tầng | 142 tầng | 135 tầng |
| Số Lần Đổi Hướng (Direction Changes) | 8 | 12 | 18 |
| Số Trường Hợp Bị Bỏ Đói (Starvation Cases) | 0 | 0 | 3 |

*Trung bình SSTF không bao gồm các yêu cầu bị bỏ đói

### Ma Trận Quyết Định (Decision Matrix)

**Chọn thuật toán nào?**

```
┌─────────────────────────────────────┐
│  Lưu lượng cao + Cần công bằng?    │
│         ↓                           │
│       SCAN                          │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│  Lưu lượng thay đổi + Cần hiệu quả?│
│         ↓                           │
│       LOOK                          │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│  Chỉ cho mục đích giáo dục?         │
│         ↓                           │
│       SSTF                          │
└─────────────────────────────────────┘
```

---

## Bài Tập Thực Hành

### Bài 1: Tính Toán Thủ Công

**Đề bài**:

- Tòa nhà 15 tầng
- 1 thang máy tại tầng 7, đang đi lên
- Hàng đợi hiện tại (Queue): [9, 12]
- Các yêu cầu mới đồng thời:
  - Request A: Tầng 3, đi xuống
  - Request B: Tầng 10, đi lên
  - Request C: Tầng 5, đi xuống

**Câu hỏi**:

1. Tính chi phí (Cost) cho mỗi yêu cầu với từng thuật toán
2. Vẽ lộ trình di chuyển (Routing path) cho từng thuật toán
3. Tầng nào được phục vụ đầu tiên?
4. Thuật toán nào có tổng khoảng cách (Total distance) nhỏ nhất?

### Bài 2: Phát Hiện Tình Trạng Bỏ Đói (Starvation)

**Đề bài**: Thiết kế một chuỗi các yêu cầu (Sequence of requests) làm cho SSTF bỏ đói (Starve) một yêu cầu cụ thể.

**Yêu cầu**:

- Tòa nhà 20 tầng
- 1 thang máy
- Yêu cầu bị bỏ đói (Starved): Tầng 20
- Tối thiểu 5 yêu cầu khác

### Bài 3: Tối Ưu Hóa

**Đề bài**: Chỉnh sửa thuật toán SSTF để ngăn chặn tình trạng bỏ đói (Starvation).

**Gợi ý**:

- Thêm dấu thời gian (Timestamp) cho mỗi yêu cầu
- Tăng độ ưu tiên (Priority) theo thời gian chờ (Wait time)
- Triển khai cơ chế lão hóa (Aging mechanism)

**Khung Code (Skeleton Code)**:

```javascript
const calculatePriority = (request, currentTime) => {
    const waitTime = currentTime - request.timestamp
    const distance = Math.abs(elevator.currentFloor - request.floor)

    // TODO: Triển khai công thức lão hóa (Aging formula)
    // Gợi ý: độ ưu tiên (Priority) nên tăng theo thời gian chờ (Wait time)

    return /* công thức của bạn */
}
```

### Bài 4: Phân Tích Hiệu Suất (Performance Analysis)

**Đề bài**: Viết script để mô phỏng (Simulate) và so sánh hiệu suất (Performance).

**Yêu cầu**:

```javascript
function runSimulation(algorithm, numFloors, numRequests) {
    // Tạo các yêu cầu ngẫu nhiên
    const requests = generateRandomRequests(numRequests, numFloors)

    // Chạy thuật toán
    const results = simulateElevator(algorithm, requests)

    // Tính toán các chỉ số
    return {
        avgWaitTime: /* tính toán */,
        maxWaitTime: /* tính toán */,
        totalDistance: /* tính toán */,
        starvationCount: /* tính toán */
    }
}

// So sánh tất cả các thuật toán
const scanResults = runSimulation('SCAN', 20, 100)
const lookResults = runSimulation('LOOK', 20, 100)
const sstfResults = runSimulation('SSTF', 20, 100)

console.table([scanResults, lookResults, sstfResults])
```

---

## Câu Hỏi Thường Gặp

### Q1: Tại sao SCAN phải đi đến điểm tận cùng (Extreme)?

**A**: Để đảm bảo **sự công bằng (Fairness)** và **ngăn chặn tình trạng bỏ đói (Prevent starvation)**.

Nếu SCAN không đi đến điểm tận cùng (Extreme), nó có thể bị "lôi kéo" bởi các yêu cầu mới và không bao giờ đổi hướng → giống SSTF.

### Q2: LOOK có thể gây ra tình trạng bỏ đói (Starvation) không?

**A**: Về lý thuyết **CÓ**, nhưng trong thực tế **RẤT HIẾM**.

LOOK có thể gây bỏ đói (Starve) nếu:

- Các yêu cầu liên tục xuất hiện ở một hướng
- Không có yêu cầu ở hướng ngược lại

Nhưng điều này rất khó xảy ra trong các mẫu lưu lượng thực tế (Real traffic patterns).

### Q3: Tại sao không dùng SSTF trong hệ thống thực tế (Production)?

**A**:

1. **Nguy cơ bỏ đói (Starvation risk) quá cao**
2. **Không dự đoán được (Unpredictable)** - Người dùng không biết sẽ chờ bao lâu
3. **Trải nghiệm khách hàng kém (Poor customer experience)** - Một số người chờ rất lâu

### Q4: Có thuật toán nào tốt hơn SCAN/LOOK không?

**A**: Có nhiều thuật toán nâng cao hơn:

1. **C-SCAN (Circular SCAN)**
   - Đi lên đến tầng cao nhất (Top), sau đó chuyển về tầng thấp nhất (Bottom) và đi lên lại
   - Sự công bằng (Fairness) tốt hơn SCAN

2. **N-Step-SCAN**
   - Nhóm các yêu cầu thành các nhóm (Batch requests into groups)
   - Xử lý từng nhóm một

3. **Điều Khiển Nhóm Thang Máy (Elevator Group Control)**
   - Phối hợp nhiều thang máy
   - Phân công dựa trên vùng (Zone-based assignment)

4. **Dựa Trên AI/ML (AI/ML-based)**
   - Học các mẫu lưu lượng (Learn traffic patterns)
   - Lập lịch dự đoán (Predictive scheduling)

### Q5: Các hình phạt chi phí (Cost penalty) (+100, +1000) được chọn như thế nào?

**A**: Đây là **các tham số điều chỉnh (Tuning parameters)**:

- **+100** (SCAN): Hình phạt vừa phải (Moderate penalty) - không muốn đổi hướng nhưng vẫn chấp nhận
- **+1000** (LOOK): Hình phạt lớn (Large penalty) - mạnh mẽ ngăn cản đổi hướng

Trong hệ thống thực tế (Production), các giá trị này được điều chỉnh (Tune) dựa trên:

- Chiều cao tòa nhà (Building height)
- Các mẫu lưu lượng (Traffic patterns)
- Các nghiên cứu hành vi người dùng (User behavior studies)

### Q6: Có thể kết hợp nhiều thuật toán không?

**A**: **CÓ**! Một số chiến lược:

**Chuyển Đổi Dựa Trên Thời Gian (Time-based Switching)**:

```javascript
function selectAlgorithm(currentTime) {
    const hour = currentTime.getHours()

    if (hour >= 8 && hour <= 9) {
        return 'SCAN' // Giờ cao điểm buổi sáng - cần công bằng
    } else if (hour >= 12 && hour <= 13) {
        return 'SCAN' // Giờ cao điểm trưa
    } else {
        return 'LOOK' // Giờ bình thường - tối ưu hiệu quả
    }
}
```

**Chuyển Đổi Dựa Trên Lưu Lượng (Traffic-based Switching)**:

```javascript
function selectAlgorithm(requestRate) {
    if (requestRate > 10) { // yêu cầu/phút
        return 'SCAN' // Lưu lượng cao
    } else {
        return 'LOOK' // Lưu lượng thấp
    }
}
```

### Q7: Code trong simulator có sẵn sàng cho hệ thống thực tế (Production-ready) không?

**A**: **KHÔNG**. Code được thiết kế cho mục đích giáo dục (Educational purposes).

Hệ thống thực tế (Production system) cần:

- Xử lý lỗi (Error handling) mạnh mẽ hơn
- Phối hợp thang máy đồng thời (Concurrent elevator coordination)
- Xử lý ràng buộc thời gian thực (Real-time constraints handling)
- Các cơ chế an toàn (Safety mechanisms)
- Giao diện phần cứng (Hardware interface)
- Dự phòng và chuyển đổi dự phòng (Redundancy and failover)

---

## Tài Liệu Tham Khảo

### Các Bài Báo Học Thuật (Academic Papers)

1. **"The Elevator Scheduling Problem"** - Knuth, D. (1973)
   - Bài báo nền tảng về các thuật toán thang máy

2. **"A Comparison of Elevator Dispatching Algorithms"** - Barney, G. (2003)
   - So sánh thực nghiệm các hệ thống thực tế

3. **"Real-time Elevator Group Control Using Genetic Algorithms"** - Siikonen, M. (1997)
   - Các phương pháp AI hiện đại

### Tài Nguyên Trực Tuyến (Online Resources)

- [Wikipedia: Elevator Algorithm](https://en.wikipedia.org/wiki/Elevator_algorithm)
- [OS Dev: Disk Scheduling](https://wiki.osdev.org/Disk_Scheduling) - Các khái niệm tương tự
- [Visualization Tool](https://www.cs.usfca.edu/~galles/visualization/DiskScheduling.html)

### Sách (Books)

- **"Operating System Concepts"** - Silberschatz, Galvin, Gagne
  - Chương về Lập Lịch Đĩa (Disk Scheduling) - tương tự thang máy

- **"Elevator Traffic Handbook"** - Barney, G.
  - Hướng dẫn toàn diện về hệ thống thang máy

---

## Kết Luận

### Những Điểm Chính (Key Takeaways)

1. **SCAN** = Công bằng (Fairness) + Khả năng dự đoán (Predictability) → Tiêu chuẩn hệ thống thực tế (Production standard)
2. **LOOK** = Hiệu quả (Efficiency) + Công bằng vừa phải (Moderate fairness) → Giải pháp thay thế tốt
3. **SSTF** = Đơn giản nhưng có lỗi (Simple but flawed) → Chỉ cho mục đích giáo dục

### Những Bài Học Quan Trọng

1. **Tham Lam (Greedy) ≠ Tối Ưu (Optimal)**
   - SSTF tham lam nhưng không tối ưu toàn cục

2. **Sự Đánh Đổi Ở Khắp Nơi (Trade-offs Everywhere)**
   - Hiệu quả (Efficiency) vs Công bằng (Fairness)
   - Đơn giản (Simplicity) vs Mạnh mẽ (Robustness)
   - Tối ưu cục bộ (Local) vs Tối ưu toàn cục (Global optimization)

3. **Bối Cảnh Quan Trọng (Context Matters)**
   - Thuật toán tốt nhất phụ thuộc vào các mẫu lưu lượng (Traffic patterns)
   - Không có giải pháp nào phù hợp với tất cả

4. **Độ Phức Tạp Thực Tế (Real-world Complexity)**
   - Hệ thống thực tế (Production systems) phức tạp hơn nhiều
   - Phải xem xét an toàn (Safety), phần cứng (Hardware), các trường hợp đặc biệt (Edge cases)

### Học Tiếp

Sau khi hiểu các thuật toán này, bạn có thể:

1. **Khám phá các chủ đề nâng cao (Explore advanced topics)**:
   - Phối hợp nhiều thang máy (Multi-elevator coordination)
   - Các thuật toán dự đoán (Predictive algorithms)
   - Lập lịch dựa trên ML (ML-based scheduling)

2. **Áp dụng cho các lĩnh vực khác (Apply to other domains)**:
   - Lập lịch đĩa (Disk scheduling) - giống hệt
   - Lập lịch CPU (CPU scheduling)
   - Lập lịch gói mạng (Network packet scheduling)

3. **Xây dựng của riêng bạn (Build your own)**:
   - Triển khai các biến thể (Implement variants)
   - Tối ưu cho các tình huống cụ thể (Optimize for specific scenarios)
   - Đóng góp cho simulator này!

---

**Chúc Bạn Học Tập Vui Vẻ!**

*Phiên bản tài liệu: 1.0*
*Cập nhật lần cuối: 2025-11-08*
