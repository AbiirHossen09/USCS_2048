// object.watch
if (!Object.prototype.watch) {
	Object.defineProperty(Object.prototype, "watch", {
	  	enumerable: false, 
	  	configurable: true, 
	  	writable: false, 
	  	value: function (prop, handler) {
			var oldval = this[prop], 
				newval = oldval, 
				getter = function () { return newval; }, 
				setter = function (val) {
					oldval = newval;
					return newval = handler.call(this, prop, oldval, val);
				};
			
			if (delete this[prop]) { // can't watch constants
				Object.defineProperty(this, prop, {
					  get: getter, 
					  set: setter, 
					  enumerable: true, 
					  configurable: true
				});
			}
		}
	});
}

// set HTML element global variables
var container	= document.getElementById('container'),
	logo		= document.getElementById('logo'),
	logo0		= document.getElementById('logo0'),
	frame1		= document.getElementById('frame1'),
	frame1_headline		= document.getElementById('frame1_headline'),
	frame1_img	= document.getElementById('frame1_img'),
	frame2		= document.getElementById('frame2'),
	frame5		= document.getElementById('frame5'),
	frame5_img		= document.getElementById('frame5_img'),
	ctaBox		= document.getElementById('ctaBox'),
	block_click = false,
	products_info = [],
	delayTime = 2.8,
	isError = false,
	carousel_speed = 0.35,
	car_here = false,
	bus_here = false,
	feedresponse_has_fired = false,
	refire = true,
	endCarouselActive = true,
	checkTimer,
	clickerDrag = .05;

	Ad = {

		/*
		 *  Ad and image sizes.  Just change these numbers to update the ad.
		 */
		WIDTH      : 970,
		HEIGHT 	   : 250,
		IMG_HEIGHT : 155,
		IMG_WIDTH  : 155,

		LOADED : false, // ad status. do not change.


/*
 *  Initialize creative
 */
		init : function(){
			// build creative
			Ad.addElements();

			Ad.watch('LOADED', Ad.ready);

		},
		/*
		 *  Animate creative
		 */
		animate : function() {

			TweenMax.to(container, 0.3, {opacity: 1});
			
//			TweenMax.set(logo0, {scale: 1.5});

			if(isError){
				return;
			}

			container.classList.remove('hidden');
			logo0.classList.remove('hidden');
//			logo.classList.remove('hidden');
			frame2.classList.remove('hidden');
			
            TweenMax.set(["#arrow_leftOverlay", "#arrow_rightOverlay"], {
                display: "none" 
            });
            
            
			TweenMax.set(["#logo0", "#frame1_copyImg", "frame1_headline", "#frame1_copyImg"], {
				   rotation: 0.001
			 });
			
			function introFrame() {

				TweenMax.from(logo0, 0.5, {x: 401, y: -27, width:"200px", height: "120px", delay: 0.5});
				if(myFT.instantAds.F1_headline_copy_img.indexOf("blank") >= 0) {
					console.log("NO Frame 1 copy image");
					TweenMax.fromTo(frame1_headline, 2, {x: -10}, {x: 10, delay: 1, ease: Power0.easeNone});

				}
				else {
					TweenMax.fromTo(frame1_copyImg, 2, {x: -10}, {x: 10, delay: 1, ease: Power0.easeNone});
				}
				
				TweenMax.to(frame1_copyImg, 0.25, {opacity: 1, delay: 1});
				TweenMax.to(frame1_headline, 0.25, {opacity: 1, delay: 1});
				
				frame1.classList.remove('hidden');
			}

			/*  animate text in line by line  */
			function animateTextFrame (frame, animation, callback) {
				var frameText  = frame.childNodes[0].childNodes[0].childNodes,
					delay 	   = 1, // delay before showing first line
					lineCount  = 0;
				
				// animate each <span> in the frame
				for(var i = 0; i < frameText.length; i++){
					TweenMax.to(frameText[i], 0.3, {left: 0, right: 0, delay: delay, ease: Strong.easeInOut, onComplete: function() {
						lineCount++; // add one more line to the count
						 if(lineCount === frameText.length && frame.id === 'frame1_headline'){
							
							TweenMax.delayedCall(1.35,zoomOut);
							// logo.classList.remove('hidden');
							TweenMax.to(logo, .5,{opacity:1, ease: Strong.easeInOut,delay: 1.25})
						}
					}});
					delay += 0.4; // extend delay to add time between lines
				}
			}

			/*  animate text in line by line  */
			function zoomOut() {
				
				frame1.style.backgroundImage = 'none';
				frame1_img.style.backgroundImage = 'none';
				TweenMax.set([frame1,frame1_img],{transformOrigin:"50% 50%"});
				
				var tl = new TimelineMax();
				tl.addLabel("startProducts",.3);

				// tl.to([frame1, frame1_img],.75,{scaleX:.42,scaleY:.42,top:"+=143",left:"+=159", ease:  Strong.easeOut});//,onComplete:zoomIn});
				tl.to([frame1, frame1_img, frame1_headline],.20,{opacity:0,delay:.1});//,onComplete:zoomIn});

				TweenMax.delayedCall(.3,startClick);
				
				// tl.add(zoomIn,"startProducts");
				TweenMax.delayedCall(0,zoomIn);

			}
			
			function startClick() {
				 clickerDrag+=.0115;
				if(refire){
					var d = clickerDrag+.11;
					TweenMax.delayedCall(d,startClick);
				}

			}

			function zoomIn() {
				car_here = true;

				TweenMax.to([frame1,frame1_img],.15,{opacity:0,delay:.01});
				var fstProd = frame2.childNodes[0];
				// TweenMax.set(fstProd,{rotation:-60,scaleX:.98,scaleY:.98});rotation:0,scaleX:1,scaleY:1,
				TweenMax.to(fstProd,2.0,{opacity:1,ease:Circ.easeOut, delay:0,onComplete:function () {
					frame2.style.zIndex = "9";
					TweenMax.delayedCall(0.5,moveCarousel);

				}});
				// TweenMax.set(fstProd,{opacity:1,delay:0});
				TweenMax.to(carousel_mask, 0.2,{opacity:1, ease: Strong.easeInOut, delay:0.1});

				TweenMax.to([arrow_left, arrow_leftOverlay], 0.5, {opacity: 1, display:'block', left:'187px', ease: Strong.easeInOut, delay:0.1}); // slide in
				TweenMax.to([arrow_right, arrow_rightOverlay], 0.5, {opacity: 1, display:'block', right:'384px', ease: Strong.easeInOut, delay:0.1}); // slide in

			}

			function moveCarousel() {
				var carouselItems = frame2.childNodes,
					holdTime	  = .85,
					tl 			  = new TimelineMax(),
					id 			  = 1;
				TweenMax.set(carouselItems[1],{left:Ad.WIDTH,opacity:1,top:-90});

				tl.addLabel('firstOut',holdTime);
				tl.to(carouselItems[0],.35,{left:-Ad.WIDTH,ease:Strong.easeOut},'firstOut');
				tl.to(carouselItems[1],.35,{left:0,ease:Strong.easeOut},'firstOut');


				TweenMax.delayedCall(holdTime, function() {
					elm = products_info.shift();
					products_info.push(elm);
				});


				if( (carouselItems.length >2)){
					var tempNum = 2;
                    while(tempNum < carouselItems.length){
                        
                        holdTime+= 1.85;
                        TweenMax.set(carouselItems[tempNum],{left:Ad.WIDTH,opacity:1,top:-90});
                        tl.addLabel('secondOut',holdTime);
                        tl.to(carouselItems[tempNum-1],.35,{left:-Ad.WIDTH,ease:Strong.easeOut},'secondOut');
                        tl.to(carouselItems[tempNum],.35,{left:0,ease:Strong.easeOut},'secondOut');
                        tl.addLabel('secondOut',holdTime);	/**/
                        id = tempNum;
                        TweenMax.delayedCall(holdTime, function() {
                            elm = products_info.shift();
                            products_info.push(elm);
                        });	
                        tempNum++;	
                    }	
				}
				holdTime += 1.85;
				function frm5(){
						elm = products_info.shift();
						products_info.push(elm);

						car_here = false;
						bus_here = true;
						TweenMax.set([cta_reg,carousel_mask], {opacity:0, zIndex:1});

						TweenMax.delayedCall(1,animateTextFrame,[frame2,'slideUp',animateEndFrame]);
						TweenMax.delayedCall(.4,animateEndFrame);

				};/**/
				frm5.name = 'frm5';
				tl.addLabel("prodOut",holdTime);
				tl.to(carouselItems[id],1.3,{opacity:0,ease: Strong.easeOut},"prodOut"); //rotation:"+=65",left:"+=135"
				tl.add(frm5,'prodOut');

			}


			/*  animate final frame  */
			function animateEndFrame () {

				frame2.style.zIndex = "3";

				//ARROWS
				setTimeout(function(){
					TweenMax.to(arrow_left,.35,{left:"187px"});
					TweenMax.to(arrow_right,.35,{right:"384px"});
				}, 500)

				TweenMax.to(arrow_leftOverlay,.35,{opacity:0, display:'none'});
				TweenMax.to(arrow_rightOverlay,.35,{opacity:0, display:'none'});


				frame5.classList.remove('hidden');
				frame5_img.classList.remove('hidden');
				// ctaBox.classList.remove('hidden');
				ctaBox.style.display = 'block';

				arrow_left.style.display = "block";
				arrow_right.style.display = "block";


				var headline = frame5.childNodes[0],
					cta  	 = document.getElementById('cta_reg'),
					hover 	 = document.getElementById('cta_hover'),
					slide2,
					slide3;
				if(myFT.instantAds.F5_headline_copy_img.indexOf("blank") >= 0){
					legal    = frame5.childNodes[2];
				}else{
					legal    = frame5_img.childNodes[2];
				}
				TweenMax.set([cta,headline,frame5_copyImg], {opacity:0});

				// TweenMax.to((frame5,frame5_img), 0.5, {top: 0, ease: Strong.easeInOut}); // slide in

				// TweenMax.from([text_wrapper_fm6, frame5_copyImg], 0.5, {left: -300, ease: Strong.easeInOut, delay:.25});
				TweenMax.to([frame5_copyImg], 0.5, {opacity: 1, ease: Circ.easeInOut, delay:1});
				TweenMax.set(carousel,{opacity:1,delay:.05});

				TweenMax.to(carousel, 0.5, {opacity: 1, ease: Strong.easeOut, delay:.05,onComplete:function () {
					if(products_info.length >=2){
						slide2 = products_info[1].slide;
						TweenMax.set(slide2,{opacity:.7});
						TweenMax.to(slide2, 0.5, {left: 103, ease: Strong.easeInOut, delay:0});
					}
					if(products_info.length >=3){
						lastSlide = products_info[products_info.length-1].slide;
						TweenMax.set(lastSlide,{opacity:.7, left: -300});
						TweenMax.to(lastSlide, 0.5, {left: -103, ease: Strong.easeInOut, delay:0});
					}
                    
                    // NOTE: not sure what this is for so commented it out 2020.Aug.21
//					if(products_info.length >=4){
//						slide4 = products_info[3].slide;
//						TweenMax.set(slide4,{opacity:1});
//						TweenMax.to(slide4, 0.5, {left: 0, ease: Strong.easeInOut, delay:0});
//					}
				}});

				// Ad.setUpCarousel();

				TweenMax.to(arrow_left, 0.5, {opacity: 1, ease: Strong.easeInOut, delay:.75}); // slide in
				TweenMax.to(arrow_right, 0.5, {opacity: 1, ease: Strong.easeInOut, delay:.75}); // slide in

				TweenMax.to(headline, 0.5, {opacity:1,left: 0, delay: 0.5, ease: Strong.easeInOut, delay:1});
				
				TweenMax.to(legal, 0.5, {opacity: 1, delay: 0.5, ease: Strong.easeInOut, delay:1});

				TweenMax.set(cta, {opacity:0});
				TweenMax.to(cta, 0.5, {opacity: 1, delay: 0.5, ease: Strong.easeInOut, delay:1});

				Ad.setUpCarousel();

			}

			/*  move frame off screen  */
			function moveFrame (frame, direction, callback){
				var offsetX = 0,
					offsetY = 0;
				// determine which way to animate and set coordinates
				switch(direction){
					case 'slideUp': 	offsetY = -Ad.HEIGHT; break;
					case 'slideDown': 	offsetY =  Ad.HEIGHT; break;
					case 'slideLeft': 	offsetX = -Ad.WIDTH;  break;
					case 'slideRight': 	offsetX =  Ad.WIDTH;  break;
					default: break;
				}

				// move frame
				TweenMax.to(frame, 0.5, {top: offsetY, left: offsetX, ease: Strong.easeInOut, onComplete: function(){
					callback(); // run callback
					if(direction !== ''){
						frame.classList.add('hidden'); // hide frame
					}
				}});
			}
			
			TweenMax.set(frame2, {top: Ad.HEIGHT});
			introFrame();
			animateTextFrame(frame1_headline, 'slideDown', zoomOut);
		},
		/*
		 *  Special end frame carousel with preview products to either side of main, end frame copy displays not price/name
		 */
		setUpCarousel : function(){
			console.log(products_info.length+' === '+"lastFrame");
			car_here = true;
			for(var i = 0; i < products_info.length; i++){
				//TODO add check in case array is above 3 products but still works for 1,2 or 3
				//(imgHold)
                (products_info[i].slide).classList.add(i);
				(products_info[i].slide).style.opacity =1;

				//(products_info[i].clicker).style.opacity = 0;
				(products_info[i].footer).style.opacity = 0;
				(products_info[i].slide).style.top ="0px";
				(products_info[i].slide).style.left ="0px";
				TweenMax.set((products_info[i].imageHold),{scaleX:1,scaleY:1});
				TweenMax.set((products_info[i].imageHold),{scaleX:1,scaleY:1});
				
				if(i == 1){
					(products_info[i].slide).style.left = "300px";
					(products_info[i].slide).style.opacity = 0;
					TweenMax.set((products_info[i].imageHold),{scaleX:.5,scaleY:.5});
					TweenMax.set((products_info[i].imageHold),{scaleX:.5,scaleY:.5});
				}
				if(i == 2){
					(products_info[i].slide).style.left = "-300px";
					(products_info[i].slide).style.opacity = 0;
					TweenMax.set((products_info[i].imageHold),{scaleX:.5,scaleY:.5});
					TweenMax.set((products_info[i].imageHold),{scaleX:.5,scaleY:.5});

				}
                
                if(i > 2) {
                    (products_info[i].slide).style.opacity = 0;
                }
			}
		},

		ctaClick : function(e) {
			myFT.clickTag(3, myFT.instantAds.clickTag3);
		},	

	    prodClick : function(e){
	    	console.log("prodClick :: "+e.target.id);
	    	console.log(products_info)
	    	if (car_here) {
	        	var url = products_info[0].url;
				var trackStr = products_info[0].sku;
				//myFT.stateTrackingEvent(trackStr, 'ft_section');
				Tracker.clickTrackEvent(trackStr, 'ft_section', false);

				console.log("skuString on click is :: "+products_info[0].sku);

				myFT.clickTag(2, url);
	    	}else {
	    		if (bus_here) {
	    			myFT.clickTag(3, myFT.instantAds.clickTag3);
	    		} else {
	    			myFT.clickTag(1, myFT.instantAds.clickTag1);
	    		}	
	    	}
	    },
		/*
		 *  Carousel from endFrame layout to end carousel (displays only one product and product price at a time)
		 */
		resetCarousel : function(e){
			//cta off
			TweenMax.to((frame5,frame5_img), 0.5, {opacity: 0, ease: Strong.easeInOut});
			cta.style.display = 'none';
			hover.style.display = 'none';
			//ARROWS
//			TweenMax.to(arrow_left,.35,{left:"+=39px"});
//			TweenMax.to(arrow_right,.35,{right:"-=40px"});
			//fade out copy on frame 6 and cta
			TweenMax.to([text_wrapper_fm6,cta], .1,{opacity:0, delay:0});
			//animate the footer background in
			
			var slide0 = products_info[0].slide,
				img0 = products_info[0].imageHold,
				footer0 = products_info[0].footer,
				slide1,footer1,img1,slide2,footer2,img2;
			TweenMax.to(img0,.35,{scaleX:1,scaleY:1,ease:Strong.easeOut});
			TweenMax.to(footer0,.35,{opacity:1,ease:Strong.easeOut});
			if(products_info.length >=2){
				slide1 = products_info[1].slide;
				footer1 = products_info[1].footer;
				img1 = products_info[1].imageHold;

				TweenMax.to(img1,.35,{scaleX:1,scaleY:1,ease:Strong.easeOut});
				TweenMax.set(footer1,{opacity:1,delay:.5});
				if(e.target.id == 'arrow_right'){
					TweenMax.to(slide0,.5,{left:-Ad.WIDTH,ease:Strong.easeOut});
					TweenMax.to(slide1,.25,{opacity:1,left:0,ease:Strong.easeOut});
				}else{
//					TweenMax.to(slide0,.5,{left:Ad.WIDTH,ease:Strong.easeOut});
//
//					TweenMax.to(slide1,.15,{opacity:1,left:Ad.WIDTH});
				}
			}
			if(products_info.length >=3){
				slide2 = products_info[2].slide;
				footer2 = products_info[2].footer;
				img2 = products_info[2].imageHold;
				TweenMax.to(img2,.35,{scaleX:1,scaleY:1,ease:Strong.easeOut});
				TweenMax.set(footer2,{opacity:1,delay:.5});
				if(e.target.id == 'arrow_right'){
					TweenMax.to(slide2,.25,{opacity:1,left:-Ad.WIDTH,ease:Strong.easeOut});
				}else{
//					TweenMax.to(slide2,.15,{opacity:1,left:0});
				}
			}
			/*if(products_info.length >=4){
				for(var i = 0; i < products_info.length; i++){
					slide3 = products_info[i].slide;
					footer3 = products_info[i].footer;
					img3 = products_info[i].imageHold;
					TweenMax.to(img3,.35,{scaleX:1,scaleY:1,ease:Strong.easeOut});
					TweenMax.set(footer3,{opacity:1,delay:.5});
					if(e.target.id == 'arrow_right'){
						TweenMax.to(slide3,.25,{opacity:1,left:-Ad.WIDTH,ease:Strong.easeOut});
					}else{
						TweenMax.to(slide3,.15,{opacity:1,left:0});
					}
				}
			}*/
			if(products_info.length >=4){
				slide3 = products_info[3].slide;
				footer3 = products_info[3].footer;
				img3 = products_info[3].imageHold;
				TweenMax.to(img3,.35,{scaleX:1,scaleY:1,ease:Strong.easeOut});
				TweenMax.set(footer3,{opacity:1,delay:.5});
				if(e.target.id == 'arrow_right'){
					TweenMax.to(slide3,.25,{opacity:1,left:-Ad.WIDTH,ease:Strong.easeOut});
				}else{
//					TweenMax.to(slide3,.15,{opacity:1,left:0});
				}
			}
			if(products_info.length >=5){
				slide4 = products_info[4].slide;
				footer4 = products_info[4].footer;
				img4 = products_info[4].imageHold;
				TweenMax.to(img4,.35,{scaleX:1,scaleY:1,ease:Strong.easeOut});
				TweenMax.set(footer4,{opacity:1,delay:.5});
				if(e.target.id == 'arrow_right'){
					TweenMax.to(slide4,.25,{opacity:1,left:-Ad.WIDTH,ease:Strong.easeOut});
				}else{
//					TweenMax.to(slide4,.15,{opacity:1,left:0});
				}
			}
			if(products_info.length >=6){
				slide5 = products_info[5].slide;
				footer5 = products_info[5].footer;
				img5 = products_info[5].imageHold;
				TweenMax.to(img5,.35,{scaleX:1,scaleY:1,ease:Strong.easeOut});
				TweenMax.set(footer5,{opacity:1,delay:.5});
				if(e.target.id == 'arrow_right'){
					TweenMax.to(slide5,.25,{opacity:1,left:-Ad.WIDTH,ease:Strong.easeOut});
				}else{
//					TweenMax.to(slide5,.15,{opacity:1,left:0});
				}
			}
			if(products_info.length >=7){
				slide6 = products_info[6].slide;
				footer6 = products_info[6].footer;
				img6 = products_info[6].imageHold;
				TweenMax.to(img6,.35,{scaleX:1,scaleY:1,ease:Strong.easeOut});
				TweenMax.set(footer6,{opacity:1,delay:.5});
				if(e.target.id == 'arrow_right'){
					TweenMax.to(slide6,.25,{opacity:1,left:-Ad.WIDTH,ease:Strong.easeOut});
				}else{
//					TweenMax.to(slide6,.15,{opacity:1,left:0});
				}
			}
			if(products_info.length >=8){
				slide7 = products_info[7].slide;
				footer7 = products_info[7].footer;
				img7 = products_info[7].imageHold;
				TweenMax.to(img7,.35,{scaleX:1,scaleY:1,ease:Strong.easeOut});
				TweenMax.set(footer7,{opacity:1,delay:.5});
				if(e.target.id == 'arrow_right'){
					TweenMax.to(slide7,.25,{opacity:1,left:-Ad.WIDTH,ease:Strong.easeOut});
				}else{
//					TweenMax.to(slide7,.15,{opacity:1,left:0});
				}
			}
			if(products_info.length >=9){
				slide8 = products_info[8].slide;
				footer8 = products_info[8].footer;
				img8 = products_info[8].imageHold;
				TweenMax.to(img8,.35,{scaleX:1,scaleY:1,ease:Strong.easeOut});
				TweenMax.set(footer8,{opacity:1,delay:.5});
				if(e.target.id == 'arrow_right'){
					TweenMax.to(slide8,.25,{opacity:1,left:-Ad.WIDTH,ease:Strong.easeOut});
				}else{
//					TweenMax.to(slide8,.15,{opacity:1,left:0});
				}
			}
			if(products_info.length >=10){
				slide9 = products_info[9].slide;
				footer9 = products_info[9].footer;
				img9 = products_info[9].imageHold;
				TweenMax.to(img9,.35,{scaleX:1,scaleY:1,ease:Strong.easeOut});
				TweenMax.set(footer9,{opacity:1,delay:.5});
				if(e.target.id == 'arrow_right'){
					TweenMax.to(slide9,.25,{opacity:1,left:-Ad.WIDTH,ease:Strong.easeOut});
				}else{
//					TweenMax.to(slide9,.15,{opacity:1,left:0});
				}
			}
            
            if (e.target.id == 'arrow_left') {
                for (i = 0; i < products_info.length; i++) {
                    if(i == products_info.length - 1){
                        TweenMax.to(products_info[i].slide, .15, {
                            opacity: 1,
                            left: 0,
                            ease: Strong.easeOut
                        });
                    }else{
                        TweenMax.to(products_info[i].slide, .15, {
                            opacity: 1,
                            left: Ad.WIDTH,
                            ease: Strong.easeOut
                        });
                    }
                }
            }
            
			var elm;
			if(e.target.id == 'arrow_left'){
				elm = products_info.pop();
				products_info.unshift(elm);
			}else{
				elm = products_info.shift();
				products_info.push(elm);
			}

		},
		/*
		 *  Carousel arrow clicks
		 */
	    onArrowClick : function(e) {
	    	ctaBox.style.display = "none";
			var isRightClick = (e.target.id === 'arrow_right');

			if (endCarouselActive) {
				//set flag to false
				endCarouselActive = false;
				Ad.resetCarousel(e);

				TweenMax.set(carousel_mask, {opacity:1});

				return;
			}

	        var elm =  products_info[0].slide;//element to slide out
	        var elm2;//element to slide in

	        if(!block_click){
				//set flag to prevent click while transitioning
				block_click = true;
				//element to move out
				if(isRightClick){
					myFT.tracker('next_arrow_clicked',null,"next_arrow_clicked");
					TweenMax.to(elm, carousel_speed,{left:-Ad.WIDTH,ease:Strong.easeOut, delay:carousel_speed});
	                elm = products_info.shift();
	                products_info.push(elm);
	                elm2 = products_info[0].slide;
					TweenMax.set(elm2,{left:Ad.WIDTH});
					TweenMax.to(elm2, carousel_speed,{left:0,ease:Strong.easeOut, delay:carousel_speed,onComplete:function () {
						block_click = false;
					}});
	            }else{
					myFT.tracker('prev_arrow_clicked',null,"prev_arrow_clicked");

					TweenMax.to(elm, carousel_speed,{left:Ad.WIDTH,ease:Strong.easeOut, delay:carousel_speed});
					elm2 = products_info.pop();
	                products_info.unshift(elm2);
					elm2 = products_info[0].slide;
					TweenMax.set(elm2,{left:-Ad.WIDTH});
					TweenMax.to(elm2, carousel_speed,{left:0,ease:Strong.easeOut, delay:carousel_speed,onComplete:function () {
						block_click = false;
					}});
	            }
			}
	    },

		cta_over : function(e) {
			TweenMax.to(hover, 0.5, {opacity: 1, ease: Strong.easeInOut});
				
		},

		cta_out : function(e) {
			TweenMax.to(hover, 0.5, {opacity: 0, ease: Strong.easeInOut});
		},

		/*
		 *  Create and add elements to container
		 */
		addElements : function() {
				legal 	 = document.createElement('p'),
				cta   	 = new Image(),
				hover 	 = new Image();

			// cta
			cta.src = myFT.instantAds.CTA_img;
			cta.id = 'cta_reg';
			cta.classList.add('cta');
			cta.classList.add('ad-size');

			hover.src = myFT.instantAds.CTA_hover_img;
			hover.classList.add('hover');
			hover.id  = 'cta_hover';
			hover.classList.add('ad-size');

			// legal
			legal.innerHTML = myFT.instantAds.legal_copy;
			legal.classList.add('legal');

			// images
			logo0.style.backgroundImage   = 'url(./images/BestBuy_Logo_Reversed_4C.svg)';
			logo.style.backgroundImage   = 'url('+ myFT.instantAds.logo_img +')';
			frame1.style.backgroundImage = 'url('+ myFT.instantAds.F1_background_img +')';
			frame1_img.style.backgroundImage = 'url('+ myFT.instantAds.F1_background_img +')';

			frame5.style.backgroundImage = 'url('+ myFT.instantAds.F5_background_img +')';
			frame5_img.style.backgroundImage = 'url('+ myFT.instantAds.F5_background_img +')';

			frame1_headline.appendChild(Ad.splitHeadline3(myFT.instantAds.F1_headline_copy));
				
			if(myFT.instantAds.F1_headline_copy_img.indexOf("blank") >= 0){
				
			}else{
				console.log("frame1 off");
				frame1.style.opacity = 0;
				frame1_copyImg.src = myFT.instantAds.F1_headline_copy_img;
				frame1_img.classList.remove('hidden');
			}


			
			myFT.applyButton(arrow_left, Ad.onArrowClick);
			myFT.applyButton(arrow_right, Ad.onArrowClick);


			// frame 5
				frame5.appendChild(Ad.splitHeadline2(myFT.instantAds.F5_headline_copy));
			if(myFT.instantAds.F5_headline_copy_img.indexOf("blank") >= 0){
				
				frame5.appendChild(legal);
				frame5.appendChild(cta);
				frame5.appendChild(hover);
				frame5_img.appendChild(Ad.splitHeadline2(myFT.instantAds.F5_headline_copy));
			}else{
				console.log("frame 5 off");
				frame5.style.opacity = 0;
				frame5_copyImg.src = myFT.instantAds.F5_headline_copy_img;
				
				frame5_img.appendChild(legal);
				frame5_img.appendChild(cta);
				frame5_img.appendChild(hover);
			}


			// connect and add feed data
			Feed.connect();

			myFT.applyButton(logo, Ad.prodClick);
			logo.addEventListener("mouseover", Ad.cta_over);
			logo.addEventListener("mouseout", Ad.cta_out);

			myFT.applyButton(ctaBox, Ad.ctaClick);
			ctaBox.addEventListener("mouseover", Ad.cta_over);
			ctaBox.addEventListener("mouseout", Ad.cta_out);

		},

		ellipsisMe : function(str){
	        var revStr = str.split('').reverse().join('');
	        var lastSpc = revStr.indexOf(' ')+1;
	        revStr = revStr.slice(lastSpc,(revStr.length));
	        str = revStr.split('').reverse().join('');
	        str = str+ '...';
	        return str;
	    },

		/*
		 *  Error handler
		 */
		error : function(error) {
			Tracker.impressionTrackEvent('null');
			
			if(!feedresponse_has_fired){
				feedresponse_has_fired = true;
				Ad.LOADED = false;
				console.log(error);
				isError = true;
				container.style.opacity = 1;
				feedFail.style.opacity = 1;
				frame1.style.opacity = 0;
				frame1_headline.style.opacity = 0;
				frame1_img.style.opacity = 0;
				frame2.style.opacity = 0;
				frame5.style.opacity = 0;
				frame5_img.style.opacity = 0;
				logo.style.opacity = 0;
				logo0.style.opacity = 0;
                logo.style.zIndex = 999;

				feedFail.src = myFT.instantAds.backup_img;
				myFT.tracker('fallback_img',null,"fallback_img");
			}

		},
		/*
		 *  Ad is ready, begin and show
		 */
		ready : function() {
			// show banner

			TweenMax.delayedCall(.25, Ad.animate);
		},

		/*
		 *  Split headline at line breaks and return node to be added to element
		 */
		splitHeadline3 : function (headline) {
			var ar = headline.split('<br>');
			var color;
			var newHeadline = "";
			var splitter = /<\/span><\/span>/gi,
				wrapper  = document.createElement('div');

			for(var i = 0; i < ar.length; i++){
				if(ar[i].indexOf(/<\/span>/ ) === -1){
					ar[i] += "</span>";
				}

				if(ar[i].indexOf('<span')=== -1){
					ar[i] = "<span style='"+color+"'>"+ar[i];
				}else{
					var stColor = ar[i].indexOf('color');
					var endColor = ar[i].indexOf(";'");
					color = ar[i].slice(stColor, endColor);
				}
				newHeadline += ar[i];

			}
			newHeadline = newHeadline.replace(splitter, '</span>'); // replace <br> with spans

			wrapper.id = 'page_text';
			wrapper.innerHTML = "<span>"+newHeadline+"</span>"; // wrap headline with identifier
			wrapper.className = 'text-wrapper';

			return wrapper;
		},

		splitHeadline2 : function(headline) {
			var splitter = /<br>/gi,
				wrapper  = document.createElement('div');

			headline = headline.replace('>', '><span>'); // add extra opening span for first word
			headline = headline.replace('</', '</span></'); // add extra closing span for last word
			headline = headline.replace(splitter, '</span><span>'); // replace <br> with spans

			wrapper.classList.add('text-wrapper');
			wrapper.id = 'text_wrapper_fm6';
			wrapper.innerHTML = headline; // wrap headline with identifier

			return wrapper;
		}

	};

	Feed = {

		/*
		 *  Set feed parameters and connect
		 */
		connect : function(FeedObj) {
			
            var feedParams, ftFeed;

            // set dynamic parameters
            feedParams = new FTFeedParams();
            feedParams.defaultFeedEndpoint = myFT.instantAds.defaultFeedEndpoint;
            feedParams.feedEndpoint = myFT.instantAds.feedEndpoint;

            // send connection request
            ftFeed = new FTFeed(myFT, feedParams);
            ftFeed.getFeed(Feed.success, Ad.error);
		},
		/*
		 *  Parse data and apply to creative
		 */
		createItem : function(data, num,sku) {
			//IMAGES FOR FRM 2-5
			var imageHold   	= document.createElement('div'),
				image  	    = new Image(),
				footer  	= document.createElement('div'),
				priceHold  	= document.createElement('div'),
				price   	= document.createElement('p'),
				nameHold  	= document.createElement('div'),
				name    	= document.createElement('p'),
				wrapper 	= document.createElement('div'),
				clicker 	= document.createElement('div'),
				imageSize	= '&w='+ Ad.IMG_WIDTH +'&h='+ Ad.IMG_HEIGHT,
				dollarSign  = '<span style="font-size:.9em">$</span>',
				savePrefix  = 'Save '+ dollarSign,
				dollarSave,
				salePrice;

			//carousel images
			var carousel    = document.getElementById('carousel'),
				prodNumber  = num-1,
				wrapperClone,
				imageClone;

			if(data){
				footer.className = 'footer_hold';
				imageHold.className = 'prod_img_holder';
				dollarSave = '<span style="color:#0046bd">'+data.dollarsavings+'</span>';
				salePrice = '<span style="color:#0046bd">'+data.saleprice+'</span>';
				// create image node
				image.onerror = function() {
					image.onerror = '';
					image.src = 'bblogo.png';
					return true;
				};
				image.src = data.image + imageSize;
				image.classList.add('prod_img');
				imageHold.appendChild(image);
				// create price node
				priceHold.className = "prod_price_hold";
				price.innerHTML = (Number(data.percentsavings) > 15) ? savePrefix + dollarSave : dollarSign + salePrice;
				price.classList.add('price');
				priceHold.appendChild(price);
				footer.appendChild(priceHold);

				// create name node
				nameHold.className = "prod_name_hold";
				name.innerHTML = data.name.length > 110 ? Ad.ellipsisMe(data.name.substr(0, 110)) : data.name;
				name.classList.add('name');
				nameHold.appendChild(name);
				footer.appendChild(nameHold);

				clicker.classList.add('clicker');

				//add nodes to wrapper
				wrapper.appendChild(imageHold);
				wrapper.appendChild(footer);
				wrapper.appendChild(clicker);


				wrapper.classList.add('item');
				TweenMax.set(wrapper,{transformOrigin:'right bottom',top:-90});


				wrapper.classList.add('ad-size');

				wrapper.style.opacity = 0;

				frame2.appendChild(wrapper); // add item to frame

				//create prod carousel
				prodNumber++;
				wrapperClone = wrapper.cloneNode(true);


				wrapperClone.classList.remove('item');
				wrapperClone.classList.add('slide');
				if(prodNumber ===0){
					wrapperClone.style.left = "0px";
				}
				carousel.appendChild(wrapperClone);

				var prodUrl = data.url,
					imageHolder = wrapperClone.childNodes[0],
					footerHolder = wrapperClone.childNodes[1],
					priceHolder = footerHolder.childNodes[0],
					nameHolder = footerHolder.childNodes[1];

				products_info.push({id:prodNumber, slide:wrapperClone, url:prodUrl,footer:footerHolder,priceHold:priceHolder,nameHold:nameHolder,imageHold:imageHolder,clicker:clicker,imgURL: data.image + imageSize,sku:sku});

			}
		},

		/*
		 *  Feed connected successfully, route data
		 */
		success : function(feedData, feedUrl) {
			console.log(feedUrl)
            var productCount = (feedData.length > 5)? 5 : feedData.length; 
			if(!feedresponse_has_fired){
				feedresponse_has_fired  = true;
				var skuString="";
				//for(i in feedData){
				for(var i = 0; i < productCount; i++){
					Feed.createItem(feedData[i], i, feedData[i].sku);
					skuString += feedData[i].sku+"||";
				}

				for(i = 0; i <products_info.length;i++){
					var img = products_info[i].imageHold.childNodes[0];
					img.onerror = function(e) {
						e.target.onerror = '';
						e.target.src = 'bblogo.png';
						return true;
					};
					img.src = products_info[i].imgURL;
				}

				//}
				skuString = skuString.slice(0,skuString.length-2);
				console.log('skuString on impression is :: '+skuString);
				Tracker.impressionTrackEvent(skuString);

				Ad.LOADED = true; // ad is loaded
			}

		}

	};

