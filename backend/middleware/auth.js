import jwt from 'jsonwebtoken'

export const createAccessToken = (user) => {
    return jwt.sign({ userId: user.id }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "1d"
    });
}

export const createRefreshToken = (user) => {
    return jwt.sign(
        { userId: user.id, token_version: user.token_version }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: "7d"
    });
}