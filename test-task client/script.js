async function init(){
    main.innerHTML = ""
    //Список банков
    let jbank
    jbank = await getAllBanks()
    for(let key in jbank){
        main.innerHTML +=
            `
            <div class="bank_section">
                <h4> Банк "${jbank[key].name}"</h4>
                <div class="buttons_section">
                    <button type="button" class="clients_button"  value = "${jbank[key].id}">Список клиетов</button>
                    <button type="button" class="credits_button"  value = "${jbank[key].id}">Список кредитов</button>
                </div>
                <div class="buttons_section"> 
                    <button type="button" class="new_client_button" value = "${jbank[key].id}">Новый клиент</button>
                    <button type="button" class="new_credit_button" value = "${jbank[key].id}">Новый кредит</button>
                </div>
                <div class="buttons_section">
                    <button type="button" class="delete_bank" value = "${jbank[key].id}">Удалить Банк</button>
                </div>
            </div>
            `
    }
    main.innerHTML +=
        `
        <div class="buttons_section">
            <button type="button" class="form_button" id = "new_bank_button">Новый банк</button>
        </div>
        `
    deleteBank()
    //Новый банк
    let newBankButton = document.getElementById("new_bank_button")
    newBankButton.onclick = function(){
        main.innerHTML =
            `
            <button type="button" class="bank-form__button" id = "to_main">Назад</button>
            <form class="bank-form">
                <div class="bank-form__title">Новый Банк</div>
                <input class="bank-form__input" type="text" placeholder="Название банка" id="bank_name">
                <button type="button" class="bank-form__button" id = "bank_button">Отправить</button>
            </form>
            `
        toMainUI()
        newBankUI()
    }
    //Список клиентов
    let clientsButtons = document.querySelectorAll(".clients_button")
    clientsButtons.forEach(clientsButton => {
        clientsButton.onclick = async function(){
            let currentBank = clientsButton.value
            jclient = await getClientsByBank(currentBank)
            main.innerHTML =
            `
            <button type="button" class="bank-form__button" id = "to_main">Назад</button>
            `
            for (let key in jclient){
                main.innerHTML +=
                `
                <div>
                    <h4> Клиент ${jclient[key].fullName}</h4>
                    <h5> Телефон: ${jclient[key].phoneNumber}</h5>
                    <h5> Почта: ${jclient[key].email}</h5>
                    <h5> Пасспорт: ${jclient[key].passportId}</h5>
                    <div class="buttons_section">
                        <button type="button" class="offers_button" value=${jclient[key].id}>Кредитные предложения</button>
                        <button type="button" class="new_offer_button" id = "bank_button" value = ${jclient[key].id}>Создать кредитное предложение</button>
                    </div>
                    <div class="buttons_section">
                        <button type="button" class="delete_client" value = "${jclient[key].id}">Удалить Клиента</button>
                    </div>
                </div>
                `
            }
            toMainUI()
            deleteClient()
            //Новый оффер клиента
            let newOfferButtons = document.querySelectorAll(".new_offer_button")
            newOfferButtons.forEach(newOfferButton => {
                newOfferButton.onclick = async function(){
                    jcredit = await getCreditsByBank(currentBank)
                    let currentClient = newOfferButton.value
                    main.innerHTML =
                    `
                    <button type="button" class="bank-form__button" id = "to_main">Назад</button>
                    `
                    for(key in jcredit){
                        main.innerHTML +=
                        `
                        <div>
                            <h4> Лимит по кредиту: ${jcredit[key].limit}</h4>
                            <h4> Процент: ${jcredit[key].percent}%</h4>
                        </div>
                        <button type="button" class="offer_button" value = "${key}">Создать Оффер</button>
                        `
                    }
                    toMainUI()
                    let offerButtons = document.querySelectorAll(".offer_button")
                    offerButtons.forEach(offerButton => {
                        offerButton.onclick = function(){
                            let curentCredit = jcredit[offerButton.value]
                            main.innerHTML =
                            `
                            <button type="button" class="bank-form__button" id = "to_main">Назад</button>
                            <form class="bank-form">
                                <div class="bank-form__title">Кредитное предложение</div>
                                <input class="bank-form__input" type="number" placeholder="Сумма Оффера" id="limit" max="${curentCredit.limit}">
                                <input id="months" type="number" min="6" max="24" placeholder="Число месяцев">
                                <div id="offer_data">
                                <h4>Сумма оффера: -</h4>
                                <h4>Дата закрытия: -</h4>
                                <h4>Процент: ${curentCredit.percent}%</h4>
                                <h4>Сумма выплат: -</h4>
                                </div>
                                <button type="submit" class="bank-form__button" id="sendOffer">Отправить</button>
                            </form>
                            `
                            toMainUI()
                            let limitInput = document.getElementById("limit")
                            let monthInput = document.getElementById("months")
                            let offerData = document.getElementById("offer_data")
                            let now, months, summ
                            limitInput.oninput = function(){
                                now = new Date()
                                months = monthInput.value
                                if(months > 24){
                                    monthInput.value = 24
                                    months = monthInput.value
                                }
                                if(months < 6){
                                    monthInput.value = 6
                                    months = monthInput.value
                                }
                                if(limitInput.value > curentCredit.limit){
                                    limitInput.value = curentCredit.limit
                                }
                                if(months){
                                    now.setMonth(now.getMonth() + parseFloat(months))
                                }else{
                                    now.setMonth(now.getMonth() + parseFloat(6))
                                }
                                let exp = -months
                                summ = Math.round(months*(document.getElementById("limit").value*((curentCredit.percent/(100*12))/(1-Math.pow((1+(curentCredit.percent/(100*12))),exp)))))
                                console.log(months)
                                offerData.innerHTML = 
                                `
                                <h4>Сумма оффера: ${document.getElementById("limit").value}</h4>
                                <h4>Дата закрытия: ${now.getDate()}.${now.getMonth()+1}.${now.getFullYear()}</h4>
                                <h4>Процент: ${summ - document.getElementById("limit").value}</h4>
                                <h4>Сумма выплат: ${summ}</h4>
                                `
                            }
                            monthInput.oninput = function(){
                                now = new Date()
                                months = monthInput.value
                                if(months > 24){
                                    monthInput.value = 24
                                    months = monthInput.value
                                }
                                if(months < 6){
                                    monthInput.value = 6
                                    months = monthInput.value
                                }
                                if(limitInput.value > curentCredit.limit){
                                    limitInput.value = curentCredit.limit
                                }
                                if(months){
                                    now.setMonth(now.getMonth() + parseFloat(months))
                                }else{
                                    now.setMonth(now.getMonth() + parseFloat(6))
                                }
                                let exp = -months
                                summ = Math.round(months*(document.getElementById("limit").value*((curentCredit.percent/(100*12))/(1-Math.pow((1+(curentCredit.percent/(100*12))),exp)))))
                                console.log(months)
                                offerData.innerHTML = 
                                `
                                <h4>Сумма оффера: ${document.getElementById("limit").value}</h4>
                                <h4>Дата закрытия: ${now.getDate()}.${now.getMonth()+1}.${now.getFullYear()}</h4>
                                <h4>Процент: ${summ - document.getElementById("limit").value}</h4>
                                <h4>Сумма выплат: ${summ}</h4>
                                `
                            }
                            sendOffer = document.getElementById("sendOffer")
                            sendOffer.onclick = function(){
                                console.log(monthInput.value)
                                postOffer(limitInput.value, curentCredit.id, currentClient, now, months, summ - document.getElementById("limit").value)
                            }
                        }
                    });
                }
            });
            //Список кредитных офферов клиента
            let OfferButtons = document.querySelectorAll(".offers_button")
            OfferButtons.forEach(OfferButton => {
                OfferButton.onclick = async function(){
                    joffer = await getOffersByClient(OfferButton.value)
                    main.innerHTML =
                    `
                    <button type="button" class="bank-form__button" id = "to_main">Назад</button>
                    `
                    for(let key in joffer){
                        main.innerHTML +=
                        `
                        <div>
                            <h4>Оффер ${+key+1}</h4>
                            <h5>Сумма кредита: ${joffer[key].value}</h5>
                            <h5>Общая сумма платежей: ${joffer[key].graph.value}</h5>
                            <h5>Ежемесячный платеж: ${Math.round(joffer[key].graph.value/joffer[key].graph.months)}</h5>
                            <h5>Кредитный период: ${joffer[key].graph.months} месяцев</h5>
                        </div>
                        `
                        main.innerHTML +=
                        `
                        <h4>Даты платежей:</h4>
                        `
                        let  now = new Date(joffer[key].graph.date)
                        for(let months = joffer[key].graph.months; months>0; months--){
                            console.log(months)
                            main.innerHTML +=
                            `
                            <h5>${now.getDate()}.${now.getMonth()+1-parseFloat(months)}.${now.getFullYear()}</h5>
                            `
                        }
                    }
                    toMainUI()
                }
            });
        }
    });
    //Новый клиент
    let newClientButtons = document.querySelectorAll(".new_client_button")
    newClientButtons.forEach(newClientsButton => {
        newClientsButton.onclick = function(){
            main.innerHTML =
            `
            <button type="button" class="bank-form__button" id = "to_main">Назад</button>
            <form class="bank-form">
            <div class="bank-form__title">Клиент</div>
                <input class="bank-form__input" type="text" placeholder="Имя" id="fullName">
                <input class="bank-form__input" type="tel" placeholder="Телефон" id="phoneNumber">
                <input class="bank-form__input" type="email" placeholder="Email" id="email">
                <input class="bank-form__input" type="text" placeholder="Пасспорт" id="passportId">
                <button type="button" class="bank-form__button" id="client_button" value =${newClientsButton.value}>Отправить</button>
            </form>
            `
        toMainUI()
        newClientUI()
        }
    });
    //Список кредитов
    let creditsButtons = document.querySelectorAll(".credits_button")
    creditsButtons.forEach(creditsButton => {
        creditsButton.onclick = async function(){
            jcredit = await getCreditsByBank(creditsButton.value)
            main.innerHTML =
            `
            <button type="button" class="bank-form__button" id = "to_main">Назад</button>
            `
            for (let key in jcredit){
                main.innerHTML +=
                `
                <div class="bank_section">
                    <div>
                    <h4> Лимит по кредиту: ${jcredit[key].limit}</h4>
                    <h4> Процент: ${jcredit[key].percent}%</h4>
                    </div>
                    <div class="buttons_section">
                    <button type="button" class="delete_credit" value = "${jcredit[key].id}">Удалить Кредит</button>
                    </div>
                </div>
                `
            }
        toMainUI()
        deleteCredit()
        }
    });
    //Новый кредит
    let newCreditButtons = document.querySelectorAll(".new_credit_button")
    newCreditButtons.forEach(newCreditButton => {
        newCreditButton.onclick = function(){
            main.innerHTML =
            `
            <button type="button" class="bank-form__button" id = "to_main">Назад</button>
            <form class="bank-form">
                <div class="bank-form__title">Кредит</div>
                <input class="bank-form__input" type="number" placeholder="Лимит по кредиту" id="limit">
                <input class="bank-form__input" type="number" placeholder="Процент по кредиту" id="percent">
                <button type="button" class="bank-form__button" id="credit_button" value=${newCreditButton.value}>Отправить</button>
            </form>
            `
            let creditButton = document.getElementById("credit_button")
            creditButton.onclick = function(){
                let limit = document.getElementById("limit").value,
                percent = document.getElementById("percent").value
                postCredit(limit, percent, creditButton.value)
            }
        toMainUI()
        newCredutUI()
        }
    });    
}

