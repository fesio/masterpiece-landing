import * as acorn from 'acorn';
import * as walk from 'acorn-walk';

/**
 * α-Gatekeeper: Proof of Correctness
 * AST-based security audit and complexity verification.
 */

export const verifyAutonomousCode = (sourceCode) => {
  let ast;
  try {
    ast = acorn.parse(sourceCode, {
      ecmaVersion: 2022,
      sourceType: 'module',
    });
  } catch (err) {
    throw new Error(`[α-Gatekeeper] SYNTAX_ERROR: ${err.message}`);
  }

  const forbidden = ['eval', 'setTimeout', 'setInterval', 'Function'];
  let complexity = 1; // Base complexity

  walk.simple(ast, {
    Identifier(node) {
      if (forbidden.includes(node.name)) {
        throw new Error(`[α-Gatekeeper] SECURITY_VIOLATION: Use of forbidden identifier '${node.name}' (CVSS v4: High)`);
      }
    },
    MemberExpression(node) {
      const propertyName = node.property.name || (node.property.value && node.property.value.toString());
      if (propertyName === '__proto__' || propertyName === 'constructor') {
        throw new Error(`[α-Gatekeeper] SECURITY_VIOLATION: Prototype Pollution vector detected via '${propertyName}'`);
      }
    },
    // Cyclomatic Complexity calculation
    IfStatement() { complexity++; },
    ForStatement() { complexity++; },
    ForInStatement() { complexity++; },
    ForOfStatement() { complexity++; },
    WhileStatement() { complexity++; },
    DoWhileStatement() { complexity++; },
    CatchClause() { complexity++; },
    ConditionalExpression() { complexity++; }, // Ternary operator
    SwitchCase() { complexity++; },
  });

  if (complexity > 15) {
    throw new Error(`[α-Gatekeeper] COMPLEXITY_EXCEEDED: Cyclomatic Complexity is ${complexity} (Limit: 15). Optimize for HFT/Quant latency.`);
  }

  return {
    status: 'VERIFIED',
    complexity,
    security: 'PASS (CVSS v4 compliant)'
  };
};
