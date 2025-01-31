const defaultSemesters = [
  {
    id: 1,
    courses: [
      { name: 'THS101 - Basic physics', credits: '2', grade: '' },
      { name: 'THS102 - Mathematics', credits: '2', grade: '' },
      { name: 'THS103 - Introduction to electrical engineering', credits: '3', grade: '' },
      { name: 'THS104 - Mechanics', credits: '2', grade: '' },
      { name: 'UN101 - Academic reading & writing (1)', credits: '2', grade: '' },
      { name: 'UN102 - Computer skills', credits: '2', grade: '' },
      { name: 'UN103 - Critical thinking', credits: '2', grade: '' }
    ]
  },
  {
    id: 2,
    courses: [
      { name: 'THS1110 - Professional ethics', credits: '1', grade: '' },
      { name: 'THS115 - Electronic circuits & devices', credits: '3', grade: '' },
      { name: 'THS116 - General anatomy & histology for technologists', credits: '3', grade: '' },
      { name: 'THS117 - General physiology for technologists', credits: '2', grade: '' },
      { name: 'THS118 - General Microbiology', credits: '2', grade: '' },
      { name: 'THS119 - General Chemistry', credits: '2', grade: '' },
      { name: 'UN114 - Academic reading & writing (2)', credits: '2', grade: '' }
    ]
  },
  {
    id: 3,
    courses: [
      { name: 'THS2010 - Mechatronic engineering', credits: '2', grade: '' },
      { name: 'TL201 - Biochemistry for technologists', credits: '4', grade: '' },
      { name: 'TL202 - Parasitology for technologists', credits: '2', grade: '' },
      { name: 'TL203 - Bacteriology for technologists', credits: '4', grade: '' },
      { name: 'TL204 - Histology for laboratory for technologists', credits: '2', grade: '' },
      { name: 'UN5 - Foundation of digital technology', credits: '2', grade: '' },
      { name: 'UN6 - English language 3', credits: '2', grade: '' }
    ]
  }
];

let semesters = [];

function createCourseElement(courseName = '', credits = '', gradeValue = '', isEditable = true) {
  const courseDiv = document.createElement('div');
  courseDiv.className = 'course';
  
  const nameInput = document.createElement('input');
  nameInput.type = 'text';
  nameInput.className = 'course-name';
  nameInput.placeholder = 'Course Name';
  nameInput.value = courseName;
  nameInput.disabled = !isEditable;
  
  const creditsInput = document.createElement('input');
  creditsInput.type = 'number';
  creditsInput.className = 'credits-input';
  creditsInput.placeholder = 'Credits';
  creditsInput.min = '1';
  creditsInput.value = credits;
  creditsInput.disabled = !isEditable;
  
  const gradeInput = document.createElement('input');
  gradeInput.type = 'number';
  gradeInput.className = 'grade-input';
  gradeInput.placeholder = 'Percentage';
  gradeInput.min = '0';
  gradeInput.max = '100';
  gradeInput.value = gradeValue;
  
  const removeButton = document.createElement('button');
  removeButton.className = 'remove-btn';
  removeButton.textContent = 'Remove';
  removeButton.onclick = () => {
    courseDiv.remove();
    saveSemesters();
  };
  
  const inputs = [nameInput, creditsInput, gradeInput];
  inputs.forEach(input => {
    input.addEventListener('change', saveSemesters);
  });
  
  courseDiv.append(nameInput, creditsInput, gradeInput, removeButton);
  return courseDiv;
}

function createSemesterElement(semesterData) {
  const semesterDiv = document.createElement('div');
  semesterDiv.className = 'semester';
  semesterDiv.dataset.semesterId = semesterData.id;
  
  const header = document.createElement('div');
  header.className = 'semester-header';
  
  const title = document.createElement('h2');
  title.textContent = `Semester ${semesterData.id}`;
  
  const addCourseBtn = document.createElement('button');
  addCourseBtn.className = 'add-course-btn';
  addCourseBtn.textContent = 'Add Course';
  addCourseBtn.onclick = () => addCourse(semesterDiv);
  
  const removeSemesterBtn = document.createElement('button');
  removeSemesterBtn.className = 'remove-semester-btn';
  removeSemesterBtn.textContent = 'Remove Semester';
  removeSemesterBtn.onclick = () => {
    semesterDiv.remove();
    updateSemesterNumbers();
    saveSemesters();
    calculateCGPA();
  };
  
  const coursesContainer = document.createElement('div');
  coursesContainer.className = 'courses';
  
  const gpaDisplay = document.createElement('div');
  gpaDisplay.className = 'semester-gpa';
  
  header.append(title, addCourseBtn, removeSemesterBtn);
  semesterDiv.append(header, coursesContainer, gpaDisplay);
  
  if (semesterData.courses) {
    semesterData.courses.forEach(course => {
      coursesContainer.appendChild(createCourseElement(course.name, course.credits, course.grade, false));
    });
  }
  
  return semesterDiv;
}

