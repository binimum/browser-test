/// <reference types="vite/client" />

declare global {
    interface Window {
        webkitAudioContext?: typeof AudioContext;
        webkitRTCPeerConnection?: typeof RTCPeerConnection;
        mozRTCPeerConnection?: typeof RTCPeerConnection;
    }
}

export {};
