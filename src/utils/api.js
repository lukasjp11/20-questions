const API_URL = process.env.REACT_APP_API_URL;

export const generateCluesWithProgress = async (requestBody, callbacks = {}, signal) => {
  const {
    onItemFound = () => {},
    onComplete = () => {},
    onError = () => {}
  } = callbacks;

  try {
    const headers = { 'Content-Type': 'application/json' };
    if (process.env.REACT_APP_API_KEY) {
      headers['x-api-key'] = process.env.REACT_APP_API_KEY;
    }

    const response = await fetch(`${API_URL}/api/generate-stream`, {
      method: 'POST',
      headers,
      body: JSON.stringify(requestBody),
      signal
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
                onItemFound(event.item);
                break;
                
              case 'complete':
                onComplete(event.result);
                return event.result;
                
              case 'error':
                throw new Error(event.error);

              default:
                break;
            }
          } catch (e) {
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
