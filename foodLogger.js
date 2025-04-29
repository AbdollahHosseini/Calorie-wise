// --- Constants ---
const MEAL_TYPES = ['Breakfast', 'Lunch', 'Dinner', 'Snacks'];

// --- Nutrition Data (Approx. per 100g, uncooked where applicable) ---
const foodData = {
    "Apple": { kcal: 52, p: 0.3, c: 14, f: 0.2 }, "Banana": { kcal: 89, p: 1.1, c: 23, f: 0.3 }, "Orange": { kcal: 47, p: 0.9, c: 12, f: 0.1 }, "Grapes": { kcal: 69, p: 0.7, c: 18, f: 0.2 }, "Strawberries": { kcal: 32, p: 0.7, c: 8, f: 0.3 }, "Bread (White Slice)": { kcal: 265, p: 9, c: 49, f: 3.2 }, "Bread (Whole Wheat Slice)": { kcal: 250, p: 13, c: 41, f: 3.4 }, "Rice (White, uncooked)": { kcal: 360, p: 7, c: 80, f: 0.7 }, "Rice (Brown, uncooked)": { kcal: 370, p: 7.5, c: 76, f: 2.7 }, "Pasta (Dry)": { kcal: 370, p: 13, c: 75, f: 1.5 }, "Chicken Breast (Raw)": { kcal: 165, p: 31, c: 0, f: 3.6 }, "Salmon Fillet (Raw)": { kcal: 208, p: 20, c: 0, f: 13 }, "Beef Mince (Lean, Raw)": { kcal: 175, p: 20, c: 0, f: 10 }, "Tofu (Firm)": { kcal: 76, p: 8, c: 3, f: 5 }, "Egg (Large)": { kcal: 145, p: 12.5, c: 1.1, f: 9.5 }, "Milk (Whole)": { kcal: 60, p: 3.3, c: 4.8, f: 3.3 }, "Almond Milk (Unsweetened)": { kcal: 13, p: 0.5, c: 0.6, f: 1.1 }, "Yogurt (Plain)": { kcal: 59, p: 10, c: 3.6, f: 0.4 }, "Cheese (Cheddar)": { kcal: 404, p: 25, c: 1.3, f: 33 }, "Mixed Salad Leaves": { kcal: 15, p: 1, c: 3, f: 0.2 }, "Spinach (Raw)": { kcal: 23, p: 2.9, c: 3.6, f: 0.4 }, "Broccoli (Raw)": { kcal: 34, p: 2.8, c: 6, f: 0.4 }, "Carrot (Raw)": { kcal: 41, p: 0.9, c: 10, f: 0.2 }, "Potato (Raw)": { kcal: 77, p: 2, c: 17, f: 0.1 }, "Sweet Potato (Raw)": { kcal: 86, p: 1.6, c: 20, f: 0.1 }, "Almonds": { kcal: 579, p: 21, c: 22, f: 49 }, "Peanut Butter": { kcal: 588, p: 25, c: 20, f: 50 }
};

// --- Unit Conversion Factors to Grams ---
const unitConversionFactors = { g: 1, kg: 1000, oz: 28.3495, lb: 453.592 };

// --- DOM References ---
let foodSearchInput, foodButtonsContainer, allFoodButtons, modalOverlay, modalFoodName,
    foodAmountInput, modalActionBtn, modalCancelBtn, unitSelect, nutritionDisplayModal,
    dailyLogContainer, foodListContainer,
    logListBreakfast, logListLunch, logListDinner, logListSnacks,
    emptyBreakfast, emptyLunch, emptyDinner, emptySnacks,
    totalCaloriesValue, totalProteinValue, totalCarbsValue, totalFatValue,
    totalNutritionContainer, backToLogBtn,
    mealSummarySpans = {};
    // Chart references removed

