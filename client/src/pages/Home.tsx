import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ShoppingCart, Store } from 'lucide-react';

export default function Home() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-indigo-50">
      <header className="bg-gradient-to-r from-teal-600 to-indigo-600 text-white p-6 shadow-lg">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">Céu Algodão</h1>
          <p className="text-teal-100 text-lg">Plataforma de E-commerce</p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6 py-16">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Bem-vindo ao Céu Algodão</h2>
          <p className="text-xl text-gray-600 mb-8">Escolha seu perfil para continuar</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
          <Card className="bg-white shadow-xl hover:shadow-2xl transition transform hover:scale-105">
            <CardContent className="p-8 text-center">
              <div className="mb-6 flex justify-center">
                <div className="bg-teal-100 p-6 rounded-full">
                  <ShoppingCart size={48} className="text-teal-600" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">Sou Cliente</h3>
              <p className="text-gray-600 mb-6">
                Acesse nossa loja e compre produtos de qualidade com checkout rápido e seguro.
              </p>
              <Button
                onClick={() => setLocation('/cliente/login')}
                className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3 text-lg font-bold"
              >
                Entrar como Cliente
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-xl hover:shadow-2xl transition transform hover:scale-105">
            <CardContent className="p-8 text-center">
              <div className="mb-6 flex justify-center">
                <div className="bg-indigo-100 p-6 rounded-full">
                  <Store size={48} className="text-indigo-600" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">Sou Fornecedor</h3>
              <p className="text-gray-600 mb-6">
                Gerencie seus produtos, visualize pedidos e acompanhe suas vendas em tempo real.
              </p>
              <Button
                onClick={() => setLocation('/fornecedor/login')}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 text-lg font-bold"
              >
                Entrar como Fornecedor
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="mt-16 bg-gradient-to-r from-teal-100 to-indigo-100 p-8 rounded-lg">
          <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">Por que escolher o Céu Algodão?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-teal-600 mb-2">✓</div>
              <h4 className="font-bold text-gray-800 mb-2">Checkout Rápido</h4>
              <p className="text-gray-600">Compre em poucos cliques com nosso sistema simplificado</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-indigo-600 mb-2">✓</div>
              <h4 className="font-bold text-gray-800 mb-2">Produtos de Qualidade</h4>
              <p className="text-gray-600">Seleção cuidadosa de produtos do melhor fornecedor</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-teal-600 mb-2">✓</div>
              <h4 className="font-bold text-gray-800 mb-2">Suporte Confiável</h4>
              <p className="text-gray-600">Atendimento dedicado para clientes e fornecedores</p>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-gray-800 text-white text-center p-6 mt-16">
        <p>&copy; 2025 Céu Algodão. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}
