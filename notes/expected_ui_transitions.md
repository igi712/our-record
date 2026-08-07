# Expected UI transitions (reference: as-is in the game)

Reference observations from the live game (Magia Record EN), used as the
baseline for manual review of the MyPage left-column port. All timings are
approximate from watching playback.

## Key distinction: two animation styles, context-dependent

| Element | Changing screens (route transition) | Opening/closing menu |
|---|---|---|
| Left utility menu (chara portrait, gift, news, etc., custome) | **Fades in in place** (no slide) | **Slides in/out while fading** |
| Top stats UI (Rank/EXP, Gems, AP) | Already 100% visible and in-place the moment anything is visible | Fades in/out and slides in/out |
| Carousel banner + dots | Dots appear first, then banners slide in from the right | Appears **abruptly** (no slide) |
| Right-side items (coin menus, pill bubbles: patrol, kimochi, current event) | Slide in from the right | Fade + slide |
| Live2D | Fades in **last**, after banners; disappears **abruptly** (no fade) on transitions | Disappears abruptly mid slide-out; fades back in ~400-450ms later |

---

## Title screen → homescreen (initial entry)

1. Tapping the title screen fades it to white and displays `connecting`.
2. When the white starts to fade out, `connecting` is still shown, and:
   - The right side menu was already opened automatically (mid-slide — e.g. the
     coin menus are already sliding in; when anything was vaguely visible, only
     a small part of them was still outside the screen).
   - The upper UI (Rank/EXP, Gems, AP) is already fully loaded — 100% visible
     and in place the moment anything is vaguely visible (not transparent, not
     out of place).
   - ~150-200ms into the white fading out: the **left utility menu** (chara
     circle portrait, gift, news, etc, custome) starts **fading in in place**
     (NOT sliding from the left); ~200-250ms until fully visible.
   - At this point everything is visible except the carousel banner and the
     Live2D.
3. Later, `connecting` disappears; ~100-150ms later the carousel banner appears:
   - the bottom circles (dots) first,
   - at the same time the banner items slide in from the right,
   - an extra banner fades into the top (the joke "magical sumo" event).
4. ~200-250ms for the banners to be in place. The title music fades out while
   the homescreen BGM fades in at the same time.
5. ~200-250ms later the Live2D model starts fading in — she spawns with the
   sequence already playing (not starting from idle motion); subtitles only
   appear ~100-150ms into the fade-in.

## Menu button → hide menus

1. The banners disappear **instantly**.
2. The other menu items fade out and slide out of the screen at the same time.
3. ~100-150ms into the slide-out, the Live2D suddenly disappears **without
   fading out**.
4. ~400-450ms later, when the UI is 100% not visible, the Live2D reappears with
   a ~200ms fade-in.
5. ~50-75ms later, the Options, Hide Buttons, orientation rotate, and custome
   buttons start fading in **in place** (no slide); ~250-300ms until 100%
   visible.

## Menu button → show menus

1. The carousel banners + dots appear **abruptly**; curiously they don't slide
   to the left, and a fully shown banner is displayed (previous state?).
2. The pill bubbles (patrol, kimochi, current event) also all appear abruptly
   at the same time as the carousel.
3. At the same time the rest of the UI fades in and slides in from left, top
   and right — note: the top UI does NOT appear abruptly in place; the left UI
   slides in from the left instead of fading in in place.

## Clicking a menu (e.g. shop)

1. Every UI except the show/hide menu button and the top UI (Rank, Gems, AP)
   disappears **abruptly**.
2. ~100ms later `connecting` appears.
3. A while after, the background crossfades into the new one (shop → Mitama's
   coordination shop), with the Live2D disappearing abruptly at the start of
   the crossfade (no fade-out). The Rank/Gems/AP and show/hide menu button are
   still there the whole time.
4. ~200ms later the background changes; a bit after `connecting` disappears,
   the BGM changes, the Back button appears, the UI fades in, then the Live2D
   fades in.
5. (Shop-internal content is out of scope here. Rank/Gems/AP and MENU remain
   present the entire time.)

## Back button → homescreen

1. Rank/Gems/AP and the show/hide menu button are still there the whole time.
2. Live2D and the other UI disappear **abruptly**, then `connecting` appears.
3. A while after (presumably loading bg + music), the background crossfades
   into the homescreen bg (~300ms).
4. About a flash: `connecting` disappears at the same time the Back button
   disappears.
5. `connecting` appears again (presumably Live2D + assets) at the same time as
   the three pill bubbles; the right side menu fades in and slides in at the
   same time.
6. ~250ms later the left utility menus (magical girl circle portrait, gift,
   news, etc, custome) fade in **in place** (NOT slide from left); ~250ms until
   fully visible.
7. `connecting` disappears, and at the same time the dots below the banner
   carousel appear, then the banners slide in (first banner from the right).
8. ~150ms later, when the banners are in place, the Live2D fades in.
