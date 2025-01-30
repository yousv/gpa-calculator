document.getElementById('add-course').addEventListener('click', () => {
  const coursesDiv = document.getElementById('courses');
  const newCourse = document.createElement('div');
  newCourse.className = 'course';
  newCourse.innerHTML = `
    <select class="grade">
      <option value="4.0">A</option>
      <option value="3.0">B</option>
      <option value="2.0">C</option>
      <option value="1.0">D</option>
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

  // Add event listener for remove button
  newCourse.querySelector('.remove-course').addEventListener('click', () => {
    coursesDiv.removeChild(newCourse);
  });
});

document.getElementById('calculate-gpa').addEventListener('click', () => {
  const courses = document.querySelectorAll('.course');
  let totalGradePoints = 0;
  let totalCredits = 0;

  courses.forEach(course => {
    const grade = parseFloat(course.querySelector('.grade').value);
    const credits = parseFloat(course.querySelector('.credits').value);

    if (!isNaN(credits) && credits > 0) {
      totalGradePoints += grade * credits;
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