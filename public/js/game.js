(async function ($) {
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
        var userId = res.addedreview.userId;
        const li = `<li class="review">
        <h4>By <a href="/profile/${userId}">${username}</a></h4>
        <p class="rating">Rating: ${addedrating}</p>
        <p class="text">${addedreviewtext}</p>
        </li>`;
        addedReviewElem.append(li);
        addedReviewElem.show();
        noreviews.hide();
        reviewbut[0].reset();
      });
  });
  };

    let commentbut = $("#commentform");
    let commentInput = $("#comment_input");
    let addedCommentElem = $("#addedcomments");
    let nocomments = $("#nocomments");
    let commenterror = $("#commenterror");
  commentbut.submit(async function (event) {
    event.preventDefault();
    comment = commentInput.val();
    comment = comment.trim();

    if (!comment) {
      commenterror.html("Comment Input is missing");
      commenterror.show();
      return;
    } else if( typeof comment !== "string") {
      commenterror.html("Comment should be a string");
      commenterror.show();
      return;
    }
    else {
      commenterror.hide();
    }
    
    var requestConfig = {
      method: "POST",
      url: window.location.pathname,
      contentType: "application/json",
      data: JSON.stringify({
        comment:comment
      }),
    };
    $.ajax(requestConfig).then(function (res) {
      //Checking is reponse has an error
        var addedcomment = res.addedcomment.commentText;
        var username = res.user;
        var userId = res.addedcomment.userId;
        const li = `<li class="comment">
        <h4>By <a href="/profile/${userId}">${username}</a></h4>
        <p class="text">${addedcomment}</p>
        </li>`;
        addedCommentElem.append(li);
        addedCommentElem.show();
        nocomments.hide();
        commentbut[0].reset();
      });
  });

  
})(window.jQuery);