function deleteBank(){
    let deleteButtons = document.querySelectorAll(".delete_bank")
    deleteButtons.forEach(deleteButton => {
        deleteButton.onclick = function(){
            fetch('http://localhost:8080/api/bank/delete?id='+deleteButton.value,{ method: 'DELETE', headers: {'Access-Control-Allow-Origin':'*'}}).then(init())
        }
    });
}

function deleteClient(){
    let deleteButtons = document.querySelectorAll(".delete_client")
    deleteButtons.forEach(deleteButton => {
        deleteButton.onclick = function(){
            fetch('http://localhost:8080/api/client/delete?id='+deleteButton.value,{ method: 'DELETE', headers: {'Access-Control-Allow-Origin':'*'}}).then(init())
        }
    });
}

function deleteCredit(){
    let deleteButtons = document.querySelectorAll(".delete_credit")
    deleteButtons.forEach(deleteButton => {
        deleteButton.onclick = function(){
            fetch('http://localhost:8080/api/credit/delete?id='+deleteButton.value,{ method: 'DELETE', headers: {'Access-Control-Allow-Origin':'*'}}).then(init())
        }
    });
}

function newCredutUI(){
    let creditButton = document.getElementById("credit_button")
        creditButton.onclick = function(){
            let limit = document.getElementById("limit").value,
            percent = document.getElementById("percent").value
            postCredit(limit, percent, creditButton.value)
        }
}

