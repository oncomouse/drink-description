import drinkDescription from './index';
import { permutations } from './lib/permutations';
import _ from 'lodash';

_.times(6, () => console.log(drinkDescription(['Blended Aged Rum', 'Black Blended Rum', 'Blended Lightly Aged Rum', 'Lime', 'Grenadine', 'Demerara Syrup', 'Blackberry Brandy', 'Angostura Bitters'])))
