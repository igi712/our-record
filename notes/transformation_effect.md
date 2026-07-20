# Transformation Effect in Scenario JSONs

Found while inspecting scenario JSONs under `assets/ma-re-data/resource/scenario/json/adv/scenario_1/`.

## Pattern

When a character transforms (or detransforms) between Magical Girl forms, the scenario JSON uses these fields together on the same event object:

| Field | Value | Purpose |
|-------|-------|---------|
| `"effect"` | `"ef_adv_05"` | Character visual effect (the sparkle/shape-shift effect on the model) |
| `"se"` | `"7205_magic_girl"` | Transformation sound effect |
| `"flashEffect"` | `"flashWhiteSlow2"` *(sometimes)* | Optional screen flash |

The character's `id` changes between events to reflect the new form (last digit changes between untransformed and transformed variants, e.g. `100100` ↔ `100102`).

## Confirmed Example — `101502-5_HfhXG.json`

```
Line 6:  Yachiyo (id:100201, untransformed) speaks
Line 7:  Yachiyo (id:100200, transformed) + effect:"ef_adv_05" + se:"7205_magic_girl"
         → blank text line (textClear:1), visual plays out
Line 9:  Iroha (id:100101, untransformed) speaks
Line 10: Iroha (id:100100, transformed) + effect:"ef_adv_05" + se:"7205_magic_girl"
         → blank text line, visual plays out
```

Both transforms follow the same structure: a 1-second `autoTurnLast` pause, the effect+sound fire, `textClear:1` clears the text box so the animation plays without text.

## Another Example — `101201-7.json`

Iroha gets knocked down (id:100100 → takes damage), then transforms back up with `effect:"ef_adv_05"` + `se:"7205_magic_girl"` + `flashEffect:"flashWhiteSlow2"`.

## Viewer Status

The viewer (`viewer.js`, `model.js`, etc.) has **no references** to `ef_adv_05` or `7205_magic_girl`. The `effect` and `se` fields in the scenario JSON are metadata from the original game engine — the viewer currently does not process or play them. Adding support for these would require:

- Loading and playing the SE file (`.hca`? `.ogg`?) at the moment the scenario event fires
- Displaying whatever visual effect `ef_adv_05` maps to (likely a sprite animation or particle effect)

## Other Effects Seen

- `"effect":"fadein"` / `"effect":"fadeout"` — standard character appear/disappear (no transform)
- `"turnEffect":"promist"` — dream / flashback scene transition
- `"effect":"ef_adv_06"` — seen in passing, possibly doppel or other special effect
