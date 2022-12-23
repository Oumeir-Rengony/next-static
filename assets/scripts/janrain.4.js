(function(n) {
    function D() {
        return w && m && l && y && p ? !0 : !1
    }

    function K(a, b) {
        JANRAIN.SSO.debug_log("checkVisited: ", a);
        var c = {
            found: !1,
            isLoggedIn: !1
        };
        if (null == a || "undefined" === typeof a) return c;
        for (idx = 0; idx < a.length; idx++) {
            var e = a[idx];
            currentReceiverKey = s(e.xdReceiverURI);
            if ("undefined" !== typeof currentReceiverKey && currentReceiverKey === b) {
                JANRAIN.SSO.debug_log("checkVisited found " + b + " on " + e.domain);
                c.domain = e.domain;
                c.found = !0;
                JANRAIN.SSO.debug_log("checkVisited: is " + (e.isLoggedIn ? "" : "not ") + "logged in");
                c.isLoggedIn = e.isLoggedIn;
                break
            }
        }
        return c
    }

    function u(a, b) {
        this.origin = "https://" + t(a).host;
        this.path = b;
        this._iframe = null;
        this._iframeReady = !1;
        this._queue = [];
        this._requests = {};
        this._messageId = 0
    }

    function J() {
        function a() {
            return Math.floor(65536 * (1 + Math.random())).toString(16).substring(1)
        }
        return a() + a() + "-" + a() + "-" + a() + "-" + a() + "-" + a() + a() + a()
    }

    function s(a) {
        a = t(a);
        return a.host + a.path
    }

    function z(a) {
        try {
            return JSON.parse(a)
        } catch (b) {
            return JANRAIN.SSO.warn("json array did not parse: " + a), []
        }
    }

    function t(a) {
        var b =
            t.options;
        a = b.parser[b.strictMode ? "strict" : "loose"].exec(a);
        for (var c = {}, e = 14; e--;) c[b.key[e]] = a[e] || "";
        c[b.q.name] = {};
        c[b.key[12]].replace(b.q.parser, function(a, e, r) {
            e && (c[b.q.name][e] = r)
        });
        return c
    }

    function L(a, b, c, e, f, g) {
        a = a + "\x3d" + escape(b);
        c && (c = setExpiration(c), a += ";expires\x3d" + c);
        e && (a += ";path\x3d" + e);
        f && (a += ";domain\x3d" + f);
        g && (a += "secure; ");
        document.cookie = a
    }
    
    async function _verifyUUID(uuid) {
        const verifyUser = await window.GetUserByUUID(uuid);
        console.log("verifyUser", verifyUser);
        if(verifyUser.result == "OK"){
            console.log("SSO :: Logging in!");
            if(typeof window.SetSession !== "undefined" && typeof window.KeepSignedIn !== "undefined"){
                window.SetSession(window.KeepSignedIn());
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

    function _SSOcallback(){
        const jsso = document.getElementById("js-janrain-sso");
        if((jsso) == null){
            return
        }

        return new Promise(function (resolve, reject) {
            var responseJanrain;
            // Check SSO existence session if only user is not logged yet
            window.JANRAIN.SSO.check_session({
                client_id: jsso.getAttribute('data-client-id'),
                flow_name: jsso.getAttribute('data-flow-name'),
                flow_version: jsso.getAttribute('data-flow-version'),
                locale: jsso.getAttribute('data-locale'),
                redirect_uri: jsso.getAttribute('data-redirect-uri'),
                sso_server: jsso.getAttribute('data-sso-server'),
                xd_receiver: jsso.getAttribute('data-xd-receiver'),
                refresh: true,
                logout_uri: '',
                // logout_uri: window.location.origin,
                capture_error: function (response) {
                console.log('SSO capture_error' , response);
                },
                callback_failure: function (response) {
                console.log('SSO callback_failure' , response);
                },
                callback_success: function (response) {
                console.log('SSO callback_success' , response);
                },
                capture_status: function (response){
                console.log('SSO capture_status' , response);
                },
                capture_success: function (response) {
                responseJanrain = response;
                console.log('SSO capture_success' , response);

                //const authResult = response.result;
               // _verifyUUID(authResult.userData.uuid);
                }
            });

            setTimeout(function () {
                resolve(responseJanrain);
            }, 4000);
        });
    }

    function _addEngage() {
        var po = document.createElement('script');
        po.type = 'text/javascript';
        po.src = 'https://rpxnow.com/js/lib/login.pampers.com/engage.js';
        var s = document.getElementsByTagName('script')[0];
        s.parentNode.insertBefore(po, s);
    }

    function BaseUrl(){
        var path;
        const regxculture = /[a-zA-X,-]{5}/g;

        const currentUrl = window.location.href;
        const culture = currentUrl.split("/")[3]; // Get culture from url
        const hasCulture = regxculture.test(culture); // Check if culture is valid

        if(hasCulture){
            path = window.origin + "/" + culture;
        } else {
            path = window.origin;
        }

        return path;
    }

    function _warmUp(){ 
        _addEngage(); 
        const path = BaseUrl();       
        
        if (typeof window.janrain !== 'object') window.janrain = {};
        if (typeof window.janrain.settings !== 'object') window.janrain.settings = {};
        
        
        window.janrain.settings.tokenUrl = path +"/social-redirection";
        window.janrain.settings.popup = false;
        window.janrain.settings.tokenAction = 'url';
        window.janrain.ready = true;
        window.janrain.counter = 30;

        _deferJanrain(_initEvents);
    }

    function _initEvents(){
        window.janrain.events.onProviderLoginStart.addHandler(function() {
            console.log('Login Start');
        });     
        

        window.janrain.events.onProviderLoginComplete.addHandler(function(response) {
            console.log('Login complete!');
            console.log(`response.provider = ${response.provider}`);
            const event = new Event('onProviderLoginComplete');
            document.dispatchEvent(event)
        });

        window.janrain.events.onProviderLoginError.addHandler(function(response) {
            console.log('Login Error!');
            console.log(`response.err.code = ${response.err.code}`);
            console.log(`response.err.msg = ${response.err.msg}`);
            console.log(`response.origin = ${response.origin}`);
            console.log(`response.state = ${response.state}`);
        });

        window.janrain.events.onProviderLoginSuccess.addHandler(function() {
            console.log('Login Succcess!');
        });

        window.janrain.events.onReturnExperienceFound.addHandler(function(response) {
            console.log('Return Experience Found!');
            console.log(`response.name = ${response.name}`);
            console.log(`response.returnProvider = ${response.returnProvider}`);
            console.log(`response.welcomeName = ${response.welcomeName}`);
        });

        window.janrain.events.onProviderLoginToken.addHandler(function(response) {
            console.log('Provider Login Token Returned!');
            console.log(`response.token = ${response.token}`);
        });

        _SSOcallback();
    }

      //count for Janrain load
    const _deferJanrain = function(callback) {
        const callbackTimer = setInterval(function() {
        if (typeof window.janrain.events !== 'undefined') {
            console.log('SSO :: Janrain is initialized!');
            callback();
            clearInterval(callbackTimer);
        }
        if (window.janrain.counter === 0) {
            console.log('SSO :: Janrain is NOT initialized!');
        }
        window.janrain.counter--;
        }, 500);
    };


    function _forceLogout(){
        console.log("Force Logout! ")
        if(typeof window.setLoginStatus !== "undefined"){
            // console.log("SSO :: Unset UI for session")
            window.setLoginStatus(false);
        }
        if(typeof window.ClearSessionCookie !== "undefined"){
            // console.log("SSO :: Unset Code for session")
            window.ClearSessionCookie();
        }
        if(typeof window.ClearLocalStorage !== "undefined") {
            window.ClearLocalStorage();
        }
    }

    if (!("undefined" !== typeof n.JANRAIN && n.JANRAIN.SSO)) {
        var E = !1;
        window.localStorage && (E = window.localStorage.getItem("janrainSsoDebugEnabled"));
        JANRAIN = {
            SSO: {}
        };
        JANRAIN.SSO.CAPTURE = {};
        JANRAIN.SSO.version = "4.0-alpha";
        "undefined" === typeof janrain && (janrain = {});
        void 0 === janrain.capture && (janrain.capture = {});
        void 0 === janrain.capture.ui && (janrain.capture.ui = {});
        void 0 === janrain.capture.ui.handleCaptureResponse && (janrain.capture.ui.handleCaptureResponse = function(a) {});
        void 0 === janrain.capture.ui.handleStatusResponse && (janrain.capture.ui.handleStatusResponse = function(a) {});
        void 0 === janrain.capture.ui.handleErrorResponse && (janrain.capture.ui.handleErrorResponse = function(a) {});
        void 0 === janrain.capture.ui.login_callback && (janrain.capture.ui.login_callback =
            function(a) {});
        void 0 === janrain.capture.ui.nologin_callback && (janrain.capture.ui.nologin_callback = function(a) {});
        var A, w, x, B, v, m, F, k, G, H, l, C, I, y, p;
        u.prototype = {
            constructor: u,
            init: function() {
                var a = this;
                if (!this._iframe)
                    if (window.postMessage && window.JSON && window.localStorage && !JANRAIN.SSO.useCookiesOnly()) {
                        this._iframe = document.createElement("iframe");
                        this._iframe.style.cssText = "position:absolute;width:1px;height:1px;left:-9999px;";
                        var b = document.getElementsByTagName("script")[0];
                        b.parentNode.insertBefore(this._iframe,
                            b);
                        window.addEventListener ? (this._iframe.addEventListener("load", function() {
                            a._iframeLoaded()
                        }, !1), window.addEventListener("message", function(b) {
                            a._handleMessage(b)
                        }, !1)) : this._iframe.attachEvent && (this._iframe.attachEvent("onload", function() {
                            a._iframeLoaded()
                        }, !1), window.attachEvent("onmessage", function(b) {
                            a._handleMessage(b)
                        }))
                    } else throw Error("Unsupported browser.");
                this._iframe.src = this.origin + this.path
            },
            getValue: function(a, b, c) {
                a = {
                    request: {
                        key: a,
                        messageId: ++this._messageId,
                        action: b
                    },
                    callback: c
                };
                this._iframeReady ? this._sendRequest(a) : this._queue.push(a);
                this._iframe || this.init()
            },
            setValue: function(a, b, c, e) {
                a = {
                    request: {
                        key: a,
                        messageId: ++this._messageId,
                        action: b,
                        storedValue: c
                    },
                    callback: e
                };
                this._iframeReady ? this._sendRequest(a) : this._queue.push(a);
                this._iframe || this.init()
            },
            removeValue: function(a, b) {
                var c = {
                    request: {
                        key: a,
                        messageId: ++this._messageId,
                        action: "remove"
                    },
                    callback: b
                };
                this._iframeReady ? this._sendRequest(c) : this._queue.push(c);
                this._iframe || this.init()
            },
            _sendRequest: function(a) {
                this._requests[a.request.messageId] =
                    a;
                this._iframe.contentWindow.postMessage(JSON.stringify(a.request), this.origin)
            },
            _iframeLoaded: function() {
                this._iframeReady = !0;
                if (this._queue.length) {
                    for (var a = 0, b = this._queue.length; a < b; a++) this._sendRequest(this._queue[a]);
                    this._queue = []
                }
            },
            _handleMessage: function(a) {
                if (a.origin == this.origin) {
                    var b;
                    try {
                        b = JSON.parse(a.data)
                    } catch (c) {
                        JANRAIN.SSO.warn("json object did not parse: " + array), b = {}
                    }
                    "undefined" !== typeof b.messageId && (this._requests[b.messageId].callback(b.key, b.storedValue), delete this._requests[b.messageId])
                }
            }
        };
        t.options = {
            strictMode: !1,
            key: "source protocol authority userInfo user password host port relative path directory file query anchor".split(" "),
            q: {
                name: "queryKey",
                parser: /(?:^|&)([^&=]*)=?([^&]*)/g
            },
            parser: {
                strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
                loose: /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
            }
        };
        JANRAIN.SSO._deleteChecked = function() {
            for (var a = n.document.cookie.split(";"), b = 0; b < a.length; b++) - 1 < a[b].search(/janrain_sso_checked/) && (n.document.cookie = a[b] + "\x3d;expires\x3d" + (new Date).toGMTString() + ";path\x3d/;", JANRAIN.SSO.log("sso removed cookie " + a[b]))
        };
        JANRAIN.SSO._doLogout = function(a, b, c) {
            onComplete = function() {
                "undefined" !== typeof B && "function" === typeof B ? (JANRAIN.SSO.log("calling logout_callback()"), B()) : "undefined" !== typeof a && (JANRAIN.SSO.log("redirecting to " + a), n.document.location.href =
                    a)
            };
            JANRAIN.SSO._loadUrls(b, onComplete)
        };
        JANRAIN.SSO._getLogoutUrls = function(a, b) {
            var c = [],
                e;
            "undefined" !== typeof b && (e = s(b));
            JANRAIN.SSO.debug_log("localSiteKey: " + e);
            for (var f = 0; f < a.length; f++) {
                var g = s(a[f].xdReceiverURI),
                    r = a[f].isLoggedIn;
                JANRAIN.SSO.debug_log(f + 1 + " this siteKey: " + g);
                r && g !== e && (JANRAIN.SSO.debug_log("logoutURI: " + a[f].logoutURI), c.push(a[f].logoutURI))
            }
            return c
        };
        JANRAIN.SSO._loadUrls = function(a, b) {
            onComplete = function() {
                "undefined" !== typeof b && "function" === typeof b && b()
            };
            if (null !=
                a && 0 < a.length) {
                var c = 0;
                onFrameLoad = function() {
                    ++c;
                    c >= a.length && onComplete()
                };
                for (var e, f = 0; f < a.length; f++) {
                    n.document.all ? (e = document.createElement("div"), e.innerHTML = '\x3ciframe onload\x3d"onFrameLoad();"\x3e\x3c/iframe\x3e', e = e.firstChild) : (e = n.document.createElement("iframe"), e.onload = onFrameLoad);
                    var g = decodeURIComponent(a[f]);
                    "https:" === document.location.protocol && (g = g.replace("^http:", "https:"));
                    e.setAttribute("src", g);
                    JANRAIN.SSO.log("calling logout url " + f + " of " + a.length + ": " + a[f]);
                    n.document.getElementsByTagName("head")[0].appendChild(e)
                }
            } else onComplete()
        };
        JANRAIN.SSO.CAPTURE._login = function(a, b, c, e, f) {
            if ("undefined" === typeof l) JANRAIN.SSO.error("sso server is not defined");
            else {
                var g = document.createElement("script");
                g.src = l + "/capture/loginx?v\x3d" + (new Date).getTime() + "\x26callback\x3d" + encodeURIComponent(e) + "\x26xd_receiver\x3d" + encodeURIComponent(p) + "\x26origin\x3d" + encodeURIComponent(n.document.location.href) + "\x26logout_uri\x3d" + encodeURIComponent(v) + "\x26redirect_uri\x3d" + encodeURIComponent(m) + "\x26client_id\x3d" + encodeURIComponent(w) + "\x26bp_channel\x3d" +
                    encodeURIComponent(A) + "\x26segment\x3d" + encodeURIComponent(f) + "\x26response_type\x3d" + encodeURIComponent(a.response_type) + "\x26response_method\x3d" + encodeURIComponent(a.response_method) + "\x26widget_parameters\x3d" + encodeURIComponent(a.widget_parameters) + "\x26transaction_id\x3d" + encodeURIComponent(a.transaction_id) + "\x26session_id\x3d" + encodeURIComponent(b) + "\x26visited\x3d" + encodeURIComponent(c);
                g.type = "text/javascript";
                a = document.getElementsByTagName("script")[0];
                a.parentNode.insertBefore(g, a)
            }
        };
        JANRAIN.SSO.CAPTURE._loginCallback = function(a) {
            if (!a || "fail" === a.stat) JANRAIN.SSO.error("login failed: " + a.msg);
            else {
                JANRAIN.SSO.log("callback from SSO server received");
                k || (k = new u(l, "/static/server.html"));
                JANRAIN.SSO.log("updating SSO session");
                // JANRAIN.SSO.loginState = true;
                var b = {
                    session_id: decodeURIComponent(a.session_id),
                    visited: decodeURIComponent(a.visited),
                    visited_expires: a.visited_expires
                };
                k.setValue(a.segment, "set", b, function(b, e) {
                    a.capture_callback && "jsonp" === a.response_method && "undefined" !== typeof janrain && janrain.capture &&
                        janrain.capture.ui && "function" === typeof a.capture_callback ? a.capture_callback() : a.redirect_uri && 0 < a.redirect_uri.length && (n.document.location.href = a.redirect_uri)
                })
            }
        };
        JANRAIN.SSO._redirectCallback = function(a, b, c, e, f, g, r) {
            (g = g || l) ? !f && !p ? (JANRAIN.SSO.error("no session set, due to missing xd_receiver and logged_in_host parameters"), "function" === typeof r && r()) : (k || (k = new u(g, "/static/server.html")), JANRAIN.SSO.log("updating session"), k.getValue(f, "getSegment", function(c, l) {
                k.getValue(l.segment, "get",
                    function(c, k) {
                        var h = [],
                            n;
                        if (k.visited) {
                            JANRAIN.SSO.log("visited: " + k.visited);
                            h = z(k.visited);
                            p || (p = getXdrFromLocation());
                            var m = 0;
                            if (p) n = s(p);
                            else
                                for (var q = 0; q < h.length; q++) t(h[q].xdReceiverURI).host == f && m++;
                            1 < m && (JANRAIN.SSO.log("multiple domains match, resetting visited"), h = []);
                            for (q = 0; q < h.length; q++) {
                                var m = s(h[q].xdReceiverURI),
                                    u = t(h[q].xdReceiverURI);
                                if ("undefined" !== typeof m && (m === n || u.host === f)) {
                                    !0 === h[q].isLoggedIn ? JANRAIN.SSO.log("logging in again to: " + h[q].domain) : (JANRAIN.SSO.log("found and logging in to: " +
                                        h[q].domain), h[q].isLoggedIn = !0);
                                    h = [h[q]];
                                    break
                                }
                            }
                        } else JANRAIN.SSO.warn("expected a visited list for segment " + l.segment + " - none found");
                        JANRAIN.SSO._setSSOSession(a, b, JSON.stringify(h), e, g, l.segment, f, function() {
                            "function" === typeof r && r()
                        })
                    })
            })): (JANRAIN.SSO.error("no session set, due to missing sso server parameter"), "function" === typeof r && r())
        };
        JANRAIN.SSO._setSession = function(a, b, c, e, f, g) {
            JANRAIN.SSO._setSSOSession(a, null, b, c, l, e, f, g)
        };
        JANRAIN.SSO._setSSOSession = function(a, b, c, e, f, g, r, h) {
            k ||
                (k = new u(f, "/static/server.html"));
            JANRAIN.SSO.debug_log("visited expires:  " + e);
            b = {
                session_id: a,
                session_id_expires: b,
                visited: c,
                visited_expires: e,
                host: r
            };
            a ? JANRAIN.SSO.log("setting session " + b.host + " with segment " + g) : JANRAIN.SSO.log("updating the visited list for segment " + g);
            k.setValue(g, "set", b, function(a, b) {
                "undefined" !== h && "function" === typeof h && h()
            })
        };
        JANRAIN.SSO.check_login_dispatch = function(a, b) {
            k || (k = new u(a.sso_server, "/static/server.html"));
            JANRAIN.SSO.log("checking for session");
            JANRAIN.SSO.debug_log("Segments to check: " +
                a.supported_segments_ary);
            k.getValue("", "getAllVisited", function(c, e) {
                var f = s(a.xd_receiver),
                    g = z(e.allVisited).some(function(a) {
                        if (f === s(a.xdReceiverURI)) return a.isLoggedIn
                    });
                a.supported_segments_ary.forEach(function(c) {
                    k.getValue(c, "get", function(e, f) {
                        b(a, f, c, g)
                    })
                })
            })
        };
        JANRAIN.SSO.debug_log = function(a, b) {
            E && (b && (window.JSON && window.JSON.stringify && (b = JSON.stringify(b)), a += ": " + b), d = new Date, a = "SSO DEBUG (" + d.toGMTString() + "): " + a, window.console && window.console.debug ? console.debug(a) : window.console &&
                window.console.log && console.log(a))
        };
        JANRAIN.SSO.error = function(a) {
            window.console && window.console.error && console.error("SSO ERROR: " + a)
        };
        JANRAIN.SSO.CAPTURE.handleSegmentCheck = function(a, b, c, e) {
            var f = [],
                g = {
                    found: !1
                },
                k = s(a.xd_receiver),
                h = t(a.xd_receiver).host;
            JANRAIN.SSO.log("checking segment " + c);
            if (!b.visited_expires || "session" === b.visited_expires) {
                b.visited_expires = "session";
                cName = "";
                pCOOKIES = [];
                pCOOKIES = document.cookie.split("; ");
                for (bb = 0; bb < pCOOKIES.length; bb++) NmeVal = [], NmeVal = pCOOKIES[bb].split("\x3d"),
                    "janrainSSO_session" == NmeVal[0] && (cName = unescape(NmeVal[1]));
                1 < cName.length && ('"' === cName[0] && (cName = cName.substr(1, cName.length)), '"' === cName[cName.length - 1] && (cName = cName.substr(0, cName.length - 1)));
                "session" !== cName.replace(/\\"/g, '"') && (a.refresh = !0, JANRAIN.SSO.log("visited tracker is session-based but no janrainSSO_session cookie found; will refresh even if marked as logged in"), L("janrainSSO_session", "session", null, "/"))
            }
            if (b.visited && (f = z(b.visited), g = K(f, k), JANRAIN.SSO.debug_log("handleSegmentCheck visitedStatus",
                    g), !0 === g.found))
                if (!0 === g.isLoggedIn)
                    if (JANRAIN.SSO.log("already logged into: " + g.domain), a.refresh && !x) JANRAIN.SSO.log("overriding with refresh");
                    else {
                        if ("undefined" !== typeof janrain && janrain.capture && janrain.capture.ui && "function" === typeof janrain.capture.ui[a.nologin_callback]) janrain.capture.ui[a.nologin_callback]({
                            transactionId: a.transaction_id,
                            result: "already checked"
                        });
                        return
                    }
            else {
                JANRAIN.SSO.log("found: " + g.domain + " but not logged in");
                // JANRAIN.SSO.loginState = false;
                _forceLogout();
            };
            if (!g.found) {
                var l = t(a.xd_receiver);
                f.push({
                    domain: l.host +
                        l.path,
                    xdReceiverURI: a.xd_receiver,
                    isLoggedIn: !1,
                    logoutURI: a.logout_uri
                });
                10 < f.length && f.splice(0, 1)
            }!b.session_id || 1 > b.session_id.length ? (JANRAIN.SSO.log("no session exists; not logging in") && _forceLogout(), e = function() {
                if ("undefined" !== typeof janrain && janrain.capture && janrain.capture.ui && "function" === typeof janrain.capture.ui[a.nologin_callback]) janrain.capture.ui[a.nologin_callback]({
                    transactionId: a.transaction_id,
                    result: "sso failed - no session exists"
                })
            }, g.found ? e() : JANRAIN.SSO._setSession(b.session_id, JSON.stringify(f),
                b.visited_expires, c, h, e)) : (!b.visited && !x && (a.refresh = !0, JANRAIN.SSO.log("session exists, but no visited list; forcing a refresh")), e && !a.refresh || x ? (JANRAIN.SSO.log("capture user already logged in to the site; marking as logged in on this segment, too"), f.some(function(a, b) {
                if (s(a.xdReceiverURI) === k) return f[b].isLoggedIn = !0
            }), JANRAIN.SSO._setSession(b.session_id, JSON.stringify(f), b.visited_expires, c, h)) : (x = !0, JANRAIN.SSO.log("logging in capture user"), JANRAIN.SSO.CAPTURE._login(a, b.session_id, JSON.stringify(f),
                "JANRAIN.SSO.CAPTURE._loginCallback", c)))
        };
        JANRAIN.SSO.log = function(a, b) {
            window.console && window.console.log && (b && (window.JSON && window.JSON.stringify && (b = JSON.stringify(b)), a += ": " + b), d = new Date, console.log("SSO (" + d.toGMTString() + "): " + a))
        };
        JANRAIN.SSO.safariWorkAround = function(a) {
            var b = !1,
                c = navigator.userAgent;
            if (-1 != c.indexOf("Safari")) {
                var e = c.indexOf("Version");
                if (-1 != e) var c = c.substring(e + 8),
                    f = parseInt("" + c, 10);
                5 < f && (JANRAIN.SSO.debug_log("Safari version is " + f + ", workaround enabled"), b = !0)
            }
            b ?
                localStorage.getItem("federateUnlocked") || (JANRAIN.SSO.debug_log("SSO not unlocked yet"), b = encodeURIComponent(location.href), a = a + "/static/server.html?origin\x3d" + b, JANRAIN.SSO.debug_log("Navigating to SSO server at: " + a), localStorage.setItem("federateUnlocked", "true"), location.href = a) : JANRAIN.SSO.debug_log("safariWorkAround called but not in Safari")
        };
        JANRAIN.SSO.useCookiesOnly = function() {
            "undefined" === typeof I && (I = navigator && navigator.userAgent && -1 < navigator.userAgent.search("__use_cookies__") ? !0 :
                !1);
            return I
        };
        JANRAIN.SSO.warn = function(a) {
            window.console && window.console.warn && console.warn("SSO WARNING: " + a)
        };
        JANRAIN.SSO.end_session = function(a) {
            if (D()) {
                E && (callback_message = "undefined" === typeof a ? "callback function undefined" : "callback: " + a.name, JANRAIN.SSO.debug_log("logout called " + callback_message + " caller name: '" + arguments.callee.caller.name + "'"));
                JANRAIN.SSO._deleteChecked();
                "undefined" !== typeof a && "function" === typeof a && (B = a);
                var b = t(window.location.hostname).host;
                if (window.localStorage &&
                    !JANRAIN.SSO.useCookiesOnly()) k || (k = new u(l, "/static/server.html")), JANRAIN.SSO.log("removing session_id"), k.getValue(b, "getSegment", function(c, f) {
                    JANRAIN.SSO.log("got segment " + c + "\x3d" + f.segment);
                    k.getValue(f.segment, "getAllVisited", function(c, e) {
                        var h = [],
                            l = [];
                        if (e.allVisited) {
                            h = z(e.allVisited);
                            l = JANRAIN.SSO._getLogoutUrls(h, p);
                            JANRAIN.SSO.debug_log("SSO: logoutUrls: ", l);
                            for (var n = [], m = 0; m < h.length; m++) {
                                var s = t(h[m].xdReceiverURI).host;
                                if (h[m].xdReceiverURI === p || s === b) {
                                    h[m].isLoggedIn = !1;
                                    n = [h[m]];
                                    break
                                }
                            }
                            h = n
                        }
                        toBeDeletedValue = e;
                        toBeDeletedValue.session_id = "deleteMe";
                        toBeDeletedValue.visited = JSON.stringify(h);
                        toBeDeletedValue.session_id_expires = "deleteMe";
                        JANRAIN.SSO.log("deleting session " + toBeDeletedValue);
                        JANRAIN.SSO.log("deleting session " + toBeDeletedValue.visited);
                        k.setValue(f.segment, "deleteSession", toBeDeletedValue, function(b, c) {
                            JANRAIN.SSO.log("session removed " + b + "\x3d" + c);
                            JANRAIN.SSO._doLogout(v, l, a)
                        })
                    })
                });
                else {
                    var c = n.document.createElement("script");
                    c.setAttribute("src", l + "/session/logout.js?logout_uri\x3d" +
                        encodeURIComponent(v));
                    document.getElementsByTagName("body")[0].appendChild(c)
                }
            } else JANRAIN.SSO.warn("SSO has not been configured.")
        };
        JANRAIN.SSO.check_session = function(a, b, c) {
            w = a.client_id;
            m = a.redirect_uri;
            l = a.sso_server;
            y = JSON.stringify({
                flow: a.flow_name,
                flow_version: a.flow_version,
                locale: a.locale
            });
            p = a.xd_receiver;
            v = a.logout_uri;
            A = a.bp_channel || "";
            F = a.refresh || !1;
            H = a.response_type || "token";
            G = a.response_method || "jsonp";
            login_callback = "login_callback";
            a.callback_failure && (janrain.capture.ui.nologin_callback =
                a.callback_failure);
            a.callback_success && (janrain.capture.ui.login_callback = a.callback_success);
            a.capture_error && (janrain.capture.ui.handleErrorResponse = a.capture_error);
            a.capture_status && (janrain.capture.ui.handleStatusResponse = a.capture_status);
            a.capture_success && (janrain.capture.ui.handleCaptureResponse = a.capture_success);
            D() ? (a = J(), JANRAIN.SSO.safariWorkAround(l), x = !1, c = void 0 === c ? "" : c.replace(/ /g, "_"), C = [], void 0 !== b && (C = b.split("-")), C.push(c), window.localStorage && !JANRAIN.SSO.useCookiesOnly() ? (a = {
                bp_channel: A,
                client_id: w,
                logout_uri: v,
                redirect_uri: m,
                refresh: F,
                response_method: G,
                response_type: H,
                segment: c,
                sso_server: l,
                transaction_id: a,
                supported_segments: b,
                supported_segments_ary: C,
                widget_parameters: y,
                xd_receiver: p
            }, JANRAIN.SSO.check_login_dispatch(a, JANRAIN.SSO.CAPTURE.handleSegmentCheck)) : (b = "janrain_sso_checked_" + getPath(p), -1 === n.document.cookie.search(RegExp(b)) ? (b = document.createElement("script"), b.src = l + "/capture/v1/sso_check.js?v\x3d" + (new Date).getTime() + "\x26xd_receiver\x3d" + encodeURIComponent(p) + "\x26origin\x3d" + encodeURIComponent(n.document.location.href) + "\x26logout_uri\x3d" +
                encodeURIComponent(v) + "\x26redirect_uri\x3d" + encodeURIComponent(m) + "\x26client_id\x3d" + encodeURIComponent(w) + "\x26bp_channel\x3d" + encodeURIComponent(A) + "\x26segment\x3d" + encodeURIComponent(c) + "\x26response_type\x3d" + encodeURIComponent(H) + "\x26response_method\x3d" + encodeURIComponent(G) + "\x26widget_parameters\x3d" + encodeURIComponent(y) + "\x26nologin_callback\x3d" + encodeURIComponent("nologin_callback") + "\x26transaction_id\x3d" + encodeURIComponent(a) + "\x26refresh\x3d" + F, b.type = "text/javascript", c = document.getElementsByTagName("script")[0],
                c.parentNode.insertBefore(b, c)) : "undefined" !== typeof janrain && (janrain.capture && janrain.capture.ui && "function" === typeof janrain.capture.ui.nologin_callback) && janrain.capture.ui.nologin_callback({
                transactionId: a,
                result: "already checked"
            }))) : JANRAIN.SSO.warn("config missing required parameters. Please include client_id, redirect_uri, sso_server, flow_name, flow_version, locale, and xd_receiver")
        };
        JANRAIN.SSO.set_session = function(a) {
            if (D())
                if ("undefined" === typeof l || "undefined" === typeof m) JANRAIN.SSO.error("check_login must be called before calling set_login");
                else {
                    var b = J(),
                        c = document.createElement("script");
                    c.src = l + "/capture/v1/set_login?v\x3d" + (new Date).getTime() + "\x26redirect_uri\x3d" + encodeURIComponent(m) + "\x26code\x3d" + encodeURIComponent(a) + "\x26login_callback\x3d" + encodeURIComponent(login_callback) + "\x26transaction_id\x3d" + encodeURIComponent(b);
                    c.type = "text/javascript";
                    a = document.getElementsByTagName("script")[0];
                    a.parentNode.insertBefore(c, a)
                }
            else JANRAIN.SSO.warn("SSO has not been configured.")
        }
    }

    _warmUp();

})(this);