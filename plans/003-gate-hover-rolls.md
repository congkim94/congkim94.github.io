# 003 — Keep the rolls off touch screens

- **Status**: DONE
- **Commit**: b5bfd70
- **Severity**: MEDIUM
- **Category**: Accessibility
- **Estimated scope**: 1 file, four hover groups

## Problem

The nav and footer rolls run on `:hover`. A coarse pointer fires hover on tap and can leave it stuck, so the label stays shifted up and the real word looks gone. The work-tile labels already refuse to do this. The rolls do not.

These are the rules that move the label. Quote them from the working tree. Plan 002 may already have changed nearby `transition` lines. That is fine. These selectors and their `transform` values are the part this plan owns.

```scss
/* _sass/_components/_home-v2.scss:648 — current */
.site-nav__pill:hover,
.site-nav__pill:focus-visible {
	.site-nav__label > span {
		transform: translateY(-20px);
	}

	.site-nav__ext svg {
		transform: translate(20px, -20px);
	}
}

/* _sass/_components/_home-v2.scss:665 — current */
.site-nav__pill--back:hover,
.site-nav__pill--back:focus-visible {
	.site-nav__ext svg {
		transform: translateY(-20px);
	}
}

/* _sass/_components/_home-v2.scss:681 — current, inside @include phone */
.site-nav__pill--external:hover,
.site-nav__pill--external:focus-visible {
	.site-nav__ext svg {
		transform: translate(20px, -22.4px);
	}
}

/* _sass/_components/_home-v2.scss:1196 — current */
body.home-v2.home-oval .footer-v2__links a:hover .footer-v2__label > span,
body.home-v2.home-oval .footer-v2__links a:focus-visible .footer-v2__label > span,
body.site-v2:not(.home-v2) .footer-v2__links a:hover .footer-v2__label > span,
body.site-v2:not(.home-v2) .footer-v2__links a:focus-visible .footer-v2__label > span {
	transform: translateY(-20px);
}
```

The phone arrow's resting offset is alignment, not a hover. It must stay outside the new query:

```scss
/* _sass/_components/_home-v2.scss:677 — do not gate this */
@include phone {
	.site-nav__pill--external .site-nav__ext svg {
		transform: translateY(-2.4px);
	}
}
```

## Target

The four hover groups run only when the device can actually hover with a fine pointer. `:focus-visible` stays with `:hover` inside that query, so a keyboard on a desktop still rolls, and a tap on a phone does not.

```scss
/* target — nested inside the existing site-nav rule */
@media (hover: hover) and (pointer: fine) {
	.site-nav__pill:hover,
	.site-nav__pill:focus-visible {
		.site-nav__label > span {
			transform: translateY(-20px);
		}

		.site-nav__ext svg {
			transform: translate(20px, -20px);
		}
	}

	.site-nav__pill--back:hover,
	.site-nav__pill--back:focus-visible {
		.site-nav__ext svg {
			transform: translateY(-20px);
		}
	}

	@include phone {
		.site-nav__pill--external:hover,
		.site-nav__pill--external:focus-visible {
			.site-nav__ext svg {
				transform: translate(20px, -22.4px);
			}
		}
	}
}
```

```scss
/* target — footer, at the same nesting level as the current footer hover rule */
@media (hover: hover) and (pointer: fine) {
	body.home-v2.home-oval .footer-v2__links a:hover .footer-v2__label > span,
	body.home-v2.home-oval .footer-v2__links a:focus-visible .footer-v2__label > span,
	body.site-v2:not(.home-v2) .footer-v2__links a:hover .footer-v2__label > span,
	body.site-v2:not(.home-v2) .footer-v2__links a:focus-visible .footer-v2__label > span {
		transform: translateY(-20px);
	}
}
```

## Repo conventions to follow

The work tiles already hide hover motion from touch. Copy that media query. Do not invent a class or a hover JavaScript path.

- Exemplar: `_sass/_components/_home-v2.scss:1047` — `@media (hover: hover) and (pointer: fine)`

## Steps

1. In the `body.home-v2.home-oval > header.site-nav` block of `_sass/_components/_home-v2.scss`, wrap `.site-nav__pill:hover` / `:focus-visible` and `.site-nav__pill--back:hover` / `:focus-visible` in `@media (hover: hover) and (pointer: fine)`.
2. Move only the phone `:hover` / `:focus-visible` arrow rule into that same media query, still inside `@include phone`. Leave the resting `.site-nav__pill--external .site-nav__ext svg { transform: translateY(-2.4px); }` where it is, outside the media query.
3. Wrap the footer `a:hover` / `a:focus-visible` label rule in `@media (hover: hover) and (pointer: fine)`.
4. Leave both `prefers-reduced-motion: reduce` blocks after those queries, unchanged, so they still win and replace the roll with an underline.

## Boundaries

- Do NOT change transition durations or curves. If plan 002 has already set `200ms cubic-bezier(0.23, 1, 0.32, 1)`, keep it. If it has not, leave `0.45s cubic-bezier(0.65, 0, 0.35, 1)` alone.
- Do NOT remove `:focus-visible` from the grouped selectors.
- Do NOT gate the reduced-motion underline fallback.
- Do NOT change the phone resting `translateY(-2.4px)`.
- Do NOT edit HTML or JavaScript.
- If a hover rule's transform is not one of the excerpts above, STOP and report instead of improvising.

## Verification

- **Mechanical**: `bundle exec jekyll build` exits 0. In the built CSS, the `translateY(-20px)` nav and footer hover rules sit inside `@media (hover: hover) and (pointer: fine)`. The phone rule `transform: translateY(-2.4px)` on `.site-nav__pill--external .site-nav__ext svg` does not sit inside that media query.
- **Feel check**:
  - Desktop, fine pointer: hovering Resume, Contact, Back, and the footer links still rolls the label. Tabbing to one with the keyboard still rolls it.
  - Viewport 390px wide, touch emulation (`hover: none`, `pointer: coarse`): tapping those links does not slide the label and does not leave it shifted. The external arrow still sits 2.4px higher than the word.
  - With `prefers-reduced-motion: reduce` on a desktop pointer, hover and keyboard focus underline the label and do not translate it.
  - In the Animations panel at 10% playback on a desktop pointer, the roll still eases instead of snapping. This plan does not change that curve.
- **Done when**: A coarse pointer cannot start or stick the roll, and a fine pointer still can, including from the keyboard.
