const express=require('express');
const mysql=require('mysql2');

const app=express();
const PORT=2003

app.use(express.json());

const connection=mysql.createConnection({
    host:'mysql',
    user:'root',
    password:'pass@word1',
    database:'passangerdb'
});

connection.connect((err)=>{
    if(err){
        console.log(err);
    }else{
        console.log('connected to database');
    }
});

app.get('/passanger',async(req,res)=>{
    const query='SELECT * FROM passanger';
    connection.query(query,(err,result)=>{
        if(err)
            res.status(500).json({message:"there is no passanger"});
        res.status(200).json(result);
    });
});

app.get('/passanger/:id',async(req,res)=>{
    const sql='SELECT * FROM passanger WHERE id=?';
    const id=req.params.id;
    connection.query(sql,[id],(err, result)=>{
        if(err)
            res.status(500).send(err);
        res.status(200).json(result);
    });
});


app.post('/passanger',async(req,res)=>{
    const{name,email,phone,flightId}=req.body;
    const sql='INSERT INTO passanger (name,email,phone,flight_id ) values (?,?,?,?)';
    connection.query(sql,[name,email,phone,flightId],(err, result)=>{
        if(err)
            res.status(500).send(err);
        res.status(201).json(result);
    });
});

app.get('/passanger/flight/:flightId',async(req,res)=>{
    const sql='SELECT * FROM passanger WHERE flight_id=?';
    const flightId=req.params.flightId;
    connection.query(sql,[flightId],(err, result)=>{
        if(err)
            res.status(500).json({message:"there is flight with given id"});
        res.status(200).json(result);
    });
});

app.listen(PORT,()=>{
    console.log(`server is running on port ${PORT}`);
});