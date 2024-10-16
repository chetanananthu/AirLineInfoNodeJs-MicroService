const express=require('express');
const mysql=require('mysql2');
const axios=require('axios');

const app=express();
const PORT = 2001;

app.use(express.json());

const db=mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'pass@word1',
    database:'airlinedb'
});

db.connect((err)=>{
    if(err){
        console.log("not connected");
    }
    console.log('Connected to MySQL database');
});

app.get('/airline',async (req,res)=>{
    let sql='SELECT * FROM airline';
    db.query(sql,(err,result)=>{
        if(err) throw err;
        res.send(result);
    });
});

app.post('/airline',async (req,res)=>{
    const{id,name}=req.body;
    let sql='INSERT INTO airline (id,name) VALUES (?,?)';
    db.query(sql,[id,name],(err,result)=>{
        if(err) throw err;
        res.status(201).json({message:'Airline added successfully'});
    });
});

app.get('/airline/:id',async(req,res)=>{
    const id=req.params.id;
    let sql='SELECT * FROM airline WHERE id=?';
    db.query(sql,[id], async (err, result)=>{
        if(err) throw err;
        try{
            const reponse=await axios.get(`http://localhost:2002/flights/airline/${id}`);
            result[0].flightList=reponse.data;
            res.status(200).json(result);
        }
        catch(err){
            res.status(500).json({message:err.message});
        }
    });
});



app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
});

