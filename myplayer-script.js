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

var durationVideo;

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
        vimeoVideo.style.opacity = "8";
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
player.on('progress', function (getAll) {
   
    var percentage = (getAll.percent*100)+"%"
    var pp = document.getElementById("progressBuffered");
    pp.style.width = percentage;
   // console.log(percentage);
     
});
player.on('timeupdate', function (getAll) {
    currentPos = getAll.seconds; //get currentime
    vdoEndTym = getAll.duration; //get video duration
    percentage = (getAll.percent * 100) + "%";
    seconds = getAll.seconds;
   
 

    var ctn = document.getElementById("time-counter");
    ctn.innerHTML=format(seconds)+" / "+format(vdoEndTym);
    var pp = document.getElementById("progressPlayed");
   // pp.style.width = percentage;

    document.getElementById("customRange1").value = ""+(getAll.percent * 100);
     setCustomRangeColor(getAll.percent*100);   

});



    player.getDuration().then(function(dur) {
        // `duration` indicates the duration of the video in seconds
        durationVideo = dur;
        
      }) ;

  
/*   END------------> PLAYER <---------------    */


var range = document.getElementById("customRange1");
 
var d=0.0;

   range.addEventListener('input', function () {

       var percent = range.value;

       var newTime=(percent*durationVideo)/100;
       
      console.log(percent+ "  -  new val: " +newTime);
        
       var pp = document.getElementById("progressPlayed");
      // pp.style.width = percent+"%";
        

      var value = (this.value-this.min)/(this.max-this.min)*100;
      setCustomRangeColor(value);
       player.setCurrentTime(newTime);


          }, false);    


          function setCustomRangeColor(value){ 
            var CustomRange = document.getElementById("customRange1");   
            
            var color1 = '#ffffff9a';
            var color2 ='rgba(255, 255, 255, 0.116)';
            
            CustomRange.style.background = 'linear-gradient(to right, '+color1+'  0%, '+color1+' ' + value + '%, '+color2+' ' + value + '%, '+color2+' 100%)';
       
          }

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



function format(time) {   
    // Hours, minutes and seconds
    var hrs = ~~(time / 3600);
    var mins = ~~((time % 3600) / 60);
    var secs = ~~time % 60;

    // Output like "1:01" or "4:03:59" or "123:03:59"
    var ret = "";
    if (hrs > 0) {
        ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
    }
    ret += "" +  (mins < 10 ? "0":"")+mins + ":" + (secs < 10 ? "0" : "");
    ret += "" + secs;

    return ret;
}




/**   >>>>>> atajos de teclado  */


window.addEventListener('keydown', e => {
  console.log(e.code);
   if(e.code=="Space"){
        if(isPaused){
            player.play();
            hideElementsContaineronPlay();
        }else{
            player.pause();
            showElementsContaineronPause();
        }
   } 

});



/** 
var  objRef = window.toolbar;

objRef.visible


console.log(objRef);

*/