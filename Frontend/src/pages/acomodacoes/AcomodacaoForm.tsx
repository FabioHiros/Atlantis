import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageHeader, Card, Button, Alert, Spinner } from '../../components/ui';
import axios from 'axios';

const AcomodacaoForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = !!id;
  
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(isEditing);
  
  const [formData, setFormData] = useState({
    nomeAcomodacao: '',
    camaSolteiro: 0,
    camaCasal: 0,
    suite: 0,
    climatizacao: false,
    garagem: 0
  });


  useEffect(() => {
    const fetchAcomodacao = async () => {
      if (isEditing) {
        try {
          setIsLoading(true);
          const response = await axios.get(`http://localhost:3000/api/acomodacoes/${id}`);
          const acomodacao = response.data;
          
          setFormData({
            nomeAcomodacao: acomodacao.nomeAcomodacao || '',
            camaSolteiro: acomodacao.camaSolteiro || 0,
            camaCasal: acomodacao.camaCasal || 0,
            suite: acomodacao.suite || 0,
            climatizacao: acomodacao.climatizacao || false,
            garagem: acomodacao.garagem || 0
          });
          
          setIsLoading(false);
        } catch (error) {
          console.error('Error fetching accommodation:', error);
          setIsLoading(false);
        }
      }
    };

    if (isEditing) {
      fetchAcomodacao();
    }
  }, [id, isEditing]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = event.target;
    
    if (type === 'checkbox') {
      setFormData(prevData => ({
        ...prevData,
        [name]: checked
      }));
    } else if (type === 'number') {
      setFormData(prevData => ({
        ...prevData,
        [name]: value === '' ? 0 : parseInt(value, 10)
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
    
 
    if (!formData.nomeAcomodacao) {
      alert("Nome da acomodação é obrigatório");
      return;
    }
    
    setSubmitStatus('loading');
    
    try {
      if (isEditing) {
       
        const response = await axios.put(`http://localhost:3000/api/acomodacoes/${id}`, formData);
        console.log("Update response:", response.data);
      } else {
      
        const response = await axios.post('http://localhost:3000/api/acomodacoes', formData);
        console.log("Create response:", response.data);
      }
      
      setSubmitStatus('success');
      setTimeout(() => {
        navigate(isEditing ? `/acomodacoes/${id}` : '/acomodacoes');
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

  return (
    <div>
      <PageHeader
        title={isEditing ? 'Editar Acomodação' : 'Nova Acomodação'}
        subtitle={isEditing ? 'Atualize as informações da acomodação' : 'Cadastre uma nova acomodação'}
      />

      <Card>
        <form onSubmit={handleSubmit}>
          {submitStatus === 'success' && (
            <Alert
              type="success"
              message={isEditing ? 'Acomodação atualizada com sucesso!' : 'Acomodação criada com sucesso!'}
            />
          )}

          {submitStatus === 'error' && (
            <Alert
              type="error"
              message={errorMessage || `Ocorreu um erro ao ${isEditing ? 'atualizar' : 'criar'} a acomodação.`}
            />
          )}

          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-700 border-b pb-2">Informações Básicas</h3>
            
            <div className="mb-4">
              <label htmlFor="nomeAcomodacao" className="block text-gray-700 font-medium mb-1">
                Nome da Acomodação <span className="text-red-500">*</span>
              </label>
              <input
                id="nomeAcomodacao"
                name="nomeAcomodacao"
                type="text"
                required
                className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={formData.nomeAcomodacao}
                onChange={handleInputChange}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="mb-4">
                <label htmlFor="camaSolteiro" className="block text-gray-700 font-medium mb-1">
                  Camas de Solteiro <span className="text-red-500">*</span>
                </label>
                <input
                  id="camaSolteiro"
                  name="camaSolteiro"
                  type="number"
                  min={0}
                  required
                  className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-1 focus:ring-blue-500"
                  value={formData.camaSolteiro}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="camaCasal" className="block text-gray-700 font-medium mb-1">
                  Camas de Casal <span className="text-red-500">*</span>
                </label>
                <input
                  id="camaCasal"
                  name="camaCasal"
                  type="number"
                  min={0}
                  required
                  className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-1 focus:ring-blue-500"
                  value={formData.camaCasal}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="suite" className="block text-gray-700 font-medium mb-1">
                  Suítes <span className="text-red-500">*</span>
                </label>
                <input
                  id="suite"
                  name="suite"
                  type="number"
                  min={0}
                  required
                  className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-1 focus:ring-blue-500"
                  value={formData.suite}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="garagem" className="block text-gray-700 font-medium mb-1">
                  Vagas de Garagem <span className="text-red-500">*</span>
                </label>
                <input
                  id="garagem"
                  name="garagem"
                  type="number"
                  min={0}
                  required
                  className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-1 focus:ring-blue-500"
                  value={formData.garagem}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div className="flex items-center mb-4">
              <input
                id="climatizacao"
                name="climatizacao"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                checked={formData.climatizacao}
                onChange={handleInputChange}
              />
              <label htmlFor="climatizacao" className="ml-2 block text-gray-700">
                Possui Climatização
              </label>
            </div>

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
    </div>
  );
};

export default AcomodacaoForm;