import {Creature} from "../../src/system/Creature"
import {random} from "../../src/lib/Utils"
import {Race} from "../../src/system/Race"
import {Stat} from "../../src/system/Stat";
import {Skills} from "../../src/system/Skill";

test("Get creature stats", () => {
    const pc = new Creature(
        "pc",
        Race.Dwarf,
        {
            St: {value: random(1,102), special: 5},
            Co: {value: random(1,102), special: 0},
            Ag: {value: random(1,102), special: 0},
            Qu: {value: random(1,102), special: 0},
            Sd: {value: random(1,102), special: 0},
            Re: {value: random(1,102), special: 0},
            In: {value: random(1,102), special: -5},
            Pr: {value: random(1,102), special: 0},
        }
    )
    let sheet = pc.toJSON()
    console.log(JSON.stringify(sheet))
    expect(sheet.St.total).toBe(sheet.St.bonus + sheet.St.race + sheet.St.special)
    expect(sheet.Co.total).toBe(sheet.Co.bonus + sheet.Co.race + sheet.Co.special)
    expect(sheet.Ag.total).toBe(sheet.Ag.bonus + sheet.Ag.race + sheet.Ag.special)
    expect(sheet.Sd.total).toBe(sheet.Sd.bonus + sheet.Sd.race + sheet.Sd.special)
    expect(sheet.Re.total).toBe(sheet.Re.bonus + sheet.Re.race + sheet.Re.special)
    expect(sheet.In.total).toBe(sheet.In.bonus + sheet.In.race + sheet.In.special)
    expect(sheet.Pr.total).toBe(sheet.Pr.bonus + sheet.Pr.race + sheet.Pr.special)

    let value: number | undefined = pc.getStat(Stat.St).value
    pc.setStat(Stat.St, {special: 3})
    expect(pc.getStat(Stat.St).special).toBe(3)
    expect(pc.getStat(Stat.St).value).toBe(value)

    value = pc.getStat(Stat.Co).value
    pc.setStat(Stat.Co, {special: -2})
    expect(pc.getStat(Stat.Co).special).toBe(-2)
    expect(pc.getStat(Stat.Co).value).toBe(value)

    pc.setStat(Stat.Ag, {value: 83, special: 3})
    expect(pc.getStat(Stat.Ag).special).toBe(3)
    expect(pc.getStat(Stat.Ag).value).toBe(83)

    value = pc.getStat(Stat.Sd).value
    pc.setStat(Stat.Sd ,{special: 3})
    expect(pc.getStat(Stat.Sd).special).toBe(3)
    expect(pc.getStat(Stat.Sd).value).toBe(value)

    value = pc.getStat(Stat.Re).special
    pc.setStat(Stat.Re,  {value: 35})
    expect(pc.getStat(Stat.Re).special).toBe(value)
    expect(pc.getStat(Stat.Re).value).toBe(35)

    value = pc.getStat(Stat.In).value
    pc.setStat(Stat.In, {special: 3})
    expect(pc.getStat(Stat.In).special).toBe(3)
    expect(pc.getStat(Stat.In).value).toBe(value)

    pc.setStat(Stat.Pr, {value: 67, special: 3})
    expect(pc.getStat(Stat.Pr).special).toBe(3)
    expect(pc.getStat(Stat.Pr).value).toBe(67)

    sheet = pc.toJSON()
    console.log(JSON.stringify(sheet))
    expect(sheet.St.total).toBe(sheet.St.bonus + sheet.St.race + sheet.St.special)
    expect(sheet.Co.total).toBe(sheet.Co.bonus + sheet.Co.race + sheet.Co.special)
    expect(sheet.Ag.total).toBe(sheet.Ag.bonus + sheet.Ag.race + sheet.Ag.special)
    expect(sheet.Sd.total).toBe(sheet.Sd.bonus + sheet.Sd.race + sheet.Sd.special)
    expect(sheet.Re.total).toBe(sheet.Re.bonus + sheet.Re.race + sheet.Re.special)
    expect(sheet.In.total).toBe(sheet.In.bonus + sheet.In.race + sheet.In.special)
    expect(sheet.Pr.total).toBe(sheet.Pr.bonus + sheet.Pr.race + sheet.Pr.special)

    let skill: {ranks: number, rankBonus: number, statBonus: number, special: number, total: number} =
        pc.getSkill("Acting")
    let special: number = skill.special
    pc.setSkill("Acting", {ranks: 2})
    expect(pc.getSkill("Acting").ranks).toBe(2)
    expect(pc.getSkill("Acting").special).toBe(special)
    skill = pc.getSkill("Acting")

    let ranks: number = pc.getSkill("Acting").ranks
    pc.setSkill("Acting", {special: 10})
    expect(pc.getSkill("Acting").ranks).toBe(ranks)
    expect(pc.getSkill("Acting").special).toBe(10)

    pc.setSkill("Dancing", {ranks: 2, special: 20})
    expect(pc.getSkill("Dancing").ranks).toBe(2)
    expect(pc.getSkill("Dancing").special).toBe(20)

    sheet = pc.toJSON()
    console.log(JSON.stringify(sheet))

    Skills.all().map(x => {
        const skill: {ranks: number, rankBonus: number, statBonus: number, special: number, total: number} =
            pc.getSkill(x.name)
        expect(skill.total).toBe(skill.rankBonus+ skill.statBonus + skill.special)
    })
})
