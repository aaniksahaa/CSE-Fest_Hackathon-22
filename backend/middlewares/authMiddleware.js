const jwt=require('jsonwebtoken');
const Users=require('../models/users');

const requireAuth = (req,res,next) => {
    const token = req.cookies.jwt;
    if(token) {
        console.log('token found');
        jwt.verify(token, 'secret text',(err, decodedToken) => {
            if(err) {
                console.log(err.message);
                res.redirect('/login.html');
            }
            else {
                console.log(decodedToken);
                next();
            }
        });
    } 
    else {
        res.redirect('/login.html');
    }
}
const checkUser = (req,res,next) => {

    const mindiff = 2000;

    const token = req.cookies.jwt;
    if(token) {
        console.log('token found');
        jwt.verify(token, 'secret text',async (err, decodedToken) => {
            if(err) {
                console.log(err.message);
                res.locals.user = null;
                next();
            }
            else {
                console.log(decodedToken);
                let user = await Users.findById(decodedToken.id);
                console.log(user);
                res.locals.user = user;
                let diff = Date.now() - user.lastcall
                console.log("diff = " + diff.toString())
                if(diff<mindiff)
                {
                    console.log("Limit exceeded");
                    res.locals.user = null;
                    console.log("Limit exceeded");
                    res.send('Error');
                    return;
                }
                else
                {
                    console.log("OK")
                    let doc = await Users.findOneAndUpdate({_id : decodedToken.id}, {lastcall : Date.now()});
                    next();
                }
            }
        });
    }
    else {
        res.locals.user = null;
        console.log("Checkuser says no user found");
        next();
    }
}
module.exports = { requireAuth,checkUser } 