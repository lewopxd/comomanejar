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
        //console.log('played the video!');
        isPaused = false;
        vhsBlur("0.05s");
    });

    player.on('pause', function () {
        //console.log('paused the video!');
        isPaused = true;
        vhsBlur("0.01s");
    });

    player.on('bufferstart', function () {
       // console.log('start buffer the video!');
        hideElementsContaineronPlay();
    });

    player.on('bufferend', function () {
        //console.log('bufferended the video!');
        if (isFirstTime) {
            player.pause();
            var vimeoVideo = document.getElementById('vimeo-video');
            vimeoVideo.style.opacity = ".5";
            resizeContainerElements();
            isFirstTime = false;

        }
        showElementsContaineronPause();

    });

    player.on('resize', function (e) {
       // console.log(e);
        videoW = e.videoWidth;
        videoH = e.videoHeight;
        console.log("Player.on resize: Video dimensions: " + videoW + " x " + videoH);
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
        
       var x = document.getElementById("containerElements");
 
        x.style.height = "" + (videoH/videoW)*100 + "vw";
        x.style.maxWidth = "" + (videoW/videoH)*100 + "vh";



    }


    function browserResize() {
        screenW = window.innerWidth;
        screenH = window.innerHeight;

        console.log("browserResize: " + screenW + " - " + screenH);

        if (screenW > 0) {
            resizeContainerElements();
        }

    }

     

   


    document.getElementById('playpause-button').onclick = function () {
        var vimeoVideo = document.getElementById('vimeo-video');
        if (isFirstClick) {
            isFirstClick = false;
            vimeoVideo.style.opacity="1";
        }
        var element = document.getElementById('containerElements');

        var styles = window.getComputedStyle(element);
        var cursor = (styles.getPropertyValue('cursor'));

        var ppbutton = document.getElementById('playpause-button');
        var dateTitle = document.getElementById('dateTitle');
        

 
           if(showingElements){

           
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
//console.log("fisrt move");
showElementsContainerOnMove(true);
timer=3000;
}

    clearTimeout(timeout);
    timeout = setTimeout(function () {
      
           //console.log("chao");
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
        //console.log("hiden");
    }

    function showElementsContaineronPause() {
       
        var elemntsContainer = document.getElementById("containerElements");
        var ppButton = document.getElementById("playpause-button");

        elemntsContainer.style.opacity = "1";
        //document.body.classList.add('block');
        //document.body.click();

        showingElements=true;
        //console.log("showed");

    }

/*         ->>>>>>>>>>>> FULL SCREEN <<<<<<<<<<<<<<<                      */


document.getElementById('fullscreen-icon').onclick = function () {
    toggleFullScreen();
}

function toggleFullScreen() {
    if (!document.fullscreenElement) {
       openFullscreen();
    } else {
      if (document.exitFullscreen) {
       closeFullscreen();
      }
    }
  }


    /* Get the documentElement (<html>) to display the page in fullscreen */


var elem = document.documentElement;

/* View in fullscreen */
function openFullscreen() {
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.webkitRequestFullscreen) { /* Safari */
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) { /* IE11 */
    elem.msRequestFullscreen();
  }
  document.getElementById("fullscreen-icon2").style.opacity="1";
  document.getElementById("fullscreen-icon").style.opacity="0";
}

/* Close fullscreen */
function closeFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.webkitExitFullscreen) { /* Safari */
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) { /* IE11 */
    document.msExitFullscreen();
  }
  document.getElementById("fullscreen-icon").style.opacity="1";
  document.getElementById("fullscreen-icon2").style.opacity="0";
}
 



/*  >>>>>>>>>> end     FULL SCREEN   <<<<<<<<< */



function vhsBlur(timerD){
    document.body.style.color="#eee";
    document.body.style.textShadow="0.06rem 0 0.06rem #ea36af, -0.125rem 0 0.06rem #75fa69";
     document.body.style.animationDuration=timerD;
    document.body.style.animationName="textflicker";
    document.body.style.animationIterationCount="infinite";
    document.body.style.animationDirection="alternate";
      
    }