import { writable } from 'svelte/store';
import { responseOpenAi, noraChat } from '$lib/services/openAiTools';
import { models } from '$lib/data/models';

function createChatStore() {
  const initialWelcome = (appName) => [{
    role: 'assistant',
    content: `Velkommen til ${appName}! Hva kan jeg hjelpe deg med i dag?`,
    model: `${appName}`
  }];

  const { subscribe, update, set } = writable({
    messageHistory: [],
    isWaiting: false,
    isError: false,
    errorMessage: '',
    valgtModell: '0',
    temperatur: 0.7,
    synligKontekst: true,
    kontekst: '',
    response_id: null,
    modelinfoModell: models[0]?.metadata?.navn || '',
    modelinfoBeskrivelse: models[0]?.metadata?.description || '',
  });

  return {
    subscribe,
    reset: (appName) => set({
      messageHistory: initialWelcome(appName),
      isWaiting: false,
      isError: false,
      errorMessage: '',
      valgtModell: '0',
      temperatur: 0.7,
      synligKontekst: true,
      kontekst: '',
      response_id: null,
      modelinfoModell: models[0]?.metadata?.navn || '',
      modelinfoBeskrivelse: models[0]?.metadata?.description || '',
    }),
    setModel: (modelId) => update(state => {
      const model = models.find(m => m.id === modelId) || models[0];
      return {
        ...state,
        valgtModell: modelId,
        modelinfoModell: model.metadata.navn,
        modelinfoBeskrivelse: model.metadata.description,
        synligKontekst: model.metadata.synligKontekst
      };
    }),
    addUserMessage: (content, modelinfoModell) => update(state => ({
      ...state,
      messageHistory: [...state.messageHistory, { role: 'user', content, model: modelinfoModell }]
    })),
    addAssistantMessage: (content, modelinfoModell) => update(state => ({
      ...state,
      messageHistory: [...state.messageHistory, { role: 'assistant', content, model: modelinfoModell }]
    })),
    setWaiting: (waiting) => update(state => ({ ...state, isWaiting: waiting })),
    setError: (error, modelinfoModell) => update(state => ({
      ...state,
      isError: true,
      errorMessage: error,
      messageHistory: [...state.messageHistory, { role: 'assistant', content: 'Noe gikk galt. Prøv igjen.', model: modelinfoModell }]
    })),
    sendMessage: async (userMessage, { valgtModell, kontekst, temperatur, synligKontekst, modelinfoModell }) => {
      let response;
      update(state => ({ ...state, isWaiting: true, isError: false }));
      try {
        if (valgtModell === '0') {
          response = await responseOpenAi({ message: userMessage, kontekst, temperatur, synligKontekst });
          update(state => ({
            ...state,
            response_id: response.data.id,
            messageHistory: [...state.messageHistory, { role: 'assistant', content: response.data.output_text, model: modelinfoModell }]
          }));
        } else if (valgtModell === '1') {
          response = await noraChat({ message: userMessage, kontekst, temperatur, synligKontekst });
          update(state => ({
            ...state,
            messageHistory: [...state.messageHistory, { role: 'assistant', content: response.choices[0].message.content, model: modelinfoModell }]
          }));
        } else {
          throw new Error('Ugyldig modellvalg');
        }
      } catch (error) {
        update(state => ({
          ...state,
          isError: true,
          errorMessage: error,
          messageHistory: [...state.messageHistory, { role: 'assistant', content: 'Noe gikk galt. Prøv igjen.', model: modelinfoModell }]
        }));
      } finally {
        update(state => ({ ...state, isWaiting: false }));
      }
    }
  };
}

export const chatStore = createChatStore();
