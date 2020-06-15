const resultTemplate = '<div class="result_box"><div class="restaurant_name"><h2></h2><div class="restaurant_rating"></div></div><div class="restaurant_img"></div><div class="restaurant_address"></div><div class="restaurant_phone"></div><div class="restaurant_categories"></div><div class="restaurant_footer"><div class="restaurant_price"></div><div class="yelp_logo"></div></div></div>'
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
          document.getElementsByClassName('second_container')[0].style.display = 'flex'; // Display second_container on results 
          $("html, body").animate({ scrollTop: "510px" }, 1000);    // Auto scroll down to results once displayed
         } else {  // Error on the fact that no buisnesses were returned from query
          document.getElementById('popup2').style.display = 'flex';
         }
      }
    });

    function populateSearchResult (place) {
      console.log(place);
      const newArt = $('<article class="result_container"></article>').appendTo($('SECTION.restaurant_result'));
      newArt.attr('id', place['id']);
      newArt.append(resultTemplate);
      let id = '#' + place['id'];

      $(id + ' DIV.restaurant_name H2').text(place["name"]);    // Restaurant Name

      // Star rating image
      starImage = '/static/img/yelp_stars/web_and_ios/small/' + ratingImage(place['rating']);
      $(id + ' DIV.restaurant_rating').append('<img src="' + starImage + '" alt="Yelp Star Rating">');

      // Restaurant Image
      $(id + ' DIV.restaurant_img').append('<img src="' + place['image_url'] + '" alt="(No image available)">');

      // Restaurant Address
      let address = "";

      for (i = 0; i < place['location']['display_address'].length; i++) {
        if (i > 0){
          address = address + ", ";
        }
        address = address + place['location']['display_address'][i];
      }

      $(id + ' DIV.restaurant_address').append('<text>' + address + '</text>');

      // Restaurant Phone Number
      $(id + ' DIV.restaurant_phone').append('<text href="tel:' + place['phone'] + '">' +place['display_phone'] + '</text>');

      // Restaurant Categories
      let category = "(";
      for (i = 0; i < place['categories'].length; i++) {
        if (i > 0){
          category = category + ", ";
        }
        category = category + place['categories'][i]['title'];
      }
      $(id + ' DIV.restaurant_categories').append('<text>' + category + ') </text>');
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
});
