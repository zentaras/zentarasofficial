


// export const INTERNSHIP_STEPS = [
//   {
//     number: 1,
//     title: "Project Briefing & Setup",
//     description: "Admin assigns your dataset, problem statement, tools, and approach. No action required from you — this step completes automatically.",
//     isAdminControlled: true,
//     isStep1: true,
//     maxPoints: 100,
//     fields: [], // intern submits nothing
//   },
//   {
//     number: 2,
//     title: "Week 1–2: EDA & Data Cleaning",
//     description: "Submit your exploratory data analysis and data cleaning findings after the first two weeks.",
//     maxPoints: 100,
//     fields: [
//       {
//         key: "datasetOverview",
//         label: "Dataset Overview",
//         type: "textarea",
//         placeholder: "Describe the dataset — number of rows, columns, key features, and data types...",
//         required: true,
//         maxLength: 800,
//       },
//       {
//         key: "missingValueHandling",
//         label: "Missing Value Handling Approach",
//         type: "textarea",
//         placeholder: "How did you handle null/missing values? Which columns had them and what strategy did you use?",
//         required: true,
//         maxLength: 600,
//       },
//       {
//         key: "outliersFound",
//         label: "Outliers Found",
//         type: "textarea",
//         placeholder: "Describe any outliers detected and how you handled them (removed, capped, kept with reason)...",
//         required: true,
//         maxLength: 600,
//       },
//       {
//         key: "keyObservations",
//         label: "Key Observations from EDA",
//         type: "textarea",
//         placeholder: "What patterns, trends, or anomalies did you notice during exploration?",
//         required: true,
//         maxLength: 800,
//       },
//       {
//         key: "notebookLink",
//         label: "Notebook / Repo Link",
//         type: "url",
//         placeholder: "https://github.com/yourname/project or Kaggle notebook link",
//         required: true,
//       },
//       {
//         key: "blockers",
//         label: "Blockers / Challenges",
//         type: "textarea",
//         placeholder: "Any issues you faced? How are you planning to resolve them?",
//         required: false,
//         maxLength: 500,
//       },
//     ],
//   },
//   {
//     number: 3,
//     title: "Mid-Point: Analysis & Insights",
//     description: "Share your analysis techniques, key insights, and visualizations at the halfway mark.",
//     maxPoints: 100,
//     fields: [
//       {
//         key: "techniqueUsed",
//         label: "Analysis Techniques Used",
//         type: "textarea",
//         placeholder: "e.g. Linear regression, K-means clustering, pivot aggregations, time-series decomposition...",
//         required: true,
//         maxLength: 600,
//       },
//       {
//         key: "keyInsights",
//         label: "Key Insights Found (2–3)",
//         type: "textarea",
//         placeholder: "List 2–3 meaningful insights derived from your analysis so far...",
//         required: true,
//         maxLength: 800,
//       },
//       {
//         key: "dashboardLink",
//         label: "Visualization / Dashboard Link",
//         type: "url",
//         placeholder: "Google Colab, Power BI link, Tableau Public, or any shareable doc link",
//         required: false,
//       },
//       {
//         key: "repoLink",
//         label: "Updated Repo Link",
//         type: "url",
//         placeholder: "https://github.com/yourname/project",
//         required: true,
//       },
//       {
//         key: "problemsFaced",
//         label: "Problems Faced",
//         type: "textarea",
//         placeholder: "Any analytical challenges, data quality issues, or unexpected findings?",
//         required: false,
//         maxLength: 500,
//       },
//     ],
//   },
//   {
//     number: 4,
//     title: "Final Submission",
//     description: "Submit your final dashboard, report, GitHub repo, and key findings.",
//     maxPoints: 100,
//     fields: [
//       {
//         key: "finalDashboardLink",
//         label: "Final Dashboard / Report Link",
//         type: "url",
//         placeholder: "Power BI, Tableau Public, Looker Studio, or PDF link",
//         required: true,
//       },
//       {
//         key: "finalRepoLink",
//         label: "Final GitHub Repository",
//         type: "url",
//         placeholder: "https://github.com/yourname/final-project",
//         required: true,
//       },
//       {
//         key: "keyFindings",
//         label: "Key Findings Summary (3–5 bullets)",
//         type: "textarea",
//         placeholder: "• Finding 1\n• Finding 2\n• Finding 3\n...",
//         required: true,
//         maxLength: 1000,
//       },
//       {
//         key: "businessRecommendations",
//         label: "Business Recommendations",
//         type: "textarea",
//         placeholder: "What actions would you recommend to the business based on your analysis?",
//         required: true,
//         maxLength: 800,
//       },
//       {
//         key: "lessonsLearned",
//         label: "Lessons Learned",
//         type: "textarea",
//         placeholder: "What were your biggest technical and analytical takeaways?",
//         required: true,
//         maxLength: 600,
//       },
//       {
//         key: "analysisLimitations",
//         label: "Limitations of the Analysis",
//         type: "textarea",
//         placeholder: "Data gaps, assumptions made, scope constraints, or areas for improvement...",
//         required: false,
//         maxLength: 500,
//       },
//     ],
//   },
//   {
//     number: 5,
//     title: "Certificate & Completion",
//     description: "Admin evaluation and certificate issuance. Your feedback and certificate will appear here once admin publishes the review.",
//     isAdminControlled: true,
//     isStep5: true,
//     maxPoints: null, // no points for step 5
//     fields: [], // intern submits nothing
//   },
// ];

