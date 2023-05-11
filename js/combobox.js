/*
 ComboBox Object
 http://www.zoonman.com/projects/combobox/

 Copyright (c) 2011, Tkachev Philipp
 All rights reserved.
 BSD License

 */
ComboBox = function(object_name) {
    // Edit element cache
    this.edit = document.getElementById(object_name);
    // Items Container
    var ddl = document.getElementById(object_name)
        .parentNode
        .getElementsByTagName('DIV');
    this.dropdownlist = ddl[0];

    this.highlightIndex = null;
    this.dropdownHiding = false;
    this.stopPropogate = this.edit.getAttribute("stopPropagate");

    // Closure Object
    var parobject = this;
    // Picker
    // this.picker = document.getElementById(object_name)
    //     .parentNode
    //     .getElementsById('SPAN')[0];
    this.picker = document.getElementById(object_name).parentNode.querySelector("#picker");
    this.picker.onclick = function() {
        if (!parobject.dropdownHiding) {
            parobject.edit.focus();
        }
    };

    this.isDropDownVisible = function () {
        return parobject.dropdownlist.style.display === 'block';
    };

    this.setDropDownVisible = function(flag) {
        if (flag) {
            parobject.dropdownlist.style.display = 'block';
        } else {
            parobject.dropdownlist.style.display = 'none';
        }
    }

    // Show Items when edit get focus
    this.edit.onfocus = function() {
        parobject.setDropDownVisible(true);
    };
    // Hide Items when edit lost focus
    this.edit.onblur = function() {
        parobject.dropdownHiding = true;
        setTimeout(function() {
                parobject.dropdownHiding = false;
                parobject.setDropDownVisible(false);
            },
            150
        );
    };

    this.removeBoldTags = function() {
        for (var i = 0; i < parobject.listitems.length; i++) {
            var item = parobject.listitems[i];
            var upv = item.innerHTML;
            upv = upv.replace(/\<b\>/ig, '');
            upv = upv.replace(/\<\/b\>/ig, '');
            item.innerHTML = upv;
        }
    };

    this.hideDropdown = function() {
        parobject.dropdownlist.style.display = 'none';
        parobject.currentitem = null;
        parobject.currentitemindex = null;
    }

    this.setEditValue = function(inputValue) {
        parobject.removeBoldTags();
        parobject.edit.value = inputValue;
        var trigger = parobject.edit.getAttribute("onchange");
        if (trigger) {
            eval(trigger);
        }
    };

    this.addItemListener = function(item) {
        item.onclick = function() {
            var upv = this.innerHTML;
            upv = upv.replace(/\<b\>/ig, '');
            upv = upv.replace(/\<\/b\>/ig, '');
            parobject.setEditValue(upv);

            parobject.hideDropdown();
            return false;
        };
    };

    this.addItem = function(item) {
        this.dropdownlist.innerHTML += "<a>" + item + "</a>";
        for (var i = 0; i < parobject.listitems.length; i++) {
            var item = parobject.listitems[i];
            if (!item.onclick) {
                parobject.addItemListener(item);
                parobject.visibleItems.push(item);
            }
        }
    };

    this.initCombobox = function() {
        parobject.listitems = this.dropdownlist.getElementsByTagName('A');
        for (var i = 0; i < parobject.listitems.length; i++) {
            var item = parobject.listitems[i];
            parobject.addItemListener(item);
        }
        parobject.clearFilter();
    };

    this.removeHighlights = function() {
        for (var i = 0; i < parobject.listitems.length; i++) {
            parobject.listitems[i].classList.remove('light');
            parobject.highlightIndex = null;
        }
    }

    this.highlight = function(index) {
        parobject.removeHighlights();
        parobject.visibleItems[index].classList.add('light');
        parobject.highlightIndex = index;
    }

    this.highlightNext = function(step) {
        if (parobject.visibleItems.length <= 0) return;
        var index = parobject.highlightIndex == null ? -1 : parobject.highlightIndex;
        index += step;
        if (index < 0) index = parobject.visibleItems.length - 1;
        if (index > parobject.visibleItems.length - 1) index = 0;
        parobject.highlight(index);

    }
    // Binding OnKeyDown Event
    // this.edit.onkeydown = function(e) {
    //     e = e || window.event;
    //     // Move Selection Up
    //
    // };
    this.edit.onkeydown = function(e) {
        e = e || window.event;
        if (e.keyCode === 38) {
            if (!parobject.isDropDownVisible()) {
                parobject.setDropDownVisible(true);
                return false;
            }
            // up
            parobject.highlightNext(-1);
            e.cancelBubble = true;
            if (navigator.appName !== 'Microsoft Internet Explorer') {
                e.preventDefault();
                e.stopPropagation();
            }
            return false;
        }
        // Move Selection Down
        else if (e.keyCode === 40) {
            if (!parobject.isDropDownVisible()) {
                parobject.setDropDownVisible(true);
                return false;
            }
            parobject.highlightNext(1);
            // down
            e.cancelBubble = true;
            if (navigator.appName != 'Microsoft Internet Explorer') {
                e.preventDefault();
                e.stopPropagation();
            }
            return false;
        }
        else if (e.keyCode === 13) {
            // enter
            if (parobject.visibleItems.length > 0 && parobject.highlightIndex != null) {
                var upv = parobject.visibleItems[parobject.highlightIndex].innerHTML;
                upv = upv.replace(/\<b\>/ig, '');
                upv = upv.replace(/\<\/b\>/ig, '');
                parobject.setEditValue(upv);
            } else {
                parobject.setEditValue(parobject.edit.value);
            }
            parobject.setDropDownVisible(false);
            e.cancelBubble = true;
            return false;
        } else if (e.keyCode === 8 || e.keyCode == 46) {
            //backspace
            var direction1 = e.keyCode === 8 ? -1: 0;
            var direction2 = e.keyCode === 8 ? 0: 1;
            var value = parobject.edit.value;
            if  (value && value.length > 0) {
                var selectionStart = parobject.edit.selectionStart;
                var selectionEnd = parobject.edit.selectionEnd;
                if (selectionStart != selectionEnd) {
                    value = value.substr(0,selectionStart) + value.substr(selectionEnd, value.length - 1);
                } else {
                    value = value.substr(0,selectionStart + direction1) + value.substr(selectionEnd + direction2, value.length - 1);
                }
                parobject.filter(value);
            }
        }
        if (parobject.stopPropogate) {
            e.stopPropagation();
        }
    };
    // event.type должен быть keypress
    this.getChar = function(event) {
        if (event.which == null) { // IE
            if (event.keyCode < 32) return null; // спец. символ
            return String.fromCharCode(event.keyCode)
        }

        if (event.which != 0 && event.charCode != 0) { // все кроме IE
            if (event.which < 32) return null; // спец. символ
            return String.fromCharCode(event.which); // остальные
        }

        return null; // спец. символ
    };

    this.clearFilter = function() {
        parobject.visibleItems = [];
        for (var i = 0; i < parobject.listitems.length; i++) {
            var display = 'block';
            parobject.listitems[i].style.display = display;
            if (display === 'block')
                parobject.visibleItems.push(parobject.listitems[i]);
        }
    };

    this.filter = function(value) {
        parobject.removeHighlights();
        parobject.removeBoldTags();
        parobject.dropdownlist.style.display = 'block';
        if (value === '') {
            parobject.clearFilter();
        }
        else {
            var re = new RegExp('(' +value + ')', "i");
            parobject.visibleItems = [];
            for (var i = 0; i < parobject.listitems.length; i++) {
                var pv = parobject.listitems[i].innerHTML;
                if (re.test(pv)) {
                    parobject.listitems[i].style.display = 'block';
                    parobject.listitems[i].innerHTML = pv.replace(re, '<b>$1</b>');
                    parobject.visibleItems.push(parobject.listitems[i]);
                }
                else {
                    parobject.listitems[i].style.display = 'none';
                }
            }
            if (parobject.visibleItems.length == 0) {
                parobject.clearFilter();
            }
        }
    };

    this.edit.onkeypress = function(e) {
        var newChar = parobject.getChar(e);
        if (newChar) parobject.filter(parobject.edit.value + parobject.getChar(e));
        if (parobject.stopPropogate) {
            e.stopPropagation();
        }
    }


    this.setItems = function(items) {
        this.dropdownlist.innerHTML = "";
        this.edit.value = "";
        for (var i = 0; i < items.length; i++) {
            this.dropdownlist.innerHTML += "<a>" + items[i] + "</a>";
        }
        this.initCombobox();
    };

    this.initCombobox();
};
