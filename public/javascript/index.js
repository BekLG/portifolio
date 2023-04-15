$("#btnNightDay").click(function(){

    $(".navigation").toggleClass("dark2");
    $(".main-div").toggleClass("dark2");
    $(".name").toggleClass("dark2");
    $(".intro-text").toggleClass("dark2");
    $(".about-page").toggleClass("dark1");
    $(".contact-page").toggleClass("dark1");
    $(".svgpath").toggleClass("dark1");
    $("#btn-download-cv").toggleClass("btn-outline-light btn-primary");
    $("#contact-title").toggleClass("dark1");
    $(".cont-methods").toggleClass("dark-item1");
    $(".about-text-intro-name").toggleClass("dark-item2");
    $("#btn-send").toggleClass("btn-outline-light");
    $("#btn-reset").toggleClass("btn-outline-light");
    $(".svgpath2").toggleClass("dark1");
    
    if($("#btnNightDay").hasClass("btn-dark"))
    {
        $("#btnNightDay").removeClass("btn-dark");
        $("#btnNightDay").addClass("btn-light");
    }
    else if($("#btnNightDay").hasClass("btn-light"))
    {
        $("#btnNightDay").removeClass("btn-light");
        $("#btnNightDay").addClass("btn-dark");
    }

});