// Function to initialize DOM references
function initializeDOMReferences() {
    // Views
    dailyLogContainer = document.getElementById('daily-log-container');
    foodListContainer = document.getElementById('food-list-container');
    // Food List View Elements
    foodSearchInput = document.getElementById('food-search-input');
    foodButtonsContainer = document.getElementById('food-buttons');
    backToLogBtn = document.getElementById('back-to-log-btn');
    // Daily Log View Elements
    logListBreakfast = document.getElementById('log-list-breakfast');
    logListLunch = document.getElementById('log-list-lunch');
    logListDinner = document.getElementById('log-list-dinner');
    logListSnacks = document.getElementById('log-list-snacks');
    emptyBreakfast = document.getElementById('empty-breakfast');
    emptyLunch = document.getElementById('empty-lunch');
    emptyDinner = document.getElementById('empty-dinner');
    emptySnacks = document.getElementById('empty-snacks');
    totalNutritionContainer = document.getElementById('total-nutrition-container');
    totalCaloriesValue = document.getElementById('total-calories-value');
    totalProteinValue = document.getElementById('total-protein-value');
    totalCarbsValue = document.getElementById('total-carbs-value');
    totalFatValue = document.getElementById('total-fat-value');
    // Modal Elements
    modalOverlay = document.getElementById('food-modal-overlay');
    modalFoodName = document.getElementById('modal-food-name');
    foodAmountInput = document.getElementById('food-amount');
    modalActionBtn = document.getElementById('modal-action-btn');
    modalCancelBtn = document.getElementById('modal-cancel-btn');
    unitSelect = document.getElementById('food-unit-select');
    nutritionDisplayModal = document.getElementById('modal-nutrition-display');
    // Chart elements references removed

    // Get meal summary Kcal span references
    MEAL_TYPES.forEach(meal => {
        const mealLower = meal.toLowerCase();
        mealSummarySpans[meal] = {
            kcal: document.getElementById(`${mealLower}-kcal`)
        };
    });

    if (foodButtonsContainer) {
         allFoodButtons = foodButtonsContainer.querySelectorAll('.food-button');
    } else {
        console.error("Food buttons container not found!");
        allFoodButtons = [];
    }
}

// --- State Variables ---
let currentFoodName = '';
let currentMealCategoryToAdd = '';
let editingLogIndex = null;
let dailyLog = [];
let currentCalculatedNutrition = { kcal: 0, p: 0, c: 0, f: 0 };
// macroChartInstance removed

// --- View Switching Functions ---
function showLogView() {
    if (dailyLogContainer) dailyLogContainer.classList.remove('hidden');
    if (foodListContainer) foodListContainer.classList.add('hidden');
    if(foodSearchInput) foodSearchInput.value = '';
    handleSearchInput();
    currentMealCategoryToAdd = '';
    editingLogIndex = null;
}

function showFoodSelectionView(mealCategory) {
    editingLogIndex = null;
    currentMealCategoryToAdd = mealCategory;
    console.log("Adding food for:", currentMealCategoryToAdd);
    if (dailyLogContainer) dailyLogContainer.classList.add('hidden');
    if (foodListContainer) foodListContainer.classList.remove('hidden');
}

// --- Search Functionality ---
function handleSearchInput() {
    if (!foodSearchInput || !allFoodButtons) return;
    const searchTerm = foodSearchInput.value.toLowerCase().trim();
    allFoodButtons.forEach(button => {
        const foodName = button.dataset.foodName.toLowerCase();
        button.classList.toggle('hidden', !foodName.includes(searchTerm));
    });
}

