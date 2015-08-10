(function() {
  "use strict";
  // Init global DOM elements, functions and arrays

  window.app = {
    el: {},
    fn: {}
  };
  
  app.fn.responseRateCalc = function(){
    var responseRate = parseInt($('#response-rate-range').val());
    $('#response-range-val').text(responseRate);
    
    var engagementRate = parseInt($('#engagement-range').val());
    $('#engagement-val').text(engagementRate);
    
    var screeningRate = parseInt($('#pass-screening-range').val());
    $('#pass-screening-val').text(screeningRate);
    
    var offerRate = parseInt($('#offer-extended-range').val());
    $('#offer-extended-val').text(offerRate);
    
    var acceptanceRate = parseInt($('#offer-acceptance-range').val());
    $('#offer-acceptance-val').text(acceptanceRate);
    
    var hired = parseInt($('#hired-candidate-val').text());
    console.log(responseRate,engagementRate,screeningRate,offerRate,acceptanceRate,hired);

    var candidatesWithOffer = Math.ceil((hired*100)/acceptanceRate);    
    $('#offered-val').text(candidatesWithOffer);

    var candidatesWithInterview = Math.ceil((candidatesWithOffer * 100)/offerRate);
    $('#interview-val').text(candidatesWithInterview);

    var engagedPipeline = Math.ceil((candidatesWithInterview * 100)/screeningRate);
    $('#engaged-pipeline-val').text(engagedPipeline);

    var pipeline = Math.ceil((engagedPipeline * 100)/engagementRate);
    $('#pipeline-val').text(pipeline);

    var sourcedCandidates =Math.ceil((pipeline * 100)/responseRate);
    $('#sourced-val').text(sourcedCandidates);
  };
  
  
  var $document   = $(document),
      selector    = '[data-rangeslider]',
      $element    = $(selector);

  $element.rangeslider({
    polyfill: false,
    onInit: function() {
      console.log('Range Slider Init');
      app.fn.responseRateCalc();
    },
    onSlide: function(position, value) {
      console.log('Range Slider onSlide');
      app.fn.responseRateCalc();
    },
    onSlideEnd: function(position, value) {
      console.log('onSlideEnd');      
    }
  });

  app.el['window'] = $(window);
  app.el['document'] = $(document);
  app.el['loader'] = $('#loader');
  app.el['mask'] = $('#mask');
  app.fn.screenSize = function() {
    var size, width = app.el['window'].width();
    if(width < 320) size = "Not supported";
    else if(width < 480) size = "Mobile portrait";
    else if(width < 768) size = "Mobile landscape";
    else if(width < 960) size = "Tablet";
    else size = "Desktop";
    // $('#screen').html( size + ' - ' + width );
    // console.log( size, width );  
  };
  //Preloader
  app.el['loader'].delay(700).fadeOut();
  app.el['mask'].delay(1200).fadeOut("slow");
  // Resized based on screen size
  app.el['window'].resize(function() {
    app.fn.screenSize();
  });
  //Flexislider for testimonials
  if($('.testimonials-slider').length != 0) {
    $('.testimonials-slider').flexslider({
      manualControls: '.flex-manual .switch',
      nextText: "",
      prevText: "",
      startAt: 1,
      slideshow: false,
      direction: "horizontal",
      animation: "slide"
    });
  };
  // Headhesive init
  var options = { // set options
    offset: '#showHere',
    classes: {
      clone: 'fixmenu-clone',
      stick: 'fixmenu-stick',
      unstick: 'fixmenu-unstick'
    }
  };
  if($('#registration').length == 0 && $('#blog').length == 0 && $('#post ').length == 0) {
    var fixmenu = new Headhesive('.navigation-header', options); // init
  }
  // Navigation Scroll
  $('.navigation-bar').onePageNav({
    currentClass: 'active',
    changeHash: true,
    scrollSpeed: 750,
    scrollThreshold: 0.5,
    easing: 'swing'
  });
  // Animated Appear Element
  if(app.el['window'].width() > 1024) {
    $('.animated').appear(function() {
      var element = $(this);
      var animation = element.data('animation');
      var animationDelay = element.data('delay');
      if(animationDelay) {
        setTimeout(function() {
          element.addClass(animation + " visible");
          element.removeClass('hiding');
        }, animationDelay);
      } else {
        element.addClass(animation + " visible");
        element.removeClass('hiding');
      }
    }, {
      accY: -150
    });
  } else {
    $('.animated').css('opacity', 1);
  }
  // fade in .back-to-top
  $(window).scroll(function() {
    if($(this).scrollTop() > 500) {
      $('.back-to-top').fadeIn();
    } else {
      $('.back-to-top').fadeOut();
    }
  });
  // scroll body to 0px on click
  $('.back-to-top').click(function() {
    $('html, body').animate({
      scrollTop: 0,
      easing: 'swing'
    }, 750);
    return false;
  });
  // count down timer
  var futureDate = new Date();
  // count down 10 days from today
  futureDate.setDate(futureDate.getDate() + 10);
  // or set specific date in the future
  // futureDate = new Date(2014, 7, 26);
  $('.countdown').countdown({
    until: futureDate,
    compact: true,
    padZeroes: true,
    layout: $('.countdown').html()
  });
  $('#join').click(function() {
    var Prospect = Parse.Object.extend("prospect");
    var prospect = new Prospect();
    var toSend = {};
    toSend['email'] = $('#NewsletterEmail').val();
    toSend['name'] = $('#NewsletterName').val();
    toSend['newsletter'] = $('#news').val();
    prospect.save(toSend).then(function(object) {
      toastr.success('Thank you for signing up.');
      //toastr.error('An error occured. Please try again later.');
    });
    /*var speckyUrl = "http://app.specky.co/specky/register";
    var data = {};
    data['email_address'] = $('#NewsletterEmail').val();
    data['name'] = $('#NewsletterName').val();
    $.ajax({
      type: "POST",
      url: speckyUrl,
      data: data,
      success: function(data) {
        console.log('Specky Register Success', data)
      }
    });*/
  });
})();