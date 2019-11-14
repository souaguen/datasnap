const mongoose = require("./database").mongoose;
const snapStories = require("snapchat-stories");
const fs = require("fs");
const svg2img = require("svg2img");

let SnapSchema = new mongoose.Schema({
    username: {
        type: String,
        minlength: 1,
        maxlength: 255,
        required: true,
        unique: true
    },
    isValid: {
        type: Boolean,
        default: false
    }
});

let SnapModel = mongoose.model("snaps", SnapSchema);

module.exports.addSnap = (username, cb) => {
    let regex = new RegExp("[a-zA-Z]");
    if (username && username !== "" && regex.test(username)) {
        let model = new SnapModel();
        model.username = username;
        model.save((err) => {
            if (err) { cb({error: "Le snap invalide !"}); }
            else {
                snapStories.getSnapcode(username).then((snapcode) => {
                    svg2img(snapcode.svg, {format: 'jpg'},(err, buffer) => {
                        let path = "./images/"+ username + ".jpg";
                        fs.writeFile(path, buffer, (err) => {
                            if (err) { cb({error: "Erreur lors de l'enregistrement."}); }
                            else { cb({message: "Snap enregistrer avec succees."}); }
                        });
                    });
                });
            }
        });
    }
}

module.exports.snapList = (cb) => {
    SnapModel.find({}, { username: 1, _id: 0}, (err, res) => {
        (err) ? cb({error: "Une erreur s'est produite !"}) : cb({data: res});
    });
}

module.exports.deleteSnap = (username, cb) => {
    SnapModel.deleteOne({ username: username }, (error) => {
        if (error) { cb({error: "Impossible a supprimer ma gueule."}) }
        else {
            fs.unlink("./images/"+ username +".jpg", (err) => {
                if (err) { cb({error: "Impossible a supprimer ma gueule."}) }
                else { cb({message: "Deletation reussi !"}) }
            });
        }
    });
}

module.exports.validate = () => {

}