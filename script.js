// Global state management
let currentUser = null
let currentView = "home"
let isAuthMode = "signin" // 'signin' or 'signup'
let generatedOTP = ""
let otpEmail = ""

// DOM elements
const elements = {
  loadingScreen: document.getElementById("loading-screen"),
  navLinks: document.querySelectorAll(".nav-link"),
  views: document.querySelectorAll(".view"),
  loginBtn: document.getElementById("login-btn"),
  userMenu: document.getElementById("user-menu"),
  userName: document.getElementById("user-name"),
  logoutBtn: document.getElementById("logout-btn"),
  chatToggle: document.getElementById("chat-toggle"),
  chatbot: document.getElementById("chatbot"),
  chatbotClose: document.getElementById("chatbot-close"),
  loginModal: document.getElementById("login-modal"),
  modalClose: document.getElementById("modal-close"),
  authForm: document.getElementById("auth-form"),
  switchMode: document.getElementById("switch-mode"),
  modalTitle: document.getElementById("modal-title"),
  authSubmit: document.getElementById("auth-submit"),
  authSwitchText: document.getElementById("auth-switch-text"),
  nameGroup: document.getElementById("name-group"),
  otpSection: document.getElementById("otp-section"),
  demoOtp: document.getElementById("demo-otp"),
  generatedOtpSpan: document.getElementById("generated-otp"),
  copyOtpBtn: document.getElementById("copy-otp"),
  verifyOtpBtn: document.getElementById("verify-otp"),
  resendOtpBtn: document.getElementById("resend-otp"),
  otpInputs: document.querySelectorAll(".otp-input"),
  chatInput: document.getElementById("chat-input"),
  sendMessage: document.getElementById("send-message"),
  chatbotMessages: document.getElementById("chatbot-messages"),
  dashboardUserName: document.getElementById("dashboard-user-name"),
}

// Initialize app
document.addEventListener("DOMContentLoaded", () => {
  // Hide loading screen after a short delay
  setTimeout(() => {
    elements.loadingScreen.style.display = "none"
  }, 1000)

  // Check authentication status
  checkAuthStatus()

  // Setup event listeners
  setupEventListeners()

  // Initialize chat
  initializeChat()
})

// Authentication functions
function checkAuthStatus() {
  try {
    const storedUser = localStorage.getItem("tradevision_user")
    if (storedUser) {
      const userData = JSON.parse(storedUser)
      if (userData.email && userData.name && userData.isAuthenticated) {
        setUser(userData)
      } else {
        localStorage.removeItem("tradevision_user")
      }
    }
  } catch (error) {
    console.error("Error checking auth status:", error)
    localStorage.removeItem("tradevision_user")
  }
}

function setUser(userData) {
  currentUser = userData
  elements.loginBtn.style.display = "none"
  elements.userMenu.classList.remove("hidden")
  elements.userName.textContent = userData.name

  if (elements.dashboardUserName) {
    elements.dashboardUserName.textContent = userData.name
  }
}

function logout() {
  localStorage.removeItem("tradevision_user")
  currentUser = null
  elements.loginBtn.style.display = "block"
  elements.userMenu.classList.add("hidden")
  navigateToView("home")
}

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

function showOTPSection(email) {
  otpEmail = email
  generatedOTP = generateOTP()

  // Hide form, show OTP section
  elements.authForm.style.display = "none"
  elements.otpSection.classList.remove("hidden")

  // Show demo OTP
  elements.demoOtp.classList.remove("hidden")
  elements.generatedOtpSpan.textContent = generatedOTP

  console.log("Generated OTP:", generatedOTP)
}

function verifyOTP() {
  const enteredOTP = Array.from(elements.otpInputs)
    .map((input) => input.value)
    .join("")

  if (enteredOTP === generatedOTP) {
    // OTP verified successfully
    const userData = {
      email: otpEmail,
      name: document.getElementById("name").value || otpEmail.split("@")[0],
      isAuthenticated: true,
    }

    localStorage.setItem("tradevision_user", JSON.stringify(userData))
    setUser(userData)
    closeModal()
    navigateToView("platform")

    showNotification("Authentication successful!", "success")
  } else {
    showNotification("Invalid OTP. Please try again.", "error")
    // Clear OTP inputs
    elements.otpInputs.forEach((input) => (input.value = ""))
    elements.otpInputs[0].focus()
  }
}

