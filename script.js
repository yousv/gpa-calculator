class GPACalculator {
  constructor() {
    this.defaultSemesters = [
      {
        id: 1,
        courses: [
          { name: "THS101 - Basic physics", credits: "2", grade: "" },
          { name: "THS102 - Mathematics", credits: "2", grade: "" },
          { name: "THS103 - Introduction to electrical engineering", credits: "3", grade: "" },
          { name: "THS104 - Mechanics", credits: "2", grade: "" },
          { name: "UN101 - Academic reading & writing (1)", credits: "2", grade: "" },
          { name: "UN102 - Computer skills", credits: "2", grade: "" },
          { name: "UN103 - Critical thinking", credits: "2", grade: "" },
        ],
      },
      {
        id: 2,
        courses: [
          { name: "THS1110 - Professional ethics", credits: "1", grade: "" },
          { name: "THS115 - Electronic circuits & devices", credits: "3", grade: "" },
          { name: "THS116 - General anatomy & histology for technologists", credits: "3", grade: "" },
          { name: "THS117 - General physiology for technologists", credits: "2", grade: "" },
          { name: "THS118 - General Microbiology", credits: "2", grade: "" },
          { name: "THS119 - General Chemistry", credits: "2", grade: "" },
          { name: "UN114 - Academic reading & writing (2)", credits: "2", grade: "" },
        ],
      },
      {
        id: 3,
        courses: [
          { name: "THS2010 - Mechatronic engineering", credits: "2", grade: "" },
          { name: "TL201 - Biochemistry for technologists", credits: "4", grade: "" },
          { name: "TL202 - Parasitology for technologists", credits: "2", grade: "" },
          { name: "TL203 - Bacteriology for technologists", credits: "4", grade: "" },
          { name: "TL204 - Histology for laboratory for technologists", credits: "2", grade: "" },
          { name: "UN5 - Foundation of digital technology", credits: "2", grade: "" },
          { name: "UN6 - English language 3", credits: "2", grade: "" },
        ],
      },
      {
        id: 4,
        courses: [
          { name: "TL215 - Molecular biology for technologists", credits: "4", grade: "" },
          { name: "TL216 - Hematology for technologists (1)", credits: "4", grade: "" },
          { name: "TL218 - General biology for technologists", credits: "3", grade: "" },
          { name: "TL217 - Systematic Physiology for technologists", credits: "4", grade: "" },
          { name: "ETHS15 - Basic life support", credits: "1", grade: "" },
        ],
      },
    ]

    this.init()
  }

  init() {
    this.renderSemesters()
    document.getElementById("toggle-all").addEventListener("click", () => this.toggleAll())
    document.getElementById("reset-grades").addEventListener("click", () => this.resetGrades())
    this.calculateCGPA()
    this.addStaggeredAnimation()
    this.updateToggleButton()
  }

  createCourseElement(courseName, credits, gradeValue, semesterIdx, courseIdx) {
    const courseDiv = document.createElement("div")
    courseDiv.className = "course"

    const courseInfoDiv = document.createElement("div")
    courseInfoDiv.className = "course-info"

    const nameInput = document.createElement("input")
    nameInput.type = "text"
    nameInput.className = "course-name"
    nameInput.value = courseName
    nameInput.disabled = true
    nameInput.setAttribute("aria-label", `Course name: ${courseName}`)

    const creditsSpan = document.createElement("span")
    creditsSpan.className = "course-credits"
    creditsSpan.textContent = `${credits} credits`

    courseInfoDiv.append(nameInput, creditsSpan)

    const gradeInput = document.createElement("input")
    gradeInput.type = "number"
    gradeInput.className = "grade-input"
    gradeInput.placeholder = "Grade %"
    gradeInput.min = "0"
    gradeInput.max = "100"
    gradeInput.value = gradeValue
    gradeInput.setAttribute("aria-label", `Grade for ${courseName}`)
    gradeInput.setAttribute("inputmode", "numeric")
    gradeInput.setAttribute("pattern", "[0-9]*")
    gradeInput.addEventListener("wheel", (e) => e.preventDefault())
    gradeInput.addEventListener("keydown", (e) => {
      if (["ArrowUp", "ArrowDown"].includes(e.key)) e.preventDefault()
    })

    let timeout
    gradeInput.addEventListener("input", (e) => {
      clearTimeout(timeout)
      timeout = setTimeout(() => {
        this.handleGradeInput(e.target)
      }, 300)
    })

    gradeInput.dataset.semesterIdx = semesterIdx
    gradeInput.dataset.courseIdx = courseIdx
    gradeInput.dataset.credits = credits

    courseDiv.append(courseInfoDiv, gradeInput)
    return courseDiv
  }

  createSemesterElement(semesterData, semesterIdx, collapsed = true, grades = null) {
    const semesterDiv = document.createElement("div")
    semesterDiv.className = "semester"
    if (collapsed) semesterDiv.classList.add("collapsed")
    semesterDiv.dataset.semesterId = semesterData.id

    const header = document.createElement("button")
    header.className = "semester-header"
    header.setAttribute("aria-expanded", !collapsed)
    header.setAttribute("aria-controls", `semester-${semesterData.id}-courses`)

    const title = document.createElement("h2")
    title.textContent = `Semester ${semesterData.id}`

    const chevron = document.createElement("div")
    chevron.className = "chevron"
    chevron.innerHTML = "▼"

    header.append(title, chevron)
    header.addEventListener("click", () => {
      this.toggleSemester(semesterDiv, header)
      setTimeout(() => this.updateToggleButton(), 100)
    })

    const coursesContainer = document.createElement("div")
    coursesContainer.className = "courses"
    coursesContainer.id = `semester-${semesterData.id}-courses`

    semesterData.courses.forEach((course, courseIdx) => {
      const gradeValue =
        grades && grades[semesterIdx] && grades[semesterIdx][courseIdx] !== undefined
          ? grades[semesterIdx][courseIdx]
          : course.grade
      coursesContainer.appendChild(
        this.createCourseElement(course.name, course.credits, gradeValue, semesterIdx, courseIdx),
      )
    })

    const gpaDisplay = document.createElement("div")
    gpaDisplay.className = "semester-gpa"

    semesterDiv.append(header, coursesContainer, gpaDisplay)
    return semesterDiv
  }

  toggleSemester(semesterDiv, header) {
    const isCollapsed = semesterDiv.classList.contains("collapsed")
    semesterDiv.classList.toggle("collapsed")
    header.setAttribute("aria-expanded", isCollapsed)

    if (!isCollapsed) {
      semesterDiv.style.transform = "scale(0.98)"
      setTimeout(() => {
        semesterDiv.style.transform = ""
      }, 150)
    }
  }

  toggleAll() {
    const semesters = document.querySelectorAll(".semester")
    const collapsedCount = document.querySelectorAll(".semester.collapsed").length
    const shouldExpand = collapsedCount > semesters.length / 2

    semesters.forEach((semester, index) => {
      setTimeout(() => {
        const header = semester.querySelector(".semester-header")
        if (shouldExpand) {
          semester.classList.remove("collapsed")
          header.setAttribute("aria-expanded", "true")
        } else {
          semester.classList.add("collapsed")
          header.setAttribute("aria-expanded", "false")
        }
      }, index * 100)
    })

    setTimeout(() => this.updateToggleButton(), semesters.length * 100 + 200)
  }

  updateToggleButton() {
    const toggleButton = document.getElementById("toggle-all")
    const buttonText = toggleButton.querySelector(".button-text")
    const semesters = document.querySelectorAll(".semester")
    const collapsedCount = document.querySelectorAll(".semester.collapsed").length
    const shouldExpand = collapsedCount > semesters.length / 2

    if (shouldExpand) {
      buttonText.textContent = "Expand All"
      toggleButton.classList.remove("expanded")
      toggleButton.setAttribute("aria-label", "Expand all semesters")
    } else {
      buttonText.textContent = "Collapse All"
      toggleButton.classList.add("expanded")
      toggleButton.setAttribute("aria-label", "Collapse all semesters")
    }
  }

  resetGrades() {
    if (confirm("are you sure you want to reset all grades?")) {
      document.querySelectorAll(".grade-input").forEach((input) => {
        input.value = ""
      })
      localStorage.removeItem("gpa-grades")
      this.calculateCGPA()

      const cgpaElement = document.getElementById("cgpa")
      cgpaElement.style.transform = "scale(1.1)"
      setTimeout(() => {
        cgpaElement.style.transform = ""
      }, 200)
    }
  }

  handleGradeInput(input) {
    const value = Number.parseFloat(input.value)
    if (value > 100) {
      input.value = 100
    } else if (value < 0) {
      input.value = 0
    }

    this.saveGradesToStorage()
    this.calculateCGPA()

    input.style.transform = "scale(1.05)"
    setTimeout(() => {
      input.style.transform = ""
    }, 150)
  }

  calculateSemesterGPA(semesterDiv) {
    let totalPoints = 0
    let totalCredits = 0

    semesterDiv.querySelectorAll(".course").forEach((course) => {
      const gradeInput = course.querySelector(".grade-input")
      const credits = Number.parseFloat(gradeInput.dataset.credits)
      const grade = Number.parseFloat(gradeInput.value)

      if (!isNaN(credits) && !isNaN(grade)) {
        totalPoints += credits * ((grade / 100) * 4)
        totalCredits += credits
      }
    })

    const gpa = totalCredits > 0 ? totalPoints / totalCredits : 0
    const gpaDisplay = semesterDiv.querySelector(".semester-gpa")
    gpaDisplay.textContent = `Semester GPA: ${gpa.toFixed(2)}`
    gpaDisplay.className = `semester-gpa ${this.getGPAColor(gpa)}`

    return { points: totalPoints, credits: totalCredits }
  }

  calculateCGPA() {
    let totalPoints = 0
    let totalCredits = 0

    document.querySelectorAll(".semester").forEach((semester) => {
      const semesterGPA = this.calculateSemesterGPA(semester)
      totalPoints += semesterGPA.points
      totalCredits += semesterGPA.credits
    })

    const cgpa = totalCredits > 0 ? totalPoints / totalCredits : 0
    const cgpaDiv = document.getElementById("cgpa")

    const currentValue = Number.parseFloat(cgpaDiv.textContent) || 0
    this.animateValue(cgpaDiv, currentValue, cgpa, 500)

    cgpaDiv.className = `cgpa ${this.getGPAColor(cgpa)}`
  }

  animateValue(element, start, end, duration) {
    const startTime = performance.now()
    const animate = (currentTime) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)

      const easeOutCubic = 1 - Math.pow(1 - progress, 3)
      const current = start + (end - start) * easeOutCubic

      element.textContent = current.toFixed(2)

      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }
    requestAnimationFrame(animate)
  }

  getGPAColor(gpa) {
    if (gpa >= 3.5) return "excellent"
    if (gpa >= 3.0) return "good"
    if (gpa >= 2.5) return "average"
    return "poor"
  }

  saveGradesToStorage() {
    const grades = []
    document.querySelectorAll(".semester").forEach((semesterDiv) => {
      const semesterGrades = []
      semesterDiv.querySelectorAll(".course").forEach((courseDiv) => {
        const gradeInput = courseDiv.querySelector(".grade-input")
        semesterGrades.push(gradeInput.value)
      })
      grades.push(semesterGrades)
    })
    localStorage.setItem("gpa-grades", JSON.stringify(grades))
  }

  loadGradesFromStorage() {
    try {
      const grades = JSON.parse(localStorage.getItem("gpa-grades"))
      if (Array.isArray(grades)) return grades
    } catch {}
    return null
  }

  renderSemesters() {
    const semestersContainer = document.getElementById("semesters")
    semestersContainer.innerHTML = ""
    const grades = this.loadGradesFromStorage()

    this.defaultSemesters.forEach((semester, semesterIdx) => {
      const semesterDiv = this.createSemesterElement(semester, semesterIdx, true, grades)
      semestersContainer.appendChild(semesterDiv)
    })
  }

  addStaggeredAnimation() {
    const semesters = document.querySelectorAll(".semester")
    semesters.forEach((semester, index) => {
      semester.style.animationDelay = `${index * 0.1}s`
    })
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new GPACalculator()
})