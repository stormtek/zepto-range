# Zepto Range

Input range implementation to work with touch using Zepto

- add to header

``` html
<link rel="stylesheet" href="zepto-range.css"/>
<script src="zepto.js"></script>
<script src="zepto-range.js"></script>
```

- input fields to add into html

``` html
<input type="range" min="0" max="4" value="0">
<input type="range" class="inside" min="-5" max="5" value="0">
```

- called after input fields are added to html

``` javascript
$('input[type="range"]').range();
$('input[type="range"]').range('worst', 'best');
```

## Modes

(see the attached example to see the difference between these)

* `normal`
* `inside`

## Events

* `init`
* `move`
* `change`
