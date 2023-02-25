import { Dice } from './dice.models';
import { Weapon } from './weapons.models';

export type Player = {
    attacks: number,
    name: string,
    expertise: number,
    strMod: number,
    critThreshold: number,
    weapon: Weapon;

    bonusDamage: (number | Dice)[];

    attackRollFunc: () => number;
    damageRollFunc: (die: Dice | number) => number;
};