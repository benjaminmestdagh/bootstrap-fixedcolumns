/*
 * jQuery plugin to set a number of columns on a Bootstrap 3 responsive table as fixed.
 * Inspired by http://stackoverflow.com/q/19737306
 * 
 * Copyright (c) 2016 - Benjamin Mestdagh
 * License: MIT
 * 
 */
(function ($) {
    "use strict";

    var setHeight = function (fixedTable, otherTable) {
        fixedTable.find("tr").each(function (i, elem) {
            var thisHeight = $(elem).outerHeight();
            var otherHeight = otherTable.find("tr:eq(" + i + ")").outerHeight();
            if(thisHeight > otherHeight && $(elem).find("th, td").html() !== "") {
                otherTable.find("tr:eq(" + i + ") th, tr:eq(" + i + ") td").outerHeight(thisHeight);
            } else {
                $(elem).find("th, td").outerHeight(otherHeight);
            }
        });
    };

    var setWidth = function (fixedTable, otherTable) {
        var width = fixedTable.width();
        otherTable.css("marginLeft", width);
    };

    var setTableDimensions = function (fixedTable, otherTable) {
        setHeight(fixedTable, otherTable);
        setWidth(fixedTable, otherTable);
    };

    $.fn.fixedColumns = function (cols) {

        var colsToFix = cols || 1;

        this.each(function (index, currentItem) {
            var originalTable = $(currentItem);
            if(!originalTable.is("table") || !originalTable.parent().is(".table-responsive")) {
                console.warn("fixedColumns: only applicable to Bootstrap responsive tables.");
                return;
            }

            var fixedColumnTable = originalTable.clone()
                .insertBefore(originalTable)
                .addClass("fixed-columns");

            var nthChildSelector = ":nth-child(-n+" + colsToFix + ")";
            fixedColumnTable.find("th:not(" + nthChildSelector + "), td:not(" + nthChildSelector + ")").remove();
            originalTable.find("th" + nthChildSelector + ", td" + nthChildSelector).remove();

            setTableDimensions(fixedColumnTable, originalTable);

            // Recalculate dimensions in case a row was added..
            var observer = new MutationObserver(function (mutations) {
                setTableDimensions(fixedColumnTable, originalTable);
            });

            var config = { childList: true, characterData: true, subtree: true };
            var target = originalTable.get(0);
            observer.observe(target, config);

            // ..and also when window has been resized
            var resizeTimer;
            $(window).on("resize", function () {
                clearTimeout(resizeTimer);
                resizeTimer = setTimeout(function () {
                    setTableDimensions(fixedColumnTable, originalTable);
                }, 250);
            });
        });

        return this;
    };
}(jQuery));