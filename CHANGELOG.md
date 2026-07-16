# Changelog

## v1.4 — 2026-07-16
- Motor de Tm: unificação do Mg²⁺ livre. O motor de desenho (`tmNN`) passa a computar o Mg²⁺ livre pelo mesmo equilíbrio de quelação 1:1 com dNTP (Ka=3×10⁴ M⁻¹) já usado pela varredura de especificidade, no lugar da subtração crua `max(0, Mg−dNTP)`. No ponto de operação padrão (Mg 8 mM, dNTP 1,4 mM) o efeito é desprezível (Mg livre 6,600→6,607 mM); a correção importa perto da estequiometria (Mg≈dNTP), onde o modelo cru zerava o Mg livre e derrubava o Tm. Espelhado em `tools/concordance.py` para manter a concordância. Ferramenta nova `tools/tm_uncertainty.py` (incerteza de Tm; SantaLucia 1998 vs 2004) e `concordance.py` importável; correção do ano de Giglioti (2019→2018).

## v1.3 — 2026-06-24
- Specificity Mg sweep: heatmap now colors by the Mg-dependent off-target safety margin (T_rxn − Tm_off) instead of the Mg-invariant discrimination margin S; suggested Mg keeps off-targets below the reaction temperature while on-targets stay functional; clarified that Mg shifts absolute Tm, not the match/mismatch margin.

## v1.2 — 2026-06-23
- Specificity tab: Mg²⁺ sweep (2–10 mM) producing a per-primer on-target−off-target Tm-margin heatmap (Owczarzy 2008 divalent correction; Allawi/Peyret internal-mismatch NN); suggested working [Mg²⁺] by maximin. New offline validation script tools/mgspec.mjs.

## v1.1 — 2026-06-23
- Specificity tab: added one-click cross-reactivity example presets (A. marginale vs A. centrale CP001759.1; B. bovis 18S vs B. bigemina KP710228.1).
- Documented the in-browser specificity screen used for the published cross-reactivity benchmark (tools/crossreact.js).
