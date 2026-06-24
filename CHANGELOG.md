# Changelog

## v1.3 — 2026-06-24
- Specificity Mg sweep: heatmap now colors by the Mg-dependent off-target safety margin (T_rxn − Tm_off) instead of the Mg-invariant discrimination margin S; suggested Mg keeps off-targets below the reaction temperature while on-targets stay functional; clarified that Mg shifts absolute Tm, not the match/mismatch margin.

## v1.2 — 2026-06-23
- Specificity tab: Mg²⁺ sweep (2–10 mM) producing a per-primer on-target−off-target Tm-margin heatmap (Owczarzy 2008 divalent correction; Allawi/Peyret internal-mismatch NN); suggested working [Mg²⁺] by maximin. New offline validation script tools/mgspec.mjs.

## v1.1 — 2026-06-23
- Specificity tab: added one-click cross-reactivity example presets (A. marginale vs A. centrale CP001759.1; B. bovis 18S vs B. bigemina KP710228.1).
- Documented the in-browser specificity screen used for the published cross-reactivity benchmark (tools/crossreact.js).