function newClientUI(){
    let clientButton = document.getElementById("client_button")
        clientButton.onclick = function(){
            let fullName = document.getElementById("fullName").value,
            phoneNumber = document.getElementById("phoneNumber").value,
            email = document.getElementById("email").value,
            passportId = document.getElementById("passportId").value
            postClient(fullName,phoneNumber,email,passportId,clientButton.value)
        }
}

function toMainUI(){
    let toMain = document.getElementById("to_main")
    toMain.onclick = function(){
        main.innerHTML = ""
        init()
    }
}

function newBankUI(){
    let bankButton = document.getElementById("bank_button")
    bankButton.onclick = function(){
        let bankName = document.getElementById("bank_name").value
        postBank(bankName)
    }
}

//не используется, но на случай расширения функционала
/*
async function getAllClients() {
    let client = await fetch('http://localhost:8080/api/client',{ method: 'GET', headers: {'Access-Control-Allow-Origin':'*'}})
    let jclient = await client.json();
    return jclient
}
*/

async function getAllBanks() {
    let bank = await fetch('http://localhost:8080/api/bank',{ method: 'GET', headers: {'Access-Control-Allow-Origin':'*'}})
    let jbank = await bank.json();
    return jbank
}

//не используется, но на случай расширения функционала
/*
async function getAllCredits() {
    let credit = await fetch('http://localhost:8080/api/credit',{ method: 'GET', headers: {'Access-Control-Allow-Origin':'*'}})
    let jcredit = await credit.json();
    return jcredit
}
*/

