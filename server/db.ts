import { eq, and } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, clientes, fornecedores, produtos, pedidos, Cliente, Fornecedor, Produto, Pedido, InsertCliente, InsertFornecedor, InsertProduto, InsertPedido } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function criarCliente(usuarioId: number, dados: Omit<InsertCliente, 'usuarioId'>): Promise<Cliente | null> {
  const db = await getDb();
  if (!db) return null;
  const resultado = await db.insert(clientes).values({ ...dados, usuarioId });
  const id = resultado[0].insertId;
  const cliente = await db.select().from(clientes).where(eq(clientes.id, Number(id))).limit(1);
  return cliente.length > 0 ? cliente[0] : null;
}

export async function obterClientePorUsuarioId(usuarioId: number): Promise<Cliente | null> {
  const db = await getDb();
  if (!db) return null;
  const resultado = await db.select().from(clientes).where(eq(clientes.usuarioId, usuarioId)).limit(1);
  return resultado.length > 0 ? resultado[0] : null;
}

export async function criarFornecedor(usuarioId: number, dados: Omit<InsertFornecedor, 'usuarioId'>): Promise<Fornecedor | null> {
  const db = await getDb();
  if (!db) return null;
  const resultado = await db.insert(fornecedores).values({ ...dados, usuarioId });
  const id = resultado[0].insertId;
  const fornecedor = await db.select().from(fornecedores).where(eq(fornecedores.id, Number(id))).limit(1);
  return fornecedor.length > 0 ? fornecedor[0] : null;
}

export async function obterFornecedorPorUsuarioId(usuarioId: number): Promise<Fornecedor | null> {
  const db = await getDb();
  if (!db) return null;
  const resultado = await db.select().from(fornecedores).where(eq(fornecedores.usuarioId, usuarioId)).limit(1);
  return resultado.length > 0 ? resultado[0] : null;
}

export async function obterFornecedorAtivo(): Promise<Fornecedor | null> {
  const db = await getDb();
  if (!db) return null;
  const resultado = await db.select().from(fornecedores).where(eq(fornecedores.ativo, true)).limit(1);
  return resultado.length > 0 ? resultado[0] : null;
}

export async function criarProduto(dados: InsertProduto): Promise<Produto | null> {
  const db = await getDb();
  if (!db) return null;
  const resultado = await db.insert(produtos).values(dados);
  const id = resultado[0].insertId;
  const produto = await db.select().from(produtos).where(eq(produtos.id, Number(id))).limit(1);
  return produto.length > 0 ? produto[0] : null;
}

export async function obterProdutosPorFornecedor(fornecedorId: number): Promise<Produto[]> {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(produtos).where(and(eq(produtos.fornecedorId, fornecedorId), eq(produtos.ativo, true)));
}

export async function obterProdutoPorId(id: number): Promise<Produto | null> {
  const db = await getDb();
  if (!db) return null;
  const resultado = await db.select().from(produtos).where(eq(produtos.id, id)).limit(1);
  return resultado.length > 0 ? resultado[0] : null;
}

export async function atualizarProduto(id: number, dados: Partial<Omit<Produto, 'id' | 'criadoEm'>>): Promise<Produto | null> {
  const db = await getDb();
  if (!db) return null;
  await db.update(produtos).set(dados).where(eq(produtos.id, id));
  const resultado = await db.select().from(produtos).where(eq(produtos.id, id)).limit(1);
  return resultado.length > 0 ? resultado[0] : null;
}

export async function criarPedido(dados: InsertPedido): Promise<Pedido | null> {
  const db = await getDb();
  if (!db) return null;
  const resultado = await db.insert(pedidos).values(dados);
  const id = resultado[0].insertId;
  const pedido = await db.select().from(pedidos).where(eq(pedidos.id, Number(id))).limit(1);
  return pedido.length > 0 ? pedido[0] : null;
}

export async function obterPedidosPorCliente(clienteId: number): Promise<Pedido[]> {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(pedidos).where(eq(pedidos.clienteId, clienteId));
}

export async function obterPedidosPorFornecedor(fornecedorId: number): Promise<Pedido[]> {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(pedidos).where(eq(pedidos.fornecedorId, fornecedorId));
}

export async function atualizarStatusPedido(id: number, status: string): Promise<Pedido | null> {
  const db = await getDb();
  if (!db) return null;
  await db.update(pedidos).set({ status: status as any }).where(eq(pedidos.id, id));
  const resultado = await db.select().from(pedidos).where(eq(pedidos.id, id)).limit(1);
  return resultado.length > 0 ? resultado[0] : null;
}
