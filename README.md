# Zepto Range

Input range slider to work with touch using Zepto

----------------------------------------------------------
### File imports to add to header of html

``` html
<link rel="stylesheet" href="zepto-range.css"/>
<script src="zepto.js"></script>
<script src="zepto-range.js"></script>
```

----------------------------------------------------------
### Input fields that the slider is built around

``` html
<input type="range" min="0" max="4" value="0">
<input type="range" class="inside" min="-5" max="5" value="0">
<input type="range" min="0" max="2" value="0" width="300"
```

#### Required Parameters

- type="range"
- min="some_integer"
- max="some_integer_greater_than_min"
- value="some_integer_between_max_and_min"

The number of integers between min and max determine the number of options that the slider has. Value is the starting value that the slider has.

#### Optional Parameters

- width="some_integer"
 - The width that you want the slider to be
- class="inside"
 - This determines whether the outside option lines sit inside the slider or even with the visible ends of the slider

If a width is not specified then the width of an ancestor object will be grabbed. If no ancestor has it's width specified then this will end up being the width of the page. To guarantee that width and layout work correctly it is recommended to specify a width for the input field. One thing to note is that if the width you specify is less than the width of a wrapping container then the slider is likely to have issues displaying correctly - the options will probably wrap funny.

----------------------------------------------------------
### Javascript call to construct slider

This needs to be added inside script tags at the end of the html.

``` javascript
$('#wrapper_id input[type="range"]').range();
$('input[type="range"]').range('worst', 'best');
$('input[type="range"]').range(['1', '2', '3']);
```

- The parameter to $() is a DOM selector for the input field

The function call range() can take 3 types of parameter, as shown above
- No parameter will show simply lines for each option available
- Parameters can be passed as a list of strings or an array of strings
- If there is less than a one-to-one mapping of parameters to options then gaps will be added intelligently
 - 2 parameters will map to the first and last option
 - 3 parameters will map to the first, middle, and last option
 - If equal sized gaps cannot be made then it will default back to simply showing lines
 - Things work best for gaps if there are an odd number of options

----------------------------------------------------------

## Modes

(see the attached example to see the difference between these)

* `normal`
* `inside`

## Events

* `init`
* `move`
* `change`
