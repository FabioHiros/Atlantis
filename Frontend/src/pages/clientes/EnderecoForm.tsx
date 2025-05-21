import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageHeader, Card, Button, Alert, Spinner } from '../../components/ui';
import axios from 'axios';

const EnderecoForm = () => {
  const { id = '' } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [cliente, setCliente] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const [formData, setFormData] = useState({
    rua: '',
    bairro: '',
    cidade: '',
    estado: '',
    pais: '',
    codigoPostal: ''
  });

 
  useEffect(() => {
    const fetchCliente = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`http://localhost:3000/api/clientes/${id}`);
        setCliente(response.data);
        
       
        if (response.data.endereco) {
          setFormData({
            rua: response.data.endereco.rua || '',
            bairro: response.data.endereco.bairro || '',
            cidade: response.data.endereco.cidade || '',
            estado: response.data.endereco.estado || '',
            pais: response.data.endereco.pais || '',
            codigoPostal: response.data.endereco.codigoPostal || ''
          });
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching client:', error);
        setIsLoading(false);
      }
    };

    fetchCliente();
  }, [id]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
   
    if (!formData.rua) {
      alert("Rua é obrigatória");
      return;
    }
    
    if (!formData.bairro) {
      alert("Bairro é obrigatório");
      return;
    }
    
    if (!formData.cidade) {
      alert("Cidade é obrigatória");
      return;
    }
    
    if (!formData.estado) {
      alert("Estado é obrigatório");
      return;
    }
    
    if (!formData.pais) {
      alert("País é obrigatório");
      return;
    }
    
    if (!formData.codigoPostal) {
      alert("CEP é obrigatório");
      return;
    }
    
    setSubmitStatus('loading');
    
    try {
     
      const response = await axios.put(`http://localhost:3000/api/clientes/${id}/endereco`, formData);
      console.log("Update response:", response.data);
      
      setSubmitStatus('success');
      setTimeout(() => {
        navigate(`/clientes/${id}`);
      }, 1500);
    } catch (error: any) {
      setSubmitStatus('error');
      console.error('Error details:', error);
      if (error.response) {
        setErrorMessage(`Erro ${error.response.status}: ${JSON.stringify(error.response.data)}`);
      } else if (error.request) {
        setErrorMessage('Não foi possível conectar ao servidor. Verifique sua conexão.');
      } else {
        setErrorMessage(`Erro: ${error.message}`);
      }
    }
  };

  if (isLoading) {
    return <Spinner />;
  }

  if (!cliente) {
    return <Alert type="error" message="Erro ao carregar informações do cliente." />;
  }

  return (
    <div>
      <PageHeader
        title="Endereço"
        subtitle={`Editar endereço de ${cliente.nome}`}
      />

      <Card>
        <form onSubmit={handleSubmit}>
          {submitStatus === 'success' && (
            <Alert
              type="success"
              message="Endereço atualizado com sucesso!"
            />
          )}

          {submitStatus === 'error' && (
            <Alert
              type="error"
              message={errorMessage || 'Ocorreu um erro ao atualizar o endereço.'}
            />
          )}

          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-700 border-b pb-2">Informações do Endereço</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="mb-4">
                <label htmlFor="rua" className="block text-gray-700 font-medium mb-1">
                  Rua/Avenida <span className="text-red-500">*</span>
                </label>
                <input
                  id="rua"
                  name="rua"
                  type="text"
                  required
                  className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-1 focus:ring-blue-500"
                  value={formData.rua}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="bairro" className="block text-gray-700 font-medium mb-1">
                  Bairro <span className="text-red-500">*</span>
                </label>
                <input
                  id="bairro"
                  name="bairro"
                  type="text"
                  required
                  className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-1 focus:ring-blue-500"
                  value={formData.bairro}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="cidade" className="block text-gray-700 font-medium mb-1">
                  Cidade <span className="text-red-500">*</span>
                </label>
                <input
                  id="cidade"
                  name="cidade"
                  type="text"
                  required
                  className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-1 focus:ring-blue-500"
                  value={formData.cidade}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="estado" className="block text-gray-700 font-medium mb-1">
                  Estado <span className="text-red-500">*</span>
                </label>
                <input
                  id="estado"
                  name="estado"
                  type="text"
                  required
                  className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-1 focus:ring-blue-500"
                  value={formData.estado}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="pais" className="block text-gray-700 font-medium mb-1">
                  País <span className="text-red-500">*</span>
                </label>
                <input
                  id="pais"
                  name="pais"
                  type="text"
                  required
                  className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-1 focus:ring-blue-500"
                  value={formData.pais}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="codigoPostal" className="block text-gray-700 font-medium mb-1">
                  CEP/Código Postal <span className="text-red-500">*</span>
                </label>
                <input
                  id="codigoPostal"
                  name="codigoPostal"
                  type="text"
                  required
                  className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-1 focus:ring-blue-500"
                  value={formData.codigoPostal}
                  onChange={handleInputChange}
                />
              </div>
            </div>

         
            <div className="flex justify-end space-x-3 mt-6">
              <Button
                variant="secondary"
                type="button"
                onClick={() => navigate(`/clientes/${id}`)}
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
    </div>
  );
};

export default EnderecoForm;