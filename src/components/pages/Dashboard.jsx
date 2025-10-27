import { useState, useEffect } from "react";
import { format, isAfter, isBefore, addDays } from "date-fns";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import StatCard from "@/components/molecules/StatCard";
import AssignmentCard from "@/components/molecules/AssignmentCard";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import QuickAddModal from "@/components/organisms/QuickAddModal";
import { assignmentService } from "@/services/api/assignmentService";
import { courseService } from "@/services/api/courseService";
import { gradeService } from "@/services/api/gradeService";

const Dashboard = () => {
  const [assignments, setAssignments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [stats, setStats] = useState({
    totalAssignments: 0,
    completed: 0,
    overdue: 0,
    upcoming: 0,
    gpa: 0
  });
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [quickAddType, setQuickAddType] = useState("assignment");

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setError("");
      setLoading(true);

      const [assignmentsData, coursesData] = await Promise.all([
        assignmentService.getAll(),
        courseService.getAll()
      ]);

      setAssignments(assignmentsData);
      setCourses(coursesData);

      // Calculate stats
      const now = new Date();
      const overdue = assignmentsData.filter(a => 
        new Date(a.dueDate) < now && !a.completed
      ).length;
      
      const upcoming = assignmentsData.filter(a => {
        const dueDate = new Date(a.dueDate);
        return dueDate > now && dueDate <= addDays(now, 7) && !a.completed;
      }).length;

      const completed = assignmentsData.filter(a => a.completed).length;
      const gpa = await gradeService.calculateOverallGPA(coursesData, assignmentsData);

      setStats({
        totalAssignments: assignmentsData.length,
        completed,
        overdue,
        upcoming,
        gpa
      });

    } catch (err) {
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleComplete = async (assignmentId) => {
    try {
      await assignmentService.toggleComplete(assignmentId);
      toast.success("Assignment updated!");
      loadDashboardData();
    } catch (error) {
      toast.error("Failed to update assignment");
    }
  };

  const getUpcomingAssignments = () => {
    const now = new Date();
    return assignments
      .filter(a => {
        const dueDate = new Date(a.dueDate);
        return dueDate > now && !a.completed;
      })
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
      .slice(0, 5);
  };

  const getOverdueAssignments = () => {
    const now = new Date();
    return assignments
      .filter(a => new Date(a.dueDate) < now && !a.completed)
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
      .slice(0, 3);
  };

  if (loading) return <Loading variant="skeleton" className="p-6" />;
  if (error) return <Error message={error} onRetry={loadDashboardData} />;

  const upcomingAssignments = getUpcomingAssignments();
  const overdueAssignments = getOverdueAssignments();

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back! 📚
          </h1>
          <p className="text-gray-600 mt-1">
            Here's your academic overview for {format(new Date(), "EEEE, MMMM d")}
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            icon="BookOpen"
            onClick={() => {
              setQuickAddType("course");
              setShowQuickAdd(true);
            }}
          >
            Add Course
          </Button>
          <Button
            icon="Plus"
            onClick={() => {
              setQuickAddType("assignment");
              setShowQuickAdd(true);
            }}
          >
            Quick Add
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Assignments"
          value={stats.totalAssignments}
          subtitle="This semester"
          icon="FileText"
          gradient="from-primary to-secondary"
        />
        
        <StatCard
          title="Completed"
          value={stats.completed}
          subtitle={`${Math.round((stats.completed / stats.totalAssignments) * 100) || 0}% completion rate`}
          icon="CheckCircle"
          gradient="from-success to-emerald-500"
        />
        
        <StatCard
          title="Overdue"
          value={stats.overdue}
          subtitle="Need attention"
          icon="AlertCircle"
          gradient="from-error to-red-500"
        />
        
        <StatCard
          title="Current GPA"
          value={stats.gpa.toFixed(2)}
          subtitle="Weighted average"
          icon="Award"
          gradient="from-accent to-yellow-500"
        />
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Overdue Assignments */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl card-shadow">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center space-x-2">
                <ApperIcon name="AlertTriangle" className="text-error" size={20} />
                <h2 className="text-xl font-bold text-gray-900">Overdue Tasks</h2>
              </div>
            </div>
            <div className="p-6">
              {overdueAssignments.length === 0 ? (
                <Empty
                  title="All caught up! 🎉"
                  message="No overdue assignments"
                  icon="CheckCircle"
                  className="py-8"
                />
              ) : (
                <div className="space-y-4">
                  {overdueAssignments.map(assignment => {
                    const course = courses.find(c => c.Id.toString() === assignment.courseId);
                    return (
                      <AssignmentCard
                        key={assignment.Id}
                        assignment={assignment}
                        course={course}
                        onToggleComplete={handleToggleComplete}
                        className="border-l-4 border-error"
                      />
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Upcoming Assignments */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl card-shadow">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <ApperIcon name="Calendar" className="text-primary" size={20} />
                  <h2 className="text-xl font-bold text-gray-900">Upcoming This Week</h2>
                </div>
                <Button variant="ghost" size="sm" icon="ArrowRight">
                  View All
                </Button>
              </div>
            </div>
            <div className="p-6">
              {upcomingAssignments.length === 0 ? (
                <Empty
                  title="Nothing due this week! 🏖️"
                  message="Enjoy your free time or get ahead on future assignments"
                  icon="Sun"
                  actionText="Add Assignment"
                  onAction={() => {
                    setQuickAddType("assignment");
                    setShowQuickAdd(true);
                  }}
                />
              ) : (
                <div className="space-y-4">
                  {upcomingAssignments.map(assignment => {
                    const course = courses.find(c => c.Id.toString() === assignment.courseId);
                    return (
                      <AssignmentCard
                        key={assignment.Id}
                        assignment={assignment}
                        course={course}
                        onToggleComplete={handleToggleComplete}
                      />
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Course Progress */}
      {courses.length > 0 && (
        <div className="bg-white rounded-xl card-shadow">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-900">Course Progress</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {courses.map(course => {
                const courseAssignments = assignments.filter(a => a.courseId === course.Id.toString());
                const completed = courseAssignments.filter(a => a.completed).length;
                const total = courseAssignments.length;
                const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

                return (
                  <div key={course.Id} className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: course.color }}
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{course.name}</h3>
                        <p className="text-sm text-gray-500">{course.instructor}</p>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600">{completed}/{total} completed</span>
                        <span className="text-sm font-medium text-gray-900">{progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="h-2 rounded-full bg-gradient-to-r from-success to-emerald-500 transition-all duration-500"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Quick Add Modal */}
      <QuickAddModal
        isOpen={showQuickAdd}
        onClose={() => setShowQuickAdd(false)}
        onSuccess={loadDashboardData}
        type={quickAddType}
      />
    </div>
  );
};

export default Dashboard;