/* =========================================================
   BIZA SaaS
   Supabase Connected Edition
   ========================================================= */


/* =========================================================
   SUPABASE CONFIG
   ========================================================= */

const SUPABASE_URL =
    "https://rellsmuqjhcfhenjkbxa.supabase.co";

const SUPABASE_ANON_KEY =
    "sb_publishable_PRT5-T0k-_AiSvy6lrJV-g_r7wLQjRk";


const {
    createClient
} = window.supabase;


const supabaseClient = createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);


/* =========================================================
   STATE
   ========================================================= */

const state = {

    session: null,

    user: null,

    profile: null,

    store: null,

    products: [],

    inventory: [],

    sales: [],

    cart: [],

    loading: false

};


/* =========================================================
   DOM
   ========================================================= */

const $ = id =>
    document.getElementById(id);


/* =========================================================
   NETWORK BACKGROUND
   ========================================================= */

function createNetwork(){

    const canvas = $("network");

    const ctx = canvas.getContext("2d");

    let width = 0;
    let height = 0;

    let nodes = [];

    function resize(){

        width = canvas.width =
            window.innerWidth * devicePixelRatio;

        height = canvas.height =
            window.innerHeight * devicePixelRatio;

        canvas.style.width =
            window.innerWidth + "px";

        canvas.style.height =
            window.innerHeight + "px";

        ctx.setTransform(
            devicePixelRatio,
            0,
            0,
            devicePixelRatio,
            0,
            0
        );

        createNodes();

    }


    function createNodes(){

        const w = window.innerWidth;
        const h = window.innerHeight;

        const count =
            w < 700 ? 42 : 72;

        nodes = [];

        for(let i=0;i<count;i++){

            nodes.push({

                x:Math.random()*w,
                y:Math.random()*h,

                vx:(Math.random()-.5)*.22,
                vy:(Math.random()-.5)*.22,

                r:Math.random()*1.6+.7,

                phase:Math.random()*Math.PI*2

            });

        }

    }


    function draw(){

        const w = window.innerWidth;
        const h = window.innerHeight;

        ctx.clearRect(0,0,w,h);


        for(const n of nodes){

            n.x += n.vx;
            n.y += n.vy;

            n.phase += .025;

            if(n.x < -20 || n.x > w+20){
                n.vx *= -1;
            }

            if(n.y < -20 || n.y > h+20){
                n.vy *= -1;
            }

        }


        const maxDistance =
            w < 700 ? 145 : 185;


        for(let i=0;i<nodes.length;i++){

            for(let j=i+1;j<nodes.length;j++){

                const a = nodes[i];
                const b = nodes[j];

                const dx = a.x-b.x;
                const dy = a.y-b.y;

                const distance =
                    Math.sqrt(dx*dx+dy*dy);

                if(distance > maxDistance)
                    continue;


                const alpha =
                    (1-distance/maxDistance)*.22;


                ctx.beginPath();

                ctx.moveTo(a.x,a.y);
                ctx.lineTo(b.x,b.y);

                ctx.strokeStyle =
                    `rgba(40,145,255,${alpha})`;

                ctx.lineWidth = .7;

                ctx.stroke();


                const pulse =
                    (Math.sin(
                        performance.now()/900 +
                        i*.7 +
                        j*.3
                    )+1)/2;


                if(pulse > .94){

                    const t =
                        (pulse-.94)/.06;

                    const x =
                        a.x+(b.x-a.x)*t;

                    const y =
                        a.y+(b.y-a.y)*t;

                    ctx.beginPath();

                    ctx.arc(
                        x,
                        y,
                        1.5,
                        0,
                        Math.PI*2
                    );

                    ctx.fillStyle =
                        "rgba(80,210,255,.8)";

                    ctx.fill();

                }

            }

        }


        for(const n of nodes){

            const pulse =
                (Math.sin(n.phase)+1)/2;

            const glow =
                5 + pulse*8;

            ctx.beginPath();

            ctx.arc(
                n.x,
                n.y,
                n.r,
                0,
                Math.PI*2
            );

            ctx.shadowBlur = glow;

            ctx.shadowColor =
                "rgba(40,180,255,.8)";

            ctx.fillStyle =
                "rgba(100,210,255,.82)";

            ctx.fill();

            ctx.shadowBlur = 0;

        }


        requestAnimationFrame(draw);

    }


    window.addEventListener(
        "resize",
        resize
    );

    resize();
    draw();

}


/* =========================================================
   TOAST
   ========================================================= */

let toastTimer = null;

function toast(
    message,
    type = "normal"
){

    const element = $("toast");

    element.textContent = message;

    element.classList.remove(
        "show"
    );

    clearTimeout(toastTimer);

    if(type === "error"){
        element.style.borderColor =
            "rgba(255,70,110,.25)";
    }
    else{
        element.style.borderColor =
            "rgba(255,255,255,.08)";
    }

    requestAnimationFrame(()=>{

        element.classList.add("show");

    });

    toastTimer = setTimeout(()=>{

        element.classList.remove("show");

    },2800);

}


/* =========================================================
   ERROR
   ========================================================= */

