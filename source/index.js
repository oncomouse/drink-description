import tracery from 'tracery-grammar';
import _ from 'lodash';
import { Map } from 'immutable';
import { permutations } from './lib/permutations';
import grammarSrc from './data/grammar.json';

let grammarCache = Map();
const drinkDescriptionModifiers = Object.assign({
	// helper functions go here!
	foobar: (s) => s,
	tikify: (s) => s.replace(/ syrup/ig,'').replace(/ brandy/ig,'').replace(/ liqueur/ig,'').replace(/(demerara|orgeat|honey)/ig, 'Exotic Syrups').replace(/ Ale\/Beer/,' Ale').replace(' Heering','').replace('Pineapple Fruit','Pineapple') // Remove "brandy", "liqueur" and "syrup", replace "demerara", "honey", and "orgeat" with "Exotic Syrups"
}, tracery.baseEngModifiers);
const additionalTikiPhrases = {
	'Exotic Spices': [
		'Cinnamon',
		'Vanilla',
		'Allspice Dram',
		'Falernum'
	],
	'Fresh Juices': [
		'Grapefruit',
		'Lime',
		'Lemon',
		'Orange',
		'Pineapple'
	]//,
	//'Fruit Flavors': [
	//	'grenadine',
	//	'pear',
	//	'peach',
	//	'apricot',
	//	'blackberry',
	//	'falernum'
	//]
}

const substituteAdditionalTikiIngredients = (ingredients) => {
	
	//_.each(additionalTikiPhrases,(ingredientList, tikiPhrase) => _.reduce(ingredientList, (needsPhrase, ingredient) => (needsPhrase ? true : _.includes(ingredients, ingredient)), false) ? ingredients.push(tikiPhrase) : null);
	
	return ingredients;
}

export default (ingredients, useCache=true) => {
	const cacheKey = _.chain(ingredients).map((x) => x.toLowerCase()).sort().value().join('');
	let grammar = undefined;
	if(useCache && grammarCache.has(cacheKey)) {
		[grammar, ingredients] = grammarCache.get(cacheKey);
	} else {
		let localSrc = Object.assign({}, grammarSrc);
		
		let rums = _.remove(ingredients, (x) => x.match(/(Rum|Rhum)/) !== null);
		if(rums.length >= 1) {
			ingredients.push('Rum');
		}
		
		ingredients = _.map(ingredients, (x) => drinkDescriptionModifiers.tikify(x));
		ingredients = substituteAdditionalTikiIngredients(ingredients);
		_.remove(ingredients, (x) => x.match(/bitters$/i) !== null || x.match(/(lime|lemon)/i) !== null || x.match(/herbstura/i) !== null || x.match(/seltzer/i) !== null); // Remove bitters and lemon/lime
		
		ingredients = _.uniq(ingredients);
		
		let ingredientList = _.map(permutations(ingredients, 2), (x) => x.join(' and ')).concat(_.map(permutations(ingredients, 3), (x) => `${x[0]}, ${x[1]}, and ${x[2]}`));
		
		localSrc.ingredient = ingredients;
		localSrc['ingredient-list'] = ingredientList;
		
		if(rums.length > 2) {
			localSrc['tiki-adjective'].concat([
				'Lethal',
				'Powerful',
				'Spiritous',
				'Potent',
				'Bracing'
			])
		}
		
		grammar = tracery.createGrammar(localSrc);
		grammar.addModifiers(drinkDescriptionModifiers);
		if(useCache) {
			grammarCache = grammarCache.set(cacheKey, [grammar, ingredients]);
		}
	}
	
	// Generate tracery:
	let output = grammar.flatten('#origin#');
	
	// Check to make sure there are no repeated ingredients:
	let duplicateIngredients = _.chain(ingredients).map((ingredient) => (output.match(new RegExp(ingredient, 'g')) || []).length > 1 ? ingredient : false).compact().value()
	if(duplicateIngredients.length > 0) {
		let uniq_outputIngredients = _.chain(ingredients).map((ingredient) => _.times((output.match(new RegExp(ingredient, 'g')) || []).length, () => ingredient)).flatten().value()
		let sourceToReplaceFrom = _.difference(ingredients, uniq_outputIngredients);
		if(sourceToReplaceFrom.length > 0) {
			_.each(duplicateIngredients, (x) => {
				output = output.replace(x,_.sample(sourceToReplaceFrom))
			});
		} else {
			output = grammar.flatten('As #tiki-adjective# as #tiki-comparator#'); // If there aren't enough ingredients, fire a different rule
		}
	}
	
	return output;
}

export const saveCache = (fileName=undefined) => {
	const src = JSON.stringify(grammarCache.toJS());
	return src;
}

export const loadCache = (json) => {
	grammarCache = Map(json);
}