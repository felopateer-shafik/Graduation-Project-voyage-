import { describe, expect, it, vi } from 'vitest';
import axiosInstance from './axiosInstance';
import { aiAPI } from './ai';

vi.mock('./axiosInstance', () => ({
  default: {
    post: vi.fn(() => Promise.resolve({ data: {} })),
  },
}));

describe('aiAPI', () => {
  it('sends custom trip planner instructions to the backend', async () => {
    await aiAPI.tripPlan('Cairo', 4, ['culture'], 'Avoid crowded places');

    expect(axiosInstance.post).toHaveBeenCalledWith('/ai/trip-plan', {
      destination: 'Cairo',
      days: 4,
      interests: ['culture'],
      customInstructions: 'Avoid crowded places',
    });
  });
});
