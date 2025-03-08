import Processo from "../../abstracoes/processo";
import MenuExcluirCLiente from "../../menus/menuExcluirCliente";
import ExcluirDependente from "../excluir/excluirClienteDependente";
import ExcluirTitular from "../excluir/excluirClienteTitular";

export default class TipoExcluirCliente extends Processo {
    constructor() {
        super();
        this.menu = new MenuExcluirCLiente()
    }

    processar(): void {
        console.clear();
        console.log("Iniciando o processo de exclusão...");



        this.menu.mostrar()
        this.opcao = this.entrada.receberNumero('Qual opção desejada?')
        switch(this.opcao){
            case 1:
                this.processo = new ExcluirTitular()
                this.processo.processar()
                break;
            case 2:
                this.processo = new ExcluirDependente()
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