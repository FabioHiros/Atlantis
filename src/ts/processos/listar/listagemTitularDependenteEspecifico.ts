import Processo from "../../abstracoes/processo";
import Armazem from "../../dominio/armazem";
import ImpressaorCliente from "../../impressores/impressorCliente";
import Impressor from "../../interfaces/impressor";
import Cliente from "../../modelos/cliente";
import ListagemDependentes from "./listagemDependentes";

export default class ListagemTitularPorDependenteEspecifico extends Processo {
    private clientes: Cliente[]
    private impressor!: Impressor
    constructor() {
        super()
        this.clientes = Armazem.InstanciaUnica.Clientes
    }
    processar(): void {
        console.clear()
        this.processo = new ListagemDependentes()
        this.processo.processar()

        let numeroDocumentoDependente  = this.entrada.receberTexto('Digite o numero do documento do dependente: ')
        this.clientes = this.clientes.filter(cliente => cliente.Titular !== undefined)
        let dependente =  this.clientes.find((cliente:Cliente) => cliente.Documentos.find( documento=> documento.Numero === numeroDocumentoDependente ))
        if(!dependente){
            console.log('Dependente não encontrado')
            return
        }
       
        console.log(`Titular do Dependente  ${dependente!.Nome}`)
        this.impressor = new ImpressaorCliente(dependente.Titular!)
        console.log(this.impressor.imprimir())
    }


}