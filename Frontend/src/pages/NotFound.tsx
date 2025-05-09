import { Link } from 'react-router-dom';
import { Button } from '../components/ui';

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-blue-500">404</h1>
        <h2 className="text-3xl font-semibold text-gray-800 mt-4">Página não encontrada</h2>
        <p className="text-gray-600 mt-2 mb-8">
          A página que você está procurando não existe ou foi removida.
        </p>
        <Link to="/">
          <Button variant="primary">Voltar para o Dashboard</Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;