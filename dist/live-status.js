(function () {
  'use strict';

  const comments = document.createElement('script');
  const siteRoot = location.pathname.includes('/japan-daily-brief/') ? '/japan-daily-brief' : '/japan-unfolded';
  const assetRoot = /^(localhost|127\.0\.0\.1)$/.test(location.hostname) ? '' : siteRoot;
  const searchStyles = document.createElement('link');
  searchStyles.rel = 'stylesheet';
  searchStyles.href = assetRoot + '/search.css?v=1';
  document.head.appendChild(searchStyles);
  comments.src = assetRoot + '/comments.js?v=3';
  comments.defer = true;
  document.head.appendChild(comments);
  const mangaSwitcher = document.createElement('script');
  mangaSwitcher.src = assetRoot + '/manga-switcher.js?v=3';
  mangaSwitcher.defer = true;
  document.head.appendChild(mangaSwitcher);

  function installSiteSearch() {
    const header = document.querySelector('header');
    if (!header) return;
    const search = document.createElement('section');
    search.className = 'site-search';
    search.setAttribute('aria-label', 'Search this site');
    search.innerHTML = '<form class="site-search-form"><label for="site-search-input">Search every story</label><div><input id="site-search-input" type="search" minlength="2" placeholder="Try: anime, travel, Tokyo…" autocomplete="off"><button type="submit">Search</button></div><p>Searches titles and article text—not only exact headlines.</p></form><div class="site-search-panel" hidden><div class="site-search-status" aria-live="polite"></div><ol class="site-search-results"></ol></div>';
    header.insertAdjacentElement('afterend', search);
    const form = search.querySelector('form'), input = search.querySelector('input'), panel = search.querySelector('.site-search-panel'), status = search.querySelector('.site-search-status'), results = search.querySelector('.site-search-results');
    let pagesPromise;
    function loadPages() { if (pagesPromise) return pagesPromise; status.textContent = 'Reading the archive…'; pagesPromise = fetch(assetRoot + '/sitemap.xml').then(r => r.text()).then(xml => Promise.all(Array.from(new DOMParser().parseFromString(xml, 'application/xml').querySelectorAll('loc')).map(n => n.textContent).filter(url => /\.html$/.test(url) && !/(about|google)/.test(url)).map(url => { const target = /^(localhost|127\.0\.0\.1)$/.test(location.hostname) ? new URL(url).pathname.split('/').pop() : url; return fetch(target).then(r => r.text()).then(html => { const doc = new DOMParser().parseFromString(html, 'text/html'); doc.querySelectorAll('nav,footer,aside,script,style,.mobile-brand-bar').forEach(n => n.remove()); return {url:target, title:(doc.querySelector('h1') || doc.querySelector('title')).textContent.trim(), description:(doc.querySelector('meta[name="description"]') || {}).content || '', text:(doc.querySelector('main') || doc.body).textContent.replace(/\s+/g,' ').trim()}; }).catch(() => null); }))).then(items => items.filter(Boolean)); return pagesPromise; }
    function snippet(text, terms) { const lower=text.toLowerCase(); let at=lower.length; terms.forEach(t=>{const i=lower.indexOf(t);if(i>=0&&i<at)at=i;}); if(at===lower.length)at=0; return (at>70?'…':'')+text.slice(Math.max(0,at-70),at+190).trim()+(at+190<text.length?'…':''); }
    async function runSearch(query) { const terms=query.toLowerCase().trim().split(/\s+/).filter(t=>t.length>1); panel.hidden=false; results.innerHTML=''; if(!terms.length){status.textContent='Enter at least two letters.';return;} const pages=await loadPages(); const ranked=pages.map(page=>{const title=page.title.toLowerCase(),desc=page.description.toLowerCase(),body=page.text.toLowerCase();let score=0;terms.forEach(t=>{if(title.includes(t))score+=60;if(desc.includes(t))score+=24;score+=Math.min(20,body.split(t).length-1);});if(body.includes(terms.join(' ')))score+=25;return{page,score};}).filter(x=>x.score>0).sort((a,b)=>b.score-a.score).slice(0,8);status.textContent=ranked.length?ranked.length+' likely match'+(ranked.length===1?'':'es'):'No matching stories found.';ranked.forEach(({page})=>{const li=document.createElement('li');li.innerHTML='<a></a><p></p>';li.querySelector('a').href=page.url;li.querySelector('a').textContent=page.title;li.querySelector('p').textContent=snippet(page.text,terms);results.appendChild(li);}); }
    form.addEventListener('submit',e=>{e.preventDefault();runSearch(input.value);});
  }

  function addHomepageArchiveStories() {
    if (!/(?:\/japan-unfolded)?\/(?:index\.html)?$/.test(location.pathname)) return;
    const grid = document.querySelector('#stories .grid3');
    if (!grid) return;
    grid.insertAdjacentHTML('afterend','<section class="home-more-stories"><div class="home-more-heading"><div><span class="eyebrow">Continue reading</span><h2>Next 4 stories · October 8–12</h2></div><strong>11 feature stories shown on this page</strong></div><div class="home-more-grid"><a href="why-jujutsu-kaisen-pulls-us-in.html"><time>Oct. 12</time><b>Why <i>Jujutsu Kaisen</i> pulls us in.</b><span>Anime · Culture</span></a><a href="oda-nobunaga-guns-city.html"><time>Oct. 11</time><b>The warlord, the guns and the city.</b><span>History · Places</span></a><a href="best-time-to-visit-japan.html"><time>Oct. 9</time><b>The best time to visit Japan depends on what you want.</b><span>Travel · Seasons</span></a><a href="fuji.html"><time>Oct. 8</time><b>Mount Fuji is more than the perfect view.</b><span>Places · Culture</span></a></div></section>');
  }

  function installTrainingLabReturn() {
    if (document.querySelector('.training-lab-return')) return;
    const link = document.createElement('a');
    link.className = 'training-lab-return';
    link.href = 'https://shimizu510.github.io/japanese-training-lab/';
    link.setAttribute('aria-label', 'Return to Japanese Training Lab and start a free Japanese lesson');
    link.innerHTML = '<b aria-hidden="true">あ</b><span><small>FREE JAPANESE LESSONS</small><strong>Learn Japanese</strong></span><i aria-hidden="true">↗</i>';
    document.body.appendChild(link);
  }

  installSiteSearch();
  addHomepageArchiveStories();
  installTrainingLabReturn();

  const dragonBallVisual = 'https://en.dragon-ball-official.com/dragonball/en/news/2026/09/02/%E8%B6%85%E9%96%8B%E5%B9%95%E3%83%88%E3%83%AC%E3%83%BC%E3%83%A9%E3%83%BCEN%E8%A8%98%E4%BA%8B_%E3%82%B5%E3%83%A0%E3%83%8D%E3%82%A4%E3%83%AB%E6%A1%88.jpg';

  function showOfficialDragonBallVisual() {
    const isArticle = location.pathname.endsWith('/dragon-ball-beerus-world-japan-built.html');
    const isHome = /\/japan-unfolded\/(?:index\.html)?$/.test(location.pathname) && document.querySelector('.hero:first-of-type')?.classList.contains('dragon-ball-home');
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
  const visitEndpoint = 'https://us-central1-poketquest-3a73d.cloudfunctions.net/trackPublicSiteVisit';

  function recordVisit() {
    if (/^(localhost|127\.0\.0\.1)$/.test(location.hostname)) return;
    fetch(visitEndpoint + '?site=japan-unfolded', {
      method: 'POST', mode: 'cors', credentials: 'omit', keepalive: true
    }).catch(function () {});
  }

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

  function addMangaPracticeLink() {
    const intro = document.querySelector('.manga-showcase-head > div');
    if (!intro || intro.querySelector('.manga-study-link')) return;
    const showcase = intro.closest('[data-manga-switcher]');
    const level = showcase && showcase.dataset.mangaStudyLevel
      ? showcase.dataset.mangaStudyLevel.toLowerCase()
      : 'n5';
    const foundation = level === 'foundation';
    const link = document.createElement('a');
    link.className = 'manga-study-link';
    link.href = foundation
      ? 'https://shimizu510.github.io/japanese-training-lab/learn/foundation/manga/?view=manga#manga-reader'
      : 'https://shimizu510.github.io/japanese-training-lab/learn/' + level + '/manga/?view=manga#manga-reader';
    link.textContent = foundation
      ? 'Practice the foundation Japanese in this manga ↗'
      : 'Practice the Japanese in this ' + level.toUpperCase() + ' manga ↗';
    link.style.cssText = 'display:inline-flex;margin-top:12px;padding:11px 16px;border-radius:999px;background:#ef4c3b;color:#fff;font-weight:900';
    const note = document.createElement('small');
    note.textContent = 'Free · No signup · Continue in DraMap';
    note.style.cssText = 'display:block;margin-top:7px;color:#5a655f;font-size:.7rem';
    intro.append(link, note);
  }

  async function refreshLiveStatus() {
    try {
      // Firestore's get-document REST endpoint rejects unknown query
      // parameters. Browser cache directives are sufficient here and keep the
      // request valid.
      const response = await fetch(endpoint, { cache: 'no-store' });
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

  const categoryCatalog = {
    manga: { label: 'MANGA & ANIME', title: 'Enter Japan through stories.', image: 'assets/manga-editorial.jpg', stories: [
      ['Manga culture', 'Why Jujutsu Kaisen pulls us in', 'why-jujutsu-kaisen-pulls-us-in.html'],
      ['Anime worlds', 'The Japan that built Beerus’s world', 'dragon-ball-beerus-world-japan-built.html'],
      ['Manga first', 'Browse every Japan Unfolded manga', 'manga.html']
    ]},
    games: { label: 'GAMES & POP CULTURE', title: 'See the real Japan behind play.', image: 'assets/pokemon-japanese-squirrel.jpg', stories: [
      ['Games & nature', 'The real creatures behind Pokémon', 'real-creatures-behind-pokemon.html'],
      ['Akihabara', 'One tiny part unlocks Akihabara', 'akihabara-guide.html'],
      ['Capsule culture', 'Japan’s craziest capsule toys', 'japans-craziest-capsule-toys.html']
    ]},
    people: { label: 'LIFE & CONNECTION', title: 'Understand how people live and connect.', image: 'assets/japan-school-commute-walking.jpg', stories: [
      ['Everyday Japan', 'Why Japanese children commute alone', 'why-japanese-children-commute-alone.html'],
      ['Social language', 'What tatemae and honne really mean', 'what-are-tatemae-and-honne.html'],
      ['People & place', 'The cat who became a stationmaster', 'the-cat-who-became-a-stationmaster.html']
    ]},
    work: { label: 'WORK & SOCIETY', title: 'Read the culture behind working in Japan.', image: 'assets/honne-tatemae-noh-mask.jpg', stories: [
      ['Work in Japan', 'Japan jobs: pay, popularity and the world', 'japan-jobs-pay-popularity-world.html'],
      ['Communication', 'What tatemae and honne really mean', 'what-are-tatemae-and-honne.html'],
      ['Small society', 'Five surprising facts about Japanese school life', 'japanese-school-life-surprising-facts.html']
    ]},
    folklore: { label: 'FOLKLORE & YOKAI', title: 'Step into Japan’s mysteries.', image: 'assets/old-wells-ghost-stories-hero.jpg', stories: [
      ['Ghost stories', 'Why old wells became doors for ghosts', 'old-wells-ghost-stories-japan.html'],
      ['Urban legend', 'Aka Manto: red or blue?', 'aka-manto-red-or-blue.html'],
      ['Urban legend', 'Kuchisake-onna: Am I beautiful?', 'kuchisake-onna-am-i-beautiful.html']
    ]},
    food: { label: 'FOOD & TRADITIONS', title: 'Taste the history inside everyday Japan.', image: 'assets/sushi-nigiri-hero.jpg', stories: [
      ['Food history', 'Sushi wasn’t always like this', 'sushi-wasnt-always-like-this.html'],
      ['Ramen culture', 'Why ramen shops feel like a system', 'why-japan-ramen-shops-feel-like-a-system.html'],
      ['Daily life', 'Why Japanese convenience stores feel different', 'japan-konbini-convenience-stores.html']
    ]},
    travel: { label: 'TRAVEL & PLACES', title: 'Find the Japan you want to see.', image: 'assets/top5-fuji.jpg', stories: [
      ['Mount Fuji', 'Mount Fuji from every side', 'mount-fuji-every-side.html'],
      ['First journey', 'Japan’s top five places', 'japan-top-5-places.html'],
      ['Travel guide', 'Five things to know before your first trip', 'first-trip-japan-5-things.html']
    ]}
  };

  function installCategoryGateway() {
    const gateway = document.querySelector('.category-gateway');
    if (!gateway) return;
    const results = gateway.querySelector('#category-results');
    const title = results.querySelector('[data-category-title]');
    const kicker = results.querySelector('[data-category-kicker]');
    const grid = results.querySelector('[data-category-stories]');
    const links = Array.from(gateway.querySelectorAll('[data-category-link]'));

    function selectCategory(key, shouldScroll) {
      const category = categoryCatalog[key];
      if (!category) return;
      links.forEach(function (link) {
        const active = link.dataset.categoryLink === key;
        link.classList.toggle('is-active', active);
        if (active) link.setAttribute('aria-current', 'true');
        else link.removeAttribute('aria-current');
      });
      kicker.textContent = category.label;
      title.textContent = category.title;
      grid.replaceChildren.apply(grid, category.stories.map(function (story) {
        const link = document.createElement('a');
        link.className = 'category-story';
        link.href = story[2];
        const image = document.createElement('img');
        image.src = category.image;
        image.alt = '';
        image.loading = 'lazy';
        const copy = document.createElement('span');
        const tag = document.createElement('small');
        tag.textContent = story[0];
        const name = document.createElement('strong');
        name.textContent = story[1];
        copy.append(tag, name);
        link.append(image, copy);
        return link;
      }));
      results.hidden = false;
      const url = new URL(location.href);
      url.searchParams.set('category', key);
      url.hash = 'category-results';
      history.replaceState(null, '', url);
      if (shouldScroll) results.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    links.forEach(function (link) {
      link.addEventListener('click', function (event) {
        event.preventDefault();
        selectCategory(link.dataset.categoryLink, true);
      });
    });
    results.querySelector('[data-category-close]').addEventListener('click', function () {
      results.hidden = true;
      links.forEach(function (link) { link.classList.remove('is-active'); link.removeAttribute('aria-current'); });
      const url = new URL(location.href);
      url.searchParams.delete('category');
      url.hash = '';
      history.replaceState(null, '', url);
      gateway.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    const initial = new URLSearchParams(location.search).get('category');
    if (categoryCatalog[initial]) selectCategory(initial, location.hash === '#category-results');
  }

  recordVisit();
  addMangaPracticeLink();
  installCategoryGateway();
  refreshLiveStatus();
  setInterval(refreshLiveStatus, 45000);
  document.addEventListener('visibilitychange', function () {
    if (!document.hidden) refreshLiveStatus();
  });
})();