function showNotification(message, type = "info") {
  const notification = document.createElement("div")
  notification.className = `notification ${type}`
  notification.textContent = message
  notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        color: white;
        font-weight: 500;
        z-index: 9999;
        animation: slideIn 0.3s ease;
    `

  if (type === "success") {
    notification.style.background = "#10b981"
  } else if (type === "error") {
    notification.style.background = "#ef4444"
  } else {
    notification.style.background = "#3b82f6"
  }

  document.body.appendChild(notification)

  setTimeout(() => {
    notification.remove()
  }, 3000)
}

// Navigation functions
function navigateToView(view) {
  if (view === "platform" && !currentUser) {
    openModal()
    return
  }

  currentView = view

  // Update nav links
  elements.navLinks.forEach((link) => {
    link.classList.remove("active")
    if (link.dataset.view === view) {
      link.classList.add("active")
    }
  })

  // Update views
  elements.views.forEach((viewEl) => {
    viewEl.classList.remove("active")
    if (viewEl.id === `${view}-view`) {
      viewEl.classList.add("active")
    }
  })
}

// Modal functions
function openModal() {
  elements.loginModal.classList.remove("hidden")
  document.body.style.overflow = "hidden"
}

function closeModal() {
  elements.loginModal.classList.add("hidden")
  document.body.style.overflow = "auto"
  resetAuthForm()
}

function resetAuthForm() {
  elements.authForm.reset()
  elements.authForm.style.display = "block"
  elements.otpSection.classList.add("hidden")
  elements.demoOtp.classList.add("hidden")
  elements.otpInputs.forEach((input) => (input.value = ""))
}

function toggleAuthMode() {
  isAuthMode = isAuthMode === "signin" ? "signup" : "signin"

  if (isAuthMode === "signup") {
    elements.modalTitle.textContent = "Sign Up"
    elements.authSubmit.textContent = "Sign Up"
    elements.nameGroup.style.display = "block"
    elements.authSwitchText.innerHTML =
      'Already have an account? <button id="switch-mode" class="btn-link">Sign In</button>'
  } else {
    elements.modalTitle.textContent = "Sign In"
    elements.authSubmit.textContent = "Sign In"
    elements.nameGroup.style.display = "none"
    elements.authSwitchText.innerHTML =
      'Don\'t have an account? <button id="switch-mode" class="btn-link">Sign Up</button>'
  }

  // Re-attach event listener to new switch button
  document.getElementById("switch-mode").addEventListener("click", toggleAuthMode)
}

// Chat functions
function initializeChat() {
  // Add initial bot message if not already present
  const messages = elements.chatbotMessages.children
  if (messages.length === 0) {
    addMessage("Hi! I'm your TradeVision assistant. How can I help you with your trading analysis today?", "bot")
  }
}

function addMessage(content, sender) {
  const messageDiv = document.createElement("div")
  messageDiv.className = `message ${sender}-message`

  const contentDiv = document.createElement("div")
  contentDiv.className = "message-content"
  contentDiv.textContent = content

  messageDiv.appendChild(contentDiv)
  elements.chatbotMessages.appendChild(messageDiv)

  // Scroll to bottom
  elements.chatbotMessages.scrollTop = elements.chatbotMessages.scrollHeight
}

function sendChatMessage() {
  const message = elements.chatInput.value.trim()
  if (!message) return

  // Add user message
  addMessage(message, "user")
  elements.chatInput.value = ""

  // Simulate bot response
  setTimeout(() => {
    const responses = [
      "I can help you analyze your trading charts. Please upload an image and I'll provide insights.",
      "For technical analysis, I recommend looking at support and resistance levels, trend lines, and volume patterns.",
      "Risk management is crucial in trading. Never risk more than 2% of your account on a single trade.",
      "Market volatility can create opportunities. Make sure to use proper position sizing.",
      "I'm here to help with your trading questions. What specific analysis do you need?",
    ]

    const randomResponse = responses[Math.floor(Math.random() * responses.length)]
    addMessage(randomResponse, "bot")
  }, 1000)
}

function toggleChat() {
  const isVisible = !elements.chatbot.classList.contains("hidden")

  if (isVisible) {
    elements.chatbot.classList.add("hidden")
    elements.chatToggle.classList.remove("active")
  } else {
    elements.chatbot.classList.remove("hidden")
    elements.chatToggle.classList.add("active")
  }
}

// Event listeners setup
function setupEventListeners() {
  // Navigation
  elements.navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault()
      navigateToView(link.dataset.view)
    })
  })

  // Hero CTA
  document.getElementById("hero-cta")?.addEventListener("click", () => {
    navigateToView("platform")
  })

  // CTA button
  document.getElementById("cta-button")?.addEventListener("click", () => {
    navigateToView("platform")
  })

  // Auth buttons
  elements.loginBtn?.addEventListener("click", openModal)
  elements.logoutBtn?.addEventListener("click", logout)
  elements.modalClose?.addEventListener("click", closeModal)
  elements.switchMode?.addEventListener("click", toggleAuthMode)

  // Auth form
  elements.authForm?.addEventListener("submit", (e) => {
    e.preventDefault()
    const email = document.getElementById("email").value
    const password = document.getElementById("password").value
    const name = document.getElementById("name").value

    if (isAuthMode === "signup" && !name) {
      showNotification("Please enter your full name", "error")
      return
    }

    // Simulate sending OTP
    showNotification("Sending verification code...", "info")
    setTimeout(() => {
      showOTPSection(email)
    }, 1500)
  })

  // OTP functionality
  elements.verifyOtpBtn?.addEventListener("click", verifyOTP)
  elements.resendOtpBtn?.addEventListener("click", () => {
    generatedOTP = generateOTP()
    elements.generatedOtpSpan.textContent = generatedOTP
    showNotification("New code sent!", "success")
  })

  elements.copyOtpBtn?.addEventListener("click", () => {
    navigator.clipboard.writeText(generatedOTP).then(() => {
      showNotification("Code copied to clipboard!", "success")
    })
  })

  // OTP input handling
  elements.otpInputs.forEach((input, index) => {
    input.addEventListener("input", (e) => {
      if (e.target.value.length === 1 && index < elements.otpInputs.length - 1) {
        elements.otpInputs[index + 1].focus()
      }
    })

    input.addEventListener("keydown", (e) => {
      if (e.key === "Backspace" && e.target.value === "" && index > 0) {
        elements.otpInputs[index - 1].focus()
      }
    })
  })

  // Chat functionality
  elements.chatToggle?.addEventListener("click", toggleChat)
  elements.chatbotClose?.addEventListener("click", toggleChat)
  elements.sendMessage?.addEventListener("click", sendChatMessage)

  elements.chatInput?.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      sendChatMessage()
    }
  })

  // File upload handling
  document.getElementById("chart-upload")?.addEventListener("change", handleFileUpload)
  document.getElementById("chart-file")?.addEventListener("change", handleFileUpload)

  // Close modal when clicking outside
  elements.loginModal?.addEventListener("click", (e) => {
    if (e.target === elements.loginModal) {
      closeModal()
    }
  })

  // Price alerts
  document.getElementById("add-alert-btn")?.addEventListener("click", () => {
    showNotification("Price alert feature coming soon!", "info")
  })
}

// File upload handler
function handleFileUpload(e) {
  const file = e.target.files[0]
  if (!file) return

  if (!file.type.startsWith("image/")) {
    showNotification("Please select an image file", "error")
    return
  }

  showNotification("Analyzing chart...", "info")

  // Simulate analysis
  setTimeout(() => {
    showNotification("Chart analysis complete! Check the results below.", "success")

    // You can add chart analysis results here
    const analysisResult = document.createElement("div")
    analysisResult.className = "analysis-result"
    analysisResult.innerHTML = `
            <h3>Analysis Results</h3>
            <div class="result-item">
                <strong>Trend:</strong> Bullish
            </div>
            <div class="result-item">
                <strong>Support Level:</strong> $42,500
            </div>
            <div class="result-item">
                <strong>Resistance Level:</strong> $48,000
            </div>
            <div class="result-item">
                <strong>Recommendation:</strong> Consider buying on dips near support
            </div>
        `

    // Add to upload area
    const uploadArea = document.querySelector(".upload-area") || document.querySelector(".upload-content")
    if (uploadArea) {
      uploadArea.appendChild(analysisResult)
    }
  }, 3000)
}

// Add CSS for analysis results
const style = document.createElement("style")
style.textContent = `
    .analysis-result {
        background: var(--muted);
        border-radius: var(--radius);
        padding: 1.5rem;
        margin-top: 2rem;
    }
    
    .analysis-result h3 {
        margin-bottom: 1rem;
        color: var(--primary);
    }
    
    .result-item {
        padding: 0.5rem 0;
        border-bottom: 1px solid var(--border);
    }
    
    .result-item:last-child {
        border-bottom: none;
    }
    
    .notification {
        animation: slideIn 0.3s ease;
    }
    
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`
document.head.appendChild(style)

// Export functions for global access
window.TradeVision = {
  navigateToView,
  openModal,
  closeModal,
  toggleChat,
  logout,
  showNotification,
}
