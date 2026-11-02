# 002 — Shorten the nav and footer rolls

- **Status**: DONE
- **Commit**: b5bfd70
- **Severity**: MEDIUM
- **Category**: Easing & duration
- **Estimated scope**: 1 file, three `transition` declarations

## Problem

The nav labels, the nav arrow, and the footer labels slide on a 450ms ease-in-out. The curve starts slow, so every hover hesitates. These links are hovered over and over. UI motion stays under 300ms, and a hover response should start fast.

```scss
/* _sass/_components/_home-v2.scss:635 — current */
.site-nav__label > span {
	display: block;
	text-shadow: 0 20px currentColor;
	transition: transform 0.45s cubic-bezier(0.65, 0, 0.35, 1);
}

/* _sass/_components/_home-v2.scss:641 — current */
.site-nav__ext svg {
	width: 20px;
	height: 20px;
	filter: drop-shadow(-20px 20px 0 currentColor);
	transition: transform 0.45s cubic-bezier(0.65, 0, 0.35, 1) 0.05s;
}

/* _sass/_components/_home-v2.scss:1189 — current */
body.home-v2.home-oval .footer-v2__label > span,
body.site-v2:not(.home-v2) .footer-v2__label > span {
	display: block;
	text-shadow: 0 20px currentColor;
	transition: transform 0.45s cubic-bezier(0.65, 0, 0.35, 1);
}
```

The roll itself stays. The label still moves `translateY(-20px)`. The arrow still follows 50ms later. Only the duration and the curve change.

## Target

200ms on the strong ease-out. The arrow keeps a 50ms delay, which is inside the 30–80ms stagger range.

```scss
/* target — nav label */
.site-nav__label > span {
	display: block;
	text-shadow: 0 20px currentColor;
	transition: transform 200ms cubic-bezier(0.23, 1, 0.32, 1);
}

/* target — nav arrow */
.site-nav__ext svg {
	width: 20px;
	height: 20px;
	filter: drop-shadow(-20px 20px 0 currentColor);
	transition: transform 200ms cubic-bezier(0.23, 1, 0.32, 1) 50ms;
}

/* target — footer label */
body.home-v2.home-oval .footer-v2__label > span,
body.site-v2:not(.home-v2) .footer-v2__label > span {
	display: block;
	text-shadow: 0 20px currentColor;
	transition: transform 200ms cubic-bezier(0.23, 1, 0.32, 1);
}
```

Use `cubic-bezier(0.23, 1, 0.32, 1)`. Do not use built-in `ease`, built-in `ease-out`, or `cubic-bezier(0.65, 0, 0.35, 1)`.

## Repo conventions to follow

This project has no easing custom properties. The same ease-out is already written inline on the work-tile labels.

- Exemplar: `_sass/_components/_home-v2.scss:1051`

```scss
transition:
	opacity 180ms cubic-bezier(0.23, 1, 0.32, 1),
	translate 240ms cubic-bezier(0.23, 1, 0.32, 1);
```

Match that curve exactly. Durations in that block use milliseconds. Use `200ms` and `50ms`, not `0.2s`.

## Steps

1. In `_sass/_components/_home-v2.scss`, on `.site-nav__label > span` inside the `body.home-v2.home-oval > header.site-nav` rule, replace `transition: transform 0.45s cubic-bezier(0.65, 0, 0.35, 1);` with `transition: transform 200ms cubic-bezier(0.23, 1, 0.32, 1);`.
2. On the `.site-nav__ext svg` rule directly below it, replace `transition: transform 0.45s cubic-bezier(0.65, 0, 0.35, 1) 0.05s;` with `transition: transform 200ms cubic-bezier(0.23, 1, 0.32, 1) 50ms;`.
3. On `body.home-v2.home-oval .footer-v2__label > span` and `body.site-v2:not(.home-v2) .footer-v2__label > span`, replace `transition: transform 0.45s cubic-bezier(0.65, 0, 0.35, 1);` with `transition: transform 200ms cubic-bezier(0.23, 1, 0.32, 1);`.

## Boundaries

- Do NOT change distances: `translateY(-20px)`, `translate(20px, -20px)`, `translate(20px, -22.4px)`, or the phone resting `translateY(-2.4px)`.
- Do NOT change `text-shadow` or `drop-shadow` offsets. The 20px copy is what makes the roll read.
- Do NOT wrap these rules in a hover media query. That is plan 003.
- Do NOT change the `prefers-reduced-motion: reduce` blocks. They already set `transition: none`.
- Do NOT add easing custom properties.
- Do NOT edit `assets/javascripts/home-oval-nav.js`. The `is-rolling` class is unused by CSS. Leave it.
- If any of the three declarations is not the excerpt above, STOP and report instead of improvising.

## Verification

- **Mechanical**: `bundle exec jekyll build` exits 0. The built CSS has `transform 200ms cubic-bezier(0.23, 1, 0.32, 1)` on the nav label, the nav arrow (with a `50ms` delay), and the footer label. It no longer has `cubic-bezier(0.65, 0, 0.35, 1)` or `0.45s` on those three rules.
- **Feel check**: On a desktop window, hover Resume, Contact, and the footer Linkedin and Email links. Also hover Back on an interior page that uses the overlay nav.
  - The word starts moving as soon as the pointer enters. It does not hesitate.
  - The roll still completes: the visible word leaves upward and the copy below it arrives. The arrow still leaves up-right, a beat after the word.
  - The whole roll is over in about 250ms (200ms, plus 50ms for the arrow). It no longer feels like half a second.
  - In the Animations panel at 10% playback, the curve is fast immediately and eases into the end position.
  - With `prefers-reduced-motion: reduce`, hovering does not slide the label. The label underlines instead, which is the existing fallback.
- **Done when**: Those three transitions are 200ms on `cubic-bezier(0.23, 1, 0.32, 1)`, the arrow delay is 50ms, and nothing else in the roll moved.
