# 🏢 Trình mô phỏng thang máy đơn giản

Một trình mô phỏng lập lịch thang máy tương tác giúp trực quan hóa và so sánh các thuật toán điều phối thang máy khác nhau trong thời gian thực.

![Trình mô phỏng thang máy đơn giản](docs/screenshots/simple-elevator-simulator.png)

## Tính năng

- **Tòa nhà có thể định cấu hình**: 2-24 tầng, 2-12 thang máy
- **Trực quan hóa thời gian thực**: Xem thang máy di chuyển với hoạt ảnh cửa
- **3 thuật toán lập lịch**:
  - **SCAN** ⭐ (Khuyên dùng): Tiêu chuẩn công nghiệp, di chuyển theo một hướng đến điểm cuối cùng rồi đảo ngược
  - **LOOK**: Đảo ngược khi không còn yêu cầu nào ở phía trước (hiệu quả hơn SCAN)
  - **SSTF**: Phục vụ tầng gần nhất trước tiên (mục đích giáo dục, có thể gây ra tình trạng đói)
- **Chế độ thủ công & tự động**: Gán thủ công hoặc điều phối dựa trên thuật toán
- **Thời gian có thể định cấu hình**: Điều chỉnh thời gian di chuyển, tốc độ mở/đóng cửa

## Bắt đầu

### Điều kiện tiên quyết

- Node.js v20.0.0+
- npm v10.0.0+

### Cài đặt

```bash
git clone https://github.com/kinhluan/simple-elevator-simulator.git
cd simple-elevator-simulator
npm install
npm run dev
```

Mở trình duyệt tới `http://localhost:5173`

## Sử dụng

**Chế độ thủ công**: Nhấp vào các nút tầng để yêu cầu thang máy, sau đó gán thủ công cho các cabin cụ thể

**Chế độ tự động**: Chọn một thuật toán (SCAN/LOOK/SSTF) và nhấp vào các nút tầng - thang máy được điều phối tự động

**Cấu hình**: Điều chỉnh kích thước tòa nhà và thời gian trong bảng Cấu hình

## Cấu trúc dự án

```
.
├── .github/                          # GitHub workflows và CI/CD
├── docs/                             # Tài liệu dự án
│   ├── screenshots/                  # Ảnh chụp màn hình
│   │   └── simple-elevator-simulator.png
│   ├── ALGORITHMS.md                 # Tổng quan về các thuật toán
│   ├── ARCHITECTURE.md               # Kiến trúc hệ thống
│   ├── INTERACTION_DESIGN_REQUIREMENTS.md  # Yêu cầu thiết kế tương tác
│   ├── LOOK_ALGORITHM.md             # Thuật toán LOOK chi tiết
│   ├── SCAN_ALGORITHM.md             # Thuật toán SCAN chi tiết
│   ├── SSTF_ALGORITHM.md             # Thuật toán SSTF chi tiết
│   └── USER_GUIDE.md                 # Hướng dẫn sử dụng
├── src/
│   ├── algorithms/                   # Thuật toán lập lịch
│   │   ├── elevatorScheduler.js      # Bộ điều phối chính
│   │   ├── elevatorScheduler.test.js
│   │   ├── lookAlgorithm.js          # Thuật toán LOOK
│   │   ├── lookAlgorithm.test.js
│   │   ├── scanAlgorithm.js          # Thuật toán SCAN
│   │   ├── scanAlgorithm.test.js
│   │   ├── sstfAlgorithm.js          # Thuật toán SSTF
│   │   └── sstfAlgorithm.test.js
│   ├── components/                   # React components
│   │   ├── AlgorithmAndBuildingPanel.jsx  # Panel chọn thuật toán
│   │   ├── BuildingConfigPanel.jsx   # Cấu hình tòa nhà
│   │   ├── BuildingVisualization.jsx # Hiển thị tòa nhà
│   │   ├── CallsAndElevatorsPanel.jsx# Panel quản lý calls
│   │   ├── CollapsibleSidebar.jsx    # Sidebar thu gọn
│   │   ├── Elevator.jsx              # Component thang máy
│   │   ├── ElevatorCar.jsx           # Cabin thang máy
│   │   ├── HeroSection.jsx           # Hero section
│   │   ├── InstructionsPanel.jsx     # Hướng dẫn
│   │   ├── RightSidebar.jsx          # Sidebar phải
│   │   ├── StatisticsDashboard.jsx   # Bảng thống kê
│   │   └── TabbedControlPanel.jsx    # Panel điều khiển tabs
│   ├── constants/
│   │   └── elevatorTiming.js         # Hằng số thời gian
│   ├── hooks/
│   │   └── useElevatorSystem.js      # Hook quản lý state chính
│   ├── styles/
│   │   └── designSystem.js           # Design system
│   ├── test/
│   │   └── setup.js                  # Cấu hình test
│   ├── utils/
│   │   └── elevatorUtils.js          # Utility functions
│   ├── App.jsx                       # Component chính
│   ├── index.css                     # Global styles
│   └── main.jsx                      # Entry point
├── .gitignore
├── .nvmrc                            # Node version
├── CLAUDE.md                         # Hướng dẫn cho Claude Code
├── GEMINI.md                         # Hướng dẫn cho Gemini
├── eslint.config.js                  # ESLint config
├── favicon.ico
├── index.html                        # HTML template
├── package-lock.json
├── package.json                      # Dependencies & scripts
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
├── README.md                         # Tài liệu này
└── vite.config.js                    # Vite config
```

