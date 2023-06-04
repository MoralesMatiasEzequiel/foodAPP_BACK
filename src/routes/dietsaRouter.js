const { Router } = require('express');
const getDietsHandler = require('../handlers/dietsHandlers')

const dietsRouter = Router();

dietsRouter.get('/', getDietsHandler);

module.exports = dietsRouter;