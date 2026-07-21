# LAMPrime — Notas de revisão: *Analytical Biochemistry* → *Biochemistry and Biophysics Reports* (BBRep)

> **Para que serve este arquivo.** Dar **uma narrativa única e coerente** das mudanças entre a versão
> submetida à *Analytical Biochemistry* (AB) e a versão que irá para *Biochemistry and Biophysics
> Reports* (BBRep) — para a revisão ser lida como um **fortalecimento deliberado do método**, não como
> colcha de retalhos. Cada mudança abaixo aparece **uma vez**, dentro de um tema, com o **porquê**.

> ⚠️ **Limite honesto.** O texto do manuscrito **não está neste repositório** (fica fora pela allowlist
> do `.gitignore`), então **não há diff literal do texto** aqui. Este documento está ancorado em
> evidência do repo: histórico git, `CHANGELOG.md` e o código. Onde eu não sei se algo já estava na
> submissão AB, deixei uma caixa **`AB? [ ]`** para você marcar — assim o delta fica preciso.

---

## 0. Uma coisa de cada vez — o mapa em 5 temas

Toda a sequência de commits e scripts se resume a **cinco linhas de melhoria**. Se o manuscrito seguir
esta espinha, não vira frankenstein:

1. **Motor de Tm mais rigoroso e unificado** — um único modelo termodinâmico coerente, agora validado
   por terceiros e com incerteza quantificada.
2. **Otimização de Mg²⁺** — a varredura de Mg²⁺ que sugere a concentração de trabalho pela margem de
   segurança contra off-targets. (Provável contribuição *nova* de destaque para o BBRep.)
3. **Triagem de especificidade in silico** — a aba de especificidade (semente 3′ + extensão) e o
   benchmark de reatividade cruzada, agora com métricas quantitativas (sens/spec/ROC).
4. **Validação & reprodutibilidade** — concordância offline com 3 conjuntos publicados, benchmark
   independente (Biopython) e um alvo AT-rico de estresse.
5. **Ajuste de veículo (AB → BBRep)** — enquadramento/escopo/tamanho para o BBRep (open-access, APC).

O resto deste arquivo detalha cada tema. **Leia a §1 primeiro** (a narrativa); a §3 é o inventário.

---

## 1. A narrativa em uma página (o "porquê")

A versão AB apresentava o LAMPrime como **ferramenta analítica de desenho de primers LAMP no navegador**,
com um motor termodinâmico (vizinho-mais-próximo, SantaLucia 1998) e concordância com ensaios publicados.

A versão BBRep mantém esse núcleo e o **fortalece em três frentes que respondem a fraquezas típicas
apontadas em revisão analítica**:

- **Robustez do modelo.** Antes o Mg²⁺ livre era tratado de forma **inconsistente** entre o motor de
  desenho e a varredura de especificidade; agora é **um único modelo de quelação** (Ka=3×10⁴), e o Tm foi
  **validado contra uma implementação independente (Biopython)** — concordância ≤ 0,09 °C. A escolha de
  parâmetros NN (1998 vs 2004) foi mostrada **irrelevante** para o Tm (robustez), deslocando a incerteza
  para o modelo de sal/Mg, que passou a ser explícito.
- **Especificidade quantitativa.** A triagem de reatividade cruzada deixou de ser só qualitativa
  (flag/não-flag) e passou a ter **métricas (sensibilidade/especificidade/ROC)**, com a saída
  PrimerExplorer (`.eds`) como **referência**.
- **Generalização.** Um alvo **AT-rico** (*P. falciparum* 18S) foi incluído para demonstrar que o motor
  funciona **fora da faixa usual de GC**.

Isso é o que transforma "mais uma ferramenta web" numa **contribuição metodológica validada** — o tom
adequado ao BBRep.

---

## 2. Mudança de veículo: AB → BBRep

| | *Analytical Biochemistry* | *Biochemistry and Biophysics Reports* |
|---|---|---|
| Perfil | Métodos analíticos, escopo mais restrito | Relatos curtos, open-access, **APC** |
| Implicação p/ o texto | Ênfase em validação analítica formal | Formato **conciso**; destacar o **achado/contribuição** e a reprodutibilidade |
| Ação no manuscrito | — | Enxugar; mover detalhe de método para Suplementar; título/abstract voltados ao "reports" |

> **Nota:** não registro aqui o *motivo* da mudança de veículo (não tenho os pareceres da AB). Se houver
> carta de decisão/pareceres, eles guiam o enquadramento — me passe que eu incorporo.

---

## 3. Inventário das variações por tema

