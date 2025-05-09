import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageHeader, Card, Button, Alert, Spinner } from '../../components/ui';
import axios from 'axios';

const TelefoneForm = () => {
  const { id = '' } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [cliente, setCliente] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const [formData, setFormData] = useState({
    ddd: '',
    numero: ''
  });

  // Fetch cliente info
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

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.ddd) {
      alert("DDD é obrigatório");
      return;
    }
    
    if (!formData.numero) {
      alert("Número é obrigatório");
      return;
    }
    
    setSubmitStatus('loading');
    
    try {
      // Add telefone to cliente
      const response = await axios.post(`http://localhost:3000/api/clientes/${id}/telefone`, formData);
      console.log("Add telefone response:", response.data);
      
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
        title="Novo Telefone"
        subtitle={`Adicionar telefone para ${cliente.nome}`}
      />

      <Card>
        <form onSubmit={handleSubmit}>
          {submitStatus === 'success' && (
            <Alert
              type="success"
              message="Telefone adicionado com sucesso!"
            />
          )}

          {submitStatus === 'error' && (
            <Alert
              type="error"
              message={errorMessage || 'Ocorreu um erro ao adicionar o telefone.'}
            />
          )}

          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-700 border-b pb-2">Informações do Telefone</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="mb-4">
                <label htmlFor="ddd" className="block text-gray-700 font-medium mb-1">
                  DDD <span className="text-red-500">*</span>
                </label>
                <input
                  id="ddd"
                  name="ddd"
                  type="text"
                  required
                  placeholder="Ex: 11"
                  className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-1 focus:ring-blue-500"
                  value={formData.ddd}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="numero" className="block text-gray-700 font-medium mb-1">
                  Número <span className="text-red-500">*</span>
                </label>
                <input
                  id="numero"
                  name="numero"
                  type="text"
                  required
                  placeholder="Ex: 999999999"
                  className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-1 focus:ring-blue-500"
                  value={formData.numero}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            {/* Form actions */}
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

export default TelefoneForm;