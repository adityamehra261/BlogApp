var express=require("express");
var mongoose   =require("mongoose");
var bodyParser =require("body-parser");
var methodOverride=require("method-override");
var expressSanitizer=require("express-sanitizer");
var http=require("http");
const { sanitize } = require("sanitizer");
const { request } = require("http");
const e = require("express");

var app=express();

app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));
mongoose.connect("mongodb://localhost/BlogApp", {useNewUrlParser: true, useUnifiedTopology: true});

var BlogSchema=new mongoose.Schema({
    name:String,
    image:String,
    body:String,
    dateCreate:{type:Date, default:Date.now}
});

var Blog=mongoose.model("Blog",BlogSchema);

app.get("/",function(req,res){
    res.redirect("/blogs");
})

app.get("/blogs",function(req,res){
    Blog.find({},function(err,bolgdata){
        if(err){
            console.log("Errror");
        }
        else{
            res.render("index",{blogs:bolgdata});
        }
    })
});

app.get("/blogs/new",function(req,res){
    res.render("new");
});

app.post("/blogs",function(req,res){
    req.body.blog.body=sanitize(req.body.blog.body);
    Blog.create(req.body.blog,function(err,newblog){
        if(err){
            console.log("error");
        }
        else{
            res.redirect("/blogs");
        }
    });
});

app.get("/blogs/:id",function(req,res){
    var x=req.params.id;
    Blog.findById(x,function(err,blogs){
        res.render("show",{blogs:blogs});
    })
});

app.get("/blogs/:id/edit",function(req,res){
    Blog.findById(req.params.id,function(err,foundBlog){
        if(err){
            res.redirect("/blogs");
        }
        else{
            res.render("edit",{blog:foundBlog});
        }
    })
});

app.put("/blogs/:id",function(req,res){
    req.body.blog.body=sanitize(req.body.blog.body);  
    Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updateBlog){
        if(err){
            res.redirect("/blogs");
        }
        else{
            res.redirect("/blogs/"+req.params.id);
        }
    })
})

app.delete("/blogs/:id",function(req,res){
    Blog.findByIdAndRemove(req.params.id,function(err){
        if(err){
            res.redirect("/blogs");
        }
        else{
            res.redirect("/blogs");
        }
    })
})

app.listen(3000,function(req,res){
    console.log("BlogApp Started...");
});