window.onload = function () {
    initializeAPI();
}


function initializeAPI() {
    container.classList.add(checkPlatform()[0] + "-" + checkPlatform()[1]);

    myFT.on("richload", function () {
        myFT.on("instantads", function () {
            checkTimer = setInterval(checkAPI, 100);
        });
    });
}

var checkAPI = function () {
    if (myFT.richloadsLoaded == true && myFT.instantAdsLoaded == true) {
        clearInterval(checkTimer);
        Ad.init();
    }
}

function checkPlatform() {
    try {
        var a = new Array();

        if (navigator.platform.toLowerCase().indexOf("mac") > -1) {
            a[0] = "macOS";
        } else if (navigator.platform.toLowerCase().indexOf("win") > -1) {
            a[0] = "windows";
        } else {
            if (navigator.userAgent.match(/iPhone|iPad|iPod/i)) {
                a[0] = "iOS";
            } else if (navigator.userAgent.match(/Opera Mini/i)) {
                a[0] = "opera";
            } else if (navigator.userAgent.match(/Android/i)) {
                a[0] = "android";
            } else if (navigator.userAgent.match(/BlackBerry/i)) {
                a[0] = "BlackBerry";
            } else if (navigator.userAgent.match(/IEMobile/i) || navigator.userAgent.match(/WPDesktop/i)) {
                a[0] = "WindowsPhone";
            }
        }

        var MSIE = window.navigator.userAgent.indexOf("MSIE ");
        var Edge = window.navigator.userAgent.indexOf("Edge/");
        var Trdt = window.navigator.userAgent.indexOf("Trident/");

        if (navigator.userAgent.toLowerCase().indexOf("chrome") > -1) {
            a[1] = "chrome";
        } else if (navigator.userAgent.toLowerCase().indexOf("firefox") > -1) {
            a[1] = "firefox";
        } else if (navigator.vendor && navigator.vendor.toLowerCase().indexOf("apple") > -1) {
            a[1] = "safari";
        } else if (MSIE > 0 || Edge > 0 || Trdt > 0) {
            a[1] = "IE";
        }

        return a;
    } catch (error) {
        console.error("Error on checkPlatform(): " + error.message);
    }
}

