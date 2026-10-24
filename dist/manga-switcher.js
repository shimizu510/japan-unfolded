(function () {
  'use strict';

  function mangaMarkup(config) {
    return '<section class="article-manga" aria-labelledby="' + config.id + '" data-manga-switcher><div class="article-manga-head"><div><span class="eyebrow">Read the manga first</span><h2 id="' + config.id + '">' + config.title + '</h2><p>Choose English or practise the same story in ' + config.level + ' Japanese.</p></div><div class="manga-language" role="group" aria-label="Choose manga language"><button class="is-active" type="button" data-manga-language="en" aria-pressed="true">English</button><button type="button" data-manga-language="ja" aria-pressed="false" lang="ja">日本語 · ' + config.level + '</button></div></div><figure class="manga-sheet"><img data-manga-image src="' + config.english + '" data-english="' + config.english + '" data-japanese="' + config.japanese + '" data-english-alt="' + config.englishAlt + '" data-japanese-alt="' + config.japaneseAlt + '" alt="' + config.englishAlt + '" width="1024" height="1536" fetchpriority="high"><figcaption data-manga-caption data-english="English edition · Start at the top right and follow panels 1–8." data-japanese="日本語版（' + config.level + 'レベル）・右上の①から番号の順に読んでください。">English edition · Start at the top right and follow panels 1–8.</figcaption></figure></section>';
  }

  var articleHero = document.querySelector('.article-hero');
  if (articleHero && !document.querySelector('[data-manga-switcher]')) {
    var config = document.body.classList.contains('toilet-page') ? {
      id: 'toilet-manga-title', title: 'Why do Japan’s toilets feel so different?', level: 'N4',
      english: 'assets/japan-toilet-manga-english.png', japanese: 'assets/japan-toilet-manga-n4.png',
      englishAlt: 'English manga about the hidden system behind Japan’s toilets, featuring TikToker YUJI at Japan',
      japaneseAlt: '日本のトイレを支える仕組みを紹介するTikToker YUJI at JapanのN4日本語漫画'
    } : null;
    if (config) articleHero.insertAdjacentHTML('afterend', mangaMarkup(config));
  }

  document.querySelectorAll('[data-manga-switcher]').forEach(function (switcher) {
    var image = switcher.querySelector('[data-manga-image]');
    var caption = switcher.querySelector('[data-manga-caption]');
    if (!image) return;
    switcher.querySelectorAll('[data-manga-language]').forEach(function (button) {
      button.addEventListener('click', function () {
        var japanese = button.dataset.mangaLanguage === 'ja';
        image.src = japanese ? image.dataset.japanese : image.dataset.english;
        image.alt = japanese ? image.dataset.japaneseAlt : image.dataset.englishAlt;
        if (caption) caption.textContent = japanese ? caption.dataset.japanese : caption.dataset.english;
        switcher.querySelectorAll('[data-manga-language]').forEach(function (item) {
          var active = item === button;
          item.classList.toggle('is-active', active);
          item.setAttribute('aria-pressed', String(active));
        });
      });
    });
  });
}());
