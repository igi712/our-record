# Live2D & Subtitle Positioning Reference

Technical reference consolidating all hooked game data from `logs.txt` and `logs2.txt`.
**Goal**: Serve as the implementation spec for dual units (two-character mode) in `viewer.html` and `quotes.html`, and general positioning for a future homescreen page and story viewer.

---

## 1. Rendering Pipeline Architecture

### 1.1 Two-Matrix System

The game renders each Live2D model through two stacked transforms:

| Layer | Class | Role | Coordinate Space |
|:------|:------|:-----|:-----------------|
| **Container** | `LAppViewCustom` | Screen-space anchor for the model's draw-node. Sets the pixel position of the Live2D canvas **origin**. | Cocos2d-x screen coords (pixels) |
| **Model MVP** | `CubismRenderer.SetMvpMatrix` | Normalized model translation, scale, and per-character height offset within the canvas. Driven by `params.json` height + `setOffset`. | NDC-like, ±1 range per half-screen-width |

**Key insight**: `LAppViewCustom` primarily controls the **X screen position** of the rendering canvas, while `CubismRenderer` encodes the character's logical offset within that canvas (including height-based Y). In single-unit scenes, `LAppViewCustom tx` is fixed at screen center; in dual-unit scenes it splits to give each sub-model its own canvas origin.

### 1.2 Data Flow

```
StoryCharaLive2DSprite.setOffset(offsetX, offsetY)
    ↓
    ├─→ xGame = 512 + offsetX          (home design-space X)
    ├─→ yGame = 287.10 + 1.778 × height (from params.json)
    ↓
LAppViewCustom draw Mat4
    tx = <canvas origin X pixel>   ty = <canvas origin Y pixel>
    ↓
CubismRenderer SetMvpMatrix
    tx = offsetX / 512.0            (normalized model X)
    ty = f(height, mode)            (normalized model Y)
    sx, sy = scale factors          (aspect-dependent)
```

### 1.3 CubismRenderer tx Formula

$$\text{CubismRenderer } tx = \frac{\text{offset.x}}{512.0}$$

Verified across every logged sample:

| offset.x | Expected tx | Logged tx |
|:--------:|:-----------:|:---------:|
| -324.0 | -0.6328 | -0.6328 |
| -262.0 | -0.5117 | -0.5117 |
| -132.0 | -0.2578 | -0.2578 |
| -112.0 | -0.2188 | -0.2188 |
| 0.0 | 0.0000 | 0.0000 |
| 28.0 | 0.0547 | 0.0547 |
| 60.0 | 0.1172 | 0.1172 |
| 162.0 | 0.3164 | 0.3164 |
| 324.0 | 0.6328 | 0.6328 |
| 420.0 | 0.8203 | 0.8203 |

### 1.4 Scale Factors by Aspect Ratio

| Aspect | Design Resolution | `sx` | `sy` | `sy` derivation | `SetWidth` |
|:------:|:-----------------:|:----:|:----:|:----------------|:----------:|
| **16:9 Landscape** | 1024×576 | 1.300 | 2.311111 | `1.3 × (1024/576)` | 1.300 |
| **4:3 Landscape** | 1024×768 | 1.300 | 1.733333 | `1.3 × (1024/768)` | 1.300 |
| **9:16 Portrait** | 576×1024 | 0.000* | 0.000* | — | 0.850 |

> *Portrait `sx`/`sy` log as `0.000000` — the actual projection is constructed differently (see §4.2). The `SetWidth = 0.850` indicates a reduced model scale.

---

## 2. Single-Unit Positioning (Landscape 16:9)

Design space: **1024×576**, center `(512, 288)`.
Test character: Konomi (`303000`).

### 2.1 Live2D Coordinates

