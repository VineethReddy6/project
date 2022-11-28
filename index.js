const mongoClient = require("mongodb").MongoClient;
const jwt = require("jsonwebtoken");
const express = require("express");
const { ConnectionClosedEvent } = require("mongodb");
const app = express();
const cors = require("cors");
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

mongoClient.connect("mongodb://localhost:27017", (err, client) => {
    if (err) {
        console.log("Error");
    }
    else {
        db = client.db("projectdb");
    }
});
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/client/home.html");
});
app.get("/studentlogin", (req, res)=>{
    res.sendFile(__dirname + "/client/studentlogin.html");
});
app.get("/facultylogin", (req, res)=>{
    res.sendFile(__dirname + "/client/facultylogin.html");
});
app.get("/projectform", (req,res)=> {
    res.sendFile(__dirname+"/client/projectform.html");
});
app.get("/evaluate", (req, res)=> {
    res.sendFile(__dirname+"/client/evaluate.html");
});
app.get("/projects", (req, res)=> {
        db.collection("projects").find().toArray((err, items) => {
            if (err) { }
            res.send(items);
        });
});
app.get("/results", (req, res)=> {
    res.sendFile(__dirname+"/client/results.html");
});
app.get("/marks", (req, res)=> {
    db.collection("results").find().toArray((err, items) => {
        if (err) { }
        res.send(items);
    });
});
app.post("/loginstu", (req, res) => {
    const user = req.body.username;
    const pass =parseInt(req.body.password);
    // console.log(user +" " + pass);
    db.collection("students").find({ "username": user, "password": pass }).toArray((err, item) => {
        console.log(item);
        if (err) { }
        if (item.length != 0) {
            const token = jwt.sign(
                {
                    "username": user
                },
                "keyVineeth"
            );

            res.json({
                success: true,
                token: token
            });
        }
        else {
            res.json({
                success: false,
                message: "Authentication Unsuccessful",
            });
        }
    })
});
app.post("/addproject", (req, res)=> {
    db.collection("projects").insertOne({
        project: req.body.project,
        teamleader : req.body.teamleader,
        teammates : req.body.teammates,
        link : req.body.link
    });
    console.log("inserted successfully");
    res.end();
});
app.post("/addmarks", (req, res) => {
    db.collection("results").find({project:req.body.project}).toArray((err, item)=> {
        if(item.length != 0) {
            db.collection("results").updateOne(
                {project: req.body.project},{$set:{marks:req.body.marks}}
           );
        }
        else {
            db.collection("results").insertOne({
                project: req.body.project,
                marks:req.body.marks
           });
        }
    })
   
   console.log("inserted successfully");
    res.end();
});
app.post("/loginfac", (req, res) => {
    const user = req.body.username;
    const pass =parseInt(req.body.password);
    // console.log(user +" " + pass);
    db.collection("faculty").find({ "username": user, "password": pass }).toArray((err, item) => {
        console.log(item);
        if (err) { }
        if (item.length != 0) {
            const token = jwt.sign(
                {
                    "username": user
                },
                "keyVineeth"
            );

            res.json({
                success: true,
                token: token
            });
        }
        else {
            res.json({
                success: false,
                message: "Authentication Unsuccessful",
            });
        }
    })
});
app.listen(5000, () => console.log("server started"));


