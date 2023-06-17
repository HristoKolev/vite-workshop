import { afterEach, test, vi } from 'vitest';

import { reportError } from './reportError';

afterEach(() => {
  vi.restoreAllMocks();
});

test('logs the error to the console', ({ expect }) => {
  // eslint-disable-next-line no-console
  console.error = vi.fn();

  const error = new Error('test error');

  reportError(error);

  // eslint-disable-next-line no-console
  expect(console.error).toBeCalledWith(error);
});
