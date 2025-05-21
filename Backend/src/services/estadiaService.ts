
import { PrismaClient, Estadia } from '@prisma/client';

export class EstadiaService {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  
  async findAll(): Promise<Estadia[]> {
    return this.prisma.estadia.findMany({
      include: {
        titular: {
          include: {
            documentos: true
          }
        },
        acomodacao: true
      }
    });
  }

  
  async findById(id: string): Promise<Estadia | null> {
    return this.prisma.estadia.findUnique({
      where: { id },
      include: {
        titular: {
          include: {
            documentos: true
          }
        },
        acomodacao: true
      }
    });
  }


  async findByTitularId(titularId: string): Promise<Estadia[]> {
    return this.prisma.estadia.findMany({
      where: {
        titularId
      },
      include: {
        acomodacao: true
      }
    });
  }


  async createEstadia(data: {
    titularId: string;
    acomodacaoId: string;
    checkIn: Date;
    checkOut: Date;
  }): Promise<Estadia> {
    
    const titular = await this.prisma.cliente.findUnique({
      where: { id: data.titularId }
    });

    if (!titular) {
      throw new Error('Titular not found');
    }

    if (titular.titularId) {
      throw new Error('Dependentes cannot be the titular of an estadia');
    }

   
    return this.prisma.estadia.create({
      data: {
        titularId: data.titularId,
        acomodacaoId: data.acomodacaoId,
        checkIn: data.checkIn,
        checkOut: data.checkOut
      },
      include: {
        titular: true,
        acomodacao: true
      }
    });
  }

 
  async updateEstadia(id: string, data: {
    acomodacaoId?: string;
    checkIn?: Date;
    checkOut?: Date;
  }): Promise<Estadia> {
    return this.prisma.estadia.update({
      where: { id },
      data,
      include: {
        titular: true,
        acomodacao: true
      }
    });
  }

  
  async deleteEstadia(id: string): Promise<Estadia> {
    return this.prisma.estadia.delete({
      where: { id }
    });
  }
}