function addCourse(semesterDiv) {
  const coursesContainer = semesterDiv.querySelector('.courses');
  coursesContainer.appendChild(createCourseElement());
  saveSemesters();
}

function addSemester() {
  const semestersContainer = document.getElementById('semesters');
  const nextSemesterId = semestersContainer.children.length + 1;
  const semesterDiv = createSemesterElement({ id: nextSemesterId, courses: [] });
  semestersContainer.appendChild(semesterDiv);
  addCourse(semesterDiv);
  saveSemesters();
}

function updateSemesterNumbers() {
  document.querySelectorAll('.semester').forEach((semester, index) => {
    const newId = index + 1;
    semester.dataset.semesterId = newId;
    semester.querySelector('h2').textContent = `Semester ${newId}`;
  });
}

function calculateSemesterGPA(semesterDiv) {
  let totalPoints = 0;
  let totalCredits = 0;
  
  semesterDiv.querySelectorAll('.course').forEach(course => {
    const credits = parseFloat(course.querySelector('.credits-input').value);
    const grade = parseFloat(course.querySelector('.grade-input').value);
    
    if (!isNaN(credits) && !isNaN(grade)) {
      totalPoints += credits * (grade / 100 * 4);
      totalCredits += credits;
    }
  });
  
  const gpa = totalCredits > 0 ? totalPoints / totalCredits : 0;
  semesterDiv.querySelector('.semester-gpa').textContent = `Semester GPA: ${gpa.toFixed(2)}`;
  return { points: totalPoints, credits: totalCredits };
}

function calculateCGPA() {
  let totalPoints = 0;
  let totalCredits = 0;
  
  document.querySelectorAll('.semester').forEach(semester => {
    const semesterGPA = calculateSemesterGPA(semester);
    totalPoints += semesterGPA.points;
    totalCredits += semesterGPA.credits;
  });
  
  const cgpa = totalCredits > 0 ? totalPoints / totalCredits : 0;
  const cgpaDiv = document.getElementById('cgpa');
  cgpaDiv.textContent = cgpa.toFixed(2);
  cgpaDiv.className = `cgpa ${getGPAColor(cgpa)}`;
}

function getGPAColor(gpa) {
  if (gpa >= 3.5) return 'excellent';
  if (gpa >= 3.0) return 'good';
  if (gpa >= 2.5) return 'average';
  return 'poor';
}

function saveSemesters() {
  const savedData = [];
  document.querySelectorAll('.semester').forEach((semester, index) => {
    const courses = [];
    semester.querySelectorAll('.course').forEach(course => {
      courses.push({
        name: course.querySelector('.course-name').value,
        credits: course.querySelector('.credits-input').value,
        grade: course.querySelector('.grade-input').value
      });
    });
    savedData.push({
      id: index + 1,
      courses: courses
    });
  });
  localStorage.setItem('gpa-semesters', JSON.stringify(savedData));
  calculateCGPA();
}

function loadSemesters() {
  const savedData = localStorage.getItem('gpa-semesters');
  const semestersContainer = document.getElementById('semesters');
  semestersContainer.innerHTML = '';
  
  if (savedData) {
    const semesters = JSON.parse(savedData);
    if (semesters.length > 0) {
      semesters.forEach(semester => {
        const semesterDiv = createSemesterElement(semester);
        semestersContainer.appendChild(semesterDiv);
      });
    } else {
      loadDefaultSemesters();
    }
  } else {
    loadDefaultSemesters();
  }
  calculateCGPA();
}

function loadDefaultSemesters() {
  const semestersContainer = document.getElementById('semesters');
  defaultSemesters.forEach(semester => {
    const semesterDiv = createSemesterElement(semester);
    semestersContainer.appendChild(semesterDiv);
  });
  saveSemesters();
}

window.addEventListener('load', loadSemesters);