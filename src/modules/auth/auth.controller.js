import { registerUser, loginUser } from "./auth.service.js";

export async function registerController(req, res) {
  try {
    const user = await registerUser(req.body.email, req.body.password);
    res.json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

export async function loginController(req, res) {
  try {
    const token = await loginUser(req.body.email, req.body.password);
    res.json({ token });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}
