# Zepto Range

Input range slider to work with touch using Zepto

http://stormtek.github.io/zepto-range/

----------------------------------------------------------
### File imports to add to header of html

``` html
<link rel="stylesheet" href="zepto-range.css"/>
<script src="zepto.js"></script>
<script src="zepto-range.js"></script>
```

**Tip:** For quicker load times use ```zepto.min.js``` rather than ```zepto.js``` as it is the minified version of the javascript for the main zepto library. Both files are included in this repository for your convenience. If you are building ```zepto.js``` and ```zepto.min.js``` from the source make sure to include the touch module if you are planning on supporting mobile / tablets.

**Note:** If performance (loading time) is a big issue then feel free to place the ```<script>``` tags for the javascript at the end of the body, rather than in the header. Just make sure that they are above the javascript that sets up the sliders.

----------------------------------------------------------
### Input fields that the slider is built around

``` html
<input type="range" min="0" max="4" value="0">
<input type="range" class="inside" min="-5" max="5" value="0">
<input type="range" min="0" max="2" value="0" width="300"
```

#### Required Parameters

- type="range"
 - Identifies this as a range slider
- min="some_integer"
 - The minimum value this slider has
- max="some_integer_greater_than_min"
 - The maximum value this slider has

**Note:** The number of integers between min and max determine the number of options that the slider has.

#### Optional Parameters

- value="some_integer_between_min_and_max"
 - The initial value that is set for the slider
 - This will default to min if it is not set
 - **Note:** This is not an index point but one of the values that lies between max and min
- width="some_integer"
 - The width that you want the slider to be
- class="inside" or class="normal"
 - This determines whether the outside option lines sit inside the slider or even with the visible ends of the slider
 - If nothing is specified then this defaults to class="normal"
- showEmptyLabels="true" or showEmptyLabels="false"
 - By setting this to false you can choose to show nothing for those empty labels, hiding them from the user
 - If nothing is specified then this defaults to showEmptyLabels="true"

**Note:** If a width is not specified then the width of an ancestor object will be grabbed. If no ancestor has it's width specified then this will end up being the width of the page. To guarantee that width and layout work correctly it is recommended to specify a width for the input field. One thing to note is that if the width you specify for the slider is greater than the width of a wrapping container then the slider is likely to have issues displaying correctly - the options will probably wrap in strange ways.

**Tip:** If you use a large number of values (e.g. min="0", max="200") and hide the labels (using showEmptyLabels="false") then it is possible to simulate a smooth continuous slider.

----------------------------------------------------------
### Javascript call to construct slider

This needs to be added inside script tags at the end of the html. This guarantees that all the html is added to the DOM correctly before we start modifying it.

``` javascript
$('#wrapper_id input[type="range"]').range();
$('input[type="range"]').range('worst', 'best');
$('input[type="range"]').range(['1', '2', '3']);
```

- The parameter to $() is a DOM selector for the input field
- The function call range() can take 3 types of parameter (as shown above):
 1. No parameters (the min and max values set on the input field will be shown)
 2. A list of strings to be shown as options
 3. An array of strings to be shown as options

- If there is less than a one-to-one mapping of parameters to options then gaps will be added intelligently
 - 1 parameter will cause things to break
 - 2 parameters will map to the first and last option
 - 3 parameters will map to the first, middle, and last option (provided there are an odd number of options ...)
 - If equal sized gaps cannot be made then it will default back to simply showing lines
 - Things work best for gaps if there are an odd number of options

----------------------------------------------------------
### Javascript call to change value

``` javascript
$('#wrapper_id input[type="range"]').setValue(3);
$('input[type="range"]').setValue(-1);
```

- The parameter to $() is a DOM selector for the input field
- Make sure that the value passed in is an integer that is between min and max
 - min <= x <= max

----------------------------------------------------------
### Events

* `init`
* `move`
* `change`
