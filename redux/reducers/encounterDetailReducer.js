const initialState =
{
    // encounterDetails:{
    //     uuid:[]
    // }
    encounterDetails:[]
};

//A reducer is a pure function that takes the previous state and an action as arguments and returns a new state
const encounterDetailReducer = (state = initialState, action) => {
    switch(action.type){
        case "SAVE_ENCOUNTER_DETAIL" :{
            return{
                ...state,
                encounterDetails: state.encounterDetails.concat(action.encounterDetails)
               //  encounterDetails : action.encounterdetails
            }
        }
        default:{
            return state;
        }
    }
}
export default encounterDetailReducer;
