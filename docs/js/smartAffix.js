(function($){

  var smoothScroll = function(to) {
    $("html, body").animate({scrollTop:to}, '500', 'swing', function() {});
  };

  String.prototype.trunc = function(n, useWordBoundary){
     var toLong = this.length>n,
         s_ = toLong ? this.substr(0,n-1) : this;
     s_ = useWordBoundary && toLong ? s_.substr(0,s_.lastIndexOf(' ')) : s_;
     return  toLong ? s_ + '&hellip;' : s_;
  };

  var autoSearchQuery = [ 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'h7', 'h8', 'p', 'div' ];

  var autoSearch = function(trig) {
    for(var j=0;j<autoSearchQuery.length;++j) {
      if(trig.find(autoSearchQuery[j]).length > 0) {
        return trig.find(autoSearchQuery[j]).first().text();
      }
    }

    var c = trig.contents()
       .filter(function() {
           return !!$.trim( this.innerHTML || this.data );
       })
       .first().text();

    if(c != undefined && c != null) {
      return c.trunc(40, true);
    }

    return '';
  };

  $.fn.extend({
    smartAffix: function(options) {
      options = options || {};
      options.selector = options.selector || '[data-smart-affix]';

      container = $(this);
      if(container.children().length <= 0) {
        options.autoSectionsNames = true;
      }

      container.addClass('smart-affix');
      container.affix({
            offset: {
              top: $('header').height()
            }
      });
      var __triggers = [];
      var cnt = 0;
      var offsetScrollCorrection = $(options.selector).first().offset().top;

      $(options.selector).each(function(){
        var thiz = $(this);
        __triggers.push(thiz);
      });
      __triggers.sort(function(a, b){
        return a.offset().top > b.offset().top;
      });
      var triggers = [];
      var triggerNumber = -1;
      for(var i=0;i<__triggers.length;++i) {
        o = {}
        o.scroll = __triggers[i].offset().top-offsetScrollCorrection;
        o.name = '';
        if(__triggers[i].data('smart-affix')) {
          o.name = __triggers[i].data('smart-affix');
        } else if(options.autoSectionsNames) {
          o.name = autoSearch(__triggers[i]);
        }
        triggers.push(o);
      }

      if(options.autoSectionsNames) {
        for(var i=0;i<triggers.length;++i) {
            container.append('<div style="cursor:pointer;">'+triggers[i].name+'</div>');
        }
      }
      $(options.selector).each(function(){
        var thiz = $(this);
        var sidebarLink = $(container.children()[cnt]);
        sidebarLink.click(function(){
          var scrollTgtPos = thiz.offset().top-offsetScrollCorrection;
          smoothScroll(scrollTgtPos);
        });
        ++cnt;
      });

      var getTriggerIndex = function(value) {
        for(var i=triggers.length-1;i>=0;--i) {
            if(value >= triggers[i].scroll) {
              return i;
            }
        }
        return 0;
      }

      $(document).scroll(function(){
        var t = getTriggerIndex($(document).scrollTop());
        if(t!=triggerNumber) {
          var sel = container.find('.active');
          if(sel.length<=0) {
            sel = container.children().first().addClass('active');
          }
          sel.removeClass('active');
          var c = container.children()[t];
          $(c).addClass('active');

        }
        triggerNumber = t;
      });
    }
  });
})($);
