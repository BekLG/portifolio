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

    Project.find({})
    .then((foundProjectArray)=>{
        res.render("home", { foundProjects: foundProjectArray })
    })
    .catch((err)=>{
        console.log(err);
    })

})
app.get("/admin", function(req,res){
    Project.find({})
    .then((foundProjectArray)=>{
        res.render("adminPage", { foundProjects: foundProjectArray })
    })
    .catch((err)=>{
        console.log(err);
    })
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
    
        console.log(title);

    })
    .catch((err)=>{
        console.log(err);
    })

   
   
  

})

app.get("/addProject", function(req,res){
    res.render("addProject");
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


app.listen(3000, function() {
    console.log("Server started on port 3000.");
});