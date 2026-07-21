# Legends — concordance validation (`concordance.py`)

`concordance.py` reproduces, deterministically, the concordance between
LAMPrime's thermodynamic/geometric model and **published, experimentally
validated** LAMP primer sets. Run `python tools/concordance.py`; it prints one
table per target. All temperatures use the nearest-neighbor model implemented in
LAMPrime (SantaLucia 1998 + von Ahsen 2001 Mg²⁺→Na⁺ equivalent; Na⁺ 50 mM,
Mg²⁺ 8 mM, dNTP 1.4 mM, oligo 50 nM).

## Table A — *Anaplasma marginale* msp1b

Concordance of the published *A. marginale* msp1b LAMP set on the synthetic
target. For each component (F3, F2, F1c, B1c, B2, B3, LF, LB): length, Tm (°C),
GC (%), position and strand on the target, and the F2–B2 / F3–B3 amplicon sizes;
a secondary-structure summary at 63 °C (worst hairpin, worst self-dimer, worst
hetero-dimer ΔG; threshold −3.0 kcal/mol) follows.

Data provenance: target = synthetic msp1b fragment (gBlocks, based on GenBank
M59845.1) and primers as reported by Giglioti et al., *Exp. Appl. Acarol.* 77
(2018) 65–72, https://doi.org/10.1007/s10493-018-0327-y.

## Table B — SARS-CoV-2 spike (S) gene

Same columns as Table A, for the published SARS-CoV-2 spike LAMP set mapped onto
the spike CDS.

Data provenance: reference genome SARS-CoV-2 NC_045512.2 (spike CDS 21563–25384),
fetched at run time from NCBI E-utilities; primers as reported by Prakash et al.,
*MethodsX* 10 (2023) 102011, https://doi.org/10.1016/j.mex.2023.102011.

## Table C — *Mycobacterium tuberculosis* IS6110

Same columns as Tables A and B, for the published IS6110 LAMP set mapped onto
the IS6110 insertion sequence.

Data provenance: target = GenBank X17348.1 (IS6110 element), fetched from NCBI
E-utilities if `tools/data/mtb_is6110_X17348.fasta` is absent; primers as
reported by Bentaleb et al., *BMC Infectious Diseases* 16 (2016) 517,
https://doi.org/10.1186/s12879-016-1848-1. Explicit F1c/F2/B1c/B2 component
sequences are provided in the primer dictionary (no heuristic split required).

> Note: a component is reported as "NAO ACHADO" when the published primer differs
> from the reference deposit (e.g. a single-nucleotide variant), which reflects
> primer–target identity, not the design model.

## Figure S — Tm concordance across GC content (`gc_concordance.py` / `plot_gc_concordance.py`)

Independent validation of the LAMPrime melting-temperature engine over a panel of
**13 published LAMP primer sets designed by other tools** (Eiken PrimerExplorer
V3/V4/V5 or NEB — none by LAMPrime), spanning **~30–67 % amplicon GC** and **12
organisms**. For every oligo the LAMPrime Tm (`concordance.tm`; SantaLucia 1998 +
von Ahsen 2001) is compared with an independent implementation (BioPython
`Tm_NN`, NN4 = SantaLucia & Hicks 2004; Owczarzy 2004 salt) under identical
conditions (Na⁺ 50 mM, Mg²⁺ 8 mM, dNTP 1.4 mM; effective 12.5 nM).

Each set was QC-mapped onto its GenBank target (the primers form a compact
~180–240 nt LAMP amplicon; the reported %GC is that of the F3–B3 amplicon).
Primer sequences are verbatim from the cited sources (DOIs in the header of
`gc_concordance.py`); targets are versioned under `tools/data/` (the amplicon
region for large genomes).

- **Panel A** — per-oligo agreement: LAMPrime Tm vs BioPython Tm on the identity
  line (n = 73 oligos, 13 assays; Pearson r = 0.99999; max |ΔTm| = 0.15 °C).
- **Panel B** — ΔTm (LAMPrime − BioPython) vs amplicon GC: the agreement is flat
  and tight (|ΔTm| ≤ ~0.15 °C, mostly within ±0.1 °C) across the whole 30–67 % GC
  range, i.e. the engine is not biased by base composition.

Sets (by amplicon GC): *Plasmodium vivax* cox1 (Britton 2016, NEB); *Entamoeba
histolytica* SREHP (Elias 2020); *Plasmodium falciparum* 18S (Mohon 2014, PE V4);
*Babesia bovis* cytb (Arnuphapprasert 2023, PE V5); SARS-CoV-2 S (Prakash 2023)
and ORF1ab (Huang 2020, PE); *Escherichia coli* malB (Hill 2008, PE v3); Zika
virus E (Calvert 2017, PE V5); *Anaplasma marginale* msp1b (Giglioti 2018);
*Xanthomonas citri* (Webster 2022, PE V5); *Pseudomonas aeruginosa* ecfX (He
2025, PE V5); *Mycobacterium tuberculosis* IS6110 (Bentaleb 2016); *Mycobacterium
kansasii* rpoB (Chen 2021, PE V4).

Reproduce: `python tools/gc_concordance.py && python tools/plot_gc_concordance.py`.
