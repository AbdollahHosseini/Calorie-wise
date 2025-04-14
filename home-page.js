document.addEventListener('DOMContentLoaded', () => {

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
            !this.buttonElement.contains(event.target) &&
            !this.menuElement.contains(event.target)) {
          this.close();
        }
      }
  
      _handleEscapeKey(event) {
          if (event.key === 'Escape' && !this.menuElement.hidden) {
             this.close();
          }
      }
  
      _initEventListeners() {
        this.buttonElement.addEventListener('click', this.toggle);
        document.addEventListener('click', this._handleOutsideClick);
        document.addEventListener('keydown', this._handleEscapeKey);
      }
    }
  
    const settingsDropdown = new DropdownMenu('.settings-button', 'settings-menu');
  
  });