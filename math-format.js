/* Shared TeX renderer. Explicit \(...\) is supported for future lesson authoring.
   Existing lesson notation is normalized into TeX before rendering. Editable
   inputs, native select options, and student writing remain native controls. */
window.MathJax={startup:{typeset:false},svg:{fontCache:'none'},options:{enableMenu:false,enableAssistiveMml:false},tex:{packages:['base','ams','newcommand','textmacros'],formatError(jax,error){window.siteMathErrors.push(error.message);return jax.formatError(error)}}};
window.siteMathErrors=[];
(()=>{
const fractions={'¼':'1/4','½':'1/2','¾':'3/4','⅓':'1/3','⅔':'2/3','⅕':'1/5','⅖':'2/5','⅗':'3/5','⅘':'4/5','⅛':'1/8'};
const atom=String.raw`(?:\d+(?:,\d{3})*(?:\.\d+)?(?:%|°F|st|nd|rd|th)?|(?:in|ft|m)[²³]|mx|Δ|[¼½¾⅓⅔⅕⅖⅗⅘⅛]|(?:Δ\s*)?[a-zA-Z](?![a-zA-Z])(?:[₀₁₂₃₄₅₆₇₈₉²³]|_\{[^}]+\}|_[a-zA-Z0-9]+)?|√)`;
const piece=String.raw`(?:${atom}|[=≈≠≤≥<>+−×·/⇔→^²³]|-(?![a-zA-Z])|[()[\]|,:])`;
const chunks=new RegExp(String.raw`(?<![\p{L}\p{N}’'])${piece}(?:\s*${piece})*(?![\p{L}\p{N}])`,'gu');
const skip='script,style,textarea,input,select,option,code,pre,mjx-container,.math-inline,.mathjax-label,.math-source,[data-no-math]';
const cache=new Map();let pending=false,observer;
function escapeText(s){return s.replace(/([{}%&#_$])/g,'\\$1').replace(/\\(?![{}%&#_$])/g,'\\textbackslash{} ')}
function latex(s){
  s=s.replace(/\u00a0/g,' ').trim();
  if(s.startsWith('\\(')&&s.endsWith('\\)'))return s.slice(2,-2);
  s=s.replace(/(\d+)(st|nd|rd|th)\b/g,'$1^{\\mathrm{$2}}').replace(/(in|ft|m)([²³])/g,(_,u,p)=>'\\mathrm{'+u+'}^{'+(p==='²'?2:3)+'}');
  s=s.replace(/[¼½¾⅓⅔⅕⅖⅗⅘⅛]/g,x=>'('+fractions[x]+')').replace(/Δ\s*([a-zA-Z])/g,'\\Delta $1').replace(/Δ/g,'\\Delta ')
   .replace(/([a-zA-Z])([₀₁₂₃₄₅₆₇₈₉])/g,(_,a,b)=>a+'_{'+('₀₁₂₃₄₅₆₇₈₉'.indexOf(b))+'}')
   .replace(/²/g,'^{2}').replace(/³/g,'^{3}').replace(/−/g,'-').replace(/×/g,'\\times ').replace(/·/g,'\\cdot ')
   .replace(/≈/g,'\\approx ').replace(/≠/g,'\\ne ').replace(/≤/g,'\\le ').replace(/≥/g,'\\ge ').replace(/⇔/g,'\\Longleftrightarrow ').replace(/→/g,'\\to ')
   .replace(/°F/g,'{}^{\\circ}\\mathrm{F}').replace(/%/g,'\\%').replace(/√\s*([a-zA-Z0-9]+)/g,'\\sqrt{$1}')
   .replace(/_(?:\{(initial|final)\}|(initial|final))/g,(_,a,b)=>'_{\\mathrm{'+(a||b)+'}}');
  // Preserve thousands grouping without TeX's punctuation spacing.
  s=s.replace(/(\d),(?=\d{3}(?:\D|$))/g,'$1{,}');
  // Ratios use fractions; each operand is a group or a signed number/variable.
  const operand=String.raw`(?:\([^()]+\)|-?\d+(?:\.\d+)?|(?:\\Delta\s*)?[a-zA-Z](?:_\{[^}]+\}|\^\{[^}]+\})?)`;
  s=s.replace(new RegExp('('+operand+')\\s*/\\s*('+operand+')','g'),(_,a,b)=>`\\frac{${a.startsWith('(')?a.slice(1,-1):a}}{${b.startsWith('(')?b.slice(1,-1):b}}`);
  return s;
}
function convert(tex){
  if(cache.has(tex))return cache.get(tex).cloneNode(true);
  const node=MathJax.tex2svg(tex,{display:false});
  node.querySelectorAll('mjx-assistive-mml').forEach(e=>e.remove());
  if(node.querySelector('[data-mml-node="merror"]'))window.siteMathErrors.push(tex);
  if(cache.size>=600)cache.delete(cache.keys().next().value);
  cache.set(tex,node);return node.cloneNode(true);
}
function span(source,tex){const e=document.createElement('span');e.className='math-inline';e.dataset.tex=tex;e.setAttribute('role','math');e.setAttribute('aria-label',source);const original=document.createElement('span');original.className='math-source';original.textContent=source;original.setAttribute('aria-hidden','true');e.appendChild(original);const math=convert(tex);math.setAttribute('aria-hidden','true');e.appendChild(math);return e}
function parts(value){
  const result=[];let offset=0;
  const explicit=/\\\([\s\S]*?\\\)/g;let ex;
  while((ex=explicit.exec(value))){result.push(...plain(value.slice(offset,ex.index)));result.push({source:ex[0],tex:latex(ex[0])});offset=ex.index+ex[0].length}
  result.push(...plain(value.slice(offset)));return result;
}
function plain(value){
  const result=[];let last=0;chunks.lastIndex=0;let match;
  while((match=chunks.exec(value))){let s=match[0];
    // Avoid fragments inside words and isolated sentence punctuation.
    if((match.index>0&&/[\p{L}\p{N}]/u.test(value[match.index-1]))||/[\p{L}\p{N}]/u.test(value[match.index+s.length]||''))continue;
    let end=s.length;while(end>0&&/[\s,:(=+−×·/⇔→]/.test(s[end-1]))end--;s=s.slice(0,end);
    if(!/[0-9Δ¼½¾⅓⅔⅕⅖⅗⅘⅛=≈≠≤≥<>+−×/√²³₀₁₂]/.test(s)&&!/^\s*[bcdhmprstuwxyVLTP]\s*$/.test(s))continue;
    if(!s||!/[\wΔ¼½¾⅓⅔⅕⅖⅗⅘⅛]/.test(s))continue;
    // Do not consume an unmatched opening/closing bracket from prose.
    while(s.startsWith('(')&&s.split('(').length>s.split(')').length){s=s.slice(1);match.index++}
    while(s.endsWith(')')&&s.split(')').length>s.split('(').length)s=s.slice(0,-1);
    if(match.index>last)result.push(value.slice(last,match.index));
    result.push({source:s,tex:latex(s)});last=match.index+s.length;
  }
  if(last<value.length)result.push(value.slice(last));return result;
}
function processText(node){const p=node.parentElement;if(!p||p.closest(skip)||p.namespaceURI==='http://www.w3.org/2000/svg')return;const value=node.nodeValue;if(!value.trim())return;const pieces=parts(value);if(!pieces.some(x=>typeof x!=='string'))return;const f=document.createDocumentFragment();for(const item of pieces)f.appendChild(typeof item==='string'?document.createTextNode(item):span(item.source,item.tex));node.replaceWith(f)}
function flattenSubscripts(){document.querySelectorAll('sub,sup').forEach(e=>{if(e.closest(skip)||e.closest('svg'))return;const prefix=e.tagName==='SUB'?'_':'^';const parent=e.parentElement;e.replaceWith(document.createTextNode(prefix+'{'+e.textContent+'}'));parent.normalize()})}
function svgLabels(){
  document.querySelectorAll('svg.chart text,svg.cover text').forEach(e=>{
    if(e.closest('.mathjax-label')||e.dataset.mathRendered)return;
    const value=e.textContent.trim();if(!value)return;
    const pieces=parts(value);if(!pieces.some(x=>typeof x!=='string'))return;
    const tex=pieces.map(x=>typeof x==='string'?`\\text{${escapeText(x)}}`:x.tex).join('');
    const math=convert(tex).querySelector('svg'),vb=math.getAttribute('viewBox').split(/\s+/).map(Number),size=parseFloat(getComputedStyle(e).fontSize)||14,scale=size/1000;
    let width=vb[2]*scale,height=vb[3]*scale;const anchor=e.getAttribute('text-anchor')||'start',x=parseFloat(e.getAttribute('x'))||0,y=parseFloat(e.getAttribute('y'))||0;
    math.setAttribute('x',x-(anchor==='middle'?width/2:anchor==='end'?width:0));math.setAttribute('y',y+vb[1]*scale);math.setAttribute('width',width);math.setAttribute('height',height);math.style.verticalAlign='';math.style.overflow='visible';
    const g=document.createElementNS('http://www.w3.org/2000/svg','g');g.classList.add('mathjax-label');g.dataset.tex=tex;g.setAttribute('aria-label',value);g.setAttribute('role','math');g.style.color=e.closest('.chart')?'var(--ink)':getComputedStyle(e).fill;g.appendChild(math);
    e.dataset.mathRendered='true';e.style.visibility='hidden';e.setAttribute('aria-hidden','true');e.after(g);
  });
}
function run(){
  if(!MathJax.tex2svg)return;pending=false;observer?.disconnect();
  try{flattenSubscripts();const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);const nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);for(const n of nodes)processText(n);svgLabels();document.documentElement.dataset.mathReady='true'}catch(e){window.siteMathErrors.push(e.message);console.error(e)}
  observer.observe(document.body,{childList:true,subtree:true,characterData:true});
}
function schedule(){if(!pending){pending=true;requestAnimationFrame(run)}}
window.siteMath={latex,parts,refresh:run};
document.addEventListener('DOMContentLoaded',()=>{
  const start=()=>{observer=new MutationObserver(schedule);run()};
  if(MathJax.startup?.promise)MathJax.startup.promise.then(start).catch(e=>window.siteMathErrors.push(e.message));
  else window.addEventListener('load',()=>MathJax.startup.promise.then(start),{once:true});
});
})();
