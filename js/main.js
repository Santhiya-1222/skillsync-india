<<<<<<< HEAD
// Frontend JS for forms and API calls
// Update API_BASE if your backend runs on a different host/port
const API_BASE = 'http://localhost:5000';

// Helper: POST JSON
async function postJSON(path, body) {
  const resp = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  return resp.json();
}

// Post project form handler
const projectForm = document.getElementById('projectForm');
if (projectForm) {
  projectForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = document.getElementById('title').value;
    const skills = document.getElementById('skills').value.split(',').map(s => s.trim()).filter(Boolean);
    const budget = document.getElementById('budget').value;
    const deadline = document.getElementById('deadline').value;
    const description = document.getElementById('description').value;

    const res = await postJSON('/api/projects', { title, skills, budget, deadline, description });
    const out = document.getElementById('result');
    if (res.error) {
      out.innerText = 'Error: ' + res.error;
      out.className = 'text-danger';
    } else {
      out.className = 'text-success';
      const pid = res.project?.id || '';
      out.innerHTML = `Project posted (id: ${pid}). Scam risk: ${res.scam?.risk ?? 'N/A'} - ${res.scam?.reason ?? ''}`;
    }
  });
}

// Find work handler
const matchBtn = document.getElementById('matchBtn');
if (matchBtn) {
  matchBtn.addEventListener('click', async () => {
    const skills = document.getElementById('freelancerSkills').value.split(',').map(s => s.trim()).filter(Boolean);
    const experience = document.getElementById('freelancerExperience').value;
    const jobType = document.getElementById('jobType') ? document.getElementById('jobType').value : '';
    const res = await postJSON('/api/match', { skills, experience, jobType });
    // Save matches to localStorage and navigate
    localStorage.setItem('matchResults', JSON.stringify(res.matches || []));
    localStorage.setItem('freelancerProfile', JSON.stringify({ skills, experience, jobType }));
    window.location.href = 'matchresults.html';
  });
}

// Render match results page
const resultsEl = document.getElementById('results');
if (resultsEl) {
  const stored = JSON.parse(localStorage.getItem('matchResults') || 'null');
  const matches = Array.isArray(stored) ? stored : [];
  // Default demo projects if no matches returned
  const demo = [
    { project: { id: 'demo-1', title: 'E-commerce React Native App Developer', description: 'Build a React Native app for an e-commerce store', skills: ['React Native','Redux','Node.js'], budget: '₹80,000 - ₹1,20,000', deadline: '', company: 'ShopifyIndia Tech', posted: '2 hours ago', location: 'Remote (India)' }, score: 95, reason: 'Strong match on React Native and Redux' },
    { project: { id: 'demo-2', title: 'UI/UX Designer for Fintech Dashboard', description: 'Design a modern dashboard for a fintech product', skills: ['UI/UX','Figma','Prototyping'], budget: '₹40,000 - ₹80,000', deadline: '', company: 'PayFast Systems', posted: '1 day ago', location: 'Remote (India)' }, score: 88, reason: 'Relevant UI/UX experience' }
  ];

  const results = matches.length ? matches : demo;
  const tpl = document.getElementById('cardTpl').innerHTML;

  results.forEach(m => {
    const project = m.project || m;
    const score = (typeof m.score === 'number') ? m.score : (m.score || 0);
    const tagsHtml = (project.skills || []).map(s => `<span class="tag">${s}</span>`).join(' ');

    let html = tpl.replace('__TITLE__', project.title || 'No title')
      .replace('__COMPANY__', project.company || '')
      .replace('__DESC__', (project.description || '').slice(0, 220))
      .replace('__TAGS__', tagsHtml)
      .replace('__BUDGET__', project.budget || '-')
      .replace('__POSTED__', project.posted || '')
      .replace('__LOCATION__', project.location || '')
      .replace('__SCORE__', Math.round(score));

    const wrapper = document.createElement('div');
    wrapper.innerHTML = html;
    const applyBtn = wrapper.querySelector('.btn-apply');
    applyBtn.addEventListener('click', async () => {
      applyBtn.disabled = true;
      applyBtn.innerText = 'Applying...';
      // Use stored freelancer profile and call /api/apply
      const freelancer = JSON.parse(localStorage.getItem('freelancerProfile') || '{}');
      const resp = await postJSON('/api/apply', { projectId: project.id, freelancer, userId: freelancer.userId || 'anon' }).catch(() => ({ application: { id: 'local-'+Date.now(), proposal: { text: 'Demo proposal' }, status: 'applied', projectId: project.id } }));
      const application = resp.application || resp;
      // Persist last application locally for the result page
      localStorage.setItem('lastApplication', JSON.stringify(application));

      const proposalText = document.createElement('div');
      proposalText.className = 'mt-3 proposalText';
      const scoreLine = application.score ? `<div><strong>Match Score:</strong> ${application.score}%</div>` : '';
      proposalText.innerHTML = `${scoreLine}<div class="mt-2">${application.proposal?.text || 'No proposal generated.'}</div>`;
      wrapper.querySelector('.card').appendChild(proposalText);

      applyBtn.innerText = '✅ Applied';
      applyBtn.classList.add('btn-success');
      applyBtn.disabled = true;

      // Do NOT auto-redirect — application is stored and visible to the client via Client Dashboard
    });

    resultsEl.appendChild(wrapper.firstElementChild);
  });
}

