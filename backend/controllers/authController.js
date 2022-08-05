const mongoose = require("mongoose");
const Users = mongoose.model('users');
const jwt=require('jsonwebtoken');

const handleErrors = (err) => {
  console.log(err.message,err.code);
  let errors = {email: '', password: ''};
  if(err.code === 11000) {
    errors.email='email is already registered';
    return errors;
  }
  if(err.message==='incorrect password') {

  }
  if(err.message==='incorrect email') {

  }
  if(err.message.includes('failed')) {
    Object.values(err.errors).forEach(({properties})=>{
      errors[properties.path] = properties.message;
    })
  }
  return errors;
}
const createToken = (id) => {
  return jwt.sign({id},'secret text', {
    expiresIn: 3*24*60*60
  })
};

module.exports.signup_get = (req, res) => {
  res.render('signup');
}

module.exports.login_get = (req, res) => {
  res.render('login');
}

module.exports.signup_post = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await Users.create({ email, password , count : 0, lastcall: Date.now()});
    console.log(user)
    const token = createToken(user._id);
    res.cookie('jwt',token, { httpOnly: false, maxAge: 3*24*60*60*1000});
    res.status(201).json({user: user._id });
  }
  catch(err) {
    const errors=handleErrors(err);
    res.status(400).json(errors);
  }
}

module.exports.login_post = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await Users.login(email,password);
    const token = createToken(user._id);

    res.cookie('jwt',token, { httpOnly: false, maxAge: 3*24*60*60*1000});
   
    res.status(201).json({user: user._id });
  }
  catch(err) {
    const errors  = handleErrors(err);
    res.status(400).json(errors);
  }
  //res.send('user login');
}
module.exports.logout_get = (req, res) => {
  res.cookie('jwt','',{maxAge: 1});
  res.redirect('/');
}

module.exports.blank = (req, res) => {
  res.send(":)");
}