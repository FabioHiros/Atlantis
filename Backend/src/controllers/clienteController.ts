
import { Request, Response, RequestHandler } from 'express';
import { ClienteService } from '../services/clienteService';
import prisma from '../../dbConnector';

export class ClienteController {
  private clienteService: ClienteService;

  constructor() {
    this.clienteService = new ClienteService(prisma);
    
    this.getAll = this.getAll.bind(this);
    this.getById = this.getById.bind(this);
    this.getAllTitulares = this.getAllTitulares.bind(this);
    this.getAllDependentes = this.getAllDependentes.bind(this);
    this.getDependentesByTitularId = this.getDependentesByTitularId.bind(this);
    this.createTitular = this.createTitular.bind(this);
    this.createDependente = this.createDependente.bind(this);
    this.updateCliente = this.updateCliente.bind(this);
    this.updateClienteEndereco = this.updateClienteEndereco.bind(this);
    this.addDocumentoToCliente = this.addDocumentoToCliente.bind(this);
    this.addTelefoneToCliente = this.addTelefoneToCliente.bind(this);
    this.deleteCliente = this.deleteCliente.bind(this);
  }

  // Get all clientes
  getAll: RequestHandler = async (req, res) => {
    try {
      const clientes = await this.clienteService.findAll();
      res.status(200).json(clientes);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching clientes', error });
    }
  };

  // Get cliente by ID
  getById: RequestHandler = async (req, res) => {
    try {
      const { id } = req.params;
      const cliente = await this.clienteService.findById(id);

      if (!cliente) {
        res.status(404).json({ message: 'Cliente not found' });
        return;
      }

      res.status(200).json(cliente);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching cliente', error });
    }
  };

  // Get all titulares
  getAllTitulares: RequestHandler = async (req, res) => {
    try {
      const titulares = await this.clienteService.findAllTitulares();
      res.status(200).json(titulares);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching titulares', error });
    }
  };

  // Get all dependentes
  getAllDependentes: RequestHandler = async (req, res) => {
    try {
      const dependentes = await this.clienteService.findAllDependentes();
      res.status(200).json(dependentes);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching dependentes', error });
    }
  };

  // Get dependentes by titular ID
  getDependentesByTitularId: RequestHandler = async (req, res) => {
    try {
      const { titularId } = req.params;
      const dependentes = await this.clienteService.findDependentesByTitularId(titularId);
      res.status(200).json(dependentes);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching dependentes for titular', error });
    }
  };

  // Create a new titular
  createTitular: RequestHandler = async (req, res) => {
    try {
      const { nome, nomeSocial, dataNascimento, endereco, telefone, documento } = req.body;
      
      const cliente = await this.clienteService.createTitular({
        nome,
        nomeSocial,
        dataNascimento: new Date(dataNascimento),
        endereco,
        telefone,
        documento: {
          ...documento,
          dataExpedicao: new Date(documento.dataExpedicao)
        }
      });

      res.status(201).json(cliente);
    } catch (error) {
      res.status(500).json({ message: 'Error creating titular', error });
    }
  };

  // Create a new dependente
  createDependente: RequestHandler = async (req, res) => {
    try {
      const { titularId } = req.params;
      const { nome, nomeSocial, dataNascimento, documento } = req.body;
      
      const dependente = await this.clienteService.createDependente(titularId, {
        nome,
        nomeSocial,
        dataNascimento: new Date(dataNascimento),
        documento: {
          ...documento,
          dataExpedicao: new Date(documento.dataExpedicao)
        }
      });

      res.status(201).json(dependente);
    } catch (error) {
      res.status(500).json({ message: 'Error creating dependente', error });
    }
  };

  // Update cliente
  updateCliente: RequestHandler = async (req, res) => {
    try {
      const { id } = req.params;
      const { nome, nomeSocial, dataNascimento } = req.body;
      
      const data: any = {};
      if (nome) data.nome = nome;
      if (nomeSocial) data.nomeSocial = nomeSocial;
      if (dataNascimento) data.dataNascimento = new Date(dataNascimento);
      
      const cliente = await this.clienteService.updateCliente(id, data);
      res.status(200).json(cliente);
    } catch (error) {
      res.status(500).json({ message: 'Error updating cliente', error });
    }
  };

  // Update cliente endereco
  updateClienteEndereco: RequestHandler = async (req, res) => {
    try {
      const { id } = req.params;
      const { rua, bairro, cidade, estado, pais, codigoPostal } = req.body;
      
      const endereco = await this.clienteService.updateClienteEndereco(id, {
        rua,
        bairro,
        cidade,
        estado,
        pais,
        codigoPostal
      });

      res.status(200).json(endereco);
    } catch (error) {
      res.status(500).json({ message: 'Error updating cliente endereco', error });
    }
  };

  // Add documento to cliente
  addDocumentoToCliente: RequestHandler = async (req, res) => {
    try {
      const { id } = req.params;
      const { tipo, numero, dataExpedicao } = req.body;
      
      const documento = await this.clienteService.addDocumentoToCliente(id, {
        tipo,
        numero,
        dataExpedicao: new Date(dataExpedicao)
      });

      res.status(201).json(documento);
    } catch (error) {
      res.status(500).json({ message: 'Error adding documento to cliente', error });
    }
  };

  // Add telefone to cliente
  addTelefoneToCliente: RequestHandler = async (req, res) => {
    try {
      const { id } = req.params;
      const { ddd, numero } = req.body;
      
      const telefone = await this.clienteService.addTelefoneToCliente(id, {
        ddd,
        numero
      });

      res.status(201).json(telefone);
    } catch (error) {
      res.status(500).json({ message: 'Error adding telefone to cliente', error });
    }
  };

  // Delete cliente
  deleteCliente: RequestHandler = async (req, res) => {
    try {
      const { id } = req.params;
      await this.clienteService.deleteCliente(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: 'Error deleting cliente', error });
    }
  };
}


export default new ClienteController();