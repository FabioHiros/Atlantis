import Processo from "../../abstracoes/processo";
import Armazem from "../../dominio/armazem";
import MenuTipoAcomodacao from "../../menus/menuTIpoAcomodacao";
import Acomodacao from "../../modelos/acomodacao";

export default class TipoAcomodacao extends Processo {
    private acomodacoes = Armazem.InstanciaUnica.Acomodacoes

    constructor() {
        super();
        this.menu = new MenuTipoAcomodacao()
    }

    processar(): Acomodacao {
        console.clear();
        let validaOpcao = false
        let acomodacao! : Acomodacao 
        // Menu das opções de acomodação
        this.menu.mostrar()
        while(!validaOpcao){
            this.opcao = this.entrada.receberNumero('Qual opção desejada?')
            
            if (this.opcao >=0 &&  this.opcao< this.acomodacoes.length){
                acomodacao = this.acomodacoes[this.opcao]
                validaOpcao = true;
            }else{
                console.log('Opção inválida')
            }
        }

        
        
        return acomodacao

        }


       
    }