function readableError(error){

    if(!error)
        return "خطای نامشخص";

    const message =
        error.message ||
        error.error_description ||
        String(error);


    const translations = {

        "Invalid login credentials":
            "نام کاربری یا رمز عبور اشتباه است.",

        "Email not confirmed":
            "ایمیل حساب تأیید نشده است.",

        "Barcode already exists":
            "این بارکد قبلاً ثبت شده است.",

        "Permission denied":
            "دسترسی لازم برای این عملیات وجود ندارد.",

        "Product not found":
            "کالا پیدا نشد.",

        "Insufficient stock":
            "موجودی کافی نیست.",

        "Sale must contain at least one item":
            "سبد فروش خالی است."

    };


    for(const key in translations){

        if(message.includes(key))
            return translations[key];

    }


    return message;

}


/* =========================================================
   FORMAT
   ========================================================= */

function number(value){

    const n =
        Number(value || 0);

    return n.toLocaleString(
        "fa-IR"
    );

}


function money(value){

    return number(value);

}


function formatDate(value){

    if(!value)
        return "-";

    const date =
        new Date(value);

    return date.toLocaleString(
        "fa-IR",
        {
            year:"numeric",
            month:"2-digit",
            day:"2-digit",
            hour:"2-digit",
            minute:"2-digit"
        }
    );

}


function todayRange(){

    const now = new Date();

    const start = new Date(now);

    start.setHours(
        0,0,0,0
    );

    const end = new Date(now);

    end.setHours(
        23,59,59,999
    );

    return {
        from:start.toISOString(),
        to:end.toISOString()
    };

}


/* =========================================================
   AUTH
   ========================================================= */

async function login(
    username,
    password
){

    $("loginError").textContent = "";

    try{

        if(
            !username.trim() ||
            !password
        ){
            throw new Error(
                "نام کاربری و رمز عبور را وارد کنید."
            );
        }


        const {
            data:emailData,
            error:emailError
        } =
            await supabaseClient
                .rpc(
                    "get_login_email",
                    {
                        p_username:
                            username.trim()
                    }
                );


        if(emailError)
            throw emailError;


        if(!emailData){

            throw new Error(
                "نام کاربری پیدا نشد."
            );

        }


        const {
            data,
            error
        } =
            await supabaseClient
                .auth
                .signInWithPassword({

                    email:emailData,

                    password

                });


        if(error)
            throw error;


        state.session =
            data.session;

        state.user =
            data.user;


        await loadUserData();

        showApp();

        await loadDashboard();

    }
    catch(error){

        $("loginError").textContent =
            readableError(error);

    }

}


/* =========================================================
   LOAD USER
   ========================================================= */

async function loadUserData(){

    const {
        data,
        error
    } =
        await supabaseClient
            .rpc(
                "get_my_user_data"
            );


    if(error)
        throw error;


    if(!data)
        throw new Error(
            "اطلاعات کاربر پیدا نشد."
        );


    state.profile =
        data.profile;

    state.store =
        data.store;


    if(
        !state.profile ||
        state.profile.role !==
            "store_user"
    ){

        throw new Error(
            "این بخش مخصوص کاربران فروشگاه است."
        );

    }


    if(
        !state.store
    ){

        throw new Error(
            "فروشگاه کاربر پیدا نشد."
        );

    }


    if(
        state.store.status !==
            "active"
    ){

        throw new Error(
            "این فروشگاه فعال نیست."
        );

    }


    updateStoreUI();

}


/* =========================================================
   STORE UI
   ========================================================= */

function updateStoreUI(){

    const storeName =
        state.store?.name ||
        "فروشگاه";

    const code =
        state.store?.code ||
        "";

    const username =
        state.profile?.username ||
        "";


    $("storeName").textContent =
        storeName;

    $("storeCode").textContent =
        code;

    $("heroStoreName").textContent =
        storeName;

    $("heroUserName").textContent =
        username ?
        `کاربر: ${username}` :
        "";

    $("sideStoreName").textContent =
        storeName;

}


/* =========================================================
   SHOW APP
   ========================================================= */

function showApp(){

    $("loginPage")
        .classList.add("hidden");

    $("app")
        .classList.remove("hidden");

}


/* =========================================================
   LOGOUT
   ========================================================= */

async function logout(){

    await supabaseClient
        .auth
        .signOut();

    state.session = null;
    state.user = null;
    state.profile = null;
    state.store = null;

    $("app")
        .classList.add("hidden");

    $("loginPage")
        .classList.remove("hidden");

    $("loginUsername").value = "";
    $("loginPassword").value = "";

}


/* =========================================================
   PRODUCTS
   ========================================================= */

async function loadProducts(){

    const {
        data,
        error
    } =
        await supabaseClient
            .from("products")
            .select(`
                id,
                store_id,
                barcode,
                name,
                description,
                unit,
                current_purchase_price,
                current_sale_price,
                is_active,
                created_at,
                updated_at
            `)
            .eq(
                "store_id",
                state.store.id
            )
            .eq(
                "is_active",
                true
            )
            .order(
                "name",
                {
                    ascending:true
                }
            );


    if(error)
        throw error;


    state.products =
        data || [];

    return state.products;

}


/* =========================================================
   INVENTORY
   ========================================================= */

