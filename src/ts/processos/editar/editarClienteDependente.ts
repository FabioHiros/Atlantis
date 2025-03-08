import Processo from "../../abstracoes/processo";
import Armazem from "../../dominio/armazem";
import MenuEditarDependente from "../../menus/menuEditarDependente";
import Cliente from "../../modelos/cliente";
import ListagemTitulares from "../listar/listagemTitulares";
import EditarDocumentoCliente from "./editarDocumentoCliente";


export default class EditarClienteDependente extends Processo  {
    private dependente: Cliente
    private clientes: Cliente[]
        constructor(dependente: Cliente) {
            super()
            this.dependente = dependente
            this.menu = new MenuEditarDependente()
            this.clientes = Armazem.InstanciaUnica.Clientes
            
        }
processar(): void {
        
        console.log('Iniciando edição...')
       
        this.menu.mostrar()
        this.opcao  = this.entrada.receberNumero('Escolha uma opção')
        switch(this.opcao){
            case 1:
                let nome = this.entrada.receberTexto('Qual o novo nome ?')
                this.dependente.setNome = nome
                break;
            case 2:
                let nomeSocial = this.entrada.receberTexto('Qual novo o nome social ?')
                this.dependente.setNomeSocial = nomeSocial
                break;
            case 3:
                let dataNascimento = this.entrada.receberData('Qual a nova data de nascimento?')
                this.dependente.setDataNascimento = dataNascimento
                break;
            case 4:
                  this.processo = new ListagemTitulares()
                  this.processo.processar()
                  let numeroDocumentoTitular  = this.entrada.receberTexto('Digite o numero do documento do titular: ')
                this.clientes = this.clientes.filter(cliente => cliente.Titular == undefined)
               
                let novoTitular =  this.clientes.find((cliente:Cliente) => cliente.Documentos.find( documento=> documento.Numero === numeroDocumentoTitular ))
                if(!novoTitular){
                    console.log('Titular não encontrado')
                    return
                }
                let titularAntigo = this.dependente.Titular

                //Remove o dependente do titular antigo
                const index = titularAntigo!.Dependentes.indexOf(this.dependente);
                if (index !== -1) {
                    titularAntigo!.Dependentes.splice(index, 1);  
                }
                this.dependente.setTitular = novoTitular
                this.dependente.setEndereco = novoTitular.Endereco
                this.dependente.setTelefones = novoTitular.Telefones
                novoTitular.Dependentes.push(this.dependente)
                break;
            case 5:
                this.processo = new EditarDocumentoCliente(this.dependente)
                this.processo.processar()
                break;
            case 0:
                this.execucao = false
                console.clear()
                break;
            default:
                console.log('numero inválido')
                                
        }


        console.log('Finalizando a edição do dependente...')
    }
}