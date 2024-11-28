import { getTodosPosts, criarPost, atualizarPost } from "../models/postsModel.js";
import fs from "fs";
import gerarDescricaoComGemini from "../services/geminiService.js";

// **Função assíncrona para listar todos os posts**
// **Utiliza a função `getTodosPosts` do modelo para buscar os posts no banco de dados.**
// **Retorna os posts em formato JSON com status 200 (sucesso).**
export async function listarPosts(req, res) {
    const posts = await getTodosPosts();
    res.status(200).json(posts);
}

// **Função assíncrona para criar um novo post**
// **Extrai os dados do novo post do corpo da requisição.**
// **Chama a função `criarPost` do modelo para inserir o post no banco de dados.**
// **Retorna o post criado em formato JSON com status 200 (sucesso).**
// **Caso ocorra algum erro, retorna um status 500 e uma mensagem de erro.**
export async function postarNovoPost(req, res) {
    const novoPost = req.body;
    try {
        const postCriado = await criarPost(novoPost);
        res.status(200).json(postCriado);
    } catch (erro) {
        console.error(erro.message);
        res.status(500).json({ "erro": "Falha na requisição" });
    }
}

// **Função assíncrona para fazer upload de uma imagem e criar um novo post**
// **Extrai os dados da imagem do objeto `req.file` (fornecido pelo Multer).**
// **Cria um novo objeto `novoPost` com os dados da imagem e uma descrição vazia por padrão.**
// **Chama a função `criarPost` para inserir o post no banco de dados.**
// **Renomeia o arquivo da imagem para incluir o ID do post criado.**
// **Retorna o post criado em formato JSON com status 200 (sucesso).**
// **Caso ocorra algum erro, retorna um status 500 e uma mensagem de erro.**
export async function uploadImagem(req, res) {
    const novoPost = {
        descricao: "",
        imgUrl: req.file.originalname,
        alt: ""
    };
    try {
        const postCriado = await criarPost(novoPost);
        const ImagemAtualizada = `uploads/${postCriado.insertedId}.png`;
        fs.renameSync(req.file.path, ImagemAtualizada);
        res.status(200).json(postCriado);
    } catch (erro) {
        console.error(erro.message);
        res.status(500).json({ "erro": "Falha na requisição" });
    }
}

export async function atualizarNovoPost(req, res) {
    const id = req.params.id;
    const urlImagem = `http://localhost:3000/${id}.png`;

    try {
        const imageBuffer = fs.readFileSync(`uploads/${id}.png`);

        // Aguardar a geração da descrição antes de continuar
        const descricao = await gerarDescricaoComGemini(imageBuffer);

        // Criar o objeto post com a descrição gerada
        const post = {
            imgUrl: urlImagem,
            descricao: descricao,
            alt: req.body.alt,
        };

        // Atualizar o post no banco de dados
        console.log(post);
        const postCriado = await atualizarPost(id, post);

        res.status(200).json(postCriado);
    } catch (error) {
        console.error("Erro ao atualizar o post:", error);
        if (error.message === 'Falha ao gerar a descrição') {
            res.status(400).json({ error: 'Falha ao gerar a descrição da imagem' });
        } else {
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }
}
