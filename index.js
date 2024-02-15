const express = require('express');
const app = express();
const multer = require('multer');

const path = require('path'); //importa //GUARDA O DIRETORIO ONDE FICAM OS ARQUIVOS ESTATICOS COMO "INAGEM" E "ESTILOS"
app.use(express.static(path.join(__dirname, 'public')));


const bodyParser = require('body-parser'); // Importa o módulo body-parser, que é um middleware para analisar corpos de requisições HTTP
app.use(bodyParser.urlencoded({ extended: false })); // Configura o middleware para analisar corpos de requisições codificados em URL (application/x-www-form-urlencoded)
app.use(bodyParser.json()); // Configura o middleware para analisar corpos de requisições no formato JSON


const connection = require('./db/db') //model que faz a conexão com o banco de dados
const Questions = require('./db/Questions') //model que representa a tabela quest no banco de dados


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads') // Define o diretório onde os arquivos serão armazenados
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname) // Define o nome do arquivo
    }
});

const upload = multer({ storage: storage });


app.set('view engine', 'ejs');




//RENDERIZA A VIEW 'index.ejs'
app.get("/", (req, res) => { //raw: true renderiza somente as perguntas?
    Questions.findAll({ raw: true, order:[['id', 'DESC']] }) //ORDENA O REGISTRO DA DB POR ID DO MAIOR PARA MENOR (ASC = MENOR PARA MAIOR)
    .then(question => { //MESMA COISA QUE "SELECT * FROM question"
        console.log(question);
        res.render("index", { //EVNVIA PARA O FRONT
            question: question
        });
    })
});


//RENDERIZA A VIEW 'question.ejs'
app.get("/question", (req, res) => {
    res.render("question");
})

app.post("/send", upload.single('image'), (req, res) => {

    //CAPTURA OS DADOS DO FORMULARIO, TRANSFORMA EM VARIAVEL E FAZ A REQUISIÇÃO
    const name = req.body.name;
    const title = req.body.title;
    const textarea = req.body.textarea;

    if(req.file){
    const image = req.file.filename;
    

    //INSERE ECRIA O FORMULARIO NO BANCO DE DADOS(MESMA COISA QUE "INSERT INTO database")
    Questions.create({
        name: name,
        title: title,
        textarea: textarea,
        image: image
    }).then(() => { //then
        res.redirect("/"); //REDIRECIONA PARA O INICIO SE TUDO ESTIVER OK!
    });
    };
})


app.listen(3000, () => {
    console.log("Server running")
});