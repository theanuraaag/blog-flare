import { handleError } from "../helpers/handleError.js";
import User from "../models/user.models.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const checkUser = await User.findOne({ email });
    if (checkUser) {
      return next(handleError(409, "User already registered."));
    }
    const hashedPassword = bcryptjs.hashSync(password,10);
    const user = new User({
      name,
      email,
      password: hashedPassword,
    });

    await user.save();
    res.status(200).json({
      success: true,
      message: "Registration successful.",
    });
  } catch (error) {
    return next(handleError(500, error.message));
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return next(handleError(400, "User not found"));
    }
    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch) {
      return next(handleError(400, "Invalid Credentials."));
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "3d",
    });

    const { password: _, ...userData } = user._doc;
    res.status(200).json({ token, user: userData });
  } catch (error) {
    return next(handleError(500, error.message));
  }
};
