!function(){"use strict";$(document).ready(function(){"undefined"!=typeof Parse&&Parse.initialize("wLizknDtFC5dTuArjknWvq58fiHLohcBMsF3N79c","pjmgLhlqWLRklIyIheAfOBJhvQczzXpE8wFxHND4")}),window.app={el:{},fn:{}},app.el.window=$(window),app.el.document=$(document),app.el.loader=$("#loader"),app.el.mask=$("#mask"),app.fn.screenSize=function(){var e,a=app.el.window.width();e=320>a?"Not supported":480>a?"Mobile portrait":768>a?"Mobile landscape":960>a?"Tablet":"Desktop"},app.el.loader.delay(700).fadeOut(),app.el.mask.delay(1200).fadeOut("slow"),app.el.window.resize(function(){app.fn.screenSize()}),0!=$(".testimonials-slider").length&&$(".testimonials-slider").flexslider({manualControls:".flex-manual .switch",nextText:"",prevText:"",startAt:1,slideshow:!1,direction:"horizontal",animation:"slide"});var e={offset:"#showHere",classes:{clone:"fixmenu-clone",stick:"fixmenu-stick",unstick:"fixmenu-unstick"}};if(0==$("#registration").length&&0==$("#blog").length&&0==$("#post ").length){new Headhesive(".navigation-header",e)}$(".navigation-bar").onePageNav({currentClass:"active",changeHash:!0,scrollSpeed:750,scrollThreshold:.5,easing:"swing"}),app.el.window.width()>1024?$(".animated").appear(function(){var e=$(this),a=e.data("animation"),t=e.data("delay");t?setTimeout(function(){e.addClass(a+" visible"),e.removeClass("hiding")},t):(e.addClass(a+" visible"),e.removeClass("hiding"))},{accY:-150}):$(".animated").css("opacity",1),$(window).scroll(function(){$(this).scrollTop()>500?$(".back-to-top").fadeIn():$(".back-to-top").fadeOut()}),$(".back-to-top").click(function(){return $("html, body").animate({scrollTop:0,easing:"swing"},750),!1});var a=new Date;a.setDate(a.getDate()+10),$(".countdown").countdown({until:a,compact:!0,padZeroes:!0,layout:$(".countdown").html()}),toastr.options={positionClass:"toast-top-full-width"},$("#join").click(function(){var e=Parse.Object.extend("prospect"),a=new e,t={};t.email=$("#email").val(),t.name=$("#fullname").val(),t.newsletter=$("#news").val(),a.save(t).then(function(e){toastr.success("Thank you for signing up.")})})}();