async function loadInventory(){

    const {
        data,
        error
    } =
        await supabaseClient
            .rpc(
                "get_inventory_report"
            );


    if(error)
        throw error;


    state.inventory =
        data || [];

    return state.inventory;

}


/* =========================================================
   SALES
   ========================================================= */

async function loadSales(){

    const {
        data,
        error
    } =
        await supabaseClient
            .rpc(
                "get_sales_report",
                {
                    p_from:null,
                    p_to:null
                }
            );


    if(error)
        throw error;


    state.sales =
        data || [];

    return state.sales;

}


/* =========================================================
   DASHBOARD
   ========================================================= */

async function loadDashboard(){

    try{

        await Promise.all([
            loadProducts(),
            loadInventory(),
            loadSales()
        ]);


        renderDashboard();

    }
    catch(error){

        console.error(error);

        toast(
            readableError(error),
            "error"
        );

    }

}


function renderDashboard(){

    const productCount =
        state.products.length;


    const inventoryCount =
        state.inventory.reduce(
            (sum,item)=>
                sum + Number(item.stock || 0),
            0
        );


    const range =
        todayRange();


    const todaySales =
        state.sales.filter(
            sale => {

                const time =
                    new Date(
                        sale.created_at
                    ).getTime();

                return (
                    time >=
                        new Date(range.from).getTime()
                    &&
                    time <=
                        new Date(range.to).getTime()
                );

            }
        );


    const completedToday =
        todaySales.filter(
            sale =>
                sale.status ===
                "completed"
        );


    const salesTotal =
        completedToday.reduce(
            (sum,sale)=>
                sum +
                Number(
                    sale.total || 0
                ),
            0
        );


    $("statProducts").textContent =
        number(productCount);

    $("statInventory").textContent =
        number(inventoryCount);

    $("statSales").textContent =
        money(salesTotal);

    $("statInvoices").textContent =
        number(
            completedToday.length
        );


    renderRecentSales();

}


/* =========================================================
   RECENT SALES
   ========================================================= */

function renderRecentSales(){

    const container =
        $("salesList");

    const list =
        state.sales.slice(0,6);


    if(!list.length){

        container.innerHTML = `
            <div class="empty-state">
                هنوز فروشی ثبت نشده است.
            </div>
        `;

        return;

    }


    container.innerHTML =
        list.map(
            sale => `

                <div class="sale-row">

                    <div class="sale-row-main">

                        <div class="sale-number">
                            فاکتور ${number(sale.invoice_number)}
                        </div>

                        <div class="sale-date">
                            ${formatDate(sale.created_at)}
                        </div>

                        <div class="status ${sale.status}">
                            ${
                                sale.status ===
                                "completed"
                                ?
                                "تکمیل شده"
                                :
                                "لغو شده"
                            }
                        </div>

                    </div>

                    <div class="sale-total">
                        ${money(sale.total)}
                    </div>

                </div>

            `
        ).join("");

}


/* =========================================================
   NAVIGATION
   ========================================================= */

function showPage(
    pageId
){

    document
        .querySelectorAll(".page")
        .forEach(
            page =>
                page.classList.remove("active")
        );


    const page =
        $(pageId);

    if(page)
        page.classList.add("active");


    document
        .querySelectorAll(".nav-item")
        .forEach(
            item =>
                item.classList.remove("active")
        );


    if(pageId === "homePage")
        $("navHome").classList.add("active");

    if(pageId === "salePage")
        $("navSale").classList.add("active");

    if(pageId === "inventoryPage")
        $("navInventory").classList.add("active");


    if(pageId === "inventoryPage"){
        renderInventory();
    }

    if(pageId === "salesPage"){
        renderSalesReport();
    }

}


/* =========================================================
   INVENTORY RENDER
   ========================================================= */

function renderInventory(
    filter = ""
){

    const container =
        $("inventoryList");


    const query =
        filter.trim().toLowerCase();


    const list =
        state.inventory.filter(
            item => {

                if(!query)
                    return true;

                return (

                    String(
                        item.product_name || ""
                    )
                    .toLowerCase()
                    .includes(query)

                    ||

                    String(
                        item.barcode || ""
                    )
                    .toLowerCase()
                    .includes(query)

                );

            }
        );


    if(!list.length){

        container.innerHTML = `
            <div class="empty-state">
                کالایی در انبار پیدا نشد.
            </div>
        `;

        return;

    }


    container.innerHTML =
        list.map(
            item => `

                <div class="inventory-row">

                    <div class="inventory-main">

                        <div class="inventory-name">
                            ${escapeHtml(item.product_name)}
                        </div>

                        <div class="inventory-barcode">
                            ${escapeHtml(item.barcode || "-")}
                        </div>

                        <div class="inventory-price">
                            خرید:
                            ${money(item.current_purchase_price)}
                            |
                            فروش:
                            ${money(item.current_sale_price)}
                        </div>

                    </div>

                    <div class="inventory-stock">

                        ${number(item.stock)}

                        <div style="
                            margin-top:3px;
                            font-size:8px;
                            color:#68758b;
                        ">
                            ${escapeHtml(item.unit || "عدد")}
                        </div>

                    </div>

                </div>

            `
        ).join("");

}


/* =========================================================
   SALES REPORT
   ========================================================= */

