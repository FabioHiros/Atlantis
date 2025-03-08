import Menu from "../interfaces/menu";

export default class MenuEditarTitular implements Menu {
    mostrar(): void {
        console.clear()
        console.log(`****************************`)
        console.log(`| O que deseja alterar? `)
        console.log(`----------------------`)
        console.log(`| 1 - Nome`)
        console.log(`| 2 - Nome social`)
        console.log(`| 3 - Data de nascimento`)
        console.log(`| 4 - Telefone`)
        console.log(`| 5 - Endereço`)
        console.log(`| 6 - Documentos`)
        console.log(`----------------------`)
    }
}