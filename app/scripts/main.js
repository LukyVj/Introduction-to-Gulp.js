// Create a dummy function to fill the main.js file

$(document).ready(function(){

  var words = [
  'Wolrd',
   'Developers',
   'Ponies',
   'Designers',
   'Gitches',
   'Goodbye',
   '...',
   'Guys',
   'Dude',
   'Wizard',
   'Lurkers',
   'C\'est B20',
   'ooooooo',
   'Gulp.jso'
   ];
  var x = words.length;
  var random = Math.floor(Math.random() * x);

  $('span.word').empty().append(words[random])

}());