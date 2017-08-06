 // nameSpace
var MUSHINMAIN = MUSHINMAIN ||{};
	MUSHINMAIN.console ={
		debug: function(msg){ console.log(msg); }
	}
//footer canvas socialmedia links
var ftCvs = document.getElementById("ftFade");
var ftCtx = ftCvs.getContext("2d");
// window sections
var mountainTabs = [];
var shiftCount=0;
var switchLayer;// the layer the ACTIVE WINDOW goes to
var switchPos;// Position The NEW LAYER Stops at
var hasSwitched = false;
// Client Browser details
var bod =$('body');
var clientBrowser = navigator.javaEnabled();
var clientView;
var clientScreenX = screen.width;
var clientScreenY = screen.height;
var winSizeX = window.innerWidth;
var winSizeY = window.innerHeight;
var curntTime = new Date(); 

//alert(clientBrowser);
// global
var curntSect= "BLOG";
var globalSwitch;
//skyBGCanvas
var skyBGcvas = document.createElement("canvas");
var skyCxt = skyBGcvas.getContext("2d"); 
skyBGcvas.id = "skyBG";
var clds =[]; 
//blog Members
var blogCon; 
var blogs =[];
var bIndex= 0;

//game gallery members
var gamesLib ;
var games =[] ;  // <game> objects
var gamesDex = 0;
var thumbsWrapper =document.createElement("div");	
var con = document.createElement("div");
var descriptBox = document.createElement("div");	
var media = [];
var showDescript= false;
var curntLoc = 0; // on slide location
var gWidth = 500;
var gHeight = 300;
var mediaTitle;
var mediaContent=[];
var mediaIndex = 0;
/// art GAllery members
var galleryType ={numOfPics: 0,catigory:" ",picIndex:0 };
/// global members
var isActiveShifting = false;
//Mushin Data Library 
var xmlDoc;
	
function loadXml(file){
	var xmlhttp;
		
	if (window.XMLHttpRequest)
	  {// code for IE7+, Firefox, Chrome, Opera, Safari
		xmlhttp= new XMLHttpRequest();
	  }
	else
	  {// code for IE6, IE5
		xmlhttp= new ActiveXObject("Microsoft.XMLHTTP");
	  }
	
	xmlhttp.open("GET",file,false);
	xmlhttp.send();
	xmlDoc = xmlhttp.responseXML; 
}	

$(document).ready(function(){

	loadXml("mushinLib.xml");
	$(window).resize(function(){ winResize(); });
	
	footObj = new footerGradiant();
	mountainTabs.push(new sectWindow("ANIMATION",mountainTabs.length,0,245,680,"linkPeakSampANI.png","anisect.png","rgb(229,247,248)",false));
	mountainTabs.push(new sectWindow("GAMES",mountainTabs.length,0,265,240,"linkPeakSampGAM.png","gamesect.png","rgb(209,238,251)",false));
	mountainTabs.push(new sectWindow("ART",mountainTabs.length,0,290,5,"linkPeakSampART.png","artsect.png","rgb(151,219,251)",false));
	mountainTabs.push(new sectWindow("BLOG",mountainTabs.length,0,310,(window.innerWidth/2),"linkPeakSamp.png","MUlogo2.png","rgb(092,181,222)",true));
	changeContent("BLOG",3);	
	
	for(var i = 0;i < (Math.random()*11)+3; i++){
		clds.push(new clouds(Math.random()*600,(Math.random()*180)+90,"white",(Math.random()*200)+80,Math.random()*10,Math.random()*3));
	}
	var s = new sunMoon(80,100);
	bod.append(skyBGcvas);
	skyBGcvas.width =window.innerWidth; 
	skyBGcvas.height=window.innerHeight;
	
	update();

	//MUSHINMAIN.console.debug();
});	

function update(){
	skyCxt.clearRect(0,0,skyBGcvas.width,skyBGcvas.height);
	winSizeX = window.innerWidth;
	winSizeY = window.innerHeight;
	skyBGcvas.width =window.innerWidth; 
	skyBGcvas.height=window.innerHeight;
	
	for(var i=0;i<mountainTabs.length;i++){
		mountainTabs[i].update();

		if(isActiveShifting){
			if(shiftCount == 2){
				isActiveShifting = false;
				shiftCount=0;
			}
		  }
	}
	footerGradiant();
	//curntTime.toLocaleTimeString();
	// Change sky bg based on time
	mushinSky("rgb(204,229,254)");
	if(curntSect == "ART")
		picUpdate();
	for(var i=0;i<clds.length;i++){
		clds[i].cloudUpdate();
	}
	window.requestAnimationFrame(update);
}
// scale sections
function winResize(){
	winSizeX = window.innerWidth;
	winSizeY = window.innerHeight;

	//resize for MOBILE

	//MUSHINMAIN.console.debug(winSizeX+"x"+winSizeY);
}

