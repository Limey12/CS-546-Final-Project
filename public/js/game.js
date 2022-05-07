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
  reviewbut.submit(async function (event) {
    event.preventDefault();
    rating = ratinginput.val();
    rating = rating.trim();
    review = reviewinput.val();
    review = review.trim();

    
   //ToDo error checking
    // if (!title && !description) {
    //   error.html("Title Input and Description Input is missing");
    //   error.show();
    // } else if (!description) {
    //   error.html("Description Input is missing");
    //   error.show();
    // } else if (!title) {
    //   error.html("Title Input is missing");
    //   error.show();
    // } else if (typeof description !== "string" || typeof title !== "string") {
    //   error.html("Inputs should be strings");
    //   error.show();
    // } else {
    //   error.hide();
    // }
    
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
      // if (res.error) {
      //   error.html(res.error);
      //   error.show();
      // } else {
        console.log(res.addedreview)
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
        reviewbut[0].reset();
      });
  });
  };
  

  
})(window.jQuery);
