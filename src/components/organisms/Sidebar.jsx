import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Sidebar = ({ className }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  const navigation = [
    {
      name: "Dashboard",
      href: "/",
      icon: "Home",
      description: "Overview & quick stats"
    },
    {
      name: "Assignments",
      href: "/assignments",
      icon: "FileText",
      description: "Manage tasks & deadlines"
    },
{
      name: "Calendar",
      href: "/calendar",
      icon: "Calendar",
      description: "View upcoming dates"
    },
    {
      name: "Schedule",
      href: "/schedule",
      icon: "Clock",
      description: "Weekly class schedule"
    },
    {
      name: "Courses",
      href: "/courses",
      icon: "BookOpen",
      description: "Course management"
    },
{
      name: "Grades",
      href: "/grades",
      icon: "Award",
      description: "Track performance"
    },
    {
      name: "Students",
      href: "/students",
      icon: "Users",
      description: "Manage student profiles"
    }
  ];

  return (
    <div className={cn(
      "bg-white border-r border-gray-200 flex flex-col transition-all duration-300",
      isCollapsed ? "w-16" : "w-64",
      className
    )}>
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className={cn("flex items-center space-x-3", isCollapsed && "justify-center")}>
            <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
              <ApperIcon name="GraduationCap" className="text-white" size={20} />
            </div>
            {!isCollapsed && (
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  StudyFlow
                </h1>
                <p className="text-xs text-gray-500">Academic Management</p>
              </div>
            )}
          </div>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200 lg:block hidden"
          >
            <ApperIcon name={isCollapsed ? "ChevronRight" : "ChevronLeft"} size={16} />
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          
          return (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) => cn(
                "flex items-center space-x-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 group",
                isActive
                  ? "bg-gradient-to-r from-primary/10 to-secondary/10 text-primary border-l-4 border-primary"
                  : "text-gray-600 hover:bg-gray-50 hover:text-primary",
                isCollapsed && "justify-center px-2"
              )}
            >
              <ApperIcon 
                name={item.icon} 
                size={20}
                className={cn(
                  "transition-colors duration-200",
                  isActive ? "text-primary" : "text-gray-400 group-hover:text-primary"
                )}
              />
              {!isCollapsed && (
                <div className="flex-1">
                  <span>{item.name}</span>
                  <p className="text-xs text-gray-400 mt-0.5">{item.description}</p>
                </div>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer */}
      {!isCollapsed && (
        <div className="p-4 border-t border-gray-100">
          <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-xl p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center">
                <ApperIcon name="User" className="text-white" size={20} />
              </div>
              <div>
                <p className="font-medium text-gray-900">Student</p>
                <p className="text-xs text-gray-500">Academic Year 2024</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;