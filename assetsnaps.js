var overrideDateFormat = '%Y-%m-%d';
expire_date_callback = {
	message : 'Expire Date must after start Date',
	callback : function(value, validator, $field) {
		var target = $($field).attr("after");
		var v = $($field).parents("form:first").find("[name='" + target + "']")
				.val();
		if (v) {
			var current = moment(value, "YYYY-MM-DD");
            console.dir(current);
			var before = moment(v, "YYYY-MM-DD");
			var result = before.isBefore(current);
			return result;
		} else {
			return false;
		}
	}
}
hidden_callback = {
	callback : function(value, validator, $field) {
		console.dir($field.attr("name") + " is hidden "
				+ $field.parents(".htype:first").is(':hidden'));
		if ($field.parents(".htype:first").is(':hidden')) {
			return true;
		}
		return value != "";
	}
}
var icons = {
	valid : 'glyphicon glyphicon-ok',
	invalid : 'glyphicon glyphicon-remove',
	validating : 'glyphicon glyphicon-refresh'
}
$(document).on("change","input[before]",function(){
	var field =	$(this).attr("before");
	var val =	$(this).parents("form:first").data("bootstrapValidator");	
	if (val){
			val.revalidateField(field);
	}
});

function generateNormalConfig($form) {
	var names = $form.find("[name]");
	var fields = {};
	for (var i = 0; i < names.length; i++) {
		var name = $(names[i]).attr('name');
		var validators = {
			validators : {
				notEmpty : {}
			}
		};
		if ("expireDate" == name) {
			validators.validators.callback = expire_date_callback;
		}
		fields[name] = validators;
	}
	var opt = {
		feedbackIcons : icons,
		fields : fields
	}
	return opt;
}

function initForm(container) {
	if ("true" == document.nativeDate) {
		$(".date-input").attr("type", "date");
	} else {
		var fiels = container.find(".date-input");
		fiels.datebox({
			"mode" : "datebox",
			"overrideDateFormat" : overrideDateFormat
		});
		fiels.on("click",function(){
            $(this).siblings(".input-group-addon").trigger("click");
		});
		container.find(".input-group-addon").each(function() {
			$(this).insertBefore($(this).siblings());
		})

	}
}

window.alert = function(message, title) {
	var msg = $("#msg");
	if (msg.length == 0) {
		var msg = $('<div id="msg"  class="alert alert-dismissible fade in" role="alert"> <h4>Info</h4><p>Content</p><button type="button" class="btn btn-white" data-dismiss="modal" aria-label="Close">Ok</button></div>');
		$(msg).appendTo($('body'));
		$(msg).on('show.bs.modal', function(e) {
			$(msg).velocity('transition.expandIn');
		});

	}
	var notifyTitle = "Info";
	if (title) {
		notifyTitle = title;
	}
	msg.find("h4").text(notifyTitle);
	msg.find("p").text(message)
	msg.modal('show');
}
$(document).on("click",".share_code",function(e){
               var code = $("#invite_code").text();
               var full = "Register and upload your policy in Assetsnaps to get a $10 Starbuck card using my code \""+code+"\". Check it out at https://www.assetsnaps.com/invite/"+code;
                    cms24k.shareText(full ,  "https://www.assetsnaps.com/invite/"+code );
});

$(document).on('show.bs.modal', ".an-show", function(e) {
	$(this).velocity('transition.expandIn');
});

$(document).on('click', "#buyPremium", function(e) {

	if (document.nativeUpgrade) {

		document.nativeUpgrade();
		setTimeout(function() {

			$("#premiumModal").modal('hide');

		}, 700);

	} else {
		location.href = "/pub-assetsnaps/upgrade-premium-payment";
	}
});
$(".upgrade").click(function() {

	var open = $("#sidebar-wrapper").hasClass("is-open")
	if (open) {
		$("#hamburger").trigger("click");
	}

	$("#premiumModal").modal({
		// backdrop : 'static',
		keyboard : true
	})
});

