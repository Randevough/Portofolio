# Randevough — Studio Grotesk (rework pass)

Static HTML/CSS/JS. Open `index.html`. No build step.

## What changed in this pass

1. **No more flicker.** The motion gate now runs in an inline `<head>` script, before first paint.
2. **Hero video-in-text.** The H1 is knocked out of a looping video using `mix-blend-mode: multiply`.
   Video weight ~380 KB total, generated locally — no third-party CDN to die on you.
   Falls back to solid text on mobile, reduced-motion, and if autoplay is refused.
3. **Bridge.** Full-screen CodeQuest frame shrinks into place as you scroll (desktop).
4. **Work is a pinned horizontal gallery** with a progress rail. Stacks vertically under 820px.
5. **Stack is now an evidence map,** not a spreadsheet. Hover a tool → the projects and roles
   that actually used it stay lit, the rest dim. No empty grid cells, no ragged tail.
6. **Contact title overlap fixed.** The old bug came from split words becoming inline-blocks
   under a sub-1.0 line-height. Title is now line-masked with descender padding.
7. **Form is awake.** Floating labels, animated focus underline, numbered fields, live character
   count, auto-growing textarea, inline validation on blur, and send → sending → sent states.
8. **Texture.** Animated grain, subtle top light, visible vertical grid rules, elevated surfaces.
9. **Mobile pass.** Verified at 390 / 768 / 1440 / 1920 — no horizontal overflow, no hidden text,
   full-screen nav menu, custom cursor and magnetic buttons disabled on touch.
10. **Failsafe.** If GSAP fails to load, or any script throws, every element is measured and
    forced visible. A CSS-only reveal also fires at 4s if the script never runs at all.

## Replace before publishing

| File / value | What to do |
|---|---|
| `assets/work-*.svg` | Real project screenshots (blocker #1) |
| `assets/hero-loop.mp4` / `.webm` | Optional: swap in real CodeQuest footage. Keep it BRIGHT — the mask shows video luminance as text |
| `assets/randevough-cv.pdf` | Your CV |
| `YOUR_WEB3FORMS_ACCESS_KEY` in `index.html` | Web3Forms key (form refuses to send until then) |
| `wa.me/62XXXXXXXXXX` | Real WhatsApp number |
| `ROLES` years in `scripts/main.js` | Confirm the placeholder years |
| Project `href="#"` | Real live links |

## Structure

```
index.html            markup + inline motion gate
styles/main.css       18 numbered sections
scripts/main.js       data (STACK / PROOF / ROLES) + all behaviour
work/codequest.html   case study
assets/               placeholders + hero loop
```
