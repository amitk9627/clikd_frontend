import { createStore, applyMiddleware } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // AsyncStorage or other storage library
import reducer from './reducer';

// ==============================|| REDUX - MAIN STORE ||============================== //
const persistConfig = {
  key: 'root',
  storage
};

const persistedReducer = persistReducer(persistConfig, reducer);
const store = createStore(persistedReducer, applyMiddleware(/* add middleware if needed */));
const persistor = persistStore(store);

export { store, persistor };
