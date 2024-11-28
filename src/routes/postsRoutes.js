import express from 'express';
import multer from "multer";
import { listarPosts, postarNovoPost, uploadImagem, atualizarNovoPost } from '../controller/postsController.js';
import cors from "cors";

// Permite a comunicação entre o backend e o frontend, ou seja ele avisa o backend que uma nova porta vai tentar acessá-lo, nesse caso é a porta 8000, justamente a mesma que está o nosso frontend
const corsOptions = {
    origin:"http://localhost:8000",
    optionsSucessStatus: 200
}
// **Configuração do Multer para armazenamento de arquivos**
// Essa parte é crucial para que o Multer funcione corretamente no Windows,
// definindo o diretório de destino e o nome dos arquivos.
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Define o diretório onde os arquivos serão salvos
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname); // Mantém o nome original do arquivo
    }
});

const upload = multer({ dest: "./uploads", storage });

// **Função para configurar as rotas da aplicação**
const routes = (app) =>{ 
    // **Configura o Express para lidar com requisições JSON**
    // Essencial para trabalhar com dados em formato JSON, como os que serão enviados e recebidos nas rotas.
    app.use(express.json());
    app.use(cors(corsOptions));
    // **Rota para listar todos os posts**
    // Essa rota responde a requisições GET para /posts, retornando a lista completa de posts.
    app.get("/posts", listarPosts);

    // **Rota para criar um novo post**
    // Essa rota responde a requisições POST para /posts, criando um novo post com os dados enviados no corpo da requisição.
    app.post("/posts", postarNovoPost);

    // **Rota para upload de imagens**
    // Essa rota responde a requisições POST para /upload, processando o upload de uma imagem e chamando a função uploadImagem para lidar com o arquivo.
    // O parâmetro `upload.single('imagem')` indica que a rota espera um único arquivo com o nome 'imagem' no corpo da requisição.
    app.post("/upload", upload.single("imagem"), uploadImagem);

    // Rota para editar/atualizar um post
    app.put("/upload/:id", atualizarNovoPost);
}

export default routes;

// AQUI AINDA NÃO EXISTIA BANCO DE DADOS SOMENTE (MOCK)
// **Rota para buscar um post por ID (comentada)**
// // Endpoint que mostra um post a partir de seu id
// // O dois pontos na url indicam que o valor será substituído por um dado variável
// app.get("/posts/:id", (req, res) =>{
//     // Inicializando a função de buscar o post pelo id por meio da variável index
//     const index = buscarPostPorID(req.params.id);
//     res.status(200).json(posts[index]);
// });