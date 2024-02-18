import { Schema, model, Types } from 'mongoose';
import { Food, FoodSchema } from './food.model';
import { OrderStatus } from '../constants/order_status';

export interface LatLng {
    lat: string;
    lng: string;
}

export const LatLngSchema = new Schema<LatLng>(
    {
        lat: { type: String, required: true },
        lng: { type: String, required: true }
    }
)

export interface OrderItem {
    food: Food;
    price: number;
    quantity: number;
}

export const OrderItemSchema = new Schema<OrderItem>(
    {
        food: { type: FoodSchema, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true }
    }
)

export interface Order {
    id: string;
    items: OrderItem[];
    totalPrice: number;
    name: string;
    address: string;
    addressLatLng: LatLng;
    paymentId: string;
    status: OrderStatus;
    // user=> este campo contiene el ObjectId de un usuario en una base de datos MongoDB,
    // es el id del usuario que realizo el pedido

    // Cada documento en una colección de MongoDB tiene un campo _id que es 
    // único dentro de esa colección, y este campo se puede representar usando 
    // el tipo ObjectId en las aplicaciones Node.js que interactúan con MongoDB.

    // Types.ObjectId: Este tipo de dato es específico de MongoDB 
    user: Types.ObjectId;
    createdAt: Date;
    updateAt: Date;
}

const OrderSchema = new Schema<Order>(
    {
        name: { type: String, required: true },
        address: { type: String, required: true },
        addressLatLng: { type: LatLngSchema, required: true },
        paymentId: { type: String },
        totalPrice: { type: Number, required: true },
        // [OrderItemSchema] => arreglo de OrderItemSchema
        items: { type: [OrderItemSchema], required: true },
        status: { type: String, default: OrderStatus.NEW },
        user: { type: Schema.Types.ObjectId, required: true }
    },
    {
        timestamps: true,
        toJSON: {
            virtuals: true
        },
        toObject: {
            virtuals: true
        }
    }
);

export const OrderModel = model('order', OrderSchema);