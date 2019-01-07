
const initialState =
{
  menu: false,
  login: false,
  more: false,
  transfer: false,
  followers: false,
  followings: false
};

const modalReducer = (state = initialState, action) => {
    switch (action.type) {
        // Menu
        case "MODAL_MENU_OPEN": {
            return Object.assign({}, state, { menu: action.payload });
        }
        case "MODAL_MENU_CLOSE": {
            return Object.assign({}, state, { menu: action.payload });
        }

        // Login
        case "CLOSE_MENU_OPEN_LOGIN": {
            return Object.assign({}, state, { menu: false, login: true });
        }
        case "MODAL_LOGIN_CLOSE": {
            console.log("close login");
            return Object.assign({}, state, { login: action.payload });
        }

        // More
        case "MODAL_MORE_OPEN": {
            return Object.assign({}, state, { more: action.payload });
        }
        case "MODAL_MORE_CLOSE": {
            return Object.assign({}, state, { more: action.payload });
        }

        // Transfer
        case "MODAL_TRANSFER_OPEN": {
            return Object.assign({}, state, { transfer: action.payload });
        }
        case "MODAL_TRANSFER_CLOSE": {
            return Object.assign({}, state, { transfer: action.payload });
        }

        // Followers
        case "MODAL_FOLLOWERS_OPEN": {
            return Object.assign({}, state, { followers: action.payload });
        }
        case "MODAL_FOLLOWERS_CLOSE": {
            return Object.assign({}, state, { followers: action.payload });
        }

        // Followings
        case "MODAL_FOLLOWINGS_OPEN": {
            return Object.assign({}, state, { followings: action.payload });
        }
        case "MODAL_FOLLOWINGS_CLOSE": {
            return Object.assign({}, state, { followings: action.payload });
        }

        default:
            return state;
    }
};

export default modalReducer;
