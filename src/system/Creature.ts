import {Race} from "./Race"
import {Stat} from "./Stat"
import {isDefined, sum} from "../lib/Utils"
import {Skill, Skills} from "./Skill";

export class Creature {
    readonly name: string
    race: Race
    private _stats: Map<Stat.Name, {value: number, special: number}> = new Map()
    private _skills: Map<Skill.Name, {ranks: number, special: number}> = new Map()

    constructor(name: string, race: Race, stats: {[stat in Stat.Name]: {value: number, special: number}}) {
        this.name = name
        this.race = race
        Object.keys(stats).map(stat =>
            this._stats.set(stat as Stat.Name, {value: stats[stat].value, special: stats[stat].special})
        )
    }

    private statNumber2Bonus(stat?: number): number {
        if (!isDefined(stat)) throw new Error("Stat value not defined")
        if (stat <= 5) return -18
        if (stat <=10) return -16
        if (stat <=15) return -14
        if (stat <=20) return -12
        if (stat <=25) return -10
        if (stat <=30) return -8
        if (stat <=35) return -6
        if (stat <=40) return -4
        if (stat <=45) return -2
        if (stat <=50) return 0
        if (stat <=55) return 1
        if (stat <=60) return 2
        if (stat <=65) return 3
        if (stat <=70) return 4
        if (stat <=75) return 5
        if (stat <=80) return 6
        if (stat <=85) return 7
        if (stat <=90) return 8
        if (stat <=95) return 9
        if (stat <=100) return 10
        return stat-100+10
    }

    private getStatBonus(statName: Stat.Name): number {
        const stat: {value: number, special: number} | undefined = this._stats.get(statName)
        if (!isDefined(stat)) throw new Error(`Stat ${statName} is not defined`)
        return this.statNumber2Bonus(stat.value) + stat.special + this.race.getStatBonus(statName)
    }

    setStat(statName: Stat.Name, values: {value?: number, special?: number, total?: number}) {
        const stat: {value: number, special: number} | undefined = this._stats.get(statName)
        if (!isDefined(stat)) throw new Error(`Stat ${statName} not defined`)
        const newValue: number = isDefined(values.value)? values.value : stat.value
        const newSpecial: number = isDefined(values.special)? values.special : stat.special
        this._stats.set(statName, {value: newValue, special: newSpecial})
    }

    getStat(statName: Stat.Name): {value?: number, special?: number, total?: number} {
        const stat: {value: number, special: number} | undefined = this._stats.get(statName)
        if (!isDefined(stat)) throw new Error(`Stat ${statName} is not defined`)
        return {
            value: stat.value,
            special: stat.special,
            total: this.getStatBonus(statName)
        }
    }

    private getSkillStatBonus(skill: Skill): number {
        return sum(skill.stats.map(stat => this.getStatBonus(stat)))
    }

    getSkill(name: Skill.Name): {ranks: number, rankBonus: number, statBonus: number, special: number, total: number} {
        const skill: Skill = Skills.get(name)
        let skillStats: {ranks: number, special: number} | undefined = this._skills.get(name)
        if (!isDefined(skillStats)) skillStats = {ranks: 0, special: 0}
        const rankBonus: number = Skills.rankBonus(skillStats.ranks)
        const statBonus: number = this.getSkillStatBonus(skill)
        return {
            ranks: skillStats.ranks,
            rankBonus: rankBonus,
            statBonus: statBonus,
            special: skillStats.special,
            total: rankBonus + statBonus + skillStats.special
        }
    }

    setSkill(name: Skill.Name, attributes: {ranks?: number, special?: number}) {
        const existingAttrs: {ranks: number, special: number} | undefined = this._skills.get(name)
        let newAttrs: {ranks: number, special: number} = {ranks: 0, special: 0}
        if (isDefined(existingAttrs)) {
            newAttrs = existingAttrs
            if (isDefined(attributes.ranks)) newAttrs.ranks = attributes.ranks
            if (isDefined(attributes.special)) newAttrs.special = attributes.special
        } else {
            if (isDefined(attributes.ranks)) newAttrs.ranks = attributes.ranks
            if (isDefined(attributes.special)) newAttrs.special = attributes.special
        }
        this._skills.set(name, newAttrs)
    }

    private skills2JSON() {
        return Skills.all().map(x => x.name).map(skillName => {
            const skill: {ranks: number, rankBonus: number, statBonus: number, special: number, total: number} =
                this.getSkill(skillName as Skill.Name)
            return {
                [skillName]: {
                    ranks: skill.ranks,
                    rankBonus: skill.rankBonus,
                    statBonus: skill.statBonus,
                    special: skill.special,
                    total: skill.total
                }
            }
        }).reduce((x,y) => {return {...x, ...y}})
    }

    toJSON() {
        return {
            name: this.name,
            race: this.race.name,
            St: {
                value: this.getStat(Stat.St).value,
                bonus: this.statNumber2Bonus(this.getStat(Stat.St).value),
                race: this.race.getStatBonus(Stat.St),
                special: this.getStat(Stat.St).special as number,
                total: this.getStat(Stat.St).total
            },
            Co: {
                value: this.getStat(Stat.Co).value,
                bonus: this.statNumber2Bonus(this.getStat(Stat.Co).value),
                race: this.race.getStatBonus(Stat.Co),
                special: this.getStat(Stat.Co).special as number,
                total: this.getStat(Stat.Co).total
            },
            Ag: {
                value: this.getStat(Stat.Ag).value,
                bonus: this.statNumber2Bonus(this.getStat(Stat.Ag).value),
                race: this.race.getStatBonus(Stat.Ag),
                special: this.getStat(Stat.Ag).special as number,
                total: this.getStat(Stat.Ag).total
            },
            Qu: {
                value: this.getStat(Stat.Qu).value,
                bonus: this.statNumber2Bonus(this.getStat(Stat.Qu).value),
                race: this.race.getStatBonus(Stat.Qu),
                special: this.getStat(Stat.Qu).special as number,
                total: this.getStat(Stat.Qu).total
            },
            Sd: {
                value: this.getStat(Stat.Sd).value,
                bonus: this.statNumber2Bonus(this.getStat(Stat.Sd).value),
                race: this.race.getStatBonus(Stat.Sd),
                special: this.getStat(Stat.Sd).special as number,
                total: this.getStat(Stat.Sd).total
            },
            Re: {
                value: this.getStat(Stat.Re).value,
                bonus: this.statNumber2Bonus(this.getStat(Stat.Re).value),
                race: this.race.getStatBonus(Stat.Re),
                special: this.getStat(Stat.Re).special as number,
                total: this.getStat(Stat.Re).total
            },
            In: {
                value: this.getStat(Stat.In).value,
                bonus: this.statNumber2Bonus(this.getStat(Stat.In).value),
                race: this.race.getStatBonus(Stat.In),
                special: this.getStat(Stat.In).special as number,
                total: this.getStat(Stat.In).total
            },
            Pr: {
                value: this.getStat(Stat.Pr).value,
                bonus: this.statNumber2Bonus(this.getStat(Stat.Pr).value),
                race: this.race.getStatBonus(Stat.Pr),
                special: this.getStat(Stat.Pr).special as number,
                total: this.getStat(Stat.Pr).total
            },
            ...this.skills2JSON()
        }
    }

}
