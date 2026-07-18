# Quotes Viewer — Scenario Group Mapping

## General scenario file
- `general/{charaId}00.json` contains the home/scenario quote groups.
- For Iroha (100100), the file contains exactly **43 groups** (`group_1` through `group_43`).

## Voice‑to‑group mapping

### Legend
- **Button label** = the label shown in `quotes.html`.
- **Wiki name** = the name from the Magia Record wiki quote database.
- **Has textHome?** = whether the scenario step contains subtitle text. Groups marked "no" play voice+animation only (no subtitles).

| Voice ID | Group | Button label | Wiki name | Has textHome? |
|----------|-------|-------------|-----------|--------------|
| `vo_char_1001_00_01` | group_1 | Self Introduction 1 | 自己紹介① – Self Introduction 1 | yes |
| `vo_char_1001_00_02` | group_43 | Self Introduction 2 | 自己紹介② – Self Introduction 2 | yes |
| `vo_char_1001_00_03` | group_2 | *(debug: group_2)* | Story Chapter End 1 | no (voice+animation only) |
| `vo_char_1001_00_04` | group_3 | *(debug: group_3)* | Story Chapter End 2 | no (voice+animation only) |
| `vo_char_1001_00_05` | group_4 | *(debug: group_4)* | Story Chapter End 3 | no (voice+animation only) |
| `vo_char_1001_00_13` | group_5 | Enhance | 強化完了 – Strengthening Complete | yes |
| `vo_char_1001_00_14` | group_6 | Enhance (Max Lvl.) | 強化(Lv最大時) – Strengthening Max | yes |
| `vo_char_1001_00_15` | group_7 | Episode Lvl. UP | エピソードLvアップ – Episode Lvl Up | yes |
| `vo_char_1001_00_16` | group_8 | Unlock Magic 1 | 魔力解放① – Magical Release 1 | yes |
| `vo_char_1001_00_17` | group_9 | Unlock Magic 2 | 魔力解放② – Magical Release 2 | yes |
| `vo_char_1001_00_18` | group_10 | Unlock Magic 3 | 魔力解放③ – Magical Release 3 | yes |
| `vo_char_1001_00_19` | group_11 | Magia Lvl. UP | マギアLvアップ – Magia Lvl Up | yes |
| `vo_char_1001_00_20` | group_12 | Magical Girl Awaken 1 | 魔法少女覚醒① – Magical Girl Awaken 1 | yes |
| `vo_char_1001_00_21` | group_13 | Magical Girl Awaken 2 | 魔法少女覚醒② – Magical Girl Awaken 2 | yes |
| `vo_char_1001_00_22` | group_14 | Magical Girl Awaken 3 | 魔法少女覚醒③ – Magical Girl Awaken 3 | yes |
| `vo_char_1001_00_23` | group_15 | Unused 2 (Magical Girl Awaken 4?) | Unused 2 | no (voice+animation only) |
| `vo_char_1001_00_24` | group_16 | Login 1 (First Login) | ログイン①(初回ログイン時) – Login 1 | yes |
| `vo_char_1001_00_25` | group_17 | Login 2 (Morning) | ログイン②(朝) – Login 2 | yes |
| `vo_char_1001_00_26` | group_18 | Login 3 (Midday) | ログイン③(昼) – Login 3 | yes |
| `vo_char_1001_00_27` | group_19 | Login 4 (Night) | ログイン④(夜) – Login 4 | yes |
| `vo_char_1001_00_28` | group_20 | Login 5 (Late-Night) | ログイン⑤(深夜) – Login 5 | yes |
| `vo_char_1001_00_29` | group_21 | Login 6 (Other) | ログイン⑥(その他) – Login 6 | yes |
| `vo_char_1001_00_30` | group_22 | Login 7 (Max AP) | ログイン⑦(AP最大時) – Login 7 | yes |
| `vo_char_1001_00_31` | group_23 | Login 8 (Max BP) | ログイン⑧(BP最大時) – Login 8 | yes |
| `vo_char_1001_00_32` | group_24 | *(debug: group_24)* | Unused 3 | no (voice+animation only) |
| `vo_char_1001_00_33` | group_25 | Magical Girl Tap 1 | 魔法少女タップ① – Tap 1 | yes |
| `vo_char_1001_00_34` | group_26 | Magical Girl Tap 2 | 魔法少女タップ② – Tap 2 | yes |
| `vo_char_1001_00_35` | group_27 | Magical Girl Tap 3 | 魔法少女タップ③ – Tap 3 | yes |
| `vo_char_1001_00_36` | group_28 | Magical Girl Tap 4 | 魔法少女タップ④ – Tap 4 | yes |
| `vo_char_1001_00_37` | group_29 | Magical Girl Tap 5 | 魔法少女タップ⑤ – Tap 5 | yes |
| `vo_char_1001_00_38` | group_30 | Magical Girl Tap 6 | 魔法少女タップ⑥ – Tap 6 | yes |
| `vo_char_1001_00_39` | group_31 | Magical Girl Tap 7 | 魔法少女タップ⑦ – Tap 7 | yes |
| `vo_char_1001_00_40` | group_32 | Magical Girl Tap 8 | 魔法少女タップ⑧ – Tap 8 | yes |
| `vo_char_1001_00_41` | group_33 | Magical Girl Tap 9 | 魔法少女タップ⑨ – Tap 9 | yes |
| `vo_char_1001_00_42` | group_34 | Start Quest | クエスト開始 – Battle Start | yes |
| `vo_char_1001_00_43` | group_35 | Quest Victory 1 | クエスト勝利① – Battle Victory 1 | yes |
| `vo_char_1001_00_44` | group_36 | Quest Victory 2 | クエスト勝利② – Battle Victory 2 | yes |
| `vo_char_1001_00_45` | group_37 | Quest Victory 3 | クエスト勝利③ – Battle Victory 3 | yes |
| `vo_char_1001_00_46` | group_38 | Unused 4 (Quest Victory 4?) | Unused 4 | yes |
| `vo_char_1001_00_63` | group_39 | *(debug: group_39)* | Magia (1) | no (voice+animation only) |
| `vo_char_1001_00_64` | group_40 | *(debug: group_40)* | Magia (2) | no (voice+animation only) |
| `vo_char_1001_00_65` | group_41 | *(debug: group_41)* | Magia (3) | no (voice+animation only) |
| `vo_char_1001_00_66` | group_42 | *(debug: group_42)* | Magia (4) | no (voice+animation only) |