## Công nghệ

- **React 19.0.0** - Framework UI
- **Vite 6.2.0** - Công cụ xây dựng và máy chủ phát triển
- **Tailwind CSS 4.0.17** - CSS ưu tiên tiện ích
- **JavaScript (ES6+)** - Logic cốt lõi
- **ESLint 9.21.0** - Chất lượng mã

## So sánh thuật toán

| Thuật toán | Hướng | Công bằng | Hiệu quả | Starvation Risk | Sử dụng trong thực tế |
|-----------|-----------|----------|------------|-----------------|----------------|
| **SCAN** ⭐ | ✅ Có | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | None | ✅ Tiêu chuẩn |
| **LOOK** | ✅ Có | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | Very Low | ⚠️ Hiếm |
| **SSTF** | ❌ Không | ⭐⭐ | ⭐⭐⭐ | High | ❌ Không |

**Khi nào nên sử dụng:**

- **SCAN**: Production systems, high traffic (most predictable, no starvation)
- **LOOK**: Các mẫu lưu lượng truy cập thay đổi (hiệu quả hơn, tránh các thái cực trống)
- **SSTF**: Education only (demonstrates starvation problems)

## Giải thích về Starvation Risk

"Starvation Risk" (Rủi ro bị bỏ đói) là một thuật ngữ trong khoa học máy tính và lý thuyết thuật toán. Trong bối cảnh của trình mô phỏng thang máy, nó mô tả một tình huống trong đó một yêu cầu gọi thang máy (ví dụ: một người đang chờ ở một tầng nào đó) liên tục bị bỏ qua hoặc không được phục vụ trong một khoảng thời gian rất dài.

Hãy tưởng tượng bạn đang đợi thang máy ở tầng 20, nhưng thang máy liên tục bận rộn phục vụ các yêu cầu giữa tầng 1 và tầng 10. Nếu thuật toán không được thiết kế tốt, yêu cầu của bạn ở tầng 20 có thể bị "bỏ đói" và không bao giờ được phục vụ.

Dưới đây là giải thích về "Starvation Risk" cho từng thuật toán:

*   **SSTF (Shortest Seek Time First): High Starvation Risk**
    *   **Tại sao?** Thuật toán này luôn ưu tiên phục vụ yêu cầu ở tầng gần nhất với vị trí hiện tại của thang máy. Điều này có thể dẫn đến tình trạng "bỏ đói" cho các tầng ở xa. Ví dụ, nếu thang máy đang ở tầng 5 và liên tục có các cuộc gọi mới ở các tầng 4, 6, 3, 7, nó sẽ chỉ di chuyển quanh khu vực đó. Một cuộc gọi từ tầng 24 sẽ bị bỏ qua vô thời hạn vì nó luôn "quá xa" so với các yêu cầu gần hơn.

*   **SCAN: No Starvation Risk**
    *   **Tại sao?** Thuật toán SCAN buộc thang máy phải di chuyển hết hành trình theo một hướng (ví dụ: đi lên đến tầng cao nhất) trước khi đảo chiều và đi hết hành trình theo hướng ngược lại (đi xuống tầng thấp nhất). Bằng cách này, nó đảm bảo rằng thang máy sẽ đi qua *tất cả các tầng* trong một chu kỳ hoàn chỉnh. Do đó, không có yêu cầu nào có thể bị bỏ qua mãi mãi.

*   **LOOK: Very Low Starvation Risk**
    *   **Tại sao?** LOOK là một phiên bản cải tiến của SCAN. Thay vì đi đến tầng cao nhất/thấp nhất, nó chỉ đi đến tầng có yêu cầu cao nhất/thấp nhất theo hướng di chuyển hiện tại rồi đảo chiều. Mặc dù hiệu quả hơn, về mặt lý thuyết, có một khả năng rất nhỏ (và hiếm gặp trong thực tế) là một yêu cầu ở tầng xa nhất có thể phải chờ đợi nếu liên tục có các yêu cầu mới xuất hiện ngay trước điểm đảo chiều của thang máy. Tuy nhiên, rủi ro này thấp đến mức có thể bỏ qua trong hầu hết các trường hợp sử dụng thực tế.

## Triển khai

Triển khai lên GitHub Pages:

```bash
npm run deploy
```

Xây dựng cho sản xuất:

```bash
npm run build
```

## Giấy phép

Giấy phép MIT

## Ghi nhận

Nguồn cảm hứng ban đầu từ [arunsai63/SmartLift](https://github.com/arunsai63/SmartLift)
