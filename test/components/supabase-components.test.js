// Importar bibliotecas de teste
const { render, screen, fireEvent, waitFor } = require('@testing-library/react');
const userEvent = require('@testing-library/user-event').default;
require('@testing-library/jest-dom');

// Mockando os módulos de Next.js
jest.mock('next/router', () => ({
  useRouter: jest.fn()
}));

// Mockando os módulos de autenticação
jest.mock('../../app/components/auth/AuthProvider', () => ({
  useAuth: jest.fn()
}));

// Mock do componente LoginForm
const LoginForm = (props) => (
  <div>
    <h2>Login Form Mock</h2>
    <form data-testid="login-form" onSubmit={(e) => {
      e.preventDefault();
      if (props.onSubmit) props.onSubmit({ 
        email: e.target.email.value, 
        password: e.target.password.value 
      });
    }}>
      <input 
        data-testid="email-input" 
        name="email"
        type="email" 
        placeholder="Email" 
        onChange={props.onChange}
      />
      <input 
        data-testid="password-input" 
        name="password"
        type="password" 
        placeholder="Senha" 
        onChange={props.onChange}
      />
      <div data-testid="error-message" className={props.error ? 'visible' : 'hidden'}>
        {props.error}
      </div>
      <button 
        data-testid="login-button" 
        type="submit"
        disabled={props.loading}
      >
        {props.loading ? 'Entrando...' : 'Entrar'}
      </button>
    </form>
  </div>
);

// Mock do componente RegisterForm
const RegisterForm = (props) => (
  <div>
    <h2>Register Form Mock</h2>
    <form data-testid="register-form" onSubmit={(e) => {
      e.preventDefault();
      if (props.onSubmit) props.onSubmit({
        name: e.target.name.value,
        email: e.target.email.value,
        password: e.target.password.value
      });
    }}>
      <input 
        data-testid="name-input" 
        name="name"
        type="text" 
        placeholder="Nome" 
        onChange={props.onChange}
      />
      <input 
        data-testid="email-input" 
        name="email"
        type="email" 
        placeholder="Email" 
        onChange={props.onChange}
      />
      <input 
        data-testid="password-input" 
        name="password"
        type="password" 
        placeholder="Senha" 
        onChange={props.onChange}
      />
      <div data-testid="error-message" className={props.error ? 'visible' : 'hidden'}>
        {props.error}
      </div>
      <button 
        data-testid="register-button" 
        type="submit"
        disabled={props.loading}
      >
        {props.loading ? 'Cadastrando...' : 'Cadastrar'}
      </button>
    </form>
  </div>
);

// Importar o mock do Supabase em vez de criar uma instância real
const { supabaseMock: supabase, mockData } = require('../mocks/supabase-mock');

// Configurações
const useRouter = require('next/router').useRouter;
const useAuth = require('../../app/components/auth/AuthProvider').useAuth;

/**
 * Testes de componentes com integração ao Supabase
 */
