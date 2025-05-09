import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Layout from './components/Layout';

import ClientesList from './pages/clientes/ClientesList';
import ClienteDetail from './pages/clientes/ClienteDetail';
import ClienteForm from './pages/clientes/ClienteForm';
import DependenteForm from './pages/clientes/DependenteForm';
import EnderecoForm from './pages/clientes/EnderecoForm';
import DocumentoForm from './pages/clientes/DocumentoForm';
import TelefoneForm from './pages/clientes/TelefoneForm';
import AcomodacoesList from './pages/acomodacoes/AcomodacoesList';
import AcomodacaoDetail from './pages/acomodacoes/AcomodacaoDetail';
import AcomodacaoForm from './pages/acomodacoes/AcomodacaoForm';
import EstadiasList from './pages/estadias/EstadiasList';
import EstadiaDetail from './pages/estadias/EstadiaDetail';
import EstadiaForm from './pages/estadias/EstadiaForm';
import NotFound from './pages/NotFound';
import Dashboard from './pages/Dashbord';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            
            {/* Cliente routes */}
            <Route path="clientes">
              <Route index element={<ClientesList />} />
              <Route path="novo" element={<ClienteForm />} />
              <Route path=":id" element={<ClienteDetail />} />
              <Route path=":id/editar" element={<ClienteForm />} />
              <Route path=":id/dependente/novo" element={<DependenteForm />} />
              <Route path=":id/endereco/editar" element={<EnderecoForm />} />
              <Route path=":id/documento/novo" element={<DocumentoForm />} />
              <Route path=":id/telefone/novo" element={<TelefoneForm />} />
            </Route>
            
            {/* Acomodacao routes */}
            <Route path="acomodacoes">
              <Route index element={<AcomodacoesList />} />
              <Route path="nova" element={<AcomodacaoForm />} />
              <Route path=":id" element={<AcomodacaoDetail />} />
              <Route path=":id/editar" element={<AcomodacaoForm />} />
            </Route>
            
            {/* Estadia routes */}
            <Route path="estadias">
              <Route index element={<EstadiasList />} />
              <Route path="nova" element={<EstadiaForm />} />
              <Route path=":id" element={<EstadiaDetail />} />
              <Route path=":id/editar" element={<EstadiaForm />} />
            </Route>
            
            {/* Not found route */}
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;