const { Diets } = require('../db');
const axios = require('axios');
require("dotenv").config();
const { API_KEY, URL } = process.env;


const cleanData = (arr) => { 
    const clean = arr.map(recipe => recipe.diets
    );
    return clean;
}

const getAllDiets = async () => {
  
    const apiDietsRaw = (  //Aqui va a llegar toda la data de la api (URL). A esta la pasaremos por un filtro para descartar la info que esta demas.
        await axios.get(`${URL}/complexSearch?apiKey=${API_KEY}&addRecipeInformation=true&number=100`)
    ).data.results;

    const apiDiets = cleanData(apiDietsRaw).flat() 

    const diets = [...new Set(apiDiets)];

    diets.forEach((diet) => {
        Diets.findOrCreate({
            where: {
                name: diet,
            }
        })
    })

    return diets;
};


module.exports = getAllDiets;
