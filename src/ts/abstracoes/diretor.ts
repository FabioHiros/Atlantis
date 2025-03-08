import Construtor from "../interfaces/construtor";
import Entrada from "../io/entrada";

export default abstract class Diretor<T>{
    protected construtor!: Construtor<T>
    protected entrada? = new Entrada()
    public abstract construir(): T
}