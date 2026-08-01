(function () {
  const monthLabel = document.getElementById('monthLabel');
  const calendarBody = document.getElementById('calendarBody');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const counter = document.getElementById('counter');

  let pageNumber = 1;
  let cellStates = new Map();
  const STATES = [null, 'testing'];

  // Replace with real global day indices (1–200) when data is ready
  const TRAINING_DAYS = new Set([2, 5, 9, 13, 17, 21, 25, 29, 33, 37, 42, 46, 50, 55, 60, 65, 70, 75, 80, 86, 91, 96, 102, 108, 115, 122, 130, 138, 146, 155, 163, 172, 181, 190, 198]);

  let COLS = 10;
  let ROWS = 7;
  const mobileFontRem = 0.65;
  const MOBILE_BREAKPOINT = 640;
  const pageSize = () => COLS * ROWS;
  const maxPage = () => Math.ceil(TOTAL / pageSize());

  function updateLayout() {
    const isMobile = window.innerWidth <= MOBILE_BREAKPOINT;
    COLS = isMobile ? 5 : 10;
    ROWS = isMobile ? 14 : 7;
  }
  // Global index 1 = 2026-08-01 (first key in CUSTOM_DATES)
  const BASE = new Date(2026, 7, 1);

  // 200 entries: calendar keys 2026-08-01→2027-02-16, displayed as 01-01-2025→19-07-2025
  const CUSTOM_DATES = {
    "2026-08-01": "01-01-2025", "2026-08-02": "02-01-2025", "2026-08-03": "03-01-2025",
    "2026-08-04": "04-01-2025", "2026-08-05": "05-01-2025", "2026-08-06": "06-01-2025",
    "2026-08-07": "07-01-2025", "2026-08-08": "08-01-2025", "2026-08-09": "09-01-2025",
    "2026-08-10": "10-01-2025", "2026-08-11": "11-01-2025", "2026-08-12": "12-01-2025",
    "2026-08-13": "13-01-2025", "2026-08-14": "14-01-2025", "2026-08-15": "15-01-2025",
    "2026-08-16": "16-01-2025", "2026-08-17": "17-01-2025", "2026-08-18": "18-01-2025",
    "2026-08-19": "19-01-2025", "2026-08-20": "20-01-2025", "2026-08-21": "21-01-2025",
    "2026-08-22": "22-01-2025", "2026-08-23": "23-01-2025", "2026-08-24": "24-01-2025",
    "2026-08-25": "25-01-2025", "2026-08-26": "26-01-2025", "2026-08-27": "27-01-2025",
    "2026-08-28": "28-01-2025", "2026-08-29": "29-01-2025", "2026-08-30": "30-01-2025",
    "2026-08-31": "31-01-2025",

    "2026-09-01": "01-02-2025", "2026-09-02": "02-02-2025", "2026-09-03": "03-02-2025",
    "2026-09-04": "04-02-2025", "2026-09-05": "05-02-2025", "2026-09-06": "06-02-2025",
    "2026-09-07": "07-02-2025", "2026-09-08": "08-02-2025", "2026-09-09": "09-02-2025",
    "2026-09-10": "10-02-2025", "2026-09-11": "11-02-2025", "2026-09-12": "12-02-2025",
    "2026-09-13": "13-02-2025", "2026-09-14": "14-02-2025", "2026-09-15": "15-02-2025",
    "2026-09-16": "16-02-2025", "2026-09-17": "17-02-2025", "2026-09-18": "18-02-2025",
    "2026-09-19": "19-02-2025", "2026-09-20": "20-02-2025", "2026-09-21": "21-02-2025",
    "2026-09-22": "22-02-2025", "2026-09-23": "23-02-2025", "2026-09-24": "24-02-2025",
    "2026-09-25": "25-02-2025", "2026-09-26": "26-02-2025", "2026-09-27": "27-02-2025",
    "2026-09-28": "28-02-2025", "2026-09-29": "01-03-2025", "2026-09-30": "02-03-2025",

    "2026-10-01": "03-03-2025", "2026-10-02": "04-03-2025", "2026-10-03": "05-03-2025",
    "2026-10-04": "06-03-2025", "2026-10-05": "07-03-2025", "2026-10-06": "08-03-2025",
    "2026-10-07": "09-03-2025", "2026-10-08": "10-03-2025", "2026-10-09": "11-03-2025",
    "2026-10-10": "12-03-2025", "2026-10-11": "13-03-2025", "2026-10-12": "14-03-2025",
    "2026-10-13": "15-03-2025", "2026-10-14": "16-03-2025", "2026-10-15": "17-03-2025",
    "2026-10-16": "18-03-2025", "2026-10-17": "19-03-2025", "2026-10-18": "20-03-2025",
    "2026-10-19": "21-03-2025", "2026-10-20": "22-03-2025", "2026-10-21": "23-03-2025",
    "2026-10-22": "24-03-2025", "2026-10-23": "25-03-2025", "2026-10-24": "26-03-2025",
    "2026-10-25": "27-03-2025", "2026-10-26": "28-03-2025", "2026-10-27": "29-03-2025",
    "2026-10-28": "30-03-2025", "2026-10-29": "31-03-2025", "2026-10-30": "01-04-2025",
    "2026-10-31": "02-04-2025",

    "2026-11-01": "03-04-2025", "2026-11-02": "04-04-2025", "2026-11-03": "05-04-2025",
    "2026-11-04": "06-04-2025", "2026-11-05": "07-04-2025", "2026-11-06": "08-04-2025",
    "2026-11-07": "09-04-2025", "2026-11-08": "10-04-2025", "2026-11-09": "11-04-2025",
    "2026-11-10": "12-04-2025", "2026-11-11": "13-04-2025", "2026-11-12": "14-04-2025",
    "2026-11-13": "15-04-2025", "2026-11-14": "16-04-2025", "2026-11-15": "17-04-2025",
    "2026-11-16": "18-04-2025", "2026-11-17": "19-04-2025", "2026-11-18": "20-04-2025",
    "2026-11-19": "21-04-2025", "2026-11-20": "22-04-2025", "2026-11-21": "23-04-2025",
    "2026-11-22": "24-04-2025", "2026-11-23": "25-04-2025", "2026-11-24": "26-04-2025",
    "2026-11-25": "27-04-2025", "2026-11-26": "28-04-2025", "2026-11-27": "29-04-2025",
    "2026-11-28": "30-04-2025", "2026-11-29": "01-05-2025", "2026-11-30": "02-05-2025",

    "2026-12-01": "03-05-2025", "2026-12-02": "04-05-2025", "2026-12-03": "05-05-2025",
    "2026-12-04": "06-05-2025", "2026-12-05": "07-05-2025", "2026-12-06": "08-05-2025",
    "2026-12-07": "09-05-2025", "2026-12-08": "10-05-2025", "2026-12-09": "11-05-2025",
    "2026-12-10": "12-05-2025", "2026-12-11": "13-05-2025", "2026-12-12": "14-05-2025",
    "2026-12-13": "15-05-2025", "2026-12-14": "16-05-2025", "2026-12-15": "17-05-2025",
    "2026-12-16": "18-05-2025", "2026-12-17": "19-05-2025", "2026-12-18": "20-05-2025",
    "2026-12-19": "21-05-2025", "2026-12-20": "22-05-2025", "2026-12-21": "23-05-2025",
    "2026-12-22": "24-05-2025", "2026-12-23": "25-05-2025", "2026-12-24": "26-05-2025",
    "2026-12-25": "27-05-2025", "2026-12-26": "28-05-2025", "2026-12-27": "29-05-2025",
    "2026-12-28": "30-05-2025", "2026-12-29": "31-05-2025", "2026-12-30": "01-06-2025",
    "2026-12-31": "02-06-2025",

    "2027-01-01": "03-06-2025", "2027-01-02": "04-06-2025", "2027-01-03": "05-06-2025",
    "2027-01-04": "06-06-2025", "2027-01-05": "07-06-2025", "2027-01-06": "08-06-2025",
    "2027-01-07": "09-06-2025", "2027-01-08": "10-06-2025", "2027-01-09": "11-06-2025",
    "2027-01-10": "12-06-2025", "2027-01-11": "13-06-2025", "2027-01-12": "14-06-2025",
    "2027-01-13": "15-06-2025", "2027-01-14": "16-06-2025", "2027-01-15": "17-06-2025",
    "2027-01-16": "18-06-2025", "2027-01-17": "19-06-2025", "2027-01-18": "20-06-2025",
    "2027-01-19": "21-06-2025", "2027-01-20": "22-06-2025", "2027-01-21": "23-06-2025",
    "2027-01-22": "24-06-2025", "2027-01-23": "25-06-2025", "2027-01-24": "26-06-2025",
    "2027-01-25": "27-06-2025", "2027-01-26": "28-06-2025", "2027-01-27": "29-06-2025",
    "2027-01-28": "30-06-2025", "2027-01-29": "01-07-2025", "2027-01-30": "02-07-2025",
    "2027-01-31": "03-07-2025",

    "2027-02-01": "04-07-2025", "2027-02-02": "05-07-2025", "2027-02-03": "06-07-2025",
    "2027-02-04": "07-07-2025", "2027-02-05": "08-07-2025", "2027-02-06": "09-07-2025",
    "2027-02-07": "10-07-2025", "2027-02-08": "11-07-2025", "2027-02-09": "12-07-2025",
    "2027-02-10": "13-07-2025", "2027-02-11": "14-07-2025", "2027-02-12": "15-07-2025",
    "2027-02-13": "16-07-2025", "2027-02-14": "17-07-2025", "2027-02-15": "18-07-2025",
    "2027-02-16": "19-07-2025",
  };

  function globalKey(n) {
    const d = new Date(BASE);
    d.setDate(d.getDate() + n - 1);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }

  const BIN_ID = '6a67022cf5f4af5e29c66d2b';
  const API_KEY = '$2a$10$tcV2oq9UU3be3ApDEkP8XexPYCgi9tOwNStFJ3ukLZa9eUEV4etUC';
  const API_URL = `https://api.jsonbin.io/v3/b/${BIN_ID}`;

  function setServerStatus(online) {
    const badge = document.getElementById('sync-badge');
    if (!badge) return;
    badge.textContent = online ? '● LIVE SYNC' : '○ OFFLINE';
    badge.className = `sync-badge ${online ? 'online' : 'offline'}`;
  }

  async function syncToServer() {
    try {
      const data = {};
      for (let p = 1; p <= Math.ceil(200 / (10 * 7)) + 1; p++) {
        const raw = localStorage.getItem(storageKey(p));
        if (raw) data[`page_${p}`] = JSON.parse(raw);
      }
      const res = await fetch(API_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'X-Master-Key': API_KEY },
        body: JSON.stringify(data)
      });
      setServerStatus(res.ok);
    } catch (e) { setServerStatus(false); }
  }

  async function fetchFromServer() {
    try {
      const res = await fetch(`${API_URL}/latest`, { headers: { 'X-Master-Key': API_KEY } });
      if (res.ok) {
        const result = await res.json();
        const data = result.record;
        if (data && typeof data === 'object') {
          let changed = false;
          for (const key of Object.keys(data)) {
            const pageMatch = key.match(/^page_(\d+)$/);
            if (pageMatch) {
              const p = Number(pageMatch[1]);
              const val = JSON.stringify(data[key]);
              if (localStorage.getItem(storageKey(p)) !== val) {
                localStorage.setItem(storageKey(p), val);
                changed = true;
              }
            }
          }
          if (changed) {
            cellStates = loadPageState(pageNumber);
            renderCalendar();
          }
          setServerStatus(true);
        }
      } else { setServerStatus(false); }
    } catch (e) { setServerStatus(false); }
  }

  function storageKey(page) {
    return `timeline-toggles:page-${page}`;
  }

  function loadPageState(page) {
    try {
      const raw = localStorage.getItem(storageKey(page));
      if (raw) {
        const obj = JSON.parse(raw);
        if (obj && !Array.isArray(obj)) return new Map(Object.entries(obj));
      }
      return new Map();
    } catch (e) { return new Map(); }
  }

  function savePageState(page, map) {
    try {
      localStorage.setItem(storageKey(page), JSON.stringify(Object.fromEntries(map)));
      syncToServer();
    } catch (e) { console.error('Could not save toggle state', e); }
  }

  const TOTAL = Object.keys(CUSTOM_DATES).length;

  function applyGridSettings() {
    updateLayout();
    document.documentElement.style.setProperty('--col-width', `calc(100% / ${COLS})`);
    document.documentElement.style.setProperty('--cell-font-size', `${mobileFontRem}rem`);
  }

  function renderCalendar() {
    monthLabel.textContent = `Page ${pageNumber}`;
    calendarBody.innerHTML = '';

    const startGlobal = (pageNumber - 1) * pageSize() + 1;
    let counts = { training: 0, testing: 0, none: 0 };
    let shown = 0;

    for (let row = 0; row < ROWS; row++) {
      const tr = document.createElement('tr');
      for (let col = 0; col < COLS; col++) {
        const pos = row * COLS + col + 1; // 1-based position within this page
        const globalDay = startGlobal + pos - 1;
        const td = document.createElement('td');
        td.className = 'calendar__day__cell';
        if (globalDay > TOTAL) {
          td.classList.add('empty');
        } else {
          const label = CUSTOM_DATES[globalKey(globalDay)] || String(globalDay);
          const span = document.createElement('span');
          span.className = 'num';
          span.textContent = label;
          td.appendChild(span);
          td.tabIndex = 0;
          td.setAttribute('role', 'button');
          const isTraining = TRAINING_DAYS.has(globalDay);
          const state = isTraining ? 'training' : (cellStates.get(String(pos)) || null);
          td.setAttribute('aria-pressed', state ? 'true' : 'false');
          td.setAttribute('aria-label', `${label}, ${state || 'none'}`);
          if (state) td.classList.add(`is-${state}`);
          shown++;
          counts[state || 'none']++;

          if (!isTraining) {
            const toggle = () => {
              const cur = cellStates.get(String(pos)) || null;
              const next = STATES[(STATES.indexOf(cur) + 1) % STATES.length];
              if (next === null) cellStates.delete(String(pos));
              else cellStates.set(String(pos), next);
              savePageState(pageNumber, cellStates);
              renderCalendar();
            };
            td.addEventListener('click', toggle);
            td.addEventListener('keydown', (e) => {
              if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); }
            });
          } else {
            td.tabIndex = -1;
          }
        }
        tr.appendChild(td);
      }
      calendarBody.appendChild(tr);
    }

    counter.textContent = `Training: ${counts.training}  |  Total: ${shown}  |  Done: ${counts.testing}`;
  }

  function goToPage(page) {
    pageNumber = page;
    cellStates = loadPageState(pageNumber);
    localStorage.setItem('timeline-last-page', pageNumber);
    renderCalendar();
  }

  prevBtn.addEventListener('click', () => {
    if (pageNumber > 1) goToPage(pageNumber - 1);
  });

  nextBtn.addEventListener('click', () => {
    if (pageNumber < maxPage()) goToPage(pageNumber + 1);
  });

  ['colsSelect', 'rowsSelect', 'fontSelect'].forEach(id => {
    const sel = document.getElementById(id);
    if (!sel) return;
    sel.addEventListener('change', () => {
      if (id === 'colsSelect') COLS = Number(sel.value);
      if (id === 'rowsSelect') ROWS = Number(sel.value);
      if (id === 'fontSelect') mobileFontRem = Number(sel.value);
      localStorage.setItem('timeline-cols', COLS);
      localStorage.setItem('timeline-rows', ROWS);
      localStorage.setItem('timeline-font', mobileFontRem);
      if (pageNumber > maxPage()) pageNumber = maxPage();
      applyGridSettings();
      renderCalendar();
    });
  });

  const resetBtn = document.getElementById('resetBtn');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      cellStates = new Map();
      savePageState(pageNumber, cellStates);
      renderCalendar();
    });
  }

  window.addEventListener('resize', () => {
    applyGridSettings();
    renderCalendar();
  });

  applyGridSettings();
  fetchFromServer().then(() => goToPage(Number(localStorage.getItem('timeline-last-page')) || 1));
  setInterval(fetchFromServer, 3000);
})();
