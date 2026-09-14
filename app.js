"use strict";


/* =========================================
   ELEMENT HELPER
========================================= */

function $(id){

    return document.getElementById(id);

}


/* =========================================
   NETWORK
========================================= */

function createNetwork(){

    const network = $("network");

    if(!network) return;

    const nodes = [];

    for(let i = 0; i < 32; i++){

        const node =
            document.createElement("span");

        node.className = "node";

        node.style.left =
            Math.random() * 100 + "%";

        node.style.top =
            Math.random() * 100 + "%";

        node.style.animationDelay =
            Math.random() * 3 + "s";

        network.appendChild(node);

        nodes.push(node);

    }


    for(let i = 0; i < 24; i++){

        const line =
            document.createElement("i");

        line.className =
            "network-line";

        line.style.left =
            Math.random() * 95 + "%";

        line.style.top =
            Math.random() * 95 + "%";

        line.style.width =
            80 + Math.random() * 240 + "px";

        line.style.transform =
            "rotate(" +
            Math.random() * 360 +
            "deg)";

        line.style.animationDelay =
            Math.random() * 4 + "s";

        network.appendChild(line);

    }

}


/* =========================================
   PAGE MANAGEMENT
========================================= */

const pages = {

    home:
        $("homePage"),

    sale:
        $("salePage"),

    inventory:
        $("inventoryPage")

};


function showPage(name){

    Object.values(pages).forEach(page => {

        page.classList.remove(
            "active-page"
        );

    });


    if(pages[name]){

        pages[name].classList.add(
            "active-page"
        );

    }


    document
        .querySelectorAll(".nav-button")
        .forEach(button => {

            button.classList.remove(
                "active"
            );

        });


    if(name === "home"){

        $("navHome")
            .classList.add("active");

    }


    if(name === "sale"){

        $("navSale")
            .classList.add("active");

    }


    if(name === "inventory"){

        $("navInventory")
            .classList.add("active");

    }

}


/* =========================================
   TOAST
========================================= */

let toastTimer = null;


function toast(message){

    const element = $("toast");

    element.textContent =
        message;

    element.classList.add(
        "show"
    );


    clearTimeout(
        toastTimer
    );


    toastTimer =
        setTimeout(() => {

            element.classList.remove(
                "show"
            );

        },2500);

}


/* =========================================
   MODAL
========================================= */

function openModal(type){

    const overlay =
        $("modalOverlay");

    const title =
        $("modalTitle");

    const content =
        $("modalContent");


    if(type === "sale"){

        title.textContent =
            "فروش جدید";

        content.innerHTML = `

            <div class="form-group">

                <label>
                    بارکد کالا
                </label>

                <input
                    id="modalBarcode"
                    placeholder="بارکد را وارد کنید"
                >

            </div>


            <div class="form-group">

                <label>
                    تعداد
                </label>

                <input
                    id="modalQuantity"
                    type="number"
                    min="1"
                    value="1"
                >

            </div>


            <button
                id="modalAction"
                class="form-submit"
                type="button"
            >
                افزودن به فاکتور تستی
            </button>

        `;


        setTimeout(() => {

            $("modalAction")
                .addEventListener(
                    "click",
                    () => {

                        const barcode =
                            $("modalBarcode")
                                .value
                                .trim();

                        const quantity =
                            $("modalQuantity")
                                .value;

                        if(!barcode){

                            toast(
                                "بارکد تستی را وارد کنید"
                            );

                            return;

                        }

                        toast(
                            "کالای تستی به فاکتور اضافه شد"
                        );

                        closeModal();

                        showPage("sale");

                    }
                );

        },0);

    }


    if(type === "stock"){

        title.textContent =
            "ورود به انبار";

        content.innerHTML = `

            <div class="form-group">

                <label>
                    بارکد
                </label>

                <input
                    id="modalBarcode"
                    placeholder="بارکد کالا"
                >

            </div>


            <div class="form-group">

                <label>
                    نام کالا
                </label>

                <input
                    id="modalProductName"
                    placeholder="نام کالا"
                >

            </div>


            <div class="form-group">

                <label>
                    تعداد
                </label>

                <input
                    id="modalQuantity"
                    type="number"
                    min="1"
                    value="1"
                >

            </div>


            <button
                id="modalAction"
                class="form-submit"
                type="button"
            >
                ثبت ورود تستی
            </button>

        `;


        setTimeout(() => {

            $("modalAction")
                .addEventListener(
                    "click",
                    () => {

                        const name =
                            $("modalProductName")
                                .value
                                .trim();

                        if(!name){

                            toast(
                                "نام کالای تستی را وارد کنید"
                            );

                            return;

                        }

                        toast(
                            "ورود کالا به انبار تستی ثبت شد"
                        );

                        closeModal();

                        showPage(
                            "inventory"
                        );

                    }
                );

        },0);

    }


    if(type === "product"){

        title.textContent =
            "ثبت کالا";

        content.innerHTML = `

            <div class="form-group">

                <label>
                    بارکد
                </label>

                <input
                    id="modalBarcode"
                    placeholder="بارکد"
                >

            </div>


            <div class="form-group">

                <label>
                    نام کالا
                </label>

                <input
                    id="modalProductName"
                    placeholder="نام کالا"
                >

            </div>


            <div class="form-group">

                <label>
                    واحد
                </label>

                <input
                    id="modalUnit"
                    value="عدد"
                >

            </div>


            <button
                id="modalAction"
                class="form-submit"
                type="button"
            >
                ثبت کالای تستی
            </button>

        `;


        setTimeout(() => {

            $("modalAction")
                .addEventListener(
                    "click",
                    () => {

                        const name =
                            $("modalProductName")
                                .value
                                .trim();

                        if(!name){

                            toast(
                                "نام کالا را وارد کنید"
                            );

                            return;

                        }

                        toast(
                            "کالای تستی ثبت شد"
                        );

                        closeModal();

                    }
                );

        },0);

    }


    if(type === "report"){

        title.textContent =
            "گزارش فروش";

        content.innerHTML = `

            <div
                class="test-result"
                style="
                    text-align:center;
                    padding:35px 15px;
                "
            >

                <div
                    style="
                        font-size:45px;
                        font-weight:900;
                        color:#8c79ff;
                    "
                >
                    18.4M
                </div>

                <div
                    style="
                        margin-top:10px;
                        color:#929bb0;
                    "
                >
                    فروش تستی امروز
                </div>

            </div>


            <button
                id="modalAction"
                class="form-submit"
                type="button"
                style="margin-top:15px"
            >
                بستن گزارش
            </button>

        `;


        setTimeout(() => {

            $("modalAction")
                .addEventListener(
                    "click",
                    closeModal
                );

        },0);

    }


    overlay.classList.add(
        "show"
    );

}


