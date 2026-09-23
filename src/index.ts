import express, {type Request, type Response} from 'express'; 
import {json} from 'body-parser';



const app = express(); 
app.use(json());

/// get request
app.get('/',(req: Request, res:Response)=>{
    console.log("Testing of Server");
    res.send("Yes its's work fine")
});



const PORT = process.env.PORT || 6000;
app.listen(PORT,()=> {
    console.log('Server listening at ${PORT} port');
});