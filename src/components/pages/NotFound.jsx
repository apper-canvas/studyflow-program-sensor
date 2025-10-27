import { useNavigate } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="text-center max-w-md mx-auto">
        <div className="bg-gradient-to-br from-primary/5 to-secondary/10 rounded-2xl p-8 mb-8">
          <div className="bg-gradient-to-r from-primary to-secondary w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <ApperIcon name="BookX" className="text-white" size={40} />
          </div>
          <h1 className="text-6xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
            404
          </h1>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Page Not Found
          </h2>
          <p className="text-gray-600 mb-8 leading-relaxed">
            Looks like this page got lost in the study materials. Let's get you back to your dashboard.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => navigate("/")}
              icon="Home"
            >
              Back to Dashboard
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate(-1)}
              icon="ArrowLeft"
            >
              Go Back
            </Button>
          </div>
        </div>
        
        <div className="text-sm text-gray-500">
          <p>Need help? Check out these quick links:</p>
          <div className="flex justify-center space-x-4 mt-2">
            <button
              onClick={() => navigate("/assignments")}
              className="text-primary hover:underline"
            >
              Assignments
            </button>
            <span>•</span>
            <button
              onClick={() => navigate("/courses")}
              className="text-primary hover:underline"
            >
              Courses
            </button>
            <span>•</span>
            <button
              onClick={() => navigate("/grades")}
              className="text-primary hover:underline"
            >
              Grades
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;