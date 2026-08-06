const COLORS = [
    "#FF6B6B", "#FFD93D", "#6BCB77", "#4D96FF",
    "#C77DFF", "#FF922B", "#20C997", "#F06595",
    "#74C0FC", "#A9E34B", "#845EF7", "#FF8787"
];

// ===== DOM ELEMENT CACHE =====
const dom = {
    wheelModeBtn: document.getElementById("wheelModeBtn"),
    groupModeBtn: document.getElementById("groupModeBtn"),
    wheelManagement: document.getElementById("wheelManagement"),
    groupManagement: document.getElementById("groupManagement"),
    wheelNameCount: document.getElementById("wheelNameCount"),
    groupNameCount: document.getElementById("groupNameCount"),
    groupListCount: document.getElementById("groupListCount"),
    wheelsContainer: document.getElementById("wheelsContainer"),
    groupWheelCard: document.getElementById("groupWheelCard"),
    nameCanvas: document.getElementById("nameCanvas"),
    groupCanvas: document.getElementById("groupCanvas"),
    nameSpinBtn: document.getElementById("nameSpinBtn"),
    nameStopBtn: document.getElementById("nameStopBtn"),
    groupSpinBtn: document.getElementById("groupSpinBtn"),
    groupStopBtn: document.getElementById("groupStopBtn"),
    resultCard: document.getElementById("resultCard"),
    resultMain: document.getElementById("resultMain"),
    resultMessage: document.getElementById("resultMessage"),
    historyList: document.getElementById("historyList"),
    footerYear: document.getElementById("footerYear"),
    // Modals
    wheelNameModal: document.getElementById("wheelNameModal"),
    wheelEditModal: document.getElementById("wheelEditModal"),
    groupNameModal: document.getElementById("groupNameModal"),
    groupEditModal: document.getElementById("groupEditModal"),
    groupListModal: document.getElementById("groupListModal"),
    groupListEditModal: document.getElementById("groupListEditModal"),
    congratsModal: document.getElementById("congratsModal"),
    // Modal Inputs
    wheelNameInput: document.getElementById("wheelNameInput"),
    wheelEditInput: document.getElementById("wheelEditInput"),
    groupNameInput: document.getElementById("groupNameInput"),
    groupEditInput: document.getElementById("groupEditInput"),
    groupListInput: document.getElementById("groupListInput"),
    groupListEditInput: document.getElementById("groupListEditInput"),
    // Modal Buttons
    saveWheelNamesBtn: document.getElementById("saveWheelNamesBtn"),
    saveWheelEditBtn: document.getElementById("saveWheelEditBtn"),
    saveGroupNamesBtn: document.getElementById("saveGroupNamesBtn"),
    saveGroupEditBtn: document.getElementById("saveGroupEditBtn"),
    saveGroupListsBtn: document.getElementById("saveGroupListsBtn"),
    saveGroupListEditBtn: document.getElementById("saveGroupListEditBtn"),
    closeCongratsBtn: document.getElementById("closeCongratsBtn"),
    // Management Buttons
    addWheelNamesBtn: document.getElementById("addWheelNamesBtn"),
    editWheelNamesBtn: document.getElementById("editWheelNamesBtn"),
    clearWheelNamesBtn: document.getElementById("clearWheelNamesBtn"),
    howToUseWheelBtn: document.getElementById("howToUseWheelBtn"),
    addPeopleBtn: document.getElementById("addPeopleBtn"),
    editPeopleBtn: document.getElementById("editPeopleBtn"),
    clearPeopleBtn: document.getElementById("clearPeopleBtn"),
    addGroupsBtn: document.getElementById("addGroupsBtn"),
    editGroupsBtn: document.getElementById("editGroupsBtn"),
    clearGroupsBtn: document.getElementById("clearGroupsBtn"),
    // History Buttons
    exportCsvBtn: document.getElementById("exportCsvBtn"),
    clearHistoryBtn: document.getElementById("clearHistoryBtn"),
    // Other
    congratsResult: document.getElementById("congratsResult"),
    toast: document.getElementById("toast"),
    spinSound: document.getElementById("spinSound"),
};

// ===== DATA STORES =====
let wheelNames = JSON.parse(localStorage.getItem("wheelNames") || "[]");
let groupPeople = JSON.parse(localStorage.getItem("groupPeople") || "[]");
let groupLists = JSON.parse(localStorage.getItem("groupLists") || "[]");
let groupResults = JSON.parse(localStorage.getItem("groupResults") || "[]");

