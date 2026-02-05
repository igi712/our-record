// Magia Record / magireco_viewer-inspired Live2D handling (v2):
// - Uses Priority 3 (FORCE) to overwrite motions instantly.
// - "Infinite Tail" Policy: Sets all motions to Loop (to keep them alive), 
//   but overrides the update loop to freeze playback at the final frame.
//   This prevents the "Eye Glitch" (by never stopping) and "Vibration" (by not actually looping).

(function () {
    'use strict';

    // Patch: Fallback for missing textures so models render even when some texture files 404.
    // Installs a safe replacement for PIXI.Texture.fromURL and `PIXI.Texture.from`.
    (function installPixiTextureFallback() {
        function makePlaceholder() {
            try {
                const c = document.createElement('canvas');
                c.width = 2; c.height = 2;
                const ctx = c.getContext('2d');
                ctx.clearRect(0,0,2,2);
                const base = new PIXI.BaseTexture(c);
                return new PIXI.Texture(base);
            } catch (e) {
                // If PIXI not available yet, return a simple object to avoid throws.
                return { _placeholder: true };
            }
        }

        function doPatch() {
            if (!window.PIXI) return false;
            if (PIXI.__mrTextureFallbackInstalled) return true;

            // Patch async loader from URL
            try {
                if (typeof PIXI.Texture.fromURL === 'function') {
                    const origFromURL = PIXI.Texture.fromURL.bind(PIXI.Texture);
                    PIXI.Texture.fromURL = async function (url, options) {
                        try {
                            return await origFromURL(url, options);
                        } catch (e) {
                            try { console.warn('Missing texture, using placeholder:', url); } catch {}
                            return makePlaceholder();
                        }
                    };
                }
            } catch (e) {}

            // Patch synchronous Texture.from (often used by libraries)
            try {
                if (typeof PIXI.Texture.from === 'function') {
                    const origFrom = PIXI.Texture.from.bind(PIXI.Texture);
                    PIXI.Texture.from = function (resource, options) {
                        try {
                            return origFrom(resource, options);
                        } catch (e) {
                            try { console.warn('Texture.from failed, using placeholder:', resource); } catch {}
                            return makePlaceholder();
                        }
                    };
                }
            } catch (e) {}

            PIXI.__mrTextureFallbackInstalled = true;
            return true;
        }

        // Try immediate patch; also retry once PIXI becomes available.
        try { doPatch(); } catch (e) {}
        const handle = setInterval(() => { if (doPatch()) clearInterval(handle); }, 250);
    })();

    // Suppress thrown/rejected texture-loading errors from terminating model load.
    (function suppressTextureErrors() {
        try {
            window.addEventListener('unhandledrejection', function (ev) {
                try {
                    const r = ev && ev.reason ? String(ev.reason) : '';
                    if (r.includes('Texture loading error')) {
                        try { console.warn('Suppressed unhandled rejection:', r); } catch {}
                        ev.preventDefault();
                    }
                } catch (e) {}
            });
            window.addEventListener('error', function (ev) {
                try {
                    const m = ev && ev.message ? String(ev.message) : '';
                    if (m.includes('Texture loading error')) {
                        try { console.warn('Suppressed error event:', m); } catch {}
                        ev.preventDefault();
                    }
                } catch (e) {}
            });
        } catch (e) {}
    })();

    function easeOutCubic(t) {
        const tt = Math.max(0, Math.min(1, Number(t) || 0));
        return 1 - Math.pow(1 - tt, 3);
    }

    function clamp01(v) {
        const n = Number(v);
        if (!Number.isFinite(n)) return 0;
        return Math.max(0, Math.min(1, n));
    }

    function setParameterById(model, id, value) {
        const im = model?.internalModel;
        const core = im?.coreModel;
        if (!core) return false;
        const v = Number(value) || 0;
        try {
            if (typeof core.setParameterValueById === 'function') {
                core.setParameterValueById(id, v, 1);
                return true;
            }
        } catch {}
        return false;
    }

    function getMotionName(def) {
        const n = def?.Name;
        return typeof n === 'string' ? n : '';
    }

    function isIdleMotionName(name) {
        return /^motion_0\d\d$/i.test(String(name || ''));
    }

    function buildMotionIndexByNumber(definitions) {
        const out = new Map();
        if (!Array.isArray(definitions)) return out;
        for (let i = 0; i < definitions.length; i++) {
            const name = getMotionName(definitions[i]);
            const m = /^motion_(\d+)/i.exec(name);
            if (!m) continue;
            const n = Number(m[1]);
            if (Number.isFinite(n)) out.set(n, i);
        }
        return out;
    }

    function createController(model, modelJson) {
        const im = model.internalModel;

        function mapCheekScenarioToParam(v) {
            const n = Number(v);
            if (!Number.isFinite(n)) return 0;
            return n;
        }

        const state = {
            model,
            modelJson,
            playing: false,
            sequenceTimer: null,
            restartTimer: null,
            steps: [],
            cheekManualActive: false,
            cheekLocked: false,
            cheekValue: 0,
            eyeManualActive: false,
            eyeLocked: false,
            eyeOpenValue: 1,
            eyeTween: null,
            mouthManualActive: false,
            mouthLocked: false,
            mouthOpenValue: 0,
            tearManualActive: false,
            tearLocked: false,
            tearValue: 0,
            soulGemManualActive: false,
            soulGemLocked: false,
            soulGemValue: 0,
            micActive: false,
            micAnalyser: null,
            micBuf: null,
            micSensitivity: 1,
        };

        const motionDefs = im?.motionManager?.definitions || {};
        const defaultMotionGroup = Object.keys(motionDefs)[0] || 'Motion';
        const motionIndexByNumber = buildMotionIndexByNumber(motionDefs[defaultMotionGroup]);

        function isIdleMotionDef(motionDef, fallback) {
            const raw = String(motionDef?.Name ?? motionDef?.File ?? fallback ?? '');
            const k = raw.split('/').pop();
            return /^motion_0\d\d\b/i.test(k) || /^motion_0\d\d\./i.test(k);
        }

        // --- MOTION POLICY: INFINITE TAIL HACK ---
        try {
            const mm = im?.motionManager;
            if (mm && mm.motionDataType === 'json' && typeof mm.createMotion === 'function' && !mm.__mrV2PatchedCreateMotion) {
                const originalCreateMotion = mm.createMotion;
                mm.createMotion = function (motionJson, group, motionDef) {
                    const motion = originalCreateMotion.call(this, motionJson, group, motionDef);
                    const idleByName = isIdleMotionDef(motionDef, 0);

                    if (motion.__mrV2Patched) return motion;
                    motion.__mrV2Patched = true;

                    try {
                        // 1. Force ALL motions to Loop. 
                        // This prevents the engine from killing the motion or fading it out when it ends.
                        // It keeps the motion "Active", which solves the Eye Glitch.
                        if (typeof motion.setIsLoop === 'function') motion.setIsLoop(true);

                        // 2. Disable auto-fadeout on loop end. We handle transitions via Priority 3.
                        if (typeof motion.setIsLoopFadeIn === 'function') motion.setIsLoopFadeIn(false);
                        if (typeof motion.setFadeOutTime === 'function') motion.setFadeOutTime(0);

                        // 3. Hijack the update logic.
                        if (typeof motion.doUpdateParameters === 'function') {
                            const originalDoUpdate = motion.doUpdateParameters;
                            
                            motion.doUpdateParameters = function (coreModel, timeSeconds, weight, queueEntry) {
                                try {
                                    // Calculate how far we are into the animation
                                    const startTime = queueEntry.getStartTime();
                                    const elapsed = timeSeconds - startTime;
                                    
                                    // Get the REAL duration of the file
                                    const getNum = (v) => (Number.isFinite(Number(v)) ? Number(v) : null);
                                    const duration =
                                        getNum(this.getLoopDuration?.()) ??
                                        getNum(this.getDuration?.()) ??
                                        getNum(this._loopDurationSeconds) ??
                                        getNum(this._motionData?.duration) ??
                                        null;

                                    if (duration && duration > 0) {
                                        // If this is a non-idle motion and we've passed the end...
                                        // (We let idles loop naturally)
                                        if (!idleByName && elapsed >= duration) {
                                            
                                            // FREEZE LOGIC:
                                            // We tell the engine to evaluate the motion at (Duration - 0.001).
                                            // This freezes the pose at the last frame.
                                            // Since we set IsLoop(true) above, the motion stays active forever.
                                            
                                            const freezeTime = startTime + duration - 0.001;
                                            
                                            // Prevent the queue from ever thinking it's done
                                            if (typeof queueEntry.setEndTime === 'function') queueEntry.setEndTime(-1);

                                            return originalDoUpdate.call(this, coreModel, freezeTime, weight, queueEntry);
                                        }
                                    }
                                } catch (e) {}

                                // Normal playback
                                return originalDoUpdate.call(this, coreModel, timeSeconds, weight, queueEntry);
                            };
                        }
                    } catch (e) {
                        console.warn('Motion policy patch failed', e);
                    }
                    return motion;
                };
                mm.__mrV2PatchedCreateMotion = true;
            }
        } catch {}

        // Remove body sway (natural movement), but keep breath + blink.
        try {
            if (im && !im.__mrV2NoSwayInstalled && typeof im.updateNaturalMovements === 'function') {
                const breathCycleSec = 3.2345;
                im.updateNaturalMovements = (deltaMs, elapsedMs) => {
                    const coreModel = im.coreModel;
                    if (!coreModel) return;
                    const t = (Number(elapsedMs) / 1000) * 2 * Math.PI;
                    const breathValue = 0.5 + 0.5 * Math.sin(t / breathCycleSec);
                    if (typeof coreModel.setParameterValueById === 'function') {
                        const breathId = im.idParamBreath || 'ParamBreath';
                        coreModel.setParameterValueById(breathId, breathValue, 1);
                    }
                };
                try {
                    const breath = im.breath;
                    if (breath && typeof breath.setParameters === 'function' && !im.__mrV2BreathOnlyConfigured) {
                        const breathId = im.idParamBreath || 'ParamBreath';
                        breath.setParameters([
                            { parameterId: breathId, offset: 0, peak: 0.5, cycle: breathCycleSec, weight: 0.5 }
                        ]);
                        im.__mrV2BreathOnlyConfigured = true;
                    }
                } catch {}
                im.__mrV2NoSwayInstalled = true;
            }
        } catch {}

        // Blink state
        const blink = {
            state: 0,
            nextBlinkInMs: 6500,
            closingMs: 100,
            closedMs: 50,
            openingMs: 150,
            phaseMs: 0,
            eyeValue: 1,
        };

        function cancelTween(tweenKey) {
            const tw = state[tweenKey];
            if (tw && typeof tw.raf === 'number') {
                try { cancelAnimationFrame(tw.raf); } catch {}
            }
            state[tweenKey] = null;
        }

        function tweenValue({
            from,
            to,
            durationMs,
            onUpdate,
            onDone,
            ease = easeOutCubic,
        }) {
            const start = performance.now();
            const f0 = Number(from);
            const t0 = Number(to);
            const dur = Math.max(1, Number(durationMs) || 1);

            function frame(now) {
                const k = Math.min(1, (now - start) / dur);
                const kk = ease(k);
                const v = f0 + (t0 - f0) * kk;
                try { onUpdate(v); } catch {}
                if (k < 1) {
                    const raf = requestAnimationFrame(frame);
                    if (state.__activeTween && state.__activeTween.raf !== raf) state.__activeTween.raf = raf;
                } else {
                    try { onDone && onDone(); } catch {}
                }
            }

            const tw = { raf: requestAnimationFrame(frame) };
            return tw;
        }

        function setEyeOpenTarget(targetOpen, { locked, durationMs = 300, releaseToAuto = false } = {}) {
            const target = clamp01(targetOpen);

            state.eyeLocked = !!locked;
            cancelTween('eyeTween');

            // While tweening, force manual active so blink doesn't fight us.
            state.eyeManualActive = true;

            const from = clamp01(state.eyeOpenValue);
            if (Math.abs(from - target) < 0.0001) {
                state.eyeOpenValue = target;
                if (releaseToAuto && !state.eyeLocked && target >= 0.999) {
                    state.eyeManualActive = false;
                    state.eyeOpenValue = 1;
                }
                return;
            }

            const tw = tweenValue({
                from,
                to: target,
                durationMs,
                onUpdate: (v) => { state.eyeOpenValue = clamp01(v); },
                onDone: () => {
                    state.eyeOpenValue = target;
                    state.eyeTween = null;
                    if (releaseToAuto && !state.eyeLocked && target >= 0.999) {
                        state.eyeManualActive = false;
                        state.eyeOpenValue = 1;
                    }
                },
            });
            state.eyeTween = tw;
            state.__activeTween = tw;
        }



        function setEyes(v) {
            if (state.eyeManualActive) return;
            const vv = clamp01(v);
            setParameterById(model, 'ParamEyeLOpen', vv);
            setParameterById(model, 'ParamEyeROpen', vv);
        }

        function updateBlink(deltaMs) {
            const dt = Number(deltaMs) || 0;
            if (dt <= 0) return;
            switch (blink.state) {
                case 0:
                    blink.nextBlinkInMs -= dt;
                    if (blink.nextBlinkInMs <= 0) {
                        blink.state = 1;
                        blink.phaseMs = 0;
                    }
                    break;
                case 1:
                    blink.phaseMs += dt;
                    const k1 = Math.min(1, blink.phaseMs / blink.closingMs);
                    blink.eyeValue = 1 - k1;
                    if (k1 >= 1) {
                        blink.state = 2;
                        blink.phaseMs = 0;
                    }
                    break;
                case 2:
                    blink.phaseMs += dt;
                    blink.eyeValue = 0;
                    if (blink.phaseMs >= blink.closedMs) {
                        blink.state = 3;
                        blink.phaseMs = 0;
                    }
                    break;
                case 3:
                    blink.phaseMs += dt;
                    const k2 = Math.min(1, blink.phaseMs / blink.openingMs);
                    blink.eyeValue = k2;
                    if (k2 >= 1) {
                        blink.state = 0;
                        blink.phaseMs = 0;
                        blink.nextBlinkInMs = 4500 + (Math.random() * 3500);
                    }
                    break;
            }
        }

        function stopAll() {
            try { im?.motionManager?.stopAllMotions?.(); } catch {}
        }

        function startMotion(group, index) {
            if (!group) group = defaultMotionGroup;
            // DO NOT stopAll(). We blend via Priority 3.

            // Reset internal state to ensure replay works even if frozen
            try {
                if (im.motionManager.state) {
                    im.motionManager.state.reset();
                }
            } catch (e) {}

            try {
                // Priority 3 (FORCE) ensures immediate start + smooth transition
                model.motion(group, index, 3);
                return true;
            } catch (e) {
                console.warn('startMotion failed', { group, index, e });
                return false;
            }
        }

        function setExpressionByIndex(exprIndex) {
            try {
                model.expression(exprIndex);
                return true;
            } catch (e) {
                return false;
            }
        }

        function cancelSequence() {
            state.playing = false;
            if (state.sequenceTimer) clearTimeout(state.sequenceTimer);
            state.sequenceTimer = null;
            if (state.restartTimer) clearTimeout(state.restartTimer);
            state.restartTimer = null;
            state.steps = [];
        }

        function stopSequence() {
            cancelSequence();
            stopAll();
        }

        async function runNextStep() {
            if (!state.playing) return;
            const step = state.steps.shift();
            if (!step) {
                state.playing = false;
                return;
            }
            if (typeof step.cheek === 'number') {
                state.cheekManualActive = true;
                state.cheekValue = mapCheekScenarioToParam(step.cheek);
            }
            if (typeof step.eyeOpen === 'number') {
                state.eyeManualActive = true;
                state.eyeOpenValue = clamp01(step.eyeOpen);
            }
            if (typeof step.faceIndex === 'number') {
                setExpressionByIndex(step.faceIndex);
            }
            if (typeof step.motionIndex === 'number') {
                startMotion(step.motionGroup || defaultMotionGroup, step.motionIndex);
            }
            const t = Math.max(0, Number(step.timeMs) || 0);
            if (t > 0) {
                state.sequenceTimer = setTimeout(runNextStep, t);
            } else {
                state.sequenceTimer = setTimeout(runNextStep, 0);
            }
        }

        function playSteps(steps) {
            cancelSequence();
            state.steps = Array.isArray(steps) ? steps.slice() : [];
            if (state.steps.length === 0) return;
            state.playing = true;
            runNextStep();
        }

        function playRandomOnce() {
            const defs = motionDefs[defaultMotionGroup] || [];
            const candidates = [];
            for (let i = 0; i < defs.length; i++) {
                const name = getMotionName(defs[i]);
                if (!name) continue;
                if (isIdleMotionName(name)) continue;
                candidates.push(i);
            }
            if (candidates.length === 0) {
                try { model.motion(defaultMotionGroup, 0); } catch (e) { startMotion(defaultMotionGroup, 0); }
                return;
            }
            const chosen = candidates[(Math.random() * candidates.length) | 0];

            let exprIdx = null;
            let exprName = null;
            try {
                const exprDefs = im?.motionManager?.expressionManager?.definitions;
                if (Array.isArray(exprDefs) && exprDefs.length > 0) {
                    exprIdx = (Math.random() * exprDefs.length) | 0;
                    exprName = String(exprDefs[exprIdx]?.Name ?? null);
                }
            } catch {}

            const cheekPool = [-1, 0, 0, 1, 1, 2];
            const cheek = cheekPool[(Math.random() * cheekPool.length) | 0];
            const eyeClose = Math.random() < 0.3;
            const eyeOpen = eyeClose ? 0 : 1;

            const mouthOpen = Math.random() < 0.5;
            const mouth = mouthOpen ? 1 : 0;

            // Mostly-off extras to avoid looking too noisy.
            const tear = Math.random() < 0.15 ? 1 : 0;
            const soulGem = Math.random() < 0.2 ? 1 : 0;

            const choice = {
                motionGroup: defaultMotionGroup,
                motionIndex: chosen,
                faceIndex: exprIdx,
                faceName: exprName,
                cheek,
                eyeClose,
                eyeOpen,
                mouthOpen,
                mouth,
                tear,
                soulGem,
                timeMs: 4200
            };

            try {
                if (typeof window !== 'undefined' && typeof CustomEvent === 'function') {
                    window.dispatchEvent(new CustomEvent('mrv2:randomChoice', { detail: choice }));
                }
            } catch {}

            try { if (exprIdx !== null) setExpressionByIndex(exprIdx); } catch (e) {}

            try {
                state.cheekManualActive = true;
                state.cheekValue = choice.cheek;
                setParameterById(model, 'ParamCheek', Number(choice.cheek) || 0);
            } catch (e) {}

            try {
                setEyeOpenTarget(choice.eyeOpen, { locked: true, durationMs: 300, releaseToAuto: false });
            } catch (e) {}

            try {
                state.mouthManualActive = true;
                state.mouthOpenValue = clamp01(choice.mouth);
                setParameterById(model, 'ParamMouthOpenY', clamp01(choice.mouth));
            } catch (e) {}

            try {
                state.tearManualActive = true;
                state.tearValue = clamp01(choice.tear);
                setParameterById(model, 'ParamTear', clamp01(choice.tear));
            } catch (e) {}

            try {
                state.soulGemManualActive = true;
                state.soulGemValue = clamp01(choice.soulGem);
                setParameterById(model, 'ParamSoulgem', clamp01(choice.soulGem));
            } catch (e) {}

            startMotion(defaultMotionGroup, chosen);
        }

        function clickPlayRandom() {
            cancelSequence();
            state.playing = true;
            playRandomOnce();
        }

        function afterMotionUpdate() {
            const m = state.model;
            if (!m) return;

            // SMART BLINK: Only write to eyes if actively closing/opening.
            if (!state.eyeManualActive) {
                const dt = Number(m?.deltaTime);
                if (Number.isFinite(dt) && dt > 0) updateBlink(dt);
                if (blink.state !== 0) {
                    setParameterById(m, 'ParamEyeLOpen', blink.eyeValue);
                    setParameterById(m, 'ParamEyeROpen', blink.eyeValue);
                }
            }

            if (state.eyeManualActive) {
                const v = clamp01(state.eyeOpenValue);
                setParameterById(m, 'ParamEyeLOpen', v);
                setParameterById(m, 'ParamEyeROpen', v);
            }

            if (state.cheekManualActive) {
                const v = Number(state.cheekValue) || 0;
                setParameterById(m, 'ParamCheek', v);
            }

            if (state.tearManualActive) {
                const v = clamp01(state.tearValue);
                setParameterById(m, 'ParamTear', v);
            }

            if (state.soulGemManualActive) {
                const v = clamp01(state.soulGemValue);
                // Note: asset parameter id is "ParamSoulgem" (lowercase g)
                setParameterById(m, 'ParamSoulgem', v);
            }

            if (state.micActive && state.micAnalyser && state.micBuf) {
                try {
                    state.micAnalyser.getByteFrequencyData(state.micBuf);
                    const step = 100;
                    const maxIndex = Math.min(700, state.micBuf.length - 1);
                    let sum = 0;
                    let count = 0;
                    for (let i = 0; i <= maxIndex; i += step) {
                        sum += state.micBuf[i];
                        count++;
                    }
                    const avg = count ? (sum / count) : 0;
                    const base = (avg - 20) / 60;
                    const mouthValue = clamp01(base * (Number(state.micSensitivity) || 1));
                    setParameterById(m, 'ParamMouthOpenY', mouthValue);
                } catch {}
            } else if (state.mouthManualActive) {
                setParameterById(m, 'ParamMouthOpenY', clamp01(state.mouthOpenValue));
            }
        }

        try {
            im.on('afterMotionUpdate', afterMotionUpdate);
        } catch (e) {
            console.warn('Failed to attach afterMotionUpdate handler', e);
        }

        function beforeModelUpdate() {
            const m = state.model;
            if (!m) return;
            if (!state.cheekManualActive) return;
            const v = Number(state.cheekValue) || 0;
            setParameterById(m, 'ParamCheek', v);
        }

        try {
            im.on('beforeModelUpdate', beforeModelUpdate);
        } catch (e) { }

        return {
            get defaultMotionGroup() { return defaultMotionGroup; },
            get motionIndexByNumber() { return motionIndexByNumber; },

            startMotion,
            stopAll,
            stopSequence,
            playSteps,
            clickPlayRandom,

            setCheek(value, locked) {
                state.cheekValue = Number(value) || 0;
                state.cheekLocked = !!locked;
                state.cheekManualActive = true;
            },

            // scenario_adv.json: eyeClose
            setEyeClose(isClosed, locked) {
                return this.setEyeClosed(isClosed, locked);
            },

            setEyeClosed(isClosed, locked) {
                const closed = !!isClosed;
                // If user is opening eyes with an unlocked checkbox, release back to blink after tween.
                const releaseToAuto = (!closed && !locked);
                setEyeOpenTarget(closed ? 0 : 1, { locked: !!locked, durationMs: 300, releaseToAuto });
            },

            // scenario_adv.json: mouthOpen
            setMouthOpen(value, locked) {
                return this.setMouth(value, locked);
            },

            setMouth(value, locked) {
                state.mouthOpenValue = clamp01(value);
                state.mouthLocked = !!locked;
                state.mouthManualActive = true;
            },


            // scenario_adv.json: tear
            setTear(value, locked) {
                state.tearValue = clamp01(value);
                state.tearLocked = !!locked;
                state.tearManualActive = true;
            },

            // scenario_adv.json: soulGem
            setSoulGem(value, locked) {
                state.soulGemValue = clamp01(value);
                state.soulGemLocked = !!locked;
                state.soulGemManualActive = true;
            },

            clearMouthManualIfUnlocked() {
                if (!state.mouthLocked) state.mouthManualActive = false;
            },

            setMic(active, analyser, buf, sensitivity) {
                state.micActive = !!active;
                state.micAnalyser = analyser || null;
                state.micBuf = buf || null;
                state.micSensitivity = Number(sensitivity) || 1;
            },

            setMicSensitivity(v) {
                state.micSensitivity = Number(v) || 1;
            },

            setExpressionByName(name) {
                const exprDefs = im?.motionManager?.expressionManager?.definitions;
                if (!Array.isArray(exprDefs)) return false;
                const idx = exprDefs.findIndex(e => String(e?.Name || '').split('.')[0] === String(name || '').split('.')[0]);
                if (idx < 0) return false;
                return setExpressionByIndex(idx);
            },
        };
    }

    window.createMagirecoStyleControllerV2 = function createMagirecoStyleControllerV2(model, modelJson) {
        if (!model?.internalModel) throw new Error('Model missing internalModel');
        const existing = model.internalModel.__mrControllerV2;
        if (existing) return existing;
        const controller = createController(model, modelJson);
        model.internalModel.__mrControllerV2 = controller;
        return controller;
    };
})();