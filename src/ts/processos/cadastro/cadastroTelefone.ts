import Processo from "../../abstracoes/processo"
import Cliente from "../../modelos/cliente"
import Telefone from "../../modelos/telefone"

export default class CadastroTelefone extends Processo {
    private cliente: Cliente
    constructor(cliente: Cliente) {
        super()
        this.cliente = cliente
    }

    processar(): void {
        let DDD = this.entrada.receberTexto('Digite o DDD')
        let numero = this.entrada.receberTexto('Digite o Número de Telefone')
        let telefone = new Telefone(DDD,numero)
        this.cliente.Telefones.push(telefone)
    }
}