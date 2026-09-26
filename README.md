# PlacementPilot AI 🚀

PlacementPilot AI is a production-ready, full-stack placement preparation platform designed for college students preparing for technical placements, product company internships, and campus recruitment drives.

---

## 🌟 Core Features

1. **Student Registration & Calibration Hub**
   - Calibrates roadmaps, assessments, and recommendations across **Software/IT**, **AI/ML**, **Data Science**, and **CS & Systems**.
   - Includes one-click student presets (Aarav Sharma, Priya Patel, Rahul Verma) for rapid evaluation.

2. **AI Skill Assessment & Gap Analysis Engine**
   - Multi-section diagnostic covering Quantitative Aptitude, Coding & DSA, Communication, and Domain Engineering.
   - Calculates overall placement readiness percentage and role-specific readiness.
   - Uses **Google Gemini AI** to produce instant gap analyses identifying weak areas and prioritized action recommendations.

3. **Placement Readiness Dashboard (Central Hub)**
   - Live readiness score gauge compared against target company tiers.
   - **Today's Top 3 Priorities** directly linked to focus exercises.
   - Active learning streak indicator and weekly consistency chart.
   - Priority skill gaps radar with one-click navigation.

4. **Personalized Learning Roadmap**
   - 4-phase structured preparation curriculum broken into discrete milestones with estimated hours and curated prep resources.
   - **Regenerate with AI** feature to adapt the roadmap dynamically as your diagnostic gaps evolve.

5. **Daily Study Planner & Focus Sprint**
   - Cognitive overload prevention: Surfacing only **Today's Top 3** priority tasks.
   - Built-in **25-minute Pomodoro focus timer** and 5-minute break mode.
   - Task completion dynamically updates student streak days and experience points (XP).

6. **Coding Practice (DSA)**
   - 5+ high-frequency problems (Two Sum, Longest Substring Without Repeating, Container With Most Water, Climbing Stairs, Validate BST).
   - Multi-language support (JavaScript, Python, C++, Java).
   - In-browser code runner testing against real test cases with runtime execution benchmarks.
   - Detailed optimal approaches, Time & Space complexities, and reference solutions.

7. **Placement Concept & Aptitude Quizzes**
   - 3 interactive quiz modules: Core CS & DSA, Role-Specific Concepts (AI/ML & Systems), and Quantitative Aptitude.
   - Instant conceptual feedback and explanations for every question.

8. **Interactive Learning Mini-Games**
   - **Algorithmic Pattern Blitz**: 20-second timer to identify optimal algorithmic techniques with combo multiplier streaks.
   - **Logic & Code Detective**: Spot real programming bugs, scoping traps, and off-by-one errors.
   - **Tech Terminology Matcher**: 12-tile memory & concept matching game.

9. **AI Mock Interviews**
   - 4 tracks: **Technical**, **HR**, **Behavioral**, and **Role-Specific**.
   - Powered by **Google Gemini** with real-time feedback: Strengths, Areas to Improve, Score (1-10), and model **STAR** answers.
   - Dynamic follow-up questioning based on previous answers.

10. **ATS Resume Analyzer**
    - Instant ATS readiness score (0-100).
    - Matched vs. Missing high-demand keywords audit.
    - Line-by-line bullet point rewrites following Google's **XYZ Formula** (*"Accomplished [X] as measured by [Y], by doing [Z]"*).

11. **Project Story & Pitch Analyzer**
    - Evaluates architectural depth, potential interviewer vulnerability probes, and likely technical questions.
    - Generates 3 interview pitch variants: **30-Second Elevator Pitch**, **1-Minute Recruiter Overview**, and **3-Minute Technical Deep Dive**.

12. **Curated Job & Internship Recommendations**
    - Skill-to-opportunity mapping explaining exactly why roles fit your profile.
    - One-click **Apply & Track** that automatically routes positions into the Application Tracker.

13. **Application Tracker**
    - Kanban Board & List views across 6 stages: *Applied, Screening, Technical Round, HR Round, Offered, Rejected*.
    - Interview dates, salary/stipend notes, and follow-up reminders.

14. **Coach Nova — AI Personal Coach**
    - Floating companion widget providing proactive motivation, streak celebrations, and contextual placement Q&A with Gemini.

---

## 🛠️ Tech Stack & Architecture

- **Frontend**: React 19, TypeScript, Tailwind CSS, Lucide Icons, Motion.
- **Backend**: Node.js, Express, tsx.
- **AI Engine**: Google Gemini API (`@google/genai` SDK using `gemini-3.8-flash`).
- **Data Persistence**: Persistent JSON database engine in `./data/database.json` with MongoDB connection compatibility via `MONGODB_URI`. User progress, scores, interview transcripts, and streaks survive restarts and refreshes.

---

## 🚀 Setup & Local Execution

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Ensure `GEMINI_API_KEY` is provided:
```env
GEMINI_API_KEY="your_api_key_here"
PORT=3000
```

### 3. Start the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.
