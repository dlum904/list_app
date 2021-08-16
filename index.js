// import "../styles/index.css";
const apiUrl = "https://jsonplaceholder.typicode.com/users/1/todos";

async function getApi(url) {
    const response = await fetch(url);
    const data = await response.json();
    console.log(data)

    // LIST VIEW
    const listBtn = document.getElementById("listBtn");
    const list = document.getElementById("list");
    listBtn.onclick = (e) => {
        e.preventDefault();
        list.style.display = "block";
        listView()
    }

    // when press list items, we run this function to display list
    // TODO: sort by id/title/completed
    function listView() {
        const ul = document.getElementById("list");
        for (const item of data) {
            const keys = Object.keys(item);
            // console.log(keys)
            const li = document.createElement("li");
            li.setAttribute("id", item.id);
            for (const key of keys) {
                // console.log(key)
                const div = document.createElement("div")
                div.setAttribute("class", `${key}`)
                div.appendChild(document.createTextNode(`${key}: ${item[key]}`))
                li.appendChild(div);
                
            }
            ul.appendChild(li);
            // Clicking an item will bring up the EDIT VIEW and hide the LIST VIEW
            li.onclick = (e) => {
                e.preventDefault();
                ul.style.display = "none";
                editItem(item);
            }
        }
    }

    // EDIT VIEW
    function editItem(item) {
        // e.preventDefault();
        console.log(item)

        const form = document.getElementById("editItem");
        // // debugger
        const keys = Object.keys(item);
        for (const key of keys) {
            console.log(key)
            const label = document.createElement("label");
            label.appendChild(document.createTextNode(`${key}`));
            form.appendChild(label);

            const input = document.createElement("input");
            input.setAttribute("type", "text");
            form.appendChild(input);
        }
    }
}

getApi(apiUrl);