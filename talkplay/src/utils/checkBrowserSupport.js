/* ============================================
    TALKPLAY - BROWSER SUPPORT CHECK
    Utility to verify availability of speechSynthesis and mediaDevices
   ============================================ */

/**
 * Returns true when Web Speech API SpeechSynthesis is available.
 * Handles server-side environments where `window` is undefined.
 * @returns {boolean}
 */
export function isSpeechSynthesisSupported() {
    if (typeof window === 'undefined') return false;
    return typeof window.speechSynthesis !== 'undefined' && window.speechSynthesis !== null;
}

/**
 * Returns true when navigator.mediaDevices and getUserMedia are available.
 * Handles server-side environments where `navigator` is undefined.
 * @returns {boolean}
 */
export function isMediaDevicesSupported() {
    if (typeof navigator === 'undefined') return false;
    return typeof navigator.mediaDevices !== 'undefined' && navigator.mediaDevices !== null && typeof navigator.mediaDevices.getUserMedia === 'function';
}

/**
 * Returns an object describing support for required browser features.
 * @returns {{speechSynthesis: boolean, mediaDevices: boolean, allSupported: boolean}}
 */
export default function checkBrowserSupport() {
    const speechSynthesis = isSpeechSynthesisSupported();
    const mediaDevices = isMediaDevicesSupported();

    return {
        speechSynthesis,
        mediaDevices,
        allSupported: speechSynthesis && mediaDevices
    };
}
