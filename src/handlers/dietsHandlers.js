const getAllDiets = require('../controllers/dietsControllers');


const getDietsHandler = async (req, res) => {
 
    try {
        
        const dietsApi = await getAllDiets();

        return res.status(200).json(dietsApi);
        
    } catch (error) {
        return res.status(500).json({error: error.message});        
    }; 
}


module.exports = getDietsHandler;

