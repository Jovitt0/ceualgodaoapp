import { drizzle } from "drizzle-orm/mysql2";
import { users, fornecedores, produtos } from "./drizzle/schema.js";
import mysql from "mysql2/promise";

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error("DATABASE_URL não configurada");
  process.exit(1);
}

async function seed() {
  try {
    const db = drizzle(DATABASE_URL);

    console.log("Verificando fornecedor...");
    const fornecedorExistente = await db
      .select()
      .from(fornecedores)
      .limit(1);

    let fornecedorId;

    if (fornecedorExistente.length === 0) {
      console.log("Criando fornecedor padrão...");
      const usuarioExistente = await db
        .select()
        .from(users)
        .limit(1);

      let usuarioId;

      if (usuarioExistente.length === 0) {
        const resultadoUsuario = await db.insert(users).values({
          openId: "fornecedor-default",
          name: "Céu Algodão",
          email: "fornecedor@ceualgodao.com",
          loginMethod: "admin",
          role: "admin",
        });
        usuarioId = resultadoUsuario[0].insertId;
      } else {
        usuarioId = usuarioExistente[0].id;
      }

      const resultadoFornecedor = await db.insert(fornecedores).values({
        usuarioId,
        nomeEmpresa: "Céu Algodão",
        descricao: "Camisetas de qualidade premium",
        logo: "https://img.icons8.com/color/96/000000/cloud.png",
        ativo: true,
      });

      fornecedorId = resultadoFornecedor[0].insertId;
    } else {
      fornecedorId = fornecedorExistente[0].id;
    }

    console.log(`Usando fornecedor ID: ${fornecedorId}`);

    const camisas = [
      {
        nome: "Camisa Básica Branca",
        descricao: "Camisa 100% algodão, confortável e versátil",
        preco: 4999,
        imagem: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop",
        estoque: 50,
      },
      {
        nome: "Camisa Preta Premium",
        descricao: "Camisa preta de alta qualidade, perfeita para qualquer ocasião",
        preco: 5999,
        imagem: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&h=400&fit=crop",
        estoque: 35,
      },
      {
        nome: "Camisa Azul Marinho",
        descricao: "Camisa azul marinho clássica, ideal para o dia a dia",
        preco: 4999,
        imagem: "https://images.unsplash.com/photo-1618354691551-418cb50493e2?w=400&h=400&fit=crop",
        estoque: 42,
      },
      {
        nome: "Camisa Vermelha Vibrante",
        descricao: "Camisa vermelha com toque vibrante e moderno",
        preco: 5499,
        imagem: "https://images.unsplash.com/photo-1586189317135-5d54c9b1b91f?w=400&h=400&fit=crop",
        estoque: 28,
      },
      {
        nome: "Camisa Cinza Mescla",
        descricao: "Camisa cinza mescla confortável e elegante",
        preco: 4799,
        imagem: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop&q=80&blend=https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop&blend-mode=multiply",
        estoque: 55,
      },
    ];

    console.log("Verificando produtos existentes...");
    const produtosExistentes = await db
      .select()
      .from(produtos)
      .limit(1);

    if (produtosExistentes.length === 0) {
      console.log("Criando 5 camisas...");
      for (const camisa of camisas) {
        await db.insert(produtos).values({
          fornecedorId,
          nome: camisa.nome,
          descricao: camisa.descricao,
          preco: camisa.preco,
          imagem: camisa.imagem,
          estoque: camisa.estoque,
          ativo: true,
        });
        console.log(`✓ ${camisa.nome} criada`);
      }
      console.log("\n✅ Banco de dados populado com sucesso!");
    } else {
      console.log("Produtos já existem no banco de dados");
    }

    process.exit(0);
  } catch (error) {
    console.error("Erro ao popular banco de dados:", error);
    process.exit(1);
  }
}

seed();
