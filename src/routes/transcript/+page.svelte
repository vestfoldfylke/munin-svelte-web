<script>
  import { nbTranscript } from "$lib/services/openaiToolsLabs";
  import { getHuginToken } from "../../lib/useApi"
  import { onMount, } from "svelte"
  import IconSpinner from "../../lib/components/IconSpinner.svelte"


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
      console.log(event.data);
    };

    mediaRecorder.onstop = () => {
      metadata.filnavn = 'mittopptak.wav';
      audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
      audioUrl = URL.createObjectURL(audioBlob);
      audioChunks = [];
      clearInterval(timerInterval);
      timer = 0;
    };

    console.log('Recording started');
    console.log(mediaRecorder);
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
      sendTilTranscript(audioBlob);
    }
  };

  const sendTilTranscript = async () => {
    console.log('Sending to transcript');
    ferdigTranskript = await nbTranscript(audioBlob, metadata);
    // console.log(ferdigTranskript);
  };
</script>

{#if !token}
      <div class="loading">
        <IconSpinner width={"32px"} />
      </div>
    {:else if !token.roles.some( (r) => [`${appName.toLowerCase()}.admin`].includes(r) )}
      <p>Oi, du har ikke tilgang. Prøver du deg på noe lurt? 🤓</p>
{:else}
  <h1>Selvbetjeningsløsning for transkripsjon av tale</h1>
  <h2>Modell: Nasjonalbibliotektets nb-whisper-medium</h2>
  <p>Tjenesten er under utvikling og kan være ustabil. Husk at du ikke må sende inn lydklipp som inneholder sensitiv informasjon.</p>
  <br><br>
  <select bind:value={metadata.spraak}>
    <option value="" disabled>Velg språk</option>
    <option value="norsk">Norsk</option>
    <option value="engelsk">Engelsk</option>
    <option value="tysk">Tysk</option>
    <option value="fransk">Fransk</option>
    <option value="spansk">Spansk</option>
    <option value="ukarinsk">Ukrainsk</option>
  </select>
  <select bind:value={metadata.format}>
    <option value="" disabled>Velg format</option>
    <option value="motereferat">Møtereferat</option>
    <option value="kort_oppsummering">Kort oppsummering</option>
    <option value="fyldig_oppsummering">Fyldig oppsummering</option>
    <option value="full_transkripsjon">Full transkripsjon</option>
  </select>
  <br>
  <br>
  <button onclick={startRecording}>Start opptak</button>
  <button onclick={stopRecording}>Stopp opptak</button>
  <button onclick={sendTilTranscript}>Transkriber opptak</button>
  <!-- Opplasting av lydfil -->
  <input type="file" accept="audio/*" id="audioFile" name="audioFile" onchange={handleAudioFileSelect} />
  {#if metadata.selectedFileName}
    <p>Valgt fil: {metadata.selectedFileName}</p>
  {/if}
  <br>
  {#if audioUrl}
      <!-- Avspilling fra audioUrl-objektet -->
      <audio controls src = {audioUrl}></audio>
      <a href={audioUrl} download="recording.wav">
        <button>Last ned opptak</button>
      </a>
  {/if}
  {#if recording}
  <p>Opptak pågår: {timer}s</p>
{/if}
  <br>
  <div id="transkriptOutput">
    Den ferdige transkripsjonen/oppsummeringen sendes til deg på epost i løpet av kort tid.
  </div>
{/if}
<!-- Download button -->
 
<style>
  #transkriptOutput {
    margin-top: 20px;
    border: 1px solid black;
    border-radius: 10px;
    padding: 10px;
    width: 50%;
  }

  audio {
    margin-top: 20px;
  }

  button {
    margin-right: 10px;
  }

</style>


