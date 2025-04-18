class DropdownMenu {
    constructor(buttonSelector, menuId) {
        this.buttonElement = document.querySelector(buttonSelector);
        this.menuElement = document.getElementById(menuId);

        if (!this.buttonElement || !this.menuElement) {
            console.error(`Dropdown elements not found. Button: ${buttonSelector}, Menu ID: ${menuId}`);
            this.valid = false;
            return;
        }
        this.valid = true;

        this.toggle = this.toggle.bind(this);
        this._handleOutsideClick = this._handleOutsideClick.bind(this);
        this._handleEscapeKey = this._handleEscapeKey.bind(this);

        this._initEventListeners();
    }

    open() {
        this.menuElement.hidden = false;
        this.buttonElement.setAttribute('aria-expanded', 'true');
    }

    close() {
        this.menuElement.hidden = true;
        this.buttonElement.setAttribute('aria-expanded', 'false');
    }

    toggle(event) {
        event.stopPropagation();
        if (this.menuElement.hidden) {
        this.open();
        } else {
        this.close();
        }
    }

    _handleOutsideClick(event) {
        if (!this.menuElement.hidden &&
            this.buttonElement && !this.buttonElement.contains(event.target) &&
            this.menuElement && !this.menuElement.contains(event.target)) {
        this.close();
        }
    }

    _handleEscapeKey(event) {
        if (event.key === 'Escape' && !this.menuElement.hidden) {
            this.close();
        }
    }

    _initEventListeners() {
        if(this.buttonElement) {
            this.buttonElement.addEventListener('click', this.toggle);
        }
        document.addEventListener('click', this._handleOutsideClick);
        document.addEventListener('keydown', this._handleEscapeKey);
    }
}

class QuestionnaireForm {
    constructor(formId) {
        this.formElement = document.getElementById(formId);
        if (!this.formElement) {
            console.error(`Form element not found with ID: ${formId}`);
            this.valid = false;
            return;
        }
        this.valid = true;

        this.ageDropdown = this.formElement.querySelector("#age");
        this.weightUnit = this.formElement.querySelector("#weightUnit");
        this.weightValue = this.formElement.querySelector("#weightValue");
        this.heightUnit = this.formElement.querySelector("#heightUnit");
        this.heightValue = this.formElement.querySelector("#heightValue");

        this.populateWeightOptions = this.populateWeightOptions.bind(this);
        this.populateHeightOptions = this.populateHeightOptions.bind(this);
        this._handleSubmit = this._handleSubmit.bind(this);

        this._initPopulateDropdowns();
        this._initEventListeners();
    }

    _initPopulateDropdowns() {
        this._populateAge();
        if (this.weightUnit) this.populateWeightOptions();
        if (this.heightUnit) this.populateHeightOptions();
    }

    _initEventListeners() {
        if (this.weightUnit) {
            this.weightUnit.addEventListener("change", this.populateWeightOptions);
        }
        if (this.heightUnit) {
            this.heightUnit.addEventListener("change", this.populateHeightOptions);
        }
        this.formElement.addEventListener("submit", this._handleSubmit);
    }

    _populateAge() {
        if (!this.ageDropdown) return;
        if (!this.ageDropdown.querySelector('option[value=""]')) {
             this.ageDropdown.innerHTML = '<option value="" disabled selected>--Choose your age--</option>' + this.ageDropdown.innerHTML;
        }
        for (let age = 18; age <= 100; age++) {
            const option = document.createElement("option");
            option.value = age;
            option.textContent = age;
            this.ageDropdown.appendChild(option);
        }
    }

    populateWeightOptions() {
        if (!this.weightValue || !this.weightUnit) return;
        const unit = this.weightUnit.value;
        this.weightValue.innerHTML = '<option value="" disabled selected>--Choose weight--</option>';
        let min = unit === "kg" ? 30 : 66;
        let max = unit === "kg" ? 200 : 440;
        for (let i = min; i <= max; i++) {
            const option = document.createElement("option");
            option.value = i;
            option.textContent = `${i} ${unit}`;
            this.weightValue.appendChild(option);
        }
    }

    populateHeightOptions() {
        if (!this.heightValue || !this.heightUnit) return;
        const unit = this.heightUnit.value;
        this.heightValue.innerHTML = '<option value="" disabled selected>--Choose height--</option>';
        if (unit === "cm") {
            for (let cm = 140; cm <= 220; cm++) {
                const option = document.createElement("option");
                option.value = cm;
                option.textContent = `${cm} cm`;
                this.heightValue.appendChild(option);
            }
        } else if (unit === "ft") {
            for (let feet = 4; feet <= 7; feet++) {
                for (let inches = 0; inches < 12; inches++) {
                    const totalInches = feet * 12 + inches;
                    const label = `${feet}'${inches}"`;
                    const option = document.createElement("option");
                    option.value = totalInches;
                    option.textContent = label;
                    this.heightValue.appendChild(option);
                }
            }
        }
    }

    _handleSubmit(event) {
        event.preventDefault();

        const goal = this.formElement.querySelector('input[name="goal"]:checked')?.value;
        const age = this.ageDropdown?.value;
        const weight = this.weightValue?.value;
        const weightUnitVal = this.weightUnit?.value;
        const height = this.heightValue?.value;
        const heightUnitVal = this.heightUnit?.value;
        const sex = this.formElement.querySelector('input[name="sex"]:checked')?.value;
        const diets = Array.from(this.formElement.querySelectorAll('input[name="diet"]:checked')).map(cb => cb.value);

        console.log("Questionnaire Submitted (OOP):", {
          goal,
          age,
          weight,
          weightUnit: weightUnitVal,
          height,
          heightUnit: heightUnitVal,
          sex,
          diets,
        });

        alert("Questionnaire submitted (OOP)! Check the console for data.");
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const questionnaire = new QuestionnaireForm('questionnaireForm');
    const settingsDropdown = new DropdownMenu('.settings-button', 'settings-menu');

    if (!questionnaire.valid) {
        console.error("Failed to initialize QuestionnaireForm.");
    }
    if (!settingsDropdown.valid) {
        console.error("Failed to initialize DropdownMenu.");
    }
});