import { afterAll, beforeAll, afterEach, test, vi } from 'vitest';
import { setupServer } from 'msw/node';
import {
  cleanup,
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { rest } from 'msw';

import { defaultHandlers } from '../testing/testing-utils';
import { DeletePetModal } from './DeletePetModal';
import { PetListItem } from '../utils/server-data-model';
import { API_URL } from '../utils/api-client';
import { mockPetKindsByValue, mockPetList } from '../testing/mock-data';
import { reportError } from '../utils/reportError';
import { WaitHandle } from '../testing/wait-handle';

vi.mock('../utils/reportError');

const server = setupServer(...defaultHandlers);

beforeAll(() => {
  server.listen();
});

afterEach(() => {
  cleanup();
  server.resetHandlers();
  vi.restoreAllMocks();
});

afterAll(() => {
  server.close();
});

const renderDeleteModal = () => {
  const pet: PetListItem = {
    petId: 42,
    petName: 'Gosho',
    kind: 1,
    addedDate: '2022-10-31',
  };

  const handleOnDeleted = vi.fn();
  const handleOnClose = vi.fn();

  render(
    <DeletePetModal
      pet={pet}
      onDeleted={handleOnDeleted}
      onClose={handleOnClose}
      petKindsByValue={mockPetKindsByValue}
    />
  );

  return {
    handleOnDeleted,
    handleOnClose,
  };
};

test('shows heading and pet data', ({ expect }) => {
  renderDeleteModal();

  expect(
    screen.getByRole('dialog', { name: 'Delete pet modal' })
  ).toBeInTheDocument();

  expect(screen.getByRole('heading')).toHaveTextContent(
    'Are you sure you want to delete this pet?'
  );

  expect(screen.getByTestId('delete-modal_petId')).toHaveTextContent(
    'PetId: 42'
  );
  expect(screen.getByTestId('delete-modal_petName')).toHaveTextContent(
    'Pet Name: Gosho'
  );
  expect(screen.getByTestId('delete-modal_petKind')).toHaveTextContent(
    'Pet Kind: Cat'
  );
});

test('onClose is called on cancel click', async ({ expect }) => {
  const user = userEvent.setup();

  const { handleOnClose } = renderDeleteModal();

  await user.click(screen.getByRole('button', { name: 'Cancel' }));

  expect(handleOnClose).toBeCalled();
});

test('delete pet endpoint is called on confirm click', async ({ expect }) => {
  const user = userEvent.setup();

  const onDeletePetEndpoint = vi.fn();

  const waitHandle = new WaitHandle();

  server.use(
    rest.delete(`${API_URL}/pet/:petId`, async (req, res, ctx) => {
      await waitHandle.wait();
      const petId = Number(req.params.petId);
      onDeletePetEndpoint(petId);
      return res(ctx.json(mockPetList.find((x) => x.petId === petId)));
    })
  );

  const { handleOnDeleted } = renderDeleteModal();

  await user.click(screen.getByRole('button', { name: 'Confirm' }));

  const loadingIndicator = await screen.findByTestId('loading-indicator');
  waitHandle.release();
  await waitForElementToBeRemoved(loadingIndicator);

  await waitFor(() => {
    expect(handleOnDeleted).toBeCalled();
  });

  await waitFor(() => {
    expect(onDeletePetEndpoint).toBeCalledWith(42);
  });
});

test('shows error when the delete call fails', async ({ expect }) => {
  const user = userEvent.setup();

  const { handleOnDeleted } = renderDeleteModal();

  const waitHandle = new WaitHandle();

  server.use(
    rest.delete(`${API_URL}/pet/:petId`, async (_req, res, ctx) => {
      await waitHandle.wait();
      return res(ctx.status(500));
    })
  );

  await user.click(screen.getByRole('button', { name: 'Confirm' }));

  const loadingIndicator = await screen.findByTestId('loading-indicator');
  waitHandle.release();
  await waitForElementToBeRemoved(loadingIndicator);

  await waitFor(() => {
    expect(screen.getByTestId('error-indicator')).toBeInTheDocument();
  });

  expect(handleOnDeleted).not.toBeCalled();

  expect(reportError).toBeCalled();
});
