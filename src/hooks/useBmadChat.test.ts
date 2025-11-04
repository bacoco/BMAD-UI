import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useBmadChat } from './useBmadChat';
import { agents } from '../data/agents';

// Mock the agent response service
vi.mock('../services/agentResponseService', () => ({
  generateAgentResponse: vi.fn((content) => `Response to: ${content}`),
}));

describe('useBmadChat', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with default agent', () => {
    const { result } = renderHook(() => useBmadChat());

    expect(result.current.chatState.activeAgent).toEqual(agents[0]);
    expect(result.current.chatState.messages).toEqual([]);
    expect(result.current.chatState.isTyping).toBe(false);
  });

  it('should initialize with provided agent', () => {
    const testAgent = agents[1];
    const { result } = renderHook(() => useBmadChat(testAgent));

    expect(result.current.chatState.activeAgent).toEqual(testAgent);
  });

  it('should send message and add to chat', async () => {
    const { result } = renderHook(() => useBmadChat());

    act(() => {
      result.current.sendMessage('Hello');
    });

    // Check user message was added
    expect(result.current.chatState.messages).toHaveLength(1);
    expect(result.current.chatState.messages[0].content).toBe('Hello');
    expect(result.current.chatState.messages[0].agentId).toBe('user');
    expect(result.current.chatState.isTyping).toBe(true);

    // Wait for agent response
    await waitFor(
      () => {
        expect(result.current.chatState.messages).toHaveLength(2);
      },
      { timeout: 5000 }
    );

    // Check agent response
    expect(result.current.chatState.messages[1].agentId).toBe(agents[0].id);
    expect(result.current.chatState.isTyping).toBe(false);
  });

  it('should handle command messages', async () => {
    const { result } = renderHook(() => useBmadChat());

    act(() => {
      result.current.sendMessage('*help');
    });

    await waitFor(
      () => {
        expect(result.current.chatState.messages).toHaveLength(2);
      },
      { timeout: 5000 }
    );

    expect(result.current.chatState.messages[0].type).toBe('text');
    expect(result.current.chatState.messages[1].type).toBe('command');
  });

  it('should change active agent', () => {
    const { result } = renderHook(() => useBmadChat());
    const newAgent = agents[2];

    act(() => {
      result.current.changeAgent(newAgent);
    });

    expect(result.current.chatState.activeAgent).toEqual(newAgent);
  });

  it('should clear chat messages', () => {
    const { result } = renderHook(() => useBmadChat());

    act(() => {
      result.current.sendMessage('Test message');
    });

    expect(result.current.chatState.messages).toHaveLength(1);

    act(() => {
      result.current.clearChat();
    });

    expect(result.current.chatState.messages).toEqual([]);
  });

  it('should handle empty message gracefully', () => {
    const { result } = renderHook(() => useBmadChat());

    act(() => {
      result.current.sendMessage('');
    });

    expect(result.current.chatState.messages).toHaveLength(0);

    act(() => {
      result.current.sendMessage('   ');
    });

    expect(result.current.chatState.messages).toHaveLength(0);
  });

  it('should generate unique message IDs', async () => {
    const { result } = renderHook(() => useBmadChat());

    act(() => {
      result.current.sendMessage('Message 1');
    });

    await waitFor(() => {
      expect(result.current.chatState.messages).toHaveLength(2);
    });

    const messageIds = result.current.chatState.messages.map((m) => m.id);
    const uniqueIds = new Set(messageIds);

    expect(uniqueIds.size).toBe(messageIds.length);
  });
});