function footerGradiant(){
	$("#footerFade").css({"top":winSizeY*0.90,"width":window.innerWidth});
	ftCvs.width = window.innerWidth;
	ftCvs.height = 200;
	var grad1 = ftCtx.createLinearGradient(0,0,0,70);
	grad1.addColorStop(0,"rgba(255,255,255,0)");
	grad1.addColorStop(0.5,"rgba(255,255,255,0.5)");
	grad1.addColorStop(1,"rgba(255,255,255,1)");
	ftCtx.fillStyle=grad1;
	ftCtx.fillRect(0,0,window.innerWidth,600);
	
	ftCtx.fillStyle="#00255a";
	ftCtx.fillText("Mushin Works copyright (c) 2017",0,80);
}

// mountain link tabs and content
function sectWindow(linkID,layer,xPos,yPos,linkPosX,linkPeaksrc,linkHeadsrc,color,active){
	//objects
	var thisObj = this;
	
	this.sectWrapper = document.createElement("div");
	this.sectCon = document.createElement("div");// sections content
	this.linkPeakWrapper = document.createElement("div");
	this.linkHeaderWrapper= document.createElement("div");
	this.linkheader = document.createElement("img");
	this.sectHeader = document.createElement("div");
	this.subSectHeader = document.createElement("div");
	this.linkPeaksrc = linkPeaksrc; 
	//ids 
	this.sectWrapper.id = linkID;
	this.sectCon.id= linkID+"content";
	this.linkPeakWrapper.id = linkID+"link";
	this.linkHeaderWrapper.id =linkID+"linkHEAD";
	this.sectHeader.id = "sectionTitle";

	this.mountID = layer;
	this.linkheader.src ="gfx/"+linkHeadsrc;
	this.layer = layer;
	this.xPos = xPos;
	this.yPos = yPos;
	this.targetYpos = yPos;
	this.yVel=0;
	this.linkPosX = linkPosX;
	this.iniColorR= color[4]+color[5]+color[6];
	this.iniColorG= color[8]+color[9]+color[10];
	this.iniColorB= color[12]+color[13]+color[14];
	this.colorChannel = [this.iniColorR,this.iniColorG,this.iniColorB,0];
	this.color = "rgb("+this.colorChannel[0]+","+this.colorChannel[1]+","+this.colorChannel[2]+")";
	this.activeWin= active;
	this.isShifting= false;
	this.isShiftingBack = false;
	this.isSelected = false;
	this.alpha = 1.0; //(this.layer/6)+0.5;
	this.blurFactor;
	this.linkHeaderWrapper.append(this.linkheader);
	this.bgTexture = "gfx/"+linkID+"Text.png"
	bod.append(this.sectWrapper);
	bod.append(this.sectCon);
	bod.append(this.linkPeakWrapper);
	bod.append(this.linkHeaderWrapper);
	//bod.append(this.peaks);
	
	$("#"+this.sectWrapper.id).css({"position":"absolute","overflowY":"auto","borderRadius":"12","top":"250px","left":"0px","width":"100%","height":"100%","backgroundImage":"url("+this.bgTexture+")","backgroundRepeat":"repeat-x"});
	$("#"+this.sectCon.id).css({"position":"absolute","borderRadius":"12","top":"250px","left":"0px","width":"100%","height":"49%"});
	$("#"+this.linkPeakWrapper.id).css({"position":"absolute","borderRadius":"12","zIndex":this.layer});
	this.linkPeakWrapper.innerHTML="<img src='gfx/"+this.linkPeaksrc+"'/>"
	$("#"+this.linkHeaderWrapper.id).css({"position":"absolute","zIndex":10,"opacity":"0"});

	this.linkPeakWrapper.onmouseover = function(){ $("#"+thisObj.linkHeaderWrapper.id).css({"opacity":"1","cursor":"pointer"}); $("#"+thisObj.linkPeakWrapper.id).css("cursor","pointer")};
	this.linkPeakWrapper.onmouseout = function(){$("#"+thisObj.linkHeaderWrapper.id).css({"opacity":"0"})};

	$("#"+this.linkPeakWrapper.id).click(function(){ if(!isActiveShifting && !thisObj.activeWin){globalSwitch = true; isActiveShifting = true; thisObj.isShifting = true; switchLayer= thisObj.layer; switchPos = thisObj.targetYpos;}});
};

