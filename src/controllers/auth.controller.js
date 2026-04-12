import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { createUser, findUserByEmail } from "../models/user.model.js";

export const register = async (req, res) => {
  console.log("Registering user:", req.body);

  const { name, email, password, mobNo, role, createdOn } = req.body;

  const existing = await findUserByEmail(email); // ✅ FIX
  if (existing) {
    return res.status(400).json({ msg: "User exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await createUser({   // ✅ FIX
    name,
    email,
    password: hashedPassword,
    mobNo,
    role: role || "RECRUITER",
    createdOn
  });

  // remove password before sending
  const { password: _, ...safeUser } = user;

  res.json({
    msg: "User created",
    user: safeUser,
  });
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await findUserByEmail(email); // ✅ FIX
  if (!user) {
    return res.status(400).json({ msg: "Invalid email" });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ msg: "Invalid password" });
  }

  const token = jwt.sign(
    { userId: user.id.toString(), role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  const { password: _, ...safeUser } = user;

  res.json({
    token,
    user: safeUser,
  });
};