const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    sequelize.define('Diets', {
      id: {
        type: DataTypes.UUID(),  
        defaultValue: DataTypes.UUIDV4(),
        primaryKey: true,
        autoincrement: true,
        allowNull: false
      },
      name: {
        type: DataTypes.STRING(),
        allowNull: false,
      }
  }, { timestamps: false });
}