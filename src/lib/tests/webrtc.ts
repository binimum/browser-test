import type { TestResult } from './types';

const runWebRtcTest = (): TestResult => {
    const PeerConnectionRef = window.RTCPeerConnection ?? window.webkitRTCPeerConnection ?? window.mozRTCPeerConnection;

    if (PeerConnectionRef) {
        return {
            code: 0,
            message: 'WebRTC RTCPeerConnection is supported.',
        };
    }

    return {
        code: 2,
        message: 'WebRTC RTCPeerConnection is not supported.',
    };
};

export default runWebRtcTest;
