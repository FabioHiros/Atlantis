import Prototipo from "../interfaces/prototipo"
import Cliente from "./cliente";

export default class Telefone extends Cliente implements Prototipo<Telefone> {
     ddd: string
     numero: string

    clonar(): Telefone {
        let telefone = new Telefone();
        telefone.ddd = this.ddd
        telefone.numero = this.numero
        return telefone
    }
}