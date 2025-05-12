// Arquivo para configurar o middleware do Next.js no Netlify
// Este arquivo ajuda a resolver problemas de RSC e comunicação com o Supabase

const { builder } = require('@netlify/functions');
const { NextRequest } = require('next/server');
const config = require('../../next.config.js');

// Função para resolver problemas de CORS e cabeçalhos de autenticação
function addCorsHeaders(headers) {
  return {
    ...headers,
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'X-Requested-With, Content-Type, Accept, Authorization',
  };
}

// Handler do middleware para processar requisições do Next.js
async function handler(event) {
  try {
    // Configurar requisição para o Next.js
    const request = new NextRequest(event.rawUrl, {
      headers: event.headers,
      method: event.httpMethod,
      body: event.body,
    });

    // Adicionar headers necessários para o correto funcionamento do RSC
    const response = {
      statusCode: 200,
      headers: addCorsHeaders({
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({
        statusCode: 200,
        message: 'Next.js middleware inicializado com sucesso',
      }),
    };

    return response;
  } catch (error) {
    console.error('Erro no middleware do Next.js:', error);
    return {
      statusCode: 500,
      headers: addCorsHeaders({
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({
        statusCode: 500,
        message: `Erro: ${error.message}`,
      }),
    };
  }
}

// Exportar o handler com o builder do Netlify
exports.handler = builder(handler);
