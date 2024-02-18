import { Router } from 'express';
import asyncHandler from 'express-async-handler'; // Maneja errores de las solicitudes
import { OrderModel } from '../models/order.model';
import { HTTP_BAD_REQUEST } from '../constants/http.status';
import { OrderStatus } from '../constants/order_status';
import auth from '../middlewares/auth.mid';

const router = Router();

// Agregar el middleware para verificar usuario (decodificar el token y obtener su informacion)
router.use(auth);

// Crear order(pedido: conjunto de comidas)
router.post("/create", asyncHandler(
    async (req: any, res: any) => {
        const requestOrder = req.body;

        // verificar si hay items (comidas) en el pedido
        if (requestOrder.items.length <= 0) {
            res.status(HTTP_BAD_REQUEST).send('Carrito de compras vacío');
            return;
        }

        /**
         *  Elimina cualquier pedido existente del usuario actual que esté en estado "nuevo". Esto se hace 
         * antes de crear un nuevo pedido para asegurarse de que el usuario no tenga más de un pedido "nuevo" activo a la vez.
         */
        await OrderModel.deleteOne({
            user: req.user.id,
            status: OrderStatus.NEW
        });

        const newOrder = new OrderModel({ ...requestOrder, user: req.user.id });
        await newOrder.save();
        res.send(newOrder);
    }
));

// Obtener el nuevo pedido del usuario actual (ya fue creado previamente)
router.get('/newOrderForCurrentUser', asyncHandler(
    async (req: any, res) => {
        const order = await getNewOrderForCurrentUser(req);
        if (order) res.send(order);
        else res.status(HTTP_BAD_REQUEST).send();
    }
));

// Pagar pedido
router.post('/pay', asyncHandler(
    async (req, res) => {
        const { paymentId } = req.body;
        const order = await getNewOrderForCurrentUser(req);

        if(!order) {
            res.status(HTTP_BAD_REQUEST).send("Pedido no encontrado");
            return;
        }

        // Actualizamos los datos del pedido
        order.paymentId = paymentId;
        order.status = OrderStatus.PAYED;
        await order.save();

        res.send(order._id);
    }
))

// Obtener un pedido por id, para realizar el seguimiento
router.get("/track/:id", asyncHandler(
    async (req, res) => {
        const order = await OrderModel.findById(req.params.id);

        if(!order) {
            res.status(HTTP_BAD_REQUEST).send("Pedido no encontrado");
            return;
        }

        res.send(order);
    }
))

export default router;

async function getNewOrderForCurrentUser(req: any) {
    return await OrderModel.findOne({ user: req.user.id, status: OrderStatus.NEW });
}
