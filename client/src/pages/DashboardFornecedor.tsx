import { useEffect, useState } from 'react';
import { useAuth } from '@/_core/hooks/useAuth';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLocation } from 'wouter';
import { LogOut, Plus, Edit2, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export default function DashboardFornecedor() {
  const { user, logout, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [showFormProduto, setShowFormProduto] = useState(false);
  const [nomeProduto, setNomeProduto] = useState('');
  const [descricaoProduto, setDescricaoProduto] = useState('');
  const [precoProduto, setPrecoProduto] = useState('');
  const [estoqueProduto, setEstoqueProduto] = useState('');
  const [imagemProduto, setImagemProduto] = useState('');

  const fornecedorQuery = trpc.fornecedor.obter.useQuery();
  const produtosQuery = trpc.produto.listarPorFornecedor.useQuery(fornecedorQuery.data?.id || 0, {
    enabled: !!fornecedorQuery.data?.id,
  });
  const pedidosQuery = trpc.pedido.listarFornecedor.useQuery();
  const criarProdutoMutation = trpc.produto.criar.useMutation();

  useEffect(() => {
    if (!isAuthenticated) {
      setLocation('/fornecedor/login');
    }
    if (user?.role !== 'admin') {
      setLocation('/fornecedor/login');
    }
  }, [isAuthenticated, user?.role]);

  const handleLogout = async () => {
    await logout();
    setLocation('/fornecedor/login');
  };

  const handleCriarProduto = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fornecedorQuery.data) return;

    if (!nomeProduto || !precoProduto || !estoqueProduto) {
      toast.error('Preencha os campos obrigatórios');
      return;
    }

    try {
      await criarProdutoMutation.mutateAsync({
        fornecedorId: fornecedorQuery.data.id,
        nome: nomeProduto,
        descricao: descricaoProduto,
        preco: Math.round(parseFloat(precoProduto) * 100),
        imagem: imagemProduto,
        estoque: parseInt(estoqueProduto),
      });
      setNomeProduto('');
      setDescricaoProduto('');
      setPrecoProduto('');
      setEstoqueProduto('');
      setImagemProduto('');
      setShowFormProduto(false);
      produtosQuery.refetch();
      toast.success('Produto criado com sucesso!');
    } catch (error) {
      toast.error('Erro ao criar produto');
      console.error(error);
    }
  };

  if (!isAuthenticated || user?.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-indigo-100">
      <header className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white p-4 shadow-lg">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Dashboard do Fornecedor</h1>
            <p className="text-indigo-100 text-sm">{fornecedorQuery.data?.nomeEmpresa || 'Carregando...'}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-white text-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-50 transition"
          >
            <LogOut size={18} />
            Sair
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-4 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="bg-white shadow-md">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-indigo-600">{produtosQuery.data?.length || 0}</div>
              <div className="text-gray-600 text-sm">Produtos</div>
            </CardContent>
          </Card>
          <Card className="bg-white shadow-md">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-indigo-600">{pedidosQuery.data?.length || 0}</div>
              <div className="text-gray-600 text-sm">Pedidos</div>
            </CardContent>
          </Card>
          <Card className="bg-white shadow-md">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-indigo-600">
                R$ {pedidosQuery.data?.reduce((acc, p) => acc + p.precoTotal, 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '0,00'}
              </div>
              <div className="text-gray-600 text-sm">Faturamento</div>
            </CardContent>
          </Card>
        </div>

        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">Produtos</h2>
            <Button
              onClick={() => setShowFormProduto(!showFormProduto)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2"
            >
              <Plus size={18} />
              Novo Produto
            </Button>
          </div>

          {showFormProduto && (
            <Card className="bg-white shadow-md mb-6">
              <CardContent className="p-6">
                <form onSubmit={handleCriarProduto} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Produto</label>
                    <Input
                      type="text"
                      value={nomeProduto}
                      onChange={(e) => setNomeProduto(e.target.value)}
                      required
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                    <Input
                      type="text"
                      value={descricaoProduto}
                      onChange={(e) => setDescricaoProduto(e.target.value)}
                      className="w-full"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Preço (R$)</label>
                      <Input
                        type="number"
                        step="0.01"
                        value={precoProduto}
                        onChange={(e) => setPrecoProduto(e.target.value)}
                        required
                        className="w-full"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Estoque</label>
                      <Input
                        type="number"
                        value={estoqueProduto}
                        onChange={(e) => setEstoqueProduto(e.target.value)}
                        required
                        className="w-full"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">URL da Imagem</label>
                    <Input
                      type="text"
                      value={imagemProduto}
                      onChange={(e) => setImagemProduto(e.target.value)}
                      className="w-full"
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button type="submit" className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white">
                      Criar Produto
                    </Button>
                    <Button
                      type="button"
                      onClick={() => setShowFormProduto(false)}
                      className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800"
                    >
                      Cancelar
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {produtosQuery.isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
          ) : produtosQuery.data && produtosQuery.data.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {produtosQuery.data.map((produto) => (
                <Card key={produto.id} className="bg-white shadow-md">
                  <CardContent className="p-4">
                    <h3 className="font-bold text-lg text-gray-800 mb-2">{produto.nome}</h3>
                    <p className="text-gray-600 text-sm mb-2 line-clamp-2">{produto.descricao}</p>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-xl font-bold text-indigo-600">
                        R$ {(produto.preco / 100).toFixed(2)}
                      </span>
                      <span className="text-sm bg-indigo-100 text-indigo-800 px-2 py-1 rounded">
                        {produto.estoque} em estoque
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Button className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 flex items-center justify-center gap-1">
                        <Edit2 size={16} />
                        Editar
                      </Button>
                      <Button className="flex-1 bg-red-300 hover:bg-red-400 text-red-800 flex items-center justify-center gap-1">
                        <Trash2 size={16} />
                        Deletar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="bg-white shadow-md">
              <CardContent className="p-8 text-center">
                <p className="text-gray-600 text-lg">Nenhum produto criado ainda</p>
              </CardContent>
            </Card>
          )}
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Pedidos Recentes</h2>
          {pedidosQuery.isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
          ) : pedidosQuery.data && pedidosQuery.data.length > 0 ? (
            <div className="space-y-4">
              {pedidosQuery.data.slice(0, 5).map((pedido) => (
                <Card key={pedido.id} className="bg-white shadow-md">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-bold text-gray-800">{pedido.nomeCliente}</p>
                        <p className="text-sm text-gray-600">{pedido.emailCliente}</p>
                        <p className="text-sm text-gray-600">Quantidade: {pedido.quantidade}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-indigo-600">
                          R$ {(pedido.precoTotal / 100).toFixed(2)}
                        </p>
                        <span className={`text-xs px-2 py-1 rounded ${
                          pedido.status === 'pendente' ? 'bg-yellow-100 text-yellow-800' :
                          pedido.status === 'confirmado' ? 'bg-blue-100 text-blue-800' :
                          pedido.status === 'enviado' ? 'bg-purple-100 text-purple-800' :
                          pedido.status === 'entregue' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {pedido.status}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="bg-white shadow-md">
              <CardContent className="p-8 text-center">
                <p className="text-gray-600 text-lg">Nenhum pedido ainda</p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
