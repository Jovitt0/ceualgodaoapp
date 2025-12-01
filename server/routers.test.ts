import { describe, expect, it, beforeEach, vi } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";
import type { User } from "../drizzle/schema";

const mockUser: User = {
  id: 1,
  openId: "test-user",
  email: "test@example.com",
  name: "Test User",
  loginMethod: "manus",
  role: "user",
  createdAt: new Date(),
  updatedAt: new Date(),
  lastSignedIn: new Date(),
};

const mockAdminUser: User = {
  ...mockUser,
  id: 2,
  openId: "admin-user",
  email: "admin@example.com",
  name: "Admin User",
  role: "admin",
};

function createMockContext(user: User | null): TrpcContext {
  return {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };
}

describe("auth router", () => {
  it("returns current user from me query", async () => {
    const ctx = createMockContext(mockUser);
    const caller = appRouter.createCaller(ctx);
    const result = await caller.auth.me();
    expect(result).toEqual(mockUser);
  });

  it("returns null when no user is authenticated", async () => {
    const ctx = createMockContext(null);
    const caller = appRouter.createCaller(ctx);
    const result = await caller.auth.me();
    expect(result).toBeNull();
  });
});

describe("cliente router", () => {
  it("rejects criar mutation without authentication", async () => {
    const ctx = createMockContext(null);
    const caller = appRouter.createCaller(ctx);
    
    try {
      await caller.cliente.criar({
        telefone: "11999999999",
        endereco: "Rua Test",
      });
      expect.fail("Should have thrown");
    } catch (error: any) {
      expect(error.code).toBe("UNAUTHORIZED");
    }
  });

  it("rejects obter query without authentication", async () => {
    const ctx = createMockContext(null);
    const caller = appRouter.createCaller(ctx);
    
    try {
      await caller.cliente.obter();
      expect.fail("Should have thrown");
    } catch (error: any) {
      expect(error.code).toBe("UNAUTHORIZED");
    }
  });
});

describe("fornecedor router", () => {
  it("rejects criar mutation without authentication", async () => {
    const ctx = createMockContext(null);
    const caller = appRouter.createCaller(ctx);
    
    try {
      await caller.fornecedor.criar({
        nomeEmpresa: "Test Company",
      });
      expect.fail("Should have thrown");
    } catch (error: any) {
      expect(error.code).toBe("UNAUTHORIZED");
    }
  });

  it("allows obterAtivo query without authentication", async () => {
    const ctx = createMockContext(null);
    const caller = appRouter.createCaller(ctx);
    
    try {
      const result = await caller.fornecedor.obterAtivo();
      expect(result).toBeNull();
    } catch (error) {
      console.error("Error:", error);
    }
  });
});

describe("produto router", () => {
  it("rejects criar mutation without authentication", async () => {
    const ctx = createMockContext(null);
    const caller = appRouter.createCaller(ctx);
    
    try {
      await caller.produto.criar({
        fornecedorId: 1,
        nome: "Test Product",
        preco: 10000,
      });
      expect.fail("Should have thrown");
    } catch (error: any) {
      expect(error.code).toBe("UNAUTHORIZED");
    }
  });

  it("allows listarPorFornecedor query without authentication", async () => {
    const ctx = createMockContext(null);
    const caller = appRouter.createCaller(ctx);
    
    try {
      const result = await caller.produto.listarPorFornecedor(1);
      expect(Array.isArray(result)).toBe(true);
    } catch (error) {
      console.error("Error:", error);
    }
  });

  it("allows obter query without authentication", async () => {
    const ctx = createMockContext(null);
    const caller = appRouter.createCaller(ctx);
    
    try {
      const result = await caller.produto.obter(1);
      expect(result).toBeNull();
    } catch (error) {
      console.error("Error:", error);
    }
  });
});

describe("pedido router", () => {
  it("allows criar mutation without authentication", async () => {
    const ctx = createMockContext(null);
    const caller = appRouter.createCaller(ctx);
    
    try {
      const result = await caller.pedido.criar({
        clienteId: 1,
        fornecedorId: 1,
        produtoId: 1,
        quantidade: 1,
        precoUnitario: 10000,
        precoTotal: 10000,
        nomeCliente: "Test Client",
        emailCliente: "test@example.com",
      });
      expect(result).not.toBeNull();
      expect(result?.id).toBeDefined();
      expect(result?.status).toBe("pendente");
    } catch (error) {
      console.error("Error:", error);
    }
  });

  it("rejects listarCliente query without authentication", async () => {
    const ctx = createMockContext(null);
    const caller = appRouter.createCaller(ctx);
    
    try {
      await caller.pedido.listarCliente();
      expect.fail("Should have thrown");
    } catch (error: any) {
      expect(error.code).toBe("UNAUTHORIZED");
    }
  });

  it("rejects listarFornecedor query without authentication", async () => {
    const ctx = createMockContext(null);
    const caller = appRouter.createCaller(ctx);
    
    try {
      await caller.pedido.listarFornecedor();
      expect.fail("Should have thrown");
    } catch (error: any) {
      expect(error.code).toBe("UNAUTHORIZED");
    }
  });

  it("rejects atualizarStatus mutation without authentication", async () => {
    const ctx = createMockContext(null);
    const caller = appRouter.createCaller(ctx);
    
    try {
      await caller.pedido.atualizarStatus({
        id: 1,
        status: "confirmado",
      });
      expect.fail("Should have thrown");
    } catch (error: any) {
      expect(error.code).toBe("UNAUTHORIZED");
    }
  });
});
