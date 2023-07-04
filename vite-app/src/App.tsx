import { type JSX, memo, useCallback, useEffect, useState } from 'react';

import { DeletePetModal } from './pages/DeletePetModal';
import { EditPetModal } from './pages/EditPetModal';
import { PetList } from './pages/PetList';
import { useAppDispatch, useAppSelector } from './redux/createReduxStore';
import {
  fetchPetsData,
  globalActions,
  globalSelector,
} from './redux/globalSlice';
import { ErrorIndicator } from './shared/ErrorIndicator';
import { LoadingIndicator } from './shared/LoadingIndicator';
import type { PetListItem } from './utils/server-data-model';

import './App.css';

export const App = memo((): JSX.Element => {
  const dispatch = useAppDispatch();
  const {
    petListById,
    petKinds,
    petKindsByValue,
    petList,
    isError,
    isLoading,
  } = useAppSelector(globalSelector);

  const fetchListData = useCallback(() => {
    void dispatch(fetchPetsData());
  }, [dispatch]);

  useEffect(() => {
    fetchListData();
  }, [fetchListData]);

  const [deletePet, setDeletePet] = useState<PetListItem | undefined>();
  const handleOnDeleteClick = useCallback(
    (petId: number) => setDeletePet(petListById?.[petId]),
    [petListById]
  );
  const handleOnDeleteModalClose = useCallback(
    () => setDeletePet(undefined),
    []
  );

  const [showEditModal, setShowEditModal] = useState<boolean>(false);

  const [editPetId, setEditPetId] = useState<number | undefined>();

  const handleOnEditClick = useCallback((petId: number) => {
    setEditPetId(petId);
    setShowEditModal(true);
  }, []);

  const handleOnEditModalClose = useCallback(() => {
    setEditPetId(undefined);
    setShowEditModal(false);
    dispatch(globalActions.clearSelectedPet());
  }, [dispatch]);

  const handleOnAddClick = useCallback(() => {
    setEditPetId(undefined);
    setShowEditModal(true);
  }, []);

  return (
    <main>
      <div className="pet-list-page-header">
        <h2>Pet Store</h2>
        {petKinds && (
          <button
            type="button"
            className="custom-button success-button add-pet-button"
            onClick={handleOnAddClick}
          >
            Add Pet
          </button>
        )}
      </div>

      <hr />

      <div className="pet-list-page-content">
        {isError && <ErrorIndicator />}
        {isLoading && <LoadingIndicator />}
        {!isLoading && !isError && petKindsByValue && petList && (
          <PetList
            petList={petList}
            petKindsByValue={petKindsByValue}
            onEdit={handleOnEditClick}
            onDelete={handleOnDeleteClick}
          />
        )}
        {deletePet && (
          <DeletePetModal
            pet={deletePet}
            onClose={handleOnDeleteModalClose}
            onDeleted={fetchListData}
          />
        )}
        {showEditModal && (
          <EditPetModal
            petId={editPetId}
            onClose={handleOnEditModalClose}
            onSaved={fetchListData}
            onDeleted={fetchListData}
          />
        )}
      </div>
    </main>
  );
});
