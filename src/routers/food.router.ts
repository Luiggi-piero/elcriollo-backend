import { Router } from 'express';
import { sample_foods, sample_tags } from '../data';
import asyncHandler from 'express-async-handler'; // Maneja errores de las solicitudes
import { FoodModel } from '../models/food.model';

const router = Router();

// Rellenar por primera vez las la colección(tabla) foods
router.get("/seed", asyncHandler(
    async (req, res) => {
        const foodsCount = await FoodModel.countDocuments();
        if (foodsCount > 0) {
            res.send('semilla lista');
            return;
        }
        await FoodModel.create(sample_foods);
        res.send('foods creadas')
    }
))

// Obtener todas las comidas
router.get("/", asyncHandler(
    async (req, res) => {
        const foods = await FoodModel.find();
        res.send(foods)
    }
))

router.get("/search/:searchTerm", asyncHandler(
    async (req, res) => {
        const searchRegex = new RegExp(req.params.searchTerm, 'i');
        const foods = await FoodModel.find({ name: { $regex: searchRegex } })
        res.send(foods);
    }
))

/** 
 *  const tags = await FoodModel.aggregate([...])
 * Una agregación en el modelo de datos se refiere a un proceso de transformación 
 * y manipulación de datos en una base de datos. Permite realizar operaciones 
 * más complejas y avanzadas que las operaciones
 *  de consulta estándar, como realizar cálculos, agrupar datos, filtrar, 
 * ordenar y combinar diferentes conjuntos de datos.
 */

/* 
* la agregación se utiliza para descomponer los elementos del campo "tags" de cada documento, 
* agruparlos por valor único y contar cuántos documentos tienen cada valor de etiqueta. 
* Luego, se realiza una proyección y ordenamiento de los resultados 
* antes de enviarlos como respuesta al cliente.
* se está utilizando la agregación en el modelo de datos "FoodModel"
*/

// Obtener todos los tags realizando agregacion a FoodModel
router.get("/tags", asyncHandler(
    async (req, res) => {
        const tags = await FoodModel.aggregate([
            {
                $unwind: '$tags'
            },
            {
                $group: {
                    _id: '$tags',
                    count: { $sum: 1 }
                }
            },
            {
                $project: {
                    _id: 0,
                    name: '$_id',
                    count: '$count'
                }
            }
        ]).sort({ count: -1 });

        const all = {
            name: 'Todo',
            count: await FoodModel.countDocuments()
        }

        tags.unshift(all);
        res.send(tags);
    }
))

/**
 * contenido de tags
 * [
      { name: 'All', count: 6 },
      { name: 'FastFood', count: 4 },
      { name: 'Lunch', count: 3 },
      { name: 'Pizza', count: 2 },
      { name: 'SlowFood', count: 2 },
      { name: 'Hamburger', count: 1 },
      { name: 'Soup', count: 1 },
      { name: 'Fry', count: 1 }
    ]
 */

// Obtener todas los foods con el tagName
router.get("/tag/:tagName", asyncHandler(
    async (req, res) => {
        const foods = await FoodModel.find({ tags: req.params.tagName });
        res.send(foods);
    }
))

// Obtener food por su id
router.get("/:foodId", asyncHandler(
    async (req, res) => {
        const food = await FoodModel.findById(req.params.foodId);
        res.send(food);
    }
))

export default router;