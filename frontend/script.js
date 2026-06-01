const BASE_URL = "http://localhost:8080";

// SIGNUP
async function signup() {

    const user = {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        password: document.getElementById("password").value
    };

    const response = await fetch(
        `${BASE_URL}/api/auth/signup`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(user)
        }
    );

    const data = await response.json();

    document.getElementById("message")
        .innerText = data.message;

    if(data.success){
        window.location.href = "login.html";
    }
}

// LOGIN
async function login() {

    const loginData = {
        email: document.getElementById("loginEmail").value,
        password: document.getElementById("loginPassword").value
    };

    const response = await fetch(
        `${BASE_URL}/api/auth/login`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(loginData)
        }
    );

    const data = await response.json();

    if(data.success){

        localStorage.setItem(
            "user",
            JSON.stringify(data.user)
        );

        window.location.href = "dashboard.html";

    } else {

        document.getElementById("loginMessage")
            .innerText = data.message;
    }
}

// LOAD DASHBOARD
async function loadDashboard(){

    const response = await fetch(
        `${BASE_URL}/api/dashboard/stats`
    );

    const data = await response.json();

    document.getElementById("totalItems")
        .innerText = data.totalItems;

    document.getElementById("expiredItems")
        .innerText = data.expiredItems;

    document.getElementById("expiringSoon")
        .innerText = data.expiringSoon;

    loadCategories();
    loadProfile();
    loadNotifications();
}

// LOAD CATEGORIES
async function loadCategories(){

    const response = await fetch(
        `${BASE_URL}/api/category/all`
    );

    const categories = await response.json();

    let html = "";

    categories.forEach(category => {

     html += `
<div class="card category-card">

    <h3 onclick="openCategory(${category.id})">
        ${category.name}
    </h3>

    <button onclick="deleteCategory(${category.id})">
        Remove
    </button>

</div>
`;
    });

    document.getElementById("categories")
        .innerHTML = html;
}


function openCategory(categoryId){

    localStorage.setItem(
        "categoryId",
        categoryId
    );

    window.location.href = "category.html";
}


// ADD CATEGORY
async function addCategory(){

    const category = {
        name: document.getElementById("categoryName").value
    };

    await fetch(
        `${BASE_URL}/api/category/add`,
        {
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify(category)
        }
    );

    loadCategories();
}

// LOAD CATEGORY PAGE
async function loadCategoryPage(){

    const categoryId =
        localStorage.getItem("categoryId");

    const response = await fetch(
        `${BASE_URL}/api/items/category/${categoryId}`
    );

    const items = await response.json();

    // TOTAL ITEMS
    document.getElementById("categoryTotal")
        .innerText = items.length;

    let expired = 0;

    let expiring = 0;

    const today = new Date();

    // CALCULATE COUNTS
    items.forEach(item => {

        const expiryDate =
            new Date(item.expiryDate);

        const diffDays =
            (expiryDate - today)
            / (1000 * 60 * 60 * 24);

        if(diffDays < 0){
            expired++;
        }

        if(diffDays >= 0 && diffDays <= 3){
            expiring++;
        }
    });

    document.getElementById("categoryExpired")
        .innerText = expired;

    document.getElementById("categoryExpiring")
        .innerText = expiring;

    // SHOW ITEMS
    let html = "";

    items.forEach(item => {

        html += `
    <div class="card item-card">

        <h3>${item.name}</h3>

        <p>
            Quantity:
            ${item.quantity} ${item.unit}
        </p>

        <p>
            Expiry Date:
            ${item.expiryDate}
        </p>

        <button onclick="deleteItem(${item.id})">
            Remove
        </button>

    </div>
        `;
    });

    document.getElementById("itemsList")
        .innerHTML = html;
}

// ADD ITEM
async function addItem(){

    const categoryId =
        localStorage.getItem("categoryId");

    const item = {

        name:
        document.getElementById("itemName").value,

        quantity:
        document.getElementById("quantity").value,

        unit:
         document.getElementById("unit").value,

        expiryDate:
        document.getElementById("expiryDate").value,

        category:{
            id: categoryId
        }
    };

    await fetch(
        `${BASE_URL}/api/items/add`,
        {
            method:"POST",

            headers:{
                "Content-Type":"application/json"
            },

            body:JSON.stringify(item)
        }
    );

    // CLEAR INPUTS
    document.getElementById("itemName").value = "";

    document.getElementById("quantity").value = "";

    document.getElementById("expiryDate").value = "";

    loadCategoryPage();
}

