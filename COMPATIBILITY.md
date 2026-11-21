# Compatibility matrix

| Environment | Status | Evidence |
|---|---|---|
| Adobe Illustrator CC 2015 | **Not tested** | No Illustrator runtime available during development. ES3-oriented source only. |
| Subsequent Creative Cloud Illustrator releases | **Not tested** | No runtime integration testing. |
| Current Illustrator | **Not tested** | No runtime integration testing. |
| Node.js core test harness | **Automated core tests passed** | Runs parser logic in Node VM; does not represent Illustrator. |
| Python build host | **Build tested** | Standard-library-only packager produces the JSX artifact. |

The source avoids modern JavaScript syntax by design and uses ScriptUI, File, app, RGBColor, TextFrame, GroupItem, PathItem and artboard APIs in a traditional ExtendScript style. This source-level intent is not a compatibility guarantee. Illustrator text APIs, ScriptUI behavior, supported Unicode glyphs, and DOM details may differ by version. Any release claiming CC 2015 or later support requires real-version checks.
