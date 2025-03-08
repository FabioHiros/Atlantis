import Processo from "../../abstracoes/processo";
import Armazem from "../../dominio/armazem";
import Cliente from "../../modelos/cliente";
import Estadia from "../../modelos/estadia";
import ListagemTitulares from "../listar/listagemTitulares";
import TipoAcomodacao from "../seleçãoTipos/tipoAcomodação";

export default class cadastrarEstadia extends Processo{
    private armazem = Armazem.InstanciaUnica; 
    private clientes = this.armazem.Clientes.filter(cliente => cliente.Titular === undefined); 


    processar() : void{
    // Escolhendo o Titular
    this.processo = new ListagemTitulares()
    this.processo.processar() 
    let documentoClienteTitular = this.entrada.receberTexto('Digite o número do documento do cliente')
    let titular = this.clientes.find(titular => titular.Documentos.find(documento => documento.Numero === documentoClienteTitular))
    if (!titular){
        console.log('titular não encontrado')
        return
    }

    //checkIN
    let checkIn = this.entrada.receberData('Data do checkIn')
    //checkOut
    let checkOut = this.entrada.receberData('Data do checkOut')

    this.processo = new TipoAcomodacao()
    let tipoAcomodacao = this.processo.processar()

    let estadia = new Estadia(titular,tipoAcomodacao!,checkIn,checkOut)
    this.armazem.Estadias.push(estadia)
    }
}