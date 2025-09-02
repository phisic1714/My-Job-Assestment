const gsheetAPI =
  "https://script.google.com/macros/s/AKfycbwU5RXLmLWjCA7nBjSHbNGrObhP6v6ak-afnrPj6QnX_xUuubvk73I4iuxU2nj27tGZJA/exec";

const dropdown = document.getElementById("module");
const list = document.getElementById("list");
const addBtn = document.getElementById("add");
const form = document.getElementById("dynamicForm");
const tmpl = document.getElementById("row-template");
const preview = document.getElementById("preview");

let modulesData = [];
fetch("./utils.json")
  .then((response) => response.json())
  .then((data) => {
    modulesData = data.Modules;
    fillSelectOptions(document.querySelector(".module-select"));
  });

function fillSelectOptions(selectEl) {
  selectEl.innerHTML = ""; // ล้างก่อนกันซ้ำ
  modulesData.forEach((v) => {
    const option = document.createElement("option");
    option.value = v.value;
    option.textContent = v.label;
    selectEl.appendChild(option);
  });
}

// เพิ่มแถวใหม่
addBtn.addEventListener("click", () => {
  const node = tmpl.content.firstElementChild.cloneNode(true);
  updateRowIndex(node, list.children.length);
  fillSelectOptions(node.querySelector(".module-select"));
  list.appendChild(node);
});

function updateRowIndex(row, index) {
  row.querySelectorAll("[name]").forEach((el) => {
    el.name = el.name.replace(/\[\d+]/, `[${index}]`);
  });
}

// ลบแถว (ใช้ event delegation)
list.addEventListener("click", (e) => {
  if (e.target.classList.contains("remove")) {
    const row = e.target.closest(".row");
    if (list.children.length > 1) row.remove();
    Array.from(list.children).forEach((row, i) => updateRowIndex(row, i));
  }
});

// ส่งฟอร์ม (เดโม: ป้องกันส่งจริง แล้วแปลงค่าเป็น array มาแสดงผล)
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const fd = new FormData(form);
  const entries = {};

  fd.forEach((value, key) => {
    const match = key.match(/^items\[(\d+)]\[(.+)]$/); // ดึง index และ field name
    if (match) {
      const [_, index, field] = match;
      if (!entries[index]) entries[index] = {};
      entries[index][field] = value;
    }
  });

  const itemsArray = Object.values(entries);
  console.log("itemsArray:", itemsArray);
  fetch("http://localhost:3000/api", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(itemsArray)
  })
    .then(res => res.text())
    .then(data => console.log("Response:", data))
    .catch(err => console.error("Error:", err));


});
