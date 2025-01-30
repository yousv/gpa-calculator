document.getElementById('add-course').addEventListener('click', () => {
    const coursesDiv = document.getElementById('courses');
    const newCourse = document.createElement('div');
    newCourse.className = 'course';
    newCourse.innerHTML = `
      <select class="grade">
        <option value="4.0">A+</option>
        <option value="4.0">A</option>
        <option value="3.7">A-</option>
        <option value="3.3">B+</option>
        <option value="3.0">B</option>
        <option value="2.7">B-</option>
        <option value="2.3">C+</option>
        <option value="2.0">C</option>
        <option value="1.7">C-</option>
        <option value="1.3">D+</option>
        <option value="1.0">D</option>
        <option value="0.0">F</option>
      </select>
      <input type="number" class="credits" placeholder="Credit Hours" min="0">
      <button class="remove-course">Remove</button>
    `;
    coursesDiv.appendChild(newCourse);
  
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
  
      if (!isNaN(credits) && credits >= 0) {
        totalGradePoints += grade * credits;
        totalCredits += credits;
      }
    });
  
    if (totalCredits === 0) {
      document.getElementById('result').textContent = 'Please enter valid course data.';
    } else {
      const gpa = totalGradePoints / totalCredits;
      const percentage = (gpa / 4.0) * 100;
      document.getElementById('result').innerHTML = `
        Your GPA is: <strong>${gpa.toFixed(2)}</strong><br>
        Percentage: <strong>${percentage.toFixed(2)}%</strong>
      `;
    }
  });