import Diretor from "../abstracoes/diretor"
import ConstrutorAcomodacao from "../construtores/construtorAcomodacao"
import { NomeAcomadacao } from "../enumeracoes/NomeAcomadacao"
import Acomodacao from "../modelos/acomodacao"

export default class DiretorDinamico extends Diretor<Acomodacao> {
    constructor() {
        super()
        this.construtor = new ConstrutorAcomodacao()
    }

    construir(): Acomodacao {
        let novaAcomodacao = this.construtor as ConstrutorAcomodacao
        novaAcomodacao.NomeAcomodacao = this.entrada!.receberTexto('Nome da Acomodação') as NomeAcomadacao
        novaAcomodacao.CamaSolteiro= this.entrada!.receberNumero('Número de camas de Solteiro')
        novaAcomodacao.CamaCasal = this.entrada!.receberNumero('Número de camas de Casal')
        novaAcomodacao.Suite= this.entrada!.receberNumero('Número de Suítes')
        
        let climatizacaoQuarto = this.entrada!.receberTexto('Climatização? (S/N)').toLowerCase()
        if (climatizacaoQuarto === "s"){ novaAcomodacao.Climatizacao = true}
        else{novaAcomodacao.Climatizacao = false}
        
        novaAcomodacao.Garagem = this.entrada!.receberNumero('Vagas na gararem')
        return novaAcomodacao.construir()
        
        
    }
}