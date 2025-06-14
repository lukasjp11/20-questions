const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

export const generateCluesWithProgress = async (prompt, callbacks = {}) => {
  const {
    onItemFound = () => {},
    onComplete = () => {},
    onError = () => {}
  } = callbacks;

  try {
    const response = await fetch(`${API_URL}/api/generate-stream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        max_tokens: 1000,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      
      if (done) break;
      
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      
      // Keep the last incomplete line in the buffer
      buffer = lines.pop() || '';
      
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          
          if (data === '[DONE]') {
            return;
          }
          
          try {
            const event = JSON.parse(data);
            
            switch (event.type) {
              case 'item_found':
                // Call this as soon as we have the item
                onItemFound(event.item);
                break;
                
              case 'complete':
                // Call this when everything is done
                onComplete(event.result);
                return event.result;
                
              case 'error':
                throw new Error(event.error);
            }
          } catch (e) {
            // Ignore JSON parse errors for incomplete data
            if (e.message.includes('JSON')) continue;
            throw e;
          }
        }
      }
    }
  } catch (error) {
    onError(error);
    throw error;
  }
};