export async function sendMessageToThread(threadId: string, message: string, file_ids: string[], assistantId: string, role: string)  {
  
  if (!threadId || !assistantId) {
    throw new Error('threadId and assistantId must be provided');
  }

  const controller = new AbortController(); // For potential request cancellation
  const signal = controller.signal;

  try {
    const response = await fetch(`${process.env.API_BASE_URL}/threads/${threadId}/messages-only`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        message, 
        assistantId, 
        file_ids, 
        role
      }),
      signal: signal,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

  } catch (error) {
    console.error('Error sending assistant message to thread:', error);
  }
}

// Function to send a message and open an SSE connection
export async function sendMessageToThreadStream(threadId: string, message: string, file_ids: string[], assistantId: string) {
  if (!threadId || !assistantId) {
      throw new Error('threadId and assistantId must be provided');
  }

  const controller = new AbortController();
  const signal = controller.signal;

  try {
      const response = await fetch(`${process.env.API_BASE_URL}/threads/${threadId}/messagesStream`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message, assistantId, file_ids }),
          signal: signal
      });

      if (response.status === 200) {
          const url = `${process.env.API_BASE_URL}/threads/${threadId}/messagesStream`;
          const eventSource = new EventSource(url);

          eventSource.onerror = () => {
              eventSource.close();
          };

          return eventSource; // Return the eventSource for further control outside this function
      } else {
          throw new Error(`Failed to send message: ${response.status}`);
      }
  } catch (error) {
      console.error('Error sending message to thread:', error);
      throw error; // Re-throw to handle in component
  }
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