# Testing Guide

This document outlines the testing strategy and how to run tests for the BMAD-UI project.

## Testing Stack

- **Unit/Integration Tests**: Vitest + React Testing Library
- **E2E Tests**: Playwright
- **Coverage**: Vitest with v8 provider
- **CI/CD**: GitHub Actions

## Running Tests

### All Tests
```bash
# Run all tests (unit + integration + E2E)
npm run test:all
```

### Unit Tests
```bash
# Run tests in watch mode
npm test

# Run tests once
npm run test:run

# Run with UI
npm run test:ui

# Generate coverage report
npm run test:coverage
```

### E2E Tests
```bash
# Run E2E tests
npm run test:e2e

# Run E2E tests with UI
npm run test:e2e:ui

# Install Playwright browsers (first time only)
npx playwright install
```

## Test Structure

```
BMAD-UI/
├── src/
│   ├── test/
│   │   ├── setup.ts           # Test environment setup
│   │   └── test-utils.tsx     # Testing utilities and custom render
│   ├── components/
│   │   └── *.test.tsx        # Component tests
│   ├── hooks/
│   │   └── *.test.ts         # Hook tests
│   └── utils/
│       └── *.test.ts         # Utility tests
└── e2e/
    └── *.spec.ts             # E2E tests
```

## Writing Tests

### Unit Tests Example

```typescript
import { describe, it, expect } from 'vitest';
import { renderWithProviders, screen, userEvent } from '../test/test-utils';
import { MyComponent } from './MyComponent';

describe('MyComponent', () => {
  it('should render correctly', () => {
    renderWithProviders(<MyComponent />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  it('should handle user interaction', async () => {
    const user = userEvent.setup();
    renderWithProviders(<MyComponent />);

    const button = screen.getByRole('button');
    await user.click(button);

    expect(screen.getByText('Clicked')).toBeInTheDocument();
  });
});
```

### E2E Tests Example

```typescript
import { test, expect } from '@playwright/test';

test('should complete user flow', async ({ page }) => {
  await page.goto('/');

  await page.getByLabel('Input').fill('Test');
  await page.getByRole('button', { name: 'Submit' }).click();

  await expect(page.getByText('Success')).toBeVisible();
});
```

## Test Coverage

### Current Coverage
Run `npm run test:coverage` to see current coverage report.

### Coverage Goals
- **Statements**: >80%
- **Branches**: >75%
- **Functions**: >80%
- **Lines**: >80%

### Excluded from Coverage
- UI components from shadcn/ui (external library)
- Test files
- Configuration files
- Type definition files

## Security Testing

### Automated Security Tests
Our test suite includes security-specific tests:

1. **XSS Protection Tests**
   - `src/utils/codeSanitizer.test.ts`
   - Validates DOMPurify sanitization
   - Tests malicious input handling

2. **File Upload Validation Tests**
   - `src/components/builder/VisualBuilder.test.tsx`
   - Tests magic bytes validation
   - Tests file size and type limits

3. **Rate Limiting Tests**
   - Tests rate limit enforcement
   - Tests block duration
   - Tests reset functionality

### Manual Security Testing
```bash
# Run security-focused tests only
npm test -- --grep "security"

# Run XSS tests
npm test -- codeSanitizer.test.ts
```

## CI/CD Testing

### GitHub Actions
Every push and PR triggers:
- Linting
- Type checking
- Unit tests
- E2E tests
- Security scans (npm audit, Trivy, CodeQL, Semgrep)
- Coverage reporting

### Required Checks
All the following must pass before merging:
- ✅ ESLint (no errors)
- ✅ TypeScript compilation
- ✅ Unit tests
- ✅ E2E tests
- ✅ Security scans (no critical/high vulnerabilities)

## Test Best Practices

### Do's
✅ Write tests for all new features
✅ Test error states and edge cases
✅ Use descriptive test names
✅ Keep tests isolated and independent
✅ Mock external dependencies
✅ Test accessibility

### Don'ts
❌ Don't test implementation details
❌ Don't write brittle tests
❌ Don't skip error handling tests
❌ Don't commit commented-out tests
❌ Don't ignore failing tests

## Debugging Tests

### Vitest
```bash
# Run specific test file
npm test -- MyComponent.test.tsx

# Run tests matching pattern
npm test -- --grep "should handle"

# Debug mode
npm test -- --inspect-brk
```

### Playwright
```bash
# Run with headed browser
npm run test:e2e -- --headed

# Run specific test
npm run test:e2e -- chat.spec.ts

# Debug mode
npm run test:e2e -- --debug
```

## Continuous Monitoring

### Local Development
```bash
# Watch mode for instant feedback
npm test
```

### Pre-commit
Consider adding a pre-commit hook:
```bash
# .husky/pre-commit
npm run test:run
npm run lint
```

## Performance Testing

### Test Performance
Monitor test execution time:
```bash
npm test -- --reporter=verbose
```

### App Performance
Use Playwright's performance APIs:
```typescript
test('should load quickly', async ({ page }) => {
  const start = Date.now();
  await page.goto('/');
  const loadTime = Date.now() - start;
  expect(loadTime).toBeLessThan(3000); // 3 seconds
});
```

## Accessibility Testing

### Automated a11y Tests
```typescript
import { axe } from 'jest-axe';

it('should have no accessibility violations', async () => {
  const { container } = renderWithProviders(<MyComponent />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

### Manual Testing
- Test with keyboard navigation
- Test with screen readers
- Verify ARIA labels
- Check color contrast

## Troubleshooting

### Common Issues

**Tests failing due to async issues**
```typescript
// Use waitFor for async assertions
await waitFor(() => {
  expect(screen.getByText('Loaded')).toBeInTheDocument();
});
```

**Mock not working**
```typescript
// Clear mocks between tests
beforeEach(() => {
  vi.clearAllMocks();
});
```

**E2E tests timing out**
```typescript
// Increase timeout
test('long test', async ({ page }) => {
  test.setTimeout(60000); // 60 seconds
  // ... test code
});
```

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Playwright Documentation](https://playwright.dev/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

---

**Last Updated**: November 2025
