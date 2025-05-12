'use client'

import { Button } from '@/app/components/ui/Button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/app/components/ui/Card'
import { CheckCircle2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function EmailConfirmedPage() {
  const router = useRouter()

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="flex flex-col items-center space-y-2 text-center">
          <CheckCircle2 className="h-16 w-16 text-green-500" />
          <CardTitle className="text-2xl">Email Confirmado!</CardTitle>
          <CardDescription>
            Seu endereço de email foi confirmado com sucesso.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-muted-foreground">
            Agora você pode fazer login em sua conta e acessar todos os recursos da plataforma.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button onClick={() => router.push('/login')} size="lg">
            Fazer Login
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
} 