function androidUpgrade(token,env){
	$.ajax({
		type : "POST",
		url : '/pub-assetsnaps/upgrade-android/',
		data : {
			token : token,
			env : env
		},
		dataType : "json",
		success : function(data) {
			if (data && data.state && (data.state.indexOf("ERROR") != -1)) {
				alert(data.message);
			} else {
				var open = $("#sidebar-wrapper").hasClass("is-open")
				if (open) {
					$("#hamburger").trigger("click");
				}
				alert("Upgrade successfully");
				setTimeout(function() {
					loadSummary();
				}, 100);
			}
		},
		error : function(xhr, ajaxOptions, thrownError) {
			alert("Please contact  to our support")
		}
	});
}

function iosUpgrade(token, env) {
	$.ajax({
		type : "POST",
		url : '/pub-assetsnaps/upgrade-ios/',
		data : {
			token : token,
			env : env
		},
		dataType : "json",
		success : function(data) {
			if (data && data.state && (data.state.indexOf("ERROR") != -1)) {
				alert(data.message);
			} else {
				var open = $("#sidebar-wrapper").hasClass("is-open")
				if (open) {
					$("#hamburger").trigger("click");
				}
				alert("Upgrade successfully");
				setTimeout(function() {
					loadSummary();
				}, 100);
			}
		},
		error : function(xhr, ajaxOptions, thrownError) {
			alert("Please contact  to our support")
		}
	});
}

function doUpate(entity) {
	$(".insurance_total").text(entity.insurance.totalCoverage);
	$(".insurance_sum").text(entity.insurance.totalSumInsure);
	$(".property_count").text(entity.property.count);
	$(".property_sum").text(entity.property.sum);
	$(".stock_count").text(entity.stock.count);
	$(".stock_sum").text(entity.stock.sum);

	    $(".account_code").each(function(){
                                if ($(this).is("input")){

                                $(this).val(entity.code);

                                }else{

                                $(this).text(entity.code);
                                }


                                });

	if (entity.profileUpdated) {
		var inited = $("#dlink").attr("inited");
		if (!inited) {
			$("#dlink").attr("inited", "done");
		}
	} else {
		console.log("profile not updated");
	}
	var name = entity.name;
	if (name == 'null') {
		name = "";
	}
	$(".member_name").text(name);
	if (entity.agent) {
		$(".member_type").text("Premium Member");
		$(".premium-member").show();
		$(".upgrade").hide();
    	$(".premium-only").show();
	} else {
		$(".member_type").text("Standard Member");
		$(".premium-member").hide();
		$(".upgrade").show();
     	$(".premium-only").hide();
	}
	if (!entity.hasUpperline){
	    $(".no-upperline-only").show();
	}


	if (entity.unreadMessage > 0) {
		$("span.numbers").text(entity.unreadMessage).show();
	} else {
		$("span.numbers").text(entity.unreadMessage).hide();
	}

}

function updateUI() {
	var entity = document.userSummary
	if (entity === undefined) {
		if (document.nativeLoad && document.member_id) {
			document.nativeLoad(document.member_id+'summary', function(content) {
				var myobj = JSON.parse(content);
				document.userSummary = myobj;
				doUpate(myobj)
			}, function() {
				entity = {};
			});
		}
	} else {
		doUpate(entity)
	}
}

function loadSummary() {
	$.ajax({
		type : "GET",
		url : "/pub-assetsnaps/profile/summary",
		dataType : "json",
		success : function(data) {
			if (data.state == 'SUCCESS') {
				var str = JSON.stringify(data.entity);
				document.userSummary = data.entity;
				if (document.nativeSave) {
					document.nativeSave(data.entity.id + 'summary', str);
                    document.member_id = data.entity.id;
				}
				updateUI();
			}
		},
		error : function(xhr, ajaxOptions, thrownError) {
            updateUI();
		}
	});
}

