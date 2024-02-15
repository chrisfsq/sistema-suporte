const Sequelize = require('sequelize'); //IMPORTA O SEQUELIZE

const connection = new Sequelize('question', 'root', '01041993', { //CRIA A CONEXÃO COM BANCO DE DADOS "QUESTION"
    host: 'localhost',
    dialect: 'mysql'
});


//FAZ A AUTENTICAÇÃO COM O BANCO DE DADOS
connection.authenticate().then(() => {
    console.log("Database connected sucessfuly!")
}).catch((err) => {
    console.log("Database connection failed.", err)
})



module.exports = connection; //EXPORTA A CONEXÃO