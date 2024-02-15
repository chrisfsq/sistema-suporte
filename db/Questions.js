//CRIA A TABELA NO BANCO DE DADOS que esta em DB (question)

const Sequelize = require('sequelize'); //IMPORTA O SEQUELIZE
const connection = require('./db'); //IMPORTA O BANCO DE DADOS

const Questions = connection.define('quest', { //DEFINE A TABELA
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    title:{
        type: Sequelize.STRING, //DEFINE AS COLUNAS
        allowNull: false
    },
    textarea: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    image: {
        type: Sequelize.BLOB,
        allowNull: true
    }
});

Questions.sync({force: false}).then(() => { //SINCRONIZA E NÃO FORÇA A CRIAR UMA TABELA EXISTENTE
    console.log(`Table created!`)
});

module.exports = Questions;
