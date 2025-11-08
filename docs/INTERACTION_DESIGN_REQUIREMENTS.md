# Interaction Design Requirements
## Dựa trên "Interaction Design: Beyond Human-Computer Interaction"

Tài liệu này phân tích requirements cho dự án Elevator Simulator theo góc độ Interaction Design, tập trung vào **Chương 4 (Social Interaction)** và **Chương 7 (Data Gathering)**.

---

## 🎯 Mục Tiêu Nghiên Cứu

### Research Questions (RQs)

**RQ1**: Liệu visualization có giúp sinh viên hiểu scheduling algorithms tốt hơn textbook không?

**RQ2**: Algorithm nào (SCAN/LOOK/SSTF) dễ hiểu nhất cho người mới bắt đầu?

**RQ3**: Collaborative learning có cải thiện hiểu biết về algorithms không?

**RQ4**: Những barriers nào cản trở việc học scheduling algorithms?

---

## 📋 Chương 7: Data Gathering Plan

### 1. Interview Protocol

#### 1.1 Pre-Design Stakeholder Interviews

**Target**: 10-15 Computer Science students + 3-5 instructors

**Interview Guide**:

```markdown
# Semi-Structured Interview - Students (30 mins)

## Background (5 mins)
1. Năm học hiện tại?
2. Đã học môn Operating Systems / Algorithms chưa?
3. Kinh nghiệm với visualization tools?

## Learning Experience (10 mins)
4. Khi học scheduling algorithms, khó khăn chính là gì?
   - Probe: Concepts? Math? Implementation?
5. Bạn thích học qua cách nào?
   - Probe: Lecture? Video? Hands-on? Group discussion?
6. Đã sử dụng simulator/visualization nào chưa?
   - If yes: Thích/không thích điểm gì?

## Social Learning (10 mins)
7. Bạn thường học một mình hay với nhóm?
8. Khi làm group assignment, thường phân công như thế nào?
9. Cách nào giúp bạn nhớ kiến thức lâu nhất?
   - Teaching others? Discussing? Practice?

## Tool Requirements (5 mins)
10. Features nào bạn mong muốn trong một learning tool?
11. Bạn có sẵn sàng share progress với peers không?
12. Prefer mobile hay desktop?

## Closing
- Anything else to add?
- Would you like to participate in usability testing?
```

**Interview với Instructors**:
```markdown
# Instructor Interview (45 mins)

## Teaching Challenges
1. Topics nào students struggle nhất trong OS/Algorithms?
2. How do you currently explain elevator algorithms?
3. What misconceptions do students commonly have?

## Tool Requirements
4. Features cần có để integrate vào curriculum?
5. Assessment methods bạn muốn?
6. Cần export data gì để grade students?

## Adoption Barriers
7. Technical constraints (LMS integration, browser support)?
8. Time constraints trong syllabus?
9. How would you evaluate tool effectiveness?
```

#### 1.2 Post-Use Interviews

**Timing**: After 2 weeks of tool usage

**Protocol**:
```markdown
# Post-Use Interview (20 mins)

## Learning Outcomes
1. So với trước, bạn hiểu algorithms tốt hơn như thế nào?
   - Rate 1-5, explain
2. Algorithm nào bạn hiểu rõ nhất? Tại sao?
3. Có concept nào vẫn confusing không?

## Tool Usability
4. Feature nào useful nhất?
5. Feature nào bạn không dùng? Tại sao?
6. Có gặp bug hay frustration nào không?

## Social Features (if implemented)
7. Có collaborate với peers qua tool không?
8. Feedback từ peers có hữu ích không?
9. Leaderboard có motivate bạn không?

## Improvements
10. Nếu redesign, bạn sẽ change gì?
11. Recommend cho bạn bè không? Why/why not?
```

### 2. Questionnaire Design

#### 2.1 Pre-Use Questionnaire

**Purpose**: Baseline knowledge assessment + demographics

