import Menu from "../interfaces/menu";

export default class MenuTipoEdicaoClientes implements Menu {
    mostrar(): void {
        console.clear()
        console.log(`****************************`)
        console.log(`| Qual o tipo de listagem desejada? `)
        console.log(`----------------------`)
        console.log(`| 1 - Titulares`)
        console.log(`| 2 - Dependentes`)
        console.log(`----------------------`)
    }
}