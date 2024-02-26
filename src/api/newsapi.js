const URL = "https://newsapi.org/v2/everything?from=2024-02-01&to=2024-02-26&page=1&pageSize=9&sortBy=popularity&q=";
const API_KEY = "65471820be664fa6a77a30180c3036df";

async function getFormulaOneNews(language) {
    const response = await fetch(URL + "formula1&apiKey=" + API_KEY + `&language=${language ?? "en"}`);
    const data = await response.json();
    return data.articles;
}

module.exports = { getFormulaOneNews };
