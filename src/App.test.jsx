import { act, render } from '@testing-library/react';
import App from './App';

describe('App', () => {
  it('marks the page as scrolled so the status bar strip can cover the blur band', () => {
    render(<App />);
    const root = document.documentElement;
    expect(root.classList.contains('scrolled')).toBe(false);
    act(() => {
      window.scrollY = 120;
      window.dispatchEvent(new Event('scroll'));
    });
    expect(root.classList.contains('scrolled')).toBe(true);
    act(() => {
      window.scrollY = 0;
      window.dispatchEvent(new Event('scroll'));
    });
    expect(root.classList.contains('scrolled')).toBe(false);
  });
});