```javascript
// Questionnaire Structure
{
  section1_demographics: {
    questions: [
      { id: "Q1", type: "text", text: "Student ID (anonymous)" },
      { id: "Q2", type: "radio", text: "Year of study",
        options: ["Year 1", "Year 2", "Year 3", "Year 4"] },
      { id: "Q3", type: "radio", text: "Major",
        options: ["CS", "SE", "IT", "Other"] }
    ]
  },

  section2_prior_knowledge: {
    questions: [
      {
        id: "Q4",
        type: "likert5",
        text: "I understand what scheduling algorithms are",
        scale: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]
      },
      {
        id: "Q5",
        type: "multiple-choice",
        text: "Have you heard of these algorithms? (Select all)",
        options: ["SCAN", "LOOK", "SSTF", "FCFS", "None"]
      },
      {
        id: "Q6",
        type: "likert5",
        text: "I am confident I can explain how elevator scheduling works"
      }
    ]
  },

  section3_learning_preferences: {
    questions: [
      {
        id: "Q7",
        type: "ranking",
        text: "Rank learning methods by preference (1=most prefer)",
        items: ["Reading textbook", "Watching videos", "Interactive simulation",
                "Group discussion", "Coding implementation"]
      },
      {
        id: "Q8",
        type: "radio",
        text: "I prefer to study",
        options: ["Alone", "With 1 partner", "In small group (3-4)", "Large group (5+)"]
      }
    ]
  },

  section4_expectations: {
    questions: [
      {
        id: "Q9",
        type: "open-ended",
        text: "What do you hope to learn from this simulator?",
        minWords: 20
      },
      {
        id: "Q10",
        type: "open-ended",
        text: "What features would make this tool useful for you?",
        minWords: 20
      }
    ]
  }
}
```

#### 2.2 Post-Use Questionnaire

**Purpose**: Learning effectiveness + usability evaluation

```javascript
{
  section1_learning_outcomes: {
    questions: [
      {
        id: "Q1",
        type: "likert5",
        text: "After using the simulator, I understand SCAN algorithm"
      },
      {
        id: "Q2",
        type: "likert5",
        text: "I understand LOOK algorithm"
      },
      {
        id: "Q3",
        type: "likert5",
        text: "I understand SSTF algorithm and its starvation problem"
      },
      {
        id: "Q4",
        type: "multiple-choice",
        text: "Which algorithm do you understand BEST?",
        options: ["SCAN", "LOOK", "SSTF", "Still confused about all"]
      },
      {
        id: "Q5",
        type: "open-ended",
        text: "Explain in your own words: Why does SSTF cause starvation?",
        assessmentRubric: "Will be graded for understanding"
      }
    ]
  },

  section2_usability_SUS: {
    title: "System Usability Scale (SUS)",
    questions: [
      { id: "SUS1", type: "likert5",
        text: "I think I would like to use this simulator frequently" },
      { id: "SUS2", type: "likert5",
        text: "I found the simulator unnecessarily complex" },
      { id: "SUS3", type: "likert5",
        text: "I thought the simulator was easy to use" },
      { id: "SUS4", type: "likert5",
        text: "I think I would need technical support to use this" },
      { id: "SUS5", type: "likert5",
        text: "I found the various functions well integrated" },
      { id: "SUS6", type: "likert5",
        text: "I thought there was too much inconsistency" },
      { id: "SUS7", type: "likert5",
        text: "I would imagine most people would learn to use this quickly" },
      { id: "SUS8", type: "likert5",
        text: "I found the simulator very cumbersome to use" },
      { id: "SUS9", type: "likert5",
        text: "I felt very confident using the simulator" },
      { id: "SUS10", type: "likert5",
        text: "I needed to learn a lot before I could get going" }
    ],
    scoring: "SUS score = ((sum of odd items - 5) + (25 - sum of even items)) * 2.5"
  },

  section3_feature_usage: {
    questions: [
      {
        id: "Q11",
        type: "checkbox",
        text: "Which features did you use? (Select all)",
        options: [
          "Floor call buttons",
          "Manual elevator assignment",
          "Auto mode (SCAN)",
          "Auto mode (LOOK)",
          "Auto mode (SSTF)",
          "Statistics dashboard",
          "Config panel (change floors/elevators)",
          "Instructions panel"
        ]
      },
      {
        id: "Q12",
        type: "ranking",
        text: "Rank features by usefulness (1=most useful)",
        items: ["Real-time animation", "Statistics charts", "Queue visualization",
                "Instructions text", "Config controls"]
      }
    ]
  },

  section4_improvements: {
    questions: [
      {
        id: "Q13",
        type: "open-ended",
        text: "What did you like MOST about the simulator?",
        minWords: 15
      },
      {
        id: "Q14",
        type: "open-ended",
        text: "What frustrated you or confused you?",
        minWords: 15
      },
      {
        id: "Q15",
        type: "open-ended",
        text: "What would you add or change?",
        minWords: 15
      },
      {
        id: "Q16",
        type: "likert5",
        text: "I would recommend this simulator to other students"
      }
    ]
  }
}
```

