!(function (e) {
    function n() {
        return !!(g && _ && R && O && w);
    }
    function o(e, n) {
        (this.origin = "https://" + a(e).host), (this.path = n), (this._iframe = null), (this._iframeReady = !1), (this._queue = []), (this._requests = {}), (this._messageId = 0);
    }
    function t() {
        function e() {
            return Math.floor(65536 * (1 + Math.random()))
                .toString(16)
                .substring(1);
        }
        return e() + e() + "-" + e() + "-" + e() + "-" + e() + "-" + e() + e() + e();
    }
    function i(e) {
        return (e = a(e)).host + e.path;
    }
    function s(e) {
        try {
            return JSON.parse(e);
        } catch (n) {
            return JANRAIN.SSO.warn("json array did not parse: " + e), [];
        }
    }
    function a(e) {
        var n = a.options;
        e = n.parser[n.strictMode ? "strict" : "loose"].exec(e);
        for (var o = {}, t = 14; t--; ) o[n.key[t]] = e[t] || "";
        return (
            (o[n.q.name] = {}),
            o[n.key[12]].replace(n.q.parser, function (e, t, i) {
                t && (o[n.q.name][t] = i);
            }),
            o
        );
    }

    async function _verifyUUID(uuid) {
        const verifyUser = await window.GetUserByUUID(uuid);
        console.log("verifyUser", verifyUser);
        if(verifyUser.result == "OK"){
            console.log("SSO :: Logging in!");
            if(typeof window.SetSession !== "undefined" && typeof window.KeepSignedIn !== "undefined"){
                await window.SetSession(window.KeepSignedIn());
                // if(!window.IsUserLogged()) {
                //     window.location.reload();
                // }
            }
            if(typeof window.setLoginStatus !== "undefined"){
                window.setLoginStatus(true);
            }

        } else {
            // console.log("SSO :: Not logging!");
            if(typeof window.setLoginStatus !== "undefined"){
                window.setLoginStatus(false);
            }
            if(typeof window.ClearSessionCookie !== "undefined") {
                window.ClearSessionCookie();
            }
            if(typeof window.ClearLocalStorage !== "undefined") {
                window.ClearLocalStorage();
            }
        }
    }

    function r() {
        window.janrain.events.onProviderLoginStart.addHandler(function () {}),
            window.janrain.events.onProviderLoginComplete.addHandler(function (e) {}),
            window.janrain.events.onProviderLoginError.addHandler(function (e) {}),
            window.janrain.events.onProviderLoginSuccess.addHandler(function () {}),
            window.janrain.events.onReturnExperienceFound.addHandler(function (e) {}),
            window.janrain.events.onProviderLoginToken.addHandler(function (e) {}),
            (function () {
                const e = document.getElementById("js-janrain-sso");
                if (null != e)
                    new Promise(function (n, o) {
                        window.JANRAIN.SSO.check_session({
                            client_id: e.getAttribute("data-client-id"),
                            flow_name: e.getAttribute("data-flow-name"),
                            flow_version: e.getAttribute("data-flow-version"),
                            locale: e.getAttribute("data-locale"),
                            redirect_uri: e.getAttribute("data-redirect-uri"),
                            sso_server: e.getAttribute("data-sso-server"),
                            xd_receiver: e.getAttribute("data-xd-receiver"),
                            refresh: !0,
                            logout_uri: "",
                            capture_error: function (e) {
                                console.log("SSO capture_error");
                            },
                            callback_failure: function (e) {
                                console.log("SSO callback_failure");
                            },
                            callback_success: function (e) {
                                console.log("SSO callback_success");
                            },
                            capture_status: function (e) {
                                console.log("SSO capture_status");
                            },
                            capture_success: function (e) {
                                responseJanrain = e;
                                console.log('SSO capture_success' , e);

                                const authResult = e.result;
                                _verifyUUID(authResult.userData.uuid);
                            },
                        }),
                            setTimeout(function () {
                                n(void 0);
                            }, 4e3);
                    });
            })();
    }
    const c = function (e) {
        const n = setInterval(function () {
            void 0 !== window.janrain.events && (e(), clearInterval(n)), window.janrain.counter, window.janrain.counter--;
        }, 500);
    };
    function l() {
        void 0 !== window.setLoginStatus && window.setLoginStatus(!1), void 0 !== window.ClearSessionCookie && window.ClearSessionCookie(), void 0 !== window.ClearLocalStorage && window.ClearLocalStorage();
    }
    if (void 0 === e.JANRAIN || !e.JANRAIN.SSO) {
        var u,
            g,
            S,
            f,
            p,
            _,
            m,
            N,
            A,
            h,
            R,
            v,
            I,
            O,
            w,
            J = !1;
        window.localStorage && (J = window.localStorage.getItem("janrainSsoDebugEnabled")),
            (JANRAIN = { SSO: {} }),
            (JANRAIN.SSO.CAPTURE = {}),
            (JANRAIN.SSO.version = "4.0-alpha"),
            "undefined" == typeof janrain && (janrain = {}),
            void 0 === janrain.capture && (janrain.capture = {}),
            void 0 === janrain.capture.ui && (janrain.capture.ui = {}),
            void 0 === janrain.capture.ui.handleCaptureResponse && (janrain.capture.ui.handleCaptureResponse = function (e) {}),
            void 0 === janrain.capture.ui.handleStatusResponse && (janrain.capture.ui.handleStatusResponse = function (e) {}),
            void 0 === janrain.capture.ui.handleErrorResponse && (janrain.capture.ui.handleErrorResponse = function (e) {}),
            void 0 === janrain.capture.ui.login_callback && (janrain.capture.ui.login_callback = function (e) {}),
            void 0 === janrain.capture.ui.nologin_callback && (janrain.capture.ui.nologin_callback = function (e) {}),
            (o.prototype = {
                constructor: o,
                init: function () {
                    var e = this;
                    if (!this._iframe) {
                        if (!(window.postMessage && window.JSON && window.localStorage) || JANRAIN.SSO.useCookiesOnly()) throw Error("Unsupported browser.");
                        (this._iframe = document.createElement("iframe")), (this._iframe.style.cssText = "position:absolute;width:1px;height:1px;left:-9999px;");
                        var n = document.getElementsByTagName("script")[0];
                        n.parentNode.insertBefore(this._iframe, n),
                            window.addEventListener
                                ? (this._iframe.addEventListener(
                                      "load",
                                      function () {
                                          e._iframeLoaded();
                                      },
                                      !1
                                  ),
                                  window.addEventListener(
                                      "message",
                                      function (n) {
                                          e._handleMessage(n);
                                      },
                                      !1
                                  ))
                                : this._iframe.attachEvent &&
                                  (this._iframe.attachEvent(
                                      "onload",
                                      function () {
                                          e._iframeLoaded();
                                      },
                                      !1
                                  ),
                                  window.attachEvent("onmessage", function (n) {
                                      e._handleMessage(n);
                                  }));
                    }
                    this._iframe.src = this.origin + this.path;
                },
                getValue: function (e, n, o) {
                    (e = { request: { key: e, messageId: ++this._messageId, action: n }, callback: o }), this._iframeReady ? this._sendRequest(e) : this._queue.push(e), this._iframe || this.init();
                },
                setValue: function (e, n, o, t) {
                    (e = { request: { key: e, messageId: ++this._messageId, action: n, storedValue: o }, callback: t }), this._iframeReady ? this._sendRequest(e) : this._queue.push(e), this._iframe || this.init();
                },
                removeValue: function (e, n) {
                    var o = { request: { key: e, messageId: ++this._messageId, action: "remove" }, callback: n };
                    this._iframeReady ? this._sendRequest(o) : this._queue.push(o), this._iframe || this.init();
                },
                _sendRequest: function (e) {
                    (this._requests[e.request.messageId] = e), this._iframe.contentWindow.postMessage(JSON.stringify(e.request), this.origin);
                },
                _iframeLoaded: function () {
                    if (((this._iframeReady = !0), this._queue.length)) {
                        for (var e = 0, n = this._queue.length; e < n; e++) this._sendRequest(this._queue[e]);
                        this._queue = [];
                    }
                },
                _handleMessage: function (e) {
                    if (e.origin == this.origin) {
                        var n;
                        try {
                            n = JSON.parse(e.data);
                        } catch (e) {
                            JANRAIN.SSO.warn("json object did not parse: " + array), (n = {});
                        }
                        void 0 !== n.messageId && (this._requests[n.messageId].callback(n.key, n.storedValue), delete this._requests[n.messageId]);
                    }
                },
            }),
            (a.options = {
                strictMode: !1,
                key: "source protocol authority userInfo user password host port relative path directory file query anchor".split(" "),
                q: { name: "queryKey", parser: /(?:^|&)([^&=]*)=?([^&]*)/g },
                parser: {
                    strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
                    loose: /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/,
                },
            }),
            (JANRAIN.SSO._deleteChecked = function () {
                for (var n = e.document.cookie.split(";"), o = 0; o < n.length; o++)
                    -1 < n[o].search(/janrain_sso_checked/) && ((e.document.cookie = n[o] + "=;expires=" + new Date().toGMTString() + ";path=/;"), JANRAIN.SSO.log("sso removed cookie " + n[o]));
            }),
            (JANRAIN.SSO._doLogout = function (n, o, t) {
                (onComplete = function () {
                    void 0 !== f && "function" == typeof f ? (JANRAIN.SSO.log("calling logout_callback()"), f()) : void 0 !== n && (JANRAIN.SSO.log("redirecting to " + n), (e.document.location.href = n));
                }),
                    JANRAIN.SSO._loadUrls(o, onComplete);
            }),
            (JANRAIN.SSO._getLogoutUrls = function (e, n) {
                var o,
                    t = [];
                void 0 !== n && (o = i(n)), JANRAIN.SSO.debug_log("localSiteKey: " + o);
                for (var s = 0; s < e.length; s++) {
                    var a = i(e[s].xdReceiverURI),
                        r = e[s].isLoggedIn;
                    JANRAIN.SSO.debug_log(s + 1 + " this siteKey: " + a), r && a !== o && (JANRAIN.SSO.debug_log("logoutURI: " + e[s].logoutURI), t.push(e[s].logoutURI));
                }
                return t;
            }),
            (JANRAIN.SSO._loadUrls = function (n, o) {
                if (
                    ((onComplete = function () {
                        void 0 !== o && "function" == typeof o && o();
                    }),
                    null != n && 0 < n.length)
                ) {
                    var t = 0;
                    onFrameLoad = function () {
                        ++t >= n.length && onComplete();
                    };
                    for (var i, s = 0; s < n.length; s++) {
                        e.document.all ? (((i = document.createElement("div")).innerHTML = '<iframe onload="onFrameLoad();"></iframe>'), (i = i.firstChild)) : ((i = e.document.createElement("iframe")).onload = onFrameLoad);
                        var a = decodeURIComponent(n[s]);
                        "https:" === document.location.protocol && (a = a.replace("^http:", "https:")),
                            i.setAttribute("src", a),
                            JANRAIN.SSO.log("calling logout url " + s + " of " + n.length + ": " + n[s]),
                            e.document.getElementsByTagName("head")[0].appendChild(i);
                    }
                } else onComplete();
            }),
            (JANRAIN.SSO.CAPTURE._login = function (n, o, t, i, s) {
                if (void 0 === R) JANRAIN.SSO.error("sso server is not defined");
                else {
                    var a = document.createElement("script");
                    (a.src =
                        R +
                        "/capture/loginx?v=" +
                        new Date().getTime() +
                        "&callback=" +
                        encodeURIComponent(i) +
                        "&xd_receiver=" +
                        encodeURIComponent(w) +
                        "&origin=" +
                        encodeURIComponent(e.document.location.href) +
                        "&logout_uri=" +
                        encodeURIComponent(p) +
                        "&redirect_uri=" +
                        encodeURIComponent(_) +
                        "&client_id=" +
                        encodeURIComponent(g) +
                        "&bp_channel=" +
                        encodeURIComponent(u) +
                        "&segment=" +
                        encodeURIComponent(s) +
                        "&response_type=" +
                        encodeURIComponent(n.response_type) +
                        "&response_method=" +
                        encodeURIComponent(n.response_method) +
                        "&widget_parameters=" +
                        encodeURIComponent(n.widget_parameters) +
                        "&transaction_id=" +
                        encodeURIComponent(n.transaction_id) +
                        "&session_id=" +
                        encodeURIComponent(o) +
                        "&visited=" +
                        encodeURIComponent(t)),
                        (a.type = "text/javascript"),
                        (n = document.getElementsByTagName("script")[0]).parentNode.insertBefore(a, n);
                }
            }),
            (JANRAIN.SSO.CAPTURE._loginCallback = function (n) {
                if (n && "fail" !== n.stat) {
                    JANRAIN.SSO.log("callback from SSO server received"), N || (N = new o(R, "/static/server.html")), JANRAIN.SSO.log("updating SSO session");
                    var t = { session_id: decodeURIComponent(n.session_id), visited: decodeURIComponent(n.visited), visited_expires: n.visited_expires };
                    N.setValue(n.segment, "set", t, function (o, t) {
                        n.capture_callback && "jsonp" === n.response_method && "undefined" != typeof janrain && janrain.capture && janrain.capture.ui && "function" == typeof n.capture_callback
                            ? n.capture_callback()
                            : n.redirect_uri && 0 < n.redirect_uri.length && (e.document.location.href = n.redirect_uri);
                    });
                } else JANRAIN.SSO.error("login failed: " + n.msg);
            }),
            (JANRAIN.SSO._redirectCallback = function (e, n, t, r, c, d, l) {
                (d = d || R)
                    ? c || w
                        ? (N || (N = new o(d, "/static/server.html")),
                          JANRAIN.SSO.log("updating session"),
                          N.getValue(c, "getSegment", function (o, t) {
                              N.getValue(t.segment, "get", function (o, u) {
                                  var g,
                                      S = [];
                                  if (u.visited) {
                                      JANRAIN.SSO.log("visited: " + u.visited), (S = s(u.visited)), w || (w = getXdrFromLocation());
                                      var f = 0;
                                      if (w) g = i(w);
                                      else for (var p = 0; p < S.length; p++) a(S[p].xdReceiverURI).host == c && f++;
                                      for (1 < f && (JANRAIN.SSO.log("multiple domains match, resetting visited"), (S = [])), p = 0; p < S.length; p++) {
                                          f = i(S[p].xdReceiverURI);
                                          var _ = a(S[p].xdReceiverURI);
                                          if (void 0 !== f && (f === g || _.host === c)) {
                                              !0 === S[p].isLoggedIn ? JANRAIN.SSO.log("logging in again to: " + S[p].domain) : (JANRAIN.SSO.log("found and logging in to: " + S[p].domain), (S[p].isLoggedIn = !0)), (S = [S[p]]);
                                              break;
                                          }
                                      }
                                  } else JANRAIN.SSO.warn("expected a visited list for segment " + t.segment + " - none found");
                                  JANRAIN.SSO._setSSOSession(e, n, JSON.stringify(S), r, d, t.segment, c, function () {
                                      "function" == typeof l && l();
                                  });
                              });
                          }))
                        : (JANRAIN.SSO.error("no session set, due to missing xd_receiver and logged_in_host parameters"), "function" == typeof l && l())
                    : (JANRAIN.SSO.error("no session set, due to missing sso server parameter"), "function" == typeof l && l());
            }),
            (JANRAIN.SSO._setSession = function (e, n, o, t, i, s) {
                JANRAIN.SSO._setSSOSession(e, null, n, o, R, t, i, s);
            }),
            (JANRAIN.SSO._setSSOSession = function (e, n, t, i, s, a, r, c) {
                N || (N = new o(s, "/static/server.html")),
                    JANRAIN.SSO.debug_log("visited expires:  " + i),
                    (n = { session_id: e, session_id_expires: n, visited: t, visited_expires: i, host: r }),
                    e ? JANRAIN.SSO.log("setting session " + n.host + " with segment " + a) : JANRAIN.SSO.log("updating the visited list for segment " + a),
                    N.setValue(a, "set", n, function (e, n) {
                        "undefined" !== c && "function" == typeof c && c();
                    });
            }),
            (JANRAIN.SSO.check_login_dispatch = function (e, n) {
                N || (N = new o(e.sso_server, "/static/server.html")),
                    JANRAIN.SSO.log("checking for session"),
                    JANRAIN.SSO.debug_log("Segments to check: " + e.supported_segments_ary),
                    N.getValue("", "getAllVisited", function (o, t) {
                        var a = i(e.xd_receiver),
                            r = s(t.allVisited).some(function (e) {
                                if (a === i(e.xdReceiverURI)) return e.isLoggedIn;
                            });
                        e.supported_segments_ary.forEach(function (o) {
                            N.getValue(o, "get", function (t, i) {
                                n(e, i, o, r);
                            });
                        });
                    });
            }),
            (JANRAIN.SSO.debug_log = function (e, n) {
                J &&
                    (n && (window.JSON && window.JSON.stringify && (n = JSON.stringify(n)), (e += ": " + n)),
                    (d = new Date()),
                    (e = "SSO DEBUG (" + d.toGMTString() + "): " + e),
                    window.console && window.console.debug ? console.debug(e) : window.console && window.console.log && console.log(e));
            }),
            (JANRAIN.SSO.error = function (e) {
                window.console && window.console.error && console.error("SSO ERROR: " + e);
            }),
            (JANRAIN.SSO.CAPTURE.handleSegmentCheck = function (e, n, o, t) {
                var r = [],
                    c = { found: !1 },
                    d = i(e.xd_receiver),
                    u = a(e.xd_receiver).host;
                if ((JANRAIN.SSO.log("checking segment " + o), !n.visited_expires || "session" === n.visited_expires)) {
                    for (n.visited_expires = "session", cName = "", pCOOKIES = [], pCOOKIES = document.cookie.split("; "), bb = 0; bb < pCOOKIES.length; bb++)
                        (NmeVal = []), (NmeVal = pCOOKIES[bb].split("=")), "janrainSSO_session" == NmeVal[0] && (cName = unescape(NmeVal[1]));
                    1 < cName.length && ('"' === cName[0] && (cName = cName.substr(1, cName.length)), '"' === cName[cName.length - 1] && (cName = cName.substr(0, cName.length - 1))),
                        "session" !== cName.replace(/\\"/g, '"') &&
                            ((e.refresh = !0),
                            JANRAIN.SSO.log("visited tracker is session-based but no janrainSSO_session cookie found; will refresh even if marked as logged in"),
                            (function (e, n, o, t, i, s) {
                                (e = e + "=" + escape(n)), o && (e += ";expires=" + (o = setExpiration(o))), t && (e += ";path=" + t), i && (e += ";domain=" + i), s && (e += "secure; "), (document.cookie = e);
                            })("janrainSSO_session", "session", null, "/"));
                }
                if (
                    n.visited &&
                    ((c = (function (e, n) {
                        JANRAIN.SSO.debug_log("checkVisited: ", e);
                        var o = { found: !1, isLoggedIn: !1 };
                        if (null == e || void 0 === e) return o;
                        for (idx = 0; idx < e.length; idx++) {
                            var t = e[idx];
                            if (((currentReceiverKey = i(t.xdReceiverURI)), "undefined" != typeof currentReceiverKey && currentReceiverKey === n)) {
                                JANRAIN.SSO.debug_log("checkVisited found " + n + " on " + t.domain),
                                    (o.domain = t.domain),
                                    (o.found = !0),
                                    JANRAIN.SSO.debug_log("checkVisited: is " + (t.isLoggedIn ? "" : "not ") + "logged in"),
                                    (o.isLoggedIn = t.isLoggedIn);
                                break;
                            }
                        }
                        return o;
                    })((r = s(n.visited)), d)),
                    JANRAIN.SSO.debug_log("handleSegmentCheck visitedStatus", c),
                    !0 === c.found)
                )
                    if (!0 === c.isLoggedIn) {
                        if ((JANRAIN.SSO.log("already logged into: " + c.domain), !e.refresh || S))
                            return void (
                                "undefined" != typeof janrain &&
                                janrain.capture &&
                                janrain.capture.ui &&
                                "function" == typeof janrain.capture.ui[e.nologin_callback] &&
                                janrain.capture.ui[e.nologin_callback]({ transactionId: e.transaction_id, result: "already checked" })
                            );
                        JANRAIN.SSO.log("overriding with refresh");
                    } else JANRAIN.SSO.log("found: " + c.domain + " but not logged in"), l();
                if (!c.found) {
                    var g = a(e.xd_receiver);
                    r.push({ domain: g.host + g.path, xdReceiverURI: e.xd_receiver, isLoggedIn: !1, logoutURI: e.logout_uri }), 10 < r.length && r.splice(0, 1);
                }
                !n.session_id || 1 > n.session_id.length
                    ? (JANRAIN.SSO.log("no session exists; not logging in") && l(),
                      (t = function () {
                          "undefined" != typeof janrain &&
                              janrain.capture &&
                              janrain.capture.ui &&
                              "function" == typeof janrain.capture.ui[e.nologin_callback] &&
                              janrain.capture.ui[e.nologin_callback]({ transactionId: e.transaction_id, result: "sso failed - no session exists" });
                      }),
                      c.found ? t() : JANRAIN.SSO._setSession(n.session_id, JSON.stringify(r), n.visited_expires, o, u, t))
                    : (!n.visited && !S && ((e.refresh = !0), JANRAIN.SSO.log("session exists, but no visited list; forcing a refresh")),
                      (t && !e.refresh) || S
                          ? (JANRAIN.SSO.log("capture user already logged in to the site; marking as logged in on this segment, too"),
                            r.some(function (e, n) {
                                if (i(e.xdReceiverURI) === d) return (r[n].isLoggedIn = !0);
                            }),
                            JANRAIN.SSO._setSession(n.session_id, JSON.stringify(r), n.visited_expires, o, u))
                          : ((S = !0), JANRAIN.SSO.log("logging in capture user"), JANRAIN.SSO.CAPTURE._login(e, n.session_id, JSON.stringify(r), "JANRAIN.SSO.CAPTURE._loginCallback", o)));
            }),
            (JANRAIN.SSO.log = function (e, n) {
                window.console && window.console.log && (n && (window.JSON && window.JSON.stringify && (n = JSON.stringify(n)), (e += ": " + n)), (d = new Date()), console.log("SSO (" + d.toGMTString() + "): " + e));
            }),
            (JANRAIN.SSO.safariWorkAround = function (e) {
                var n = !1;
                if (-1 != (t = navigator.userAgent).indexOf("Safari")) {
                    var o = t.indexOf("Version");
                    if (-1 != o)
                        var t = t.substring(o + 8),
                            i = parseInt("" + t, 10);
                    5 < i && (JANRAIN.SSO.debug_log("Safari version is " + i + ", workaround enabled"), (n = !0));
                }
                n
                    ? localStorage.getItem("federateUnlocked") ||
                      (JANRAIN.SSO.debug_log("SSO not unlocked yet"),
                      (e = e + "/static/server.html?origin=" + (n = encodeURIComponent(location.href))),
                      JANRAIN.SSO.debug_log("Navigating to SSO server at: " + e),
                      localStorage.setItem("federateUnlocked", "true"),
                      (location.href = e))
                    : JANRAIN.SSO.debug_log("safariWorkAround called but not in Safari");
            }),
            (JANRAIN.SSO.useCookiesOnly = function () {
                return void 0 === I && (I = !!(navigator && navigator.userAgent && -1 < navigator.userAgent.search("__use_cookies__"))), I;
            }),
            (JANRAIN.SSO.warn = function (e) {
                window.console && window.console.warn && console.warn("SSO WARNING: " + e);
            }),
            (JANRAIN.SSO.end_session = function (t) {
                if (n()) {
                    J && ((callback_message = void 0 === t ? "callback function undefined" : "callback: " + t.name), JANRAIN.SSO.debug_log("logout called " + callback_message + " caller name: '" + arguments.callee.caller.name + "'")),
                        JANRAIN.SSO._deleteChecked(),
                        void 0 !== t && "function" == typeof t && (f = t);
                    var i = a(window.location.hostname).host;
                    if (window.localStorage && !JANRAIN.SSO.useCookiesOnly())
                        N || (N = new o(R, "/static/server.html")),
                            JANRAIN.SSO.log("removing session_id"),
                            N.getValue(i, "getSegment", function (e, n) {
                                JANRAIN.SSO.log("got segment " + e + "=" + n.segment),
                                    N.getValue(n.segment, "getAllVisited", function (e, o) {
                                        var r = [],
                                            c = [];
                                        if (o.allVisited) {
                                            (r = s(o.allVisited)), (c = JANRAIN.SSO._getLogoutUrls(r, w)), JANRAIN.SSO.debug_log("SSO: logoutUrls: ", c);
                                            for (var d = [], l = 0; l < r.length; l++) {
                                                var u = a(r[l].xdReceiverURI).host;
                                                if (r[l].xdReceiverURI === w || u === i) {
                                                    (r[l].isLoggedIn = !1), (d = [r[l]]);
                                                    break;
                                                }
                                            }
                                            r = d;
                                        }
                                        (toBeDeletedValue = o),
                                            (toBeDeletedValue.session_id = "deleteMe"),
                                            (toBeDeletedValue.visited = JSON.stringify(r)),
                                            (toBeDeletedValue.session_id_expires = "deleteMe"),
                                            JANRAIN.SSO.log("deleting session " + toBeDeletedValue),
                                            JANRAIN.SSO.log("deleting session " + toBeDeletedValue.visited),
                                            N.setValue(n.segment, "deleteSession", toBeDeletedValue, function (e, n) {
                                                JANRAIN.SSO.log("session removed " + e + "=" + n), JANRAIN.SSO._doLogout(p, c, t);
                                            });
                                    });
                            });
                    else {
                        var r = e.document.createElement("script");
                        r.setAttribute("src", R + "/session/logout.js?logout_uri=" + encodeURIComponent(p)), document.getElementsByTagName("body")[0].appendChild(r);
                    }
                } else JANRAIN.SSO.warn("SSO has not been configured.");
            }),
            (JANRAIN.SSO.check_session = function (o, i, s) {
                (g = o.client_id),
                    (_ = o.redirect_uri),
                    (R = o.sso_server),
                    (O = JSON.stringify({ flow: o.flow_name, flow_version: o.flow_version, locale: o.locale })),
                    (w = o.xd_receiver),
                    (p = o.logout_uri),
                    (u = o.bp_channel || ""),
                    (m = o.refresh || !1),
                    (h = o.response_type || "token"),
                    (A = o.response_method || "jsonp"),
                    (login_callback = "login_callback"),
                    o.callback_failure && (janrain.capture.ui.nologin_callback = o.callback_failure),
                    o.callback_success && (janrain.capture.ui.login_callback = o.callback_success),
                    o.capture_error && (janrain.capture.ui.handleErrorResponse = o.capture_error),
                    o.capture_status && (janrain.capture.ui.handleStatusResponse = o.capture_status),
                    o.capture_success && (janrain.capture.ui.handleCaptureResponse = o.capture_success),
                    n()
                        ? ((o = t()),
                          JANRAIN.SSO.safariWorkAround(R),
                          (S = !1),
                          (s = void 0 === s ? "" : s.replace(/ /g, "_")),
                          (v = []),
                          void 0 !== i && (v = i.split("-")),
                          v.push(s),
                          window.localStorage && !JANRAIN.SSO.useCookiesOnly()
                              ? ((o = {
                                    bp_channel: u,
                                    client_id: g,
                                    logout_uri: p,
                                    redirect_uri: _,
                                    refresh: m,
                                    response_method: A,
                                    response_type: h,
                                    segment: s,
                                    sso_server: R,
                                    transaction_id: o,
                                    supported_segments: i,
                                    supported_segments_ary: v,
                                    widget_parameters: O,
                                    xd_receiver: w,
                                }),
                                JANRAIN.SSO.check_login_dispatch(o, JANRAIN.SSO.CAPTURE.handleSegmentCheck))
                              : ((i = "janrain_sso_checked_" + getPath(w)),
                                -1 === e.document.cookie.search(RegExp(i))
                                    ? (((i = document.createElement("script")).src =
                                          R +
                                          "/capture/v1/sso_check.js?v=" +
                                          new Date().getTime() +
                                          "&xd_receiver=" +
                                          encodeURIComponent(w) +
                                          "&origin=" +
                                          encodeURIComponent(e.document.location.href) +
                                          "&logout_uri=" +
                                          encodeURIComponent(p) +
                                          "&redirect_uri=" +
                                          encodeURIComponent(_) +
                                          "&client_id=" +
                                          encodeURIComponent(g) +
                                          "&bp_channel=" +
                                          encodeURIComponent(u) +
                                          "&segment=" +
                                          encodeURIComponent(s) +
                                          "&response_type=" +
                                          encodeURIComponent(h) +
                                          "&response_method=" +
                                          encodeURIComponent(A) +
                                          "&widget_parameters=" +
                                          encodeURIComponent(O) +
                                          "&nologin_callback=" +
                                          encodeURIComponent("nologin_callback") +
                                          "&transaction_id=" +
                                          encodeURIComponent(o) +
                                          "&refresh=" +
                                          m),
                                      (i.type = "text/javascript"),
                                      (s = document.getElementsByTagName("script")[0]).parentNode.insertBefore(i, s))
                                    : "undefined" != typeof janrain &&
                                      janrain.capture &&
                                      janrain.capture.ui &&
                                      "function" == typeof janrain.capture.ui.nologin_callback &&
                                      janrain.capture.ui.nologin_callback({ transactionId: o, result: "already checked" })))
                        : JANRAIN.SSO.warn("config missing required parameters. Please include client_id, redirect_uri, sso_server, flow_name, flow_version, locale, and xd_receiver");
            }),
            (JANRAIN.SSO.set_session = function (e) {
                if (n())
                    if (void 0 === R || void 0 === _) JANRAIN.SSO.error("check_login must be called before calling set_login");
                    else {
                        var o = t(),
                            i = document.createElement("script");
                        (i.src =
                            R +
                            "/capture/v1/set_login?v=" +
                            new Date().getTime() +
                            "&redirect_uri=" +
                            encodeURIComponent(_) +
                            "&code=" +
                            encodeURIComponent(e) +
                            "&login_callback=" +
                            encodeURIComponent(login_callback) +
                            "&transaction_id=" +
                            encodeURIComponent(o)),
                            (i.type = "text/javascript"),
                            (e = document.getElementsByTagName("script")[0]).parentNode.insertBefore(i, e);
                    }
                else JANRAIN.SSO.warn("SSO has not been configured.");
            });
    }
    "object" != typeof window.janrain && (window.janrain = {}),
        "object" != typeof window.janrain.settings && (window.janrain.settings = {}),
        (window.janrain.settings.tokenUrl = ""),
        (window.janrain.settings.tokenAction = "event"),
        (window.janrain.ready = !0),
        (window.janrain.counter = 30),
        c(r);
})(this);