// export const STEP_STATUS_COLORS = {
//   pending:   { bg: "var(--bg)",        color: "var(--text-muted)",    border: "var(--border)" },
//   submitted: { bg: "var(--blue-dim)",  color: "var(--blue)",          border: "rgba(99,102,241,0.3)" },
//   approved:  { bg: "var(--green-dim)", color: "var(--green)",         border: "rgba(34,160,107,0.3)" },
//   rejected:  { bg: "var(--red-dim)",   color: "var(--red)",           border: "rgba(227,73,53,0.3)" },
// };



// lib/internshipSteps.js

// ─── DATA ANALYST STEPS ───────────────────────────────────────────────────────
export const DATA_ANALYST_STEPS = [
  {
    number: 1,
    title: "Project Briefing & Setup",
    description:
      "Admin assigns your dataset, problem statement, tools, and approach. No action required from you — this step completes automatically.",
    isAdminControlled: true,
    isStep1: true,
    maxPoints: 100,
    fields: [],
  },
  {
    number: 2,
    title: "Week 1–2: EDA & Data Cleaning",
    description:
      "Submit your exploratory data analysis and data cleaning findings after the first two weeks.",
    maxPoints: 100,
    fields: [
      {
        key: "datasetOverview",
        label: "Dataset Overview",
        type: "textarea",
        placeholder:
          "Describe the dataset — number of rows, columns, key features, and data types...",
        required: true,
        maxLength: 800,
      },
      {
        key: "missingValueHandling",
        label: "Missing Value Handling Approach",
        type: "textarea",
        placeholder:
          "How did you handle null/missing values? Which columns had them and what strategy did you use?",
        required: true,
        maxLength: 600,
      },
      {
        key: "outliersFound",
        label: "Outliers Found",
        type: "textarea",
        placeholder:
          "Describe any outliers detected and how you handled them (removed, capped, kept with reason)...",
        required: true,
        maxLength: 600,
      },
      {
        key: "keyObservations",
        label: "Key Observations from EDA",
        type: "textarea",
        placeholder:
          "What patterns, trends, or anomalies did you notice during exploration?",
        required: true,
        maxLength: 800,
      },
      {
        key: "notebookLink",
        label: "Notebook / Repo Link",
        type: "url",
        placeholder:
          "https://github.com/yourname/project or Kaggle notebook link",
        required: true,
      },
      {
        key: "blockers",
        label: "Blockers / Challenges",
        type: "textarea",
        placeholder:
          "Any issues you faced? How are you planning to resolve them?",
        required: false,
        maxLength: 500,
      },
    ],
  },
  {
    number: 3,
    title: "Mid-Point: Analysis & Insights",
    description:
      "Share your analysis techniques, key insights, and visualizations at the halfway mark.",
    maxPoints: 100,
    fields: [
      {
        key: "techniqueUsed",
        label: "Analysis Techniques Used",
        type: "textarea",
        placeholder:
          "e.g. Linear regression, K-means clustering, pivot aggregations, time-series decomposition...",
        required: true,
        maxLength: 600,
      },
      {
        key: "keyInsights",
        label: "Key Insights Found (2–3)",
        type: "textarea",
        placeholder:
          "List 2–3 meaningful insights derived from your analysis so far...",
        required: true,
        maxLength: 800,
      },
      {
        key: "dashboardLink",
        label: "Visualization / Dashboard Link",
        type: "url",
        placeholder:
          "Google Colab, Power BI link, Tableau Public, or any shareable doc link",
        required: false,
      },
      {
        key: "repoLink",
        label: "Updated Repo Link",
        type: "url",
        placeholder: "https://github.com/yourname/project",
        required: true,
      },
      {
        key: "problemsFaced",
        label: "Problems Faced",
        type: "textarea",
        placeholder:
          "Any analytical challenges, data quality issues, or unexpected findings?",
        required: false,
        maxLength: 500,
      },
    ],
  },
  {
    number: 4,
    title: "Final Submission",
    description:
      "Submit your final dashboard, report, GitHub repo, and key findings.",
    maxPoints: 100,
    fields: [
      {
        key: "finalDashboardLink",
        label: "Final Dashboard / Report Link",
        type: "url",
        placeholder:
          "Power BI, Tableau Public, Looker Studio, or PDF link",
        required: true,
      },
      {
        key: "finalRepoLink",
        label: "Final GitHub Repository",
        type: "url",
        placeholder: "https://github.com/yourname/final-project",
        required: true,
      },
      {
        key: "keyFindings",
        label: "Key Findings Summary (3–5 bullets)",
        type: "textarea",
        placeholder: "• Finding 1\n• Finding 2\n• Finding 3\n...",
        required: true,
        maxLength: 1000,
      },
      {
        key: "businessRecommendations",
        label: "Business Recommendations",
        type: "textarea",
        placeholder:
          "What actions would you recommend to the business based on your analysis?",
        required: true,
        maxLength: 800,
      },
      {
        key: "lessonsLearned",
        label: "Lessons Learned",
        type: "textarea",
        placeholder:
          "What were your biggest technical and analytical takeaways?",
        required: true,
        maxLength: 600,
      },
      {
        key: "analysisLimitations",
        label: "Limitations of the Analysis",
        type: "textarea",
        placeholder:
          "Data gaps, assumptions made, scope constraints, or areas for improvement...",
        required: false,
        maxLength: 500,
      },
    ],
  },
  {
    number: 5,
    title: "Certificate & Completion",
    description:
      "Admin evaluation and certificate issuance. Your feedback and certificate will appear here once admin publishes the review.",
    isAdminControlled: true,
    isStep5: true,
    maxPoints: null,
    fields: [],
  },
];

