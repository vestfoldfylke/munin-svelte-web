<script>
    
    /**
     * @typedef {Object} Props
     * @property {function} handleModelChange - Function to handle model change
     * @property {Array<{id: string, metadata: {tile: string, navn: string}}>} models - Array of model objects
     * @property {string} tile - Filter models by this tile
     * @property {boolean} useModelId - Whether to use model.id or model.params.assistant_id (if both is true then model.id is used, if none is true then model.id is used)
     * @property {boolean} useAssistantId - Whether to use model.params.assistant_id or model.id (if both is true then model.id is used, if none is true then model.id is used)
     */

    /** @type {Props} */
    let { handleModelChange, models, tile, useModelId = false, useAssistantId = false } = $props();
    
    const _useModelId = useModelId || (!useModelId && !useAssistantId)
</script>

<div class="modelSelectWrapper svg-arrow">
    <select name="modelSelect" onchange={handleModelChange}>
        {#each models as model (model.id)}
            {#if model.metadata.tile === tile}
                <option value={_useModelId ? model.id : model.params.assistant_id}>{model.metadata.navn}</option>
            {/if}
        {/each}
    </select>
</div>

<style>
    .modelSelectWrapper {
        position: relative;
    }

    .modelSelectWrapper select {
        width: 26rem;
        padding: 10px;
        border-radius: 1rem;
        border: 1px solid #ccc;
        background-color: #f5f5f5;
        background-image: none;

        appearance: none;
        -webkit-appearance: none;
        -moz-appearance: none;
    }

    .modelSelectWrapper.svg-arrow::after {
        content: "";
        position: absolute;
        right: 1rem;
        top: 50%;
        transform: translateY(-50%);
        pointer-events: none; /* Prevents the arrow from blocking clicks */
        width: 1rem;
        height: 1rem;
        background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23555' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'/></svg>");
        background-repeat: no-repeat;
        background-position: center;
    }

    @media only screen and (max-width: 768px) {
        /* For mobile phones: */
        .modelSelectWrapper select {
            width: 320px;
            margin-right: 5px;
        }
    }  
</style>