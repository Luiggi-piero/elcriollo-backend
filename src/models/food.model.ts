import { Schema, model } from 'mongoose';

export interface Food {
    id: string;
    name: string;
    price: number;
    tags: string[];
    favorite: boolean;
    stars: number;
    imageUrl: string;
    origins: string[];
    cookTime: string;
}

export const FoodSchema = new Schema<Food>(
    // definición del schema
    {
        name: { type: String, required: true },
        price: { type: Number, required: true },
        tags: { type: [String] },
        favorite: { type: Boolean, default: false },
        stars: { type: Number, required: true },
        imageUrl: { type: String, required: true },
        origins: { type: [String], required: true },
        cookTime: { type: String, required: true }
    }, 
    // opciones adicionales
    {
        toJSON: {
            virtuals: true,
        },
        toObject: {
            virtuals: true
        },
        timestamps: true
    }
);

export const FoodModel = model<Food>('food', FoodSchema);



/* 
timestamps: Opción que le dice a Mongoose que agregue automáticamente campos createdAt y 
updatedAt a cada documento basado en este esquema, para llevar un registro de cuándo 
se creó y se modificó por última vez cada objeto.
*/

/* 
Los campos virtuales en Mongoose son campos que no están almacenados directamente en la 
base de datos, sino que se calculan o derivan de otros campos almacenados. Son útiles para realizar 
cálculos o transformaciones en los datos antes de que se devuelvan al cliente o se procesen de alguna otra manera.

Agrega los campos virtuales cuando se convierte a json
toJSON: {
            virtuals: true,
        },

Agrega los campos virtuales cuando se convierte a un objeto javascript
toObject: {
            virtuals: true
        },
*/