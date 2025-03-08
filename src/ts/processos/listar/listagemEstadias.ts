import Processo from "../../abstracoes/processo";
import Armazem from "../../dominio/armazem";
import ImpressorAcomodacao from "../../impressores/impressorAcomodacao";
import ImpressorEstadia from "../../impressores/impressorEstadia";
import Impressor from "../../interfaces/impressor";
import Acomodacao from "../../modelos/acomodacao";
import Estadia from "../../modelos/estadia";

export default class ListagemEstadias extends Processo {
    private estadias: Estadia[]
    private impressor!: Impressor
    constructor() {
        super()
        this.estadias = Armazem.InstanciaUnica.Estadias
    }
    processar(): void {
        console.clear()
        console.log('Iniciando a listagem das estadias...')
        console.log(`-------------------------------------------------`)
        this.estadias.forEach(estadia => {
            this.impressor = new ImpressorEstadia(estadia)
            console.log(this.impressor.imprimir())
            console.log(`-------------------------------------------------`)
        })
    }
}