let currentMode = "wheel";

// Wheel state
let selectedWheelName = null;
let selectedWheelIndex = null;
let nameRotation = 0;
let nameSpinning = false;

// Group state
let selectedPerson = null;
let selectedPersonIndex = null;
let selectedGroupIndex = null;
let groupRotation = 0;
let groupSpinning = false;

// Track if person has been selected but not yet grouped
let personSelectedWaitingForGroup = false;

document.addEventListener("DOMContentLoaded", () => {
    if (dom.footerYear) {
        dom.footerYear.textContent = new Date().getFullYear();
    }
    setMode("wheel");
    renderAll();
    addEventListeners();
});

function addEventListeners() {
    // Mode buttons
    dom.wheelModeBtn.addEventListener("click", () => setMode('wheel'));
    dom.groupModeBtn.addEventListener("click", () => setMode('group'));

    // Spin controls
    dom.nameSpinBtn.addEventListener("click", handleNameSpin);
    dom.nameStopBtn.addEventListener("click", stopNameSpin);
    dom.groupSpinBtn.addEventListener("click", startGroupSpin);
    dom.groupStopBtn.addEventListener("click", stopGroupSpin);

    // Wheel mode management
    dom.addWheelNamesBtn.addEventListener("click", openWheelNameModal);
    dom.editWheelNamesBtn.addEventListener("click", openWheelEditModal);
    dom.clearWheelNamesBtn.addEventListener("click", clearWheelNames);
    dom.howToUseWheelBtn.addEventListener("click", () => showToast('🎡 Spin the wheel to select a random name!'));

    // Group mode management
    dom.addPeopleBtn.addEventListener("click", openGroupNameModal);
    dom.editPeopleBtn.addEventListener("click", openGroupEditModal);
    dom.clearPeopleBtn.addEventListener("click", clearGroupNames);
    dom.addGroupsBtn.addEventListener("click", openGroupListModal);
    dom.editGroupsBtn.addEventListener("click", openGroupListEditModal); // Bug fix
    dom.clearGroupsBtn.addEventListener("click", clearGroupLists);

    // History management
    dom.exportCsvBtn.addEventListener("click", exportResults);
    dom.clearHistoryBtn.addEventListener("click", clearHistory);

    // Modal buttons
    dom.saveWheelNamesBtn.addEventListener("click", saveWheelNames);
    dom.saveWheelEditBtn.addEventListener("click", saveWheelEdit);
    dom.saveGroupNamesBtn.addEventListener("click", saveGroupNames);
    dom.saveGroupEditBtn.addEventListener("click", saveGroupEdit);
    dom.saveGroupListsBtn.addEventListener("click", saveGroupLists);
    dom.saveGroupListEditBtn.addEventListener("click", saveGroupListEdit);
    dom.closeCongratsBtn.addEventListener("click", closeCongrats);

    // Generic close buttons
    document.querySelectorAll(".btn-close").forEach(btn => btn.addEventListener("click", closeModals));

    // Close modal on outside click
    document.querySelectorAll(".modal").forEach(modal => {
        modal.addEventListener("click", event => {
            if (event.target === modal) {
                modal.classList.remove("show");
            }
        });
    });

    // Close modal with Escape key
    document.addEventListener("keydown", event => {
        if (event.key === "Escape") {
            closeModals();
            closeCongrats();
        }
    });
}

