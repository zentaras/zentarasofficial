// lib/internshipSteps.js
// Shared step config – import this in API routes AND components

export const INTERNSHIP_STEPS = [
  {
    number: 1,
    title: "Internship Introduction & Project Briefing",
    description: "Tell us about your understanding of the project assigned, your goals, and your initial plan.",
    fields: [
      {
        key: "projectUnderstanding",
        label: "Project Understanding",
        type: "textarea",
        placeholder: "Describe the project in your own words — what problem it solves and what you'll be building...",
        required: true,
        maxLength: 1000,
      },
      {
        key: "personalGoals",
        label: "Your Learning Goals",
        type: "textarea",
        placeholder: "What specific skills or knowledge do you want to gain from this internship?",
        required: true,
        maxLength: 600,
      },
      {
        key: "weeklyPlan",
        label: "Initial Weekly Plan",
        type: "textarea",
        placeholder: "Outline your rough week-by-week plan for the duration of the internship...",
        required: true,
        maxLength: 800,
      },
      {
        key: "toolsSetup",
        label: "Tools & Environment Setup",
        type: "textarea",
        placeholder: "List the tools, libraries, and environment you have set up or plan to set up...",
        required: true,
        maxLength: 500,
      },
    ],
  },
  {
    number: 2,
    title: "Week 1–2 Progress Update",
    description: "Submit your progress after the first two weeks. Share what you've accomplished, any blockers, and your next steps.",
    fields: [
      {
        key: "accomplishments",
        label: "What Did You Accomplish?",
        type: "textarea",
        placeholder: "List the tasks completed, code written, or concepts learned in week 1–2...",
        required: true,
        maxLength: 1000,
      },
      {
        key: "blockers",
        label: "Blockers / Challenges",
        type: "textarea",
        placeholder: "Any issues or blockers you ran into? How did you resolve (or plan to resolve) them?",
        required: false,
        maxLength: 600,
      },
      {
        key: "repoLink",
        label: "GitHub Repository / Code Link",
        type: "url",
        placeholder: "https://github.com/yourname/project",
        required: true,
      },
      {
        key: "nextSteps",
        label: "Next Steps (Week 3–4 Plan)",
        type: "textarea",
        placeholder: "What do you plan to work on in the next two weeks?",
        required: true,
        maxLength: 600,
      },
    ],
  },
  {
    number: 3,
    title: "Mid-Point Project Status",
    description: "You're halfway through! Submit your project stats, a demo link, and an updated timeline.",
    fields: [
      {
        key: "projectStats",
        label: "Project Stats / Metrics",
        type: "textarea",
        placeholder: "e.g. Model accuracy: 87%, Lines of code: 1200, APIs built: 3, Test coverage: 65%...",
        required: true,
        maxLength: 800,
      },
      {
        key: "demoLink",
        label: "Live Demo / Deployment Link",
        type: "url",
        placeholder: "https://your-demo.vercel.app or Loom video link",
        required: false,
      },
      {
        key: "repoLink",
        label: "Updated Repository Link",
        type: "url",
        placeholder: "https://github.com/yourname/project",
        required: true,
      },
      {
        key: "changesFromPlan",
        label: "Changes From Original Plan",
        type: "textarea",
        placeholder: "What changed from your initial plan? Any scope changes, pivots, or improvements?",
        required: true,
        maxLength: 600,
      },
      {
        key: "remainingTasks",
        label: "Remaining Tasks",
        type: "textarea",
        placeholder: "List what is still left to complete before submission...",
        required: true,
        maxLength: 600,
      },
    ],
  },
  {
    number: 4,
    title: "Final Submission",
    description: "Submit your final project — include the repo, report document, and a demo.",
    fields: [
      {
        key: "finalRepoLink",
        label: "Final GitHub Repository",
        type: "url",
        placeholder: "https://github.com/yourname/final-project",
        required: true,
      },
      {
        key: "reportLink",
        label: "Final Report (Google Drive / PDF link)",
        type: "url",
        placeholder: "https://drive.google.com/... or direct PDF URL",
        required: true,
      },
      {
        key: "demoLink",
        label: "Live Demo / Video Walkthrough",
        type: "url",
        placeholder: "https://your-app.vercel.app or Loom/YouTube link",
        required: false,
      },
      {
        key: "projectSummary",
        label: "Project Summary",
        type: "textarea",
        placeholder: "Write a concise summary of what you built, the tech stack used, and the key outcomes...",
        required: true,
        maxLength: 1200,
      },
      {
        key: "lessonsLearned",
        label: "Lessons Learned",
        type: "textarea",
        placeholder: "What were your biggest takeaways from this internship?",
        required: true,
        maxLength: 800,
      },
      {
        key: "feedbackForUs",
        label: "Feedback for the Program",
        type: "textarea",
        placeholder: "Any suggestions to improve the internship experience?",
        required: false,
        maxLength: 600,
      },
    ],
  },
  {
    number: 5,
    title: "Certificate & Completion",
    description: "Admin evaluation & certificate issuance. Your performance feedback and certificate link will appear here once admin completes the review.",
    // Step 5 is fully admin-controlled:
    // Admin fills: performanceRating, overallFeedback, certificateLink, lorLink, projectRepoLink
    // Candidate sees it all read-only once admin publishes it.
    // Candidate fills: linkedinPostLink, testimonial (optional, after certificate is issued)
    isAdminControlled: true,
    isStep5: true, // special flag to render differently
    fields: [
      // These are filled by the CANDIDATE after they receive the certificate
      { key: "linkedinPostLink", label: "LinkedIn Post Link (optional)", type: "url", placeholder: "Share your internship completion post on LinkedIn", required: false },
      { key: "testimonial", label: "Your Testimonial (optional)", type: "textarea", placeholder: "Write a short testimonial about your experience (may be featured on our website)...", required: false, maxLength: 500 },
    ],
  },
];
 
export const STEP_STATUS_COLORS = {
  pending:   { bg: "var(--bg)",        color: "var(--text-muted)",    border: "var(--border)" },
  submitted: { bg: "var(--blue-dim)",  color: "var(--blue)",          border: "rgba(99,102,241,0.3)" },
  approved:  { bg: "var(--green-dim)", color: "var(--green)",         border: "rgba(34,160,107,0.3)" },
  rejected:  { bg: "var(--red-dim)",   color: "var(--red)",           border: "rgba(227,73,53,0.3)" },
};