// --- Nutrition Calculation and Modal Display Update ---
function updateNutritionDisplay() {
    currentCalculatedNutrition = { kcal: 0, p: 0, c: 0, f: 0 };
    const defaultDisplay = `
        <span><span class="label">Calories:</span> --</span>
        <span><span class="label">P:</span> -- g</span>
        <span><span class="label">C:</span> -- g</span>
        <span><span class="label">F:</span> -- g</span>`;

    const foodNameToCalc = currentFoodName;
    if (!foodAmountInput || !unitSelect || !nutritionDisplayModal || !foodNameToCalc) {
         if (nutritionDisplayModal) nutritionDisplayModal.innerHTML = defaultDisplay;
         return;
    }

    const amount = parseFloat(foodAmountInput.value);
    const selectedUnit = unitSelect.value;
    const baseNutrition = foodData[foodNameToCalc];

    if (!isNaN(amount) && amount > 0 && baseNutrition && unitConversionFactors[selectedUnit]) {
        const amountInGrams = amount * unitConversionFactors[selectedUnit];
        const factor = amountInGrams / 100;

        currentCalculatedNutrition.kcal = Math.round(baseNutrition.kcal * factor);
        currentCalculatedNutrition.p = parseFloat((baseNutrition.p * factor).toFixed(1));
        currentCalculatedNutrition.c = parseFloat((baseNutrition.c * factor).toFixed(1));
        currentCalculatedNutrition.f = parseFloat((baseNutrition.f * factor).toFixed(1));

        nutritionDisplayModal.innerHTML = `
            <span><span class="label">Calories:</span> ${currentCalculatedNutrition.kcal}</span>
            <span><span class="label">P:</span> ${currentCalculatedNutrition.p} g</span>
            <span><span class="label">C:</span> ${currentCalculatedNutrition.c} g</span>
            <span><span class="label">F:</span> ${currentCalculatedNutrition.f} g</span>`;
    } else {
         nutritionDisplayModal.innerHTML = defaultDisplay;
    }
}

// --- Render Daily Log ---
function renderDailyLog() {
    // Guard clauses removed chartContainer check
    if (!logListBreakfast || !logListLunch || !logListDinner || !logListSnacks ||
        !totalCaloriesValue || !totalProteinValue || !totalCarbsValue || !totalFatValue ||
        !totalNutritionContainer) return;

    // Clear lists
    logListBreakfast.innerHTML = ''; logListLunch.innerHTML = ''; logListDinner.innerHTML = ''; logListSnacks.innerHTML = '';

    let overallTotals = { kcal: 0, p: 0, c: 0, f: 0 };
    let mealTotals = {};
     MEAL_TYPES.forEach(meal => { mealTotals[meal] = { kcal: 0, p: 0, c: 0, f: 0 }; });

    // Iterate through the log to calculate totals and create list items
    dailyLog.forEach((item, index) => {
        // Accumulate totals
        overallTotals.kcal += item.nutrition.kcal;
        overallTotals.p += item.nutrition.p;
        overallTotals.c += item.nutrition.c;
        overallTotals.f += item.nutrition.f;
         if (mealTotals[item.meal]) {
            mealTotals[item.meal].kcal += item.nutrition.kcal;
            mealTotals[item.meal].p += item.nutrition.p;
            mealTotals[item.meal].c += item.nutrition.c;
            mealTotals[item.meal].f += item.nutrition.f;
         }

        // Create list item
        const listItem = document.createElement('li');
        listItem.setAttribute('data-log-index', index);
        listItem.innerHTML = `
            <span class="log-item-details">${item.amount}${item.unit} ${item.name}</span>
            <div class="log-item-nutrition-details"> <span><span class="macro-label">~ ${item.nutrition.kcal} kcal</span></span>
                <span><span class="macro-label">P:</span> ${item.nutrition.p.toFixed(1)}g</span>
                <span><span class="macro-label">C:</span> ${item.nutrition.c.toFixed(1)}g</span>
                <span><span class="macro-label">F:</span> ${item.nutrition.f.toFixed(1)}g</span>
            </div>
            <button class="delete-log-item-btn" title="Delete Item">&times;</button> `;

        // Append to the correct list
        switch (item.meal) {
            case 'Breakfast': logListBreakfast.appendChild(listItem); break;
            case 'Lunch': logListLunch.appendChild(listItem); break;
            case 'Dinner': logListDinner.appendChild(listItem); break;
            case 'Snacks': logListSnacks.appendChild(listItem); break;
        }
    });

    // Update Meal Summary Displays (Only Kcal) & Toggle Empty Messages
    MEAL_TYPES.forEach(meal => {
        const totals = mealTotals[meal];
        const spans = mealSummarySpans[meal];
        const emptyMsg = document.getElementById(`empty-${meal.toLowerCase()}`);

        if (spans && spans.kcal) {
            spans.kcal.textContent = Math.round(totals.kcal);
        }

        const itemCount = dailyLog.filter(item => item.meal === meal).length;
        if(emptyMsg) emptyMsg.style.display = itemCount === 0 ? 'block' : 'none';
        const summaryDiv = spans?.kcal?.closest('.meal-summary');
        if(summaryDiv) summaryDiv.style.display = itemCount === 0 ? 'none' : 'flex';
    });

    // Update overall total display
    totalCaloriesValue.textContent = Math.round(overallTotals.kcal);
    totalProteinValue.textContent = overallTotals.p.toFixed(1);
    totalCarbsValue.textContent = overallTotals.c.toFixed(1);
    totalFatValue.textContent = overallTotals.f.toFixed(1);

    // Show/hide total container
    const logIsEmpty = dailyLog.length === 0;
    totalNutritionContainer.style.display = logIsEmpty ? 'none' : 'flex';
    // Chart logic removed
    if (dailyLogContainer) {
         dailyLogContainer.style.display = 'block';
    }

    // Chart update logic removed
}

