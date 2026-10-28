import { t as __commonJSMin } from "../_runtime.mjs";
//#region node_modules/escape-latex/dist/index.js
var require_dist = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var _extends = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	var defaultEscapes = {
		"{": "\\{",
		"}": "\\}",
		"\\": "\\textbackslash{}",
		"#": "\\#",
		$: "\\$",
		"%": "\\%",
		"&": "\\&",
		"^": "\\textasciicircum{}",
		_: "\\_",
		"~": "\\textasciitilde{}"
	};
	var formatEscapes = {
		"–": "\\--",
		"—": "\\---",
		" ": "~",
		"	": "\\qquad{}",
		"\r\n": "\\newline{}",
		"\n": "\\newline{}"
	};
	var defaultEscapeMapFn = function defaultEscapeMapFn(defaultEscapes, formatEscapes) {
		return _extends({}, defaultEscapes, formatEscapes);
	};
	/**
	* Escape a string to be used in LaTeX documents.
	* @param {string} str the string to be escaped.
	* @param {boolean} params.preserveFormatting whether formatting escapes should
	*  be performed (default: false).
	* @param {function} params.escapeMapFn the function to modify the escape maps.
	* @return {string} the escaped string, ready to be used in LaTeX.
	*/
	module.exports = function(str) {
		var _ref = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, _ref$preserveFormatti = _ref.preserveFormatting, preserveFormatting = _ref$preserveFormatti === void 0 ? false : _ref$preserveFormatti, _ref$escapeMapFn = _ref.escapeMapFn, escapeMapFn = _ref$escapeMapFn === void 0 ? defaultEscapeMapFn : _ref$escapeMapFn;
		var runningStr = String(str);
		var result = "";
		var escapes = escapeMapFn(_extends({}, defaultEscapes), preserveFormatting ? _extends({}, formatEscapes) : {});
		var escapeKeys = Object.keys(escapes);
		var _loop = function _loop() {
			var specialCharFound = false;
			escapeKeys.forEach(function(key, index) {
				if (specialCharFound) return;
				if (runningStr.length >= key.length && runningStr.slice(0, key.length) === key) {
					result += escapes[escapeKeys[index]];
					runningStr = runningStr.slice(key.length, runningStr.length);
					specialCharFound = true;
				}
			});
			if (!specialCharFound) {
				result += runningStr.slice(0, 1);
				runningStr = runningStr.slice(1, runningStr.length);
			}
		};
		while (runningStr) _loop();
		return result;
	};
}));
//#endregion
export { require_dist as t };
