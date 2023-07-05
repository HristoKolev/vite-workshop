import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, test, vi } from 'vitest';

import { Modal } from './Modal';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

test('clicking on the X button calls onClose', async ({ expect }) => {
  const user = userEvent.setup();

  const handleOnClose = vi.fn();

  render(
    <Modal onClose={handleOnClose}>
      <div />
    </Modal>
  );

  await user.click(screen.getByTestId('modal-close-button'));

  expect(handleOnClose).toBeCalled();
});

test('clicking on the backdrop calls onClose', async ({ expect }) => {
  const user = userEvent.setup();

  const handleOnClose = vi.fn();

  render(
    <Modal onClose={handleOnClose}>
      <div />
    </Modal>
  );

  await user.click(screen.getByTestId('modal-backdrop'));

  expect(handleOnClose).toBeCalled();
});

test("clicking on the X button when disableClosing is doesn't call onClose", async ({
  expect,
}) => {
  const user = userEvent.setup();

  const handleOnClose = vi.fn();

  render(
    <Modal onClose={handleOnClose} disableClosing>
      <div />
    </Modal>
  );

  await user.click(screen.getByTestId('modal-close-button'));

  expect(handleOnClose).not.toBeCalled();
});

test("clicking on the backdrop when disableClosing is doesn't call onClose", async ({
  expect,
}) => {
  const user = userEvent.setup();

  const handleOnClose = vi.fn();

  render(
    <Modal onClose={handleOnClose} disableClosing>
      <div />
    </Modal>
  );

  await user.click(screen.getByTestId('modal-backdrop'));

  expect(handleOnClose).not.toBeCalled();
});
