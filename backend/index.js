const express = require("express");
const axios = require('axios');
const queryString = require('querystring');
require('./db/config')
const User = require('./db/UserSchema');
const Prod = require('./db/ProductSchema');
const Discount = require('./db/DiscountSchema');
const Order = require('./db/OrderSchema');
const ProdOrder = require('./db/ProductOrderSchema');
const Shipping = require('./db/ShippingSchema');
const Stock = require('./db/StockSchema');
const Supplier = require('./db/SupplierSchema');
const Supplying = require('./db/SupplyingSchema');
const Transaction = require('./db/TransactionSchema');
const Warehouse = require('./db/WarehouseSchema');
const Address = require('./db/AddressSchema');
const Shipper = require('./db/ShipperSchema')
const cors = require("cors");
const ProductOrderSchema = require("./db/ProductOrderSchema");
const OrderSchema = require("./db/OrderSchema");
const FeedbackSchema = require("./db/FeedbackSchema");
const app = express();
app.use(express.json());
app.use(express.static( "public" ));
app.use(cors())

//Register API
app.post("/register",async (req,res)=>{
    let user = new User(req.body);
    let result = await user.save();
    result = result.toObject();
    delete result.password
    res.send(result);
});
app.get("/navbar/:id",async(req,res)=>{
    let user = await User.findOne({_id:req.params.id});
    res.send(user);
});
// Login API
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

app.post("/feedback",async(req,res)=>{
    let feedback = new FeedbackSchema(req.body);
    console.log(req.body)
    let result = await feedback.save();
    if(result) res.send(result)
})

