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
            });

            internalModel.__magirecoBlinkInstalled = true;
        }
    } catch {}

    const motionsObj = modelJson?.FileReferences?.Motions ?? {};
    const allEntries = [];
    for (const [group, arr] of Object.entries(motionsObj)) {
        if (!Array.isArray(arr)) continue;
        for (let i = 0; i < arr.length; i++) allEntries.push({ group, index: i, def: arr[i] ?? {} });
    }

    const getMotionKey = (def, fallback) => {
        const raw = String(def?.Name ?? def?.File ?? fallback ?? '');
        return raw.split('/').pop();
    };
    const isMotion0xxKey = (k) => /^motion_0\d\d\b/i.test(k) || /^motion_0\d\d\./i.test(k);
    const isMotion000Key = (k) => /^motion_000\b/i.test(k) || /^motion_000\./i.test(k);
    const isMotion0xx = (def, fallback) => isMotion0xxKey(getMotionKey(def, fallback));
    const isMotion000 = (def, fallback) => isMotion000Key(getMotionKey(def, fallback));

    const idleEntry =
        allEntries.find(e => isMotion000(e.def, e.index)) ??
        allEntries.find(e => isMotion0xx(e.def, e.index)) ??
        allEntries[0];

    if (!idleEntry) return;
    const idleGroup = idleEntry.group;
    const idleIndex = idleEntry.index;

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
                if (isMotion0xx(motionDef, 0)) {
                    try {
                        motion.setIsLoop(true);
                        motion.setIsLoopFadeIn(true);
                    } catch {}
                } else {
                    try { motion.setIsLoop(false); } catch {}
                }
                return motion;
            };
            mm.__magirecoPatchedCreateMotion = true;
        }
    } catch {}

    const ok = startIdle(1);
    if (!ok) console.warn('Could not start fixed idle motion', { idleGroup, idleIndex, priority: 1 });
}
