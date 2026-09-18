'use client';

import { useRouter } from 'next/navigation';
import VoiceOverlay from '@/components/VoiceInput/VoiceOverlay';
import { useVoiceSession } from '@/components/VoiceInput/useVoiceSession';

/**
 * The voice session as a destination. Browsers only let audio start from a
 * tap, so the page opens on the idle orb with a start button rather than
 * trying to connect on load; ending a session returns to that state, and
 * closing from there leaves for the home page.
 */
const VoicePage = () => {
  const router = useRouter();
  const session = useVoiceSession({
    // Keep the last answer where the chat on /home shows it.
    onAssistantResponse: text => {
      try { localStorage.setItem('chatResponse', text); } catch { /* private mode */ }
    },
  });

  return (
    <VoiceOverlay
      mode={session.mode}
      error={session.error}
      userText={session.userText}
      assistantText={session.assistantText}
      getMicLevel={session.getMicLevel}
      getOutputLevel={session.getOutputLevel}
      onStart={session.start}
      onTogglePause={session.togglePause}
      onInterrupt={session.interrupt}
      onEnd={session.mode === 'idle' ? () => router.push('/home') : session.stop}
    />
  );
};

export default VoicePage;