| Mode | `posNum` | `offset.x` | `xGame` | `LAppView tx` | `CubismRenderer tx` | `CubismRenderer ty` |
|:-----|:--------:|:----------:|:-------:|:-------------:|:--------------------:|:--------------------:|
| **Homescreen (Default)** | 1 | -132.0 | 380.0 | 512.0 | -0.2578 | -0.4352 |
| **Camera: Center** | 1 | 0.0 | 512.0 | 512.0 | 0.0000 | -0.4352 |
| **Camera: Center-Right** | 1 | 162.0 | 674.0 | 512.0 | 0.3164 | -0.4352 |
| **Camera: Right** | 1 | 324.0 | 836.0 | 512.0 | 0.6328 | -0.4352 |
| **Camera: Left** | 1 | -324.0 | 188.0 | 512.0 | -0.6328 | -0.4352 |
| **Camera: Center-Left** | 1 | -162.0 | 350.0 | 512.0 | -0.3164 | -0.4352 |
| **Quotes** | 1 | -262.0 | 250.0 | 512.0 | -0.5117 | -0.4352 |

**Observations**:
- `LAppViewCustom tx` is **always 512.0** for single units — the canvas stays centered.
- `CubismRenderer ty` is **constant at -0.4352** across all camera positions for this character — the vertical offset depends only on the character's `params.json` height, not the camera preset.

### 2.2 Subtitle Positions

| Mode | Initial X | Target X (Hooked) | Y (Initial → Target) | Font Size |
|:-----|:---------:|:------------------:|:---------------------:|:---------:|
| **Homescreen** | -120.0 | -135.0 | -300.0 → -330.0 | 24.0 |
| **Camera: Center** | 12.0 | -5.0 | -300.0 → -330.0 | 22.0 |
| **Camera: Center-Right** | 174.0 | 157.0 | -300.0 → -330.0 | 22.0 |
| **Camera: Right** | 336.0 | 157.0 | -300.0 → -330.0 | 22.0 |
| **Camera: Left** | -312.0 | -167.0 | -300.0 → -330.0 | 22.0 |
| **Camera: Center-Left** | -150.0 | -167.0 | -300.0 → -330.0 | 22.0 |
| **Quotes** | -250.0 | -280.0 | -300.0 → -330.0 | 22.0 |

### 2.3 Subtitle Alignment Rules & Visual Mechanics

**Initial X Formula**:
$$\text{Subtitle Initial X} = \text{offset.x} + 12.0$$

**Hooked Target X Rules**:
1. **1:1 Character Tracking (Normal Positions)**: For standard positions, the target X coordinate tracks the character's `offset.x` almost perfectly (~3–5px difference), centering the subtitle box directly under the character:
   - **Homescreen**: Character `offset.x = -132.0` $\to$ Target X = **`-135.0`** (centered)
   - **Center**: Character `offset.x = 0.0` $\to$ Target X = **`-5.0`** (centered)
   - **Center-Left**: Character `offset.x = -162.0` $\to$ Target X = **`-167.0`** (centered)
   - **Center-Right**: Character `offset.x = 162.0` $\to$ Target X = **`157.0`** (centered)

2. **Screen Boundary Clamping (Far Left / Far Right Exceptions)**: When the character moves to extreme edges, the subtitle box stops tracking the character to prevent text clipping:
   - **Camera Left**: Character `offset.x = -324.0`, but Target X **clamps at `-167.0`** (same as Center-Left).
   - **Camera Right**: Character `offset.x = 324.0`, but Target X **clamps at `157.0`** (same as Center-Right).

