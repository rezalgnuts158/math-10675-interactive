# MATH 10675 · Interactive class notebook

A class blog and growing archive of interactive HTML lessons. Entries include **Quantities & change** (Module 2 Investigations 1 and 2) and **Constant rates & proportionality** (Investigations 3 and 4, under construction).

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

The activities run in the browser. There is no account system, server, analytics, or answer collection. Answers are retained only in the currently open lesson and are cleared on reload.

## Source attribution

The first lesson includes scenario text from *Pathways Precalculus*, Module 2 Investigations 1 and 2, ©2026 Rational Reasoning LLC, supplied for this class. Source attributions and adaptation notes are included in the lesson. Original PDFs and instructor-note files are not part of this repository. No license is granted here for third-party course content.
