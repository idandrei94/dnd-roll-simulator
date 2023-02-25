import { Dice } from '../models/dice.models';
import { Player } from '../models/player.models';

export const getDieRoll: (die: Dice | number) => number = (die) =>
{
    if (typeof (die) === 'number')
    {
        return die;
    }
    const size = Number.parseInt(die.substring(1));
    return Math.floor(Math.random() * size + 1);
};

export const getGreatWeaponDieRoll: (die: Dice | number) => number = die =>
{
    if (typeof (die) === 'number')
    {
        return die;
    }
    const value = getDieRoll(die);
    return value < 3 ? getDieRoll(die) : value;
};

export const getAdvantageAttackRoll: () => number = () => [getDieRoll('d20'), getDieRoll('d20')].sort((a, b) => b - a)[0];
export const getNormalAttackRoll: () => number = () => getDieRoll('d20');


export const checkAttackRoll: (roll: number, crit: number, rollMod: number, targetAc: number) => 'miss' | 'hit' | 'crit' = (roll, crit, rollMod, targetAc) =>
{
    const total = roll + rollMod;
    if (roll >= crit)
    {
        return 'crit';
    }
    return total >= targetAc ? 'hit' : 'miss';
};

const getAttackDamage: (type: 'miss' | 'hit' | 'crit', dice: (number | Dice)[], modifier: number, damageDiceFunc: (die: Dice | number) => number) => number = (type, dice, modifier, damageDiceFunc) =>
{
    if (type == 'miss' || !dice.length)
    {
        return 0;
    } else
    {
        const actualDice = dice.filter(d => typeof (d) !== 'number');
        const rollDice = type === 'hit' ? [...dice] : [...actualDice, ...actualDice, ...dice.filter(d => typeof (d) === 'number')];
        const result = modifier + rollDice.map(damageDiceFunc).reduce((acc, v) => acc + v, 0);
        return result;
    }
};


export const performAttack: (player: Player, targetAc: number) => number = (player, targetAc) =>
{
    const attackRollMod = player.expertise + player.weapon.modifier + player.strMod;
    const damageMod = player.strMod + player.weapon.modifier;

    const bonusAttackResult = checkAttackRoll(player.attackRollFunc(), player.critThreshold, attackRollMod, targetAc);
    const bonusDamage = getAttackDamage(bonusAttackResult, player.weapon.bonusDamageDice, damageMod, player.damageRollFunc);
    const weaponDamage = new Array(player.attacks)
        .fill(0).map(() =>
            getAttackDamage(checkAttackRoll(player.attackRollFunc(), player.critThreshold, attackRollMod, targetAc), player.weapon.standardDamageDice, damageMod, player.damageRollFunc)
        )
        .reduce((acc, v) => acc + v, 0);

    return bonusDamage + weaponDamage + player.bonusDamage.map(player.damageRollFunc).reduce((acc, v) => acc + v, 0);
};