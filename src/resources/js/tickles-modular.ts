function adRequest(url: string) {
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
    'http://127.0.0.1:5000/srv/cnb/impression' : 'https://adxserver.herokuapp.com/'

document.addEventListener('DOMContentLoaded', function () {
    document.body.addEventListener('click', function (e) {
        console.log(e.x, e.y, document.cookie, window.innerHeight)
    })
    document.querySelector('.close').addEventListener('click', function () {
        document.body.style.opacity = '0'
    })
    // determine the size of the window innerHeight to control ad image size that is requested from server

})