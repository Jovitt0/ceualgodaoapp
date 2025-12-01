import { useAuth } from '@/_core/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getLoginUrl } from '@/const';
import { useLocation } from 'wouter';
import { useEffect } from 'react';

export default function LoginFornecedor() {
  const { user, loading, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (isAuthenticated && user?.role === 'admin') {
      setLocation('/fornecedor/dashboard');
    }
  }, [isAuthenticated, user?.role]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-indigo-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-t-lg">
          <CardTitle className="text-2xl">Céu Algodão</CardTitle>
          <CardDescription className="text-indigo-100">Portal do Fornecedor</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="text-center mb-6">
              <p className="text-gray-600 mb-4">Acesso Restrito ao Fornecedor</p>
              <p className="text-sm text-gray-500 mb-6">Faça login para gerenciar seus produtos</p>
            </div>
            <a href={getLoginUrl()}>
              <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 h-auto">
                Fazer Login
              </Button>
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
