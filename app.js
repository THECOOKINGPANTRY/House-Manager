/* =========================================================
   HOME MANAGER
   Main application JavaScript
========================================================= */


/* =========================================================
   STORAGE
========================================================= */

const KEY = "home-manager-v1";

const PROTECTED_PAGES = [
  "",
  "index.html",
  "tasks.html",
  "shopping.html",
  "calendar.html",
  "money.html",
  "more.html",
  "home.html",
  "people.html",
  "settings.html",
  "add.html"
];

const defaultData = {
  household: {
    name: "My Household",
    inviteCode: "HOME-4821"
  },

  members: [
    {
      id: "me",
      name: "You",
      role: "Admin",
      initials: "Y"
    }
  ],

  tasks: [],
  shopping: [],
  events: [],
  expenses: [],
  homeInfo: []
};


/* =========================================================
   AUTHENTICATION
========================================================= */

function isLoggedIn() {

  return (
    localStorage.getItem(
      "home-manager-logged-in"
    ) === "true"
  );

}


function requireLogin() {

  const page =
    window.location.pathname
      .split("/")
      .pop()
      .toLowerCase();

  if (
    PROTECTED_PAGES.includes(page) &&
    !isLoggedIn()
  ) {

    window.location.replace(
      "login.html"
    );

  }

}


function logout() {

  /*
    Household data is intentionally NOT removed.
    Logging out only clears the current user's
    prototype session/profile information.
  */

  localStorage.removeItem(
    "home-manager-logged-in"
  );

  localStorage.removeItem(
    "home-manager-user-name"
  );

  localStorage.removeItem(
    "home-manager-user-email"
  );

  localStorage.removeItem(
    "home-manager-remember"
  );

  localStorage.removeItem(
    "home-manager-profile-created"
  );

  window.location.replace(
    "login.html"
  );

}


function confirmLogout() {

  const confirmed =
    window.confirm(
      "Are you sure you want to log out?"
    );

  if (!confirmed) {
    return;
  }

  logout();

}


/* =========================================================
   DATA
========================================================= */

function getData() {

  try {

    const saved =
      localStorage.getItem(
        KEY
      );

    if (!saved) {

      return structuredClone(
        defaultData
      );

    }

    const data =
      JSON.parse(saved);

    return {

      household:
        data.household ||
        structuredClone(
          defaultData.household
        ),

      members:
        Array.isArray(data.members)
          ? data.members
          : structuredClone(
              defaultData.members
            ),

      tasks:
        Array.isArray(data.tasks)
          ? data.tasks
          : [],

      shopping:
        Array.isArray(data.shopping)
          ? data.shopping
          : [],

      events:
        Array.isArray(data.events)
          ? data.events
          : [],

      expenses:
        Array.isArray(data.expenses)
          ? data.expenses
          : [],

      homeInfo:
        Array.isArray(data.homeInfo)
          ? data.homeInfo
          : []

    };

  } catch {

    return structuredClone(
      defaultData
    );

  }

}


function saveData(data) {

  localStorage.setItem(
    KEY,
    JSON.stringify(data)
  );

}


/* =========================================================
   UTILITIES
========================================================= */

function uid() {

  return (
    `${Date.now()}-` +
    Math.random()
      .toString(36)
      .slice(2)
  );

}


function now() {

  return new Date()
    .toISOString();

}


function safe(value) {

  return String(
    value ?? ""
  ).replace(
    /[&<>'"]/g,
    character => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "'": "&#39;",
      '"': "&quot;"
    }[character])
  );

}


function fmtDate(value) {

  if (!value) {
    return "No date";
  }

  const date =
    new Date(
      value +
      (
        /T/.test(value)
          ? ""
          : "T12:00:00"
      )
    );

  return date.toLocaleDateString(
    undefined,
    {
      day: "numeric",
      month: "short",
      year: "numeric"
    }
  );

}


function getInitials(name) {

  return String(name || "")
    .split(/\s+/)
    .filter(Boolean)
    .map(
      word => word[0]
    )
    .slice(0, 2)
    .join("")
    .toUpperCase();

}


/* =========================================================
   HEADER
========================================================= */

function setHeader() {

  const element =
    document.getElementById(
      "houseNameHeader"
    );

  if (!element) {
    return;
  }

  const data =
    getData();

  element.textContent =
    data.household.name;

}


/* =========================================================
   EMPTY STATES
========================================================= */

function emptyState(
  iconChar,
  title,
  copy,
  buttonText,
  handler
) {

  return `
    <div class="empty">

      <div class="empty-icon">
        ${safe(iconChar)}
      </div>

      <h2>
        ${safe(title)}
      </h2>

      <p>
        ${safe(copy)}
      </p>

      ${
        buttonText
          ? `
            <div style="margin-top:18px">

              <button
                type="button"
                class="button primary"
                onclick="${handler || "openAdd()"}"
              >
                ${safe(buttonText)}
              </button>

            </div>
          `
          : ""
      }

    </div>
  `;

}


