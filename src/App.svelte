<script>
    import { onMount } from 'svelte'
    import { baseURL, quotes } from './constants.js'
    import { getDateToday } from './functions.js'

    export let namePiano
    export let labels = {}
    export let live = false

    console.log(labels)
    let quote = quotes[Math.floor(Math.random() * quotes.length)]
    let formComplete = false
    let partOneOfFormComplete = false

    let formData = {}
    let price = 0

    let submitButton
    let clickOnAddressError = false
    let dateReserved = []

    fetch(baseURL + '/available/' + namePiano + '/' + live)
        .then(x => x.json())
        .then(data => (dateReserved = data))

    let submit = e => {
        e.preventDefault()
        if (dateReserved.includes(date)) return

        submitButton.disabled = true

        if (!partOneOfFormComplete) {
            fetch(baseURL + '/getDistance', {
                method: 'POST',
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    formData,
                    piano: namePiano,
                    prijsperkilometer: labels.prijsperkilometer,
                    calculateDistance: !labels.gratislevering
                        .split(';')
                        .includes(formData.postcode),
                }),
            })
                .then(y => y.json())
                .then(x => {
                    price = x.price
                    submitButton.disabled = false

                    partOneOfFormComplete = true
                })
                .catch(err => {
                    throw new Error(err)
                })
        } else {
            fetch(baseURL + '/rent', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    formData,
                }),
            })
                .then(x => {
                    if (x.status === 200) {
                        submitButton.disabled = false
                        formComplete = true

                        fetch(baseURL + '/mail', {
                            method: 'POST',
                            headers: {
                                Accept: 'application/json',
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                firstname,
                                piano: namePiano,
                                lastname,
                                email,
                                date,
                                address,
                                telephone,
                                message,
                            }),
                        })
                    }
                })
                .catch(err => {
                    throw new Error(err)
                })
        }
    }
</script>

<style>
    .piano-name {
        font-weight: 100;
    }
    .input-row {
        display: flex;
        justify-content: space-between;
    }
    .input-wrap {
        width: 47%;
    }
    .input-wrap.big {
        width: 67%;
    }
    .input-wrap.small {
        width: 27%;
    }
    .input-row > .input-wrap:first-of-type {
        margin-right: 6%;
    }
    .text-area-wrap {
        width: 100%;
    }
    textarea {
        width: 100%;
        height: 150px;
    }

    h4 {
        text-transform: uppercase;
        color: var(--colour-gold);
        font-family: 'Open Sans', sans-serif;
        font-weight: 100;
    }

    .warning {
        background: lightcoral;
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100%;
        text-align: center;
    }

    .date-input {
        position: relative;
    }
</style>