function validateLife2() {

}
$(document).ready(function() {
	var fields = $("section:first");
	initForm(fields);
});
$(document).on('change', "#healthType", function() {
	$(".htype").hide();
	$("#dailyHospitalIncome").find("input").val("");
	$("#hospitalWardType").find("select").val("");
	var value = $(this).val();
	if ("Medical Shield" == value) {
		$("#hospitalWardType").show();
	}
	if ("Hospitalization and Surgey" == value) {
		$("#dailyHospitalIncome").show();
	}
	var form = $(this).parents("form:first");
	var validator = $(form).data('bootstrapValidator')
	if (validator) {
		validator.destroy();
		validateHealth();
	}
})
$(document).on('change', ".date-input", function() {
	if ("true" == document.nativeDate) {

	} else {
		var name = $(this).attr("name");
		var form = $(this).parents("form:first");
		var x = $(form).data('bootstrapValidator')
		if (x) {
			x.revalidateField(name);
		}
	}
});
$(document).on(
		'change',
		"#genernalType",
		function() {
			var validator = $("#general-form").data('bootstrapValidator');
			if (validator) {
				try {
					validator.destroy();
				} catch (err) {
					console.log(err);
				}
			}
			var v = $(this).val();
			$("#ab").remove();
			if (v) {
				v = v.replace(/ /g, '')
				var cloned = $("#" + v).clone();
				cloned.attr("id", "ab");
				cloned.insertBefore($("#gbutton"));
				cloned.show();
				initForm(cloned);
				var opt = generateNormalConfig($("#general-form"));
				$("#general-form").bootstrapValidator(opt).on(
						'success.form.bv', function(e) {
							e.preventDefault();
						});
			}
		})


function setupUpload(conf) {
	$(document).on('shown.bs.modal', conf.modal , function() {
		try {
			$(conf.file).val("");
			$(conf.label).text("Please Upload your photo here");
			$(conf.size).text("");
		} catch (err) {
			console.log(err);
		}
	})
	$(document).on("change",  conf.file , function() {
		var filename = $(conf.file).val().split('\\').pop();
		$(conf.label).text(filename);
		$(conf.size).text(formatBytes(this.files[0].size, 1));
	});
	$(document).on("click", conf.button , function() {
		var camVal = $(conf.file).val();
		if (camVal == '') {
			$(conf.file).trigger("click");

		} else {
			$(conf.modal).modal('hide');
			$('#uploading').modal().show();
			var formData = new FormData();
			formData.append(conf.data, $(conf.file)[0].files[0]);
			var options = {
				url : $(conf.form).attr("action"),
				type : 'post',
				dataType : 'json',
				data : formData,
				processData : false, // tell jQuery not to process the data
				contentType : false, // tell
				success : function(data) {
					$('#success').modal().show();
					$('#uploading').modal('hide');
				},
				error : function(jqXHR, textStatus, errorThrown) {
					alert(errorThrown);
					console.log(errorThrown);
				}
			}
			$.ajax(options);
		}
	});
}
var camconf = {
		file : "#camFile",
		label : "#camLabel",
		size : "#camSize",
		button : "#camUpload",
		modal : "#upload-cam",
		form  : "#camForm",
		data  : "photo"
	}
setupUpload(camconf);

var docconf = {
		file : "#docFile",
		label : "#docLabel",
		size : "#docSize",
		button : "#docUpload",
		modal : "#upload-doc",
		form  : "#docForm",
		data  : "doc"
	}
setupUpload(docconf);
var photoconf = {
		file : "#imageFile",
		label : "#imageLabel",
		size : "#imageSize",
		button : "#imageUpload",
		modal : "#upload-photo",
		form  : "#imageForm",
		data  : "photo"
}
setupUpload(photoconf);

var slide = 0;
$(document).on('beforeLeave', function(e, config) {

	if (config.currentUrl == '/pub-page/dashboard') {
		if (slide > 0) {
			slide = $('#myCarousel').find('li.active').index();
		}
	}else if (config.currentUrl == '/pub-page/account-code'){
                    loadSummary();
     }else if (config.currentUrl =='/pub-page/upperline-code'){
                    loadSummary();
     }

})

$(document).on("click", "#dlink", function() {
	slide = 0;
});


