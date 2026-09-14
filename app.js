"use strict";


/* =========================================
   HELPER
========================================= */

function $(id){

    return document.getElementById(id);

}


/* =========================================
   LIVE BLOCKCHAIN NETWORK
========================================= */

function createNetwork(){

    const network = $("network");

    if(!network){
        return;
    }


    network.innerHTML = "";


    const canvas =
        document.createElement("canvas");


    canvas.style.position = "absolute";
    canvas.style.inset = "0";
    canvas.style.width = "100%";
    canvas.style.height = "100%";


    network.appendChild(canvas);


    const ctx =
        canvas.getContext("2d");


    let width = 0;
    let height = 0;


    let dpr =
        Math.min(
            window.devicePixelRatio || 1,
            2
        );


    const nodes = [];


    let nodeCount =
        window.innerWidth < 600
            ? 42
            : 72;


    const connectionDistance =
        window.innerWidth < 600
            ? 145
            : 175;


    /* =====================================
       RESIZE
    ====================================== */

    function resize(){

        width =
            window.innerWidth;

        height =
            window.innerHeight;


        dpr =
            Math.min(
                window.devicePixelRatio || 1,
                2
            );


        canvas.width =
            width * dpr;

        canvas.height =
            height * dpr;


        canvas.style.width =
            width + "px";

        canvas.style.height =
            height + "px";


        ctx.setTransform(
            dpr,
            0,
            0,
            dpr,
            0,
            0
        );

    }


    resize();


    window.addEventListener(
        "resize",
        resize
    );


    /* =====================================
       CREATE NODES
    ====================================== */

    for(
        let i = 0;
        i < nodeCount;
        i++
    ){

        nodes.push({

            x:
                Math.random() *
                width,

            y:
                Math.random() *
                height,

            vx:
                (Math.random() - .5)
                * .30,

            vy:
                (Math.random() - .5)
                * .30,

            radius:
                1.3 +
                Math.random() * 1.8,

            pulse:
                Math.random() *
                Math.PI * 2,

            pulseSpeed:
                .012 +
                Math.random() * .015

        });

    }


    /* =====================================
       DISTANCE
    ====================================== */

    function distance(a,b){

        const dx =
            a.x - b.x;

        const dy =
            a.y - b.y;

        return Math.sqrt(
            dx * dx +
            dy * dy
        );

    }


    /* =====================================
       ANIMATION
    ====================================== */

    function animate(){

        ctx.clearRect(
            0,
            0,
            width,
            height
        );


        const now =
            performance.now();


        /* =================================
           MOVE NODES
        ================================== */

        nodes.forEach(node => {

            node.x += node.vx;
            node.y += node.vy;


            node.pulse +=
                node.pulseSpeed;


            /*
             * نرم کردن حرکت
             */

            node.vx +=
                (Math.random() - .5)
                * .003;

            node.vy +=
                (Math.random() - .5)
                * .003;


            /*
             * محدود کردن سرعت
             */

            const speed =
                Math.sqrt(
                    node.vx * node.vx +
                    node.vy * node.vy
                );


            const maxSpeed =
                .42;


            if(speed > maxSpeed){

                node.vx =
                    node.vx /
                    speed *
                    maxSpeed;

                node.vy =
                    node.vy /
                    speed *
                    maxSpeed;

            }


            /*
             * برگشت از لبه
             */

            if(
                node.x < 0 ||
                node.x > width
            ){

                node.vx *= -1;

            }


            if(
                node.y < 0 ||
                node.y > height
            ){

                node.vy *= -1;

            }


            node.x =
                Math.max(
                    0,
                    Math.min(
                        width,
                        node.x
                    )
                );


            node.y =
                Math.max(
                    0,
                    Math.min(
                        height,
                        node.y
                    )
                );

        });


        /* =================================
           CONNECTIONS
        ================================== */

        for(
            let i = 0;
            i < nodes.length;
            i++
        ){

            for(
                let j = i + 1;
                j < nodes.length;
                j++
            ){

                const a =
                    nodes[i];

                const b =
                    nodes[j];


                const dist =
                    distance(a,b);


                if(
                    dist >
                    connectionDistance
                ){

                    continue;

                }


                const strength =
                    1 -
                    dist /
                    connectionDistance;


                const opacity =
                    .08 +
                    strength *
                    .38;


                /* =========================
                   CONNECTION LINE
                ========================== */

                const gradient =
                    ctx.createLinearGradient(
                        a.x,
                        a.y,
                        b.x,
                        b.y
                    );


                gradient.addColorStop(
                    0,
                    `rgba(
                        63,
                        130,
                        255,
                        ${opacity}
                    )`
                );


                gradient.addColorStop(
                    .5,
                    `rgba(
                        145,
                        83,
                        255,
                        ${opacity}
                    )`
                );


                gradient.addColorStop(
                    1,
                    `rgba(
                        63,
                        130,
                        255,
                        ${opacity}
                    )`
                );


                ctx.beginPath();

                ctx.moveTo(
                    a.x,
                    a.y
                );

                ctx.lineTo(
                    b.x,
                    b.y
                );


                ctx.strokeStyle =
                    gradient;

                ctx.lineWidth =
                    .55 +
                    strength * .7;


                ctx.stroke();


                /* =========================
                   MOVING LIGHT
                ========================== */

                const speed =
                    .00022;


                const progress =
                    (
                        now * speed
                        +
                        i * .071
                        +
                        j * .037
                    ) % 1;


                const lightX =
                    a.x +
                    (b.x - a.x)
                    * progress;


                const lightY =
                    a.y +
                    (b.y - a.y)
                    * progress;


                const glow =
                    ctx.createRadialGradient(
                        lightX,
                        lightY,
                        0,
                        lightX,
                        lightY,
                        9
                    );


                glow.addColorStop(
                    0,
                    `rgba(
                        180,
                        210,
                        255,
                        ${strength * .9}
                    )`
                );


                glow.addColorStop(
                    .35,
                    `rgba(
                        105,
                        150,
                        255,
                        ${strength * .35}
                    )`
                );


                glow.addColorStop(
                    1,
                    "rgba(80,120,255,0)"
                );


                ctx.beginPath();

                ctx.arc(
                    lightX,
                    lightY,
                    9,
                    0,
                    Math.PI * 2
                );

                ctx.fillStyle =
                    glow;

                ctx.fill();

            }

        }


        /* =================================
           NODES
        ================================== */

        nodes.forEach(node => {

            const pulse =
                (
                    Math.sin(node.pulse)
                    + 1
                ) / 2;


            const radius =
                node.radius +
                pulse * 1.2;


            /* =========================
               OUTER GLOW
            ========================== */

            const glow =
                ctx.createRadialGradient(
                    node.x,
                    node.y,
                    0,
                    node.x,
                    node.y,
                    17
                );


            glow.addColorStop(
                0,
                `rgba(
                    105,
                    165,
                    255,
                    ${.40 + pulse * .20}
                )`
            );


            glow.addColorStop(
                .25,
                `rgba(
                    85,
                    135,
                    255,
                    ${.16 + pulse * .12}
                )`
            );


            glow.addColorStop(
                1,
                "rgba(70,120,255,0)"
            );


            ctx.beginPath();

            ctx.arc(
                node.x,
                node.y,
                17,
                0,
                Math.PI * 2
            );

            ctx.fillStyle =
                glow;

            ctx.fill();


            /* =========================
               NODE CORE
            ========================== */

            ctx.beginPath();

            ctx.arc(
                node.x,
                node.y,
                radius,
                0,
                Math.PI * 2
            );


            ctx.fillStyle =
                "#7db0ff";

            ctx.shadowBlur =
                14;

            ctx.shadowColor =
                "#5794ff";

            ctx.fill();


            ctx.shadowBlur = 0;

        });


        requestAnimationFrame(
            animate
        );

    }


    animate();

}


