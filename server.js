const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");

const products = [
    {
        "id": 1,
        "type": "Laptop",
        "name": "Lenovo ThinkPad T480",
        "processor": "Intel Core i5-8350U",
        "ram": "16GB",
        "storage": "512GB SSD",
        "display": "14\" Full HD",
        "condition": "Grade A",
        "price": 249.99
    },
    {
        "id": 2,
        "type": "PC",
        "name": "Dell OptiPlex 7070 Micro",
        "processor": "Intel Core i5-9500T",
        "ram": "16GB",
        "storage": "256GB SSD",
        "condition": "Grade A",
        "price": 219.00
    },
    {
        "id": 3,
        "type": "Laptop",
        "name": "Dell Latitude 7490",
        "processor": "Intel Core i7-8650U",
        "ram": "16GB",
        "storage": "512GB SSD",
        "display": "14\" Full HD",
        "condition": "Grade A",
        "price": 269.00
    },
    {
        "id": 4,
        "type": "PC",
        "name": "HP EliteDesk 800 G5 Mini",
        "processor": "Intel Core i7-9700T",
        "ram": "16GB",
        "storage": "512GB SSD",
        "condition": "Grade A",
        "price": 289.00
    },
    {
        "id": 5,
        "type": "Laptop",
        "name": "Apple MacBook Air M1 (2020)",
        "processor": "Apple M1",
        "ram": "8GB",
        "storage": "256GB SSD",
        "display": "13.3\" Retina",
        "condition": "Excellent",
        "price": 479.00
    },
    {
        "id": 6,
        "type": "PC",
        "name": "Lenovo ThinkCentre M720q Tiny",
        "processor": "Intel Core i5-8400T",
        "ram": "8GB",
        "storage": "256GB SSD",
        "condition": "Grade A",
        "price": 179.99
    },
    {
        "id": 7,
        "type": "Laptop",
        "name": "HP EliteBook 840 G6",
        "processor": "Intel Core i5-8365U",
        "ram": "16GB",
        "storage": "256GB SSD",
        "display": "14\" Full HD",
        "condition": "Grade A",
        "price": 259.50
    },
    {
        "id": 8,
        "type": "PC",
        "name": "Apple Mac Mini M1 (2020)",
        "processor": "Apple M1",
        "ram": "8GB",
        "storage": "256GB SSD",
        "condition": "Excellent",
        "price": 389.00
    },
    {
        "id": 9,
        "type": "Laptop",
        "name": "Lenovo ThinkPad X1 Carbon Gen 8",
        "processor": "Intel Core i7-10610U",
        "ram": "16GB",
        "storage": "512GB SSD",
        "display": "14\" Full HD",
        "condition": "Grade A",
        "price": 369.99
    },
    {
        "id": 10,
        "type": "PC",
        "name": "Dell Precision 3630 Tower",
        "processor": "Intel Core i7-8700",
        "ram": "32GB",
        "storage": "1TB SSD",
        "condition": "Grade A",
        "price": 399.00
    },
    {
        "id": 11,
        "type": "Laptop",
        "name": "Dell XPS 13 9310",
        "processor": "Intel Core i7-1185G7",
        "ram": "16GB",
        "storage": "512GB SSD",
        "display": "13.4\" Full HD+",
        "condition": "Grade A",
        "price": 449.00
    },
    {
        "id": 12,
        "type": "PC",
        "name": "HP Z2 G4 Workstation",
        "processor": "Intel Xeon E-2144G",
        "ram": "32GB",
        "storage": "512GB SSD",
        "condition": "Grade A",
        "price": 359.00
    },
    {
        "id": 13,
        "type": "Laptop",
        "name": "Lenovo ThinkPad T14 Gen 2",
        "processor": "AMD Ryzen 5 PRO 5650U",
        "ram": "16GB",
        "storage": "512GB SSD",
        "display": "14\" Full HD",
        "condition": "Grade A",
        "price": 349.00
    },
    {
        "id": 14,
        "type": "PC",
        "name": "Lenovo ThinkCentre M90q Gen 2",
        "processor": "Intel Core i5-11500T",
        "ram": "16GB",
        "storage": "512GB SSD",
        "condition": "Grade A",
        "price": 329.00
    },
    {
        "id": 15,
        "type": "Laptop",
        "name": "ASUS ZenBook 14 UM425",
        "processor": "AMD Ryzen 7 5700U",
        "ram": "16GB",
        "storage": "512GB SSD",
        "display": "14\" Full HD",
        "condition": "Grade B",
        "price": 310.00
    },
    {
        "id": 16,
        "type": "PC",
        "name": "Dell OptiPlex 5090 SFF",
        "processor": "Intel Core i7-11700",
        "ram": "16GB",
        "storage": "512GB SSD",
        "condition": "Grade A",
        "price": 379.00
    },
    {
        "id": 17,
        "type": "Laptop",
        "name": "Apple MacBook Pro 14 (2021)",
        "processor": "Apple M1 Pro",
        "ram": "16GB",
        "storage": "512GB SSD",
        "display": "14.2\" Liquid Retina XDR",
        "condition": "Excellent",
        "price": 849.00
    },
    {
        "id": 18,
        "type": "PC",
        "name": "HP ProDesk 600 G6 SFF",
        "processor": "Intel Core i5-10500",
        "ram": "16GB",
        "storage": "256GB SSD",
        "condition": "Grade A",
        "price": 249.00
    },
    {
        "id": 19,
        "type": "Laptop",
        "name": "HP ProBook 450 G8",
        "processor": "Intel Core i5-1135G7",
        "ram": "16GB",
        "storage": "256GB SSD",
        "display": "15.6\" Full HD",
        "condition": "Grade A",
        "price": 299.00
    },
    {
        "id": 20,
        "type": "PC",
        "name": "Apple Mac Studio M1 Max (2022)",
        "processor": "Apple M1 Max",
        "ram": "32GB",
        "storage": "512GB SSD",
        "condition": "Excellent",
        "price": 1199.00
    }
]


