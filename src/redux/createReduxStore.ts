import { configureStore } from '@reduxjs/toolkit';
import {
  type TypedUseSelectorHook,
  useDispatch,
  useSelector,
} from 'react-redux';

import { globalSlice } from './globalSlice';

export const createReduxStore = () =>
  configureStore({
    reducer: {
      [globalSlice.name]: globalSlice.reducer,
    },
  });

export type ReduxStoreType = ReturnType<typeof createReduxStore>;

export type ReduxState = ReturnType<
  ReturnType<typeof createReduxStore>['getState']
>;

export const useAppDispatch = () =>
  // eslint-disable-next-line @arabasta/redux-use-app-functions/use-app-dispatch
  useDispatch<ReturnType<typeof createReduxStore>['dispatch']>();

export const useAppSelector: TypedUseSelectorHook<ReduxState> = useSelector;
