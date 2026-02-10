// Simple Gemini integration helpers.
// This module attempts to call Google Generative API if GEMINI_API_KEY is provided.
// If no key is configured it returns mocked responses so the app is still usable locally.

const fetch = require('node-fetch');
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'models/text-bison-001';

async function generateText(prompt, opts = {}) {
  if (!GEMINI_API_KEY) {
    // Mock response when no API key provided - return empty text for fallback
    return { text: '' };
  }

  // Official REST endpoint (v1beta2). This may need adjustment depending on your Google Generative API setup.
  const url = `https://generativelanguage.googleapis.com/v1beta2/${GEMINI_MODEL}:generateText`;
  const body = {
    prompt: { text: prompt },
    temperature: opts.temperature || 0.2,
    maxOutputTokens: opts.maxTokens || 256
  };

  const resp = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${GEMINI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });

  const data = await resp.json();
  // The returned shape may vary; try to extract text safely
  const text = (data?.candidates && data.candidates[0]?.content) || data?.output?.[0]?.content || data?.text || JSON.stringify(data);
  return { text };
}

async function analyzeMatch(freelancer, project) {
  // Use user's strict JSON-only matching prompt (returns matchScore 0-100)
  const job = `Title: ${project.title}\nDescription: ${project.description || ''}\nSkills: ${Array.isArray(project.skills) ? project.skills.join(', ') : project.skills}\nBudget: ${project.budget}\nDeadline: ${project.deadline}`;
  const prof = `Skills: ${Array.isArray(freelancer.skills) ? freelancer.skills.join(', ') : freelancer.skills}\nExperience: ${freelancer.experience}`;

  const prompt = `\nYou are an AI matching engine for a freelancing platform.\n\nReturn ONLY valid JSON.\n\nJob Description:\n${job}\n\nFreelancer Profile:\n${prof}\n\nOutput format:\n{\n  "matchScore": number (0-100),\n  "reason": "one short sentence"\n}\n`;

  const out = await generateText(prompt, { temperature: 0.0, maxTokens: 140 });
  try {
    // Try to extract JSON object from the start of the response
    const text = out.text.trim();
    const jsonText = text.replace(/^[^\{\[]+/, '');
    const json = JSON.parse(jsonText);
    const score = Number(json.matchScore);
    return { score: Number.isFinite(score) ? score : 0, reason: json.reason || '' };
  } catch (e) {
    // Fallback heuristic: count skill overlaps and convert to 0-100
    const fSkills = (freelancer.skills || []).map(s => String(s).toLowerCase());
    const pSkills = (project.skills || []).map(s => String(s).toLowerCase());
    const matches = pSkills.filter(s => fSkills.includes(s)).length;
    const base = Math.min(1, matches / Math.max(1, pSkills.length));
    const score = Math.round(base * 100);
    return { score, reason: 'Fallback heuristic: skill overlap' };
  }
}

async function generateProposal(freelancer, project) {
  const job = `Title: ${project.title}\nDescription: ${project.description || ''}\nSkills: ${Array.isArray(project.skills) ? project.skills.join(', ') : project.skills}\nBudget: ${project.budget}\nDeadline: ${project.deadline}`;
  const prof = `Skills: ${Array.isArray(freelancer.skills) ? freelancer.skills.join(', ') : freelancer.skills}\nExperience: ${freelancer.experience}`;

  const prompt = `\nGenerate a professional freelance proposal.\n\nReturn ONLY JSON:\n\n{\n  "proposal": "text"\n}\n\nJob: ${job}\nFreelancer: ${prof}\n`;

  const out = await generateText(prompt, { temperature: 0.2, maxTokens: 300 });
  try {
    const text = out.text.trim().replace(/^[^\{\[]+/, '');
    const json = JSON.parse(text);
    return { text: json.proposal || '' };
  } catch (e) {
    // Fallback: return raw text
    return { text: out.text };
  }
}

async function scamCheck(project) {
  const prompt = `Evaluate the following project posting for scam risk. Provide a JSON like {"risk": 0.35, "reason": "suspicious because..."}.
Project title: ${project.title}
Project details: ${project.description || ''}
Budget: ${project.budget}
Required skills: ${Array.isArray(project.skills) ? project.skills.join(', ') : project.skills}
Deadline: ${project.deadline}`;

  const out = await generateText(prompt, { temperature: 0.0, maxTokens: 160 });
  try {
    const json = JSON.parse(out.text.replace(/^[^\{]*/, ''));
    return { risk: Number(json.risk) || 0, reason: json.reason || 'Demo mode: No scam detected' };
  } catch (e) {
    // Fallback: return clean JSON only
    const lowBudget = typeof project.budget === 'string' && project.budget.match(/\d+/) && Number(project.budget.replace(/[^0-9]/g, '')) < 100;
    return { risk: lowBudget ? 0.6 : 0.05, reason: 'Demo mode: No scam detected' };
  }
}

module.exports = { generateText, analyzeMatch, generateProposal, scamCheck };