/* =========================================================
   UNIVERSAL ADD
========================================================= */

function openAdd() {

  const root =
    document.getElementById(
      "modalRoot"
    );

  if (!root) {
    return;
  }

  root.innerHTML = `

    <div
      class="modal-backdrop"
      onclick="
        if (event.target === this)
          closeModal()
      "
    >

      <div
        class="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="addModalTitle"
      >

        <div class="modal-header">

          <div
            class="modal-title"
            id="addModalTitle"
          >
            Add to your household
          </div>

          <button
            type="button"
            class="close"
            onclick="closeModal()"
            aria-label="Close"
          >
            ×
          </button>

        </div>


        <div class="quick-grid">

          <!-- TASK -->

          <button
            type="button"
            class="quick"
            onclick="openForm('task')"
          >

            <div class="quick-icon">
              ✓
            </div>

            <div class="quick-title">
              Task
            </div>

            <div class="quick-sub">
              Something that needs doing
            </div>

          </button>


          <!-- SHOPPING -->

          <button
            type="button"
            class="quick"
            onclick="openForm('shopping')"
          >

            <div class="quick-icon">
              🛒
            </div>

            <div class="quick-title">
              Shopping
            </div>

            <div class="quick-sub">
              Something the household needs
            </div>

          </button>


          <!-- EVENT -->

          <button
            type="button"
            class="quick"
            onclick="openForm('event')"
          >

            <div class="quick-icon">
              ▦
            </div>

            <div class="quick-title">
              Event
            </div>

            <div class="quick-sub">
              An appointment or plan
            </div>

          </button>


          <!-- EXPENSE -->

          <button
            type="button"
            class="quick"
            onclick="openForm('expense')"
          >

            <div class="quick-icon">
              $
            </div>

            <div class="quick-title">
              Expense
            </div>

            <div class="quick-sub">
              A bill or shared cost
            </div>

          </button>

        </div>

      </div>

    </div>
  `;


  /*
    Allow Escape to close the Add panel.
  */

  document.addEventListener(
    "keydown",
    handleModalEscape
  );

}


function handleModalEscape(event) {

  if (
    event.key === "Escape" &&
    document.getElementById(
      "modalRoot"
    )?.innerHTML
  ) {

    closeModal();

  }

}


/* =========================================================
   MODALS
========================================================= */

function closeModal() {

  const root =
    document.getElementById(
      "modalRoot"
    );

  if (!root) {
    return;
  }

  root.innerHTML = "";

  document.removeEventListener(
    "keydown",
    handleModalEscape
  );

}


/* =========================================================
   FORMS
========================================================= */

