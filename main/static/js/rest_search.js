const resultTemplate = '<div class="restaurant_name"><h2></h2><div class="restaurant_rating">**</div></div><div class="restaurant_img"></div><div class="restaurant_info"><div class="restaurant_location"> address</div><div class="restaurant_phone"> number</div><div class="restaurant_categories"> categories</div></div><div class="restaurant_footer"><div class="restaurant_price"></div><div class="yelp_logo"></div></div>'
let price = "1,2,3,4"
let rating = "1"

$(document).ready(() => {
  $('select#price').change( function () {
    if ($(this).find('option:selected').attr("value") > 0) {
      price = $(this).find('option:selected').attr("value");
    }
  });

  $('select#rating').change( function () {
    if ($(this).find('option:selected').attr("value") > 0) {
      rating = $(this).find('option:selected').attr("value");
    }
  });

  $('button#region_search').click( (obj) => {
    document.getElementById('popup1').style.display = 'none';
    document.getElementById('popup2').style.display = 'none';
    $('.restaurant_result').html('');
    let total = 1;

    let buttonName = obj['currentTarget']['name'];
    let location = $('INPUT.location_input').val().replace(" ", "_")

    $.ajax({
      url: 'http://indecisivedecision-env.eba-xrwsyuw3.us-west-2.elasticbeanstalk.com/api_query/' + location + '/' + rating + '/' + price + '/',
      type: 'GET',
      dataType: 'json',
      success: function (data) {
        //const location = data.businesses[0].location
        //const address = [location.address1, location.city, location.state, location.zip_code].join(" ");
        //console.log(location);
        //console.log(data.businesses[0].name);
        if ("error" in data) {
          document.getElementById('popup1').style.display = 'flex';
        } else if (data["total"] > 0) {

          if (buttonName === "roll") { total = $('#total_roll input:checked').attr('id'); }
          let result = data["buisnesses"];
          if (data["total"] >= total) { result = $(result).slice(0, total); }

          for (item of result) {
            populateSearchResult(item);
          }
         } else {
          document.getElementById('popup2').style.display = 'flex';
         }
      }
    });

    function populateSearchResult (item) {
      //$('#restaurant_result').append()
      //$('<article>hi</article>').appendTo($('div #restaurant_result'));
      const newArt = $('<article></article>').appendTo($('.restaurant_result'));
      newArt.attr('id', item['id']);
      newArt.append(item['name']);
      id = '#' + id;

      //$(id + ' H2').text(item);
      //const newArt = $('<article></article>').appendTo($('.restaurant_result'));
      //newArt.attr('id', item['id']);
      //newArt.append(item['name']);
    }
  });
});