## Groups without `textHome` (voice+animation only)

The following groups contain full motion data (cheek, face, motion number sequences) and voice audio, but no subtitle text. The Live2D model performs expressions and gestures synchronized to the audio:

- group_2 (03) — Story Chapter End 1
- group_3 (04) — Story Chapter End 2
- group_4 (05) — Story Chapter End 3
- group_15 (23) — Unused 2 / speculated Awaken 4
- group_24 (32) — Unused 3
- group_39 (63) — Magia (1)
- group_40 (64) — Magia (2)
- group_41 (65) — Magia (3)
- group_42 (66) — Magia (4)

## Unavailable voice files (gaps in numbering)

These voice IDs fall in the `vo_char_1001_00_XX` sequence but are **not present** in the general scenario JSON:

- **06–12** — gap between Self Introductions (01–02) and Enhance (13)
- **47–62** — gap after Quest Victory / Unused (46) and Magia (63)

These likely correspond to battle/disc voice clips, connect attacks, damage sounds, or other non‑home voice lines that the Live2D viewer doesn't need.

## Speculative mappings

- **group_15** (voice 23): The wiki labels this "Unused 2". Its position in the group numbering (right after Awaken 3/group_14)  suggest it was intended as a fourth Awaken quote that went unused in the final game.
- **group_38** (voice 46): The wiki labels this "Unused 4". Its position (right after Quest Victory 3/group_37) suggest it was intended as a fourth Victory quote.
