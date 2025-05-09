import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { FaEdit, FaPlus, FaUser, FaIdCard, FaPhone, FaMapMarkerAlt, FaCalendarAlt } from 'react-icons/fa';
import { PageHeader, Card, Button, Spinner, Alert, Modal, Table } from '../../components/ui';
import { clienteService, estadiaService } from '../../api/services';

const ClienteDetail = () => {
  const { id = '' } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteStatus, setDeleteStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [deleteError, setDeleteError] = useState('');

  // Fetch cliente details
  const { data: cliente, isLoading, isError } = useQuery({
    queryKey: ['cliente', id],
    queryFn: async () => {
      const response = await clienteService.getClienteById(id);
      return response.data;
    },
    enabled: !!id
  });

  // Fetch dependentes if cliente is a titular
  const { data: dependentes } = useQuery({
    queryKey: ['dependentes', id],
    queryFn: async () => {
      const response = await clienteService.getDependentesByTitularId(id);
      return response.data;
    },
    enabled: !!id && cliente?.titularId === null
  });

  // Fetch estadias for this cliente
  const { data: estadias } = useQuery({
    queryKey: ['clienteEstadias', id],
    queryFn: async () => {
      const response = await estadiaService.getEstadiasByTitularId(id);
      return response.data;
    },
    enabled: !!id && cliente?.titularId === null
  });

  // Handle cliente deletion
  const confirmDelete = async () => {
    setDeleteStatus('loading');
    try {
      await clienteService.deleteCliente(id);
      setDeleteStatus('success');
      
      // Navigate back to clientes list after a short delay
      setTimeout(() => {
        navigate('/clientes');
      }, 1500);
    } catch (error) {
      setDeleteStatus('error');
      setDeleteError('Ocorreu um erro ao excluir o cliente.');
    }
  };

  if (isLoading) {
    return <Spinner />;
  }

  if (isError || !cliente) {
    return <Alert type="error" message="Erro ao carregar informações do cliente." />;
  }

  return (
    <div>
      <PageHeader
        title={`Cliente: ${cliente.nome}`}
        subtitle={cliente.titularId ? 'Dependente' : 'Titular'}
        action={
          <div className="flex space-x-3">
            <Link to={`/clientes/${id}/editar`}>
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Cliente Info */}
        <Card className="md:col-span-2">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <FaUser className="mr-2 text-blue-500" />
            Informações Pessoais
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-500">Nome:</p>
              <p className="font-medium">{cliente.nome}</p>
            </div>
            
            <div>
              <p className="text-gray-500">Nome Social:</p>
              <p className="font-medium">{cliente.nomeSocial}</p>
            </div>
            
            <div>
              <p className="text-gray-500">Data de Nascimento:</p>
              <p className="font-medium">
                {format(new Date(cliente.dataNascimento), 'dd/MM/yyyy', { locale: ptBR })}
              </p>
            </div>
            
            <div>
              <p className="text-gray-500">Data de Cadastro:</p>
              <p className="font-medium">
                {format(new Date(cliente.dataCadastro), 'dd/MM/yyyy', { locale: ptBR })}
              </p>
            </div>
            
            {cliente.titularId && (
              <div>
                <p className="text-gray-500">Titular:</p>
                <p className="font-medium">
                  <Link to={`/clientes/${cliente.titularId}`} className="text-blue-500 hover:underline">
                    {cliente.titular?.nome || 'Ver titular'}
                  </Link>
                </p>
              </div>
            )}
          </div>
        </Card>

        {/* Documentos */}
        <Card>
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <FaIdCard className="mr-2 text-blue-500" />
            Documentos
          </h3>
          
          {cliente.documentos && cliente.documentos.length > 0 ? (
            <div className="space-y-3">
              {cliente.documentos.map((doc) => (
                <div key={doc.id} className="border-b pb-2">
                  <div className="flex justify-between">
                    <span className="text-gray-500">{doc.tipo}:</span>
                    <span className="font-medium">{doc.numero}</span>
                  </div>
                  <div className="text-sm text-gray-500">
                    Expedição: {format(new Date(doc.dataExpedicao), 'dd/MM/yyyy', { locale: ptBR })}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">Nenhum documento cadastrado.</p>
          )}
          
          <div className="mt-4">
            <Link to={`/clientes/${id}/documento/novo`}>
              <Button variant="secondary" className="w-full flex items-center justify-center">
                <FaPlus className="mr-2" />
                Adicionar Documento
              </Button>
            </Link>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Telefones */}
        <Card>
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <FaPhone className="mr-2 text-blue-500" />
            Telefones
          </h3>
          
          {cliente.telefones && cliente.telefones.length > 0 ? (
            <div className="space-y-3">
              {cliente.telefones.map((tel) => (
                <div key={tel.id} className="border-b pb-2">
                  <div className="font-medium">
                    ({tel.ddd}) {tel.numero}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">Nenhum telefone cadastrado.</p>
          )}
          
          <div className="mt-4">
            <Link to={`/clientes/${id}/telefone/novo`}>
              <Button variant="secondary" className="w-full flex items-center justify-center">
                <FaPlus className="mr-2" />
                Adicionar Telefone
              </Button>
            </Link>
          </div>
        </Card>

        {/* Endereço */}
        <Card>
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <FaMapMarkerAlt className="mr-2 text-blue-500" />
            Endereço
          </h3>
          
          {cliente.endereco ? (
            <div>
              <p>{cliente.endereco.rua}</p>
              <p>{cliente.endereco.bairro}, {cliente.endereco.cidade} - {cliente.endereco.estado}</p>
              <p>{cliente.endereco.pais}, {cliente.endereco.codigoPostal}</p>
            </div>
          ) : (
            <p className="text-gray-500">Nenhum endereço cadastrado.</p>
          )}
          
          <div className="mt-4">
            <Link to={`/clientes/${id}/endereco/editar`}>
              <Button variant="secondary" className="w-full flex items-center justify-center">
                <FaEdit className="mr-2" />
                {cliente.endereco ? 'Editar Endereço' : 'Adicionar Endereço'}
              </Button>
            </Link>
          </div>
        </Card>
      </div>

      {/* Dependentes (if cliente is a titular) */}
      {cliente.titularId === null && (
        <Card className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold flex items-center">
              <FaUser className="mr-2 text-blue-500" />
              Dependentes
            </h3>
            <Link to={`/clientes/${id}/dependente/novo`}>
              <Button variant="primary" className="flex items-center">
                <FaPlus className="mr-2" />
                dependente
              </Button>
            </Link>
          </div>
          
          {dependentes && dependentes.length > 0 ? (
            <Table headers={['Nome', 'Nome Social', 'Data de Nascimento', 'Ações']}>
              {dependentes.map((dependente) => (
                <tr key={dependente.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{dependente.nome}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{dependente.nomeSocial}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {format(new Date(dependente.dataNascimento), 'dd/MM/yyyy', { locale: ptBR })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link 
                      to={`/clientes/${dependente.id}`}
                      className="text-blue-500 hover:underline"
                    >
                      Ver Detalhes
                    </Link>
                  </td>
                </tr>
              ))}
            </Table>
          ) : (
            <p className="text-gray-500 text-center py-4">
              Este cliente não possui dependentes.
            </p>
          )}
        </Card>
      )}

      {/* Estadias (if cliente is a titular) */}
      {cliente.titularId === null && (
        <Card>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold flex items-center">
              <FaCalendarAlt className="mr-2 text-blue-500" />
              Estadias
            </h3>
            <Link to={`/estadias/nova`} state={{ titularId: id }}>
              <Button variant="primary" className="flex items-center">
                <FaPlus className="mr-2" />
                Nova Estadia
              </Button>
            </Link>
          </div>
          
          {estadias && estadias.length > 0 ? (
            <Table headers={['Acomodação', 'Check-in', 'Check-out', 'Ações']}>
              {estadias.map((estadia) => (
                <tr key={estadia.id}>
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
                      Ver Detalhes
                    </Link>
                  </td>
                </tr>
              ))}
            </Table>
          ) : (
            <p className="text-gray-500 text-center py-4">
              Este cliente não possui estadias.
            </p>
          )}
        </Card>
      )}

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
          <Alert type="success" message="Cliente excluído com sucesso!" />
        ) : (
          <p>
            Tem certeza que deseja excluir este cliente? Esta ação não pode ser desfeita.
            {cliente.dependentes && cliente.dependentes.length > 0 && (
              <span className="block text-red-500 mt-2">
                Atenção: Este cliente possui dependentes que também serão excluídos.
              </span>
            )}
          </p>
        )}
      </Modal>
    </div>
  );
};

export default ClienteDetail;