const express = require('express')
const bodyParser = require('body-parser')
const res = require('express/lib/response')
const fs = require('fs');
const fileName = './user.json';
const { v4: uuidv4 } = require("uuid");
const { param } = require('express/lib/request')
const router = express.Router();
const validateUser = (req, res, next) => {
    if (!(req.body.name || req.body.password)) {
        return res.status(400).send({ error: "you should enter name and password" })
    }
    next();
};
const validateNameAdd = (req, res, next) => {
    let arr = [];
    fs.readFile(fileName, { encoding: 'utf8' }, (err, data) => {
        arr = JSON.parse(data);
        const check = arr.some(i => i.name == req.body.name);
        if (check) {
            return res.status(400).send({ error: "username must be unique" })
        }
        else {
            const id = uuidv4()
            const newUser = {
                id: id,
                name: req.body.name,
                password: req.body.password,
                age: req.body.age
            }
            arr.push(newUser);
            console.log(arr);
            fs.writeFile(fileName, JSON.stringify(arr), (err) => {
                if (!err) return res.send({ massage: "sucess" })
                res.status(500).send("error");
            });
        }
    });
}
const udpateUser = (req, res, next) => {
    let arr = [];
    fs.readFile(fileName, { encoding: 'utf8' }, (err, data) => {
        arr = JSON.parse(data);
        for (let i = 0; i < arr.length; i++) {
            //console.log(arr);
            const check = arr.some(i => i.name == req.body.name);
            if (req.params.id == arr[i].id && !check) {
                let newUpdatedUser = {
                    id: req.params.id,
                    name: req.body.name,
                    password: req.body.password,
                    age: req.body.age
                }
                arr.splice(i, 1, newUpdatedUser);
                break;
                //arr[i] = newUpdatedUser;
            }
            else {
                return res.status(400).send({ error: "not found this id or name is used" })
            }
        }
        fs.writeFile(fileName, JSON.stringify(arr), (err) => {
            if (!err) return res.send({ massage: "sucess update" })
            res.status(500).send("error");
        });
        console.log(arr);
    });
}
const filterWithAge = (req, res, next) => {
    let arr = [];
    fs.readFile(fileName, { encoding: 'utf8' }, (err, data) => {
        arr = JSON.parse(data);
        if(req.query.age)
        {
            const result = arr.filter(user => user.age == req.query.age)
            console.log(result);
            return res.send(result);
        }
        else
        {
            return res.send(arr);
        }
    });
}
const deleteUser = (req, res, next) => {
    let arr = [];
    fs.readFile(fileName, { encoding: 'utf8' }, (err, data) => {
        arr = JSON.parse(data);
        for (let i = 0; i < arr.length; i++) {
            //console.log(arr);
            if (req.body.id == arr[i].id) {
                arr.splice(i, 1);
                break;
                //arr[i] = newUpdatedUser;
            }
            else {
                return res.status(400).send({ error: "not found this id" })
            }
        }
        fs.writeFile(fileName, JSON.stringify(arr), (err) => {
            if (!err) return res.send({ massage: "sucess delete" })
            res.status(500).send("error");
        });
        console.log(arr);
    });
}
const getUserById = (req, res, next) => {
    let arr = [];
    fs.readFile(fileName, { encoding: 'utf8' }, (err, data) => {
        arr = JSON.parse(data);
        //console.log(arr);
        const result = arr.filter(user => user.id == req.params.id)
        if (result.length < 1) {
            return res.status(400).send({ error: "not found this id" })
        }
        else {
            console.log(result);
            return res.send(result);
        }
    });
}
router.get('/:id', getUserById, (req, res) => {
    debugger
    res.send("sucess get user");
})
router.post('/', validateUser, validateNameAdd, (req, res) => {
    debugger
    res.send("sucess");
    //next();
})
router.patch('/:id', udpateUser, (req, res) => {
    debugger
    res.send("sucess udpate");
})
router.get('/', filterWithAge, (req, res) => {
    debugger
    res.send("sucess filter ");
})
router.delete('/', deleteUser, (req, res) => {
    debugger
    res.send("sucess get user");
})
module.exports = router ;
