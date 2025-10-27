import { format, isAfter, isBefore, addDays } from "date-fns";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import Checkbox from "@/components/atoms/Checkbox";

const AssignmentCard = ({ 
  assignment, 
  course, 
  onToggleComplete, 
  onEdit,
  className 
}) => {
  const dueDate = new Date(assignment.dueDate);
  const now = new Date();
  const isOverdue = isBefore(dueDate, now) && !assignment.completed;
  const isDueSoon = isAfter(dueDate, now) && isBefore(dueDate, addDays(now, 3));

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high": return "error";
      case "medium": return "warning";
      case "low": return "info";
      default: return "default";
    }
  };

  const getStatusColor = () => {
    if (assignment.completed) return "success";
    if (isOverdue) return "error";
    if (isDueSoon) return "warning";
    return "default";
  };

  return (
    <div className={cn(
      "bg-white rounded-xl p-6 card-shadow hover:card-shadow-hover transition-all duration-200 border border-gray-100",
      assignment.completed && "opacity-75",
      className
    )}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start space-x-3 flex-1">
          <Checkbox
            checked={assignment.completed}
            onChange={() => onToggleComplete(assignment.Id)}
            className="mt-1"
          />
          <div className="flex-1">
            <h3 className={cn(
              "font-semibold text-gray-900 mb-2",
              assignment.completed && "line-through text-gray-500"
            )}>
              {assignment.title}
            </h3>
            <div className="flex items-center space-x-3 mb-3">
              <div className="flex items-center space-x-2">
                <div 
                  className="course-dot" 
                  style={{ backgroundColor: course?.color || "#6B7280" }}
                />
                <span className="text-sm text-gray-600">{course?.name}</span>
              </div>
              <Badge variant={getPriorityColor(assignment.priority)}>
                {assignment.priority}
              </Badge>
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <ApperIcon name="Calendar" size={14} />
                <span>Due: {format(dueDate, "MMM d, yyyy 'at' h:mm a")}</span>
              </div>
              {assignment.category && (
                <div className="flex items-center space-x-1">
                  <ApperIcon name="Tag" size={14} />
                  <span className="capitalize">{assignment.category}</span>
                </div>
              )}
            </div>
            {assignment.notes && (
              <p className="text-sm text-gray-600 mt-2 italic">
                {assignment.notes}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-2 ml-4">
          <Badge variant={getStatusColor()}>
            {assignment.completed ? "Completed" : 
             isOverdue ? "Overdue" : 
             isDueSoon ? "Due Soon" : "Pending"}
          </Badge>
          {onEdit && (
            <button
              onClick={() => onEdit(assignment)}
              className="p-2 text-gray-400 hover:text-primary transition-colors duration-200"
            >
              <ApperIcon name="Edit2" size={16} />
            </button>
          )}
        </div>
      </div>
      
      {assignment.score !== null && (
        <div className="bg-gradient-to-r from-success/5 to-success/10 rounded-lg p-3 mt-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Score</span>
            <span className="text-lg font-bold bg-gradient-to-r from-success to-emerald-500 bg-clip-text text-transparent">
              {assignment.score}/{assignment.maxScore} ({Math.round(assignment.score / assignment.maxScore * 100)}%)
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignmentCard;