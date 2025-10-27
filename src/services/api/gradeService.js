import gradeCategoriesData from "../mockData/gradeCategories.json";

let gradeCategories = [...gradeCategoriesData];

const delay = () => new Promise(resolve => setTimeout(resolve, 250));

export const gradeService = {
  async getCategoriesByCourse(courseId) {
    await delay();
    return gradeCategories.filter(gc => gc.courseId === courseId.toString()).map(gc => ({ ...gc }));
  },

  async calculateCourseGrade(courseId, assignments) {
    await delay();
    const categories = await this.getCategoriesByCourse(courseId);
    let totalWeightedScore = 0;
    let totalWeight = 0;

    categories.forEach(category => {
      const categoryAssignments = assignments.filter(a => 
        a.courseId === courseId.toString() && 
        a.category === category.name && 
        a.score !== null
      );

      if (categoryAssignments.length > 0) {
        const categoryAverage = categoryAssignments.reduce((sum, a) => 
          sum + (a.score / a.maxScore * 100), 0
        ) / categoryAssignments.length;

        totalWeightedScore += categoryAverage * (category.weight / 100);
        totalWeight += category.weight;
      }
    });

    return totalWeight > 0 ? totalWeightedScore : 0;
  },

  async calculateOverallGPA(courses, assignments) {
    await delay();
    let totalGradePoints = 0;
    let totalCredits = 0;

    for (const course of courses) {
      const courseGrade = await this.calculateCourseGrade(course.Id.toString(), assignments);
      if (courseGrade > 0) {
        const gradePoint = this.gradeToGPA(courseGrade);
        totalGradePoints += gradePoint * course.credits;
        totalCredits += course.credits;
      }
    }

    return totalCredits > 0 ? totalGradePoints / totalCredits : 0;
  },

  gradeToGPA(percentage) {
    if (percentage >= 97) return 4.0;
    if (percentage >= 93) return 3.7;
    if (percentage >= 90) return 3.3;
    if (percentage >= 87) return 3.0;
    if (percentage >= 83) return 2.7;
    if (percentage >= 80) return 2.3;
    if (percentage >= 77) return 2.0;
    if (percentage >= 73) return 1.7;
    if (percentage >= 70) return 1.3;
    if (percentage >= 67) return 1.0;
    if (percentage >= 65) return 0.7;
    return 0.0;
  },

  getLetterGrade(percentage) {
    if (percentage >= 97) return "A+";
    if (percentage >= 93) return "A";
    if (percentage >= 90) return "A-";
    if (percentage >= 87) return "B+";
    if (percentage >= 83) return "B";
    if (percentage >= 80) return "B-";
    if (percentage >= 77) return "C+";
    if (percentage >= 73) return "C";
    if (percentage >= 70) return "C-";
    if (percentage >= 67) return "D+";
    if (percentage >= 65) return "D";
    return "F";
  }
};