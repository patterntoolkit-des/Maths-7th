// Shared widget library — loaded by every chapter page.
const { useState } = React;
const h = React.createElement;

function randInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

// ---------------- Number line (integers) ----------------
function NumberLine() {
  const [mode, setMode] = useState('add');
  const presets = {
    add: { label: 'Add a positive', start: 2, delta: 3 },
    addNeg: { label: 'Add a negative', start: 2, delta: -5 },
    sub: { label: 'Subtract a positive', start: 4, delta: -3 },
    subNeg: { label: 'Subtract a negative', start: -2, delta: 4 },
  };
  const p = presets[mode];
  const start = p.start, delta = p.delta, end = start + delta;
  const lo = -10, hi = 10, width = 640, height = 118, margin = 24;
  const usable = width - margin * 2;
  const scale = (n) => margin + ((n - lo) / (hi - lo)) * usable;
  const ticks = []; for (let i = lo; i <= hi; i++) ticks.push(i);
  const arrowY = 46; const midX = (scale(start) + scale(end)) / 2;

  let explanation;
  if (mode === 'add') explanation = `Start at ${start}, move ${Math.abs(delta)} steps right (adding a positive number moves right).`;
  else if (mode === 'addNeg') explanation = `Start at ${start}, move ${Math.abs(delta)} steps left (adding a negative number moves left).`;
  else if (mode === 'sub') explanation = `Start at ${start}, move ${Math.abs(delta)} steps left (subtracting a positive number moves left).`;
  else explanation = `Start at ${start}, move 4 steps right (subtracting a negative flips direction — it's the same as adding).`;

  return h('div', { className: 'widget-mount' },
    h('div', { className: 'numline-wrap' },
      h('svg', { viewBox: `0 0 ${width} ${height}` },
        h('line', { x1: margin, y1: 68, x2: width - margin, y2: 68, stroke: 'var(--ink-soft)', strokeWidth: 1.5 }),
        ticks.map(t => h('g', { key: t },
          h('line', { x1: scale(t), y1: 62, x2: scale(t), y2: 74, stroke: 'var(--ink-soft)', strokeWidth: t === 0 ? 2 : 1 }),
          (t % 2 === 0) && h('text', { x: scale(t), y: 90, fontSize: 11, textAnchor: 'middle', fill: 'var(--ink-soft)', fontFamily: 'IBM Plex Mono, monospace' }, t)
        )),
        h('path', { d: `M ${scale(start)} ${arrowY} Q ${midX} ${arrowY - 22} ${scale(end)} ${arrowY}`, fill: 'none', stroke: 'var(--maroon)', strokeWidth: 2.5, markerEnd: 'url(#ah1)' }),
        h('defs', null, h('marker', { id: 'ah1', markerWidth: 8, markerHeight: 8, refX: 6, refY: 3, orient: 'auto' }, h('path', { d: 'M0,0 L0,6 L7,3 z', fill: 'var(--maroon)' }))),
        h('circle', { cx: scale(start), cy: 68, r: 5, fill: 'var(--slate)' }),
        h('circle', { cx: scale(end), cy: 68, r: 5.5, fill: 'var(--maroon)' }),
        h('text', { x: scale(start), y: 110, fontSize: 12, fontWeight: 700, textAnchor: 'middle', fill: 'var(--slate)', fontFamily: 'IBM Plex Mono, monospace' }, `${start}`),
        h('text', { x: scale(end), y: 28, fontSize: 12, fontWeight: 700, textAnchor: 'middle', fill: 'var(--maroon)', fontFamily: 'IBM Plex Mono, monospace' }, `${end}`)
      ),
      h('p', { className: 'numline-caption' }, explanation)
    ),
    h('div', { className: 'numline-controls' },
      Object.keys(presets).map(key => h('button', { key, className: 'pill-btn' + (mode === key ? ' active' : ''), onClick: () => setMode(key) }, presets[key].label))
    )
  );
}