Legenda de status: **base** = fundação do projeto · **novo** = adicionado nesta evolução ·
**alterado** = comportamento mudou. Marque **`AB? [x]`** se já constava na submissão AB.

> **Âncora travada (2026-07-21).** Delta confirmado: **AB = v1.3 (`b3861af`, 24/06/2026)** — ver §4 e
> `PROJECT_STATE.md`. Caixas preenchidas por **ancestralidade git** (`git merge-base --is-ancestor … b3861af`):
> **`AB? [x]`** = já constava na submissão AB (commit ≤ v1.3); **`AB? [ ]`** = **delta pós-AB** (commits de
> 2026-07-16). Como todas as caixas foram travadas, uma caixa vazia significa "confirmado fora da AB", não "a decidir".

### 3.1 Motor termodinâmico (Tm)
| Componente | O que é | Status | Por que fortalece | Evidência |
|---|---|---|---|---|
| NN SantaLucia 1998 + sal | Tm por vizinho-mais-próximo, correção de sal | base `AB? [x]` | núcleo do método | `app.js tmNN`, `concordance.py` |
| Mg²⁺→Na⁺ (von Ahsen 2001) | equivalente monovalente de Mg²⁺ | base `AB? [x]` | condição NEB realista | `app.js`, `README` |
| **Unificação do Mg²⁺ livre (#6)** | `tmNN` passa a usar quelação `freeMgM` (Ka=3e4), como a varredura | **alterado** `AB? [ ]` | remove incoerência entre caminhos; corrige colapso do Tm na estequiometria | commit `4e96ed9`, `CHANGELOG v1.4` |
| **Incerteza de Tm (#12)** | 1998 vs 2004 (=robustez, Δ=0); sensibilidade sal/Mg; ±2 °C | **novo** `AB? [ ]` | quantifica incerteza — resposta clássica de revisor | `tools/tm_uncertainty.py` |
| **Benchmark independente (#11)** | Tm vs Biopython (NN4) — acordo ≤ 0,09 °C | **novo** `AB? [ ]` | validação por terceiro | `tools/benchmark_independent.py` |

### 3.2 Otimização de Mg²⁺ (varredura → heatmap)
| Componente | O que é | Status | Por que fortalece | Evidência |
|---|---|---|---|---|
| Varredura Mg²⁺ × especificidade | heatmap por primer ao longo do MgSO₄ | novo (v1.2) `AB? [x]` | escolhe [Mg²⁺] de trabalho | commit `2b63996`, `tools/mgspec.mjs` |
| Owczarzy 2008 + Allawi/Peyret | correção divalente + NN de mismatch interno | novo (v1.2) `AB? [x]` | Tm de off-target fisicamente correto | `app.js` (bloco Mg-spec) |
| Margem de segurança (T_reação − Tm_off) | heatmap colore pela segurança do off-target | **alterado** (v1.3) `AB? [x]` | sugere Mg que mantém on-target funcional e off-target abaixo da reação | commit `c981bf3`, `CHANGELOG v1.3` |

### 3.3 Triagem de especificidade
| Componente | O que é | Status | Por que fortalece | Evidência |
|---|---|---|---|---|
| Aba de Especificidade | semente 3′ exata + extensão k-mer/alinhamento; FASTA/NCBI | novo `AB? [x]` | prevê reatividade cruzada in silico | commit `402e016`, `README` |
| Presets de reatividade cruzada | *A. marginale* vs *A. centrale*; *B. bovis* vs *B. bigemina* | novo (v1.1) `AB? [x]` | benchmark reprodutível | commit `a7fdeee`, `tools/crossreact.js` |
| **Métricas sens/spec/ROC (#13)** | especificidade 0,980; sensibilidade do screen 1,000; pAUC parcial | **novo** `AB? [ ]` | torna a especificidade *mensurável*; `.eds` = referência (hook pronto) | `tools/specificity_metrics.py` |

### 3.4 Validação & reprodutibilidade
| Componente | O que é | Status | Por que fortalece | Evidência |
|---|---|---|---|---|
| `concordance.py` offline | re-pontua conjuntos publicados; FASTAs versionados | base `AB? [x]` | reprodutível sem rede | `tools/concordance.py`, `tools/data/` |
| 3 conjuntos publicados | *A. marginale* msp1b; SARS-CoV-2 S; *M. tuberculosis* IS6110 | base `AB? [x]` | ancoragem experimental | `LEGENDS.md` |
| `concordance.py` importável | execução sob `__main__`; fonte única p/ os outros scripts | **novo** `AB? [ ]` | evita duplicação de sequências/motor | commit `3a7eef6` |
| Correção ano Giglioti 2019→2018 | consistência com README/LEGENDS | **alterado** `AB? [ ]` | erro de citação corrigido | commit `3a7eef6` |
| **Painel de Tm por %GC (#11)** | 13 conjuntos publicados por **outras ferramentas** (PrimerExplorer V3/V4/V5, NEB), 12 organismos, ~30–67% GC; Tm LAMPrime vs BioPython, QC por mapeamento | **novo** `AB? [ ]` | validação independente **ampla** (r=0,99999; ≤0,153 °C) — figura complementar | `tools/gc_concordance.py`, `tools/plot_gc_concordance.py`, `figS_tm_concordance_gc.png` |

### 3.5 Alvos
| Alvo | Papel | Status | Evidência |
|---|---|---|---|
| *A. marginale* msp1b, *B. bovis* 18S/cytB, *M. tuberculosis* IS6110, SARS-CoV-2 N/S | desenho/validação | base `AB? [x]` | `tools/data/` |
| **_P. falciparum_ 18S (M19172.1) — AT-rico (#9)** | estresse de baixo GC (AT 64,4%) | **novo** | `tools/data/pfalciparum_18s_M19172.fasta`, usado no benchmark #11 |

---

## 4. O que é genuinamente NOVO nesta rodada (2026-07-16)

Tudo abaixo está **commitado** na branch `claude/pmm-active-memory-reload-xcptpv` (PR #2) e **verificado**:

- **#6** unificação do Mg²⁺ livre no motor de Tm (impacto desprezível no ponto padrão; corrige a
  estequiometria). — `4e96ed9`
- **#12** `tm_uncertainty.py` (incerteza de Tm; 1998 vs 2004 = robustez). — `3a7eef6`
- **#11** `benchmark_independent.py` (Tm vs Biopython; acordo ≤ 0,09 °C). — `225b40d`
- **#9** alvo AT-rico *P. falciparum* 18S. — `225b40d`
- **#13** `specificity_metrics.py` — especificidade 0,980; sensibilidade do screen 1,000; pAUC parcial
  (ROC definitiva aguarda os `.eds`). — commit desta rodada

---

## 5. Pendências para fechar a submissão BBRep

- [x] **Ancorar o delta**: confirmado **AB = v1.3 (`b3861af`, 24/06/2026)**; caixas `AB?` da §3 preenchidas por ancestralidade git (commits de 2026-07-16 = delta pós-AB). ✅ 2026-07-21
- [ ] **Sincronizar `manuscript_PT.md`** com os itens da §4 (o texto não está no repo — me forneça).
- [ ] **#13** finalizar métricas + **ROC completa** com os `.eds` de referência do autor.
- [x] **#11** validação de Tm por **painel de %GC** ✅ 2026-07-21: `tools/gc_concordance.py` +
  `tools/plot_gc_concordance.py` — **13 conjuntos publicados por outras ferramentas** (PrimerExplorer
  V3/V4/V5, NEB), **12 organismos**, **~30–67 % GC**, todos QC-mapeados; 73 oligos, **≤ 0,153 °C**,
  r = 0,99999. Figura complementar `tools/figures/figS_tm_concordance_gc.png`. (Conjuntos **PrimerDigital**
  específicos seguem bem-vindos no `EXTRA_SETS`, mas a validação multi-ferramenta por GC já não depende deles.)
- [ ] **#8** timing na máquina do autor (não executável aqui).
- [ ] **build (`build_paper`)** e **#15 "derobotizar"** o texto — dependem do manuscrito.
- [ ] Enquadramento **AB→BBRep** (§2): enxugar para formato *reports*; conferir APC.

---

## 6. Anexo — linha do tempo (git)

- **2026-06-16** fundação: app LAMPrime + `concordance.py` (`850861b`); i18n, allowlist.
- **2026-06-17–19** concordância offline; alvos *B. bovis*, IS6110, SARS-CoV-2 N; aba de Especificidade (`402e016`).
- **2026-06-23** v1.1 presets de reatividade cruzada + `crossreact.js`; v1.2 varredura de Mg²⁺; correções (validações 2→3, Giglioti).
- **2026-06-24** v1.3 heatmap por margem de segurança (`c981bf3`); rótulos neutros de dNTP — **`origin/main` (v1.3)**.
- **2026-07-16** esta rodada: #12, #6, versionamento do estado, #11+#9 (#13 em curso).

<!-- Documento de navegação/meta (não é o manuscrito). Preencha as caixas AB? para travar o delta. -->
