---
name: Vite 8 Node.js requirement
description: Vite 8 requires a specific Node.js version that Vercel's default may not satisfy, causing npm install to fail.
---

Vite 8 requires `node: "^20.19.0 || >=22.12.0"`. Vercel's default Node.js 20 environment may be an older patch (e.g. 20.11) that does not satisfy `^20.19.0`, causing `npm install --no-fund --no-audit` to exit with code 1.

**Why:** The engines field in vite/package.json enforces the minimum version at install time via npm's engine check.

**How to apply:** Add to package.json `"engines": { "node": ">=22.12.0" }` and create a `.node-version` file containing `22`. Also ensure vercel.json does not pin an old Node version. This forces Vercel to use Node 22 for builds.
