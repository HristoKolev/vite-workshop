import { cleanup, render, screen } from '@testing-library/react';
import { format } from 'date-fns';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { afterAll, afterEach, beforeAll, beforeEach, test } from 'vitest'; // Different than jest. Globals are off by default.

import { App } from './App';

const server = setupServer(
  rest.get('http://localhost:3001/', (_req, res, ctx) =>
    res(ctx.text('Hello from the server!'))
  )
);

beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' });
});

beforeEach(() => {
  server.resetHandlers();
});

afterEach(() => {
  cleanup(); // Different than jest. RTL cleanup doesn't happen by default.
});

afterAll(() => {
  server.close();
});

// Different than jest. You need to read `expect` from params.
test('App renders data', async ({ expect }) => {
  render(<App />);
  expect(screen.getByText('Hello Vite')).toBeInTheDocument();
  expect(screen.getByTestId('date-label')).toHaveTextContent(
    format(new Date(), 'dd MMM yyyy')
  );

  const serverMessage = await screen.findByTestId('server-message');

  expect(serverMessage).toHaveTextContent('Hello from the server!');
});
