import { afterEach, expect, test, vi } from 'vitest';

import { reportError } from './reportError';

afterEach(() => {
  vi.restoreAllMocks();
});

test('logs the error to the console', () => {
  const errorMock = vi.spyOn(console, 'error');
  errorMock.mockImplementation(() => undefined);
  const error = new Error('test error');
  reportError(error);
  expect(errorMock).toBeCalledWith(error);
});
