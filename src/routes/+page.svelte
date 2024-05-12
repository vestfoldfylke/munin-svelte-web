<script>
    import Testcomp from "../lib/components/Testcomp.svelte";
    let name = "Hugin";
</script>

<main>
    <div class="infoBox">
        <h1>Velkommen til {name}!</h1>
        <Testcomp />
        <p>Takk for at du valgte {name} som din KI-tjeneste.</p>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor. Cras elementum ultrices diam. Maecenas ligula massa, varius a, semper congue, euismod non, mi. Proin porttitor, orci nec nonummy molestie, enim est eleifend mi, non fermentum diam nisl sit amet erat. Duis semper. Duis arcu massa, scelerisque vitae, consequat in, pretium a, enim. Pellentesque congue. Ut in risus volutpat libero pharetra tempor. Cras vestibulum bibendum augue. Praesent egestas leo in pede. Praesent blandit odio eu enim. Pellentesque sed dui ut augue blandit sodales. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Aliquam nibh. Mauris ac mauris sed pede pellentesque fermentum. Maecenas adipiscing ante non diam sodales hendrerit.</p>
    </div>
</main>

<style>
    main {
        display: flex;
        flex-direction: column;
        align-items: center;
        height: 100vh;
        text-align: center;
    }

    h1 {
        font-size: 2.5rem;
        margin-bottom: 1rem;
    }

    p {
        margin-bottom: 0.5rem;
    }

    .infoBox {
        padding: 1rem;
        border: 1px solid #ccc;
        border-radius: 5px;
        margin-bottom: 1rem;
    }
</style>
