import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { FaUsers, FaBed, FaCalendarAlt } from 'react-icons/fa';
import { Card, Spinner, PageHeader } from '../components/ui';
import { clienteService, acomodacaoService, estadiaService } from '../api/services';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const Dashboard = () => {
  // Fetch summary data
  const { data: clientes, isLoading: loadingClientes } = useQuery({
    queryKey: ['clientesSummary'],
    queryFn: async () => {
      const response = await clienteService.getAllClientes();
      return response.data;
    }
  });

  const { data: acomodacoes, isLoading: loadingAcomodacoes } = useQuery({
    queryKey: ['acomodacoesSummary'],
    queryFn: async () => {
      const response = await acomodacaoService.getAllAcomodacoes();
      return response.data;
    }
  });

  const { data: estadias, isLoading: loadingEstadias } = useQuery({
    queryKey: ['estadiasSummary'],
    queryFn: async () => {
      const response = await estadiaService.getAllEstadias();
      return response.data;
    }
  });

  // Calculate summary numbers
  const totalClientes = clientes?.length || 0;
  const totalAcomodacoes = acomodacoes?.length || 0;
  const totalEstadias = estadias?.length || 0;
  
  // Get current active estadias
  const today = new Date();
  const activeEstadias = estadias?.filter(estadia => {
    const checkIn = new Date(estadia.checkIn);
    const checkOut = new Date(estadia.checkOut);
    return checkIn <= today && checkOut >= today;
  }) || [];

  const isLoading = loadingClientes || loadingAcomodacoes || loadingEstadias;

  return (
    <div>
      <PageHeader 
        title="Dashboard" 
        subtitle="Bem-vindo ao sistema de gestão Atlantis"
      />
      
      {isLoading ? (
        <Spinner />
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 text-blue-500 mr-4">
                <FaUsers size={24} />
              </div>
              <div>
                <p className="text-gray-500">Total de Clientes</p>
                <h3 className="text-2xl font-bold">{totalClientes}</h3>
                <Link to="/clientes" className="text-blue-500 text-sm hover:underline">
                  Ver todos
                </Link>
              </div>
            </Card>
            
            <Card className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 text-green-500 mr-4">
                <FaBed size={24} />
              </div>
              <div>
                <p className="text-gray-500">Acomodações</p>
                <h3 className="text-2xl font-bold">{totalAcomodacoes}</h3>
                <Link to="/acomodacoes" className="text-blue-500 text-sm hover:underline">
                  Ver todas
                </Link>
              </div>
            </Card>
            
            <Card className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100 text-purple-500 mr-4">
                <FaCalendarAlt size={24} />
              </div>
              <div>
                <p className="text-gray-500">Estadias</p>
                <h3 className="text-2xl font-bold">{totalEstadias}</h3>
                <Link to="/estadias" className="text-blue-500 text-sm hover:underline">
                  Ver todas
                </Link>
              </div>
            </Card>
          </div>
          
          {/* Active Estadias */}
          <Card title="Estadias Ativas">
            {activeEstadias.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Cliente
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Acomodação
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Check-in
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Check-out
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {activeEstadias.map((estadia) => (
                      <tr key={estadia.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {estadia.titular?.nome}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {estadia.acomodacao?.nomeAcomodacao}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {format(new Date(estadia.checkIn), 'dd/MM/yyyy', { locale: ptBR })}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {format(new Date(estadia.checkOut), 'dd/MM/yyyy', { locale: ptBR })}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Link
                            to={`/estadias/${estadia.id}`}
                            className="text-blue-500 hover:underline"
                          >
                            Detalhes
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">
                Não há estadias ativas no momento.
              </p>
            )}
          </Card>
        </>
      )}
    </div>
  );
};

export default Dashboard;