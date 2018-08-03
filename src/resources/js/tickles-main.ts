/*

MIT License

Copyright (c) 2018 Danny Sofftie

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

*/

(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
        // @ts-ignore
        typeof define === 'function' && define.amd ? define(factory) :
            // @ts-ignore
            global.Tickles = factory()
}(window, (function () {

    function Tickles() {
        this.k = '/api/v1/cnb/publisher' // endpoint to notify server of a new visitor to a publisher site
        this.b = window.location.hostname.includes('127.0.0.1') ? 'http://127.0.0.1:5000' : 'https://adxserver.herokuapp.com'
        this.u = this.b + this.k

        return this
    }

    /*
     * Notifies ad server of a new publisher instance,
     * Ad server builds a publisher session, which is reused on subsequent requests from this visitor's ip address
     * A publisher session is created, and specific visitor details are collected to efficiently optimize ads that will
     * be served on subsequent requests referring to current publisher session.
     */
    Tickles.prototype.init = function (_e: string) {
        if (typeof _e == 'undefined')
            throw new Error('Tickles Error: requires an id of reference element!')
        let r = document.getElementById(_e)
        this.z = r
        this.request().then(d => {
            this.m = d
            this.place()
        })
    }

    Tickles.prototype.request = function () {
        let that = this
        return new Promise(function (resolve, reject) {
            let i: XMLHttpRequest = new XMLHttpRequest()
            i.open('GET', that.u, true)
            i.setRequestHeader('Cache-Control', 'no-cache')
            i.withCredentials = true
            i.addEventListener('readystatechange', function (_e) {
                if (this.status != 200)
                    reject({ e: this.statusText })
                if (this.status == 200 && this.readyState == 4)
                    resolve(JSON.parse(this.responseText))
            })
            i.send(null)
        })
    }

    Tickles.prototype.metadata = function () {
        return ({
            'original-url': window.location.hostname,
            'page-title': document.title,
            'page-visited': window.location.pathname
        })
    }

    Tickles.prototype.visible = function (elem: HTMLElement) {
        let rect = elem.getBoundingClientRect()
        return rect.bottom > 0 &&
            rect.right > 0 &&
            rect.left < (window.innerWidth
                || document.documentElement.clientWidth) &&
            rect.top < (window.innerHeight
                || document.documentElement.clientHeight)
    }

    Tickles.prototype.place = function () {
        const cookies = {
            ...this.metadata()
        }
        for (let v in cookies) {
            document.cookie = `${v}=${cookies[v]};`
        }

        this.z.innerHTML = `<iframe src="${this.b}/static/html/index.html" height=${this.z.style.height} width=${this.z.style.width} frameborder="0"></iframe>`
    }

    return Tickles
})))