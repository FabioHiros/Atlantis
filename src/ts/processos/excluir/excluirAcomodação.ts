import Processo from "../../abstracoes/processo"
import Armazem from "../../dominio/armazem"
import Acomodacao from "../../modelos/acomodacao"
import Cliente from "../../modelos/cliente"
import ListagemTitulares from "../listar/listagemTitulares"
import TipoAcomodacao from "../seleçãoTipos/tipoAcomodação"

export default class ExcluirAcomodacao extends Processo {
    constructor() {
        super()
        
    }
    
    processar(): void {
        let tipoAcomodacao = new TipoAcomodacao()
        let acomodacaoDeletar  = tipoAcomodacao.processar() 
        Armazem.InstanciaUnica.Acomodacoes = Armazem.InstanciaUnica.Acomodacoes.filter(acomodacao => acomodacao !== acomodacaoDeletar)

    }
}