const activeIntel = [
  {
    title: 'GTA VI Release Date',
    poster: '0x8c92...a7de',
    rating: 63,
    poolGoal: 1000,
    poolToken: 'USDC',
    poolCurrent: 610,
    supporters: 842,
  },
  {
    title: "Barron Trump's Real ETH Wallet",
    poster: '0xa573...0f9c',
    rating: 45,
    poolGoal: 1500,
    poolToken: 'USDC',
    poolCurrent: 865,
    supporters: 623,
  },
  {
    title: 'Apple AR Glasses Price',
    poster: '0xc913...74e6',
    rating: 12,
    poolGoal: 900,
    poolToken: 'USDC',
    poolCurrent: 730,
    supporters: 488,
  },
  {
    title: 'Whale Behind the MEME Token',
    poster: '0x573f...95cb',
    rating: -12,
    poolGoal: 800,
    poolToken: 'USDC',
    poolCurrent: 505,
    supporters: 399,
  },
  {
    title: 'US Election SuperPAC Leak',
    poster: '0xb23a...44d1',
    rating: 71,
    poolGoal: 4500,
    poolToken: 'USDC',
    poolCurrent: 3360,
    supporters: 1120,
  },
];

const releasedIntel = [
  {
    title: 'The Major Tech CEO Exposed',
    releasedBy: 'Published on The Disclosure',
    tag: 'Public',
  },
  {
    title: 'Top Secret Military Operation',
    releasedBy: 'Published on MirrorLeaks',
    tag: 'Declassified',
  },
  {
    title: 'Election Meddling Playbook',
    releasedBy: 'Published on ZeroDay DAO',
    tag: 'Verified',
  },
  {
    title: 'Private Equity Bribery Ring',
    releasedBy: 'Published on ChainSleuth',
    tag: 'Unlocked',
  },
];

const tickerHeadlines = [
  'Bitcoin ETF Approval Next Month?',
  'Hidden Celebrity Romances',
  'Leaked Government AI Budget',
  'Mystery Wallet Funding Political PACs',
  'UFO Crash Materials in Nevada Lab',
  'Global Macro Desk Insider Trades',
];

function renderTicker() {
  const ticker = document.getElementById('headlineTicker');
  if (!ticker) return;

  const fullList = [...tickerHeadlines, ...tickerHeadlines];
  fullList.forEach((headline) => {
    const span = document.createElement('span');
    span.className = 'ticker-item';
    span.textContent = headline;
    ticker.appendChild(span);
  });
}

function renderIntel() {
  const grid = document.getElementById('intelGrid');
  if (!grid) return;

  activeIntel.forEach((intel) => {
    const card = document.createElement('article');
    card.className = 'intel-card';

    const progressPercent = Math.min(100, Math.round((intel.poolCurrent / intel.poolGoal) * 100));
    const ratingClass = intel.rating < 0 ? 'rating negative' : 'rating';
    const ratingSymbol = intel.rating < 0 ? '−' : '+';

    card.innerHTML = `
      <div class="card-header">
        <h3 class="intel-title">${intel.title}</h3>
        <span class="pool-balance">${intel.poolCurrent.toLocaleString()} / ${intel.poolGoal.toLocaleString()} ${intel.poolToken}</span>
      </div>
      <div class="whistle-meta">
        <span class="poster">${intel.poster}</span>
        <span class="${ratingClass}">${ratingSymbol}${Math.abs(intel.rating)}</span>
      </div>
      <div class="progress-bar" role="progressbar" aria-valuemin="0" aria-valuemax="${intel.poolGoal}" aria-valuenow="${intel.poolCurrent}">
        <span style="width: ${progressPercent}%"></span>
      </div>
      <div class="milestone-labels">
        <span>Pool status</span>
        <span>${progressPercent}% funded</span>
      </div>
      <div class="call-to-action">
        <button type="button">Fund Intel</button>
        <span class="supporters">${intel.supporters} supporters</span>
      </div>
    `;

    grid.appendChild(card);
  });
}

function renderReleased() {
  const list = document.getElementById('releasedList');
  if (!list) return;

  releasedIntel.forEach((release) => {
    const item = document.createElement('div');
    item.className = 'released-item';
    item.innerHTML = `
      <div class="release-meta">
        <h4 class="release-title">${release.title}</h4>
        <span class="release-platform">${release.releasedBy}</span>
      </div>
      <span class="release-tag">${release.tag}</span>
    `;
    list.appendChild(item);
  });
}

renderTicker();
renderIntel();
renderReleased();
