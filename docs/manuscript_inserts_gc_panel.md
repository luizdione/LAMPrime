# Inserções para o manuscrito — painel de concordância de Tm por %GC (#11)

> **O que é este arquivo e por que ele existe.** O texto do manuscrito
> (`manuscript_PT.md`) **não está neste repositório** — fica de fora pela allowlist
> do `.gitignore`, e este container é um clone efêmero. Portanto **não é possível
> "buildar", editar ou auditar o artigo aqui**, nem rodar um `/desrobotizar_artigo`
> (não há manuscrito, não há `build_paper`, e esse comando não existe neste ambiente).
>
> Em vez de inventar um manuscrito (o que seria fabricar conteúdo científico sobre a
> sua submissão real), este arquivo entrega o **delta pronto para colar**: os trechos
> de **Métodos, Resultados e Discussão** que o novo painel de dados adiciona, mais as
> legendas da figura e da tabela suplementar. Todos os números vêm dos dados reais
> (`tools/gc_concordance.py` → `tools/data/gc_concordance.csv`), não de estimativa.
>
> **Como usar:** cole cada bloco na seção correspondente do `manuscript_PT.md`,
> ajuste a numeração de Figura/Tabela/citação entre colchetes, e — quando você
> colar o manuscrito aqui (ou me der o `build_paper`) — eu faço o build, a auditoria
> e a desrobotização do texto de verdade, sobre o arquivo real.

Âncoras de dados (reais, 2026-07-21): **13 conjuntos** LAMP publicados, **12 organismos**,
desenhados por **PrimerExplorer V3/V4/V5 e NEB** (nenhum pelo LAMPrime), **~30–67 % de GC do
amplicon**; **73 oligos**; |ΔTm| **média 0,069 °C**, **mediana 0,072 °C**, **máx. 0,153 °C**;
**Pearson r = 0,99999**. Figura: `tools/figures/figS_tm_concordance_gc.png`. Tabela: `docs/supp_table_primer_panel.md` (S1).

---

## 1. MÉTODOS — inserir (ex.: em "Validação do modelo termodinâmico")

> Validação independente da Tm ao longo do conteúdo de GC. Para verificar que o modelo
> termodinâmico do LAMPrime não depende de uma implementação particular nem da composição de
> bases do alvo, a temperatura de melting (Tm) de cada oligo foi recalculada por uma implementação
> independente — BioPython, função `Tm_NN`, com a tabela de vizinhos-mais-próximos NN4 de
> SantaLucia & Hicks (2004) e a correção de sal de Owczarzy et al. (2004) — sob as mesmas condições
> do LAMPrime (Na⁺ 50 mM, Mg²⁺ 8 mM, dNTP 1,4 mM; concentração efetiva de oligo 12,5 nM). O painel
> de teste reuniu **13 conjuntos de primers LAMP publicados e desenhados por ferramentas independentes
> do LAMPrime** (Eiken PrimerExplorer V3/V4/V5 ou NEB), abrangendo **12 organismos** e uma faixa de
> conteúdo de GC do amplicon de **~30 a 67 %** (Tabela Suplementar S1). As sequências dos primers foram
> transcritas *verbatim* das fontes originais; cada conjunto foi ancorado ao alvo depositado no GenBank
> por mapeamento exato da semente 3′ com extensão sem lacunas, confirmando que os seis componentes
> formam um amplicon LAMP compacto (~180–240 nt) — o conteúdo de GC reportado é o do amplicon F3–B3.
> Os cálculos são reprodutíveis por `tools/gc_concordance.py` (concordância) e
> `tools/plot_gc_concordance.py` (figura); os valores por oligo constam de `tools/data/gc_concordance.csv`.

---

## 2. RESULTADOS — inserir (ex.: após a concordância com conjuntos publicados)

> Concordância da Tm com uma implementação independente ao longo do GC. Nos 13 conjuntos (73 oligos),
> a Tm do LAMPrime concordou com a implementação independente (BioPython, NN4/Owczarzy 2004) com
> diferença absoluta **mediana de 0,07 °C** e **máxima de 0,15 °C** (média 0,069 °C; Pearson
> **r = 0,99999**; Figura [X], painel A). A concordância manteve-se **plana ao longo de toda a faixa
> de GC do amplicon (~30–67 %)**, sem tendência associada ao conteúdo de bases (Figura [X], painel B),
> e homogênea entre os 12 organismos — de alvos AT-ricos (*cox1* mitocondrial de *Plasmodium vivax*,
> ~30 % GC; SREHP de *Entamoeba histolytica*) a alvos GC-ricos (*rpoB* de *Mycobacterium kansasii*,
> ~67 % GC; *ecfX* de *Pseudomonas aeruginosa*). Como todos os conjuntos foram desenhados por
> ferramentas independentes do LAMPrime, a concordância reflete o núcleo termodinâmico compartilhado,
> e não uma particularidade do próprio desenhador.

---

## 3. DISCUSSÃO — inserir (ex.: onde se discute a acurácia/robustez da Tm)

