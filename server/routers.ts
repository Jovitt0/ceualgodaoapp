import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import { criarCliente, obterClientePorUsuarioId, criarFornecedor, obterFornecedorPorUsuarioId, obterFornecedorAtivo, criarProduto, obterProdutosPorFornecedor, obterProdutoPorId, atualizarProduto, criarPedido, obterPedidosPorCliente, obterPedidosPorFornecedor, atualizarStatusPedido } from "./db";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  cliente: router({
    criar: protectedProcedure.input(z.object({
      telefone: z.string().optional(),
      endereco: z.string().optional(),
      cidade: z.string().optional(),
      estado: z.string().optional(),
      cep: z.string().optional(),
    })).mutation(({ ctx, input }) => criarCliente(ctx.user.id, input)),
    obter: protectedProcedure.query(({ ctx }) => obterClientePorUsuarioId(ctx.user.id)),
  }),

  fornecedor: router({
    criar: protectedProcedure.input(z.object({
      nomeEmpresa: z.string(),
      descricao: z.string().optional(),
      logo: z.string().optional(),
    })).mutation(({ ctx, input }) => criarFornecedor(ctx.user.id, input)),
    obter: protectedProcedure.query(({ ctx }) => obterFornecedorPorUsuarioId(ctx.user.id)),
    obterAtivo: publicProcedure.query(() => obterFornecedorAtivo()),
  }),

  produto: router({
    criar: protectedProcedure.input(z.object({
      fornecedorId: z.number(),
      nome: z.string(),
      descricao: z.string().optional(),
      preco: z.number(),
      imagem: z.string().optional(),
      estoque: z.number().default(0),
    })).mutation(({ input }) => criarProduto(input)),
    listarPorFornecedor: publicProcedure.input(z.number()).query(({ input }) => obterProdutosPorFornecedor(input)),
    obter: publicProcedure.input(z.number()).query(({ input }) => obterProdutoPorId(input)),
    atualizar: protectedProcedure.input(z.object({
      id: z.number(),
      nome: z.string().optional(),
      descricao: z.string().optional(),
      preco: z.number().optional(),
      imagem: z.string().optional(),
      estoque: z.number().optional(),
      ativo: z.boolean().optional(),
    })).mutation(({ input: { id, ...dados } }) => atualizarProduto(id, dados)),
  }),

  pedido: router({
    criar: publicProcedure.input(z.object({
      clienteId: z.number(),
      fornecedorId: z.number(),
      produtoId: z.number(),
      quantidade: z.number(),
      precoUnitario: z.number(),
      precoTotal: z.number(),
      nomeCliente: z.string(),
      emailCliente: z.string(),
      telefoneCliente: z.string().optional(),
      enderecoCliente: z.string().optional(),
    })).mutation(({ input }) => criarPedido(input)),
    listarCliente: protectedProcedure.query(({ ctx }) => obterPedidosPorCliente(ctx.user.id)),
    listarFornecedor: protectedProcedure.query(({ ctx }) => obterPedidosPorFornecedor(ctx.user.id)),
    atualizarStatus: protectedProcedure.input(z.object({
      id: z.number(),
      status: z.string(),
    })).mutation(({ input }) => atualizarStatusPedido(input.id, input.status)),
  }),
});

export type AppRouter = typeof appRouter;
