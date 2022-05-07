(function ($) {
  window.onload = function () {
    var fav = $("#fav_btn");
    var lfav = $("#least_fav_btn");
    

    //todo for both functions add to list using ajax.
    //clear fields.
    //do more client side error checking
    fav.submit(function (e) {
      e.preventDefault();
      $.ajax({
        method: "POST",
        url: window.location.pathname + "/fav",
      });
    });

    lfav.submit(function (e) {
      e.preventDefault();
      $.ajax({
        method: "POST",
        url: window.location.pathname + "/lfav",
      });
    });


    let reviewbut = $("#reviewform");
    let ratinginput = $("#rating_input");
    let reviewinput = $("#review_input");
    let addedReviewElem = $("#addedreviews");
    let noreviews = $("#noreviews");
    let reviewerror = $("#reviewerror");
  reviewbut.submit(async function (event) {
    event.preventDefault();
    rating = ratinginput.val();
    rating = rating.trim();
    review = reviewinput.val();
    review = review.trim();

    if (!rating && !review) {
      reviewerror.html("Rating and Review Inputs is missing");
      reviewerror.show();
      return;
    }
    else if (!rating) {
      reviewerror.html("Rating Input is missing");
      reviewerror.show();
      return;
    } else if(!review){
      reviewerror.html("Review Input is missing");
      reviewerror.show();
      return;
    } else if( typeof review !== "string") {
      reviewerror.html("Review should be a string");
      reviewerror.show();
      return;
    }
    else {
      reviewerror.hide();
    }
    
    var requestConfig = {
      method: "POST",
      url: window.location.pathname,
      contentType: "application/json",
      data: JSON.stringify({
        rating:rating,
        review:review
      }),
    };
    $.ajax(requestConfig).then(function (res) {
      //Checking is reponse has an error
        var addedrating = res.addedreview.rating;
        var addedreviewtext = res.addedreview.reviewText;
        var username = res.user;
        const li = `<li>
        <h4>By ${username}</h4>
        <p>Rating: ${addedrating}</p>
        <p>${addedreviewtext}</p>
        </li>`;
        addedReviewElem.append(li);
        addedReviewElem.show();
        noreviews.hide();
        reviewbut[0].reset();
      });
  });
  };
  

  
})(window.jQuery);
