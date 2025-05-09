import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { FaPlus, FaSearch, FaEye, FaTrash } from 'react-icons/fa';
import { PageHeader, Button, Card, Spinner, Table, Modal, Alert } from '../../components/ui';
import { clienteService } from '../../api/services';

import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { Cliente } from '../../types';

const ClientesList = () => {
  const [search, setSearch] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null);
  const [deleteStatus, setDeleteStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [deleteError, setDeleteError] = useState('');

  // Fetch clientes
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['clientes'],
    queryFn: async () => {
      const response = await clienteService.getAllClientes();
      return response.data;
    }
  });

  // Handle delete cliente
  const handleDeleteClick = (cliente: Cliente) => {
    setSelectedCliente(cliente);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedCliente) return;
    
    setDeleteStatus('loading');
    try {
      await clienteService.deleteCliente(selectedCliente.id);
      setDeleteStatus('success');
      // Refetch clientes list
      refetch();
      // Close modal after a short delay
      setTimeout(() => {
        setShowDeleteModal(false);
        setSelectedCliente(null);
        setDeleteStatus('idle');
      }, 1500);
    } catch (error) {
      setDeleteStatus('error');
      setDeleteError('Ocorreu um erro ao excluir o cliente.');
    }
  };

  // Filter clientes by search term
  const filteredClientes = data?.filter(cliente => 
    cliente.nome.toLowerCase().includes(search.toLowerCase()) ||
    cliente.nomeSocial.toLowerCase().includes(search.toLowerCase())
  ) || [];

  return (
    <div>
      <PageHeader
        title="Clientes"
        subtitle="Gerencie todos os clientes do sistema"
        action={
          <Link to="/clientes/novo">
            <Button variant="primary" className="flex items-center">
              <FaPlus className="mr-2" />
              Novo Cliente
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
              placeholder="Pesquisar clientes..."
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
            message="Ocorreu um erro ao carregar os clientes." 
          />
        ) : (
          <>
            {filteredClientes.length > 0 ? (
              <Table
                headers={[
                  'Nome',
                  'Nome Social',
                  'Documentos',
                  'Data de Nascimento',
                  'Tipo',
                  'Ações'
                ]}
              >
                {filteredClientes.map((cliente) => (
                  <tr key={cliente.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{cliente.nome}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{cliente.nomeSocial}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {cliente.documentos?.map(doc => (
                        <div key={doc.id}>
                          {doc.tipo}: {doc.numero}
                        </div>
                      ))}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {format(new Date(cliente.dataNascimento), 'dd/MM/yyyy', { locale: ptBR })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {cliente.titularId ? 'Dependente' : 'Titular'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-3">
                        <Link 
                          to={`/clientes/${cliente.id}`}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          <FaEye />
                        </Link>
                        <button
                          onClick={() => handleDeleteClick(cliente)}
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
                Nenhum cliente encontrado.
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
          <Alert type="success" message="Cliente excluído com sucesso!" />
        ) : (
          <p>
            Tem certeza que deseja excluir o cliente{' '}
            <strong>{selectedCliente?.nome}</strong>? Esta ação não pode ser desfeita.
          </p>
        )}
      </Modal>
    </div>
  );
};

export default ClientesList;