# LAMPrime — in-browser LAMP primer designer

LAMPrime is a small, dependency-free web tool (HTML/CSS/JavaScript) that designs
**LAMP** (loop-mediated isothermal amplification) primer sets entirely in the
browser. The sequence never leaves the device: there is no server, no upload and
no network call during design, so it runs offline and keeps the input private.

From a target sequence it enumerates the six LAMP regions
(**F3, F2, F1, B1, B2, B3**) under PrimerExplorer V5 / NEB distance constraints
and assembles the complete primer set: outer **F3/B3**, inner **FIP = F1c–F2**
and **BIP = B1c–B2**, and loop primers **LF/LB**.

## Method

- **Melting temperature** — nearest-neighbor model (SantaLucia, 1998) with salt
  correction and a monovalent-equivalent treatment of Mg²⁺ (von Ahsen, 2001:
  `Na_eq = Na⁺ + 120·√(Mg²⁺_free)`, `Mg²⁺_free = Mg²⁺ − dNTP`). Defaults follow the
  NEB condition (Na⁺ 50 mM, Mg²⁺ 8 mM, dNTP 1.4 mM, oligo 50 nM); inner window
  64–66 °C, outer 59–61 °C.
- **Geometry** — F2–B2 amplicon 120–180 nt; F3–F2 gap 0–60 nt; loop spans
  40–60 nt; F1–B1 centre 0–60 nt (Eiken PrimerExplorer V5 / NEB).
- **Quality filters** — GC%, end stability ΔG (Eiken criterion ≤ −4 kcal/mol) and
  a linguistic-complexity screen to reject low-complexity primers.
- **Secondary-structure screen** — at the reaction temperature (default 63 °C)
  each candidate set is scanned for hairpins, self-dimers and cross-dimers; sets
  with a structure more stable than the threshold (default −3 kcal/mol) are
  penalised, and the finalists are re-ranked accordingly. Reported per set as the
  worst hairpin and worst dimer ΔG. The reaction temperature and the
  hairpin/dimer and end-stability thresholds are exposed in the interface and are
  user-adjustable.

References implemented: Notomi 2000; Nagamine 2002; Tomita 2008; SantaLucia 1998;
von Ahsen 2001.

> This is the real, current tool — a full client-side primer-design engine. (An
> earlier prototype was a UI-only mock; that is no longer the case.)

## Files

- `index.html` / `LAMPrime.html` — the application page (identical; `LAMPrime.html`
  is the deployed entry point).
- `app.js` — the design engine plus a built-in PT/EN interface toggle.
- `styles.css` — styling (dark theme).
- `tools/concordance.py` — deterministic validation script (see below).

## Use

Open `index.html` (or `LAMPrime.html`) in any modern browser, or serve the folder
statically. Paste a sequence or load a FASTA file (`>` headers are ignored), set
the parameters, and generate the ranked primer sets. Each set reports Tm, GC%,
penalty, coordinates and the secondary-structure summary. The language button
switches the whole interface between Portuguese and English.

Live instance: https://www.ifrj-crj-geneticamolecular.online/aplicativos/pcr_lamp/LAMPrime.html

## Validation

`tools/concordance.py` is a deterministic, dependency-light script (standard
library only) that re-scores **published, experimentally validated** LAMP primer
sets with the exact same nearest-neighbor model used by LAMPrime, locating each
primer on its target and reporting position, Tm, GC% and amplicon sizes, plus the
secondary-structure summary at 63 °C.

```bash
python tools/concordance.py
```

Targets (three published, experimentally validated LAMP primer sets):

- *Anaplasma marginale* msp1b — Giglioti et al. (2018); synthetic gBlocks target
  from GenBank M59845.1; FASTA read offline from `tools/data/`.
- SARS-CoV-2 spike (S gene) — Prakash et al. (2023); CDS NC_045512.2
  positions 21563–25384; FASTA read offline from `tools/data/`; fetched from
  NCBI E-utilities only if the file is absent.
- *Mycobacterium tuberculosis* IS6110 — Bentaleb et al. (2016), *BMC Infect Dis*
  16:517; target GenBank X17348.1; fetched from NCBI E-utilities if absent from
  `tools/data/`.

All three targets are offline-deterministic when their FASTA files are present in
`tools/data/`. These are the reference validation targets used in this work.

## License

MIT — see [LICENSE](LICENSE). © 2026 Luiz Dione Barbosa de Melo. Source code and
issues: https://github.com/luizdione/LAMPrime