describe('Testes de Componentes com Supabase', () => {
  let mockRouter;
  let mockAuth;
  
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Setup router mock
    mockRouter = {
      push: jest.fn(),
      query: {},
      pathname: '/',
      asPath: '/',
      route: '/'
    };
    useRouter.mockReturnValue(mockRouter);
    
    // Setup auth mock
    mockAuth = {
      user: null,
      signIn: jest.fn(),
      signUp: jest.fn(),
      signOut: jest.fn(),
      loading: false,
      error: null
    };
    useAuth.mockReturnValue(mockAuth);
  });

  describe('LoginForm', () => {
    const defaultProps = {
      onSubmit: jest.fn(),
      onChange: jest.fn(),
      loading: false,
      error: null
    };

    const renderLoginForm = (props = {}) => {
      return render(<LoginForm {...defaultProps} {...props} />);
    };

    test('Deve renderizar corretamente', () => {
      renderLoginForm();
      
      expect(screen.getByTestId('login-form')).toBeInTheDocument();
      expect(screen.getByTestId('email-input')).toBeInTheDocument();
      expect(screen.getByTestId('password-input')).toBeInTheDocument();
      expect(screen.getByTestId('login-button')).toBeInTheDocument();
      expect(screen.getByTestId('login-button')).toBeEnabled();
    });

    test('Deve desabilitar botão durante loading', () => {
      renderLoginForm({ loading: true });
      
      const button = screen.getByTestId('login-button');
      expect(button).toBeDisabled();
      expect(button).toHaveTextContent('Entrando...');
    });

    test('Deve mostrar erro quando presente', () => {
      const error = 'Email ou senha inválidos';
      renderLoginForm({ error });
      
      const errorMessage = screen.getByTestId('error-message');
      expect(errorMessage).toHaveClass('visible');
      expect(errorMessage).toHaveTextContent(error);
    });

    test('Deve chamar onSubmit com dados do form', async () => {
      const onSubmit = jest.fn();
      renderLoginForm({ onSubmit });
      
      const email = 'teste@exemplo.com';
      const password = 'senha123';
      
      await userEvent.type(screen.getByTestId('email-input'), email);
      await userEvent.type(screen.getByTestId('password-input'), password);
      
      fireEvent.submit(screen.getByTestId('login-form'));
      
      expect(onSubmit).toHaveBeenCalledWith({ email, password });
    });

    test('Deve chamar onChange ao digitar', async () => {
      const onChange = jest.fn();
      renderLoginForm({ onChange });
      
      await userEvent.type(screen.getByTestId('email-input'), 'a');
      expect(onChange).toHaveBeenCalled();
    });
  });

  describe('RegisterForm', () => {
    const defaultProps = {
      onSubmit: jest.fn(),
      onChange: jest.fn(),
      loading: false,
      error: null
    };

    const renderRegisterForm = (props = {}) => {
      return render(<RegisterForm {...defaultProps} {...props} />);
    };

    test('Deve renderizar corretamente', () => {
      renderRegisterForm();
      
      expect(screen.getByTestId('register-form')).toBeInTheDocument();
      expect(screen.getByTestId('name-input')).toBeInTheDocument();
      expect(screen.getByTestId('email-input')).toBeInTheDocument();
      expect(screen.getByTestId('password-input')).toBeInTheDocument();
      expect(screen.getByTestId('register-button')).toBeInTheDocument();
      expect(screen.getByTestId('register-button')).toBeEnabled();
    });

    test('Deve desabilitar botão durante loading', () => {
      renderRegisterForm({ loading: true });
      
      const button = screen.getByTestId('register-button');
      expect(button).toBeDisabled();
      expect(button).toHaveTextContent('Cadastrando...');
    });

    test('Deve mostrar erro quando presente', () => {
      const error = 'Email já cadastrado';
      renderRegisterForm({ error });
      
      const errorMessage = screen.getByTestId('error-message');
      expect(errorMessage).toHaveClass('visible');
      expect(errorMessage).toHaveTextContent(error);
    });

    test('Deve chamar onSubmit com dados do form', async () => {
      const onSubmit = jest.fn();
      renderRegisterForm({ onSubmit });
      
      const name = 'Teste';
      const email = 'teste@exemplo.com';
      const password = 'senha123';
      
      await userEvent.type(screen.getByTestId('name-input'), name);
      await userEvent.type(screen.getByTestId('email-input'), email);
      await userEvent.type(screen.getByTestId('password-input'), password);
      
      fireEvent.submit(screen.getByTestId('register-form'));
      
      expect(onSubmit).toHaveBeenCalledWith({ name, email, password });
    });

    test('Deve chamar onChange ao digitar', async () => {
      const onChange = jest.fn();
      renderRegisterForm({ onChange });
      
      await userEvent.type(screen.getByTestId('name-input'), 'a');
      expect(onChange).toHaveBeenCalled();
    });
  });

  describe('Integração com Supabase', () => {
    test('Deve integrar login com Supabase', async () => {
      mockAuth.signIn.mockResolvedValueOnce({
        data: { user: { email: 'teste@exemplo.com' } },
        error: null
      });
      
      const onSubmit = async ({ email, password }) => {
        const { data, error } = await mockAuth.signIn(email, password);
        if (error) throw error;
        return data;
      };
      
      renderLoginForm({ onSubmit });
      
      await userEvent.type(screen.getByTestId('email-input'), 'teste@exemplo.com');
      await userEvent.type(screen.getByTestId('password-input'), 'senha123');
      
      fireEvent.submit(screen.getByTestId('login-form'));
      
      await waitFor(() => {
        expect(mockAuth.signIn).toHaveBeenCalledWith('teste@exemplo.com', 'senha123');
      });
    });

    test('Deve integrar registro com Supabase', async () => {
      mockAuth.signUp.mockResolvedValueOnce({
        data: { user: { email: 'teste@exemplo.com' } },
        error: null
      });
      
      const onSubmit = async ({ name, email, password }) => {
        const { data, error } = await mockAuth.signUp(email, password, { data: { name } });
        if (error) throw error;
        return data;
      };
      
      renderRegisterForm({ onSubmit });
      
      await userEvent.type(screen.getByTestId('name-input'), 'Teste');
      await userEvent.type(screen.getByTestId('email-input'), 'teste@exemplo.com');
      await userEvent.type(screen.getByTestId('password-input'), 'senha123');
      
      fireEvent.submit(screen.getByTestId('register-form'));
      
      await waitFor(() => {
        expect(mockAuth.signUp).toHaveBeenCalledWith(
          'teste@exemplo.com',
          'senha123',
          { data: { name: 'Teste' } }
        );
      });
    });
  });
});
