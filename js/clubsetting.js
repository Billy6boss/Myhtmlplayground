$(document).ready(function(){
    //隱藏錯誤訊息
    $(".errormsg span").click(function(){
        $(this).hide();
    });

    var clubtime=[[],[],[],[],[],[],[]];

    $("#addtime").click(function (e) {
        e.preventDefault();
        var date = $("#date :selected").val();
        var session = $("#session :selected").val();
        // var $span = $("<p />");
        clubtime[date][session] = 1;
        updateClubtime();
        
    });

    $("#timereset").click(function (e) {
        e.preventDefault();
        if (window.confirm("是否重新選擇時間")) {
            for (var i = 0; i < clubtime.length; i++) {
                for (var x = 0; x < clubtime[i].length; x++) {
                    clubtime[i][x] = 0;
                }  
            }
        }
            updateClubtime();
    });

    function updateClubtime() {
        var text ="";
        var print = false;
        $("#clubtimeresult").html(" ");
        for (var i = 0; i < clubtime.length; i++) {
            text = "星期"+ $("#date option").eq(i-1).text()+"：";
            for (var x = 0; x < clubtime[i].length; x++) {
                if(clubtime[i][x] === 1){
                    text +="第" + x +"節 ";
                    print = true;
                }
            }
            if (print) {
                var orginaltext = $("#clubtimeresult").html();
                $("#clubtimeresult").html(orginaltext + text + "<br />");
                print = false;
            }
        }  
    }


    var $input = $("#app input");
    var $appendHere = $(".tagHere");
    var teacher;
    var currentFocus =-1;
    var teacherlist = $(".sugs li");

    //建議選項點擊事件
    $(".suggestbox li").click(function () {
        teacher = $(this).text();
        $("#app input").val(teacher);
        $(".positionuse input").focus();
    });

    //input 輸入事件
    $input.bind("input",function(event){
        var inputval = $(this).val().toUpperCase();
        console.log("up："+event.keyCode);
        console.log(inputval);

        if (inputval == '' || inputval == ' ') {
            moveFocus("reset");
        } else {
            $(".suggestbox").show();            
        }
        for (var i = 0; i < teacherlist.length; i++) {
            if(teacherlist[i].innerHTML.toUpperCase().indexOf(inputval) > -1 ) {
                teacherlist[i].style.display = "";
            } else {
                teacherlist[i].style.display = "none";
            }
        }
    });

    //input 方向鍵與Enter觸發
    $input.keydown(function(event){
        console.log($(".sugs li:visible").length);
        if ($(".sugs li:visible").length > 0) {

            if (event.keyCode == 40) { 
                moveFocus("down");

            } else if (event.keyCode == 38) { 
                moveFocus("up");

            } else if (event.keyCode == 13) { 
                event.preventDefault();
                if (currentFocus > -1) {
                    teacherlist[currentFocus].click();
                    moveFocus("reset");
                }
            } else {
                moveFocus("reset");
            }
        } else {
            if (event.keyCode == 13) {
                event.preventDefault();
                if($(this).val().trim() !== '') {
                    addTag($(this)); 
                    moveFocus("reset");
                }
                return false;
            }
        }
    });

    //建議選項選擇
    function moveFocus(diration){
        var div = $('div.suggestbox');
        teacherlist.removeClass("suggestbox-select");

        if (diration == "up") {
            currentFocus--;
            if(currentFocus < 0) currentFocus = (teacherlist.length -1);
        } else if (diration == "down") {
            currentFocus++;
            if (currentFocus >= teacherlist.length) currentFocus = 0;
        } else if (diration == "reset"){
            currentFocus=-1;
            $(".suggestbox").hide();
        }


        if (currentFocus > -1 ) {
            if (teacherlist.eq(currentFocus).is(':hidden')) {
                moveFocus(diration);
            } else {
                var scrollTop = div.scrollTop() / 41; 
                var l = currentFocus - teacherlist.eq(currentFocus).addClass("suggestbox-select").prevAll('li:hidden').size();
                if (l < scrollTop || l > (scrollTop + 4)) {
                    div.scrollTop((l - 4) * 41);
                }
            }
        }
    }

    //標籤新增方法
    function addTag(element) {
        var $tag = $("<div />"),
            $a = $("<a href='#' />"),
            $span = $("<span />");
        $tag.addClass('teachertag');
        $('<i class="fa fa-times" aria-hidden="true"></i>').appendTo($a);
        $span.text($(element).val());
        $a.bind('click', function(e){
            e.preventDefault();
            $(this).parent().remove();
            $(this).unbind('click');
        });
        $a.appendTo($tag);
        $span.appendTo($tag);
        $tag.appendTo($appendHere);
        $(element).val('');
    }
    $(document).click(function(){
        moveFocus("reset");
    });
    
    updateWordLimet($("#club_info"));

    function updateWordLimet(area){
        $('#wordlimet').text('( ' + Math.max(0, 100 - area.val().length) + ' / 100 )');
        
        if (area.val().length == 100){
            $('#wordlimet').css("color" , "red");
        }
        else
            $('#wordlimet').css("color" , "gray");
    }
    
    $("#club_info").on('input',function(){
        updateWordLimet($(this));
    });
});