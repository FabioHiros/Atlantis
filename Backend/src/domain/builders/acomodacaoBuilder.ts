
import { Acomodacao, PrismaClient } from '@prisma/client';
import Builder from './interfaces/builder';

export type AcomodacaoCreateInput = {
  nomeAcomodacao: string;
  camaSolteiro: number;
  camaCasal: number;
  suite: number;
  climatizacao: boolean;
  garagem: number;
};

export default class AcomodacaoBuilder implements Builder<Promise<Acomodacao>> {
  private nomeAcomodacao: string = '';
  private camaSolteiro: number = 0;
  private camaCasal: number = 0;
  private suite: number = 0;
  private climatizacao: boolean = false;
  private garagem: number = 0;
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  setNomeAcomodacao(nomeAcomodacao: string): AcomodacaoBuilder {
    this.nomeAcomodacao = nomeAcomodacao;
    return this;
  }

  setCamaSolteiro(camaSolteiro: number): AcomodacaoBuilder {
    this.camaSolteiro = camaSolteiro;
    return this;
  }

  setCamaCasal(camaCasal: number): AcomodacaoBuilder {
    this.camaCasal = camaCasal;
    return this;
  }

  setSuite(suite: number): AcomodacaoBuilder {
    this.suite = suite;
    return this;
  }

  setClimatizacao(climatizacao: boolean): AcomodacaoBuilder {
    this.climatizacao = climatizacao;
    return this;
  }

  setGaragem(garagem: number): AcomodacaoBuilder {
    this.garagem = garagem;
    return this;
  }


  async build(): Promise<Acomodacao> {
    return this.prisma.acomodacao.create({
      data: {
        nomeAcomodacao: this.nomeAcomodacao,
        camaSolteiro: this.camaSolteiro,
        camaCasal: this.camaCasal,
        suite: this.suite,
        climatizacao: this.climatizacao,
        garagem: this.garagem
      }
    });
  }
}