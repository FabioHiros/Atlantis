export interface Cliente {
  id: string;
  nome: string;
  nomeSocial: string;
  dataNascimento: string;
  dataCadastro: string;
  documentos: Documento[];
  telefones: Telefone[];
  enderecoId?: string;
  endereco?: Endereco;
  titularId?: string;
  titular?: Cliente;
  dependentes?: Cliente[];
  estadias?: Estadia[];
}

export interface Documento {
  id: string;
  numero: string;
  tipo: string;
  dataExpedicao: string;
  clienteId: string;
}

export interface Telefone {
  id: string;
  ddd: string;
  numero: string;
  clienteId: string;
}

export interface Endereco {
  id: string;
  rua: string;
  bairro: string;
  cidade: string;
  estado: string;
  pais: string;
  codigoPostal: string;
}

export interface Acomodacao {
  id: string;
  nomeAcomodacao: string;
  camaSolteiro: number;
  camaCasal: number;
  suite: number;
  climatizacao: boolean;
  garagem: number;
}

export interface Estadia {
  id: string;
  checkIn: string;
  checkOut: string;
  titularId: string;
  titular?: Cliente;
  acomodacaoId: string;
  acomodacao?: Acomodacao;
}

// Input types for creating/updating

export interface CreateTitularInput {
  nome: string;
  nomeSocial: string;
  dataNascimento: string;
  endereco: {
    rua: string;
    bairro: string;
    cidade: string;
    estado: string;
    pais: string;
    codigoPostal: string;
  };
  telefone: {
    ddd: string;
    numero: string;
  };
  documento: {
    tipo: 'CPF' | 'RG' | 'Passaporte';
    numero: string;
    dataExpedicao: string;
  };
}

export interface CreateDependenteInput {
  nome: string;
  nomeSocial: string;
  dataNascimento: string;
  documento: {
    tipo: 'CPF' | 'RG' | 'Passaporte';
    numero: string;
    dataExpedicao: string;
  };
}

export interface CreateAcomodacaoInput {
  nomeAcomodacao: string;
  camaSolteiro: number;
  camaCasal: number;
  suite: number;
  climatizacao: boolean;
  garagem: number;
}

export interface CreateEstadiaInput {
  titularId: string;
  acomodacaoId: string;
  checkIn: string;
  checkOut: string;
}

export interface UpdateClienteInput {
  nome?: string;
  nomeSocial?: string;
  dataNascimento?: string;
}

export interface UpdateEnderecoInput {
  rua?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
  pais?: string;
  codigoPostal?: string;
}

export interface UpdateAcomodacaoInput {
  nomeAcomodacao?: string;
  camaSolteiro?: number;
  camaCasal?: number;
  suite?: number;
  climatizacao?: boolean;
  garagem?: number;
}

export interface UpdateEstadiaInput {
  acomodacaoId?: string;
  checkIn?: string;
  checkOut?: string;
}