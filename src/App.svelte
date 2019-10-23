<script>
    import { onMount } from 'svelte'
    import { baseURL, quotes } from './constants.js'

    export let namePiano
    export let labels = {}
    let quote = quotes[Math.floor(Math.random() * quotes.length)]
    let formComplete = false
    let partOneOfFormComplete = false
    let firstname = ''
    let lastname = ''
    let email = ''
    let date
    let address = ''
    let price = 0
    let autoComplete
    let autoCompleteInput
    let submitButton
    let clickOnAddressError = false
    let dateReserved = []

    fetch(baseURL + '/available/' + namePiano)
        .then(x => x.json())
        .then(data => (dateReserved = data))

    onMount(() => {
        if (autoCompleteInput) {
            autoComplete = new google.maps.places.Autocomplete(
                autoCompleteInput,
                {
                    componentRestrictions: {
                        country: ['be'],
                    },
                }
            )
        }
        // google.maps.event.addDomListener(autoCompleteInput, "keydown", function(e) {
        //   if (
        //     e.keyCode === 13 &&
        //     document.querySelectorAll(".pac-item-selected").length == 0 &&
        //     !e.triggered
        //   ) {
        //     e.preventDefault();
        //     //  e.stopPropagation();
        //     google.maps.event.trigger(this, "keydown", { keyCode: 40 });
        //     google.maps.event.trigger(this, "keydown", {
        //       keyCode: 13,
        //       triggered: true
        //     });
        //   }
        // });

        // HACK TO PREVENT AUTOCOMPLETE
        if (autoCompleteInput) {
            var observerHack = new MutationObserver(function() {
                observerHack.disconnect()
                autoCompleteInput.autocomplete = 'new-password'
            })
            observerHack.observe(autoCompleteInput, {
                attributes: true,
                attributeFilter: ['autocomplete'],
            })
        }
    })
    let submit = e => {
        e.preventDefault()
        //console.log(autoComplete.getPlace())

        if (dateReserved.includes(date)) return

        const addressData = autoComplete.getPlace()

        if (!addressData) {
            clickOnAddressError = true
            return
        }

        let addressFormatted = addressData.formatted_address
        const latLng =
            addressData.geometry.location.lat() +
            ',' +
            addressData.geometry.location.lng()
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
                    firstname,
                    piano: namePiano,
                    lastname,
                    email,
                    date,
                    address: addressFormatted,
                    latLng,
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
                    firstname,
                    piano: namePiano,
                    lastname,
                    email,
                    date,
                    address,
                    telephone,
                    message,
                    price,
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

    let checkAddress = e => {
        console.log(autoComplete.getPlace())
        if (!autoComplete.getPlace()) address = ''
    }
</script>

<style>
    .input-row {
        display: flex;
        justify-content: space-between;
    }
    .input-wrap {
        width: 47%;
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
        <h2>{labels.title || 'Rent the'} {namePiano.replace('-', ' ')}</h2>
        <h4>
            {formComplete ? labels.summary || 'Summary' : labels.subtitle || 'FILL IN THIS FORM TO GET AN APPROXIMATION OF THE PRICE'}
        </h4>
    </header>

    {#if !formComplete}
        <main>
            <p>
                {labels.intro || `Avoid unnecessary risk and let Quatre Mains handle transportation of your
      precious piano. With utmost care we will transport your piano and if you
      wish tune it at destination.`}
            </p>

            <form on:submit={submit}>
                <div class="input-row">
                    <div class="input-wrap">
                        <label for="firstname">
                            {labels.firstName || 'First name'}
                            <span>*</span>
                        </label>
                        <input
                            bind:value={firstname}
                            name="firstname"
                            type="text"
                            id="firstname"
                            required />
                    </div>

                    <div class="input-wrap">
                        <label for="lastname">
                            {labels.lastName || 'Last name'}
                            <span>*</span>
                        </label>
                        <input
                            bind:value={lastname}
                            name="lastname"
                            type="text"
                            id="lastname"
                            required />
                    </div>
                </div>

                <div class="input-row">
                    <div class="input-wrap date-input">
                        <label for="date">
                            {labels.date || 'Date'}
                            <span>*</span>
                        </label>
                        <input
                            bind:value={date}
                            name="date"
                            type="date"
                            id="date"
                            required />
                        {#if dateReserved.includes(date)}
                            <span class="warning">
                                {labels.unavailable || 'Piano not available on this date'}
                            </span>
                        {/if}
                    </div>

                    <div class="input-wrap">
                        <label for="email">
                            {labels.email || 'Email'}
                            <span>*</span>
                        </label>
                        <input
                            bind:value={email}
                            name="email"
                            type="email"
                            id="email"
                            required />
                    </div>
                </div>

                <label for="plaatsnaam">
                    {labels.address || 'Type in your address'}
                    <span>*</span>
                </label>
                <input
                    bind:this={autoCompleteInput}
                    bind:value={address}
                    on:change={checkAddress}
                    name="address"
                    type="text"
                    id="address"
                    required
                    autocomplete="off" />

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
                        {labels.fillInDetails || 'Fill in the rest of these details to rent the instrument.'}
                    </h4>

                    <div class="input-row">
                        <div class="input-wrap">
                            <label for="telephone">
                                {labels.telephone || 'Telephone'}
                                <span>*</span>
                            </label>
                            <input
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
                            <textarea id="message" name="message" />
                        </div>

                    </div>
                {/if}

                <div class="button-wrap">
                    <button
                        bind:this={submitButton}
                        class={dateReserved.includes(date) ? 'disabled' : ''}
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
            <p>
                {labels.summary || 'Thanks for filling in the form, you will receive a email once the reservation has been confirmed'}
            </p>

            <ul>
                <li>{namePiano}</li>
                <li>{address} {date}</li>
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
