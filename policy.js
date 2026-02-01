// Live2D behavior policy + best-effort motion/expression helpers

function tryStartMotion(model, group, index) {
    try {
        const mm = model?.internalModel?.motionManager;
        if (mm && typeof mm.stopAllMotions === 'function') mm.stopAllMotions();
        if (mm && typeof mm.setReservePriority === 'function') mm.setReservePriority(3);
        if (mm && typeof mm.setCurrentPriority === 'function') mm.setCurrentPriority(0);
    } catch {}

    try {
        if (typeof model.motion === 'function') {
            model.motion(group, index, 3);
            return true;
        }
    } catch {}

    try {
        const mm = model?.internalModel?.motionManager;
        if (mm && typeof mm.startMotion === 'function') {
            mm.startMotion(group, index, 3);
            return true;
        }
    } catch {}

    return false;
}

function trySetExpression(model, expressionNameOrIndex) {
    try {
        const em = model?.internalModel?.expressionManager;
        if (em && typeof em.resetExpression === 'function') em.resetExpression();
        if (em && typeof em.stopAllExpressions === 'function') em.stopAllExpressions();
    } catch {}

    try {
        if (typeof model.expression === 'function') {
            model.expression(expressionNameOrIndex);
            return true;
        }
    } catch {}

    try {
        const em = model?.internalModel?.expressionManager;
        if (em && typeof em.setExpression === 'function') {
            em.setExpression(expressionNameOrIndex);
            return true;
        }
    } catch {}

    return false;
}

