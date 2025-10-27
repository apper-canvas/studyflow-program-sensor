import { useState, useEffect } from "react";
import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import CalendarGrid from "@/components/organisms/CalendarGrid";
import AssignmentCard from "@/components/molecules/AssignmentCard";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import QuickAddModal from "@/components/organisms/QuickAddModal";
import { assignmentService } from "@/services/api/assignmentService";
import { courseService } from "@/services/api/courseService";

const Calendar = () => {
  const [assignments, setAssignments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedAssignments, setSelectedAssignments] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setError("");
      setLoading(true);

      const [assignmentsData, coursesData] = await Promise.all([
        assignmentService.getAll(),
        courseService.getAll()
      ]);

      setAssignments(assignmentsData);
      setCourses(coursesData);
    } catch (err) {
      setError("Failed to load calendar data");
    } finally {
      setLoading(false);
    }
  };

  const handleDateClick = (date, dayAssignments) => {
    setSelectedDate(date);
    setSelectedAssignments(dayAssignments);
  };

  if (loading) return <Loading className="p-6" />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Calendar</h1>
          <p className="text-gray-600 mt-1">
            View your assignments and deadlines
          </p>
        </div>
        <Button
          icon="Plus"
          onClick={() => setShowQuickAdd(true)}
        >
          Add Assignment
        </Button>
      </div>

      {/* Calendar View */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <CalendarGrid
            assignments={assignments}
            courses={courses}
            onDateClick={handleDateClick}
          />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Today's Assignments */}
          <div className="bg-white rounded-xl card-shadow">
            <div className="p-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-900 flex items-center space-x-2">
                <ApperIcon name="Clock" size={16} />
                <span>Today's Tasks</span>
              </h3>
            </div>
            <div className="p-4">
              {assignments.filter(a => {
                const today = new Date();
                const dueDate = new Date(a.dueDate);
                return dueDate.toDateString() === today.toDateString();
              }).length === 0 ? (
                <p className="text-gray-500 text-sm text-center py-4">
                  No assignments due today
                </p>
              ) : (
                <div className="space-y-3">
                  {assignments.filter(a => {
                    const today = new Date();
                    const dueDate = new Date(a.dueDate);
                    return dueDate.toDateString() === today.toDateString();
                  }).map(assignment => {
                    const course = courses.find(c => c.Id.toString() === assignment.courseId);
                    return (
                      <div key={assignment.Id} className="text-sm">
                        <div className="flex items-center space-x-2">
                          <div 
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: course?.color || "#6B7280" }}
                          />
                          <span className="font-medium">{assignment.title}</span>
                        </div>
                        <p className="text-gray-500 ml-4">{course?.name}</p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Selected Date Details */}
          {selectedDate && (
            <div className="bg-white rounded-xl card-shadow">
              <div className="p-4 border-b border-gray-100">
                <h3 className="font-semibold text-gray-900">
                  {format(selectedDate, "EEEE, MMMM d")}
                </h3>
              </div>
              <div className="p-4">
                {selectedAssignments.length === 0 ? (
                  <p className="text-gray-500 text-sm text-center py-4">
                    No assignments on this date
                  </p>
                ) : (
                  <div className="space-y-3">
                    {selectedAssignments.map(assignment => {
                      const course = courses.find(c => c.Id.toString() === assignment.courseId);
                      return (
                        <div key={assignment.Id} className="text-sm">
                          <div className="flex items-center space-x-2">
                            <div 
                              className="w-2 h-2 rounded-full"
                              style={{ backgroundColor: course?.color || "#6B7280" }}
                            />
                            <span className="font-medium">{assignment.title}</span>
                          </div>
                          <p className="text-gray-500 ml-4">{course?.name}</p>
                          <p className="text-xs text-gray-400 ml-4">
                            Due: {format(new Date(assignment.dueDate), "h:mm a")}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Course Legend */}
          {courses.length > 0 && (
            <div className="bg-white rounded-xl card-shadow">
              <div className="p-4 border-b border-gray-100">
                <h3 className="font-semibold text-gray-900">Courses</h3>
              </div>
              <div className="p-4 space-y-2">
                {courses.map(course => (
                  <div key={course.Id} className="flex items-center space-x-3">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: course.color }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {course.name}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {course.instructor}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick Add Modal */}
      <QuickAddModal
        isOpen={showQuickAdd}
        onClose={() => setShowQuickAdd(false)}
        onSuccess={loadData}
        type="assignment"
      />
    </div>
  );
};

export default Calendar;