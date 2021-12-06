import {Stat} from "./Stat"
import {isDefined} from "../lib/Utils"

export class Race {
    readonly name: Race.Name
    private readonly _stats: Map<Stat.Name, number> = new Map()

    constructor(name: Race.Name, stats: {[stat in Stat.Name]: number}) {
        this.name = name
        Object.keys(stats).map(stat => this._stats.set(stat as Stat.Name, stats[stat]))
    }

    getStatBonus(stat: Stat.Name): number {
        const bonus: number | undefined = this._stats.get(stat)
        return isDefined(bonus)? bonus : 0
    }
}

export namespace Race {
    export type Name = "dwarf"

    export const Dwarf: Race = new Race(
        "dwarf",
        {
            St: 2,
            Co: 5,
            Ag: -1,
            Qu: -1,
            Sd: 4,
            Re: 0,
            In: 0,
            Pr: 0
        })
}
