const mysql = require('mysql2');
const express = require("express");
const bodyParser = require("body-parser");
const { urlencoded } = require('express');
const cookieParser = require("cookie-parser");
const e = require('express');
const { signedCookie } = require('cookie-parser');
const fs = require('fs');
//file
let fileUpload = require('express-fileupload');
const app = express();
var path = require('path');
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser('secret'));
//file
app.use(fileUpload({}));

const urlencodedParser = bodyParser.urlencoded({extended:false});
const pool = mysql.createPool({
    connectionLimit: 5,
    host: "localhost",
    user: "mysql",
    database: "Lager",
    password: "mysql"
});

const connection = mysql.createConnection({
    host: "localhost",
    user: "mysql",
    database: "Lager",
    password: "mysql"
});

connection.connect(function(err) {
    if(err){
        return console.error("Error" + err.message);
    }
    else{
        console.log("MySql подключен");
    }
});

function translit(text) {
    return text.replace(/([а-яё])|([\s_-])|([^a-z\d])/gi,
        function (all, ch, space, words, i) {
            if (space || words) {
                return space ? '-' : '';
            }
            var code = ch.charCodeAt(0),
                index = code == 1025 || code == 1105 ? 0 :
                    code > 1071 ? code - 1071 : code - 1039,
                t = ['yo', 'a', 'b', 'v', 'g', 'd', 'e', 'zh',
                    'z', 'i', 'y', 'k', 'l', 'm', 'n', 'o', 'p',
                    'r', 's', 't', 'u', 'f', 'h', 'c', 'ch', 'sh',
                    'shch', '', 'y', '', 'e', 'yu', 'ya'
                ]; 
            return t[index];
        }
    );
}

app.set("view engine", "hbs");

app.get("/", function(req, res){
    res.render("index.hbs")
});

app.get("/search", function(req,res) {
   res.render("search.hbs"); 
});
app.post("/search", urlencodedParser, function(req,res) {
    if(!req.body) return res.sendStatus(400);
    const camp = req.body.camp;
    pool.query("SELECT * FROM camps WHERE name=?",[camp], function(err,data) {
        if(err) return console.log(err.message);
        res.render("search.hbs", {
            result: data
        });
     });
});
app.get("/about", function(req,res){
    res.render("about.hbs");
});
app.get("/choose-camp", function(req,res){
    pool.query("SELECT * FROM camps", function(err, data) {
        if(err) return console.log(err);
        res.render("choose-camp.hbs", {
            camps: data
        });
      });
});
app.get("/contacts", function(req,res){
    res.render("contacts.hbs");
   
});

app.get('/camp/:camp_id', function(req,res){
    let camp_id = req.params;
    pool.query("SELECT * FROM camps WHERE id=?",[camp_id.camp_id], function(err,data){
        if(err) return console.log(err.message);
        if(data.length == 0){
            res.render("404.hbs");
            return;
        }
        res.render("camp-page.hbs",{
            result: data
        });
    });
});

//ADMIN
app.get("/administratorLogin", function(req,res){
    res.render("adminPanel/administratorLogin.hbs");
});
app.get("/administrator", function(req,res){
    userId = req.signedCookies['userId'];
    userLogin = req.signedCookies['login'];
    userPassword = req.signedCookies['password'];
    if(userId != undefined){
        pool.query("select * from users where id=?",[userId],function(err,loginData){
            let isLogged = false;
            if(userLogin == loginData[0].user_login && userPassword == loginData[0].user_password){
                isLogged = true;
            }
            if(isLogged){
                let newRevs = 0;
                pool.query("SELECT COUNT(*) AS 'count' FROM reviews WHERE published = 0", function(err,count){
                    newRevs = count[0].count;
                    res.render("adminPanel/administratorMenu.hbs",{
                        user_id: userId,
                        user_login: userLogin,
                        user_password: userPassword,
                        newReviews: newRevs
                    });
                });
                
            }else{
                res.redirect("/administratorLogin");
            }
        });
    }
    else
    {
        res.redirect("/administratorLogin");
    }

});

app.post("/administratorLogin", urlencodedParser, function(req,res){
    if(!req.body) return res.sendStatus(400);
    let login = req.body.login;
    let password = req.body.password;
    let userId;
    console.log("\n\nАвторизация:");
    console.log("Введённый логин:", login, "\nВведённый пароль", password);
    pool.query("SELECT * FROM users", function(err,data){
        console.log("Считал данные из бд")
        if(err){
            console.log("Error: " + err.message);
        }
        data.forEach(element => {
            console.log(login, "?", element.user_login,"    ",password,"?", element.user_password);
            if(element.user_password == password && element.user_login == login){
                userId = element.id; 
                founded = true;
            }             
        });
        if(founded){
            res.cookie('login',login, {
                secure: true,
                signed: true
            });
            res.cookie('password', password,{
                secure:true,
                signed: true
            });
            res.cookie('userId',userId,{
                secure:true,
                signed:true
            })            
            res.redirect("/administrator");
        }
        else{
            res.redirect("/administratorLogin",{
                error: true
            });
        }
    });
    
});