/* =========================================
   PAGE SYSTEM
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

    Object.values(pages)
        .forEach(page => {

            page.classList.remove(
                "active-page"
            );

        });


    if(pages[name]){

        pages[name]
            .classList.add(
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

let toastTimer;


function toast(message){

    const element =
        $("toast");


    element.textContent =
        message;


    element.classList.add(
        "show"
    );


    clearTimeout(
        toastTimer
    );


    toastTimer =
        setTimeout(
            () => {

                element.classList.remove(
                    "show"
                );

            },
            2500
        );

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
            >
                افزودن به فاکتور تستی
            </button>

        `;


        $("modalAction")
            .addEventListener(
                "click",
                () => {

                    const barcode =
                        $("modalBarcode")
                            .value
                            .trim();


                    if(!barcode){

                        toast(
                            "بارکد را وارد کنید"
                        );

                        return;

                    }


                    toast(
                        "کالا به فاکتور تستی اضافه شد"
                    );


                    closeModal();

                    showPage("sale");

                }
            );

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
            >
                ثبت ورود تستی
            </button>

        `;


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
                        "ورود کالا به انبار ثبت شد"
                    );


                    closeModal();

                    showPage(
                        "inventory"
                    );

                }
            );

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
            >
                ثبت کالای تستی
            </button>

        `;


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
                        color:#9b7cff;
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
                style="margin-top:15px"
            >
                بستن گزارش
            </button>

        `;


        $("modalAction")
            .addEventListener(
                "click",
                closeModal
            );

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
   QUICK ACTIONS
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
                    "بارکد یا نام کالا را وارد کنید"
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
                "فروش تستی ثبت شد"
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
   INVENTORY
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
                "جستجوی تستی انبار"
            );

        }
    );


/* =========================================
   OTHER BUTTONS
========================================= */

$("refreshButton")
    .addEventListener(
        "click",
        () => {

            toast(
                "اطلاعات بروزرسانی شد"
            );

        }
    );


$("allSalesButton")
    .addEventListener(
        "click",
        () => {

            toast(
                "لیست کامل فروش‌ها در نسخه تستی"
            );

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
                        "حساب کاربری تستی"
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
