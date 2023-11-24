const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    name: { type: String, maxlength: 100, required: true },
    email: { type: String, maxlength: 100, required: true },
    password: { type: String, required: true },
    tokens: [
      {
        token: { type: String, required: true },
      },
    ],
  },
  {
    timestamps: true,
    collection: "users",
  }
);

// ==> Esse método irá fazer o 'hash' da senha antes de salvar o modelo da classe 'User'
userSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

// ==> Esse método irá criar (gerar) uma autenticação auth para o 'User'
userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign(
    { _id: user._id, name: user.name, email: user.email },
    "secret"
  );
  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
};

// ==> Esse método irá fazer uma pesquisa por um 'user' por 'email' e 'password'
userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });
  console.log("Usuário Encontrado:");

  if (!user) {
    console.error("Usuário não encontrado!");
    throw new Error("Usuário não encontrado!");
  }
  console.log("Senha fornecida:", password);
  console.log("Senha armazenada:", user.password);

  const isPasswordMatch = bcrypt.compare(password, user.password);

  if (!isPasswordMatch) {
    console.error("Senha incorreta!");
    throw new Error("Senha incorreta!");
  }

  return user;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
