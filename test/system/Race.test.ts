import {Race} from "../../src/system/Race"
import {Stat} from "../../src/system/Stat";

test("Get race stats", () => {
    expect(Race.Dwarf.getStatBonus(Stat.St)).toBe(2)
})
