import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageHeader, Card, Button, Alert, Spinner } from '../../components/ui';
import axios from 'axios';

const DocumentoForm = () => {
  const { id = '' } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [cliente, setCliente] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const [formData, setFormData] = useState({
    tipo: 'CPF',
    numero: '',
    dataExpedicao: ''
  });

 
  useEffect(() => {
    const fetchCliente = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`http://localhost:3000/api/clientes/${id}`);
        setCliente(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching client:', error);
        setIsLoading(false);
      }
    };

    fetchCliente();
  }, [id]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    

    if (!formData.tipo) {
      alert("Tipo de documento é obrigatório");
      return;
    }
    
    if (!formData.numero) {
      alert("Número do documento é obrigatório");
      return;
    }
    
    if (!formData.dataExpedicao) {
      alert("Data de expedição é obrigatória");
      return;
    }
    
    setSubmitStatus('loading');
    
    try {
    
      const response = await axios.post(`http://localhost:3000/api/clientes/${id}/documento`, formData);
      console.log("Add documento response:", response.data);
      
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
        title="Novo Documento"
        subtitle={`Adicionar documento para ${cliente.nome}`}
      />

      <Card>
        <form onSubmit={handleSubmit}>
          {submitStatus === 'success' && (
            <Alert
              type="success"
              message="Documento adicionado com sucesso!"
            />
          )}

          {submitStatus === 'error' && (
            <Alert
              type="error"
              message={errorMessage || 'Ocorreu um erro ao adicionar o documento.'}
            />
          )}

          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-700 border-b pb-2">Informações do Documento</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="mb-4">
                <label htmlFor="tipo" className="block text-gray-700 font-medium mb-1">
                  Tipo de Documento <span className="text-red-500">*</span>
                </label>
                <select
                  id="tipo"
                  name="tipo"
                  required
                  className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-1 focus:ring-blue-500"
                  value={formData.tipo}
                  onChange={handleInputChange}
                >
                  <option value="CPF">CPF</option>
                  <option value="RG">RG</option>
                  <option value="Passaporte">Passaporte</option>
                </select>
              </div>
              
              <div className="mb-4">
                <label htmlFor="numero" className="block text-gray-700 font-medium mb-1">
                  Número do Documento <span className="text-red-500">*</span>
                </label>
                <input
                  id="numero"
                  name="numero"
                  type="text"
                  required
                  className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-1 focus:ring-blue-500"
                  value={formData.numero}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="dataExpedicao" className="block text-gray-700 font-medium mb-1">
                  Data de Expedição <span className="text-red-500">*</span>
                </label>
                <input
                  id="dataExpedicao"
                  name="dataExpedicao"
                  type="date"
                  required
                  className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-1 focus:ring-blue-500"
                  value={formData.dataExpedicao}
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

export default DocumentoForm;