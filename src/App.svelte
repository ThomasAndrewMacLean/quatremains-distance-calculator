<script>
	export let namePiano;
</script>

<style>
	
</style>

<div class="container">
        <header>
            <h2>
                Rent the {namePiano}
            </h2>
        </header>

        <main>
            <p>Avoid unnecessary risk and let Quatre Mains handle transportation of your precious piano. With utmost
                care we will transport your piano and if you wish tune it at destination. </p>

            <form id="form">
                <label for="mappp">Type in your address <span>*</span></label>
                <input name="dream" type="text" aria-labelledby="calculate-button" id="mappp" required />
                <div class="button-wrap">
                    <button type="submit" id="calculate-button">Calculate</button>
                    <span id="result">150€</span>
                </div>
            </form>


        </main>
    </div>