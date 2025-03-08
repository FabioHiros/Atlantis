import Acomodacao from "../modelos/acomodacao";
import Cliente from "../modelos/cliente";
import Estadia from "../modelos/estadia";

export default class Armazem {
    private static instanciaUnica: Armazem = new Armazem()
    private clientes: Cliente[] = []
    private acomodacoes: Acomodacao[] = []
    private estadias: Estadia[]= []
    private constructor() { }
    public static get InstanciaUnica() {
        return this.instanciaUnica
    }
    public get Clientes() {
        return this.clientes
    }
    public get Acomodacoes(){
        return this.acomodacoes
    }
    public get  Estadias(){
        return this.estadias
    }

    public set Acomodacoes(acomodacoes : Acomodacao[]){ this.acomodacoes = acomodacoes}
}