// --- Update Macro Pie Chart Function Removed ---

// --- Modal Opening Logic ---
function openModalForAdd(foodName) {
     if (!modalFoodName || !foodAmountInput || !unitSelect || !modalOverlay || !modalActionBtn) return;
     editingLogIndex = null;
     currentFoodName = foodName;
     modalFoodName.textContent = `Add ${currentFoodName}`;
     modalActionBtn.textContent = 'Add';
     foodAmountInput.value = '';
     unitSelect.value = 'g';
     updateNutritionDisplay();
     modalOverlay.classList.add('active');
     foodAmountInput.focus();
}

 function openModalForEdit(logIndex) {
    if (logIndex === null || logIndex < 0 || logIndex >= dailyLog.length) return;
    if (!modalFoodName || !foodAmountInput || !unitSelect || !modalOverlay || !modalActionBtn) return;

    editingLogIndex = logIndex;
    const logEntry = dailyLog[logIndex];
    currentFoodName = logEntry.name;
    currentMealCategoryToAdd = ''; // Not needed

    modalFoodName.textContent = `Edit ${logEntry.name}`;
    modalActionBtn.textContent = 'Save Changes';
    foodAmountInput.value = logEntry.amount;
    unitSelect.value = logEntry.unit;

    updateNutritionDisplay();
    modalOverlay.classList.add('active');
    foodAmountInput.focus();
 }

// --- Modal Closing Logic ---
function closeModal() {
    if (!modalOverlay) return;
    modalOverlay.classList.remove('active');
    currentFoodName = '';
    currentCalculatedNutrition = { kcal: 0, p: 0, c: 0, f: 0 };
    editingLogIndex = null;
}

