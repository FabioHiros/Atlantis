import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { FaPlus, FaSearch, FaEye, FaEdit, FaTrash } from 'react-icons/fa';
import { PageHeader, Button, Card, Spinner, Table, Modal, Alert } from '../../components/ui';
import { acomodacaoService } from '../../api/services';
import type { Acomodacao } from '../../types';

const AcomodacoesList = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedAcomodacao, setSelectedAcomodacao] = useState<Acomodacao | null>(null);
  const [deleteStatus, setDeleteStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  
  const { data, isLoading, isError } = useQuery({
    queryKey: ['acomodacoes'],
    queryFn: async () => {
      const response = await acomodacaoService.getAllAcomodacoes();
      return response.data;
    }
  });

 
  const createDefaultsMutation = useMutation({
    mutationFn: acomodacaoService.createDefaultAcomodacoes,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['acomodacoes'] });
    }
  });

 
  const deleteMutation = useMutation({
    mutationFn: (id: string) => acomodacaoService.deleteAcomodacao(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['acomodacoes'] });
      setDeleteStatus('success');
      setTimeout(() => {
        setShowDeleteModal(false);
        setSelectedAcomodacao(null);
        setDeleteStatus('idle');
      }, 1500);
    },
    onError: () => {
      setDeleteStatus('error');
      setErrorMessage('Erro ao excluir acomodação.');
    }
  });

  
  const handleDeleteClick = (acomodacao: Acomodacao) => {
    setSelectedAcomodacao(acomodacao);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (selectedAcomodacao) {
      deleteMutation.mutate(selectedAcomodacao.id);
    }
  };

  
  const handleCreateDefaults = () => {
    createDefaultsMutation.mutate();
  };

 
  const filteredAcomodacoes = data?.filter(acomodacao => 
    acomodacao.nomeAcomodacao.toLowerCase().includes(search.toLowerCase())
  ) || [];

  return (
    <div>
      <PageHeader
        title="Acomodações"
        subtitle=""
        action={
          <div className="flex space-x-3">
            <Button 
              variant="secondary" 
              onClick={handleCreateDefaults}
              disabled={createDefaultsMutation.isPending}
              className="flex items-center"
            >
              {createDefaultsMutation.isPending ? 'Criando...' : 'Criar Padrões'}
            </Button>
            <Link to="/acomodacoes/nova">
              <Button variant="primary" className="flex items-center">
                <FaPlus className="mr-2" />
                Nova Acomodação
              </Button>
            </Link>
          </div>
        }
      />

      <Card>
        {createDefaultsMutation.isSuccess && (
          <Alert
            type="success"
            message="Acomodações padrão criadas com sucesso!"
            className="mb-4"
            onClose={() => queryClient.invalidateQueries({ queryKey: ['acomodacoes'] })}
          />
        )}
        
        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Pesquisar acomodações..."
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
            message="Ocorreu um erro ao carregar as acomodações." 
          />
        ) : (
          <>
            {filteredAcomodacoes.length > 0 ? (
              <Table
                headers={[
                  'Nome',
                  'Camas de Solteiro',
                  'Camas de Casal',
                  'Suítes',
                  'Climatização',
                  'Vagas Garagem',
                  'Ações'
                ]}
              >
                {filteredAcomodacoes.map((acomodacao) => (
                  <tr key={acomodacao.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{acomodacao.nomeAcomodacao}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{acomodacao.camaSolteiro}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{acomodacao.camaCasal}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{acomodacao.suite}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {acomodacao.climatizacao ? 'Sim' : 'Não'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{acomodacao.garagem}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-3">
                        <Link 
                          to={`/acomodacoes/${acomodacao.id}`}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          <FaEye />
                        </Link>
                        <Link 
                          to={`/acomodacoes/${acomodacao.id}/editar`}
                          className="text-green-500 hover:text-green-700"
                        >
                          <FaEdit />
                        </Link>
                        <button
                          onClick={() => handleDeleteClick(acomodacao)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </Table>
            ) : (
              <p className="text-center text-gray-500 py-4">
                Nenhuma acomodação encontrada.
              </p>
            )}
          </>
        )}
      </Card>

      
      <Modal
        isOpen={showDeleteModal}
        onClose={() => !deleteMutation.isPending && setShowDeleteModal(false)}
        title="Confirmar Exclusão"
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setShowDeleteModal(false)}
              disabled={deleteMutation.isPending}
            >
              Cancelar
            </Button>
            <Button
              variant="danger"
              onClick={confirmDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? 'Excluindo...' : 'Excluir'}
            </Button>
          </>
        }
      >
        {deleteStatus === 'error' ? (
          <Alert type="error" message={errorMessage} />
        ) : deleteStatus === 'success' ? (
          <Alert type="success" message="Acomodação excluída com sucesso!" />
        ) : (
          <p>
            Tem certeza que deseja excluir a acomodação{' '}
            <strong>{selectedAcomodacao?.nomeAcomodacao}</strong>? Esta ação não pode ser desfeita.
          </p>
        )}
      </Modal>
    </div>
  );
};

export default AcomodacoesList;