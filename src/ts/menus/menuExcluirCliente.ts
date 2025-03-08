import Menu from "../interfaces/menu"

export default class MenuExcluirCLiente implements Menu{
    mostrar(): void {
        console.clear()
        console.log(`****************************`)
        console.log(`| Escolha o que tipo de cliente que deseja excluir `)
        console.log(`----------------------`)
        console.log(`| 1 - Titular`)
        console.log(`| 2 - Dependente`)
        console.log(`| 0 - Voltar`)
        console.log(`----------------------`)
    }
}