function applyMagirecoIdlePolicy(model, modelJson) {
    const mm = model?.internalModel?.motionManager;
    const internalModel = model?.internalModel;
    if (!mm || !internalModel) return;

    // Keep blinking + breathing, but disable body sway.

    try {
        if (typeof internalModel.updateNaturalMovements === 'function') {
            internalModel.updateNaturalMovements = (deltaMs, elapsedMs) => {
                const coreModel = internalModel.coreModel;
                if (!coreModel) return;
                const t = (elapsedMs / 1000) * 2 * Math.PI;
                const breathValue = 0.5 + 0.5 * Math.sin(t / 3.2345);

                const breathIndex = Number(internalModel.breathParamIndex);
                if (Number.isFinite(breathIndex) && breathIndex >= 0 && typeof coreModel.setParamFloat === 'function') {
                    coreModel.setParamFloat(breathIndex, breathValue);
                    return;
                }

                if (typeof coreModel.setParameterValueById === 'function') {
                    const breathId = internalModel.idParamBreath || 'ParamBreath';
                    coreModel.setParameterValueById(breathId, breathValue, 1);
                }
            };
        }
    } catch {}

    try {
        const breath = internalModel.breath;
        if (breath && typeof breath.setParameters === 'function' && !internalModel.__magirecoBreathOnlyConfigured) {
            const breathId = internalModel.idParamBreath || 'ParamBreath';
            breath.setParameters([
                { parameterId: breathId, offset: 0, peak: 0.5, cycle: 3.2345, weight: 0.5 }
            ]);
            internalModel.__magirecoBreathOnlyConfigured = true;
        }
    } catch {}

    try {
        if (!internalModel.__magirecoBlinkInstalled && typeof internalModel.on === 'function') {
            const blink = {
                state: 0,
                nextBlinkInMs: 6500,
                closingMs: 100,
                closedMs: 50,
                openingMs: 150,
                phaseMs: 0,
                eyeValue: 1
            };

            const setEyes = (v) => {
                const coreModel = internalModel.coreModel;
                if (!coreModel) return;

                // If a manual eye override is active, prefer that value and skip blink math.
                if (internalModel.__magirecoEyeManualActive) {
                    v = Number(internalModel.__magirecoEyeManualValue) ?? v;
                }

                if (typeof coreModel.setParamFloat === 'function') {
                    const leftIdx = Number(internalModel.leftParam ?? internalModel.eyeBlink?.leftParam);
                    const rightIdx = Number(internalModel.rightParam ?? internalModel.eyeBlink?.rightParam);
                    if (Number.isFinite(leftIdx) && leftIdx >= 0) coreModel.setParamFloat(leftIdx, v);
                    if (Number.isFinite(rightIdx) && rightIdx >= 0) coreModel.setParamFloat(rightIdx, v);
                    return;
                }

                if (typeof coreModel.setParameterValueById === 'function') {
                    coreModel.setParameterValueById('ParamEyeLOpen', v, 1);
                    coreModel.setParameterValueById('ParamEyeROpen', v, 1);
                }
            };

            const applyManualOverrides = () => {
                try {
                    const coreModel = internalModel.coreModel;
                    if (!coreModel) return;

                    // Cheek: apply when either manually active or locked.
                    if (internalModel.__magirecoCheekLocked || internalModel.__magirecoCheekManualActive) {
                        const v = Number(internalModel.__magirecoCheekValue) || 0;
                        if (typeof coreModel.setParameterValueById === 'function') {
                            coreModel.setParameterValueById('ParamCheek', v, 1);
                        } else if (typeof coreModel.setParamFloat === 'function') {
                            const idx = Number(internalModel.cheekParamIndex) ?? -1;
                            if (Number.isFinite(idx) && idx >= 0) coreModel.setParamFloat(idx, v);
                        }
                    }

                    // Mouth: apply when manual active or locked. Set multiple mouth-related params to increase coverage.
                    if (internalModel.__magirecoMouthLocked || internalModel.__magirecoMouthManualActive || internalModel.__magirecoMicActive) {
                        const v = Number(internalModel.__magirecoMouthValue) || 0;
                        if (typeof coreModel.setParameterValueById === 'function') {
                            // Only control mouth open amount here to avoid overwriting model mouth "form" (smile/frown) expressions.
                            coreModel.setParameterValueById('ParamMouthOpenY', v, 1);
                        } else if (typeof coreModel.setParamFloat === 'function') {
                            const idx = Number(internalModel.mouthOpenParamIndex) ?? -1;
                            if (Number.isFinite(idx) && idx >= 0) coreModel.setParamFloat(idx, v);
                        }
                    }
                } catch {}
            };

            // also reapply when the model completes a general update pass (cover cases where other systems write params)
            try {
                internalModel.on('afterUpdate', () => { try { applyManualOverrides(); } catch {} });
            } catch {}


            const updateBlink = (deltaMs) => {
                switch (blink.state) {
                    case 0: {
                        blink.nextBlinkInMs -= deltaMs;
                        if (blink.nextBlinkInMs <= 0) {
                            blink.state = 1;
                            blink.phaseMs = 0;
                        }
                        break;
                    }
                    case 1: {
                        blink.phaseMs += deltaMs;
                        const k = Math.min(1, blink.phaseMs / blink.closingMs);
                        blink.eyeValue = 1 - k;
                        if (k >= 1) {
                            blink.state = 2;
                            blink.phaseMs = 0;
                        }
                        break;
                    }
                    case 2: {
                        blink.phaseMs += deltaMs;
                        blink.eyeValue = 0;
                        if (blink.phaseMs >= blink.closedMs) {
                            blink.state = 3;
                            blink.phaseMs = 0;
                        }
                        break;
                    }
                    case 3: {
                        blink.phaseMs += deltaMs;
                        const k = Math.min(1, blink.phaseMs / blink.openingMs);
                        blink.eyeValue = k;
                        if (k >= 1) {
                            blink.state = 0;
                            blink.nextBlinkInMs = 6500 + Math.random() * 2500;
                            blink.phaseMs = 0;
                        }
                        break;
                    }
                }

                setEyes(blink.eyeValue);
            };

            internalModel.on('afterMotionUpdate', () => {
                const dt = Number(model?.deltaTime);
                if (Number.isFinite(dt) && dt > 0) updateBlink(dt);
                try { applyManualOverrides(); } catch {}
            });

            internalModel.__magirecoBlinkInstalled = true;
        }
    } catch {}

    const motionsObj = modelJson?.FileReferences?.Motions ?? {};
    const motionGroups = Object.keys(motionsObj);
    const preferredIdleGroup =
        motionGroups.find(g => /idle/i.test(g)) ??
        mm?.groups?.idle ??
        motionGroups[0];

    const idleGroup = motionGroups.includes(preferredIdleGroup)
        ? preferredIdleGroup
        : (motionGroups.find(g => /idle/i.test(g)) ?? motionGroups[0]);

    const idleIndex = 0;
    if (!idleGroup) return;

    const isIdleMotionDef = (motionDef, fallback) => {
        const raw = String(motionDef?.Name ?? motionDef?.File ?? fallback ?? '');
        const k = raw.split('/').pop();
        return /^motion_0\d\d\b/i.test(k) || /^motion_0\d\d\./i.test(k);
    };

    const startIdle = (priority) => {
        try {
            if (typeof mm.startMotion === 'function') return mm.startMotion(idleGroup, idleIndex, priority);
        } catch {}
        try {
            if (typeof model.motion === 'function') return model.motion(idleGroup, idleIndex, priority);
        } catch {}
        return false;
    };

    try {
        if (mm.state && typeof mm.state.shouldRequestIdleMotion === 'function') {
            mm.state.shouldRequestIdleMotion = () => false;
        }
    } catch {}

    try {
        if (mm.motionDataType === 'json' && typeof mm.createMotion === 'function' && !mm.__magirecoPatchedCreateMotion) {
            const originalCreateMotion = mm.createMotion;
            mm.createMotion = function (motionJson, group, motionDef) {
                const motion = originalCreateMotion.call(this, motionJson, group, motionDef);
                const shouldLoop = (group === idleGroup) && isIdleMotionDef(motionDef, 0);
                try {
                    motion.setIsLoop(!!shouldLoop);
                    motion.setIsLoopFadeIn(!!shouldLoop);
                } catch {}

                // For non-idle motions: avoid fading back out (helps "hold" the last pose).
                if (!shouldLoop) {
                    try {
                        if (typeof motion.setFadeOutTime === 'function') motion.setFadeOutTime(0);
                    } catch {}
                }
                return motion;
            };
            mm.__magirecoPatchedCreateMotion = true;
        }
    } catch {}

    const ok = startIdle(1);
    if (!ok) console.warn('Could not start fixed idle motion', { idleGroup, idleIndex, priority: 1 });
}
