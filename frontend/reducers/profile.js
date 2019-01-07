const initialState = { profile_image: '', followers_count: undefined, followings_count: undefined }

const profileReducer = (state = initialState, action) => {
    switch (action.type) {
        case "LOAD_PROFILE_IMAGE": {
            return Object.assign({}, state, { profile_image: action.payload });
        }
        case "COUNT_FOLLOWERS": {
            return Object.assign({}, state, { followers_count: action.payload });
        }
        case "COUNT_FOLLOWINGS": {
            return Object.assign({}, state, { followings_count: action.payload });
        }
        default:
            return state;
    }
};

export default profileReducer;