function renderSalesReport(){

    const container =
        $("salesReportList");


    if(!state.sales.length){

        container.innerHTML = `
            <div class="empty-state">
                هنوز فروشی ثبت نشده است.
            </div>
        `;

        return;

    }


    container.innerHTML =
        state.sales.map(
            sale => `

                <div class="sale-row">

                    <div class="sale-row-main">

                        <div class="sale-number">
                            فاکتور
                            ${number(sale.invoice_number)}
                        </div>

                        <div class="sale-date">
                            ${formatDate(sale.created_at)}
                        </div>

                        <div class="status ${sale.status}">
                            ${
                                sale.status === "completed"
                                ?
                                "تکمیل شده"
                                :
                                "لغو شده"
                            }
                        </div>

                    </div>


                    <div>

                        <div class="sale-total">
                            ${money(sale.total)}
                        </div>

                        ${
                            sale.status === "completed"
                            ?
                            `
                            <button
                                class="cart-remove"
                                onclick="cancelSale('${sale.sale_id}')"
                            >
                                لغو فاکتور
                            </button>
                            `
                            :
                            ""
                        }

                    </div>

                </div>

            `
        ).join("");

}


/* =========================================================
   SEARCH PRODUCTS
   ========================================================= */

function searchProducts(
    query
){

    const q =
        query.trim().toLowerCase();


    if(!q)
        return [];


    return state.products.filter(
        product =>

            String(
                product.barcode || ""
            )
            .toLowerCase()
            .includes(q)

            ||

            String(
                product.name || ""
            )
            .toLowerCase()
            .includes(q)

    ).slice(0,10);

}


/* =========================================================
   SALE SEARCH
   ========================================================= */

function handleSaleSearch(){

    const query =
        $("saleBarcode").value;


    const results =
        searchProducts(query);


    const container =
        $("saleSearchResult");


    if(!query.trim()){

        container.innerHTML = "";

        return;

    }


    if(!results.length){

        container.innerHTML = `
            <div class="message">
                کالایی با این مشخصات پیدا نشد.
            </div>
        `;

        return;

    }


    container.innerHTML =
        results.map(
            product => `

                <div class="product-result">

                    <div class="product-result-info">

                        <div class="product-result-name">
                            ${escapeHtml(product.name)}
                        </div>

                        <div class="product-result-meta">
                            بارکد:
                            ${escapeHtml(product.barcode)}
                            |
                            قیمت:
                            ${money(product.current_sale_price)}
                        </div>

                    </div>

                    <button
                        class="add-product-button"
                        onclick="addToCart('${product.id}')"
                    >
                        افزودن
                    </button>

                </div>

            `
        ).join("");

}


/* =========================================================
   CART
   ========================================================= */

function addToCart(
    productId
){

    const product =
        state.products.find(
            item =>
                item.id === productId
        );


    if(!product)
        return;


    const inventory =
        state.inventory.find(
            item =>
                item.product_id === product.id
        );


    const available =
        Number(
            inventory?.stock || 0
        );


    const existing =
        state.cart.find(
            item =>
                item.product.id === product.id
        );


    if(existing){

        if(
            existing.quantity + 1 >
            available
        ){

            toast(
                "موجودی کافی نیست.",
                "error"
            );

            return;

        }

        existing.quantity++;

    }
    else{

        if(available <= 0){

            toast(
                "موجودی این کالا صفر است.",
                "error"
            );

            return;

        }


        state.cart.push({

            product,

            quantity:1

        });

    }


    renderCart();

    $("saleSearchResult")
        .innerHTML = "";

    $("saleBarcode").value = "";

}


function removeFromCart(
    productId
){

    state.cart =
        state.cart.filter(
            item =>
                item.product.id !==
                productId
        );

    renderCart();

}


function renderCart(){

    const container =
        $("cartItems");


    $("cartCount").textContent =
        number(
            state.cart.reduce(
                (sum,item)=>
                    sum + item.quantity,
                0
            )
        ) + " کالا";


    if(!state.cart.length){

        container.innerHTML = `
            <div class="empty-state">
                هنوز کالایی به فروش اضافه نشده است.
            </div>
        `;

        $("cartTotal").textContent =
            "0";

        return;

    }


    let total = 0;


    container.innerHTML =
        state.cart.map(
            item => {

                const price =
                    Number(
                        item.product.current_sale_price || 0
                    );

                const rowTotal =
                    price * item.quantity;

                total += rowTotal;


                return `

                    <div class="cart-item">

                        <div>

                            <div class="cart-item-name">
                                ${escapeHtml(item.product.name)}
                            </div>

                            <div class="cart-item-meta">
                                ${number(item.quantity)}
                                ×
                                ${money(price)}
                            </div>

                            <button
                                class="cart-remove"
                                onclick="removeFromCart('${item.product.id}')"
                            >
                                حذف
                            </button>

                        </div>

                        <div class="cart-item-price">
                            ${money(rowTotal)}
                        </div>

                    </div>

                `;

            }
        ).join("");


    $("cartTotal").textContent =
        money(total);

}


/* =========================================================
   CREATE SALE
   ========================================================= */

