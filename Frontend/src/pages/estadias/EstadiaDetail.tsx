import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { format, differenceInDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { FaEdit, FaUser, FaBed, FaCalendarAlt, FaIdCard } from 'react-icons/fa';
import { PageHeader, Card, Button, Spinner, Alert, Modal } from '../../components/ui';
import { estadiaService } from '../../api/services';

const EstadiaDetail = () => {
  const { id = '' } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteStatus, setDeleteStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [deleteError, setErrorMessage] = useState('');

 
  const { data: estadia, isLoading, isError } = useQuery({
    queryKey: ['estadia', id],
    queryFn: async () => {
      const response = await estadiaService.getEstadiaById(id);
      return response.data;
    },
    enabled: !!id
  });


  const confirmDelete = async () => {
    setDeleteStatus('loading');
    try {
      await estadiaService.deleteEstadia(id);
      setDeleteStatus('success');
      
      
      setTimeout(() => {
        navigate('/estadias');
      }, 1500);
    } catch (error) {
      setDeleteStatus('error');
      setErrorMessage('Ocorreu um erro ao excluir a estadia.');
    }
  };

  
  const getEstadiaStatus = () => {
    if (!estadia) return '';
    
    const today = new Date();
    const checkIn = new Date(estadia.checkIn);
    const checkOut = new Date(estadia.checkOut);
    
    if (checkIn <= today && checkOut >= today) {
      return 'Ativa';
    } else if (checkOut < today) {
      return 'Finalizada';
    } else {
      return 'Futura';
    }
  };

  const getEstadiaStatusClass = () => {
    const status = getEstadiaStatus();
    switch (status) {
      case 'Ativa':
        return 'bg-green-100 text-green-800';
      case 'Finalizada':
        return 'bg-gray-100 text-gray-800';
      case 'Futura':
        return 'bg-blue-100 text-blue-800';
      default:
        return '';
    }
  };

  if (isLoading) {
    return <Spinner />;
  }

  if (isError || !estadia) {
    return <Alert type="error" message="Erro ao carregar informações da estadia." />;
  }

 
  const durationDays = differenceInDays(
    new Date(estadia.checkOut),
    new Date(estadia.checkIn)
  );

  return (
    <div>
      <PageHeader
        title={`Estadia: ${estadia.titular?.nome}`}
        subtitle={
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEstadiaStatusClass()}`}>
            {getEstadiaStatus()}
          </span>
        }
        action={
          <div className="flex space-x-3">
            <Link to={`/estadias/${id}/editar`}>
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      
        <Card>
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <FaUser className="mr-2 text-blue-500" />
            Informações do Cliente
          </h3>
          
          <div className="space-y-4">
            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-500">Nome:</span>
              <span className="font-medium">{estadia.titular?.nome}</span>
            </div>
            
            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-500">Nome Social:</span>
              <span className="font-medium">{estadia.titular?.nomeSocial}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-500">Documentos:</span>
              <div className="text-right">
                {estadia.titular?.documentos?.map(doc => (
                  <div key={doc.id} className="font-medium">
                    {doc.tipo}: {doc.numero}
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="mt-4">
            <Link to={`/clientes/${estadia.titular?.id}`}>
              <Button variant="secondary" className="w-full">
                Ver Detalhes do Cliente
              </Button>
            </Link>
          </div>
        </Card>

   
        <Card>
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <FaBed className="mr-2 text-blue-500" />
            Informações da Acomodação
          </h3>
          
          <div className="space-y-4">
            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-500">Nome:</span>
              <span className="font-medium">{estadia.acomodacao?.nomeAcomodacao}</span>
            </div>
            
            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-500">Camas de Solteiro:</span>
              <span className="font-medium">{estadia.acomodacao?.camaSolteiro}</span>
            </div>
            
            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-500">Camas de Casal:</span>
              <span className="font-medium">{estadia.acomodacao?.camaCasal}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-500">Suítes:</span>
              <span className="font-medium">{estadia.acomodacao?.suite}</span>
            </div>
          </div>
          
          <div className="mt-4">
            <Link to={`/acomodacoes/${estadia.acomodacao?.id}`}>
              <Button variant="secondary" className="w-full">
                Ver Detalhes da Acomodação
              </Button>
            </Link>
          </div>
        </Card>
      </div>

     
      <Card className="mb-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <FaCalendarAlt className="mr-2 text-blue-500" />
          Detalhes da Estadia
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border rounded-lg p-4 bg-gray-50">
            <div className="text-gray-500 text-sm">Check-in</div>
            <div className="font-semibold text-lg">
              {format(new Date(estadia.checkIn), 'dd/MM/yyyy', { locale: ptBR })}
            </div>
            <div className="text-gray-500 text-sm">
              {format(new Date(estadia.checkIn), 'EEEE', { locale: ptBR })}
            </div>
          </div>
          
          <div className="border rounded-lg p-4 bg-gray-50">
            <div className="text-gray-500 text-sm">Check-out</div>
            <div className="font-semibold text-lg">
              {format(new Date(estadia.checkOut), 'dd/MM/yyyy', { locale: ptBR })}
            </div>
            <div className="text-gray-500 text-sm">
              {format(new Date(estadia.checkOut), 'EEEE', { locale: ptBR })}
            </div>
          </div>
          
          <div className="border rounded-lg p-4 bg-gray-50">
            <div className="text-gray-500 text-sm">Duração</div>
            <div className="font-semibold text-lg">
              {durationDays} {durationDays === 1 ? 'dia' : 'dias'}
            </div>
            <div className="text-gray-500 text-sm">
              {durationDays === 1 ? '1 noite' : `${durationDays} noites`}
            </div>
          </div>
        </div>
      </Card>

    
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

export default EstadiaDetail;