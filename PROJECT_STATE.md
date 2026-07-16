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
- Status: **BLOQUEADO PARCIAL**
- BioPython: **não instalado** neste container (`import Bio` falha) — requer pip/rede.
- Conjuntos publicados: ✅ disponíveis (dicts em `tools/concordance.py`: `amarginale_msp1b`, `sarscov2`, `mtb_is6110`).
- Conjuntos LAMPrime: ✅ deriváveis pelo próprio motor.
- Conjuntos **PrimerDigital**: ❌ não estão no repo — precisam ser fornecidos.

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
- Status: **BLOQUEADO PARCIAL** — os `.eds` do autor (saída PrimerExplorer = padrão-ouro) ❌ não estão no repo.

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
- Status: **PARCIAL** — a sequência 18S de *P. falciparum* ❌ não está em `tools/data/` (os 18S presentes
  são de *B. bovis*/*B. bigemina*). Buscar no NCBI ou fornecer accession.

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

## Decisões preservadas com detalhe pendente
- **BBRep/APC**, **validação analítica** — fornecer contexto quando possível.

<!-- Fim do estado reconstruído. Preencher os detalhes das "decisões preservadas" quando o autor os fornecer. -->