async function checkout(){

    if(!state.cart.length){

        toast(
            "سبد فروش خالی است.",
            "error"
        );

        return;

    }


    const items =
        state.cart.map(
            item => ({

                product_id:
                    item.product.id,

                quantity:
                    item.quantity

            })
        );


    const button =
        $("checkoutButton");


    button.disabled = true;

    button.textContent =
        "در حال ثبت...";


    try{

        const {
            data,
            error
        } =
            await supabaseClient
                .rpc(
                    "create_sale",
                    {
                        p_items:items,
                        p_discount:0
                    }
                );


        if(error)
            throw error;


        state.cart = [];


        renderCart();


        await loadDashboard();


        const invoice =
            data?.invoice_number;


        toast(
            invoice
            ?
            `فاکتور ${number(invoice)} ثبت شد.`
            :
            "فروش با موفقیت ثبت شد."
        );


        showPage("homePage");


    }
    catch(error){

        console.error(error);

        toast(
            readableError(error),
            "error"
        );

    }
    finally{

        button.disabled = false;

        button.textContent =
            "ثبت فروش";

    }

}


/* =========================================================
   CREATE PRODUCT MODAL
   ========================================================= */

function openProductModal(){

    openModal(
        "ثبت کالا",
        `

        <form id="productForm" class="modal-form">

            <div>
                <label>بارکد</label>
                <input
                    id="productBarcode"
                    required
                    placeholder="بارکد کالا"
                >
            </div>

            <div>
                <label>نام کالا</label>
                <input
                    id="productName"
                    required
                    placeholder="نام کالا"
                >
            </div>

            <div class="form-row">

                <div>
                    <label>واحد</label>
                    <input
                        id="productUnit"
                        value="عدد"
                    >
                </div>

                <div>
                    <label>تعداد اولیه</label>
                    <input
                        id="productQuantity"
                        type="number"
                        min="0"
                        value="0"
                    >
                </div>

            </div>


            <div class="form-row">

                <div>
                    <label>قیمت خرید</label>
                    <input
                        id="productPurchase"
                        type="number"
                        min="0"
                        value="0"
                    >
                </div>

                <div>
                    <label>قیمت فروش</label>
                    <input
                        id="productSale"
                        type="number"
                        min="0"
                        value="0"
                    >
                </div>

            </div>


            <div>
                <label>توضیحات</label>

                <textarea
                    id="productDescription"
                    rows="3"
                    placeholder="توضیحات اختیاری"
                ></textarea>

            </div>


            <button
                type="submit"
                class="primary-button modal-button"
            >
                ثبت کالا
            </button>

        </form>

        `
    );


    $("productForm")
        .addEventListener(
            "submit",
            createProduct
        );

}


/* =========================================================
   CREATE PRODUCT
   ========================================================= */

async function createProduct(
    event
){

    event.preventDefault();


    const barcode =
        $("productBarcode")
            .value.trim();

    const name =
        $("productName")
            .value.trim();

    const unit =
        $("productUnit")
            .value.trim() ||
            "عدد";

    const quantity =
        Number(
            $("productQuantity")
                .value || 0
        );

    const purchase =
        Number(
            $("productPurchase")
                .value || 0
        );

    const sale =
        Number(
            $("productSale")
                .value || 0
        );

    const description =
        $("productDescription")
            .value.trim();


    if(!barcode || !name){

        toast(
            "بارکد و نام کالا الزامی است.",
            "error"
        );

        return;

    }


    const button =
        event.target.querySelector(
            "button[type=submit]"
        );


    button.disabled = true;

    button.textContent =
        "در حال ثبت...";


    try{

        const {
            data:productId,
            error
        } =
            await supabaseClient
                .rpc(
                    "create_product",
                    {
                        p_barcode:barcode,
                        p_name:name,
                        p_description:
                            description || null,
                        p_unit:unit
                    }
                );


        if(error)
            throw error;


        if(quantity > 0){

            const {
                error:stockError
            } =
                await supabaseClient
                    .rpc(
                        "add_stock",
                        {
                            p_product_id:
                                productId,

                            p_quantity:
                                quantity,

                            p_purchase_price:
                                purchase,

                            p_sale_price:
                                sale,

                            p_note:
                                "موجودی اولیه"
                        }
                    );


            if(stockError)
                throw stockError;

        }


        closeModal();

        toast(
            "کالا با موفقیت ثبت شد."
        );


        await loadDashboard();

    }
    catch(error){

        console.error(error);

        toast(
            readableError(error),
            "error"
        );

    }
    finally{

        button.disabled = false;

        button.textContent =
            "ثبت کالا";

    }

}


/* =========================================================
   STOCK MODAL
   ========================================================= */

