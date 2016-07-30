import fs from 'fs';
import path from 'path';
import webpack from 'webpack';

const pathRoot = path.dirname(process.argv[1]);

const nodeCompiler = webpack(require(path.resolve(pathRoot, '../webpack.node.js')));
const browserCompiler = webpack(require(path.resolve(pathRoot, '../webpack.browser.js')));

nodeCompiler.run((err,stats) => {
	fs.unlink(path.resolve(pathRoot, '../distribution/index.js.map'));
});
browserCompiler.run((err,stats) => {
	fs.writeFileSync(path.resolve(pathRoot, '../browser/drink-description.min.js'), fs.readFileSync(path.resolve(pathRoot, '../browser/drink-description.min.js')).toString().replace(/(drinkDescription=.*?\(\))/g,"$1.default"));

});