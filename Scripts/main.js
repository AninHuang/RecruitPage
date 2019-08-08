"use strict";

/*
Purpose: 建立動畫實體。
Author: 黃郁雅
Time: 2019/7/17
Parameter: N/A
Return: N/A
History: N/A
*/
var tl = new TimelineMax();

$(function () {
  // 預先載入十五則職缺資訊
  // getPositionCards(15);
  // 隱藏五則職缺資訊
  // toggleLastFivePositionCards();

  /*
  Purpose: 點擊「職缺分類」或「依地區別」選單。
  Author: 黃郁雅
  Time: 2019/7/17
  Parameter: N/A
  Return: N/A
  History: N/A
  */
  $('.pwc-tabs-block .pwc-tab').on('click', function (e) {
    var $pwcIndicator = $('.pwc-indicator');
    var $this = $(this);
    var el_width = $this.width();
    var offset_left = $this.offset();
    var initTabNum = $this.data('tab');
    var $pwcTab = $('.pwc-tab');
    var $pwcTablist = $('.pwc-tablist');
    var $pwcTabsContent = $('.pwc-tabs-content');

    if ($pwcTabsContent.hasClass('noshow')) {
      toggleLastFivePositionCards();
    }

    $pwcTabsContent.removeClass('noshow');

    function step_1() {
      $pwcTablist.addClass('noshow');
    }

    function step_2() {
      $('.pwc-tablist_' + initTabNum).removeClass('noshow');
    }

    if (!tl.isActive()) {
      // ( target:Object, duration:Number, vars:Object, position:* )
      tl.to($pwcTablist, 0.05, {
        y: 100,
        ease: Back.easeOut,
        onComplete: step_1
      // ( target:Object, duration:Number, fromVars:Object, toVars:Object, position:* )
      }).fromTo($('.pwc-tablist_' + initTabNum), 0.75, {
        onStart: step_2,
        y: -10
      }, {
        y: 0,
        ease: Power4.easeOut,
        immediateRender: false
      });
      $pwcIndicator.offset({
        left: offset_left.left
      }).css('width', el_width);

      if ($this.hasClass('active')) {
        $pwcTabsContent.addClass('noshow');
        $pwcTab.removeClass('active');
        toggleLastFivePositionCards();
      } else {
        $pwcTab.removeClass('active');
        $this.addClass('active');
      }
    }
  });

  /*
  Purpose: 點擊「職缺分類、依地區別」選單內各項目。
  Author: 黃郁雅
  Time: 2019/7/17
  Parameter: N/A
  Return: N/A
  History: N/A
  */
  $('.pwc-tablist a').on('click', function (e) {
    e.preventDefault();
    
    $('.pwc-tabs').slideUp(300);

    /*
    Purpose: 建立換頁元件內容模板。
    Author: 黃郁雅
    Time: 2019/7/19
    Parameter: N/A
    Return: N/A
    History: N/A
    */
    function pwcTemplate(data) {
      var html = '';
      $.each(data, function(index, card){
          html += '<a href="" class="pwc-card"><div class="pwc-card_position">'+ card.position +'</div>';
          html += '<span class="pwc-flag">'+ card.flag +'</span>';
          html += '<section><div class="pwc-card_intro">'+ card.region +'</div>';
          html += '<div class="pwc-card_intro">'+ card.field +'</div></section></a>';
      });
      return html;
    }

    /*
    Purpose: 建立換頁元件。
    Author: 黃郁雅
    Time: 2019/7/19
    Parameter: N/A
    Return: N/A
    History: N/A
    */
    $('#pagination-container').pagination({
      dataSource: function (done) {
        $.ajax({
            url: 'https://raw.githubusercontent.com/AninHuang/RecruitPage/master/Data/fake-position.json',
            type: 'GET',
            success: function (response) {
                done(JSON.parse(response));
                execMasonry();
            }
        });
      },
      pageSize: 10,
      showGoInput: true,
      showGoButton: true,
      callback: function(data, pagination) {
          var html = pwcTemplate(data);

          $('#data-container').html(html);
          $('#pageTotalNumber').text(pagination.totalNumber);
          // 記錄當前頁碼，供職缺內頁「返回前一頁」使用
          window.pageNumber = pagination.pageNumber;
          // $('#pagination-container').pagination('go', window.pageNumber); 可跳至特定頁碼

          updateMasonry();
          execEllipsis();
      }
    })

    $('.pwc-cards-description').html('<div class="font-bold mr-4">\u300C' + $(this).text() + '\u300D \u5171 <span id="pageTotalNumber"></span> \u7B46\u8077\u4F4D</div>'
                                     + '<button id="btn-research" class="btn-backprev">\u91CD\u65B0\u641C\u5C0B</button>'
                                     + '<section id="btn-back" class="ml-auto">'
                                     + '<button id="btn-backlast" class="btn-backprev">\u8FD4\u56DE\u524D\u4E00\u9801</button>'
                                     + '<button id="btn-backhome">\u56DE\u9996\u9801</button>'
                                     + '</section>'
                                     + '<div id="pwc-pagination" class="w-full"></div>'
    );

    // 重新搜尋、返回前一頁
    $('.btn-backprev').on('click', function (e) {
      $('.pwc-tabs').slideDown(300);
      $('.pwc-cards-description').html('<div class="pwc-headline">最新職位</div>'
                                 + '<div style="font-size:0.95rem;">更新時間: 2019/07/21</div>');
      $('#pagination-container').empty();
      // 職缺資訊後端須更新
      toggleLastFivePositionCards();
    });
  });

/*
Purpose: 依視窗縮放，動態調整選單指示符的寬度與位置。
Author: 黃郁雅
Time: 2019/7/17
Parameter: N/A
Return: N/A
History: N/A
*/
$(window).resize(function () {
    if ($('.pwc-tab.active').length) {
      var current_offset_left = $('.pwc-tab.active').offset();
      var current_el_width = $('.pwc-tab.active').width();

      $('.pwc-indicator').offset({
        left: current_offset_left.left
      }).css('width', current_el_width);
    }
  });
});

