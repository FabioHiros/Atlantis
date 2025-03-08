import Impressor from "../interfaces/impressor";

import Estadia from "../modelos/estadia";

export default class ImpressorEstadia implements Impressor {
    private estadia: Estadia
    constructor(estadia: Estadia) {
        this.estadia = estadia
    }
    imprimir(): string {
        let descricao = `Cliente: ${this.estadia.getTitular.Nome.toString()}\n`
            + `-- Documento: 
            ${this.estadia.getTitular.Documentos[0].Tipo}\n
            número: ${this.estadia.getTitular.Documentos[0].Numero}\n`
            + `-- Acomodação: ${this.estadia.getAcomodacao.NomeAcomadacao}\n`
            + `-- Data do CheckIn: ${this.estadia.getCheckIn}\n`
            + `-- Data do CheckOut: ${this.estadia.getCheckOut}\n`
        return descricao
    }

}