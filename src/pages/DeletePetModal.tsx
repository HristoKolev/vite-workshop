import { type JSX, memo, useCallback } from 'react';

import { useAppDispatch, useAppSelector } from '~redux/createReduxStore';
import {
  deletePetStateSelector,
  deletePetThunk,
  globalSelector,
} from '~redux/globalSlice';
import { ErrorIndicator } from '~shared/ErrorIndicator';
import { LoadingIndicator } from '~shared/LoadingIndicator';
import { Modal } from '~shared/Modal';
import { reportUnknownError } from '~utils/reportUnknownError';
import type { PetListItem } from '~utils/server-data-model';

import './DeletePetModal.css';

interface DeletePetModalProps {
  onClose?: () => void;

  pet: PetListItem;

  onDeleted?: () => void;
}

export const DeletePetModal = memo(
  ({ onClose, onDeleted, pet }: DeletePetModalProps): JSX.Element => {
    const dispatch = useAppDispatch();
    const { petKindsByValue } = useAppSelector(globalSelector);
    const { deleteLoading, deleteError } = useAppSelector(
      deletePetStateSelector
    );

    const handleOnClose = useCallback(() => onClose?.(), [onClose]);

    const handleOnConfirmClick = useCallback(async () => {
      try {
        await dispatch(deletePetThunk(pet.petId)).unwrap();
        onClose?.();
        onDeleted?.();
      } catch (error) {
        reportUnknownError(error);
      }
    }, [onClose, onDeleted, pet.petId, dispatch]);

    return (
      <Modal
        className="delete-pet-modal"
        onClose={handleOnClose}
        disableClosing={deleteLoading}
        ariaLabel="Delete pet modal"
      >
        <h1>Are you sure you want to delete this pet?</h1>

        <div>
          <div
            className="delete-pet-modal-list-item"
            data-testid="delete-modal_petId"
          >
            PetId: {pet.petId}
          </div>
          <div
            className="delete-pet-modal-list-item"
            data-testid="delete-modal_petName"
          >
            Pet Name: {pet.petName}
          </div>
          <div
            className="delete-pet-modal-list-item"
            data-testid="delete-modal_petKind"
          >
            Pet Kind: {petKindsByValue?.[pet.kind]?.displayName || ''}
          </div>
        </div>

        <div className="indicator-placeholder">
          {deleteLoading && <LoadingIndicator text="Deleting pet" />}
          {deleteError && (
            <ErrorIndicator errorMessage="An error occurred while deleting the pet." />
          )}
        </div>

        <div className="button-group">
          <button
            type="button"
            className="btn btn-red"
            onClick={handleOnConfirmClick}
            disabled={deleteLoading}
          >
            Confirm
          </button>
          <button
            type="button"
            className="btn btn-gray"
            onClick={handleOnClose}
            disabled={deleteLoading}
          >
            Cancel
          </button>
        </div>
      </Modal>
    );
  }
);
