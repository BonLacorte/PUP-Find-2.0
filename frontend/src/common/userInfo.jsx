export let access_token = ""
export let user_id = ""
export let user_info = {}

export const setAccessToken = (token) => {
    access_token = token
}

export const getAccessToken = () => {
    return access_token
}

export const setUserId = (id) => {
    user_id  = id
}

export const getUserId = () => {
    return user_id
}

export const setUserInfo = (info) => {
    user_info = info
}

export const getUserInfo = () => {
    return user_info
}