function openStockModal(){

    const products =
        state.products;


    openModal(
        "ورود کالا به انبار",
        `

        <form id="stockForm" class="modal-form">

            <div>
                <label>کالا</label>

                <select id="stockProduct" required>

                    <option value="">
                        انتخاب کالا
                    </option>

                    ${
                        products.map(
                            product => `

                            <option
                                value="${product.id}"
                            >
                                ${escapeHtml(product.name)}
                                -
                                ${escapeHtml(product.barcode)}
                            </option>

                            `
                        ).join("")
                    }

                </select>

            </div>


            <div>

                <label>تعداد</label>

                <input
                    id="stockQuantity"
                    type="number"
                    min="0.001"
                    step="0.001"
                    required
                    placeholder="تعداد"
                >

            </div>


            <div class="form-row">

                <div>

                    <label>قیمت خرید</label>

                    <input
                        id="stockPurchase"
                        type="number"
                        min="0"
                        required
                        placeholder="قیمت خرید"
                    >

                </div>


                <div>

                    <label>قیمت فروش</label>

                    <input
                        id="stockSale"
                        type="number"
                        min="0"
                        required
                        placeholder="قیمت فروش"
                    >

                </div>

            </div>


            <div>

                <label>یادداشت</label>

                <textarea
                    id="stockNote"
                    rows="3"
                    placeholder="یادداشت اختیاری"
                ></textarea>

            </div>


            <button
                type="submit"
                class="primary-button"
            >
                ثبت ورود به انبار
            </button>

        </form>

        `
    );


    $("stockForm")
        .addEventListener(
            "submit",
            addStock
        );

}


/* =========================================================
   ADD STOCK
   ========================================================= */

async function addStock(
    event
){

    event.preventDefault();


    const productId =
        $("stockProduct")
            .value;

    const quantity =
        Number(
            $("stockQuantity")
                .value
        );

    const purchase =
        Number(
            $("stockPurchase")
                .value
        );

    const sale =
        Number(
            $("stockSale")
                .value
        );

    const note =
        $("stockNote")
            .value.trim();


    if(!productId){

        toast(
            "کالا را انتخاب کنید.",
            "error"
        );

        return;

    }


    const button =
        event.target.querySelector(
            "button[type=submit]"
        );


    button.disabled = true;

    button.textContent =
        "در حال ثبت...";


    try{

        const {
            error
        } =
            await supabaseClient
                .rpc(
                    "add_stock",
                    {
                        p_product_id:
                            productId,

                        p_quantity:
                            quantity,

                        p_purchase_price:
                            purchase,

                        p_sale_price:
                            sale,

                        p_note:
                            note || null
                    }
                );


        if(error)
            throw error;


        closeModal();

        toast(
            "موجودی با موفقیت ثبت شد."
        );


        await loadDashboard();

    }
    catch(error){

        console.error(error);

        toast(
            readableError(error),
            "error"
        );

    }
    finally{

        button.disabled = false;

        button.textContent =
            "ثبت ورود به انبار";

    }

}


/* =========================================================
   REPORT MODAL
   ========================================================= */

async function openReportModal(){

    try{

        const range =
            todayRange();


        const {
            data,
            error
        } =
            await supabaseClient
                .rpc(
                    "get_sales_summary",
                    {
                        p_from:
                            range.from,

                        p_to:
                            range.to
                    }
                );


        if(error)
            throw error;


        const summary =
            data || {};


        openModal(
            "گزارش فروش امروز",
            `

            <div class="stats-grid">

                <div class="stat-card glass">

                    <div class="stat-label">
                        تعداد فاکتور
                    </div>

                    <div class="stat-value">
                        ${number(
                            summary.invoice_count
                        )}
                    </div>

                </div>


                <div class="stat-card glass">

                    <div class="stat-label">
                        مبلغ فروش
                    </div>

                    <div class="stat-value">
                        ${money(
                            summary.completed_total
                        )}
                    </div>

                </div>


                <div class="stat-card glass">

                    <div class="stat-label">
                        فاکتور لغو شده
                    </div>

                    <div class="stat-value">
                        ${number(
                            summary.cancelled_count
                        )}
                    </div>

                </div>


                <div class="stat-card glass">

                    <div class="stat-label">
                        مبلغ لغو شده
                    </div>

                    <div class="stat-value">
                        ${money(
                            summary.cancelled_total
                        )}
                    </div>

                </div>

            </div>


            <button
                id="fullReportButton"
                class="primary-button"
            >
                مشاهده همه فروش‌ها
            </button>

            `
        );


        $("fullReportButton")
            .addEventListener(
                "click",
                ()=>{
                    closeModal();
                    showPage("salesPage");
                }
            );

    }
    catch(error){

        toast(
            readableError(error),
            "error"
        );

    }

}


/* =========================================================
   CANCEL SALE
   ========================================================= */

async function cancelSale(
    saleId
){

    const confirmed =
        window.confirm(
            "آیا از لغو این فاکتور مطمئن هستید؟"
        );


    if(!confirmed)
        return;


    try{

        const {
            error
        } =
            await supabaseClient
                .rpc(
                    "cancel_sale",
                    {
                        p_sale_id:
                            saleId
                    }
                );


        if(error)
            throw error;


        toast(
            "فاکتور لغو شد."
        );


        await loadDashboard();

        renderSalesReport();

    }
    catch(error){

        console.error(error);

        toast(
            readableError(error),
            "error"
        );

    }

}


/* =========================================================
   MODAL
   ========================================================= */

function openModal(
    title,
    content
){

    $("modalTitle")
        .textContent = title;

    $("modalContent")
        .innerHTML = content;

    $("modalOverlay")
        .classList.add("show");

}


function closeModal(){

    $("modalOverlay")
        .classList.remove("show");

    $("modalContent")
        .innerHTML = "";

}


