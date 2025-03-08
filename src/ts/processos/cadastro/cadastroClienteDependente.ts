import Processo from "../../abstracoes/processo";
import Armazem from "../../dominio/armazem";
import Cliente from "../../modelos/cliente";
import CadastrarDocumentosCliente from "./cadastrarDocumentosCliente";
import ListagemTitulares from "../listar/listagemTitulares";
import Endereco from "../../modelos/endereco";
import Telefone from "../../modelos/telefone";

export default class CadastroClienteDependente extends Processo {
    private dependente!: Cliente

    processar(): void {
        let armazem = Armazem.InstanciaUnica
        this.processo = new ListagemTitulares()
        this.processo.processar()


        let numeroDocumentoTitular = this.entrada.receberTexto('Digite o numero do documento do titular: ')
        let titular =  armazem.Clientes.find((cliente:Cliente) => cliente.Documentos.find( documento=> documento.Numero === numeroDocumentoTitular ))

        if(!titular){
            console.log('Titular não encontrado')
            return
        }
        else{

        
        console.log('Iniciando o cadastro de um novo cliente...')
        let nome = this.entrada.receberTexto('Qual o nome do novo cliente?')
        let nomeSocial = this.entrada.receberTexto('Qual o nome social do novo cliente?')
        let dataNascimento = this.entrada.receberData('Qual a data de nascimento?')
        this.dependente = new Cliente(nome, nomeSocial, dataNascimento)

        this.dependente.setEndereco = titular!.Endereco.clonar() as Endereco
        this.dependente.setTelefones = titular!.Telefones.map(telefone => telefone.clonar() as Telefone)

        this.processo = new CadastrarDocumentosCliente(this.dependente)
        this.processo.processar()

        this.dependente.setTitular = titular
        titular.setDependentes=[this.dependente]

    
        armazem.Clientes.push(this.dependente)

        console.log('Finalizando o cadastro do cliente...')
    }}
}