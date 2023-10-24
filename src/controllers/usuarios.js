require("dotenv").config(); //importacao do dotenv
const bcrypt = require("bcrypt");
const pool = require("../conexao");
const jwt = require("jsonwebtoken");

const cadastrarUsuario = async (req, res) => {
  const { nome, email, senha } = req.body;
  try {
    const emailExiste = await pool.query(
      `select *from usuarios where email=$1`,
      [email]
    );
    if (emailExiste.rowCount > 0) {
      return res.status(400).json({ mensagem: "Email já existe" });
    }

    const senhaCripto = await bcrypt.hash(senha, 10);

    const query = `
    insert into usuarios (nome, email, senha)
    values ($1, $2, $3) returning *`;

    const { rows } = await pool.query(query, [nome, email, senhaCripto]);

    const { senha: _, ...usuario } = rows[0];

    return res.status(201).json(usuario);
  } catch (error) {
    return res.status(500).json({ mensagem: "Erro interno do servidor!" });
  }
};

const login = async (req, res) => {
  const { email, senha } = req.body;
  try {
    const { rows, rowCount } = await pool.query(
      "select * from usuarios where email=$1",
      [email]
    );

    if (rowCount === 0) {
      return res.status(404).json({ mensagem: "Email ou senha Inválida" });
    }

    const { senha: senhaUsuario, ...usuario } = rows[0];

    const senhaCorreta = await bcrypt.compare(senha, senhaUsuario);

    if (!senhaCorreta) {
      return res.status(400).json({ mensagem: "Email ou senha inválida" });
    }

    const senhaJwt = process.env.TESTE; //senha capturada do dotenv
    //criação do token e assinatura
    const token = jwt.sign({ id: usuario.id }, senhaJwt, { expiresIn: "8h" });
    console.log(token);

    return res.json({ usuario, token });
  } catch (error) {
    return res.status(500).json({ mensagem: "Erro interno do Servidor!" });
  }
};
module.exports = {
  cadastrarUsuario,
  login,
};
