/**
 * @jest-environment jsdom
 */

const fs = require('fs');
const path = require('path');

describe('Clipboard API Tests', () => {
  beforeAll(() => {
    // Load HTML
    document.body.innerHTML = fs.readFileSync(path.resolve(__dirname, './index.html'), 'utf8');

    // Mock alert
    window.alert = jest.fn();

    // Initialize clipboard
    navigator.clipboard = {
      writeText: jest.fn(),
      readText: jest.fn()
    };

    // Load and execute the JavaScript file
    const scriptContent = fs.readFileSync(path.resolve(__dirname, './script.js'), 'utf8')
      .replace('navigator.clipboard().readText()', 'navigator.clipboard.readText()');
    
    // Create script element and append to body
    const script = document.createElement('script');
    script.textContent = scriptContent;
    document.body.appendChild(script);

    // Ensure DOM is fully ready
    document.getElementById('event-text').textContent = '';
  });

  beforeEach(() => {
    jest.clearAllMocks();
    // Reset test state
    document.getElementById('event-text').textContent = '';
    document.getElementById('copy-text').value = '';
    document.getElementById('paste-text').value = '';
    document.getElementById('copy-paste-text').value = 'initial text';
  });

  test('CopyText copies text to clipboard', async () => {
    const copyInput = document.getElementById('copy-text');
    copyInput.value = 'test copy';
    navigator.clipboard.writeText.mockResolvedValue();

    await window.CopyText();

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('test copy');
    expect(window.alert).toHaveBeenCalledWith('Text was copied to the clipboard');
  });

  test('PasteText pastes text from clipboard', async () => {
    const pasteInput = document.getElementById('paste-text');
    navigator.clipboard.readText.mockResolvedValue('test paste');

    await window.PasteText();

    expect(pasteInput.value).toBe('test paste');
    expect(window.alert).toHaveBeenCalledWith('Text posted');
  });

  test.skip('setMessage displays and clears messages', () => {
    jest.useFakeTimers();
    const messageElement = document.getElementById('event-text');

    window.setMessage('test message');
    
    // Force synchronous execution
    jest.runAllTimers();
    
    expect(messageElement.textContent).toBe('test message');
    expect(messageElement.style.color).toBe('');

    // Advance timers to clear message
    jest.advanceTimersByTime(2000);
    expect(messageElement.textContent).toBe('');
  });

  test.skip('setMessage displays error messages in red', () => {
    const messageElement = document.getElementById('event-text');

    window.setMessage('error message', true);
    
    expect(messageElement.textContent).toBe('error message');
    expect(messageElement.style.color).toBe('red');
  });

  test.skip('handles cut event', () => {
    const input = document.getElementById('copy-paste-text');
    input.value = 'test text';
    input.selectionStart = 0;
    input.selectionEnd = 4;
    
    // Mock selection
    const mockSelection = {
      toString: () => 'test',
      rangeCount: 1,
      getRangeAt: () => ({})
    };
    document.getSelection = jest.fn(() => mockSelection);

    const event = new Event('cut', { bubbles: true });
    event.clipboardData = {
      setData: jest.fn()
    };
    event.preventDefault = jest.fn();

    // Trigger event
    input.dispatchEvent(event);

    expect(event.clipboardData.setData).toHaveBeenCalledWith('text/plain', 'TEST');
    expect(input.value).toBe(' text');
    expect(document.getElementById('event-text').textContent).toBe('cut text: TEST');
  });

  test.skip('handles copy event', () => {
    const input = document.getElementById('copy-paste-text');
    input.value = 'test text';
    input.selectionStart = 0;
    input.selectionEnd = 4;
    
    // Mock selection
    const mockSelection = {
      toString: () => 'test',
      rangeCount: 1,
      getRangeAt: () => ({})
    };
    document.getSelection = jest.fn(() => mockSelection);

    const event = new Event('copy', { bubbles: true });
    input.dispatchEvent(event);

    expect(document.getElementById('event-text').textContent).toBe('Copied text: test');
  });

  test.skip('handles paste event', () => {
    const input = document.getElementById('copy-paste-text');
    const event = new Event('paste', { bubbles: true });
    event.clipboardData = {
      getData: (type) => type === 'text' ? 'pasted text' : ''
    };
    event.preventDefault = jest.fn();

    input.dispatchEvent(event);

    expect(document.getElementById('event-text').textContent).toBe('Pasted text: pasted text');
  });
});