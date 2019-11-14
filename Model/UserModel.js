const mongoose = require("./database").mongoose;
const jwt = require("jsonwebtoken");

const Schema = mongoose.Schema;

let userSchema = new Schema({
    username: {
        type: String,
        maxlength: 50,
        minlength: 1,
        unique: true,
        required: true
    },
    password: {
        type: String,
        maxlength: 255,
        minlength: 6,
        required: true
    },
    voted: {
        type: Boolean,
        default: false
    }
});

const UserModel = mongoose.model("users", userSchema);

module.exports.signUp = (user, cb) => {
    let model = new UserModel();
    model.username = user.username;
    model.password = user.password;
    return model.save((err) => {
        if (err) cb({error: "Les coordonnees entrer sont incorrect !"});
        else {
            jwt.sign({username: user.username}, "secret!token", {}, (err, token) => {
                cb({token});
            });
        };
    });
}

module.exports.logIn = (user, cb) => {
    UserModel.find({username: user.username, password: user.password}, (err, res) => {
        if (res.length) {
            jwt.sign({username: user.username}, "secret!token", {}, (err, token) => {
                cb({token});
            });
        }
        else
            cb({response: "Nom d'utilisateur, ou mot de passe est incorrect."});
    });
}

module.exports.userList = (cb) => {
    UserModel.find({}, (err, res) => {
        cb({response: res})
    });
}