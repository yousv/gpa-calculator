document.getElementById('add-course').addEventListener('click', addCourse);

document.getElementById('calculate-gpa').addEventListener('click', () => {
  const courses = document.querySelectorAll('.course');
  let totalGradePoints = 0;
  let totalCredits = 0;

  courses.forEach(course => {
    const grade = course.querySelector('.grade').value;
    const credits = parseFloat(course.querySelector('.credits').value);

    if (!isNaN(credits) && credits >= 0 && grade) {
      totalGradePoints += parseFloat(grade) * credits;
      totalCredits += credits;
    }
  });

  if (totalCredits === 0) {
    document.getElementById('result').textContent = 'Please enter valid course data.';
  } else {
    const gpa = totalGradePoints / totalCredits;
    document.getElementById('result').textContent = `Your GPA is: ${gpa.toFixed(2)}`;
  }
});

function addCourse(grade = '', credits = '') {
  const coursesDiv = document.getElementById('courses');
  const newCourse = document.createElement('div');
  newCourse.className = 'course';
  newCourse.innerHTML = `
    <select class="credits">
      <option value="">Select Course</option>
      <option value="4">Bacteriology (4)</option>
      <option value="4">Biochemistry (4)</option>
      <option value="2">Parasitology (2)</option>
      <option value="2">Mechatronics (2)</option>
      <option value="2">English (2)</option>
      <option value="2">Histology (2)</option>
      <option value="2">Foundation Technology (2)</option>
    </select>
    <select class="grade">
      <option value="">Select Grade</option>
      <option value="4.0">A+</option>
      <option value="3.8">A</option>
      <option value="3.6">A-</option>
      <option value="3.4">B+</option>
      <option value="3.2">B</option>
      <option value="3.0">B-</option>
      <option value="2.8">C+</option>
      <option value="2.6">C</option>
      <option value="2.4">C-</option>
      <option value="2.2">D+</option>
      <option value="2.0">D</option>
      <option value="0.0">F</option>
    </select>
    <button class="remove-course">Remove</button>
  `;
  coursesDiv.appendChild(newCourse);

  if (grade) newCourse.querySelector('.grade').value = grade;
  if (credits) newCourse.querySelector('.credits').value = credits;

  newCourse.querySelector('.remove-course').addEventListener('click', () => {
    coursesDiv.removeChild(newCourse);
    saveData();
  });

  newCourse.querySelector('.grade').addEventListener('change', saveData);
  newCourse.querySelector('.credits').addEventListener('change', saveData);
}

function saveData() {
  const courses = [];
  document.querySelectorAll('.course').forEach(course => {
    const grade = course.querySelector('.grade').value;
    const credits = course.querySelector('.credits').value;
    courses.push({ grade, credits });
  });
  localStorage.setItem('courses', JSON.stringify(courses));
}

function loadData() {
  const courses = JSON.parse(localStorage.getItem('courses')) || [];
  courses.forEach(course => {
    addCourse(course.grade, course.credits);
  });
}

window.addEventListener('load', loadData);
