# 001 — Ease the phone sheet out

- **Status**: DONE
- **Commit**: b5bfd70
- **Severity**: HIGH
- **Category**: Easing & duration
- **Estimated scope**: 1 file, one declaration

`_sass/_components/_wallo.scss` is uncommitted. Match the excerpt below in the working tree. Do not look for this file in commit `b5bfd70`. If the excerpt is not there, STOP.

## Problem

On a phone, closing a case study plays `wallo-sheet-out` for 400ms on `cubic-bezier(0.4, 0, 1, 1)`. That curve is ease-in: the sheet waits, then accelerates off screen. The entrance already uses the drawer curve and starts immediately. The exit should too.

```scss
/* _sass/_components/_wallo.scss:360 — current */
.wallo-window.is-closing .wallo-window__frame {
	opacity: 1;
	animation: wallo-sheet-out 400ms cubic-bezier(0.4, 0, 1, 1) forwards;
}
```

The entrance beside it, which must not change:

```scss
/* _sass/_components/_wallo.scss:356 — leave this */
.wallo-window.is-open .wallo-window__frame {
	animation: wallo-sheet-in 450ms cubic-bezier(0.32, 0.72, 0, 1) forwards;
}
```

## Target

Same 400ms duration. Same keyframes. Replace only the exit curve with the drawer curve, which is the curve a sheet uses and the curve the entrance already uses:

```scss
/* target */
.wallo-window.is-closing .wallo-window__frame {
	opacity: 1;
	animation: wallo-sheet-out 400ms cubic-bezier(0.32, 0.72, 0, 1) forwards;
}
```

`cubic-bezier(0.32, 0.72, 0, 1)` is the drawer curve. Do not substitute `cubic-bezier(0.23, 1, 0.32, 1)`, built-in `ease-out`, or built-in `ease-in`.

## Repo conventions to follow

Curves in this file are written inline on the `animation` shorthand. There is no easing custom property. Copy the entrance value exactly.

- Exemplar: `_sass/_components/_wallo.scss:357` — `animation: wallo-sheet-in 450ms cubic-bezier(0.32, 0.72, 0, 1) forwards;`

## Steps

1. In `_sass/_components/_wallo.scss`, inside `@media (prefers-reduced-motion: no-preference)` and `@include phone`, change the `.wallo-window.is-closing .wallo-window__frame` animation from `wallo-sheet-out 400ms cubic-bezier(0.4, 0, 1, 1) forwards` to `wallo-sheet-out 400ms cubic-bezier(0.32, 0.72, 0, 1) forwards`.
2. Leave `@keyframes wallo-sheet-out` as it is: from `transform: none` to `transform: translateY(100%)`, opacity staying at 1.

## Boundaries

- Do NOT change `wallo-sheet-in`, `wallo-window-in`, or their durations.
- Do NOT change `@keyframes wallo-sheet-out`.
- Do NOT add a desktop exit animation.
- Do NOT add easing custom properties.
- Do NOT edit `_includes/wallo-window.html`.
- Do NOT add dependencies.
- If the closing rule is not the excerpt above, STOP and report instead of improvising.

## Verification

- **Mechanical**: From the repo root, `bundle exec jekyll build`. Expected: exit 0. Then confirm the built CSS contains `wallo-sheet-out 400ms cubic-bezier(0.32, 0.72, 0, 1)` and does not contain `cubic-bezier(0.4, 0, 1, 1)`.
- **Feel check**: Serve the site, set the viewport to 390×844, open a case study, and press Close.
  - The sheet starts moving down on the first frames. It does not sit still and then drop.
  - It travels its own height (`translateY(100%)`) and is gone at 400ms.
  - In the DevTools Animations panel, set playback to 10%. The curve is fast at the start and settles into the bottom. It is not slow at the start.
  - Open it again. The entrance is unchanged: it still rises over 450ms on `cubic-bezier(0.32, 0.72, 0, 1)`.
  - With `prefers-reduced-motion: reduce`, neither the entrance nor the exit plays. This plan does not add a reduced-motion fade.
- **Done when**: The only motion change in the file is the exit timing function, and a phone close starts immediately.
