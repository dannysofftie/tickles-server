"use strict";
;
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
        // @ts-ignore
        typeof define === 'function' && define.amd ? define(factory) :
            // @ts-ignore
            global.Tickles = factory();
}(window, (function () {
    function Tickles() {
        this.k = '/api/v1/cnb/publisher';
        this.b = window.location.hostname.includes('127.0.0.1') ?
            'http://127.0.0.1:5000' :
            'https://adxserver.herokuapp.com';
        this.s = '/srv/ads';
        this.u = this.b + this.k;
        return this;
    }
    /**
     * Ad space generator
     */
    Tickles.prototype.init = function (_e) {
        if (typeof _e == 'undefined')
            throw new Error('Tickles Error: requires an id of reference element!');
        let r = document.getElementById(_e);
        this.z = r;
        this.request().then(d => {
            this.m = d;
            this.place();
        });
    };
    Tickles.prototype.request = function () {
        let that = this;
        return new Promise(function (resolve, reject) {
            let i = new XMLHttpRequest();
            i.open('GET', that.u, true);
            i.setRequestHeader('Cache-Control', 'no-cache');
            i.withCredentials = true;
            i.addEventListener('readystatechange', function (_e) {
                if (this.status != 200)
                    reject({ e: this.statusText });
                if (this.status == 200 && this.readyState == 4)
                    resolve(JSON.parse(this.responseText));
            });
            i.send(null);
        });
    };
    Tickles.prototype.metadata = function () {
        return ({
            'page-title': document.title,
            'page-visited': window.location.pathname
        });
    };
    Tickles.prototype.visible = function (elem) {
        let rect = elem.getBoundingClientRect();
        return rect.bottom > 0 &&
            rect.right > 0 &&
            rect.left < (window.innerWidth
                || document.documentElement.clientWidth) &&
            rect.top < (window.innerHeight
                || document.documentElement.clientHeight);
    };
    Tickles.prototype.place = function () {
        /*
            adCampaignCategory
            adDescription
            adDestinationUrl
            adDisplayImage
            adName
            adSelectedType
            adTitle
            adValidationTime
            adVerificationStatus
            advertiserReference
            id : "5b4902e437456e21c93da043"
        */
        document.cookie = 'name={67890342rhnfm8hxw3:"rftgbyhnjmefdfbhi"};';
        let url = `${this.b + this.s}/click/${window.location.host.split('/')[0]}/${new Date().toISOString()}/${this.m.id}/${this.m.adDestinationUrl}`;
        this.z.innerHTML = `<iframe src="http://127.0.0.1:5000/static/html/index.html" height=${this.z.style.height} width=${this.z.style.width} frameborder="0"></iframe>`;
    };
    return Tickles;
})));