function setMode(mode) {
    if (nameSpinning || groupSpinning) {
        showToast("🛑 Please stop the wheel first.");
        return;
    }

    currentMode = mode;

    if (mode === "wheel") {
        dom.wheelModeBtn.classList.add("active");
        dom.groupModeBtn.classList.remove("active");

        dom.wheelManagement.style.display = "grid";
        dom.groupManagement.style.display = "none";
        dom.groupWheelCard.classList.add("hidden");
        dom.wheelsContainer.classList.remove("two-columns");

        selectedPerson = null;
        selectedPersonIndex = null;
        selectedGroupIndex = null;
        personSelectedWaitingForGroup = false;

        dom.groupSpinBtn.disabled = true;

        // Reset name wheel button
        dom.nameSpinBtn.textContent = "🎡 SPIN!";
        dom.nameSpinBtn.disabled = wheelNames.length === 0;
        dom.nameStopBtn.classList.remove("show");

        updateResult(
            wheelNames.length ? "Ready to Spin!" : "No Names",
            wheelNames.length
                ? "🎡 Click SPIN then STOP to select a name!"
                : "😊 Add some names to the wheel!"
        );
    } else { // group mode
        dom.groupModeBtn.classList.add("active");
        dom.wheelModeBtn.classList.remove("active");

        dom.wheelManagement.style.display = "none";
        dom.groupManagement.style.display = "grid";
        dom.groupWheelCard.classList.remove("hidden");
        dom.wheelsContainer.classList.add("two-columns");

        selectedWheelName = null;
        selectedWheelIndex = null;

        // Reset name wheel button for group mode
        dom.nameSpinBtn.textContent = "👤 SPIN!";
        dom.nameSpinBtn.disabled = groupPeople.length === 0 || personSelectedWaitingForGroup;
        dom.nameStopBtn.classList.remove("show");
        dom.groupSpinBtn.disabled = true;
        dom.groupStopBtn.classList.remove("show");

        if (!groupPeople.length) {
            updateResult("No People", "👧👦 Add people to group first!");
        } else if (!groupLists.length) {
            updateResult("No Groups", "👥 Add group names first!");
        } else if (personSelectedWaitingForGroup) {
            updateResult("👤 " + selectedPerson, "🎉 Person selected! Now click SPIN on Group Wheel!");
        } else {
            updateResult("Ready to Group!", "👤 Click SPIN then STOP to select a person!");
        }
    }

    renderAll();
}

function playSpinSound() {
    if (!dom.spinSound) return;
    dom.spinSound.pause();
    dom.spinSound.currentTime = 0;
    dom.spinSound.loop = true;
    dom.spinSound.play().catch(() => { });
}

function stopSpinSound() {
    if (!dom.spinSound) return;
    dom.spinSound.pause();
    dom.spinSound.currentTime = 0;
    dom.spinSound.loop = false;
}

// ===== MODAL FUNCTIONS =====
function openWheelNameModal() {
    dom.wheelNameModal.classList.add("show");
    dom.wheelNameInput.value = "";
    dom.wheelNameInput.focus();
}

function openWheelEditModal() {
    dom.wheelEditModal.classList.add("show");
    dom.wheelEditInput.value = wheelNames.join('\n');
    dom.wheelEditInput.focus();
}

function openGroupNameModal() {
    dom.groupNameModal.classList.add("show");
    dom.groupNameInput.value = "";
    dom.groupNameInput.focus();
}

function openGroupEditModal() {
    dom.groupEditModal.classList.add("show");
    dom.groupEditInput.value = groupPeople.join('\n');
    dom.groupEditInput.focus();
}

function openGroupListModal() {
    dom.groupListModal.classList.add("show");
    dom.groupListInput.value = "";
    dom.groupListInput.focus();
}

function openGroupListEditModal() {
    dom.groupListEditModal.classList.add("show");
    dom.groupListEditInput.value = groupLists.join('\n');
    dom.groupListEditInput.focus();
}

function closeModals() {
    document.querySelectorAll(".modal").forEach(modal => {
        modal.classList.remove("show");
    });
}

function closeCongrats() {
    dom.congratsModal.classList.remove("show");
}

// ===== WHEEL MODE: Save Names =====
function saveWheelNames() {
    const input = dom.wheelNameInput.value.trim();
    if (!input) {
        showToast("⚠️ Please enter at least one name.");
        return;
    }

    const newNames = input.split(/\n/).map(n => n.trim()).filter(Boolean);
    const oldLength = wheelNames.length;
    wheelNames = [...new Set([...wheelNames, ...newNames])];
    localStorage.setItem("wheelNames", JSON.stringify(wheelNames));

    dom.wheelNameInput.value = "";
    closeModals();
    renderAll();
    showToast(`🎉 Added ${wheelNames.length - oldLength} name(s) to wheel!`);
    dom.nameSpinBtn.disabled = wheelNames.length === 0;
}

function saveWheelEdit() {
    const input = dom.wheelEditInput.value.trim();
    if (!input) {
        if (confirm("Remove all names?")) {
            wheelNames = [];
            localStorage.setItem("wheelNames", JSON.stringify(wheelNames));
            closeModals();
            renderAll();
            showToast("🗑️ All names removed!");
        }
        return;
    }

    const newNames = input.split(/\n/).map(n => n.trim()).filter(Boolean);
    wheelNames = [...new Set(newNames)];
    localStorage.setItem("wheelNames", JSON.stringify(wheelNames));

    closeModals();
    renderAll();
    showToast("✅ Names updated successfully!");
    dom.nameSpinBtn.disabled = wheelNames.length === 0;
}