> A validação cruzada acima delimita a origem da incerteza de Tm no LAMPrime. Como o núcleo de
> vizinhos-mais-próximos concorda com uma implementação independente em **≤ 0,15 °C** ao longo de
> ~30–67 % de GC e de 12 organismos, a diferença entre os dois programas é desprezível frente à
> acurácia intrínseca do próprio modelo NN (da ordem de ±2 °C; SantaLucia & Hicks, 2004). A incerteza
> prática de Tm é, portanto, dominada não pelo cálculo NN, mas pela escolha do modelo de correção de
> sal/Mg²⁺ — substituir a correção de Owczarzy (2004) pela de Owczarzy (2008), por exemplo, desloca a
> Tm de forma sistemática em ~2 °C, sem alterar o núcleo NN [remeter à seção de incerteza de Tm]. Que
> a concordância não varie com o conteúdo de GC é especialmente relevante para um desenhador de primers
> LAMP, cujos conjuntos combinam alvos de composição de bases muito distinta: o motor mostra-se robusto
> tanto no regime AT-rico — em que alças de baixa complexidade estressam o cálculo — quanto no regime
> GC-rico. Essa robustez, verificada por uma implementação de terceiros e sobre ensaios
> experimentalmente publicados, reforça a validade analítica do método.

---

## 4. LEGENDA DA FIGURA (complementar / principal)

**PT —** **Figura [X]. Concordância da temperatura de melting do LAMPrime com uma implementação
independente ao longo do conteúdo de GC.** Painel de 13 conjuntos de primers LAMP publicados e
desenhados por ferramentas independentes do LAMPrime (Eiken PrimerExplorer V3/V4/V5 ou NEB), 12
organismos, cobrindo ~30–67 % de GC do amplicon. **(A)** Tm do LAMPrime *versus* Tm independente
(BioPython `Tm_NN`; NN4 de SantaLucia & Hicks 2004; sal de Owczarzy 2004) para cada oligo, sobre a
linha de identidade (n = 73 oligos; r de Pearson = 0,99999; |ΔTm| máx. = 0,15 °C). **(B)** ΔTm
(LAMPrime − independente) *versus* GC do amplicon: a concordância é plana e apertada (|ΔTm| ≤ ~0,15 °C,
majoritariamente dentro de ±0,1 °C) em toda a faixa. Cor = GC do amplicon; losangos = média por ensaio.

**EN —** **Figure [X]. Agreement of the LAMPrime melting temperature with an independent implementation
across GC content.** Panel of 13 published LAMP primer sets designed by tools independent of LAMPrime
(Eiken PrimerExplorer V3/V4/V5 or NEB), 12 organisms, spanning ~30–67 % amplicon GC. **(A)** LAMPrime
Tm versus independent Tm (BioPython `Tm_NN`; NN4, SantaLucia & Hicks 2004; Owczarzy 2004 salt) per oligo,
on the identity line (n = 73 oligos; Pearson r = 0.99999; max |ΔTm| = 0.15 °C). **(B)** ΔTm
(LAMPrime − independent) versus amplicon GC: agreement is flat and tight (|ΔTm| ≤ ~0.15 °C, mostly
within ±0.1 °C) across the range. Colour = amplicon GC; diamonds = per-assay mean.

Arquivo: `tools/figures/figS_tm_concordance_gc.png` (300 dpi).

---

## 5. LEGENDA DA TABELA SUPLEMENTAR

**Tabela Suplementar S1. Painel de primers LAMP usado na validação cruzada de Tm.** Para cada um dos
13 conjuntos: organismo, gene-alvo e acesso GenBank, **plataforma de desenho declarada no artigo de
origem** (PrimerExplorer V3/V4/V5 ou NEB), tamanho e %GC do amplicon, diferença máxima de Tm em relação
à implementação independente, e referência (com DOI). A subtabela S1b lista as **sequências dos primers
(5′→3′)** com comprimento, %GC e Tm (LAMPrime e independente) por oligo. Fonte: `docs/supp_table_primer_panel.md`
(gerada por `tools/supp_table.py`).

---

## 6. Onde cada bloco entra (guia rápido)

| Bloco | Seção do manuscrito | Observação |
|---|---|---|
| §1 Métodos | Validação do modelo termodinâmico | logo após o benchmark independente (#11) já existente |
| §2 Resultados | Concordância / validação analítica | após a concordância com os 3 conjuntos publicados |
| §3 Discussão | Acurácia e robustez da Tm | conectar com a seção de incerteza (#12) |
| §4 Figura | figura complementar (ou principal, se couber) | renumerar |
| §5 Tabela S1 | material suplementar | renumerar |

> Ajustes pendentes (dependem de você): renumerar Figura/Tabela/citações; decidir se a figura entra
> como **principal** ou **suplementar**; incluir as referências novas na lista bibliográfica (os DOIs
> estão na Tabela S1). Quando você colar o `manuscript_PT.md`, eu integro esses blocos no texto real,
> rodo a auditoria e faço a desrobotização sobre o manuscrito de verdade.
