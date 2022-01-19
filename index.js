const express = require('express')
const app = express()
const port = 3000
const bodyParser = require('body-parser')
const res = require('express/lib/response')
const fs = require('fs');
const fileName = './user.json';
const { v4: uuidv4 } = require("uuid");
const { param } = require('express/lib/request')
const userRouter = require('./routers/usersRouter');
app.use(bodyParser.json()) // parse body to string and call next 
app.use('/users' , usersRouter);
const logIn = (req, res, next) => {
    if (!(req.body.name || req.body.password)) {
        return res.status(400).send({ error: "you should enter name and password" })
    }
    let arr = [];
    fs.readFile(fileName, { encoding: 'utf8' }, (err, data) => {
        arr = JSON.parse(data);
        const check = arr.some(i => i.name == req.body.name);
        const check1 = arr.some(i => i.password == req.body.password);
        if (check && check1) {
            return res.send({ massage: "login sucess" })
        }
        else {
            return res.status(400).send({ error: "not found this mail" })
        }
    });
}
const getUsers = (req, res, next) => {
    let arr = [];
    fs.readFile(fileName, { encoding: 'utf8' }, (err, data) => {
        arr = JSON.parse(data);
        for (const uname of arr) {
            console.log(uname.name);
        }
    });
    return res.send({ massage: "Get Users Succeffully" })
}


app.post('/login', logIn, (req, res) => {
    debugger
    res.send("sucess login");
    //next();
})
app.get('/getusers', getUsers, (req, res) => {
    debugger
    res.send("sucess login");
    //next();
})
app.use((err , req , res , next)=>{
    if(err.status >=500)
    {
        console.log(err.internalMassage);
        return res.status(500).send({error:"internal server error"})
    }
    res.status(err.status).send(err.massage);
})
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