// ─── WEB DEVELOPER STEPS ──────────────────────────────────────────────────────
export const WEB_DEV_STEPS = [
  {
    number: 1,
    title: "Project Briefing & Setup",
    description:
      "Admin assigns your project brief, tech stack, and requirements. No action required from you — this step completes automatically.",
    isAdminControlled: true,
    isStep1: true,
    maxPoints: 100,
    fields: [],
  },
  {
    number: 2,
    title: "Week 1–2: Design & Foundation",
    description:
      "Share your project setup, UI/UX wireframes or design decisions, and initial codebase structure.",
    maxPoints: 100,
    fields: [
      {
        key: "projectSetup",
        label: "Project Setup & Tech Stack",
        type: "textarea",
        placeholder:
          "Describe how you set up the project — framework, folder structure, packages installed, and why you chose this stack...",
        required: true,
        maxLength: 800,
      },
      {
        key: "designApproach",
        label: "UI/UX Design Approach",
        type: "textarea",
        placeholder:
          "How did you approach the design? Wireframes, component hierarchy, color palette, responsiveness plan...",
        required: true,
        maxLength: 600,
      },
      {
        key: "featuresBuilt",
        label: "Features Built So Far",
        type: "textarea",
        placeholder:
          "List the features/pages you've implemented in weeks 1–2 and what's still pending...",
        required: true,
        maxLength: 600,
      },
      {
        key: "repoLink",
        label: "GitHub Repository Link",
        type: "url",
        placeholder: "https://github.com/yourname/project",
        required: true,
      },
      {
        key: "liveDemoLink",
        label: "Live Preview / Deploy Link (if any)",
        type: "url",
        placeholder:
          "https://yourproject.vercel.app or localhost screenshot link",
        required: false,
      },
      {
        key: "blockers",
        label: "Blockers / Challenges",
        type: "textarea",
        placeholder:
          "Any setup issues, design decisions you're stuck on, or technical blockers?",
        required: false,
        maxLength: 500,
      },
    ],
  },
  {
    number: 3,
    title: "Mid-Point: Core Features & Progress",
    description:
      "Demonstrate your core feature implementations and share progress at the halfway mark.",
    maxPoints: 100,
    fields: [
      {
        key: "coreFeaturesCompleted",
        label: "Core Features Completed",
        type: "textarea",
        placeholder:
          "List the core features fully implemented — authentication, CRUD, API integrations, etc...",
        required: true,
        maxLength: 700,
      },
      {
        key: "codeQualityNotes",
        label: "Code Quality & Architecture",
        type: "textarea",
        placeholder:
          "Describe your component structure, state management approach, reusable components, and any patterns used...",
        required: true,
        maxLength: 700,
      },
      {
        key: "liveLink",
        label: "Live / Staging Link",
        type: "url",
        placeholder: "https://yourproject.vercel.app",
        required: false,
      },
      {
        key: "repoLink",
        label: "Updated GitHub Repository",
        type: "url",
        placeholder: "https://github.com/yourname/project",
        required: true,
      },
      {
        key: "problemsFaced",
        label: "Problems Faced",
        type: "textarea",
        placeholder:
          "Technical challenges, performance issues, integration problems, or scope changes?",
        required: false,
        maxLength: 500,
      },
    ],
  },
  {
    number: 4,
    title: "Final Submission",
    description:
      "Submit your completed project with the live URL, final repo, documentation, and key learnings.",
    maxPoints: 100,
    fields: [
      {
        key: "finalLiveLink",
        label: "Final Live URL",
        type: "url",
        placeholder:
          "https://yourproject.vercel.app / netlify / railway / etc.",
        required: true,
      },
      {
        key: "finalRepoLink",
        label: "Final GitHub Repository",
        type: "url",
        placeholder: "https://github.com/yourname/final-project",
        required: true,
      },
      {
        key: "featuresOverview",
        label: "Complete Features Overview",
        type: "textarea",
        placeholder:
          "• Feature 1: ...\n• Feature 2: ...\n• Feature 3: ...\nList all implemented features...",
        required: true,
        maxLength: 1000,
      },
      {
        key: "technicalDecisions",
        label: "Key Technical Decisions",
        type: "textarea",
        placeholder:
          "What major technical decisions did you make and why? (library choices, architecture, performance optimizations)",
        required: true,
        maxLength: 800,
      },
      {
        key: "lessonsLearned",
        label: "Lessons Learned",
        type: "textarea",
        placeholder:
          "What were your biggest technical and professional takeaways from this project?",
        required: true,
        maxLength: 600,
      },
      {
        key: "knownIssues",
        label: "Known Issues / Future Improvements",
        type: "textarea",
        placeholder:
          "Any known bugs, unfinished features, or improvements you'd make with more time?",
        required: false,
        maxLength: 500,
      },
    ],
  },
  {
    number: 5,
    title: "Certificate & Completion",
    description:
      "Admin evaluation and certificate issuance. Your feedback and certificate will appear here once admin publishes the review.",
    isAdminControlled: true,
    isStep5: true,
    maxPoints: null,
    fields: [],
  },
];

// ─── Helper: get steps by project key ────────────────────────────────────────
// Usage: const steps = getStepsByProjectKey(track.projectKey);
export function getStepsByProjectKey(projectKey) {
  if (projectKey === "web-dev-intern") return WEB_DEV_STEPS;
  return DATA_ANALYST_STEPS; // default / "data-analyst-intern"
}

// ─── Legacy export — keeps backward-compat for any place still importing
//     INTERNSHIP_STEPS directly (defaults to data analyst steps).
//     Gradually replace with getStepsByProjectKey() calls.
export const INTERNSHIP_STEPS = DATA_ANALYST_STEPS;

// ─── Step status color map (shared) ──────────────────────────────────────────
export const STEP_STATUS_COLORS = {
  pending:   { bg: "var(--bg)",        color: "var(--text-muted)",  border: "var(--border)" },
  submitted: { bg: "var(--blue-dim)",  color: "var(--blue)",        border: "rgba(99,102,241,0.3)" },
  approved:  { bg: "var(--green-dim)", color: "var(--green)",       border: "rgba(34,160,107,0.3)" },
  rejected:  { bg: "var(--red-dim)",   color: "var(--red)",         border: "rgba(227,73,53,0.3)" },
};