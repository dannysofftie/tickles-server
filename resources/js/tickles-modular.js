"use strict";
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
const host = window.location.origin.includes('127.0.0.3') ?
    'http://127.0.0.1:5000' : 'https://adxserver.herokuapp.com', height = document.body.clientHeight, width = document.body.clientWidth;
function q(url) {
    return new Promise(function (resolve, reject) {
        let i = new XMLHttpRequest();
        i.open('GET', url, true);
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
}
function f(s, a) {
    // @ts-ignore
    let c = decodeURIComponent(s), d, e = {};
    if (c.indexOf(';') != -1)
        d = c.split(';');
    else
        d = c;
    if (typeof d == 'string')
        e[d.split('=')[0]] = d.split('=')[1];
    else
        d.map(p => e[p.split('=')[0]] = p.split('=')[1]);
    if (typeof a != 'undefined')
        return e[a];
    return e;
}
function v(elem) {
    let rect = elem.getBoundingClientRect();
    return rect.bottom > 0 && rect.right > 0 &&
        rect.left < (window.innerWidth || document.documentElement.clientWidth) &&
        rect.top < (window.innerHeight || document.documentElement.clientHeight);
}
function r() {
    let k = Math.floor(Math.random() * 30);
    return k > 20 && k < 30 ? k : r();
}
function notify(elem, sessionId) {
    let cn = 0;
    setInterval(() => { z(); }, 2000);
    function z() {
        if (v(elem)) {
            cn += 2;
        }
        if (cn >= r()) {
            cn = 0;
            l(true, sessionId);
        }
    }
}
async function l(view, visSession) {
    let adDataUrl = host + '/api/v1/cnb/addata?height=' + height + '&width=' + width;
    if (typeof view != 'undefined') {
        adDataUrl += '&impression=view&visitorSessionId=' + visSession;
    }
    document.querySelector('div.preloader').style.display = 'flex';
    let adData = await q(adDataUrl), parent = document.querySelector('div.ad-elements'), mdiClass = ['mdi-loading', 'mdi-chevron-double-right', 'mdi-history'];
    let container = `<a href="${host + '/tickles/ads/impression/click/' + adData['visitorInstanceId'] + '/'
        + adData['adDestinationUrl'] + '/' + adData['advertiserReference']}" data-click="click" target="_blank" class="ad-parent-section animated fadeInDown">`;
    if (adData['adSelectedType'] == 'image') {
        // build ad data with image
    }
    else if (adData['adSelectedType'] == 'text') {
        // build ad data with text display only
    }
    if (adData['adDisplayImage'] != 'null') {
        container += `<div class="display-image">
                        <img src="${adData['adDisplayImage']}">
                    </div>`;
    }
    container += `<div class="ad-name"> <p> ${adData['adName']} <br>  <small>${adData['adTitle']}</small> </p> </div>`;
    container += `<div class="description-text">
                    <p>${adData['adDescription']}</p>
                </div>`;
    container += `<div class="instructions">
                    <button class="feature-button" style="background-color: ${adData['preferredTheme']}">${adData['displayText']} &nbsp;
                        <span class="mdi ${mdiClass[Math.floor(Math.random() * mdiClass.length)]} animated flash"></span>
                    </button>
                  </div>`;
    container += `</a>`;
    parent.innerHTML = container;
    let target = document.querySelector('a.ad-parent-section');
    target.addEventListener('click', async function (e) {
        if (this.getAttribute('data-click') != 'click') {
            e.preventDefault();
        }
    });
    setTimeout(() => {
        document.querySelector('div.preloader').style.display = 'none';
        if (adData['adName'] != undefined)
            notify(target, adData['visitorInstanceId']);
    }, 400);
}
document.addEventListener('DOMContentLoaded', async function () {
    l();
    document.querySelector('.close').addEventListener('click', function () {
        document.body.style.opacity = '0';
    });
});
