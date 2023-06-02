const API_URL = 'https://api.coingecko.com/api/v3/coins';

let coins: Coin[];
let coinsCache = [];
let selectedCoins = [];
let savedSeletedCoinsBeforeLightbox = []


var CACHE_TIME = 0.5 * 60 * 1000;

document.addEventListener('DOMContentLoaded', async () => {

    await loadAllProducts();

    let produtsContainer: HTMLElement = document.querySelector('section.products');
    printProducts(coins, produtsContainer);

    allSearch(coins, produtsContainer);
    declareEventsHideShowDiv()
});


function declareEventsHideShowDiv() {
    document.getElementById('close_div_btn').addEventListener('click', () => {
        document.getElementById('div_hide_show').style.display = "none";
        selectedCoins = [...savedSeletedCoinsBeforeLightbox]
        let produtsContainer: HTMLElement = document.querySelector('section.products');
        printProducts(coins, produtsContainer);

    });

    document.getElementById('save_div_btn').addEventListener('click', () => {
        document.getElementById('div_hide_show').style.display = "none";

        if (selectedCoins.length > 5) {
            selectedCoins = [...savedSeletedCoinsBeforeLightbox]
        } else {
            let produtsContainer: HTMLElement = document.querySelector('section.products');
            printProducts(coins, produtsContainer);
        }
    });
};


function printProducts(coins: Coin[], container: HTMLElement) {
    clearProducts(container);
    let date = new Date();

    for (const coin of coins) {

        let element = createProductElement([coin]);

        coinsCache[coin.id] = {
            date: date.getTime(),
            usd: coin.market_data.current_price.usd,
            eur: coin.market_data.current_price.eur,
            ils: coin.market_data.current_price.ils
        };


        let btn = createMoreInfoButton(coin);
        btn.addEventListener('click', async function () {
            if (this.ariaExpanded === 'true') {
                let coinData = await getCoinFromCache(coin);
                document.getElementById(`${coin.id}-info`).innerHTML = `$${coinData.usd} </br> &euro;${coinData.eur} </br> &#8362;${coinData.ils}`;
                moreInfo.append(createProductImageElement([coin]));
            };
        });

        let moreInfo = document.createElement('div');
        moreInfo.classList.add('moreInfo1');
        moreInfo.classList.add('collapse');
        moreInfo.id = `${coin.id}-info`;
        moreInfo.innerHTML = `  <div class="spinner-border text-warning" role = "status" >
                                   <span class="visually-hidden"></span></div>`


        const divCheck = document.createElement('div');
        let checkbox = createProductToggle([coin]);
        divCheck.className = "form-check form-switch";


        checkbox.checked = selectedCoins.includes(coin.name);
        checkbox.addEventListener('change', function () {
            if (!this.checked) {
                selectedCoins = selectedCoins.filter(c => c !== coin.name);
            } else {
                if (selectedCoins.length < 5) {
                    selectedCoins.push(coin.name);
                } else {

                    checkbox.checked = false;

                    document.getElementById('div_hide_show').style.display = "flex";
                    const divM = document.createElement('div');
                    const divCheckCoins2 = document.createElement("div");
                    let divCheckBox = document.createElement("div");

                    divM.className = 'divM'
                    divCheckBox.className = 'divCheckBox';

                    document.getElementById('box_details').innerHTML = "";

                    for (const checkCoin of selectedCoins) {

                        savedSeletedCoinsBeforeLightbox = [...selectedCoins];

                        const divCheck = document.createElement('div');
                        let checkbox = createProductToggle([coin]);

                        divCheck.className = "form-check form-switch";
                        checkbox.id = checkCoin;

                        let divCheckCoins = document.createElement("div");
                        divCheckCoins2.className = 'divCheckCoins';

                        divCheckCoins2.append(divCheckCoins);
                        divCheckCoins.innerText = checkCoin;
                        divM.append(divCheckCoins2)

                        checkbox.setAttribute("checked", "true");


                        document.getElementById('box_details').append(divM);
                        divCheckBox.append(divCheck)
                        divCheck.append(checkbox);
                        divM.append(divCheckBox);



                        checkbox.addEventListener("change", () => {
                            console.log(checkbox.id, checkbox.checked)
                            // get the index of the coind id of the checkbox
                            let index = selectedCoins.indexOf(checkbox.id)
                            if (index > -1) {
                                selectedCoins.splice(index, 1)
                            }
                            else {
                                selectedCoins.push(checkbox.id);
                            }
                            console.log('selectedCoins', selectedCoins);

                        })
                        this.setAttribute("checked", "false");
                    }
                    selectedCoins.push(this.id);
                }
            }
        })

        container.append(element);
        element.append(divCheck);
        divCheck.append(checkbox);
        element.append(btn, moreInfo);
    };

};