function clearWheelNames() {
    if (!wheelNames.length) return;
    if (confirm("Remove all names from the wheel?")) {
        wheelNames = [];
        selectedWheelName = null;
        selectedWheelIndex = null;
        localStorage.removeItem("wheelNames");
        renderAll();
        showToast("🗑️ Wheel names cleared!");
    }
}

// ===== GROUP MODE: Save People =====
function saveGroupNames() {
    const input = dom.groupNameInput.value.trim();
    if (!input) {
        showToast("⚠️ Please enter at least one person.");
        return;
    }

    const newPeople = input.split(/\n/).map(n => n.trim()).filter(Boolean);
    const oldLength = groupPeople.length;
    groupPeople = [...new Set([...groupPeople, ...newPeople])];
    localStorage.setItem("groupPeople", JSON.stringify(groupPeople));

    dom.groupNameInput.value = "";
    closeModals();
    renderAll();
    showToast(`🎉 Added ${groupPeople.length - oldLength} person(s)!`);
    if (!personSelectedWaitingForGroup) {
        dom.nameSpinBtn.disabled = groupPeople.length === 0;
    }
}

function saveGroupEdit() {
    const input = dom.groupEditInput.value.trim();
    if (!input) {
        if (confirm("Remove all people?")) {
            groupPeople = [];
            localStorage.setItem("groupPeople", JSON.stringify(groupPeople));
            closeModals();
            renderAll();
            showToast("🗑️ All people removed!");
        }
        return;
    }

    const newPeople = input.split(/\n/).map(n => n.trim()).filter(Boolean);
    groupPeople = [...new Set(newPeople)];
    localStorage.setItem("groupPeople", JSON.stringify(groupPeople));

    closeModals();
    renderAll();
    showToast("✅ People updated successfully!");
    if (!personSelectedWaitingForGroup) {
        dom.nameSpinBtn.disabled = groupPeople.length === 0;
    }
}

function clearGroupNames() {
    if (!groupPeople.length) return;
    if (confirm("Remove all people from grouping?")) {
        groupPeople = [];
        selectedPerson = null;
        selectedPersonIndex = null;
        personSelectedWaitingForGroup = false;
        localStorage.removeItem("groupPeople");
        renderAll();
        dom.nameSpinBtn.disabled = true;
        dom.groupSpinBtn.disabled = true;
        showToast("🗑️ People cleared!");
    }
}

// ===== GROUP MODE: Save Group Lists =====
function saveGroupLists() {
    const input = dom.groupListInput.value.trim();
    if (!input) {
        showToast("⚠️ Please enter at least one group.");
        return;
    }

    const newGroups = input.split(/\n/).map(g => g.trim()).filter(Boolean);
    const oldLength = groupLists.length;
    groupLists = [...new Set([...groupLists, ...newGroups])];
    localStorage.setItem("groupLists", JSON.stringify(groupLists));

    dom.groupListInput.value = "";
    closeModals();
    renderAll();
    showToast(`🎉 Added ${groupLists.length - oldLength} group(s)!`);
}

function saveGroupListEdit() {
    const input = dom.groupListEditInput.value.trim();
    if (!input) {
        if (confirm("Remove all groups?")) {
            groupLists = [];
            localStorage.setItem("groupLists", JSON.stringify(groupLists));
            closeModals();
            renderAll();
            showToast("🗑️ All groups removed!");
        }
        return;
    }

    const newGroups = input.split(/\n/).map(g => g.trim()).filter(Boolean);
    groupLists = [...new Set(newGroups)];
    localStorage.setItem("groupLists", JSON.stringify(groupLists));

    closeModals();
    renderAll();
    showToast("✅ Groups updated successfully!");
}

function clearGroupLists() {
    if (!groupLists.length) return;
    if (confirm("Remove all groups?")) {
        groupLists = [];
        selectedGroupIndex = null;
        localStorage.removeItem("groupLists");
        renderAll();
        dom.groupSpinBtn.disabled = true;
        showToast("🗑️ Groups cleared!");
    }
}

