console.log("hola mundo");

var datetit = "23/07/1980";
var chapterNum = 1;
var chaperTitle = "USTED Y LA REVERSA";
var youCanGoFF  = false;
var youCanGoRW  = true;
var youCanViewSmall = true;





var screenW = window.innerWidth;
var screenH = window.innerHeight;

var videoW;
var videoH;
var currentTimePercent;

var isPaused = false;

var isPlaying = false;

var isEnded = false;

var containerElementsOnScreen = false;

var count = 0;

var isFirstTime = true;
var isFirstClick = true;

var isFirstTimetoHide = true;

var timer = 3000;

var showingElements = false;

var durationVideo;

var userIsMovingProgress = false;

var wasPausedBeforeMoving=false;

var userInMobile = isMobile();




/* ---------->   [ Setting variables ] <--------*/

document.getElementById('dateTitle').innerHTML=datetit;
document.getElementById('chapterTitle').innerHTML=chapterNum+" "+chaperTitle ;

 


/* ---------->  [ PLAYER ] <---------   */

/*playsinline	true	
Play video inline on mobile devices, 
to automatically go fullscreen on playback
 set this parameter to false.*/

var options = {
    id: 59777392 ,    /*551313974*/
    title: false,
    controls: false,
    loop: false,
    byline: false,
    autoplay: true,
    loop: false
   
};
var player = new Vimeo.Player('vimeo-video', options);

player.on('play', function () {
    //console.log('played the video!');
    isPaused = false;
    isPlaying = true;
    isEnded = false;
    vhsBlur("0.05s");
});

player.on('pause', function () {
    //console.log('paused the video!');
    isPaused = true;
    isPlaying = false;
    isEnded = false;
    vhsBlur("0.01s");
});

player.on('ended', function () {
    
   
    isPaused = false;
    isPlaying = false;
    isEnded =true;
    
    manageEnd();
    vhsBlur("0.01s");
    
});

player.on('bufferstart', function () {
    // console.log('start buffer the video!');
    hideElementsContaineronPlay();
    if (isFirstTime) {
        player.play();
    player.setMuted(true);
    }
});

player.on('bufferend', function () {
    //console.log('bufferended the video!');
    if (isFirstTime) {
        player.pause();
        var vimeoVideo = document.getElementById('vimeo-video');
        vimeoVideo.style.opacity = ".7";
        resizeContainerElements();
        isFirstTime = false;
        showElementsContaineronPause();
        player.setMuted(false);

    }
    

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

    var percentage = (getAll.percent * 100) + "%"
    var pp = document.getElementById("progressBuffered");
    pp.style.width = percentage;
    // console.log(percentage);

});
player.on('timeupdate', function (getAll) {
    currentPos = getAll.seconds; //get currentime
    vdoEndTym = getAll.duration; //get video duration
    percentage = (getAll.percent * 100) + "%";
    seconds = getAll.seconds;
    durationVideo=vdoEndTym;
    
    currentTimePercent = getAll.percent;


    var ctn = document.getElementById("time-counter");
    ctn.innerHTML = format(seconds) + " / " + format(vdoEndTym);
    var pp = document.getElementById("progressPlayed");
    // pp.style.width = percentage;

    document.getElementById("customRange1").value = "" + (getAll.percent * 100);
    setCustomRangeColor(getAll.percent * 100);
    /*
    if(seconds==durationVideo){
        console.log("update:  video ended");
        
    }*/

});





/*   END------------> PLAYER <---------------    */


var range = document.getElementById("customRange1");

var d = 0.0;

var countIfPause=true;
var OldValue=range.value;
var lockRange=false;
 

range.addEventListener('input', function () {
  
    if(range.value>OldValue){
       //console.log("vaPaderecha");
       manageInconPlay('derecha');
        
       if(!youCanGoFF){
            lockRange=true;
           
            console.log("no puedes adelantar");
       }
    }
    if(range.value<OldValue){
       // console.log("vaPaIzquierda");
       manageInconPlay('izquierda');
       
        if(!youCanGoRW){
            lockRange=true;
     
            console.log("no puedes atrasar");
        }
     }
    userIsMovingProgress=true;

    var percent = range.value;   
    var newTime = (percent * durationVideo) / 100;

    //console.log(percent + "  -  new val: " + newTime);

    var pp = document.getElementById("progressPlayed");
    // pp.style.width = percent+"%";



    var ctn = document.getElementById("time-counter");
    ctn.innerHTML = format(newTime) + " / " + format(durationVideo);
    ctn.style.fontSize = '2.5vw';

    var value = (this.value - this.min) / (this.max - this.min) * 100;
    setCustomRangeColor(value);
    showElementsContaineronPause();
    if(percent==this.max){
        newTime=durationVideo-0.5;
        manageEnd();
     }
    
    if(isPlaying && !lockRange){
    player.setCurrentTime(newTime);
    
    }
        lockRange=false;
       
    
    //console.log('custom range: is pause?: '+isPaused);
   // oldValue=currentTimePercent * 100;
   OldValue = range.value;

}, false);

