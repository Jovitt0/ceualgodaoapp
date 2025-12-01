import { useState } from 'react';
import { useAuth } from '@/_core/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getLoginUrl } from '@/const';
import { useLocation } from 'wouter';

export default function LoginCliente() {
  const { user, loading, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 to-teal-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  if (isAuthenticated && user) {
    setLocation('/cliente/produtos');
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 to-teal-100 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="bg-gradient-to-r from-teal-600 to-teal-700 text-white rounded-t-lg">
          <CardTitle className="text-2xl">Céu Algodão</CardTitle>
          <CardDescription className="text-teal-100">Faça login para continuar</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="text-center mb-6">
              <p className="text-gray-600 mb-4">Bem-vindo ao Céu Algodão App</p>
              <p className="text-sm text-gray-500 mb-6">Faça login para acessar nossos produtos</p>
            </div>
            <a href={getLoginUrl()}>
              <Button className="w-full bg-teal-600 hover:bg-teal-700 text-white py-2 h-auto">
                Fazer Login
              </Button>
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