sectWindow.prototype.update = function(){
	this.color = "rgb("+this.colorChannel[0]+","+this.colorChannel[1]+","+this.colorChannel[2]+")";
	
	$("#"+this.sectWrapper.id).css({"top":this.yPos,"left":this.xPos,"zIndex":this.layer,"opacity":this.alpha,"filter":"blur("+this.blurFactor+"px)"});
	$("#"+this.sectCon.id).css({"top":this.yPos+90,"left":this.xPos,"zIndex":this.layer+1,"opacity":this.alpha});
	$("#"+this.linkPeakWrapper.id).css({"top":this.yPos-75,"left":this.linkPosX,"zIndex":this.layer,"opacity":this.alpha,"filter":"blur("+this.blurFactor+"px)" });
	$("#"+this.linkHeaderWrapper.id).css({"top":this.yPos-210,"left":this.linkPosX+50,"zIndex":10});
	
	
	if(this.layer == 0)
		this.blurFactor = 3;
	if(this.layer == 1)
		this.blurFactor = 2;
	if(this.layer == 2)
		this.blurFactor = 1;
	if(this.layer == 3)
		this.blurFactor = 0;

	if(this.isShifting)
		this.shift();

	if(this.isShiftingBack)
		this.shiftBack();

	if(this.activeWin){
		// if active it shifts downward
	 	if(globalSwitch)
	 		this.isShifting = true;
	 		globalSwitch = false;
		}
	};

sectWindow.prototype.shift= function(){
	this.yVel += 0.4;
	if (this.yPos < window.innerHeight) {
		this.yPos += this.yVel;
		this.alpha -= 0.02;
	}
	else{
		this.yVel = 0;	
		this.isShifting= false;
		this.cleanContent();
		this.changeLayer();
	}
};

sectWindow.prototype.shiftBack= function(){
 	this.yVel-= 0.4;
	if (this.yPos > this.targetYpos) {
		this.yPos += this.yVel;
		this.alpha+=0.02;
	}
	else {
		this.yVel=0;
		this.alpha=1.0;
		this.isShiftingBack = false;
		shiftCount++;
	}
};

sectWindow.prototype.changeLayer= function(){

	if(this.activeWin){
		this.targetYpos = switchPos;
		this.layer = switchLayer;
		this.activeWin= false;
	}
	else{
		changeContent(this.sectWrapper.id);
		this.targetYpos = 310;
		this.layer = 3;
		this.activeWin= true; 
	}
	this.isShiftingBack=true;
};
sectWindow.prototype.cleanContent= function(){
	$("#"+this.sectWrapper.id).empty();
	$("#"+this.sectCon.id).empty();
};

sectWindow.prototype.createBlog = function(){

	blogCon = xmlDoc.getElementsByTagName("journal");
	for(var i=0;i < blogCon[0].childNodes.length;i++){

	if(blogCon[0].childNodes[i].nodeType == 1){
		blogs[bIndex] = blogCon[0].childNodes[i];
		bIndex++;
		}
	}

	createPost(0,"gfx/7_13_15.png");
	createPost(1,"gfx/errorWheel.png");
	createPost(2,"gfx/MULogo.png");
};

sectWindow.prototype.createGames = function(){

	$("#"+this.sectCon.id).append("<div id='gameSect' class='container'><div class='row'> <div class='col-md-12' style='height:40px;'></div> </div> ");

	 loadGameGallery();
};
sectWindow.prototype.createArts =function(){

	$("#"+this.sectCon.id).append("<div id='galBody'  class='container' style='padding:60px;'></div>");

	$("#galWrapper").css({"position":"absolute","left":"5%","width":"100%","height":"300px"});

	loadGallery();
};

