const Sequelize = require('sequelize');
const connection = require('./db');

const Response = connection.define("response", {
    resName: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    corpo: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    questionId: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
});

Response.sync({force: false});

module.exports = Response;