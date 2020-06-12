let price = ""
let rating = ""

$(document).ready(() => {
  $('select#price').change( function () {
    price = $(this).find('option:selected').attr("value");
  });

  $('select#rating').change( function () {
    rating = $(this).find('option:selected').attr("value");
  });

  $('button#region_search').click( () => {
    if (price === "0") {
      price = "1,2,3,4";
    }

    let location = $('INPUT.location_input').val().replace(" ", "_")

    $.ajax({
      url: 'http://indecisivedecision-env.eba-xrwsyuw3.us-west-2.elasticbeanstalk.com/api_query/' + location + '/' + rating + '/' + price + '/',
      type: 'GET',
      dataType: 'json',
      success: function (data) {
        //console.log(data)
        //const location = data.businesses[0].location
        //const address = [location.address1, location.city, location.state, location.zip_code].join(" ");
        //console.log(location);
        //console.log(data.businesses[0].name);
        if (data["total"] > 0) {
          for (const item of data) {
            populateSearchResult(item);
          }
         } else {
          $('<article><h4><h4></article>').appendTo($('DIV.restaurant_result'));
          $('.restaurant_result h4').append("Sorry! There is nothing currently open/available with those parameters.");
         }
      }
    });
  });
});
