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

function q(url: string) {
    return new Promise(function (resolve, reject) {
        let i: XMLHttpRequest = new XMLHttpRequest()
        i.open('GET', url, true)
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

function f(s: string | Array<string>, a?: string) {
    // @ts-ignore
    let c = decodeURIComponent(s),
        d: string | Array<string>, e: object = {}

    if (c.indexOf(';') != -1) d = c.split(';')
    else d = c
    if (typeof d == 'string')
        e[d.split('=')[0]] = d.split('=')[1]
    else
        d.map(p => e[p.split('=')[0]] = p.split('=')[1])

    if (typeof a != 'undefined')
        return e[a]
    return e
}

const h = window.location.origin.includes('127.0.0.1') ?
    'http://127.0.0.1:5000' : 'https://adxserver.herokuapp.com',
    height: number = document.body.clientHeight,
    width: number = document.body.clientWidth

document.addEventListener('DOMContentLoaded', async function () {

    let adData = await q(h + '/api/v1/cnb/addata?height=' + height + '&width=' + width)

    console.log(adData)

    document.body.addEventListener('click', async function (e) {
        let addata = await q(h + '/api/v1/impression/click')
    })

    document.querySelector('.close').addEventListener('click', function () {
        document.body.style.opacity = '0'

    })
    // determine the size of the window innerHeight to control ad image size that is requested from server

})