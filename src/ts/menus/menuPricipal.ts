import Menu from "../interfaces/menu";

export default class MenuPrincipal implements Menu {
    mostrar(): void {
        console.log(`****************************`)
        console.log(`| Por favor, selecione uma opção...`)
        console.log(`----------------------`)
        console.log(`| Opções para cliente:`)
        console.log(`----------------------`)
        console.log(`| 1 - Cadastrar cliente`)
        console.log(`| 2 - Editar cliente`)
        console.log(`| 3 - Listar cliente(s)`)
        console.log(`| 4 - Excluir cliente`)
        console.log(`----------------------`)
        console.log(`| Opções para gestão:`)
        console.log(`----------------------`)
        console.log(`| 5 - Listar acomodações`)
        console.log(`| 6 - Editar acomodações`)
        console.log(`| 7 - Excluir acomodações`)
        console.log(`| 8 - Listar Estadias`)
        console.log(`| 9 - Cadastrar Estadias`)
        console.log(`| 10 - Editar Estadias`)
        console.log(`| 11 - Excluir Estadias`)
        console.log(`----------------------`)
        console.log(`****************************`)
        console.log(`| 0 - Sair`)
        console.log(`----------------------`)
    }
}