//Добавление лагеря
app.post("/administrator/new-camp", urlencodedParser, function(req,res){
    let campEngName =translit(req.body.name);
    let campName = req.body.name;
    let pictureName = req.files.picture.name;
    let city = req.body.city;
    let descr = req.body.description;
    let descrLong = req.body.descriptionLong;
    let price = req.body.price;
    if(!fs.existsSync('public/img/camps/'+campEngName)){
        console.log('\nСоздаём');
        fs.mkdirSync('public/img/camps/'+campEngName);
    }
    req.files.picture.mv('public/img/camps/'+campEngName+'/'+pictureName);
    let imgPath ='/img/camps/'+campEngName+'/'+pictureName;
    pool.query("INSERT INTO `camps`(`name`, `img_path`, `description`, `description_long`, `city`, `price`)" 
                + "VALUES ('"+campName+"','"+imgPath+"','"+descr+"','"+descrLong+"','"+city+"','"+price+"')",function(err,result){
                    if(err) throw err;
                    res.redirect('/administrator');
                });
});

//Смена пароля
app.post('/administrator/newPass', urlencodedParser, function(req,res){
    oldPass = req.body.oldPassword;
    newPass = req.body.newPassword;
    userId = req.signedCookies['userId'];
    userPassword = req.signedCookies['password'];
    console.log(oldPass, "?", userPassword)
    if(oldPass == userPassword){
        pool.query("UPDATE users SET user_password = '"+newPass+"' WHERE users.id = "+userId,function(err,result){
            if(err) throw err;
            console.log("Пароль сменён");
            res.cookie('password',newPass,{
                secure:true,
                signed:true
            })
            res.redirect(req.headers.referer);
        });
    }
});

//USERS
app.get("/administrator/users", function(req,res){
    userId = req.signedCookies['userId'];
    userLogin = req.signedCookies['login'];
    userPassword = req.signedCookies['password'];
    if(userId != undefined){
        pool.query("select * from users where id=?",[userId],function(err,data){
            if(userLogin == data[0].user_login && userPassword == data[0].user_password){
                pool.query("select * from users", function(err,selectData){
                    if(err) throw err;
                    res.render("adminPanel/users.hbs",{
                        users:selectData,
                        user_id: userId,
                        user_login: userLogin,
                        user_password: userPassword
                    });
                });
            }
        });
    }
    else
    {
        res.redirect("/administratorLogin");
    }
});
app.post('/administrator/users', urlencodedParser, function(req,res){
    if(!req.body)   return res.sendStatus(400);
    let login = req.body.newUserLogin;
    let password = req.body.newUserPassword;
    let userId;
    pool.query("INSERT INTO `users`( `user_login`, `user_password`) VALUES ('"+login+"','"+password+"')", function(err,result){
        if(err) throw err;
        res.redirect('/administrator/users');
    })
});

//CAMPS
app.get('/administrator/camps',function(req,res){
    userId = req.signedCookies['userId'];
    userLogin = req.signedCookies['login'];
    userPassword = req.signedCookies['password'];
    if(userId != undefined){
        pool.query("select * from users where id=?",[userId],function(err,data){
            if(userLogin == data[0].user_login && userPassword == data[0].user_password){
                //Загрузка страницы 
                pool.query('select * from camps',function(err,campsData){
                    if(err) throw err;
                    res.render("adminPanel/camps.hbs",{
                        camps: campsData,
                        user_id: userId,
                        user_login: userLogin,
                        user_password: userPassword
                    });
                })
                
            }
        });
    }
    else
    {
        res.redirect("/administratorLogin");
    }
});
//EDIT CAMP
app.get('/administrator/camp/:camp_id', function(req,res){
    let camp_id = req.params;
    userId = req.signedCookies['userId'];
    userLogin = req.signedCookies['login'];
    userPassword = req.signedCookies['password'];
    if(userId != undefined){
        pool.query("select * from users where id=?",[userId],function(err,loginData){
            let isLogged = false;
            if(userLogin == loginData[0].user_login && userPassword == loginData[0].user_password){
                isLogged = true;
            }
            if(isLogged){
                pool.query("select * from camps where id=?",[camp_id.camp_id],function(err,data){
                    if(err) return console.log(err.message);
                    let dir = 'public/img/camps/' + translit(data[0].name);
                    fs.readdir(dir,function(err,items){
                        if(err) return console.log(err.message);
                        res.render('adminPanel/campPage.hbs',{
                            user_login: userLogin,
                            camp:data[0],
                            dirItems: items,
                            campTName:translit(data[0].name)
                        });
                    });
                    
                });
                
            }else{
                res.redirect("/administratorLogin");
            }
        });
    }
});

app.post('/administrator/editCamp',urlencodedParser, function(req,res){
    let campEngName =translit(req.body.name);
    let campName = req.body.name;
    let pictureName = req.files.picture.name;
    let city = req.body.city;
    let descr = req.body.description;
    let descrLong = req.body.descriptionLong;
    let price = req.body.price;
    pool.query("")
});
//LISTEN
app.listen(8080, function() {
    console.log("Сервер запущен.");
});

