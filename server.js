const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const morgan = require('morgan');
const User = require('./bd/user');

const app = express();

app.set('port', 9000);



app.use(morgan('dev'));

app.use(bodyParser.urlencoded({ extended:true }));

app.use(cookieParser());

app.use(express.static('public'));





const sessionChecker = (req, res, next) => {
  if(req.session.user && req.cookies.user_sid){
    res.redirect('/cabinet');
  } else {
    next();
  }
};



app.get('/', (req,res) => {
  res.redirect('/main');
});

app.route('/main').get((req,res) => {
  res.sendFile(__dirname + '/public/main.html');
})



app.get('/cabinet', (req,res)=> {
 
    res.sendFile(__dirname + '/public/cabinet.html')

})

app.route('/signup').get((req,res) => {
  res.sendFile(__dirname + '/public/signup.html');
})

app.route('/signup').post((req,res)=> {
  let old = req.body.years;

  if (old < 18) {res.redirect('/signup')} else {

    User.create({
      username: req.body.username,
      email:req.body.email,
      password: req.body.password,
      years: req.body.years
    }).then(user => {
    
      res.redirect('/cabinet');
    }).catch(error => {res.redirect('/signup')})

  }

});


  app.get('/logout', (req, res) => {
  
      res.redirect('/signup');
   
  });

  app.use(function(req,res,next){
    res.status(404).send("Sorry cannot find that !")
  })

  app.listen(app.get('port'), () => console.log(`App started on port ${app.get('port')}`));