const express = require("express");
require('./db/config')
const User = require('./db/UserSchema');
const Prod = require('./db/ProductSchema');
const cors = require("cors")

const app = express();
app.use(express.json());
app.use(express.static( "public" ));
app.use(cors())
app.post("/register",async (req,res)=>{
    let user = new User(req.body);
    let result = await user.save();
    result = result.toObject();
    delete result.password
    res.send(result);
});
app.post("/login",async(req,res)=>{
    //console.log(req.body)
    if(req.body.email && req.body.password){
    const user = await User.findOne(req.body).select("-password");
    console.log(user)
    if(user){
        res.send(user);
    }else{
        res.send({result:'No User Found'})
    }
}else{
    res.send("No User Found")
}
})

app.post("/add",async (req,res)=>{
let product = new Prod(req.body);
let result = await product.save();
res.send(result);
})

app.get("/",async (req,res)=>{
    let products = await Prod.find();
    if(products.length >0){
        res.send(products);
    }else{
        res.send({result: "no products found"})
    }
})

app.delete("/:id",async (req,res)=>{
    const result = await Prod.deleteOne({_id:req.params.id})
    res.send(result);
})

app.get("/:id",async(req,res)=>{
    const result = await Prod.findOne({_id:req.params.id});
    if(result){
    res.send(result)
    }else{
        res.send({result:"No record found"})
    }
})

app.put("/:id",async(req,res)=>{
    const result = await Prod.updateOne({_id:req.params.id},{
        $set :req.body
    })
    res.send(result);
})

app.get("/search/:key",async (req,res)=>{
    let result = await Prod.find({
        '$or':[
            {name:{$regex : req.params.key}},
            {brand:{$regex : req.params.key}},
            {category:{$regex : req.params.key}},
            {description:{$regex : req.params.key}}
        ]
    })
    res.send(result);
})
app.listen(5004);