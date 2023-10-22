const { DataTypes } = require('sequelize');

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.addColumn('blogs', 'year', {
      type: DataTypes.INTEGER,
      validate: {
        yearValidator(value) {
          if (new Date().getFullYear() < value) {
            throw new Error(
              'value cannot be greater than the current year'
            );
          }
        },
        min: 1991
      }
    });
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.removeColumn('blogs', 'year');
  }
};