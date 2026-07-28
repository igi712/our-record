# Scenario Timing & Voice Duration Audit

This document records the empirical timing audit of single-voice multi-step scenario groups across all general scenario files in `temp/magica/resource/scenario/json/general/` cross-referenced with local voice HCA files in `assets/ma-re-data/resource/sound_native/voice/` and character names from `temp/charaList.json`.

## Summary Statistics

- **Total Scenario Files Processed**: 281
- **Total Single-Voice Multi-Step Groups Found**: 11074
- **Groups Matched with Verified Local HCA Voice Files**: 11059
- **Voice Longer / Live2D Advances Early ($T_{\text{voice}} - T_{\text{json}} > 0.1\text{s}$)**: 658 groups
- **In Sync ($|T_{\text{voice}} - T_{\text{json}}| \le 0.5\text{s}$)**: 3920 groups
- **JSON Sum Longer / Live2D Lags Behind ($T_{\text{json}} - T_{\text{voice}} > 0.5\text{s}$)**: 7007 groups

---

## Dual Unit Scenario Groups Audit

| Outfit ID | Character Name (`temp/charaList.json`) | Group | Steps | Voice File | JSON Sum ($T_{\text{json}}$) | Voice Duration ($T_{\text{voice}}$) | Drift ($T_{\text{voice}} - T_{\text{json}}$) | Timing Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `101700` | Mitama Yakumo | `group_1` | 8 | `vo_char_1017_00_01_hca.hca` | 27.20s | 25.35s | -1.85s | JSON Longer (Live2D lags) |
| `101700` | Mitama Yakumo | `group_10` | 7 | `vo_char_1017_00_18_hca.hca` | 15.70s | 14.35s | -1.35s | JSON Longer (Live2D lags) |
| `101700` | Mitama Yakumo | `group_11` | 4 | `vo_char_1017_00_19_hca.hca` | 7.70s | 6.25s | -1.45s | JSON Longer (Live2D lags) |
| `101700` | Mitama Yakumo | `group_12` | 3 | `vo_char_1017_00_20_hca.hca` | 8.20s | 6.39s | -1.81s | JSON Longer (Live2D lags) |
| `101700` | Mitama Yakumo | `group_13` | 4 | `vo_char_1017_00_21_hca.hca` | 10.90s | 8.94s | -1.96s | JSON Longer (Live2D lags) |
| `101700` | Mitama Yakumo | `group_14` | 5 | `vo_char_1017_00_22_hca.hca` | 18.80s | 17.14s | -1.66s | JSON Longer (Live2D lags) |
| `101700` | Mitama Yakumo | `group_15` | 7 | `vo_char_1017_00_23_hca.hca` | 22.20s | 21.05s | -1.15s | JSON Longer (Live2D lags) |
| `101700` | Mitama Yakumo | `group_16` | 5 | `vo_char_1017_00_24_hca.hca` | 10.60s | 9.69s | -0.91s | JSON Longer (Live2D lags) |
| `101700` | Mitama Yakumo | `group_17` | 4 | `vo_char_1017_00_25_hca.hca` | 12.70s | 11.59s | -1.11s | JSON Longer (Live2D lags) |
| `101700` | Mitama Yakumo | `group_18` | 5 | `vo_char_1017_00_26_hca.hca` | 13.00s | 11.70s | -1.30s | JSON Longer (Live2D lags) |
| `101700` | Mitama Yakumo | `group_19` | 4 | `vo_char_1017_00_27_hca.hca` | 11.70s | 11.30s | -0.40s | In Sync (±0.5s) |
| `101700` | Mitama Yakumo | `group_2` | 3 | `vo_char_1017_00_03_hca.hca` | 7.80s | 5.54s | -2.26s | JSON Longer (Live2D lags) |
| `101700` | Mitama Yakumo | `group_20` | 8 | `vo_char_1017_00_28_hca.hca` | 17.30s | 16.19s | -1.11s | JSON Longer (Live2D lags) |
| `101700` | Mitama Yakumo | `group_21` | 4 | `vo_char_1017_00_29_hca.hca` | 13.30s | 11.76s | -1.54s | JSON Longer (Live2D lags) |
| `101700` | Mitama Yakumo | `group_22` | 5 | `vo_char_1017_00_30_hca.hca` | 12.50s | 11.42s | -1.08s | JSON Longer (Live2D lags) |
| `101700` | Mitama Yakumo | `group_23` | 5 | `vo_char_1017_00_31_hca.hca` | 12.80s | 11.23s | -1.57s | JSON Longer (Live2D lags) |
| `101700` | Mitama Yakumo | `group_24` | 5 | `vo_char_1017_00_32_hca.hca` | 14.20s | 12.07s | -2.13s | JSON Longer (Live2D lags) |
| `101700` | Mitama Yakumo | `group_25` | 4 | `vo_char_1017_00_33_hca.hca` | 12.20s | 10.90s | -1.30s | JSON Longer (Live2D lags) |
| `101700` | Mitama Yakumo | `group_26` | 4 | `vo_char_1017_00_34_hca.hca` | 11.40s | 10.23s | -1.17s | JSON Longer (Live2D lags) |
| `101700` | Mitama Yakumo | `group_27` | 5 | `vo_char_1017_00_35_hca.hca` | 13.90s | 12.27s | -1.63s | JSON Longer (Live2D lags) |
| `101700` | Mitama Yakumo | `group_28` | 5 | `vo_char_1017_00_36_hca.hca` | 12.60s | 10.93s | -1.67s | JSON Longer (Live2D lags) |
| `101700` | Mitama Yakumo | `group_29` | 4 | `vo_char_1017_00_37_hca.hca` | 13.90s | 12.33s | -1.57s | JSON Longer (Live2D lags) |
| `101700` | Mitama Yakumo | `group_3` | 2 | `vo_char_1017_00_04_hca.hca` | 9.50s | 3.87s | -5.63s | JSON Longer (Live2D lags) |
| `101700` | Mitama Yakumo | `group_30` | 4 | `vo_char_1017_00_38_hca.hca` | 13.50s | 11.97s | -1.53s | JSON Longer (Live2D lags) |
| `101700` | Mitama Yakumo | `group_31` | 5 | `vo_char_1017_00_39_hca.hca` | 14.30s | 12.45s | -1.85s | JSON Longer (Live2D lags) |
| `101700` | Mitama Yakumo | `group_32` | 5 | `vo_char_1017_00_40_hca.hca` | 14.00s | 12.48s | -1.52s | JSON Longer (Live2D lags) |
| `101700` | Mitama Yakumo | `group_33` | 8 | `vo_char_1017_00_41_hca.hca` | 12.80s | 11.67s | -1.13s | JSON Longer (Live2D lags) |
| `101700` | Mitama Yakumo | `group_34` | 2 | `vo_char_1017_00_42_hca.hca` | 5.00s | 2.95s | -2.05s | JSON Longer (Live2D lags) |
| `101700` | Mitama Yakumo | `group_35` | 3 | `vo_char_1017_00_43_hca.hca` | 4.70s | 3.18s | -1.52s | JSON Longer (Live2D lags) |
| `101700` | Mitama Yakumo | `group_36` | 2 | `vo_char_1017_00_44_hca.hca` | 6.00s | 3.90s | -2.10s | JSON Longer (Live2D lags) |
| `101700` | Mitama Yakumo | `group_37` | 3 | `vo_char_1017_00_45_hca.hca` | 5.00s | 3.09s | -1.91s | JSON Longer (Live2D lags) |
| `101700` | Mitama Yakumo | `group_38` | 3 | `vo_char_1017_00_46_hca.hca` | 4.50s | 3.06s | -1.44s | JSON Longer (Live2D lags) |
| `101700` | Mitama Yakumo | `group_39` | 3 | `vo_char_1017_00_63_hca.hca` | 6.50s | 4.48s | -2.02s | JSON Longer (Live2D lags) |
| `101700` | Mitama Yakumo | `group_4` | 3 | `vo_char_1017_00_05_hca.hca` | 7.20s | 5.01s | -2.19s | JSON Longer (Live2D lags) |
| `101700` | Mitama Yakumo | `group_40` | 3 | `vo_char_1017_00_64_hca.hca` | 5.50s | 3.90s | -1.60s | JSON Longer (Live2D lags) |
| `101700` | Mitama Yakumo | `group_41` | 3 | `vo_char_1017_00_65_hca.hca` | 7.50s | 5.80s | -1.70s | JSON Longer (Live2D lags) |
| `101700` | Mitama Yakumo | `group_42` | 2 | `vo_char_1017_00_66_hca.hca` | 5.80s | 3.78s | -2.02s | JSON Longer (Live2D lags) |
| `101700` | Mitama Yakumo | `group_43` | 6 | `vo_char_1017_00_02_hca.hca` | 14.80s | 14.17s | -0.63s | JSON Longer (Live2D lags) |
| `101700` | Mitama Yakumo | `group_5` | 4 | `vo_char_1017_00_13_hca.hca` | 6.80s | 5.36s | -1.44s | JSON Longer (Live2D lags) |
| `101700` | Mitama Yakumo | `group_6` | 3 | `vo_char_1017_00_14_hca.hca` | 6.50s | 5.22s | -1.28s | JSON Longer (Live2D lags) |
| `101700` | Mitama Yakumo | `group_7` | 4 | `vo_char_1017_00_15_hca.hca` | 9.30s | 7.03s | -2.27s | JSON Longer (Live2D lags) |
| `101700` | Mitama Yakumo | `group_8` | 7 | `vo_char_1017_00_16_hca.hca` | 15.60s | 13.73s | -1.87s | JSON Longer (Live2D lags) |
| `101700` | Mitama Yakumo | `group_9` | 5 | `vo_char_1017_00_17_hca.hca` | 13.60s | 11.87s | -1.73s | JSON Longer (Live2D lags) |
| `101700` | Mitama Yakumo | `group_44` | 4 | `vo_game_0702_01_hca.hca` | 6.70s | 6.13s | -0.57s | JSON Longer (Live2D lags) |
| `101700` | Mitama Yakumo | `group_45` | 5 | `vo_game_0702_02_hca.hca` | 9.10s | 8.74s | -0.36s | In Sync (±0.5s) |
| `101700` | Mitama Yakumo | `group_46` | 5 | `vo_game_0702_03_hca.hca` | 6.60s | 6.13s | -0.47s | In Sync (±0.5s) |
| `101700` | Mitama Yakumo | `group_47` | 4 | `vo_game_0702_04_hca.hca` | 7.60s | 7.57s | -0.03s | In Sync (±0.5s) |
| `101700` | Mitama Yakumo | `group_48` | 6 | `vo_game_0702_08_hca.hca` | 11.00s | 9.64s | -1.36s | JSON Longer (Live2D lags) |
| `101700` | Mitama Yakumo | `group_49` | 6 | `vo_game_0702_09_hca.hca` | 16.60s | 13.51s | -3.09s | JSON Longer (Live2D lags) |
| `101700` | Mitama Yakumo | `group_50` | 4 | `vo_game_0702_10_hca.hca` | 13.60s | 12.92s | -0.68s | JSON Longer (Live2D lags) |
| `101700` | Mitama Yakumo | `group_51` | 6 | `vo_game_0702_11_hca.hca` | 12.00s | 11.30s | -0.70s | JSON Longer (Live2D lags) |
| `101700` | Mitama Yakumo | `group_52` | 6 | `vo_game_0702_12_hca.hca` | 11.50s | 11.74s | +0.24s | In Sync (±0.5s) |
| `101700` | Mitama Yakumo | `group_53` | 4 | `vo_game_0902_01_hca.hca` | 9.80s | 9.19s | -0.61s | JSON Longer (Live2D lags) |
| `101700` | Mitama Yakumo | `group_54` | 3 | `vo_game_0902_02_hca.hca` | 9.20s | 8.77s | -0.43s | In Sync (±0.5s) |
| `101700` | Mitama Yakumo | `group_55` | 4 | `vo_game_0902_03_hca.hca` | 11.30s | 10.50s | -0.80s | JSON Longer (Live2D lags) |
| `101700` | Mitama Yakumo | `group_56` | 4 | `vo_game_0902_04_hca.hca` | 6.70s | 7.22s | +0.52s | Voice Longer (Live2D advances early) |
| `101700` | Mitama Yakumo | `group_57` | 4 | `vo_game_0902_08_hca.hca` | 12.20s | 12.03s | -0.17s | In Sync (±0.5s) |
| `101700` | Mitama Yakumo | `group_58` | 5 | `vo_game_0902_09_hca.hca` | 13.60s | 13.38s | -0.22s | In Sync (±0.5s) |
| `101700` | Mitama Yakumo | `group_59` | 7 | `vo_game_0902_10_hca.hca` | 15.50s | 15.05s | -0.45s | In Sync (±0.5s) |
| `101700` | Mitama Yakumo | `group_60` | 6 | `vo_game_0902_11_hca.hca` | 15.50s | 13.20s | -2.30s | JSON Longer (Live2D lags) |
| `101700` | Mitama Yakumo | `group_61` | 4 | `vo_game_0902_12_hca.hca` | 10.60s | 10.65s | +0.05s | In Sync (±0.5s) |
| `101700` | Mitama Yakumo | `group_62` | 4 | `vo_game_1102_01_hca.hca` | 8.60s | 8.49s | -0.11s | In Sync (±0.5s) |
| `101700` | Mitama Yakumo | `group_63` | 4 | `vo_game_1102_02_hca.hca` | 10.10s | 7.87s | -2.23s | JSON Longer (Live2D lags) |
| `101700` | Mitama Yakumo | `group_64` | 4 | `vo_game_1102_03_hca.hca` | 9.00s | 8.11s | -0.89s | JSON Longer (Live2D lags) |
| `101700` | Mitama Yakumo | `group_65` | 4 | `vo_game_1102_04_hca.hca` | 6.70s | 7.04s | +0.34s | In Sync (±0.5s) |
| `101700` | Mitama Yakumo | `group_66` | 6 | `vo_game_1102_08_hca.hca` | 14.70s | 14.75s | +0.05s | In Sync (±0.5s) |
| `101700` | Mitama Yakumo | `group_67` | 6 | `vo_game_1102_09_hca.hca` | 18.90s | 14.87s | -4.03s | JSON Longer (Live2D lags) |
| `101700` | Mitama Yakumo | `group_68` | 7 | `vo_game_1102_10_hca.hca` | 15.60s | 14.54s | -1.06s | JSON Longer (Live2D lags) |
| `101700` | Mitama Yakumo | `group_69` | 4 | `vo_game_1102_11_hca.hca` | 14.10s | 12.46s | -1.64s | JSON Longer (Live2D lags) |
| `101700` | Mitama Yakumo | `group_70` | 5 | `vo_game_1102_12_hca.hca` | 13.40s | 14.05s | +0.65s | Voice Longer (Live2D advances early) |
| `101701` | Mitama Yakumo | `group_1` | 8 | `vo_char_1017_00_01_hca.hca` | 27.20s | 25.35s | -1.85s | JSON Longer (Live2D lags) |
| `101701` | Mitama Yakumo | `group_10` | 7 | `vo_char_1017_00_18_hca.hca` | 15.70s | 14.35s | -1.35s | JSON Longer (Live2D lags) |
| `101701` | Mitama Yakumo | `group_11` | 4 | `vo_char_1017_00_19_hca.hca` | 7.70s | 6.25s | -1.45s | JSON Longer (Live2D lags) |
| `101701` | Mitama Yakumo | `group_12` | 3 | `vo_char_1017_00_20_hca.hca` | 8.20s | 6.39s | -1.81s | JSON Longer (Live2D lags) |
| `101701` | Mitama Yakumo | `group_13` | 4 | `vo_char_1017_00_21_hca.hca` | 10.90s | 8.94s | -1.96s | JSON Longer (Live2D lags) |
| `101701` | Mitama Yakumo | `group_14` | 5 | `vo_char_1017_00_22_hca.hca` | 18.80s | 17.14s | -1.66s | JSON Longer (Live2D lags) |
| `101701` | Mitama Yakumo | `group_15` | 7 | `vo_char_1017_00_23_hca.hca` | 22.20s | 21.05s | -1.15s | JSON Longer (Live2D lags) |
| `101701` | Mitama Yakumo | `group_16` | 5 | `vo_char_1017_00_24_hca.hca` | 10.60s | 9.69s | -0.91s | JSON Longer (Live2D lags) |
| `101701` | Mitama Yakumo | `group_17` | 4 | `vo_char_1017_00_25_hca.hca` | 12.70s | 11.59s | -1.11s | JSON Longer (Live2D lags) |
| `101701` | Mitama Yakumo | `group_18` | 5 | `vo_char_1017_00_26_hca.hca` | 13.00s | 11.70s | -1.30s | JSON Longer (Live2D lags) |
| `101701` | Mitama Yakumo | `group_19` | 4 | `vo_char_1017_00_27_hca.hca` | 11.70s | 11.30s | -0.40s | In Sync (±0.5s) |
| `101701` | Mitama Yakumo | `group_2` | 3 | `vo_char_1017_00_03_hca.hca` | 7.80s | 5.54s | -2.26s | JSON Longer (Live2D lags) |
| `101701` | Mitama Yakumo | `group_20` | 8 | `vo_char_1017_00_28_hca.hca` | 17.30s | 16.19s | -1.11s | JSON Longer (Live2D lags) |
| `101701` | Mitama Yakumo | `group_21` | 4 | `vo_char_1017_00_29_hca.hca` | 13.30s | 11.76s | -1.54s | JSON Longer (Live2D lags) |
| `101701` | Mitama Yakumo | `group_22` | 5 | `vo_char_1017_00_30_hca.hca` | 12.50s | 11.42s | -1.08s | JSON Longer (Live2D lags) |
| `101701` | Mitama Yakumo | `group_23` | 5 | `vo_char_1017_00_31_hca.hca` | 12.80s | 11.23s | -1.57s | JSON Longer (Live2D lags) |
| `101701` | Mitama Yakumo | `group_24` | 5 | `vo_char_1017_00_32_hca.hca` | 14.20s | 12.07s | -2.13s | JSON Longer (Live2D lags) |
| `101701` | Mitama Yakumo | `group_25` | 4 | `vo_char_1017_00_33_hca.hca` | 12.20s | 10.90s | -1.30s | JSON Longer (Live2D lags) |
| `101701` | Mitama Yakumo | `group_26` | 4 | `vo_char_1017_00_34_hca.hca` | 11.40s | 10.23s | -1.17s | JSON Longer (Live2D lags) |
| `101701` | Mitama Yakumo | `group_27` | 5 | `vo_char_1017_00_35_hca.hca` | 13.90s | 12.27s | -1.63s | JSON Longer (Live2D lags) |
| `101701` | Mitama Yakumo | `group_28` | 5 | `vo_char_1017_00_36_hca.hca` | 12.60s | 10.93s | -1.67s | JSON Longer (Live2D lags) |
| `101701` | Mitama Yakumo | `group_29` | 4 | `vo_char_1017_00_37_hca.hca` | 13.90s | 12.33s | -1.57s | JSON Longer (Live2D lags) |
| `101701` | Mitama Yakumo | `group_3` | 2 | `vo_char_1017_00_04_hca.hca` | 9.50s | 3.87s | -5.63s | JSON Longer (Live2D lags) |
| `101701` | Mitama Yakumo | `group_30` | 4 | `vo_char_1017_00_38_hca.hca` | 13.50s | 11.97s | -1.53s | JSON Longer (Live2D lags) |
| `101701` | Mitama Yakumo | `group_31` | 5 | `vo_char_1017_00_39_hca.hca` | 14.30s | 12.45s | -1.85s | JSON Longer (Live2D lags) |
| `101701` | Mitama Yakumo | `group_32` | 5 | `vo_char_1017_00_40_hca.hca` | 14.00s | 12.48s | -1.52s | JSON Longer (Live2D lags) |
| `101701` | Mitama Yakumo | `group_33` | 8 | `vo_char_1017_00_41_hca.hca` | 12.80s | 11.67s | -1.13s | JSON Longer (Live2D lags) |
| `101701` | Mitama Yakumo | `group_34` | 2 | `vo_char_1017_00_42_hca.hca` | 5.00s | 2.95s | -2.05s | JSON Longer (Live2D lags) |
| `101701` | Mitama Yakumo | `group_35` | 3 | `vo_char_1017_00_43_hca.hca` | 4.70s | 3.18s | -1.52s | JSON Longer (Live2D lags) |
| `101701` | Mitama Yakumo | `group_36` | 2 | `vo_char_1017_00_44_hca.hca` | 6.00s | 3.90s | -2.10s | JSON Longer (Live2D lags) |
| `101701` | Mitama Yakumo | `group_37` | 3 | `vo_char_1017_00_45_hca.hca` | 5.00s | 3.09s | -1.91s | JSON Longer (Live2D lags) |
| `101701` | Mitama Yakumo | `group_38` | 3 | `vo_char_1017_00_46_hca.hca` | 4.50s | 3.06s | -1.44s | JSON Longer (Live2D lags) |
| `101701` | Mitama Yakumo | `group_39` | 3 | `vo_char_1017_00_63_hca.hca` | 6.50s | 4.48s | -2.02s | JSON Longer (Live2D lags) |
| `101701` | Mitama Yakumo | `group_4` | 3 | `vo_char_1017_00_05_hca.hca` | 7.20s | 5.01s | -2.19s | JSON Longer (Live2D lags) |
| `101701` | Mitama Yakumo | `group_40` | 3 | `vo_char_1017_00_64_hca.hca` | 5.50s | 3.90s | -1.60s | JSON Longer (Live2D lags) |
| `101701` | Mitama Yakumo | `group_41` | 3 | `vo_char_1017_00_65_hca.hca` | 7.50s | 5.80s | -1.70s | JSON Longer (Live2D lags) |
| `101701` | Mitama Yakumo | `group_42` | 2 | `vo_char_1017_00_66_hca.hca` | 5.80s | 3.78s | -2.02s | JSON Longer (Live2D lags) |
| `101701` | Mitama Yakumo | `group_43` | 6 | `vo_char_1017_00_02_hca.hca` | 14.80s | 14.17s | -0.63s | JSON Longer (Live2D lags) |
| `101701` | Mitama Yakumo | `group_44` | 4 | `vo_game_0202_01_hca.hca` | 7.40s | 6.93s | -0.47s | In Sync (±0.5s) |
| `101701` | Mitama Yakumo | `group_45` | 5 | `vo_game_0202_02_hca.hca` | 6.50s | 6.54s | +0.04s | In Sync (±0.5s) |
| `101701` | Mitama Yakumo | `group_46` | 4 | `vo_game_0202_03_hca.hca` | 7.90s | 7.88s | -0.02s | In Sync (±0.5s) |
| `101701` | Mitama Yakumo | `group_47` | 3 | `vo_game_0202_04_hca.hca` | 7.50s | 7.68s | +0.18s | In Sync (±0.5s) |
| `101701` | Mitama Yakumo | `group_48` | 5 | `vo_game_0202_08_hca.hca` | 9.80s | 9.87s | +0.07s | In Sync (±0.5s) |
| `101701` | Mitama Yakumo | `group_49` | 6 | `vo_game_0202_09_hca.hca` | 11.70s | 11.25s | -0.45s | In Sync (±0.5s) |
| `101701` | Mitama Yakumo | `group_5` | 4 | `vo_char_1017_00_13_hca.hca` | 6.80s | 5.36s | -1.44s | JSON Longer (Live2D lags) |
| `101701` | Mitama Yakumo | `group_50` | 7 | `vo_game_0202_10_hca.hca` | 15.20s | 15.08s | -0.12s | In Sync (±0.5s) |
| `101701` | Mitama Yakumo | `group_51` | 3 | `vo_game_0202_11_hca.hca` | 10.80s | 10.67s | -0.13s | In Sync (±0.5s) |
| `101701` | Mitama Yakumo | `group_52` | 6 | `vo_game_0202_12_hca.hca` | 13.40s | 13.00s | -0.40s | In Sync (±0.5s) |
| `101701` | Mitama Yakumo | `group_6` | 3 | `vo_char_1017_00_14_hca.hca` | 6.50s | 5.22s | -1.28s | JSON Longer (Live2D lags) |
| `101701` | Mitama Yakumo | `group_7` | 4 | `vo_char_1017_00_15_hca.hca` | 9.30s | 7.03s | -2.27s | JSON Longer (Live2D lags) |
| `101701` | Mitama Yakumo | `group_8` | 7 | `vo_char_1017_00_16_hca.hca` | 15.60s | 13.73s | -1.87s | JSON Longer (Live2D lags) |
| `101701` | Mitama Yakumo | `group_9` | 5 | `vo_char_1017_00_17_hca.hca` | 13.60s | 11.87s | -1.73s | JSON Longer (Live2D lags) |
| `101750` | Mitama Yakumo | `group_1` | 8 | `vo_char_1017_00_01_hca.hca` | 27.20s | 25.35s | -1.85s | JSON Longer (Live2D lags) |
| `101750` | Mitama Yakumo | `group_10` | 7 | `vo_char_1017_00_18_hca.hca` | 15.70s | 14.35s | -1.35s | JSON Longer (Live2D lags) |
| `101750` | Mitama Yakumo | `group_11` | 4 | `vo_char_1017_00_19_hca.hca` | 7.70s | 6.25s | -1.45s | JSON Longer (Live2D lags) |
| `101750` | Mitama Yakumo | `group_12` | 3 | `vo_char_1017_00_20_hca.hca` | 8.20s | 6.39s | -1.81s | JSON Longer (Live2D lags) |
| `101750` | Mitama Yakumo | `group_13` | 4 | `vo_char_1017_00_21_hca.hca` | 10.90s | 8.94s | -1.96s | JSON Longer (Live2D lags) |
| `101750` | Mitama Yakumo | `group_14` | 5 | `vo_char_1017_00_22_hca.hca` | 18.80s | 17.14s | -1.66s | JSON Longer (Live2D lags) |
| `101750` | Mitama Yakumo | `group_15` | 7 | `vo_char_1017_00_23_hca.hca` | 22.20s | 21.05s | -1.15s | JSON Longer (Live2D lags) |
| `101750` | Mitama Yakumo | `group_16` | 4 | `vo_char_1017_50_24_hca.hca` | 14.50s | 14.23s | -0.27s | In Sync (±0.5s) |
| `101750` | Mitama Yakumo | `group_17` | 5 | `vo_char_1017_50_25_hca.hca` | 13.50s | 12.69s | -0.81s | JSON Longer (Live2D lags) |
| `101750` | Mitama Yakumo | `group_18` | 6 | `vo_char_1017_50_26_hca.hca` | 17.00s | 16.84s | -0.16s | In Sync (±0.5s) |
| `101750` | Mitama Yakumo | `group_19` | 5 | `vo_char_1017_50_27_hca.hca` | 14.50s | 12.29s | -2.21s | JSON Longer (Live2D lags) |
| `101750` | Mitama Yakumo | `group_2` | 3 | `vo_char_1017_00_03_hca.hca` | 7.80s | 5.54s | -2.26s | JSON Longer (Live2D lags) |
| `101750` | Mitama Yakumo | `group_20` | 5 | `vo_char_1017_50_28_hca.hca` | 16.00s | 15.84s | -0.16s | In Sync (±0.5s) |
| `101750` | Mitama Yakumo | `group_21` | 7 | `vo_char_1017_50_29_hca.hca` | 24.10s | 23.14s | -0.96s | JSON Longer (Live2D lags) |
| `101750` | Mitama Yakumo | `group_22` | 7 | `vo_char_1017_50_30_hca.hca` | 17.50s | 16.99s | -0.51s | JSON Longer (Live2D lags) |
| `101750` | Mitama Yakumo | `group_23` | 6 | `vo_char_1017_50_31_hca.hca` | 19.00s | 18.77s | -0.23s | In Sync (±0.5s) |
| `101750` | Mitama Yakumo | `group_24` | 3 | `vo_char_1017_50_32_hca.hca` | 13.50s | 12.32s | -1.18s | JSON Longer (Live2D lags) |
| `101750` | Mitama Yakumo | `group_25` | 6 | `vo_char_1017_50_33_hca.hca` | 16.00s | 15.45s | -0.55s | JSON Longer (Live2D lags) |
| `101750` | Mitama Yakumo | `group_26` | 4 | `vo_char_1017_50_34_hca.hca` | 13.00s | 12.77s | -0.23s | In Sync (±0.5s) |
| `101750` | Mitama Yakumo | `group_27` | 5 | `vo_char_1017_50_35_hca.hca` | 14.00s | 14.01s | +0.01s | In Sync (±0.5s) |
| `101750` | Mitama Yakumo | `group_28` | 8 | `vo_char_1017_50_36_hca.hca` | 16.90s | 15.15s | -1.75s | JSON Longer (Live2D lags) |
| `101750` | Mitama Yakumo | `group_29` | 5 | `vo_char_1017_50_37_hca.hca` | 14.50s | 14.42s | -0.08s | In Sync (±0.5s) |
| `101750` | Mitama Yakumo | `group_3` | 2 | `vo_char_1017_00_04_hca.hca` | 9.50s | 3.87s | -5.63s | JSON Longer (Live2D lags) |
| `101750` | Mitama Yakumo | `group_30` | 4 | `vo_char_1017_50_38_hca.hca` | 12.50s | 12.17s | -0.33s | In Sync (±0.5s) |
| `101750` | Mitama Yakumo | `group_31` | 9 | `vo_char_1017_50_39_hca.hca` | 19.50s | 19.07s | -0.43s | In Sync (±0.5s) |
| `101750` | Mitama Yakumo | `group_32` | 7 | `vo_char_1017_50_40_hca.hca` | 13.90s | 13.43s | -0.47s | In Sync (±0.5s) |
| `101750` | Mitama Yakumo | `group_33` | 5 | `vo_char_1017_50_41_hca.hca` | 12.00s | 11.98s | -0.02s | In Sync (±0.5s) |
| `101750` | Mitama Yakumo | `group_34` | 2 | `vo_char_1017_00_42_hca.hca` | 5.00s | 2.95s | -2.05s | JSON Longer (Live2D lags) |
| `101750` | Mitama Yakumo | `group_35` | 3 | `vo_char_1017_00_43_hca.hca` | 4.70s | 3.18s | -1.52s | JSON Longer (Live2D lags) |
| `101750` | Mitama Yakumo | `group_36` | 2 | `vo_char_1017_00_44_hca.hca` | 6.00s | 3.90s | -2.10s | JSON Longer (Live2D lags) |
| `101750` | Mitama Yakumo | `group_37` | 3 | `vo_char_1017_00_45_hca.hca` | 5.00s | 3.09s | -1.91s | JSON Longer (Live2D lags) |
| `101750` | Mitama Yakumo | `group_38` | 3 | `vo_char_1017_00_46_hca.hca` | 4.50s | 3.06s | -1.44s | JSON Longer (Live2D lags) |
| `101750` | Mitama Yakumo | `group_39` | 3 | `vo_char_1017_00_63_hca.hca` | 6.50s | 4.48s | -2.02s | JSON Longer (Live2D lags) |
| `101750` | Mitama Yakumo | `group_4` | 3 | `vo_char_1017_00_05_hca.hca` | 7.20s | 5.01s | -2.19s | JSON Longer (Live2D lags) |
| `101750` | Mitama Yakumo | `group_40` | 3 | `vo_char_1017_00_64_hca.hca` | 5.50s | 3.90s | -1.60s | JSON Longer (Live2D lags) |
| `101750` | Mitama Yakumo | `group_41` | 3 | `vo_char_1017_00_65_hca.hca` | 7.50s | 5.80s | -1.70s | JSON Longer (Live2D lags) |
| `101750` | Mitama Yakumo | `group_42` | 2 | `vo_char_1017_00_66_hca.hca` | 5.80s | 3.78s | -2.02s | JSON Longer (Live2D lags) |
| `101750` | Mitama Yakumo | `group_43` | 6 | `vo_char_1017_00_02_hca.hca` | 14.80s | 14.17s | -0.63s | JSON Longer (Live2D lags) |
| `101750` | Mitama Yakumo | `group_5` | 4 | `vo_char_1017_00_13_hca.hca` | 6.80s | 5.36s | -1.44s | JSON Longer (Live2D lags) |
| `101750` | Mitama Yakumo | `group_6` | 3 | `vo_char_1017_00_14_hca.hca` | 6.50s | 5.22s | -1.28s | JSON Longer (Live2D lags) |
| `101750` | Mitama Yakumo | `group_7` | 4 | `vo_char_1017_00_15_hca.hca` | 9.30s | 7.03s | -2.27s | JSON Longer (Live2D lags) |
| `101750` | Mitama Yakumo | `group_8` | 7 | `vo_char_1017_00_16_hca.hca` | 15.60s | 13.73s | -1.87s | JSON Longer (Live2D lags) |
| `101750` | Mitama Yakumo | `group_9` | 5 | `vo_char_1017_00_17_hca.hca` | 13.60s | 11.87s | -1.73s | JSON Longer (Live2D lags) |
| `101750` | Mitama Yakumo | `group_44` | 4 | `vo_game_1002_01_hca.hca` | 8.20s | 8.18s | -0.02s | In Sync (±0.5s) |
| `101750` | Mitama Yakumo | `group_45` | 3 | `vo_game_1002_02_hca.hca` | 6.60s | 6.25s | -0.35s | In Sync (±0.5s) |
| `101750` | Mitama Yakumo | `group_46` | 4 | `vo_game_1002_03_hca.hca` | 7.50s | 6.17s | -1.33s | JSON Longer (Live2D lags) |
| `101750` | Mitama Yakumo | `group_47` | 3 | `vo_game_1002_04_hca.hca` | 6.50s | 5.98s | -0.52s | JSON Longer (Live2D lags) |
| `101750` | Mitama Yakumo | `group_48` | 7 | `vo_game_1002_08_hca.hca` | 13.30s | 12.29s | -1.01s | JSON Longer (Live2D lags) |
| `101750` | Mitama Yakumo | `group_49` | 4 | `vo_game_1002_09_hca.hca` | 9.30s | 9.12s | -0.18s | In Sync (±0.5s) |
| `101750` | Mitama Yakumo | `group_50` | 5 | `vo_game_1002_10_hca.hca` | 13.20s | 12.89s | -0.31s | In Sync (±0.5s) |
| `101750` | Mitama Yakumo | `group_51` | 6 | `vo_game_1002_11_hca.hca` | 13.70s | 12.99s | -0.71s | JSON Longer (Live2D lags) |
| `101750` | Mitama Yakumo | `group_52` | 7 | `vo_game_1002_12_hca.hca` | 14.70s | 15.24s | +0.54s | Voice Longer (Live2D advances early) |
| `101751` | Mitama Yakumo | `group_1` | 8 | `vo_char_1017_00_01_hca.hca` | 27.20s | 25.35s | -1.85s | JSON Longer (Live2D lags) |
| `101751` | Mitama Yakumo | `group_10` | 7 | `vo_char_1017_00_18_hca.hca` | 15.70s | 14.35s | -1.35s | JSON Longer (Live2D lags) |
| `101751` | Mitama Yakumo | `group_11` | 4 | `vo_char_1017_00_19_hca.hca` | 7.70s | 6.25s | -1.45s | JSON Longer (Live2D lags) |
| `101751` | Mitama Yakumo | `group_12` | 3 | `vo_char_1017_00_20_hca.hca` | 8.20s | 6.39s | -1.81s | JSON Longer (Live2D lags) |
| `101751` | Mitama Yakumo | `group_13` | 4 | `vo_char_1017_00_21_hca.hca` | 10.90s | 8.94s | -1.96s | JSON Longer (Live2D lags) |
| `101751` | Mitama Yakumo | `group_14` | 5 | `vo_char_1017_00_22_hca.hca` | 18.80s | 17.14s | -1.66s | JSON Longer (Live2D lags) |
| `101751` | Mitama Yakumo | `group_15` | 7 | `vo_char_1017_00_23_hca.hca` | 22.20s | 21.05s | -1.15s | JSON Longer (Live2D lags) |
| `101751` | Mitama Yakumo | `group_16` | 5 | `vo_char_1017_00_24_hca.hca` | 10.60s | 9.69s | -0.91s | JSON Longer (Live2D lags) |
| `101751` | Mitama Yakumo | `group_17` | 4 | `vo_char_1017_00_25_hca.hca` | 12.70s | 11.59s | -1.11s | JSON Longer (Live2D lags) |
| `101751` | Mitama Yakumo | `group_18` | 5 | `vo_char_1017_00_26_hca.hca` | 13.00s | 11.70s | -1.30s | JSON Longer (Live2D lags) |
| `101751` | Mitama Yakumo | `group_19` | 4 | `vo_char_1017_00_27_hca.hca` | 11.70s | 11.30s | -0.40s | In Sync (±0.5s) |
| `101751` | Mitama Yakumo | `group_2` | 3 | `vo_char_1017_00_03_hca.hca` | 7.80s | 5.54s | -2.26s | JSON Longer (Live2D lags) |
| `101751` | Mitama Yakumo | `group_20` | 8 | `vo_char_1017_00_28_hca.hca` | 17.30s | 16.19s | -1.11s | JSON Longer (Live2D lags) |
| `101751` | Mitama Yakumo | `group_21` | 4 | `vo_char_1017_00_29_hca.hca` | 13.30s | 11.76s | -1.54s | JSON Longer (Live2D lags) |
| `101751` | Mitama Yakumo | `group_22` | 5 | `vo_char_1017_00_30_hca.hca` | 12.50s | 11.42s | -1.08s | JSON Longer (Live2D lags) |
| `101751` | Mitama Yakumo | `group_23` | 5 | `vo_char_1017_00_31_hca.hca` | 12.80s | 11.23s | -1.57s | JSON Longer (Live2D lags) |
| `101751` | Mitama Yakumo | `group_24` | 5 | `vo_char_1017_00_32_hca.hca` | 14.20s | 12.07s | -2.13s | JSON Longer (Live2D lags) |
| `101751` | Mitama Yakumo | `group_25` | 4 | `vo_char_1017_00_33_hca.hca` | 12.20s | 10.90s | -1.30s | JSON Longer (Live2D lags) |
| `101751` | Mitama Yakumo | `group_26` | 4 | `vo_char_1017_00_34_hca.hca` | 11.40s | 10.23s | -1.17s | JSON Longer (Live2D lags) |
| `101751` | Mitama Yakumo | `group_27` | 5 | `vo_char_1017_00_35_hca.hca` | 13.90s | 12.27s | -1.63s | JSON Longer (Live2D lags) |
| `101751` | Mitama Yakumo | `group_28` | 5 | `vo_char_1017_00_36_hca.hca` | 12.60s | 10.93s | -1.67s | JSON Longer (Live2D lags) |
| `101751` | Mitama Yakumo | `group_29` | 4 | `vo_char_1017_00_37_hca.hca` | 13.90s | 12.33s | -1.57s | JSON Longer (Live2D lags) |
| `101751` | Mitama Yakumo | `group_3` | 2 | `vo_char_1017_00_04_hca.hca` | 9.50s | 3.87s | -5.63s | JSON Longer (Live2D lags) |
| `101751` | Mitama Yakumo | `group_30` | 4 | `vo_char_1017_00_38_hca.hca` | 13.50s | 11.97s | -1.53s | JSON Longer (Live2D lags) |
| `101751` | Mitama Yakumo | `group_31` | 5 | `vo_char_1017_00_39_hca.hca` | 14.30s | 12.45s | -1.85s | JSON Longer (Live2D lags) |
| `101751` | Mitama Yakumo | `group_32` | 5 | `vo_char_1017_00_40_hca.hca` | 14.00s | 12.48s | -1.52s | JSON Longer (Live2D lags) |
| `101751` | Mitama Yakumo | `group_33` | 8 | `vo_char_1017_00_41_hca.hca` | 12.80s | 11.67s | -1.13s | JSON Longer (Live2D lags) |
| `101751` | Mitama Yakumo | `group_34` | 2 | `vo_char_1017_00_42_hca.hca` | 5.00s | 2.95s | -2.05s | JSON Longer (Live2D lags) |
| `101751` | Mitama Yakumo | `group_35` | 3 | `vo_char_1017_00_43_hca.hca` | 4.70s | 3.18s | -1.52s | JSON Longer (Live2D lags) |
| `101751` | Mitama Yakumo | `group_36` | 2 | `vo_char_1017_00_44_hca.hca` | 6.00s | 3.90s | -2.10s | JSON Longer (Live2D lags) |
| `101751` | Mitama Yakumo | `group_37` | 3 | `vo_char_1017_00_45_hca.hca` | 5.00s | 3.09s | -1.91s | JSON Longer (Live2D lags) |
| `101751` | Mitama Yakumo | `group_38` | 3 | `vo_char_1017_00_46_hca.hca` | 4.50s | 3.06s | -1.44s | JSON Longer (Live2D lags) |
| `101751` | Mitama Yakumo | `group_39` | 3 | `vo_char_1017_00_63_hca.hca` | 6.50s | 4.48s | -2.02s | JSON Longer (Live2D lags) |
| `101751` | Mitama Yakumo | `group_4` | 3 | `vo_char_1017_00_05_hca.hca` | 7.20s | 5.01s | -2.19s | JSON Longer (Live2D lags) |
| `101751` | Mitama Yakumo | `group_40` | 3 | `vo_char_1017_00_64_hca.hca` | 5.50s | 3.90s | -1.60s | JSON Longer (Live2D lags) |
| `101751` | Mitama Yakumo | `group_41` | 3 | `vo_char_1017_00_65_hca.hca` | 7.50s | 5.80s | -1.70s | JSON Longer (Live2D lags) |
| `101751` | Mitama Yakumo | `group_42` | 2 | `vo_char_1017_00_66_hca.hca` | 5.80s | 3.78s | -2.02s | JSON Longer (Live2D lags) |
| `101751` | Mitama Yakumo | `group_43` | 6 | `vo_char_1017_00_02_hca.hca` | 14.80s | 14.17s | -0.63s | JSON Longer (Live2D lags) |
| `101751` | Mitama Yakumo | `group_44` | 4 | `vo_game_0802_01_hca.hca` | 7.10s | 7.24s | +0.14s | In Sync (±0.5s) |
| `101751` | Mitama Yakumo | `group_45` | 3 | `vo_game_0802_02_hca.hca` | 6.70s | 6.57s | -0.13s | In Sync (±0.5s) |
| `101751` | Mitama Yakumo | `group_46` | 3 | `vo_game_0802_03_hca.hca` | 6.80s | 6.33s | -0.47s | In Sync (±0.5s) |
| `101751` | Mitama Yakumo | `group_47` | 4 | `vo_game_0802_04_hca.hca` | 8.40s | 6.60s | -1.80s | JSON Longer (Live2D lags) |
| `101751` | Mitama Yakumo | `group_48` | 5 | `vo_game_0802_08_hca.hca` | 10.50s | 10.41s | -0.09s | In Sync (±0.5s) |
| `101751` | Mitama Yakumo | `group_49` | 5 | `vo_game_0802_09_hca.hca` | 11.70s | 12.06s | +0.36s | In Sync (±0.5s) |
| `101751` | Mitama Yakumo | `group_5` | 4 | `vo_char_1017_00_13_hca.hca` | 6.80s | 5.36s | -1.44s | JSON Longer (Live2D lags) |
| `101751` | Mitama Yakumo | `group_50` | 5 | `vo_game_0802_10_hca.hca` | 12.10s | 11.93s | -0.17s | In Sync (±0.5s) |
| `101751` | Mitama Yakumo | `group_51` | 5 | `vo_game_0802_11_hca.hca` | 14.60s | 13.78s | -0.82s | JSON Longer (Live2D lags) |
| `101751` | Mitama Yakumo | `group_52` | 3 | `vo_game_0802_12_hca.hca` | 7.20s | 6.88s | -0.32s | In Sync (±0.5s) |
| `101751` | Mitama Yakumo | `group_6` | 3 | `vo_char_1017_00_14_hca.hca` | 6.50s | 5.22s | -1.28s | JSON Longer (Live2D lags) |
| `101751` | Mitama Yakumo | `group_7` | 4 | `vo_char_1017_00_15_hca.hca` | 9.30s | 7.03s | -2.27s | JSON Longer (Live2D lags) |
| `101751` | Mitama Yakumo | `group_8` | 7 | `vo_char_1017_00_16_hca.hca` | 15.60s | 13.73s | -1.87s | JSON Longer (Live2D lags) |
| `101751` | Mitama Yakumo | `group_9` | 5 | `vo_char_1017_00_17_hca.hca` | 13.60s | 11.87s | -1.73s | JSON Longer (Live2D lags) |
| `101799` | Mitama Yakumo | `group_1` | 5 | `vo_game_0002_01_hca.hca` | 10.00s | 8.44s | -1.56s | JSON Longer (Live2D lags) |
| `101799` | Mitama Yakumo | `group_10` | 5 | `vo_game_0002_10_hca.hca` | 20.00s | 18.73s | -1.27s | JSON Longer (Live2D lags) |
| `101799` | Mitama Yakumo | `group_11` | 5 | `vo_game_0002_11_hca.hca` | 13.00s | 11.13s | -1.87s | JSON Longer (Live2D lags) |
| `101799` | Mitama Yakumo | `group_12` | 5 | `vo_game_0002_12_hca.hca` | 14.00s | 12.48s | -1.52s | JSON Longer (Live2D lags) |
| `101799` | Mitama Yakumo | `group_2` | 4 | `vo_game_0002_02_hca.hca` | 12.00s | 10.15s | -1.85s | JSON Longer (Live2D lags) |
| `101799` | Mitama Yakumo | `group_3` | 5 | `vo_game_0002_03_hca.hca` | 10.00s | 10.15s | +0.15s | In Sync (±0.5s) |
| `101799` | Mitama Yakumo | `group_4` | 4 | `vo_game_0002_04_hca.hca` | 12.00s | 10.36s | -1.64s | JSON Longer (Live2D lags) |
| `101799` | Mitama Yakumo | `group_5` | 3 | `vo_game_0002_05_hca.hca` | 10.00s | 8.31s | -1.69s | JSON Longer (Live2D lags) |
| `101799` | Mitama Yakumo | `group_6` | 4 | `vo_game_0002_06_hca.hca` | 11.00s | 9.26s | -1.74s | JSON Longer (Live2D lags) |
| `101799` | Mitama Yakumo | `group_7` | 5 | `vo_game_0002_07_hca.hca` | 11.00s | 9.84s | -1.16s | JSON Longer (Live2D lags) |
| `101799` | Mitama Yakumo | `group_8` | 4 | `vo_game_0002_08_hca.hca` | 15.00s | 13.74s | -1.26s | JSON Longer (Live2D lags) |
| `101799` | Mitama Yakumo | `group_9` | 5 | `vo_game_0002_09_hca.hca` | 13.00s | 11.22s | -1.78s | JSON Longer (Live2D lags) |
| `110700` | Touka & Nemu | `group_1` | 10 | `vo_char_1107_00_01_hca.hca` | 28.15s | 27.84s | -0.31s | In Sync (±0.5s) |
| `110700` | Touka & Nemu | `group_10` | 4 | `vo_char_1107_00_17_hca.hca` | 13.40s | 12.31s | -1.09s | JSON Longer (Live2D lags) |
| `110700` | Touka & Nemu | `group_11` | 5 | `vo_char_1107_00_18_hca.hca` | 17.15s | 16.58s | -0.57s | JSON Longer (Live2D lags) |
| `110700` | Touka & Nemu | `group_12` | 3 | `vo_char_1107_00_19_hca.hca` | 7.40s | 6.58s | -0.82s | JSON Longer (Live2D lags) |
| `110700` | Touka & Nemu | `group_13` | 3 | `vo_char_1107_00_20_hca.hca` | 6.10s | 5.70s | -0.40s | In Sync (±0.5s) |
| `110700` | Touka & Nemu | `group_14` | 4 | `vo_char_1107_00_21_hca.hca` | 13.70s | 11.98s | -1.72s | JSON Longer (Live2D lags) |
| `110700` | Touka & Nemu | `group_15` | 7 | `vo_char_1107_00_22_hca.hca` | 21.00s | 20.58s | -0.42s | In Sync (±0.5s) |
| `110700` | Touka & Nemu | `group_16` | 3 | `vo_char_1107_00_23_hca.hca` | 21.30s | 20.37s | -0.93s | JSON Longer (Live2D lags) |
| `110700` | Touka & Nemu | `group_17` | 5 | `vo_char_1107_00_24_hca.hca` | 14.00s | 13.87s | -0.13s | In Sync (±0.5s) |
| `110700` | Touka & Nemu | `group_18` | 6 | `vo_char_1107_00_25_hca.hca` | 17.90s | 17.27s | -0.63s | JSON Longer (Live2D lags) |
| `110700` | Touka & Nemu | `group_19` | 5 | `vo_char_1107_00_26_hca.hca` | 14.20s | 14.01s | -0.19s | In Sync (±0.5s) |
| `110700` | Touka & Nemu | `group_2` | 5 | `vo_char_1107_00_02_hca.hca` | 12.30s | 11.82s | -0.48s | In Sync (±0.5s) |
| `110700` | Touka & Nemu | `group_20` | 5 | `vo_char_1107_00_27_hca.hca` | 13.20s | 12.41s | -0.79s | JSON Longer (Live2D lags) |
| `110700` | Touka & Nemu | `group_21` | 5 | `vo_char_1107_00_28_hca.hca` | 21.90s | 20.98s | -0.92s | JSON Longer (Live2D lags) |
| `110700` | Touka & Nemu | `group_22` | 4 | `vo_char_1107_00_29_hca.hca` | 15.60s | 15.41s | -0.19s | In Sync (±0.5s) |
| `110700` | Touka & Nemu | `group_23` | 5 | `vo_char_1107_00_30_hca.hca` | 12.00s | 11.73s | -0.27s | In Sync (±0.5s) |
| `110700` | Touka & Nemu | `group_24` | 5 | `vo_char_1107_00_31_hca.hca` | 16.30s | 14.57s | -1.73s | JSON Longer (Live2D lags) |
| `110700` | Touka & Nemu | `group_25` | 4 | `vo_char_1107_00_32_hca.hca` | 13.60s | 13.57s | -0.03s | In Sync (±0.5s) |
| `110700` | Touka & Nemu | `group_26` | 5 | `vo_char_1107_00_33_hca.hca` | 12.50s | 12.41s | -0.09s | In Sync (±0.5s) |
| `110700` | Touka & Nemu | `group_27` | 5 | `vo_char_1107_00_34_hca.hca` | 13.40s | 13.25s | -0.15s | In Sync (±0.5s) |
| `110700` | Touka & Nemu | `group_28` | 4 | `vo_char_1107_00_35_hca.hca` | 16.20s | 15.92s | -0.28s | In Sync (±0.5s) |
| `110700` | Touka & Nemu | `group_29` | 4 | `vo_char_1107_00_36_hca.hca` | 13.70s | 13.06s | -0.64s | JSON Longer (Live2D lags) |
| `110700` | Touka & Nemu | `group_3` | 2 | `vo_char_1107_00_03_hca.hca` | 4.40s | 4.25s | -0.15s | In Sync (±0.5s) |
| `110700` | Touka & Nemu | `group_30` | 4 | `vo_char_1107_00_37_hca.hca` | 16.80s | 16.18s | -0.62s | JSON Longer (Live2D lags) |
| `110700` | Touka & Nemu | `group_31` | 5 | `vo_char_1107_00_38_hca.hca` | 16.70s | 15.73s | -0.97s | JSON Longer (Live2D lags) |
| `110700` | Touka & Nemu | `group_32` | 5 | `vo_char_1107_00_39_hca.hca` | 14.30s | 13.62s | -0.68s | JSON Longer (Live2D lags) |
| `110700` | Touka & Nemu | `group_33` | 6 | `vo_char_1107_00_40_hca.hca` | 15.00s | 14.20s | -0.80s | JSON Longer (Live2D lags) |
| `110700` | Touka & Nemu | `group_34` | 4 | `vo_char_1107_00_41_hca.hca` | 16.00s | 15.28s | -0.72s | JSON Longer (Live2D lags) |
| `110700` | Touka & Nemu | `group_35` | 3 | `vo_char_1107_00_42_hca.hca` | 4.70s | 4.03s | -0.67s | JSON Longer (Live2D lags) |
| `110700` | Touka & Nemu | `group_36` | 2 | `vo_char_1107_00_43_hca.hca` | 4.00s | 2.90s | -1.10s | JSON Longer (Live2D lags) |
| `110700` | Touka & Nemu | `group_37` | 2 | `vo_char_1107_00_44_hca.hca` | 4.00s | 2.26s | -1.74s | JSON Longer (Live2D lags) |
| `110700` | Touka & Nemu | `group_38` | 3 | `vo_char_1107_00_45_hca.hca` | 6.50s | 5.59s | -0.91s | JSON Longer (Live2D lags) |
| `110700` | Touka & Nemu | `group_39` | 2 | `vo_char_1107_00_46_hca.hca` | 6.15s | 3.51s | -2.64s | JSON Longer (Live2D lags) |
| `110700` | Touka & Nemu | `group_5` | 2 | `vo_char_1107_00_05_hca.hca` | 4.80s | 3.90s | -0.90s | JSON Longer (Live2D lags) |
| `110700` | Touka & Nemu | `group_6` | 3 | `vo_char_1107_00_13_hca.hca` | 5.00s | 4.41s | -0.59s | JSON Longer (Live2D lags) |
| `110700` | Touka & Nemu | `group_7` | 4 | `vo_char_1107_00_14_hca.hca` | 7.10s | 6.28s | -0.82s | JSON Longer (Live2D lags) |
| `110700` | Touka & Nemu | `group_8` | 3 | `vo_char_1107_00_15_hca.hca` | 10.50s | 8.71s | -1.79s | JSON Longer (Live2D lags) |
| `110700` | Touka & Nemu | `group_9` | 4 | `vo_char_1107_00_16_hca.hca` | 16.20s | 15.41s | -0.79s | JSON Longer (Live2D lags) |
| `110701` | Touka & Nemu | `group_1` | 8 | `vo_char_1107_00_01_hca.hca` | 28.15s | 27.84s | -0.31s | In Sync (±0.5s) |
| `110701` | Touka & Nemu | `group_10` | 3 | `vo_char_1107_00_17_hca.hca` | 13.40s | 12.31s | -1.09s | JSON Longer (Live2D lags) |
| `110701` | Touka & Nemu | `group_11` | 4 | `vo_char_1107_00_18_hca.hca` | 17.15s | 16.58s | -0.57s | JSON Longer (Live2D lags) |
| `110701` | Touka & Nemu | `group_12` | 2 | `vo_char_1107_00_19_hca.hca` | 7.40s | 6.58s | -0.82s | JSON Longer (Live2D lags) |
| `110701` | Touka & Nemu | `group_13` | 2 | `vo_char_1107_00_20_hca.hca` | 6.10s | 5.70s | -0.40s | In Sync (±0.5s) |
| `110701` | Touka & Nemu | `group_14` | 3 | `vo_char_1107_00_21_hca.hca` | 13.70s | 11.98s | -1.72s | JSON Longer (Live2D lags) |
| `110701` | Touka & Nemu | `group_15` | 6 | `vo_char_1107_00_22_hca.hca` | 21.00s | 20.58s | -0.42s | In Sync (±0.5s) |
| `110701` | Touka & Nemu | `group_16` | 3 | `vo_char_1107_00_23_hca.hca` | 21.30s | 20.37s | -0.93s | JSON Longer (Live2D lags) |
| `110701` | Touka & Nemu | `group_17` | 5 | `vo_char_1107_01_24_hca.hca` | 14.00s | 12.89s | -1.11s | JSON Longer (Live2D lags) |
| `110701` | Touka & Nemu | `group_18` | 5 | `vo_char_1107_01_25_hca.hca` | 17.05s | 15.21s | -1.84s | JSON Longer (Live2D lags) |
| `110701` | Touka & Nemu | `group_19` | 5 | `vo_char_1107_01_26_hca.hca` | 12.95s | 10.53s | -2.42s | JSON Longer (Live2D lags) |
| `110701` | Touka & Nemu | `group_2` | 4 | `vo_char_1107_00_02_hca.hca` | 12.30s | 11.82s | -0.48s | In Sync (±0.5s) |
| `110701` | Touka & Nemu | `group_20` | 4 | `vo_char_1107_01_27_hca.hca` | 11.00s | 11.07s | +0.07s | In Sync (±0.5s) |
| `110701` | Touka & Nemu | `group_21` | 7 | `vo_char_1107_01_28_hca.hca` | 22.90s | 22.79s | -0.11s | In Sync (±0.5s) |
| `110701` | Touka & Nemu | `group_22` | 5 | `vo_char_1107_01_29_hca.hca` | 14.60s | 13.97s | -0.63s | JSON Longer (Live2D lags) |
| `110701` | Touka & Nemu | `group_23` | 4 | `vo_char_1107_01_30_hca.hca` | 14.50s | 11.73s | -2.77s | JSON Longer (Live2D lags) |
| `110701` | Touka & Nemu | `group_24` | 5 | `vo_char_1107_01_31_hca.hca` | 14.60s | 14.27s | -0.33s | In Sync (±0.5s) |
| `110701` | Touka & Nemu | `group_25` | 3 | `vo_char_1107_01_32_hca.hca` | 14.00s | 13.47s | -0.53s | JSON Longer (Live2D lags) |
| `110701` | Touka & Nemu | `group_26` | 6 | `vo_char_1107_01_33_hca.hca` | 13.60s | 13.32s | -0.28s | In Sync (±0.5s) |
| `110701` | Touka & Nemu | `group_27` | 5 | `vo_char_1107_01_34_hca.hca` | 17.20s | 14.13s | -3.07s | JSON Longer (Live2D lags) |
| `110701` | Touka & Nemu | `group_28` | 4 | `vo_char_1107_01_35_hca.hca` | 12.40s | 11.59s | -0.81s | JSON Longer (Live2D lags) |
| `110701` | Touka & Nemu | `group_29` | 5 | `vo_char_1107_01_36_hca.hca` | 13.20s | 12.70s | -0.50s | In Sync (±0.5s) |
| `110701` | Touka & Nemu | `group_3` | 2 | `vo_char_1107_00_03_hca.hca` | 4.40s | 4.25s | -0.15s | In Sync (±0.5s) |
| `110701` | Touka & Nemu | `group_30` | 5 | `vo_char_1107_01_37_hca.hca` | 16.70s | 16.09s | -0.61s | JSON Longer (Live2D lags) |
| `110701` | Touka & Nemu | `group_31` | 4 | `vo_char_1107_01_38_hca.hca` | 12.85s | 11.56s | -1.29s | JSON Longer (Live2D lags) |
| `110701` | Touka & Nemu | `group_32` | 5 | `vo_char_1107_01_39_hca.hca` | 15.00s | 13.96s | -1.04s | JSON Longer (Live2D lags) |
| `110701` | Touka & Nemu | `group_33` | 6 | `vo_char_1107_01_40_hca.hca` | 14.80s | 13.20s | -1.60s | JSON Longer (Live2D lags) |
| `110701` | Touka & Nemu | `group_34` | 4 | `vo_char_1107_01_41_hca.hca` | 13.60s | 13.30s | -0.30s | In Sync (±0.5s) |
| `110701` | Touka & Nemu | `group_35` | 2 | `vo_char_1107_00_42_hca.hca` | 4.70s | 4.03s | -0.67s | JSON Longer (Live2D lags) |
| `110701` | Touka & Nemu | `group_38` | 2 | `vo_char_1107_00_45_hca.hca` | 6.50s | 5.59s | -0.91s | JSON Longer (Live2D lags) |
| `110701` | Touka & Nemu | `group_39` | 2 | `vo_char_1107_00_46_hca.hca` | 6.15s | 3.51s | -2.64s | JSON Longer (Live2D lags) |
| `110701` | Touka & Nemu | `group_5` | 2 | `vo_char_1107_00_05_hca.hca` | 4.80s | 3.90s | -0.90s | JSON Longer (Live2D lags) |
| `110701` | Touka & Nemu | `group_6` | 2 | `vo_char_1107_00_13_hca.hca` | 5.00s | 4.41s | -0.59s | JSON Longer (Live2D lags) |
| `110701` | Touka & Nemu | `group_7` | 3 | `vo_char_1107_00_14_hca.hca` | 7.10s | 6.28s | -0.82s | JSON Longer (Live2D lags) |
| `110701` | Touka & Nemu | `group_8` | 2 | `vo_char_1107_00_15_hca.hca` | 10.50s | 8.71s | -1.79s | JSON Longer (Live2D lags) |
| `110701` | Touka & Nemu | `group_9` | 3 | `vo_char_1107_00_16_hca.hca` | 16.20s | 15.41s | -0.79s | JSON Longer (Live2D lags) |
| `110702` | Touka & Nemu | `group_1` | 8 | `vo_char_1107_00_01_hca.hca` | 28.15s | 27.84s | -0.31s | In Sync (±0.5s) |
| `110702` | Touka & Nemu | `group_10` | 3 | `vo_char_1107_00_17_hca.hca` | 13.40s | 12.31s | -1.09s | JSON Longer (Live2D lags) |
| `110702` | Touka & Nemu | `group_11` | 4 | `vo_char_1107_00_18_hca.hca` | 17.15s | 16.58s | -0.57s | JSON Longer (Live2D lags) |
| `110702` | Touka & Nemu | `group_12` | 2 | `vo_char_1107_00_19_hca.hca` | 7.40s | 6.58s | -0.82s | JSON Longer (Live2D lags) |
| `110702` | Touka & Nemu | `group_13` | 2 | `vo_char_1107_00_20_hca.hca` | 6.10s | 5.70s | -0.40s | In Sync (±0.5s) |
| `110702` | Touka & Nemu | `group_14` | 3 | `vo_char_1107_00_21_hca.hca` | 13.70s | 11.98s | -1.72s | JSON Longer (Live2D lags) |
| `110702` | Touka & Nemu | `group_15` | 6 | `vo_char_1107_00_22_hca.hca` | 21.00s | 20.58s | -0.42s | In Sync (±0.5s) |
| `110702` | Touka & Nemu | `group_16` | 3 | `vo_char_1107_00_23_hca.hca` | 21.30s | 20.37s | -0.93s | JSON Longer (Live2D lags) |
| `110702` | Touka & Nemu | `group_17` | 5 | `vo_char_1107_02_24_hca.hca` | 18.70s | 17.82s | -0.88s | JSON Longer (Live2D lags) |
| `110702` | Touka & Nemu | `group_18` | 5 | `vo_char_1107_02_25_hca.hca` | 22.30s | 18.52s | -3.78s | JSON Longer (Live2D lags) |
| `110702` | Touka & Nemu | `group_19` | 4 | `vo_char_1107_02_26_hca.hca` | 17.10s | 15.85s | -1.25s | JSON Longer (Live2D lags) |
| `110702` | Touka & Nemu | `group_2` | 4 | `vo_char_1107_00_02_hca.hca` | 12.30s | 11.82s | -0.48s | In Sync (±0.5s) |
| `110702` | Touka & Nemu | `group_20` | 4 | `vo_char_1107_02_27_hca.hca` | 18.20s | 17.28s | -0.92s | JSON Longer (Live2D lags) |
| `110702` | Touka & Nemu | `group_21` | 5 | `vo_char_1107_02_28_hca.hca` | 19.10s | 17.99s | -1.11s | JSON Longer (Live2D lags) |
| `110702` | Touka & Nemu | `group_22` | 4 | `vo_char_1107_02_29_hca.hca` | 17.20s | 16.94s | -0.26s | In Sync (±0.5s) |
| `110702` | Touka & Nemu | `group_23` | 4 | `vo_char_1107_02_30_hca.hca` | 17.50s | 14.89s | -2.61s | JSON Longer (Live2D lags) |
| `110702` | Touka & Nemu | `group_24` | 4 | `vo_char_1107_02_31_hca.hca` | 19.30s | 14.91s | -4.39s | JSON Longer (Live2D lags) |
| `110702` | Touka & Nemu | `group_25` | 3 | `vo_char_1107_02_32_hca.hca` | 18.30s | 18.06s | -0.24s | In Sync (±0.5s) |
| `110702` | Touka & Nemu | `group_26` | 4 | `vo_char_1107_02_33_hca.hca` | 20.80s | 17.86s | -2.94s | JSON Longer (Live2D lags) |
| `110702` | Touka & Nemu | `group_27` | 4 | `vo_char_1107_02_34_hca.hca` | 19.80s | 19.47s | -0.33s | In Sync (±0.5s) |
| `110702` | Touka & Nemu | `group_28` | 4 | `vo_char_1107_02_35_hca.hca` | 13.60s | 11.90s | -1.70s | JSON Longer (Live2D lags) |
| `110702` | Touka & Nemu | `group_29` | 4 | `vo_char_1107_02_36_hca.hca` | 15.20s | 14.40s | -0.80s | JSON Longer (Live2D lags) |
| `110702` | Touka & Nemu | `group_3` | 2 | `vo_char_1107_00_03_hca.hca` | 4.40s | 4.25s | -0.15s | In Sync (±0.5s) |
| `110702` | Touka & Nemu | `group_30` | 4 | `vo_char_1107_02_37_hca.hca` | 16.40s | 16.15s | -0.25s | In Sync (±0.5s) |
| `110702` | Touka & Nemu | `group_31` | 5 | `vo_char_1107_02_38_hca.hca` | 12.45s | 12.01s | -0.44s | In Sync (±0.5s) |
| `110702` | Touka & Nemu | `group_32` | 5 | `vo_char_1107_02_39_hca.hca` | 16.50s | 15.24s | -1.26s | JSON Longer (Live2D lags) |
| `110702` | Touka & Nemu | `group_33` | 4 | `vo_char_1107_02_40_hca.hca` | 16.50s | 15.47s | -1.03s | JSON Longer (Live2D lags) |
| `110702` | Touka & Nemu | `group_34` | 6 | `vo_char_1107_02_41_hca.hca` | 20.50s | 19.60s | -0.90s | JSON Longer (Live2D lags) |
| `110702` | Touka & Nemu | `group_35` | 2 | `vo_char_1107_00_42_hca.hca` | 4.70s | 4.03s | -0.67s | JSON Longer (Live2D lags) |
| `110702` | Touka & Nemu | `group_38` | 2 | `vo_char_1107_00_45_hca.hca` | 6.50s | 5.59s | -0.91s | JSON Longer (Live2D lags) |
| `110702` | Touka & Nemu | `group_39` | 2 | `vo_char_1107_00_46_hca.hca` | 6.15s | 3.51s | -2.64s | JSON Longer (Live2D lags) |
| `110702` | Touka & Nemu | `group_5` | 2 | `vo_char_1107_00_05_hca.hca` | 4.80s | 3.90s | -0.90s | JSON Longer (Live2D lags) |
| `110702` | Touka & Nemu | `group_6` | 2 | `vo_char_1107_00_13_hca.hca` | 5.00s | 4.41s | -0.59s | JSON Longer (Live2D lags) |
| `110702` | Touka & Nemu | `group_7` | 3 | `vo_char_1107_00_14_hca.hca` | 7.10s | 6.28s | -0.82s | JSON Longer (Live2D lags) |
| `110702` | Touka & Nemu | `group_8` | 2 | `vo_char_1107_00_15_hca.hca` | 10.50s | 8.71s | -1.79s | JSON Longer (Live2D lags) |
| `110702` | Touka & Nemu | `group_9` | 3 | `vo_char_1107_00_16_hca.hca` | 16.20s | 15.41s | -0.79s | JSON Longer (Live2D lags) |
| `111200` | Karin & Alina | `group_1` | 13 | `vo_char_1112_00_01_hca.hca` | 29.71s | 29.89s | +0.18s | In Sync (±0.5s) |
| `111200` | Karin & Alina | `group_10` | 4 | `vo_char_1112_00_17_hca.hca` | 13.90s | 13.44s | -0.46s | In Sync (±0.5s) |
| `111200` | Karin & Alina | `group_11` | 6 | `vo_char_1112_00_18_hca.hca` | 13.50s | 13.44s | -0.06s | In Sync (±0.5s) |
| `111200` | Karin & Alina | `group_12` | 3 | `vo_char_1112_00_19_hca.hca` | 6.50s | 6.09s | -0.41s | In Sync (±0.5s) |
| `111200` | Karin & Alina | `group_13` | 2 | `vo_char_1112_00_20_hca.hca` | 6.30s | 5.67s | -0.63s | JSON Longer (Live2D lags) |
| `111200` | Karin & Alina | `group_14` | 6 | `vo_char_1112_00_21_hca.hca` | 14.10s | 14.07s | -0.03s | In Sync (±0.5s) |
| `111200` | Karin & Alina | `group_15` | 6 | `vo_char_1112_00_22_hca.hca` | 20.80s | 20.92s | +0.12s | In Sync (±0.5s) |
| `111200` | Karin & Alina | `group_16` | 7 | `vo_char_1112_00_23_hca.hca` | 23.50s | 23.40s | -0.10s | In Sync (±0.5s) |
| `111200` | Karin & Alina | `group_17` | 5 | `vo_char_1112_00_24_hca.hca` | 14.50s | 14.32s | -0.18s | In Sync (±0.5s) |
| `111200` | Karin & Alina | `group_18` | 6 | `vo_char_1112_00_25_hca.hca` | 14.40s | 13.46s | -0.94s | JSON Longer (Live2D lags) |
| `111200` | Karin & Alina | `group_19` | 6 | `vo_char_1112_00_26_hca.hca` | 11.75s | 11.59s | -0.16s | In Sync (±0.5s) |
| `111200` | Karin & Alina | `group_2` | 6 | `vo_char_1112_00_02_hca.hca` | 12.80s | 12.53s | -0.27s | In Sync (±0.5s) |
| `111200` | Karin & Alina | `group_20` | 6 | `vo_char_1112_00_27_hca.hca` | 17.80s | 16.02s | -1.78s | JSON Longer (Live2D lags) |
| `111200` | Karin & Alina | `group_21` | 4 | `vo_char_1112_00_28_hca.hca` | 13.00s | 12.72s | -0.28s | In Sync (±0.5s) |
| `111200` | Karin & Alina | `group_22` | 6 | `vo_char_1112_00_29_hca.hca` | 15.20s | 14.93s | -0.27s | In Sync (±0.5s) |
| `111200` | Karin & Alina | `group_23` | 6 | `vo_char_1112_00_30_hca.hca` | 16.00s | 15.28s | -0.72s | JSON Longer (Live2D lags) |
| `111200` | Karin & Alina | `group_24` | 6 | `vo_char_1112_00_31_hca.hca` | 21.10s | 19.63s | -1.47s | JSON Longer (Live2D lags) |
| `111200` | Karin & Alina | `group_25` | 5 | `vo_char_1112_00_32_hca.hca` | 10.60s | 10.02s | -0.58s | JSON Longer (Live2D lags) |
| `111200` | Karin & Alina | `group_26` | 5 | `vo_char_1112_00_33_hca.hca` | 14.40s | 13.60s | -0.80s | JSON Longer (Live2D lags) |
| `111200` | Karin & Alina | `group_27` | 5 | `vo_char_1112_00_34_hca.hca` | 13.80s | 12.60s | -1.20s | JSON Longer (Live2D lags) |
| `111200` | Karin & Alina | `group_28` | 7 | `vo_char_1112_00_35_hca.hca` | 19.20s | 19.24s | +0.04s | In Sync (±0.5s) |
| `111200` | Karin & Alina | `group_29` | 6 | `vo_char_1112_00_36_hca.hca` | 20.30s | 19.16s | -1.14s | JSON Longer (Live2D lags) |
| `111200` | Karin & Alina | `group_3` | 2 | `vo_char_1112_00_03_hca.hca` | 4.60s | 4.02s | -0.58s | JSON Longer (Live2D lags) |
| `111200` | Karin & Alina | `group_30` | 5 | `vo_char_1112_00_37_hca.hca` | 16.90s | 16.73s | -0.17s | In Sync (±0.5s) |
| `111200` | Karin & Alina | `group_31` | 5 | `vo_char_1112_00_38_hca.hca` | 15.25s | 14.45s | -0.80s | JSON Longer (Live2D lags) |
| `111200` | Karin & Alina | `group_32` | 5 | `vo_char_1112_00_39_hca.hca` | 11.90s | 11.17s | -0.73s | JSON Longer (Live2D lags) |
| `111200` | Karin & Alina | `group_33` | 6 | `vo_char_1112_00_40_hca.hca` | 14.55s | 14.01s | -0.54s | JSON Longer (Live2D lags) |
| `111200` | Karin & Alina | `group_34` | 8 | `vo_char_1112_00_41_hca.hca` | 16.80s | 15.91s | -0.89s | JSON Longer (Live2D lags) |
| `111200` | Karin & Alina | `group_35` | 3 | `vo_char_1112_00_42_hca.hca` | 4.50s | 4.39s | -0.11s | In Sync (±0.5s) |
| `111200` | Karin & Alina | `group_36` | 2 | `vo_char_1112_00_43_hca.hca` | 4.00s | 2.85s | -1.15s | JSON Longer (Live2D lags) |
| `111200` | Karin & Alina | `group_37` | 3 | `vo_char_1112_00_44_hca.hca` | 4.20s | 4.06s | -0.14s | In Sync (±0.5s) |
| `111200` | Karin & Alina | `group_38` | 3 | `vo_char_1112_00_45_hca.hca` | 5.20s | 5.09s | -0.11s | In Sync (±0.5s) |
| `111200` | Karin & Alina | `group_39` | 3 | `vo_char_1112_00_46_hca.hca` | 5.70s | 5.29s | -0.41s | In Sync (±0.5s) |
| `111200` | Karin & Alina | `group_4` | 3 | `vo_char_1112_00_04_hca.hca` | 5.10s | 4.79s | -0.31s | In Sync (±0.5s) |
| `111200` | Karin & Alina | `group_5` | 2 | `vo_char_1112_00_05_hca.hca` | 4.40s | 4.10s | -0.30s | In Sync (±0.5s) |
| `111200` | Karin & Alina | `group_6` | 3 | `vo_char_1112_00_13_hca.hca` | 6.30s | 5.04s | -1.26s | JSON Longer (Live2D lags) |
| `111200` | Karin & Alina | `group_7` | 4 | `vo_char_1112_00_14_hca.hca` | 8.65s | 7.70s | -0.95s | JSON Longer (Live2D lags) |
| `111200` | Karin & Alina | `group_8` | 3 | `vo_char_1112_00_15_hca.hca` | 5.20s | 4.55s | -0.65s | JSON Longer (Live2D lags) |
| `111200` | Karin & Alina | `group_9` | 4 | `vo_char_1112_00_16_hca.hca` | 14.20s | 12.92s | -1.28s | JSON Longer (Live2D lags) |
| `111201` | Karin & Alina | `group_1` | 12 | `vo_char_1112_00_01_hca.hca` | 29.71s | 29.89s | +0.18s | In Sync (±0.5s) |
| `111201` | Karin & Alina | `group_10` | 3 | `vo_char_1112_00_17_hca.hca` | 13.90s | 13.44s | -0.46s | In Sync (±0.5s) |
| `111201` | Karin & Alina | `group_11` | 5 | `vo_char_1112_00_18_hca.hca` | 13.50s | 13.44s | -0.06s | In Sync (±0.5s) |
| `111201` | Karin & Alina | `group_12` | 2 | `vo_char_1112_00_19_hca.hca` | 6.50s | 6.09s | -0.41s | In Sync (±0.5s) |
| `111201` | Karin & Alina | `group_14` | 5 | `vo_char_1112_00_21_hca.hca` | 14.10s | 14.07s | -0.03s | In Sync (±0.5s) |
| `111201` | Karin & Alina | `group_15` | 5 | `vo_char_1112_00_22_hca.hca` | 20.80s | 20.92s | +0.12s | In Sync (±0.5s) |
| `111201` | Karin & Alina | `group_16` | 6 | `vo_char_1112_00_23_hca.hca` | 23.50s | 23.40s | -0.10s | In Sync (±0.5s) |
| `111201` | Karin & Alina | `group_17` | 5 | `vo_char_1112_01_24_hca.hca` | 11.30s | 11.51s | +0.21s | In Sync (±0.5s) |
| `111201` | Karin & Alina | `group_18` | 5 | `vo_char_1112_01_25_hca.hca` | 12.55s | 11.45s | -1.10s | JSON Longer (Live2D lags) |
| `111201` | Karin & Alina | `group_19` | 4 | `vo_char_1112_01_26_hca.hca` | 10.40s | 9.44s | -0.96s | JSON Longer (Live2D lags) |
| `111201` | Karin & Alina | `group_2` | 5 | `vo_char_1112_00_02_hca.hca` | 12.80s | 12.53s | -0.27s | In Sync (±0.5s) |
| `111201` | Karin & Alina | `group_20` | 6 | `vo_char_1112_01_27_hca.hca` | 14.50s | 14.21s | -0.29s | In Sync (±0.5s) |
| `111201` | Karin & Alina | `group_21` | 4 | `vo_char_1112_01_28_hca.hca` | 13.10s | 11.23s | -1.87s | JSON Longer (Live2D lags) |
| `111201` | Karin & Alina | `group_22` | 4 | `vo_char_1112_01_29_hca.hca` | 10.90s | 10.87s | -0.03s | In Sync (±0.5s) |
| `111201` | Karin & Alina | `group_23` | 4 | `vo_char_1112_01_30_hca.hca` | 12.10s | 12.09s | -0.01s | In Sync (±0.5s) |
| `111201` | Karin & Alina | `group_24` | 4 | `vo_char_1112_01_31_hca.hca` | 10.00s | 9.38s | -0.62s | JSON Longer (Live2D lags) |
| `111201` | Karin & Alina | `group_25` | 4 | `vo_char_1112_01_32_hca.hca` | 16.30s | 15.12s | -1.18s | JSON Longer (Live2D lags) |
| `111201` | Karin & Alina | `group_26` | 5 | `vo_char_1112_01_33_hca.hca` | 12.40s | 11.51s | -0.89s | JSON Longer (Live2D lags) |
| `111201` | Karin & Alina | `group_27` | 5 | `vo_char_1112_01_34_hca.hca` | 10.95s | 10.61s | -0.34s | In Sync (±0.5s) |
| `111201` | Karin & Alina | `group_28` | 3 | `vo_char_1112_01_35_hca.hca` | 10.80s | 9.78s | -1.02s | JSON Longer (Live2D lags) |
| `111201` | Karin & Alina | `group_29` | 4 | `vo_char_1112_01_36_hca.hca` | 10.30s | 9.45s | -0.85s | JSON Longer (Live2D lags) |
| `111201` | Karin & Alina | `group_30` | 6 | `vo_char_1112_01_37_hca.hca` | 13.20s | 12.21s | -0.99s | JSON Longer (Live2D lags) |
| `111201` | Karin & Alina | `group_31` | 5 | `vo_char_1112_01_38_hca.hca` | 12.40s | 10.80s | -1.60s | JSON Longer (Live2D lags) |
| `111201` | Karin & Alina | `group_32` | 4 | `vo_char_1112_01_39_hca.hca` | 12.60s | 11.58s | -1.02s | JSON Longer (Live2D lags) |
| `111201` | Karin & Alina | `group_33` | 5 | `vo_char_1112_01_40_hca.hca` | 13.00s | 13.04s | +0.04s | In Sync (±0.5s) |
| `111201` | Karin & Alina | `group_34` | 5 | `vo_char_1112_01_41_hca.hca` | 11.30s | 10.78s | -0.52s | JSON Longer (Live2D lags) |
| `111201` | Karin & Alina | `group_35` | 2 | `vo_char_1112_00_42_hca.hca` | 4.50s | 4.39s | -0.11s | In Sync (±0.5s) |
| `111201` | Karin & Alina | `group_37` | 2 | `vo_char_1112_00_44_hca.hca` | 4.20s | 4.06s | -0.14s | In Sync (±0.5s) |
| `111201` | Karin & Alina | `group_38` | 2 | `vo_char_1112_00_45_hca.hca` | 5.20s | 5.09s | -0.11s | In Sync (±0.5s) |
| `111201` | Karin & Alina | `group_39` | 2 | `vo_char_1112_00_46_hca.hca` | 5.70s | 5.29s | -0.41s | In Sync (±0.5s) |
| `111201` | Karin & Alina | `group_4` | 2 | `vo_char_1112_00_04_hca.hca` | 5.10s | 4.79s | -0.31s | In Sync (±0.5s) |
| `111201` | Karin & Alina | `group_6` | 2 | `vo_char_1112_00_13_hca.hca` | 6.30s | 5.04s | -1.26s | JSON Longer (Live2D lags) |
| `111201` | Karin & Alina | `group_7` | 3 | `vo_char_1112_00_14_hca.hca` | 8.65s | 7.70s | -0.95s | JSON Longer (Live2D lags) |
| `111201` | Karin & Alina | `group_8` | 2 | `vo_char_1112_00_15_hca.hca` | 5.20s | 4.55s | -0.65s | JSON Longer (Live2D lags) |
| `111201` | Karin & Alina | `group_9` | 3 | `vo_char_1112_00_16_hca.hca` | 14.20s | 12.92s | -1.28s | JSON Longer (Live2D lags) |
| `111202` | Karin & Alina | `group_1` | 12 | `vo_char_1112_00_01_hca.hca` | 29.71s | 29.89s | +0.18s | In Sync (±0.5s) |
| `111202` | Karin & Alina | `group_10` | 3 | `vo_char_1112_00_17_hca.hca` | 13.90s | 13.44s | -0.46s | In Sync (±0.5s) |
| `111202` | Karin & Alina | `group_11` | 5 | `vo_char_1112_00_18_hca.hca` | 13.50s | 13.44s | -0.06s | In Sync (±0.5s) |
| `111202` | Karin & Alina | `group_12` | 2 | `vo_char_1112_00_19_hca.hca` | 6.50s | 6.09s | -0.41s | In Sync (±0.5s) |
| `111202` | Karin & Alina | `group_14` | 5 | `vo_char_1112_00_21_hca.hca` | 14.10s | 14.07s | -0.03s | In Sync (±0.5s) |
| `111202` | Karin & Alina | `group_15` | 5 | `vo_char_1112_00_22_hca.hca` | 20.80s | 20.92s | +0.12s | In Sync (±0.5s) |
| `111202` | Karin & Alina | `group_16` | 6 | `vo_char_1112_00_23_hca.hca` | 23.50s | 23.40s | -0.10s | In Sync (±0.5s) |
| `111202` | Karin & Alina | `group_17` | 6 | `vo_char_1112_02_24_hca.hca` | 11.10s | 11.09s | -0.01s | In Sync (±0.5s) |
| `111202` | Karin & Alina | `group_18` | 4 | `vo_char_1112_02_25_hca.hca` | 12.00s | 10.73s | -1.27s | JSON Longer (Live2D lags) |
| `111202` | Karin & Alina | `group_19` | 3 | `vo_char_1112_02_26_hca.hca` | 10.20s | 10.13s | -0.07s | In Sync (±0.5s) |
| `111202` | Karin & Alina | `group_2` | 5 | `vo_char_1112_00_02_hca.hca` | 12.80s | 12.53s | -0.27s | In Sync (±0.5s) |
| `111202` | Karin & Alina | `group_20` | 5 | `vo_char_1112_02_27_hca.hca` | 11.10s | 11.14s | +0.04s | In Sync (±0.5s) |
| `111202` | Karin & Alina | `group_21` | 5 | `vo_char_1112_02_28_hca.hca` | 14.30s | 11.30s | -3.00s | JSON Longer (Live2D lags) |
| `111202` | Karin & Alina | `group_22` | 6 | `vo_char_1112_02_29_hca.hca` | 13.80s | 12.34s | -1.46s | JSON Longer (Live2D lags) |
| `111202` | Karin & Alina | `group_23` | 4 | `vo_char_1112_02_30_hca.hca` | 13.40s | 12.52s | -0.88s | JSON Longer (Live2D lags) |
| `111202` | Karin & Alina | `group_24` | 4 | `vo_char_1112_02_31_hca.hca` | 14.70s | 14.26s | -0.44s | In Sync (±0.5s) |
| `111202` | Karin & Alina | `group_25` | 3 | `vo_char_1112_02_32_hca.hca` | 11.20s | 10.37s | -0.83s | JSON Longer (Live2D lags) |
| `111202` | Karin & Alina | `group_26` | 4 | `vo_char_1112_02_33_hca.hca` | 14.40s | 11.80s | -2.60s | JSON Longer (Live2D lags) |
| `111202` | Karin & Alina | `group_27` | 3 | `vo_char_1112_02_34_hca.hca` | 10.60s | 9.99s | -0.61s | JSON Longer (Live2D lags) |
| `111202` | Karin & Alina | `group_28` | 4 | `vo_char_1112_02_35_hca.hca` | 13.00s | 12.90s | -0.10s | In Sync (±0.5s) |
| `111202` | Karin & Alina | `group_29` | 4 | `vo_char_1112_02_36_hca.hca` | 11.90s | 11.55s | -0.35s | In Sync (±0.5s) |
| `111202` | Karin & Alina | `group_30` | 5 | `vo_char_1112_02_37_hca.hca` | 12.40s | 11.71s | -0.69s | JSON Longer (Live2D lags) |
| `111202` | Karin & Alina | `group_31` | 3 | `vo_char_1112_02_38_hca.hca` | 14.20s | 12.01s | -2.19s | JSON Longer (Live2D lags) |
| `111202` | Karin & Alina | `group_32` | 5 | `vo_char_1112_02_39_hca.hca` | 15.50s | 14.03s | -1.47s | JSON Longer (Live2D lags) |
| `111202` | Karin & Alina | `group_33` | 4 | `vo_char_1112_02_40_hca.hca` | 12.10s | 10.64s | -1.46s | JSON Longer (Live2D lags) |
| `111202` | Karin & Alina | `group_34` | 4 | `vo_char_1112_02_41_hca.hca` | 15.20s | 14.38s | -0.82s | JSON Longer (Live2D lags) |
| `111202` | Karin & Alina | `group_35` | 2 | `vo_char_1112_00_42_hca.hca` | 4.50s | 4.39s | -0.11s | In Sync (±0.5s) |
| `111202` | Karin & Alina | `group_37` | 2 | `vo_char_1112_00_44_hca.hca` | 4.20s | 4.06s | -0.14s | In Sync (±0.5s) |
| `111202` | Karin & Alina | `group_38` | 2 | `vo_char_1112_00_45_hca.hca` | 5.20s | 5.09s | -0.11s | In Sync (±0.5s) |
| `111202` | Karin & Alina | `group_39` | 2 | `vo_char_1112_00_46_hca.hca` | 5.70s | 5.29s | -0.41s | In Sync (±0.5s) |
| `111202` | Karin & Alina | `group_4` | 2 | `vo_char_1112_00_04_hca.hca` | 5.10s | 4.79s | -0.31s | In Sync (±0.5s) |
| `111202` | Karin & Alina | `group_6` | 2 | `vo_char_1112_00_13_hca.hca` | 6.30s | 5.04s | -1.26s | JSON Longer (Live2D lags) |
| `111202` | Karin & Alina | `group_7` | 3 | `vo_char_1112_00_14_hca.hca` | 8.65s | 7.70s | -0.95s | JSON Longer (Live2D lags) |
| `111202` | Karin & Alina | `group_8` | 2 | `vo_char_1112_00_15_hca.hca` | 5.20s | 4.55s | -0.65s | JSON Longer (Live2D lags) |
| `111202` | Karin & Alina | `group_9` | 3 | `vo_char_1112_00_16_hca.hca` | 14.20s | 12.92s | -1.28s | JSON Longer (Live2D lags) |
| `111800` | Amane Sisters | `group_1` | 6 | `vo_char_1118_00_01_hca.hca` | 24.80s | 22.36s | -2.44s | JSON Longer (Live2D lags) |
| `111800` | Amane Sisters | `group_10` | 5 | `vo_char_1118_00_17_hca.hca` | 15.00s | 13.25s | -1.75s | JSON Longer (Live2D lags) |
| `111800` | Amane Sisters | `group_11` | 5 | `vo_char_1118_00_18_hca.hca` | 16.00s | 16.29s | +0.29s | In Sync (±0.5s) |
| `111800` | Amane Sisters | `group_12` | 3 | `vo_char_1118_00_19_hca.hca` | 5.70s | 5.63s | -0.07s | In Sync (±0.5s) |
| `111800` | Amane Sisters | `group_13` | 3 | `vo_char_1118_00_20_hca.hca` | 7.70s | 7.20s | -0.50s | In Sync (±0.5s) |
| `111800` | Amane Sisters | `group_14` | 4 | `vo_char_1118_00_21_hca.hca` | 12.00s | 10.40s | -1.60s | JSON Longer (Live2D lags) |
| `111800` | Amane Sisters | `group_15` | 7 | `vo_char_1118_00_22_hca.hca` | 18.00s | 17.81s | -0.19s | In Sync (±0.5s) |
| `111800` | Amane Sisters | `group_16` | 6 | `vo_char_1118_00_23_hca.hca` | 19.80s | 19.50s | -0.30s | In Sync (±0.5s) |
| `111800` | Amane Sisters | `group_17` | 5 | `vo_char_1118_00_24_hca.hca` | 11.30s | 10.01s | -1.29s | JSON Longer (Live2D lags) |
| `111800` | Amane Sisters | `group_18` | 5 | `vo_char_1118_00_25_hca.hca` | 10.60s | 10.63s | +0.03s | In Sync (±0.5s) |
| `111800` | Amane Sisters | `group_19` | 5 | `vo_char_1118_00_26_hca.hca` | 13.10s | 11.48s | -1.62s | JSON Longer (Live2D lags) |
| `111800` | Amane Sisters | `group_2` | 5 | `vo_char_1118_00_02_hca.hca` | 15.80s | 15.59s | -0.21s | In Sync (±0.5s) |
| `111800` | Amane Sisters | `group_20` | 4 | `vo_char_1118_00_27_hca.hca` | 15.20s | 13.79s | -1.41s | JSON Longer (Live2D lags) |
| `111800` | Amane Sisters | `group_21` | 6 | `vo_char_1118_00_28_hca.hca` | 17.50s | 16.52s | -0.98s | JSON Longer (Live2D lags) |
| `111800` | Amane Sisters | `group_22` | 4 | `vo_char_1118_00_29_hca.hca` | 14.70s | 13.67s | -1.03s | JSON Longer (Live2D lags) |
| `111800` | Amane Sisters | `group_23` | 5 | `vo_char_1118_00_30_hca.hca` | 12.30s | 11.23s | -1.07s | JSON Longer (Live2D lags) |
| `111800` | Amane Sisters | `group_24` | 4 | `vo_char_1118_00_31_hca.hca` | 12.20s | 11.35s | -0.85s | JSON Longer (Live2D lags) |
| `111800` | Amane Sisters | `group_25` | 5 | `vo_char_1118_00_32_hca.hca` | 16.90s | 16.18s | -0.72s | JSON Longer (Live2D lags) |
| `111800` | Amane Sisters | `group_26` | 7 | `vo_char_1118_00_33_hca.hca` | 14.70s | 14.31s | -0.39s | In Sync (±0.5s) |
| `111800` | Amane Sisters | `group_27` | 5 | `vo_char_1118_00_34_hca.hca` | 15.90s | 15.73s | -0.17s | In Sync (±0.5s) |
| `111800` | Amane Sisters | `group_28` | 5 | `vo_char_1118_00_35_hca.hca` | 14.30s | 13.66s | -0.64s | JSON Longer (Live2D lags) |
| `111800` | Amane Sisters | `group_29` | 5 | `vo_char_1118_00_36_hca.hca` | 17.20s | 16.49s | -0.71s | JSON Longer (Live2D lags) |
| `111800` | Amane Sisters | `group_3` | 3 | `vo_char_1118_00_03_hca.hca` | 3.50s | 2.65s | -0.85s | JSON Longer (Live2D lags) |
| `111800` | Amane Sisters | `group_30` | 5 | `vo_char_1118_00_37_hca.hca` | 15.80s | 14.94s | -0.86s | JSON Longer (Live2D lags) |
| `111800` | Amane Sisters | `group_31` | 7 | `vo_char_1118_00_38_hca.hca` | 13.60s | 13.38s | -0.22s | In Sync (±0.5s) |
| `111800` | Amane Sisters | `group_32` | 5 | `vo_char_1118_00_39_hca.hca` | 15.00s | 14.34s | -0.66s | JSON Longer (Live2D lags) |
| `111800` | Amane Sisters | `group_33` | 8 | `vo_char_1118_00_40_hca.hca` | 16.20s | 14.85s | -1.35s | JSON Longer (Live2D lags) |
| `111800` | Amane Sisters | `group_34` | 4 | `vo_char_1118_00_41_hca.hca` | 13.50s | 12.53s | -0.97s | JSON Longer (Live2D lags) |
| `111800` | Amane Sisters | `group_35` | 3 | `vo_char_1118_00_42_hca.hca` | 4.00s | 3.70s | -0.30s | In Sync (±0.5s) |
| `111800` | Amane Sisters | `group_36` | 2 | `vo_char_1118_00_43_hca.hca` | 4.00s | 3.43s | -0.57s | JSON Longer (Live2D lags) |
| `111800` | Amane Sisters | `group_37` | 2 | `vo_char_1118_00_44_hca.hca` | 4.00s | 3.56s | -0.44s | In Sync (±0.5s) |
| `111800` | Amane Sisters | `group_38` | 3 | `vo_char_1118_00_45_hca.hca` | 3.20s | 3.31s | +0.11s | In Sync (±0.5s) |
| `111800` | Amane Sisters | `group_39` | 3 | `vo_char_1118_00_46_hca.hca` | 4.50s | 3.99s | -0.51s | JSON Longer (Live2D lags) |
| `111800` | Amane Sisters | `group_4` | 2 | `vo_char_1118_00_04_hca.hca` | 6.00s | 5.07s | -0.93s | JSON Longer (Live2D lags) |
| `111800` | Amane Sisters | `group_40` | 2 | `vo_char_1118_00_63_hca.hca` | 2.50s | 2.37s | -0.13s | In Sync (±0.5s) |
| `111800` | Amane Sisters | `group_41` | 2 | `vo_char_1118_00_64_hca.hca` | 2.50s | 1.99s | -0.51s | JSON Longer (Live2D lags) |
| `111800` | Amane Sisters | `group_42` | 2 | `vo_char_1118_00_65_hca.hca` | 2.50s | 2.13s | -0.37s | In Sync (±0.5s) |
| `111800` | Amane Sisters | `group_43` | 2 | `vo_char_1118_00_66_hca.hca` | 4.00s | 2.96s | -1.04s | JSON Longer (Live2D lags) |
| `111800` | Amane Sisters | `group_5` | 2 | `vo_char_1118_00_05_hca.hca` | 3.00s | 2.26s | -0.74s | JSON Longer (Live2D lags) |
| `111800` | Amane Sisters | `group_6` | 3 | `vo_char_1118_00_13_hca.hca` | 5.30s | 4.79s | -0.51s | JSON Longer (Live2D lags) |
| `111800` | Amane Sisters | `group_7` | 3 | `vo_char_1118_00_14_hca.hca` | 7.60s | 6.22s | -1.38s | JSON Longer (Live2D lags) |
| `111800` | Amane Sisters | `group_8` | 2 | `vo_char_1118_00_15_hca.hca` | 5.00s | 4.67s | -0.33s | In Sync (±0.5s) |
| `111800` | Amane Sisters | `group_9` | 3 | `vo_char_1118_00_16_hca.hca` | 13.00s | 11.41s | -1.59s | JSON Longer (Live2D lags) |
| `111801` | Amane Sisters | `group_1` | 6 | `vo_char_1118_00_01_hca.hca` | 24.80s | 22.36s | -2.44s | JSON Longer (Live2D lags) |
| `111801` | Amane Sisters | `group_10` | 5 | `vo_char_1118_00_17_hca.hca` | 15.00s | 13.25s | -1.75s | JSON Longer (Live2D lags) |
| `111801` | Amane Sisters | `group_11` | 5 | `vo_char_1118_00_18_hca.hca` | 16.00s | 16.29s | +0.29s | In Sync (±0.5s) |
| `111801` | Amane Sisters | `group_12` | 3 | `vo_char_1118_00_19_hca.hca` | 5.70s | 5.63s | -0.07s | In Sync (±0.5s) |
| `111801` | Amane Sisters | `group_13` | 3 | `vo_char_1118_00_20_hca.hca` | 7.70s | 7.20s | -0.50s | In Sync (±0.5s) |
| `111801` | Amane Sisters | `group_14` | 4 | `vo_char_1118_00_21_hca.hca` | 12.00s | 10.40s | -1.60s | JSON Longer (Live2D lags) |
| `111801` | Amane Sisters | `group_15` | 7 | `vo_char_1118_00_22_hca.hca` | 18.00s | 17.81s | -0.19s | In Sync (±0.5s) |
| `111801` | Amane Sisters | `group_16` | 6 | `vo_char_1118_00_23_hca.hca` | 19.80s | 19.50s | -0.30s | In Sync (±0.5s) |
| `111801` | Amane Sisters | `group_17` | 4 | `vo_char_1118_01_24_hca.hca` | 13.60s | 12.76s | -0.84s | JSON Longer (Live2D lags) |
| `111801` | Amane Sisters | `group_18` | 4 | `vo_char_1118_01_25_hca.hca` | 16.70s | 15.43s | -1.27s | JSON Longer (Live2D lags) |
| `111801` | Amane Sisters | `group_19` | 4 | `vo_char_1118_01_26_hca.hca` | 17.10s | 16.73s | -0.37s | In Sync (±0.5s) |
| `111801` | Amane Sisters | `group_2` | 5 | `vo_char_1118_00_02_hca.hca` | 15.80s | 15.59s | -0.21s | In Sync (±0.5s) |
| `111801` | Amane Sisters | `group_20` | 4 | `vo_char_1118_01_27_hca.hca` | 15.60s | 14.17s | -1.43s | JSON Longer (Live2D lags) |
| `111801` | Amane Sisters | `group_21` | 4 | `vo_char_1118_01_28_hca.hca` | 14.30s | 13.31s | -0.99s | JSON Longer (Live2D lags) |
| `111801` | Amane Sisters | `group_22` | 4 | `vo_char_1118_01_29_hca.hca` | 10.00s | 9.95s | -0.05s | In Sync (±0.5s) |
| `111801` | Amane Sisters | `group_23` | 5 | `vo_char_1118_01_30_hca.hca` | 17.00s | 15.86s | -1.14s | JSON Longer (Live2D lags) |
| `111801` | Amane Sisters | `group_24` | 5 | `vo_char_1118_01_31_hca.hca` | 16.70s | 15.99s | -0.71s | JSON Longer (Live2D lags) |
| `111801` | Amane Sisters | `group_25` | 5 | `vo_char_1118_01_32_hca.hca` | 17.50s | 16.37s | -1.13s | JSON Longer (Live2D lags) |
| `111801` | Amane Sisters | `group_26` | 5 | `vo_char_1118_01_33_hca.hca` | 16.20s | 15.04s | -1.16s | JSON Longer (Live2D lags) |
| `111801` | Amane Sisters | `group_27` | 4 | `vo_char_1118_01_34_hca.hca` | 12.30s | 13.31s | +1.01s | Voice Longer (Live2D advances early) |
| `111801` | Amane Sisters | `group_28` | 4 | `vo_char_1118_01_35_hca.hca` | 17.00s | 15.53s | -1.47s | JSON Longer (Live2D lags) |
| `111801` | Amane Sisters | `group_29` | 4 | `vo_char_1118_01_36_hca.hca` | 17.70s | 16.11s | -1.59s | JSON Longer (Live2D lags) |
| `111801` | Amane Sisters | `group_3` | 3 | `vo_char_1118_00_03_hca.hca` | 3.50s | 2.65s | -0.85s | JSON Longer (Live2D lags) |
| `111801` | Amane Sisters | `group_30` | 4 | `vo_char_1118_01_37_hca.hca` | 14.40s | 14.17s | -0.23s | In Sync (±0.5s) |
| `111801` | Amane Sisters | `group_31` | 6 | `vo_char_1118_01_38_hca.hca` | 20.10s | 19.30s | -0.80s | JSON Longer (Live2D lags) |
| `111801` | Amane Sisters | `group_32` | 4 | `vo_char_1118_01_39_hca.hca` | 13.60s | 13.81s | +0.21s | In Sync (±0.5s) |
| `111801` | Amane Sisters | `group_33` | 5 | `vo_char_1118_01_40_hca.hca` | 14.70s | 13.77s | -0.93s | JSON Longer (Live2D lags) |
| `111801` | Amane Sisters | `group_34` | 6 | `vo_char_1118_01_41_hca.hca` | 17.50s | 17.83s | +0.33s | In Sync (±0.5s) |
| `111801` | Amane Sisters | `group_35` | 3 | `vo_char_1118_00_42_hca.hca` | 4.00s | 3.70s | -0.30s | In Sync (±0.5s) |
| `111801` | Amane Sisters | `group_36` | 2 | `vo_char_1118_00_43_hca.hca` | 4.00s | 3.43s | -0.57s | JSON Longer (Live2D lags) |
| `111801` | Amane Sisters | `group_37` | 2 | `vo_char_1118_00_44_hca.hca` | 4.00s | 3.56s | -0.44s | In Sync (±0.5s) |
| `111801` | Amane Sisters | `group_38` | 3 | `vo_char_1118_00_45_hca.hca` | 3.20s | 3.31s | +0.11s | In Sync (±0.5s) |
| `111801` | Amane Sisters | `group_39` | 3 | `vo_char_1118_00_46_hca.hca` | 4.50s | 3.99s | -0.51s | JSON Longer (Live2D lags) |
| `111801` | Amane Sisters | `group_4` | 2 | `vo_char_1118_00_04_hca.hca` | 6.00s | 5.07s | -0.93s | JSON Longer (Live2D lags) |
| `111801` | Amane Sisters | `group_40` | 2 | `vo_char_1118_00_63_hca.hca` | 2.50s | 2.37s | -0.13s | In Sync (±0.5s) |
| `111801` | Amane Sisters | `group_41` | 2 | `vo_char_1118_00_64_hca.hca` | 2.50s | 1.99s | -0.51s | JSON Longer (Live2D lags) |
| `111801` | Amane Sisters | `group_42` | 2 | `vo_char_1118_00_65_hca.hca` | 2.50s | 2.13s | -0.37s | In Sync (±0.5s) |
| `111801` | Amane Sisters | `group_43` | 2 | `vo_char_1118_00_66_hca.hca` | 4.00s | 2.96s | -1.04s | JSON Longer (Live2D lags) |
| `111801` | Amane Sisters | `group_5` | 2 | `vo_char_1118_00_05_hca.hca` | 3.00s | 2.26s | -0.74s | JSON Longer (Live2D lags) |
| `111801` | Amane Sisters | `group_6` | 3 | `vo_char_1118_00_13_hca.hca` | 5.30s | 4.79s | -0.51s | JSON Longer (Live2D lags) |
| `111801` | Amane Sisters | `group_7` | 3 | `vo_char_1118_00_14_hca.hca` | 7.60s | 6.22s | -1.38s | JSON Longer (Live2D lags) |
| `111801` | Amane Sisters | `group_8` | 2 | `vo_char_1118_00_15_hca.hca` | 5.00s | 4.67s | -0.33s | In Sync (±0.5s) |
| `111801` | Amane Sisters | `group_9` | 3 | `vo_char_1118_00_16_hca.hca` | 13.00s | 11.41s | -1.59s | JSON Longer (Live2D lags) |
| `111802` | Amane Sisters | `group_1` | 6 | `vo_char_1118_00_01_hca.hca` | 24.80s | 22.36s | -2.44s | JSON Longer (Live2D lags) |
| `111802` | Amane Sisters | `group_10` | 5 | `vo_char_1118_00_17_hca.hca` | 15.00s | 13.25s | -1.75s | JSON Longer (Live2D lags) |
| `111802` | Amane Sisters | `group_11` | 5 | `vo_char_1118_00_18_hca.hca` | 16.00s | 16.29s | +0.29s | In Sync (±0.5s) |
| `111802` | Amane Sisters | `group_12` | 3 | `vo_char_1118_00_19_hca.hca` | 5.70s | 5.63s | -0.07s | In Sync (±0.5s) |
| `111802` | Amane Sisters | `group_13` | 3 | `vo_char_1118_00_20_hca.hca` | 7.70s | 7.20s | -0.50s | In Sync (±0.5s) |
| `111802` | Amane Sisters | `group_14` | 4 | `vo_char_1118_00_21_hca.hca` | 12.00s | 10.40s | -1.60s | JSON Longer (Live2D lags) |
| `111802` | Amane Sisters | `group_15` | 7 | `vo_char_1118_00_22_hca.hca` | 18.00s | 17.81s | -0.19s | In Sync (±0.5s) |
| `111802` | Amane Sisters | `group_16` | 6 | `vo_char_1118_00_23_hca.hca` | 19.80s | 19.50s | -0.30s | In Sync (±0.5s) |
| `111802` | Amane Sisters | `group_17` | 4 | `vo_char_1118_02_24_hca.hca` | 11.40s | 10.10s | -1.30s | JSON Longer (Live2D lags) |
| `111802` | Amane Sisters | `group_18` | 5 | `vo_char_1118_02_25_hca.hca` | 13.00s | 12.32s | -0.68s | JSON Longer (Live2D lags) |
| `111802` | Amane Sisters | `group_19` | 4 | `vo_char_1118_02_26_hca.hca` | 11.60s | 10.39s | -1.21s | JSON Longer (Live2D lags) |
| `111802` | Amane Sisters | `group_2` | 5 | `vo_char_1118_00_02_hca.hca` | 15.80s | 15.59s | -0.21s | In Sync (±0.5s) |
| `111802` | Amane Sisters | `group_20` | 4 | `vo_char_1118_02_27_hca.hca` | 18.30s | 16.86s | -1.44s | JSON Longer (Live2D lags) |
| `111802` | Amane Sisters | `group_21` | 4 | `vo_char_1118_02_28_hca.hca` | 13.50s | 11.97s | -1.53s | JSON Longer (Live2D lags) |
| `111802` | Amane Sisters | `group_22` | 5 | `vo_char_1118_02_29_hca.hca` | 15.10s | 14.58s | -0.52s | JSON Longer (Live2D lags) |
| `111802` | Amane Sisters | `group_23` | 4 | `vo_char_1118_02_30_hca.hca` | 10.60s | 10.80s | +0.20s | In Sync (±0.5s) |
| `111802` | Amane Sisters | `group_24` | 3 | `vo_char_1118_02_31_hca.hca` | 12.40s | 10.73s | -1.67s | JSON Longer (Live2D lags) |
| `111802` | Amane Sisters | `group_25` | 4 | `vo_char_1118_02_32_hca.hca` | 14.70s | 13.82s | -0.88s | JSON Longer (Live2D lags) |
| `111802` | Amane Sisters | `group_26` | 4 | `vo_char_1118_02_33_hca.hca` | 9.20s | 7.64s | -1.56s | JSON Longer (Live2D lags) |
| `111802` | Amane Sisters | `group_27` | 6 | `vo_char_1118_02_34_hca.hca` | 14.00s | 14.87s | +0.87s | Voice Longer (Live2D advances early) |
| `111802` | Amane Sisters | `group_28` | 6 | `vo_char_1118_02_35_hca.hca` | 12.70s | 12.07s | -0.63s | JSON Longer (Live2D lags) |
| `111802` | Amane Sisters | `group_29` | 4 | `vo_char_1118_02_36_hca.hca` | 13.50s | 12.36s | -1.14s | JSON Longer (Live2D lags) |
| `111802` | Amane Sisters | `group_3` | 3 | `vo_char_1118_00_03_hca.hca` | 3.50s | 2.65s | -0.85s | JSON Longer (Live2D lags) |
| `111802` | Amane Sisters | `group_30` | 5 | `vo_char_1118_02_37_hca.hca` | 16.20s | 16.21s | +0.01s | In Sync (±0.5s) |
| `111802` | Amane Sisters | `group_31` | 5 | `vo_char_1118_02_38_hca.hca` | 12.70s | 12.51s | -0.19s | In Sync (±0.5s) |
| `111802` | Amane Sisters | `group_32` | 4 | `vo_char_1118_02_39_hca.hca` | 12.10s | 10.61s | -1.49s | JSON Longer (Live2D lags) |
| `111802` | Amane Sisters | `group_33` | 5 | `vo_char_1118_02_40_hca.hca` | 15.70s | 14.88s | -0.82s | JSON Longer (Live2D lags) |
| `111802` | Amane Sisters | `group_34` | 5 | `vo_char_1118_02_41_hca.hca` | 12.10s | 11.74s | -0.36s | In Sync (±0.5s) |
| `111802` | Amane Sisters | `group_35` | 3 | `vo_char_1118_00_42_hca.hca` | 4.00s | 3.70s | -0.30s | In Sync (±0.5s) |
| `111802` | Amane Sisters | `group_36` | 2 | `vo_char_1118_00_43_hca.hca` | 4.00s | 3.43s | -0.57s | JSON Longer (Live2D lags) |
| `111802` | Amane Sisters | `group_37` | 2 | `vo_char_1118_00_44_hca.hca` | 4.00s | 3.56s | -0.44s | In Sync (±0.5s) |
| `111802` | Amane Sisters | `group_38` | 3 | `vo_char_1118_00_45_hca.hca` | 3.20s | 3.31s | +0.11s | In Sync (±0.5s) |
| `111802` | Amane Sisters | `group_39` | 3 | `vo_char_1118_00_46_hca.hca` | 4.50s | 3.99s | -0.51s | JSON Longer (Live2D lags) |
| `111802` | Amane Sisters | `group_4` | 2 | `vo_char_1118_00_04_hca.hca` | 6.00s | 5.07s | -0.93s | JSON Longer (Live2D lags) |
| `111802` | Amane Sisters | `group_40` | 2 | `vo_char_1118_00_63_hca.hca` | 2.50s | 2.37s | -0.13s | In Sync (±0.5s) |
| `111802` | Amane Sisters | `group_41` | 2 | `vo_char_1118_00_64_hca.hca` | 2.50s | 1.99s | -0.51s | JSON Longer (Live2D lags) |
| `111802` | Amane Sisters | `group_42` | 2 | `vo_char_1118_00_65_hca.hca` | 2.50s | 2.13s | -0.37s | In Sync (±0.5s) |
| `111802` | Amane Sisters | `group_43` | 2 | `vo_char_1118_00_66_hca.hca` | 4.00s | 2.96s | -1.04s | JSON Longer (Live2D lags) |
| `111802` | Amane Sisters | `group_5` | 2 | `vo_char_1118_00_05_hca.hca` | 3.00s | 2.26s | -0.74s | JSON Longer (Live2D lags) |
| `111802` | Amane Sisters | `group_6` | 3 | `vo_char_1118_00_13_hca.hca` | 5.30s | 4.79s | -0.51s | JSON Longer (Live2D lags) |
| `111802` | Amane Sisters | `group_7` | 3 | `vo_char_1118_00_14_hca.hca` | 7.60s | 6.22s | -1.38s | JSON Longer (Live2D lags) |
| `111802` | Amane Sisters | `group_8` | 2 | `vo_char_1118_00_15_hca.hca` | 5.00s | 4.67s | -0.33s | In Sync (±0.5s) |
| `111802` | Amane Sisters | `group_9` | 3 | `vo_char_1118_00_16_hca.hca` | 13.00s | 11.41s | -1.59s | JSON Longer (Live2D lags) |
| `120900` | Rena & Kaede | `group_1` | 10 | `vo_char_1209_00_01_hca.hca` | 26.20s | 25.32s | -0.88s | JSON Longer (Live2D lags) |
| `120900` | Rena & Kaede | `group_10` | 5 | `vo_char_1209_00_17_hca.hca` | 12.90s | 11.96s | -0.94s | JSON Longer (Live2D lags) |
| `120900` | Rena & Kaede | `group_11` | 6 | `vo_char_1209_00_18_hca.hca` | 16.70s | 15.03s | -1.67s | JSON Longer (Live2D lags) |
| `120900` | Rena & Kaede | `group_12` | 3 | `vo_char_1209_00_19_hca.hca` | 6.60s | 5.83s | -0.77s | JSON Longer (Live2D lags) |
| `120900` | Rena & Kaede | `group_13` | 4 | `vo_char_1209_00_20_hca.hca` | 6.10s | 5.19s | -0.91s | JSON Longer (Live2D lags) |
| `120900` | Rena & Kaede | `group_14` | 5 | `vo_char_1209_00_21_hca.hca` | 12.10s | 11.78s | -0.32s | In Sync (±0.5s) |
| `120900` | Rena & Kaede | `group_15` | 9 | `vo_char_1209_00_22_hca.hca` | 20.70s | 20.87s | +0.17s | In Sync (±0.5s) |
| `120900` | Rena & Kaede | `group_16` | 4 | `vo_char_1209_00_23_hca.hca` | 18.40s | 18.38s | -0.02s | In Sync (±0.5s) |
| `120900` | Rena & Kaede | `group_17` | 4 | `vo_char_1209_00_24_hca.hca` | 13.10s | 12.22s | -0.88s | JSON Longer (Live2D lags) |
| `120900` | Rena & Kaede | `group_18` | 4 | `vo_char_1209_00_25_hca.hca` | 11.30s | 10.80s | -0.50s | In Sync (±0.5s) |
| `120900` | Rena & Kaede | `group_19` | 5 | `vo_char_1209_00_26_hca.hca` | 15.00s | 14.93s | -0.07s | In Sync (±0.5s) |
| `120900` | Rena & Kaede | `group_2` | 8 | `vo_char_1209_00_02_hca.hca` | 16.70s | 15.98s | -0.72s | JSON Longer (Live2D lags) |
| `120900` | Rena & Kaede | `group_20` | 6 | `vo_char_1209_00_27_hca.hca` | 13.50s | 13.36s | -0.14s | In Sync (±0.5s) |
| `120900` | Rena & Kaede | `group_21` | 6 | `vo_char_1209_00_28_hca.hca` | 14.20s | 13.97s | -0.23s | In Sync (±0.5s) |
| `120900` | Rena & Kaede | `group_22` | 5 | `vo_char_1209_00_29_hca.hca` | 16.60s | 15.09s | -1.51s | JSON Longer (Live2D lags) |
| `120900` | Rena & Kaede | `group_23` | 5 | `vo_char_1209_00_30_hca.hca` | 13.50s | 13.20s | -0.30s | In Sync (±0.5s) |
| `120900` | Rena & Kaede | `group_24` | 5 | `vo_char_1209_00_31_hca.hca` | 15.00s | 14.02s | -0.98s | JSON Longer (Live2D lags) |
| `120900` | Rena & Kaede | `group_25` | 4 | `vo_char_1209_00_32_hca.hca` | 13.80s | 12.70s | -1.10s | JSON Longer (Live2D lags) |
| `120900` | Rena & Kaede | `group_26` | 5 | `vo_char_1209_00_33_hca.hca` | 14.70s | 14.70s | +0.00s | In Sync (±0.5s) |
| `120900` | Rena & Kaede | `group_27` | 7 | `vo_char_1209_00_34_hca.hca` | 14.10s | 13.35s | -0.75s | JSON Longer (Live2D lags) |
| `120900` | Rena & Kaede | `group_28` | 5 | `vo_char_1209_00_35_hca.hca` | 15.70s | 13.93s | -1.77s | JSON Longer (Live2D lags) |
| `120900` | Rena & Kaede | `group_29` | 6 | `vo_char_1209_00_36_hca.hca` | 14.20s | 14.59s | +0.39s | In Sync (±0.5s) |
| `120900` | Rena & Kaede | `group_3` | 2 | `vo_char_1209_00_03_hca.hca` | 5.00s | 3.28s | -1.72s | JSON Longer (Live2D lags) |
| `120900` | Rena & Kaede | `group_30` | 5 | `vo_char_1209_00_37_hca.hca` | 13.50s | 13.36s | -0.14s | In Sync (±0.5s) |
| `120900` | Rena & Kaede | `group_31` | 5 | `vo_char_1209_00_38_hca.hca` | 15.00s | 15.01s | +0.01s | In Sync (±0.5s) |
| `120900` | Rena & Kaede | `group_32` | 7 | `vo_char_1209_00_39_hca.hca` | 16.40s | 15.70s | -0.70s | JSON Longer (Live2D lags) |
| `120900` | Rena & Kaede | `group_33` | 5 | `vo_char_1209_00_40_hca.hca` | 13.10s | 12.92s | -0.18s | In Sync (±0.5s) |
| `120900` | Rena & Kaede | `group_34` | 8 | `vo_char_1209_00_41_hca.hca` | 16.90s | 16.83s | -0.07s | In Sync (±0.5s) |
| `120900` | Rena & Kaede | `group_35` | 3 | `vo_char_1209_00_42_hca.hca` | 3.90s | 3.79s | -0.11s | In Sync (±0.5s) |
| `120900` | Rena & Kaede | `group_36` | 2 | `vo_char_1209_00_43_hca.hca` | 4.00s | 3.91s | -0.09s | In Sync (±0.5s) |
| `120900` | Rena & Kaede | `group_37` | 3 | `vo_char_1209_00_44_hca.hca` | 3.00s | 2.77s | -0.23s | In Sync (±0.5s) |
| `120900` | Rena & Kaede | `group_38` | 3 | `vo_char_1209_00_45_hca.hca` | 4.50s | 3.01s | -1.49s | JSON Longer (Live2D lags) |
| `120900` | Rena & Kaede | `group_39` | 2 | `vo_char_1209_00_46_hca.hca` | 4.50s | 4.59s | +0.09s | In Sync (±0.5s) |
| `120900` | Rena & Kaede | `group_5` | 3 | `vo_char_1209_00_05_hca.hca` | 7.00s | 6.50s | -0.50s | In Sync (±0.5s) |
| `120900` | Rena & Kaede | `group_6` | 5 | `vo_char_1209_00_13_hca.hca` | 7.40s | 7.18s | -0.22s | In Sync (±0.5s) |
| `120900` | Rena & Kaede | `group_7` | 5 | `vo_char_1209_00_14_hca.hca` | 9.00s | 8.18s | -0.82s | JSON Longer (Live2D lags) |
| `120900` | Rena & Kaede | `group_8` | 3 | `vo_char_1209_00_15_hca.hca` | 5.70s | 5.59s | -0.11s | In Sync (±0.5s) |
| `120900` | Rena & Kaede | `group_9` | 8 | `vo_char_1209_00_16_hca.hca` | 18.20s | 17.14s | -1.06s | JSON Longer (Live2D lags) |
| `120901` | Rena & Kaede | `group_1` | 9 | `vo_char_1209_00_01_hca.hca` | 26.20s | 25.32s | -0.88s | JSON Longer (Live2D lags) |
| `120901` | Rena & Kaede | `group_10` | 4 | `vo_char_1209_00_17_hca.hca` | 12.90s | 11.96s | -0.94s | JSON Longer (Live2D lags) |
| `120901` | Rena & Kaede | `group_11` | 5 | `vo_char_1209_00_18_hca.hca` | 16.70s | 15.03s | -1.67s | JSON Longer (Live2D lags) |
| `120901` | Rena & Kaede | `group_12` | 2 | `vo_char_1209_00_19_hca.hca` | 6.60s | 5.83s | -0.77s | JSON Longer (Live2D lags) |
| `120901` | Rena & Kaede | `group_13` | 3 | `vo_char_1209_00_20_hca.hca` | 6.10s | 5.19s | -0.91s | JSON Longer (Live2D lags) |
| `120901` | Rena & Kaede | `group_14` | 4 | `vo_char_1209_00_21_hca.hca` | 12.10s | 11.78s | -0.32s | In Sync (±0.5s) |
| `120901` | Rena & Kaede | `group_15` | 8 | `vo_char_1209_00_22_hca.hca` | 20.70s | 20.87s | +0.17s | In Sync (±0.5s) |
| `120901` | Rena & Kaede | `group_16` | 4 | `vo_char_1209_00_23_hca.hca` | 18.40s | 18.38s | -0.02s | In Sync (±0.5s) |
| `120901` | Rena & Kaede | `group_17` | 6 | `vo_char_1209_01_24_hca.hca` | 15.20s | 14.20s | -1.00s | JSON Longer (Live2D lags) |
| `120901` | Rena & Kaede | `group_18` | 5 | `vo_char_1209_01_25_hca.hca` | 16.20s | 14.45s | -1.75s | JSON Longer (Live2D lags) |
| `120901` | Rena & Kaede | `group_19` | 4 | `vo_char_1209_01_26_hca.hca` | 11.20s | 11.39s | +0.19s | In Sync (±0.5s) |
| `120901` | Rena & Kaede | `group_2` | 7 | `vo_char_1209_00_02_hca.hca` | 16.70s | 15.98s | -0.72s | JSON Longer (Live2D lags) |
| `120901` | Rena & Kaede | `group_20` | 6 | `vo_char_1209_01_27_hca.hca` | 14.00s | 14.60s | +0.60s | Voice Longer (Live2D advances early) |
| `120901` | Rena & Kaede | `group_21` | 5 | `vo_char_1209_01_28_hca.hca` | 11.70s | 11.18s | -0.52s | JSON Longer (Live2D lags) |
| `120901` | Rena & Kaede | `group_22` | 4 | `vo_char_1209_01_29_hca.hca` | 12.20s | 11.67s | -0.53s | JSON Longer (Live2D lags) |
| `120901` | Rena & Kaede | `group_23` | 6 | `vo_char_1209_01_30_hca.hca` | 14.10s | 13.47s | -0.63s | JSON Longer (Live2D lags) |
| `120901` | Rena & Kaede | `group_24` | 4 | `vo_char_1209_01_31_hca.hca` | 17.50s | 16.20s | -1.30s | JSON Longer (Live2D lags) |
| `120901` | Rena & Kaede | `group_25` | 5 | `vo_char_1209_01_32_hca.hca` | 14.20s | 13.43s | -0.77s | JSON Longer (Live2D lags) |
| `120901` | Rena & Kaede | `group_26` | 5 | `vo_char_1209_01_33_hca.hca` | 15.70s | 13.75s | -1.95s | JSON Longer (Live2D lags) |
| `120901` | Rena & Kaede | `group_27` | 7 | `vo_char_1209_01_34_hca.hca` | 15.50s | 15.45s | -0.05s | In Sync (±0.5s) |
| `120901` | Rena & Kaede | `group_28` | 5 | `vo_char_1209_01_35_hca.hca` | 15.10s | 13.26s | -1.84s | JSON Longer (Live2D lags) |
| `120901` | Rena & Kaede | `group_29` | 6 | `vo_char_1209_01_36_hca.hca` | 17.20s | 16.65s | -0.55s | JSON Longer (Live2D lags) |
| `120901` | Rena & Kaede | `group_3` | 2 | `vo_char_1209_00_03_hca.hca` | 5.00s | 3.28s | -1.72s | JSON Longer (Live2D lags) |
| `120901` | Rena & Kaede | `group_30` | 7 | `vo_char_1209_01_37_hca.hca` | 14.60s | 14.02s | -0.58s | JSON Longer (Live2D lags) |
| `120901` | Rena & Kaede | `group_31` | 5 | `vo_char_1209_01_38_hca.hca` | 15.80s | 14.77s | -1.03s | JSON Longer (Live2D lags) |
| `120901` | Rena & Kaede | `group_32` | 5 | `vo_char_1209_01_39_hca.hca` | 14.10s | 12.85s | -1.25s | JSON Longer (Live2D lags) |
| `120901` | Rena & Kaede | `group_33` | 5 | `vo_char_1209_01_40_hca.hca` | 15.90s | 13.52s | -2.38s | JSON Longer (Live2D lags) |
| `120901` | Rena & Kaede | `group_34` | 8 | `vo_char_1209_01_41_hca.hca` | 21.40s | 19.51s | -1.89s | JSON Longer (Live2D lags) |
| `120901` | Rena & Kaede | `group_35` | 2 | `vo_char_1209_00_42_hca.hca` | 3.90s | 3.79s | -0.11s | In Sync (±0.5s) |
| `120901` | Rena & Kaede | `group_37` | 2 | `vo_char_1209_00_44_hca.hca` | 3.00s | 2.77s | -0.23s | In Sync (±0.5s) |
| `120901` | Rena & Kaede | `group_38` | 2 | `vo_char_1209_00_45_hca.hca` | 4.50s | 3.01s | -1.49s | JSON Longer (Live2D lags) |
| `120901` | Rena & Kaede | `group_39` | 2 | `vo_char_1209_00_46_hca.hca` | 4.50s | 4.59s | +0.09s | In Sync (±0.5s) |
| `120901` | Rena & Kaede | `group_5` | 3 | `vo_char_1209_00_05_hca.hca` | 7.00s | 6.50s | -0.50s | In Sync (±0.5s) |
| `120901` | Rena & Kaede | `group_6` | 4 | `vo_char_1209_00_13_hca.hca` | 7.40s | 7.18s | -0.22s | In Sync (±0.5s) |
| `120901` | Rena & Kaede | `group_7` | 4 | `vo_char_1209_00_14_hca.hca` | 9.00s | 8.18s | -0.82s | JSON Longer (Live2D lags) |
| `120901` | Rena & Kaede | `group_8` | 2 | `vo_char_1209_00_15_hca.hca` | 5.70s | 5.59s | -0.11s | In Sync (±0.5s) |
| `120901` | Rena & Kaede | `group_9` | 7 | `vo_char_1209_00_16_hca.hca` | 18.20s | 17.14s | -1.06s | JSON Longer (Live2D lags) |
| `120902` | Rena & Kaede | `group_1` | 9 | `vo_char_1209_00_01_hca.hca` | 26.20s | 25.32s | -0.88s | JSON Longer (Live2D lags) |
| `120902` | Rena & Kaede | `group_10` | 4 | `vo_char_1209_00_17_hca.hca` | 12.90s | 11.96s | -0.94s | JSON Longer (Live2D lags) |
| `120902` | Rena & Kaede | `group_11` | 5 | `vo_char_1209_00_18_hca.hca` | 16.70s | 15.03s | -1.67s | JSON Longer (Live2D lags) |
| `120902` | Rena & Kaede | `group_12` | 2 | `vo_char_1209_00_19_hca.hca` | 6.60s | 5.83s | -0.77s | JSON Longer (Live2D lags) |
| `120902` | Rena & Kaede | `group_13` | 3 | `vo_char_1209_00_20_hca.hca` | 6.10s | 5.19s | -0.91s | JSON Longer (Live2D lags) |
| `120902` | Rena & Kaede | `group_14` | 4 | `vo_char_1209_00_21_hca.hca` | 12.10s | 11.78s | -0.32s | In Sync (±0.5s) |
| `120902` | Rena & Kaede | `group_15` | 8 | `vo_char_1209_00_22_hca.hca` | 20.70s | 20.87s | +0.17s | In Sync (±0.5s) |
| `120902` | Rena & Kaede | `group_16` | 4 | `vo_char_1209_00_23_hca.hca` | 18.40s | 18.38s | -0.02s | In Sync (±0.5s) |
| `120902` | Rena & Kaede | `group_17` | 5 | `vo_char_1209_02_24_hca.hca` | 13.80s | 13.05s | -0.75s | JSON Longer (Live2D lags) |
| `120902` | Rena & Kaede | `group_18` | 6 | `vo_char_1209_02_25_hca.hca` | 15.30s | 15.17s | -0.13s | In Sync (±0.5s) |
| `120902` | Rena & Kaede | `group_19` | 7 | `vo_char_1209_02_26_hca.hca` | 15.40s | 15.34s | -0.06s | In Sync (±0.5s) |
| `120902` | Rena & Kaede | `group_2` | 7 | `vo_char_1209_00_02_hca.hca` | 16.70s | 15.98s | -0.72s | JSON Longer (Live2D lags) |
| `120902` | Rena & Kaede | `group_20` | 4 | `vo_char_1209_02_27_hca.hca` | 12.80s | 11.57s | -1.23s | JSON Longer (Live2D lags) |
| `120902` | Rena & Kaede | `group_21` | 9 | `vo_char_1209_02_28_hca.hca` | 16.40s | 16.55s | +0.15s | In Sync (±0.5s) |
| `120902` | Rena & Kaede | `group_22` | 5 | `vo_char_1209_02_29_hca.hca` | 12.50s | 12.12s | -0.38s | In Sync (±0.5s) |
| `120902` | Rena & Kaede | `group_23` | 5 | `vo_char_1209_02_30_hca.hca` | 14.70s | 14.40s | -0.30s | In Sync (±0.5s) |
| `120902` | Rena & Kaede | `group_24` | 7 | `vo_char_1209_02_31_hca.hca` | 19.00s | 19.21s | +0.21s | In Sync (±0.5s) |
| `120902` | Rena & Kaede | `group_25` | 5 | `vo_char_1209_02_32_hca.hca` | 18.10s | 16.62s | -1.48s | JSON Longer (Live2D lags) |
| `120902` | Rena & Kaede | `group_26` | 5 | `vo_char_1209_02_33_hca.hca` | 13.60s | 13.73s | +0.13s | In Sync (±0.5s) |
| `120902` | Rena & Kaede | `group_27` | 5 | `vo_char_1209_02_34_hca.hca` | 16.10s | 14.03s | -2.07s | JSON Longer (Live2D lags) |
| `120902` | Rena & Kaede | `group_28` | 5 | `vo_char_1209_02_35_hca.hca` | 14.40s | 13.85s | -0.55s | JSON Longer (Live2D lags) |
| `120902` | Rena & Kaede | `group_29` | 8 | `vo_char_1209_02_36_hca.hca` | 23.40s | 21.86s | -1.54s | JSON Longer (Live2D lags) |
| `120902` | Rena & Kaede | `group_3` | 2 | `vo_char_1209_00_03_hca.hca` | 5.00s | 3.28s | -1.72s | JSON Longer (Live2D lags) |
| `120902` | Rena & Kaede | `group_30` | 5 | `vo_char_1209_02_37_hca.hca` | 14.50s | 13.31s | -1.19s | JSON Longer (Live2D lags) |
| `120902` | Rena & Kaede | `group_31` | 6 | `vo_char_1209_02_38_hca.hca` | 14.00s | 14.52s | +0.52s | Voice Longer (Live2D advances early) |
| `120902` | Rena & Kaede | `group_32` | 5 | `vo_char_1209_02_39_hca.hca` | 15.10s | 14.56s | -0.54s | JSON Longer (Live2D lags) |
| `120902` | Rena & Kaede | `group_33` | 5 | `vo_char_1209_02_40_hca.hca` | 13.40s | 13.04s | -0.36s | In Sync (±0.5s) |
| `120902` | Rena & Kaede | `group_34` | 5 | `vo_char_1209_02_41_hca.hca` | 14.00s | 13.60s | -0.40s | In Sync (±0.5s) |
| `120902` | Rena & Kaede | `group_35` | 2 | `vo_char_1209_00_42_hca.hca` | 3.90s | 3.79s | -0.11s | In Sync (±0.5s) |
| `120902` | Rena & Kaede | `group_37` | 2 | `vo_char_1209_00_44_hca.hca` | 3.00s | 2.77s | -0.23s | In Sync (±0.5s) |
| `120902` | Rena & Kaede | `group_38` | 2 | `vo_char_1209_00_45_hca.hca` | 4.50s | 3.01s | -1.49s | JSON Longer (Live2D lags) |
| `120902` | Rena & Kaede | `group_39` | 2 | `vo_char_1209_00_46_hca.hca` | 4.50s | 4.59s | +0.09s | In Sync (±0.5s) |
| `120902` | Rena & Kaede | `group_5` | 3 | `vo_char_1209_00_05_hca.hca` | 7.00s | 6.50s | -0.50s | In Sync (±0.5s) |
| `120902` | Rena & Kaede | `group_6` | 4 | `vo_char_1209_00_13_hca.hca` | 7.40s | 7.18s | -0.22s | In Sync (±0.5s) |
| `120902` | Rena & Kaede | `group_7` | 4 | `vo_char_1209_00_14_hca.hca` | 9.00s | 8.18s | -0.82s | JSON Longer (Live2D lags) |
| `120902` | Rena & Kaede | `group_8` | 2 | `vo_char_1209_00_15_hca.hca` | 5.70s | 5.59s | -0.11s | In Sync (±0.5s) |
| `120902` | Rena & Kaede | `group_9` | 7 | `vo_char_1209_00_16_hca.hca` | 18.20s | 17.14s | -1.06s | JSON Longer (Live2D lags) |
| `130100` | Iroha & Yachiyo | `group_1` | 11 | `vo_char_1301_00_01_hca.hca` | 22.40s | 21.87s | -0.53s | JSON Longer (Live2D lags) |
| `130100` | Iroha & Yachiyo | `group_10` | 4 | `vo_char_1301_00_17_hca.hca` | 11.60s | 10.61s | -0.99s | JSON Longer (Live2D lags) |
| `130100` | Iroha & Yachiyo | `group_11` | 5 | `vo_char_1301_00_18_hca.hca` | 13.30s | 11.54s | -1.76s | JSON Longer (Live2D lags) |
| `130100` | Iroha & Yachiyo | `group_12` | 2 | `vo_char_1301_00_19_hca.hca` | 5.00s | 4.39s | -0.61s | JSON Longer (Live2D lags) |
| `130100` | Iroha & Yachiyo | `group_13` | 3 | `vo_char_1301_00_20_hca.hca` | 6.80s | 5.66s | -1.14s | JSON Longer (Live2D lags) |
| `130100` | Iroha & Yachiyo | `group_14` | 5 | `vo_char_1301_00_21_hca.hca` | 13.30s | 11.05s | -2.25s | JSON Longer (Live2D lags) |
| `130100` | Iroha & Yachiyo | `group_15` | 7 | `vo_char_1301_00_22_hca.hca` | 18.30s | 17.24s | -1.06s | JSON Longer (Live2D lags) |
| `130100` | Iroha & Yachiyo | `group_16` | 9 | `vo_char_1301_00_23_hca.hca` | 16.20s | 16.63s | +0.43s | In Sync (±0.5s) |
| `130100` | Iroha & Yachiyo | `group_17` | 5 | `vo_char_1301_00_24_hca.hca` | 11.90s | 10.16s | -1.74s | JSON Longer (Live2D lags) |
| `130100` | Iroha & Yachiyo | `group_18` | 8 | `vo_char_1301_00_25_hca.hca` | 14.10s | 14.53s | +0.43s | In Sync (±0.5s) |
| `130100` | Iroha & Yachiyo | `group_19` | 5 | `vo_char_1301_00_26_hca.hca` | 10.20s | 10.89s | +0.69s | Voice Longer (Live2D advances early) |
| `130100` | Iroha & Yachiyo | `group_2` | 4 | `vo_char_1301_00_02_hca.hca` | 9.50s | 8.97s | -0.53s | JSON Longer (Live2D lags) |
| `130100` | Iroha & Yachiyo | `group_20` | 7 | `vo_char_1301_00_27_hca.hca` | 12.00s | 11.99s | -0.01s | In Sync (±0.5s) |
| `130100` | Iroha & Yachiyo | `group_21` | 7 | `vo_char_1301_00_28_hca.hca` | 22.60s | 23.03s | +0.43s | In Sync (±0.5s) |
| `130100` | Iroha & Yachiyo | `group_22` | 4 | `vo_char_1301_00_29_hca.hca` | 17.80s | 16.43s | -1.37s | JSON Longer (Live2D lags) |
| `130100` | Iroha & Yachiyo | `group_23` | 5 | `vo_char_1301_00_30_hca.hca` | 9.80s | 9.06s | -0.74s | JSON Longer (Live2D lags) |
| `130100` | Iroha & Yachiyo | `group_24` | 6 | `vo_char_1301_00_31_hca.hca` | 13.00s | 12.67s | -0.33s | In Sync (±0.5s) |
| `130100` | Iroha & Yachiyo | `group_25` | 3 | `vo_char_1301_00_32_hca.hca` | 10.50s | 10.33s | -0.17s | In Sync (±0.5s) |
| `130100` | Iroha & Yachiyo | `group_26` | 4 | `vo_char_1301_00_33_hca.hca` | 14.10s | 13.84s | -0.26s | In Sync (±0.5s) |
| `130100` | Iroha & Yachiyo | `group_27` | 6 | `vo_char_1301_00_34_hca.hca` | 13.40s | 12.07s | -1.33s | JSON Longer (Live2D lags) |
| `130100` | Iroha & Yachiyo | `group_28` | 6 | `vo_char_1301_00_35_hca.hca` | 14.10s | 13.23s | -0.87s | JSON Longer (Live2D lags) |
| `130100` | Iroha & Yachiyo | `group_29` | 5 | `vo_char_1301_00_36_hca.hca` | 10.60s | 10.14s | -0.46s | In Sync (±0.5s) |
| `130100` | Iroha & Yachiyo | `group_3` | 3 | `vo_char_1301_00_03_hca.hca` | 3.70s | 3.47s | -0.23s | In Sync (±0.5s) |
| `130100` | Iroha & Yachiyo | `group_30` | 6 | `vo_char_1301_00_37_hca.hca` | 11.10s | 11.70s | +0.60s | Voice Longer (Live2D advances early) |
| `130100` | Iroha & Yachiyo | `group_31` | 8 | `vo_char_1301_00_38_hca.hca` | 16.40s | 15.87s | -0.53s | JSON Longer (Live2D lags) |
| `130100` | Iroha & Yachiyo | `group_32` | 4 | `vo_char_1301_00_39_hca.hca` | 10.40s | 9.42s | -0.98s | JSON Longer (Live2D lags) |
| `130100` | Iroha & Yachiyo | `group_33` | 6 | `vo_char_1301_00_40_hca.hca` | 15.90s | 15.95s | +0.05s | In Sync (±0.5s) |
| `130100` | Iroha & Yachiyo | `group_34` | 8 | `vo_char_1301_00_41_hca.hca` | 12.80s | 13.38s | +0.58s | Voice Longer (Live2D advances early) |
| `130100` | Iroha & Yachiyo | `group_35` | 3 | `vo_char_1301_00_42_hca.hca` | 5.00s | 5.43s | +0.43s | In Sync (±0.5s) |
| `130100` | Iroha & Yachiyo | `group_36` | 2 | `vo_char_1301_00_43_hca.hca` | 5.00s | 3.93s | -1.07s | JSON Longer (Live2D lags) |
| `130100` | Iroha & Yachiyo | `group_37` | 5 | `vo_char_1301_00_44_hca.hca` | 4.10s | 4.56s | +0.46s | In Sync (±0.5s) |
| `130100` | Iroha & Yachiyo | `group_38` | 3 | `vo_char_1301_00_45_hca.hca` | 5.30s | 5.17s | -0.13s | In Sync (±0.5s) |
| `130100` | Iroha & Yachiyo | `group_39` | 3 | `vo_char_1301_00_46_hca.hca` | 5.00s | 4.99s | -0.01s | In Sync (±0.5s) |
| `130100` | Iroha & Yachiyo | `group_4` | 3 | `vo_char_1301_00_04_hca.hca` | 5.50s | 4.47s | -1.03s | JSON Longer (Live2D lags) |
| `130100` | Iroha & Yachiyo | `group_5` | 3 | `vo_char_1301_00_05_hca.hca` | 3.90s | 3.67s | -0.23s | In Sync (±0.5s) |
| `130100` | Iroha & Yachiyo | `group_6` | 3 | `vo_char_1301_00_13_hca.hca` | 5.50s | 4.79s | -0.71s | JSON Longer (Live2D lags) |
| `130100` | Iroha & Yachiyo | `group_7` | 3 | `vo_char_1301_00_14_hca.hca` | 6.90s | 5.51s | -1.39s | JSON Longer (Live2D lags) |
| `130100` | Iroha & Yachiyo | `group_8` | 3 | `vo_char_1301_00_15_hca.hca` | 7.00s | 6.04s | -0.96s | JSON Longer (Live2D lags) |
| `130100` | Iroha & Yachiyo | `group_9` | 3 | `vo_char_1301_00_16_hca.hca` | 10.60s | 10.26s | -0.34s | In Sync (±0.5s) |
| `130101` | Iroha & Yachiyo | `group_1` | 11 | `vo_char_1301_00_01_hca.hca` | 22.40s | 21.87s | -0.53s | JSON Longer (Live2D lags) |
| `130101` | Iroha & Yachiyo | `group_10` | 4 | `vo_char_1301_00_17_hca.hca` | 11.60s | 10.61s | -0.99s | JSON Longer (Live2D lags) |
| `130101` | Iroha & Yachiyo | `group_11` | 5 | `vo_char_1301_00_18_hca.hca` | 13.30s | 11.54s | -1.76s | JSON Longer (Live2D lags) |
| `130101` | Iroha & Yachiyo | `group_12` | 2 | `vo_char_1301_00_19_hca.hca` | 5.00s | 4.39s | -0.61s | JSON Longer (Live2D lags) |
| `130101` | Iroha & Yachiyo | `group_13` | 3 | `vo_char_1301_00_20_hca.hca` | 6.80s | 5.66s | -1.14s | JSON Longer (Live2D lags) |
| `130101` | Iroha & Yachiyo | `group_14` | 5 | `vo_char_1301_00_21_hca.hca` | 13.30s | 11.05s | -2.25s | JSON Longer (Live2D lags) |
| `130101` | Iroha & Yachiyo | `group_15` | 7 | `vo_char_1301_00_22_hca.hca` | 18.30s | 17.24s | -1.06s | JSON Longer (Live2D lags) |
| `130101` | Iroha & Yachiyo | `group_16` | 9 | `vo_char_1301_00_23_hca.hca` | 16.20s | 16.63s | +0.43s | In Sync (±0.5s) |
| `130101` | Iroha & Yachiyo | `group_17` | 4 | `vo_char_1301_01_24_hca.hca` | 11.50s | 10.97s | -0.53s | JSON Longer (Live2D lags) |
| `130101` | Iroha & Yachiyo | `group_18` | 6 | `vo_char_1301_01_25_hca.hca` | 14.60s | 13.47s | -1.13s | JSON Longer (Live2D lags) |
| `130101` | Iroha & Yachiyo | `group_19` | 5 | `vo_char_1301_01_26_hca.hca` | 12.80s | 12.66s | -0.14s | In Sync (±0.5s) |
| `130101` | Iroha & Yachiyo | `group_2` | 4 | `vo_char_1301_00_02_hca.hca` | 9.50s | 8.97s | -0.53s | JSON Longer (Live2D lags) |
| `130101` | Iroha & Yachiyo | `group_20` | 5 | `vo_char_1301_01_27_hca.hca` | 14.40s | 12.97s | -1.43s | JSON Longer (Live2D lags) |
| `130101` | Iroha & Yachiyo | `group_21` | 5 | `vo_char_1301_01_28_hca.hca` | 15.60s | 14.58s | -1.02s | JSON Longer (Live2D lags) |
| `130101` | Iroha & Yachiyo | `group_22` | 7 | `vo_char_1301_01_29_hca.hca` | 13.80s | 13.24s | -0.56s | JSON Longer (Live2D lags) |
| `130101` | Iroha & Yachiyo | `group_23` | 6 | `vo_char_1301_01_30_hca.hca` | 11.30s | 11.75s | +0.45s | In Sync (±0.5s) |
| `130101` | Iroha & Yachiyo | `group_24` | 4 | `vo_char_1301_01_31_hca.hca` | 11.60s | 11.52s | -0.08s | In Sync (±0.5s) |
| `130101` | Iroha & Yachiyo | `group_25` | 4 | `vo_char_1301_01_32_hca.hca` | 11.30s | 10.32s | -0.98s | JSON Longer (Live2D lags) |
| `130101` | Iroha & Yachiyo | `group_26` | 5 | `vo_char_1301_01_33_hca.hca` | 13.80s | 13.05s | -0.75s | JSON Longer (Live2D lags) |
| `130101` | Iroha & Yachiyo | `group_27` | 4 | `vo_char_1301_01_34_hca.hca` | 12.30s | 11.85s | -0.45s | In Sync (±0.5s) |
| `130101` | Iroha & Yachiyo | `group_28` | 3 | `vo_char_1301_01_35_hca.hca` | 10.20s | 9.56s | -0.64s | JSON Longer (Live2D lags) |
| `130101` | Iroha & Yachiyo | `group_29` | 5 | `vo_char_1301_01_36_hca.hca` | 13.00s | 11.85s | -1.15s | JSON Longer (Live2D lags) |
| `130101` | Iroha & Yachiyo | `group_3` | 3 | `vo_char_1301_00_03_hca.hca` | 3.70s | 3.47s | -0.23s | In Sync (±0.5s) |
| `130101` | Iroha & Yachiyo | `group_30` | 4 | `vo_char_1301_01_37_hca.hca` | 10.50s | 9.65s | -0.85s | JSON Longer (Live2D lags) |
| `130101` | Iroha & Yachiyo | `group_31` | 5 | `vo_char_1301_01_38_hca.hca` | 11.70s | 10.74s | -0.96s | JSON Longer (Live2D lags) |
| `130101` | Iroha & Yachiyo | `group_32` | 4 | `vo_char_1301_01_39_hca.hca` | 12.90s | 12.26s | -0.64s | JSON Longer (Live2D lags) |
| `130101` | Iroha & Yachiyo | `group_33` | 6 | `vo_char_1301_01_40_hca.hca` | 14.90s | 13.05s | -1.85s | JSON Longer (Live2D lags) |
| `130101` | Iroha & Yachiyo | `group_34` | 7 | `vo_char_1301_01_41_hca.hca` | 14.10s | 13.19s | -0.91s | JSON Longer (Live2D lags) |
| `130101` | Iroha & Yachiyo | `group_35` | 3 | `vo_char_1301_00_42_hca.hca` | 5.00s | 5.43s | +0.43s | In Sync (±0.5s) |
| `130101` | Iroha & Yachiyo | `group_36` | 2 | `vo_char_1301_00_43_hca.hca` | 5.00s | 3.93s | -1.07s | JSON Longer (Live2D lags) |
| `130101` | Iroha & Yachiyo | `group_37` | 5 | `vo_char_1301_00_44_hca.hca` | 4.10s | 4.56s | +0.46s | In Sync (±0.5s) |
| `130101` | Iroha & Yachiyo | `group_38` | 3 | `vo_char_1301_00_45_hca.hca` | 5.30s | 5.17s | -0.13s | In Sync (±0.5s) |
| `130101` | Iroha & Yachiyo | `group_39` | 3 | `vo_char_1301_00_46_hca.hca` | 5.00s | 4.99s | -0.01s | In Sync (±0.5s) |
| `130101` | Iroha & Yachiyo | `group_4` | 3 | `vo_char_1301_00_04_hca.hca` | 5.50s | 4.47s | -1.03s | JSON Longer (Live2D lags) |
| `130101` | Iroha & Yachiyo | `group_5` | 3 | `vo_char_1301_00_05_hca.hca` | 3.90s | 3.67s | -0.23s | In Sync (±0.5s) |
| `130101` | Iroha & Yachiyo | `group_6` | 3 | `vo_char_1301_00_13_hca.hca` | 5.50s | 4.79s | -0.71s | JSON Longer (Live2D lags) |
| `130101` | Iroha & Yachiyo | `group_7` | 3 | `vo_char_1301_00_14_hca.hca` | 6.90s | 5.51s | -1.39s | JSON Longer (Live2D lags) |
| `130101` | Iroha & Yachiyo | `group_8` | 3 | `vo_char_1301_00_15_hca.hca` | 7.00s | 6.04s | -0.96s | JSON Longer (Live2D lags) |
| `130101` | Iroha & Yachiyo | `group_9` | 3 | `vo_char_1301_00_16_hca.hca` | 10.60s | 10.26s | -0.34s | In Sync (±0.5s) |
| `130102` | Iroha & Yachiyo | `group_1` | 11 | `vo_char_1301_00_01_hca.hca` | 22.40s | 21.87s | -0.53s | JSON Longer (Live2D lags) |
| `130102` | Iroha & Yachiyo | `group_10` | 4 | `vo_char_1301_00_17_hca.hca` | 11.60s | 10.61s | -0.99s | JSON Longer (Live2D lags) |
| `130102` | Iroha & Yachiyo | `group_11` | 5 | `vo_char_1301_00_18_hca.hca` | 13.30s | 11.54s | -1.76s | JSON Longer (Live2D lags) |
| `130102` | Iroha & Yachiyo | `group_12` | 2 | `vo_char_1301_00_19_hca.hca` | 5.00s | 4.39s | -0.61s | JSON Longer (Live2D lags) |
| `130102` | Iroha & Yachiyo | `group_13` | 3 | `vo_char_1301_00_20_hca.hca` | 6.80s | 5.66s | -1.14s | JSON Longer (Live2D lags) |
| `130102` | Iroha & Yachiyo | `group_14` | 5 | `vo_char_1301_00_21_hca.hca` | 13.30s | 11.05s | -2.25s | JSON Longer (Live2D lags) |
| `130102` | Iroha & Yachiyo | `group_15` | 7 | `vo_char_1301_00_22_hca.hca` | 18.30s | 17.24s | -1.06s | JSON Longer (Live2D lags) |
| `130102` | Iroha & Yachiyo | `group_16` | 9 | `vo_char_1301_00_23_hca.hca` | 16.20s | 16.63s | +0.43s | In Sync (±0.5s) |
| `130102` | Iroha & Yachiyo | `group_17` | 5 | `vo_char_1301_02_24_hca.hca` | 10.80s | 11.00s | +0.20s | In Sync (±0.5s) |
| `130102` | Iroha & Yachiyo | `group_18` | 5 | `vo_char_1301_02_25_hca.hca` | 14.60s | 13.09s | -1.51s | JSON Longer (Live2D lags) |
| `130102` | Iroha & Yachiyo | `group_19` | 5 | `vo_char_1301_02_26_hca.hca` | 10.50s | 10.57s | +0.07s | In Sync (±0.5s) |
| `130102` | Iroha & Yachiyo | `group_2` | 4 | `vo_char_1301_00_02_hca.hca` | 9.50s | 8.97s | -0.53s | JSON Longer (Live2D lags) |
| `130102` | Iroha & Yachiyo | `group_20` | 7 | `vo_char_1301_02_27_hca.hca` | 12.80s | 12.52s | -0.28s | In Sync (±0.5s) |
| `130102` | Iroha & Yachiyo | `group_21` | 7 | `vo_char_1301_02_28_hca.hca` | 12.10s | 11.88s | -0.22s | In Sync (±0.5s) |
| `130102` | Iroha & Yachiyo | `group_22` | 5 | `vo_char_1301_02_29_hca.hca` | 13.40s | 11.87s | -1.53s | JSON Longer (Live2D lags) |
| `130102` | Iroha & Yachiyo | `group_23` | 3 | `vo_char_1301_02_30_hca.hca` | 9.30s | 8.74s | -0.56s | JSON Longer (Live2D lags) |
| `130102` | Iroha & Yachiyo | `group_24` | 5 | `vo_char_1301_02_31_hca.hca` | 13.20s | 11.81s | -1.39s | JSON Longer (Live2D lags) |
| `130102` | Iroha & Yachiyo | `group_25` | 4 | `vo_char_1301_02_32_hca.hca` | 11.20s | 10.91s | -0.29s | In Sync (±0.5s) |
| `130102` | Iroha & Yachiyo | `group_26` | 6 | `vo_char_1301_02_33_hca.hca` | 12.20s | 11.99s | -0.21s | In Sync (±0.5s) |
| `130102` | Iroha & Yachiyo | `group_27` | 4 | `vo_char_1301_02_34_hca.hca` | 11.10s | 10.75s | -0.35s | In Sync (±0.5s) |
| `130102` | Iroha & Yachiyo | `group_28` | 4 | `vo_char_1301_02_35_hca.hca` | 12.10s | 11.67s | -0.43s | In Sync (±0.5s) |
| `130102` | Iroha & Yachiyo | `group_29` | 4 | `vo_char_1301_02_36_hca.hca` | 11.90s | 11.14s | -0.76s | JSON Longer (Live2D lags) |
| `130102` | Iroha & Yachiyo | `group_3` | 3 | `vo_char_1301_00_03_hca.hca` | 3.70s | 3.47s | -0.23s | In Sync (±0.5s) |
| `130102` | Iroha & Yachiyo | `group_30` | 6 | `vo_char_1301_02_37_hca.hca` | 12.30s | 11.91s | -0.39s | In Sync (±0.5s) |
| `130102` | Iroha & Yachiyo | `group_31` | 4 | `vo_char_1301_02_38_hca.hca` | 9.60s | 9.17s | -0.43s | In Sync (±0.5s) |
| `130102` | Iroha & Yachiyo | `group_32` | 4 | `vo_char_1301_02_39_hca.hca` | 12.70s | 11.88s | -0.82s | JSON Longer (Live2D lags) |
| `130102` | Iroha & Yachiyo | `group_33` | 8 | `vo_char_1301_02_40_hca.hca` | 12.20s | 12.34s | +0.14s | In Sync (±0.5s) |
| `130102` | Iroha & Yachiyo | `group_34` | 6 | `vo_char_1301_02_41_hca.hca` | 12.80s | 13.67s | +0.87s | Voice Longer (Live2D advances early) |
| `130102` | Iroha & Yachiyo | `group_35` | 3 | `vo_char_1301_00_42_hca.hca` | 5.00s | 5.43s | +0.43s | In Sync (±0.5s) |
| `130102` | Iroha & Yachiyo | `group_36` | 2 | `vo_char_1301_00_43_hca.hca` | 5.00s | 3.93s | -1.07s | JSON Longer (Live2D lags) |
| `130102` | Iroha & Yachiyo | `group_37` | 5 | `vo_char_1301_00_44_hca.hca` | 4.10s | 4.56s | +0.46s | In Sync (±0.5s) |
| `130102` | Iroha & Yachiyo | `group_38` | 3 | `vo_char_1301_00_45_hca.hca` | 5.30s | 5.17s | -0.13s | In Sync (±0.5s) |
| `130102` | Iroha & Yachiyo | `group_39` | 3 | `vo_char_1301_00_46_hca.hca` | 5.00s | 4.99s | -0.01s | In Sync (±0.5s) |
| `130102` | Iroha & Yachiyo | `group_4` | 3 | `vo_char_1301_00_04_hca.hca` | 5.50s | 4.47s | -1.03s | JSON Longer (Live2D lags) |
| `130102` | Iroha & Yachiyo | `group_5` | 3 | `vo_char_1301_00_05_hca.hca` | 3.90s | 3.67s | -0.23s | In Sync (±0.5s) |
| `130102` | Iroha & Yachiyo | `group_6` | 3 | `vo_char_1301_00_13_hca.hca` | 5.50s | 4.79s | -0.71s | JSON Longer (Live2D lags) |
| `130102` | Iroha & Yachiyo | `group_7` | 3 | `vo_char_1301_00_14_hca.hca` | 6.90s | 5.51s | -1.39s | JSON Longer (Live2D lags) |
| `130102` | Iroha & Yachiyo | `group_8` | 3 | `vo_char_1301_00_15_hca.hca` | 7.00s | 6.04s | -0.96s | JSON Longer (Live2D lags) |
| `130102` | Iroha & Yachiyo | `group_9` | 3 | `vo_char_1301_00_16_hca.hca` | 10.60s | 10.26s | -0.34s | In Sync (±0.5s) |
| `180100` | Iroha & Kuroe | `group_1` | 8 | `vo_char_1801_00_01_hca.hca` | 22.90s | 22.47s | -0.43s | In Sync (±0.5s) |
| `180100` | Iroha & Kuroe | `group_10` | 7 | `vo_char_1801_00_17_hca.hca` | 16.10s | 14.97s | -1.13s | JSON Longer (Live2D lags) |
| `180100` | Iroha & Kuroe | `group_11` | 7 | `vo_char_1801_00_18_hca.hca` | 16.90s | 15.71s | -1.19s | JSON Longer (Live2D lags) |
| `180100` | Iroha & Kuroe | `group_12` | 3 | `vo_char_1801_00_19_hca.hca` | 6.50s | 5.09s | -1.41s | JSON Longer (Live2D lags) |
| `180100` | Iroha & Kuroe | `group_13` | 3 | `vo_char_1801_00_20_hca.hca` | 5.90s | 5.16s | -0.74s | JSON Longer (Live2D lags) |
| `180100` | Iroha & Kuroe | `group_14` | 4 | `vo_char_1801_00_21_hca.hca` | 10.20s | 8.65s | -1.55s | JSON Longer (Live2D lags) |
| `180100` | Iroha & Kuroe | `group_15` | 6 | `vo_char_1801_00_22_hca.hca` | 18.60s | 17.63s | -0.97s | JSON Longer (Live2D lags) |
| `180100` | Iroha & Kuroe | `group_16` | 6 | `vo_char_1801_00_23_hca.hca` | 21.70s | 20.49s | -1.21s | JSON Longer (Live2D lags) |
| `180100` | Iroha & Kuroe | `group_17` | 4 | `vo_char_1801_00_24_hca.hca` | 11.60s | 11.12s | -0.48s | In Sync (±0.5s) |
| `180100` | Iroha & Kuroe | `group_18` | 5 | `vo_char_1801_00_25_hca.hca` | 13.80s | 12.45s | -1.35s | JSON Longer (Live2D lags) |
| `180100` | Iroha & Kuroe | `group_19` | 6 | `vo_char_1801_00_26_hca.hca` | 16.10s | 15.80s | -0.30s | In Sync (±0.5s) |
| `180100` | Iroha & Kuroe | `group_2` | 5 | `vo_char_1801_00_02_hca.hca` | 14.10s | 12.81s | -1.29s | JSON Longer (Live2D lags) |
| `180100` | Iroha & Kuroe | `group_20` | 6 | `vo_char_1801_00_27_hca.hca` | 14.00s | 12.87s | -1.13s | JSON Longer (Live2D lags) |
| `180100` | Iroha & Kuroe | `group_21` | 6 | `vo_char_1801_00_28_hca.hca` | 13.20s | 12.20s | -1.00s | JSON Longer (Live2D lags) |
| `180100` | Iroha & Kuroe | `group_22` | 6 | `vo_char_1801_00_29_hca.hca` | 14.30s | 13.45s | -0.85s | JSON Longer (Live2D lags) |
| `180100` | Iroha & Kuroe | `group_23` | 5 | `vo_char_1801_00_30_hca.hca` | 10.90s | 10.44s | -0.46s | In Sync (±0.5s) |
| `180100` | Iroha & Kuroe | `group_24` | 4 | `vo_char_1801_00_31_hca.hca` | 12.30s | 12.03s | -0.27s | In Sync (±0.5s) |
| `180100` | Iroha & Kuroe | `group_25` | 6 | `vo_char_1801_00_32_hca.hca` | 14.10s | 11.83s | -2.27s | JSON Longer (Live2D lags) |
| `180100` | Iroha & Kuroe | `group_26` | 6 | `vo_char_1801_00_33_hca.hca` | 12.30s | 12.12s | -0.18s | In Sync (±0.5s) |
| `180100` | Iroha & Kuroe | `group_27` | 7 | `vo_char_1801_00_34_hca.hca` | 13.20s | 12.03s | -1.17s | JSON Longer (Live2D lags) |
| `180100` | Iroha & Kuroe | `group_28` | 5 | `vo_char_1801_00_35_hca.hca` | 12.70s | 12.24s | -0.46s | In Sync (±0.5s) |
| `180100` | Iroha & Kuroe | `group_29` | 6 | `vo_char_1801_00_36_hca.hca` | 15.50s | 14.07s | -1.43s | JSON Longer (Live2D lags) |
| `180100` | Iroha & Kuroe | `group_3` | 2 | `vo_char_1801_00_03_hca.hca` | 6.00s | 4.42s | -1.58s | JSON Longer (Live2D lags) |
| `180100` | Iroha & Kuroe | `group_30` | 7 | `vo_char_1801_00_37_hca.hca` | 16.40s | 15.55s | -0.85s | JSON Longer (Live2D lags) |
| `180100` | Iroha & Kuroe | `group_31` | 7 | `vo_char_1801_00_38_hca.hca` | 14.10s | 13.30s | -0.80s | JSON Longer (Live2D lags) |
| `180100` | Iroha & Kuroe | `group_32` | 5 | `vo_char_1801_00_39_hca.hca` | 14.20s | 12.12s | -2.08s | JSON Longer (Live2D lags) |
| `180100` | Iroha & Kuroe | `group_33` | 8 | `vo_char_1801_00_40_hca.hca` | 16.10s | 15.06s | -1.04s | JSON Longer (Live2D lags) |
| `180100` | Iroha & Kuroe | `group_34` | 5 | `vo_char_1801_00_41_hca.hca` | 13.20s | 11.78s | -1.42s | JSON Longer (Live2D lags) |
| `180100` | Iroha & Kuroe | `group_35` | 3 | `vo_char_1801_00_42_hca.hca` | 4.50s | 3.59s | -0.91s | JSON Longer (Live2D lags) |
| `180100` | Iroha & Kuroe | `group_36` | 2 | `vo_char_1801_00_43_hca.hca` | 4.40s | 3.72s | -0.68s | JSON Longer (Live2D lags) |
| `180100` | Iroha & Kuroe | `group_37` | 2 | `vo_char_1801_00_44_hca.hca` | 3.30s | 2.48s | -0.82s | JSON Longer (Live2D lags) |
| `180100` | Iroha & Kuroe | `group_38` | 3 | `vo_char_1801_00_45_hca.hca` | 4.80s | 3.43s | -1.37s | JSON Longer (Live2D lags) |
| `180100` | Iroha & Kuroe | `group_39` | 2 | `vo_char_1801_00_46_hca.hca` | 5.20s | 4.60s | -0.60s | JSON Longer (Live2D lags) |
| `180100` | Iroha & Kuroe | `group_4` | 3 | `vo_char_1801_00_04_hca.hca` | 5.00s | 3.40s | -1.60s | JSON Longer (Live2D lags) |
| `180100` | Iroha & Kuroe | `group_5` | 2 | `vo_char_1801_00_05_hca.hca` | 5.30s | 4.06s | -1.24s | JSON Longer (Live2D lags) |
| `180100` | Iroha & Kuroe | `group_6` | 3 | `vo_char_1801_00_13_hca.hca` | 7.60s | 5.33s | -2.27s | JSON Longer (Live2D lags) |
| `180100` | Iroha & Kuroe | `group_7` | 3 | `vo_char_1801_00_14_hca.hca` | 7.40s | 5.89s | -1.51s | JSON Longer (Live2D lags) |
| `180100` | Iroha & Kuroe | `group_8` | 4 | `vo_char_1801_00_15_hca.hca` | 8.40s | 7.89s | -0.51s | JSON Longer (Live2D lags) |
| `180100` | Iroha & Kuroe | `group_9` | 6 | `vo_char_1801_00_16_hca.hca` | 14.00s | 12.95s | -1.05s | JSON Longer (Live2D lags) |
| `180101` | Iroha & Kuroe | `group_1` | 7 | `vo_char_1801_00_01_hca.hca` | 23.10s | 22.47s | -0.63s | JSON Longer (Live2D lags) |
| `180101` | Iroha & Kuroe | `group_10` | 6 | `vo_char_1801_00_17_hca.hca` | 16.10s | 14.97s | -1.13s | JSON Longer (Live2D lags) |
| `180101` | Iroha & Kuroe | `group_11` | 6 | `vo_char_1801_00_18_hca.hca` | 16.90s | 15.71s | -1.19s | JSON Longer (Live2D lags) |
| `180101` | Iroha & Kuroe | `group_12` | 2 | `vo_char_1801_00_19_hca.hca` | 6.50s | 5.09s | -1.41s | JSON Longer (Live2D lags) |
| `180101` | Iroha & Kuroe | `group_13` | 2 | `vo_char_1801_00_20_hca.hca` | 5.90s | 5.16s | -0.74s | JSON Longer (Live2D lags) |
| `180101` | Iroha & Kuroe | `group_14` | 3 | `vo_char_1801_00_21_hca.hca` | 10.20s | 8.65s | -1.55s | JSON Longer (Live2D lags) |
| `180101` | Iroha & Kuroe | `group_15` | 5 | `vo_char_1801_00_22_hca.hca` | 18.50s | 17.63s | -0.87s | JSON Longer (Live2D lags) |
| `180101` | Iroha & Kuroe | `group_16` | 6 | `vo_char_1801_00_23_hca.hca` | 21.50s | 20.49s | -1.01s | JSON Longer (Live2D lags) |
| `180101` | Iroha & Kuroe | `group_17` | 4 | `vo_char_1801_01_24_hca.hca` | 11.10s | 9.92s | -1.18s | JSON Longer (Live2D lags) |
| `180101` | Iroha & Kuroe | `group_18` | 6 | `vo_char_1801_01_25_hca.hca` | 14.90s | 14.01s | -0.89s | JSON Longer (Live2D lags) |
| `180101` | Iroha & Kuroe | `group_19` | 4 | `vo_char_1801_01_26_hca.hca` | 13.20s | 11.48s | -1.72s | JSON Longer (Live2D lags) |
| `180101` | Iroha & Kuroe | `group_2` | 4 | `vo_char_1801_00_02_hca.hca` | 14.10s | 12.81s | -1.29s | JSON Longer (Live2D lags) |
| `180101` | Iroha & Kuroe | `group_20` | 4 | `vo_char_1801_01_27_hca.hca` | 10.70s | 9.37s | -1.33s | JSON Longer (Live2D lags) |
| `180101` | Iroha & Kuroe | `group_21` | 5 | `vo_char_1801_01_28_hca.hca` | 13.30s | 12.18s | -1.12s | JSON Longer (Live2D lags) |
| `180101` | Iroha & Kuroe | `group_22` | 5 | `vo_char_1801_01_29_hca.hca` | 12.00s | 11.43s | -0.57s | JSON Longer (Live2D lags) |
| `180101` | Iroha & Kuroe | `group_23` | 5 | `vo_char_1801_01_30_hca.hca` | 10.90s | 10.59s | -0.31s | In Sync (±0.5s) |
| `180101` | Iroha & Kuroe | `group_24` | 6 | `vo_char_1801_01_31_hca.hca` | 12.70s | 11.68s | -1.02s | JSON Longer (Live2D lags) |
| `180101` | Iroha & Kuroe | `group_25` | 5 | `vo_char_1801_01_32_hca.hca` | 12.80s | 12.44s | -0.36s | In Sync (±0.5s) |
| `180101` | Iroha & Kuroe | `group_26` | 5 | `vo_char_1801_01_33_hca.hca` | 14.80s | 12.95s | -1.85s | JSON Longer (Live2D lags) |
| `180101` | Iroha & Kuroe | `group_27` | 5 | `vo_char_1801_01_34_hca.hca` | 11.60s | 10.93s | -0.67s | JSON Longer (Live2D lags) |
| `180101` | Iroha & Kuroe | `group_28` | 7 | `vo_char_1801_01_35_hca.hca` | 13.60s | 13.19s | -0.41s | In Sync (±0.5s) |
| `180101` | Iroha & Kuroe | `group_29` | 6 | `vo_char_1801_01_36_hca.hca` | 12.60s | 12.11s | -0.49s | In Sync (±0.5s) |
| `180101` | Iroha & Kuroe | `group_3` | 2 | `vo_char_1801_00_03_hca.hca` | 5.00s | 4.42s | -0.58s | JSON Longer (Live2D lags) |
| `180101` | Iroha & Kuroe | `group_30` | 6 | `vo_char_1801_01_37_hca.hca` | 15.60s | 14.09s | -1.51s | JSON Longer (Live2D lags) |
| `180101` | Iroha & Kuroe | `group_31` | 4 | `vo_char_1801_01_38_hca.hca` | 11.00s | 10.28s | -0.72s | JSON Longer (Live2D lags) |
| `180101` | Iroha & Kuroe | `group_32` | 5 | `vo_char_1801_01_39_hca.hca` | 11.40s | 10.80s | -0.60s | JSON Longer (Live2D lags) |
| `180101` | Iroha & Kuroe | `group_33` | 5 | `vo_char_1801_01_40_hca.hca` | 12.40s | 11.12s | -1.28s | JSON Longer (Live2D lags) |
| `180101` | Iroha & Kuroe | `group_34` | 6 | `vo_char_1801_01_41_hca.hca` | 13.50s | 12.72s | -0.78s | JSON Longer (Live2D lags) |
| `180101` | Iroha & Kuroe | `group_35` | 2 | `vo_char_1801_00_42_hca.hca` | 4.50s | 3.59s | -0.91s | JSON Longer (Live2D lags) |
| `180101` | Iroha & Kuroe | `group_38` | 2 | `vo_char_1801_00_45_hca.hca` | 4.80s | 3.43s | -1.37s | JSON Longer (Live2D lags) |
| `180101` | Iroha & Kuroe | `group_39` | 2 | `vo_char_1801_00_46_hca.hca` | 5.20s | 4.60s | -0.60s | JSON Longer (Live2D lags) |
| `180101` | Iroha & Kuroe | `group_4` | 2 | `vo_char_1801_00_04_hca.hca` | 6.00s | 3.40s | -2.60s | JSON Longer (Live2D lags) |
| `180101` | Iroha & Kuroe | `group_5` | 2 | `vo_char_1801_00_05_hca.hca` | 5.30s | 4.06s | -1.24s | JSON Longer (Live2D lags) |
| `180101` | Iroha & Kuroe | `group_6` | 2 | `vo_char_1801_00_13_hca.hca` | 7.60s | 5.33s | -2.27s | JSON Longer (Live2D lags) |
| `180101` | Iroha & Kuroe | `group_7` | 2 | `vo_char_1801_00_14_hca.hca` | 7.40s | 5.89s | -1.51s | JSON Longer (Live2D lags) |
| `180101` | Iroha & Kuroe | `group_8` | 3 | `vo_char_1801_00_15_hca.hca` | 8.40s | 7.89s | -0.51s | JSON Longer (Live2D lags) |
| `180101` | Iroha & Kuroe | `group_9` | 5 | `vo_char_1801_00_16_hca.hca` | 14.00s | 12.95s | -1.05s | JSON Longer (Live2D lags) |
| `180102` | Iroha & Kuroe | `group_1` | 7 | `vo_char_1801_00_01_hca.hca` | 23.10s | 22.47s | -0.63s | JSON Longer (Live2D lags) |
| `180102` | Iroha & Kuroe | `group_10` | 6 | `vo_char_1801_00_17_hca.hca` | 16.10s | 14.97s | -1.13s | JSON Longer (Live2D lags) |
| `180102` | Iroha & Kuroe | `group_11` | 6 | `vo_char_1801_00_18_hca.hca` | 16.90s | 15.71s | -1.19s | JSON Longer (Live2D lags) |
| `180102` | Iroha & Kuroe | `group_12` | 2 | `vo_char_1801_00_19_hca.hca` | 6.50s | 5.09s | -1.41s | JSON Longer (Live2D lags) |
| `180102` | Iroha & Kuroe | `group_13` | 2 | `vo_char_1801_00_20_hca.hca` | 5.90s | 5.16s | -0.74s | JSON Longer (Live2D lags) |
| `180102` | Iroha & Kuroe | `group_14` | 3 | `vo_char_1801_00_21_hca.hca` | 10.20s | 8.65s | -1.55s | JSON Longer (Live2D lags) |
| `180102` | Iroha & Kuroe | `group_15` | 5 | `vo_char_1801_00_22_hca.hca` | 18.50s | 17.63s | -0.87s | JSON Longer (Live2D lags) |
| `180102` | Iroha & Kuroe | `group_16` | 6 | `vo_char_1801_00_23_hca.hca` | 21.50s | 20.49s | -1.01s | JSON Longer (Live2D lags) |
| `180102` | Iroha & Kuroe | `group_17` | 4 | `vo_char_1801_02_24_hca.hca` | 14.00s | 13.56s | -0.44s | In Sync (±0.5s) |
| `180102` | Iroha & Kuroe | `group_18` | 5 | `vo_char_1801_02_25_hca.hca` | 14.10s | 13.06s | -1.04s | JSON Longer (Live2D lags) |
| `180102` | Iroha & Kuroe | `group_19` | 5 | `vo_char_1801_02_26_hca.hca` | 13.30s | 12.45s | -0.85s | JSON Longer (Live2D lags) |
| `180102` | Iroha & Kuroe | `group_2` | 4 | `vo_char_1801_00_02_hca.hca` | 14.10s | 12.81s | -1.29s | JSON Longer (Live2D lags) |
| `180102` | Iroha & Kuroe | `group_20` | 6 | `vo_char_1801_02_27_hca.hca` | 12.90s | 12.27s | -0.63s | JSON Longer (Live2D lags) |
| `180102` | Iroha & Kuroe | `group_21` | 5 | `vo_char_1801_02_28_hca.hca` | 13.00s | 11.47s | -1.53s | JSON Longer (Live2D lags) |
| `180102` | Iroha & Kuroe | `group_22` | 5 | `vo_char_1801_02_29_hca.hca` | 12.80s | 11.29s | -1.51s | JSON Longer (Live2D lags) |
| `180102` | Iroha & Kuroe | `group_23` | 5 | `vo_char_1801_02_30_hca.hca` | 13.10s | 11.37s | -1.73s | JSON Longer (Live2D lags) |
| `180102` | Iroha & Kuroe | `group_24` | 5 | `vo_char_1801_02_31_hca.hca` | 10.20s | 9.35s | -0.85s | JSON Longer (Live2D lags) |
| `180102` | Iroha & Kuroe | `group_25` | 5 | `vo_char_1801_02_32_hca.hca` | 12.10s | 11.03s | -1.07s | JSON Longer (Live2D lags) |
| `180102` | Iroha & Kuroe | `group_26` | 4 | `vo_char_1801_02_33_hca.hca` | 13.70s | 12.78s | -0.92s | JSON Longer (Live2D lags) |
| `180102` | Iroha & Kuroe | `group_27` | 4 | `vo_char_1801_02_34_hca.hca` | 12.00s | 11.76s | -0.24s | In Sync (±0.5s) |
| `180102` | Iroha & Kuroe | `group_28` | 5 | `vo_char_1801_02_35_hca.hca` | 13.80s | 12.87s | -0.93s | JSON Longer (Live2D lags) |
| `180102` | Iroha & Kuroe | `group_29` | 8 | `vo_char_1801_02_36_hca.hca` | 14.70s | 13.97s | -0.73s | JSON Longer (Live2D lags) |
| `180102` | Iroha & Kuroe | `group_3` | 2 | `vo_char_1801_00_03_hca.hca` | 5.00s | 4.42s | -0.58s | JSON Longer (Live2D lags) |
| `180102` | Iroha & Kuroe | `group_30` | 5 | `vo_char_1801_02_37_hca.hca` | 14.20s | 13.20s | -1.00s | JSON Longer (Live2D lags) |
| `180102` | Iroha & Kuroe | `group_31` | 6 | `vo_char_1801_02_38_hca.hca` | 14.90s | 14.39s | -0.51s | JSON Longer (Live2D lags) |
| `180102` | Iroha & Kuroe | `group_32` | 5 | `vo_char_1801_02_39_hca.hca` | 16.10s | 14.93s | -1.17s | JSON Longer (Live2D lags) |
| `180102` | Iroha & Kuroe | `group_33` | 6 | `vo_char_1801_02_40_hca.hca` | 14.80s | 13.45s | -1.35s | JSON Longer (Live2D lags) |
| `180102` | Iroha & Kuroe | `group_34` | 4 | `vo_char_1801_02_41_hca.hca` | 10.80s | 9.69s | -1.11s | JSON Longer (Live2D lags) |
| `180102` | Iroha & Kuroe | `group_35` | 2 | `vo_char_1801_00_42_hca.hca` | 4.50s | 3.59s | -0.91s | JSON Longer (Live2D lags) |
| `180102` | Iroha & Kuroe | `group_38` | 2 | `vo_char_1801_00_45_hca.hca` | 4.80s | 3.43s | -1.37s | JSON Longer (Live2D lags) |
| `180102` | Iroha & Kuroe | `group_39` | 2 | `vo_char_1801_00_46_hca.hca` | 5.20s | 4.60s | -0.60s | JSON Longer (Live2D lags) |
| `180102` | Iroha & Kuroe | `group_4` | 2 | `vo_char_1801_00_04_hca.hca` | 6.00s | 3.40s | -2.60s | JSON Longer (Live2D lags) |
| `180102` | Iroha & Kuroe | `group_5` | 2 | `vo_char_1801_00_05_hca.hca` | 5.30s | 4.06s | -1.24s | JSON Longer (Live2D lags) |
| `180102` | Iroha & Kuroe | `group_6` | 2 | `vo_char_1801_00_13_hca.hca` | 7.60s | 5.33s | -2.27s | JSON Longer (Live2D lags) |
| `180102` | Iroha & Kuroe | `group_7` | 2 | `vo_char_1801_00_14_hca.hca` | 7.40s | 5.89s | -1.51s | JSON Longer (Live2D lags) |
| `180102` | Iroha & Kuroe | `group_8` | 3 | `vo_char_1801_00_15_hca.hca` | 8.40s | 7.89s | -0.51s | JSON Longer (Live2D lags) |
| `180102` | Iroha & Kuroe | `group_9` | 5 | `vo_char_1801_00_16_hca.hca` | 14.00s | 12.95s | -1.05s | JSON Longer (Live2D lags) |
| `350100` | Rika & Ren | `group_1` | 9 | `vo_char_3501_00_01_hca.hca` | 27.40s | 26.08s | -1.32s | JSON Longer (Live2D lags) |
| `350100` | Rika & Ren | `group_10` | 5 | `vo_char_3501_00_17_hca.hca` | 12.00s | 11.67s | -0.33s | In Sync (±0.5s) |
| `350100` | Rika & Ren | `group_11` | 5 | `vo_char_3501_00_18_hca.hca` | 13.00s | 12.50s | -0.50s | In Sync (±0.5s) |
| `350100` | Rika & Ren | `group_12` | 3 | `vo_char_3501_00_19_hca.hca` | 5.00s | 4.81s | -0.19s | In Sync (±0.5s) |
| `350100` | Rika & Ren | `group_13` | 4 | `vo_char_3501_00_20_hca.hca` | 9.90s | 8.94s | -0.96s | JSON Longer (Live2D lags) |
| `350100` | Rika & Ren | `group_14` | 5 | `vo_char_3501_00_21_hca.hca` | 14.30s | 12.89s | -1.41s | JSON Longer (Live2D lags) |
| `350100` | Rika & Ren | `group_15` | 6 | `vo_char_3501_00_22_hca.hca` | 21.00s | 19.04s | -1.96s | JSON Longer (Live2D lags) |
| `350100` | Rika & Ren | `group_16` | 4 | `vo_char_3501_00_23_hca.hca` | 17.30s | 16.91s | -0.39s | In Sync (±0.5s) |
| `350100` | Rika & Ren | `group_17` | 4 | `vo_char_3501_00_24_hca.hca` | 12.10s | 11.71s | -0.39s | In Sync (±0.5s) |
| `350100` | Rika & Ren | `group_18` | 7 | `vo_char_3501_00_25_hca.hca` | 14.00s | 12.95s | -1.05s | JSON Longer (Live2D lags) |
| `350100` | Rika & Ren | `group_19` | 6 | `vo_char_3501_00_26_hca.hca` | 16.00s | 14.28s | -1.72s | JSON Longer (Live2D lags) |
| `350100` | Rika & Ren | `group_2` | 8 | `vo_char_3501_00_02_hca.hca` | 13.00s | 12.09s | -0.91s | JSON Longer (Live2D lags) |
| `350100` | Rika & Ren | `group_20` | 7 | `vo_char_3501_00_27_hca.hca` | 14.00s | 13.71s | -0.29s | In Sync (±0.5s) |
| `350100` | Rika & Ren | `group_21` | 5 | `vo_char_3501_00_28_hca.hca` | 15.00s | 14.56s | -0.44s | In Sync (±0.5s) |
| `350100` | Rika & Ren | `group_22` | 6 | `vo_char_3501_00_29_hca.hca` | 13.90s | 12.80s | -1.10s | JSON Longer (Live2D lags) |
| `350100` | Rika & Ren | `group_23` | 9 | `vo_char_3501_00_30_hca.hca` | 15.00s | 14.99s | -0.01s | In Sync (±0.5s) |
| `350100` | Rika & Ren | `group_24` | 5 | `vo_char_3501_00_31_hca.hca` | 15.80s | 15.43s | -0.37s | In Sync (±0.5s) |
| `350100` | Rika & Ren | `group_25` | 5 | `vo_char_3501_00_32_hca.hca` | 16.00s | 14.76s | -1.24s | JSON Longer (Live2D lags) |
| `350100` | Rika & Ren | `group_26` | 5 | `vo_char_3501_00_33_hca.hca` | 13.00s | 12.92s | -0.08s | In Sync (±0.5s) |
| `350100` | Rika & Ren | `group_27` | 6 | `vo_char_3501_00_34_hca.hca` | 16.00s | 14.35s | -1.65s | JSON Longer (Live2D lags) |
| `350100` | Rika & Ren | `group_28` | 6 | `vo_char_3501_00_35_hca.hca` | 16.20s | 16.05s | -0.15s | In Sync (±0.5s) |
| `350100` | Rika & Ren | `group_29` | 6 | `vo_char_3501_00_36_hca.hca` | 17.00s | 16.26s | -0.74s | JSON Longer (Live2D lags) |
| `350100` | Rika & Ren | `group_30` | 5 | `vo_char_3501_00_37_hca.hca` | 12.00s | 11.98s | -0.02s | In Sync (±0.5s) |
| `350100` | Rika & Ren | `group_31` | 5 | `vo_char_3501_00_38_hca.hca` | 11.40s | 11.15s | -0.25s | In Sync (±0.5s) |
| `350100` | Rika & Ren | `group_32` | 7 | `vo_char_3501_00_39_hca.hca` | 13.60s | 13.32s | -0.28s | In Sync (±0.5s) |
| `350100` | Rika & Ren | `group_33` | 9 | `vo_char_3501_00_40_hca.hca` | 17.10s | 16.29s | -0.81s | JSON Longer (Live2D lags) |
| `350100` | Rika & Ren | `group_34` | 6 | `vo_char_3501_00_41_hca.hca` | 15.00s | 14.29s | -0.71s | JSON Longer (Live2D lags) |
| `350100` | Rika & Ren | `group_35` | 3 | `vo_char_3501_00_42_hca.hca` | 4.00s | 3.71s | -0.29s | In Sync (±0.5s) |
| `350100` | Rika & Ren | `group_36` | 2 | `vo_char_3501_00_43_hca.hca` | 4.00s | 3.38s | -0.62s | JSON Longer (Live2D lags) |
| `350100` | Rika & Ren | `group_37` | 2 | `vo_char_3501_00_44_hca.hca` | 4.00s | 3.20s | -0.80s | JSON Longer (Live2D lags) |
| `350100` | Rika & Ren | `group_38` | 3 | `vo_char_3501_00_45_hca.hca` | 4.00s | 3.05s | -0.95s | JSON Longer (Live2D lags) |
| `350100` | Rika & Ren | `group_39` | 2 | `vo_char_3501_00_46_hca.hca` | 5.00s | 4.83s | -0.17s | In Sync (±0.5s) |
| `350100` | Rika & Ren | `group_4` | 2 | `vo_char_3501_00_04_hca.hca` | 5.00s | 4.16s | -0.84s | JSON Longer (Live2D lags) |
| `350100` | Rika & Ren | `group_5` | 2 | `vo_char_3501_00_05_hca.hca` | 3.00s | 2.51s | -0.49s | In Sync (±0.5s) |
| `350100` | Rika & Ren | `group_6` | 3 | `vo_char_3501_00_13_hca.hca` | 6.00s | 5.18s | -0.82s | JSON Longer (Live2D lags) |
| `350100` | Rika & Ren | `group_7` | 4 | `vo_char_3501_00_14_hca.hca` | 7.00s | 6.16s | -0.84s | JSON Longer (Live2D lags) |
| `350100` | Rika & Ren | `group_8` | 4 | `vo_char_3501_00_15_hca.hca` | 7.00s | 6.14s | -0.86s | JSON Longer (Live2D lags) |
| `350100` | Rika & Ren | `group_9` | 5 | `vo_char_3501_00_16_hca.hca` | 12.00s | 11.78s | -0.22s | In Sync (±0.5s) |
| `350101` | Rika & Ren | `group_17` | 6 | `vo_char_3501_01_24_hca.hca` | 11.40s | 9.83s | -1.57s | JSON Longer (Live2D lags) |
| `350101` | Rika & Ren | `group_18` | 5 | `vo_char_3501_01_25_hca.hca` | 10.40s | 9.44s | -0.96s | JSON Longer (Live2D lags) |
| `350101` | Rika & Ren | `group_19` | 7 | `vo_char_3501_01_26_hca.hca` | 14.50s | 12.93s | -1.57s | JSON Longer (Live2D lags) |
| `350101` | Rika & Ren | `group_20` | 8 | `vo_char_3501_01_27_hca.hca` | 13.40s | 11.45s | -1.95s | JSON Longer (Live2D lags) |
| `350101` | Rika & Ren | `group_21` | 5 | `vo_char_3501_01_28_hca.hca` | 12.50s | 10.96s | -1.54s | JSON Longer (Live2D lags) |
| `350101` | Rika & Ren | `group_22` | 6 | `vo_char_3501_01_29_hca.hca` | 13.30s | 11.63s | -1.67s | JSON Longer (Live2D lags) |
| `350101` | Rika & Ren | `group_23` | 5 | `vo_char_3501_01_30_hca.hca` | 10.60s | 9.57s | -1.03s | JSON Longer (Live2D lags) |
| `350101` | Rika & Ren | `group_24` | 5 | `vo_char_3501_01_31_hca.hca` | 12.10s | 10.25s | -1.85s | JSON Longer (Live2D lags) |
| `350101` | Rika & Ren | `group_25` | 6 | `vo_char_3501_01_32_hca.hca` | 12.20s | 10.66s | -1.54s | JSON Longer (Live2D lags) |
| `350101` | Rika & Ren | `group_26` | 6 | `vo_char_3501_01_33_hca.hca` | 15.00s | 12.04s | -2.96s | JSON Longer (Live2D lags) |
| `350101` | Rika & Ren | `group_27` | 5 | `vo_char_3501_01_34_hca.hca` | 11.90s | 10.18s | -1.72s | JSON Longer (Live2D lags) |
| `350101` | Rika & Ren | `group_28` | 7 | `vo_char_3501_01_35_hca.hca` | 17.40s | 14.82s | -2.58s | JSON Longer (Live2D lags) |
| `350101` | Rika & Ren | `group_29` | 7 | `vo_char_3501_01_36_hca.hca` | 12.80s | 10.92s | -1.88s | JSON Longer (Live2D lags) |
| `350101` | Rika & Ren | `group_30` | 5 | `vo_char_3501_01_37_hca.hca` | 12.70s | 9.89s | -2.81s | JSON Longer (Live2D lags) |
| `350101` | Rika & Ren | `group_31` | 4 | `vo_char_3501_01_38_hca.hca` | 13.70s | 11.55s | -2.15s | JSON Longer (Live2D lags) |
| `350101` | Rika & Ren | `group_32` | 6 | `vo_char_3501_01_39_hca.hca` | 14.20s | 12.17s | -2.03s | JSON Longer (Live2D lags) |
| `350101` | Rika & Ren | `group_33` | 6 | `vo_char_3501_01_40_hca.hca` | 12.20s | 10.57s | -1.63s | JSON Longer (Live2D lags) |
| `350101` | Rika & Ren | `group_34` | 5 | `vo_char_3501_01_41_hca.hca` | 14.00s | 11.20s | -2.80s | JSON Longer (Live2D lags) |
| `350102` | Rika & Ren | `group_17` | 6 | `vo_char_3501_02_24_hca.hca` | 22.40s | 21.88s | -0.52s | JSON Longer (Live2D lags) |
| `350102` | Rika & Ren | `group_18` | 4 | `vo_char_3501_02_25_hca.hca` | 15.30s | 14.86s | -0.44s | In Sync (±0.5s) |
| `350102` | Rika & Ren | `group_19` | 5 | `vo_char_3501_02_26_hca.hca` | 22.60s | 20.11s | -2.49s | JSON Longer (Live2D lags) |
| `350102` | Rika & Ren | `group_20` | 6 | `vo_char_3501_02_27_hca.hca` | 20.60s | 18.68s | -1.92s | JSON Longer (Live2D lags) |
| `350102` | Rika & Ren | `group_21` | 6 | `vo_char_3501_02_28_hca.hca` | 22.10s | 20.32s | -1.78s | JSON Longer (Live2D lags) |
| `350102` | Rika & Ren | `group_22` | 7 | `vo_char_3501_02_29_hca.hca` | 17.20s | 15.45s | -1.75s | JSON Longer (Live2D lags) |
| `350102` | Rika & Ren | `group_23` | 8 | `vo_char_3501_02_30_hca.hca` | 20.80s | 17.27s | -3.53s | JSON Longer (Live2D lags) |
| `350102` | Rika & Ren | `group_24` | 5 | `vo_char_3501_02_31_hca.hca` | 22.50s | 19.66s | -2.84s | JSON Longer (Live2D lags) |
| `350102` | Rika & Ren | `group_25` | 5 | `vo_char_3501_02_32_hca.hca` | 23.40s | 20.20s | -3.20s | JSON Longer (Live2D lags) |
| `350102` | Rika & Ren | `group_26` | 7 | `vo_char_3501_02_33_hca.hca` | 19.90s | 17.77s | -2.13s | JSON Longer (Live2D lags) |
| `350102` | Rika & Ren | `group_27` | 5 | `vo_char_3501_02_34_hca.hca` | 17.20s | 14.15s | -3.05s | JSON Longer (Live2D lags) |
| `350102` | Rika & Ren | `group_28` | 4 | `vo_char_3501_02_35_hca.hca` | 18.90s | 16.62s | -2.28s | JSON Longer (Live2D lags) |
| `350102` | Rika & Ren | `group_29` | 8 | `vo_char_3501_02_36_hca.hca` | 23.40s | 21.00s | -2.40s | JSON Longer (Live2D lags) |
| `350102` | Rika & Ren | `group_30` | 6 | `vo_char_3501_02_37_hca.hca` | 21.10s | 17.71s | -3.39s | JSON Longer (Live2D lags) |
| `350102` | Rika & Ren | `group_31` | 6 | `vo_char_3501_02_38_hca.hca` | 18.00s | 16.27s | -1.73s | JSON Longer (Live2D lags) |
| `350102` | Rika & Ren | `group_32` | 5 | `vo_char_3501_02_39_hca.hca` | 18.00s | 15.13s | -2.87s | JSON Longer (Live2D lags) |
| `350102` | Rika & Ren | `group_33` | 5 | `vo_char_3501_02_40_hca.hca` | 18.60s | 16.58s | -2.02s | JSON Longer (Live2D lags) |
| `350102` | Rika & Ren | `group_34` | 6 | `vo_char_3501_02_41_hca.hca` | 19.30s | 17.22s | -2.08s | JSON Longer (Live2D lags) |
| `350400` | Masara & Kokoro | `group_1` | 11 | `vo_char_3504_00_01_hca.hca` | 32.00s | 31.82s | -0.18s | In Sync (±0.5s) |
| `350400` | Masara & Kokoro | `group_10` | 7 | `vo_char_3504_00_17_hca.hca` | 19.10s | 18.57s | -0.53s | JSON Longer (Live2D lags) |
| `350400` | Masara & Kokoro | `group_11` | 6 | `vo_char_3504_00_18_hca.hca` | 16.10s | 15.49s | -0.61s | JSON Longer (Live2D lags) |
| `350400` | Masara & Kokoro | `group_12` | 3 | `vo_char_3504_00_19_hca.hca` | 6.20s | 4.80s | -1.40s | JSON Longer (Live2D lags) |
| `350400` | Masara & Kokoro | `group_13` | 3 | `vo_char_3504_00_20_hca.hca` | 5.00s | 4.39s | -0.61s | JSON Longer (Live2D lags) |
| `350400` | Masara & Kokoro | `group_14` | 5 | `vo_char_3504_00_21_hca.hca` | 15.20s | 14.76s | -0.44s | In Sync (±0.5s) |
| `350400` | Masara & Kokoro | `group_15` | 7 | `vo_char_3504_00_22_hca.hca` | 17.80s | 17.47s | -0.33s | In Sync (±0.5s) |
| `350400` | Masara & Kokoro | `group_16` | 8 | `vo_char_3504_00_23_hca.hca` | 26.20s | 26.40s | +0.20s | In Sync (±0.5s) |
| `350400` | Masara & Kokoro | `group_17` | 7 | `vo_char_3504_00_24_hca.hca` | 17.30s | 16.88s | -0.42s | In Sync (±0.5s) |
| `350400` | Masara & Kokoro | `group_18` | 5 | `vo_char_3504_00_25_hca.hca` | 15.60s | 15.16s | -0.44s | In Sync (±0.5s) |
| `350400` | Masara & Kokoro | `group_19` | 5 | `vo_char_3504_00_26_hca.hca` | 15.00s | 14.19s | -0.81s | JSON Longer (Live2D lags) |
| `350400` | Masara & Kokoro | `group_2` | 6 | `vo_char_3504_00_02_hca.hca` | 12.20s | 11.51s | -0.69s | JSON Longer (Live2D lags) |
| `350400` | Masara & Kokoro | `group_20` | 5 | `vo_char_3504_00_27_hca.hca` | 14.30s | 13.64s | -0.66s | JSON Longer (Live2D lags) |
| `350400` | Masara & Kokoro | `group_21` | 7 | `vo_char_3504_00_28_hca.hca` | 14.00s | 13.66s | -0.34s | In Sync (±0.5s) |
| `350400` | Masara & Kokoro | `group_22` | 4 | `vo_char_3504_00_29_hca.hca` | 11.10s | 10.22s | -0.88s | JSON Longer (Live2D lags) |
| `350400` | Masara & Kokoro | `group_23` | 5 | `vo_char_3504_00_30_hca.hca` | 12.40s | 12.15s | -0.25s | In Sync (±0.5s) |
| `350400` | Masara & Kokoro | `group_24` | 6 | `vo_char_3504_00_31_hca.hca` | 13.70s | 13.71s | +0.01s | In Sync (±0.5s) |
| `350400` | Masara & Kokoro | `group_25` | 3 | `vo_char_3504_00_32_hca.hca` | 10.40s | 10.37s | -0.03s | In Sync (±0.5s) |
| `350400` | Masara & Kokoro | `group_26` | 5 | `vo_char_3504_00_33_hca.hca` | 13.80s | 13.11s | -0.69s | JSON Longer (Live2D lags) |
| `350400` | Masara & Kokoro | `group_27` | 5 | `vo_char_3504_00_34_hca.hca` | 11.20s | 10.73s | -0.47s | In Sync (±0.5s) |
| `350400` | Masara & Kokoro | `group_28` | 5 | `vo_char_3504_00_35_hca.hca` | 13.00s | 12.54s | -0.46s | In Sync (±0.5s) |
| `350400` | Masara & Kokoro | `group_29` | 8 | `vo_char_3504_00_36_hca.hca` | 21.20s | 21.09s | -0.11s | In Sync (±0.5s) |
| `350400` | Masara & Kokoro | `group_30` | 6 | `vo_char_3504_00_37_hca.hca` | 12.70s | 12.13s | -0.57s | JSON Longer (Live2D lags) |
| `350400` | Masara & Kokoro | `group_31` | 6 | `vo_char_3504_00_38_hca.hca` | 16.50s | 16.13s | -0.37s | In Sync (±0.5s) |
| `350400` | Masara & Kokoro | `group_32` | 5 | `vo_char_3504_00_39_hca.hca` | 14.80s | 14.35s | -0.45s | In Sync (±0.5s) |
| `350400` | Masara & Kokoro | `group_33` | 7 | `vo_char_3504_00_40_hca.hca` | 18.00s | 17.84s | -0.16s | In Sync (±0.5s) |
| `350400` | Masara & Kokoro | `group_34` | 8 | `vo_char_3504_00_41_hca.hca` | 15.70s | 15.93s | +0.23s | In Sync (±0.5s) |
| `350400` | Masara & Kokoro | `group_35` | 3 | `vo_char_3504_00_42_hca.hca` | 4.30s | 3.35s | -0.95s | JSON Longer (Live2D lags) |
| `350400` | Masara & Kokoro | `group_36` | 2 | `vo_char_3504_00_43_hca.hca` | 4.00s | 3.15s | -0.85s | JSON Longer (Live2D lags) |
| `350400` | Masara & Kokoro | `group_37` | 2 | `vo_char_3504_00_44_hca.hca` | 3.50s | 2.69s | -0.81s | JSON Longer (Live2D lags) |
| `350400` | Masara & Kokoro | `group_38` | 3 | `vo_char_3504_00_45_hca.hca` | 4.80s | 4.18s | -0.62s | JSON Longer (Live2D lags) |
| `350400` | Masara & Kokoro | `group_39` | 2 | `vo_char_3504_00_46_hca.hca` | 5.00s | 4.30s | -0.70s | JSON Longer (Live2D lags) |
| `350400` | Masara & Kokoro | `group_5` | 2 | `vo_char_3504_00_05_hca.hca` | 7.80s | 7.90s | +0.10s | In Sync (±0.5s) |
| `350400` | Masara & Kokoro | `group_6` | 3 | `vo_char_3504_00_13_hca.hca` | 4.80s | 3.82s | -0.98s | JSON Longer (Live2D lags) |
| `350400` | Masara & Kokoro | `group_7` | 3 | `vo_char_3504_00_14_hca.hca` | 5.90s | 4.59s | -1.31s | JSON Longer (Live2D lags) |
| `350400` | Masara & Kokoro | `group_8` | 3 | `vo_char_3504_00_15_hca.hca` | 5.10s | 4.02s | -1.08s | JSON Longer (Live2D lags) |
| `350400` | Masara & Kokoro | `group_9` | 6 | `vo_char_3504_00_16_hca.hca` | 19.60s | 19.37s | -0.23s | In Sync (±0.5s) |
| `350401` | Masara & Kokoro | `group_1` | 10 | `vo_char_3504_00_01_hca.hca` | 32.00s | 31.82s | -0.18s | In Sync (±0.5s) |
| `350401` | Masara & Kokoro | `group_10` | 6 | `vo_char_3504_00_17_hca.hca` | 18.60s | 18.57s | -0.03s | In Sync (±0.5s) |
| `350401` | Masara & Kokoro | `group_11` | 5 | `vo_char_3504_00_18_hca.hca` | 16.10s | 15.49s | -0.61s | JSON Longer (Live2D lags) |
| `350401` | Masara & Kokoro | `group_12` | 2 | `vo_char_3504_00_19_hca.hca` | 5.70s | 4.80s | -0.90s | JSON Longer (Live2D lags) |
| `350401` | Masara & Kokoro | `group_13` | 2 | `vo_char_3504_00_20_hca.hca` | 5.00s | 4.39s | -0.61s | JSON Longer (Live2D lags) |
| `350401` | Masara & Kokoro | `group_14` | 4 | `vo_char_3504_00_21_hca.hca` | 14.70s | 14.76s | +0.06s | In Sync (±0.5s) |
| `350401` | Masara & Kokoro | `group_15` | 6 | `vo_char_3504_00_22_hca.hca` | 17.80s | 17.47s | -0.33s | In Sync (±0.5s) |
| `350401` | Masara & Kokoro | `group_16` | 8 | `vo_char_3504_00_23_hca.hca` | 26.20s | 26.40s | +0.20s | In Sync (±0.5s) |
| `350401` | Masara & Kokoro | `group_17` | 5 | `vo_char_3504_01_24_hca.hca` | 15.20s | 15.16s | -0.04s | In Sync (±0.5s) |
| `350401` | Masara & Kokoro | `group_18` | 4 | `vo_char_3504_01_25_hca.hca` | 15.40s | 14.67s | -0.73s | JSON Longer (Live2D lags) |
| `350401` | Masara & Kokoro | `group_19` | 6 | `vo_char_3504_01_26_hca.hca` | 15.50s | 14.64s | -0.86s | JSON Longer (Live2D lags) |
| `350401` | Masara & Kokoro | `group_2` | 5 | `vo_char_3504_00_02_hca.hca` | 11.70s | 11.51s | -0.19s | In Sync (±0.5s) |
| `350401` | Masara & Kokoro | `group_20` | 5 | `vo_char_3504_01_27_hca.hca` | 13.60s | 12.67s | -0.93s | JSON Longer (Live2D lags) |
| `350401` | Masara & Kokoro | `group_21` | 7 | `vo_char_3504_01_28_hca.hca` | 15.80s | 15.67s | -0.13s | In Sync (±0.5s) |
| `350401` | Masara & Kokoro | `group_22` | 5 | `vo_char_3504_01_29_hca.hca` | 14.40s | 12.97s | -1.43s | JSON Longer (Live2D lags) |
| `350401` | Masara & Kokoro | `group_23` | 4 | `vo_char_3504_01_30_hca.hca` | 13.10s | 12.68s | -0.42s | In Sync (±0.5s) |
| `350401` | Masara & Kokoro | `group_24` | 4 | `vo_char_3504_01_31_hca.hca` | 13.20s | 12.93s | -0.27s | In Sync (±0.5s) |
| `350401` | Masara & Kokoro | `group_25` | 5 | `vo_char_3504_01_32_hca.hca` | 14.30s | 14.44s | +0.14s | In Sync (±0.5s) |
| `350401` | Masara & Kokoro | `group_26` | 6 | `vo_char_3504_01_33_hca.hca` | 16.00s | 15.42s | -0.58s | JSON Longer (Live2D lags) |
| `350401` | Masara & Kokoro | `group_27` | 4 | `vo_char_3504_01_34_hca.hca` | 13.80s | 13.33s | -0.47s | In Sync (±0.5s) |
| `350401` | Masara & Kokoro | `group_28` | 4 | `vo_char_3504_01_35_hca.hca` | 14.70s | 14.58s | -0.12s | In Sync (±0.5s) |
| `350401` | Masara & Kokoro | `group_29` | 4 | `vo_char_3504_01_36_hca.hca` | 14.80s | 14.21s | -0.59s | JSON Longer (Live2D lags) |
| `350401` | Masara & Kokoro | `group_30` | 5 | `vo_char_3504_01_37_hca.hca` | 14.60s | 14.69s | +0.09s | In Sync (±0.5s) |
| `350401` | Masara & Kokoro | `group_31` | 3 | `vo_char_3504_01_38_hca.hca` | 10.60s | 10.00s | -0.60s | JSON Longer (Live2D lags) |
| `350401` | Masara & Kokoro | `group_32` | 6 | `vo_char_3504_01_39_hca.hca` | 19.60s | 18.13s | -1.47s | JSON Longer (Live2D lags) |
| `350401` | Masara & Kokoro | `group_33` | 4 | `vo_char_3504_01_40_hca.hca` | 14.90s | 13.22s | -1.68s | JSON Longer (Live2D lags) |
| `350401` | Masara & Kokoro | `group_34` | 5 | `vo_char_3504_01_41_hca.hca` | 20.50s | 19.81s | -0.69s | JSON Longer (Live2D lags) |
| `350401` | Masara & Kokoro | `group_35` | 2 | `vo_char_3504_00_42_hca.hca` | 3.80s | 3.35s | -0.45s | In Sync (±0.5s) |
| `350401` | Masara & Kokoro | `group_38` | 2 | `vo_char_3504_00_45_hca.hca` | 4.80s | 4.18s | -0.62s | JSON Longer (Live2D lags) |
| `350401` | Masara & Kokoro | `group_39` | 2 | `vo_char_3504_00_46_hca.hca` | 5.00s | 4.30s | -0.70s | JSON Longer (Live2D lags) |
| `350401` | Masara & Kokoro | `group_5` | 2 | `vo_char_3504_00_05_hca.hca` | 7.80s | 7.90s | +0.10s | In Sync (±0.5s) |
| `350401` | Masara & Kokoro | `group_6` | 2 | `vo_char_3504_00_13_hca.hca` | 3.80s | 3.82s | +0.02s | In Sync (±0.5s) |
| `350401` | Masara & Kokoro | `group_7` | 2 | `vo_char_3504_00_14_hca.hca` | 4.90s | 4.59s | -0.31s | In Sync (±0.5s) |
| `350401` | Masara & Kokoro | `group_8` | 2 | `vo_char_3504_00_15_hca.hca` | 5.10s | 4.02s | -1.08s | JSON Longer (Live2D lags) |
| `350401` | Masara & Kokoro | `group_9` | 5 | `vo_char_3504_00_16_hca.hca` | 19.60s | 19.37s | -0.23s | In Sync (±0.5s) |
| `350402` | Masara & Kokoro | `group_1` | 10 | `vo_char_3504_00_01_hca.hca` | 32.00s | 31.82s | -0.18s | In Sync (±0.5s) |
| `350402` | Masara & Kokoro | `group_10` | 6 | `vo_char_3504_00_17_hca.hca` | 18.60s | 18.57s | -0.03s | In Sync (±0.5s) |
| `350402` | Masara & Kokoro | `group_11` | 5 | `vo_char_3504_00_18_hca.hca` | 16.10s | 15.49s | -0.61s | JSON Longer (Live2D lags) |
| `350402` | Masara & Kokoro | `group_12` | 2 | `vo_char_3504_00_19_hca.hca` | 5.70s | 4.80s | -0.90s | JSON Longer (Live2D lags) |
| `350402` | Masara & Kokoro | `group_13` | 2 | `vo_char_3504_00_20_hca.hca` | 5.00s | 4.39s | -0.61s | JSON Longer (Live2D lags) |
| `350402` | Masara & Kokoro | `group_14` | 4 | `vo_char_3504_00_21_hca.hca` | 14.70s | 14.76s | +0.06s | In Sync (±0.5s) |
| `350402` | Masara & Kokoro | `group_15` | 6 | `vo_char_3504_00_22_hca.hca` | 17.80s | 17.47s | -0.33s | In Sync (±0.5s) |
| `350402` | Masara & Kokoro | `group_16` | 8 | `vo_char_3504_00_23_hca.hca` | 26.20s | 26.40s | +0.20s | In Sync (±0.5s) |
| `350402` | Masara & Kokoro | `group_17` | 7 | `vo_char_3504_02_24_hca.hca` | 16.70s | 16.24s | -0.46s | In Sync (±0.5s) |
| `350402` | Masara & Kokoro | `group_18` | 6 | `vo_char_3504_02_25_hca.hca` | 15.60s | 14.52s | -1.08s | JSON Longer (Live2D lags) |
| `350402` | Masara & Kokoro | `group_19` | 5 | `vo_char_3504_02_26_hca.hca` | 13.80s | 13.56s | -0.24s | In Sync (±0.5s) |
| `350402` | Masara & Kokoro | `group_2` | 5 | `vo_char_3504_00_02_hca.hca` | 11.70s | 11.51s | -0.19s | In Sync (±0.5s) |
| `350402` | Masara & Kokoro | `group_20` | 5 | `vo_char_3504_02_27_hca.hca` | 17.20s | 17.22s | +0.02s | In Sync (±0.5s) |
| `350402` | Masara & Kokoro | `group_21` | 6 | `vo_char_3504_02_28_hca.hca` | 19.90s | 19.27s | -0.63s | JSON Longer (Live2D lags) |
| `350402` | Masara & Kokoro | `group_22` | 4 | `vo_char_3504_02_29_hca.hca` | 14.50s | 13.32s | -1.18s | JSON Longer (Live2D lags) |
| `350402` | Masara & Kokoro | `group_23` | 5 | `vo_char_3504_02_30_hca.hca` | 14.40s | 14.06s | -0.34s | In Sync (±0.5s) |
| `350402` | Masara & Kokoro | `group_24` | 5 | `vo_char_3504_02_31_hca.hca` | 16.40s | 15.56s | -0.84s | JSON Longer (Live2D lags) |
| `350402` | Masara & Kokoro | `group_25` | 4 | `vo_char_3504_02_32_hca.hca` | 12.30s | 12.32s | +0.02s | In Sync (±0.5s) |
| `350402` | Masara & Kokoro | `group_26` | 4 | `vo_char_3504_02_33_hca.hca` | 11.90s | 10.95s | -0.95s | JSON Longer (Live2D lags) |
| `350402` | Masara & Kokoro | `group_27` | 5 | `vo_char_3504_02_34_hca.hca` | 18.70s | 18.09s | -0.61s | JSON Longer (Live2D lags) |
| `350402` | Masara & Kokoro | `group_28` | 8 | `vo_char_3504_02_35_hca.hca` | 17.20s | 17.74s | +0.54s | Voice Longer (Live2D advances early) |
| `350402` | Masara & Kokoro | `group_29` | 6 | `vo_char_3504_02_36_hca.hca` | 12.80s | 12.28s | -0.52s | JSON Longer (Live2D lags) |
| `350402` | Masara & Kokoro | `group_30` | 6 | `vo_char_3504_02_37_hca.hca` | 18.60s | 18.28s | -0.32s | In Sync (±0.5s) |
| `350402` | Masara & Kokoro | `group_31` | 4 | `vo_char_3504_02_38_hca.hca` | 12.20s | 11.26s | -0.94s | JSON Longer (Live2D lags) |
| `350402` | Masara & Kokoro | `group_32` | 6 | `vo_char_3504_02_39_hca.hca` | 17.80s | 17.25s | -0.55s | JSON Longer (Live2D lags) |
| `350402` | Masara & Kokoro | `group_33` | 6 | `vo_char_3504_02_40_hca.hca` | 19.50s | 18.85s | -0.65s | JSON Longer (Live2D lags) |
| `350402` | Masara & Kokoro | `group_34` | 5 | `vo_char_3504_02_41_hca.hca` | 15.10s | 14.36s | -0.74s | JSON Longer (Live2D lags) |
| `350402` | Masara & Kokoro | `group_35` | 2 | `vo_char_3504_00_42_hca.hca` | 3.80s | 3.35s | -0.45s | In Sync (±0.5s) |
| `350402` | Masara & Kokoro | `group_38` | 2 | `vo_char_3504_00_45_hca.hca` | 4.80s | 4.18s | -0.62s | JSON Longer (Live2D lags) |
| `350402` | Masara & Kokoro | `group_39` | 2 | `vo_char_3504_00_46_hca.hca` | 5.00s | 4.30s | -0.70s | JSON Longer (Live2D lags) |
| `350402` | Masara & Kokoro | `group_5` | 2 | `vo_char_3504_00_05_hca.hca` | 7.80s | 7.90s | +0.10s | In Sync (±0.5s) |
| `350402` | Masara & Kokoro | `group_6` | 2 | `vo_char_3504_00_13_hca.hca` | 3.80s | 3.82s | +0.02s | In Sync (±0.5s) |
| `350402` | Masara & Kokoro | `group_7` | 2 | `vo_char_3504_00_14_hca.hca` | 4.90s | 4.59s | -0.31s | In Sync (±0.5s) |
| `350402` | Masara & Kokoro | `group_8` | 2 | `vo_char_3504_00_15_hca.hca` | 5.10s | 4.02s | -1.08s | JSON Longer (Live2D lags) |
| `350402` | Masara & Kokoro | `group_9` | 5 | `vo_char_3504_00_16_hca.hca` | 19.60s | 19.37s | -0.23s | In Sync (±0.5s) |
| `390200` | Shi | `group_1` | 8 | `vo_char_3902_00_01_hca.hca` | 23.90s | 24.32s | +0.42s | In Sync (±0.5s) |
| `390200` | Shi | `group_10` | 5 | `vo_char_3902_00_17_hca.hca` | 15.70s | 15.25s | -0.45s | In Sync (±0.5s) |
| `390200` | Shi | `group_11` | 5 | `vo_char_3902_00_18_hca.hca` | 15.30s | 14.86s | -0.44s | In Sync (±0.5s) |
| `390200` | Shi | `group_12` | 4 | `vo_char_3902_00_19_hca.hca` | 5.90s | 5.81s | -0.09s | In Sync (±0.5s) |
| `390200` | Shi | `group_13` | 3 | `vo_char_3902_00_20_hca.hca` | 6.20s | 5.69s | -0.51s | JSON Longer (Live2D lags) |
| `390200` | Shi | `group_14` | 6 | `vo_char_3902_00_21_hca.hca` | 15.00s | 14.72s | -0.28s | In Sync (±0.5s) |
| `390200` | Shi | `group_15` | 7 | `vo_char_3902_00_22_hca.hca` | 28.50s | 28.82s | +0.32s | In Sync (±0.5s) |
| `390200` | Shi | `group_16` | 6 | `vo_char_3902_00_23_hca.hca` | 18.00s | 17.10s | -0.90s | JSON Longer (Live2D lags) |
| `390200` | Shi | `group_17` | 5 | `vo_char_3902_00_24_hca.hca` | 14.40s | 13.72s | -0.68s | JSON Longer (Live2D lags) |
| `390200` | Shi | `group_18` | 6 | `vo_char_3902_00_25_hca.hca` | 14.30s | 14.35s | +0.05s | In Sync (±0.5s) |
| `390200` | Shi | `group_19` | 4 | `vo_char_3902_00_26_hca.hca` | 9.70s | 11.96s | +2.26s | Voice Longer (Live2D advances early) |
| `390200` | Shi | `group_2` | 6 | `vo_char_3902_00_02_hca.hca` | 14.70s | 14.14s | -0.56s | JSON Longer (Live2D lags) |
| `390200` | Shi | `group_20` | 6 | `vo_char_3902_00_27_hca.hca` | 17.70s | 17.65s | -0.05s | In Sync (±0.5s) |
| `390200` | Shi | `group_21` | 6 | `vo_char_3902_00_28_hca.hca` | 15.10s | 15.03s | -0.07s | In Sync (±0.5s) |
| `390200` | Shi | `group_22` | 7 | `vo_char_3902_00_29_hca.hca` | 15.20s | 15.02s | -0.18s | In Sync (±0.5s) |
| `390200` | Shi | `group_23` | 4 | `vo_char_3902_00_30_hca.hca` | 13.70s | 13.33s | -0.37s | In Sync (±0.5s) |
| `390200` | Shi | `group_24` | 6 | `vo_char_3902_00_31_hca.hca` | 14.10s | 13.60s | -0.50s | In Sync (±0.5s) |
| `390200` | Shi | `group_25` | 5 | `vo_char_3902_00_32_hca.hca` | 19.70s | 17.90s | -1.80s | JSON Longer (Live2D lags) |
| `390200` | Shi | `group_26` | 6 | `vo_char_3902_00_33_hca.hca` | 13.80s | 13.76s | -0.04s | In Sync (±0.5s) |
| `390200` | Shi | `group_27` | 6 | `vo_char_3902_00_34_hca.hca` | 17.40s | 17.73s | +0.33s | In Sync (±0.5s) |
| `390200` | Shi | `group_28` | 6 | `vo_char_3902_00_35_hca.hca` | 13.80s | 13.86s | +0.06s | In Sync (±0.5s) |
| `390200` | Shi | `group_29` | 6 | `vo_char_3902_00_36_hca.hca` | 17.60s | 17.65s | +0.05s | In Sync (±0.5s) |
| `390200` | Shi | `group_3` | 3 | `vo_char_3902_00_03_hca.hca` | 5.20s | 4.97s | -0.23s | In Sync (±0.5s) |
| `390200` | Shi | `group_30` | 5 | `vo_char_3902_00_37_hca.hca` | 17.30s | 17.18s | -0.12s | In Sync (±0.5s) |
| `390200` | Shi | `group_31` | 5 | `vo_char_3902_00_38_hca.hca` | 12.40s | 12.38s | -0.02s | In Sync (±0.5s) |
| `390200` | Shi | `group_32` | 4 | `vo_char_3902_00_39_hca.hca` | 12.70s | 12.56s | -0.14s | In Sync (±0.5s) |
| `390200` | Shi | `group_33` | 6 | `vo_char_3902_00_40_hca.hca` | 16.10s | 16.18s | +0.08s | In Sync (±0.5s) |
| `390200` | Shi | `group_34` | 6 | `vo_char_3902_00_41_hca.hca` | 19.60s | 19.26s | -0.34s | In Sync (±0.5s) |
| `390200` | Shi | `group_35` | 2 | `vo_char_3902_00_42_hca.hca` | 2.40s | 2.03s | -0.37s | In Sync (±0.5s) |
| `390200` | Shi | `group_36` | 2 | `vo_char_3902_00_43_hca.hca` | 2.70s | 2.21s | -0.49s | In Sync (±0.5s) |
| `390200` | Shi | `group_37` | 2 | `vo_char_3902_00_44_hca.hca` | 3.30s | 2.86s | -0.44s | In Sync (±0.5s) |
| `390200` | Shi | `group_38` | 2 | `vo_char_3902_00_45_hca.hca` | 2.60s | 2.13s | -0.47s | In Sync (±0.5s) |
| `390200` | Shi | `group_39` | 3 | `vo_char_3902_00_46_hca.hca` | 3.60s | 2.85s | -0.75s | JSON Longer (Live2D lags) |
| `390200` | Shi | `group_4` | 2 | `vo_char_3902_00_04_hca.hca` | 7.90s | 8.37s | +0.47s | In Sync (±0.5s) |
| `390200` | Shi | `group_5` | 5 | `vo_char_3902_00_05_hca.hca` | 9.10s | 5.35s | -3.75s | JSON Longer (Live2D lags) |
| `390200` | Shi | `group_6` | 4 | `vo_char_3902_00_13_hca.hca` | 7.10s | 6.44s | -0.66s | JSON Longer (Live2D lags) |
| `390200` | Shi | `group_7` | 4 | `vo_char_3902_00_14_hca.hca` | 2.20s | 5.66s | +3.46s | Voice Longer (Live2D advances early) |
| `390200` | Shi | `group_8` | 4 | `vo_char_3902_00_15_hca.hca` | 4.50s | 6.07s | +1.57s | Voice Longer (Live2D advances early) |
| `390200` | Shi | `group_9` | 5 | `vo_char_3902_00_16_hca.hca` | 15.70s | 15.58s | -0.12s | In Sync (±0.5s) |
| `390201` | Shi | `group_1` | 8 | `vo_char_3902_00_01_hca.hca` | 25.20s | 24.32s | -0.88s | JSON Longer (Live2D lags) |
| `390201` | Shi | `group_10` | 4 | `vo_char_3902_00_17_hca.hca` | 16.20s | 15.25s | -0.95s | JSON Longer (Live2D lags) |
| `390201` | Shi | `group_11` | 4 | `vo_char_3902_00_18_hca.hca` | 15.50s | 14.86s | -0.64s | JSON Longer (Live2D lags) |
| `390201` | Shi | `group_12` | 3 | `vo_char_3902_00_19_hca.hca` | 5.90s | 5.81s | -0.09s | In Sync (±0.5s) |
| `390201` | Shi | `group_13` | 2 | `vo_char_3902_00_20_hca.hca` | 6.20s | 5.69s | -0.51s | JSON Longer (Live2D lags) |
| `390201` | Shi | `group_14` | 5 | `vo_char_3902_00_21_hca.hca` | 14.80s | 14.72s | -0.08s | In Sync (±0.5s) |
| `390201` | Shi | `group_15` | 6 | `vo_char_3902_00_22_hca.hca` | 29.50s | 28.82s | -0.68s | JSON Longer (Live2D lags) |
| `390201` | Shi | `group_16` | 6 | `vo_char_3902_00_23_hca.hca` | 18.00s | 17.10s | -0.90s | JSON Longer (Live2D lags) |
| `390201` | Shi | `group_17` | 6 | `vo_char_3902_01_24_hca.hca` | 19.30s | 18.68s | -0.62s | JSON Longer (Live2D lags) |
| `390201` | Shi | `group_18` | 6 | `vo_char_3902_01_25_hca.hca` | 12.50s | 16.52s | +4.02s | Voice Longer (Live2D advances early) |
| `390201` | Shi | `group_19` | 4 | `vo_char_3902_01_26_hca.hca` | 13.50s | 15.23s | +1.73s | Voice Longer (Live2D advances early) |
| `390201` | Shi | `group_2` | 5 | `vo_char_3902_00_02_hca.hca` | 14.70s | 14.14s | -0.56s | JSON Longer (Live2D lags) |
| `390201` | Shi | `group_20` | 6 | `vo_char_3902_01_27_hca.hca` | 18.90s | 18.74s | -0.16s | In Sync (±0.5s) |
| `390201` | Shi | `group_21` | 6 | `vo_char_3902_01_28_hca.hca` | 15.90s | 15.60s | -0.30s | In Sync (±0.5s) |
| `390201` | Shi | `group_22` | 5 | `vo_char_3902_01_29_hca.hca` | 13.10s | 12.91s | -0.19s | In Sync (±0.5s) |
| `390201` | Shi | `group_23` | 5 | `vo_char_3902_01_30_hca.hca` | 17.10s | 16.63s | -0.47s | In Sync (±0.5s) |
| `390201` | Shi | `group_24` | 5 | `vo_char_3902_01_31_hca.hca` | 14.40s | 14.08s | -0.32s | In Sync (±0.5s) |
| `390201` | Shi | `group_25` | 5 | `vo_char_3902_01_32_hca.hca` | 16.80s | 15.38s | -1.42s | JSON Longer (Live2D lags) |
| `390201` | Shi | `group_26` | 4 | `vo_char_3902_01_33_hca.hca` | 11.70s | 11.43s | -0.27s | In Sync (±0.5s) |
| `390201` | Shi | `group_27` | 6 | `vo_char_3902_01_34_hca.hca` | 17.60s | 17.03s | -0.57s | JSON Longer (Live2D lags) |
| `390201` | Shi | `group_28` | 6 | `vo_char_3902_01_35_hca.hca` | 13.80s | 14.26s | +0.46s | In Sync (±0.5s) |
| `390201` | Shi | `group_29` | 5 | `vo_char_3902_01_36_hca.hca` | 15.00s | 14.63s | -0.37s | In Sync (±0.5s) |
| `390201` | Shi | `group_3` | 3 | `vo_char_3902_00_03_hca.hca` | 5.20s | 4.97s | -0.23s | In Sync (±0.5s) |
| `390201` | Shi | `group_30` | 5 | `vo_char_3902_01_37_hca.hca` | 14.60s | 14.60s | +0.00s | In Sync (±0.5s) |
| `390201` | Shi | `group_31` | 6 | `vo_char_3902_01_38_hca.hca` | 17.00s | 17.01s | +0.01s | In Sync (±0.5s) |
| `390201` | Shi | `group_32` | 5 | `vo_char_3902_01_39_hca.hca` | 13.00s | 12.80s | -0.20s | In Sync (±0.5s) |
| `390201` | Shi | `group_33` | 6 | `vo_char_3902_01_40_hca.hca` | 15.40s | 15.31s | -0.09s | In Sync (±0.5s) |
| `390201` | Shi | `group_34` | 8 | `vo_char_3902_01_41_hca.hca` | 25.70s | 25.84s | +0.14s | In Sync (±0.5s) |
| `390201` | Shi | `group_39` | 3 | `vo_char_3902_00_46_hca.hca` | 3.60s | 2.85s | -0.75s | JSON Longer (Live2D lags) |
| `390201` | Shi | `group_4` | 2 | `vo_char_3902_00_04_hca.hca` | 7.70s | 8.37s | +0.67s | Voice Longer (Live2D advances early) |
| `390201` | Shi | `group_5` | 5 | `vo_char_3902_00_05_hca.hca` | 9.10s | 5.35s | -3.75s | JSON Longer (Live2D lags) |
| `390201` | Shi | `group_6` | 3 | `vo_char_3902_00_13_hca.hca` | 8.00s | 6.44s | -1.56s | JSON Longer (Live2D lags) |
| `390201` | Shi | `group_7` | 3 | `vo_char_3902_00_14_hca.hca` | 2.20s | 5.66s | +3.46s | Voice Longer (Live2D advances early) |
| `390201` | Shi | `group_8` | 3 | `vo_char_3902_00_15_hca.hca` | 5.00s | 6.07s | +1.07s | Voice Longer (Live2D advances early) |
| `390201` | Shi | `group_9` | 4 | `vo_char_3902_00_16_hca.hca` | 15.60s | 15.58s | -0.02s | In Sync (±0.5s) |

---

## All Scenario Groups Where Voice is Longer Than JSON Sum ($T_{\text{voice}} - T_{\text{json}} > 0.1\text{s}$)

These are the scenario groups where the voice audio file duration exceeds the JSON `autoTurnFirst` step sum by more than 0.1s (Live2D advances early).

| Outfit ID | Character Name | Group | Steps | Voice File | JSON Sum | Voice Duration | Drift |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `404300` | Suruga Kanbaru | `group_1` | 5 | `vo_char_4043_00_01_hca.hca` | 9.75s | 23.22s | +13.47s |
| `302950` | Masara Kagami | `group_14` | 6 | `vo_char_3029_00_22_hca.hca` | 13.50s | 21.22s | +7.72s |
| `304800` | Hotaru Yura | `group_2` | 5 | `vo_char_3048_00_02_hca.hca` | 15.60s | 20.58s | +4.98s |
| `302950` | Masara Kagami | `group_8` | 3 | `vo_char_3029_00_16_hca.hca` | 8.00s | 12.79s | +4.79s |
| `104400` | Mikoto Sena | `group_9` | 5 | `vo_char_1044_00_16_hca.hca` | 6.90s | 11.31s | +4.41s |
| `404200` | Mayoi Hachikuji | `group_1` | 5 | `vo_char_4042_00_01_hca.hca` | 12.55s | 16.94s | +4.39s |
| `302950` | Masara Kagami | `group_10` | 3 | `vo_char_3029_00_18_hca.hca` | 10.00s | 14.21s | +4.21s |
| `390201` | Shi | `group_18` | 6 | `vo_char_3902_01_25_hca.hca` | 12.50s | 16.52s | +4.02s |
| `114400` | Uwasa Mikoto | `group_18` | 4 | `vo_char_1144_00_25_hca.hca` | 7.50s | 11.49s | +3.99s |
| `302950` | Masara Kagami | `group_11` | 3 | `vo_char_3029_00_19_hca.hca` | 4.80s | 8.70s | +3.90s |
| `103300` | Rabi Himuro | `group_23` | 8 | `vo_char_1033_00_30_hca.hca` | 12.30s | 15.96s | +3.66s |
| `303551` | Riko Chiaki | `group_3` | 2 | `vo_char_3035_00_04_hca.hca` | 5.50s | 8.97s | +3.47s |
| `390200` | Shi | `group_7` | 4 | `vo_char_3902_00_14_hca.hca` | 2.20s | 5.66s | +3.46s |
| `390201` | Shi | `group_7` | 3 | `vo_char_3902_00_14_hca.hca` | 2.20s | 5.66s | +3.46s |
| `104400` | Mikoto Sena | `group_8` | 3 | `vo_char_1044_00_15_hca.hca` | 3.70s | 7.12s | +3.42s |
| `114400` | Uwasa Mikoto | `group_8` | 3 | `vo_char_1144_00_15_hca.hca` | 1.80s | 5.16s | +3.36s |
| `114400` | Uwasa Mikoto | `group_7` | 3 | `vo_char_1144_00_14_hca.hca` | 2.90s | 6.14s | +3.24s |
| `301150` | Kako Natsume | `group_17` | 8 | `vo_char_3011_50_25_hca.hca` | 26.20s | 28.94s | +2.74s |
| `302950` | Masara Kagami | `group_6` | 3 | `vo_char_3029_00_14_hca.hca` | 5.00s | 7.69s | +2.69s |
| `102250` | Hikaru Kirari | `group_45` | 3 | `vo_game_0302_09_hca.hca` | 7.60s | 10.25s | +2.65s |
| `302900` | Masara Kagami | `group_15` | 4 | `vo_char_3029_00_23_hca.hca` | 18.00s | 20.65s | +2.65s |
| `302950` | Masara Kagami | `group_15` | 4 | `vo_char_3029_00_23_hca.hca` | 18.00s | 20.65s | +2.65s |
| `305850` | Ryoko Natsu | `group_5` | 2 | `vo_char_3058_00_13_hca.hca` | 6.00s | 8.59s | +2.59s |
| `302900` | Masara Kagami | `group_24` | 4 | `vo_char_3029_00_32_hca.hca` | 10.00s | 12.38s | +2.38s |
| `305850` | Ryoko Natsu | `group_11` | 3 | `vo_char_3058_00_19_hca.hca` | 6.30s | 8.64s | +2.34s |
| `390200` | Shi | `group_19` | 4 | `vo_char_3902_00_26_hca.hca` | 9.70s | 11.96s | +2.26s |
| `102800` | Himena Aika | `group_23` | 6 | `vo_char_1028_00_30_hca.hca` | 10.70s | 12.88s | +2.18s |
| `402150` | Tart | `group_14` | 5 | `vo_char_4021_00_22_hca.hca` | 19.70s | 21.86s | +2.16s |
| `200100` | Madoka Kaname | `group_34` | 3 | `vo_char_2001_00_42_hca.hca` | 1.00s | 3.13s | +2.13s |
| `304800` | Hotaru Yura | `group_1` | 18 | `vo_char_3048_00_01_hca.hca` | 47.30s | 49.29s | +1.99s |
| `103600` | Urara Yume | `group_23` | 7 | `vo_char_1036_00_30_hca.hca` | 11.20s | 13.02s | +1.82s |
| `121600` | Kanagi Izumi | `group_23` | 4 | `vo_char_1216_00_30_hca.hca` | 16.00s | 17.81s | +1.81s |
| `302900` | Masara Kagami | `group_2` | 2 | `vo_char_3029_00_03_hca.hca` | 3.00s | 4.80s | +1.80s |
| `302950` | Masara Kagami | `group_2` | 2 | `vo_char_3029_00_03_hca.hca` | 3.00s | 4.80s | +1.80s |
| `303300` | Sayuki Fumino | `group_42` | 2 | `vo_char_3033_00_65_hca.hca` | 2.00s | 3.75s | +1.75s |
| `390201` | Shi | `group_19` | 4 | `vo_char_3902_01_26_hca.hca` | 13.50s | 15.23s | +1.73s |
| `390200` | Shi | `group_8` | 4 | `vo_char_3902_00_15_hca.hca` | 4.50s | 6.07s | +1.57s |
| `302300` | Aimi Eri | `group_15` | 8 | `vo_char_3023_00_23_hca.hca` | 16.30s | 17.71s | +1.41s |
| `303300` | Sayuki Fumino | `group_41` | 3 | `vo_char_3033_00_64_hca.hca` | 5.50s | 6.75s | +1.25s |
| `303350` | Sayuki Fumino | `group_41` | 2 | `vo_char_3033_00_64_hca.hca` | 5.50s | 6.75s | +1.25s |
| `100700` | Touka Satomi | `group_21` | 8 | `vo_char_1007_00_28_hca.hca` | 22.60s | 23.83s | +1.23s |
| `200100` | Madoka Kaname | `group_17` | 7 | `vo_char_2001_00_25_hca.hca` | 13.00s | 14.21s | +1.21s |
| `402650` | Elisa | `group_2` | 5 | `vo_char_4026_00_02_hca.hca` | 11.70s | 12.89s | +1.19s |
| `305251` | Ashley Taylor | `group_3` | 2 | `vo_char_3052_00_04_hca.hca` | 5.50s | 6.64s | +1.14s |
| `120100` | Iroha-chan | `group_13` | 2 | `vo_char_1201_00_20_hca.hca` | 3.90s | 5.02s | +1.12s |
| `100900` | Rena Minami | `group_38` | 3 | `vo_char_1009_00_46_hca.hca` | 1.00s | 2.11s | +1.11s |
| `100950` | Rena Minami | `group_38` | 2 | `vo_char_1009_00_46_hca.hca` | 1.00s | 2.11s | +1.11s |
| `100951` | Rena Minami | `group_38` | 2 | `vo_char_1009_00_46_hca.hca` | 1.00s | 2.11s | +1.11s |
| `390201` | Shi | `group_8` | 3 | `vo_char_3902_00_15_hca.hca` | 5.00s | 6.07s | +1.07s |
| `304800` | Hotaru Yura | `group_14` | 6 | `vo_char_3048_00_21_hca.hca` | 16.00s | 17.03s | +1.03s |
| `305100` | Jun Kazari | `group_27` | 5 | `vo_char_3051_00_34_hca.hca` | 10.00s | 11.02s | +1.02s |
| `111801` | Amane Sisters | `group_27` | 4 | `vo_char_1118_01_34_hca.hca` | 12.30s | 13.31s | +1.01s |
| `304800` | Hotaru Yura | `group_18` | 7 | `vo_char_3048_00_25_hca.hca` | 22.50s | 23.49s | +0.99s |
| `305251` | Ashley Taylor | `group_8` | 2 | `vo_char_3052_00_16_hca.hca` | 11.50s | 12.48s | +0.98s |
| `104600` | Chizuru | `group_23` | 6 | `vo_char_1046_00_30_hca.hca` | 10.80s | 11.75s | +0.95s |
| `110800` | Holy Alina | `group_16` | 6 | `vo_char_1108_00_23_hca.hca` | 21.00s | 21.90s | +0.90s |
| `302950` | Masara Kagami | `group_12` | 3 | `vo_char_3029_00_20_hca.hca` | 6.50s | 7.40s | +0.90s |
| `305251` | Ashley Taylor | `group_9` | 4 | `vo_char_3052_00_17_hca.hca` | 13.50s | 14.40s | +0.90s |
| `110401` | Uwasa Sana | `group_32` | 4 | `vo_char_1104_01_39_hca.hca` | 17.50s | 18.39s | +0.89s |
| `111802` | Amane Sisters | `group_27` | 6 | `vo_char_1118_02_34_hca.hca` | 14.00s | 14.87s | +0.87s |
| `130102` | Iroha & Yachiyo | `group_34` | 6 | `vo_char_1301_02_41_hca.hca` | 12.80s | 13.67s | +0.87s |
| `305850` | Ryoko Natsu | `group_8` | 2 | `vo_char_3058_00_16_hca.hca` | 11.50s | 12.37s | +0.87s |
| `102200` | Hikaru Kirari | `group_15` | 9 | `vo_char_1022_00_22_hca.hca` | 14.70s | 15.56s | +0.86s |
| `102250` | Hikaru Kirari | `group_15` | 8 | `vo_char_1022_00_22_hca.hca` | 14.70s | 15.56s | +0.86s |
| `111600` | Kanagi Izumi | `group_16` | 4 | `vo_char_1116_00_23_hca.hca` | 18.50s | 19.36s | +0.86s |
| `104100` | Livia Medeiros | `group_28` | 8 | `vo_char_1041_00_35_hca.hca` | 13.50s | 14.35s | +0.85s |
| `200700` | Nagisa Momoe | `group_12` | 3 | `vo_char_2007_00_19_hca.hca` | 5.00s | 5.84s | +0.84s |
| `304800` | Hotaru Yura | `group_26` | 5 | `vo_char_3048_00_33_hca.hca` | 25.50s | 26.33s | +0.83s |
| `302100` | Sakuya Suzuka | `group_32` | 9 | `vo_char_3021_00_39_hca.hca` | 17.70s | 18.51s | +0.81s |
| `303300` | Sayuki Fumino | `group_40` | 2 | `vo_char_3033_00_63_hca.hca` | 3.00s | 3.80s | +0.80s |
| `302100` | Sakuya Suzuka | `group_33` | 6 | `vo_char_3021_00_40_hca.hca` | 12.60s | 13.39s | +0.79s |
| `302100` | Sakuya Suzuka | `group_22` | 6 | `vo_char_3021_00_29_hca.hca` | 12.00s | 12.78s | +0.78s |
| `302100` | Sakuya Suzuka | `group_23` | 5 | `vo_char_3021_00_30_hca.hca` | 12.00s | 12.77s | +0.77s |
| `300500` | Nanaka Tokiwa | `group_1` | 10 | `vo_char_3005_00_01_hca.hca` | 23.00s | 23.75s | +0.75s |
| `110401` | Uwasa Sana | `group_20` | 4 | `vo_char_1104_01_27_hca.hca` | 14.50s | 15.23s | +0.73s |
| `104100` | Livia Medeiros | `group_29` | 8 | `vo_char_1041_00_36_hca.hca` | 13.30s | 14.00s | +0.70s |
| `200700` | Nagisa Momoe | `group_30` | 4 | `vo_char_2007_00_37_hca.hca` | 12.80s | 13.50s | +0.70s |
| `111000` | Momoko Togame | `group_26` | 4 | `vo_char_1110_00_33_hca.hca` | 11.40s | 12.09s | +0.69s |
| `130100` | Iroha & Yachiyo | `group_19` | 5 | `vo_char_1301_00_26_hca.hca` | 10.20s | 10.89s | +0.69s |
| `390201` | Shi | `group_4` | 2 | `vo_char_3902_00_04_hca.hca` | 7.70s | 8.37s | +0.67s |
| `110401` | Uwasa Sana | `group_21` | 5 | `vo_char_1104_01_28_hca.hca` | 14.00s | 14.66s | +0.66s |
| `301700` | Yukika Nanase | `group_11` | 5 | `vo_char_3017_00_18_hca.hca` | 15.70s | 16.36s | +0.66s |
| `101700` | Mitama Yakumo | `group_70` | 5 | `vo_game_1102_12_hca.hca` | 13.40s | 14.05s | +0.65s |
| `102400` | Juri Oba | `group_45` | 7 | `vo_game_0502_09_hca.hca` | 18.30s | 18.95s | +0.65s |
| `302100` | Sakuya Suzuka | `group_26` | 6 | `vo_char_3021_00_33_hca.hca` | 11.30s | 11.95s | +0.65s |
| `302100` | Sakuya Suzuka | `group_30` | 4 | `vo_char_3021_00_37_hca.hca` | 11.20s | 11.85s | +0.65s |
| `304800` | Hotaru Yura | `group_16` | 6 | `vo_char_3048_00_23_hca.hca` | 25.00s | 25.64s | +0.64s |
| `100850` | Alina Gray | `group_22` | 7 | `vo_char_1008_50_30_hca.hca` | 12.70s | 13.33s | +0.63s |
| `101850` | Tsukuyo Amane | `group_31` | 6 | `vo_char_1018_50_39_hca.hca` | 18.00s | 18.61s | +0.61s |
| `110400` | Uwasa Sana | `group_10` | 5 | `vo_char_1104_00_17_hca.hca` | 13.10s | 13.71s | +0.61s |
| `121700` | Mitama Yakumo | `group_18` | 4 | `vo_char_1217_00_25_hca.hca` | 17.20s | 17.81s | +0.61s |
| `101450` | Nemu Hiiragi | `group_29` | 5 | `vo_char_1014_50_36_hca.hca` | 17.00s | 17.60s | +0.60s |
| `110100` | Iroha Tamaki | `group_9` | 6 | `vo_char_1101_00_17_hca.hca` | 10.00s | 10.60s | +0.60s |
| `120901` | Rena & Kaede | `group_20` | 6 | `vo_char_1209_01_27_hca.hca` | 14.00s | 14.60s | +0.60s |
| `130100` | Iroha & Yachiyo | `group_30` | 6 | `vo_char_1301_00_37_hca.hca` | 11.10s | 11.70s | +0.60s |
| `302100` | Sakuya Suzuka | `group_21` | 8 | `vo_char_3021_00_28_hca.hca` | 17.60s | 18.20s | +0.60s |
| `302900` | Masara Kagami | `group_1` | 5 | `vo_char_3029_00_01_hca.hca` | 27.50s | 28.10s | +0.60s |
| `302950` | Masara Kagami | `group_1` | 5 | `vo_char_3029_00_01_hca.hca` | 27.50s | 28.10s | +0.60s |
| `100700` | Touka Satomi | `group_29` | 6 | `vo_char_1007_00_36_hca.hca` | 11.00s | 11.59s | +0.59s |
| `301700` | Yukika Nanase | `group_25` | 3 | `vo_char_3017_00_32_hca.hca` | 11.40s | 11.99s | +0.59s |
| `405300` | Hayate Yagami | `group_29` | 7 | `vo_char_4053_00_36_hca.hca` | 11.00s | 11.59s | +0.59s |
| `110100` | Iroha Tamaki | `group_42` | 3 | `vo_char_1101_00_66_hca.hca` | 3.70s | 4.28s | +0.58s |
| `130100` | Iroha & Yachiyo | `group_34` | 8 | `vo_char_1301_00_41_hca.hca` | 12.80s | 13.38s | +0.58s |
| `105300` | Amaryllis | `group_16` | 8 | `vo_char_1053_00_23_hca.hca` | 18.20s | 18.77s | +0.57s |
| `105302` | Amaryllis | `group_16` | 7 | `vo_char_1053_00_23_hca.hca` | 18.20s | 18.77s | +0.57s |
| `301950` | Ayaka Mariko | `group_33` | 6 | `vo_char_3019_50_41_hca.hca` | 12.80s | 13.36s | +0.56s |
| `302100` | Sakuya Suzuka | `group_18` | 6 | `vo_char_3021_00_25_hca.hca` | 10.40s | 10.96s | +0.56s |
| `302950` | Masara Kagami | `group_7` | 3 | `vo_char_3029_00_15_hca.hca` | 4.00s | 4.56s | +0.56s |
| `303300` | Sayuki Fumino | `group_43` | 3 | `vo_char_3033_00_66_hca.hca` | 5.00s | 5.56s | +0.56s |
| `303350` | Sayuki Fumino | `group_43` | 2 | `vo_char_3033_00_66_hca.hca` | 5.00s | 5.56s | +0.56s |
| `402100` | Tart | `group_25` | 5 | `vo_char_4021_00_33_hca.hca` | 10.20s | 10.76s | +0.56s |
| `200700` | Nagisa Momoe | `group_4` | 3 | `vo_char_2007_00_04_hca.hca` | 6.30s | 6.85s | +0.55s |
| `302700` | Hazuki Yusa | `group_33` | 6 | `vo_char_3027_00_41_hca.hca` | 12.00s | 12.55s | +0.55s |
| `100700` | Touka Satomi | `group_26` | 5 | `vo_char_1007_00_33_hca.hca` | 10.80s | 11.34s | +0.54s |
| `101750` | Mitama Yakumo | `group_52` | 7 | `vo_game_1002_12_hca.hca` | 14.70s | 15.24s | +0.54s |
| `102200` | Hikaru Kirari | `group_42` | 4 | `vo_game_0302_03_hca.hca` | 6.60s | 7.14s | +0.54s |
| `102250` | Hikaru Kirari | `group_42` | 3 | `vo_game_0302_03_hca.hca` | 6.60s | 7.14s | +0.54s |
| `300400` | Sasara Minagi | `group_13` | 8 | `vo_char_3004_00_21_hca.hca` | 12.00s | 12.54s | +0.54s |
| `350402` | Masara & Kokoro | `group_28` | 8 | `vo_char_3504_02_35_hca.hca` | 17.20s | 17.74s | +0.54s |
| `404600` | Shinobu Oshino | `group_30` | 2 | `vo_char_4046_00_37_hca.hca` | 10.00s | 10.54s | +0.54s |
| `405300` | Hayate Yagami | `group_33` | 6 | `vo_char_4053_00_40_hca.hca` | 15.50s | 16.04s | +0.54s |
| `300850` | Akira Shinobu | `group_31` | 7 | `vo_char_3008_50_39_hca.hca` | 15.10s | 15.63s | +0.53s |
| `304650` | Ryo Midori | `group_26` | 7 | `vo_char_3046_50_33_hca.hca` | 13.70s | 14.23s | +0.53s |
| `304800` | Hotaru Yura | `group_38` | 3 | `vo_char_3048_00_45_hca.hca` | 4.10s | 4.63s | +0.53s |
| `101700` | Mitama Yakumo | `group_56` | 4 | `vo_game_0902_04_hca.hca` | 6.70s | 7.22s | +0.52s |
| `104100` | Livia Medeiros | `group_25` | 7 | `vo_char_1041_00_32_hca.hca` | 11.80s | 12.32s | +0.52s |
| `110100` | Iroha Tamaki | `group_22` | 4 | `vo_char_1101_00_30_hca.hca` | 11.00s | 11.52s | +0.52s |
| `120902` | Rena & Kaede | `group_31` | 6 | `vo_char_1209_02_38_hca.hca` | 14.00s | 14.52s | +0.52s |
| `301700` | Yukika Nanase | `group_15` | 8 | `vo_char_3017_00_22_hca.hca` | 18.70s | 19.22s | +0.52s |
| `105302` | Amaryllis | `group_11` | 4 | `vo_char_1053_00_18_hca.hca` | 12.40s | 12.91s | +0.51s |
| `300250` | Natsuki Utsuho | `group_18` | 5 | `vo_char_3002_50_26_hca.hca` | 13.10s | 13.61s | +0.51s |
| `301150` | Kako Natsume | `group_33` | 8 | `vo_char_3011_50_41_hca.hca` | 15.50s | 16.01s | +0.51s |
| `111000` | Momoko Togame | `group_15` | 6 | `vo_char_1110_00_22_hca.hca` | 16.40s | 16.90s | +0.50s |
| `200700` | Nagisa Momoe | `group_21` | 6 | `vo_char_2007_00_28_hca.hca` | 11.90s | 12.40s | +0.50s |
| `200700` | Nagisa Momoe | `group_26` | 9 | `vo_char_2007_00_33_hca.hca` | 13.10s | 13.60s | +0.50s |
| `301700` | Yukika Nanase | `group_21` | 5 | `vo_char_3017_00_28_hca.hca` | 11.40s | 11.90s | +0.50s |
| `302100` | Sakuya Suzuka | `group_1` | 8 | `vo_char_3021_00_01_hca.hca` | 25.70s | 26.20s | +0.50s |
| `302100` | Sakuya Suzuka | `group_19` | 5 | `vo_char_3021_00_26_hca.hca` | 14.50s | 15.00s | +0.50s |
| `304800` | Hotaru Yura | `group_27` | 6 | `vo_char_3048_00_34_hca.hca` | 17.50s | 18.00s | +0.50s |
| `402200` | Riz | `group_32` | 5 | `vo_char_4022_00_40_hca.hca` | 15.50s | 16.00s | +0.50s |
| `101200` | Karin Misono | `group_16` | 5 | `vo_char_1012_00_24_hca.hca` | 12.00s | 12.48s | +0.48s |
| `101450` | Nemu Hiiragi | `group_31` | 7 | `vo_char_1014_50_38_hca.hca` | 17.60s | 18.08s | +0.48s |
| `301900` | Ayaka Mariko | `group_1` | 9 | `vo_char_3019_00_01_hca.hca` | 20.00s | 20.48s | +0.48s |
| `301950` | Ayaka Mariko | `group_1` | 7 | `vo_char_3019_00_01_hca.hca` | 20.00s | 20.48s | +0.48s |
| `302100` | Sakuya Suzuka | `group_2` | 6 | `vo_char_3021_00_02_hca.hca` | 12.90s | 13.38s | +0.48s |
| `103200` | Miyuri Yukari | `group_1` | 8 | `vo_char_1032_00_01_hca.hca` | 32.00s | 32.47s | +0.47s |
| `103350` | Rabi Himuro | `group_34` | 6 | `vo_char_1033_50_41_hca.hca` | 16.30s | 16.77s | +0.47s |
| `110400` | Uwasa Sana | `group_2` | 6 | `vo_char_1104_00_02_hca.hca` | 13.50s | 13.97s | +0.47s |
| `305850` | Ryoko Natsu | `group_9` | 4 | `vo_char_3058_00_17_hca.hca` | 13.50s | 13.97s | +0.47s |
| `390200` | Shi | `group_4` | 2 | `vo_char_3902_00_04_hca.hca` | 7.90s | 8.37s | +0.47s |
| `102200` | Hikaru Kirari | `group_16` | 5 | `vo_char_1022_00_23_hca.hca` | 15.10s | 15.56s | +0.46s |
| `102250` | Hikaru Kirari | `group_16` | 5 | `vo_char_1022_00_23_hca.hca` | 15.10s | 15.56s | +0.46s |
| `111000` | Momoko Togame | `group_23` | 6 | `vo_char_1110_00_30_hca.hca` | 13.60s | 14.06s | +0.46s |
| `130100` | Iroha & Yachiyo | `group_37` | 5 | `vo_char_1301_00_44_hca.hca` | 4.10s | 4.56s | +0.46s |
| `130101` | Iroha & Yachiyo | `group_37` | 5 | `vo_char_1301_00_44_hca.hca` | 4.10s | 4.56s | +0.46s |
| `130102` | Iroha & Yachiyo | `group_37` | 5 | `vo_char_1301_00_44_hca.hca` | 4.10s | 4.56s | +0.46s |
| `300400` | Sasara Minagi | `group_1` | 11 | `vo_char_3004_00_01_hca.hca` | 20.00s | 20.46s | +0.46s |
| `303100` | Rika Ayano | `group_29` | 7 | `vo_char_3031_00_37_hca.hca` | 10.00s | 10.46s | +0.46s |
| `303300` | Sayuki Fumino | `group_1` | 14 | `vo_char_3033_00_01_hca.hca` | 31.60s | 32.06s | +0.46s |
| `303350` | Sayuki Fumino | `group_1` | 13 | `vo_char_3033_00_01_hca.hca` | 31.60s | 32.06s | +0.46s |
| `390201` | Shi | `group_28` | 6 | `vo_char_3902_01_35_hca.hca` | 13.80s | 14.26s | +0.46s |
| `130101` | Iroha & Yachiyo | `group_23` | 6 | `vo_char_1301_01_30_hca.hca` | 11.30s | 11.75s | +0.45s |
| `300700` | Shizuku Hozumi | `group_30` | 8 | `vo_char_3007_00_38_hca.hca` | 12.00s | 12.45s | +0.45s |
| `301150` | Kako Natsume | `group_22` | 5 | `vo_char_3011_50_30_hca.hca` | 14.60s | 15.05s | +0.45s |
| `302950` | Masara Kagami | `group_36` | 2 | `vo_char_3029_00_44_hca.hca` | 3.00s | 3.45s | +0.45s |
| `303551` | Riko Chiaki | `group_21` | 12 | `vo_char_3035_51_29_hca.hca` | 16.70s | 17.15s | +0.45s |
| `101400` | Nemu Hiiragi | `group_27` | 5 | `vo_char_1014_00_34_hca.hca` | 15.40s | 15.84s | +0.44s |
| `102850` | Himena Aika | `group_34` | 5 | `vo_char_1028_50_41_hca.hca` | 18.20s | 18.64s | +0.44s |
| `200700` | Nagisa Momoe | `group_3` | 3 | `vo_char_2007_00_03_hca.hca` | 5.00s | 5.44s | +0.44s |
| `302100` | Sakuya Suzuka | `group_20` | 5 | `vo_char_3021_00_27_hca.hca` | 11.10s | 11.54s | +0.44s |
| `130100` | Iroha & Yachiyo | `group_16` | 9 | `vo_char_1301_00_23_hca.hca` | 16.20s | 16.63s | +0.43s |
| `130100` | Iroha & Yachiyo | `group_18` | 8 | `vo_char_1301_00_25_hca.hca` | 14.10s | 14.53s | +0.43s |
| `130100` | Iroha & Yachiyo | `group_21` | 7 | `vo_char_1301_00_28_hca.hca` | 22.60s | 23.03s | +0.43s |
| `130100` | Iroha & Yachiyo | `group_35` | 3 | `vo_char_1301_00_42_hca.hca` | 5.00s | 5.43s | +0.43s |
| `130101` | Iroha & Yachiyo | `group_16` | 9 | `vo_char_1301_00_23_hca.hca` | 16.20s | 16.63s | +0.43s |
| `130101` | Iroha & Yachiyo | `group_35` | 3 | `vo_char_1301_00_42_hca.hca` | 5.00s | 5.43s | +0.43s |
| `130102` | Iroha & Yachiyo | `group_16` | 9 | `vo_char_1301_00_23_hca.hca` | 16.20s | 16.63s | +0.43s |
| `130102` | Iroha & Yachiyo | `group_35` | 3 | `vo_char_1301_00_42_hca.hca` | 5.00s | 5.43s | +0.43s |
| `200651` | Kyoko Sakura | `group_32` | 4 | `vo_char_2006_51_40_hca.hca` | 11.60s | 12.03s | +0.43s |
| `300351` | Hinano Miyako | `group_31` | 4 | `vo_char_3003_51_39_hca.hca` | 9.50s | 9.93s | +0.43s |
| `302700` | Hazuki Yusa | `group_26` | 6 | `vo_char_3027_00_34_hca.hca` | 15.00s | 15.43s | +0.43s |
| `100351` | Tsuruno Yui | `group_29` | 5 | `vo_char_1003_51_37_hca.hca` | 11.00s | 11.42s | +0.42s |
| `103350` | Rabi Himuro | `group_25` | 5 | `vo_char_1033_50_32_hca.hca` | 16.00s | 16.42s | +0.42s |
| `302100` | Sakuya Suzuka | `group_17` | 5 | `vo_char_3021_00_24_hca.hca` | 12.50s | 12.92s | +0.42s |
| `302100` | Sakuya Suzuka | `group_31` | 6 | `vo_char_3021_00_38_hca.hca` | 10.30s | 10.72s | +0.42s |
| `390200` | Shi | `group_1` | 8 | `vo_char_3902_00_01_hca.hca` | 23.90s | 24.32s | +0.42s |
| `100550` | Felicia Mitsuki | `group_28` | 5 | `vo_char_1005_50_36_hca.hca` | 13.00s | 13.41s | +0.41s |
| `300600` | Emiri Kisaki | `group_1` | 16 | `vo_char_3006_00_01_hca.hca` | 23.20s | 23.61s | +0.41s |
| `300651` | Emiri Kisaki | `group_1` | 14 | `vo_char_3006_00_01_hca.hca` | 23.20s | 23.61s | +0.41s |
| `302100` | Sakuya Suzuka | `group_12` | 3 | `vo_char_3021_00_19_hca.hca` | 5.50s | 5.91s | +0.41s |
| `302300` | Aimi Eri | `group_8` | 9 | `vo_char_3023_00_16_hca.hca` | 10.40s | 10.81s | +0.41s |
| `302900` | Masara Kagami | `group_3` | 2 | `vo_char_3029_00_04_hca.hca` | 5.00s | 5.41s | +0.41s |
| `302950` | Masara Kagami | `group_3` | 2 | `vo_char_3029_00_04_hca.hca` | 5.00s | 5.41s | +0.41s |
| `304650` | Ryo Midori | `group_28` | 7 | `vo_char_3046_50_35_hca.hca` | 11.00s | 11.41s | +0.41s |
| `101951` | Tsukasa Amane | `group_23` | 4 | `vo_char_1019_51_31_hca.hca` | 11.00s | 11.40s | +0.40s |
| `302100` | Sakuya Suzuka | `group_11` | 6 | `vo_char_3021_00_18_hca.hca` | 15.10s | 15.50s | +0.40s |
| `302900` | Masara Kagami | `group_18` | 4 | `vo_char_3029_00_26_hca.hca` | 10.50s | 10.90s | +0.40s |
| `303300` | Sayuki Fumino | `group_28` | 6 | `vo_char_3033_00_35_hca.hca` | 14.00s | 14.40s | +0.40s |
| `304800` | Hotaru Yura | `group_19` | 5 | `vo_char_3048_00_26_hca.hca` | 16.30s | 16.70s | +0.40s |
| `102400` | Juri Oba | `group_44` | 8 | `vo_game_0502_08_hca.hca` | 18.00s | 18.39s | +0.39s |
| `103900` | Sudachi Sawa | `group_22` | 5 | `vo_char_1039_00_29_hca.hca` | 7.80s | 8.19s | +0.39s |
| `110100` | Iroha Tamaki | `group_1` | 9 | `vo_char_1101_00_01_hca.hca` | 21.10s | 21.49s | +0.39s |
| `111000` | Momoko Togame | `group_1` | 9 | `vo_char_1110_00_01_hca.hca` | 27.40s | 27.79s | +0.39s |
| `120900` | Rena & Kaede | `group_29` | 6 | `vo_char_1209_00_36_hca.hca` | 14.20s | 14.59s | +0.39s |
| `301700` | Yukika Nanase | `group_36` | 4 | `vo_char_3017_00_43_hca.hca` | 3.00s | 3.39s | +0.39s |
| `302600` | Konoha Shizumi | `group_14` | 6 | `vo_char_3026_00_22_hca.hca` | 18.00s | 18.39s | +0.39s |
| `100700` | Touka Satomi | `group_19` | 6 | `vo_char_1007_00_26_hca.hca` | 12.00s | 12.38s | +0.38s |
| `101550` | Ui Tamaki | `group_29` | 4 | `vo_char_1015_50_36_hca.hca` | 13.50s | 13.88s | +0.38s |
| `103000` | Hagumu Azumi | `group_32` | 6 | `vo_char_1030_00_39_hca.hca` | 16.00s | 16.38s | +0.38s |
| `103350` | Rabi Himuro | `group_31` | 6 | `vo_char_1033_50_38_hca.hca` | 15.80s | 16.18s | +0.38s |
| `104300` | Kuroe | `group_16` | 8 | `vo_char_1043_00_23_hca.hca` | 20.50s | 20.88s | +0.38s |
| `105302` | Amaryllis | `group_33` | 5 | `vo_char_1053_02_40_hca.hca` | 15.20s | 15.58s | +0.38s |
| `200700` | Nagisa Momoe | `group_23` | 5 | `vo_char_2007_00_30_hca.hca` | 11.50s | 11.88s | +0.38s |
| `300700` | Shizuku Hozumi | `group_33` | 5 | `vo_char_3007_00_41_hca.hca` | 12.50s | 12.88s | +0.38s |
| `302100` | Sakuya Suzuka | `group_34` | 8 | `vo_char_3021_00_41_hca.hca` | 24.00s | 24.38s | +0.38s |
| `304800` | Hotaru Yura | `group_28` | 8 | `vo_char_3048_00_35_hca.hca` | 18.20s | 18.58s | +0.38s |
| `100700` | Touka Satomi | `group_25` | 5 | `vo_char_1007_00_32_hca.hca` | 11.50s | 11.87s | +0.37s |
| `104100` | Livia Medeiros | `group_21` | 4 | `vo_char_1041_00_28_hca.hca` | 12.00s | 12.37s | +0.37s |
| `100800` | Alina Gray | `group_5` | 6 | `vo_char_1008_00_13_hca.hca` | 6.20s | 6.56s | +0.36s |
| `100850` | Alina Gray | `group_5` | 5 | `vo_char_1008_00_13_hca.hca` | 6.20s | 6.56s | +0.36s |
| `101200` | Karin Misono | `group_6` | 5 | `vo_char_1012_00_14_hca.hca` | 5.50s | 5.86s | +0.36s |
| `101250` | Karin Misono | `group_6` | 4 | `vo_char_1012_00_14_hca.hca` | 5.50s | 5.86s | +0.36s |
| `101450` | Nemu Hiiragi | `group_22` | 6 | `vo_char_1014_50_29_hca.hca` | 15.50s | 15.86s | +0.36s |
| `101751` | Mitama Yakumo | `group_49` | 5 | `vo_game_0802_09_hca.hca` | 11.70s | 12.06s | +0.36s |
| `102350` | Ao Kasane | `group_43` | 3 | `vo_game_0402_04_hca.hca` | 9.60s | 9.96s | +0.36s |
| `304750` | Chika Aoba | `group_10` | 3 | `vo_char_3047_00_18_hca.hca` | 13.20s | 13.56s | +0.36s |
| `404400` | Nadeko Sengoku | `group_30` | 2 | `vo_char_4044_00_38_hca.hca` | 10.45s | 10.81s | +0.36s |
| `101400` | Nemu Hiiragi | `group_2` | 4 | `vo_char_1014_00_02_hca.hca` | 14.10s | 14.45s | +0.35s |
| `101450` | Nemu Hiiragi | `group_2` | 4 | `vo_char_1014_00_02_hca.hca` | 14.10s | 14.45s | +0.35s |
| `102100` | Yuna Kureha | `group_43` | 5 | `vo_game_0602_04_hca.hca` | 11.80s | 12.15s | +0.35s |
| `105300` | Amaryllis | `group_3` | 2 | `vo_char_1053_00_03_hca.hca` | 3.10s | 3.45s | +0.35s |
| `105302` | Amaryllis | `group_3` | 2 | `vo_char_1053_00_03_hca.hca` | 3.10s | 3.45s | +0.35s |
| `111000` | Momoko Togame | `group_31` | 6 | `vo_char_1110_00_38_hca.hca` | 13.60s | 13.95s | +0.35s |
| `100650` | Mifuyu Azusa | `group_18` | 5 | `vo_char_1006_50_26_hca.hca` | 13.00s | 13.34s | +0.34s |
| `100900` | Rena Minami | `group_30` | 8 | `vo_char_1009_00_38_hca.hca` | 8.00s | 8.34s | +0.34s |
| `101700` | Mitama Yakumo | `group_65` | 4 | `vo_game_1102_04_hca.hca` | 6.70s | 7.04s | +0.34s |
| `102100` | Yuna Kureha | `group_44` | 7 | `vo_game_0602_08_hca.hca` | 12.70s | 13.04s | +0.34s |
| `102200` | Hikaru Kirari | `group_29` | 6 | `vo_char_1022_00_36_hca.hca` | 10.30s | 10.64s | +0.34s |
| `102200` | Hikaru Kirari | `group_31` | 5 | `vo_char_1022_00_38_hca.hca` | 9.50s | 9.84s | +0.34s |
| `102200` | Hikaru Kirari | `group_47` | 5 | `vo_game_0302_11_hca.hca` | 10.00s | 10.34s | +0.34s |
| `102250` | Hikaru Kirari | `group_47` | 4 | `vo_game_0302_11_hca.hca` | 10.00s | 10.34s | +0.34s |
| `103250` | Miyuri Yukari | `group_22` | 4 | `vo_char_1032_50_29_hca.hca` | 10.80s | 11.14s | +0.34s |
| `103350` | Rabi Himuro | `group_30` | 5 | `vo_char_1033_50_37_hca.hca` | 15.70s | 16.04s | +0.34s |
| `200651` | Kyoko Sakura | `group_28` | 4 | `vo_char_2006_51_36_hca.hca` | 10.10s | 10.44s | +0.34s |
| `220200` | Devil Homura | `group_11` | 5 | `vo_char_2202_00_18_hca.hca` | 13.30s | 13.64s | +0.34s |
| `301400` | Seika Kumi | `group_10` | 5 | `vo_char_3014_00_18_hca.hca` | 13.00s | 13.34s | +0.34s |
| `302900` | Masara Kagami | `group_19` | 4 | `vo_char_3029_00_27_hca.hca` | 12.00s | 12.34s | +0.34s |
| `104100` | Livia Medeiros | `group_16` | 7 | `vo_char_1041_00_23_hca.hca` | 18.90s | 19.23s | +0.33s |
| `111801` | Amane Sisters | `group_34` | 6 | `vo_char_1118_01_41_hca.hca` | 17.50s | 17.83s | +0.33s |
| `390200` | Shi | `group_27` | 6 | `vo_char_3902_00_34_hca.hca` | 17.40s | 17.73s | +0.33s |
| `405300` | Hayate Yagami | `group_11` | 8 | `vo_char_4053_00_18_hca.hca` | 12.00s | 12.33s | +0.33s |
| `100750` | Touka Satomi | `group_29` | 6 | `vo_char_1007_50_36_hca.hca` | 15.00s | 15.32s | +0.32s |
| `101300` | Asuka Tatsuki | `group_15` | 12 | `vo_char_1013_00_23_hca.hca` | 18.00s | 18.32s | +0.32s |
| `102300` | Ao Kasane | `group_47` | 6 | `vo_game_0402_11_hca.hca` | 13.00s | 13.32s | +0.32s |
| `102350` | Ao Kasane | `group_47` | 6 | `vo_game_0402_11_hca.hca` | 13.00s | 13.32s | +0.32s |
| `390200` | Shi | `group_15` | 7 | `vo_char_3902_00_22_hca.hca` | 28.50s | 28.82s | +0.32s |
| `102350` | Ao Kasane | `group_45` | 6 | `vo_game_0402_09_hca.hca` | 11.80s | 12.11s | +0.31s |
| `110400` | Uwasa Sana | `group_31` | 5 | `vo_char_1104_00_38_hca.hca` | 13.30s | 13.61s | +0.31s |
| `404600` | Shinobu Oshino | `group_29` | 4 | `vo_char_4046_00_36_hca.hca` | 9.50s | 9.81s | +0.31s |
| `101300` | Asuka Tatsuki | `group_6` | 5 | `vo_char_1013_00_14_hca.hca` | 4.50s | 4.80s | +0.30s |
| `102200` | Hikaru Kirari | `group_9` | 4 | `vo_char_1022_00_16_hca.hca` | 10.70s | 11.00s | +0.30s |
| `102250` | Hikaru Kirari | `group_9` | 3 | `vo_char_1022_00_16_hca.hca` | 10.70s | 11.00s | +0.30s |
| `104900` | Olga | `group_1` | 10 | `vo_char_1049_00_01_hca.hca` | 23.80s | 24.10s | +0.30s |
| `113300` | Rabi Himuro | `group_15` | 7 | `vo_char_1133_00_22_hca.hca` | 30.10s | 30.40s | +0.30s |
| `303300` | Sayuki Fumino | `group_26` | 5 | `vo_char_3033_00_33_hca.hca` | 15.00s | 15.30s | +0.30s |
| `102200` | Hikaru Kirari | `group_30` | 6 | `vo_char_1022_00_37_hca.hca` | 8.70s | 8.99s | +0.29s |
| `111800` | Amane Sisters | `group_11` | 5 | `vo_char_1118_00_18_hca.hca` | 16.00s | 16.29s | +0.29s |
| `111801` | Amane Sisters | `group_11` | 5 | `vo_char_1118_00_18_hca.hca` | 16.00s | 16.29s | +0.29s |
| `111802` | Amane Sisters | `group_11` | 5 | `vo_char_1118_00_18_hca.hca` | 16.00s | 16.29s | +0.29s |
| `114400` | Uwasa Mikoto | `group_2` | 6 | `vo_char_1144_00_02_hca.hca` | 17.40s | 17.69s | +0.29s |
| `300300` | Hinano Miyako | `group_37` | 3 | `vo_char_3003_00_45_hca.hca` | 2.00s | 2.29s | +0.29s |
| `300351` | Hinano Miyako | `group_37` | 2 | `vo_char_3003_00_45_hca.hca` | 2.00s | 2.29s | +0.29s |
| `302100` | Sakuya Suzuka | `group_13` | 3 | `vo_char_3021_00_20_hca.hca` | 7.20s | 7.49s | +0.29s |
| `303551` | Riko Chiaki | `group_38` | 2 | `vo_char_3035_00_46_hca.hca` | 4.00s | 4.29s | +0.29s |
| `304651` | Ryo Midori | `group_18` | 7 | `vo_char_3046_51_25_hca.hca` | 16.00s | 16.29s | +0.29s |
| `100100` | Iroha Tamaki | `group_38` | 4 | `vo_char_1001_00_46_hca.hca` | 3.50s | 3.78s | +0.28s |
| `100103` | Iroha Tamaki | `group_38` | 4 | `vo_char_1001_00_46_hca.hca` | 3.50s | 3.78s | +0.28s |
| `100150` | Iroha Tamaki | `group_38` | 3 | `vo_char_1001_00_46_hca.hca` | 3.50s | 3.78s | +0.28s |
| `100153` | Iroha Tamaki | `group_38` | 3 | `vo_char_1001_00_46_hca.hca` | 3.50s | 3.78s | +0.28s |
| `103100` | San Kagura | `group_15` | 7 | `vo_char_1031_00_22_hca.hca` | 21.10s | 21.38s | +0.28s |
| `103150` | San Kagura | `group_15` | 6 | `vo_char_1031_00_22_hca.hca` | 21.10s | 21.38s | +0.28s |
| `103550` | Alexandra Kurusu | `group_34` | 7 | `vo_char_1035_50_41_hca.hca` | 17.20s | 17.48s | +0.28s |
| `111000` | Momoko Togame | `group_19` | 8 | `vo_char_1110_00_26_hca.hca` | 13.60s | 13.88s | +0.28s |
| `111000` | Momoko Togame | `group_21` | 8 | `vo_char_1110_00_28_hca.hca` | 14.10s | 14.38s | +0.28s |
| `200900` | Mabayu Aki | `group_22` | 5 | `vo_char_2009_00_29_hca.hca` | 11.90s | 12.18s | +0.28s |
| `240000` | Sayaka Miki | `group_25` | 4 | `vo_char_2400_00_32_hca.hca` | 10.00s | 10.28s | +0.28s |
| `260000` | Kyoko Sakura | `group_22` | 6 | `vo_char_2600_00_29_hca.hca` | 11.70s | 11.98s | +0.28s |
| `300700` | Shizuku Hozumi | `group_17` | 6 | `vo_char_3007_00_25_hca.hca` | 6.70s | 6.98s | +0.28s |
| `301100` | Kako Natsume | `group_23` | 9 | `vo_char_3011_00_31_hca.hca` | 12.00s | 12.28s | +0.28s |
| `302551` | Ren Isuzu | `group_22` | 6 | `vo_char_3025_51_30_hca.hca` | 18.50s | 18.78s | +0.28s |
| `304650` | Ryo Midori | `group_19` | 4 | `vo_char_3046_50_26_hca.hca` | 10.80s | 11.08s | +0.28s |
| `101300` | Asuka Tatsuki | `group_25` | 6 | `vo_char_1013_00_33_hca.hca` | 9.50s | 9.77s | +0.27s |
| `101400` | Nemu Hiiragi | `group_21` | 6 | `vo_char_1014_00_28_hca.hca` | 15.30s | 15.57s | +0.27s |
| `200651` | Kyoko Sakura | `group_21` | 4 | `vo_char_2006_51_29_hca.hca` | 11.70s | 11.97s | +0.27s |
| `200700` | Nagisa Momoe | `group_36` | 5 | `vo_char_2007_00_43_hca.hca` | 4.60s | 4.87s | +0.27s |
| `300300` | Hinano Miyako | `group_39` | 4 | `vo_char_3003_00_63_hca.hca` | 4.00s | 4.27s | +0.27s |
| `300351` | Hinano Miyako | `group_39` | 3 | `vo_char_3003_00_63_hca.hca` | 4.00s | 4.27s | +0.27s |
| `300700` | Shizuku Hozumi | `group_6` | 4 | `vo_char_3007_00_14_hca.hca` | 5.50s | 5.77s | +0.27s |
| `300750` | Shizuku Hozumi | `group_6` | 2 | `vo_char_3007_00_14_hca.hca` | 5.50s | 5.77s | +0.27s |
| `300900` | Manaka Kurumi | `group_12` | 5 | `vo_char_3009_00_20_hca.hca` | 4.50s | 4.77s | +0.27s |
| `301900` | Ayaka Mariko | `group_21` | 5 | `vo_char_3019_00_29_hca.hca` | 10.00s | 10.27s | +0.27s |
| `100700` | Touka Satomi | `group_22` | 4 | `vo_char_1007_00_29_hca.hca` | 11.70s | 11.96s | +0.26s |
| `101300` | Asuka Tatsuki | `group_21` | 7 | `vo_char_1013_00_29_hca.hca` | 11.00s | 11.26s | +0.26s |
| `102200` | Hikaru Kirari | `group_41` | 5 | `vo_game_0302_02_hca.hca` | 6.20s | 6.46s | +0.26s |
| `102250` | Hikaru Kirari | `group_41` | 4 | `vo_game_0302_02_hca.hca` | 6.20s | 6.46s | +0.26s |
| `102850` | Himena Aika | `group_24` | 4 | `vo_char_1028_50_31_hca.hca` | 11.10s | 11.36s | +0.26s |
| `103000` | Hagumu Azumi | `group_38` | 3 | `vo_char_1030_00_45_hca.hca` | 4.20s | 4.46s | +0.26s |
| `103050` | Hagumu Azumi | `group_38` | 2 | `vo_char_1030_00_45_hca.hca` | 4.20s | 4.46s | +0.26s |
| `103350` | Rabi Himuro | `group_18` | 3 | `vo_char_1033_50_25_hca.hca` | 11.10s | 11.36s | +0.26s |
| `104400` | Mikoto Sena | `group_7` | 4 | `vo_char_1044_00_14_hca.hca` | 8.20s | 8.46s | +0.26s |
| `104600` | Chizuru | `group_11` | 5 | `vo_char_1046_00_18_hca.hca` | 11.20s | 11.46s | +0.26s |
| `111000` | Momoko Togame | `group_34` | 5 | `vo_char_1110_00_41_hca.hca` | 15.30s | 15.56s | +0.26s |
| `300400` | Sasara Minagi | `group_33` | 5 | `vo_char_3004_00_41_hca.hca` | 11.50s | 11.76s | +0.26s |
| `300700` | Shizuku Hozumi | `group_14` | 7 | `vo_char_3007_00_22_hca.hca` | 18.50s | 18.76s | +0.26s |
| `300700` | Shizuku Hozumi | `group_25` | 6 | `vo_char_3007_00_33_hca.hca` | 12.50s | 12.76s | +0.26s |
| `300750` | Shizuku Hozumi | `group_14` | 5 | `vo_char_3007_00_22_hca.hca` | 18.50s | 18.76s | +0.26s |
| `303000` | Konomi Haruna | `group_24` | 5 | `vo_char_3030_00_32_hca.hca` | 9.50s | 9.76s | +0.26s |
| `304300` | Eternal Sakura | `group_1` | 8 | `vo_char_3043_00_01_hca.hca` | 38.00s | 38.26s | +0.26s |
| `402700` | Lapin | `group_16` | 4 | `vo_char_4027_00_23_hca.hca` | 16.10s | 16.36s | +0.26s |
| `405300` | Hayate Yagami | `group_28` | 5 | `vo_char_4053_00_35_hca.hca` | 10.50s | 10.76s | +0.26s |
| `100100` | Iroha Tamaki | `group_11` | 4 | `vo_char_1001_00_19_hca.hca` | 5.00s | 5.25s | +0.25s |
| `100103` | Iroha Tamaki | `group_11` | 4 | `vo_char_1001_00_19_hca.hca` | 5.00s | 5.25s | +0.25s |
| `100150` | Iroha Tamaki | `group_11` | 3 | `vo_char_1001_00_19_hca.hca` | 5.00s | 5.25s | +0.25s |
| `100153` | Iroha Tamaki | `group_11` | 3 | `vo_char_1001_00_19_hca.hca` | 5.00s | 5.25s | +0.25s |
| `100900` | Rena Minami | `group_28` | 6 | `vo_char_1009_00_36_hca.hca` | 8.00s | 8.25s | +0.25s |
| `101100` | Kaede Akino | `group_19` | 6 | `vo_char_1011_00_27_hca.hca` | 8.50s | 8.75s | +0.25s |
| `104050` | Yozuru Sasame | `group_27` | 5 | `vo_char_1040_50_34_hca.hca` | 13.20s | 13.45s | +0.25s |
| `111700` | Mitama Yakumo | `group_50` | 6 | `vo_game_0102_10_hca.hca` | 13.30s | 13.55s | +0.25s |
| `300700` | Shizuku Hozumi | `group_13` | 8 | `vo_char_3007_00_21_hca.hca` | 12.50s | 12.75s | +0.25s |
| `300750` | Shizuku Hozumi | `group_13` | 6 | `vo_char_3007_00_21_hca.hca` | 12.50s | 12.75s | +0.25s |
| `300800` | Akira Shinobu | `group_22` | 9 | `vo_char_3008_00_30_hca.hca` | 11.00s | 11.25s | +0.25s |
| `300900` | Manaka Kurumi | `group_16` | 5 | `vo_char_3009_00_24_hca.hca` | 10.00s | 10.25s | +0.25s |
| `303100` | Rika Ayano | `group_40` | 4 | `vo_char_3031_00_64_hca.hca` | 3.00s | 3.25s | +0.25s |
| `402100` | Tart | `group_28` | 5 | `vo_char_4021_00_36_hca.hca` | 10.50s | 10.75s | +0.25s |
| `101150` | Kaede Akino | `group_32` | 5 | `vo_char_1011_50_40_hca.hca` | 12.50s | 12.74s | +0.24s |
| `101700` | Mitama Yakumo | `group_52` | 6 | `vo_game_0702_12_hca.hca` | 11.50s | 11.74s | +0.24s |
| `102200` | Hikaru Kirari | `group_46` | 5 | `vo_game_0302_10_hca.hca` | 9.10s | 9.34s | +0.24s |
| `102250` | Hikaru Kirari | `group_46` | 4 | `vo_game_0302_10_hca.hca` | 9.10s | 9.34s | +0.24s |
| `102400` | Juri Oba | `group_46` | 5 | `vo_game_0502_10_hca.hca` | 11.20s | 11.44s | +0.24s |
| `102800` | Himena Aika | `group_2` | 7 | `vo_char_1028_00_02_hca.hca` | 13.70s | 13.94s | +0.24s |
| `102850` | Himena Aika | `group_2` | 6 | `vo_char_1028_00_02_hca.hca` | 13.70s | 13.94s | +0.24s |
| `103600` | Urara Yume | `group_30` | 6 | `vo_char_1036_00_37_hca.hca` | 11.40s | 11.64s | +0.24s |
| `104600` | Chizuru | `group_10` | 5 | `vo_char_1046_00_17_hca.hca` | 10.80s | 11.04s | +0.24s |
| `105302` | Amaryllis | `group_25` | 4 | `vo_char_1053_02_32_hca.hca` | 14.80s | 15.04s | +0.24s |
| `105302` | Amaryllis | `group_9` | 4 | `vo_char_1053_00_16_hca.hca` | 10.50s | 10.74s | +0.24s |
| `110500` | Felicia-chan | `group_20` | 3 | `vo_char_1105_00_27_hca.hca` | 11.70s | 11.94s | +0.24s |
| `111600` | Kanagi Izumi | `group_28` | 9 | `vo_char_1116_00_35_hca.hca` | 17.80s | 18.04s | +0.24s |
| `220200` | Devil Homura | `group_17` | 5 | `vo_char_2202_00_24_hca.hca` | 14.00s | 14.24s | +0.24s |
| `220200` | Devil Homura | `group_18` | 5 | `vo_char_2202_00_25_hca.hca` | 14.50s | 14.74s | +0.24s |
| `300700` | Shizuku Hozumi | `group_18` | 5 | `vo_char_3007_00_26_hca.hca` | 6.50s | 6.74s | +0.24s |
| `300800` | Akira Shinobu | `group_29` | 8 | `vo_char_3008_00_37_hca.hca` | 10.50s | 10.74s | +0.24s |
| `301100` | Kako Natsume | `group_9` | 5 | `vo_char_3011_00_17_hca.hca` | 11.00s | 11.24s | +0.24s |
| `301150` | Kako Natsume | `group_9` | 3 | `vo_char_3011_00_17_hca.hca` | 11.00s | 11.24s | +0.24s |
| `301151` | Kako Natsume | `group_9` | 3 | `vo_char_3011_00_17_hca.hca` | 11.00s | 11.24s | +0.24s |
| `301950` | Ayaka Mariko | `group_20` | 4 | `vo_char_3019_50_28_hca.hca` | 11.60s | 11.84s | +0.24s |
| `100100` | Iroha Tamaki | `group_17` | 9 | `vo_char_1001_00_25_hca.hca` | 11.50s | 11.73s | +0.23s |
| `101000` | Momoko Togame | `group_14` | 7 | `vo_char_1010_00_22_hca.hca` | 16.00s | 16.23s | +0.23s |
| `101051` | Momoko Togame | `group_14` | 6 | `vo_char_1010_00_22_hca.hca` | 16.00s | 16.23s | +0.23s |
| `104100` | Livia Medeiros | `group_30` | 4 | `vo_char_1041_00_37_hca.hca` | 12.20s | 12.43s | +0.23s |
| `200200` | Homura Akemi | `group_1` | 5 | `vo_char_2002_00_01_hca.hca` | 25.55s | 25.78s | +0.23s |
| `300750` | Shizuku Hozumi | `group_33` | 4 | `vo_char_3007_50_41_hca.hca` | 12.40s | 12.63s | +0.23s |
| `301100` | Kako Natsume | `group_8` | 5 | `vo_char_3011_00_16_hca.hca` | 12.50s | 12.73s | +0.23s |
| `301150` | Kako Natsume | `group_8` | 3 | `vo_char_3011_00_16_hca.hca` | 12.50s | 12.73s | +0.23s |
| `301151` | Kako Natsume | `group_8` | 3 | `vo_char_3011_00_16_hca.hca` | 12.50s | 12.73s | +0.23s |
| `301900` | Ayaka Mariko | `group_28` | 5 | `vo_char_3019_00_36_hca.hca` | 10.00s | 10.23s | +0.23s |
| `302300` | Aimi Eri | `group_27` | 5 | `vo_char_3023_00_35_hca.hca` | 11.00s | 11.23s | +0.23s |
| `304300` | Eternal Sakura | `group_2` | 5 | `vo_char_3043_00_02_hca.hca` | 19.50s | 19.73s | +0.23s |
| `350400` | Masara & Kokoro | `group_34` | 8 | `vo_char_3504_00_41_hca.hca` | 15.70s | 15.93s | +0.23s |
| `400100` | Oriko Mikuni | `group_18` | 10 | `vo_char_4001_00_26_hca.hca` | 11.50s | 11.73s | +0.23s |
| `100100` | Iroha Tamaki | `group_23` | 6 | `vo_char_1001_00_31_hca.hca` | 12.00s | 12.22s | +0.22s |
| `100100` | Iroha Tamaki | `group_6` | 4 | `vo_char_1001_00_14_hca.hca` | 6.00s | 6.22s | +0.22s |
| `100103` | Iroha Tamaki | `group_6` | 4 | `vo_char_1001_00_14_hca.hca` | 6.00s | 6.22s | +0.22s |
| `100150` | Iroha Tamaki | `group_6` | 3 | `vo_char_1001_00_14_hca.hca` | 6.00s | 6.22s | +0.22s |
| `100153` | Iroha Tamaki | `group_6` | 3 | `vo_char_1001_00_14_hca.hca` | 6.00s | 6.22s | +0.22s |
| `100850` | Alina Gray | `group_17` | 9 | `vo_char_1008_50_25_hca.hca` | 16.50s | 16.72s | +0.22s |
| `101450` | Nemu Hiiragi | `group_30` | 6 | `vo_char_1014_50_37_hca.hca` | 14.20s | 14.42s | +0.22s |
| `101951` | Tsukasa Amane | `group_16` | 4 | `vo_char_1019_51_24_hca.hca` | 7.70s | 7.92s | +0.22s |
| `102200` | Hikaru Kirari | `group_19` | 4 | `vo_char_1022_00_26_hca.hca` | 9.20s | 9.42s | +0.22s |
| `102200` | Hikaru Kirari | `group_24` | 4 | `vo_char_1022_00_31_hca.hca` | 10.60s | 10.82s | +0.22s |
| `103350` | Rabi Himuro | `group_29` | 7 | `vo_char_1033_50_36_hca.hca` | 16.20s | 16.42s | +0.22s |
| `103550` | Alexandra Kurusu | `group_22` | 4 | `vo_char_1035_50_29_hca.hca` | 12.40s | 12.62s | +0.22s |
| `300600` | Emiri Kisaki | `group_29` | 6 | `vo_char_3006_00_37_hca.hca` | 13.00s | 13.22s | +0.22s |
| `300800` | Akira Shinobu | `group_27` | 8 | `vo_char_3008_00_35_hca.hca` | 9.50s | 9.72s | +0.22s |
| `300900` | Manaka Kurumi | `group_33` | 5 | `vo_char_3009_00_41_hca.hca` | 9.50s | 9.72s | +0.22s |
| `300900` | Manaka Kurumi | `group_4` | 4 | `vo_char_3009_00_05_hca.hca` | 5.50s | 5.72s | +0.22s |
| `302900` | Masara Kagami | `group_14` | 6 | `vo_char_3029_00_22_hca.hca` | 21.00s | 21.22s | +0.22s |
| `304800` | Hotaru Yura | `group_33` | 7 | `vo_char_3048_00_40_hca.hca` | 18.30s | 18.52s | +0.22s |
| `305251` | Ashley Taylor | `group_29` | 8 | `vo_char_3052_51_37_hca.hca` | 16.00s | 16.22s | +0.22s |
| `404400` | Nadeko Sengoku | `group_6` | 2 | `vo_char_4044_00_14_hca.hca` | 8.65s | 8.87s | +0.22s |
| `101400` | Nemu Hiiragi | `group_1` | 8 | `vo_char_1014_00_01_hca.hca` | 32.00s | 32.21s | +0.21s |
| `101450` | Nemu Hiiragi | `group_1` | 8 | `vo_char_1014_00_01_hca.hca` | 32.00s | 32.21s | +0.21s |
| `102200` | Hikaru Kirari | `group_14` | 4 | `vo_char_1022_00_21_hca.hca` | 8.80s | 9.01s | +0.21s |
| `102250` | Hikaru Kirari | `group_14` | 3 | `vo_char_1022_00_21_hca.hca` | 8.80s | 9.01s | +0.21s |
| `103550` | Alexandra Kurusu | `group_29` | 5 | `vo_char_1035_50_36_hca.hca` | 12.30s | 12.51s | +0.21s |
| `104100` | Livia Medeiros | `group_32` | 7 | `vo_char_1041_00_39_hca.hca` | 14.70s | 14.91s | +0.21s |
| `111201` | Karin & Alina | `group_17` | 5 | `vo_char_1112_01_24_hca.hca` | 11.30s | 11.51s | +0.21s |
| `111801` | Amane Sisters | `group_32` | 4 | `vo_char_1118_01_39_hca.hca` | 13.60s | 13.81s | +0.21s |
| `120902` | Rena & Kaede | `group_24` | 7 | `vo_char_1209_02_31_hca.hca` | 19.00s | 19.21s | +0.21s |
| `200651` | Kyoko Sakura | `group_26` | 6 | `vo_char_2006_51_34_hca.hca` | 14.20s | 14.41s | +0.21s |
| `220200` | Devil Homura | `group_34` | 4 | `vo_char_2202_00_41_hca.hca` | 12.00s | 12.21s | +0.21s |
| `260000` | Kyoko Sakura | `group_32` | 5 | `vo_char_2600_00_39_hca.hca` | 13.00s | 13.21s | +0.21s |
| `300400` | Sasara Minagi | `group_15` | 9 | `vo_char_3004_00_23_hca.hca` | 19.50s | 19.71s | +0.21s |
| `300750` | Shizuku Hozumi | `group_9` | 2 | `vo_char_3007_00_17_hca.hca` | 8.00s | 8.21s | +0.21s |
| `300800` | Akira Shinobu | `group_8` | 8 | `vo_char_3008_00_16_hca.hca` | 12.00s | 12.21s | +0.21s |
| `300850` | Akira Shinobu | `group_8` | 5 | `vo_char_3008_00_16_hca.hca` | 12.00s | 12.21s | +0.21s |
| `300900` | Manaka Kurumi | `group_31` | 6 | `vo_char_3009_00_39_hca.hca` | 10.00s | 10.21s | +0.21s |
| `301100` | Kako Natsume | `group_1` | 13 | `vo_char_3011_00_01_hca.hca` | 24.00s | 24.21s | +0.21s |
| `301150` | Kako Natsume | `group_1` | 11 | `vo_char_3011_00_01_hca.hca` | 24.00s | 24.21s | +0.21s |
| `301151` | Kako Natsume | `group_1` | 11 | `vo_char_3011_00_01_hca.hca` | 24.00s | 24.21s | +0.21s |
| `301650` | Kokoro Awane | `group_33` | 5 | `vo_char_3016_50_41_hca.hca` | 14.00s | 14.21s | +0.21s |
| `301700` | Yukika Nanase | `group_19` | 5 | `vo_char_3017_00_26_hca.hca` | 12.70s | 12.91s | +0.21s |
| `301800` | Hanna Sarasa | `group_20` | 6 | `vo_char_3018_00_27_hca.hca` | 14.00s | 14.21s | +0.21s |
| `301900` | Ayaka Mariko | `group_41` | 4 | `vo_char_3019_00_65_hca.hca` | 4.50s | 4.71s | +0.21s |
| `301950` | Ayaka Mariko | `group_41` | 2 | `vo_char_3019_00_65_hca.hca` | 4.50s | 4.71s | +0.21s |
| `302100` | Sakuya Suzuka | `group_6` | 3 | `vo_char_3021_00_13_hca.hca` | 6.10s | 6.31s | +0.21s |
| `302900` | Masara Kagami | `group_10` | 3 | `vo_char_3029_00_18_hca.hca` | 14.00s | 14.21s | +0.21s |
| `303300` | Sayuki Fumino | `group_29` | 7 | `vo_char_3033_00_36_hca.hca` | 17.10s | 17.31s | +0.21s |
| `303300` | Sayuki Fumino | `group_39` | 3 | `vo_char_3033_00_46_hca.hca` | 4.10s | 4.31s | +0.21s |
| `303350` | Sayuki Fumino | `group_39` | 2 | `vo_char_3033_00_46_hca.hca` | 4.10s | 4.31s | +0.21s |
| `305350` | Ikumi Makino | `group_19` | 7 | `vo_char_3053_50_26_hca.hca` | 12.10s | 12.31s | +0.21s |
| `400200` | Kirika Kure | `group_25` | 7 | `vo_char_4002_00_33_hca.hca` | 10.00s | 10.21s | +0.21s |
| `400300` | Yuma Chitose | `group_20` | 5 | `vo_char_4003_00_28_hca.hca` | 15.00s | 15.21s | +0.21s |
| `400300` | Yuma Chitose | `group_33` | 7 | `vo_char_4003_00_41_hca.hca` | 12.50s | 12.71s | +0.21s |
| `405300` | Hayate Yagami | `group_31` | 7 | `vo_char_4053_00_38_hca.hca` | 15.50s | 15.71s | +0.21s |
| `101000` | Momoko Togame | `group_21` | 6 | `vo_char_1010_00_29_hca.hca` | 10.50s | 10.70s | +0.20s |
| `102350` | Ao Kasane | `group_44` | 7 | `vo_game_0402_08_hca.hca` | 12.70s | 12.90s | +0.20s |
| `102800` | Himena Aika | `group_15` | 7 | `vo_char_1028_00_22_hca.hca` | 15.30s | 15.50s | +0.20s |
| `102850` | Himena Aika | `group_15` | 6 | `vo_char_1028_00_22_hca.hca` | 15.30s | 15.50s | +0.20s |
| `104100` | Livia Medeiros | `group_9` | 6 | `vo_char_1041_00_16_hca.hca` | 12.20s | 12.40s | +0.20s |
| `111802` | Amane Sisters | `group_23` | 4 | `vo_char_1118_02_30_hca.hca` | 10.60s | 10.80s | +0.20s |
| `130102` | Iroha & Yachiyo | `group_17` | 5 | `vo_char_1301_02_24_hca.hca` | 10.80s | 11.00s | +0.20s |
| `300300` | Hinano Miyako | `group_24` | 6 | `vo_char_3003_00_32_hca.hca` | 11.00s | 11.20s | +0.20s |
| `300600` | Emiri Kisaki | `group_2` | 5 | `vo_char_3006_00_03_hca.hca` | 6.00s | 6.20s | +0.20s |
| `300651` | Emiri Kisaki | `group_2` | 3 | `vo_char_3006_00_03_hca.hca` | 6.00s | 6.20s | +0.20s |
| `300900` | Manaka Kurumi | `group_19` | 5 | `vo_char_3009_00_27_hca.hca` | 7.50s | 7.70s | +0.20s |
| `303300` | Sayuki Fumino | `group_18` | 5 | `vo_char_3033_00_25_hca.hca` | 18.50s | 18.70s | +0.20s |
| `303300` | Sayuki Fumino | `group_34` | 9 | `vo_char_3033_00_41_hca.hca` | 21.00s | 21.20s | +0.20s |
| `350400` | Masara & Kokoro | `group_16` | 8 | `vo_char_3504_00_23_hca.hca` | 26.20s | 26.40s | +0.20s |
| `350401` | Masara & Kokoro | `group_16` | 8 | `vo_char_3504_00_23_hca.hca` | 26.20s | 26.40s | +0.20s |
| `350402` | Masara & Kokoro | `group_16` | 8 | `vo_char_3504_00_23_hca.hca` | 26.20s | 26.40s | +0.20s |
| `401200` | Umika Misaki | `group_20` | 6 | `vo_char_4012_00_28_hca.hca` | 13.50s | 13.70s | +0.20s |
| `102250` | Hikaru Kirari | `group_34` | 6 | `vo_char_1022_50_41_hca.hca` | 13.30s | 13.49s | +0.19s |
| `103550` | Alexandra Kurusu | `group_30` | 4 | `vo_char_1035_50_37_hca.hca` | 11.50s | 11.69s | +0.19s |
| `104400` | Mikoto Sena | `group_1` | 8 | `vo_char_1044_00_01_hca.hca` | 28.05s | 28.24s | +0.19s |
| `111700` | Mitama Yakumo | `group_44` | 4 | `vo_game_0102_01_hca.hca` | 10.80s | 10.99s | +0.19s |
| `120901` | Rena & Kaede | `group_19` | 4 | `vo_char_1209_01_26_hca.hca` | 11.20s | 11.39s | +0.19s |
| `260000` | Kyoko Sakura | `group_18` | 7 | `vo_char_2600_00_25_hca.hca` | 17.50s | 17.69s | +0.19s |
| `300700` | Shizuku Hozumi | `group_26` | 6 | `vo_char_3007_00_34_hca.hca` | 15.50s | 15.69s | +0.19s |
| `300800` | Akira Shinobu | `group_10` | 11 | `vo_char_3008_00_18_hca.hca` | 14.00s | 14.19s | +0.19s |
| `300850` | Akira Shinobu | `group_10` | 8 | `vo_char_3008_00_18_hca.hca` | 14.00s | 14.19s | +0.19s |
| `300900` | Manaka Kurumi | `group_10` | 7 | `vo_char_3009_00_18_hca.hca` | 10.50s | 10.69s | +0.19s |
| `300900` | Manaka Kurumi | `group_30` | 7 | `vo_char_3009_00_38_hca.hca` | 10.00s | 10.19s | +0.19s |
| `301100` | Kako Natsume | `group_14` | 10 | `vo_char_3011_00_22_hca.hca` | 17.00s | 17.19s | +0.19s |
| `301150` | Kako Natsume | `group_14` | 8 | `vo_char_3011_00_22_hca.hca` | 17.00s | 17.19s | +0.19s |
| `301151` | Kako Natsume | `group_14` | 8 | `vo_char_3011_00_22_hca.hca` | 17.00s | 17.19s | +0.19s |
| `303000` | Konomi Haruna | `group_28` | 6 | `vo_char_3030_00_36_hca.hca` | 6.50s | 6.69s | +0.19s |
| `303000` | Konomi Haruna | `group_40` | 5 | `vo_char_3030_00_64_hca.hca` | 4.50s | 4.69s | +0.19s |
| `303051` | Konomi Haruna | `group_40` | 3 | `vo_char_3030_00_64_hca.hca` | 4.50s | 4.69s | +0.19s |
| `303551` | Riko Chiaki | `group_4` | 2 | `vo_char_3035_00_05_hca.hca` | 4.20s | 4.39s | +0.19s |
| `400300` | Yuma Chitose | `group_22` | 7 | `vo_char_4003_00_30_hca.hca` | 10.50s | 10.69s | +0.19s |
| `400300` | Yuma Chitose | `group_26` | 6 | `vo_char_4003_00_34_hca.hca` | 10.00s | 10.19s | +0.19s |
| `402600` | Elisa | `group_31` | 6 | `vo_char_4026_00_38_hca.hca` | 14.50s | 14.69s | +0.19s |
| `101701` | Mitama Yakumo | `group_47` | 3 | `vo_game_0202_04_hca.hca` | 7.50s | 7.68s | +0.18s |
| `102200` | Hikaru Kirari | `group_18` | 4 | `vo_char_1022_00_25_hca.hca` | 10.50s | 10.68s | +0.18s |
| `102200` | Hikaru Kirari | `group_27` | 5 | `vo_char_1022_00_34_hca.hca` | 9.00s | 9.18s | +0.18s |
| `102200` | Hikaru Kirari | `group_34` | 5 | `vo_char_1022_00_41_hca.hca` | 10.20s | 10.38s | +0.18s |
| `111200` | Karin & Alina | `group_1` | 13 | `vo_char_1112_00_01_hca.hca` | 29.71s | 29.89s | +0.18s |
| `111201` | Karin & Alina | `group_1` | 12 | `vo_char_1112_00_01_hca.hca` | 29.71s | 29.89s | +0.18s |
| `111202` | Karin & Alina | `group_1` | 12 | `vo_char_1112_00_01_hca.hca` | 29.71s | 29.89s | +0.18s |
| `111700` | Mitama Yakumo | `group_48` | 6 | `vo_game_0102_08_hca.hca` | 9.30s | 9.48s | +0.18s |
| `200651` | Kyoko Sakura | `group_30` | 6 | `vo_char_2006_51_38_hca.hca` | 12.10s | 12.28s | +0.18s |
| `300300` | Hinano Miyako | `group_38` | 3 | `vo_char_3003_00_46_hca.hca` | 2.00s | 2.18s | +0.18s |
| `300351` | Hinano Miyako | `group_38` | 2 | `vo_char_3003_00_46_hca.hca` | 2.00s | 2.18s | +0.18s |
| `300900` | Manaka Kurumi | `group_42` | 5 | `vo_char_3009_00_66_hca.hca` | 4.00s | 4.18s | +0.18s |
| `301100` | Kako Natsume | `group_13` | 7 | `vo_char_3011_00_21_hca.hca` | 12.00s | 12.18s | +0.18s |
| `301150` | Kako Natsume | `group_13` | 5 | `vo_char_3011_00_21_hca.hca` | 12.00s | 12.18s | +0.18s |
| `301151` | Kako Natsume | `group_13` | 5 | `vo_char_3011_00_21_hca.hca` | 12.00s | 12.18s | +0.18s |
| `301900` | Ayaka Mariko | `group_38` | 4 | `vo_char_3019_00_46_hca.hca` | 3.50s | 3.68s | +0.18s |
| `301950` | Ayaka Mariko | `group_38` | 2 | `vo_char_3019_00_46_hca.hca` | 3.50s | 3.68s | +0.18s |
| `302900` | Masara Kagami | `group_25` | 4 | `vo_char_3029_00_33_hca.hca` | 13.00s | 13.18s | +0.18s |
| `302900` | Masara Kagami | `group_5` | 3 | `vo_char_3029_00_13_hca.hca` | 6.00s | 6.18s | +0.18s |
| `302950` | Masara Kagami | `group_5` | 3 | `vo_char_3029_00_13_hca.hca` | 6.00s | 6.18s | +0.18s |
| `303000` | Konomi Haruna | `group_1` | 12 | `vo_char_3030_00_01_hca.hca` | 23.50s | 23.68s | +0.18s |
| `303000` | Konomi Haruna | `group_14` | 10 | `vo_char_3030_00_22_hca.hca` | 14.50s | 14.68s | +0.18s |
| `303000` | Konomi Haruna | `group_16` | 8 | `vo_char_3030_00_24_hca.hca` | 9.00s | 9.18s | +0.18s |
| `303051` | Konomi Haruna | `group_1` | 10 | `vo_char_3030_00_01_hca.hca` | 23.50s | 23.68s | +0.18s |
| `303051` | Konomi Haruna | `group_14` | 8 | `vo_char_3030_00_22_hca.hca` | 14.50s | 14.68s | +0.18s |
| `303300` | Sayuki Fumino | `group_14` | 6 | `vo_char_3033_00_21_hca.hca` | 14.00s | 14.18s | +0.18s |
| `303350` | Sayuki Fumino | `group_14` | 5 | `vo_char_3033_00_21_hca.hca` | 14.00s | 14.18s | +0.18s |
| `303551` | Riko Chiaki | `group_26` | 5 | `vo_char_3035_51_34_hca.hca` | 10.10s | 10.28s | +0.18s |
| `304900` | Kanae Yukino | `group_31` | 3 | `vo_char_3049_00_39_hca.hca` | 11.00s | 11.18s | +0.18s |
| `305000` | Yuuna Kaharu | `group_1` | 9 | `vo_char_3050_00_01_hca.hca` | 22.55s | 22.73s | +0.18s |
| `305850` | Ryoko Natsu | `group_24` | 6 | `vo_char_3058_50_32_hca.hca` | 11.10s | 11.28s | +0.18s |
| `400300` | Yuma Chitose | `group_24` | 5 | `vo_char_4003_00_32_hca.hca` | 9.00s | 9.18s | +0.18s |
| `102350` | Ao Kasane | `group_21` | 5 | `vo_char_1023_50_28_hca.hca` | 13.60s | 13.77s | +0.17s |
| `103550` | Alexandra Kurusu | `group_17` | 6 | `vo_char_1035_50_24_hca.hca` | 13.10s | 13.27s | +0.17s |
| `104100` | Livia Medeiros | `group_33` | 6 | `vo_char_1041_00_40_hca.hca` | 12.50s | 12.67s | +0.17s |
| `120900` | Rena & Kaede | `group_15` | 9 | `vo_char_1209_00_22_hca.hca` | 20.70s | 20.87s | +0.17s |
| `120901` | Rena & Kaede | `group_15` | 8 | `vo_char_1209_00_22_hca.hca` | 20.70s | 20.87s | +0.17s |
| `120902` | Rena & Kaede | `group_15` | 8 | `vo_char_1209_00_22_hca.hca` | 20.70s | 20.87s | +0.17s |
| `300400` | Sasara Minagi | `group_27` | 9 | `vo_char_3004_00_35_hca.hca` | 14.50s | 14.67s | +0.17s |
| `300800` | Akira Shinobu | `group_15` | 12 | `vo_char_3008_00_23_hca.hca` | 19.00s | 19.17s | +0.17s |
| `300850` | Akira Shinobu | `group_15` | 9 | `vo_char_3008_00_23_hca.hca` | 19.00s | 19.17s | +0.17s |
| `300900` | Manaka Kurumi | `group_26` | 6 | `vo_char_3009_00_34_hca.hca` | 10.00s | 10.17s | +0.17s |
| `302900` | Masara Kagami | `group_30` | 4 | `vo_char_3029_00_38_hca.hca` | 14.20s | 14.37s | +0.17s |
| `303000` | Konomi Haruna | `group_13` | 7 | `vo_char_3030_00_21_hca.hca` | 11.50s | 11.67s | +0.17s |
| `303000` | Konomi Haruna | `group_34` | 4 | `vo_char_3030_00_42_hca.hca` | 2.50s | 2.67s | +0.17s |
| `303000` | Konomi Haruna | `group_8` | 7 | `vo_char_3030_00_16_hca.hca` | 9.50s | 9.67s | +0.17s |
| `303051` | Konomi Haruna | `group_13` | 5 | `vo_char_3030_00_21_hca.hca` | 11.50s | 11.67s | +0.17s |
| `303051` | Konomi Haruna | `group_34` | 2 | `vo_char_3030_00_42_hca.hca` | 2.50s | 2.67s | +0.17s |
| `303051` | Konomi Haruna | `group_8` | 5 | `vo_char_3030_00_16_hca.hca` | 9.50s | 9.67s | +0.17s |
| `303100` | Rika Ayano | `group_27` | 7 | `vo_char_3031_00_35_hca.hca` | 8.50s | 8.67s | +0.17s |
| `304750` | Chika Aoba | `group_30` | 4 | `vo_char_3047_50_38_hca.hca` | 11.00s | 11.17s | +0.17s |
| `305850` | Ryoko Natsu | `group_33` | 7 | `vo_char_3058_50_41_hca.hca` | 10.50s | 10.67s | +0.17s |
| `400300` | Yuma Chitose | `group_30` | 6 | `vo_char_4003_00_38_hca.hca` | 9.00s | 9.17s | +0.17s |
| `401300` | Kaoru Maki | `group_26` | 7 | `vo_char_4013_00_34_hca.hca` | 11.60s | 11.77s | +0.17s |
| `404200` | Mayoi Hachikuji | `group_33` | 3 | `vo_char_4042_00_40_hca.hca` | 14.20s | 14.37s | +0.17s |
| `405300` | Hayate Yagami | `group_16` | 6 | `vo_char_4053_00_23_hca.hca` | 13.00s | 13.17s | +0.17s |
| `100352` | Tsuruno Yui | `group_24` | 6 | `vo_char_1003_52_32_hca.hca` | 13.00s | 13.16s | +0.16s |
| `102100` | Yuna Kureha | `group_41` | 4 | `vo_game_0602_02_hca.hca` | 10.50s | 10.66s | +0.16s |
| `102350` | Ao Kasane | `group_46` | 4 | `vo_game_0402_10_hca.hca` | 13.00s | 13.16s | +0.16s |
| `104100` | Livia Medeiros | `group_22` | 3 | `vo_char_1041_00_29_hca.hca` | 9.20s | 9.36s | +0.16s |
| `105300` | Amaryllis | `group_33` | 6 | `vo_char_1053_00_40_hca.hca` | 12.50s | 12.66s | +0.16s |
| `111000` | Momoko Togame | `group_11` | 7 | `vo_char_1110_00_18_hca.hca` | 14.30s | 14.46s | +0.16s |
| `111000` | Momoko Togame | `group_12` | 3 | `vo_char_1110_00_19_hca.hca` | 3.80s | 3.96s | +0.16s |
| `200651` | Kyoko Sakura | `group_27` | 5 | `vo_char_2006_51_35_hca.hca` | 8.90s | 9.06s | +0.16s |
| `300400` | Sasara Minagi | `group_14` | 9 | `vo_char_3004_00_22_hca.hca` | 16.50s | 16.66s | +0.16s |
| `301500` | Mito Aino | `group_27` | 6 | `vo_char_3015_00_35_hca.hca` | 16.80s | 16.96s | +0.16s |
| `302300` | Aimi Eri | `group_1` | 10 | `vo_char_3023_00_01_hca.hca` | 24.80s | 24.96s | +0.16s |
| `400300` | Yuma Chitose | `group_40` | 4 | `vo_char_4003_00_64_hca.hca` | 4.00s | 4.16s | +0.16s |
| `402100` | Tart | `group_14` | 7 | `vo_char_4021_00_22_hca.hca` | 21.70s | 21.86s | +0.16s |
| `403200` | Matsuri Hinata | `group_23` | 3 | `vo_char_4032_00_30_hca.hca` | 10.00s | 10.16s | +0.16s |
| `101000` | Momoko Togame | `group_15` | 9 | `vo_char_1010_00_23_hca.hca` | 12.80s | 12.95s | +0.15s |
| `101000` | Momoko Togame | `group_19` | 6 | `vo_char_1010_00_27_hca.hca` | 8.50s | 8.65s | +0.15s |
| `101000` | Momoko Togame | `group_23` | 8 | `vo_char_1010_00_31_hca.hca` | 10.50s | 10.65s | +0.15s |
| `101051` | Momoko Togame | `group_15` | 8 | `vo_char_1010_00_23_hca.hca` | 12.80s | 12.95s | +0.15s |
| `101400` | Nemu Hiiragi | `group_15` | 5 | `vo_char_1014_00_22_hca.hca` | 24.00s | 24.15s | +0.15s |
| `101450` | Nemu Hiiragi | `group_15` | 5 | `vo_char_1014_00_22_hca.hca` | 24.00s | 24.15s | +0.15s |
| `101450` | Nemu Hiiragi | `group_32` | 8 | `vo_char_1014_50_39_hca.hca` | 23.50s | 23.65s | +0.15s |
| `101799` | Mitama Yakumo | `group_3` | 5 | `vo_game_0002_03_hca.hca` | 10.00s | 10.15s | +0.15s |
| `102200` | Hikaru Kirari | `group_45` | 5 | `vo_game_0302_09_hca.hca` | 10.10s | 10.25s | +0.15s |
| `102200` | Hikaru Kirari | `group_48` | 5 | `vo_game_0302_12_hca.hca` | 10.80s | 10.95s | +0.15s |
| `102250` | Hikaru Kirari | `group_48` | 4 | `vo_game_0302_12_hca.hca` | 10.80s | 10.95s | +0.15s |
| `102400` | Juri Oba | `group_48` | 5 | `vo_game_0502_12_hca.hca` | 11.30s | 11.45s | +0.15s |
| `102800` | Himena Aika | `group_14` | 4 | `vo_char_1028_00_21_hca.hca` | 10.60s | 10.75s | +0.15s |
| `102850` | Himena Aika | `group_14` | 3 | `vo_char_1028_00_21_hca.hca` | 10.60s | 10.75s | +0.15s |
| `103250` | Miyuri Yukari | `group_29` | 4 | `vo_char_1032_50_36_hca.hca` | 12.30s | 12.45s | +0.15s |
| `104100` | Livia Medeiros | `group_34` | 6 | `vo_char_1041_00_41_hca.hca` | 13.80s | 13.95s | +0.15s |
| `120902` | Rena & Kaede | `group_21` | 9 | `vo_char_1209_02_28_hca.hca` | 16.40s | 16.55s | +0.15s |
| `200700` | Nagisa Momoe | `group_22` | 8 | `vo_char_2007_00_29_hca.hca` | 12.60s | 12.75s | +0.15s |
| `300300` | Hinano Miyako | `group_17` | 7 | `vo_char_3003_00_25_hca.hca` | 9.50s | 9.65s | +0.15s |
| `300300` | Hinano Miyako | `group_7` | 6 | `vo_char_3003_00_15_hca.hca` | 6.50s | 6.65s | +0.15s |
| `300351` | Hinano Miyako | `group_7` | 5 | `vo_char_3003_00_15_hca.hca` | 6.50s | 6.65s | +0.15s |
| `300700` | Shizuku Hozumi | `group_23` | 6 | `vo_char_3007_00_31_hca.hca` | 10.50s | 10.65s | +0.15s |
| `301650` | Kokoro Awane | `group_32` | 6 | `vo_char_3016_50_40_hca.hca` | 11.70s | 11.85s | +0.15s |
| `302100` | Sakuya Suzuka | `group_24` | 4 | `vo_char_3021_00_31_hca.hca` | 8.80s | 8.95s | +0.15s |
| `304700` | Chika Aoba | `group_25` | 4 | `vo_char_3047_00_32_hca.hca` | 12.40s | 12.55s | +0.15s |
| `304800` | Hotaru Yura | `group_10` | 5 | `vo_char_3048_00_17_hca.hca` | 16.60s | 16.75s | +0.15s |
| `402300` | Melissa | `group_8` | 4 | `vo_char_4023_00_16_hca.hca` | 11.50s | 11.65s | +0.15s |
| `402350` | Melissa | `group_8` | 2 | `vo_char_4023_00_16_hca.hca` | 11.50s | 11.65s | +0.15s |
| `100100` | Iroha Tamaki | `group_25` | 7 | `vo_char_1001_00_33_hca.hca` | 9.00s | 9.14s | +0.14s |
| `100900` | Rena Minami | `group_23` | 5 | `vo_char_1009_00_31_hca.hca` | 7.00s | 7.14s | +0.14s |
| `101751` | Mitama Yakumo | `group_44` | 4 | `vo_game_0802_01_hca.hca` | 7.10s | 7.24s | +0.14s |
| `103250` | Miyuri Yukari | `group_27` | 5 | `vo_char_1032_50_34_hca.hca` | 12.50s | 12.64s | +0.14s |
| `130102` | Iroha & Yachiyo | `group_33` | 8 | `vo_char_1301_02_40_hca.hca` | 12.20s | 12.34s | +0.14s |
| `200651` | Kyoko Sakura | `group_16` | 5 | `vo_char_2006_51_24_hca.hca` | 10.00s | 10.14s | +0.14s |
| `300600` | Emiri Kisaki | `group_13` | 9 | `vo_char_3006_00_21_hca.hca` | 16.00s | 16.14s | +0.14s |
| `300651` | Emiri Kisaki | `group_13` | 7 | `vo_char_3006_00_21_hca.hca` | 16.00s | 16.14s | +0.14s |
| `304800` | Hotaru Yura | `group_6` | 4 | `vo_char_3048_00_13_hca.hca` | 12.50s | 12.64s | +0.14s |
| `350401` | Masara & Kokoro | `group_25` | 5 | `vo_char_3504_01_32_hca.hca` | 14.30s | 14.44s | +0.14s |
| `390201` | Shi | `group_34` | 8 | `vo_char_3902_01_41_hca.hca` | 25.70s | 25.84s | +0.14s |
| `100750` | Touka Satomi | `group_18` | 6 | `vo_char_1007_50_25_hca.hca` | 16.50s | 16.63s | +0.13s |
| `105302` | Amaryllis | `group_10` | 4 | `vo_char_1053_00_17_hca.hca` | 13.20s | 13.33s | +0.13s |
| `110100` | Iroha Tamaki | `group_15` | 11 | `vo_char_1101_00_23_hca.hca` | 19.70s | 19.83s | +0.13s |
| `111000` | Momoko Togame | `group_18` | 5 | `vo_char_1110_00_25_hca.hca` | 12.10s | 12.23s | +0.13s |
| `120902` | Rena & Kaede | `group_26` | 5 | `vo_char_1209_02_33_hca.hca` | 13.60s | 13.73s | +0.13s |
| `220200` | Devil Homura | `group_32` | 4 | `vo_char_2202_00_39_hca.hca` | 12.40s | 12.53s | +0.13s |
| `300300` | Hinano Miyako | `group_10` | 8 | `vo_char_3003_00_18_hca.hca` | 13.00s | 13.13s | +0.13s |
| `300351` | Hinano Miyako | `group_10` | 7 | `vo_char_3003_00_18_hca.hca` | 13.00s | 13.13s | +0.13s |
| `300400` | Sasara Minagi | `group_39` | 5 | `vo_char_3004_00_63_hca.hca` | 4.00s | 4.13s | +0.13s |
| `300600` | Emiri Kisaki | `group_10` | 7 | `vo_char_3006_00_18_hca.hca` | 11.50s | 11.63s | +0.13s |
| `300651` | Emiri Kisaki | `group_10` | 5 | `vo_char_3006_00_18_hca.hca` | 11.50s | 11.63s | +0.13s |
| `300800` | Akira Shinobu | `group_13` | 9 | `vo_char_3008_00_21_hca.hca` | 12.00s | 12.13s | +0.13s |
| `300800` | Akira Shinobu | `group_19` | 13 | `vo_char_3008_00_27_hca.hca` | 13.00s | 13.13s | +0.13s |
| `300850` | Akira Shinobu | `group_13` | 6 | `vo_char_3008_00_21_hca.hca` | 12.00s | 12.13s | +0.13s |
| `300900` | Manaka Kurumi | `group_20` | 6 | `vo_char_3009_00_28_hca.hca` | 8.00s | 8.13s | +0.13s |
| `300900` | Manaka Kurumi | `group_29` | 5 | `vo_char_3009_00_37_hca.hca` | 9.00s | 9.13s | +0.13s |
| `302100` | Sakuya Suzuka | `group_36` | 2 | `vo_char_3021_00_43_hca.hca` | 2.50s | 2.63s | +0.13s |
| `303551` | Riko Chiaki | `group_16` | 7 | `vo_char_3035_51_24_hca.hca` | 17.50s | 17.63s | +0.13s |
| `303551` | Riko Chiaki | `group_33` | 5 | `vo_char_3035_51_41_hca.hca` | 11.90s | 12.03s | +0.13s |
| `304300` | Eternal Sakura | `group_16` | 7 | `vo_char_3043_00_23_hca.hca` | 26.70s | 26.83s | +0.13s |
| `304800` | Hotaru Yura | `group_23` | 7 | `vo_char_3048_00_30_hca.hca` | 18.80s | 18.93s | +0.13s |
| `305251` | Ashley Taylor | `group_19` | 8 | `vo_char_3052_51_27_hca.hca` | 14.00s | 14.13s | +0.13s |
| `400300` | Yuma Chitose | `group_18` | 7 | `vo_char_4003_00_26_hca.hca` | 12.50s | 12.63s | +0.13s |
| `402700` | Lapin | `group_3` | 2 | `vo_char_4027_00_03_hca.hca` | 3.50s | 3.63s | +0.13s |
| `405200` | Fate | `group_27` | 6 | `vo_char_4052_00_34_hca.hca` | 14.20s | 14.33s | +0.13s |
| `405200` | Fate | `group_29` | 5 | `vo_char_4052_00_36_hca.hca` | 11.50s | 11.63s | +0.13s |
| `405300` | Hayate Yagami | `group_12` | 5 | `vo_char_4053_00_19_hca.hca` | 4.70s | 4.83s | +0.13s |
| `100100` | Iroha Tamaki | `group_3` | 4 | `vo_char_1001_00_04_hca.hca` | 5.50s | 5.62s | +0.12s |
| `100100` | Iroha Tamaki | `group_9` | 5 | `vo_char_1001_00_17_hca.hca` | 14.00s | 14.12s | +0.12s |
| `100103` | Iroha Tamaki | `group_3` | 4 | `vo_char_1001_00_04_hca.hca` | 5.50s | 5.62s | +0.12s |
| `100103` | Iroha Tamaki | `group_9` | 5 | `vo_char_1001_00_17_hca.hca` | 14.00s | 14.12s | +0.12s |
| `100150` | Iroha Tamaki | `group_3` | 3 | `vo_char_1001_00_04_hca.hca` | 5.50s | 5.62s | +0.12s |
| `100150` | Iroha Tamaki | `group_9` | 4 | `vo_char_1001_00_17_hca.hca` | 14.00s | 14.12s | +0.12s |
| `100153` | Iroha Tamaki | `group_3` | 3 | `vo_char_1001_00_04_hca.hca` | 5.50s | 5.62s | +0.12s |
| `100153` | Iroha Tamaki | `group_9` | 4 | `vo_char_1001_00_17_hca.hca` | 14.00s | 14.12s | +0.12s |
| `100900` | Rena Minami | `group_19` | 5 | `vo_char_1009_00_27_hca.hca` | 9.50s | 9.62s | +0.12s |
| `102200` | Hikaru Kirari | `group_2` | 4 | `vo_char_1022_00_02_hca.hca` | 8.70s | 8.82s | +0.12s |
| `102250` | Hikaru Kirari | `group_2` | 3 | `vo_char_1022_00_02_hca.hca` | 8.70s | 8.82s | +0.12s |
| `102350` | Ao Kasane | `group_23` | 6 | `vo_char_1023_50_30_hca.hca` | 12.70s | 12.82s | +0.12s |
| `102350` | Ao Kasane | `group_42` | 4 | `vo_game_0402_03_hca.hca` | 11.00s | 11.12s | +0.12s |
| `103902` | Sudachi Sawa | `group_22` | 5 | `vo_char_1039_02_29_hca.hca` | 10.20s | 10.32s | +0.12s |
| `103903` | Sudachi Sawa | `group_22` | 5 | `vo_char_1039_03_29_hca.hca` | 10.20s | 10.32s | +0.12s |
| `104050` | Yozuru Sasame | `group_19` | 4 | `vo_char_1040_50_26_hca.hca` | 12.40s | 12.52s | +0.12s |
| `105302` | Amaryllis | `group_6` | 2 | `vo_char_1053_00_13_hca.hca` | 4.30s | 4.42s | +0.12s |
| `111200` | Karin & Alina | `group_15` | 6 | `vo_char_1112_00_22_hca.hca` | 20.80s | 20.92s | +0.12s |
| `111201` | Karin & Alina | `group_15` | 5 | `vo_char_1112_00_22_hca.hca` | 20.80s | 20.92s | +0.12s |
| `111202` | Karin & Alina | `group_15` | 5 | `vo_char_1112_00_22_hca.hca` | 20.80s | 20.92s | +0.12s |
| `300300` | Hinano Miyako | `group_14` | 8 | `vo_char_3003_00_22_hca.hca` | 15.00s | 15.12s | +0.12s |
| `300300` | Hinano Miyako | `group_36` | 3 | `vo_char_3003_00_44_hca.hca` | 2.00s | 2.12s | +0.12s |
| `300351` | Hinano Miyako | `group_14` | 7 | `vo_char_3003_00_22_hca.hca` | 15.00s | 15.12s | +0.12s |
| `300351` | Hinano Miyako | `group_36` | 2 | `vo_char_3003_00_44_hca.hca` | 2.00s | 2.12s | +0.12s |
| `300600` | Emiri Kisaki | `group_8` | 8 | `vo_char_3006_00_16_hca.hca` | 10.00s | 10.12s | +0.12s |
| `300651` | Emiri Kisaki | `group_8` | 6 | `vo_char_3006_00_16_hca.hca` | 10.00s | 10.12s | +0.12s |
| `301600` | Kokoro Awane | `group_27` | 6 | `vo_char_3016_00_35_hca.hca` | 10.50s | 10.62s | +0.12s |
| `301950` | Ayaka Mariko | `group_16` | 4 | `vo_char_3019_50_24_hca.hca` | 9.00s | 9.12s | +0.12s |
| `301950` | Ayaka Mariko | `group_23` | 5 | `vo_char_3019_50_31_hca.hca` | 10.40s | 10.52s | +0.12s |
| `302300` | Aimi Eri | `group_43` | 7 | `vo_char_3023_00_02_hca.hca` | 11.30s | 11.42s | +0.12s |
| `402700` | Lapin | `group_30` | 5 | `vo_char_4027_00_37_hca.hca` | 10.50s | 10.62s | +0.12s |
| `403200` | Matsuri Hinata | `group_21` | 4 | `vo_char_4032_00_28_hca.hca` | 15.70s | 15.82s | +0.12s |
| `100100` | Iroha Tamaki | `group_28` | 7 | `vo_char_1001_00_36_hca.hca` | 13.00s | 13.11s | +0.11s |
| `100900` | Rena Minami | `group_22` | 8 | `vo_char_1009_00_30_hca.hca` | 11.50s | 11.61s | +0.11s |
| `100900` | Rena Minami | `group_29` | 6 | `vo_char_1009_00_37_hca.hca` | 12.00s | 12.11s | +0.11s |
| `101100` | Kaede Akino | `group_32` | 9 | `vo_char_1011_00_40_hca.hca` | 12.00s | 12.11s | +0.11s |
| `101400` | Nemu Hiiragi | `group_22` | 4 | `vo_char_1014_00_29_hca.hca` | 14.30s | 14.41s | +0.11s |
| `102200` | Hikaru Kirari | `group_43` | 3 | `vo_game_0302_04_hca.hca` | 8.90s | 9.01s | +0.11s |
| `102250` | Hikaru Kirari | `group_43` | 2 | `vo_game_0302_04_hca.hca` | 8.90s | 9.01s | +0.11s |
| `103900` | Sudachi Sawa | `group_18` | 6 | `vo_char_1039_00_25_hca.hca` | 10.20s | 10.31s | +0.11s |
| `111800` | Amane Sisters | `group_38` | 3 | `vo_char_1118_00_45_hca.hca` | 3.20s | 3.31s | +0.11s |
| `111801` | Amane Sisters | `group_38` | 3 | `vo_char_1118_00_45_hca.hca` | 3.20s | 3.31s | +0.11s |
| `111802` | Amane Sisters | `group_38` | 3 | `vo_char_1118_00_45_hca.hca` | 3.20s | 3.31s | +0.11s |
| `300400` | Sasara Minagi | `group_20` | 7 | `vo_char_3004_00_28_hca.hca` | 8.00s | 8.11s | +0.11s |
| `300700` | Shizuku Hozumi | `group_1` | 11 | `vo_char_3007_00_01_hca.hca` | 27.90s | 28.01s | +0.11s |
| `300750` | Shizuku Hozumi | `group_1` | 9 | `vo_char_3007_00_01_hca.hca` | 27.90s | 28.01s | +0.11s |
| `300900` | Manaka Kurumi | `group_18` | 5 | `vo_char_3009_00_26_hca.hca` | 9.50s | 9.61s | +0.11s |
| `301100` | Kako Natsume | `group_28` | 8 | `vo_char_3011_00_36_hca.hca` | 13.50s | 13.61s | +0.11s |
| `301400` | Seika Kumi | `group_33` | 8 | `vo_char_3014_00_41_hca.hca` | 13.80s | 13.91s | +0.11s |
| `301650` | Kokoro Awane | `group_31` | 5 | `vo_char_3016_50_39_hca.hca` | 13.00s | 13.11s | +0.11s |
| `301950` | Ayaka Mariko | `group_19` | 4 | `vo_char_3019_50_27_hca.hca` | 9.80s | 9.91s | +0.11s |
| `302500` | Ren Isuzu | `group_2` | 5 | `vo_char_3025_00_03_hca.hca` | 7.80s | 7.91s | +0.11s |
| `302551` | Ren Isuzu | `group_2` | 4 | `vo_char_3025_00_03_hca.hca` | 7.80s | 7.91s | +0.11s |
| `303300` | Sayuki Fumino | `group_19` | 6 | `vo_char_3033_00_26_hca.hca` | 17.10s | 17.21s | +0.11s |
| `303350` | Sayuki Fumino | `group_22` | 6 | `vo_char_3033_50_29_hca.hca` | 17.60s | 17.71s | +0.11s |
| `305100` | Jun Kazari | `group_16` | 7 | `vo_char_3051_00_23_hca.hca` | 18.05s | 18.16s | +0.11s |
| `402700` | Lapin | `group_10` | 4 | `vo_char_4027_00_17_hca.hca` | 11.50s | 11.61s | +0.11s |
| `404500` | Tsubasa Hanekawa | `group_29` | 2 | `vo_char_4045_00_36_hca.hca` | 10.30s | 10.41s | +0.11s |
| `405100` | Nanoha Takamachi | `group_30` | 6 | `vo_char_4051_00_37_hca.hca` | 10.50s | 10.61s | +0.11s |
| `405300` | Hayate Yagami | `group_32` | 7 | `vo_char_4053_00_39_hca.hca` | 12.70s | 12.81s | +0.11s |

---

## Complete List of In-Sync Scenario Groups ($|T_{\text{voice}} - T_{\text{json}}| \le 0.5\text{s}$)

| Outfit ID | Character Name | Group | Steps | Voice File | JSON Sum | Voice Duration | Drift |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `100402` | Sana Futaba | `group_24` | 5 | `vo_char_1004_02_32_hca.hca` | 18.70s | 18.70s | +0.00s |
| `100552` | Felicia Mitsuki | `group_23` | 5 | `vo_char_1005_52_31_hca.hca` | 9.00s | 9.00s | +0.00s |
| `101000` | Momoko Togame | `group_25` | 8 | `vo_char_1010_00_33_hca.hca` | 14.00s | 14.00s | +0.00s |
| `101152` | Kaede Akino | `group_18` | 6 | `vo_char_1011_52_26_hca.hca` | 12.90s | 12.90s | +0.00s |
| `101951` | Tsukasa Amane | `group_20` | 3 | `vo_char_1019_51_28_hca.hca` | 10.00s | 10.00s | +0.00s |
| `102200` | Hikaru Kirari | `group_36` | 2 | `vo_char_1022_00_43_hca.hca` | 2.00s | 2.00s | +0.00s |
| `103200` | Miyuri Yukari | `group_2` | 5 | `vo_char_1032_00_02_hca.hca` | 15.00s | 15.00s | +0.00s |
| `104600` | Chizuru | `group_25` | 5 | `vo_char_1046_00_32_hca.hca` | 12.70s | 12.70s | +0.00s |
| `110800` | Holy Alina | `group_1` | 9 | `vo_char_1108_00_01_hca.hca` | 27.50s | 27.50s | +0.00s |
| `111000` | Momoko Togame | `group_10` | 5 | `vo_char_1110_00_17_hca.hca` | 15.00s | 15.00s | +0.00s |
| `111700` | Mitama Yakumo | `group_51` | 4 | `vo_game_0102_11_hca.hca` | 10.60s | 10.60s | +0.00s |
| `120100` | Iroha-chan | `group_22` | 3 | `vo_char_1201_00_29_hca.hca` | 10.00s | 10.00s | +0.00s |
| `120900` | Rena & Kaede | `group_26` | 5 | `vo_char_1209_00_33_hca.hca` | 14.70s | 14.70s | +0.00s |
| `200700` | Nagisa Momoe | `group_18` | 6 | `vo_char_2007_00_25_hca.hca` | 19.30s | 19.30s | +0.00s |
| `240000` | Sayaka Miki | `group_34` | 6 | `vo_char_2400_00_41_hca.hca` | 11.00s | 11.00s | +0.00s |
| `250100` | Mami Tomoe | `group_2` | 5 | `vo_char_2501_00_02_hca.hca` | 13.30s | 13.30s | +0.00s |
| `260000` | Kyoko Sakura | `group_35` | 4 | `vo_char_2600_00_42_hca.hca` | 4.00s | 4.00s | +0.00s |
| `260000` | Kyoko Sakura | `group_9` | 4 | `vo_char_2600_00_16_hca.hca` | 11.00s | 11.00s | +0.00s |
| `300250` | Natsuki Utsuho | `group_21` | 6 | `vo_char_3002_50_29_hca.hca` | 16.70s | 16.70s | +0.00s |
| `300300` | Hinano Miyako | `group_27` | 5 | `vo_char_3003_00_35_hca.hca` | 7.50s | 7.50s | +0.00s |
| `300600` | Emiri Kisaki | `group_20` | 6 | `vo_char_3006_00_28_hca.hca` | 12.00s | 12.00s | +0.00s |
| `300600` | Emiri Kisaki | `group_22` | 8 | `vo_char_3006_00_30_hca.hca` | 8.00s | 8.00s | +0.00s |
| `300600` | Emiri Kisaki | `group_33` | 5 | `vo_char_3006_00_41_hca.hca` | 11.00s | 11.00s | +0.00s |
| `300651` | Emiri Kisaki | `group_27` | 7 | `vo_char_3006_51_35_hca.hca` | 13.00s | 13.00s | +0.00s |
| `300700` | Shizuku Hozumi | `group_19` | 7 | `vo_char_3007_00_27_hca.hca` | 13.00s | 13.00s | +0.00s |
| `300700` | Shizuku Hozumi | `group_31` | 6 | `vo_char_3007_00_39_hca.hca` | 12.00s | 12.00s | +0.00s |
| `300800` | Akira Shinobu | `group_1` | 10 | `vo_char_3008_00_01_hca.hca` | 20.50s | 20.50s | +0.00s |
| `300800` | Akira Shinobu | `group_28` | 8 | `vo_char_3008_00_36_hca.hca` | 9.50s | 9.50s | +0.00s |
| `300800` | Akira Shinobu | `group_37` | 6 | `vo_char_3008_00_45_hca.hca` | 2.50s | 2.50s | +0.00s |
| `300850` | Akira Shinobu | `group_1` | 7 | `vo_char_3008_00_01_hca.hca` | 20.50s | 20.50s | +0.00s |
| `300850` | Akira Shinobu | `group_37` | 3 | `vo_char_3008_00_45_hca.hca` | 2.50s | 2.50s | +0.00s |
| `300900` | Manaka Kurumi | `group_14` | 8 | `vo_char_3009_00_22_hca.hca` | 12.50s | 12.50s | +0.00s |
| `303000` | Konomi Haruna | `group_5` | 4 | `vo_char_3030_00_13_hca.hca` | 4.50s | 4.50s | +0.00s |
| `303051` | Konomi Haruna | `group_5` | 2 | `vo_char_3030_00_13_hca.hca` | 4.50s | 4.50s | +0.00s |
| `303100` | Rika Ayano | `group_26` | 7 | `vo_char_3031_00_34_hca.hca` | 8.00s | 8.00s | +0.00s |
| `304300` | Eternal Sakura | `group_36` | 2 | `vo_char_3043_00_43_hca.hca` | 4.00s | 4.00s | +0.00s |
| `390201` | Shi | `group_30` | 5 | `vo_char_3902_01_37_hca.hca` | 14.60s | 14.60s | +0.00s |
| `400100` | Oriko Mikuni | `group_32` | 6 | `vo_char_4001_00_40_hca.hca` | 12.50s | 12.50s | +0.00s |
| `402200` | Riz | `group_8` | 4 | `vo_char_4022_00_16_hca.hca` | 11.00s | 11.00s | +0.00s |
| `402250` | Riz | `group_8` | 2 | `vo_char_4022_00_16_hca.hca` | 11.00s | 11.00s | +0.00s |
| `402600` | Elisa | `group_15` | 7 | `vo_char_4026_00_22_hca.hca` | 18.00s | 18.00s | +0.00s |
| `402650` | Elisa | `group_15` | 6 | `vo_char_4026_00_22_hca.hca` | 18.00s | 18.00s | +0.00s |
| `402650` | Elisa | `group_31` | 4 | `vo_char_4026_50_38_hca.hca` | 13.00s | 13.00s | +0.00s |
| `404500` | Tsubasa Hanekawa | `group_32` | 2 | `vo_char_4045_00_39_hca.hca` | 13.90s | 13.90s | +0.00s |
| `100700` | Touka Satomi | `group_35` | 2 | `vo_char_1007_00_42_hca.hca` | 3.50s | 3.49s | -0.01s |
| `100900` | Rena Minami | `group_15` | 9 | `vo_char_1009_00_23_hca.hca` | 19.00s | 19.01s | +0.01s |
| `100900` | Rena Minami | `group_39` | 4 | `vo_char_1009_00_63_hca.hca` | 3.50s | 3.49s | -0.01s |
| `100900` | Rena Minami | `group_41` | 4 | `vo_char_1009_00_65_hca.hca` | 4.00s | 4.01s | +0.01s |
| `100950` | Rena Minami | `group_15` | 8 | `vo_char_1009_00_23_hca.hca` | 19.00s | 19.01s | +0.01s |
| `100950` | Rena Minami | `group_39` | 3 | `vo_char_1009_00_63_hca.hca` | 3.50s | 3.49s | -0.01s |
| `100950` | Rena Minami | `group_41` | 3 | `vo_char_1009_00_65_hca.hca` | 4.00s | 4.01s | +0.01s |
| `100951` | Rena Minami | `group_15` | 8 | `vo_char_1009_00_23_hca.hca` | 19.00s | 19.01s | +0.01s |
| `100951` | Rena Minami | `group_39` | 3 | `vo_char_1009_00_63_hca.hca` | 3.50s | 3.49s | -0.01s |
| `100951` | Rena Minami | `group_41` | 3 | `vo_char_1009_00_65_hca.hca` | 4.00s | 4.01s | +0.01s |
| `101000` | Momoko Togame | `group_24` | 7 | `vo_char_1010_00_32_hca.hca` | 11.00s | 10.99s | -0.01s |
| `101100` | Kaede Akino | `group_17` | 6 | `vo_char_1011_00_25_hca.hca` | 8.00s | 7.99s | -0.01s |
| `101200` | Karin Misono | `group_24` | 5 | `vo_char_1012_00_32_hca.hca` | 11.00s | 10.99s | -0.01s |
| `101250` | Karin Misono | `group_16` | 6 | `vo_char_1012_50_24_hca.hca` | 14.50s | 14.49s | -0.01s |
| `101300` | Asuka Tatsuki | `group_40` | 3 | `vo_char_1013_00_64_hca.hca` | 2.00s | 1.99s | -0.01s |
| `101750` | Mitama Yakumo | `group_27` | 5 | `vo_char_1017_50_35_hca.hca` | 14.00s | 14.01s | +0.01s |
| `102850` | Himena Aika | `group_18` | 5 | `vo_char_1028_50_25_hca.hca` | 11.50s | 11.51s | +0.01s |
| `102850` | Himena Aika | `group_30` | 4 | `vo_char_1028_50_37_hca.hca` | 9.60s | 9.61s | +0.01s |
| `103550` | Alexandra Kurusu | `group_28` | 3 | `vo_char_1035_50_35_hca.hca` | 10.90s | 10.89s | -0.01s |
| `103550` | Alexandra Kurusu | `group_32` | 5 | `vo_char_1035_50_39_hca.hca` | 15.80s | 15.79s | -0.01s |
| `104100` | Livia Medeiros | `group_35` | 3 | `vo_char_1041_00_42_hca.hca` | 4.00s | 4.01s | +0.01s |
| `105300` | Amaryllis | `group_11` | 5 | `vo_char_1053_00_18_hca.hca` | 12.90s | 12.91s | +0.01s |
| `111201` | Karin & Alina | `group_23` | 4 | `vo_char_1112_01_30_hca.hca` | 12.10s | 12.09s | -0.01s |
| `111202` | Karin & Alina | `group_17` | 6 | `vo_char_1112_02_24_hca.hca` | 11.10s | 11.09s | -0.01s |
| `111802` | Amane Sisters | `group_30` | 5 | `vo_char_1118_02_37_hca.hca` | 16.20s | 16.21s | +0.01s |
| `120900` | Rena & Kaede | `group_31` | 5 | `vo_char_1209_00_38_hca.hca` | 15.00s | 15.01s | +0.01s |
| `130100` | Iroha & Yachiyo | `group_20` | 7 | `vo_char_1301_00_27_hca.hca` | 12.00s | 11.99s | -0.01s |
| `130100` | Iroha & Yachiyo | `group_39` | 3 | `vo_char_1301_00_46_hca.hca` | 5.00s | 4.99s | -0.01s |
| `130101` | Iroha & Yachiyo | `group_39` | 3 | `vo_char_1301_00_46_hca.hca` | 5.00s | 4.99s | -0.01s |
| `130102` | Iroha & Yachiyo | `group_39` | 3 | `vo_char_1301_00_46_hca.hca` | 5.00s | 4.99s | -0.01s |
| `200600` | Kyoko Sakura | `group_19` | 6 | `vo_char_2006_00_27_hca.hca` | 12.00s | 11.99s | -0.01s |
| `200600` | Kyoko Sakura | `group_33` | 7 | `vo_char_2006_00_41_hca.hca` | 13.00s | 12.99s | -0.01s |
| `200600` | Kyoko Sakura | `group_5` | 5 | `vo_char_2006_00_13_hca.hca` | 5.00s | 4.99s | -0.01s |
| `200602` | Kyoko Sakura | `group_5` | 4 | `vo_char_2006_00_13_hca.hca` | 5.00s | 4.99s | -0.01s |
| `200650` | Kyoko Sakura | `group_5` | 3 | `vo_char_2006_00_13_hca.hca` | 5.00s | 4.99s | -0.01s |
| `200651` | Kyoko Sakura | `group_5` | 2 | `vo_char_2006_00_13_hca.hca` | 5.00s | 4.99s | -0.01s |
| `200653` | Kyoko Sakura | `group_5` | 2 | `vo_char_2006_00_13_hca.hca` | 5.00s | 4.99s | -0.01s |
| `200700` | Nagisa Momoe | `group_40` | 3 | `vo_char_2007_00_63_hca.hca` | 1.70s | 1.71s | +0.01s |
| `220200` | Devil Homura | `group_24` | 4 | `vo_char_2202_00_31_hca.hca` | 15.70s | 15.71s | +0.01s |
| `220200` | Devil Homura | `group_7` | 3 | `vo_char_2202_00_14_hca.hca` | 6.80s | 6.81s | +0.01s |
| `260000` | Kyoko Sakura | `group_23` | 5 | `vo_char_2600_00_30_hca.hca` | 11.00s | 10.99s | -0.01s |
| `300300` | Hinano Miyako | `group_31` | 6 | `vo_char_3003_00_39_hca.hca` | 9.50s | 9.49s | -0.01s |
| `300400` | Sasara Minagi | `group_24` | 8 | `vo_char_3004_00_32_hca.hca` | 10.00s | 10.01s | +0.01s |
| `300700` | Shizuku Hozumi | `group_28` | 6 | `vo_char_3007_00_36_hca.hca` | 12.50s | 12.51s | +0.01s |
| `300800` | Akira Shinobu | `group_42` | 4 | `vo_char_3008_00_66_hca.hca` | 3.00s | 3.01s | +0.01s |
| `301100` | Kako Natsume | `group_3` | 5 | `vo_char_3011_00_04_hca.hca` | 6.00s | 5.99s | -0.01s |
| `301150` | Kako Natsume | `group_3` | 3 | `vo_char_3011_00_04_hca.hca` | 6.00s | 5.99s | -0.01s |
| `301151` | Kako Natsume | `group_3` | 3 | `vo_char_3011_00_04_hca.hca` | 6.00s | 5.99s | -0.01s |
| `301900` | Ayaka Mariko | `group_29` | 5 | `vo_char_3019_00_37_hca.hca` | 10.40s | 10.39s | -0.01s |
| `301950` | Ayaka Mariko | `group_30` | 5 | `vo_char_3019_50_38_hca.hca` | 11.50s | 11.49s | -0.01s |
| `302300` | Aimi Eri | `group_10` | 6 | `vo_char_3023_00_18_hca.hca` | 11.00s | 10.99s | -0.01s |
| `302700` | Hazuki Yusa | `group_32` | 5 | `vo_char_3027_00_40_hca.hca` | 13.00s | 12.99s | -0.01s |
| `302900` | Masara Kagami | `group_27` | 4 | `vo_char_3029_00_35_hca.hca` | 11.50s | 11.49s | -0.01s |
| `303000` | Konomi Haruna | `group_20` | 7 | `vo_char_3030_00_28_hca.hca` | 11.50s | 11.51s | +0.01s |
| `303100` | Rika Ayano | `group_9` | 8 | `vo_char_3031_00_17_hca.hca` | 9.50s | 9.49s | -0.01s |
| `305400` | Mitsune Miwa | `group_1` | 6 | `vo_char_3054_00_01_hca.hca` | 29.00s | 28.99s | -0.01s |
| `305600` | Rui Mizuki | `group_1` | 9 | `vo_char_3056_00_01_hca.hca` | 26.70s | 26.71s | +0.01s |
| `305850` | Ryoko Natsu | `group_12` | 2 | `vo_char_3058_00_20_hca.hca` | 7.00s | 6.99s | -0.01s |
| `350100` | Rika & Ren | `group_23` | 9 | `vo_char_3501_00_30_hca.hca` | 15.00s | 14.99s | -0.01s |
| `350400` | Masara & Kokoro | `group_24` | 6 | `vo_char_3504_00_31_hca.hca` | 13.70s | 13.71s | +0.01s |
| `390201` | Shi | `group_31` | 6 | `vo_char_3902_01_38_hca.hca` | 17.00s | 17.01s | +0.01s |
| `400200` | Kirika Kure | `group_27` | 7 | `vo_char_4002_00_35_hca.hca` | 9.50s | 9.49s | -0.01s |
| `400200` | Kirika Kure | `group_8` | 6 | `vo_char_4002_00_16_hca.hca` | 13.50s | 13.51s | +0.01s |
| `402700` | Lapin | `group_21` | 5 | `vo_char_4027_00_28_hca.hca` | 12.40s | 12.39s | -0.01s |
| `402700` | Lapin | `group_24` | 5 | `vo_char_4027_00_31_hca.hca` | 12.10s | 12.11s | +0.01s |
| `403200` | Matsuri Hinata | `group_25` | 4 | `vo_char_4032_00_32_hca.hca` | 13.00s | 12.99s | -0.01s |
| `404500` | Tsubasa Hanekawa | `group_22` | 2 | `vo_char_4045_00_29_hca.hca` | 11.30s | 11.29s | -0.01s |
| `405100` | Nanoha Takamachi | `group_1` | 7 | `vo_char_4051_00_01_hca.hca` | 19.20s | 19.19s | -0.01s |
| `405200` | Fate | `group_23` | 5 | `vo_char_4052_00_30_hca.hca` | 6.50s | 6.49s | -0.01s |
| `405300` | Hayate Yagami | `group_4` | 4 | `vo_char_4053_00_04_hca.hca` | 4.80s | 4.79s | -0.01s |
| `100100` | Iroha Tamaki | `group_18` | 6 | `vo_char_1001_00_26_hca.hca` | 13.00s | 12.98s | -0.02s |
| `100352` | Tsuruno Yui | `group_21` | 6 | `vo_char_1003_52_29_hca.hca` | 12.80s | 12.78s | -0.02s |
| `100451` | Sana Futaba | `group_26` | 4 | `vo_char_1004_51_34_hca.hca` | 13.00s | 12.98s | -0.02s |
| `100800` | Alina Gray | `group_6` | 3 | `vo_char_1008_00_14_hca.hca` | 5.00s | 4.98s | -0.02s |
| `100850` | Alina Gray | `group_6` | 2 | `vo_char_1008_00_14_hca.hca` | 5.00s | 4.98s | -0.02s |
| `100900` | Rena Minami | `group_27` | 6 | `vo_char_1009_00_35_hca.hca` | 7.50s | 7.52s | +0.02s |
| `100900` | Rena Minami | `group_3` | 4 | `vo_char_1009_00_04_hca.hca` | 4.00s | 3.98s | -0.02s |
| `100950` | Rena Minami | `group_3` | 3 | `vo_char_1009_00_04_hca.hca` | 4.00s | 3.98s | -0.02s |
| `100951` | Rena Minami | `group_29` | 4 | `vo_char_1009_51_37_hca.hca` | 11.00s | 10.98s | -0.02s |
| `100951` | Rena Minami | `group_3` | 3 | `vo_char_1009_00_04_hca.hca` | 4.00s | 3.98s | -0.02s |
| `101000` | Momoko Togame | `group_29` | 9 | `vo_char_1010_00_37_hca.hca` | 11.00s | 11.02s | +0.02s |
| `101000` | Momoko Togame | `group_36` | 3 | `vo_char_1010_00_44_hca.hca` | 2.00s | 1.98s | -0.02s |
| `101051` | Momoko Togame | `group_36` | 2 | `vo_char_1010_00_44_hca.hca` | 2.00s | 1.98s | -0.02s |
| `101701` | Mitama Yakumo | `group_46` | 4 | `vo_game_0202_03_hca.hca` | 7.90s | 7.88s | -0.02s |
| `101750` | Mitama Yakumo | `group_33` | 5 | `vo_char_1017_50_41_hca.hca` | 12.00s | 11.98s | -0.02s |
| `101750` | Mitama Yakumo | `group_44` | 4 | `vo_game_1002_01_hca.hca` | 8.20s | 8.18s | -0.02s |
| `101900` | Tsukasa Amane | `group_30` | 4 | `vo_char_1019_00_38_hca.hca` | 11.00s | 10.98s | -0.02s |
| `102200` | Hikaru Kirari | `group_8` | 3 | `vo_char_1022_00_15_hca.hca` | 6.50s | 6.48s | -0.02s |
| `102250` | Hikaru Kirari | `group_8` | 2 | `vo_char_1022_00_15_hca.hca` | 6.50s | 6.48s | -0.02s |
| `102600` | Chiharu Hiroe | `group_21` | 7 | `vo_char_1026_00_28_hca.hca` | 12.50s | 12.48s | -0.02s |
| `103250` | Miyuri Yukari | `group_18` | 6 | `vo_char_1032_50_25_hca.hca` | 11.20s | 11.22s | +0.02s |
| `103350` | Rabi Himuro | `group_19` | 5 | `vo_char_1033_50_26_hca.hca` | 16.50s | 16.48s | -0.02s |
| `104600` | Chizuru | `group_13` | 4 | `vo_char_1046_00_20_hca.hca` | 5.30s | 5.32s | +0.02s |
| `105300` | Amaryllis | `group_23` | 5 | `vo_char_1053_00_30_hca.hca` | 10.00s | 9.98s | -0.02s |
| `110401` | Uwasa Sana | `group_23` | 5 | `vo_char_1104_01_30_hca.hca` | 16.30s | 16.28s | -0.02s |
| `120900` | Rena & Kaede | `group_16` | 4 | `vo_char_1209_00_23_hca.hca` | 18.40s | 18.38s | -0.02s |
| `120901` | Rena & Kaede | `group_16` | 4 | `vo_char_1209_00_23_hca.hca` | 18.40s | 18.38s | -0.02s |
| `120902` | Rena & Kaede | `group_16` | 4 | `vo_char_1209_00_23_hca.hca` | 18.40s | 18.38s | -0.02s |
| `200200` | Homura Akemi | `group_37` | 2 | `vo_char_2002_00_44_hca.hca` | 2.80s | 2.82s | +0.02s |
| `220200` | Devil Homura | `group_30` | 5 | `vo_char_2202_00_37_hca.hca` | 15.40s | 15.38s | -0.02s |
| `250000` | Holy Mami | `group_5` | 3 | `vo_char_2500_00_13_hca.hca` | 6.00s | 5.98s | -0.02s |
| `250000` | Holy Mami | `group_8` | 4 | `vo_char_2500_00_16_hca.hca` | 11.00s | 10.98s | -0.02s |
| `250001` | Holy Mami | `group_5` | 3 | `vo_char_2500_00_13_hca.hca` | 6.00s | 5.98s | -0.02s |
| `250001` | Holy Mami | `group_8` | 4 | `vo_char_2500_00_16_hca.hca` | 11.00s | 10.98s | -0.02s |
| `260000` | Kyoko Sakura | `group_34` | 6 | `vo_char_2600_00_41_hca.hca` | 13.50s | 13.52s | +0.02s |
| `300100` | Kanoko Yayoi | `group_43` | 7 | `vo_char_3001_00_02_hca.hca` | 13.30s | 13.28s | -0.02s |
| `300300` | Hinano Miyako | `group_23` | 8 | `vo_char_3003_00_31_hca.hca` | 13.50s | 13.52s | +0.02s |
| `300300` | Hinano Miyako | `group_26` | 7 | `vo_char_3003_00_34_hca.hca` | 11.50s | 11.48s | -0.02s |
| `300400` | Sasara Minagi | `group_25` | 7 | `vo_char_3004_00_33_hca.hca` | 12.50s | 12.48s | -0.02s |
| `300600` | Emiri Kisaki | `group_28` | 9 | `vo_char_3006_00_36_hca.hca` | 13.50s | 13.48s | -0.02s |
| `300800` | Akira Shinobu | `group_17` | 11 | `vo_char_3008_00_25_hca.hca` | 10.50s | 10.48s | -0.02s |
| `300800` | Akira Shinobu | `group_41` | 5 | `vo_char_3008_00_65_hca.hca` | 3.00s | 2.98s | -0.02s |
| `300850` | Akira Shinobu | `group_41` | 2 | `vo_char_3008_00_65_hca.hca` | 3.00s | 2.98s | -0.02s |
| `300900` | Manaka Kurumi | `group_40` | 4 | `vo_char_3009_00_64_hca.hca` | 3.50s | 3.48s | -0.02s |
| `300900` | Manaka Kurumi | `group_6` | 4 | `vo_char_3009_00_14_hca.hca` | 4.50s | 4.52s | +0.02s |
| `301100` | Kako Natsume | `group_37` | 3 | `vo_char_3011_00_45_hca.hca` | 2.50s | 2.52s | +0.02s |
| `301500` | Mito Aino | `group_42` | 4 | `vo_char_3015_00_66_hca.hca` | 2.80s | 2.78s | -0.02s |
| `301900` | Ayaka Mariko | `group_36` | 3 | `vo_char_3019_00_44_hca.hca` | 3.00s | 3.02s | +0.02s |
| `301950` | Ayaka Mariko | `group_32` | 3 | `vo_char_3019_50_40_hca.hca` | 11.80s | 11.78s | -0.02s |
| `302100` | Sakuya Suzuka | `group_35` | 2 | `vo_char_3021_00_42_hca.hca` | 2.00s | 1.98s | -0.02s |
| `302100` | Sakuya Suzuka | `group_8` | 3 | `vo_char_3021_00_15_hca.hca` | 6.80s | 6.82s | +0.02s |
| `302600` | Konoha Shizumi | `group_29` | 5 | `vo_char_3026_00_37_hca.hca` | 11.00s | 11.02s | +0.02s |
| `302700` | Hazuki Yusa | `group_17` | 5 | `vo_char_3027_00_25_hca.hca` | 17.00s | 16.98s | -0.02s |
| `302700` | Hazuki Yusa | `group_42` | 4 | `vo_char_3027_00_66_hca.hca` | 4.00s | 3.98s | -0.02s |
| `302900` | Masara Kagami | `group_22` | 3 | `vo_char_3029_00_30_hca.hca` | 12.50s | 12.52s | +0.02s |
| `303000` | Konomi Haruna | `group_41` | 4 | `vo_char_3030_00_65_hca.hca` | 4.00s | 3.98s | -0.02s |
| `303051` | Konomi Haruna | `group_41` | 2 | `vo_char_3030_00_65_hca.hca` | 4.00s | 3.98s | -0.02s |
| `303100` | Rika Ayano | `group_12` | 5 | `vo_char_3031_00_20_hca.hca` | 4.50s | 4.48s | -0.02s |
| `303100` | Rika Ayano | `group_19` | 9 | `vo_char_3031_00_27_hca.hca` | 10.50s | 10.52s | +0.02s |
| `303300` | Sayuki Fumino | `group_17` | 6 | `vo_char_3033_00_24_hca.hca` | 15.00s | 14.98s | -0.02s |
| `303300` | Sayuki Fumino | `group_31` | 5 | `vo_char_3033_00_38_hca.hca` | 11.90s | 11.92s | +0.02s |
| `303551` | Riko Chiaki | `group_2` | 2 | `vo_char_3035_00_03_hca.hca` | 5.00s | 5.02s | +0.02s |
| `304750` | Chika Aoba | `group_33` | 7 | `vo_char_3047_50_41_hca.hca` | 15.70s | 15.68s | -0.02s |
| `305100` | Jun Kazari | `group_3` | 2 | `vo_char_3051_00_03_hca.hca` | 4.00s | 3.98s | -0.02s |
| `305800` | Ryoko Natsu | `group_2` | 6 | `vo_char_3058_00_02_hca.hca` | 13.20s | 13.22s | +0.02s |
| `350100` | Rika & Ren | `group_30` | 5 | `vo_char_3501_00_37_hca.hca` | 12.00s | 11.98s | -0.02s |
| `350401` | Masara & Kokoro | `group_6` | 2 | `vo_char_3504_00_13_hca.hca` | 3.80s | 3.82s | +0.02s |
| `350402` | Masara & Kokoro | `group_20` | 5 | `vo_char_3504_02_27_hca.hca` | 17.20s | 17.22s | +0.02s |
| `350402` | Masara & Kokoro | `group_25` | 4 | `vo_char_3504_02_32_hca.hca` | 12.30s | 12.32s | +0.02s |
| `350402` | Masara & Kokoro | `group_6` | 2 | `vo_char_3504_00_13_hca.hca` | 3.80s | 3.82s | +0.02s |
| `390200` | Shi | `group_31` | 5 | `vo_char_3902_00_38_hca.hca` | 12.40s | 12.38s | -0.02s |
| `390201` | Shi | `group_9` | 4 | `vo_char_3902_00_16_hca.hca` | 15.60s | 15.58s | -0.02s |
| `400100` | Oriko Mikuni | `group_29` | 6 | `vo_char_4001_00_37_hca.hca` | 12.00s | 11.98s | -0.02s |
| `402300` | Melissa | `group_12` | 3 | `vo_char_4023_00_20_hca.hca` | 6.00s | 6.02s | +0.02s |
| `402650` | Elisa | `group_19` | 5 | `vo_char_4026_50_26_hca.hca` | 13.00s | 12.98s | -0.02s |
| `404400` | Nadeko Sengoku | `group_43` | 7 | `vo_char_4044_00_02_hca.hca` | 28.70s | 28.72s | +0.02s |
| `405200` | Fate | `group_12` | 4 | `vo_char_4052_00_19_hca.hca` | 4.50s | 4.48s | -0.02s |
| `405200` | Fate | `group_7` | 4 | `vo_char_4052_00_14_hca.hca` | 3.50s | 3.48s | -0.02s |
| `100150` | Iroha Tamaki | `group_27` | 3 | `vo_char_1001_50_35_hca.hca` | 10.00s | 9.97s | -0.03s |
| `100354` | Tsuruno Yui | `group_31` | 6 | `vo_char_1003_54_39_hca.hca` | 12.00s | 11.97s | -0.03s |
| `100700` | Touka Satomi | `group_20` | 6 | `vo_char_1007_00_27_hca.hca` | 11.80s | 11.83s | +0.03s |
| `101100` | Kaede Akino | `group_16` | 7 | `vo_char_1011_00_24_hca.hca` | 15.00s | 14.97s | -0.03s |
| `101100` | Kaede Akino | `group_29` | 7 | `vo_char_1011_00_37_hca.hca` | 12.50s | 12.47s | -0.03s |
| `101100` | Kaede Akino | `group_30` | 5 | `vo_char_1011_00_38_hca.hca` | 13.50s | 13.47s | -0.03s |
| `101200` | Karin Misono | `group_4` | 4 | `vo_char_1012_00_05_hca.hca` | 5.00s | 4.97s | -0.03s |
| `101250` | Karin Misono | `group_4` | 3 | `vo_char_1012_00_05_hca.hca` | 5.00s | 4.97s | -0.03s |
| `101300` | Asuka Tatsuki | `group_14` | 7 | `vo_char_1013_00_22_hca.hca` | 18.00s | 17.97s | -0.03s |
| `101300` | Asuka Tatsuki | `group_22` | 7 | `vo_char_1013_00_30_hca.hca` | 10.50s | 10.47s | -0.03s |
| `101300` | Asuka Tatsuki | `group_5` | 6 | `vo_char_1013_00_13_hca.hca` | 6.00s | 6.03s | +0.03s |
| `101550` | Ui Tamaki | `group_24` | 4 | `vo_char_1015_50_31_hca.hca` | 13.00s | 12.97s | -0.03s |
| `101700` | Mitama Yakumo | `group_47` | 4 | `vo_game_0702_04_hca.hca` | 7.60s | 7.57s | -0.03s |
| `101800` | Tsukuyo Amane | `group_40` | 4 | `vo_char_1018_00_64_hca.hca` | 4.00s | 3.97s | -0.03s |
| `101850` | Tsukuyo Amane | `group_40` | 3 | `vo_char_1018_00_64_hca.hca` | 4.00s | 3.97s | -0.03s |
| `102400` | Juri Oba | `group_43` | 5 | `vo_game_0502_04_hca.hca` | 11.60s | 11.57s | -0.03s |
| `102850` | Himena Aika | `group_28` | 4 | `vo_char_1028_50_35_hca.hca` | 10.00s | 10.03s | +0.03s |
| `102850` | Himena Aika | `group_31` | 6 | `vo_char_1028_50_38_hca.hca` | 13.00s | 12.97s | -0.03s |
| `103050` | Hagumu Azumi | `group_30` | 4 | `vo_char_1030_50_37_hca.hca` | 13.00s | 12.97s | -0.03s |
| `103200` | Miyuri Yukari | `group_14` | 5 | `vo_char_1032_00_21_hca.hca` | 13.70s | 13.67s | -0.03s |
| `103300` | Rabi Himuro | `group_16` | 9 | `vo_char_1033_00_23_hca.hca` | 26.20s | 26.17s | -0.03s |
| `103350` | Rabi Himuro | `group_16` | 9 | `vo_char_1033_00_23_hca.hca` | 26.20s | 26.17s | -0.03s |
| `104300` | Kuroe | `group_26` | 5 | `vo_char_1043_00_33_hca.hca` | 11.70s | 11.73s | +0.03s |
| `104900` | Olga | `group_24` | 6 | `vo_char_1049_00_31_hca.hca` | 14.30s | 14.33s | +0.03s |
| `110500` | Felicia-chan | `group_1` | 6 | `vo_char_1105_00_01_hca.hca` | 18.40s | 18.43s | +0.03s |
| `110700` | Touka & Nemu | `group_25` | 4 | `vo_char_1107_00_32_hca.hca` | 13.60s | 13.57s | -0.03s |
| `111200` | Karin & Alina | `group_14` | 6 | `vo_char_1112_00_21_hca.hca` | 14.10s | 14.07s | -0.03s |
| `111201` | Karin & Alina | `group_14` | 5 | `vo_char_1112_00_21_hca.hca` | 14.10s | 14.07s | -0.03s |
| `111201` | Karin & Alina | `group_22` | 4 | `vo_char_1112_01_29_hca.hca` | 10.90s | 10.87s | -0.03s |
| `111202` | Karin & Alina | `group_14` | 5 | `vo_char_1112_00_21_hca.hca` | 14.10s | 14.07s | -0.03s |
| `111700` | Mitama Yakumo | `group_45` | 4 | `vo_game_0102_02_hca.hca` | 7.40s | 7.37s | -0.03s |
| `111800` | Amane Sisters | `group_18` | 5 | `vo_char_1118_00_25_hca.hca` | 10.60s | 10.63s | +0.03s |
| `210100` | Ultimate Madoka | `group_28` | 6 | `vo_char_2101_00_36_hca.hca` | 13.70s | 13.67s | -0.03s |
| `220200` | Devil Homura | `group_27` | 4 | `vo_char_2202_00_34_hca.hca` | 13.00s | 13.03s | +0.03s |
| `220200` | Devil Homura | `group_6` | 3 | `vo_char_2202_00_13_hca.hca` | 5.80s | 5.77s | -0.03s |
| `250000` | Holy Mami | `group_34` | 2 | `vo_char_2500_00_42_hca.hca` | 3.00s | 2.97s | -0.03s |
| `250001` | Holy Mami | `group_34` | 2 | `vo_char_2500_00_42_hca.hca` | 3.00s | 2.97s | -0.03s |
| `260000` | Kyoko Sakura | `group_13` | 3 | `vo_char_2600_00_20_hca.hca` | 6.00s | 5.97s | -0.03s |
| `300300` | Hinano Miyako | `group_19` | 7 | `vo_char_3003_00_27_hca.hca` | 12.00s | 11.97s | -0.03s |
| `300300` | Hinano Miyako | `group_29` | 5 | `vo_char_3003_00_37_hca.hca` | 11.50s | 11.47s | -0.03s |
| `300351` | Hinano Miyako | `group_24` | 4 | `vo_char_3003_51_32_hca.hca` | 9.00s | 8.97s | -0.03s |
| `300400` | Sasara Minagi | `group_28` | 8 | `vo_char_3004_00_36_hca.hca` | 11.50s | 11.47s | -0.03s |
| `300400` | Sasara Minagi | `group_40` | 5 | `vo_char_3004_00_64_hca.hca` | 5.00s | 5.03s | +0.03s |
| `300900` | Manaka Kurumi | `group_41` | 6 | `vo_char_3009_00_65_hca.hca` | 4.50s | 4.53s | +0.03s |
| `301300` | Leila Ibuki | `group_28` | 7 | `vo_char_3013_00_36_hca.hca` | 15.80s | 15.77s | -0.03s |
| `301500` | Mito Aino | `group_40` | 4 | `vo_char_3015_00_64_hca.hca` | 3.00s | 2.97s | -0.03s |
| `301900` | Ayaka Mariko | `group_19` | 5 | `vo_char_3019_00_27_hca.hca` | 10.00s | 10.03s | +0.03s |
| `302600` | Konoha Shizumi | `group_30` | 6 | `vo_char_3026_00_38_hca.hca` | 12.00s | 11.97s | -0.03s |
| `302950` | Masara Kagami | `group_18` | 3 | `vo_char_3029_50_26_hca.hca` | 12.00s | 11.97s | -0.03s |
| `303000` | Konomi Haruna | `group_17` | 7 | `vo_char_3030_00_25_hca.hca` | 9.50s | 9.53s | +0.03s |
| `303000` | Konomi Haruna | `group_25` | 7 | `vo_char_3030_00_33_hca.hca` | 10.50s | 10.47s | -0.03s |
| `303100` | Rika Ayano | `group_36` | 5 | `vo_char_3031_00_44_hca.hca` | 3.00s | 2.97s | -0.03s |
| `304300` | Eternal Sakura | `group_32` | 5 | `vo_char_3043_00_39_hca.hca` | 16.00s | 15.97s | -0.03s |
| `304900` | Kanae Yukino | `group_1` | 6 | `vo_char_3049_00_01_hca.hca` | 26.00s | 26.03s | +0.03s |
| `304950` | Kanae Yukino | `group_1` | 5 | `vo_char_3049_00_01_hca.hca` | 26.00s | 26.03s | +0.03s |
| `350400` | Masara & Kokoro | `group_25` | 3 | `vo_char_3504_00_32_hca.hca` | 10.40s | 10.37s | -0.03s |
| `350401` | Masara & Kokoro | `group_10` | 6 | `vo_char_3504_00_17_hca.hca` | 18.60s | 18.57s | -0.03s |
| `350402` | Masara & Kokoro | `group_10` | 6 | `vo_char_3504_00_17_hca.hca` | 18.60s | 18.57s | -0.03s |
| `400300` | Yuma Chitose | `group_37` | 3 | `vo_char_4003_00_45_hca.hca` | 2.50s | 2.53s | +0.03s |
| `400300` | Yuma Chitose | `group_41` | 4 | `vo_char_4003_00_65_hca.hca` | 3.50s | 3.53s | +0.03s |
| `401200` | Umika Misaki | `group_11` | 4 | `vo_char_4012_00_19_hca.hca` | 6.00s | 5.97s | -0.03s |
| `402200` | Riz | `group_16` | 5 | `vo_char_4022_00_24_hca.hca` | 13.00s | 12.97s | -0.03s |
| `402200` | Riz | `group_40` | 3 | `vo_char_4022_00_64_hca.hca` | 2.00s | 1.97s | -0.03s |
| `402300` | Melissa | `group_11` | 3 | `vo_char_4023_00_19_hca.hca` | 5.00s | 4.97s | -0.03s |
| `404500` | Tsubasa Hanekawa | `group_27` | 2 | `vo_char_4045_00_34_hca.hca` | 11.90s | 11.93s | +0.03s |
| `405300` | Hayate Yagami | `group_27` | 5 | `vo_char_4053_00_34_hca.hca` | 9.50s | 9.53s | +0.03s |
| `100100` | Iroha Tamaki | `group_27` | 7 | `vo_char_1001_00_35_hca.hca` | 13.00s | 12.96s | -0.04s |
| `100100` | Iroha Tamaki | `group_29` | 7 | `vo_char_1001_00_37_hca.hca` | 11.00s | 10.96s | -0.04s |
| `100100` | Iroha Tamaki | `group_36` | 3 | `vo_char_1001_00_44_hca.hca` | 3.00s | 2.96s | -0.04s |
| `100100` | Iroha Tamaki | `group_5` | 5 | `vo_char_1001_00_13_hca.hca` | 7.00s | 7.04s | +0.04s |
| `100103` | Iroha Tamaki | `group_36` | 3 | `vo_char_1001_00_44_hca.hca` | 3.00s | 2.96s | -0.04s |
| `100103` | Iroha Tamaki | `group_5` | 5 | `vo_char_1001_00_13_hca.hca` | 7.00s | 7.04s | +0.04s |
| `100150` | Iroha Tamaki | `group_36` | 2 | `vo_char_1001_00_44_hca.hca` | 3.00s | 2.96s | -0.04s |
| `100150` | Iroha Tamaki | `group_5` | 4 | `vo_char_1001_00_13_hca.hca` | 7.00s | 7.04s | +0.04s |
| `100153` | Iroha Tamaki | `group_36` | 2 | `vo_char_1001_00_44_hca.hca` | 3.00s | 2.96s | -0.04s |
| `100153` | Iroha Tamaki | `group_5` | 4 | `vo_char_1001_00_13_hca.hca` | 7.00s | 7.04s | +0.04s |
| `100251` | Yachiyo Nanami | `group_18` | 4 | `vo_char_1002_51_26_hca.hca` | 10.90s | 10.94s | +0.04s |
| `100350` | Tsuruno Yui | `group_20` | 5 | `vo_char_1003_50_28_hca.hca` | 12.00s | 11.96s | -0.04s |
| `100400` | Sana Futaba | `group_16` | 8 | `vo_char_1004_00_24_hca.hca` | 14.00s | 13.96s | -0.04s |
| `100550` | Felicia Mitsuki | `group_20` | 5 | `vo_char_1005_50_28_hca.hca` | 14.00s | 14.04s | +0.04s |
| `100700` | Touka Satomi | `group_15` | 7 | `vo_char_1007_00_22_hca.hca` | 17.80s | 17.84s | +0.04s |
| `100750` | Touka Satomi | `group_15` | 7 | `vo_char_1007_00_22_hca.hca` | 17.80s | 17.84s | +0.04s |
| `100900` | Rena Minami | `group_26` | 6 | `vo_char_1009_00_34_hca.hca` | 8.50s | 8.54s | +0.04s |
| `101000` | Momoko Togame | `group_7` | 6 | `vo_char_1010_00_15_hca.hca` | 6.00s | 5.96s | -0.04s |
| `101051` | Momoko Togame | `group_24` | 3 | `vo_char_1010_51_32_hca.hca` | 10.50s | 10.54s | +0.04s |
| `101051` | Momoko Togame | `group_7` | 5 | `vo_char_1010_00_15_hca.hca` | 6.00s | 5.96s | -0.04s |
| `101152` | Kaede Akino | `group_19` | 5 | `vo_char_1011_52_27_hca.hca` | 13.70s | 13.66s | -0.04s |
| `101701` | Mitama Yakumo | `group_45` | 5 | `vo_game_0202_02_hca.hca` | 6.50s | 6.54s | +0.04s |
| `101850` | Tsukuyo Amane | `group_33` | 5 | `vo_char_1018_50_41_hca.hca` | 17.00s | 16.96s | -0.04s |
| `102200` | Hikaru Kirari | `group_1` | 6 | `vo_char_1022_00_01_hca.hca` | 20.50s | 20.46s | -0.04s |
| `102250` | Hikaru Kirari | `group_1` | 5 | `vo_char_1022_00_01_hca.hca` | 20.50s | 20.46s | -0.04s |
| `103050` | Hagumu Azumi | `group_21` | 5 | `vo_char_1030_50_28_hca.hca` | 17.60s | 17.56s | -0.04s |
| `103350` | Rabi Himuro | `group_17` | 6 | `vo_char_1033_50_24_hca.hca` | 15.40s | 15.36s | -0.04s |
| `103350` | Rabi Himuro | `group_21` | 4 | `vo_char_1033_50_28_hca.hca` | 16.00s | 15.96s | -0.04s |
| `104400` | Mikoto Sena | `group_28` | 5 | `vo_char_1044_00_35_hca.hca` | 14.20s | 14.16s | -0.04s |
| `104400` | Mikoto Sena | `group_37` | 2 | `vo_char_1044_00_44_hca.hca` | 2.10s | 2.14s | +0.04s |
| `110100` | Iroha Tamaki | `group_40` | 2 | `vo_char_1101_00_64_hca.hca` | 3.00s | 3.04s | +0.04s |
| `110401` | Uwasa Sana | `group_19` | 4 | `vo_char_1104_01_26_hca.hca` | 13.70s | 13.74s | +0.04s |
| `110800` | Holy Alina | `group_30` | 3 | `vo_char_1108_00_37_hca.hca` | 10.00s | 9.96s | -0.04s |
| `111000` | Momoko Togame | `group_16` | 4 | `vo_char_1110_00_23_hca.hca` | 14.40s | 14.36s | -0.04s |
| `111200` | Karin & Alina | `group_28` | 7 | `vo_char_1112_00_35_hca.hca` | 19.20s | 19.24s | +0.04s |
| `111201` | Karin & Alina | `group_33` | 5 | `vo_char_1112_01_40_hca.hca` | 13.00s | 13.04s | +0.04s |
| `111202` | Karin & Alina | `group_20` | 5 | `vo_char_1112_02_27_hca.hca` | 11.10s | 11.14s | +0.04s |
| `200200` | Homura Akemi | `group_21` | 4 | `vo_char_2002_00_28_hca.hca` | 13.35s | 13.31s | -0.04s |
| `200200` | Homura Akemi | `group_4` | 3 | `vo_char_2002_00_04_hca.hca` | 3.60s | 3.56s | -0.04s |
| `200400` | Sayaka Miki | `group_38` | 4 | `vo_char_2004_00_46_hca.hca` | 3.00s | 2.96s | -0.04s |
| `200451` | Sayaka Miki | `group_38` | 2 | `vo_char_2004_00_46_hca.hca` | 3.00s | 2.96s | -0.04s |
| `200600` | Kyoko Sakura | `group_24` | 7 | `vo_char_2006_00_32_hca.hca` | 12.00s | 11.96s | -0.04s |
| `200600` | Kyoko Sakura | `group_31` | 6 | `vo_char_2006_00_39_hca.hca` | 11.00s | 10.96s | -0.04s |
| `200700` | Nagisa Momoe | `group_20` | 6 | `vo_char_2007_00_27_hca.hca` | 15.10s | 15.06s | -0.04s |
| `210100` | Ultimate Madoka | `group_20` | 7 | `vo_char_2101_00_28_hca.hca` | 11.50s | 11.54s | +0.04s |
| `240000` | Sayaka Miki | `group_14` | 5 | `vo_char_2400_00_21_hca.hca` | 10.80s | 10.76s | -0.04s |
| `240000` | Sayaka Miki | `group_39` | 2 | `vo_char_2400_00_46_hca.hca` | 4.00s | 3.96s | -0.04s |
| `250001` | Holy Mami | `group_20` | 5 | `vo_char_2500_01_28_hca.hca` | 13.00s | 12.96s | -0.04s |
| `300300` | Hinano Miyako | `group_41` | 4 | `vo_char_3003_00_65_hca.hca` | 5.50s | 5.54s | +0.04s |
| `300351` | Hinano Miyako | `group_41` | 3 | `vo_char_3003_00_65_hca.hca` | 5.50s | 5.54s | +0.04s |
| `300500` | Nanaka Tokiwa | `group_21` | 6 | `vo_char_3005_00_29_hca.hca` | 12.50s | 12.46s | -0.04s |
| `300500` | Nanaka Tokiwa | `group_29` | 7 | `vo_char_3005_00_37_hca.hca` | 12.50s | 12.46s | -0.04s |
| `300500` | Nanaka Tokiwa | `group_7` | 4 | `vo_char_3005_00_15_hca.hca` | 5.50s | 5.46s | -0.04s |
| `300700` | Shizuku Hozumi | `group_35` | 3 | `vo_char_3007_00_43_hca.hca` | 1.50s | 1.46s | -0.04s |
| `300700` | Shizuku Hozumi | `group_36` | 4 | `vo_char_3007_00_44_hca.hca` | 2.50s | 2.46s | -0.04s |
| `300700` | Shizuku Hozumi | `group_40` | 4 | `vo_char_3007_00_64_hca.hca` | 3.00s | 3.04s | +0.04s |
| `300750` | Shizuku Hozumi | `group_36` | 2 | `vo_char_3007_00_44_hca.hca` | 2.50s | 2.46s | -0.04s |
| `300750` | Shizuku Hozumi | `group_40` | 2 | `vo_char_3007_00_64_hca.hca` | 3.00s | 3.04s | +0.04s |
| `300800` | Akira Shinobu | `group_2` | 6 | `vo_char_3008_00_03_hca.hca` | 3.50s | 3.46s | -0.04s |
| `300850` | Akira Shinobu | `group_2` | 3 | `vo_char_3008_00_03_hca.hca` | 3.50s | 3.46s | -0.04s |
| `300900` | Manaka Kurumi | `group_8` | 7 | `vo_char_3009_00_16_hca.hca` | 10.50s | 10.54s | +0.04s |
| `301000` | Ria Ami | `group_13` | 8 | `vo_char_3010_00_21_hca.hca` | 13.00s | 12.96s | -0.04s |
| `301051` | Ria Ami | `group_13` | 6 | `vo_char_3010_00_21_hca.hca` | 13.00s | 12.96s | -0.04s |
| `301100` | Kako Natsume | `group_2` | 4 | `vo_char_3011_00_03_hca.hca` | 7.00s | 6.96s | -0.04s |
| `301100` | Kako Natsume | `group_22` | 5 | `vo_char_3011_00_30_hca.hca` | 9.50s | 9.46s | -0.04s |
| `301150` | Kako Natsume | `group_16` | 5 | `vo_char_3011_50_24_hca.hca` | 17.00s | 16.96s | -0.04s |
| `301150` | Kako Natsume | `group_2` | 2 | `vo_char_3011_00_03_hca.hca` | 7.00s | 6.96s | -0.04s |
| `301151` | Kako Natsume | `group_2` | 2 | `vo_char_3011_00_03_hca.hca` | 7.00s | 6.96s | -0.04s |
| `301151` | Kako Natsume | `group_30` | 5 | `vo_char_3011_51_38_hca.hca` | 12.00s | 11.96s | -0.04s |
| `301400` | Seika Kumi | `group_12` | 4 | `vo_char_3014_00_20_hca.hca` | 6.00s | 5.96s | -0.04s |
| `301950` | Ayaka Mariko | `group_26` | 4 | `vo_char_3019_50_34_hca.hca` | 10.30s | 10.34s | +0.04s |
| `302100` | Sakuya Suzuka | `group_14` | 5 | `vo_char_3021_00_21_hca.hca` | 10.50s | 10.46s | -0.04s |
| `302800` | Ayame Mikuri | `group_8` | 7 | `vo_char_3028_00_16_hca.hca` | 10.40s | 10.44s | +0.04s |
| `302900` | Masara Kagami | `group_41` | 2 | `vo_char_3029_00_65_hca.hca` | 3.00s | 3.04s | +0.04s |
| `302950` | Masara Kagami | `group_41` | 2 | `vo_char_3029_00_65_hca.hca` | 3.00s | 3.04s | +0.04s |
| `303250` | Mayu Kozue | `group_33` | 6 | `vo_char_3032_50_41_hca.hca` | 18.00s | 17.96s | -0.04s |
| `350401` | Masara & Kokoro | `group_17` | 5 | `vo_char_3504_01_24_hca.hca` | 15.20s | 15.16s | -0.04s |
| `390200` | Shi | `group_26` | 6 | `vo_char_3902_00_33_hca.hca` | 13.80s | 13.76s | -0.04s |
| `402300` | Melissa | `group_1` | 7 | `vo_char_4023_00_01_hca.hca` | 23.00s | 22.96s | -0.04s |
| `402300` | Melissa | `group_32` | 5 | `vo_char_4023_00_40_hca.hca` | 11.00s | 11.04s | +0.04s |
| `402350` | Melissa | `group_1` | 5 | `vo_char_4023_00_01_hca.hca` | 23.00s | 22.96s | -0.04s |
| `402500` | Corbeau | `group_22` | 5 | `vo_char_4025_00_29_hca.hca` | 15.60s | 15.64s | +0.04s |
| `402500` | Corbeau | `group_39` | 2 | `vo_char_4025_00_46_hca.hca` | 2.50s | 2.54s | +0.04s |
| `402600` | Elisa | `group_11` | 5 | `vo_char_4026_00_18_hca.hca` | 12.90s | 12.94s | +0.04s |
| `402650` | Elisa | `group_11` | 4 | `vo_char_4026_00_18_hca.hca` | 12.90s | 12.94s | +0.04s |
| `403500` | Haruka Kanade | `group_19` | 4 | `vo_char_4035_00_26_hca.hca` | 10.50s | 10.54s | +0.04s |
| `404600` | Shinobu Oshino | `group_13` | 2 | `vo_char_4046_00_20_hca.hca` | 6.00s | 5.96s | -0.04s |
| `404600` | Shinobu Oshino | `group_14` | 2 | `vo_char_4046_00_21_hca.hca` | 6.00s | 5.96s | -0.04s |
| `404600` | Shinobu Oshino | `group_15` | 2 | `vo_char_4046_00_22_hca.hca` | 6.00s | 5.96s | -0.04s |
| `404600` | Shinobu Oshino | `group_16` | 2 | `vo_char_4046_00_23_hca.hca` | 6.00s | 5.96s | -0.04s |
| `405100` | Nanoha Takamachi | `group_35` | 4 | `vo_char_4051_00_42_hca.hca` | 4.00s | 3.96s | -0.04s |
| `405100` | Nanoha Takamachi | `group_42` | 3 | `vo_char_4051_00_65_hca.hca` | 1.00s | 0.96s | -0.04s |
| `405200` | Fate | `group_21` | 8 | `vo_char_4052_00_28_hca.hca` | 17.50s | 17.54s | +0.04s |
| `405200` | Fate | `group_26` | 5 | `vo_char_4052_00_33_hca.hca` | 8.00s | 7.96s | -0.04s |
| `100150` | Iroha Tamaki | `group_29` | 6 | `vo_char_1001_50_37_hca.hca` | 14.00s | 13.95s | -0.05s |
| `100251` | Yachiyo Nanami | `group_21` | 4 | `vo_char_1002_51_29_hca.hca` | 8.90s | 8.85s | -0.05s |
| `100651` | Mifuyu Azusa | `group_22` | 4 | `vo_char_1006_51_30_hca.hca` | 9.80s | 9.85s | +0.05s |
| `100700` | Touka Satomi | `group_23` | 6 | `vo_char_1007_00_30_hca.hca` | 13.10s | 13.15s | +0.05s |
| `100750` | Touka Satomi | `group_21` | 6 | `vo_char_1007_50_28_hca.hca` | 11.50s | 11.55s | +0.05s |
| `100900` | Rena Minami | `group_34` | 3 | `vo_char_1009_00_42_hca.hca` | 2.00s | 1.95s | -0.05s |
| `100950` | Rena Minami | `group_34` | 2 | `vo_char_1009_00_42_hca.hca` | 2.00s | 1.95s | -0.05s |
| `100951` | Rena Minami | `group_34` | 2 | `vo_char_1009_00_42_hca.hca` | 2.00s | 1.95s | -0.05s |
| `101000` | Momoko Togame | `group_12` | 5 | `vo_char_1010_00_20_hca.hca` | 4.00s | 3.95s | -0.05s |
| `101051` | Momoko Togame | `group_12` | 4 | `vo_char_1010_00_20_hca.hca` | 4.00s | 3.95s | -0.05s |
| `101100` | Kaede Akino | `group_15` | 9 | `vo_char_1011_00_23_hca.hca` | 22.00s | 21.95s | -0.05s |
| `101150` | Kaede Akino | `group_15` | 8 | `vo_char_1011_00_23_hca.hca` | 22.00s | 21.95s | -0.05s |
| `101152` | Kaede Akino | `group_15` | 7 | `vo_char_1011_00_23_hca.hca` | 22.00s | 21.95s | -0.05s |
| `101250` | Karin Misono | `group_31` | 6 | `vo_char_1012_50_39_hca.hca` | 16.00s | 15.95s | -0.05s |
| `101300` | Asuka Tatsuki | `group_10` | 9 | `vo_char_1013_00_18_hca.hca` | 12.00s | 11.95s | -0.05s |
| `101500` | Ui Tamaki | `group_34` | 6 | `vo_char_1015_00_41_hca.hca` | 13.90s | 13.95s | +0.05s |
| `101700` | Mitama Yakumo | `group_61` | 4 | `vo_game_0902_12_hca.hca` | 10.60s | 10.65s | +0.05s |
| `101700` | Mitama Yakumo | `group_66` | 6 | `vo_game_1102_08_hca.hca` | 14.70s | 14.75s | +0.05s |
| `101900` | Tsukasa Amane | `group_2` | 3 | `vo_char_1019_00_03_hca.hca` | 5.00s | 4.95s | -0.05s |
| `101900` | Tsukasa Amane | `group_3` | 4 | `vo_char_1019_00_04_hca.hca` | 4.00s | 3.95s | -0.05s |
| `101951` | Tsukasa Amane | `group_19` | 4 | `vo_char_1019_51_27_hca.hca` | 11.00s | 10.95s | -0.05s |
| `101951` | Tsukasa Amane | `group_2` | 2 | `vo_char_1019_00_03_hca.hca` | 5.00s | 4.95s | -0.05s |
| `101951` | Tsukasa Amane | `group_3` | 3 | `vo_char_1019_00_04_hca.hca` | 4.00s | 3.95s | -0.05s |
| `102200` | Hikaru Kirari | `group_12` | 3 | `vo_char_1022_00_19_hca.hca` | 3.30s | 3.35s | +0.05s |
| `102200` | Hikaru Kirari | `group_6` | 3 | `vo_char_1022_00_13_hca.hca` | 5.00s | 4.95s | -0.05s |
| `102250` | Hikaru Kirari | `group_12` | 2 | `vo_char_1022_00_19_hca.hca` | 3.30s | 3.35s | +0.05s |
| `102250` | Hikaru Kirari | `group_23` | 5 | `vo_char_1022_50_30_hca.hca` | 9.20s | 9.25s | +0.05s |
| `102250` | Hikaru Kirari | `group_6` | 2 | `vo_char_1022_00_13_hca.hca` | 5.00s | 4.95s | -0.05s |
| `102800` | Himena Aika | `group_13` | 3 | `vo_char_1028_00_20_hca.hca` | 5.10s | 5.05s | -0.05s |
| `102850` | Himena Aika | `group_13` | 2 | `vo_char_1028_00_20_hca.hca` | 5.10s | 5.05s | -0.05s |
| `102900` | Shigure Miyabi | `group_16` | 5 | `vo_char_1029_00_23_hca.hca` | 25.00s | 24.95s | -0.05s |
| `102950` | Shigure Miyabi | `group_16` | 5 | `vo_char_1029_00_23_hca.hca` | 25.00s | 24.95s | -0.05s |
| `102950` | Shigure Miyabi | `group_17` | 4 | `vo_char_1029_50_24_hca.hca` | 15.00s | 14.95s | -0.05s |
| `104400` | Mikoto Sena | `group_25` | 5 | `vo_char_1044_00_32_hca.hca` | 15.30s | 15.35s | +0.05s |
| `105300` | Amaryllis | `group_14` | 4 | `vo_char_1053_00_21_hca.hca` | 10.50s | 10.55s | +0.05s |
| `105302` | Amaryllis | `group_14` | 3 | `vo_char_1053_00_21_hca.hca` | 10.50s | 10.55s | +0.05s |
| `111600` | Kanagi Izumi | `group_15` | 8 | `vo_char_1116_00_22_hca.hca` | 21.60s | 21.55s | -0.05s |
| `111801` | Amane Sisters | `group_22` | 4 | `vo_char_1118_01_29_hca.hca` | 10.00s | 9.95s | -0.05s |
| `120901` | Rena & Kaede | `group_27` | 7 | `vo_char_1209_01_34_hca.hca` | 15.50s | 15.45s | -0.05s |
| `130100` | Iroha & Yachiyo | `group_33` | 6 | `vo_char_1301_00_40_hca.hca` | 15.90s | 15.95s | +0.05s |
| `200200` | Homura Akemi | `group_12` | 2 | `vo_char_2002_00_19_hca.hca` | 6.10s | 6.05s | -0.05s |
| `200400` | Sayaka Miki | `group_14` | 7 | `vo_char_2004_00_22_hca.hca` | 18.80s | 18.85s | +0.05s |
| `200451` | Sayaka Miki | `group_14` | 5 | `vo_char_2004_00_22_hca.hca` | 18.80s | 18.85s | +0.05s |
| `200900` | Mabayu Aki | `group_20` | 6 | `vo_char_2009_00_27_hca.hca` | 13.60s | 13.65s | +0.05s |
| `240000` | Sayaka Miki | `group_3` | 2 | `vo_char_2400_00_03_hca.hca` | 7.00s | 6.95s | -0.05s |
| `300300` | Hinano Miyako | `group_16` | 6 | `vo_char_3003_00_24_hca.hca` | 9.50s | 9.55s | +0.05s |
| `300300` | Hinano Miyako | `group_20` | 6 | `vo_char_3003_00_28_hca.hca` | 9.00s | 8.95s | -0.05s |
| `300400` | Sasara Minagi | `group_30` | 7 | `vo_char_3004_00_38_hca.hca` | 11.00s | 11.05s | +0.05s |
| `300500` | Nanaka Tokiwa | `group_41` | 4 | `vo_char_3005_00_65_hca.hca` | 3.50s | 3.55s | +0.05s |
| `300600` | Emiri Kisaki | `group_15` | 9 | `vo_char_3006_00_23_hca.hca` | 19.80s | 19.75s | -0.05s |
| `300600` | Emiri Kisaki | `group_16` | 10 | `vo_char_3006_00_24_hca.hca` | 10.00s | 9.95s | -0.05s |
| `300600` | Emiri Kisaki | `group_31` | 6 | `vo_char_3006_00_39_hca.hca` | 10.50s | 10.45s | -0.05s |
| `300651` | Emiri Kisaki | `group_15` | 7 | `vo_char_3006_00_23_hca.hca` | 19.80s | 19.75s | -0.05s |
| `300700` | Shizuku Hozumi | `group_11` | 5 | `vo_char_3007_00_19_hca.hca` | 7.00s | 6.95s | -0.05s |
| `300700` | Shizuku Hozumi | `group_7` | 4 | `vo_char_3007_00_15_hca.hca` | 6.50s | 6.55s | +0.05s |
| `300750` | Shizuku Hozumi | `group_11` | 3 | `vo_char_3007_00_19_hca.hca` | 7.00s | 6.95s | -0.05s |
| `300750` | Shizuku Hozumi | `group_7` | 2 | `vo_char_3007_00_15_hca.hca` | 6.50s | 6.55s | +0.05s |
| `300800` | Akira Shinobu | `group_30` | 7 | `vo_char_3008_00_38_hca.hca` | 8.50s | 8.45s | -0.05s |
| `300800` | Akira Shinobu | `group_9` | 9 | `vo_char_3008_00_17_hca.hca` | 11.00s | 11.05s | +0.05s |
| `300850` | Akira Shinobu | `group_9` | 6 | `vo_char_3008_00_17_hca.hca` | 11.00s | 11.05s | +0.05s |
| `301100` | Kako Natsume | `group_7` | 5 | `vo_char_3011_00_15_hca.hca` | 5.50s | 5.45s | -0.05s |
| `301150` | Kako Natsume | `group_7` | 3 | `vo_char_3011_00_15_hca.hca` | 5.50s | 5.45s | -0.05s |
| `301151` | Kako Natsume | `group_27` | 4 | `vo_char_3011_51_35_hca.hca` | 13.00s | 12.95s | -0.05s |
| `301151` | Kako Natsume | `group_7` | 3 | `vo_char_3011_00_15_hca.hca` | 5.50s | 5.45s | -0.05s |
| `301800` | Hanna Sarasa | `group_29` | 7 | `vo_char_3018_00_36_hca.hca` | 14.50s | 14.45s | -0.05s |
| `302600` | Konoha Shizumi | `group_35` | 3 | `vo_char_3026_00_43_hca.hca` | 2.00s | 1.95s | -0.05s |
| `302900` | Masara Kagami | `group_36` | 2 | `vo_char_3029_00_44_hca.hca` | 3.50s | 3.45s | -0.05s |
| `303000` | Konomi Haruna | `group_29` | 6 | `vo_char_3030_00_37_hca.hca` | 9.50s | 9.45s | -0.05s |
| `303000` | Konomi Haruna | `group_35` | 4 | `vo_char_3030_00_43_hca.hca` | 2.50s | 2.55s | +0.05s |
| `303051` | Konomi Haruna | `group_35` | 2 | `vo_char_3030_00_43_hca.hca` | 2.50s | 2.55s | +0.05s |
| `303100` | Rika Ayano | `group_16` | 6 | `vo_char_3031_00_24_hca.hca` | 9.50s | 9.55s | +0.05s |
| `303100` | Rika Ayano | `group_37` | 4 | `vo_char_3031_00_45_hca.hca` | 3.00s | 2.95s | -0.05s |
| `304400` | Ranka Chizu | `group_24` | 4 | `vo_char_3044_00_31_hca.hca` | 12.51s | 12.46s | -0.05s |
| `304800` | Hotaru Yura | `group_7` | 6 | `vo_char_3048_00_14_hca.hca` | 9.50s | 9.55s | +0.05s |
| `305100` | Jun Kazari | `group_2` | 6 | `vo_char_3051_00_02_hca.hca` | 11.10s | 11.05s | -0.05s |
| `305251` | Ashley Taylor | `group_4` | 2 | `vo_char_3052_00_05_hca.hca` | 4.20s | 4.25s | +0.05s |
| `305400` | Mitsune Miwa | `group_3` | 2 | `vo_char_3054_00_03_hca.hca` | 6.00s | 5.95s | -0.05s |
| `390200` | Shi | `group_18` | 6 | `vo_char_3902_00_25_hca.hca` | 14.30s | 14.35s | +0.05s |
| `390200` | Shi | `group_20` | 6 | `vo_char_3902_00_27_hca.hca` | 17.70s | 17.65s | -0.05s |
| `390200` | Shi | `group_29` | 6 | `vo_char_3902_00_36_hca.hca` | 17.60s | 17.65s | +0.05s |
| `400100` | Oriko Mikuni | `group_25` | 9 | `vo_char_4001_00_33_hca.hca` | 12.00s | 12.05s | +0.05s |
| `400200` | Kirika Kure | `group_1` | 12 | `vo_char_4002_00_01_hca.hca` | 27.50s | 27.45s | -0.05s |
| `400300` | Yuma Chitose | `group_3` | 4 | `vo_char_4003_00_04_hca.hca` | 5.00s | 4.95s | -0.05s |
| `400300` | Yuma Chitose | `group_32` | 6 | `vo_char_4003_00_40_hca.hca` | 13.50s | 13.45s | -0.05s |
| `401200` | Umika Misaki | `group_32` | 4 | `vo_char_4012_00_40_hca.hca` | 12.00s | 11.95s | -0.05s |
| `404100` | Hitagi Senjougahara | `group_9` | 2 | `vo_char_4041_00_17_hca.hca` | 8.05s | 8.10s | +0.05s |
| `404400` | Nadeko Sengoku | `group_33` | 3 | `vo_char_4044_00_41_hca.hca` | 13.15s | 13.10s | -0.05s |
| `405200` | Fate | `group_9` | 5 | `vo_char_4052_00_16_hca.hca` | 8.00s | 7.95s | -0.05s |
| `405300` | Hayate Yagami | `group_18` | 4 | `vo_char_4053_00_25_hca.hca` | 4.50s | 4.55s | +0.05s |
| `405300` | Hayate Yagami | `group_38` | 4 | `vo_char_4053_00_45_hca.hca` | 3.00s | 2.95s | -0.05s |
| `100100` | Iroha Tamaki | `group_13` | 8 | `vo_char_1001_00_21_hca.hca` | 15.00s | 15.06s | +0.06s |
| `100100` | Iroha Tamaki | `group_34` | 4 | `vo_char_1001_00_42_hca.hca` | 2.50s | 2.56s | +0.06s |
| `100100` | Iroha Tamaki | `group_8` | 8 | `vo_char_1001_00_16_hca.hca` | 14.50s | 14.56s | +0.06s |
| `100103` | Iroha Tamaki | `group_13` | 8 | `vo_char_1001_00_21_hca.hca` | 15.00s | 15.06s | +0.06s |
| `100103` | Iroha Tamaki | `group_34` | 4 | `vo_char_1001_00_42_hca.hca` | 2.50s | 2.56s | +0.06s |
| `100103` | Iroha Tamaki | `group_8` | 8 | `vo_char_1001_00_16_hca.hca` | 14.50s | 14.56s | +0.06s |
| `100150` | Iroha Tamaki | `group_13` | 7 | `vo_char_1001_00_21_hca.hca` | 15.00s | 15.06s | +0.06s |
| `100150` | Iroha Tamaki | `group_34` | 3 | `vo_char_1001_00_42_hca.hca` | 2.50s | 2.56s | +0.06s |
| `100150` | Iroha Tamaki | `group_8` | 7 | `vo_char_1001_00_16_hca.hca` | 14.50s | 14.56s | +0.06s |
| `100153` | Iroha Tamaki | `group_13` | 7 | `vo_char_1001_00_21_hca.hca` | 15.00s | 15.06s | +0.06s |
| `100153` | Iroha Tamaki | `group_34` | 3 | `vo_char_1001_00_42_hca.hca` | 2.50s | 2.56s | +0.06s |
| `100153` | Iroha Tamaki | `group_8` | 7 | `vo_char_1001_00_16_hca.hca` | 14.50s | 14.56s | +0.06s |
| `100350` | Tsuruno Yui | `group_32` | 4 | `vo_char_1003_50_40_hca.hca` | 10.00s | 9.94s | -0.06s |
| `100451` | Sana Futaba | `group_32` | 6 | `vo_char_1004_51_40_hca.hca` | 12.90s | 12.84s | -0.06s |
| `100503` | Felicia Mitsuki | `group_25` | 6 | `vo_char_1005_03_33_hca.hca` | 11.00s | 10.94s | -0.06s |
| `100700` | Touka Satomi | `group_18` | 7 | `vo_char_1007_00_25_hca.hca` | 13.30s | 13.24s | -0.06s |
| `100700` | Touka Satomi | `group_27` | 5 | `vo_char_1007_00_34_hca.hca` | 11.50s | 11.56s | +0.06s |
| `101200` | Karin Misono | `group_14` | 8 | `vo_char_1012_00_22_hca.hca` | 18.00s | 17.94s | -0.06s |
| `101250` | Karin Misono | `group_14` | 7 | `vo_char_1012_00_22_hca.hca` | 18.00s | 17.94s | -0.06s |
| `101800` | Tsukuyo Amane | `group_17` | 5 | `vo_char_1018_00_25_hca.hca` | 10.00s | 9.94s | -0.06s |
| `102200` | Hikaru Kirari | `group_39` | 3 | `vo_char_1022_00_46_hca.hca` | 3.80s | 3.74s | -0.06s |
| `102250` | Hikaru Kirari | `group_39` | 2 | `vo_char_1022_00_46_hca.hca` | 3.80s | 3.74s | -0.06s |
| `102300` | Ao Kasane | `group_43` | 4 | `vo_game_0402_04_hca.hca` | 9.90s | 9.96s | +0.06s |
| `102400` | Juri Oba | `group_41` | 4 | `vo_game_0502_02_hca.hca` | 9.90s | 9.96s | +0.06s |
| `102800` | Himena Aika | `group_28` | 7 | `vo_char_1028_00_35_hca.hca` | 12.40s | 12.46s | +0.06s |
| `102850` | Himena Aika | `group_29` | 4 | `vo_char_1028_50_36_hca.hca` | 11.50s | 11.44s | -0.06s |
| `103350` | Rabi Himuro | `group_22` | 4 | `vo_char_1033_50_29_hca.hca` | 14.50s | 14.44s | -0.06s |
| `103500` | Alexandra Kurusu | `group_11` | 7 | `vo_char_1035_00_18_hca.hca` | 17.00s | 17.06s | +0.06s |
| `103550` | Alexandra Kurusu | `group_11` | 6 | `vo_char_1035_00_18_hca.hca` | 17.00s | 17.06s | +0.06s |
| `103902` | Sudachi Sawa | `group_19` | 5 | `vo_char_1039_02_26_hca.hca` | 10.30s | 10.24s | -0.06s |
| `103902` | Sudachi Sawa | `group_24` | 4 | `vo_char_1039_02_31_hca.hca` | 11.90s | 11.96s | +0.06s |
| `103903` | Sudachi Sawa | `group_19` | 5 | `vo_char_1039_03_26_hca.hca` | 10.30s | 10.24s | -0.06s |
| `103903` | Sudachi Sawa | `group_24` | 4 | `vo_char_1039_03_31_hca.hca` | 11.90s | 11.96s | +0.06s |
| `110100` | Iroha Tamaki | `group_25` | 4 | `vo_char_1101_00_33_hca.hca` | 10.50s | 10.44s | -0.06s |
| `110400` | Uwasa Sana | `group_9` | 3 | `vo_char_1104_00_16_hca.hca` | 11.00s | 11.06s | +0.06s |
| `110500` | Felicia-chan | `group_30` | 3 | `vo_char_1105_00_37_hca.hca` | 12.70s | 12.64s | -0.06s |
| `111200` | Karin & Alina | `group_11` | 6 | `vo_char_1112_00_18_hca.hca` | 13.50s | 13.44s | -0.06s |
| `111201` | Karin & Alina | `group_11` | 5 | `vo_char_1112_00_18_hca.hca` | 13.50s | 13.44s | -0.06s |
| `111202` | Karin & Alina | `group_11` | 5 | `vo_char_1112_00_18_hca.hca` | 13.50s | 13.44s | -0.06s |
| `120902` | Rena & Kaede | `group_19` | 7 | `vo_char_1209_02_26_hca.hca` | 15.40s | 15.34s | -0.06s |
| `200400` | Sayaka Miki | `group_30` | 8 | `vo_char_2004_00_38_hca.hca` | 13.50s | 13.44s | -0.06s |
| `220200` | Devil Homura | `group_21` | 7 | `vo_char_2202_00_28_hca.hca` | 17.50s | 17.44s | -0.06s |
| `220200` | Devil Homura | `group_25` | 3 | `vo_char_2202_00_32_hca.hca` | 12.80s | 12.74s | -0.06s |
| `300300` | Hinano Miyako | `group_43` | 6 | `vo_char_3003_00_02_hca.hca` | 12.20s | 12.14s | -0.06s |
| `300351` | Hinano Miyako | `group_12` | 4 | `vo_char_3003_00_20_hca.hca` | 6.00s | 6.06s | +0.06s |
| `300351` | Hinano Miyako | `group_43` | 5 | `vo_char_3003_00_02_hca.hca` | 12.20s | 12.14s | -0.06s |
| `300400` | Sasara Minagi | `group_18` | 7 | `vo_char_3004_00_26_hca.hca` | 9.50s | 9.44s | -0.06s |
| `300400` | Sasara Minagi | `group_34` | 5 | `vo_char_3004_00_42_hca.hca` | 3.50s | 3.56s | +0.06s |
| `300600` | Emiri Kisaki | `group_27` | 6 | `vo_char_3006_00_35_hca.hca` | 8.00s | 7.94s | -0.06s |
| `300600` | Emiri Kisaki | `group_6` | 6 | `vo_char_3006_00_14_hca.hca` | 5.00s | 4.94s | -0.06s |
| `300651` | Emiri Kisaki | `group_6` | 4 | `vo_char_3006_00_14_hca.hca` | 5.00s | 4.94s | -0.06s |
| `300700` | Shizuku Hozumi | `group_24` | 9 | `vo_char_3007_00_32_hca.hca` | 14.00s | 13.94s | -0.06s |
| `300700` | Shizuku Hozumi | `group_42` | 4 | `vo_char_3007_00_66_hca.hca` | 4.50s | 4.44s | -0.06s |
| `300750` | Shizuku Hozumi | `group_42` | 2 | `vo_char_3007_00_66_hca.hca` | 4.50s | 4.44s | -0.06s |
| `300800` | Akira Shinobu | `group_34` | 5 | `vo_char_3008_00_42_hca.hca` | 2.50s | 2.56s | +0.06s |
| `300850` | Akira Shinobu | `group_34` | 2 | `vo_char_3008_00_42_hca.hca` | 2.50s | 2.56s | +0.06s |
| `300900` | Manaka Kurumi | `group_24` | 6 | `vo_char_3009_00_32_hca.hca` | 9.00s | 9.06s | +0.06s |
| `301600` | Kokoro Awane | `group_20` | 8 | `vo_char_3016_00_28_hca.hca` | 16.00s | 16.06s | +0.06s |
| `301800` | Hanna Sarasa | `group_7` | 3 | `vo_char_3018_00_14_hca.hca` | 5.90s | 5.84s | -0.06s |
| `301900` | Ayaka Mariko | `group_39` | 4 | `vo_char_3019_00_63_hca.hca` | 3.70s | 3.76s | +0.06s |
| `301900` | Ayaka Mariko | `group_7` | 7 | `vo_char_3019_00_15_hca.hca` | 6.70s | 6.76s | +0.06s |
| `301950` | Ayaka Mariko | `group_31` | 3 | `vo_char_3019_50_39_hca.hca` | 6.00s | 6.06s | +0.06s |
| `301950` | Ayaka Mariko | `group_39` | 2 | `vo_char_3019_00_63_hca.hca` | 3.70s | 3.76s | +0.06s |
| `301950` | Ayaka Mariko | `group_7` | 5 | `vo_char_3019_00_15_hca.hca` | 6.70s | 6.76s | +0.06s |
| `302100` | Sakuya Suzuka | `group_27` | 4 | `vo_char_3021_00_34_hca.hca` | 9.80s | 9.74s | -0.06s |
| `303000` | Konomi Haruna | `group_36` | 6 | `vo_char_3030_00_44_hca.hca` | 3.50s | 3.44s | -0.06s |
| `303000` | Konomi Haruna | `group_37` | 3 | `vo_char_3030_00_45_hca.hca` | 2.50s | 2.44s | -0.06s |
| `303051` | Konomi Haruna | `group_36` | 4 | `vo_char_3030_00_44_hca.hca` | 3.50s | 3.44s | -0.06s |
| `303100` | Rika Ayano | `group_18` | 8 | `vo_char_3031_00_26_hca.hca` | 10.50s | 10.56s | +0.06s |
| `303100` | Rika Ayano | `group_25` | 7 | `vo_char_3031_00_33_hca.hca` | 10.50s | 10.56s | +0.06s |
| `303300` | Sayuki Fumino | `group_33` | 5 | `vo_char_3033_00_40_hca.hca` | 12.00s | 11.94s | -0.06s |
| `305100` | Jun Kazari | `group_20` | 4 | `vo_char_3051_00_27_hca.hca` | 10.80s | 10.74s | -0.06s |
| `350401` | Masara & Kokoro | `group_14` | 4 | `vo_char_3504_00_21_hca.hca` | 14.70s | 14.76s | +0.06s |
| `350402` | Masara & Kokoro | `group_14` | 4 | `vo_char_3504_00_21_hca.hca` | 14.70s | 14.76s | +0.06s |
| `390200` | Shi | `group_28` | 6 | `vo_char_3902_00_35_hca.hca` | 13.80s | 13.86s | +0.06s |
| `400200` | Kirika Kure | `group_20` | 6 | `vo_char_4002_00_28_hca.hca` | 10.50s | 10.44s | -0.06s |
| `400200` | Kirika Kure | `group_26` | 6 | `vo_char_4002_00_34_hca.hca` | 9.50s | 9.56s | +0.06s |
| `402300` | Melissa | `group_5` | 3 | `vo_char_4023_00_13_hca.hca` | 3.00s | 2.94s | -0.06s |
| `402500` | Corbeau | `group_27` | 6 | `vo_char_4025_00_34_hca.hca` | 16.70s | 16.64s | -0.06s |
| `403500` | Haruka Kanade | `group_36` | 2 | `vo_char_4035_00_43_hca.hca` | 3.00s | 2.94s | -0.06s |
| `404600` | Shinobu Oshino | `group_17` | 2 | `vo_char_4046_00_24_hca.hca` | 9.70s | 9.76s | +0.06s |
| `404600` | Shinobu Oshino | `group_32` | 2 | `vo_char_4046_00_39_hca.hca` | 11.00s | 10.94s | -0.06s |
| `100100` | Iroha Tamaki | `group_12` | 5 | `vo_char_1001_00_20_hca.hca` | 7.00s | 7.07s | +0.07s |
| `100100` | Iroha Tamaki | `group_19` | 8 | `vo_char_1001_00_27_hca.hca` | 12.80s | 12.87s | +0.07s |
| `100103` | Iroha Tamaki | `group_12` | 5 | `vo_char_1001_00_20_hca.hca` | 7.00s | 7.07s | +0.07s |
| `100150` | Iroha Tamaki | `group_12` | 4 | `vo_char_1001_00_20_hca.hca` | 7.00s | 7.07s | +0.07s |
| `100153` | Iroha Tamaki | `group_12` | 4 | `vo_char_1001_00_20_hca.hca` | 7.00s | 7.07s | +0.07s |
| `100651` | Mifuyu Azusa | `group_23` | 6 | `vo_char_1006_51_31_hca.hca` | 12.20s | 12.13s | -0.07s |
| `100750` | Touka Satomi | `group_31` | 4 | `vo_char_1007_50_38_hca.hca` | 13.00s | 12.93s | -0.07s |
| `100850` | Alina Gray | `group_31` | 4 | `vo_char_1008_50_39_hca.hca` | 11.00s | 10.93s | -0.07s |
| `100900` | Rena Minami | `group_20` | 5 | `vo_char_1009_00_28_hca.hca` | 7.00s | 6.93s | -0.07s |
| `100900` | Rena Minami | `group_42` | 3 | `vo_char_1009_00_66_hca.hca` | 3.00s | 2.93s | -0.07s |
| `100950` | Rena Minami | `group_42` | 2 | `vo_char_1009_00_66_hca.hca` | 3.00s | 2.93s | -0.07s |
| `100951` | Rena Minami | `group_42` | 2 | `vo_char_1009_00_66_hca.hca` | 3.00s | 2.93s | -0.07s |
| `101000` | Momoko Togame | `group_17` | 9 | `vo_char_1010_00_25_hca.hca` | 11.00s | 10.93s | -0.07s |
| `101100` | Kaede Akino | `group_42` | 5 | `vo_char_1011_00_66_hca.hca` | 3.50s | 3.43s | -0.07s |
| `101150` | Kaede Akino | `group_42` | 4 | `vo_char_1011_00_66_hca.hca` | 3.50s | 3.43s | -0.07s |
| `101152` | Kaede Akino | `group_42` | 3 | `vo_char_1011_00_66_hca.hca` | 3.50s | 3.43s | -0.07s |
| `101200` | Karin Misono | `group_15` | 8 | `vo_char_1012_00_23_hca.hca` | 18.80s | 18.87s | +0.07s |
| `101250` | Karin Misono | `group_15` | 7 | `vo_char_1012_00_23_hca.hca` | 18.80s | 18.87s | +0.07s |
| `101300` | Asuka Tatsuki | `group_24` | 9 | `vo_char_1013_00_32_hca.hca` | 11.00s | 11.07s | +0.07s |
| `101300` | Asuka Tatsuki | `group_29` | 6 | `vo_char_1013_00_37_hca.hca` | 12.00s | 11.93s | -0.07s |
| `101300` | Asuka Tatsuki | `group_37` | 4 | `vo_char_1013_00_45_hca.hca` | 3.00s | 2.93s | -0.07s |
| `101701` | Mitama Yakumo | `group_48` | 5 | `vo_game_0202_08_hca.hca` | 9.80s | 9.87s | +0.07s |
| `102200` | Hikaru Kirari | `group_22` | 4 | `vo_char_1022_00_29_hca.hca` | 8.30s | 8.23s | -0.07s |
| `102200` | Hikaru Kirari | `group_32` | 4 | `vo_char_1022_00_39_hca.hca` | 8.80s | 8.73s | -0.07s |
| `102900` | Shigure Miyabi | `group_22` | 7 | `vo_char_1029_00_29_hca.hca` | 16.90s | 16.83s | -0.07s |
| `102900` | Shigure Miyabi | `group_35` | 2 | `vo_char_1029_00_42_hca.hca` | 3.00s | 2.93s | -0.07s |
| `102950` | Shigure Miyabi | `group_30` | 4 | `vo_char_1029_50_37_hca.hca` | 14.00s | 13.93s | -0.07s |
| `103250` | Miyuri Yukari | `group_24` | 4 | `vo_char_1032_50_31_hca.hca` | 10.70s | 10.63s | -0.07s |
| `103350` | Rabi Himuro | `group_33` | 6 | `vo_char_1033_50_40_hca.hca` | 17.50s | 17.57s | +0.07s |
| `110500` | Felicia-chan | `group_37` | 2 | `vo_char_1105_00_44_hca.hca` | 4.30s | 4.37s | +0.07s |
| `110701` | Touka & Nemu | `group_20` | 4 | `vo_char_1107_01_27_hca.hca` | 11.00s | 11.07s | +0.07s |
| `111000` | Momoko Togame | `group_27` | 6 | `vo_char_1110_00_34_hca.hca` | 13.50s | 13.43s | -0.07s |
| `111202` | Karin & Alina | `group_19` | 3 | `vo_char_1112_02_26_hca.hca` | 10.20s | 10.13s | -0.07s |
| `111700` | Mitama Yakumo | `group_46` | 4 | `vo_game_0102_03_hca.hca` | 7.50s | 7.57s | +0.07s |
| `111800` | Amane Sisters | `group_12` | 3 | `vo_char_1118_00_19_hca.hca` | 5.70s | 5.63s | -0.07s |
| `111801` | Amane Sisters | `group_12` | 3 | `vo_char_1118_00_19_hca.hca` | 5.70s | 5.63s | -0.07s |
| `111802` | Amane Sisters | `group_12` | 3 | `vo_char_1118_00_19_hca.hca` | 5.70s | 5.63s | -0.07s |
| `113300` | Rabi Himuro | `group_31` | 3 | `vo_char_1133_00_38_hca.hca` | 17.60s | 17.53s | -0.07s |
| `120900` | Rena & Kaede | `group_19` | 5 | `vo_char_1209_00_26_hca.hca` | 15.00s | 14.93s | -0.07s |
| `120900` | Rena & Kaede | `group_34` | 8 | `vo_char_1209_00_41_hca.hca` | 16.90s | 16.83s | -0.07s |
| `130102` | Iroha & Yachiyo | `group_19` | 5 | `vo_char_1301_02_26_hca.hca` | 10.50s | 10.57s | +0.07s |
| `200200` | Homura Akemi | `group_28` | 3 | `vo_char_2002_00_35_hca.hca` | 12.00s | 11.93s | -0.07s |
| `200700` | Nagisa Momoe | `group_28` | 4 | `vo_char_2007_00_35_hca.hca` | 12.00s | 12.07s | +0.07s |
| `210100` | Ultimate Madoka | `group_13` | 8 | `vo_char_2101_00_21_hca.hca` | 20.70s | 20.77s | +0.07s |
| `250001` | Holy Mami | `group_31` | 4 | `vo_char_2500_01_39_hca.hca` | 13.00s | 12.93s | -0.07s |
| `250100` | Mami Tomoe | `group_25` | 3 | `vo_char_2501_00_32_hca.hca` | 10.00s | 10.07s | +0.07s |
| `300400` | Sasara Minagi | `group_12` | 5 | `vo_char_3004_00_20_hca.hca` | 6.50s | 6.57s | +0.07s |
| `300400` | Sasara Minagi | `group_17` | 6 | `vo_char_3004_00_25_hca.hca` | 12.50s | 12.57s | +0.07s |
| `300400` | Sasara Minagi | `group_19` | 8 | `vo_char_3004_00_27_hca.hca` | 10.00s | 9.93s | -0.07s |
| `300500` | Nanaka Tokiwa | `group_18` | 7 | `vo_char_3005_00_26_hca.hca` | 11.00s | 10.93s | -0.07s |
| `300500` | Nanaka Tokiwa | `group_20` | 6 | `vo_char_3005_00_28_hca.hca` | 11.50s | 11.43s | -0.07s |
| `300700` | Shizuku Hozumi | `group_16` | 7 | `vo_char_3007_00_24_hca.hca` | 10.50s | 10.57s | +0.07s |
| `300900` | Manaka Kurumi | `group_28` | 9 | `vo_char_3009_00_36_hca.hca` | 12.50s | 12.43s | -0.07s |
| `300900` | Manaka Kurumi | `group_35` | 3 | `vo_char_3009_00_43_hca.hca` | 2.00s | 1.93s | -0.07s |
| `301100` | Kako Natsume | `group_39` | 3 | `vo_char_3011_00_63_hca.hca` | 2.50s | 2.57s | +0.07s |
| `301100` | Kako Natsume | `group_4` | 5 | `vo_char_3011_00_05_hca.hca` | 7.00s | 6.93s | -0.07s |
| `301100` | Kako Natsume | `group_43` | 8 | `vo_char_3011_00_02_hca.hca` | 18.80s | 18.87s | +0.07s |
| `301150` | Kako Natsume | `group_4` | 3 | `vo_char_3011_00_05_hca.hca` | 7.00s | 6.93s | -0.07s |
| `301150` | Kako Natsume | `group_43` | 6 | `vo_char_3011_00_02_hca.hca` | 18.80s | 18.87s | +0.07s |
| `301151` | Kako Natsume | `group_4` | 3 | `vo_char_3011_00_05_hca.hca` | 7.00s | 6.93s | -0.07s |
| `301151` | Kako Natsume | `group_43` | 6 | `vo_char_3011_00_02_hca.hca` | 18.80s | 18.87s | +0.07s |
| `301800` | Hanna Sarasa | `group_24` | 5 | `vo_char_3018_00_31_hca.hca` | 12.70s | 12.63s | -0.07s |
| `302900` | Masara Kagami | `group_40` | 2 | `vo_char_3029_00_64_hca.hca` | 3.00s | 2.93s | -0.07s |
| `302950` | Masara Kagami | `group_40` | 2 | `vo_char_3029_00_64_hca.hca` | 3.00s | 2.93s | -0.07s |
| `303000` | Konomi Haruna | `group_11` | 5 | `vo_char_3030_00_19_hca.hca` | 5.50s | 5.43s | -0.07s |
| `303000` | Konomi Haruna | `group_15` | 7 | `vo_char_3030_00_23_hca.hca` | 14.50s | 14.43s | -0.07s |
| `303051` | Konomi Haruna | `group_11` | 3 | `vo_char_3030_00_19_hca.hca` | 5.50s | 5.43s | -0.07s |
| `303051` | Konomi Haruna | `group_15` | 5 | `vo_char_3030_00_23_hca.hca` | 14.50s | 14.43s | -0.07s |
| `303100` | Rika Ayano | `group_17` | 11 | `vo_char_3031_00_25_hca.hca` | 17.00s | 16.93s | -0.07s |
| `303100` | Rika Ayano | `group_30` | 7 | `vo_char_3031_00_38_hca.hca` | 11.00s | 10.93s | -0.07s |
| `303300` | Sayuki Fumino | `group_2` | 5 | `vo_char_3033_00_02_hca.hca` | 13.00s | 13.07s | +0.07s |
| `303300` | Sayuki Fumino | `group_22` | 6 | `vo_char_3033_00_29_hca.hca` | 15.00s | 15.07s | +0.07s |
| `303350` | Sayuki Fumino | `group_2` | 4 | `vo_char_3033_00_02_hca.hca` | 13.00s | 13.07s | +0.07s |
| `303700` | Mel Anna | `group_27` | 3 | `vo_char_3037_00_35_hca.hca` | 11.00s | 10.93s | -0.07s |
| `304100` | Hotori Yuzuki | `group_27` | 5 | `vo_char_3041_00_34_hca.hca` | 11.80s | 11.87s | +0.07s |
| `304300` | Eternal Sakura | `group_35` | 2 | `vo_char_3043_00_42_hca.hca` | 3.00s | 2.93s | -0.07s |
| `390200` | Shi | `group_21` | 6 | `vo_char_3902_00_28_hca.hca` | 15.10s | 15.03s | -0.07s |
| `400200` | Kirika Kure | `group_14` | 13 | `vo_char_4002_00_22_hca.hca` | 20.50s | 20.57s | +0.07s |
| `400200` | Kirika Kure | `group_24` | 6 | `vo_char_4002_00_32_hca.hca` | 11.50s | 11.43s | -0.07s |
| `402500` | Corbeau | `group_35` | 2 | `vo_char_4025_00_42_hca.hca` | 3.00s | 2.93s | -0.07s |
| `402600` | Elisa | `group_1` | 6 | `vo_char_4026_00_01_hca.hca` | 22.25s | 22.18s | -0.07s |
| `402600` | Elisa | `group_16` | 7 | `vo_char_4026_00_23_hca.hca` | 18.10s | 18.03s | -0.07s |
| `402650` | Elisa | `group_1` | 5 | `vo_char_4026_00_01_hca.hca` | 22.25s | 22.18s | -0.07s |
| `402650` | Elisa | `group_16` | 6 | `vo_char_4026_00_23_hca.hca` | 18.10s | 18.03s | -0.07s |
| `404200` | Mayoi Hachikuji | `group_28` | 2 | `vo_char_4042_00_35_hca.hca` | 9.40s | 9.33s | -0.07s |
| `404300` | Suruga Kanbaru | `group_21` | 2 | `vo_char_4043_00_28_hca.hca` | 10.15s | 10.22s | +0.07s |
| `100100` | Iroha Tamaki | `group_33` | 7 | `vo_char_1001_00_41_hca.hca` | 11.00s | 11.08s | +0.08s |
| `100100` | Iroha Tamaki | `group_42` | 4 | `vo_char_1001_00_66_hca.hca` | 5.00s | 5.08s | +0.08s |
| `100103` | Iroha Tamaki | `group_42` | 4 | `vo_char_1001_00_66_hca.hca` | 5.00s | 5.08s | +0.08s |
| `100150` | Iroha Tamaki | `group_42` | 3 | `vo_char_1001_00_66_hca.hca` | 5.00s | 5.08s | +0.08s |
| `100153` | Iroha Tamaki | `group_42` | 3 | `vo_char_1001_00_66_hca.hca` | 5.00s | 5.08s | +0.08s |
| `100451` | Sana Futaba | `group_30` | 5 | `vo_char_1004_51_38_hca.hca` | 12.00s | 11.92s | -0.08s |
| `100750` | Touka Satomi | `group_33` | 4 | `vo_char_1007_50_40_hca.hca` | 11.50s | 11.42s | -0.08s |
| `100800` | Alina Gray | `group_9` | 5 | `vo_char_1008_00_17_hca.hca` | 11.00s | 10.92s | -0.08s |
| `100850` | Alina Gray | `group_9` | 4 | `vo_char_1008_00_17_hca.hca` | 11.00s | 10.92s | -0.08s |
| `100900` | Rena Minami | `group_12` | 5 | `vo_char_1009_00_20_hca.hca` | 6.00s | 5.92s | -0.08s |
| `100900` | Rena Minami | `group_36` | 4 | `vo_char_1009_00_44_hca.hca` | 2.50s | 2.42s | -0.08s |
| `100950` | Rena Minami | `group_12` | 4 | `vo_char_1009_00_20_hca.hca` | 6.00s | 5.92s | -0.08s |
| `100950` | Rena Minami | `group_36` | 3 | `vo_char_1009_00_44_hca.hca` | 2.50s | 2.42s | -0.08s |
| `100951` | Rena Minami | `group_12` | 4 | `vo_char_1009_00_20_hca.hca` | 6.00s | 5.92s | -0.08s |
| `100951` | Rena Minami | `group_36` | 3 | `vo_char_1009_00_44_hca.hca` | 2.50s | 2.42s | -0.08s |
| `101000` | Momoko Togame | `group_16` | 8 | `vo_char_1010_00_24_hca.hca` | 11.00s | 10.92s | -0.08s |
| `101100` | Kaede Akino | `group_11` | 5 | `vo_char_1011_00_19_hca.hca` | 9.00s | 8.92s | -0.08s |
| `101150` | Kaede Akino | `group_11` | 4 | `vo_char_1011_00_19_hca.hca` | 9.00s | 8.92s | -0.08s |
| `101150` | Kaede Akino | `group_19` | 4 | `vo_char_1011_50_27_hca.hca` | 9.50s | 9.42s | -0.08s |
| `101150` | Kaede Akino | `group_21` | 7 | `vo_char_1011_50_29_hca.hca` | 13.00s | 12.92s | -0.08s |
| `101152` | Kaede Akino | `group_11` | 3 | `vo_char_1011_00_19_hca.hca` | 9.00s | 8.92s | -0.08s |
| `101550` | Ui Tamaki | `group_31` | 5 | `vo_char_1015_50_38_hca.hca` | 11.50s | 11.42s | -0.08s |
| `101750` | Mitama Yakumo | `group_29` | 5 | `vo_char_1017_50_37_hca.hca` | 14.50s | 14.42s | -0.08s |
| `101800` | Tsukuyo Amane | `group_37` | 3 | `vo_char_1018_00_45_hca.hca` | 3.00s | 2.92s | -0.08s |
| `101850` | Tsukuyo Amane | `group_37` | 2 | `vo_char_1018_00_45_hca.hca` | 3.00s | 2.92s | -0.08s |
| `101951` | Tsukasa Amane | `group_29` | 4 | `vo_char_1019_51_37_hca.hca` | 12.00s | 12.08s | +0.08s |
| `102100` | Yuna Kureha | `group_45` | 5 | `vo_game_0602_09_hca.hca` | 13.50s | 13.58s | +0.08s |
| `102200` | Hikaru Kirari | `group_20` | 5 | `vo_char_1022_00_27_hca.hca` | 9.00s | 8.92s | -0.08s |
| `102400` | Juri Oba | `group_40` | 8 | `vo_game_0502_01_hca.hca` | 11.30s | 11.38s | +0.08s |
| `102551` | Shizuka Tokime | `group_32` | 6 | `vo_char_1025_51_39_hca.hca` | 12.00s | 12.08s | +0.08s |
| `102650` | Chiharu Hiroe | `group_23` | 4 | `vo_char_1026_50_30_hca.hca` | 11.50s | 11.42s | -0.08s |
| `102650` | Chiharu Hiroe | `group_33` | 6 | `vo_char_1026_50_40_hca.hca` | 14.80s | 14.88s | +0.08s |
| `103550` | Alexandra Kurusu | `group_18` | 5 | `vo_char_1035_50_25_hca.hca` | 12.00s | 12.08s | +0.08s |
| `104100` | Livia Medeiros | `group_8` | 3 | `vo_char_1041_00_15_hca.hca` | 6.20s | 6.12s | -0.08s |
| `104300` | Kuroe | `group_21` | 4 | `vo_char_1043_00_28_hca.hca` | 12.40s | 12.32s | -0.08s |
| `104400` | Mikoto Sena | `group_10` | 7 | `vo_char_1044_00_17_hca.hca` | 14.95s | 15.03s | +0.08s |
| `105302` | Amaryllis | `group_24` | 4 | `vo_char_1053_02_31_hca.hca` | 12.70s | 12.62s | -0.08s |
| `110800` | Holy Alina | `group_29` | 4 | `vo_char_1108_00_36_hca.hca` | 14.00s | 13.92s | -0.08s |
| `110800` | Holy Alina | `group_34` | 4 | `vo_char_1108_00_41_hca.hca` | 12.00s | 11.92s | -0.08s |
| `130101` | Iroha & Yachiyo | `group_24` | 4 | `vo_char_1301_01_31_hca.hca` | 11.60s | 11.52s | -0.08s |
| `200600` | Kyoko Sakura | `group_42` | 5 | `vo_char_2006_00_66_hca.hca` | 5.00s | 5.08s | +0.08s |
| `200602` | Kyoko Sakura | `group_42` | 4 | `vo_char_2006_00_66_hca.hca` | 5.00s | 5.08s | +0.08s |
| `200650` | Kyoko Sakura | `group_42` | 3 | `vo_char_2006_00_66_hca.hca` | 5.00s | 5.08s | +0.08s |
| `200651` | Kyoko Sakura | `group_42` | 2 | `vo_char_2006_00_66_hca.hca` | 5.00s | 5.08s | +0.08s |
| `200653` | Kyoko Sakura | `group_42` | 2 | `vo_char_2006_00_66_hca.hca` | 5.00s | 5.08s | +0.08s |
| `240000` | Sayaka Miki | `group_8` | 4 | `vo_char_2400_00_15_hca.hca` | 5.00s | 4.92s | -0.08s |
| `250000` | Holy Mami | `group_22` | 5 | `vo_char_2500_00_30_hca.hca` | 12.00s | 11.92s | -0.08s |
| `250000` | Holy Mami | `group_26` | 5 | `vo_char_2500_00_34_hca.hca` | 11.00s | 10.92s | -0.08s |
| `300300` | Hinano Miyako | `group_1` | 15 | `vo_char_3003_00_01_hca.hca` | 28.00s | 28.08s | +0.08s |
| `300351` | Hinano Miyako | `group_1` | 14 | `vo_char_3003_00_01_hca.hca` | 28.00s | 28.08s | +0.08s |
| `300400` | Sasara Minagi | `group_6` | 4 | `vo_char_3004_00_14_hca.hca` | 5.00s | 5.08s | +0.08s |
| `300400` | Sasara Minagi | `group_7` | 5 | `vo_char_3004_00_15_hca.hca` | 6.00s | 5.92s | -0.08s |
| `300500` | Nanaka Tokiwa | `group_26` | 8 | `vo_char_3005_00_34_hca.hca` | 13.50s | 13.42s | -0.08s |
| `300500` | Nanaka Tokiwa | `group_6` | 4 | `vo_char_3005_00_14_hca.hca` | 5.50s | 5.42s | -0.08s |
| `300700` | Shizuku Hozumi | `group_12` | 4 | `vo_char_3007_00_20_hca.hca` | 6.50s | 6.42s | -0.08s |
| `300750` | Shizuku Hozumi | `group_12` | 2 | `vo_char_3007_00_20_hca.hca` | 6.50s | 6.42s | -0.08s |
| `300750` | Shizuku Hozumi | `group_24` | 4 | `vo_char_3007_50_32_hca.hca` | 12.50s | 12.58s | +0.08s |
| `300750` | Shizuku Hozumi | `group_32` | 5 | `vo_char_3007_50_40_hca.hca` | 11.90s | 11.98s | +0.08s |
| `300800` | Akira Shinobu | `group_18` | 11 | `vo_char_3008_00_26_hca.hca` | 13.50s | 13.42s | -0.08s |
| `300800` | Akira Shinobu | `group_31` | 7 | `vo_char_3008_00_39_hca.hca` | 11.00s | 11.08s | +0.08s |
| `300900` | Manaka Kurumi | `group_15` | 8 | `vo_char_3009_00_23_hca.hca` | 17.00s | 16.92s | -0.08s |
| `300900` | Manaka Kurumi | `group_21` | 5 | `vo_char_3009_00_29_hca.hca` | 10.00s | 10.08s | +0.08s |
| `300900` | Manaka Kurumi | `group_23` | 5 | `vo_char_3009_00_31_hca.hca` | 8.00s | 8.08s | +0.08s |
| `300900` | Manaka Kurumi | `group_25` | 7 | `vo_char_3009_00_33_hca.hca` | 9.00s | 9.08s | +0.08s |
| `301100` | Kako Natsume | `group_20` | 9 | `vo_char_3011_00_28_hca.hca` | 15.00s | 15.08s | +0.08s |
| `301100` | Kako Natsume | `group_25` | 6 | `vo_char_3011_00_33_hca.hca` | 12.00s | 12.08s | +0.08s |
| `301100` | Kako Natsume | `group_41` | 4 | `vo_char_3011_00_65_hca.hca` | 3.00s | 3.08s | +0.08s |
| `301150` | Kako Natsume | `group_41` | 2 | `vo_char_3011_00_65_hca.hca` | 3.00s | 3.08s | +0.08s |
| `301151` | Kako Natsume | `group_41` | 2 | `vo_char_3011_00_65_hca.hca` | 3.00s | 3.08s | +0.08s |
| `301500` | Mito Aino | `group_35` | 3 | `vo_char_3015_00_43_hca.hca` | 3.00s | 2.92s | -0.08s |
| `301950` | Ayaka Mariko | `group_25` | 3 | `vo_char_3019_50_33_hca.hca` | 10.50s | 10.42s | -0.08s |
| `302700` | Hazuki Yusa | `group_8` | 5 | `vo_char_3027_00_16_hca.hca` | 15.00s | 14.92s | -0.08s |
| `302800` | Ayame Mikuri | `group_35` | 3 | `vo_char_3028_00_43_hca.hca` | 3.00s | 2.92s | -0.08s |
| `302800` | Ayame Mikuri | `group_9` | 8 | `vo_char_3028_00_17_hca.hca` | 12.00s | 11.92s | -0.08s |
| `303000` | Konomi Haruna | `group_32` | 9 | `vo_char_3030_00_40_hca.hca` | 12.00s | 11.92s | -0.08s |
| `303100` | Rika Ayano | `group_38` | 5 | `vo_char_3031_00_46_hca.hca` | 3.00s | 2.92s | -0.08s |
| `303300` | Sayuki Fumino | `group_9` | 5 | `vo_char_3033_00_16_hca.hca` | 13.20s | 13.12s | -0.08s |
| `303350` | Sayuki Fumino | `group_9` | 4 | `vo_char_3033_00_16_hca.hca` | 13.20s | 13.12s | -0.08s |
| `303551` | Riko Chiaki | `group_18` | 6 | `vo_char_3035_51_26_hca.hca` | 16.00s | 15.92s | -0.08s |
| `303751` | Mel Anna | `group_28` | 4 | `vo_char_3037_51_36_hca.hca` | 11.00s | 10.92s | -0.08s |
| `304400` | Ranka Chizu | `group_4` | 4 | `vo_char_3044_00_04_hca.hca` | 5.90s | 5.82s | -0.08s |
| `304651` | Ryo Midori | `group_26` | 4 | `vo_char_3046_51_33_hca.hca` | 9.00s | 8.92s | -0.08s |
| `304651` | Ryo Midori | `group_28` | 4 | `vo_char_3046_51_35_hca.hca` | 11.00s | 10.92s | -0.08s |
| `350100` | Rika & Ren | `group_26` | 5 | `vo_char_3501_00_33_hca.hca` | 13.00s | 12.92s | -0.08s |
| `390200` | Shi | `group_33` | 6 | `vo_char_3902_00_40_hca.hca` | 16.10s | 16.18s | +0.08s |
| `390201` | Shi | `group_14` | 5 | `vo_char_3902_00_21_hca.hca` | 14.80s | 14.72s | -0.08s |
| `400200` | Kirika Kure | `group_29` | 7 | `vo_char_4002_00_37_hca.hca` | 11.00s | 10.92s | -0.08s |
| `400200` | Kirika Kure | `group_4` | 4 | `vo_char_4002_00_05_hca.hca` | 5.00s | 5.08s | +0.08s |
| `400300` | Yuma Chitose | `group_23` | 7 | `vo_char_4003_00_31_hca.hca` | 10.50s | 10.42s | -0.08s |
| `400400` | Oriko Mikuni | `group_13` | 4 | `vo_char_4004_00_20_hca.hca` | 4.70s | 4.78s | +0.08s |
| `402100` | Tart | `group_23` | 5 | `vo_char_4021_00_31_hca.hca` | 11.00s | 10.92s | -0.08s |
| `402200` | Riz | `group_15` | 6 | `vo_char_4022_00_23_hca.hca` | 20.00s | 19.92s | -0.08s |
| `402250` | Riz | `group_15` | 4 | `vo_char_4022_00_23_hca.hca` | 20.00s | 19.92s | -0.08s |
| `402450` | Minou | `group_26` | 7 | `vo_char_4024_50_33_hca.hca` | 14.70s | 14.78s | +0.08s |
| `402451` | Minou | `group_26` | 7 | `vo_char_4024_51_33_hca.hca` | 14.70s | 14.78s | +0.08s |
| `402700` | Lapin | `group_33` | 6 | `vo_char_4027_00_40_hca.hca` | 13.00s | 12.92s | -0.08s |
| `404500` | Tsubasa Hanekawa | `group_1` | 4 | `vo_char_4045_00_01_hca.hca` | 18.25s | 18.33s | +0.08s |
| `404500` | Tsubasa Hanekawa | `group_8` | 2 | `vo_char_4045_00_15_hca.hca` | 3.70s | 3.62s | -0.08s |
| `405200` | Fate | `group_34` | 6 | `vo_char_4052_00_41_hca.hca` | 15.00s | 14.92s | -0.08s |
| `100100` | Iroha Tamaki | `group_14` | 7 | `vo_char_1001_00_22_hca.hca` | 18.00s | 18.09s | +0.09s |
| `100100` | Iroha Tamaki | `group_15` | 8 | `vo_char_1001_00_23_hca.hca` | 24.00s | 23.91s | -0.09s |
| `100100` | Iroha Tamaki | `group_21` | 6 | `vo_char_1001_00_29_hca.hca` | 13.00s | 13.09s | +0.09s |
| `100100` | Iroha Tamaki | `group_24` | 6 | `vo_char_1001_00_32_hca.hca` | 11.50s | 11.59s | +0.09s |
| `100103` | Iroha Tamaki | `group_14` | 7 | `vo_char_1001_00_22_hca.hca` | 18.00s | 18.09s | +0.09s |
| `100103` | Iroha Tamaki | `group_15` | 8 | `vo_char_1001_00_23_hca.hca` | 24.00s | 23.91s | -0.09s |
| `100150` | Iroha Tamaki | `group_14` | 6 | `vo_char_1001_00_22_hca.hca` | 18.00s | 18.09s | +0.09s |
| `100150` | Iroha Tamaki | `group_15` | 7 | `vo_char_1001_00_23_hca.hca` | 24.00s | 23.91s | -0.09s |
| `100153` | Iroha Tamaki | `group_14` | 6 | `vo_char_1001_00_22_hca.hca` | 18.00s | 18.09s | +0.09s |
| `100153` | Iroha Tamaki | `group_15` | 7 | `vo_char_1001_00_23_hca.hca` | 24.00s | 23.91s | -0.09s |
| `100251` | Yachiyo Nanami | `group_32` | 5 | `vo_char_1002_51_40_hca.hca` | 13.00s | 12.91s | -0.09s |
| `100400` | Sana Futaba | `group_19` | 6 | `vo_char_1004_00_27_hca.hca` | 15.00s | 14.91s | -0.09s |
| `101751` | Mitama Yakumo | `group_48` | 5 | `vo_game_0802_08_hca.hca` | 10.50s | 10.41s | -0.09s |
| `101900` | Tsukasa Amane | `group_25` | 4 | `vo_char_1019_00_33_hca.hca` | 10.00s | 9.91s | -0.09s |
| `102100` | Yuna Kureha | `group_47` | 6 | `vo_game_0602_11_hca.hca` | 16.20s | 16.29s | +0.09s |
| `102200` | Hikaru Kirari | `group_28` | 6 | `vo_char_1022_00_35_hca.hca` | 9.90s | 9.81s | -0.09s |
| `102300` | Ao Kasane | `group_45` | 7 | `vo_game_0402_09_hca.hca` | 12.20s | 12.11s | -0.09s |
| `102600` | Chiharu Hiroe | `group_15` | 7 | `vo_char_1026_00_22_hca.hca` | 17.90s | 17.81s | -0.09s |
| `102600` | Chiharu Hiroe | `group_35` | 2 | `vo_char_1026_00_42_hca.hca` | 3.00s | 2.91s | -0.09s |
| `102650` | Chiharu Hiroe | `group_15` | 6 | `vo_char_1026_00_22_hca.hca` | 17.90s | 17.81s | -0.09s |
| `102651` | Chiharu Hiroe | `group_15` | 6 | `vo_char_1026_00_22_hca.hca` | 17.90s | 17.81s | -0.09s |
| `102850` | Himena Aika | `group_27` | 4 | `vo_char_1028_50_34_hca.hca` | 9.30s | 9.21s | -0.09s |
| `102900` | Shigure Miyabi | `group_6` | 3 | `vo_char_1029_00_13_hca.hca` | 5.90s | 5.99s | +0.09s |
| `102950` | Shigure Miyabi | `group_6` | 2 | `vo_char_1029_00_13_hca.hca` | 5.90s | 5.99s | +0.09s |
| `103200` | Miyuri Yukari | `group_12` | 4 | `vo_char_1032_00_19_hca.hca` | 8.30s | 8.21s | -0.09s |
| `103200` | Miyuri Yukari | `group_34` | 4 | `vo_char_1032_00_41_hca.hca` | 11.30s | 11.21s | -0.09s |
| `103250` | Miyuri Yukari | `group_32` | 7 | `vo_char_1032_50_39_hca.hca` | 14.10s | 14.01s | -0.09s |
| `103400` | Asahi Miura | `group_30` | 4 | `vo_char_1034_00_37_hca.hca` | 13.00s | 12.91s | -0.09s |
| `103550` | Alexandra Kurusu | `group_25` | 3 | `vo_char_1035_50_32_hca.hca` | 11.70s | 11.61s | -0.09s |
| `104300` | Kuroe | `group_17` | 7 | `vo_char_1043_00_24_hca.hca` | 13.70s | 13.79s | +0.09s |
| `105302` | Amaryllis | `group_19` | 4 | `vo_char_1053_02_26_hca.hca` | 13.80s | 13.71s | -0.09s |
| `110100` | Iroha Tamaki | `group_26` | 6 | `vo_char_1101_00_34_hca.hca` | 11.00s | 11.09s | +0.09s |
| `110400` | Uwasa Sana | `group_3` | 2 | `vo_char_1104_00_03_hca.hca` | 3.90s | 3.81s | -0.09s |
| `110500` | Felicia-chan | `group_34` | 6 | `vo_char_1105_00_41_hca.hca` | 22.00s | 21.91s | -0.09s |
| `110700` | Touka & Nemu | `group_26` | 5 | `vo_char_1107_00_33_hca.hca` | 12.50s | 12.41s | -0.09s |
| `113300` | Rabi Himuro | `group_8` | 3 | `vo_char_1133_00_15_hca.hca` | 5.50s | 5.59s | +0.09s |
| `120900` | Rena & Kaede | `group_36` | 2 | `vo_char_1209_00_43_hca.hca` | 4.00s | 3.91s | -0.09s |
| `120900` | Rena & Kaede | `group_39` | 2 | `vo_char_1209_00_46_hca.hca` | 4.50s | 4.59s | +0.09s |
| `120901` | Rena & Kaede | `group_39` | 2 | `vo_char_1209_00_46_hca.hca` | 4.50s | 4.59s | +0.09s |
| `120902` | Rena & Kaede | `group_39` | 2 | `vo_char_1209_00_46_hca.hca` | 4.50s | 4.59s | +0.09s |
| `200400` | Sayaka Miki | `group_9` | 6 | `vo_char_2004_00_17_hca.hca` | 14.00s | 13.91s | -0.09s |
| `200451` | Sayaka Miki | `group_9` | 4 | `vo_char_2004_00_17_hca.hca` | 14.00s | 13.91s | -0.09s |
| `300300` | Hinano Miyako | `group_21` | 7 | `vo_char_3003_00_29_hca.hca` | 11.00s | 11.09s | +0.09s |
| `300500` | Nanaka Tokiwa | `group_31` | 6 | `vo_char_3005_00_39_hca.hca` | 11.50s | 11.41s | -0.09s |
| `300500` | Nanaka Tokiwa | `group_40` | 5 | `vo_char_3005_00_64_hca.hca` | 4.00s | 3.91s | -0.09s |
| `300600` | Emiri Kisaki | `group_11` | 4 | `vo_char_3006_00_19_hca.hca` | 4.50s | 4.41s | -0.09s |
| `300600` | Emiri Kisaki | `group_4` | 4 | `vo_char_3006_00_05_hca.hca` | 5.00s | 4.91s | -0.09s |
| `300651` | Emiri Kisaki | `group_11` | 2 | `vo_char_3006_00_19_hca.hca` | 4.50s | 4.41s | -0.09s |
| `300651` | Emiri Kisaki | `group_4` | 2 | `vo_char_3006_00_05_hca.hca` | 5.00s | 4.91s | -0.09s |
| `300700` | Shizuku Hozumi | `group_8` | 6 | `vo_char_3007_00_16_hca.hca` | 11.00s | 11.09s | +0.09s |
| `300750` | Shizuku Hozumi | `group_8` | 4 | `vo_char_3007_00_16_hca.hca` | 11.00s | 11.09s | +0.09s |
| `300800` | Akira Shinobu | `group_11` | 9 | `vo_char_3008_00_19_hca.hca` | 7.00s | 6.91s | -0.09s |
| `300800` | Akira Shinobu | `group_33` | 10 | `vo_char_3008_00_41_hca.hca` | 11.00s | 10.91s | -0.09s |
| `300850` | Akira Shinobu | `group_11` | 6 | `vo_char_3008_00_19_hca.hca` | 7.00s | 6.91s | -0.09s |
| `300900` | Manaka Kurumi | `group_13` | 6 | `vo_char_3009_00_21_hca.hca` | 11.50s | 11.41s | -0.09s |
| `300900` | Manaka Kurumi | `group_22` | 5 | `vo_char_3009_00_30_hca.hca` | 7.50s | 7.59s | +0.09s |
| `301051` | Ria Ami | `group_16` | 5 | `vo_char_3010_51_24_hca.hca` | 13.40s | 13.49s | +0.09s |
| `301100` | Kako Natsume | `group_26` | 7 | `vo_char_3011_00_34_hca.hca` | 11.00s | 10.91s | -0.09s |
| `301900` | Ayaka Mariko | `group_33` | 8 | `vo_char_3019_00_41_hca.hca` | 13.00s | 12.91s | -0.09s |
| `302600` | Konoha Shizumi | `group_13` | 6 | `vo_char_3026_00_21_hca.hca` | 12.50s | 12.41s | -0.09s |
| `302600` | Konoha Shizumi | `group_24` | 5 | `vo_char_3026_00_32_hca.hca` | 12.00s | 11.91s | -0.09s |
| `302600` | Konoha Shizumi | `group_39` | 4 | `vo_char_3026_00_63_hca.hca` | 4.00s | 3.91s | -0.09s |
| `303100` | Rika Ayano | `group_10` | 9 | `vo_char_3031_00_18_hca.hca` | 10.00s | 9.91s | -0.09s |
| `303100` | Rika Ayano | `group_13` | 7 | `vo_char_3031_00_21_hca.hca` | 10.00s | 9.91s | -0.09s |
| `303100` | Rika Ayano | `group_34` | 3 | `vo_char_3031_00_42_hca.hca` | 3.00s | 2.91s | -0.09s |
| `303551` | Riko Chiaki | `group_19` | 6 | `vo_char_3035_51_27_hca.hca` | 13.00s | 13.09s | +0.09s |
| `303551` | Riko Chiaki | `group_23` | 5 | `vo_char_3035_51_31_hca.hca` | 12.30s | 12.21s | -0.09s |
| `303551` | Riko Chiaki | `group_7` | 2 | `vo_char_3035_00_15_hca.hca` | 5.40s | 5.49s | +0.09s |
| `303751` | Mel Anna | `group_23` | 4 | `vo_char_3037_51_31_hca.hca` | 11.70s | 11.61s | -0.09s |
| `305400` | Mitsune Miwa | `group_26` | 4 | `vo_char_3054_00_33_hca.hca` | 12.00s | 11.91s | -0.09s |
| `350401` | Masara & Kokoro | `group_30` | 5 | `vo_char_3504_01_37_hca.hca` | 14.60s | 14.69s | +0.09s |
| `390200` | Shi | `group_12` | 4 | `vo_char_3902_00_19_hca.hca` | 5.90s | 5.81s | -0.09s |
| `390201` | Shi | `group_12` | 3 | `vo_char_3902_00_19_hca.hca` | 5.90s | 5.81s | -0.09s |
| `390201` | Shi | `group_33` | 6 | `vo_char_3902_01_40_hca.hca` | 15.40s | 15.31s | -0.09s |
| `400100` | Oriko Mikuni | `group_4` | 4 | `vo_char_4001_00_05_hca.hca` | 5.00s | 4.91s | -0.09s |
| `400200` | Kirika Kure | `group_31` | 6 | `vo_char_4002_00_39_hca.hca` | 12.00s | 11.91s | -0.09s |
| `400300` | Yuma Chitose | `group_21` | 5 | `vo_char_4003_00_29_hca.hca` | 9.00s | 9.09s | +0.09s |
| `400300` | Yuma Chitose | `group_6` | 5 | `vo_char_4003_00_14_hca.hca` | 6.50s | 6.41s | -0.09s |
| `400300` | Yuma Chitose | `group_9` | 7 | `vo_char_4003_00_17_hca.hca` | 10.50s | 10.41s | -0.09s |
| `401200` | Umika Misaki | `group_2` | 4 | `vo_char_4012_00_03_hca.hca` | 6.00s | 5.91s | -0.09s |
| `402700` | Lapin | `group_19` | 5 | `vo_char_4027_00_26_hca.hca` | 9.40s | 9.31s | -0.09s |
| `404200` | Mayoi Hachikuji | `group_2` | 6 | `vo_char_4042_00_02_hca.hca` | 19.30s | 19.39s | +0.09s |
| `404200` | Mayoi Hachikuji | `group_7` | 2 | `vo_char_4042_00_14_hca.hca` | 6.20s | 6.11s | -0.09s |
| `404400` | Nadeko Sengoku | `group_28` | 2 | `vo_char_4044_00_36_hca.hca` | 8.40s | 8.49s | +0.09s |
| `100100` | Iroha Tamaki | `group_20` | 7 | `vo_char_1001_00_28_hca.hca` | 14.50s | 14.40s | -0.10s |
| `100150` | Iroha Tamaki | `group_18` | 4 | `vo_char_1001_50_26_hca.hca` | 9.00s | 8.90s | -0.10s |
| `100150` | Iroha Tamaki | `group_26` | 3 | `vo_char_1001_50_34_hca.hca` | 11.00s | 11.10s | +0.10s |
| `100451` | Sana Futaba | `group_18` | 7 | `vo_char_1004_51_26_hca.hca` | 15.80s | 15.90s | +0.10s |
| `100452` | Sana Futaba | `group_33` | 5 | `vo_char_1004_52_41_hca.hca` | 16.00s | 16.10s | +0.10s |
| `100850` | Alina Gray | `group_21` | 4 | `vo_char_1008_50_29_hca.hca` | 13.00s | 13.10s | +0.10s |
| `101051` | Momoko Togame | `group_20` | 7 | `vo_char_1010_51_28_hca.hca` | 11.60s | 11.70s | +0.10s |
| `101300` | Asuka Tatsuki | `group_19` | 7 | `vo_char_1013_00_27_hca.hca` | 12.50s | 12.40s | -0.10s |
| `101951` | Tsukasa Amane | `group_25` | 5 | `vo_char_1019_51_33_hca.hca` | 9.10s | 9.00s | -0.10s |
| `102200` | Hikaru Kirari | `group_21` | 5 | `vo_char_1022_00_28_hca.hca` | 11.60s | 11.50s | -0.10s |
| `102300` | Ao Kasane | `group_44` | 7 | `vo_game_0402_08_hca.hca` | 12.80s | 12.90s | +0.10s |
| `103050` | Hagumu Azumi | `group_19` | 4 | `vo_char_1030_50_26_hca.hca` | 14.00s | 13.90s | -0.10s |
| `104400` | Mikoto Sena | `group_35` | 2 | `vo_char_1044_00_42_hca.hca` | 3.10s | 3.00s | -0.10s |
| `105300` | Amaryllis | `group_17` | 4 | `vo_char_1053_00_24_hca.hca` | 10.20s | 10.30s | +0.10s |
| `110100` | Iroha Tamaki | `group_27` | 4 | `vo_char_1101_00_35_hca.hca` | 9.00s | 8.90s | -0.10s |
| `110800` | Holy Alina | `group_32` | 4 | `vo_char_1108_00_39_hca.hca` | 10.50s | 10.40s | -0.10s |
| `111200` | Karin & Alina | `group_16` | 7 | `vo_char_1112_00_23_hca.hca` | 23.50s | 23.40s | -0.10s |
| `111201` | Karin & Alina | `group_16` | 6 | `vo_char_1112_00_23_hca.hca` | 23.50s | 23.40s | -0.10s |
| `111202` | Karin & Alina | `group_16` | 6 | `vo_char_1112_00_23_hca.hca` | 23.50s | 23.40s | -0.10s |
| `111202` | Karin & Alina | `group_28` | 4 | `vo_char_1112_02_35_hca.hca` | 13.00s | 12.90s | -0.10s |
| `113300` | Rabi Himuro | `group_28` | 4 | `vo_char_1133_00_35_hca.hca` | 17.70s | 17.60s | -0.10s |
| `120100` | Iroha-chan | `group_18` | 4 | `vo_char_1201_00_25_hca.hca` | 12.80s | 12.70s | -0.10s |
| `200700` | Nagisa Momoe | `group_33` | 4 | `vo_char_2007_00_40_hca.hca` | 13.00s | 13.10s | +0.10s |
| `200700` | Nagisa Momoe | `group_43` | 3 | `vo_char_2007_00_66_hca.hca` | 3.50s | 3.60s | +0.10s |
| `220200` | Devil Homura | `group_29` | 4 | `vo_char_2202_00_36_hca.hca` | 12.20s | 12.30s | +0.10s |
| `220200` | Devil Homura | `group_37` | 2 | `vo_char_2202_00_44_hca.hca` | 3.00s | 2.90s | -0.10s |
| `250001` | Holy Mami | `group_19` | 5 | `vo_char_2500_01_27_hca.hca` | 11.00s | 10.90s | -0.10s |
| `250001` | Holy Mami | `group_26` | 4 | `vo_char_2500_01_34_hca.hca` | 15.00s | 14.90s | -0.10s |
| `300400` | Sasara Minagi | `group_2` | 5 | `vo_char_3004_00_03_hca.hca` | 7.00s | 6.90s | -0.10s |
| `300400` | Sasara Minagi | `group_23` | 6 | `vo_char_3004_00_31_hca.hca` | 13.00s | 12.90s | -0.10s |
| `300400` | Sasara Minagi | `group_26` | 7 | `vo_char_3004_00_34_hca.hca` | 11.00s | 11.10s | +0.10s |
| `300400` | Sasara Minagi | `group_4` | 4 | `vo_char_3004_00_05_hca.hca` | 3.50s | 3.40s | -0.10s |
| `300400` | Sasara Minagi | `group_41` | 5 | `vo_char_3004_00_65_hca.hca` | 3.50s | 3.60s | +0.10s |
| `300400` | Sasara Minagi | `group_5` | 5 | `vo_char_3004_00_13_hca.hca` | 3.50s | 3.40s | -0.10s |
| `300500` | Nanaka Tokiwa | `group_42` | 4 | `vo_char_3005_00_66_hca.hca` | 3.50s | 3.40s | -0.10s |
| `300651` | Emiri Kisaki | `group_26` | 6 | `vo_char_3006_51_34_hca.hca` | 13.10s | 13.00s | -0.10s |
| `300700` | Shizuku Hozumi | `group_10` | 6 | `vo_char_3007_00_18_hca.hca` | 12.00s | 11.90s | -0.10s |
| `300750` | Shizuku Hozumi | `group_10` | 4 | `vo_char_3007_00_18_hca.hca` | 12.00s | 11.90s | -0.10s |
| `300900` | Manaka Kurumi | `group_17` | 5 | `vo_char_3009_00_25_hca.hca` | 5.50s | 5.60s | +0.10s |
| `301100` | Kako Natsume | `group_18` | 6 | `vo_char_3011_00_26_hca.hca` | 11.00s | 11.10s | +0.10s |
| `301100` | Kako Natsume | `group_27` | 8 | `vo_char_3011_00_35_hca.hca` | 14.00s | 14.10s | +0.10s |
| `301100` | Kako Natsume | `group_35` | 3 | `vo_char_3011_00_43_hca.hca` | 3.00s | 3.10s | +0.10s |
| `301400` | Seika Kumi | `group_2` | 4 | `vo_char_3014_00_03_hca.hca` | 6.00s | 6.10s | +0.10s |
| `301600` | Kokoro Awane | `group_31` | 6 | `vo_char_3016_00_39_hca.hca` | 11.00s | 10.90s | -0.10s |
| `301650` | Kokoro Awane | `group_28` | 4 | `vo_char_3016_50_36_hca.hca` | 13.00s | 12.90s | -0.10s |
| `301950` | Ayaka Mariko | `group_21` | 3 | `vo_char_3019_50_29_hca.hca` | 12.00s | 11.90s | -0.10s |
| `302100` | Sakuya Suzuka | `group_7` | 3 | `vo_char_3021_00_14_hca.hca` | 7.00s | 7.10s | +0.10s |
| `302300` | Aimi Eri | `group_7` | 5 | `vo_char_3023_00_15_hca.hca` | 8.00s | 7.90s | -0.10s |
| `302600` | Konoha Shizumi | `group_9` | 5 | `vo_char_3026_00_17_hca.hca` | 11.00s | 10.90s | -0.10s |
| `303000` | Konomi Haruna | `group_19` | 6 | `vo_char_3030_00_27_hca.hca` | 6.00s | 5.90s | -0.10s |
| `303000` | Konomi Haruna | `group_31` | 7 | `vo_char_3030_00_39_hca.hca` | 10.00s | 9.90s | -0.10s |
| `303000` | Konomi Haruna | `group_33` | 6 | `vo_char_3030_00_41_hca.hca` | 11.50s | 11.40s | -0.10s |
| `303100` | Rika Ayano | `group_32` | 8 | `vo_char_3031_00_40_hca.hca` | 10.50s | 10.40s | -0.10s |
| `303300` | Sayuki Fumino | `group_32` | 4 | `vo_char_3033_00_39_hca.hca` | 12.00s | 11.90s | -0.10s |
| `304800` | Hotaru Yura | `group_13` | 3 | `vo_char_3048_00_20_hca.hca` | 9.00s | 8.90s | -0.10s |
| `305000` | Yuuna Kaharu | `group_19` | 4 | `vo_char_3050_00_26_hca.hca` | 11.30s | 11.20s | -0.10s |
| `305100` | Jun Kazari | `group_7` | 3 | `vo_char_3051_00_14_hca.hca` | 5.30s | 5.20s | -0.10s |
| `305600` | Rui Mizuki | `group_25` | 5 | `vo_char_3056_00_32_hca.hca` | 12.10s | 12.00s | -0.10s |
| `350400` | Masara & Kokoro | `group_5` | 2 | `vo_char_3504_00_05_hca.hca` | 7.80s | 7.90s | +0.10s |
| `350401` | Masara & Kokoro | `group_5` | 2 | `vo_char_3504_00_05_hca.hca` | 7.80s | 7.90s | +0.10s |
| `350402` | Masara & Kokoro | `group_5` | 2 | `vo_char_3504_00_05_hca.hca` | 7.80s | 7.90s | +0.10s |
| `400100` | Oriko Mikuni | `group_37` | 3 | `vo_char_4001_00_45_hca.hca` | 1.50s | 1.40s | -0.10s |
| `400200` | Kirika Kure | `group_40` | 4 | `vo_char_4002_00_64_hca.hca` | 3.00s | 2.90s | -0.10s |
| `400300` | Yuma Chitose | `group_5` | 6 | `vo_char_4003_00_13_hca.hca` | 5.00s | 4.90s | -0.10s |
| `402650` | Elisa | `group_25` | 3 | `vo_char_4026_50_32_hca.hca` | 11.00s | 10.90s | -0.10s |
| `402700` | Lapin | `group_29` | 5 | `vo_char_4027_00_36_hca.hca` | 11.30s | 11.40s | +0.10s |
| `404200` | Mayoi Hachikuji | `group_18` | 3 | `vo_char_4042_00_25_hca.hca` | 11.75s | 11.65s | -0.10s |
| `404400` | Nadeko Sengoku | `group_31` | 2 | `vo_char_4044_00_39_hca.hca` | 12.00s | 11.90s | -0.10s |
| `404500` | Tsubasa Hanekawa | `group_24` | 2 | `vo_char_4045_00_31_hca.hca` | 9.60s | 9.70s | +0.10s |
| `405200` | Fate | `group_16` | 6 | `vo_char_4052_00_23_hca.hca` | 12.50s | 12.40s | -0.10s |
| `405200` | Fate | `group_4` | 4 | `vo_char_4052_00_04_hca.hca` | 4.00s | 3.90s | -0.10s |
| `405200` | Fate | `group_5` | 4 | `vo_char_4052_00_05_hca.hca` | 3.50s | 3.40s | -0.10s |
| `405300` | Hayate Yagami | `group_34` | 5 | `vo_char_4053_00_41_hca.hca` | 11.20s | 11.10s | -0.10s |
| `100100` | Iroha Tamaki | `group_28` | 7 | `vo_char_1001_00_36_hca.hca` | 13.00s | 13.11s | +0.11s |
| `100350` | Tsuruno Yui | `group_18` | 5 | `vo_char_1003_50_26_hca.hca` | 14.00s | 13.89s | -0.11s |
| `100351` | Tsuruno Yui | `group_19` | 6 | `vo_char_1003_51_27_hca.hca` | 14.00s | 13.89s | -0.11s |
| `100550` | Felicia Mitsuki | `group_33` | 5 | `vo_char_1005_50_41_hca.hca` | 13.00s | 12.89s | -0.11s |
| `100700` | Touka Satomi | `group_37` | 3 | `vo_char_1007_00_44_hca.hca` | 4.20s | 4.09s | -0.11s |
| `100900` | Rena Minami | `group_22` | 8 | `vo_char_1009_00_30_hca.hca` | 11.50s | 11.61s | +0.11s |
| `100900` | Rena Minami | `group_29` | 6 | `vo_char_1009_00_37_hca.hca` | 12.00s | 12.11s | +0.11s |
| `101000` | Momoko Togame | `group_20` | 9 | `vo_char_1010_00_28_hca.hca` | 17.00s | 16.89s | -0.11s |
| `101000` | Momoko Togame | `group_34` | 4 | `vo_char_1010_00_42_hca.hca` | 2.00s | 1.89s | -0.11s |
| `101051` | Momoko Togame | `group_34` | 3 | `vo_char_1010_00_42_hca.hca` | 2.00s | 1.89s | -0.11s |
| `101100` | Kaede Akino | `group_12` | 7 | `vo_char_1011_00_20_hca.hca` | 7.00s | 6.89s | -0.11s |
| `101100` | Kaede Akino | `group_32` | 9 | `vo_char_1011_00_40_hca.hca` | 12.00s | 12.11s | +0.11s |
| `101150` | Kaede Akino | `group_12` | 6 | `vo_char_1011_00_20_hca.hca` | 7.00s | 6.89s | -0.11s |
| `101152` | Kaede Akino | `group_12` | 5 | `vo_char_1011_00_20_hca.hca` | 7.00s | 6.89s | -0.11s |
| `101400` | Nemu Hiiragi | `group_22` | 4 | `vo_char_1014_00_29_hca.hca` | 14.30s | 14.41s | +0.11s |
| `101700` | Mitama Yakumo | `group_62` | 4 | `vo_game_1102_01_hca.hca` | 8.60s | 8.49s | -0.11s |
| `101800` | Tsukuyo Amane | `group_11` | 4 | `vo_char_1018_00_19_hca.hca` | 7.00s | 6.89s | -0.11s |
| `101850` | Tsukuyo Amane | `group_11` | 3 | `vo_char_1018_00_19_hca.hca` | 7.00s | 6.89s | -0.11s |
| `102200` | Hikaru Kirari | `group_43` | 3 | `vo_game_0302_04_hca.hca` | 8.90s | 9.01s | +0.11s |
| `102250` | Hikaru Kirari | `group_43` | 2 | `vo_game_0302_04_hca.hca` | 8.90s | 9.01s | +0.11s |
| `102500` | Shizuka Tokime | `group_32` | 7 | `vo_char_1025_00_39_hca.hca` | 18.90s | 18.79s | -0.11s |
| `103200` | Miyuri Yukari | `group_29` | 6 | `vo_char_1032_00_36_hca.hca` | 20.30s | 20.19s | -0.11s |
| `103300` | Rabi Himuro | `group_33` | 8 | `vo_char_1033_00_40_hca.hca` | 15.20s | 15.09s | -0.11s |
| `103900` | Sudachi Sawa | `group_18` | 6 | `vo_char_1039_00_25_hca.hca` | 10.20s | 10.31s | +0.11s |
| `104700` | Kuro | `group_25` | 2 | `vo_char_1047_00_32_hca.hca` | 8.90s | 8.79s | -0.11s |
| `105302` | Amaryllis | `group_32` | 4 | `vo_char_1053_02_39_hca.hca` | 11.00s | 10.89s | -0.11s |
| `110701` | Touka & Nemu | `group_21` | 7 | `vo_char_1107_01_28_hca.hca` | 22.90s | 22.79s | -0.11s |
| `110800` | Holy Alina | `group_11` | 5 | `vo_char_1108_00_18_hca.hca` | 15.00s | 14.89s | -0.11s |
| `111000` | Momoko Togame | `group_28` | 5 | `vo_char_1110_00_35_hca.hca` | 11.50s | 11.39s | -0.11s |
| `111200` | Karin & Alina | `group_35` | 3 | `vo_char_1112_00_42_hca.hca` | 4.50s | 4.39s | -0.11s |
| `111200` | Karin & Alina | `group_38` | 3 | `vo_char_1112_00_45_hca.hca` | 5.20s | 5.09s | -0.11s |
| `111201` | Karin & Alina | `group_35` | 2 | `vo_char_1112_00_42_hca.hca` | 4.50s | 4.39s | -0.11s |
| `111201` | Karin & Alina | `group_38` | 2 | `vo_char_1112_00_45_hca.hca` | 5.20s | 5.09s | -0.11s |
| `111202` | Karin & Alina | `group_35` | 2 | `vo_char_1112_00_42_hca.hca` | 4.50s | 4.39s | -0.11s |
| `111202` | Karin & Alina | `group_38` | 2 | `vo_char_1112_00_45_hca.hca` | 5.20s | 5.09s | -0.11s |
| `111600` | Kanagi Izumi | `group_23` | 4 | `vo_char_1116_00_30_hca.hca` | 11.50s | 11.39s | -0.11s |
| `111800` | Amane Sisters | `group_38` | 3 | `vo_char_1118_00_45_hca.hca` | 3.20s | 3.31s | +0.11s |
| `111801` | Amane Sisters | `group_38` | 3 | `vo_char_1118_00_45_hca.hca` | 3.20s | 3.31s | +0.11s |
| `111802` | Amane Sisters | `group_38` | 3 | `vo_char_1118_00_45_hca.hca` | 3.20s | 3.31s | +0.11s |
| `120900` | Rena & Kaede | `group_35` | 3 | `vo_char_1209_00_42_hca.hca` | 3.90s | 3.79s | -0.11s |
| `120900` | Rena & Kaede | `group_8` | 3 | `vo_char_1209_00_15_hca.hca` | 5.70s | 5.59s | -0.11s |
| `120901` | Rena & Kaede | `group_35` | 2 | `vo_char_1209_00_42_hca.hca` | 3.90s | 3.79s | -0.11s |
| `120901` | Rena & Kaede | `group_8` | 2 | `vo_char_1209_00_15_hca.hca` | 5.70s | 5.59s | -0.11s |
| `120902` | Rena & Kaede | `group_35` | 2 | `vo_char_1209_00_42_hca.hca` | 3.90s | 3.79s | -0.11s |
| `120902` | Rena & Kaede | `group_8` | 2 | `vo_char_1209_00_15_hca.hca` | 5.70s | 5.59s | -0.11s |
| `210000` | Madoka Kaname | `group_14` | 6 | `vo_char_2100_00_22_hca.hca` | 17.10s | 16.99s | -0.11s |
| `300300` | Hinano Miyako | `group_40` | 4 | `vo_char_3003_00_64_hca.hca` | 4.00s | 3.89s | -0.11s |
| `300351` | Hinano Miyako | `group_40` | 3 | `vo_char_3003_00_64_hca.hca` | 4.00s | 3.89s | -0.11s |
| `300400` | Sasara Minagi | `group_20` | 7 | `vo_char_3004_00_28_hca.hca` | 8.00s | 8.11s | +0.11s |
| `300500` | Nanaka Tokiwa | `group_15` | 7 | `vo_char_3005_00_23_hca.hca` | 18.00s | 17.89s | -0.11s |
| `300600` | Emiri Kisaki | `group_40` | 4 | `vo_char_3006_00_64_hca.hca` | 4.00s | 3.89s | -0.11s |
| `300651` | Emiri Kisaki | `group_40` | 2 | `vo_char_3006_00_64_hca.hca` | 4.00s | 3.89s | -0.11s |
| `300700` | Shizuku Hozumi | `group_1` | 11 | `vo_char_3007_00_01_hca.hca` | 27.90s | 28.01s | +0.11s |
| `300700` | Shizuku Hozumi | `group_22` | 5 | `vo_char_3007_00_30_hca.hca` | 7.00s | 6.89s | -0.11s |
| `300700` | Shizuku Hozumi | `group_39` | 4 | `vo_char_3007_00_63_hca.hca` | 3.00s | 2.89s | -0.11s |
| `300750` | Shizuku Hozumi | `group_1` | 9 | `vo_char_3007_00_01_hca.hca` | 27.90s | 28.01s | +0.11s |
| `300750` | Shizuku Hozumi | `group_39` | 2 | `vo_char_3007_00_63_hca.hca` | 3.00s | 2.89s | -0.11s |
| `300800` | Akira Shinobu | `group_12` | 7 | `vo_char_3008_00_20_hca.hca` | 5.00s | 4.89s | -0.11s |
| `300800` | Akira Shinobu | `group_32` | 8 | `vo_char_3008_00_40_hca.hca` | 14.00s | 13.89s | -0.11s |
| `300850` | Akira Shinobu | `group_12` | 4 | `vo_char_3008_00_20_hca.hca` | 5.00s | 4.89s | -0.11s |
| `300900` | Manaka Kurumi | `group_18` | 5 | `vo_char_3009_00_26_hca.hca` | 9.50s | 9.61s | +0.11s |
| `301100` | Kako Natsume | `group_28` | 8 | `vo_char_3011_00_36_hca.hca` | 13.50s | 13.61s | +0.11s |
| `301150` | Kako Natsume | `group_25` | 5 | `vo_char_3011_50_33_hca.hca` | 11.10s | 10.99s | -0.11s |
| `301400` | Seika Kumi | `group_33` | 8 | `vo_char_3014_00_41_hca.hca` | 13.80s | 13.91s | +0.11s |
| `301650` | Kokoro Awane | `group_31` | 5 | `vo_char_3016_50_39_hca.hca` | 13.00s | 13.11s | +0.11s |
| `301950` | Ayaka Mariko | `group_19` | 4 | `vo_char_3019_50_27_hca.hca` | 9.80s | 9.91s | +0.11s |
| `302100` | Sakuya Suzuka | `group_37` | 2 | `vo_char_3021_00_44_hca.hca` | 2.80s | 2.69s | -0.11s |
| `302500` | Ren Isuzu | `group_2` | 5 | `vo_char_3025_00_03_hca.hca` | 7.80s | 7.91s | +0.11s |
| `302551` | Ren Isuzu | `group_2` | 4 | `vo_char_3025_00_03_hca.hca` | 7.80s | 7.91s | +0.11s |
| `302700` | Hazuki Yusa | `group_14` | 6 | `vo_char_3027_00_22_hca.hca` | 19.00s | 18.89s | -0.11s |
| `303300` | Sayuki Fumino | `group_19` | 6 | `vo_char_3033_00_26_hca.hca` | 17.10s | 17.21s | +0.11s |
| `303350` | Sayuki Fumino | `group_22` | 6 | `vo_char_3033_50_29_hca.hca` | 17.60s | 17.71s | +0.11s |
| `303400` | Moka Megumi | `group_24` | 4 | `vo_char_3034_00_31_hca.hca` | 13.50s | 13.39s | -0.11s |
| `303400` | Moka Megumi | `group_29` | 5 | `vo_char_3034_00_36_hca.hca` | 14.00s | 13.89s | -0.11s |
| `303700` | Mel Anna | `group_26` | 7 | `vo_char_3037_00_34_hca.hca` | 17.00s | 16.89s | -0.11s |
| `304651` | Ryo Midori | `group_31` | 6 | `vo_char_3046_51_38_hca.hca` | 13.00s | 12.89s | -0.11s |
| `305100` | Jun Kazari | `group_16` | 7 | `vo_char_3051_00_23_hca.hca` | 18.05s | 18.16s | +0.11s |
| `305100` | Jun Kazari | `group_19` | 6 | `vo_char_3051_00_26_hca.hca` | 10.90s | 10.79s | -0.11s |
| `350400` | Masara & Kokoro | `group_29` | 8 | `vo_char_3504_00_36_hca.hca` | 21.20s | 21.09s | -0.11s |
| `400100` | Oriko Mikuni | `group_11` | 4 | `vo_char_4001_00_19_hca.hca` | 5.00s | 4.89s | -0.11s |
| `400100` | Oriko Mikuni | `group_22` | 6 | `vo_char_4001_00_30_hca.hca` | 10.00s | 9.89s | -0.11s |
| `400100` | Oriko Mikuni | `group_41` | 4 | `vo_char_4001_00_65_hca.hca` | 5.50s | 5.39s | -0.11s |
| `400200` | Kirika Kure | `group_9` | 7 | `vo_char_4002_00_17_hca.hca` | 12.50s | 12.39s | -0.11s |
| `401100` | Kazumi | `group_24` | 6 | `vo_char_4011_00_32_hca.hca` | 12.00s | 11.89s | -0.11s |
| `402100` | Tart | `group_40` | 4 | `vo_char_4021_00_64_hca.hca` | 4.00s | 3.89s | -0.11s |
| `402150` | Tart | `group_40` | 2 | `vo_char_4021_00_64_hca.hca` | 4.00s | 3.89s | -0.11s |
| `402200` | Riz | `group_18` | 4 | `vo_char_4022_00_26_hca.hca` | 10.00s | 9.89s | -0.11s |
| `402200` | Riz | `group_6` | 4 | `vo_char_4022_00_14_hca.hca` | 5.00s | 4.89s | -0.11s |
| `402250` | Riz | `group_6` | 2 | `vo_char_4022_00_14_hca.hca` | 5.00s | 4.89s | -0.11s |
| `402600` | Elisa | `group_18` | 5 | `vo_char_4026_00_25_hca.hca` | 13.80s | 13.69s | -0.11s |
| `402700` | Lapin | `group_10` | 4 | `vo_char_4027_00_17_hca.hca` | 11.50s | 11.61s | +0.11s |
| `403200` | Matsuri Hinata | `group_15` | 6 | `vo_char_4032_00_22_hca.hca` | 20.50s | 20.39s | -0.11s |
| `403200` | Matsuri Hinata | `group_5` | 2 | `vo_char_4032_00_05_hca.hca` | 5.00s | 4.89s | -0.11s |
| `404200` | Mayoi Hachikuji | `group_26` | 2 | `vo_char_4042_00_33_hca.hca` | 11.40s | 11.29s | -0.11s |
| `404400` | Nadeko Sengoku | `group_16` | 4 | `vo_char_4044_00_24_hca.hca` | 10.40s | 10.29s | -0.11s |
| `404500` | Tsubasa Hanekawa | `group_29` | 2 | `vo_char_4045_00_36_hca.hca` | 10.30s | 10.41s | +0.11s |
| `405100` | Nanoha Takamachi | `group_30` | 6 | `vo_char_4051_00_37_hca.hca` | 10.50s | 10.61s | +0.11s |
| `405200` | Fate | `group_3` | 5 | `vo_char_4052_00_03_hca.hca` | 3.50s | 3.39s | -0.11s |
| `405200` | Fate | `group_38` | 4 | `vo_char_4052_00_45_hca.hca` | 3.50s | 3.39s | -0.11s |
| `405300` | Hayate Yagami | `group_1` | 7 | `vo_char_4053_00_01_hca.hca` | 14.50s | 14.39s | -0.11s |
| `405300` | Hayate Yagami | `group_30` | 5 | `vo_char_4053_00_37_hca.hca` | 7.50s | 7.39s | -0.11s |
| `405300` | Hayate Yagami | `group_32` | 7 | `vo_char_4053_00_39_hca.hca` | 12.70s | 12.81s | +0.11s |
| `100100` | Iroha Tamaki | `group_3` | 4 | `vo_char_1001_00_04_hca.hca` | 5.50s | 5.62s | +0.12s |
| `100100` | Iroha Tamaki | `group_9` | 5 | `vo_char_1001_00_17_hca.hca` | 14.00s | 14.12s | +0.12s |
| `100103` | Iroha Tamaki | `group_3` | 4 | `vo_char_1001_00_04_hca.hca` | 5.50s | 5.62s | +0.12s |
| `100103` | Iroha Tamaki | `group_9` | 5 | `vo_char_1001_00_17_hca.hca` | 14.00s | 14.12s | +0.12s |
| `100150` | Iroha Tamaki | `group_3` | 3 | `vo_char_1001_00_04_hca.hca` | 5.50s | 5.62s | +0.12s |
| `100150` | Iroha Tamaki | `group_9` | 4 | `vo_char_1001_00_17_hca.hca` | 14.00s | 14.12s | +0.12s |
| `100153` | Iroha Tamaki | `group_3` | 3 | `vo_char_1001_00_04_hca.hca` | 5.50s | 5.62s | +0.12s |
| `100153` | Iroha Tamaki | `group_9` | 4 | `vo_char_1001_00_17_hca.hca` | 14.00s | 14.12s | +0.12s |
| `100350` | Tsuruno Yui | `group_21` | 5 | `vo_char_1003_50_29_hca.hca` | 12.00s | 11.88s | -0.12s |
| `100451` | Sana Futaba | `group_17` | 7 | `vo_char_1004_51_25_hca.hca` | 19.00s | 18.88s | -0.12s |
| `100800` | Alina Gray | `group_40` | 3 | `vo_char_1008_00_64_hca.hca` | 5.00s | 4.88s | -0.12s |
| `100850` | Alina Gray | `group_40` | 2 | `vo_char_1008_00_64_hca.hca` | 5.00s | 4.88s | -0.12s |
| `100900` | Rena Minami | `group_19` | 5 | `vo_char_1009_00_27_hca.hca` | 9.50s | 9.62s | +0.12s |
| `100900` | Rena Minami | `group_35` | 4 | `vo_char_1009_00_43_hca.hca` | 2.50s | 2.38s | -0.12s |
| `100950` | Rena Minami | `group_35` | 3 | `vo_char_1009_00_43_hca.hca` | 2.50s | 2.38s | -0.12s |
| `100951` | Rena Minami | `group_27` | 6 | `vo_char_1009_51_35_hca.hca` | 18.50s | 18.38s | -0.12s |
| `100951` | Rena Minami | `group_35` | 3 | `vo_char_1009_00_43_hca.hca` | 2.50s | 2.38s | -0.12s |
| `101701` | Mitama Yakumo | `group_50` | 7 | `vo_game_0202_10_hca.hca` | 15.20s | 15.08s | -0.12s |
| `101800` | Tsukuyo Amane | `group_39` | 4 | `vo_char_1018_00_63_hca.hca` | 4.00s | 3.88s | -0.12s |
| `101850` | Tsukuyo Amane | `group_39` | 3 | `vo_char_1018_00_63_hca.hca` | 4.00s | 3.88s | -0.12s |
| `101900` | Tsukasa Amane | `group_12` | 4 | `vo_char_1019_00_20_hca.hca` | 4.00s | 3.88s | -0.12s |
| `101951` | Tsukasa Amane | `group_12` | 3 | `vo_char_1019_00_20_hca.hca` | 4.00s | 3.88s | -0.12s |
| `101951` | Tsukasa Amane | `group_27` | 4 | `vo_char_1019_51_35_hca.hca` | 14.00s | 13.88s | -0.12s |
| `102200` | Hikaru Kirari | `group_2` | 4 | `vo_char_1022_00_02_hca.hca` | 8.70s | 8.82s | +0.12s |
| `102200` | Hikaru Kirari | `group_35` | 2 | `vo_char_1022_00_42_hca.hca` | 2.20s | 2.08s | -0.12s |
| `102250` | Hikaru Kirari | `group_2` | 3 | `vo_char_1022_00_02_hca.hca` | 8.70s | 8.82s | +0.12s |
| `102300` | Ao Kasane | `group_5` | 2 | `vo_char_1023_00_05_hca.hca` | 3.20s | 3.08s | -0.12s |
| `102350` | Ao Kasane | `group_23` | 6 | `vo_char_1023_50_30_hca.hca` | 12.70s | 12.82s | +0.12s |
| `102350` | Ao Kasane | `group_42` | 4 | `vo_game_0402_03_hca.hca` | 11.00s | 11.12s | +0.12s |
| `102350` | Ao Kasane | `group_5` | 2 | `vo_char_1023_00_05_hca.hca` | 3.20s | 3.08s | -0.12s |
| `102651` | Chiharu Hiroe | `group_21` | 6 | `vo_char_1026_51_28_hca.hca` | 13.60s | 13.48s | -0.12s |
| `102800` | Himena Aika | `group_4` | 3 | `vo_char_1028_00_04_hca.hca` | 4.10s | 3.98s | -0.12s |
| `102850` | Himena Aika | `group_4` | 3 | `vo_char_1028_00_04_hca.hca` | 4.10s | 3.98s | -0.12s |
| `102950` | Shigure Miyabi | `group_23` | 5 | `vo_char_1029_50_30_hca.hca` | 16.00s | 15.88s | -0.12s |
| `103250` | Miyuri Yukari | `group_28` | 5 | `vo_char_1032_50_35_hca.hca` | 15.00s | 14.88s | -0.12s |
| `103902` | Sudachi Sawa | `group_22` | 5 | `vo_char_1039_02_29_hca.hca` | 10.20s | 10.32s | +0.12s |
| `103903` | Sudachi Sawa | `group_22` | 5 | `vo_char_1039_03_29_hca.hca` | 10.20s | 10.32s | +0.12s |
| `104050` | Yozuru Sasame | `group_19` | 4 | `vo_char_1040_50_26_hca.hca` | 12.40s | 12.52s | +0.12s |
| `105300` | Amaryllis | `group_34` | 6 | `vo_char_1053_00_41_hca.hca` | 16.00s | 15.88s | -0.12s |
| `105302` | Amaryllis | `group_6` | 2 | `vo_char_1053_00_13_hca.hca` | 4.30s | 4.42s | +0.12s |
| `111200` | Karin & Alina | `group_15` | 6 | `vo_char_1112_00_22_hca.hca` | 20.80s | 20.92s | +0.12s |
| `111201` | Karin & Alina | `group_15` | 5 | `vo_char_1112_00_22_hca.hca` | 20.80s | 20.92s | +0.12s |
| `111202` | Karin & Alina | `group_15` | 5 | `vo_char_1112_00_22_hca.hca` | 20.80s | 20.92s | +0.12s |
| `210000` | Madoka Kaname | `group_10` | 4 | `vo_char_2100_00_18_hca.hca` | 11.00s | 10.88s | -0.12s |
| `260000` | Kyoko Sakura | `group_25` | 3 | `vo_char_2600_00_32_hca.hca` | 10.00s | 9.88s | -0.12s |
| `260200` | Kyoko Sakura | `group_7` | 3 | `vo_char_2602_00_14_hca.hca` | 4.00s | 3.88s | -0.12s |
| `300300` | Hinano Miyako | `group_14` | 8 | `vo_char_3003_00_22_hca.hca` | 15.00s | 15.12s | +0.12s |
| `300300` | Hinano Miyako | `group_36` | 3 | `vo_char_3003_00_44_hca.hca` | 2.00s | 2.12s | +0.12s |
| `300351` | Hinano Miyako | `group_14` | 7 | `vo_char_3003_00_22_hca.hca` | 15.00s | 15.12s | +0.12s |
| `300351` | Hinano Miyako | `group_36` | 2 | `vo_char_3003_00_44_hca.hca` | 2.00s | 2.12s | +0.12s |
| `300400` | Sasara Minagi | `group_16` | 6 | `vo_char_3004_00_24_hca.hca` | 6.50s | 6.38s | -0.12s |
| `300600` | Emiri Kisaki | `group_19` | 12 | `vo_char_3006_00_27_hca.hca` | 12.50s | 12.38s | -0.12s |
| `300600` | Emiri Kisaki | `group_21` | 5 | `vo_char_3006_00_29_hca.hca` | 9.00s | 8.88s | -0.12s |
| `300600` | Emiri Kisaki | `group_8` | 8 | `vo_char_3006_00_16_hca.hca` | 10.00s | 10.12s | +0.12s |
| `300651` | Emiri Kisaki | `group_32` | 4 | `vo_char_3006_51_40_hca.hca` | 11.00s | 10.88s | -0.12s |
| `300651` | Emiri Kisaki | `group_8` | 6 | `vo_char_3006_00_16_hca.hca` | 10.00s | 10.12s | +0.12s |
| `300750` | Shizuku Hozumi | `group_19` | 3 | `vo_char_3007_50_27_hca.hca` | 13.60s | 13.48s | -0.12s |
| `300800` | Akira Shinobu | `group_6` | 6 | `vo_char_3008_00_14_hca.hca` | 6.00s | 5.88s | -0.12s |
| `300850` | Akira Shinobu | `group_28` | 6 | `vo_char_3008_50_36_hca.hca` | 17.00s | 16.88s | -0.12s |
| `300850` | Akira Shinobu | `group_6` | 3 | `vo_char_3008_00_14_hca.hca` | 6.00s | 5.88s | -0.12s |
| `300900` | Manaka Kurumi | `group_37` | 4 | `vo_char_3009_00_45_hca.hca` | 2.50s | 2.38s | -0.12s |
| `301100` | Kako Natsume | `group_38` | 3 | `vo_char_3011_00_46_hca.hca` | 2.00s | 1.88s | -0.12s |
| `301400` | Seika Kumi | `group_13` | 5 | `vo_char_3014_00_21_hca.hca` | 13.00s | 12.88s | -0.12s |
| `301600` | Kokoro Awane | `group_27` | 6 | `vo_char_3016_00_35_hca.hca` | 10.50s | 10.62s | +0.12s |
| `301950` | Ayaka Mariko | `group_16` | 4 | `vo_char_3019_50_24_hca.hca` | 9.00s | 9.12s | +0.12s |
| `301950` | Ayaka Mariko | `group_23` | 5 | `vo_char_3019_50_31_hca.hca` | 10.40s | 10.52s | +0.12s |
| `302300` | Aimi Eri | `group_40` | 3 | `vo_char_3023_00_64_hca.hca` | 5.00s | 4.88s | -0.12s |
| `302300` | Aimi Eri | `group_43` | 7 | `vo_char_3023_00_02_hca.hca` | 11.30s | 11.42s | +0.12s |
| `303000` | Konomi Haruna | `group_18` | 8 | `vo_char_3030_00_26_hca.hca` | 10.00s | 9.88s | -0.12s |
| `303100` | Rika Ayano | `group_21` | 7 | `vo_char_3031_00_29_hca.hca` | 16.00s | 15.88s | -0.12s |
| `303100` | Rika Ayano | `group_28` | 7 | `vo_char_3031_00_36_hca.hca` | 12.00s | 11.88s | -0.12s |
| `304400` | Ranka Chizu | `group_8` | 3 | `vo_char_3044_00_15_hca.hca` | 9.00s | 8.88s | -0.12s |
| `304900` | Kanae Yukino | `group_14` | 6 | `vo_char_3049_00_22_hca.hca` | 21.20s | 21.08s | -0.12s |
| `305251` | Ashley Taylor | `group_17` | 8 | `vo_char_3052_51_25_hca.hca` | 15.20s | 15.08s | -0.12s |
| `350401` | Masara & Kokoro | `group_28` | 4 | `vo_char_3504_01_35_hca.hca` | 14.70s | 14.58s | -0.12s |
| `390200` | Shi | `group_30` | 5 | `vo_char_3902_00_37_hca.hca` | 17.30s | 17.18s | -0.12s |
| `390200` | Shi | `group_9` | 5 | `vo_char_3902_00_16_hca.hca` | 15.70s | 15.58s | -0.12s |
| `400200` | Kirika Kure | `group_12` | 5 | `vo_char_4002_00_20_hca.hca` | 8.50s | 8.38s | -0.12s |
| `400300` | Yuma Chitose | `group_2` | 5 | `vo_char_4003_00_03_hca.hca` | 4.00s | 3.88s | -0.12s |
| `402100` | Tart | `group_20` | 5 | `vo_char_4021_00_28_hca.hca` | 13.00s | 12.88s | -0.12s |
| `402300` | Melissa | `group_25` | 4 | `vo_char_4023_00_33_hca.hca` | 11.00s | 10.88s | -0.12s |
| `402700` | Lapin | `group_30` | 5 | `vo_char_4027_00_37_hca.hca` | 10.50s | 10.62s | +0.12s |
| `403200` | Matsuri Hinata | `group_21` | 4 | `vo_char_4032_00_28_hca.hca` | 15.70s | 15.82s | +0.12s |
| `403500` | Haruka Kanade | `group_25` | 5 | `vo_char_4035_00_32_hca.hca` | 10.00s | 9.88s | -0.12s |
| `404600` | Shinobu Oshino | `group_10` | 4 | `vo_char_4046_00_17_hca.hca` | 16.00s | 15.88s | -0.12s |
| `100100` | Iroha Tamaki | `group_31` | 5 | `vo_char_1001_00_39_hca.hca` | 9.50s | 9.37s | -0.13s |
| `100150` | Iroha Tamaki | `group_20` | 4 | `vo_char_1001_50_28_hca.hca` | 11.00s | 10.87s | -0.13s |
| `100251` | Yachiyo Nanami | `group_25` | 4 | `vo_char_1002_51_33_hca.hca` | 9.00s | 8.87s | -0.13s |
| `100350` | Tsuruno Yui | `group_24` | 4 | `vo_char_1003_50_32_hca.hca` | 10.00s | 9.87s | -0.13s |
| `100351` | Tsuruno Yui | `group_28` | 8 | `vo_char_1003_51_36_hca.hca` | 15.30s | 15.17s | -0.13s |
| `100503` | Felicia Mitsuki | `group_30` | 6 | `vo_char_1005_03_38_hca.hca` | 11.30s | 11.17s | -0.13s |
| `100550` | Felicia Mitsuki | `group_19` | 5 | `vo_char_1005_50_27_hca.hca` | 12.00s | 11.87s | -0.13s |
| `100552` | Felicia Mitsuki | `group_25` | 5 | `vo_char_1005_52_33_hca.hca` | 10.00s | 9.87s | -0.13s |
| `100700` | Touka Satomi | `group_6` | 3 | `vo_char_1007_00_13_hca.hca` | 6.40s | 6.27s | -0.13s |
| `100750` | Touka Satomi | `group_18` | 6 | `vo_char_1007_50_25_hca.hca` | 16.50s | 16.63s | +0.13s |
| `100750` | Touka Satomi | `group_6` | 3 | `vo_char_1007_00_13_hca.hca` | 6.40s | 6.27s | -0.13s |
| `100850` | Alina Gray | `group_19` | 6 | `vo_char_1008_50_27_hca.hca` | 14.00s | 13.87s | -0.13s |
| `101000` | Momoko Togame | `group_39` | 4 | `vo_char_1010_00_63_hca.hca` | 4.00s | 3.87s | -0.13s |
| `101051` | Momoko Togame | `group_39` | 3 | `vo_char_1010_00_63_hca.hca` | 4.00s | 3.87s | -0.13s |
| `101152` | Kaede Akino | `group_16` | 6 | `vo_char_1011_52_24_hca.hca` | 16.80s | 16.67s | -0.13s |
| `101550` | Ui Tamaki | `group_19` | 5 | `vo_char_1015_50_26_hca.hca` | 11.00s | 10.87s | -0.13s |
| `101550` | Ui Tamaki | `group_22` | 5 | `vo_char_1015_50_29_hca.hca` | 14.00s | 13.87s | -0.13s |
| `101550` | Ui Tamaki | `group_34` | 6 | `vo_char_1015_50_41_hca.hca` | 13.00s | 12.87s | -0.13s |
| `101701` | Mitama Yakumo | `group_51` | 3 | `vo_game_0202_11_hca.hca` | 10.80s | 10.67s | -0.13s |
| `101751` | Mitama Yakumo | `group_45` | 3 | `vo_game_0802_02_hca.hca` | 6.70s | 6.57s | -0.13s |
| `103200` | Miyuri Yukari | `group_17` | 5 | `vo_char_1032_00_24_hca.hca` | 14.50s | 14.37s | -0.13s |
| `103200` | Miyuri Yukari | `group_23` | 5 | `vo_char_1032_00_30_hca.hca` | 15.50s | 15.37s | -0.13s |
| `104400` | Mikoto Sena | `group_26` | 5 | `vo_char_1044_00_33_hca.hca` | 12.80s | 12.67s | -0.13s |
| `105300` | Amaryllis | `group_28` | 5 | `vo_char_1053_00_35_hca.hca` | 14.30s | 14.17s | -0.13s |
| `105302` | Amaryllis | `group_10` | 4 | `vo_char_1053_00_17_hca.hca` | 13.20s | 13.33s | +0.13s |
| `110100` | Iroha Tamaki | `group_15` | 11 | `vo_char_1101_00_23_hca.hca` | 19.70s | 19.83s | +0.13s |
| `110700` | Touka & Nemu | `group_17` | 5 | `vo_char_1107_00_24_hca.hca` | 14.00s | 13.87s | -0.13s |
| `111000` | Momoko Togame | `group_18` | 5 | `vo_char_1110_00_25_hca.hca` | 12.10s | 12.23s | +0.13s |
| `111000` | Momoko Togame | `group_7` | 3 | `vo_char_1110_00_14_hca.hca` | 4.60s | 4.47s | -0.13s |
| `111800` | Amane Sisters | `group_40` | 2 | `vo_char_1118_00_63_hca.hca` | 2.50s | 2.37s | -0.13s |
| `111801` | Amane Sisters | `group_40` | 2 | `vo_char_1118_00_63_hca.hca` | 2.50s | 2.37s | -0.13s |
| `111802` | Amane Sisters | `group_40` | 2 | `vo_char_1118_00_63_hca.hca` | 2.50s | 2.37s | -0.13s |
| `120902` | Rena & Kaede | `group_18` | 6 | `vo_char_1209_02_25_hca.hca` | 15.30s | 15.17s | -0.13s |
| `120902` | Rena & Kaede | `group_26` | 5 | `vo_char_1209_02_33_hca.hca` | 13.60s | 13.73s | +0.13s |
| `130100` | Iroha & Yachiyo | `group_38` | 3 | `vo_char_1301_00_45_hca.hca` | 5.30s | 5.17s | -0.13s |
| `130101` | Iroha & Yachiyo | `group_38` | 3 | `vo_char_1301_00_45_hca.hca` | 5.30s | 5.17s | -0.13s |
| `130102` | Iroha & Yachiyo | `group_38` | 3 | `vo_char_1301_00_45_hca.hca` | 5.30s | 5.17s | -0.13s |
| `200602` | Kyoko Sakura | `group_28` | 5 | `vo_char_2006_02_36_hca.hca` | 9.80s | 9.67s | -0.13s |
| `220200` | Devil Homura | `group_32` | 4 | `vo_char_2202_00_39_hca.hca` | 12.40s | 12.53s | +0.13s |
| `220200` | Devil Homura | `group_35` | 2 | `vo_char_2202_00_42_hca.hca` | 3.00s | 2.87s | -0.13s |
| `250000` | Holy Mami | `group_29` | 3 | `vo_char_2500_00_37_hca.hca` | 10.00s | 9.87s | -0.13s |
| `250001` | Holy Mami | `group_24` | 4 | `vo_char_2500_01_32_hca.hca` | 11.00s | 10.87s | -0.13s |
| `300100` | Kanoko Yayoi | `group_1` | 8 | `vo_char_3001_00_01_hca.hca` | 23.00s | 22.87s | -0.13s |
| `300300` | Hinano Miyako | `group_10` | 8 | `vo_char_3003_00_18_hca.hca` | 13.00s | 13.13s | +0.13s |
| `300351` | Hinano Miyako | `group_10` | 7 | `vo_char_3003_00_18_hca.hca` | 13.00s | 13.13s | +0.13s |
| `300400` | Sasara Minagi | `group_36` | 4 | `vo_char_3004_00_44_hca.hca` | 2.00s | 1.87s | -0.13s |
| `300400` | Sasara Minagi | `group_39` | 5 | `vo_char_3004_00_63_hca.hca` | 4.00s | 4.13s | +0.13s |
| `300600` | Emiri Kisaki | `group_10` | 7 | `vo_char_3006_00_18_hca.hca` | 11.50s | 11.63s | +0.13s |
| `300600` | Emiri Kisaki | `group_35` | 3 | `vo_char_3006_00_43_hca.hca` | 2.50s | 2.37s | -0.13s |
| `300651` | Emiri Kisaki | `group_10` | 5 | `vo_char_3006_00_18_hca.hca` | 11.50s | 11.63s | +0.13s |
| `300800` | Akira Shinobu | `group_13` | 9 | `vo_char_3008_00_21_hca.hca` | 12.00s | 12.13s | +0.13s |
| `300800` | Akira Shinobu | `group_19` | 13 | `vo_char_3008_00_27_hca.hca` | 13.00s | 13.13s | +0.13s |
| `300850` | Akira Shinobu | `group_13` | 6 | `vo_char_3008_00_21_hca.hca` | 12.00s | 12.13s | +0.13s |
| `300850` | Akira Shinobu | `group_19` | 5 | `vo_char_3008_50_27_hca.hca` | 16.00s | 15.87s | -0.13s |
| `300900` | Manaka Kurumi | `group_20` | 6 | `vo_char_3009_00_28_hca.hca` | 8.00s | 8.13s | +0.13s |
| `300900` | Manaka Kurumi | `group_29` | 5 | `vo_char_3009_00_37_hca.hca` | 9.00s | 9.13s | +0.13s |
| `300900` | Manaka Kurumi | `group_32` | 7 | `vo_char_3009_00_40_hca.hca` | 10.00s | 9.87s | -0.13s |
| `301300` | Leila Ibuki | `group_1` | 8 | `vo_char_3013_00_01_hca.hca` | 24.50s | 24.37s | -0.13s |
| `301500` | Mito Aino | `group_38` | 3 | `vo_char_3015_00_46_hca.hca` | 3.00s | 2.87s | -0.13s |
| `301600` | Kokoro Awane | `group_37` | 3 | `vo_char_3016_00_45_hca.hca` | 3.00s | 2.87s | -0.13s |
| `301650` | Kokoro Awane | `group_37` | 2 | `vo_char_3016_00_45_hca.hca` | 3.00s | 2.87s | -0.13s |
| `302100` | Sakuya Suzuka | `group_36` | 2 | `vo_char_3021_00_43_hca.hca` | 2.50s | 2.63s | +0.13s |
| `303000` | Konomi Haruna | `group_23` | 8 | `vo_char_3030_00_31_hca.hca` | 10.00s | 9.87s | -0.13s |
| `303551` | Riko Chiaki | `group_16` | 7 | `vo_char_3035_51_24_hca.hca` | 17.50s | 17.63s | +0.13s |
| `303551` | Riko Chiaki | `group_33` | 5 | `vo_char_3035_51_41_hca.hca` | 11.90s | 12.03s | +0.13s |
| `304300` | Eternal Sakura | `group_16` | 7 | `vo_char_3043_00_23_hca.hca` | 26.70s | 26.83s | +0.13s |
| `304800` | Hotaru Yura | `group_11` | 5 | `vo_char_3048_00_18_hca.hca` | 15.50s | 15.37s | -0.13s |
| `304800` | Hotaru Yura | `group_23` | 7 | `vo_char_3048_00_30_hca.hca` | 18.80s | 18.93s | +0.13s |
| `305100` | Jun Kazari | `group_4` | 2 | `vo_char_3051_00_04_hca.hca` | 4.80s | 4.67s | -0.13s |
| `305251` | Ashley Taylor | `group_19` | 8 | `vo_char_3052_51_27_hca.hca` | 14.00s | 14.13s | +0.13s |
| `305251` | Ashley Taylor | `group_32` | 7 | `vo_char_3052_51_40_hca.hca` | 12.60s | 12.47s | -0.13s |
| `305400` | Mitsune Miwa | `group_23` | 6 | `vo_char_3054_00_30_hca.hca` | 12.00s | 11.87s | -0.13s |
| `305400` | Mitsune Miwa | `group_30` | 4 | `vo_char_3054_00_37_hca.hca` | 13.00s | 12.87s | -0.13s |
| `305800` | Ryoko Natsu | `group_9` | 4 | `vo_char_3058_00_16_hca.hca` | 12.50s | 12.37s | -0.13s |
| `350401` | Masara & Kokoro | `group_21` | 7 | `vo_char_3504_01_28_hca.hca` | 15.80s | 15.67s | -0.13s |
| `400100` | Oriko Mikuni | `group_34` | 3 | `vo_char_4001_00_42_hca.hca` | 2.00s | 1.87s | -0.13s |
| `400100` | Oriko Mikuni | `group_40` | 4 | `vo_char_4001_00_64_hca.hca` | 5.00s | 4.87s | -0.13s |
| `400200` | Kirika Kure | `group_7` | 4 | `vo_char_4002_00_15_hca.hca` | 6.00s | 5.87s | -0.13s |
| `400300` | Yuma Chitose | `group_18` | 7 | `vo_char_4003_00_26_hca.hca` | 12.50s | 12.63s | +0.13s |
| `400300` | Yuma Chitose | `group_31` | 7 | `vo_char_4003_00_39_hca.hca` | 14.50s | 14.37s | -0.13s |
| `402700` | Lapin | `group_3` | 2 | `vo_char_4027_00_03_hca.hca` | 3.50s | 3.63s | +0.13s |
| `402700` | Lapin | `group_31` | 4 | `vo_char_4027_00_38_hca.hca` | 11.00s | 10.87s | -0.13s |
| `404500` | Tsubasa Hanekawa | `group_26` | 3 | `vo_char_4045_00_33_hca.hca` | 9.70s | 9.57s | -0.13s |
| `405200` | Fate | `group_27` | 6 | `vo_char_4052_00_34_hca.hca` | 14.20s | 14.33s | +0.13s |
| `405200` | Fate | `group_29` | 5 | `vo_char_4052_00_36_hca.hca` | 11.50s | 11.63s | +0.13s |
| `405300` | Hayate Yagami | `group_12` | 5 | `vo_char_4053_00_19_hca.hca` | 4.70s | 4.83s | +0.13s |
| `412100` | Isabeau | `group_34` | 3 | `vo_char_4121_00_41_hca.hca` | 5.00s | 4.87s | -0.13s |
| `100100` | Iroha Tamaki | `group_25` | 7 | `vo_char_1001_00_33_hca.hca` | 9.00s | 9.14s | +0.14s |
| `100351` | Tsuruno Yui | `group_30` | 6 | `vo_char_1003_51_38_hca.hca` | 12.00s | 11.86s | -0.14s |
| `100750` | Touka Satomi | `group_28` | 4 | `vo_char_1007_50_35_hca.hca` | 11.00s | 10.86s | -0.14s |
| `100900` | Rena Minami | `group_23` | 5 | `vo_char_1009_00_31_hca.hca` | 7.00s | 7.14s | +0.14s |
| `100900` | Rena Minami | `group_37` | 4 | `vo_char_1009_00_45_hca.hca` | 3.00s | 2.86s | -0.14s |
| `100950` | Rena Minami | `group_37` | 3 | `vo_char_1009_00_45_hca.hca` | 3.00s | 2.86s | -0.14s |
| `100951` | Rena Minami | `group_31` | 4 | `vo_char_1009_51_39_hca.hca` | 14.00s | 13.86s | -0.14s |
| `100951` | Rena Minami | `group_37` | 3 | `vo_char_1009_00_45_hca.hca` | 3.00s | 2.86s | -0.14s |
| `101152` | Kaede Akino | `group_32` | 7 | `vo_char_1011_52_40_hca.hca` | 15.60s | 15.46s | -0.14s |
| `101751` | Mitama Yakumo | `group_44` | 4 | `vo_game_0802_01_hca.hca` | 7.10s | 7.24s | +0.14s |
| `103250` | Miyuri Yukari | `group_27` | 5 | `vo_char_1032_50_34_hca.hca` | 12.50s | 12.64s | +0.14s |
| `104100` | Livia Medeiros | `group_27` | 4 | `vo_char_1041_00_34_hca.hca` | 11.30s | 11.16s | -0.14s |
| `104400` | Mikoto Sena | `group_38` | 2 | `vo_char_1044_00_45_hca.hca` | 3.30s | 3.16s | -0.14s |
| `105300` | Amaryllis | `group_2` | 5 | `vo_char_1053_00_02_hca.hca` | 14.00s | 13.86s | -0.14s |
| `105302` | Amaryllis | `group_2` | 4 | `vo_char_1053_00_02_hca.hca` | 14.00s | 13.86s | -0.14s |
| `105302` | Amaryllis | `group_30` | 4 | `vo_char_1053_02_37_hca.hca` | 13.80s | 13.66s | -0.14s |
| `111200` | Karin & Alina | `group_37` | 3 | `vo_char_1112_00_44_hca.hca` | 4.20s | 4.06s | -0.14s |
| `111201` | Karin & Alina | `group_37` | 2 | `vo_char_1112_00_44_hca.hca` | 4.20s | 4.06s | -0.14s |
| `111202` | Karin & Alina | `group_37` | 2 | `vo_char_1112_00_44_hca.hca` | 4.20s | 4.06s | -0.14s |
| `120900` | Rena & Kaede | `group_20` | 6 | `vo_char_1209_00_27_hca.hca` | 13.50s | 13.36s | -0.14s |
| `120900` | Rena & Kaede | `group_30` | 5 | `vo_char_1209_00_37_hca.hca` | 13.50s | 13.36s | -0.14s |
| `130101` | Iroha & Yachiyo | `group_19` | 5 | `vo_char_1301_01_26_hca.hca` | 12.80s | 12.66s | -0.14s |
| `130102` | Iroha & Yachiyo | `group_33` | 8 | `vo_char_1301_02_40_hca.hca` | 12.20s | 12.34s | +0.14s |
| `200651` | Kyoko Sakura | `group_16` | 5 | `vo_char_2006_51_24_hca.hca` | 10.00s | 10.14s | +0.14s |
| `260000` | Kyoko Sakura | `group_27` | 4 | `vo_char_2600_00_34_hca.hca` | 13.00s | 12.86s | -0.14s |
| `300300` | Hinano Miyako | `group_33` | 7 | `vo_char_3003_00_41_hca.hca` | 10.50s | 10.36s | -0.14s |
| `300300` | Hinano Miyako | `group_6` | 4 | `vo_char_3003_00_14_hca.hca` | 5.50s | 5.36s | -0.14s |
| `300351` | Hinano Miyako | `group_6` | 3 | `vo_char_3003_00_14_hca.hca` | 5.50s | 5.36s | -0.14s |
| `300400` | Sasara Minagi | `group_8` | 8 | `vo_char_3004_00_16_hca.hca` | 14.00s | 13.86s | -0.14s |
| `300500` | Nanaka Tokiwa | `group_23` | 7 | `vo_char_3005_00_31_hca.hca` | 12.00s | 11.86s | -0.14s |
| `300600` | Emiri Kisaki | `group_13` | 9 | `vo_char_3006_00_21_hca.hca` | 16.00s | 16.14s | +0.14s |
| `300600` | Emiri Kisaki | `group_23` | 8 | `vo_char_3006_00_31_hca.hca` | 8.50s | 8.36s | -0.14s |
| `300651` | Emiri Kisaki | `group_13` | 7 | `vo_char_3006_00_21_hca.hca` | 16.00s | 16.14s | +0.14s |
| `300700` | Shizuku Hozumi | `group_4` | 5 | `vo_char_3007_00_05_hca.hca` | 7.00s | 6.86s | -0.14s |
| `300750` | Shizuku Hozumi | `group_4` | 3 | `vo_char_3007_00_05_hca.hca` | 7.00s | 6.86s | -0.14s |
| `300800` | Akira Shinobu | `group_16` | 11 | `vo_char_3008_00_24_hca.hca` | 10.00s | 9.86s | -0.14s |
| `300900` | Manaka Kurumi | `group_27` | 6 | `vo_char_3009_00_35_hca.hca` | 7.50s | 7.36s | -0.14s |
| `301150` | Kako Natsume | `group_23` | 6 | `vo_char_3011_50_31_hca.hca` | 17.10s | 16.96s | -0.14s |
| `301600` | Kokoro Awane | `group_42` | 4 | `vo_char_3016_00_66_hca.hca` | 3.80s | 3.66s | -0.14s |
| `301650` | Kokoro Awane | `group_42` | 3 | `vo_char_3016_00_66_hca.hca` | 3.80s | 3.66s | -0.14s |
| `301900` | Ayaka Mariko | `group_40` | 4 | `vo_char_3019_00_64_hca.hca` | 4.50s | 4.36s | -0.14s |
| `301950` | Ayaka Mariko | `group_40` | 2 | `vo_char_3019_00_64_hca.hca` | 4.50s | 4.36s | -0.14s |
| `302600` | Konoha Shizumi | `group_38` | 3 | `vo_char_3026_00_46_hca.hca` | 3.00s | 2.86s | -0.14s |
| `303000` | Konomi Haruna | `group_10` | 8 | `vo_char_3030_00_18_hca.hca` | 10.50s | 10.36s | -0.14s |
| `303000` | Konomi Haruna | `group_12` | 8 | `vo_char_3030_00_20_hca.hca` | 6.50s | 6.36s | -0.14s |
| `303051` | Konomi Haruna | `group_10` | 6 | `vo_char_3030_00_18_hca.hca` | 10.50s | 10.36s | -0.14s |
| `303051` | Konomi Haruna | `group_12` | 6 | `vo_char_3030_00_20_hca.hca` | 6.50s | 6.36s | -0.14s |
| `303100` | Rika Ayano | `group_31` | 7 | `vo_char_3031_00_39_hca.hca` | 10.50s | 10.36s | -0.14s |
| `303400` | Moka Megumi | `group_36` | 2 | `vo_char_3034_00_43_hca.hca` | 2.00s | 1.86s | -0.14s |
| `303751` | Mel Anna | `group_33` | 6 | `vo_char_3037_51_41_hca.hca` | 16.00s | 15.86s | -0.14s |
| `304800` | Hotaru Yura | `group_35` | 3 | `vo_char_3048_00_42_hca.hca` | 4.70s | 4.56s | -0.14s |
| `304800` | Hotaru Yura | `group_6` | 4 | `vo_char_3048_00_13_hca.hca` | 12.50s | 12.64s | +0.14s |
| `350401` | Masara & Kokoro | `group_25` | 5 | `vo_char_3504_01_32_hca.hca` | 14.30s | 14.44s | +0.14s |
| `390200` | Shi | `group_32` | 4 | `vo_char_3902_00_39_hca.hca` | 12.70s | 12.56s | -0.14s |
| `390201` | Shi | `group_34` | 8 | `vo_char_3902_01_41_hca.hca` | 25.70s | 25.84s | +0.14s |
| `400300` | Yuma Chitose | `group_15` | 8 | `vo_char_4003_00_23_hca.hca` | 20.00s | 19.86s | -0.14s |
| `400300` | Yuma Chitose | `group_34` | 3 | `vo_char_4003_00_42_hca.hca` | 2.00s | 1.86s | -0.14s |
| `401100` | Kazumi | `group_13` | 5 | `vo_char_4011_00_21_hca.hca` | 13.00s | 12.86s | -0.14s |
| `401200` | Umika Misaki | `group_39` | 4 | `vo_char_4012_00_63_hca.hca` | 4.00s | 3.86s | -0.14s |
| `402200` | Riz | `group_9` | 5 | `vo_char_4022_00_17_hca.hca` | 12.00s | 11.86s | -0.14s |
| `402250` | Riz | `group_9` | 3 | `vo_char_4022_00_17_hca.hca` | 12.00s | 11.86s | -0.14s |
| `402500` | Corbeau | `group_16` | 5 | `vo_char_4025_00_23_hca.hca` | 17.70s | 17.56s | -0.14s |
| `402500` | Corbeau | `group_4` | 3 | `vo_char_4025_00_04_hca.hca` | 4.00s | 3.86s | -0.14s |
| `403200` | Matsuri Hinata | `group_9` | 4 | `vo_char_4032_00_16_hca.hca` | 8.00s | 7.86s | -0.14s |
| `403500` | Haruka Kanade | `group_7` | 2 | `vo_char_4035_00_14_hca.hca` | 5.00s | 4.86s | -0.14s |
| `404100` | Hitagi Senjougahara | `group_35` | 2 | `vo_char_4041_00_43_hca.hca` | 2.10s | 1.96s | -0.14s |
| `404400` | Nadeko Sengoku | `group_23` | 2 | `vo_char_4044_00_31_hca.hca` | 9.30s | 9.16s | -0.14s |
| `404500` | Tsubasa Hanekawa | `group_13` | 2 | `vo_char_4045_00_20_hca.hca` | 4.40s | 4.26s | -0.14s |
| `404500` | Tsubasa Hanekawa | `group_14` | 2 | `vo_char_4045_00_21_hca.hca` | 4.40s | 4.26s | -0.14s |
| `404500` | Tsubasa Hanekawa | `group_15` | 2 | `vo_char_4045_00_22_hca.hca` | 4.40s | 4.26s | -0.14s |
| `404500` | Tsubasa Hanekawa | `group_16` | 2 | `vo_char_4045_00_23_hca.hca` | 4.40s | 4.26s | -0.14s |
| `405100` | Nanoha Takamachi | `group_18` | 5 | `vo_char_4051_00_25_hca.hca` | 10.00s | 9.86s | -0.14s |
| `100100` | Iroha Tamaki | `group_35` | 3 | `vo_char_1001_00_43_hca.hca` | 2.50s | 2.35s | -0.15s |
| `100100` | Iroha Tamaki | `group_4` | 5 | `vo_char_1001_00_05_hca.hca` | 9.00s | 8.85s | -0.15s |
| `100103` | Iroha Tamaki | `group_35` | 3 | `vo_char_1001_00_43_hca.hca` | 2.50s | 2.35s | -0.15s |
| `100103` | Iroha Tamaki | `group_4` | 5 | `vo_char_1001_00_05_hca.hca` | 9.00s | 8.85s | -0.15s |
| `100150` | Iroha Tamaki | `group_35` | 2 | `vo_char_1001_00_43_hca.hca` | 2.50s | 2.35s | -0.15s |
| `100150` | Iroha Tamaki | `group_4` | 4 | `vo_char_1001_00_05_hca.hca` | 9.00s | 8.85s | -0.15s |
| `100153` | Iroha Tamaki | `group_35` | 2 | `vo_char_1001_00_43_hca.hca` | 2.50s | 2.35s | -0.15s |
| `100153` | Iroha Tamaki | `group_4` | 4 | `vo_char_1001_00_05_hca.hca` | 9.00s | 8.85s | -0.15s |
| `100351` | Tsuruno Yui | `group_32` | 9 | `vo_char_1003_51_40_hca.hca` | 15.50s | 15.35s | -0.15s |
| `100503` | Felicia Mitsuki | `group_16` | 6 | `vo_char_1005_03_24_hca.hca` | 10.00s | 9.85s | -0.15s |
| `100700` | Touka Satomi | `group_17` | 5 | `vo_char_1007_00_24_hca.hca` | 12.50s | 12.35s | -0.15s |
| `101000` | Momoko Togame | `group_1` | 12 | `vo_char_1010_00_01_hca.hca` | 23.50s | 23.35s | -0.15s |
| `101000` | Momoko Togame | `group_15` | 9 | `vo_char_1010_00_23_hca.hca` | 12.80s | 12.95s | +0.15s |
| `101000` | Momoko Togame | `group_19` | 6 | `vo_char_1010_00_27_hca.hca` | 8.50s | 8.65s | +0.15s |
| `101000` | Momoko Togame | `group_23` | 8 | `vo_char_1010_00_31_hca.hca` | 10.50s | 10.65s | +0.15s |
| `101051` | Momoko Togame | `group_1` | 11 | `vo_char_1010_00_01_hca.hca` | 23.50s | 23.35s | -0.15s |
| `101051` | Momoko Togame | `group_15` | 8 | `vo_char_1010_00_23_hca.hca` | 12.80s | 12.95s | +0.15s |
| `101100` | Kaede Akino | `group_14` | 8 | `vo_char_1011_00_22_hca.hca` | 20.00s | 19.85s | -0.15s |
| `101100` | Kaede Akino | `group_25` | 5 | `vo_char_1011_00_33_hca.hca` | 10.50s | 10.35s | -0.15s |
| `101100` | Kaede Akino | `group_27` | 6 | `vo_char_1011_00_35_hca.hca` | 12.00s | 11.85s | -0.15s |
| `101150` | Kaede Akino | `group_14` | 7 | `vo_char_1011_00_22_hca.hca` | 20.00s | 19.85s | -0.15s |
| `101152` | Kaede Akino | `group_14` | 6 | `vo_char_1011_00_22_hca.hca` | 20.00s | 19.85s | -0.15s |
| `101200` | Karin Misono | `group_37` | 3 | `vo_char_1012_00_45_hca.hca` | 3.00s | 2.85s | -0.15s |
| `101250` | Karin Misono | `group_27` | 4 | `vo_char_1012_50_35_hca.hca` | 15.00s | 14.85s | -0.15s |
| `101250` | Karin Misono | `group_37` | 2 | `vo_char_1012_00_45_hca.hca` | 3.00s | 2.85s | -0.15s |
| `101300` | Asuka Tatsuki | `group_13` | 10 | `vo_char_1013_00_21_hca.hca` | 16.50s | 16.35s | -0.15s |
| `101400` | Nemu Hiiragi | `group_15` | 5 | `vo_char_1014_00_22_hca.hca` | 24.00s | 24.15s | +0.15s |
| `101450` | Nemu Hiiragi | `group_15` | 5 | `vo_char_1014_00_22_hca.hca` | 24.00s | 24.15s | +0.15s |
| `101450` | Nemu Hiiragi | `group_32` | 8 | `vo_char_1014_50_39_hca.hca` | 23.50s | 23.65s | +0.15s |
| `101799` | Mitama Yakumo | `group_3` | 5 | `vo_game_0002_03_hca.hca` | 10.00s | 10.15s | +0.15s |
| `102200` | Hikaru Kirari | `group_45` | 5 | `vo_game_0302_09_hca.hca` | 10.10s | 10.25s | +0.15s |
| `102200` | Hikaru Kirari | `group_48` | 5 | `vo_game_0302_12_hca.hca` | 10.80s | 10.95s | +0.15s |
| `102250` | Hikaru Kirari | `group_48` | 4 | `vo_game_0302_12_hca.hca` | 10.80s | 10.95s | +0.15s |
| `102400` | Juri Oba | `group_48` | 5 | `vo_game_0502_12_hca.hca` | 11.30s | 11.45s | +0.15s |
| `102650` | Chiharu Hiroe | `group_28` | 6 | `vo_char_1026_50_35_hca.hca` | 17.20s | 17.05s | -0.15s |
| `102800` | Himena Aika | `group_14` | 4 | `vo_char_1028_00_21_hca.hca` | 10.60s | 10.75s | +0.15s |
| `102850` | Himena Aika | `group_14` | 3 | `vo_char_1028_00_21_hca.hca` | 10.60s | 10.75s | +0.15s |
| `103250` | Miyuri Yukari | `group_20` | 5 | `vo_char_1032_50_27_hca.hca` | 13.40s | 13.25s | -0.15s |
| `103250` | Miyuri Yukari | `group_29` | 4 | `vo_char_1032_50_36_hca.hca` | 12.30s | 12.45s | +0.15s |
| `104100` | Livia Medeiros | `group_34` | 6 | `vo_char_1041_00_41_hca.hca` | 13.80s | 13.95s | +0.15s |
| `110100` | Iroha Tamaki | `group_13` | 5 | `vo_char_1101_00_21_hca.hca` | 12.00s | 11.85s | -0.15s |
| `110100` | Iroha Tamaki | `group_33` | 5 | `vo_char_1101_00_41_hca.hca` | 13.00s | 12.85s | -0.15s |
| `110401` | Uwasa Sana | `group_33` | 4 | `vo_char_1104_01_40_hca.hca` | 15.70s | 15.55s | -0.15s |
| `110500` | Felicia-chan | `group_23` | 3 | `vo_char_1105_00_30_hca.hca` | 8.20s | 8.05s | -0.15s |
| `110700` | Touka & Nemu | `group_27` | 5 | `vo_char_1107_00_34_hca.hca` | 13.40s | 13.25s | -0.15s |
| `110700` | Touka & Nemu | `group_3` | 2 | `vo_char_1107_00_03_hca.hca` | 4.40s | 4.25s | -0.15s |
| `110701` | Touka & Nemu | `group_3` | 2 | `vo_char_1107_00_03_hca.hca` | 4.40s | 4.25s | -0.15s |
| `110702` | Touka & Nemu | `group_3` | 2 | `vo_char_1107_00_03_hca.hca` | 4.40s | 4.25s | -0.15s |
| `110800` | Holy Alina | `group_22` | 4 | `vo_char_1108_00_29_hca.hca` | 14.00s | 13.85s | -0.15s |
| `120902` | Rena & Kaede | `group_21` | 9 | `vo_char_1209_02_28_hca.hca` | 16.40s | 16.55s | +0.15s |
| `200400` | Sayaka Miki | `group_6` | 6 | `vo_char_2004_00_14_hca.hca` | 7.00s | 6.85s | -0.15s |
| `200451` | Sayaka Miki | `group_6` | 4 | `vo_char_2004_00_14_hca.hca` | 7.00s | 6.85s | -0.15s |
| `200600` | Kyoko Sakura | `group_18` | 9 | `vo_char_2006_00_26_hca.hca` | 15.00s | 14.85s | -0.15s |
| `200700` | Nagisa Momoe | `group_22` | 8 | `vo_char_2007_00_29_hca.hca` | 12.60s | 12.75s | +0.15s |
| `210100` | Ultimate Madoka | `group_16` | 8 | `vo_char_2101_00_24_hca.hca` | 12.30s | 12.15s | -0.15s |
| `300300` | Hinano Miyako | `group_17` | 7 | `vo_char_3003_00_25_hca.hca` | 9.50s | 9.65s | +0.15s |
| `300300` | Hinano Miyako | `group_7` | 6 | `vo_char_3003_00_15_hca.hca` | 6.50s | 6.65s | +0.15s |
| `300351` | Hinano Miyako | `group_7` | 5 | `vo_char_3003_00_15_hca.hca` | 6.50s | 6.65s | +0.15s |
| `300400` | Sasara Minagi | `group_32` | 6 | `vo_char_3004_00_40_hca.hca` | 11.00s | 10.85s | -0.15s |
| `300400` | Sasara Minagi | `group_9` | 6 | `vo_char_3004_00_17_hca.hca` | 13.00s | 12.85s | -0.15s |
| `300600` | Emiri Kisaki | `group_18` | 7 | `vo_char_3006_00_26_hca.hca` | 14.00s | 13.85s | -0.15s |
| `300700` | Shizuku Hozumi | `group_23` | 6 | `vo_char_3007_00_31_hca.hca` | 10.50s | 10.65s | +0.15s |
| `300800` | Akira Shinobu | `group_23` | 9 | `vo_char_3008_00_31_hca.hca` | 10.00s | 9.85s | -0.15s |
| `300900` | Manaka Kurumi | `group_38` | 4 | `vo_char_3009_00_46_hca.hca` | 3.00s | 2.85s | -0.15s |
| `301100` | Kako Natsume | `group_16` | 6 | `vo_char_3011_00_24_hca.hca` | 9.50s | 9.35s | -0.15s |
| `301400` | Seika Kumi | `group_41` | 3 | `vo_char_3014_00_65_hca.hca` | 3.00s | 2.85s | -0.15s |
| `301650` | Kokoro Awane | `group_32` | 6 | `vo_char_3016_50_40_hca.hca` | 11.70s | 11.85s | +0.15s |
| `302100` | Sakuya Suzuka | `group_24` | 4 | `vo_char_3021_00_31_hca.hca` | 8.80s | 8.95s | +0.15s |
| `302300` | Aimi Eri | `group_29` | 5 | `vo_char_3023_00_37_hca.hca` | 10.00s | 9.85s | -0.15s |
| `302950` | Masara Kagami | `group_27` | 6 | `vo_char_3029_50_35_hca.hca` | 18.00s | 17.85s | -0.15s |
| `303000` | Konomi Haruna | `group_26` | 6 | `vo_char_3030_00_34_hca.hca` | 9.00s | 8.85s | -0.15s |
| `303000` | Konomi Haruna | `group_4` | 5 | `vo_char_3030_00_05_hca.hca` | 4.50s | 4.35s | -0.15s |
| `303051` | Konomi Haruna | `group_4` | 3 | `vo_char_3030_00_05_hca.hca` | 4.50s | 4.35s | -0.15s |
| `303700` | Mel Anna | `group_21` | 6 | `vo_char_3037_00_29_hca.hca` | 12.00s | 11.85s | -0.15s |
| `304300` | Eternal Sakura | `group_31` | 3 | `vo_char_3043_00_38_hca.hca` | 9.50s | 9.35s | -0.15s |
| `304400` | Ranka Chizu | `group_1` | 7 | `vo_char_3044_00_01_hca.hca` | 27.70s | 27.55s | -0.15s |
| `304400` | Ranka Chizu | `group_11` | 4 | `vo_char_3044_00_18_hca.hca` | 13.45s | 13.30s | -0.15s |
| `304400` | Ranka Chizu | `group_22` | 3 | `vo_char_3044_00_29_hca.hca` | 12.10s | 11.95s | -0.15s |
| `304650` | Ryo Midori | `group_30` | 5 | `vo_char_3046_50_37_hca.hca` | 10.70s | 10.55s | -0.15s |
| `304700` | Chika Aoba | `group_25` | 4 | `vo_char_3047_00_32_hca.hca` | 12.40s | 12.55s | +0.15s |
| `304800` | Hotaru Yura | `group_10` | 5 | `vo_char_3048_00_17_hca.hca` | 16.60s | 16.75s | +0.15s |
| `304900` | Kanae Yukino | `group_37` | 2 | `vo_char_3049_00_45_hca.hca` | 3.00s | 2.85s | -0.15s |
| `305100` | Jun Kazari | `group_23` | 4 | `vo_char_3051_00_30_hca.hca` | 9.50s | 9.35s | -0.15s |
| `305350` | Ikumi Makino | `group_17` | 6 | `vo_char_3053_50_24_hca.hca` | 11.20s | 11.05s | -0.15s |
| `350100` | Rika & Ren | `group_28` | 6 | `vo_char_3501_00_35_hca.hca` | 16.20s | 16.05s | -0.15s |
| `400100` | Oriko Mikuni | `group_14` | 6 | `vo_char_4001_00_22_hca.hca` | 16.00s | 15.85s | -0.15s |
| `400100` | Oriko Mikuni | `group_28` | 5 | `vo_char_4001_00_36_hca.hca` | 11.00s | 10.85s | -0.15s |
| `400300` | Yuma Chitose | `group_13` | 6 | `vo_char_4003_00_21_hca.hca` | 11.50s | 11.35s | -0.15s |
| `400300` | Yuma Chitose | `group_25` | 8 | `vo_char_4003_00_33_hca.hca` | 10.50s | 10.35s | -0.15s |
| `401200` | Umika Misaki | `group_28` | 4 | `vo_char_4012_00_36_hca.hca` | 11.00s | 10.85s | -0.15s |
| `402100` | Tart | `group_21` | 6 | `vo_char_4021_00_29_hca.hca` | 11.00s | 10.85s | -0.15s |
| `402300` | Melissa | `group_18` | 5 | `vo_char_4023_00_26_hca.hca` | 10.00s | 9.85s | -0.15s |
| `402300` | Melissa | `group_20` | 5 | `vo_char_4023_00_28_hca.hca` | 11.00s | 10.85s | -0.15s |
| `402300` | Melissa | `group_27` | 4 | `vo_char_4023_00_35_hca.hca` | 11.00s | 10.85s | -0.15s |
| `402300` | Melissa | `group_8` | 4 | `vo_char_4023_00_16_hca.hca` | 11.50s | 11.65s | +0.15s |
| `402350` | Melissa | `group_8` | 2 | `vo_char_4023_00_16_hca.hca` | 11.50s | 11.65s | +0.15s |
| `404500` | Tsubasa Hanekawa | `group_33` | 2 | `vo_char_4045_00_40_hca.hca` | 10.00s | 9.85s | -0.15s |
| `404600` | Shinobu Oshino | `group_22` | 2 | `vo_char_4046_00_29_hca.hca` | 14.00s | 13.85s | -0.15s |
| `405100` | Nanoha Takamachi | `group_19` | 4 | `vo_char_4051_00_26_hca.hca` | 4.50s | 4.35s | -0.15s |
| `405100` | Nanoha Takamachi | `group_26` | 4 | `vo_char_4051_00_33_hca.hca` | 5.80s | 5.65s | -0.15s |
| `100350` | Tsuruno Yui | `group_28` | 3 | `vo_char_1003_50_36_hca.hca` | 8.00s | 7.84s | -0.16s |
| `100352` | Tsuruno Yui | `group_24` | 6 | `vo_char_1003_52_32_hca.hca` | 13.00s | 13.16s | +0.16s |
| `100352` | Tsuruno Yui | `group_27` | 6 | `vo_char_1003_52_35_hca.hca` | 14.00s | 13.84s | -0.16s |
| `100900` | Rena Minami | `group_5` | 5 | `vo_char_1009_00_13_hca.hca` | 6.00s | 5.84s | -0.16s |
| `100900` | Rena Minami | `group_6` | 4 | `vo_char_1009_00_14_hca.hca` | 4.50s | 4.34s | -0.16s |
| `100950` | Rena Minami | `group_5` | 4 | `vo_char_1009_00_13_hca.hca` | 6.00s | 5.84s | -0.16s |
| `100950` | Rena Minami | `group_6` | 3 | `vo_char_1009_00_14_hca.hca` | 4.50s | 4.34s | -0.16s |
| `100951` | Rena Minami | `group_5` | 4 | `vo_char_1009_00_13_hca.hca` | 6.00s | 5.84s | -0.16s |
| `100951` | Rena Minami | `group_6` | 3 | `vo_char_1009_00_14_hca.hca` | 4.50s | 4.34s | -0.16s |
| `101100` | Kaede Akino | `group_26` | 7 | `vo_char_1011_00_34_hca.hca` | 13.50s | 13.34s | -0.16s |
| `101200` | Karin Misono | `group_21` | 5 | `vo_char_1012_00_29_hca.hca` | 11.00s | 10.84s | -0.16s |
| `101300` | Asuka Tatsuki | `group_20` | 9 | `vo_char_1013_00_28_hca.hca` | 9.50s | 9.34s | -0.16s |
| `101750` | Mitama Yakumo | `group_18` | 6 | `vo_char_1017_50_26_hca.hca` | 17.00s | 16.84s | -0.16s |
| `101750` | Mitama Yakumo | `group_20` | 5 | `vo_char_1017_50_28_hca.hca` | 16.00s | 15.84s | -0.16s |
| `102100` | Yuna Kureha | `group_41` | 4 | `vo_game_0602_02_hca.hca` | 10.50s | 10.66s | +0.16s |
| `102100` | Yuna Kureha | `group_48` | 4 | `vo_game_0602_12_hca.hca` | 10.80s | 10.64s | -0.16s |
| `102350` | Ao Kasane | `group_46` | 4 | `vo_game_0402_10_hca.hca` | 13.00s | 13.16s | +0.16s |
| `102551` | Shizuka Tokime | `group_34` | 4 | `vo_char_1025_51_41_hca.hca` | 14.00s | 13.84s | -0.16s |
| `103200` | Miyuri Yukari | `group_18` | 6 | `vo_char_1032_00_25_hca.hca` | 20.20s | 20.04s | -0.16s |
| `103500` | Alexandra Kurusu | `group_36` | 2 | `vo_char_1035_00_43_hca.hca` | 2.00s | 1.84s | -0.16s |
| `103951` | Sudachi Sawa | `group_26` | 4 | `vo_char_1039_51_33_hca.hca` | 11.90s | 11.74s | -0.16s |
| `104100` | Livia Medeiros | `group_22` | 3 | `vo_char_1041_00_29_hca.hca` | 9.20s | 9.36s | +0.16s |
| `105300` | Amaryllis | `group_33` | 6 | `vo_char_1053_00_40_hca.hca` | 12.50s | 12.66s | +0.16s |
| `105302` | Amaryllis | `group_17` | 5 | `vo_char_1053_02_24_hca.hca` | 12.30s | 12.14s | -0.16s |
| `110100` | Iroha Tamaki | `group_31` | 4 | `vo_char_1101_00_39_hca.hca` | 9.00s | 8.84s | -0.16s |
| `111000` | Momoko Togame | `group_11` | 7 | `vo_char_1110_00_18_hca.hca` | 14.30s | 14.46s | +0.16s |
| `111000` | Momoko Togame | `group_12` | 3 | `vo_char_1110_00_19_hca.hca` | 3.80s | 3.96s | +0.16s |
| `111200` | Karin & Alina | `group_19` | 6 | `vo_char_1112_00_26_hca.hca` | 11.75s | 11.59s | -0.16s |
| `113300` | Rabi Himuro | `group_9` | 4 | `vo_char_1133_00_16_hca.hca` | 19.00s | 18.84s | -0.16s |
| `120100` | Iroha-chan | `group_10` | 4 | `vo_char_1201_00_17_hca.hca` | 10.10s | 9.94s | -0.16s |
| `200600` | Kyoko Sakura | `group_8` | 7 | `vo_char_2006_00_16_hca.hca` | 11.00s | 10.84s | -0.16s |
| `200602` | Kyoko Sakura | `group_8` | 6 | `vo_char_2006_00_16_hca.hca` | 11.00s | 10.84s | -0.16s |
| `200650` | Kyoko Sakura | `group_8` | 5 | `vo_char_2006_00_16_hca.hca` | 11.00s | 10.84s | -0.16s |
| `200651` | Kyoko Sakura | `group_17` | 8 | `vo_char_2006_51_25_hca.hca` | 21.90s | 21.74s | -0.16s |
| `200651` | Kyoko Sakura | `group_27` | 5 | `vo_char_2006_51_35_hca.hca` | 8.90s | 9.06s | +0.16s |
| `200651` | Kyoko Sakura | `group_8` | 4 | `vo_char_2006_00_16_hca.hca` | 11.00s | 10.84s | -0.16s |
| `200653` | Kyoko Sakura | `group_8` | 4 | `vo_char_2006_00_16_hca.hca` | 11.00s | 10.84s | -0.16s |
| `220200` | Devil Homura | `group_28` | 4 | `vo_char_2202_00_35_hca.hca` | 14.20s | 14.04s | -0.16s |
| `240000` | Sayaka Miki | `group_28` | 6 | `vo_char_2400_00_35_hca.hca` | 14.00s | 13.84s | -0.16s |
| `250000` | Holy Mami | `group_39` | 2 | `vo_char_2500_00_63_hca.hca` | 3.00s | 2.84s | -0.16s |
| `250001` | Holy Mami | `group_39` | 2 | `vo_char_2500_00_63_hca.hca` | 3.00s | 2.84s | -0.16s |
| `300400` | Sasara Minagi | `group_14` | 9 | `vo_char_3004_00_22_hca.hca` | 16.50s | 16.66s | +0.16s |
| `300600` | Emiri Kisaki | `group_3` | 3 | `vo_char_3006_00_04_hca.hca` | 5.50s | 5.34s | -0.16s |
| `300800` | Akira Shinobu | `group_39` | 5 | `vo_char_3008_00_63_hca.hca` | 3.50s | 3.34s | -0.16s |
| `300850` | Akira Shinobu | `group_39` | 2 | `vo_char_3008_00_63_hca.hca` | 3.50s | 3.34s | -0.16s |
| `300900` | Manaka Kurumi | `group_39` | 4 | `vo_char_3009_00_63_hca.hca` | 4.00s | 3.84s | -0.16s |
| `301100` | Kako Natsume | `group_10` | 5 | `vo_char_3011_00_18_hca.hca` | 14.00s | 13.84s | -0.16s |
| `301100` | Kako Natsume | `group_31` | 6 | `vo_char_3011_00_39_hca.hca` | 12.50s | 12.34s | -0.16s |
| `301150` | Kako Natsume | `group_10` | 3 | `vo_char_3011_00_18_hca.hca` | 14.00s | 13.84s | -0.16s |
| `301151` | Kako Natsume | `group_10` | 3 | `vo_char_3011_00_18_hca.hca` | 14.00s | 13.84s | -0.16s |
| `301151` | Kako Natsume | `group_19` | 5 | `vo_char_3011_51_27_hca.hca` | 14.00s | 13.84s | -0.16s |
| `301400` | Seika Kumi | `group_15` | 7 | `vo_char_3014_00_23_hca.hca` | 18.10s | 17.94s | -0.16s |
| `301500` | Mito Aino | `group_27` | 6 | `vo_char_3015_00_35_hca.hca` | 16.80s | 16.96s | +0.16s |
| `301600` | Kokoro Awane | `group_9` | 6 | `vo_char_3016_00_17_hca.hca` | 12.00s | 11.84s | -0.16s |
| `301650` | Kokoro Awane | `group_9` | 5 | `vo_char_3016_00_17_hca.hca` | 12.00s | 11.84s | -0.16s |
| `301800` | Hanna Sarasa | `group_19` | 8 | `vo_char_3018_00_26_hca.hca` | 11.80s | 11.64s | -0.16s |
| `302300` | Aimi Eri | `group_1` | 10 | `vo_char_3023_00_01_hca.hca` | 24.80s | 24.96s | +0.16s |
| `302700` | Hazuki Yusa | `group_4` | 4 | `vo_char_3027_00_05_hca.hca` | 6.00s | 5.84s | -0.16s |
| `303100` | Rika Ayano | `group_1` | 14 | `vo_char_3031_00_01_hca.hca` | 19.00s | 18.84s | -0.16s |
| `350400` | Masara & Kokoro | `group_33` | 7 | `vo_char_3504_00_40_hca.hca` | 18.00s | 17.84s | -0.16s |
| `390201` | Shi | `group_20` | 6 | `vo_char_3902_01_27_hca.hca` | 18.90s | 18.74s | -0.16s |
| `400200` | Kirika Kure | `group_36` | 3 | `vo_char_4002_00_44_hca.hca` | 1.50s | 1.34s | -0.16s |
| `400300` | Yuma Chitose | `group_10` | 7 | `vo_char_4003_00_18_hca.hca` | 11.00s | 10.84s | -0.16s |
| `400300` | Yuma Chitose | `group_40` | 4 | `vo_char_4003_00_64_hca.hca` | 4.00s | 4.16s | +0.16s |
| `400400` | Oriko Mikuni | `group_34` | 6 | `vo_char_4004_00_41_hca.hca` | 12.50s | 12.34s | -0.16s |
| `401100` | Kazumi | `group_31` | 5 | `vo_char_4011_00_39_hca.hca` | 12.00s | 11.84s | -0.16s |
| `402100` | Tart | `group_14` | 7 | `vo_char_4021_00_22_hca.hca` | 21.70s | 21.86s | +0.16s |
| `402500` | Corbeau | `group_11` | 7 | `vo_char_4025_00_18_hca.hca` | 18.70s | 18.54s | -0.16s |
| `402500` | Corbeau | `group_33` | 4 | `vo_char_4025_00_40_hca.hca` | 17.00s | 16.84s | -0.16s |
| `402600` | Elisa | `group_17` | 5 | `vo_char_4026_00_24_hca.hca` | 11.10s | 10.94s | -0.16s |
| `403200` | Matsuri Hinata | `group_23` | 3 | `vo_char_4032_00_30_hca.hca` | 10.00s | 10.16s | +0.16s |
| `404300` | Suruga Kanbaru | `group_32` | 2 | `vo_char_4043_00_39_hca.hca` | 10.70s | 10.54s | -0.16s |
| `404600` | Shinobu Oshino | `group_23` | 4 | `vo_char_4046_00_30_hca.hca` | 9.80s | 9.64s | -0.16s |
| `100100` | Iroha Tamaki | `group_30` | 6 | `vo_char_1001_00_38_hca.hca` | 15.50s | 15.33s | -0.17s |
| `100251` | Yachiyo Nanami | `group_16` | 6 | `vo_char_1002_51_24_hca.hca` | 13.50s | 13.33s | -0.17s |
| `101000` | Momoko Togame | `group_38` | 4 | `vo_char_1010_00_46_hca.hca` | 3.00s | 2.83s | -0.17s |
| `101000` | Momoko Togame | `group_40` | 4 | `vo_char_1010_00_64_hca.hca` | 4.00s | 3.83s | -0.17s |
| `101000` | Momoko Togame | `group_8` | 5 | `vo_char_1010_00_16_hca.hca` | 12.50s | 12.33s | -0.17s |
| `101000` | Momoko Togame | `group_9` | 6 | `vo_char_1010_00_17_hca.hca` | 13.00s | 12.83s | -0.17s |
| `101051` | Momoko Togame | `group_38` | 3 | `vo_char_1010_00_46_hca.hca` | 3.00s | 2.83s | -0.17s |
| `101051` | Momoko Togame | `group_40` | 3 | `vo_char_1010_00_64_hca.hca` | 4.00s | 3.83s | -0.17s |
| `101051` | Momoko Togame | `group_8` | 4 | `vo_char_1010_00_16_hca.hca` | 12.50s | 12.33s | -0.17s |
| `101051` | Momoko Togame | `group_9` | 5 | `vo_char_1010_00_17_hca.hca` | 13.00s | 12.83s | -0.17s |
| `101100` | Kaede Akino | `group_28` | 5 | `vo_char_1011_00_36_hca.hca` | 13.00s | 12.83s | -0.17s |
| `101100` | Kaede Akino | `group_3` | 4 | `vo_char_1011_00_04_hca.hca` | 6.00s | 5.83s | -0.17s |
| `101100` | Kaede Akino | `group_36` | 4 | `vo_char_1011_00_44_hca.hca` | 3.00s | 2.83s | -0.17s |
| `101150` | Kaede Akino | `group_3` | 3 | `vo_char_1011_00_04_hca.hca` | 6.00s | 5.83s | -0.17s |
| `101150` | Kaede Akino | `group_36` | 3 | `vo_char_1011_00_44_hca.hca` | 3.00s | 2.83s | -0.17s |
| `101152` | Kaede Akino | `group_3` | 2 | `vo_char_1011_00_04_hca.hca` | 6.00s | 5.83s | -0.17s |
| `101152` | Kaede Akino | `group_36` | 2 | `vo_char_1011_00_44_hca.hca` | 3.00s | 2.83s | -0.17s |
| `101200` | Karin Misono | `group_23` | 5 | `vo_char_1012_00_31_hca.hca` | 11.00s | 10.83s | -0.17s |
| `101700` | Mitama Yakumo | `group_57` | 4 | `vo_game_0902_08_hca.hca` | 12.20s | 12.03s | -0.17s |
| `101751` | Mitama Yakumo | `group_50` | 5 | `vo_game_0802_10_hca.hca` | 12.10s | 11.93s | -0.17s |
| `101800` | Tsukuyo Amane | `group_1` | 9 | `vo_char_1018_00_01_hca.hca` | 30.90s | 30.73s | -0.17s |
| `101800` | Tsukuyo Amane | `group_4` | 4 | `vo_char_1018_00_05_hca.hca` | 7.00s | 6.83s | -0.17s |
| `101850` | Tsukuyo Amane | `group_1` | 8 | `vo_char_1018_00_01_hca.hca` | 30.90s | 30.73s | -0.17s |
| `101850` | Tsukuyo Amane | `group_23` | 5 | `vo_char_1018_50_31_hca.hca` | 15.00s | 14.83s | -0.17s |
| `101850` | Tsukuyo Amane | `group_4` | 3 | `vo_char_1018_00_05_hca.hca` | 7.00s | 6.83s | -0.17s |
| `102350` | Ao Kasane | `group_21` | 5 | `vo_char_1023_50_28_hca.hca` | 13.60s | 13.77s | +0.17s |
| `102800` | Himena Aika | `group_10` | 5 | `vo_char_1028_00_17_hca.hca` | 12.00s | 11.83s | -0.17s |
| `102850` | Himena Aika | `group_10` | 4 | `vo_char_1028_00_17_hca.hca` | 12.00s | 11.83s | -0.17s |
| `102950` | Shigure Miyabi | `group_26` | 4 | `vo_char_1029_50_33_hca.hca` | 15.00s | 14.83s | -0.17s |
| `103550` | Alexandra Kurusu | `group_17` | 6 | `vo_char_1035_50_24_hca.hca` | 13.10s | 13.27s | +0.17s |
| `103550` | Alexandra Kurusu | `group_27` | 5 | `vo_char_1035_50_34_hca.hca` | 14.30s | 14.13s | -0.17s |
| `103600` | Urara Yume | `group_16` | 7 | `vo_char_1036_00_23_hca.hca` | 18.30s | 18.13s | -0.17s |
| `104000` | Yozuru Sasame | `group_17` | 6 | `vo_char_1040_00_24_hca.hca` | 10.30s | 10.13s | -0.17s |
| `104100` | Livia Medeiros | `group_33` | 6 | `vo_char_1041_00_40_hca.hca` | 12.50s | 12.67s | +0.17s |
| `104300` | Kuroe | `group_7` | 5 | `vo_char_1043_00_14_hca.hca` | 6.50s | 6.33s | -0.17s |
| `104400` | Mikoto Sena | `group_18` | 5 | `vo_char_1044_00_25_hca.hca` | 11.10s | 10.93s | -0.17s |
| `104600` | Chizuru | `group_37` | 2 | `vo_char_1046_00_44_hca.hca` | 3.00s | 2.83s | -0.17s |
| `104700` | Kuro | `group_27` | 3 | `vo_char_1047_00_34_hca.hca` | 10.40s | 10.23s | -0.17s |
| `110800` | Holy Alina | `group_12` | 4 | `vo_char_1108_00_19_hca.hca` | 8.50s | 8.33s | -0.17s |
| `111200` | Karin & Alina | `group_30` | 5 | `vo_char_1112_00_37_hca.hca` | 16.90s | 16.73s | -0.17s |
| `111600` | Kanagi Izumi | `group_10` | 7 | `vo_char_1116_00_17_hca.hca` | 16.40s | 16.23s | -0.17s |
| `111800` | Amane Sisters | `group_27` | 5 | `vo_char_1118_00_34_hca.hca` | 15.90s | 15.73s | -0.17s |
| `113300` | Rabi Himuro | `group_19` | 4 | `vo_char_1133_00_26_hca.hca` | 10.90s | 10.73s | -0.17s |
| `114400` | Uwasa Mikoto | `group_17` | 4 | `vo_char_1144_00_24_hca.hca` | 12.60s | 12.43s | -0.17s |
| `120900` | Rena & Kaede | `group_15` | 9 | `vo_char_1209_00_22_hca.hca` | 20.70s | 20.87s | +0.17s |
| `120901` | Rena & Kaede | `group_15` | 8 | `vo_char_1209_00_22_hca.hca` | 20.70s | 20.87s | +0.17s |
| `120902` | Rena & Kaede | `group_15` | 8 | `vo_char_1209_00_22_hca.hca` | 20.70s | 20.87s | +0.17s |
| `130100` | Iroha & Yachiyo | `group_25` | 3 | `vo_char_1301_00_32_hca.hca` | 10.50s | 10.33s | -0.17s |
| `200600` | Kyoko Sakura | `group_37` | 5 | `vo_char_2006_00_45_hca.hca` | 3.00s | 2.83s | -0.17s |
| `200602` | Kyoko Sakura | `group_37` | 4 | `vo_char_2006_00_45_hca.hca` | 3.00s | 2.83s | -0.17s |
| `200650` | Kyoko Sakura | `group_37` | 3 | `vo_char_2006_00_45_hca.hca` | 3.00s | 2.83s | -0.17s |
| `200651` | Kyoko Sakura | `group_37` | 2 | `vo_char_2006_00_45_hca.hca` | 3.00s | 2.83s | -0.17s |
| `200653` | Kyoko Sakura | `group_37` | 2 | `vo_char_2006_00_45_hca.hca` | 3.00s | 2.83s | -0.17s |
| `210100` | Ultimate Madoka | `group_19` | 6 | `vo_char_2101_00_27_hca.hca` | 14.00s | 13.83s | -0.17s |
| `260000` | Kyoko Sakura | `group_42` | 3 | `vo_char_2600_00_65_hca.hca` | 4.00s | 3.83s | -0.17s |
| `300300` | Hinano Miyako | `group_8` | 7 | `vo_char_3003_00_16_hca.hca` | 9.00s | 8.83s | -0.17s |
| `300351` | Hinano Miyako | `group_8` | 6 | `vo_char_3003_00_16_hca.hca` | 9.00s | 8.83s | -0.17s |
| `300400` | Sasara Minagi | `group_27` | 9 | `vo_char_3004_00_35_hca.hca` | 14.50s | 14.67s | +0.17s |
| `300800` | Akira Shinobu | `group_15` | 12 | `vo_char_3008_00_23_hca.hca` | 19.00s | 19.17s | +0.17s |
| `300800` | Akira Shinobu | `group_35` | 5 | `vo_char_3008_00_43_hca.hca` | 2.50s | 2.33s | -0.17s |
| `300850` | Akira Shinobu | `group_15` | 9 | `vo_char_3008_00_23_hca.hca` | 19.00s | 19.17s | +0.17s |
| `300850` | Akira Shinobu | `group_35` | 2 | `vo_char_3008_00_43_hca.hca` | 2.50s | 2.33s | -0.17s |
| `300900` | Manaka Kurumi | `group_26` | 6 | `vo_char_3009_00_34_hca.hca` | 10.00s | 10.17s | +0.17s |
| `300900` | Manaka Kurumi | `group_34` | 3 | `vo_char_3009_00_42_hca.hca` | 2.50s | 2.33s | -0.17s |
| `301100` | Kako Natsume | `group_5` | 6 | `vo_char_3011_00_13_hca.hca` | 6.00s | 5.83s | -0.17s |
| `301150` | Kako Natsume | `group_5` | 4 | `vo_char_3011_00_13_hca.hca` | 6.00s | 5.83s | -0.17s |
| `301151` | Kako Natsume | `group_5` | 4 | `vo_char_3011_00_13_hca.hca` | 6.00s | 5.83s | -0.17s |
| `301400` | Seika Kumi | `group_39` | 3 | `vo_char_3014_00_63_hca.hca` | 3.00s | 2.83s | -0.17s |
| `301650` | Kokoro Awane | `group_30` | 4 | `vo_char_3016_50_38_hca.hca` | 13.00s | 12.83s | -0.17s |
| `302600` | Konoha Shizumi | `group_41` | 4 | `vo_char_3026_00_65_hca.hca` | 3.00s | 2.83s | -0.17s |
| `302700` | Hazuki Yusa | `group_37` | 4 | `vo_char_3027_00_45_hca.hca` | 4.00s | 3.83s | -0.17s |
| `302700` | Hazuki Yusa | `group_39` | 4 | `vo_char_3027_00_63_hca.hca` | 5.00s | 4.83s | -0.17s |
| `302900` | Masara Kagami | `group_30` | 4 | `vo_char_3029_00_38_hca.hca` | 14.20s | 14.37s | +0.17s |
| `303000` | Konomi Haruna | `group_13` | 7 | `vo_char_3030_00_21_hca.hca` | 11.50s | 11.67s | +0.17s |
| `303000` | Konomi Haruna | `group_34` | 4 | `vo_char_3030_00_42_hca.hca` | 2.50s | 2.67s | +0.17s |
| `303000` | Konomi Haruna | `group_8` | 7 | `vo_char_3030_00_16_hca.hca` | 9.50s | 9.67s | +0.17s |
| `303051` | Konomi Haruna | `group_13` | 5 | `vo_char_3030_00_21_hca.hca` | 11.50s | 11.67s | +0.17s |
| `303051` | Konomi Haruna | `group_34` | 2 | `vo_char_3030_00_42_hca.hca` | 2.50s | 2.67s | +0.17s |
| `303051` | Konomi Haruna | `group_8` | 5 | `vo_char_3030_00_16_hca.hca` | 9.50s | 9.67s | +0.17s |
| `303100` | Rika Ayano | `group_24` | 8 | `vo_char_3031_00_32_hca.hca` | 9.50s | 9.33s | -0.17s |
| `303100` | Rika Ayano | `group_27` | 7 | `vo_char_3031_00_35_hca.hca` | 8.50s | 8.67s | +0.17s |
| `303400` | Moka Megumi | `group_17` | 6 | `vo_char_3034_00_24_hca.hca` | 14.00s | 13.83s | -0.17s |
| `304700` | Chika Aoba | `group_1` | 9 | `vo_char_3047_00_01_hca.hca` | 26.00s | 25.83s | -0.17s |
| `304750` | Chika Aoba | `group_30` | 4 | `vo_char_3047_50_38_hca.hca` | 11.00s | 11.17s | +0.17s |
| `305850` | Ryoko Natsu | `group_33` | 7 | `vo_char_3058_50_41_hca.hca` | 10.50s | 10.67s | +0.17s |
| `350100` | Rika & Ren | `group_39` | 2 | `vo_char_3501_00_46_hca.hca` | 5.00s | 4.83s | -0.17s |
| `400100` | Oriko Mikuni | `group_16` | 6 | `vo_char_4001_00_24_hca.hca` | 11.50s | 11.33s | -0.17s |
| `400100` | Oriko Mikuni | `group_17` | 5 | `vo_char_4001_00_25_hca.hca` | 16.00s | 15.83s | -0.17s |
| `400200` | Kirika Kure | `group_32` | 6 | `vo_char_4002_00_40_hca.hca` | 11.50s | 11.33s | -0.17s |
| `400300` | Yuma Chitose | `group_30` | 6 | `vo_char_4003_00_38_hca.hca` | 9.00s | 9.17s | +0.17s |
| `400300` | Yuma Chitose | `group_36` | 4 | `vo_char_4003_00_44_hca.hca` | 2.00s | 1.83s | -0.17s |
| `401300` | Kaoru Maki | `group_26` | 7 | `vo_char_4013_00_34_hca.hca` | 11.60s | 11.77s | +0.17s |
| `402200` | Riz | `group_23` | 5 | `vo_char_4022_00_31_hca.hca` | 14.00s | 13.83s | -0.17s |
| `402300` | Melissa | `group_43` | 6 | `vo_char_4023_00_02_hca.hca` | 10.30s | 10.13s | -0.17s |
| `402350` | Melissa | `group_43` | 4 | `vo_char_4023_00_02_hca.hca` | 10.30s | 10.13s | -0.17s |
| `402650` | Elisa | `group_22` | 4 | `vo_char_4026_50_29_hca.hca` | 12.00s | 11.83s | -0.17s |
| `404100` | Hitagi Senjougahara | `group_22` | 2 | `vo_char_4041_00_30_hca.hca` | 9.35s | 9.18s | -0.17s |
| `404200` | Mayoi Hachikuji | `group_33` | 3 | `vo_char_4042_00_40_hca.hca` | 14.20s | 14.37s | +0.17s |
| `404500` | Tsubasa Hanekawa | `group_11` | 3 | `vo_char_4045_00_18_hca.hca` | 11.45s | 11.28s | -0.17s |
| `404500` | Tsubasa Hanekawa | `group_9` | 2 | `vo_char_4045_00_16_hca.hca` | 8.80s | 8.63s | -0.17s |
| `405300` | Hayate Yagami | `group_16` | 6 | `vo_char_4053_00_23_hca.hca` | 13.00s | 13.17s | +0.17s |
| `412103` | Isabeau | `group_28` | 4 | `vo_char_4121_03_35_hca.hca` | 15.00s | 14.83s | -0.17s |
| `100900` | Rena Minami | `group_10` | 7 | `vo_char_1009_00_18_hca.hca` | 9.50s | 9.32s | -0.18s |
| `100950` | Rena Minami | `group_10` | 6 | `vo_char_1009_00_18_hca.hca` | 9.50s | 9.32s | -0.18s |
| `100951` | Rena Minami | `group_10` | 6 | `vo_char_1009_00_18_hca.hca` | 9.50s | 9.32s | -0.18s |
| `101051` | Momoko Togame | `group_19` | 7 | `vo_char_1010_51_27_hca.hca` | 13.70s | 13.52s | -0.18s |
| `101100` | Kaede Akino | `group_10` | 6 | `vo_char_1011_00_18_hca.hca` | 12.00s | 11.82s | -0.18s |
| `101150` | Kaede Akino | `group_10` | 5 | `vo_char_1011_00_18_hca.hca` | 12.00s | 11.82s | -0.18s |
| `101152` | Kaede Akino | `group_10` | 4 | `vo_char_1011_00_18_hca.hca` | 12.00s | 11.82s | -0.18s |
| `101300` | Asuka Tatsuki | `group_33` | 11 | `vo_char_1013_00_41_hca.hca` | 13.00s | 12.82s | -0.18s |
| `101450` | Nemu Hiiragi | `group_23` | 5 | `vo_char_1014_50_30_hca.hca` | 17.00s | 16.82s | -0.18s |
| `101701` | Mitama Yakumo | `group_47` | 3 | `vo_game_0202_04_hca.hca` | 7.50s | 7.68s | +0.18s |
| `101750` | Mitama Yakumo | `group_49` | 4 | `vo_game_1002_09_hca.hca` | 9.30s | 9.12s | -0.18s |
| `101800` | Tsukuyo Amane | `group_29` | 4 | `vo_char_1018_00_37_hca.hca` | 14.00s | 13.82s | -0.18s |
| `102200` | Hikaru Kirari | `group_18` | 4 | `vo_char_1022_00_25_hca.hca` | 10.50s | 10.68s | +0.18s |
| `102200` | Hikaru Kirari | `group_27` | 5 | `vo_char_1022_00_34_hca.hca` | 9.00s | 9.18s | +0.18s |
| `102200` | Hikaru Kirari | `group_34` | 5 | `vo_char_1022_00_41_hca.hca` | 10.20s | 10.38s | +0.18s |
| `102600` | Chiharu Hiroe | `group_39` | 2 | `vo_char_1026_00_46_hca.hca` | 3.00s | 2.82s | -0.18s |
| `103200` | Miyuri Yukari | `group_28` | 5 | `vo_char_1032_00_35_hca.hca` | 13.70s | 13.52s | -0.18s |
| `103200` | Miyuri Yukari | `group_32` | 4 | `vo_char_1032_00_39_hca.hca` | 12.30s | 12.12s | -0.18s |
| `111200` | Karin & Alina | `group_1` | 13 | `vo_char_1112_00_01_hca.hca` | 29.71s | 29.89s | +0.18s |
| `111200` | Karin & Alina | `group_17` | 5 | `vo_char_1112_00_24_hca.hca` | 14.50s | 14.32s | -0.18s |
| `111201` | Karin & Alina | `group_1` | 12 | `vo_char_1112_00_01_hca.hca` | 29.71s | 29.89s | +0.18s |
| `111202` | Karin & Alina | `group_1` | 12 | `vo_char_1112_00_01_hca.hca` | 29.71s | 29.89s | +0.18s |
| `111600` | Kanagi Izumi | `group_22` | 6 | `vo_char_1116_00_29_hca.hca` | 16.40s | 16.22s | -0.18s |
| `111700` | Mitama Yakumo | `group_10` | 6 | `vo_char_1117_00_17_hca.hca` | 13.70s | 13.52s | -0.18s |
| `111700` | Mitama Yakumo | `group_47` | 4 | `vo_game_0102_04_hca.hca` | 8.00s | 7.82s | -0.18s |
| `111700` | Mitama Yakumo | `group_48` | 6 | `vo_game_0102_08_hca.hca` | 9.30s | 9.48s | +0.18s |
| `120100` | Iroha-chan | `group_2` | 3 | `vo_char_1201_00_02_hca.hca` | 9.80s | 9.62s | -0.18s |
| `120900` | Rena & Kaede | `group_33` | 5 | `vo_char_1209_00_40_hca.hca` | 13.10s | 12.92s | -0.18s |
| `180100` | Iroha & Kuroe | `group_26` | 6 | `vo_char_1801_00_33_hca.hca` | 12.30s | 12.12s | -0.18s |
| `200400` | Sayaka Miki | `group_19` | 7 | `vo_char_2004_00_27_hca.hca` | 11.00s | 10.82s | -0.18s |
| `200400` | Sayaka Miki | `group_7` | 6 | `vo_char_2004_00_15_hca.hca` | 5.50s | 5.32s | -0.18s |
| `200451` | Sayaka Miki | `group_7` | 4 | `vo_char_2004_00_15_hca.hca` | 5.50s | 5.32s | -0.18s |
| `200651` | Kyoko Sakura | `group_30` | 6 | `vo_char_2006_51_38_hca.hca` | 12.10s | 12.28s | +0.18s |
| `230000` | Homura Akemi | `group_25` | 8 | `vo_char_2300_00_33_hca.hca` | 15.80s | 15.62s | -0.18s |
| `230000` | Homura Akemi | `group_26` | 9 | `vo_char_2300_00_34_hca.hca` | 17.70s | 17.52s | -0.18s |
| `300300` | Hinano Miyako | `group_13` | 7 | `vo_char_3003_00_21_hca.hca` | 9.50s | 9.32s | -0.18s |
| `300300` | Hinano Miyako | `group_38` | 3 | `vo_char_3003_00_46_hca.hca` | 2.00s | 2.18s | +0.18s |
| `300351` | Hinano Miyako | `group_13` | 6 | `vo_char_3003_00_21_hca.hca` | 9.50s | 9.32s | -0.18s |
| `300351` | Hinano Miyako | `group_38` | 2 | `vo_char_3003_00_46_hca.hca` | 2.00s | 2.18s | +0.18s |
| `300400` | Sasara Minagi | `group_42` | 4 | `vo_char_3004_00_66_hca.hca` | 3.50s | 3.32s | -0.18s |
| `300500` | Nanaka Tokiwa | `group_13` | 6 | `vo_char_3005_00_21_hca.hca` | 15.00s | 14.82s | -0.18s |
| `300500` | Nanaka Tokiwa | `group_8` | 7 | `vo_char_3005_00_16_hca.hca` | 14.50s | 14.32s | -0.18s |
| `300600` | Emiri Kisaki | `group_24` | 6 | `vo_char_3006_00_32_hca.hca` | 8.00s | 7.82s | -0.18s |
| `300750` | Shizuku Hozumi | `group_17` | 3 | `vo_char_3007_50_25_hca.hca` | 13.10s | 12.92s | -0.18s |
| `300900` | Manaka Kurumi | `group_42` | 5 | `vo_char_3009_00_66_hca.hca` | 4.00s | 4.18s | +0.18s |
| `301100` | Kako Natsume | `group_13` | 7 | `vo_char_3011_00_21_hca.hca` | 12.00s | 12.18s | +0.18s |
| `301150` | Kako Natsume | `group_13` | 5 | `vo_char_3011_00_21_hca.hca` | 12.00s | 12.18s | +0.18s |
| `301151` | Kako Natsume | `group_13` | 5 | `vo_char_3011_00_21_hca.hca` | 12.00s | 12.18s | +0.18s |
| `301900` | Ayaka Mariko | `group_38` | 4 | `vo_char_3019_00_46_hca.hca` | 3.50s | 3.68s | +0.18s |
| `301950` | Ayaka Mariko | `group_38` | 2 | `vo_char_3019_00_46_hca.hca` | 3.50s | 3.68s | +0.18s |
| `302100` | Sakuya Suzuka | `group_9` | 3 | `vo_char_3021_00_16_hca.hca` | 9.50s | 9.32s | -0.18s |
| `302600` | Konoha Shizumi | `group_12` | 4 | `vo_char_3026_00_20_hca.hca` | 6.00s | 5.82s | -0.18s |
| `302600` | Konoha Shizumi | `group_5` | 4 | `vo_char_3026_00_13_hca.hca` | 5.00s | 4.82s | -0.18s |
| `302900` | Masara Kagami | `group_25` | 4 | `vo_char_3029_00_33_hca.hca` | 13.00s | 13.18s | +0.18s |
| `302900` | Masara Kagami | `group_5` | 3 | `vo_char_3029_00_13_hca.hca` | 6.00s | 6.18s | +0.18s |
| `302950` | Masara Kagami | `group_5` | 3 | `vo_char_3029_00_13_hca.hca` | 6.00s | 6.18s | +0.18s |
| `303000` | Konomi Haruna | `group_1` | 12 | `vo_char_3030_00_01_hca.hca` | 23.50s | 23.68s | +0.18s |
| `303000` | Konomi Haruna | `group_14` | 10 | `vo_char_3030_00_22_hca.hca` | 14.50s | 14.68s | +0.18s |
| `303000` | Konomi Haruna | `group_16` | 8 | `vo_char_3030_00_24_hca.hca` | 9.00s | 9.18s | +0.18s |
| `303051` | Konomi Haruna | `group_1` | 10 | `vo_char_3030_00_01_hca.hca` | 23.50s | 23.68s | +0.18s |
| `303051` | Konomi Haruna | `group_14` | 8 | `vo_char_3030_00_22_hca.hca` | 14.50s | 14.68s | +0.18s |
| `303100` | Rika Ayano | `group_14` | 8 | `vo_char_3031_00_22_hca.hca` | 14.00s | 13.82s | -0.18s |
| `303300` | Sayuki Fumino | `group_14` | 6 | `vo_char_3033_00_21_hca.hca` | 14.00s | 14.18s | +0.18s |
| `303350` | Sayuki Fumino | `group_14` | 5 | `vo_char_3033_00_21_hca.hca` | 14.00s | 14.18s | +0.18s |
| `303400` | Moka Megumi | `group_9` | 5 | `vo_char_3034_00_16_hca.hca` | 13.00s | 12.82s | -0.18s |
| `303551` | Riko Chiaki | `group_26` | 5 | `vo_char_3035_51_34_hca.hca` | 10.10s | 10.28s | +0.18s |
| `304300` | Eternal Sakura | `group_33` | 6 | `vo_char_3043_00_40_hca.hca` | 16.00s | 15.82s | -0.18s |
| `304600` | Ryo Midori | `group_27` | 5 | `vo_char_3046_00_34_hca.hca` | 9.80s | 9.62s | -0.18s |
| `304900` | Kanae Yukino | `group_15` | 7 | `vo_char_3049_00_23_hca.hca` | 22.30s | 22.12s | -0.18s |
| `304900` | Kanae Yukino | `group_31` | 3 | `vo_char_3049_00_39_hca.hca` | 11.00s | 11.18s | +0.18s |
| `304950` | Kanae Yukino | `group_15` | 6 | `vo_char_3049_00_23_hca.hca` | 22.30s | 22.12s | -0.18s |
| `304950` | Kanae Yukino | `group_19` | 5 | `vo_char_3049_50_27_hca.hca` | 11.80s | 11.62s | -0.18s |
| `305000` | Yuuna Kaharu | `group_1` | 9 | `vo_char_3050_00_01_hca.hca` | 22.55s | 22.73s | +0.18s |
| `305100` | Jun Kazari | `group_24` | 5 | `vo_char_3051_00_31_hca.hca` | 13.00s | 12.82s | -0.18s |
| `305850` | Ryoko Natsu | `group_24` | 6 | `vo_char_3058_50_32_hca.hca` | 11.10s | 11.28s | +0.18s |
| `350400` | Masara & Kokoro | `group_1` | 11 | `vo_char_3504_00_01_hca.hca` | 32.00s | 31.82s | -0.18s |
| `350401` | Masara & Kokoro | `group_1` | 10 | `vo_char_3504_00_01_hca.hca` | 32.00s | 31.82s | -0.18s |
| `350402` | Masara & Kokoro | `group_1` | 10 | `vo_char_3504_00_01_hca.hca` | 32.00s | 31.82s | -0.18s |
| `390200` | Shi | `group_22` | 7 | `vo_char_3902_00_29_hca.hca` | 15.20s | 15.02s | -0.18s |
| `400100` | Oriko Mikuni | `group_10` | 6 | `vo_char_4001_00_18_hca.hca` | 14.00s | 13.82s | -0.18s |
| `400300` | Yuma Chitose | `group_24` | 5 | `vo_char_4003_00_32_hca.hca` | 9.00s | 9.18s | +0.18s |
| `402700` | Lapin | `group_1` | 11 | `vo_char_4027_00_01_hca.hca` | 24.30s | 24.12s | -0.18s |
| `402700` | Lapin | `group_14` | 3 | `vo_char_4027_00_21_hca.hca` | 9.00s | 8.82s | -0.18s |
| `404500` | Tsubasa Hanekawa | `group_18` | 2 | `vo_char_4045_00_25_hca.hca` | 10.00s | 9.82s | -0.18s |
| `405200` | Fate | `group_24` | 5 | `vo_char_4052_00_31_hca.hca` | 8.80s | 8.62s | -0.18s |
| `100550` | Felicia Mitsuki | `group_17` | 5 | `vo_char_1005_50_25_hca.hca` | 9.70s | 9.51s | -0.19s |
| `100550` | Felicia Mitsuki | `group_29` | 8 | `vo_char_1005_50_37_hca.hca` | 15.00s | 14.81s | -0.19s |
| `100552` | Felicia Mitsuki | `group_27` | 8 | `vo_char_1005_52_35_hca.hca` | 11.00s | 10.81s | -0.19s |
| `100900` | Rena Minami | `group_4` | 4 | `vo_char_1009_00_05_hca.hca` | 4.50s | 4.31s | -0.19s |
| `100950` | Rena Minami | `group_19` | 4 | `vo_char_1009_50_27_hca.hca` | 14.00s | 13.81s | -0.19s |
| `100950` | Rena Minami | `group_33` | 5 | `vo_char_1009_50_41_hca.hca` | 12.00s | 11.81s | -0.19s |
| `100950` | Rena Minami | `group_4` | 3 | `vo_char_1009_00_05_hca.hca` | 4.50s | 4.31s | -0.19s |
| `100951` | Rena Minami | `group_4` | 3 | `vo_char_1009_00_05_hca.hca` | 4.50s | 4.31s | -0.19s |
| `101100` | Kaede Akino | `group_33` | 9 | `vo_char_1011_00_41_hca.hca` | 15.00s | 14.81s | -0.19s |
| `101300` | Asuka Tatsuki | `group_1` | 7 | `vo_char_1013_00_01_hca.hca` | 22.00s | 21.81s | -0.19s |
| `101600` | Kanagi Izumi | `group_41` | 5 | `vo_char_1016_00_65_hca.hca` | 5.20s | 5.01s | -0.19s |
| `101651` | Kanagi Izumi | `group_41` | 5 | `vo_char_1016_00_65_hca.hca` | 5.20s | 5.01s | -0.19s |
| `102250` | Hikaru Kirari | `group_34` | 6 | `vo_char_1022_50_41_hca.hca` | 13.30s | 13.49s | +0.19s |
| `102600` | Chiharu Hiroe | `group_11` | 5 | `vo_char_1026_00_18_hca.hca` | 13.00s | 12.81s | -0.19s |
| `102650` | Chiharu Hiroe | `group_11` | 4 | `vo_char_1026_00_18_hca.hca` | 13.00s | 12.81s | -0.19s |
| `102651` | Chiharu Hiroe | `group_11` | 4 | `vo_char_1026_00_18_hca.hca` | 13.00s | 12.81s | -0.19s |
| `103300` | Rabi Himuro | `group_39` | 4 | `vo_char_1033_00_46_hca.hca` | 3.70s | 3.51s | -0.19s |
| `103350` | Rabi Himuro | `group_39` | 3 | `vo_char_1033_00_46_hca.hca` | 3.70s | 3.51s | -0.19s |
| `103400` | Asahi Miura | `group_16` | 3 | `vo_char_1034_00_23_hca.hca` | 19.00s | 18.81s | -0.19s |
| `103550` | Alexandra Kurusu | `group_30` | 4 | `vo_char_1035_50_37_hca.hca` | 11.50s | 11.69s | +0.19s |
| `104100` | Livia Medeiros | `group_18` | 6 | `vo_char_1041_00_25_hca.hca` | 12.00s | 11.81s | -0.19s |
| `104400` | Mikoto Sena | `group_1` | 8 | `vo_char_1044_00_01_hca.hca` | 28.05s | 28.24s | +0.19s |
| `104900` | Olga | `group_23` | 5 | `vo_char_1049_00_30_hca.hca` | 13.20s | 13.01s | -0.19s |
| `105300` | Amaryllis | `group_1` | 8 | `vo_char_1053_00_01_hca.hca` | 25.30s | 25.11s | -0.19s |
| `105302` | Amaryllis | `group_1` | 7 | `vo_char_1053_00_01_hca.hca` | 25.30s | 25.11s | -0.19s |
| `110700` | Touka & Nemu | `group_19` | 5 | `vo_char_1107_00_26_hca.hca` | 14.20s | 14.01s | -0.19s |
| `110700` | Touka & Nemu | `group_22` | 4 | `vo_char_1107_00_29_hca.hca` | 15.60s | 15.41s | -0.19s |
| `110800` | Holy Alina | `group_21` | 8 | `vo_char_1108_00_28_hca.hca` | 19.20s | 19.01s | -0.19s |
| `111700` | Mitama Yakumo | `group_44` | 4 | `vo_game_0102_01_hca.hca` | 10.80s | 10.99s | +0.19s |
| `111800` | Amane Sisters | `group_15` | 7 | `vo_char_1118_00_22_hca.hca` | 18.00s | 17.81s | -0.19s |
| `111801` | Amane Sisters | `group_15` | 7 | `vo_char_1118_00_22_hca.hca` | 18.00s | 17.81s | -0.19s |
| `111802` | Amane Sisters | `group_15` | 7 | `vo_char_1118_00_22_hca.hca` | 18.00s | 17.81s | -0.19s |
| `111802` | Amane Sisters | `group_31` | 5 | `vo_char_1118_02_38_hca.hca` | 12.70s | 12.51s | -0.19s |
| `114400` | Uwasa Mikoto | `group_24` | 3 | `vo_char_1144_00_31_hca.hca` | 11.70s | 11.51s | -0.19s |
| `120100` | Iroha-chan | `group_21` | 5 | `vo_char_1201_00_28_hca.hca` | 15.10s | 14.91s | -0.19s |
| `120901` | Rena & Kaede | `group_19` | 4 | `vo_char_1209_01_26_hca.hca` | 11.20s | 11.39s | +0.19s |
| `200900` | Mabayu Aki | `group_17` | 5 | `vo_char_2009_00_24_hca.hca` | 14.40s | 14.21s | -0.19s |
| `210000` | Madoka Kaname | `group_27` | 5 | `vo_char_2100_00_35_hca.hca` | 14.10s | 13.91s | -0.19s |
| `220200` | Devil Homura | `group_14` | 4 | `vo_char_2202_00_21_hca.hca` | 12.10s | 11.91s | -0.19s |
| `250000` | Holy Mami | `group_10` | 5 | `vo_char_2500_00_18_hca.hca` | 14.00s | 13.81s | -0.19s |
| `250001` | Holy Mami | `group_10` | 5 | `vo_char_2500_00_18_hca.hca` | 14.00s | 13.81s | -0.19s |
| `260000` | Kyoko Sakura | `group_18` | 7 | `vo_char_2600_00_25_hca.hca` | 17.50s | 17.69s | +0.19s |
| `300300` | Hinano Miyako | `group_5` | 4 | `vo_char_3003_00_13_hca.hca` | 5.50s | 5.31s | -0.19s |
| `300351` | Hinano Miyako | `group_5` | 3 | `vo_char_3003_00_13_hca.hca` | 5.50s | 5.31s | -0.19s |
| `300400` | Sasara Minagi | `group_31` | 9 | `vo_char_3004_00_39_hca.hca` | 15.50s | 15.31s | -0.19s |
| `300500` | Nanaka Tokiwa | `group_12` | 4 | `vo_char_3005_00_20_hca.hca` | 6.00s | 5.81s | -0.19s |
| `300500` | Nanaka Tokiwa | `group_17` | 7 | `vo_char_3005_00_25_hca.hca` | 12.00s | 11.81s | -0.19s |
| `300500` | Nanaka Tokiwa | `group_33` | 6 | `vo_char_3005_00_41_hca.hca` | 12.50s | 12.31s | -0.19s |
| `300500` | Nanaka Tokiwa | `group_37` | 3 | `vo_char_3005_00_45_hca.hca` | 2.00s | 1.81s | -0.19s |
| `300700` | Shizuku Hozumi | `group_26` | 6 | `vo_char_3007_00_34_hca.hca` | 15.50s | 15.69s | +0.19s |
| `300750` | Shizuku Hozumi | `group_25` | 3 | `vo_char_3007_50_33_hca.hca` | 13.00s | 12.81s | -0.19s |
| `300800` | Akira Shinobu | `group_10` | 11 | `vo_char_3008_00_18_hca.hca` | 14.00s | 14.19s | +0.19s |
| `300800` | Akira Shinobu | `group_14` | 10 | `vo_char_3008_00_22_hca.hca` | 13.00s | 12.81s | -0.19s |
| `300800` | Akira Shinobu | `group_25` | 8 | `vo_char_3008_00_33_hca.hca` | 10.50s | 10.31s | -0.19s |
| `300800` | Akira Shinobu | `group_3` | 5 | `vo_char_3008_00_04_hca.hca` | 4.00s | 3.81s | -0.19s |
| `300850` | Akira Shinobu | `group_10` | 8 | `vo_char_3008_00_18_hca.hca` | 14.00s | 14.19s | +0.19s |
| `300850` | Akira Shinobu | `group_14` | 7 | `vo_char_3008_00_22_hca.hca` | 13.00s | 12.81s | -0.19s |
| `300850` | Akira Shinobu | `group_3` | 2 | `vo_char_3008_00_04_hca.hca` | 4.00s | 3.81s | -0.19s |
| `300900` | Manaka Kurumi | `group_10` | 7 | `vo_char_3009_00_18_hca.hca` | 10.50s | 10.69s | +0.19s |
| `300900` | Manaka Kurumi | `group_30` | 7 | `vo_char_3009_00_38_hca.hca` | 10.00s | 10.19s | +0.19s |
| `300900` | Manaka Kurumi | `group_9` | 5 | `vo_char_3009_00_17_hca.hca` | 10.50s | 10.31s | -0.19s |
| `301100` | Kako Natsume | `group_14` | 10 | `vo_char_3011_00_22_hca.hca` | 17.00s | 17.19s | +0.19s |
| `301150` | Kako Natsume | `group_14` | 8 | `vo_char_3011_00_22_hca.hca` | 17.00s | 17.19s | +0.19s |
| `301150` | Kako Natsume | `group_20` | 9 | `vo_char_3011_50_28_hca.hca` | 19.90s | 19.71s | -0.19s |
| `301151` | Kako Natsume | `group_14` | 8 | `vo_char_3011_00_22_hca.hca` | 17.00s | 17.19s | +0.19s |
| `301800` | Hanna Sarasa | `group_22` | 4 | `vo_char_3018_00_29_hca.hca` | 12.00s | 11.81s | -0.19s |
| `302300` | Aimi Eri | `group_23` | 5 | `vo_char_3023_00_31_hca.hca` | 10.00s | 9.81s | -0.19s |
| `303000` | Konomi Haruna | `group_28` | 6 | `vo_char_3030_00_36_hca.hca` | 6.50s | 6.69s | +0.19s |
| `303000` | Konomi Haruna | `group_40` | 5 | `vo_char_3030_00_64_hca.hca` | 4.50s | 4.69s | +0.19s |
| `303000` | Konomi Haruna | `group_9` | 5 | `vo_char_3030_00_17_hca.hca` | 11.00s | 10.81s | -0.19s |
| `303051` | Konomi Haruna | `group_40` | 3 | `vo_char_3030_00_64_hca.hca` | 4.50s | 4.69s | +0.19s |
| `303051` | Konomi Haruna | `group_9` | 3 | `vo_char_3030_00_17_hca.hca` | 11.00s | 10.81s | -0.19s |
| `303100` | Rika Ayano | `group_7` | 7 | `vo_char_3031_00_15_hca.hca` | 5.50s | 5.31s | -0.19s |
| `303551` | Riko Chiaki | `group_4` | 2 | `vo_char_3035_00_05_hca.hca` | 4.20s | 4.39s | +0.19s |
| `303700` | Mel Anna | `group_14` | 6 | `vo_char_3037_00_22_hca.hca` | 15.60s | 15.41s | -0.19s |
| `303700` | Mel Anna | `group_15` | 6 | `vo_char_3037_00_23_hca.hca` | 18.50s | 18.31s | -0.19s |
| `303751` | Mel Anna | `group_14` | 5 | `vo_char_3037_00_22_hca.hca` | 15.60s | 15.41s | -0.19s |
| `303751` | Mel Anna | `group_15` | 5 | `vo_char_3037_00_23_hca.hca` | 18.50s | 18.31s | -0.19s |
| `304950` | Kanae Yukino | `group_26` | 7 | `vo_char_3049_50_34_hca.hca` | 14.00s | 13.81s | -0.19s |
| `305100` | Jun Kazari | `group_17` | 4 | `vo_char_3051_00_24_hca.hca` | 11.60s | 11.41s | -0.19s |
| `305350` | Ikumi Makino | `group_21` | 5 | `vo_char_3053_50_28_hca.hca` | 14.80s | 14.61s | -0.19s |
| `350100` | Rika & Ren | `group_12` | 3 | `vo_char_3501_00_19_hca.hca` | 5.00s | 4.81s | -0.19s |
| `350401` | Masara & Kokoro | `group_2` | 5 | `vo_char_3504_00_02_hca.hca` | 11.70s | 11.51s | -0.19s |
| `350402` | Masara & Kokoro | `group_2` | 5 | `vo_char_3504_00_02_hca.hca` | 11.70s | 11.51s | -0.19s |
| `390201` | Shi | `group_22` | 5 | `vo_char_3902_01_29_hca.hca` | 13.10s | 12.91s | -0.19s |
| `400300` | Yuma Chitose | `group_22` | 7 | `vo_char_4003_00_30_hca.hca` | 10.50s | 10.69s | +0.19s |
| `400300` | Yuma Chitose | `group_26` | 6 | `vo_char_4003_00_34_hca.hca` | 10.00s | 10.19s | +0.19s |
| `400300` | Yuma Chitose | `group_27` | 6 | `vo_char_4003_00_35_hca.hca` | 12.50s | 12.31s | -0.19s |
| `401200` | Umika Misaki | `group_4` | 4 | `vo_char_4012_00_05_hca.hca` | 5.00s | 4.81s | -0.19s |
| `401200` | Umika Misaki | `group_40` | 4 | `vo_char_4012_00_64_hca.hca` | 4.00s | 3.81s | -0.19s |
| `402600` | Elisa | `group_10` | 3 | `vo_char_4026_00_17_hca.hca` | 14.50s | 14.31s | -0.19s |
| `402600` | Elisa | `group_31` | 6 | `vo_char_4026_00_38_hca.hca` | 14.50s | 14.69s | +0.19s |
| `402650` | Elisa | `group_10` | 2 | `vo_char_4026_00_17_hca.hca` | 14.50s | 14.31s | -0.19s |
| `403300` | Arisa Narumi | `group_43` | 6 | `vo_char_4033_00_02_hca.hca` | 11.50s | 11.31s | -0.19s |
| `404300` | Suruga Kanbaru | `group_42` | 2 | `vo_char_4043_00_65_hca.hca` | 2.75s | 2.56s | -0.19s |
| `404400` | Nadeko Sengoku | `group_40` | 2 | `vo_char_4044_00_64_hca.hca` | 4.90s | 4.71s | -0.19s |
| `100100` | Iroha Tamaki | `group_1` | 11 | `vo_char_1001_00_01_hca.hca` | 25.50s | 25.30s | -0.20s |
| `100103` | Iroha Tamaki | `group_1` | 11 | `vo_char_1001_00_01_hca.hca` | 25.50s | 25.30s | -0.20s |
| `100150` | Iroha Tamaki | `group_1` | 10 | `vo_char_1001_00_01_hca.hca` | 25.50s | 25.30s | -0.20s |
| `100153` | Iroha Tamaki | `group_1` | 10 | `vo_char_1001_00_01_hca.hca` | 25.50s | 25.30s | -0.20s |
| `100350` | Tsuruno Yui | `group_29` | 3 | `vo_char_1003_50_37_hca.hca` | 11.00s | 10.80s | -0.20s |
| `100452` | Sana Futaba | `group_23` | 4 | `vo_char_1004_52_31_hca.hca` | 13.00s | 12.80s | -0.20s |
| `100650` | Mifuyu Azusa | `group_16` | 7 | `vo_char_1006_50_24_hca.hca` | 13.50s | 13.30s | -0.20s |
| `100900` | Rena Minami | `group_1` | 13 | `vo_char_1009_00_01_hca.hca` | 34.50s | 34.30s | -0.20s |
| `100950` | Rena Minami | `group_1` | 12 | `vo_char_1009_00_01_hca.hca` | 34.50s | 34.30s | -0.20s |
| `100951` | Rena Minami | `group_1` | 12 | `vo_char_1009_00_01_hca.hca` | 34.50s | 34.30s | -0.20s |
| `100951` | Rena Minami | `group_26` | 4 | `vo_char_1009_51_34_hca.hca` | 13.00s | 12.80s | -0.20s |
| `101000` | Momoko Togame | `group_21` | 6 | `vo_char_1010_00_29_hca.hca` | 10.50s | 10.70s | +0.20s |
| `101000` | Momoko Togame | `group_26` | 5 | `vo_char_1010_00_34_hca.hca` | 6.50s | 6.30s | -0.20s |
| `101000` | Momoko Togame | `group_28` | 5 | `vo_char_1010_00_36_hca.hca` | 6.50s | 6.30s | -0.20s |
| `101300` | Asuka Tatsuki | `group_23` | 6 | `vo_char_1013_00_31_hca.hca` | 12.00s | 11.80s | -0.20s |
| `101300` | Asuka Tatsuki | `group_30` | 6 | `vo_char_1013_00_38_hca.hca` | 10.50s | 10.30s | -0.20s |
| `101800` | Tsukuyo Amane | `group_5` | 4 | `vo_char_1018_00_13_hca.hca` | 5.00s | 4.80s | -0.20s |
| `101850` | Tsukuyo Amane | `group_5` | 3 | `vo_char_1018_00_13_hca.hca` | 5.00s | 4.80s | -0.20s |
| `102300` | Ao Kasane | `group_48` | 7 | `vo_game_0402_12_hca.hca` | 9.40s | 9.20s | -0.20s |
| `102350` | Ao Kasane | `group_44` | 7 | `vo_game_0402_08_hca.hca` | 12.70s | 12.90s | +0.20s |
| `102350` | Ao Kasane | `group_48` | 6 | `vo_game_0402_12_hca.hca` | 9.40s | 9.20s | -0.20s |
| `102551` | Shizuka Tokime | `group_27` | 5 | `vo_char_1025_51_34_hca.hca` | 13.00s | 12.80s | -0.20s |
| `102650` | Chiharu Hiroe | `group_29` | 3 | `vo_char_1026_50_36_hca.hca` | 8.50s | 8.30s | -0.20s |
| `102800` | Himena Aika | `group_15` | 7 | `vo_char_1028_00_22_hca.hca` | 15.30s | 15.50s | +0.20s |
| `102850` | Himena Aika | `group_15` | 6 | `vo_char_1028_00_22_hca.hca` | 15.30s | 15.50s | +0.20s |
| `102850` | Himena Aika | `group_23` | 4 | `vo_char_1028_50_30_hca.hca` | 12.20s | 12.00s | -0.20s |
| `103600` | Urara Yume | `group_38` | 2 | `vo_char_1036_00_45_hca.hca` | 2.50s | 2.30s | -0.20s |
| `104100` | Livia Medeiros | `group_9` | 6 | `vo_char_1041_00_16_hca.hca` | 12.20s | 12.40s | +0.20s |
| `111000` | Momoko Togame | `group_24` | 7 | `vo_char_1110_00_31_hca.hca` | 15.00s | 14.80s | -0.20s |
| `111802` | Amane Sisters | `group_23` | 4 | `vo_char_1118_02_30_hca.hca` | 10.60s | 10.80s | +0.20s |
| `130102` | Iroha & Yachiyo | `group_17` | 5 | `vo_char_1301_02_24_hca.hca` | 10.80s | 11.00s | +0.20s |
| `250000` | Holy Mami | `group_23` | 4 | `vo_char_2500_00_31_hca.hca` | 10.00s | 9.80s | -0.20s |
| `300300` | Hinano Miyako | `group_24` | 6 | `vo_char_3003_00_32_hca.hca` | 11.00s | 11.20s | +0.20s |
| `300400` | Sasara Minagi | `group_35` | 3 | `vo_char_3004_00_43_hca.hca` | 2.00s | 1.80s | -0.20s |
| `300600` | Emiri Kisaki | `group_17` | 7 | `vo_char_3006_00_25_hca.hca` | 8.50s | 8.30s | -0.20s |
| `300600` | Emiri Kisaki | `group_2` | 5 | `vo_char_3006_00_03_hca.hca` | 6.00s | 6.20s | +0.20s |
| `300651` | Emiri Kisaki | `group_2` | 3 | `vo_char_3006_00_03_hca.hca` | 6.00s | 6.20s | +0.20s |
| `300651` | Emiri Kisaki | `group_24` | 6 | `vo_char_3006_51_32_hca.hca` | 13.00s | 12.80s | -0.20s |
| `300700` | Shizuku Hozumi | `group_15` | 10 | `vo_char_3007_00_23_hca.hca` | 22.00s | 21.80s | -0.20s |
| `300750` | Shizuku Hozumi | `group_15` | 8 | `vo_char_3007_00_23_hca.hca` | 22.00s | 21.80s | -0.20s |
| `300800` | Akira Shinobu | `group_26` | 8 | `vo_char_3008_00_34_hca.hca` | 10.00s | 9.80s | -0.20s |
| `300800` | Akira Shinobu | `group_40` | 5 | `vo_char_3008_00_64_hca.hca` | 3.50s | 3.30s | -0.20s |
| `300850` | Akira Shinobu | `group_40` | 2 | `vo_char_3008_00_64_hca.hca` | 3.50s | 3.30s | -0.20s |
| `300900` | Manaka Kurumi | `group_19` | 5 | `vo_char_3009_00_27_hca.hca` | 7.50s | 7.70s | +0.20s |
| `301100` | Kako Natsume | `group_15` | 8 | `vo_char_3011_00_23_hca.hca` | 18.00s | 17.80s | -0.20s |
| `301150` | Kako Natsume | `group_15` | 6 | `vo_char_3011_00_23_hca.hca` | 18.00s | 17.80s | -0.20s |
| `301150` | Kako Natsume | `group_29` | 6 | `vo_char_3011_50_37_hca.hca` | 13.40s | 13.20s | -0.20s |
| `301151` | Kako Natsume | `group_15` | 6 | `vo_char_3011_00_23_hca.hca` | 18.00s | 17.80s | -0.20s |
| `302950` | Masara Kagami | `group_23` | 4 | `vo_char_3029_50_31_hca.hca` | 14.00s | 13.80s | -0.20s |
| `303100` | Rika Ayano | `group_42` | 4 | `vo_char_3031_00_66_hca.hca` | 3.00s | 2.80s | -0.20s |
| `303300` | Sayuki Fumino | `group_18` | 5 | `vo_char_3033_00_25_hca.hca` | 18.50s | 18.70s | +0.20s |
| `303300` | Sayuki Fumino | `group_34` | 9 | `vo_char_3033_00_41_hca.hca` | 21.00s | 21.20s | +0.20s |
| `303300` | Sayuki Fumino | `group_7` | 3 | `vo_char_3033_00_14_hca.hca` | 4.50s | 4.30s | -0.20s |
| `303350` | Sayuki Fumino | `group_7` | 2 | `vo_char_3033_00_14_hca.hca` | 4.50s | 4.30s | -0.20s |
| `304750` | Chika Aoba | `group_21` | 6 | `vo_char_3047_50_29_hca.hca` | 15.40s | 15.20s | -0.20s |
| `350400` | Masara & Kokoro | `group_16` | 8 | `vo_char_3504_00_23_hca.hca` | 26.20s | 26.40s | +0.20s |
| `350401` | Masara & Kokoro | `group_16` | 8 | `vo_char_3504_00_23_hca.hca` | 26.20s | 26.40s | +0.20s |
| `350402` | Masara & Kokoro | `group_16` | 8 | `vo_char_3504_00_23_hca.hca` | 26.20s | 26.40s | +0.20s |
| `390201` | Shi | `group_32` | 5 | `vo_char_3902_01_39_hca.hca` | 13.00s | 12.80s | -0.20s |
| `400200` | Kirika Kure | `group_11` | 5 | `vo_char_4002_00_19_hca.hca` | 6.00s | 5.80s | -0.20s |
| `400200` | Kirika Kure | `group_13` | 8 | `vo_char_4002_00_21_hca.hca` | 14.50s | 14.30s | -0.20s |
| `400200` | Kirika Kure | `group_17` | 7 | `vo_char_4002_00_25_hca.hca` | 14.00s | 13.80s | -0.20s |
| `400200` | Kirika Kure | `group_5` | 5 | `vo_char_4002_00_13_hca.hca` | 9.50s | 9.30s | -0.20s |
| `401100` | Kazumi | `group_15` | 7 | `vo_char_4011_00_23_hca.hca` | 17.00s | 16.80s | -0.20s |
| `401200` | Umika Misaki | `group_20` | 6 | `vo_char_4012_00_28_hca.hca` | 13.50s | 13.70s | +0.20s |
| `402100` | Tart | `group_10` | 5 | `vo_char_4021_00_18_hca.hca` | 13.00s | 12.80s | -0.20s |
| `402150` | Tart | `group_10` | 3 | `vo_char_4021_00_18_hca.hca` | 13.00s | 12.80s | -0.20s |
| `402200` | Riz | `group_10` | 5 | `vo_char_4022_00_18_hca.hca` | 13.00s | 12.80s | -0.20s |
| `402200` | Riz | `group_30` | 5 | `vo_char_4022_00_38_hca.hca` | 13.00s | 12.80s | -0.20s |
| `402250` | Riz | `group_10` | 3 | `vo_char_4022_00_18_hca.hca` | 13.00s | 12.80s | -0.20s |
| `403500` | Haruka Kanade | `group_3` | 2 | `vo_char_4035_00_03_hca.hca` | 6.00s | 5.80s | -0.20s |
| `404100` | Hitagi Senjougahara | `group_32` | 4 | `vo_char_4041_00_40_hca.hca` | 13.75s | 13.55s | -0.20s |
| `404200` | Mayoi Hachikuji | `group_34` | 3 | `vo_char_4042_00_41_hca.hca` | 9.15s | 8.95s | -0.20s |
| `405100` | Nanoha Takamachi | `group_20` | 6 | `vo_char_4051_00_27_hca.hca` | 8.80s | 8.60s | -0.20s |
| `405300` | Hayate Yagami | `group_5` | 4 | `vo_char_4053_00_05_hca.hca` | 4.30s | 4.10s | -0.20s |
| `412103` | Isabeau | `group_23` | 4 | `vo_char_4121_03_30_hca.hca` | 12.30s | 12.10s | -0.20s |
| `100100` | Iroha Tamaki | `group_7` | 6 | `vo_char_1001_00_15_hca.hca` | 9.00s | 8.79s | -0.21s |
| `100103` | Iroha Tamaki | `group_7` | 6 | `vo_char_1001_00_15_hca.hca` | 9.00s | 8.79s | -0.21s |
| `100150` | Iroha Tamaki | `group_7` | 5 | `vo_char_1001_00_15_hca.hca` | 9.00s | 8.79s | -0.21s |
| `100153` | Iroha Tamaki | `group_7` | 5 | `vo_char_1001_00_15_hca.hca` | 9.00s | 8.79s | -0.21s |
| `100354` | Tsuruno Yui | `group_30` | 6 | `vo_char_1003_54_38_hca.hca` | 10.00s | 9.79s | -0.21s |
| `100451` | Sana Futaba | `group_29` | 5 | `vo_char_1004_51_37_hca.hca` | 16.00s | 15.79s | -0.21s |
| `100750` | Touka Satomi | `group_25` | 4 | `vo_char_1007_50_32_hca.hca` | 11.00s | 10.79s | -0.21s |
| `100900` | Rena Minami | `group_11` | 6 | `vo_char_1009_00_19_hca.hca` | 4.50s | 4.29s | -0.21s |
| `100950` | Rena Minami | `group_11` | 5 | `vo_char_1009_00_19_hca.hca` | 4.50s | 4.29s | -0.21s |
| `100950` | Rena Minami | `group_21` | 4 | `vo_char_1009_50_29_hca.hca` | 11.00s | 10.79s | -0.21s |
| `100951` | Rena Minami | `group_11` | 5 | `vo_char_1009_00_19_hca.hca` | 4.50s | 4.29s | -0.21s |
| `101300` | Asuka Tatsuki | `group_42` | 4 | `vo_char_1013_00_66_hca.hca` | 3.00s | 2.79s | -0.21s |
| `101400` | Nemu Hiiragi | `group_1` | 8 | `vo_char_1014_00_01_hca.hca` | 32.00s | 32.21s | +0.21s |
| `101450` | Nemu Hiiragi | `group_1` | 8 | `vo_char_1014_00_01_hca.hca` | 32.00s | 32.21s | +0.21s |
| `102200` | Hikaru Kirari | `group_14` | 4 | `vo_char_1022_00_21_hca.hca` | 8.80s | 9.01s | +0.21s |
| `102250` | Hikaru Kirari | `group_14` | 3 | `vo_char_1022_00_21_hca.hca` | 8.80s | 9.01s | +0.21s |
| `102600` | Chiharu Hiroe | `group_34` | 6 | `vo_char_1026_00_41_hca.hca` | 13.50s | 13.29s | -0.21s |
| `102900` | Shigure Miyabi | `group_33` | 5 | `vo_char_1029_00_40_hca.hca` | 17.00s | 16.79s | -0.21s |
| `103050` | Hagumu Azumi | `group_29` | 4 | `vo_char_1030_50_36_hca.hca` | 14.00s | 13.79s | -0.21s |
| `103550` | Alexandra Kurusu | `group_29` | 5 | `vo_char_1035_50_36_hca.hca` | 12.30s | 12.51s | +0.21s |
| `104100` | Livia Medeiros | `group_32` | 7 | `vo_char_1041_00_39_hca.hca` | 14.70s | 14.91s | +0.21s |
| `111201` | Karin & Alina | `group_17` | 5 | `vo_char_1112_01_24_hca.hca` | 11.30s | 11.51s | +0.21s |
| `111600` | Kanagi Izumi | `group_20` | 4 | `vo_char_1116_00_27_hca.hca` | 13.40s | 13.19s | -0.21s |
| `111800` | Amane Sisters | `group_2` | 5 | `vo_char_1118_00_02_hca.hca` | 15.80s | 15.59s | -0.21s |
| `111801` | Amane Sisters | `group_2` | 5 | `vo_char_1118_00_02_hca.hca` | 15.80s | 15.59s | -0.21s |
| `111801` | Amane Sisters | `group_32` | 4 | `vo_char_1118_01_39_hca.hca` | 13.60s | 13.81s | +0.21s |
| `111802` | Amane Sisters | `group_2` | 5 | `vo_char_1118_00_02_hca.hca` | 15.80s | 15.59s | -0.21s |
| `120902` | Rena & Kaede | `group_24` | 7 | `vo_char_1209_02_31_hca.hca` | 19.00s | 19.21s | +0.21s |
| `130102` | Iroha & Yachiyo | `group_26` | 6 | `vo_char_1301_02_33_hca.hca` | 12.20s | 11.99s | -0.21s |
| `200600` | Kyoko Sakura | `group_39` | 5 | `vo_char_2006_00_63_hca.hca` | 4.00s | 3.79s | -0.21s |
| `200602` | Kyoko Sakura | `group_39` | 4 | `vo_char_2006_00_63_hca.hca` | 4.00s | 3.79s | -0.21s |
| `200650` | Kyoko Sakura | `group_39` | 3 | `vo_char_2006_00_63_hca.hca` | 4.00s | 3.79s | -0.21s |
| `200651` | Kyoko Sakura | `group_26` | 6 | `vo_char_2006_51_34_hca.hca` | 14.20s | 14.41s | +0.21s |
| `200651` | Kyoko Sakura | `group_39` | 2 | `vo_char_2006_00_63_hca.hca` | 4.00s | 3.79s | -0.21s |
| `200653` | Kyoko Sakura | `group_39` | 2 | `vo_char_2006_00_63_hca.hca` | 4.00s | 3.79s | -0.21s |
| `220200` | Devil Homura | `group_34` | 4 | `vo_char_2202_00_41_hca.hca` | 12.00s | 12.21s | +0.21s |
| `260000` | Kyoko Sakura | `group_32` | 5 | `vo_char_2600_00_39_hca.hca` | 13.00s | 13.21s | +0.21s |
| `300250` | Natsuki Utsuho | `group_25` | 4 | `vo_char_3002_50_33_hca.hca` | 12.40s | 12.19s | -0.21s |
| `300400` | Sasara Minagi | `group_15` | 9 | `vo_char_3004_00_23_hca.hca` | 19.50s | 19.71s | +0.21s |
| `300500` | Nanaka Tokiwa | `group_28` | 8 | `vo_char_3005_00_36_hca.hca` | 14.50s | 14.29s | -0.21s |
| `300500` | Nanaka Tokiwa | `group_9` | 8 | `vo_char_3005_00_17_hca.hca` | 13.00s | 12.79s | -0.21s |
| `300700` | Shizuku Hozumi | `group_2` | 4 | `vo_char_3007_00_03_hca.hca` | 6.00s | 5.79s | -0.21s |
| `300700` | Shizuku Hozumi | `group_27` | 5 | `vo_char_3007_00_35_hca.hca` | 12.00s | 11.79s | -0.21s |
| `300750` | Shizuku Hozumi | `group_2` | 2 | `vo_char_3007_00_03_hca.hca` | 6.00s | 5.79s | -0.21s |
| `300750` | Shizuku Hozumi | `group_9` | 2 | `vo_char_3007_00_17_hca.hca` | 8.00s | 8.21s | +0.21s |
| `300800` | Akira Shinobu | `group_8` | 8 | `vo_char_3008_00_16_hca.hca` | 12.00s | 12.21s | +0.21s |
| `300850` | Akira Shinobu | `group_8` | 5 | `vo_char_3008_00_16_hca.hca` | 12.00s | 12.21s | +0.21s |
| `300900` | Manaka Kurumi | `group_1` | 9 | `vo_char_3009_00_01_hca.hca` | 20.00s | 19.79s | -0.21s |
| `300900` | Manaka Kurumi | `group_31` | 6 | `vo_char_3009_00_39_hca.hca` | 10.00s | 10.21s | +0.21s |
| `301100` | Kako Natsume | `group_1` | 13 | `vo_char_3011_00_01_hca.hca` | 24.00s | 24.21s | +0.21s |
| `301100` | Kako Natsume | `group_30` | 8 | `vo_char_3011_00_38_hca.hca` | 13.50s | 13.29s | -0.21s |
| `301150` | Kako Natsume | `group_1` | 11 | `vo_char_3011_00_01_hca.hca` | 24.00s | 24.21s | +0.21s |
| `301151` | Kako Natsume | `group_1` | 11 | `vo_char_3011_00_01_hca.hca` | 24.00s | 24.21s | +0.21s |
| `301400` | Seika Kumi | `group_42` | 3 | `vo_char_3014_00_66_hca.hca` | 3.00s | 2.79s | -0.21s |
| `301500` | Mito Aino | `group_11` | 5 | `vo_char_3015_00_19_hca.hca` | 7.00s | 6.79s | -0.21s |
| `301650` | Kokoro Awane | `group_20` | 6 | `vo_char_3016_50_28_hca.hca` | 15.60s | 15.39s | -0.21s |
| `301650` | Kokoro Awane | `group_25` | 4 | `vo_char_3016_50_33_hca.hca` | 12.20s | 11.99s | -0.21s |
| `301650` | Kokoro Awane | `group_33` | 5 | `vo_char_3016_50_41_hca.hca` | 14.00s | 14.21s | +0.21s |
| `301700` | Yukika Nanase | `group_19` | 5 | `vo_char_3017_00_26_hca.hca` | 12.70s | 12.91s | +0.21s |
| `301800` | Hanna Sarasa | `group_20` | 6 | `vo_char_3018_00_27_hca.hca` | 14.00s | 14.21s | +0.21s |
| `301900` | Ayaka Mariko | `group_41` | 4 | `vo_char_3019_00_65_hca.hca` | 4.50s | 4.71s | +0.21s |
| `301900` | Ayaka Mariko | `group_5` | 4 | `vo_char_3019_00_13_hca.hca` | 5.50s | 5.29s | -0.21s |
| `301950` | Ayaka Mariko | `group_41` | 2 | `vo_char_3019_00_65_hca.hca` | 4.50s | 4.71s | +0.21s |
| `301950` | Ayaka Mariko | `group_5` | 2 | `vo_char_3019_00_13_hca.hca` | 5.50s | 5.29s | -0.21s |
| `302100` | Sakuya Suzuka | `group_28` | 6 | `vo_char_3021_00_35_hca.hca` | 13.50s | 13.29s | -0.21s |
| `302100` | Sakuya Suzuka | `group_6` | 3 | `vo_char_3021_00_13_hca.hca` | 6.10s | 6.31s | +0.21s |
| `302800` | Ayame Mikuri | `group_1` | 7 | `vo_char_3028_00_01_hca.hca` | 21.10s | 20.89s | -0.21s |
| `302900` | Masara Kagami | `group_10` | 3 | `vo_char_3029_00_18_hca.hca` | 14.00s | 14.21s | +0.21s |
| `303000` | Konomi Haruna | `group_27` | 6 | `vo_char_3030_00_35_hca.hca` | 11.00s | 10.79s | -0.21s |
| `303300` | Sayuki Fumino | `group_29` | 7 | `vo_char_3033_00_36_hca.hca` | 17.10s | 17.31s | +0.21s |
| `303300` | Sayuki Fumino | `group_39` | 3 | `vo_char_3033_00_46_hca.hca` | 4.10s | 4.31s | +0.21s |
| `303350` | Sayuki Fumino | `group_39` | 2 | `vo_char_3033_00_46_hca.hca` | 4.10s | 4.31s | +0.21s |
| `303400` | Moka Megumi | `group_28` | 4 | `vo_char_3034_00_35_hca.hca` | 10.00s | 9.79s | -0.21s |
| `303700` | Mel Anna | `group_1` | 8 | `vo_char_3037_00_01_hca.hca` | 21.00s | 20.79s | -0.21s |
| `303751` | Mel Anna | `group_1` | 7 | `vo_char_3037_00_01_hca.hca` | 21.00s | 20.79s | -0.21s |
| `304400` | Ranka Chizu | `group_18` | 4 | `vo_char_3044_00_25_hca.hca` | 12.22s | 12.01s | -0.21s |
| `305350` | Ikumi Makino | `group_19` | 7 | `vo_char_3053_50_26_hca.hca` | 12.10s | 12.31s | +0.21s |
| `400100` | Oriko Mikuni | `group_12` | 4 | `vo_char_4001_00_20_hca.hca` | 6.50s | 6.29s | -0.21s |
| `400100` | Oriko Mikuni | `group_33` | 6 | `vo_char_4001_00_41_hca.hca` | 15.00s | 14.79s | -0.21s |
| `400200` | Kirika Kure | `group_21` | 6 | `vo_char_4002_00_29_hca.hca` | 12.00s | 11.79s | -0.21s |
| `400200` | Kirika Kure | `group_25` | 7 | `vo_char_4002_00_33_hca.hca` | 10.00s | 10.21s | +0.21s |
| `400300` | Yuma Chitose | `group_11` | 5 | `vo_char_4003_00_19_hca.hca` | 7.00s | 6.79s | -0.21s |
| `400300` | Yuma Chitose | `group_20` | 5 | `vo_char_4003_00_28_hca.hca` | 15.00s | 15.21s | +0.21s |
| `400300` | Yuma Chitose | `group_29` | 7 | `vo_char_4003_00_37_hca.hca` | 10.00s | 9.79s | -0.21s |
| `400300` | Yuma Chitose | `group_33` | 7 | `vo_char_4003_00_41_hca.hca` | 12.50s | 12.71s | +0.21s |
| `400300` | Yuma Chitose | `group_7` | 6 | `vo_char_4003_00_15_hca.hca` | 4.50s | 4.29s | -0.21s |
| `402500` | Corbeau | `group_17` | 4 | `vo_char_4025_00_24_hca.hca` | 14.00s | 13.79s | -0.21s |
| `403200` | Matsuri Hinata | `group_26` | 5 | `vo_char_4032_00_33_hca.hca` | 14.00s | 13.79s | -0.21s |
| `403300` | Arisa Narumi | `group_18` | 7 | `vo_char_4033_00_26_hca.hca` | 13.70s | 13.49s | -0.21s |
| `404500` | Tsubasa Hanekawa | `group_25` | 2 | `vo_char_4045_00_32_hca.hca` | 11.50s | 11.29s | -0.21s |
| `405200` | Fate | `group_30` | 5 | `vo_char_4052_00_37_hca.hca` | 13.50s | 13.29s | -0.21s |
| `405300` | Hayate Yagami | `group_31` | 7 | `vo_char_4053_00_38_hca.hca` | 15.50s | 15.71s | +0.21s |
| `412103` | Isabeau | `group_19` | 4 | `vo_char_4121_03_26_hca.hca` | 12.00s | 11.79s | -0.21s |
| `100100` | Iroha Tamaki | `group_23` | 6 | `vo_char_1001_00_31_hca.hca` | 12.00s | 12.22s | +0.22s |
| `100100` | Iroha Tamaki | `group_32` | 6 | `vo_char_1001_00_40_hca.hca` | 10.50s | 10.28s | -0.22s |
| `100100` | Iroha Tamaki | `group_6` | 4 | `vo_char_1001_00_14_hca.hca` | 6.00s | 6.22s | +0.22s |
| `100103` | Iroha Tamaki | `group_6` | 4 | `vo_char_1001_00_14_hca.hca` | 6.00s | 6.22s | +0.22s |
| `100150` | Iroha Tamaki | `group_6` | 3 | `vo_char_1001_00_14_hca.hca` | 6.00s | 6.22s | +0.22s |
| `100153` | Iroha Tamaki | `group_6` | 3 | `vo_char_1001_00_14_hca.hca` | 6.00s | 6.22s | +0.22s |
| `100850` | Alina Gray | `group_17` | 9 | `vo_char_1008_50_25_hca.hca` | 16.50s | 16.72s | +0.22s |
| `101000` | Momoko Togame | `group_10` | 6 | `vo_char_1010_00_18_hca.hca` | 11.00s | 10.78s | -0.22s |
| `101000` | Momoko Togame | `group_42` | 4 | `vo_char_1010_00_66_hca.hca` | 5.00s | 4.78s | -0.22s |
| `101051` | Momoko Togame | `group_10` | 5 | `vo_char_1010_00_18_hca.hca` | 11.00s | 10.78s | -0.22s |
| `101051` | Momoko Togame | `group_42` | 3 | `vo_char_1010_00_66_hca.hca` | 5.00s | 4.78s | -0.22s |
| `101450` | Nemu Hiiragi | `group_30` | 6 | `vo_char_1014_50_37_hca.hca` | 14.20s | 14.42s | +0.22s |
| `101700` | Mitama Yakumo | `group_58` | 5 | `vo_game_0902_09_hca.hca` | 13.60s | 13.38s | -0.22s |
| `101951` | Tsukasa Amane | `group_16` | 4 | `vo_char_1019_51_24_hca.hca` | 7.70s | 7.92s | +0.22s |
| `101951` | Tsukasa Amane | `group_21` | 5 | `vo_char_1019_51_29_hca.hca` | 9.00s | 8.78s | -0.22s |
| `102200` | Hikaru Kirari | `group_10` | 4 | `vo_char_1022_00_17_hca.hca` | 8.80s | 8.58s | -0.22s |
| `102200` | Hikaru Kirari | `group_19` | 4 | `vo_char_1022_00_26_hca.hca` | 9.20s | 9.42s | +0.22s |
| `102200` | Hikaru Kirari | `group_24` | 4 | `vo_char_1022_00_31_hca.hca` | 10.60s | 10.82s | +0.22s |
| `102250` | Hikaru Kirari | `group_10` | 3 | `vo_char_1022_00_17_hca.hca` | 8.80s | 8.58s | -0.22s |
| `103350` | Rabi Himuro | `group_29` | 7 | `vo_char_1033_50_36_hca.hca` | 16.20s | 16.42s | +0.22s |
| `103550` | Alexandra Kurusu | `group_22` | 4 | `vo_char_1035_50_29_hca.hca` | 12.40s | 12.62s | +0.22s |
| `104600` | Chizuru | `group_8` | 3 | `vo_char_1046_00_15_hca.hca` | 4.30s | 4.08s | -0.22s |
| `104900` | Olga | `group_29` | 5 | `vo_char_1049_00_36_hca.hca` | 10.90s | 10.68s | -0.22s |
| `110100` | Iroha Tamaki | `group_32` | 6 | `vo_char_1101_00_40_hca.hca` | 13.20s | 12.98s | -0.22s |
| `110500` | Felicia-chan | `group_38` | 2 | `vo_char_1105_00_45_hca.hca` | 3.90s | 3.68s | -0.22s |
| `110800` | Holy Alina | `group_4` | 2 | `vo_char_1108_00_04_hca.hca` | 5.00s | 4.78s | -0.22s |
| `111600` | Kanagi Izumi | `group_31` | 5 | `vo_char_1116_00_38_hca.hca` | 14.50s | 14.28s | -0.22s |
| `111800` | Amane Sisters | `group_31` | 7 | `vo_char_1118_00_38_hca.hca` | 13.60s | 13.38s | -0.22s |
| `120100` | Iroha-chan | `group_20` | 3 | `vo_char_1201_00_27_hca.hca` | 10.00s | 9.78s | -0.22s |
| `120900` | Rena & Kaede | `group_6` | 5 | `vo_char_1209_00_13_hca.hca` | 7.40s | 7.18s | -0.22s |
| `120901` | Rena & Kaede | `group_6` | 4 | `vo_char_1209_00_13_hca.hca` | 7.40s | 7.18s | -0.22s |
| `120902` | Rena & Kaede | `group_6` | 4 | `vo_char_1209_00_13_hca.hca` | 7.40s | 7.18s | -0.22s |
| `130102` | Iroha & Yachiyo | `group_21` | 7 | `vo_char_1301_02_28_hca.hca` | 12.10s | 11.88s | -0.22s |
| `200700` | Nagisa Momoe | `group_6` | 3 | `vo_char_2007_00_13_hca.hca` | 6.00s | 5.78s | -0.22s |
| `300300` | Hinano Miyako | `group_9` | 6 | `vo_char_3003_00_17_hca.hca` | 11.50s | 11.28s | -0.22s |
| `300351` | Hinano Miyako | `group_9` | 5 | `vo_char_3003_00_17_hca.hca` | 11.50s | 11.28s | -0.22s |
| `300600` | Emiri Kisaki | `group_29` | 6 | `vo_char_3006_00_37_hca.hca` | 13.00s | 13.22s | +0.22s |
| `300600` | Emiri Kisaki | `group_5` | 5 | `vo_char_3006_00_13_hca.hca` | 4.50s | 4.28s | -0.22s |
| `300651` | Emiri Kisaki | `group_5` | 3 | `vo_char_3006_00_13_hca.hca` | 4.50s | 4.28s | -0.22s |
| `300700` | Shizuku Hozumi | `group_37` | 4 | `vo_char_3007_00_45_hca.hca` | 2.50s | 2.28s | -0.22s |
| `300750` | Shizuku Hozumi | `group_37` | 2 | `vo_char_3007_00_45_hca.hca` | 2.50s | 2.28s | -0.22s |
| `300800` | Akira Shinobu | `group_27` | 8 | `vo_char_3008_00_35_hca.hca` | 9.50s | 9.72s | +0.22s |
| `300900` | Manaka Kurumi | `group_33` | 5 | `vo_char_3009_00_41_hca.hca` | 9.50s | 9.72s | +0.22s |
| `300900` | Manaka Kurumi | `group_4` | 4 | `vo_char_3009_00_05_hca.hca` | 5.50s | 5.72s | +0.22s |
| `301051` | Ria Ami | `group_20` | 6 | `vo_char_3010_51_28_hca.hca` | 14.70s | 14.48s | -0.22s |
| `301100` | Kako Natsume | `group_12` | 5 | `vo_char_3011_00_20_hca.hca` | 5.50s | 5.28s | -0.22s |
| `301150` | Kako Natsume | `group_12` | 3 | `vo_char_3011_00_20_hca.hca` | 5.50s | 5.28s | -0.22s |
| `301150` | Kako Natsume | `group_27` | 8 | `vo_char_3011_50_35_hca.hca` | 15.60s | 15.38s | -0.22s |
| `301151` | Kako Natsume | `group_12` | 3 | `vo_char_3011_00_20_hca.hca` | 5.50s | 5.28s | -0.22s |
| `301400` | Seika Kumi | `group_16` | 9 | `vo_char_3014_00_24_hca.hca` | 16.00s | 15.78s | -0.22s |
| `301800` | Hanna Sarasa | `group_18` | 6 | `vo_char_3018_00_25_hca.hca` | 16.50s | 16.28s | -0.22s |
| `301900` | Ayaka Mariko | `group_14` | 7 | `vo_char_3019_00_22_hca.hca` | 18.20s | 17.98s | -0.22s |
| `301950` | Ayaka Mariko | `group_14` | 5 | `vo_char_3019_00_22_hca.hca` | 18.20s | 17.98s | -0.22s |
| `302500` | Ren Isuzu | `group_43` | 7 | `vo_char_3025_00_02_hca.hca` | 19.10s | 18.88s | -0.22s |
| `302551` | Ren Isuzu | `group_43` | 6 | `vo_char_3025_00_02_hca.hca` | 19.10s | 18.88s | -0.22s |
| `302900` | Masara Kagami | `group_14` | 6 | `vo_char_3029_00_22_hca.hca` | 21.00s | 21.22s | +0.22s |
| `303000` | Konomi Haruna | `group_22` | 5 | `vo_char_3030_00_30_hca.hca` | 6.00s | 5.78s | -0.22s |
| `303100` | Rika Ayano | `group_15` | 9 | `vo_char_3031_00_23_hca.hca` | 16.00s | 15.78s | -0.22s |
| `303100` | Rika Ayano | `group_6` | 5 | `vo_char_3031_00_14_hca.hca` | 5.00s | 4.78s | -0.22s |
| `303250` | Mayu Kozue | `group_32` | 5 | `vo_char_3032_50_40_hca.hca` | 14.80s | 14.58s | -0.22s |
| `303400` | Moka Megumi | `group_20` | 5 | `vo_char_3034_00_27_hca.hca` | 11.00s | 10.78s | -0.22s |
| `303500` | Riko Chiaki | `group_35` | 3 | `vo_char_3035_00_42_hca.hca` | 4.20s | 3.98s | -0.22s |
| `303551` | Riko Chiaki | `group_12` | 2 | `vo_char_3035_00_20_hca.hca` | 7.00s | 6.78s | -0.22s |
| `304800` | Hotaru Yura | `group_29` | 3 | `vo_char_3048_00_36_hca.hca` | 12.50s | 12.28s | -0.22s |
| `304800` | Hotaru Yura | `group_33` | 7 | `vo_char_3048_00_40_hca.hca` | 18.30s | 18.52s | +0.22s |
| `305000` | Yuuna Kaharu | `group_6` | 3 | `vo_char_3050_00_13_hca.hca` | 5.70s | 5.48s | -0.22s |
| `305251` | Ashley Taylor | `group_29` | 8 | `vo_char_3052_51_37_hca.hca` | 16.00s | 16.22s | +0.22s |
| `305400` | Mitsune Miwa | `group_39` | 2 | `vo_char_3054_00_46_hca.hca` | 3.00s | 2.78s | -0.22s |
| `305850` | Ryoko Natsu | `group_26` | 5 | `vo_char_3058_50_34_hca.hca` | 10.90s | 10.68s | -0.22s |
| `350100` | Rika & Ren | `group_9` | 5 | `vo_char_3501_00_16_hca.hca` | 12.00s | 11.78s | -0.22s |
| `400100` | Oriko Mikuni | `group_26` | 7 | `vo_char_4001_00_34_hca.hca` | 14.00s | 13.78s | -0.22s |
| `400100` | Oriko Mikuni | `group_39` | 4 | `vo_char_4001_00_63_hca.hca` | 4.50s | 4.28s | -0.22s |
| `400200` | Kirika Kure | `group_38` | 3 | `vo_char_4002_00_46_hca.hca` | 3.50s | 3.28s | -0.22s |
| `400300` | Yuma Chitose | `group_17` | 6 | `vo_char_4003_00_25_hca.hca` | 9.50s | 9.28s | -0.22s |
| `401100` | Kazumi | `group_36` | 3 | `vo_char_4011_00_44_hca.hca` | 3.00s | 2.78s | -0.22s |
| `401100` | Kazumi | `group_9` | 5 | `vo_char_4011_00_17_hca.hca` | 12.20s | 11.98s | -0.22s |
| `401200` | Umika Misaki | `group_41` | 3 | `vo_char_4012_00_65_hca.hca` | 2.00s | 1.78s | -0.22s |
| `401300` | Kaoru Maki | `group_15` | 7 | `vo_char_4013_00_23_hca.hca` | 18.50s | 18.28s | -0.22s |
| `402300` | Melissa | `group_19` | 4 | `vo_char_4023_00_27_hca.hca` | 8.50s | 8.28s | -0.22s |
| `403200` | Matsuri Hinata | `group_32` | 4 | `vo_char_4032_00_39_hca.hca` | 13.00s | 12.78s | -0.22s |
| `404200` | Mayoi Hachikuji | `group_13` | 2 | `vo_char_4042_00_20_hca.hca` | 4.90s | 4.68s | -0.22s |
| `404200` | Mayoi Hachikuji | `group_14` | 2 | `vo_char_4042_00_21_hca.hca` | 4.90s | 4.68s | -0.22s |
| `404200` | Mayoi Hachikuji | `group_15` | 2 | `vo_char_4042_00_22_hca.hca` | 4.90s | 4.68s | -0.22s |
| `404200` | Mayoi Hachikuji | `group_16` | 2 | `vo_char_4042_00_23_hca.hca` | 4.90s | 4.68s | -0.22s |
| `404400` | Nadeko Sengoku | `group_6` | 2 | `vo_char_4044_00_14_hca.hca` | 8.65s | 8.87s | +0.22s |
| `404500` | Tsubasa Hanekawa | `group_19` | 3 | `vo_char_4045_00_26_hca.hca` | 12.20s | 11.98s | -0.22s |
| `405100` | Nanoha Takamachi | `group_16` | 7 | `vo_char_4051_00_23_hca.hca` | 17.00s | 16.78s | -0.22s |
| `100100` | Iroha Tamaki | `group_17` | 9 | `vo_char_1001_00_25_hca.hca` | 11.50s | 11.73s | +0.23s |
| `100100` | Iroha Tamaki | `group_22` | 9 | `vo_char_1001_00_30_hca.hca` | 14.00s | 13.77s | -0.23s |
| `100150` | Iroha Tamaki | `group_22` | 4 | `vo_char_1001_50_30_hca.hca` | 10.00s | 9.77s | -0.23s |
| `100350` | Tsuruno Yui | `group_31` | 3 | `vo_char_1003_50_39_hca.hca` | 9.00s | 8.77s | -0.23s |
| `100552` | Felicia Mitsuki | `group_32` | 7 | `vo_char_1005_52_40_hca.hca` | 12.00s | 11.77s | -0.23s |
| `100900` | Rena Minami | `group_9` | 6 | `vo_char_1009_00_17_hca.hca` | 11.00s | 10.77s | -0.23s |
| `100950` | Rena Minami | `group_9` | 5 | `vo_char_1009_00_17_hca.hca` | 11.00s | 10.77s | -0.23s |
| `100951` | Rena Minami | `group_9` | 5 | `vo_char_1009_00_17_hca.hca` | 11.00s | 10.77s | -0.23s |
| `101000` | Momoko Togame | `group_14` | 7 | `vo_char_1010_00_22_hca.hca` | 16.00s | 16.23s | +0.23s |
| `101051` | Momoko Togame | `group_14` | 6 | `vo_char_1010_00_22_hca.hca` | 16.00s | 16.23s | +0.23s |
| `101100` | Kaede Akino | `group_18` | 7 | `vo_char_1011_00_26_hca.hca` | 11.00s | 10.77s | -0.23s |
| `101100` | Kaede Akino | `group_37` | 3 | `vo_char_1011_00_45_hca.hca` | 3.00s | 2.77s | -0.23s |
| `101150` | Kaede Akino | `group_37` | 2 | `vo_char_1011_00_45_hca.hca` | 3.00s | 2.77s | -0.23s |
| `101200` | Karin Misono | `group_27` | 4 | `vo_char_1012_00_35_hca.hca` | 12.00s | 11.77s | -0.23s |
| `101200` | Karin Misono | `group_30` | 6 | `vo_char_1012_00_38_hca.hca` | 11.00s | 10.77s | -0.23s |
| `101200` | Karin Misono | `group_8` | 5 | `vo_char_1012_00_16_hca.hca` | 11.00s | 10.77s | -0.23s |
| `101250` | Karin Misono | `group_28` | 7 | `vo_char_1012_50_36_hca.hca` | 16.00s | 15.77s | -0.23s |
| `101250` | Karin Misono | `group_8` | 4 | `vo_char_1012_00_16_hca.hca` | 11.00s | 10.77s | -0.23s |
| `101300` | Asuka Tatsuki | `group_16` | 5 | `vo_char_1013_00_24_hca.hca` | 9.50s | 9.27s | -0.23s |
| `101750` | Mitama Yakumo | `group_23` | 6 | `vo_char_1017_50_31_hca.hca` | 19.00s | 18.77s | -0.23s |
| `101750` | Mitama Yakumo | `group_26` | 4 | `vo_char_1017_50_34_hca.hca` | 13.00s | 12.77s | -0.23s |
| `104100` | Livia Medeiros | `group_30` | 4 | `vo_char_1041_00_37_hca.hca` | 12.20s | 12.43s | +0.23s |
| `104600` | Chizuru | `group_31` | 4 | `vo_char_1046_00_38_hca.hca` | 9.80s | 9.57s | -0.23s |
| `105300` | Amaryllis | `group_13` | 4 | `vo_char_1053_00_20_hca.hca` | 5.50s | 5.27s | -0.23s |
| `105302` | Amaryllis | `group_13` | 3 | `vo_char_1053_00_20_hca.hca` | 5.50s | 5.27s | -0.23s |
| `110100` | Iroha Tamaki | `group_10` | 4 | `vo_char_1101_00_18_hca.hca` | 10.00s | 9.77s | -0.23s |
| `111801` | Amane Sisters | `group_30` | 4 | `vo_char_1118_01_37_hca.hca` | 14.40s | 14.17s | -0.23s |
| `120100` | Iroha-chan | `group_1` | 6 | `vo_char_1201_00_01_hca.hca` | 19.40s | 19.17s | -0.23s |
| `120900` | Rena & Kaede | `group_21` | 6 | `vo_char_1209_00_28_hca.hca` | 14.20s | 13.97s | -0.23s |
| `120900` | Rena & Kaede | `group_37` | 3 | `vo_char_1209_00_44_hca.hca` | 3.00s | 2.77s | -0.23s |
| `120901` | Rena & Kaede | `group_37` | 2 | `vo_char_1209_00_44_hca.hca` | 3.00s | 2.77s | -0.23s |
| `120902` | Rena & Kaede | `group_37` | 2 | `vo_char_1209_00_44_hca.hca` | 3.00s | 2.77s | -0.23s |
| `130100` | Iroha & Yachiyo | `group_3` | 3 | `vo_char_1301_00_03_hca.hca` | 3.70s | 3.47s | -0.23s |
| `130100` | Iroha & Yachiyo | `group_5` | 3 | `vo_char_1301_00_05_hca.hca` | 3.90s | 3.67s | -0.23s |
| `130101` | Iroha & Yachiyo | `group_3` | 3 | `vo_char_1301_00_03_hca.hca` | 3.70s | 3.47s | -0.23s |
| `130101` | Iroha & Yachiyo | `group_5` | 3 | `vo_char_1301_00_05_hca.hca` | 3.90s | 3.67s | -0.23s |
| `130102` | Iroha & Yachiyo | `group_3` | 3 | `vo_char_1301_00_03_hca.hca` | 3.70s | 3.47s | -0.23s |
| `130102` | Iroha & Yachiyo | `group_5` | 3 | `vo_char_1301_00_05_hca.hca` | 3.90s | 3.67s | -0.23s |
| `200200` | Homura Akemi | `group_1` | 5 | `vo_char_2002_00_01_hca.hca` | 25.55s | 25.78s | +0.23s |
| `200651` | Kyoko Sakura | `group_31` | 4 | `vo_char_2006_51_39_hca.hca` | 10.50s | 10.27s | -0.23s |
| `240000` | Sayaka Miki | `group_11` | 7 | `vo_char_2400_00_18_hca.hca` | 10.00s | 9.77s | -0.23s |
| `300500` | Nanaka Tokiwa | `group_34` | 4 | `vo_char_3005_00_42_hca.hca` | 2.50s | 2.27s | -0.23s |
| `300500` | Nanaka Tokiwa | `group_5` | 5 | `vo_char_3005_00_13_hca.hca` | 6.00s | 5.77s | -0.23s |
| `300600` | Emiri Kisaki | `group_41` | 4 | `vo_char_3006_00_65_hca.hca` | 2.50s | 2.27s | -0.23s |
| `300651` | Emiri Kisaki | `group_41` | 2 | `vo_char_3006_00_65_hca.hca` | 2.50s | 2.27s | -0.23s |
| `300700` | Shizuku Hozumi | `group_5` | 5 | `vo_char_3007_00_13_hca.hca` | 5.50s | 5.27s | -0.23s |
| `300750` | Shizuku Hozumi | `group_33` | 4 | `vo_char_3007_50_41_hca.hca` | 12.40s | 12.63s | +0.23s |
| `300750` | Shizuku Hozumi | `group_5` | 3 | `vo_char_3007_00_13_hca.hca` | 5.50s | 5.27s | -0.23s |
| `301100` | Kako Natsume | `group_19` | 9 | `vo_char_3011_00_27_hca.hca` | 14.50s | 14.27s | -0.23s |
| `301100` | Kako Natsume | `group_8` | 5 | `vo_char_3011_00_16_hca.hca` | 12.50s | 12.73s | +0.23s |
| `301150` | Kako Natsume | `group_8` | 3 | `vo_char_3011_00_16_hca.hca` | 12.50s | 12.73s | +0.23s |
| `301151` | Kako Natsume | `group_8` | 3 | `vo_char_3011_00_16_hca.hca` | 12.50s | 12.73s | +0.23s |
| `301900` | Ayaka Mariko | `group_28` | 5 | `vo_char_3019_00_36_hca.hca` | 10.00s | 10.23s | +0.23s |
| `301900` | Ayaka Mariko | `group_43` | 7 | `vo_char_3019_00_02_hca.hca` | 9.50s | 9.27s | -0.23s |
| `301950` | Ayaka Mariko | `group_43` | 5 | `vo_char_3019_00_02_hca.hca` | 9.50s | 9.27s | -0.23s |
| `302300` | Aimi Eri | `group_27` | 5 | `vo_char_3023_00_35_hca.hca` | 11.00s | 11.23s | +0.23s |
| `302300` | Aimi Eri | `group_6` | 5 | `vo_char_3023_00_14_hca.hca` | 6.80s | 6.57s | -0.23s |
| `302900` | Masara Kagami | `group_23` | 3 | `vo_char_3029_00_31_hca.hca` | 11.70s | 11.47s | -0.23s |
| `302900` | Masara Kagami | `group_34` | 2 | `vo_char_3029_00_42_hca.hca` | 3.00s | 2.77s | -0.23s |
| `302950` | Masara Kagami | `group_34` | 2 | `vo_char_3029_00_42_hca.hca` | 3.00s | 2.77s | -0.23s |
| `303100` | Rika Ayano | `group_39` | 4 | `vo_char_3031_00_63_hca.hca` | 3.50s | 3.27s | -0.23s |
| `303300` | Sayuki Fumino | `group_12` | 3 | `vo_char_3033_00_19_hca.hca` | 6.00s | 5.77s | -0.23s |
| `303350` | Sayuki Fumino | `group_12` | 2 | `vo_char_3033_00_19_hca.hca` | 6.00s | 5.77s | -0.23s |
| `303700` | Mel Anna | `group_17` | 6 | `vo_char_3037_00_25_hca.hca` | 15.00s | 14.77s | -0.23s |
| `304300` | Eternal Sakura | `group_2` | 5 | `vo_char_3043_00_02_hca.hca` | 19.50s | 19.73s | +0.23s |
| `305000` | Yuuna Kaharu | `group_14` | 4 | `vo_char_3050_00_21_hca.hca` | 14.50s | 14.27s | -0.23s |
| `305000` | Yuuna Kaharu | `group_2` | 4 | `vo_char_3050_00_02_hca.hca` | 10.55s | 10.32s | -0.23s |
| `305600` | Rui Mizuki | `group_29` | 5 | `vo_char_3056_00_36_hca.hca` | 14.50s | 14.27s | -0.23s |
| `350400` | Masara & Kokoro | `group_34` | 8 | `vo_char_3504_00_41_hca.hca` | 15.70s | 15.93s | +0.23s |
| `350400` | Masara & Kokoro | `group_9` | 6 | `vo_char_3504_00_16_hca.hca` | 19.60s | 19.37s | -0.23s |
| `350401` | Masara & Kokoro | `group_9` | 5 | `vo_char_3504_00_16_hca.hca` | 19.60s | 19.37s | -0.23s |
| `350402` | Masara & Kokoro | `group_9` | 5 | `vo_char_3504_00_16_hca.hca` | 19.60s | 19.37s | -0.23s |
| `390200` | Shi | `group_3` | 3 | `vo_char_3902_00_03_hca.hca` | 5.20s | 4.97s | -0.23s |
| `390201` | Shi | `group_3` | 3 | `vo_char_3902_00_03_hca.hca` | 5.20s | 4.97s | -0.23s |
| `400100` | Oriko Mikuni | `group_18` | 10 | `vo_char_4001_00_26_hca.hca` | 11.50s | 11.73s | +0.23s |
| `400300` | Yuma Chitose | `group_14` | 8 | `vo_char_4003_00_22_hca.hca` | 19.00s | 18.77s | -0.23s |
| `400300` | Yuma Chitose | `group_39` | 4 | `vo_char_4003_00_63_hca.hca` | 4.00s | 3.77s | -0.23s |
| `402600` | Elisa | `group_14` | 6 | `vo_char_4026_00_21_hca.hca` | 10.60s | 10.37s | -0.23s |
| `402600` | Elisa | `group_27` | 8 | `vo_char_4026_00_34_hca.hca` | 20.60s | 20.37s | -0.23s |
| `402650` | Elisa | `group_14` | 5 | `vo_char_4026_00_21_hca.hca` | 10.60s | 10.37s | -0.23s |
| `402700` | Lapin | `group_17` | 6 | `vo_char_4027_00_24_hca.hca` | 11.80s | 11.57s | -0.23s |
| `412103` | Isabeau | `group_34` | 5 | `vo_char_4121_03_41_hca.hca` | 19.00s | 18.77s | -0.23s |
| `100100` | Iroha Tamaki | `group_16` | 7 | `vo_char_1001_00_24_hca.hca` | 11.00s | 10.76s | -0.24s |
| `100352` | Tsuruno Yui | `group_19` | 7 | `vo_char_1003_52_27_hca.hca` | 14.00s | 13.76s | -0.24s |
| `100354` | Tsuruno Yui | `group_29` | 5 | `vo_char_1003_54_37_hca.hca` | 9.00s | 8.76s | -0.24s |
| `100800` | Alina Gray | `group_16` | 5 | `vo_char_1008_00_24_hca.hca` | 13.50s | 13.26s | -0.24s |
| `100851` | Alina Gray | `group_16` | 4 | `vo_char_1008_51_24_hca.hca` | 13.50s | 13.26s | -0.24s |
| `101000` | Momoko Togame | `group_11` | 5 | `vo_char_1010_00_19_hca.hca` | 4.50s | 4.26s | -0.24s |
| `101000` | Momoko Togame | `group_2` | 4 | `vo_char_1010_00_03_hca.hca` | 7.00s | 6.76s | -0.24s |
| `101051` | Momoko Togame | `group_11` | 4 | `vo_char_1010_00_19_hca.hca` | 4.50s | 4.26s | -0.24s |
| `101051` | Momoko Togame | `group_2` | 3 | `vo_char_1010_00_03_hca.hca` | 7.00s | 6.76s | -0.24s |
| `101150` | Kaede Akino | `group_32` | 5 | `vo_char_1011_50_40_hca.hca` | 12.50s | 12.74s | +0.24s |
| `101152` | Kaede Akino | `group_20` | 9 | `vo_char_1011_52_28_hca.hca` | 21.60s | 21.36s | -0.24s |
| `101300` | Asuka Tatsuki | `group_11` | 7 | `vo_char_1013_00_19_hca.hca` | 6.50s | 6.26s | -0.24s |
| `101700` | Mitama Yakumo | `group_52` | 6 | `vo_game_0702_12_hca.hca` | 11.50s | 11.74s | +0.24s |
| `102200` | Hikaru Kirari | `group_25` | 4 | `vo_char_1022_00_32_hca.hca` | 9.30s | 9.06s | -0.24s |
| `102200` | Hikaru Kirari | `group_46` | 5 | `vo_game_0302_10_hca.hca` | 9.10s | 9.34s | +0.24s |
| `102250` | Hikaru Kirari | `group_46` | 4 | `vo_game_0302_10_hca.hca` | 9.10s | 9.34s | +0.24s |
| `102400` | Juri Oba | `group_46` | 5 | `vo_game_0502_10_hca.hca` | 11.20s | 11.44s | +0.24s |
| `102800` | Himena Aika | `group_2` | 7 | `vo_char_1028_00_02_hca.hca` | 13.70s | 13.94s | +0.24s |
| `102800` | Himena Aika | `group_29` | 5 | `vo_char_1028_00_36_hca.hca` | 10.20s | 9.96s | -0.24s |
| `102850` | Himena Aika | `group_2` | 6 | `vo_char_1028_00_02_hca.hca` | 13.70s | 13.94s | +0.24s |
| `102900` | Shigure Miyabi | `group_7` | 3 | `vo_char_1029_00_14_hca.hca` | 5.00s | 4.76s | -0.24s |
| `102950` | Shigure Miyabi | `group_7` | 2 | `vo_char_1029_00_14_hca.hca` | 5.00s | 4.76s | -0.24s |
| `103200` | Miyuri Yukari | `group_19` | 4 | `vo_char_1032_00_26_hca.hca` | 12.20s | 11.96s | -0.24s |
| `103350` | Rabi Himuro | `group_20` | 4 | `vo_char_1033_50_27_hca.hca` | 13.50s | 13.26s | -0.24s |
| `103350` | Rabi Himuro | `group_27` | 5 | `vo_char_1033_50_34_hca.hca` | 14.80s | 14.56s | -0.24s |
| `103600` | Urara Yume | `group_30` | 6 | `vo_char_1036_00_37_hca.hca` | 11.40s | 11.64s | +0.24s |
| `103902` | Sudachi Sawa | `group_27` | 5 | `vo_char_1039_02_34_hca.hca` | 9.70s | 9.46s | -0.24s |
| `103903` | Sudachi Sawa | `group_27` | 5 | `vo_char_1039_03_34_hca.hca` | 9.70s | 9.46s | -0.24s |
| `104100` | Livia Medeiros | `group_1` | 7 | `vo_char_1041_00_01_hca.hca` | 27.40s | 27.16s | -0.24s |
| `104400` | Mikoto Sena | `group_15` | 6 | `vo_char_1044_00_22_hca.hca` | 17.40s | 17.16s | -0.24s |
| `104600` | Chizuru | `group_10` | 5 | `vo_char_1046_00_17_hca.hca` | 10.80s | 11.04s | +0.24s |
| `104600` | Chizuru | `group_38` | 2 | `vo_char_1046_00_45_hca.hca` | 3.00s | 2.76s | -0.24s |
| `105300` | Amaryllis | `group_21` | 7 | `vo_char_1053_00_28_hca.hca` | 21.50s | 21.26s | -0.24s |
| `105300` | Amaryllis | `group_25` | 5 | `vo_char_1053_00_32_hca.hca` | 11.50s | 11.26s | -0.24s |
| `105302` | Amaryllis | `group_25` | 4 | `vo_char_1053_02_32_hca.hca` | 14.80s | 15.04s | +0.24s |
| `105302` | Amaryllis | `group_9` | 4 | `vo_char_1053_00_16_hca.hca` | 10.50s | 10.74s | +0.24s |
| `110500` | Felicia-chan | `group_11` | 3 | `vo_char_1105_00_18_hca.hca` | 10.80s | 10.56s | -0.24s |
| `110500` | Felicia-chan | `group_20` | 3 | `vo_char_1105_00_27_hca.hca` | 11.70s | 11.94s | +0.24s |
| `110702` | Touka & Nemu | `group_25` | 3 | `vo_char_1107_02_32_hca.hca` | 18.30s | 18.06s | -0.24s |
| `111600` | Kanagi Izumi | `group_28` | 9 | `vo_char_1116_00_35_hca.hca` | 17.80s | 18.04s | +0.24s |
| `111600` | Kanagi Izumi | `group_3` | 2 | `vo_char_1116_00_03_hca.hca` | 3.70s | 3.46s | -0.24s |
| `111600` | Kanagi Izumi | `group_32` | 6 | `vo_char_1116_00_39_hca.hca` | 17.50s | 17.26s | -0.24s |
| `180102` | Iroha & Kuroe | `group_27` | 4 | `vo_char_1801_02_34_hca.hca` | 12.00s | 11.76s | -0.24s |
| `220200` | Devil Homura | `group_17` | 5 | `vo_char_2202_00_24_hca.hca` | 14.00s | 14.24s | +0.24s |
| `220200` | Devil Homura | `group_18` | 5 | `vo_char_2202_00_25_hca.hca` | 14.50s | 14.74s | +0.24s |
| `220200` | Devil Homura | `group_33` | 3 | `vo_char_2202_00_40_hca.hca` | 13.30s | 13.06s | -0.24s |
| `300300` | Hinano Miyako | `group_11` | 5 | `vo_char_3003_00_19_hca.hca` | 6.00s | 5.76s | -0.24s |
| `300351` | Hinano Miyako | `group_11` | 4 | `vo_char_3003_00_19_hca.hca` | 6.00s | 5.76s | -0.24s |
| `300600` | Emiri Kisaki | `group_7` | 5 | `vo_char_3006_00_15_hca.hca` | 5.00s | 4.76s | -0.24s |
| `300651` | Emiri Kisaki | `group_7` | 3 | `vo_char_3006_00_15_hca.hca` | 5.00s | 4.76s | -0.24s |
| `300700` | Shizuku Hozumi | `group_18` | 5 | `vo_char_3007_00_26_hca.hca` | 6.50s | 6.74s | +0.24s |
| `300800` | Akira Shinobu | `group_29` | 8 | `vo_char_3008_00_37_hca.hca` | 10.50s | 10.74s | +0.24s |
| `300800` | Akira Shinobu | `group_38` | 5 | `vo_char_3008_00_46_hca.hca` | 2.50s | 2.26s | -0.24s |
| `300850` | Akira Shinobu | `group_38` | 2 | `vo_char_3008_00_46_hca.hca` | 2.50s | 2.26s | -0.24s |
| `301100` | Kako Natsume | `group_9` | 5 | `vo_char_3011_00_17_hca.hca` | 11.00s | 11.24s | +0.24s |
| `301150` | Kako Natsume | `group_9` | 3 | `vo_char_3011_00_17_hca.hca` | 11.00s | 11.24s | +0.24s |
| `301151` | Kako Natsume | `group_9` | 3 | `vo_char_3011_00_17_hca.hca` | 11.00s | 11.24s | +0.24s |
| `301300` | Leila Ibuki | `group_24` | 5 | `vo_char_3013_00_32_hca.hca` | 15.50s | 15.26s | -0.24s |
| `301500` | Mito Aino | `group_36` | 3 | `vo_char_3015_00_44_hca.hca` | 3.00s | 2.76s | -0.24s |
| `301700` | Yukika Nanase | `group_18` | 3 | `vo_char_3017_00_25_hca.hca` | 11.20s | 10.96s | -0.24s |
| `301900` | Ayaka Mariko | `group_37` | 4 | `vo_char_3019_00_45_hca.hca` | 4.00s | 3.76s | -0.24s |
| `301950` | Ayaka Mariko | `group_17` | 3 | `vo_char_3019_50_25_hca.hca` | 10.50s | 10.26s | -0.24s |
| `301950` | Ayaka Mariko | `group_20` | 4 | `vo_char_3019_50_28_hca.hca` | 11.60s | 11.84s | +0.24s |
| `301950` | Ayaka Mariko | `group_37` | 2 | `vo_char_3019_00_45_hca.hca` | 4.00s | 3.76s | -0.24s |
| `302700` | Hazuki Yusa | `group_25` | 5 | `vo_char_3027_00_33_hca.hca` | 12.00s | 11.76s | -0.24s |
| `303000` | Konomi Haruna | `group_21` | 6 | `vo_char_3030_00_29_hca.hca` | 11.00s | 10.76s | -0.24s |
| `303100` | Rika Ayano | `group_2` | 6 | `vo_char_3031_00_03_hca.hca` | 6.00s | 5.76s | -0.24s |
| `303100` | Rika Ayano | `group_8` | 10 | `vo_char_3031_00_16_hca.hca` | 9.50s | 9.26s | -0.24s |
| `303300` | Sayuki Fumino | `group_13` | 4 | `vo_char_3033_00_20_hca.hca` | 5.60s | 5.36s | -0.24s |
| `303350` | Sayuki Fumino | `group_13` | 3 | `vo_char_3033_00_20_hca.hca` | 5.60s | 5.36s | -0.24s |
| `303700` | Mel Anna | `group_16` | 4 | `vo_char_3037_00_24_hca.hca` | 11.00s | 10.76s | -0.24s |
| `304300` | Eternal Sakura | `group_18` | 5 | `vo_char_3043_00_25_hca.hca` | 17.00s | 16.76s | -0.24s |
| `304400` | Ranka Chizu | `group_26` | 3 | `vo_char_3044_00_33_hca.hca` | 10.90s | 10.66s | -0.24s |
| `304700` | Chika Aoba | `group_11` | 5 | `vo_char_3047_00_18_hca.hca` | 13.80s | 13.56s | -0.24s |
| `304800` | Hotaru Yura | `group_9` | 5 | `vo_char_3048_00_16_hca.hca` | 14.40s | 14.16s | -0.24s |
| `350402` | Masara & Kokoro | `group_19` | 5 | `vo_char_3504_02_26_hca.hca` | 13.80s | 13.56s | -0.24s |
| `400100` | Oriko Mikuni | `group_1` | 11 | `vo_char_4001_00_01_hca.hca` | 25.00s | 24.76s | -0.24s |
| `402200` | Riz | `group_28` | 4 | `vo_char_4022_00_36_hca.hca` | 12.00s | 11.76s | -0.24s |
| `402700` | Lapin | `group_28` | 5 | `vo_char_4027_00_35_hca.hca` | 10.10s | 9.86s | -0.24s |
| `402700` | Lapin | `group_32` | 6 | `vo_char_4027_00_39_hca.hca` | 12.10s | 11.86s | -0.24s |
| `404600` | Shinobu Oshino | `group_19` | 3 | `vo_char_4046_00_26_hca.hca` | 10.50s | 10.26s | -0.24s |
| `405100` | Nanoha Takamachi | `group_12` | 4 | `vo_char_4051_00_19_hca.hca` | 3.50s | 3.26s | -0.24s |
| `405200` | Fate | `group_14` | 5 | `vo_char_4052_00_21_hca.hca` | 10.80s | 10.56s | -0.24s |
| `100100` | Iroha Tamaki | `group_11` | 4 | `vo_char_1001_00_19_hca.hca` | 5.00s | 5.25s | +0.25s |
| `100103` | Iroha Tamaki | `group_11` | 4 | `vo_char_1001_00_19_hca.hca` | 5.00s | 5.25s | +0.25s |
| `100150` | Iroha Tamaki | `group_11` | 3 | `vo_char_1001_00_19_hca.hca` | 5.00s | 5.25s | +0.25s |
| `100153` | Iroha Tamaki | `group_11` | 3 | `vo_char_1001_00_19_hca.hca` | 5.00s | 5.25s | +0.25s |
| `100700` | Touka Satomi | `group_39` | 3 | `vo_char_1007_00_46_hca.hca` | 3.50s | 3.25s | -0.25s |
| `100850` | Alina Gray | `group_20` | 8 | `vo_char_1008_50_28_hca.hca` | 16.00s | 15.75s | -0.25s |
| `100900` | Rena Minami | `group_28` | 6 | `vo_char_1009_00_36_hca.hca` | 8.00s | 8.25s | +0.25s |
| `101051` | Momoko Togame | `group_29` | 4 | `vo_char_1010_51_37_hca.hca` | 12.00s | 11.75s | -0.25s |
| `101100` | Kaede Akino | `group_13` | 8 | `vo_char_1011_00_21_hca.hca` | 14.50s | 14.25s | -0.25s |
| `101100` | Kaede Akino | `group_19` | 6 | `vo_char_1011_00_27_hca.hca` | 8.50s | 8.75s | +0.25s |
| `101150` | Kaede Akino | `group_13` | 7 | `vo_char_1011_00_21_hca.hca` | 14.50s | 14.25s | -0.25s |
| `101152` | Kaede Akino | `group_13` | 6 | `vo_char_1011_00_21_hca.hca` | 14.50s | 14.25s | -0.25s |
| `101300` | Asuka Tatsuki | `group_8` | 8 | `vo_char_1013_00_16_hca.hca` | 14.00s | 13.75s | -0.25s |
| `101850` | Tsukuyo Amane | `group_18` | 4 | `vo_char_1018_50_26_hca.hca` | 17.00s | 16.75s | -0.25s |
| `102250` | Hikaru Kirari | `group_21` | 7 | `vo_char_1022_50_28_hca.hca` | 17.80s | 17.55s | -0.25s |
| `102600` | Chiharu Hiroe | `group_1` | 8 | `vo_char_1026_00_01_hca.hca` | 20.20s | 19.95s | -0.25s |
| `102650` | Chiharu Hiroe | `group_1` | 7 | `vo_char_1026_00_01_hca.hca` | 20.20s | 19.95s | -0.25s |
| `102651` | Chiharu Hiroe | `group_1` | 7 | `vo_char_1026_00_01_hca.hca` | 20.20s | 19.95s | -0.25s |
| `103200` | Miyuri Yukari | `group_11` | 6 | `vo_char_1032_00_18_hca.hca` | 15.20s | 14.95s | -0.25s |
| `103200` | Miyuri Yukari | `group_6` | 3 | `vo_char_1032_00_13_hca.hca` | 6.40s | 6.15s | -0.25s |
| `103350` | Rabi Himuro | `group_23` | 3 | `vo_char_1033_50_30_hca.hca` | 13.00s | 12.75s | -0.25s |
| `104050` | Yozuru Sasame | `group_27` | 5 | `vo_char_1040_50_34_hca.hca` | 13.20s | 13.45s | +0.25s |
| `110100` | Iroha Tamaki | `group_16` | 5 | `vo_char_1101_00_24_hca.hca` | 13.00s | 12.75s | -0.25s |
| `110702` | Touka & Nemu | `group_30` | 4 | `vo_char_1107_02_37_hca.hca` | 16.40s | 16.15s | -0.25s |
| `111700` | Mitama Yakumo | `group_50` | 6 | `vo_game_0102_10_hca.hca` | 13.30s | 13.55s | +0.25s |
| `200600` | Kyoko Sakura | `group_13` | 6 | `vo_char_2006_00_21_hca.hca` | 11.50s | 11.25s | -0.25s |
| `200602` | Kyoko Sakura | `group_13` | 5 | `vo_char_2006_00_21_hca.hca` | 11.50s | 11.25s | -0.25s |
| `200650` | Kyoko Sakura | `group_13` | 4 | `vo_char_2006_00_21_hca.hca` | 11.50s | 11.25s | -0.25s |
| `200651` | Kyoko Sakura | `group_13` | 3 | `vo_char_2006_00_21_hca.hca` | 11.50s | 11.25s | -0.25s |
| `200653` | Kyoko Sakura | `group_13` | 3 | `vo_char_2006_00_21_hca.hca` | 11.50s | 11.25s | -0.25s |
| `240000` | Sayaka Miki | `group_29` | 6 | `vo_char_2400_00_36_hca.hca` | 12.00s | 11.75s | -0.25s |
| `300300` | Hinano Miyako | `group_15` | 8 | `vo_char_3003_00_23_hca.hca` | 16.50s | 16.25s | -0.25s |
| `300351` | Hinano Miyako | `group_15` | 7 | `vo_char_3003_00_23_hca.hca` | 16.50s | 16.25s | -0.25s |
| `300600` | Emiri Kisaki | `group_12` | 5 | `vo_char_3006_00_20_hca.hca` | 5.00s | 4.75s | -0.25s |
| `300600` | Emiri Kisaki | `group_34` | 3 | `vo_char_3006_00_42_hca.hca` | 2.00s | 1.75s | -0.25s |
| `300651` | Emiri Kisaki | `group_12` | 3 | `vo_char_3006_00_20_hca.hca` | 5.00s | 4.75s | -0.25s |
| `300700` | Shizuku Hozumi | `group_13` | 8 | `vo_char_3007_00_21_hca.hca` | 12.50s | 12.75s | +0.25s |
| `300750` | Shizuku Hozumi | `group_13` | 6 | `vo_char_3007_00_21_hca.hca` | 12.50s | 12.75s | +0.25s |
| `300750` | Shizuku Hozumi | `group_27` | 4 | `vo_char_3007_50_35_hca.hca` | 9.00s | 8.75s | -0.25s |
| `300800` | Akira Shinobu | `group_20` | 8 | `vo_char_3008_00_28_hca.hca` | 14.50s | 14.25s | -0.25s |
| `300800` | Akira Shinobu | `group_22` | 9 | `vo_char_3008_00_30_hca.hca` | 11.00s | 11.25s | +0.25s |
| `300800` | Akira Shinobu | `group_24` | 10 | `vo_char_3008_00_32_hca.hca` | 11.50s | 11.25s | -0.25s |
| `300900` | Manaka Kurumi | `group_16` | 5 | `vo_char_3009_00_24_hca.hca` | 10.00s | 10.25s | +0.25s |
| `301000` | Ria Ami | `group_31` | 5 | `vo_char_3010_00_39_hca.hca` | 11.20s | 10.95s | -0.25s |
| `301100` | Kako Natsume | `group_21` | 10 | `vo_char_3011_00_29_hca.hca` | 18.00s | 17.75s | -0.25s |
| `301100` | Kako Natsume | `group_36` | 3 | `vo_char_3011_00_44_hca.hca` | 3.00s | 2.75s | -0.25s |
| `301900` | Ayaka Mariko | `group_30` | 6 | `vo_char_3019_00_38_hca.hca` | 10.20s | 9.95s | -0.25s |
| `301950` | Ayaka Mariko | `group_29` | 3 | `vo_char_3019_50_37_hca.hca` | 10.10s | 9.85s | -0.25s |
| `302600` | Konoha Shizumi | `group_34` | 3 | `vo_char_3026_00_42_hca.hca` | 2.00s | 1.75s | -0.25s |
| `303000` | Konomi Haruna | `group_2` | 4 | `vo_char_3030_00_03_hca.hca` | 5.50s | 5.25s | -0.25s |
| `303000` | Konomi Haruna | `group_38` | 5 | `vo_char_3030_00_46_hca.hca` | 3.50s | 3.25s | -0.25s |
| `303051` | Konomi Haruna | `group_2` | 2 | `vo_char_3030_00_03_hca.hca` | 5.50s | 5.25s | -0.25s |
| `303051` | Konomi Haruna | `group_38` | 3 | `vo_char_3030_00_46_hca.hca` | 3.50s | 3.25s | -0.25s |
| `303100` | Rika Ayano | `group_40` | 4 | `vo_char_3031_00_64_hca.hca` | 3.00s | 3.25s | +0.25s |
| `303551` | Riko Chiaki | `group_22` | 5 | `vo_char_3035_51_30_hca.hca` | 13.00s | 12.75s | -0.25s |
| `303751` | Mel Anna | `group_24` | 3 | `vo_char_3037_51_32_hca.hca` | 8.00s | 7.75s | -0.25s |
| `304700` | Chika Aoba | `group_15` | 7 | `vo_char_3047_00_22_hca.hca` | 19.40s | 19.15s | -0.25s |
| `304900` | Kanae Yukino | `group_25` | 3 | `vo_char_3049_00_33_hca.hca` | 11.00s | 10.75s | -0.25s |
| `305400` | Mitsune Miwa | `group_13` | 3 | `vo_char_3054_00_20_hca.hca` | 5.00s | 4.75s | -0.25s |
| `350100` | Rika & Ren | `group_31` | 5 | `vo_char_3501_00_38_hca.hca` | 11.40s | 11.15s | -0.25s |
| `350400` | Masara & Kokoro | `group_23` | 5 | `vo_char_3504_00_30_hca.hca` | 12.40s | 12.15s | -0.25s |
| `400100` | Oriko Mikuni | `group_23` | 6 | `vo_char_4001_00_31_hca.hca` | 13.00s | 12.75s | -0.25s |
| `400100` | Oriko Mikuni | `group_5` | 4 | `vo_char_4001_00_13_hca.hca` | 5.50s | 5.25s | -0.25s |
| `402100` | Tart | `group_28` | 5 | `vo_char_4021_00_36_hca.hca` | 10.50s | 10.75s | +0.25s |
| `402200` | Riz | `group_27` | 6 | `vo_char_4022_00_35_hca.hca` | 15.00s | 14.75s | -0.25s |
| `403500` | Haruka Kanade | `group_27` | 5 | `vo_char_4035_00_34_hca.hca` | 11.00s | 10.75s | -0.25s |
| `404200` | Mayoi Hachikuji | `group_21` | 2 | `vo_char_4042_00_28_hca.hca` | 10.50s | 10.25s | -0.25s |
| `405200` | Fate | `group_13` | 4 | `vo_char_4052_00_20_hca.hca` | 5.50s | 5.25s | -0.25s |
| `405300` | Hayate Yagami | `group_35` | 3 | `vo_char_4053_00_42_hca.hca` | 2.50s | 2.25s | -0.25s |
| `100100` | Iroha Tamaki | `group_10` | 6 | `vo_char_1001_00_18_hca.hca` | 16.50s | 16.24s | -0.26s |
| `100100` | Iroha Tamaki | `group_39` | 4 | `vo_char_1001_00_63_hca.hca` | 5.00s | 4.74s | -0.26s |
| `100103` | Iroha Tamaki | `group_10` | 6 | `vo_char_1001_00_18_hca.hca` | 16.50s | 16.24s | -0.26s |
| `100103` | Iroha Tamaki | `group_39` | 4 | `vo_char_1001_00_63_hca.hca` | 5.00s | 4.74s | -0.26s |
| `100150` | Iroha Tamaki | `group_10` | 5 | `vo_char_1001_00_18_hca.hca` | 16.50s | 16.24s | -0.26s |
| `100150` | Iroha Tamaki | `group_39` | 3 | `vo_char_1001_00_63_hca.hca` | 5.00s | 4.74s | -0.26s |
| `100153` | Iroha Tamaki | `group_10` | 5 | `vo_char_1001_00_18_hca.hca` | 16.50s | 16.24s | -0.26s |
| `100153` | Iroha Tamaki | `group_39` | 3 | `vo_char_1001_00_63_hca.hca` | 5.00s | 4.74s | -0.26s |
| `100300` | Tsuruno Yui | `group_43` | 8 | `vo_char_1003_00_02_hca.hca` | 12.70s | 12.44s | -0.26s |
| `100350` | Tsuruno Yui | `group_43` | 7 | `vo_char_1003_00_02_hca.hca` | 12.70s | 12.44s | -0.26s |
| `100351` | Tsuruno Yui | `group_43` | 7 | `vo_char_1003_00_02_hca.hca` | 12.70s | 12.44s | -0.26s |
| `100352` | Tsuruno Yui | `group_43` | 7 | `vo_char_1003_00_02_hca.hca` | 12.70s | 12.44s | -0.26s |
| `100354` | Tsuruno Yui | `group_43` | 6 | `vo_char_1003_00_02_hca.hca` | 12.70s | 12.44s | -0.26s |
| `100700` | Touka Satomi | `group_11` | 5 | `vo_char_1007_00_18_hca.hca` | 14.30s | 14.04s | -0.26s |
| `100700` | Touka Satomi | `group_22` | 4 | `vo_char_1007_00_29_hca.hca` | 11.70s | 11.96s | +0.26s |
| `100750` | Touka Satomi | `group_11` | 5 | `vo_char_1007_00_18_hca.hca` | 14.30s | 14.04s | -0.26s |
| `100750` | Touka Satomi | `group_32` | 5 | `vo_char_1007_50_39_hca.hca` | 14.50s | 14.24s | -0.26s |
| `100900` | Rena Minami | `group_21` | 7 | `vo_char_1009_00_29_hca.hca` | 10.00s | 9.74s | -0.26s |
| `101300` | Asuka Tatsuki | `group_21` | 7 | `vo_char_1013_00_29_hca.hca` | 11.00s | 11.26s | +0.26s |
| `101300` | Asuka Tatsuki | `group_26` | 6 | `vo_char_1013_00_34_hca.hca` | 10.50s | 10.24s | -0.26s |
| `101300` | Asuka Tatsuki | `group_27` | 7 | `vo_char_1013_00_35_hca.hca` | 14.50s | 14.24s | -0.26s |
| `101400` | Nemu Hiiragi | `group_34` | 6 | `vo_char_1014_00_41_hca.hca` | 18.10s | 17.84s | -0.26s |
| `101550` | Ui Tamaki | `group_23` | 6 | `vo_char_1015_50_30_hca.hca` | 15.00s | 14.74s | -0.26s |
| `101850` | Tsukuyo Amane | `group_20` | 4 | `vo_char_1018_50_28_hca.hca` | 16.00s | 15.74s | -0.26s |
| `101850` | Tsukuyo Amane | `group_22` | 4 | `vo_char_1018_50_30_hca.hca` | 14.00s | 13.74s | -0.26s |
| `102200` | Hikaru Kirari | `group_41` | 5 | `vo_game_0302_02_hca.hca` | 6.20s | 6.46s | +0.26s |
| `102250` | Hikaru Kirari | `group_41` | 4 | `vo_game_0302_02_hca.hca` | 6.20s | 6.46s | +0.26s |
| `102300` | Ao Kasane | `group_2` | 7 | `vo_char_1023_00_02_hca.hca` | 14.60s | 14.34s | -0.26s |
| `102350` | Ao Kasane | `group_2` | 6 | `vo_char_1023_00_02_hca.hca` | 14.60s | 14.34s | -0.26s |
| `102600` | Chiharu Hiroe | `group_7` | 5 | `vo_char_1026_00_14_hca.hca` | 7.10s | 6.84s | -0.26s |
| `102650` | Chiharu Hiroe | `group_7` | 4 | `vo_char_1026_00_14_hca.hca` | 7.10s | 6.84s | -0.26s |
| `102651` | Chiharu Hiroe | `group_7` | 4 | `vo_char_1026_00_14_hca.hca` | 7.10s | 6.84s | -0.26s |
| `102800` | Himena Aika | `group_20` | 4 | `vo_char_1028_00_27_hca.hca` | 8.80s | 8.54s | -0.26s |
| `102850` | Himena Aika | `group_24` | 4 | `vo_char_1028_50_31_hca.hca` | 11.10s | 11.36s | +0.26s |
| `103000` | Hagumu Azumi | `group_38` | 3 | `vo_char_1030_00_45_hca.hca` | 4.20s | 4.46s | +0.26s |
| `103050` | Hagumu Azumi | `group_38` | 2 | `vo_char_1030_00_45_hca.hca` | 4.20s | 4.46s | +0.26s |
| `103350` | Rabi Himuro | `group_18` | 3 | `vo_char_1033_50_25_hca.hca` | 11.10s | 11.36s | +0.26s |
| `104400` | Mikoto Sena | `group_7` | 4 | `vo_char_1044_00_14_hca.hca` | 8.20s | 8.46s | +0.26s |
| `104600` | Chizuru | `group_11` | 5 | `vo_char_1046_00_18_hca.hca` | 11.20s | 11.46s | +0.26s |
| `104600` | Chizuru | `group_14` | 8 | `vo_char_1046_00_21_hca.hca` | 15.50s | 15.24s | -0.26s |
| `105300` | Amaryllis | `group_20` | 6 | `vo_char_1053_00_27_hca.hca` | 12.80s | 12.54s | -0.26s |
| `105300` | Amaryllis | `group_9` | 5 | `vo_char_1053_00_16_hca.hca` | 11.00s | 10.74s | -0.26s |
| `110702` | Touka & Nemu | `group_22` | 4 | `vo_char_1107_02_29_hca.hca` | 17.20s | 16.94s | -0.26s |
| `111000` | Momoko Togame | `group_34` | 5 | `vo_char_1110_00_41_hca.hca` | 15.30s | 15.56s | +0.26s |
| `130100` | Iroha & Yachiyo | `group_26` | 4 | `vo_char_1301_00_33_hca.hca` | 14.10s | 13.84s | -0.26s |
| `200300` | Homura Akemi | `group_26` | 6 | `vo_char_2003_00_34_hca.hca` | 15.00s | 14.74s | -0.26s |
| `200900` | Mabayu Aki | `group_1` | 8 | `vo_char_2009_00_01_hca.hca` | 29.60s | 29.34s | -0.26s |
| `240000` | Sayaka Miki | `group_19` | 7 | `vo_char_2400_00_26_hca.hca` | 14.00s | 13.74s | -0.26s |
| `250001` | Holy Mami | `group_23` | 4 | `vo_char_2500_01_31_hca.hca` | 9.00s | 8.74s | -0.26s |
| `300400` | Sasara Minagi | `group_33` | 5 | `vo_char_3004_00_41_hca.hca` | 11.50s | 11.76s | +0.26s |
| `300700` | Shizuku Hozumi | `group_14` | 7 | `vo_char_3007_00_22_hca.hca` | 18.50s | 18.76s | +0.26s |
| `300700` | Shizuku Hozumi | `group_25` | 6 | `vo_char_3007_00_33_hca.hca` | 12.50s | 12.76s | +0.26s |
| `300750` | Shizuku Hozumi | `group_14` | 5 | `vo_char_3007_00_22_hca.hca` | 18.50s | 18.76s | +0.26s |
| `301100` | Kako Natsume | `group_17` | 8 | `vo_char_3011_00_25_hca.hca` | 24.00s | 23.74s | -0.26s |
| `301151` | Kako Natsume | `group_26` | 4 | `vo_char_3011_51_34_hca.hca` | 12.00s | 11.74s | -0.26s |
| `301400` | Seika Kumi | `group_24` | 7 | `vo_char_3014_00_32_hca.hca` | 15.00s | 14.74s | -0.26s |
| `301500` | Mito Aino | `group_23` | 5 | `vo_char_3015_00_31_hca.hca` | 12.70s | 12.44s | -0.26s |
| `301600` | Kokoro Awane | `group_33` | 7 | `vo_char_3016_00_41_hca.hca` | 12.00s | 11.74s | -0.26s |
| `301700` | Yukika Nanase | `group_5` | 2 | `vo_char_3017_00_05_hca.hca` | 4.50s | 4.24s | -0.26s |
| `302600` | Konoha Shizumi | `group_11` | 4 | `vo_char_3026_00_19_hca.hca` | 7.00s | 6.74s | -0.26s |
| `303000` | Konomi Haruna | `group_24` | 5 | `vo_char_3030_00_32_hca.hca` | 9.50s | 9.76s | +0.26s |
| `303000` | Konomi Haruna | `group_30` | 6 | `vo_char_3030_00_38_hca.hca` | 12.00s | 11.74s | -0.26s |
| `304300` | Eternal Sakura | `group_1` | 8 | `vo_char_3043_00_01_hca.hca` | 38.00s | 38.26s | +0.26s |
| `304650` | Ryo Midori | `group_20` | 5 | `vo_char_3046_50_27_hca.hca` | 10.30s | 10.04s | -0.26s |
| `400100` | Oriko Mikuni | `group_30` | 4 | `vo_char_4001_00_38_hca.hca` | 11.50s | 11.24s | -0.26s |
| `400300` | Yuma Chitose | `group_19` | 7 | `vo_char_4003_00_27_hca.hca` | 11.50s | 11.24s | -0.26s |
| `402500` | Corbeau | `group_14` | 5 | `vo_char_4025_00_21_hca.hca` | 14.20s | 13.94s | -0.26s |
| `402700` | Lapin | `group_16` | 4 | `vo_char_4027_00_23_hca.hca` | 16.10s | 16.36s | +0.26s |
| `404100` | Hitagi Senjougahara | `group_39` | 2 | `vo_char_4041_00_63_hca.hca` | 4.00s | 3.74s | -0.26s |
| `404400` | Nadeko Sengoku | `group_19` | 2 | `vo_char_4044_00_27_hca.hca` | 10.00s | 9.74s | -0.26s |
| `404400` | Nadeko Sengoku | `group_24` | 2 | `vo_char_4044_00_32_hca.hca` | 10.40s | 10.14s | -0.26s |
| `405100` | Nanoha Takamachi | `group_41` | 5 | `vo_char_4051_00_64_hca.hca` | 3.00s | 2.74s | -0.26s |
| `405300` | Hayate Yagami | `group_28` | 5 | `vo_char_4053_00_35_hca.hca` | 10.50s | 10.76s | +0.26s |
| `100352` | Tsuruno Yui | `group_33` | 7 | `vo_char_1003_52_41_hca.hca` | 14.00s | 13.73s | -0.27s |
| `100900` | Rena Minami | `group_33` | 7 | `vo_char_1009_00_41_hca.hca` | 14.00s | 13.73s | -0.27s |
| `101100` | Kaede Akino | `group_39` | 4 | `vo_char_1011_00_63_hca.hca` | 4.00s | 3.73s | -0.27s |
| `101100` | Kaede Akino | `group_4` | 3 | `vo_char_1011_00_05_hca.hca` | 6.50s | 6.23s | -0.27s |
| `101100` | Kaede Akino | `group_7` | 5 | `vo_char_1011_00_15_hca.hca` | 8.00s | 7.73s | -0.27s |
| `101150` | Kaede Akino | `group_39` | 3 | `vo_char_1011_00_63_hca.hca` | 4.00s | 3.73s | -0.27s |
| `101150` | Kaede Akino | `group_4` | 2 | `vo_char_1011_00_05_hca.hca` | 6.50s | 6.23s | -0.27s |
| `101150` | Kaede Akino | `group_7` | 4 | `vo_char_1011_00_15_hca.hca` | 8.00s | 7.73s | -0.27s |
| `101152` | Kaede Akino | `group_39` | 2 | `vo_char_1011_00_63_hca.hca` | 4.00s | 3.73s | -0.27s |
| `101152` | Kaede Akino | `group_7` | 3 | `vo_char_1011_00_15_hca.hca` | 8.00s | 7.73s | -0.27s |
| `101250` | Karin Misono | `group_18` | 4 | `vo_char_1012_50_26_hca.hca` | 12.20s | 11.93s | -0.27s |
| `101300` | Asuka Tatsuki | `group_25` | 6 | `vo_char_1013_00_33_hca.hca` | 9.50s | 9.77s | +0.27s |
| `101400` | Nemu Hiiragi | `group_21` | 6 | `vo_char_1014_00_28_hca.hca` | 15.30s | 15.57s | +0.27s |
| `101450` | Nemu Hiiragi | `group_21` | 6 | `vo_char_1014_50_28_hca.hca` | 20.10s | 19.83s | -0.27s |
| `101750` | Mitama Yakumo | `group_16` | 4 | `vo_char_1017_50_24_hca.hca` | 14.50s | 14.23s | -0.27s |
| `102300` | Ao Kasane | `group_40` | 4 | `vo_game_0402_01_hca.hca` | 10.40s | 10.13s | -0.27s |
| `102350` | Ao Kasane | `group_40` | 3 | `vo_game_0402_01_hca.hca` | 10.40s | 10.13s | -0.27s |
| `102900` | Shigure Miyabi | `group_39` | 2 | `vo_char_1029_00_46_hca.hca` | 3.00s | 2.73s | -0.27s |
| `103050` | Hagumu Azumi | `group_23` | 3 | `vo_char_1030_50_30_hca.hca` | 10.00s | 9.73s | -0.27s |
| `103550` | Alexandra Kurusu | `group_21` | 4 | `vo_char_1035_50_28_hca.hca` | 13.30s | 13.03s | -0.27s |
| `104100` | Livia Medeiros | `group_24` | 4 | `vo_char_1041_00_31_hca.hca` | 12.80s | 12.53s | -0.27s |
| `105300` | Amaryllis | `group_32` | 4 | `vo_char_1053_00_39_hca.hca` | 12.10s | 11.83s | -0.27s |
| `110100` | Iroha Tamaki | `group_38` | 3 | `vo_char_1101_00_46_hca.hca` | 4.00s | 3.73s | -0.27s |
| `110100` | Iroha Tamaki | `group_41` | 2 | `vo_char_1101_00_65_hca.hca` | 3.00s | 2.73s | -0.27s |
| `110700` | Touka & Nemu | `group_23` | 5 | `vo_char_1107_00_30_hca.hca` | 12.00s | 11.73s | -0.27s |
| `111200` | Karin & Alina | `group_2` | 6 | `vo_char_1112_00_02_hca.hca` | 12.80s | 12.53s | -0.27s |
| `111200` | Karin & Alina | `group_22` | 6 | `vo_char_1112_00_29_hca.hca` | 15.20s | 14.93s | -0.27s |
| `111201` | Karin & Alina | `group_2` | 5 | `vo_char_1112_00_02_hca.hca` | 12.80s | 12.53s | -0.27s |
| `111202` | Karin & Alina | `group_2` | 5 | `vo_char_1112_00_02_hca.hca` | 12.80s | 12.53s | -0.27s |
| `111600` | Kanagi Izumi | `group_34` | 7 | `vo_char_1116_00_41_hca.hca` | 14.90s | 14.63s | -0.27s |
| `111700` | Mitama Yakumo | `group_49` | 4 | `vo_game_0102_09_hca.hca` | 12.40s | 12.13s | -0.27s |
| `113300` | Rabi Himuro | `group_32` | 4 | `vo_char_1133_00_39_hca.hca` | 16.30s | 16.03s | -0.27s |
| `180100` | Iroha & Kuroe | `group_24` | 4 | `vo_char_1801_00_31_hca.hca` | 12.30s | 12.03s | -0.27s |
| `200602` | Kyoko Sakura | `group_24` | 6 | `vo_char_2006_02_32_hca.hca` | 14.10s | 13.83s | -0.27s |
| `200651` | Kyoko Sakura | `group_21` | 4 | `vo_char_2006_51_29_hca.hca` | 11.70s | 11.97s | +0.27s |
| `200700` | Nagisa Momoe | `group_10` | 7 | `vo_char_2007_00_17_hca.hca` | 12.30s | 12.03s | -0.27s |
| `200700` | Nagisa Momoe | `group_36` | 5 | `vo_char_2007_00_43_hca.hca` | 4.60s | 4.87s | +0.27s |
| `250000` | Holy Mami | `group_27` | 4 | `vo_char_2500_00_35_hca.hca` | 11.00s | 10.73s | -0.27s |
| `300300` | Hinano Miyako | `group_39` | 4 | `vo_char_3003_00_63_hca.hca` | 4.00s | 4.27s | +0.27s |
| `300351` | Hinano Miyako | `group_39` | 3 | `vo_char_3003_00_63_hca.hca` | 4.00s | 4.27s | +0.27s |
| `300500` | Nanaka Tokiwa | `group_10` | 7 | `vo_char_3005_00_18_hca.hca` | 12.00s | 11.73s | -0.27s |
| `300600` | Emiri Kisaki | `group_25` | 7 | `vo_char_3006_00_33_hca.hca` | 13.50s | 13.23s | -0.27s |
| `300700` | Shizuku Hozumi | `group_29` | 6 | `vo_char_3007_00_37_hca.hca` | 13.00s | 12.73s | -0.27s |
| `300700` | Shizuku Hozumi | `group_6` | 4 | `vo_char_3007_00_14_hca.hca` | 5.50s | 5.77s | +0.27s |
| `300750` | Shizuku Hozumi | `group_6` | 2 | `vo_char_3007_00_14_hca.hca` | 5.50s | 5.77s | +0.27s |
| `300900` | Manaka Kurumi | `group_12` | 5 | `vo_char_3009_00_20_hca.hca` | 4.50s | 4.77s | +0.27s |
| `300900` | Manaka Kurumi | `group_2` | 5 | `vo_char_3009_00_03_hca.hca` | 4.00s | 3.73s | -0.27s |
| `301100` | Kako Natsume | `group_42` | 4 | `vo_char_3011_00_66_hca.hca` | 3.50s | 3.23s | -0.27s |
| `301150` | Kako Natsume | `group_31` | 5 | `vo_char_3011_50_39_hca.hca` | 13.30s | 13.03s | -0.27s |
| `301150` | Kako Natsume | `group_42` | 2 | `vo_char_3011_00_66_hca.hca` | 3.50s | 3.23s | -0.27s |
| `301151` | Kako Natsume | `group_42` | 2 | `vo_char_3011_00_66_hca.hca` | 3.50s | 3.23s | -0.27s |
| `301400` | Seika Kumi | `group_18` | 5 | `vo_char_3014_00_26_hca.hca` | 12.00s | 11.73s | -0.27s |
| `301900` | Ayaka Mariko | `group_21` | 5 | `vo_char_3019_00_29_hca.hca` | 10.00s | 10.27s | +0.27s |
| `302500` | Ren Isuzu | `group_21` | 5 | `vo_char_3025_00_29_hca.hca` | 16.00s | 15.73s | -0.27s |
| `302551` | Ren Isuzu | `group_16` | 6 | `vo_char_3025_51_24_hca.hca` | 20.00s | 19.73s | -0.27s |
| `302700` | Hazuki Yusa | `group_28` | 5 | `vo_char_3027_00_36_hca.hca` | 14.00s | 13.73s | -0.27s |
| `302800` | Ayame Mikuri | `group_43` | 7 | `vo_char_3028_00_02_hca.hca` | 13.50s | 13.23s | -0.27s |
| `303100` | Rika Ayano | `group_41` | 4 | `vo_char_3031_00_65_hca.hca` | 3.50s | 3.23s | -0.27s |
| `303300` | Sayuki Fumino | `group_16` | 5 | `vo_char_3033_00_23_hca.hca` | 20.00s | 19.73s | -0.27s |
| `303350` | Sayuki Fumino | `group_16` | 4 | `vo_char_3033_00_23_hca.hca` | 20.00s | 19.73s | -0.27s |
| `304300` | Eternal Sakura | `group_38` | 2 | `vo_char_3043_00_45_hca.hca` | 4.00s | 3.73s | -0.27s |
| `305400` | Mitsune Miwa | `group_38` | 2 | `vo_char_3054_00_45_hca.hca` | 4.00s | 3.73s | -0.27s |
| `350401` | Masara & Kokoro | `group_24` | 4 | `vo_char_3504_01_31_hca.hca` | 13.20s | 12.93s | -0.27s |
| `390201` | Shi | `group_26` | 4 | `vo_char_3902_01_33_hca.hca` | 11.70s | 11.43s | -0.27s |
| `400100` | Oriko Mikuni | `group_15` | 10 | `vo_char_4001_00_23_hca.hca` | 23.50s | 23.23s | -0.27s |
| `400300` | Yuma Chitose | `group_1` | 14 | `vo_char_4003_00_01_hca.hca` | 24.00s | 23.73s | -0.27s |
| `400300` | Yuma Chitose | `group_28` | 6 | `vo_char_4003_00_36_hca.hca` | 9.50s | 9.23s | -0.27s |
| `400300` | Yuma Chitose | `group_4` | 3 | `vo_char_4003_00_05_hca.hca` | 4.50s | 4.23s | -0.27s |
| `402100` | Tart | `group_1` | 8 | `vo_char_4021_00_01_hca.hca` | 22.00s | 21.73s | -0.27s |
| `402100` | Tart | `group_9` | 4 | `vo_char_4021_00_17_hca.hca` | 12.00s | 11.73s | -0.27s |
| `402150` | Tart | `group_1` | 6 | `vo_char_4021_00_01_hca.hca` | 22.00s | 21.73s | -0.27s |
| `402150` | Tart | `group_9` | 2 | `vo_char_4021_00_17_hca.hca` | 12.00s | 11.73s | -0.27s |
| `402200` | Riz | `group_19` | 6 | `vo_char_4022_00_27_hca.hca` | 15.00s | 14.73s | -0.27s |
| `402500` | Corbeau | `group_8` | 3 | `vo_char_4025_00_15_hca.hca` | 6.20s | 5.93s | -0.27s |
| `402600` | Elisa | `group_32` | 6 | `vo_char_4026_00_39_hca.hca` | 15.20s | 14.93s | -0.27s |
| `404500` | Tsubasa Hanekawa | `group_21` | 3 | `vo_char_4045_00_28_hca.hca` | 13.40s | 13.13s | -0.27s |
| `404500` | Tsubasa Hanekawa | `group_4` | 2 | `vo_char_4045_00_04_hca.hca` | 5.00s | 4.73s | -0.27s |
| `405100` | Nanoha Takamachi | `group_14` | 6 | `vo_char_4051_00_21_hca.hca` | 11.50s | 11.23s | -0.27s |
| `405100` | Nanoha Takamachi | `group_21` | 5 | `vo_char_4051_00_28_hca.hca` | 10.00s | 9.73s | -0.27s |
| `100100` | Iroha Tamaki | `group_38` | 4 | `vo_char_1001_00_46_hca.hca` | 3.50s | 3.78s | +0.28s |
| `100103` | Iroha Tamaki | `group_38` | 4 | `vo_char_1001_00_46_hca.hca` | 3.50s | 3.78s | +0.28s |
| `100150` | Iroha Tamaki | `group_38` | 3 | `vo_char_1001_00_46_hca.hca` | 3.50s | 3.78s | +0.28s |
| `100153` | Iroha Tamaki | `group_38` | 3 | `vo_char_1001_00_46_hca.hca` | 3.50s | 3.78s | +0.28s |
| `100350` | Tsuruno Yui | `group_33` | 9 | `vo_char_1003_50_41_hca.hca` | 15.50s | 15.22s | -0.28s |
| `100352` | Tsuruno Yui | `group_25` | 6 | `vo_char_1003_52_33_hca.hca` | 16.00s | 15.72s | -0.28s |
| `100600` | Mifuyu Azusa | `group_22` | 3 | `vo_char_1006_00_30_hca.hca` | 11.20s | 10.92s | -0.28s |
| `100800` | Alina Gray | `group_10` | 5 | `vo_char_1008_00_18_hca.hca` | 12.00s | 11.72s | -0.28s |
| `100800` | Alina Gray | `group_24` | 4 | `vo_char_1008_00_32_hca.hca` | 11.00s | 10.72s | -0.28s |
| `100850` | Alina Gray | `group_10` | 4 | `vo_char_1008_00_18_hca.hca` | 12.00s | 11.72s | -0.28s |
| `100850` | Alina Gray | `group_30` | 4 | `vo_char_1008_50_38_hca.hca` | 12.50s | 12.22s | -0.28s |
| `100851` | Alina Gray | `group_24` | 2 | `vo_char_1008_51_32_hca.hca` | 11.00s | 10.72s | -0.28s |
| `101000` | Momoko Togame | `group_4` | 3 | `vo_char_1010_00_05_hca.hca` | 6.50s | 6.22s | -0.28s |
| `101051` | Momoko Togame | `group_27` | 4 | `vo_char_1010_51_35_hca.hca` | 12.00s | 11.72s | -0.28s |
| `101051` | Momoko Togame | `group_4` | 2 | `vo_char_1010_00_05_hca.hca` | 6.50s | 6.22s | -0.28s |
| `101300` | Asuka Tatsuki | `group_39` | 5 | `vo_char_1013_00_63_hca.hca` | 4.50s | 4.22s | -0.28s |
| `101300` | Asuka Tatsuki | `group_41` | 4 | `vo_char_1013_00_65_hca.hca` | 3.50s | 3.22s | -0.28s |
| `101550` | Ui Tamaki | `group_30` | 5 | `vo_char_1015_50_37_hca.hca` | 12.00s | 11.72s | -0.28s |
| `101550` | Ui Tamaki | `group_32` | 5 | `vo_char_1015_50_39_hca.hca` | 10.00s | 9.72s | -0.28s |
| `102900` | Shigure Miyabi | `group_26` | 5 | `vo_char_1029_00_33_hca.hca` | 18.00s | 17.72s | -0.28s |
| `103100` | San Kagura | `group_15` | 7 | `vo_char_1031_00_22_hca.hca` | 21.10s | 21.38s | +0.28s |
| `103150` | San Kagura | `group_15` | 6 | `vo_char_1031_00_22_hca.hca` | 21.10s | 21.38s | +0.28s |
| `103200` | Miyuri Yukari | `group_22` | 3 | `vo_char_1032_00_29_hca.hca` | 8.30s | 8.02s | -0.28s |
| `103300` | Rabi Himuro | `group_11` | 8 | `vo_char_1033_00_18_hca.hca` | 18.60s | 18.32s | -0.28s |
| `103350` | Rabi Himuro | `group_11` | 7 | `vo_char_1033_00_18_hca.hca` | 18.60s | 18.32s | -0.28s |
| `103550` | Alexandra Kurusu | `group_34` | 7 | `vo_char_1035_50_41_hca.hca` | 17.20s | 17.48s | +0.28s |
| `103902` | Sudachi Sawa | `group_21` | 5 | `vo_char_1039_02_28_hca.hca` | 8.90s | 8.62s | -0.28s |
| `103902` | Sudachi Sawa | `group_26` | 5 | `vo_char_1039_02_33_hca.hca` | 10.30s | 10.02s | -0.28s |
| `103903` | Sudachi Sawa | `group_21` | 5 | `vo_char_1039_03_28_hca.hca` | 8.90s | 8.62s | -0.28s |
| `103903` | Sudachi Sawa | `group_26` | 5 | `vo_char_1039_03_33_hca.hca` | 10.30s | 10.02s | -0.28s |
| `104051` | Yozuru Sasame | `group_23` | 6 | `vo_char_1040_51_30_hca.hca` | 13.70s | 13.42s | -0.28s |
| `104400` | Mikoto Sena | `group_16` | 4 | `vo_char_1044_00_23_hca.hca` | 18.50s | 18.22s | -0.28s |
| `104600` | Chizuru | `group_24` | 6 | `vo_char_1046_00_31_hca.hca` | 13.90s | 13.62s | -0.28s |
| `104600` | Chizuru | `group_32` | 7 | `vo_char_1046_00_39_hca.hca` | 15.10s | 14.82s | -0.28s |
| `110700` | Touka & Nemu | `group_28` | 4 | `vo_char_1107_00_35_hca.hca` | 16.20s | 15.92s | -0.28s |
| `110701` | Touka & Nemu | `group_26` | 6 | `vo_char_1107_01_33_hca.hca` | 13.60s | 13.32s | -0.28s |
| `111000` | Momoko Togame | `group_17` | 6 | `vo_char_1110_00_24_hca.hca` | 12.20s | 11.92s | -0.28s |
| `111000` | Momoko Togame | `group_19` | 8 | `vo_char_1110_00_26_hca.hca` | 13.60s | 13.88s | +0.28s |
| `111000` | Momoko Togame | `group_21` | 8 | `vo_char_1110_00_28_hca.hca` | 14.10s | 14.38s | +0.28s |
| `111200` | Karin & Alina | `group_21` | 4 | `vo_char_1112_00_28_hca.hca` | 13.00s | 12.72s | -0.28s |
| `113300` | Rabi Himuro | `group_25` | 5 | `vo_char_1133_00_32_hca.hca` | 17.40s | 17.12s | -0.28s |
| `130102` | Iroha & Yachiyo | `group_20` | 7 | `vo_char_1301_02_27_hca.hca` | 12.80s | 12.52s | -0.28s |
| `200200` | Homura Akemi | `group_13` | 3 | `vo_char_2002_00_20_hca.hca` | 5.05s | 4.77s | -0.28s |
| `200600` | Kyoko Sakura | `group_41` | 4 | `vo_char_2006_00_65_hca.hca` | 4.00s | 3.72s | -0.28s |
| `200602` | Kyoko Sakura | `group_41` | 3 | `vo_char_2006_00_65_hca.hca` | 4.00s | 3.72s | -0.28s |
| `200650` | Kyoko Sakura | `group_41` | 2 | `vo_char_2006_00_65_hca.hca` | 4.00s | 3.72s | -0.28s |
| `200900` | Mabayu Aki | `group_22` | 5 | `vo_char_2009_00_29_hca.hca` | 11.90s | 12.18s | +0.28s |
| `240000` | Sayaka Miki | `group_22` | 8 | `vo_char_2400_00_29_hca.hca` | 13.00s | 12.72s | -0.28s |
| `240000` | Sayaka Miki | `group_25` | 4 | `vo_char_2400_00_32_hca.hca` | 10.00s | 10.28s | +0.28s |
| `250000` | Holy Mami | `group_32` | 6 | `vo_char_2500_00_40_hca.hca` | 11.00s | 10.72s | -0.28s |
| `250100` | Mami Tomoe | `group_9` | 5 | `vo_char_2501_00_16_hca.hca` | 14.50s | 14.22s | -0.28s |
| `260000` | Kyoko Sakura | `group_22` | 6 | `vo_char_2600_00_29_hca.hca` | 11.70s | 11.98s | +0.28s |
| `260000` | Kyoko Sakura | `group_43` | 3 | `vo_char_2600_00_66_hca.hca` | 3.00s | 2.72s | -0.28s |
| `300351` | Hinano Miyako | `group_20` | 4 | `vo_char_3003_51_28_hca.hca` | 13.00s | 12.72s | -0.28s |
| `300400` | Sasara Minagi | `group_43` | 5 | `vo_char_3004_00_02_hca.hca` | 11.00s | 10.72s | -0.28s |
| `300500` | Nanaka Tokiwa | `group_24` | 6 | `vo_char_3005_00_32_hca.hca` | 10.50s | 10.22s | -0.28s |
| `300700` | Shizuku Hozumi | `group_17` | 6 | `vo_char_3007_00_25_hca.hca` | 6.70s | 6.98s | +0.28s |
| `300700` | Shizuku Hozumi | `group_34` | 3 | `vo_char_3007_00_42_hca.hca` | 3.50s | 3.22s | -0.28s |
| `300800` | Akira Shinobu | `group_7` | 6 | `vo_char_3008_00_15_hca.hca` | 7.00s | 6.72s | -0.28s |
| `300850` | Akira Shinobu | `group_7` | 3 | `vo_char_3008_00_15_hca.hca` | 7.00s | 6.72s | -0.28s |
| `301100` | Kako Natsume | `group_23` | 9 | `vo_char_3011_00_31_hca.hca` | 12.00s | 12.28s | +0.28s |
| `301150` | Kako Natsume | `group_30` | 6 | `vo_char_3011_50_38_hca.hca` | 13.60s | 13.32s | -0.28s |
| `301500` | Mito Aino | `group_25` | 7 | `vo_char_3015_00_33_hca.hca` | 16.80s | 16.52s | -0.28s |
| `301600` | Kokoro Awane | `group_8` | 5 | `vo_char_3016_00_16_hca.hca` | 10.10s | 9.82s | -0.28s |
| `301650` | Kokoro Awane | `group_8` | 4 | `vo_char_3016_00_16_hca.hca` | 10.10s | 9.82s | -0.28s |
| `302551` | Ren Isuzu | `group_22` | 6 | `vo_char_3025_51_30_hca.hca` | 18.50s | 18.78s | +0.28s |
| `302600` | Konoha Shizumi | `group_10` | 5 | `vo_char_3026_00_18_hca.hca` | 15.00s | 14.72s | -0.28s |
| `302700` | Hazuki Yusa | `group_24` | 5 | `vo_char_3027_00_32_hca.hca` | 13.00s | 12.72s | -0.28s |
| `302700` | Hazuki Yusa | `group_9` | 5 | `vo_char_3027_00_17_hca.hca` | 14.00s | 13.72s | -0.28s |
| `303250` | Mayu Kozue | `group_30` | 5 | `vo_char_3032_50_38_hca.hca` | 20.00s | 19.72s | -0.28s |
| `304400` | Ranka Chizu | `group_31` | 4 | `vo_char_3044_00_38_hca.hca` | 10.90s | 10.62s | -0.28s |
| `304400` | Ranka Chizu | `group_32` | 5 | `vo_char_3044_00_39_hca.hca` | 13.61s | 13.33s | -0.28s |
| `304650` | Ryo Midori | `group_19` | 4 | `vo_char_3046_50_26_hca.hca` | 10.80s | 11.08s | +0.28s |
| `304650` | Ryo Midori | `group_23` | 6 | `vo_char_3046_50_30_hca.hca` | 12.50s | 12.22s | -0.28s |
| `305900` | Kushu Irina | `group_36` | 2 | `vo_char_3059_00_43_hca.hca` | 5.00s | 4.72s | -0.28s |
| `350100` | Rika & Ren | `group_32` | 7 | `vo_char_3501_00_39_hca.hca` | 13.60s | 13.32s | -0.28s |
| `390200` | Shi | `group_14` | 6 | `vo_char_3902_00_21_hca.hca` | 15.00s | 14.72s | -0.28s |
| `400200` | Kirika Kure | `group_16` | 5 | `vo_char_4002_00_24_hca.hca` | 12.50s | 12.22s | -0.28s |
| `400300` | Yuma Chitose | `group_42` | 5 | `vo_char_4003_00_66_hca.hca` | 4.00s | 3.72s | -0.28s |
| `402100` | Tart | `group_34` | 4 | `vo_char_4021_00_42_hca.hca` | 3.00s | 2.72s | -0.28s |
| `402150` | Tart | `group_34` | 2 | `vo_char_4021_00_42_hca.hca` | 3.00s | 2.72s | -0.28s |
| `402300` | Melissa | `group_23` | 5 | `vo_char_4023_00_31_hca.hca` | 11.00s | 10.72s | -0.28s |
| `402500` | Corbeau | `group_12` | 4 | `vo_char_4025_00_19_hca.hca` | 8.00s | 7.72s | -0.28s |
| `404400` | Nadeko Sengoku | `group_1` | 5 | `vo_char_4044_00_01_hca.hca` | 25.20s | 24.92s | -0.28s |
| `404400` | Nadeko Sengoku | `group_32` | 2 | `vo_char_4044_00_40_hca.hca` | 11.90s | 11.62s | -0.28s |
| `405200` | Fate | `group_10` | 5 | `vo_char_4052_00_17_hca.hca` | 8.00s | 7.72s | -0.28s |
| `405300` | Hayate Yagami | `group_24` | 5 | `vo_char_4053_00_31_hca.hca` | 6.50s | 6.22s | -0.28s |
| `100350` | Tsuruno Yui | `group_26` | 5 | `vo_char_1003_50_34_hca.hca` | 9.00s | 8.71s | -0.29s |
| `100400` | Sana Futaba | `group_2` | 4 | `vo_char_1004_00_03_hca.hca` | 6.00s | 5.71s | -0.29s |
| `100402` | Sana Futaba | `group_2` | 2 | `vo_char_1004_00_03_hca.hca` | 6.00s | 5.71s | -0.29s |
| `100451` | Sana Futaba | `group_2` | 3 | `vo_char_1004_00_03_hca.hca` | 6.00s | 5.71s | -0.29s |
| `100750` | Touka Satomi | `group_17` | 7 | `vo_char_1007_50_24_hca.hca` | 14.00s | 13.71s | -0.29s |
| `100800` | Alina Gray | `group_18` | 5 | `vo_char_1008_00_26_hca.hca` | 13.00s | 12.71s | -0.29s |
| `100851` | Alina Gray | `group_18` | 4 | `vo_char_1008_51_26_hca.hca` | 13.00s | 12.71s | -0.29s |
| `101000` | Momoko Togame | `group_32` | 7 | `vo_char_1010_00_40_hca.hca` | 13.50s | 13.21s | -0.29s |
| `102200` | Hikaru Kirari | `group_26` | 4 | `vo_char_1022_00_33_hca.hca` | 11.60s | 11.31s | -0.29s |
| `102200` | Hikaru Kirari | `group_30` | 6 | `vo_char_1022_00_37_hca.hca` | 8.70s | 8.99s | +0.29s |
| `102850` | Himena Aika | `group_22` | 4 | `vo_char_1028_50_29_hca.hca` | 10.00s | 9.71s | -0.29s |
| `103200` | Miyuri Yukari | `group_7` | 3 | `vo_char_1032_00_14_hca.hca` | 5.20s | 4.91s | -0.29s |
| `104600` | Chizuru | `group_39` | 2 | `vo_char_1046_00_46_hca.hca` | 3.00s | 2.71s | -0.29s |
| `104900` | Olga | `group_4` | 2 | `vo_char_1049_00_04_hca.hca` | 6.80s | 6.51s | -0.29s |
| `110500` | Felicia-chan | `group_15` | 6 | `vo_char_1105_00_22_hca.hca` | 17.80s | 17.51s | -0.29s |
| `111201` | Karin & Alina | `group_20` | 6 | `vo_char_1112_01_27_hca.hca` | 14.50s | 14.21s | -0.29s |
| `111800` | Amane Sisters | `group_11` | 5 | `vo_char_1118_00_18_hca.hca` | 16.00s | 16.29s | +0.29s |
| `111801` | Amane Sisters | `group_11` | 5 | `vo_char_1118_00_18_hca.hca` | 16.00s | 16.29s | +0.29s |
| `111802` | Amane Sisters | `group_11` | 5 | `vo_char_1118_00_18_hca.hca` | 16.00s | 16.29s | +0.29s |
| `114400` | Uwasa Mikoto | `group_2` | 6 | `vo_char_1144_00_02_hca.hca` | 17.40s | 17.69s | +0.29s |
| `120100` | Iroha-chan | `group_35` | 2 | `vo_char_1201_00_42_hca.hca` | 4.00s | 3.71s | -0.29s |
| `130102` | Iroha & Yachiyo | `group_25` | 4 | `vo_char_1301_02_32_hca.hca` | 11.20s | 10.91s | -0.29s |
| `200600` | Kyoko Sakura | `group_23` | 6 | `vo_char_2006_00_31_hca.hca` | 11.00s | 10.71s | -0.29s |
| `210000` | Madoka Kaname | `group_34` | 2 | `vo_char_2100_00_42_hca.hca` | 3.00s | 2.71s | -0.29s |
| `210200` | Madoka-senpai | `group_15` | 6 | `vo_char_2102_00_23_hca.hca` | 14.00s | 13.71s | -0.29s |
| `210251` | Madoka-senpai | `group_15` | 4 | `vo_char_2102_00_23_hca.hca` | 14.00s | 13.71s | -0.29s |
| `250001` | Holy Mami | `group_27` | 5 | `vo_char_2500_01_35_hca.hca` | 14.00s | 13.71s | -0.29s |
| `300300` | Hinano Miyako | `group_37` | 3 | `vo_char_3003_00_45_hca.hca` | 2.00s | 2.29s | +0.29s |
| `300351` | Hinano Miyako | `group_37` | 2 | `vo_char_3003_00_45_hca.hca` | 2.00s | 2.29s | +0.29s |
| `300500` | Nanaka Tokiwa | `group_32` | 7 | `vo_char_3005_00_40_hca.hca` | 14.50s | 14.21s | -0.29s |
| `300700` | Shizuku Hozumi | `group_20` | 7 | `vo_char_3007_00_28_hca.hca` | 7.50s | 7.21s | -0.29s |
| `300750` | Shizuku Hozumi | `group_30` | 3 | `vo_char_3007_50_38_hca.hca` | 12.00s | 11.71s | -0.29s |
| `300800` | Akira Shinobu | `group_21` | 12 | `vo_char_3008_00_29_hca.hca` | 12.50s | 12.21s | -0.29s |
| `301600` | Kokoro Awane | `group_11` | 5 | `vo_char_3016_00_19_hca.hca` | 10.20s | 9.91s | -0.29s |
| `301650` | Kokoro Awane | `group_11` | 4 | `vo_char_3016_00_19_hca.hca` | 10.20s | 9.91s | -0.29s |
| `302100` | Sakuya Suzuka | `group_13` | 3 | `vo_char_3021_00_20_hca.hca` | 7.20s | 7.49s | +0.29s |
| `302950` | Masara Kagami | `group_30` | 4 | `vo_char_3029_50_38_hca.hca` | 12.00s | 11.71s | -0.29s |
| `303551` | Riko Chiaki | `group_38` | 2 | `vo_char_3035_00_46_hca.hca` | 4.00s | 4.29s | +0.29s |
| `303700` | Mel Anna | `group_30` | 5 | `vo_char_3037_00_38_hca.hca` | 18.00s | 17.71s | -0.29s |
| `303751` | Mel Anna | `group_17` | 4 | `vo_char_3037_51_25_hca.hca` | 24.50s | 24.21s | -0.29s |
| `304300` | Eternal Sakura | `group_10` | 4 | `vo_char_3043_00_17_hca.hca` | 17.00s | 16.71s | -0.29s |
| `304300` | Eternal Sakura | `group_15` | 7 | `vo_char_3043_00_22_hca.hca` | 26.50s | 26.21s | -0.29s |
| `304651` | Ryo Midori | `group_18` | 7 | `vo_char_3046_51_25_hca.hca` | 16.00s | 16.29s | +0.29s |
| `304651` | Ryo Midori | `group_33` | 4 | `vo_char_3046_51_40_hca.hca` | 12.00s | 11.71s | -0.29s |
| `350100` | Rika & Ren | `group_20` | 7 | `vo_char_3501_00_27_hca.hca` | 14.00s | 13.71s | -0.29s |
| `350100` | Rika & Ren | `group_35` | 3 | `vo_char_3501_00_42_hca.hca` | 4.00s | 3.71s | -0.29s |
| `401100` | Kazumi | `group_4` | 4 | `vo_char_4011_00_05_hca.hca` | 5.00s | 4.71s | -0.29s |
| `402200` | Riz | `group_12` | 4 | `vo_char_4022_00_20_hca.hca` | 5.00s | 4.71s | -0.29s |
| `402200` | Riz | `group_3` | 3 | `vo_char_4022_00_04_hca.hca` | 4.00s | 3.71s | -0.29s |
| `402250` | Riz | `group_12` | 2 | `vo_char_4022_00_20_hca.hca` | 5.00s | 4.71s | -0.29s |
| `402300` | Melissa | `group_14` | 8 | `vo_char_4023_00_22_hca.hca` | 19.90s | 19.61s | -0.29s |
| `402350` | Melissa | `group_14` | 6 | `vo_char_4023_00_22_hca.hca` | 19.90s | 19.61s | -0.29s |
| `402600` | Elisa | `group_13` | 3 | `vo_char_4026_00_20_hca.hca` | 5.50s | 5.21s | -0.29s |
| `402650` | Elisa | `group_13` | 2 | `vo_char_4026_00_20_hca.hca` | 5.50s | 5.21s | -0.29s |
| `404500` | Tsubasa Hanekawa | `group_40` | 2 | `vo_char_4045_00_63_hca.hca` | 5.15s | 4.86s | -0.29s |
| `100352` | Tsuruno Yui | `group_32` | 8 | `vo_char_1003_52_40_hca.hca` | 14.70s | 14.40s | -0.30s |
| `100700` | Touka Satomi | `group_31` | 4 | `vo_char_1007_00_38_hca.hca` | 12.00s | 11.70s | -0.30s |
| `100800` | Alina Gray | `group_39` | 3 | `vo_char_1008_00_63_hca.hca` | 4.00s | 3.70s | -0.30s |
| `100850` | Alina Gray | `group_39` | 2 | `vo_char_1008_00_63_hca.hca` | 4.00s | 3.70s | -0.30s |
| `100900` | Rena Minami | `group_25` | 8 | `vo_char_1009_00_33_hca.hca` | 10.00s | 9.70s | -0.30s |
| `101100` | Kaede Akino | `group_1` | 14 | `vo_char_1011_00_01_hca.hca` | 34.00s | 33.70s | -0.30s |
| `101150` | Kaede Akino | `group_1` | 13 | `vo_char_1011_00_01_hca.hca` | 34.00s | 33.70s | -0.30s |
| `101150` | Kaede Akino | `group_24` | 5 | `vo_char_1011_50_32_hca.hca` | 14.30s | 14.00s | -0.30s |
| `101152` | Kaede Akino | `group_1` | 12 | `vo_char_1011_00_01_hca.hca` | 34.00s | 33.70s | -0.30s |
| `101250` | Karin Misono | `group_30` | 4 | `vo_char_1012_50_38_hca.hca` | 14.00s | 13.70s | -0.30s |
| `101300` | Asuka Tatsuki | `group_34` | 3 | `vo_char_1013_00_42_hca.hca` | 2.00s | 1.70s | -0.30s |
| `101300` | Asuka Tatsuki | `group_6` | 5 | `vo_char_1013_00_14_hca.hca` | 4.50s | 4.80s | +0.30s |
| `101400` | Nemu Hiiragi | `group_9` | 5 | `vo_char_1014_00_16_hca.hca` | 18.30s | 18.00s | -0.30s |
| `101450` | Nemu Hiiragi | `group_9` | 5 | `vo_char_1014_00_16_hca.hca` | 18.30s | 18.00s | -0.30s |
| `101850` | Tsukuyo Amane | `group_19` | 4 | `vo_char_1018_50_27_hca.hca` | 16.00s | 15.70s | -0.30s |
| `101900` | Tsukasa Amane | `group_31` | 4 | `vo_char_1019_00_39_hca.hca` | 11.00s | 10.70s | -0.30s |
| `101900` | Tsukasa Amane | `group_33` | 4 | `vo_char_1019_00_41_hca.hca` | 10.00s | 9.70s | -0.30s |
| `102200` | Hikaru Kirari | `group_7` | 3 | `vo_char_1022_00_14_hca.hca` | 5.50s | 5.20s | -0.30s |
| `102200` | Hikaru Kirari | `group_9` | 4 | `vo_char_1022_00_16_hca.hca` | 10.70s | 11.00s | +0.30s |
| `102250` | Hikaru Kirari | `group_7` | 2 | `vo_char_1022_00_14_hca.hca` | 5.50s | 5.20s | -0.30s |
| `102250` | Hikaru Kirari | `group_9` | 3 | `vo_char_1022_00_16_hca.hca` | 10.70s | 11.00s | +0.30s |
| `102850` | Himena Aika | `group_26` | 6 | `vo_char_1028_50_33_hca.hca` | 14.00s | 13.70s | -0.30s |
| `102900` | Shigure Miyabi | `group_15` | 7 | `vo_char_1029_00_22_hca.hca` | 25.50s | 25.20s | -0.30s |
| `102950` | Shigure Miyabi | `group_15` | 6 | `vo_char_1029_00_22_hca.hca` | 25.50s | 25.20s | -0.30s |
| `102950` | Shigure Miyabi | `group_27` | 5 | `vo_char_1029_50_34_hca.hca` | 14.00s | 13.70s | -0.30s |
| `104400` | Mikoto Sena | `group_6` | 2 | `vo_char_1044_00_13_hca.hca` | 4.70s | 4.40s | -0.30s |
| `104600` | Chizuru | `group_28` | 4 | `vo_char_1046_00_35_hca.hca` | 11.20s | 10.90s | -0.30s |
| `104900` | Olga | `group_1` | 10 | `vo_char_1049_00_01_hca.hca` | 23.80s | 24.10s | +0.30s |
| `110400` | Uwasa Sana | `group_7` | 3 | `vo_char_1104_00_14_hca.hca` | 6.00s | 5.70s | -0.30s |
| `110400` | Uwasa Sana | `group_19` | 6 | `vo_char_1104_00_26_hca.hca` | 14.70s | 14.40s | -0.30s |
| `110500` | Felicia-chan | `group_27` | 4 | `vo_char_1105_00_34_hca.hca` | 14.90s | 14.60s | -0.30s |
| `110701` | Touka & Nemu | `group_34` | 4 | `vo_char_1107_01_41_hca.hca` | 13.60s | 13.30s | -0.30s |
| `111200` | Karin & Alina | `group_5` | 2 | `vo_char_1112_00_05_hca.hca` | 4.40s | 4.10s | -0.30s |
| `111600` | Kanagi Izumi | `group_7` | 5 | `vo_char_1116_00_14_hca.hca` | 6.50s | 6.20s | -0.30s |
| `111800` | Amane Sisters | `group_16` | 6 | `vo_char_1118_00_23_hca.hca` | 19.80s | 19.50s | -0.30s |
| `111800` | Amane Sisters | `group_35` | 3 | `vo_char_1118_00_42_hca.hca` | 4.00s | 3.70s | -0.30s |
| `111801` | Amane Sisters | `group_16` | 6 | `vo_char_1118_00_23_hca.hca` | 19.80s | 19.50s | -0.30s |
| `111801` | Amane Sisters | `group_35` | 3 | `vo_char_1118_00_42_hca.hca` | 4.00s | 3.70s | -0.30s |
| `111802` | Amane Sisters | `group_16` | 6 | `vo_char_1118_00_23_hca.hca` | 19.80s | 19.50s | -0.30s |
| `111802` | Amane Sisters | `group_35` | 3 | `vo_char_1118_00_42_hca.hca` | 4.00s | 3.70s | -0.30s |
| `113300` | Rabi Himuro | `group_15` | 7 | `vo_char_1133_00_22_hca.hca` | 30.10s | 30.40s | +0.30s |
| `120900` | Rena & Kaede | `group_23` | 5 | `vo_char_1209_00_30_hca.hca` | 13.50s | 13.20s | -0.30s |
| `120902` | Rena & Kaede | `group_23` | 5 | `vo_char_1209_02_30_hca.hca` | 14.70s | 14.40s | -0.30s |
| `180100` | Iroha & Kuroe | `group_19` | 6 | `vo_char_1801_00_26_hca.hca` | 16.10s | 15.80s | -0.30s |
| `200200` | Homura Akemi | `group_10` | 4 | `vo_char_2002_00_17_hca.hca` | 14.40s | 14.10s | -0.30s |
| `200700` | Nagisa Momoe | `group_5` | 3 | `vo_char_2007_00_05_hca.hca` | 5.30s | 5.00s | -0.30s |
| `250000` | Holy Mami | `group_12` | 3 | `vo_char_2500_00_20_hca.hca` | 7.00s | 6.70s | -0.30s |
| `250001` | Holy Mami | `group_12` | 3 | `vo_char_2500_00_20_hca.hca` | 7.00s | 6.70s | -0.30s |
| `260200` | Kyoko Sakura | `group_11` | 5 | `vo_char_2602_00_18_hca.hca` | 14.20s | 13.90s | -0.30s |
| `260200` | Kyoko Sakura | `group_38` | 2 | `vo_char_2602_00_45_hca.hca` | 3.00s | 2.70s | -0.30s |
| `300300` | Hinano Miyako | `group_25` | 5 | `vo_char_3003_00_33_hca.hca` | 10.00s | 9.70s | -0.30s |
| `300500` | Nanaka Tokiwa | `group_22` | 6 | `vo_char_3005_00_30_hca.hca` | 13.50s | 13.20s | -0.30s |
| `300800` | Akira Shinobu | `group_43` | 8 | `vo_char_3008_00_02_hca.hca` | 11.30s | 11.00s | -0.30s |
| `300850` | Akira Shinobu | `group_43` | 5 | `vo_char_3008_00_02_hca.hca` | 11.30s | 11.00s | -0.30s |
| `300900` | Manaka Kurumi | `group_3` | 5 | `vo_char_3009_00_04_hca.hca` | 5.50s | 5.20s | -0.30s |
| `300900` | Manaka Kurumi | `group_36` | 3 | `vo_char_3009_00_44_hca.hca` | 2.50s | 2.20s | -0.30s |
| `301051` | Ria Ami | `group_22` | 6 | `vo_char_3010_51_30_hca.hca` | 14.00s | 13.70s | -0.30s |
| `301100` | Kako Natsume | `group_34` | 3 | `vo_char_3011_00_42_hca.hca` | 3.00s | 2.70s | -0.30s |
| `301950` | Ayaka Mariko | `group_22` | 3 | `vo_char_3019_50_30_hca.hca` | 11.20s | 10.90s | -0.30s |
| `302000` | Himika Mao | `group_35` | 4 | `vo_char_3020_00_43_hca.hca` | 2.50s | 2.20s | -0.30s |
| `302000` | Himika Mao | `group_43` | 7 | `vo_char_3020_00_02_hca.hca` | 11.10s | 10.80s | -0.30s |
| `302300` | Aimi Eri | `group_19` | 5 | `vo_char_3023_00_27_hca.hca` | 9.00s | 8.70s | -0.30s |
| `302300` | Aimi Eri | `group_42` | 3 | `vo_char_3023_00_66_hca.hca` | 4.00s | 3.70s | -0.30s |
| `302600` | Konoha Shizumi | `group_37` | 3 | `vo_char_3026_00_45_hca.hca` | 3.00s | 2.70s | -0.30s |
| `302950` | Masara Kagami | `group_28` | 5 | `vo_char_3029_50_36_hca.hca` | 15.20s | 14.90s | -0.30s |
| `303300` | Sayuki Fumino | `group_20` | 5 | `vo_char_3033_00_27_hca.hca` | 15.80s | 15.50s | -0.30s |
| `303300` | Sayuki Fumino | `group_26` | 5 | `vo_char_3033_00_33_hca.hca` | 15.00s | 15.30s | +0.30s |
| `303300` | Sayuki Fumino | `group_3` | 4 | `vo_char_3033_00_03_hca.hca` | 9.70s | 9.40s | -0.30s |
| `303350` | Sayuki Fumino | `group_3` | 3 | `vo_char_3033_00_03_hca.hca` | 9.70s | 9.40s | -0.30s |
| `303400` | Moka Megumi | `group_38` | 2 | `vo_char_3034_00_45_hca.hca` | 3.00s | 2.70s | -0.30s |
| `303500` | Riko Chiaki | `group_18` | 7 | `vo_char_3035_00_25_hca.hca` | 11.20s | 10.90s | -0.30s |
| `304800` | Hotaru Yura | `group_20` | 4 | `vo_char_3048_00_27_hca.hca` | 13.30s | 13.00s | -0.30s |
| `304900` | Kanae Yukino | `group_29` | 4 | `vo_char_3049_00_37_hca.hca` | 11.00s | 10.70s | -0.30s |
| `304900` | Kanae Yukino | `group_3` | 3 | `vo_char_3049_00_04_hca.hca` | 5.00s | 4.70s | -0.30s |
| `304900` | Kanae Yukino | `group_34` | 2 | `vo_char_3049_00_42_hca.hca` | 4.00s | 3.70s | -0.30s |
| `304900` | Kanae Yukino | `group_8` | 3 | `vo_char_3049_00_16_hca.hca` | 8.00s | 7.70s | -0.30s |
| `304950` | Kanae Yukino | `group_21` | 6 | `vo_char_3049_50_29_hca.hca` | 14.80s | 14.50s | -0.30s |
| `304950` | Kanae Yukino | `group_3` | 2 | `vo_char_3049_00_04_hca.hca` | 5.00s | 4.70s | -0.30s |
| `304950` | Kanae Yukino | `group_8` | 2 | `vo_char_3049_00_16_hca.hca` | 8.00s | 7.70s | -0.30s |
| `305000` | Yuuna Kaharu | `group_10` | 4 | `vo_char_3050_00_17_hca.hca` | 12.00s | 11.70s | -0.30s |
| `305100` | Jun Kazari | `group_11` | 4 | `vo_char_3051_00_18_hca.hca` | 11.70s | 11.40s | -0.30s |
| `390201` | Shi | `group_21` | 6 | `vo_char_3902_01_28_hca.hca` | 15.90s | 15.60s | -0.30s |
| `400200` | Kirika Kure | `group_6` | 6 | `vo_char_4002_00_14_hca.hca` | 7.50s | 7.20s | -0.30s |
| `401200` | Umika Misaki | `group_22` | 5 | `vo_char_4012_00_30_hca.hca` | 13.00s | 12.70s | -0.30s |
| `402200` | Riz | `group_2` | 3 | `vo_char_4022_00_03_hca.hca` | 3.00s | 2.70s | -0.30s |
| `402250` | Riz | `group_25` | 8 | `vo_char_4022_50_33_hca.hca` | 15.10s | 14.80s | -0.30s |
| `402300` | Melissa | `group_24` | 5 | `vo_char_4023_00_32_hca.hca` | 10.50s | 10.20s | -0.30s |
| `402600` | Elisa | `group_4` | 3 | `vo_char_4026_00_04_hca.hca` | 2.90s | 2.60s | -0.30s |
| `402650` | Elisa | `group_21` | 5 | `vo_char_4026_50_28_hca.hca` | 15.00s | 14.70s | -0.30s |
| `402650` | Elisa | `group_4` | 2 | `vo_char_4026_00_04_hca.hca` | 2.90s | 2.60s | -0.30s |
| `404400` | Nadeko Sengoku | `group_18` | 2 | `vo_char_4044_00_26_hca.hca` | 10.80s | 10.50s | -0.30s |
| `100250` | Yachiyo Nanami | `group_26` | 4 | `vo_char_1002_50_34_hca.hca` | 12.50s | 12.19s | -0.31s |
| `100350` | Tsuruno Yui | `group_22` | 4 | `vo_char_1003_50_30_hca.hca` | 10.00s | 9.69s | -0.31s |
| `100402` | Sana Futaba | `group_28` | 4 | `vo_char_1004_02_36_hca.hca` | 12.30s | 11.99s | -0.31s |
| `101100` | Kaede Akino | `group_8` | 6 | `vo_char_1011_00_16_hca.hca` | 14.50s | 14.19s | -0.31s |
| `101150` | Kaede Akino | `group_8` | 5 | `vo_char_1011_00_16_hca.hca` | 14.50s | 14.19s | -0.31s |
| `101152` | Kaede Akino | `group_8` | 4 | `vo_char_1011_00_16_hca.hca` | 14.50s | 14.19s | -0.31s |
| `101300` | Asuka Tatsuki | `group_31` | 6 | `vo_char_1013_00_39_hca.hca` | 12.50s | 12.19s | -0.31s |
| `101651` | Kanagi Izumi | `group_17` | 3 | `vo_char_1016_51_25_hca.hca` | 11.00s | 10.69s | -0.31s |
| `101651` | Kanagi Izumi | `group_23` | 3 | `vo_char_1016_51_31_hca.hca` | 11.00s | 10.69s | -0.31s |
| `101750` | Mitama Yakumo | `group_50` | 5 | `vo_game_1002_10_hca.hca` | 13.20s | 12.89s | -0.31s |
| `101900` | Tsukasa Amane | `group_41` | 3 | `vo_char_1019_00_65_hca.hca` | 3.00s | 2.69s | -0.31s |
| `101951` | Tsukasa Amane | `group_41` | 2 | `vo_char_1019_00_65_hca.hca` | 3.00s | 2.69s | -0.31s |
| `102350` | Ao Kasane | `group_45` | 6 | `vo_game_0402_09_hca.hca` | 11.80s | 12.11s | +0.31s |
| `102900` | Shigure Miyabi | `group_29` | 4 | `vo_char_1029_00_36_hca.hca` | 11.00s | 10.69s | -0.31s |
| `102950` | Shigure Miyabi | `group_21` | 4 | `vo_char_1029_50_28_hca.hca` | 16.30s | 15.99s | -0.31s |
| `105300` | Amaryllis | `group_31` | 5 | `vo_char_1053_00_38_hca.hca` | 11.60s | 11.29s | -0.31s |
| `110400` | Uwasa Sana | `group_31` | 5 | `vo_char_1104_00_38_hca.hca` | 13.30s | 13.61s | +0.31s |
| `110700` | Touka & Nemu | `group_1` | 10 | `vo_char_1107_00_01_hca.hca` | 28.15s | 27.84s | -0.31s |
| `110701` | Touka & Nemu | `group_1` | 8 | `vo_char_1107_00_01_hca.hca` | 28.15s | 27.84s | -0.31s |
| `110702` | Touka & Nemu | `group_1` | 8 | `vo_char_1107_00_01_hca.hca` | 28.15s | 27.84s | -0.31s |
| `111000` | Momoko Togame | `group_9` | 7 | `vo_char_1110_00_16_hca.hca` | 15.10s | 14.79s | -0.31s |
| `111200` | Karin & Alina | `group_4` | 3 | `vo_char_1112_00_04_hca.hca` | 5.10s | 4.79s | -0.31s |
| `111201` | Karin & Alina | `group_4` | 2 | `vo_char_1112_00_04_hca.hca` | 5.10s | 4.79s | -0.31s |
| `111202` | Karin & Alina | `group_4` | 2 | `vo_char_1112_00_04_hca.hca` | 5.10s | 4.79s | -0.31s |
| `113300` | Rabi Himuro | `group_20` | 5 | `vo_char_1133_00_27_hca.hca` | 19.60s | 19.29s | -0.31s |
| `120100` | Iroha-chan | `group_4` | 2 | `vo_char_1201_00_04_hca.hca` | 6.50s | 6.19s | -0.31s |
| `180101` | Iroha & Kuroe | `group_23` | 5 | `vo_char_1801_01_30_hca.hca` | 10.90s | 10.59s | -0.31s |
| `200400` | Sayaka Miki | `group_35` | 4 | `vo_char_2004_00_43_hca.hca` | 3.00s | 2.69s | -0.31s |
| `200451` | Sayaka Miki | `group_35` | 2 | `vo_char_2004_00_43_hca.hca` | 3.00s | 2.69s | -0.31s |
| `210251` | Madoka-senpai | `group_27` | 5 | `vo_char_2102_51_35_hca.hca` | 13.30s | 12.99s | -0.31s |
| `250100` | Mami Tomoe | `group_32` | 5 | `vo_char_2501_00_39_hca.hca` | 13.80s | 13.49s | -0.31s |
| `260200` | Kyoko Sakura | `group_34` | 6 | `vo_char_2602_00_41_hca.hca` | 11.00s | 10.69s | -0.31s |
| `300300` | Hinano Miyako | `group_32` | 6 | `vo_char_3003_00_40_hca.hca` | 11.50s | 11.19s | -0.31s |
| `300600` | Emiri Kisaki | `group_39` | 5 | `vo_char_3006_00_63_hca.hca` | 4.00s | 3.69s | -0.31s |
| `300651` | Emiri Kisaki | `group_30` | 5 | `vo_char_3006_51_38_hca.hca` | 10.00s | 9.69s | -0.31s |
| `300651` | Emiri Kisaki | `group_39` | 3 | `vo_char_3006_00_63_hca.hca` | 4.00s | 3.69s | -0.31s |
| `300750` | Shizuku Hozumi | `group_20` | 4 | `vo_char_3007_50_28_hca.hca` | 13.00s | 12.69s | -0.31s |
| `301100` | Kako Natsume | `group_40` | 4 | `vo_char_3011_00_64_hca.hca` | 3.50s | 3.19s | -0.31s |
| `301100` | Kako Natsume | `group_6` | 6 | `vo_char_3011_00_14_hca.hca` | 8.00s | 7.69s | -0.31s |
| `301150` | Kako Natsume | `group_40` | 2 | `vo_char_3011_00_64_hca.hca` | 3.50s | 3.19s | -0.31s |
| `301150` | Kako Natsume | `group_6` | 4 | `vo_char_3011_00_14_hca.hca` | 8.00s | 7.69s | -0.31s |
| `301151` | Kako Natsume | `group_40` | 2 | `vo_char_3011_00_64_hca.hca` | 3.50s | 3.19s | -0.31s |
| `301151` | Kako Natsume | `group_6` | 4 | `vo_char_3011_00_14_hca.hca` | 8.00s | 7.69s | -0.31s |
| `301300` | Leila Ibuki | `group_14` | 7 | `vo_char_3013_00_22_hca.hca` | 16.30s | 15.99s | -0.31s |
| `301650` | Kokoro Awane | `group_23` | 5 | `vo_char_3016_50_31_hca.hca` | 14.50s | 14.19s | -0.31s |
| `301950` | Ayaka Mariko | `group_18` | 4 | `vo_char_3019_50_26_hca.hca` | 9.90s | 9.59s | -0.31s |
| `302800` | Ayame Mikuri | `group_17` | 8 | `vo_char_3028_00_25_hca.hca` | 13.30s | 12.99s | -0.31s |
| `302800` | Ayame Mikuri | `group_25` | 9 | `vo_char_3028_00_33_hca.hca` | 10.50s | 10.19s | -0.31s |
| `302900` | Masara Kagami | `group_6` | 3 | `vo_char_3029_00_14_hca.hca` | 8.00s | 7.69s | -0.31s |
| `303100` | Rika Ayano | `group_3` | 6 | `vo_char_3031_00_04_hca.hca` | 4.50s | 4.19s | -0.31s |
| `303100` | Rika Ayano | `group_4` | 6 | `vo_char_3031_00_05_hca.hca` | 7.00s | 6.69s | -0.31s |
| `303300` | Sayuki Fumino | `group_24` | 5 | `vo_char_3033_00_31_hca.hca` | 14.00s | 13.69s | -0.31s |
| `303551` | Riko Chiaki | `group_29` | 5 | `vo_char_3035_51_37_hca.hca` | 11.80s | 11.49s | -0.31s |
| `304650` | Ryo Midori | `group_27` | 5 | `vo_char_3046_50_34_hca.hca` | 11.40s | 11.09s | -0.31s |
| `304800` | Hotaru Yura | `group_3` | 3 | `vo_char_3048_00_03_hca.hca` | 7.80s | 7.49s | -0.31s |
| `305400` | Mitsune Miwa | `group_18` | 6 | `vo_char_3054_00_25_hca.hca` | 19.00s | 18.69s | -0.31s |
| `350401` | Masara & Kokoro | `group_7` | 2 | `vo_char_3504_00_14_hca.hca` | 4.90s | 4.59s | -0.31s |
| `350402` | Masara & Kokoro | `group_7` | 2 | `vo_char_3504_00_14_hca.hca` | 4.90s | 4.59s | -0.31s |
| `400100` | Oriko Mikuni | `group_9` | 5 | `vo_char_4001_00_17_hca.hca` | 11.50s | 11.19s | -0.31s |
| `400300` | Yuma Chitose | `group_35` | 4 | `vo_char_4003_00_43_hca.hca` | 3.00s | 2.69s | -0.31s |
| `402100` | Tart | `group_39` | 3 | `vo_char_4021_00_63_hca.hca` | 4.00s | 3.69s | -0.31s |
| `402200` | Riz | `group_20` | 5 | `vo_char_4022_00_28_hca.hca` | 13.00s | 12.69s | -0.31s |
| `402500` | Corbeau | `group_9` | 4 | `vo_char_4025_00_16_hca.hca` | 13.30s | 12.99s | -0.31s |
| `402700` | Lapin | `group_23` | 5 | `vo_char_4027_00_30_hca.hca` | 10.90s | 10.59s | -0.31s |
| `404600` | Shinobu Oshino | `group_29` | 4 | `vo_char_4046_00_36_hca.hca` | 9.50s | 9.81s | +0.31s |
| `405100` | Nanoha Takamachi | `group_3` | 4 | `vo_char_4051_00_03_hca.hca` | 6.00s | 5.69s | -0.31s |
| `405200` | Fate | `group_31` | 7 | `vo_char_4052_00_38_hca.hca` | 14.30s | 13.99s | -0.31s |
| `405300` | Hayate Yagami | `group_20` | 5 | `vo_char_4053_00_27_hca.hca` | 7.00s | 6.69s | -0.31s |
| `100251` | Yachiyo Nanami | `group_29` | 4 | `vo_char_1002_51_37_hca.hca` | 12.00s | 11.68s | -0.32s |
| `100651` | Mifuyu Azusa | `group_19` | 5 | `vo_char_1006_51_27_hca.hca` | 11.20s | 10.88s | -0.32s |
| `100750` | Touka Satomi | `group_29` | 6 | `vo_char_1007_50_36_hca.hca` | 15.00s | 15.32s | +0.32s |
| `100800` | Alina Gray | `group_35` | 3 | `vo_char_1008_00_43_hca.hca` | 3.00s | 2.68s | -0.32s |
| `100850` | Alina Gray | `group_35` | 2 | `vo_char_1008_00_43_hca.hca` | 3.00s | 2.68s | -0.32s |
| `100900` | Rena Minami | `group_24` | 8 | `vo_char_1009_00_32_hca.hca` | 12.00s | 11.68s | -0.32s |
| `101100` | Kaede Akino | `group_35` | 3 | `vo_char_1011_00_43_hca.hca` | 3.50s | 3.18s | -0.32s |
| `101150` | Kaede Akino | `group_35` | 2 | `vo_char_1011_00_43_hca.hca` | 3.50s | 3.18s | -0.32s |
| `101300` | Asuka Tatsuki | `group_15` | 12 | `vo_char_1013_00_23_hca.hca` | 18.00s | 18.32s | +0.32s |
| `101300` | Asuka Tatsuki | `group_2` | 5 | `vo_char_1013_00_03_hca.hca` | 5.00s | 4.68s | -0.32s |
| `101751` | Mitama Yakumo | `group_52` | 3 | `vo_game_0802_12_hca.hca` | 7.20s | 6.88s | -0.32s |
| `101850` | Tsukuyo Amane | `group_27` | 3 | `vo_char_1018_50_35_hca.hca` | 16.00s | 15.68s | -0.32s |
| `102100` | Yuna Kureha | `group_42` | 6 | `vo_game_0602_03_hca.hca` | 12.20s | 11.88s | -0.32s |
| `102200` | Hikaru Kirari | `group_4` | 2 | `vo_char_1022_00_04_hca.hca` | 4.00s | 3.68s | -0.32s |
| `102250` | Hikaru Kirari | `group_4` | 2 | `vo_char_1022_00_04_hca.hca` | 4.00s | 3.68s | -0.32s |
| `102300` | Ao Kasane | `group_47` | 6 | `vo_game_0402_11_hca.hca` | 13.00s | 13.32s | +0.32s |
| `102350` | Ao Kasane | `group_47` | 6 | `vo_game_0402_11_hca.hca` | 13.00s | 13.32s | +0.32s |
| `102600` | Chiharu Hiroe | `group_9` | 5 | `vo_char_1026_00_16_hca.hca` | 11.70s | 11.38s | -0.32s |
| `102650` | Chiharu Hiroe | `group_9` | 4 | `vo_char_1026_00_16_hca.hca` | 11.70s | 11.38s | -0.32s |
| `102651` | Chiharu Hiroe | `group_9` | 4 | `vo_char_1026_00_16_hca.hca` | 11.70s | 11.38s | -0.32s |
| `102800` | Himena Aika | `group_11` | 4 | `vo_char_1028_00_18_hca.hca` | 10.40s | 10.08s | -0.32s |
| `102850` | Himena Aika | `group_11` | 3 | `vo_char_1028_00_18_hca.hca` | 10.40s | 10.08s | -0.32s |
| `103200` | Miyuri Yukari | `group_26` | 5 | `vo_char_1032_00_33_hca.hca` | 14.50s | 14.18s | -0.32s |
| `104300` | Kuroe | `group_30` | 5 | `vo_char_1043_00_37_hca.hca` | 15.50s | 15.18s | -0.32s |
| `105300` | Amaryllis | `group_4` | 2 | `vo_char_1053_00_04_hca.hca` | 4.20s | 3.88s | -0.32s |
| `105302` | Amaryllis | `group_4` | 2 | `vo_char_1053_00_04_hca.hca` | 4.20s | 3.88s | -0.32s |
| `111000` | Momoko Togame | `group_22` | 6 | `vo_char_1110_00_29_hca.hca` | 11.90s | 11.58s | -0.32s |
| `111000` | Momoko Togame | `group_5` | 3 | `vo_char_1110_00_05_hca.hca` | 5.20s | 4.88s | -0.32s |
| `120900` | Rena & Kaede | `group_14` | 5 | `vo_char_1209_00_21_hca.hca` | 12.10s | 11.78s | -0.32s |
| `120901` | Rena & Kaede | `group_14` | 4 | `vo_char_1209_00_21_hca.hca` | 12.10s | 11.78s | -0.32s |
| `120902` | Rena & Kaede | `group_14` | 4 | `vo_char_1209_00_21_hca.hca` | 12.10s | 11.78s | -0.32s |
| `200200` | Homura Akemi | `group_6` | 2 | `vo_char_2002_00_13_hca.hca` | 5.60s | 5.28s | -0.32s |
| `240000` | Sayaka Miki | `group_17` | 6 | `vo_char_2400_00_24_hca.hca` | 14.00s | 13.68s | -0.32s |
| `250000` | Holy Mami | `group_42` | 2 | `vo_char_2500_00_66_hca.hca` | 3.00s | 2.68s | -0.32s |
| `250001` | Holy Mami | `group_42` | 2 | `vo_char_2500_00_66_hca.hca` | 3.00s | 2.68s | -0.32s |
| `260000` | Kyoko Sakura | `group_26` | 6 | `vo_char_2600_00_33_hca.hca` | 15.00s | 14.68s | -0.32s |
| `260200` | Kyoko Sakura | `group_18` | 5 | `vo_char_2602_00_25_hca.hca` | 12.60s | 12.28s | -0.32s |
| `300300` | Hinano Miyako | `group_2` | 4 | `vo_char_3003_00_03_hca.hca` | 5.00s | 4.68s | -0.32s |
| `300351` | Hinano Miyako | `group_2` | 3 | `vo_char_3003_00_03_hca.hca` | 5.00s | 4.68s | -0.32s |
| `300600` | Emiri Kisaki | `group_42` | 5 | `vo_char_3006_00_66_hca.hca` | 3.50s | 3.18s | -0.32s |
| `300600` | Emiri Kisaki | `group_9` | 10 | `vo_char_3006_00_17_hca.hca` | 14.00s | 13.68s | -0.32s |
| `300651` | Emiri Kisaki | `group_42` | 3 | `vo_char_3006_00_66_hca.hca` | 3.50s | 3.18s | -0.32s |
| `300651` | Emiri Kisaki | `group_9` | 8 | `vo_char_3006_00_17_hca.hca` | 14.00s | 13.68s | -0.32s |
| `300850` | Akira Shinobu | `group_20` | 7 | `vo_char_3008_50_28_hca.hca` | 17.00s | 16.68s | -0.32s |
| `301100` | Kako Natsume | `group_11` | 4 | `vo_char_3011_00_19_hca.hca` | 6.00s | 5.68s | -0.32s |
| `301150` | Kako Natsume | `group_11` | 2 | `vo_char_3011_00_19_hca.hca` | 6.00s | 5.68s | -0.32s |
| `301151` | Kako Natsume | `group_11` | 2 | `vo_char_3011_00_19_hca.hca` | 6.00s | 5.68s | -0.32s |
| `301151` | Kako Natsume | `group_17` | 7 | `vo_char_3011_51_25_hca.hca` | 23.00s | 22.68s | -0.32s |
| `301500` | Mito Aino | `group_34` | 3 | `vo_char_3015_00_42_hca.hca` | 2.00s | 1.68s | -0.32s |
| `302700` | Hazuki Yusa | `group_35` | 4 | `vo_char_3027_00_43_hca.hca` | 4.00s | 3.68s | -0.32s |
| `302900` | Masara Kagami | `group_17` | 4 | `vo_char_3029_00_25_hca.hca` | 12.00s | 11.68s | -0.32s |
| `303100` | Rika Ayano | `group_5` | 6 | `vo_char_3031_00_13_hca.hca` | 5.50s | 5.18s | -0.32s |
| `303400` | Moka Megumi | `group_6` | 2 | `vo_char_3034_00_13_hca.hca` | 4.00s | 3.68s | -0.32s |
| `304700` | Chika Aoba | `group_19` | 4 | `vo_char_3047_00_26_hca.hca` | 12.30s | 11.98s | -0.32s |
| `350402` | Masara & Kokoro | `group_30` | 6 | `vo_char_3504_02_37_hca.hca` | 18.60s | 18.28s | -0.32s |
| `390200` | Shi | `group_15` | 7 | `vo_char_3902_00_22_hca.hca` | 28.50s | 28.82s | +0.32s |
| `390201` | Shi | `group_24` | 5 | `vo_char_3902_01_31_hca.hca` | 14.40s | 14.08s | -0.32s |
| `400100` | Oriko Mikuni | `group_42` | 4 | `vo_char_4001_00_66_hca.hca` | 4.50s | 4.18s | -0.32s |
| `400200` | Kirika Kure | `group_41` | 4 | `vo_char_4002_00_65_hca.hca` | 4.00s | 3.68s | -0.32s |
| `400300` | Yuma Chitose | `group_38` | 5 | `vo_char_4003_00_46_hca.hca` | 3.50s | 3.18s | -0.32s |
| `400400` | Oriko Mikuni | `group_36` | 2 | `vo_char_4004_00_43_hca.hca` | 3.00s | 2.68s | -0.32s |
| `401200` | Umika Misaki | `group_26` | 6 | `vo_char_4012_00_34_hca.hca` | 13.00s | 12.68s | -0.32s |
| `404600` | Shinobu Oshino | `group_6` | 2 | `vo_char_4046_00_13_hca.hca` | 6.40s | 6.08s | -0.32s |
| `405100` | Nanoha Takamachi | `group_37` | 4 | `vo_char_4051_00_44_hca.hca` | 3.50s | 3.18s | -0.32s |
| `405300` | Hayate Yagami | `group_13` | 4 | `vo_char_4053_00_20_hca.hca` | 4.80s | 4.48s | -0.32s |
| `100100` | Iroha Tamaki | `group_40` | 4 | `vo_char_1001_00_64_hca.hca` | 4.50s | 4.17s | -0.33s |
| `100103` | Iroha Tamaki | `group_40` | 4 | `vo_char_1001_00_64_hca.hca` | 4.50s | 4.17s | -0.33s |
| `100150` | Iroha Tamaki | `group_24` | 4 | `vo_char_1001_50_32_hca.hca` | 12.00s | 11.67s | -0.33s |
| `100150` | Iroha Tamaki | `group_40` | 3 | `vo_char_1001_00_64_hca.hca` | 4.50s | 4.17s | -0.33s |
| `100153` | Iroha Tamaki | `group_40` | 3 | `vo_char_1001_00_64_hca.hca` | 4.50s | 4.17s | -0.33s |
| `100350` | Tsuruno Yui | `group_16` | 6 | `vo_char_1003_50_24_hca.hca` | 11.50s | 11.17s | -0.33s |
| `100400` | Sana Futaba | `group_25` | 9 | `vo_char_1004_00_33_hca.hca` | 22.50s | 22.17s | -0.33s |
| `100651` | Mifuyu Azusa | `group_16` | 5 | `vo_char_1006_51_24_hca.hca` | 12.40s | 12.07s | -0.33s |
| `100950` | Rena Minami | `group_31` | 5 | `vo_char_1009_50_39_hca.hca` | 13.00s | 12.67s | -0.33s |
| `100951` | Rena Minami | `group_18` | 7 | `vo_char_1009_51_26_hca.hca` | 15.50s | 15.17s | -0.33s |
| `101000` | Momoko Togame | `group_30` | 8 | `vo_char_1010_00_38_hca.hca` | 11.00s | 10.67s | -0.33s |
| `101750` | Mitama Yakumo | `group_30` | 4 | `vo_char_1017_50_38_hca.hca` | 12.50s | 12.17s | -0.33s |
| `102200` | Hikaru Kirari | `group_40` | 4 | `vo_game_0302_01_hca.hca` | 7.40s | 7.07s | -0.33s |
| `102250` | Hikaru Kirari | `group_40` | 3 | `vo_game_0302_01_hca.hca` | 7.40s | 7.07s | -0.33s |
| `102600` | Chiharu Hiroe | `group_31` | 5 | `vo_char_1026_00_38_hca.hca` | 11.00s | 10.67s | -0.33s |
| `102950` | Shigure Miyabi | `group_25` | 3 | `vo_char_1029_50_32_hca.hca` | 15.00s | 14.67s | -0.33s |
| `103300` | Rabi Himuro | `group_26` | 5 | `vo_char_1033_00_33_hca.hca` | 16.80s | 16.47s | -0.33s |
| `103500` | Alexandra Kurusu | `group_32` | 4 | `vo_char_1035_00_39_hca.hca` | 12.00s | 11.67s | -0.33s |
| `103600` | Urara Yume | `group_10` | 7 | `vo_char_1036_00_17_hca.hca` | 11.20s | 10.87s | -0.33s |
| `104100` | Livia Medeiros | `group_16` | 7 | `vo_char_1041_00_23_hca.hca` | 18.90s | 19.23s | +0.33s |
| `104300` | Kuroe | `group_15` | 6 | `vo_char_1043_00_22_hca.hca` | 19.20s | 18.87s | -0.33s |
| `105300` | Amaryllis | `group_7` | 4 | `vo_char_1053_00_14_hca.hca` | 6.30s | 5.97s | -0.33s |
| `105302` | Amaryllis | `group_7` | 3 | `vo_char_1053_00_14_hca.hca` | 6.30s | 5.97s | -0.33s |
| `110701` | Touka & Nemu | `group_24` | 5 | `vo_char_1107_01_31_hca.hca` | 14.60s | 14.27s | -0.33s |
| `110702` | Touka & Nemu | `group_27` | 4 | `vo_char_1107_02_34_hca.hca` | 19.80s | 19.47s | -0.33s |
| `111800` | Amane Sisters | `group_8` | 2 | `vo_char_1118_00_15_hca.hca` | 5.00s | 4.67s | -0.33s |
| `111801` | Amane Sisters | `group_34` | 6 | `vo_char_1118_01_41_hca.hca` | 17.50s | 17.83s | +0.33s |
| `111801` | Amane Sisters | `group_8` | 2 | `vo_char_1118_00_15_hca.hca` | 5.00s | 4.67s | -0.33s |
| `111802` | Amane Sisters | `group_8` | 2 | `vo_char_1118_00_15_hca.hca` | 5.00s | 4.67s | -0.33s |
| `120100` | Iroha-chan | `group_33` | 3 | `vo_char_1201_00_40_hca.hca` | 9.90s | 9.57s | -0.33s |
| `130100` | Iroha & Yachiyo | `group_24` | 6 | `vo_char_1301_00_31_hca.hca` | 13.00s | 12.67s | -0.33s |
| `200151` | Madoka Kaname | `group_26` | 7 | `vo_char_2001_51_34_hca.hca` | 13.20s | 12.87s | -0.33s |
| `200700` | Nagisa Momoe | `group_8` | 4 | `vo_char_2007_00_15_hca.hca` | 6.50s | 6.17s | -0.33s |
| `250000` | Holy Mami | `group_6` | 3 | `vo_char_2500_00_14_hca.hca` | 7.00s | 6.67s | -0.33s |
| `250001` | Holy Mami | `group_6` | 3 | `vo_char_2500_00_14_hca.hca` | 7.00s | 6.67s | -0.33s |
| `300700` | Shizuku Hozumi | `group_32` | 7 | `vo_char_3007_00_40_hca.hca` | 13.50s | 13.17s | -0.33s |
| `300850` | Akira Shinobu | `group_23` | 7 | `vo_char_3008_50_31_hca.hca` | 14.30s | 13.97s | -0.33s |
| `301051` | Ria Ami | `group_29` | 4 | `vo_char_3010_51_37_hca.hca` | 11.20s | 10.87s | -0.33s |
| `301400` | Seika Kumi | `group_9` | 4 | `vo_char_3014_00_17_hca.hca` | 11.00s | 10.67s | -0.33s |
| `302600` | Konoha Shizumi | `group_27` | 5 | `vo_char_3026_00_35_hca.hca` | 13.00s | 12.67s | -0.33s |
| `303200` | Mayu Kozue | `group_27` | 6 | `vo_char_3032_00_35_hca.hca` | 14.00s | 13.67s | -0.33s |
| `303400` | Moka Megumi | `group_2` | 5 | `vo_char_3034_00_02_hca.hca` | 11.00s | 10.67s | -0.33s |
| `303400` | Moka Megumi | `group_3` | 3 | `vo_char_3034_00_03_hca.hca` | 5.30s | 4.97s | -0.33s |
| `303700` | Mel Anna | `group_31` | 4 | `vo_char_3037_00_39_hca.hca` | 11.00s | 10.67s | -0.33s |
| `304750` | Chika Aoba | `group_26` | 5 | `vo_char_3047_50_34_hca.hca` | 12.80s | 12.47s | -0.33s |
| `304800` | Hotaru Yura | `group_22` | 6 | `vo_char_3048_00_29_hca.hca` | 19.30s | 18.97s | -0.33s |
| `304900` | Kanae Yukino | `group_17` | 3 | `vo_char_3049_00_25_hca.hca` | 11.00s | 10.67s | -0.33s |
| `305100` | Jun Kazari | `group_14` | 4 | `vo_char_3051_00_21_hca.hca` | 10.60s | 10.27s | -0.33s |
| `350100` | Rika & Ren | `group_10` | 5 | `vo_char_3501_00_17_hca.hca` | 12.00s | 11.67s | -0.33s |
| `350400` | Masara & Kokoro | `group_15` | 7 | `vo_char_3504_00_22_hca.hca` | 17.80s | 17.47s | -0.33s |
| `350401` | Masara & Kokoro | `group_15` | 6 | `vo_char_3504_00_22_hca.hca` | 17.80s | 17.47s | -0.33s |
| `350402` | Masara & Kokoro | `group_15` | 6 | `vo_char_3504_00_22_hca.hca` | 17.80s | 17.47s | -0.33s |
| `390200` | Shi | `group_27` | 6 | `vo_char_3902_00_34_hca.hca` | 17.40s | 17.73s | +0.33s |
| `400100` | Oriko Mikuni | `group_19` | 7 | `vo_char_4001_00_27_hca.hca` | 13.00s | 12.67s | -0.33s |
| `400100` | Oriko Mikuni | `group_2` | 4 | `vo_char_4001_00_03_hca.hca` | 7.00s | 6.67s | -0.33s |
| `400200` | Kirika Kure | `group_19` | 6 | `vo_char_4002_00_27_hca.hca` | 14.00s | 13.67s | -0.33s |
| `401100` | Kazumi | `group_18` | 7 | `vo_char_4011_00_26_hca.hca` | 15.00s | 14.67s | -0.33s |
| `401100` | Kazumi | `group_39` | 4 | `vo_char_4011_00_63_hca.hca` | 4.00s | 3.67s | -0.33s |
| `401200` | Umika Misaki | `group_38` | 3 | `vo_char_4012_00_46_hca.hca` | 2.00s | 1.67s | -0.33s |
| `402100` | Tart | `group_7` | 3 | `vo_char_4021_00_15_hca.hca` | 5.00s | 4.67s | -0.33s |
| `402300` | Melissa | `group_13` | 4 | `vo_char_4023_00_21_hca.hca` | 10.00s | 9.67s | -0.33s |
| `402350` | Melissa | `group_13` | 2 | `vo_char_4023_00_21_hca.hca` | 10.00s | 9.67s | -0.33s |
| `402600` | Elisa | `group_22` | 4 | `vo_char_4026_00_29_hca.hca` | 12.00s | 11.67s | -0.33s |
| `404300` | Suruga Kanbaru | `group_23` | 3 | `vo_char_4043_00_30_hca.hca` | 10.05s | 9.72s | -0.33s |
| `405100` | Nanoha Takamachi | `group_23` | 4 | `vo_char_4051_00_30_hca.hca` | 5.50s | 5.17s | -0.33s |
| `405300` | Hayate Yagami | `group_11` | 8 | `vo_char_4053_00_18_hca.hca` | 12.00s | 12.33s | +0.33s |
| `100351` | Tsuruno Yui | `group_16` | 7 | `vo_char_1003_51_24_hca.hca` | 14.50s | 14.16s | -0.34s |
| `100351` | Tsuruno Yui | `group_33` | 8 | `vo_char_1003_51_41_hca.hca` | 14.50s | 14.16s | -0.34s |
| `100650` | Mifuyu Azusa | `group_18` | 5 | `vo_char_1006_50_26_hca.hca` | 13.00s | 13.34s | +0.34s |
| `100700` | Touka Satomi | `group_14` | 4 | `vo_char_1007_00_21_hca.hca` | 13.10s | 12.76s | -0.34s |
| `100750` | Touka Satomi | `group_14` | 4 | `vo_char_1007_00_21_hca.hca` | 13.10s | 12.76s | -0.34s |
| `100800` | Alina Gray | `group_22` | 5 | `vo_char_1008_00_30_hca.hca` | 13.00s | 12.66s | -0.34s |
| `100800` | Alina Gray | `group_7` | 4 | `vo_char_1008_00_15_hca.hca` | 5.00s | 4.66s | -0.34s |
| `100850` | Alina Gray | `group_7` | 3 | `vo_char_1008_00_15_hca.hca` | 5.00s | 4.66s | -0.34s |
| `100851` | Alina Gray | `group_22` | 4 | `vo_char_1008_51_30_hca.hca` | 13.00s | 12.66s | -0.34s |
| `100900` | Rena Minami | `group_30` | 8 | `vo_char_1009_00_38_hca.hca` | 8.00s | 8.34s | +0.34s |
| `100900` | Rena Minami | `group_32` | 6 | `vo_char_1009_00_40_hca.hca` | 11.50s | 11.16s | -0.34s |
| `101000` | Momoko Togame | `group_3` | 4 | `vo_char_1010_00_04_hca.hca` | 6.00s | 5.66s | -0.34s |
| `101051` | Momoko Togame | `group_3` | 3 | `vo_char_1010_00_04_hca.hca` | 6.00s | 5.66s | -0.34s |
| `101700` | Mitama Yakumo | `group_65` | 4 | `vo_game_1102_04_hca.hca` | 6.70s | 7.04s | +0.34s |
| `101800` | Tsukuyo Amane | `group_33` | 6 | `vo_char_1018_00_41_hca.hca` | 16.70s | 16.36s | -0.34s |
| `101900` | Tsukasa Amane | `group_26` | 5 | `vo_char_1019_00_34_hca.hca` | 11.00s | 10.66s | -0.34s |
| `102100` | Yuna Kureha | `group_44` | 7 | `vo_game_0602_08_hca.hca` | 12.70s | 13.04s | +0.34s |
| `102200` | Hikaru Kirari | `group_29` | 6 | `vo_char_1022_00_36_hca.hca` | 10.30s | 10.64s | +0.34s |
| `102200` | Hikaru Kirari | `group_31` | 5 | `vo_char_1022_00_38_hca.hca` | 9.50s | 9.84s | +0.34s |
| `102200` | Hikaru Kirari | `group_47` | 5 | `vo_game_0302_11_hca.hca` | 10.00s | 10.34s | +0.34s |
| `102250` | Hikaru Kirari | `group_47` | 4 | `vo_game_0302_11_hca.hca` | 10.00s | 10.34s | +0.34s |
| `102300` | Ao Kasane | `group_46` | 6 | `vo_game_0402_10_hca.hca` | 13.50s | 13.16s | -0.34s |
| `103250` | Miyuri Yukari | `group_22` | 4 | `vo_char_1032_50_29_hca.hca` | 10.80s | 11.14s | +0.34s |
| `103300` | Rabi Himuro | `group_7` | 3 | `vo_char_1033_00_14_hca.hca` | 8.10s | 7.76s | -0.34s |
| `103350` | Rabi Himuro | `group_30` | 5 | `vo_char_1033_50_37_hca.hca` | 15.70s | 16.04s | +0.34s |
| `103350` | Rabi Himuro | `group_7` | 2 | `vo_char_1033_00_14_hca.hca` | 8.10s | 7.76s | -0.34s |
| `103400` | Asahi Miura | `group_6` | 3 | `vo_char_1034_00_13_hca.hca` | 4.20s | 3.86s | -0.34s |
| `103500` | Alexandra Kurusu | `group_10` | 4 | `vo_char_1035_00_17_hca.hca` | 13.00s | 12.66s | -0.34s |
| `103550` | Alexandra Kurusu | `group_10` | 3 | `vo_char_1035_00_17_hca.hca` | 13.00s | 12.66s | -0.34s |
| `104100` | Livia Medeiros | `group_6` | 3 | `vo_char_1041_00_13_hca.hca` | 5.50s | 5.16s | -0.34s |
| `111201` | Karin & Alina | `group_27` | 5 | `vo_char_1112_01_34_hca.hca` | 10.95s | 10.61s | -0.34s |
| `114400` | Uwasa Mikoto | `group_21` | 7 | `vo_char_1144_00_28_hca.hca` | 20.90s | 20.56s | -0.34s |
| `120100` | Iroha-chan | `group_12` | 2 | `vo_char_1201_00_19_hca.hca` | 4.00s | 3.66s | -0.34s |
| `130100` | Iroha & Yachiyo | `group_9` | 3 | `vo_char_1301_00_16_hca.hca` | 10.60s | 10.26s | -0.34s |
| `130101` | Iroha & Yachiyo | `group_9` | 3 | `vo_char_1301_00_16_hca.hca` | 10.60s | 10.26s | -0.34s |
| `130102` | Iroha & Yachiyo | `group_9` | 3 | `vo_char_1301_00_16_hca.hca` | 10.60s | 10.26s | -0.34s |
| `200651` | Kyoko Sakura | `group_28` | 4 | `vo_char_2006_51_36_hca.hca` | 10.10s | 10.44s | +0.34s |
| `200700` | Nagisa Momoe | `group_31` | 5 | `vo_char_2007_00_38_hca.hca` | 12.20s | 11.86s | -0.34s |
| `220200` | Devil Homura | `group_11` | 5 | `vo_char_2202_00_18_hca.hca` | 13.30s | 13.64s | +0.34s |
| `220200` | Devil Homura | `group_20` | 4 | `vo_char_2202_00_27_hca.hca` | 15.30s | 14.96s | -0.34s |
| `230000` | Homura Akemi | `group_33` | 7 | `vo_char_2300_00_41_hca.hca` | 22.20s | 21.86s | -0.34s |
| `240000` | Sayaka Miki | `group_15` | 6 | `vo_char_2400_00_22_hca.hca` | 17.00s | 16.66s | -0.34s |
| `250000` | Holy Mami | `group_18` | 5 | `vo_char_2500_00_26_hca.hca` | 12.00s | 11.66s | -0.34s |
| `250000` | Holy Mami | `group_28` | 5 | `vo_char_2500_00_36_hca.hca` | 11.00s | 10.66s | -0.34s |
| `250000` | Holy Mami | `group_36` | 2 | `vo_char_2500_00_44_hca.hca` | 3.00s | 2.66s | -0.34s |
| `250001` | Holy Mami | `group_36` | 2 | `vo_char_2500_00_44_hca.hca` | 3.00s | 2.66s | -0.34s |
| `300500` | Nanaka Tokiwa | `group_14` | 8 | `vo_char_3005_00_22_hca.hca` | 20.00s | 19.66s | -0.34s |
| `300500` | Nanaka Tokiwa | `group_36` | 3 | `vo_char_3005_00_44_hca.hca` | 2.50s | 2.16s | -0.34s |
| `300700` | Shizuku Hozumi | `group_38` | 3 | `vo_char_3007_00_46_hca.hca` | 3.00s | 2.66s | -0.34s |
| `300900` | Manaka Kurumi | `group_5` | 5 | `vo_char_3009_00_13_hca.hca` | 4.50s | 4.16s | -0.34s |
| `301100` | Kako Natsume | `group_24` | 7 | `vo_char_3011_00_32_hca.hca` | 12.50s | 12.16s | -0.34s |
| `301151` | Kako Natsume | `group_16` | 5 | `vo_char_3011_51_24_hca.hca` | 16.10s | 15.76s | -0.34s |
| `301151` | Kako Natsume | `group_29` | 5 | `vo_char_3011_51_37_hca.hca` | 11.00s | 10.66s | -0.34s |
| `301300` | Leila Ibuki | `group_2` | 5 | `vo_char_3013_00_03_hca.hca` | 6.80s | 6.46s | -0.34s |
| `301400` | Seika Kumi | `group_10` | 5 | `vo_char_3014_00_18_hca.hca` | 13.00s | 13.34s | +0.34s |
| `301400` | Seika Kumi | `group_38` | 3 | `vo_char_3014_00_46_hca.hca` | 3.00s | 2.66s | -0.34s |
| `301800` | Hanna Sarasa | `group_25` | 5 | `vo_char_3018_00_32_hca.hca` | 11.20s | 10.86s | -0.34s |
| `302900` | Masara Kagami | `group_19` | 4 | `vo_char_3029_00_27_hca.hca` | 12.00s | 12.34s | +0.34s |
| `304800` | Hotaru Yura | `group_36` | 3 | `vo_char_3048_00_43_hca.hca` | 4.20s | 3.86s | -0.34s |
| `304900` | Kanae Yukino | `group_19` | 4 | `vo_char_3049_00_27_hca.hca` | 7.00s | 6.66s | -0.34s |
| `305350` | Ikumi Makino | `group_30` | 6 | `vo_char_3053_50_37_hca.hca` | 13.70s | 13.36s | -0.34s |
| `350400` | Masara & Kokoro | `group_21` | 7 | `vo_char_3504_00_28_hca.hca` | 14.00s | 13.66s | -0.34s |
| `350402` | Masara & Kokoro | `group_23` | 5 | `vo_char_3504_02_30_hca.hca` | 14.40s | 14.06s | -0.34s |
| `390200` | Shi | `group_34` | 6 | `vo_char_3902_00_41_hca.hca` | 19.60s | 19.26s | -0.34s |
| `400200` | Kirika Kure | `group_3` | 4 | `vo_char_4002_00_04_hca.hca` | 4.50s | 4.16s | -0.34s |
| `401200` | Umika Misaki | `group_3` | 5 | `vo_char_4012_00_04_hca.hca` | 7.00s | 6.66s | -0.34s |
| `403500` | Haruka Kanade | `group_29` | 4 | `vo_char_4035_00_36_hca.hca` | 10.00s | 9.66s | -0.34s |
| `405100` | Nanoha Takamachi | `group_13` | 4 | `vo_char_4051_00_20_hca.hca` | 7.30s | 6.96s | -0.34s |
| `405100` | Nanoha Takamachi | `group_38` | 4 | `vo_char_4051_00_45_hca.hca` | 4.50s | 4.16s | -0.34s |
| `405200` | Fate | `group_17` | 4 | `vo_char_4052_00_24_hca.hca` | 5.00s | 4.66s | -0.34s |
| `405300` | Hayate Yagami | `group_25` | 5 | `vo_char_4053_00_32_hca.hca` | 7.80s | 7.46s | -0.34s |
| `100354` | Tsuruno Yui | `group_24` | 3 | `vo_char_1003_54_32_hca.hca` | 10.00s | 9.65s | -0.35s |
| `100850` | Alina Gray | `group_32` | 5 | `vo_char_1008_50_40_hca.hca` | 13.50s | 13.15s | -0.35s |
| `100900` | Rena Minami | `group_14` | 9 | `vo_char_1009_00_22_hca.hca` | 15.00s | 14.65s | -0.35s |
| `100900` | Rena Minami | `group_8` | 6 | `vo_char_1009_00_16_hca.hca` | 10.50s | 10.15s | -0.35s |
| `100950` | Rena Minami | `group_14` | 8 | `vo_char_1009_00_22_hca.hca` | 15.00s | 14.65s | -0.35s |
| `100950` | Rena Minami | `group_8` | 5 | `vo_char_1009_00_16_hca.hca` | 10.50s | 10.15s | -0.35s |
| `100951` | Rena Minami | `group_14` | 8 | `vo_char_1009_00_22_hca.hca` | 15.00s | 14.65s | -0.35s |
| `100951` | Rena Minami | `group_8` | 5 | `vo_char_1009_00_16_hca.hca` | 10.50s | 10.15s | -0.35s |
| `101000` | Momoko Togame | `group_33` | 6 | `vo_char_1010_00_41_hca.hca` | 8.00s | 7.65s | -0.35s |
| `101051` | Momoko Togame | `group_31` | 4 | `vo_char_1010_51_39_hca.hca` | 12.00s | 11.65s | -0.35s |
| `101051` | Momoko Togame | `group_32` | 5 | `vo_char_1010_51_40_hca.hca` | 13.30s | 12.95s | -0.35s |
| `101100` | Kaede Akino | `group_40` | 5 | `vo_char_1011_00_64_hca.hca` | 3.50s | 3.15s | -0.35s |
| `101150` | Kaede Akino | `group_40` | 4 | `vo_char_1011_00_64_hca.hca` | 3.50s | 3.15s | -0.35s |
| `101152` | Kaede Akino | `group_40` | 3 | `vo_char_1011_00_64_hca.hca` | 3.50s | 3.15s | -0.35s |
| `101400` | Nemu Hiiragi | `group_2` | 4 | `vo_char_1014_00_02_hca.hca` | 14.10s | 14.45s | +0.35s |
| `101450` | Nemu Hiiragi | `group_2` | 4 | `vo_char_1014_00_02_hca.hca` | 14.10s | 14.45s | +0.35s |
| `101750` | Mitama Yakumo | `group_45` | 3 | `vo_game_1002_02_hca.hca` | 6.60s | 6.25s | -0.35s |
| `101951` | Tsukasa Amane | `group_22` | 4 | `vo_char_1019_51_30_hca.hca` | 11.00s | 10.65s | -0.35s |
| `102100` | Yuna Kureha | `group_43` | 5 | `vo_game_0602_04_hca.hca` | 11.80s | 12.15s | +0.35s |
| `102200` | Hikaru Kirari | `group_33` | 4 | `vo_char_1022_00_40_hca.hca` | 12.10s | 11.75s | -0.35s |
| `102400` | Juri Oba | `group_47` | 6 | `vo_game_0502_11_hca.hca` | 11.50s | 11.15s | -0.35s |
| `103200` | Miyuri Yukari | `group_31` | 4 | `vo_char_1032_00_38_hca.hca` | 11.90s | 11.55s | -0.35s |
| `103600` | Urara Yume | `group_6` | 3 | `vo_char_1036_00_13_hca.hca` | 5.50s | 5.15s | -0.35s |
| `104300` | Kuroe | `group_18` | 8 | `vo_char_1043_00_25_hca.hca` | 17.40s | 17.05s | -0.35s |
| `104600` | Chizuru | `group_29` | 7 | `vo_char_1046_00_36_hca.hca` | 12.70s | 12.35s | -0.35s |
| `105300` | Amaryllis | `group_15` | 6 | `vo_char_1053_00_22_hca.hca` | 20.30s | 19.95s | -0.35s |
| `105300` | Amaryllis | `group_3` | 2 | `vo_char_1053_00_03_hca.hca` | 3.10s | 3.45s | +0.35s |
| `105302` | Amaryllis | `group_15` | 5 | `vo_char_1053_00_22_hca.hca` | 20.30s | 19.95s | -0.35s |
| `105302` | Amaryllis | `group_3` | 2 | `vo_char_1053_00_03_hca.hca` | 3.10s | 3.45s | +0.35s |
| `110400` | Uwasa Sana | `group_36` | 3 | `vo_char_1104_00_43_hca.hca` | 2.80s | 2.45s | -0.35s |
| `110401` | Uwasa Sana | `group_29` | 4 | `vo_char_1104_01_36_hca.hca` | 14.00s | 13.65s | -0.35s |
| `111000` | Momoko Togame | `group_31` | 6 | `vo_char_1110_00_38_hca.hca` | 13.60s | 13.95s | +0.35s |
| `111000` | Momoko Togame | `group_8` | 4 | `vo_char_1110_00_15_hca.hca` | 5.50s | 5.15s | -0.35s |
| `111202` | Karin & Alina | `group_29` | 4 | `vo_char_1112_02_36_hca.hca` | 11.90s | 11.55s | -0.35s |
| `121700` | Mitama Yakumo | `group_33` | 7 | `vo_char_1217_00_40_hca.hca` | 19.50s | 19.15s | -0.35s |
| `130102` | Iroha & Yachiyo | `group_27` | 4 | `vo_char_1301_02_34_hca.hca` | 11.10s | 10.75s | -0.35s |
| `200200` | Homura Akemi | `group_29` | 3 | `vo_char_2002_00_36_hca.hca` | 12.80s | 12.45s | -0.35s |
| `200400` | Sayaka Miki | `group_2` | 5 | `vo_char_2004_00_03_hca.hca` | 6.00s | 5.65s | -0.35s |
| `200451` | Sayaka Miki | `group_2` | 3 | `vo_char_2004_00_03_hca.hca` | 6.00s | 5.65s | -0.35s |
| `200900` | Mabayu Aki | `group_18` | 6 | `vo_char_2009_00_25_hca.hca` | 12.80s | 12.45s | -0.35s |
| `210100` | Ultimate Madoka | `group_2` | 2 | `vo_char_2101_00_03_hca.hca` | 4.00s | 3.65s | -0.35s |
| `260200` | Kyoko Sakura | `group_13` | 3 | `vo_char_2602_00_20_hca.hca` | 5.00s | 4.65s | -0.35s |
| `300651` | Emiri Kisaki | `group_17` | 8 | `vo_char_3006_51_25_hca.hca` | 15.00s | 14.65s | -0.35s |
| `300800` | Akira Shinobu | `group_5` | 7 | `vo_char_3008_00_13_hca.hca` | 5.50s | 5.15s | -0.35s |
| `300850` | Akira Shinobu | `group_5` | 4 | `vo_char_3008_00_13_hca.hca` | 5.50s | 5.15s | -0.35s |
| `300900` | Manaka Kurumi | `group_7` | 6 | `vo_char_3009_00_15_hca.hca` | 5.00s | 4.65s | -0.35s |
| `301300` | Leila Ibuki | `group_27` | 5 | `vo_char_3013_00_35_hca.hca` | 11.00s | 10.65s | -0.35s |
| `301400` | Seika Kumi | `group_40` | 3 | `vo_char_3014_00_64_hca.hca` | 3.00s | 2.65s | -0.35s |
| `301650` | Kokoro Awane | `group_21` | 5 | `vo_char_3016_50_29_hca.hca` | 12.70s | 12.35s | -0.35s |
| `301800` | Hanna Sarasa | `group_2` | 6 | `vo_char_3018_00_02_hca.hca` | 15.30s | 14.95s | -0.35s |
| `301800` | Hanna Sarasa | `group_34` | 4 | `vo_char_3018_00_41_hca.hca` | 12.50s | 12.15s | -0.35s |
| `302600` | Konoha Shizumi | `group_28` | 5 | `vo_char_3026_00_36_hca.hca` | 11.00s | 10.65s | -0.35s |
| `303250` | Mayu Kozue | `group_26` | 5 | `vo_char_3032_50_34_hca.hca` | 18.00s | 17.65s | -0.35s |
| `303250` | Mayu Kozue | `group_29` | 4 | `vo_char_3032_50_37_hca.hca` | 15.00s | 14.65s | -0.35s |
| `400400` | Oriko Mikuni | `group_17` | 5 | `vo_char_4004_00_24_hca.hca` | 12.90s | 12.55s | -0.35s |
| `401100` | Kazumi | `group_14` | 5 | `vo_char_4011_00_22_hca.hca` | 19.00s | 18.65s | -0.35s |
| `401200` | Umika Misaki | `group_14` | 6 | `vo_char_4012_00_22_hca.hca` | 15.00s | 14.65s | -0.35s |
| `401300` | Kaoru Maki | `group_16` | 6 | `vo_char_4013_00_24_hca.hca` | 12.00s | 11.65s | -0.35s |
| `402450` | Minou | `group_28` | 5 | `vo_char_4024_50_35_hca.hca` | 16.40s | 16.05s | -0.35s |
| `402451` | Minou | `group_28` | 5 | `vo_char_4024_51_35_hca.hca` | 16.40s | 16.05s | -0.35s |
| `403400` | Chisato Shion | `group_5` | 5 | `vo_char_4034_00_13_hca.hca` | 6.00s | 5.65s | -0.35s |
| `404500` | Tsubasa Hanekawa | `group_7` | 2 | `vo_char_4045_00_14_hca.hca` | 4.20s | 3.85s | -0.35s |
| `405100` | Nanoha Takamachi | `group_32` | 7 | `vo_char_4051_00_39_hca.hca` | 12.00s | 11.65s | -0.35s |
| `405200` | Fate | `group_41` | 3 | `vo_char_4052_00_64_hca.hca` | 2.00s | 1.65s | -0.35s |
| `100100` | Iroha Tamaki | `group_41` | 4 | `vo_char_1001_00_65_hca.hca` | 5.00s | 4.64s | -0.36s |
| `100103` | Iroha Tamaki | `group_41` | 4 | `vo_char_1001_00_65_hca.hca` | 5.00s | 4.64s | -0.36s |
| `100150` | Iroha Tamaki | `group_41` | 3 | `vo_char_1001_00_65_hca.hca` | 5.00s | 4.64s | -0.36s |
| `100153` | Iroha Tamaki | `group_41` | 3 | `vo_char_1001_00_65_hca.hca` | 5.00s | 4.64s | -0.36s |
| `100352` | Tsuruno Yui | `group_20` | 7 | `vo_char_1003_52_28_hca.hca` | 16.80s | 16.44s | -0.36s |
| `100650` | Mifuyu Azusa | `group_29` | 5 | `vo_char_1006_50_37_hca.hca` | 14.00s | 13.64s | -0.36s |
| `100800` | Alina Gray | `group_19` | 7 | `vo_char_1008_00_27_hca.hca` | 14.00s | 13.64s | -0.36s |
| `100800` | Alina Gray | `group_5` | 6 | `vo_char_1008_00_13_hca.hca` | 6.20s | 6.56s | +0.36s |
| `100850` | Alina Gray | `group_5` | 5 | `vo_char_1008_00_13_hca.hca` | 6.20s | 6.56s | +0.36s |
| `100851` | Alina Gray | `group_19` | 6 | `vo_char_1008_51_27_hca.hca` | 14.00s | 13.64s | -0.36s |
| `100900` | Rena Minami | `group_7` | 4 | `vo_char_1009_00_15_hca.hca` | 5.00s | 4.64s | -0.36s |
| `100950` | Rena Minami | `group_7` | 3 | `vo_char_1009_00_15_hca.hca` | 5.00s | 4.64s | -0.36s |
| `100951` | Rena Minami | `group_7` | 3 | `vo_char_1009_00_15_hca.hca` | 5.00s | 4.64s | -0.36s |
| `101000` | Momoko Togame | `group_6` | 4 | `vo_char_1010_00_14_hca.hca` | 5.00s | 4.64s | -0.36s |
| `101051` | Momoko Togame | `group_6` | 3 | `vo_char_1010_00_14_hca.hca` | 5.00s | 4.64s | -0.36s |
| `101200` | Karin Misono | `group_6` | 5 | `vo_char_1012_00_14_hca.hca` | 5.50s | 5.86s | +0.36s |
| `101250` | Karin Misono | `group_6` | 4 | `vo_char_1012_00_14_hca.hca` | 5.50s | 5.86s | +0.36s |
| `101300` | Asuka Tatsuki | `group_3` | 4 | `vo_char_1013_00_04_hca.hca` | 5.00s | 4.64s | -0.36s |
| `101300` | Asuka Tatsuki | `group_36` | 3 | `vo_char_1013_00_44_hca.hca` | 2.00s | 1.64s | -0.36s |
| `101300` | Asuka Tatsuki | `group_38` | 5 | `vo_char_1013_00_46_hca.hca` | 3.00s | 2.64s | -0.36s |
| `101400` | Nemu Hiiragi | `group_6` | 3 | `vo_char_1014_00_13_hca.hca` | 8.10s | 7.74s | -0.36s |
| `101450` | Nemu Hiiragi | `group_22` | 6 | `vo_char_1014_50_29_hca.hca` | 15.50s | 15.86s | +0.36s |
| `101450` | Nemu Hiiragi | `group_6` | 3 | `vo_char_1014_00_13_hca.hca` | 8.10s | 7.74s | -0.36s |
| `101700` | Mitama Yakumo | `group_45` | 5 | `vo_game_0702_02_hca.hca` | 9.10s | 8.74s | -0.36s |
| `101751` | Mitama Yakumo | `group_49` | 5 | `vo_game_0802_09_hca.hca` | 11.70s | 12.06s | +0.36s |
| `101951` | Tsukasa Amane | `group_17` | 4 | `vo_char_1019_51_25_hca.hca` | 10.00s | 9.64s | -0.36s |
| `102100` | Yuna Kureha | `group_40` | 3 | `vo_game_0602_01_hca.hca` | 7.80s | 7.44s | -0.36s |
| `102350` | Ao Kasane | `group_43` | 3 | `vo_game_0402_04_hca.hca` | 9.60s | 9.96s | +0.36s |
| `102400` | Juri Oba | `group_31` | 6 | `vo_char_1024_00_38_hca.hca` | 14.70s | 14.34s | -0.36s |
| `102650` | Chiharu Hiroe | `group_22` | 4 | `vo_char_1026_50_29_hca.hca` | 10.30s | 9.94s | -0.36s |
| `103150` | San Kagura | `group_28` | 4 | `vo_char_1031_50_35_hca.hca` | 13.70s | 13.34s | -0.36s |
| `103300` | Rabi Himuro | `group_2` | 5 | `vo_char_1033_00_02_hca.hca` | 13.90s | 13.54s | -0.36s |
| `103350` | Rabi Himuro | `group_2` | 4 | `vo_char_1033_00_02_hca.hca` | 13.90s | 13.54s | -0.36s |
| `103550` | Alexandra Kurusu | `group_24` | 4 | `vo_char_1035_50_31_hca.hca` | 12.10s | 11.74s | -0.36s |
| `103600` | Urara Yume | `group_37` | 2 | `vo_char_1036_00_44_hca.hca` | 3.00s | 2.64s | -0.36s |
| `104100` | Livia Medeiros | `group_26` | 4 | `vo_char_1041_00_33_hca.hca` | 13.50s | 13.14s | -0.36s |
| `110500` | Felicia-chan | `group_14` | 3 | `vo_char_1105_00_21_hca.hca` | 9.00s | 8.64s | -0.36s |
| `110500` | Felicia-chan | `group_25` | 3 | `vo_char_1105_00_32_hca.hca` | 13.20s | 12.84s | -0.36s |
| `111802` | Amane Sisters | `group_34` | 5 | `vo_char_1118_02_41_hca.hca` | 12.10s | 11.74s | -0.36s |
| `120100` | Iroha-chan | `group_25` | 2 | `vo_char_1201_00_32_hca.hca` | 10.10s | 9.74s | -0.36s |
| `120902` | Rena & Kaede | `group_33` | 5 | `vo_char_1209_02_40_hca.hca` | 13.40s | 13.04s | -0.36s |
| `180101` | Iroha & Kuroe | `group_25` | 5 | `vo_char_1801_01_32_hca.hca` | 12.80s | 12.44s | -0.36s |
| `200602` | Kyoko Sakura | `group_18` | 7 | `vo_char_2006_02_26_hca.hca` | 14.20s | 13.84s | -0.36s |
| `230000` | Homura Akemi | `group_37` | 2 | `vo_char_2300_00_45_hca.hca` | 3.00s | 2.64s | -0.36s |
| `300300` | Hinano Miyako | `group_4` | 4 | `vo_char_3003_00_05_hca.hca` | 6.00s | 5.64s | -0.36s |
| `300351` | Hinano Miyako | `group_4` | 3 | `vo_char_3003_00_05_hca.hca` | 6.00s | 5.64s | -0.36s |
| `300400` | Sasara Minagi | `group_37` | 3 | `vo_char_3004_00_45_hca.hca` | 3.00s | 2.64s | -0.36s |
| `300800` | Akira Shinobu | `group_4` | 7 | `vo_char_3008_00_05_hca.hca` | 6.00s | 5.64s | -0.36s |
| `300850` | Akira Shinobu | `group_21` | 4 | `vo_char_3008_50_29_hca.hca` | 16.00s | 15.64s | -0.36s |
| `300850` | Akira Shinobu | `group_4` | 4 | `vo_char_3008_00_05_hca.hca` | 6.00s | 5.64s | -0.36s |
| `301051` | Ria Ami | `group_31` | 3 | `vo_char_3010_51_39_hca.hca` | 8.00s | 7.64s | -0.36s |
| `301400` | Seika Kumi | `group_30` | 7 | `vo_char_3014_00_38_hca.hca` | 13.80s | 13.44s | -0.36s |
| `301700` | Yukika Nanase | `group_32` | 3 | `vo_char_3017_00_39_hca.hca` | 10.00s | 9.64s | -0.36s |
| `301800` | Hanna Sarasa | `group_4` | 3 | `vo_char_3018_00_04_hca.hca` | 6.00s | 5.64s | -0.36s |
| `303100` | Rika Ayano | `group_23` | 7 | `vo_char_3031_00_31_hca.hca` | 10.00s | 9.64s | -0.36s |
| `303400` | Moka Megumi | `group_16` | 6 | `vo_char_3034_00_23_hca.hca` | 23.50s | 23.14s | -0.36s |
| `303400` | Moka Megumi | `group_23` | 4 | `vo_char_3034_00_30_hca.hca` | 15.00s | 14.64s | -0.36s |
| `303500` | Riko Chiaki | `group_7` | 3 | `vo_char_3035_00_14_hca.hca` | 5.20s | 4.84s | -0.36s |
| `304400` | Ranka Chizu | `group_19` | 4 | `vo_char_3044_00_26_hca.hca` | 15.20s | 14.84s | -0.36s |
| `304651` | Ryo Midori | `group_32` | 5 | `vo_char_3046_51_39_hca.hca` | 14.00s | 13.64s | -0.36s |
| `304750` | Chika Aoba | `group_10` | 3 | `vo_char_3047_00_18_hca.hca` | 13.20s | 13.56s | +0.36s |
| `305000` | Yuuna Kaharu | `group_16` | 4 | `vo_char_3050_00_23_hca.hca` | 19.00s | 18.64s | -0.36s |
| `305600` | Rui Mizuki | `group_33` | 8 | `vo_char_3056_00_40_hca.hca` | 17.30s | 16.94s | -0.36s |
| `400100` | Oriko Mikuni | `group_24` | 5 | `vo_char_4001_00_32_hca.hca` | 13.00s | 12.64s | -0.36s |
| `400100` | Oriko Mikuni | `group_31` | 7 | `vo_char_4001_00_39_hca.hca` | 16.50s | 16.14s | -0.36s |
| `400200` | Kirika Kure | `group_22` | 6 | `vo_char_4002_00_30_hca.hca` | 10.50s | 10.14s | -0.36s |
| `401300` | Kaoru Maki | `group_5` | 4 | `vo_char_4013_00_13_hca.hca` | 5.50s | 5.14s | -0.36s |
| `402500` | Corbeau | `group_2` | 8 | `vo_char_4025_00_02_hca.hca` | 19.90s | 19.54s | -0.36s |
| `403500` | Haruka Kanade | `group_33` | 7 | `vo_char_4035_00_40_hca.hca` | 16.00s | 15.64s | -0.36s |
| `404300` | Suruga Kanbaru | `group_34` | 3 | `vo_char_4043_00_41_hca.hca` | 12.30s | 11.94s | -0.36s |
| `404400` | Nadeko Sengoku | `group_3` | 2 | `vo_char_4044_00_04_hca.hca` | 5.60s | 5.24s | -0.36s |
| `404400` | Nadeko Sengoku | `group_30` | 2 | `vo_char_4044_00_38_hca.hca` | 10.45s | 10.81s | +0.36s |
| `405100` | Nanoha Takamachi | `group_40` | 3 | `vo_char_4051_00_63_hca.hca` | 1.00s | 0.64s | -0.36s |
| `405300` | Hayate Yagami | `group_3` | 4 | `vo_char_4053_00_03_hca.hca` | 2.80s | 2.44s | -0.36s |
| `405300` | Hayate Yagami | `group_6` | 4 | `vo_char_4053_00_13_hca.hca` | 4.50s | 4.14s | -0.36s |
| `100100` | Iroha Tamaki | `group_26` | 6 | `vo_char_1001_00_34_hca.hca` | 11.50s | 11.13s | -0.37s |
| `100150` | Iroha Tamaki | `group_16` | 4 | `vo_char_1001_50_24_hca.hca` | 11.00s | 10.63s | -0.37s |
| `100400` | Sana Futaba | `group_20` | 7 | `vo_char_1004_00_28_hca.hca` | 16.50s | 16.13s | -0.37s |
| `100451` | Sana Futaba | `group_24` | 4 | `vo_char_1004_51_32_hca.hca` | 16.00s | 15.63s | -0.37s |
| `100700` | Touka Satomi | `group_25` | 5 | `vo_char_1007_00_32_hca.hca` | 11.50s | 11.87s | +0.37s |
| `100850` | Alina Gray | `group_18` | 5 | `vo_char_1008_50_26_hca.hca` | 13.50s | 13.13s | -0.37s |
| `101100` | Kaede Akino | `group_9` | 5 | `vo_char_1011_00_17_hca.hca` | 12.50s | 12.13s | -0.37s |
| `101150` | Kaede Akino | `group_9` | 4 | `vo_char_1011_00_17_hca.hca` | 12.50s | 12.13s | -0.37s |
| `101152` | Kaede Akino | `group_9` | 3 | `vo_char_1011_00_17_hca.hca` | 12.50s | 12.13s | -0.37s |
| `101450` | Nemu Hiiragi | `group_25` | 4 | `vo_char_1014_50_32_hca.hca` | 15.80s | 15.43s | -0.37s |
| `101900` | Tsukasa Amane | `group_20` | 5 | `vo_char_1019_00_28_hca.hca` | 10.00s | 9.63s | -0.37s |
| `102350` | Ao Kasane | `group_34` | 7 | `vo_char_1023_50_41_hca.hca` | 17.80s | 17.43s | -0.37s |
| `102800` | Himena Aika | `group_16` | 5 | `vo_char_1028_00_23_hca.hca` | 16.10s | 15.73s | -0.37s |
| `102850` | Himena Aika | `group_16` | 4 | `vo_char_1028_00_23_hca.hca` | 16.10s | 15.73s | -0.37s |
| `103200` | Miyuri Yukari | `group_24` | 4 | `vo_char_1032_00_31_hca.hca` | 13.90s | 13.53s | -0.37s |
| `103200` | Miyuri Yukari | `group_27` | 5 | `vo_char_1032_00_34_hca.hca` | 14.80s | 14.43s | -0.37s |
| `103400` | Asahi Miura | `group_37` | 2 | `vo_char_1034_00_44_hca.hca` | 3.00s | 2.63s | -0.37s |
| `103600` | Urara Yume | `group_5` | 3 | `vo_char_1036_00_05_hca.hca` | 3.60s | 3.23s | -0.37s |
| `104100` | Livia Medeiros | `group_21` | 4 | `vo_char_1041_00_28_hca.hca` | 12.00s | 12.37s | +0.37s |
| `104100` | Livia Medeiros | `group_23` | 4 | `vo_char_1041_00_30_hca.hca` | 13.00s | 12.63s | -0.37s |
| `104400` | Mikoto Sena | `group_36` | 2 | `vo_char_1044_00_43_hca.hca` | 3.00s | 2.63s | -0.37s |
| `104600` | Chizuru | `group_16` | 7 | `vo_char_1046_00_23_hca.hca` | 19.10s | 18.73s | -0.37s |
| `104900` | Olga | `group_31` | 6 | `vo_char_1049_00_38_hca.hca` | 15.60s | 15.23s | -0.37s |
| `105300` | Amaryllis | `group_10` | 5 | `vo_char_1053_00_17_hca.hca` | 13.70s | 13.33s | -0.37s |
| `105302` | Amaryllis | `group_27` | 6 | `vo_char_1053_02_34_hca.hca` | 15.80s | 15.43s | -0.37s |
| `111000` | Momoko Togame | `group_20` | 5 | `vo_char_1110_00_27_hca.hca` | 13.30s | 12.93s | -0.37s |
| `111600` | Kanagi Izumi | `group_18` | 9 | `vo_char_1116_00_25_hca.hca` | 15.90s | 15.53s | -0.37s |
| `111800` | Amane Sisters | `group_42` | 2 | `vo_char_1118_00_65_hca.hca` | 2.50s | 2.13s | -0.37s |
| `111801` | Amane Sisters | `group_19` | 4 | `vo_char_1118_01_26_hca.hca` | 17.10s | 16.73s | -0.37s |
| `111801` | Amane Sisters | `group_42` | 2 | `vo_char_1118_00_65_hca.hca` | 2.50s | 2.13s | -0.37s |
| `111802` | Amane Sisters | `group_42` | 2 | `vo_char_1118_00_65_hca.hca` | 2.50s | 2.13s | -0.37s |
| `200200` | Homura Akemi | `group_36` | 2 | `vo_char_2002_00_43_hca.hca` | 3.50s | 3.13s | -0.37s |
| `200400` | Sayaka Miki | `group_42` | 4 | `vo_char_2004_00_66_hca.hca` | 3.00s | 2.63s | -0.37s |
| `200451` | Sayaka Miki | `group_42` | 2 | `vo_char_2004_00_66_hca.hca` | 3.00s | 2.63s | -0.37s |
| `250000` | Holy Mami | `group_11` | 2 | `vo_char_2500_00_19_hca.hca` | 5.00s | 4.63s | -0.37s |
| `250000` | Holy Mami | `group_9` | 4 | `vo_char_2500_00_17_hca.hca` | 11.00s | 10.63s | -0.37s |
| `250001` | Holy Mami | `group_11` | 2 | `vo_char_2500_00_19_hca.hca` | 5.00s | 4.63s | -0.37s |
| `250001` | Holy Mami | `group_9` | 4 | `vo_char_2500_00_17_hca.hca` | 11.00s | 10.63s | -0.37s |
| `250100` | Mami Tomoe | `group_27` | 4 | `vo_char_2501_00_34_hca.hca` | 10.80s | 10.43s | -0.37s |
| `260000` | Kyoko Sakura | `group_39` | 4 | `vo_char_2600_00_46_hca.hca` | 5.00s | 4.63s | -0.37s |
| `300300` | Hinano Miyako | `group_3` | 4 | `vo_char_3003_00_04_hca.hca` | 6.00s | 5.63s | -0.37s |
| `300351` | Hinano Miyako | `group_3` | 3 | `vo_char_3003_00_04_hca.hca` | 6.00s | 5.63s | -0.37s |
| `300500` | Nanaka Tokiwa | `group_19` | 8 | `vo_char_3005_00_27_hca.hca` | 14.50s | 14.13s | -0.37s |
| `300700` | Shizuku Hozumi | `group_21` | 6 | `vo_char_3007_00_29_hca.hca` | 10.00s | 9.63s | -0.37s |
| `301000` | Ria Ami | `group_43` | 6 | `vo_char_3010_00_02_hca.hca` | 11.30s | 10.93s | -0.37s |
| `301051` | Ria Ami | `group_43` | 4 | `vo_char_3010_00_02_hca.hca` | 11.30s | 10.93s | -0.37s |
| `303300` | Sayuki Fumino | `group_23` | 5 | `vo_char_3033_00_30_hca.hca` | 13.50s | 13.13s | -0.37s |
| `303400` | Moka Megumi | `group_13` | 3 | `vo_char_3034_00_20_hca.hca` | 5.00s | 4.63s | -0.37s |
| `303400` | Moka Megumi | `group_37` | 2 | `vo_char_3034_00_44_hca.hca` | 3.00s | 2.63s | -0.37s |
| `304400` | Ranka Chizu | `group_17` | 4 | `vo_char_3044_00_24_hca.hca` | 13.80s | 13.43s | -0.37s |
| `350100` | Rika & Ren | `group_24` | 5 | `vo_char_3501_00_31_hca.hca` | 15.80s | 15.43s | -0.37s |
| `350400` | Masara & Kokoro | `group_31` | 6 | `vo_char_3504_00_38_hca.hca` | 16.50s | 16.13s | -0.37s |
| `390200` | Shi | `group_23` | 4 | `vo_char_3902_00_30_hca.hca` | 13.70s | 13.33s | -0.37s |
| `390200` | Shi | `group_35` | 2 | `vo_char_3902_00_42_hca.hca` | 2.40s | 2.03s | -0.37s |
| `390201` | Shi | `group_29` | 5 | `vo_char_3902_01_36_hca.hca` | 15.00s | 14.63s | -0.37s |
| `400100` | Oriko Mikuni | `group_20` | 8 | `vo_char_4001_00_28_hca.hca` | 14.50s | 14.13s | -0.37s |
| `400200` | Kirika Kure | `group_42` | 4 | `vo_char_4002_00_66_hca.hca` | 4.50s | 4.13s | -0.37s |
| `402300` | Melissa | `group_2` | 4 | `vo_char_4023_00_03_hca.hca` | 4.00s | 3.63s | -0.37s |
| `402350` | Melissa | `group_2` | 2 | `vo_char_4023_00_03_hca.hca` | 4.00s | 3.63s | -0.37s |
| `405300` | Hayate Yagami | `group_23` | 5 | `vo_char_4053_00_30_hca.hca` | 5.50s | 5.13s | -0.37s |
| `100700` | Touka Satomi | `group_19` | 6 | `vo_char_1007_00_26_hca.hca` | 12.00s | 12.38s | +0.38s |
| `100951` | Rena Minami | `group_32` | 7 | `vo_char_1009_51_40_hca.hca` | 17.90s | 17.52s | -0.38s |
| `101000` | Momoko Togame | `group_22` | 6 | `vo_char_1010_00_30_hca.hca` | 10.50s | 10.12s | -0.38s |
| `101150` | Kaede Akino | `group_18` | 6 | `vo_char_1011_50_26_hca.hca` | 17.00s | 16.62s | -0.38s |
| `101150` | Kaede Akino | `group_27` | 5 | `vo_char_1011_50_35_hca.hca` | 12.00s | 11.62s | -0.38s |
| `101152` | Kaede Akino | `group_29` | 6 | `vo_char_1011_52_37_hca.hca` | 18.30s | 17.92s | -0.38s |
| `101300` | Asuka Tatsuki | `group_28` | 8 | `vo_char_1013_00_36_hca.hca` | 11.50s | 11.12s | -0.38s |
| `101300` | Asuka Tatsuki | `group_32` | 7 | `vo_char_1013_00_40_hca.hca` | 14.00s | 13.62s | -0.38s |
| `101400` | Nemu Hiiragi | `group_8` | 6 | `vo_char_1014_00_15_hca.hca` | 7.50s | 7.12s | -0.38s |
| `101450` | Nemu Hiiragi | `group_8` | 6 | `vo_char_1014_00_15_hca.hca` | 7.50s | 7.12s | -0.38s |
| `101550` | Ui Tamaki | `group_29` | 4 | `vo_char_1015_50_36_hca.hca` | 13.50s | 13.88s | +0.38s |
| `102400` | Juri Oba | `group_42` | 5 | `vo_game_0502_03_hca.hca` | 9.90s | 9.52s | -0.38s |
| `102651` | Chiharu Hiroe | `group_27` | 4 | `vo_char_1026_51_34_hca.hca` | 13.00s | 12.62s | -0.38s |
| `102800` | Himena Aika | `group_34` | 7 | `vo_char_1028_00_41_hca.hca` | 14.10s | 13.72s | -0.38s |
| `102800` | Himena Aika | `group_35` | 2 | `vo_char_1028_00_42_hca.hca` | 3.50s | 3.12s | -0.38s |
| `102800` | Himena Aika | `group_9` | 5 | `vo_char_1028_00_16_hca.hca` | 11.90s | 11.52s | -0.38s |
| `102850` | Himena Aika | `group_9` | 4 | `vo_char_1028_00_16_hca.hca` | 11.90s | 11.52s | -0.38s |
| `103000` | Hagumu Azumi | `group_32` | 6 | `vo_char_1030_00_39_hca.hca` | 16.00s | 16.38s | +0.38s |
| `103200` | Miyuri Yukari | `group_15` | 6 | `vo_char_1032_00_22_hca.hca` | 18.60s | 18.22s | -0.38s |
| `103200` | Miyuri Yukari | `group_9` | 5 | `vo_char_1032_00_16_hca.hca` | 15.30s | 14.92s | -0.38s |
| `103250` | Miyuri Yukari | `group_15` | 5 | `vo_char_1032_00_22_hca.hca` | 18.60s | 18.22s | -0.38s |
| `103250` | Miyuri Yukari | `group_17` | 6 | `vo_char_1032_50_24_hca.hca` | 11.50s | 11.12s | -0.38s |
| `103350` | Rabi Himuro | `group_24` | 4 | `vo_char_1033_50_31_hca.hca` | 13.50s | 13.12s | -0.38s |
| `103350` | Rabi Himuro | `group_31` | 6 | `vo_char_1033_50_38_hca.hca` | 15.80s | 16.18s | +0.38s |
| `104300` | Kuroe | `group_1` | 6 | `vo_char_1043_00_01_hca.hca` | 24.60s | 24.22s | -0.38s |
| `104300` | Kuroe | `group_16` | 8 | `vo_char_1043_00_23_hca.hca` | 20.50s | 20.88s | +0.38s |
| `104300` | Kuroe | `group_22` | 4 | `vo_char_1043_00_29_hca.hca` | 12.60s | 12.22s | -0.38s |
| `105300` | Amaryllis | `group_6` | 3 | `vo_char_1053_00_13_hca.hca` | 4.80s | 4.42s | -0.38s |
| `105302` | Amaryllis | `group_33` | 5 | `vo_char_1053_02_40_hca.hca` | 15.20s | 15.58s | +0.38s |
| `120100` | Iroha-chan | `group_7` | 2 | `vo_char_1201_00_14_hca.hca` | 4.80s | 4.42s | -0.38s |
| `120902` | Rena & Kaede | `group_22` | 5 | `vo_char_1209_02_29_hca.hca` | 12.50s | 12.12s | -0.38s |
| `200700` | Nagisa Momoe | `group_23` | 5 | `vo_char_2007_00_30_hca.hca` | 11.50s | 11.88s | +0.38s |
| `300500` | Nanaka Tokiwa | `group_25` | 6 | `vo_char_3005_00_33_hca.hca` | 14.00s | 13.62s | -0.38s |
| `300700` | Shizuku Hozumi | `group_33` | 5 | `vo_char_3007_00_41_hca.hca` | 12.50s | 12.88s | +0.38s |
| `300850` | Akira Shinobu | `group_18` | 6 | `vo_char_3008_50_26_hca.hca` | 15.00s | 14.62s | -0.38s |
| `301051` | Ria Ami | `group_18` | 4 | `vo_char_3010_51_26_hca.hca` | 11.00s | 10.62s | -0.38s |
| `301400` | Seika Kumi | `group_11` | 5 | `vo_char_3014_00_19_hca.hca` | 5.80s | 5.42s | -0.38s |
| `301400` | Seika Kumi | `group_29` | 5 | `vo_char_3014_00_37_hca.hca` | 12.30s | 11.92s | -0.38s |
| `301600` | Kokoro Awane | `group_35` | 4 | `vo_char_3016_00_43_hca.hca` | 2.50s | 2.12s | -0.38s |
| `301650` | Kokoro Awane | `group_35` | 3 | `vo_char_3016_00_43_hca.hca` | 2.50s | 2.12s | -0.38s |
| `301700` | Yukika Nanase | `group_16` | 5 | `vo_char_3017_00_23_hca.hca` | 18.20s | 17.82s | -0.38s |
| `301800` | Hanna Sarasa | `group_15` | 6 | `vo_char_3018_00_22_hca.hca` | 17.90s | 17.52s | -0.38s |
| `301800` | Hanna Sarasa | `group_16` | 7 | `vo_char_3018_00_23_hca.hca` | 19.10s | 18.72s | -0.38s |
| `301800` | Hanna Sarasa | `group_23` | 6 | `vo_char_3018_00_30_hca.hca` | 12.80s | 12.42s | -0.38s |
| `301900` | Ayaka Mariko | `group_35` | 4 | `vo_char_3019_00_43_hca.hca` | 4.00s | 3.62s | -0.38s |
| `301950` | Ayaka Mariko | `group_24` | 2 | `vo_char_3019_50_32_hca.hca` | 10.00s | 9.62s | -0.38s |
| `301950` | Ayaka Mariko | `group_35` | 2 | `vo_char_3019_00_43_hca.hca` | 4.00s | 3.62s | -0.38s |
| `302100` | Sakuya Suzuka | `group_34` | 8 | `vo_char_3021_00_41_hca.hca` | 24.00s | 24.38s | +0.38s |
| `302300` | Aimi Eri | `group_21` | 6 | `vo_char_3023_00_29_hca.hca` | 13.00s | 12.62s | -0.38s |
| `302551` | Ren Isuzu | `group_31` | 5 | `vo_char_3025_51_39_hca.hca` | 21.00s | 20.62s | -0.38s |
| `302600` | Konoha Shizumi | `group_21` | 5 | `vo_char_3026_00_29_hca.hca` | 14.00s | 13.62s | -0.38s |
| `303300` | Sayuki Fumino | `group_38` | 3 | `vo_char_3033_00_45_hca.hca` | 3.20s | 2.82s | -0.38s |
| `303350` | Sayuki Fumino | `group_38` | 2 | `vo_char_3033_00_45_hca.hca` | 3.20s | 2.82s | -0.38s |
| `304800` | Hotaru Yura | `group_28` | 8 | `vo_char_3048_00_35_hca.hca` | 18.20s | 18.58s | +0.38s |
| `305400` | Mitsune Miwa | `group_11` | 4 | `vo_char_3054_00_18_hca.hca` | 11.00s | 10.62s | -0.38s |
| `305400` | Mitsune Miwa | `group_5` | 2 | `vo_char_3054_00_05_hca.hca` | 5.10s | 4.72s | -0.38s |
| `305850` | Ryoko Natsu | `group_17` | 6 | `vo_char_3058_50_25_hca.hca` | 12.50s | 12.12s | -0.38s |
| `400100` | Oriko Mikuni | `group_3` | 4 | `vo_char_4001_00_04_hca.hca` | 6.50s | 6.12s | -0.38s |
| `400400` | Oriko Mikuni | `group_12` | 4 | `vo_char_4004_00_19_hca.hca` | 7.70s | 7.32s | -0.38s |
| `401100` | Kazumi | `group_41` | 4 | `vo_char_4011_00_65_hca.hca` | 3.00s | 2.62s | -0.38s |
| `402100` | Tart | `group_15` | 7 | `vo_char_4021_00_23_hca.hca` | 22.50s | 22.12s | -0.38s |
| `402150` | Tart | `group_15` | 5 | `vo_char_4021_00_23_hca.hca` | 22.50s | 22.12s | -0.38s |
| `403200` | Matsuri Hinata | `group_16` | 5 | `vo_char_4032_00_23_hca.hca` | 19.50s | 19.12s | -0.38s |
| `405100` | Nanoha Takamachi | `group_36` | 4 | `vo_char_4051_00_43_hca.hca` | 2.80s | 2.42s | -0.38s |
| `100552` | Felicia Mitsuki | `group_33` | 7 | `vo_char_1005_52_41_hca.hca` | 13.50s | 13.11s | -0.39s |
| `100650` | Mifuyu Azusa | `group_28` | 9 | `vo_char_1006_50_36_hca.hca` | 18.50s | 18.11s | -0.39s |
| `100700` | Touka Satomi | `group_7` | 4 | `vo_char_1007_00_14_hca.hca` | 7.20s | 6.81s | -0.39s |
| `100750` | Touka Satomi | `group_7` | 4 | `vo_char_1007_00_14_hca.hca` | 7.20s | 6.81s | -0.39s |
| `100800` | Alina Gray | `group_13` | 6 | `vo_char_1008_00_21_hca.hca` | 12.00s | 11.61s | -0.39s |
| `100850` | Alina Gray | `group_13` | 5 | `vo_char_1008_00_21_hca.hca` | 12.00s | 11.61s | -0.39s |
| `100850` | Alina Gray | `group_26` | 6 | `vo_char_1008_50_34_hca.hca` | 13.50s | 13.11s | -0.39s |
| `100951` | Rena Minami | `group_33` | 5 | `vo_char_1009_51_41_hca.hca` | 13.00s | 12.61s | -0.39s |
| `101000` | Momoko Togame | `group_27` | 8 | `vo_char_1010_00_35_hca.hca` | 10.00s | 9.61s | -0.39s |
| `101200` | Karin Misono | `group_19` | 6 | `vo_char_1012_00_27_hca.hca` | 13.00s | 12.61s | -0.39s |
| `101900` | Tsukasa Amane | `group_10` | 4 | `vo_char_1019_00_18_hca.hca` | 12.00s | 11.61s | -0.39s |
| `101951` | Tsukasa Amane | `group_10` | 3 | `vo_char_1019_00_18_hca.hca` | 12.00s | 11.61s | -0.39s |
| `102400` | Juri Oba | `group_44` | 8 | `vo_game_0502_08_hca.hca` | 18.00s | 18.39s | +0.39s |
| `103200` | Miyuri Yukari | `group_30` | 4 | `vo_char_1032_00_37_hca.hca` | 11.10s | 10.71s | -0.39s |
| `103300` | Rabi Himuro | `group_22` | 6 | `vo_char_1033_00_29_hca.hca` | 16.60s | 16.21s | -0.39s |
| `103350` | Rabi Himuro | `group_26` | 5 | `vo_char_1033_50_33_hca.hca` | 16.00s | 15.61s | -0.39s |
| `103550` | Alexandra Kurusu | `group_19` | 6 | `vo_char_1035_50_26_hca.hca` | 13.80s | 13.41s | -0.39s |
| `103550` | Alexandra Kurusu | `group_20` | 5 | `vo_char_1035_50_27_hca.hca` | 14.50s | 14.11s | -0.39s |
| `103900` | Sudachi Sawa | `group_22` | 5 | `vo_char_1039_00_29_hca.hca` | 7.80s | 8.19s | +0.39s |
| `103902` | Sudachi Sawa | `group_16` | 5 | `vo_char_1039_02_23_hca.hca` | 19.40s | 19.01s | -0.39s |
| `103903` | Sudachi Sawa | `group_16` | 5 | `vo_char_1039_03_23_hca.hca` | 19.40s | 19.01s | -0.39s |
| `104051` | Yozuru Sasame | `group_29` | 5 | `vo_char_1040_51_36_hca.hca` | 13.20s | 12.81s | -0.39s |
| `110100` | Iroha Tamaki | `group_1` | 9 | `vo_char_1101_00_01_hca.hca` | 21.10s | 21.49s | +0.39s |
| `110100` | Iroha Tamaki | `group_36` | 2 | `vo_char_1101_00_44_hca.hca` | 4.00s | 3.61s | -0.39s |
| `110400` | Uwasa Sana | `group_20` | 5 | `vo_char_1104_00_27_hca.hca` | 13.60s | 13.21s | -0.39s |
| `110400` | Uwasa Sana | `group_28` | 6 | `vo_char_1104_00_35_hca.hca` | 13.50s | 13.11s | -0.39s |
| `110400` | Uwasa Sana | `group_33` | 9 | `vo_char_1104_00_40_hca.hca` | 18.00s | 17.61s | -0.39s |
| `111000` | Momoko Togame | `group_1` | 9 | `vo_char_1110_00_01_hca.hca` | 27.40s | 27.79s | +0.39s |
| `111800` | Amane Sisters | `group_26` | 7 | `vo_char_1118_00_33_hca.hca` | 14.70s | 14.31s | -0.39s |
| `113300` | Rabi Himuro | `group_10` | 5 | `vo_char_1133_00_17_hca.hca` | 22.00s | 21.61s | -0.39s |
| `120900` | Rena & Kaede | `group_29` | 6 | `vo_char_1209_00_36_hca.hca` | 14.20s | 14.59s | +0.39s |
| `130102` | Iroha & Yachiyo | `group_30` | 6 | `vo_char_1301_02_37_hca.hca` | 12.30s | 11.91s | -0.39s |
| `200600` | Kyoko Sakura | `group_2` | 5 | `vo_char_2006_00_03_hca.hca` | 5.00s | 4.61s | -0.39s |
| `200600` | Kyoko Sakura | `group_38` | 4 | `vo_char_2006_00_46_hca.hca` | 2.00s | 1.61s | -0.39s |
| `200602` | Kyoko Sakura | `group_2` | 4 | `vo_char_2006_00_03_hca.hca` | 5.00s | 4.61s | -0.39s |
| `200602` | Kyoko Sakura | `group_38` | 3 | `vo_char_2006_00_46_hca.hca` | 2.00s | 1.61s | -0.39s |
| `200650` | Kyoko Sakura | `group_2` | 3 | `vo_char_2006_00_03_hca.hca` | 5.00s | 4.61s | -0.39s |
| `200650` | Kyoko Sakura | `group_38` | 2 | `vo_char_2006_00_46_hca.hca` | 2.00s | 1.61s | -0.39s |
| `200651` | Kyoko Sakura | `group_2` | 2 | `vo_char_2006_00_03_hca.hca` | 5.00s | 4.61s | -0.39s |
| `200653` | Kyoko Sakura | `group_2` | 2 | `vo_char_2006_00_03_hca.hca` | 5.00s | 4.61s | -0.39s |
| `200900` | Mabayu Aki | `group_13` | 3 | `vo_char_2009_00_20_hca.hca` | 6.60s | 6.21s | -0.39s |
| `220200` | Devil Homura | `group_22` | 4 | `vo_char_2202_00_29_hca.hca` | 10.30s | 9.91s | -0.39s |
| `250000` | Holy Mami | `group_2` | 3 | `vo_char_2500_00_03_hca.hca` | 7.00s | 6.61s | -0.39s |
| `250001` | Holy Mami | `group_2` | 3 | `vo_char_2500_00_03_hca.hca` | 7.00s | 6.61s | -0.39s |
| `250100` | Mami Tomoe | `group_26` | 3 | `vo_char_2501_00_33_hca.hca` | 10.90s | 10.51s | -0.39s |
| `260000` | Kyoko Sakura | `group_30` | 4 | `vo_char_2600_00_37_hca.hca` | 13.00s | 12.61s | -0.39s |
| `300250` | Natsuki Utsuho | `group_23` | 4 | `vo_char_3002_50_31_hca.hca` | 12.00s | 11.61s | -0.39s |
| `300500` | Nanaka Tokiwa | `group_38` | 3 | `vo_char_3005_00_46_hca.hca` | 2.50s | 2.11s | -0.39s |
| `300600` | Emiri Kisaki | `group_26` | 7 | `vo_char_3006_00_34_hca.hca` | 10.00s | 9.61s | -0.39s |
| `300700` | Shizuku Hozumi | `group_3` | 4 | `vo_char_3007_00_04_hca.hca` | 5.00s | 4.61s | -0.39s |
| `300750` | Shizuku Hozumi | `group_16` | 4 | `vo_char_3007_50_24_hca.hca` | 14.30s | 13.91s | -0.39s |
| `300750` | Shizuku Hozumi | `group_29` | 2 | `vo_char_3007_50_37_hca.hca` | 10.00s | 9.61s | -0.39s |
| `300750` | Shizuku Hozumi | `group_3` | 2 | `vo_char_3007_00_04_hca.hca` | 5.00s | 4.61s | -0.39s |
| `301400` | Seika Kumi | `group_20` | 6 | `vo_char_3014_00_28_hca.hca` | 12.00s | 11.61s | -0.39s |
| `301700` | Yukika Nanase | `group_36` | 4 | `vo_char_3017_00_43_hca.hca` | 3.00s | 3.39s | +0.39s |
| `302600` | Konoha Shizumi | `group_14` | 6 | `vo_char_3026_00_22_hca.hca` | 18.00s | 18.39s | +0.39s |
| `302600` | Konoha Shizumi | `group_4` | 4 | `vo_char_3026_00_05_hca.hca` | 7.00s | 6.61s | -0.39s |
| `303000` | Konomi Haruna | `group_3` | 5 | `vo_char_3030_00_04_hca.hca` | 5.50s | 5.11s | -0.39s |
| `303051` | Konomi Haruna | `group_3` | 3 | `vo_char_3030_00_04_hca.hca` | 5.50s | 5.11s | -0.39s |
| `303400` | Moka Megumi | `group_11` | 5 | `vo_char_3034_00_18_hca.hca` | 13.00s | 12.61s | -0.39s |
| `303400` | Moka Megumi | `group_34` | 5 | `vo_char_3034_00_41_hca.hca` | 14.00s | 13.61s | -0.39s |
| `304300` | Eternal Sakura | `group_14` | 5 | `vo_char_3043_00_21_hca.hca` | 21.00s | 20.61s | -0.39s |
| `304400` | Ranka Chizu | `group_30` | 4 | `vo_char_3044_00_37_hca.hca` | 15.90s | 15.51s | -0.39s |
| `304700` | Chika Aoba | `group_9` | 5 | `vo_char_3047_00_16_hca.hca` | 11.20s | 10.81s | -0.39s |
| `304950` | Kanae Yukino | `group_22` | 3 | `vo_char_3049_50_30_hca.hca` | 10.00s | 9.61s | -0.39s |
| `305000` | Yuuna Kaharu | `group_20` | 5 | `vo_char_3050_00_27_hca.hca` | 11.30s | 10.91s | -0.39s |
| `305400` | Mitsune Miwa | `group_33` | 5 | `vo_char_3054_00_40_hca.hca` | 15.10s | 14.71s | -0.39s |
| `305900` | Kushu Irina | `group_11` | 5 | `vo_char_3059_00_18_hca.hca` | 16.60s | 16.21s | -0.39s |
| `350100` | Rika & Ren | `group_16` | 4 | `vo_char_3501_00_23_hca.hca` | 17.30s | 16.91s | -0.39s |
| `350100` | Rika & Ren | `group_17` | 4 | `vo_char_3501_00_24_hca.hca` | 12.10s | 11.71s | -0.39s |
| `400100` | Oriko Mikuni | `group_21` | 5 | `vo_char_4001_00_29_hca.hca` | 12.50s | 12.11s | -0.39s |
| `400100` | Oriko Mikuni | `group_6` | 5 | `vo_char_4001_00_14_hca.hca` | 7.00s | 6.61s | -0.39s |
| `400200` | Kirika Kure | `group_15` | 11 | `vo_char_4002_00_23_hca.hca` | 22.00s | 21.61s | -0.39s |
| `400200` | Kirika Kure | `group_30` | 7 | `vo_char_4002_00_38_hca.hca` | 14.00s | 13.61s | -0.39s |
| `400300` | Yuma Chitose | `group_12` | 4 | `vo_char_4003_00_20_hca.hca` | 4.50s | 4.11s | -0.39s |
| `402500` | Corbeau | `group_3` | 3 | `vo_char_4025_00_03_hca.hca` | 6.50s | 6.11s | -0.39s |
| `402600` | Elisa | `group_12` | 2 | `vo_char_4026_00_19_hca.hca` | 5.00s | 4.61s | -0.39s |
| `403200` | Matsuri Hinata | `group_22` | 3 | `vo_char_4032_00_29_hca.hca` | 11.30s | 10.91s | -0.39s |
| `403500` | Haruka Kanade | `group_24` | 4 | `vo_char_4035_00_31_hca.hca` | 12.20s | 11.81s | -0.39s |
| `404500` | Tsubasa Hanekawa | `group_28` | 4 | `vo_char_4045_00_35_hca.hca` | 12.00s | 11.61s | -0.39s |
| `404600` | Shinobu Oshino | `group_25` | 3 | `vo_char_4046_00_32_hca.hca` | 10.80s | 10.41s | -0.39s |
| `404600` | Shinobu Oshino | `group_7` | 2 | `vo_char_4046_00_14_hca.hca` | 6.00s | 5.61s | -0.39s |
| `405200` | Fate | `group_32` | 6 | `vo_char_4052_00_39_hca.hca` | 13.50s | 13.11s | -0.39s |
| `100153` | Iroha Tamaki | `group_28` | 4 | `vo_char_1001_53_36_hca.hca` | 13.10s | 12.70s | -0.40s |
| `100550` | Felicia Mitsuki | `group_27` | 5 | `vo_char_1005_50_35_hca.hca` | 12.50s | 12.10s | -0.40s |
| `101152` | Kaede Akino | `group_23` | 6 | `vo_char_1011_52_31_hca.hca` | 16.10s | 15.70s | -0.40s |
| `101700` | Mitama Yakumo | `group_19` | 4 | `vo_char_1017_00_27_hca.hca` | 11.70s | 11.30s | -0.40s |
| `101701` | Mitama Yakumo | `group_19` | 4 | `vo_char_1017_00_27_hca.hca` | 11.70s | 11.30s | -0.40s |
| `101701` | Mitama Yakumo | `group_52` | 6 | `vo_game_0202_12_hca.hca` | 13.40s | 13.00s | -0.40s |
| `101751` | Mitama Yakumo | `group_19` | 4 | `vo_char_1017_00_27_hca.hca` | 11.70s | 11.30s | -0.40s |
| `101951` | Tsukasa Amane | `group_23` | 4 | `vo_char_1019_51_31_hca.hca` | 11.00s | 11.40s | +0.40s |
| `102400` | Juri Oba | `group_13` | 4 | `vo_char_1024_00_20_hca.hca` | 5.00s | 4.60s | -0.40s |
| `102650` | Chiharu Hiroe | `group_18` | 6 | `vo_char_1026_50_25_hca.hca` | 13.00s | 12.60s | -0.40s |
| `102800` | Himena Aika | `group_18` | 5 | `vo_char_1028_00_25_hca.hca` | 10.50s | 10.10s | -0.40s |
| `102900` | Shigure Miyabi | `group_3` | 2 | `vo_char_1029_00_03_hca.hca` | 7.00s | 6.60s | -0.40s |
| `102900` | Shigure Miyabi | `group_34` | 5 | `vo_char_1029_00_41_hca.hca` | 16.20s | 15.80s | -0.40s |
| `102950` | Shigure Miyabi | `group_3` | 2 | `vo_char_1029_00_03_hca.hca` | 7.00s | 6.60s | -0.40s |
| `103200` | Miyuri Yukari | `group_33` | 4 | `vo_char_1032_00_40_hca.hca` | 13.00s | 12.60s | -0.40s |
| `103400` | Asahi Miura | `group_17` | 4 | `vo_char_1034_00_24_hca.hca` | 11.00s | 10.60s | -0.40s |
| `103550` | Alexandra Kurusu | `group_23` | 4 | `vo_char_1035_50_30_hca.hca` | 8.90s | 8.50s | -0.40s |
| `103600` | Urara Yume | `group_21` | 7 | `vo_char_1036_00_28_hca.hca` | 12.70s | 12.30s | -0.40s |
| `103700` | Nayuta Satomi | `group_9` | 5 | `vo_char_1037_00_16_hca.hca` | 13.00s | 12.60s | -0.40s |
| `105302` | Amaryllis | `group_38` | 2 | `vo_char_1053_00_45_hca.hca` | 3.50s | 3.10s | -0.40s |
| `110100` | Iroha Tamaki | `group_11` | 4 | `vo_char_1101_00_19_hca.hca` | 7.00s | 6.60s | -0.40s |
| `110100` | Iroha Tamaki | `group_17` | 5 | `vo_char_1101_00_25_hca.hca` | 12.90s | 12.50s | -0.40s |
| `110400` | Uwasa Sana | `group_30` | 6 | `vo_char_1104_00_37_hca.hca` | 13.40s | 13.00s | -0.40s |
| `110700` | Touka & Nemu | `group_13` | 3 | `vo_char_1107_00_20_hca.hca` | 6.10s | 5.70s | -0.40s |
| `110701` | Touka & Nemu | `group_13` | 2 | `vo_char_1107_00_20_hca.hca` | 6.10s | 5.70s | -0.40s |
| `110702` | Touka & Nemu | `group_13` | 2 | `vo_char_1107_00_20_hca.hca` | 6.10s | 5.70s | -0.40s |
| `110800` | Holy Alina | `group_28` | 5 | `vo_char_1108_00_35_hca.hca` | 12.30s | 11.90s | -0.40s |
| `120902` | Rena & Kaede | `group_34` | 5 | `vo_char_1209_02_41_hca.hca` | 14.00s | 13.60s | -0.40s |
| `200600` | Kyoko Sakura | `group_11` | 5 | `vo_char_2006_00_19_hca.hca` | 5.50s | 5.10s | -0.40s |
| `200602` | Kyoko Sakura | `group_11` | 4 | `vo_char_2006_00_19_hca.hca` | 5.50s | 5.10s | -0.40s |
| `200650` | Kyoko Sakura | `group_11` | 3 | `vo_char_2006_00_19_hca.hca` | 5.50s | 5.10s | -0.40s |
| `200650` | Kyoko Sakura | `group_28` | 5 | `vo_char_2006_50_36_hca.hca` | 11.30s | 10.90s | -0.40s |
| `200650` | Kyoko Sakura | `group_31` | 8 | `vo_char_2006_50_39_hca.hca` | 11.90s | 11.50s | -0.40s |
| `200651` | Kyoko Sakura | `group_11` | 2 | `vo_char_2006_00_19_hca.hca` | 5.50s | 5.10s | -0.40s |
| `200653` | Kyoko Sakura | `group_11` | 2 | `vo_char_2006_00_19_hca.hca` | 5.50s | 5.10s | -0.40s |
| `200700` | Nagisa Momoe | `group_13` | 4 | `vo_char_2007_00_20_hca.hca` | 6.30s | 5.90s | -0.40s |
| `210000` | Madoka Kaname | `group_22` | 5 | `vo_char_2100_00_30_hca.hca` | 14.20s | 13.80s | -0.40s |
| `250000` | Holy Mami | `group_31` | 3 | `vo_char_2500_00_39_hca.hca` | 10.00s | 9.60s | -0.40s |
| `250001` | Holy Mami | `group_30` | 5 | `vo_char_2500_01_38_hca.hca` | 11.00s | 10.60s | -0.40s |
| `300300` | Hinano Miyako | `group_22` | 5 | `vo_char_3003_00_30_hca.hca` | 10.00s | 9.60s | -0.40s |
| `300300` | Hinano Miyako | `group_28` | 5 | `vo_char_3003_00_36_hca.hca` | 9.50s | 9.10s | -0.40s |
| `300500` | Nanaka Tokiwa | `group_30` | 7 | `vo_char_3005_00_38_hca.hca` | 13.00s | 12.60s | -0.40s |
| `301900` | Ayaka Mariko | `group_16` | 6 | `vo_char_3019_00_24_hca.hca` | 11.80s | 11.40s | -0.40s |
| `302100` | Sakuya Suzuka | `group_11` | 6 | `vo_char_3021_00_18_hca.hca` | 15.10s | 15.50s | +0.40s |
| `302800` | Ayame Mikuri | `group_27` | 7 | `vo_char_3028_00_35_hca.hca` | 11.20s | 10.80s | -0.40s |
| `302900` | Masara Kagami | `group_18` | 4 | `vo_char_3029_00_26_hca.hca` | 10.50s | 10.90s | +0.40s |
| `303000` | Konomi Haruna | `group_6` | 6 | `vo_char_3030_00_14_hca.hca` | 6.00s | 5.60s | -0.40s |
| `303051` | Konomi Haruna | `group_6` | 4 | `vo_char_3030_00_14_hca.hca` | 6.00s | 5.60s | -0.40s |
| `303200` | Mayu Kozue | `group_26` | 8 | `vo_char_3032_00_34_hca.hca` | 16.50s | 16.10s | -0.40s |
| `303300` | Sayuki Fumino | `group_15` | 6 | `vo_char_3033_00_22_hca.hca` | 22.00s | 21.60s | -0.40s |
| `303300` | Sayuki Fumino | `group_28` | 6 | `vo_char_3033_00_35_hca.hca` | 14.00s | 14.40s | +0.40s |
| `303300` | Sayuki Fumino | `group_6` | 5 | `vo_char_3033_00_13_hca.hca` | 7.80s | 7.40s | -0.40s |
| `303350` | Sayuki Fumino | `group_15` | 5 | `vo_char_3033_00_22_hca.hca` | 22.00s | 21.60s | -0.40s |
| `303350` | Sayuki Fumino | `group_6` | 4 | `vo_char_3033_00_13_hca.hca` | 7.80s | 7.40s | -0.40s |
| `303400` | Moka Megumi | `group_30` | 6 | `vo_char_3034_00_37_hca.hca` | 16.00s | 15.60s | -0.40s |
| `303500` | Riko Chiaki | `group_9` | 4 | `vo_char_3035_00_16_hca.hca` | 11.00s | 10.60s | -0.40s |
| `304400` | Ranka Chizu | `group_14` | 4 | `vo_char_3044_00_21_hca.hca` | 14.00s | 13.60s | -0.40s |
| `304600` | Ryo Midori | `group_31` | 5 | `vo_char_3046_00_38_hca.hca` | 10.30s | 9.90s | -0.40s |
| `304800` | Hotaru Yura | `group_19` | 5 | `vo_char_3048_00_26_hca.hca` | 16.30s | 16.70s | +0.40s |
| `304800` | Hotaru Yura | `group_34` | 6 | `vo_char_3048_00_41_hca.hca` | 17.10s | 16.70s | -0.40s |
| `304900` | Kanae Yukino | `group_32` | 5 | `vo_char_3049_00_40_hca.hca` | 11.00s | 10.60s | -0.40s |
| `304900` | Kanae Yukino | `group_33` | 6 | `vo_char_3049_00_41_hca.hca` | 12.30s | 11.90s | -0.40s |
| `305000` | Yuuna Kaharu | `group_12` | 3 | `vo_char_3050_00_19_hca.hca` | 5.40s | 5.00s | -0.40s |
| `305000` | Yuuna Kaharu | `group_4` | 3 | `vo_char_3050_00_04_hca.hca` | 4.40s | 4.00s | -0.40s |
| `400100` | Oriko Mikuni | `group_7` | 6 | `vo_char_4001_00_15_hca.hca` | 7.00s | 6.60s | -0.40s |
| `400200` | Kirika Kure | `group_10` | 7 | `vo_char_4002_00_18_hca.hca` | 14.50s | 14.10s | -0.40s |
| `400200` | Kirika Kure | `group_18` | 5 | `vo_char_4002_00_26_hca.hca` | 11.00s | 10.60s | -0.40s |
| `402100` | Tart | `group_41` | 3 | `vo_char_4021_00_65_hca.hca` | 3.00s | 2.60s | -0.40s |
| `402100` | Tart | `group_6` | 3 | `vo_char_4021_00_14_hca.hca` | 4.00s | 3.60s | -0.40s |
| `402100` | Tart | `group_8` | 6 | `vo_char_4021_00_16_hca.hca` | 15.10s | 14.70s | -0.40s |
| `402150` | Tart | `group_8` | 4 | `vo_char_4021_00_16_hca.hca` | 15.10s | 14.70s | -0.40s |
| `402500` | Corbeau | `group_30` | 4 | `vo_char_4025_00_37_hca.hca` | 14.00s | 13.60s | -0.40s |
| `405300` | Hayate Yagami | `group_39` | 3 | `vo_char_4053_00_46_hca.hca` | 2.00s | 1.60s | -0.40s |
| `100352` | Tsuruno Yui | `group_29` | 6 | `vo_char_1003_52_37_hca.hca` | 19.00s | 18.59s | -0.41s |
| `100550` | Felicia Mitsuki | `group_28` | 5 | `vo_char_1005_50_36_hca.hca` | 13.00s | 13.41s | +0.41s |
| `101000` | Momoko Togame | `group_5` | 5 | `vo_char_1010_00_13_hca.hca` | 5.50s | 5.09s | -0.41s |
| `101051` | Momoko Togame | `group_5` | 4 | `vo_char_1010_00_13_hca.hca` | 5.50s | 5.09s | -0.41s |
| `101100` | Kaede Akino | `group_2` | 4 | `vo_char_1011_00_03_hca.hca` | 6.50s | 6.09s | -0.41s |
| `101150` | Kaede Akino | `group_2` | 3 | `vo_char_1011_00_03_hca.hca` | 6.50s | 6.09s | -0.41s |
| `101152` | Kaede Akino | `group_2` | 2 | `vo_char_1011_00_03_hca.hca` | 6.50s | 6.09s | -0.41s |
| `101200` | Karin Misono | `group_2` | 5 | `vo_char_1012_00_03_hca.hca` | 6.00s | 5.59s | -0.41s |
| `101250` | Karin Misono | `group_2` | 4 | `vo_char_1012_00_03_hca.hca` | 6.00s | 5.59s | -0.41s |
| `101300` | Asuka Tatsuki | `group_35` | 4 | `vo_char_1013_00_43_hca.hca` | 2.50s | 2.09s | -0.41s |
| `101300` | Asuka Tatsuki | `group_9` | 7 | `vo_char_1013_00_17_hca.hca` | 12.50s | 12.09s | -0.41s |
| `101800` | Tsukuyo Amane | `group_28` | 6 | `vo_char_1018_00_36_hca.hca` | 13.00s | 12.59s | -0.41s |
| `101850` | Tsukuyo Amane | `group_26` | 3 | `vo_char_1018_50_34_hca.hca` | 14.00s | 13.59s | -0.41s |
| `102250` | Hikaru Kirari | `group_33` | 6 | `vo_char_1022_50_40_hca.hca` | 12.20s | 11.79s | -0.41s |
| `102350` | Ao Kasane | `group_22` | 6 | `vo_char_1023_50_29_hca.hca` | 19.00s | 18.59s | -0.41s |
| `103200` | Miyuri Yukari | `group_8` | 3 | `vo_char_1032_00_15_hca.hca` | 10.10s | 9.69s | -0.41s |
| `103500` | Alexandra Kurusu | `group_38` | 2 | `vo_char_1035_00_45_hca.hca` | 3.00s | 2.59s | -0.41s |
| `103600` | Urara Yume | `group_18` | 5 | `vo_char_1036_00_25_hca.hca` | 12.70s | 12.29s | -0.41s |
| `104400` | Mikoto Sena | `group_19` | 5 | `vo_char_1044_00_26_hca.hca` | 10.60s | 10.19s | -0.41s |
| `104400` | Mikoto Sena | `group_33` | 4 | `vo_char_1044_00_40_hca.hca` | 13.10s | 12.69s | -0.41s |
| `110100` | Iroha Tamaki | `group_20` | 4 | `vo_char_1101_00_28_hca.hca` | 10.00s | 9.59s | -0.41s |
| `111200` | Karin & Alina | `group_12` | 3 | `vo_char_1112_00_19_hca.hca` | 6.50s | 6.09s | -0.41s |
| `111200` | Karin & Alina | `group_39` | 3 | `vo_char_1112_00_46_hca.hca` | 5.70s | 5.29s | -0.41s |
| `111201` | Karin & Alina | `group_12` | 2 | `vo_char_1112_00_19_hca.hca` | 6.50s | 6.09s | -0.41s |
| `111201` | Karin & Alina | `group_39` | 2 | `vo_char_1112_00_46_hca.hca` | 5.70s | 5.29s | -0.41s |
| `111202` | Karin & Alina | `group_12` | 2 | `vo_char_1112_00_19_hca.hca` | 6.50s | 6.09s | -0.41s |
| `111202` | Karin & Alina | `group_39` | 2 | `vo_char_1112_00_46_hca.hca` | 5.70s | 5.29s | -0.41s |
| `120100` | Iroha-chan | `group_36` | 2 | `vo_char_1201_00_43_hca.hca` | 3.20s | 2.79s | -0.41s |
| `180101` | Iroha & Kuroe | `group_28` | 7 | `vo_char_1801_01_35_hca.hca` | 13.60s | 13.19s | -0.41s |
| `200200` | Homura Akemi | `group_8` | 3 | `vo_char_2002_00_15_hca.hca` | 6.00s | 5.59s | -0.41s |
| `250100` | Mami Tomoe | `group_30` | 4 | `vo_char_2501_00_37_hca.hca` | 14.80s | 14.39s | -0.41s |
| `300300` | Hinano Miyako | `group_42` | 4 | `vo_char_3003_00_66_hca.hca` | 5.50s | 5.09s | -0.41s |
| `300351` | Hinano Miyako | `group_22` | 4 | `vo_char_3003_51_30_hca.hca` | 9.80s | 9.39s | -0.41s |
| `300351` | Hinano Miyako | `group_33` | 6 | `vo_char_3003_51_41_hca.hca` | 11.70s | 11.29s | -0.41s |
| `300351` | Hinano Miyako | `group_42` | 3 | `vo_char_3003_00_66_hca.hca` | 5.50s | 5.09s | -0.41s |
| `300400` | Sasara Minagi | `group_21` | 5 | `vo_char_3004_00_29_hca.hca` | 13.00s | 12.59s | -0.41s |
| `300400` | Sasara Minagi | `group_3` | 5 | `vo_char_3004_00_04_hca.hca` | 8.50s | 8.09s | -0.41s |
| `300500` | Nanaka Tokiwa | `group_27` | 5 | `vo_char_3005_00_35_hca.hca` | 11.50s | 11.09s | -0.41s |
| `300500` | Nanaka Tokiwa | `group_39` | 4 | `vo_char_3005_00_63_hca.hca` | 4.00s | 3.59s | -0.41s |
| `300600` | Emiri Kisaki | `group_1` | 16 | `vo_char_3006_00_01_hca.hca` | 23.20s | 23.61s | +0.41s |
| `300651` | Emiri Kisaki | `group_1` | 14 | `vo_char_3006_00_01_hca.hca` | 23.20s | 23.61s | +0.41s |
| `301650` | Kokoro Awane | `group_17` | 8 | `vo_char_3016_50_25_hca.hca` | 16.00s | 15.59s | -0.41s |
| `301700` | Yukika Nanase | `group_9` | 4 | `vo_char_3017_00_16_hca.hca` | 11.20s | 10.79s | -0.41s |
| `302100` | Sakuya Suzuka | `group_12` | 3 | `vo_char_3021_00_19_hca.hca` | 5.50s | 5.91s | +0.41s |
| `302300` | Aimi Eri | `group_8` | 9 | `vo_char_3023_00_16_hca.hca` | 10.40s | 10.81s | +0.41s |
| `302551` | Ren Isuzu | `group_20` | 6 | `vo_char_3025_51_28_hca.hca` | 18.50s | 18.09s | -0.41s |
| `302900` | Masara Kagami | `group_3` | 2 | `vo_char_3029_00_04_hca.hca` | 5.00s | 5.41s | +0.41s |
| `302950` | Masara Kagami | `group_3` | 2 | `vo_char_3029_00_04_hca.hca` | 5.00s | 5.41s | +0.41s |
| `303000` | Konomi Haruna | `group_42` | 4 | `vo_char_3030_00_66_hca.hca` | 4.00s | 3.59s | -0.41s |
| `303000` | Konomi Haruna | `group_7` | 4 | `vo_char_3030_00_15_hca.hca` | 6.00s | 5.59s | -0.41s |
| `303051` | Konomi Haruna | `group_42` | 2 | `vo_char_3030_00_66_hca.hca` | 4.00s | 3.59s | -0.41s |
| `303051` | Konomi Haruna | `group_7` | 2 | `vo_char_3030_00_15_hca.hca` | 6.00s | 5.59s | -0.41s |
| `303300` | Sayuki Fumino | `group_4` | 4 | `vo_char_3033_00_04_hca.hca` | 7.00s | 6.59s | -0.41s |
| `303350` | Sayuki Fumino | `group_4` | 3 | `vo_char_3033_00_04_hca.hca` | 7.00s | 6.59s | -0.41s |
| `303500` | Riko Chiaki | `group_36` | 3 | `vo_char_3035_00_43_hca.hca` | 3.80s | 3.39s | -0.41s |
| `303700` | Mel Anna | `group_13` | 4 | `vo_char_3037_00_21_hca.hca` | 13.20s | 12.79s | -0.41s |
| `303751` | Mel Anna | `group_13` | 3 | `vo_char_3037_00_21_hca.hca` | 13.20s | 12.79s | -0.41s |
| `304400` | Ranka Chizu | `group_15` | 4 | `vo_char_3044_00_22_hca.hca` | 19.00s | 18.59s | -0.41s |
| `304400` | Ranka Chizu | `group_37` | 3 | `vo_char_3044_00_44_hca.hca` | 4.50s | 4.09s | -0.41s |
| `304650` | Ryo Midori | `group_28` | 7 | `vo_char_3046_50_35_hca.hca` | 11.00s | 11.41s | +0.41s |
| `305400` | Mitsune Miwa | `group_10` | 4 | `vo_char_3054_00_17_hca.hca` | 13.00s | 12.59s | -0.41s |
| `400100` | Oriko Mikuni | `group_36` | 3 | `vo_char_4001_00_44_hca.hca` | 2.00s | 1.59s | -0.41s |
| `400200` | Kirika Kure | `group_28` | 6 | `vo_char_4002_00_36_hca.hca` | 8.50s | 8.09s | -0.41s |
| `401100` | Kazumi | `group_25` | 5 | `vo_char_4011_00_33_hca.hca` | 12.00s | 11.59s | -0.41s |
| `401200` | Umika Misaki | `group_19` | 4 | `vo_char_4012_00_27_hca.hca` | 9.00s | 8.59s | -0.41s |
| `401200` | Umika Misaki | `group_5` | 5 | `vo_char_4012_00_13_hca.hca` | 7.00s | 6.59s | -0.41s |
| `402700` | Lapin | `group_4` | 2 | `vo_char_4027_00_04_hca.hca` | 3.50s | 3.09s | -0.41s |
| `404500` | Tsubasa Hanekawa | `group_12` | 2 | `vo_char_4045_00_19_hca.hca` | 6.50s | 6.09s | -0.41s |
| `404500` | Tsubasa Hanekawa | `group_30` | 2 | `vo_char_4045_00_37_hca.hca` | 10.15s | 9.74s | -0.41s |
| `405300` | Hayate Yagami | `group_15` | 8 | `vo_char_4053_00_22_hca.hca` | 20.40s | 19.99s | -0.41s |
| `100351` | Tsuruno Yui | `group_29` | 5 | `vo_char_1003_51_37_hca.hca` | 11.00s | 11.42s | +0.42s |
| `100452` | Sana Futaba | `group_22` | 5 | `vo_char_1004_52_30_hca.hca` | 13.00s | 12.58s | -0.42s |
| `100503` | Felicia Mitsuki | `group_33` | 5 | `vo_char_1005_03_41_hca.hca` | 11.00s | 10.58s | -0.42s |
| `100900` | Rena Minami | `group_13` | 5 | `vo_char_1009_00_21_hca.hca` | 11.50s | 11.08s | -0.42s |
| `100950` | Rena Minami | `group_13` | 4 | `vo_char_1009_00_21_hca.hca` | 11.50s | 11.08s | -0.42s |
| `100951` | Rena Minami | `group_13` | 4 | `vo_char_1009_00_21_hca.hca` | 11.50s | 11.08s | -0.42s |
| `101051` | Momoko Togame | `group_22` | 5 | `vo_char_1010_51_30_hca.hca` | 13.00s | 12.58s | -0.42s |
| `101100` | Kaede Akino | `group_20` | 7 | `vo_char_1011_00_28_hca.hca` | 12.50s | 12.08s | -0.42s |
| `101100` | Kaede Akino | `group_23` | 8 | `vo_char_1011_00_31_hca.hca` | 15.50s | 15.08s | -0.42s |
| `101150` | Kaede Akino | `group_28` | 5 | `vo_char_1011_50_36_hca.hca` | 15.00s | 14.58s | -0.42s |
| `101800` | Tsukuyo Amane | `group_16` | 6 | `vo_char_1018_00_24_hca.hca` | 15.00s | 14.58s | -0.42s |
| `101800` | Tsukuyo Amane | `group_3` | 3 | `vo_char_1018_00_04_hca.hca` | 5.00s | 4.58s | -0.42s |
| `101850` | Tsukuyo Amane | `group_3` | 2 | `vo_char_1018_00_04_hca.hca` | 5.00s | 4.58s | -0.42s |
| `101900` | Tsukasa Amane | `group_27` | 4 | `vo_char_1019_00_35_hca.hca` | 10.00s | 9.58s | -0.42s |
| `102350` | Ao Kasane | `group_28` | 5 | `vo_char_1023_50_35_hca.hca` | 13.20s | 12.78s | -0.42s |
| `102600` | Chiharu Hiroe | `group_38` | 3 | `vo_char_1026_00_45_hca.hca` | 3.30s | 2.88s | -0.42s |
| `102650` | Chiharu Hiroe | `group_38` | 2 | `vo_char_1026_00_45_hca.hca` | 3.30s | 2.88s | -0.42s |
| `102651` | Chiharu Hiroe | `group_38` | 2 | `vo_char_1026_00_45_hca.hca` | 3.30s | 2.88s | -0.42s |
| `102850` | Himena Aika | `group_19` | 5 | `vo_char_1028_50_26_hca.hca` | 14.60s | 14.18s | -0.42s |
| `103100` | San Kagura | `group_16` | 6 | `vo_char_1031_00_23_hca.hca` | 21.20s | 20.78s | -0.42s |
| `103150` | San Kagura | `group_16` | 5 | `vo_char_1031_00_23_hca.hca` | 21.20s | 20.78s | -0.42s |
| `103350` | Rabi Himuro | `group_25` | 5 | `vo_char_1033_50_32_hca.hca` | 16.00s | 16.42s | +0.42s |
| `103600` | Urara Yume | `group_17` | 6 | `vo_char_1036_00_24_hca.hca` | 13.00s | 12.58s | -0.42s |
| `103902` | Sudachi Sawa | `group_29` | 4 | `vo_char_1039_02_36_hca.hca` | 9.20s | 8.78s | -0.42s |
| `103903` | Sudachi Sawa | `group_29` | 4 | `vo_char_1039_03_36_hca.hca` | 9.20s | 8.78s | -0.42s |
| `104100` | Livia Medeiros | `group_11` | 4 | `vo_char_1041_00_18_hca.hca` | 12.50s | 12.08s | -0.42s |
| `110700` | Touka & Nemu | `group_15` | 7 | `vo_char_1107_00_22_hca.hca` | 21.00s | 20.58s | -0.42s |
| `110701` | Touka & Nemu | `group_15` | 6 | `vo_char_1107_00_22_hca.hca` | 21.00s | 20.58s | -0.42s |
| `110702` | Touka & Nemu | `group_15` | 6 | `vo_char_1107_00_22_hca.hca` | 21.00s | 20.58s | -0.42s |
| `114400` | Uwasa Mikoto | `group_10` | 5 | `vo_char_1144_00_17_hca.hca` | 11.30s | 10.88s | -0.42s |
| `200600` | Kyoko Sakura | `group_17` | 10 | `vo_char_2006_00_25_hca.hca` | 18.00s | 17.58s | -0.42s |
| `200700` | Nagisa Momoe | `group_7` | 3 | `vo_char_2007_00_14_hca.hca` | 5.00s | 4.58s | -0.42s |
| `210100` | Ultimate Madoka | `group_29` | 4 | `vo_char_2101_00_37_hca.hca` | 10.80s | 10.38s | -0.42s |
| `250001` | Holy Mami | `group_33` | 4 | `vo_char_2500_01_41_hca.hca` | 11.00s | 10.58s | -0.42s |
| `260000` | Kyoko Sakura | `group_12` | 4 | `vo_char_2600_00_19_hca.hca` | 7.00s | 6.58s | -0.42s |
| `260200` | Kyoko Sakura | `group_21` | 5 | `vo_char_2602_00_28_hca.hca` | 13.00s | 12.58s | -0.42s |
| `300750` | Shizuku Hozumi | `group_22` | 3 | `vo_char_3007_50_30_hca.hca` | 14.00s | 13.58s | -0.42s |
| `301100` | Kako Natsume | `group_32` | 5 | `vo_char_3011_00_40_hca.hca` | 12.00s | 11.58s | -0.42s |
| `301300` | Leila Ibuki | `group_37` | 3 | `vo_char_3013_00_45_hca.hca` | 3.00s | 2.58s | -0.42s |
| `301600` | Kokoro Awane | `group_40` | 4 | `vo_char_3016_00_64_hca.hca` | 4.00s | 3.58s | -0.42s |
| `301650` | Kokoro Awane | `group_40` | 3 | `vo_char_3016_00_64_hca.hca` | 4.00s | 3.58s | -0.42s |
| `301800` | Hanna Sarasa | `group_1` | 8 | `vo_char_3018_00_01_hca.hca` | 26.00s | 25.58s | -0.42s |
| `301800` | Hanna Sarasa | `group_17` | 4 | `vo_char_3018_00_24_hca.hca` | 14.00s | 13.58s | -0.42s |
| `302100` | Sakuya Suzuka | `group_17` | 5 | `vo_char_3021_00_24_hca.hca` | 12.50s | 12.92s | +0.42s |
| `302100` | Sakuya Suzuka | `group_31` | 6 | `vo_char_3021_00_38_hca.hca` | 10.30s | 10.72s | +0.42s |
| `303300` | Sayuki Fumino | `group_36` | 3 | `vo_char_3033_00_43_hca.hca` | 2.80s | 2.38s | -0.42s |
| `303350` | Sayuki Fumino | `group_36` | 2 | `vo_char_3033_00_43_hca.hca` | 2.80s | 2.38s | -0.42s |
| `303400` | Moka Megumi | `group_1` | 10 | `vo_char_3034_00_01_hca.hca` | 28.00s | 27.58s | -0.42s |
| `303551` | Riko Chiaki | `group_10` | 3 | `vo_char_3035_00_18_hca.hca` | 13.20s | 12.78s | -0.42s |
| `304400` | Ranka Chizu | `group_33` | 5 | `vo_char_3044_00_40_hca.hca` | 16.00s | 15.58s | -0.42s |
| `304651` | Ryo Midori | `group_17` | 5 | `vo_char_3046_51_24_hca.hca` | 12.00s | 11.58s | -0.42s |
| `304900` | Kanae Yukino | `group_30` | 3 | `vo_char_3049_00_38_hca.hca` | 13.80s | 13.38s | -0.42s |
| `350400` | Masara & Kokoro | `group_17` | 7 | `vo_char_3504_00_24_hca.hca` | 17.30s | 16.88s | -0.42s |
| `350401` | Masara & Kokoro | `group_23` | 4 | `vo_char_3504_01_30_hca.hca` | 13.10s | 12.68s | -0.42s |
| `390200` | Shi | `group_1` | 8 | `vo_char_3902_00_01_hca.hca` | 23.90s | 24.32s | +0.42s |
| `400200` | Kirika Kure | `group_23` | 7 | `vo_char_4002_00_31_hca.hca` | 12.00s | 11.58s | -0.42s |
| `400300` | Yuma Chitose | `group_8` | 7 | `vo_char_4003_00_16_hca.hca` | 9.50s | 9.08s | -0.42s |
| `402300` | Melissa | `group_17` | 5 | `vo_char_4023_00_25_hca.hca` | 9.00s | 8.58s | -0.42s |
| `402500` | Corbeau | `group_25` | 5 | `vo_char_4025_00_32_hca.hca` | 12.30s | 11.88s | -0.42s |
| `402650` | Elisa | `group_24` | 4 | `vo_char_4026_50_31_hca.hca` | 14.00s | 13.58s | -0.42s |
| `404400` | Nadeko Sengoku | `group_25` | 4 | `vo_char_4044_00_33_hca.hca` | 16.90s | 16.48s | -0.42s |
| `404500` | Tsubasa Hanekawa | `group_3` | 2 | `vo_char_4045_00_03_hca.hca` | 5.50s | 5.08s | -0.42s |
| `404600` | Shinobu Oshino | `group_5` | 2 | `vo_char_4046_00_05_hca.hca` | 6.30s | 5.88s | -0.42s |
| `405100` | Nanoha Takamachi | `group_2` | 6 | `vo_char_4051_00_02_hca.hca` | 9.50s | 9.08s | -0.42s |
| `405300` | Hayate Yagami | `group_8` | 4 | `vo_char_4053_00_15_hca.hca` | 5.00s | 4.58s | -0.42s |
| `412103` | Isabeau | `group_29` | 4 | `vo_char_4121_03_36_hca.hca` | 10.00s | 9.58s | -0.42s |
| `100650` | Mifuyu Azusa | `group_19` | 5 | `vo_char_1006_50_27_hca.hca` | 11.60s | 11.17s | -0.43s |
| `100900` | Rena Minami | `group_17` | 8 | `vo_char_1009_00_25_hca.hca` | 10.50s | 10.07s | -0.43s |
| `100900` | Rena Minami | `group_40` | 4 | `vo_char_1009_00_64_hca.hca` | 4.00s | 3.57s | -0.43s |
| `100950` | Rena Minami | `group_40` | 3 | `vo_char_1009_00_64_hca.hca` | 4.00s | 3.57s | -0.43s |
| `100951` | Rena Minami | `group_40` | 3 | `vo_char_1009_00_64_hca.hca` | 4.00s | 3.57s | -0.43s |
| `101000` | Momoko Togame | `group_35` | 4 | `vo_char_1010_00_43_hca.hca` | 2.50s | 2.07s | -0.43s |
| `101051` | Momoko Togame | `group_35` | 3 | `vo_char_1010_00_43_hca.hca` | 2.50s | 2.07s | -0.43s |
| `101100` | Kaede Akino | `group_6` | 7 | `vo_char_1011_00_14_hca.hca` | 8.00s | 7.57s | -0.43s |
| `101150` | Kaede Akino | `group_6` | 6 | `vo_char_1011_00_14_hca.hca` | 8.00s | 7.57s | -0.43s |
| `101152` | Kaede Akino | `group_6` | 5 | `vo_char_1011_00_14_hca.hca` | 8.00s | 7.57s | -0.43s |
| `101200` | Karin Misono | `group_3` | 4 | `vo_char_1012_00_04_hca.hca` | 5.20s | 4.77s | -0.43s |
| `101250` | Karin Misono | `group_3` | 3 | `vo_char_1012_00_04_hca.hca` | 5.20s | 4.77s | -0.43s |
| `101400` | Nemu Hiiragi | `group_4` | 3 | `vo_char_1014_00_04_hca.hca` | 5.50s | 5.07s | -0.43s |
| `101450` | Nemu Hiiragi | `group_4` | 3 | `vo_char_1014_00_04_hca.hca` | 5.50s | 5.07s | -0.43s |
| `101700` | Mitama Yakumo | `group_54` | 3 | `vo_game_0902_02_hca.hca` | 9.20s | 8.77s | -0.43s |
| `101750` | Mitama Yakumo | `group_31` | 9 | `vo_char_1017_50_39_hca.hca` | 19.50s | 19.07s | -0.43s |
| `101951` | Tsukasa Amane | `group_31` | 5 | `vo_char_1019_51_39_hca.hca` | 11.00s | 10.57s | -0.43s |
| `103400` | Asahi Miura | `group_7` | 2 | `vo_char_1034_00_14_hca.hca` | 4.00s | 3.57s | -0.43s |
| `103500` | Alexandra Kurusu | `group_39` | 2 | `vo_char_1035_00_46_hca.hca` | 3.00s | 2.57s | -0.43s |
| `103550` | Alexandra Kurusu | `group_26` | 6 | `vo_char_1035_50_33_hca.hca` | 14.60s | 14.17s | -0.43s |
| `103550` | Alexandra Kurusu | `group_31` | 4 | `vo_char_1035_50_38_hca.hca` | 11.70s | 11.27s | -0.43s |
| `104050` | Yozuru Sasame | `group_29` | 5 | `vo_char_1040_50_36_hca.hca` | 11.50s | 11.07s | -0.43s |
| `104400` | Mikoto Sena | `group_4` | 2 | `vo_char_1044_00_04_hca.hca` | 5.90s | 5.47s | -0.43s |
| `104600` | Chizuru | `group_36` | 2 | `vo_char_1046_00_43_hca.hca` | 3.30s | 2.87s | -0.43s |
| `104900` | Olga | `group_18` | 8 | `vo_char_1049_00_25_hca.hca` | 17.60s | 17.17s | -0.43s |
| `105300` | Amaryllis | `group_19` | 6 | `vo_char_1053_00_26_hca.hca` | 15.40s | 14.97s | -0.43s |
| `110100` | Iroha Tamaki | `group_4` | 3 | `vo_char_1101_00_05_hca.hca` | 6.00s | 5.57s | -0.43s |
| `110500` | Felicia-chan | `group_2` | 5 | `vo_char_1105_00_02_hca.hca` | 18.60s | 18.17s | -0.43s |
| `111000` | Momoko Togame | `group_36` | 3 | `vo_char_1110_00_43_hca.hca` | 3.00s | 2.57s | -0.43s |
| `113300` | Rabi Himuro | `group_29` | 6 | `vo_char_1133_00_36_hca.hca` | 20.50s | 20.07s | -0.43s |
| `130100` | Iroha & Yachiyo | `group_16` | 9 | `vo_char_1301_00_23_hca.hca` | 16.20s | 16.63s | +0.43s |
| `130100` | Iroha & Yachiyo | `group_18` | 8 | `vo_char_1301_00_25_hca.hca` | 14.10s | 14.53s | +0.43s |
| `130100` | Iroha & Yachiyo | `group_21` | 7 | `vo_char_1301_00_28_hca.hca` | 22.60s | 23.03s | +0.43s |
| `130100` | Iroha & Yachiyo | `group_35` | 3 | `vo_char_1301_00_42_hca.hca` | 5.00s | 5.43s | +0.43s |
| `130101` | Iroha & Yachiyo | `group_16` | 9 | `vo_char_1301_00_23_hca.hca` | 16.20s | 16.63s | +0.43s |
| `130101` | Iroha & Yachiyo | `group_35` | 3 | `vo_char_1301_00_42_hca.hca` | 5.00s | 5.43s | +0.43s |
| `130102` | Iroha & Yachiyo | `group_16` | 9 | `vo_char_1301_00_23_hca.hca` | 16.20s | 16.63s | +0.43s |
| `130102` | Iroha & Yachiyo | `group_28` | 4 | `vo_char_1301_02_35_hca.hca` | 12.10s | 11.67s | -0.43s |
| `130102` | Iroha & Yachiyo | `group_31` | 4 | `vo_char_1301_02_38_hca.hca` | 9.60s | 9.17s | -0.43s |
| `130102` | Iroha & Yachiyo | `group_35` | 3 | `vo_char_1301_00_42_hca.hca` | 5.00s | 5.43s | +0.43s |
| `180100` | Iroha & Kuroe | `group_1` | 8 | `vo_char_1801_00_01_hca.hca` | 22.90s | 22.47s | -0.43s |
| `200200` | Homura Akemi | `group_30` | 3 | `vo_char_2002_00_37_hca.hca` | 13.60s | 13.17s | -0.43s |
| `200600` | Kyoko Sakura | `group_1` | 8 | `vo_char_2006_00_01_hca.hca` | 22.00s | 21.57s | -0.43s |
| `200602` | Kyoko Sakura | `group_1` | 7 | `vo_char_2006_00_01_hca.hca` | 22.00s | 21.57s | -0.43s |
| `200650` | Kyoko Sakura | `group_1` | 6 | `vo_char_2006_00_01_hca.hca` | 22.00s | 21.57s | -0.43s |
| `200651` | Kyoko Sakura | `group_1` | 5 | `vo_char_2006_00_01_hca.hca` | 22.00s | 21.57s | -0.43s |
| `200651` | Kyoko Sakura | `group_32` | 4 | `vo_char_2006_51_40_hca.hca` | 11.60s | 12.03s | +0.43s |
| `200653` | Kyoko Sakura | `group_1` | 5 | `vo_char_2006_00_01_hca.hca` | 22.00s | 21.57s | -0.43s |
| `210000` | Madoka Kaname | `group_33` | 4 | `vo_char_2100_00_41_hca.hca` | 10.00s | 9.57s | -0.43s |
| `300351` | Hinano Miyako | `group_31` | 4 | `vo_char_3003_51_39_hca.hca` | 9.50s | 9.93s | +0.43s |
| `300400` | Sasara Minagi | `group_22` | 7 | `vo_char_3004_00_30_hca.hca` | 12.00s | 11.57s | -0.43s |
| `300500` | Nanaka Tokiwa | `group_16` | 7 | `vo_char_3005_00_24_hca.hca` | 14.50s | 14.07s | -0.43s |
| `300600` | Emiri Kisaki | `group_32` | 5 | `vo_char_3006_00_40_hca.hca` | 11.50s | 11.07s | -0.43s |
| `300800` | Akira Shinobu | `group_36` | 6 | `vo_char_3008_00_44_hca.hca` | 3.00s | 2.57s | -0.43s |
| `300850` | Akira Shinobu | `group_36` | 3 | `vo_char_3008_00_44_hca.hca` | 3.00s | 2.57s | -0.43s |
| `301500` | Mito Aino | `group_7` | 4 | `vo_char_3015_00_15_hca.hca` | 6.20s | 5.77s | -0.43s |
| `302700` | Hazuki Yusa | `group_26` | 6 | `vo_char_3027_00_34_hca.hca` | 15.00s | 15.43s | +0.43s |
| `303000` | Konomi Haruna | `group_43` | 6 | `vo_char_3030_00_02_hca.hca` | 11.80s | 11.37s | -0.43s |
| `303051` | Konomi Haruna | `group_43` | 4 | `vo_char_3030_00_02_hca.hca` | 11.80s | 11.37s | -0.43s |
| `303300` | Sayuki Fumino | `group_8` | 4 | `vo_char_3033_00_15_hca.hca` | 6.00s | 5.57s | -0.43s |
| `303350` | Sayuki Fumino | `group_8` | 3 | `vo_char_3033_00_15_hca.hca` | 6.00s | 5.57s | -0.43s |
| `304400` | Ranka Chizu | `group_2` | 5 | `vo_char_3044_00_02_hca.hca` | 13.30s | 12.87s | -0.43s |
| `304900` | Kanae Yukino | `group_18` | 4 | `vo_char_3049_00_26_hca.hca` | 14.00s | 13.57s | -0.43s |
| `305000` | Yuuna Kaharu | `group_13` | 4 | `vo_char_3050_00_20_hca.hca` | 9.20s | 8.77s | -0.43s |
| `305350` | Ikumi Makino | `group_24` | 6 | `vo_char_3053_50_31_hca.hca` | 14.80s | 14.37s | -0.43s |
| `305600` | Rui Mizuki | `group_30` | 7 | `vo_char_3056_00_37_hca.hca` | 14.80s | 14.37s | -0.43s |
| `400100` | Oriko Mikuni | `group_27` | 6 | `vo_char_4001_00_35_hca.hca` | 11.50s | 11.07s | -0.43s |
| `400400` | Oriko Mikuni | `group_21` | 5 | `vo_char_4004_00_28_hca.hca` | 13.80s | 13.37s | -0.43s |
| `401100` | Kazumi | `group_43` | 9 | `vo_char_4011_00_02_hca.hca` | 20.50s | 20.07s | -0.43s |
| `401300` | Kaoru Maki | `group_12` | 6 | `vo_char_4013_00_20_hca.hca` | 6.40s | 5.97s | -0.43s |
| `402200` | Riz | `group_26` | 5 | `vo_char_4022_00_34_hca.hca` | 13.00s | 12.57s | -0.43s |
| `402200` | Riz | `group_7` | 3 | `vo_char_4022_00_15_hca.hca` | 6.00s | 5.57s | -0.43s |
| `402700` | Lapin | `group_2` | 9 | `vo_char_4027_00_02_hca.hca` | 14.70s | 14.27s | -0.43s |
| `405200` | Fate | `group_28` | 6 | `vo_char_4052_00_35_hca.hca` | 14.30s | 13.87s | -0.43s |
| `100700` | Touka Satomi | `group_2` | 6 | `vo_char_1007_00_02_hca.hca` | 14.30s | 13.86s | -0.44s |
| `100750` | Touka Satomi | `group_2` | 6 | `vo_char_1007_00_02_hca.hca` | 14.30s | 13.86s | -0.44s |
| `100900` | Rena Minami | `group_2` | 4 | `vo_char_1009_00_03_hca.hca` | 4.50s | 4.06s | -0.44s |
| `100950` | Rena Minami | `group_2` | 3 | `vo_char_1009_00_03_hca.hca` | 4.50s | 4.06s | -0.44s |
| `100951` | Rena Minami | `group_2` | 3 | `vo_char_1009_00_03_hca.hca` | 4.50s | 4.06s | -0.44s |
| `101000` | Momoko Togame | `group_13` | 7 | `vo_char_1010_00_21_hca.hca` | 11.50s | 11.06s | -0.44s |
| `101000` | Momoko Togame | `group_18` | 7 | `vo_char_1010_00_26_hca.hca` | 11.20s | 10.76s | -0.44s |
| `101051` | Momoko Togame | `group_13` | 6 | `vo_char_1010_00_21_hca.hca` | 11.50s | 11.06s | -0.44s |
| `101150` | Kaede Akino | `group_26` | 4 | `vo_char_1011_50_34_hca.hca` | 12.80s | 12.36s | -0.44s |
| `101152` | Kaede Akino | `group_26` | 7 | `vo_char_1011_52_34_hca.hca` | 18.00s | 17.56s | -0.44s |
| `101200` | Karin Misono | `group_38` | 3 | `vo_char_1012_00_46_hca.hca` | 4.00s | 3.56s | -0.44s |
| `101250` | Karin Misono | `group_24` | 4 | `vo_char_1012_50_32_hca.hca` | 14.00s | 13.56s | -0.44s |
| `101250` | Karin Misono | `group_38` | 2 | `vo_char_1012_00_46_hca.hca` | 4.00s | 3.56s | -0.44s |
| `101400` | Nemu Hiiragi | `group_27` | 5 | `vo_char_1014_00_34_hca.hca` | 15.40s | 15.84s | +0.44s |
| `101400` | Nemu Hiiragi | `group_3` | 3 | `vo_char_1014_00_03_hca.hca` | 5.00s | 4.56s | -0.44s |
| `101450` | Nemu Hiiragi | `group_18` | 6 | `vo_char_1014_50_25_hca.hca` | 16.50s | 16.06s | -0.44s |
| `101450` | Nemu Hiiragi | `group_3` | 3 | `vo_char_1014_00_03_hca.hca` | 5.00s | 4.56s | -0.44s |
| `101550` | Ui Tamaki | `group_33` | 5 | `vo_char_1015_50_40_hca.hca` | 9.00s | 8.56s | -0.44s |
| `101800` | Tsukuyo Amane | `group_20` | 4 | `vo_char_1018_00_28_hca.hca` | 12.00s | 11.56s | -0.44s |
| `101800` | Tsukuyo Amane | `group_21` | 4 | `vo_char_1018_00_29_hca.hca` | 12.00s | 11.56s | -0.44s |
| `102200` | Hikaru Kirari | `group_44` | 6 | `vo_game_0302_08_hca.hca` | 9.40s | 8.96s | -0.44s |
| `102250` | Hikaru Kirari | `group_44` | 5 | `vo_game_0302_08_hca.hca` | 9.40s | 8.96s | -0.44s |
| `102850` | Himena Aika | `group_34` | 5 | `vo_char_1028_50_41_hca.hca` | 18.20s | 18.64s | +0.44s |
| `103400` | Asahi Miura | `group_3` | 2 | `vo_char_1034_00_03_hca.hca` | 4.10s | 3.66s | -0.44s |
| `103400` | Asahi Miura | `group_33` | 5 | `vo_char_1034_00_40_hca.hca` | 15.00s | 14.56s | -0.44s |
| `104050` | Yozuru Sasame | `group_33` | 6 | `vo_char_1040_50_40_hca.hca` | 13.70s | 13.26s | -0.44s |
| `104300` | Kuroe | `group_14` | 6 | `vo_char_1043_00_21_hca.hca` | 14.60s | 14.16s | -0.44s |
| `105300` | Amaryllis | `group_27` | 5 | `vo_char_1053_00_34_hca.hca` | 15.20s | 14.76s | -0.44s |
| `110300` | Uwasa Tsuruno | `group_40` | 2 | `vo_char_1103_00_64_hca.hca` | 3.00s | 2.56s | -0.44s |
| `110702` | Touka & Nemu | `group_31` | 5 | `vo_char_1107_02_38_hca.hca` | 12.45s | 12.01s | -0.44s |
| `111202` | Karin & Alina | `group_24` | 4 | `vo_char_1112_02_31_hca.hca` | 14.70s | 14.26s | -0.44s |
| `111800` | Amane Sisters | `group_37` | 2 | `vo_char_1118_00_44_hca.hca` | 4.00s | 3.56s | -0.44s |
| `111801` | Amane Sisters | `group_37` | 2 | `vo_char_1118_00_44_hca.hca` | 4.00s | 3.56s | -0.44s |
| `111802` | Amane Sisters | `group_37` | 2 | `vo_char_1118_00_44_hca.hca` | 4.00s | 3.56s | -0.44s |
| `113300` | Rabi Himuro | `group_2` | 4 | `vo_char_1133_00_02_hca.hca` | 17.10s | 16.66s | -0.44s |
| `180102` | Iroha & Kuroe | `group_17` | 4 | `vo_char_1801_02_24_hca.hca` | 14.00s | 13.56s | -0.44s |
| `200200` | Homura Akemi | `group_31` | 3 | `vo_char_2002_00_38_hca.hca` | 17.00s | 16.56s | -0.44s |
| `200200` | Homura Akemi | `group_32` | 5 | `vo_char_2002_00_39_hca.hca` | 13.01s | 12.57s | -0.44s |
| `200200` | Homura Akemi | `group_5` | 3 | `vo_char_2002_00_05_hca.hca` | 4.80s | 4.36s | -0.44s |
| `200600` | Kyoko Sakura | `group_29` | 5 | `vo_char_2006_00_37_hca.hca` | 12.00s | 11.56s | -0.44s |
| `200700` | Nagisa Momoe | `group_3` | 3 | `vo_char_2007_00_03_hca.hca` | 5.00s | 5.44s | +0.44s |
| `200700` | Nagisa Momoe | `group_34` | 7 | `vo_char_2007_00_41_hca.hca` | 13.40s | 12.96s | -0.44s |
| `210100` | Ultimate Madoka | `group_18` | 5 | `vo_char_2101_00_26_hca.hca` | 12.90s | 12.46s | -0.44s |
| `250100` | Mami Tomoe | `group_23` | 4 | `vo_char_2501_00_30_hca.hca` | 13.10s | 12.66s | -0.44s |
| `260000` | Kyoko Sakura | `group_16` | 8 | `vo_char_2600_00_23_hca.hca` | 17.30s | 16.86s | -0.44s |
| `260200` | Kyoko Sakura | `group_8` | 3 | `vo_char_2602_00_15_hca.hca` | 6.20s | 5.76s | -0.44s |
| `301300` | Leila Ibuki | `group_39` | 3 | `vo_char_3013_00_63_hca.hca` | 3.00s | 2.56s | -0.44s |
| `302100` | Sakuya Suzuka | `group_20` | 5 | `vo_char_3021_00_27_hca.hca` | 11.10s | 11.54s | +0.44s |
| `302551` | Ren Isuzu | `group_27` | 5 | `vo_char_3025_51_35_hca.hca` | 19.00s | 18.56s | -0.44s |
| `302600` | Konoha Shizumi | `group_2` | 4 | `vo_char_3026_00_03_hca.hca` | 5.50s | 5.06s | -0.44s |
| `302800` | Ayame Mikuri | `group_22` | 8 | `vo_char_3028_00_30_hca.hca` | 9.10s | 8.66s | -0.44s |
| `303100` | Rika Ayano | `group_11` | 5 | `vo_char_3031_00_19_hca.hca` | 5.00s | 4.56s | -0.44s |
| `303100` | Rika Ayano | `group_20` | 7 | `vo_char_3031_00_28_hca.hca` | 11.50s | 11.06s | -0.44s |
| `303300` | Sayuki Fumino | `group_21` | 4 | `vo_char_3033_00_28_hca.hca` | 11.50s | 11.06s | -0.44s |
| `303300` | Sayuki Fumino | `group_25` | 6 | `vo_char_3033_00_32_hca.hca` | 14.00s | 13.56s | -0.44s |
| `303400` | Moka Megumi | `group_26` | 4 | `vo_char_3034_00_33_hca.hca` | 12.00s | 11.56s | -0.44s |
| `303500` | Riko Chiaki | `group_26` | 8 | `vo_char_3035_00_33_hca.hca` | 15.60s | 15.16s | -0.44s |
| `304400` | Ranka Chizu | `group_28` | 3 | `vo_char_3044_00_35_hca.hca` | 12.00s | 11.56s | -0.44s |
| `304900` | Kanae Yukino | `group_5` | 2 | `vo_char_3049_00_13_hca.hca` | 3.00s | 2.56s | -0.44s |
| `305000` | Yuuna Kaharu | `group_8` | 3 | `vo_char_3050_00_15_hca.hca` | 5.90s | 5.46s | -0.44s |
| `305800` | Ryoko Natsu | `group_11` | 5 | `vo_char_3058_00_18_hca.hca` | 12.60s | 12.16s | -0.44s |
| `350100` | Rika & Ren | `group_21` | 5 | `vo_char_3501_00_28_hca.hca` | 15.00s | 14.56s | -0.44s |
| `350102` | Rika & Ren | `group_18` | 4 | `vo_char_3501_02_25_hca.hca` | 15.30s | 14.86s | -0.44s |
| `350400` | Masara & Kokoro | `group_14` | 5 | `vo_char_3504_00_21_hca.hca` | 15.20s | 14.76s | -0.44s |
| `350400` | Masara & Kokoro | `group_18` | 5 | `vo_char_3504_00_25_hca.hca` | 15.60s | 15.16s | -0.44s |
| `390200` | Shi | `group_11` | 5 | `vo_char_3902_00_18_hca.hca` | 15.30s | 14.86s | -0.44s |
| `390200` | Shi | `group_37` | 2 | `vo_char_3902_00_44_hca.hca` | 3.30s | 2.86s | -0.44s |
| `400100` | Oriko Mikuni | `group_13` | 6 | `vo_char_4001_00_21_hca.hca` | 14.00s | 13.56s | -0.44s |
| `400100` | Oriko Mikuni | `group_8` | 6 | `vo_char_4001_00_16_hca.hca` | 14.50s | 14.06s | -0.44s |
| `400200` | Kirika Kure | `group_34` | 4 | `vo_char_4002_00_42_hca.hca` | 2.50s | 2.06s | -0.44s |
| `400200` | Kirika Kure | `group_37` | 4 | `vo_char_4002_00_45_hca.hca` | 3.00s | 2.56s | -0.44s |
| `400300` | Yuma Chitose | `group_16` | 8 | `vo_char_4003_00_24_hca.hca` | 13.00s | 12.56s | -0.44s |
| `402600` | Elisa | `group_19` | 4 | `vo_char_4026_00_26_hca.hca` | 12.50s | 12.06s | -0.44s |
| `402700` | Lapin | `group_13` | 3 | `vo_char_4027_00_20_hca.hca` | 5.00s | 4.56s | -0.44s |
| `404500` | Tsubasa Hanekawa | `group_23` | 2 | `vo_char_4045_00_30_hca.hca` | 7.10s | 6.66s | -0.44s |
| `405100` | Nanoha Takamachi | `group_31` | 5 | `vo_char_4051_00_38_hca.hca` | 11.50s | 11.06s | -0.44s |
| `405200` | Fate | `group_1` | 6 | `vo_char_4052_00_01_hca.hca` | 10.30s | 9.86s | -0.44s |
| `405200` | Fate | `group_19` | 5 | `vo_char_4052_00_26_hca.hca` | 5.50s | 5.06s | -0.44s |
| `100352` | Tsuruno Yui | `group_23` | 3 | `vo_char_1003_52_31_hca.hca` | 11.80s | 11.35s | -0.45s |
| `100700` | Touka Satomi | `group_13` | 3 | `vo_char_1007_00_20_hca.hca` | 7.00s | 6.55s | -0.45s |
| `100750` | Touka Satomi | `group_13` | 3 | `vo_char_1007_00_20_hca.hca` | 7.00s | 6.55s | -0.45s |
| `100800` | Alina Gray | `group_12` | 4 | `vo_char_1008_00_20_hca.hca` | 6.00s | 5.55s | -0.45s |
| `100850` | Alina Gray | `group_12` | 3 | `vo_char_1008_00_20_hca.hca` | 6.00s | 5.55s | -0.45s |
| `101100` | Kaede Akino | `group_22` | 7 | `vo_char_1011_00_30_hca.hca` | 12.00s | 11.55s | -0.45s |
| `101150` | Kaede Akino | `group_25` | 5 | `vo_char_1011_50_33_hca.hca` | 17.00s | 16.55s | -0.45s |
| `101300` | Asuka Tatsuki | `group_18` | 5 | `vo_char_1013_00_26_hca.hca` | 11.50s | 11.05s | -0.45s |
| `101700` | Mitama Yakumo | `group_59` | 7 | `vo_game_0902_10_hca.hca` | 15.50s | 15.05s | -0.45s |
| `101701` | Mitama Yakumo | `group_49` | 6 | `vo_game_0202_09_hca.hca` | 11.70s | 11.25s | -0.45s |
| `101800` | Tsukuyo Amane | `group_6` | 3 | `vo_char_1018_00_14_hca.hca` | 5.00s | 4.55s | -0.45s |
| `101850` | Tsukuyo Amane | `group_6` | 2 | `vo_char_1018_00_14_hca.hca` | 5.00s | 4.55s | -0.45s |
| `101900` | Tsukasa Amane | `group_1` | 9 | `vo_char_1019_00_01_hca.hca` | 24.00s | 23.55s | -0.45s |
| `101951` | Tsukasa Amane | `group_1` | 7 | `vo_char_1019_00_01_hca.hca` | 24.00s | 23.55s | -0.45s |
| `102650` | Chiharu Hiroe | `group_27` | 3 | `vo_char_1026_50_34_hca.hca` | 9.40s | 8.95s | -0.45s |
| `102800` | Himena Aika | `group_3` | 2 | `vo_char_1028_00_03_hca.hca` | 4.60s | 4.15s | -0.45s |
| `102850` | Himena Aika | `group_21` | 4 | `vo_char_1028_50_28_hca.hca` | 10.60s | 10.15s | -0.45s |
| `102850` | Himena Aika | `group_3` | 2 | `vo_char_1028_00_03_hca.hca` | 4.60s | 4.15s | -0.45s |
| `102900` | Shigure Miyabi | `group_37` | 4 | `vo_char_1029_00_44_hca.hca` | 5.00s | 4.55s | -0.45s |
| `102950` | Shigure Miyabi | `group_37` | 3 | `vo_char_1029_00_44_hca.hca` | 5.00s | 4.55s | -0.45s |
| `103400` | Asahi Miura | `group_34` | 4 | `vo_char_1034_00_41_hca.hca` | 12.00s | 11.55s | -0.45s |
| `104300` | Kuroe | `group_23` | 4 | `vo_char_1043_00_30_hca.hca` | 14.20s | 13.75s | -0.45s |
| `104900` | Olga | `group_10` | 4 | `vo_char_1049_00_17_hca.hca` | 11.60s | 11.15s | -0.45s |
| `105300` | Amaryllis | `group_30` | 5 | `vo_char_1053_00_37_hca.hca` | 13.30s | 12.85s | -0.45s |
| `110300` | Uwasa Tsuruno | `group_11` | 3 | `vo_char_1103_00_19_hca.hca` | 4.80s | 4.35s | -0.45s |
| `130101` | Iroha & Yachiyo | `group_23` | 6 | `vo_char_1301_01_30_hca.hca` | 11.30s | 11.75s | +0.45s |
| `130101` | Iroha & Yachiyo | `group_27` | 4 | `vo_char_1301_01_34_hca.hca` | 12.30s | 11.85s | -0.45s |
| `200400` | Sayaka Miki | `group_36` | 4 | `vo_char_2004_00_44_hca.hca` | 3.00s | 2.55s | -0.45s |
| `200451` | Sayaka Miki | `group_36` | 2 | `vo_char_2004_00_44_hca.hca` | 3.00s | 2.55s | -0.45s |
| `210000` | Madoka Kaname | `group_15` | 6 | `vo_char_2100_00_23_hca.hca` | 15.10s | 14.65s | -0.45s |
| `240000` | Sayaka Miki | `group_10` | 5 | `vo_char_2400_00_17_hca.hca` | 10.00s | 9.55s | -0.45s |
| `260000` | Kyoko Sakura | `group_19` | 5 | `vo_char_2600_00_26_hca.hca` | 12.00s | 11.55s | -0.45s |
| `260200` | Kyoko Sakura | `group_9` | 4 | `vo_char_2602_00_16_hca.hca` | 15.20s | 14.75s | -0.45s |
| `300250` | Natsuki Utsuho | `group_33` | 9 | `vo_char_3002_50_41_hca.hca` | 13.30s | 12.85s | -0.45s |
| `300500` | Nanaka Tokiwa | `group_11` | 5 | `vo_char_3005_00_19_hca.hca` | 6.50s | 6.05s | -0.45s |
| `300600` | Emiri Kisaki | `group_30` | 6 | `vo_char_3006_00_38_hca.hca` | 11.00s | 10.55s | -0.45s |
| `300600` | Emiri Kisaki | `group_36` | 3 | `vo_char_3006_00_44_hca.hca` | 2.50s | 2.05s | -0.45s |
| `300600` | Emiri Kisaki | `group_37` | 3 | `vo_char_3006_00_45_hca.hca` | 2.50s | 2.05s | -0.45s |
| `300700` | Shizuku Hozumi | `group_30` | 8 | `vo_char_3007_00_38_hca.hca` | 12.00s | 12.45s | +0.45s |
| `300750` | Shizuku Hozumi | `group_21` | 4 | `vo_char_3007_50_29_hca.hca` | 14.60s | 14.15s | -0.45s |
| `301150` | Kako Natsume | `group_22` | 5 | `vo_char_3011_50_30_hca.hca` | 14.60s | 15.05s | +0.45s |
| `301300` | Leila Ibuki | `group_10` | 6 | `vo_char_3013_00_18_hca.hca` | 13.30s | 12.85s | -0.45s |
| `301400` | Seika Kumi | `group_4` | 4 | `vo_char_3014_00_05_hca.hca` | 5.00s | 4.55s | -0.45s |
| `301800` | Hanna Sarasa | `group_14` | 4 | `vo_char_3018_00_21_hca.hca` | 12.50s | 12.05s | -0.45s |
| `301800` | Hanna Sarasa | `group_8` | 2 | `vo_char_3018_00_15_hca.hca` | 4.00s | 3.55s | -0.45s |
| `302300` | Aimi Eri | `group_26` | 5 | `vo_char_3023_00_34_hca.hca` | 12.00s | 11.55s | -0.45s |
| `302551` | Ren Isuzu | `group_28` | 6 | `vo_char_3025_51_36_hca.hca` | 22.00s | 21.55s | -0.45s |
| `302700` | Hazuki Yusa | `group_36` | 3 | `vo_char_3027_00_44_hca.hca` | 4.00s | 3.55s | -0.45s |
| `302800` | Ayame Mikuri | `group_41` | 4 | `vo_char_3028_00_65_hca.hca` | 4.00s | 3.55s | -0.45s |
| `302900` | Masara Kagami | `group_31` | 4 | `vo_char_3029_00_39_hca.hca` | 14.50s | 14.05s | -0.45s |
| `302950` | Masara Kagami | `group_36` | 2 | `vo_char_3029_00_44_hca.hca` | 3.00s | 3.45s | +0.45s |
| `303100` | Rika Ayano | `group_33` | 6 | `vo_char_3031_00_41_hca.hca` | 8.00s | 7.55s | -0.45s |
| `303551` | Riko Chiaki | `group_21` | 12 | `vo_char_3035_51_29_hca.hca` | 16.70s | 17.15s | +0.45s |
| `303700` | Mel Anna | `group_10` | 5 | `vo_char_3037_00_18_hca.hca` | 10.40s | 9.95s | -0.45s |
| `303751` | Mel Anna | `group_10` | 4 | `vo_char_3037_00_18_hca.hca` | 10.40s | 9.95s | -0.45s |
| `305000` | Yuuna Kaharu | `group_34` | 4 | `vo_char_3050_00_41_hca.hca` | 15.05s | 14.60s | -0.45s |
| `350400` | Masara & Kokoro | `group_32` | 5 | `vo_char_3504_00_39_hca.hca` | 14.80s | 14.35s | -0.45s |
| `350401` | Masara & Kokoro | `group_35` | 2 | `vo_char_3504_00_42_hca.hca` | 3.80s | 3.35s | -0.45s |
| `350402` | Masara & Kokoro | `group_35` | 2 | `vo_char_3504_00_42_hca.hca` | 3.80s | 3.35s | -0.45s |
| `390200` | Shi | `group_10` | 5 | `vo_char_3902_00_17_hca.hca` | 15.70s | 15.25s | -0.45s |
| `401200` | Umika Misaki | `group_33` | 6 | `vo_char_4012_00_41_hca.hca` | 15.50s | 15.05s | -0.45s |
| `402100` | Tart | `group_19` | 5 | `vo_char_4021_00_27_hca.hca` | 11.00s | 10.55s | -0.45s |
| `402100` | Tart | `group_2` | 4 | `vo_char_4021_00_03_hca.hca` | 4.50s | 4.05s | -0.45s |
| `402150` | Tart | `group_2` | 2 | `vo_char_4021_00_03_hca.hca` | 4.50s | 4.05s | -0.45s |
| `402200` | Riz | `group_1` | 7 | `vo_char_4022_00_01_hca.hca` | 22.20s | 21.75s | -0.45s |
| `402250` | Riz | `group_1` | 5 | `vo_char_4022_00_01_hca.hca` | 22.20s | 21.75s | -0.45s |
| `402500` | Corbeau | `group_15` | 5 | `vo_char_4025_00_22_hca.hca` | 19.50s | 19.05s | -0.45s |
| `402500` | Corbeau | `group_19` | 3 | `vo_char_4025_00_26_hca.hca` | 10.00s | 9.55s | -0.45s |
| `402600` | Elisa | `group_6` | 5 | `vo_char_4026_00_13_hca.hca` | 5.80s | 5.35s | -0.45s |
| `402650` | Elisa | `group_6` | 4 | `vo_char_4026_00_13_hca.hca` | 5.80s | 5.35s | -0.45s |
| `403300` | Arisa Narumi | `group_19` | 6 | `vo_char_4033_00_27_hca.hca` | 13.50s | 13.05s | -0.45s |
| `404100` | Hitagi Senjougahara | `group_24` | 3 | `vo_char_4041_00_32_hca.hca` | 12.35s | 11.90s | -0.45s |
| `404100` | Hitagi Senjougahara | `group_8` | 2 | `vo_char_4041_00_16_hca.hca` | 9.80s | 9.35s | -0.45s |
| `404500` | Tsubasa Hanekawa | `group_17` | 2 | `vo_char_4045_00_24_hca.hca` | 9.00s | 8.55s | -0.45s |
| `412103` | Isabeau | `group_18` | 5 | `vo_char_4121_03_25_hca.hca` | 13.00s | 12.55s | -0.45s |
| `100800` | Alina Gray | `group_1` | 7 | `vo_char_1008_00_01_hca.hca` | 21.20s | 20.74s | -0.46s |
| `100850` | Alina Gray | `group_1` | 6 | `vo_char_1008_00_01_hca.hca` | 21.20s | 20.74s | -0.46s |
| `101100` | Kaede Akino | `group_34` | 5 | `vo_char_1011_00_42_hca.hca` | 3.50s | 3.04s | -0.46s |
| `101100` | Kaede Akino | `group_41` | 4 | `vo_char_1011_00_65_hca.hca` | 4.00s | 3.54s | -0.46s |
| `101150` | Kaede Akino | `group_34` | 4 | `vo_char_1011_00_42_hca.hca` | 3.50s | 3.04s | -0.46s |
| `101150` | Kaede Akino | `group_41` | 3 | `vo_char_1011_00_65_hca.hca` | 4.00s | 3.54s | -0.46s |
| `101152` | Kaede Akino | `group_34` | 3 | `vo_char_1011_00_42_hca.hca` | 3.50s | 3.04s | -0.46s |
| `101152` | Kaede Akino | `group_41` | 2 | `vo_char_1011_00_65_hca.hca` | 4.00s | 3.54s | -0.46s |
| `101300` | Asuka Tatsuki | `group_17` | 7 | `vo_char_1013_00_25_hca.hca` | 12.50s | 12.04s | -0.46s |
| `101651` | Kanagi Izumi | `group_18` | 6 | `vo_char_1016_51_26_hca.hca` | 19.00s | 18.54s | -0.46s |
| `101800` | Tsukuyo Amane | `group_23` | 5 | `vo_char_1018_00_31_hca.hca` | 13.50s | 13.04s | -0.46s |
| `101800` | Tsukuyo Amane | `group_41` | 4 | `vo_char_1018_00_65_hca.hca` | 5.00s | 4.54s | -0.46s |
| `101850` | Tsukuyo Amane | `group_41` | 3 | `vo_char_1018_00_65_hca.hca` | 5.00s | 4.54s | -0.46s |
| `101951` | Tsukasa Amane | `group_18` | 5 | `vo_char_1019_51_26_hca.hca` | 9.00s | 8.54s | -0.46s |
| `102200` | Hikaru Kirari | `group_16` | 5 | `vo_char_1022_00_23_hca.hca` | 15.10s | 15.56s | +0.46s |
| `102250` | Hikaru Kirari | `group_16` | 5 | `vo_char_1022_00_23_hca.hca` | 15.10s | 15.56s | +0.46s |
| `102250` | Hikaru Kirari | `group_19` | 6 | `vo_char_1022_50_26_hca.hca` | 11.50s | 11.04s | -0.46s |
| `102250` | Hikaru Kirari | `group_28` | 6 | `vo_char_1022_50_35_hca.hca` | 15.30s | 14.84s | -0.46s |
| `102350` | Ao Kasane | `group_31` | 6 | `vo_char_1023_50_38_hca.hca` | 17.20s | 16.74s | -0.46s |
| `102400` | Juri Oba | `group_1` | 10 | `vo_char_1024_00_01_hca.hca` | 22.40s | 21.94s | -0.46s |
| `102600` | Chiharu Hiroe | `group_24` | 6 | `vo_char_1026_00_31_hca.hca` | 14.00s | 13.54s | -0.46s |
| `102651` | Chiharu Hiroe | `group_17` | 4 | `vo_char_1026_51_24_hca.hca` | 11.90s | 11.44s | -0.46s |
| `103400` | Asahi Miura | `group_26` | 4 | `vo_char_1034_00_33_hca.hca` | 13.30s | 12.84s | -0.46s |
| `103550` | Alexandra Kurusu | `group_33` | 5 | `vo_char_1035_50_40_hca.hca` | 11.80s | 11.34s | -0.46s |
| `104100` | Livia Medeiros | `group_15` | 8 | `vo_char_1041_00_22_hca.hca` | 23.60s | 23.14s | -0.46s |
| `104300` | Kuroe | `group_12` | 3 | `vo_char_1043_00_19_hca.hca` | 6.30s | 5.84s | -0.46s |
| `104300` | Kuroe | `group_38` | 3 | `vo_char_1043_00_45_hca.hca` | 4.00s | 3.54s | -0.46s |
| `104600` | Chizuru | `group_34` | 6 | `vo_char_1046_00_41_hca.hca` | 13.30s | 12.84s | -0.46s |
| `110400` | Uwasa Sana | `group_6` | 3 | `vo_char_1104_00_13_hca.hca` | 5.80s | 5.34s | -0.46s |
| `111000` | Momoko Togame | `group_23` | 6 | `vo_char_1110_00_30_hca.hca` | 13.60s | 14.06s | +0.46s |
| `111200` | Karin & Alina | `group_10` | 4 | `vo_char_1112_00_17_hca.hca` | 13.90s | 13.44s | -0.46s |
| `111201` | Karin & Alina | `group_10` | 3 | `vo_char_1112_00_17_hca.hca` | 13.90s | 13.44s | -0.46s |
| `111202` | Karin & Alina | `group_10` | 3 | `vo_char_1112_00_17_hca.hca` | 13.90s | 13.44s | -0.46s |
| `113300` | Rabi Himuro | `group_35` | 2 | `vo_char_1133_00_42_hca.hca` | 4.00s | 3.54s | -0.46s |
| `130100` | Iroha & Yachiyo | `group_29` | 5 | `vo_char_1301_00_36_hca.hca` | 10.60s | 10.14s | -0.46s |
| `130100` | Iroha & Yachiyo | `group_37` | 5 | `vo_char_1301_00_44_hca.hca` | 4.10s | 4.56s | +0.46s |
| `130101` | Iroha & Yachiyo | `group_37` | 5 | `vo_char_1301_00_44_hca.hca` | 4.10s | 4.56s | +0.46s |
| `130102` | Iroha & Yachiyo | `group_37` | 5 | `vo_char_1301_00_44_hca.hca` | 4.10s | 4.56s | +0.46s |
| `180100` | Iroha & Kuroe | `group_23` | 5 | `vo_char_1801_00_30_hca.hca` | 10.90s | 10.44s | -0.46s |
| `180100` | Iroha & Kuroe | `group_28` | 5 | `vo_char_1801_00_35_hca.hca` | 12.70s | 12.24s | -0.46s |
| `240000` | Sayaka Miki | `group_5` | 2 | `vo_char_2400_00_05_hca.hca` | 6.00s | 5.54s | -0.46s |
| `250100` | Mami Tomoe | `group_8` | 2 | `vo_char_2501_00_15_hca.hca` | 3.60s | 3.14s | -0.46s |
| `300300` | Hinano Miyako | `group_30` | 6 | `vo_char_3003_00_38_hca.hca` | 11.00s | 10.54s | -0.46s |
| `300400` | Sasara Minagi | `group_1` | 11 | `vo_char_3004_00_01_hca.hca` | 20.00s | 20.46s | +0.46s |
| `300400` | Sasara Minagi | `group_38` | 3 | `vo_char_3004_00_46_hca.hca` | 2.50s | 2.04s | -0.46s |
| `300500` | Nanaka Tokiwa | `group_35` | 3 | `vo_char_3005_00_43_hca.hca` | 3.50s | 3.04s | -0.46s |
| `300600` | Emiri Kisaki | `group_14` | 10 | `vo_char_3006_00_22_hca.hca` | 20.00s | 19.54s | -0.46s |
| `300600` | Emiri Kisaki | `group_38` | 3 | `vo_char_3006_00_46_hca.hca` | 2.50s | 2.04s | -0.46s |
| `300651` | Emiri Kisaki | `group_14` | 8 | `vo_char_3006_00_22_hca.hca` | 20.00s | 19.54s | -0.46s |
| `300651` | Emiri Kisaki | `group_33` | 4 | `vo_char_3006_51_41_hca.hca` | 11.00s | 10.54s | -0.46s |
| `301150` | Kako Natsume | `group_28` | 6 | `vo_char_3011_50_36_hca.hca` | 12.90s | 12.44s | -0.46s |
| `301600` | Kokoro Awane | `group_3` | 4 | `vo_char_3016_00_04_hca.hca` | 8.00s | 7.54s | -0.46s |
| `301650` | Kokoro Awane | `group_3` | 3 | `vo_char_3016_00_04_hca.hca` | 8.00s | 7.54s | -0.46s |
| `302500` | Ren Isuzu | `group_1` | 7 | `vo_char_3025_00_01_hca.hca` | 37.00s | 36.54s | -0.46s |
| `302551` | Ren Isuzu | `group_1` | 6 | `vo_char_3025_00_01_hca.hca` | 37.00s | 36.54s | -0.46s |
| `302700` | Hazuki Yusa | `group_19` | 7 | `vo_char_3027_00_27_hca.hca` | 15.00s | 14.54s | -0.46s |
| `302700` | Hazuki Yusa | `group_38` | 3 | `vo_char_3027_00_46_hca.hca` | 4.00s | 3.54s | -0.46s |
| `302800` | Ayame Mikuri | `group_37` | 4 | `vo_char_3028_00_45_hca.hca` | 3.40s | 2.94s | -0.46s |
| `303100` | Rika Ayano | `group_29` | 7 | `vo_char_3031_00_37_hca.hca` | 10.00s | 10.46s | +0.46s |
| `303100` | Rika Ayano | `group_43` | 6 | `vo_char_3031_00_02_hca.hca` | 10.80s | 10.34s | -0.46s |
| `303300` | Sayuki Fumino | `group_1` | 14 | `vo_char_3033_00_01_hca.hca` | 31.60s | 32.06s | +0.46s |
| `303300` | Sayuki Fumino | `group_27` | 6 | `vo_char_3033_00_34_hca.hca` | 14.00s | 13.54s | -0.46s |
| `303350` | Sayuki Fumino | `group_1` | 13 | `vo_char_3033_00_01_hca.hca` | 31.60s | 32.06s | +0.46s |
| `303500` | Riko Chiaki | `group_38` | 3 | `vo_char_3035_00_45_hca.hca` | 4.20s | 3.74s | -0.46s |
| `303700` | Mel Anna | `group_18` | 4 | `vo_char_3037_00_26_hca.hca` | 10.50s | 10.04s | -0.46s |
| `304100` | Hotori Yuzuki | `group_34` | 4 | `vo_char_3041_00_41_hca.hca` | 12.90s | 12.44s | -0.46s |
| `304400` | Ranka Chizu | `group_10` | 4 | `vo_char_3044_00_17_hca.hca` | 13.25s | 12.79s | -0.46s |
| `304650` | Ryo Midori | `group_25` | 7 | `vo_char_3046_50_32_hca.hca` | 14.00s | 13.54s | -0.46s |
| `304650` | Ryo Midori | `group_31` | 8 | `vo_char_3046_50_38_hca.hca` | 13.70s | 13.24s | -0.46s |
| `304750` | Chika Aoba | `group_23` | 5 | `vo_char_3047_50_31_hca.hca` | 10.40s | 9.94s | -0.46s |
| `305000` | Yuuna Kaharu | `group_24` | 3 | `vo_char_3050_00_31_hca.hca` | 12.60s | 12.14s | -0.46s |
| `305100` | Jun Kazari | `group_35` | 2 | `vo_char_3051_00_42_hca.hca` | 3.00s | 2.54s | -0.46s |
| `350400` | Masara & Kokoro | `group_28` | 5 | `vo_char_3504_00_35_hca.hca` | 13.00s | 12.54s | -0.46s |
| `350402` | Masara & Kokoro | `group_17` | 7 | `vo_char_3504_02_24_hca.hca` | 16.70s | 16.24s | -0.46s |
| `390201` | Shi | `group_28` | 6 | `vo_char_3902_01_35_hca.hca` | 13.80s | 14.26s | +0.46s |
| `402700` | Lapin | `group_7` | 4 | `vo_char_4027_00_14_hca.hca` | 7.10s | 6.64s | -0.46s |
| `404300` | Suruga Kanbaru | `group_18` | 3 | `vo_char_4043_00_25_hca.hca` | 11.55s | 11.09s | -0.46s |
| `404600` | Shinobu Oshino | `group_8` | 2 | `vo_char_4046_00_15_hca.hca` | 6.00s | 5.54s | -0.46s |
| `405200` | Fate | `group_22` | 7 | `vo_char_4052_00_29_hca.hca` | 12.50s | 12.04s | -0.46s |
| `100153` | Iroha Tamaki | `group_26` | 4 | `vo_char_1001_53_34_hca.hca` | 13.40s | 12.93s | -0.47s |
| `100700` | Touka Satomi | `group_38` | 3 | `vo_char_1007_00_45_hca.hca` | 3.80s | 3.33s | -0.47s |
| `101000` | Momoko Togame | `group_37` | 4 | `vo_char_1010_00_45_hca.hca` | 2.50s | 2.03s | -0.47s |
| `101000` | Momoko Togame | `group_41` | 4 | `vo_char_1010_00_65_hca.hca` | 5.00s | 4.53s | -0.47s |
| `101051` | Momoko Togame | `group_37` | 3 | `vo_char_1010_00_45_hca.hca` | 2.50s | 2.03s | -0.47s |
| `101051` | Momoko Togame | `group_41` | 3 | `vo_char_1010_00_65_hca.hca` | 5.00s | 4.53s | -0.47s |
| `101500` | Ui Tamaki | `group_2` | 6 | `vo_char_1015_00_02_hca.hca` | 14.00s | 13.53s | -0.47s |
| `101550` | Ui Tamaki | `group_2` | 6 | `vo_char_1015_00_02_hca.hca` | 14.00s | 13.53s | -0.47s |
| `101550` | Ui Tamaki | `group_27` | 6 | `vo_char_1015_50_34_hca.hca` | 13.00s | 12.53s | -0.47s |
| `101700` | Mitama Yakumo | `group_46` | 5 | `vo_game_0702_03_hca.hca` | 6.60s | 6.13s | -0.47s |
| `101701` | Mitama Yakumo | `group_44` | 4 | `vo_game_0202_01_hca.hca` | 7.40s | 6.93s | -0.47s |
| `101750` | Mitama Yakumo | `group_32` | 7 | `vo_char_1017_50_40_hca.hca` | 13.90s | 13.43s | -0.47s |
| `101751` | Mitama Yakumo | `group_46` | 3 | `vo_game_0802_03_hca.hca` | 6.80s | 6.33s | -0.47s |
| `101800` | Tsukuyo Amane | `group_12` | 4 | `vo_char_1018_00_20_hca.hca` | 6.00s | 5.53s | -0.47s |
| `101800` | Tsukuyo Amane | `group_36` | 3 | `vo_char_1018_00_44_hca.hca` | 3.00s | 2.53s | -0.47s |
| `101850` | Tsukuyo Amane | `group_12` | 3 | `vo_char_1018_00_20_hca.hca` | 6.00s | 5.53s | -0.47s |
| `101850` | Tsukuyo Amane | `group_36` | 2 | `vo_char_1018_00_44_hca.hca` | 3.00s | 2.53s | -0.47s |
| `102200` | Hikaru Kirari | `group_38` | 3 | `vo_char_1022_00_45_hca.hca` | 3.10s | 2.63s | -0.47s |
| `102250` | Hikaru Kirari | `group_38` | 2 | `vo_char_1022_00_45_hca.hca` | 3.10s | 2.63s | -0.47s |
| `102800` | Himena Aika | `group_1` | 9 | `vo_char_1028_00_01_hca.hca` | 24.60s | 24.13s | -0.47s |
| `102800` | Himena Aika | `group_39` | 3 | `vo_char_1028_00_46_hca.hca` | 3.50s | 3.03s | -0.47s |
| `102850` | Himena Aika | `group_1` | 8 | `vo_char_1028_00_01_hca.hca` | 24.60s | 24.13s | -0.47s |
| `102850` | Himena Aika | `group_39` | 2 | `vo_char_1028_00_46_hca.hca` | 3.50s | 3.03s | -0.47s |
| `103200` | Miyuri Yukari | `group_1` | 8 | `vo_char_1032_00_01_hca.hca` | 32.00s | 32.47s | +0.47s |
| `103350` | Rabi Himuro | `group_34` | 6 | `vo_char_1033_50_41_hca.hca` | 16.30s | 16.77s | +0.47s |
| `104050` | Yozuru Sasame | `group_20` | 4 | `vo_char_1040_50_27_hca.hca` | 11.50s | 11.03s | -0.47s |
| `104300` | Kuroe | `group_27` | 4 | `vo_char_1043_00_34_hca.hca` | 11.20s | 10.73s | -0.47s |
| `104400` | Mikoto Sena | `group_34` | 5 | `vo_char_1044_00_41_hca.hca` | 14.00s | 13.53s | -0.47s |
| `104600` | Chizuru | `group_30` | 3 | `vo_char_1046_00_37_hca.hca` | 8.70s | 8.23s | -0.47s |
| `105302` | Amaryllis | `group_34` | 4 | `vo_char_1053_02_41_hca.hca` | 14.20s | 13.73s | -0.47s |
| `110100` | Iroha Tamaki | `group_21` | 4 | `vo_char_1101_00_29_hca.hca` | 10.70s | 10.23s | -0.47s |
| `110400` | Uwasa Sana | `group_2` | 6 | `vo_char_1104_00_02_hca.hca` | 13.50s | 13.97s | +0.47s |
| `111600` | Kanagi Izumi | `group_9` | 6 | `vo_char_1116_00_16_hca.hca` | 12.80s | 12.33s | -0.47s |
| `200200` | Homura Akemi | `group_17` | 4 | `vo_char_2002_00_24_hca.hca` | 13.50s | 13.03s | -0.47s |
| `230000` | Homura Akemi | `group_30` | 6 | `vo_char_2300_00_38_hca.hca` | 18.40s | 17.93s | -0.47s |
| `240000` | Sayaka Miki | `group_13` | 4 | `vo_char_2400_00_20_hca.hca` | 7.00s | 6.53s | -0.47s |
| `260000` | Kyoko Sakura | `group_36` | 2 | `vo_char_2600_00_43_hca.hca` | 3.00s | 2.53s | -0.47s |
| `300651` | Emiri Kisaki | `group_23` | 5 | `vo_char_3006_51_31_hca.hca` | 9.70s | 9.23s | -0.47s |
| `301400` | Seika Kumi | `group_5` | 4 | `vo_char_3014_00_13_hca.hca` | 6.00s | 5.53s | -0.47s |
| `301600` | Kokoro Awane | `group_10` | 6 | `vo_char_3016_00_18_hca.hca` | 13.00s | 12.53s | -0.47s |
| `301650` | Kokoro Awane | `group_10` | 5 | `vo_char_3016_00_18_hca.hca` | 13.00s | 12.53s | -0.47s |
| `301800` | Hanna Sarasa | `group_13` | 3 | `vo_char_3018_00_20_hca.hca` | 7.80s | 7.33s | -0.47s |
| `301950` | Ayaka Mariko | `group_27` | 4 | `vo_char_3019_50_35_hca.hca` | 13.60s | 13.13s | -0.47s |
| `303100` | Rika Ayano | `group_22` | 6 | `vo_char_3031_00_30_hca.hca` | 8.50s | 8.03s | -0.47s |
| `303250` | Mayu Kozue | `group_20` | 4 | `vo_char_3032_50_28_hca.hca` | 12.00s | 11.53s | -0.47s |
| `303700` | Mel Anna | `group_4` | 3 | `vo_char_3037_00_05_hca.hca` | 5.00s | 4.53s | -0.47s |
| `303751` | Mel Anna | `group_4` | 2 | `vo_char_3037_00_05_hca.hca` | 5.00s | 4.53s | -0.47s |
| `304600` | Ryo Midori | `group_30` | 4 | `vo_char_3046_00_37_hca.hca` | 12.30s | 11.83s | -0.47s |
| `304750` | Chika Aoba | `group_32` | 6 | `vo_char_3047_50_40_hca.hca` | 12.10s | 11.63s | -0.47s |
| `304900` | Kanae Yukino | `group_9` | 3 | `vo_char_3049_00_17_hca.hca` | 10.00s | 9.53s | -0.47s |
| `304950` | Kanae Yukino | `group_9` | 2 | `vo_char_3049_00_17_hca.hca` | 10.00s | 9.53s | -0.47s |
| `305251` | Ashley Taylor | `group_30` | 4 | `vo_char_3052_51_38_hca.hca` | 10.60s | 10.13s | -0.47s |
| `305350` | Ikumi Makino | `group_23` | 6 | `vo_char_3053_50_30_hca.hca` | 13.40s | 12.93s | -0.47s |
| `305400` | Mitsune Miwa | `group_17` | 5 | `vo_char_3054_00_24_hca.hca` | 15.00s | 14.53s | -0.47s |
| `305800` | Ryoko Natsu | `group_34` | 11 | `vo_char_3058_00_41_hca.hca` | 26.20s | 25.73s | -0.47s |
| `305850` | Ryoko Natsu | `group_9` | 4 | `vo_char_3058_00_17_hca.hca` | 13.50s | 13.97s | +0.47s |
| `350400` | Masara & Kokoro | `group_27` | 5 | `vo_char_3504_00_34_hca.hca` | 11.20s | 10.73s | -0.47s |
| `350401` | Masara & Kokoro | `group_27` | 4 | `vo_char_3504_01_34_hca.hca` | 13.80s | 13.33s | -0.47s |
| `390200` | Shi | `group_38` | 2 | `vo_char_3902_00_45_hca.hca` | 2.60s | 2.13s | -0.47s |
| `390200` | Shi | `group_4` | 2 | `vo_char_3902_00_04_hca.hca` | 7.90s | 8.37s | +0.47s |
| `390201` | Shi | `group_23` | 5 | `vo_char_3902_01_30_hca.hca` | 17.10s | 16.63s | -0.47s |
| `400100` | Oriko Mikuni | `group_38` | 3 | `vo_char_4001_00_46_hca.hca` | 2.50s | 2.03s | -0.47s |
| `400200` | Kirika Kure | `group_33` | 7 | `vo_char_4002_00_41_hca.hca` | 13.00s | 12.53s | -0.47s |
| `400200` | Kirika Kure | `group_35` | 3 | `vo_char_4002_00_43_hca.hca` | 3.00s | 2.53s | -0.47s |
| `400400` | Oriko Mikuni | `group_31` | 6 | `vo_char_4004_00_38_hca.hca` | 13.80s | 13.33s | -0.47s |
| `401100` | Kazumi | `group_8` | 6 | `vo_char_4011_00_16_hca.hca` | 10.70s | 10.23s | -0.47s |
| `402600` | Elisa | `group_34` | 5 | `vo_char_4026_00_41_hca.hca` | 10.70s | 10.23s | -0.47s |
| `402650` | Elisa | `group_26` | 4 | `vo_char_4026_50_33_hca.hca` | 14.00s | 13.53s | -0.47s |
| `403500` | Haruka Kanade | `group_13` | 3 | `vo_char_4035_00_20_hca.hca` | 5.00s | 4.53s | -0.47s |
| `404200` | Mayoi Hachikuji | `group_29` | 3 | `vo_char_4042_00_36_hca.hca` | 10.40s | 9.93s | -0.47s |
| `405100` | Nanoha Takamachi | `group_5` | 4 | `vo_char_4051_00_05_hca.hca` | 6.30s | 5.83s | -0.47s |
| `100351` | Tsuruno Yui | `group_24` | 5 | `vo_char_1003_51_32_hca.hca` | 12.50s | 12.02s | -0.48s |
| `100550` | Felicia Mitsuki | `group_18` | 4 | `vo_char_1005_50_26_hca.hca` | 10.30s | 9.82s | -0.48s |
| `100552` | Felicia Mitsuki | `group_18` | 6 | `vo_char_1005_52_26_hca.hca` | 11.00s | 10.52s | -0.48s |
| `100700` | Touka Satomi | `group_9` | 6 | `vo_char_1007_00_16_hca.hca` | 12.30s | 11.82s | -0.48s |
| `100750` | Touka Satomi | `group_9` | 6 | `vo_char_1007_00_16_hca.hca` | 12.30s | 11.82s | -0.48s |
| `100900` | Rena Minami | `group_18` | 7 | `vo_char_1009_00_26_hca.hca` | 10.00s | 9.52s | -0.48s |
| `100900` | Rena Minami | `group_31` | 6 | `vo_char_1009_00_39_hca.hca` | 12.50s | 12.02s | -0.48s |
| `101100` | Kaede Akino | `group_5` | 5 | `vo_char_1011_00_13_hca.hca` | 6.50s | 6.02s | -0.48s |
| `101150` | Kaede Akino | `group_5` | 4 | `vo_char_1011_00_13_hca.hca` | 6.50s | 6.02s | -0.48s |
| `101152` | Kaede Akino | `group_5` | 3 | `vo_char_1011_00_13_hca.hca` | 6.50s | 6.02s | -0.48s |
| `101200` | Karin Misono | `group_16` | 5 | `vo_char_1012_00_24_hca.hca` | 12.00s | 12.48s | +0.48s |
| `101250` | Karin Misono | `group_26` | 4 | `vo_char_1012_50_34_hca.hca` | 13.00s | 12.52s | -0.48s |
| `101300` | Asuka Tatsuki | `group_12` | 5 | `vo_char_1013_00_20_hca.hca` | 9.50s | 9.02s | -0.48s |
| `101450` | Nemu Hiiragi | `group_31` | 7 | `vo_char_1014_50_38_hca.hca` | 17.60s | 18.08s | +0.48s |
| `101800` | Tsukuyo Amane | `group_7` | 4 | `vo_char_1018_00_15_hca.hca` | 5.00s | 4.52s | -0.48s |
| `101850` | Tsukuyo Amane | `group_7` | 3 | `vo_char_1018_00_15_hca.hca` | 5.00s | 4.52s | -0.48s |
| `101900` | Tsukasa Amane | `group_19` | 4 | `vo_char_1019_00_27_hca.hca` | 10.00s | 9.52s | -0.48s |
| `102250` | Hikaru Kirari | `group_27` | 6 | `vo_char_1022_50_34_hca.hca` | 17.50s | 17.02s | -0.48s |
| `102350` | Ao Kasane | `group_19` | 5 | `vo_char_1023_50_26_hca.hca` | 19.40s | 18.92s | -0.48s |
| `102350` | Ao Kasane | `group_24` | 5 | `vo_char_1023_50_31_hca.hca` | 17.50s | 17.02s | -0.48s |
| `102700` | Sunao Toki | `group_31` | 4 | `vo_char_1027_00_38_hca.hca` | 10.40s | 9.92s | -0.48s |
| `102900` | Shigure Miyabi | `group_11` | 4 | `vo_char_1029_00_18_hca.hca` | 16.00s | 15.52s | -0.48s |
| `102950` | Shigure Miyabi | `group_11` | 3 | `vo_char_1029_00_18_hca.hca` | 16.00s | 15.52s | -0.48s |
| `103500` | Alexandra Kurusu | `group_24` | 6 | `vo_char_1035_00_31_hca.hca` | 15.00s | 14.52s | -0.48s |
| `104400` | Mikoto Sena | `group_32` | 7 | `vo_char_1044_00_39_hca.hca` | 16.20s | 15.72s | -0.48s |
| `110700` | Touka & Nemu | `group_2` | 5 | `vo_char_1107_00_02_hca.hca` | 12.30s | 11.82s | -0.48s |
| `110701` | Touka & Nemu | `group_2` | 4 | `vo_char_1107_00_02_hca.hca` | 12.30s | 11.82s | -0.48s |
| `110702` | Touka & Nemu | `group_2` | 4 | `vo_char_1107_00_02_hca.hca` | 12.30s | 11.82s | -0.48s |
| `114400` | Uwasa Mikoto | `group_13` | 2 | `vo_char_1144_00_20_hca.hca` | 5.50s | 5.02s | -0.48s |
| `120100` | Iroha-chan | `group_26` | 3 | `vo_char_1201_00_33_hca.hca` | 11.30s | 10.82s | -0.48s |
| `180100` | Iroha & Kuroe | `group_17` | 4 | `vo_char_1801_00_24_hca.hca` | 11.60s | 11.12s | -0.48s |
| `200151` | Madoka Kaname | `group_28` | 5 | `vo_char_2001_51_36_hca.hca` | 13.90s | 13.42s | -0.48s |
| `200350` | Homura Akemi | `group_24` | 4 | `vo_char_2003_50_32_hca.hca` | 13.70s | 13.22s | -0.48s |
| `200400` | Sayaka Miki | `group_4` | 4 | `vo_char_2004_00_05_hca.hca` | 5.00s | 4.52s | -0.48s |
| `200451` | Sayaka Miki | `group_4` | 2 | `vo_char_2004_00_05_hca.hca` | 5.00s | 4.52s | -0.48s |
| `200602` | Kyoko Sakura | `group_16` | 6 | `vo_char_2006_02_24_hca.hca` | 11.50s | 11.02s | -0.48s |
| `200700` | Nagisa Momoe | `group_9` | 5 | `vo_char_2007_00_16_hca.hca` | 12.50s | 12.02s | -0.48s |
| `220200` | Devil Homura | `group_19` | 3 | `vo_char_2202_00_26_hca.hca` | 12.70s | 12.22s | -0.48s |
| `240000` | Sayaka Miki | `group_2` | 5 | `vo_char_2400_00_02_hca.hca` | 10.00s | 9.52s | -0.48s |
| `300250` | Natsuki Utsuho | `group_20` | 8 | `vo_char_3002_50_28_hca.hca` | 17.40s | 16.92s | -0.48s |
| `300300` | Hinano Miyako | `group_34` | 4 | `vo_char_3003_00_42_hca.hca` | 3.00s | 2.52s | -0.48s |
| `300351` | Hinano Miyako | `group_34` | 3 | `vo_char_3003_00_42_hca.hca` | 3.00s | 2.52s | -0.48s |
| `300900` | Manaka Kurumi | `group_11` | 4 | `vo_char_3009_00_19_hca.hca` | 5.00s | 4.52s | -0.48s |
| `301151` | Kako Natsume | `group_31` | 5 | `vo_char_3011_51_39_hca.hca` | 12.00s | 11.52s | -0.48s |
| `301800` | Hanna Sarasa | `group_26` | 6 | `vo_char_3018_00_33_hca.hca` | 15.30s | 14.82s | -0.48s |
| `301800` | Hanna Sarasa | `group_31` | 5 | `vo_char_3018_00_38_hca.hca` | 14.40s | 13.92s | -0.48s |
| `301900` | Ayaka Mariko | `group_1` | 9 | `vo_char_3019_00_01_hca.hca` | 20.00s | 20.48s | +0.48s |
| `301900` | Ayaka Mariko | `group_31` | 6 | `vo_char_3019_00_39_hca.hca` | 12.00s | 11.52s | -0.48s |
| `301950` | Ayaka Mariko | `group_1` | 7 | `vo_char_3019_00_01_hca.hca` | 20.00s | 20.48s | +0.48s |
| `302100` | Sakuya Suzuka | `group_2` | 6 | `vo_char_3021_00_02_hca.hca` | 12.90s | 13.38s | +0.48s |
| `302800` | Ayame Mikuri | `group_16` | 10 | `vo_char_3028_00_24_hca.hca` | 14.20s | 13.72s | -0.48s |
| `303000` | Konomi Haruna | `group_39` | 4 | `vo_char_3030_00_63_hca.hca` | 4.00s | 3.52s | -0.48s |
| `303051` | Konomi Haruna | `group_39` | 2 | `vo_char_3030_00_63_hca.hca` | 4.00s | 3.52s | -0.48s |
| `303100` | Rika Ayano | `group_35` | 5 | `vo_char_3031_00_43_hca.hca` | 3.00s | 2.52s | -0.48s |
| `303751` | Mel Anna | `group_22` | 4 | `vo_char_3037_51_30_hca.hca` | 10.00s | 9.52s | -0.48s |
| `303751` | Mel Anna | `group_31` | 6 | `vo_char_3037_51_39_hca.hca` | 16.50s | 16.02s | -0.48s |
| `304700` | Chika Aoba | `group_26` | 5 | `vo_char_3047_00_33_hca.hca` | 11.00s | 10.52s | -0.48s |
| `305100` | Jun Kazari | `group_28` | 6 | `vo_char_3051_00_35_hca.hca` | 12.60s | 12.12s | -0.48s |
| `400200` | Kirika Kure | `group_2` | 4 | `vo_char_4002_00_03_hca.hca` | 5.50s | 5.02s | -0.48s |
| `400200` | Kirika Kure | `group_39` | 4 | `vo_char_4002_00_63_hca.hca` | 4.50s | 4.02s | -0.48s |
| `402100` | Tart | `group_22` | 6 | `vo_char_4021_00_30_hca.hca` | 12.00s | 11.52s | -0.48s |
| `402400` | Minou | `group_2` | 5 | `vo_char_4024_00_02_hca.hca` | 15.60s | 15.12s | -0.48s |
| `402450` | Minou | `group_2` | 4 | `vo_char_4024_00_02_hca.hca` | 15.60s | 15.12s | -0.48s |
| `402451` | Minou | `group_2` | 4 | `vo_char_4024_00_02_hca.hca` | 15.60s | 15.12s | -0.48s |
| `402650` | Elisa | `group_17` | 5 | `vo_char_4026_50_24_hca.hca` | 9.80s | 9.32s | -0.48s |
| `402700` | Lapin | `group_27` | 4 | `vo_char_4027_00_34_hca.hca` | 9.40s | 8.92s | -0.48s |
| `402700` | Lapin | `group_38` | 3 | `vo_char_4027_00_45_hca.hca` | 3.00s | 2.52s | -0.48s |
| `404300` | Suruga Kanbaru | `group_22` | 3 | `vo_char_4043_00_29_hca.hca` | 8.95s | 8.47s | -0.48s |
| `404600` | Shinobu Oshino | `group_27` | 3 | `vo_char_4046_00_34_hca.hca` | 9.30s | 8.82s | -0.48s |
| `405200` | Fate | `group_2` | 6 | `vo_char_4052_00_02_hca.hca` | 10.00s | 9.52s | -0.48s |
| `405300` | Hayate Yagami | `group_2` | 5 | `vo_char_4053_00_02_hca.hca` | 9.00s | 8.52s | -0.48s |
| `100153` | Iroha Tamaki | `group_27` | 5 | `vo_char_1001_53_35_hca.hca` | 14.20s | 13.71s | -0.49s |
| `100153` | Iroha Tamaki | `group_31` | 4 | `vo_char_1001_53_39_hca.hca` | 11.60s | 11.11s | -0.49s |
| `100250` | Yachiyo Nanami | `group_16` | 6 | `vo_char_1002_50_24_hca.hca` | 11.10s | 10.61s | -0.49s |
| `100800` | Alina Gray | `group_11` | 3 | `vo_char_1008_00_19_hca.hca` | 6.00s | 5.51s | -0.49s |
| `100800` | Alina Gray | `group_3` | 3 | `vo_char_1008_00_04_hca.hca` | 5.00s | 4.51s | -0.49s |
| `100800` | Alina Gray | `group_34` | 3 | `vo_char_1008_00_42_hca.hca` | 3.00s | 2.51s | -0.49s |
| `100850` | Alina Gray | `group_11` | 2 | `vo_char_1008_00_19_hca.hca` | 6.00s | 5.51s | -0.49s |
| `100850` | Alina Gray | `group_3` | 2 | `vo_char_1008_00_04_hca.hca` | 5.00s | 4.51s | -0.49s |
| `100850` | Alina Gray | `group_34` | 2 | `vo_char_1008_00_42_hca.hca` | 3.00s | 2.51s | -0.49s |
| `101100` | Kaede Akino | `group_31` | 8 | `vo_char_1011_00_39_hca.hca` | 12.00s | 11.51s | -0.49s |
| `101100` | Kaede Akino | `group_38` | 4 | `vo_char_1011_00_46_hca.hca` | 3.50s | 3.01s | -0.49s |
| `101150` | Kaede Akino | `group_38` | 3 | `vo_char_1011_00_46_hca.hca` | 3.50s | 3.01s | -0.49s |
| `101152` | Kaede Akino | `group_38` | 2 | `vo_char_1011_00_46_hca.hca` | 3.50s | 3.01s | -0.49s |
| `102551` | Shizuka Tokime | `group_23` | 4 | `vo_char_1025_51_30_hca.hca` | 9.00s | 8.51s | -0.49s |
| `102600` | Chiharu Hiroe | `group_30` | 5 | `vo_char_1026_00_37_hca.hca` | 10.70s | 10.21s | -0.49s |
| `103500` | Alexandra Kurusu | `group_23` | 5 | `vo_char_1035_00_30_hca.hca` | 13.10s | 12.61s | -0.49s |
| `103600` | Urara Yume | `group_14` | 6 | `vo_char_1036_00_21_hca.hca` | 14.20s | 13.71s | -0.49s |
| `104400` | Mikoto Sena | `group_27` | 5 | `vo_char_1044_00_34_hca.hca` | 13.80s | 13.31s | -0.49s |
| `104600` | Chizuru | `group_5` | 2 | `vo_char_1046_00_05_hca.hca` | 4.90s | 4.41s | -0.49s |
| `120100` | Iroha-chan | `group_27` | 3 | `vo_char_1201_00_34_hca.hca` | 7.80s | 7.31s | -0.49s |
| `121600` | Kanagi Izumi | `group_26` | 5 | `vo_char_1216_00_33_hca.hca` | 17.00s | 16.51s | -0.49s |
| `121700` | Mitama Yakumo | `group_10` | 5 | `vo_char_1217_00_17_hca.hca` | 16.70s | 16.21s | -0.49s |
| `180101` | Iroha & Kuroe | `group_29` | 6 | `vo_char_1801_01_36_hca.hca` | 12.60s | 12.11s | -0.49s |
| `200400` | Sayaka Miki | `group_1` | 9 | `vo_char_2004_00_01_hca.hca` | 26.00s | 25.51s | -0.49s |
| `200451` | Sayaka Miki | `group_1` | 7 | `vo_char_2004_00_01_hca.hca` | 26.00s | 25.51s | -0.49s |
| `200900` | Mabayu Aki | `group_24` | 5 | `vo_char_2009_00_31_hca.hca` | 13.80s | 13.31s | -0.49s |
| `220200` | Devil Homura | `group_2` | 4 | `vo_char_2202_00_02_hca.hca` | 12.30s | 11.81s | -0.49s |
| `230000` | Homura Akemi | `group_16` | 9 | `vo_char_2300_00_24_hca.hca` | 15.60s | 15.11s | -0.49s |
| `250000` | Holy Mami | `group_25` | 4 | `vo_char_2500_00_33_hca.hca` | 10.00s | 9.51s | -0.49s |
| `250000` | Holy Mami | `group_4` | 3 | `vo_char_2500_00_05_hca.hca` | 6.00s | 5.51s | -0.49s |
| `250001` | Holy Mami | `group_4` | 3 | `vo_char_2500_00_05_hca.hca` | 6.00s | 5.51s | -0.49s |
| `300250` | Natsuki Utsuho | `group_29` | 11 | `vo_char_3002_50_37_hca.hca` | 17.00s | 16.51s | -0.49s |
| `300250` | Natsuki Utsuho | `group_32` | 5 | `vo_char_3002_50_40_hca.hca` | 15.30s | 14.81s | -0.49s |
| `301000` | Ria Ami | `group_29` | 7 | `vo_char_3010_00_37_hca.hca` | 11.41s | 10.92s | -0.49s |
| `301100` | Kako Natsume | `group_33` | 8 | `vo_char_3011_00_41_hca.hca` | 13.00s | 12.51s | -0.49s |
| `301300` | Leila Ibuki | `group_38` | 3 | `vo_char_3013_00_46_hca.hca` | 3.00s | 2.51s | -0.49s |
| `304700` | Chika Aoba | `group_14` | 6 | `vo_char_3047_00_21_hca.hca` | 12.40s | 11.91s | -0.49s |
| `305000` | Yuuna Kaharu | `group_7` | 3 | `vo_char_3050_00_14_hca.hca` | 4.90s | 4.41s | -0.49s |
| `350100` | Rika & Ren | `group_5` | 2 | `vo_char_3501_00_05_hca.hca` | 3.00s | 2.51s | -0.49s |
| `390200` | Shi | `group_36` | 2 | `vo_char_3902_00_43_hca.hca` | 2.70s | 2.21s | -0.49s |
| `400100` | Oriko Mikuni | `group_35` | 3 | `vo_char_4001_00_43_hca.hca` | 2.00s | 1.51s | -0.49s |
| `401100` | Kazumi | `group_40` | 4 | `vo_char_4011_00_64_hca.hca` | 4.00s | 3.51s | -0.49s |
| `401200` | Umika Misaki | `group_15` | 6 | `vo_char_4012_00_23_hca.hca` | 16.00s | 15.51s | -0.49s |
| `401300` | Kaoru Maki | `group_18` | 6 | `vo_char_4013_00_26_hca.hca` | 18.00s | 17.51s | -0.49s |
| `402100` | Tart | `group_30` | 6 | `vo_char_4021_00_38_hca.hca` | 12.80s | 12.31s | -0.49s |
| `402300` | Melissa | `group_31` | 5 | `vo_char_4023_00_39_hca.hca` | 13.00s | 12.51s | -0.49s |
| `402500` | Corbeau | `group_24` | 5 | `vo_char_4025_00_31_hca.hca` | 15.50s | 15.01s | -0.49s |
| `405100` | Nanoha Takamachi | `group_29` | 4 | `vo_char_4051_00_36_hca.hca` | 13.00s | 12.51s | -0.49s |
| `405200` | Fate | `group_33` | 7 | `vo_char_4052_00_40_hca.hca` | 14.00s | 13.51s | -0.49s |
| `100900` | Rena Minami | `group_16` | 4 | `vo_char_1009_00_24_hca.hca` | 9.00s | 8.50s | -0.50s |
| `101051` | Momoko Togame | `group_30` | 5 | `vo_char_1010_51_38_hca.hca` | 12.00s | 11.50s | -0.50s |
| `101100` | Kaede Akino | `group_24` | 5 | `vo_char_1011_00_32_hca.hca` | 12.50s | 12.00s | -0.50s |
| `101150` | Kaede Akino | `group_29` | 4 | `vo_char_1011_50_37_hca.hca` | 14.20s | 13.70s | -0.50s |
| `101400` | Nemu Hiiragi | `group_14` | 4 | `vo_char_1014_00_21_hca.hca` | 15.40s | 14.90s | -0.50s |
| `101450` | Nemu Hiiragi | `group_14` | 4 | `vo_char_1014_00_21_hca.hca` | 15.40s | 14.90s | -0.50s |
| `102800` | Himena Aika | `group_25` | 5 | `vo_char_1028_00_32_hca.hca` | 10.80s | 10.30s | -0.50s |
| `102850` | Himena Aika | `group_32` | 6 | `vo_char_1028_50_39_hca.hca` | 11.50s | 11.00s | -0.50s |
| `104050` | Yozuru Sasame | `group_24` | 4 | `vo_char_1040_50_31_hca.hca` | 13.30s | 12.80s | -0.50s |
| `104600` | Chizuru | `group_26` | 7 | `vo_char_1046_00_33_hca.hca` | 14.40s | 13.90s | -0.50s |
| `104900` | Olga | `group_17` | 5 | `vo_char_1049_00_24_hca.hca` | 10.90s | 10.40s | -0.50s |
| `105300` | Amaryllis | `group_24` | 4 | `vo_char_1053_00_31_hca.hca` | 11.00s | 10.50s | -0.50s |
| `105300` | Amaryllis | `group_35` | 2 | `vo_char_1053_00_42_hca.hca` | 4.00s | 3.50s | -0.50s |
| `110701` | Touka & Nemu | `group_29` | 5 | `vo_char_1107_01_36_hca.hca` | 13.20s | 12.70s | -0.50s |
| `111000` | Momoko Togame | `group_15` | 6 | `vo_char_1110_00_22_hca.hca` | 16.40s | 16.90s | +0.50s |
| `111800` | Amane Sisters | `group_13` | 3 | `vo_char_1118_00_20_hca.hca` | 7.70s | 7.20s | -0.50s |
| `111801` | Amane Sisters | `group_13` | 3 | `vo_char_1118_00_20_hca.hca` | 7.70s | 7.20s | -0.50s |
| `111802` | Amane Sisters | `group_13` | 3 | `vo_char_1118_00_20_hca.hca` | 7.70s | 7.20s | -0.50s |
| `114400` | Uwasa Mikoto | `group_31` | 4 | `vo_char_1144_00_38_hca.hca` | 13.60s | 13.10s | -0.50s |
| `120100` | Iroha-chan | `group_14` | 3 | `vo_char_1201_00_21_hca.hca` | 9.50s | 9.00s | -0.50s |
| `120900` | Rena & Kaede | `group_18` | 4 | `vo_char_1209_00_25_hca.hca` | 11.30s | 10.80s | -0.50s |
| `120900` | Rena & Kaede | `group_5` | 3 | `vo_char_1209_00_05_hca.hca` | 7.00s | 6.50s | -0.50s |
| `120901` | Rena & Kaede | `group_5` | 3 | `vo_char_1209_00_05_hca.hca` | 7.00s | 6.50s | -0.50s |
| `120902` | Rena & Kaede | `group_5` | 3 | `vo_char_1209_00_05_hca.hca` | 7.00s | 6.50s | -0.50s |
| `200700` | Nagisa Momoe | `group_21` | 6 | `vo_char_2007_00_28_hca.hca` | 11.90s | 12.40s | +0.50s |
| `200700` | Nagisa Momoe | `group_26` | 9 | `vo_char_2007_00_33_hca.hca` | 13.10s | 13.60s | +0.50s |
| `200900` | Mabayu Aki | `group_26` | 6 | `vo_char_2009_00_33_hca.hca` | 15.00s | 14.50s | -0.50s |
| `220200` | Devil Homura | `group_10` | 4 | `vo_char_2202_00_17_hca.hca` | 11.30s | 10.80s | -0.50s |
| `250100` | Mami Tomoe | `group_17` | 5 | `vo_char_2501_00_24_hca.hca` | 12.70s | 12.20s | -0.50s |
| `300300` | Hinano Miyako | `group_35` | 3 | `vo_char_3003_00_43_hca.hca` | 2.50s | 2.00s | -0.50s |
| `300351` | Hinano Miyako | `group_32` | 4 | `vo_char_3003_51_40_hca.hca` | 11.00s | 10.50s | -0.50s |
| `300351` | Hinano Miyako | `group_35` | 2 | `vo_char_3003_00_43_hca.hca` | 2.50s | 2.00s | -0.50s |
| `300400` | Sasara Minagi | `group_10` | 6 | `vo_char_3004_00_18_hca.hca` | 13.00s | 12.50s | -0.50s |
| `300651` | Emiri Kisaki | `group_25` | 5 | `vo_char_3006_51_33_hca.hca` | 13.00s | 12.50s | -0.50s |
| `300700` | Shizuku Hozumi | `group_41` | 4 | `vo_char_3007_00_65_hca.hca` | 4.00s | 3.50s | -0.50s |
| `300750` | Shizuku Hozumi | `group_41` | 2 | `vo_char_3007_00_65_hca.hca` | 4.00s | 3.50s | -0.50s |
| `300850` | Akira Shinobu | `group_27` | 6 | `vo_char_3008_50_35_hca.hca` | 12.90s | 12.40s | -0.50s |
| `301700` | Yukika Nanase | `group_21` | 5 | `vo_char_3017_00_28_hca.hca` | 11.40s | 11.90s | +0.50s |
| `301950` | Ayaka Mariko | `group_28` | 3 | `vo_char_3019_50_36_hca.hca` | 11.70s | 11.20s | -0.50s |
| `302100` | Sakuya Suzuka | `group_1` | 8 | `vo_char_3021_00_01_hca.hca` | 25.70s | 26.20s | +0.50s |
| `302100` | Sakuya Suzuka | `group_19` | 5 | `vo_char_3021_00_26_hca.hca` | 14.50s | 15.00s | +0.50s |
| `302300` | Aimi Eri | `group_22` | 6 | `vo_char_3023_00_30_hca.hca` | 9.50s | 9.00s | -0.50s |
| `302600` | Konoha Shizumi | `group_1` | 7 | `vo_char_3026_00_01_hca.hca` | 27.00s | 26.50s | -0.50s |
| `303700` | Mel Anna | `group_2` | 3 | `vo_char_3037_00_03_hca.hca` | 4.30s | 3.80s | -0.50s |
| `303700` | Mel Anna | `group_28` | 4 | `vo_char_3037_00_36_hca.hca` | 11.00s | 10.50s | -0.50s |
| `303751` | Mel Anna | `group_2` | 2 | `vo_char_3037_00_03_hca.hca` | 4.30s | 3.80s | -0.50s |
| `304800` | Hotaru Yura | `group_27` | 6 | `vo_char_3048_00_34_hca.hca` | 17.50s | 18.00s | +0.50s |
| `305100` | Jun Kazari | `group_8` | 3 | `vo_char_3051_00_15_hca.hca` | 4.70s | 4.20s | -0.50s |
| `350100` | Rika & Ren | `group_11` | 5 | `vo_char_3501_00_18_hca.hca` | 13.00s | 12.50s | -0.50s |
| `390200` | Shi | `group_24` | 6 | `vo_char_3902_00_31_hca.hca` | 14.10s | 13.60s | -0.50s |
| `401100` | Kazumi | `group_28` | 6 | `vo_char_4011_00_36_hca.hca` | 12.00s | 11.50s | -0.50s |
| `402200` | Riz | `group_24` | 4 | `vo_char_4022_00_32_hca.hca` | 12.00s | 11.50s | -0.50s |
| `402200` | Riz | `group_32` | 5 | `vo_char_4022_00_40_hca.hca` | 15.50s | 16.00s | +0.50s |
| `403100` | Suzune Amano | `group_18` | 5 | `vo_char_4031_00_26_hca.hca` | 11.80s | 11.30s | -0.50s |
| `405100` | Nanoha Takamachi | `group_4` | 4 | `vo_char_4051_00_04_hca.hca` | 4.00s | 3.50s | -0.50s |
