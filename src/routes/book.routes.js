import express from "express";
import { mongoModel as Book } from "./../modules/book.model.js"; //& Mas facil con el nombre como tal del modelo, pa no confundirse
export const router = express.Router();

//& MIDDLEWARE
const getBook = async (req, res, next) => {
	let book;
	const { id } = req.params;

	if (!id.match(/^[0-9a-fA-F]{24}$/)) {
		//& Si no coincide con el "Tipico Id de mongo, numeros del 0 al 9 y letras del a al f"
		return res.status(404).json({ message: "El Id del Libro no es valido" }); //& Si no lo encontro
	}
	try {
		book = await Book.findById(id); //& Busque el libro correcto
		if (!book) {
			return res.status(404).json({ message: "El Libro no fue encontrado" }); //& Si no lo encontro
		}
	} catch (error) {
		return res.status(500).json({ message: error.message });
	}

	res.book = book;
	next(); //& Pa que siga la request
};

//& Obtener todos los libros [GET ALL]
router.get("/", async (req, res) => {
	try {
		const books = await Book.find(); //& No definimos ID, busca todo entonces
		console.log("GET ALL", books);
		if (books.length === 0) {
			return res.status(204).json([]); //+ "No Content"
		}
		// @ts-ignore
		res.json(books); //+ 200, OK
	} catch (err) {
		res.status(500).json({ message: err.message }); //+ "DB Error"
	}
});

//& Crear un nuevo libro, un nuevo recurso [POST]
router.post("/", async (req, res) => {
	const { title, author, genere, publication_date } = req?.body;
	if (!title || !author || !genere || !publication_date) {
		return res.status(400).json({
			message:
				"Los Campos: title, author, genere, publication_date. Son Obligatorios",
		});
	}

	const book = new Book({
		title,
		author,
		genere,
		publication_date,
	});

	try {
		const newBook = await book.save();
		console.log(newBook);
		res.status(201).json(newBook);
	} catch (error) {
		res.status(400).json({
			message: error.message,
		});
	}
});

//& Get Individual
router.get("/:id", getBook, async (req, res) => {
	// @ts-ignore
	res.json(res.book); // Disponemos de "res.book" ya que lo definimos en el MIDDLEWARE
});

//& Put, para modificar lo ya existente
router.put("/:id", getBook, async (req, res) => {
	try {
		// @ts-ignore
		const book = res.book;
		book.title = req.body.title || book.title; //& Si Existe el 1ro, tons ese el 1ro, si no el 2do
		book.author = req.body.author || book.author;
		book.genere = req.body.genere || book.genere;
		book.publication_date = req.body.publication_date || book.publication_date;

		const updatedBook = await book.save(); //& Esperar a que se actualize
		res.json(updatedBook); //& Regresar lo actualizado
	} catch (error) {
		res.status(400).json({
			message: error.message,
		});
	}
});

//& Patch, Para mejor poder mandar 1 sola de las cosas y se modifique, se "Parchee", no como en el Put que fue TODO el cuerpo denuevo
router.patch("/:id", getBook, async (req, res) => {
	if (
		!req.body.title &&
		!req.body.author &&
		!req.body.genere &&
		!req.body.publication_date
	) {
		res.status(400).json({
			message:
				"Almenos 1 de los Campos debe ser enviado: Titulo, Autor, Genero, Fecha de Publicacion",
		});
	}

	try {
		// @ts-ignore
		const book = res.book;
		book.title = req.body.title || book.title; //& Si Existe el 1ro, tons ese el 1ro, si no el 2do
		book.author = req.body.author || book.author;
		book.genere = req.body.genere || book.genere;
		book.publication_date = req.body.publication_date || book.publication_date;

		const updatedBook = await book.save(); //& Esperar a que se actualize
		res.json(updatedBook); //& Regresar lo actualizado
	} catch (error) {
		res.status(400).json({
			message: error.message,
		});
	}
});

router.delete("/:id", getBook, async (req, res) => {
	try {
		// @ts-ignore
		const book = res.book;
		await book.deleteOne({
			_id: book._id, //& Pa Evitar peos, tiene un filtro especifico
		});
		res.json({
			message: `El Libro ${book.title} fue eliminado correctamete`,
		});
	} catch (error) {
		res.status(500).json({
			message: error.message,
		});
	}
});
