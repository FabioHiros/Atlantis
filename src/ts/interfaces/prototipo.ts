export default interface Prototipo<T extends Prototipo<T>>{
    clonar(): T
}