const KEY = "home-manager-v1";

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

function getData() {
  try {
    return (
      JSON.parse(localStorage.getItem(KEY)) ||
      structuredClone(defaultData)
    );
  } catch {
    return structuredClone(defaultData);
  }
}

function saveData(data) {
  localStorage.setItem(
    KEY,
    JSON.stringify(data)
  );
}

function uid() {
  return (
    `${Date.now()}-` +
    Math.random()
      .toString(36)
      .slice(2)
  );
}

function safe(value) {
  return String(value ?? "").replace(
    /[&<>'"]/g,
    c => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "'": "&#39;",
      '"': "&quot;"
    }[c])
  );
}

function fmtDate(value) {

  if (!value) {
    return "No date";
  }

  const date = new Date(
    value + (/T/.test(value) ? "" : "T12:00:00")
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

function setHeader() {

  const element =
    document.getElementById(
      "houseNameHeader"
    );

  if (!element) return;

  element.textContent =
    getData().household.name;
}

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
        ${iconChar}
      </div>

      <h2>
        ${title}
      </h2>

      <p>
        ${copy}
      </p>

      ${
        buttonText
          ? `
            <div style="margin-top:18px">

              <button
                class="button primary"
                onclick="${handler || "openAdd()"}"
              >
                ${buttonText}
              </button>

            </div>
          `
          : ""
      }

    </div>
  `;
}

function openAdd() {

  document.getElementById(
    "modalRoot"
  ).innerHTML = `

    <div
      class="modal-backdrop"
      onclick="if(event.target===this)closeModal()"
    >

      <div class="modal">

        <div class="modal-header">

          <div class="modal-title">
            Add to your household
          </div>

          <button
            class="close"
            onclick="closeModal()"
          >
            ×
          </button>

        </div>

        <div class="quick-grid">

          <button
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

          <button
            class="quick"
            onclick="openForm('shopping')"
          >

            <div class="quick-icon">
              🛒
            </div>

            <div class="quick-title">
              Shopping item
            </div>

            <div class="quick-sub">
              Something the home needs
            </div>

          </button>

          <button
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

          <button
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
}

function closeModal() {

  document.getElementById(
    "modalRoot"
  ).innerHTML = "";
}

function openForm(type) {

  const titles = {
    task: "New task",
    shopping: "Add shopping item",
    event: "New event",
    expense: "Add expense"
  };

  const body = {

    task: `
      <div class="field">

        <label class="label">
          What needs doing?
        </label>

        <input
          id="fTitle"
          class="input"
          placeholder="e.g. Clean the kitchen"
        >

      </div>

      <div class="field">

        <label class="label">
          Assign to
        </label>

        <select
          id="fAssignee"
          class="input select"
        >

          ${getData().members
            .map(
              m => `
                <option>
                  ${safe(m.name)}
                </option>
              `
            )
            .join("")}

        </select>

      </div>

      <div class="field">

        <label class="label">
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

        <label class="label">
          What does the household need?
        </label>

        <input
          id="fTitle"
          class="input"
          placeholder="e.g. Milk"
        >

      </div>

      <div class="field">

        <label class="label">
          Quantity
        </label>

        <input
          id="fQty"
          class="input"
          placeholder="e.g. 2"
        >

      </div>

      <div class="field">

        <label class="label">
          Category
        </label>

        <select
          id="fCategory"
          class="input select"
        >

          <option>Groceries</option>
          <option>Household</option>
          <option>Pet</option>
          <option>Other</option>

        </select>

      </div>
    `,

    event: `
      <div class="field">

        <label class="label">
          Event name
        </label>

        <input
          id="fTitle"
          class="input"
          placeholder="e.g. Dinner at Grandma's"
        >

      </div>

      <div class="field">

        <label class="label">
          Date
        </label>

        <input
          id="fDate"
          class="input"
          type="date"
        >

      </div>

      <div class="field">

        <label class="label">
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

        <label class="label">
          What is it?
        </label>

        <input
          id="fTitle"
          class="input"
          placeholder="e.g. Electricity"
        >

      </div>

      <div class="field">

        <label class="label">
          Amount
        </label>

        <input
          id="fAmount"
          class="input"
          type="number"
          step="0.01"
          placeholder="0.00"
        >

      </div>

      <div class="field">

        <label class="label">
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

  document.getElementById(
    "modalRoot"
  ).innerHTML = `

    <div
      class="modal-backdrop"
      onclick="if(event.target===this)closeModal()"
    >

      <div class="modal">

        <div class="modal-header">

          <div class="modal-title">
            ${titles[type]}
          </div>

          <button
            class="close"
            onclick="closeModal()"
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
            class="button outline"
            style="flex:1"
            onclick="closeModal()"
          >
            Cancel
          </button>

          <button
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
}

function submitForm(type) {

  const d = getData();

  const title =
    document.getElementById(
      "fTitle"
    )?.value.trim();

  if (!title) {

    alert(
      "Please add a name first."
    );

    return;
  }

  if (type === "task") {

    d.tasks.unshift({
      id: uid(),
      title,
      assignee:
        document.getElementById(
          "fAssignee"
        )?.value || "You",
      date:
        document.getElementById(
          "fDate"
        )?.value || "",
      done: false
    });

  }

  if (type === "shopping") {

    d.shopping.unshift({
      id: uid(),
      title,
      qty:
        document.getElementById(
          "fQty"
        )?.value || "1",
      category:
        document.getElementById(
          "fCategory"
        )?.value || "Other",
      bought: false
    });

  }

  if (type === "event") {

    d.events.unshift({
      id: uid(),
      title,
      date:
        document.getElementById(
          "fDate"
        )?.value || "",
      time:
        document.getElementById(
          "fTime"
        )?.value || ""
    });

  }

  if (type === "expense") {

    d.expenses.unshift({
      id: uid(),
      title,
      amount:
        document.getElementById(
          "fAmount"
        )?.value || "0",
      date:
        document.getElementById(
          "fDate"
        )?.value || ""
    });

  }

  saveData(d);

  closeModal();

  location.reload();
}

function toggleTask(id) {

  const d = getData();

  const x = d.tasks.find(
    v => v.id === id
  );

  if (x) {
    x.done = !x.done;
  }

  saveData(d);

  location.reload();
}

function deleteTask(id) {

  const d = getData();

  d.tasks =
    d.tasks.filter(
      v => v.id !== id
    );

  saveData(d);

  location.reload();
}

function toggleShop(id) {

  const d = getData();

  const x = d.shopping.find(
    v => v.id === id
  );

  if (x) {
    x.bought = !x.bought;
  }

  saveData(d);

  location.reload();
}

function deleteShop(id) {

  const d = getData();

  d.shopping =
    d.shopping.filter(
      v => v.id !== id
    );

  saveData(d);

  location.reload();
}

function deleteEvent(id) {

  const d = getData();

  d.events =
    d.events.filter(
      v => v.id !== id
    );

  saveData(d);

  location.reload();
}

function deleteExpense(id) {

  const d = getData();

  d.expenses =
    d.expenses.filter(
      v => v.id !== id
    );

  saveData(d);

  location.reload();
}

function deleteHomeInfo(id) {

  const d = getData();

  d.homeInfo =
    d.homeInfo.filter(
      v => v.id !== id
    );

  saveData(d);

  location.reload();
}

function copyInvite() {

  const code =
    getData().household.inviteCode;

  navigator.clipboard
    ?.writeText(code);

  alert(
    "Invite code copied: " + code
  );
}

function addMember() {

  const name =
    prompt(
      "Household member name"
    );

  if (!name?.trim()) {
    return;
  }

  const d = getData();

  const n = name.trim();

  d.members.push({
    id: uid(),
    name: n,
    role: "Member",
    initials: n
      .split(/\s+/)
      .map(x => x[0])
      .slice(0, 2)
      .join("")
      .toUpperCase()
  });

  saveData(d);

  location.reload();
}

function renameHousehold() {

  const d = getData();

  const name =
    prompt(
      "Household name",
      d.household.name
    );

  if (!name?.trim()) {
    return;
  }

  d.household.name =
    name.trim();

  saveData(d);

  location.reload();
}

function resetApp() {

  if (
    confirm(
      "Clear all locally saved household data?"
    )
  ) {

    localStorage.removeItem(KEY);

    location.href =
      "index.html";
  }
}

setHeader();
