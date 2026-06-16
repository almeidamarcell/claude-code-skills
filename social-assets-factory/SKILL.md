---
name: social-assets-factory
description: Generate scroll-stopping social ad creatives (Instagram square 1080×1080, portrait 4:5, or story 9:16) for your business using Claude Code + the OpenAI Codex CLI — no API keys. Bakes in a proven conversion-focused template — heavy display serif headline, monospace terminal-style accent, dual color palette, floating dark proof card, pose-aware portrait placement, safe zones for cropping, branded CTA pill. First, it tries to follow the branding pattern of the repo/session you're in (DESIGN.md, theme config, CSS variables, brand docs); if none exists, it falls back to a one-time brand profile that captures your colors, fonts, portraits, logo, and voice. After that, every invocation generates 4 layout variations. Trigger via `/social-assets-factory` or whenever the user asks to make social media ads/creatives for their business.
---

# Social Assets Factory

This skill produces conversion-driven social ad images for any business. The template was developed and refined across dozens of iterations and is now battle-tested. Image generation runs through the **OpenAI Codex CLI** — it uses your existing Codex (ChatGPT) login, so there are **no API keys to manage and no per-image API billing**.

Two things make this version different from a generic ad generator:

1. **It follows your project's branding automatically.** When you run it inside a repo that already declares a design system (a `DESIGN.md`, a Tailwind theme, CSS custom properties, a brand doc), the skill reads those colors/fonts/voice and uses them. The ad looks like it belongs to the product. When there's no design system in the repo, it falls back to a saved brand profile (and runs a one-time setup wizard if even that is missing).
2. **It generates with Codex, not an image API.** No Higgsfield account, no `OPENAI_API_KEY`. If `codex` is installed and logged in, you're ready.

---

## Prerequisites (check once, fast)

```bash
CODEX_BIN=$(command -v codex || echo "")
[ -z "$CODEX_BIN" ] && echo "CODEX: NOT_FOUND" || { echo "CODEX: $CODEX_BIN"; codex --version; }
[ -f ~/.codex/auth.json ] && echo "CODEX_AUTH: present" || echo "CODEX_AUTH: missing"
```

- If `CODEX: NOT_FOUND` → tell the user: "Codex CLI not found. Install it: `npm install -g @openai/codex` (or `brew install codex`), then run `codex login`." Stop until installed.
- If `CODEX_AUTH: missing` → tell the user: "Run `codex login` once (browser sign-in with your ChatGPT account), then re-run this skill." Stop until logged in.

No `OPENAI_API_KEY` is required — Codex authenticates from `~/.codex/auth.json`.

---

## Step 0: Resolve the branding source (do this first, every run)

Before anything else, figure out which brand identity to design with. Resolve in this order and **stop at the first hit**:

### 0.1 — Repo/session design system (preferred)

Look at the current working repo for an existing design source of truth. Check, in order:

1. **`DESIGN.md`** in the repo root (the gstack / `/design-consultation` convention). If present, it's authoritative — it usually spells out palette, typography, and tone.
2. **Brand docs:** `BRAND.md`, `STYLEGUIDE.md`, `brand.json`, `brand-guidelines.*`, `theme.json`.
3. **Theme config:** `tailwind.config.{js,ts,cjs,mjs}` → read `theme.colors`, `theme.extend.colors`, `fontFamily`. Map `primary`/`background`/`brand` → background, `accent`/`secondary` → accent, foreground/text → type color.
4. **CSS custom properties:** a global stylesheet (`globals.css`, `app.css`, `:root { --color-... }`, `--background`, `--foreground`, `--primary`, `--accent`, `--font-*`). Resolve OKLCH/HSL to hex if needed.
5. **Logo/brand assets** already in the repo: `public/`, `assets/`, `static/`, `src/assets/` (`logo*.{png,svg}`, `favicon*`, brand marks). Use these as the logo/mascot.

Quick detection sweep:

```bash
ls DESIGN.md BRAND.md STYLEGUIDE.md brand.json theme.json brand-guidelines.* 2>/dev/null
ls tailwind.config.* 2>/dev/null
grep -rlEi -- '--(color|background|foreground|primary|accent|brand|font)' \
  --include='*.css' --include='*.scss' . 2>/dev/null | head -5
find . -iname 'logo*.png' -o -iname 'logo*.svg' 2>/dev/null | grep -Ev 'node_modules' | head -10
```

