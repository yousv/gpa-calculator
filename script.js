const courseOptions = [
  { name: 'Bacteriology', credits: 4 },
  { name: 'Biochemistry', credits: 4 },
  { name: 'Parasitology', credits: 2 },
  { name: 'Mechatronics', credits: 2 },
  { name: 'English', credits: 2 },
  { name: 'Histology', credits: 2 },
  { name: 'Foundation Technology', credits: 2 },
];

const gradeOptions = [
  { label: 'A+', value: 4.0 },
  { label: 'A', value: 3.8 },
  { label: 'A-', value: 3.6 },
  { label: 'B+', value: 3.4 },
  { label: 'B', value: 3.2 },
  { label: 'B-', value: 3.0 },
  { label: 'C+', value: 2.8 },
  { label: 'C', value: 2.6 },
  { label: 'C-', value: 2.4 },
  { label: 'D+', value: 2.2 },
  { label: 'D', value: 2.0 },
  { label: 'F', value: 0.0 },
];

function getSelectedCourses() {
  const selectedCourses = new Set();
  document.querySelectorAll('.course-select').forEach(select => {
      if (select.value !== '') {
          selectedCourses.add(select.value);
      }
  });
  return selectedCourses;
}

function updateAvailableCourses() {
  const selectedCourses = getSelectedCourses();
  
  document.querySelectorAll('.course-select').forEach(select => {
      const currentValue = select.value;
      
      // Store current selection
      const selectedOption = select.value;
      
      // Clear and rebuild options
      select.innerHTML = '<option value="">Select Course</option>';
      
      courseOptions.forEach((course, index) => {
          // Show course if it's either not selected anywhere else, or it's the current selection for this dropdown
          if (!selectedCourses.has(index.toString()) || index.toString() === currentValue) {
              const option = document.createElement('option');
              option.value = index;
              option.text = `${course.name} (${course.credits} credits)`;
              option.selected = index.toString() === selectedOption;
              select.appendChild(option);
          }
      });
  });
}

function createCourseElement(courseIndex = '', gradeValue = '') {
  const courseDiv = document.createElement('div');
  courseDiv.className = 'course';
  
  const courseSelect = document.createElement('select');
  courseSelect.className = 'course-select';
  courseSelect.innerHTML = '<option value="">Select Course</option>';
  
  // Add only unselected courses and the previously selected course
  const selectedCourses = getSelectedCourses();
  courseOptions.forEach((course, index) => {
      if (!selectedCourses.has(index.toString()) || index.toString() === courseIndex) {
          const option = document.createElement('option');
          option.value = index;
          option.text = `${course.name} (${course.credits} credits)`;
          option.selected = index.toString() === courseIndex;
          courseSelect.appendChild(option);
      }
  });

  const gradeSelect = document.createElement('select');
  gradeSelect.className = 'grade-select';
  gradeSelect.innerHTML = `
      <option value="">Select Grade</option>
      ${gradeOptions.map(grade => `
          <option value="${grade.value}" ${gradeValue === grade.value.toString() ? 'selected' : ''}>
              ${grade.label}
          </option>
      `).join('')}
  `;

  const removeButton = document.createElement('button');
  removeButton.className = 'remove-btn';
  removeButton.textContent = 'Remove';
  removeButton.onclick = () => {
      courseDiv.remove();
      updateAvailableCourses();
      saveCourses();
  };

  // Add event listeners for saving data and updating available courses
  courseSelect.addEventListener('change', () => {
      updateAvailableCourses();
      saveCourses();
  });
  gradeSelect.addEventListener('change', saveCourses);

  courseDiv.appendChild(courseSelect);
  courseDiv.appendChild(gradeSelect);
  courseDiv.appendChild(removeButton);

  return courseDiv;
}

function addCourse(courseIndex = '', gradeValue = '') {
  const coursesContainer = document.getElementById('courses');
  coursesContainer.appendChild(createCourseElement(courseIndex, gradeValue));
  updateAvailableCourses();
  document.getElementById('result').style.display = 'none';
  document.getElementById('error').style.display = 'none';
}

function getGPAColor(gpa) {
  if (gpa >= 3.5) return 'excellent';
  if (gpa >= 3.0) return 'good';
  if (gpa >= 2.5) return 'average';
  return 'poor';
}

function saveCourses() {
  const courses = [];
  document.querySelectorAll('.course').forEach(course => {
      const courseIndex = course.querySelector('.course-select').value;
      const gradeValue = course.querySelector('.grade-select').value;
      if (courseIndex || gradeValue) {
          courses.push({ courseIndex, gradeValue });
      }
  });
  localStorage.setItem('gpa-courses', JSON.stringify(courses));
}

function loadCourses() {
  const savedCourses = localStorage.getItem('gpa-courses');
  if (savedCourses) {
      const courses = JSON.parse(savedCourses);
      if (courses.length > 0) {
          courses.forEach(course => {
              addCourse(course.courseIndex, course.gradeValue);
          });
      } else {
          addCourse(); // Add one empty course if no saved courses
      }
  } else {
      addCourse(); // Add one empty course if no saved data
  }
}

function calculateGPA() {
  const courses = document.querySelectorAll('.course');
  let totalGradePoints = 0;
  let totalCredits = 0;
  let hasError = false;

  courses.forEach(course => {
      const courseIndex = course.querySelector('.course-select').value;
      const gradeValue = course.querySelector('.grade-select').value;

      if (courseIndex === '' || gradeValue === '') {
          hasError = true;
          return;
      }

      const credits = courseOptions[parseInt(courseIndex)].credits;
      totalGradePoints += parseFloat(gradeValue) * credits;
      totalCredits += credits;
  });

  const errorDiv = document.getElementById('error');
  const resultDiv = document.getElementById('result');
  const gpaDiv = document.getElementById('gpa');

  if (hasError) {
      errorDiv.textContent = 'Please complete all course selections';
      errorDiv.style.display = 'block';
      resultDiv.style.display = 'none';
      return;
  }

  if (totalCredits === 0) {
      errorDiv.textContent = 'Please add at least one course';
      errorDiv.style.display = 'block';
      resultDiv.style.display = 'none';
      return;
  }

  const gpa = totalGradePoints / totalCredits;
  errorDiv.style.display = 'none';
  resultDiv.style.display = 'block';
  gpaDiv.textContent = gpa.toFixed(2);
  gpaDiv.className = `gpa ${getGPAColor(gpa)}`;

  saveCourses();
}

// Load saved courses when page loads
window.addEventListener('load', loadCourses);
