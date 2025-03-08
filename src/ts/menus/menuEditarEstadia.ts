import Menu from "../interfaces/menu";

export default class MenuEditarEstadia implements Menu {
    mostrar(): void {
        console.clear()
        console.log(`****************************`)
        console.log(`| O que deseja alterar? `)
        console.log(`----------------------`)
        console.log(`| 1 - Acomodação`)
        console.log(`| 2 - CheckIn`)
        console.log(`| 3 - CheckOut`)
        console.log(`----------------------`)
    }
}