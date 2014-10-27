//!function(a,b){"object"==typeof exports?module.exports=b():"function"==typeof define&&define.amd?define(b):a.Spinner=b()}(this,function(){"use strict";function a(a,b){var c,d=document.createElement(a||"div");for(c in b)d[c]=b[c];return d}function b(a){for(var b=1,c=arguments.length;c>b;b++)a.appendChild(arguments[b]);return a}function c(a,b,c,d){var e=["opacity",b,~~(100*a),c,d].join("-"),f=.01+c/d*100,g=Math.max(1-(1-a)/b*(100-f),a),h=j.substring(0,j.indexOf("Animation")).toLowerCase(),i=h&&"-"+h+"-"||"";return l[e]||(m.insertRule("@"+i+"keyframes "+e+"{0%{opacity:"+g+"}"+f+"%{opacity:"+a+"}"+(f+.01)+"%{opacity:1}"+(f+b)%100+"%{opacity:"+a+"}100%{opacity:"+g+"}}",m.cssRules.length),l[e]=1),e}function d(a,b){var c,d,e=a.style;for(b=b.charAt(0).toUpperCase()+b.slice(1),d=0;d<k.length;d++)if(c=k[d]+b,void 0!==e[c])return c;return void 0!==e[b]?b:void 0}function e(a,b){for(var c in b)a.style[d(a,c)||c]=b[c];return a}function f(a){for(var b=1;b<arguments.length;b++){var c=arguments[b];for(var d in c)void 0===a[d]&&(a[d]=c[d])}return a}function g(a,b){return"string"==typeof a?a:a[b%a.length]}function h(a){this.opts=f(a||{},h.defaults,n)}function i(){function c(b,c){return a("<"+b+' xmlns="urn:schemas-microsoft.com:vml" class="spin-vml">',c)}m.addRule(".spin-vml","behavior:url(#default#VML)"),h.prototype.lines=function(a,d){function f(){return e(c("group",{coordsize:k+" "+k,coordorigin:-j+" "+-j}),{width:k,height:k})}function h(a,h,i){b(m,b(e(f(),{rotation:360/d.lines*a+"deg",left:~~h}),b(e(c("roundrect",{arcsize:d.corners}),{width:j,height:d.width,left:d.radius,top:-d.width>>1,filter:i}),c("fill",{color:g(d.color,a),opacity:d.opacity}),c("stroke",{opacity:0}))))}var i,j=d.length+d.width,k=2*j,l=2*-(d.width+d.length)+"px",m=e(f(),{position:"absolute",top:l,left:l});if(d.shadow)for(i=1;i<=d.lines;i++)h(i,-2,"progid:DXImageTransform.Microsoft.Blur(pixelradius=2,makeshadow=1,shadowopacity=.3)");for(i=1;i<=d.lines;i++)h(i);return b(a,m)},h.prototype.opacity=function(a,b,c,d){var e=a.firstChild;d=d.shadow&&d.lines||0,e&&b+d<e.childNodes.length&&(e=e.childNodes[b+d],e=e&&e.firstChild,e=e&&e.firstChild,e&&(e.opacity=c))}}var j,k=["webkit","Moz","ms","O"],l={},m=function(){var c=a("style",{type:"text/css"});return b(document.getElementsByTagName("head")[0],c),c.sheet||c.styleSheet}(),n={lines:12,length:7,width:5,radius:10,rotate:0,corners:1,color:"#000",direction:1,speed:1,trail:100,opacity:.25,fps:20,zIndex:2e9,className:"spinner",top:"50%",left:"50%",position:"absolute"};h.defaults={},f(h.prototype,{spin:function(b){this.stop();{var c=this,d=c.opts,f=c.el=e(a(0,{className:d.className}),{position:d.position,width:0,zIndex:d.zIndex});d.radius+d.length+d.width}if(e(f,{left:d.left,top:d.top}),b&&b.insertBefore(f,b.firstChild||null),f.setAttribute("role","progressbar"),c.lines(f,c.opts),!j){var g,h=0,i=(d.lines-1)*(1-d.direction)/2,k=d.fps,l=k/d.speed,m=(1-d.opacity)/(l*d.trail/100),n=l/d.lines;!function o(){h++;for(var a=0;a<d.lines;a++)g=Math.max(1-(h+(d.lines-a)*n)%l*m,d.opacity),c.opacity(f,a*d.direction+i,g,d);c.timeout=c.el&&setTimeout(o,~~(1e3/k))}()}return c},stop:function(){var a=this.el;return a&&(clearTimeout(this.timeout),a.parentNode&&a.parentNode.removeChild(a),this.el=void 0),this},lines:function(d,f){function h(b,c){return e(a(),{position:"absolute",width:f.length+f.width+"px",height:f.width+"px",background:b,boxShadow:c,transformOrigin:"left",transform:"rotate("+~~(360/f.lines*k+f.rotate)+"deg) translate("+f.radius+"px,0)",borderRadius:(f.corners*f.width>>1)+"px"})}for(var i,k=0,l=(f.lines-1)*(1-f.direction)/2;k<f.lines;k++)i=e(a(),{position:"absolute",top:1+~(f.width/2)+"px",transform:f.hwaccel?"translate3d(0,0,0)":"",opacity:f.opacity,animation:j&&c(f.opacity,f.trail,l+k*f.direction,f.lines)+" "+1/f.speed+"s linear infinite"}),f.shadow&&b(i,e(h("#000","0 0 4px #000"),{top:"2px"})),b(d,b(i,h(g(f.color,k),"0 0 1px rgba(0,0,0,.1)")));return d},opacity:function(a,b,c){b<a.childNodes.length&&(a.childNodes[b].style.opacity=c)}});var o=e(a("group"),{behavior:"url(#default#VML)"});return!d(o,"transform")&&o.adj?i():j=d(o,"animation"),h});
/**
 * Copyright (c) 2011-2014 Felix Gnass
 * Licensed under the MIT license
 */
