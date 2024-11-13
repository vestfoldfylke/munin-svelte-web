<script>
    import { nbTranscript } from "$lib/services/openaiToolsLabs";
    import { getHuginToken } from "../../lib/useApi"
    import { onMount, afterUpdate } from "svelte"

  // Global variabler
  let mediaRecorder;
  let audioChunks = [];
  let audioBlob;
  let audioUrl;
  let token = null
  let ferdigTranskript = "Her kommer transkripsjonen";

  onMount(async () => {
    if ( import.meta.env.VITE_MOCK_API && import.meta.env.VITE_MOCK_API === "true" ) {
      // Pretend to wait for api call
      await new Promise((resolve) => setTimeout(resolve, 2000))
    }
    token = await getHuginToken(true)
  })

  async function startRecording() {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(stream);

    mediaRecorder.ondataavailable = event => {
      audioChunks.push(event.data);
      console.log(event.data);
    };

    mediaRecorder.onstop = () => {
      audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
      audioUrl = URL.createObjectURL(audioBlob);
      audioChunks = [];
    };
    console.log('Recording started');
    console.log(mediaRecorder);
    mediaRecorder.start();
  }

  function stopRecording() {
    mediaRecorder.stop();
  }

  // Filhåndtering
  const handleAudioFileSelect = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      // Lager blob til trasnkipsjon og url for avspilling
      audioBlob = new Blob([selectedFile], { type: 'audio/wav' });
      audioUrl = URL.createObjectURL(audioBlob);
      sendTilTranscript(audioBlob);
    }
  };

  const sendTilTranscript = async () => {
    console.log('Sending to transcript');
    ferdigTranskript = await nbTranscript(audioBlob);
    // console.log(ferdigTranskript);
  }
</script>

<h1>Selvbetjeningsløsning for transkripsjon av tale</h1>
<h2>Modell: Nasjonalbibliotektets nb-whisper-medium</h2>
<p>Tjenesten er under utvikling og kan være ustabil. Husk at du ikke må sende inn lydklipp som inneholder sensitiv informasjon.</p>
<br><br>
<button on:click={startRecording}>Start opptak</button>
<button on:click={stopRecording}>Stopp opptak</button>
<button on:click={sendTilTranscript}>Transkriber opptak</button>
<!-- Opplasting av lydfil -->
<input type="file" accept="audio/*" id="audioFile" name="audioFile" on:change={handleAudioFileSelect} />

<br>
{#if audioUrl}
    <!-- Avspilling fra audioUrl-objektet -->
    <audio controls src = {audioUrl}></audio>
{/if}
<br>
<div id="transkriptOutput">
  {ferdigTranskript}
</div>

<style>
  #transkriptOutput {
    margin-top: 20px;
    border: 1px solid black;
    border-radius: 10px;
    padding: 10px;
    width: 50%;
  }
</style>


