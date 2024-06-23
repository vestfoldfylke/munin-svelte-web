<script>
    import SvelteMarkdown from 'svelte-markdown'
// Props
    export let role = 'user'
    export let content = 'content'
</script>

<div class="{role}">
    <div class="chat-blob-content">
        <SvelteMarkdown source={ content } />
    </div>
</div>

<style>    
    .user {
        display: flex;
        flex-direction: row-reverse;
        margin: 0.5rem;
        border-radius: 10px 10px 0 10px;
    }

    .assistant {
        display: flex;
        flex-direction: row;
        margin: 0.5rem;
    }

    .chat-blob-content {
        background-color: var(--himmel-10);
        border-radius: 1rem;
        padding: 1.5rem;
        margin: 0.5rem;
        max-width: 90%;
    }

    .user .chat-blob-content {
        background-color: var(--himmel-30);
    }
</style>
