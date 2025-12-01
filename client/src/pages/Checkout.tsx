import { useEffect, useState } from 'react';
import { useAuth } from '@/_core/hooks/useAuth';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLocation, useParams } from 'wouter';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function Checkout() {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const { produtoId } = useParams();
  const [quantidade, setQuantidade] = useState(1);
  const [nomeCliente, setNomeCliente] = useState(user?.name || '');
  const [emailCliente, setEmailCliente] = useState(user?.email || '');
  const [telefoneCliente, setTelefoneCliente] = useState('');
  const [enderecoCliente, setEnderecoCliente] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pedidoConfirmado, setPedidoConfirmado] = useState(false);

  const produtoQuery = trpc.produto.obter.useQuery(Number(produtoId) || 0, {
    enabled: !!produtoId,
  });
  const clienteQuery = trpc.cliente.obter.useQuery();
  const fornecedorQuery = trpc.fornecedor.obterAtivo.useQuery();
  const criarPedidoMutation = trpc.pedido.criar.useMutation();

  useEffect(() => {
    if (!isAuthenticated) {
      setLocation('/');
    }
    if (clienteQuery.data) {
      setEnderecoCliente(clienteQuery.data.endereco || '');
      setTelefoneCliente(clienteQuery.data.telefone || '');
    }
  }, [isAuthenticated, clienteQuery.data]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!produtoQuery.data || !user || !fornecedorQuery.data) return;

    if (!nomeCliente || !emailCliente || !telefoneCliente || !enderecoCliente) {
      toast.error('Por favor, preencha todos os campos');
      return;
    }

    setIsSubmitting(true);
    try {
      const precoTotal = produtoQuery.data.preco * quantidade;
      await criarPedidoMutation.mutateAsync({
        clienteId: user.id,
        fornecedorId: fornecedorQuery.data.id,
        produtoId: produtoQuery.data.id,
        quantidade,
        precoUnitario: produtoQuery.data.preco,
        precoTotal,
        nomeCliente,
        emailCliente,
        telefoneCliente,
        enderecoCliente,
      });
      setPedidoConfirmado(true);
      toast.success('Pedido realizado com sucesso!');
      setTimeout(() => setLocation('/cliente/produtos'), 3000);
    } catch (error) {
      toast.error('Erro ao realizar pedido');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  if (pedidoConfirmado) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 to-teal-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-lg">
          <CardContent className="p-8 text-center">
            <CheckCircle size={64} className="mx-auto text-green-500 mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Pedido Confirmado!</h2>
            <p className="text-gray-600 mb-4">Seu pedido foi realizado com sucesso.</p>
            <p className="text-sm text-gray-500">Redirecionando para produtos...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-teal-100 p-4 pb-20">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => setLocation('/cliente/produtos')}
          className="flex items-center gap-2 text-teal-600 hover:text-teal-700 mb-6 font-medium"
        >
          <ArrowLeft size={20} />
          Voltar
        </button>

        <Card className="bg-white shadow-lg">
          <CardHeader className="bg-gradient-to-r from-teal-600 to-teal-700 text-white rounded-t-lg">
            <CardTitle>Checkout Rápido</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {produtoQuery.isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
              </div>
            ) : produtoQuery.data ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-teal-50 p-4 rounded-lg border border-teal-200">
                  <h3 className="font-bold text-lg text-gray-800 mb-2">{produtoQuery.data.nome}</h3>
                  <p className="text-gray-600 text-sm mb-3">{produtoQuery.data.descricao}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-teal-600">
                      R$ {(produtoQuery.data.preco / 100).toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Quantidade</label>
                    <Input
                      type="number"
                      min="1"
                      max={produtoQuery.data.estoque}
                      value={quantidade}
                      onChange={(e) => setQuantidade(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-full"
                    />
                  </div>

                  <div className="bg-gray-100 p-4 rounded-lg">
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-700">Subtotal:</span>
                      <span className="font-medium">R$ {((produtoQuery.data.preco * quantidade) / 100).toFixed(2)}</span>
                    </div>
                    <div className="border-t pt-2 flex justify-between">
                      <span className="font-bold text-lg">Total:</span>
                      <span className="font-bold text-lg text-teal-600">R$ {((produtoQuery.data.preco * quantidade) / 100).toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h4 className="font-bold text-lg text-gray-800 mb-4">Dados de Entrega</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                      <Input
                        type="text"
                        value={nomeCliente}
                        onChange={(e) => setNomeCliente(e.target.value)}
                        required
                        className="w-full"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <Input
                        type="email"
                        value={emailCliente}
                        onChange={(e) => setEmailCliente(e.target.value)}
                        required
                        className="w-full"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
                      <Input
                        type="tel"
                        value={telefoneCliente}
                        onChange={(e) => setTelefoneCliente(e.target.value)}
                        required
                        className="w-full"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Endereço</label>
                      <Input
                        type="text"
                        value={enderecoCliente}
                        onChange={(e) => setEnderecoCliente(e.target.value)}
                        required
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3 text-lg font-bold"
                >
                  {isSubmitting ? 'Processando...' : 'Confirmar Pedido'}
                </Button>
              </form>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600">Produto não encontrado</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