sectWindow.prototype.createAnimate = function(){


};
//create Blog Post
function createPost(blogDex,tPicSrc){
	
	var blogTitle= blogs[blogDex].childNodes[1].childNodes[0].nodeValue;
	var blogDateMonth = blogs[blogDex].childNodes[3].childNodes[1].childNodes[0].nodeValue;
	var blogDateDay = blogs[blogDex].childNodes[3].childNodes[3].childNodes[0].nodeValue;
	var blogDateYear = blogs[blogDex].childNodes[3].childNodes[5].childNodes[0].nodeValue;
	var blogBody = blogs[blogDex].childNodes[5].childNodes[0].nodeValue;
	var topPic = tPicSrc;
	$("#BLOGcontent").append("<div id='bBody' class='container'> <div class='row'> <div class='col-md-12'><h1 class='blogHead'>"+blogTitle+ "<br/> <div class='blogDate'> "+blogDateMonth+"/"+ blogDateDay+"/"+blogDateYear +"</div> </div> </div> <div class='row'><div class='col-md-4'></div><div class='col-md-8'> <img class='img-responsive' src='"+topPic+"'/> </div><div class='row'> <div class='col-md-10 blogBody' >"+blogBody+" </div><div col  </div> </div> </div> </div>");
}

// Gallery functions
function loadGallery(){
	
	$("#galWrapper").empty();

	galleryType.picIndex = 0;

	for(var numofCats = 3;galleryType.picIndex < numofCats ;galleryType.picIndex++){
		if(galleryType.picIndex == 0){
		galleryType.catigory = 'ORIGINAL';	
		galleryType.numOfPics = 10;
		}
	else if(galleryType.picIndex == 1){
		galleryType.catigory = 'SKETCHES';
		galleryType.numOfPics = 50;
	}
	else if(galleryType.picIndex = 2){
		galleryType.catigory = 'FANART';
		galleryType.numOfPics = 5;
	}
	else if(galleryType.picIndex = 3){
		galleryType.catigory = 'PIXELART';
		galleryType.numOfPics = 5;
	}

		$("#galBody").append("<div class='row'><div class='col-md-12' > <p class ='catTop'>"+galleryType.catigory+"</p> </div></div> <div class='row'><div class='col-md-12' id='gal"+galleryType.picIndex+"'></div></div>")

		for(var catPicIndex = 0; catPicIndex < galleryType.numOfPics;catPicIndex++){
			$("#gal"+galleryType.picIndex).append("<img style='padding:4px; filter:drop-shadow(4px 4px 3px #444444);' id='"+galleryType.catigory+catPicIndex+"' onmouseOver='picHilight( &quot;"+galleryType.catigory+"&quot;,"+catPicIndex+");' onclick='showFocusPic( &quot;"+galleryType.catigory+"&quot;,"+catPicIndex+");' src='content/art/"+galleryType.catigory+"/THUMBS/"+catPicIndex+".png'/>");
		}
	}
}

