import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
	//& La forma que van a tener los elementos de tipo libro
	title: String,
	author: String,
	genere: String,
	publication_date: String,
});

export const mongoModel = mongoose.model("Book", bookSchema); //& Para que se exporte como un modelo de mongo
