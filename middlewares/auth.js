var jwt = require('jsonwebtoken');
const { secret } = require('../serverConfig');


const auth = (req , res , next) =>
{
    const token = req.headers.token;
    //console.log(token);
    try
    {
         req.user = jwt.verify(token , secret);
        //console.log('yes')
        next();
    }
    catch(err)
    {
        console.log(err)
    }
}
module.exports = 
{
    auth
}