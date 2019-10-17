import App from './App.svelte';

const app = new App({
	target: document.body,
	props: {
		namePiano: 'G4 Harpsicord'
	}
});

export default app;