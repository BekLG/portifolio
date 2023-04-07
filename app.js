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


const Project= new mongoose.model("project", projectSchema);



app.get("/", function(req,res){
    res.render("home")
})

app.get("/add-project", function(req,res){
    res.render("addProject");
})
app.post("/add-project", function(req,res){

   const title= req.body.title;
   const imageLink= req.body.imgLink;
   const description=req.body.shortDescription;
   const detailedDescription=req.body.detailedDescription;
   const githubLink= req.body.githubLink;
   const demoLink= req.body.demoLink;
    
    const project = new Project({
        title: title,
        imageLink: imageLink,
        description: description,
        detailedDescription: detailedDescription,
        githubLink: githubLink,
        demoLink: demoLink
      });
    
      project.save();
    
      res.redirect("/"); 

})


app.listen(3000, function() {
    console.log("Server started on port 3000.");
});