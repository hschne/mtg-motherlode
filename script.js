async function fetchData() {
  const response = await fetch(
    "https://api.scryfall.com/cards/search?q=date>=2022-12-02+eur>=10+is:booster",
  );
  const json = await response.json();

  processData(json.data);
}

async function processData(data) {
  const results = document.getElementById("result");
  let groups = data
    .map((card) => {
      const imgSrc = card.image_uris?.png || card.card_faces[0].image_uris.png;
      const price = card.prices.eur;
      return { ...card, price: price, imgSrc: imgSrc };
    })
    .reduce((groups, card) => {
      const group = groups[card.set_name] || [];
      group.push(card);
      groups[card.set_name] = group;
      return groups;
    }, {});

  const view = Object.entries(groups)
    .map(([name, cards]) => {
      return [
        name,
        cards.sort((a, b) => parseFloat(b.price) - parseFloat(a.price)),
      ];
    })
    .sort((a, b) => {
      console.log(a[1][0]);
      return new Date(b[1][0].released_at) - new Date(a[1][0].released_at);
    })
    .map(([name, cards]) => {
      return `
      <div class="set-item">
      <h2 class="set-title">${name}</h2>
      <ul class="card-list">
        ${cards.map((card) => renderCard(card)).join(" ")}
      </ul>
      <div>
      `;
    });

  results.innerHTML = view;
}

function renderCard(card) {
  return `<li class="card-item">
       <img class="card-image" src="${card.imgSrc}"/>
       <p class="card-price">${card.prices.eur}</p>
    </li>`;
}

fetchData();
