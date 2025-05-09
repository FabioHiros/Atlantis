import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { FaPlus, FaSearch, FaEye, FaTrash } from 'react-icons/fa';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { PageHeader, Button, Card, Spinner, Table, Modal, Alert } from '../../components/ui';
import { estadiaService } from '../../api/services';
import type { Estadia } from '../../types';

const EstadiasList = () => {
  const [search, setSearch] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedEstadia, setSelectedEstadia] = useState<Estadia | null>(null);
  const [deleteStatus, setDeleteStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [deleteError, setDeleteError] = useState('');

  // Fetch estadias
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['estadias'],
    queryFn: async () => {
      const response = await estadiaService.getAllEstadias();
      return response.data;
    }
  });

  // Handle delete estadia
  const handleDeleteClick = (estadia: Estadia) => {
    setSelectedEstadia(estadia);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedEstadia) return;
    
    setDeleteStatus('loading');
    try {
      await estadiaService.deleteEstadia(selectedEstadia.id);
      setDeleteStatus('success');
      // Refetch estadias list
      refetch();
      // Close modal after a short delay
      setTimeout(() => {
        setShowDeleteModal(false);
        setSelectedEstadia(null);
        setDeleteStatus('idle');
      }, 1500);
    } catch (error) {
      setDeleteStatus('error');
      setDeleteError('Ocorreu um erro ao excluir a estadia.');
    }
  };

  // Filter estadias by search term (cliente name or acomodacao name)
  const filteredEstadias = data?.filter(estadia => 
    estadia.titular?.nome.toLowerCase().includes(search.toLowerCase()) ||
    estadia.acomodacao?.nomeAcomodacao.toLowerCase().includes(search.toLowerCase())
  ) || [];

  // Check if an estadia is active (current date is between checkIn and checkOut)
  const isActiveEstadia = (estadia: Estadia) => {
    const today = new Date();
    const checkIn = new Date(estadia.checkIn);
    const checkOut = new Date(estadia.checkOut);
    return checkIn <= today && checkOut >= today;
  };

  return (
    <div>
      <PageHeader
        title="Estadias"
        subtitle="Gerencie todas as estadias do sistema"
        action={
          <Link to="/estadias/nova">
            <Button variant="primary" className="flex items-center">
              <FaPlus className="mr-2" />
              Nova Estadia
            </Button>
          </Link>
        }
      />

      <Card>
        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Pesquisar por cliente ou acomodação..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
          </div>
        </div>

        {isLoading ? (
          <Spinner />
        ) : isError ? (
          <Alert 
            type="error" 
            message="Ocorreu um erro ao carregar as estadias." 
          />
        ) : (
          <>
            {filteredEstadias.length > 0 ? (
              <Table
                headers={[
                  'Cliente',
                  'Acomodação',
                  'Check-in',
                  'Check-out',
                  'Status',
                  'Ações'
                ]}
              >
                {filteredEstadias.map((estadia) => {
                  const isActive = isActiveEstadia(estadia);
                  const isPast = new Date(estadia.checkOut) < new Date();
                  const isFuture = new Date(estadia.checkIn) > new Date();
                  
                  return (
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
                        {isActive && (
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                            Ativa
                          </span>
                        )}
                        {isPast && (
                          <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-medium">
                            Finalizada
                          </span>
                        )}
                        {isFuture && (
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                            Futura
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex space-x-3">
                          <Link 
                            to={`/estadias/${estadia.id}`}
                            className="text-blue-500 hover:text-blue-700"
                          >
                            <FaEye />
                          </Link>
                          <button
                            onClick={() => handleDeleteClick(estadia)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </Table>
            ) : (
              <p className="text-center text-gray-500 py-4">
                Nenhuma estadia encontrada.
              </p>
            )}
          </>
        )}
      </Card>

      {/* Delete confirmation modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => deleteStatus === 'idle' && setShowDeleteModal(false)}
        title="Confirmar Exclusão"
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setShowDeleteModal(false)}
              disabled={deleteStatus === 'loading'}
            >
              Cancelar
            </Button>
            <Button
              variant="danger"
              onClick={confirmDelete}
              disabled={deleteStatus !== 'idle'}
            >
              {deleteStatus === 'loading' ? 'Excluindo...' : 'Excluir'}
            </Button>
          </>
        }
      >
        {deleteStatus === 'error' ? (
          <Alert type="error" message={deleteError} />
        ) : deleteStatus === 'success' ? (
          <Alert type="success" message="Estadia excluída com sucesso!" />
        ) : (
          <p>
            Tem certeza que deseja excluir esta estadia? Esta ação não pode ser desfeita.
          </p>
        )}
      </Modal>
    </div>
  );
};

export default EstadiasList;