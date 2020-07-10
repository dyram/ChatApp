const dotenv = require('dotenv').config()
const express = require("express");
const app = express();
const Sequelize = require("sequelize");
const bodyParser = require("body-parser");
const cors = require("cors");
const uuid = require('uuid');
const models = require("./models")
const Op = Sequelize.Op

var server = require('http').createServer(app);
var io = require('socket.io')(server);
const SocketManager = require("./SocketManager")

io.on('connection', (socket) => {
    console.log("NEW USER CONNECTED")

    socket.on('new_message', async (data) => {
        //broadcast the new message
        await models.Messages.create(data)
        io.sockets.emit('new_message', data);
        console.log(data)
    })

    socket.on('new_group', async (data) => {
        //broadcast the new message
        // await models.Messages.create(data)
        let groupId = Math.floor(Math.random() * 100);
        await models.Groups.create({ id: groupId, name: data.name })
        // let cGroupId = await models.Groups.findOne({ where: { name: data.name } }).id
        data.users.map(async obj => {
            await models.GroupUsers.create({
                inGroup: true,
                GroupId: groupId,
                UserId: obj.key
            })
        })
        console.log(data)
        io.sockets.emit('new_group_created', data);
    })
})

app.use(express.static(__dirname + '/node_modules'));

const routes = require("./routes/appRoutes");
const port = process.env.PORT;

// app.listen(port, () => {
//     console.log("App running on : ", port);
// });

server.listen(port, () => {
    console.log("App running on : ", port);
});

const sequelize = new Sequelize(process.env.DBNAME, process.env.DBUSER, process.env.DBPASS, {
    dialect: process.env.DIALECT,
    host: process.env.HOST
});

sequelize.authenticate().then(() => {
    console.log("Connected to DB");
});

app.use(cors());
app.use(bodyParser.json({ limit: "10mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));
routes(app);