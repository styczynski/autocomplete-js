/**
 * autocomplete.js 1.0.4
 * http://isis97.github.io/autocomplete-js/
 *
 * jQuery plugin
 * Remake of the complete-ly.js (c) by Lorenzo Puccetti - 2013
 *
 * MIT Licensing
 * Copyright (c) 2015 Piotr Aleksander Styczynski
 *
 * This Software shall be used for doing good things, not bad things.
 *                  - Lorenzo Puccetti
 *
 * This is a simple autocomple library.
 * The autocomple.js supports dynamic suggestions and history browsing.
 * To set up autocomplete just use jQuery $('#div').autocomplete({ options: ["apple", "bannana", "strawberry", "pineapple"] })
 *
 * You can easily manipulate the suggestions list and history directly:
 *
 * var ac = $('#div').autocomplete({ options: ["apple", "bannana", "strawberry", "pineapple"] });
 * ac.options = ["nope"]; //override suggestions list
 * ac.historyInput = []; //clear history
 * ac.options = [ {name:"option", "description":"description of the option", html: true} ] //Advanced suggestions (with descriptions)
 *
 **/

(function($){
	$.fn.extend({
		autocomplete: function(settings) {
			var container = $(this);

			if(settings == null || settings == {} || settings == undefined) {
				return null;
	    }

			if(container.length > 1) {
				var ret = [];
				for(var i=0;i>container.length;++i) {
						ret.push($(container[i]).autocomplete(settings));
				}
				return ret;
			}

			settings = settings || {};
			settings.showWhenEmpty = settings.showWhenEmpty || false;
			settings.isDisabled = settings.isDisabled || false;
			settings.onConfirmed = settings.onConfirmed || function(){};
			settings.onChanged = settings.onChanged || function(){};
			settings.onHistoryBrowsed = settings.onHistoryBrowsed || function(){};
			settings.onKey = settings.onKey || function(){};
	    settings.inputWidth = settings.inputWidth || '100%';
			settings.inputHeight = settings.inputHeight || '25px';
			settings.dropDownWidth = settings.dropDownWidth || '50%';
			settings.dropDownDescriptionBoxWidth = settings.dropDownDescriptionBoxWidth || '50%';
			settings.fontSize = settings.fontSize || null;
			settings.fontFamily = settings.fontFamily || null;
			settings.formPromptHTML = settings.formPromptHTML || '';
			settings.color = settings.color || null;
			settings.hintColor = settings.hintColor || null;
			settings.backgroundColor = settings.backgroundColor || null;
			settings.dropDownBorderColor = settings.dropDownBorderColor || null;
			settings.dropDownZIndex = settings.dropDownZIndex || '100';
			settings.dropDownOnHoverBackgroundColor = settings.dropDownOnHoverBackgroundColor || null;
	    settings.enableHistory = settings.enableHistory || true;
	    settings.inputHistory = settings.inputHistory || [];
	    settings.classes = settings.classes || {};
			settings.classes.input = settings.classes.input || null;
	    settings.classes.dropdown = settings.classes.dropdown || null;
	    settings.classes.hint = settings.classes.hint || null;
	    settings.classes.wrapper = settings.classes.wrapper || null;
	    settings.classes.prompt = settings.classes.prompt || null;
	    settings.classes.hoverItem = settings.classes.hoverItem || null;
	    settings.classes.row = settings.classes.row || null;
			settings.classes.descriptionBox = settings.classes.descriptionBox || null;
	    settings.maxSuggestionsCount = settings.maxSuggestionsCount || 100;
	    settings.suggestionBoxHeight = settings.suggestionBoxHeight || '75px';
	    settings.showDropDown = settings.showDropDown || false;
			settings.dropDownPosition = settings.dropDownPosition || 'bottom';
			settings.blockEvents = settings.blockEvents || true;
			settings.options = settings.options || {};

			var rs = {};

			var formInput = $('<input class="autocomplete autocomplete-input" type="text" spellcheck="false"></input>')
	      .css('width', settings.inputWidth)
				.css('height', settings.inputHeight)
			  .css('outline', '0')
			  .css('border', '0')
			  .css('margin', '0')
		    .css('padding', '0')
	  		.css('verticalAlign', 'top')
	  		.css('position', 'absolute')
				.css('background-color', 'transparent')
	      .addClass(settings.classes.input);

			var formHint = formInput.clone()
				.css('background-color', '')
	      .css('width', settings.inputWidth)
				.css('height', settings.inputHeight)
			  .attr('disabled', '')
			  .css('position', 'absolute')
			  .css('top', 'inherit')
			  .css('left', 'inherit')
			  .css('borderColor', 'transparent')
			  .css('boxShadow', 'none')
			  .css('color', settings.hintColor)
	      .addClass('autocomplete-hint')
	      .addClass(settings.classes.hint);

			formHint.__val = formHint.val;
			formHint.val = function(text) {
				if((text == undefined) || (text == null)) {
						return formHint.__val();
				}
				formHint.__val(text);
			};

			var formWrapper = $('<div class="autocomplete autocomplete-wrapper"></div>')
				.css('display', 'inline')
	      .css('width', settings.inputWidth)
				.css('height', settings.inputHeight)
			  .css('position', 'absolute')
			  .css('bottom', '0px')
			  .css('outline', '0')
			  .css('border', '0')
			  .css('margin', '0')
			  .css('padding', '0')
			  .css('paddingTop', '10px')
	      .addClass(settings.classes.wrapper);

			var formPrompt = $('<div class="autocomplete autocomplete-prompt"></div>')
			  .css('position', 'absolute')
			  .css('outline', '0')
			  .css('margin', '0')
			  .css('padding', '0')
			  .css('border', '0')
			  .css('top', '0')
			  .css('left', '0')
			  .css('overflow', 'hidden')
			  .html(settings.formPromptHTML)
	      .addClass(settings.classes.prompt);

			if ($('body') === undefined) {
				throw 'document.body is undefined. The library was wired up incorrectly.';
			}
			$('body').append(formPrompt);

			var w = formPrompt.width();
			formWrapper.append(formPrompt);

			formPrompt
	      .show()
			  .css('left', '-' + w + 'px')
			  .css('marginLeft', w + 'px');


			var dropDown = $('<div class="autocomplete autocomplete-dropdown"></div>')
			  /*.css('position', 'absolute')
				.css('top', settings.suggestionBoxHeight)*/
				.css('height', settings.suggestionBoxHeight)
				.css('width', settings.dropDownWidth)
			  .hide();

			var dropDownTopOffset = dropDown.height()/2;
			if(settings.dropDownPosition == 'top') {
				dropDownTopOffset = -(dropDown.height()/2)-formInput.height();
			}

			dropDown
				.css('float', 'bottom')
				.css('position', 'absolute')
				.css('z-index', '9999')
				.css('left', '0px')
				.css('top', dropDownTopOffset+'px')
				.css('outline', '0')
			  .css('margin', '0')
			  .css('padding', '0')
			  .css('text-align', 'left')
			  .css('font-size', settings.fontSize)
			  .css('font-family', settings.fontFamily)
			  .css('max-height', settings.suggestionBoxHeight)
			  .css('background-color', settings.backgroundColor)
			  .css('z-index', settings.dropDownZIndex)
			  .css('cursor', 'default')
			  .css('border-style', 'solid')
			  .css('border-width', '1px')
			  .css('border-color', settings.dropDownBorderColor)
			  .css('overflow-x', 'hidden')
			  .css('white-space', 'pre')
			  .css('overflow-y', 'scroll')
	      .addClass(settings.classes.dropdown);

				var dropDownDescriptionBox = $('<div class="autocomplete autocomplete-dropdown-description-box"></div>')
					.css('position', 'absolute')
					.css('left', settings.dropDownWidth)
					.css('top', dropDownTopOffset+'px')
					/*.css('top', '-'+settings.suggestionBoxHeight)*/
					.hide()
					.css('word-break', 'keep-all')
					.css('white-space', 'normal')
					.css('outline', '0')
					.css('margin', '0')
					.css('padding', '0')
					.css('text-align', 'left')
					.css('font-size', settings.fontSize)
					.css('font-family', settings.fontFamily)
					.css('max-height', settings.suggestionBoxHeight)
					.css('background-color', settings.backgroundColor)
					.css('z-index', settings.dropDownZIndex)
					.css('cursor', 'default')
					.css('border-style', 'solid')
					.css('border-width', '1px')
					.css('border-color', settings.dropDownBorderColor)
					.css('overflow-x', 'hidden')
					.css('overflow-y', 'scroll')
					.css('height', settings.suggestionBoxHeight)
					.css('width', settings.dropDownDescriptionBoxWidth)
					.addClass(settings.classes.descriptionBox);

			dropDownDescriptionBox.hideBlock = function () {
				dropDownDescriptionBox.attr('display', 'none');
			};
			dropDownDescriptionBox.showBlock = function () {
				dropDownDescriptionBox.attr('display', 'block');
			};

			var escapeHtml = function(unsafe) {
			    return unsafe
			         .replace(/&/g, "&amp;")
			         .replace(/</g, "&lt;")
			         .replace(/>/g, "&gt;")
			         .replace(/"/g, "&quot;")
			         .replace(/'/g, "&#039;");
			}

			var extractOption = function(elem) {
				var opt_name = "";
				var opt_description = null;

				elem = elem || {};
				if(elem.html == undefined || elem.html == null) {
					elem.html = false;
				}
				if(elem.name != undefined && elem.name != null) {
					opt_name = elem.name;
					if(elem.description) {
						opt_description = elem.description;
						if(!elem.html) {
							if(opt_description) {
								opt_description = escapeHtml(opt_description);
							}
						}
					}
				} else {
					opt_name = elem;
				}

				opt_name = opt_name || '';
				opt_description = opt_description || null;
				elem.html = elem.html || false;

				return {name:opt_name, description:opt_description, html:elem.html};
			};

			var createDropDownController = function(elem) {
				var rows = [];
				var ix = 0;
				var oldIndex = -1;

				var onMouseOver = function() {
					$(this).css('outline', '1px solid #ddd');
				}
				var onMouseOut = function() {
					$(this).css('outline', '0');
				}
				var onMouseDown = function() {
					p.hide();
					p.onMouseSelected(this.__hint);
				}

				var p = {
					hideBlock: function () {
						elem.attr('display', 'none');
					},
					showBlock: function () {
						elem.attr('display', 'block');
					},
					hide: function() {
						elem.hide();
					},
					refresh: function(token, array) {
						elem.hide();
						ix = 0;
						elem.html("");
						var vph = (window.innerHeight || document.documentElement.clientHeight);
						var distanceToTop = elem.offset().top - 6;
						var distanceToBottom = vph - (elem.parent().height() - elem.height() - elem.offset().top) - 6;

						rows = [];
						var maxOptionsCount = 100;
						var curOptionsCount = 0;
						for (var i = 0; i < array.length; i++) {
							var opt = extractOption(array[i]);
							var opt_name = opt.name;
							var opt_description = opt.description;

							if (opt_name.toLowerCase().indexOf(token.toLowerCase()) === 0) {
	              ++curOptionsCount;
	  						if (curOptionsCount > settings.maxSuggestionsCount) {
	  							break;
	  						}
	  						var divRow = $('<div></div>')
	                .css('color', settings.color)
	  						  .mouseover(onMouseOver)
	  						  .mouseout(onMouseOut)
	  						  .mousedown(onMouseDown)
	                .addClass(settings.classes.row);

	              divRow[0].__hint = divRow.__hint = opt_name;
								divRow.html(token + '<b>' + opt_name.substring(token.length) + '</b>');
								divRow.description = opt_description;

	  						rows.push(divRow);
	  						elem.append(divRow);
	            }
						}

						if(rows.length>1) {
							if(rows[0].description) {
								dropDownDescriptionBox.show();
								if(rows[0].html) {
									dropDownDescriptionBox.html(rows[0].description);
								} else {
									dropDownDescriptionBox.text(rows[0].description);
								}
							} else {
								dropDownDescriptionBox.hide();
							}
						} else {
							dropDownDescriptionBox.hide();
						}


						if (rows.length === 0) {
							return;
						}
						if (rows.length === 1 && token === rows[0].__hint) {
							return;
						}

						if (rows.length < 2) return;
						p.highlight(0);

						if (distanceToTop > distanceToBottom * 3) {
							elem
	              .css('maxHeight', distanceToTop + 'px')
							  /*.css('top', '')*/
							  .css('bottom', '100%');
						} else {
							elem
	              /*.css('top', '100%')*/
							  .css('bottom', '')
							  .css('maxHeight', distanceToBottom + 'px');
						}
						elem.show();

					},
					highlight: function(index) {
						if (oldIndex != -1 && rows[oldIndex]) {
							rows[oldIndex].css('backgroundColor', settings.backgroundColor);
						}
	          dropDown.find(settings.classes.hoverItem).removeClass(settings.classes.hoverItem);
	          var oldFocusedItem = dropDown.find('.autocomplete-hover-item');
						oldFocusedItem.removeClass(settings.classes.hoverItem);
						oldFocusedItem.removeClass('autocomplete-hover-item');

						if(rows[index].description) {
							dropDownDescriptionBox.show();
							if(rows[index].html) {
								dropDownDescriptionBox.html(rows[index].description);
							} else {
								dropDownDescriptionBox.text(rows[index].description);
							}
						} else {
							dropDownDescriptionBox.hide();
						}

						rows[index].css('backgroundColor', settings.dropDownOnHoverBackgroundColor);
	          rows[index].addClass(settings.classes.hoverItem);
	          rows[index].addClass('autocomplete-hover-item');
						oldIndex = index;

					},
					move: function(step) {
						if (!elem.is(':visible')) return '';
						if (ix + step === -1 || ix + step === rows.length) return rows[ix].__hint;
						ix += step;
						p.highlight(ix);
						dropDown.scrollTop(dropDown.scrollTop() + step * dropDown.children().height());
						return rows[ix].__hint;
					},
					onMouseSelected: function() {}
				};
				return p;
			}

			var dropDownController = createDropDownController(dropDown);

			dropDownController.onMouseSelected = function(text) {
				formInput.val(leftSide + text);
				formHint.val(leftSide + text);
				rs.onChange(formInput.val());
				registerOnTextChangeOldValue = formInput.val();
				setTimeout(function() {
					formInput.focus();
				}, 0);
			}

	    if(!settings.showDropDown) {
	      dropDown.css('visibility', 'hidden');
	      dropDown.css('display', 'none');
				dropDownDescriptionBox.css('visibility', 'hidden');
				dropDownDescriptionBox.css('display', 'none');
	    } else {
	      formWrapper.append(dropDown);
				formWrapper.append(dropDownDescriptionBox);
			}
			formWrapper.append(formHint);
			formWrapper.append(formInput);

			container.append(formWrapper);

			var spacer;
			var leftSide;

			function calculateWidthForText(text) {
				if (spacer === undefined) {
					spacer = $('<span></span>')
				    .hide()
					  .css('position', 'fixed')
					  .css('outline', '0')
					  .css('margin', '0')
					  .css('padding', '0')
					  .css('border', '0')
					  .css('left', '0')
					  .css('white-space', 'pre')
					  .css('font-size', settings.fontSize)
					  .css('font-family', settings.fontFamily)
					  .css('font-weight', 'normal');
					$("body").append(spacer);
				}
				spacer.text(text);
				var t = spacer.width();
				spacer.remove();
				return t;
			}


			rs = {
				status: !settings.isDisabled,
				onKey: function(e) {
					settings.onKey(e);
					return this;
				},
				disable: function() {
					this.status = false;
					return this;
				},
				enable: function() {
					this.status = true;
					return this;
				},
				showDropDown: function() {
					dropDown.show();
					this.repaint();
				},
				isEnabled: function() {
					return this.status;
				},
				onArrowDown: function() {return this;},
				onArrowUp: function() {return this;},
				onEnter: function() {
	        this.inputHistory.push(formInput.val());
					settings.onConfirmed(this, this.getText());
					return this;
	      },
				onTab: function() {return this;},
				onChange: function() {
					settings.onChanged(this, this.getText());
					rs.repaint();
					return this;
				},
	      onHistoryPrev: function() {
					settings.onHistoryBrowsed(this, this.getInputHistory());
	        formInput.val(this.historyNavigatePrev());
					return this;
				},
	      onHistoryNext: function() {
					settings.onHistoryBrowsed(this, this.getInputHistory());
	        formInput.val(this.historyNavigateNext());
					return this;
				},
	      getInputHistory: function() {
	        return this.inputHistory;
	      },
				getOptions: function() {
					if(this.options instanceof Function) {
						var text = formInput.val();
						var startFrom = rs.startFrom;
						var tokens = text.substring(startFrom).split(" ");
						var token = tokens[tokens.length - 1];
						return this.options(this, text, token);
					}
					return this.options;
				},
				startFrom: 0,
				options: settings.options,
	      inputHistory: settings.inputHistory,
	      historyIndex: 0,
	      historyBrowsingActive: false,
				formWrapper: formWrapper,
				input: formInput,
				hint: formHint,
				dropDown: dropDown,
				formPrompt: formPrompt,
	      historyNavigateNext: function() {
	        this.historyIndex++;
	        if(this.historyIndex >= this.inputHistory.length) {
	          this.historyIndex = this.inputHistory.length - 1;
	        }
	        return this.inputHistory[this.historyIndex];
	      },
	      historyNavigatePrev: function() {
	        this.historyIndex--;
	        if(this.historyIndex < 0) {
	          this.historyIndex = 0;
	        }
	        return this.inputHistory[this.historyIndex];
	      },
	      historyNavigateClear: function() {
	        this.historyIndex = this.inputHistory.length - 1;
	      },
				setText: function(text) {
					formHint.val(text);
					formInput.val(text);
					return this;
				},
				getText: function() {
					return formInput.val();
				},
				pullText: function() {
					var t = this.getText();
					this.setText('');
					return t;
				},
				hideDropDown: function() {
					dropDownController.hide();
					return this;
				},
				repaint: function() {

					var text = formInput.val();
					var startFrom = rs.startFrom;
					var options = rs.getOptions();

					var optionsLength = options.length;

					var tokens = text.substring(startFrom).split(" ");
					var token = tokens[tokens.length - 1];
					leftSide = "";
					for (var i = 0; i < tokens.length - 1; ++i) {
						leftSide += tokens[i] + " ";
					}

					formHint.val('');
					for (var i = 0; i < optionsLength; i++) {
						var opt = extractOption(options[i]);
						var opt_name = opt.name;
						if(opt_name.indexOf == undefined) {
							console.log(opt_name);
							throw "NOPE!";
						}
						if (opt_name.indexOf(token) === 0) {
							formHint.val(leftSide + opt_name);
							break;
						}
					}

					if(!this.status) {
							dropDownController.hideBlock();
							dropDownDescriptionBox.hideBlock();
							return this;
					} else {
						dropDownController.showBlock();
						dropDownDescriptionBox.showBlock();
					}

					dropDown.css('left', calculateWidthForText(leftSide) + 'px');
					if (token == '') {
						if(settings.showWhenEmpty) {
							dropDownController.refresh(token, rs.getOptions());
						} else {
							dropDownController.refresh(token, []);
						}
					} else {
						dropDownController.refresh(token, rs.getOptions());
					}


				}
			};

			var registerOnTextChangeOldValue;
			var registerOnTextChange = function(txt, callback) {
				registerOnTextChangeOldValue = txt.val();
				var handler = function() {
					var value = txt.val();
					if (registerOnTextChangeOldValue !== value) {
						registerOnTextChangeOldValue = value;
						callback(value);
					}
				};
				txt.change(handler);
				txt.keyup(handler);
			};


			registerOnTextChange(formInput, function(text) {
				rs.onChange(text);
			});


			var keyDownHandler = function(e) {
				e = e || window.event;
				var keyCode = e.keyCode;

				var prevent = function(event) {
					if(settings.blockEvents) {
						event.preventDefault();
					}
				}

	      if(formInput.val() == "") {
	        rs.historyBrowsingActive = true;
	      }

				/*
				if (keyCode == 33) {
					return;
				} // page up
				else if (keyCode == 34) {
					return;
				} // page down
				*/
	      if (keyCode == 27) { //escape
					prevent(e);
					dropDownController.hide();
					dropDownDescriptionBox.hide();
					formHint.val(formInput.val());
					formInput.focus();
					return this;
				} else if (keyCode == 39 || keyCode == 35 || keyCode == 9) {
					prevent(e);
					if (keyCode == 9) {
						e.preventDefault();
						e.stopPropagation();
						if (formHint.val().length == 0) {
							rs.onTab();
							rs.onKey(e);
						}
					}
					if (formHint.val().length > 0) {
						dropDownController.hide();
						dropDownDescriptionBox.hide();
						formInput.val(formHint.val());
						var hasTextChanged = registerOnTextChangeOldValue != formInput.val()
						registerOnTextChangeOldValue = formInput.val();
						if (hasTextChanged) {
							rs.onChange(formInput.val());
						}
					}
					return this;
				} else if (keyCode == 13) { //enter
					prevent(e);
					if (formHint.val().length == 0) {
						rs.onEnter();
					} else {
						var wasDropDownHidden = (!dropDown.is(':visible'));
						dropDownController.hide();

						if (wasDropDownHidden) {
							formHint.val(formInput.val());
							formInput.focus();
							rs.onEnter();
							return this;
						}

						formInput.val(formHint.val());
						var hasTextChanged = registerOnTextChangeOldValue != formInput.val()
						registerOnTextChangeOldValue = formInput.val();

						if (hasTextChanged) {
							rs.onChange(formInput.val());
						}

					}
					return this;
				} else if (keyCode == 40) { // down
	        prevent(e);
					if(settings.enableHistory && rs.historyBrowsingActive) {
	          rs.onHistoryPrev();
	        } else {
	  				var m = dropDownController.move(+1);
	  				if (m == '') {
	  					rs.onArrowDown();
	  				}
	  				formHint.val(leftSide + m);
	  				return this;
	        }
				} else if (keyCode == 38) { // up
	        prevent(e);
					if(settings.enableHistory && rs.historyBrowsingActive) {
	          rs.onHistoryNext();
	        } else {
					  var m = dropDownController.move(-1);
					  if (m == '') {
				      rs.onArrowUp();
					  }
					  formHint.val(leftSide + m);
					}
	        return this;
				} else {
	        rs.historyBrowsingActive = false;
	        rs.historyNavigateClear();
					rs.onKey(e);
	      }
				formHint.val('');
				return this;
			};

			formInput.keydown(keyDownHandler);

			return rs;
		}
	});
})($);