// ---------------- Closure demo (integers) ----------------
function ClosureDemo() {
  const [a, setA] = useState(4);
  const [b, setB] = useState(-3);
  const [op, setOp] = useState('+');
  function compute() {
    switch (op) {
      case '+': return a + b;
      case '\u2212': return a - b;
      case '\u00d7': return a * b;
      case '\u00f7': return b !== 0 ? a / b : null;
      default: return null;
    }
  }
  const result = compute();
  const isInteger = result !== null && Number.isInteger(result);
  const resultDisplay = result === null ? 'undefined' : (Number.isInteger(result) ? result : result.toFixed(2).replace(/\.00$/, ''));
  return h('div', { className: 'widget-mount' },
    h('div', { className: 'closure-demo' },
      h('div', { className: 'closure-row' },
        h('input', { type: 'number', className: 'num-select', value: a, onChange: e => setA(e.target.value === '' ? 0 : parseInt(e.target.value, 10)) }),
        h('select', { className: 'op-select', value: op, onChange: e => setOp(e.target.value) },
          h('option', { value: '+' }, '+'), h('option', { value: '\u2212' }, '\u2212'),
          h('option', { value: '\u00d7' }, '\u00d7'), h('option', { value: '\u00f7' }, '\u00f7')
        ),
        h('input', { type: 'number', className: 'num-select', value: b, onChange: e => setB(e.target.value === '' ? 0 : parseInt(e.target.value, 10)) })
      ),
      h('div', { className: 'demo-result' },
        h('span', null, `${a} ${op} ${b} = ${resultDisplay}`), h('br'),
        result !== null && h('span', { className: 'verdict ' + (isInteger ? 'in-set' : 'out-set') },
          isInteger ? '\u2713 stays an integer' : '\u2717 leaves the set of integers')
      )
    )
  );
}

// ---------------- Fraction bar visualizer ----------------
function FractionBar() {
  const [num, setNum] = useState(3);
  const [den, setDen] = useState(4);
  function adjust(which, delta) {
    if (which === 'num') setNum(n => Math.max(0, Math.min(den, n + delta)));
    else setDen(d => { const nd = Math.max(2, Math.min(12, d + delta)); if (num > nd) setNum(nd); return nd; });
  }
  const segments = Array.from({ length: den }, (_, i) => i < num);
  return h('div', { className: 'widget-mount' },
    h('div', { className: 'fraction-builder' },
      h('p', { style: { color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '14px' } }, 'Build a fraction and see it as a shaded bar.'),
      h('div', { style: { display: 'flex', height: '48px', border: '2px solid var(--ink)', borderRadius: '4px', overflow: 'hidden', marginBottom: '14px' } },
        segments.map((filled, i) => h('div', {
          key: i,
          style: {
            flex: 1,
            background: filled ? 'var(--slate)' : 'var(--bg)',
            borderRight: i < segments.length - 1 ? '1px solid var(--ink)' : 'none'
          }
        }))
      ),
      h('div', { style: { fontFamily: "'IBM Plex Mono', monospace", fontSize: '1.3rem', marginBottom: '14px' } }, `${num} / ${den}`),
      h('div', { className: 'tile-row' },
        h('button', { className: 'pill-btn', onClick: () => adjust('num', 1) }, '+ numerator'),
        h('button', { className: 'pill-btn', onClick: () => adjust('num', -1) }, '\u2212 numerator'),
        h('button', { className: 'pill-btn', onClick: () => adjust('den', 1) }, '+ parts'),
        h('button', { className: 'pill-btn', onClick: () => adjust('den', -1) }, '\u2212 parts')
      )
    )
  );
}

