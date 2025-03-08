import Processo from "../../abstracoes/processo";
import Armazem from "../../dominio/armazem";
import ImpressaorDependentes from "../../impressores/impressorDependente";
import Impressor from "../../interfaces/impressor";
import Cliente from "../../modelos/cliente";
import ListagemTitulares from "./listagemTitulares";

export default class ListagemDependentesPorTitularEspecifico extends Processo {
    private clientes: Cliente[]
    private impressor!: Impressor
    constructor() {
        super()
        this.clientes = Armazem.InstanciaUnica.Clientes
    }
    processar(): void {
        console.clear()
        this.processo = new ListagemTitulares()
        this.processo.processar()

        let numeroDocumentoTitular  = this.entrada.receberTexto('Digite o numero do documento do titular: ')
        this.clientes = this.clientes.filter(cliente => cliente.Titular == undefined)
        let titular =  this.clientes.find((cliente:Cliente) => cliente.Documentos.find( documento=> documento.Numero === numeroDocumentoTitular ))
        if(!titular){
            console.log('Titular não encontrado')
            return
        }
       
        console.log(`Dependentes do Titular ${titular!.Nome}`)
        this.impressor = new ImpressaorDependentes(titular!)
        console.log(this.impressor.imprimir())
    }

}