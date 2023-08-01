const path = require('path');
const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const app = express();
const mysql = require('mysql');



// Server Listening
app.listen(3000, () => {
    console.log('Server is running at port 3000');
});

// app.set('views',path.join(__dirname,'views'));
 
//set view engine
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const connection=mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'test'
});
 
connection.connect(function(error){
    if(!!error) console.log(error);
    else console.log('Database Connected!');
}); 


app.get('/',(req, res) => {
    // res.send('CRUD Operation using NodeJS / ExpressJS / MySQL');
    let sql = "SELECT * FROM users";
    connection.query(sql, (err, rows) => {
        if(err) throw err;
        res.render('user_index', {
            title : 'CRUD Operation using NodeJS / ExpressJS / MySQL',
            users : rows
        });
    });
});

app.get("/add-page",(req,res)=>{
    res.render("add_user",{ title : 'User Add Page',})
})

app.post("/save-user",(req,res)=>{
    let email = req.body.email;
    let password = req.body.password;

    var sql = `INSERT INTO users (email,password)VALUES(?, ?)`;
    connection.query(sql, [email,password], function (err, data) {
        if (err) throw err;
    });
    res.redirect("/");
})

app.get("/edit/:userId",(req,res)=>{
    let EditId = req.params.userId;
    let sql = `SELECT * FROM users WHERE id=${EditId}`;
    connection.query(sql,(err,result)=>{
        if(err) throw err;
        res.render("user_edit",{title:"user edit page",userDetials:result})
    })
})

