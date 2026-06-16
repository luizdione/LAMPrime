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
- **Secondary-structure screen** — at the reaction temperature (63 °C) each
  candidate set is scanned for hairpins, self-dimers and cross-dimers; sets with a
  structure more stable than −3 kcal/mol are penalised, and the finalists are
  re-ranked accordingly. Reported per set as the worst hairpin and worst dimer ΔG.

References implemented: Notomi 2000; Nagamine 2002; Tomita 2008; SantaLucia 1998;
von Ahsen 2001.

## Use

Open `index.html` in any modern browser (or serve the folder statically). Paste a
sequence or load a FASTA file (`>` headers are ignored), set the parameters, and
generate the ranked primer sets. Results can be inspected per set, including Tm,
GC%, penalties and the secondary-structure summary.

## Validation

`tools/concordance.py` is a deterministic, dependency-light script (standard
library only) that re-scores **published, experimentally validated** LAMP primer
sets with the exact same nearest-neighbor model used by LAMPrime, locating each
primer on its target and reporting position, Tm, GC% and amplicon sizes, plus the
secondary-structure summary at 63 °C. See `tools/LEGENDS.md` for the table
legends and data provenance.

```bash
python tools/concordance.py
```

Targets covered: *Anaplasma marginale* (msp1b), SARS-CoV-2 (spike). Public
sequence data are fetched/embedded as described in `tools/LEGENDS.md`.

## License

MIT — see [LICENSE](LICENSE). © 2026 Luiz Dione Barbosa de Melo.
