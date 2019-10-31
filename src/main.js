// polyfills
import 'whatwg-fetch'
import 'url-search-params-polyfill'

import App from './App.svelte'
import { baseURL } from './constants.js'

const searchParams = new URLSearchParams(window.location.search)
const namePiano = searchParams.get('piano') || ''
const language = searchParams.get('language') || 'NL'
//const live = searchParams.get('live') || 'false'
fetch(baseURL + '/labels/' + language)
    .then(x => x.json())
    .then(labels => {
        new App({
            target: document.body,
            props: {
                namePiano,
                labels,
                language,
            },
        })
    })
    .catch(err => {
        // eslint-disable-next-line no-console
        console.error(err)
        throw Error(err)
    })
