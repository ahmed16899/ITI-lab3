
const express = require('express')
const app = express()
const port = 3000
const bodyParser = require('body-parser')
const res = require('express/lib/response')
const fs = require('fs');
const fileName = './users.json';
const { v4: uuidv4 } = require("uuid");
const { param } = require('express/lib/request')
const userRouter = require('./routers/userRouter');
var jwt = require('jsonwebtoken');
const serverConfig = require('./serverConfig');
const { auth } = require('./middlewares/auth')
const User = require('./models/User');
require('./mongoConnect')




app.use(bodyParser.json()) 

app.use('/users', userRouter);


const logIn = async (req, res, next) => {
    const { username, password } = req.body;
    const user = await User.findOne({username});
    if (user && password == user.password) {
        const payload = { id: user.id, name: user.name };
        //console.log(payload.id);
        const token = jwt.sign(payload, serverConfig.secret, { expiresIn: "1d" });
        return res.send({ massage: "login sucess", token })
    }
    else {
        return res.status(400).send({ error: "not found this mail" })
    }
}

const getUsers = async(req, res, next) => {
    const user = await User.find({});
    if(user)
    {
        return res.send({ user,massage: "Get Users Succeffully" })
    }
    else
    {
        return res.send({ massage: "error" })
    }
}




app.post('/login', logIn, (req, res) => {
    debugger
    res.send("sucess login");
    //next();
})
app.get('/getusers', auth, getUsers, (req, res) => {
    debugger
    res.send("sucess login");
    //next();
})

app.use((err, req, res, next) => {
    if (err.status >= 500) {
        console.log(err.internalMassage);
        return res.status(500).send({ error: "internal server error" })
    }
    res.status(err.status).send(err.massage);
})
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})