var oldRangeValue = range.value;
var oldRangevalueOnPlay = currentTimePercent;
var lockRangeOnPause = false;


range.addEventListener('change', function () {
 

    var ctn = document.getElementById("time-counter");
    ctn.style.fontSize = '1.8vw';
    userIsMovingProgress =false;
   console.log("pregress: inputchange");

 
    
    var percent = range.value;
    var newTime = (percent * durationVideo) / 100;
    if(percent==this.max){
        newTime=durationVideo-0.5;
        manageEnd();
     }

     if(range.value>oldRangeValue){
        //console.log("vaPaderecha");
       
        oldRangeValue=range.value;
        if(!youCanGoFF){
            lockRangeOnPause=true;
            
             console.log("pause: no puedes adelantar");
        }
     }
     if(range.value<oldRangeValue){
        // console.log("vaPaIzquierda");
       
        oldRangeValue=range.value;
         if(!youCanGoRW){
            lockRangeOnPause=true;
      
             console.log("pause: no puedes atrasar");
         }
      }


      console.log(oldRangeValue);
    if( isPaused && !lockRangeOnPause){
    player.setCurrentTime(newTime);
    }else{
        if(!isPlaying){
        range.value = "" + (currentTimePercent * 100);
        setCustomRangeColor(currentTimePercent * 100);
        lockRangeOnPause=false;
       oldRangeValue=currentTimePercent * 100;
       
        }
    }
    
     

 

    if(isPaused){
      manageInconPlay('pause');
    }

    if(isPlaying){
        manageInconPlay('play');
       
      }
      if(isEnded){
        manageInconPlay('end');
      }

   onMove();
   isFirstTimeInPause=true;
   OldValue=currentTimePercent*100;
}, false);

range.addEventListener('mousedown', function () {
    userIsMovingProgress =true;
   showElementsContaineronPause();

   console.log("is pAused?"+isPaused);



}, false);

range.addEventListener('mouseup', function () {
    userIsMovingProgress =false;
    
   onMove();
}, false);


function setCustomRangeColor(value) {
    var CustomRange = document.getElementById("customRange1");

  //  CustomRange.disabled = true;

    var color1 = '#ffffff9a';
    var color2 = 'rgba(255, 255, 255, 0.116)';

    CustomRange.style.background = 'linear-gradient(to right, ' + color1 + '  0%, ' + color1 + ' ' + value + '%, ' + color2 + ' ' + value + '%, ' + color2 + ' 100%)';

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

    x.style.height = "" + (videoH / videoW) * 100 + "vw";
    x.style.maxWidth = "" + (videoW / videoH) * 100 + "vh";

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
        vimeoVideo.style.opacity = "1";
    }
    var element = document.getElementById('containerElements');

    var styles = window.getComputedStyle(element);
    var cursor = (styles.getPropertyValue('cursor'));

    var ppbutton = document.getElementById('playpause-button');
    var dateTitle = document.getElementById('dateTitle');



    if (showingElements) {


        if (isPaused) {

            hideElementsContaineronPlay();
            player.play();

            ppbutton.innerHTML = "PLAY&#9658";
            dateTitle.innerHTML = datetit + "&#9658";

            vimeoVideo.style.opacity = "1";
            isFirstTimetoHide = false;

            timer = 0;
        } else if(isPlaying) {
            showElementsContaineronPause();
            player.pause();
            ppbutton.innerHTML = "PAUSED";
            vimeoVideo.style.opacity = ".5";
            dateTitle.innerHTML = datetit;

        }else if(isEnded){
            
            hideElementsContaineronPlay();
            player.setCurrentTime(0);
            player.play();

            ppbutton.innerHTML = "PLAY&#9658";
            dateTitle.innerHTML = datetit + "&#9658";

            vimeoVideo.style.opacity = "1";
            isFirstTimetoHide = false;
               
        }
    } else {
        onMove();
    }
}

