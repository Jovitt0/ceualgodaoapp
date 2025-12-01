import { useEffect, useState } from 'react';
import { useAuth } from '@/_core/hooks/useAuth';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLocation } from 'wouter';
import { ShoppingCart, LogOut } from 'lucide-react';

export default function ProdutosCliente() {
  const { user, logout, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [fornecedorId, setFornecedorId] = useState<number | null>(null);

  const fornecedorQuery = trpc.fornecedor.obterAtivo.useQuery();
  const produtosQuery = trpc.produto.listarPorFornecedor.useQuery(fornecedorId || 0, {
    enabled: fornecedorId !== null,
  });

  useEffect(() => {
    if (!isAuthenticated) {
      setLocation('/');
    }
    if (fornecedorQuery.data?.id) {
      setFornecedorId(fornecedorQuery.data.id);
    }
  }, [isAuthenticated, fornecedorQuery.data]);

  const handleLogout = async () => {
    await logout();
    setLocation('/');
  };

  const handleComprar = (produtoId: number) => {
    setLocation(`/cliente/checkout/${produtoId}`);
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-teal-100">
      <header className="bg-gradient-to-r from-teal-600 to-teal-700 text-white p-4 shadow-lg">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Céu Algodão</h1>
            <p className="text-teal-100 text-sm">Bem-vindo, {user?.name}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-white text-teal-600 px-4 py-2 rounded-lg hover:bg-teal-50 transition"
          >
            <LogOut size={18} />
            Sair
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-4 pb-20">
        {fornecedorQuery.isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
          </div>
        ) : (
          <>
            {fornecedorQuery.data && (
              <div className="mb-8">
                <Card className="bg-white shadow-lg">
                  <CardHeader className="bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-t-lg">
                    <CardTitle>{fornecedorQuery.data.nomeEmpresa}</CardTitle>
                    <CardDescription className="text-teal-100">
                      {fornecedorQuery.data.descricao}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </div>
            )}

            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Nossos Produtos</h2>
            </div>

            {produtosQuery.isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
              </div>
            ) : produtosQuery.data && produtosQuery.data.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {produtosQuery.data.map((produto) => (
                  <Card key={produto.id} className="bg-white shadow-md hover:shadow-lg transition overflow-hidden">
                    {produto.imagem && (
                      <div className="w-full h-48 bg-gray-200 overflow-hidden">
                        <img
                          src={produto.imagem}
                          alt={produto.nome}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <CardContent className="p-4">
                      <h3 className="font-bold text-lg text-gray-800 mb-2">{produto.nome}</h3>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">{produto.descricao}</p>
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-2xl font-bold text-teal-600">
                          R$ {(produto.preco / 100).toFixed(2)}
                        </span>
                        <span className="text-sm text-gray-500">
                          {produto.estoque > 0 ? `${produto.estoque} em estoque` : 'Fora de estoque'}
                        </span>
                      </div>
                      <Button
                        onClick={() => handleComprar(produto.id)}
                        disabled={produto.estoque <= 0}
                        className="w-full bg-teal-600 hover:bg-teal-700 text-white flex items-center justify-center gap-2"
                      >
                        <ShoppingCart size={18} />
                        Comprar
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="bg-white shadow-md">
                <CardContent className="p-8 text-center">
                  <p className="text-gray-600 text-lg">Nenhum produto disponível no momento</p>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </main>
    </div>
  );
}
