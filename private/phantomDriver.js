var page = require('webpage').create();
console.log('Driver Loaded')
page.open('http://localhost:3000', function(){
  window.setTimeout(function(){
  console.log('Page Loaded');
  page.render('../../../../../mp3000.png');
  phantom.exit();
  },200);
});