function clearHistory() {
    if (!groupResults.length) return;
    if (confirm("Clear all grouping results?")) {
        groupResults = [];
        localStorage.removeItem("groupResults");
        renderHistory();
        showToast("🗑️ Results cleared!");
    }
}

// ===== RENDER FUNCTIONS =====
function renderAll() {
    dom.wheelNameCount.textContent = wheelNames.length;
    dom.groupNameCount.textContent = groupPeople.length;
    dom.groupListCount.textContent = groupLists.length;

    const nameWheelItems = currentMode === "wheel" ? wheelNames : groupPeople;
    drawWheel(dom.nameCanvas, nameWheelItems, "wheel");
    drawWheel(dom.groupCanvas, groupLists, "group");
    renderHistory();
}

function drawWheel(canvas, items, type, rotationDeg = 0) {
    const ctx = canvas.getContext("2d");
    const size = canvas.width;
    const center = size / 2;
    const radius = size / 2 - 10;
    const rotation = rotationDeg * Math.PI / 180;

    ctx.clearRect(0, 0, size, size);

    if (!items.length) {
        ctx.beginPath();
        ctx.arc(center, center, radius, 0, Math.PI * 2);
        ctx.fillStyle = "#ede9fe";
        ctx.fill();

        ctx.fillStyle = "#7c3aed";
        ctx.font = "bold 30px Trebuchet MS";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        const label = type === "wheel" ? "Add Names 🎡" : "Add Groups 👥";
        ctx.fillText(label, center, center);
        return;
    }

    const slice = Math.PI * 2 / items.length;

    items.forEach((item, index) => {
        const start = index * slice - Math.PI / 2 + rotation;
        const end = start + slice;

        ctx.beginPath();
        ctx.moveTo(center, center);
        ctx.arc(center, center, radius, start, end);
        ctx.closePath();

        ctx.fillStyle = COLORS[index % COLORS.length];
        ctx.fill();

        ctx.lineWidth = 5;
        ctx.strokeStyle = "#ffffff";
        ctx.stroke();

        ctx.save();
        ctx.translate(center, center);
        ctx.rotate(start + slice / 2);

        ctx.textAlign = "right";
        ctx.textBaseline = "middle";

        let fontSize = 30;
        if (items.length > 25) fontSize = 15;
        else if (items.length > 15) fontSize = 20;

        ctx.font = `900 ${fontSize}px Trebuchet MS`;
        ctx.fillStyle = "#ffffff";
        ctx.shadowColor = "rgba(0,0,0,.35)";
        ctx.shadowBlur = 3;

        const text = item.length > 18 ? `${item.substring(0, 17)}…` : item;
        ctx.fillText(text, radius - 25, 0);
        ctx.restore();
    });

    ctx.beginPath();
    ctx.arc(center, center, radius, 0, Math.PI * 2);
    ctx.lineWidth = 12;
    ctx.strokeStyle = "#ffffff";
    ctx.stroke();
}

// ===== HANDLE NAME SPIN (works for both modes) =====
function handleNameSpin() {
    if (currentMode === "wheel") {
        startWheelNameSpin();
    } else {
        startPersonSpin();
    }
}

// ===== WHEEL MODE: Spin Name =====
function startWheelNameSpin() {
    if (nameSpinning) return;
    if (!wheelNames.length) {
        showToast("🎡 Please add some names to the wheel first!");
        return;
    }

    nameSpinning = true;
    dom.nameSpinBtn.textContent = "🔄 SPINNING...";
    dom.nameSpinBtn.disabled = true;
    dom.nameStopBtn.classList.add("show");
    playSpinSound();

    // Reset any CSS transform so we draw the rotation inside the canvas instead
    dom.nameCanvas.style.transform = "none";

    function spinWheel() {
        if (!nameSpinning) return;
        nameRotation += 2;
        drawWheel(dom.nameCanvas, wheelNames, "wheel", nameRotation);
        requestAnimationFrame(spinWheel);
    }

    spinWheel();
}

function stopNameSpin() {
    if (!nameSpinning) return;

    nameSpinning = false;
    stopSpinSound();

    const items = currentMode === "wheel" ? wheelNames : groupPeople;

    const segmentAngle = 360 / items.length;
    let index = Math.floor((nameRotation % 360) / segmentAngle);
    if (index >= items.length) index = items.length - 1;

    if (currentMode === "wheel") {
        selectedWheelIndex = index;
        finishWheelNameSpin();
    } else {
        selectedPersonIndex = index;
        finishPersonSpin();
    }
}

