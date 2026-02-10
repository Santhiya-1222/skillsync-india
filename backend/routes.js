const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");

const demoDB = require('./demoDB');
const gemini = require("./gemini");

/* --------------------------------------------------
   DEMO PROJECTS (Used when Firestore is not active)
---------------------------------------------------*/
const DEMO_PROJECTS = [
  {
    id: "demo-1",
    title: "Build a responsive landing page",
    description: "Design and develop a responsive landing page using Bootstrap.",
    skills: ["HTML", "CSS", "Bootstrap", "JavaScript"],
    budget: "5000-10000",
    deadline: ""
  },
  {
    id: "demo-2",
    title: "Create Node.js API",
    description: "Develop a small REST API using Node.js and Express.",
    skills: ["Node.js", "Express", "REST"],
    budget: "8000-15000",
    deadline: ""
  },
  {
    id: "demo-3",
    title: "Small React component",
    description: "Build a reusable React component and write tests.",
    skills: ["React", "JavaScript", "Testing"],
    budget: "3000-7000",
    deadline: ""
  }
];

/* --------------------------------------------------
   ✅ GET Projects (Browser friendly)
---------------------------------------------------*/
router.get("/projects", (req, res) => {
  // Prefer persisted demo DB projects when available
  const stored = demoDB.getProjects();
  res.json({
    message: "Projects endpoint working ✅ (demo mode)",
    availableDemoProjects: stored.length ? stored : DEMO_PROJECTS,
    note: "Use POST /api/projects to submit a new project"
  });
});

