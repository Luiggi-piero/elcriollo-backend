import dotenv from 'dotenv';
dotenv.config();

import express from "express";
import cors from "cors";
import path from 'path';
import foodRouter from './routers/food.router'
import userRouter from './routers/user.router';
import orderRouter from './routers/order.router';
import { dbConnect } from './configs/database.config';
// conexion a la bd
dbConnect();

const app = express();
// para aceptar json en la peticiones
app.use(express.json());

// app front -> localhost:4200
// app back -> localhost:5000

app.use(cors({
    credentials: true,
    origin: ["http://localhost:4200"]
}))

// usando las apis del archivo food.router.ts (enrutador de alimentos)
// cuando llegue una solicitud al servidor que inicie con la ruta /api/foods moverá la solicitud al enrutador de comidas
app.use("/api/foods", foodRouter)

// cuando llegue una solicitud al servidor que inicie con la ruta /api/users moverá la solicitud al enrutador de usuarios
app.use("/api/users", userRouter);

// cuando llegue una solicitud al servidor que inicie con la ruta /api/orders moverá la solicitud al enrutador de order
app.use("/api/orders", orderRouter);

// express va a servir los archivos estaticos de la carpeta public
app.use(express.static('public'));

// Cualquier otra solicitud get que no se controle/maneje entrara en esta parte y entregara el index.html
// __dirname: direccion de este archivo(server.ts)
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
})

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log("web servido en http://localhost:" + port)
})