function closeModal(){

    $("modalOverlay")
        .classList.remove(
            "show"
        );

}


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


/* =========================================
   TOP ACTIONS
========================================= */

$("newSaleButton")
    .addEventListener(
        "click",
        () => {

            openModal("sale");

        }
    );


$("stockButton")
    .addEventListener(
        "click",
        () => {

            openModal("stock");

        }
    );


$("productButton")
    .addEventListener(
        "click",
        () => {

            openModal("product");

        }
    );


$("reportButton")
    .addEventListener(
        "click",
        () => {

            openModal("report");

        }
    );


/* =========================================
   NAVIGATION
========================================= */

$("navHome")
    .addEventListener(
        "click",
        () => {

            showPage("home");

        }
    );


$("navSale")
    .addEventListener(
        "click",
        () => {

            showPage("sale");

        }
    );


$("navInventory")
    .addEventListener(
        "click",
        () => {

            showPage("inventory");

        }
    );


/* =========================================
   SALE SEARCH
========================================= */

$("saleSearchButton")
    .addEventListener(
        "click",
        () => {

            const value =
                $("saleBarcode")
                    .value
                    .trim();

            if(!value){

                toast(
                    "نام کالا یا بارکد را وارد کنید"
                );

                return;

            }


            $("saleTestResult")
                .textContent =
                    "کالای تستی پیدا شد: " +
                    value;

            toast(
                "کالای تستی پیدا شد"
            );

        }
    );


/* =========================================
   CHECKOUT
========================================= */

$("checkoutButton")
    .addEventListener(
        "click",
        () => {

            toast(
                "فروش تستی با موفقیت ثبت شد"
            );

            $("statSales")
                .textContent =
                "18.65M";

            $("statInvoices")
                .textContent =
                "38";

            showPage("home");

        }
    );


/* =========================================
   INVENTORY ACTIONS
========================================= */

$("inventoryAddButton")
    .addEventListener(
        "click",
        () => {

            openModal("stock");

        }
    );


$("inventorySearchButton")
    .addEventListener(
        "click",
        () => {

            toast(
                "جستجوی تستی انبار فعال شد"
            );

        }
    );


/* =========================================
   SALES BUTTONS
========================================= */

$("allSalesButton")
    .addEventListener(
        "click",
        () => {

            toast(
                "لیست کامل فروش‌ها در نسخه بعدی"
            );

        }
    );


/* =========================================
   REFRESH
========================================= */

$("refreshButton")
    .addEventListener(
        "click",
        () => {

            toast(
                "اطلاعات تستی بروزرسانی شد"
            );

            $("statProducts")
                .textContent =
                "248";

        }
    );


/* =========================================
   MENU
========================================= */

$("menuButton")
    .addEventListener(
        "click",
        () => {

            $("sideMenu")
                .classList.add(
                    "show"
                );

        }
    );


$("menuClose")
    .addEventListener(
        "click",
        () => {

            $("sideMenu")
                .classList.remove(
                    "show"
                );

        }
    );


document
    .querySelectorAll(".menu-item")
    .forEach(item => {

        item.addEventListener(
            "click",
            () => {

                const type =
                    item.dataset.menu;

                $("sideMenu")
                    .classList.remove(
                        "show"
                    );

                if(type === "profile"){

                    toast(
                        "صفحه حساب کاربری تستی"
                    );

                }

                if(type === "settings"){

                    toast(
                        "تنظیمات تستی"
                    );

                }

                if(type === "about"){

                    toast(
                        "BIZA SaaS — نسخه تست UI"
                    );

                }

            }
        );

    });


/* =========================================
   START
========================================= */

createNetwork();

showPage("home");