/* --------------------------------------------------
   ✅ POST New Project (Client Flow)
---------------------------------------------------*/
router.post("/projects", async (req, res) => {
  try {
    const { title, skills, budget, deadline, description } = req.body;

    const project = {
      id: uuidv4(),
      title: title || "Untitled Project",
      skills: skills || [],
      budget: budget || "",
      deadline: deadline || "",
      description: description || "",
      createdAt: new Date().toISOString()
    };

    // AI Scam Check
    const scamResult = await gemini.scamCheck(project).catch(() => ({
      risk: 0,
      reason: "No AI key configured"
    }));

    project.scamRisk = scamResult.risk;
    project.scamReason = scamResult.reason;

    // Persist to demo DB
    await demoDB.saveProject(project);

    res.json({
      message: "Project posted successfully ✅",
      project,
      scam: scamResult
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save project" });
  }
});

/* --------------------------------------------------
   ✅ AI Match Endpoint (Freelancer Flow)
---------------------------------------------------*/
router.post("/match", async (req, res) => {
  try {
    const { skills, experience } = req.body;

    const freelancer = {
      skills: skills || [],
      experience: experience || ""
    };

    // Use demo projects if DB not active
    let projects = DEMO_PROJECTS;

    // AI scoring for each project
    const scored = await Promise.all(
      projects.map(async (project) => {
        const result = await gemini.analyzeMatch(freelancer, project).catch(
          () => ({
            score: Math.round(Math.random() * 50 + 50),
            reason: "No AI key configured"
          })
        );

        return {
          project,
          score: result.score,
          reason: result.reason
        };
      })
    );

    // Sort and return top matches
    scored.sort((a, b) => b.score - a.score);

    res.json({
      message: "Top AI Matches Generated ✅",
      matches: scored.slice(0, 3)
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to compute matches" });
  }
});

/* --------------------------------------------------
   ✅ Proposal Generator Endpoint
---------------------------------------------------*/
router.post("/proposal", async (req, res) => {
  try {
    const { projectId, freelancer } = req.body;

    if (!projectId || !freelancer) {
      return res.status(400).json({
        error: "Missing projectId or freelancer profile"
      });
    }

    // Demo mode only
    const project = DEMO_PROJECTS.find((p) => p.id === projectId);

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    // AI Proposal
    const proposal = await gemini.generateProposal(freelancer, project).catch(
      () => ({
        text: "AI key not configured. Please add GEMINI_API_KEY."
      })
    );

    res.json({
      message: "Proposal Generated Successfully ✅",
      proposal
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate proposal" });
  }
});

/* --------------------------------------------------
   ✅ Scam Check Endpoint
---------------------------------------------------*/
router.post("/scamcheck", async (req, res) => {
  try {
    const project = req.body;

    const result = await gemini.scamCheck(project).catch(() => ({
      risk: 0,
      reason: "No AI key configured"
    }));

    res.json({
      message: "Scam Risk Checked ✅",
      scam: result
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Scam check failed" });
  }
});

/* --------------------------------------------------
   ✅ Apply to Project (Freelancer creates an application)
---------------------------------------------------*/
router.post('/apply', async (req, res) => {
  try {
    const { projectId, freelancer, userId } = req.body;

    if (!projectId || !freelancer) {
      return res.status(400).json({ error: 'projectId and freelancer required' });
    }

    // Find project in persisted demo DB or fallback demo list
    let project = demoDB.getProjectById(projectId);
    if (!project) project = DEMO_PROJECTS.find((p) => p.id === projectId);
    if (!project) return res.status(404).json({ error: 'Project not found' });

    const application = {
      id: uuidv4(),
      projectId,
      userId: userId || 'anon',
      freelancer,
      proposal: null,
      score: null,
      status: 'applied',
      createdAt: new Date().toISOString()
    };

    // Generate proposal (AI) if available
    const proposal = await gemini.generateProposal(freelancer, project).catch(() => ({
      text: 'Demo mode: proposal generation unavailable'
    }));

    application.proposal = proposal;

    // Generate a match score for this application so the client can review
    const matchRes = await gemini.analyzeMatch(freelancer, project).catch(() => ({
      score: Math.round(Math.random() * 40 + 50),
      reason: 'No AI key configured'
    }));
    application.score = matchRes.score || 0;

    await demoDB.saveApplication(application);

    res.json({ message: 'Application saved ✅', application });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save application' });
  }
});

/* --------------------------------------------------
   ✅ List Applications
---------------------------------------------------*/
router.get('/applications', (req, res) => {
  try {
    const { projectId, userId } = req.query;
    const apps = demoDB.getApplications({ projectId, userId });
    res.json({ applications: apps });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to list applications' });
  }
});

/* --------------------------------------------------
   ✅ Client chooses an applicant for a project
---------------------------------------------------*/
router.post('/projects/:id/choose', async (req, res) => {
  try {
    const projectId = req.params.id;
    const { applicationId } = req.body;

    if (!applicationId) return res.status(400).json({ error: 'applicationId required' });

    const result = await demoDB.chooseApplicant(projectId, applicationId).catch((e) => {
      throw e;
    });

    res.json({ message: 'Applicant chosen ✅', result });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message || 'Failed to choose applicant' });
  }
});

/* --------------------------------------------------
   ✅ Chatbot proxy (forward to Gemini or fallback)
---------------------------------------------------*/
router.post('/chatbot', async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: 'message required' });

    const raw = await gemini.generateText(message).catch(() => ({ text: 'Demo bot: Hi — ask me about posting projects or applying as a freelancer.' }));
    const reply = typeof raw === 'string' ? raw : (raw.text || JSON.stringify(raw));
    res.json({ reply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Chatbot failed' });
  }
});

/* --------------------------------------------------
   ✅ Stats Endpoint
---------------------------------------------------*/
router.get('/stats', (req, res) => {
  try {
    // Static number of freelancers for demo; projects count from demo DB
    const freelancers = 1200;
    const projects = (demoDB.getProjects() || []).length || DEMO_PROJECTS.length;
    const satisfaction = 99;

    res.json({ freelancers, projects, satisfaction });
  } catch (err) {
    console.error('Failed to get stats', err);
    res.status(500).json({ error: 'Failed to get stats' });
  }
});

module.exports = router;