#### 2.3 Micro-Surveys (In-App)

**Contextual, trigger-based mini surveys**:

```javascript
const microSurveys = [
  {
    trigger: "after_first_starvation_event",
    timing: "immediate pop-up",
    questions: [
      {
        text: "Did you notice that floor 18 was 'starved' (waited very long)?",
        type: "yes/no"
      },
      {
        text: "Do you understand WHY it was starved?",
        type: "multiple-choice",
        options: [
          "Yes, SSTF keeps picking closer floors",
          "Somewhat understand",
          "No, confused",
          "What is starvation?"
        ]
      }
    ]
  },

  {
    trigger: "after_30_minutes_usage",
    timing: "non-intrusive banner",
    questions: [
      {
        text: "Quick question: Which algorithm makes most sense to you so far?",
        type: "single-choice",
        options: ["SCAN", "LOOK", "SSTF", "Still learning"]
      }
    ]
  },

  {
    trigger: "before_leaving_page",
    timing: "exit intent",
    questions: [
      {
        text: "Before you go: Rate your experience (1-5 stars)",
        type: "star-rating"
      },
      {
        text: "One thing we could improve?",
        type: "short-text",
        optional: true
      }
    ]
  }
]
```

### 3. Observation Methods

#### 3.1 Automated Usage Analytics

**Implementation Plan**:

```javascript
// src/utils/analyticsTracker.js

const AnalyticsTracker = {
  sessionId: null,
  userId: null,
  events: [],

  init(userId) {
    this.sessionId = generateUUID()
    this.userId = anonymizeId(userId) // GDPR-compliant
    this.startTime = Date.now()
  },

  // Track all interactions
  trackEvent(eventType, data) {
    const event = {
      sessionId: this.sessionId,
      userId: this.userId,
      timestamp: Date.now(),
      eventType,
      data
    }

    this.events.push(event)

    // Send to backend (batch every 10 events or 30 seconds)
    if (this.events.length >= 10) {
      this.flush()
    }
  },

  // Specific event trackers
  trackButtonClick(buttonId, context) {
    this.trackEvent('button_click', {
      buttonId,
      context,
      screenPosition: { x: event.clientX, y: event.clientY }
    })
  },

  trackAlgorithmSwitch(from, to) {
    this.trackEvent('algorithm_switch', { from, to })
  },

  trackElevatorCall(floor, direction) {
    this.trackEvent('elevator_call', { floor, direction })
  },

  trackConfusionIndicator(type, details) {
    // Detect confusion patterns
    this.trackEvent('confusion_indicator', { type, details })
    // Types: rapid_clicking, back_forth_switching, long_idle, etc.
  },

  trackLearningMoment(algorithmName, insightType) {
    this.trackEvent('learning_moment', { algorithmName, insightType })
    // Types: "understood_starvation", "compared_algorithms", etc.
  },

  // Session summary
  getSessionSummary() {
    return {
      sessionId: this.sessionId,
      duration: Date.now() - this.startTime,
      totalEvents: this.events.length,
      algorithmsExplored: this.getUniqueAlgorithms(),
      mostUsedFeature: this.getMostUsedFeature(),
      confusionScore: this.calculateConfusionScore()
    }
  }
}
```

**Metrics to Track**:

| Category | Metrics | Purpose |
|----------|---------|---------|
| **Engagement** | Session duration, Return visits, Feature usage frequency | Measure tool adoption |
| **Learning Path** | Algorithm exploration sequence, Time per algorithm, Comparison actions | Understand learning journey |
| **Confusion Indicators** | Rapid back-forth switches, Help button clicks, Long idle times | Identify pain points |
| **Success Indicators** | Completed scenarios, Quiz performance (if added), Annotation quality | Measure learning outcomes |

