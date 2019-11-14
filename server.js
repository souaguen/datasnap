let app = require("express")();
const cookieSession = require("cookie-session");
const { addSnap, snapList, deleteSnap } = require("./Model/SnapModel");
const { getSprite } = require("./spriter-gen");
const { createCanvas, loadImage } = require('canvas');
const canvas = createCanvas(250, 250);
const ctx = canvas.getContext("2d");


app.disable("x-powered-by");

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

app.use(cookieSession({
    secret: "secret!cookie",
    keys: ['key1', 'key2']
}));

app.get("/snaplist", (req, res) => {
    snapList((response) => {
        let snapname = response.data.map((value) => {
            return value.username + ".jpg";
        });
        getSprite(snapname, (data) => {
            res.send({data});
        });
    });
});

app.get("/snap/:username", (req, res) => {
    loadImage("./images/"+req.params.username+".jpg").then((image) => {
        ctx.drawImage(image, 0, 0, 250, 250);
        res.send({data: canvas.toDataURL()})
    }).catch((err) => {
        if (err) { res.send({error: "Le snap n'existe pas."}); }
    });
});

app.get("/push/:username", (req, res) => {
    addSnap(req.params.username, (d) => {
        snapList((response) => {
            let snapname = response.data.map((value) => {
                return value.username + ".jpg";
            });
            getSprite(snapname, (data) => {
                res.send({data});
            });
        });
    });
});

app.delete("/remove/:username", (req, res) => {
    deleteSnap(req.params.username, (d) => {
        snapList((response) => {
            let snapname = response.data.map((value) => {
                return value.username + ".jpg";
            });
            getSprite(snapname, (data) => {
                console.log(d);
                res.send({data});
            });
        });
    });
});

app.listen(8080);