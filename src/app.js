import express from "express";
import mongoose, { mongo } from "mongoose";
import bodyParser from "body-parser";
import { config } from "dotenv";
import { router as bookRoutes } from "./routes/book.routes.js";

config();

// Usamos Express para los MiddleWares
const app = express();
app.use(bodyParser.json()); //& MIDDLEWARE para que parse a Json el body que reciba las request

// Conectar la DB:
// @ts-ignore
mongoose.connect(process.env.MONGO_URL, { dbName: process.env.MONGO_DB_NAME });
const db = mongoose.connection;

app.use("/books", bookRoutes);

const port = process.env.PORT || 3000;

app.listen(port, () => {
	console.log(`Servidor iniciado en el puerto ${port}`);
});
