<script>
  import { nbTranscript } from "$lib/services/openaiToolsLabs";
  import { getHuginToken } from "../../lib/useApi"
  import { onMount, } from "svelte"
  import IconSpinner from "../../lib/components/IconSpinner.svelte"
  import { checkRoles } from '$lib/helpers/checkRoles';


// Global variabler
let mediaRecorder;
  let audioChunks = [];
  let audioBlob;
  let audioUrl = $state();
  let token = $state(null)
  let ferdigTranskript = $state("Her kommer transkripsjonen");
  let recording = $state(false);
  let timer = $state(0);
  let timerInterval;
  const appName=import.meta.env.VITE_APP_NAME
  let metadata = $state({
    "filnavn": "",
    "spraak": "",
    "format": ""
  });

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
    };

    mediaRecorder.onstop = () => {
      metadata.filnavn = 'mittopptak.wav';
      audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
      audioUrl = URL.createObjectURL(audioBlob);
      audioChunks = [];
      clearInterval(timerInterval);
      timer = 0;
    };

    mediaRecorder.start();
    recording = true;
    timerInterval = setInterval(() => {
      timer += 1;
    }, 1000);
  }

  function stopRecording() {
    mediaRecorder.stop();
    recording = false;
    mediaRecorder.stream.getTracks().forEach(track => track.stop());
  }

  // Filhåndtering
  const handleAudioFileSelect = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      metadata.filnavn = selectedFile.name;
      // Lager blob til transkripsjon og url for avspilling
      audioBlob = new Blob([selectedFile], { type: 'audio/wav' });
      audioUrl = URL.createObjectURL(audioBlob);
      // sendTilTranscript(audioBlob);
    }
  };

  const sendTilTranscript = async () => {
    console.log('Sending to transcript');
    const transButton = document.getElementById('transButton');
    transButton.textContent = "epost på vei";
    transButton.disabled = true;
    ferdigTranskript = await nbTranscript(audioBlob, metadata);
  };
</script>

{#if !token}
      <div class="loading">
        <IconSpinner width={"32px"} />
      </div>
    {:else if !checkRoles(token, [`${appName.toLowerCase()}.admin`, `${appName.toLowerCase()}.transkripsjon`])}
      <p>Oi, du har ikke tilgang. Prøver du deg på noe lurt? 🤓</p>
      {:else}
      <h1>Eksperimentell selvbetjeningsløsning for transkripsjon av tale</h1>
      
      <p style="margin-top:10px">Her kan du spille inn eller laste opp lyd og få transkripsjonen tilsendt på epost til brukeren du er logget inn med.</p>
      <div class="alert"><p><b>Tjenesten er under utvikling og kan være ustabil. Husk at du ikke må sende inn lydklipp som inneholder sensitiv informasjon.</b></p></div>
      <h2>Spill inn lyd</h2>
      <div style="margin-bottom: 10px;"><b>NB!</b> Husk å laste ned lydopptaket før du sender til transkribering. Lydopptaket slettes etter at det er sendt avgårde. </div>
      
      <button onclick={recording ? stopRecording : startRecording}>
        {recording ? 'Stopp opptak' : 'Start opptak'}
      </button>
    
      {#if recording}
      <p>Opptak pågår: {timer}s</p>
      {/if}
      <br />
      {#if audioUrl}
        <p>
          <!-- Avspilling fra audioUrl-objektet -->
          <audio controls src = {audioUrl}></audio><br>
          <button id="transButton" onclick={sendTilTranscript}>Send til transkripsjon</button>
          <button><a href={audioUrl} download="recording.wav">Last ned opptak</a></button>
        </p>
      {/if}
    
        <!-- Opplasting av lydfil -->
        <h2 style="margin-top: 10px">Eller last opp en lydfil</h2>
        <p>Last opp lydklipp på mp3- eller wma-format. Den ferdige transkripsjonen blir sendt til deg på epost.</p>
        <br />
      <input type="file" accept="audio/*" id="audioFile" name="audioFile" onchange={handleAudioFileSelect} />
      {#if metadata.selectedFileName}
        <p>Valgt fil: {metadata.selectedFileName}</p>
      {/if}
      <br>
    {/if}
    <br />
    Modell: Nasjonalbibliotektets nb-whisper-medium
    <!-- Download button -->
     
    <style>
      audio {
        margin-top: 20px;
      }
    
      button {
        margin-right: 10px;
        margin-bottom: 10px;
      }
    
      .alert {
        background-color: #f8d7da;
        color: #721c24;
        padding: 20px;
        margin-top: 10px;
        margin-bottom: 20px;
        border: 1px solid #f5c6cb;
        border-radius: 5px;
      }
    
    </style>