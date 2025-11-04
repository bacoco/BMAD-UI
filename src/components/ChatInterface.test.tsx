import { describe, it, expect, vi } from 'vitest';
import { renderWithProviders, screen, userEvent, waitFor } from '../test/test-utils';
import { ChatInterface } from './ChatInterface';
import { agents } from '../data/agents';
import { ChatState } from '../types/bmad';

// Mock toast
vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}));

describe('ChatInterface', () => {
  const mockChatState: ChatState = {
    activeAgent: agents[0],
    messages: [],
    isTyping: false,
    context: {
      recentDocuments: [],
    },
  };

  const defaultProps = {
    chatState: mockChatState,
    availableAgents: agents,
    onSendMessage: vi.fn(),
    onAgentChange: vi.fn(),
  };

  it('should render chat interface', () => {
    renderWithProviders(<ChatInterface {...defaultProps} />);

    expect(screen.getByLabelText(/message input/i)).toBeInTheDocument();
    expect(screen.getByText(/active agent/i)).toBeInTheDocument();
  });

  it('should display current active agent name', () => {
    renderWithProviders(<ChatInterface {...defaultProps} />);

    expect(screen.getByText(agents[0].name)).toBeInTheDocument();
  });

  it('should allow typing in input field', async () => {
    const user = userEvent.setup();
    renderWithProviders(<ChatInterface {...defaultProps} />);

    const input = screen.getByLabelText(/message input/i) as HTMLInputElement;
    await user.type(input, 'Hello');

    expect(input.value).toBe('Hello');
  });

  it('should call onSendMessage when form is submitted', async () => {
    const user = userEvent.setup();
    const onSendMessage = vi.fn();

    renderWithProviders(
      <ChatInterface {...defaultProps} onSendMessage={onSendMessage} />
    );

    const input = screen.getByLabelText(/message input/i);
    await user.type(input, 'Test message');

    const sendButton = screen.getByLabelText(/send message/i);
    await user.click(sendButton);

    expect(onSendMessage).toHaveBeenCalledWith('Test message', 'text');
  });

  it('should handle command messages starting with *', async () => {
    const user = userEvent.setup();
    const onSendMessage = vi.fn();

    renderWithProviders(
      <ChatInterface {...defaultProps} onSendMessage={onSendMessage} />
    );

    const input = screen.getByLabelText(/message input/i);
    await user.type(input, '*help');

    const sendButton = screen.getByLabelText(/send message/i);
    await user.click(sendButton);

    expect(onSendMessage).toHaveBeenCalledWith('*help', 'command');
  });

  it('should clear input after sending message', async () => {
    const user = userEvent.setup();
    renderWithProviders(<ChatInterface {...defaultProps} />);

    const input = screen.getByLabelText(/message input/i) as HTMLInputElement;
    await user.type(input, 'Test message');

    const sendButton = screen.getByLabelText(/send message/i);
    await user.click(sendButton);

    expect(input.value).toBe('');
  });

  it('should disable send when input is empty', () => {
    renderWithProviders(<ChatInterface {...defaultProps} />);

    const sendButton = screen.getByLabelText(/send message/i);
    expect(sendButton).toBeDisabled();
  });

  it('should disable input when agent is typing', () => {
    const typingChatState = { ...mockChatState, isTyping: true };

    renderWithProviders(
      <ChatInterface {...defaultProps} chatState={typingChatState} />
    );

    const input = screen.getByLabelText(/message input/i);
    expect(input).toBeDisabled();
  });

  it('should show typing indicator when agent is typing', () => {
    const typingChatState = { ...mockChatState, isTyping: true };

    renderWithProviders(
      <ChatInterface {...defaultProps} chatState={typingChatState} />
    );

    // Check for typing badge which contains "typing..." text
    const typingBadge = screen.getByText((content, element) => {
      return element?.textContent === 'typing...' || content.includes('typing');
    });
    expect(typingBadge).toBeInTheDocument();
  });

  it('should display welcome message when no messages', () => {
    renderWithProviders(<ChatInterface {...defaultProps} />);

    expect(screen.getByText(/welcome to bmad ui builder/i)).toBeInTheDocument();
  });

  it('should show command mode indicator for command input', async () => {
    const user = userEvent.setup();
    renderWithProviders(<ChatInterface {...defaultProps} />);

    const input = screen.getByLabelText(/message input/i);
    await user.type(input, '*help');

    expect(screen.getByText('CMD')).toBeInTheDocument();
  });

  it('should allow switching agents', async () => {
    const user = userEvent.setup();
    const onAgentChange = vi.fn();

    renderWithProviders(
      <ChatInterface {...defaultProps} onAgentChange={onAgentChange} />
    );

    const switchButton = screen.getByLabelText(/switch to different agent/i);
    await user.click(switchButton);

    // Agent selector should be visible
    await waitFor(() => {
      expect(screen.getByText(agents[1].name)).toBeInTheDocument();
    });
  });

  it('should respect max length constraint', async () => {
    const user = userEvent.setup();
    renderWithProviders(<ChatInterface {...defaultProps} />);

    const input = screen.getByLabelText(/message input/i) as HTMLInputElement;

    expect(input).toHaveAttribute('maxLength', '5000');
  });
});
