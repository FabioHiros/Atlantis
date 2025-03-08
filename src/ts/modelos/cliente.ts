import Documento from "./documento"
import Endereco from "./endereco"
import Telefone from "./telefone"

export default class Cliente {
    private nome: string
    private nomeSocial: string
    private dataNascimento: Date
    private dataCadastro: Date
    private telefones: Telefone[] = []
    private endereco!: Endereco
    private documentos: Documento[] = []
    private dependentes: Cliente[] = []
    private titular?: Cliente

    constructor(nome: string, nomeSocial: string, dataNascimento: Date) {
        this.nome = nome
        this.nomeSocial = nomeSocial
        this.dataNascimento = dataNascimento
        this.dataCadastro = new Date()
    }

    public get Nome() : string { return this.nome }
    public get NomeSocial() : string { return this.nomeSocial }
    public get DataNascimento() : Date { return this.dataNascimento }
    public get DataCadastro() : Date { return this.dataCadastro }
    public get Telefones(): Telefone[] { return this.telefones }
    public get Endereco() : Endereco { return this.endereco }
    public get Documentos() : Documento[] { return this.documentos }
    public get Dependentes(): Cliente[] { return this.dependentes }
    public get Titular()  : Cliente | undefined { return this.titular }

    public set setNome(nome: string) { this.nome = nome }
    public set setNomeSocial(nomeSocial: string) { this.nomeSocial = nomeSocial }
    public set setDataNascimento(dataNascimento: Date) { this.dataNascimento = dataNascimento }
    public set setTelefones(telefones: Telefone[]) { this.telefones = telefones }
    public set setEndereco(endereco: Endereco) { this.endereco = endereco }
    public set setDocumentos(documentos: Documento[]) { this.documentos = documentos }
    public set setDependentes(dependentes: Cliente[]) { this.dependentes = [...this.dependentes, ...dependentes] }
    public set setTitular(titular: Cliente | undefined) { this.titular = titular }
}