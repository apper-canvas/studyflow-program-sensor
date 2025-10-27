import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import AssignmentCard from "@/components/molecules/AssignmentCard";
import FilterBar from "@/components/molecules/FilterBar";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import QuickAddModal from "@/components/organisms/QuickAddModal";
import { assignmentService } from "@/services/api/assignmentService";
import { courseService } from "@/services/api/courseService";

const Assignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedPriority, setSelectedPriority] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

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
      setError("Failed to load assignments");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleComplete = async (assignmentId) => {
    try {
      await assignmentService.toggleComplete(assignmentId);
      toast.success("Assignment updated!");
      loadData();
    } catch (error) {
      toast.error("Failed to update assignment");
    }
  };

  const getFilteredAssignments = () => {
    let filtered = [...assignments];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(assignment =>
        assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        assignment.notes.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Course filter
    if (selectedCourse) {
      filtered = filtered.filter(assignment => 
        assignment.courseId === selectedCourse
      );
    }

    // Priority filter
    if (selectedPriority) {
      filtered = filtered.filter(assignment => 
        assignment.priority === selectedPriority
      );
    }

    // Status filter
    if (selectedStatus) {
      const now = new Date();
      filtered = filtered.filter(assignment => {
        const dueDate = new Date(assignment.dueDate);
        
        switch (selectedStatus) {
          case "completed":
            return assignment.completed;
          case "pending":
            return !assignment.completed && dueDate >= now;
          case "overdue":
            return !assignment.completed && dueDate < now;
          default:
            return true;
        }
      });
    }

    // Sort by due date
    return filtered.sort((a, b) => {
      // Completed items go to bottom
      if (a.completed && !b.completed) return 1;
      if (!a.completed && b.completed) return -1;
      
      // Then sort by due date
      return new Date(a.dueDate) - new Date(b.dueDate);
    });
  };

  if (loading) return <Loading variant="cards" className="p-6" />;
  if (error) return <Error message={error} onRetry={loadData} />;

  const filteredAssignments = getFilteredAssignments();
  const stats = {
    total: assignments.length,
    completed: assignments.filter(a => a.completed).length,
    pending: assignments.filter(a => !a.completed && new Date(a.dueDate) >= new Date()).length,
    overdue: assignments.filter(a => !a.completed && new Date(a.dueDate) < new Date()).length
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Assignments</h1>
          <p className="text-gray-600 mt-1">
            Manage your tasks and track progress
          </p>
        </div>
        <Button
          icon="Plus"
          onClick={() => setShowQuickAdd(true)}
        >
          Add Assignment
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 card-shadow text-center">
          <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
          <div className="text-sm text-gray-600">Total</div>
        </div>
        <div className="bg-white rounded-lg p-4 card-shadow text-center">
          <div className="text-2xl font-bold text-success">{stats.completed}</div>
          <div className="text-sm text-gray-600">Completed</div>
        </div>
        <div className="bg-white rounded-lg p-4 card-shadow text-center">
          <div className="text-2xl font-bold text-primary">{stats.pending}</div>
          <div className="text-sm text-gray-600">Pending</div>
        </div>
        <div className="bg-white rounded-lg p-4 card-shadow text-center">
          <div className="text-2xl font-bold text-error">{stats.overdue}</div>
          <div className="text-sm text-gray-600">Overdue</div>
        </div>
      </div>

      {/* Filters */}
      <FilterBar
        courses={courses}
        selectedCourse={selectedCourse}
        onCourseChange={setSelectedCourse}
        selectedPriority={selectedPriority}
        onPriorityChange={setSelectedPriority}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        className="bg-white rounded-xl p-6 card-shadow"
      />

      {/* Assignments List */}
      <div className="space-y-4">
        {filteredAssignments.length === 0 ? (
          <Empty
            title="No assignments found"
            message="Try adjusting your filters or add a new assignment"
            actionText="Add Assignment"
            onAction={() => setShowQuickAdd(true)}
            icon="FileText"
          />
        ) : (
          filteredAssignments.map(assignment => {
            const course = courses.find(c => c.Id.toString() === assignment.courseId);
            return (
              <AssignmentCard
                key={assignment.Id}
                assignment={assignment}
                course={course}
                onToggleComplete={handleToggleComplete}
              />
            );
          })
        )}
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

export default Assignments;