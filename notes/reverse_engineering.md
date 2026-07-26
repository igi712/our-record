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
A near‑perfect linear fit was derived from in‑game logs:

- $y_{game} = a + b \cdot height$
- Using collected samples:
  - `a = 287.0999674453658`
  - `b = 1.7775731122833498`

So:
- `yGame = HOME_Y_INTERCEPT + height * HOME_Y_PER_HEIGHT`

Conversion to Pixi (Y down) inside the centered home region:
- `yWorld = HOME_TOP + (HOME_H - yGame)`

### Y mapping — 4:3 (tablet) variant
A separate regression from 1200×900 tablet landscape logs:
- `yGame = (WORLD_H/2) * (1 + ty)` where `WORLD_H=768`
- Fitted constants:
  - `a = 383.35314268220066`
  - `b = 1.1379321886101403`
- `yGame = VIEW43_Y_INTERCEPT + height * VIEW43_Y_PER_HEIGHT`

### Y mapping — why two formulas exist
The same character placement is re-projected through different aspect ratios:
- **home16** (16:9, viewH=576): derived from native 16:9 phone logs, center at (512, 288)
- **full43** (4:3, viewH=768): derived from tablet landscape logs, center at (512, 384)

Both converge at height=0 (`model.y ≈ 384.8`, the world center), but the per-height slope differs because the game scales differently across projections. The slopes come from empirical device logs, not from a geometric derivation — so they can't be computed purely from viewH, only interpolated between the two known data points.

### Unified Y formula (interpolated)
A single formula that works for any viewport height between 576 and 768:

```
t = clamp((viewH - 576) / 192, 0, 1)

intercept = 287.10 + t × 96.25       // lerp between the two intercepts
slope     = 1.778  - t × 0.64        // lerp between the two slopes

yGame     = intercept + height × slope
model.y   = ((768 - viewH) / 2) + (viewH - yGame)
```

Constants:
- 16:9 endpoint: viewH=576, intercept=287.10, slope=1.778
- 4:3 endpoint: viewH=768, intercept=383.35, slope=1.138
- `height` = the model's `params.height` value (per-character)

At height=0, all viewH values produce `model.y ≈ 384.8` (world center — convergence point).

| viewH | t | intercept | slope | model.y (height=0) | model.y (height=100) |
|-------|---|-----------|-------|---------------------|----------------------|
| 576 (16:9) | 0 | 287.10 | 1.778 | 384.9 | 207.1 |
| 672 (mid) | 0.5 | 335.23 | 1.458 | 384.8 | 238.9 |
| 768 (4:3) | 1 | 383.35 | 1.138 | 384.6 | 270.9 |

### Viewport parameters summary
| Mode | viewW | viewH | viewTop | worldContainer.y |
|------|-------|-------|---------|------------------|
| home16 | 1024 | 576 | 96 | -96 |
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