#### 3.2 Lab-Based Observation

**Setup**: Controlled usability testing sessions

**Protocol**:
```markdown
# Usability Testing Session Protocol (60 mins)

## Participants
- 5-8 students per round
- 3 rounds total (15-24 participants)

## Setup
- Individual workstations
- Screen recording software
- Optional: Eye-tracking, webcam (with consent)
- Observer notes station

## Session Flow

### 1. Introduction (5 mins)
- Explain purpose: "We're testing the tool, not you"
- Get consent for recording
- Introduce think-aloud protocol
- Answer questions

### 2. Pre-Task Questionnaire (5 mins)
- Demographics + prior knowledge

### 3. Task Scenarios (30 mins)

**Task 1: Free Exploration (10 mins)**
- "Explore the simulator freely. Try different things."
- **Observe**:
  - First clicks (where do they start?)
  - Do they read instructions?
  - Natural exploration path

**Task 2: Guided Learning (10 mins)**
- "Use SCAN algorithm. Call elevators from various floors."
- "Try to make an elevator go to the top floor."
- **Observe**:
  - Do they understand auto vs manual mode?
  - Can they interpret elevator behavior?

**Task 3: Comparison (10 mins)**
- "Compare SCAN and SSTF. Which is 'fairer'?"
- **Observe**:
  - How do they approach comparison?
  - Do they use statistics panel?
  - Can they articulate differences?

### 4. Post-Task Interview (15 mins)
- "What did you think of the tool?"
- "What was confusing?"
- "What would you change?"
- Probe on specific observed behaviors

### 5. Post-Task Questionnaire (5 mins)
- SUS + learning outcomes

## Observer Checklist

For each participant, note:
- [ ] Read instructions before starting
- [ ] Understood auto vs manual mode immediately
- [ ] Used statistics panel
- [ ] Compared multiple algorithms
- [ ] Expressed "aha moments" (note what triggered them)
- [ ] Expressed frustration (note what caused it)
- [ ] Asked for help (note what about)

## Critical Incidents Log
Document any:
- Errors or bugs encountered
- Misunderstandings of concepts
- Delightful moments
- Frustrating moments
```

#### 3.3 Remote Observation (At-Scale)

**Tools**:
- Hotjar / FullStory for session replay
- Google Analytics for traffic
- Custom event tracking (see 3.1)

**Analysis Plan**:
```javascript
// Weekly analysis of remote usage data

const analysisQuestions = {
  week1: {
    question: "What is the drop-off rate?",
    metrics: ["Sessions started", "Sessions > 5 mins", "Sessions > 15 mins"],
    analysis: "Funnel analysis"
  },

  week2: {
    question: "Which features are ignored?",
    metrics: ["Feature click rates", "Time spent per feature"],
    analysis: "Identify unused features → consider removing or improving"
  },

  week3: {
    question: "Where do users get stuck?",
    metrics: ["Rage clicks", "Long idle times", "Back-forth patterns"],
    analysis: "Heatmaps + session replays of confused users"
  },

  week4: {
    question: "Does usage pattern correlate with learning?",
    metrics: ["Usage time", "Features used", "Post-quiz scores"],
    analysis: "Correlation analysis"
  }
}
```

---

## 🤝 Chương 4: Social Interaction Features

### 1. Communication Features

#### 1.1 In-App Chat/Discussion

**Requirement**:
```javascript
// Feature specification
{
  feature: "Real-time discussion panel",

  functionality: {
    textChat: {
      participants: "all users currently online",
      messageTypes: ["text", "emoji", "screenshot"],
      features: ["reply threads", "reactions", "mentions"]
    },

    contextualChat: {
      linkToState: "users can share current simulator state",
      example: "User A: 'Look at this starvation! [share state]'",
      recipientAction: "User B clicks link → sees same elevator setup"
    },

    persistence: {
      history: "last 100 messages",
      search: "searchable by keyword or user"
    }
  },

  UI_mockup: `
    ┌──────────────────────────────┐
    │ 💬 Live Discussion           │
    ├──────────────────────────────┤
    │ User1: SCAN seems to wait... │
    │ User2: Try LOOK instead 👍   │
    │ You: [Type message...]       │
    │ [📸 Share State] [😊 Emoji]  │
    └──────────────────────────────┘
  `,

  moderation: {
    required: true,
    approach: "flagging + keyword filter",
    instructor_role: "can pin important messages, mute users"
  }
}
```

