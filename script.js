document.getElementById('add-course').addEventListener('click', addCourse);

document.getElementById('calculate-gpa').addEventListener('click', () => {
  const courses = document.querySelectorAll('.course');
  let totalGradePoints = 0;
  let totalCredits = 0;

  courses.forEach(course => {
    const grade = course.querySelector('.grade').value;
    const credits = parseFloat(course.querySelector('.credits').value);

    if (!isNaN(credits) && credits >= 0) {
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

function addCourse() {
  const coursesDiv = document.getElementById('courses');
  const newCourse = document.createElement('div');
  newCourse.className = 'course';
  newCourse.innerHTML = `
    <select class="grade">
      <option value="4.0">A+</option>
      <option value="3.9">A</option>
      <option value="3.7">A-</option>
      <option value="3.5">B+</option>
      <option value="3.1">B</option>
      <option value="2.7">B-</option>
      <option value="2.5">C+</option>
      <option value="2.3">C</option>
      <option value="2.0">C-</option>
      <option value="1.8">D+</option>
      <option value="1.6">D</option>
      <option value="1.3">D-</option>
      <option value="0.0">F</option>
    </select>
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
    <button class="remove-course">Remove</button>
  `;
  coursesDiv.appendChild(newCourse);

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
    addCourse();
    const lastCourse = document.querySelector('.course:last-child');
    lastCourse.querySelector('.grade').value = course.grade;
    lastCourse.querySelector('.credits').value = course.credits;
  });
}

loadData();
