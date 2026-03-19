/**
 * Fesiomatyzacja: α-bridge.js
 * Core logic for Automation / Orchestrator & Live Infrastructure Injection
 */

const BITBUCKET_API_BASE = 'https://api.bitbucket.org/2.0';
const FLY_API_BASE = 'https://api.machines.dev/v1';

/**
 * 1. CONTEXT PACKING: Ingest Codebase
 * Recursively scans Bitbucket repository using filtered AST-like approach (extension based)
 */
export const ingestCodebase = async (workspace, repoSlug, accessToken) => {
  console.log(`[α-bridge] Ingesting codebase: ${workspace}/${repoSlug}`);
  
  const fetchTree = async (path = '') => {
    const url = `${BITBUCKET_API_BASE}/repositories/${workspace}/${repoSlug}/src/master/${path}`;
    const response = await fetch(url, {
      headers: { 'Authorization': `Bearer ${accessToken}` }
    });
    const data = await response.json();
    
    let context = "";
    for (const entry of data.values) {
      if (entry.type === 'commit_directory') {
        context += await fetchTree(entry.path);
      } else if (entry.type === 'commit_file') {
        const ext = entry.path.split('.').pop();
        if (['ts', 'tsx', 'js', 'py', 'json'].includes(ext)) {
          const fileContent = await (await fetch(entry.links.self.href, {
            headers: { 'Authorization': `Bearer ${accessToken}` }
          })).text();
          context += `\n--- FILE: ${entry.path} ---\n${fileContent}\n`;
        }
      }
    }
    return context;
  };

  return await fetchTree();
};

/**
 * 2. REASONING LOOP: Refactor via Gemini 1.5
 * Sends prompt + context to AI and receives raw code
 */
export const executeAutonomousCycle = async (instruction, codebaseContext, apiKey) => {
  const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${apiKey}`;
  
  const systemPrompt = `You are the Alpha-Refactor Engine. 
  Instruction: ${instruction}
  Constraint: Return ONLY the refactored code or a JSON diff. 
  NO Markdown, NO explanations. Pure compilable stream. 
  Accuracy: Scientific rigor, recursive optimization.`;

  const response = await fetch(GEMINI_URL, {
    method: 'POST',
    body: JSON.stringify({
      contents: [{ parts: [{ text: `${systemPrompt}\n\nCodebase Context:\n${codebaseContext}` }] }],
      generationConfig: { temperature: 0.1, topP: 0.95 }
    })
  });

  const data = await response.json();
  const refactoredCode = data.candidates[0].content.parts[0].text;
  
  // Basic Syntax Check (simple check for React/JS)
  try {
    new Function(refactoredCode); 
    console.log("[α-bridge] Syntax validation successful.");
  } catch (e) {
    if (!refactoredCode.includes('import') && !refactoredCode.includes('export')) {
        throw new Error(`[α-bridge] Syntax validation failed: ${e.message}`);
    }
    // ESM modules skip Function check, assuming build system handles it
  }

  return refactoredCode;
};

/**
 * 3. LIVE PREVIEW: Fly.io Machine Update
 * Updates existing machine with new code/env without full redeploy
 */
export const triggerPreview = async (appName, machineId, codeDiff, flyToken) => {
  console.log(`[α-bridge] Triggering live preview on Fly machine: ${machineId}`);
  
  const url = `${FLY_API_BASE}/apps/${appName}/machines/${machineId}`;
  
  // We use env vars as a "Hot Patch" mechanism or update the machine config
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${flyToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      region: "ams",
      config: {
        env: {
          HOT_PATCH_CODE: Buffer.from(codeDiff).toString('base64'),
          LAST_REFRESH: new Date().toISOString()
        }
      }
    })
  });

  if (!response.ok) throw new Error(`[α-bridge] Fly API Error: ${response.statusText}`);
  return await response.json();
};

/**
 * 4. BITBUCKET COMMIT BOT
 */
export const bitbucketCommitBot = async (workspace, repoSlug, filePath, content, accessToken) => {
    const url = `${BITBUCKET_API_BASE}/repositories/${workspace}/${repoSlug}/src`;
    const formData = new FormData();
    formData.append(filePath, content);
    formData.append('message', '[α-refactor] Automated optimization');
    formData.append('branch', 'master');

    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${accessToken}` },
        body: formData
    });

    return response.ok;
};
