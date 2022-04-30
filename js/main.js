$(document).ready(function() {

    // HTML
    let destinationSection = '<div class="destination-card"> \
        <div class="destination destination-dimensions"><div class="card-background destination-dimensions"> </div><h1 class="card-header"> a </h1></div> \
        <div class="destination destination-dimensions"><div class="card-background destination-dimensions"> </div><h1 class="card-header">b  </h1></div> \
        <div class="destination destination-dimensions"><div class="card-background destination-dimensions"> </div><h1 class="card-header"> c </h1></div> \
    </div>';

    let recentlyViewed = [];

    let API_KEY = "api_key=571ee6a64d94d591df7a60ffb8f5e557";

    let categories = [
        {title: "Islands", selected: false, coverImg: "", desintations: [
            {title: "Fraser Island", coverImg: "https://live.staticflickr.com/65535/352163161_308c9ba5f7_n.jpg", thumbnails: []},
            {title: "Morton Island", coverImg: "https://live.staticflickr.com/65535/352163161_308c9ba5f7_n.jpg", thumbnails: []},
            {title: "Great Keppel Island", coverImg: "https://live.staticflickr.com/65535/352163161_308c9ba5f7_n.jpg", thumbnails: []}]
        },
        {title: "Outback", selected: false, coverImg: "", desintations: [
            {title: "Carnarvon Gorge", coverImg: "", thumbnails: []},
            {title: "Longreach", coverImg: "", thumbnails: []},
            {title: "Gulf Savannah", coverImg: "", thumbnails: []}]
        },
        {title: "Beaches", selected: false, coverImg: "", desintations: [
            {title: "Rainbow Beach", coverImg: "", thumbnails: []},
            {title: "Airlie Beach", coverImg: "", thumbnails: []},
            {title: "Mooloolaba", coverImg: "", thumbnails: []}]
        }
    ];

    let carouselImages = []; // holds images for carousel

    initSite();

    $(".card").each(function(indx) {
        $(this).click(() => {
            categoryClick(indx);
        });
    });

    $("#modal-close").click(() => {
        $("#modal-container").css({"display":"none"});
    })

    let carouselImg = $("#carousel-img");
    let indexInCarousel = 0;
    $(".carousel-prev").click(() => {
        indexInCarousel-=1;
        if (indexInCarousel < 0) {
            indexInCarousel = carouselImages.length-1;
            selectCarouselImg(indexInCarousel, 0);
        } else {
            selectCarouselImg(indexInCarousel, indexInCarousel+1);
        }
        carouselImg.attr({"src":`${carouselImages[indexInCarousel]}`});
    })
    
    $(".carousel-next").click(() => {
        let n = carouselImages.length;
        indexInCarousel+=1;
        if (indexInCarousel >= n) {
            indexInCarousel = 0;
            selectCarouselImg(indexInCarousel, n-1);
        } else {
            selectCarouselImg(indexInCarousel, indexInCarousel-1)
        }
        carouselImg.attr({"src":`${carouselImages[indexInCarousel]}`});
    })

    function selectCarouselImg(i, j) {
        $("#img-list > .modal-imgs").eq(j).css({"border":`2px solid yellow`});
        $("#img-list > .modal-imgs").eq(i).css({"border":`2px solid green`});
    }

    

    function initSite() {
        for (var i = 0; i < categories.length; i++) {
            // get category image
            coverImage(categories[i].title, i);
            for (var j = 0; j < categories[i].desintations.length; j++) { // going through each destination
                let destination = (categories[i].desintations[j].title);
                categories[i].desintations[j].thumbnails = getDestinationImages(destination, i, j);
            }
            break;
        }
    }

    function categoryClick(indx) {
        let selectedCategory = categories[indx].selected;
        if (selectedCategory == true) {
            categories[indx].selected = false;
            hideDestinations(indx);
            return;
        }
        showDestinations(indx);
        categories[indx].selected = true;
        for (var i = 0; i < categories.length; i++) {
            if(i==indx)continue;
            if (categories[i].selected == true) {
                categories[i].selected = false;
                hideDestinations(i);
            }
        }
    }

    function hideDestinations(i) {
        $(`.card > .card-header`).eq(i).css({"color":"white"})
        $("div.destination-card").remove();
    }

    function showDestinations(categoryIndx) {
        currentIndexDestination = categoryIndx;
        let width = $(document).width();
        if (width <= 768) { // mobile view (Single column)
            $(".card").eq(categoryIndx).after(destinationSection);
        } else if (width <= 989) { // mid range view (2 columns)
            $(".card").eq(1).after(destinationSection);
        } else { // full desktop (3 columns)
            $(".categories").append(destinationSection)
        }
        addDestinationData(categoryIndx);
    }

    // When destination section is added, relevant imgs/data for each destinations is required
    function addDestinationData(indx) {
        let des = categories[indx].desintations;
        for (var i = 0 ; i < des.length; i++) {
            destinationClick(i, des[i]);
            $(".destination-card  > .destination > .card-background").eq(i).css({"background-image":`url(${des[i].coverImg})`})
        }
    }

    function destinationClick(i, des) {
        $(".destination-card > .destination").eq(i).click(() => {
            $("#modal-container").css({"display":"block"});
            $("#carousel-img").attr({"src":`${des.thumbnails[1].src}`, "alt": `${des.title}`});
            for (var j = 0; j < des.thumbnails.length;j++) {
                let thumbnailImg = `<img class="modal-imgs" src="${des.thumbnails[j].src}" alt="...">`;
                carouselImages.push(des.thumbnails[j].src);
                $("#img-list > .modal-imgs").eq(j).attr({"src":`${des.thumbnails[j].src}`});//append(thumbnailImg);
            }
            selectCarouselImg(0);
        });
        
    }

    // $(window).resize(function() { });

    // FLICKr
    function coverImage(category, index) {
        let str = `https://www.flickr.com/services/rest/?method=flickr.photos.search&tags=${category}&per_page=5&format=json&nojsoncallback=1&${API_KEY}`;
        $.get(str, data => {
            var photoID = data.photos.photo[0].id;
            return getSizes(photoID, index);
        });
    }

    function getSizes(photoID, index) {
        let getSizesStr = `https://api.flickr.com/services/rest/?method=flickr.photos.getSizes&format=json&nojsoncallback=1&photo_id=${photoID}&${API_KEY}`; 
        $.get(getSizesStr).then((data) => {
            console.log(data);
            categories[index].coverImg = data.sizes.size[1].source;
            let card = $(".categories > .cards > .card > .card-background").eq(index);
            card.css({"background-image": `url(${categories[index].coverImg})`});
        });
    }

    function getDestinationImages(destination, i, j) {
        let imgs = [];
        for (var i = 0; i < 5; i++) {
            var img = (i%2==0) ? "https://live.staticflickr.com/65535/52037773212_3051189bf7.jpg" : "https://live.staticflickr.com/65535/52038513211_f534798a73.jpg";
            imgs.push({src:img, sml:"", lrg:"", date:"DD/MM/YYYY", caption: "Test caption"});
        }
        return imgs;
    }

});