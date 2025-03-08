import Acomodacao from "./acomodacao";
import Cliente from "./cliente";

export default class Estadia{
    private titular: Cliente;
    private acomodacao: Acomodacao
    private checkIn: Date
    private checkOut: Date

    constructor(titular: Cliente,acomodacao:Acomodacao,checkIn:Date,checkOut: Date){
        this.titular = titular
        this.acomodacao = acomodacao
        this.checkIn = checkIn
        this.checkOut = checkOut
    }


    public get getAcomodacao(){ return this.acomodacao}
    public get getCheckOut(){ return this.checkOut}
    public get getCheckIn(){ return this.checkIn}
    public get getTitular(){ return this.titular}


    public set Acomodação(acomodacao:Acomodacao){this.acomodacao = acomodacao}
    public set CheckOut(checkOut:Date){this.checkOut = checkOut}
    public set CheckIn(checkIn:Date){this.checkIn = checkIn}
}