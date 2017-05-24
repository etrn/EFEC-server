// Importing Node packages required for schema
const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

const DEFAULT_USER_PICTURE = 'http://res.cloudinary.com/etrn/image/upload/v1495467917/default_wufp56.png';
const SALT_FACTOR = 5;
const Schema = mongoose.Schema;

//= ===============================
// User Schema
//= ===============================
const UserSchema = new Schema({
    email: {
        type: String,
        lowercase: true,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    userName: {
        type: String
    },
    picture: {
        type: String,
        default: DEFAULT_USER_PICTURE
    },
    status: {
        type: Boolean,
        default: false
    },
    socialId: {
        type: String,
        default: null
    },
    resetIdentifier: { type: String },
    resetExpiry: { type: Date }
},
    {
        timestamps: true
    });

//= ===============================
// User ORM Methods
//= ===============================

// Pre-save of user to database, hash password if password is modified or new
UserSchema.pre('save', function (next) {
    const user = this;

    if (!user.picture)
        user.picture = DEFAULT_USER_PICTURE;

    if (!user.isModified('password')) return next();

    bcrypt.genSalt(SALT_FACTOR, (err, salt) => {
        if (err) return next(err);

        bcrypt.hash(user.password, salt, null, (err, hash) => {
            if (err) return next(err);
            user.password = hash;
            next();
        });
    });
});

// Method to compare password for login
UserSchema.methods.comparePassword = function (candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
        if (err) return cb(err);

        cb(null, isMatch);
    });
};

module.exports = mongoose.model('User', UserSchema);
