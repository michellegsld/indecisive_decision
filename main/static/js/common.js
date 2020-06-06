window.onload = () => {
  // Create random message in header
  $('.header_left_text').text('*Random Message*');

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
