import { Player } from './models/player.models';
import { getAdvantageAttackRoll, getDieRoll, getGreatWeaponDieRoll, getNormalAttackRoll, performAttack } from './utils/utils';

const ITERATIONS = 10000;

const basePlayer: Player = {
    attacks: 4,
    bonusDamage: [],
    critThreshold: 20,
    expertise: 6,
    name: 'Base Player',
    strMod: 5,
    weapon: {
        bonusDamageDice: [],
        modifier: 0,
        name: 'Standard Unarmed',
        standardDamageDice: [1]
    },
    attackRollFunc: getNormalAttackRoll,
    damageRollFunc: getDieRoll
};

const glaiveSentinel: Player = {
    ...basePlayer,
    name: 'Glaive Sentinel',
    critThreshold: 18,
    damageRollFunc: getGreatWeaponDieRoll,
    weapon: {
        ...basePlayer.weapon,
        bonusDamageDice: ['d4'],
        name: 'Glaive',
        standardDamageDice: ['d10']
    }
};

const gsWar: Player = {
    ...glaiveSentinel,
    name: 'Greatsword Warrior',
    weapon: {
        ...glaiveSentinel.weapon,
        bonusDamageDice: [],
        name: 'Greatsword',
        standardDamageDice: ['d6', 'd6']
    }
};

const hoarahLoux: Player = {
    ...basePlayer,
    name: "Hoarah Loux",
    bonusDamage: ['d10'],
    weapon: {
        ...basePlayer.weapon,
        name: 'Heavy Unarmed',
        standardDamageDice: ['d8']
    },
    attackRollFunc: getAdvantageAttackRoll
};

const hoarahLouxBonus: Player = {
    ...hoarahLoux,
    name: 'Hoarah Loux',
    bonusDamage: [],
    weapon: {
        ...hoarahLoux.weapon,
        name: 'Integrated Heavy Unarmed',
        bonusDamageDice: ['d10'],
        bonusPartOfWeapon: true
    }
};

const brawlerChampion: Player = {
    ...hoarahLoux,
    name: 'Brawler Champion',
    critThreshold: 18,
    bonusDamage: [],
    weapon: {
        ...hoarahLoux.weapon,
        bonusDamageDice: []
    }
};

const players: Player[] = [
    basePlayer,
    brawlerChampion,
    { ...brawlerChampion, weapon: { ...brawlerChampion.weapon, modifier: 1 } },
    { ...brawlerChampion, weapon: { ...brawlerChampion.weapon, modifier: 2 } },
    { ...brawlerChampion, weapon: { ...brawlerChampion.weapon, modifier: 3 } },
    gsWar,
    { ...gsWar, weapon: { ...gsWar.weapon, modifier: 1 } },
    { ...gsWar, weapon: { ...gsWar.weapon, modifier: 2 } },
    { ...gsWar, weapon: { ...gsWar.weapon, modifier: 3 } },
    glaiveSentinel,
    { ...glaiveSentinel, weapon: { ...glaiveSentinel.weapon, modifier: 1 } },
    { ...glaiveSentinel, weapon: { ...glaiveSentinel.weapon, modifier: 2 } },
    { ...glaiveSentinel, weapon: { ...glaiveSentinel.weapon, modifier: 3 } },
    hoarahLoux,
    { ...hoarahLoux, weapon: { ...hoarahLoux.weapon, modifier: 1 } },
    { ...hoarahLoux, weapon: { ...hoarahLoux.weapon, modifier: 2 } },
    { ...hoarahLoux, weapon: { ...hoarahLoux.weapon, modifier: 3 } },
    hoarahLouxBonus,
    { ...hoarahLouxBonus, weapon: { ...hoarahLouxBonus.weapon, modifier: 1 } },
    { ...hoarahLouxBonus, weapon: { ...hoarahLouxBonus.weapon, modifier: 2 } },
    { ...hoarahLouxBonus, weapon: { ...hoarahLouxBonus.weapon, modifier: 3 } }
];

const results = players.map(player =>
{
    const values = new Array(ITERATIONS).fill(0).map(() => performAttack(player, 20));
    const average = values.reduce((acc, v) => acc + v, 0) / ITERATIONS;
    return {
        player,
        average
    };
})
    .sort((a, b) => a.average - b.average);

for (let result of results)
{
    console.log(`${result.player.name} did ${result.average.toFixed(2)} damage on average, using ${result.player.weapon.name}${result.player.weapon.modifier ? `(+${result.player.weapon.modifier})` : ''}.`);
}
console.log('############################################################');
console.log('Done.');