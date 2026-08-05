(function () {
  const pageIndicator = document.getElementById('pageIndicator');
  const calendarBody = document.getElementById('calendarBody');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const counter = document.getElementById('counter');

  let pageNumber = 1;
  let cellStates = new Map();
  const STATES = [null, 'testing'];

  const TRAINING_DATES_RAW = [
    "2016-04-16", "2018-02-10", "2019-03-27", "2019-09-23", "2019-09-28", "2020-03-01",
    "2020-12-16", "2021-03-26", "2021-07-04", "2021-09-17", "2021-09-27",
    "2022-03-01", "2022-10-07", "2023-03-01", "2024-02-29", "2024-09-26",
    "2025-03-25", "2025-11-30"
  ];
  const CANDIDATE_DATES_RAW = [
      "2018-02-10", "2018-02-15", "2018-12-22", "2019-01-01",
      "2019-01-06", "2019-01-11", "2019-01-16", "2019-01-21", "2019-01-26",
      "2019-01-31", "2019-02-05", "2019-02-10", "2019-02-15", "2019-02-20",
      "2019-02-25", "2019-03-02", "2019-03-17", "2019-03-27", "2019-04-11",
      "2019-06-05", "2019-06-20", "2019-09-28", "2019-10-03", "2019-10-08",
      "2019-10-13", "2019-10-18", "2019-10-23", "2019-11-17", "2019-11-22",
      "2019-12-12", "2019-12-22", "2019-12-27", "2020-01-01", "2020-01-06",
      "2020-01-11", "2020-01-16", "2020-01-21", "2020-01-31", "2020-02-05",
      "2020-02-20", "2020-02-25", "2020-03-01", "2020-03-11", "2020-03-21",
      "2020-04-05", "2020-04-20", "2020-04-25", "2020-04-30", "2020-10-02",
      "2020-11-16", "2020-11-21", "2020-12-06", "2020-12-16", "2020-12-26",
      "2021-01-10", "2021-01-15", "2021-01-25", "2021-01-30", "2021-02-09",
      "2021-02-14", "2021-02-24", "2021-03-01", "2021-03-11", "2021-03-16",
      "2021-03-26", "2021-04-05", "2021-07-04", "2021-09-17", "2021-11-01",
      "2021-11-06", "2021-11-21", "2021-12-06", "2021-12-11", "2021-12-16",
      "2021-12-26", "2021-12-31", "2022-01-10", "2022-01-15", "2022-01-20",
      "2022-01-25", "2022-02-09", "2022-02-24", "2022-03-01", "2022-03-11",
      "2022-04-15", "2022-04-20", "2022-09-02", "2022-10-07", "2022-10-17",
      "2022-12-26", "2022-12-31", "2023-01-15", "2023-01-20", "2023-01-25",
      "2022-11-06", "2022-11-11", "2022-11-16", "2022-12-06", "2022-12-16",
      "2023-01-30", "2023-02-04", "2023-02-09", "2023-02-24", "2023-03-01",
      "2023-03-06", "2023-03-11", "2023-03-16", "2023-03-21", "2023-04-25",
      "2023-10-22", "2023-11-01", "2023-11-06", "2023-11-11", "2023-11-21",
      "2023-12-06", "2023-12-11", "2023-12-16", "2023-12-21", "2023-12-31",
      "2024-01-05", "2024-01-10", "2024-01-15", "2024-01-20", "2024-01-30",
      "2024-02-14", "2024-02-29", "2024-03-10", "2024-04-04", "2024-04-14",
      "2024-08-22", "2024-09-26", "2024-11-10", "2024-11-30", "2024-12-20",
      "2025-01-04", "2025-01-09", "2025-01-14", "2025-01-19", "2025-01-24",
      "2025-01-29", "2025-02-03", "2025-02-13", "2025-02-18", "2025-02-28",
      "2025-03-15", "2025-03-25", "2025-04-04", "2025-04-11", "2025-05-01",
      "2025-10-11", "2025-11-20", "2025-11-30", "2025-12-05", "2025-12-15",
      "2025-12-20", "2025-12-25", "2025-12-27", "2025-12-30", "2026-01-04",
      "2026-01-09", "2026-01-14", "2026-01-19", "2026-01-24", "2026-01-29",
      "2026-02-03", "2026-02-08", "2026-02-13", "2026-02-23", "2026-03-15",
      "2026-03-25", "2026-03-27", "2026-03-30"
    ];

  const TRAINING_DATE_SET = new Set(TRAINING_DATES_RAW);
  const ALL_DATES = [...TRAINING_DATES_RAW, ...CANDIDATE_DATES_RAW].sort();

  function formatLabel(iso) {
    const [y, m, d] = iso.split('-');
    return `${d}-${m}-${y}`;
  }

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
  // Global index 1 = first entry in ALL_DATES (sorted)

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

  const TOTAL = ALL_DATES.length;

  function applyGridSettings() {
    updateLayout();
    document.documentElement.style.setProperty('--col-width', `calc(100% / ${COLS})`);
    document.documentElement.style.setProperty('--cell-font-size', `${mobileFontRem}rem`);
  }

  function renderCalendar() {
    if (pageIndicator) pageIndicator.textContent = `${pageNumber} / ${maxPage()}`;
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
          const dateStr = ALL_DATES[globalDay - 1];
          const label = formatLabel(dateStr);
          const isTraining = TRAINING_DATE_SET.has(dateStr);
          const span = document.createElement('span');
          span.className = 'num';
          span.textContent = label;
          td.appendChild(span);
          td.tabIndex = 0;
          td.setAttribute('role', 'button');
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

    if (counter) counter.textContent = `Training: ${counts.training}  |  Total: ${TOTAL}  |  Done: ${counts.testing}`;
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
