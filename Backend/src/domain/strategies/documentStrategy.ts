
import { PrismaClient } from '@prisma/client';


export interface DocumentStrategy {
  createDocument(data: {
    numero: string;
    dataExpedicao: Date;
    clienteId: string;
  }): Promise<any>;
}


export class CPFStrategy implements DocumentStrategy {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async createDocument(data: {
    numero: string;
    dataExpedicao: Date;
    clienteId: string;
  }) {
    return this.prisma.documento.create({
      data: {
        numero: data.numero,
        tipo: 'CPF',
        dataExpedicao: data.dataExpedicao,
        clienteId: data.clienteId,
      },
    });
  }
}

export class RGStrategy implements DocumentStrategy {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async createDocument(data: {
    numero: string;
    dataExpedicao: Date;
    clienteId: string;
  }) {
    return this.prisma.documento.create({
      data: {
        numero: data.numero,
        tipo: 'RG',
        dataExpedicao: data.dataExpedicao,
        clienteId: data.clienteId,
      },
    });
  }
}

export class PassaporteStrategy implements DocumentStrategy {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async createDocument(data: {
    numero: string;
    dataExpedicao: Date;
    clienteId: string;
  }) {
    return this.prisma.documento.create({
      data: {
        numero: data.numero,
        tipo: 'Passaporte',
        dataExpedicao: data.dataExpedicao,
        clienteId: data.clienteId,
      },
    });
  }
}


export class DocumentContext {
  private strategy: DocumentStrategy;

  constructor(strategy: DocumentStrategy) {
    this.strategy = strategy;
  }

  setStrategy(strategy: DocumentStrategy) {
    this.strategy = strategy;
  }

  async executeStrategy(data: {
    numero: string;
    dataExpedicao: Date;
    clienteId: string;
  }) {
    return this.strategy.createDocument(data);
  }
}