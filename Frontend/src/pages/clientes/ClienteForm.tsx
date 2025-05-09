import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageHeader, Card, Button, Alert, Spinner } from '../../components/ui';
import axios from 'axios';

const ClienteForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = !!id;
  
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [formData, setFormData] = useState({
    nome: '',
    nomeSocial: '',
    dataNascimento: '',
    endereco: {
      rua: '',
      bairro: '',
      cidade: '',
      estado: '',
      pais: '',
      codigoPostal: ''
    },
    telefone: {
      ddd: '',
      numero: ''
    },
    documento: {
      tipo: 'CPF',
      numero: '',
      dataExpedicao: ''
    }
  });

  // Fetch cliente if editing
  useEffect(() => {
    const fetchCliente = async () => {
      if (isEditing && id) {
        try {
          const response = await axios.get(`http://localhost:3000/api/clientes/${id}`);
          const cliente = response.data;
          
          setFormData({
            nome: cliente.nome || '',
            nomeSocial: cliente.nomeSocial || '',
            dataNascimento: cliente.dataNascimento ? new Date(cliente.dataNascimento).toISOString().split('T')[0] : '',
            endereco: {
              rua: '',
              bairro: '',
              cidade: '',
              estado: '',
              pais: '',
              codigoPostal: ''
            },
            telefone: {
              ddd: '',
              numero: ''
            },
            documento: {
              tipo: 'CPF',
              numero: '',
              dataExpedicao: ''
            }
          });
        } catch (error) {
          console.error('Error fetching client data:', error);
        }
      }
    };
    
    fetchCliente();
  }, [id, isEditing]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    
    if (name.includes('.')) {
      const [section, field] = name.split('.');
      setFormData(prevData => ({
        ...prevData,
        [section]: {
          ...prevData[section as keyof typeof prevData],
          [field]: value
        }
      }));
    } else {
      setFormData(prevData => ({
        ...prevData,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting form with data:", formData);
    
    // Validate required fields
    if (!formData.nome) {
      alert("Nome é obrigatório");
      return;
    }
    
    if (!formData.nomeSocial) {
      alert("Nome Social é obrigatório");
      return;
    }
    
    if (!formData.dataNascimento) {
      alert("Data de Nascimento é obrigatória");
      return;
    }
    
    if (!isEditing) {
      if (!formData.endereco.rua) {
        alert("Rua é obrigatória");
        return;
      }
      
      if (!formData.endereco.bairro) {
        alert("Bairro é obrigatório");
        return;
      }
      
      if (!formData.endereco.cidade) {
        alert("Cidade é obrigatória");
        return;
      }
      
      if (!formData.endereco.estado) {
        alert("Estado é obrigatório");
        return;
      }
      
      if (!formData.endereco.pais) {
        alert("País é obrigatório");
        return;
      }
      
      if (!formData.endereco.codigoPostal) {
        alert("CEP é obrigatório");
        return;
      }
      
      if (!formData.telefone.ddd) {
        alert("DDD é obrigatório");
        return;
      }
      
      if (!formData.telefone.numero) {
        alert("Número de telefone é obrigatório");
        return;
      }
      
      if (!formData.documento.tipo) {
        alert("Tipo de documento é obrigatório");
        return;
      }
      
      if (!formData.documento.numero) {
        alert("Número do documento é obrigatório");
        return;
      }
      
      if (!formData.documento.dataExpedicao) {
        alert("Data de expedição é obrigatória");
        return;
      }
    }
    
    setSubmitStatus('loading');
    
    try {
      if (isEditing) {
        // Update existing cliente
        const updateData = {
          nome: formData.nome,
          nomeSocial: formData.nomeSocial,
          dataNascimento: formData.dataNascimento
        };
        
        const response = await axios.put(`http://localhost:3000/api/clientes/${id}`, updateData);
        console.log("Update response:", response.data);
        
        setSubmitStatus('success');
        setTimeout(() => {
          navigate(`/clientes/${id}`);
        }, 1500);
      } else {
        // Create new titular
        const response = await axios.post('http://localhost:3000/api/clientes/titular', formData);
        console.log("Create response:", response.data);
        
        setSubmitStatus('success');
        setTimeout(() => {
          navigate('/clientes');
        }, 1500);
      }
    } catch (error: any) {
      setSubmitStatus('error');
      console.error('Error details:', error);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        setErrorMessage(`Erro ${error.response.status}: ${JSON.stringify(error.response.data)}`);
      } else if (error.request) {
        console.error('Request made but no response received:', error.request);
        setErrorMessage('Não foi possível conectar ao servidor. Verifique sua conexão.');
      } else {
        console.error('Error message:', error.message);
        setErrorMessage(`Erro: ${error.message}`);
      }
    }
  };

  return (
    <div>
      <PageHeader
        title={isEditing ? 'Editar Cliente' : 'Novo Cliente'}
        subtitle={isEditing ? 'Atualize as informações do cliente' : 'Cadastre um novo cliente titular'}
      />

      <Card>
        {submitStatus === 'success' && (
          <Alert
            type="success"
            message={isEditing ? 'Cliente atualizado com sucesso!' : 'Cliente cadastrado com sucesso!'}
            className="mb-4"
          />
        )}

        {submitStatus === 'error' && (
          <Alert
            type="error"
            message={errorMessage || 'Ocorreu um erro ao salvar o cliente.'}
            className="mb-4"
          />
        )}

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Personal Information */}
            <h3 className="text-lg font-medium text-gray-700 border-b pb-2">Informações Pessoais</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="mb-4">
                <label htmlFor="nome" className="block text-gray-700 font-medium mb-1">
                  Nome Completo <span className="text-red-500">*</span>
                </label>
                <input
                  id="nome"
                  name="nome"
                  type="text"
                  required
                  className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-1 focus:ring-blue-500"
                  value={formData.nome}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="nomeSocial" className="block text-gray-700 font-medium mb-1">
                  Nome Social <span className="text-red-500">*</span>
                </label>
                <input
                  id="nomeSocial"
                  name="nomeSocial"
                  type="text"
                  required
                  className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-1 focus:ring-blue-500"
                  value={formData.nomeSocial}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="dataNascimento" className="block text-gray-700 font-medium mb-1">
                  Data de Nascimento <span className="text-red-500">*</span>
                </label>
                <input
                  id="dataNascimento"
                  name="dataNascimento"
                  type="date"
                  required
                  className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-1 focus:ring-blue-500"
                  value={formData.dataNascimento}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            {/* Only show these fields when creating a new cliente */}
            {!isEditing && (
              <>
                {/* Endereco */}
                <h3 className="text-lg font-medium text-gray-700 border-b pb-2 mt-6">Endereço</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="mb-4">
                    <label htmlFor="endereco.rua" className="block text-gray-700 font-medium mb-1">
                      Rua/Avenida <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="endereco.rua"
                      name="endereco.rua"
                      type="text"
                      required
                      className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-1 focus:ring-blue-500"
                      value={formData.endereco.rua}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="endereco.bairro" className="block text-gray-700 font-medium mb-1">
                      Bairro <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="endereco.bairro"
                      name="endereco.bairro"
                      type="text"
                      required
                      className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-1 focus:ring-blue-500"
                      value={formData.endereco.bairro}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="endereco.cidade" className="block text-gray-700 font-medium mb-1">
                      Cidade <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="endereco.cidade"
                      name="endereco.cidade"
                      type="text"
                      required
                      className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-1 focus:ring-blue-500"
                      value={formData.endereco.cidade}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="endereco.estado" className="block text-gray-700 font-medium mb-1">
                      Estado <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="endereco.estado"
                      name="endereco.estado"
                      type="text"
                      required
                      className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-1 focus:ring-blue-500"
                      value={formData.endereco.estado}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="endereco.pais" className="block text-gray-700 font-medium mb-1">
                      País <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="endereco.pais"
                      name="endereco.pais"
                      type="text"
                      required
                      className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-1 focus:ring-blue-500"
                      value={formData.endereco.pais}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="endereco.codigoPostal" className="block text-gray-700 font-medium mb-1">
                      CEP/Código Postal <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="endereco.codigoPostal"
                      name="endereco.codigoPostal"
                      type="text"
                      required
                      className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-1 focus:ring-blue-500"
                      value={formData.endereco.codigoPostal}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                {/* Telefone */}
                <h3 className="text-lg font-medium text-gray-700 border-b pb-2 mt-6">Telefone</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="mb-4">
                    <label htmlFor="telefone.ddd" className="block text-gray-700 font-medium mb-1">
                      DDD <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="telefone.ddd"
                      name="telefone.ddd"
                      type="text"
                      required
                      className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-1 focus:ring-blue-500"
                      value={formData.telefone.ddd}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="telefone.numero" className="block text-gray-700 font-medium mb-1">
                      Número <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="telefone.numero"
                      name="telefone.numero"
                      type="text"
                      required
                      className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-1 focus:ring-blue-500"
                      value={formData.telefone.numero}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                {/* Documento */}
                <h3 className="text-lg font-medium text-gray-700 border-b pb-2 mt-6">Documento</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="mb-4">
                    <label htmlFor="documento.tipo" className="block text-gray-700 font-medium mb-1">
                      Tipo de Documento <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="documento.tipo"
                      name="documento.tipo"
                      required
                      className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-1 focus:ring-blue-500"
                      value={formData.documento.tipo}
                      onChange={handleInputChange}
                    >
                      <option value="CPF">CPF</option>
                      <option value="RG">RG</option>
                      <option value="Passaporte">Passaporte</option>
                    </select>
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="documento.numero" className="block text-gray-700 font-medium mb-1">
                      Número do Documento <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="documento.numero"
                      name="documento.numero"
                      type="text"
                      required
                      className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-1 focus:ring-blue-500"
                      value={formData.documento.numero}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="documento.dataExpedicao" className="block text-gray-700 font-medium mb-1">
                      Data de Expedição <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="documento.dataExpedicao"
                      name="documento.dataExpedicao"
                      type="date"
                      required
                      className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-1 focus:ring-blue-500"
                      value={formData.documento.dataExpedicao}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </>
            )}

            {/* Form actions */}
            <div className="flex justify-end space-x-3 mt-6">
              <Button
                variant="secondary"
                type="button"
                onClick={() => navigate(-1)}
              >
                Cancelar
              </Button>
              <Button
                variant="primary"
                type="submit"
                disabled={submitStatus === 'loading'}
              >
                {submitStatus === 'loading' ? 'Salvando...' : 'Salvar'}
              </Button>
            </div>
          </div>
        </form>
      </Card>

      {/* Debug info - will be visible in production, remove after fixing */}
      {/* <div className="mt-4 p-4 bg-gray-100 rounded">
        <h3 className="font-bold mb-2">Debug Info (remove in production):</h3>
        <pre className="text-xs overflow-auto">{JSON.stringify(formData, null, 2)}</pre>
      </div> */}
    </div>
  );
};

export default ClienteForm;