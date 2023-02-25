import { Player } from './models/player.models';
import { getAdvantageAttackRoll, getDieRoll, getGreatWeaponDieRoll, getNormalAttackRoll, performAttack } from './utils/utils';

const ITERATIONS = 100000;

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
    name: 'Hoarah Loux Giant\'s Might as Modifier',
    bonusDamage: [],
    weapon: {
        ...hoarahLoux.weapon,
        bonusDamageDice: ['d10']
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

const players = [basePlayer, glaiveSentinel, gsWar, hoarahLoux, hoarahLouxBonus, brawlerChampion];

for (let player of players)
{
    const values = new Array(ITERATIONS).fill(0).map(() => performAttack(player, 20));
    const average = values.reduce((acc, v) => acc + v, 0) / ITERATIONS;
    console.log(`${player.name} did ${average.toFixed(2)} damage on average, using ${player.weapon.name}.`);
}
