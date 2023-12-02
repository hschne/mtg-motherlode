async function fetchData() {
  const response = await fetch(
    "https://api.scryfall.com/cards/search?q=date>=lci+eur>=10+is:booster",
  );
  const json = await response.json();

  processData(json.data);
}

async function processData(data) {
  const results = document.getElementById("result");
  let view = data
    .map((card) => {
      const imgSrc =
        card.image_uris?.small || card.card_faces[0].image_uris.small;
      return `<div class="result">
       <h3>${card.name}</h3>
       <img src="${imgSrc}"/>
       <p>${card.prices.eur}</p>
    </div>`;
    })
    .join(",");

  results.innerHTML = view;
}

fetchData();