// LOAD NOTIFICATIONS
async function loadNotifications(){
    console.log("Notifications Loaded");
    const response = await fetch(
        `${BASE_URL}/api/items/all`
    );

    const items = await response.json();

    const today = new Date();

    let html = "";

    items.forEach(item => {

        const expiryDate =
            new Date(item.expiryDate);

        const diffDays =
            Math.ceil(
                (expiryDate - today)
                / (1000 * 60 * 60 * 24)
            );

        // EXPIRED
        if(diffDays < 0){

            html += `
                <div class="notification expired">

                    ❌ ${item.name} is expired

                </div>
            `;
        }

        // EXPIRING SOON
        else if(diffDays <= 3){

            html += `
                <div class="notification expiring">

                    ⚠ ${item.name}
                    expires in ${diffDays} day(s)

                </div>
            `;
        }
    });

    document.getElementById("notifications")
        .innerHTML = html;
}

async function deleteItem(itemId){

    await fetch(
        `${BASE_URL}/api/items/delete/${itemId}`,
        {
            method:"DELETE"
        }
    );

    loadCategoryPage();
}

async function deleteItem(itemId){

    await fetch(
        `${BASE_URL}/api/items/delete/${itemId}`,
        {
            method:"DELETE"
        }
    );

    loadCategoryPage();
}

function loadProfile(){

    const user =
        JSON.parse(localStorage.getItem("user"));

    document.getElementById("profileBox")
        .innerHTML = `
            <h3>${user.name}</h3>
            <p>${user.email}</p>
        `;
}

async function deleteCategory(categoryId){

    if(!confirm("Delete this category?")){
        return;
    }

    await fetch(
        `${BASE_URL}/api/category/delete/${categoryId}`,
        {
            method:"DELETE"
        }
    );

    loadCategories();
}

function showExpiredItems(){
    window.location.href =
        "expired-items.html";
}

async function loadExpiredItems(){

    const response = await fetch(
        `${BASE_URL}/api/items/expired`
    );

    const items = await response.json();

    let html = "";

    items.forEach(item => {

        html += `
        <div class="card">

            <h3>${item.name}</h3>

            <p>
                Quantity:
                ${item.quantity} ${item.unit}
            </p>

            <p>
                Expired On:
                ${item.expiryDate}
            </p>

        </div>
        `;
    });

    document.getElementById("expiredList")
        .innerHTML = html;
}


function showTotalItems()
{
    window.location.href="total-items.html";
}
function showExpiringItems()
{
    window.location.href="expiring-items.html";
}

// load all the items

async function loadAllItems(){

    const response = await fetch(
        `${BASE_URL}/api/items/all`
    );

    const items = await response.json();

    let html = "";

    items.forEach(item => {

        html += `
        <div class="card">

            <h3>${item.name}</h3>

            <p>
                ${item.quantity} ${item.unit}
            </p>

            <p>
                ${item.expiryDate}
            </p>

        </div>
        `;
    });

    document.getElementById("allItemsList")
        .innerHTML = html;
}

// load expiring items

async function loadExpiringItems(){

    const response = await fetch(
        `${BASE_URL}/api/items/expiring`
    );

    const items = await response.json();

    let html = "";

    items.forEach(item => {

        html += `
        <div class="card">

            <h3>${item.name}</h3>

            <p>
                Quantity:
                ${item.quantity} ${item.unit}
            </p>

            <p>
                Expiry:
                ${item.expiryDate}
            </p>

        </div>
        `;
    });

    document.getElementById("expiringList")
        .innerHTML = html;
}

// load notifications
async function loadNotifications(){

    const response =
        await fetch(`${BASE_URL}/api/items/all`);

    const items =
        await response.json();

    let html = "";

    const today = new Date();

    today.setHours(0,0,0,0);

    items.forEach(item => {

        const expiryDate =
            new Date(item.expiryDate);

        expiryDate.setHours(0,0,0,0);

        const diffDays =
            (expiryDate - today)
            / (1000*60*60*24);

        if(diffDays < 0){

            html += `
            <div class="expired-notification">

                ❌ ${item.name}
                has expired

            </div>
            `;
        }

        else if(diffDays <= 3){

            html += `
            <div class="notification">

                ⚠ ${item.name}
                expires in ${diffDays} day(s)

            </div>
            `;
        }
    });

    if(html === ""){

        html =
        "<p>No notifications 🎉</p>";
    }

    document.getElementById("notifications")
        .innerHTML = html;
}