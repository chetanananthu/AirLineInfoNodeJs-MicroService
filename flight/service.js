const express=require('express');
const mysql=require('mysql2');
const axios=require('axios');

const app=express();
const PORT=2002

app.use(express.json());

const connection=mysql.createConnection({
    host:'mysql',
    user:'root',
    password:'pass@word1',
    database:'flightdb'
});

connection.connect((err)=>{
    if(err){
        console.log(err);
    }
    else{
        console.log("Connected to mysql");
    }
});

app.get('/flights',async (req,res)=>{
    const sql='SELECT * FROM flight';
    connection.query(sql,(err,result)=>{
        if(err) throw err;
        res.status(200).json(result);
    });
});

app.get('/flights/:id', async (req,res)=>{
    const sql='SELECT * FROM flight WHERE id=?';
    const id=req.params.id;
    connection.query(sql,[id],async (err,result)=>{
        if(err) throw err;
        try {
            // Await the Axios request to get the passenger list
            const response = await axios.get(`http://passanger:2003/passanger/flight/${id}`);
            result[0].passangerList = response.data; // Add passenger list to the flight result
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Error fetching passenger list', error: error });
        }
        res.status(200).json(result[0]);
    });
});

app.get('/flights/airline/:airlineId',async(req,res)=>{
    const sql='SELECT * FROM flight WHERE airline_id=?';
    const airlineId=req.params.airlineId;
    connection.query(sql,[airlineId],(err, result)=>{
        if(err) throw err;
        res.status(200).json(result);
    });
});

app.post('/flights',async(req,res)=>{
    const {flightNumber, destination, airlineId }=req.body;
    const sql='INSERT INTO flight (flight_number,destination,airline_id) values(?,?,?)';
    connection.query(sql,[flightNumber, destination, airlineId],(err, result)=>{
        if(err) throw err;
        res.status(201).json(result);
    });

});

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
});