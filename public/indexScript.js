$(document).ready(function (document) {
    $("#Ready").text("Ready? Yes");
    logr.Log("indexScriptLanguageIs", navigator.language);
	$("#clickList").click(function () {logr.Log("clickedfromindex_to","list")});
});