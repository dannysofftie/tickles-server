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
        this.k = '/api/v1/cnb/publisher'
        this.b = window.location.hostname.includes('127.0.0.2') ? 'http://127.0.0.1:5000' : 'https://adxserver.herokuapp.com'
        this.u = this.b + this.k
        return this
    }

    Tickles.prototype.init = async function (_e: string) {
        if (typeof _e == 'undefined')
            throw new Error('Tickles Error: requires an id of reference element!')
        if (typeof _e != 'string')
            throw new Error('Element id must be of type string')
        let r = document.getElementById(_e)
        this.z = r
        let width = parseInt((this.z.style.width).toString()),
            height = parseInt((this.z.style.height).toString())

        if ((width == 800 && height != 120) || (width != 800 && height == 120)) {
            console.error(`Wrong css declarations for element with id "${_e}", expects 800 x 120`)
            return false
        }
        else if ((width == 120 && height != 540) || (width != 120 && height == 540)) {
            console.error(`Wrong css declarations for element with id "${_e}", expects 120 x 540`)
            return false
        }
        else if ((width != 120 || height != 540) && (width != 800 || height != 120)) {
            console.error(`Wrong css declarations for element with id "${_e}", expects 120 x 540 or 800 x 120`)
            return false
        }
        else
            return await this.request().then(d => {
                this.m = d
                this.place()
            })
    }

    Tickles.prototype.request = function () {
        let self = this
        return new Promise(function (resolve, reject) {
            let i: XMLHttpRequest = new XMLHttpRequest()
            i.open('GET', self.u, true)
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
            'original-url': window.location.hostname.includes('127.0.0.1') ?
                window.location.hostname + ':' + window.location.port : window.location.hostname,
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
        const c = {
            ...this.metadata()
        }
        for (let v in c) {
            document.cookie = `${v}=${c[v]};`
        }

        this.z.innerHTML = `<iframe src="${this.b}/static/html/index.html" height=${this.z.style.height} width=${this.z.style.width} frameborder="0"></iframe>`
    }

    return Tickles
})))