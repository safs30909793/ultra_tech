// Student Registration JavaScript

let currentStep = 1
let studentData = null
let paymentType = null

// Declare variables before using them
function setLoadingState(button, loading, originalText) {
  if (loading) {
    button.innerHTML = "Loading..."
    button.disabled = true
  } else {
    button.innerHTML = originalText
    button.disabled = false
  }
}

function showMessage(message, type) {
  const messageDiv = document.getElementById("message")
  messageDiv.innerHTML = `<div class="alert alert-${type}" role="alert">${message}</div>`
}

const PaystackPop = {
  setup: (options) => ({
    openIframe: () => {
      console.log("Paystack payment handler opened with options:", options)
    },
  }),
}

function generateReference(prefix) {
  return `${prefix}-${Math.floor(Math.random() * 1000000)}`
}

const bootstrap = {
  Modal: (element) => {
    console.log("Bootstrap modal initialized for element:", element)
    return {
      show: () => {
        console.log("Modal shown")
      },
    }
  },
}

document.addEventListener("DOMContentLoaded", () => {
  setupRegistrationSteps()
})

// Setup registration step handlers
function setupRegistrationSteps() {
  // Step 1: Application verification
  document.getElementById("verifyApplicationForm").addEventListener("submit", verifyApplication)

  // Step 3: Security form
  document.getElementById("securityForm").addEventListener("submit", setupSecurity)

  // Step 4: Document upload
  document.getElementById("documentForm").addEventListener("submit", completeRegistration)
}

// Verify application number
async function verifyApplication(e) {
  e.preventDefault()

  const applicationNumber = document.getElementById("applicationNumber").value.trim()
  const submitBtn = e.target.querySelector('button[type="submit"]')
  const originalText = submitBtn.innerHTML

  setLoadingState(submitBtn, true, originalText)

  try {
    const response = await fetch(`/api/student/verify-application/${applicationNumber}`)
    const result = await response.json()

    if (result.success) {
      studentData = result.student
      displayStudentDetails(result.student)
      showStep(2)
    } else {
      throw new Error(result.error || "Application not found")
    }
  } catch (error) {
    console.error("Verification error:", error)
    showMessage(error.message || "Application verification failed", "danger")
  } finally {
    setLoadingState(submitBtn, false, originalText)
  }
}

// Display student details
function displayStudentDetails(student) {
  const detailsDiv = document.getElementById("studentDetails")
  detailsDiv.innerHTML = `
    <div class="row">
      <div class="col-md-6">
        <strong>Name:</strong> ${student.first_name} ${student.last_name}<br>
        <strong>Email:</strong> ${student.email}<br>
        <strong>Phone:</strong> ${student.phone}
      </div>
      <div class="col-md-6">
        <strong>Course:</strong> ${student.course_name}<br>
        <strong>Application Number:</strong> ${student.application_number}<br>
        <strong>Status:</strong> <span class="badge bg-warning">${student.status}</span>
      </div>
    </div>
  `
}

// Select payment option
function selectPayment(type) {
  paymentType = type

  // Remove active class from all cards
  document.querySelectorAll(".payment-card").forEach((card) => {
    card.classList.remove("border-primary", "bg-light")
  })

  // Add active class to selected card
  event.currentTarget.classList.add("border-primary", "bg-light")

  // Show proceed button
  document.getElementById("proceedPayment").style.display = "block"
}

// Process payment
function processPayment() {
  const amount = paymentType === "full" ? 50000 : 25000 // ₦500 or ₦250 in kobo
  const description = paymentType === "full" ? "Full Registration Payment" : "Registration Payment (1st Installment)"

  const handler = PaystackPop.setup({
    key: "pk_test_your_paystack_public_key", // Replace with actual public key
    email: studentData.email,
    amount: amount,
    currency: "NGN",
    ref: generateReference("REG"),
    metadata: {
      custom_fields: [
        {
          display_name: "Student ID",
          variable_name: "student_id",
          value: studentData.id,
        },
        {
          display_name: "Payment Type",
          variable_name: "payment_type",
          value: paymentType,
        },
      ],
    },
    callback: (response) => {
      verifyRegistrationPayment(response.reference)
    },
    onClose: () => {
      showMessage("Payment cancelled", "warning")
    },
  })

  handler.openIframe()
}

// Verify registration payment
async function verifyRegistrationPayment(reference) {
  try {
    const response = await fetch("/api/payment/verify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        reference: reference,
        studentId: studentData.id,
        paymentType: "Registration",
        installmentType: paymentType,
      }),
    })

    const result = await response.json()

    if (result.success) {
      showMessage("Payment successful! Please continue with security setup.", "success")
      showStep(3)
    } else {
      throw new Error(result.error || "Payment verification failed")
    }
  } catch (error) {
    console.error("Payment verification error:", error)
    showMessage("Payment verification failed. Please contact support.", "danger")
  }
}

