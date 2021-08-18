// import "../styles/index.css";

// TODO: make everything compatable with nested data
const apiUrl = "https://jsonplaceholder.typicode.com/users/1/todos";

async function getApi(url) {
    const response = await fetch(url);
    const data = await response.json();
    console.log(data);

    const listBtn = document.getElementById("listBtn");
    const addBtn = document.getElementById("addBtn");
    const listDiv = document.getElementById("listDiv");
    const editDiv = document.getElementById("editDiv");
    const addDiv = document.getElementById("addDiv");

    listBtn.onclick = (e) => {
        e.preventDefault();
        listView();
    }
    addBtn.onclick = (e) => {
        e.preventDefault();
        addItem();
    }

    // LIST VIEW

    // when press list items, we run this function to display list
    // TODO: sort by id/title/completed
    function listView() {
        listDiv.style.display = "block";
        editDiv.style.display = "none";
        addDiv.style.display = "none";

        let ul = document.getElementById("list");
        // console.log(ul)

        // clear out old list
        const oldItems = document.getElementsByClassName("item");
        while (oldItems.length) oldItems[0].remove();

        // create our new list
        for (let i = 0; i < Object.keys(data).length; i++) {
            let item = data[i];
            const keys = Object.keys(item);
            // console.log(keys)
            const li = document.createElement("li");
            li.setAttribute("class", "item");
            for (const key of keys) {
                // console.log(key)
                const div = document.createElement("div")
                div.setAttribute("class", `${key}`)
                div.appendChild(document.createTextNode(`${key}: ${item[key]}`))
                li.appendChild(div);
            }
            const editBtn = document.createElement("button");
            editBtn.setAttribute("class", "editBtn");
            editBtn.setAttribute("type", "button");
            editBtn.appendChild(document.createTextNode("EDIT"));
            // Clicking an item will bring up the EDIT VIEW
            editBtn.onclick = (e) => {
                e.preventDefault();
                editItem(i);
            }
            li.appendChild(editBtn);

            const deleteBtn = document.createElement("button");
            deleteBtn.setAttribute("class", "deleteBtn");
            deleteBtn.setAttribute("type", "button");
            deleteBtn.appendChild(document.createTextNode("DELETE"));
            deleteBtn.onclick = (e) => {
                e.preventDefault();
                deleteItem(i);
            }
            li.appendChild(deleteBtn);

            ul.appendChild(li);
        }
    }

    // EDIT VIEW
    function editItem(idx) {

        let oldLabels = document.getElementsByClassName("formLabel");
        let oldInputs = document.getElementsByClassName("formInput");

        while (oldLabels.length || oldInputs.length) {
            if (oldLabels.length) oldLabels[0].remove();
            if (oldInputs.length) oldInputs[0].remove();
        }

        let item = data[idx];
        listDiv.style.display = "none";
        editDiv.style.display = "block";
        addDiv.style.display = "none";
        // console.log(item)
        const form = document.getElementById("editItem");
        const keys = Object.keys(item);
        const newItem = {...item};
        for (const key of keys) {
            // console.log(key)
            const label = document.createElement("label");
            label.appendChild(document.createTextNode(`${key}`));
            label.setAttribute("class", "formLabel")
            form.appendChild(label);

            const input = document.createElement("input");
            input.setAttribute("type", "text");
            input.setAttribute("value", `${item[key]}`);
            input.setAttribute("class", "formInput")
            input.onchange = () => {
                newItem[key] = input.value;
            }
            form.appendChild(input);
        }

        // SUBMIT BUTTON
        const submit = document.createElement("input");
        submit.setAttribute("type", "submit");
        submit.setAttribute("value", "submit");
        submit.setAttribute("class", "formInput");
        form.appendChild(submit);
        submit.onclick = (e) => {
            e.preventDefault();
            data[idx] = newItem;
        }
    }

    // REMOVE ITEM
    function deleteItem(idx) {
        data.splice(idx,1);
        listView();
    }

    // ADD ITEM
    function addItem() {
        listDiv.style.display = "none";
        editDiv.style.display = "none"
        addDiv.style.display = "block";
        let oldLabels = document.getElementsByClassName("formLabel");
        let oldInputs = document.getElementsByClassName("formInput");

        while (oldLabels.length || oldInputs.length) {
            if (oldLabels.length) oldLabels[0].remove();
            if (oldInputs.length) oldInputs[0].remove();
        }
        const keys = Object.keys(data[0]);
        let newItem ={};
        const form = document.getElementById("addItem");
        // form.setAttribute("name", "addForm");

        for (const key of keys) {
            const label = document.createElement("label");
            label.appendChild(document.createTextNode(`${key}`));
            label.setAttribute("class", "formLabel")
            form.appendChild(label);

            const input = document.createElement("input");
            input.setAttribute("type", "text");
            input.setAttribute("class", "formInput");
            input.setAttribute("required", "");
            input.onchange = () => {
                newItem[key] = input.value;
            }
            form.appendChild(input);
        }

        // SUBMIT BUTTON
        const submit = document.createElement("input");
        submit.setAttribute("type", "submit");
        submit.setAttribute("value", "submit");
        submit.setAttribute("class", "formInput");
        form.appendChild(submit);
        submit.onclick = (e) => {
            e.preventDefault();
            validateForm(form);
            data.push(newItem);
        }
    }

    function validateForm(form) {
        for (let i = 0; i < form.length - 1; i++) {
            console.log(form[i])
            console.log(form[i].value)
        }
    }

}

getApi(apiUrl);