function openForm(type) {

  const titles = {

    task:
      "New task",

    shopping:
      "Add shopping item",

    event:
      "New event",

    expense:
      "Add expense"

  };


  const body = {

    task: `

      <div class="field">

        <label
          class="label"
          for="fTitle"
        >
          What needs doing?
        </label>

        <input
          id="fTitle"
          class="input"
          type="text"
          autocomplete="off"
          placeholder="e.g. Clean the kitchen"
        >

      </div>


      <div class="field">

        <label
          class="label"
          for="fAssignee"
        >
          Assign to
        </label>

        <select
          id="fAssignee"
          class="input select"
        >

          ${
            getData()
              .members
              .map(
                member => `
                  <option value="${safe(member.name)}">
                    ${safe(member.name)}
                  </option>
                `
              )
              .join("")
          }

        </select>

      </div>


      <div class="field">

        <label
          class="label"
          for="fDate"
        >
          Due date
        </label>

        <input
          id="fDate"
          class="input"
          type="date"
        >

      </div>

    `,


    shopping: `

      <div class="field">

        <label
          class="label"
          for="fTitle"
        >
          What does the household need?
        </label>

        <input
          id="fTitle"
          class="input"
          type="text"
          autocomplete="off"
          placeholder="e.g. Milk"
        >

      </div>


      <div class="field">

        <label
          class="label"
          for="fQty"
        >
          Quantity
        </label>

        <input
          id="fQty"
          class="input"
          type="number"
          min="1"
          step="1"
          inputmode="numeric"
          placeholder="e.g. 2"
        >

      </div>


      <div class="field">

        <label
          class="label"
          for="fCategory"
        >
          Category
        </label>

        <select
          id="fCategory"
          class="input select"
        >

          <option value="Groceries">
            Groceries
          </option>

          <option value="Household">
            Household
          </option>

          <option value="Pet">
            Pet
          </option>

          <option value="Other">
            Other
          </option>

        </select>

      </div>

    `,


    event: `

      <div class="field">

        <label
          class="label"
          for="fTitle"
        >
          Event name
        </label>

        <input
          id="fTitle"
          class="input"
          type="text"
          autocomplete="off"
          placeholder="e.g. Dinner at Grandma's"
        >

      </div>


      <div class="field">

        <label
          class="label"
          for="fDate"
        >
          Date
        </label>

        <input
          id="fDate"
          class="input"
          type="date"
        >

      </div>


      <div class="field">

        <label
          class="label"
          for="fTime"
        >
          Time
        </label>

        <input
          id="fTime"
          class="input"
          type="time"
        >

      </div>

    `,


    expense: `

      <div class="field">

        <label
          class="label"
          for="fTitle"
        >
          What is it?
        </label>

        <input
          id="fTitle"
          class="input"
          type="text"
          autocomplete="off"
          placeholder="e.g. Electricity"
        >

      </div>


      <div class="field">

        <label
          class="label"
          for="fAmount"
        >
          Amount
        </label>

        <input
          id="fAmount"
          class="input"
          type="number"
          step="0.01"
          min="0"
          inputmode="decimal"
          placeholder="0.00"
        >

      </div>


      <div class="field">

        <label
          class="label"
          for="fDate"
        >
          Due date
        </label>

        <input
          id="fDate"
          class="input"
          type="date"
        >

      </div>

    `

  }[type];


  if (!body) {
    return;
  }


  const root =
    document.getElementById(
      "modalRoot"
    );

  if (!root) {
    return;
  }


  root.innerHTML = `

    <div
      class="modal-backdrop"
      onclick="
        if (event.target === this)
          closeModal()
      "
    >

      <div
        class="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="formModalTitle"
      >

        <div class="modal-header">

          <div
            class="modal-title"
            id="formModalTitle"
          >
            ${safe(titles[type])}
          </div>

          <button
            type="button"
            class="close"
            onclick="closeModal()"
            aria-label="Close"
          >
            ×
          </button>

        </div>


        ${body}


        <div
          style="
            display:flex;
            gap:8px;
            margin-top:16px;
          "
        >

          <button
            type="button"
            class="button outline"
            style="flex:1"
            onclick="closeModal()"
          >
            Cancel
          </button>


          <button
            type="button"
            class="button primary"
            style="flex:1"
            onclick="submitForm('${type}')"
          >
            Add
          </button>

        </div>

      </div>

    </div>
  `;


  /*
    Focus the main field immediately.
  */

  document
    .getElementById("fTitle")
    ?.focus();


  document.addEventListener(
    "keydown",
    handleModalEscape
  );

}


/* =========================================================
   FORM SUBMISSION
========================================================= */

function submitForm(type) {

  const data =
    getData();


  const titleElement =
    document.getElementById(
      "fTitle"
    );


  const title =
    titleElement
      ?.value
      ?.trim();


  if (!title) {

    alert(
      "Please add a name first."
    );

    titleElement?.focus();

    return;

  }


  /* -------------------------------------------------------
     TASK
  ------------------------------------------------------- */

  if (type === "task") {

    const assignee =
      document.getElementById(
        "fAssignee"
      )?.value || "You";


    const date =
      document.getElementById(
        "fDate"
      )?.value || "";


    data.tasks.unshift({

      id:
        uid(),

      title,

      assignee,

      date,

      done:
        false,

      createdAt:
        now()

    });

  }


  /* -------------------------------------------------------
     SHOPPING
  ------------------------------------------------------- */

  if (type === "shopping") {

    const quantityValue =
      document.getElementById(
        "fQty"
      )?.value
      ?.trim();


    const quantity =
      quantityValue &&
      Number(quantityValue) > 0
        ? quantityValue
        : "1";


    const category =
      document.getElementById(
        "fCategory"
      )?.value || "Other";


    data.shopping.unshift({

      id:
        uid(),

      title,

      qty:
        quantity,

      category,

      bought:
        false,

      createdAt:
        now()

    });

  }


  /* -------------------------------------------------------
     EVENT
  ------------------------------------------------------- */

  if (type === "event") {

    const date =
      document.getElementById(
        "fDate"
      )?.value || "";


    const time =
      document.getElementById(
        "fTime"
      )?.value || "";


    data.events.unshift({

      id:
        uid(),

      title,

      date,

      time,

      createdAt:
        now()

    });

  }


  /* -------------------------------------------------------
     EXPENSE
  ------------------------------------------------------- */

  if (type === "expense") {

    const amountElement =
      document.getElementById(
        "fAmount"
      );


    const amountValue =
      amountElement
        ?.value
        ?.trim();


    const amount =
      amountValue &&
      Number(amountValue) >= 0
        ? Number(amountValue).toFixed(2)
        : "0.00";


    const date =
      document.getElementById(
        "fDate"
      )?.value || "";


    data.expenses.unshift({

      id:
        uid(),

      title,

      amount,

      date,

      createdAt:
        now()

    });

  }


  saveData(
    data
  );


  closeModal();


  /*
    Reload so existing pages immediately
    reflect the new household data.
  */

  window.location.reload();

}


