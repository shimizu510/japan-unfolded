# Article promotion standard

Every new culture article must include the existing desktop `yuji-rail` and mobile `mobile-brand-bar`, with Yuji's portrait and these two promises:

- TikTok: **Watch LIVE Japan with Yuji**
- DraMap: **Learn Japanese while playing**

Use the production URLs already present in the site. The desktop card must remain visible while the reader scrolls. The mobile bar must remain compact and must not obscure article text. It must always show Yuji's portrait plus both actions—`LIVE Japan` and `Learn Japanese`—including on phones 520px wide or narrower. Never hide the DraMap action to make the bar fit. Use safe-area-aware bottom spacing so the bar does not cover article text, links, embedded video controls, or the iPhone home indicator. Do not publish a new article without Yuji's face and both promises.

The homepage hero must place a visible **Read the full story →** link immediately after the featured story's introduction. Do not rely only on a linked image or a second card below the fold. On mobile, keep the title, introduction and this link before the hero image so an intrinsically tall image cannot push the action out of the first view.

The homepage must also expose Yuji, TikTok LIVE and DraMap through the shared compact promotion: `home-promo` on desktop and `mobile-brand-bar` below 1200px. Both actions must remain visible; neither may cover navigation, editorial text, media controls or the story CTA.

At 1366×768, the article rail must show Yuji's image, identity, both promises, **WATCH LIVE JAPAN** and the complete **GET DRAMAP FOR IOS** label without scrolling. Reduce image height, copy or spacing before allowing either action to fall below the viewport. Verify the homepage and new article at 1366×768, at 1440×900 or larger, and at 390×844. Confirm there is no horizontal scrolling.

The desktop rail must sit against the browser edge, outside the article's readable measure, with a visible gutter between card and text. If the viewport cannot fit the article, gutter and full 205px card together, switch to the mobile bar early; never let the desktop card cover copy.

Hero and story images need explicit responsive heights, `object-fit` and intentional `object-position` values. Mobile content order and image dimensions must protect the primary story CTA. Preserve Japan Unfolded's own visual identity rather than copying Japan Daily Brief.

Travel and seasonal features must state the practical trade-offs, not only the visual appeal: crowd peaks, weather hazards, transport or holiday constraints, and the date on which operational details were checked. Use actual destination photography with visible creator, source and license credits; every named season or major experience needs a representative visual. Canonical, Open Graph, sitemap and robots URLs must use the current production domain. External sources and promotional links open in a new tab with `rel="noopener noreferrer"`.

Every new article must link to at least one existing story, and at least one relevant existing story must link back to the new article. All sitemap entries must use the GitHub Pages production domain. Publishing means committing and pushing the verified source to the existing repository, then confirming the GitHub Pages workflow and the live URLs. Do not create or use a separate hosting project.

History features must distinguish surviving fabric, archaeological remains, reconstructions and later memorial sites in captions and travel guidance. When a famous anecdote is disputed, state what primary or official evidence supports, what recent scholarship questions, and do not use a dramatic later account as settled fact. Keep all new article media within the reading measure when the 205px desktop rail is active. Use the desktop rail only at 1320px and above; 1319px and below uses the safe mobile bar so the card retains a visible gutter from article content.

Cross-cultural features must distinguish survey results, government policy, popular-culture frames and individual experience. Never turn a country, continent or people into a personality type. If a poll asks about only selected countries, label the selection and do not present missing countries as low-ranked. Original editorial diagrams must be identified as diagrams and explain where categories overlap.

Every article that loads the shared `live-status.js` also receives the shared anonymous reader discussion from `comments.js`. New article markup must keep `main .article` so the discussion mounts automatically. Participation requires no account; the optional display name defaults to **Anonymous reader**. The Cloud Function is the only write path and must retain origin checks, a 500-character limit, link limits, a honeypot, IP-based posting limits, reporting, and automatic hiding after three independent reports. Never replace this with direct public Firestore writes or expose private moderation data. Do not claim that anonymous posting means untraceable posting: the server stores a one-way IP hash for abuse control.
