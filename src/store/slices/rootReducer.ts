import { combineReducers } from 'redux';
// import sessionReducer from './sessionSlice';
import userReducer from './userSlice';
import counterReducer from '../../components/Counter/counterSlice';

const rootReducer = combineReducers({
  // session: sessionReducer,
  user: userReducer,
  counter: counterReducer,
});

export default rootReducer;
