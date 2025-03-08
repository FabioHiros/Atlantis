import Menu from "../interfaces/menu";

export default class MenuEditarDependente implements Menu {
    mostrar(): void {
        console.clear()
        console.log(`****************************`)
        console.log(`| O que deseja alterar? `)
        console.log(`----------------------`)
        console.log(`| 1 - Nome`)
        console.log(`| 2 - Nome social`)
        console.log(`| 3 - Data de nascimento`)
        console.log(`| 4 - Titular`)
        console.log(`| 5 - Documentos`)
        console.log(`| 0 - sair`)
        console.log(`----------------------`)
    }
}