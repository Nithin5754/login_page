
const fs = require('fs')
const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const { v4: uuidv4 } = require('uuid');
const noChaChe = require('nocache');
const path = require('path');


const app = express();
const port = 3000;



app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(noChaChe())


// Initialize session
app.use(session({
  secret: uuidv4(),
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 360000 }

}));

//custom mildlewa


const USERNAME = 'nithin0756';
const PASSWORD = "12345"


function authenticate(req, res, next) {

  if (req.session.data) {

    next();
  } else {

    res.redirect('/login');
  }
}





app.post('/login', (req, res) => {

  const { username, password } = req.body;
  req.session.enteredUsername = username;
  if (USERNAME == username && PASSWORD == password) {

    req.session.data = username;
    // req.session.errorMessage='';
    //home
    res.redirect("/home")
  } else {


    if (username.trim() === '' && password.trim() === '') {
      req.session.errorMessage = 'must fill form';
    }

    else if (USERNAME != username && PASSWORD != password) {
      req.session.errorMessage = "incorrect username and password"
    }
    else if (USERNAME != username) {



      req.session.errorMessage = 'Incorrect username ';
    } else if (PASSWORD != password) {
      req.session.errorMessage = 'Incorrect  password';
    }
    req.session.invalid = true
    res.redirect('/login')
  }



});


app.get('/login', (req, res) => {
  if (req.session.data) {
    res.redirect('/')
  } else if (req.session.invalid) {
    req.session.invalid = false;

    res.render('login', { msg: req.session.errorMessage || '', enteredUsername: req.session.enteredUsername || '' })
  } else {
    res.render('login')
  }
})

app.get('/', authenticate, (req, res) => {


  res.render('home', { USERNAME });
});

// //home
app.get('/home', authenticate, (req, res) => {


  res.render('home', { USERNAME });
});


app.get('/logout', authenticate, (req, res) => {

  req.session.destroy();
  res.redirect('/');
});


// cards section 
app.get('/cards', authenticate, (req, res) => {
  fs.readFile(path.join(__dirname, 'data', 'db.json'), 'utf-8', (err, data) => {
    if (err) {
      console.log(err);
      return;
    } else {
      const dogJson = JSON.parse(data);
      res.render('card', { dogJson })
    }


  })

})


// error 404
app.get('*', (req, res) => {
  console.log(8);
  res.status(404).send('404');
});

// create server

app.listen(port, () => {

  console.log(`Server started on http://localhost:${port}`);
});






