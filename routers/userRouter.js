const express = require('express')
const bodyParser = require('body-parser')
const res = require('express/lib/response')
const fs = require('fs');
const fileName = './users.json';
const { v4: uuidv4 } = require("uuid");
const { param } = require('express/lib/request')
const router = express.Router();
const { auth } = require('../middlewares/auth');
const e = require('express');
const User = require('../models/User');
const console = require('console');



const addUser = async (req, res, next) => {
    try {
        if(req.body.name && req.body.password)
        {
            const { username, password, age } = req.body;
            const user = new User({ username, password, age });
            //console.log(req.body);
            await user.save();
            //console.log(user);
            res.send({ message: "added success" })
        }
        else
        {
            res.send({ messege: "username and password is reuqird" })
        }
       
    }
    catch (error) {
        res.send({ inernalMassage: error.message })
    }
}
const udpateUser = async (req, res, next) => {
    const { username, password, age } = req.body;
    if (await User.updateOne({ _id: req.user.id }, { username, password, age })) {
        return res.end("update the record");
    }
    else {
        return res.end("error");
    }


}

const filterWithAge = async(req, res, next) => {

    const user = await User.find({age : req.query.age});
    if(user)
    {
        return res.send({messege:"founded" , user});
    }
    else
    {
        return res.send("no user with this age");
    }
}

const deleteUser = async(req, res, next) => {
    if (req.user.id) {
        //const { username, password } = req.body;
     await User.deleteOne({_id : req.user.id});
     return res.send({ massage: "deleted" })
    
    }
    else {
        res.send({ massage: "authorization error" })
    }
}

const getUserById = async(req, res, next) => {
    //if (req.user.id == req.params.id) {

      const user =  await User.find({_id : req.user.id})
    if(user)
    {
        return res.send({messege:"founded" , user});
    }
    else
    {
        return res.send("no user with this age");
    }
}

router.get('/:id', auth, getUserById, (req, res) => {
    debugger

    res.send("sucess get user");
})

router.post('/', addUser, (req, res) => {
    debugger
    res.send("sucess");
    //next();
})
router.patch('/', auth, udpateUser, (req, res) => {
    debugger

    res.send("sucess udpate");
})
router.get('/', filterWithAge, (req, res) => {
    debugger

    res.send("sucess filter ");
})
router.delete('/', auth, deleteUser, (req, res) => {
    debugger

    res.send("sucess get user");
})

module.exports = router;
