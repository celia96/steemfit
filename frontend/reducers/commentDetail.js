
const initialState = {};

const commentDetailReducer = (state = initialState, action) => {
    switch (action.type) {
        case "LOAD_COMMENT_DETAIL":
            return action.payload;
        default:
            return state;
    }
};

export default commentDetailReducer;
