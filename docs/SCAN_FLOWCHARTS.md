# Mermaid Flowcharts - Thuật Toán SCAN (SCAN Algorithm)

Tài liệu này chứa các sơ đồ Mermaid để trực quan hóa flow xử lý của thuật toán SCAN.

---

## 📋 Mục Lục

1. [Flow Tổng Quan](#1-flow-tổng-quan-overall-flow)
2. [Flow Chọn Thang Máy](#2-flow-chọn-thang-máy-elevator-selection-flow)
3. [Flow Tính Chi Phí](#3-flow-tính-chi-phí-cost-calculation-flow)
4. [Flow Đảo Chiều](#4-flow-đảo-chiều-direction-reversal-flow)
5. [Flow Phantom Floor](#5-flow-phantom-floor)
6. [State Machine](#6-state-machine-máy-trạng-thái)
7. [Flow Xử Lý Request](#7-flow-xử-lý-request-request-handling-flow)

---

## 1. Flow Tổng Quan (Overall Flow)

```mermaid
graph TD
    Start([Bắt đầu - Start]) --> NewRequest{Có yêu cầu mới?<br/>New Request?}

    NewRequest -->|Có - Yes| SelectElevator[Chọn thang máy tốt nhất<br/>Select Best Elevator]
    NewRequest -->|Không - No| MoveElevator[Di chuyển thang máy<br/>Move Elevator]

    SelectElevator --> CalcCost[Tính chi phí cho từng thang máy<br/>Calculate Cost for Each Elevator]
    CalcCost --> ChooseBest[Chọn thang máy có chi phí thấp nhất<br/>Choose Lowest Cost Elevator]
    ChooseBest --> AddToQueue[Thêm vào hàng đợi<br/>Add to Queue]
    AddToQueue --> AddPhantom[Thêm Phantom Floor nếu cần<br/>Add Phantom Floor if needed]
    AddPhantom --> SortQueue[Sắp xếp hàng đợi theo hướng<br/>Sort Queue by Direction]
    SortQueue --> MoveElevator

    MoveElevator --> HasQueue{Hàng đợi có request?<br/>Queue has requests?}
    HasQueue -->|Có - Yes| MoveToNext[Di chuyển đến tầng tiếp theo<br/>Move to Next Floor]
    HasQueue -->|Không - No| Idle[Chuyển sang IDLE<br/>Set to IDLE]

    MoveToNext --> AtFloor{Đến tầng trong hàng đợi?<br/>At Queue Floor?}
    AtFloor -->|Có - Yes| ServeFloor[Phục vụ tầng<br/>Serve Floor]
    AtFloor -->|Không - No| Continue[Tiếp tục di chuyển<br/>Continue Moving]

    ServeFloor --> RemoveFromQueue[Xóa khỏi hàng đợi<br/>Remove from Queue]
    RemoveFromQueue --> CheckReverse{Cần đảo chiều?<br/>Need Reverse?}

    CheckReverse -->|Có - Yes| Reverse[Đảo chiều<br/>Reverse Direction]
    CheckReverse -->|Không - No| Continue

    Reverse --> MoveElevator
    Continue --> MoveElevator
    Idle --> NewRequest

    style Start fill:#90EE90
    style ServeFloor fill:#FFD700
    style Reverse fill:#FF6B6B
    style Idle fill:#87CEEB
```

---

## 2. Flow Chọn Thang Máy (Elevator Selection Flow)

```mermaid
graph TD
    Start([Yêu cầu mới tại tầng X<br/>New Request at Floor X]) --> Init[Khởi tạo:<br/>bestElevator = null<br/>lowestCost = ∞]

    Init --> Loop{Duyệt qua<br/>từng thang máy<br/>For Each Elevator}

    Loop -->|Thang máy tiếp theo| CalcCost[Tính chi phí<br/>Calculate Cost]

    CalcCost --> Compare{Chi phí < lowestCost?<br/>Cost < lowestCost?}

    Compare -->|Có - Yes| Update[Cập nhật:<br/>lowestCost = cost<br/>bestElevator = elevator]
    Compare -->|Không - No| Next[Bỏ qua<br/>Skip]

    Update --> Next
    Next --> Loop

    Loop -->|Hết - Done| HasBest{bestElevator != null?}

    HasBest -->|Có - Yes| Return[Trả về bestElevator.id]
    HasBest -->|Không - No| ReturnNull[Trả về null]

    Return --> End([Kết thúc - End])
    ReturnNull --> End

    style Start fill:#90EE90
    style Return fill:#FFD700
    style ReturnNull fill:#FF6B6B
    style Update fill:#87CEEB
```

---

## 3. Flow Tính Chi Phí (Cost Calculation Flow)

```mermaid
graph TD
    Start([Tính chi phí<br/>Calculate Cost]) --> CheckIdle{Thang máy IDLE?<br/>Elevator IDLE?}

    CheckIdle -->|Có - Yes| SimpleCost[Chi phí = |currentFloor - callFloor|<br/>Cost = Distance]
    CheckIdle -->|Không - No| CheckDirection{Hướng di chuyển?<br/>Direction?}

    CheckDirection -->|UP - Lên| CheckUpCase{callFloor >= currentFloor<br/>&&<br/>callDirection == UP?}
    CheckDirection -->|DOWN - Xuống| CheckDownCase{callFloor <= currentFloor<br/>&&<br/>callDirection == DOWN?}

    CheckUpCase -->|Có - Yes| BestCaseUp[✅ Trường hợp tốt nhất<br/>Chi phí = callFloor - currentFloor]
    CheckUpCase -->|Không - No| WorstCaseUp[⚠️ Phải hoàn thành quét<br/>Chi phí = distToTop + distFromTop + 100]

    CheckDownCase -->|Có - Yes| BestCaseDown[✅ Trường hợp tốt nhất<br/>Chi phí = currentFloor - callFloor]
    CheckDownCase -->|Không - No| WorstCaseDown[⚠️ Phải hoàn thành quét<br/>Chi phí = distToBottom + distFromBottom + 100]

    SimpleCost --> Return([Trả về chi phí<br/>Return Cost])
    BestCaseUp --> Return
    WorstCaseUp --> Return
    BestCaseDown --> Return
    WorstCaseDown --> Return

    style Start fill:#90EE90
    style BestCaseUp fill:#90EE90
    style BestCaseDown fill:#90EE90
    style WorstCaseUp fill:#FFB6C1
    style WorstCaseDown fill:#FFB6C1
    style SimpleCost fill:#87CEEB
```

### Chi Tiết Công Thức (Formula Details)

```mermaid
graph LR
    subgraph "Đang đi LÊN - Going UP"
        UpGood["Cùng hướng, phía trước<br/>Same direction, ahead<br/><br/>cost = callFloor - currentFloor"]
        UpBad["Sai hướng hoặc phía sau<br/>Wrong direction or behind<br/><br/>cost = maxFloor - currentFloor<br/>+ maxFloor - callFloor<br/>+ 100 penalty"]
    end

    subgraph "Đang đi XUỐNG - Going DOWN"
        DownGood["Cùng hướng, phía trước<br/>Same direction, ahead<br/><br/>cost = currentFloor - callFloor"]
        DownBad["Sai hướng hoặc phía sau<br/>Wrong direction or behind<br/><br/>cost = currentFloor - 1<br/>+ callFloor - 1<br/>+ 100 penalty"]
    end

    style UpGood fill:#90EE90
    style DownGood fill:#90EE90
    style UpBad fill:#FFB6C1
    style DownBad fill:#FFB6C1
```

---

## 4. Flow Đảo Chiều (Direction Reversal Flow)

```mermaid
graph TD
    Start([Kiểm tra đảo chiều<br/>Check Reversal]) --> QueueEmpty{Hàng đợi rỗng?<br/>Queue Empty?}

    QueueEmpty -->|Có - Yes| SetIdle[direction = IDLE<br/>shouldReverse = false]
    QueueEmpty -->|Không - No| CheckPosition{Vị trí hiện tại?<br/>Current Position?}

    CheckPosition -->|Tầng đỉnh & đi LÊN<br/>Top floor & UP| ReverseToDown[direction = DOWN<br/>shouldReverse = true]
    CheckPosition -->|Tầng đáy & đi XUỐNG<br/>Bottom floor & DOWN| ReverseToUp[direction = UP<br/>shouldReverse = true]
    CheckPosition -->|Tầng giữa<br/>Middle floor| CheckNext{Tầng tiếp theo trong queue?<br/>Next floor in queue?}

    CheckNext -->|Đang LÊN & next < current| ReverseToDown2[Đã đến đỉnh queue<br/>direction = DOWN<br/>shouldReverse = true]
    CheckNext -->|Đang XUỐNG & next > current| ReverseToUp2[Đã đến đáy queue<br/>direction = UP<br/>shouldReverse = true]
    CheckNext -->|Còn request phía trước| Continue[Tiếp tục hướng hiện tại<br/>shouldReverse = false]

    SetIdle --> End([Kết thúc - End])
    ReverseToDown --> End
    ReverseToUp --> End
    ReverseToDown2 --> End
    ReverseToUp2 --> End
    Continue --> End

    style Start fill:#90EE90
    style ReverseToDown fill:#FFD700
    style ReverseToUp fill:#FFD700
    style ReverseToDown2 fill:#FFD700
    style ReverseToUp2 fill:#FFD700
    style SetIdle fill:#87CEEB
    style Continue fill:#90EE90
```

---

## 5. Flow Phantom Floor

```mermaid
graph TD
    Start([Kiểm tra Phantom Floor<br/>Check Phantom Floor]) --> QueueEmpty{Hàng đợi rỗng?<br/>Queue Empty?}

    QueueEmpty -->|Có - Yes| NoPhantom[Không cần phantom<br/>No phantom needed]
    QueueEmpty -->|Không - No| CheckDir{Hướng?<br/>Direction?}

    CheckDir -->|UP - Lên| CheckFloorsAbove{Có tầng > currentFloor<br/>trong queue?}
    CheckDir -->|DOWN - Xuống| CheckFloorsBelow{Có tầng < currentFloor<br/>trong queue?}
    CheckDir -->|IDLE - Rảnh| NoPhantom

    CheckFloorsAbove -->|Có - Yes| GetMaxQueue[maxInQueue = max floor in queue]
    CheckFloorsAbove -->|Không - No| NoPhantom

    CheckFloorsBelow -->|Có - Yes| GetMinQueue[minInQueue = min floor in queue]
    CheckFloorsBelow -->|Không - No| NoPhantom

    GetMaxQueue --> CompareMax{maxInQueue < numFloors?}
    GetMinQueue --> CompareMin{minInQueue > 1?}

    CompareMax -->|Có - Yes| AddTopPhantom[Thêm phantom tầng đỉnh<br/>Add phantom floor = numFloors]
    CompareMax -->|Không - No| NoPhantom

    CompareMin -->|Có - Yes| AddBottomPhantom[Thêm phantom tầng đáy<br/>Add phantom floor = 1]
    CompareMin -->|Không - No| NoPhantom

    AddTopPhantom --> ResortQueue[Sắp xếp lại queue<br/>Re-sort queue]
    AddBottomPhantom --> ResortQueue

    ResortQueue --> End([Kết thúc - End])
    NoPhantom --> End

    style Start fill:#90EE90
    style AddTopPhantom fill:#FFD700
    style AddBottomPhantom fill:#FFD700
    style NoPhantom fill:#87CEEB
    style ResortQueue fill:#FFA500
```

### Ví Dụ Phantom Floor (Example)

```mermaid
graph LR
    subgraph "Trước khi thêm Phantom - Before"
        Before1["Tầng hiện tại: 5<br/>Current: 5"]
        Before2["Hướng: UP<br/>Direction: UP"]
        Before3["Queue: [7, 10]"]
        Before4["maxFloor: 20"]
    end

    subgraph "Sau khi thêm Phantom - After"
        After1["Tầng hiện tại: 5<br/>Current: 5"]
        After2["Hướng: UP<br/>Direction: UP"]
        After3["Queue: [7, 10, 20⭐phantom]"]
        After4["✅ Đảm bảo đến tầng đỉnh<br/>Ensures reaching top"]
    end

    Before1 --> After1
    Before2 --> After2
    Before3 --> After3
    Before4 --> After4

    style After3 fill:#FFD700
    style After4 fill:#90EE90
```

---

## 6. State Machine (Máy Trạng Thái)

```mermaid
stateDiagram-v2
    [*] --> IDLE: Khởi tạo thang máy<br/>Initialize elevator

    IDLE --> MOVING: Có request trong queue<br/>Request in queue
    IDLE --> IDLE: Không có request<br/>No requests

    MOVING --> ARRIVING: Đến gần tầng đích<br/>Approaching target floor
    MOVING --> MOVING: Vẫn còn xa<br/>Still far from target

    ARRIVING --> DOORS_OPENING: Đến tầng đích<br/>Reached target floor

    DOORS_OPENING --> DOORS_OPEN: Cửa mở xong<br/>Doors fully open

    DOORS_OPEN --> DOORS_CLOSING: Hết thời gian chờ<br/>Hold time expired

    DOORS_CLOSING --> MOVING: Cửa đóng & còn queue<br/>Doors closed & queue not empty
    DOORS_CLOSING --> IDLE: Cửa đóng & hết queue<br/>Doors closed & queue empty

    note right of IDLE
        direction: 'idle'
        queue: []
    end note

    note right of MOVING
        direction: 'up' | 'down'
        Đang di chuyển theo hướng
        Moving in direction
    end note

    note right of DOORS_OPEN
        Phục vụ tầng
        Serving floor
        Loại bỏ phantom nếu có
        Remove phantom if any
    end note
```

### State Transitions với SCAN Logic

```mermaid
stateDiagram-v2
    [*] --> CheckQueue: Elevator được gọi<br/>Elevator called

    CheckQueue --> SetDirection: Queue không rỗng<br/>Queue not empty
    CheckQueue --> [*]: Queue rỗng, ở IDLE<br/>Queue empty, stay IDLE

    SetDirection --> MovingUP: queue[0] > currentFloor<br/>Đi LÊN - Going UP
    SetDirection --> MovingDOWN: queue[0] < currentFloor<br/>Đi XUỐNG - Going DOWN

    MovingUP --> CheckExtreme: Phục vụ tất cả tầng UP<br/>Serve all UP floors
    MovingDOWN --> CheckExtreme: Phục vụ tất cả tầng DOWN<br/>Serve all DOWN floors

    CheckExtreme --> AtExtreme: Đến tầng đỉnh/đáy<br/>Reached top/bottom
    CheckExtreme --> AtPhantom: Đến phantom floor<br/>Reached phantom floor
    CheckExtreme --> AtLastRequest: Không có phantom<br/>Reached last request<br/>(LOOK behavior)

    AtExtreme --> ReverseDirection: ✅ SCAN: Đảo chiều tại extreme<br/>Reverse at extreme
    AtPhantom --> ReverseDirection: ✅ SCAN: Đảo chiều tại phantom<br/>Reverse at phantom
    AtLastRequest --> ReverseDirection: ⚠️ LOOK: Đảo chiều sớm<br/>Early reversal

    ReverseDirection --> CheckQueue: Kiểm tra queue mới<br/>Check new queue
```

---

## 7. Flow Xử Lý Request (Request Handling Flow)

```mermaid
graph TD
    Start([User nhấn nút tầng<br/>User presses floor button]) --> CreateRequest[Tạo request object:<br/>floor, callDirection, timestamp]

    CreateRequest --> CheckAutoMode{Chế độ AUTO?<br/>Auto Mode?}

    CheckAutoMode -->|Có - Yes| SelectAlgorithm{Thuật toán nào?<br/>Which Algorithm?}
    CheckAutoMode -->|Không - No| ManualAssign[Người dùng chọn thang máy thủ công<br/>User manually selects elevator]

    SelectAlgorithm -->|SCAN| ScanAlgorithm[Chạy SCAN Algorithm<br/>Run SCAN Algorithm]
    SelectAlgorithm -->|LOOK| LookAlgorithm[Chạy LOOK Algorithm<br/>Run LOOK Algorithm]
    SelectAlgorithm -->|SSTF| SstfAlgorithm[Chạy SSTF Algorithm<br/>Run SSTF Algorithm]

    ScanAlgorithm --> AddToElevator[Thêm request vào elevator.queue<br/>Add request to elevator.queue]
    LookAlgorithm --> AddToElevator
    SstfAlgorithm --> AddToElevator
    ManualAssign --> AddToElevator

    AddToElevator --> CheckPhantom{SCAN và cần phantom?<br/>SCAN & need phantom?}

    CheckPhantom -->|Có - Yes| AddPhantom[Thêm phantom floor<br/>Add phantom floor]
    CheckPhantom -->|Không - No| SortQueue[Sắp xếp queue theo hướng<br/>Sort queue by direction]

    AddPhantom --> SortQueue

    SortQueue --> UpdateUI[Cập nhật UI<br/>Update UI]
    UpdateUI --> TriggerMovement[Kích hoạt elevator movement<br/>Trigger elevator movement]

    TriggerMovement --> End([Kết thúc - End])

    style Start fill:#90EE90
    style ScanAlgorithm fill:#FFD700
    style AddPhantom fill:#FFA500
    style TriggerMovement fill:#87CEEB
```

---

## 8. Flow So Sánh SCAN vs LOOK vs SSTF

```mermaid
graph TD
    Start([Yêu cầu mới<br/>New Request]) --> Algorithm{Thuật toán?<br/>Algorithm?}

    Algorithm -->|SCAN| ScanCalc["📊 SCAN Cost Calculation<br/><br/>Cân nhắc:<br/>1. Distance to call<br/>2. Direction match<br/>3. Must go to EXTREME<br/>4. Penalty for reversal"]

    Algorithm -->|LOOK| LookCalc["📊 LOOK Cost Calculation<br/><br/>Cân nhắc:<br/>1. Distance to call<br/>2. Direction match<br/>3. Last request (not extreme)<br/>4. Penalty for reversal"]

    Algorithm -->|SSTF| SstfCalc["📊 SSTF Cost Calculation<br/><br/>Cân nhắc:<br/>1. ONLY distance<br/>2. No direction<br/>3. No extremes<br/>4. ⚠️ Greedy = Starvation"]

    ScanCalc --> ScanDecision{Thang máy tốt nhất<br/>Best Elevator}
    LookCalc --> LookDecision{Thang máy tốt nhất<br/>Best Elevator}
    SstfCalc --> SstfDecision{Thang máy gần nhất<br/>Nearest Elevator}

    ScanDecision --> ScanServe["✅ SCAN Serve<br/><br/>Đặc điểm:<br/>- Công bằng 100%<br/>- Đến extreme<br/>- Không starvation"]

    LookDecision --> LookServe["⚡ LOOK Serve<br/><br/>Đặc điểm:<br/>- Hiệu quả cao<br/>- Đảo chiều sớm<br/>- Starvation rất thấp"]

    SstfDecision --> SstfServe["⚠️ SSTF Serve<br/><br/>Đặc điểm:<br/>- Tham lam<br/>- Không công bằng<br/>- ❌ Starvation cao"]

    ScanServe --> End([Kết thúc - End])
    LookServe --> End
    SstfServe --> End

    style ScanCalc fill:#90EE90
    style LookCalc fill:#87CEEB
    style SstfCalc fill:#FFB6C1
    style ScanServe fill:#90EE90
    style LookServe fill:#87CEEB
    style SstfServe fill:#FF6B6B
```

---

## 9. Timeline Flow - Ví Dụ Thực Tế

```mermaid
gantt
    title Ví dụ SCAN - 10 tầng, 1 thang máy
    dateFormat X
    axisFormat %s

    section Requests
    Request tầng 5 UP     :milestone, r1, 0, 0s
    Request tầng 8 UP     :milestone, r2, 5, 0s
    Request tầng 3 DOWN   :milestone, r3, 6, 0s
    Request tầng 7 UP     :milestone, r4, 9, 0s

    section Elevator Movement
    Tầng 1→5 (UP)         :active, m1, 0, 5s
    Phục vụ tầng 5        :crit, s1, 5, 1s
    Tầng 5→8 (UP)         :active, m2, 6, 3s
    Phục vụ tầng 8        :crit, s2, 9, 1s
    Tầng 8→10 (EXTREME)   :done, m3, 10, 2s
    Đảo chiều tại 10      :milestone, rev, 12, 0s
    Tầng 10→7 (DOWN)      :active, m4, 12, 3s
    Phục vụ tầng 7        :crit, s3, 15, 1s
    Tầng 7→3 (DOWN)       :active, m5, 16, 4s
    Phục vụ tầng 3        :crit, s4, 20, 1s
```

---

## 10. Decision Tree - Lựa Chọn Thuật Toán

```mermaid
graph TD
    Start([Cần chọn thuật toán<br/>Need to choose algorithm]) --> Q1{Lưu lượng cao?<br/>High Traffic?}

    Q1 -->|Có - Yes| UseScan1[✅ Dùng SCAN<br/>Công bằng ưu tiên]
    Q1 -->|Không - No| Q2{Công bằng quan trọng?<br/>Fairness critical?}

    Q2 -->|Có - Yes| UseScan2[✅ Dùng SCAN<br/>Quy định, trách nhiệm pháp lý]
    Q2 -->|Không - No| Q3{Dự đoán được cần thiết?<br/>Predictability needed?}

    Q3 -->|Có - Yes| UseScan3[✅ Dùng SCAN<br/>Kỳ vọng người dùng]
    Q3 -->|Không - No| Q4{Lưu lượng thay đổi?<br/>Variable traffic?}

    Q4 -->|Có - Yes| UseLook1[⚡ Dùng LOOK<br/>Tăng hiệu quả]
    Q4 -->|Không - No| Q5{Tiết kiệm năng lượng?<br/>Energy savings?}

    Q5 -->|Có - Yes| UseLook2[⚡ Dùng LOOK<br/>Tòa nhà xanh]
    Q5 -->|Không - No| Q6{Chỉ giáo dục?<br/>Educational only?}

    Q6 -->|Có - Yes| UseSSTF[⚠️ Dùng SSTF<br/>Demo starvation]
    Q6 -->|Không - No| Default[✅ Mặc định: SCAN<br/>An toàn nhất]

    style UseScan1 fill:#90EE90
    style UseScan2 fill:#90EE90
    style UseScan3 fill:#90EE90
    style UseLook1 fill:#87CEEB
    style UseLook2 fill:#87CEEB
    style UseSSTF fill:#FFB6C1
    style Default fill:#90EE90
```

---

## 📝 Cách Sử Dụng (How to Use)

### Render Mermaid Diagrams

Các sơ đồ Mermaid có thể được render bởi:

1. **GitHub** - Tự động render trong markdown
2. **VS Code** - Sử dụng extension "Markdown Preview Mermaid Support"
3. **Online Editors**:
   - [Mermaid Live Editor](https://mermaid.live/)
   - [Mermaid Chart](https://www.mermaidchart.com/)

### Export Images

Để export thành hình ảnh:

```bash
# Sử dụng mermaid-cli
npm install -g @mermaid-js/mermaid-cli

# Render một diagram
mmdc -i SCAN_FLOWCHARTS.md -o output.png -t default
```

---

## 🔗 Links Tham Khảo (Reference Links)

- [Tài liệu SCAN Algorithm](./SCAN_ALGORITHM.md)
- [Mermaid Documentation](https://mermaid.js.org/)
- [Implementation Code](../src/algorithms/scanAlgorithm.js)

---

**Phiên bản (Version)**: 1.0
**Cập nhật lần cuối (Last Updated)**: 2025-11-08
**Tác giả (Author)**: Luân B
