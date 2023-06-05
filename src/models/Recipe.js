const { DataTypes } = require('sequelize');
// Se exporta una funcion que define el modelo.
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // Se define el modelo:
  sequelize.define('Recipe', {
    id: {
      type: DataTypes.UUID,  
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      unique: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false, 
    },
    image:{
      type: DataTypes.STRING,
      validate: {
        isUrl: true
      }
    },
    summary:{
      type: DataTypes.STRING,
      allowNull: false
    },
    healthScore:{
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 0,
        max: 100
      }
    },
    steps:{
      type: DataTypes.ARRAY(DataTypes.TEXT), 
      allowNull: false
    },
    // createInBd: true  // createInBd: {type: DataTypes.BOOLEAN}

  }, { timestamps: false });  // No se utilizarán automáticamente las columnas de fecha de creación y actualización
};

