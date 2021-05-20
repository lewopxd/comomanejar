     console.log("hola mundo");

    var datetit = "23/07/1980";
    var screenW = window.innerWidth;
    var screenH = window.innerHeight;

    var videoW;
    var videoH;

    var isPaused = false;

    var containerElementsOnScreen = false;

    var count = 0;

    var isFirstTime = true;
    var isFirstClick = true;

    var isFirstTimetoHide =true;

    var timer = 3000;

    var showingElements=false;

    /* ---------->  [ PLAYER ] <---------   */

    /*playsinline	true	
    Play video inline on mobile devices, 
    to automatically go fullscreen on playback
     set this parameter to false.*/

    var options = {
        id: 551313974,
        /*59777392*/
        title: false,
        controls: false,
        loop: false,
        byline: false,
        autoplay: true
    };
    var player = new Vimeo.Player('vimeo-video', options);

    player.on('play', function () {
        console.log('played the video!');
        isPaused = false;
    });

    player.on('pause', function () {
        console.log('paused the video!');
        isPaused = true;
    });

    player.on('bufferstart', function () {
        console.log('start buffer the video!');
    });

    player.on('bufferend', function () {
        console.log('bufferended the video!');
        if (isFirstTime) {
            player.pause();
            var vimeoVideo = document.getElementById('vimeo-video');
            vimeoVideo.style.opacity = ".5";
            isFirstTime = false;
        }
        showElementsContainer(true);

    });

    player.on('resize', function (e) {
        console.log(e);
        videoW = e.videoWidth;
        videoH = e.videoHeight;
        console.log("Video dimensions: " + videoW + " x " + videoH);
        resizeContainerElements();
    });

    player.on('qualitychange', function (e) {
        // console.log(e);
    });

    /*   END------------> PLAYER <---------------    */



    /* 
    function getVideoSize(){
        Promise.all([player.getVideoWidth(), player.getVideoHeight()]).then(dimensions => {
            const [width, height] = dimensions;
            // do something here
           videoW=width;
           videoH=height;
           console.log(width+"---"+height);
        });
    }
    */











    function resizeContainerElements() {


        console.log("Il do it");
        var newElementHeight = (videoH * screenW) / videoW;
        console.log(screenW + "  x  " + screenH);
        console.log(videoW + "    x  " + videoH);
        console.log("newelemenH: " + newElementHeight);

        var x = document.getElementById("containerElements");

        x.style.height = "" + newElementHeight + "px";



    }


    function browserResize() {
        screenW = window.innerWidth;
        screenH = window.innerHeight;

        console.log("new: " + screenW + " - " + screenH);

        if (screenW > 299) {
            resizeContainerElements();
        }

    }

     

   


    document.getElementById('playpause-button').onclick = function () {

        if (isFirstClick) {
            isFirstClick = false;
        }
        var element = document.getElementById('containerElements');

        var styles = window.getComputedStyle(element);
        var cursor = (styles.getPropertyValue('cursor'));

        var ppbutton = document.getElementById('playpause-button');
        var dateTitle = document.getElementById('dateTitle');
        var vimeoVideo = document.getElementById('vimeo-video');

 
           if(showingElements){

            console.log("play/pause " + "isPaused?" + isPaused);
            if (isPaused) {

                hideElementsContaineronPlay();
                player.play();

                ppbutton.innerHTML = "PLAY&#9658";
                dateTitle.innerHTML = datetit + "&#9658";

                vimeoVideo.style.opacity = "1";
                isFirstTimetoHide =false;

                timer=0;
            } else {
                 showElementsContaineronPause();
                player.pause();
                ppbutton.innerHTML = "PAUSED";
                vimeoVideo.style.opacity = ".5";
                dateTitle.innerHTML = datetit;
               
            }
           }else{
            onMove();
           }
    }

/*
    var isaClick=false;

    document.getElementById('containerElements').addEventListener('mousedown', e => {
        console.log("mouse down");
        isaClick=true;
        
    });

    document.getElementById('containerElements').addEventListener('mouseup', e => {
        console.log("mouse up");
        isaClick=true;
    });
*/
    var timeout;
   var justone=0;

    var firstcX=0;
    var firstcY=0;

    var cX=0;
    var cY=0;

    document.getElementById('containerElements').addEventListener('mousemove', e => {
          
        cX=e.clientX;
        cY=e.clientY;

        if(firstcX!=cX || firstcY!=cY ){
             //console.log(">>>>mousemov: someone is moving the cursor");
             firstcX=cX;
             firstcY=cY;
        }else{

        }

       // console.log(e.clientX); 
           onMove();
       

    });


function onMove(){
    var elemntsContainer = document.getElementById("containerElements");
    var ppButton = document.getElementById("playpause-button");

     
justone++;
if (justone==1){
console.log("fisrt move");
showElementsContainerOnMove(true);
timer=3000;
}

    clearTimeout(timeout);
    timeout = setTimeout(function () {
      
           console.log("chao");
           showElementsContainerOnMove(false);
           justone=0;
    }, timer);
}



    function showElementsContainerOnMove(show) {
     
        if(isFirstTimetoHide){
     show=true;
      }
      
         
        if (!isPaused || isFirstClick ) {
            if (show) {
                
                showElementsContaineronPause();
  
            } else {
                hideElementsContaineronPlay();

            }
        
    }
    }

    function hideElementsContaineronPlay() {
        
        var elemntsContainer = document.getElementById("containerElements");
        var ppButton = document.getElementById("playpause-button");

      

        elemntsContainer.style.opacity = "0";
        
        //document.body.classList.add('block');
        //document.body.click();

        showingElements=false;
        console.log("hiden");
    }

    function showElementsContaineronPause() {
       
        var elemntsContainer = document.getElementById("containerElements");
        var ppButton = document.getElementById("playpause-button");

        elemntsContainer.style.opacity = "1";
        //document.body.classList.add('block');
        //document.body.click();

        showingElements=true;
        console.log("showed");

    }