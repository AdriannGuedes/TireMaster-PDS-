import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { db } from '../config/firebase.js';

export const login = async (req, res) => {
    const { email, senha } = req.body;

    try {
        const snapshot = await db.collection('usuarios').where('Email', '==', email).get();
        if (snapshot.empty) return res.status(404).json({ msg: 'Usuário não encontrado' });

        const userDoc = snapshot.docs[0];
        const userData = userDoc.data();

        const match = await bcrypt.compare(senha, userData.Senha);
        if (!match) return res.status(401).json({ msg: 'Senha incorreta' });

        const token = jwt.sign({ id: userDoc.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });

    } catch (error) {
        console.error('Erro no login:', error);
        res.status(500).json({ msg: 'Erro no login', error });
    }
};