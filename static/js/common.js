window.onload = () => {
  // Create random message in header
  var randomArray = [
    "Time to decide!",
    "What will it be today?",
    "Put an end to that indecision!",
    "OwO",
    "No more waiting around!",
    "Decision time!",
    "Indecisive Decision",
    "What would you like?"
  ]

  $('.header_left_text').text(randomArray[Math.floor(Math.random()*randomArray.length)]);

  // To shorten code, refers to modal
  var modal = document.getElementById('modal');

  //Display modal when "Log In/Sign Up" is clicked on
  $('.login_signup_text').click(function () { modal.style.display = 'flex'; });

  //Hide modal when the 'x' is clicked on the modal
  $('span').click(function () { modal.style.display = 'none'; });

  //Hide modal when clicked on window outside of it
  window.onclick = function (event) {
    if (event.target === modal) { modal.style.display = 'none'; }
  };
};
