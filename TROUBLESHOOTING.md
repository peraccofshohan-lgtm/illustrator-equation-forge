# Troubleshooting

- **Script does not appear in a Scripts menu:** use File → Scripts → Other Script… and select the JSX. Persistent menu installation requires the version-specific Scripts folder and an Illustrator restart.
- **Startup error:** confirm a supported Illustrator ExtendScript/ScriptUI context and inspect the alert. This pre-release has not been tested in Illustrator; report the exact error and version before assuming compatibility.
- **No document / insertion fails:** open a document. Insert currently targets the active layer and active artboard; unusual/locked layers may cause failure. No unrelated artwork should be intentionally removed; inspect the document after errors.
- **Expression rejected:** check supported syntax in `REQUIREMENTS.md`; this is not full LaTeX. Errors include an approximate source position. Unsupported commands are rejected.
- **Symbol appears as a box or wrong glyph:** the selected font may not contain it. The application does not reliably inspect glyph coverage; try an installed math-capable font and verify the actual artwork.
- **Spacing, fraction, root, or baseline looks wrong:** current layout uses estimated character widths, not Illustrator's actual text metrics. Adjust manually; publication-grade metric layout is not implemented.
- **Save/open failure:** ensure destination permissions and `.eqforge` extension. Only syntax is saved; malformed or unknown-format data is rejected.
- **CC 2015/version error:** version compatibility is not yet established. Record the full Illustrator version, OS, expression and error message; don't infer support from ES3 syntax alone.
