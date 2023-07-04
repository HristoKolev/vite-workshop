import {
  act,
  cleanup,
  screen,
  waitFor,
  waitForElementToBeRemoved,
  within,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import {
  type ExpectStatic,
  afterAll,
  afterEach,
  beforeAll,
  describe,
  test,
  vi,
} from 'vitest';

import { createReduxStore } from '~redux/createReduxStore';
import { fetchPetsData } from '~redux/globalSlice';
import {
  defaultHandlers,
  defaultWaitHandles,
  renderWithProviders,
} from '~testing/testing-utils';
import { WaitHandle } from '~testing/wait-handle';
import { API_URL } from '~utils/api-client';

import { EditPetModal } from './EditPetModal';

vi.mock('../utils/reportError');

const server = setupServer(...defaultHandlers);

beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' });
});

afterEach(() => {
  cleanup();
  server.resetHandlers();
  vi.restoreAllMocks();
  defaultWaitHandles.disableAllHandles();
});

afterAll(() => {
  server.close();
});

const { getPetWaitHandle, updatePetWaitHandle } = defaultWaitHandles;

interface RenderEditModalOptions {
  registerHandlers?: () => void;

  addMode?: boolean;
}

const renderEditModal = async (options?: RenderEditModalOptions) => {
  const handleOnDeleted = vi.fn();
  const handleOnClose = vi.fn();
  const handleOnSaved = vi.fn();

  const store = createReduxStore();

  await act(async () => {
    await store.dispatch(fetchPetsData()).unwrap();
  });

  options?.registerHandlers?.();

  const petId = options?.addMode ? undefined : 42;

  renderWithProviders(
    <EditPetModal
      petId={petId}
      onClose={handleOnClose}
      onDeleted={handleOnDeleted}
      onSaved={handleOnSaved}
    />,
    { store }
  );

  return {
    handleOnDeleted,
    handleOnClose,
    handleOnSaved,
  };
};

const verifyDisplayMode = async ({ expect }: { expect: ExpectStatic }) => {
  await waitFor(() => {
    expect(
      screen.getByRole('heading', { name: 'View pet' })
    ).toBeInTheDocument();
  });

  const editButton = screen.getByRole('button', { name: 'Edit' });
  const deleteButton = screen.getByRole('button', { name: 'Delete' });
  const cancelButton = screen.getByRole('button', { name: 'Cancel' });

  expect(editButton).toBeEnabled();
  expect(deleteButton).toBeEnabled();
  expect(cancelButton).toBeEnabled();

  const nameField = screen.getByLabelText('Name:');
  expect(nameField).toBeDisabled();

  const kindField = screen.getByLabelText('Kind:');
  expect(kindField).toBeDisabled();

  const ageField = screen.getByLabelText('Age:');
  expect(ageField).toBeDisabled();

  const healthProblemsField = screen.getByLabelText('Health Problems:');
  expect(healthProblemsField).toBeDisabled();

  const addedDateField = screen.getByLabelText('Added Date:');
  expect(addedDateField).toBeDisabled();

  const notesField = screen.getByLabelText('Notes:');
  expect(notesField).toBeDisabled();
};

const verifyEditMode = ({ expect }: { expect: ExpectStatic }) => {
  expect(screen.getByRole('heading', { name: 'Edit pet' })).toBeInTheDocument();

  const saveButton = screen.getByRole('button', { name: 'Save' });
  const cancelButton = screen.getByRole('button', { name: 'Cancel' });

  expect(saveButton).toBeEnabled();
  expect(cancelButton).toBeEnabled();

  const nameField = screen.getByLabelText('Name:');
  expect(nameField).toBeEnabled();

  const kindField = screen.getByLabelText('Kind:');
  expect(kindField).toBeDisabled();

  const ageField = screen.getByLabelText('Age:');
  expect(ageField).toBeEnabled();

  const healthProblemsField = screen.getByLabelText('Health Problems:');
  expect(healthProblemsField).toBeEnabled();

  const addedDateField = screen.getByLabelText('Added Date:');
  expect(addedDateField).toBeDisabled();

  const notesField = screen.getByLabelText('Notes:');
  expect(notesField).toBeEnabled();
};