var page_load_callback = {
		"dashboard" :  function(){
			loadSummary()
			$(".btn-more").show();
			if ("pop" == $("#dlink").attr("inited")) {
				uploadPop();
				$("#dlink").attr("inited", "done");
			}
			var li = $('#myCarousel').find("li:eq(" + slide + ")");
			li.trigger("click");
		},
		"form-profile" : function(){
			$('#hobby').selectpicker();
		},
		"form-insurence" : function(){
			validateLife1();
			validateLife2();
			validateHealth();
			validateGeneral();
		},
		"form-property" : function(){
			validateProperty();
		},
		"form-stock" : function(){
			validateStock();
		},
		"edit" : function(){
			validateEdit();
			$('#hobby').selectpicker();
		},
		"notification" : function(){
			$.ajax({
				type : "POST",
				url : "/pub-member/message/reset/",
				dataType : "json",
				success : function(data) {
					$("span.numbers").text(0).hide();
					document.userSummary.unreadMessage = 0;
				}
			});
		}
}


$(document).on('afterReplace', function(e, config) {
	initForm($("section:first"));
	$(".btn-more").hide();
	var key = config.url.substring("/pub-page/".length);
	console.dir(key);
	var callback = page_load_callback[key];
    if (typeof (callback) === 'function') {
    	callback();
    }
	updateUI();
//	if (callback )
	
	
//	if ("/pub-page/dashboard" == config.url) {
////		loadSummary()
////		$(".btn-more").show();
////		if ("pop" == $("#dlink").attr("inited")) {
////			uploadPop();
////			$("#dlink").attr("inited", "done");
////		}
////		var li = $('#myCarousel').find("li:eq(" + slide + ")");
////		li.trigger("click");
//
//	} else {
//		$(".btn-more").hide();
//	}
//	if ("/pub-page/form-profile" == config.url) {
////		$('#hobby').selectpicker();
//	}
//	if ("/pub-page/form-insurence" == config.url) {
////		validateLife1();
////		validateLife2();
////		validateHealth();
////		validateGeneral();
//	} else if ("/pub-page/form-property" == config.url) {
////		validateProperty();
//	} else if ("/pub-page/form-stock" == config.url) {
////		validateStock();
//	} else if ("/pub-page/contact" == config.url) {
//
//	} else if ("/pub-page/edit" == config.url) {
////		validateEdit();
////		$('#hobby').selectpicker();
//	} else if ("/pub-page/notification" == config.url) {
//		$.ajax({
//			type : "POST",
//			url : "/pub-member/message/reset/",
//			dataType : "json",
//			success : function(data) {
//				$("span.numbers").text(0).hide();
//				document.userSummary.unreadMessage = 0;
//			}
//		});
//	}
	
});

function validateContact() {
	var names = $("#contact-form").find("[name]");
	var fields = {};
	for (var i = 0; i < names.length; i++) {
		fields[$(names[i]).attr('name')] = {
			validators : {
				notEmpty : {}
			}
		};
	}
	var opt = {
		feedbackIcons : icons,
		fields : fields
	}
	$("#contact-form").bootstrapValidator(opt).on('success.form.bv',
			function(e) {
				e.preventDefault();
			});
}

function validateGeneral() {
	var opt = generateNormalConfig($("#general-form"));
	$("#general-form").bootstrapValidator(opt).on('success.form.bv',
			function(e) {
				e.preventDefault();
			});
}

function validateStock() {
	var opt = generateNormalConfig($("#stock-form"));
	$("#stock-form").bootstrapValidator(opt).on('success.form.bv', function(e) {
		e.preventDefault();
	});
}

function validateEdit() {
	var fields = {
		cfpwd : {
			validators : {
				identical : {
					field : 'newpwd',
					message : 'The password and its confirm are not the same'
				}
			}
		},
		newpwd : {
			validators : {
				identical : {
					field : 'cfpwd',
					message : 'The password and its confirm are not the same'
				}
			}
		}
	}
	var opt = {
		feedbackIcons : icons,
		fields : fields
	}
	$("#profile-edit-form").bootstrapValidator(opt).on('success.form.bv',
			function(e) {
				e.preventDefault();
	});
}
function validateProperty() {
	var opt = generateNormalConfig($("#property-form"));
	$("#property-form").bootstrapValidator(opt).on('success.form.bv',
			function(e) {
				e.preventDefault();
			});
}

