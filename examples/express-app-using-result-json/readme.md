# express-app-using-result-json

This example shows how to use `gulp-bundle-assets` in a very basic express app using hogan (hjs) as its view engine.

## Step 1: Build

First, we can pipe the result of `gulp bundle` to a custom destination like so:

```js
// gulpfile.js
var gulp = require('gulp'),
  bundle = require('gulp-bundle-assets');
  
gulp.task('bundle', function() {
  return gulp.src('./bundle.config.js')
    .pipe(bundle())
    .pipe(gulp.dest('./')); // dest of bundle.result.json
});
```

which gives us a `bundle.result.json` file that looks like this:

```json
{
  "main": {
    "styles": "<link rel='stylesheet' href='/main-bundle.css' />",
    "scripts": "<script type='text/javascript' src='/main-bundle.js'></script>"
  }
}
```

## Step 2: Consume

Next, we take the resulting `bundle.result.json` file, require it in our route and send it on to our view, e.g. 

```js
// routes/index.js
var express = require('express');
var router = express.Router();
var bundles = require('../bundle.result.json');

router.get('/', function(req, res) {
  res.render('index', { title: 'Express', bundle: bundles });
});

module.exports = router;

```

## Step 3: Write

Finally, in our view we can write out the bundles however we see fit, e.g.

```
<!DOCTYPE html>
<html>
  <head>
    <title>{{ title }}</title>
    
    <!-- put my main style bundle in the head -->
    {{{ bundle.main.styles }}}
    
  </head>
  <body>
    <h1>{{ title }}</h1>
    <p>Hello World</p>
    
    <!-- put my main script bundle at the end of the body -->
    {{{ bundle.main.scripts }}}
    
  </body>
</html>
```