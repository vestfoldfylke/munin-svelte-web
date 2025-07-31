<script>
    
    /**
     * @typedef {Object} Props
     * @property {function} handleModelChange - Function to handle model change
     * @property {Array<{id: string, metadata: {tile: string, navn: string}}>} models - Array of model objects
     * @property {string} tile - Filter models by this tile
     * @property {string} selectedModelId - The id of the currently selected model
     * @property {boolean} useModelId - Whether to use model.id or model.params.assistant_id (if both is true then model.id is used, if none is true then model.id is used)
     * @property {boolean} useAssistantId - Whether to use model.params.assistant_id or model.id (if both is true then model.id is used, if none is true then model.id is used)
     */

    /** @type {Props} */
    const { handleModelChange, models, tile, selectedModelId = '0', useModelId = false, useAssistantId = false } = $props();
    
    const _useModelId = useModelId || (!useModelId && !useAssistantId)

    const handleButtonClick = (model) => {
        const value = _useModelId ? model.id : model.params.assistant_id;
        const mockEvent = {
            target: { value }
        };
        handleModelChange(mockEvent);
    };
</script>

<div class="modelButtonGroup">
    {#each models as model (model.id)}
        {#if model.metadata.tile === tile}
            {@const isSelected = model.id === selectedModelId}
            <button 
                class="modelButton" 
                class:selected={isSelected}
                onclick={() => handleButtonClick(model)}
                type="button"
            >
                {model.metadata.navn}
            </button>
        {/if}
    {/each}
</div>

<style>
    .modelButtonGroup {
        display: flex;
        gap: 0.5rem;
        flex-wrap: wrap;
        align-items: center;
    }

    .modelButton {
        background: #f5f5f5;
        border: 1px solid #ddd;
        border-radius: 0.5rem;
        padding: 0.5rem 0.75rem;
        cursor: pointer;
        transition: all 0.2s ease;
        font-size: 0.85rem;
        font-weight: 500;
        color: #333;
        white-space: nowrap;
    }

    .modelButton:hover {
        background: #e8e8e8;
        border-color: #ccc;
        transform: translateY(-1px);
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .modelButton.selected {
        background: var(--himmel-20);
        border-color: var(--himmel-40);
        color: #333;
        box-shadow: 0 2px 6px rgba(204,235,243,0.5);
    }

    .modelButton.selected:hover {
        background: var(--himmel-30);
        transform: translateY(-1px);
    }

    @media only screen and (max-width: 768px) {
        .modelButtonGroup {
            gap: 0.25rem;
            justify-content: flex-start;
        }
        
        .modelButton {
            padding: 0.4rem 0.6rem;
            font-size: 0.8rem;
            flex: 1;
            min-width: 0;
        }
    }

    @media only screen and (max-width: 480px) {
        .modelButtonGroup {
            flex-direction: column;
            width: 100%;
        }
        
        .modelButton {
            width: 100%;
            flex: none;
            text-align: center;
        }
    }
</style>