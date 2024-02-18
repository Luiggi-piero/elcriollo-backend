/**
 * middleware para agregar propiedades a la solicitud (objeto req comunmente llamado)
 * en este caso se agrega la propiedad user para conocer quien está realizando la solicitud
 */

import { verify } from "jsonwebtoken";
import { HTTP_UNAUTHORIZED } from "../constants/http.status";

export default (req: any, res: any, next: any) => {
    const token = req.headers.access_token as string;

    // verifica si hay token
    if(!token) return res.status(HTTP_UNAUTHORIZED).send();

    try {
        const decodedUser = verify(token, process.env.JWT_SECRET!);
        // agrega la informacion decodificada a la propiedad user de la solicitud
        req.user = decodedUser;
    } catch (error) {
        res.status(HTTP_UNAUTHORIZED).send();
    }

    return next();
}