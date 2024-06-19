import { afterEach, expect, test, vi } from 'vitest';

import { reportUnknownError } from './reportUnknownError';

afterEach(() => {
  vi.restoreAllMocks();
});

test('logs the error to the console', () => {
  const errorMock = vi.spyOn(console, 'error');
  errorMock.mockImplementation(() => undefined);
  const error = new Error('test error');
  reportUnknownError(error);
  expect(errorMock).toBeCalledWith(error);
});