<div class="container">
    <header>
        <h2>
            {labels.title || 'Rent the'}
            <span class="piano-name">{namePiano.replace('-', ' ')}</span>
        </h2>
        <h4>
            {@html formComplete ? labels.summary || 'Summary' : labels.subtitle || 'FILL IN THIS FORM TO GET AN APPROXIMATION OF THE PRICE'}
        </h4>
    </header>

    {#if !formComplete}
        <main>
            <p class="mb-3">
                {labels.intro || `Avoid unnecessary risk and let Quatre Mains handle transportation of your
      precious piano. With utmost care we will transport your piano and if you
      wish tune it at destination.`}
            </p>

            <form on:submit={submit}>
                <h5>{labels.clientinformation || 'Client information'}</h5>
                <div class="input-row">
                    <div class="input-wrap">
                        <label for="firstname">
                            {labels.firstname || 'First name'}
                            <span>*</span>
                        </label>
                        <input
                            bind:value={formData.firstname}
                            name="firstname"
                            type="text"
                            id="firstname"
                            required />
                    </div>

                    <div class="input-wrap">
                        <label for="lastname">
                            {labels.lastname || 'Last name'}
                            <span>*</span>
                        </label>
                        <input
                            bind:value={formData.lastname}
                            name="lastname"
                            type="text"
                            id="lastname"
                            required />
                    </div>
                </div>

                <div class="input-row">

                    <div class="input-wrap">
                        <label for="email">
                            {labels.email || 'Email'}
                            <span>*</span>
                        </label>
                        <input
                            bind:value={formData.email}
                            name="email"
                            type="email"
                            id="email"
                            required />
                    </div>
                </div>

                <h5>{labels.eventinformation || 'Event information'}</h5>
                <div class="input-row">
                    <div class="input-wrap date-input">
                        <label for="date">
                            {labels.date || 'Date'}
                            <span>*</span>
                        </label>
                        <input
                            bind:value={formData.date}
                            name="date"
                            type="date"
                            id="date"
                            min={getDateToday()}
                            required />
                        {#if dateReserved.includes(formData.date)}
                            <span class="warning">
                                {labels.unavailable || 'Piano not available on this date'}
                            </span>
                        {/if}
                    </div>
                </div>

                <div class="input-row">
                    <div class="input-wrap big">
                        <label for="street">
                            {labels.street || 'Street'}
                            <span>*</span>
                        </label>
                        <input
                            bind:value={formData.street}
                            name="street"
                            type="text"
                            id="street"
                            required />

                    </div>
                    <div class="input-wrap small">
                        <label for="number">
                            {labels.number || 'Number'}
                            <span>*</span>
                        </label>
                        <input
                            bind:value={formData.number}
                            name="number"
                            type="text"
                            id="number"
                            required />

                    </div>
                </div>
                <div class="input-row">
                    <div class="input-wrap small">
                        <label for="postcode">
                            {labels.postcode || 'Postcode'}
                            <span>*</span>
                        </label>
                        <input
                            bind:value={formData.postcode}
                            name="postcode"
                            type="text"
                            id="postcode"
                            required />

                    </div>
                    <div class="input-wrap big">
                        <label for="city">
                            {labels.city || 'City'}
                            <span>*</span>
                        </label>
                        <input
                            bind:value={formData.city}
                            name="city"
                            type="text"
                            id="city"
                            required />

                    </div>
                </div>
                {#if price}
                    <span class="price">
                        <span>{Math.ceil(price)}</span>
                        <span class="price-excl">
                            {Math.ceil(price * 1.21)} incl.)
                        </span>
                    </span>
                {/if}

                {#if partOneOfFormComplete}
                    <h4>
                        {labels.fillindetails || 'Fill in the rest of these details to rent the instrument.'}
                    </h4>

                    <div class="input-row">
                        <div class="input-wrap">
                            <label for="telephone">
                                {labels.telephone || 'Telephone'}
                                <span>*</span>
                            </label>
                            <input
                                bind:value={formData.telephone}
                                name="telephone"
                                type="telephone"
                                id="telephone"
                                required />
                        </div>

                    </div>

                    <div class="input-row">
                        <div class="text-area-wrap">
                            <label for="message">
                                {labels.message || 'Message'}
                                <span>*</span>
                            </label>
                            <textarea
                                bind:value={formData.message}
                                id="message"
                                name="message" />
                        </div>

                    </div>
                {/if}

                <div class="button-wrap">
                    <button
                        bind:this={submitButton}
                        class={dateReserved.includes(formData.date) ? 'disabled' : ''}
                        type="submit"
                        id="calculate-button">
                        {partOneOfFormComplete ? labels.rent || 'Rent' : labels.calculate || 'Calculate'}
                    </button>
                    <!-- {#if partOneOfFormComplete}
                        <button type="button" class="secondary-btn">
                            {labels.cancel || 'Cancel'}
                        </button>
                    {/if} -->
                </div>
            </form>

        </main>
    {/if}
    {#if formComplete}
        <main>
            <ul>
                <li>{namePiano}</li>
                <li>{formData.date}</li>
            </ul>

        </main>
        <footer>
            <div>
                <p>{quote.q}</p>
                <span class="quote-author">{quote.a}</span>
            </div>
        </footer>
    {/if}

    <div class="disclaimer">
        {@html labels.disclaimer}
    </div>

</div>
