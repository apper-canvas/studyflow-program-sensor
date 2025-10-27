import { useState, useRef, useEffect } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import { toast } from "react-toastify";

const WeeklyScheduleGrid = ({ schedules = [], courses = [], onScheduleUpdate, className }) => {
  const [draggedItem, setDraggedItem] = useState(null);
  const [dragOverSlot, setDragOverSlot] = useState(null);
  const gridRef = useRef(null);

  const weekDays = [
    { name: "Monday", value: 1 },
    { name: "Tuesday", value: 2 },
    { name: "Wednesday", value: 3 },
    { name: "Thursday", value: 4 },
    { name: "Friday", value: 5 }
  ];

  const timeSlots = [];
  for (let hour = 8; hour <= 18; hour++) {
    timeSlots.push(`${String(hour).padStart(2, '0')}:00`);
    if (hour < 18) {
      timeSlots.push(`${String(hour).padStart(2, '0')}:30`);
    }
  }

  const getCourseById = (courseId) => {
    return courses.find(c => c.Id.toString() === courseId);
  };

  const getSchedulesForSlot = (day, time) => {
    return schedules.filter(schedule => {
      if (schedule.dayOfWeek !== day) return false;
      const scheduleStart = schedule.startTime;
      return scheduleStart === time;
    });
  };

  const calculateScheduleHeight = (startTime, endTime) => {
    const [startHour, startMin] = startTime.split(':').map(Number);
    const [endHour, endMin] = endTime.split(':').map(Number);
    const durationMinutes = (endHour * 60 + endMin) - (startHour * 60 + startMin);
    const slotHeight = 60;
    return (durationMinutes / 30) * slotHeight;
  };

  const handleDragStart = (e, schedule) => {
    setDraggedItem(schedule);
    e.dataTransfer.effectAllowed = 'move';
    e.target.style.opacity = '0.5';
  };

  const handleDragEnd = (e) => {
    e.target.style.opacity = '1';
    setDraggedItem(null);
    setDragOverSlot(null);
  };

  const handleDragOver = (e, day, time) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverSlot({ day, time });
  };

  const handleDragLeave = () => {
    setDragOverSlot(null);
  };

  const handleDrop = async (e, day, time) => {
    e.preventDefault();
    setDragOverSlot(null);

    if (!draggedItem) return;

    if (draggedItem.dayOfWeek === day && draggedItem.startTime === time) {
      return;
    }

    try {
      await onScheduleUpdate(draggedItem.Id, day, time);
      toast.success('Class schedule updated successfully');
    } catch (error) {
      toast.error(error.message || 'Failed to update schedule');
    }

    setDraggedItem(null);
  };

  const isSlotHighlighted = (day, time) => {
    return dragOverSlot && dragOverSlot.day === day && dragOverSlot.time === time;
  };

  return (
    <div className={cn("bg-white rounded-xl card-shadow overflow-hidden", className)}>
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
          <ApperIcon name="Clock" size={24} />
          <span>Weekly Class Schedule</span>
        </h2>
        <p className="text-sm text-gray-500 mt-1">Drag and drop classes to reschedule</p>
      </div>

      <div className="overflow-x-auto">
        <div className="inline-block min-w-full">
          <div className="grid grid-cols-[80px_repeat(5,minmax(150px,1fr))] border-l border-t border-gray-200">
            {/* Header Row */}
            <div className="bg-gray-50 p-3 border-r border-b border-gray-200 font-medium text-sm text-gray-600">
              Time
            </div>
            {weekDays.map(day => (
              <div
                key={day.value}
                className="bg-gray-50 p-3 border-r border-b border-gray-200 font-medium text-sm text-gray-900 text-center"
              >
                {day.name}
              </div>
            ))}

            {/* Time Slots */}
            {timeSlots.map(time => (
              <div key={time} className="contents">
                <div className="bg-gray-50 p-3 border-r border-b border-gray-200 text-xs text-gray-600 font-mono">
                  {time}
                </div>
                {weekDays.map(day => {
                  const slotSchedules = getSchedulesForSlot(day.value, time);
                  const isHighlighted = isSlotHighlighted(day.value, time);

                  return (
                    <div
                      key={`${day.value}-${time}`}
                      className={cn(
                        "relative border-r border-b border-gray-200 h-[60px] transition-colors duration-200",
                        isHighlighted && "bg-primary/5 border-primary/30"
                      )}
                      onDragOver={(e) => handleDragOver(e, day.value, time)}
                      onDragLeave={handleDragLeave}
                      onDrop={(e) => handleDrop(e, day.value, time)}
                    >
                      {slotSchedules.map(schedule => {
                        const course = getCourseById(schedule.courseId);
                        const height = calculateScheduleHeight(schedule.startTime, schedule.endTime);

                        return (
                          <div
                            key={schedule.Id}
                            draggable
                            onDragStart={(e) => handleDragStart(e, schedule)}
                            onDragEnd={handleDragEnd}
                            className="absolute inset-x-1 top-1 rounded-lg p-2 cursor-move shadow-sm hover:shadow-md transition-all duration-200 border-l-4"
                            style={{
                              backgroundColor: `${course?.color || '#6B7280'}15`,
                              borderLeftColor: course?.color || '#6B7280',
                              height: `${height - 8}px`,
                              zIndex: 10
                            }}
                          >
                            <div className="flex flex-col h-full overflow-hidden">
                              <div className="font-semibold text-xs truncate" style={{ color: course?.color || '#6B7280' }}>
                                {course?.name || 'Unknown Course'}
                              </div>
                              <div className="text-xs text-gray-600 truncate mt-0.5">
                                {schedule.roomNumber}
                              </div>
                              <div className="text-xs text-gray-500 mt-auto">
                                {schedule.startTime} - {schedule.endTime}
                              </div>
                              {schedule.sessionType && (
                                <div className="text-xs text-gray-400 mt-0.5 flex items-center space-x-1">
                                  <ApperIcon 
                                    name={schedule.sessionType === 'Lab' ? 'FlaskConical' : 'BookOpen'} 
                                    size={10} 
                                  />
                                  <span>{schedule.sessionType}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      {courses.length > 0 && (
        <div className="p-6 border-t border-gray-100 bg-gray-50">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Course Legend</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {courses.map(course => (
              <div key={course.Id} className="flex items-center space-x-2">
                <div 
                  className="w-4 h-4 rounded border-2"
                  style={{ borderColor: course.color, backgroundColor: `${course.color}20` }}
                />
                <span className="text-xs text-gray-700 truncate">{course.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WeeklyScheduleGrid;