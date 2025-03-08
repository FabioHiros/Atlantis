import Menu from "../interfaces/menu";

export default class MenuEditarAcomodacao implements Menu {
    mostrar(): void {
        console.clear()
        console.log(`****************************`)
        console.log(`| O que deseja alterar? `)
        console.log(`----------------------`)
        console.log(`| 1 - Nome Acomodação`)
        console.log(`| 2 - Cama de Solteiro`)
        console.log(`| 3 - Cama de Casal`)
        console.log(`| 4 - Suite`)
        console.log(`| 5 - Climatização`)
        console.log(`| 6 - Garagem`)
        console.log(`| 0 - sair`)
        console.log(`----------------------`)
    }
}