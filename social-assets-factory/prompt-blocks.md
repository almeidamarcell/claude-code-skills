# Proof card prompt blocks

Drop-in `{{PROOF_CARD_BLOCK}}` fillers for the main `SKILL.md` prompt template.

## Reference-image ordinals (read first)

Codex attaches reference images via repeatable `-i` flags, in order. The ordinal words in these blocks ("SECOND attached image", "THIRD attached image") must match the order you pass them:

- **With a logo:** portrait = FIRST, logo = SECOND, proof screenshot = THIRD.
- **Without a logo:** portrait = FIRST, proof screenshot = SECOND.

Adjust the ordinal word in the block to match what you actually attach.

---

## Analytics card (followers, revenue, growth metrics)

```
CRITICAL element: a SLIGHTLY TILTED dark UI iPhone-style analytics card floating in 3D space, rotated about -8 degrees with realistic perspective and depth. Rounded corners, soft drop shadow, glowing accent edge halo, dimensional 3D look. Card shows: title "{{CARD_TITLE}}", number "{{BIG_NUMBER}}" prominently, label "{{TIMEFRAME}}", green +{{DELTA}}% delta, smooth line chart sloping up to the right with a dim grid background.
```

No reference image needed.

---

## Dashboard card (using a screenshot reference)

```
CRITICAL element: in the empty space next to the subject, float a SLIGHTLY TILTED dark UI dashboard card based on the {{PROOF_ORDINAL}} attached image (a dashboard screenshot the user provided). Card rotated about -7 degrees, rounded corners, soft drop shadow, glowing accent edge halo, very legible and crisp showing actual chart cards and KPI panels. NOT a background — a discrete proof element.
```

Attach the screenshot as the next `-i` image (THIRD with a logo, SECOND without). Replace `{{PROOF_ORDINAL}}` with `THIRD` or `SECOND` accordingly.

---

## Notification stack (work-being-done signal)

```
CRITICAL element: float a SLIGHTLY TILTED dark UI notification stack card showing three iOS-style notifications, each with the brand avatar from the SECOND attached image. Top notification reads in bold: "{{BRAND_NAME}} — 1m ago" with body "{{TASK_COMPLETED_MESSAGE}}". Below that, two dimmer notifications with shorter bodies: "{{TASK_2}}" and "{{TASK_3}}". Card rotated about -8 degrees, rounded corners, glowing accent edge halo.
```

Uses the logo/brand mark (the SECOND attached image) as the avatar. Example task messages: "Reply sent to 12 leads", "Posted today's reel", "Drafted weekly newsletter", "Booked 3 calls". If no logo is attached, drop the avatar reference and describe a generic brand glyph instead.

---

## Ads Manager card (for ad/campaign promises)

```
CRITICAL element: in the empty space between the subject and the headline, float a SLIGHTLY TILTED dark UI ads manager-style card showing campaign performance: metric cards reading "Spend" "$X,XXX", "Reach" "XXX,XXX", "CPL" "$X.XX", a line chart trending up, and one row labeled "Active Campaign". Card rotated about 6 degrees, rounded corners, soft drop shadow, dimensional 3D look.
```

No reference image needed.

---

## Inbox card (for email/messaging promises)

```
CRITICAL element: float a SLIGHTLY TILTED dark UI email inbox card showing 4–5 email rows, each with a sender avatar, subject line, and a snippet of automated AI-drafted reply text. The first row is highlighted with a subtle accent glow and tagged "AI DRAFTED". Card rotated -7 degrees, rounded corners, soft drop shadow.
```

No reference image needed.

---

## Calendar card (for booking/scheduling promises)

```
CRITICAL element: float a SLIGHTLY TILTED dark UI calendar card showing a week view with several time slots filled in, each labeled with a meeting name and a small green "BOOKED" indicator. Card rotated 6 degrees, rounded corners, soft drop shadow, glowing accent edge.
```

No reference image needed.

---

## Phone screen card (generic mobile UI)

```
CRITICAL element: a SLIGHTLY TILTED dark UI phone-screen mockup floating in 3D space showing the user's app or interface based on the {{PROOF_ORDINAL}} attached image. Rotated -8 degrees, rounded corners with a realistic phone bezel, soft drop shadow, glowing accent edge halo.
```

Attach the app screenshot as the next `-i` image and set `{{PROOF_ORDINAL}}` to `THIRD` (with a logo) or `SECOND` (without).

---

## No proof card

If the headline alone carries the ad, omit `{{PROOF_CARD_BLOCK}}` entirely from the prompt and add: "Generous breathing room around the headline so it commands the frame."
