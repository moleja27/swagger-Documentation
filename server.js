import express from "express";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const app = express();
const PORT = 8000;

// Middleware para parsear JSON
app.use(express.json());

const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "API de Recursos Humanos",
            version: "1.0.0",
            description: "Una API para gestionar usuarios y libros en una base de datos de Recursos Humanos",
        },
    },
    apis: ["./server.js"], // Aquí le indicas a Swagger qué archivos analizar
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);

// Configuración de la ruta de documentación
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Array de usuarios inicial
let usuarios = [
    { id: 1, nombre: "Alejandra Marin", edad: "28" },
    { id: 2, nombre: "Pedro Fernandez", edad: "37" },
];

// Array de libros
let books = [
    { id: 1, title: "1984", author: "George Orwell" },
    { id: 2, title: "Cien años de soledad", author: "Gabriel García Márquez" },
];

// Ruta raíz: mensaje de bienvenida
app.get("/", (req, res) => {
    res.send("Bienvenidos a la base de datos de Recursos Humanos!");
});

// Rutas de Usuarios
/**
 * @swagger
 * /usuarios:
 *   get:
 *     summary: Obtener todos los usuarios
 *     responses:
 *       200:
 *         description: Lista de usuarios.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   nombre:
 *                     type: string
 *                   edad:
 *                     type: string
 */
app.get("/usuarios", (req, res) => {
    res.json(usuarios);
});

/**
 * @swagger
 * /usuarios:
 *   post:
 *     summary: Agregar un nuevo usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *               - edad
 *             properties:
 *               nombre:
 *                 type: string
 *               edad:
 *                 type: string
 *     responses:
 *       201:
 *         description: Usuario agregado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 usuario:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     nombre:
 *                       type: string
 *                     edad:
 *                       type: string
 */
app.post("/usuarios", (req, res) => {
    const { nombre, edad } = req.body;
    if (!nombre || !edad) {
        return res.status(400).json({ message: "nombre o edad no especificado" });
    }
    const newUser = {
        id: usuarios.length + 1,
        nombre,
        edad,
    };
    usuarios.push(newUser);
    res.status(201).json({
        message: "Usuario agregado exitosamente!",
        usuario: newUser,
    });
});

/**
 * @swagger
 * /usuarios/{id}:
 *   put:
 *     summary: Actualizar un usuario existente
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del usuario a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               edad:
 *                 type: string
 *     responses:
 *       200:
 *         description: Usuario actualizado correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 usuario:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     nombre:
 *                       type: string
 *                     edad:
 *                       type: string
 *       404:
 *         description: Usuario no encontrado.
 */
app.put("/usuarios/:id", (req, res) => {
    const userId = parseInt(req.params.id);
    const user = usuarios.find(u => u.id === userId);
    if (!user) {
        return res.status(404).json({ message: "usuario no encontrado" });
    }
    const { nombre, edad } = req.body;
    user.nombre = nombre || user.nombre;
    user.edad = edad || user.edad;
    res.json({
        message: "Usuario actualizado correctamente",
        usuario: user,
    });
});

/**
 * @swagger
 * /usuarios/{id}:
 *   delete:
 *     summary: Eliminar un usuario
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del usuario a eliminar
 *     responses:
 *       200:
 *         description: Usuario eliminado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: Usuario no encontrado.
 */
app.delete("/usuarios/:id", (req, res) => {
    const userId = parseInt(req.params.id);
    const userIndex = usuarios.findIndex((u) => u.id === userId);
    if (userIndex === -1) {
        return res.status(404).json({ message: "usuario no encontrado" });
    }
    const deletedUser = usuarios.splice(userIndex, 1);
    res.json({
        message: "Usuario eliminado exitosamente!",
        usuario: deletedUser[0],
    });
});

// Rutas de Libros
/**
 * @swagger
 * /books:
 *   get:
 *     summary: Obtener todos los libros
 *     responses:
 *       200:
 *         description: Lista de libros.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   title:
 *                     type: string
 *                   author:
 *                     type: string
 */
app.get("/books", (req, res) => {
    res.json(books);
});

// Inicia el servidor
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
