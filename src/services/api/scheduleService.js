import scheduleData from '../mockData/schedule.json';

let schedules = [...scheduleData];
let nextId = Math.max(...schedules.map(s => s.Id), 0) + 1;

const delay = () => new Promise(resolve => setTimeout(resolve, 300));

export const scheduleService = {
  async getAll() {
    await delay();
    return [...schedules];
  },

  async getById(id) {
    await delay();
    const schedule = schedules.find(s => s.Id === id);
    if (!schedule) {
      throw new Error('Schedule session not found');
    }
    return { ...schedule };
  },

  async getByCourse(courseId) {
    await delay();
    return schedules.filter(s => s.courseId === courseId).map(s => ({ ...s }));
  },

  async getByDay(dayOfWeek) {
    await delay();
    return schedules.filter(s => s.dayOfWeek === dayOfWeek).map(s => ({ ...s }));
  },

  async create(schedule) {
    await delay();
    
    const hasConflict = schedules.some(s => 
      s.dayOfWeek === schedule.dayOfWeek &&
      s.roomNumber === schedule.roomNumber &&
      ((schedule.startTime >= s.startTime && schedule.startTime < s.endTime) ||
       (schedule.endTime > s.startTime && schedule.endTime <= s.endTime) ||
       (schedule.startTime <= s.startTime && schedule.endTime >= s.endTime))
    );

    if (hasConflict) {
      throw new Error('Time slot conflict detected for this room');
    }

    const newSchedule = {
      ...schedule,
      Id: nextId++
    };
    schedules.push(newSchedule);
    return { ...newSchedule };
  },

  async update(id, data) {
    await delay();
    const index = schedules.findIndex(s => s.Id === id);
    if (index === -1) {
      throw new Error('Schedule session not found');
    }

    const hasConflict = schedules.some(s => 
      s.Id !== id &&
      s.dayOfWeek === data.dayOfWeek &&
      s.roomNumber === data.roomNumber &&
      ((data.startTime >= s.startTime && data.startTime < s.endTime) ||
       (data.endTime > s.startTime && data.endTime <= s.endTime) ||
       (data.startTime <= s.startTime && data.endTime >= s.endTime))
    );

    if (hasConflict) {
      throw new Error('Time slot conflict detected for this room');
    }

    schedules[index] = {
      ...schedules[index],
      ...data,
      Id: id
    };
    return { ...schedules[index] };
  },

  async delete(id) {
    await delay();
    const index = schedules.findIndex(s => s.Id === id);
    if (index === -1) {
      throw new Error('Schedule session not found');
    }
    schedules.splice(index, 1);
    return { success: true };
  },

  async updateTimeSlot(id, dayOfWeek, startTime) {
    await delay();
    const schedule = schedules.find(s => s.Id === id);
    if (!schedule) {
      throw new Error('Schedule session not found');
    }

    const duration = this.calculateDuration(schedule.startTime, schedule.endTime);
    const endTime = this.addMinutesToTime(startTime, duration);

    const hasConflict = schedules.some(s => 
      s.Id !== id &&
      s.dayOfWeek === dayOfWeek &&
      s.roomNumber === schedule.roomNumber &&
      ((startTime >= s.startTime && startTime < s.endTime) ||
       (endTime > s.startTime && endTime <= s.endTime) ||
       (startTime <= s.startTime && endTime >= s.endTime))
    );

    if (hasConflict) {
      throw new Error('Time slot conflict detected for this room');
    }

    return this.update(id, {
      dayOfWeek,
      startTime,
      endTime
    });
  },

  calculateDuration(startTime, endTime) {
    const [startHour, startMin] = startTime.split(':').map(Number);
    const [endHour, endMin] = endTime.split(':').map(Number);
    return (endHour * 60 + endMin) - (startHour * 60 + startMin);
  },

  addMinutesToTime(time, minutes) {
    const [hour, min] = time.split(':').map(Number);
    const totalMinutes = hour * 60 + min + minutes;
    const newHour = Math.floor(totalMinutes / 60);
    const newMin = totalMinutes % 60;
    return `${String(newHour).padStart(2, '0')}:${String(newMin).padStart(2, '0')}`;
  }
};