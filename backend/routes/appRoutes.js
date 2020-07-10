module.exports = app => {
    const passwordHash = require("password-hash")
    const jwt = require("jsonwebtoken");
    const key = require("../config/key.json");

    const Sequelize = require("sequelize");
    const Op = Sequelize.Op

    const users = require("../models").Users;
    const messages = require("../models").Messages;
    const groups = require("../models").Groups;
    const groupUsers = require("../models").GroupUsers;
    const groupMessages = require("../models").GroupMessages;

    app.get("/", (req, res) => {
        res.send("Working Fine!!");
    });

    app.post("/signup", (req, res) => {
        let data = req.body.password;
        let hash = passwordHash.generate(data);
        users.create({
            username: req.body.username,
            email: req.body.email,
            password: hash,
            google: false
        });
        res.send("create Success")
    })

    app.post("/login", (req, res) => {
        let data = req.body;
        users
            .findAll({
                attributes: ["id", "email", "password"],
                where: { email: data.email }
            })
            .then(prom => {
                let val = passwordHash.verify(data.password, prom[0].password);
                let token;
                if (val) {
                    token = {
                        id: jwt.sign(
                            {
                                exp: Date.now() / 1000 + 60 * 60,
                                id: prom[0].id
                            },
                            key.tokenKey
                        ),
                        validity: true,
                        uid: prom[0].id
                    };
                } else {
                    token = {
                        id: jwt.sign({ id: prom[0].id }, key.tokenKey),
                        validity: false,
                    };
                }
                res.send(token);
            });
    })

    app.post("/googleLogin", async (req, res) => {
        console.log("GOOGLE LOGIN", req.body)
        // let uid = uuid()
        let uid = Math.floor(Math.random() * 100)
        let resp = await users.create({
            id: uid,
            email: req.body.email,
            password: req.body.token,
            role: false,
            google: true,
        });

        let token = {
            id: jwt.sign(
                {
                    exp: Date.now() / 1000 + 60 * 60,
                    id: uid
                },
                key.tokenKey
            ),
            validity: true,
            google: true,
            uid: uid
        };

        console.log("GOOGLE LOGIN", token)
        res.send(token)
    })

    app.get("/users", async (req, res) => {
        users.findAll().then(resp => res.send(resp))
    })

    app.get("/messages", async (req, res) => {
        messages.findAll().then(resp => res.send(resp))
    })

    app.post("/specMessage", async (req, res) => {
        messages.findAll({ where: { to: { [Op.or]: [req.body.to, req.body.from] }, from: { [Op.or]: [req.body.from, req.body.to] } } }).then(resp => res.send(resp))
    })

    app.post("/specGroupMessage", async (req, res) => {
        // groupMessages.findAll({ where: { GroupId: { [Op.or]: [req.body.GroupId, req.body.from] }, from: { [Op.or]: [req.body.from, req.body.GroupId] } } }).then(resp => res.send(resp))
        groupMessages.findAll({ where: { GroupId: req.body.GroupId } }).then(resp => res.send(resp))
    })

    app.post("/specGroups", async (req, res) => {
        let group = await groupUsers.findAll({ where: { UserId: req.body.UserId } })
        let numArr = []
        group.map(async obj => {
            numArr.push(obj.GroupId)
        })
        let resp = await groups.findAll({ where: { id: { [Op.or]: numArr } } })
        res.send(resp)
    })

}