import { Dice } from './dice.models';

export type Weapon = {
    standardDamageDice: (number | Dice)[];
    bonusDamageDice: (number | Dice)[];
    modifier: number;
    name: string;
};
