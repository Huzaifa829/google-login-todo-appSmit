import { collection, addDoc, getDocs ,updateDoc,doc,deleteDoc  } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js"; 
import { auth, db } from "./config.js";
import { onAuthStateChanged,signOut  } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js";


onAuthStateChanged(auth, (user) => {
    if (user) {
      const uid = user.uid;
      // ...
    } else {
        window.location = 'index.html'
      // User is signed out
      // ...
    }
  });

const input_value = document.querySelector('#input_value')
const add_todo_btn = document.querySelector('#add_todo_btn')
const todo_listing = document.querySelector('#todo_listing')
const logout  = document.querySelector('#logout')

let arr = []

logout.addEventListener('click', ()=>{
    signOut(auth).then(() => {
        // Sign-out successful.
      }).catch((error) => {
        // An error happened.
      });
})



add_todo_btn.addEventListener('click',async (e)=>{
    e.preventDefault()
    const user = auth.currentUser;

    const docRef = await addDoc(collection(db, "todoList"), {
        text:input_value.value,
        userId: user.uid,
        userEmail: user.email,
        userName: user.displayName,
        photoURL: user.photoURL,
    });
    await updateDoc(doc(db, "todoList", docRef.id), {
        id: docRef.id
    });
    arr.push({
        text:input_value.value,
        userId: user.uid,
        userEmail: user.email,
        userName: user.displayName,
        photoURL: user.photoURL,
        id: docRef.id
    })
    input_value.value = ''
    // console.log(docRef.id);
    render()

})
async function Show_dta_from_db(){
 const querySnapshot = await getDocs(collection(db, "todoList"));
    querySnapshot.forEach((doc) => {
        // console.log(doc.data());
        arr.push(doc.data())
        
    });
    render()
}
Show_dta_from_db()
function render(){
    todo_listing.innerHTML = '';
    
    arr.map((item,index)=>{

        // console.log(item.text);
        todo_listing.innerHTML +=`
          <div id="h_min_todo_div" class="task" data-id="${item.id}" data-index="${index}">
          <input class="input_in" type="text" style="display: none;">
                <p class="para">${item.text}</p>
              <div class="task1"><span class="h_del" id="deleting">Delete</span><button
                     class="h_edit" id="editing">Edited</button><button id="Update_editing" class="h_updte"
                         style="display: none;">Update</button></div>
             </div>
        `
        // console.log(item.id);
    const h_edited = document.querySelectorAll('#h_min_todo_div .h_edit')
    const h_delete = document.querySelectorAll('#h_min_todo_div .h_del')
    const h_update = document.querySelectorAll('#h_min_todo_div .h_updte')
    h_edited.forEach((button) => {
        button.addEventListener('click', e => edited(e.target))
    })
    h_update.forEach((button) => {
        button.addEventListener('click', e => update(e.target))
    })
    h_delete.forEach((button) => {
        button.addEventListener('click', e => deleted(e.target,index))
    })


    })


}
render()

function edited(btn){
    const parentContainer = btn.closest('.task');
        const inputField = parentContainer.querySelector('.input_in');
        const paragraph = parentContainer.querySelector('.para');
        const editing = parentContainer.querySelector('#editing');
        const edit = parentContainer.querySelector('#Update_editing');
        inputField.style.display = 'block';
        paragraph.style.display = 'none';
        edit.style.display = 'block';
        editing.style.display = 'none';
        inputField.value = paragraph.innerHTML
    // console.log(parentContainer);
    // console.log(id);
    // console.log(index);

}
async function update(btn){
    const parentContainer = btn.closest('.task');
        const inputField = parentContainer.querySelector('.input_in');
        const paragraph = parentContainer.querySelector('.para');
        const editing = parentContainer.querySelector('#editing');
        const edit = parentContainer.querySelector('#Update_editing');
        const id = parentContainer.dataset.id;
        inputField.style.display = 'none';
        paragraph.style.display = 'block';
        edit.style.display = 'none';
        editing.style.display = 'block';
        paragraph.innerHTML = inputField.value
        const changeData = arr.find(item => id == item.id)
        changeData.text = inputField.value;
        await updateDoc(doc(db, "todoList", id), {
            text: inputField.value
        });
        // console.log('chnged');

}
async function deleted(btn){
    const parentContainer = btn.closest('.task');
    const id = parentContainer.dataset.id;
    const index = parentContainer.dataset.index;
    arr.splice(index, 1);
    render()
    await deleteDoc(doc(db, "todoList", id));
    // console.log('deleted',index);


}