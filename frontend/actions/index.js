// Action Creators

import * as types from './types';

// Modals
// Menu Modal
export function openMenuModal() {
    return {
        type: types.MODAL_MENU_OPEN,
        payload: true
    };
}
export function closeMenuModal() {
    return {
        type: types.MODAL_MENU_CLOSE,
        payload: false
    };
}

// Login Modal
export function closeMenuOpenLogin() {
    return {
        type: types.CLOSE_MENU_OPEN_LOGIN
    };
}
export function closeLoginModal() {
    return {
        type: types.MODAL_LOGIN_CLOSE,
        payload: false
    };
}


// More Modal
export function openMoreModal() {
    return {
        type: types.MODAL_MORE_OPEN,
        payload: true
    };
}
export function closeMoreModal() {
    return {
        type: types.MODAL_MORE_CLOSE,
        payload: false
    };
}

// Transfer Modal
export function openTransferModal() {
    return {
        type: types.MODAL_TRANSFER_OPEN,
        payload: true
    };
}
export function closeTransferModal() {
    return {
        type: types.MODAL_TRANSFER_CLOSE,
        payload: false
    };
}

// Follower Modal
export function openFollowersModal() {
    return {
        type: types.MODAL_FOLLOWERS_OPEN,
        payload: true
    };
}
export function closeFollowersModal() {
    return {
        type: types.MODAL_FOLLOWERS_CLOSE,
        payload: false
    };
}

// Following Modal
export function openFollowingsModal() {
    return {
        type: types.MODAL_FOLLOWINGS_OPEN,
        payload: true
    };
}
export function closeFollowingsModal() {
    return {
        type: types.MODAL_FOLLOWINGS_CLOSE,
        payload: false
    };
}


// Comment
export function loadCommentDetail(comment) {
    return {
        type: types.LOAD_COMMENT_DETAIL,
        payload: comment
    }
}


// User log-in & log-out
export function onLogin(userInfo) {
    return {
        type: types.LOAD_USER,
        payload: userInfo
    }
}
export function logout() {
    return {
        type: types.LOGOUT_USER
    }
}

// Profile
// followers count
export function countFollowers(count) {
    return {
        type: types.COUNT_FOLLOWERS,
        payload: count
    }
}
// followings count
export function countFollowings(count) {
    return {
        type: types.COUNT_FOLLOWINGS,
        payload: count
    }
}
// load profile image
export function loadProfileImage(count) {
    return {
        type: types.LOAD_PROFILE_IMAGE,
        payload: count
    }
}