// --- Modal Action (Add/Save) Button Logic ---
function handleModalActionButtonClick() {
    if (!foodAmountInput || !unitSelect) return;
    const amount = foodAmountInput.value;
    const selectedUnit = unitSelect.value;

    if (!amount || parseFloat(amount) <= 0 || !currentFoodName || currentCalculatedNutrition.p === undefined) {
         alert('Please enter a valid positive amount.');
         if (foodAmountInput) foodAmountInput.focus();
         return;
    }

    if (editingLogIndex !== null) {
        // --- EDIT existing item ---
        if (editingLogIndex >= 0 && editingLogIndex < dailyLog.length) {
            dailyLog[editingLogIndex].amount = parseFloat(amount);
            dailyLog[editingLogIndex].unit = selectedUnit;
            dailyLog[editingLogIndex].nutrition = { ...currentCalculatedNutrition };
            console.log(`Edited item at index: ${editingLogIndex}`);
            renderDailyLog();
            closeModal();
        } else {
            console.error("Invalid index for editing:", editingLogIndex);
            alert("Error saving changes. Invalid item index.");
            closeModal();
        }
    } else {
        // --- ADD new item ---
        if (!currentMealCategoryToAdd) {
             alert('Error: Meal category not set for adding.'); return;
        }
        const logEntry = {
            name: currentFoodName, amount: parseFloat(amount), unit: selectedUnit,
            meal: currentMealCategoryToAdd, nutrition: { ...currentCalculatedNutrition }
        };
        dailyLog.push(logEntry);
        renderDailyLog();
        console.log(`Logged: ${logEntry.amount}${logEntry.unit} of ${logEntry.name} to ${logEntry.meal}`);
        closeModal();
        showLogView();
    }
}

 // --- Handle Delete Button Click ---
function handleDeleteLogItem(event) {
    if (event.target.classList.contains('delete-log-item-btn')) {
        const listItem = event.target.closest('li');
        if (listItem && listItem.dataset.logIndex !== undefined) {
            const indexToDelete = parseInt(listItem.dataset.logIndex, 10);
            if (!isNaN(indexToDelete) && indexToDelete >= 0 && indexToDelete < dailyLog.length) {
                console.log(`Deleting item at index: ${indexToDelete}`);
                dailyLog.splice(indexToDelete, 1);
                renderDailyLog();
            } else {
                console.error("Invalid index found for deletion:", listItem.dataset.logIndex);
            }
        }
    }
}

// --- Handle Log Item Click (Edit) ---
function handleLogItemClick(event) {
    const listItem = event.target.closest('li');
    if (!listItem) return;
    if (event.target.classList.contains('delete-log-item-btn')) return; // Ignore delete button clicks

    const indexToEdit = parseInt(listItem.dataset.logIndex, 10);
    if (!isNaN(indexToEdit)) {
        openModalForEdit(indexToEdit);
    }
}


// --- Setup Event Listeners ---
function setupEventListeners() {
    // Chart elements removed from checks
    const requiredElements = [
        foodSearchInput, foodButtonsContainer, foodAmountInput, unitSelect,
        modalActionBtn, modalCancelBtn, modalOverlay, dailyLogContainer, backToLogBtn,
        nutritionDisplayModal, totalNutritionContainer
    ];
    if (requiredElements.some(el => !el)) {
         console.error("One or more elements required for event listeners not found!"); return;
    }

    foodSearchInput.addEventListener('input', handleSearchInput);
    dailyLogContainer.addEventListener('click', (event) => {
        if (event.target.classList.contains('add-food-btn')) {
            const meal = event.target.dataset.meal;
            if (meal) showFoodSelectionView(meal);
        } else if (event.target.classList.contains('delete-log-item-btn')) {
            handleDeleteLogItem(event);
        } else if (event.target.closest('li')) {
            handleLogItemClick(event);
        }
    });
    foodButtonsContainer.addEventListener('click', (event) => {
         if (event.target.classList.contains('food-button') && !event.target.classList.contains('hidden')) {
             openModalForAdd(event.target.dataset.foodName);
         }
    });
    backToLogBtn.addEventListener('click', showLogView);
    foodAmountInput.addEventListener('input', updateNutritionDisplay);
    unitSelect.addEventListener('change', updateNutritionDisplay);
    modalActionBtn.addEventListener('click', handleModalActionButtonClick);
    modalCancelBtn.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', (event) => { if (event.target === modalOverlay) closeModal(); });
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && modalOverlay?.classList.contains('active')) closeModal();
    });
}

// --- Initialisation ---
document.addEventListener('DOMContentLoaded', () => {
    initializeDOMReferences();
    setupEventListeners();
    renderDailyLog();
    showLogView();
});

