import { Request, Response } from 'express';
import { AcomodacaoService } from '../services/acomodacaoService';
import prisma from '../../dbConnector';

export class AcomodacaoController {
  private acomodacaoService: AcomodacaoService;

  constructor() {
    this.acomodacaoService = new AcomodacaoService(prisma);
    

    this.getAll = this.getAll.bind(this);
    this.getById = this.getById.bind(this);
    this.createDefaults = this.createDefaults.bind(this);
    this.createCustom = this.createCustom.bind(this);
    this.update = this.update.bind(this);
    this.delete = this.delete.bind(this);
  }

  
  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const acomodacoes = await this.acomodacaoService.findAll();
      res.status(200).json(acomodacoes);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching acomodacoes', error });
    }
  }


  async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const acomodacao = await this.acomodacaoService.findById(id);

      if (!acomodacao) {
        res.status(404).json({ message: 'Acomodacao not found' });
        return;
      }

      res.status(200).json(acomodacao);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching acomodacao', error });
    }
  }

 
  async createDefaults(req: Request, res: Response): Promise<void> {
    try {
      const acomodacoes = await this.acomodacaoService.createDefaultAcomodacoes();
      res.status(201).json(acomodacoes);
    } catch (error) {
      res.status(500).json({ message: 'Error creating default acomodacoes', error });
    }
  }


  async createCustom(req: Request, res: Response): Promise<void> {
    try {
      const { nomeAcomodacao, camaSolteiro, camaCasal, suite, climatizacao, garagem } = req.body;
      
      const acomodacao = await this.acomodacaoService.createCustomAcomodacao({
        nomeAcomodacao,
        camaSolteiro,
        camaCasal,
        suite,
        climatizacao,
        garagem
      });

      res.status(201).json(acomodacao);
    } catch (error) {
      res.status(500).json({ message: 'Error creating custom acomodacao', error });
    }
  }


  async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { nomeAcomodacao, camaSolteiro, camaCasal, suite, climatizacao, garagem } = req.body;
      
      const acomodacao = await this.acomodacaoService.updateAcomodacao(id, {
        nomeAcomodacao,
        camaSolteiro,
        camaCasal,
        suite,
        climatizacao,
        garagem
      });

      res.status(200).json(acomodacao);
    } catch (error) {
      res.status(500).json({ message: 'Error updating acomodacao', error });
    }
  }


  async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await this.acomodacaoService.deleteAcomodacao(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: 'Error deleting acomodacao', error });
    }
  }
}


export default new AcomodacaoController();