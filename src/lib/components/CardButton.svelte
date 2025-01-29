<script>
    import { goto } from '$app/navigation';
    import IconSpinner from './IconSpinner.svelte'

    
    /**
     * @typedef {Object} Props
     * @property {string} [header] - Props
     * @property {string} [imgPath]
     * @property {string} [imgAlt]
     * @property {string} [gotoPath]
     * @property {string} [paragraph]
     * @property {boolean} [image]
     * @property {boolean} [boolValue]
     * @property {boolean} [loading]
     * @property {any} func
     * @property {import('svelte').Snippet} [children]
     */

    /** @type {Props} */
    let {
        header = 'header',
        imgPath = 'path',
        imgAlt = 'alt',
        gotoPath = 'urlPath',
        paragraph = 'some text',
        image = false,
        boolValue = false,
        loading = false,
        func,
        children
    } = $props();
</script>

<button onclick={boolValue ? () => goto(gotoPath) : func} class="card">
    {#if loading}
        <div class="loadingSpinner">
            <IconSpinner width="80px"/>
        </div>
    {:else}
        {#if image}
            <img src={imgPath} alt={imgAlt}/>
        {:else}
            <div class="mainSlot">
                {@render children?.()}
            </div>
        {/if}
    {/if}
    <div class="container">
        <h3><b>{header}</b></h3>
        <p>{paragraph}</p>
    </div>
</button>

<style>
    .card {
        /* Add shadows to create the "card" effect */
        box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
        /* border: 2px solid var(--himmel-30); */
        /* background-color: var(--himmel-10); */
        transition: 0.3s;
        border-radius: 1rem;
        margin: 1rem;
        width: 210px;
        height: 210px;
        padding: 16px;
        display: flex;
        flex-direction: column;
        flex-wrap: nowrap;
        justify-content: center;
        align-items: center;
    }

    .card:hover {
        box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2);
        background: linear-gradient(rgb(255, 255, 255), var(--gress-10));
        /* background-color: var(--himmel-30); */
        cursor: pointer;
    }

    .container {
        display: flex;
        flex-direction: column;
        flex-wrap: nowrap;
        width: 100%;
        text-align: center;
    }

    .card img, .loadingSpinner {
        height: 170px;
        width: 170px;
        padding: 16px;
    }

    .loadingSpinner {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    button {
        all:unset
    }

    .mainSlot {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: bottom;
        padding: 20px;
    }

    @media only screen and (max-width: 768px) {
        /* For mobile phones: */
        .card {
            /* Add shadows to create the "card" effect */
            border-radius: 1rem;
            margin: 0.5rem;
            padding: 16px;
            width: 100%;
            height: unset;
            display: flex;
            flex-direction: column;
            flex-wrap: nowrap;
            justify-content: center;
            align-items: center;
        }
        .card img, .loadingSpinner {
            height: 100px;
            width: 100px;
            padding: 16px;
        }
    }  
</style>