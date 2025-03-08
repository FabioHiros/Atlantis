import Processo from "../../abstracoes/processo";
import DiretorDinamico from "../../diretores/diretorDinamico";
import Armazem from "../../dominio/armazem";
import Acomodacao from "../../modelos/acomodacao";

export default class CadastroNovaAcomodacao extends Processo {
    private acomodacoes: Acomodacao[]
    constructor() {
        super()
        this.acomodacoes = Armazem.InstanciaUnica.Acomodacoes
    }
    processar(): void {
        let diretorDinamico = new DiretorDinamico()
        this.acomodacoes.push(diretorDinamico.construir())
        console.log('Acomodação Cadastrada')
    }
}