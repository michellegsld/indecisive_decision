// Code checked with `semistandard common.js --global $`
// Errors left: 'alert' is not defined.
const resultTemplate = '<div class="result_box"><div class="restaurant_header"><button class="favorite"></button><span class="close">&times;</span></div><div class="restaurant_name"><h2></h2><div class="restaurant_rating"></div></div><div class="restaurant_img"></div><div class="restaurant_info"><div class="restaurant_address"></div><div class="restaurant_phone"></div><div class="restaurant_categories"></div></div><div class="restaurant_footer"><div class="restaurant_price"></div><div class="yelp_logo"></div></div></div>';
let price = '1,2,3,4';
let rating = '1';
let resultIds = [];

$(document).ready(() => {
  // Set price variable if pricing was specified
  $('select#price').change(function () {
    if ($(this).find('option:selected').attr('value') > 0) {
      price = $(this).find('option:selected').attr('value');
    } else {
      price = '1,2,3,4';
    }
  });

  // Set rating variable if rating was specified
  $('select#rating').change(function () {
    if ($(this).find('option:selected').attr('value') > 0) {
      rating = $(this).find('option:selected').attr('value');
    } else {
      rating = '1';
    }
  });

  // If the user has clicked "Roll" or "Feeling Lucky?", start search
  $('button#region_search').click((obj) => {
    document.getElementsByClassName('second_container')[0].style.display = 'none'; // Hide second container until know what to display
    document.getElementById('popup1').style.display = 'none'; // Make sure error message is hidden
    document.getElementById('popup2').style.display = 'none'; // Make sure error message is hidden
    $('SECTION.restaurant_result').empty(); // Empty section in order to provide new results on button
    resultIds = []; // Empty id list
    let total = 1; // Minimal amount of results to display

    const location = $('INPUT.location_input').val().replace(' ', '_');

    $.ajax({
      url: 'http://indecisivedecision.net/api_query/' + location + '/' + rating + '/' + price + '/',
      type: 'GET',
      dataType: 'json',
      success: function (data) {
        if ('error' in data) { // Error to appear on incorrect location input
          document.getElementById('popup1').style.display = 'flex';
        } else if (data.total > 0) {
          if (obj.currentTarget.name === 'roll') { // Check if button selected was "Roll"
            $('button[name$="roll"]').text('Re-roll');
            total = $('#total_roll input:checked').attr('id'); // in order to set total to amount selected
            document.getElementsByClassName('narrow_button')[0].style.display = 'flex'; // display narrow button if "roll" clicked on
          } else {
            $('button[name$="lucky"]').text('Try your luck again?');
            document.getElementsByClassName('narrow_button')[0].style.display = 'none'; // hide narrow button if "lucky" clicked
          }
          let result = $(data.businesses); // Set result to all buinesses returned
          if (data.total >= total) { // Make sure query result amount is >= to total
            result = $(result).slice(0, total);
          } // before slicing result up to total amount

          let place = '';
          for (place of result) { // Then for each buisness left
            populateSearchResult(place); // populate and display them
          }
          document.getElementsByClassName('second_container')[0].style.display = 'flex'; // Display second_container on results
          $('html, body').animate({ scrollTop: '510px' }, 1000); // Auto scroll down to results once displayed
        } else { // Error on the fact that no buisnesses were returned from query
          document.getElementById('popup2').style.display = 'flex';
        }
      }
    });

    function populateSearchResult (place) {
      console.log(place);
      const newArt = $('<article class="result_container"></article>').appendTo($('SECTION.restaurant_result'));
      newArt.attr('id', place.id);
      resultIds.push(place.id);
      newArt.append(resultTemplate);
      const id = '#' + place.id;

      $(id + ' span').attr('id', place.id); // Add id to close button
      // Restaurant Name
      $(id + ' DIV.restaurant_name H2').text(place.name);

      // Star rating image
      const starImage = '/static/img/yelp_stars/web_and_ios/extra_large/' + ratingImage(place.rating);
      $(id + ' DIV.restaurant_rating').append('<img src="' + starImage + '" alt="Yelp Star Rating" title="Based on ' + place.review_count + ' review(s)">');

      // Restaurant Image
      $(id + ' DIV.restaurant_img').append('<img src="' + place.image_url + '" alt="(No image available)">');

      // Restaurant Address
      let address = '';

      for (let i = 0; i < place.location.display_address.length; i++) {
        if (i > 0) {
          address = address + ', ';
        }
        address = address + place.location.display_address[i];
      }

      $(id + ' DIV.restaurant_address').append('<text>' + address + '</text>');

      // Restaurant Phone Number
      $(id + ' DIV.restaurant_phone').append('<a href="tel:' + place.phone + '">' + place.display_phone + '</a>');

      // Restaurant Categories
      let category = '';
      for (let i = 0; i < place.categories.length; i++) {
        if (i > 0) {
          category = category + '<br>';
        }
        category = category + place.categories[i].title;
      }
      $(id + ' DIV.restaurant_categories').append('<details><summary>Categories</summary>' + category + '</details>');

      // Price Image
      if (price === '1,2,3,4') {
        $(id + ' DIV.restaurant_price').append('<h1>' + place.price + '</h1>');
        $('.restaurant_footer').css({ 'justify-content': 'space-evenly' });
      }

      // Yelp Logo
      $(id + ' DIV.yelp_logo').append('<a href="' + place.url + '" target="_blank"><img src="/static/img/yelp_logo.svg" alt="View on Yelp!"></a>');
    }

    // Just returns which rating image to use
    function ratingImage (rating) {
      const starDict = {
        0: 'extra_large_0@3x.png',
        1: 'extra_large_1@3x.png',
        1.5: 'extra_large_1_half@3x.png',
        2: 'extra_large_2@3x.png',
        2.5: 'extra_large_2_half@3x.png',
        3: 'extra_large_3@3x.png',
        3.5: 'extra_large_3_half@3x.png',
        4: 'extra_large_4@3x.png',
        4.5: 'extra_large_4_half@3x.png',
        5: 'extra_large_5@3x.png'
      };
      return (starDict[rating]);
    }
  });

  // Randomly remove a result on "narrow" click
  $('.second_container').on('click', 'button.narrow_button', function () {
    const rmId = resultIds[Math.floor(Math.random() * resultIds.length)];
    const index = resultIds.indexOf(rmId);
    resultIds.splice(index, 1);
    $('.restaurant_result article').remove('#' + rmId);
    // Hide narrow button if less than two options
    if ($('.restaurant_result article').length < 2) {
      document.getElementsByClassName('narrow_button')[0].style.display = 'none';
    }
  });

  // Remove result on click
  $('.restaurant_result').on('click', 'span.close', function () {
    const rmId = $(this).attr('id');
    const index = resultIds.indexOf(rmId);
    resultIds.splice(index, 1);
    $('article').remove('#' + rmId);
    // Hide narrow button if less than two options
    if ($('.restaurant_result article').length < 2) {
      document.getElementsByClassName('narrow_button')[0].style.display = 'none';
    }
  });

  // Favorite result on click
  $('.restaurant_result').on('click', 'button.favorite', function () {
    const id = $(this).parent().parent().parent().attr('id');
    $(this).addClass('favorited').removeClass('favorite');
    let message;
    $.ajax({
      async: false,
      url: '/save_favorite/' + id + '/',
      type: 'GET',
      datatype: 'json',
      success: function (data) {
        if ('error' in data) {
          message = 0;
          alert('Please login before adding favorites');
        } else {
          message = 1;
          alert('Favorite Added');
        }
      }
    });
    console.log(message);
    if (message === 0) { $(this).addClass('favorite').removeClass('favorited'); }
  });

  // Remove favorited result on click
  $('.restaurant_result').on('click', 'button.favorited', function () {
    const id = $(this).parent().parent().parent().attr('id');
    $(this).addClass('favorite').removeClass('favorited');
    $.ajax({
      url: '/delete_favorite/' + id + '/',
      type: 'GET',
      datatype: 'json',
      success: function (data) {
        if ('error' in data) {
          alert('Please login before removing');
        } else {
          alert('Favorite Removed');
        }
      }
    });
  });
});
