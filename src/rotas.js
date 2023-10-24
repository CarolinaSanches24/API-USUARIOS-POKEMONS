const express = require("express");
const { cadastrarUsuario, login } = require("./controllers/usuarios");

const rotas = express();

rotas.post("/cadastroUsuario", cadastrarUsuario);
rotas.post("/login", login);
module.exports = rotas;
