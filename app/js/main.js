$(document).ready(function() {

  // Shows and hides navbar by clicking menu button
  $('.fa').click(function() {
    $('.navbar').toggleClass('expand');
  });

  // Hides the navbar when a link is selected
  $('.navbar li a').click(function() {
    $('.navbar').removeClass('expand');
  });
});
