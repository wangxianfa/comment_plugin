! function a(b, c, d) {
	function e(g, h) {
		if (!c[g]) {
			if (!b[g]) {
				var i = "function" == typeof require && require;
				if (!h && i) return i(g, !0);
				if (f) return f(g, !0);
				var j = new Error("Cannot find module '" + g + "'");
				throw j.code = "MODULE_NOT_FOUND", j
			}
			var k = c[g] = {
				exports: {}
			};
			b[g][0].call(k.exports, function(a) {
				var c = b[g][1][a];
				return e(c ? c : a)
			}, k, k.exports, a, b, c, d)
		}
		return c[g].exports
	}
	for (var f = "function" == typeof require && require, g = 0; g < d.length; g++) e(d[g]);
	return e
}({
	1: [function(a, b, c) {
		(function(b, c) {
			var d = b.EchoChamber || {},
				e = {
					local: "http://widget.dev/src",
					prod: "https://s3.amazonaws.com/echochamberjs/dist"
				};
			d.host = e.prod, d.App = a("./src/echo_chamber.js");
			var f = Object.create(d.App);
			return f.init(), f
		})(window)
	}, {
		"./src/echo_chamber.js": 5
	}],

	2: [function(a, b, c) {
		var d = {
				init: function(a, b) {
					this.name = a, this.email = b
				},
				gravatar: function() {
					return "https://www.gravatar.com/avatar/" + e(this.email) + "?s=48"
				},
				save: function() {
					localStorage.setItem("author", JSON.stringify(this))
				},
				fetch: function() {
					var a = localStorage.getItem("author") ? JSON.parse(localStorage.getItem("author")) : {
						name: "",
						email: ""
					};
					this.init(a.name, a.email)
				},
				validate: function() {
					var a = [];
					return ["name", "email"].forEach(function(b) {
						this[b] || a.push({
							field: b,
							message: "Please enter " + b
						})
					}.bind(this)), a
				}
			},
			e = function(a) {
				return md5(a)
			};
		b.exports = d
	}, {}],

	3: [function(a, b, c) {
		md5 = a("./md5");
		var d = {
				init: function(a, b, c) {
					this.text = b, this.author = a, this.timestamp = c, this.errors = []
				},
				validate: function() {
					return this.errors = this.author.validate(), this.text || this.errors.push({
						field: "text",
						message: "Please enter text"
					}), this.errors.length ? !1 : !0
				},
				render: function() {
					return "<div class='ec-comment'><div class='ec-comment__avatar'><img src='" + this.author.gravatar() + "'></div><div class='ec-comment__body'><h4 class=''>" + this.author.name + "<small> on " + e(this.timestamp) + "</small></h4><p class=''>" + this.text + "</p></div></div>"
				}
			},
			e = function(a) {
				var b = new Date(a);
				return b.toDateString() + " at " + b.getHours() + ":" + b.getMinutes()
			};
		b.exports = d
	}, {
		"./md5": 7
	}],

	4: [function(a, b, c) {
		var d = a("./comment.js"),
			e = a("./author.js"),
			f = {
				init: function(a, b) {
					var c = document.createElement("div");
					c.setAttribute("id", "EC-list"), c.setAttribute("class", "ec-list"), this.form = a, this.list = a.parentNode.appendChild(c), this.renderCallback = b, this.path = EchoChamber.discussionURL, this.comments = this.load(), this.render()
				},
				load: function() {
					var a = localStorage.getItem(this.path) || "[]";
					return h(JSON.parse(a))
				},
				fetch: function() {
					var a = localStorage.getItem(this.path) || "[]";
					return JSON.parse(a)
				},
				save: function() {
					localStorage.setItem(this.path, this.stringify())
				},
				render: function(a) {
					var b = this.comments.length;
					this.list.innerHTML = this.buildHTML(), this.form.firstChild.innerHTML = b + " " + g(b)
				},
				stringify: function() {
					return JSON.stringify(this.comments.map(function(a) {
						return {
							text: a.text,
							name: a.author.name,
							email: a.author.email,
							timestamp: a.timestamp
						}
					}))
				},
				getHeight: function() {
					return this.list.clientHeight
				},
				buildHTML: function() {
					var a = this.comments.slice();
					return a.reduce(function(a, b) {
						return a + b.render()
					}, "")
				}
			},
			g = function(a) {
				return 1 === a ? "comment" : "comments"
			},
			h = function(a) {
				return a.map(function(a) {
					var b = Object.create(d),
						c = Object.create(e);
					return c.init(a.name, a.email), b.init(c, a.text, a.timestamp), b
				})
			};
		b.exports = f
	}, {
		"./author.js": 2,
		"./comment.js": 3
	}],

	5: [function(a, b, c) {
		function d(a, b, c) {
			var d;
			return function() {
				var e = this,
					f = arguments,
					g = function() {
						d = null, c || a.apply(e, f)
					},
					h = c && !d;
				clearTimeout(d), d = setTimeout(g, b), h && a.apply(e, f)
			}
		}
		var e = (a("./comment_list.js"), a("./form.js")),
			f = {
				init: function() {
					this.entry = document.getElementById("echochamber"), this.attachIframe(), this.iframeDoc = this.iframe.contentWindow.document, this.pageStyles = i(this.entry.parentNode), this.form = Object.create(e), this.form.init(this.iframe), this.loadStylesheet()
				},
				attachIframe: function() {
					this.iframe = document.createElement("iframe"), this.iframe.style.width = "100%", this.iframe.style.overflow = "hidden", this.iframe.style.border = "none", this.iframe.style.opacity = 0, this.iframe.scrolling = !1, this.iframe.style.transition = "opacity .5s", this.iframe.setAttribute("horizontalscrolling", "no"), this.iframe.setAttribute("verticalscrolling", "no"), this.entry.parentNode.insertBefore(this.iframe, this.entry)
				},
				loadStylesheet: function() {
					var a = document.createElement("link"),
						b = document.createElement("img"),
						c = document.body,
						d = this.iframeDoc.getElementsByTagName("head")[0],
						// e = EchoChamber.host + "/main.css";
						e = "./src/main.css";						
						// a.rel = "stylesheet", a.type = "text/css", a.href = e, d.appendChild(a), c.appendChild(b), b.src = e, b.onerror = function() {
						a.rel = "stylesheet", a.type = "text/css", a.href = './src/style.css', d.appendChild(a), c.appendChild(b), b.src = e, b.onerror = function() {
						c.removeChild(b), g(this.iframeDoc, this.pageStyles), this.iframe.style.opacity = 1, this.addEventListeners()
					}.bind(this)
				},
				addEventListeners: function() {
					var a = this;
					this.iframe.contentWindow.addEventListener("resize", d(a.form.resize.bind(a.form)))
				}
			},
			g = function(a, b) {
				var c = a.getElementsByTagName("body")[0];
				for (var d in b) {
					if (!b.hasOwnProperty(d)) return;
					c.style[d] = b[d]
				}
				for (var e = a.getElementsByTagName("button"), f = (a.getElementsByTagName("p"), 0); f < e.length; f++) e[f].style["background-color"] = b.anchorColor
			},
			h = function(a, b) {
				var c;
				return c = window.getComputedStyle(a, null).getPropertyValue(b), "" === c || "transparent" === c || "rgba(0,0,0,0)" === c ? h(a.parentNode, b) : c || ""
			},
			i = function(a) {
				var b = document.createElement("a"),
					c = document.createElement("p");
				a.appendChild(b), a.appendChild(c);
				var d = {
					anchorColor: h(b, "color"),
					paragraphColor: h(c, "color"),
					fontFamily: h(a, "font-family").replace(/['"]/g, "")
				};
				return b.parentNode.removeChild(b), c.parentNode.removeChild(c), d
			};
		b.exports = f
	}, {
		"./comment_list.js": 4,
		"./form.js": 6
	}],

	6: [function(a, b, c) {
		var d = a("./comment_list.js"),
			e = a("./comment.js"),
			f = a("./author.js"),
			g = {
				init: function(a) {
					this.iframe = a, this.DOM = {}, this.initDOM(this.iframe), this.fields = this.DOM.form.getElementsByTagName("form")[0].elements, this.commentsList = Object.create(d), this.commentsList.init(this.DOM.form, this.renderCallback), this.author = Object.create(f), this.author.fetch(), this.addEventListeners(), this.resize()
				},
				addEventListeners: function() {
					this.DOM.form.addEventListener("submit", this.onClick.bind(this)), this.fields.text.addEventListener("focus", this.onTextareaFocus.bind(this))
				},
				resize: function() {
					var a = this.DOM.form.clientHeight,
						b = parseInt(window.getComputedStyle(this.DOM.form).marginBottom),
						c = a + b + this.commentsList.getHeight() + 20;
					this.iframe.style.height = c + "px"
				},
				initDOM: function() {
					this.doc = this.iframe.contentWindow.document, this.doc.write(h), this.doc.close(), this.DOM.form = this.doc.getElementById("ECForm"), this.DOM.button = this.doc.getElementById("ECFormSubmit")
				},
				submit: function() {
					var a = Object.create(e);
					// this.author.init(this.fields.name.value, this.fields.email.value.trim()), a.init(this.author, this.fields.text.value, (new Date).toString()), a.validate() ? (this.commentsList.comments.push(a), this.commentsList.save(), this.commentsList.render(this.DOM.form), this.author.save(), this.clear()) : this.showErrors(a.errors), this.resize()
					this.author.init('小小发', '123456@qq.comm'), a.init(this.author, this.fields.text.value, (new Date).toString()), a.validate() ? (this.commentsList.comments.push(a), this.commentsList.save(), this.commentsList.render(this.DOM.form), this.author.save(), this.clear()) : this.showErrors(a.errors), this.resize()					
				},
				showErrors: function(a) {
					a.forEach(function(a) {
						var b = this.doc.createElement("p");
						b.innerHTML = a.message, b.classList.add("ec-error"), this.fields[a.field].parentNode.appendChild(b)
					}.bind(this))
				},
				onTextareaFocus: function(a) {
					var b = this.DOM.form.querySelectorAll(".ec-form__fields");
					// b[0].style.display = "block", ["name", "email"].forEach(function(a) {
					// 	this.fields[a].value = this.author[a] || ""
					// }.bind(this)), this.resize()
					b[0].style.display = "block", this.resize()
				},
				clear: function() {
					["text"].forEach(function(a) {
						this.fields[a].value = ""
					}.bind(this))
				},
				onClick: function(a) {
					a.preventDefault(), this.submit()
				}
			},
			h = "<div id='ECForm' class='ec-form-wrapper'><h2 class='ec-heading--2' id='ECFormHeading'></h2><form class='ec-form'><div class='ec-form__field' id='ECForm-text'><textarea class='' name='text' id='ECFormField' placeholder='Your comment...'></textarea></div><div class='ec-form__fields'><div class=''><input class='button' id='ECFormSubmit' type='submit' value='评论提交'></div></div></form></div>";
		b.exports = g
	}, {
		"./author.js": 2,
		"./comment.js": 3,
		"./comment_list.js": 4
	}],

	7: [function(a, b, c) {
		var d = function(a) {
			function b(a, b) {
				return a << b | a >>> 32 - b
			}

			function c(a, b) {
				var c, d, e, f, g;
				return e = 2147483648 & a, f = 2147483648 & b, c = 1073741824 & a, d = 1073741824 & b, g = (1073741823 & a) + (1073741823 & b), c & d ? 2147483648 ^ g ^ e ^ f : c | d ? 1073741824 & g ? 3221225472 ^ g ^ e ^ f : 1073741824 ^ g ^ e ^ f : g ^ e ^ f
			}

			function d(a, b, c) {
				return a & b | ~a & c
			}

			function e(a, b, c) {
				return a & c | b & ~c
			}

			function f(a, b, c) {
				return a ^ b ^ c
			}

			function g(a, b, c) {
				return b ^ (a | ~c)
			}

			function h(a, e, f, g, h, i, j) {
				return a = c(a, c(c(d(e, f, g), h), j)), c(b(a, i), e)
			}

			function i(a, d, f, g, h, i, j) {
				return a = c(a, c(c(e(d, f, g), h), j)), c(b(a, i), d)
			}

			function j(a, d, e, g, h, i, j) {
				return a = c(a, c(c(f(d, e, g), h), j)), c(b(a, i), d)
			}

			function k(a, d, e, f, h, i, j) {
				return a = c(a, c(c(g(d, e, f), h), j)), c(b(a, i), d)
			}

			function l(a) {
				for (var b, c = a.length, d = c + 8, e = (d - d % 64) / 64, f = 16 * (e + 1), g = Array(f - 1), h = 0, i = 0; c > i;) b = (i - i % 4) / 4, h = i % 4 * 8, g[b] = g[b] | a.charCodeAt(i) << h, i++;
				return b = (i - i % 4) / 4, h = i % 4 * 8, g[b] = g[b] | 128 << h, g[f - 2] = c << 3, g[f - 1] = c >>> 29, g
			}

			function m(a) {
				var b, c, d = "",
					e = "";
				for (c = 0; 3 >= c; c++) b = a >>> 8 * c & 255, e = "0" + b.toString(16), d += e.substr(e.length - 2, 2);
				return d
			}

			function n(a) {
				a = a.replace(/\r\n/g, "\n");
				for (var b = "", c = 0; c < a.length; c++) {
					var d = a.charCodeAt(c);
					128 > d ? b += String.fromCharCode(d) : d > 127 && 2048 > d ? (b += String.fromCharCode(d >> 6 | 192), b += String.fromCharCode(63 & d | 128)) : (b += String.fromCharCode(d >> 12 | 224), b += String.fromCharCode(d >> 6 & 63 | 128), b += String.fromCharCode(63 & d | 128))
				}
				return b
			}
			var o, p, q, r, s, t, u, v, w, x = Array(),
				y = 7,
				z = 12,
				A = 17,
				B = 22,
				C = 5,
				D = 9,
				E = 14,
				F = 20,
				G = 4,
				H = 11,
				I = 16,
				J = 23,
				K = 6,
				L = 10,
				M = 15,
				N = 21;
			for (a = n(a), x = l(a), t = 1732584193, u = 4023233417, v = 2562383102, w = 271733878, o = 0; o < x.length; o += 16) p = t, q = u, r = v, s = w, t = h(t, u, v, w, x[o + 0], y, 3614090360), w = h(w, t, u, v, x[o + 1], z, 3905402710), v = h(v, w, t, u, x[o + 2], A, 606105819), u = h(u, v, w, t, x[o + 3], B, 3250441966), t = h(t, u, v, w, x[o + 4], y, 4118548399), w = h(w, t, u, v, x[o + 5], z, 1200080426), v = h(v, w, t, u, x[o + 6], A, 2821735955), u = h(u, v, w, t, x[o + 7], B, 4249261313), t = h(t, u, v, w, x[o + 8], y, 1770035416), w = h(w, t, u, v, x[o + 9], z, 2336552879), v = h(v, w, t, u, x[o + 10], A, 4294925233), u = h(u, v, w, t, x[o + 11], B, 2304563134), t = h(t, u, v, w, x[o + 12], y, 1804603682), w = h(w, t, u, v, x[o + 13], z, 4254626195), v = h(v, w, t, u, x[o + 14], A, 2792965006), u = h(u, v, w, t, x[o + 15], B, 1236535329), t = i(t, u, v, w, x[o + 1], C, 4129170786), w = i(w, t, u, v, x[o + 6], D, 3225465664), v = i(v, w, t, u, x[o + 11], E, 643717713), u = i(u, v, w, t, x[o + 0], F, 3921069994), t = i(t, u, v, w, x[o + 5], C, 3593408605), w = i(w, t, u, v, x[o + 10], D, 38016083), v = i(v, w, t, u, x[o + 15], E, 3634488961), u = i(u, v, w, t, x[o + 4], F, 3889429448), t = i(t, u, v, w, x[o + 9], C, 568446438), w = i(w, t, u, v, x[o + 14], D, 3275163606), v = i(v, w, t, u, x[o + 3], E, 4107603335), u = i(u, v, w, t, x[o + 8], F, 1163531501), t = i(t, u, v, w, x[o + 13], C, 2850285829), w = i(w, t, u, v, x[o + 2], D, 4243563512), v = i(v, w, t, u, x[o + 7], E, 1735328473), u = i(u, v, w, t, x[o + 12], F, 2368359562), t = j(t, u, v, w, x[o + 5], G, 4294588738), w = j(w, t, u, v, x[o + 8], H, 2272392833), v = j(v, w, t, u, x[o + 11], I, 1839030562), u = j(u, v, w, t, x[o + 14], J, 4259657740), t = j(t, u, v, w, x[o + 1], G, 2763975236), w = j(w, t, u, v, x[o + 4], H, 1272893353), v = j(v, w, t, u, x[o + 7], I, 4139469664), u = j(u, v, w, t, x[o + 10], J, 3200236656), t = j(t, u, v, w, x[o + 13], G, 681279174), w = j(w, t, u, v, x[o + 0], H, 3936430074), v = j(v, w, t, u, x[o + 3], I, 3572445317), u = j(u, v, w, t, x[o + 6], J, 76029189), t = j(t, u, v, w, x[o + 9], G, 3654602809), w = j(w, t, u, v, x[o + 12], H, 3873151461), v = j(v, w, t, u, x[o + 15], I, 530742520), u = j(u, v, w, t, x[o + 2], J, 3299628645), t = k(t, u, v, w, x[o + 0], K, 4096336452), w = k(w, t, u, v, x[o + 7], L, 1126891415), v = k(v, w, t, u, x[o + 14], M, 2878612391), u = k(u, v, w, t, x[o + 5], N, 4237533241), t = k(t, u, v, w, x[o + 12], K, 1700485571), w = k(w, t, u, v, x[o + 3], L, 2399980690), v = k(v, w, t, u, x[o + 10], M, 4293915773), u = k(u, v, w, t, x[o + 1], N, 2240044497), t = k(t, u, v, w, x[o + 8], K, 1873313359), w = k(w, t, u, v, x[o + 15], L, 4264355552), v = k(v, w, t, u, x[o + 6], M, 2734768916), u = k(u, v, w, t, x[o + 13], N, 1309151649), t = k(t, u, v, w, x[o + 4], K, 4149444226), w = k(w, t, u, v, x[o + 11], L, 3174756917), v = k(v, w, t, u, x[o + 2], M, 718787259), u = k(u, v, w, t, x[o + 9], N, 3951481745), t = c(t, p), u = c(u, q), v = c(v, r), w = c(w, s);
			var O = m(t) + m(u) + m(v) + m(w);
			return O.toLowerCase()
		};
		b.exports = d
	}, {}]
	
}, {}, [1]);