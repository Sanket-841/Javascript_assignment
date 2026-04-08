let txns;
txns = JSON.parse(localStorage.getItem("txns") || "[]");
let editIndex = null;

// dom-maipulation-event-handling-codes
const idInput = document.getElementById("tid");
const dateInput = document.getElementById("tdate");
const headerInput = document.getElementById("theader");
const creditInput = document.getElementById("tcredit");
const debitInput = document.getElementById("tdebit");
const addBtn = document.getElementById("addBtn");
const tableBody = document.getElementById("txnBody");

const balanceEl = document.getElementById("balance");

function saveToStorage() {
    localStorage.setItem("txns", JSON.stringify(txns));
}

function showError(msg) {
    const box = document.getElementById("errorBox");
    box.textContent = msg;
}

function clearError() {
    const box = document.getElementById("errorBox");
    box.textContent = "";
}

function validateInputsRow(credit, debit) {
    if (credit && debit) {
        showError("Provide only CREDIT or DEBIT, not both.");
        return false;
    }
    if (!credit && !debit) {
        showError("Provide at least one value in CREDIT or DEBIT.");
        return false;
    }
    clearError();
    return true;
}

function addTxn() {
    const credit = creditInput.value.trim();
    const d = debitInput.value.trim();
    if (!validateInputsRow(credit, d))
        return;
    const txn = {
        id: Number(idInput.value),
        header: headerInput.value,
        txnType: credit ? "CREDIT" : "DEBIT",
        amount: credit || d,
        txnDate: dateInput.value
    };
    txns.push(txn);
    saveToStorage();
    render();
    clearMainInputs();
}

function clearMainInputs() {
    idInput.value = "";
    dateInput.value = "";
    headerInput.value = "";
    creditInput.value = "";
    debitInput.value = "";
}

var Action = {};

// Render table with possible inline edit row
function render() {
    tableBody.innerHTML = "";
    let totalC = 0, totalD = 0;
    txns.forEach((t, i) => {
        const baseRow = `
            <tr>
                <td>${t.id}</td>
                <td>${t.txnDate}</td>
                <td>${t.header}</td>
                <td>${t.txnType === "CREDIT" ? t.amount : ""}</td>
                <td>${t.txnType === "DEBIT" ? t.amount : ""}</td>
                <td class="d-flex gap-2 justify-content-center">
                    <button class="btn btn-danger btn-sm"
                            onclick="Action.removeTxn(${i})">
                        REMOVE
                    </button>
                </td>
            </tr>
        `;
        tableBody.insertAdjacentHTML("beforeend", baseRow);
    
        if (t.txnType === "CREDIT") totalC += Number(t.amount);
        else totalD += Number(t.amount);
    });
    balanceEl.textContent = (totalC - totalD).toLocaleString();
}

Action.removeTxn = (i) => {
    txns.splice(i, 1);
    saveToStorage();
    render();
};

addBtn.onclick = addTxn;
render();