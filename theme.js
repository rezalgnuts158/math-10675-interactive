(()=>{
  const key='math10675-theme';
  const root=document.documentElement;
  const preference=window.matchMedia('(prefers-color-scheme: dark)');
  let saved;
  try{saved=localStorage.getItem(key)}catch{}
  const explicit=()=>saved==='light'||saved==='dark';
  function apply(theme){
    root.dataset.theme=theme;
    const button=document.getElementById('themeToggle');
    if(button){button.textContent=theme==='dark'?'Light mode':'Dark mode';button.setAttribute('aria-label',theme==='dark'?'Switch to light mode':'Switch to dark mode')}
  }
  apply(explicit()?saved:preference.matches?'dark':'light');
  preference.addEventListener('change',()=>{if(!explicit())apply(preference.matches?'dark':'light')});
  window.addEventListener('storage',e=>{if(e.key===key){saved=e.newValue;apply(explicit()?saved:preference.matches?'dark':'light')}});
  document.addEventListener('DOMContentLoaded',()=>{
    const host=document.querySelector('.site-header nav')||document.querySelector('.lesson-toolbar')||document.querySelector('body>header');
    if(!host)return;
    const button=document.createElement('button');button.id='themeToggle';button.type='button';button.className='theme-toggle';
    button.addEventListener('click',()=>{saved=root.dataset.theme==='dark'?'light':'dark';try{localStorage.setItem(key,saved)}catch{}apply(saved)});
    host.appendChild(button);apply(root.dataset.theme);
  });
})();