// ---------------- Algebra expression builder ----------------
function ExprBuilder() {
  const [xCount, setXCount] = useState(3);
  const [yCount, setYCount] = useState(1);
  function adjust(which, delta) {
    if (which === 'x') setXCount(c => Math.max(0, Math.min(8, c + delta)));
    else setYCount(c => Math.max(0, Math.min(8, c + delta)));
  }
  const terms = [...Array.from({ length: xCount }, () => 'x'), ...Array.from({ length: yCount }, () => 'y')];
  const simplified = [
    xCount > 0 ? (xCount === 1 ? 'x' : `${xCount}x`) : null,
    yCount > 0 ? (yCount === 1 ? 'y' : `${yCount}y`) : null
  ].filter(Boolean).join(' + ') || '0';
  return h('div', { className: 'widget-mount' },
    h('div', { className: 'expr-builder' },
      h('p', { style: { color: 'var(--ink-soft)', fontSize: '0.9rem' } }, 'Add x\u2019s and y\u2019s and watch like terms combine.'),
      h('div', { className: 'expr-display' }, terms.length ? terms.map((t, i) => h('span', { key: i, className: 'term' }, t + (i < terms.length - 1 ? ' + ' : ''))) : '0'),
      h('div', { className: 'tile-row' },
        h('button', { className: 'pill-btn', onClick: () => adjust('x', 1) }, '+ x'),
        h('button', { className: 'pill-btn', onClick: () => adjust('x', -1) }, '\u2212 x'),
        h('button', { className: 'pill-btn', onClick: () => adjust('y', 1) }, '+ y'),
        h('button', { className: 'pill-btn', onClick: () => adjust('y', -1) }, '\u2212 y')
      ),
      h('p', { style: { marginTop: '16px', fontFamily: "'IBM Plex Mono', monospace", fontSize: '1.1rem' } }, 'Simplified: ', h('strong', null, simplified))
    )
  );
}

