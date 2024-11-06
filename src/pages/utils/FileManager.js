// for custom files, not being used currently

class FileManager {
    // Keep important properties from being overwritten
    constructor() {
        Object.defineProperties(this, {
            // The file input element (hidden)
            _fileInput: {
                value: document.createElement('input'),
                writeable: false,
                enumerable: false,
                configurable: false
            },
            // Flag to denote if a file was chosen
            _chooseSuccess: {
                value: false,
                writable: true,
            },
            // Keeps events from mult-firing
            // Don't want to consume just incase!
            _eventFiredOnce: {
                value: false,
                writable: true,
            },
            // Called BEFORE dialog is shown
            _chooseStart_handler: {
                value: (event) => {
                    // Choose might happen, assume it won't
                    this._chooseSuccess = false;

                    // Allow a single fire
                    this._eventFiredOnce = false;

                    // Reset value so repeat files also trigger a change/choose
                    this._fileInput.value = '';



                    /* File chooser is semi-modal and will stall events while it's opened */
                    /* Beware, some code can still run while the dialog is opened! */

                    // Window will usually focus on dialog close
                    // If it works this is best becuase the event will trigger as soon as the dialog is closed
                    // Even the user has moved the dialog off of the browser window is should still refocus
                    window.addEventListener('focus', this._chooseEnd_handler);

                    // This will always fire when the mouse first enters the body
                    // A good redundancy but will not fire immeditely if the cance button is not...
                    // in window when clicked
                    document.body.addEventListener('mouseenter', this._chooseEnd_handler);

                    // Again almost a guarantee that this will fire but it will not do so...
                    // imediately if the dialog is out of window!
                    window.addEventListener('mousemove', this._chooseEnd_handler);
                },
                writeable: false,
                enumerable: false,
                configurable: false
            },
            _chooseEnd_handler: {
                // Focus event may beat change event
                // Wait 1/10th of a second to make sure change registers!
                value: (event) => {
                    // queue one event to fire
                    if (this._eventFiredOnce)
                        return;

                    // Mark event as fired once
                    this._eventFiredOnce = true;
                    // double call prevents 'this' context swap, IHT!
                    setTimeout((event) => {
                        this._timeout_handler(event);
                    }, 100);
                },
                writeable: false,
                enumerable: false,
                configurable: false
            },
            _choose_handler: {
                value: (event) => {
                    // A file was chosen by the user
                    // Set flag
                    this._chooseSuccess = true;
                    // End the choose
                    this._chooseEnd_handler(event);
                },
                writeable: false,
                enumerable: false,
                configurable: false
            },
            _timeout_handler: {
                value: (event) => {
                    if (!this._chooseSuccess) {
                        // Choose process done, no file selected
                        // Fire cancel event on input
                        this._fileInput.dispatchEvent(new Event('cancel'));
                    } else {
                        // Choose process done, file was selected
                        // Fire chosen event on input
                        this._fileInput.dispatchEvent(new Event('choose'));
                    }

                    // remove listeners or cancel will keep firing
                    window.removeEventListener('focus', this._chooseEnd_handler);
                    document.body.removeEventListener('mouseenter', this._chooseEnd_handler);
                    window.removeEventListener('mousemove', this._chooseEnd_handler);
                },
                writeable: false,
                enumerable: false,
                configurable: false
            },
            addEventListener: {
                value: (type, handle) => {
                    this._fileInput.addEventListener(type, handle);
                },
                writeable: false,
                enumerable: false,
                configurable: false
            },
            removeEventListener: {
                value: (type, handle) => {
                    this._fileInput.removeEventListener(type, handle);
                },
                writeable: false,
                enumerable: false,
                configurable: false
            },
            // Note: Shadow clicks must be called from a user input event stack!
            openFile: {
                value: () => {
                    // Trigger custom pre-click event
                    this._chooseStart_handler();

                    // Show file dialog
                    this._fileInput.click();
                    // ^^^ Code will still run after this part (non halting)
                    // Events will not trigger though until the dialog is closed
                }
            }
        });
        this._fileInput.type = 'file';
        this._fileInput.addEventListener('change', this._choose_handler);
    }

    // Get all files
    get files() {
        return this._input.files;
    }

    // Get input element (reccomended to keep hidden);
    get domElement(){
        return this._fileInput;
    }

    // Get specific file
    getFile(index) {
        return index === undefined ? this._fileInput.files[0] : this._fileInput.files[index];
    }

    // Set multi-select
    set multiSelect(value) {
        let val = value ? 'multiple' : '';
        this._fileInput.setAttribute('multiple', val);
    }

    // Get multi-select
    get multiSelect() {
        return this._fileInput.multiple === 'multiple' ? true : false;
    }
}