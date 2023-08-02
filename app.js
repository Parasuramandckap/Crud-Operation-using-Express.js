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
    let sql = "SELECT * FROM users";
    connection.query(sql, (err, result) => {
        if(err) throw err;
        res.render('user_index', {
            title : 'CRUD Operation using NodeJS / ExpressJS / MySQL',
            users : result
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
        res.redirect("/");
    });
    
})

app.get("/edit/:userId",(req,res)=>{
    let EditId = req.params.userId;
    
    let sql = "SELECT * FROM users WHERE id="+EditId;
    connection.query(sql,(err,result)=>{
        if(err)throw err;
        res.render("user_edit",{
            title:"User Edit page",
            UserEditDetails : result
        })
        
    })
    
})

app.post("/update-user",(req,res)=>{
    let UserId = req.body.id;
    let email = req.body.email;
    let password = req.body.password;
    let sql = "UPDATE users SET email=?,password=? WHERE id = ?";
    connection.query(sql,[email,password,UserId],(err,result)=>{
        if(err) throw err;
        res.redirect("/")
    })
})

app.get("/delete/:userId",(req,res)=>{
    let DeleteId = req.params.userId;
    let sql = "DELETE FROM users WHERE id="+DeleteId;
    connection.query(sql,(err,result)=>{
        if(err)throw err;
        res.redirect("/");
    });
})