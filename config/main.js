module.exports = {
  // Secret key for JWT signing and encryption
    secret: 'super secret passphrase',
  // Database connection information
    database: 'mongodb://e:e@ds149491.mlab.com:49491/tests',
  // Setting port for server
    PORT: 3000,
  // MailGun
    resetPs: 'sk_c5e54c84fb877768f1331d171df49f13',
  // Social login-passport strategies
    facebook: {
        clientID: '475213709488929',
        clientSecret: 'b1c64d4465d53de7d916b37297f7f1fc',
        callbackURL: '/auth/facebook/callback',
        profileFields: ['id', 'displayName', 'photos']
    },
    google: {
        clientID: '805462263225-jbr80qp6bm7251066qk18ejrvbijb92a.apps.googleusercontent.com',
        clientSecret: 'R5YEeVgXqUH7e9F5cPra6_yE',
        callbackURL: '/auth/google/callback',
        profileFields: ['id', 'displayName', 'photos']
    },
    twitter: {
        consumerKey: 'Xqx2zXPpO9nLu8LIlOWsEXrvy',
        consumerSecret: '28YZoWuNTPmSsGzWKGyeMjt0GkFCuEL7PaU2YJ9MLizrWMf34S',
        callbackURL: '/auth/twitter/callback',
        profileFields: ['id', 'displayName', 'photos']
    },
  // necessary in order to run tests in parallel of the main app
    test_port: 3001,
    test_db: 'tests',
    test_env: 'test'
};
