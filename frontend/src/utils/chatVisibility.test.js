import { describe, expect, it } from 'vitest';
import { shouldShowChatWidget } from './chatVisibility';

describe('shouldShowChatWidget', () => {
  it('hides the chatbot on auth and OTP routes', () => {
    expect(shouldShowChatWidget('/login')).toBe(false);
    expect(shouldShowChatWidget('/register')).toBe(false);
    expect(shouldShowChatWidget('/verify-otp')).toBe(false);
  });

  it('shows the chatbot on normal app routes', () => {
    expect(shouldShowChatWidget('/')).toBe(true);
    expect(shouldShowChatWidget('/support')).toBe(true);
    expect(shouldShowChatWidget('/flights/1')).toBe(true);
  });
});
