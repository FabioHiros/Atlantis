
import { PrismaClient, Cliente, Documento, Telefone, Endereco } from '@prisma/client';
import { 
  DocumentContext, 
  CPFStrategy, 
  RGStrategy, 
  PassaporteStrategy 
} from '../domain/strategies/documentStrategy';

export class ClienteService {
  private prisma: PrismaClient;
  private documentContext: DocumentContext;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
    this.documentContext = new DocumentContext(new CPFStrategy(prisma));
  }


  async findAll(): Promise<Cliente[]> {
    return this.prisma.cliente.findMany({
      include: {
        documentos: true,
        telefones: true,
        endereco: true,
        dependentes: true
      }
    });
  }


  async findById(id: string): Promise<Cliente | null> {
    return this.prisma.cliente.findUnique({
      where: { id },
      include: {
        documentos: true,
        telefones: true,
        endereco: true,
        dependentes: true
      }
    });
  }


  async findAllTitulares(): Promise<Cliente[]> {
    return this.prisma.cliente.findMany({
      where: {
        titularId: null
      },
      include: {
        documentos: true,
        telefones: true,
        endereco: true,
        dependentes: true
      }
    });
  }


  async findAllDependentes(): Promise<Cliente[]> {
    return this.prisma.cliente.findMany({
      where: {
        NOT: {
          titularId: null
        }
      },
      include: {
        documentos: true,
        telefones: true,
        endereco: true,
        titular: true
      }
    });
  }


  async findDependentesByTitularId(titularId: string): Promise<Cliente[]> {
    return this.prisma.cliente.findMany({
      where: {
        titularId
      },
      include: {
        documentos: true,
        telefones: true,
        endereco: true
      }
    });
  }


  async createTitular(data: {
    nome: string;
    nomeSocial: string;
    dataNascimento: Date;
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
      dataExpedicao: Date;
    };
  }): Promise<Cliente> {
   
    const endereco = await this.prisma.endereco.create({
      data: data.endereco
    });

    const cliente = await this.prisma.cliente.create({
      data: {
        nome: data.nome,
        nomeSocial: data.nomeSocial,
        dataNascimento: data.dataNascimento,
        enderecoId: endereco.id
      }
    });

  
    await this.prisma.telefone.create({
      data: {
        ddd: data.telefone.ddd,
        numero: data.telefone.numero,
        clienteId: cliente.id
      }
    });

    
    switch (data.documento.tipo) {
      case 'CPF':
        this.documentContext.setStrategy(new CPFStrategy(this.prisma));
        break;
      case 'RG':
        this.documentContext.setStrategy(new RGStrategy(this.prisma));
        break;
      case 'Passaporte':
        this.documentContext.setStrategy(new PassaporteStrategy(this.prisma));
        break;
    }

    await this.documentContext.executeStrategy({
      numero: data.documento.numero,
      dataExpedicao: data.documento.dataExpedicao,
      clienteId: cliente.id
    });

  
    return this.findById(cliente.id) as Promise<Cliente>;
  }

  async createDependente(titularId: string, data: {
    nome: string;
    nomeSocial: string;
    dataNascimento: Date;
    documento: {
      tipo: 'CPF' | 'RG' | 'Passaporte';
      numero: string;
      dataExpedicao: Date;
    };
  }): Promise<Cliente> {

    const titular = await this.prisma.cliente.findUnique({
      where: { id: titularId },
      include: { endereco: true }
    });

    if (!titular) {
      throw new Error('Titular not found');
    }

    
    const dependente = await this.prisma.cliente.create({
      data: {
        nome: data.nome,
        nomeSocial: data.nomeSocial,
        dataNascimento: data.dataNascimento,
        titularId: titular.id,
        enderecoId: titular.enderecoId
      }
    });

    
    switch (data.documento.tipo) {
      case 'CPF':
        this.documentContext.setStrategy(new CPFStrategy(this.prisma));
        break;
      case 'RG':
        this.documentContext.setStrategy(new RGStrategy(this.prisma));
        break;
      case 'Passaporte':
        this.documentContext.setStrategy(new PassaporteStrategy(this.prisma));
        break;
    }

    await this.documentContext.executeStrategy({
      numero: data.documento.numero,
      dataExpedicao: data.documento.dataExpedicao,
      clienteId: dependente.id
    });

    
    const telefonesDoTitular = await this.prisma.telefone.findMany({
      where: { clienteId: titular.id }
    });

    for (const telefone of telefonesDoTitular) {
      await this.prisma.telefone.create({
        data: {
          ddd: telefone.ddd,
          numero: telefone.numero,
          clienteId: dependente.id
        }
      });
    }

    
    return this.findById(dependente.id) as Promise<Cliente>;
  }

  
  async updateCliente(id: string, data: {
    nome?: string;
    nomeSocial?: string;
    dataNascimento?: Date;
  }): Promise<Cliente> {
    return this.prisma.cliente.update({
      where: { id },
      data
    });
  }

  
  async updateClienteEndereco(id: string, enderecoData: {
    rua?: string;
    bairro?: string;
    cidade?: string;
    estado?: string;
    pais?: string;
    codigoPostal?: string;
  }): Promise<Endereco> {
    const cliente = await this.prisma.cliente.findUnique({
      where: { id },
      select: { enderecoId: true }
    });

    if (!cliente || !cliente.enderecoId) {
      throw new Error('Cliente or endereco not found');
    }

    
    return this.prisma.endereco.update({
      where: { id: cliente.enderecoId },
      data: enderecoData
    });
  }

  
  async addDocumentoToCliente(clienteId: string, data: {
    tipo: 'CPF' | 'RG' | 'Passaporte';
    numero: string;
    dataExpedicao: Date;
  }): Promise<Documento> {
    
    switch (data.tipo) {
      case 'CPF':
        this.documentContext.setStrategy(new CPFStrategy(this.prisma));
        break;
      case 'RG':
        this.documentContext.setStrategy(new RGStrategy(this.prisma));
        break;
      case 'Passaporte':
        this.documentContext.setStrategy(new PassaporteStrategy(this.prisma));
        break;
    }

    return this.documentContext.executeStrategy({
      numero: data.numero,
      dataExpedicao: data.dataExpedicao,
      clienteId
    });
  }

  
  async addTelefoneToCliente(clienteId: string, data: {
    ddd: string;
    numero: string;
  }): Promise<Telefone> {
    return this.prisma.telefone.create({
      data: {
        ddd: data.ddd,
        numero: data.numero,
        clienteId
      }
    });
  }

 
  async deleteCliente(id: string): Promise<Cliente> {
    return this.prisma.cliente.delete({
      where: { id }
    });
  }
}