#### 1.2 Annotation System

**Requirement**:
```javascript
{
  feature: "Collaborative annotations",

  functionality: {
    annotate: {
      what: "users can add notes to specific moments/events",
      example: "Flag when elevator reverses direction",
      data: {
        timestamp: "12:34:56",
        elevatorId: 2,
        event: "direction_change",
        note: "Why did it reverse here?",
        author: "Student123"
      }
    },

    reply: {
      enabled: true,
      threadDepth: 3 // max nested replies
    },

    visibility: {
      options: ["private", "shared with team", "public to all"],
      default: "shared with team"
    }
  },

  UI_placement: "Appears as markers on timeline or elevator visualization"
}
```

### 2. Coordination Features

#### 2.1 Team Mode

**Requirement**:
```javascript
{
  feature: "Multi-user collaborative sessions",

  roles: [
    {
      role: "Dispatcher",
      permissions: ["call elevators", "assign calls to elevators"],
      goal: "Minimize wait time"
    },
    {
      role: "Observer",
      permissions: ["view only", "add annotations"],
      goal: "Document interesting behaviors"
    },
    {
      role: "Analyst",
      permissions: ["view statistics", "export data"],
      goal: "Analyze performance metrics"
    }
  ],

  session: {
    creation: "Host creates room with code",
    joining: "Others join via room code",
    synchronization: "All see same elevator state in real-time",
    communication: "Built-in voice/text chat"
  },

  scenarios: [
    {
      name: "Algorithm Comparison Study",
      team_size: 3,
      task: "Each person tests one algorithm, then compare results",
      duration: "30 minutes",
      deliverable: "Shared report comparing metrics"
    }
  ]
}
```

#### 2.2 Shared Workspace

**Requirement**:
```javascript
{
  feature: "Collaborative dashboard",

  components: {
    sharedNotes: {
      type: "Google Docs-like",
      features: ["real-time co-editing", "comments", "version history"]
    },

    comparisonTable: {
      autofill: "Metrics from each team member's test",
      columns: ["Algorithm", "Avg Wait", "Max Wait", "Starvations"],
      sync: "Updates live as team members run tests"
    },

    annotatedTimeline: {
      shared: true,
      example: "Team marks interesting events, all can see"
    }
  },

  export: {
    formats: ["PDF report", "CSV data", "Screenshot gallery"],
    branding: "Include team name, date, results"
  }
}
```

### 3. Collaboration Features

#### 3.1 Team Challenges

**Requirement**:
```javascript
{
  feature: "Structured group activities",

  challenge_types: [
    {
      name: "Minimize Starvation Challenge",
      objective: "Configure SSTF to reduce starvation events",
      team_size: "2-4 students",
      approach: "Each proposes modification, team votes on best",
      scoring: "Automated based on starvation count"
    },
    {
      name: "Algorithm Debate",
      objective: "Argue for SCAN vs LOOK for a 30-floor building",
      team_size: "2 teams of 3",
      approach: "Each team gathers evidence, presents findings",
      judging: "Peer vote or instructor assessment"
    }
  ],

  platform_support: {
    challengeCreation: "Instructor can create custom challenges",
    teamFormation: "Auto-match or manual selection",
    progressTracking: "Dashboard shows team progress",
    submission: "Team submits final report/config"
  }
}
```

### 4. Social Influence Features

#### 4.1 Leaderboard & Gamification

