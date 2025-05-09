import api from './axios';
import type {
    Cliente,
    Acomodacao,
    Estadia,
    CreateTitularInput,
    CreateDependenteInput,
    CreateAcomodacaoInput,
    CreateEstadiaInput,
    UpdateClienteInput,
    UpdateEnderecoInput,
    UpdateAcomodacaoInput,
    UpdateEstadiaInput,
    Documento,
    Telefone,
    Endereco
} from '../types';

// Cliente services
export const clienteService = {
  getAllClientes: () => api.get<Cliente[]>('/clientes'),
  
  getClienteById: (id: string) => api.get<Cliente>(`/clientes/${id}`),
  
  getAllTitulares: () => api.get<Cliente[]>('/clientes/titulares'),
  
  getAllDependentes: () => api.get<Cliente[]>('/clientes/dependentes'),
  
  getDependentesByTitularId: (titularId: string) => 
    api.get<Cliente[]>(`/clientes/titular/${titularId}/dependentes`),
  
  createTitular: (data: CreateTitularInput) => 
    api.post<Cliente>('/clientes/titular', data),
  
  createDependente: (titularId: string, data: CreateDependenteInput) => 
    api.post<Cliente>(`/clientes/titular/${titularId}/dependente`, data),
  
  updateCliente: (id: string, data: UpdateClienteInput) => 
    api.put<Cliente>(`/clientes/${id}`, data),
  
  updateClienteEndereco: (id: string, data: UpdateEnderecoInput) => 
    api.put<Endereco>(`/clientes/${id}/endereco`, data),
  
  addDocumentoToCliente: (id: string, data: { tipo: 'CPF' | 'RG' | 'Passaporte', numero: string, dataExpedicao: string }) => 
    api.post<Documento>(`/clientes/${id}/documento`, data),
  
  addTelefoneToCliente: (id: string, data: { ddd: string, numero: string }) => 
    api.post<Telefone>(`/clientes/${id}/telefone`, data),
  
  deleteCliente: (id: string) => 
    api.delete(`/clientes/${id}`)
};

// Acomodacao services
export const acomodacaoService = {
  getAllAcomodacoes: () => 
    api.get<Acomodacao[]>('/acomodacoes'),
  
  getAcomodacaoById: (id: string) => 
    api.get<Acomodacao>(`/acomodacoes/${id}`),
  
  createDefaultAcomodacoes: () => 
    api.post<Acomodacao[]>('/acomodacoes/defaults'),
  
  createCustomAcomodacao: (data: CreateAcomodacaoInput) => 
    api.post<Acomodacao>('/acomodacoes', data),
  
  updateAcomodacao: (id: string, data: UpdateAcomodacaoInput) => 
    api.put<Acomodacao>(`/acomodacoes/${id}`, data),
  
  deleteAcomodacao: (id: string) => 
    api.delete(`/acomodacoes/${id}`)
};

// Estadia services
export const estadiaService = {
  getAllEstadias: () => 
    api.get<Estadia[]>('/estadias'),
  
  getEstadiaById: (id: string) => 
    api.get<Estadia>(`/estadias/${id}`),
  
  getEstadiasByTitularId: (titularId: string) => 
    api.get<Estadia[]>(`/estadias/titular/${titularId}`),
  
  createEstadia: (data: CreateEstadiaInput) => 
    api.post<Estadia>('/estadias', data),
  
  updateEstadia: (id: string, data: UpdateEstadiaInput) => 
    api.put<Estadia>(`/estadias/${id}`, data),
  
  deleteEstadia: (id: string) => 
    api.delete(`/estadias/${id}`)
};