function manageInconPlay(cual){
    var ppbutton = document.getElementById('playpause-button');
    if(cual == 'derecha'){
        ppbutton.innerHTML = "FF &#9658&#9658";
    }

    if(cual == 'izquierda'){
        ppbutton.innerHTML = "&#9668&#9668 REW";
    }

    if(cual == 'play'){
        ppbutton.innerHTML = "PLAY&#9658";
    }
    if(cual == 'pause'){
        ppbutton.innerHTML = "PAUSED";
    }
    if(cual == 'end'){
        ppbutton.innerHTML = "&#x21ba";
    }

}
function manageEnd(){
    var vimeoVideo = document.getElementById('vimeo-video');
    var ppbutton = document.getElementById('playpause-button');
    var dateTitle = document.getElementById('dateTitle');
    
    ppbutton.innerHTML = "&#x21ba";
    vimeoVideo.style.opacity = ".5";
    dateTitle.innerHTML = datetit;
   
    showElementsContaineronPause();
    console.log("i am ended");
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
var justone = 0;

var firstcX = 0;
var firstcY = 0;

var cX = 0;
var cY = 0;

document.getElementById('containerElements').addEventListener('mousemove', e => {

    cX = e.clientX;
    cY = e.clientY;

    if (firstcX != cX || firstcY != cY) {
        //console.log(">>>>mousemov: someone is moving the cursor");
        firstcX = cX;
        firstcY = cY;
    } else {

    }

    // console.log(e.clientX); 
    if(!userIsMovingProgress){
    onMove();
}else{
    showElementsContaineronPause();
}


});





function onMove() {
    var elemntsContainer = document.getElementById("containerElements");
    var ppButton = document.getElementById("playpause-button");

//console.log("onMove: user is moving? " +userIsMovingProgress);
    justone++;
    if (justone == 1 || userInMobile) {
        console.log(">>>>>>>>>>>>>>>>>>fisrt move");
        showElementsContainerOnMove(true);

         
        timer = 3000;

        if(!userIsMovingProgress){

        clearTimeout(timeout);
        timeout = setTimeout(function () {
    
            console.log(">>>>>>>>>>>>>>>>>>>>>>chao");
            showElementsContainerOnMove(false);
            justone = 0;
        }, timer);
    }

    }

    
}



function showElementsContainerOnMove(show) {

    if (isFirstTimetoHide) {
        show = true;
    }



    if ((!isPaused || isFirstClick) && !isEnded) {
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

    showingElements = false;
    //console.log("hiden");
}

function showElementsContaineronPause() {

    var elemntsContainer = document.getElementById("containerElements");
    var ppButton = document.getElementById("playpause-button");

    elemntsContainer.style.opacity = "1";
    //document.body.classList.add('block');
    //document.body.click();

    showingElements = true;
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
    } else if (elem.webkitRequestFullscreen) {
        /* Safari */
        elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) {
        /* IE11 */
        elem.msRequestFullscreen();
    }
    document.getElementById("fullscreen-icon2").style.opacity = "1";
    document.getElementById("fullscreen-icon").style.opacity = "0";
}

/* Close fullscreen */
function closeFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
        /* Safari */
        document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
        /* IE11 */
        document.msExitFullscreen();
    }
    document.getElementById("fullscreen-icon").style.opacity = "1";
    document.getElementById("fullscreen-icon2").style.opacity = "0";
}




/*  >>>>>>>>>> end     FULL SCREEN   <<<<<<<<< */



function vhsBlur(timerD) {
    document.body.style.color = "#eee";
    document.body.style.textShadow = "0.06rem 0 0.06rem #ea36af, -0.125rem 0 0.06rem #75fa69";
    document.body.style.animationDuration = timerD;
    document.body.style.animationName = "textflicker";
    document.body.style.animationIterationCount = "infinite";
    document.body.style.animationDirection = "alternate";

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
    ret += "" + (mins < 10 ? "0" : "") + mins + ":" + (secs < 10 ? "0" : "");
    ret += "" + secs;

    return ret;
}




/**   >>>>>> atajos de teclado  */


window.addEventListener('keydown', e => {
    console.log(e.code);
    if (e.code == "Space") {
        if (isPaused) {
            player.play();
            hideElementsContaineronPlay();
        } else {
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




   
   
   function isMobile(){
   
     var badScreen = false;
   if (screen.width <= 699) {
   console.log("the scren is too small");
    badScreen= true;
   }
   
     var mobileNav=false;
   if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
      console.log('Esto es un dispositivo móvil');
     mobileNav=true;
     console.log("this is a mobile browser");
   }
     
     if(badScreen||mobileNav){
       return true;
     }else{
       return false;
     }
   }