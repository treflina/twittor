importScripts('js/sw-utils.js');

const STATIC_CACHE = 'static-v2';
const DYNAMIC_CACHE = 'dynamic-v1';
const INMUTABLE_CACHE = 'inmutable-v1';

const APP_SHELL = [
    "/",
    "index.html",
    "css/style.css",
    "favicon.ico",
    "img/avatars/ironman.jpg",
    "img/avatars/hulk.jpg",
    "img/avatars/spiderman.jpg",
    "img/avatars/thor.jpg",
    "img/avatars/wolverine.jpg",
    "js/app.js",
    "js/sw-utils.js",
];

const APP_SHELL_INMUTABLE = [
    "https://fonts.googleapis.com/css?family=Quicksand:300,400",
    "https://fonts.googleapis.com/css?family=Lato:400,300",
    "https://use.fontawesome.com/releases/v5.3.1/css/all.css",
    "css/animate.css",
    "js/libs/jquery.js",
];

self.addEventListener("install", (e) => {
    const cacheStatic = caches
        .open(STATIC_CACHE)
        .then((cache) => cache.addAll(APP_SHELL));

    const cacheInmutable = caches
        .open(INMUTABLE_CACHE)
        .then((cache) => cache.addAll(APP_SHELL_INMUTABLE));

    const printF = () => console.log(cacheStatic)

    e.waitUntil(Promise.all([cacheStatic, cacheInmutable, printF]));
});



self.addEventListener("activate", event => {
    const resp = caches.keys().then(keys => {
        console.log(keys);

        keys.forEach(key => {
            if (key !== STATIC_CACHE && key.includes('static')) {
                console.log("deleting");
                return caches.delete(key);
            }
        })
    })
    event.waitUntil(resp)
})

self.addEventListener("fetch", e => {
    const respuesta = caches.match(e.request).then(res => {

        if (res) {
            return res
        } else {
            return fetch(e.request).then(newRes => {
                return updateCacheDinamic(DYNAMIC_CACHE, e.request, newRes)
            })
        }

    })
    e.respondWith( respuesta);
})