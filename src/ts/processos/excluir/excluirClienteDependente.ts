import Processo from "../../abstracoes/processo"
import Armazem from "../../dominio/armazem"
import Cliente from "../../modelos/cliente"
import ListagemDependentes from "../listar/listagemDependentes"

export default class ExcluirDependente extends Processo {
    private clientes: Cliente[]

    constructor() {
        super()
        this.clientes = Armazem.InstanciaUnica.Clientes
    }

    processar(): void {
       
        this.processo = new ListagemDependentes()
        this.processo.processar()


        const numeroDocumento = this.entrada.receberTexto(`Digite o numero do documento do dependente: `)

   
        const dependenteIndex = this.clientes.findIndex(cliente => 
            cliente.Documentos.some(documento => documento.Numero === numeroDocumento)
        )

        if (dependenteIndex === -1) {
            console.log(`Dependente não encontrado.`)
            return
        }

        const dependente = this.clientes[dependenteIndex]
        

        if (!dependente.Titular || dependente.Titular === dependente) {
            console.log(`O cliente com documento ${numeroDocumento} não é um dependente.`)
            return
        }

        const titular = dependente.Titular

        
        const indexNoDependentes = titular.Dependentes.findIndex(d => d === dependente)
        
     
        titular.Dependentes.splice(indexNoDependentes, 1)
        this.clientes.splice(dependenteIndex, 1)
        
        console.log(`Dependente removido com sucesso.`)
    }
}