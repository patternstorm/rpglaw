import {Google} from "../google/sheets"


async function main() {
    const oauth2Client = await Google.Sheets.getAccessCredentials()
    console.log(oauth2Client)
    // const creature: Creature = await getCreature("1x3i11KCXM3n-cOv3TGlGiQd1pdLr1lkDrPMOcPCQY7o")
    // console.log(creature.url)
    // const woundsNumber = await creature.getNumberOfWounds()
    // console.log(woundsNumber)
}

main();
