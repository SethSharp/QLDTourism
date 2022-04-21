$(document).ready(function(){

    let currentIndexDestination = -1;

    let categories = [
        {title: "Islands", selected: false, desintations: [
            {title: "Fraser Island", coverImg: "", thumbnails: ["","","","",""]},
        ]},
        {title: "Outback", selected: false, desintations: [
            {title: "Fraser Island", coverImg: "", thumbnails: ["","","","",""]},
        ]},
        {title: "Beaches", selected: false, desintations: [
            {title: "Fraser Island", coverImg: "", thumbnails: ["","","","",""]},
        ]}
    ];
    let destinations = [];
    $(".card").each(function(indx) {
        $(this).click(() => {
            console.log("Clicked")
            getClickFuncForCategories(indx);
        });
    });

    function hidecategories(i) {
        $(`.card > .card-header`).eq(i).css({"color":"white"})
        $("div.destination-card").remove();
    }
    let destinationSection = '<div class="destination-card"></div>';
    let card = '<div class="destination destination-dimensions"><div class="card-background destination-dimensions island"></div><h1 class="card-header"> Destination </h1></div>';
    function showcategories(categoryIndx) {
        
        
        let width = $(document).width();
        currentIndexDestination = categoryIndx;
        if (width > 768) {
            addDesktopDestinations();
        } else {
            addMobileDesintions(categoryIndx);
        }
    }

    function addMobileDesintions(categoryIndx) {
        $(".card").eq(categoryIndx).after(destinationSection);
        for (var i = 0 ; i < 3; i++) {
            $(".destination-card").append(card);
        }
    }

    function addDesktopDestinations() {
        $(".categories").append(destinationSection)
        for (var i = 0 ; i < 3; i++) {
            $(".destination-card").append(card);
        }
    }

    function getClickFuncForCategories(indx) {
        let selectedCategory = categories[indx].selected;
        if (selectedCategory == true) {
            categories[indx].selected = false;
            hidecategories(indx);
            return;
        }
        showcategories(indx);
        categories[indx].selected = true;
        for (var i = 0; i < categories.length; i++) {
            if(i==indx)continue;
            if (categories[i].selected == true) {
                categories[i].selected = false;
                hidecategories(i);
            }
        }
        $(`.card > .card-header`).eq(indx).css({"color":"red"})
    }

    var hasBeenResized = false;
    $(window).resize(function() {
        let width = $(window).width();
        if (currentIndexDestination == -1) return;
        if (hasBeenResized) return;
        if (width < 768) {
            let doesExist = ($(".categories > .destination-card").get());
            // instead of deleting, what if we just move it to the new section
            if (doesExist.length != 0) {
                hasBeenResized = true;
                hidecategories(currentIndexDestination)
                addMobileDesintions(currentIndexDestination)
            }
        }
      });
});