import { hash, compare } from "bcrypt";
import pkg from 'jsonwebtoken';
import User from "../../database/models/User.js";

const { sign } = pkg;
export async function registerUser(email, password) {
  const hashed = await hash(password, 10);
  return await User.create({ email, password: hashed });
}

export async function loginUser(email, password) {
  const user = await User.findOne({ where: { email } });
  if (!user) throw new Error("User not found");

  const valid = await compare(password, user.password);
  if (!valid) throw new Error("Invalid credentials");

  return sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
}
