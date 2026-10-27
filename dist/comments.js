(function () {
  'use strict';

  if (window.__japanUnfoldedComments) return;
  window.__japanUnfoldedComments = true;

  if (document.body.classList.contains('tatemae-page')) {
    var mangaScript = document.createElement('script');
    mangaScript.src = 'manga-switcher.js?v=3';
    document.head.appendChild(mangaScript);
  }
  const article = document.querySelector('main .article, main.article > article');
  if (!article) return;

  const endpoint = 'https://us-central1-poketquest-3a73d.cloudfunctions.net/articleComments';
  const pageSlug = (location.pathname.split('/').pop() || '').replace(/\.html$/, '');
  const siteSlug = location.pathname.includes('/japan-daily-brief/') ? 'daily' : 'unfolded';
  const slug = siteSlug + '--' + pageSlug;
  if (!pageSlug) return;

  const section = document.createElement('section');
  section.className = 'reader-discussion';
  section.setAttribute('aria-labelledby', 'reader-discussion-title');
  section.innerHTML = '<div class="comment-heading"><h2 id="reader-discussion-title">Reader comments</h2><span>Any language · no account</span></div><div class="comment-list" aria-live="polite"><p class="comment-loading">Loading comments…</p></div><form class="comment-form"><label class="sr-only" for="reader-comment-input">Comment</label><input id="reader-comment-input" name="body" maxlength="500" minlength="2" required autocomplete="off" placeholder="Comment…" aria-describedby="comment-hint"><input class="comment-trap" name="website" tabindex="-1" autocomplete="off" aria-hidden="true"><button type="submit" aria-label="Send comment">↑</button><p id="comment-hint" class="comment-hint">Press Enter to post anonymously</p><p class="comment-status" role="status"></p></form>';

  const sourceBox = article.querySelector('.source-box, .sources');
  if (sourceBox) article.insertBefore(section, sourceBox);
  else article.appendChild(section);

  const form = section.querySelector('form');
  const input = form.elements.body;
  const status = section.querySelector('.comment-status');
  const list = section.querySelector('.comment-list');
  const button = form.querySelector('button');

  function formatTime(value) {
    if (!value) return '';
    return new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }).format(new Date(value));
  }

  function show(comments) {
    list.textContent = '';
    if (!comments.length) {
      const empty = document.createElement('p');
      empty.className = 'comment-empty';
      empty.textContent = 'No comments yet. Say it first.';
      list.appendChild(empty);
      return;
    }
    comments.forEach(function (comment, index) {
      const item = document.createElement('article');
      item.className = 'reader-comment';
      const avatar = document.createElement('span');
      avatar.className = 'comment-avatar';
      avatar.textContent = 'A';
      avatar.setAttribute('aria-hidden', 'true');
      const content = document.createElement('div');
      const head = document.createElement('header');
      const name = document.createElement('b');
      const time = document.createElement('time');
      const text = document.createElement('p');
      const report = document.createElement('button');
      name.textContent = 'Anonymous';
      time.textContent = formatTime(comment.createdAt);
      text.textContent = comment.body;
      report.type = 'button';
      report.className = 'comment-report';
      report.textContent = 'Report';
      report.setAttribute('aria-label', 'Report comment ' + (index + 1));
      report.addEventListener('click', async function () {
        report.disabled = true;
        try {
          await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'report', article: slug, commentID: comment.id }) });
          report.textContent = 'Reported';
        } catch (error) {
          report.disabled = false;
          report.textContent = 'Try again';
        }
      });
      head.append(name, time, report);
      content.append(head, text);
      item.append(avatar, content);
      list.appendChild(item);
    });
  }

  async function load() {
    try {
      const response = await fetch(endpoint + '?article=' + encodeURIComponent(slug), { cache: 'no-store' });
      if (!response.ok) throw new Error('load failed');
      show((await response.json()).comments || []);
    } catch (error) {
      list.innerHTML = '<p class="comment-error">Comments are unavailable right now.</p>';
    }
  }

  form.addEventListener('submit', async function (event) {
    event.preventDefault();
    const body = input.value.trim();
    if (body.length < 2) return;
    button.disabled = true;
    input.disabled = true;
    status.textContent = 'Posting…';
    try {
      const response = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'post', article: slug, body: body, website: form.elements.website.value }) });
      const result = await response.json().catch(function () { return {}; });
      if (response.status === 429) throw new Error('Please wait a moment, then try again.');
      if (!response.ok) throw new Error('Could not post. Please try again.');
      form.reset();
      status.textContent = '';
      await load();
    } catch (error) {
      status.textContent = error.message || 'Could not post. Please try again.';
    } finally {
      button.disabled = false;
      input.disabled = false;
      input.focus();
    }
  });

  load();
})();
