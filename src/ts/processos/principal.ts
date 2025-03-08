import Processo from "../abstracoes/processo"
import MenuPrincipal from "../menus/menuPricipal"
import cadastrarEstadia from "./cadastro/cadastrarEstadia"
import CadastroNovaAcomodacao from "./cadastro/cadastrarNovaAcomodacao"
import EditarAcomodacao from "./editar/editarAcomodação"
import EditarEstadia from "./editar/editarEstadia"
import ExcluirAcomodacao from "./excluir/excluirAcomodação"
import ExcluirEstadia from "./excluir/excluirEstadia"
import ListagemAcomodacoes from "./listar/listagemAcomodacoes"
import ListagemEstadias from "./listar/listagemEstadias"
import TipoCadastroCliente from "./seleçãoTipos/tipoCadastroCliente"
import TipoEdicaoCliente from "./seleçãoTipos/TipoEditarCliente"
import TipoExcluirCliente from "./seleçãoTipos/tipoExcluirCliente"
import TipoListagemClientes from "./seleçãoTipos/tipoListagemClientes"

export default class Principal extends Processo {
    constructor() {
        super()
        this.execucao = true
        this.menu = new MenuPrincipal()
    }
    processar(): void {
        this.menu.mostrar()
        this.opcao = this.entrada.receberNumero('Qual opção desejada?')
        switch (this.opcao) {
            case 1:
                this.processo = new TipoCadastroCliente()
                this.processo.processar()
                break
            case 2:
                this.processo = new TipoEdicaoCliente()
                this.processo.processar()
                break
            case 3:
                this.processo = new TipoListagemClientes()
                this.processo.processar()
                break
            case 4:
                this.processo = new TipoExcluirCliente()
                this.processo.processar()
                break
            case 5:
                this.processo = new CadastroNovaAcomodacao()
                this.processo.processar()
            break
            case 6:
                this.processo = new ListagemAcomodacoes()
                this.processo.processar()
                break
            case 7:
                this.processo = new EditarAcomodacao()
                this.processo.processar()
                break
            case 8:
                this.processo = new ExcluirAcomodacao()
                this.processo.processar()
                break
            case 9:
                this.processo = new ListagemEstadias()
                this.processo.processar()
                break
            case 10:
                this.processo = new cadastrarEstadia()
                this.processo.processar()
                break
            case 11:
                this.processo = new EditarEstadia()
                this.processo.processar()
                break
            case 12:
                this.processo = new ExcluirEstadia()
                this.processo.processar()
                break
            case 0:
                this.execucao = false
                console.log('Até logo!')
                console.clear()
                break
            default:
                console.log('Opção não entendida :(')
        }
    }
}