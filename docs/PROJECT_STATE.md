# PROJECT_STATE.md — LAMPrime

> ⚠️ **Reconstruído em 2026-07-16** a partir do ditado do autor + estado verificado do repositório.
> O `PROJECT_STATE.md` original **não estava versionado** em `luizdione/lamprime`, e este container é
> um clone novo e efêmero — qualquer `PROJECT_STATE.md`/log de sessão que existisse apenas na árvore de
> trabalho de uma sessão anterior foi perdido ao reciclar o container. **Para não se perder de novo, este
> arquivo precisa ser commitado no repositório.**

## Sessão 2026-07-16
Objetivo: retomar o backlog na ordem definida, preservando decisões e pendências.

## Backlog (ordem de execução)

### #11 — `tools/benchmark_independent.py`
Tm independente (BioPython) sobre os conjuntos **LAMPrime / publicados / PrimerDigital**.
- Status: ✅ **FEITO** (2026-07-16). Cruza `concordance.tm()` (LAMPrime) vs BioPython `Tm_NN`
  (tabela NN4 = SantaLucia & Hicks 2004) nas mesmas condições (conc. efetiva 12,5 nM alinhada).
- Resultado: conjuntos publicados concordam com o BioPython (salt Owczarzy 2004) em **≤ 0,09 °C**
  (média 0,07) → **núcleo NN validado por terceiro**. Com salt Owczarzy 2008 a divergência sobe a
  ~2,4 °C (diferença de **modelo de sal**, não do NN — documentado).
- Inclui o regime AT-rico do #9 (janelas do 18S de *P. falciparum*): acordo **≤ 0,31 °C** (GC 15–60%).
- Conjuntos **PrimerDigital**: slot `EXTRA_SETS` no script; adicionar quando o autor fornecer.
- BioPython é opcional em runtime: se ausente, o script imprime instrução de instalação e sai sem erro.

### #12 — `tools/tm_uncertainty.py`
Incerteza de Tm: parâmetros NN **SantaLucia 1998 vs 2004**.
- Status: ✅ **FEITO** (2026-07-16). Script offline/determinístico (stdlib), reutiliza motor+primers de `concordance.py`.
- Resultado-chave: os NN de Watson–Crick do conjunto *unified* de SantaLucia 1998 (PNAS 95:1460) são
  **idênticos** aos de SantaLucia & Hicks 2004 (Annu Rev 33:415, Tab. 1) → **dTm(1998→2004) = 0,000 °C**
  por construção (verificado). É um resultado de **robustez** para a validação analítica do manuscrito.
- A incerteza prática de Tm é dominada por: (b) modelo de sal/Mg²⁺ (remover 8 mM Mg → ~−9,7 °C, mediana)
  e (c) acurácia agregada do modelo NN (±2 °C, SantaLucia & Hicks 2004, configurável `--sigma-pred`).
- Monte Carlo opcional (`--montecarlo REL_SIGMA`): σ relativo nos NN é **suposição do usuário**; perturba
  ΔH/ΔS de forma independente ⇒ **superestima** a variância (ignora compensação entalpia–entropia). Rótulo honesto no código.
- Pré-requisito entregue: `concordance.py` **refatorado para ser importável** (execução sob `if __name__=='__main__'`),
  saída idêntica à baseline exceto a correção do ano (verificado por diff).

### #13 — métricas de especificidade sens/spec/ROC
ROC **parcial até os `.eds` do autor** (referência).
- Status: ✅ **FEITO** (2026-07-16). `tools/specificity_metrics.py` reproduz o screen do app (semente 3′ +
  extensão gap-free, duas fitas); verdade-terreno por identidade de sequência (primer deve parear o próprio
  alvo, não outros organismos).
- Resultado (ponto de operação semente 13, maxMM 2): **especificidade 0,980**; **sensibilidade do screen 1,000**
  (os 2 primers que não pareiam a referência — SARS-CoV-2 B3, MTB B1c — são as **variantes primer-vs-referência**
  já sinalizadas por `concordance.py` como NAO ACHADO, não falhas do screen).
- Cross-hits reais e esperados: primers do S de SARS-CoV-2 batem em **RaTG13** (~96% idêntico). *M. bovis*
  excluído dos negativos de IS6110 (deteção esperada — complexo MTB).
- ROC: o screen é um **filtro** ancorado por semente → FPR satura < 1; reporto **pAUC parcial** (faixa de FPR +
  TPR médio) em vez de AUC[0,1]. **ROC definitiva exige os `.eds`** (hook `ROC_REFERENCE` no script).

### #6 — unificar Mg livre (`freeMgM`, Ka=3e4) no `app.js`
- Status: ✅ **FEITO** (2026-07-16). `freeMgM` promovida a helper compartilhado antes de `tmNN`;
  `tmNN` agora usa `freeMgM(Mg, dNTP, 3e4)` (quelação 1:1) no lugar de `max(0, Mg − dNTP)`.
  Espelhado em `concordance.py` (`free_mg_mM`) e em `tm_uncertainty.py` para manter a concordância.
