import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Textarea from "@/components/atoms/Textarea";
import { courseService } from "@/services/api/courseService";
import { assignmentService } from "@/services/api/assignmentService";

const QuickAddModal = ({ isOpen, onClose, onSuccess, type = "assignment" }) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    courseId: "",
    dueDate: "",
    priority: "medium",
    category: "",
    maxScore: 100,
    notes: "",
    // Course fields
    name: "",
    instructor: "",
    color: "#4F46E5",
    credits: 3
  });

  useEffect(() => {
    if (isOpen && type === "assignment") {
      loadCourses();
    }
  }, [isOpen, type]);

  const loadCourses = async () => {
    try {
      const data = await courseService.getAll();
      setCourses(data);
    } catch (error) {
      toast.error("Failed to load courses");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (type === "assignment") {
        await assignmentService.create({
          title: formData.title,
          courseId: formData.courseId,
          dueDate: formData.dueDate,
          priority: formData.priority,
          category: formData.category,
          maxScore: parseInt(formData.maxScore),
          notes: formData.notes
        });
        toast.success("Assignment added successfully!");
      } else {
        await courseService.create({
          name: formData.name,
          instructor: formData.instructor,
          color: formData.color,
          credits: parseInt(formData.credits),
          gradeWeight: {}
        });
        toast.success("Course added successfully!");
      }

      onSuccess();
      onClose();
      setFormData({
        title: "",
        courseId: "",
        dueDate: "",
        priority: "medium",
        category: "",
        maxScore: 100,
        notes: "",
        name: "",
        instructor: "",
        color: "#4F46E5",
        credits: 3
      });
    } catch (error) {
      toast.error(`Failed to add ${type}`);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">
            Add New {type === "assignment" ? "Assignment" : "Course"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <ApperIcon name="X" size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {type === "assignment" ? (
            <>
              <Input
                label="Assignment Title"
                required
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
                placeholder="e.g., Math Homework #5"
              />

              <Select
                label="Course"
                required
                value={formData.courseId}
                onChange={(e) => handleChange("courseId", e.target.value)}
              >
                <option value="">Select a course</option>
                {courses.map(course => (
                  <option key={course.Id} value={course.Id}>
                    {course.name}
                  </option>
                ))}
              </Select>

              <Input
                label="Due Date & Time"
                type="datetime-local"
                required
                value={formData.dueDate}
                onChange={(e) => handleChange("dueDate", e.target.value)}
              />

              <div className="grid grid-cols-2 gap-4">
                <Select
                  label="Priority"
                  value={formData.priority}
                  onChange={(e) => handleChange("priority", e.target.value)}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </Select>

                <Input
                  label="Max Score"
                  type="number"
                  value={formData.maxScore}
                  onChange={(e) => handleChange("maxScore", e.target.value)}
                  min="1"
                />
              </div>

              <Input
                label="Category"
                value={formData.category}
                onChange={(e) => handleChange("category", e.target.value)}
                placeholder="e.g., homework, exam, project"
              />

              <Textarea
                label="Notes (Optional)"
                value={formData.notes}
                onChange={(e) => handleChange("notes", e.target.value)}
                placeholder="Any additional details..."
                rows={3}
              />
            </>
          ) : (
            <>
              <Input
                label="Course Name"
                required
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="e.g., Advanced Calculus"
              />

              <Input
                label="Instructor"
                required
                value={formData.instructor}
                onChange={(e) => handleChange("instructor", e.target.value)}
                placeholder="e.g., Dr. Smith"
              />

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Course Color
                  </label>
                  <input
                    type="color"
                    value={formData.color}
                    onChange={(e) => handleChange("color", e.target.value)}
                    className="w-full h-10 border border-gray-300 rounded-lg cursor-pointer"
                  />
                </div>

                <Input
                  label="Credits"
                  type="number"
                  value={formData.credits}
                  onChange={(e) => handleChange("credits", e.target.value)}
                  min="1"
                  max="6"
                />
              </div>
            </>
          )}

          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={loading}
              className="flex-1"
              icon={type === "assignment" ? "Plus" : "BookOpen"}
            >
              Add {type === "assignment" ? "Assignment" : "Course"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuickAddModal;