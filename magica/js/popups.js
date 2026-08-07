// js/popups.js — EtcPopup-only popup module (PopupClass equivalent)
//
// Minimal popup shell for the "Other" menu on #/MyPage:
//   - lazily creates #popupArea + #popupCurtain on <body> (position: fixed,
//     z-index 1000000; CSS in mypage.css). Mounted outside the transformed
//     #ui-layer so fixed positioning stays viewport-relative.
//   - mounts magica/template/etc/EtcPopup.html into a .popupContent.open.etcPop
//     wrapper; curtain .show + popup_open/popup_close animations come from the
//     ported CSS
//   - close: .popupCloseBtn, backdrop (#popupCurtain) click, Escape, route change
//   - collectionBtn routes to #/CharaCollection (same target as the Unit
//     button); the other five buttons are press-feedback-only no-ops
//   - press feedback: .touch on the six buttons (.b_screen overlay per CSS)

const ETC_TEMPLATE = 'magica/template/etc/EtcPopup.html';
const CLOSE_ANIM_MS = 200;

let popupArea = null;
let popupContent = null;
let templateCache = null;
let open = false;
let pending = false;
let bound = false;

function ensurePopupArea() {
    if (popupArea) return popupArea;
    popupArea = document.createElement('div');
    popupArea.id = 'popupArea';
    const curtain = document.createElement('div');
    curtain.id = 'popupCurtain';
    popupArea.appendChild(curtain);
    document.body.appendChild(popupArea);
    return popupArea;
}

async function loadEtcTemplate() {
    if (templateCache) return templateCache;
    const resp = await fetch(ETC_TEMPLATE);
    if (!resp.ok) throw new Error(`Failed to fetch ${ETC_TEMPLATE}: ${resp.status}`);
    templateCache = await resp.text();
    return templateCache;
}

export async function openEtcPopup() {
    if (open || pending) return;
    pending = true;
    try {
        const html = await loadEtcTemplate();
        const area = ensurePopupArea();

        popupContent = document.createElement('div');
        popupContent.className = 'popupContent open etcPop';
        popupContent.innerHTML = html;
        area.appendChild(popupContent);

        // The EtcPopup mounts outside the scaled #ui-layer (fixed positioning
        // must stay viewport-relative), so match the UI scale by hand: shrink
        // the popup box to the viewer's current camera scale. It is centered
        // via calc(50% ...), so scaling about its center keeps it centered at
        // any window size.
        const inner = popupContent.querySelector('.etcPopInner');
        const s = Math.min(1, window.cameraContainer?.scale?.x ?? 1);
        if (inner && s < 1) {
            inner.style.transformOrigin = 'center center';
            inner.style.transform = `scale(${s})`;
        }

        const curtain = area.querySelector('#popupCurtain');
        if (curtain) curtain.classList.add('show');
        open = true;
        bindEvents();
    } catch (err) {
        console.error('[popups] EtcPopup open failed:', err);
    } finally {
        pending = false;
    }
}

export function closeEtcPopup() {
    if (!open) return;
    open = false;

    const curtain = popupArea ? popupArea.querySelector('#popupCurtain') : null;
    if (curtain) curtain.classList.remove('show');

    if (popupContent) {
        const content = popupContent;
        content.classList.remove('open');
        content.classList.add('close');
        popupContent = null;
        setTimeout(() => {
            content.remove();
        }, CLOSE_ANIM_MS);
    }
}

function onPointerDown(e) {
    const btn = e.target.closest('#popupArea .etcPopWrap .se_decide');
    if (!btn) return;
    btn.classList.add('touch');
}

function onPointerUp() {
    if (!popupArea) return;
    popupArea.querySelectorAll('.etcPopWrap .touch').forEach(el => el.classList.remove('touch'));
}

function onKeyDown(e) {
    if (e.key !== 'Escape' || !open) return;
    e.preventDefault();
    closeEtcPopup();
}

function onPopupClick(e) {
    if (!open) return;

    if (e.target.closest('.popupCloseBtn')) {
        e.preventDefault();
        e.stopPropagation();
        closeEtcPopup();
        return;
    }

    if (e.target.closest('.etcPopWrap .collectionBtn')) {
        e.preventDefault();
        e.stopPropagation();
        closeEtcPopup();
        window.location.hash = '#/CharaCollection';
        return;
    }

    if (e.target.closest('.etcPopWrap .se_decide')) {
        e.preventDefault();
        e.stopPropagation();
    }
}

function onBackdropClick(e) {
    if (!open) return;
    if (e.target.closest('.etcPop .etcPopInner')) return;
    if (e.target.closest('#popupArea')) closeEtcPopup();
}

function onHashChange() {
    closeEtcPopup();
}

function bindEvents() {
    if (bound) return;
    bound = true;
    document.addEventListener('pointerdown', onPointerDown, true);
    document.addEventListener('pointerup', onPointerUp, true);
    document.addEventListener('pointercancel', onPointerUp, true);
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('click', onPopupClick);
    document.addEventListener('click', onBackdropClick);
    window.addEventListener('hashchange', onHashChange);
}
