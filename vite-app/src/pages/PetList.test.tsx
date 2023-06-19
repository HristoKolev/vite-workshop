import { afterEach, test, vi } from 'vitest';
import { cleanup, render, screen, within } from '@testing-library/react';

import { mockPetKindsByValue, mockPetList } from '~testing/mock-data.ts';

import { PetList } from './PetList';

vi.mock('../utils/reportError');

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

test('shows a message when there are no pets', async ({ expect }) => {
  render(
    <PetList
      petList={[]}
      petKindsByValue={mockPetKindsByValue}
      onEdit={vi.fn}
      onDelete={vi.fn}
    />
  );

  const table = await screen.findByRole('table');

  expect(within(table).queryAllByRole('row', { name: 'Pet' })).toHaveLength(0);

  expect(screen.getByText('No items.')).toBeInTheDocument();
});

test('row shows pet list item data', async ({ expect }) => {
  render(
    <PetList
      petList={mockPetList}
      petKindsByValue={mockPetKindsByValue}
      onEdit={vi.fn}
      onDelete={vi.fn}
    />
  );

  const table = await screen.findByRole('table');
  const row = within(table).getAllByRole('row', { name: 'Pet' })[0];

  expect(within(row).getByTestId('col_petId')).toHaveTextContent('42');
  expect(within(row).getByTestId('col_petName')).toHaveTextContent('Gosho');
  expect(within(row).getByTestId('col_addedDate')).toHaveTextContent(
    '31 Oct 2022'
  );
  expect(within(row).getByTestId('col_petKind')).toHaveTextContent('Cat');
});
