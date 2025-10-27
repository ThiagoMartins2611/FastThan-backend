
class UserEntity{

    readonly name:string
    readonly age:number
    readonly email: string
    readonly key: string
    readonly adm: boolean

 

    constructor(name:string, age:number, email:string, key:string, adm:boolean){
        this.name = name
        this.age = age
        this.email = email
        this.key = key,
        this.adm = adm
    }

}

export default UserEntity