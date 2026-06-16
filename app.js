/* LAMP Primer Designer — v2 (algoritmo real de desenho de primers)
   Tm nearest-neighbor (SantaLucia 1998) + correção de sal e equivalente
   monovalente de Mg2+ (von Ahsen 2001); GC%; complexidade linguística (LC%);
   estabilidade ΔG das extremidades (critério Eiken ≤ -4 kcal/mol);
   enumeração das regiões F3/F2/F1/B1/B2/B3 com restrições de distância
   (PrimerExplorer V5 / NEB) e montagem de FIP/BIP/LF/LB.
   Refs: Notomi 2000; Nagamine 2002; Tomita 2008; SantaLucia 1998; von Ahsen 2001. */
(function() {
  const qs = (sel, el=document) => el.querySelector(sel);
  const qsa = (sel, el=document) => Array.from(el.querySelectorAll(sel));

  // Tabs
  const tabs = qsa('.lw-tab');
  const panels = qsa('.lw-panel');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.getAttribute('aria-controls');
      tabs.forEach(t => t.classList.toggle('is-active', t === tab));
      tabs.forEach(t => t.setAttribute('aria-selected', t === tab ? 'true' : 'false'));
      panels.forEach(p => p.classList.toggle('is-active', p.id === target));
    });
  });

  // Entrada
  const seqEl = qs('#alvo-seq');
  const idEl = qs('#alvo-id');
  const fileEl = qs('#file-fasta');
  const btnLimpar = qs('#btn-limpar');
  const btnExecutar = qs('#btn-executar');

  btnLimpar.addEventListener('click', () => {
    seqEl.value = '';
    idEl.value = '';
  });

  fileEl.addEventListener('change', async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const text = await file.text();
    // FASTA simples: remove headers '>' e concatena linhas
    const seq = text.split(/\r?\n/).filter(l => !l.startsWith('>')).join('').trim();
    seqEl.value = seq;
  });

  // Parâmetros
  const defaults = {
    tmF1cB1cLfLbMin: 64,
    tmF1cB1cLfLbMax: 66,
    tmF2B2F3B3Min: 59,
    tmF2B2F3B3Max: 61,
    tamF3B3Min: 18,
    tamF3B3Max: 23,
    tamLfLbMin: 18,
    tamLfLbMax: 23,
    loopSeq: 'TTTTTT',
    tamFipMin: 42,
    tamFipMax: 52,
    tamBipMin: 42,
    tamBipMax: 52,
    gcRange: '40-60',
    loops: 'auto',
    lcMin: 75,
    na: 50,
    mg: 8,
    dntp: 1.4,
    distF3F2: '0-60',
    distF2B2: '120-180',
    distF1B1: '0-60',
    distF2F1: '40-60',
    distB2B1: '40-60',
    penLimF1cB1c: 15,
    penLimF2B2: 20,
    penLimF3B3: 15,
    maxSets: 300
  };

  const els = {
    tmF1cB1cLfLbMin: qs('#tm-f1c-b1c-lf-lb-min'),
    tmF1cB1cLfLbMax: qs('#tm-f1c-b1c-lf-lb-max'),
    tmF2B2F3B3Min: qs('#tm-f2-b2-f3-b3-min'),
    tmF2B2F3B3Max: qs('#tm-f2-b2-f3-b3-max'),
    tamF3B3Min: qs('#tam-f3-b3-min'),
    tamF3B3Max: qs('#tam-f3-b3-max'),
    tamLfLbMin: qs('#tam-lf-lb-min'),
    tamLfLbMax: qs('#tam-lf-lb-max'),
    loopSeq: qs('#loop-seq'),
    tamFipMin: qs('#tam-fip-min'),
    tamFipMax: qs('#tam-fip-max'),
    tamBipMin: qs('#tam-bip-min'),
    tamBipMax: qs('#tam-bip-max'),
    gcRange: qs('#gc-range'),
    loops: qs('#loops'),
    lcMin: qs('#lc-min'),
    na: qs('#na'),
    mg: qs('#mg'),
    dntp: qs('#dnTP'),
    distF3F2: qs('#dist-f3-f2'),
    distF2B2: qs('#dist-f2-b2'),
    distF1B1: qs('#dist-f1-b1'),
    distF2F1: qs('#dist-f2-f1'),
    distB2B1: qs('#dist-b2-b1'),
    penLimF1cB1c: qs('#pen-lim-f1c-b1c'),
    penLimF2B2: qs('#pen-lim-f2-b2'),
    penLimF3B3: qs('#pen-lim-f3-b3'),
    maxSets: qs('#max-sets'),
  };

  const btnPadrao = qs('#btn-param-padrao');
  const btnAplicar = qs('#btn-aplicar-param');

  function restoreDefaults() {
    Object.entries(defaults).forEach(([k, v]) => {
      if (els[k]) {
        els[k].value = v;
        const ev = new Event('change', { bubbles: true });
        els[k].dispatchEvent(ev);
      }
    });
  }

  btnPadrao.addEventListener('click', restoreDefaults);
  // Normaliza sequência do loop para letras maiúsculas
  if (els.loopSeq) {
    els.loopSeq.addEventListener('input', () => {
      els.loopSeq.value = (els.loopSeq.value || '').toUpperCase().replace(/[^ATGC]/g, '');
    });
  }
  btnAplicar.addEventListener('click', () => {
    // Validação simples do LC%
    const v = parseFloat(els.lcMin.value);
    if (isNaN(v) || v < 70 || v > 90) {
      alert('Informe um valor de LC% entre 70 e 90.');
      els.lcMin.focus();
      return;
    }
    // Feedback simples
    btnAplicar.textContent = 'Aplicado!';
    setTimeout(() => btnAplicar.textContent = 'Aplicar parâmetros', 1000);
  });

  restoreDefaults();

  // Resultados (mock)
  const resEmpty = qs('#res-vazio');
  const resList = qs('#res-list');

  function toTabResultados() {
    const tabRes = qs('#tabbtn-res');
    tabRes.click();
  }

  function sanitizeDNA(seq) {
    return (seq || '').toUpperCase().replace(/U/g, 'T').replace(/[^ATGC]/g, '');
  }

  // ===================================================================
  // Bioinformática — Tm nearest-neighbor (SantaLucia 1998) + sais
  // Refs: Notomi 2000; Nagamine 2002; Tomita 2008; SantaLucia 1998;
  //       von Ahsen 2001 (eq. Mg→Na+); PrimerExplorer V5 (Eiken).
  // ===================================================================
  const COMP = { A:'T', T:'A', G:'C', C:'G', N:'N' };
  const comp = b => COMP[b] || 'N';
  const revComp = s => { let o=''; for (let i=s.length-1;i>=0;i--) o+=comp(s[i]); return o; };
  const gcPct = s => { const n=s.length||1; return 100*((s.match(/[GC]/g)||[]).length)/n; };

  // ΔH (kcal/mol) e ΔS (cal/mol·K) — pares vizinhos 5'XY3' (SantaLucia 1998 unificado)
  const NN_DH = {AA:-7.9,AT:-7.2,TA:-7.2,CA:-8.5,GT:-8.4,CT:-7.8,GA:-8.2,CG:-10.6,GC:-9.8,GG:-8.0,AC:-8.4,AG:-7.8,TC:-8.2,TG:-8.5,TT:-7.9,CC:-8.0};
  const NN_DS = {AA:-22.2,AT:-20.4,TA:-21.3,CA:-22.7,GT:-22.4,CT:-21.0,GA:-22.2,CG:-27.2,GC:-24.4,GG:-19.9,AC:-22.4,AG:-21.0,TC:-22.2,TG:-22.7,TT:-22.2,CC:-19.9};
  const R_GAS = 1.987;
  const TM_OLIGO_NM = 50; // conc. representativa para estimativa de Tm (ajustável)

  function tmNN(seq, naMM, mgMM, dntpMM, oligoNM) {
    seq = (seq||'').toUpperCase().replace(/[^ATGC]/g,'');
    const N = seq.length; if (N < 2) return NaN;
    let dH=0, dS=0;
    for (let i=0;i<N-1;i++){ const d=seq.substr(i,2); if(NN_DH[d]===undefined) return NaN; dH+=NN_DH[d]; dS+=NN_DS[d]; }
    const init = b => (b==='G'||b==='C') ? [0.1,-2.8] : [2.3,4.1];
    const [h5,s5]=init(seq[0]); const [h3,s3]=init(seq[N-1]); dH+=h5+h3; dS+=s5+s3;
    // Na+ equivalente incluindo Mg2+ livre (von Ahsen 2001): Na_eq = Na + 120*sqrt(Mg-dNTP)
    const mgFree = Math.max(0, (mgMM||0) - (dntpMM||0));
    const naEq = Math.max(1e-3, (naMM||0) + 120*Math.sqrt(mgFree)) / 1000; // mol/L
    const dS_salt = dS + 0.368*(N-1)*Math.log(naEq); // correção de sal SantaLucia 1998
    const C = (oligoNM||TM_OLIGO_NM)*1e-9;
    return (dH*1000) / (dS_salt + R_GAS*Math.log(C/4)) - 273.15;
  }

  // Complexidade linguística LC% — média geométrica da diversidade de k-mers (k=1..3)
  function linguisticComplexity(s) {
    s=(s||'').toUpperCase(); const N=s.length; if (N<3) return 100;
    let prod=1, terms=0;
    for (let k=1;k<=3;k++){
      const max=Math.min(Math.pow(4,k), N-k+1); if (max<=0) continue;
      const set=new Set(); for (let i=0;i+k<=N;i++) set.add(s.substr(i,k));
      prod *= set.size/max; terms++;
    }
    return 100*Math.pow(prod, terms?1/terms:1);
  }

  // ΔG (37°C) dos ~6 nt da extremidade — critério Eiken: extremidades de iniciação
  // devem ser estáveis (ΔG ≤ -4 kcal/mol). end: '3' (3') ou '5' (5').
  function endDeltaG(seq, end) {
    seq=(seq||'').toUpperCase().replace(/[^ATGC]/g,'');
    const w = (end==='5') ? seq.slice(0,6) : seq.slice(-6);
    if (w.length<2) return 0;
    let dH=0,dS=0;
    for (let i=0;i<w.length-1;i++){ const d=w.substr(i,2); if(NN_DH[d]===undefined) continue; dH+=NN_DH[d]; dS+=NN_DS[d]; }
    return dH - 310.15*(dS/1000); // kcal/mol
  }

  // ===== Estruturas secundárias: hairpin, homodímero, heterodímero =====
  // ΔG (kcal/mol) na TEMPERATURA DE REAÇÃO (~63 °C): só estruturas estáveis nessa
  // faixa (60–65 °C) atrapalham a LAMP. Modelo NN SantaLucia 1998. (Como o
  // LAMPrimers iQ, que exclui homo/heterodímeros — porém aqui de forma transparente.)
  const TREACT_K = 63 + 273.15;
  function segDG(seg) { // ΔG de um duplexo perfeitamente pareado de `seg`
    seg = (seg||'').toUpperCase(); const N = seg.length; if (N < 2) return 0;
    let dH=0, dS=0;
    for (let i=0;i<N-1;i++){ const d=seg.substr(i,2); if(NN_DH[d]===undefined) continue; dH+=NN_DH[d]; dS+=NN_DS[d]; }
    const ini = b => (b==='G'||b==='C') ? [0.1,-2.8] : [2.3,4.1];
    const [h5,s5]=ini(seg[0]); const [h3,s3]=ini(seg[N-1]); dH+=h5+h3; dS+=s5+s3;
    return dH - TREACT_K*dS/1000;
  }
  // duplexo antiparalelo mais estável entre a e b (b=a → homodímero)
  function dimerDG(a, b) {
    a=(a||'').toUpperCase(); const B=(b||'').toUpperCase().split('').reverse().join('');
    let best=0;
    for (let off=-(a.length-1); off<B.length; off++){
      let i=Math.max(0,-off);
      while (i<a.length && i+off<B.length){
        if (i+off>=0 && a[i]===comp(B[i+off])){
          let j=i, seg='';
          while (j<a.length && j+off>=0 && j+off<B.length && a[j]===comp(B[j+off])){ seg+=a[j]; j++; }
          if (seg.length>=3){ const dg=segDG(seg); if (dg<best) best=dg; }
          i=j;
        } else i++;
      }
    }
    return best;
  }
  // hairpin mais estável (haste ≥3 pb, alça ≥3 nt)
  function hairpinDG(a) {
    a=(a||'').toUpperCase(); let best=0;
    for (let i=0;i<a.length;i++){
      for (let j=a.length-1;j>i+3;j--){
        if (a[i]!==comp(a[j])) continue;
        let k=0, seg='';
        while (i+k < j-k && (j-k)-(i+k)-1>=3 && a[i+k]===comp(a[j-k])){ seg+=a[i+k]; k++; }
        if (seg.length>=3){ const dg=segDG(seg); if (dg<best) best=dg; }
      }
    }
    return best;
  }
  // varre estruturas dos 6 primers do conjunto: hairpins, self e cross-dímeros
  const STRUCT_TH = -3.0; // ΔG limiar (kcal/mol @63°C): mais negativo = problemático
  function structureScan(primers) {
    let pen=0; const warns=[]; let worstHp=0, worstDi=0;
    for (const p of primers){
      const hp=hairpinDG(p.seq); if (hp<worstHp) worstHp=hp;
      if (hp<STRUCT_TH){ pen += (STRUCT_TH-hp); warns.push(`${p.name} hairpin ΔG ${hp.toFixed(1)}`); }
      const sd=dimerDG(p.seq, p.seq); if (sd<worstDi) worstDi=sd;
      if (sd<STRUCT_TH){ pen += (STRUCT_TH-sd); warns.push(`${p.name} self-dímero ΔG ${sd.toFixed(1)}`); }
    }
    for (let a=0;a<primers.length;a++) for (let b=a+1;b<primers.length;b++){
      const cd=dimerDG(primers[a].seq, primers[b].seq); if (cd<worstDi) worstDi=cd;
      if (cd<STRUCT_TH){ pen += (STRUCT_TH-cd)*0.8; warns.push(`${primers[a].name}/${primers[b].name} dímero ΔG ${cd.toFixed(1)}`); }
    }
    return { penalty: pen*3, warns, worstHairpin: worstHp, worstDimer: worstDi };
  }

  const inRange = (x, lo, hi) => x>=lo && x<=hi;
  const parseRange = (str, dlo, dhi) => { const m=String(str||'').match(/(-?\d+(?:\.\d+)?)\s*-\s*(-?\d+(?:\.\d+)?)/); return m?[parseFloat(m[1]),parseFloat(m[2])]:[dlo,dhi]; };

  // melhor primer começando em `start` (5' na fita sense), comprimento [lenMin,lenMax]
  function bestByStart(S, start, lenMin, lenMax, tmLo, tmHi, P) {
    const mid=(tmLo+tmHi)/2; let best=null;
    for (let L=lenMin; L<=lenMax; L++){
      if (start+L>S.length) break;
      const seg=S.substr(start,L); const tm=tmNN(seg,P.na,P.mg,P.dntp,TM_OLIGO_NM); if (isNaN(tm)) continue;
      const dev=Math.abs(tm-mid);
      if (!best || dev<best.dev) best={start,end:start+L-1,len:L,seg,tm,gc:gcPct(seg),lc:linguisticComplexity(seg),dev};
    }
    return best;
  }
  // melhor primer terminando em `end`
  function bestByEnd(S, end, lenMin, lenMax, tmLo, tmHi, P) {
    const mid=(tmLo+tmHi)/2; let best=null;
    for (let L=lenMin; L<=lenMax; L++){
      const start=end-L+1; if (start<0) break;
      const seg=S.substr(start,L); const tm=tmNN(seg,P.na,P.mg,P.dntp,TM_OLIGO_NM); if (isNaN(tm)) continue;
      const dev=Math.abs(tm-mid);
      if (!best || dev<best.dev) best={start,end,len:L,seg,tm,gc:gcPct(seg),lc:linguisticComplexity(seg),dev};
    }
    return best;
  }

  function readParams() {
    const num=(el,d)=>{const v=parseFloat(el&&el.value); return isNaN(v)?d:v;};
    const [gcLo,gcHi]=parseRange(els.gcRange&&els.gcRange.value,40,60);
    return {
      innerLo:num(els.tmF1cB1cLfLbMin,64), innerHi:num(els.tmF1cB1cLfLbMax,66),
      outerLo:num(els.tmF2B2F3B3Min,59), outerHi:num(els.tmF2B2F3B3Max,61),
      f3Min:num(els.tamF3B3Min,18), f3Max:num(els.tamF3B3Max,23),
      lfMin:num(els.tamLfLbMin,18), lfMax:num(els.tamLfLbMax,23),
      fipMin:num(els.tamFipMin,42), fipMax:num(els.tamFipMax,52),
      bipMin:num(els.tamBipMin,42), bipMax:num(els.tamBipMax,52),
      gcLo, gcHi,
      loops:(els.loops&&els.loops.value)||'auto',
      lcMin:num(els.lcMin,75),
      na:num(els.na,50), mg:num(els.mg,8), dntp:num(els.dntp,1.4),
      d_F2F1:parseRange(els.distF2F1&&els.distF2F1.value,40,60),
      d_F1B1:parseRange(els.distF1B1&&els.distF1B1.value,0,60),
      d_F2B2:parseRange(els.distF2B2&&els.distF2B2.value,120,180),  // amplicon 5'F2→5'B2 (Eiken/NEB: 120–180)
      d_B2B1:parseRange(els.distB2B1&&els.distB2B1.value,40,60),
      gapF3F2:parseRange(els.distF3F2&&els.distF3F2.value,0,60),    // gap real 3'F3→5'F2 (Eiken/NEB: 0–60)
      loopLinker:((els.loopSeq&&els.loopSeq.value)||'').toUpperCase().replace(/[^ATGC]/g,''),
      limF1cB1c:num(els.penLimF1cB1c,15), limF2B2:num(els.penLimF2B2,20), limF3B3:num(els.penLimF3B3,15),
      maxSets:Math.max(1,Math.min(10000,parseInt((els.maxSets&&els.maxSets.value)||300,10)))
    };
  }

  function designLAMP(S, P) {
    const N=S.length;
    if (N<120) return {error:'Sequência curta. Insira ao menos ~150–250 nt para um design LAMP confiável.'};
    const innerLenMin=18, innerLenMax=26;
    const notes=[`Geometria (padrão Eiken/NEB): amplicon F2–B2 ${P.d_F2B2[0]}–${P.d_F2B2[1]} nt · gap F3–F2 ${P.gapF3F2[0]}–${P.gapF3F2[1]} nt · loop F2–F1 ${P.d_F2F1[0]}–${P.d_F2F1[1]} nt · centro F1–B1 ${P.d_F1B1[0]}–${P.d_F1B1[1]} nt.`];

    const blockDev = b => (b.F1?b.F1.dev:b.B1.dev)+(b.F2?b.F2.dev:b.B2.dev)+(b.F3?b.F3.dev:b.B3.dev);

    // 1) F-blocks: F3 < F2 < F1 (sentido 5'->3')
    let Fblocks=[];
    for (let f2s=0; f2s<N; f2s++) {
      const F2=bestByStart(S,f2s,P.f3Min,P.f3Max,P.outerLo,P.outerHi,P);
      if (!F2 || !inRange(F2.tm,P.outerLo,P.outerHi)) continue;
      let F1=null;
      for (let d=P.d_F2F1[0]; d<=P.d_F2F1[1]; d++){
        const c=bestByStart(S,f2s+d,innerLenMin,innerLenMax,P.innerLo,P.innerHi,P);
        if (c && inRange(c.tm,P.innerLo,P.innerHi) && (!F1||c.dev<F1.dev)) F1=c;
      }
      if (!F1) continue;
      let F3=null;
      for (let g=P.gapF3F2[0]; g<=P.gapF3F2[1]; g++){
        const f3e=f2s-1-g; if (f3e<P.f3Min-1) break;
        const c=bestByEnd(S,f3e,P.f3Min,P.f3Max,P.outerLo,P.outerHi,P);
        if (c && inRange(c.tm,P.outerLo,P.outerHi) && (!F3||c.dev<F3.dev)) F3=c;
      }
      if (!F3) continue;
      Fblocks.push({F3,F2,F1});
    }
    Fblocks.sort((a,b)=>blockDev(a)-blockDev(b)); Fblocks=Fblocks.slice(0,250);

    // 2) B-blocks na fita sense: B1 < B2 < B3; B1 inner, B2/B3 outer
    let Bblocks=[];
    for (let b1s=0; b1s<N; b1s++) {
      const B1=bestByStart(S,b1s,innerLenMin,innerLenMax,P.innerLo,P.innerHi,P);
      if (!B1 || !inRange(B1.tm,P.innerLo,P.innerHi)) continue;
      let B2=null;
      for (let d=P.d_B2B1[0]; d<=P.d_B2B1[1]; d++){
        const c=bestByStart(S,b1s+d,P.f3Min,P.f3Max,P.outerLo,P.outerHi,P);
        if (c && inRange(c.tm,P.outerLo,P.outerHi) && (!B2||c.dev<B2.dev)) B2=c;
      }
      if (!B2) continue;
      let B3=null;
      for (let g=P.gapF3F2[0]; g<=P.gapF3F2[1]; g++){
        const c=bestByStart(S,B2.end+1+g,P.f3Min,P.f3Max,P.outerLo,P.outerHi,P);
        if (c && inRange(c.tm,P.outerLo,P.outerHi) && (!B3||c.dev<B3.dev)) B3=c;
      }
      if (!B3) continue;
      Bblocks.push({B1,B2,B3});
    }
    Bblocks.sort((a,b)=>blockDev(a)-blockDev(b)); Bblocks=Bblocks.slice(0,250);

    // 3) combinar respeitando F1-B1 (centro) e F2-B2 (amplicon)
    const sets=[];
    const midI=(P.innerLo+P.innerHi)/2, midO=(P.outerLo+P.outerHi)/2;
    for (const F of Fblocks){
      for (const B of Bblocks){
        if (!(F.F1.end < B.B1.start)) continue;            // F1 à esquerda de B1
        const dF1B1 = B.B1.start - F.F1.end - 1;
        if (!inRange(dF1B1, P.d_F1B1[0], P.d_F1B1[1])) continue;
        const dF2B2 = B.B2.end - F.F2.start + 1;
        if (!inRange(dF2B2, P.d_F2B2[0], P.d_F2B2[1])) continue;
        if (!(F.F3.start<F.F2.start && F.F2.end<F.F1.start && B.B1.end<B.B2.start && B.B2.end<B.B3.start)) continue;

        // loops
        const lfRegion = S.substring(F.F2.end+1, F.F1.start);
        const lbRegion = S.substring(B.B1.end+1, B.B2.start);
        let LF=null, LB=null;
        if (P.loops!=='off'){
          if (lfRegion.length>=P.lfMin){ const c=bestByStart(lfRegion,0,P.lfMin,Math.min(P.lfMax,lfRegion.length),P.innerLo,P.innerHi,P); if(c) LF={seq:revComp(c.seg),tm:c.tm,gc:c.gc,len:c.len}; }
          if (lbRegion.length>=P.lfMin){ const c=bestByStart(lbRegion,0,P.lfMin,Math.min(P.lfMax,lbRegion.length),P.innerLo,P.innerHi,P); if(c) LB={seq:c.seg,tm:c.tm,gc:c.gc,len:c.len}; }
        }

        const F1c=revComp(F.F1.seg), F2=F.F2.seg, B1c=B.B1.seg, B2=revComp(B.B2.seg);
        const FIP=F1c+P.loopLinker+F2, BIP=B1c+P.loopLinker+B2;
        const F3=F.F3.seg, B3=revComp(B.B3.seg);

        const pInner=(Math.abs(F.F1.tm-midI)+Math.abs(B.B1.tm-midI))/Math.max(1e-6,P.limF1cB1c);
        const pF2B2=(Math.abs(F.F2.tm-midO)+Math.abs(B.B2.tm-midO))/Math.max(1e-6,P.limF2B2);
        const pF3B3=(Math.abs(F.F3.tm-midO)+Math.abs(B.B3.tm-midO))/Math.max(1e-6,P.limF3B3);
        const segs=[['F3',F.F3],['F2',F.F2],['F1c',F.F1],['B1c',B.B1],['B2',B.B2],['B3',B.B3]];
        let gcPen=0,lcPen=0,warns=[];
        for (const [name,info] of segs){
          if (!inRange(info.gc,P.gcLo,P.gcHi)){ gcPen+=1; warns.push(`${name} GC ${info.gc.toFixed(0)}%`); }
          if (info.lc<P.lcMin){ lcPen+=1; warns.push(`${name} LC ${info.lc.toFixed(0)}%`); }
        }
        const fipOk=inRange(FIP.length,P.fipMin,P.fipMax), bipOk=inRange(BIP.length,P.bipMin,P.bipMax);
        if (!fipOk) warns.push(`FIP ${FIP.length} nt`); if (!bipOk) warns.push(`BIP ${BIP.length} nt`);
        // estabilidade das extremidades de iniciação (Eiken: ΔG ≤ -4 kcal/mol)
        let dgPen=0;
        [['F3',F3,'3'],['F2',F2,'3'],['B3',B3,'3'],['B2',B2,'3']].forEach(([n,s,e])=>{ const g=endDeltaG(s,e); if(g>-4){dgPen++; warns.push(`${n} 3'ΔG ${g.toFixed(1)}`);} });
        [['F1c',F1c,'5'],['B1c',B1c,'5']].forEach(([n,s,e])=>{ const g=endDeltaG(s,e); if(g>-4){dgPen++; warns.push(`${n} 5'ΔG ${g.toFixed(1)}`);} });
        const penalty=(pInner+pF2B2+pF3B3)*100 + gcPen*5 + lcPen*5 + dgPen*4 + (fipOk?0:8) + (bipOk?0:8);

        sets.push({
          penalty,
          ampliconF3B3: B.B3.end - F.F3.start + 1, ampliconF2B2: dF2B2, dF1B1,
          coords:{F3:[F.F3.start+1,F.F3.end+1],F2:[F.F2.start+1,F.F2.end+1],F1:[F.F1.start+1,F.F1.end+1],B1:[B.B1.start+1,B.B1.end+1],B2:[B.B2.start+1,B.B2.end+1],B3:[B.B3.start+1,B.B3.end+1]},
          F3:{seq:F3,tm:F.F3.tm,gc:F.F3.gc}, B3:{seq:B3,tm:B.B3.tm,gc:B.B3.gc},
          F2:{seq:F2,tm:F.F2.tm,gc:F.F2.gc}, B2:{seq:B2,tm:B.B2.tm,gc:B.B2.gc},
          F1c:{seq:F1c,tm:F.F1.tm,gc:F.F1.gc}, B1c:{seq:B1c,tm:B.B1.tm,gc:B.B1.gc},
          FIP:{seq:FIP,len:FIP.length}, BIP:{seq:BIP,len:BIP.length},
          LF, LB, warns
        });
      }
    }
    sets.sort((a,b)=>a.penalty-b.penalty);
    const seen=new Set(), uniq=[];
    for (const s of sets){ const k=s.coords.F2[0]+'|'+s.coords.B2[1]; if(seen.has(k))continue; seen.add(k); uniq.push(s); if(uniq.length>=Math.min(P.maxSets,100))break; }
    // Estruturas secundárias: avalia hairpin/homo/heterodímero dos finalistas e
    // RE-RANQUEIA (conjuntos sem estrutura sobem). Roda só nos ≤100 finalistas (rápido).
    for (const s of uniq){
      const prims=[{name:'F3',seq:s.F3.seq},{name:'B3',seq:s.B3.seq},{name:'FIP',seq:s.FIP.seq},{name:'BIP',seq:s.BIP.seq}];
      if (s.LF) prims.push({name:'LF',seq:s.LF.seq});
      if (s.LB) prims.push({name:'LB',seq:s.LB.seq});
      const st=structureScan(prims);
      s.penalty += st.penalty;
      s.struct={ hairpin:st.worstHairpin, dimer:st.worstDimer };
      if (st.warns.length) s.warns=(s.warns||[]).concat(st.warns);
    }
    uniq.sort((a,b)=>a.penalty-b.penalty);
    uniq.forEach((s,i)=>s.rank=i+1);
    return { sets:uniq, totalCandidates:sets.length, notes, params:P, targetLen:N, gc:Math.round(gcPct(S)) };
  }

  function renderResults(data) {
    resList.innerHTML = '';
    if (!data || !data.sets || data.sets.length === 0) {
      resEmpty.hidden = false; resList.hidden = true; return;
    }
    resEmpty.hidden = true; resList.hidden = false;

    const P = data.params || {};
    const header = document.createElement('div');
    header.className = 'lw-result-card';
    header.innerHTML = `
      <h4>Resumo do desenho</h4>
      <div class="lw-kv"><div>Alvo</div><div>${data.targetLen} nt · GC ${data.gc}%</div></div>
      <div class="lw-kv"><div>Conjuntos</div><div>${data.sets.length} (de ${data.totalCandidates} candidatos válidos)</div></div>
      <div class="lw-kv"><div>Tm alvo</div><div>F1c/B1c ${P.innerLo}–${P.innerHi} °C · F2/B2/F3/B3 ${P.outerLo}–${P.outerHi} °C</div></div>
      <div class="lw-kv"><div>Sais</div><div>Na⁺ ${P.na} mM · Mg²⁺ ${P.mg} mM · dNTP ${P.dntp} mM</div></div>
      <p class="lw-help">${(data.notes||[]).join(' ')}</p>
      <p class="lw-help">Tm por nearest-neighbor (SantaLucia 1998) com correção de sal + equivalente de Mg²⁺ (von Ahsen 2001). A penalidade apenas ranqueia; avisos não reprovam o conjunto.</p>
    `;
    resList.appendChild(header);

    const copyBtn = (seq) => `<button class="lw-btn ghost lw-copy" data-seq="${seq}" title="Copiar" style="padding:2px 8px; font-size:11px;">copiar</button>`;
    const row = (label, p) => p ? `<div class="lw-kv"><div>${label}</div><div>5'-${p.seq}-3' <span class="lw-suffix">(${p.len||p.seq.length} nt${p.tm!=null?`, Tm ${p.tm.toFixed(1)}°C`:''}${p.gc!=null?`, GC ${p.gc.toFixed(0)}%`:''})</span> ${copyBtn(p.seq)}</div></div>` : '';

    data.sets.forEach(set => {
      const card = document.createElement('div');
      card.className = 'lw-result-card';
      const warn = (set.warns&&set.warns.length)
        ? `<p class="lw-help" style="color:var(--warn);">⚠ ${set.warns.join(' · ')}</p>`
        : `<p class="lw-help" style="color:var(--ok);">✓ todos os primers dentro das faixas de Tm/GC/LC</p>`;
      card.innerHTML = `
        <h4>Conjunto #${set.rank} — penalidade ${set.penalty.toFixed(1)} · amplicon F3–B3 ${set.ampliconF3B3} nt</h4>
        <div class="lw-help" style="margin:0 0 4px;">Primers externos</div>
        ${row('F3', set.F3)}
        ${row('B3', set.B3)}
        <div class="lw-help" style="margin:8px 0 4px;">Primers internos &nbsp;(FIP = F1c–loop–F2 · BIP = B1c–loop–B2)</div>
        ${row('FIP', set.FIP)}
        ${row('↳ F1c', set.F1c)}
        ${row('↳ F2', set.F2)}
        ${row('BIP', set.BIP)}
        ${row('↳ B1c', set.B1c)}
        ${row('↳ B2', set.B2)}
        ${(set.LF||set.LB)?`<div class="lw-help" style="margin:8px 0 4px;">Loop primers (aceleram a reação)</div>`:''}
        ${row('LF', set.LF)}
        ${row('LB', set.LB)}
        <div class="lw-kv"><div>Posições (1-based)</div><div>F3 ${set.coords.F3.join('–')} · F2 ${set.coords.F2.join('–')} · F1 ${set.coords.F1.join('–')} · B1 ${set.coords.B1.join('–')} · B2 ${set.coords.B2.join('–')} · B3 ${set.coords.B3.join('–')}</div></div>
        <div class="lw-kv"><div>Distâncias</div><div>F2–B2 ${set.ampliconF2B2} nt · F1–B1 ${set.dF1B1} nt</div></div>
        ${set.struct ? `<div class="lw-kv"><div>Estrutura 2ª (@63°C)</div><div>pior hairpin ΔG ${set.struct.hairpin.toFixed(1)} · pior dímero ΔG ${set.struct.dimer.toFixed(1)} kcal/mol</div></div>` : ''}
        ${warn}
      `;
      resList.appendChild(card);
    });

    resList.querySelectorAll('.lw-copy').forEach(b=>{
      b.addEventListener('click', ()=>{ if(navigator.clipboard) navigator.clipboard.writeText(b.dataset.seq); const t=b.textContent; b.textContent='✓'; setTimeout(()=>b.textContent=t,900); });
    });
  }

  btnExecutar.addEventListener('click', () => {
    const seq = sanitizeDNA(seqEl.value.trim());
    const execBtnText = btnExecutar.textContent;
    btnExecutar.textContent = 'Gerando...';
    btnExecutar.disabled = true;
    setTimeout(() => {
      try {
        const data = designLAMP(seq, readParams());
        if (data.error) {
          alert(data.error);
          renderResults({ sets: [] });
        } else if (!data.sets.length) {
          alert('Nenhum conjunto LAMP satisfez as restrições (Tm/distâncias). Tente uma sequência mais longa (~200–300 nt), alargue as faixas de Tm ou o GC.');
          renderResults({ sets: [] });
        } else {
          renderResults(data);
          toTabResultados();
        }
      } catch (err) {
        console.error('Erro no desenho LAMP:', err);
        alert('Erro no desenho: ' + (err && err.message ? err.message : err));
      } finally {
        btnExecutar.textContent = execBtnText;
        btnExecutar.disabled = false;
      }
    }, 30);
  });
})();