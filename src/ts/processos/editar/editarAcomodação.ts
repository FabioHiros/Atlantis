import Processo from "../../abstracoes/processo";
import MenuEditarAcomodacao from "../../menus/menuEditarAcomodação";
import Acomodacao from "../../modelos/acomodacao";
import Cliente from "../../modelos/cliente";
import TipoAcomodacao from "../seleçãoTipos/tipoAcomodação";

export default class EditarAcomodacao extends Processo  {
        constructor() {
            super()     
            this.menu = new MenuEditarAcomodacao()
        }
processar(): void {
        
        console.log('Iniciando edição...')
        let tipoAcomodacao = new TipoAcomodacao()
        let acomodacao = tipoAcomodacao.processar()

        this.menu.mostrar()
        this.opcao  = this.entrada.receberNumero('Escolha uma opção')
        switch(this.opcao){
            case 1:
                let camaSolteiro = this.entrada.receberNumero('Número de Camas de Solteiro')
                acomodacao.setCamaSolteiro = camaSolteiro
                break;
            case 2:
                let camaCasal = this.entrada.receberNumero('Número de camas de casal')
                acomodacao.setCamaCasal = camaCasal
                break;
            case 3:
                let suite = this.entrada.receberNumero('Número de suítes')
                acomodacao.setSuite = suite
                break;
            case 4:
                 let climatizacao = this.entrada.receberTexto('Climatização? (S/N)')
                if (climatizacao === 'S') { acomodacao.setClimatizacao = true}
                else{ acomodacao.setClimatizacao = false}
                break;
            case 5:
                let garagem = this.entrada.receberNumero('Número de vagas na garagem')    
                acomodacao.setGaragem = garagem
                break;
            case 0:
                this.execucao = false
                console.clear()
                break;
            default:
                console.log('numero inválido')
                                
        }


        console.log('Finalizando a edição da Acomodação...')
    }
}