function finishWheelNameSpin() {
    dom.nameSpinBtn.textContent = "🎡 SPIN!";
    dom.nameSpinBtn.disabled = wheelNames.length === 0;
    dom.nameStopBtn.classList.remove("show");

    if (selectedWheelIndex === null || selectedWheelIndex >= wheelNames.length) {
        dom.nameSpinBtn.disabled = wheelNames.length === 0;
        return;
    }

    const selected = wheelNames[selectedWheelIndex];
    if (!selected) {
        dom.nameSpinBtn.disabled = wheelNames.length === 0;
        return;
    }

    selectedWheelName = selected;
    wheelNames.splice(selectedWheelIndex, 1);
    localStorage.setItem("wheelNames", JSON.stringify(wheelNames));

    renderAll();
    dom.nameSpinBtn.disabled = wheelNames.length === 0;

    updateResult(`🎯 ${selected}`, "🎉 Name selected! Click SPIN again!");
    showCongratulations(`🎯 ${selected}`);
    celebrate();

    selectedWheelName = null;
    selectedWheelIndex = null;
}

// ===== GROUP MODE: Spin Person =====
function startPersonSpin() {
    if (nameSpinning) return;
    if (!groupPeople.length) {
        showToast("👧👦 Please add people to group first!");
        return;
    }
    if (!groupLists.length) {
        showToast("👥 Please add groups first!");
        return;
    }
    if (personSelectedWaitingForGroup) {
        showToast("👤 Please assign the current person to a group first!");
        return;
    }

    nameSpinning = true;
    dom.nameSpinBtn.textContent = "🔄 SPINNING...";
    dom.nameSpinBtn.disabled = true;
    dom.nameStopBtn.classList.add("show");
    playSpinSound();

    // Reset any CSS transform so we draw the rotation inside the canvas instead
    dom.nameCanvas.style.transform = "none";

    function spinWheel() {
        if (!nameSpinning) return;
        nameRotation += 2;
        drawWheel(dom.nameCanvas, groupPeople, "wheel", nameRotation);
        requestAnimationFrame(spinWheel);
    }

    spinWheel();
}

function finishPersonSpin() {
    dom.nameSpinBtn.textContent = "👤 SPIN!";
    dom.nameStopBtn.classList.remove("show");

    if (selectedPersonIndex === null || selectedPersonIndex >= groupPeople.length) {
        dom.nameSpinBtn.disabled = groupPeople.length === 0;
        return;
    }

    const selected = groupPeople[selectedPersonIndex];
    if (!selected) {
        dom.nameSpinBtn.disabled = groupPeople.length === 0;
        return;
    }

    selectedPerson = selected;
    groupPeople.splice(selectedPersonIndex, 1);
    localStorage.setItem("groupPeople", JSON.stringify(groupPeople));

    personSelectedWaitingForGroup = true;
    dom.nameSpinBtn.disabled = true; // Disable until group is assigned

    renderAll();

    dom.groupSpinBtn.disabled = false;
    updateResult(`👤 ${selected}`, "🎉 Person selected! Now click SPIN on Group Wheel!");
    celebrateSmall();
}

// ===== GROUP MODE: Spin Group =====
function startGroupSpin() {
    if (groupSpinning) return;
    if (!selectedPerson) {
        showToast("👤 Select a person first!");
        return;
    }
    if (!groupLists.length) {
        showToast("👥 Please add some groups first!");
        return;
    }

    groupSpinning = true;
    dom.groupSpinBtn.textContent = "🔄 SPINNING...";
    dom.groupSpinBtn.disabled = true;
    dom.groupStopBtn.classList.add("show");
    playSpinSound();

    // Reset any CSS transform so we draw the rotation inside the canvas instead
    dom.groupCanvas.style.transform = "none";

    function spinGroupWheel() {
        if (!groupSpinning) return;
        groupRotation += 2;
        drawWheel(dom.groupCanvas, groupLists, "group", groupRotation);
        requestAnimationFrame(spinGroupWheel);
    }

    spinGroupWheel();
}

