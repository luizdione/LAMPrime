#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
plot_fig3.py - Render Figure 3 of the LAMPrime paper: the Mg2+-vs-specificity
heatmap for the published serotype-specific DENV-1 RT-LAMP primer set
(Hu et al. 2015, BMC Microbiology 15:265).

Self-contained & reproducible: reads tools/data/dengue_mg_Sij.csv (written by
tools/dengue_mgspec.mjs) and tools/data/dengue_mg_suggested.json. No numbers are
invented here; the figure is a pure rendering of the computed S(i,j) matrix.

  rows = the 6 published DENV-1 primers (F3, B3, FIP, BIP, LF, LB)
  cols = total MgSO4 (2-10 mM), secondary tick row = free Mg2+ per column
  color = S(i,j) = Tm_on - Tm_off (deg C), diverging map (green = specific /
          high margin, red = low / negative margin), anchored at 0
  marker = box on the suggested-Mg column

Output: PAPER/figuras/fig3_mg_specificity.png (300 dpi). Caption lives in the paper.

Usage: python tools/plot_fig3.py
"""
import os, sys, csv, json
sys.stdout.reconfigure(encoding="utf-8")
import numpy as np
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.patches import Rectangle
from matplotlib import colors as mcolors

HERE = os.path.dirname(os.path.abspath(__file__))
DATA = os.path.join(HERE, "data")
CSV = os.path.join(DATA, "dengue_mg_Sij.csv")
SUGG_JSON = os.path.join(DATA, "dengue_mg_suggested.json")
ROOT = os.path.dirname(HERE)
OUT = os.path.join(ROOT, "PAPER", "figuras", "fig3_mg_specificity.png")

ROW_ORDER = ["F3", "B3", "FIP", "BIP", "LF", "LB"]

# ---- load ----
rows = []
with open(CSV, newline="", encoding="utf-8") as f:
    for r in csv.DictReader(f):
        rows.append(r)
if not rows:
    raise SystemExit("FATAL: empty CSV " + CSV)

with open(SUGG_JSON, encoding="utf-8") as f:
    sugg = json.load(f)
SUGG_MG = float(sugg["suggested_mg_total"])

mg_totals = sorted({float(r["mg_total"]) for r in rows})
mg_free_by_total = {float(r["mg_total"]): float(r["mg_free"]) for r in rows}

# S matrix (rows x cols)
S = np.full((len(ROW_ORDER), len(mg_totals)), np.nan)
TMON = np.full_like(S, np.nan)
TMOFF = np.full_like(S, np.nan)
NMM = {}
for r in rows:
    i = ROW_ORDER.index(r["primer"])
    j = mg_totals.index(float(r["mg_total"]))
    S[i, j] = float(r["S"])
    TMON[i, j] = float(r["tm_on"])
    TMOFF[i, j] = float(r["tm_off"])
    NMM[r["primer"]] = int(r["n_mismatch"])

# ---- colour scale: diverging, anchored at 0 (red=lost specificity, green=high margin) ----
# Semantics: S<=0 (red) = off-target Tm meets/exceeds on-target -> specificity lost;
# S>0 (yellow->green) = on-target favoured. We centre the diverging map at a
# specificity THRESHOLD of 5 C (a conservative discrimination floor) so that the
# transition red->green sits at the biologically meaningful boundary, and clip the
# top so the bulk of the matrix (S ~ 20-31 C) is not washed out by the LB outlier
# (S ~ 73 C). Cells above vmax saturate green; their exact value is annotated.
smax = float(np.nanmax(S))
smin = float(np.nanmin(S))
THRESH = 5.0
# robust upper bound: 95th percentile rounded up, but >= a sensible floor so green is reached
vmax = max(35.0, float(np.ceil(np.nanpercentile(S, 90) / 5.0) * 5.0))
vmin = -5.0
norm = mcolors.TwoSlopeNorm(vmin=vmin, vcenter=THRESH, vmax=vmax)
cmap = plt.get_cmap("RdYlGn")  # red(low/neg) -> yellow(threshold) -> green(high)

fig, ax = plt.subplots(figsize=(10.4, 4.4), dpi=300)
im = ax.imshow(S, aspect="auto", cmap=cmap, norm=norm, origin="upper")

# ---- annotate every cell with its S value (quantitative honesty) ----
for i in range(S.shape[0]):
    for j in range(S.shape[1]):
        val = S[i, j]
        # choose readable text colour against the cell
        rgba = cmap(norm(val))
        lum = 0.299 * rgba[0] + 0.587 * rgba[1] + 0.114 * rgba[2]
        tc = "black" if lum > 0.55 else "white"
        ax.text(j, i, f"{val:.0f}", ha="center", va="center",
                fontsize=6.0, color=tc)

# ---- axes ----
# Two-line x tick labels: total MgSO4 (top) and free Mg2+ (bottom, grey).
ax.set_xticks(range(len(mg_totals)))
xlabels = [f"{m:.1f}\n({mg_free_by_total[m]:.1f})" for m in mg_totals]
ax.set_xticklabels(xlabels, fontsize=6.6)
ax.set_yticks(range(len(ROW_ORDER)))
ax.set_yticklabels([f"{p}  ({NMM[p]} mm)" for p in ROW_ORDER], fontsize=8.5)
ax.set_xlabel("total MgSO$_4$ (mM)   [ free Mg$^{2+}$ after dNTP chelation, mM ]", fontsize=9)
ax.set_ylabel("DENV-1 primer  (fewest off-target mismatches)", fontsize=9)

# ---- suggested-Mg column box ----
if SUGG_MG in mg_totals:
    jcol = mg_totals.index(SUGG_MG)
    ax.add_patch(Rectangle((jcol - 0.5, -0.5), 1, len(ROW_ORDER),
                           fill=False, edgecolor="#111111", lw=2.2, zorder=5))
    ax.annotate(f"suggested Mg = {SUGG_MG:.1f} mM",
                xy=(jcol, -0.5), xytext=(jcol, -0.95),
                ha="center", va="bottom", fontsize=8, fontweight="bold",
                annotation_clip=False)

# ---- colourbar ----
cbar = fig.colorbar(im, ax=ax, fraction=0.045, pad=0.02, extend="max")
cbar.set_label("specificity margin  S = Tm$_{on}$ - Tm$_{off}$  (°C)", fontsize=8.5)
cbar.ax.tick_params(labelsize=7)
# mark the discrimination threshold on the colourbar
cbar.ax.axhline(THRESH, color="0.15", lw=0.8, ls="--")

ax.set_xlim(-0.5, len(mg_totals) - 0.5)
ax.set_ylim(len(ROW_ORDER) - 0.5, -0.5)
fig.subplots_adjust(left=0.15, right=0.99, top=0.90, bottom=0.16)

os.makedirs(os.path.dirname(OUT), exist_ok=True)
fig.savefig(OUT, dpi=300, bbox_inches="tight")
print("Wrote", OUT)
print(f"S range in figure: [{smin:.2f}, {smax:.2f}] C ; colour scale vmin/vcenter/vmax = {vmin}/{THRESH}/{vmax} (top saturates, exact S annotated)")
print(f"Suggested Mg column boxed at {SUGG_MG:.1f} mM")
