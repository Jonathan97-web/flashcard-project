import { v4 as uuidV4} from "uuid"
import swal from "sweetalert";

type Flashcard = { 
  id: string,
  title: string,
  description: string,
  answer: string,
  createdAt: Date
}

const list = document.querySelector<HTMLUListElement>("#list")
const form = document.getElementById("new-flashcard-form") as HTMLFormElement || null
const input = document.querySelector<HTMLInputElement>("#new-flashcard-title")
const inputDescription = document.querySelector<HTMLInputElement>("#new-flashcard-description")
const inputAnswer = document.querySelector<HTMLInputElement>("#new-flashcard-answer")
const flashcards: Flashcard[] = loadFlashcards()
flashcards.forEach(addListItem)

form?.addEventListener("submit", e => { 
  e.preventDefault()
  
  if (input?.value == "") {
    swal("Cannot add empty flashcard!", "Please add a title to your flashcard!", "error")
  } else if (inputDescription?.value ==  "") {
    swal("Cannot add empty flashcard!", "Please add a description to your flashcard!", "error")
  } else if (inputAnswer?.value ==  "") {
    swal("Cannot add empty flashcard!", "Please add an answer to your flashcard!", "error") } else {
    const newFlashcard: Flashcard = {
      id: uuidV4(),
      title: input?.value || "",
      description: inputDescription?.value || "",
      answer: inputAnswer?.value || "",
      createdAt: new Date()
    }

    flashcards.push(newFlashcard)
  
    addListItem(newFlashcard)
    if (input && inputDescription && inputAnswer) {
      input.value = ""
      input.placeholder = "Flashcard Title"
      inputDescription.value = ""
      inputDescription.placeholder = "Flashcard Description"
      inputAnswer.value = ""
      inputAnswer.placeholder = "Flashcard Answer"
    }
  
    saveFlashcards()
    swal("Flashcard added!", "Your flashcard has been added!", "success")
  }

})

function addListItem(flashcard: Flashcard) {
  const item = document.createElement("li")
  const div = document.createElement("div")
  const buttonDiv = document.createElement("div")
  const label = document.createElement("label")
  const labelDescription = document.createElement("label")
  const checkbox = document.createElement("input")
  const deleteButton = document.createElement("button")
  const editButton = document.createElement("button")
  const showAnswerButton = document.createElement("button")
  editButton.className = "btn btn-success"
  deleteButton.className = "btn btn-danger"
  showAnswerButton.className = "btn btn-primary"
  checkbox.addEventListener("change", e => {
    saveFlashcards()
   })
   deleteButton.addEventListener("click", e => {
    const index = flashcards.findIndex(f => f.id == flashcard.id)
    flashcards.splice(index, 1)
    item?.remove()
    div.remove()
    buttonDiv.remove()
    saveFlashcards()
    swal("Flashcard deleted!", "Your flashcard has been deleted!", "success")
    })
   editButton.addEventListener("click", e => {
      editButton.disabled = true;

      const newTitle = document.createElement("input")
      const newDescription = document.createElement("input")
      const newAnswer = document.createElement("input")
      const saveButton = document.createElement("button")
      item?.append(newTitle, newDescription, newAnswer, saveButton)
      item.style.display = "flex"
      item.style.flexDirection = "column"
      newTitle.value = flashcard.title
      newDescription.value = flashcard.description
      newAnswer.value = flashcard.answer
      saveButton.append("Save")
      saveButton.className = "btn btn-primary m-2"
      
      saveButton.addEventListener("click", (e: MouseEvent) => {
        if (newTitle.value == "" || newTitle.value == null) {
          newTitle.placeholder = "Cannot be empty!"
        } else {
        flashcard.title = newTitle.value
        flashcard.description = newDescription.value
        label.textContent = ''
        label.append(flashcard.title)
        labelDescription.textContent = flashcard.description
        newTitle.remove()
        newDescription.remove()
        newAnswer.remove()
        saveButton.remove()
        saveFlashcards()
        editButton.disabled = false;
        swal("Flashcard updated!", "Your Flashcard has been updated!", "success")
      }
      })

      saveFlashcards()
    })

    showAnswerButton.addEventListener("click", e => {
      swal("Flashcard Answer", flashcard.answer, "info")
    })

    checkbox.type = "checkbox"
    label.append(flashcard.title)
    labelDescription.textContent = flashcard.description
    item.append(label)
    div.append(labelDescription)
    buttonDiv.append(editButton, deleteButton, showAnswerButton)
    editButton.append("Edit")
    deleteButton.append("Delete")
    showAnswerButton.append("Show Answer")
    list?.append(item, div, buttonDiv)
}


function saveFlashcards() {
  localStorage.setItem("FLASHCARDS", JSON.stringify(flashcards))
}

function loadFlashcards(): Flashcard[] {
  const flashcardJSON = localStorage.getItem("FLASHCARDS")
  if (flashcardJSON == null) return []
  return JSON.parse(flashcardJSON)
} 