// ---------------- Balance-scale equation solver visual ----------------
function EquationBalance() {
  const [x, setX] = useState(4);
  // represents x + 3 = 7 style balance, generalized as x + b = total
  const b = 3, total = 7;
  const rightVal = x + b;
  const balanced = rightVal === total;
  return h('div', { className: 'widget-mount' },
    h('div', { className: 'demo-box' },
      h('p', { style: { textAlign: 'center', color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '12px' } }, `Solve: x + ${b} = ${total}. Slide x until both sides balance.`),
      h('div', { style: { display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '18px', margin: '18px 0' } },
        h('div', { style: { padding: '14px 20px', background: 'var(--slate-soft)', borderRadius: '4px', fontFamily: "'IBM Plex Mono', monospace", fontSize: '1.1rem' } }, `x + ${b} = ${x + b}`),
        h('div', { style: { fontSize: '1.4rem', color: balanced ? 'var(--forest)' : 'var(--maroon)' } }, balanced ? '\u2713' : '\u2260'),
        h('div', { style: { padding: '14px 20px', background: 'var(--gold-soft)', borderRadius: '4px', fontFamily: "'IBM Plex Mono', monospace", fontSize: '1.1rem' } }, `${total}`)
      ),
      h('div', { style: { display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px' } },
        h('button', { className: 'pill-btn', onClick: () => setX(v => Math.max(0, v - 1)) }, '\u2212 1'),
        h('span', { style: { fontFamily: "'IBM Plex Mono', monospace", fontSize: '1.2rem', minWidth: '50px', textAlign: 'center' } }, `x = ${x}`),
        h('button', { className: 'pill-btn', onClick: () => setX(v => Math.min(15, v + 1)) }, '+ 1')
      ),
      balanced && h('p', { style: { textAlign: 'center', marginTop: '12px', color: 'var(--forest)', fontWeight: 600 } }, `Balanced! x = ${x} is the solution.`)
    )
  );
}

// ---------------- Angle visualizer ----------------
function AngleDemo() {
  const [angle, setAngle] = useState(60);
  const cx = 150, cy = 150, r = 110;
  const rad = (angle * Math.PI) / 180;
  const x2 = cx + r * Math.cos(-rad);
  const y2 = cy + r * Math.sin(-rad);
  let type = 'Acute';
  let color = 'var(--forest)';
  if (angle === 90) { type = 'Right'; color = 'var(--slate)'; }
  else if (angle > 90 && angle < 180) { type = 'Obtuse'; color = 'var(--gold)'; }
  else if (angle === 180) { type = 'Straight'; color = 'var(--maroon)'; }
  else if (angle > 180) { type = 'Reflex'; color = 'var(--maroon)'; }

  const largeArc = angle > 180 ? 1 : 0;
  const arcX = cx + 36 * Math.cos(-rad);
  const arcY = cy + 36 * Math.sin(-rad);

  return h('div', { className: 'widget-mount' },
    h('div', { className: 'demo-box' },
      h('svg', { viewBox: '0 0 300 200', style: { width: '100%', maxWidth: '320px', display: 'block', margin: '0 auto' } },
        h('line', { x1: cx, y1: cy, x2: cx + r, y2: cy, stroke: 'var(--ink-soft)', strokeWidth: 2 }),
        h('line', { x1: cx, y1: cy, x2: x2, y2: y2, stroke: color, strokeWidth: 2.5 }),
        h('path', { d: `M ${cx + 36} ${cy} A 36 36 0 ${largeArc} 0 ${arcX} ${arcY}`, fill: 'none', stroke: color, strokeWidth: 1.5, opacity: 0.7 }),
        h('circle', { cx, cy, r: 3, fill: 'var(--ink)' })
      ),
      h('p', { style: { textAlign: 'center', fontFamily: "'IBM Plex Mono', monospace", marginTop: '6px' } }, `${angle}\u00b0 \u2014 `, h('strong', { style: { color } }, type)),
      h('div', { style: { display: 'flex', justifyContent: 'center', marginTop: '10px' } },
        h('input', {
          type: 'range', min: 10, max: 260, value: angle,
          onChange: e => setAngle(parseInt(e.target.value, 10)),
          style: { width: '80%' }
        })
      )
    )
  );
}

// ---------------- Percentage bar visualizer ----------------
function PercentBar() {
  const [pct, setPct] = useState(35);
  return h('div', { className: 'widget-mount' },
    h('div', { className: 'demo-box' },
      h('p', { style: { textAlign: 'center', color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '12px' } }, `${pct}% shown as a shaded bar out of 100.`),
      h('div', { style: { height: '36px', border: '2px solid var(--ink)', borderRadius: '4px', overflow: 'hidden', position: 'relative', background: 'var(--bg)' } },
        h('div', { style: { width: pct + '%', height: '100%', background: 'var(--slate)', transition: 'width 0.15s' } })
      ),
      h('div', { style: { display: 'flex', justifyContent: 'center', marginTop: '12px' } },
        h('input', { type: 'range', min: 0, max: 100, value: pct, onChange: e => setPct(parseInt(e.target.value, 10)), style: { width: '80%' } })
      ),
      h('p', { style: { textAlign: 'center', marginTop: '8px', fontFamily: "'IBM Plex Mono', monospace" } }, `${pct}/100 = ${pct}%`)
    )
  );
}

// ---------------- Absolute value on number line ----------------
function AbsoluteValueDemo() {
  const [n, setN] = useState(-6);
  const lo = -10, hi = 10, width = 640, height = 100, margin = 24;
  const usable = width - margin * 2;
  const scale = (v) => margin + ((v - lo) / (hi - lo)) * usable;
  const ticks = []; for (let i = lo; i <= hi; i++) ticks.push(i);
  const dist = Math.abs(n);
  return h('div', { className: 'widget-mount' },
    h('div', { className: 'numline-wrap' },
      h('svg', { viewBox: `0 0 ${width} ${height}` },
        h('line', { x1: margin, y1: 56, x2: width - margin, y2: 56, stroke: 'var(--ink-soft)', strokeWidth: 1.5 }),
        ticks.map(t => h('g', { key: t },
          h('line', { x1: scale(t), y1: 50, x2: scale(t), y2: 62, stroke: 'var(--ink-soft)', strokeWidth: t === 0 ? 2 : 1 }),
          (t % 2 === 0) && h('text', { x: scale(t), y: 78, fontSize: 11, textAnchor: 'middle', fill: 'var(--ink-soft)', fontFamily: 'IBM Plex Mono, monospace' }, t)
        )),
        h('line', { x1: scale(0), y1: 30, x2: scale(n), y2: 30, stroke: 'var(--maroon)', strokeWidth: 2.5 }),
        h('circle', { cx: scale(0), cy: 56, r: 4, fill: 'var(--ink)' }),
        h('circle', { cx: scale(n), cy: 56, r: 5.5, fill: 'var(--maroon)' }),
        h('text', { x: (scale(0) + scale(n)) / 2, y: 22, fontSize: 12, fontWeight: 700, textAnchor: 'middle', fill: 'var(--maroon)', fontFamily: 'IBM Plex Mono, monospace' }, `${dist} steps`)
      ),
      h('p', { className: 'numline-caption' }, `|${n}| = ${dist} — the distance from 0 to ${n} on the number line, always positive.`)
    ),
    h('div', { className: 'numline-controls' },
      h('button', { className: 'pill-btn', onClick: () => setN(v => Math.max(lo, v - 1)) }, '\u2212 1'),
      h('span', { style: { fontFamily: "'IBM Plex Mono', monospace", fontSize: '1.05rem', padding: '7px 10px' } }, `n = ${n}`),
      h('button', { className: 'pill-btn', onClick: () => setN(v => Math.min(hi, v + 1)) }, '+ 1')
    )
  );
}

// ---------------- BODMAS step-through ----------------
function BodmasDemo() {
  const examples = [
    {
      label: '25 \u2212 18 \u00f7 6 \u00d7 5',
      steps: [
        '25 \u2212 18 \u00f7 6 \u00d7 5',
        '25 \u2212 3 \u00d7 5      [Division: 18 \u00f7 6 = 3]',
        '25 \u2212 15      [Multiplication: 3 \u00d7 5 = 15]',
        '10      [Subtraction: 25 \u2212 15]'
      ]
    },
    {
      label: '16 \u2212 {8 \u00d7 3 \u2212 (\u22126) \u00d7 12 \u00f7 (\u22123)}',
      steps: [
        '16 \u2212 {8 \u00d7 3 \u2212 (\u22126) \u00d7 12 \u00f7 (\u22123)}',
        '16 \u2212 {8 \u00d7 3 \u2212 (\u22126) \u00d7 (\u22124)}      [Division: 12 \u00f7 (\u22123) = \u22124]',
        '16 \u2212 {24 \u2212 24}      [Multiplication: 8\u00d73=24 and (\u22126)\u00d7(\u22124)=24]',
        '16 \u2212 0      [Solving inside { }]',
        '16      [Subtraction]'
      ]
    },
    {
      label: '1 \u2212 2 of {\u22126 \u2212 (5+3)} \u00f7 2',
      steps: [
        '1 \u2212 2 of {\u22126 \u2212 (5+3)} \u00f7 2',
        '1 \u2212 2 of {\u22126 \u2212 8} \u00f7 2      [Solving ( ): 5+3=8]',
        '1 \u2212 2 of {\u221214} \u00f7 2      [Solving { }: \u22126\u22128=\u221214]',
        '1 + 28 \u00f7 2      [Solving \u2018of\u2019: 2 of \u221214 = \u221228, then \u22122 of \u221214 means \u2212(\u221228)=+28]',
        '1 + 14      [Division: 28 \u00f7 2 = 14]',
        '15      [Addition]'
      ]
    }
  ];
  const [idx, setIdx] = useState(0);
  const [step, setStep] = useState(0);
  const ex = examples[idx];
  return h('div', { className: 'widget-mount' },
    h('div', { className: 'demo-box' },
      h('div', { className: 'tile-row', style: { marginBottom: '14px' } },
        examples.map((e, i) => h('button', {
          key: i,
          className: 'pill-btn' + (idx === i ? ' active' : ''),
          onClick: () => { setIdx(i); setStep(0); }
        }, `Example ${i + 1}`))
      ),
      h('div', { style: { fontFamily: "'IBM Plex Mono', monospace", fontSize: '1.05rem', textAlign: 'center', minHeight: '2.4rem', lineHeight: 1.6 } },
        ex.steps[step]
      ),
      h('div', { style: { display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '14px' } },
        h('button', { className: 'pill-btn', onClick: () => setStep(s => Math.max(0, s - 1)), disabled: step === 0 }, '\u2190 Back'),
        h('span', { style: { fontSize: '0.8rem', color: 'var(--ink-soft)', alignSelf: 'center' } }, `Step ${step + 1} of ${ex.steps.length}`),
        h('button', { className: 'pill-btn', onClick: () => setStep(s => Math.min(ex.steps.length - 1, s + 1)), disabled: step === ex.steps.length - 1 }, 'Next \u2192')
      )
    )
  );
}

// ---------------- Bracket removal order (vinculum method) ----------------
function BracketOrderDemo() {
  const stages = [
    { label: 'Vinculum (bar)', example: '7\u203e\u22125\u203e', note: 'A bar over numbers means treat them as already grouped \u2014 simplify under the bar first, before anything else.' },
    { label: 'Small brackets ( )', example: '(5 \u2212 2)', note: 'Simplify inside round brackets next, innermost first.' },
    { label: 'Curly brackets { }', example: '{14 \u2212 3}', note: 'Then curly brackets, once everything inside them is a single number.' },
    { label: 'Square brackets [ ]', example: '[38 \u2212 42]', note: 'Square brackets are simplified last, since they usually contain everything else.' }
  ];
  const [stage, setStage] = useState(0);
  return h('div', { className: 'widget-mount' },
    h('div', { className: 'demo-box' },
      h('div', { className: 'tile-row', style: { marginBottom: '14px' } },
        stages.map((s, i) => h('button', {
          key: i, className: 'pill-btn' + (stage === i ? ' active' : ''), onClick: () => setStage(i)
        }, `${i + 1}. ${s.label}`))
      ),
      h('div', { style: { textAlign: 'center', fontFamily: "'IBM Plex Mono', monospace", fontSize: '1.3rem', margin: '10px 0' } }, stages[stage].example),
      h('p', { style: { textAlign: 'center', color: 'var(--ink-soft)', fontSize: '0.9rem' } }, stages[stage].note)
    )
  );
}

// ---------------- Exercise item + set (checkable practice) ----------------
function ExerciseItem({ num, question, answer, hint }) {
  const [input, setInput] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [showHint, setShowHint] = useState(false);

  function check() {
    if (!input.trim()) return;
    const norm = s => String(s).toLowerCase().replace(/\s+/g, '');
    const ok = norm(input) === norm(answer);
    setFeedback(ok ? 'correct' : 'incorrect');
  }

  return h('div', { className: 'ex-item' },
    h('span', { className: 'exnum' }, `${num}.`),
    h('div', { className: 'ex-body' },
      h('div', { className: 'ex-q' }, question),
      h('div', { className: 'ex-answer-row' },
        h('input', {
          className: 'ex-input', type: 'text', placeholder: 'answer', value: input,
          onChange: e => { setInput(e.target.value); setFeedback(null); },
          onKeyDown: e => { if (e.key === 'Enter') check(); }
        }),
        h('button', { className: 'ex-check', onClick: check, disabled: !input.trim() }, 'Check')
      ),
      feedback && h('div', { className: 'ex-feedback ' + feedback },
        feedback === 'correct' ? 'Correct.' : `Not quite \u2014 the answer is ${answer}.${hint ? ' ' + hint : ''}`
      ),
      !feedback && hint && h('button', { className: 'ex-reveal-btn', onClick: () => setShowHint(s => !s) }, showHint ? 'Hide hint' : 'Show hint'),
      !feedback && showHint && h('div', { className: 'ex-feedback', style: { background: 'var(--gold-soft)', color: 'var(--gold)' } }, hint)
    )
  );
}

function ExerciseSet({ label, items }) {
  return h('div', { className: 'exercise-set' },
    h('span', { className: 'ex-label' }, label),
    items.map((it, i) => h(ExerciseItem, { key: i, num: i + 1, ...it }))
  );
}

function mount(component, elementId) {
  ReactDOM.createRoot(document.getElementById(elementId)).render(h(component));
}
