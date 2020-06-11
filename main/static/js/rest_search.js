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
      headers: {"Access-Control-Allow-Origin": "*"},
      url: 'http://127.0.0.1:8000/api_query/' + location + '/' + rating + '/' + price + '/',
      type: 'GET',
      crossDomain: true,
      dataType: 'json',
      success: function (data) {
        console.log(data)
        const location = data.businesses[0].location
        const address = [location.address1, location.city, location.state, location.zip_code].join(" ");
        console.log(location);
        console.log(data.businesses[0].name)
        //$('DIV#test').html("<h1>" + data.businesses[0].name + "</h1> <img src='" + data.businesses[0].image_url + "' width='500px' height='600px'>" +
        //"<h2>" + address + "</h2> <h3>" + data.businesses[0].rating + "</h3>")
      }
    });
  });
});
