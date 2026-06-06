/**
 * ssrBundle.js — esbuild entry point for SSR template compilation
 *
 * This file is compiled by scripts/buildSsr.mjs into dist-ssr/templates.js.
 * It re-exports every template component so the bundle contains them all.
 *
 * On Vercel, Node.js cannot import raw .jsx files.  atsReactRenderer.js
 * detects process.env.VERCEL and imports from dist-ssr/templates.js instead
 * of importing JSX files dynamically.
 *
 * Export names MUST match the file names without the .jsx extension
 * (e.g. ATSCleanTemplate.jsx → export { default as ATSCleanTemplate }).
 */

// ── ATS ──────────────────────────────────────────────────────────────────────
export { default as ATSCleanTemplate }   from '../../src/templates/ATSCleanTemplate.jsx';
export { default as ATSProTemplate }     from '../../src/templates/ATSProTemplate.jsx';
export { default as ATSSimpleTemplate }  from '../../src/templates/ATSSimpleTemplate.jsx';
export { default as ATSBoldTemplate }    from '../../src/templates/ATSBoldTemplate.jsx';
export { default as ATSCompactTemplate } from '../../src/templates/ATSCompactTemplate.jsx';
export { default as ATSModernTemplate }  from '../../src/templates/ATSModernTemplate.jsx';
export { default as ATSHarvardTemplate } from '../../src/templates/ATSHarvardTemplate.jsx';
export { default as ATSCenterTemplate }  from '../../src/templates/ATSCenterTemplate.jsx';
export { default as ATSElegantTemplate } from '../../src/templates/ATSElegantTemplate.jsx';

// ── English ──────────────────────────────────────────────────────────────────
export { default as ModernTemplate }        from '../../src/templates/ModernTemplate.jsx';
export { default as ClassicTemplate }       from '../../src/templates/ClassicTemplate.jsx';
export { default as CreativeTemplate }      from '../../src/templates/CreativeTemplate.jsx';
export { default as MinimalTemplate }       from '../../src/templates/MinimalTemplate.jsx';
export { default as ExecutiveTemplate }     from '../../src/templates/ExecutiveTemplate.jsx';
export { default as PrestigeTemplate }      from '../../src/templates/PrestigeTemplate.jsx';
export { default as ClassicSerifTemplate }  from '../../src/templates/ClassicSerifTemplate.jsx';
export { default as AtlanticBlueTemplate }  from '../../src/templates/AtlanticBlueTemplate.jsx';
export { default as MercuryFlowTemplate }   from '../../src/templates/MercuryFlowTemplate.jsx';
export { default as EditorialRuleTemplate } from '../../src/templates/EditorialRuleTemplate.jsx';
export { default as SidebarLightTemplate }  from '../../src/templates/SidebarLightTemplate.jsx';
export { default as TealProTemplate }       from '../../src/templates/TealProTemplate.jsx';
export { default as RoseElegantTemplate }   from '../../src/templates/RoseElegantTemplate.jsx';
export { default as DarkHeaderTemplate }    from '../../src/templates/DarkHeaderTemplate.jsx';
export { default as VelvetTemplate }        from '../../src/templates/VelvetTemplate.jsx';
export { default as AuroraTemplate }        from '../../src/templates/AuroraTemplate.jsx';
export { default as EnglishHorizonTemplate } from '../../src/templates/EnglishHorizonTemplate.jsx';
export { default as EnglishApexTemplate }   from '../../src/templates/EnglishApexTemplate.jsx';

// ── Arabic ───────────────────────────────────────────────────────────────────
export { default as ArabicGemTemplate }          from '../../src/templates/ArabicGemTemplate.jsx';
export { default as ArabicNavyTemplate }         from '../../src/templates/ArabicNavyTemplate.jsx';
export { default as ArabicProTemplate }          from '../../src/templates/ArabicProTemplate.jsx';
export { default as ArabicTealSidebarTemplate }  from '../../src/templates/ArabicTealSidebarTemplate.jsx';
export { default as ArabicSlateSidebarTemplate } from '../../src/templates/ArabicSlateSidebarTemplate.jsx';
export { default as ArabicModernTemplate }       from '../../src/templates/ArabicModernTemplate.jsx';
export { default as ArabicCardTemplate }         from '../../src/templates/ArabicCardTemplate.jsx';
export { default as ArabicEliteTemplate }        from '../../src/templates/ArabicEliteTemplate.jsx';
export { default as ArabicWaveTemplate }         from '../../src/templates/ArabicWaveTemplate.jsx';
export { default as ArabicLuxeTemplate }         from '../../src/templates/ArabicLuxeTemplate.jsx';
export { default as ArabicZafirTemplate }        from '../../src/templates/ArabicZafirTemplate.jsx';