const verifyAddMode = ({ expect }: { expect: ExpectStatic }) => {
  expect(screen.getByRole('heading', { name: 'Add pet' })).toBeInTheDocument();

  const saveButton = screen.getByRole('button', { name: 'Save' });
  const cancelButton = screen.getByRole('button', { name: 'Cancel' });

  expect(saveButton).toBeEnabled();
  expect(cancelButton).toBeEnabled();

  const nameField = screen.getByLabelText('Name:');
  expect(nameField).toBeEnabled();

  const kindField = screen.getByLabelText('Kind:');
  expect(kindField).toBeEnabled();

  const ageField = screen.getByLabelText('Age:');
  expect(ageField).toBeEnabled();

  const healthProblemsField = screen.getByLabelText('Health Problems:');
  expect(healthProblemsField).toBeEnabled();

  const addedDateField = screen.getByLabelText('Added Date:');
  expect(addedDateField).toBeEnabled();

  const notesField = screen.getByLabelText('Notes:');
  expect(notesField).toBeEnabled();
};

const verifyDefaultFieldValues = ({ expect }: { expect: ExpectStatic }) => {
  expect(screen.getByLabelText('Name:')).toHaveValue('Gosho');
  expect(screen.getByLabelText('Kind:')).toHaveValue('1');
  expect(screen.getByLabelText('Age:')).toHaveValue(2);
  expect(screen.getByLabelText('Health Problems:')).not.toBeChecked();
  expect(screen.getByLabelText('Added Date:')).toHaveValue('2022-10-31');
  expect(screen.getByLabelText('Notes:')).toHaveValue('White fur, very soft.');
};

test('edit modal defaults to view mode when called with a valid pet id', async ({
  expect,
}) => {
  getPetWaitHandle.enable();

  await renderEditModal();

  const loadingIndicator = await screen.findByTestId('loading-indicator');
  getPetWaitHandle.release();
  await waitForElementToBeRemoved(loadingIndicator);

  await verifyDisplayMode({ expect });
});

test('shows error indicator when pet request fails', async ({ expect }) => {
  const waitHandle = new WaitHandle();

  await renderEditModal({
    registerHandlers: () => {
      server.use(
        rest.get(`${API_URL}/pet/:petId`, async (_req, res, ctx) => {
          await waitHandle.wait();
          return res(ctx.status(500));
        })
      );
    },
  });

  const loadingIndicator = await screen.findByTestId('loading-indicator');
  waitHandle.release();
  await waitForElementToBeRemoved(loadingIndicator);

  await waitFor(() => {
    expect(screen.getByTestId('error-indicator')).toBeInTheDocument();
  });
});

test('onClosed is called on successful delete operation', async ({
  expect,
}) => {
  const user = userEvent.setup();

  const { handleOnClose } = await renderEditModal();

  const deleteButton = await screen.findByRole('button', { name: 'Delete' });

  await user.click(deleteButton);

  const deleteModal = await screen.findByRole('dialog', {
    name: 'Delete pet modal',
  });

  const confirmButton = await within(deleteModal).findByRole('button', {
    name: 'Confirm',
  });

  await user.click(confirmButton);

  expect(handleOnClose).toBeCalled();
});

test('onClosed is called when cancel button is clicked', async ({ expect }) => {
  const user = userEvent.setup();

  const { handleOnClose } = await renderEditModal();

  const cancelButton = await screen.findByRole('button', { name: 'Cancel' });

  await user.click(cancelButton);

  expect(handleOnClose).toBeCalled();
});

test('transitions the form into edit mode when the edit button is clicked', async ({
  expect,
}) => {
  const user = userEvent.setup();

  await renderEditModal();

  const editButton = await screen.findByRole('button', { name: 'Edit' });

  await user.click(editButton);

  verifyEditMode({ expect });
});

