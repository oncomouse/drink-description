import fs from 'fs';
import path from 'path';
import {transform} from 'babel-core';

const pathRoot = path.dirname(process.argv[1]);

let babelRC = {}
try {
	babelRC = JSON.parse(fs.readFileSync(path.resolve(pathRoot, '../.babelrc')));
} catch(e) {}

let indexSrc = fs.readFileSync(path.resolve(pathRoot, '../source/index.js')).toString();
const grammarSrc = fs.readFileSync(path.resolve(pathRoot, '../source/data/grammar.json')).toString();
const permutationSrc = fs.readFileSync(path.resolve(pathRoot, '../source/lib/permutations.js')).toString().replace('var _ = require(\'lodash\')','').replace('module.exports={combinations_with_replacement,combinations,product,permutations}','');

indexSrc = indexSrc.replace('import grammarSrc from \'./data/grammar.json\'', `const grammarSrc = ${grammarSrc}`);
indexSrc = indexSrc.replace('import { permutations } from \'./lib/permutations\';', permutationSrc);

const es5indexSrc = transform(indexSrc, babelRC).code;

fs.writeFileSync(path.resolve(pathRoot, '../distribution/index.js'), es5indexSrc);
fs.writeFileSync(path.resolve(pathRoot, '../distribution/es6.js'), indexSrc);