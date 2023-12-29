import { type JSX, memo, useCallback, useState } from 'react';

import { ErrorIndicator } from '~shared/ErrorIndicator';
import { LoadingIndicator } from '~shared/LoadingIndicator';
import { Modal } from '~shared/Modal';
import { deletePet } from '~utils/api-client';
import { reportError } from '~utils/reportError';
import type { PetListItem } from '~utils/server-data-model';

import './DeletePetModal.css';

export interface DeletePetModalProps {
  onClose?: () => void;

  pet: PetListItem;

  onDeleted?: () => void;

  petKindsByValue: Map<number, string>;
}

export const DeletePetModal = memo(
  ({
    onClose,
    onDeleted,
    pet,
    petKindsByValue,
  }: DeletePetModalProps): JSX.Element => {
    const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
    const [deleteError, setDeleteError] = useState<boolean>(false);

    const handleOnClose = useCallback(() => onClose?.(), [onClose]);

    const handleOnConfirmClick = useCallback(() => {
      void (async () => {
        setDeleteLoading(true);
        setDeleteError(false);

        try {
          await deletePet(pet.petId);
          onClose?.();
          onDeleted?.();
        } catch (error) {
          reportError(error);

          setDeleteError(true);
        } finally {
          setDeleteLoading(false);
        }
      })().catch(reportError);
    }, [onClose, onDeleted, pet.petId]);

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
            Pet Kind: {petKindsByValue.get(pet.kind) || ''}
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
            className="custom-button errorButton confirm-button"
            onClick={handleOnConfirmClick}
            disabled={deleteLoading}
          >
            Confirm
          </button>
          <button
            type="button"
            className="custom-button grayButton cancel-button"
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