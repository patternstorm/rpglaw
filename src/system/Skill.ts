import {Stat} from "./Stat";
import {isDefined} from "../lib/Utils";

export class Skill {
    readonly name: Skill.Name
    readonly stats: Stat.Name[]

    constructor(name: Skill.Name, stats: Stat.Name[]) {
        this.name = name
        this.stats = stats
    }
}

export namespace Skill {
    export type Name = "Acting" | "Dancing"

    export function fromString(s: string): Skill.Name | undefined {
        if (s.toLowerCase().includes("act")) return "Acting"
        //TODO
        return undefined
    }
}

export namespace Skills {

    const _skills: Map<Skill.Name, Skill> = new Map([
        ["Acting", new Skill("Acting", [Stat.Pr, Stat.In])],
        ["Dancing", new Skill("Dancing", [Stat.Ag, Stat.Pr])]
    ])

    export function all(): Skill[] {
        return Array.from(_skills.values())
    }

    export function get(name: Skill.Name): Skill {
        const skill: Skill | undefined = _skills.get(name)
        if (!isDefined(skill)) throw new Error(`Skill ${name} not registered`)
        return skill
    }

    export function rankBonus(ranks: number): number {
        if (ranks <= 0) return -25
        if (ranks <= 10) return ranks*5
        if (ranks <= 20) return 50+((ranks-10)*2)
        return 70+(ranks-20)
    }
}
