export const sendRefreshToken = (res, token) => {
    // // console.log('sendRefreshToken from the createRefreshToken token:',token)

    res.cookie("jid", token, { httpOnly: true, path: "/refresh_token" })
}