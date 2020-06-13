const resultTemplate = '<div class="result_box"><div class="restaurant_name"><h2></h2><div class="restaurant_rating">**</div></div><div class="restaurant_img"></div><div class="restaurant_info"><div class="restaurant_location"> address</div><div class="restaurant_phone"> number</div><div class="restaurant_categories"> categories</div></div><div class="restaurant_footer"><div class="restaurant_price"></div><div class="yelp_logo"></div></div></div>'
let price = "1,2,3,4"
let rating = "1"

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
    document.getElementById('popup1').style.display = 'none'; // Make sure error message is hidden
    document.getElementById('popup2').style.display = 'none'; // Make sure error message is hidden
    $('SECTION.restaurant_result').empty(); // Empty section in order to provide new results on button click
    let total = 1; // Minimal amount of results to display

    let location = $('INPUT.location_input').val().replace(" ", "_")

    $.ajax({
      url: 'http://indecisivedecision.net/api_query/' + location + '/' + rating + '/' + price + '/',
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

      $(id + ' DIV.restaurant_name H2').text(place["name"]);

      //const location = data.businesses[0].location
      //const address = [location.address1, location.address2, location.address3, location.city, location.state, location.zip_code].join(" ");
      //console.log(address);

      //$(id + ' H2').text(item);
      //const newArt = $('<article></article>').appendTo($('.restaurant_result'));
      //newArt.attr('id', item['id']);
      //newArt.append(item['name']);
    }
  });
});
