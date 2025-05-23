// Bibliotek for å håndtere API-kall til AZF-funksjoner
import axios from 'axios'
// import { models } from "$lib/data/models"; // Modellkonfigurasjon
import { getHuginToken } from '../useApi'
import { getArticlesFromNDLA, generateKeywords } from './kildekallTools';

export const responseOpenAi = async (userParams) => {
  const accessToken = await getHuginToken()
  const payload = {
    userMessage: userParams.message,
    response_id: userParams.response_id,
    imageBase64: userParams.imageB64,
    dokFiles: userParams.dokFiles,
    model: userParams.model,
  }
  
  const response = await axios.post(`${import.meta.env.VITE_AI_API_URI}/responseOpenAi`, payload, {
    headers: {
      authorization: `Bearer ${accessToken}`
    }
  })
  return response
}

export const openAiAssistant = async (userParams) => {
  const payload = {
    assistant_id: userParams.assistant_id,
    new_thread: userParams.new_thread,
    thread_id: userParams.thread_id,
    messageHistory: userParams.messageHistory,
    tile: userParams.tile,
  }
  const accessToken = await getHuginToken()
  const response = await axios.post(`${import.meta.env.VITE_AI_API_URI}/assistantOpenAi`, payload, {
    headers: {
      authorization: `Bearer ${accessToken}`
    }
  })
  if (userParams.tools === "NDLA") {
    const keyWords = await generateKeywords(response.data.messages[0].content[0].text.value)
    const articles = await getArticlesFromNDLA(keyWords)
    const articleurl = `Les mer på NDLA om: <a href="https://ndla.no/article-iframe/nb/article/${articles[0].id}" target="_blank">${articles[0].title.title}</a>, <a href="https://ndla.no/article-iframe/nb/article/${articles[1].id}" target="_blank">${articles[1].title.title}</a>, og <a href="https://ndla.no/article-iframe/nb/article/${articles[2].id}" target="_blank">${articles[2].title.title}</a><br>Lisens: ${articles[0].license}` 
  return [response.data, articleurl]
  
  } else {
    console.log('Assistant - No tool')
    return [response.data, false]
  }
}


export const docQueryOpenAi = async (userParams) => {

  const accessToken = await getHuginToken()

  const formData = new FormData();
  formData.append('assistant_id', userParams.assistant_id);
  formData.append('response_id', userParams.response_id);
  formData.append('thread_id', userParams.thread_id);
  formData.append('new_thread', userParams.new_thread);
  formData.append('vectorStore_id', userParams.vectorStore_id);
  formData.append('userMessage', userParams.message);
  formData.append('messageHistory', JSON.stringify(userParams.messageHistory));

  if (userParams.dokFiles && userParams.dokFiles.length > 0) {
    for (let i = 0; i < userParams.dokFiles.length; i++) {
      formData.append('filer', userParams.dokFiles[i]);
    }
  }

  const payload = formData;
 
  const response = await axios.post(`${import.meta.env.VITE_AI_API_URI}/docQueryOpenAiV2`, payload, {
    headers: {
      authorization: `Bearer ${accessToken}`
    }
  })
  return response.data
}