function stopGroupSpin() {
    if (!groupSpinning) return;

    groupSpinning = false;
    stopSpinSound();

    const segmentAngle = 360 / groupLists.length;
    let index = Math.floor((groupRotation % 360) / segmentAngle);
    if (index >= groupLists.length) index = groupLists.length - 1;

    selectedGroupIndex = index;

    dom.groupSpinBtn.textContent = "👥 SPIN!";
    dom.groupSpinBtn.disabled = true;
    dom.groupStopBtn.classList.remove("show");

    if (selectedGroupIndex === null || selectedGroupIndex >= groupLists.length) {
        selectedPerson = null;
        personSelectedWaitingForGroup = false;
        dom.nameSpinBtn.disabled = groupPeople.length === 0;
        return;
    }

    const group = groupLists[selectedGroupIndex];
    if (!group || !selectedPerson) {
        selectedPerson = null;
        personSelectedWaitingForGroup = false;
        dom.nameSpinBtn.disabled = groupPeople.length === 0;
        return;
    }

    const assignment = {
        name: selectedPerson,
        group: group,
        date: new Date().toLocaleString()
    };

    groupResults.push(assignment);
    localStorage.setItem("groupResults", JSON.stringify(groupResults));

    updateResult(`👥 ${group} — 👤 ${selectedPerson}`, "🎉 Person assigned to group!");
    renderHistory();
    showCongratulations(`👥 ${group} — 👤 ${selectedPerson}`);
    celebrate();

    selectedPerson = null;
    selectedPersonIndex = null;
    selectedGroupIndex = null;
    personSelectedWaitingForGroup = false;

    dom.nameSpinBtn.disabled = groupPeople.length === 0;

    setTimeout(() => {
        if (currentMode === "group") {
            updateResult(
                "Ready for Next!",
                groupPeople.length
                    ? "👤 Click SPIN on Name Wheel to select the next person!"
                    : "🎉 All people have been grouped!"
            );
        }
    }, 3500);
}

function updateResult(main, message) {
    dom.resultMain.innerHTML = main;
    dom.resultMessage.innerHTML = message;
    dom.resultCard.classList.remove("pop");
    void dom.resultCard.offsetWidth; // Trigger reflow to restart animation
    dom.resultCard.classList.add("pop");
}

function showCongratulations(result) {
    dom.congratsResult.innerHTML = result;
    dom.congratsModal.classList.add("show");
}

function renderHistory() {
    if (!groupResults.length) {
        dom.historyList.innerHTML = '<div class="empty">No group assignments yet. 🎈</div>';
        return;
    }
    dom.historyList.innerHTML = [...groupResults].reverse().map(r => `
        <div class="history-item">
            <div>👤 <strong>${escapeHtml(r.name)}</strong></div>
            <div class="history-group">👥 ${escapeHtml(r.group)}</div>
            <small>${escapeHtml(r.date)}</small>
        </div>
    `).join("");
}

function escapeHtml(value) {
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function exportResults() {
    if (!groupResults.length) {
        showToast("⚠️ No results to export!");
        return;
    }
    let csv = "Name,Group,Date\n";
    groupResults.forEach(r => {
        const name = String(r.name).replace(/"/g, '""');
        const group = String(r.group).replace(/"/g, '""');
        const date = String(r.date).replace(/"/g, '""');
        csv += `"${name}","${group}","${date}"\n`;
    });
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.download = `group_results_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast("📤 Results exported as CSV!");
}

function showToast(message) {
    dom.toast.innerHTML = message;
    dom.toast.classList.add("show");
    setTimeout(() => {
        dom.toast.classList.remove("show");
    }, 2500);
}

function celebrate() {
    const emojis = ["🎉", "🎊", "⭐", "✨", "🌈", "🎈", "🥳", "🎁"];
    for (let i = 0; i < 50; i++) {
        const piece = document.createElement("div");
        piece.className = "confetti";
        piece.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        piece.style.left = `${Math.random() * 100}vw`;
        piece.style.fontSize = `${15 + Math.random() * 25}px`;
        piece.style.animationDuration = `${1.5 + Math.random() * 2}s`;
        document.body.appendChild(piece);
        setTimeout(() => { piece.remove(); }, 4000);
    }
}

function celebrateSmall() {
    const emojis = ["⭐", "✨", "🎈", "😊"];
    for (let i = 0; i < 18; i++) {
        const piece = document.createElement("div");
        piece.className = "confetti";
        piece.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        piece.style.left = `${Math.random() * 100}vw`;
        piece.style.fontSize = "20px";
        piece.style.animationDuration = "1.8s";
        document.body.appendChild(piece);
        setTimeout(() => { piece.remove(); }, 2500);
    }
}