// Graceful: if fetch fails, show message in console
window.addEventListener('error', (e) => console.error('Client error', e));
=======
// Frontend JS for forms and API calls
// Update API_BASE if your backend runs on a different host/port
const API_BASE = 'http://localhost:5000';

// Helper: POST JSON
async function postJSON(path, body) {
  const resp = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  return resp.json();
}

// Post project form handler
const projectForm = document.getElementById('projectForm');
if (projectForm) {
  projectForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = document.getElementById('title').value;
    const skills = document.getElementById('skills').value.split(',').map(s => s.trim()).filter(Boolean);
    const budget = document.getElementById('budget').value;
    const deadline = document.getElementById('deadline').value;
    const description = document.getElementById('description').value;

    const res = await postJSON('/api/projects', { title, skills, budget, deadline, description });
    const out = document.getElementById('result');
    if (res.error) {
      out.innerText = 'Error: ' + res.error;
      out.className = 'text-danger';
    } else {
      out.className = 'text-success';
      const pid = res.project?.id || '';
      out.innerHTML = `Project posted (id: ${pid}). Scam risk: ${res.scam?.risk ?? 'N/A'} - ${res.scam?.reason ?? ''}`;
    }
  });
}

// Find work handler
const matchBtn = document.getElementById('matchBtn');
if (matchBtn) {
  matchBtn.addEventListener('click', async () => {
    const skills = document.getElementById('freelancerSkills').value.split(',').map(s => s.trim()).filter(Boolean);
    const experience = document.getElementById('freelancerExperience').value;
    const jobType = document.getElementById('jobType') ? document.getElementById('jobType').value : '';
    const res = await postJSON('/api/match', { skills, experience, jobType });
    // Save matches to localStorage and navigate
    localStorage.setItem('matchResults', JSON.stringify(res.matches || []));
    localStorage.setItem('freelancerProfile', JSON.stringify({ skills, experience, jobType }));
    window.location.href = 'matchresults.html';
  });
}

// Render match results page
const resultsEl = document.getElementById('results');
if (resultsEl) {
  const stored = JSON.parse(localStorage.getItem('matchResults') || 'null');
  const matches = Array.isArray(stored) ? stored : [];
  // Default demo projects if no matches returned
  const demo = [
    { project: { id: 'demo-1', title: 'E-commerce React Native App Developer', description: 'Build a React Native app for an e-commerce store', skills: ['React Native','Redux','Node.js'], budget: '₹80,000 - ₹1,20,000', deadline: '', company: 'ShopifyIndia Tech', posted: '2 hours ago', location: 'Remote (India)' }, score: 95, reason: 'Strong match on React Native and Redux' },
    { project: { id: 'demo-2', title: 'UI/UX Designer for Fintech Dashboard', description: 'Design a modern dashboard for a fintech product', skills: ['UI/UX','Figma','Prototyping'], budget: '₹40,000 - ₹80,000', deadline: '', company: 'PayFast Systems', posted: '1 day ago', location: 'Remote (India)' }, score: 88, reason: 'Relevant UI/UX experience' }
  ];

  const results = matches.length ? matches : demo;
  const tpl = document.getElementById('cardTpl').innerHTML;

  results.forEach(m => {
    const project = m.project || m;
    const score = (typeof m.score === 'number') ? m.score : (m.score || 0);
    const tagsHtml = (project.skills || []).map(s => `<span class="tag">${s}</span>`).join(' ');

    let html = tpl.replace('__TITLE__', project.title || 'No title')
      .replace('__COMPANY__', project.company || '')
      .replace('__DESC__', (project.description || '').slice(0, 220))
      .replace('__TAGS__', tagsHtml)
      .replace('__BUDGET__', project.budget || '-')
      .replace('__POSTED__', project.posted || '')
      .replace('__LOCATION__', project.location || '')
      .replace('__SCORE__', Math.round(score));

    const wrapper = document.createElement('div');
    wrapper.innerHTML = html;
    const applyBtn = wrapper.querySelector('.btn-apply');
    applyBtn.addEventListener('click', async () => {
      applyBtn.disabled = true;
      applyBtn.innerText = 'Applying...';
      // Use stored freelancer profile and call /api/apply
      const freelancer = JSON.parse(localStorage.getItem('freelancerProfile') || '{}');
      const resp = await postJSON('/api/apply', { projectId: project.id, freelancer, userId: freelancer.userId || 'anon' }).catch(() => ({ application: { id: 'local-'+Date.now(), proposal: { text: 'Demo proposal' }, status: 'applied', projectId: project.id } }));
      const application = resp.application || resp;
      // Persist last application locally for the result page
      localStorage.setItem('lastApplication', JSON.stringify(application));

      const proposalText = document.createElement('div');
      proposalText.className = 'mt-3 proposalText';
      const scoreLine = application.score ? `<div><strong>Match Score:</strong> ${application.score}%</div>` : '';
      proposalText.innerHTML = `${scoreLine}<div class="mt-2">${application.proposal?.text || 'No proposal generated.'}</div>`;
      wrapper.querySelector('.card').appendChild(proposalText);

      applyBtn.innerText = '✅ Applied';
      applyBtn.classList.add('btn-success');
      applyBtn.disabled = true;

      // Do NOT auto-redirect — application is stored and visible to the client via Client Dashboard
    });

    resultsEl.appendChild(wrapper.firstElementChild);
  });
}

// Graceful: if fetch fails, show message in console
window.addEventListener('error', (e) => console.error('Client error', e));
>>>>>>> 96e5cb886491b9db5c213b48882848bcf97d800d