If you find a design system, **extract its brand tokens** into the same shape as the profile below (palette A/B, fonts, voice tone, logo path) plus any product facts worth putting on an ad, then **show the user what you extracted and confirm or let them tweak it** before generating. The repo's tokens win over a saved profile (it's the brand the user is actively working in).

But tokens are only half the picture. **Extracting a brand's colors does NOT mean cloning that brand's existing layouts.** How the tokens get *composed* into the ad is a separate decision — see "Brand tokens vs skill signature" right below. Get this wrong and you produce a faithful but forgettable copy of what the site already looks like, with none of the skill's scroll-stopping signature.

Persisting it is optional: if the user wants, save the extracted values to `<repo>/.social-assets/brand-profile.json` so future runs in this repo skip extraction. Never commit secrets; this file is just colors/fonts/paths.

### 0.2 — Saved brand profile (fallback)

If the repo has no design system, read the saved profile at `~/.config/social-assets-factory/brand-profile.json`. If it exists and has the required keys, use it. This is the same behavior as a standalone, repo-agnostic run.

### 0.3 — First-time setup wizard (last resort)

If neither a repo design system nor a saved profile exists, run the **setup wizard** below, save the result to `~/.config/social-assets-factory/brand-profile.json`, then continue.

State which source you resolved in one line, e.g. `Branding source: repo DESIGN.md` / `Branding source: saved profile` / `Branding source: new setup`.

---

## Brand tokens vs skill signature (pick the mode)

The most important decision in this skill, and the easiest to get wrong. A repo's design system gives you two very different things; keep them apart:

- **Brand tokens** — palette, logo, fonts, voice/tone, product facts. These ALWAYS come from the repo when one is in effect. The ad uses the real brand colors, the real logo, the real voice.
- **Composition / house style** — how those tokens get arranged: the heavy display-serif focal word, the terminal-style mono accent line, the floating tilted dark proof card, the filled accent CTA pill, the dramatic backlit background. This is the skill's **signature** — the battle-tested, scroll-stopping conversion layout. It is the reason to use this skill at all.

A website's design system is tuned to look calm and native *on the site*. An ad is tuned to **stop a thumb in a feed**. Different jobs. If you pour the brand tokens into the site's own flat layout, you get a faithful but forgettable clone of what already exists. The skill's value is bringing its conversion signature and dressing it in the brand's tokens.

Offer the user a **mode** (default to Signature):

- **Signature (default).** The skill's conversion composition (hard rules 3, 4, 9, 11) rendered in the repo's palette + logo + voice + product facts. Bolder than the website on purpose. This is where the skill earns its keep.
- **On-system.** Fully conform to the repo's design system, including any anti-slop rules it declares (e.g. "sans headlines only", "no gradients/glow", "outline CTAs", "solid cards"). Output looks native to the existing product/site. Choose this when the user wants assets that blend into the site, or when brand guidelines forbid the signature elements.

**If the repo's DESIGN.md explicitly bans signature elements** (serif headlines, gradients, glow, filled CTAs, floating glassy cards — common in mature design systems), surface the tension in one line and let the user choose. Do not silently override their brand guidelines, and do not silently flatten the skill. Example: "Lumina's DESIGN.md bans serif + filled CTAs. Signature mode breaks those rules but stops the scroll; on-system mode obeys them but looks like the site. Which do you want?"

---

## Landing the tchan (signature anatomy + self-critique)

"Tchan" is the scroll-stopping spark. It is not decoration, it is a specific repeatable anatomy. In Signature mode every ad must carry **all seven ingredients**. Miss one and the ad reads flat — the exact failure mode where a brand's tokens get poured into the website's own quiet layout.

### The seven ingredients (all required in Signature mode)