/* =========================================================
   TASKS
========================================================= */

function toggleTask(id) {

  const data =
    getData();


  const task =
    data.tasks.find(
      item => item.id === id
    );


  if (!task) {
    return;
  }


  task.done =
    !task.done;


  saveData(
    data
  );


  window.location.reload();

}


function deleteTask(id) {

  const confirmed =
    window.confirm(
      "Delete this task?"
    );


  if (!confirmed) {
    return;
  }


  const data =
    getData();


  data.tasks =
    data.tasks.filter(
      item => item.id !== id
    );


  saveData(
    data
  );


  window.location.reload();

}


/* =========================================================
   SHOPPING
========================================================= */

function toggleShop(id) {

  const data =
    getData();


  const item =
    data.shopping.find(
      entry => entry.id === id
    );


  if (!item) {
    return;
  }


  item.bought =
    !item.bought;


  saveData(
    data
  );


  window.location.reload();

}


function deleteShop(id) {

  const confirmed =
    window.confirm(
      "Delete this shopping item?"
    );


  if (!confirmed) {
    return;
  }


  const data =
    getData();


  data.shopping =
    data.shopping.filter(
      item => item.id !== id
    );


  saveData(
    data
  );


  window.location.reload();

}


/* =========================================================
   EVENTS
========================================================= */

function deleteEvent(id) {

  const confirmed =
    window.confirm(
      "Delete this event?"
    );


  if (!confirmed) {
    return;
  }


  const data =
    getData();


  data.events =
    data.events.filter(
      item => item.id !== id
    );


  saveData(
    data
  );


  window.location.reload();

}


/* =========================================================
   EXPENSES
========================================================= */

function deleteExpense(id) {

  const confirmed =
    window.confirm(
      "Delete this expense?"
    );


  if (!confirmed) {
    return;
  }


  const data =
    getData();


  data.expenses =
    data.expenses.filter(
      item => item.id !== id
    );


  saveData(
    data
  );


  window.location.reload();

}


/* =========================================================
   HOME INFORMATION
========================================================= */

function deleteHomeInfo(id) {

  const confirmed =
    window.confirm(
      "Delete this information?"
    );


  if (!confirmed) {
    return;
  }


  const data =
    getData();


  data.homeInfo =
    data.homeInfo.filter(
      item => item.id !== id
    );


  saveData(
    data
  );


  window.location.reload();

}


/* =========================================================
   HOUSEHOLD
========================================================= */

function renameHousehold() {

  const data =
    getData();


  const name =
    window.prompt(
      "Household name",
      data.household.name
    );


  if (!name?.trim()) {
    return;
  }


  data.household.name =
    name.trim();


  saveData(
    data
  );


  window.location.reload();

}


function copyInvite() {

  const code =
    getData()
      .household
      .inviteCode;


  if (
    navigator.clipboard &&
    window.isSecureContext
  ) {

    navigator.clipboard.writeText(
      code
    );

    alert(
      "Invite code copied: " +
      code
    );

    return;

  }


  const helper =
    document.createElement(
      "textarea"
    );


  helper.value =
    code;


  helper.style.position =
    "fixed";

  helper.style.opacity =
    "0";


  document.body.appendChild(
    helper
  );


  helper.select();


  try {

    document.execCommand(
      "copy"
    );

    alert(
      "Invite code copied: " +
      code
    );

  } catch {

    alert(
      "Your invite code is: " +
      code
    );

  }


  helper.remove();

}


function addMember() {

  const name =
    window.prompt(
      "Household member name"
    );


  if (!name?.trim()) {
    return;
  }


  const data =
    getData();


  const cleanName =
    name.trim();


  data.members.push({

    id:
      uid(),

    name:
      cleanName,

    role:
      "Member",

    initials:
      getInitials(
        cleanName
      )

  });


  saveData(
    data
  );


  window.location.reload();

}


/* =========================================================
   RESET HOUSEHOLD DATA
========================================================= */

function resetApp() {

  const confirmed =
    window.confirm(
      "Clear all locally saved household data? This cannot be undone."
    );


  if (!confirmed) {
    return;
  }


  localStorage.removeItem(
    KEY
  );


  window.location.replace(
    "index.html"
  );

}


/* =========================================================
   STARTUP
========================================================= */

requireLogin();

setHeader();