(function(root, factory) {

    /* CommonJS */
    if (typeof exports == 'object')  module.exports = factory()

    /* AMD module */
    else if (typeof define == 'function' && define.amd) define(factory)

    /* Browser global */
    else root.Spinner = factory()
}
(this, function() {
    "use strict";

    var prefixes = ['webkit', 'Moz', 'ms', 'O'] /* Vendor prefixes */
        , animations = {} /* Animation rules keyed by their name */
        , useCssAnimations /* Whether to use CSS animations or setTimeout */

    /**
     * Utility function to create elements. If no tag name is given,
     * a DIV is created. Optionally properties can be passed.
     */
    function createEl(tag, prop) {
        var el = document.createElement(tag || 'div')
            , n

        for(n in prop) el[n] = prop[n]
        return el
    }

    /**
     * Appends children and returns the parent.
     */
    function ins(parent /* child1, child2, ...*/) {
        for (var i=1, n=arguments.length; i<n; i++)
            parent.appendChild(arguments[i])

        return parent
    }

    /**
     * Insert a new stylesheet to hold the @keyframe or VML rules.
     */
    var sheet = (function() {
        var el = createEl('style', {type : 'text/css'})
        ins(document.getElementsByTagName('head')[0], el)
        return el.sheet || el.styleSheet
    }())

    /**
     * Creates an opacity keyframe animation rule and returns its name.
     * Since most mobile Webkits have timing issues with animation-delay,
     * we create separate rules for each line/segment.
     */
    function addAnimation(alpha, trail, i, lines) {
        var name = ['opacity', trail, ~~(alpha*100), i, lines].join('-')
            , start = 0.01 + i/lines * 100
            , z = Math.max(1 - (1-alpha) / trail * (100-start), alpha)
            , prefix = useCssAnimations.substring(0, useCssAnimations.indexOf('Animation')).toLowerCase()
            , pre = prefix && '-' + prefix + '-' || ''

        if (!animations[name]) {
            sheet.insertRule(
                    '@' + pre + 'keyframes ' + name + '{' +
                    '0%{opacity:' + z + '}' +
                    start + '%{opacity:' + alpha + '}' +
                    (start+0.01) + '%{opacity:1}' +
                    (start+trail) % 100 + '%{opacity:' + alpha + '}' +
                    '100%{opacity:' + z + '}' +
                    '}', sheet.cssRules.length)

            animations[name] = 1
        }

        return name
    }

    /**
     * Tries various vendor prefixes and returns the first supported property.
     */
    function vendor(el, prop) {
        var s = el.style
            , pp
            , i

        prop = prop.charAt(0).toUpperCase() + prop.slice(1)
        for(i=0; i<prefixes.length; i++) {
            pp = prefixes[i]+prop
            if(s[pp] !== undefined) return pp
        }
        if(s[prop] !== undefined) return prop
    }

    /**
     * Sets multiple style properties at once.
     */
    function css(el, prop) {
        for (var n in prop)
            el.style[vendor(el, n)||n] = prop[n]

        return el
    }

    /**
     * Fills in default values.
     */
    function merge(obj) {
        for (var i=1; i < arguments.length; i++) {
            var def = arguments[i]
            for (var n in def)
                if (obj[n] === undefined) obj[n] = def[n]
        }
        return obj
    }

    /**
     * Returns the absolute page-offset of the given element.
     */
    function pos(el) {
        var o = { x:el.offsetLeft, y:el.offsetTop }
        while((el = el.offsetParent))
            o.x+=el.offsetLeft, o.y+=el.offsetTop

        return o
    }

    /**
     * Returns the line color from the given string or array.
     */
    function getColor(color, idx) {
        return typeof color == 'string' ? color : color[idx % color.length]
    }

    // Built-in defaults

    var defaults = {
        lines: 12,            // The number of lines to draw
        length: 7,            // The length of each line
        width: 5,             // The line thickness
        radius: 10,           // The radius of the inner circle
        rotate: 0,            // Rotation offset
        corners: 1,           // Roundness (0..1)
        color: '#000',        // #rgb or #rrggbb
        direction: 1,         // 1: clockwise, -1: counterclockwise
        speed: 1,             // Rounds per second
        trail: 100,           // Afterglow percentage
        opacity: 1/4,         // Opacity of the lines
        fps: 20,              // Frames per second when using setTimeout()
        zIndex: 2e9,          // Use a high z-index by default
        className: 'spinner', // CSS class to assign to the element
        top: '50%',           // center vertically
        left: '50%',          // center horizontally
        position: 'absolute'  // element position
    }

    /** The constructor */
    function Spinner(o) {
        this.opts = merge(o || {}, Spinner.defaults, defaults)
    }

    // Global defaults that override the built-ins:
    Spinner.defaults = {}

    merge(Spinner.prototype, {

        /**
         * Adds the spinner to the given target element. If this instance is already
         * spinning, it is automatically removed from its previous target b calling
         * stop() internally.
         */
        spin: function(target) {
            this.stop()

            var self = this
                , o = self.opts
                , el = self.el = css(createEl(0, {className: o.className}), {position: o.position, width: 0, zIndex: o.zIndex})
                , mid = o.radius+o.length+o.width

            css(el, {
                left: o.left,
                top: o.top
            })

            if (target) {
                target.insertBefore(el, target.firstChild||null)
            }

            el.setAttribute('role', 'progressbar')
            self.lines(el, self.opts)

            if (!useCssAnimations) {
                // No CSS animation support, use setTimeout() instead
                var i = 0
                    , start = (o.lines - 1) * (1 - o.direction) / 2
                    , alpha
                    , fps = o.fps
                    , f = fps/o.speed
                    , ostep = (1-o.opacity) / (f*o.trail / 100)
                    , astep = f/o.lines

                    ;(function anim() {
                    i++;
                    for (var j = 0; j < o.lines; j++) {
                        alpha = Math.max(1 - (i + (o.lines - j) * astep) % f * ostep, o.opacity)

                        self.opacity(el, j * o.direction + start, alpha, o)
                    }
                    self.timeout = self.el && setTimeout(anim, ~~(1000/fps))
                })()
            }
            return self
        },

        /**
         * Stops and removes the Spinner.
         */
        stop: function() {
            var el = this.el
            if (el) {
                clearTimeout(this.timeout)
                if (el.parentNode) el.parentNode.removeChild(el)
                this.el = undefined
            }
            return this
        },

        /**
         * Internal method that draws the individual lines. Will be overwritten
         * in VML fallback mode below.
         */
        lines: function(el, o) {
            var i = 0
                , start = (o.lines - 1) * (1 - o.direction) / 2
                , seg

            function fill(color, shadow) {
                return css(createEl(), {
                    position: 'absolute',
                    width: (o.length+o.width) + 'px',
                    height: o.width + 'px',
                    background: color,
                    boxShadow: shadow,
                    transformOrigin: 'left',
                    transform: 'rotate(' + ~~(360/o.lines*i+o.rotate) + 'deg) translate(' + o.radius+'px' +',0)',
                    borderRadius: (o.corners * o.width>>1) + 'px'
                })
            }

            for (; i < o.lines; i++) {
                seg = css(createEl(), {
                    position: 'absolute',
                    top: 1+~(o.width/2) + 'px',
                    transform: o.hwaccel ? 'translate3d(0,0,0)' : '',
                    opacity: o.opacity,
                    animation: useCssAnimations && addAnimation(o.opacity, o.trail, start + i * o.direction, o.lines) + ' ' + 1/o.speed + 's linear infinite'
                })

                if (o.shadow) ins(seg, css(fill('#000', '0 0 4px ' + '#000'), {top: 2+'px'}))
                ins(el, ins(seg, fill(getColor(o.color, i), '0 0 1px rgba(0,0,0,.1)')))
            }
            return el
        },

        /**
         * Internal method that adjusts the opacity of a single line.
         * Will be overwritten in VML fallback mode below.
         */
        opacity: function(el, i, val) {
            if (i < el.childNodes.length) el.childNodes[i].style.opacity = val
        }

    })


    function initVML() {

        /* Utility function to create a VML tag */
        function vml(tag, attr) {
            return createEl('<' + tag + ' xmlns="urn:schemas-microsoft.com:vml" class="spin-vml">', attr)
        }

        // No CSS transforms but VML support, add a CSS rule for VML elements:
        sheet.addRule('.spin-vml', 'behavior:url(#default#VML)')

        Spinner.prototype.lines = function(el, o) {
            var r = o.length+o.width
                , s = 2*r

            function grp() {
                return css(
                    vml('group', {
                        coordsize: s + ' ' + s,
                        coordorigin: -r + ' ' + -r
                    }),
                    { width: s, height: s }
                )
            }

            var margin = -(o.width+o.length)*2 + 'px'
                , g = css(grp(), {position: 'absolute', top: margin, left: margin})
                , i

            function seg(i, dx, filter) {
                ins(g,
                    ins(css(grp(), {rotation: 360 / o.lines * i + 'deg', left: ~~dx}),
                        ins(css(vml('roundrect', {arcsize: o.corners}), {
                                width: r,
                                height: o.width,
                                left: o.radius,
                                top: -o.width>>1,
                                filter: filter
                            }),
                            vml('fill', {color: getColor(o.color, i), opacity: o.opacity}),
                            vml('stroke', {opacity: 0}) // transparent stroke to fix color bleeding upon opacity change
                        )
                    )
                )
            }

            if (o.shadow)
                for (i = 1; i <= o.lines; i++)
                    seg(i, -2, 'progid:DXImageTransform.Microsoft.Blur(pixelradius=2,makeshadow=1,shadowopacity=.3)')

            for (i = 1; i <= o.lines; i++) seg(i)
            return ins(el, g)
        }

        Spinner.prototype.opacity = function(el, i, val, o) {
            var c = el.firstChild
            o = o.shadow && o.lines || 0
            if (c && i+o < c.childNodes.length) {
                c = c.childNodes[i+o]; c = c && c.firstChild; c = c && c.firstChild
                if (c) c.opacity = val
            }
        }
    }

    var probe = css(createEl('group'), {behavior: 'url(#default#VML)'})

    if (!vendor(probe, 'transform') && probe.adj) initVML()
    else useCssAnimations = vendor(probe, 'animation')

    return Spinner

}));