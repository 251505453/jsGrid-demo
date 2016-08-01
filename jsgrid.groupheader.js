(function($, jsGrid) {
    $.extend(true, jsGrid.Grid.prototype, {
        _createHeaderWidthRow: function() {
            var $result = $("<tr>").addClass(this.headerRowClass);
            this._eachField(function(field, index) {
                var $th = $('<th>')
                    .width(field.width)
                    .height(0)
                    .appendTo($result);
            });
            return $result;
        },
        _createHeaderRow: function() {
            var _this = this;
            if ($.isFunction(this.headerRowRenderer))
                return $(this.renderTemplate(this.headerRowRenderer, this));
            this.groupHeaders = this.groupHeaders || [];
            if (this.groupHeaders.length > 0) {
                var groups = [];
                $.each(this.groupHeaders, function(index, groupHeader) {
                    var group = {};
                    group.name = groupHeader.name;
                    group.items = [_this._normalizeField(groupHeader.startColumnName)];
                    group.startIndex = _this._visibleFieldIndex(group.items[0]);
                    group.width = group.items[0].width;
                    for (var i = 1; i < groupHeader.numberOfColumns; i++) {
                        var item = _this._normalizeField(group.startIndex + i);
                        group.width += item.width;
                        group.items.push(item);
                    }
                    groups.push(group);
                });
                this._group = groups;
            }

            function addFieldSorting($th, field) {
                $th.addClass(_this.sortableClass)
                    .on("click", $.proxy(function() {
                        _this._clearSortingCss();
                        _this._setSortingParams(field, field.order);
                        $th.addClass(_this._sortOrder === 'asc' ? _this.sortAscClass : _this.sortDescClass);
                        _this._loadStrategy.sort();
                    }, this));
            }
            var $thead = $('<thead>');
            var $result = $("<tr>").addClass(this.headerRowClass);
            this._eachField(function(field, index) {
                var $th = this._prepareCell("<th>", field, "headercss", this.headerCellClass)
                    .append(this.renderTemplate(field.headerTemplate, field));
                if (this.sorting && field.sorting) {
                    addFieldSorting($th, field);
                }
                if (this._group.length > 0) {
                    var group = this._group.filter(function(group) {
                        return $.inArray(field.name, group.items.map(function(i) {
                            return i.name
                        })) != -1;
                    })[0];
                    if (group) {
                        if (index != group.startIndex)
                            return;
                        $th = $('<th>')
                            .addClass(this.headerCellClass || "headercss")
                            .css('border-bottom', '1px solid #e9e9e9')
                            .append(group.name);
                        $th.attr('colspan', group.items.length);
                        $th.css("width", group.width);
                    } else {
                        $th.attr('rowspan', 2);
                    }
                }
                $result.append($th);
            });
            $thead.append($result)
            if (this._group.length > 0) {
                var $group = $("<tr>").addClass(this.headerRowClass);
                $.each(this._group, function(index, groupHeader) {
                    $.each(groupHeader.items, function(index, field) {
                        var $th = _this._prepareCell("<th>", field, "headercss", _this.headerCellClass)
                            .append(_this.renderTemplate(field.headerTemplate, field));
                        if (this.sorting && field.sorting) {
                            addFieldSorting($th, field);
                        }
                        $group.append($th);
                    });
                });
                $thead.append($group);
            }
            return $thead;
        },
        _createHeader: function() {
            var $headerRow = this._headerRow = this._createHeaderRow(),
                $filterRow = this._filterRow = this._createFilterRow(),
                $insertRow = this._insertRow = this._createInsertRow();
            var $headerGrid = this._headerGrid = $("<table>").addClass(this.tableClass)
                .append(this._createHeaderWidthRow())
                .append($headerRow)
                .append($filterRow)
                .append($insertRow);
            var $header = this._header = $("<div>").addClass(this.gridHeaderClass)
                .addClass(this._scrollBarWidth() ? "jsgrid-header-scrollbar" : "")
                .append($headerGrid);
            return $header;
        }
    });
})(jQuery, jsGrid);
