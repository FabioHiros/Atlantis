import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FaEdit, FaBed, FaSnowflake, FaCar } from 'react-icons/fa';
import { PageHeader, Card, Button, Spinner, Alert, Modal } from '../../components/ui';
import { acomodacaoService } from '../../api/services';

const AcomodacaoDetail = () => {
  const { id = '' } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteStatus, setDeleteStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  // Fetch acomodacao details
  const { data: acomodacao, isLoading, isError } = useQuery({
    queryKey: ['acomodacao', id],
    queryFn: async () => {
      const response = await acomodacaoService.getAcomodacaoById(id);
      return response.data;
    },
    enabled: !!id
  });

  // Delete acomodacao mutation
  const deleteMutation = useMutation({
    mutationFn: () => acomodacaoService.deleteAcomodacao(id),
    onSuccess: () => {
      setDeleteStatus('success');
      setTimeout(() => {
        navigate('/acomodacoes');
      }, 1500);
    },
    onError: () => {
      setDeleteStatus('error');
      setErrorMessage('Ocorreu um erro ao excluir a acomodação.');
    }
  });

  const confirmDelete = () => {
    deleteMutation.mutate();
  };

  if (isLoading) {
    return <Spinner />;
  }

  if (isError || !acomodacao) {
    return <Alert type="error" message="Erro ao carregar informações da acomodação." />;
  }

  return (
    <div>
      <PageHeader
        title={`Acomodação: ${acomodacao.nomeAcomodacao}`}
        subtitle="Detalhes da acomodação"
        action={
          <div className="flex space-x-3">
            <Link to={`/acomodacoes/${id}/editar`}>
              <Button variant="primary" className="flex items-center">
                <FaEdit className="mr-2" />
                Editar
              </Button>
            </Link>
            <Button 
              variant="danger" 
              onClick={() => setShowDeleteModal(true)}
              className="flex items-center"
            >
              Excluir
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Características da Acomodação */}
        <Card>
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <FaBed className="mr-2 text-blue-500" />
            Características da Acomodação
          </h3>
          
          <div className="space-y-4">
            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-500">Nome:</span>
              <span className="font-medium">{acomodacao.nomeAcomodacao}</span>
            </div>
            
            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-500">Camas de Solteiro:</span>
              <span className="font-medium">{acomodacao.camaSolteiro}</span>
            </div>
            
            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-500">Camas de Casal:</span>
              <span className="font-medium">{acomodacao.camaCasal}</span>
            </div>
            
            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-500">Suítes:</span>
              <span className="font-medium">{acomodacao.suite}</span>
            </div>
            
            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-500">Climatização:</span>
              <span className="font-medium flex items-center">
                {acomodacao.climatizacao ? (
                  <>
                    <FaSnowflake className="mr-1 text-blue-400" />
                    Sim
                  </>
                ) : 'Não'}
              </span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-500">Vagas de Garagem:</span>
              <span className="font-medium flex items-center">
                {acomodacao.garagem > 0 ? (
                  <>
                    <FaCar className="mr-1 text-gray-500" />
                    {acomodacao.garagem}
                  </>
                ) : 'Não possui'}
              </span>
            </div>
          </div>
        </Card>
        
        {/* Informações adicionais */}
        <Card>
          <h3 className="text-lg font-semibold mb-4">Capacidade</h3>
          
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-700 mb-2">Resumo da Acomodação</h4>
            <p className="text-gray-700">
              Esta acomodação possui capacidade para até{' '}
              <span className="font-semibold">
                {acomodacao.camaSolteiro + (acomodacao.camaCasal * 2)}
              </span>{' '}
              pessoas, com {acomodacao.camaSolteiro} cama(s) de solteiro e {acomodacao.camaCasal} cama(s) de casal.
            </p>
            <p className="text-gray-700 mt-2">
              {acomodacao.suite > 0 
                ? `Possui ${acomodacao.suite} suíte(s) privativa(s).` 
                : 'Não possui suítes privativas.'
              }
            </p>
            <p className="text-gray-700 mt-2">
              {acomodacao.climatizacao 
                ? 'Conta com sistema de climatização.' 
                : 'Não possui sistema de climatização.'
              }
            </p>
            <p className="text-gray-700 mt-2">
              {acomodacao.garagem > 0 
                ? `Inclui ${acomodacao.garagem} vaga(s) de garagem.` 
                : 'Não possui vagas de garagem.'
              }
            </p>
          </div>
          
          <div className="mt-6">
            <Link to="/estadias/nova" state={{ acomodacaoId: id }}>
              <Button variant="primary" className="w-full">
                Criar Nova Estadia com Esta Acomodação
              </Button>
            </Link>
          </div>
        </Card>
      </div>

      {/* Delete confirmation modal */}
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
            Tem certeza que deseja excluir esta acomodação? Esta ação não pode ser desfeita.
          </p>
        )}
      </Modal>
    </div>
  );
};

export default AcomodacaoDetail;