import joi from 'joi';
import dayjs from 'dayjs';
import db from '../db.js';

export async function transactionsHistory(req, res) {
  const { value, description } = req.body;
  const { type } = req.params;
  const { authorization } = req.headers;
  if (type != 'entrada' && type != 'saida') return res.status(404).send('page does not exist');
  const token = authorization?.replace('Bearer ', '');

  const currencySchema = joi.object({
    value: joi.number().min(0).required(),
    description: joi.string().required(),
  });
  const validation = currencySchema.validate(req.body, { abortEarly: false });
  if (validation.error) return res.status(422).send(validation.error.details);
  try {
    const validationToken = await db.collection('sessions').findOne({ token });
    if (!validationToken) return res.status(401).send('Invalid token');
    if (type === 'entrada') {
      await db.collection('incoming').insertOne({
        name: validationToken.name,
        idUser: validationToken.idUser,
        token: validationToken.token,
        value: (value * 1),
        description,
        data: dayjs().format('DD/MM'),
        exactTime: Date.now(),
      });
    } else if (type === 'saida') {
      await db.collection('out').insertOne({
        name: validationToken.name,
        idUser: validationToken.idUser,
        token: validationToken.token,
        value: (value * -1),
        description,
        data: dayjs().format('DD/MM'),
        exactTime: Date.now(),
      });
    }
    return res.status(200).send('Done');
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

export async function homePage(req, res) {
  const { authorization } = req.headers;

  if (!authorization) return res.status(401).send('Unauthorized access');
  const token = authorization?.replace('Bearer ', '');
  try {
    const session = await db.collection('sessions').findOne({ token });
    if (!session) return res.status(401).send('invalid token');
    const bankTransitionOut = await db.collection('out').find({
      idUser: session.idUser,
    }).toArray();
    const bankTransitionIncoming = await db.collection('incoming').find({
      idUser: session.idUser,
    }).toArray();
    const sortedBalance = [...bankTransitionOut, ...bankTransitionIncoming];
    const sorted = sortedBalance.sort((a, b) => b.exactTime - a.exactTime);
    res.send(sorted);
  } catch (error) {
    return res.status(500).send(error.message);
  }
}
