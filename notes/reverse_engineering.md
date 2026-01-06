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
