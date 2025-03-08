import Processo from "../../abstracoes/processo";
import MenuEditarTitular from "../../menus/menuEditarTitular";
import Cliente from "../../modelos/cliente";
import Endereco from "../../modelos/endereco";
import Telefone from "../../modelos/telefone";
import CadastroEnderecoTitular from "../cadastro/cadastroEnderecoTitular";
import EditarDocumentoCliente from "./editarDocumentoCliente";


export default class EditarClienteTitular extends Processo  {
    private titular: Cliente
        constructor(titular: Cliente) {
            super()
            this.titular = titular
            this.menu = new MenuEditarTitular()
            
        }
processar(): void {
        
        console.log('Iniciando edição...')
       
        this.menu.mostrar()
        this.opcao  = this.entrada.receberNumero('Escolha uma opção')
        const dependentes = this.titular.Dependentes
        switch(this.opcao){
            case 1:
                let nome = this.entrada.receberTexto('Qual o novo nome ?')
                this.titular.setNome = nome
                break;
            case 2:
                let nomeSocial = this.entrada.receberTexto('Qual novo o nome social ?')
                this.titular.setNomeSocial = nomeSocial
                break;
            case 3:
                let dataNascimento = this.entrada.receberData('Qual a nova data de nascimento?')
                this.titular.setDataNascimento = dataNascimento
                break;
            case 4:
                console.log(this.titular.Telefones)
                let numeroEscolhido = this.entrada.receberTexto('Qual o número (sem ddd) do telefone a ser alterado?')
                let telefoneEscolhido = this.titular.Telefones.find(telefone => telefone.Numero === numeroEscolhido ) 
                if (!telefoneEscolhido){
                    console.log('Telefone não encontrado!')
                    return
                }
                telefoneEscolhido!.setDDD = this.entrada.receberTexto('Digite o novo DDD')
                telefoneEscolhido!.setNumero = this.entrada.receberTexto('Digite o novo número')
                
                //Altera o telefone dos dependentes para o telefone novo
                dependentes.forEach(dependente => dependente.setTelefones = this.titular.Telefones.map(telefone => telefone.clonar( ) as Telefone))
                
                break;
            case 5:
                this.processo = new CadastroEnderecoTitular(this.titular)
                this.processo.processar()
                dependentes.forEach(dependente => dependente.setEndereco = this.titular.Endereco.clonar() as Endereco)
             
                break;
            case 6:
                this.processo = new EditarDocumentoCliente(this.titular)
                this.processo.processar()
                break;
            case 0:
                this.execucao = false
                console.clear()
                break;
            default:
                console.log('numero inválido')
                                
        }

    
        

        


        // let armazem = Armazem.InstanciaUnica
        // armazem.Clientes.push(titular)

        console.log('Finalizando a edição do titular...')
    }
}