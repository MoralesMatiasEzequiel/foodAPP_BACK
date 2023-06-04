const { getRecipes, getRecipeById, searchByName, createRecipe, putRecipe, deleteRecipe } = require('../controllers/recipesControllers');


const getRecipesHandler = async (req, res) => {

    try {
        const allRecipes = await getRecipes();

        res.status(200).send(allRecipes);

    } catch (error) {
        res.status(400).send({ error: error.message});
    }
};

const getNameRecipeHandler = async (req, res) => {

    const { title } = req.query;  

    try {
        
        const result = title ? await searchByName(title) : await getRecipes();

        if(result.length === 0){
            return res.status(400).send(`No recipes found with that name: "${title}"`);  //No se No se encontraron recetas con ese nombre.
        }

        res.status(200).send(result);

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getRecipeDetailHandler = async (req, res) => {
    const { id } = req.params;

    const source = isNaN(id) ? "bdd" : "api";

    try {
        const recipe = await getRecipeById(id, source);

        if(source === 'bdd'){ return res.status(200).json({recipe}.recipe);}

        
        res.status(200).json({recipe}.recipe); 

    } catch (error) {
        res.status(400).send({ error: error.message, description: `ID not found '${id}'`}); 
    }
};

const createRecipeHandler = async (req, res) => {
    
    const { name, image, summary, healthScore, steps, diets, createInBd } = req.body; 

    try {
        if (!name || !image || !summary || !healthScore || !steps || !createInBd) {
            return res.status(400).json({ error: 'Missing required data' });
        }
        
        const newRecipe = await createRecipe(name, image, summary, healthScore, steps, diets, createInBd);
        
        res.status(201).send('Recipe created!');

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const updateHandler = async (req, res) => {
    const { id, name, image, summary, healthScore, steps, diets } = req.body;
    try {
      if(!id) res.status(400).json({ error: 'Missing ID' });
    
      const recipeUpdated = await putRecipe(id, name, image, summary, healthScore, steps, diets);

      res.status(200).send(recipeUpdated);

    } catch (error) {
        res.status(400).send({ error: error.message })
    }
};

const deleteRecipeHandler = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await deleteRecipe(id);

        return res.status(200).json(result)

    } catch (error) {
       return res.status(500).json({ error: error.message, description: `Correctly enter the ID you want to delete` }) //Introduce correctamente el ID que quieres eliminar 
    }
};

module.exports = {
    getRecipesHandler,
    getRecipeDetailHandler,
    getNameRecipeHandler,
    createRecipeHandler,
    updateHandler,
    deleteRecipeHandler
};

