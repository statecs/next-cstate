export type AmaModel = 'gpt' | 'claude';

/**
 * Asks the "Ask me anything" assistant through the site's own route, which holds the
 * worker key. Resolves with the reply stream; throws with a message fit to show the
 * visitor (for example when this week's questions are used up).
 */
export async function askAma(message: string, model: AmaModel): Promise<Response> {
  const response = await fetch('/api/ama', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, model }),
  });

  if (!response.ok || !response.body) {
    const detail = await response.json().catch(() => null);
    throw new Error(typeof detail?.error === 'string' ? detail.error : 'Failed to send message');
  }

  return response;
}

export async function textToSpeech(text: string): Promise<Blob> {
  try {
    const response = await fetch(`${process.env.API_BASE_URL}/text-to-speech`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error response:", errorText);
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    const blob = await response.blob();
    return blob;
  } catch (error) {
    console.error('Error in text-to-speech:', error);
    throw error;
  }
}