app.get('/product/:productId/feedback', async (req, res) => {
    try {
        const productId = req.params.productId;
        // Query your database to fetch feedback for the specified product ID
        const feedback = await FeedbackSchema.find({ productId });
        console.log(feedback)
        res.send(feedback);
    } catch (error) {
        console.error('Error fetching feedback:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Adding products API
app.post("/add",async (req,res)=>{
    console.log(req.body);
let result = await Prod.findOne({name:req.body.name});
let warehouse = await Warehouse.findOne({capacity: {$gte:1}});
let product = new Prod(req.body);
console.log(warehouse)

if(result){
    if(warehouse){
    let supplier = await Supplier.findOne({name:req.body.supplier});
    if(!supplier){
        const supp = {
            name : req.body.supplier
        }
        let sup = new Supplier(supp);
        let b = await sup.save();
    }
    let supplier1 = await Supplier.findOne({name:req.body.supplier})
    const js = {
        "supplierId":supplier1.id,
        "product": req.body.name,
        "orderedAt": new Date(),
        "arrivedAt":new Date()+10,
        "arrived":1
    }
    let supplying = new Supplying(js);
    await supplying.save();
    let r = await Stock.findOne({"product":req.body.name});
    //console.warn(r.quantity + 1);
    let a = await Warehouse.updateOne({"id":warehouse.id},{$set:{"capacity":warehouse.capacity -1}});
    console.log(a);
    let stock = await Stock.updateOne({"product":r.product},{$set:{"quantity": r.quantity + 1,"updatedAt":new Date()}
    });
    console.warn(stock) 
}else{
    res.send("No more space available");
}
}else{  
let i=0;
let res = await Warehouse.updateOne({"id":warehouse.id},{$set:{"capacity":warehouse.capacity -1}});
console.log(res);
let js = {
    "product": req.body.name,
    "quantity": 1,
    "updatedAt": new Date(),
    "createdAt": new Date(),
    "warehouseId": warehouse.id
  };
let stock = new Stock(js);
console.log(stock);
console.log(product);
await stock.save();
}
await product.save();
//res.send(result);
});

app.get("/supplier",async (req,res)=>{
    let result = await Supplying.find();
    let r = await Supplier.find().select("-id");
    let con = result.concat(r);
    if(result){
        res.send(con);
    }else{
        res.send({"reply":"No supplier found"});
    }
});

app.get("/analysis",async (req,res)=>{
    const prod = await Prod.find();
    res.send(prod)
});
app.get("/",async (req,res)=>{
   //let products = await Prod.find();
   let discounts = await Discount.find();
   let products = await Prod.find();
   for (const discount of discounts) {
    // Find the product by name
    let productToUpdate = products.find((item) => item.name === discount.name);

    if (productToUpdate) {
      // Update the price based on the discount percentage
      productToUpdate.price = productToUpdate.price - (productToUpdate.price * discount.percentage) / 100;
    }
  }
    res.send(products);
    });

app.get("/buy",async (req,res)=>{
        //let products = await Prod.find();
        let discounts = await Discount.find();
        let products = await Prod.find();
        for (const discount of discounts) {
         // Find the product by name
         let productToUpdate = products.find((item) => item.name === discount.name);
     
         if (productToUpdate) {
           // Update the price based on the discount percentage
           productToUpdate.price = productToUpdate.price - (productToUpdate.price * discount.percentage) / 100;
         }
       }
         res.send(products);
    });
    

app.get("/profile",async (req,res)=>{
    let user = req.body.name;
    let order = await Order.findOne({name:user});
    console.warn(order);
    let product_order = await ProdOrder.find({id:order.orderId});
    if(product_order){
        res.send(product_order)
    }else{
        res.send("No products ordered");
    }
});    
app.delete("/:id",async (req,res)=>{
    let warehouse = await Warehouse.findOne({capacity:{$lte:10}});
    let r = await Prod.findOne({_id:req.params.id});
    let stock = await Stock.findOne({product:r.name});
    let result = await Prod.deleteOne({_id:req.params.id});
    console.log(stock);
    if(stock.quantity >1){       
        await Stock.updateOne({product:stock.product},{$set:{quantity:stock.quantity-1,updatedAt:new Date()}});
        await Warehouse.updateOne({id:warehouse.id},{$set:{capacity:warehouse.capacity+1}});
    }else if(stock.quantity == 1){
        await Stock.deleteOne({product:stock.product});
        await Warehouse.updateOne({id:warehouse.id},{$set:{capacity:warehouse.capacity+1}});
    }
    res.send(result);
})

app.post("/checkout",async(req,res)=>{
    let result = req.body;
    
    console.log(result);
    let sum = 0 ;
    let user;
    const list = [];
    await Promise.all(result.map(async (item)=>{
        sum+=item.price;
        await Prod.deleteOne({_id:item._id});
        let stock = await Stock.findOne({product:item.name});
        let warehouse = await Warehouse.findOne({capacity: {$lte:10}});

        if(stock){
            if(stock.quantity>1){
                await Stock.updateOne({product:item.name},{$set:{quantity:stock.quantity-1}});
                await Warehouse.updateOne({capacity: {$lte:10}},{$set:{capacity:warehouse.capacity+1}})
            }else if(stock.quantity == 1){
                await Stock.deleteOne({product:stock.product});
                await Warehouse.updateOne({capacity:{$lte:10}},{$set:{capacity:warehouse.capacity+1}});
            }
        }
        let js = {          
        "productId": item._id,
        "quantity": item.quantity,
        "price": item.price,
        "vat": item.vat
        }
        let productorder = new ProductOrderSchema(js);
        let res = await productorder.save();
        console.log(res.productId);
        list.push(res.productId);   
        console.log(warehouse);
        user = item.user_id;
    }));
    console.log(user)
    console.log(list)
    let js = {
        "productorder" : list,
        "customerId": user,
        "total":sum
    }
    let order = new OrderSchema(js);
    let b = await order.save(); 
    res.send(b);
})

app.post("/address",async(req,res)=>{
    const result = req.body;
    console.log(result)
    const address = new Address(result);
    let r = await address.save();
    res.send(r);
})

app.get("/address",async(req,res)=>{
    let address = await Address.find();
    res.send(address)
})


app.post("/shipping", async (req, res) => {
    try {
        const address_user = await Address.findOne({ user: req.body.user });
        //const 
        //console.log(address_user);
        const address_user1 = `${address_user.hno} ${address_user.street} ${address_user.city} ${address_user.state}`;
        
        const address_shipper = await Address.find({ type: "shipper" });
        const address_shipper1 = address_shipper.map(addr=> `${addr.hno} ${addr.street} ${addr.city} ${addr.state}`);
        //console.log(address_shipper);
        const address_warehouse = await Address.find({ type: "warehouse" });
       // console.log(address_warehouse);
        
        const address_warehouse1 = address_warehouse.map(addr => `${addr.hno} ${addr.street} ${addr.city} ${addr.state}`);
        
        const google_address1 = [];
        const google_address2 = [];
        for (const addr of address_shipper1) {
            const query = {
                origins: address_user1, // First warehouse address
                destinations: addr,
                units: "imperial",
                key: "AIzaSyAxe9jXspiST84NrQoo8_P0ZHQiB9tUYqE" 
            };
            const url = `https://maps.googleapis.com/maps/api/distancematrix/json?${queryString.stringify(query)}`;
            google_address1.push(url);
        }
        
        // Calculate distance from user address to each warehouse
        for (const addr of address_warehouse1) {
            const query = {
                origins: address_user1,
                destinations: addr,
                units: "imperial",
                key: "AIzaSyAxe9jXspiST84NrQoo8_P0ZHQiB9tUYqE" 
            };
            const url = `https://maps.googleapis.com/maps/api/distancematrix/json?${queryString.stringify(query)}`;
            google_address2.push(url);
        }
        
        //console.log(google_address);
        
        const responses1 = await Promise.all(google_address1.map(url => axios.get(url)));
        const responses2 = await Promise.all(google_address2.map(url => axios.get(url)));
        //console.log(responses)
        const distances1 = responses1.map(response1 => response1.data);
        const distances2 = responses2.map(response2 => response2.data);
        //console.log(distances1)
        //console.log(distances2)

        let min1 = Number. MAX_VALUE , min2 = Number. MAX_VALUE,min_all = Number. MAX_VALUE;
        for(const a of distances1){
            console.log(a['rows'][0]['elements'])
           if(a.rows[0].elements[0].duration.text.split(' ').length >2){
            let b = Number(a.rows[0].elements[0].duration.text.split(' ')[0]);
            let c = Number(a.rows[0].elements[0].duration.text.split(' ')[2]);
            min1 = (min1>(b*60+c))?(b*60+c):min1;
           }else{
           let b = Number(a.rows[0].elements[0].duration.text.split(' ')[0]);
           min1 = (min1>b)?b:min1;
           }
           //let min_address = 
           console.log(min1+"1")
        }
        for(const a of distances2){
            console.log(a)
            if(a.rows[0].elements[0].duration.text.split(' ').length >2){
                let b = Number(a.rows[0].elements[0].duration.text.split(' ')[0]);
                let c = Number(a.rows[0].elements[0].duration.text.split(' ')[2]);
                min2 = (min2>(b*60+c))?(b*60+c):min2;
            }else{
                let b = Number(a.rows[0].elements[0].duration.text.split(' ')[0]);
                min2 = (min2>b)?b:min2;
            }
            console.log(min2)
        }
        res.send((min1+min2).toString());
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});


app.get("/shipper",async(req,res)=>{
    let shipper = await Shipper.find();
    if(shipper){
        res.send(shipper)
    }else{
        res.send("None")
    }
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