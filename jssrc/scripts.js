(function() {
  "use strict";

  window.app = {
    el: {},
    fn: {}
  };
  
  app.fn.responseRateCalc = function(){
    var hired = parseInt($('#hired-candidate-val').text());
    
    var responseRate = parseInt($('#response-rate-range').val());
    var engagementRate = parseInt($('#engagement-range').val());
    var screeningRate = parseInt($('#pass-screening-range').val());
    var offerRate = parseInt($('#offer-extended-range').val());
    var acceptanceRate = parseInt($('#offer-acceptance-range').val());
    
    //console.log(responseRate,engagementRate,screeningRate,offerRate,acceptanceRate,hired);

    var candidatesWithOffer = Math.ceil((hired*100)/acceptanceRate);        
    var candidatesWithInterview = Math.ceil((candidatesWithOffer * 100)/offerRate);    
    var engagedPipeline = Math.ceil((candidatesWithInterview * 100)/screeningRate);    
    var pipeline = Math.ceil((engagedPipeline * 100)/engagementRate);    
    var sourcedCandidates =Math.ceil((pipeline * 100)/responseRate);
    
    $('#offered-val').text(candidatesWithOffer);
    $('#interview-val').text(candidatesWithInterview);
    $('#engaged-pipeline-val').text(engagedPipeline);
    $('#pipeline-val').text(pipeline);
    $('#sourced-val').text(sourcedCandidates);
  };
  
  var rangeSliderSelector    = '[data-rangeslider]',
      $rangeSliderElement    = $(rangeSliderSelector);
   
  $rangeSliderElement.ionRangeSlider({
    type: "single",
    min: 0,
    max: 100,    
    step:5,
    grid:true,
    postfix:"%",
    keyboard: true,
    onStart: function (data) {      
      app.fn.responseRateCalc();
    },
    onChange: function (data) {      
      app.fn.responseRateCalc();
    },
    onFinish: function (data) {
      console.log("onFinish");
    },
    onUpdate: function (data) {
      console.log("onUpdate");
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