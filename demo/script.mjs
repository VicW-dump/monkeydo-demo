import { default as hljs } from "https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.3.1/build/es/core.js";
import { default as javascript } from "https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.3.1/build/es/languages/javascript.min.js";
import { default as hljsjson } from "https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.3.1/build/es/languages/json.min.js";

import { default as Monkeydo } from "../monkeydo/Monkeydo.mjs";

const cursor = {
	element: document.getElementById("cursor"),
	_line: 3,
	// Move the cursor to the next line
	advance: () => {
		cursor._line++;
		cursor.element.style.setProperty("--line",cursor._line);
	}
}

// Intercept Monkeydo calls to methods so we can advance the cursor
function methodsProxy(methods) {
	const handler = {
		// Get and call methods from object
		get(target,propKey) {
			const origMethod = target[propKey];
			return function (...args) {
				cursor.advance();
				return origMethod(...args);
			};
		}
	};
	return new Proxy(methods,handler);
}

export default class Demo extends Monkeydo {
	constructor(methods) {
		const proxy = methodsProxy(methods);

		hljs.registerLanguage('javascript', javascript);
		hljs.registerLanguage('json', hljsjson);

		super(proxy);
		this.populate("code_methods");
		this.populate("code_monkey");
	}

	populate(className) {
		const source = document.querySelector(`script.${className}`);
		const target = document.querySelector(`pre.${className}`);

		target.innerHTML = source.innerText;
		
		hljs.highlightElement(target);
	}
}
