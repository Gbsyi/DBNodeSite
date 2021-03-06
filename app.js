const mysql = require('mysql2');
const express = require("express");
const bodyParser = require("body-parser");
const { urlencoded, response } = require('express');
const cookieParser = require("cookie-parser");
const e = require('express');
const { signedCookie } = require('cookie-parser');
const fs = require('fs');
const mysqlPromise = require('mysql2/promise')
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
const poolAsync = mysqlPromise.createPool({
    connectionLimit: 5,
    host: "localhost",
    user: "mysql",
    database: "Lager",
    password: "mysql"
})
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
    let year = new Date();
    pool.query("select * from seasons where year =?",[year.getFullYear()], function(err,seasons){
        if (err) return console.log(err.message);
        pool.query("SELECT * FROM camps", function(err, data) {
            if(err) return console.log(err);
            res.render("choose-camp.hbs", {
                camps: data,
                seasons: seasons
            });
        });
    });
});
app.post('/new-review',urlencodedParser, async (req,res) => {
    let client = req.body.name;
    let review = req.body.review;
    poolAsync.query('INSERT INTO `reviews`(`client`, `review`, `published`) VALUES (?,?,0)',[client,review]);
    res.redirect("/reviews?result=true");
});
app.get('/reviews',function(req,res){
    pool.query('select * from reviews where published = 1',(err,data) =>{
        if(err){
            console.log(err.message);
            return res.render('reviews.hbs');
        }
        res.render('reviews.hbs',{
            reviews:data
        });
    });
})
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
                let year = new Date();
                
                    pool.query("select * from camps where id=?",[camp_id.camp_id],function(err,data){
                        if(err) return console.log(err.message);
                        let dir = 'public/img/camps/' + translit(data[0].name);
                        fs.readdir(dir,function(err,items){
                            if(err) return console.log(err.message);
                            res.render('adminPanel/campPage.hbs',{
                                user_login: userLogin,
                                camp:data[0],
                                dirItems: items,
                                campTName:translit(data[0].name),
                                campID: camp_id.camp_id
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
    let city = req.body.city;
    let descr = req.body.description;
    let descrLong = req.body.descriptionLong;
    let price = req.body.price;
    let campID = req.body.campID;
    let imgPath = req.body.imgPath;
    pool.query("UPDATE `camps` SET `name` = '" + campName
                + "', `img_path` = '"+ imgPath
                + "', `description` = '" + descr
                + "', `description_long` = '" + descrLong
                + "', `city` = '" + city
                + "', `price` = '" + price
                + "' WHERE `camps`.`id` =" + campID, function(err,result){
                    if(err) return console.log(err.message);
                    res.redirect(req.headers.referer);
                });
});

//BOOKING
app.get('/administrator/booking', async function(req,res){
    let nothing;
    userLogin = req.signedCookies['login'];
    aunteficate = new Promise((resolve,reject) =>{
            userId = req.signedCookies['userId'];
            userLogin = req.signedCookies['login'];
            userPassword = req.signedCookies['password'];pool.query("select * from users where id=?",[userId],function(err,loginData){
            if(err) {
                console.log(err.message);
                resolve(false);
            }
            try{
                if(userLogin == loginData[0].user_login && userPassword == loginData[0].user_password){
                    resolve(true);
                }
            }
            catch(e){
                if(e instanceof TypeError){
                    resolve(false)
                }
            }
            resolve(false)
        });
    });  
    let result = await aunteficate;
    if(result){
        //Выводим лагеря
        campsList = await new Promise((resolve,reject) =>{
            pool.query("select `name`, `id` from camps", function(err,data){
                if(err){
                    console.log(err.message)
                    res.render('adminPanel/bookingPage.hbs',{
                        user_login: userLogin
                    });
                    resolve(null);
                }
                resolve(data);
            });
        })
        if(campsList == null){
            return res.render('adminPanel/bookingPage.hbs', {
                user_login: userLogin,
                camps:campsList
            });
        }
        //Берём выбранный лагерь
        let campId = req.cookies['camp'];
        if(campId){
            bookingList = await new Promise((resolve,reject) => {
                pool.query("SELECT booking.id, seasons.name as `season`, children.surname, children.name, children.fathers_name, children.document,"+
                    "DATE_FORMAT(children.birthday,'%d.%m.%Y') as `birthday`, children.contact_way,children.contacts FROM booking INNER JOIN seasons ON seasons.id = seasons_id " 
                    +"INNER JOIN children ON children.id = children_id WHERE camps_id="+campId+" order by seasons.id", function(err,data){
                    if(err){
                        console.log(err.message);
                        res.render('adminPanel/bookingPage.hbs',{
                            user_login: userLogin,
                            camps:campsList
                        });
                        resolve(null);
                    }
                    resolve(data);
                });
            });
            if(bookingList != null){
                res.render('adminPanel/bookingPage.hbs',{
                    user_login: userLogin,
                    camps:campsList,
                    booking: bookingList
                })
            }else{
                res.render('adminPanel/bookingPage.hbs',{
                    user_login: userLogin,
                    camps:campsList
                });
            }
        }
        else{
            res.render('adminPanel/bookingPage.hbs',{
                user_login: userLogin,
                camps:campsList
            });
        }
    }
    else{
        res.redirect('/administratorLogin');
    }
});
app.post('/new-booking', urlencodedParser, async function(req,res){
    let birthday = req.body.birthday;
    let contact = req.body.contact;
    let contactWay = req.body.contactWay;
    let document = req.body.document;
    let surname = req.body.surname;
    let name = req.body.name;
    let fathersName = req.body.fathersName;
    let campId = req.body.campId;
    let season = req.body.season;
    let childId;
    await poolAsync.query("INSERT INTO `children`(`surname`, `name`, `fathers_name`, `document`, `birthday`, `contacts`, `contact_way`)"+
                     " VALUES (?,?,?,?,?,?,?)",[surname,name,fathersName,document,birthday,contact,contactWay]).then(result => childId =result[0].insertId ).catch(err => {
                         console.log(err.message);
                         return;    
                     });
    await poolAsync.query('INSERT INTO `booking`(`camps_id`, `seasons_id`, `children_id`) VALUES (?,?,?)',[campId,season, childId]).catch(err => {
        console.log(err.message);
        return;
    });
    res.redirect('/choose-camp?result=true');
})
app.post('/deny-review', urlencodedParser, async function(req,res){
    let reviewId = req.body.reviewId;
    pool.query('DELETE FROM `reviews` WHERE id = ?',[reviewId], function(err,data){
        if(err){
            console.log(err.message);
            res.redirect('/administrator/reviews');
        }
    });
    res.redirect('/administrator/reviews')
});
app.post('/apply-review',urlencodedParser, async function(req,res){
    let reviewId = req.body.reviewId;
    pool.query("UPDATE `reviews` SET `published` = '1' WHERE id = ? ",[reviewId],function(err,result){
        if(err){
            console.log(err.message);
            res.redirect('/administrator/reviews');
        }
    });
    res.redirect('/administrator/reviews');
});
//REVIEWS
app.get('/administrator/reviews', async function(req,res){
    let nothing;
    userLogin = req.signedCookies['login'];
    let aunteficate = await new Promise((resolve,reject) =>{
        userId = req.signedCookies['userId'];
        userLogin = req.signedCookies['login'];
        userPassword = req.signedCookies['password'];pool.query("select * from users where id=?",[userId],function(err,loginData){
        if(err) {
            console.log(err.message);
            resolve(false);
        }
        try{
            if(userLogin == loginData[0].user_login && userPassword == loginData[0].user_password){
                return resolve(true);
                
            }
        }
        catch(e){
            if(e instanceof TypeError){
                resolve(false)
            }
        }
        resolve(false)
        }); 
    });
    if(aunteficate){
        let unpublishedReviews = await new Promise((resolve,reject) => {
            pool.query('select * from reviews where published = 0',function(err,data){
                if(err){
                    console.log(err.message);
                    return resolve(undefined);
                }
                return resolve(data);
            });
        });
        let publishedReviews = await new Promise((resolve,reject) =>{
            pool.query('select * from reviews where published = 1',function(err,data){
                if(err){
                    console.log(err.message);
                    return resolve(undefined);
                }
                return resolve(data);
            });
        })
        if(unpublishedReviews != nothing){
            if(publishedReviews != nothing){
                res.render('adminPanel/reviews.hbs',{
                    user_login: userLogin,
                    unpublishedReviews: unpublishedReviews,
                    publishedReviews: publishedReviews
                });
            }
            else{
                res.render('adminPanel/reviews.hbs',{
                    user_login:userLogin,
                    unpublishedReviews:unpublishedReviews
                });
            }
        }else{
            res.render('adminPanel/reviews.hbs',{
                user_login:userLogin 
             });
        }
    }else{
        res.redirect('/administratorLogin');
    }
});  

//CHILDREN
app.get('/administrator/children',async (req,res) => {
    let nothing;
    userLogin = req.signedCookies['login'];
    let aunteficate = await new Promise((resolve,reject) =>{
        userId = req.signedCookies['userId'];
        userLogin = req.signedCookies['login'];
        userPassword = req.signedCookies['password'];pool.query("select * from users where id=?",[userId],function(err,loginData){
        if(err) {
            console.log(err.message);
            resolve(false);
        }
        try{
            if(userLogin == loginData[0].user_login && userPassword == loginData[0].user_password){
                return resolve(true);
                
            }
        }
        catch(e){
            if(e instanceof TypeError){
                resolve(false)
            }
        }
        resolve(false)
        }); 
    });
    if(aunteficate){
        let children = await new Promise((resolve,reject) => {
            pool.query("SELECT `id`,`surname`,`name`,`fathers_name`,`document`,DATE_FORMAT(birthday,'%d.%m.%Y') as `birthday`,`contacts`,`contact_way` FROM `children`",(err,data)=>{
                if(err){
                    console.log(err.message);
                    res.render('adminPanel/children.hbs',{
                        user_login:userLogin
                    });
                    resolve(undefined);
                }
                resolve(data)
            })
        });
        if(children != nothing){
            res.render('adminPanel/children.hbs',{
                user_login:userLogin,
                children:children
            })
        }
        else{
            res.render('adminPanel/children.hbs',{
                user_login:userLogin
            });
        }
    }
    else{
        res.redirect('/administratorLogin');
    }
});

//LISTEN
app.listen(8080, function() {
    console.log("Сервер запущен.");
});

