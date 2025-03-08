import Armazem from "../dominio/armazem";
import Impressor from "../interfaces/impressor";
import Cliente from "../modelos/cliente";
import ImpressorDocumentos from "./impressorDocumentos";
import ImpressorEndereco from "./impressorEndereco";
import ImpressorTelefones from "./impressorTelefones";

export default class ImpressaorDependentes implements Impressor {
    private cliente!: Cliente
    private impressor!: Impressor
    private clientes : Cliente[] =  Armazem.InstanciaUnica.Clientes
    constructor(cliente: Cliente) {
        this.cliente = cliente

    }

    imprimir(): string {
        
          return  this.cliente.Dependentes.map(dependente =>{
            let impressao = `****************************\n`
            + `| Nome: ${dependente.Nome}\n`
            + `| Nome social: ${dependente.NomeSocial}\n`
            + `| Data de nascimento: ${dependente.DataNascimento.toLocaleDateString()}\n`
            + `| Data de cadastro: ${dependente.DataCadastro.toLocaleDateString()}`

        this.impressor = new ImpressorEndereco(dependente.Endereco)
        impressao = impressao + `\n${this.impressor.imprimir()}`

        this.impressor = new ImpressorDocumentos(dependente.Documentos)
        impressao = impressao + `\n${this.impressor.imprimir()}`


        this.impressor = new ImpressorTelefones(dependente.Telefones)
        impressao = impressao + `\n${this.impressor.imprimir()}`

        impressao = impressao + `\n****************************`
        return impressao
    }).join('\n\n')
}

}