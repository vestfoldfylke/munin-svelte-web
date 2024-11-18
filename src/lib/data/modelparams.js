// Parametre som sendes til backend og api

const appName = import.meta.env.VITE_APP_NAME
console.log('appName', appName)

export const params = {
  option1: {
    message: '',
    messageHistory: '',
    kontekst: '',
    model: 'gpt-4o',
    base64String: ''
  },
  option2: {
    question: '',
    parameters: {
      stream: false,
      max_tokens: 500,
      max_new_tokens: 1024,
      top_k: 64,
      top_p: 0.9,
      stop: ['<|im_end|>'],
      temperature: 0.2,
      do_sample: true,
      repetition_penalty: 1.0,
      return_full_text: true
    }
  },
  option3: { // Matematikkens byggesteiner
    message: '',
    kontekst: '',
    model: 'gpt-4o',
    assistant_id: appName === 'Hugin' ? 'asst_0I2uU1sPdSixkVp8sIuzomPC' : 'asst_tBIc3OGl8pyEiSygIYfE41AD', // Hugin eller Munin
    new_thread: true,
    thread_id: ''
    },
    option4: { // Teoretisk matematikk 1
    message: '',
    kontekst: '',
    model: 'gpt-4o',
    assistant_id: appName === 'Hugin' ? 'asst_KZLKUwxeVkDn86DlhOAuTlPM' : 'asst_7tenDoQ3L6pjvVXqqLv22N56', // Hugin eller Munin
    new_thread: true,
    thread_id: ''
  },
  option5: { // Teoretisk matematikk 2
    message: '',
    kontekst: '',
    model: 'gpt-4o',
    assistant_id: appName === 'Hugin' ? 'asst_LxcMbkhbmSpJsXvTSyblKVcq' : 'asst_LHGHomFUX9zEwCEig2eHSrnt', // Hugin eller Munin
    new_thread: true,
    thread_id: ''
  },
  option6: { // Brukes ikke
    message: '',
    kontekst: '',
    model: 'gpt-4o',
    assistant_id: appName === 'Hugin' ? 'asst_PjgBFDXTELeMF6vXKvhlOZrH' : 'asst_Qx5vog8wFLmBiEXofs4gQDko', // Hugin eller Munin
    new_thread: true,
    thread_id: ''
  },
  option7: { // VTR
    message: '',
    kontekst: '',
    model: 'gpt-4o',
    assistant_id: 'asst_kleLVY0hLwXAgcgxoBgzwqLA',
    new_thread: true,
    thread_id: ''
  },
  option8: { // Geologi
    message: '',
    kontekst: '',
    model: 'gpt-4o',
    assistant_id: appName === 'Hugin' ? 'asst_g5BEAxNzyOcDMuSkgtV2gQy5' : 'asst_Qx5vog8wFLmBiEXofs4gQDko',
    new_thread: true,
    thread_id: ''
  },
  option9: { // o1-preview
    message: '',
    messageHistory: '',
    kontekst: '',
    model: 'o1-preview',
    base64String: ''
  },
  option10: { // Skogmo - Elev
    message: '',
    kontekst: '',
    model: 'gpt-4o',
    assistant_id: 'asst_3oEC7ZpAbcIgYsheQdi1UQ1g',
    new_thread: true,
    thread_id: ''
  },
  option11: { // Skogmo - Lærer
    message: '',
    kontekst: '',
    model: 'gpt-4o',
    assistant_id: 'asst_VbXY4QAm0IoMXfMp9RvmcByF',
    new_thread: true,
    thread_id: ''
  },
  option12: {
    message: '',
    kontekst: '',
    model: 'gpt-4o',
    assistant_id: '',
    new_thread: true,
    thread_id: ''
  }
}
