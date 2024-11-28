import { ObjectId } from "mongodb";
import conectarAoBanco from "../config/dbconfig.js";

// conexao com o servidor
const conexao = await conectarAoBanco(process.env.STRING_CONEXAO)

// funcao para pegar todos os posts utilizando o banco de dados
export async function getTodosPosts(){
    const db = conexao.db("imersao-instabytes");
    const colecao = db.collection("posts");
    return colecao.find().toArray();
   
}

export async function criarPost(novoPost){
    const db = conexao.db("imersao-instabytes");
    const colecao = db.collection("posts");
    return colecao.insertOne(novoPost);
}

export async function atualizarPost(id, novoPost){
    const db = conexao.db("imersao-instabytes");
    const colecao = db.collection("posts");
    const objID = ObjectId.createFromHexString(id);
    return colecao.updateOne({_id: new ObjectId(objID)}, {$set:novoPost});
}


// QUANDO NÃO HAVIA BANCO DE DADOS
// // Função para buscar um post pelo ID
// function buscarPostPorID(id){
//     return posts.findIndex((post) =>{
//         return post.id === Number(id);
//         // O Number converte o id para número, é só uma medida de preocaução
//         // Os === servem para comparar os valores e tipo de variável
//     }); 