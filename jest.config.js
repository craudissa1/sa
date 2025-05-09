module.exports = {
  // Ambiente de teste
  testEnvironment: 'jsdom',
  
  // Diretórios de teste
  roots: ['<rootDir>/test'],
  testMatch: ['**/*.test.js', '**/*.spec.js'],
  
  // Configurações de cobertura
  collectCoverageFrom: [
    'app/**/*.{js,jsx,ts,tsx}',
    '!app/**/*.d.ts',
    '!app/api/**',
    '!app/types/**',
    '!**/node_modules/**'
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },
  
  // Setup e transformações
  setupFilesAfterEnv: ['<rootDir>/test/setup/jest-setup.js'],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { presets: ['next/babel'] }]
  },
  
  // Módulos e mocks
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/app/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/test/mocks/fileMock.js'
  },
  
  // Configurações adicionais
  verbose: true,
  testTimeout: 30000,
  maxWorkers: '50%',
  
  // Relatórios
  reporters: ['default'],
  
  // Configurações de ambiente
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.json'
    }
  },
  
  // Ignorar arquivos
  watchPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/.next/',
    '<rootDir>/coverage/'
  ],
  
  // Cache
  cacheDirectory: '<rootDir>/.jest-cache'
}; 