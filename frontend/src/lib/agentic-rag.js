/**
 * Fesiomatyzacja: agentic-rag.js
 * Context Aggregator & System State Provider
 */

// Shared system state (Singleton-like for the dashboard)
let systemState = {
  hurstExponent: 0.32,
  activeMachines: 4,
  gatekeeperLogs: [],
  cvssTarget: 'AUD-01 (Caido/Proxy)',
  alphaStrategy: 'MEAN_REVERTING'
};

/**
 * Updates the global system state from various modules.
 */
export const updateSystemState = (newState) => {
  systemState = { ...systemState, ...newState };
};

/**
 * Captures the current system state for RAG injection.
 * @returns {Object} The current snapshot of Fesiomatyzacja.
 */
export const getCurrentSystemState = () => {
  return {
    ...systemState,
    timestamp: new Date().toISOString(),
    nodeId: 'ALPHA_NODE_7'
  };
};

/**
 * Formats the system state for the LLM prompt.
 */
export const getFormattedSystemContext = () => {
  const state = getCurrentSystemState();
  return `[SYSTEM STATE: ${JSON.stringify(state)}]`;
};
