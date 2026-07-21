#!/usr/bin/env node
/* timing.js — tempo de desenho do motor LAMPrime (#8).
 * Mede o tempo de designLAMP() (o MESMO motor do app.js, importado de
 * crossreact.js) sobre os alvos de DESENHO versionados, com os parametros
 * default. Reproduzivel: rode na sua maquina para obter o numero canonico do
 * manuscrito (o valor absoluto e dependente de hardware).
 *   node tools/timing.js            # 5 repeticoes (default), reporta a mediana
 *   REPS=11 node tools/timing.js    # mais repeticoes p/ estabilizar a mediana
 */
'use strict';
const path = require('path');
const cr = require('./crossreact.js');

// Alvos de DESENHO (nao os genomas de fundo usados na triagem de especificidade).
const TARGETS = [
  ['A. marginale msp1b (sintetico)',        'amarginale_msp1b_synthetic.fasta'],
  ['B. bovis 18S (L19077)',                 'bbovis_18s_L19077.fasta'],
  ['B. bovis cytB (NC009902) AT-rico',      'bbovis_cytb_NC009902.fasta'],
  ['M. tuberculosis IS6110 (X17348)',       'mtb_is6110_X17348.fasta'],
  ['SARS-CoV-2 N (NC045512:28274-28720)',   'sarscov2_N_NC045512.2_28274-28720.fasta'],
  ['P. falciparum 18S (M19172) AT-rico',    'pfalciparum_18s_M19172.fasta'],
];

const REPS = Math.max(1, parseInt(process.env.REPS || '5', 10));
const P = cr.defaultParams();

function median(a) {
  const b = a.slice().sort((x, y) => x - y), n = b.length;
  return n % 2 ? b[(n - 1) / 2] : (b[n / 2 - 1] + b[n / 2]) / 2;
}

console.log('timing.js — tempo de desenho do motor LAMPrime (#8), parametros default (janelas 64-66 / 59-61 C)');
console.log('  metodo: designLAMP() do app via crossreact.js; %d repeticoes por alvo, reporta a mediana', REPS);
console.log('  NOTA: tempo absoluto e dependente de HARDWARE — rode na sua maquina para o numero canonico do paper.\n');
console.log('  ' + 'alvo'.padEnd(40) + '   nt   GC%   cand  sets   pen   t_med(s)');
console.log('  ' + '-'.repeat(40) + '  ----  ----  -----  ----  ----  --------');

for (const [name, file] of TARGETS) {
  const tgt = cr.loadFasta(path.join(cr.DATA, file));
  if (!tgt || !tgt.seq) { console.log('  ' + name.padEnd(40) + '   (FASTA ausente: ' + file + ')'); continue; }
  let des, times = [];
  for (let i = 0; i < REPS; i++) {
    const t0 = process.hrtime.bigint();
    des = cr.designLAMP(tgt.seq, P);
    const t1 = process.hrtime.bigint();
    times.push(Number(t1 - t0) / 1e9);
  }
  const nsets = (des.sets && des.sets.length) || 0;
  console.log('  ' + name.padEnd(40) + '  ' +
    String(tgt.seq.length).padStart(4) + '  ' +
    cr.gcPct(tgt.seq).toFixed(1).padStart(4) + '  ' +
    String(des.totalCandidates || 0).padStart(5) + '  ' +
    String(nsets).padStart(4) + '  ' +
    (nsets ? des.sets[0].penalty.toFixed(1) : '-').padStart(4) + '  ' +
    median(times).toFixed(2).padStart(8));
}
console.log('\n  (cand = conjuntos candidatos avaliados; sets = validos sob os parametros default; pen = penalidade do topo)');
