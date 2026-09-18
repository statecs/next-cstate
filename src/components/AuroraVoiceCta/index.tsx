'use client';

import React from 'react';
import { Mic } from 'lucide-react';
import VoiceOverlay from '@/components/VoiceInput/VoiceOverlay';
import { useVoiceSession } from '@/components/VoiceInput/useVoiceSession';

/**
 * The mic segment of the hero's joined pill. It starts the session right
 * here, on the click — going through /voice first would lose the tap that
 * browsers require before audio can start.
 */
const AuroraVoiceCta: React.FC = () => {
    const session = useVoiceSession({
        onAssistantResponse: text => {
            try { localStorage.setItem('chatResponse', text); } catch { /* private mode */ }
        },
    });

    return (
        <>
            <button
                type="button"
                className="aurora-btn aurora-btn-seg aurora-btn-voice"
                onClick={session.start}
                aria-label="Talk to me — start a voice conversation"
                title="Talk to me"
            >
                <Mic aria-hidden="true" />
            </button>
            {session.mode !== 'idle' && (
                <VoiceOverlay
                    mode={session.mode}
                    error={session.error}
                    userText={session.userText}
                    assistantText={session.assistantText}
                    getMicLevel={session.getMicLevel}
                    getOutputLevel={session.getOutputLevel}
                    onTogglePause={session.togglePause}
                    onInterrupt={session.interrupt}
                    onEnd={session.stop}
                />
            )}
        </>
    );
};

export default AuroraVoiceCta;
