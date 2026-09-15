# MATH 10675 · Interactive class notebook

A class blog and growing archive of interactive HTML lessons. Entries include **Quantities & change** (Module 2 Investigations 1 and 2), **Constant rates & proportionality** (Investigations 3 and 4), and **Exploring Average Speed** (Investigation 5, under construction).

## Update or add an interactive lesson

1. Put the self-contained HTML file in `lessons/`, using a lowercase hyphenated filename.
2. Add a record to `content/posts.json`. Copy the existing record as a template: give it a unique `slug`, title, date (`YYYY-MM-DD`), module, investigations, description, lesson filename, topics, sections, and source note. Add `"status": "Under construction"` to label drafts on the archive and notes page. Include the label inside the lesson too.
3. Run `node build.mjs` (Node.js 18 or later; no packages to install).
4. Preview `docs/index.html` in a browser. Check the new post and lesson.
5. Commit the edited source files and generated `docs/` files, then push to `main`. GitHub Pages publishes the `docs/` folder automatically.

The builder creates the home-page archive and a dedicated notes page for each lesson, sorts entries newest first, copies the interactive lesson, and adds an “All lessons” link. Keep each lesson's assets self-contained for offline use.

## Files

- `lessons/`: canonical interactive lesson sources.
- `content/posts.json`: archive and post content.
- `style.css`, `favicon.svg`: shared class-blog presentation.
- `theme.css`, `theme.js`: shared light/dark styling and preference switch, embedded in generated pages for offline use. The initial theme follows the device setting; an explicit choice is saved locally and shared across the website.
- `build.mjs`: dependency-free static site builder.
- `docs/`: generated GitHub Pages site; avoid editing generated files directly.

The activities run in the browser. There is no account system, server, analytics, or answer collection. Investigations 1–4 retain answers only in the open lesson. Investigation 5 saves responses in browser local storage and provides a reset control.

## Source attribution

The first lesson includes scenario text from *Pathways Precalculus*, Module 2 Investigations 1 and 2, ©2026 Rational Reasoning LLC, supplied for this class. Source attributions and adaptation notes are included in the lesson. Original PDFs and instructor-note files are not part of this repository. No license is granted here for third-party course content.


## Mathematical notation

Archive pages and Investigations 1–4 load the shared `math-format.js` / `math-format.css` renderer and the locally packaged MathJax 3.2.2 SVG engine in `vendor/mathjax/`. Existing numeric and formula notation is converted to TeX, including graph labels and values added by sliders and question generators. Native inputs and select options remain editable browser controls.

For new content, prefer explicit inline LaTeX, for example `\(\Delta y = m\Delta x\)` and `\(y = \frac{3}{2}x\)`. In JavaScript or JSON strings, escape each backslash as `\\`, or use a JavaScript `String.raw` template. Text outside the delimiters remains prose. The renderer also understands the legacy Unicode formulas used in the first lessons.

MathJax is Apache-2.0 licensed; its license is included with the vendored engine. It is served from this repository, without a CDN dependency. Set `"presentation": "self-contained"` for a lesson with its own styling and MathJax initialization. The builder preserves that presentation and adds the archive link. Investigation 5 uses this option and loads the bundled engine from `../vendor/mathjax/tex-svg-full.js`.
