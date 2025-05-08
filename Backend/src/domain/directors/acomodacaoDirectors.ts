
import { PrismaClient, Acomodacao } from '@prisma/client';
import AcomodacaoBuilder from '../builders/acomodacaoBuilder';

export abstract class AcomodacaoDirector {
  protected builder: AcomodacaoBuilder;

  constructor(prisma: PrismaClient) {
    this.builder = new AcomodacaoBuilder(prisma);
  }

  abstract build(data?: any): Promise<Acomodacao>;
}

export class SolteiroSimplesDirector extends AcomodacaoDirector {
  async build(): Promise<Acomodacao> {
    return this.builder
      .setNomeAcomodacao('Acomodação simples para solteiro(a)')
      .setCamaSolteiro(1)
      .setCamaCasal(0)
      .setSuite(1)
      .setClimatizacao(true)
      .setGaragem(0)
      .build();
  }
}

export class SolteiroMaisDirector extends AcomodacaoDirector {
  async build(): Promise<Acomodacao> {
    return this.builder
      .setNomeAcomodacao('Acomodação com garagem para solteiro(a)')
      .setCamaSolteiro(0)
      .setCamaCasal(1)
      .setSuite(1)
      .setClimatizacao(true)
      .setGaragem(1)
      .build();
  }
}

export class CasalSimplesDirector extends AcomodacaoDirector {
  async build(): Promise<Acomodacao> {
    return this.builder
      .setNomeAcomodacao('Acomodação simples para casal')
      .setCamaSolteiro(0)
      .setCamaCasal(1)
      .setSuite(1)
      .setClimatizacao(true)
      .setGaragem(1)
      .build();
  }
}

export class FamiliaSimplesDirector extends AcomodacaoDirector {
  async build(): Promise<Acomodacao> {
    return this.builder
      .setNomeAcomodacao('Acomodação para família com até duas crianças')
      .setCamaSolteiro(2)
      .setCamaCasal(1)
      .setSuite(1)
      .setClimatizacao(true)
      .setGaragem(1)
      .build();
  }
}

export class FamiliaMaisDirector extends AcomodacaoDirector {
  async build(): Promise<Acomodacao> {
    return this.builder
      .setNomeAcomodacao('Acomodação para família com até cinco crianças')
      .setCamaSolteiro(5)
      .setCamaCasal(1)
      .setSuite(2)
      .setClimatizacao(true)
      .setGaragem(2)
      .build();
  }
}

export class FamiliaSuperDirector extends AcomodacaoDirector {
  async build(): Promise<Acomodacao> {
    return this.builder
      .setNomeAcomodacao('Acomodação para até duas familias, casal e três crianças cada')
      .setCamaSolteiro(6)
      .setCamaCasal(2)
      .setSuite(3)
      .setClimatizacao(true)
      .setGaragem(2)
      .build();
  }
}

export class DynamicAcomodacaoDirector extends AcomodacaoDirector {
  async build(data?: {
    nomeAcomodacao: string;
    camaSolteiro: number;
    camaCasal: number;
    suite: number;
    climatizacao: boolean;
    garagem: number;
  }): Promise<Acomodacao> {
    if (!data) {
      throw new Error("Data is required for DynamicAcomodacaoDirector");
    }
    
    return this.builder
      .setNomeAcomodacao(data.nomeAcomodacao)
      .setCamaSolteiro(data.camaSolteiro)
      .setCamaCasal(data.camaCasal)
      .setSuite(data.suite)
      .setClimatizacao(data.climatizacao)
      .setGaragem(data.garagem)
      .build();
  }
}