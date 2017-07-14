(function($){

  var emdReady = false;

  var callbackReady_ = [];
  var callbackReady = function(){
    for(var i=0;i<callbackReady_.length;++i) {
      (callbackReady_[i])();
    }
  };

  init = (function(options){
    options = options || {};
    options.auto = options.auto || true;

    if(options.auto) {
      var mdcnt = $('script[type=emd]').text();
      $('script[type=emd]').remove();
      var html =
        '<header class="navbar navbar-static-top bs-docs-nav" role="banner">' +
          '<div class="container-fluid">' +
            '<div class="navbar-header">' +
              '<button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">' +
                '<span class="sr-only">Toggle navigation</span>' +
                '<span class="glyphicon glyphicon-th-large" aria-hidden="true"></span>' +
              '</button>' +
              '<a class="navbar-brand" id="page-title-header" style="margin-right:100px;">' +
              '</a>' +
            '</div>' +
            '<nav id="bs-example-navbar-collapse-1" class="collapse navbar-collapse bs-navbar-collapse">' +
              '<ul class="nav navbar-nav" id="navigation-header"></ul>' +
            '</nav>' +
          '</div>' +
        '</header>' +
        '<div class="container">' +
          '<div class="row">' +
            '<div class="col-xs-3">' +
              '<div id="sidebar"></div>' +
            '</div>' +
            '<div class="col-xs-8">' +
              '<script type="emd">'+mdcnt+'</script>' +
            '</div>' +
          '</div>' +
        '</div>';

      $('body').append(html);
    }

    var sections = [];
    var jumpToSection = function(name) {
      var tgt = null;
      for(i=0;i<sections.length;++i) {
        if(sections[i].data('name') == name) {
          tgt = sections[i];
          break;
        }
      }
      if(tgt == null) throw "EMD: Cannot jumpt to undefined label: \""+name+"\"";
      $('#navigation-header').find('.active').removeClass('active');
      $('#navigation-option-'+name.replace(' ','-')).addClass('active');


      if(tgt.hasClass('md-section-hard')) {
        var newContent = tgt.clone().removeClass('hidden');
        __onAnimateNewContent__(newContent);
        $('.md-root').html('').append(newContent);
        $(document).unbind('scroll');
        $('#sidebar').html('').smartAffix({
          selector: 'h2'
        });
        $(document).scrollTop(0);
        callbackReady();
        __onRefresh__();
      } else {
        $(document).scrollTop(tgt.offset().top);
      }

    }

    var __onRefresh__ = (function(){
      $(document).scrollTop($(document).scrollTop()+1);
      $(document).scrollTop($(document).scrollTop()-1);
      prettyPrint();
      $('*[href]').each(function(){
        var thiz = $(this);
        if(thiz.attr('href').indexOf('jump-to:') != -1) {
          var linkageTgt = (thiz.attr('href').replace('jump-to:', ''));
          thiz.attr('href', null);
          thiz.attr('data-jump-to', linkageTgt);
        }
      });
      $('*[data-jump-to]').each(function(){
        var thiz = $(this);
        var linkageTgt = thiz.attr('data-jump-to');
        thiz.click(function(){
          jumpToSection(linkageTgt);
        });
      });
      $('ul.menu-content.md_rendered').each(function(){
        var parent = $(this);
        var children = parent.children();
        var codePreview = parent.parent().parent().parent().parent();
        var pre = codePreview.find('pre');
        var codeColoured = codePreview.find('.code-preview-coloured-provider').find('code');
        var mark = function(e) {
          children.removeClass('active');
          $(e).addClass('active');
        };
        children.each(function(){
          var thiz = $(this);
          thiz.click(function(){
            mark(this);
            var action = thiz.data('option-action');
            if(action == 'raw') {
              pre.text(codeColoured.text());
            } else {
              pre.html(codeColoured.html());
            }
          });
        });
      });
    });
    var __onAnimateNewContentTimming__ = 500;
    var __onAnimateNewContent__ = (function(newContent){
      newContent.css('opacity', '0')
      setTimeout(function(){
        newContent.animate({
          opacity: 1,
        }, __onAnimateNewContentTimming__);
      }, 0);
    });
    var __initCore__ = (function(){

      var extension = function(converter) {
        return [
          {
            type: 'lang',
            regex: '`(.*)`{\\.([A-Za-z]+)}',
            replace: '<pre class="inline-code"><code class="$2">$1</code></pre>'
          },
          {
            type: 'lang',
            regex: '!\\[\\]\\(shield-flat(.*)\\)',
            replace: '![Shields.io badge](https://img.shields.io$1.svg?style=flat-square)'
          },
          {
            type: 'lang',
            regex: '!\\[\\]\\(shield(.*)\\)',
            replace: '![Shields.io badge](https://img.shields.io$1.svg)'
          },
          {
            type: 'lang',
            regex: '!\\[\\]\\(nodeico(.*)\\)',
            replace: '![Node-ico badge](https://nodei.co$1)'
          },
          {
            type: 'lang',
            regex: '-{3,}([A-Za-z 0-9]+)-{3,}',
            replace: '</section><section class="md-section md-section-hard hidden" data-name="$1">'
          },
          {
            type: 'lang',
            regex: '={3,}([A-Za-z 0-9]+)={3,}',
            replace: '</section><section class="md-section md-section-hard hidden" data-name="$1">'
          },
          {
            type: 'lang',
            regex: '={3,}',
            replace: '<div class="hdivider strong"></div>'
          },
          {
            type: 'lang',
            regex: '-{3,}',
            replace: '<div class="hdivider light"></div>'
          },
          {
            type: 'lang',
            regex: '\\[!head\\]',
            replace: '</div>'
          },
          {
            type: 'lang',
            regex: '\\[head\\]',
            replace: '<div class="md-manifest md-header">'
          },
          {
            type: 'lang',
            regex: '\\\\br',
            replace: '<br/>'
          },
          {
            type: 'lang',
            regex: '\\[br\\]',
            replace: '<br/>'
          },
          {
            type: 'lang',
            regex: '\\[pull\\]',
            replace: '<br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>'
          },
          {
            type: 'lang',
            regex: '\\[footer\\]',
            replace: '<br/><br/><br/><br/><br/><br/><footer>'
          },
          {
            type: 'lang',
            regex: '\\[!footer\\]',
            replace: '</footer>'
          },
          {
            type: 'lang',
            regex: '\\[js\\]',
            replace: '<script type="text/javascript">$.emd.ready(function(){'
          },
          {
            type: 'lang',
            regex: '\\[!js\\]',
            replace: '});</script>'
          },
          {
            type: 'lang',
            regex: '\\[style\\]',
            replace: '<style>'
          },
          {
            type: 'lang',
            regex: '\\[!style\\]',
            replace: '</style>'
          },
          {
            type: 'lang',
            regex: '!\\[([^\\[\\]]*)\\]\\(([^\\(\\) ]*)( =([0-9]*)x([0-9]*))\\)',
            replace: '<img src="$2" alt="$1" style="width:$4px;height:$5px;"/>'
          }
        ];
      }


      var conv = (new Showdown.converter({extensions: ['table', extension]}));
      $('script[type=emd]').each(function(){
        var thiz = $(this);
        var el = $(conv.makeHtml('<div class="md-content md-root"><section data-name="default">'+thiz.html())+'</section></div>');
        el.each(function(){
          $(this).find('*').addClass('md_rendered');
          $(this).addClass('md_rendered');
        });
        el.find('style').each(function(){
          $('head').append($(this).clone());
          $(this).remove();
        });
        thiz.replaceWith(el);
      });
      $('div.md-manifest').first().each(function(){
        var man = $(this).text();
        man = "{"+man+"}";
        man = man.replace(/([A-Za-z\-]+)\S*:\S*(.*)/igm, "\"$1\":$2");

        var manifest = JSON.parse(man);

        manifest.title = manifest.title || '';
        $('#page-title-header').text(manifest.title)
        document.title = manifest.title;

        if(manifest.icon) {
          $('head').find('#favicon').remove();
          $('head').prepend('<link id="favicon" rel="shortcut icon" type="image/png" href="'+manifest.icon+'" />');
        }

        if(manifest['section-animation-timing']) {
          __onAnimateNewContentTimming__ = parseInt(manifest['section-animation-timing'])*2;
        }

        if(manifest['section-animation']) {
          var anim = manifest['section-animation'];
          if(anim == 'push-right') {
            __onAnimateNewContent__ = (function(newContent){
              newContent.css('position', 'absolute').css('left', '2000px').css('top', '0px');
              setTimeout(function(){
                newContent.animate({
                  left: 0,
                }, __onAnimateNewContentTimming__);
              }, 0);
            });
          } else if(anim == 'push-left') {
            __onAnimateNewContent__ = (function(newContent){
              newContent.css('position', 'absolute').css('left', '-2000px').css('top', '0px');
              setTimeout(function(){
                newContent.animate({
                  left: 0,
                }, __onAnimateNewContentTimming__);
              }, 0);
            });
          }
        }

      });
      $('table.md_rendered').addClass('table table-striped table-hover table-condensed table-responsive');
      $('code.md_rendered').each(function(){
          var thiz = $(this);
          thiz.removeClass('md_rendered');
          if(thiz.attr('class')) thiz.attr('data-language', thiz.attr('class'));
          //thiz.attr('class', '');
          thiz.addClass('prettyprint');
          thiz.addClass('md_rendered');
      });

      var call_f = (function(){
        $('code.md_rendered[data-language]').each(function(){
          var thiz = $(this);
          var codeSegment = thiz.parent();
          codeSegment.wrap('<div class="code-preview md_rendered"></div>');
          codeSegment = codeSegment.parent();

          var codePreviewCopy = $('<span class="code-preview-coloured-provider md_rendered" style="display:none;"></span>')
          codePreviewCopy.append(codeSegment.clone());

          codePreviewMenu = $('<div class="code-preview-menu md_rendered"><nav class="navbar navbar-default navbar-static-top"><div class="container"><ul class="menu-content md_rendered nav navbar-nav"></ul></div></nav></div>');
          var codePreviewMenuC = codePreviewMenu.find('.menu-content');

          var codePreviewOption_viewCode = $('<li data-option-action="code" class="code-preview-menu-option md_rendered active"><a>Code</a></li>');
          var codePreviewOption_viewRaw = $('<li data-option-action="raw" class="code-preview-menu-option md_rendered"><a>View raw</a></li>');

          codePreviewMenuC
            .append(codePreviewOption_viewCode)
            .append(codePreviewOption_viewRaw);

          codeSegment.append(codePreviewCopy);
          codeSegment.prepend(codePreviewMenu);
        });

        emdReady = true;
        $('section.md-section').each(function(){
          sections.push($(this));
          if($(this).data('name') != 'default' && $(this).hasClass('md-section-hard')) {
            $(this).remove();
          }
        });
        $('#navigation-header').html('');
        for(var i=0;i<sections.length;++i) {
          var el = $('<li><a id="navigation-option-'+sections[i].data('name').replace(' ','-')+'">'+sections[i].data('name')+'</a></li>');
          el.data('name', sections[i].data('name'));
          el.click(function(){
            jumpToSection($(this).data('name'));
          });
          $('#navigation-header').append(el);
        }
        $('span.md-box').each(function(){
          var thiz = $(this);
        });
        jumpToSection(sections[0].data('name'));

        emdReady = true;
        __onRefresh__();
      });
      call_f();
      prettyPrint();
      //window.callback = call_f;

    });

    __initCore__();
    $('#sidebar').smartAffix({
      selector: 'h2'
    });

  });

  $.emd = {
    init: init,
    ready: function(callback) {
      if(emdReady) {
        callback();
      }
    }
  };
})($);
