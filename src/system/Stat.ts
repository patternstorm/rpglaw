export class Stat {
    name: Stat.Name
}

export namespace Stat {
    export enum Name {
        "St" = "St" ,
        "Co" = "Co" ,
        "Ag" = "Ag" ,
        "Qu" = "Qu",
        "Sd" = "Sd",
        "Re" = "Re" ,
        "In" = "In" ,
        "Pr" = "Pr"
    }
    export const St = Name.St
    export const Co = Name.Co
    export const Ag = Name.Ag
    export const Qu = Name.Qu
    export const Sd = Name.Sd
    export const Re = Name.Re
    export const In = Name.In
    export const Pr = Name.Pr

}

export namespace Stats {

    export function all(): Stat.Name[] {
        return [Stat.St, Stat.Co, Stat.Ag, Stat.Qu, Stat.Sd, Stat.Re, Stat.In, Stat.Pr]
    }
}
