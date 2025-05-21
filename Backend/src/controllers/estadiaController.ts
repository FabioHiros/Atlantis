import { Request, Response, RequestHandler } from 'express';
import { EstadiaService } from '../services/estadiaService';
import prisma from '../../dbConnector';

export class EstadiaController {
  private estadiaService: EstadiaService;

  constructor() {
    this.estadiaService = new EstadiaService(prisma);
    
   
    this.getAll = this.getAll.bind(this);
    this.getById = this.getById.bind(this);
    this.getByTitularId = this.getByTitularId.bind(this);
    this.create = this.create.bind(this);
    this.update = this.update.bind(this);
    this.delete = this.delete.bind(this);
  }

  
  getAll: RequestHandler = async (req, res) => {
    try {
      const estadias = await this.estadiaService.findAll();
      res.status(200).json(estadias);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching estadias', error });
    }
  };


  getById: RequestHandler = async (req, res) => {
    try {
      const { id } = req.params;
      const estadia = await this.estadiaService.findById(id);

      if (!estadia) {
        res.status(404).json({ message: 'Estadia not found' });
        return;
      }

      res.status(200).json(estadia);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching estadia', error });
    }
  };


  getByTitularId: RequestHandler = async (req, res) => {
    try {
      const { titularId } = req.params;
      const estadias = await this.estadiaService.findByTitularId(titularId);
      res.status(200).json(estadias);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching estadias for titular', error });
    }
  };


  create: RequestHandler = async (req, res) => {
    try {
      const { titularId, acomodacaoId, checkIn, checkOut } = req.body;
      
      const estadia = await this.estadiaService.createEstadia({
        titularId,
        acomodacaoId,
        checkIn: new Date(checkIn),
        checkOut: new Date(checkOut)
      });

      res.status(201).json(estadia);
    } catch (error) {
      res.status(500).json({ message: 'Error creating estadia', error });
    }
  };


  update: RequestHandler = async (req, res) => {
    try {
      const { id } = req.params;
      const { acomodacaoId, checkIn, checkOut } = req.body;
      
      const data: any = {};
      if (acomodacaoId) data.acomodacaoId = acomodacaoId;
      if (checkIn) data.checkIn = new Date(checkIn);
      if (checkOut) data.checkOut = new Date(checkOut);
      
      const estadia = await this.estadiaService.updateEstadia(id, data);
      res.status(200).json(estadia);
    } catch (error) {
      res.status(500).json({ message: 'Error updating estadia', error });
    }
  };


  delete: RequestHandler = async (req, res) => {
    try {
      const { id } = req.params;
      await this.estadiaService.deleteEstadia(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: 'Error deleting estadia', error });
    }
  };
}


export default new EstadiaController();