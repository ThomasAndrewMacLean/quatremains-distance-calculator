// polyfills
import 'whatwg-fetch'
import 'url-search-params-polyfill'

import App from './App.svelte'
import { baseURL } from './constants.js'

const searchParams = new URLSearchParams(window.location.search)
const namePiano = searchParams.get('piano') || 'yamaha-S3X'
const language = searchParams.get('language') || 'NL'
const live = searchParams.get('live') || 'false'
fetch(baseURL + '/labels/' + language + '/' + live)
    .then(x => x.json())
    .then(labels => {
        new App({
            target: document.body,
            props: {
                namePiano,
                labels,
                live,
            },
        })
    })
    .catch(err => {
        new App({
            target: document.body,
            props: {
                namePiano,

                live,
            },
        })
        // eslint-disable-next-line no-console
        console.error(err)
        throw Error(err)
    })
