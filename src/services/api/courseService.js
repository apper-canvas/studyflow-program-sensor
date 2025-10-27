import coursesData from "../mockData/courses.json";

let courses = [...coursesData];

const delay = () => new Promise(resolve => setTimeout(resolve, 300));

export const courseService = {
  async getAll() {
    await delay();
    return [...courses];
  },

  async getById(id) {
    await delay();
    const course = courses.find(c => c.Id === parseInt(id));
    return course ? { ...course } : null;
  },

  async create(courseData) {
    await delay();
    const maxId = Math.max(...courses.map(c => c.Id), 0);
    const newCourse = {
      Id: maxId + 1,
      ...courseData,
      currentGrade: 0,
      gradeWeight: courseData.gradeWeight || {}
    };
    courses.push(newCourse);
    return { ...newCourse };
  },

  async update(id, courseData) {
    await delay();
    const index = courses.findIndex(c => c.Id === parseInt(id));
    if (index !== -1) {
      courses[index] = { ...courses[index], ...courseData };
      return { ...courses[index] };
    }
    return null;
  },

  async delete(id) {
    await delay();
    const index = courses.findIndex(c => c.Id === parseInt(id));
    if (index !== -1) {
      const deleted = courses.splice(index, 1)[0];
      return { ...deleted };
    }
    return null;
  }
};