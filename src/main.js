// polyfills
import 'whatwg-fetch'
import 'url-search-params-polyfill'

import App from './App.svelte'
import { baseURL } from './constants.js'

const searchParams = new URLSearchParams(window.location.search)
const namePiano = searchParams.get('piano') || 'yamaha-cfx'
const language = searchParams.get('language')
fetch(baseURL + '/labels/' + language)
    .then(x => x.json())
    .then(labels => {
        new App({
            target: document.body,
            props: {
                namePiano,
                labels,
            },
        })
    })
    .catch(err => {
        // eslint-disable-next-line no-console
        console.error(err)
        throw Error(err)
    })
