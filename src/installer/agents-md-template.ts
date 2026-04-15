/**
 * AGENTS.md template for CodeGraph instructions
 *
 * This template is injected into ~/AGENTS.md (global) or ./AGENTS.md (local)
 * for OpenCode, Warp, and other agents that read AGENTS.md.
 */

export const AGENTS_SECTION_START = '<!-- CODEGRAPH_START -->';
export const AGENTS_SECTION_END = '<!-- CODEGRAPH_END -->';

export const AGENTS_MD_TEMPLATE = `${AGENTS_SECTION_START}
## CodeGraph

CodeGraph builds a semantic knowledge graph of codebases for faster, smarter code exploration.

### If \`.codegraph/\` exists in the project

For exploration questions (e.g., "how does X work?", "where is Y implemented?"), use CodeGraph tools first instead of broad file scans.

Start with high-signal tools:
- \`codegraph_search\` to find symbols by name
- \`codegraph_callers\` / \`codegraph_callees\` to trace call flow
- \`codegraph_impact\` to check downstream impact before edits
- \`codegraph_node\` for a symbol's details and source snippets
- \`codegraph_context\` for a task-focused context bundle

Avoid re-reading files when CodeGraph already returned authoritative source snippets for the same symbols.

### If \`.codegraph/\` does NOT exist

At the start of a session, ask the user if they'd like to initialize CodeGraph:

"I notice this project doesn't have CodeGraph initialized. Would you like me to run \`codegraph init -i\` to build a code knowledge graph?"
${AGENTS_SECTION_END}`;
