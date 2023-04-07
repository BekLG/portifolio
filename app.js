const express = require("express");
const ejs= require("ejs");
const bodyParser= require("body-parser");
const mongoose= require("mongoose");

const app= express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1:27017/myProjectsDB", {useNewUrlParser: true});


const projectSchema= new mongoose.Schema({
    title: String,
    imageLink: String,
    description: String,
    detailedDescription: String,
    githubLink: String,
    demoLink: String
});


const project= new mongoose.model("Project", projectSchema);



app.get("/", function(req,res){
    res.render("home")
})

app.get("/add-project", function(req,res){
    res.render("addProject");
})


app.listen(3000, function() {
    console.log("Server started on port 3000.");
});