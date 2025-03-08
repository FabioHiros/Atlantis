import Armazem from "../dominio/armazem";
import Menu from "../interfaces/menu";
export default class MenuTipoAcomodacao implements Menu {
    private acomodacoes = Armazem.InstanciaUnica.Acomodacoes
    mostrar(): void {
        console.clear()
        console.log(`****************************`)
        console.log(`| Qual o tipo acomodação desejada? `)
        this.acomodacoes.forEach(acomodacao => console.log(`| ${this.acomodacoes.indexOf(acomodacao)} ${acomodacao.NomeAcomadacao}`))
        console.log(`----------------------`)
    }
}