/* =========================================================
   SIDE MENU
   ========================================================= */

function openMenu(){

    $("sideMenu")
        .classList.add("open");

}


function closeMenu(){

    $("sideMenu")
        .classList.remove("open");

}


/* =========================================================
   ESCAPE HTML
   ========================================================= */

function escapeHtml(
    value
){

    return String(
        value ?? ""
    )
    .replace(
        /&/g,
        "&amp;"
    )
    .replace(
        /</g,
        "&lt;"
    )
    .replace(
        />/g,
        "&gt;"
    )
    .replace(
        /"/g,
        "&quot;"
    )
    .replace(
        /'/g,
        "&#039;"
    );

}


/* =========================================================
   EVENT LISTENERS
   ========================================================= */

function setupEvents(){

    $("loginForm")
        .addEventListener(
            "submit",
            event => {

                event.preventDefault();

                login(
                    $("loginUsername").value,
                    $("loginPassword").value
                );

            }
        );


    $("menuButton")
        .addEventListener(
            "click",
            openMenu
        );


    $("menuClose")
        .addEventListener(
            "click",
            closeMenu
        );


    $("logoutButton")
        .addEventListener(
            "click",
            logout
        );


    $("modalClose")
        .addEventListener(
            "click",
            closeModal
        );


    $("modalOverlay")
        .addEventListener(
            "click",
            event => {

                if(
                    event.target ===
                    $("modalOverlay")
                ){
                    closeModal();
                }

            }
        );


    $("refreshButton")
        .addEventListener(
            "click",
            async ()=>{

                await loadDashboard();

                toast(
                    "اطلاعات به‌روزرسانی شد."
                );

            }
        );


    $("navHome")
        .addEventListener(
            "click",
            ()=>{
                showPage("homePage");
            }
        );


    $("navSale")
        .addEventListener(
            "click",
            ()=>{
                showPage("salePage");
            }
        );


    $("navInventory")
        .addEventListener(
            "click",
            ()=>{
                showPage("inventoryPage");
            }
        );


    $("newSaleButton")
        .addEventListener(
            "click",
            ()=>{
                showPage("salePage");
            }
        );


    $("stockButton")
        .addEventListener(
            "click",
            openStockModal
        );


    $("productButton")
        .addEventListener(
            "click",
            openProductModal
        );


    $("reportButton")
        .addEventListener(
            "click",
            openReportModal
        );


    $("openSalesButton")
        .addEventListener(
            "click",
            ()=>{
                showPage("salesPage");
            }
        );


    $("inventoryAddButton")
        .addEventListener(
            "click",
            openStockModal
        );


    $("saleSearchButton")
        .addEventListener(
            "click",
            handleSaleSearch
        );


    $("saleBarcode")
        .addEventListener(
            "keydown",
            event => {

                if(
                    event.key ===
                    "Enter"
                ){

                    event.preventDefault();

                    handleSaleSearch();

                }

            }
        );


    $("inventorySearchButton")
        .addEventListener(
            "input",
            event => {

                renderInventory(
                    event.target.value
                );

            }
        );


    $("checkoutButton")
        .addEventListener(
            "click",
            checkout
        );


    document
        .querySelectorAll(".menu-item")
        .forEach(
            item => {

                item.addEventListener(
                    "click",
                    ()=>{
                        handleMenuAction(
                            item.dataset.action
                        );
                    }
                );

            }
        );

}


/* =========================================================
   MENU ACTIONS
   ========================================================= */

function handleMenuAction(
    action
){

    closeMenu();


    switch(action){

        case "home":

            showPage(
                "homePage"
            );

            break;


        case "products":

            openProductManager();

            break;


        case "inventory":

            showPage(
                "inventoryPage"
            );

            break;


        case "sales":

            showPage(
                "salesPage"
            );

            break;


        case "report":

            openReportModal();

            break;


        case "settings":

            openSettings();

            break;

    }

}


/* =========================================================
   PRODUCT MANAGER
   ========================================================= */

function openProductManager(){

    const products =
        state.products;


    openModal(
        "کالاهای فروشگاه",
        `

        <div
            style="
                display:flex;
                flex-direction:column;
                gap:8px;
            "
        >

            ${
                products.length
                ?
                products.map(
                    product => `

                    <div class="inventory-row">

                        <div class="inventory-main">

                            <div class="inventory-name">
                                ${escapeHtml(product.name)}
                            </div>

                            <div class="inventory-barcode">
                                ${escapeHtml(product.barcode)}
                            </div>

                            <div class="inventory-price">
                                فروش:
                                ${money(product.current_sale_price)}
                            </div>

                        </div>

                        <button
                            class="add-product-button"
                            onclick="openEditProduct('${product.id}')"
                        >
                            ویرایش
                        </button>

                    </div>

                    `
                ).join("")
                :
                `
                <div class="empty-state">
                    کالایی ثبت نشده است.
                </div>
                `
            }


            <button
                id="modalNewProduct"
                class="primary-button"
            >
                ثبت کالای جدید
            </button>

        </div>

        `
    );


    $("modalNewProduct")
        .addEventListener(
            "click",
            openProductModal
        );

}


