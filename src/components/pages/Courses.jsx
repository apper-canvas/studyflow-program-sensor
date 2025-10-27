import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import CourseCard from "@/components/molecules/CourseCard";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import QuickAddModal from "@/components/organisms/QuickAddModal";
import { courseService } from "@/services/api/courseService";
import { assignmentService } from "@/services/api/assignmentService";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showQuickAdd, setShowQuickAdd] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setError("");
      setLoading(true);

      const [coursesData, assignmentsData] = await Promise.all([
        courseService.getAll(),
        assignmentService.getAll()
      ]);

      setCourses(coursesData);
      setAssignments(assignmentsData);
    } catch (err) {
      setError("Failed to load courses");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCourse = async (courseId) => {
    if (!confirm("Are you sure you want to delete this course? This will also remove all associated assignments.")) {
      return;
    }

    try {
      await courseService.delete(courseId);
      toast.success("Course deleted successfully!");
      loadData();
    } catch (error) {
      toast.error("Failed to delete course");
    }
  };

  const getCourseStats = (courseId) => {
    const courseAssignments = assignments.filter(a => a.courseId === courseId.toString());
    const completedCount = courseAssignments.filter(a => a.completed).length;
    return {
      assignmentCount: courseAssignments.length,
      completedCount
    };
  };

  if (loading) return <Loading variant="cards" className="p-6" />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Courses</h1>
          <p className="text-gray-600 mt-1">
            Manage your academic courses and track progress
          </p>
        </div>
        <Button
          icon="Plus"
          onClick={() => setShowQuickAdd(true)}
        >
          Add Course
        </Button>
      </div>

      {/* Courses Summary */}
      {courses.length > 0 && (
        <div className="bg-white rounded-xl card-shadow p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                {courses.length}
              </div>
              <p className="text-gray-600">Total Courses</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold bg-gradient-to-r from-success to-emerald-500 bg-clip-text text-transparent">
                {courses.reduce((sum, course) => sum + course.credits, 0)}
              </div>
              <p className="text-gray-600">Total Credits</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold bg-gradient-to-r from-accent to-yellow-500 bg-clip-text text-transparent">
                {courses.length > 0 ? (courses.reduce((sum, course) => sum + course.currentGrade, 0) / courses.length).toFixed(1) : 0}%
              </div>
              <p className="text-gray-600">Average Grade</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold bg-gradient-to-r from-info to-blue-500 bg-clip-text text-transparent">
                {assignments.length}
              </div>
              <p className="text-gray-600">Total Assignments</p>
            </div>
          </div>
        </div>
      )}

      {/* Courses Grid */}
      {courses.length === 0 ? (
        <Empty
          title="No courses yet"
          message="Add your first course to get started with tracking assignments and grades"
          actionText="Add Course"
          onAction={() => setShowQuickAdd(true)}
          icon="BookOpen"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map(course => {
            const stats = getCourseStats(course.Id);
            return (
              <CourseCard
                key={course.Id}
                course={course}
                assignmentCount={stats.assignmentCount}
                completedCount={stats.completedCount}
                onDelete={handleDeleteCourse}
              />
            );
          })}
        </div>
      )}

      {/* Quick Add Modal */}
      <QuickAddModal
        isOpen={showQuickAdd}
        onClose={() => setShowQuickAdd(false)}
        onSuccess={loadData}
        type="course"
      />
    </div>
  );
};

export default Courses;