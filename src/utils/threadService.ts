export async function sendMessageToResponseStream(message: string, previousResponseId: string | null): Promise<Response> {
  const response = await fetch(`${process.env.API_BASE_URL}/responses/stream`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message,
      previousResponseId,
      instructionText: process.env.INSTRUCTION_TEXT,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to start response stream: ${response.status}`);
  }

  return response;
}

export async function sendMessageToClaudeAPI(message: string): Promise<string> {
  try {
    const response = await fetch(`${process.env.API_BASE_URL}/claude`, {
      method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              input: message,
              instructionText: process.env.INSTRUCTION_TEXT
            }),
    });

    if (!response.ok) {
      throw new Error(`Failed to send message to Claude: ${response.status}`);
    }

    const data = await response.text();
    return data;
  } catch (error) {
    console.error('Error sending message to Claude:', error);
    throw error;
  }
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
