const express = require('express');
const app = express();
const multer = require('multer');
const Response = require('./db/Response')

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
app.get("/", (req, res) => {
    Questions.findAll({ raw: true, order: [['id', 'DESC']] })
        .then(questions => {
            // Itera sobre cada pergunta para contar o número de respostas associadas a ela
            Promise.all(questions.map(question => {
                return Response.count({
                    where: { questionId: question.id }
                }).then(count => {
                    question.responseCount = count; // Adiciona a contagem de respostas à pergunta
                    return question;
                });
            })).then(questionsWithCount => {
                console.log(questionsWithCount);
                res.render("index", {
                    question: questionsWithCount
                });
            });
        })
        .catch(error => {
            console.error('Erro ao recuperar perguntas:', error);
            res.status(500).send('Erro ao recuperar perguntas');
        });
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
    let image = null;
    if (req.file) {
        image = req.file.filename;
    };

        //INSERE ECRIA O FORMULARIO NO BANCO DE DADOS(MESMA COISA QUE "INSERT INTO database")
        Questions.create({
            name: name,
            title: title,
            textarea: textarea,
            image: image
        }).then(() => { //then
            res.redirect("/"); //REDIRECIONA PARA O INICIO SE TUDO ESTIVER OK!
        });

});

app.get("/question/:id", (req, res) => { //PROCURA A QUESTAO PELO ID
    const id = req.params.id;
    Questions.findOne({ //MESMO QUE SELECT * FROM question WHERE id = :id;
        where: { id: id }
    }).then(question => {
        if (question != undefined) {

            Response.findAll({
                where: {questionId: question.id},
                order: [
                    ['id', 'DESC']
                ]
            }).then(responses => {
                res.render("find", {
                    question: question,
                    responses: responses
                });
            })
        } else {
            res.redirect("/")
        }
    });
});

app.post("/response", (req, res) => {
    const corpo = req.body.corpo;
    const questionId = req.body.questionId;
    const resName = req.body.resName;
    Response.create({
        resName: resName,
        corpo: corpo,
        questionId: questionId
    }).then(() => {
        res.redirect("/question/" + questionId)
    })
})

app.listen(3000, () => {
    console.log("Server running")
});