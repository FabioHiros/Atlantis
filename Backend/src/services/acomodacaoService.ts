
import { PrismaClient, Acomodacao } from '@prisma/client';
import { SolteiroSimplesDirector, SolteiroMaisDirector, CasalSimplesDirector, FamiliaSimplesDirector, FamiliaMaisDirector, FamiliaSuperDirector, DynamicAcomodacaoDirector } from '../domain/directors/acomodacaoDirectors';

export class AcomodacaoService {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

 
  async findAll(): Promise<Acomodacao[]> {
    return this.prisma.acomodacao.findMany();
  }


  async findById(id: string): Promise<Acomodacao | null> {
    return this.prisma.acomodacao.findUnique({
      where: { id }
    });
  }

  
  async createDefaultAcomodacoes(): Promise<Acomodacao[]> {
    const directors = [
      new SolteiroSimplesDirector(this.prisma),
      new SolteiroMaisDirector(this.prisma),
      new CasalSimplesDirector(this.prisma),
      new FamiliaSimplesDirector(this.prisma),
      new FamiliaMaisDirector(this.prisma),
      new FamiliaSuperDirector(this.prisma),
    ];

    const acomodacoes = [];
    for (const director of directors) {
      const acomodacao = await director.build();
      acomodacoes.push(acomodacao);
    }

    return acomodacoes;
  }

  
  async createCustomAcomodacao(data: {
    nomeAcomodacao: string;
    camaSolteiro: number;
    camaCasal: number;
    suite: number;
    climatizacao: boolean;
    garagem: number;
  }): Promise<Acomodacao> {
    const director = new DynamicAcomodacaoDirector(this.prisma);
    return director.build(data);
  }


  async updateAcomodacao(id: string, data: {
    nomeAcomodacao?: string;
    camaSolteiro?: number;
    camaCasal?: number;
    suite?: number;
    climatizacao?: boolean;
    garagem?: number;
  }): Promise<Acomodacao> {
    return this.prisma.acomodacao.update({
      where: { id },
      data
    });
  }


  async deleteAcomodacao(id: string): Promise<Acomodacao> {
    return this.prisma.acomodacao.delete({
      where: { id }
    });
  }
}