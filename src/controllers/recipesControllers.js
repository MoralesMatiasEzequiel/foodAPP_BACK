require("dotenv").config();
const { API_KEY, URL } = process.env;
const axios = require('axios');
const { Recipe, Diets } = require('../db');
const { Op } = require('sequelize');


const cleanApiData = (arr) => {

    const clean = arr.map(elem => {

        return{
            id: elem.id,
            name: elem.title,
            image: elem.image,
            summary: elem.summary,
            healthScore: elem.healthScore,
            diets: elem.diets,  
            steps: elem.analyzedInstructions[0]?.steps.map(step => {
                return `<b>${step.number}</b> ${step.step}<br>`
            }),
            createInBd: false,
        }
    });
    return clean;
}

const cleanDbData = (arr) => {

    const clean = arr.map(elem => {
        
        return{
            id: elem.dataValues.id,
            name: elem.dataValues.name,
            image: elem.dataValues.image,
            summary: elem.dataValues.summary,
            healthScore: elem.dataValues.healthScore,
            diets: elem.dataValues.Diets.map((elem) => elem.name),
            steps: elem.dataValues.steps,
            createInBd: elem.dataValues.createInBd,
        }
    });
    return clean;
}

const getApiRecipes = async () => {
    const apiRecipes = (await axios.get(`${URL}/complexSearch?apiKey=${API_KEY}&addRecipeInformation=true&number=100`)).data.results;
    
    const allApiRecipes = cleanApiData(apiRecipes);

    return allApiRecipes;
}

const getDbRecipes = async () => {
    const dbRecipes = await Recipe.findAll({
        include: {
          model: Diets,
          atrributes: ['name'],
          through: {
            atrributes: ['id', 'name'],
          },
        },
    });

    const allDbRecipes = cleanDbData(dbRecipes);

    return allDbRecipes;

};

const getRecipes = async () => {
    const apiRecipes = await getApiRecipes()

    const dbRecipes = await getDbRecipes();

    const response = [...apiRecipes, ...dbRecipes];

   
    //Mostrar recetas al azar:
    // const randomRecipes = [];
    // //Se puede modularizar esto?:
    // for (let i = 0; i < 100; i++) {  //"i < 'x'" --> En 'x' poner la cantidad de recetas qe renderalizaremos
    //     const randomIndex = Math.floor(Math.random() * response.length);
    //     const anyRecipe = response[randomIndex];
    //     randomRecipes.push(anyRecipe);
    // }  
    // return randomRecipes;
    
    return response;

};

const searchByName = async (title) => {

    if(title){
        const apiRecipes = (await axios.get(`${URL}/complexSearch?apiKey=${API_KEY}&query=${title}&addRecipeInformation=true&number=100`)).data.results;

        const recipesApi = cleanApiData(apiRecipes); 
        
        const dbRecipes = await Recipe.findAll({
            where: {
                name: {
                    [Op.iLike]: `%${title}%`,
                }
            },
            include: {
                model: Diets,
                atrributes: ['name'],
                through: {
                  atrributes: ['id', 'name'],
                },
              }
        });

        const dbRecipe = cleanDbData(dbRecipes);
        
        const response = [...recipesApi, ...dbRecipe];
        
        return response;
    }
}

const getRecipeById = async (id, source) => {

    if(source === "api"){
        const recipeRaw = await (axios.get(`${URL}/${id}/information?includeNutrition=true&apiKey=${API_KEY}`));

        const recipe = recipeRaw.data;

        const apiRecipe = {
            id: recipe.id,
            name: recipe.title,
            image: recipe.image,
            summary: recipe.summary,
            healthScore: recipe.healthScore,
            steps: recipe.analyzedInstructions[0]?.steps.map(step => `<b>${step.number}</b> ${step.step}<br>`
            ),
            diets: recipe.diets,
            createInBd: false
        }
        return apiRecipe;
    }
    
    const allDbRecipe = await getDbRecipes();
    const idBdRecipe = allDbRecipe.find(obj => obj.id === id)
    
    return idBdRecipe;
}

const createRecipe = async (name, image, summary, healthScore, steps, diets, createInBd ) => { 

    const [ newRecipe, created] = await Recipe.findOrCreate({ 
        where: { name },
        defaults: { name, image, summary, healthScore, steps, createInBd}
     }); 


    if(diets && diets.length > 0) {
        const dietsFound = await Diets.findAll({ 
            where: { name: diets }});

            await newRecipe.setDiets(dietsFound);
        
    }
    return newRecipe;
    
}

const putRecipe = async (id, name, image, summary, healthScore, steps, diets) => {

    const updated =  await Recipe.update({
        name, image, summary, healthScore, steps, diets
      }, { where: {id} });

    return updated;
}

const deleteRecipe = async (id) => {
    await Recipe.destroy({
        where: {
            id: id
        }
    });
    const recipes = await Recipe.findAll();

    return recipes;
}

module.exports = {
    getApiRecipes,
    getDbRecipes,
    getRecipes,
    getRecipeById,
    searchByName,
    createRecipe,
    deleteRecipe,
    putRecipe
}