- Impacto verificado: no default (Mg 8, dNTP 1.4) o Mg livre vai 6,600 → 6,607 mM → **desprezível**
  (concordance mudou 1 valor: LF 60,6 → 60,7 °C). O ganho aparece na **estequiometria** (Mg ≈ dNTP),
  onde o modelo cru zerava o Mg livre e derrubava o Tm; agora dá um Mg livre realista (ex.: Mg 1,4 =
  dNTP 1,4 → F3 = 55,45 °C em vez de colapsar).
- Registrado no CHANGELOG (v1.4).

### #8 — timing na máquina do autor
- Status: ❌ **NÃO EXECUTÁVEL AQUI** (medição depende do hardware do autor).

### #9 — alvo AT-rico *P. falciparum* 18S
- Status: ✅ **FEITO** (2026-07-16). FASTA `tools/data/pfalciparum_18s_M19172.fasta` (M19172.1, 2090 nt,
  **AT 64,4% / GC 35,6%**) baixado do NCBI e versionado como asset offline (como os demais alvos).
- Wiring: usado como **regime AT-rico** no benchmark independente (#11) — valida o motor de Tm fora da
  faixa usual de GC (acordo ≤ 0,31 °C). Sem conjunto de primers publicado embarcado (não fabricado);
  se o autor tiver um conjunto LAMP de 18S de *P. falciparum*, entra em `concordance.py`/`EXTRA_SETS`.

### NEB / PrimerExplorer V5
- Status: pendente — falta detalhar o que ainda precisa ser finalizado.

### Sync `manuscript_PT.md`
- Status: **BLOQUEADO** — `manuscript_PT.md` ❌ não está no repo.

### build (`build_paper`)
- Status: **BLOQUEADO** — script `build_paper` ❌ não está no repo.

### #15 — "derobotizar"
- Status: **BLOQUEADO** — depende do manuscrito.

## Decisões preservadas (rótulos conforme ditado — detalhes a confirmar pelo autor)
- **BBRep/APC** — (detalhe não recuperável neste container; a confirmar).
- **Validação analítica** — (idem; a confirmar).
- **`.eds` = referência** — a saída PrimerExplorer do autor é o padrão-ouro para a ROC (#13).

## Pendências / itens em aberto
- ✅ **RESOLVIDO:** `tools/concordance.py` dizia **"Giglioti 2019"** (linhas 81, 108, 177) contra
  README/LEGENDS já em **2018** (commits `c5326cc`/`b74b124`). Corrigido para 2018 (2026-07-16).
- Inputs ausentes que bloqueiam o backlog: **BioPython** (não instalado), conjuntos **PrimerDigital**,
  `.eds` (referência da ROC), `manuscript_PT.md`, `build_paper`.

## Decisões preservadas (agora decifradas via arquivos do AB, 2026-07-16)
- **BBRep/APC** = alvo **Biochemistry and Biophysics Reports** (open-access, APC).
- **Validação analítica** = veículo anterior **Analytical Biochemistry** (submissão AB, carta de 24/06/2026 = v1.3).
- **`.eds` = referência** — saída PrimerExplorer do autor, padrão-ouro da ROC (#13).
- **Âncora do delta confirmada: AB = v1.3** (`b3861af`). Tudo de 2026-07-16 é pós-AB.

## Follow-up pós-merge v1.4 (2026-07-16) — decisões do autor: Giglioti **2018**; incluir **P. falciparum**
- **`crossreact.js`**: atualizado para o Mg da quelação (#6) + tornado importável (`require.main`/`module.exports`).
  ⚠️ **Achado**: com o motor #6, o **Set #1** do B. bovis 18S muda de região (pos ~1387–1633 → ~399–658; penalidades
  do topo empatadas em ~0,1) e a **Tabela 4 passa de 4/8 → 3/8**. Mensagem qualitativa intacta; número é knife-edge.
  **Recomendação:** reportar a reatividade cruzada **sobre os top-N conjuntos** (robusto ao empate), não só o Set #1.
- **`pfalciparum_design.js`** (#9): desenho AT-rico via motor do app. Resultado: penalidade **1,2**; F2–B2 **175 nt**;
  1106 candidatos; 5,0 s. Núcleo nas janelas de Tm; **alças AT-ricas** são o gargalo (LB GC 22%, Tm 53,9 °C;
  LF GC 30%, Tm 57,3 °C) — 2º caso AT-rico (além do B. bovis cytb), reforça que o desafio AT está nas alças.
- **Giglioti = 2018** (decisão do autor): repo já 2018; **manuscrito** (que dizia 2019) a alinhar para 2018.

<!-- Fim. -->