test('transitions back to display mode when the cancel button is clicked', async ({
  expect,
}) => {
  const user = userEvent.setup();

  await renderEditModal();

  const editButton = await screen.findByRole('button', { name: 'Edit' });

  await user.click(editButton);

  expect(screen.getByRole('heading', { name: 'Edit pet' })).toBeInTheDocument();

  const cancelButton = await screen.findByRole('button', { name: 'Cancel' });

  await user.click(cancelButton);

  await verifyDisplayMode({ expect });
});

const changeEditFormFields = async (
  user: ReturnType<typeof userEvent.setup>
) => {
  const nameField = screen.getByLabelText('Name:');
  const ageField = screen.getByLabelText('Age:');
  const healthProblemsField = screen.getByLabelText('Health Problems:');
  const notesField = screen.getByLabelText('Notes:');

  await user.clear(nameField);
  await user.type(nameField, 'test123');
  await user.clear(ageField);
  await user.type(ageField, '2');
  await user.click(healthProblemsField);
  await user.clear(notesField);
  await user.type(notesField, 'Notes 123');
};

test('clicking save transitions the form to display mode', async ({
  expect,
}) => {
  const user = userEvent.setup();

  await renderEditModal();

  await user.click(await screen.findByRole('button', { name: 'Edit' }));

  await changeEditFormFields(user);

  updatePetWaitHandle.enable();

  const saveButton = screen.getByRole('button', { name: 'Save' });

  await user.click(saveButton);

  const loadingIndicator = await screen.findByTestId('loading-indicator');
  updatePetWaitHandle.release();
  await waitForElementToBeRemoved(loadingIndicator);

  await verifyDisplayMode({ expect });

  expect(screen.getByLabelText('Name:')).toHaveValue('test123');
  expect(screen.getByLabelText('Kind:')).toHaveValue('1');
  expect(screen.getByLabelText('Age:')).toHaveValue(2);
  expect(screen.getByLabelText('Health Problems:')).toBeChecked();
  expect(screen.getByLabelText('Added Date:')).toHaveValue('2022-10-31');
  expect(screen.getByLabelText('Notes:')).toHaveValue('Notes 123');
});

test('delete modal is closed after cancel is clicked', async ({ expect }) => {
  const user = userEvent.setup();

  await renderEditModal();

  const deleteButton = await screen.findByRole('button', { name: 'Delete' });

  await user.click(deleteButton);

  const deleteModal = await screen.findByRole('dialog', {
    name: 'Delete pet modal',
  });

  const cancelButton = await within(deleteModal).findByRole('button', {
    name: 'Cancel',
  });

  await user.click(cancelButton);

  await waitFor(() => {
    expect(
      screen.queryByRole('dialog', { name: 'Delete pet modal' })
    ).not.toBeInTheDocument();
  });
});

test('form is returned to display mode when the cancel button is clicked', async ({
  expect,
}) => {
  const user = userEvent.setup();

  await renderEditModal();

  await user.click(await screen.findByRole('button', { name: 'Edit' }));

  await changeEditFormFields(user);

  const cancelButton = screen.getByRole('button', { name: 'Cancel' });

  await user.click(cancelButton);

  await verifyDisplayMode({ expect });

  verifyDefaultFieldValues({ expect });
});

