import Processo from "../../abstracoes/processo";
import Armazem from "../../dominio/armazem";
import MenuEditarEstadia from "../../menus/menuEditarEstadia";
import ListagemTitulares from "../listar/listagemTitulares";

export default class ExcluirEstadia extends Processo {
    constructor() {
        super();
        this.menu = new MenuEditarEstadia()
    }

    processar(): void {
        console.clear();
        console.log("Iniciando a edição de cliente...");

        const armazem = Armazem.InstanciaUnica;
        let clientes = armazem.Clientes;

        let estadias = armazem.Estadias

        clientes = clientes.filter(cliente => cliente.Titular == undefined)
        this.processo = new ListagemTitulares()
        this.processo.processar()
        let documentoClienteTitular = this.entrada.receberTexto('Digite o número do documento do cliente')
        let titular = clientes.find(titular => titular.Documentos.find(documento => documento.Numero === documentoClienteTitular))
        if (!titular){
            console.log('titular não encontrado')
            return
        }

        let estadiaIndex = estadias.findIndex(estadia => titular === estadia.getTitular)
        if(estadiaIndex ===-1){
            console.log('Estadia não encontrada para esse titular')
            return
        }
       
        armazem.Estadias.splice(estadiaIndex,1)
        console.log('Estadia Removida')
    }
}