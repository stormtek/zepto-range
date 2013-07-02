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
<input type="range" min="0" max="4">
<input type="range" class="inside" min="-5" max="5" value="0">
<input type="range" min="0" max="2" width="300">
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
- fillColor="desired_colour"
 - The color that you want the fill bar to be
 - If nothing is specified then this defaults to the predefined color
 - This takes a css color property (either a hex value or an acceptable color name)

**Note:** If a width is not specified then the width of an ancestor object will be grabbed. If no ancestor has it's width specified then this will end up being the width of the page. To guarantee that width and layout work correctly it is recommended to specify a width for the input field. One thing to note is that if the width you specify for the slider is greater than the width of a wrapping container then the slider is likely to have issues displaying correctly - the options will probably wrap in strange ways.

**Tip:** If you use a large number of values (e.g. min="0", max="200") and hide the labels (using showEmptyLabels="false") then it is possible to simulate a smooth continuous slider.

**Note:** The combination of width of the slider and number of options that the slider has is used to calculate the width that each label should be. The slider does it's best to make sure that the labels are evenly spaced between min and max, but this gets difficult with high numbers of values - particularly with a smaller width. This is because we are needing to handle the case where the width of an individual label is less than 1 pixel. If the labels are not quite lining up, try fiddling with the width of the slider and the min / max values to alleviate the problem. The layout should work well in most scenarios, but there are unfortunately no guarantees for extreme cases (100's of options with a width of only a few hundred pixels is likely to look a little weird).

----------------------------------------------------------
### Gaining access the the input field

``` javascript
$('#wrapper_id input[type="range"]')
$('#input_field_id')
$('input[type="range"]')
```

- The parameter to $() is a DOM selector for the input field
- The first example will return all input fields inside the field with #wrapper_id
- The second example will return the field with the specified id (it is up to you to make sure that this is actually an input field, not something like a div)
- The final example will return all input fields on the page (useful if you want to construct all sliders at once with default labels)

**Tip:** The safest option is to wrap each input field in a div which has an id set on it. That way you can use the first example selector and know that you are interacting with a slider.

----------------------------------------------------------
### Javascript call to construct slider

This needs to be added inside script tags at the end of the html. This guarantees that all the html is added to the DOM correctly before we start modifying it.

``` javascript
$('dom_selector').range();
$('dom_selector').range('worst', 'best');
$('dom_selector').range(['1', '2', '3']);
```

- The function range() can take 3 types of parameter (as shown above):
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
### Javascript calls to interact with value

``` javascript
$('dom_selector').setValue(3);
```

- Make sure that the value passed in is an integer that is between min and max
 - min <= x <= max

``` javascript
$('#wrapper_id input[type="range"]').getValue();
```

- This returns the current value that the slider has set

----------------------------------------------------------
### Javascript calls to modify fill colour

``` javascript
$('dom_selector').setFillColor('#332299');
$('dom_selector').setFillColor('blue');
```

- This needs to be passed a valid css color
 - It can be either a hex value or a predefined color

``` javascript
$('dom_selector').resetFillColor();
```

- This will reset the fill colour to the default value specified in the css

----------------------------------------------------------
### Javascript call to adjust width of slider

``` javascript
$('dom_selector').setWidth(300);
```

- This function expects an integer value for the width you want

----------------------------------------------------------
### Events

* `init`
* `move`
* `change`

- You can set up a listener for any of these events using the javascript below

``` javascript
$('dom_selector').on('change', function(event, current, range) {
//handle event here
});
```

- event is the name of the event that trigged the handler
- current is the current value the slider has set
- range is the slider itself