function picHilight(cat,thmID){
	
	$("#"+cat+thmID).css("cursor","pointer");

}
function showFocusPic(cat,picID){
	
	var image = new Image();
	var curntDex = picID;

	image.onload= function(){
		sPicW = image.width;
		sPicH = image.height; 
	}
	image.onprogress= function(){
		image.src = 'gfx/loadWheel.png';
	} 
	image.onerror= function(){
		image.src = 'gfx/errorWheel.png';
	}

	image.src = 'content/art/'+cat+'/'+picID+'.png';

	bod.append("<div id='focusPicBG' onclick='clearPic();'> </div>");
	
	bod.append("<div id='focusPic'> <img class='img img-responsive' id='shownPic' onclick='clearPic();' src= '"+image.src+"'/> </div>");
		bod.append("<div id='prevArrow' onclick='prevPic();'> </div>");
		bod.append("<div id='nextArrow' onclick='nextPic();'> </div>");
	
		$("#prevArrow").css({"position":"fixed","top":"50%","width":"60px","height":"60px","borderRadius":"20px","border":"4px solid #1f58cb","background-color":"white","z-index":"12"});
		$("#nextArrow").css({"position":"fixed","top":"50%","right":"0","width":"60px","height":"60px","borderRadius":"20px", "border":"4px solid #1f58cb","background-color":"white","z-index":"12"});
		
		$("#focusPicBG").css({"position":"fixed","top":"0px","left":"0px","background-Color":"#333333","opacity":"0.9","width":"100%","height":"100%","z-index":"11"});
		$("#focusPic").css({"position":"absolute","top":"4px","left":(winSizeX/2) - ($("#shownPic").width() /2),"z-index":"12"});
	
		$("#prevArrow").mouseover();
		$("#prevArrow").mouseout();	
		$("#nextArrow").mouseover();
		$("#nextArrow").mouseout();	
		
		bod.keypress(function(ke){
			if(ke.key== "ArrowRight")
				nextPic();
			if(ke.key== "ArrowLeft")
				prevPic();
		});
}
function prevPic(){
		if(curntDex-1 >= 0){
			curntDex--;
			document.getElementById("shownPic").src="content/art/"+galleryType.catigory+"/"+curntDex+".png";
		}
}
function nextPic(){
		if((curntDex+1) < galleryType.numOfPics){
			curntDex++;
			document.getElementById("shownPic").src="content/art/"+galleryType.catigory+"/"+curntDex+".png";
		}		
}
function picUpdate(){

	var center = (winSizeX / 2 ) - ($("#shownPic").width() /2);
	$("#focusPic").css("left", center);
}
function clearPic(){
	$("#focusPicBG").remove();
	$("#focusPic").remove();
	$("#shownPic").remove();
	$("#prevArrow").remove();
	$("#nextArrow").remove();
	$("#focusCon").remove();// GAMES SECTION
	
	//$("#pageIndex").remove();
	//$("#mediaTitle").remove();
	//$("#mediaStack").remove();
	//$("#mediaLink").remove();
	//$("#mediaSummary").remove();
	bod.unbind();
}
// Game Gallery
function loadGameGallery(){
	gamesLib = xmlDoc.getElementsByTagName("games");
	gamesDex =0;

	for(var i = 0;i < gamesLib[0].childNodes.length;i++){
	
		if(gamesLib[0].childNodes[i].nodeType == 1){
			games[gamesDex] = gamesLib[0].childNodes[i];
			gamesDex++; 
		}
	}
	// add thumbs
	for(var j = 0;j < games.length;j++)
		$("#gameSect").append("<img id='gm"+j+"' style='padding:5px;filter:drop-shadow(4px 4px 3px #444444);' onmouseover=' hoverOverlay("+j+")' onmouseout=' hoverOverlayOut("+j+")'onclick='focusGame("+j+");'  src='"+games[j].childNodes[3].childNodes[0].nodeValue+"' width='550px' height='300px'/>");	
}

function hoverOverlay(selectID){
	var overlay = document.createElement("div");

	$("#gm"+selectID).css("cursor","pointer");
	$("#gm"+selectID).css("opacity","0.2");
}

function hoverOverlayOut(selectID){

	$("#gm"+selectID).css("opacity","1.0");
	$("#gm"+selectID).css("border","0px solid");
}

function focusGame(gId){

	bod.append("<div id='focusPicBG' onclick='clearPic();'> </div>" );
	bod.append("<div id='focusCon' class='container'> </div>");
	$("#focusCon").css({"position":"fixed","z-index":"12","color":"#FFFFFF"});
	$("#focusPicBG").css({"position":"fixed","top":"0px","left":"0px","background-Color":"#000000","opacity":"0.9","width":"100%","height":"100%","z-index":"11"});
	var mediaCap;
	var mediaType = games[gId].childNodes[5].childNodes[1].getAttribute("type");
	var mediaCon = games[gId].childNodes[5].childNodes[1].childNodes[0].nodeValue;

	if(mediaType == "pic"){
		mediaCap = "<img src='"+mediaCon+"' />"
	}
	else if (mediaType == "vid"){
		mediaCap = "<video src='"+mediaCon+"'></video>"
	}
	else if	(mediaType == "flash"){
		var mediaW = games[gId].childNodes[5].childNodes[1].getAttribute("width");
		var mediaH = games[gId].childNodes[5].childNodes[1].getAttribute("height");
		mediaCap = "<embed src='"+mediaCon+"' height='"+mediaH+" ' width='"+mediaW+" ' ></embed>"
	}

	$("#focusCon").append("<div class='row'><div class='col-md-3'></div> <div style=' border:1px solid #FFFFFF;' id='featMedia' class='col-md-6'>"+ mediaCap +" </div><div class='col-md-3'></div> </div><div class='row'><div style='border:1px solid #FFFFFF;'id='Gsummary' class='col-md-9'><h2>Summary</h2> "+games[gId].childNodes[7].childNodes[1].childNodes[0].nodeValue+" </div> <div style='border:1px solid #FFFFFF;'id='GdLoad' class='col-md-3'><h2>Download</h2><a href="+games[gId].childNodes[9].childNodes[3].childNodes[0].nodeValue +" target='blank'> <h2>"+ games[gId].childNodes[9].childNodes[1].childNodes[0].nodeValue+"</h2></a></div></div>");
}
function browseMediaStack(){} // On a focused image click through to view more screenshots or video content. 

