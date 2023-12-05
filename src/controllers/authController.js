import joi from 'joi';
import bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';
import db from '../db.js';

export async function register(req, res) {
  const { name, email, password } = req.body;

  const registerSchema = joi.object({
    name: joi.string().required(),
    email: joi.string().email().required(),
    password: joi.string().required().min(3),
  });
  const validation = registerSchema.validate(req.body, { abortEarly: false });

  if (validation.error) {
    const errors = validation.error.details.map((detail) => detail.message);
    return res.status(422).send(errors);
  }

  try {
    const emailValidation = await db.collection('users').findOne({ email });
    if (emailValidation) return res.status(409).send('email already exists');
    const encryptedPass = (bcrypt.hashSync(password, 10));
    await db.collection('users').insertOne({
      name,
      email,
      password: encryptedPass,
    });
    res.status(201).send('Account created successfully');
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

export async function login(req, res) {
  const { email, password } = req.body;

  const loginSchema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().required().min(3),
  });
  const validation = loginSchema.validate(req.body, { abortEarly: false });
  if (validation.error) {
    const errors = validation.error.details.map((detail) => detail.message);
    return res.status(422).send(errors);
  }
  try {
    const user = await db.collection('users').findOne({ email });
    if (!user) return res.status(404).send('Email not found');
    const passValidation = bcrypt.compareSync(password, user.password);
    if (!passValidation) return res.status(401).send('incorrect password');
    const token = uuid();
    await db.collection('sessions').insertOne({ token, idUser: user._id, name: user.name });
    const data = {
      token,
      name: user.name,
    };
    res.status(200).send(data);
  } catch (error) {
    return res.status(500).send(error.message);
  }
}
