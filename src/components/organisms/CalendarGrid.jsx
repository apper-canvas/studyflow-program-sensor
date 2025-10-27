import { useState } from "react";
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay, isToday } from "date-fns";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const CalendarGrid = ({ assignments = [], courses = [], onDateClick, className }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const getCourseColor = (courseId) => {
    const course = courses.find(c => c.Id.toString() === courseId);
    return course?.color || "#6B7280";
  };

  const getAssignmentsForDate = (date) => {
    return assignments.filter(assignment => 
      isSameDay(new Date(assignment.dueDate), date)
    );
  };

  const renderCalendarDays = () => {
    const days = [];
    let day = startDate;

    while (day <= endDate) {
      const dayAssignments = getAssignmentsForDate(day);
      const isCurrentMonth = isSameMonth(day, currentMonth);
      const isCurrentDay = isToday(day);

      days.push(
        <div
          key={day.toString()}
          className={cn(
            "min-h-[100px] p-2 border border-gray-100 cursor-pointer transition-colors duration-200",
            isCurrentMonth ? "bg-white hover:bg-gray-50" : "bg-gray-50/50",
            isCurrentDay && "bg-primary/5 border-primary/20"
          )}
          onClick={() => onDateClick && onDateClick(day, dayAssignments)}
        >
          <div className={cn(
            "text-sm font-medium mb-2",
            isCurrentMonth ? "text-gray-900" : "text-gray-400",
            isCurrentDay && "text-primary font-bold"
          )}>
            {format(day, "d")}
          </div>
          <div className="space-y-1">
            {dayAssignments.slice(0, 3).map((assignment, index) => (
              <div
                key={assignment.Id}
                className="text-xs p-1 rounded truncate"
                style={{ 
                  backgroundColor: `${getCourseColor(assignment.courseId)}20`,
                  color: getCourseColor(assignment.courseId)
                }}
              >
                {assignment.title}
              </div>
            ))}
            {dayAssignments.length > 3 && (
              <div className="text-xs text-gray-500">
                +{dayAssignments.length - 3} more
              </div>
            )}
          </div>
        </div>
      );

      day = addDays(day, 1);
    }

    return days;
  };

  const nextMonth = () => {
    setCurrentMonth(addDays(currentMonth, 31));
  };

  const prevMonth = () => {
    setCurrentMonth(addDays(currentMonth, -31));
  };

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className={cn("bg-white rounded-xl card-shadow", className)}>
      {/* Calendar Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-100">
        <h2 className="text-xl font-bold text-gray-900">
          {format(currentMonth, "MMMM yyyy")}
        </h2>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" onClick={prevMonth} icon="ChevronLeft" size="sm" />
          <Button 
            variant="ghost" 
            onClick={() => setCurrentMonth(new Date())}
            size="sm"
          >
            Today
          </Button>
          <Button variant="ghost" onClick={nextMonth} icon="ChevronRight" size="sm" />
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="p-6">
        {/* Week day headers */}
        <div className="grid grid-cols-7 mb-2">
          {weekDays.map(day => (
            <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar days */}
        <div className="grid grid-cols-7 border border-gray-200 rounded-lg overflow-hidden">
          {renderCalendarDays()}
        </div>

        {/* Legend */}
        {courses.length > 0 && (
          <div className="mt-6 pt-4 border-t border-gray-100">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Course Legend</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {courses.map(course => (
                <div key={course.Id} className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: course.color }}
                  />
                  <span className="text-xs text-gray-600 truncate">{course.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CalendarGrid;