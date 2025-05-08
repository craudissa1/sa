// Arquivo de configuração para o Jest
// Este arquivo é carregado automaticamente antes dos testes

// Importar bibliotecas necessárias
require('@testing-library/jest-dom');
const { TextEncoder, TextDecoder } = require('util');
const { act } = require('@testing-library/react');
const { configure } = require('@testing-library/react');

// Polyfills
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Configurar timeout para testes assíncronos
jest.setTimeout(30000);

// Configurar Testing Library
configure({
  testIdAttribute: 'data-testid',
  asyncUtilTimeout: 5000,
  computedStyleSupportsPseudoElements: true,
  defaultHidden: true
});

// Mock para React
global.React = require('react');

// Suprimir os logs durante os testes para tornar a saída mais limpa
// Descomente estas linhas para ver logs durante a depuração
// console.log = jest.fn();
// console.warn = jest.fn();
// console.error = jest.fn();

// Mock mais robusto para fetch usado pelo Supabase
global.fetch = jest.fn(() => 
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ data: null, error: null }),
    status: 200,
    headers: new Map(),
    statusText: 'OK'
  })
);

// Mock do localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn()
};
global.localStorage = localStorageMock;

// Mock do sessionStorage
const sessionStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn()
};
global.sessionStorage = sessionStorageMock;

// Mock do window
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn()
  }))
});

// Mock do ResizeObserver
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Mock do IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {
    this.observe = jest.fn();
    this.unobserve = jest.fn();
    this.disconnect = jest.fn();
  }
};

// Adicionar matcher customizado para erros do Supabase
expect.extend({
  toBeSupabaseError(received) {
    const pass = received && 
      typeof received === 'object' && 
      'message' in received &&
      'code' in received;
      
    return {
      pass,
      message: () => pass
        ? `Expected ${received} not to be a Supabase error`
        : `Expected ${received} to be a Supabase error`
    };
  },
  
  toHaveBeenCalledOnceWith(received, ...args) {
    const pass = received.mock.calls.length === 1 &&
      JSON.stringify(received.mock.calls[0]) === JSON.stringify(args);
      
    return {
      pass,
      message: () => pass
        ? `Expected ${received} not to have been called once with ${args}`
        : `Expected ${received} to have been called once with ${args}`
    };
  }
});

// Limpar mocks após cada teste
afterEach(() => {
  jest.clearAllMocks();
  localStorage.clear();
  sessionStorage.clear();
  fetch.mockClear();
});

// Silenciar warnings esperados
const originalError = console.error;
const originalWarn = console.warn;

beforeAll(() => {
  console.error = (...args) => {
    if (
      /Warning: ReactDOM.render is no longer supported/.test(args[0]) ||
      /Warning: React.createFactory/.test(args[0]) ||
      /Warning: React has detected a change in the order of Hooks/.test(args[0])
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
  
  console.warn = (...args) => {
    if (
      /Warning: useLayoutEffect does nothing on the server/.test(args[0]) ||
      /Warning: React.createElement: type is invalid/.test(args[0])
    ) {
      return;
    }
    originalWarn.call(console, ...args);
  };
});

// Restaurar console original
afterAll(() => {
  console.error = originalError;
  console.warn = originalWarn;
});