1. **One hero focal element.** Exactly one word or number, set **2.5–3x larger** than everything else, in the accent color. The eye lands in one place. Two focal elements means none.
2. **Heavy display serif headline.** Sharp, high-contrast strokes (Fraunces Black or the brand's display serif). Never sans in signature mode — the serif is what reads "designed, not generated."
3. **Dramatic backlit background.** A dark radial gradient blooming from a rich edge color to an accent glow at center, with a vignette and warm rim light. Depth, not a flat fill. This one thing most separates a signature ad from a slide.
4. **Terminal-style mono accent line.** One line, `$ command█`, in the mono font, naming the product doing the work. Signals "real product, actually built."
5. **A floating, tilted, glowing proof card.** Dark UI, rotated ~6–8°, drop shadow, glowing accent edge halo, dimensional 3D float, carrying ONE concrete metric plus a source. Depth and proof in a single element. Most-skipped ingredient, highest impact.
6. **Filled accent CTA pill with glow.** Solid accent fill, display-serif label ending in →, soft accent shadow under it. A button that looks pressable.
7. **Specificity everywhere.** Real numbers (+38%, 73%, 12h→3h), a real source tag (McKinsey 2024), a real command. Vague is forgettable, concrete is credible.

### Anti-flatness — never ship a Signature ad that…

- …uses a flat single-color background (that is on-system, not signature).
- …sets all type at a similar size (no hero focal element).
- …is text-only with no floating proof card (no depth, no proof).
- …uses a sans headline or an outline/ghost CTA (that is the website's look).
- …states a vague benefit with no number or source.

Catch any of these after generating and it is not a keeper. Regenerate it.

### Self-critique pass (this is how it stays tchan, batch after batch)

Image models drift toward flat. Counter it: after each batch of 4, score every variation 0–2 on each of the seven ingredients (0 missing, 1 weak, 2 strong), then:

- **Keep** variations scoring **≥12/14 with no zeros**.
- **Regenerate** the rest, naming the missing ingredient in the new prompt (e.g. "the focal word 'contexto' must be 2.8x larger; the proof card must float and tilt with a glowing edge").
- Loop until you have the count the user asked for. Two strong ads beat four flat ones.

Show the scores, one line per variation, so the judgment is visible: `b: focal 2 · serif 2 · bg 2 · terminal 2 · proof 1 · cta 2 · specifics 2 = 13/14 ✓`.

---

## First-time setup wizard (only when Step 0 falls through to 0.3)

### Setup questions (ask in order)

1. **What's your business name?** (e.g. "AI Builders", "Brewlab Coffee", "TenFoldGrowth")
2. **One-line offer.** What do you sell? (e.g. "I help non-technical people automate their business with Claude Code.")
3. **Target audience.** Who's this for in one sentence?
4. **Voice tone.** Pick one or describe: punchy/direct, professional, playful, editorial, contrarian, friendly.
5. **Brand colors.** Ask for hex codes:
   - **Primary (background dominant):** main canvas color
   - **Accent (focal element color):** what their eye lands on first
   - **Type color:** what most text uses
   - If they don't know, offer to extract from their website — ask for the URL and pull dominant colors by reading the homepage CSS/`:root` variables.
6. **Optional secondary palette** (for variation). Same three colors, different vibe. Skip if they don't want one.
7. **Display font.** Default is Fraunces Black (free, distinctive serif). Other recommendations: Tiempos Headline, Instrument Serif, PP Editorial New, GT Sectra. Ask if they want to override.
8. **Accent font.** Default is JetBrains Mono Bold. Other options: Geist Mono, IBM Plex Mono, Berkeley Mono.
9. **Portrait folder path.** Absolute path to a folder of transparent-background portrait PNGs of the person who'll appear in the ads. (If they don't have any, link them to https://www.remove.bg/ or guide them to use Photoshop's Subject Select + Mask.) Examples: pointing-right, pointing-left, neutral chin pose, thumbs-up, etc.
10. **Logo or mascot path** (optional). Absolute path to a small brand mark or mascot PNG that'll appear in the top-right corner of every ad.
11. **Output folder.** Where should generated ads be saved? Default: `~/Documents/social-assets-output/`. Approved keepers go to a `Keepers/` subfolder.
12. **Default format.** `square` (1080×1080, IG feed/ad — default), `portrait` (1080×1350, 4:5 feed), or `story` (1080×1920, 9:16 Stories/Reels).

### After collecting answers

Write the profile to `~/.config/social-assets-factory/brand-profile.json`:

```json
{
  "brand": {
    "name": "string",
    "offer": "string",
    "audience": "string",
    "voice_tone": "string"
  },
  "design": {
    "palette_a": {
      "background": "#hex",
      "accent": "#hex",
      "type": "#hex",
      "name": "string e.g. 'Dark dominant'"
    },
    "palette_b": {
      "background": "#hex",
      "accent": "#hex",
      "type": "#hex",
      "name": "string e.g. 'Light editorial'"
    },
    "display_font": "Fraunces Black",
    "accent_font": "JetBrains Mono Bold"
  },
  "assets": {
    "portrait_folder": "absolute path",
    "logo_path": "absolute path or null"
  },
  "output": {
    "save_folder": "absolute path",
    "keepers_folder": "absolute path"
  },
  "default_format": "square"
}
```

Create the directory first: `mkdir -p ~/.config/social-assets-factory`. After writing, briefly summarize what you saved and tell the user they can edit the file directly any time.

> Note: there is no `generator_path` field. Codex is the only generator and needs no configuration beyond `codex login`.

---

## Generation flow (after branding is resolved)

1. **Branding is already resolved** (Step 0): repo design system, saved profile, or fresh wizard. You have palette(s), fonts, voice, portrait folder, logo, output folder, default format.
2. **Ask the user for the angle/promise.** What hook is this ad selling? (e.g. "Save 20 hours a week", "Make your first $10k month")
3. **Propose 2–3 headline structures** in their voice tone:
   - One bold promise: "Claude builds my ads."
   - Stat hook: "0 to X in Y days."
   - Authority claim: "The #1 Way To [Outcome]"
   - Confessional: "I haven't [X] in [Y] months."
4. **Confirm or rewrite** the headline with them.
5. **Ask for composition variables:**
   - **Mode:** signature (the skill's conversion look in the brand's colors — default) or on-system (conform to the repo's design system). See "Brand tokens vs skill signature." In on-system mode, skip the signature-specific prompts (serif/terminal/filled CTA) and follow the repo's fonts + CTA style instead.
   - **Format:** square / portrait / story (default from profile).
   - **Which portrait?** List file names from the portrait folder; recommend a pose based on layout (see pose-direction rule).
   - **Subject placement:** bottom-left or bottom-right.
   - **Proof card type:** analytics, dashboard, notifications, ads-manager, inbox, calendar, or none (offer to use a screenshot they want featured).
   - **Palette:** A or B from the resolved branding.
   - **CTA copy** (e.g. "Get the system →", "Join now →", "Steal my workflow →").
6. **Build the prompt** by filling the template (below) with the brand values and user choices.
7. **Generate with Codex** — run the call shape in "Generating with Codex" below, **4 times** (variations a–d). Attach the portrait, logo, and any proof screenshot as `-i` reference images.
8. **Collect the outputs** Codex wrote to `~/.codex/generated_images/`, copy them to the output folder as `social-{slug}-{a|b|c|d}.png`.
9. **Normalize to exact dimensions** for the chosen format (see "Normalizing output").
10. **Open in Preview** (`open -a Preview` on macOS, `xdg-open` on Linux) and review.
11. **On approval**, copy the user's picks to `Keepers/`.

---

## Generating with Codex

Codex generates images through its built-in image tool (your ChatGPT plan), saving them under `~/.codex/generated_images/<session-id>/ig_*.png`. The skill's job is: tell Codex exactly what to make, then collect and normalize the file. **Let Codex only generate — the skill does the file collection, resize, and copy.** That keeps the Codex run minimal and fully non-interactive.

### Per-variation call

For each variation, write the filled prompt to a file and feed it to Codex on **stdin**:

```bash
# 1. write the filled prompt to a temp file (heredoc keeps quotes/accents intact)
PROMPT_FILE=$(mktemp /tmp/saf-prompt.XXXXXX)
ERR_FILE=$(mktemp /tmp/saf-err.XXXXXX)
cat > "$PROMPT_FILE" <<'PROMPT'
You are a senior performance-marketing art director. Use your image_generation tool to
produce EXACTLY ONE image, 1080x1080. The attached reference images, in order, are:
[1] the portrait, [2] the brand logo. Render them faithfully, do not recolor the logo.
<PASTE THE FILLED PROMPT TEMPLATE HERE>
Generate it directly with the image_generation tool. Do not write code, do not edit
files, do not ask questions, do not explain. Just generate the image.
PROMPT

# 2. generate. Pass the prompt on STDIN (`< "$PROMPT_FILE"`), NOT as an argument.
#    `-i/--image` is variadic, so a positional prompt after it gets swallowed as
#    another image path and Codex finds no prompt. Stdin sidesteps that and can't
#    hang (the file hits EOF). Attach references with repeated `-i` flags.
codex exec -s workspace-write \
  -i "/abs/path/to/portrait.png" \
  -i "/abs/path/to/logo.png" \
  < "$PROMPT_FILE" 2>"$ERR_FILE"

# 3. collect: Codex prints `session id: <uuid>` on stderr and writes the image to
#    ~/.codex/generated_images/<uuid>/ig_*.png — exact, parallel-safe attribution.
SID=$(grep -oE 'session id: [0-9a-f-]+' "$ERR_FILE" | head -1 | awk '{print $3}')
NEW=$(find ~/.codex/generated_images/"$SID" -name 'ig_*.png' -type f 2>/dev/null | head -1)
echo "Codex produced: $NEW"
```

- **Feed the prompt on stdin, never as a positional argument.** `-i/--image` is variadic; a trailing prompt argument is consumed as another image file and Codex then reports "No prompt provided via stdin." Piping the prompt on stdin is the robust pattern (validated against Codex 0.131) and never hangs.
- `-s workspace-write` keeps it non-interactive (no approval prompts); the image tool writes to `~/.codex/generated_images/` regardless.
- `-i` is **repeatable** — pass the portrait first, logo second, proof screenshot third (match the ordinal words in the prompt: "FIRST attached image", "SECOND attached image", "THIRD attached image"). Skip a slot you do not have and renumber the ordinals.
- The model already understands "1080x1080" and the layout; Codex's image tool may emit a slightly different square size (e.g. 1024² or 1254²) — that's expected, the normalize step fixes it.
- **Parallel-safe.** Each run's image lands in its own `~/.codex/generated_images/<session-id>/` folder and the session id is printed on stderr, so you can run all 4 variations in parallel and still attribute each image exactly. Capture each run's `session id` and collect from that folder.

Copy each collected image into the output folder with a descriptive name, then normalize it (next section):

```bash
cp "$NEW" "$SAVE_FOLDER/social-{slug}-a.png"
```

For a batch (parallel or sequential), collect **by session id** — one folder per run — not by "newest mtime." The `-newer` trick races when runs overlap; the session id printed on each run's stderr is exact.

---

## Normalizing output (enforce exact dimensions)

Hard rule: the final file must be **exactly** the format's pixel size. Codex's image tool won't always hit it. Normalize every keeper with `sips` (macOS) — note `sips -z` takes **height then width**:

```bash
# square 1080x1080
sips -z 1080 1080 "social-{slug}-a.png" --out "social-{slug}-a.png"
# portrait 1080x1350 (4:5)
sips -z 1350 1080 "social-{slug}-a.png" --out "social-{slug}-a.png"
# story 1080x1920 (9:16)
sips -z 1920 1080 "social-{slug}-a.png" --out "social-{slug}-a.png"
```

If the generated aspect ratio differs from the target (e.g. a square image for a story slot), crop to the target aspect first (`sips --cropToHeightWidth`), then resize. On Linux use ImageMagick: `convert in.png -resize 1080x1080^ -gravity center -extent 1080x1080 out.png`.

---

## Hard rules (never break)

> **Rules 3, 4, 9, and 11 are the skill's signature** (serif focal type, mono accent line, filled CTA pill, floating dark proof card). They apply in **Signature mode**. In **On-system mode** they yield to the repo's design system — its fonts, CTA style, and anti-slop rules win. Every other rule always applies, both modes.

1. **Output is exactly the format size.** square 1080×1080, portrait 1080×1350, story 1080×1920. Normalize before delivering.
2. **Safe zones: keep the top ~7% and bottom ~7% clear** of text, CTA, logo/mascot, and handle (≈80px top/bottom on a 1080-square; scale proportionally for taller formats). Lets the user crop for different placements.
3. **Display font: heavy display serif** (e.g. Fraunces Black). Sharp, high-contrast strokes. **Never default sans-serif** — Inter / Roboto / system sans look generic and AI-generated.
4. **Accent font: monospace bold** for the terminal-style accent line. Signals "tech / built / system" instantly.
5. **Pose-direction rule:** the portrait's pointing direction must face inward toward the headline.
   - On the right side → don't point right (off-frame).
   - On the left side → don't point left.
   - Neutral poses (chin, thumbs up, etc.) → either side is fine.
6. **No em dashes** in any copy. Use periods, commas, parentheses, or line breaks.
7. **One large focal element per ad.** Usually one accent-colored word or number set ~2.5× larger than surrounding type. The eye lands in one place.
8. **Logo/mascot lives in the top-right corner**, inside the safe zone.
9. **CTA pill is filled with the accent color** with type-color text in display serif Bold, ending with `→`. Lives in the bottom area inside the safe zone.
10. **Handle (`@brandname` or business name) in tiny mono type, bottom-left, inside the safe zone.**
11. **Floating proof cards are ALWAYS dark UI** (rounded corners, drop shadow, slight tilt 6–8°, glowing edge halo). Never full-bleed backgrounds.

---

## Prompt template

Fill the slots from the resolved branding and user choices. `{{...}}` are variables. Paste the filled result into the `codex exec` prompt (after the "Use the FIRST/SECOND attached image…" lines).

```
{{FORMAT_LINE}} CRITICAL LAYOUT CONSTRAINT: the top and bottom safe margins of the canvas must be completely empty — no text, no CTA, no logo, no handle, no graphic elements in those zones.

Background: {{PALETTE_DESCRIPTION}}. {{ATMOSPHERE}}. Hex palette: type {{TYPE_COLOR}}, accent {{ACCENT_COLOR}}, background {{BG_COLOR}}.

Place the person from the FIRST attached image {{PLACEMENT}}, large and crisp, with {{LIGHTING_NOTE}}. {{POSE_DIRECTION_NOTE}}

{{LOGO_BLOCK}}

Headline in HEAVY DISPLAY SERIF font ({{DISPLAY_FONT}}, sharp high-contrast strokes, NOT sans-serif), tight leading, with CLEAN BALANCED HIERARCHY. {{HEADLINE_LAYOUT}}

{{ACCENT_LINE_BLOCK}}

{{SUBHEAD_BLOCK}}

{{PROOF_CARD_BLOCK}}

Wide rounded-pill button positioned safely above the bottom safe margin, filled with {{ACCENT_COLOR}}, {{CTA_TEXT_COLOR}} serif text "{{CTA}} →" in {{DISPLAY_FONT}}, glowing accent shadow underneath.

Tiny {{HANDLE_COLOR}} mono "{{HANDLE}}" in {{ACCENT_FONT}} just above the bottom safe margin.

Premium ad design with elegant balanced typography, ultra crisp text rendering, no artifacts, no extra logos.
```

### Signature skeleton (the tchan) — fill THIS in Signature mode

The block above is the neutral structure. In Signature mode, fill this skeleton instead: it bakes the seven ingredients in so the drama is not optional. Validated against Codex (gpt-image) — it produced the reference ads. Swap every `{{slot}}` for the brand's real tokens and the user's copy.

```
{{FORMAT_LINE}} CRITICAL: the top 80px and bottom 80px of the canvas must be completely empty.

Background: dark radial gradient, rich {{BG_COLOR}} edges blooming to a {{ACCENT_COLOR}} highlight at center, warm vignette, cinematic moody scroll-stopping lighting. Hex palette: type {{TYPE_COLOR}}, accent {{ACCENT_COLOR}}, background {{BG_COLOR}}.

No human subject — typography-led, with a warm rim-light glow at center separating the type from the dark background. (If a portrait is set, place the FIRST attached image {{PLACEMENT}} instead, lit by that same rim glow.)

Small {{BRAND}} wordmark logo from the attached image in the top-right corner, inside the top safe zone, no recoloring.

Headline in HEAVY DISPLAY SERIF ({{DISPLAY_FONT}}, sharp high-contrast strokes, NOT sans-serif), tight leading. The SINGLE focal element is {{FOCAL}} set about 2.8x larger than the rest of the type, in accent {{ACCENT_COLOR}}. The supporting line(s) in smaller {{TYPE_COLOR}} serif read: "{{SUPPORT_COPY}}".

Directly below, ONE accent MONOSPACE line ({{ACCENT_FONT}}) as a terminal command with a leading dollar sign and blinking cursor: "$ {{COMMAND}}█".

CRITICAL element: a SLIGHTLY TILTED dark UI proof card floating in 3D space, rotated about -8 degrees with real perspective and depth, rounded corners, soft drop shadow, glowing accent edge halo. It shows: "{{PROOF_TITLE}}", a {{CHART}} trending up, a prominent "{{METRIC}}", and a small source tag "{{SOURCE}}".

Wide rounded-pill button above the bottom 80px margin, filled with {{ACCENT_COLOR}}, cream serif text "{{CTA}} →" in {{DISPLAY_FONT}}, glowing accent shadow underneath.

Tiny cream mono "{{HANDLE}}" in {{ACCENT_FONT}} just above the bottom safe zone.

Premium ad, elegant balanced typography, ultra crisp text rendering, no artifacts, no extra logos.
```

### Format line filler

- **square:** `Square 1:1 social ad designed for 1080x1080 final output.`
- **portrait:** `Vertical 4:5 social ad designed for 1080x1350 final output.`
- **story:** `Vertical 9:16 story/reel ad designed for 1080x1920 final output, with extra breathing room top and bottom.`

### Slot fillers

**Dark-dominant palette block** (when palette has a dark bg):
```
Background: dark radial gradient using palette colors, rich {{BG_COLOR}} edges blooming to {{ACCENT_COLOR}} highlight at center, warm vignette, cinematic moody lighting
Atmosphere: cinematic, moody, scroll-stopping
Lighting note: a warm rim-light glow separating the subject from the dark background
CTA text color: cream-white version of the type color
Handle color: cream-white
```

**Light-dominant palette block** (when palette has a light bg):
```
Background: warm light radial gradient, soft {{BG_COLOR}} outer edges, slightly darker mid-tone, subtle warm highlight at center, airy editorial atmosphere
Atmosphere: airy, premium, magazine-ad feel
Lighting note: a soft grounding shadow under the subject
CTA text color: cream version of the bg
Handle color: type color
Proof card note: dark UI proof cards POP against a light bg, keep them dark themed
```

**Logo block** (when a logo is set):
```
Place the small brand logo from the SECOND attached image in the top-right corner, inside the safe margin, modest size, crisp, no recoloring.
```
(Omit this block and the "SECOND attached image" reference if no logo.)

**Accent line — terminal-style (use when a "tech / built / system" signal helps):**
```
Directly below the headline, a single accent line in {{ACCENT_COLOR}} MONOSPACE font ({{ACCENT_FONT}}) styled as a terminal command with a leading dollar sign and blinking cursor: "$ {{COMMAND}}█".
```

**Accent line — title-case promise:**
```
Below the headline, an accent subhead in {{ACCENT_COLOR}} MONOSPACE font ({{ACCENT_FONT}}) at modest size, two lines tight stacked, no leading dollar sign, no cursor: "{{LINE_1}}" / "{{LINE_2}}".
```

**Proof card variants:** analytics, dashboard, notification stack, ads manager, inbox, calendar, phone screen, or none. Detailed drop-in blocks live in `prompt-blocks.md` next to this file — read on demand. Note: the ordinal of a proof screenshot reference is the THIRD attached image (after portrait and logo); if there's no logo, it becomes the SECOND.

---

## Voice + copy guidelines

Pulled from the resolved branding's voice/tone. Apply consistently.

- **Headlines = one strong promise.** Specific result or specific use-case. Not abstract.
- **Avoid fear-based "you'll be replaced" framing.** A positive promise of capability converts better.
- **Avoid vague benefit copy** ("transform your business", "unlock your potential"). Be concrete.
- **Title Case** for sub-headlines and CTA copy.
- **No em dashes.** Periods, commas, line breaks instead.
- **CTA verbs that convert:** Get, Steal, Join, Copy, Build, Lock in, Start, Claim.
- **Always end the CTA with `→`.**

---

## Filename + output convention

- During generation: `social-{slug}-{a|b|c|d}.png` in the user's output folder.
- On approval: `cp` to the `Keepers/` subfolder unchanged.
- Slug: derived from the headline — kebab-case, max 5 words.

---

## Notes

- **Cost / billing:** Codex image generation runs on your ChatGPT/Codex plan. There's no separate image API bill and no `OPENAI_API_KEY` to manage — `codex login` is the only setup.
- **Iteration is cheap.** Generate 4 variations, pick one, regenerate the rest with adjustments. Don't try to nail it in one prompt.
- **Branding precedence:** the repo's live design system (Step 0.1) beats the saved profile. This is deliberate — assets should match the product you're actively building in. The saved profile is the portable fallback for one-off or repo-less runs.
- **Save your wins.** The `Keepers/` folder doubles as a future reference library — attach approved ads as extra `-i` references to nudge Codex toward your established style.
- **Update branding any time** by editing `~/.config/social-assets-factory/brand-profile.json` (fallback) or the repo's design source (preferred), or by asking the assistant to "update my social-assets brand profile".