const server = http.createServer((request, response) => {
    // Egyszerű CORS-beállítás: a böngésző engedélyezi a szerver válaszait.
    response.setHeader("Access-Control-Allow-Origin", "*");
    response.setHeader("Access-Control-Allow-Headers", "Content-Type");
    response.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");

    if (request.method === "OPTIONS") {
        response.writeHead(204);
        response.end();
        return;
    }


    const staticFiles = {
        "/style.css": { file: "css/style.css", contentType: "text/css; charset=utf-8" },
        "/script.js": { file: "js/script.js", contentType: "text/javascript; charset=utf-8" },
        "/assets/img/logo_withoutbg_blacktext.png": { file: "assets/img/logo_withoutbg_blacktext.png", contentType: "image/png" },
        "/assets/img/hero-desk.jpg": { file: "/assets/img/hero-desk.jpg", contentType: "image/png" },
    };




    const staticFile = staticFiles[request.url];

    console.log(staticFiles)

    if (request.method === "GET" && staticFile) {
        fs.readFile(path.join(__dirname, staticFile.file), (error, content) => {
            if (error) {
                response.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
                response.end("A felület fájljai most nem érhetők el.");
                return;
            }

            response.writeHead(200, { "Content-Type": staticFile.contentType });
            response.end(content);
        });
        return;
    }


    const url = new URL(request.url, "http://localhost:8080");





    if (request.method === "GET" && url.pathname === "/") {
        fs.readFile(path.join(__dirname, "index.html"), (error, content) => {
            if (error) {
                response.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
                response.end("A felület fájljai most nem érhetők el.");
                return;
            }

            response.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
            response.end(content);
        });
        return;
    }


    if (request.method === "GET" && (
        url.pathname === "/" ||
        url.pathname === "/index.html" ||
        url.pathname === "/products.html" ||
        url.pathname === "/trade-in.html" ||
        url.pathname === "/contact.html"
    )) {
        const fileName = url.pathname === "/" ? "index.html" : url.pathname.substring(1);

        fs.readFile(path.join(__dirname, fileName), (error, content) => {
            if (error) {
                response.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
                response.end("A felület fájljai most nem érhetők el.");
                return;
            }

            response.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
            response.end(content);
        });
        return;
    }


    
    response.writeHead(404, "Content-Type: charset=utf-8");
    response.end("Nincs ilyen útvonal.");
});

server.listen(8080, "127.0.0.1", () => {
    console.log("A szerver fut: http://127.0.0.1:8080");
});