**Requirement**:
```javascript
{
  feature: "Competitive and motivational elements",

  leaderboards: [
    {
      name: "Best Average Wait Time",
      metric: "avgWaitTime",
      timeframe: "weekly reset",
      display: "Top 10 users"
    },
    {
      name: "Most Efficient Setup",
      metric: "Fairness score + efficiency score",
      submission: "Users submit their config",
      voting: "Community votes on best"
    }
  ],

  achievements: {
    badges: [
      { name: "Algorithm Master", condition: "Tested all 3 algorithms" },
      { name: "Starvation Detective", condition: "Observed 5 starvation events" },
      { name: "Optimizer", condition: "Avg wait < 10s with SCAN" },
      { name: "Team Player", condition: "Completed 3 team challenges" }
    ],
    display: "On user profile",
    sharing: "Can share badges on social media (if desired)"
  },

  points_system: {
    earn_points: {
      "Complete tutorial": 10,
      "Test an algorithm": 5,
      "Annotate an insight": 3,
      "Help a peer (reply to question)": 5,
      "Top leaderboard": 20
    },
    use_points: {
      "Unlock advanced scenarios": 50,
      "Unlock historical data view": 30,
      "Bragging rights": "priceless"
    }
  },

  ethical_considerations: {
    optional: "Users can opt-out of leaderboard",
    privacy: "Usernames are pseudonymous",
    avoid: "Avoid punitive rankings (no 'worst' list)"
  }
}
```

#### 4.2 Peer Learning

**Requirement**:
```javascript
{
  feature: "Learn from peers",

  share_configurations: {
    user_action: "Click 'Share My Setup'",
    generates: "Link or code to replicate config",
    metadata: {
      creator: "Student123",
      title: "Optimal SCAN for 15-floor",
      description: "Minimizes starvation, good avg wait",
      stats: { avgWait: "8.5s", maxWait: "25s", starvations: 0 },
      likes: 42,
      comments: 8
    }
  },

  community_gallery: {
    browse: "See all shared configs",
    filter: "By algorithm, building size, rating",
    try: "One-click to load and test",
    rate: "Like/dislike + comment"
  },

  expert_tips: {
    from: "Instructor or top students",
    format: "Short video or text guide",
    topics: ["How to read statistics", "Common SSTF mistakes", "SCAN vs LOOK tips"]
  }
}
```

#### 4.3 Social Proof

**Requirement**:
```javascript
{
  feature: "Leverage social influence",

  display_stats: {
    "93% of students found SCAN easiest to understand",
    "Most popular config: 10 floors, 3 elevators, SCAN",
    "Average session time: 23 minutes"
  },

  highlight_consensus: {
    "Students agree: SSTF is worst for fairness",
    "Debated: SCAN vs LOOK - which is better?"
  },

  show_activity: {
    "15 students online now",
    "5 teams currently doing Algorithm Comparison challenge",
    "New high score on 'Best Avg Wait' leaderboard!"
  },

  testimonials: {
    from: "Previous students (with permission)",
    example: "'This simulator helped me ace the OS exam!' - Student 2023"
  }
}
```

---

## 📊 Data Analysis Plan

### Quantitative Analysis

```r
# Planned statistical tests

# RQ1: Does visualization help?
# Compare: Control group (textbook only) vs Treatment group (simulator)
# Metric: Post-test quiz scores
# Test: Independent t-test
t.test(quiz_scores ~ group, data = study_data)

# RQ2: Which algorithm is easiest?
# Metric: Self-reported understanding (Likert 1-5)
# Test: Repeated measures ANOVA
aov(understanding ~ algorithm + Error(participant/algorithm))

# RQ3: Does collaboration help?
# Compare: Solo users vs Team users
# Metric: Learning gains (post - pre scores)
# Test: ANCOVA (control for prior knowledge)
ancova(post_score ~ group + pre_score)

# Usability
# Metric: SUS scores
# Benchmark: SUS > 68 is acceptable, > 80 is excellent
mean(sus_scores)
```

### Qualitative Analysis

```markdown
# Thematic Analysis of Interview Data

## Process (following Braun & Clarke, 2006)

1. **Transcribe** all interviews
2. **Familiarize** - read multiple times, note initial ideas
3. **Code** - systematic coding of features
4. **Theme identification** - group codes into themes
5. **Review themes** - ensure coherence
6. **Define themes** - clear definitions
7. **Report** - with example quotes

## Expected Themes (will emerge from data)

- "Aha moments" when understanding clicks
- Frustrations with UI/UX
- Comparison strategies
- Social learning benefits
- Visualization effectiveness

## Coding Example

Quote: "I didn't get why SCAN goes to the top even when no one calls. But after seeing the animation 3 times, it clicked - it's about fairness!"

Codes:
- Initial confusion
- Repetition helps
- Visual learning
- Understands fairness concept
```

