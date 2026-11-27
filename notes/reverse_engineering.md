# Magia Record Live2D home viewer — reverse‑engineering notes

This note collects the reverse‑engineering (RE) details that informed the viewer’s placement, scaling, and motion behavior. The goal is to keep the JS implementation readable while preserving the rationale.

## Coordinate spaces

### Home placement space (design space)
- Home UI placement is treated as a **1024×576** space.
- The in‑game draw matrix for 1024×576 shows a center translation at **(512, 288)**.
- Offsets from the game (example): `StoryCharaLive2DSprite setOffset: x=-132.00 y=-1.00`.

### Viewer “world” space
- The viewer keeps a **1024×768** world, with the 1024×576 home region centered vertically:
  - `HOME_TOP = (768 - 576) / 2 = 96`
  - The model is positioned in home coordinates, then converted into Pixi’s Y‑down coordinates.

### Tablet / 1024×768 logs (why it still matches)
When the device framebuffer is 1024×768, logs typically show:
- `draw Mat4: tx=512 ty=384` (center of 1024×768)
- `SetMvpMatrix: tx=-0.2578` which matches `-132/512`
- `SetMvpMatrix: sx=1.300000 sy=1.733333` where `1.733333 ≈ 1.3*(1024/768)`

This indicates the **same home placement** is being mapped through a different projection/aspect, rather than using a different per‑character placement.

## Placement (X, Y)

### X offset
- Home X placement uses a constant offset:
  - `HOME_OFFSET_X = -132`
  - `xGame = 512 + HOME_OFFSET_X`

### Y mapping from `params.json.height`
From hooked `CubismRenderer::SetMvpMatrix` logs across `1024×576`, `1024×672`, and `1024×768` (7 characters, max error `0.000048`):

- Normalized Cubism MVP Y translation:
  - `ty = ((height - 0.5) / 512) * (1024 / viewH)^2`
- Design-space Y (`0..viewH`, Y-up):
  - `yGame = (viewH / 2) + (height - 0.5) * (1024 / viewH)`
- Conversion to Pixi (Y-down) inside the `1024×768` world (`viewTop = (768 - viewH) / 2`):
  - `model.y = viewTop + (viewH - yGame) = 384 - (height - 0.5) * (1024 / viewH)`

(Note: an earlier 4:3 regression from 1200×900 tablet logs yielded slope `1.137932` due to a `1200/1024` scaling artifact; the true `1024×768` slope is `1024/768 = 1.333333`.)

At `height = 0.5`, all `viewH` values converge at `model.y = 384` (world center).

| viewH | slope (`1024/viewH`) | model.y (`height=0`) | model.y (`height=-80`) |
|-------|----------------------|----------------------|------------------------|
| 576 (16:9) | 1.7778 | 384.9 | 527.1 |
| 672 (mid) | 1.5238 | 384.8 | 506.7 |
| 768 (4:3) | 1.3333 | 384.7 | 491.3 |

### MyPage Portrait (90° CCW) mapping
From `1024×576`, `1024×672`, and `1024×768` portrait logs (`SetMvpMatrix` `tx` and screenshot proportions):

```
aspect         = 1024 / viewH
portraitFactor = min(2.0, 1.3 * aspect)
portraitScale  = (portraitFactor / 1.3) * 0.85
model.x        = 512 - (height + 35) * portraitFactor * aspect
model.y        = isDual ? (viewTop + (posIndex === 0 ? 0.75 * viewH : 0.25 * viewH)) : 384
```

### Viewport parameters summary
| Mode | viewW | viewH | viewTop | worldContainer.y |
|------|-------|-------|---------|------------------|
| home16 | 1024 | 576 | 96 | -96 |
| dynamic | 1024 | 576..768 | (768 - viewH) / 2 | -viewTop |
| full43 | 1024 | 768 | 0 | 0 |
| portrait | 576 | 768 | 0 | 0 |

`viewTop = (WORLD_H - viewH) / 2` for all landscape modes.

## Scale
- The viewer matches the game’s “screen half‑width” style scaling.
- Uses Cubism canvas width when available and the model’s `originalWidth` to derive a baseline, then multiplies by `params.json.modelScale`.

## Motion behavior policy (home idle)

The viewer tries to mimic Magia Record “home” behavior:

- **Only** `motion_0xx` loops smoothly (idle).
- `motion_1xx`, `motion_2xx`, … should **play once and hold** on the final pose.
- Random/auto idle restarts are disabled.

### Blink + breath without body sway
- Keep eye blinking and breathing.
- Disable “natural movements” sway by overriding the natural‑movement update to affect only `ParamBreath`.
- Ensure blink runs even while motions play (applied after motion updates).

## Snapshot capture
- Snapshot renders the model on a transparent background.
- A pixel‑perfect alpha crop is applied to remove empty margins.
- Extra padding + centering is applied before cropping to avoid clipping small parts (hair, beads, etc.).
