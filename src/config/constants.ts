/**
 * Application Constants
 * Central configuration for all hardcoded values
 */

export const API_CONFIG = {
  LLM_PROVIDER: 'claude-code',
  DEFAULT_MODEL: 'claude-3-sonnet-20240229',
  BASE_URL: 'https://api.anthropic.com/v1',
  BMAD_VERSION: '4.30.1',
  DEFAULT_TEAM: 'full-stack',
} as const;

export const VALIDATION = {
  MAX_MESSAGE_LENGTH: 5000,
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'],
  RATE_LIMIT_DELAY: 1000, // 1 second between requests
} as const;

export const UI_CONFIG = {
  TYPING_SIMULATION_MIN: 1000,
  TYPING_SIMULATION_MAX: 2000,
  BLOB_URL_CLEANUP_DELAY: 5000, // 5 seconds - enough time for browser to load
  PREVIEW_LOAD_DELAY: 1000,
  ANIMATION_DURATION: 300,
} as const;

export const DEVICE_DIMENSIONS = {
  desktop: { width: '100%', height: '100%' },
  tablet: { width: '768px', height: '1024px' },
  mobile: { width: '375px', height: '667px' },
} as const;

export const EXTERNAL_SCRIPTS = {
  REACT: {
    url: 'https://unpkg.com/react@18.2.0/umd/react.production.min.js',
    integrity: 'sha384-/y1Nn9GQWs3AAAAjHwD1yF5aPrHY/Q5qA3MZG7xBmBPUZ8Jq3QVDZBaKOZJpM3nh',
  },
  REACT_DOM: {
    url: 'https://unpkg.com/react-dom@18.2.0/umd/react-dom.production.min.js',
    integrity: 'sha384-fG2LIHlZEHLEZuV4l0qCHSH2Lg2MmT0uPJQsxBN0xd/OQA2gZLFJYh+qMB6+FHKz',
  },
  BABEL: {
    url: 'https://unpkg.com/@babel/standalone@7.23.5/babel.min.js',
    integrity: 'sha384-JFzA8tBUMYS0S8l8y0XL8fOlT5x4xQP1LBvGxJg1aXKqCLZJ8xP8qT4ZQKL1R+fG',
  },
  TAILWIND: {
    url: 'https://cdn.tailwindcss.com/3.3.5',
    integrity: 'sha384-RoA+nDhJqBqBuV8D2LqCKqcDLkW8DK8pFJLqK8vTqG4Ep+GqDKYJ6P+HQYC/rFvG',
  },
} as const;

export const ERROR_MESSAGES = {
  MESSAGE_TOO_LONG: 'Message is too long. Maximum 5000 characters allowed.',
  FILE_TOO_LARGE: 'File size must be less than 5MB.',
  INVALID_FILE_TYPE: 'Please upload a valid image file.',
  INVALID_IMAGE_CONTENT: 'The file does not appear to be a valid image.',
  FILE_READ_ERROR: 'Failed to read file. Please try again.',
  UPLOAD_RATE_LIMIT: 'Please wait before uploading another file.',
  MESSAGE_RATE_LIMIT: 'Please wait before sending another message.',
  GENERATION_ERROR: 'Failed to generate HTML samples. Please try again.',
} as const;

export const SUCCESS_MESSAGES = {
  MESSAGE_SENT: 'Message sent successfully',
  FILE_UPLOADED: 'File uploaded successfully',
  CODE_GENERATED: 'Code generated successfully',
  CODE_COPIED: 'Code copied to clipboard',
} as const;
