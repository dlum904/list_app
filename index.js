const apiUrl = "https://jsonplaceholder.typicode.com/users/1/todos";

async function getApi(url) {
    const response = await fetch(url);
    let data = await response.json();
    // console.log(data);

    const listBtn = document.getElementById("listBtn");
    const addBtn = document.getElementById("addBtn");
    const listDiv = document.getElementById("listDiv");
    const editDiv = document.getElementById("editDiv");
    const addDiv = document.getElementById("addDiv");
    const filterRadios = document.getElementsByName("filter");

    // make copy of schema incase user deletes all data
    let schema = data[0];

    // add onclick to radio filters
    for (let input of filterRadios) input.onclick = (e) => listView();

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
    function listView() {
        listDiv.style.display = "block";
        editDiv.style.display = "none";
        addDiv.style.display = "none";

        filter();

        // clear out old list
        const oldItems = document.getElementsByClassName("item");
        while (oldItems.length) oldItems[0].remove();
        
        let ul = document.getElementById("list");
        // create our new list
        for (let i = 0; i < Object.keys(data).length; i++) {
            let item = data[i];
            const keys = Object.keys(item);
            const li = document.createElement("li");
            li.setAttribute("class", "item");
            for (const key of keys) {
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

    // Filter/sort our data depending on our radio input filters
    function filter() {
        let filters = document.querySelector("form");
        let filterBy
        for (const filter of filters) {
            if (filter.checked) filterBy = filter.value;
        }
        let filteredOut = data.filter((item) => item["completed"] === false);
        let filteredIn = data.filter((item) => item["completed"] === true);
        switch (filterBy) {
            case "IDAsc":
                data.sort((a, b) => a["id"] - b["id"]);
                break;
            case "IDDesc":
                data.sort((a, b) => b["id"] - a["id"]);
                break;
            case "TitleAsc":
                data.sort((a, b) => a["title"].charCodeAt(0) - b["title"][0].charCodeAt(0));
                break;
            case "TitleDesc":
                data.sort((a, b) => b["title"].charCodeAt(0) - a["title"][0].charCodeAt(0));
                break;
            case "Completed":
                data = filteredIn.concat(filteredOut);
                break;
            case "Not Completed":
                data = filteredOut.concat(filteredIn);
                break;

        }

    }

    
    // EDIT ITEM VIEW
    function editItem(idx) {

        let oldLabels = document.getElementsByClassName("formLabel");
        let oldInputs = document.getElementsByClassName("formInput");

        // clear out old inputs
        while (oldLabels.length || oldInputs.length) {
            if (oldLabels.length) oldLabels[0].remove();
            if (oldInputs.length) oldInputs[0].remove();
        }

        let item = data[idx];
        listDiv.style.display = "none";
        editDiv.style.display = "block";
        addDiv.style.display = "none";

        const form = document.getElementById("editItem");
        const keys = Object.keys(item);
        const newItem = {...item};
        for (const key of keys) {
            const label = document.createElement("label");
            label.appendChild(document.createTextNode(`${key}`));
            label.setAttribute("class", "formLabel")
            form.appendChild(label);

            const input = document.createElement("input");
            if (typeof item[key] === "number") {
                input.setAttribute("type", "number");
                input.setAttribute("value", `${item[key]}`);
                input.onchange = () => newItem[key] = input.value;
            } else if (typeof item[key] === "boolean") {
                input.setAttribute("type", "checkbox");
                input.setAttribute("value", true);
                if (item[key] === true) {
                    input.setAttribute("checked", true);
                }
                input.onchange = () => {
                    newItem[key] = !newItem[key];
                }
            } else {
                input.setAttribute("type", "text")
                input.onchange = () => newItem[key] = input.value;
            }
            input.setAttribute("class", "formInput");
            input.setAttribute("value", `${item[key]}`);
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
            validateDataType(newItem);
            if (validateForm(newItem)) data[idx] = newItem;
            else alert("please fill in ALL fields")
            
            listView();
        }
    }

    // REMOVE ITEM
    function deleteItem(idx) {
        data.splice(idx,1);
        listView();
    }

    // ADD ITEM VIEW
    function addItem() {
        listDiv.style.display = "none";
        editDiv.style.display = "none"
        addDiv.style.display = "block";
        
        let oldLabels = document.getElementsByClassName("formLabel");
        let oldInputs = document.getElementsByClassName("formInput");
        // clear out old inputs
        while (oldLabels.length || oldInputs.length) {
            if (oldLabels.length) oldLabels[0].remove();
            if (oldInputs.length) oldInputs[0].remove();
        }
        const keys = Object.keys(schema);
        let newItem ={};
        const form = document.getElementById("addItem");
        
        for (const key of keys) {
            const label = document.createElement("label");
            label.appendChild(document.createTextNode(`${key}`));
            label.setAttribute("class", "formLabel");
            form.appendChild(label);

            const input = document.createElement("input");
            if (typeof schema[key] === "number") {
                input.setAttribute("type", "number");
                input.onchange = () => newItem[key] = input.value;
            } else if (typeof schema[key] === "boolean") {
                input.setAttribute("type", "checkbox");
                input.setAttribute("value", true);
                input.onchange = () => {
                    newItem[key] = !newItem[key];
                }
            } else {
                input.setAttribute("type", "text")
                input.onchange = () => newItem[key] = input.value;
            }
            input.setAttribute("class", "formInput");

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
            validateDataType(newItem);
            if (validateForm(newItem)) {
                data.push(newItem);
                listView();
            }
            else alert("please fill in ALL fields")
            
        }
    }
    // makes sure the data types or correct
    function validateDataType(newItem) {
        if (!newItem["completed"]) newItem["completed"] = false;
        if (parseInt(newItem["userId"])) newItem["userId"] = parseInt(newItem["userId"])
        if (parseInt(newItem["id"])) newItem["id"] = parseInt(newItem["id"]);

    }
    // makes sure all fields are filled
    function validateForm(newItem) {
        if (Object.keys(newItem).length < Object.keys(schema).length) return false;
        return true;
    }

    listView();
}

getApi(apiUrl);