import mockData from '@/services/mockData/students.json';

let students = [...mockData];
let nextId = Math.max(...students.map(s => s.Id), 0) + 1;

export const studentService = {
  getAll: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...students];
  },

  getById: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const studentId = parseInt(id);
    const student = students.find(s => s.Id === studentId);
    if (!student) {
      throw new Error('Student not found');
    }
    return { ...student };
  },

  create: async (studentData) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const newStudent = {
      Id: nextId++,
      firstName: studentData.firstName,
      lastName: studentData.lastName,
      email: studentData.email,
      studentId: studentData.studentId,
      major: studentData.major,
      year: studentData.year,
      gpa: studentData.gpa || 0.0,
      enrollmentDate: studentData.enrollmentDate,
      phoneNumber: studentData.phoneNumber || '',
      status: studentData.status || 'Active'
    };
    
    students.push(newStudent);
    return { ...newStudent };
  },

  update: async (id, studentData) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const studentId = parseInt(id);
    const index = students.findIndex(s => s.Id === studentId);
    
    if (index === -1) {
      throw new Error('Student not found');
    }
    
    students[index] = {
      ...students[index],
      ...studentData,
      Id: studentId
    };
    
    return { ...students[index] };
  },

  delete: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const studentId = parseInt(id);
    const index = students.findIndex(s => s.Id === studentId);
    
    if (index === -1) {
      throw new Error('Student not found');
    }
    
    students.splice(index, 1);
    return { success: true };
  }
};