import Processo from "../../abstracoes/processo";
import Armazem from "../../dominio/armazem";
import MenuTipoEdicaoClientes from "../../menus/menuTipoEdicaoCliente";
import EditarClienteDependente from "../editar/editarClienteDependente";
import EditarClienteTitular from "../editar/EditarClienteTitular";
import ListagemDependentes from "../listar/listagemDependentes";
import ListagemTitulares from "../listar/listagemTitulares";


export default class TipoEdicaoCliente extends Processo {
    constructor() {
        super();
        this.menu = new MenuTipoEdicaoClientes()
    }

    processar(): void {
        console.clear();
        console.log("Iniciando a edição de cliente...");

        const armazem = Armazem.InstanciaUnica;
        let clientes = armazem.Clientes;


        this.menu.mostrar()
        this.opcao = this.entrada.receberNumero('Qual opção desejada?')
        switch(this.opcao){
            case 1:
                clientes = clientes.filter(cliente => cliente.Titular == undefined)
                this.processo = new ListagemTitulares()
                this.processo.processar()
                let documentoClienteTitular = this.entrada.receberTexto('Digite o número do documento do cliente')
                let titular = clientes.find(titular => titular.Documentos.find(documento => documento.Numero === documentoClienteTitular))
                if (!titular){
                    console.log('titular não encontrado')
                    return
                }
                this.processo = new EditarClienteTitular(titular!)
                this.processo.processar()
                break;
            case 2:
                clientes = clientes.filter(cliente => cliente.Titular !== undefined)
                this.processo = new ListagemDependentes()
                this.processo.processar()
                let documentoClienteDependente = this.entrada.receberTexto('Digite o número do documento do cliente')
                let dependente = clientes.find(dependente => dependente.Documentos.find(documento => documento.Numero === documentoClienteDependente))
                if (!dependente){
                    console.log('dependente não encontrado')
                    return
                }
                this.processo = new EditarClienteDependente(dependente)
                this.processo.processar()
                
                break;
            case 0:
                this.execucao= false
                console.clear()
            default:
                console.log('Opção inválida')

        }


       
    }
}