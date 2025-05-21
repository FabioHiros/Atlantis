import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageHeader, Card, Button, Alert, Spinner } from '../../components/ui';
import axios from 'axios';

const DependenteForm = () => {
  const { id: titularId = '' } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [titular, setTitular] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  
  const [formData, setFormData] = useState({
    nome: '',
    nomeSocial: '',
    dataNascimento: '',
    documento: {
      tipo: 'CPF',
      numero: '',
      dataExpedicao: ''
    }
  });

  
  useEffect(() => {
    const fetchTitular = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`http://localhost:3000/api/clientes/${titularId}`);
        setTitular(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching titular:', error);
        setIsError(true);
        setIsLoading(false);
      }
    };

    fetchTitular();
  }, [titularId]);

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
    
    setSubmitStatus('loading');
    
    try {
    
      const response = await axios.post(`http://localhost:3000/api/clientes/titular/${titularId}/dependente`, formData);
      console.log("Create response:", response.data);
      
      setSubmitStatus('success');
      setTimeout(() => {
        navigate(`/clientes/${titularId}`);
      }, 1500);
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

  if (isLoading) {
    return <Spinner />;
  }

  if (isError || !titular) {
    return <Alert type="error" message="Erro ao carregar informações do titular." />;
  }

  return (
    <div>
      <PageHeader
        title="Novo Dependente"
        subtitle={`Adicionar dependente para ${titular.nome}`}
      />

      <Card>
        <form onSubmit={handleSubmit}>
          {submitStatus === 'success' && (
            <Alert
              type="success"
              message="Dependente cadastrado com sucesso!"
              className="mb-4"
            />
          )}

          {submitStatus === 'error' && (
            <Alert
              type="error"
              message={errorMessage || 'Ocorreu um erro ao cadastrar o dependente.'}
              className="mb-4"
            />
          )}

          <div className="space-y-4">
           
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

           
            <div className="flex justify-end space-x-3 mt-6">
              <Button
                variant="secondary"
                type="button"
                onClick={() => navigate(`/clientes/${titularId}`)}
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

export default DependenteForm;