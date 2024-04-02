export async function sendMessageToThread(threadId: string, message: string, file_ids: string[], assistantId: string)  {
  
    if (!threadId || !assistantId) {
      throw new Error('threadId and assistantId must be provided');
    }

    const controller = new AbortController(); // For potential request cancellation
    const signal = controller.signal;

    try {
      const response = await fetch(`${process.env.API_BASE_URL}/threads/${threadId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message, assistantId, file_ids }),
        signal: signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error sending message to thread:', error);
      // Consider handling or displaying the error based on your UX strategy.
    }
    
}