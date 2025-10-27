import assignmentsData from "../mockData/assignments.json";

let assignments = [...assignmentsData];

const delay = () => new Promise(resolve => setTimeout(resolve, 200));

export const assignmentService = {
  async getAll() {
    await delay();
    return [...assignments];
  },

  async getById(id) {
    await delay();
    const assignment = assignments.find(a => a.Id === parseInt(id));
    return assignment ? { ...assignment } : null;
  },

  async getByCourse(courseId) {
    await delay();
    return assignments.filter(a => a.courseId === courseId.toString()).map(a => ({ ...a }));
  },

  async getUpcoming(days = 7) {
    await delay();
    const now = new Date();
    const upcoming = new Date(now.getTime() + (days * 24 * 60 * 60 * 1000));
    return assignments.filter(a => {
      const dueDate = new Date(a.dueDate);
      return dueDate >= now && dueDate <= upcoming && !a.completed;
    }).map(a => ({ ...a }));
  },

  async getOverdue() {
    await delay();
    const now = new Date();
    return assignments.filter(a => {
      const dueDate = new Date(a.dueDate);
      return dueDate < now && !a.completed;
    }).map(a => ({ ...a }));
  },

  async create(assignmentData) {
    await delay();
    const maxId = Math.max(...assignments.map(a => a.Id), 0);
    const newAssignment = {
      Id: maxId + 1,
      ...assignmentData,
      completed: false,
      score: null
    };
    assignments.push(newAssignment);
    return { ...newAssignment };
  },

  async update(id, assignmentData) {
    await delay();
    const index = assignments.findIndex(a => a.Id === parseInt(id));
    if (index !== -1) {
      assignments[index] = { ...assignments[index], ...assignmentData };
      return { ...assignments[index] };
    }
    return null;
  },

  async delete(id) {
    await delay();
    const index = assignments.findIndex(a => a.Id === parseInt(id));
    if (index !== -1) {
      const deleted = assignments.splice(index, 1)[0];
      return { ...deleted };
    }
    return null;
  },

  async toggleComplete(id) {
    await delay();
    const index = assignments.findIndex(a => a.Id === parseInt(id));
    if (index !== -1) {
      assignments[index].completed = !assignments[index].completed;
      return { ...assignments[index] };
    }
    return null;
  }
};