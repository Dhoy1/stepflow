var ka = Object.defineProperty;
var Aa = (P, Q, ae) => Q in P ? ka(P, Q, { enumerable: !0, configurable: !0, writable: !0, value: ae }) : P[Q] = ae;
var $n = (P, Q, ae) => Aa(P, typeof Q != "symbol" ? Q + "" : Q, ae);
var Ta = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function Ca(P) {
  return P && P.__esModule && Object.prototype.hasOwnProperty.call(P, "default") ? P.default : P;
}
var Zt = { exports: {} }, Ia = Zt.exports, Wr;
function Ka() {
  return Wr || (Wr = 1, (function(P, Q) {
    (function(ae, me) {
      P.exports = me();
    })(Ia, (function() {
      var ae = function(e, t) {
        return ae = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(n, r) {
          n.__proto__ = r;
        } || function(n, r) {
          for (var i in r) Object.prototype.hasOwnProperty.call(r, i) && (n[i] = r[i]);
        }, ae(e, t);
      };
      function me(e, t) {
        if (typeof t != "function" && t !== null)
          throw new TypeError("Class extends value " + String(t) + " is not a constructor or null");
        ae(e, t);
        function n() {
          this.constructor = e;
        }
        e.prototype = t === null ? Object.create(t) : (n.prototype = t.prototype, new n());
      }
      var O = function() {
        return O = Object.assign || function(t) {
          for (var n, r = 1, i = arguments.length; r < i; r++) {
            n = arguments[r];
            for (var a in n) Object.prototype.hasOwnProperty.call(n, a) && (t[a] = n[a]);
          }
          return t;
        }, O.apply(this, arguments);
      };
      function ee(e, t, n) {
        for (var r = 0, i = t.length, a; r < i; r++)
          (a || !(r in t)) && (a || (a = Array.prototype.slice.call(t, 0, r)), a[r] = t[r]);
        return e.concat(a || Array.prototype.slice.call(t));
      }
      typeof SuppressedError == "function" && SuppressedError;
      var G = typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : Ta, Y = Object.keys, V = Array.isArray;
      typeof Promise < "u" && !G.Promise && (G.Promise = Promise);
      function te(e, t) {
        return typeof t != "object" || Y(t).forEach(function(n) {
          e[n] = t[n];
        }), e;
      }
      var ge = Object.getPrototypeOf, _t = {}.hasOwnProperty;
      function ne(e, t) {
        return _t.call(e, t);
      }
      function we(e, t) {
        typeof t == "function" && (t = t(ge(e))), (typeof Reflect > "u" ? Y : Reflect.ownKeys)(t).forEach(function(n) {
          fe(e, n, t[n]);
        });
      }
      var it = Object.defineProperty;
      function fe(e, t, n, r) {
        it(e, t, te(n && ne(n, "get") && typeof n.get == "function" ? {
          get: n.get,
          set: n.set,
          configurable: !0
        } : { value: n, configurable: !0, writable: !0 }, r));
      }
      function M(e) {
        return {
          from: function(t) {
            return e.prototype = Object.create(t.prototype), fe(e.prototype, "constructor", e), {
              extend: we.bind(null, e.prototype)
            };
          }
        };
      }
      var z = Object.getOwnPropertyDescriptor;
      function N(e, t) {
        var n = z(e, t), r;
        return n || (r = ge(e)) && N(r, t);
      }
      var he = [].slice;
      function ve(e, t, n) {
        return he.call(e, t, n);
      }
      function xt(e, t) {
        return t(e);
      }
      function Oe(e) {
        if (!e)
          throw new Error("Assertion Failed");
      }
      function Hn(e) {
        G.setImmediate ? setImmediate(e) : setTimeout(e, 0);
      }
      function Gr(e, t) {
        return e.reduce(function(n, r, i) {
          var a = t(r, i);
          return a && (n[a[0]] = a[1]), n;
        }, {});
      }
      function be(e, t) {
        if (typeof t == "string" && ne(e, t))
          return e[t];
        if (!t)
          return e;
        if (typeof t != "string") {
          for (var n = [], r = 0, i = t.length; r < i; ++r) {
            var a = be(e, t[r]);
            n.push(a);
          }
          return n;
        }
        var o = t.indexOf(".");
        if (o !== -1) {
          var u = e[t.substr(0, o)];
          return u == null ? void 0 : be(u, t.substr(o + 1));
        }
      }
      function ue(e, t, n) {
        if (!(!e || t === void 0) && !("isFrozen" in Object && Object.isFrozen(e)))
          if (typeof t != "string" && "length" in t) {
            Oe(typeof n != "string" && "length" in n);
            for (var r = 0, i = t.length; r < i; ++r)
              ue(e, t[r], n[r]);
          } else {
            var a = t.indexOf(".");
            if (a !== -1) {
              var o = t.substr(0, a), u = t.substr(a + 1);
              if (u === "")
                n === void 0 ? V(e) && !isNaN(parseInt(o)) ? e.splice(o, 1) : delete e[o] : e[o] = n;
              else {
                var s = e[o];
                if (!s || !ne(e, o)) {
                  if (n === void 0)
                    return;
                  s = e[o] = {};
                }
                ue(s, u, n);
              }
            } else
              n === void 0 ? V(e) && !isNaN(parseInt(t)) ? e.splice(t, 1) : delete e[t] : e[t] = n;
          }
      }
      function Yr(e, t) {
        typeof t == "string" ? ue(e, t, void 0) : "length" in t && [].map.call(t, function(n) {
          ue(e, n, void 0);
        });
      }
      function Qn(e) {
        var t = {};
        for (var n in e)
          ne(e, n) && (t[n] = e[n]);
        return t;
      }
      var Hr = [].concat;
      function Xn(e) {
        return Hr.apply([], e);
      }
      var Qr = "BigUint64Array,BigInt64Array,Array,Boolean,String,Date,RegExp,Blob,File,FileList,FileSystemFileHandle,FileSystemDirectoryHandle,ArrayBuffer,DataView,Uint8ClampedArray,ImageBitmap,ImageData,Map,Set,CryptoKey".split(",").concat(Xn([8, 16, 32, 64].map(function(e) {
        return ["Int", "Uint", "Float"].map(function(t) {
          return t + e + "Array";
        });
      }))).filter(function(e) {
        return G[e];
      }), Jn = new Set(Qr.map(function(e) {
        return G[e];
      }));
      function Zn(e) {
        var t = {};
        for (var n in e)
          if (ne(e, n)) {
            var r = e[n];
            t[n] = !r || typeof r != "object" || Jn.has(r.constructor) ? r : Zn(r);
          }
        return t;
      }
      var at = null;
      function Pe(e) {
        at = /* @__PURE__ */ new WeakMap();
        var t = en(e);
        return at = null, t;
      }
      function en(e) {
        if (!e || typeof e != "object")
          return e;
        var t = at.get(e);
        if (t)
          return t;
        if (V(e)) {
          t = [], at.set(e, t);
          for (var n = 0, r = e.length; n < r; ++n)
            t.push(en(e[n]));
        } else if (Jn.has(e.constructor))
          t = e;
        else {
          var i = ge(e);
          t = i === Object.prototype ? {} : Object.create(i), at.set(e, t);
          for (var a in e)
            ne(e, a) && (t[a] = en(e[a]));
        }
        return t;
      }
      var Xr = {}.toString;
      function tn(e) {
        return Xr.call(e).slice(8, -1);
      }
      var nn = typeof Symbol < "u" ? Symbol.iterator : "@@iterator", Jr = typeof nn == "symbol" ? function(e) {
        var t;
        return e != null && (t = e[nn]) && t.apply(e);
      } : function() {
        return null;
      };
      function Re(e, t) {
        var n = e.indexOf(t);
        return n >= 0 && e.splice(n, 1), n >= 0;
      }
      var Ye = {};
      function _e(e) {
        var t, n, r, i;
        if (arguments.length === 1) {
          if (V(e))
            return e.slice();
          if (this === Ye && typeof e == "string")
            return [e];
          if (i = Jr(e)) {
            for (n = []; r = i.next(), !r.done; )
              n.push(r.value);
            return n;
          }
          if (e == null)
            return [e];
          if (t = e.length, typeof t == "number") {
            for (n = new Array(t); t--; )
              n[t] = e[t];
            return n;
          }
          return [e];
        }
        for (t = arguments.length, n = new Array(t); t--; )
          n[t] = arguments[t];
        return n;
      }
      var rn = typeof Symbol < "u" ? function(e) {
        return e[Symbol.toStringTag] === "AsyncFunction";
      } : function() {
        return !1;
      }, Zr = [
        "Modify",
        "Bulk",
        "OpenFailed",
        "VersionChange",
        "Schema",
        "Upgrade",
        "InvalidTable",
        "MissingAPI",
        "NoSuchDatabase",
        "InvalidArgument",
        "SubTransaction",
        "Unsupported",
        "Internal",
        "DatabaseClosed",
        "PrematureCommit",
        "ForeignAwait"
      ], qn = [
        "Unknown",
        "Constraint",
        "Data",
        "TransactionInactive",
        "ReadOnly",
        "Version",
        "NotFound",
        "InvalidState",
        "InvalidAccess",
        "Abort",
        "Timeout",
        "QuotaExceeded",
        "Syntax",
        "DataClone"
      ], an = Zr.concat(qn), qr = {
        VersionChanged: "Database version changed by other database connection",
        DatabaseClosed: "Database has been closed",
        Abort: "Transaction aborted",
        TransactionInactive: "Transaction has already completed or failed",
        MissingAPI: "IndexedDB API missing. Please visit https://tinyurl.com/y2uuvskb"
      };
      function He(e, t) {
        this.name = e, this.message = t;
      }
      M(He).from(Error).extend({
        toString: function() {
          return this.name + ": " + this.message;
        }
      });
      function er(e, t) {
        return e + ". Errors: " + Object.keys(t).map(function(n) {
          return t[n].toString();
        }).filter(function(n, r, i) {
          return i.indexOf(n) === r;
        }).join(`
`);
      }
      function Et(e, t, n, r) {
        this.failures = t, this.failedKeys = r, this.successCount = n, this.message = er(e, t);
      }
      M(Et).from(He);
      function Qe(e, t) {
        this.name = "BulkError", this.failures = Object.keys(t).map(function(n) {
          return t[n];
        }), this.failuresByPos = t, this.message = er(e, this.failures);
      }
      M(Qe).from(He);
      var on = an.reduce(function(e, t) {
        return e[t] = t + "Error", e;
      }, {}), ei = He, D = an.reduce(function(e, t) {
        var n = t + "Error";
        function r(i, a) {
          this.name = n, i ? typeof i == "string" ? (this.message = "".concat(i).concat(a ? `
 ` + a : ""), this.inner = a || null) : typeof i == "object" && (this.message = "".concat(i.name, " ").concat(i.message), this.inner = i) : (this.message = qr[t] || n, this.inner = null);
        }
        return M(r).from(ei), e[t] = r, e;
      }, {});
      D.Syntax = SyntaxError, D.Type = TypeError, D.Range = RangeError;
      var tr = qn.reduce(function(e, t) {
        return e[t + "Error"] = D[t], e;
      }, {});
      function ti(e, t) {
        if (!e || e instanceof He || e instanceof TypeError || e instanceof SyntaxError || !e.name || !tr[e.name])
          return e;
        var n = new tr[e.name](t || e.message, e);
        return "stack" in e && fe(n, "stack", {
          get: function() {
            return this.inner.stack;
          }
        }), n;
      }
      var St = an.reduce(function(e, t) {
        return ["Syntax", "Type", "Range"].indexOf(t) === -1 && (e[t + "Error"] = D[t]), e;
      }, {});
      St.ModifyError = Et, St.DexieError = He, St.BulkError = Qe;
      function W() {
      }
      function ot(e) {
        return e;
      }
      function ni(e, t) {
        return e == null || e === ot ? t : function(n) {
          return t(e(n));
        };
      }
      function Be(e, t) {
        return function() {
          e.apply(this, arguments), t.apply(this, arguments);
        };
      }
      function ri(e, t) {
        return e === W ? t : function() {
          var n = e.apply(this, arguments);
          n !== void 0 && (arguments[0] = n);
          var r = this.onsuccess, i = this.onerror;
          this.onsuccess = null, this.onerror = null;
          var a = t.apply(this, arguments);
          return r && (this.onsuccess = this.onsuccess ? Be(r, this.onsuccess) : r), i && (this.onerror = this.onerror ? Be(i, this.onerror) : i), a !== void 0 ? a : n;
        };
      }
      function ii(e, t) {
        return e === W ? t : function() {
          e.apply(this, arguments);
          var n = this.onsuccess, r = this.onerror;
          this.onsuccess = this.onerror = null, t.apply(this, arguments), n && (this.onsuccess = this.onsuccess ? Be(n, this.onsuccess) : n), r && (this.onerror = this.onerror ? Be(r, this.onerror) : r);
        };
      }
      function ai(e, t) {
        return e === W ? t : function() {
          var n = e.apply(this, arguments), r = arguments[0];
          te(r, n);
          var i = this.onsuccess, a = this.onerror;
          this.onsuccess = null, this.onerror = null;
          var o = t.apply(this, arguments);
          return i && (this.onsuccess = this.onsuccess ? Be(i, this.onsuccess) : i), a && (this.onerror = this.onerror ? Be(a, this.onerror) : a), n === void 0 ? o === void 0 ? void 0 : o : te(n, o);
        };
      }
      function oi(e, t) {
        return e === W ? t : function() {
          return t.apply(this, arguments) === !1 ? !1 : e.apply(this, arguments);
        };
      }
      function un(e, t) {
        return e === W ? t : function() {
          var n = e.apply(this, arguments);
          if (n && typeof n.then == "function") {
            for (var r = this, i = arguments.length, a = new Array(i); i--; )
              a[i] = arguments[i];
            return n.then(function() {
              return t.apply(r, a);
            });
          }
          return t.apply(this, arguments);
        };
      }
      var ye = typeof location < "u" && /^(http|https):\/\/(localhost|127\.0\.0\.1)/.test(location.href);
      function nr(e, t) {
        ye = e;
      }
      var ut = {}, rr = 100, sn = typeof Promise > "u" ? [] : (function() {
        var e = Promise.resolve();
        if (typeof crypto > "u" || !crypto.subtle)
          return [e, ge(e), e];
        var t = crypto.subtle.digest("SHA-512", new Uint8Array([0]));
        return [t, ge(t), e];
      })(), ir = sn[0], ar = sn[1], ui = sn[2], si = ar && ar.then, Me = ir && ir.constructor, cn = !!ui;
      function ci() {
        queueMicrotask(fi);
      }
      var st = function(e, t) {
        ct.push([e, t]), kt && (ci(), kt = !1);
      }, ln = !0, kt = !0, Fe = [], At = [], fn = ot, xe = {
        id: "global",
        global: !0,
        ref: 0,
        unhandleds: [],
        onunhandled: W,
        pgp: !1,
        env: {},
        finalize: W
      }, C = xe, ct = [], je = 0, Tt = [];
      function k(e) {
        if (typeof this != "object")
          throw new TypeError("Promises must be constructed via new");
        this._listeners = [], this._lib = !1;
        var t = this._PSD = C;
        if (typeof e != "function") {
          if (e !== ut)
            throw new TypeError("Not a function");
          this._state = arguments[1], this._value = arguments[2], this._state === !1 && dn(this, this._value);
          return;
        }
        this._state = null, this._value = null, ++t.ref, ur(this, e);
      }
      var hn = {
        get: function() {
          var e = C, t = Dt;
          function n(r, i) {
            var a = this, o = !e.global && (e !== C || t !== Dt), u = o && !Ae(), s = new k(function(c, l) {
              pn(a, new or(lr(r, e, o, u), lr(i, e, o, u), c, l, e));
            });
            return this._consoleTask && (s._consoleTask = this._consoleTask), s;
          }
          return n.prototype = ut, n;
        },
        set: function(e) {
          fe(this, "then", e && e.prototype === ut ? hn : {
            get: function() {
              return e;
            },
            set: hn.set
          });
        }
      };
      we(k.prototype, {
        then: hn,
        _then: function(e, t) {
          pn(this, new or(null, null, e, t, C));
        },
        catch: function(e) {
          if (arguments.length === 1)
            return this.then(null, e);
          var t = arguments[0], n = arguments[1];
          return typeof t == "function" ? this.then(null, function(r) {
            return r instanceof t ? n(r) : Ct(r);
          }) : this.then(null, function(r) {
            return r && r.name === t ? n(r) : Ct(r);
          });
        },
        finally: function(e) {
          return this.then(function(t) {
            return k.resolve(e()).then(function() {
              return t;
            });
          }, function(t) {
            return k.resolve(e()).then(function() {
              return Ct(t);
            });
          });
        },
        timeout: function(e, t) {
          var n = this;
          return e < 1 / 0 ? new k(function(r, i) {
            var a = setTimeout(function() {
              return i(new D.Timeout(t));
            }, e);
            n.then(r, i).finally(clearTimeout.bind(null, a));
          }) : this;
        }
      }), typeof Symbol < "u" && Symbol.toStringTag && fe(k.prototype, Symbol.toStringTag, "Dexie.Promise"), xe.env = cr();
      function or(e, t, n, r, i) {
        this.onFulfilled = typeof e == "function" ? e : null, this.onRejected = typeof t == "function" ? t : null, this.resolve = n, this.reject = r, this.psd = i;
      }
      we(k, {
        all: function() {
          var e = _e.apply(null, arguments).map(Ot);
          return new k(function(t, n) {
            e.length === 0 && t([]);
            var r = e.length;
            e.forEach(function(i, a) {
              return k.resolve(i).then(function(o) {
                e[a] = o, --r || t(e);
              }, n);
            });
          });
        },
        resolve: function(e) {
          if (e instanceof k)
            return e;
          if (e && typeof e.then == "function")
            return new k(function(n, r) {
              e.then(n, r);
            });
          var t = new k(ut, !0, e);
          return t;
        },
        reject: Ct,
        race: function() {
          var e = _e.apply(null, arguments).map(Ot);
          return new k(function(t, n) {
            e.map(function(r) {
              return k.resolve(r).then(t, n);
            });
          });
        },
        PSD: {
          get: function() {
            return C;
          },
          set: function(e) {
            return C = e;
          }
        },
        totalEchoes: { get: function() {
          return Dt;
        } },
        newPSD: ke,
        usePSD: Ne,
        scheduler: {
          get: function() {
            return st;
          },
          set: function(e) {
            st = e;
          }
        },
        rejectionMapper: {
          get: function() {
            return fn;
          },
          set: function(e) {
            fn = e;
          }
        },
        follow: function(e, t) {
          return new k(function(n, r) {
            return ke(function(i, a) {
              var o = C;
              o.unhandleds = [], o.onunhandled = a, o.finalize = Be(function() {
                var u = this;
                hi(function() {
                  u.unhandleds.length === 0 ? i() : a(u.unhandleds[0]);
                });
              }, o.finalize), e();
            }, t, n, r);
          });
        }
      }), Me && (Me.allSettled && fe(k, "allSettled", function() {
        var e = _e.apply(null, arguments).map(Ot);
        return new k(function(t) {
          e.length === 0 && t([]);
          var n = e.length, r = new Array(n);
          e.forEach(function(i, a) {
            return k.resolve(i).then(function(o) {
              return r[a] = { status: "fulfilled", value: o };
            }, function(o) {
              return r[a] = { status: "rejected", reason: o };
            }).then(function() {
              return --n || t(r);
            });
          });
        });
      }), Me.any && typeof AggregateError < "u" && fe(k, "any", function() {
        var e = _e.apply(null, arguments).map(Ot);
        return new k(function(t, n) {
          e.length === 0 && n(new AggregateError([]));
          var r = e.length, i = new Array(r);
          e.forEach(function(a, o) {
            return k.resolve(a).then(function(u) {
              return t(u);
            }, function(u) {
              i[o] = u, --r || n(new AggregateError(i));
            });
          });
        });
      }), Me.withResolvers && (k.withResolvers = Me.withResolvers));
      function ur(e, t) {
        try {
          t(function(n) {
            if (e._state === null) {
              if (n === e)
                throw new TypeError("A promise cannot be resolved with itself.");
              var r = e._lib && Xe();
              n && typeof n.then == "function" ? ur(e, function(i, a) {
                n instanceof k ? n._then(i, a) : n.then(i, a);
              }) : (e._state = !0, e._value = n, sr(e)), r && Je();
            }
          }, dn.bind(null, e));
        } catch (n) {
          dn(e, n);
        }
      }
      function dn(e, t) {
        if (At.push(t), e._state === null) {
          var n = e._lib && Xe();
          t = fn(t), e._state = !1, e._value = t, di(e), sr(e), n && Je();
        }
      }
      function sr(e) {
        var t = e._listeners;
        e._listeners = [];
        for (var n = 0, r = t.length; n < r; ++n)
          pn(e, t[n]);
        var i = e._PSD;
        --i.ref || i.finalize(), je === 0 && (++je, st(function() {
          --je === 0 && vn();
        }, []));
      }
      function pn(e, t) {
        if (e._state === null) {
          e._listeners.push(t);
          return;
        }
        var n = e._state ? t.onFulfilled : t.onRejected;
        if (n === null)
          return (e._state ? t.resolve : t.reject)(e._value);
        ++t.psd.ref, ++je, st(li, [n, e, t]);
      }
      function li(e, t, n) {
        try {
          var r, i = t._value;
          !t._state && At.length && (At = []), r = ye && t._consoleTask ? t._consoleTask.run(function() {
            return e(i);
          }) : e(i), !t._state && At.indexOf(i) === -1 && pi(t), n.resolve(r);
        } catch (a) {
          n.reject(a);
        } finally {
          --je === 0 && vn(), --n.psd.ref || n.psd.finalize();
        }
      }
      function fi() {
        Ne(xe, function() {
          Xe() && Je();
        });
      }
      function Xe() {
        var e = ln;
        return ln = !1, kt = !1, e;
      }
      function Je() {
        var e, t, n;
        do
          for (; ct.length > 0; )
            for (e = ct, ct = [], n = e.length, t = 0; t < n; ++t) {
              var r = e[t];
              r[0].apply(null, r[1]);
            }
        while (ct.length > 0);
        ln = !0, kt = !0;
      }
      function vn() {
        var e = Fe;
        Fe = [], e.forEach(function(r) {
          r._PSD.onunhandled.call(null, r._value, r);
        });
        for (var t = Tt.slice(0), n = t.length; n; )
          t[--n]();
      }
      function hi(e) {
        function t() {
          e(), Tt.splice(Tt.indexOf(t), 1);
        }
        Tt.push(t), ++je, st(function() {
          --je === 0 && vn();
        }, []);
      }
      function di(e) {
        Fe.some(function(t) {
          return t._value === e._value;
        }) || Fe.push(e);
      }
      function pi(e) {
        for (var t = Fe.length; t; )
          if (Fe[--t]._value === e._value) {
            Fe.splice(t, 1);
            return;
          }
      }
      function Ct(e) {
        return new k(ut, !1, e);
      }
      function $(e, t) {
        var n = C;
        return function() {
          var r = Xe(), i = C;
          try {
            return Te(n, !0), e.apply(this, arguments);
          } catch (a) {
            t && t(a);
          } finally {
            Te(i, !1), r && Je();
          }
        };
      }
      var J = { awaits: 0, echoes: 0, id: 0 }, vi = 0, It = [], Kt = 0, Dt = 0, yi = 0;
      function ke(e, t, n, r) {
        var i = C, a = Object.create(i);
        a.parent = i, a.ref = 0, a.global = !1, a.id = ++yi, xe.env, a.env = cn ? {
          Promise: k,
          PromiseProp: {
            value: k,
            configurable: !0,
            writable: !0
          },
          all: k.all,
          race: k.race,
          allSettled: k.allSettled,
          any: k.any,
          resolve: k.resolve,
          reject: k.reject
        } : {}, t && te(a, t), ++i.ref, a.finalize = function() {
          --this.parent.ref || this.parent.finalize();
        };
        var o = Ne(a, e, n, r);
        return a.ref === 0 && a.finalize(), o;
      }
      function Ze() {
        return J.id || (J.id = ++vi), ++J.awaits, J.echoes += rr, J.id;
      }
      function Ae() {
        return J.awaits ? (--J.awaits === 0 && (J.id = 0), J.echoes = J.awaits * rr, !0) : !1;
      }
      ("" + si).indexOf("[native code]") === -1 && (Ze = Ae = W);
      function Ot(e) {
        return J.echoes && e && e.constructor === Me ? (Ze(), e.then(function(t) {
          return Ae(), t;
        }, function(t) {
          return Ae(), H(t);
        })) : e;
      }
      function mi(e) {
        ++Dt, (!J.echoes || --J.echoes === 0) && (J.echoes = J.awaits = J.id = 0), It.push(C), Te(e, !0);
      }
      function gi() {
        var e = It[It.length - 1];
        It.pop(), Te(e, !1);
      }
      function Te(e, t) {
        var n = C;
        if ((t ? J.echoes && (!Kt++ || e !== C) : Kt && (!--Kt || e !== C)) && queueMicrotask(t ? mi.bind(null, e) : gi), e !== C && (C = e, n === xe && (xe.env = cr()), cn)) {
          var r = xe.env.Promise, i = e.env;
          (n.global || e.global) && (Object.defineProperty(G, "Promise", i.PromiseProp), r.all = i.all, r.race = i.race, r.resolve = i.resolve, r.reject = i.reject, i.allSettled && (r.allSettled = i.allSettled), i.any && (r.any = i.any));
        }
      }
      function cr() {
        var e = G.Promise;
        return cn ? {
          Promise: e,
          PromiseProp: Object.getOwnPropertyDescriptor(G, "Promise"),
          all: e.all,
          race: e.race,
          allSettled: e.allSettled,
          any: e.any,
          resolve: e.resolve,
          reject: e.reject
        } : {};
      }
      function Ne(e, t, n, r, i) {
        var a = C;
        try {
          return Te(e, !0), t(n, r, i);
        } finally {
          Te(a, !1);
        }
      }
      function lr(e, t, n, r) {
        return typeof e != "function" ? e : function() {
          var i = C;
          n && Ze(), Te(t, !0);
          try {
            return e.apply(this, arguments);
          } finally {
            Te(i, !1), r && queueMicrotask(Ae);
          }
        };
      }
      function yn(e) {
        Promise === Me && J.echoes === 0 ? Kt === 0 ? e() : enqueueNativeMicroTask(e) : setTimeout(e, 0);
      }
      var H = k.reject;
      function mn(e, t, n, r) {
        if (!e.idbdb || !e._state.openComplete && !C.letThrough && !e._vip) {
          if (e._state.openComplete)
            return H(new D.DatabaseClosed(e._state.dbOpenError));
          if (!e._state.isBeingOpened) {
            if (!e._state.autoOpen)
              return H(new D.DatabaseClosed());
            e.open().catch(W);
          }
          return e._state.dbReadyPromise.then(function() {
            return mn(e, t, n, r);
          });
        } else {
          var i = e._createTransaction(t, n, e._dbSchema);
          try {
            i.create(), e._state.PR1398_maxLoop = 3;
          } catch (a) {
            return a.name === on.InvalidState && e.isOpen() && --e._state.PR1398_maxLoop > 0 ? (console.warn("Dexie: Need to reopen db"), e.close({ disableAutoOpen: !1 }), e.open().then(function() {
              return mn(e, t, n, r);
            })) : H(a);
          }
          return i._promise(t, function(a, o) {
            return ke(function() {
              return C.trans = i, r(a, o, i);
            });
          }).then(function(a) {
            if (t === "readwrite")
              try {
                i.idbtrans.commit();
              } catch {
              }
            return t === "readonly" ? a : i._completion.then(function() {
              return a;
            });
          });
        }
      }
      var fr = "4.4.7", Le = "￿", gn = -1 / 0, Ee = "Invalid key provided. Keys must be of type string, number, Date or Array<string | number | Date>.", hr = "String expected.", dr = 1e3, Pt = "__dbnames", wn = "readonly", bn = "readwrite";
      function We(e, t) {
        return e ? t ? function() {
          return e.apply(this, arguments) && t.apply(this, arguments);
        } : e : t;
      }
      var pr = {
        type: 3,
        lower: -1 / 0,
        lowerOpen: !1,
        upper: [[]],
        upperOpen: !1
      };
      function Rt(e) {
        return typeof e == "string" && !/\./.test(e) ? function(t) {
          return t[e] === void 0 && e in t && (t = Pe(t), delete t[e]), t;
        } : function(t) {
          return t;
        };
      }
      function vr() {
        throw D.Type("Entity instances must never be new:ed. Instances are generated by the framework bypassing the constructor.");
      }
      function j(e, t) {
        try {
          var n = yr(e), r = yr(t);
          if (n !== r)
            return n === "Array" ? 1 : r === "Array" ? -1 : n === "binary" ? 1 : r === "binary" ? -1 : n === "string" ? 1 : r === "string" ? -1 : n === "Date" ? 1 : r !== "Date" ? NaN : -1;
          switch (n) {
            case "number":
            case "Date":
            case "string":
              return e > t ? 1 : e < t ? -1 : 0;
            case "binary":
              return bi(mr(e), mr(t));
            case "Array":
              return wi(e, t);
          }
        } catch {
        }
        return NaN;
      }
      function wi(e, t) {
        for (var n = e.length, r = t.length, i = n < r ? n : r, a = 0; a < i; ++a) {
          var o = j(e[a], t[a]);
          if (o !== 0)
            return o;
        }
        return n === r ? 0 : n < r ? -1 : 1;
      }
      function bi(e, t) {
        for (var n = e.length, r = t.length, i = n < r ? n : r, a = 0; a < i; ++a)
          if (e[a] !== t[a])
            return e[a] < t[a] ? -1 : 1;
        return n === r ? 0 : n < r ? -1 : 1;
      }
      function yr(e) {
        var t = typeof e;
        if (t !== "object")
          return t;
        if (ArrayBuffer.isView(e))
          return "binary";
        var n = tn(e);
        return n === "ArrayBuffer" ? "binary" : n;
      }
      function mr(e) {
        return e instanceof Uint8Array ? e : ArrayBuffer.isView(e) ? new Uint8Array(e.buffer, e.byteOffset, e.byteLength) : new Uint8Array(e);
      }
      function Bt(e, t, n) {
        var r = e.schema.yProps;
        return r ? (t && n.numFailures > 0 && (t = t.filter(function(i, a) {
          return !n.failures[a];
        })), Promise.all(r.map(function(i) {
          var a = i.updatesTable;
          return t ? e.db.table(a).where("k").anyOf(t).delete() : e.db.table(a).clear();
        })).then(function() {
          return n;
        })) : n;
      }
      var lt = (function() {
        function e(t) {
          this["@@propmod"] = t;
        }
        return e.prototype.execute = function(t) {
          var n, r = this["@@propmod"];
          if (r.add !== void 0) {
            var i = r.add;
            if (V(i))
              return ee(ee([], V(t) ? t : [], !0), i).sort();
            if (typeof i == "number")
              return (Number(t) || 0) + i;
            if (typeof i == "bigint")
              try {
                return BigInt(t) + i;
              } catch {
                return BigInt(0) + i;
              }
            throw new TypeError("Invalid term ".concat(i));
          }
          if (r.remove !== void 0) {
            var a = r.remove;
            if (V(a))
              return V(t) ? t.filter(function(u) {
                return !a.includes(u);
              }).sort() : [];
            if (typeof a == "number")
              return Number(t) - a;
            if (typeof a == "bigint")
              try {
                return BigInt(t) - a;
              } catch {
                return BigInt(0) - a;
              }
            throw new TypeError("Invalid subtrahend ".concat(a));
          }
          var o = (n = r.replacePrefix) === null || n === void 0 ? void 0 : n[0];
          return o && typeof t == "string" && t.startsWith(o) ? r.replacePrefix[1] + t.substring(o.length) : t;
        }, e;
      })();
      function gr(e, t) {
        for (var n = Y(t), r = n.length, i = !1, a = 0; a < r; ++a) {
          var o = n[a], u = t[o], s = be(e, o);
          u instanceof lt ? (ue(e, o, u.execute(s)), i = !0) : s !== u && (ue(e, o, u), i = !0);
        }
        return i;
      }
      var wr = (function() {
        function e() {
        }
        return e.prototype._trans = function(t, n, r) {
          var i = this._tx || C.trans, a = this.name, o = ye && typeof console < "u" && console.createTask && console.createTask("Dexie: ".concat(t === "readonly" ? "read" : "write", " ").concat(this.name));
          function u(l, d, p) {
            if (!p.schema[a])
              throw new D.NotFound("Table " + a + " not part of transaction");
            return n(p.idbtrans, p);
          }
          var s = Xe();
          try {
            var c = i && i.db._novip === this.db._novip ? i === C.trans ? i._promise(t, u, r) : ke(function() {
              return i._promise(t, u, r);
            }, { trans: i, transless: C.transless || C }) : mn(this.db, t, [this.name], u);
            return o && (c._consoleTask = o, c = c.catch(function(l) {
              return console.trace(l), H(l);
            })), c;
          } finally {
            s && Je();
          }
        }, e.prototype.get = function(t, n) {
          var r = this;
          return t && t.constructor === Object ? this.where(t).first(n) : t == null ? H(new D.Type("Invalid argument to Table.get()")) : this._trans("readonly", function(i) {
            return r.core.get({ trans: i, key: t }).then(function(a) {
              return r.hook.reading.fire(a);
            });
          }).then(n);
        }, e.prototype.where = function(t) {
          if (typeof t == "string")
            return new this.db.WhereClause(this, t);
          if (V(t))
            return new this.db.WhereClause(this, "[".concat(t.join("+"), "]"));
          var n = Y(t);
          if (n.length === 1)
            return this.where(n[0]).equals(t[n[0]]);
          var r = this.schema.indexes.concat(this.schema.primKey).filter(function(l) {
            if (l.compound && n.every(function(p) {
              return l.keyPath.indexOf(p) >= 0;
            })) {
              for (var d = 0; d < n.length; ++d)
                if (n.indexOf(l.keyPath[d]) === -1)
                  return !1;
              return !0;
            }
            return !1;
          }).sort(function(l, d) {
            return l.keyPath.length - d.keyPath.length;
          })[0];
          if (r && this.db._maxKey !== Le) {
            var i = r.keyPath.slice(0, n.length);
            return this.where(i).equals(i.map(function(l) {
              return t[l];
            }));
          }
          !r && ye && console.warn("The query ".concat(JSON.stringify(t), " on ").concat(this.name, " would benefit from a ") + "compound index [".concat(n.join("+"), "]"));
          var a = this.schema.idxByName;
          function o(l, d) {
            return j(l, d) === 0;
          }
          var u = n.reduce(function(l, d) {
            var p = l[0], w = l[1], f = a[d], h = t[d];
            return [
              p || f,
              p || !f ? We(w, f && f.multi ? function(y) {
                var v = be(y, d);
                return V(v) && v.some(function(_) {
                  return o(h, _);
                });
              } : function(y) {
                return o(h, be(y, d));
              }) : w
            ];
          }, [null, null]), s = u[0], c = u[1];
          return s ? this.where(s.name).equals(t[s.keyPath]).filter(c) : r ? this.filter(c) : this.where(n).equals("");
        }, e.prototype.filter = function(t) {
          return this.toCollection().and(t);
        }, e.prototype.count = function(t) {
          return this.toCollection().count(t);
        }, e.prototype.offset = function(t) {
          return this.toCollection().offset(t);
        }, e.prototype.limit = function(t) {
          return this.toCollection().limit(t);
        }, e.prototype.each = function(t) {
          return this.toCollection().each(t);
        }, e.prototype.toArray = function(t) {
          return this.toCollection().toArray(t);
        }, e.prototype.toCollection = function() {
          return new this.db.Collection(new this.db.WhereClause(this));
        }, e.prototype.orderBy = function(t) {
          return new this.db.Collection(new this.db.WhereClause(this, V(t) ? "[".concat(t.join("+"), "]") : t));
        }, e.prototype.reverse = function() {
          return this.toCollection().reverse();
        }, e.prototype.mapToClass = function(t) {
          var n = this, r = n.db, i = n.name;
          this.schema.mappedClass = t, t.prototype instanceof vr && (t = (function(s) {
            me(c, s);
            function c() {
              return s !== null && s.apply(this, arguments) || this;
            }
            return Object.defineProperty(c.prototype, "db", {
              get: function() {
                return r;
              },
              enumerable: !1,
              configurable: !0
            }), c.prototype.table = function() {
              return i;
            }, c;
          })(t));
          for (var a = /* @__PURE__ */ new Set(), o = t.prototype; o; o = ge(o))
            Object.getOwnPropertyNames(o).forEach(function(s) {
              return a.add(s);
            });
          var u = function(s) {
            if (!s)
              return s;
            var c = Object.create(t.prototype);
            for (var l in s)
              if (!a.has(l))
                try {
                  c[l] = s[l];
                } catch {
                }
            return c;
          };
          return this.schema.readHook && this.hook.reading.unsubscribe(this.schema.readHook), this.schema.readHook = u, this.hook("reading", u), t;
        }, e.prototype.defineClass = function() {
          function t(n) {
            te(this, n);
          }
          return this.mapToClass(t);
        }, e.prototype.add = function(t, n) {
          var r = this, i = this.schema.primKey, a = i.auto, o = i.keyPath, u = t;
          return o && a && (u = Rt(o)(t)), this._trans("readwrite", function(s) {
            return r.core.mutate({
              trans: s,
              type: "add",
              keys: n != null ? [n] : null,
              values: [u]
            });
          }).then(function(s) {
            return s.numFailures ? k.reject(s.failures[0]) : s.lastResult;
          }).then(function(s) {
            if (o)
              try {
                ue(t, o, s);
              } catch {
              }
            return s;
          });
        }, e.prototype.upsert = function(t, n) {
          var r = this, i = this.schema.primKey.keyPath;
          return this._trans("readwrite", function(a) {
            return r.core.get({ trans: a, key: t }).then(function(o) {
              var u = o ?? {};
              return gr(u, n), i && ue(u, i, t), r.core.mutate({
                trans: a,
                type: "put",
                values: [u],
                keys: [t],
                upsert: !0,
                updates: { keys: [t], changeSpecs: [n] }
              }).then(function(s) {
                return s.numFailures ? k.reject(s.failures[0]) : !!o;
              });
            });
          });
        }, e.prototype.update = function(t, n) {
          if (typeof t == "object" && !V(t)) {
            var r = be(t, this.schema.primKey.keyPath);
            return r === void 0 ? H(new D.InvalidArgument("Given object does not contain its primary key")) : this.where(":id").equals(r).modify(n);
          } else
            return this.where(":id").equals(t).modify(n);
        }, e.prototype.put = function(t, n) {
          var r = this, i = this.schema.primKey, a = i.auto, o = i.keyPath, u = t;
          return o && a && (u = Rt(o)(t)), this._trans("readwrite", function(s) {
            return r.core.mutate({
              trans: s,
              type: "put",
              values: [u],
              keys: n != null ? [n] : null
            });
          }).then(function(s) {
            return s.numFailures ? k.reject(s.failures[0]) : s.lastResult;
          }).then(function(s) {
            if (o)
              try {
                ue(t, o, s);
              } catch {
              }
            return s;
          });
        }, e.prototype.delete = function(t) {
          var n = this;
          return this._trans("readwrite", function(r) {
            return n.core.mutate({ trans: r, type: "delete", keys: [t] }).then(function(i) {
              return Bt(n, [t], i);
            }).then(function(i) {
              return i.numFailures ? k.reject(i.failures[0]) : void 0;
            });
          });
        }, e.prototype.clear = function() {
          var t = this;
          return this._trans("readwrite", function(n) {
            return t.core.mutate({ trans: n, type: "deleteRange", range: pr }).then(function(r) {
              return Bt(t, null, r);
            });
          }).then(function(n) {
            return n.numFailures ? k.reject(n.failures[0]) : void 0;
          });
        }, e.prototype.bulkGet = function(t) {
          var n = this;
          return this._trans("readonly", function(r) {
            return n.core.getMany({
              keys: t,
              trans: r
            }).then(function(i) {
              return i.map(function(a) {
                return n.hook.reading.fire(a);
              });
            });
          });
        }, e.prototype.bulkAdd = function(t, n, r) {
          var i = this, a = Array.isArray(n) ? n : void 0;
          r = r || (a ? void 0 : n);
          var o = r ? r.allKeys : void 0;
          return this._trans("readwrite", function(u) {
            var s = i.schema.primKey, c = s.auto, l = s.keyPath;
            if (l && a)
              throw new D.InvalidArgument("bulkAdd(): keys argument invalid on tables with inbound keys");
            if (a && a.length !== t.length)
              throw new D.InvalidArgument("Arguments objects and keys must have the same length");
            var d = t.length, p = l && c ? t.map(Rt(l)) : t;
            return i.core.mutate({
              trans: u,
              type: "add",
              keys: a,
              values: p,
              wantResults: o
            }).then(function(w) {
              var f = w.numFailures, h = w.results, y = w.lastResult, v = w.failures, _ = o ? h : y;
              if (f === 0)
                return _;
              throw new Qe("".concat(i.name, ".bulkAdd(): ").concat(f, " of ").concat(d, " operations failed"), v);
            });
          });
        }, e.prototype.bulkPut = function(t, n, r) {
          var i = this, a = Array.isArray(n) ? n : void 0;
          r = r || (a ? void 0 : n);
          var o = r ? r.allKeys : void 0;
          return this._trans("readwrite", function(u) {
            var s = i.schema.primKey, c = s.auto, l = s.keyPath;
            if (l && a)
              throw new D.InvalidArgument("bulkPut(): keys argument invalid on tables with inbound keys");
            if (a && a.length !== t.length)
              throw new D.InvalidArgument("Arguments objects and keys must have the same length");
            var d = t.length, p = l && c ? t.map(Rt(l)) : t;
            return i.core.mutate({
              trans: u,
              type: "put",
              keys: a,
              values: p,
              wantResults: o
            }).then(function(w) {
              var f = w.numFailures, h = w.results, y = w.lastResult, v = w.failures, _ = o ? h : y;
              if (f === 0)
                return _;
              throw new Qe("".concat(i.name, ".bulkPut(): ").concat(f, " of ").concat(d, " operations failed"), v);
            });
          });
        }, e.prototype.bulkUpdate = function(t) {
          var n = this, r = t.map(function(o) {
            return o.key;
          }), i = t.map(function(o) {
            return o.changes;
          }), a = [];
          return this._trans("readwrite", function(o) {
            var u = n.core;
            return u.getMany({ trans: o, keys: r, cache: "clone" }).then(function(s) {
              var c = u.schema.primaryKey, l = c.outbound, d = c.extractKey, p = [], w = [];
              t.forEach(function(h, y) {
                var v = h.key, _ = h.changes, b = s[y];
                if (b) {
                  for (var m = 0, g = Object.keys(_); m < g.length; m++) {
                    var S = g[m];
                    ue(b, S, _[S]);
                  }
                  if (!l && j(d(b), v) !== 0)
                    throw new D.Constraint("Cannot update primary key in bulkUpdate()");
                  a.push(y), p.push(v), w.push(b);
                }
              });
              var f = p.length;
              return u.mutate({
                trans: o,
                type: "put",
                keys: p,
                values: w,
                updates: {
                  keys: r,
                  changeSpecs: i
                }
              }).then(function(h) {
                var y = h.numFailures, v = h.failures;
                if (y === 0)
                  return f;
                for (var _ = 0, b = Object.keys(v); _ < b.length; _++) {
                  var m = b[_], g = a[Number(m)];
                  if (g != null) {
                    var S = v[m];
                    delete v[m], v[g] = S;
                  }
                }
                throw new Qe("".concat(n.name, ".bulkUpdate(): ").concat(y, " of ").concat(f, " operations failed"), v);
              });
            });
          });
        }, e.prototype.bulkDelete = function(t) {
          var n = this, r = t.length;
          return this._trans("readwrite", function(i) {
            return n.core.mutate({ trans: i, type: "delete", keys: t }).then(function(a) {
              return Bt(n, t, a);
            });
          }).then(function(i) {
            var a = i.numFailures, o = i.lastResult, u = i.failures;
            if (a === 0)
              return o;
            throw new Qe("".concat(n.name, ".bulkDelete(): ").concat(a, " of ").concat(r, " operations failed"), u);
          });
        }, e;
      })();
      function ft(e) {
        var t = {}, n = function(u, s) {
          if (s) {
            for (var c = arguments.length, l = new Array(c - 1); --c; )
              l[c - 1] = arguments[c];
            return t[u].subscribe.apply(null, l), e;
          } else if (typeof u == "string")
            return t[u];
        };
        n.addEventType = a;
        for (var r = 1, i = arguments.length; r < i; ++r)
          a(arguments[r]);
        return n;
        function a(u, s, c) {
          if (typeof u == "object")
            return o(u);
          s || (s = oi), c || (c = W);
          var l = {
            subscribers: [],
            fire: c,
            subscribe: function(d) {
              l.subscribers.indexOf(d) === -1 && (l.subscribers.push(d), l.fire = s(l.fire, d));
            },
            unsubscribe: function(d) {
              l.subscribers = l.subscribers.filter(function(p) {
                return p !== d;
              }), l.fire = l.subscribers.reduce(s, c);
            }
          };
          return t[u] = n[u] = l, l;
        }
        function o(u) {
          Y(u).forEach(function(s) {
            var c = u[s];
            if (V(c))
              a(s, u[s][0], u[s][1]);
            else if (c === "asap")
              var l = a(s, ot, function() {
                for (var p = arguments.length, w = new Array(p); p--; )
                  w[p] = arguments[p];
                l.subscribers.forEach(function(f) {
                  Hn(function() {
                    f.apply(null, w);
                  });
                });
              });
            else
              throw new D.InvalidArgument("Invalid event config");
          });
        }
      }
      function ht(e, t) {
        return M(t).from({ prototype: e }), t;
      }
      function _i(e) {
        return ht(wr.prototype, function(n, r, i) {
          this.db = e, this._tx = i, this.name = n, this.schema = r, this.hook = e._allTables[n] ? e._allTables[n].hook : ft(null, {
            creating: [ri, W],
            reading: [ni, ot],
            updating: [ai, W],
            deleting: [ii, W]
          });
        });
      }
      function qe(e, t) {
        return !(e.filter || e.algorithm || e.or) && (t ? e.justLimit : !e.replayFilter);
      }
      function _n(e, t) {
        e.filter = We(e.filter, t);
      }
      function xn(e, t, n) {
        var r = e.replayFilter;
        e.replayFilter = r ? function() {
          return We(r(), t());
        } : t, e.justLimit = n && !r;
      }
      function xi(e, t) {
        e.isMatch = We(e.isMatch, t);
      }
      function Mt(e, t) {
        if (e.isPrimKey)
          return t.primaryKey;
        var n = t.getIndexByKeyPath(e.index);
        if (!n)
          throw new D.Schema("KeyPath " + e.index + " on object store " + t.name + " is not indexed");
        return n;
      }
      function br(e, t, n) {
        var r = Mt(e, t.schema);
        return t.openCursor({
          trans: n,
          values: !e.keysOnly,
          reverse: e.dir === "prev",
          unique: !!e.unique,
          query: {
            index: r,
            range: e.range
          }
        });
      }
      function Ft(e, t, n, r) {
        var i = e.replayFilter ? We(e.filter, e.replayFilter()) : e.filter;
        if (e.or) {
          var a = {}, o = function(u, s, c) {
            if (!i || i(s, c, function(p) {
              return s.stop(p);
            }, function(p) {
              return s.fail(p);
            })) {
              var l = s.primaryKey, d = "" + l;
              d === "[object ArrayBuffer]" && (d = "" + new Uint8Array(l)), ne(a, d) || (a[d] = !0, t(u, s, c));
            }
          };
          return Promise.all([
            e.or._iterate(o, n),
            _r(br(e, r, n), e.algorithm, o, !e.keysOnly && e.valueMapper)
          ]);
        } else
          return _r(br(e, r, n), We(e.algorithm, i), t, !e.keysOnly && e.valueMapper);
      }
      function _r(e, t, n, r) {
        var i = r ? function(o, u, s) {
          return n(r(o), u, s);
        } : n, a = $(i);
        return e.then(function(o) {
          if (o)
            return o.start(function() {
              var u = function() {
                return o.continue();
              };
              (!t || t(o, function(s) {
                return u = s;
              }, function(s) {
                o.stop(s), u = W;
              }, function(s) {
                o.fail(s), u = W;
              })) && a(o.value, o, function(s) {
                return u = s;
              }), u();
            });
        });
      }
      var Ei = (function() {
        function e() {
        }
        return e.prototype._read = function(t, n) {
          var r = this._ctx;
          return r.error ? r.table._trans(null, H.bind(null, r.error)) : r.table._trans("readonly", t).then(n);
        }, e.prototype._write = function(t) {
          var n = this._ctx;
          return n.error ? n.table._trans(null, H.bind(null, n.error)) : n.table._trans("readwrite", t, "locked");
        }, e.prototype._addAlgorithm = function(t) {
          var n = this._ctx;
          n.algorithm = We(n.algorithm, t);
        }, e.prototype._iterate = function(t, n) {
          return Ft(this._ctx, t, n, this._ctx.table.core);
        }, e.prototype.clone = function(t) {
          var n = Object.create(this.constructor.prototype), r = Object.create(this._ctx);
          return t && te(r, t), n._ctx = r, n;
        }, e.prototype.raw = function() {
          return this._ctx.valueMapper = null, this;
        }, e.prototype.each = function(t) {
          var n = this._ctx;
          return this._read(function(r) {
            return Ft(n, t, r, n.table.core);
          });
        }, e.prototype.count = function(t) {
          var n = this;
          return this._read(function(r) {
            var i = n._ctx, a = i.table.core;
            if (qe(i, !0))
              return a.count({
                trans: r,
                query: {
                  index: Mt(i, a.schema),
                  range: i.range
                }
              }).then(function(u) {
                return Math.min(u, i.limit);
              });
            var o = 0;
            return Ft(i, function() {
              return ++o, !1;
            }, r, a).then(function() {
              return o;
            });
          }).then(t);
        }, e.prototype.sortBy = function(t, n) {
          var r = t.split(".").reverse(), i = r[0], a = r.length - 1;
          function o(c, l) {
            return l ? o(c[r[l]], l - 1) : c[i];
          }
          var u = this._ctx.dir === "next" ? 1 : -1;
          function s(c, l) {
            var d = o(c, a), p = o(l, a);
            return j(d, p) * u;
          }
          return this.toArray(function(c) {
            return c.slice().sort(s);
          }).then(n);
        }, e.prototype.toArray = function(t) {
          var n = this;
          return this._read(function(r) {
            var i = n._ctx;
            if (qe(i, !0) && i.limit > 0) {
              var a = i.valueMapper, o = Mt(i, i.table.core.schema);
              return i.table.core.query({
                trans: r,
                limit: i.limit,
                values: !0,
                direction: i.dir === "prev" ? "prev" : void 0,
                query: {
                  index: o,
                  range: i.range
                }
              }).then(function(s) {
                var c = s.result;
                return a ? c.map(a) : c;
              });
            } else {
              var u = [];
              return Ft(i, function(s) {
                return u.push(s);
              }, r, i.table.core).then(function() {
                return u;
              });
            }
          }, t);
        }, e.prototype.offset = function(t) {
          var n = this._ctx;
          return t <= 0 ? this : (n.offset += t, qe(n) ? xn(n, function() {
            var r = t;
            return function(i, a) {
              return r === 0 ? !0 : r === 1 ? (--r, !1) : (a(function() {
                i.advance(r), r = 0;
              }), !1);
            };
          }) : xn(n, function() {
            var r = t;
            return function() {
              return --r < 0;
            };
          }), this);
        }, e.prototype.limit = function(t) {
          return this._ctx.limit = Math.min(this._ctx.limit, t), xn(this._ctx, function() {
            var n = t;
            return function(r, i, a) {
              return --n <= 0 && i(a), n >= 0;
            };
          }, !0), this;
        }, e.prototype.until = function(t, n) {
          return _n(this._ctx, function(r, i, a) {
            return t(r.value) ? (i(a), n) : !0;
          }), this;
        }, e.prototype.first = function(t) {
          return this.limit(1).toArray(function(n) {
            return n[0];
          }).then(t);
        }, e.prototype.last = function(t) {
          return this.reverse().first(t);
        }, e.prototype.filter = function(t) {
          return _n(this._ctx, function(n) {
            return t(n.value);
          }), xi(this._ctx, t), this;
        }, e.prototype.and = function(t) {
          return this.filter(t);
        }, e.prototype.or = function(t) {
          return new this.db.WhereClause(this._ctx.table, t, this);
        }, e.prototype.reverse = function() {
          return this._ctx.dir = this._ctx.dir === "prev" ? "next" : "prev", this._ondirectionchange && this._ondirectionchange(this._ctx.dir), this;
        }, e.prototype.desc = function() {
          return this.reverse();
        }, e.prototype.eachKey = function(t) {
          var n = this._ctx;
          return n.keysOnly = !n.isMatch, this.each(function(r, i) {
            t(i.key, i);
          });
        }, e.prototype.eachUniqueKey = function(t) {
          return this._ctx.unique = "unique", this.eachKey(t);
        }, e.prototype.eachPrimaryKey = function(t) {
          var n = this._ctx;
          return n.keysOnly = !n.isMatch, this.each(function(r, i) {
            t(i.primaryKey, i);
          });
        }, e.prototype.keys = function(t) {
          var n = this._ctx;
          n.keysOnly = !n.isMatch;
          var r = [];
          return this.each(function(i, a) {
            r.push(a.key);
          }).then(function() {
            return r;
          }).then(t);
        }, e.prototype.primaryKeys = function(t) {
          var n = this._ctx;
          if (qe(n, !0) && n.limit > 0)
            return this._read(function(i) {
              var a = Mt(n, n.table.core.schema);
              return n.table.core.query({
                trans: i,
                values: !1,
                limit: n.limit,
                direction: n.dir === "prev" ? "prev" : void 0,
                query: {
                  index: a,
                  range: n.range
                }
              });
            }).then(function(i) {
              var a = i.result;
              return a;
            }).then(t);
          n.keysOnly = !n.isMatch;
          var r = [];
          return this.each(function(i, a) {
            r.push(a.primaryKey);
          }).then(function() {
            return r;
          }).then(t);
        }, e.prototype.uniqueKeys = function(t) {
          return this._ctx.unique = "unique", this.keys(t);
        }, e.prototype.firstKey = function(t) {
          return this.limit(1).keys(function(n) {
            return n[0];
          }).then(t);
        }, e.prototype.lastKey = function(t) {
          return this.reverse().firstKey(t);
        }, e.prototype.distinct = function() {
          var t = this._ctx, n = t.index && t.table.schema.idxByName[t.index];
          if (!n || !n.multi)
            return this;
          var r = {};
          return _n(this._ctx, function(i) {
            var a = i.primaryKey.toString(), o = ne(r, a);
            return r[a] = !0, !o;
          }), this;
        }, e.prototype.modify = function(t) {
          var n = this, r = this._ctx;
          return this._write(function(i) {
            var a;
            typeof t == "function" ? a = t : a = function(v) {
              return gr(v, t);
            };
            var o = r.table.core, u = o.schema.primaryKey, s = u.outbound, c = u.extractKey, l = 200, d = n.db._options.modifyChunkSize;
            d && (typeof d == "object" ? l = d[o.name] || d["*"] || 200 : l = d);
            var p = [], w = 0, f = [], h = function(v, _) {
              var b = _.failures, m = _.numFailures;
              w += v - m;
              for (var g = 0, S = Y(b); g < S.length; g++) {
                var x = S[g];
                p.push(b[x]);
              }
            }, y = t === xr;
            return n.clone().primaryKeys().then(function(v) {
              var _ = qe(r) && r.limit === 1 / 0 && (typeof t != "function" || y) && {
                index: r.index,
                range: r.range
              }, b = function(m) {
                var g = Math.min(l, v.length - m), S = v.slice(m, m + g);
                return (y ? Promise.resolve([]) : o.getMany({
                  trans: i,
                  keys: S,
                  cache: "immutable"
                })).then(function(x) {
                  var E = [], A = [], F = s ? [] : null, I = y ? S : [];
                  if (!y)
                    for (var T = 0; T < g; ++T) {
                      var R = x[T], B = {
                        value: Pe(R),
                        primKey: v[m + T]
                      };
                      a.call(B, B.value, B) !== !1 && (B.value == null ? I.push(v[m + T]) : !s && j(c(R), c(B.value)) !== 0 ? (I.push(v[m + T]), E.push(B.value)) : (A.push(B.value), s && F.push(v[m + T])));
                    }
                  return Promise.resolve(E.length > 0 && o.mutate({ trans: i, type: "add", values: E }).then(function(U) {
                    for (var K in U.failures)
                      I.splice(parseInt(K), 1);
                    h(E.length, U);
                  })).then(function() {
                    return (A.length > 0 || _ && typeof t == "object") && o.mutate({
                      trans: i,
                      type: "put",
                      keys: F,
                      values: A,
                      criteria: _,
                      changeSpec: typeof t != "function" && t,
                      isAdditionalChunk: m > 0
                    }).then(function(U) {
                      return h(A.length, U);
                    });
                  }).then(function() {
                    return (I.length > 0 || _ && y) && o.mutate({
                      trans: i,
                      type: "delete",
                      keys: I,
                      criteria: _,
                      isAdditionalChunk: m > 0
                    }).then(function(U) {
                      return Bt(r.table, I, U);
                    }).then(function(U) {
                      return h(I.length, U);
                    });
                  }).then(function() {
                    return v.length > m + g && b(m + l);
                  });
                });
              };
              return b(0).then(function() {
                if (p.length > 0)
                  throw new Et("Error modifying one or more objects", p, w, f);
                return v.length;
              });
            });
          });
        }, e.prototype.delete = function() {
          var t = this._ctx, n = t.range;
          return qe(t) && !t.table.schema.yProps && (t.isPrimKey || n.type === 3) ? this._write(function(r) {
            var i = t.table.core.schema.primaryKey, a = n;
            return t.table.core.count({ trans: r, query: { index: i, range: a } }).then(function(o) {
              return t.table.core.mutate({ trans: r, type: "deleteRange", range: a }).then(function(u) {
                var s = u.failures, c = u.numFailures;
                if (c)
                  throw new Et("Could not delete some values", Object.keys(s).map(function(l) {
                    return s[l];
                  }), o - c);
                return o - c;
              });
            });
          }) : this.modify(xr);
        }, e;
      })(), xr = function(e, t) {
        return t.value = null;
      };
      function Si(e) {
        return ht(Ei.prototype, function(n, r) {
          this.db = e;
          var i = pr, a = null;
          if (r)
            try {
              i = r();
            } catch (c) {
              a = c;
            }
          var o = n._ctx, u = o.table, s = u.hook.reading.fire;
          this._ctx = {
            table: u,
            index: o.index,
            isPrimKey: !o.index || u.schema.primKey.keyPath && o.index === u.schema.primKey.name,
            range: i,
            keysOnly: !1,
            dir: "next",
            unique: "",
            algorithm: null,
            filter: null,
            replayFilter: null,
            justLimit: !0,
            isMatch: null,
            offset: 0,
            limit: 1 / 0,
            error: a,
            or: o.or,
            valueMapper: s !== ot ? s : null
          };
        });
      }
      function ki(e, t) {
        return e < t ? -1 : e === t ? 0 : 1;
      }
      function Ai(e, t) {
        return e > t ? -1 : e === t ? 0 : 1;
      }
      function se(e, t, n) {
        var r = e instanceof Sr ? new e.Collection(e) : e;
        return r._ctx.error = n ? new n(t) : new TypeError(t), r;
      }
      function et(e) {
        var t = new e.Collection(e, function() {
          return Er("");
        });
        return t._addAlgorithm(function() {
          return !1;
        }), t;
      }
      function Ti(e) {
        return e === "next" ? function(t) {
          return t.toUpperCase();
        } : function(t) {
          return t.toLowerCase();
        };
      }
      function Ci(e) {
        return e === "next" ? function(t) {
          return t.toLowerCase();
        } : function(t) {
          return t.toUpperCase();
        };
      }
      function Ii(e, t, n, r, i, a) {
        for (var o = Math.min(e.length, r.length), u = -1, s = 0; s < o; ++s) {
          var c = t[s];
          if (c !== r[s])
            return i(e[s], n[s]) < 0 ? e.substr(0, s) + n[s] + n.substr(s + 1) : i(e[s], r[s]) < 0 ? e.substr(0, s) + r[s] + n.substr(s + 1) : u >= 0 ? e.substr(0, u) + t[u] + n.substr(u + 1) : null;
          i(e[s], c) < 0 && (u = s);
        }
        return o < r.length && a === "next" ? e + n.substr(e.length) : o < e.length && a === "prev" ? e.substr(0, n.length) : u < 0 ? null : e.substr(0, u) + r[u] + n.substr(u + 1);
      }
      function jt(e, t, n, r) {
        var i, a, o, u, s, c, l, d = n.length;
        if (!n.every(function(h) {
          return typeof h == "string";
        }))
          return se(e, hr);
        function p(h) {
          i = Ti(h), a = Ci(h), o = h === "next" ? ki : Ai;
          var y = n.map(function(v) {
            return { lower: a(v), upper: i(v) };
          }).sort(function(v, _) {
            return o(v.lower, _.lower);
          });
          u = y.map(function(v) {
            return v.upper;
          }), s = y.map(function(v) {
            return v.lower;
          }), c = h, l = h === "next" ? "" : r;
        }
        p("next");
        var w = new e.Collection(e, function() {
          return Ce(u[0], s[d - 1] + r);
        });
        w._ondirectionchange = function(h) {
          p(h);
        };
        var f = 0;
        return w._addAlgorithm(function(h, y, v) {
          var _ = h.key;
          if (typeof _ != "string")
            return !1;
          var b = a(_);
          if (t(b, s, f))
            return !0;
          for (var m = null, g = f; g < d; ++g) {
            var S = Ii(_, b, u[g], s[g], o, c);
            S === null && m === null ? f = g + 1 : (m === null || o(m, S) > 0) && (m = S);
          }
          return y(m !== null ? function() {
            h.continue(m + l);
          } : v), !1;
        }), w;
      }
      function Ce(e, t, n, r) {
        return {
          type: 2,
          lower: e,
          upper: t,
          lowerOpen: n,
          upperOpen: r
        };
      }
      function Er(e) {
        return {
          type: 1,
          lower: e,
          upper: e
        };
      }
      var Sr = (function() {
        function e() {
        }
        return Object.defineProperty(e.prototype, "Collection", {
          get: function() {
            return this._ctx.table.db.Collection;
          },
          enumerable: !1,
          configurable: !0
        }), e.prototype.between = function(t, n, r, i) {
          r = r !== !1, i = i === !0;
          try {
            return this._cmp(t, n) > 0 || this._cmp(t, n) === 0 && (r || i) && !(r && i) ? et(this) : new this.Collection(this, function() {
              return Ce(t, n, !r, !i);
            });
          } catch {
            return se(this, Ee);
          }
        }, e.prototype.equals = function(t) {
          return t == null ? se(this, Ee) : new this.Collection(this, function() {
            return Er(t);
          });
        }, e.prototype.above = function(t) {
          return t == null ? se(this, Ee) : new this.Collection(this, function() {
            return Ce(t, void 0, !0);
          });
        }, e.prototype.aboveOrEqual = function(t) {
          return t == null ? se(this, Ee) : new this.Collection(this, function() {
            return Ce(t, void 0, !1);
          });
        }, e.prototype.below = function(t) {
          return t == null ? se(this, Ee) : new this.Collection(this, function() {
            return Ce(void 0, t, !1, !0);
          });
        }, e.prototype.belowOrEqual = function(t) {
          return t == null ? se(this, Ee) : new this.Collection(this, function() {
            return Ce(void 0, t);
          });
        }, e.prototype.startsWith = function(t) {
          return typeof t != "string" ? se(this, hr) : this.between(t, t + Le, !0, !0);
        }, e.prototype.startsWithIgnoreCase = function(t) {
          return t === "" ? this.startsWith(t) : jt(this, function(n, r) {
            return n.indexOf(r[0]) === 0;
          }, [t], Le);
        }, e.prototype.equalsIgnoreCase = function(t) {
          return jt(this, function(n, r) {
            return n === r[0];
          }, [t], "");
        }, e.prototype.anyOfIgnoreCase = function() {
          var t = _e.apply(Ye, arguments);
          return t.length === 0 ? et(this) : jt(this, function(n, r) {
            return r.indexOf(n) !== -1;
          }, t, "");
        }, e.prototype.startsWithAnyOfIgnoreCase = function() {
          var t = _e.apply(Ye, arguments);
          return t.length === 0 ? et(this) : jt(this, function(n, r) {
            return r.some(function(i) {
              return n.indexOf(i) === 0;
            });
          }, t, Le);
        }, e.prototype.anyOf = function() {
          var t = this, n = _e.apply(Ye, arguments), r = this._cmp;
          try {
            n.sort(r);
          } catch {
            return se(this, Ee);
          }
          if (n.length === 0)
            return et(this);
          var i = new this.Collection(this, function() {
            return Ce(n[0], n[n.length - 1]);
          });
          i._ondirectionchange = function(o) {
            r = o === "next" ? t._ascending : t._descending, n.sort(r);
          };
          var a = 0;
          return i._addAlgorithm(function(o, u, s) {
            for (var c = o.key; r(c, n[a]) > 0; )
              if (++a, a === n.length)
                return u(s), !1;
            return r(c, n[a]) === 0 ? !0 : (u(function() {
              o.continue(n[a]);
            }), !1);
          }), i;
        }, e.prototype.notEqual = function(t) {
          return this.inAnyRange([
            [gn, t],
            [t, this.db._maxKey]
          ], { includeLowers: !1, includeUppers: !1 });
        }, e.prototype.noneOf = function() {
          var t = _e.apply(Ye, arguments);
          if (t.length === 0)
            return new this.Collection(this);
          try {
            t.sort(this._ascending);
          } catch {
            return se(this, Ee);
          }
          var n = t.reduce(function(r, i) {
            return r ? r.concat([[r[r.length - 1][1], i]]) : [[gn, i]];
          }, null);
          return n.push([t[t.length - 1], this.db._maxKey]), this.inAnyRange(n, {
            includeLowers: !1,
            includeUppers: !1
          });
        }, e.prototype.inAnyRange = function(t, n) {
          var r = this, i = this._cmp, a = this._ascending, o = this._descending, u = this._min, s = this._max;
          if (t.length === 0)
            return et(this);
          if (!t.every(function(g) {
            return g[0] !== void 0 && g[1] !== void 0 && a(g[0], g[1]) <= 0;
          }))
            return se(this, "First argument to inAnyRange() must be an Array of two-value Arrays [lower,upper] where upper must not be lower than lower", D.InvalidArgument);
          var c = !n || n.includeLowers !== !1, l = n && n.includeUppers === !0;
          function d(g, S) {
            for (var x = 0, E = g.length; x < E; ++x) {
              var A = g[x];
              if (i(S[0], A[1]) < 0 && i(S[1], A[0]) > 0) {
                A[0] = u(A[0], S[0]), A[1] = s(A[1], S[1]);
                break;
              }
            }
            return x === E && g.push(S), g;
          }
          var p = a;
          function w(g, S) {
            return p(g[0], S[0]);
          }
          var f;
          try {
            f = t.reduce(d, []), f.sort(w);
          } catch {
            return se(this, Ee);
          }
          var h = 0, y = l ? function(g) {
            return a(g, f[h][1]) > 0;
          } : function(g) {
            return a(g, f[h][1]) >= 0;
          }, v = c ? function(g) {
            return o(g, f[h][0]) > 0;
          } : function(g) {
            return o(g, f[h][0]) >= 0;
          };
          function _(g) {
            return !y(g) && !v(g);
          }
          var b = y, m = new this.Collection(this, function() {
            return Ce(f[0][0], f[f.length - 1][1], !c, !l);
          });
          return m._ondirectionchange = function(g) {
            g === "next" ? (b = y, p = a) : (b = v, p = o), f.sort(w);
          }, m._addAlgorithm(function(g, S, x) {
            for (var E = g.key; b(E); )
              if (++h, h === f.length)
                return S(x), !1;
            return _(E) ? !0 : (r._cmp(E, f[h][1]) === 0 || r._cmp(E, f[h][0]) === 0 || S(function() {
              p === a ? g.continue(f[h][0]) : g.continue(f[h][1]);
            }), !1);
          }), m;
        }, e.prototype.startsWithAnyOf = function() {
          var t = _e.apply(Ye, arguments);
          return t.every(function(n) {
            return typeof n == "string";
          }) ? t.length === 0 ? et(this) : this.inAnyRange(t.map(function(n) {
            return [n, n + Le];
          })) : se(this, "startsWithAnyOf() only works with strings");
        }, e;
      })();
      function Ki(e) {
        return ht(Sr.prototype, function(n, r, i) {
          if (this.db = e, this._ctx = {
            table: n,
            index: r === ":id" ? null : r,
            or: i
          }, this._cmp = this._ascending = j, this._descending = function(a, o) {
            return j(o, a);
          }, this._max = function(a, o) {
            return j(a, o) > 0 ? a : o;
          }, this._min = function(a, o) {
            return j(a, o) < 0 ? a : o;
          }, this._IDBKeyRange = e._deps.IDBKeyRange, !this._IDBKeyRange)
            throw new D.MissingAPI();
        });
      }
      function de(e) {
        return $(function(t) {
          return dt(t), e(t.target.error), !1;
        });
      }
      function dt(e) {
        e.stopPropagation && e.stopPropagation(), e.preventDefault && e.preventDefault();
      }
      var Nt = "storagemutated", En = "x-storagemutated-1", Ie = ft(null, Nt), Di = (function() {
        function e() {
        }
        return e.prototype._lock = function() {
          return Oe(!C.global), ++this._reculock, this._reculock === 1 && !C.global && (C.lockOwnerFor = this), this;
        }, e.prototype._unlock = function() {
          if (Oe(!C.global), --this._reculock === 0)
            for (C.global || (C.lockOwnerFor = null); this._blockedFuncs.length > 0 && !this._locked(); ) {
              var t = this._blockedFuncs.shift();
              try {
                Ne(t[1], t[0]);
              } catch {
              }
            }
          return this;
        }, e.prototype._locked = function() {
          return this._reculock && C.lockOwnerFor !== this;
        }, e.prototype.create = function(t) {
          var n = this;
          if (!this.mode)
            return this;
          var r = this.db.idbdb, i = this.db._state.dbOpenError;
          if (Oe(!this.idbtrans), !t && !r)
            switch (i && i.name) {
              case "DatabaseClosedError":
                throw new D.DatabaseClosed(i);
              case "MissingAPIError":
                throw new D.MissingAPI(i.message, i);
              default:
                throw new D.OpenFailed(i);
            }
          if (!this.active)
            throw new D.TransactionInactive();
          return Oe(this._completion._state === null), t = this.idbtrans = t || (this.db.core ? this.db.core.transaction(this.storeNames, this.mode, { durability: this.chromeTransactionDurability }) : r.transaction(this.storeNames, this.mode, {
            durability: this.chromeTransactionDurability
          })), t.onerror = $(function(a) {
            dt(a), n._reject(t.error);
          }), t.onabort = $(function(a) {
            dt(a), n.active && n._reject(new D.Abort(t.error)), n.active = !1, n.on("abort").fire(a);
          }), t.oncomplete = $(function() {
            n.active = !1, n._resolve(), "mutatedParts" in t && Ie.storagemutated.fire(t.mutatedParts);
          }), this;
        }, e.prototype._promise = function(t, n, r) {
          var i = this;
          if (t === "readwrite" && this.mode !== "readwrite")
            return H(new D.ReadOnly("Transaction is readonly"));
          if (!this.active)
            return H(new D.TransactionInactive());
          if (this._locked())
            return new k(function(o, u) {
              i._blockedFuncs.push([
                function() {
                  i._promise(t, n, r).then(o, u);
                },
                C
              ]);
            });
          if (r)
            return ke(function() {
              var o = new k(function(u, s) {
                i._lock();
                var c = n(u, s, i);
                c && c.then && c.then(u, s);
              });
              return o.finally(function() {
                return i._unlock();
              }), o._lib = !0, o;
            });
          var a = new k(function(o, u) {
            var s = n(o, u, i);
            s && s.then && s.then(o, u);
          });
          return a._lib = !0, a;
        }, e.prototype._root = function() {
          return this.parent ? this.parent._root() : this;
        }, e.prototype.waitFor = function(t) {
          var n = this._root(), r = k.resolve(t);
          if (n._waitingFor)
            n._waitingFor = n._waitingFor.then(function() {
              return r;
            });
          else {
            n._waitingFor = r, n._waitingQueue = [];
            var i = n.idbtrans.objectStore(n.storeNames[0]);
            (function o() {
              for (++n._spinCount; n._waitingQueue.length; )
                n._waitingQueue.shift()();
              n._waitingFor && (i.get(-1 / 0).onsuccess = o);
            })();
          }
          var a = n._waitingFor;
          return new k(function(o, u) {
            r.then(function(s) {
              return n._waitingQueue.push($(o.bind(null, s)));
            }, function(s) {
              return n._waitingQueue.push($(u.bind(null, s)));
            }).finally(function() {
              n._waitingFor === a && (n._waitingFor = null);
            });
          });
        }, e.prototype.abort = function() {
          this.active && (this.active = !1, this.idbtrans && this.idbtrans.abort(), this._reject(new D.Abort()));
        }, e.prototype.table = function(t) {
          var n = this._memoizedTables || (this._memoizedTables = {});
          if (ne(n, t))
            return n[t];
          var r = this.schema[t];
          if (!r)
            throw new D.NotFound("Table " + t + " not part of transaction");
          var i = new this.db.Table(t, r, this);
          return i.core = this.db.core.table(t), n[t] = i, i;
        }, e;
      })();
      function Oi(e) {
        return ht(Di.prototype, function(n, r, i, a, o) {
          var u = this;
          n !== "readonly" && r.forEach(function(s) {
            var c, l = (c = i[s]) === null || c === void 0 ? void 0 : c.yProps;
            l && (r = r.concat(l.map(function(d) {
              return d.updatesTable;
            })));
          }), this.db = e, this.mode = n, this.storeNames = r, this.schema = i, this.chromeTransactionDurability = a, this.idbtrans = null, this.on = ft(this, "complete", "error", "abort"), this.parent = o || null, this.active = !0, this._reculock = 0, this._blockedFuncs = [], this._resolve = null, this._reject = null, this._waitingFor = null, this._waitingQueue = null, this._spinCount = 0, this._completion = new k(function(s, c) {
            u._resolve = s, u._reject = c;
          }), this._completion.then(function() {
            u.active = !1, u.on.complete.fire();
          }, function(s) {
            var c = u.active;
            return u.active = !1, u.on.error.fire(s), u.parent ? u.parent._reject(s) : c && u.idbtrans && u.idbtrans.abort(), H(s);
          });
        });
      }
      function Sn(e, t, n, r, i, a, o, u) {
        return {
          name: e,
          keyPath: t,
          unique: n,
          multi: r,
          auto: i,
          compound: a,
          src: (n && !o ? "&" : "") + (r ? "*" : "") + (i ? "++" : "") + kr(t),
          type: u
        };
      }
      function kr(e) {
        return typeof e == "string" ? e : e ? "[" + [].join.call(e, "+") + "]" : "";
      }
      function kn(e, t, n) {
        return {
          name: e,
          primKey: t,
          indexes: n,
          mappedClass: null,
          idxByName: Gr(n, function(r) {
            return [r.name, r];
          })
        };
      }
      function Pi(e) {
        return e.length === 1 ? e[0] : e;
      }
      var pt = function(e) {
        try {
          return e.only([[]]), pt = function() {
            return [[]];
          }, [[]];
        } catch {
          return pt = function() {
            return Le;
          }, Le;
        }
      };
      function An(e) {
        return e == null ? function() {
        } : typeof e == "string" ? Ri(e) : function(t) {
          return be(t, e);
        };
      }
      function Ri(e) {
        var t = e.split(".");
        return t.length === 1 ? function(n) {
          return n[e];
        } : function(n) {
          return be(n, e);
        };
      }
      function Ar(e) {
        return [].slice.call(e);
      }
      var Bi = 0;
      function vt(e) {
        return e == null ? ":id" : typeof e == "string" ? e : "[".concat(e.join("+"), "]");
      }
      function Mi(e, t, n) {
        function r(p, w) {
          var f = Ar(p.objectStoreNames), h = f.length > 0 ? w.objectStore(f[0]) : {};
          return {
            schema: {
              name: p.name,
              tables: f.map(function(y) {
                return w.objectStore(y);
              }).map(function(y) {
                var v = y.keyPath, _ = y.autoIncrement, b = V(v), m = v == null, g = {}, S = {
                  name: y.name,
                  primaryKey: {
                    name: null,
                    isPrimaryKey: !0,
                    outbound: m,
                    compound: b,
                    keyPath: v,
                    autoIncrement: _,
                    unique: !0,
                    extractKey: An(v)
                  },
                  indexes: Ar(y.indexNames).map(function(x) {
                    return y.index(x);
                  }).map(function(x) {
                    var E = x.name, A = x.unique, F = x.multiEntry, I = x.keyPath, T = V(I), R = {
                      name: E,
                      compound: T,
                      keyPath: I,
                      unique: A,
                      multiEntry: F,
                      extractKey: An(I)
                    };
                    return g[vt(I)] = R, R;
                  }),
                  getIndexByKeyPath: function(x) {
                    return g[vt(x)];
                  }
                };
                return g[":id"] = S.primaryKey, v != null && (g[vt(v)] = S.primaryKey), S;
              })
            },
            hasGetAll: f.length > 0 && "getAll" in h && !(typeof navigator < "u" && /Safari/.test(navigator.userAgent) && !/(Chrome\/|Edge\/)/.test(navigator.userAgent) && [].concat(navigator.userAgent.match(/Safari\/(\d*)/))[1] < 604),
            hasIdb3Features: "getAllRecords" in h
          };
        }
        function i(p) {
          if (p.type === 3)
            return null;
          if (p.type === 4)
            throw new Error("Cannot convert never type to IDBKeyRange");
          var w = p.lower, f = p.upper, h = p.lowerOpen, y = p.upperOpen, v = w === void 0 ? f === void 0 ? null : t.upperBound(f, !!y) : f === void 0 ? t.lowerBound(w, !!h) : t.bound(w, f, !!h, !!y);
          return v;
        }
        function a(p) {
          var w = p.name;
          function f(v) {
            var _ = v.trans, b = v.type, m = v.keys, g = v.values, S = v.range;
            return new Promise(function(x, E) {
              x = $(x);
              var A = _.objectStore(w), F = A.keyPath == null, I = b === "put" || b === "add";
              if (!I && b !== "delete" && b !== "deleteRange")
                throw new Error("Invalid operation type: " + b);
              var T = (m || g || { length: 1 }).length;
              if (m && g && m.length !== g.length)
                throw new Error("Given keys array must have same length as given values array.");
              if (T === 0)
                return x({
                  numFailures: 0,
                  failures: {},
                  results: [],
                  lastResult: void 0
                });
              var R, B = [], U = [], K = 0, X = function(Z) {
                ++K, dt(Z);
              };
              if (b === "deleteRange") {
                if (S.type === 4)
                  return x({
                    numFailures: K,
                    failures: U,
                    results: [],
                    lastResult: void 0
                  });
                S.type === 3 ? B.push(R = A.clear()) : B.push(R = A.delete(i(S)));
              } else {
                var ce = I ? F ? [g, m] : [g, null] : [m, null], oe = ce[0], ze = ce[1];
                if (I)
                  for (var ie = 0; ie < T; ++ie)
                    B.push(R = ze && ze[ie] !== void 0 ? A[b](oe[ie], ze[ie]) : A[b](oe[ie])), R.onerror = X;
                else
                  for (var ie = 0; ie < T; ++ie)
                    B.push(R = A[b](oe[ie])), R.onerror = X;
              }
              var le = function(Z) {
                var $e = Z.target.result;
                B.forEach(function(pe, Jt) {
                  return pe.error != null && (U[Jt] = pe.error);
                }), x({
                  numFailures: K,
                  failures: U,
                  results: b === "delete" ? m : B.map(function(pe) {
                    return pe.result;
                  }),
                  lastResult: $e
                });
              };
              R.onerror = function(Z) {
                X(Z), le(Z);
              }, R.onsuccess = le;
            });
          }
          function h(v) {
            var _ = v.trans, b = v.values, m = v.query, g = v.reverse, S = v.unique;
            return new Promise(function(x, E) {
              x = $(x);
              var A = m.index, F = m.range, I = _.objectStore(w), T = A.isPrimaryKey ? I : I.index(A.name), R = g ? S ? "prevunique" : "prev" : S ? "nextunique" : "next", B = b || !("openKeyCursor" in T) ? T.openCursor(i(F), R) : T.openKeyCursor(i(F), R);
              B.onerror = de(E), B.onsuccess = $(function(U) {
                var K = B.result;
                if (!K) {
                  x(null);
                  return;
                }
                K.___id = ++Bi, K.done = !1;
                var X = K.continue.bind(K), ce = K.continuePrimaryKey;
                ce && (ce = ce.bind(K));
                var oe = K.advance.bind(K), ze = function() {
                  throw new Error("Cursor not started");
                }, ie = function() {
                  throw new Error("Cursor not stopped");
                };
                K.trans = _, K.stop = K.continue = K.continuePrimaryKey = K.advance = ze, K.fail = $(E), K.next = function() {
                  var le = this, Z = 1;
                  return this.start(function() {
                    return Z-- ? le.continue() : le.stop();
                  }).then(function() {
                    return le;
                  });
                }, K.start = function(le) {
                  var Z = new Promise(function(pe, Jt) {
                    pe = $(pe), B.onerror = de(Jt), K.fail = Jt, K.stop = function(Sa) {
                      K.stop = K.continue = K.continuePrimaryKey = K.advance = ie, pe(Sa);
                    };
                  }), $e = function() {
                    if (B.result)
                      try {
                        le();
                      } catch (pe) {
                        K.fail(pe);
                      }
                    else
                      K.done = !0, K.start = function() {
                        throw new Error("Cursor behind last entry");
                      }, K.stop();
                  };
                  return B.onsuccess = $(function(pe) {
                    B.onsuccess = $e, $e();
                  }), K.continue = X, K.continuePrimaryKey = ce, K.advance = oe, $e(), Z;
                }, x(K);
              }, E);
            });
          }
          function y(v, _) {
            return function(b) {
              return new Promise(function(m, g) {
                var S;
                m = $(m);
                var x = b.trans, E = b.values, A = b.limit, F = b.query, I = (S = b.direction) !== null && S !== void 0 ? S : "next", T = A === 1 / 0 ? void 0 : A, R = F.index, B = F.range, U = x.objectStore(w), K = R.isPrimaryKey ? U : U.index(R.name), X = i(B);
                if (A === 0)
                  return m({ result: [] });
                if (_) {
                  var ce = {
                    query: X,
                    count: T,
                    direction: I
                  }, oe = E ? K.getAll(ce) : K.getAllKeys(ce);
                  oe.onsuccess = function(Z) {
                    return m({ result: Z.target.result });
                  }, oe.onerror = de(g);
                } else if (v && I === "next") {
                  var oe = E ? K.getAll(X, T) : K.getAllKeys(X, T);
                  oe.onsuccess = function($e) {
                    return m({ result: $e.target.result });
                  }, oe.onerror = de(g);
                } else {
                  var ze = 0, ie = E || !("openKeyCursor" in K) ? K.openCursor(X, I) : K.openKeyCursor(X, I), le = [];
                  ie.onsuccess = function() {
                    var Z = ie.result;
                    if (!Z)
                      return m({ result: le });
                    if (le.push(E ? Z.value : Z.primaryKey), ++ze === A)
                      return m({ result: le });
                    Z.continue();
                  }, ie.onerror = de(g);
                }
              });
            };
          }
          return {
            name: w,
            schema: p,
            mutate: f,
            getMany: function(v) {
              var _ = v.trans, b = v.keys;
              return new Promise(function(m, g) {
                m = $(m);
                for (var S = _.objectStore(w), x = b.length, E = new Array(x), A = 0, F = 0, I, T = function(K) {
                  var X = K.target;
                  (E[X._pos] = X.result) != null, ++F === A && m(E);
                }, R = de(g), B = 0; B < x; ++B) {
                  var U = b[B];
                  U != null && (I = S.get(b[B]), I._pos = B, I.onsuccess = T, I.onerror = R, ++A);
                }
                A === 0 && m(E);
              });
            },
            get: function(v) {
              var _ = v.trans, b = v.key;
              return new Promise(function(m, g) {
                m = $(m);
                var S = _.objectStore(w), x = S.get(b);
                x.onsuccess = function(E) {
                  return m(E.target.result);
                }, x.onerror = de(g);
              });
            },
            query: y(s, c),
            openCursor: h,
            count: function(v) {
              var _ = v.query, b = v.trans, m = _.index, g = _.range;
              return new Promise(function(S, x) {
                var E = b.objectStore(w), A = m.isPrimaryKey ? E : E.index(m.name), F = i(g), I = F ? A.count(F) : A.count();
                I.onsuccess = $(function(T) {
                  return S(T.target.result);
                }), I.onerror = de(x);
              });
            }
          };
        }
        var o = r(e, n), u = o.schema, s = o.hasGetAll, c = o.hasIdb3Features, l = u.tables.map(function(p) {
          return a(p);
        }), d = {};
        return l.forEach(function(p) {
          return d[p.name] = p;
        }), {
          stack: "dbcore",
          transaction: e.transaction.bind(e),
          table: function(p) {
            var w = d[p];
            if (!w)
              throw new Error("Table '".concat(p, "' not found"));
            return d[p];
          },
          MIN_KEY: -1 / 0,
          MAX_KEY: pt(t),
          schema: u
        };
      }
      function Fi(e, t) {
        return t.reduce(function(n, r) {
          var i = r.create;
          return O(O({}, n), i(n));
        }, e);
      }
      function ji(e, t, n, r) {
        var i = n.IDBKeyRange;
        n.indexedDB;
        var a = Fi(Mi(t, i, r), e.dbcore);
        return {
          dbcore: a
        };
      }
      function Lt(e, t) {
        var n = t.db, r = ji(e._middlewares, n, e._deps, t);
        e.core = r.dbcore, e.tables.forEach(function(i) {
          var a = i.name;
          e.core.schema.tables.some(function(o) {
            return o.name === a;
          }) && (i.core = e.core.table(a), e[a] instanceof e.Table && (e[a].core = i.core));
        });
      }
      function Wt(e, t, n, r) {
        n.forEach(function(i) {
          var a = r[i];
          t.forEach(function(o) {
            var u = N(o, i);
            (!u || "value" in u && u.value === void 0) && (o === e.Transaction.prototype || o instanceof e.Transaction ? fe(o, i, {
              get: function() {
                return this.table(i);
              },
              set: function(s) {
                it(this, i, {
                  value: s,
                  writable: !0,
                  configurable: !0,
                  enumerable: !0
                });
              }
            }) : o[i] = new e.Table(i, a));
          });
        });
      }
      function Tn(e, t) {
        t.forEach(function(n) {
          for (var r in n)
            n[r] instanceof e.Table && delete n[r];
        });
      }
      function Ni(e, t) {
        return e._cfg.version - t._cfg.version;
      }
      function Li(e, t, n, r) {
        var i = e._dbSchema;
        n.objectStoreNames.contains("$meta") && !i.$meta && (i.$meta = kn("$meta", Cr("")[0], []), e._storeNames.push("$meta"));
        var a = e._createTransaction("readwrite", e._storeNames, i);
        a.create(n), a._completion.catch(r);
        var o = a._reject.bind(a), u = C.transless || C;
        ke(function() {
          if (C.trans = a, C.transless = u, t === 0)
            Y(i).forEach(function(s) {
              In(n, s, i[s].primKey, i[s].indexes);
            }), Lt(e, n), k.follow(function() {
              return e.on.populate.fire(a);
            }).catch(o);
          else
            return Lt(e, n), Vi(e, a, t).then(function(s) {
              return Ui(e, s, a, n);
            }).catch(o);
        });
      }
      function Wi(e, t) {
        Tr(e._dbSchema, t), t.db.version % 10 === 0 && !t.objectStoreNames.contains("$meta") && t.db.createObjectStore("$meta").add(Math.ceil(t.db.version / 10 - 1), "version");
        var n = Ut(e, e.idbdb, t);
        zt(e, e._dbSchema, t);
        for (var r = Cn(n, e._dbSchema), i = function(c) {
          if (c.change.length || c.recreate)
            return console.warn("Unable to patch indexes of table ".concat(c.name, " because it has changes on the type of index or primary key.")), { value: void 0 };
          var l = t.objectStore(c.name);
          c.add.forEach(function(d) {
            ye && console.debug("Dexie upgrade patch: Creating missing index ".concat(c.name, ".").concat(d.src)), Vt(l, d);
          });
        }, a = 0, o = r.change; a < o.length; a++) {
          var u = o[a], s = i(u);
          if (typeof s == "object")
            return s.value;
        }
      }
      function Vi(e, t, n) {
        return t.storeNames.includes("$meta") ? t.table("$meta").get("version").then(function(r) {
          return r ?? n;
        }) : k.resolve(n);
      }
      function Ui(e, t, n, r) {
        var i = [], a = e._versions, o = e._dbSchema = Ut(e, e.idbdb, r), u = a.filter(function(c) {
          return c._cfg.version >= t;
        });
        if (u.length === 0)
          return k.resolve();
        u.forEach(function(c) {
          i.push(function() {
            var l = o, d = c._cfg.dbschema;
            zt(e, l, r), zt(e, d, r), o = e._dbSchema = d;
            var p = Cn(l, d);
            p.add.forEach(function(_) {
              In(r, _[0], _[1].primKey, _[1].indexes);
            }), p.change.forEach(function(_) {
              if (_.recreate)
                throw new D.Upgrade("Not yet support for changing primary key");
              var b = r.objectStore(_.name);
              _.add.forEach(function(m) {
                return Vt(b, m);
              }), _.change.forEach(function(m) {
                b.deleteIndex(m.name), Vt(b, m);
              }), _.del.forEach(function(m) {
                return b.deleteIndex(m);
              });
            });
            var w = c._cfg.contentUpgrade;
            if (w && c._cfg.version > t) {
              Lt(e, r), n._memoizedTables = {};
              var f = Qn(d);
              p.del.forEach(function(_) {
                f[_] = l[_];
              }), Tn(e, [e.Transaction.prototype]), Wt(e, [e.Transaction.prototype], Y(f), f), n.schema = f;
              var h = rn(w);
              h && Ze();
              var y, v = k.follow(function() {
                if (y = w(n), y && h) {
                  var _ = Ae.bind(null, null);
                  y.then(_, _);
                }
              });
              return y && typeof y.then == "function" ? k.resolve(y) : v.then(function() {
                return y;
              });
            }
          }), i.push(function(l) {
            var d = c._cfg.dbschema;
            zi(d, l), Tn(e, [e.Transaction.prototype]), Wt(e, [e.Transaction.prototype], e._storeNames, e._dbSchema), n.schema = e._dbSchema;
          }), i.push(function(l) {
            e.idbdb.objectStoreNames.contains("$meta") && (Math.ceil(e.idbdb.version / 10) === c._cfg.version ? (e.idbdb.deleteObjectStore("$meta"), delete e._dbSchema.$meta, e._storeNames = e._storeNames.filter(function(d) {
              return d !== "$meta";
            })) : l.objectStore("$meta").put(c._cfg.version, "version"));
          });
        });
        function s() {
          return i.length ? k.resolve(i.shift()(n.idbtrans)).then(s) : k.resolve();
        }
        return s().then(function() {
          Tr(o, r);
        });
      }
      function Cn(e, t) {
        var n = {
          del: [],
          add: [],
          change: []
        }, r;
        for (r in e)
          t[r] || n.del.push(r);
        for (r in t) {
          var i = e[r], a = t[r];
          if (!i)
            n.add.push([r, a]);
          else {
            var o = {
              name: r,
              def: a,
              recreate: !1,
              del: [],
              add: [],
              change: []
            };
            if ("" + (i.primKey.keyPath || "") != "" + (a.primKey.keyPath || "") || i.primKey.auto !== a.primKey.auto)
              o.recreate = !0, n.change.push(o);
            else {
              var u = i.idxByName, s = a.idxByName, c = void 0;
              for (c in u)
                s[c] || o.del.push(c);
              for (c in s) {
                var l = u[c], d = s[c];
                l ? l.src !== d.src && o.change.push(d) : o.add.push(d);
              }
              (o.del.length > 0 || o.add.length > 0 || o.change.length > 0) && n.change.push(o);
            }
          }
        }
        return n;
      }
      function In(e, t, n, r) {
        var i = e.db.createObjectStore(t, n.keyPath ? { keyPath: n.keyPath, autoIncrement: n.auto } : { autoIncrement: n.auto });
        return r.forEach(function(a) {
          return Vt(i, a);
        }), i;
      }
      function Tr(e, t) {
        Y(e).forEach(function(n) {
          t.db.objectStoreNames.contains(n) || (ye && console.debug("Dexie: Creating missing table", n), In(t, n, e[n].primKey, e[n].indexes));
        });
      }
      function zi(e, t) {
        [].slice.call(t.db.objectStoreNames).forEach(function(n) {
          return e[n] == null && t.db.deleteObjectStore(n);
        });
      }
      function Vt(e, t) {
        e.createIndex(t.name, t.keyPath, {
          unique: t.unique,
          multiEntry: t.multi
        });
      }
      function Ut(e, t, n) {
        var r = {}, i = ve(t.objectStoreNames, 0);
        return i.forEach(function(a) {
          for (var o = n.objectStore(a), u = o.keyPath, s = Sn(kr(u), u || "", !0, !1, !!o.autoIncrement, u && typeof u != "string", !0), c = [], l = 0; l < o.indexNames.length; ++l) {
            var d = o.index(o.indexNames[l]);
            u = d.keyPath;
            var p = Sn(d.name, u, !!d.unique, !!d.multiEntry, !1, u && typeof u != "string", !1);
            c.push(p);
          }
          r[a] = kn(a, s, c);
        }), r;
      }
      function $i(e, t, n) {
        e.verno = t.version / 10;
        var r = e._dbSchema = Ut(e, t, n);
        e._storeNames = ve(t.objectStoreNames, 0), Wt(e, [e._allTables], Y(r), r);
      }
      function Gi(e, t) {
        var n = Ut(e, e.idbdb, t), r = Cn(n, e._dbSchema);
        return !(r.add.length || r.change.some(function(i) {
          return i.add.length || i.change.length;
        }));
      }
      function zt(e, t, n) {
        for (var r = n.db.objectStoreNames, i = 0; i < r.length; ++i) {
          var a = r[i], o = n.objectStore(a);
          e._hasGetAll = "getAll" in o;
          for (var u = 0; u < o.indexNames.length; ++u) {
            var s = o.indexNames[u], c = o.index(s).keyPath, l = typeof c == "string" ? c : "[" + ve(c).join("+") + "]";
            if (t[a]) {
              var d = t[a].idxByName[l];
              d && (d.name = s, delete t[a].idxByName[l], t[a].idxByName[s] = d);
            }
          }
        }
        typeof navigator < "u" && /Safari/.test(navigator.userAgent) && !/(Chrome\/|Edge\/)/.test(navigator.userAgent) && G.WorkerGlobalScope && G instanceof G.WorkerGlobalScope && [].concat(navigator.userAgent.match(/Safari\/(\d*)/))[1] < 604 && (e._hasGetAll = !1);
      }
      function Cr(e) {
        return e.split(",").map(function(t, n) {
          var r, i = t.split(":"), a = (r = i[1]) === null || r === void 0 ? void 0 : r.trim();
          t = i[0].trim();
          var o = t.replace(/([&*]|\+\+)/g, ""), u = /^\[/.test(o) ? o.match(/^\[(.*)\]$/)[1].split("+") : o;
          return Sn(o, u || null, /\&/.test(t), /\*/.test(t), /\+\+/.test(t), V(u), n === 0, a);
        });
      }
      var Yi = (function() {
        function e() {
        }
        return e.prototype._createTableSchema = function(t, n, r) {
          return kn(t, n, r);
        }, e.prototype._parseIndexSyntax = function(t) {
          return Cr(t);
        }, e.prototype._parseStoresSpec = function(t, n) {
          var r = this;
          Y(t).forEach(function(i) {
            if (t[i] !== null) {
              var a = r._parseIndexSyntax(t[i]), o = a.shift();
              if (!o)
                throw new D.Schema("Invalid schema for table " + i + ": " + t[i]);
              if (o.unique = !0, o.multi)
                throw new D.Schema("Primary key cannot be multiEntry*");
              a.forEach(function(s) {
                if (s.auto)
                  throw new D.Schema("Only primary key can be marked as autoIncrement (++)");
                if (!s.keyPath)
                  throw new D.Schema("Index must have a name and cannot be an empty string");
              });
              var u = r._createTableSchema(i, o, a);
              n[i] = u;
            }
          });
        }, e.prototype.stores = function(t) {
          var n = this.db;
          this._cfg.storesSource = this._cfg.storesSource ? te(this._cfg.storesSource, t) : t;
          var r = n._versions, i = {}, a = {};
          return r.forEach(function(o) {
            te(i, o._cfg.storesSource), a = o._cfg.dbschema = {}, o._parseStoresSpec(i, a);
          }), n._dbSchema = a, Tn(n, [n._allTables, n, n.Transaction.prototype]), Wt(n, [n._allTables, n, n.Transaction.prototype, this._cfg.tables], Y(a), a), n._storeNames = Y(a), this;
        }, e.prototype.upgrade = function(t) {
          return this._cfg.contentUpgrade = un(this._cfg.contentUpgrade || W, t), this;
        }, e;
      })();
      function Hi(e) {
        return ht(Yi.prototype, function(n) {
          this.db = e, this._cfg = {
            version: n,
            storesSource: null,
            dbschema: {},
            tables: {},
            contentUpgrade: null
          };
        });
      }
      var yt = Qi();
      function Qi() {
        if (typeof FinalizationRegistry < "u" && typeof WeakRef < "u") {
          var e = /* @__PURE__ */ new Set(), t = new FinalizationRegistry(function(o) {
            e.delete(o);
          }), n = function() {
            return Array.from(e).map(function(o) {
              return o.deref();
            }).filter(function(o) {
              return o !== void 0;
            });
          }, r = function(o) {
            var u = new WeakRef(o._novip);
            if (e.add(u), t.register(o._novip, u, u), e.size > o._options.maxConnections) {
              var s = e.values().next().value;
              e.delete(s), t.unregister(s);
            }
          }, i = function(o) {
            if (o)
              for (var u = e.values(), s = u.next(); !s.done; ) {
                var c = s.value;
                if (c.deref() === o._novip) {
                  e.delete(c), t.unregister(c);
                  return;
                }
                s = u.next();
              }
          };
          return { toArray: n, add: r, remove: i };
        } else {
          var a = [], n = function() {
            return a;
          }, r = function(c) {
            a.push(c._novip);
          }, i = function(c) {
            if (c) {
              var l = a.indexOf(c._novip);
              l !== -1 && a.splice(l, 1);
            }
          };
          return { toArray: n, add: r, remove: i };
        }
      }
      function Kn(e, t) {
        var n = e._dbNamesDB;
        return n || (n = e._dbNamesDB = new Se(Pt, {
          addons: [],
          indexedDB: e,
          IDBKeyRange: t
        }), n.version(1).stores({ dbnames: "name" })), n.table("dbnames");
      }
      function Dn(e) {
        return e && typeof e.databases == "function";
      }
      function Xi(e) {
        var t = e.indexedDB, n = e.IDBKeyRange;
        return Dn(t) ? Promise.resolve(t.databases()).then(function(r) {
          return r.map(function(i) {
            return i.name;
          }).filter(function(i) {
            return i !== Pt;
          });
        }) : Kn(t, n).toCollection().primaryKeys();
      }
      function Ji(e, t) {
        var n = e.indexedDB, r = e.IDBKeyRange;
        !Dn(n) && t !== Pt && Kn(n, r).put({ name: t }).catch(W);
      }
      function Zi(e, t) {
        var n = e.indexedDB, r = e.IDBKeyRange;
        !Dn(n) && t !== Pt && Kn(n, r).delete(t).catch(W);
      }
      function On(e) {
        return ke(function() {
          return C.letThrough = !0, e();
        });
      }
      function qi() {
        var e = !navigator.userAgentData && /Safari\//.test(navigator.userAgent) && !/Chrom(e|ium)\//.test(navigator.userAgent);
        if (!e || !indexedDB.databases)
          return Promise.resolve();
        var t;
        return new Promise(function(n) {
          var r = function() {
            return indexedDB.databases().finally(n);
          };
          t = setInterval(r, 100), r();
        }).finally(function() {
          return clearInterval(t);
        });
      }
      var Pn;
      function Rn(e) {
        return !("from" in e);
      }
      var re = function(e, t) {
        if (this)
          te(this, arguments.length ? { d: 1, from: e, to: arguments.length > 1 ? t : e } : { d: 0 });
        else {
          var n = new re();
          return e && "d" in e && te(n, e), n;
        }
      };
      we(re.prototype, (Pn = {
        add: function(e) {
          return gt(this, e), this;
        },
        addKey: function(e) {
          return mt(this, e, e), this;
        },
        addKeys: function(e) {
          var t = this;
          return e.forEach(function(n) {
            return mt(t, n, n);
          }), this;
        },
        hasKey: function(e) {
          var t = $t(this).next(e).value;
          return t && j(t.from, e) <= 0 && j(t.to, e) >= 0;
        }
      }, Pn[nn] = function() {
        return $t(this);
      }, Pn));
      function mt(e, t, n) {
        var r = j(t, n);
        if (!isNaN(r)) {
          if (r > 0)
            throw RangeError();
          if (Rn(e))
            return te(e, { from: t, to: n, d: 1 });
          var i = e.l, a = e.r;
          if (j(n, e.from) < 0)
            return i ? mt(i, t, n) : e.l = { from: t, to: n, d: 1, l: null, r: null }, Kr(e);
          if (j(t, e.to) > 0)
            return a ? mt(a, t, n) : e.r = { from: t, to: n, d: 1, l: null, r: null }, Kr(e);
          j(t, e.from) < 0 && (e.from = t, e.l = null, e.d = a ? a.d + 1 : 1), j(n, e.to) > 0 && (e.to = n, e.r = null, e.d = e.l ? e.l.d + 1 : 1);
          var o = !e.r;
          i && !e.l && gt(e, i), a && o && gt(e, a);
        }
      }
      function gt(e, t) {
        function n(r, i) {
          var a = i.from, o = i.to, u = i.l, s = i.r;
          mt(r, a, o), u && n(r, u), s && n(r, s);
        }
        Rn(t) || n(e, t);
      }
      function Ir(e, t) {
        var n = $t(t), r = n.next();
        if (r.done)
          return !1;
        for (var i = r.value, a = $t(e), o = a.next(i.from), u = o.value; !r.done && !o.done; ) {
          if (j(u.from, i.to) <= 0 && j(u.to, i.from) >= 0)
            return !0;
          j(i.from, u.from) < 0 ? i = (r = n.next(u.from)).value : u = (o = a.next(i.from)).value;
        }
        return !1;
      }
      function $t(e) {
        var t = Rn(e) ? null : { s: 0, n: e };
        return {
          next: function(n) {
            for (var r = arguments.length > 0; t; )
              switch (t.s) {
                case 0:
                  if (t.s = 1, r)
                    for (; t.n.l && j(n, t.n.from) < 0; )
                      t = { up: t, n: t.n.l, s: 1 };
                  else
                    for (; t.n.l; )
                      t = { up: t, n: t.n.l, s: 1 };
                case 1:
                  if (t.s = 2, !r || j(n, t.n.to) <= 0)
                    return { value: t.n, done: !1 };
                case 2:
                  if (t.n.r) {
                    t.s = 3, t = { up: t, n: t.n.r, s: 0 };
                    continue;
                  }
                case 3:
                  t = t.up;
              }
            return { done: !0 };
          }
        };
      }
      function Kr(e) {
        var t, n, r = (((t = e.r) === null || t === void 0 ? void 0 : t.d) || 0) - (((n = e.l) === null || n === void 0 ? void 0 : n.d) || 0), i = r > 1 ? "r" : r < -1 ? "l" : "";
        if (i) {
          var a = i === "r" ? "l" : "r", o = O({}, e), u = e[i];
          e.from = u.from, e.to = u.to, e[i] = u[i], o[i] = u[a], e[a] = o, o.d = Dr(o);
        }
        e.d = Dr(e);
      }
      function Dr(e) {
        var t = e.r, n = e.l;
        return (t ? n ? Math.max(t.d, n.d) : t.d : n ? n.d : 0) + 1;
      }
      function Gt(e, t) {
        return Y(t).forEach(function(n) {
          e[n] ? gt(e[n], t[n]) : e[n] = Zn(t[n]);
        }), e;
      }
      function Bn(e, t) {
        return e.all || t.all || Object.keys(e).some(function(n) {
          return t[n] && Ir(t[n], e[n]);
        });
      }
      var Ve = {}, Mn = {}, Fn = !1;
      function Yt(e, t) {
        Gt(Mn, e), Fn || (Fn = !0, setTimeout(function() {
          Fn = !1;
          var n = Mn;
          Mn = {}, jn(n, !1);
        }, 0));
      }
      function jn(e, t) {
        t === void 0 && (t = !1);
        var n = /* @__PURE__ */ new Set();
        if (e.all)
          for (var r = 0, i = Object.values(Ve); r < i.length; r++) {
            var a = i[r];
            Or(a, e, n, t);
          }
        else
          for (var o in e) {
            var u = /^idb\:\/\/(.*)\/(.*)\//.exec(o);
            if (u) {
              var s = u[1], c = u[2], a = Ve["idb://".concat(s, "/").concat(c)];
              a && Or(a, e, n, t);
            }
          }
        n.forEach(function(l) {
          return l();
        });
      }
      function Or(e, t, n, r) {
        for (var i = [], a = 0, o = Object.entries(e.queries.query); a < o.length; a++) {
          for (var u = o[a], s = u[0], c = u[1], l = [], d = 0, p = c; d < p.length; d++) {
            var w = p[d];
            Bn(t, w.obsSet) ? w.subscribers.forEach(function(v) {
              return n.add(v);
            }) : r && l.push(w);
          }
          r && i.push([s, l]);
        }
        if (r)
          for (var f = 0, h = i; f < h.length; f++) {
            var y = h[f], s = y[0], l = y[1];
            e.queries.query[s] = l;
          }
      }
      function ea(e) {
        var t = e._state, n = e._deps.indexedDB;
        if (t.isBeingOpened || e.idbdb)
          return t.dbReadyPromise.then(function() {
            return t.dbOpenError ? H(t.dbOpenError) : e;
          });
        t.isBeingOpened = !0, t.dbOpenError = null, t.openComplete = !1;
        var r = t.openCanceller, i = Math.round(e.verno * 10), a = !1;
        function o() {
          if (t.openCanceller !== r)
            throw new D.DatabaseClosed("db.open() was cancelled");
        }
        var u = t.dbReadyResolve, s = null, c = !1, l = function() {
          return new k(function(p, w) {
            if (o(), !n)
              throw new D.MissingAPI();
            var f = e.name, h = t.autoSchema || !i ? n.open(f) : n.open(f, i);
            if (!h)
              throw new D.MissingAPI();
            h.onerror = de(w), h.onblocked = $(e._fireOnBlocked), h.onupgradeneeded = $(function(y) {
              if (s = h.transaction, t.autoSchema && !e._options.allowEmptyDB) {
                h.onerror = dt, s.abort(), h.result.close();
                var v = n.deleteDatabase(f);
                v.onsuccess = v.onerror = $(function() {
                  w(new D.NoSuchDatabase("Database ".concat(f, " doesnt exist")));
                });
              } else {
                s.onerror = de(w);
                var _ = y.oldVersion > Math.pow(2, 62) ? 0 : y.oldVersion;
                c = _ < 1, e.idbdb = h.result, a && Wi(e, s), Li(e, _ / 10, s, w);
              }
            }, w), h.onsuccess = $(function() {
              s = null;
              var y = e.idbdb = h.result, v = ve(y.objectStoreNames);
              if (v.length > 0)
                try {
                  var _ = y.transaction(Pi(v), "readonly");
                  if (t.autoSchema)
                    $i(e, y, _);
                  else if (zt(e, e._dbSchema, _), !Gi(e, _) && !a)
                    return console.warn("Dexie SchemaDiff: Schema was extended without increasing the number passed to db.version(). Dexie will add missing parts and increment native version number to workaround this."), y.close(), i = y.version + 1, a = !0, p(l());
                  Lt(e, _);
                } catch {
                }
              yt.add(e), y.onversionchange = $(function(b) {
                t.vcFired = !0, e.on("versionchange").fire(b);
              }), y.onclose = $(function() {
                e.close({ disableAutoOpen: !1 });
              }), c && Ji(e._deps, f), p();
            }, w);
          }).catch(function(p) {
            switch (p == null ? void 0 : p.name) {
              case "UnknownError":
                if (t.PR1398_maxLoop > 0)
                  return t.PR1398_maxLoop--, console.warn("Dexie: Workaround for Chrome UnknownError on open()"), l();
                break;
              case "VersionError":
                if (i > 0)
                  return i = 0, l();
                break;
            }
            return k.reject(p);
          });
        }, d = typeof navigator < "u" && !!n && n === G.indexedDB;
        return k.race([
          r,
          (d ? qi() : k.resolve()).then(l)
        ]).then(function() {
          return o(), t.onReadyBeingFired = [], k.resolve(On(function() {
            return e.on.ready.fire(e.vip);
          })).then(function p() {
            if (t.onReadyBeingFired.length > 0) {
              var w = t.onReadyBeingFired.reduce(un, W);
              return t.onReadyBeingFired = [], k.resolve(On(function() {
                return w(e.vip);
              })).then(p);
            }
          });
        }).finally(function() {
          t.openCanceller === r && (t.onReadyBeingFired = null, t.isBeingOpened = !1);
        }).catch(function(p) {
          t.dbOpenError = p;
          try {
            s && s.abort();
          } catch {
          }
          return r === t.openCanceller && e._close(), H(p);
        }).finally(function() {
          t.openComplete = !0, u();
        }).then(function() {
          if (c) {
            var p = {};
            e.tables.forEach(function(w) {
              w.schema.indexes.forEach(function(f) {
                f.name && (p["idb://".concat(e.name, "/").concat(w.name, "/").concat(f.name)] = new re(-1 / 0, [[[]]]));
              }), p["idb://".concat(e.name, "/").concat(w.name, "/")] = p["idb://".concat(e.name, "/").concat(w.name, "/:dels")] = new re(-1 / 0, [[[]]]);
            }), Ie(Nt).fire(p), jn(p, !0);
          }
          return e;
        });
      }
      function Nn(e) {
        var t = function(o) {
          return e.next(o);
        }, n = function(o) {
          return e.throw(o);
        }, r = a(t), i = a(n);
        function a(o) {
          return function(u) {
            var s = o(u), c = s.value;
            return s.done ? c : !c || typeof c.then != "function" ? V(c) ? Promise.all(c).then(r, i) : r(c) : c.then(r, i);
          };
        }
        return a(t)();
      }
      function ta(e, t, n) {
        var r = arguments.length;
        if (r < 2)
          throw new D.InvalidArgument("Too few arguments");
        for (var i = new Array(r - 1); --r; )
          i[r - 1] = arguments[r];
        n = i.pop();
        var a = Xn(i);
        return [e, a, n];
      }
      function Pr(e, t, n, r, i) {
        return k.resolve().then(function() {
          var a = C.transless || C, o = e._createTransaction(t, n, e._dbSchema, r);
          o.explicit = !0;
          var u = {
            trans: o,
            transless: a
          };
          if (r)
            o.idbtrans = r.idbtrans;
          else
            try {
              o.create(), o.idbtrans._explicit = !0, e._state.PR1398_maxLoop = 3;
            } catch (d) {
              return d.name === on.InvalidState && e.isOpen() && --e._state.PR1398_maxLoop > 0 ? (console.warn("Dexie: Need to reopen db"), e.close({ disableAutoOpen: !1 }), e.open().then(function() {
                return Pr(e, t, n, null, i);
              })) : H(d);
            }
          var s = rn(i);
          s && Ze();
          var c, l = k.follow(function() {
            if (c = i.call(o, o), c)
              if (s) {
                var d = Ae.bind(null, null);
                c.then(d, d);
              } else typeof c.next == "function" && typeof c.throw == "function" && (c = Nn(c));
          }, u);
          return (c && typeof c.then == "function" ? k.resolve(c).then(function(d) {
            return o.active ? d : H(new D.PrematureCommit("Transaction committed too early. See http://bit.ly/2kdckMn"));
          }) : l.then(function() {
            return c;
          })).then(function(d) {
            return r && o._resolve(), o._completion.then(function() {
              return d;
            });
          }).catch(function(d) {
            return o._reject(d), H(d);
          });
        });
      }
      function Ht(e, t, n) {
        for (var r = V(e) ? e.slice() : [e], i = 0; i < n; ++i)
          r.push(t);
        return r;
      }
      function na(e) {
        return O(O({}, e), { table: function(t) {
          var n = e.table(t), r = n.schema, i = /* @__PURE__ */ Object.create(null), a = [];
          function o(h, y, v) {
            var _ = vt(h), b = i[_] = i[_] || [], m = h == null ? 0 : typeof h == "string" ? 1 : h.length, g = y > 0, S = O(O({}, v), { name: g ? "".concat(_, "(virtual-from:").concat(v.name, ")") : v.name, lowLevelIndex: v, isVirtual: g, keyTail: y, keyLength: m, extractKey: An(h), unique: !g && v.unique });
            if (b.push(S), S.isPrimaryKey || a.push(S), m > 1) {
              var x = m === 2 ? h[0] : h.slice(0, m - 1);
              o(x, y + 1, v);
            }
            return b.sort(function(E, A) {
              return E.keyTail - A.keyTail;
            }), S;
          }
          var u = o(r.primaryKey.keyPath, 0, r.primaryKey);
          i[":id"] = [u];
          for (var s = 0, c = r.indexes; s < c.length; s++) {
            var l = c[s];
            o(l.keyPath, 0, l);
          }
          function d(h) {
            var y = i[vt(h)];
            return y && y[0];
          }
          function p(h, y) {
            return {
              type: h.type === 1 ? 2 : h.type,
              lower: Ht(h.lower, h.lowerOpen ? e.MAX_KEY : e.MIN_KEY, y),
              lowerOpen: !0,
              upper: Ht(h.upper, h.upperOpen ? e.MIN_KEY : e.MAX_KEY, y),
              upperOpen: !0
            };
          }
          function w(h) {
            var y = h.query.index;
            return y.isVirtual ? O(O({}, h), { query: {
              index: y.lowLevelIndex,
              range: p(h.query.range, y.keyTail)
            } }) : h;
          }
          var f = O(O({}, n), { schema: O(O({}, r), { primaryKey: u, indexes: a, getIndexByKeyPath: d }), count: function(h) {
            return n.count(w(h));
          }, query: function(h) {
            return n.query(w(h));
          }, openCursor: function(h) {
            var y = h.query.index, v = y.keyTail, _ = y.isVirtual, b = y.keyLength;
            if (!_)
              return n.openCursor(h);
            function m(g) {
              function S(E) {
                E != null ? g.continue(Ht(E, h.reverse ? e.MAX_KEY : e.MIN_KEY, v)) : h.unique ? g.continue(g.key.slice(0, b).concat(h.reverse ? e.MIN_KEY : e.MAX_KEY, v)) : g.continue();
              }
              var x = Object.create(g, {
                continue: { value: S },
                continuePrimaryKey: {
                  value: function(E, A) {
                    g.continuePrimaryKey(Ht(E, e.MAX_KEY, v), A);
                  }
                },
                primaryKey: {
                  get: function() {
                    return g.primaryKey;
                  }
                },
                key: {
                  get: function() {
                    var E = g.key;
                    return b === 1 ? E[0] : E.slice(0, b);
                  }
                },
                value: {
                  get: function() {
                    return g.value;
                  }
                }
              });
              return x;
            }
            return n.openCursor(w(h)).then(function(g) {
              return g && m(g);
            });
          } });
          return f;
        } });
      }
      var ra = {
        stack: "dbcore",
        name: "VirtualIndexMiddleware",
        level: 1,
        create: na
      };
      function Ln(e, t, n, r) {
        return n = n || {}, r = r || "", Y(e).forEach(function(i) {
          if (!ne(t, i))
            n[r + i] = void 0;
          else {
            var a = e[i], o = t[i];
            if (typeof a == "object" && typeof o == "object" && a && o) {
              var u = tn(a), s = tn(o);
              u !== s ? n[r + i] = t[i] : u === "Object" ? Ln(a, o, n, r + i + ".") : a !== o && (n[r + i] = t[i]);
            } else a !== o && (n[r + i] = t[i]);
          }
        }), Y(t).forEach(function(i) {
          ne(e, i) || (n[r + i] = t[i]);
        }), n;
      }
      function Wn(e, t) {
        return t.type === "delete" ? t.keys : t.keys || t.values.map(e.extractKey);
      }
      var ia = {
        stack: "dbcore",
        name: "HooksMiddleware",
        level: 2,
        create: function(e) {
          return O(O({}, e), { table: function(t) {
            var n = e.table(t), r = n.schema.primaryKey, i = O(O({}, n), { mutate: function(a) {
              var o = C.trans, u = o.table(t).hook, s = u.deleting, c = u.creating, l = u.updating;
              switch (a.type) {
                case "add":
                  if (c.fire === W)
                    break;
                  return o._promise("readwrite", function() {
                    return d(a);
                  }, !0);
                case "put":
                  if (c.fire === W && l.fire === W)
                    break;
                  return o._promise("readwrite", function() {
                    return d(a);
                  }, !0);
                case "delete":
                  if (s.fire === W)
                    break;
                  return o._promise("readwrite", function() {
                    return d(a);
                  }, !0);
                case "deleteRange":
                  if (s.fire === W)
                    break;
                  return o._promise("readwrite", function() {
                    return p(a);
                  }, !0);
              }
              return n.mutate(a);
              function d(f) {
                var h = C.trans, y = f.keys || Wn(r, f);
                if (!y)
                  throw new Error("Keys missing");
                return f = f.type === "add" || f.type === "put" ? O(O({}, f), { keys: y }) : O({}, f), f.type !== "delete" && (f.values = ee([], f.values)), f.keys && (f.keys = ee([], f.keys)), aa(n, f, y).then(function(v) {
                  var _ = y.map(function(b, m) {
                    var g = v[m], S = { onerror: null, onsuccess: null };
                    if (f.type === "delete")
                      s.fire.call(S, b, g, h);
                    else if (f.type === "add" || g === void 0) {
                      var x = c.fire.call(S, b, f.values[m], h);
                      b == null && x != null && (b = x, f.keys[m] = b, r.outbound || ue(f.values[m], r.keyPath, b));
                    } else {
                      var E = Ln(g, f.values[m]), A = l.fire.call(S, E, b, g, h);
                      if (A) {
                        var F = f.values[m];
                        Object.keys(A).forEach(function(I) {
                          ne(F, I) ? F[I] = A[I] : ue(F, I, A[I]);
                        });
                      }
                    }
                    return S;
                  });
                  return n.mutate(f).then(function(b) {
                    for (var m = b.failures, g = b.results, S = b.numFailures, x = b.lastResult, E = 0; E < y.length; ++E) {
                      var A = g ? g[E] : y[E], F = _[E];
                      A == null ? F.onerror && F.onerror(m[E]) : F.onsuccess && F.onsuccess(
                        f.type === "put" && v[E] ? f.values[E] : A
                      );
                    }
                    return { failures: m, results: g, numFailures: S, lastResult: x };
                  }).catch(function(b) {
                    return _.forEach(function(m) {
                      return m.onerror && m.onerror(b);
                    }), Promise.reject(b);
                  });
                });
              }
              function p(f) {
                return w(f.trans, f.range, 1e4);
              }
              function w(f, h, y) {
                return n.query({
                  trans: f,
                  values: !1,
                  query: { index: r, range: h },
                  limit: y
                }).then(function(v) {
                  var _ = v.result;
                  return d({
                    type: "delete",
                    keys: _,
                    trans: f
                  }).then(function(b) {
                    return b.numFailures > 0 ? Promise.reject(b.failures[0]) : _.length < y ? {
                      failures: [],
                      numFailures: 0,
                      lastResult: void 0
                    } : w(f, O(O({}, h), { lower: _[_.length - 1], lowerOpen: !0 }), y);
                  });
                });
              }
            } });
            return i;
          } });
        }
      };
      function aa(e, t, n) {
        return t.type === "add" ? Promise.resolve([]) : e.getMany({
          trans: t.trans,
          keys: n,
          cache: "immutable"
        });
      }
      function Rr(e, t, n) {
        try {
          if (!t || t.keys.length < e.length)
            return null;
          for (var r = [], i = 0, a = 0; i < t.keys.length && a < e.length; ++i)
            j(t.keys[i], e[a]) === 0 && (r.push(n ? Pe(t.values[i]) : t.values[i]), ++a);
          return r.length === e.length ? r : null;
        } catch {
          return null;
        }
      }
      var oa = {
        stack: "dbcore",
        level: -1,
        create: function(e) {
          return {
            table: function(t) {
              var n = e.table(t);
              return O(O({}, n), { getMany: function(r) {
                if (!r.cache)
                  return n.getMany(r);
                var i = Rr(r.keys, r.trans._cache, r.cache === "clone");
                return i ? k.resolve(i) : n.getMany(r).then(function(a) {
                  return r.trans._cache = {
                    keys: r.keys,
                    values: r.cache === "clone" ? Pe(a) : a
                  }, a;
                });
              }, mutate: function(r) {
                return r.type !== "add" && (r.trans._cache = null), n.mutate(r);
              } });
            }
          };
        }
      };
      function Br(e, t) {
        return e.trans.mode === "readonly" && !!e.subscr && !e.trans.explicit && e.trans.db._options.cache !== "disabled" && !t.schema.primaryKey.outbound;
      }
      function Mr(e, t) {
        switch (e) {
          case "query":
            return t.values && !t.unique;
          case "get":
            return !1;
          case "getMany":
            return !1;
          case "count":
            return !1;
          case "openCursor":
            return !1;
        }
      }
      var ua = {
        stack: "dbcore",
        level: 0,
        name: "Observability",
        create: function(e) {
          var t = e.schema.name, n = new re(e.MIN_KEY, e.MAX_KEY);
          return O(O({}, e), { transaction: function(r, i, a) {
            if (C.subscr && i !== "readonly")
              throw new D.ReadOnly("Readwrite transaction in liveQuery context. Querier source: ".concat(C.querier));
            return e.transaction(r, i, a);
          }, table: function(r) {
            var i = e.table(r), a = i.schema, o = a.primaryKey, u = a.indexes, s = o.extractKey, c = o.outbound, l = o.autoIncrement && u.filter(function(f) {
              return f.compound && f.keyPath.includes(o.keyPath);
            }), d = O(O({}, i), { mutate: function(f) {
              var h, y, v = f.trans, _ = f.mutatedParts || (f.mutatedParts = {}), b = function(R) {
                var B = "idb://".concat(t, "/").concat(r, "/").concat(R);
                return _[B] || (_[B] = new re());
              }, m = b(""), g = b(":dels"), S = f.type, x = f.type === "deleteRange" ? [f.range] : f.type === "delete" ? [f.keys] : f.values.length < 50 ? [
                Wn(o, f).filter(function(R) {
                  return R != null;
                }),
                f.values
              ] : [], E = x[0], A = x[1], F = f.trans._cache;
              if (V(E)) {
                m.addKeys(E);
                var I = S === "delete" || E.length === A.length ? Rr(E, F) : null;
                I || g.addKeys(E), (I || A) && sa(b, a, I, A);
              } else if (E) {
                var T = {
                  from: (h = E.lower) !== null && h !== void 0 ? h : e.MIN_KEY,
                  to: (y = E.upper) !== null && y !== void 0 ? y : e.MAX_KEY
                };
                g.add(T), m.add(T);
              } else
                m.add(n), g.add(n), a.indexes.forEach(function(R) {
                  return b(R.name).add(n);
                });
              return i.mutate(f).then(function(R) {
                return E && (f.type === "add" || f.type === "put") && (m.addKeys(R.results), l && l.forEach(function(B) {
                  for (var U = f.values.map(function(oe) {
                    return B.extractKey(oe);
                  }), K = B.keyPath.findIndex(function(oe) {
                    return oe === o.keyPath;
                  }), X = 0, ce = R.results.length; X < ce; ++X)
                    U[X][K] = R.results[X];
                  b(B.name).addKeys(U);
                })), v.mutatedParts = Gt(v.mutatedParts || {}, _), R;
              });
            } }), p = function(f) {
              var h, y, v = f.query, _ = v.index, b = v.range;
              return [
                _,
                new re((h = b.lower) !== null && h !== void 0 ? h : e.MIN_KEY, (y = b.upper) !== null && y !== void 0 ? y : e.MAX_KEY)
              ];
            }, w = {
              get: function(f) {
                return [o, new re(f.key)];
              },
              getMany: function(f) {
                return [o, new re().addKeys(f.keys)];
              },
              count: p,
              query: p,
              openCursor: p
            };
            return Y(w).forEach(function(f) {
              d[f] = function(h) {
                var y = C.subscr, v = !!y, _ = Br(C, i) && Mr(f, h), b = _ ? h.obsSet = {} : y;
                if (v) {
                  var m = function(I) {
                    var T = "idb://".concat(t, "/").concat(r, "/").concat(I);
                    return b[T] || (b[T] = new re());
                  }, g = m(""), S = m(":dels"), x = w[f](h), E = x[0], A = x[1];
                  if (f === "query" && E.isPrimaryKey && !h.values ? S.add(A) : m(E.name || "").add(A), !E.isPrimaryKey)
                    if (f === "count")
                      S.add(n);
                    else {
                      var F = f === "query" && c && h.values && i.query(O(O({}, h), { values: !1 }));
                      return i[f].apply(this, arguments).then(function(I) {
                        if (f === "query") {
                          if (c && h.values)
                            return F.then(function(U) {
                              var K = U.result;
                              return g.addKeys(K), I;
                            });
                          var T = h.values ? I.result.map(s) : I.result;
                          h.values ? g.addKeys(T) : S.addKeys(T);
                        } else if (f === "openCursor") {
                          var R = I, B = h.values;
                          return R && Object.create(R, {
                            key: {
                              get: function() {
                                return S.addKey(R.primaryKey), R.key;
                              }
                            },
                            primaryKey: {
                              get: function() {
                                var U = R.primaryKey;
                                return S.addKey(U), U;
                              }
                            },
                            value: {
                              get: function() {
                                return B && g.addKey(R.primaryKey), R.value;
                              }
                            }
                          });
                        }
                        return I;
                      });
                    }
                }
                return i[f].apply(this, arguments);
              };
            }), d;
          } });
        }
      };
      function sa(e, t, n, r) {
        function i(a) {
          var o = e(a.name || "");
          function u(c) {
            return c != null ? a.extractKey(c) : null;
          }
          var s = function(c) {
            return a.multiEntry && V(c) ? c.forEach(function(l) {
              return o.addKey(l);
            }) : o.addKey(c);
          };
          (n || r).forEach(function(c, l) {
            var d = n && u(n[l]), p = r && u(r[l]);
            j(d, p) !== 0 && (d != null && s(d), p != null && s(p));
          });
        }
        t.indexes.forEach(i);
      }
      function Fr(e, t, n) {
        if (n.numFailures === 0)
          return t;
        if (t.type === "deleteRange")
          return null;
        var r = t.keys ? t.keys.length : "values" in t && t.values ? t.values.length : 1;
        if (n.numFailures === r)
          return null;
        var i = O({}, t);
        return V(i.keys) && (i.keys = i.keys.filter(function(a, o) {
          return !(o in n.failures);
        })), "values" in i && V(i.values) && (i.values = i.values.filter(function(a, o) {
          return !(o in n.failures);
        })), i;
      }
      function ca(e, t) {
        return t.lower === void 0 ? !0 : t.lowerOpen ? j(e, t.lower) > 0 : j(e, t.lower) >= 0;
      }
      function la(e, t) {
        return t.upper === void 0 ? !0 : t.upperOpen ? j(e, t.upper) < 0 : j(e, t.upper) <= 0;
      }
      function Vn(e, t) {
        return ca(e, t) && la(e, t);
      }
      function jr(e, t, n, r, i, a) {
        if (!n || n.length === 0)
          return e;
        var o = t.query.index, u = o.multiEntry, s = t.query.range, c = r.schema.primaryKey, l = c.extractKey, d = o.extractKey, p = (o.lowLevelIndex || o).extractKey, w = n.reduce(function(h, y) {
          var v = h, _ = [];
          if (y.type === "add" || y.type === "put")
            for (var b = new re(), m = y.values.length - 1; m >= 0; --m) {
              var g = y.values[m], S = l(g);
              if (!b.hasKey(S)) {
                var x = d(g);
                (u && V(x) ? x.some(function(T) {
                  return Vn(T, s);
                }) : Vn(x, s)) && (b.addKey(S), _.push(g));
              }
            }
          switch (y.type) {
            case "add": {
              var E = new re().addKeys(t.values ? h.map(function(T) {
                return l(T);
              }) : h);
              v = h.concat(t.values ? _.filter(function(T) {
                var R = l(T);
                return E.hasKey(R) ? !1 : (E.addKey(R), !0);
              }) : _.map(function(T) {
                return l(T);
              }).filter(function(T) {
                return E.hasKey(T) ? !1 : (E.addKey(T), !0);
              }));
              break;
            }
            case "put": {
              var A = new re().addKeys(y.values.map(function(T) {
                return l(T);
              }));
              v = h.filter(
                function(T) {
                  return !A.hasKey(t.values ? l(T) : T);
                }
              ).concat(
                t.values ? _ : _.map(function(T) {
                  return l(T);
                })
              );
              break;
            }
            case "delete":
              var F = new re().addKeys(y.keys);
              v = h.filter(function(T) {
                return !F.hasKey(t.values ? l(T) : T);
              });
              break;
            case "deleteRange":
              var I = y.range;
              v = h.filter(function(T) {
                return !Vn(l(T), I);
              });
              break;
          }
          return v;
        }, e);
        if (w === e)
          return e;
        var f = function(h, y) {
          return j(p(h), p(y)) || j(l(h), l(y));
        };
        return w.sort(t.direction === "prev" || t.direction === "prevunique" ? function(h, y) {
          return f(y, h);
        } : f), t.limit && t.limit < 1 / 0 && (w.length > t.limit ? w.length = t.limit : e.length === t.limit && w.length < t.limit && (i.dirty = !0)), a ? Object.freeze(w) : w;
      }
      function Nr(e, t) {
        return j(e.lower, t.lower) === 0 && j(e.upper, t.upper) === 0 && !!e.lowerOpen == !!t.lowerOpen && !!e.upperOpen == !!t.upperOpen;
      }
      function fa(e, t, n, r) {
        if (e === void 0)
          return t !== void 0 ? -1 : 0;
        if (t === void 0)
          return 1;
        var i = j(e, t);
        if (i === 0) {
          if (n && r)
            return 0;
          if (n)
            return 1;
          if (r)
            return -1;
        }
        return i;
      }
      function ha(e, t, n, r) {
        if (e === void 0)
          return t !== void 0 ? 1 : 0;
        if (t === void 0)
          return -1;
        var i = j(e, t);
        if (i === 0) {
          if (n && r)
            return 0;
          if (n)
            return -1;
          if (r)
            return 1;
        }
        return i;
      }
      function da(e, t) {
        return fa(e.lower, t.lower, e.lowerOpen, t.lowerOpen) <= 0 && ha(e.upper, t.upper, e.upperOpen, t.upperOpen) >= 0;
      }
      function pa(e, t, n, r) {
        var i, a = Ve["idb://".concat(e, "/").concat(t)];
        if (!a)
          return [];
        var o = a.queries[n];
        if (!o)
          return [null, !1, a, null];
        var u = r.query ? r.query.index.name : null, s = o[u || ""];
        if (!s)
          return [null, !1, a, null];
        switch (n) {
          case "query":
            var c = (i = r.direction) !== null && i !== void 0 ? i : "next", l = s.find(function(w) {
              var f;
              return w.req.limit === r.limit && w.req.values === r.values && ((f = w.req.direction) !== null && f !== void 0 ? f : "next") === c && Nr(w.req.query.range, r.query.range);
            });
            if (l)
              return [
                l,
                !0,
                a,
                s
              ];
            var d = s.find(function(w) {
              var f, h = "limit" in w.req ? w.req.limit : 1 / 0;
              return h >= r.limit && ((f = w.req.direction) !== null && f !== void 0 ? f : "next") === c && (r.values ? w.req.values : !0) && da(w.req.query.range, r.query.range);
            });
            return [d, !1, a, s];
          case "count":
            var p = s.find(function(w) {
              return Nr(w.req.query.range, r.query.range);
            });
            return [p, !!p, a, s];
        }
      }
      function va(e, t, n, r) {
        e.subscribers.add(n), r.addEventListener("abort", function() {
          e.subscribers.delete(n), e.subscribers.size === 0 && ya(e, t);
        });
      }
      function ya(e, t) {
        setTimeout(function() {
          e.subscribers.size === 0 && Re(t, e);
        }, 3e3);
      }
      var ma = {
        stack: "dbcore",
        level: 0,
        name: "Cache",
        create: function(e) {
          var t = e.schema.name, n = O(O({}, e), { transaction: function(r, i, a) {
            var o = e.transaction(r, i, a);
            if (i === "readwrite") {
              var u = new AbortController(), s = u.signal, c = function(l) {
                return function() {
                  if (u.abort(), i === "readwrite") {
                    for (var d = /* @__PURE__ */ new Set(), p = 0, w = r; p < w.length; p++) {
                      var f = w[p], h = Ve["idb://".concat(t, "/").concat(f)];
                      if (h) {
                        var y = e.table(f), v = h.optimisticOps.filter(function(B) {
                          return B.trans === o;
                        });
                        if (o._explicit && l && o.mutatedParts)
                          for (var _ = 0, b = Object.values(h.queries.query); _ < b.length; _++)
                            for (var m = b[_], g = 0, S = m.slice(); g < S.length; g++) {
                              var x = S[g];
                              Bn(x.obsSet, o.mutatedParts) && (Re(m, x), x.subscribers.forEach(function(B) {
                                return d.add(B);
                              }));
                            }
                        else if (v.length > 0) {
                          h.optimisticOps = h.optimisticOps.filter(function(B) {
                            return B.trans !== o;
                          });
                          for (var E = 0, A = Object.values(h.queries.query); E < A.length; E++)
                            for (var m = A[E], F = 0, I = m.slice(); F < I.length; F++) {
                              var x = I[F];
                              if (x.res != null && o.mutatedParts)
                                if (l && !x.dirty) {
                                  var T = Object.isFrozen(x.res), R = jr(x.res, x.req, v, y, x, T);
                                  x.dirty ? (Re(m, x), x.subscribers.forEach(function(K) {
                                    return d.add(K);
                                  })) : R !== x.res && (x.res = R, x.promise = k.resolve({
                                    result: R
                                  }));
                                } else
                                  x.dirty && Re(m, x), x.subscribers.forEach(function(K) {
                                    return d.add(K);
                                  });
                            }
                        }
                      }
                    }
                    d.forEach(function(B) {
                      return B();
                    });
                  }
                };
              };
              o.addEventListener("abort", c(!1), {
                signal: s
              }), o.addEventListener("error", c(!1), {
                signal: s
              }), o.addEventListener("complete", c(!0), {
                signal: s
              });
            }
            return o;
          }, table: function(r) {
            var i = e.table(r), a = i.schema.primaryKey, o = O(O({}, i), { mutate: function(u) {
              var s = C.trans;
              if (a.outbound || s.db._options.cache === "disabled" || s.explicit || s.idbtrans.mode !== "readwrite")
                return i.mutate(u);
              var c = Ve["idb://".concat(t, "/").concat(r)];
              if (!c)
                return i.mutate(u);
              var l = i.mutate(u);
              return (u.type === "add" || u.type === "put") && (u.values.length >= 50 || Wn(a, u).some(function(d) {
                return d == null;
              })) ? l.then(function(d) {
                var p = O(O({}, u), { values: u.values.map(function(f, h) {
                  var y;
                  if (d.failures[h])
                    return f;
                  var v = !((y = a.keyPath) === null || y === void 0) && y.includes(".") ? Pe(f) : O({}, f);
                  return ue(v, a.keyPath, d.results[h]), v;
                }) }), w = Fr(c, p, d);
                c.optimisticOps.push(w), queueMicrotask(function() {
                  return u.mutatedParts && Yt(u.mutatedParts);
                });
              }) : (c.optimisticOps.push(u), u.mutatedParts && Yt(u.mutatedParts), l.then(function(d) {
                if (d.numFailures > 0) {
                  Re(c.optimisticOps, u);
                  var p = Fr(c, u, d);
                  p && c.optimisticOps.push(p), u.mutatedParts && Yt(u.mutatedParts);
                }
              }), l.catch(function() {
                Re(c.optimisticOps, u), u.mutatedParts && Yt(u.mutatedParts);
              })), l;
            }, query: function(u) {
              var s;
              if (!Br(C, i) || !Mr("query", u))
                return i.query(u);
              var c = ((s = C.trans) === null || s === void 0 ? void 0 : s.db._options.cache) === "immutable", l = C, d = l.requery, p = l.signal, w = pa(t, r, "query", u), f = w[0], h = w[1], y = w[2], v = w[3];
              if (f && h)
                f.obsSet = u.obsSet;
              else {
                var _ = i.query(u).then(function(b) {
                  var m = b.result;
                  if (f && (f.res = m), c) {
                    for (var g = 0, S = m.length; g < S; ++g)
                      Object.freeze(m[g]);
                    Object.freeze(m);
                  }
                  return b;
                }).catch(function(b) {
                  return v && f && Re(v, f), Promise.reject(b);
                });
                f = {
                  obsSet: u.obsSet,
                  promise: _,
                  subscribers: /* @__PURE__ */ new Set(),
                  type: "query",
                  req: u,
                  dirty: !1
                }, v ? v.push(f) : (v = [f], y || (y = Ve["idb://".concat(t, "/").concat(r)] = {
                  queries: {
                    query: {},
                    count: {}
                  },
                  objs: /* @__PURE__ */ new Map(),
                  optimisticOps: [],
                  unsignaledParts: {}
                }), y.queries.query[u.query.index.name || ""] = v);
              }
              return va(f, v, d, p), f.promise.then(function(b) {
                var m = jr(b.result, u, y == null ? void 0 : y.optimisticOps, i, f, c);
                return {
                  result: c ? m : Pe(m)
                };
              });
            } });
            return o;
          } });
          return n;
        }
      };
      function Qt(e, t) {
        return new Proxy(e, {
          get: function(n, r, i) {
            return r === "db" ? t : Reflect.get(n, r, i);
          }
        });
      }
      var Se = (function() {
        function e(t, n) {
          var r = this;
          this._middlewares = {}, this.verno = 0;
          var i = e.dependencies;
          this._options = n = O({
            addons: e.addons,
            autoOpen: !0,
            indexedDB: i.indexedDB,
            IDBKeyRange: i.IDBKeyRange,
            cache: "cloned",
            maxConnections: dr
          }, n), this._deps = {
            indexedDB: n.indexedDB,
            IDBKeyRange: n.IDBKeyRange
          };
          var a = n.addons;
          this._dbSchema = {}, this._versions = [], this._storeNames = [], this._allTables = {}, this.idbdb = null, this._novip = this;
          var o = {
            dbOpenError: null,
            isBeingOpened: !1,
            onReadyBeingFired: null,
            openComplete: !1,
            dbReadyResolve: W,
            dbReadyPromise: null,
            cancelOpen: W,
            openCanceller: null,
            autoSchema: !0,
            PR1398_maxLoop: 3,
            autoOpen: n.autoOpen
          };
          o.dbReadyPromise = new k(function(s) {
            o.dbReadyResolve = s;
          }), o.openCanceller = new k(function(s, c) {
            o.cancelOpen = c;
          }), this._state = o, this.name = t, this.on = ft(this, "populate", "blocked", "versionchange", "close", {
            ready: [un, W]
          }), this.once = function(s, c) {
            var l = function() {
              for (var d = [], p = 0; p < arguments.length; p++)
                d[p] = arguments[p];
              r.on(s).unsubscribe(l), c.apply(r, d);
            };
            return r.on(s, l);
          }, this.on.ready.subscribe = xt(this.on.ready.subscribe, function(s) {
            return function(c, l) {
              e.vip(function() {
                var d = r._state;
                if (d.openComplete)
                  d.dbOpenError || k.resolve().then(c), l && s(c);
                else if (d.onReadyBeingFired)
                  d.onReadyBeingFired.push(c), l && s(c);
                else {
                  s(c);
                  var p = r;
                  l || s(function w() {
                    p.on.ready.unsubscribe(c), p.on.ready.unsubscribe(w);
                  });
                }
              });
            };
          }), this.Collection = Si(this), this.Table = _i(this), this.Transaction = Oi(this), this.Version = Hi(this), this.WhereClause = Ki(this), this.on("versionchange", function(s) {
            s.newVersion > 0 ? console.warn("Another connection wants to upgrade database '".concat(r.name, "'. Closing db now to resume the upgrade.")) : console.warn("Another connection wants to delete database '".concat(r.name, "'. Closing db now to resume the delete request.")), r.close({ disableAutoOpen: !1 });
          }), this.on("blocked", function(s) {
            !s.newVersion || s.newVersion < s.oldVersion ? console.warn("Dexie.delete('".concat(r.name, "') was blocked")) : console.warn("Upgrade '".concat(r.name, "' blocked by other connection holding version ").concat(s.oldVersion / 10));
          }), this._maxKey = pt(n.IDBKeyRange), this._createTransaction = function(s, c, l, d) {
            return new r.Transaction(s, c, l, r._options.chromeTransactionDurability, d);
          }, this._fireOnBlocked = function(s) {
            r.on("blocked").fire(s), yt.toArray().filter(function(c) {
              return c.name === r.name && c !== r && !c._state.vcFired;
            }).map(function(c) {
              return c.on("versionchange").fire(s);
            });
          }, this.use(oa), this.use(ma), this.use(ua), this.use(ra), this.use(ia);
          var u = new Proxy(this, {
            get: function(s, c, l) {
              if (c === "_vip")
                return !0;
              if (c === "table")
                return function(p) {
                  return Qt(r.table(p), u);
                };
              var d = Reflect.get(s, c, l);
              return d instanceof wr ? Qt(d, u) : c === "tables" ? d.map(function(p) {
                return Qt(p, u);
              }) : c === "_createTransaction" ? function() {
                var p = d.apply(this, arguments);
                return Qt(p, u);
              } : d;
            }
          });
          this.vip = u, a.forEach(function(s) {
            return s(r);
          });
        }
        return e.prototype.version = function(t) {
          if (isNaN(t) || t < 0.1)
            throw new D.Type("Given version is not a positive number");
          if (t = Math.round(t * 10) / 10, this.idbdb || this._state.isBeingOpened)
            throw new D.Schema("Cannot add version when database is open");
          this.verno = Math.max(this.verno, t);
          var n = this._versions, r = n.filter(function(i) {
            return i._cfg.version === t;
          })[0];
          return r || (r = new this.Version(t), n.push(r), n.sort(Ni), r.stores({}), this._state.autoSchema = !1, r);
        }, e.prototype._whenReady = function(t) {
          var n = this;
          return this.idbdb && (this._state.openComplete || C.letThrough || this._vip) ? t() : new k(function(r, i) {
            if (n._state.openComplete)
              return i(new D.DatabaseClosed(n._state.dbOpenError));
            if (!n._state.isBeingOpened) {
              if (!n._state.autoOpen) {
                i(new D.DatabaseClosed());
                return;
              }
              n.open().catch(W);
            }
            n._state.dbReadyPromise.then(r, i);
          }).then(t);
        }, e.prototype.use = function(t) {
          var n = t.stack, r = t.create, i = t.level, a = t.name;
          a && this.unuse({ stack: n, name: a });
          var o = this._middlewares[n] || (this._middlewares[n] = []);
          return o.push({
            stack: n,
            create: r,
            level: i ?? 10,
            name: a
          }), o.sort(function(u, s) {
            return u.level - s.level;
          }), this;
        }, e.prototype.unuse = function(t) {
          var n = t.stack, r = t.name, i = t.create;
          return n && this._middlewares[n] && (this._middlewares[n] = this._middlewares[n].filter(function(a) {
            return i ? a.create !== i : r ? a.name !== r : !1;
          })), this;
        }, e.prototype.open = function() {
          var t = this;
          return Ne(
            xe,
            function() {
              return ea(t);
            }
          );
        }, e.prototype._close = function() {
          this.on.close.fire(new CustomEvent("close"));
          var t = this._state;
          if (yt.remove(this), this.idbdb) {
            try {
              this.idbdb.close();
            } catch {
            }
            this.idbdb = null;
          }
          t.isBeingOpened || (t.dbReadyPromise = new k(function(n) {
            t.dbReadyResolve = n;
          }), t.openCanceller = new k(function(n, r) {
            t.cancelOpen = r;
          }));
        }, e.prototype.close = function(t) {
          var n = t === void 0 ? { disableAutoOpen: !0 } : t, r = n.disableAutoOpen, i = this._state;
          r ? (i.isBeingOpened && i.cancelOpen(new D.DatabaseClosed()), this._close(), i.autoOpen = !1, i.dbOpenError = new D.DatabaseClosed()) : (this._close(), i.autoOpen = this._options.autoOpen || i.isBeingOpened, i.openComplete = !1, i.dbOpenError = null);
        }, e.prototype.delete = function(t) {
          var n = this;
          t === void 0 && (t = { disableAutoOpen: !0 });
          var r = arguments.length > 0 && typeof arguments[0] != "object", i = this._state;
          return new k(function(a, o) {
            var u = function() {
              n.close(t);
              var s = n._deps.indexedDB.deleteDatabase(n.name);
              s.onsuccess = $(function() {
                Zi(n._deps, n.name), a();
              }), s.onerror = de(o), s.onblocked = n._fireOnBlocked;
            };
            if (r)
              throw new D.InvalidArgument("Invalid closeOptions argument to db.delete()");
            i.isBeingOpened ? i.dbReadyPromise.then(u) : u();
          });
        }, e.prototype.backendDB = function() {
          return this.idbdb;
        }, e.prototype.isOpen = function() {
          return this.idbdb !== null;
        }, e.prototype.hasBeenClosed = function() {
          var t = this._state.dbOpenError;
          return t && t.name === "DatabaseClosedError";
        }, e.prototype.hasFailed = function() {
          return this._state.dbOpenError !== null;
        }, e.prototype.dynamicallyOpened = function() {
          return this._state.autoSchema;
        }, Object.defineProperty(e.prototype, "tables", {
          get: function() {
            var t = this;
            return Y(this._allTables).map(function(n) {
              return t._allTables[n];
            });
          },
          enumerable: !1,
          configurable: !0
        }), e.prototype.transaction = function() {
          var t = ta.apply(this, arguments);
          return this._transaction.apply(this, t);
        }, e.prototype._transaction = function(t, n, r) {
          var i = this, a = C.trans;
          (!a || a.db !== this || t.indexOf("!") !== -1) && (a = null);
          var o = t.indexOf("?") !== -1;
          t = t.replace("!", "").replace("?", "");
          var u, s;
          try {
            if (s = n.map(function(l) {
              var d = l instanceof i.Table ? l.name : l;
              if (typeof d != "string")
                throw new TypeError("Invalid table argument to Dexie.transaction(). Only Table or String are allowed");
              return d;
            }), t == "r" || t === wn)
              u = wn;
            else if (t == "rw" || t == bn)
              u = bn;
            else
              throw new D.InvalidArgument("Invalid transaction mode: " + t);
            if (a) {
              if (a.mode === wn && u === bn)
                if (o)
                  a = null;
                else
                  throw new D.SubTransaction("Cannot enter a sub-transaction with READWRITE mode when parent transaction is READONLY");
              a && s.forEach(function(l) {
                if (a && a.storeNames.indexOf(l) === -1)
                  if (o)
                    a = null;
                  else
                    throw new D.SubTransaction("Table " + l + " not included in parent transaction.");
              }), o && a && !a.active && (a = null);
            }
          } catch (l) {
            return a ? a._promise(null, function(d, p) {
              p(l);
            }) : H(l);
          }
          var c = Pr.bind(null, this, u, s, a, r);
          return a ? a._promise(u, c, "lock") : C.trans ? Ne(C.transless, function() {
            return i._whenReady(c);
          }) : this._whenReady(c);
        }, e.prototype.table = function(t) {
          if (!ne(this._allTables, t))
            throw new D.InvalidTable("Table ".concat(t, " does not exist"));
          return this._allTables[t];
        }, e;
      })(), ga = typeof Symbol < "u" && "observable" in Symbol ? Symbol.observable : "@@observable", wa = (function() {
        function e(t) {
          this._subscribe = t;
        }
        return e.prototype.subscribe = function(t, n, r) {
          return this._subscribe(!t || typeof t == "function" ? { next: t, error: n, complete: r } : t);
        }, e.prototype[ga] = function() {
          return this;
        }, e;
      })(), Xt;
      try {
        Xt = {
          indexedDB: G.indexedDB || G.mozIndexedDB || G.webkitIndexedDB || G.msIndexedDB,
          IDBKeyRange: G.IDBKeyRange || G.webkitIDBKeyRange
        };
      } catch {
        Xt = { indexedDB: null, IDBKeyRange: null };
      }
      function Lr(e) {
        var t = !1, n, r = new wa(function(i) {
          var a = rn(e);
          function o(v) {
            var _ = Xe();
            try {
              a && Ze();
              var b = ke(e, v);
              return a && (b = b.finally(Ae)), b;
            } finally {
              _ && Je();
            }
          }
          var u = !1, s, c = {}, l = {}, d = {
            get closed() {
              return u;
            },
            unsubscribe: function() {
              u || (u = !0, s && s.abort(), p && Ie.storagemutated.unsubscribe(h));
            }
          };
          i.start && i.start(d);
          var p = !1, w = function() {
            return yn(y);
          };
          function f() {
            return Bn(l, c);
          }
          var h = function(v) {
            Gt(c, v), f() && w();
          }, y = function() {
            if (!(u || !Xt.indexedDB)) {
              c = {};
              var v = {};
              s && s.abort(), s = new AbortController();
              var _ = {
                subscr: v,
                signal: s.signal,
                requery: w,
                querier: e,
                trans: null
              }, b = o(_);
              p || (Ie.storagemutated.subscribe(h), p = !0), Promise.resolve(b).then(function(m) {
                t = !0, n = m, !(u || _.signal.aborted) && (f() ? w() : (l = v, f() ? w() : (c = {}, yn(function() {
                  return !u && i.next && i.next(m);
                }))));
              }, function(m) {
                u || _.signal.aborted || (t = !1, ["DatabaseClosedError", "AbortError"].includes(m == null ? void 0 : m.name) || u || yn(function() {
                  u || i.error && i.error(m);
                }));
              });
            }
          };
          return setTimeout(w, 0), d;
        });
        return r.hasValue = function() {
          return t;
        }, r.getValue = function() {
          return n;
        }, r;
      }
      var Ue = Se;
      we(Ue, O(O({}, St), {
        delete: function(e) {
          var t = new Ue(e, { addons: [] });
          return t.delete();
        },
        exists: function(e) {
          return new Ue(e, { addons: [] }).open().then(function(t) {
            return t.close(), !0;
          }).catch("NoSuchDatabaseError", function() {
            return !1;
          });
        },
        getDatabaseNames: function(e) {
          try {
            return Xi(Ue.dependencies).then(e);
          } catch {
            return H(new D.MissingAPI());
          }
        },
        defineClass: function() {
          function e(t) {
            te(this, t);
          }
          return e;
        },
        ignoreTransaction: function(e) {
          return C.trans ? Ne(C.transless || xe, e) : e();
        },
        vip: On,
        async: function(e) {
          return function() {
            try {
              var t = Nn(e.apply(this, arguments));
              return !t || typeof t.then != "function" ? k.resolve(t) : t;
            } catch (n) {
              return H(n);
            }
          };
        },
        spawn: function(e, t, n) {
          try {
            var r = Nn(e.apply(n, t || []));
            return !r || typeof r.then != "function" ? k.resolve(r) : r;
          } catch (i) {
            return H(i);
          }
        },
        currentTransaction: {
          get: function() {
            return C.trans || null;
          }
        },
        waitFor: function(e, t) {
          var n = k.resolve(typeof e == "function" ? Ue.ignoreTransaction(e) : e).timeout(t || 6e4);
          return C.trans ? C.trans.waitFor(n) : n;
        },
        Promise: k,
        debug: {
          get: function() {
            return ye;
          },
          set: function(e) {
            nr(e);
          }
        },
        derive: M,
        extend: te,
        props: we,
        override: xt,
        Events: ft,
        on: Ie,
        liveQuery: Lr,
        extendObservabilitySet: Gt,
        getByKeyPath: be,
        setByKeyPath: ue,
        delByKeyPath: Yr,
        shallowClone: Qn,
        deepClone: Pe,
        getObjectDiff: Ln,
        cmp: j,
        asap: Hn,
        minKey: gn,
        addons: [],
        connections: {
          get: yt.toArray
        },
        errnames: on,
        dependencies: Xt,
        cache: Ve,
        semVer: fr,
        version: fr.split(".").map(function(e) {
          return parseInt(e);
        }).reduce(function(e, t, n) {
          return e + t / Math.pow(10, n * 2);
        })
      })), Ue.maxKey = pt(Ue.dependencies.IDBKeyRange), typeof dispatchEvent < "u" && typeof addEventListener < "u" && (Ie(Nt, function(e) {
        if (!Ke) {
          var t;
          t = new CustomEvent(En, {
            detail: e
          }), Ke = !0, dispatchEvent(t), Ke = !1;
        }
      }), addEventListener(En, function(e) {
        var t = e.detail;
        Ke || Un(t);
      }));
      function Un(e) {
        var t = Ke;
        try {
          Ke = !0, Ie.storagemutated.fire(e), jn(e, !0);
        } finally {
          Ke = t;
        }
      }
      var Ke = !1, De, zn = function() {
      };
      typeof BroadcastChannel < "u" && (zn = function() {
        De = new BroadcastChannel(En), De.onmessage = function(e) {
          return e.data && Un(e.data);
        };
      }, zn(), typeof De.unref == "function" && De.unref(), Ie(Nt, function(e) {
        Ke || De.postMessage(e);
      })), typeof addEventListener < "u" && (addEventListener("pagehide", function(e) {
        if (!Se.disableBfCache && e.persisted) {
          ye && console.debug("Dexie: handling persisted pagehide"), De == null || De.close();
          for (var t = 0, n = yt.toArray(); t < n.length; t++) {
            var r = n[t];
            r.close({ disableAutoOpen: !1 });
          }
        }
      }), addEventListener("pageshow", function(e) {
        !Se.disableBfCache && e.persisted && (ye && console.debug("Dexie: handling persisted pageshow"), zn(), Un({ all: new re(-1 / 0, [[]]) }));
      }));
      function ba(e) {
        return new lt({ add: e });
      }
      function _a(e) {
        return new lt({ remove: e });
      }
      function xa(e, t) {
        return new lt({ replacePrefix: [e, t] });
      }
      k.rejectionMapper = ti, nr(ye);
      var Ea = /* @__PURE__ */ Object.freeze({
        __proto__: null,
        DEFAULT_MAX_CONNECTIONS: dr,
        Dexie: Se,
        Entity: vr,
        PropModification: lt,
        RangeSet: re,
        add: ba,
        cmp: j,
        default: Se,
        liveQuery: Lr,
        mergeRanges: gt,
        rangesOverlap: Ir,
        remove: _a,
        replacePrefix: xa
      });
      return O(Se, Ea, { default: Se }), Se;
    }));
  })(Zt)), Zt.exports;
}
var Da = Ka();
const Yn = /* @__PURE__ */ Ca(Da), Vr = Symbol.for("Dexie"), qt = globalThis[Vr] || (globalThis[Vr] = Yn);
if (Yn.semVer !== qt.semVer)
  throw new Error(`Two different versions of Dexie loaded in the same app: ${Yn.semVer} and ${qt.semVer}`);
const {
  liveQuery: Ba,
  mergeRanges: Ma,
  rangesOverlap: Fa,
  RangeSet: ja,
  cmp: Na,
  Entity: La,
  PropModification: Wa,
  replacePrefix: Va,
  add: Ua,
  remove: za,
  DexieYProvider: $a
} = qt;
class Oa extends qt {
  constructor() {
    super("StepFlowDB");
    $n(this, "workflows");
    $n(this, "steps");
    this.version(1).stores({
      workflows: "id, title, createdAt, updatedAt",
      steps: "id, order, actionType, url"
    });
  }
}
const rt = new Oa();
async function Gn(P) {
  return await rt.workflows.put(P), P.id;
}
let L = null, q = "idle", Ge = null, wt = null;
async function Pa() {
  if (q === "idle" && !L)
    try {
      const P = await chrome.storage.local.get([
        "recordingStatus",
        "activeWorkflowId",
        "activeRecordingTabId"
      ]);
      P.recordingStatus && P.recordingStatus !== "idle" && P.activeWorkflowId && (q = P.recordingStatus, Ge = P.activeRecordingTabId || null, L = await rt.workflows.get(P.activeWorkflowId) || null);
    } catch (P) {
      console.warn("Failed to restore SW state:", P);
    }
}
async function tt() {
  try {
    const P = {};
    q === "idle" || !L ? await chrome.storage.local.remove(["recordingStatus", "activeWorkflowId", "activeRecordingTabId", "stepflow_guide_sessions"]) : (P.recordingStatus = q, P.activeWorkflowId = L.id, P.activeRecordingTabId = Ge, await chrome.storage.local.set(P));
  } catch (P) {
    console.warn("Failed to persist SW state:", P);
  }
}
async function nt() {
  const P = await chrome.tabs.query({});
  for (const Q of P)
    Q.id && chrome.tabs.sendMessage(Q.id, {
      type: "RECORDING_STATUS_CHANGED",
      payload: {
        status: q,
        stepCount: L ? L.steps.length : 0,
        workflowTitle: (L == null ? void 0 : L.title) || ""
      }
    }).catch(() => {
    });
}
function Ur() {
  return "wf_" + Date.now().toString(36) + "_" + Math.random().toString(36).substring(2, 9);
}
let bt = null, zr = 0;
async function $r(P) {
  if (bt)
    try {
      return await bt;
    } catch {
    }
  const Q = Date.now() - zr;
  Q < 80 && await new Promise((me) => setTimeout(me, 80 - Q));
  const ae = async (me = 2) => {
    var O;
    try {
      let ee;
      return typeof P == "number" ? ee = await chrome.tabs.captureVisibleTab(P, { format: "png" }) : ee = await chrome.tabs.captureVisibleTab({ format: "png" }), zr = Date.now(), ee;
    } catch (ee) {
      if (me > 0 && ((O = ee == null ? void 0 : ee.message) != null && O.includes("MAX_CAPTURE_VISIBLE_TAB")))
        return await new Promise((G) => setTimeout(G, 200)), ae(me - 1);
      throw ee;
    }
  };
  return bt = ae().finally(() => {
    bt = null;
  }), bt;
}
chrome.runtime.onMessage.addListener((P, Q, ae) => ((async () => {
  var O, ee, G, Y, V, te, ge, _t, ne, we, it, fe;
  switch (await Pa(), P.type) {
    case "GET_STATUS":
      return {
        status: q,
        stepCount: L ? L.steps.length : 0,
        workflow: L
      };
    case "START_RECORDING": {
      const [M] = await chrome.tabs.query({ active: !0, currentWindow: !0 });
      if (!M || !M.id)
        throw new Error("Tidak ada tab aktif yang dapat direkam.");
      const z = M.url || "";
      if (z.startsWith("chrome://") || z.startsWith("edge://") || z.startsWith("chrome-extension://") || z.startsWith("about:") || z.startsWith("view-source:"))
        throw new Error(
          `Ekstensi tidak dapat merekam halaman internal browser (chrome:// atau edge://).
Silakan buka tab website biasa (misal: localhost:3000, google.com, atau sistem kerja Anda).`
        );
      if (Ge = M.id, q = "recording", (O = P.payload) != null && O.appendToId) {
        let N = await rt.workflows.get(P.payload.appendToId);
        if (!N)
          try {
            const he = await fetch(`https://support.kanmoemployeeportal.com/api/workflows/${P.payload.appendToId}`);
            he.ok && (N = await he.json(), N && await rt.workflows.put(N));
          } catch (he) {
            console.warn("Failed to fetch workflow from cloud to append:", he);
          }
        N && (L = N);
      }
      L || (L = {
        id: Ur(),
        title: ((ee = P.payload) == null ? void 0 : ee.title) || M.title || "New Workflow Guide",
        description: "Step-by-step tutorial automatically captured from website workflow.",
        category: ((G = P.payload) == null ? void 0 : G.category) || "General",
        createdAt: Date.now(),
        updatedAt: Date.now(),
        targetUrl: z,
        steps: []
      }), await Gn(L), await tt();
      try {
        const N = await chrome.tabs.sendMessage(Ge, { type: "PING" });
        if (!(N != null && N.pong)) throw new Error("No pong");
      } catch {
        try {
          await chrome.scripting.executeScript({
            target: { tabId: Ge },
            files: ["content.js"]
          }), await chrome.scripting.insertCSS({
            target: { tabId: Ge },
            files: ["content.css"]
          }).catch(() => {
          });
        } catch (N) {
          console.warn("Could not inject content script:", N);
        }
      }
      return await chrome.tabs.sendMessage(Ge, {
        type: "RECORDING_STATUS_CHANGED",
        payload: {
          status: q,
          stepCount: L.steps.length,
          workflowTitle: L.title
        }
      }).catch(() => {
      }), await nt(), { status: q, workflowId: L.id };
    }
    case "PAUSE_RECORDING":
      return q = "paused", await tt(), await nt(), { status: q };
    case "RESUME_RECORDING":
      return q = "recording", await tt(), await nt(), { status: q };
    case "PRE_CAPTURE": {
      if (q === "recording") {
        const M = (Y = Q.tab) == null ? void 0 : Y.windowId, z = $r(M);
        wt = {
          promise: z,
          timestamp: Date.now()
        }, z.catch(() => {
        });
      }
      return { success: !0 };
    }
    case "CAPTURE_STEP": {
      if (q !== "recording" || !L)
        return { error: "Not in recording mode" };
      try {
        let M = "";
        const z = Date.now();
        if (wt && z - wt.timestamp < 1500)
          try {
            M = await wt.promise;
          } catch {
          }
        if (wt = null, !M) {
          const Oe = (V = Q.tab) == null ? void 0 : V.windowId;
          M = await $r(Oe);
        }
        const N = P.payload, he = ((ge = (te = N.targetElement) == null ? void 0 : te.viewport) == null ? void 0 : ge.devicePixelRatio) || 1, ve = (_t = N.targetElement) == null ? void 0 : _t.rect, xt = {
          id: Ur(),
          order: L.steps.length + 1,
          actionType: N.actionType || "click",
          title: N.title || `Step ${L.steps.length + 1}`,
          description: N.description || "",
          url: N.url || ((ne = Q.tab) == null ? void 0 : ne.url) || "",
          pageTitle: N.pageTitle || ((we = Q.tab) == null ? void 0 : we.title) || "",
          targetElement: N.targetElement,
          screenshot: M,
          originalScreenshot: M,
          annotatedScreenshot: M,
          callout: { type: "none", text: "" },
          highlight: ve ? {
            x: Math.round(ve.x * he),
            y: Math.round(ve.y * he),
            width: Math.round(ve.width * he),
            height: Math.round(ve.height * he),
            color: "#FF5C35",
            style: "border"
          } : void 0
        };
        return L.steps.push(xt), L.updatedAt = Date.now(), await Gn(L), await tt(), await nt(), { success: !0, stepCount: L.steps.length };
      } catch (M) {
        return console.error("Failed to capture screenshot:", M), { error: M.message };
      }
    }
    case "STOP_RECORDING": {
      if (!L) return { error: "No active recording" };
      const M = { ...L };
      q = "idle", L = null, await tt(), await nt(), await Gn(M);
      const z = chrome.runtime.getURL(`editor.html?id=${M.id}`);
      return await chrome.tabs.create({ url: z }), { success: !0, workflowId: M.id };
    }
    case "DISCARD_RECORDING":
      return L && await rt.workflows.delete(L.id), L = null, q = "idle", await tt(), await nt(), { success: !0 };
    case "OPEN_EDITOR": {
      const M = (it = P.payload) == null ? void 0 : it.id, z = M ? chrome.runtime.getURL(`editor.html?id=${M}`) : chrome.runtime.getURL("editor.html");
      return await chrome.tabs.create({ url: z }), { success: !0 };
    }
    case "GET_WORKFLOW": {
      const M = (fe = P.payload) == null ? void 0 : fe.id;
      if (!M) return { error: "Missing workflow id" };
      let z = await rt.workflows.get(M);
      if (z) return { workflow: z };
      try {
        const N = await fetch(`https://support.kanmoemployeeportal.com/api/workflows/${M}`);
        if (N.ok)
          return z = await N.json(), { workflow: z };
      } catch (N) {
        console.warn("Could not fetch workflow from cloud API:", N);
      }
      try {
        const N = await fetch(`http://localhost:3000/api/workflows/${M}`);
        if (N.ok)
          return z = await N.json(), { workflow: z };
      } catch {
      }
      return { error: "Workflow not found" };
    }
    case "WORKFLOW_UPDATED":
      return { success: !0 };
    default:
      return { error: "Unknown message type" };
  }
})().then(ae).catch((O) => {
  ae({ error: O.message });
}), !0));
chrome.storage.onChanged.addListener(() => {
});