async function getClientsByBank(id) {
    currentBank = id
    let client = await fetch('http://localhost:8080/api/bank/clients?id='+id,{ method: 'GET', headers: {'Access-Control-Allow-Origin':'*'}})
    let jclient = await client.json();
    return jclient
}

async function getCreditsByBank(id) {
    let credit = await fetch('http://localhost:8080/api/bank/credits?id='+id,{ method: 'GET', headers: {'Access-Control-Allow-Origin':'*'}})
    let jcredit = await credit.json();
    return jcredit
}

async function getOffersByClient(id) {
    let offer = await fetch('http://localhost:8080/api/client/offers?id='+id,{ method: 'GET', headers: {'Access-Control-Allow-Origin':'*'}})
    let joffer = await offer.json();
    return joffer
}

async function postBank(name){
    fetch('http://localhost:8080/api/bank/post',{ method: "POST", headers: {'Access-Control-Allow-Origin':'*'}, body: name}).then(init())
}

async function postClient(fullName, phoneNumber, email, passportId, id){
    fetch('http://localhost:8080/api/client/post',{ method: "POST", headers: {'Access-Control-Allow-Origin':'*', 'Content-Type':'application/json'}, body: JSON.stringify({fullName, phoneNumber, email, passportId, bank: {id,name}})}).then(init())
}

async function postCredit(limit, percent, id){
    fetch('http://localhost:8080/api/credit/post',{ method: "POST", headers: {'Access-Control-Allow-Origin':'*', 'Content-Type':'application/json'}, body: JSON.stringify({limit, percent, bank: {id}})}).then(init())
}

async function postOffer(value, creditId, clientId, date, months, percent){
    const offer = {
        value:value,
        credit : {id:creditId}, 
        client : {id:clientId}, 
        graph: {date, months, value:+value+(+percent), body:value, percent}
    }
    fetch('http://localhost:8080/api/offer/post',{ method: "POST", headers: {'Access-Control-Allow-Origin':'*', 'Content-Type':'application/json'}, body: JSON.stringify(offer)}).then(init())
}

init()