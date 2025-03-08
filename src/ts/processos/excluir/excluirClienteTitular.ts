import Processo from "../../abstracoes/processo"
import Armazem from "../../dominio/armazem"
import Cliente from "../../modelos/cliente"
import ListagemTitulares from "../listar/listagemTitulares"

export default class ExcluirTitular extends Processo {
    private clientes: Cliente[]
    
    constructor() {
        super()
        this.clientes = Armazem.InstanciaUnica.Clientes
    }
    
    processar(): void {
      
        this.processo = new ListagemTitulares()
        this.processo.processar()
     
        const numeroDocumento = this.entrada.receberTexto(`Digite o numero do documento do titular: `)
        
        
        const titularIndex = this.clientes.findIndex(cliente => 
            cliente.Documentos.some(documento => documento.Numero === numeroDocumento) && 
            (!cliente.Titular || cliente.Titular === cliente)
        )
        
        if (titularIndex === -1) {
            console.log(`Titular não encontrado.`)
            return
        }
        
        const titular = this.clientes[titularIndex]

        if (titular.Dependentes.length > 0) {
            const confirmacao = this.entrada.receberTexto(
                `Este titular possui ${titular.Dependentes.length} dependente(s). Excluir também? (S/N): `
            ).toUpperCase()
            
            if (confirmacao === 'S') {
               
                const indicesToRemove = new Set<number>()
                indicesToRemove.add(titularIndex)
                
      
                titular.Dependentes.forEach(dependente => {
                    const dependenteIndex = this.clientes.findIndex(cliente => cliente === dependente)
                    if (dependenteIndex !== -1) {
                        indicesToRemove.add(dependenteIndex)
                    }
                })
                
             
                Array.from(indicesToRemove)
                    .sort((a, b) => b - a)
                    .forEach(index => {
                        this.clientes.splice(index, 1)
                    })
                
                console.log(`Titular e ${titular.Dependentes.length} dependente(s) excluídos com sucesso.`)
            } else {
                console.log(`Operação cancelada. Não é possível excluir um titular com dependentes.`)
                return
            }
        } else {
        
            this.clientes.splice(titularIndex, 1)
            console.log(`Titular com documento de número ${numeroDocumento} excluído com sucesso.`)
        }
    }
}