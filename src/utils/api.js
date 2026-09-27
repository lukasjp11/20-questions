import { getTurnstileToken } from './turnstile';

const API_URL = import.meta.env.VITE_API_URL;

function parseEvent(line) {
  if (!line.startsWith('data: ')) return null;
  const data = line.slice(6);
  if (data === '[DONE]') return { type: 'done' };
  try {
    return JSON.parse(data);
  } catch {
    return null;
  }
}

export const generateCluesWithProgress = async (requestBody, { onItemFound = () => {} } = {}, signal) => {
  const token = await getTurnstileToken();
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['X-Turnstile-Token'] = token;

  const response = await fetch(`${API_URL}/api/generate-stream`, {
    method: 'POST',
    headers,
    body: JSON.stringify(requestBody),
    signal,
  });

  if (!response.ok) {
    let message = `Serverfejl (${response.status})`;
    try {
      const body = await response.json();
      if (body?.error?.message) message = body.error.message;
    } catch {
      /* non-JSON error body */
    }
    throw new Error(message);
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
      const event = parseEvent(line);
      if (!event) continue;
      if (event.type === 'item_found') onItemFound(event.item);
      else if (event.type === 'complete') return event.result;
      else if (event.type === 'error') throw new Error(event.error);
      else if (event.type === 'done') return undefined;
    }
  }

  return undefined;
};
