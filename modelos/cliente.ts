import Prototipo from "../interfaces/prototipo"
import Documento from "./documento"
import Endereco from "./endereco"
import Telefone from "./telefone"

export default class Cliente {
    public nome: string
    public nomeSocial: string
    public dataNascimento: Date
    public dataCadastro: Date
    public telefones: Telefone[] = []
    public endereco: Endereco
    public documentos: Documento[] = []
    public dependentes: Cliente[] = []
    public titular: Cliente


    adiconarTelefoneParaDependente(): Telefone[]{
        return this.telefones.map((telefone) => telefone.clonar() as Telefone)
    }

}