/*
Purpose: 載入職缺資訊。
Author: 黃郁雅
Time: 2019/7/17
Parameter: pi_nAmount 職缺則數。
Return: N/A
History: N/A
*/
function getPositionCards() {
  var pi_nAmount = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 10;
  var $pwcCardsBlock = $('.pwc-cards-block');
  var pwcCardElement = '<a href="" class="pwc-card">'
                       + '<div class="pwc-card_position"></div>'
                       + '<span class="pwc-flag"></span>'
                       + '<section>'
                       + '<div class="pwc-card_intro"></div>'
                       + '<div class="pwc-card_intro"></div>'
                       + '</section>'
                       + '</a>';

  $pwcCardsBlock.empty();
  for (var i = 0; i < pi_nAmount; i++) {
    $pwcCardsBlock.append(pwcCardElement);
  }
}

/*
Purpose: 切換最後五則職缺資訊的顯示與否。
Author: 黃郁雅
Time: 2019/7/17
Parameter: N/A
Return: N/A
History: N/A
*/
function toggleLastFivePositionCards() {
  var $lastFivePositionCards = $('.pwc-cards-block > .pwc-card').slice(-5);

  for (var i = 0; i < 5; i++) {
    $lastFivePositionCards.eq(i).toggleClass('noshow');
  }

  execMasonry();
  execEllipsis(); // 資料須先載入完成再執行 execEllipsis()
}

/*
Purpose: 自動計算職缺資訊區域可用垂直空間以利 RWD 排版。
Author: 黃郁雅
Time: 2019/7/17
Parameter: N/A
Return: N/A
History: N/A
*/
function execMasonry() {
  $('.pwc-cards-block').masonry({
    itemSelector: '.pwc-card',
    percentPosition: true
  });
}

/*
Purpose: 重載職缺資訊後的可用空間計算。
Author: 黃郁雅
Time: 2019/7/19
Parameter: N/A
Return: N/A
History: N/A
*/
function updateMasonry() {
  $('.pwc-cards-block').masonry('reloadItems');
  execMasonry();
}

/*
Purpose: 截短網頁上多行文字。
Author: 黃郁雅
Time: 2019/7/17
Parameter: N/A
Return: N/A
History: N/A
*/
function execEllipsis() {
  if (!!window.MSInputMethodContext && !!document.documentMode) {
    console.log('IE detected');
    $('.pwc-card_position').css('overflow', 'hidden');
    
    Ellipsis({
      "class": '.pwc-card_position',
      lines: 3
    });
  } else {
    Ellipsis({
      "class": '.pwc-card_position',
      lines: 5
    });
  }

  Ellipsis({
    "class": '.pwc-card_intro',
    lines: 1
  });
}