// Setup security (Step 3)
async function setupSecurity(e) {
  e.preventDefault()

  const password = document.getElementById("password").value
  const confirmPassword = document.getElementById("confirmPassword").value
  const securityQuestion = document.getElementById("securityQuestion").value
  const securityAnswer = document.getElementById("securityAnswer").value

  if (password !== confirmPassword) {
    showMessage("Passwords do not match", "danger")
    return
  }

  if (password.length < 8) {
    showMessage("Password must be at least 8 characters long", "danger")
    return
  }

  const submitBtn = e.target.querySelector('button[type="submit"]')
  const originalText = submitBtn.innerHTML
  setLoadingState(submitBtn, true, originalText)

  try {
    const response = await fetch("/api/student/setup-security", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        studentId: studentData.id,
        password: password,
        securityQuestion: securityQuestion,
        securityAnswer: securityAnswer.toUpperCase().trim(),
      }),
    })

    const result = await response.json()

    if (result.success) {
      showMessage("Security setup complete! Please upload your documents.", "success")
      showStep(4)
    } else {
      throw new Error(result.error || "Security setup failed")
    }
  } catch (error) {
    console.error("Security setup error:", error)
    showMessage(error.message || "Security setup failed", "danger")
  } finally {
    setLoadingState(submitBtn, false, originalText)
  }
}

// Complete registration (Step 4)
async function completeRegistration(e) {
  e.preventDefault()

  const formData = new FormData()
  formData.append("studentId", studentData.id)

  // Add highest qualification
  const highestQual = document.getElementById("highestQualification").files[0]
  if (!highestQual) {
    showMessage("Please upload your highest qualification document", "danger")
    return
  }
  formData.append("highestQualification", highestQual)

  // Add additional qualifications
  const qualNames = document.querySelectorAll('input[name="qualName[]"]')
  const qualFiles = document.querySelectorAll('input[name="qualFile[]"]')

  for (let i = 0; i < qualNames.length; i++) {
    if (qualNames[i].value.trim() && qualFiles[i].files[0]) {
      formData.append(`additionalQualName_${i}`, qualNames[i].value.trim())
      formData.append(`additionalQualFile_${i}`, qualFiles[i].files[0])
    }
  }

  const submitBtn = e.target.querySelector('button[type="submit"]')
  const originalText = submitBtn.innerHTML
  setLoadingState(submitBtn, true, originalText)

  try {
    const response = await fetch("/api/student/complete-registration", {
      method: "POST",
      body: formData,
    })

    const result = await response.json()

    if (result.success) {
      // Show success modal with admission number
      document.getElementById("admissionNumber").textContent = result.admissionNumber
      const successModal = new bootstrap.Modal(document.getElementById("registrationSuccessModal"))
      successModal.show()

      // Store data for downloads
      sessionStorage.setItem("admissionNumber", result.admissionNumber)
      sessionStorage.setItem("studentId", studentData.id)
    } else {
      throw new Error(result.error || "Registration completion failed")
    }
  } catch (error) {
    console.error("Registration completion error:", error)
    showMessage(error.message || "Registration completion failed", "danger")
  } finally {
    setLoadingState(submitBtn, false, originalText)
  }
}

// Show specific step
function showStep(stepNumber) {
  // Hide all steps
  document.querySelectorAll(".registration-step").forEach((step) => {
    step.style.display = "none"
  })

  // Show current step
  document.getElementById(`step${stepNumber}`).style.display = "block"
  currentStep = stepNumber
}

// Add qualification field
function addQualificationField() {
  const container = document.getElementById("additionalQualifications")
  const newField = document.createElement("div")
  newField.className = "additional-qual-item mb-2"
  newField.innerHTML = `
    <div class="row">
      <div class="col-md-5">
        <input type="text" class="form-control form-control-custom" 
               placeholder="Qualification Name" name="qualName[]">
      </div>
      <div class="col-md-5">
        <input type="file" class="form-control form-control-custom" 
               accept=".pdf,.jpg,.jpeg,.png" name="qualFile[]">
      </div>
      <div class="col-md-2">
        <button type="button" class="btn btn-outline-danger btn-sm w-100" onclick="removeQualificationField(this)">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    </div>
  `
  container.appendChild(newField)
}

// Remove qualification field
function removeQualificationField(button) {
  button.closest(".additional-qual-item").remove()
}

// Download admission letter
function downloadAdmissionLetter() {
  const admissionNumber = sessionStorage.getItem("admissionNumber")
  const studentId = sessionStorage.getItem("studentId")

  if (admissionNumber && studentId) {
    window.open(`/api/admission-letter/download?admissionNumber=${admissionNumber}&studentId=${studentId}`, "_blank")
  } else {
    showMessage("Admission letter information not found", "danger")
  }
}
