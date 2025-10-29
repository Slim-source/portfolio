'use strict';

document.addEventListener('DOMContentLoaded', function() {
  // element toggle function
  const elementToggleFunc = function (elem) { elem.classList.toggle("active"); }

  // sidebar variables
  const sidebar = document.querySelector("[data-sidebar]");
  const sidebarBtn = document.querySelector("[data-sidebar-btn]");

  // sidebar toggle functionality for mobile
  if (sidebarBtn) {
    sidebarBtn.addEventListener("click", function () { elementToggleFunc(sidebar); });
  }

  // testimonials variables
  const testimonialsItem = document.querySelectorAll("[data-testimonials-item]");
  const modalContainer = document.querySelector("[data-modal-container]");
  const modalCloseBtn = document.querySelector("[data-modal-close-btn]");
  const overlay = document.querySelector("[data-overlay]");

  // modal variable
  const modalImg = document.querySelector("[data-modal-img]");
  const modalTitle = document.querySelector("[data-modal-title]");
  const modalText = document.querySelector("[data-modal-text]");

  // modal toggle function
  const testimonialsModalFunc = function () {
    modalContainer.classList.toggle("active");
    overlay.classList.toggle("active");
  }

  // add click event to all modal items
  testimonialsItem.forEach(item => {
    item.addEventListener("click", function () {
      modalImg.src = this.querySelector("[data-testimonials-avatar]").src;
      modalImg.alt = this.querySelector("[data-testimonials-avatar]").alt;
      modalTitle.innerHTML = this.querySelector("[data-testimonials-title]").innerHTML;
      modalText.innerHTML = this.querySelector("[data-testimonials-text]").innerHTML;
      testimonialsModalFunc();
    });
  });

  // add click event to modal close button
  if (modalCloseBtn) {
    modalCloseBtn.addEventListener("click", testimonialsModalFunc);
  }
  if (overlay) {
    overlay.addEventListener("click", testimonialsModalFunc);
  }

  // custom select variables
  const select = document.querySelector("[data-select]");
  const selectItems = document.querySelectorAll("[data-select-item]");
  const selectValue = document.querySelector("[data-selecct-value]");
  const filterBtn = document.querySelectorAll("[data-filter-btn]");

  if (select) {
    select.addEventListener("click", function () { elementToggleFunc(this); });
  }

  // add event in all select items
  selectItems.forEach(item => {
    item.addEventListener("click", function () {
      let selectedValue = this.innerText.toLowerCase();
      selectValue.innerText = this.innerText;
      elementToggleFunc(select);
      filterFunc(selectedValue);
    });
  });

  // filter variables
  const filterItems = document.querySelectorAll("[data-filter-item]");

  const filterFunc = function (selectedValue) {
    selectedValue = selectedValue.toLowerCase();
    filterItems.forEach(item => {
      const category = item.dataset.category.toLowerCase();
      if (selectedValue === "all" || selectedValue === category) {
        item.classList.add("active");
      } else {
        item.classList.remove("active");
      }
    });
  }

  // add event in all filter button items for large screen
  let lastClickedBtn = filterBtn[0];

  filterBtn.forEach(btn => {
    btn.addEventListener("click", function () {
      let selectedValue = this.innerText.toLowerCase();
      selectValue.innerText = this.innerText;
      filterFunc(selectedValue);
      lastClickedBtn.classList.remove("active");
      this.classList.add("active");
      lastClickedBtn = this;
    });
  });

  // contact form variables
  const form = document.querySelector("[data-form]");
  const formInputs = document.querySelectorAll("[data-form-input]");
  const formBtn = document.querySelector("[data-form-btn]");
  const feedback = document.getElementById('form-feedback');
  const submitBtn = document.getElementById('submitBtn');

  // add event to all form input field
  formInputs.forEach(input => {
    input.addEventListener("input", function () {
      if (form.checkValidity()) {
        formBtn.removeAttribute("disabled");
      } else {
        formBtn.setAttribute("disabled", "");
      }
    });
  });

  // Navigation functionality
  const navigationLinks = document.querySelectorAll("[data-nav-link]");
  const pages = document.querySelectorAll("[data-page]");

  function activatePage(pageName) {
    pageName = pageName.toLowerCase();
    // Remove active class from all pages and links
    pages.forEach(page => page.classList.remove("active"));
    navigationLinks.forEach(link => link.classList.remove("active"));
    
    // Find and activate the target page and link
    const targetPage = Array.from(pages).find(page => page.dataset.page === pageName);
    const targetLink = Array.from(navigationLinks).find(link => 
      (link.dataset.target || link.textContent.trim()).toLowerCase() === pageName
    );

    if (targetPage) targetPage.classList.add("active");
    if (targetLink) targetLink.classList.add("active");
  }

  // Add click event to navigation links
  navigationLinks.forEach(link => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const pageName = (this.dataset.target || this.textContent.trim()).toLowerCase();
      console.log('Navigating to:', pageName);
      activatePage(pageName);
      window.scrollTo(0, 0);
    });
  });

  // Initialize with About page
  activatePage('about');

  // Email form submission
  form.addEventListener('submit', function (event) {
    event.preventDefault();

    // Clear previous feedback
    feedback.textContent = '';
    feedback.classList.remove('success', 'error');
    feedback.style.display = 'none';

    // Get form data
    const formData = new FormData(form);
    const fullname = formData.get('fullname');
    const email = formData.get('email');
    const message = formData.get('message');

    // Simple validation
    if (!fullname || !email || !message) {
      feedback.textContent = 'Please fill in all fields.';
      feedback.classList.add('error');
      feedback.style.display = 'block';
      return;
    }

    // Disable submit button and show loading state
    submitBtn.disabled = true;
    submitBtn.querySelector('span').textContent = 'Sending...';

    // Send email using EmailJS
    emailjs.send(
      'service_57bmll9',
      'template_thsfczn',
      {
        from_name: fullname,
        from_email: 'simo.kazini58@gmail.com',
        reply_to: email,
        message: `
New Contact Form Message:
------------------------
Name: ${fullname}
Email: ${email}

Message:
${message}

------------------------
This message was sent from your portfolio contact form.
To reply, simply respond to this email.
        `,
        to_name: 'Simon Ngwili',
        to_email: 'simo.kazini58@gmail.com',
        subject: `Portfolio Contact: ${fullname}`,
        visitor_email: email
      }
    ).then(
      function(response) {
        feedback.textContent = 'Message sent successfully! I will get back to you soon.';
        feedback.classList.add('success');
        feedback.style.display = 'block';
        form.reset();
      },
      function(error) {
        feedback.textContent = 'Error: ' + (error.text || 'Failed to send message. Please try again.');
        feedback.classList.add('error');
        feedback.style.display = 'block';
      }
    ).finally(function() {
      submitBtn.disabled = false;
      submitBtn.querySelector('span').textContent = 'Send Message';
    });
  });
});