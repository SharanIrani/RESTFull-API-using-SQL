const express=require("express");

const app=express();

app.set("view engine","ejs");



app.use(express.urlencoded({extended:true}));

//const { faker } = require('@faker-js/faker');

const mysql = require('mysql2');

var methodOverride = require('method-override')
app.use(methodOverride('_method'))


const { v4: uuidv4 } = require('uuid');



const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'delta_app',
  password:"sharan3301"
});



const port = process.env.PORT || 3000;


app.listen(port,(req,res)=>{
    console.log(`App listening in port :${port}`);
})

app.get("/users",(req,res)=>{

    let q="select count(*) from user"
    connection.query(q,function (err, results) {
        let users=results[0]["count(*)"];
        res.render("home.ejs",{users});
      }
    );
})



app.get("/user",(req,res)=>{

    let q="select id,username,email,password from user"
    connection.query(q,function (err, results) {
        res.render("allUsers",{results});
      }
    );
})


app.get("/user/:id/edit",(req,res)=>{
  let {id}=req.params;
  let q=`select * from user where id='${id}'`
    connection.query(q,function (err, results) {
        let indiUser=results[0];
        res.render("edit.ejs",{indiUser});
      }
    );
  
})




app.patch("/user/:id",(req,res)=>{
  let {id}=req.params;
  let q=`select * from user where id='${id}'`
    connection.query(q,function (err, results) {
        let indiUser=results[0];
        let {username:newUser,password:formPass}=req.body;
        if (indiUser.password==formPass){
          let q2=`update user set username='${newUser}' where id='${id}'`
          connection.query(q2,function (err, results) {
            res.redirect("/user");
          })
        }
      else{
        res.send("error");
      }})
      }
    )



app.delete("/user/:id",(req,res)=>{
  let {id}=req.params;
  let q=`select * from user where id='${id}'`
    connection.query(q,function (err, results) {
        let indiUser=results[0];
        let {password:formPass}=req.body;
        if (indiUser.password==formPass){
          let q2=`delete from user where id='${id}'`
          connection.query(q2,function (err, results) {
            res.redirect("/user");
          })
        }
      else{
        res.send("error");
      }})

})





app.get("/user/:id/delete",(req,res)=>{
  let {id}=req.params;
  let q=`select * from user where id='${id}'`
  connection.query(q,function (err, results) {
    let indiUser=results[0];
    res.render("delete.ejs",{indiUser});
  }
);
})
  




app.get("/user/new",(req,res)=>{
  res.render("new.ejs");
})


app.post("/user",(req,res)=>{
  let id=uuidv4();
  let {email,username,password}=req.body;
  let q=`insert into user (id,email,username,password) values ('${id}','${email}','${username}','${password}')`;

  connection.query(q,function (err, results) {
      res.redirect("/user");
    }
  );
})
