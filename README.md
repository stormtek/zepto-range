# Zepto Range

http://jcemer.com/zepto-range

Input range implementation to work with touch using Zepto

``` html header
<link rel="stylesheet" href="zepto-range.css"/>
<script src="zepto.js"></script>
<script src="zepto-range.js"></script>
```

``` html
<input type="range" min="0" max="4" value="0">
<input type="range" class="inside" min="-5" max="5" value="0">
```

``` javascript - called after input fields are added to html
$('input[type="range"]').range();
$('input[type="range"]').range('worst', 'best');
```

## Modes

* `normal`
* `inside`

## Events

* `init`
* `move`
* `change`