const bcrypt = require('bcrypt');
const User = require('../models/user.model');

exports.registerNewUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validação de dados obrigatórios
    if (!name || !email || !password) {
      return res.status(400).json({ error: "Todos os campos são obrigatórios para o registro." });
    }

    // Validação de formato de e-mail
    if (!validator.isEmail(email)) {
      return res.status(400).json({ error: "O e-mail fornecido não é válido." });
    }

    // Verificar se o e-mail já está cadastrado
    const isUser = await User.find({ email });
    if (isUser.length >= 1) {
      return res.status(409).json({ error: "Este e-mail já possui registro!" });
    }

    // Hash da Senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Criar novo usuário
    const newUser = new User({
      name,
      email,
      password: hashedPassword
    });

    // Salvar usuário no banco de dados
    const user = await newUser.save();

    // Gerar Token
    const token = await newUser.generateAuthToken();

    return res.status(201).json({
      message: "Usuário(a) criado(a) com sucesso!",
      user,
      token
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro durante o registro. Por favor, tente novamente." });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validação de E-mail
    if (!validator.isEmail(email)) {
      return res.status(400).json({ error: "O e-mail fornecido não é válido." });
    }

    const user = await User.findByCredentials(email, password);
    if (!user) {
      return res.status(401).json({
        error: "Erro ao fazer login! Verifique suas credenciais de autenticação.",
      });
    }

    const token = await user.generateAuthToken();
    return res.status(200).json({
      message: "Usuário(a) logado(a) com sucesso!",
      user,
      token
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro durante o login. Por favor, tente novamente." });
  }
};

// ==> Método responsável por retornar um determinado 'User'
exports.returnUserProfile = async (req, res) => {
  await res.json(req.userData);
};
