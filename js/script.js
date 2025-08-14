(function(){
  'use strict';

  const M = (window.__MAPPING__ || {screens:['main-screen'],buttons_by_screen:{'main-screen':[]}});

  // Telegram WebApp init (fallback when not in Telegram)
  const tg = (window.Telegram && window.Telegram.WebApp) ? window.Telegram.WebApp : null;
  if (tg) {
    try {
      tg.ready();
      // Map theme params to CSS vars
      const tp = tg.themeParams || {};
      const cssVars = {
        '--bg': tp.bg_color || (tg.colorScheme === 'dark' ? '#0f0f10' : '#ffffff'),
        '--text': tp.text_color || (tg.colorScheme === 'dark' ? '#f5f5f5' : '#111111'),
        '--muted': tp.hint_color || (tg.colorScheme === 'dark' ? '#9aa0a6' : '#6b7280'),
        '--primary': tp.button_color || '#0a84ff',
        '--surface': tp.secondary_bg_color || (tg.colorScheme === 'dark' ? '#1b1c1f' : '#f3f4f6')
      };
      for (const k in cssVars) document.documentElement.style.setProperty(k, cssVars[k]);

      tg.onEvent('themeChanged', () => {
        const tp2 = tg.themeParams || {};
        document.documentElement.style.setProperty('--bg', tp2.bg_color);
        document.documentElement.style.setProperty('--text', tp2.text_color);
        document.documentElement.style.setProperty('--muted', tp2.hint_color);
        document.documentElement.style.setProperty('--primary', tp2.button_color);
        document.documentElement.style.setProperty('--surface', tp2.secondary_bg_color);
      });

      // Back button integration
      tg.BackButton.onClick(() => navigateBack());
    } catch(e) {
      console.warn('Telegram init error', e);
    }
  } else {
    // Fallback stub
    window.Telegram = { WebApp: { expand(){}, close(){}, BackButton: { show(){}, hide(){}, onClick(cb){} }, HapticFeedback: { impactOccurred(){} } } };
  }

  const app = document.getElementById('app');
  const historyStack = [];

  function createButton(label, attrs = {}) {
    const btn = document.createElement('button');
    btn.className = 'btn';
    btn.textContent = label;
    for (const k in attrs) {
      if (k === 'disabled' && attrs[k]) btn.setAttribute('disabled', 'true');
      else if (attrs[k] != null) btn.setAttribute(k, attrs[k]);
    }
    btn.addEventListener('click', (e) => {
      if (btn.disabled) return;
      btn.classList.add('pressed');
      setTimeout(()=>btn.classList.remove('pressed'), 120);
      const target = btn.getAttribute('data-target');
      if (target) showScreen(target);
    });
    return btn;
  }

  function createScreen(id) {
    const el = document.createElement('section');
    el.className = 'screen';
    el.id = id;

    const header = document.createElement('div');
    header.className = 'header';

    const h = document.createElement('h1');
    h.className = 'title';
    h.textContent = id.replace('-screen','').replace(/-/g,' ').replace(/\b\w/g, c=>c.toUpperCase());
    header.appendChild(h);

    const actions = document.createElement('div');
    actions.className = 'actions';

    if (id !== 'main-screen') {
      const backBtn = createButton('Назад');
      backBtn.addEventListener('click', () => navigateBack());
      actions.appendChild(backBtn);

      const closeBtn = createButton('✕');
      closeBtn.addEventListener('click', () => closeModalOrScreen());
      actions.appendChild(closeBtn);
    }

    header.appendChild(actions);
    el.appendChild(header);

    const grid = document.createElement('div');
    grid.className = 'grid';
    const buttons = (M.buttons_by_screen[id] || []);
    buttons.forEach(b => {
      const label = String(b.label || b.id || 'Кнопка');
      const target = b.target;
      const attrs = {};
      if (target) attrs['data-target'] = target;
      if (!target || !M.screens.includes(target)) attrs['disabled'] = true;
      const btn = createButton(label, attrs);
      grid.appendChild(btn);
    });
    el.appendChild(grid);

    const footer = document.createElement('div');
    footer.className = 'footer';
    footer.textContent = 'ArnoldOz • Telegram Mini App';
    el.appendChild(footer);

    return el;
  }

  // Build DOM
  const validScreens = Array.from(new Set(M.screens.concat(['main-screen'])));
  validScreens.forEach(id => app.appendChild(createScreen(id)));

  function showScreen(id){
    const current = document.querySelector('.screen.active');
    const next = document.getElementById(id);
    if (!next) return;
    if (current) {
      historyStack.push(current.id);
      current.classList.remove('active');
    }
    next.classList.add('active');

    // Telegram back button visibility
    if (window.Telegram?.WebApp?.BackButton) {
      if (id !== 'main-screen') Telegram.WebApp.BackButton.show();
      else Telegram.WebApp.BackButton.hide();
    }
    try { window.Telegram?.WebApp?.HapticFeedback?.impactOccurred('soft'); } catch(e){}
  }

  function navigateBack(){
    const prev = historyStack.pop() || 'main-screen';
    document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
    document.getElementById(prev).classList.add('active');
    if (window.Telegram?.WebApp?.BackButton) {
      if (prev !== 'main-screen') Telegram.WebApp.BackButton.show();
      else Telegram.WebApp.BackButton.hide();
    }
  }

  function closeModalOrScreen(){
    // For now: return to main screen
    historyStack.length = 0;
    document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
    document.getElementById('main-screen').classList.add('active');
    if (window.Telegram?.WebApp?.BackButton) Telegram.WebApp.BackButton.hide();
  }

  // Disable scroll
  ['html','body','#app','.screen'].forEach(sel=>{
    const el = (sel.startsWith('#') ? document.querySelector(sel) : document.querySelector(sel));
    if (el) el.style.overflow = 'hidden';
  });

  // Activate main screen by default
  showScreen('main-screen');
})();