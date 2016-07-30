# drink-description

This library uses [tracery](https://github.com/v21/tracery/) to generate descriptions of tropical (tiki) cocktails from lists of ingredients. The description grammar was sourced from menus at [Smuggler's Cove](http://www.smugglerscovesf.com/), [Latitude 29](http://www.latitude29nola.com/), [Trader Vic's](http://tradervicsatl.com/), and the [UNLV Libraries' Menus Collection](http://digital.library.unlv.edu/objects/menus) (which contains several historic Don the Beachcomber Menus).

## Usage

Node / CommonJS Loader:

~~~ javascript
var drinkDescription = require('drink-description').default;

console.log(drinkDescription(['Lime','Jamaican Rum', 'Demerara Syrup', 'Angostura Bitters'])); // Produce a drink description for this basic Planter's Punch
~~~

Browser:

Include `browser/drink-description.min.js` to add `drinkDescription()` to your project.