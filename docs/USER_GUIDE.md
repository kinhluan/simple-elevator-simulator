# Hướng Dẫn Sử Dụng - Elevator Simulator

Chào mừng bạn đến với **Simple Elevator Simulator** - công cụ học tập tương tác để hiểu các thuật toán điều phối thang máy!

---

## 📖 Mục Lục

1. [Bắt Đầu Nhanh](#bắt-đầu-nhanh)
2. [Giao Diện Tổng Quan](#giao-diện-tổng-quan)
3. [Hướng Dẫn Từng Bước](#hướng-dẫn-từng-bước)
4. [Chế Độ Manual vs Auto](#chế-độ-manual-vs-auto)
5. [Hiểu Thống Kê](#hiểu-thống-kê)
6. [Kịch Bản Học Tập](#kịch-bản-học-tập)
7. [Câu Hỏi Thường Gặp](#câu-hỏi-thường-gặp)
8. [Tips & Tricks](#tips--tricks)

---

## 🚀 Bắt Đầu Nhanh

### Khởi Động Demo

**Option 1: Chạy Local**

```bash
# Clone repository
git clone https://github.com/kinhluan/simple-elevator-simulator.git
cd simple-elevator-simulator

# Install dependencies
npm install

# Start development server
npm run dev
```

Mở trình duyệt tại `http://localhost:3000`

**Option 2: Online Demo**
Truy cập: `https://kinhluan.github.io/simple-elevator-simulator`

### First Steps (30 giây)

1. **Chọn thuật toán**: Click vào dropdown "SCAN" ở góc trên bên phải
2. **Gọi thang máy**: Click nút "↑" hoặc "↓" bên cạnh bất kỳ tầng nào
3. **Quan sát**: Xem thang máy di chuyển và phục vụ yêu cầu
4. **Thử nghiệm**: Thay đổi thuật toán và so sánh hành vi

✅ **Bạn đã sẵn sàng học!**

---

## 🖥️ Giao Diện Tổng Quan

### Layout Chính

```
┌─────────────────────────────────────────────────────────────┐
│                    🏢 ELEVATOR SIMULATOR                     │
│                         (Header)                             │
└─────────────────────────────────────────────────────────────┘
┌──────┬────────────────────────────────────┬─────────────────┐
│      │                                    │  Control Panel  │
│ Left │     Building Visualization        │  ┌────────────┐ │
│ Side │     (Tòa nhà với thang máy)       │  │ Algorithm  │ │
│ bar  │                                    │  │ Config     │ │
│(ẩn)  │         🏢🏢🏢🏢🏢                │  │ Calls      │ │
│      │                                    │  │ Stats      │ │
└──────┴────────────────────────────────────┴─────────────────┘
```

### Các Khu Vực Chính

#### 1. **Building Visualization** (Giữa màn hình)

```
Tầng 10  [↑] [↓]  ═══════════  [🚪 2]
Tầng 9   [↑] [↓]  ═══════════
Tầng 8   [↑] [↓]  ═══════════  [🚪 1]
Tầng 7   [↑] [↓]  ═══════════
...
Tầng 1   [  ] [↓] ═══════════  [🚪 3]

Chú thích:
- [↑] [↓]   : Nút gọi thang máy lên/xuống
- ═══════   : Tầng (floor)
- [🚪 X]    : Thang máy số X đang ở tầng này
```

**Màu sắc thang máy**:

- 🟦 **Xanh dương**: Đang di chuyển (MOVING)
- 🟢 **Xanh lá**: Cửa đang mở (DOORS_OPEN)
- 🟡 **Vàng**: Cửa đang đóng/mở (DOORS_OPENING/CLOSING)
- ⚪ **Xám**: Rảnh (IDLE)

#### 2. **Control Panel** (Bên phải)

**Tab 1: Algorithm & Building**

```
┌─────────────────────────┐
│ Algorithm: [SCAN ▼]    │
│                         │
│ Mode: ○ Manual          │
│       ● Auto            │
│                         │
│ ───── Config ─────      │
│ Floors:    [10]         │
│ Elevators: [3]          │
│                         │
│ ───── Timing ─────      │
│ Floor travel: [1000ms]  │
│ Door open:    [2500ms]  │
│ Door hold:    [3000ms]  │
│ Door close:   [2000ms]  │
└─────────────────────────┘
```

**Tab 2: Calls & Elevators**

```
┌─────────────────────────┐
│ Pending Calls:          │
│ • Floor 7 ↑ [Assign ▼] │
│ • Floor 3 ↓ [Assign ▼] │
│                         │
│ Elevator Status:        │
│ ┌─────────────────────┐ │
│ │ Elevator 1          │ │
│ │ Floor: 5 → 8        │ │
│ │ Direction: ↑        │ │
│ │ Queue: [8, 10, 12]  │ │
│ └─────────────────────┘ │
└─────────────────────────┘
```

**Tab 3: Instructions**

- Hướng dẫn cơ bản
- Giải thích thuật toán
- Tips sử dụng

**Tab 4: Statistics**

```
┌─────────────────────────┐
│ Performance Metrics     │
│                         │
│ Calls Served:    42     │
│ Avg Wait Time:   12.3s  │
│ Max Wait Time:   28.5s  │
│                         │
│ Per-Elevator Stats:     │
│ Elevator 1:             │
│  • Trips: 15            │
│  • Floors: 120          │
│  • Direction changes: 8 │
└─────────────────────────┘
```

---

## 📚 Hướng Dẫn Từng Bước

### Bài 1: Làm Quen Với Giao Diện (5 phút)

**Mục tiêu**: Hiểu các thành phần cơ bản

**Các bước**:

1. **Quan sát tòa nhà**
   - Đếm số tầng: mặc định là 10 tầng
   - Đếm số thang máy: mặc định là 3 thang máy
   - Tất cả thang máy bắt đầu ở tầng 1

2. **Gọi một thang máy**
   - Click nút **[↑]** ở tầng 5
   - Quan sát: Một thang máy sẽ di chuyển đến tầng 5

3. **Xem trạng thái**
   - Chuyển sang **Tab 2: Calls & Elevators**
   - Quan sát **Queue** của thang máy đang di chuyển
   - Chú ý **Direction** (hướng di chuyển)

4. **Xem thống kê**
   - Chuyển sang **Tab 4: Statistics**
   - Quan sát **Calls Served** tăng lên sau khi thang máy đến tầng 5

✅ **Checkpoint**: Bạn đã hiểu cách gọi thang máy và đọc thông tin cơ bản!

---

### Bài 2: So Sánh SCAN vs LOOK (10 phút)

**Mục tiêu**: Hiểu sự khác biệt giữa 2 thuật toán

**Setup**:

- Floors: 10
- Elevators: 1 (để dễ quan sát)
- Mode: Auto

**Các bước**:

#### Thử nghiệm SCAN

1. **Reset**
   - Refresh trang hoặc change config để reset

2. **Chọn thuật toán**
   - Tab 1 → Algorithm: **SCAN**

3. **Giảm số thang máy**
   - Tab 1 → Elevators: **1**
   - Click "Apply" hoặc enter

4. **Tạo kịch bản**
   - Thang máy đang ở tầng 1
   - Click **[↑]** ở tầng 5
   - Chờ thang máy bắt đầu đi lên
   - Khi thang máy ở tầng 3, click **[↑]** ở tầng 7
   - Khi thang máy ở tầng 6, click **[↓]** ở tầng 4

5. **Quan sát hành vi SCAN**
   - Thang máy đi: 1 → 5 (phục vụ) → 7 (phục vụ) → **10 (extreme!)** → 9 → 8 → ... → 4 (phục vụ)
   - **Key observation**: Thang máy đi đến tầng 10 ngay cả khi không có yêu cầu!

6. **Ghi chú**
   - Tab 4: Xem **Floors Traveled** - số tầng di chuyển

#### Thử nghiệm LOOK

1. **Reset lại**
   - Refresh trang

2. **Chọn LOOK**
   - Tab 1 → Algorithm: **LOOK**
   - Elevators: **1**

3. **Lặp lại kịch bản**
   - Thang máy ở tầng 1
   - Click **[↑]** tầng 5
   - Click **[↑]** tầng 7 (khi ở tầng 3)
   - Click **[↓]** tầng 4 (khi ở tầng 6)

4. **Quan sát hành vi LOOK**
   - Thang máy đi: 1 → 5 (phục vụ) → 7 (phục vụ) → **STOP & REVERSE** → 6 → 5 → 4 (phục vụ)
   - **Key observation**: Thang máy KHÔNG đi đến tầng 10!

5. **So sánh**
   - SCAN: Floors Traveled = ~16 floors
   - LOOK: Floors Traveled = ~10 floors
   - **LOOK hiệu quả hơn 37%!**

✅ **Checkpoint**: Bạn đã thấy LOOK tối ưu hơn SCAN!

---

### Bài 3: Phát Hiện Starvation Với SSTF (10 phút)

**Mục tiêu**: Hiểu vấn đề "starvation" (đói) của SSTF

**Setup**:

- Floors: 20 (tăng lên để dễ thấy starvation)
- Elevators: 1
- Algorithm: SSTF
- Mode: Auto

**Các bước**:

1. **Setup**
   - Tab 1 → Floors: **20**, Elevators: **1**, Algorithm: **SSTF**

2. **Tạo kịch bản starvation**
   - Thang máy ở tầng 10
   - Click **[↑]** tầng **20** (yêu cầu xa)
   - Chờ thang máy bắt đầu đi lên đến tầng 12
   - Nhanh tay click **[↑]** tầng **8** (yêu cầu gần)
   - Chờ thang máy đến tầng 14
   - Click **[↑]** tầng **6** (yêu cầu gần hơn)

3. **Quan sát**
   - Thang máy sẽ **QUAY LẠI** để phục vụ tầng 8 (gần hơn)
   - Sau đó quay lại phục vụ tầng 6
   - Tầng 20 bị **BỎ QUA** liên tục!

4. **Xem thống kê**
   - Tab 4 → Xem **Max Wait Time** cho tầng 20
   - Sẽ rất cao (>30s) vì bị starve

5. **Giải pháp**
   - Ngừng gọi thêm tầng gần
   - Chờ thang máy cuối cùng phục vụ tầng 20

✅ **Checkpoint**: Bạn đã thấy starvation xảy ra như thế nào!

**Câu hỏi suy nghĩ**:

- Tại sao tầng 20 bị bỏ quên?
- SSTF có phù hợp cho production không?
- Làm sao để fix starvation trong SSTF?

---

### Bài 4: Tối Ưu Cấu Hình (15 phút)

**Mục tiêu**: Tìm cấu hình tốt nhất cho building của bạn

**Challenge**: Minimize average wait time cho tòa nhà 15 tầng, lưu lượng trung bình

**Các bước**:

1. **Baseline**
   - Floors: 15
   - Elevators: 2
   - Algorithm: SCAN
   - Timing: Defaults

2. **Test scenario**
   - Gọi 20 requests ngẫu nhiên (mix up/down, các tầng khác nhau)
   - Ghi lại **Avg Wait Time** từ Tab 4

3. **Thử nghiệm 1: Tăng số thang máy**
   - Change Elevators: **3**
   - Lặp lại test scenario
   - So sánh Avg Wait Time
   - **Hypothesis**: Nhiều thang máy → wait time giảm

4. **Thử nghiệm 2: Thay đổi thuật toán**
   - Keep Elevators: 3
   - Change Algorithm: **LOOK**
   - Test lại
   - So sánh: SCAN vs LOOK với 3 elevators

5. **Thử nghiệm 3: Điều chỉnh timing**
   - Giảm Floor Travel Time: **500ms** (thang máy nhanh hơn)
   - Test lại
   - **Trade-off**: Realistic vs Performance

6. **Kết luận**
   - Cấu hình nào cho Avg Wait Time thấp nhất?
   - Trade-offs là gì?
   - Viết ra findings của bạn!

✅ **Checkpoint**: Bạn đã học cách optimize system!

---

## 🎮 Chế Độ Manual vs Auto

### Manual Mode (Điều khiển thủ công)

**Khi nào dùng**: Khi muốn kiểm soát hoàn toàn, học cách dispatching works

**Cách dùng**:

1. **Chọn Manual**
   - Tab 1 → Mode: **○ Manual**

2. **Gọi thang máy**
   - Click **[↑]** hoặc **[↓]** ở bất kỳ tầng nào
   - Yêu cầu xuất hiện trong **Pending Calls** (Tab 2)

3. **Assign thủ công**
   - Tab 2 → Pending Calls
   - Click dropdown **[Assign ▼]** bên cạnh call
   - Chọn thang máy (Elevator 1, 2, 3...)

4. **Quan sát**
   - Thang máy được chọn sẽ thêm tầng vào queue
   - Di chuyển đến tầng đó

**Lợi ích**:

- ✅ Hiểu cách algorithms assign calls
- ✅ Thử nghiệm strategies khác nhau
- ✅ Học bằng cách làm

**Ví dụ scenario**:

```
Situation:
- Elevator 1: Tầng 5, đang đi lên
- Elevator 2: Tầng 8, đang rảnh
- New call: Tầng 10, đi lên

Question: Assign cho Elevator 1 hay 2?

Elevator 1:
  - Đang đi lên → cùng hướng ✅
  - Distance: 5 floors
  - Có thể nhặt trên đường

Elevator 2:
  - Đang rảnh
  - Distance: 2 floors ✅
  - Đến nhanh hơn

Decision: Phụ thuộc mục tiêu!
- Minimize wait time → Elevator 2
- Optimize overall efficiency → Elevator 1
```

### Auto Mode (Tự động)

**Khi nào dùng**: Khi muốn xem algorithm hoạt động, so sánh algorithms

**Cách dùng**:

1. **Chọn Auto**
   - Tab 1 → Mode: **● Auto**

2. **Chọn algorithm**
   - Algorithm: **SCAN** / **LOOK** / **SSTF**

3. **Gọi thang máy**
   - Click **[↑]** hoặc **[↓]**
   - Algorithm tự động assign ngay lập tức
   - KHÔNG có Pending Calls (assigned immediately)

4. **Quan sát**
   - Xem algorithm chọn thang máy nào
   - Tab 2 → Elevator Status → xem Queue được sắp xếp thế nào

**Lợi ích**:

- ✅ Nhanh, không cần assign thủ công
- ✅ So sánh algorithms dễ dàng
- ✅ Học từ decisions của algorithm

---

## 📊 Hiểu Thống Kê

### Tab 4: Statistics Dashboard

#### System-Wide Metrics

**Calls Served** (Số yêu cầu đã phục vụ)

```
Calls Served: 42
```

- Tổng số requests đã hoàn thành
- Càng cao = càng nhiều activity

**Average Wait Time** (Thời gian chờ trung bình)

```
Avg Wait Time: 12.3s
```

- Thời gian trung bình từ khi gọi đến khi thang máy đến
- **Càng thấp càng tốt**
- Good: < 15s, Acceptable: 15-30s, Poor: > 30s

**Max Wait Time** (Thời gian chờ tối đa)

```
Max Wait Time: 28.5s
```

- Thời gian chờ lâu nhất
- Indicator of fairness
- **Nếu quá cao**: Có thể có starvation

#### Per-Elevator Metrics

**Trips Completed** (Số chuyến hoàn thành)

```
Elevator 1: 15 trips
```

- Số lần elevator đi từ idle → moving → phục vụ → idle
- Balance giữa elevators = good distribution

**Floors Traveled** (Số tầng đã di chuyển)

```
Elevator 1: 120 floors
```

- Tổng số tầng đã đi (up + down)
- **Càng ít càng efficient**
- Compare algorithms: LOOK thường ít hơn SCAN

**Direction Changes** (Số lần đổi hướng)

```
Elevator 1: 8 direction changes
```

- Số lần đổi từ up → down hoặc down → up
- **Càng ít càng smooth**
- SCAN: ít (predictable), SSTF: nhiều (chaotic)

**Time in State** (Thời gian ở mỗi trạng thái)

```
Elevator 1:
  Idle:    30s (20%)
  Moving:  90s (60%)
  Serving: 30s (20%)
```

- Idle: Rảnh không làm gì
  - **Quá cao**: Underutilized (thừa elevator)
  - **Quá thấp**: Overworked (thiếu elevator)
- Moving: Đang di chuyển
  - Nên là phần lớn thời gian
- Serving: Đang mở/đóng cửa, chở khách
  - Fixed time, không optimize được nhiều

#### Service Quality Score

```
Service Quality: 85/100
```

**Tính toán** (giả sử có implement):

```
score = (
  (100 - avgWaitTime * 2) +        // Wait time factor
  (100 - maxWaitTime) +             // Fairness factor
  (100 - directionChanges * 5)      // Smoothness factor
) / 3
```

**Interpretation**:

- 90-100: Excellent ⭐⭐⭐⭐⭐
- 80-89: Good ⭐⭐⭐⭐
- 70-79: Acceptable ⭐⭐⭐
- < 70: Needs improvement ⚠️

---

## 🎓 Kịch Bản Học Tập

### Scenario 1: Office Building (9AM Rush Hour)

**Context**: Tòa nhà văn phòng, 8:30-9:30AM, mọi người đến làm việc

**Setup**:

```
Floors: 20
Elevators: 4
Algorithm: SCAN (fairness needed)
```

**Task**:

1. Simulate rush hour: Gọi nhiều requests từ tầng 1 đi lên (tầng 5, 8, 10, 15, 18, 20)
2. Observe: Làm sao 4 elevators phân bổ công việc?
3. Measure: Avg wait time có acceptable không?

**Expected Learning**:

- Understand load balancing
- See why SCAN is good for fairness
- Learn about peak hour challenges

---

### Scenario 2: Hospital (Emergency)

**Context**: Bệnh viện, cần response time nhanh, ít tầng

**Setup**:

```
Floors: 5
Elevators: 2
Algorithm: LOOK (efficiency)
```

**Task**:

1. Simulate emergencies: Random urgent calls
2. Measure: Max wait time (critical!)
3. Compare: LOOK vs SCAN - which is faster?

**Expected Learning**:

- Understand time-critical scenarios
- See LOOK's efficiency advantage
- Learn trade-offs

---

### Scenario 3: Residential Building (Evening)

**Context**: Chung cư, 6-8PM, người về nhà, traffic hai chiều

**Setup**:

```
Floors: 15
Elevators: 3
Algorithm: Try all three!
```

**Task**:

1. Simulate: Mix of up calls (lobby → floors) và down calls (floors → lobby)
2. Test SCAN: Ghi lại metrics
3. Test LOOK: Ghi lại metrics
4. Test SSTF: Observe starvation?

**Expected Learning**:

- Compare algorithms in realistic scenario
- Understand bidirectional traffic
- See SSTF failures in complex situations

---

### Scenario 4: Research Challenge

**Context**: Tự thiết kế thí nghiệm

**Task**:

```
Research Question:
"Với tòa nhà 10 tầng, bao nhiêu thang máy là đủ?"

Experiment:
1. Fixed: 10 floors, SCAN algorithm
2. Variable: Number of elevators (1, 2, 3, 4, 5)
3. Test: 50 random requests for each configuration
4. Measure: Avg wait time, max wait time

Expected Result:
- Plot graph: Elevators (x-axis) vs Avg Wait (y-axis)
- Find diminishing returns point
- Recommend optimal number
```

**Deliverable**:

- Data table
- Graph
- Written recommendation with justification

---

## ❓ Câu Hỏi Thường Gặp

### Q1: Tại sao thang máy không đến khi tôi gọi?

**A**: Kiểm tra:

- **Mode**: Nếu đang ở Manual mode, bạn cần assign thủ công (Tab 2)
- **Algorithm**: Một số algorithms có thể chọn elevator khác nếu cost thấp hơn
- **Queue**: Elevator có thể đang phục vụ requests khác

**Fix**: Chuyển sang Auto mode hoặc assign manually

---

### Q2: Làm sao biết elevator nào được assign cho call của tôi?

**A**:

- **Auto mode**: Tab 2 → Elevator Status → Xem Queue của từng elevator
  - Call của bạn sẽ xuất hiện trong queue
- **Manual mode**: Bạn phải assign, sẽ thấy ngay

---

### Q3: Phantom floor là gì? Tại sao có tầng lạ trong queue?

**A**: Phantom floors chỉ xuất hiện với **SCAN algorithm**

**Giải thích**:

- SCAN phải đi đến extreme (tầng cao nhất/thấp nhất)
- Nếu không có request ở extreme, hệ thống thêm "phantom floor"
- Đây là implementation detail để ensure SCAN behavior đúng

**Ví dụ**:

```
Elevator ở tầng 5, đang đi lên
Queue: [7, 10]
→ System adds phantom floor: [7, 10, 20]
→ Elevator đi 5 → 7 → 10 → 20 (extreme) → reverse
```

Phantom floors **không được tính** vào wait time metrics.

---

### Q4: Tại sao changing config reset hết?

**A**: Thay đổi số floors hoặc elevators cần rebuild entire system

**Workaround**:

- Plan cấu hình trước khi test
- Sử dụng consistent config trong experiments

---

### Q5: Statistics có lưu lại không?

**A**: Hiện tại **KHÔNG**. Stats reset khi refresh page.

**Workaround**:

- Screenshot Tab 4 trước khi refresh
- Ghi chép manually
- Export (feature chưa có, xem Roadmap)

---

### Q6: Có thể tăng tốc độ simulation không?

**A**: **CÓ**! Tab 1 → Timing

**Ví dụ**:

```
Fast simulation:
- Floor travel: 300ms (instead of 1000ms)
- Door open: 500ms (instead of 2500ms)
- Door hold: 500ms (instead of 3000ms)
- Door close: 500ms (instead of 2000ms)

→ Simulation chạy ~3x nhanh hơn
```

**Lưu ý**: Quá nhanh có thể khó quan sát, balance giữa speed và visibility.

---

### Q7: SSTF có luôn gây starvation không?

**A**: **KHÔNG** - Starvation chỉ xảy ra với specific traffic patterns

**Khi NẢDO** starvation:

- Liên tục có requests gần hơn request xa
- High traffic, random distribution

**Khi KHÔNG** starvation:

- Low traffic
- Requests evenly distributed
- Enough elevators

**Điểm mấu chốt**: SSTF **CÓ KHẢ NĂNG** starvation → không dùng trong production.

---

## 💡 Tips & Tricks

### Tip 1: Start Simple

❌ **Tránh**:

```
Floors: 24
Elevators: 12
→ Quá phức tạp, khó quan sát patterns
```

✅ **Nên**:

```
Floors: 10
Elevators: 1-2
→ Dễ thấy algorithm behavior
```

**Sau đó** tăng dần complexity.

---

### Tip 2: One Variable at a Time

Khi so sánh, chỉ thay đổi 1 biến:

**Ví dụ**:

```
Compare SCAN vs LOOK:
✅ Keep constant: Floors, Elevators, Timing, Request pattern
❌ Change multiple: Algorithm + Elevators + Timing → không biết cái nào ảnh hưởng
```

---

### Tip 3: Use Consistent Test Cases

Tạo "standard test case" để compare:

**Ví dụ**:

```
Standard Test Case:
1. Start: All elevators at floor 1
2. Requests (in order):
   - Floor 5 ↑
   - Floor 10 ↑
   - Floor 3 ↓
   - Floor 8 ↑
   - Floor 2 ↓
3. Measure: Avg Wait, Max Wait
4. Repeat cho mỗi algorithm
```

---

### Tip 4: Look for "Aha Moments"

**SCAN**:

- Aha: "Oh! It MUST go to top even when no one's there!"

**LOOK**:

- Aha: "It's smarter! Stops when no more requests ahead!"

**SSTF**:

- Aha: "Floor 20 waited forever because closer floors kept coming!"

Những moments này = bạn đã hiểu concept!

---

### Tip 5: Teach Someone Else

Best way to learn:

1. Run a scenario
2. Explain to friend/classmate why elevator behaved that way
3. Predict what will happen next
4. Verify prediction

If you can explain it → you understand it!

---

### Tip 6: Take Notes

Tạo learning journal:

```markdown
# Elevator Algorithm Learning Log

## Date: 2025-11-08

### Experiment 1: SCAN vs LOOK
Setup: 10 floors, 2 elevators
Finding: LOOK traveled 30% fewer floors
Question: Why is LOOK not always used then?
Answer: Less predictable, might be unfair in some cases

### Confusion Point:
Still don't understand: Why phantom floors needed?
→ Need to ask instructor / read code

### Aha Moment:
Finally understood why SSTF causes starvation!
Example: [describe scenario]
```

---

### Tip 7: Use Keyboard Shortcuts (Future Feature)

Đề xuất shortcuts:

```
Spacebar: Pause/Resume simulation
R: Reset
1/2/3: Switch algorithm (SCAN/LOOK/SSTF)
↑/↓: Call elevator at highlighted floor
```

*(Chưa implement, xem GitHub Issues để request)*

---

## 🎯 Learning Checklist

### Beginner (Sau 15 phút)

- [ ] Tôi hiểu cách gọi elevator
- [ ] Tôi biết đọc elevator status
- [ ] Tôi phân biệt được Manual vs Auto mode
- [ ] Tôi biết xem statistics

### Intermediate (Sau 30 phút)

- [ ] Tôi hiểu SCAN algorithm hoạt động thế nào
- [ ] Tôi hiểu LOOK algorithm hoạt động thế nào
- [ ] Tôi hiểu SSTF algorithm hoạt động thế nào
- [ ] Tôi thấy được sự khác biệt giữa 3 algorithms
- [ ] Tôi hiểu "phantom floors" trong SCAN

### Advanced (Sau 1 giờ)

- [ ] Tôi có thể giải thích tại sao SCAN prevents starvation
- [ ] Tôi có thể giải thích LOOK efficiency advantage
- [ ] Tôi có thể tạo scenario làm SSTF starve
- [ ] Tôi có thể so sánh algorithms cho building cụ thể
- [ ] Tôi có thể recommend algorithm dựa trên requirements

### Expert (Sau nhiều giờ)

- [ ] Tôi có thể teach algorithms cho người khác
- [ ] Tôi hiểu implementation details (đọc code)
- [ ] Tôi có thể đề xuất improvements
- [ ] Tôi có thể thiết kế experiments riêng
- [ ] Tôi có thể viết báo cáo so sánh algorithms

---

## 📞 Hỗ Trợ

### Gặp Bug?

1. **Check console**: F12 → Console tab → có error messages?
2. **Try refresh**: Ctrl+F5 (hard refresh)
3. **Check browser**: Chrome/Firefox recommended
4. **Report**: [GitHub Issues](https://github.com/kinhluan/simple-elevator-simulator/issues)

### Câu Hỏi?

- **Documentation**: Đọc `/docs/ALGORITHMS.md` để hiểu sâu hơn
- **Code**: Đọc source code trong `/src/algorithms/`
- **Discussion**: GitHub Discussions (nếu có)

### Góp Ý?

Chúng tôi muốn nghe từ bạn!

- Feature requests
- UI/UX improvements
- Educational content suggestions

→ [Open a GitHub Issue](https://github.com/kinhluan/simple-elevator-simulator/issues)!

---

## 🚀 Next Steps

Sau khi làm quen với simulator:

1. **Đọc lý thuyết**: `/docs/ALGORITHMS.md`
2. **Xem architecture**: `/docs/ARCHITECTURE.md`
3. **Làm exercises**: Practice problems trong ALGORITHMS.md
4. **Contribute**: Thêm features, fix bugs, improve docs!

---

**Happy Learning! 🎓**

*Version: 1.0*
*Last updated: 2025-11-08*
*Feedback: [GitHub Issues](https://github.com/kinhluan/simple-elevator-simulator/issues)*