async function loadAllProducts(): Promise<void> {
    coins = await fetch(API_URL)
        .then(res => res.json())
};



function search(coins: Coin[]) {
    let searchQuery = document.getElementById("search") as HTMLInputElement;
    let valueSearch = searchQuery.value.toLowerCase();


    document.getElementById("id_search_not_found").style.display = "none";
    let counter = 0;

    for (const coin of coins) {

        if (coin.symbol.toLowerCase() === valueSearch) {
            console.log(valueSearch)
            document.getElementById(`${valueSearch}-card`).style.display = 'flex';
            counter++;
        }
        else {
            document.getElementById(`${coin.symbol}-card`.toLocaleLowerCase()).style.display = 'none';
        }
    }
    if (counter == 0) {
        document.getElementById("id_search_not_found").style.display = "block";
    }

    searchQuery.value = "";
};


function searchQuery() {
    let searchQuery = document.getElementById("search") as HTMLInputElement;

    if (!searchQuery.value) {
        document.getElementById("id_search_not_found").style.display = "none";
        let produtsContainer: HTMLElement = document.querySelector('section.products');
        printProducts(coins, produtsContainer);
    }
};


function allSearch(coins: Coin[], produtsContainer) {
    document.getElementById('fromSearch').addEventListener('submit', (e) => { e.preventDefault(); search(coins) });
    document.getElementById("search").addEventListener('input', searchQuery);
    document.getElementById('home').addEventListener('click', () => printProducts(coins, produtsContainer));
};




function clearProducts(container: HTMLElement) {
    container.querySelectorAll('.product:not(.new)').forEach(e => container.removeChild(e));
};



function createProductElement(coins: Coin[]): HTMLDivElement {
    let element = document.createElement('div');
    element.classList.add('product');
    element.classList.add('card');

    element.append(createProductNameElement(coins));
    element.append(createProductDescriptionElement(coins));
    for (const coin of coins) {
        element.id = `${coin.symbol}-card`.toLowerCase();
    }
    return element;
};




function createProductImageElement(coins: Coin[]): HTMLImageElement {
    let element = document.createElement('img');

    for (const coin of coins) {
        element.src = coin.image.large;
    };

    return element;
};




function createProductNameElement(coins: Coin[]): HTMLHeadingElement {
    let element = document.createElement('h4');
    element.style.fontWeight = "bold"
    for (const coin of coins) {
        element.innerText = coin.symbol.toLocaleUpperCase();
    }

    return element;
};




function createProductPriceElement(coins: Coin[]): HTMLParagraphElement {
    let element = document.createElement('p');

    for (const coin of coins) {
        element.innerHTML = `$${coin.market_data.current_price.usd} </br> &euro;${coin.market_data.current_price.eur} </br> &#8362;${coin.market_data.current_price.ils}`;
    }

    return element;
};




function createProductDescriptionElement(coins: Coin[]): HTMLParagraphElement {
    let element = document.createElement('p');

    for (const coin of coins) {
        element.innerText = coin.name;
    }

    return element;
};




function createProductToggle(coins: Coin[]) {

    let checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.classList.add("form-check-input");

    for (const coin of coins) {
        checkbox.id = coin.name;
    };

    return checkbox;
};




function createMoreInfoButton(coin: Coin) {
    let element = document.createElement('button');
    element.type = 'button';
    element.classList.add('btn', 'btn-outline-dark', 'dropdown-toggle');
    element.setAttribute('data-bs-toggle', 'collapse');
    element.setAttribute('data-bs-target', `#${coin.id}-info`);
    element.append('More Info');

    return element;
};




async function refreshCache(coin: Coin) {
    let coinData: Coin = await fetch(API_URL + '/' + coin.id).then(res => res.json());
    coinsCache[coin.id] = {
        date: (new Date()).getTime(),
        usd: coinData.market_data.current_price.usd,
        eur: coinData.market_data.current_price.eur,
        ils: coinData.market_data.current_price.ils
    };
};



async function getCoinFromCache(coin: Coin) {
    let diff = (new Date()).getTime() - coinsCache[coin.id].date;
    if (diff > CACHE_TIME) {
        await refreshCache(coin);
    }

    return coinsCache[coin.id];
};


