# Requirements traceability (initial implementation)

Status vocabulary: **Implemented** means code exists; **Automated** means covered by a local test; **Illustrator verified** requires a real Illustrator run. No requirement in this repository currently has Illustrator-verified status.

| ID | Priority | Requirement / scope in this build | Module | Verification | Status / gap |
|---|---|---|---|---|---|
| EF-001 | P0 | Standalone offline JSX bundle | `src/core`, `src/ui`, `scripts/build` | Build + artifact inspection | Implemented; reproducibility locally checked |
| EF-002 | P0 | ES3-oriented source, no runtime dependencies | all runtime code | Syntax/source review | Implemented by intent; not checked in ExtendScript runtime |
| EF-003 | P0 | Parse and validate typed expression; retain invalid input | `src/core/engine.js`, UI | `tests/core.test.js` | Automated for core cases |
| EF-004 | P0 | Native Illustrator insertion, safe named grouping, rollback | `src/ui/app.js` | Manual Illustrator checks required | Code implemented; not verified in Illustrator |
| EF-005 | P1 | Fraction/root/script/basic operation structure and nested content | core parser + renderer | parser tests / Illustrator visual inspection | Parser automated; geometry only partially implemented/unverified |
| EF-006 | P1 | Search symbol command/name and use selected symbol | core symbol index + UI | core lookup test; UI manual | Core automated; UI unverified |
| EF-007 | P1 | Built-in editable starter expressions | UI | manual | Implemented as text insertion; not persistent templates |
| EF-008 | P1 | Save/open equation data without eval deserialization | core + UI | serialization round-trip tests | Automated for tested cases; filesystem dialog unverified |
| EF-009 | P1 | Chemistry/physics equation entry | parser / templates | formula parser cases | Basic plain expression entry only; no domain-aware chemistry or physics model |
| EF-010 | P2 | Structured matrices, cases, aligned/multiline layout | core / renderer | none | Not implemented; unsupported syntax documented |
| EF-011 | P2 | Favorites, recent history and custom templates persistence | storage / UI | none | Not implemented |
| EF-012 | P2 | Local and per-node typography controls | typography / UI | none | Global font/size fields only; styling unverified |
| EF-013 | P2 | SVG/EPS/PDF exports | renderer / export | none | Not implemented; buttons not exposed |
| EF-014 | P2 | Undo/redo | UI | manual | In-session text edit history only; Illustrator art undo not intercepted |
| EF-015 | P0 | Installation, limitations, compatibility, test docs | docs | review | Implemented |
| EF-016 | P0 | Release asset/tag verified in Illustrator and published | release | release gate | Blocked; not production-ready and Illustrator environment unavailable |

## Syntax subset

Documented examples include arithmetic `+ - * /`, relations `= < <= >= != -> <->`, parentheses/brackets/braces, implicit multiplication, `x^2`, `x_1`, `frac(a,b)`, `sqrt(x)`, `cbrt(x)`, `root(n,x)`, `abs(x)`, `norm(x)`, `vec(x)`, `sum(lower,upper,body)`, `prod(...)`, `int(lower,upper,body,differential)`, `lim(condition,body)`, `det(x)`, and selected commands such as `\\alpha`, `\\leq`, `\\infty`. It is not full LaTeX. The parser rejects unsupported commands and characters rather than silently accepting them.

## Release blockers

- No real Illustrator installation or runtime test is available here.
- ScriptUI layout and API behavior have not been exercised in CC 2015 or later versions.
- Renderer dimensions are estimates based on character count, not Illustrator text metrics; output needs manual correction and should not be represented as publication-grade.
- Significant requested subsystems remain out of scope in this pre-release. See `KNOWN_LIMITATIONS.md`.