test('cancel button resets the state successfully after failed update request', async ({
  expect,
}) => {
  const user = userEvent.setup();

  await renderEditModal();

  await user.click(await screen.findByRole('button', { name: 'Edit' }));

  await changeEditFormFields(user);

  const waitHandle = new WaitHandle();

  server.use(
    rest.put(`${API_URL}/pet/:petId`, async (_req, res, ctx) => {
      await waitHandle.wait();
      return res(ctx.status(500));
    })
  );

  const saveButton = screen.getByRole('button', { name: 'Save' });

  await user.click(saveButton);

  const loadingIndicator = await screen.findByTestId('loading-indicator');
  waitHandle.release();
  await waitForElementToBeRemoved(loadingIndicator);

  await waitFor(() => {
    expect(screen.getByTestId('error-indicator')).toBeInTheDocument();
  });

  const cancelButton = screen.getByRole('button', { name: 'Cancel' });

  await user.click(cancelButton);

  await verifyDisplayMode({ expect });

  verifyDefaultFieldValues({ expect });

  await waitFor(() => {
    expect(screen.queryByTestId('error-indicator')).not.toBeInTheDocument();
  });
});

test('will not submit data if input validation fails', async ({ expect }) => {
  const reportValidityMock = vi.spyOn(
    HTMLFormElement.prototype,
    'reportValidity'
  );
  reportValidityMock.mockImplementation(() => false);

  const user = userEvent.setup();

  await renderEditModal();

  const editButton = await screen.findByRole('button', { name: 'Edit' });

  await user.click(editButton);

  const nameField = screen.getByLabelText('Name:');

  await user.clear(nameField);
  await user.type(nameField, 'X');

  const updateEndpointFunc = vi.fn();

  server.use(
    rest.put(`${API_URL}/pet/:petId`, async (_req, res, ctx) => {
      updateEndpointFunc();
      return res(ctx.json({}));
    })
  );

  await user.click(screen.getByRole('button', { name: 'Save' }));

  expect(updateEndpointFunc).not.toBeCalled();

  verifyEditMode({ expect });
});

describe('add mode', () => {
  const fillForm = async (user: ReturnType<typeof userEvent.setup>) => {
    const nameField = screen.getByLabelText('Name:');
    const kindField = screen.getByLabelText('Kind:');
    const ageField = screen.getByLabelText('Age:');
    const healthProblemsField = screen.getByLabelText('Health Problems:');
    const addedDateField = screen.getByLabelText('Added Date:');
    const notesField = screen.getByLabelText('Notes:');

    await user.clear(nameField);
    await user.type(nameField, 'test123');
    await user.selectOptions(kindField, ['Cat']);
    await user.clear(ageField);
    await user.type(ageField, '2');
    await user.click(healthProblemsField);
    await user.clear(addedDateField);
    await user.type(addedDateField, '2023-10-10');
    await user.clear(notesField);
    await user.type(notesField, 'Notes 123');
  };

  test('error indicator is shown when the add request fails', async ({
    expect,
  }) => {
    const user = userEvent.setup();

    const waitHandle = new WaitHandle();

    await renderEditModal({
      registerHandlers: () => {
        server.use(
          rest.post(`${API_URL}/pet`, async (_req, res, ctx) => {
            await waitHandle.wait();
            return res(ctx.status(500));
          })
        );
      },
      addMode: true,
    });

    verifyAddMode({ expect });

    await fillForm(user);

    const saveButton = screen.getByRole('button', { name: 'Save' });

    await user.click(saveButton);

    const loadingIndicator = await screen.findByTestId('loading-indicator');
    waitHandle.release();
    await waitForElementToBeRemoved(loadingIndicator);

    await waitFor(() => {
      expect(screen.getByTestId('error-indicator')).toBeInTheDocument();
    });
  });

  test('transitions to display mode after successful save', async ({
    expect,
  }) => {
    const user = userEvent.setup();

    await renderEditModal({
      addMode: true,
    });

    verifyAddMode({ expect });

    await fillForm(user);

    const saveButton = screen.getByRole('button', { name: 'Save' });

    await user.click(saveButton);

    await verifyDisplayMode({ expect });
  });

  test('cancel button calls onClose', async ({ expect }) => {
    const user = userEvent.setup();

    const { handleOnClose } = await renderEditModal({
      addMode: true,
    });

    const cancelButton = screen.getByRole('button', { name: 'Cancel' });

    await user.click(cancelButton);

    expect(handleOnClose).toBeCalled();
  });
});