/* =========================================================
   EDIT PRODUCT
   ========================================================= */

function openEditProduct(
    productId
){

    const product =
        state.products.find(
            item =>
                item.id === productId
        );


    if(!product)
        return;


    openModal(
        "ویرایش کالا",
        `

        <form id="editProductForm" class="modal-form">

            <div>

                <label>بارکد</label>

                <input
                    id="editBarcode"
                    value="${escapeHtml(product.barcode)}"
                    required
                >

            </div>


            <div>

                <label>نام کالا</label>

                <input
                    id="editName"
                    value="${escapeHtml(product.name)}"
                    required
                >

            </div>


            <div>

                <label>واحد</label>

                <input
                    id="editUnit"
                    value="${escapeHtml(product.unit || "عدد")}"
                >

            </div>


            <div>

                <label>توضیحات</label>

                <textarea
                    id="editDescription"
                    rows="3"
                >${escapeHtml(product.description || "")}</textarea>

            </div>


            <div>

                <label>وضعیت</label>

                <select id="editActive">

                    <option
                        value="true"
                        ${
                            product.is_active
                            ? "selected"
                            : ""
                        }
                    >
                        فعال
                    </option>

                    <option
                        value="false"
                        ${
                            !product.is_active
                            ? "selected"
                            : ""
                        }
                    >
                        غیرفعال
                    </option>

                </select>

            </div>


            <button
                class="primary-button"
                type="submit"
            >
                ذخیره تغییرات
            </button>

        </form>

        `
    );


    $("editProductForm")
        .addEventListener(
            "submit",
            event =>
                updateProduct(
                    event,
                    product.id
                )
        );

}


/* =========================================================
   UPDATE PRODUCT
   ========================================================= */

async function updateProduct(
    event,
    productId
){

    event.preventDefault();


    const button =
        event.target.querySelector(
            "button[type=submit]"
        );


    button.disabled = true;

    button.textContent =
        "در حال ذخیره...";


    try{

        const {
            error
        } =
            await supabaseClient
                .rpc(
                    "update_product",
                    {

                        p_product_id:
                            productId,

                        p_barcode:
                            $("editBarcode")
                                .value.trim(),

                        p_name:
                            $("editName")
                                .value.trim(),

                        p_description:
                            $("editDescription")
                                .value.trim() ||
                            null,

                        p_unit:
                            $("editUnit")
                                .value.trim() ||
                            "عدد",

                        p_is_active:
                            $("editActive")
                                .value ===
                            "true"

                    }
                );


        if(error)
            throw error;


        closeModal();

        toast(
            "اطلاعات کالا ذخیره شد."
        );


        await loadDashboard();

    }
    catch(error){

        toast(
            readableError(error),
            "error"
        );

    }
    finally{

        button.disabled = false;

        button.textContent =
            "ذخیره تغییرات";

    }

}


/* =========================================================
   SETTINGS
   ========================================================= */

function openSettings(){

    const store =
        state.store;


    openModal(
        "تنظیمات فروشگاه",
        `

        <div class="modal-form">

            <div class="message">

                <strong>
                    ${escapeHtml(store?.name || "")}
                </strong>

                <br>

                کد فروشگاه:
                ${escapeHtml(store?.code || "-")}

                <br>

                وضعیت:
                ${
                    store?.status === "active"
                    ?
                    "فعال"
                    :
                    escapeHtml(
                        store?.status || "-"
                    )
                }

            </div>


            <div class="message">

                کاربر:
                ${escapeHtml(
                    state.profile?.username || "-"
                )}

                <br>

                نام:
                ${escapeHtml(
                    state.profile?.full_name || "-"
                )}

            </div>


            <div class="message">

                سیستم اتصال:

                <br>

                Supabase Auth

                <br>

                PostgreSQL + RLS

                <br>

                RPC / SECURITY DEFINER

            </div>

        </div>

        `
    );

}


/* =========================================================
   AUTH SESSION CHECK
   ========================================================= */

async function checkSession(){

    if(
        SUPABASE_ANON_KEY ===
        "YOUR_SUPABASE_ANON_OR_PUBLISHABLE_KEY"
    ){

        console.warn(
            "Supabase key has not been configured."
        );

        $("loginError").textContent =
            "کلید Supabase در app.js وارد نشده است.";

        return;

    }


    try{

        const {
            data,
            error
        } =
            await supabaseClient
                .auth
                .getSession();


        if(error)
            throw error;


        if(
            data.session
        ){

            state.session =
                data.session;

            state.user =
                data.session.user;


            await loadUserData();

            showApp();

            await loadDashboard();

        }


    }
    catch(error){

        console.error(error);

        $("loginError").textContent =
            readableError(error);

    }

}


/* =========================================================
   AUTH STATE
   ========================================================= */

supabaseClient
    .auth
    .onAuthStateChange(
        async (
            event,
            session
        ) => {

            if(
                event ===
                "SIGNED_OUT"
            ){

                state.session = null;
                state.user = null;

                $("app")
                    .classList.add("hidden");

                $("loginPage")
                    .classList.remove("hidden");

            }

        }
    );


/* =========================================================
   INIT
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    async ()=>{

        createNetwork();

        setupEvents();

        await checkSession();

    }
);
