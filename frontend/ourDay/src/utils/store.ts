import { createStore, combineReducers, applyMiddleware } from 'redux';
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import thunk from 'redux-thunk';

// Define actions
export const SET_SHOW_CONFETTI = 'SET_SHOW_CONFETTI';

export interface ShowConfettiAction {
  type: typeof SET_SHOW_CONFETTI;
  payload: boolean;
}

export const setShowConfetti = (value: boolean): ShowConfettiAction => ({
  type: SET_SHOW_CONFETTI,
  payload: value,
});

// Define state type
export interface AppState {
  showConfetti: boolean;
}

// Define reducers
const confettiReducer = (state = false, action: ShowConfettiAction): boolean => {
  switch (action.type) {
    case SET_SHOW_CONFETTI:
      return action.payload;
    default:
      return state;
  }
};

const rootReducer = combineReducers<AppState>({
  showConfetti: confettiReducer,
});

// Create store
const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;
export type RootState = ReturnType<typeof rootReducer>;
export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useTypedDispatch = () => useDispatch<typeof store.dispatch>();
