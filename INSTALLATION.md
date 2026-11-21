# Installation

## Run once

1. Obtain `dist/EquationForge.jsx` from this repository (or generate it with the build steps in `DEVELOPMENT.md`).
2. Open Adobe Illustrator and preferably use a disposable document while evaluating this pre-release.
3. Choose **File → Scripts → Other Script…**.
4. Select `EquationForge.jsx` and open it.
5. Enter an expression, inspect the canonical syntax feedback, and choose **Insert into Illustrator**.

The built script is intended to run offline and has no external JavaScript dependencies. Since Illustrator runtime behavior has not yet been verified, test with a backup document first.

## Optional persistent installation

Illustrator's script-folder location varies by OS and version. Copy the JSX into the Scripts folder documented for your installed Illustrator version, then restart Illustrator. If that folder is not writable, continue using **Other Script…**.
