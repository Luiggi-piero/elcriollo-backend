import { Router } from 'express';
import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import bcrypt from 'bcryptjs'; // para encriptar la contrasenia
import { sample_users } from '../data';
import { UserModel } from '../models/user.model';
import { HTTP_BAD_REQUEST } from '../constants/http.status';

const router = Router();

// Rellenar por primera vez las la colección(tabla) users
router.get("/seed", asyncHandler(
    async (req, res) => {
        const usersCount = await UserModel.countDocuments();
        if (usersCount > 0) {
            res.send('semilla de usuario lista');
            return;
        }
        await UserModel.create(sample_users);
        res.send('usuarios creados')
    }
))

router.post("/login", asyncHandler(
    async (req, res) => {
        // recibe por el body el json del email y password
        const { email, password } = req.body;
        // const user = sample_users.find(user => user.email == email && user.password == password);
        const user = await UserModel.findOne({ email });

        /**
         * bcrypt.compare(password, user.password): compara el valor 'password' ingresado por el usuario
         * con el hash(encriptado) de la contrasenia que viene de la bd
         */
        if (user && await bcrypt.compare(password, user.password)) {
            res.send(generateTokenResponse(user));
        }
        else res.status(HTTP_BAD_REQUEST).send("Correo o constraseña inválidos")
    }
));

// Registrar usuario
router.post("/register", asyncHandler(
    async (req, res) => {
        const { name, email, password, address } = req.body;

        // Verificar si el usuario ya existe
        const user = await UserModel.findOne({ email });
        if (user) {
            res.status(HTTP_BAD_REQUEST)
                .send('El usuario ya existe, por favor use otro correo');
            return;
        }

        // Encriptar contrasenia
        const encryptPassword = await bcrypt.hash(password, 10);
        const newUser = {
            id: '',
            name,
            email: email.toLowerCase(),
            password: encryptPassword,
            address,
            isAdmin: false
        }

        const dbUser = await UserModel.create(newUser);
        res.send(generateTokenResponse(dbUser));
    }
))

const generateTokenResponse = (user: any) => {
    const token = jwt.sign({
        id: user.id, email: user.email, isAdmin: user.isAdmin
    }, "SomeRandomText", {
        expiresIn: "30d"
    });
    // user.token = token;
    user = { ...user._doc, token: token };
    return user;
}

export default router;