import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import userReducer from './reducers/userReducer'; // Adjust path for userReducer if necessary
import programmeReducer from './reducers/programmeReducer'; // Adjust path for programmeReducer if necessary

const userPersistConfig = {
  key: 'user',
  storage,
};

const programmePersistConfig = {
  key: 'programme',
  storage,
};

const persistedUserReducer = persistReducer(userPersistConfig, userReducer);
const persistedProgrammeReducer = persistReducer(
  programmePersistConfig,
  programmeReducer
);

const store = configureStore({
  reducer: {
    user: persistedUserReducer,
    programme: persistedProgrammeReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

const persistor = persistStore(store);

export { store, persistor };
