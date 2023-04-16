require("dotenv").config();
const express = require("express");
const ejs= require("ejs");
const bodyParser= require("body-parser");
const mongoose= require("mongoose");
const lodash= require("lodash");
const session= require("express-session");
const bcrypt= require("bcrypt");

const app= express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false
}));

const dbUsername= process.env.DB_USERNAME;
const dbPassword= process.env.DB_PASSWORD;
mongoose.connect("mongodb+srv://" + dbUsername + ":" + dbPassword + "@cluster0.uscnzob.mongodb.net/myProjectsDB", {useNewUrlParser: true});


const adminSchema = new mongoose.Schema({
    email: { type: String, unique: true },
    password: String
  });

const Admin= new mongoose.model("Admins", adminSchema);
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
    Project.find({})
    .then((foundProjectArray)=>{
        res.render("home", { foundProjects: foundProjectArray })
    })
    .catch((err)=>{
        console.log(err);
    })
})
app.get("/admin", function(req,res){

    if(req.session.isLoggedIn === true)
    {
        Project.find({})
        .then((foundProjectArray)=>{
            res.render("adminPage", { foundProjects: foundProjectArray })
        })
        .catch((err)=>{
            console.log(err);
        })
    }
    else
    {
        res.redirect("/login");
    }
})

app.post("/delete", function(req,res){
    const projectId= req.body.projectId;
    Project.findByIdAndDelete(projectId)
    .then(() => {
      console.log("project deleted successfully.");
    })
    .catch((err) => {
      console.error(err);
    });
    res.redirect("/admin")
})

app.post("/editProject", function(req,res){ 

    const projectId= req.body.projectId;
    Project.findById(projectId)
    .then((foundProject)=>{
        const title= foundProject.title;
        const imageLink= foundProject.imageLink;
        const description=foundProject.description;
        const detailedDescription=foundProject.detailedDescription;
        const githubLink= foundProject.githubLink;
        const demoLink= foundProject.demoLink;

        res.render("editProject",
        { 
            projectId: projectId,
            title: title,
            imageLink: imageLink,
            description: description,
            detailedDescription: detailedDescription,
            githubLink: githubLink,
            demoLink: demoLink
        })
    })
    .catch((err)=>{
        console.log(err);
    })
})

app.get("/addProject", function(req,res){
   
    if(req.session.isLoggedIn === true)
    {
        res.render("addProject");
    }
    else
    {
        res.redirect("/login");
    }
})
app.post("/addProject", function(req,res){

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

app.post("/updateProject", function(req,res){
    const id= req.body.projectId;
    const title= req.body.title;
    const imageLink= req.body.imgLink;
    const description=req.body.shortDescription;
    const detailedDescription=req.body.detailedDescription;
    const githubLink= req.body.githubLink;
    const demoLink= req.body.demoLink;

    const query = { _id: id };
    Project.findOneAndUpdate(query, { 
        title: title,
        imageLink: imageLink,
        description: description,
        detailedDescription: detailedDescription,
        githubLink: githubLink,
        demoLink: demoLink
     })
     .then(()=>{
        console.log(title + " has been updated succesfully");
        res.redirect("/admin");
     })
     .catch((err)=>{
        console.log(err);
     })       
})
app.get("/login",function(req,res){
    res.render("login");
})

app.post("/login", function(req, res) {
    const username = req.body.username;
    const password = req.body.password;
  
    Admin.find({email: username})
      .then((foundAdmin) => {
        if (foundAdmin.length === 0) {
          console.log("no admins found!");
          res.redirect('/login');
        } else {
          const storedHashedPassword = foundAdmin[0].password;
          bcrypt.compare(password, storedHashedPassword, (err, result) => {
            if (err || !result) {
              // Invalid login credentials, redirect to login page
              console.log("password didnt match");
              res.redirect('/login');
            } else {
              // Valid login credentials, set session variable to indicate that the user is logged in
              req.session.isLoggedIn = true;
              // Redirect to dashboard
              res.redirect('/admin');
            }
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  });

app.post("/:projectTitle", function(req,res){
    
    const projectTitle= req.params.projectTitle;
    Project.find({title: projectTitle})
    .then((foundProject)=>{
        if(foundProject.length===0)
        {
            console.log("no projects found!");
        }
        else{
            res.render("detailedProject",
             {
                 title: foundProject[0].title,
                 imageLink: foundProject[0].imageLink,
                 detailedDescription: foundProject[0].detailedDescription,
                 githubLink: foundProject[0].githubLink,
                 demoLink: foundProject[0].demoLink,
            });
        }
    })
    .catch((err)=>{
        console.log(err);
    })
})

app.listen(process.env.PORT || 5000, function(req,res) {
    console.log("Server started.");
    Admin.find({email: process.env.EMAIL_1})
    .then((foundAdmin)=>{
        if(foundAdmin.length===0)
        {
            console.log("no admin found!");
            const password= bcrypt.hashSync(process.env.PASSWORD_1,10);
            const admin= new Admin({
                email: process.env.EMAIL_1,
                password: password,
            })
            admin.save();
            console.log(password);
        }
        else{
            console.log("admin found!");
        }
    })
    .catch((err)=>{
        console.log(err);
    })           
});
