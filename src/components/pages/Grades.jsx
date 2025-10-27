import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Select from "@/components/atoms/Select";
import Input from "@/components/atoms/Input";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { assignmentService } from "@/services/api/assignmentService";
import { courseService } from "@/services/api/courseService";
import { gradeService } from "@/services/api/gradeService";

const Grades = () => {
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [courseGrades, setCourseGrades] = useState({});
  const [overallGPA, setOverallGPA] = useState(0);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (courses.length > 0 && assignments.length > 0) {
      calculateGrades();
    }
  }, [courses, assignments]);

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
      
      if (coursesData.length > 0) {
        setSelectedCourse(coursesData[0].Id.toString());
      }
    } catch (err) {
      setError("Failed to load grades data");
    } finally {
      setLoading(false);
    }
  };

  const calculateGrades = async () => {
    try {
      const grades = {};
      for (const course of courses) {
        const grade = await gradeService.calculateCourseGrade(course.Id.toString(), assignments);
        grades[course.Id] = grade;
      }
      setCourseGrades(grades);
      
      const gpa = await gradeService.calculateOverallGPA(courses, assignments);
      setOverallGPA(gpa);
    } catch (error) {
      console.error("Failed to calculate grades:", error);
    }
  };

  const handleScoreUpdate = async (assignmentId, score) => {
    try {
      await assignmentService.update(assignmentId, { 
        score: score ? parseFloat(score) : null 
      });
      
      // Update local state
      setAssignments(prev => prev.map(a => 
        a.Id === assignmentId ? { ...a, score: score ? parseFloat(score) : null } : a
      ));
      
      toast.success("Score updated!");
    } catch (error) {
      toast.error("Failed to update score");
    }
  };

  const getSelectedCourseAssignments = () => {
    if (!selectedCourse) return [];
    return assignments.filter(a => a.courseId === selectedCourse);
  };

  const getGradeByCategory = (courseId, category) => {
    const courseAssignments = assignments.filter(a => 
      a.courseId === courseId.toString() && 
      a.category === category && 
      a.score !== null
    );

    if (courseAssignments.length === 0) return 0;

    const average = courseAssignments.reduce((sum, a) => 
      sum + (a.score / a.maxScore * 100), 0
    ) / courseAssignments.length;

    return average;
  };

  const selectedCourseData = courses.find(c => c.Id.toString() === selectedCourse);
  const selectedCourseAssignments = getSelectedCourseAssignments();

  if (loading) return <Loading className="p-6" />;
  if (error) return <Error message={error} onRetry={loadData} />;

  if (courses.length === 0) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <Empty
          title="No courses available"
          message="Add courses first to start tracking grades"
          actionText="Add Course"
          icon="BookOpen"
        />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Grades</h1>
          <p className="text-gray-600 mt-1">
            Track your academic performance and calculate GPA
          </p>
        </div>
      </div>

      {/* Overall Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 card-shadow text-center">
          <ApperIcon name="Award" className="mx-auto text-accent mb-2" size={32} />
          <div className="text-3xl font-bold bg-gradient-to-r from-accent to-yellow-500 bg-clip-text text-transparent">
            {overallGPA.toFixed(2)}
          </div>
          <p className="text-gray-600">Overall GPA</p>
        </div>
        
        <div className="bg-white rounded-xl p-6 card-shadow text-center">
          <ApperIcon name="BookOpen" className="mx-auto text-primary mb-2" size={32} />
          <div className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            {courses.length}
          </div>
          <p className="text-gray-600">Active Courses</p>
        </div>
        
        <div className="bg-white rounded-xl p-6 card-shadow text-center">
          <ApperIcon name="CheckCircle" className="mx-auto text-success mb-2" size={32} />
          <div className="text-3xl font-bold bg-gradient-to-r from-success to-emerald-500 bg-clip-text text-transparent">
            {assignments.filter(a => a.score !== null).length}
          </div>
          <p className="text-gray-600">Graded Assignments</p>
        </div>
      </div>

      {/* Course Selection */}
      <div className="bg-white rounded-xl card-shadow">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Course Details</h2>
            <div className="w-64">
              <Select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
              >
                {courses.map(course => (
                  <option key={course.Id} value={course.Id}>
                    {course.name}
                  </option>
                ))}
              </Select>
            </div>
          </div>
        </div>

        {selectedCourseData && (
          <div className="p-6">
            {/* Course Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <div className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  {courseGrades[selectedCourseData.Id]?.toFixed(1) || 0}%
                </div>
                <p className="text-gray-600">Current Grade</p>
                <p className="text-sm text-gray-500">
                  {gradeService.getLetterGrade(courseGrades[selectedCourseData.Id] || 0)}
                </p>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {selectedCourseData.credits}
                </div>
                <p className="text-gray-600">Credit Hours</p>
                <p className="text-sm text-gray-500">{selectedCourseData.instructor}</p>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {selectedCourseAssignments.filter(a => a.score !== null).length}
                </div>
                <p className="text-gray-600">Graded</p>
                <p className="text-sm text-gray-500">
                  of {selectedCourseAssignments.length} total
                </p>
              </div>
            </div>

            {/* Grade Categories */}
            {selectedCourseData.gradeWeight && Object.keys(selectedCourseData.gradeWeight).length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Grade Breakdown</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {Object.entries(selectedCourseData.gradeWeight).map(([category, weight]) => {
                    const categoryGrade = getGradeByCategory(selectedCourseData.Id, category);
                    return (
                      <div key={category} className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 capitalize mb-2">
                          {category.replace('_', ' ')}
                        </h4>
                        <div className="text-xl font-bold text-primary">
                          {categoryGrade.toFixed(1)}%
                        </div>
                        <p className="text-sm text-gray-500">{weight}% of grade</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Assignments Table */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Assignments</h3>
              {selectedCourseAssignments.length === 0 ? (
                <Empty
                  title="No assignments found"
                  message="Add assignments for this course to start tracking grades"
                  icon="FileText"
                  className="py-8"
                />
              ) : (
                <div className="bg-gray-50 rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Assignment
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Category
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Score
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Max Points
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Percentage
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {selectedCourseAssignments.map(assignment => {
                          const percentage = assignment.score !== null ? 
                            (assignment.score / assignment.maxScore * 100).toFixed(1) : null;

                          return (
                            <tr key={assignment.Id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="font-medium text-gray-900">
                                  {assignment.title}
                                </div>
                                {assignment.completed && (
                                  <div className="text-sm text-success">Completed</div>
                                )}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 capitalize">
                                  {assignment.category || 'Uncategorized'}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <Input
                                  type="number"
                                  value={assignment.score || ""}
                                  onChange={(e) => handleScoreUpdate(assignment.Id, e.target.value)}
                                  placeholder="--"
                                  min="0"
                                  max={assignment.maxScore}
                                  step="0.1"
                                  className="w-20"
                                />
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                                {assignment.maxScore}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {percentage ? (
                                  <span className={`font-medium ${
                                    parseFloat(percentage) >= 90 ? 'text-success' :
                                    parseFloat(percentage) >= 80 ? 'text-primary' :
                                    parseFloat(percentage) >= 70 ? 'text-warning' : 'text-error'
                                  }`}>
                                    {percentage}%
                                  </span>
                                ) : (
                                  <span className="text-gray-400">--</span>
                                )}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {assignment.score !== null ? (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success/10 text-success">
                                    Graded
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                    Pending
                                  </span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Grades;