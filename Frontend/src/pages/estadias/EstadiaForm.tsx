import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { PageHeader, Card, Button, Alert, Spinner } from '../../components/ui';
import axios from 'axios';
import { format } from 'date-fns';

const EstadiaForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const isEditing = !!id;
  
  // Get preselected values from location state if present
  const preselectedTitularId = location.state?.titularId || '';
  const preselectedAcomodacaoId = location.state?.acomodacaoId || '';
  
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
  const [titulares, setTitulares] = useState<any[]>([]);
  const [acomodacoes, setAcomodacoes] = useState<any[]>([]);
  
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const [formData, setFormData] = useState({
    titularId: preselectedTitularId,
    acomodacaoId: preselectedAcomodacaoId,
    checkIn: format(today, 'yyyy-MM-dd'),
    checkOut: format(tomorrow, 'yyyy-MM-dd')
  });

  // Fetch required data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch titulares (clientes that are not dependentes)
        const titularesResponse = await axios.get('http://localhost:3000/api/clientes/titulares');
        setTitulares(titularesResponse.data);
        
        // Fetch acomodacoes
        const acomodacoesResponse = await axios.get('http://localhost:3000/api/acomodacoes');
        setAcomodacoes(acomodacoesResponse.data);
        
        // If editing, fetch the estadia details
        if (isEditing) {
          const estadiaResponse = await axios.get(`http://localhost:3000/api/estadias/${id}`);
          const estadia = estadiaResponse.data;
          
          setFormData({
            titularId: estadia.titularId,
            acomodacaoId: estadia.acomodacaoId,
            checkIn: format(new Date(estadia.checkIn), 'yyyy-MM-dd'),
            checkOut: format(new Date(estadia.checkOut), 'yyyy-MM-dd')
          });
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id, isEditing]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!isEditing && !formData.titularId) {
      alert("Cliente titular é obrigatório");
      return;
    }
    
    if (!formData.acomodacaoId) {
      alert("Acomodação é obrigatória");
      return;
    }
    
    if (!formData.checkIn) {
      alert("Data de check-in é obrigatória");
      return;
    }
    
    if (!formData.checkOut) {
      alert("Data de check-out é obrigatória");
      return;
    }
    
    // Validate check-out date is after check-in date
    const checkInDate = new Date(formData.checkIn);
    const checkOutDate = new Date(formData.checkOut);
    
    if (checkOutDate <= checkInDate) {
      alert("A data de check-out deve ser posterior à data de check-in");
      return;
    }
    
    setSubmitStatus('loading');
    
    try {
      if (isEditing) {
        // Update existing estadia (can't change titular)
        const updateData = {
          acomodacaoId: formData.acomodacaoId,
          checkIn: formData.checkIn,
          checkOut: formData.checkOut
        };
        
        const response = await axios.put(`http://localhost:3000/api/estadias/${id}`, updateData);
        console.log("Update response:", response.data);
      } else {
        // Create new estadia
        const response = await axios.post('http://localhost:3000/api/estadias', formData);
        console.log("Create response:", response.data);
      }
      
      setSubmitStatus('success');
      setTimeout(() => {
        navigate(isEditing ? `/estadias/${id}` : '/estadias');
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
        title={isEditing ? 'Editar Estadia' : 'Nova Estadia'}
        subtitle={isEditing ? 'Atualize as informações da estadia' : 'Cadastre uma nova estadia'}
      />

      <Card>
        <form onSubmit={handleSubmit}>
          {submitStatus === 'success' && (
            <Alert
              type="success"
              message={isEditing ? 'Estadia atualizada com sucesso!' : 'Estadia cadastrada com sucesso!'}
            />
          )}

          {submitStatus === 'error' && (
            <Alert
              type="error"
              message={errorMessage || `Ocorreu um erro ao ${isEditing ? 'atualizar' : 'criar'} a estadia.`}
            />
          )}

          <div className="space-y-4">
            {/* Cliente selection - only when creating new estadia */}
            {!isEditing && (
              <div className="mb-4">
                <label htmlFor="titularId" className="block text-gray-700 font-medium mb-1">
                  Cliente Titular <span className="text-red-500">*</span>
                </label>
                <select
                  id="titularId"
                  name="titularId"
                  required
                  className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-1 focus:ring-blue-500"
                  value={formData.titularId}
                  onChange={handleInputChange}
                >
                  <option value="">Selecione um cliente</option>
                  {titulares.map(titular => (
                    <option key={titular.id} value={titular.id}>
                      {titular.nome} ({titular.documentos?.[0]?.tipo}: {titular.documentos?.[0]?.numero})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Acomodacao selection */}
            <div className="mb-4">
              <label htmlFor="acomodacaoId" className="block text-gray-700 font-medium mb-1">
                Acomodação <span className="text-red-500">*</span>
              </label>
              <select
                id="acomodacaoId"
                name="acomodacaoId"
                required
                className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={formData.acomodacaoId}
                onChange={handleInputChange}
              >
                <option value="">Selecione uma acomodação</option>
                {acomodacoes.map(acomodacao => (
                  <option key={acomodacao.id} value={acomodacao.id}>
                    {acomodacao.nomeAcomodacao} - {acomodacao.camaSolteiro} cama(s) solteiro, {acomodacao.camaCasal} cama(s) casal
                  </option>
                ))}
              </select>
            </div>

            {/* Check-in and Check-out dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="mb-4">
                <label htmlFor="checkIn" className="block text-gray-700 font-medium mb-1">
                  Data de Check-in <span className="text-red-500">*</span>
                </label>
                <input
                  id="checkIn"
                  name="checkIn"
                  type="date"
                  required
                  className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-1 focus:ring-blue-500"
                  value={formData.checkIn}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="checkOut" className="block text-gray-700 font-medium mb-1">
                  Data de Check-out <span className="text-red-500">*</span>
                </label>
                <input
                  id="checkOut"
                  name="checkOut"
                  type="date"
                  required
                  className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-1 focus:ring-blue-500"
                  value={formData.checkOut}
                  onChange={handleInputChange}
                />
              </div>
            </div>

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
    </div>
  );
};

export default EstadiaForm;