$(document).ready(function() {

    // HTML
    let destinationSection = '<div class="destination-card"> \
        <div class="destination destination-dimensions"><div class="card-background destination-dimensions"> </div><h1 class="destination-header"> Destination 1 </h1></div> \
        <div class="destination destination-dimensions"><div class="card-background destination-dimensions"> </div><h1 class="destination-header"> Destination 2 </h1></div> \
        <div class="destination destination-dimensions"><div class="card-background destination-dimensions"> </div><h1 class="destination-header"> Destination 3 </h1></div> \
    </div>';

    let API_KEY = "api_key=571ee6a64d94d591df7a60ffb8f5e557";

    let categories = [
        {title: "Australian Islands", selected: false, coverImg: "", desintations: [
            {title: "Fraser Island", thumbnails: []},
            {title: "Morton Island", thumbnails: []},
            {title: "Keppel Island", thumbnails: []}]
        },
        {title: "Australian Outback", selected: false, coverImg: "", desintations: [
            {title: "Carnarvon Gorge", thumbnails: []},
            {title: "Longreach", thumbnails: []},
            {title: "Gulf Savannah", thumbnails: []}]
        },
        {title: "Australian Beaches", selected: false, coverImg: "", desintations: [
            {title: "Rainbow Beach", thumbnails: []},
            {title: "Airlie Beach", thumbnails: []},
            {title: "Mooloolaba", thumbnails: []}]
        }
    ];

    let carouselImages = [];
    let recentlyViewed = [];

    initSite();

    $(".card").each(function(indx) {
        $(this).click(() => {
            categoryClick(indx);
        });
    });

    $("#modal-close").click(() => {
        resetRecentlyList();
        $("#modal-container").css({"display":"none"});
        carouselImages = [];
        $("#img-list > .modal-imgs").eq(indexInCarousel).css({"border":`none`});
        indexInCarousel = 0;
    })

    $("#close-recently-modal").click(() => {
        resetRecentlyList();
        $("#recently-modal").css({"display":"none"});
    })

    function resetRecentlyList() {
        $("#recent-list").html("");
        for (var i = 0; i < 5; i++) {
            if (recentlyViewed[i] == undefined) {
                // if there are < 5 recently viewed, will be filled with empty squares
                let recentImg = `<img class="recent-img">`;
                $("#recent-list").append(recentImg);
            } else {
                let recentImg = `<img class="recent-img" src="${recentlyViewed[i].sml}">`;
                $("#recent-list").append(recentImg);
                addRecentImageClick(i, recentlyViewed[i]);
            }
        }
    }

    let carouselImg = $("#carousel-img");
    let indexInCarousel = 0;
    $(".carousel-prev").click(() => {
        indexInCarousel-=1;
        if (indexInCarousel < 0) {
            // hit prev at begining of list, so go to the end
            indexInCarousel = carouselImages.length-1;
            selectCarouselImg(indexInCarousel, 0);
        } else {
            selectCarouselImg(indexInCarousel, indexInCarousel+1);
        }
        setCarouselData();
    })
    
    $(".carousel-next").click(() => {
        let n = carouselImages.length;
        indexInCarousel+=1;
        if (indexInCarousel >= n) {
            // at the end of the list, so go to the start
            indexInCarousel = 0;
            selectCarouselImg(indexInCarousel, n-1);
        } else {
            selectCarouselImg(indexInCarousel, indexInCarousel-1)
        }
        setCarouselData();
    })

    function addRecentImageClick(indx, newData) {
        $(".recent-img").eq(indx).click(() => {
            // Data to add to modal
            $("#recently-modal").css({"display":"block"});
            $("#recently-img").attr({"src":`${recentlyViewed[indx].modal}`});
            $("#recently-caption").html("Caption: " + recentlyViewed[indx].caption);
            $("#recently-date").html("Date: " + recentlyViewed[indx].date);
            if (indx != 0) {
                // move new dest to front and remove old location
                moveImageToFront(indx, newData);
            }
        });
    }

    function moveImageToFront(indx, newData) {
        // Helper function to move images within the recentlyViewed array
        var newData = recentlyViewed[indx];
        recentlyViewed.splice(indx, 1);
        recentlyViewed.splice(0, 0, newData);
    }

    function selectCarouselImg(i, j) {
        $("#img-list > .modal-imgs").eq(j).css({"border":`none`});
        $("#img-list > .modal-imgs").eq(i).css({"border":`2px solid black`});
    }

    function setCarouselData() {
        carouselImg.attr({"src":`${carouselImages[indexInCarousel].modal}`});
        $("#modal-caption").html("Caption: " + carouselImages[indexInCarousel].caption);
        $("#modal-date").html("Date taken: " + carouselImages[indexInCarousel].date);
        addRecentlyViewed();
    }

     function initSite() {
        for (var i = 0; i < categories.length; i++) {
            coverImage(categories[i].title, i);
            for (var j = 0; j < categories[i].desintations.length; j++) { // going through each destination
                addDestinationImages(i, j);
            }
        }
    }

    function categoryClick(indx) {
        let selectedCategory = categories[indx].selected;
        if (selectedCategory == true) {
            // if the selected category is being shown
            // hide it
            categories[indx].selected = false;
            hideDestinations(indx);
            return;
        }
        categories[indx].selected = true;
        for (var i = 0; i < categories.length; i++) {
            if(i==indx)continue;
            if (categories[i].selected == true) {
                categories[i].selected = false;
                hideDestinations(i);
            }
        }
        // hides all other destinations and shows new ones
        showDestinations(indx);
    }

    function hideDestinations(i) {
        $(".card-header").eq(i).css({"color":"white"})
        $("div.destination-card").remove();
    }

    function showDestinations(categoryIndx) {
        $(".card-header").eq(categoryIndx).css({"color":"maroon"});
        let width = $(document).width();
        if (width <= 768) { // mobile view (Single column)
            $(".card").eq(categoryIndx).after(destinationSection);
        } else if (width <= 989) { // mid range view (2 columns)
            $(".card").eq(1).after(destinationSection);
        } else { // full desktop (3 columns)
            $(".categories").append(destinationSection);
        }
        addDestinationData(categoryIndx);
    }

    function addDestinationData(indx) {
        // When destination section is added, relevant imgs/data for each destination is required
        let des = categories[indx].desintations;
        for (var i = 0 ; i < des.length; i++) {
            destinationClick(i, des[i]);
            var src = des[i].thumbnails[0].modal;
            $(".destination-card  > .destination > .card-background").eq(i).css({"background-image":`url(${src})`});
            $(".destination-header").eq(i).html(des[i].title);
        }
    }

    function destinationClick(i, des) {
        // Setting up the carousel modal and adding the data to the DOM
        $(".destination-card > .destination").eq(i).click(() => {
            $("#modal-container").css({"display":"block"});
            $("#carousel-img").attr({"src":`${des.thumbnails[0].modal}`, "alt": `${des.title}`});
            for (var j = 0; j < des.thumbnails.length;j++) {
                carouselImages.push(des.thumbnails[j]);
                $("#img-list > .modal-imgs").eq(j).attr({"src":`${des.thumbnails[j].sml}`});
            }
            selectCarouselImg(0);
            setCarouselData();
        });   
    }

    function addRecentlyViewed() {
        // Adds an image to recently viewed list
        // if the image exists, it can't exist twice so its moved to the front
        for (var i = 0; i < recentlyViewed.length; i++) {
            if (recentlyViewed[i].id == carouselImages[indexInCarousel].id) {
                moveImageToFront(i, carouselImages[indexInCarousel]);
                return; // dont add image to list
            }
        }
        recentlyViewed.splice(0, 0, carouselImages[indexInCarousel]);
        // deal with overflow (only need 5 recently viewed)
        if (recentlyViewed.length >= 6) {
            recentlyViewed.pop();
        }
    }

    // FLICKR API functions
    function createSearchString(searchVal) { // finds photos with search condition
        return `https://www.flickr.com/services/rest/?method=flickr.photos.search&tags=${searchVal}&per_page=20$page=1&format=json&nojsoncallback=1&${API_KEY}`;
    }

    function createInfoSearchString(photoID) { // search for info on an image (Used to get the date)
        return `https://www.flickr.com/services/rest/?method=flickr.photos.getInfo&photo_id=${photoID}&format=json&nojsoncallback=1&${API_KEY}`;
    }

    function createFavouriteSearchString(photoID) { // will return how many people have favourite the post
        return `https://www.flickr.com/services/rest/?method=flickr.photos.getFavorites&photo_id=${photoID}&format=json&nojsoncallback=1&${API_KEY}`;
    }

    function createSizesString(photoID) { // gets sizes for each image
        return `https://api.flickr.com/services/rest/?method=flickr.photos.getSizes&format=json&nojsoncallback=1&photo_id=${photoID}&${API_KEY}`;
    }

    function coverImage(category, index) {
        let str = createSearchString(category);
        $.get(str, data => {
            setCoverImg(data.photos.photo[0].id, index);
        });
    }
    
    function setCoverImg(photoID, index) {
        let getSizesStr = createSizesString(photoID); 
        $.get(getSizesStr).then((data) => {
            categories[index].coverImg = data.sizes.size[1].source;
            // sets the cover images of each category
            let card = $(".categories > .cards > .card > .card-background").eq(index);
            card.css({"background-image": `url(${categories[index].coverImg})`});
        });
    }

    function addDestinationImages(i, j) {
        let destination = categories[i].desintations[j];
        let searchStr = createSearchString(destination.title);
        $.get(searchStr, data => {
            for (var k = 0; k < 5; k++) {
                if (categories[i].desintations[j].thumbnails.length >= 4) break;
                getDestinationImageSize(data.photos.photo[k].id, i, j, data.photos.photo[k].title);
                // getBestPhoto(data.photos.photo, i, j, k);
            }
            // original attempt at getting the best images
            // let kValues = [];
            // var count = 0, k = 0, h = 0;
            // while (count <= 5 && k <= 10) {
            //     kValues.push(k);
            //     var response = getBestphoto(data.photos.photo[k].id, i, j, k).then((a) => {
            //         var amount = a.photo.total;
            //         if (amount >= 10) {
            //             var old = kValues[h];
            //             getDestinationImageSize(data.photos.photo[old].id, i, j, destination.title);
            //             count++;
            //             h++;
            //         }
            //     })
            //     k++;
            // }
        });
    }

    async function getBestphoto(id, i, j, k) {
        // using favourtie as it will return the most favouried images
        let favSearchStr = createFavouriteSearchString(id);
        const result = await $.get(favSearchStr);
        return result;
    }

    function getDestinationImageSize(photoID, i, j, title) {
        let getSizesStr = createSizesString(photoID);
        $.get(getSizesStr).then(data => {
            var img = data.sizes.size;
            // logic to get the optimal sml and lrg images
            var n = data.sizes.size.length;
            addThumbnailInfo(photoID, i, j, img[n-1].source, img[3].source, img[1].source, title, photoID);
        })
    }

    function addThumbnailInfo(photoID, i, j, img, sml, lrg, cap, id) {
        let searchString = createInfoSearchString(photoID);
        $.get(searchString, data => {
            let date = data.photo.dates.taken;
            date = date.substring(0,11);
            var info = {modal:img, sml:sml, lrg:lrg, date:date, caption: cap, id:id};
            categories[i].desintations[j].thumbnails.push(info);
        });
    }
});