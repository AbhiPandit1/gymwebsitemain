import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web

// Import your reducers
import userReducer from './reducers/userReducer'; // Adjust path as necessary
import programmeReducer from './reducers/programmeReducer'; // Adjust path as necessary

// Persist configuration for user state
const userPersistConfig = {
  key: 'user', // key for the persist
  storage, // storage type
};

// Persist configuration for programme state
const programmePersistConfig = {
  key: 'programme', // key for the persist
  storage, // storage type
};

// Wrap reducers with persistReducer to enable persistent storage
const persistedUserReducer = persistReducer(userPersistConfig, userReducer);
const persistedProgrammeReducer = persistReducer(
  programmePersistConfig,
  programmeReducer
);

// Configure the Redux store with persisted reducers
const store = configureStore({
  reducer: {
    user: persistedUserReducer,
    programme: persistedProgrammeReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // To disable serializable check for Redux Persist
    }),
});

// Create a persistor object to persist the Redux store
const persistor = persistStore(store);

export { store, persistor };
