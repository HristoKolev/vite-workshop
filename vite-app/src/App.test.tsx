import { beforeEach, afterAll, beforeAll, test } from 'vitest';
import { render, screen } from '@testing-library/react';
import { setupServer } from 'msw/node';
import { rest } from 'msw';

import { App } from './App';

const server = setupServer(
  rest.get('http://localhost:3001/', (_req, res, ctx) =>
    res(ctx.text('Hello from the server!'))
  )
);

beforeAll(() => {
  server.listen();
});

beforeEach(() => {
  server.resetHandlers();
});

afterAll(() => {
  server.close();
});

test('App renders data', async ({ expect }) => {
  render(<App />);
  expect(screen.getByText('Hello Vite')).toBeInTheDocument();
  expect(screen.getByTestId('date-label')).toHaveTextContent('09 May 2023');

  const serverMessage = await screen.findByTestId('server-message');

  expect(serverMessage).toHaveTextContent('Hello from the server!');
});