function changeContent(newSect){
	curntSect= newSect;

	if(newSect == "BLOG")
	{
		mountainTabs[3].createBlog(); 
	}
	if(newSect == "ART")
	{
		mountainTabs[2].createArts();
	}
	if(newSect == "GAMES")
	{
		mountainTabs[1].createGames();
	}
	if(newSect == "ANIMATION")
	{
		mountainTabs[0].createAnimate();
	}
}

// visual Effects
function mushinSky(color){
	$("#skyBG").css({"position":"fixed","height":winSizeY,"width":winSizeX,"zIndex":"-2"});
	skyBGcvas.width = window.innerWidth;
	skyBGcvas.height = window.innerHeight;

	var iniColorR= color[4]+color[5]+color[6];
	var iniColorG= color[8]+color[9]+color[10];
	var iniColorB= color[12]+color[13]+color[14];
	var colorChannel = [iniColorR,iniColorG,iniColorB,0];
	color = "rgb("+colorChannel[0]+","+colorChannel[1]+","+colorChannel[2]+")";

	var grad1 = skyCxt.createLinearGradient(0,600,0,10);
	grad1.addColorStop(0,"rgba(255,255,255,0)");
	grad1.addColorStop(1,color);
	skyCxt.fillStyle=grad1;
	skyCxt.fillRect(0,0,window.innerWidth,600);
	
}
function clouds(xPos,yPos,color,size,layer,spd){
	this.xPos = xPos;
	this.yPos = yPos;
	this.size = size;
	this.spd = spd;
	this.cloudWrapper= document.createElement("div");
	this.cloudWrapper.id = "clouds";
	this.layer = Math.ceil((Math.random()*5)- 1);
	bod.append(this.cloudWrapper); 
	this.cloudWrapper.style.position = "absolute";
	this.cloudWrapper.style.backgroundColor ="#FFFFFF";
	this.cloudWrapper.style.borderRadius = 20+"px";
	this.cloudWrapper.style.top = yPos+"px";
	this.cloudWrapper.style.left = xPos+"px";
	this.cloudWrapper.style.width = size+"px";
	this.cloudWrapper.style.height = 21+"px";
	this.cloudWrapper.style.zIndex = layer;
	this.cloudWrapper.style.opacity = 0.7;
	
}
// add functionality later >_0 
function sunMoon(xPos,yPos){ 
	this.xPos = xPos;
	this.yPos = yPos;
	this.SunMoonWrapper = document.createElement("div");
	this.SunMoonWrapper.id = "sunMoon";
	bod.append(this.SunMoonWrapper); 

	this.SunMoonWrapper.style.position = "absolute";
	this.SunMoonWrapper.style.backgroundColor ="#fbffd0";
	this.SunMoonWrapper.style.borderRadius = 100+"%";
	this.SunMoonWrapper.style.top = yPos+"px";
	this.SunMoonWrapper.style.left = xPos+"%";
	this.SunMoonWrapper.style.width = "90px";
	this.SunMoonWrapper.style.height = 90+"px";
	this.SunMoonWrapper.style.zIndex = -1;
}
sunMoon.prototype.sunMoonUpdate= function(){

4
}

clouds.prototype.cloudUpdate= function(){
	var resetPos = -this.size; 

	if(this.xPos <= resetPos){
		this.xPos = (window.innerWidth);
		this.yPos = (Math.random()*290)+90;
		this.layer = Math.ceil((Math.random()*5)- 1);
		this.spd= Math.random()* 3;
		this.cloudWrapper.style.height = Math.ceil(Math.random()*30)+"px";
	}

	else
		this.xPos -= this.spd;

	this.cloudWrapper.style.left = this.xPos+"px";
	this.cloudWrapper.style.top = this.yPos+"px";
	this.cloudWrapper.style.zIndex = this.layer;

}; 