3. **Quotes Page Offset**:
   - Character `offset.x = -262.0` $\to$ Target X = **`-280.0`** (~18px further left than the character's center line, shifting the text box slightly left-er than the character).

**Y Shift**: Always -300.0 → -330.0 (30px downward shift on hook).

**Font Size**: Homescreen default = 24.0; Camera/Quotes modes = 22.0.

---

## 3. Dual-Unit Positioning (Landscape 16:9)

Dual units render two Live2D models side by side: `posNum=0` (left character) and `posNum=1` (right character).
Test character: Ren & Rika Holiday (`35010x`).

### 3.1 Core Mechanics

1. **Both models receive the same `offset.x`** in `setOffset`.
2. **LAppViewCustom tx** provides the horizontal separation:
   - `posNum=0` canvas origin is placed further left.
   - `posNum=1` canvas origin is placed further right.
3. **CubismRenderer ty** differentiates height:
   - `posNum=0` → ty = **-0.4043** (Ren — taller/lower offset)
   - `posNum=1` → ty = **-0.5586** (Rika — shorter/higher offset)

### 3.2 LAppViewCustom tx Separation Patterns

The distance between the two canvas origins varies by camera preset:

| Mode | posNum=0 `LAppView tx` | posNum=1 `LAppView tx` | Δtx (separation) |
|:-----|:----------------------:|:----------------------:|:-----------------:|
| **Homescreen Default** | 216.0 | 452.0 | 236 px |
| **Camera: Center** | 216.0 | 216.0* | 0 px |
| **Camera: Center-Right** | 216.0 | 216.0* | 0 px |
| **Camera: Right** | 216.0 | 452.0 | 236 px |
| **Camera: Left** | 216.0 | 216.0* | 0 px |
| **Camera: Center-Left** | 216.0 | 452.0 | 236 px |
| **Center (Bigger Gap)** | 216.0 | 572.0 | 356 px |
| **Center (2 Bigger Gap)** | 216.0 | 672.0 | 456 px |
| **Center (Biggest Gap)** | 216.0 | 808.0 | 592 px |
| **Quotes (Duo)** | 216.0 | 432.0 | 216 px |

> \* When both are `tx=216.0`, the models overlap on-canvas and are separated purely by CubismRenderer tx (offset-based). This is the game's way of keeping both in the left portion of the screen while the offset pushes them right.

### 3.3 Full Dual-Unit Coordinate Table

| Mode | `offset.x` | `xGame` | posNum=0 `LAppView tx` | posNum=0 `Renderer tx, ty` | posNum=1 `LAppView tx` | posNum=1 `Renderer tx, ty` |
|:-----|:----------:|:-------:|:-----------------------:|:--------------------------:|:-----------------------:|:--------------------------:|
| **Homescreen** | 28.0 | 540.0 | 216.0 | (0.0547, -0.4043) | 452.0 | (0.0547, -0.5586) |
| **Cam: Center** | 180.0 | 692.0 | 216.0 | (0.3516, -0.4043) | 216.0 | (0.3516, -0.5586) |
| **Cam: Center-Right** | 300.0 | 812.0 | 216.0 | (0.5859, -0.4043) | 216.0 | (0.5859, -0.5586) |
| **Cam: Right** | 420.0 | 932.0 | 216.0 | (0.8203, -0.4043) | 452.0 | (0.8203, -0.5586) |
| **Cam: Left** | -60.0 | 452.0 | 216.0 | (-0.1172, -0.4043) | 216.0 | (-0.1172, -0.5586) |
| **Cam: Center-Left** | 60.0 | 572.0 | 216.0 | (0.1172, -0.4043) | 452.0 | (0.1172, -0.5586) |
| **Center (Bigger)** | 100.0 | 612.0 | 216.0 | (0.1953, -0.4043) | 572.0 | (0.1953, -0.5586) |
| **Center (2 Bigger)** | 70.0 | 582.0 | 216.0 | (0.1367, -0.4043) | 672.0 | (0.1367, -0.5586) |
| **Center (Biggest)** | 0.0 | 512.0 | 216.0 | (0.0000, -0.4043) | 808.0 | (0.0000, -0.5586) |
| **Quotes (Duo)** | -112.0 | 400.0 | 216.0 | (-0.2188, -0.4043) | 432.0 | (-0.2188, -0.5586) |

### 3.4 Dual-Unit Subtitle Positions

| Mode | Initial X | Target X (Hooked) | Font Size |
|:-----|:---------:|:------------------:|:---------:|
| **Homescreen** | 40.0 | -150.0 | 24.0 |
| **Camera: Center** | 192.0 | -5.0 | 22.0 |
| **Camera: Center-Right** | 312.0 | 115.0 | 22.0 |
| **Camera: Right** | 432.0 | 235.0 | 22.0 |
| **Camera: Left** | -48.0 | -245.0 | 22.0 |
| **Camera: Center-Left** | 72.0 | -125.0 | 22.0 |
| **Center (Bigger)** | 112.0 | -5.0 | 22.0 |
| **Center (2 Bigger)** | 82.0 | -5.0 | 22.0 |
| **Center (Biggest)** | 12.0 | -5.0 | 22.0 |
| **Quotes (Duo)** | -100.0 | -280.0 | 22.0 |

### 3.5 Quotes Duo: posNum=1 Standalone Draw

In `quotes.html` Duo mode, posNum=1 is drawn first (without posNum=0 in this specific log snapshot), with its own `LAppViewCustom tx=512.0` and `CubismRenderer ty=-0.5278`:

```
posNum=1, offset=(-192.0, -1.0), xGame=320.0
LAppViewCustom tx=512.0, ty=288.0
CubismRenderer tx=-0.3750, ty=-0.5278
```

Then the full duo is rendered in Story mode with the standard split (posNum=0 at tx=216, posNum=1 at tx=432).

### 3.6 Character Separation Gap ($\Delta X$) & 4:3 Aspect Impact

**16:9 Design Space Gap Calculations ($\Delta X = tx_1 - tx_0$)**:

| Mode | `tx_0` (Left) | `tx_1` (Right) | Exact $\Delta X$ | % of 1024px Width | Visual Layout |
|:-----|:-------------:|:-------------:|:----------------:|:-----------------:|:--------------|
| **Homescreen Default** | 216.0 | 452.0 | **236.0 px** | 23.05% | Standard side-by-side |
| **Quotes Duo Mode** | 216.0 | 432.0 | **216.0 px** | 21.09% | 20px tighter (grouped for left UI) |
| **Center (Bigger Gap)** | 216.0 | 572.0 | **356.0 px** | 34.77% | Modest separation |
| **Center (2 Bigger Gap)**| 216.0 | 672.0 | **456.0 px** | 44.53% | Wide separation |
| **Center (Biggest Gap)** | 216.0 | 808.0 | **592.0 px** | 57.81% | Opposite screen edges (~58% span) |

**4:3 Aspect Ratio (1024×768) Gap Mechanics**:
1. **Horizontal Distance Intact**: The horizontal gap $\Delta X = 452 - 216 = 236\text{px}$ remains identical across both 16:9 and 4:3 displays.
2. **Vertical Proportion Shift**:
   - In 16:9, 236px represents **41.0%** of screen height (236 / 576).
   - In 4:3, 236px represents **30.7%** of screen height (236 / 768).
   - Model vertical scale shrinks by 25% ($sy_{4:3} / sy_{16:9} = 1.7333 / 2.3111 = 0.75$).
3. **Visual Result**: The extra top/bottom room in 4:3 makes the same 236px gap appear visually tighter/closer relative to the total frame height.

---

## 4. Aspect Ratio Variations

### 4.1 Landscape 4:3 (1024×768 Framebuffer)

View center shifts to `(512, 384)` since `768 / 2 = 384`. `sy` changes proportionally in the MVP matrix:
$$sy_{4:3} = 1.3 \times \frac{1024}{768} = 1.733333$$
$$\frac{sy_{4:3}}{sy_{16:9}} = \frac{1.733333}{2.311111} = 0.75 = \frac{3}{4}$$

**Visual Reality & Implementation Notes**:
- **Model Size is Identical**: The $0.75$ matrix factor compensates for OpenGL NDC aspect ratio stretching in a 768-tall viewport. On screen, the character model **maintains its exact physical pixel height/scale** compared to 16:9.
- **Extended Vertical View**: Rather than scaling the character down, 4:3 simply reveals more artwork vertically—specifically showing lower parts of the Live2D model (feet/skirt) that were cut off in 16:9.
- **Viewer Y Formula Difference**: Because canvas Y center shifts from $288$ (16:9) to $384$ (4:3), the Y baseline formula $y_{\text{game}} = 287.10 + 1.778 \times \text{height}$ must account for the $+96\text{px}$ canvas origin shift (`ty = 384`) when rendering in a 768-tall world container.

Logged character data (all dual units, homescreen, `offset=(28.0, -1.0)`, `LAppView ty=384.0`):

| Unit | Model ID | `params.json height` | `CubismRenderer ty` | `LAppView tx` |
|:-----|:--------:|:--------------------:|:--------------------:|:-------------:|
| Iroha & Yachiyo | 130102 | -76.1719 | -0.2274 | 452.0 |
| Iroha & Yachiyo | 130100 | -93.7500 | -0.2795 | 216.0 |
| Amane Sisters | 111800 | -82.0312 | -0.2448 | 216.0 |
| Amane Sisters | 111802 | -82.0312 | -0.2448 | 452.0 |
| Karin & Alina | 111200 | -46.8750 | -0.1406 | 216.0 |
| Karin & Alina | 111202 | -87.8906 | -0.2622 | 452.0 |

---

### 4.2 Camera Portrait 9:16 (Axis-Swapped & Cropped)

In camera portrait mode (576×1024), the game does **not** stack characters vertically; characters remain **side-by-side**.

**Visual Reality & Axis Swapping**:
- **Cropped / Zoomed View**: Portrait mode behaves like cropping the 1024×768 landscape canvas down to a ~400–450px wide window centered around the characters. Because the frame is narrower and taller, characters **feel bigger** and occupy more of the visible screen area.
- **Swapped Axes**: In the logged matrices, `tx = 512.0` is fixed, while `ty = 144.0` and `ty = 432.0` drive the **horizontal side-by-side positioning** on screen:
  - Left character canvas: `ty = 144.0`
  - Right character canvas: `ty = 432.0`
  - Separation: $432 - 144 = 288\text{px}$ (positioned slightly tighter to fit portrait framing).
- **Portrait Height Mapping**: Loaded via `LoadHeight(fromJson=1)`, adjusting baseline per-character offsets for portrait mode (`SetWidth = 0.850`).

Logged portrait data:

| Unit | Model ID | `params.json height` | Slot / Position | `Renderer tx` | `Renderer ty` |
|:-----|:--------:|:--------------------:|:---------------:|:-------------:|:-------------:|
| Iroha & Yachiyo | 130100 | -125.0000 | `ty = 144.0` | 0.3125 | 0.0000 |
| Iroha & Yachiyo | 130102 | -101.5625 | `ty = 432.0` | 0.2083 | 0.0000 |
| Karin & Alina | 111202 | -117.1875 | `ty = 432.0` | 0.2778 | 0.0000 |
| Karin & Alina | 111200 | -62.5000 | `ty = 144.0` | 0.0347 | 0.0000 |
| Amane Sisters | 111802 | -109.3750 | `ty = 432.0` | 0.2431 | 0.0000 |
| Amane Sisters | 111800 | -109.3750 | `ty = 144.0` | 0.2431 | 0.0000 |

> **Note**: Height values differ between landscape and portrait for the same model ID (e.g., 130100 is -93.75 in 4:3 landscape but -125.0 in 9:16 portrait). The game loads different height parameters based on orientation via `LoadHeight(fromJson=0)` (landscape) vs `LoadHeight(fromJson=1)` (portrait).

---

## 5. Story Viewer Coordinates

### 5.1 Character Slot Positions (Landscape 16:9)

Story mode (`StorySceneLayer`) uses numbered position slots:

| Slot | `posNum` | `LAppViewCustom tx` | Example Character | `CubismRenderer ty` |
|:-----|:--------:|:-------------------:|:------------------|:--------------------:|
| **Left** | 0 | 216.0 | Mitama (101700) | -0.3704 |
| **Center** | 1 | 512.0 | Momoko (101000) | -0.4012 |
| **Right** | 2 | 808.0 | Iroha (100100) | -0.4938 |

`LAppViewCustom tx` follows a simple pattern: **216 / 512 / 808** (evenly spaced across 1024px width, with 216px margins).

### 5.2 Dialogue Box & Text Dimensions

**Font Sizes (Original → Hooked)**:

| Element | Original Size | Hooked Size | Notes |
|:--------|:------------:|:-----------:|:------|
| **Speaker name** | 16.0 | **24.0** | Enlarged for readability with custom font (Koruri) |
| **Dialogue text** | 27.0 | **30.0** | Slightly enlarged |
| **Narration text** | 32.0 | 32.0 | Font swapped to Koruri, size kept |
| **Log text (dialogue)** | 26.0 | 26.0 | Font swapped to Koruri |
| **Log text (narration)** | 26.0 | 26.0 | Font swapped to Koruri |

**Line Widths**:

| Element | Original | Hooked |
|:--------|:--------:|:------:|
| **Main dialogue line length** | 410.0 | **810.0** |
| **Backlog dimension width** | 410.0 | **710.0** |

### 5.3 Speaker Name Positioning (Hooked)

Names are positioned relative to the dialogue box center. The hooks move them outward to match the wider text box:

| Speaker Slot | Original Position (x, y) | Hooked Position (x, y) |
|:-------------|:------------------------:|:----------------------:|
| **Left** | (-215.0, 57.0) | **(-320.0, 63.0)** |
| **Center** | (-55.0, 57.0) | **(30.0, 63.0)** |
| **Right** | (215.0, 57.0) | **(320.0, 63.0)** |

### 5.4 Story Text Positioning (Hooked)

The main dialogue text is shifted left and slightly upward to align with the wider text box:

| Original Position (x, y) | Hooked Position (x, y) |
|:-------------------------:|:----------------------:|
| (-222.0, 20.0) | **(-368.0, 25.0)** |
| (-207.0, 30.0) | **(-360.0, 40.0)** |

### 5.5 Story Log (History) Repositioning

**Log Text**: All log dialogue text is shifted **+125px rightward** and **Y normalized to 66.5**:

| Speaker Slot | Log Text X (Original) | Log Text X (Hooked) | Log Text Y (Hooked) |
|:-------------|:---------------------:|:-------------------:|:-------------------:|
| **Right** (Iroha) | 272.0 | 397.0 | 66.5 |
| **Center** (Momoko) | 290.0 | 415.0 | 66.5 |
| **Left** (Mitama) | 310.0 | 435.0 | 66.5 |

**Log Speaker Names**: Repositioned per slot:

| Speaker Slot | Original Name X | Hooked Name X | Logic |
|:-------------|:---------------:|:-------------:|:------|
| **Left** | 70.0 | 70.0 (unchanged) | Y kept as-is |
| **Center** | 280.0 | **71.5** | Moved to left-align with Left names |
| **Right** | 500.0 | **700.0** (+200) | Pushed further right for wider log |

### 5.6 Narration

- **Narration text font size**: 32.0 (font swapped to Koruri).
- **Narration layout**: All text is **horizontally centered** (`x = 512`). Each row of narration text has its own Y position (determined by the total number of rows in the scene step).
- **Per-Row Entrance Animation**:
  - Each line starts slightly below its target Y position with opacity = 0.
  - When triggered, the row smoothly **slides upward into its Y position while fading from 0% to 100% opacity**.
  - Rows assemble top-to-bottom: each tap (or auto-advance) spawns the next row below the previous ones.
  - Once fully assembled, the centered text block stays static until the scene advances.
- **Not a vertical scroll**: Each narration screen is a complete text block, with per-row Y positioning computed from row count — not a continuous scrolling log.

---

## 6. Y Position & Height Mapping

### 6.1 Linear Fit (Landscape, from `reverse_engineering.md`)

$$y_{\text{game}} = 287.10 + 1.778 \times \text{height}$$

Where `height` is from `params.json` and is typically negative (shifting the model downward).

### 6.2 CubismRenderer ty from Height (16:9)

The `CubismRenderer ty` values observed in the logs can be cross-referenced with character heights:

| Character Context | `height` (inferred) | `CubismRenderer ty` |
|:------------------|:-------------------:|:--------------------:|
| Konomi single (303000) | — | -0.4352 |
| Ren & Rika posNum=0 (350101) | — | -0.4043 |
| Ren & Rika posNum=1 (350100) | — | -0.5586 |
| Iroha story right (100100) | — | -0.4938 |
| Momoko story center (101000) | — | -0.4012 |
| Mitama story left (101700) | — | -0.3704 |

### 6.3 CubismRenderer ty from Height (4:3)

| Model ID | `params.json height` | `CubismRenderer ty` |
|:--------:|:--------------------:|:--------------------:|
| 130102 | -76.1719 | -0.2274 |
| 130100 | -93.7500 | -0.2795 |
| 111800 | -82.0312 | -0.2448 |
| 111802 | -82.0312 | -0.2448 |
| 111200 | -46.8750 | -0.1406 |
| 111202 | -87.8906 | -0.2622 |

---

## 7. Implementation Guidelines

### 7.1 Dual Units in `viewer.html`

To render a dual Live2D unit:

1. **Detect** that the model is a dual unit (e.g., model ID `35010x` has two sub-models).
2. **Load both** sub-models (`posNum=0` and `posNum=1`).
3. **Set container X** (`LAppViewCustom tx` equivalent):
   - posNum=0: `512.0 - 296.0 = 216.0` pixels from left
   - posNum=1: `512.0 - 60.0 = 452.0` pixels from left
   - → Separation: **236px** (homescreen default)
4. **Apply offset**: Both get `setOffset(28.0, -1.0)` → `CubismRenderer tx = 28/512 = 0.0547`.
5. **Calculate Y** per model from each sub-model's `params.json.height`.
6. **Scale**: `sx = 1.300`, `sy = 2.311111` (for 16:9).

### 7.2 Dual Units in `quotes.html`

Quotes Duo mode uses a slightly tighter layout:

1. **Container X**:
   - posNum=0: tx = **216.0**
   - posNum=1: tx = **432.0**
   - → Separation: **216px** (tighter than homescreen's 236px)
2. **Offset**: `offset.x = -112.0` → `CubismRenderer tx = -112/512 = -0.2188`.
3. **Subtitle X**: Target **-280.0** (initial -100.0).

### 7.3 Story Viewer Character Placement

For a future story viewer:

1. **Three-slot system**: Left (posNum=0, tx=216), Center (posNum=1, tx=512), Right (posNum=2, tx=808).
2. Each character uses its own `params.json` height for Y offset.
3. **Dialogue box**: Line length = 810px. Speaker name at (512, 115). Name font = 16pt, text font = 27pt.
4. **Narration**: Centered at x=512, font size 32pt, no speaker name.

### 7.4 Camera Position Mapping (for Homescreen)

The homescreen camera presets map to `offset.x` values:

| Camera Preset | Single `offset.x` | Dual `offset.x` |
|:--------------|:------------------:|:----------------:|
| Default (Home) | -132.0 | 28.0 |
| Center | 0.0 | 180.0 |
| Center-Right | 162.0 | 300.0 |
| Right | 324.0 | 420.0 |
| Left | -324.0 | -60.0 |
| Center-Left | -162.0 | 60.0 |

For **single units**: `offset.x` step size = **162.0** (= 324/2; quarter-screen increments).
For **dual units**: offset.x values are shifted rightward by **~152–180px** compared to single, because the left canvas anchor is already at 216 instead of 512.
