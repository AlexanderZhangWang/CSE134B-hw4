const form_errors = [];

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contactForm");
  const nameField = document.getElementById("name");
  const emailField = document.getElementById("email");
  const commentsField = document.getElementById("comments");
  const errorMessage = document.getElementById("errorMessage");
  const infoMessage = document.getElementById("infoMessage");
  const commentCountdown = document.getElementById("commentCountdown");
  const formErrorsField = document.getElementById("formErrorsField");

  nameField.addEventListener("keypress", (e) => {
    const allowedPattern = /^[a-zA-Z'\-\s]$/;
    const char = String.fromCharCode(e.which || e.keyCode);
    if (!allowedPattern.test(char)) {
      e.preventDefault();
      showTemporaryError(nameField, "Illegal character: " + char);
      addError("name", `User typed an illegal character: '${char}'`);
    }
  });

  commentsField.addEventListener("input", () => {
    const max = commentsField.getAttribute("maxlength") || 300;
    const currentLength = commentsField.value.length;
    const remaining = max - currentLength;
    commentCountdown.textContent = remaining;
    
    if (remaining <= 20) {
      commentCountdown.classList.add("near-limit");
    } else {
      commentCountdown.classList.remove("near-limit");
    }

    if (currentLength > max) {
      showTemporaryError(
        commentsField, 
        "You exceeded max length!"
      );
      addError("comments", "User exceeded max length");
    }
  });

  form.addEventListener("submit", (e) => {
    errorMessage.textContent = "";
    infoMessage.textContent = "";

    if (!form.checkValidity()) {
      e.preventDefault(); 
      buildCustomValidationMessages();
      displayErrors();
      return; 
    }

    formErrorsField.value = JSON.stringify(form_errors);

    infoMessage.textContent = "Form is valid! Submitting...";
  });

  function buildCustomValidationMessages() {
    if (!nameField.checkValidity()) {
      addError("name", nameField.validationMessage);
    }
    if (!emailField.checkValidity()) {
      addError("email", emailField.validationMessage);
    }
    if (!commentsField.checkValidity()) {
      addError("comments", commentsField.validationMessage);
    }
  }

  function addError(fieldName, msg) {
    form_errors.push({ field: fieldName, message: msg });
  }

  function displayErrors() {
    if (form_errors.length > 0) {
      let messages = form_errors.map(err => {
        return `${err.field}: ${err.message}`;
      });
      errorMessage.textContent = messages.join(" | ");
    }
  }

  function showTemporaryError(inputElem, msg) {
    errorMessage.textContent = msg;
    inputElem.classList.add("flash-error");

    setTimeout(() => {
      errorMessage.textContent = "";
      inputElem.classList.remove("flash-error");
    }, 2000);
  }

});
