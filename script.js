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
      const imgSrc =
        card.image_uris?.normal || card.card_faces[0].image_uris.normal;
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
      console.log(cards);
      return [
        name,
        cards.sort((a, b) => parseFloat(b.price) - parseFloat(a.price)),
      ];
    })
    .map(([name, cards]) => {
      return `
      <h2>${name}</h2>
      <ul>
      ${cards.map((card) => renderCard(card)).join(",")}
      </ul>
      `;
    })
    .join(",");

  results.innerHTML = view;
}

function renderCard(card) {
  return `<li>
       <h3>${card.name}</h3>
       <img src="${card.imgSrc}"/>
       <p>${card.prices.eur}</p>
       <p>${card.set_name}</p>
    </li>`;
}

fetchData();
