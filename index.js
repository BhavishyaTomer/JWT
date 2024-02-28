import  express  from "express";
import router from "./router/router.js";
const app=express();
app.use(express.json());
app.use(router);


app.listen(5000,()=>{
    console.log("backend is running")
})