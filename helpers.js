
// Set user info from request
exports.setUserInfo = function setUserInfo (request) {
    if (request.socialId === null) {
        const getUserInfo = {
            _id: request._id,
            userName: request.userName,
            email: request.email,
            picture: request.picture,
            status: request.status,
            socialId: null
        };

        return getUserInfo;
    }
    const getUserInfo = {
        _id: request._id,
        userName: request.displayName,
        email: request.email,
        picture: request.photos[0].value || 0,
        status: request.status,
        socialId: request.id
    };

    return getUserInfo;
};
