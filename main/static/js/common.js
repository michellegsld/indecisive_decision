// Code checked with `semistandard common.js --global $`
// Errors left: None.

window.onload = () => {
  // Create random message in header
  var randomArray = [
    'Time to decide!',
    'What will it be today?',
    'Put an end to that indecision!',
    'OwO',
    'No more waiting around!',
    'Decision time!',
    'Indecisive Decision',
    'What would you like?',
    "What do you mean it's the bread?",
    'We have the decisions',
    'Do you smell what the rock is cooking?',
    'Happy Birthday Ezra!',
    "It's a hard knock life",
    'Is this a web app?',
    "I can't believe it's not butter",
    "Maybe it's Maybelline",
    'Gotta catch them all',
    'Natural 20!',
    'How would you like to do this?',
    "X Gon' Give It To Ya",
    'Do you like waffles?',
    'Do you like pancakes?',
    'Do you like french toast?',
    'This one is for Julien',
    'Never gunna give you up',
    'Never gunna let you down',
    'We love you Nadine',
    'Minecraft',
    'Terraria',
    'Praise the Sun',
    'Gotta go fast',
    'We can do it!',
    'Ice Ice Baby',
    'Notice me',
    'Hello there',
    'General Kenobi',
    "You've been Gnomed",
    "What's to come",
    'Baja blast',
    'Is this a decision?',
    'Fox only, no items, final destination',
    'Hyah',
    'Hey Listen',
    'Get out of here Kay',
    'Real Facts',
    'Let me help you with that',
    'Stop you violated the law',
    'Hey, you are finally awake',
    'The checker is broken',
    'I have the high ground',
    'Cohort 10',
    'And his name is John Cena',
    'Roger Roger',
    'There are no mistakes',
    "We still don't make the decision",
    "Where is Caitlin's icebreaker?",
  ]

  // Check which html is being used to change text next to logo
  if (window.location.href === 'http://indecisivedecision.net/') {
    $('.header_left_text').append('<h3>Indecisive Decision</h3>');
  } else {
    $('.header_left_text').text(randomArray[Math.floor(Math.random() * randomArray.length)]);
  }

  // To shorten code, refers to modal
  var modal = document.getElementById('modal');

  // Display modal when "Log In/Sign Up" is clicked on
  $('.login_signup_text').click(function () { modal.style.display = 'flex'; });

  // Hide modal when the 'x' is clicked on the modal
  $('.modal_box span').click(function () { modal.style.display = 'none'; });

  // Hide modal when clicked on window outside of it
  window.onclick = function (event) {
    if (event.target === modal) { modal.style.display = 'none'; }
  };

  // Clear/reset search filter options in restaurant_search
  $('#price')[0].selectedIndex = 0;
  $('#rating')[0].selectedIndex = 0;
  $('#10').prop('checked', true);
  $('#location_input').val('');
  $('#roll').text('Roll');
};
