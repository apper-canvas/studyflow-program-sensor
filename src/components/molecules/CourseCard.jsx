import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";

const CourseCard = ({ 
  course, 
  assignmentCount = 0,
  completedCount = 0,
  onEdit, 
  onDelete,
  className 
}) => {
  const completionRate = assignmentCount > 0 ? Math.round((completedCount / assignmentCount) * 100) : 0;

  return (
    <div className={cn(
      "bg-white rounded-xl overflow-hidden card-shadow hover:card-shadow-hover transition-all duration-200 transform hover:scale-102",
      className
    )}>
      <div 
        className="h-2 bg-gradient-to-r"
        style={{ 
          background: `linear-gradient(to right, ${course.color}, ${course.color}dd)` 
        }}
      />
      
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="font-bold text-xl text-gray-900 mb-1">
              {course.name}
            </h3>
            <p className="text-gray-600 flex items-center space-x-1">
              <ApperIcon name="User" size={14} />
              <span>{course.instructor}</span>
            </p>
          </div>
          <div className="flex items-center space-x-2">
            {onEdit && (
              <button
                onClick={() => onEdit(course)}
                className="p-2 text-gray-400 hover:text-primary transition-colors duration-200"
              >
                <ApperIcon name="Edit2" size={16} />
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(course.Id)}
                className="p-2 text-gray-400 hover:text-error transition-colors duration-200"
              >
                <ApperIcon name="Trash2" size={16} />
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Grade</span>
              <ApperIcon name="TrendingUp" size={14} className="text-primary" />
            </div>
            <div className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {course.currentGrade ? `${course.currentGrade.toFixed(1)}%` : "N/A"}
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-success/5 to-success/10 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Progress</span>
              <ApperIcon name="CheckCircle" size={14} className="text-success" />
            </div>
            <div className="text-2xl font-bold bg-gradient-to-r from-success to-emerald-500 bg-clip-text text-transparent">
              {completionRate}%
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <span>{assignmentCount} assignments</span>
            <span>•</span>
            <span>{course.credits} credits</span>
          </div>
          <Badge variant="primary">
            {completedCount}/{assignmentCount} done
          </Badge>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="h-2 rounded-full bg-gradient-to-r from-success to-emerald-500 transition-all duration-500"
            style={{ width: `${completionRate}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default CourseCard;