const express = require("express");
const { cadastrarUsuario, login } = require("./controllers/usuarios");
const verificaLogin = require("./midlewares/autenticacao");
const {
  cadastrarPokemon,
  atualizarApelidoPokemon,
  listarPokemons,
  detalharPokemon,
  excluirPokemon,
} = require("./controllers/pokemons");

const rotas = express();

rotas.post("/cadastroUsuario", cadastrarUsuario);
rotas.post("/login", login);

rotas.use(verificaLogin);
rotas.post("/cadastroPokemon", cadastrarPokemon);
rotas.patch("/atualizar/:id", atualizarApelidoPokemon);
rotas.get("/listar", listarPokemons);
rotas.get("/buscar/:id", detalharPokemon);
rotas.delete("/excluir/:id", excluirPokemon);
module.exports = rotas;
