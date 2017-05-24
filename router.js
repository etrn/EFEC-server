const AuthenticationController = require('./controllers/authentication');
const UserController = require('./controllers/user');
const ChatController = require('./controllers/chat');
const express = require('express');
const passport = require('passport');

const passportService = require('./config/passport');

// Middleware to require login/auth
const requireAuth = passport.authenticate('jwt', { session: false });
const requireLogin = passport.authenticate('local', { session: false });

module.exports = function (app) {
  // Initializing route groups
    const apiRoutes = express.Router();
    const authRoutes = express.Router();
    const userRoutes = express.Router();
    const chatRoutes = express.Router();

  //= ========================
  // Auth Routes
  //= ========================

  // Set auth routes as subgroup/middleware to apiRoutes
    apiRoutes.use('/auth', authRoutes);

  // Registration route
    authRoutes.post('/register', AuthenticationController.register);

  // Login route
    authRoutes.post('/login', requireLogin, AuthenticationController.login);

  // Login via Facebook
    authRoutes.post('/facebook', passport.authenticate('facebook'));
    authRoutes.post('/facebook/callback', passport.authenticate('facebook'), AuthenticationController.social);

  // Login via Google
    authRoutes.post('/google', passport.authenticate('google'));
    authRoutes.post('/google/callback', passport.authenticate('google'), AuthenticationController.social);

  // Login via Twitter
    authRoutes.post('/twitter', passport.authenticate('twitter'));
    authRoutes.post('/twitter/callback', passport.authenticate('twitter'), AuthenticationController.social);

  // Password reset request route (generate/send token)
    authRoutes.post('/forgot-password', AuthenticationController.forgotPassword);

  // Password reset route (change password using token)
    authRoutes.post('/reset-password/', AuthenticationController.resetPassword);

  //= ========================
  // User Routes
  //= ========================

  // Set user routes as a subgroup/middleware to apiRoutes
    apiRoutes.use('/user', userRoutes);

  // Get all users
    userRoutes.get('/users', requireAuth, UserController.getUsers);

  // View user profile route
    userRoutes.get('/:userId', requireAuth, UserController.viewProfile);

  // Test protected route
    apiRoutes.get('/protected', requireAuth, (req, res) => {
        res.send({ content: 'The protected test route is functional!' });
    });

  //= ========================
  // Chat Routes
  //= ========================

  // Set chat routes as a subgroup/middleware to apiRoutes
    apiRoutes.use('/chat', chatRoutes);

  // View messages to and from authenticated user
    chatRoutes.get('/', requireAuth, ChatController.getConversations);

  // Retrieve single conversation
    chatRoutes.get('/:conversationId', requireAuth, ChatController.getConversation);

  // Send reply in conversation
    chatRoutes.post('/:conversationId', requireAuth, ChatController.sendReply);

  // Start new conversation
    chatRoutes.post('/new/:recipient', requireAuth, ChatController.newConversation);

  // Set url for API group routes
    app.use('/api', apiRoutes);
};
