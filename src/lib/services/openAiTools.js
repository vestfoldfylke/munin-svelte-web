import axios from 'axios'

export const openAiSimpleChat = async (spm) => {
    // Template API-call
    const response = await axios.get("https://api.chucknorris.io/jokes/random")
    $: console.log(response)
    return JSON.stringify(response.data.value)
}