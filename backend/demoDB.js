const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, 'data');
const dbFile = path.join(dataDir, 'demoDB.json');

let state = {
  projects: [],
  applications: [],
  users: []
};

function ensureDataDir() {
  try {
    fs.mkdirSync(dataDir, { recursive: true });
  } catch (e) {
    // ignore
  }
}

function load() {
  try {
    if (fs.existsSync(dbFile)) {
      const raw = fs.readFileSync(dbFile, 'utf8');
      state = JSON.parse(raw);
    }
  } catch (e) {
    console.error('demoDB load error', e);
  }
}

function persist() {
  try {
    ensureDataDir();
    fs.writeFileSync(dbFile, JSON.stringify(state, null, 2), 'utf8');
  } catch (e) {
    console.error('demoDB persist error', e);
  }
}

async function saveProject(project) {
  const existing = state.projects.find((p) => p.id === project.id);
  if (existing) {
    Object.assign(existing, project);
  } else {
    state.projects.push(project);
  }
  persist();
  return project;
}

function getProjects() {
  return state.projects.slice();
}

function getProjectById(id) {
  return state.projects.find((p) => p.id === id) || null;
}

async function saveApplication(application) {
  const existing = state.applications.find((a) => a.id === application.id);
  if (existing) {
    Object.assign(existing, application);
  } else {
    state.applications.push(application);
  }
  persist();
  return application;
}

function getApplications(filter = {}) {
  let list = state.applications.slice();
  if (filter.projectId) list = list.filter((a) => a.projectId === filter.projectId);
  if (filter.userId) list = list.filter((a) => a.userId === filter.userId);
  return list;
}

async function chooseApplicant(projectId, applicationId) {
  const project = getProjectById(projectId);
  if (!project) throw new Error('Project not found');
  const app = state.applications.find((a) => a.id === applicationId);
  if (!app) throw new Error('Application not found');
  project.chosenApplication = applicationId;
  // mark chosen application accepted and reject others for the same project
  state.applications.forEach((a) => {
    if (a.projectId === projectId) {
      if (a.id === applicationId) a.status = 'accepted';
      else a.status = 'rejected';
    }
  });
  persist();
  return { project, application: app };
}

// Initialize
load();

module.exports = {
  saveProject,
  getProjects,
  getProjectById,
  saveApplication,
  getApplications,
  chooseApplicant
};
