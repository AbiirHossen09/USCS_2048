FT.manifest({
	"filename": "index.html",
	"width": 970,
	"height": 250,
	"clickTagCount": 3,
	"richLoads": [
        { "name": "richload",                   "src": "BestBuy_AnimatedIntroRL_970x250" }
    ],
	"instantAds":[
		{"name": "richload",            "type": "richLoad",     "default": "BestBuy_AnimatedIntroRL_970x250" },
		{"name": "feedEndpoint", 	 	"type": "text",  "default": "https://s3cf.flashtalking.com/feeds/bestbuy/digitalinsert/general.json"},
	    {"name": "defaultFeedEndpoint", "type": "text",  "default": "https://s3cf.flashtalking.com/feeds/bestbuy/digitalinsert/general.json"},
	    {"name": "segmentId", 			"type": "text",  "default": "false"},

	    {"name": "clickTag1", 		  	"type": "text",  "default": ""},
	    {"name": "clickTag3", 		  	"type": "text",  "default": ""},

	    {"name": "F1_headline_copy", 	"type": "text",  "default": "<span style='color:#fff;'>Deals<span style='color:#fff100'>? Yes, please.</span></span>"},
	    {"name": "F1_headline_copy_img",	"type": "image", "default": "images/blank.png"},
	    {"name": "F1_background_img",		"type": "image", "default": "images/AnimatedIntro_frm1_bg_728x90.jpg"},

	    {"name": "F5_headline_copy", 	"type": "text",  "default": "Let's find what<br>you're looking for."},
	    {"name": "F5_headline_copy_img",	"type": "image", "default": "images/blank.png"},
	    {"name": "F5_background_img",		"type": "image", "default": "images/blank.png"},

	    {"name": "legal_copy", 	  		"type": "text",  "default": "&copy; 2018 Best Buy"},

	    {"name": "logo_img", 	  		"type": "image", "default": "images/bb_logo_728x90.png"},

	    {"name": "CTA_img", 	  		"type": "image", "default": "images/cta_gen_728x90_v1.png"},
	    {"name": "CTA_hover_img", 	  	"type": "image", "default": "images/cta_gen01_728x90_v1.png"},

	    {"name": "backup_img", 	  		"type": "image", "default": "images/blank.png"}

	],
	"trackingEvents":[
		{"name":"prev_arrow_clicked", "type":"string"},
		{"name":"next_arrow_clicked", "type":"string"},
		{"name":"fallback_img", "type":"string"}
	]

});