function validateHealth() {
	var opt = generateNormalConfig($("#health-form"));
	opt.fields.hospitalWardType = {
		validators : {
			callback : hidden_callback
		}
	}
	opt.fields.dailyhospitalIncome = {
		validators : {
			callback : hidden_callback
		}
	}
	$("#health-form").bootstrapValidator(opt).on('success.form.bv',
			function(e) {
				e.preventDefault();
			});

}
function pushRootPage() {
	cms24k.urls = [];
	cms24k.urls.push(rootPage());
}
function rootPage() {
	return {
		url : "/pub-page/dashboard",
		top : 0,
		docTop : 0,
		title : 'My AssetSnaps',
		replace : true
	};
}

function uploadPop() {
	$("#myUpload").modal("show");
}
function uploadForm() {
	var current = $('#myCarousel').find('li.active');
	var link = $(current).data("link");
	var title = $(current).data("title");
	$("#dummp").attr("href", link);
	$("#dummp").data("title", title);
	$("#dummp").trigger("click");
}

$(document).on("click", "#edit-profile", function() {
	var form = $(this).parents("form:first");
	if (!validateForm(form)) {
		return;
	}
	$.ajax({
		type : "POST",
		url : "/pub-member/profile/update/",
		data : form.serialize(),
		dataType : "json",
		success : function(data) {
			if (data && data.state && (data.state.indexOf("ERROR") != -1)) {
				alert(data.message);
			} else {
				alert("profile updated")
				setTimeout(function() {
					$("#dlink").attr("inited", "done");
					loadSummary();

				}, 500);

			}
		}
	});
});

$(document).on("click","#upload-another",function(){
        $("#upload-pop").trigger("click");
})

$(document).on("click", "#form-profile", function() {
	var form = $(this).parents("form:first");
	if (!validateForm(form)) {
		return;
	}
	$.ajax({
		type : "POST",
		url : "/pub-member/profile/update/",
		data : form.serialize(),
		dataType : "json",
		success : function(data) {
			if (data && data.state && (data.state.indexOf("ERROR") != -1)) {
				alert(data.message);
			} else {

				setTimeout(function() {
					if ("form" == $("#dlink").attr("exec")) {
						pushRootPage();
						var link = $("#dlink").attr("link");
						$("#dummp").attr("href", link);
						$("#dummp").trigger("click");
						$("#dlink").attr("inited", "done");
					} else {
						$("#dlink").attr("inited", "pop");
						$("#dlink").trigger("click");
					}

				}, 500);

			}
		}
	});
});

$(document).on("click", "#form-pop", function() {
	if ("done" == $("#dlink").attr("inited")) {
		uploadForm();
	} else {
		var current = $('#myCarousel').find('li.active');
		var link = $(current).data("link");
		$("#dlink").attr("exec", "form");
		$("#dlink").attr("link", link);
		$("#dummp").attr("data-title", "Personal Profile");
		$("#dummp").attr("href", "/form-profile");
		$("#dummp").trigger("click");
	}
});
function formatBytes(bytes, decimals) {
	if (bytes == 0)
		return '0 Byte';
	var k = 1000; // or 1024 for binary
	var dm = decimals + 1 || 3;
	var sizes = [ 'Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB' ];
	var i = Math.floor(Math.log(bytes) / Math.log(k));
	return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}
$(document).on("click", "#upload-pop", function() {
	if ("done" == $("#dlink").attr("inited")) {
		uploadPop();

	} else {
		$("#dlink").attr("exec", "upload");
		$("#dummp").attr("href", "/form-profile");
		$("#dummp").attr("data-title", "Personal Profile");
		$("#dummp").trigger("click");
	}
});

$(document).on("swiperight", ".carousel", function() {
	$(this).carousel('prev');
});
$(document).on("swipeleft", ".carousel", function() {
	$(this).carousel('prev');
});

function validateLife1() {
	$('#lifeCarousel').bind(
			'slide.bs.carousel',
			function(e) {
				var x = $('#lifeCarousel').find(".item.active");
				var currentIndex = x.index() + 1;
				if (1 == currentIndex) {
					var opt = generateNormalConfig($("#life-first"));
					$("#life-first").bootstrapValidator(opt).on(
							'success.form.bv', function(e) {
								e.preventDefault();
							});
					if (!validateForm($("#life-first"))) {
						e.preventDefault();
					}
				}
			});
}