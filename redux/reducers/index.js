// Imports: Dependencies
import { combineReducers } from 'redux';

// Imports: Reducers

import encounterDetailReducer from "./encounterDetailReducer"

// Redux: Root Reducer
const rootReducer = combineReducers({

  encounterDetailReducer:encounterDetailReducer
});

// Exports
export default rootReducer;
