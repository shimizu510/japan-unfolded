(function () {
  'use strict';

  const comments = document.createElement('script');
  const siteRoot = location.pathname.includes('/japan-daily-brief/') ? '/japan-daily-brief' : '/japan-unfolded';
  comments.src = siteRoot + '/comments.js?v=2';
  comments.defer = true;
  document.head.appendChild(comments);

  const dragonBallVisual = 'https://en.dragon-ball-official.com/dragonball/en/news/2026/09/02/%E8%B6%85%E9%96%8B%E5%B9%95%E3%83%88%E3%83%AC%E3%83%BC%E3%83%A9%E3%83%BCEN%E8%A8%98%E4%BA%8B_%E3%82%B5%E3%83%A0%E3%83%8D%E3%82%A4%E3%83%AB%E6%A1%88.jpg';

  function showOfficialDragonBallVisual() {
    const isArticle = location.pathname.endsWith('/dragon-ball-beerus-world-japan-built.html');
    const isHome = /\/japan-unfolded\/(?:index\.html)?$/.test(location.pathname);
    if (!isArticle && !isHome) return;
    const image = document.querySelector(isArticle ? '.story-hero-figure img' : '.hero-media img');
    if (!image) return;
    const fallback = image.src;
    image.addEventListener('error', function restoreFallback() {
      image.removeEventListener('error', restoreFallback);
      image.src = fallback;
    });
    image.src = dragonBallVisual;
    image.alt = 'Official Dragon Ball Super: Beerus Super Surge visual featuring Goku, Beerus and other characters';
    image.classList.add('official-dragon-ball-visual');
    image.loading = 'eager';
    image.fetchPriority = 'high';
    if (isArticle) {
      const caption = document.querySelector('.story-hero-figure figcaption');
      if (caption) caption.innerHTML = 'Official <i>Dragon Ball Super: Beerus</i> Super Surge visual. Source: <a href="https://en.dragon-ball-official.com/news/01_4425.html" target="_blank" rel="noopener noreferrer">Dragon Ball Official Site ↗</a> · ©BIRD STUDIO/SHUEISHA, TOEI ANIMATION';
    }
  }

  showOfficialDragonBallVisual();

  const endpoint = 'https://firestore.googleapis.com/v1/projects/poketquest-3a73d/databases/(default)/documents/publicSiteStatus/tiktokLive';
  const defaultLiveURL = 'https://www.tiktok.com/@yuji.shimizu2/live';
  const liveLinks = 'a[href*="tiktok.com/@yuji.shimizu2"]';

  function renderLive(isLive, liveURL) {
    document.documentElement.classList.toggle('yuji-is-live', isLive);
    document.querySelectorAll(liveLinks).forEach(function (link) {
      if (!link.dataset.liveOriginalHref) link.dataset.liveOriginalHref = link.href;
      if (!link.dataset.liveOriginalHtml) link.dataset.liveOriginalHtml = link.innerHTML;
      link.classList.toggle('tiktok-live-now', isLive);
      if (isLive) {
        link.href = liveURL || defaultLiveURL;
        link.setAttribute('aria-label', 'Yuji is live on TikTok now. Watch the live stream.');
        link.innerHTML = '<span class="live-dot" aria-hidden="true"></span><span>LIVE NOW</span><strong>Watch Yuji ↗</strong>';
      } else {
        link.href = link.dataset.liveOriginalHref;
        link.innerHTML = link.dataset.liveOriginalHtml;
        link.removeAttribute('aria-label');
      }
    });
  }

  function field(fields, key, type) {
    return fields && fields[key] && fields[key][type];
  }

  async function refreshLiveStatus() {
    try {
      const response = await fetch(endpoint + '?cacheBust=' + Date.now(), { cache: 'no-store' });
      if (!response.ok) throw new Error('status unavailable');
      const fields = (await response.json()).fields || {};
      const startedAt = Date.parse(field(fields, 'startedAt', 'timestampValue') || '');
      const expiresAt = Date.parse(field(fields, 'expiresAt', 'timestampValue') || '');
      const stillCurrent = Number.isFinite(expiresAt) ? expiresAt > Date.now() : Number.isFinite(startedAt) && Date.now() - startedAt < 14400000;
      renderLive(field(fields, 'isLive', 'booleanValue') === true && stillCurrent, field(fields, 'liveUrl', 'stringValue') || defaultLiveURL);
    } catch (error) {
      renderLive(false, defaultLiveURL);
    }
  }

  refreshLiveStatus();
  setInterval(refreshLiveStatus, 45000);
  document.addEventListener('visibilitychange', function () {
    if (!document.hidden) refreshLiveStatus();
  });
})();