### Mixed Methods Integration

```markdown
# Triangulation Matrix

| Finding | Quantitative Evidence | Qualitative Evidence | Observation Evidence |
|---------|----------------------|---------------------|---------------------|
| SCAN easiest to learn | 87% rated understanding > 4 | "SCAN is simple, just go up and down" | Spend less time on SCAN tab |
| SSTF confuses students | Lowest understanding scores | "I don't get why it starves" | Rapid switching, re-reads instructions |
| Visualization helps | Quiz scores +23% vs control | "Seeing it move made sense" | High engagement with animation |
```

---

## 🎓 Requirements Summary

### Must Have (MVP)

**Data Gathering**:
- [ ] Pre-use questionnaire (demographics + prior knowledge)
- [ ] Post-use questionnaire (SUS + learning outcomes)
- [ ] Basic usage analytics (clicks, time, feature usage)
- [ ] Interview protocol (5-10 students)

**Social Features**:
- [ ] Share configuration (copy link)
- [ ] Basic leaderboard (optional participation)

### Should Have (Phase 2)

**Data Gathering**:
- [ ] Automated behavior tracking (confusion detection)
- [ ] In-app micro-surveys
- [ ] Session recording for detailed analysis

**Social Features**:
- [ ] In-app chat/discussion
- [ ] Team mode (2-4 users)
- [ ] Annotation system
- [ ] Achievements/badges

### Could Have (Future)

**Data Gathering**:
- [ ] Eye-tracking integration
- [ ] Physiological measures (if available)
- [ ] Longitudinal tracking (over semester)

**Social Features**:
- [ ] Video chat integration
- [ ] AI teaching assistant
- [ ] Advanced analytics dashboard for instructors

---

## 🔒 Ethical Considerations

### Data Privacy (GDPR/Student Privacy)

```javascript
{
  consent: {
    required: true,
    timing: "Before any data collection",
    granular: {
      usage_analytics: "mandatory for app function",
      research_participation: "optional",
      data_sharing: "opt-in only"
    }
  },

  anonymization: {
    user_ids: "Hashed, not linked to real names",
    exportedData: "Aggregated only, no individual identification",
    retention: "Deleted after 2 years or upon request"
  },

  transparency: {
    dataUsage: "Clear explanation of what's collected and why",
    access: "Students can download their own data",
    deletion: "Students can request deletion anytime"
  }
}
```

### Inclusive Design

```javascript
{
  accessibility: {
    WCAG_compliance: "AA minimum",
    screen_reader: "Full support",
    keyboard_navigation: "All features accessible",
    color_blind: "Don't rely solely on color coding"
  },

  diverse_users: {
    languages: "Support multiple languages (EN, VI initially)",
    cultural_sensitivity: "Avoid Western-centric examples",
    varying_abilities: "Support different learning paces"
  }
}
```

---

## 📅 Research Timeline

```gantt
Week 1-2: Stakeholder interviews (students + instructors)
Week 3: Design questionnaires
Week 4-5: Implement data collection infrastructure
Week 6: Implement basic social features
Week 7: Pilot test (5 students)
Week 8: Refine based on pilot
Week 9-12: Full deployment + data collection (30+ students)
Week 13: Data analysis (quantitative)
Week 14: Data analysis (qualitative)
Week 15: Triangulation + report writing
Week 16: Present findings
```

---

## 📚 References

Based on:
- Sharp, H., Preece, J., & Rogers, Y. (2019). *Interaction Design: Beyond Human-Computer Interaction* (5th ed.). Wiley. Chapter 4 & 7.
- Braun, V., & Clarke, V. (2006). Using thematic analysis in psychology. *Qualitative Research in Psychology*, 3(2), 77-101.
- Brooke, J. (1996). SUS: A "quick and dirty" usability scale. *Usability Evaluation in Industry*.

---

*Document version: 1.0*
*Last updated: 2025-11-08*
