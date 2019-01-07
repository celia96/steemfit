const initialState = { user: '', accessToken: '' }

const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case "LOAD_USER": {
            return Object.assign({}, state, { user: action.payload.user, accessToken: action.payload.accessToken });
        }
        case "LOGOUT_USER": {
            return Object.assign({}, state, { user: '', accessToken: '' });
        }
        default:
            return state;
    }
};

export default userReducer;
