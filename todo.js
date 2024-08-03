import {
    collection,
    addDoc,
    getDocs,
    updateDoc,
    doc,
    deleteDoc,
    Timestamp,
    query,
    where,
    orderBy
} from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";
import { auth, db } from "./config.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js";

let arr = [];

onAuthStateChanged(auth, (user) => {
    if (user) {
        const uid = user.uid;
    } else {
        window.location = 'index.html';
    }
});

const input_value = document.querySelector('#input_value');
const add_todo_btn = document.querySelector('#add_todo_btn');
const todo_listing = document.querySelector('#todo_listing');
const logout = document.querySelector('#logout');
const inputValue = document.querySelector('#input_value');
const city_btn = document.querySelectorAll('.city_btn');
const selectValue = document.querySelector('#cities');
const reset_btn = document.querySelector('.reset_btn');
const delete_all = document.querySelector('.delete-all');

logout.addEventListener('click', () => {
    signOut(auth).then(() => {
        // Successfully signed out
    }).catch((error) => {
        // Error signing out
    });
});

// Show data from the database when the reset button is clicked
reset_btn.addEventListener('click', () => { Show_dta_from_db(); });

// Delete all documents when the delete all button is clicked
delete_all.addEventListener('click', () => { deleteAllDocuments(); });

// Add event listeners to city buttons to filter todos by city
city_btn.forEach((btn) => {
    btn.addEventListener('click', e => { FilterCityFunction(e.target); });
});

// Filters todos by city and updates the UI
async function FilterCityFunction(e) {
    arr = [];
    const city = e.innerHTML;
    const q = query(collection(db, "todoList"), where("city", "==", city), orderBy("time", "desc"));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        arr.push(doc.data());
    });
    render();
}

// Adds a new todo item to the database and updates the UI
add_todo_btn.addEventListener('click', async (e) => {
    e.preventDefault();
    inputValue.classList.remove('error');
    selectValue.classList.remove('error');
    if (input_value.value === '' && selectValue.value === '') {
        inputValue.classList.add('error');
        selectValue.classList.add('error');
        return;
    } else if (input_value.value === '') {
        inputValue.classList.add('error');
        return;
    } else if (selectValue.value === '') {
        selectValue.classList.add('error');
        return;
    }

    const user = auth.currentUser;
    const docRef = await addDoc(collection(db, "todoList"), {
        text: input_value.value,
        userId: user.uid,
        city: selectValue.value,
        userEmail: user.email,
        userName: user.displayName,
        photoURL: user.photoURL,
        time: Timestamp.fromDate(new Date()),
    });

    await updateDoc(doc(db, "todoList", docRef.id), { id: docRef.id });

    arr.unshift({
        text: input_value.value,
        userId: user.uid,
        city: selectValue.value,
        userEmail: user.email,
        userName: user.displayName,
        photoURL: user.photoURL,
        id: docRef.id,
        time: Timestamp.fromDate(new Date())
    });
    input_value.value = '';
    render();
});

// Fetches and displays all todos from the database
async function Show_dta_from_db() {
    arr = [];
    const q = query(collection(db, "todoList"), orderBy("time", "desc"));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        arr.push(doc.data());
    });
    render();
}
Show_dta_from_db();

// Render the todos to the UI
function render() {
    todo_listing.innerHTML = '';
    if (arr.length === 0) {
        todo_listing.innerHTML = "No Data Found";
        return;
    }

    arr.forEach((item, index) => {
        todo_listing.innerHTML += `
            <div id="todo_${item.id}" class="task" data-id="${item.id}" data-index="${index}">
                <input class="input_in" type="text" style="display: none;">
                <p class="para">${item.text}</p>
                <span class="city_css">City: ${item.city}</span>
                <div class="task1">
                    <span class="h_del">Delete</span>
                    <button class="h_edit">Edit</button>
                    <button class="h_updte" style="display: none;">Update</button>
                </div>
            </div>
        `;
    });

    // Add event listeners to edit, update, and delete buttons
    document.querySelectorAll('.h_edit').forEach((button) => {
        button.addEventListener('click', e => edited(e.target));
    });
    document.querySelectorAll('.h_updte').forEach((button) => {
        button.addEventListener('click', e => update(e.target));
    });
    document.querySelectorAll('.h_del').forEach((button) => {
        button.addEventListener('click', e => deleted(e.target));
    });
}

// Show the input field for editing and hide the paragraph
function edited(btn) {
    const parentContainer = btn.closest('.task');
    const inputField = parentContainer.querySelector('.input_in');
    const paragraph = parentContainer.querySelector('.para');
    const editButton = parentContainer.querySelector('.h_edit');
    const updateButton = parentContainer.querySelector('.h_updte');
    inputField.style.display = 'block';
    paragraph.style.display = 'none';
    updateButton.style.display = 'block';
    editButton.style.display = 'none';
    inputField.value = paragraph.innerHTML;
}

// Update the todo item in the database and the UI
async function update(btn) {
    const parentContainer = btn.closest('.task');
    const inputField = parentContainer.querySelector('.input_in');
    const paragraph = parentContainer.querySelector('.para');
    const editButton = parentContainer.querySelector('.h_edit');
    const updateButton = parentContainer.querySelector('.h_updte');
    const id = parentContainer.dataset.id;
    inputField.style.display = 'none';
    paragraph.style.display = 'block';
    updateButton.style.display = 'none';
    editButton.style.display = 'block';
    paragraph.innerHTML = inputField.value;
    const changeData = arr.find(item => id == item.id);
    changeData.text = inputField.value;
    await updateDoc(doc(db, "todoList", id), { text: inputField.value });
}

// Delete a todo item from the database and the UI
async function deleted(btn) {
    const parentContainer = btn.closest('.task');
    const id = parentContainer.dataset.id;
    const index = parentContainer.dataset.index;
    arr.splice(index, 1);
    await deleteDoc(doc(db, "todoList", id));
    render();
}

// Delete all todo items from the database
async function deleteAllDocuments() {
    const dbs = collection(db, 'todoList');
    const get_dt_dbs = await getDocs(dbs);
    arr.length = 0;
    render();
    get_dt_dbs.docs.forEach(async (doc) => {
        await deleteDoc(doc.ref);
    });
}
