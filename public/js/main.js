// UltraTech Global Solution LTD - Main JavaScript

document.addEventListener("DOMContentLoaded", () => {
  // Load courses on page load
  loadCourses()

  // Smooth scrolling for navigation links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault()
      const target = document.querySelector(this.getAttribute("href"))
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        })
      }
    })
  })

  // Navbar background change on scroll
  window.addEventListener("scroll", () => {
    const navbar = document.querySelector(".navbar-custom")
    if (window.scrollY > 50) {
      navbar.style.backgroundColor = "rgba(255, 255, 255, 0.95)"
      navbar.style.backdropFilter = "blur(10px)"
    } else {
      navbar.style.backgroundColor = "var(--background)"
      navbar.style.backdropFilter = "none"
    }
  })
})

// Load courses from API
async function loadCourses() {
  const coursesContainer = document.getElementById("coursesContainer")
  const loading = document.getElementById("coursesLoading")

  try {
    loading.style.display = "block"

    const response = await fetch("/api/courses")
    const courses = await response.json()

    loading.style.display = "none"

    if (courses.length === 0) {
      coursesContainer.innerHTML =
        '<div class="col-12 text-center"><p class="text-muted">No courses available at the moment.</p></div>'
      return
    }

    coursesContainer.innerHTML = courses
      .map(
        (course) => `
            <div class="col-lg-4 col-md-6 mb-4">
                <div class="course-card">
                    <div class="course-meta">
                        <span class="course-badge">${course.certification_type}</span>
                        <small><i class="fas fa-clock me-1"></i>${course.duration}</small>
                    </div>
                    <h4>${course.name}</h4>
                    <p class="text-muted mb-3">${course.description || "Comprehensive training program designed to equip you with industry-relevant skills."}</p>
                    <div class="course-meta mb-3">
                        <small><i class="fas fa-calendar me-1"></i>${formatSchedule(course.schedule)}</small>
                    </div>
                    <div class="d-flex justify-content-between align-items-center">
                        <button class="btn btn-primary-custom" onclick="showCourseDetails(${course.id})">
                            Learn More
                        </button>
                        <a href="/student/apply?course=${course.id}" class="btn btn-outline-success">
                            Apply Now
                        </a>
                    </div>
                </div>
            </div>
        `,
      )
      .join("")
  } catch (error) {
    console.error("Error loading courses:", error)
    loading.style.display = "none"
    coursesContainer.innerHTML =
      '<div class="col-12 text-center"><p class="text-danger">Error loading courses. Please try again later.</p></div>'
  }
}

// Format schedule display
function formatSchedule(schedule) {
  const scheduleMap = {
    weekend: "Weekends",
    morning: "Morning Classes",
    evening: "Evening Classes",
    "morning,evening": "Morning & Evening",
  }
  return scheduleMap[schedule] || schedule
}

// Show course details modal
function showCourseDetails(courseId) {
  // This will be implemented when we create the course details modal
  alert(`Course details for course ID: ${courseId}. This feature will be implemented in the next phase.`)
}

// Payment integration helper
function initializePayment(amount, email, reference, callback) {
  // Paystack integration will be implemented here
  console.log("Payment initialization:", { amount, email, reference })

  // For now, show a placeholder
  alert("Payment integration will be implemented with Paystack in the next phase.")
}

// Form validation helper
function validateForm(formElement) {
  const inputs = formElement.querySelectorAll("input[required], select[required], textarea[required]")
  let isValid = true

  inputs.forEach((input) => {
    if (!input.value.trim()) {
      input.classList.add("is-invalid")
      isValid = false
    } else {
      input.classList.remove("is-invalid")
    }
  })

  return isValid
}

// Generate application/reference numbers
function generateReference(prefix = "REF") {
  return prefix + Date.now() + Math.floor(Math.random() * 1000)
}

// Format currency (Nigerian Naira)
function formatCurrency(amount) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
  }).format(amount)
}

// Show success/error messages
function showMessage(message, type = "success") {
  const alertDiv = document.createElement("div")
  alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed`
  alertDiv.style.cssText = "top: 100px; right: 20px; z-index: 9999; min-width: 300px;"
  alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `

  document.body.appendChild(alertDiv)

  // Auto remove after 5 seconds
  setTimeout(() => {
    if (alertDiv.parentNode) {
      alertDiv.remove()
    }
  }, 5000)
}

// Loading state helper
function setLoadingState(element, isLoading, originalText = "") {
  if (isLoading) {
    element.disabled = true
    element.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Loading...'
  } else {
    element.disabled = false
    element.innerHTML = originalText
  }
}
