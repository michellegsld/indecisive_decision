const resultTemplate = '<div class="result_box"><div class="restaurant_name"><button class="favorite"></button><h2></h2><div class="restaurant_rating"></div></div><div class="restaurant_img"></div><div class="restaurant_info"><div class="restaurant_location"></div><div class="restaurant_phone"></div><div class="restaurant_categories"></div></div><div class="restaurant_footer"><div class="restaurant_price"></div><div class="yelp_logo"></div></div></div>'
let price = "1,2,3,4";
let rating = "1";

$(document).ready(() => {
  // Set price variable if pricing was specified
  $('select#price').change( function () {
    if ($(this).find('option:selected').attr("value") > 0) {
      price = $(this).find('option:selected').attr("value");
    }
  });

  // Set rating variable if rating was specified
  $('select#rating').change( function () {
    if ($(this).find('option:selected').attr("value") > 0) {
      rating = $(this).find('option:selected').attr("value");
    }
  });

  //If the user has clicked "Roll" or "Feeling Lucky?", start search
  $('button#region_search').click( (obj) => {
    document.getElementsByClassName('second_container')[0].style.display = 'none'; // Hide second container until know what to display
    document.getElementById('popup1').style.display = 'none'; // Make sure error message is hidden
    document.getElementById('popup2').style.display = 'none'; // Make sure error message is hidden
    $('SECTION.restaurant_result').empty(); // Empty section in order to provide new results on button click
    let total = 1; // Minimal amount of results to display

    let location = $('INPUT.location_input').val().replace(" ", "_")

    $.ajax({
      url: '/api_query/' + location + '/' + rating + '/' + price + '/',
      type: 'GET',
      dataType: 'json',
      success: function (data) {
        if ("error" in data) {    // Error to appear on incorrect location input
          document.getElementById('popup1').style.display = 'flex';
        } else if (data["total"] > 0) {
          if (obj['currentTarget']['name'] === "roll") {      // Check if button selected was "Roll"
            $('button[name$="roll"]').text('Re-roll');
            total = $('#total_roll input:checked').attr('id');  // in order to set total to amount selected
          }
          let result = $(data["businesses"]);  // Set result to all buinesses returned
          if (data["total"] >= total) {   // Make sure query result amount is >= to total
            result = $(result).slice(0, total); } // before slicing result up to total amount

          for (place of result) {  // Then for each buisness left
            populateSearchResult(place); // populate and display them
          }
          document.getElementsByClassName('second_container')[0].style.display = 'flex'; // Display second_container on results filled
         } else {  // Error on the fact that no buisnesses were returned from query
          document.getElementById('popup2').style.display = 'flex';
         }
      }
    });

    function populateSearchResult (place) {
      //$('#restaurant_result').append()
      //$('<article>hi</article>').appendTo($('div #restaurant_result'));
      console.log(place);
      const newArt = $('<article class="result_container"></article>').appendTo($('SECTION.restaurant_result'));
      newArt.attr('id', place['id']);
      newArt.append(resultTemplate);
      let id = '#' + place['id'];

      $(id + ' DIV.restaurant_name H2').text(place["name"]);    // Restaurant Name

      // Star rating image
      starImage = '/static/img/yelp_stars/web_and_ios/small/' + ratingImage(place['rating']);
      $(id + ' DIV.restaurant_rating').append('<img src="' + starImage + '" alt="Yelp Star Rating">');

      //Restaurant Image
      $(id + ' DIV.restaurant_img').append('<img src="' + place['image_url'] + '" alt="Restaurant Image">');

      //const location = data.businesses[0].location
      //const address = [location.address1, location.address2, location.address3, location.city, location.state, location.zip_code].join(" ");
      //console.log(address);

    }

    // Just returns which rating image to use
    function ratingImage(rating) {
     const starDict = {0: 'small_0@2x.png', 1: 'small_1@2x.png',
                       1.5: 'small_1_half@2x.png', 2: 'small_2@2x.png',
                       2.5: 'small_2_half@2x.png', 3: 'small_3@2x.png',
                       3.5: 'small_3_half@2x.png', 4: 'small_4@2x.png',
                       4.5: 'small_4_half@2x.png', 5: 'small_5@2x.png'};
      return (starDict[rating]);
    }
  });  

  $('.restaurant_result').on('click', 'button.favorite', function () {
    let id = $(this).parent().parent().parent().attr('id')
    $(this).addClass('favorited').removeClass('favorite')
    let message;
    $.ajax({
      async: false,
      url: '/save_favorite/' + id + '/',
      type: 'GET',
      datatype: 'json',
      success: function (data) {
          if ('error' in data) {
            message = 0
            alert("Please login before adding favorites")
          } else { 
            message = 1
            alert("Favorite Added")
            
          }
        }
      });
    console.log(message)
    if (message === 0) {$(this).addClass('favorite').removeClass('favorited')};
      }); 

    $('.restaurant_result').on('click', 'button.favorited', function () {
      let id = $(this).parent().parent().parent().attr('id')
      $(this).addClass('favorite').removeClass('favorited')
      $.ajax({
        url: '/delete_favorite/' + id + '/',
        type: 'GET',
        datatype: 'json',
        success: function (data) {
          if ('error' in data) {
            alert("Please login before removing")
          } else {
            alert("Favorite Removed")
          }
        }
      });
  });
});
