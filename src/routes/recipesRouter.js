const { Router } = require('express');
const { getRecipesHandler, getRecipeDetailHandler, getNameRecipeHandler, createRecipeHandler, updateHandler, deleteRecipeHandler } = require('../handlers/recipesHandlers')

const recipeRouter = Router();

const validate = (req, res, next) => {
    
    const { name, image, summary, healthScore, steps, diets } = req.body;

    if(!name || !image || !summary || !healthScore || !steps || !diets){
        res.status(400).json({ error: "Data missing" });
    };
    next();
}


recipeRouter.get('/', async (req, res) => {
    
    const { title } = req.query;

    if (title) {
        return getNameRecipeHandler(req, res);
    }

    return getRecipesHandler(req, res); //Traemos todas las recetas
});

recipeRouter.get('/:id', getRecipeDetailHandler);  

recipeRouter.post('/', validate, createRecipeHandler);

recipeRouter.put('/', validate, updateHandler);

recipeRouter.delete('/:id', deleteRecipeHandler);


module.exports = recipeRouter;

