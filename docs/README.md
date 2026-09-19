# Marriage Scorer — web/iPhone version

This is a copy of `../www/` served as a static site via GitHub Pages, so
it can be opened in Safari on iPhone and added to the Home Screen
(Share → Add to Home Screen) as an installable web app — no Mac, Xcode,
or App Store account needed.

To enable hosting (one-time, in the GitHub repo settings):
1. Settings → Pages
2. Source: **Deploy from a branch**
3. Branch: `main`, folder **`/docs`**
4. Save — the site will be live at `https://<owner>.github.io/<repo>/`

## Keeping this in sync

This folder is a plain copy, not a build output — after editing
`www/index.html` or the native bridge, re-copy:

```bash
cp www/index.html docs/index.html
cp www/capacitor-bridge.js docs/capacitor-bridge.js
```
