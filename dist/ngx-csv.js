"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CsvConfigConsts = (function () {
    function CsvConfigConsts() {
    }
    CsvConfigConsts.EOL = "\r\n";
    CsvConfigConsts.BOM = "\ufeff";
    CsvConfigConsts.DEFAULT_FIELD_SEPARATOR = ',';
    CsvConfigConsts.DEFAULT_DECIMAL_SEPARATOR = '.';
    CsvConfigConsts.DEFAULT_QUOTE = '"';
    CsvConfigConsts.DEFAULT_SHOW_TITLE = false;
    CsvConfigConsts.DEFAULT_TITLE = 'My Report';
    CsvConfigConsts.DEFAULT_FILENAME = 'mycsv.csv';
    CsvConfigConsts.DEFAULT_SHOW_LABELS = false;
    CsvConfigConsts.DEFAULT_USE_BOM = true;
    CsvConfigConsts.DEFAULT_HEADER = [];
    CsvConfigConsts.DEFAULT_NO_DOWNLOAD = false;
    CsvConfigConsts.DEFAULT_REMOVE_EMPTY_VALUES = false;
    return CsvConfigConsts;
}());
exports.CsvConfigConsts = CsvConfigConsts;
exports.ConfigDefaults = {
    filename: CsvConfigConsts.DEFAULT_FILENAME,
    fieldSeparator: CsvConfigConsts.DEFAULT_FIELD_SEPARATOR,
    quoteStrings: CsvConfigConsts.DEFAULT_QUOTE,
    decimalseparator: CsvConfigConsts.DEFAULT_DECIMAL_SEPARATOR,
    showLabels: CsvConfigConsts.DEFAULT_SHOW_LABELS,
    showTitle: CsvConfigConsts.DEFAULT_SHOW_TITLE,
    title: CsvConfigConsts.DEFAULT_TITLE,
    useBom: CsvConfigConsts.DEFAULT_USE_BOM,
    headers: CsvConfigConsts.DEFAULT_HEADER,
    noDownload: CsvConfigConsts.DEFAULT_NO_DOWNLOAD,
    removeEmptyValues: CsvConfigConsts.DEFAULT_REMOVE_EMPTY_VALUES,
    eol: CsvConfigConsts.EOL
};
var ngxCsv = (function () {
    function ngxCsv(DataJSON, filename, options) {
        this.csv = "";
        var config = options || {};
        this.data = typeof DataJSON != 'object' ? JSON.parse(DataJSON) : DataJSON;
        this._options = objectAssign({}, exports.ConfigDefaults, config);
        if (this._options.filename) {
            this._options.filename = filename;
        }
        this.generateCsv();
    }
    /**
     * Generate and Download Csv
     */
    ngxCsv.prototype.generateCsv = function () {
        if (this._options.useBom) {
            this.csv += CsvConfigConsts.BOM;
        }
        if (this._options.showTitle) {
            this.csv += this._options.title + this._options.eol + '\n';
        }
        this.getHeaders();
        this.getBody();
        if (this.csv == '') {
            console.log("Invalid data");
            return;
        }
        if (this._options.noDownload) {
            return this.csv;
        }
        var blob = new Blob([this.csv], { "type": "text/csv;charset=utf8;" });
        if (navigator.msSaveBlob) {
            var filename = this._options.filename.replace(/ /g, "_") + ".csv";
            navigator.msSaveBlob(blob, filename);
        }
        else {
            var uri = 'data:attachment/csv;charset=utf-8,' + encodeURI(this.csv);
            var link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.setAttribute('visibility', 'hidden');
            link.download = this._options.filename.replace(/ /g, "_") + ".csv";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };
    /**
     * Create Headers
     */
    ngxCsv.prototype.getHeaders = function () {
        var _this = this;
        if (this._options.headers.length > 0) {
            var headers = this._options.headers;
            var row = headers.reduce(function (headerRow, header) {
                return headerRow + header + _this._options.fieldSeparator;
            }, '');
            row = row.slice(0, this._options.fieldSeparator.length * -1);
            this.csv += row + this._options.eol;
        }
    };
    /**
     * Create Body
     */
    ngxCsv.prototype.getBody = function () {
        for (var i = 0; i < this.data.length; i++) {
            var row = "";
            for (var index in this.data[i]) {
                row += this.formartData(this.data[i][index]) + this._options.fieldSeparator;
            }
            row = row.slice(0, this._options.fieldSeparator.length * -1);
            this.csv += row + this._options.eol;
        }
    };
    /**
     * Format Data
     * @param {any} data
     */
    ngxCsv.prototype.formartData = function (data) {
        if (this._options.removeEmptyValues && !data) {
            return "";
        }
        if (this._options.decimalseparator === 'locale' && ngxCsv.isFloat(data)) {
            return parseFloat(data).toLocaleString();
        }
        if (this._options.decimalseparator !== '.' && ngxCsv.isFloat(data)) {
            return data.toString().replace('.', this._options.decimalseparator);
        }
        if (typeof data === 'string') {
            data = data.replace(/"/g, '""');
            if (this._options.quoteStrings || data.indexOf(',') > -1 || data.indexOf('\n') > -1 || data.indexOf('\r') > -1) {
                data = this._options.quoteStrings + data + this._options.quoteStrings;
            }
            return data;
        }
        if (typeof data === 'boolean') {
            return data ? 'TRUE' : 'FALSE';
        }
        return data;
    };
    /**
     * Get CSV String
     */
    ngxCsv.prototype.getCsv = function () {
        return this.csv;
    };
    /**
     * Check if is Float
     * @param {any} input
     */
    ngxCsv.isFloat = function (input) {
        var regex = /^([+|-]?\d+.\d+\b)/;
        return regex.exec(input) !== null;
    };
    return ngxCsv;
}());
exports.ngxCsv = ngxCsv;
var hasOwnProperty = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;
/**
 * Convet to Object
 * @param {any} val
 */
function toObject(val) {
    if (val === null || val === undefined) {
        throw new TypeError('Object.assign cannot be called with null or undefined');
    }
    return Object(val);
}
/**
 * Assign data  to new Object
 * @param {any}   target
 * @param {any[]} ...source
 */
function objectAssign(target) {
    var source = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        source[_i - 1] = arguments[_i];
    }
    var from;
    var to = toObject(target);
    var symbols;
    for (var s = 1; s < arguments.length; s++) {
        from = Object(arguments[s]);
        for (var key in from) {
            if (hasOwnProperty.call(from, key)) {
                to[key] = from[key];
            }
        }
        if (Object.getOwnPropertySymbols) {
            symbols = Object.getOwnPropertySymbols(from);
            for (var i = 0; i < symbols.length; i++) {
                if (propIsEnumerable.call(from, symbols[i])) {
                    to[symbols[i]] = from[symbols[i]];
                }
            }
        }
    }
    return to;
}
//# sourceMappingURL=ngx-csv.js.map