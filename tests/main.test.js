import { describe, it, expect } from 'vitest';

describe('main.js', () => {
  it('runs without crashing', async () => {
    document.body.innerHTML = '<div id="app"></div>';
    await import('@/main.js');
    expect(document.querySelector('#app')).not.toBeNull();
  });
});
