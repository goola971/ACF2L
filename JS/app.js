// j'ai créé se module pour faire un peu comme react et react-router-dom et gerer certaines fonctionnalités

// definition des routes
const routes = {
    "/": "./HTML/pages/home.html",
    "/homeMobile": "./HTML/pages/homeMobile.html",
};

// definition des ulm et leurs images
const imgULMList = {
    paramoteur: "../IMG/ulm/paramoteur.svg",
    pendulaire: "../IMG/ulm/pendulaire.svg",
    multiAxes: "../IMG/ulm/multiAxes.svg",
    autoGire: "../IMG/ulm/autoGire.svg",
    aeroStat: "../IMG/ulm/aeroStat.svg",
    helicoptere: "../IMG/ulm/helicoptere.svg",
};

// fonction pour charger le html
async function loadHTML(path, targetId, callback) {
    const target = document.getElementById(targetId);
    try {
        const res = await fetch(path);
        if (!res.ok) throw new Error("404");
        const html = await res.text();
        target.innerHTML = html;
    } catch {
        const res = await fetch("./HTML/404.html");
        const html = await res.text();
        target.innerHTML = html;
    }

    if (typeof callback === "function") callback();
}

// fonction pour gérer le routage
function router() {
    const path = window.location.hash.slice(1) || "/";
    const page = routes[path] || "./HTML/404.html";

    loadHTML(page, "app", () => {
        initMenuSelector();
    });

    highlightActiveLink(path);
}

// fonction pour charger le header
async function loadHeader() {
    await loadHTML("./HTML/components/header.html", "header");
}

// fonction pour charger le footer
async function loadFooter() {
    await loadHTML("./HTML/components/footer.html", "footer");
}

// pour regerer les # car le routage enlevait le comportement par defaut des # avec les id des sections
document.addEventListener("click", (e) => {
    const target = e.target.closest("a[href^='#']");
    if (target) {
        const href = target.getAttribute("href");

        if (href.startsWith("#/")) return;

        e.preventDefault();
        const id = href.substring(1);
        const section = document.getElementById(id);
        if (section) {
            section.scrollIntoView({ behavior: "smooth" });
        }
    }
});

// fonction pour initialiser le menu selector et les images des ulm dans la section ulm
function initMenuSelector() {
    const menu = document.getElementById("menu");
    const selector = document.getElementById("selector");
    const ulmImg = document.getElementById("ulmRepresentation");
    if (!menu || !selector || !ulmImg) return;

    const items = menu.querySelectorAll("li");
    if (items.length > 0) {
        selector.style.top = items[0].offsetTop + "px";
        items[0].classList.add("text-black");

        const value = items[0].dataset.value;
        if (value && imgULMList[value]) {
            ulmImg.src = imgULMList[value];
        }
    }

    items.forEach((li) => {
        li.addEventListener("click", () => {
            items.forEach((el) => el.classList.remove("text-black"));

            li.classList.add("text-black");
            selector.style.top = li.offsetTop + "px";

            const value = li.dataset.value;
            if (value && imgULMList[value]) {
                ulmImg.classList.add("fade-out");
                setTimeout(() => {
                    ulmImg.src = imgULMList[value];
                    ulmImg.classList.remove("fade-out");
                    ulmImg.classList.add("fade-in");
                    setTimeout(() => ulmImg.classList.remove("fade-in"), 300);
                }, 300);
            }
        });
    });
}

// fonction pour mettre a jour le lien actif en fonction de la section visible
function updateActiveLink() {
    const sections = document.querySelectorAll("section[id]");
    const scrollY = window.scrollY;

    sections.forEach((section) => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute("id");

        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
            document.querySelectorAll("nav ul li a").forEach((link) => {
                link.classList.remove("active");
            });

            const activeLink = document.querySelector(
                `nav ul li a[href="#${sectionId}"]`
            );
            if (activeLink) {
                activeLink.classList.add("active");
            }
        }
    });
}

function initHeaderfixed() {
    // passer le header en position fixed au scroll
    const header = document.getElementById("header");

    window.addEventListener("scroll", () => {
        if (window.scrollY > 10) {
            header.classList.add("fixed-top");
            header.classList.remove("sticky-top");
        } else {
            header.classList.remove("fixed-top");
            header.classList.add("sticky-top");
        }
    });
}

function detectHomePage() {
    const isMobile = window.innerWidth < 1000;
    if (isMobile) {
        window.location.hash = "/homeMobile";
    } else {
        window.location.hash = "/";
    }
}

window.addEventListener("resize", detectHomePage);

// lancer les fonctions avec les evenements
window.addEventListener("scroll", () => {
    updateActiveLink();
});

window.addEventListener("load", async () => {
    detectHomePage();
    await loadHeader();
    await loadFooter();
    initHeaderfixed();
    router();
    updateActiveLink();
});
window.addEventListener("hashchange", router);
